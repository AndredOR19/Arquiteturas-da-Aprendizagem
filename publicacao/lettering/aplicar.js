/* Apresentação opcional. Não modifica respostas, IDs, critérios ou chaves das aulas. */
(()=>{'use strict';
if(document.getElementById('lettering-simple'))return;
document.documentElement.dataset.schoolLettering='1.0.0';
const first=document.querySelector('main .panel');if(!first)return;
const tools=document.createElement('div');tools.className='lettering-tools';
const toggle=document.createElement('button');toggle.id='lettering-simple';toggle.className='btn';toggle.type='button';toggle.setAttribute('aria-pressed','false');toggle.textContent='Leitura simples';
const help=document.createElement('small');help.textContent='Se este visual incomodar, troque para leitura simples. O conteúdo e suas respostas continuam iguais.';help.id='lettering-help';toggle.setAttribute('aria-describedby',help.id);tools.append(toggle,help);
const title=first.querySelector('h1');if(title)title.before(tools);else first.prepend(tools);
const sheet=document.createElement('section');sheet.className='lettering-sheet';sheet.setAttribute('aria-label','Mapa das relações da aula');
sheet.innerHTML=`<p class="lettering-sheet-label">Mapa da aula · quatro relações para investigar</p><div class="lettering-network"><svg class="lettering-links" viewBox="0 0 900 320" preserveAspectRatio="none" aria-hidden="true"><path d="M400 140C310 140 330 60 190 60" stroke="#376e96"/><path d="M500 140C590 140 580 60 710 60" stroke="#4f7c3c"/><path d="M400 200C310 200 330 270 190 270" stroke="#844d8b"/><path d="M500 200C590 200 580 270 710 270" stroke="#aa6430"/></svg><div class="lettering-book"><strong class="lettering-book-title">Cidadania<br>em construção</strong><p>Direitos, informação<br>e participação</p></div><div class="lettering-note" data-branch="rights"><strong class="lettering-ribbon">Direitos</strong><p>A Constituição reconhece direitos. É preciso examinar as condições de acesso.</p></div><div class="lettering-note" data-branch="participation"><strong class="lettering-ribbon">Participação</strong><p>Voto, organização e diálogo são caminhos para apresentar demandas.</p></div><div class="lettering-note" data-branch="information"><strong class="lettering-ribbon">Informação</strong><p>Autoria, data e documentos ajudam a verificar uma afirmação.</p></div><div class="lettering-note" data-branch="action"><strong class="lettering-ribbon">Acompanhamento</strong><p>Uma demanda precisa de resposta e de verificação do que mudou.</p></div></div><p class="lettering-caption">O direito escrito precisa de condições para ser vivido. Investigue como fontes, participação e acompanhamento se relacionam com esse processo.</p>`;
const metadata=first.querySelector('.metadata');if(metadata)metadata.before(sheet);else first.append(sheet);
toggle.setAttribute('aria-controls','lettering-map');sheet.id='lettering-map';
toggle.onclick=()=>{const simple=document.body.dataset.letteringSimple!=='true';document.body.dataset.letteringSimple=String(simple);toggle.setAttribute('aria-pressed',String(simple));toggle.textContent=simple?'Voltar ao lettering escolar':'Leitura simples';};
const newVersion='Lettering Digital escolar/pedagógico 1.0.0';
function appendVisualReport(text){return text+'\n\nAPRESENTAÇÃO VISUAL\n'+newVersion+'\nLeitura simples: '+(document.body.dataset.letteringSimple==='true'?'ativada':'desativada')+'\nAjuste de apresentação não altera respostas ou nota.';}
// Acrescenta informação à saída existente sem mudar a condição de liberação.
if(typeof window.fullReport==='function'){const original=window.fullReport;window.fullReport=function(){const text=original.apply(this,arguments);return text.includes('Resultado ainda não liberado')?text:appendVisualReport(text);};}
else if(typeof window.report==='function'){const original=window.report;window.report=function(){return appendVisualReport(original.apply(this,arguments));};}
})();
