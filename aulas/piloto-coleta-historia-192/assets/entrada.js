/* Entrada obrigatória. Acesso individual nunca entra em URL, log ou código público. */
(() => {
 const endpoint='https://ifyiarwygywoexsflfsx.supabase.co/functions/v1/coleta-educacional',artefato='piloto-coleta-historia-192';
 let resolver,convite='',sessao=null,memoria=new Map();
 const get=k=>{try{return sessionStorage.getItem(k)}catch{return memoria.get(k)||null}},set=(k,v)=>{memoria.set(k,v);try{sessionStorage.setItem(k,v);return true}catch{return false}};
 const ready=new Promise(r=>resolver=r);
 const painel=document.createElement('section');painel.id='entrada-coleta';painel.style.cssText='max-width:680px;margin:5vh auto;padding:24px;border-radius:18px;background:#fff;color:#172535;font:18px/1.5 system-ui;box-shadow:0 8px 40px #0003';
 painel.innerHTML='<h1>Vamos começar sua aula</h1><p>Preencha os quatro dados e o acesso individual recebido do professor. Se precisar, peça ajuda para preencher.</p><p>Suas respostas, tentativas e apoios usados nesta aula serão registrados para acompanhamento pelo professor. Não monitoramos outros sites.</p><form id="entrada-form"><label>Nome da escola<input name="escola" required maxlength="200" autocomplete="off"></label><label>Nome do aluno<input name="aluno" required maxlength="200" autocomplete="off"></label><label>Matéria<input name="materia" required maxlength="120" autocomplete="off"></label><label>Turma<input name="turma" required maxlength="80" autocomplete="off"></label><label>Acesso individual entregue pelo professor<input name="convite" type="password" required minlength="64" maxlength="64" autocomplete="off" spellcheck="false"></label><button type="submit">Conferir dados e entrar</button></form><p id="entrada-status" role="status"></p>';
 const css=document.createElement('style');css.textContent='#entrada-coleta label{display:block;margin:18px 0}#entrada-coleta input{display:block;width:100%;box-sizing:border-box;padding:12px;border:2px solid #758596;border-radius:7px;font:inherit;color:#172535;background:white}#entrada-coleta button,#coleta-barra button{padding:12px;font:inherit;cursor:pointer}#coleta-barra{position:sticky;top:0;z-index:1000;background:#fff;color:#172535;border-bottom:2px solid #267165;padding:12px 20px;font:16px/1.4 system-ui}#coleta-barra p{margin:4px 0}';document.head.append(css);document.body.prepend(painel);
 const form=painel.querySelector('form'),status=painel.querySelector('[role=status]'),button=form.querySelector('button');
 async function api(body){
  const controller=new AbortController(),t=setTimeout(()=>controller.abort(),20000);
  try{const res=await fetch(endpoint,{method:'POST',credentials:'omit',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({...body,artefato,convite}),signal:controller.signal});const data=await res.json();if(!res.ok||data.ok!==true)throw Error(data.mensagem||'Recebimento sem confirmação.');return data;}finally{clearTimeout(t);}
 }
 form.onsubmit=async e=>{e.preventDefault();if(!form.reportValidity())return;button.disabled=true;status.textContent='Conferindo os dados…';
  try{
   const dados=Object.fromEntries(new FormData(form));convite=String(dados.convite).trim();
   const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(convite)))).map(x=>x.toString(16).padStart(2,'0')).join('');
   const k='coleta:acesso:'+digest;let id=get(k);if(!id){id=crypto.randomUUID();set(k,id);}
   const identificacao={escola:String(dados.escola).trim(),aluno:String(dados.aluno).trim(),materia:String(dados.materia).trim(),turma:String(dados.turma).trim()};
   const r=await api({acao:'iniciar',sessao_id:id,identificacao});
   if(r.estado!=='identificado'||r.sessao_id!==id)throw Error('Identificação sem confirmação.');
   sessao=r;window.ColetaEntrada.sessao=r;form.reset();painel.remove();
   const barra=document.createElement('section');barra.id='coleta-barra';const quem=document.createElement('p');quem.textContent=[r.identificacao.aluno,r.identificacao.escola,r.identificacao.turma,r.identificacao.materia,r.ambiente==='teste'?'TESTE TÉCNICO':''].filter(Boolean).join(' · ');
   const estado=document.createElement('p');estado.id='coleta-status';estado.setAttribute('role','status');estado.textContent='Identificação confirmada. Preparando registros.';
   const enviar=document.createElement('button');enviar.textContent='Sincronizar agora';enviar.onclick=()=>window.dispatchEvent(new Event('coleta:sincronizar'));
   const sair=document.createElement('button');sair.textContent='Encerrar meu acesso';sair.onclick=()=>window.ColetaEntrada.encerrar();barra.append(quem,estado,enviar,sair);document.body.prepend(barra);
   document.getElementById('aula-conteudo').hidden=false;document.getElementById('aula-conteudo').inert=false;resolver(r);
  }catch(err){status.textContent=err.name==='AbortError'?'A conexão demorou. Confira a internet e tente novamente.':err.message;}finally{button.disabled=false;}
 };
 window.ColetaEntrada={ready,sessao,api,get,set,encerrar:()=>{window.dispatchEvent(new Event('coleta:encerrar'));}};
})();
