/* O apoio não leitor abre a aula associativa anterior, sem navegação RPG. */
(()=>{'use strict';const A=window.AulaCentralGEI;if(!A)return;const C=A.content;
function open(){const url=new URL('apoio/',location.href);url.searchParams.set('materia',C.subject);url.searchParams.set('tema',C.title);url.searchParams.set('voltar','../');location.assign(url.href);}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const support=b.dataset.rota==='apoio'||(b.closest('[data-mapa-rotas]')&&b.textContent.trim()==='Imagens, palavras e áudio');if(!support)return;e.preventDefault();e.stopImmediatePropagation();open();},true);
const b=document.querySelector('[data-rota="apoio"]');if(b){b.setAttribute('aria-label','Imagens, palavras e áudio: abrir apoio de associações, sem caminhar no jogo');b.dataset.apoioRelacional='apoio/';}
// Conservar os registros da sessão anterior sem reabrir o jogo inadequado ao apoio.
if(A.getState().route==='apoio'){A.getState().route='principal';A.save();open();}
})();

