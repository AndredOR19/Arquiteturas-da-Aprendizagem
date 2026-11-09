/* Motor de frases 1.0.0 — sessão 2 opcional do apoio de alfabetização.
   Convite ao terminar a sessão 1; conjunto 1 (imagem ↔ frase); progresso próprio em localStorage.
   Não altera banco, sequência, respostas, critérios, nota, conclusão ou progresso da sessão 1. */
(()=>{'use strict';
const dados=document.getElementById('apoio-dados');if(!dados||window.FrasesApoio)return;
const script=document.currentScript||document.querySelector('script[data-frases]');
const base=script&&script.src?new URL('./',script.src).href:new URL((script&&script.dataset.base)||'cenarios/',location.href).href;
const arquivo=(script&&script.dataset.frases)||'frases-conjunto-1.json';
let total=0;try{total=JSON.parse(dados.textContent).percursos.length;}catch{total=0;}
const CHAVE='arquiteturas:frases:v1:'+location.pathname;
const $=id=>document.getElementById(id);
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const botao=(text,id,cls)=>{const b=node('button',text,cls);b.type='button';if(id)b.id=id;return b;};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const movimentoReduzido=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const TEXTOS={titulo:'Parabéns! Você terminou as {total} atividades!',pergunta:'Quer aprender a formar frases?',apoio:'Agora você pode juntar palavras para contar o que acontece nas imagens.',aceitar:'Quero aprender a formar frases',recusar:'Terminar por hoje'};
const estado={conjunto:null,atual:0,concluidas:new Set(),tentativas:0,erros:0,aberto:false,respondida:false,falas:0};

/* Narração opcional, com o mesmo ajuste do apoio (pt-BR, ritmo lento). */
function falar(texto){const status=$('frases-audio');if(!('speechSynthesis'in window)){if(status)status.textContent='Áudio indisponível. Peça ajuda para ouvir a frase.';return false;}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(texto);u.lang='pt-BR';u.rate=.78;u.onerror=()=>{if(status)status.textContent='Não foi possível reproduzir a voz. Use o texto e peça mediação.';};const vozes=speechSynthesis.getVoices?speechSynthesis.getVoices():[];u.voice=vozes.find(x=>String(x.lang).toLowerCase()==='pt-br')||vozes.find(x=>String(x.lang).toLowerCase().startsWith('pt'))||null;speechSynthesis.speak(u);estado.falas++;if(status)status.textContent='';return true;}catch{if(status)status.textContent='Não foi possível reproduzir a voz. Use o texto e peça mediação.';return false;}}
function parar(){try{window.speechSynthesis&&speechSynthesis.cancel();}catch{}}

/* Progresso da sessão 2: chave própria; nunca toca o estado da sessão 1. */
function carregar(){try{const v=JSON.parse(localStorage.getItem(CHAVE));if(v&&v.versao==='1.0.0'&&Array.isArray(v.concluidas)){estado.concluidas=new Set(v.concluidas);estado.atual=Number.isInteger(v.atual)?v.atual:0;estado.tentativas=v.tentativas||0;}}catch{}}
function salvar(){try{localStorage.setItem(CHAVE,JSON.stringify({versao:'1.0.0',conjunto:estado.conjunto?estado.conjunto.conjunto:1,atual:estado.atual,concluidas:[...estado.concluidas],tentativas:estado.tentativas,atualizado:new Date().toISOString()}));return true;}catch{const p=$('frases-progresso');if(p)p.textContent='O navegador não permitiu guardar o progresso; você pode continuar mesmo assim.';return false;}}
function limpar(){try{localStorage.removeItem(CHAVE);}catch{}estado.concluidas=new Set();estado.atual=0;estado.tentativas=0;}

/* Cena vetorial: lugar (opcional) + pessoa + objeto, com os desenhos da sessão 1. */
function pessoaArte(nome){const c=estado.conjunto,p=(c.personagens||{})[nome]||{},a=c.arte.PESSOA||'';return a.replace('#76a9a1',p.camisa||'#76a9a1').replace('#3d4a4b',p.cabelo||'#3d4a4b');}
function grupo(corpo,x,y,escala){return '<g transform="translate('+x+' '+y+') scale('+escala+')">'+corpo+'</g>';}
function cena(spec,rotulo){const c=estado.conjunto,arte=c.arte||{};const partes=[];let largura=0;
 if(spec.lugar&&arte[spec.lugar]){partes.push(grupo(arte[spec.lugar],largura,30,0.85));largura+=215;}
 partes.push(grupo(pessoaArte(spec.pessoa),largura,10,1));largura+=235;
 if(spec.objeto&&arte[spec.objeto]){partes.push(grupo(arte[spec.objeto],largura,10,1));largura+=240;}
 return '<svg class="cen-cena" viewBox="0 0 '+largura+' 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(rotulo)+'"><ellipse cx="'+(largura/2)+'" cy="184" rx="'+(largura/2-20)+'" ry="9" fill="#264653" opacity=".10"/><g stroke="#264653" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">'+partes.join('')+'</g></svg>';}
function descrever(spec){const n=estado.conjunto.nomes_objetos||{};return [spec.pessoa,spec.objeto?n[spec.objeto]||spec.objeto.toLowerCase():'',spec.lugar?n[spec.lugar]||spec.lugar.toLowerCase():''].filter(Boolean).join(', ');}

/* Convite ao fim da sessão 1 (textos fixos do pedido; a contagem é a real do banco). */
let convite=null;
function mostrarConvite(){if(convite&&convite.isConnected){convite.hidden=false;convite.focus();return convite;}
 convite=node('section',undefined,'card cen-convite');convite.id='convite-frases';convite.setAttribute('aria-labelledby','convite-titulo');convite.tabIndex=-1;
 const selo=node('p','Sessão 1 concluída','cen-selo');
 const titulo=node('h2',TEXTOS.titulo.replace('{total}',String(total)));titulo.id='convite-titulo';
 const pergunta=node('p',TEXTOS.pergunta,'cen-pergunta');const apoio=node('p',TEXTOS.apoio);
 const menu=node('div',undefined,'menu');const sim=botao(TEXTOS.aceitar,'convite-sim','cen-principal'),nao=botao(TEXTOS.recusar,'convite-nao'),ouvir=botao('🔊 Ouvir o convite','convite-ouvir');
 menu.append(sim,nao,ouvir);
 const nota=node('p','Sua conclusão e seu progresso da sessão 1 não mudam. Você também pode começar depois pelo botão "Formar frases".','hint');
 convite.append(selo,titulo,pergunta,apoio,menu,nota);
 ancorar(convite);
 sim.onclick=()=>{convite.hidden=true;abrir();};
 nao.onclick=()=>{convite.hidden=true;parar();const volta=$('back')||$('progress');if(volta){volta.tabIndex=volta.tabIndex||-1;volta.focus({preventScroll:false});}};
 ouvir.onclick=()=>falar(titulo.textContent+' '+TEXTOS.pergunta+' '+TEXTOS.apoio);
 convite.focus();convite.scrollIntoView&&convite.scrollIntoView({behavior:movimentoReduzido()?'auto':'smooth',block:'center'});
 return convite;}
function ancorar(el){const atividade=$('activity');if(!atividade){document.body.append(el);return;}const alvo=atividade.closest('.ap-layout')||atividade;alvo.after(el);}
function observarConclusao(){const fb=$('feedback');if(!fb)return;let visto=false;const checar=()=>{const t=fb.textContent||'';const fim=t.includes('Você terminou este percurso');if(fim&&!visto){visto=true;mostrarConvite();}else if(!fim)visto=false;};new MutationObserver(checar).observe(fb,{childList:true,characterData:true,subtree:true});checar();}

/* Painel da sessão 2. */
let painel=null;
function montarPainel(){if(painel)return painel;painel=node('section',undefined,'card cen-frases');painel.id='frases';painel.setAttribute('aria-labelledby','frases-titulo');painel.tabIndex=-1;painel.hidden=true;ancorar(painel);return painel;}
function cabecalho(sub){const c=estado.conjunto;const h=node('div',undefined,'cen-frases-cabecalho');const selo=node('p','Sessão 2 · Formar frases','cen-selo');const t=node('h2','Conjunto '+c.conjunto+' · '+c.titulo);t.id='frases-titulo';h.append(selo,t);if(sub)h.append(node('p',sub,'hint'));return h;}
function rodape(){const m=node('div',undefined,'menu cen-rodape');const voltar=botao('Voltar às atividades','frases-voltar'),parar=botao('Parar por hoje','frases-parar');voltar.onclick=()=>fechar('voltar');parar.onclick=()=>fechar('parar');m.append(voltar,parar);return m;}
let descricaoAnterior=null;function sinalizar(aberto){const b=$('frases-abrir');if(b)b.setAttribute('aria-expanded',String(aberto));const desc=$('cen-desc');if(!desc)return;if(aberto){if(descricaoAnterior===null)descricaoAnterior=desc.textContent;desc.textContent=' · Sessão 2: formar frases (opcional)';}else if(descricaoAnterior!==null){desc.textContent=descricaoAnterior;descricaoAnterior=null;}}
function abrir(){montarPainel();carregar();estado.aberto=true;document.body.classList.add('cen-sessao2-ativa');sinalizar(true);
 const c=estado.conjunto;if(!c){painel.replaceChildren(node('h2','Formar frases'),node('p','O conjunto de frases ainda não carregou. Verifique a conexão ou tente novamente mais tarde.'),rodape());mostrar();return;}
 const itens=c.atividades;const feitas=itens.filter(a=>estado.concluidas.has(a.id)).length;
 if(feitas>=itens.length){telaFinal();return;}
 if(feitas>0){telaRetomar(feitas);return;}
 telaExemplo();}
function mostrar(){painel.hidden=false;painel.focus();painel.scrollIntoView&&painel.scrollIntoView({behavior:movimentoReduzido()?'auto':'smooth',block:'start'});}
function fechar(modo){parar();if(modo==='parar')salvar();estado.aberto=false;if(painel)painel.hidden=true;document.body.classList.remove('cen-sessao2-ativa');sinalizar(false);const alvo=$('activity')||$('back');if(alvo){alvo.tabIndex=alvo.tabIndex||-1;alvo.focus({preventScroll:false});alvo.scrollIntoView&&alvo.scrollIntoView({behavior:movimentoReduzido()?'auto':'smooth',block:'start'});}}
function telaExemplo(){const c=estado.conjunto,ex=c.exemplo;painel.replaceChildren(cabecalho(c.objetivo));
 const bloco=node('div',undefined,'cen-exemplo');bloco.append(node('h3','1 · Veja um exemplo'));
 const fig=node('div',undefined,'cen-figura');fig.innerHTML=cena(ex.cena,'Exemplo: '+descrever(ex.cena));const frase=node('p',ex.frase,'cen-frase-grande');
 const passos=node('ol');for(const p of ex.passos)passos.append(node('li',p));
 bloco.append(fig,frase,passos);
 const menu=node('div',undefined,'menu');const ouvir=botao('🔊 Ouvir o exemplo','frases-ouvir-exemplo'),comecar=botao('2 · Agora é sua vez: começar','frases-comecar','cen-principal');
 ouvir.onclick=()=>falar(ex.passos.join(' '));comecar.onclick=()=>{estado.atual=0;iniciarAtividade();};menu.append(comecar,ouvir);
 painel.append(bloco,menu,node('p','',"status"),rodape());painel.querySelector('.status').id='frases-audio';mostrar();}
function telaRetomar(feitas){const c=estado.conjunto;painel.replaceChildren(cabecalho('Você parou na frase '+(feitas+1)+' de '+c.atividades.length+'. O progresso ficou guardado neste navegador.'));
 const menu=node('div',undefined,'menu');const cont=botao('Continuar da frase '+(feitas+1),'frases-continuar','cen-principal'),rec=botao('Recomeçar o conjunto','frases-recomecar');
 cont.onclick=()=>{estado.atual=c.atividades.findIndex(a=>!estado.concluidas.has(a.id));iniciarAtividade();};rec.onclick=()=>{limpar();telaExemplo();};menu.append(cont,rec);
 painel.append(menu,node('p','',"status"),rodape());painel.querySelector('.status').id='frases-audio';mostrar();}
function telaFinal(){const c=estado.conjunto;painel.replaceChildren(cabecalho());const t=node('h3','Você terminou o conjunto '+c.conjunto+': '+c.titulo+'!');const p=node('p','As '+c.atividades.length+' frases deste conjunto estão concluídas. Os próximos conjuntos chegam em breve: '+(c.proximos_conjuntos||[]).map(x=>x.titulo.toLowerCase()).join(', ')+'.');
 const menu=node('div',undefined,'menu');const rec=botao('Repetir este conjunto','frases-recomecar');rec.onclick=()=>{limpar();telaExemplo();};menu.append(rec);
 painel.append(t,p,menu,node('p','',"status"),rodape());painel.querySelector('.status').id='frases-audio';falar(t.textContent);mostrar();}

function iniciarAtividade(){const c=estado.conjunto,itens=c.atividades;if(estado.atual<0||estado.atual>=itens.length){telaFinal();return;}
 const a=itens[estado.atual];estado.respondida=false;estado.erros=0;const n=estado.atual+1;
 painel.replaceChildren(cabecalho());
 const passo=node('p','Frase '+n+' de '+itens.length,'hint');passo.id='frases-passo';
 const comando=node('h3',a.tipo==='imagem-frase'?'Veja a imagem. Qual frase combina com ela?':'Ouça ou leia a frase. Qual imagem combina com ela?');comando.id='frases-comando';
 const figura=node('div',undefined,'cen-figura');figura.id='frases-cena';
 const frase=node('p','','cen-frase-grande');frase.id='frases-texto';
 if(a.tipo==='imagem-frase')figura.innerHTML=cena(a.cena,'Imagem: '+descrever(a.cena));else{figura.hidden=true;frase.textContent=a.frase;}
 const menu=node('div',undefined,'menu');const ouvir=botao(a.tipo==='imagem-frase'?'🔊 Ouvir as frases':'🔊 Ouvir a frase','frases-ouvir'),pista=botao('Ver pista','frases-pista'),exemplo=botao('Ver o exemplo de novo','frases-exemplo');menu.append(ouvir,pista,exemplo);
 const pistaTexto=node('p',a.pista,'cen-pista');pistaTexto.id='frases-pista-texto';pistaTexto.hidden=true;
 const opcoes=node('div',undefined,'choices cen-opcoes');opcoes.id='frases-opcoes';
 const retorno=node('p','Escolha uma opção. Você pode ouvir, pedir pista e tentar de novo; isso não altera sua nota.','status');retorno.id='frases-retorno';retorno.setAttribute('role','status');retorno.setAttribute('aria-live','polite');
 const audio=node('p','','status');audio.id='frases-audio';
 const nav=node('div',undefined,'menu');const proxima=botao(n===itens.length?'Concluir o conjunto':'Próxima frase','frases-proxima','cen-principal');proxima.disabled=true;const repetir=botao('Repetir esta frase','frases-repetir');nav.append(proxima,repetir);
 const progresso=node('p','','hint');progresso.id='frases-progresso';
 painel.append(passo,comando,figura,frase,menu,pistaTexto,opcoes,retorno,audio,nav,progresso,rodape());
 // Ordem das opções: gira por atividade para a resposta não ficar sempre na mesma posição.
 const ordem=a.opcoes.map((o,i)=>i);const giro=estado.atual%3;const girada=ordem.slice(giro).concat(ordem.slice(0,giro));
 girada.forEach((indice,pos)=>{const o=a.opcoes[indice];const b=node('button',undefined,'choice cen-opcao');b.type='button';b.dataset.indice=String(indice);
  if(a.tipo==='imagem-frase'){b.setAttribute('aria-label','Opção '+(pos+1)+': '+o);b.append(node('span',o,'cen-opcao-frase'));}
  else{const d=descrever(o);b.setAttribute('aria-label','Opção '+(pos+1)+': imagem com '+d);const w=node('span',undefined,'cen-opcao-imagem');w.innerHTML=cena(o,'');w.setAttribute('aria-hidden','true');b.append(w,node('span',d,'cen-opcao-legenda'));}
  b.onclick=()=>responder(a,indice,b);opcoes.append(b);});
 ouvir.onclick=()=>{if(a.tipo==='imagem-frase'){const falas=girada.map((indice,pos)=>'Opção '+(pos+1)+': '+a.opcoes[indice]);falar(falas.join('. '));}else falar(a.frase);};
 pista.onclick=()=>{pistaTexto.hidden=false;falar(a.pista);};
 exemplo.onclick=()=>{const ex=c.exemplo;const d=node('div',undefined,'cen-exemplo cen-exemplo-flutuante');d.append(node('h4','Exemplo: '+ex.frase));const f=node('div',undefined,'cen-figura');f.innerHTML=cena(ex.cena,'Exemplo: '+descrever(ex.cena));d.append(f);const fechar=botao('Fechar o exemplo','frases-fechar-exemplo');fechar.onclick=()=>{d.remove();exemplo.focus();};d.append(fechar);comando.after(d);fechar.focus();falar(ex.passos.join(' '));};
 proxima.onclick=()=>{if(!estado.respondida)return;estado.atual++;salvar();if(estado.atual>=itens.length)telaFinal();else iniciarAtividade();};
 repetir.onclick=()=>iniciarAtividade();
 atualizarProgresso();mostrar();}
function atualizarProgresso(){const c=estado.conjunto,p=$('frases-progresso');if(p)p.textContent='Frases concluídas: '+estado.concluidas.size+' de '+c.atividades.length+'. O progresso fica guardado neste navegador; a sessão 1 não muda.';}
function responder(a,indice,b){if(estado.respondida)return;const retorno=$('frases-retorno');estado.tentativas++;
 if(indice===a.correta){estado.respondida=true;estado.concluidas.add(a.id);b.classList.add('cen-certa');b.setAttribute('aria-pressed','true');
  for(const x of $('frases-opcoes').querySelectorAll('button'))x.disabled=x!==b;
  retorno.textContent='Isso! '+a.frase+' Leia ou ouça de novo e siga quando quiser.';$('frases-proxima').disabled=false;salvar();atualizarProgresso();falar('Isso! '+a.frase);$('frases-proxima').focus();}
 else{estado.erros++;b.classList.add('cen-errada');b.setAttribute('aria-pressed','false');const pista=$('frases-pista-texto');pista.hidden=false;
  let texto='Ainda não. '+a.pista;
  if(estado.erros>=2){const certa=[...$('frases-opcoes').querySelectorAll('button')].find(x=>Number(x.dataset.indice)===a.correta);if(certa){certa.classList.add('cen-indicada');certa.setAttribute('aria-describedby','frases-retorno');texto+=' A opção marcada é a que combina: '+a.frase;}}
  retorno.textContent=texto;falar(texto);}}

/* Entrada pela placa do cenário (começar depois, sem repetir a sessão 1). */
function entrada(){const b=botao('Formar frases · sessão 2','frases-abrir','cen-botao');b.setAttribute('aria-describedby','frases-abrir-ajuda');b.setAttribute('aria-expanded','false');b.onclick=()=>{if(estado.aberto){fechar('voltar');return;}abrir();};
 if(!(window.Cenarios&&window.Cenarios.registrarAcao(b))){const barra=node('div',undefined,'menu cen-entrada');barra.append(b);const atividade=$('activity');if(atividade)atividade.before(barra);else document.body.prepend(barra);}
 const ajuda=node('span','Opcional. Pode começar depois de terminar as atividades ou quando quiser; a sessão 1 continua igual.','cen-visualmente-oculto');ajuda.id='frases-abrir-ajuda';b.after(ajuda);}

async function carregarConjunto(){try{const r=await fetch(base+arquivo,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);const c=await r.json();if(!c||!Array.isArray(c.atividades)||!c.atividades.length||!c.arte)throw new Error('conjunto inválido');estado.conjunto=c;if(c.convite)Object.assign(TEXTOS,c.convite);}catch(e){estado.conjunto=null;estado.erro=String(e&&e.message||e);}
 document.dispatchEvent(new CustomEvent('frases:pronto',{detail:{carregado:!!estado.conjunto}}));return estado.conjunto;}
function boot(){carregar();observarConclusao();entrada();estado.pronto=carregarConjunto();}
window.FrasesApoio={versao:'1.0.0',estado,textos:TEXTOS,abrir,fechar,mostrarConvite,progresso(){return {conjunto:estado.conjunto?estado.conjunto.conjunto:null,concluidas:[...estado.concluidas],tentativas:estado.tentativas,atual:estado.atual};},get pronto(){return estado.pronto;}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
