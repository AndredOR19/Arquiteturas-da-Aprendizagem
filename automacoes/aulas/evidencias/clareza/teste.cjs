const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {JSDOM,VirtualConsole}=require(process.env.JSDOM_MODULE||'jsdom');
const root=path.resolve(process.env.CLAREZA_ROOT||path.resolve(__dirname,'../../exportacoes/projetos/aulas-reutilizaveis'));
function open(dir,saved){const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));let frame;
 const dom=new JSDOM(fs.readFileSync(dir+'/index.html','utf8'),{url:'https://central.example/'+path.basename(dir)+'/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.ResizeObserver=class{observe(){}disconnect(){}};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});w.requestAnimationFrame=cb=>(frame=cb,1);w.cancelAnimationFrame=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};if(saved)w.localStorage.setItem('central-gei-aula-v2:'+path.basename(dir),saved);}});
 const w=dom.window;for(const file of ['gei.js','missoes.js','conteudo.js','representacoes.js','aula.js','complementos.js']){const el=w.document.createElement('script');el.textContent=fs.readFileSync(dir+'/assets/'+file,'utf8');w.document.body.append(el);}assert.deepEqual(errors,[]);return{dom,w,errors,frame:()=>frame};}
function click(el){assert(el,'Elemento necessário ausente');el.click();}
function taskOpen(w,t){const $=s=>w.document.querySelector(s);w.AulaCentralGEI.openMap();click($('[data-mapa-locais]').children[t.station]);assert.equal($('.painel-tarefa').hidden,false);assert.equal($('#tarefa-titulo').textContent,t.title);}
function solve(w,t,wrong=false){const $=s=>w.document.querySelector(s),box=$('[data-tarefa-tabuleiro]'),d=t.data;switch(t.kind){
 case'order':case'letters':{const parts=t.kind==='letters'?[...d.word]:d.parts,goal=wrong?[...parts].reverse():parts;for(const text of goal)click([...box.querySelectorAll('.pecas button')].find(b=>b.textContent===text&&!b.disabled));break;}
 case'match':{for(const pair of d.pairs)click([...box.querySelectorAll('button')].find(b=>b.textContent===pair[1]));break;}
 case'sort':for(const row of box.querySelectorAll('.classificar')){const yes=d.yes.includes(row.querySelector('p').textContent);click(row.querySelectorAll('button')[wrong?(yes?1:0):(yes?0:1)]);}break;
 case'number':box.querySelector('input').value=wrong?d.answer+1:d.answer;break;
 case'bars':case'tally':box.querySelectorAll('input').forEach((r,i)=>{r.value=d.values[i]+(wrong&&i===0?1:0);r.dispatchEvent(new w.Event('input'));});break;
 case'lab':{const fields=box.querySelectorAll('fieldset');for(const f of fields)f.querySelectorAll('select').forEach(s=>s.selectedIndex=0);const keys=['agua','sal','temperatura','agitacao'],index=keys.indexOf(d.variable);fields[1].querySelectorAll('select')[index].selectedIndex=wrong?0:1;break;}
 case'wordmatch':click([...box.querySelectorAll('button')].find(b=>b.textContent===(wrong?d.distractors[0]:d.word)));break;
 default:throw Error('Mecânica sem teste '+t.kind);
 }click($('[data-tarefa-conferir]'));}
let count=0;
for(const name of fs.readdirSync(root).filter(n=>['estrategias-de-estudo-8ano','pesquisa-e-dados-7ano','laboratorio-teste-justo-9ano','arquivo-independencias-9ano','convivencia-e-dialogo-9ano'].includes(n))){
 const {dom,w,errors}=open(root+'/'+name);const $=s=>w.document.querySelector(s),A=w.AulaCentralGEI,C=A.content;assert(C.guidedClarity);click($('[data-comecar]'));assert($('[data-inicio]').hidden);assert(!$('.painel-tarefa').hidden);assert($('.guia-claro').textContent.includes('Diga de outro jeito'));assert($('.painel-entender').hidden);
 for(const route of ['principal','exemplos']){
  if(route==='exemplos'){A.closeModal();A.openMap();click([...$('[data-mapa-rotas]').children].find(b=>b.textContent==='Aprender de outro jeito'));A.closeModal();}
  for(const t of C.routes[route]){A.closeModal();A.showTask();assert.equal(A.current().id,t.id);assert($('.guia-claro').textContent.includes('Ver exemplo'));
   if(t===C.routes.principal[0]){click($('[data-tarefa-conferir]'));assert.equal(A.extraProgress().required,0);assert.equal(A.current().id,t.id);}
   solve(w,t);assert(!$('[data-tarefa-seguir]').hidden,name+' '+t.id);click($('[data-tarefa-seguir]'));count++;
  }
  assert.equal(A.report().rotas[route].concluidos,C.routes[route].length);
 }
 assert.equal(A.extraProgress().required,0);assert.equal(A.report().adaptacao.enabled,false);assert.deepEqual(errors,[]);dom.window.close();console.log('PASS '+name+' principal e opcionais: instruções, modelo, avanço e nenhuma tarefa adicional.');
}
console.log('PASS '+count+' atividades verificadas.');
