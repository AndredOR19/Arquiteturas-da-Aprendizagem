const fs=require('fs'),assert=require('assert/strict'),{JSDOM,VirtualConsole}=require('jsdom');
const root=process.argv[2];
function openSupport(saved){let errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(fs.readFileSync(root+'/apoio/index.html','utf8'),{url:'https://teste.example/apoio/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){if(saved)for(const[k,v]of Object.entries(saved))w.localStorage.setItem(k,v);}});let w=dom.window;let el=w.document.createElement('script');el.textContent=fs.readFileSync(root+'/apoio/apoio.js','utf8');w.document.body.append(el);return{dom,w,errors};}
let {dom,w,errors}=openSupport();let U=w.ApoioInclusivoV2,$=id=>w.document.getElementById(id);assert(U);assert.equal(U.content.phases.associacoes.length,96);$('phase2').click();assert.equal(U.report().fase,'associacoes');let count=0;
for(const phase of ['associacoes','frases']){
 if(phase==='frases')$('start-phrases').click();
 for(const t of U.content.phases[phase]){
  assert.equal(U.current().id,t.id);
  if(t.kind==='order'){for(const n of t.correct)$('choices').querySelector('[data-option="'+n+'"]').click();$('check').click();}
  else $('choices').querySelector('[data-option="'+t.correct+'"]').click();
  assert.equal($('next').disabled,false,t.id);$('next').click();count++;
 }
 assert.equal(U.report().estado,'concluido');assert.equal(U.report().concluidas,96);
 if(phase==='associacoes')assert.equal($('invite').hidden,false);
}
assert.equal(U.states.associacoes.done.length,96);assert.equal(U.states.frases.done.length,96);const saved={...w.localStorage};assert.equal(errors.length,0);dom.window.close();({dom,w,errors}=openSupport(saved));assert.equal(w.ApoioInclusivoV2.states.frases.done.length,96);dom.window.close();
console.log('Apoio: 192 atividades, convite, bloqueio antecipado, fases independentes e recarga aprovados.');
// Execute the real central game in a DOM harness. Canvas rendering is mocked only here.
function openMain(){let errors=[],frame;const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));let dom=new JSDOM(fs.readFileSync(root+'/index.html','utf8'),{url:'https://teste.example/aula/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.ResizeObserver=class{observe(){}disconnect(){}};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});w.requestAnimationFrame=cb=>(frame=cb,1);w.cancelAnimationFrame=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};}});let w=dom.window;for(const file of ['gei.js','missoes.js','conteudo.js','representacoes.js','clareza.js','aula.js','complementos.js','solo-lab.js']){const el=w.document.createElement('script');el.textContent=fs.readFileSync(root+'/assets/'+file,'utf8');w.document.body.append(el);}w.AulaClareza.boot();return{dom,w,errors};}
({dom,w,errors}=openMain());let A=w.AulaCentralGEI,C=A.content;assert(A);assert.deepEqual(errors,[]);const q=s=>w.document.querySelector(s);q('[data-comecar]').click();assert.equal(q('[data-inicio]').hidden,true);
function solve(t){const box=q('[data-tarefa-tabuleiro]'),d=t.data;
 if(t.kind==='order')for(const p of d.parts){const b=[...box.querySelectorAll('button')].find(x=>x.textContent===p&&!x.disabled);assert(b,p);b.click();}
 else if(t.kind==='match'){for(const [l,r] of d.pairs){const b=[...box.querySelectorAll('.pecas button')].find(x=>x.textContent===r&&!x.disabled);assert(b,r);b.click();}}
 else if(t.kind==='sort'){for(let n=0;n<d.yes.length+d.no.length;n++){const row=box.querySelector('.classificar'),val=row.querySelector('p').textContent;row.querySelectorAll('button')[d.yes.includes(val)?0:1].click();}}
 else throw Error(t.kind);q('[data-tarefa-conferir]').click();assert.equal(q('[data-tarefa-seguir]').hidden,false,t.id);q('[data-tarefa-seguir]').click();}
let curricular=0;
for(const route of ['principal','exemplos']){
 A.closeModal();A.openMap();[...q('[data-mapa-rotas]').children].find(b=>b.textContent===(route==='principal'?'Aula principal':'Aprender de outro jeito')).click();A.closeModal();
 for(const t of C.routes[route]){A.showTask();assert.equal(A.current().id,t.id);assert.equal(q('.gabarito-proprio').hidden,true,'resposta oculta antes de tentativa');assert(C.plain.example(t,C.routes[route]));solve(t);curricular++;}
 assert.equal(A.report().rotas[route].concluidos,C.routes[route].length);
}
assert.equal(A.report().nota,null,'nota bloqueada sem avaliação');A.openReport();for(const select of q('[data-experiencia]').querySelectorAll('select')){select.value=select.getAttribute('aria-label').includes('sugerir')?'Não tenho sugestão agora':'Não usei / não sei avaliar';select.dispatchEvent(new w.Event('change'));}q('[data-exp-confirmar]').checked=true;q('[data-exp-confirmar]').dispatchEvent(new w.Event('change'));assert.equal(A.report().nota,10);assert.equal(A.report().estado,'concluido');
q('[data-abrir-relatorio]').click();assert(A.reportText().includes('construcao_conferida'));assert.equal(errors.length,0,errors.join('\n'));dom.window.close();console.log('Principal/exemplos: '+curricular+' atividades, modelos de outro caso, nota bloqueada e relatório integral aprovados.');
