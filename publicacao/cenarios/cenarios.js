/* Biblioteca de cenários 1.0.0 — gerenciador de fundos e painel do ambiente.
   Camada de ambientação: não altera banco, sequência, opções, respostas, critérios, nota ou progresso do apoio. */
(()=>{'use strict';
const script=document.currentScript||document.querySelector('script[data-cenario]');
if(!script||window.Cenarios)return;
const base=script.src?new URL('./',script.src).href:new URL(script.dataset.base||'cenarios/',location.href).href;
const id=script.dataset.cenario||'sala-das-palavras',perfil=script.dataset.perfil||'',descricaoSessao=script.dataset.sessao||'';
const CHAVE='arquiteturas:cenarios:estimulos:v1';
const $=sel=>document.querySelector(sel);
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const movimentoReduzido=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const estado={id,perfil,catalogo:null,cenario:null,ativo:false,reduzido:false,camada:null,placa:null,acoes:null,anterior:{}};
function lerPreferencia(){try{return localStorage.getItem(CHAVE)==='1';}catch{return false;}}
function gravarPreferencia(v){try{localStorage.setItem(CHAVE,v?'1':'0');}catch{}}

/* Painel do cenário: nome do ambiente, descrição da sessão e controles. */
function montarPlaca(){
 const placa=node('nav',undefined,'cen-placa');placa.setAttribute('aria-label','Cenário e opções de ambiente');
 const local=node('p',undefined,'cen-local');const pino=node('span','',"cen-pino");pino.setAttribute('aria-hidden','true');
 const nome=node('strong','Ambiente');nome.id='cen-nome';const desc=node('span','');desc.id='cen-desc';
 local.append(pino,nome,desc);
 const acoes=node('div',undefined,'cen-acoes');
 const botao=node('button','Reduzir estímulos','cen-botao');botao.type='button';botao.id='cen-estimulos';botao.setAttribute('aria-pressed','false');
 botao.addEventListener('click',()=>reduzir(!estado.reduzido,true));
 acoes.append(botao);placa.append(local,acoes);
 const atividade=document.getElementById('activity');
 if(atividade)atividade.before(placa);else{const cab=document.querySelector('header');if(cab)cab.after(placa);else document.body.prepend(placa);}
 estado.placa=placa;estado.acoes=acoes;estado.botao=botao;
}

/* Fundo: camada fixa atrás dos painéis, versão desktop/móvel, parallax discreto opcional. */
function aplicar(cenario){
 if(!cenario||cenario.estado!=='disponivel'||!cenario.arquivos)return false;
 const camada=node('div',undefined,'cen-fundo');camada.setAttribute('aria-hidden','true');camada.dataset.cenarioFundo=cenario.id;
 camada.style.setProperty('--cen-img','url("'+base+cenario.arquivos.desktop+'")');
 camada.style.setProperty('--cen-img-movel','url("'+base+(cenario.arquivos.movel||cenario.arquivos.desktop)+'")');
 document.body.prepend(camada);estado.camada=camada;
 const b=document.body;estado.anterior={cor:b.style.getPropertyValue('background-color'),prioridade:b.style.getPropertyPriority('background-color'),imagem:b.style.getPropertyValue('background-image'),prioridadeImagem:b.style.getPropertyPriority('background-image'),cena:b.style.getPropertyValue('--ap-scene')};
 b.style.setProperty('background-color','transparent','important');b.style.setProperty('background-image','none','important');
 b.style.setProperty('--ap-scene','url("'+base+cenario.arquivos.desktop+'")');
 b.dataset.cenario=cenario.id;b.dataset.cenarioEstado='ativo';
 const nome=document.getElementById('cen-nome'),desc=document.getElementById('cen-desc');
 if(nome)nome.textContent=cenario.nome;if(desc)desc.textContent=' · '+(descricaoSessao||cenario.sessao||'');
 estado.ativo=true;animar();return true;
}
let agendado=false;
function deslocar(){agendado=false;if(!estado.camada)return;const teto=(window.innerHeight||800)*0.06;estado.camada.style.transform=estado.camada.classList.contains('cen-animado')?'translateY('+(-Math.min((window.scrollY||0)*0.06,teto)).toFixed(1)+'px)':'';}
function aoRolar(){if(agendado)return;agendado=true;(window.requestAnimationFrame||setTimeout)(deslocar);}
function animar(){if(!estado.camada)return;const permitido=!movimentoReduzido()&&!estado.reduzido;estado.camada.classList.toggle('cen-animado',permitido);document.body.dataset.cenarioAnimacao=permitido?'parallax':'nenhuma';deslocar();}
window.addEventListener('scroll',aoRolar,{passive:true});
if(window.matchMedia){const mq=matchMedia('(prefers-reduced-motion: reduce)');(mq.addEventListener?mq.addEventListener('change',animar):mq.addListener&&mq.addListener(animar));}

/* Menos estímulos: esconde o fundo, desliga animação e acompanha o botão "Menos estímulos" da experiência publicada (body.ap-calm). */
let sincronizando=false;
function reduzir(on,gravar){
 on=!!on;estado.reduzido=on;
 document.body.classList.toggle('cen-reduzido',on);
 if(estado.botao){estado.botao.setAttribute('aria-pressed',String(on));estado.botao.textContent=on?'Mostrar cenário':'Reduzir estímulos';}
 if(document.body.classList.contains('ap-calm')!==on){sincronizando=true;document.body.classList.toggle('ap-calm',on);sincronizando=false;const calmo=document.querySelector('.ap-hero button[aria-pressed]');if(calmo)calmo.setAttribute('aria-pressed',String(on));}
 if(gravar)gravarPreferencia(on);animar();
}
new MutationObserver(()=>{if(sincronizando)return;const calmo=document.body.classList.contains('ap-calm');if(calmo!==estado.reduzido)reduzir(calmo,true);}).observe(document.body,{attributes:true,attributeFilter:['class']});

function perfilAplicado(cenario){const p=perfil||(cenario&&cenario.perfis&&cenario.perfis[0])||'';if(p)document.body.dataset.cenarioPerfil=p;return p;}

async function carregar(){
 let catalogo=null;
 try{const r=await fetch(base+'catalogo.json',{cache:'no-store'});if(r.ok)catalogo=await r.json();}catch{catalogo=null;}
 estado.catalogo=catalogo;const cenario=catalogo&&Array.isArray(catalogo.cenarios)?catalogo.cenarios.find(c=>c.id===id):null;estado.cenario=cenario||null;
 perfilAplicado(cenario);
 if(!aplicar(cenario)){document.body.dataset.cenarioEstado='indisponivel';const nome=document.getElementById('cen-nome');if(nome)nome.textContent=cenario?cenario.nome:'Ambiente';const desc=document.getElementById('cen-desc');if(desc)desc.textContent=descricaoSessao?' · '+descricaoSessao:'';}
 document.dispatchEvent(new CustomEvent('cenarios:pronto',{detail:{id,ativo:estado.ativo}}));
 return estado;
}
function boot(){
 montarPlaca();
 reduzir(lerPreferencia()||document.body.classList.contains('ap-calm'),false);
 estado.pronto=carregar();
}
window.Cenarios={versao:'1.0.0',estado,registrarAcao(botao){if(estado.acoes&&botao)estado.acoes.append(botao);return !!estado.acoes;},reduzir:on=>reduzir(on,true),aplicar,get pronto(){return estado.pronto;}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
