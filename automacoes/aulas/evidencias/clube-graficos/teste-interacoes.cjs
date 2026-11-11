/* Verificação da revisão clareza-2 nas cinco aulas-gei.
   Carrega os scripts na ordem real do index.html (clareza.js logo após conteudo.js), resolve as
   640 atividades curriculares usando os textos exibidos (t.data vivo) e confere os apoios novos:
   situação em palavras simples, exemplo de OUTRO caso aberto no primeiro bloco (resultado do próprio caso só após a primeira tentativa), pergunta por pergunta
   com opções restantes, resposta certa destacada após erro, conta visível, cartões marcáveis,
   variável-alvo marcada e passagem de bloco com botão único.
   Uso: CLAREZA_ROOT=aulas node automacoes/aulas/evidencias/clareza-2/teste.cjs */
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {JSDOM,VirtualConsole}=require(process.env.JSDOM_MODULE||'jsdom');
const root=path.resolve(process.env.CLAREZA_ROOT||'aulas');
const LESSONS=['clube-dos-graficos-7ano'];
function open(dir){const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const html=fs.readFileSync(dir+'/index.html','utf8');
 const order=[...html.matchAll(/<script src="assets\/([^"]+)"><\/script>/g)].map(m=>m[1]);
 assert.deepEqual(order,['gei.js','missoes.js','conteudo.js','clareza.js','representacoes.js','aula.js','complementos.js','apoio-relacional.js'],dir+': ordem dos scripts');
 assert(html.includes('<link rel="stylesheet" href="assets/clareza.css">'),dir+': folha clareza.css');
 const dom=new JSDOM(html,{url:'https://central.example/'+path.basename(dir)+'/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.ResizeObserver=class{observe(){}disconnect(){}};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});w.requestAnimationFrame=()=>1;w.cancelAnimationFrame=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};}});
 const w=dom.window;for(const file of order.filter(f=>f!=='apoio-relacional.js')){const el=w.document.createElement('script');el.textContent=fs.readFileSync(dir+'/assets/'+file,'utf8');w.document.body.append(el);}
 w.AulaClareza.boot();assert.deepEqual(errors,[]);return{dom,w,errors};}
function click(el){assert(el,'Elemento necessário ausente');el.click();}
function solve(w,t){const $=s=>w.document.querySelector(s),box=$('[data-tarefa-tabuleiro]'),d=t.data,fb=()=>$('[data-tarefa-feedback]').textContent;switch(t.kind){
 case'order':{for(let i=0;i<d.parts.length;i++){const buttons=[...box.querySelectorAll('.pecas button')];assert(buttons.length<=2,'no máximo duas opções por passo');assert(box.textContent.includes('Passo '+(i+1)+' de '+d.parts.length));const wrong=buttons.find(b=>b.textContent!==d.parts[i]);if(wrong){click(wrong);assert(fb().startsWith('Ainda não. Primeiro vem: «'+d.parts[i]),fb());assert(buttons.find(b=>b.textContent===d.parts[i]).classList.contains('pista-certa'),'opção certa destacada');}click(buttons.find(b=>b.textContent===d.parts[i]));}break;}
 case'match':{for(let i=0;i<d.pairs.length;i++){const buttons=[...box.querySelectorAll('.pecas button')];assert.equal(buttons.length,d.pairs.length-i,'só as opções restantes');assert(box.textContent.includes(d.pairs[i][0]));const wrong=buttons.find(b=>b.textContent!==d.pairs[i][1]);if(wrong){click(wrong);assert(fb().includes('A resposta para «'+d.pairs[i][0]+'» é: «'+d.pairs[i][1]+'»'),fb());assert(buttons.find(b=>b.textContent===d.pairs[i][1]).classList.contains('pista-certa'));}click(buttons.find(b=>b.textContent===d.pairs[i][1]));}break;}
 case'sort':{const n=d.yes.length+d.no.length;for(let i=0;i<n;i++){const row=box.querySelector('.classificar'),text=row.querySelector('p').textContent,yes=d.yes.includes(text);assert(yes||d.no.includes(text),'frase exibida pertence ao banco: '+text);assert(row.textContent.includes('Frase '+(i+1)+' de '+n));const buttons=row.querySelectorAll('button');assert.equal(buttons.length,2);click(buttons[yes?1:0]);assert(fb().startsWith('Não foi essa. Esta frase fica em «'+d.labels[yes?0:1]+'»'),fb());assert(buttons[yes?0:1].classList.contains('pista-certa'));click(buttons[yes?0:1]);}break;}
 case'number':{assert(box.querySelector('.conta'),'conta visível: '+t.title);box.querySelector('input').value=d.answer-1;click($('[data-tarefa-conferir]'));assert(fb().includes('pequeno demais'),fb());box.querySelector('input').value=d.answer;break;}
 case'bars':case'tally':{if(t.kind==='tally'){const cards=box.querySelectorAll('button.registro');assert.equal(cards.length,d.tokens.length);click(cards[0]);assert(cards[0].classList.contains('contado'));}box.querySelectorAll('input').forEach((r,i)=>{r.value=d.values[i]+(i===0?1:0);r.dispatchEvent(new w.Event('input'));});click($('[data-tarefa-conferir]'));assert(fb().startsWith('Ainda não está certo'),fb());box.querySelectorAll('input').forEach((r,i)=>{r.value=d.values[i];r.dispatchEvent(new w.Event('input'));});break;}
 case'lab':{const fields=box.querySelectorAll('fieldset'),keys=['agua','sal','temperatura','agitacao'],index=keys.indexOf(d.variable);assert.equal(fields[1].querySelectorAll('label')[index].className,'variavel-alvo');assert(box.textContent.includes('mude esta'));fields[1].querySelectorAll('select')[(index+1)%4].selectedIndex=1;click($('[data-tarefa-conferir]'));assert(fb().startsWith('Ainda não está certo'),fb());fields[1].querySelectorAll('select')[(index+1)%4].selectedIndex=0;fields[1].querySelectorAll('select')[index].selectedIndex=1;break;}
 default:throw Error('Mecânica sem teste '+t.kind);
 }click($('[data-tarefa-conferir]'));assert(fb().startsWith('✔ Muito bem!'),t.id+': '+fb());}
let count=0,glossaries=0;
for(const name of LESSONS){
 const dir=root+'/'+name;assert(fs.existsSync(dir+'/assets/clareza.js'),dir);
 const manifest=JSON.parse(fs.readFileSync(dir+'/manifesto.json','utf8'));assert.equal(manifest.revisao_didatica,'clareza-2',name+': manifesto');
 const {dom,w,errors}=open(dir);const $=s=>w.document.querySelector(s),A=w.AulaCentralGEI,C=A.content;
 assert.equal(C.didacticRevision,'clareza-2');assert.equal(C.plain.revision,'clareza-2');
 assert(!C.routes.principal.some(t=>/^(Reconstruir o percurso|Conectar dado e explicação|Testar o alcance|Preparar uma explicação|Conferir a coleta|Construir a representação|Recuperar o total|Comunicar sem extrapolar|Montar uma comparação controlada|Descrever as repetições)$/.test(t.title)),'títulos reescritos');
 assert(C.routes.principal.every(t=>t.original&&t.original.title),'título original preservado');
 for(const t of C.routes.principal.concat(C.routes.exemplos)){const strings=[...(t.data.parts||[]),...(t.data.labels&&t.kind==='sort'?t.data.labels:[]),...(t.data.pairs||[]).flat()];assert(!strings.some(s=>/^(Dado observado|Relação explicada|Efeito ou resultado|Limite da conclusão|Sustentado|Não sustentado)$/.test(s)),t.id+': rótulo técnico ainda exibido');}
 assert($('[data-objetivo-inicial]').textContent.startsWith('Hoje você vai'),'abertura em linguagem direta');
 click($('[data-comecar]'));assert($('[data-inicio]').hidden);assert(!$('.painel-tarefa').hidden);
 for(const route of ['principal','exemplos']){
  if(route==='exemplos'){A.closeModal();A.openMap();click([...$('[data-mapa-rotas]').children].find(b=>b.textContent==='Aprender de outro jeito'));A.closeModal();}
  for(const t of C.routes[route]){A.closeModal();A.showTask();assert.equal(A.current().id,t.id);
   const guide=$('.guia-claro');assert(guide.textContent.includes('Diga de outro jeito')&&guide.textContent.includes('Ver exemplo com outro caso'));
   const example=guide.querySelectorAll('details')[1],ex=C.plain.example(t,C.routes[route]);assert(ex&&ex.caso!==C.cases[t.case].title,t.id+': exemplo precisa vir de outro caso');assert.equal(example.dataset.exemplo,'outro-caso');assert(example.textContent.includes(ex.caso));
   if(t.kind==='number'){const sib=C.routes[route].find(x=>x.id===ex.id);assert.notDeepEqual(sib.data.operands,t.data.operands,t.id+': exemplo com os mesmos números');}
   assert.equal(example.open,t.case===0,t.id+': exemplo aberto só no primeiro bloco');
   const reveal=guide.querySelector('.gabarito-proprio');assert(reveal&&reveal.hidden,t.id+': resultado do próprio caso escondido antes da primeira tentativa');
   assert(guide.textContent.includes('3 · Agora é sua vez')===false&&$('.tarefa-card').textContent.includes('3 · Agora é sua vez'));
   assert.equal($('[data-tarefa-explica]').textContent,C.plain.story(t.case).texto,'situação em palavras simples');assert.equal($('.situacao-original p').textContent,t.explain);
   if(guide.querySelector('.glossario-atividade'))glossaries++;
   solve(w,t);assert(!$('[data-tarefa-seguir]').hidden,name+' '+t.id);
   const rec=A.getState().routes[route].records[t.id];assert.equal(rec.first,false,t.id+': a primeira tentativa errada precisa contar como primeira tentativa');assert(!reveal.hidden,t.id+': resultado do próprio caso visível depois da tentativa');
   click($('[data-tarefa-seguir]'));count++;
   const idx=A.getState().routes[route].index,size=route==='principal'?4:12;
   if(idx%size===0&&idx<C.routes[route].length){assert(!$('.painel-mapa').hidden,'mapa após o bloco');const banner=$('.bloco-feito');assert(!banner.hidden&&banner.textContent.includes('Bloco '+(idx/size)+' concluído'),banner.textContent);click(banner.querySelector('button'));assert(!$('.painel-tarefa').hidden);assert.equal(A.current().id,C.routes[route][idx].id);}
  }
  assert.equal(A.report().rotas[route].concluidos,C.routes[route].length);
 }
 assert.equal(A.extraProgress().required,0);assert.equal(A.report().revisao_didatica,'clareza-2');assert.deepEqual(errors,[]);dom.window.close();
 console.log('PASS '+name+': situação simples, exemplo resolvido, correção visível e passagem de bloco em '+(C.routes.principal.length+C.routes.exemplos.length)+' atividades.');
}
assert.equal(count,128);assert(glossaries>100,'glossário presente na maioria das atividades: '+glossaries);
console.log('PASS '+count+' atividades verificadas com clareza-2; glossário em '+glossaries+'.');
