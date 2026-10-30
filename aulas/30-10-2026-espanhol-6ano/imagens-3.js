(function(){
'use strict';
const script=document.currentScript;
const aula=script?.dataset.learningKey;
const cfg=window.ImageLearningContents?.[aula];
if(!cfg||document.getElementById('image-learning'))return;
const key='aa:imagens:1:'+aula;
const fresh=()=>({versao:'1.0.0',vistos:[],tentativas:[],pistas:[],audios_solicitados:[],completos:[],limite:false});
let vozPedido=0;
let state=fresh(),somDisponivel=typeof window.speechSynthesis?.speak==='function'&&typeof window.SpeechSynthesisUtterance==='function';
try{const saved=JSON.parse(sessionStorage.getItem(key));if(saved?.versao==='1.0.0'&&['vistos','tentativas','pistas','audios_solicitados','completos'].every(k=>Array.isArray(saved[k])))state=saved;}catch{}
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const box=el('details',null,'panel image-learning');box.id='image-learning';
const summary=el('summary','Aprender com imagens e áudio');
const body=el('div',null,'il-body');box.append(summary,body);
const heading=el('h2','Veja, ouça e faça relações');
const intro=el('p','Explore as cenas desta aula. Toque nas imagens para ouvir. Você pode usar este apoio sem digitar e voltar à aula quando quiser.');
const topic=el('p',cfg.tema,'il-topic');
const voiceStatus=el('p',somDisponivel?'Áudio disponível pelo navegador. Use fones quando possível.':'Voz indisponível neste navegador. Explore as imagens com a mediação do professor.','il-notice');voiceStatus.id='il-voice-status';voiceStatus.setAttribute('role','status');
const stop=el('button','Parar áudio','btn');stop.type='button';stop.id='il-stop';stop.onclick=()=>{vozPedido++;window.speechSynthesis?.cancel();};
const hear=el('button','Ouvir como usar','btn');hear.type='button';hear.id='il-instructions';
const controls=el('div',null,'il-controls');controls.append(hear,stop);
const stage=el('div',null,'il-stage');stage.id='il-stage';
const feedback=el('p',null,'il-feedback');feedback.id='il-feedback';feedback.setAttribute('role','status');
const progress=el('p',null,'il-notice');progress.id='il-progress';
const returnButton=el('button','Voltar à aula','btn');returnButton.type='button';returnButton.onclick=()=>{vozPedido++;window.speechSynthesis?.cancel();box.open=false;entry.focus();};
const reset=el('button','Apagar registro deste apoio','btn');reset.type='button';reset.onclick=()=>{if(confirm('Apagar somente as tentativas deste apoio? As respostas da aula serão preservadas.')){state=fresh();save();observe();}};
body.append(heading,topic,intro,controls,voiceStatus,stage,feedback,progress,returnButton,reset);
const entry=el('button',null,'btn il-entry');entry.id='image-learning-open';entry.type='button';entry.setAttribute('aria-controls',box.id);entry.setAttribute('aria-expanded','false');
const mini=window.ImageLearningScene('observar','Ver uma imagem e ouvir sua explicação');mini.setAttribute('aria-hidden','true');entry.append(mini,el('span','Aprender com imagens e áudio'));
const title=document.getElementById('title')||document.querySelector('main h1')||document.querySelector('h1');
const dynamicRoot=document.querySelector('main#main');
if(dynamicRoot){
 entry.classList.add('il-outside-root');box.classList.add('il-outside-root');dynamicRoot.before(entry,box);
}else{
 if(title)title.before(entry);else(document.querySelector('main')||document.body).prepend(entry);
 const anchor=document.getElementById('text-fold')||document.getElementById('text')||document.getElementById('explore')||document.getElementById('mission');
 if(anchor)anchor.before(box);else entry.after(box);
}
function save(){try{sessionStorage.setItem(key,JSON.stringify(state));}catch{voiceStatus.textContent='Registro apenas na memória desta página. As imagens continuam disponíveis.';}progress.textContent=`Cenas exploradas: ${state.vistos.length}/${cfg.conceitos.length}. Tentativas neste apoio: ${state.tentativas.length}. Este treino não altera a nota da aula.`;}
function record(field,value){if(state[field].length<200)state[field].push(value);else{state.limite=true;voiceStatus.textContent='Limite de registros deste apoio atingido. Você pode continuar usando as imagens.';}save();}
function speak(text,id,after){
 window.stopSpanishAudio?.();
 if(!somDisponivel){voiceStatus.textContent='Voz indisponível. Use as cenas com a mediação do professor.';return false;}
 try{
  const pedido=++vozPedido;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='pt-BR';
  const voices=window.speechSynthesis.getVoices();const selected=document.getElementById('voiceSelect')?.selectedOptions?.[0]?.textContent||'';
  u.voice=voices.find(v=>selected.includes(v.name))||voices.find(v=>/^pt[-_]BR$/i.test(v.lang))||voices.find(v=>/^pt/i.test(v.lang))||null;
  const rate=Number(document.getElementById('rate')?.value||.9);u.rate=Math.min(1.3,Math.max(.6,rate));
  u.onend=()=>{if(pedido===vozPedido&&typeof after==='function')after();};
  u.onerror=()=>{voiceStatus.textContent='Não foi possível reproduzir a voz. Tente ouvir novamente ou peça mediação ao professor.';};
  window.speechSynthesis.speak(u);record('audios_solicitados',{id,at:new Date().toISOString()});return true;
 }catch{voiceStatus.textContent='O navegador não conseguiu iniciar a voz. Peça mediação ao professor.';return false;}
}
hear.onclick=()=>speak('Veja as cenas. Toque em cada imagem para ouvir a palavra e uma explicação. Depois, escolha uma imagem para a palavra que você ouvir. Não é preciso digitar.','instrucoes');
entry.onclick=()=>{box.open=true;entry.setAttribute('aria-expanded','true');box.scrollIntoView({behavior:'auto',block:'start'});hear.focus();hear.click();};
box.addEventListener('toggle',()=>entry.setAttribute('aria-expanded',String(box.open)));
let modo='observar',targetIndex=0,correct=false,hintCount=0;
const shuffle=a=>a.map(x=>({x,r:Math.random()})).sort((a,b)=>a.r-b.r).map(o=>o.x);
function word(c){const w=el('strong',null,'il-word');w.append(el('span',c.palavra[0],'il-initial'),document.createTextNode(c.palavra.slice(1)));return w;}
function observe(){
 modo='observar';stage.replaceChildren();feedback.textContent='Toque nas cenas para conhecer as palavras e suas relações.';
 stage.append(el('h3','1 · Entender a aula por imagens e voz'));
 const relation=el('div',null,'il-relations');
 for(const step of cfg.sequencia){const c=cfg.conceitos.find(c=>c.id===step.id);const cell=el('div',null,'il-relation');cell.dataset.step=c.id;cell.append(window.ImageLearningScene(c.imagem,c.descricao),word(c));relation.append(cell);}
 const explain=el('button','Ouvir a explicação da aula com imagens','btn primary');explain.type='button';explain.id='il-explain';
 explain.onclick=()=>{
  const steps=cfg.sequencia;
  function narrate(i){if(i>=steps.length)return;const step=steps[i];relation.querySelectorAll('[data-step]').forEach(n=>n.classList.toggle('il-speaking',n.dataset.step===step.id));feedback.textContent=step.fala;speak(step.fala,'relacao-'+step.id,()=>narrate(i+1));}
  narrate(0);
 };
 stage.append(explain,relation,el('h3','Explore cada palavra'));
 const selected=el('div',null,'il-selected');selected.id='il-selected';
 const initial=el('button','Ouvir a palavra e sua letra inicial','btn');initial.type='button';initial.id='il-initial';initial.hidden=true;

 const grid=el('div',null,'il-grid');
 const begin=el('button','2 · Reconhecer uma palavra','btn primary');begin.id='il-start';begin.type='button';begin.disabled=state.vistos.length<cfg.conceitos.length;
 for(const c of cfg.conceitos){
  const b=el('button',null,'il-card');b.type='button';b.dataset.conceito=c.id;b.setAttribute('aria-label','Ouvir '+c.palavra+'. '+c.frase);
  b.append(window.ImageLearningScene(c.imagem,c.descricao),word(c),el('span',c.frase,'il-sentence'));
  b.onclick=()=>{grid.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');
   if(!state.vistos.includes(c.id))state.vistos.push(c.id);save();speak(c.descricao+' '+c.palavra+'. '+c.frase,'conceito-'+c.id);selected.replaceChildren(window.ImageLearningScene(c.imagem,c.descricao),word(c),el('p',c.frase));if(c.espanhol){const es=el('button','Ouvir expressão em espanhol','btn');es.type='button';es.onclick=()=>{if(typeof window.speakSpanish==='function')window.speakSpanish(c.espanhol);else voiceStatus.textContent='Retome o modelo em espanhol com o professor.';};selected.append(es);}initial.hidden=false;initial.onclick=()=>speak(c.palavra+'. A palavra '+c.palavra+' começa com a letra '+c.palavra[0]+'. Veja essa letra destacada no início da palavra.','letra-'+c.id);feedback.textContent=c.palavra+' · '+c.frase;begin.disabled=state.vistos.length<cfg.conceitos.length;};
  grid.append(b);
 }
 begin.onclick=()=>{targetIndex=0;modo='reconhecer';exercise();};stage.append(grid,selected,initial,begin);save();
}
function exercise(){
 correct=false;hintCount=0;stage.replaceChildren();
 const transfer=modo==='aplicar';const target=transfer?cfg.conceitos.find(c=>c.id===cfg.aplicacao.correto):cfg.conceitos[targetIndex];
 const instruction=transfer?cfg.aplicacao.pergunta:'Ouça a palavra '+target.palavra+'. Qual imagem corresponde a essa palavra?';
 stage.append(el('h3',transfer?'3 · Usar a relação em outra cena':`2 · Reconhecer ${targetIndex+1} de ${cfg.conceitos.length}`));
 const prompt=el('p',instruction,'il-command');prompt.id='il-command';stage.append(prompt);
 const listen=el('button','Ouvir a pergunta','btn');listen.type='button';listen.id='il-listen';listen.onclick=()=>speak(instruction,'pergunta-'+modo+'-'+target.id);stage.append(listen);
 if(!transfer)stage.append(el('p',target.palavra,'il-word il-target'));
 const hint=el('button','Ouvir e ver uma pista','btn');hint.type='button';hint.id='il-hint';hint.onclick=()=>{hintCount++;record('pistas',{etapa:modo,alvo:target.id,at:new Date().toISOString()});const dica=transfer?target.frase:target.descricao+' '+target.frase;feedback.textContent=dica;speak(target.palavra+'. '+dica,'pista-'+target.id);};stage.append(hint);
 const choices=shuffle([target,...shuffle(cfg.conceitos.filter(c=>c.id!==target.id)).slice(0,2)]);
 const grid=el('div',null,'il-grid il-choices');
 const next=el('button',transfer?'Concluir este apoio':'Continuar','btn primary');next.type='button';next.id='il-next';next.disabled=true;
 for(const c of choices){
  const b=el('button',null,'il-card il-choice');b.type='button';b.dataset.choice=c.id;b.setAttribute('aria-label','Escolher cena: '+c.frase);
  b.append(window.ImageLearningScene(c.imagem,c.frase,transfer));
  b.onclick=()=>{
   if(correct)return;const ok=c.id===target.id;
   record('tentativas',{etapa:modo,alvo:target.id,escolha:c.id,correta:ok,pistas_antes:hintCount,at:new Date().toISOString()});
   b.dataset.resultado=ok?'correta':'rever';
   const msg=ok?(transfer?cfg.aplicacao.explicacao:target.palavra+'. '+target.frase):'Essa cena mostra '+c.palavra+'. Observe as outras imagens ou use a pista.';
   feedback.textContent=msg;speak(msg,'retorno-'+c.id);
   if(ok){correct=true;grid.querySelectorAll('button').forEach(x=>x.disabled=true);next.disabled=false;}
  };grid.append(b);
 }
 next.onclick=()=>{if(!correct)return;if(transfer){if(!state.completos.includes('aplicacao'))state.completos.push('aplicacao');save();stage.replaceChildren(el('h3','Você explorou as palavras e suas relações.'),el('p','Conte ou mostre ao professor uma relação que percebeu. Você pode voltar às imagens ou continuar a aula.'));const back=el('button','Explorar as imagens novamente','btn');back.type='button';back.onclick=observe;stage.append(back);feedback.textContent='Este apoio não certifica leitura ou domínio completo do tema e não altera a nota.';speak('Você explorou as palavras e suas relações. Mostre ao professor uma relação que percebeu.','fim');}
 else if(++targetIndex<cfg.conceitos.length)exercise();else{if(!state.completos.includes('reconhecimento'))state.completos.push('reconhecimento');modo='aplicar';save();exercise();}};
 const back=el('button','Voltar às imagens','btn');back.type='button';back.onclick=observe;
 stage.append(grid,next,back);feedback.textContent='Escolha uma cena. Você pode ouvir novamente e usar a pista.';
 listen.click();
}
const report=()=>['APRENDER COM IMAGENS E ÁUDIO','Versão do apoio: 1.0.0 | Tema: '+cfg.tema,'Cenas exploradas: '+state.vistos.join(', '),'Áudios solicitados (não comprova escuta): '+state.audios_solicitados.length,'Treino separado da nota. Não é diagnóstico ou certificação de leitura.',JSON.stringify({tentativas:state.tentativas,pistas:state.pistas,completos:state.completos,limite:state.limite})].join('\n');
window.ImageLearning={version:'1.0.0',aula,snapshot:()=>JSON.parse(JSON.stringify(state)),report};
function attachReport(){
 if(typeof window.fullReport!=='function')return false;
 const base=window.fullReport;window.fullReport=function(...args){const text=base.apply(this,args);if(typeof text!=='string'||text.startsWith('Resultado ainda não liberado.'))return text;return text+'\n\n'+report();};return true;
}
if(!attachReport()){let tries=0;const timer=setInterval(()=>{if(attachReport()||++tries>100)clearInterval(timer);},100);}
document.addEventListener('click',e=>{if(['mute','stopVoice'].includes(e.target.id))vozPedido++;});
window.addEventListener('pagehide',()=>{vozPedido++;window.speechSynthesis?.cancel();});
observe();
})();
