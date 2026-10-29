import './contrato.js';
const uuid=()=>crypto.randomUUID();
export function criarColetaEventos(config, ambiente=globalThis){
  if(config.autorizado!==true)throw Error('Coleta não autorizada para esta aplicação.');
  const url=new URL(config.webhook);if(url.protocol!=='https:')throw Error('Webhook deve usar HTTPS.');
  if(!/^[a-f0-9]{64}$/.test(config.convite||''))throw Error('Convite individual inválido.');
  const base={schema_version:'eventos-1.0.0',ambiente:config.ambiente||'teste',aula:config.aula,estudante:{codigo:config.codigo}};
  EventosContrato.validar({...base,batch_id:uuid(),sessao_id:uuid(),eventos:[{id:uuid(),sequencia:1,ocorrido_em:new Date().toISOString(),tipo:'inicio',dados:{}}]});
  const key='arquiteturas:eventos:v1:'+base.ambiente+':'+base.aula.id+':'+base.aula.versao+':'+config.codigo;
  let state={sessao_id:uuid(),sequencia:0,fila:[],pendente:null};
  try{const saved=ambiente.sessionStorage?.getItem(key);if(saved){const s=JSON.parse(saved);if(!Array.isArray(s.fila)||s.fila.length>500||!Number.isInteger(s.sequencia))throw Error();for(const e of s.fila)EventosContrato.validar({...base,sessao_id:s.sessao_id,batch_id:uuid(),eventos:[e]});if(s.pendente)EventosContrato.validar(s.pendente);state=s;}}catch{config.onStatus?.('fila_local_indisponivel');}
  let parado=false,ocupado=false,intervalo=null;
  const status=(s)=>config.onStatus?.(s);
  function salvar(){try{ambiente.sessionStorage?.setItem(key,JSON.stringify(state));}catch{status('fila_apenas_em_memoria');}}
  function registrar(tipo,dados={}){
    if(parado)return false;
    if(state.fila.length>=500){status('fila_cheia');return false;}
    const e={id:uuid(),sequencia:state.sequencia+1,ocorrido_em:new Date().toISOString(),tipo,dados};
    EventosContrato.validar({...base,sessao_id:state.sessao_id,batch_id:uuid(),eventos:[e]});
    state.sequencia++;state.fila.push(e);salvar();status('pendente');return true;
  }
  async function enviar(){
    if(parado||ocupado||!state.fila.length)return false;ocupado=true;
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
    try{
      state.pendente??=EventosContrato.validar({...base,sessao_id:state.sessao_id,batch_id:uuid(),eventos:state.fila.slice(0,20)});salvar();
      const p=state.pendente;
      const response=await ambiente.fetch(url.href,{method:'POST',credentials:'omit',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({token:config.convite,payload:p}),signal:controller.signal});
      const r=await response.json();
      if(!response.ok||r.ok!==true||r.estado!=='recebido'||r.batch_id!==p.batch_id||JSON.stringify(r.ids)!==JSON.stringify(p.eventos.map(e=>e.id)))throw Error('Sem confirmação de gravação.');
      const ids=new Set(r.ids);state.fila=state.fila.filter(e=>!ids.has(e.id));state.pendente=null;salvar();status(state.fila.length?'pendente':'sincronizado');return true;
    }catch{status('pendente_reenvio');return false;}finally{clearTimeout(timeout);ocupado=false;}
  }
  const aoEvento=e=>{try{registrar(e.detail.tipo,e.detail.dados);}catch{status('evento_invalido');}};
  const aoOcultar=()=>{if(ambiente.document?.visibilityState==='hidden')void enviar();};
  ambiente.addEventListener?.('pedagogia:evento',aoEvento);
  ambiente.addEventListener?.('online',enviar);
  ambiente.document?.addEventListener('visibilitychange',aoOcultar);
  intervalo=setInterval(()=>void enviar(),Math.max(5000,config.intervaloMs||15000));
  return {registrar,enviar,pendentes:()=>state.fila.length,parar(){parado=true;clearInterval(intervalo);ambiente.removeEventListener?.('pedagogia:evento',aoEvento);ambiente.removeEventListener?.('online',enviar);ambiente.document?.removeEventListener('visibilitychange',aoOcultar);},apagarFila(){if(ocupado)throw Error('Aguarde o envio em andamento.');state.fila=[];state.pendente=null;salvar();status('fila_apagada');}};
}
