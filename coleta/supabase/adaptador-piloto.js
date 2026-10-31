// Adaptador explícito do piloto 192; não é injetado nas aulas antigas.
function instalarColeta(){
 const entrada=window.ColetaEntrada,sessao=entrada.sessao,k='coleta:fila:'+sessao.sessao_id;
 let fila=[],sequencia=0,pendenteFinal=null,ultimoFingerprint='',ocupado=false,parado=false,apenasMemoria=false;
 const status=msg=>{document.getElementById('coleta-status').textContent=msg+(apenasMemoria?' Atenção: armazenamento desta aba indisponível; não feche antes de sincronizar.':'');};
 try{const old=JSON.parse(entrada.get(k)||'null');if(old){fila=old.fila||[];sequencia=old.sequencia||0;pendenteFinal=old.pendenteFinal;ultimoFingerprint=old.ultimoFingerprint||'';}}catch{status('Não foi possível restaurar pendências. Peça apoio ao professor.');}
 function persistir(){if(!entrada.set(k,JSON.stringify({fila,sequencia,pendenteFinal,ultimoFingerprint})))apenasMemoria=true;}
 function evento(tipo,dados={}){if(parado)return;if(fila.length>=1000){status('Fila cheia. Sincronize antes de continuar.');document.getElementById('aula-conteudo').inert=true;return;}fila.push({id:crypto.randomUUID(),sequencia:++sequencia,tipo,ocorrido_em:new Date().toISOString(),dados});persistir();status('Interações aguardando envio: '+fila.length);}
 const fingerprint=()=>JSON.stringify({records:S.records,experience:S.experience,consults:S.consults,scenes:S.scenes,rating:S.rating,preferencias:window.ReadingPanel?.preferences()||null});
 const sha=async raw=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 async function sincronizar(){
  if(ocupado||parado)return;ocupado=true;
  try{
   while(fila.length){const lote=fila.slice(0,20);const r=await entrada.api({acao:'eventos',sessao_id:sessao.sessao_id,eventos:lote});if(r.estado!=='recebido'||r.sessao_id!==sessao.sessao_id||JSON.stringify(r.ids)!==JSON.stringify(lote.map(e=>e.id)))throw Error('Confirmação dos eventos incompatível.');const ids=new Set(r.ids);fila=fila.filter(e=>!ids.has(e.id));persistir();}
   document.getElementById('aula-conteudo').inert=false;
   if(resultReady()&&!pendenteFinal&&fingerprint()!==ultimoFingerprint){
    pendenteFinal={fingerprint:fingerprint(),payload:{id:crypto.randomUUID(),records:structuredClone(S.records),experience:structuredClone(S.experience),consults:structuredClone(S.consults),scenes:structuredClone(S.scenes),events:structuredClone(S.events),identificacao:sessao.identificacao,preferencias:window.ReadingPanel?.preferences()||null,texto:fullReport()}};persistir();
   }
   if(pendenteFinal){const p=pendenteFinal;const r=await entrada.api({acao:'relatorio',sessao_id:sessao.sessao_id,relatorio:p.payload});if(r.estado!=='recebido'||r.id!==p.payload.id||r.sha256!==await sha(JSON.stringify(p.payload)))throw Error('Relatório sem confirmação correspondente.');ultimoFingerprint=p.fingerprint;pendenteFinal=null;persistir();}
   if(fila.length)status('Há novas interações aguardando envio: '+fila.length);
   else if(resultReady()&&fingerprint()===ultimoFingerprint)status('Relatório final recebido pelo sistema. Interações sincronizadas.');
   else status('Interações recebidas pelo sistema. '+(resultReady()?'Alterações do relatório aguardando envio.':'Atividade em andamento; relatório final ainda não concluído.'));
  }catch(e){status('Envio pendente. '+(e.name==='AbortError'?'Confira a internet e tente novamente.':e.message)+' Não feche esta aba; use Sincronizar agora.');}finally{ocupado=false;}
 }
 const logOriginal=log;log=function(type,detail=''){
  logOriginal(type,detail);
  if(type==='acerto'||type==='revisao'){const a=S.records[index].attempts.at(-1);evento('tentativa',{item:index+1,opcao:a.option,correta:a.correct,pistas_antes:a.hintsBefore});if(a.correct)evento('conclusao_etapa',{item:index+1});}
  else if(type==='pista')evento('pista',{item:index+1,nivel:S.records[index].hints});
  else if(type==='consulta')evento('consulta',{termo:String(detail).slice(0,100)});
  else if(type==='voz')evento('audio',{acao:'solicitar',item:index+1});
  else if(['pagina_oculta','retorno_visivel'].includes(type))evento('visibilidade',{visivel:type==='retorno_visivel'});
  else if(type==='experiencia_confirmada'){evento('avaliacao',{confirmada:true});queueMicrotask(sincronizar);}
 };
 // O log inicial ocorre antes do adaptador; registrar entrada agora, uma vez por carga.
 evento('inicio',{acao:'entrada_ou_retorno'});
 const intervalo=setInterval(sincronizar,15000);
 window.addEventListener('online',sincronizar);window.addEventListener('coleta:sincronizar',sincronizar);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)void sincronizar();});
 window.addEventListener('beforeunload',e=>{if(fila.length||pendenteFinal){e.preventDefault();e.returnValue='';}});
 window.addEventListener('coleta:encerrar',async()=>{
  await sincronizar();if(ocupado){status('Aguarde o envio em andamento antes de encerrar.');return;}
  if(fila.length||pendenteFinal||(resultReady()&&fingerprint()!==ultimoFingerprint)){status('Ainda há dados pendentes. Sincronize ou baixe o relatório antes de sair.');if(!confirm('Há dados sem confirmação. Encerrar apagará as pendências desta aba. Deseja encerrar mesmo assim?'))return;}
  else if(!confirm('Encerrar seu acesso e apagar os dados temporários desta aba? Os dados recebidos permanecem com o professor.'))return;
  parado=true;clearInterval(intervalo);stop();resetting=true;sessionStorage.removeItem(key);sessionStorage.removeItem(k);fila=[];pendenteFinal=null;location.reload();
 });
 void sincronizar();
}
