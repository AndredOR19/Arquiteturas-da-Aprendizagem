const fs=require('fs'),path=require('path'),assert=require('assert/strict');const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(process.env.APOIO_ROOT||'aulas/racismo-autoritarismo-e-democracia-9ano/apoio');const html=fs.readFileSync(root+'/index.html','utf8');let saved={},svgs={},errors=[];
function open(){const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));const d=new JSDOM(html,{url:'https://teste.example/apoio/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.speechSynthesis={cancel(){},getVoices(){return[]},speak(){}};w.SpeechSynthesisUtterance=class{};w.URL.createObjectURL=()=> 'blob:teste';w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=()=>{};}});for(const [k,v]of Object.entries(saved))d.window.localStorage.setItem(k,v);d.window.eval(fs.readFileSync(root+'/apoio.js','utf8'));return d;}
let dom=open(),w=dom.window,$=id=>w.document.getElementById(id),A=w.ApoioInclusivoV2;
assert.equal(A.content.phases.associacoes.length,96);assert.equal(A.content.phases.frases.length,96);assert($('example').textContent.includes('outra situação'));assert($('invite').closest('#finish').hidden);
$('phase2').click();assert.equal(A.current().id,'assoc-1-1');assert($('status').textContent.includes('Conclua'));
function solve(phase){for(let n=0;n<96;n++){const t=A.current();assert.equal(t.id,A.content.phases[phase][n].id);assert($('example').textContent.length>30);assert.equal($('next').disabled,true);svgs[t.id]=[...w.document.querySelectorAll('#figure svg')].map(x=>x.outerHTML);
 const select=i=>{const b=w.document.querySelector('#choices button[data-option="'+i+'"]');assert(b,t.id);b.click();};
 if(t.kind==='order'){
  if(t.options.length>1){t.correct.slice().reverse().forEach(select);$('check').click();assert($('next').disabled);}
  t.correct.forEach(select);$('check').click();
 }else{select((t.correct+1)%t.options.length);assert($('next').disabled);select(t.correct);}
 assert(!$('next').disabled,t.id);assert(A.report().records[t.id].attempts.length>=1);$('next').click();
 if(phase==='associacoes'&&n===35){for(let i=0;i<w.localStorage.length;i++){const k=w.localStorage.key(i);saved[k]=w.localStorage.getItem(k);}dom.window.close();dom=open();w=dom.window;$=id=>w.document.getElementById(id);A=w.ApoioInclusivoV2;assert.equal(A.states.associacoes.done.length,36);assert.equal(A.current().id,A.content.phases.associacoes[36].id);}
}assert.equal(A.report().concluidas,96);assert.equal(A.report().estado,'concluido');}
solve('associacoes');assert(!$('invite').hidden);assert($('finish-title').textContent.includes('96'));const before=JSON.stringify(A.states.associacoes);$('today').click();assert($('invite').hidden);$('phase2').click();solve('frases');assert.equal(JSON.stringify(A.states.associacoes),before);assert.equal(A.states.frases.done.length,96);assert.equal(errors.length,0,errors.join('\n'));
// Confirm persisted phases remain separate and produce a complete report after reload.
saved={};for(let i=0;i<w.localStorage.length;i++){const k=w.localStorage.key(i);saved[k]=w.localStorage.getItem(k);}dom.window.close();dom=open();w=dom.window;A=w.ApoioInclusivoV2;assert.equal(A.states.associacoes.done.length,96);assert.equal(A.states.frases.done.length,96);A.start('frases');assert.equal(A.report().concluidas,96);dom.window.close();
fs.writeFileSync('inclusivo-svg.json',JSON.stringify(svgs));console.log('PASS 96 associações + 96 frases: erro/acerto, modelagem, convite, recusa, bloqueio de entrada antecipada, recarga, retomada, relatórios separados e persistência.');
