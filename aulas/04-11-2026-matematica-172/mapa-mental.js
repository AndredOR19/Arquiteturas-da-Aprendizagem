/* Mapa mental interativo — Matemática 172 · Probabilidade (EF07MA34/EF07MA37).
   Recurso complementar de organização do tema: mapa e lista equivalentes,
   teclado, voz e preto e branco. Não altera nota, percurso ou recuperação. */
(()=>{'use strict';
const NODES=[
 {id:'exp',emoji:'🎲',title:'Experimento aleatório',sub:'resultado incerto',room:0,
  d:'Lançar uma moeda: antes do lançamento, não sabemos a face.',
  r:'A incerteza permite listar todos os resultados possíveis.',
  e:'É a condição para planejar o experimento e registrar cada resultado.',
  l:'Listar resultados não diz qual deles sairá.'},
 {id:'omega',emoji:'🧺',title:'Espaço amostral (Ω)',sub:'todos os possíveis',room:0,
  d:'Dado comum: Ω = {1, 2, 3, 4, 5, 6}.',
  r:'Ω é o total de referência do modelo.',
  e:'Eventos como “par” ou “maior que 4” passam a ser partes de Ω.',
  l:'Mudar a ação ou a condição muda o espaço amostral.'},
 {id:'evento',emoji:'🎯',title:'Evento',sub:'a parte que interessa',room:1,
  d:'Evento “número par” no dado: {2, 4, 6}.',
  r:'O evento é uma parte do espaço amostral.',
  e:'Os casos favoráveis são contados contra o total.',
  l:'Outro evento no mesmo dado produz outra chance.'},
 {id:'chance',emoji:'⚖️',title:'Chance = favoráveis ÷ possíveis',sub:'1/2 = 0,5 = 50%',room:1,
  d:'Três faces pares em seis possíveis: 3 ÷ 6 = 1/2.',
  r:'A fração mede a parte do total que atende ao evento.',
  e:'Permite comparar partes de um mesmo todo.',
  l:'Por contagem simples, só vale quando os resultados são equiprováveis.'},
 {id:'freq',emoji:'📈',title:'Frequência relativa',sub:'o que os ensaios mostram',room:2,
  d:'12 caras em 20 lançamentos: 12 ÷ 20 = 60%.',
  r:'A frequência descreve o ensaio, não o próximo lançamento.',
  e:'Com mais ensaios, a estimativa tende a estabilizar.',
  l:'Nenhum lote obriga o equilíbrio; 60% não transforma a moeda.'},
 {id:'setor',emoji:'🥧',title:'Gráfico de setores',sub:'partes de um único todo',room:3,
  d:'60% e 40% de um mesmo total somam 100%.',
  r:'Percentual ÷ 100 × 360° = ângulo do setor: 216° e 144°.',
  e:'As partes de um único total ficam visíveis no círculo.',
  l:'Exige título, categorias, total, fonte e contexto; não serve a séries no tempo.'},
 {id:'limite',emoji:'⚠️',title:'Chance ≠ promessa',sub:'os limites do modelo',room:5,
  d:'Quatro caras seguidas em lançamentos independentes.',
  r:'A moeda não “devem” coroa: cada lançamento continua com 1/2.',
  e:'Separa a chance do modelo da sequência curta observada.',
  l:'40% não garante duas vitórias em cinco sorteios.'}
];
const POS={exp:[95,112],omega:[460,66],evento:[825,112],chance:[825,300],freq:[825,482],setor:[460,538],limite:[95,482]};
const CX=460,CY=300,NS='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
function el(name,attrs,parent){const n=document.createElementNS(NS,name);for(const k in attrs)n.setAttribute(k,attrs[k]);if(parent)parent.append(n);return n}
function logEv(d){if(typeof window.log==='function')window.log('mapa_mental',d)}
function say(t){if(typeof window.speak==='function')window.speak(t);else if(typeof window.toast==='function')window.toast('Voz indisponível neste dispositivo. O texto continua acessível.')}
function wrap(text,max){const words=text.split(' ');const lines=[];let cur='';for(const w of words){if((cur+' '+w).trim().length>max){lines.push(cur.trim());cur=w}else cur=(cur?cur+' ':'')+w}if(cur)lines.push(cur.trim());return lines}

function drawMap(){
 const host=$('mm-svg');if(!host)return;host.replaceChildren();
 const svg=el('svg',{viewBox:'0 0 920 600',role:'group','aria-label':'Mapa mental interativo: sete conceitos conectados a Probabilidade. Use as setas do teclado para percorrer os nós.'},host);
 NODES.forEach(n=>{
  const [x,y]=POS[n.id];
  const ex=x<400?x+116:x>520?x-116:x;
  const ey=y<300?y+34:y>360?y-34:y;
  el('path',{d:`M ${CX} ${CY} Q ${(CX+ex)/2} ${(CY+ey)/2} ${ex} ${ey}`,class:'mm-link','aria-hidden':'true'},svg);
 });
 const cg=el('g',{'aria-hidden':'true'},svg);
 el('circle',{cx:CX,cy:CY,r:90,class:'mm-core'},cg);
 const t1=el('text',{x:CX,y:CY-2,'text-anchor':'middle',class:'mm-core-t1'},cg);t1.textContent='PROBABILIDADE';
 const t2=el('text',{x:CX,y:CY+24,'text-anchor':'middle',class:'mm-core-t2'},cg);t2.textContent='do acaso à evidência';
 NODES.forEach(n=>{
  const [x,y]=POS[n.id];
  const g=el('g',{class:'mm-node',role:'button',tabindex:'0',id:'mm-node-'+n.id,'aria-label':n.title+'. Abrir explicação.'},svg);
  el('rect',{x:x-116,y:y-32,width:232,height:64,rx:16},g);
  const lines=wrap(n.emoji+' '+n.title,24);
  const ty=lines.length===1?y-2:y-12;
  lines.slice(0,2).forEach((s,j)=>{const t=el('text',{x,y:ty+j*20,'text-anchor':'middle',class:'mm-node-t'},g);t.textContent=s});
  const s=el('text',{x,y:lines.length===1?y+18:y+26,'text-anchor':'middle',class:'mm-node-s'},g);s.textContent=n.sub;
  g.addEventListener('click',()=>select(n.id));
  g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(n.id)}});
 });
}
function select(id){
 const n=NODES.find(x=>x.id===id);if(!n)return;
 document.querySelectorAll('.mm-node').forEach(g=>g.classList.toggle('sel',g.id==='mm-node-'+id));
 document.querySelectorAll('.mm-list-item').forEach(b=>b.classList.toggle('act',b.id==='mm-list-'+id));
 const d=$('mm-detail');if(!d)return;
 d.classList.add('show');d.replaceChildren();
 const h=document.createElement('h3');h.textContent=n.emoji+' '+n.title;d.append(h);
 const box=document.createElement('div');box.className='mm-drel';
 [['D · Dado',n.d],['R · Relação',n.r],['E · Efeito',n.e],['L · Limite',n.l]].forEach(([k,v])=>{const p=document.createElement('p');const b=document.createElement('b');b.textContent=k+' — ';p.append(b,document.createTextNode(v));box.append(p)});
 d.append(box);
 const bar=document.createElement('div');bar.className='nav';
 const b1=document.createElement('button');b1.className='btn';b1.type='button';b1.textContent='🔊 Ouvir explicação';b1.onclick=()=>say(n.title+'. '+n.d+' '+n.r+' '+n.e+' '+n.l);bar.append(b1);
 const b2=document.createElement('button');b2.className='btn';b2.type='button';b2.textContent='🧭 Ir ao ambiente '+(n.room+1);b2.onclick=()=>goRoom(n.room);bar.append(b2);
 d.append(bar);
 if(d.scrollIntoView)d.scrollIntoView({block:'nearest'});
 logEv('no:'+id);
}
function goRoom(room){
 const hub=$('hub');
 if(!hub){if(window.toast)window.toast('O território ainda está carregando. Tente em instantes.');return}
 if(hub.scrollIntoView)hub.scrollIntoView({block:'start'});
 const b=document.querySelectorAll('#room-map button')[room];
 if(!b)return;
 if(b.disabled){if(window.toast)window.toast('Ambiente '+(room+1)+' ainda fechado: conclua as evidências do ambiente anterior.');return}
 b.click();
}
function drawList(){
 const host=$('mm-list');if(!host)return;host.replaceChildren();
 NODES.forEach((n,i)=>{
  const b=document.createElement('button');
  b.className='btn mm-list-item';b.id='mm-list-'+n.id;b.type='button';b.setAttribute('role','listitem');
  b.textContent=String(i+1).padStart(2,'0')+' '+n.emoji+' '+n.title+' — '+n.sub;
  b.onclick=()=>select(n.id);
  host.append(b);
 });
}
function init(){
 const host=$('mm-svg');if(!host)return;
 drawMap();drawList();
 const tl=$('mm-toggle');
 tl.addEventListener('click',()=>{
  const hidden=host.classList.toggle('hidden-map');
  $('mm-list').style.display=hidden?'flex':'none';
  tl.textContent=hidden?'Ver como mapa':'Ver como lista';
  logEv('alternancia:'+(hidden?'lista':'mapa'));
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
