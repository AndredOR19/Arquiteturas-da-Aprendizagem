/* Gráficos em movimento — Matemática 172 · Probabilidade (EF07MA34/EF07MA37).
   Treino complementar com simulações digitais: setores, barras e linha.
   Camada visual 1: animações leves (setores abrem, barras crescem, linha é
   desenhada lançamento a lançamento, dado e moeda em 3D, confete no acerto).
   Sem nota, sem ampliar percurso; estados em memória (a sessão curricular é outra). */
(()=>{'use strict';
const NS='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
function el(name,attrs,parent){const n=document.createElementNS(NS,name);for(const k in attrs)n.setAttribute(k,attrs[k]);if(parent)parent.append(n);return n}
function say(t){if(typeof window.speak==='function')window.speak(t);else if(typeof window.toast==='function')window.toast('Voz indisponível neste dispositivo. O texto continua acessível.')}
function logEv(d){if(typeof window.log==='function')window.log('graficos',d)}
function fmt(n){return String(n).replace('.',',')}
function pct(x){return fmt(x.toFixed(1))}

/* ---------- suporte visual (animações) ---------- */
const motionOK=()=>{try{return !matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return true}};
const easeOut=p=>1-Math.pow(1-p,3);
function tween(dur,step,done){
 if(!motionOK()){step(1);if(done)done();return}
 const t0=performance.now();
 const f=t=>{const p=Math.min(1,(t-t0)/dur);step(easeOut(p));if(p<1)requestAnimationFrame(f);else if(done)done()};
 requestAnimationFrame(f);
}

/* confete: só celebra o acerto; sem som, sem bloqueio, some sozinho */
let cCanvas=null;
function confetti(){
 if(!motionOK())return;
 if(!cCanvas){cCanvas=document.createElement('canvas');cCanvas.id='confetti';cCanvas.setAttribute('aria-hidden','true');document.body.append(cCanvas);
  const rs=()=>{cCanvas.width=window.innerWidth;cCanvas.height=window.innerHeight};rs();addEventListener('resize',rs)}
 const x=cCanvas.getContext('2d');if(!x)return;
 const colors=['#f7c75d','#7fb6e6','#9be29b','#9333ea','#d97706'];
 const P=[];for(let i=0;i<90;i++)P.push({x:window.innerWidth/2+(Math.random()-.5)*240,y:90,vx:(Math.random()-.5)*10,vy:Math.random()*-7-2,s:4+Math.random()*5,r:Math.random()*6.3,vr:(Math.random()-.5)*.35,c:colors[i%5]});
 const t0=performance.now();
 const f=t=>{const e=t-t0;x.clearRect(0,0,cCanvas.width,cCanvas.height);
  for(const p of P){p.x+=p.vx;p.y+=p.vy;p.vy+=.25;p.r+=p.vr;
   x.save();x.globalAlpha=Math.max(0,1-e/1800);x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/2,p.s,p.s);x.restore()}
  if(e<1800)requestAnimationFrame(f);else x.clearRect(0,0,cCanvas.width,cCanvas.height)};
 requestAnimationFrame(f);
}

/* dado 3D (dado comum: faces opostas somam 7) */
const FACE_PLACE={1:'translateZ(32px)',4:'rotateY(180deg) translateZ(32px)',3:'rotateY(90deg) translateZ(32px)',6:'rotateY(-90deg) translateZ(32px)',2:'rotateX(90deg) translateZ(32px)',5:'rotateX(-90deg) translateZ(32px)'};
const FACE_SHOW={1:[0,0],4:[0,180],3:[0,-90],6:[0,90],2:[-90,0],5:[90,0]};
const PIPS={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function buildDie(host){
 if(!host)return;
 host.innerHTML='<div class="die-stage"><div class="die" id="die3d"></div></div>';
 const die=host.querySelector('.die');if(!die)return;
 for(let n=1;n<=6;n++){
  const face=document.createElement('div');face.className='face';face.style.transform=FACE_PLACE[n];
  const pips=new Set(PIPS[n]);
  for(let c=0;c<9;c++){const s=document.createElement('span');if(pips.has(c))s.className='pip';face.append(s)}
  die.append(face);
 }
 die.style.transform='rotateX(-22deg) rotateY(-28deg)';
}
function diceSpin(n){
 const die=$('die3d');if(!die||!motionOK())return;
 const o=FACE_SHOW[n]||[0,0];
 die.style.transform='rotateX('+(o[0]+360*3)+'deg) rotateY('+(o[1]+360*(2+(n%2)))+'deg)';
}

/* moeda 3D */
function buildCoin(host){
 if(!host)return;
 host.innerHTML='<div class="coin-stage"><div class="coin3d" id="coin3d"><div class="cf cf-cara">CARA</div><div class="cf cf-coroa">COROA</div></div></div>';
 const c=host.querySelector('.coin3d');if(c)c.style.transform='rotateX(-22deg) rotateY(-28deg)';
}
function coinFlip(cara){
 const c=$('coin3d');if(!c||!motionOK())return;
 const base=cara?0:180;
 c.style.transform='rotateX(-8deg) rotateY('+(base+360*(2+(cara?1:0)))+'deg)';
}

/* ---------------- A · Gráfico de setores (até 3 categorias) ---------------- */
const PCOLORS=['#f7c75d','#7fb6e6','#9be29b'];
const PRESETS=[
 {id:'moeda',label:'Ensaio da moeda (12/8)',names:['Cara','Coroa','Outro (opcional)'],vals:[12,8,0]},
 {id:'urna',label:'Urna de bolas (3V·2A·5G)',names:['Vermelhas','Azuis','Verdes'],vals:[3,2,5]},
 {id:'ibge',label:'IBGE 2024 (93,6/6,4)',names:['Com utilização','Complemento calculado','—'],vals:[93.6,6.4,0]}
];
let pieData={names:[...PRESETS[0].names],vals:[...PRESETS[0].vals]};
let pieShown=[0,0,0];
function pieApply(preset){
 pieData.names=[...preset.names];pieData.vals=[...preset.vals];
 for(let i=0;i<3;i++){const lab=$('pie-name-'+i),inp=$('pie-in-'+i);if(lab)lab.textContent=preset.names[i];if(inp){inp.value=preset.vals[i];inp.disabled=false}}
 pieDraw(true);logEv('setores_preset:'+preset.id);
}
function pieRead(){return [0,1,2].map(i=>{const inp=$('pie-in-'+i);const v=inp?Number(inp.value):0;return Number.isFinite(v)&&v>0?v:0})}
function drawPieSvg(shown,target){
 const host=$('pie-svg');if(!host)return;host.replaceChildren();
 const svg=el('svg',{viewBox:'0 0 320 320',role:'img','aria-label':'Gráfico de setores: '+target.map((f,i)=>f>=.0005?pieData.names[i]+' '+pct(f*100)+'%':'').filter(Boolean).join('; ')},host);
 const cx=160,cy=160,r=132;let a0=-Math.PI/2;
 for(let i=0;i<3;i++){
  const f=shown[i];if(f<=.0005)continue;
  const a1=a0+f*Math.PI*2;
  const large=f>.5?1:0;
  const x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);
  const d=f>=.9995?`M ${cx} ${cy-r} A ${r} ${r} 0 1 1 ${cx-0.01} ${cy-r} Z`
   :`M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
  el('path',{d,fill:PCOLORS[i],stroke:'#1e293b','stroke-width':'2',class:'pie-slice'},svg);
  if(target[i]>=.07&&f>=.06){
   const am=(a0+a1)/2;
   const t=el('text',{x:cx+r*.62*Math.cos(am),y:cy+r*.62*Math.sin(am),'text-anchor':'middle','dominant-baseline':'middle',class:'pie-pct'},svg);
   t.textContent=pct(target[i]*100)+'%';
  }
  a0=a1;
 }
}
function pieDraw(animate){
 const host=$('pie-svg');if(!host)return;
 const out=$('pie-status'),tbl=$('pie-table');
 const vals=pieRead();const total=vals.reduce((a,b)=>a+b,0);
 if(!total){
  pieShown=[0,0,0];
  if(out)out.textContent='D · Total zero. R · Sem total definido, não há frequência relativa nem setor. E · —. L · Inclua ao menos uma ocorrência para desenhar o gráfico.';
  if(tbl)while(tbl.rows.length>1)tbl.deleteRow(-1);
  host.replaceChildren();
  el('svg',{viewBox:'0 0 320 320',role:'img','aria-label':'Gráfico de setores vazio'},host).append(el('circle',{cx:160,cy:160,r:132,class:'pie-empty'}));
  return;
 }
 let rows='';
 for(let i=0;i<3;i++){const v=vals[i];if(v<=0)continue;const f=v/total;
  rows+=`<tr><td><span class="chipc" style="background:${PCOLORS[i]}"></span>${pieData.names[i]}</td><td>${fmt(v)}</td><td>${fmt(v)}/${fmt(total)}</td><td>${pct(f*100)}%</td><td>${pct(f*360)}°</td></tr>`}
 rows+=`<tr class="tot"><td>Total</td><td>${fmt(total)}</td><td>1</td><td>100%</td><td>360°</td></tr>`;
 if(tbl){while(tbl.rows.length>1)tbl.deleteRow(-1);
  const frag=document.createDocumentFragment();const tmp=document.createElement('tbody');tmp.innerHTML=rows;
  while(tmp.firstChild)frag.append(tmp.firstChild);tbl.append(frag)}
 const target=vals.map(v=>v/total);
 const parts=target.map((f,i)=>f>=.0005?`${pieData.names[i]}: ${pct(f*100)}% (${pct(f*360)}°)`:'').filter(Boolean);
 if(out)out.textContent='D · '+fmt(total)+' ocorrências no total. R · cada setor = parte ÷ total; ângulo = % ÷ 100 × 360°. E · '+parts.join(' · ')+' — as parcelas fecham 360°. L · setores mostram partes de UM único total; para mudanças ao longo do tempo, linhas ou colunas são mais adequadas.';
 const from=[...pieShown];
 drawPieSvg(from,target);
 if(animate===false||!motionOK()){pieShown=[...target];drawPieSvg(pieShown,target)}
 else{tween(650,p=>{pieShown=from.map((f,i)=>f+(target[i]-f)*p);drawPieSvg(pieShown,target)},()=>{pieShown=[...target];drawPieSvg(pieShown,target)})}
}

/* ---------------- B · Gráfico de barras (dado) ---------------- */
let dice={counts:[0,0,0,0,0,0],total:0};
let barShown=[0,0,0,0,0,0];
function diceRoll(n){
 let last=1;
 for(let i=0;i<n;i++){last=1+Math.floor(Math.random()*6);dice.counts[last-1]++}
 dice.total+=n;diceDraw(true,last);logEv('barras_dado_lote:'+n);
}
function diceReset(){dice={counts:[0,0,0,0,0,0],total:0};diceDraw(false,1);logEv('barras_dado_zerar')}
function drawBarsSvg(shown,final){
 const host=$('bar-svg');if(!host)return;host.replaceChildren();
 const W=470,H=300,ml=52,mr=14,mt=20,mb=46,pw=W-ml-mr,ph=H-mt-mb;
 const maxF=Math.max(...final,1e-9);
 const top=Math.max(.3,Math.ceil((maxF*1.2)*20)/20);
 const y=v=>mt+ph-(v/top)*ph;
 const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':'Gráfico de barras: frequência de cada face do dado. '+'1: '+pct(final[0]*100)+'%, 2: '+pct(final[1]*100)+'%, 3: '+pct(final[2]*100)+'%, 4: '+pct(final[3]*100)+'%, 5: '+pct(final[4]*100)+'%, 6: '+pct(final[5]*100)+'%.'},host);
 const step=top<=.4?.05:.1;
 for(let v=0;v<=top+1e-9;v+=step){
  el('line',{x1:ml,y1:y(v),x2:W-mr,y2:y(v),class:'bar-grid'},svg);
  const t=el('text',{x:ml-8,y:y(v)+4,'text-anchor':'end',class:'bar-tick'},svg);t.textContent=pct(v*100)+'%';
 }
 const ty=y(1/6);
 el('line',{x1:ml,y1:ty,x2:W-mr,y2:ty,class:'bar-theo'},svg);
 const tt=el('text',{x:W-mr,y:ty-6,'text-anchor':'end',class:'bar-theo-l'},svg);tt.textContent='modelo: 1/6 ≈ 16,7%';
 const bw=pw/6;
 for(let i=0;i<6;i++){
  const bx=ml+bw*i+bw*.18;
  const bh=Math.max((shown[i]/top)*ph,0);
  el('rect',{x:bx,y:mt+ph-bh,width:bw*.64,height:bh,class:'bar-rect'},svg);
  if(dice.total){
   const t=el('text',{x:bx+bw*.32,y:Math.max(mt+ph-bh-6,mt+12),'text-anchor':'middle',class:'bar-val'},svg);
   t.textContent=pct(final[i]*100)+'%';
  }
  const f=el('text',{x:ml+bw*i+bw/2,y:H-mb+22,'text-anchor':'middle',class:'bar-face'},svg);f.textContent=String(i+1);
 }
 const ax=el('text',{x:ml+pw/2,y:H-6,'text-anchor':'middle',class:'bar-axis'},svg);ax.textContent='face do dado';
}
function diceDraw(animate,lastFace){
 const out=$('bar-status');
 const freqs=dice.total?dice.counts.map(c=>c/dice.total):[0,0,0,0,0,0];
 if(out)out.textContent=dice.total
  ?'D · '+dice.total+' lançamentos registrados. R · frequência = contagem da face ÷ total. E · face '+(freqs.indexOf(Math.max(...freqs))+1)+' lidera com '+pct(Math.max(...freqs)*100)+'%. L · no modelo cada face vale 1/6 ≈ 16,7%; lotes curtos variam e nenhum lançamento “compensa” o anterior.'
  :'D · Nenhum lançamento ainda. R · frequência = contagem ÷ total. E · —. L · Use os botões para lançar lotes e comparar com a linha do modelo (1/6).';
 if(lastFace)diceSpin(lastFace);
 const from=[...barShown];
 if(animate===false||!motionOK()){barShown=[...freqs];drawBarsSvg(barShown,freqs)}
 else{tween(550,p=>{barShown=from.map((f,i)=>f+(freqs[i]-f)*p);drawBarsSvg(barShown,freqs)},()=>{barShown=[...freqs];drawBarsSvg(barShown,freqs)})}
}

/* ---------------- C · Gráfico de linha (moeda) ---------------- */
let coin={cara:0,coroa:0,pts:[]};
let coinDrawn=0;
function coinAdd(n){
 let lastC=true;
 for(let i=0;i<n;i++){const cara=Math.random()<.5;lastC=cara;if(cara)coin.cara++;else coin.coroa++;const t=coin.cara+coin.coroa;coin.pts.push(coin.cara/t)}
 coinDraw(true);coinFlip(lastC);logEv('linha_moeda_lote:'+n);
}
function coinReset(){coin={cara:0,coroa:0,pts:[]};coinDrawn=0;coinDraw(false);coinFlip(true);logEv('linha_moeda_zerar')}
function lineBase(host){
 const W=470,H=300,ml=52,mr=16,mt=20,mb=46,pw=W-ml-mr,ph=H-mt-mb;
 host.replaceChildren();
 const N=coin.pts.length;
 const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':'Gráfico de linha: frequência relativa de cara em '+N+' lançamentos. '+(N?'Frequência atual: '+pct(coin.pts[N-1]*100)+'%. ':'Ainda sem lançamentos.')},host);
 const X=i=>ml+(N>1?(i/(N-1))*pw:0);
 const Y=v=>mt+ph-v*ph;
 [0,.25,.5,.75,1].forEach(v=>{
  el('line',{x1:ml,y1:Y(v),x2:W-mr,y2:Y(v),class:'bar-grid'},svg);
  const t=el('text',{x:ml-8,y:Y(v)+4,'text-anchor':'end',class:'bar-tick'},svg);t.textContent=fmt(v);
 });
 el('line',{x1:ml,y1:Y(.5),x2:W-mr,y2:Y(.5),class:'bar-theo'},svg);
 const tt=el('text',{x:W-mr,y:Y(.5)-6,'text-anchor':'end',class:'bar-theo-l'},svg);tt.textContent='modelo: 1/2';
 const ax=el('text',{x:ml+pw/2,y:H-6,'text-anchor':'middle',class:'bar-axis'},svg);ax.textContent='lançamento nº '+(N||'—');
 return {svg,X,Y,W,mr};
}
function linePoints(ctx,count){
 const {svg,X,Y,W,mr}=ctx;
 for(const cls of ['line-path','line-dot','line-val']){const o=svg.querySelector('.'+cls);if(o)o.remove()}
 if(!count)return;
 const pts=coin.pts.slice(0,count).map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' ');
 el('polyline',{points:pts,fill:'none',class:'line-path'},svg);
 const lx=X(count-1),ly=Y(coin.pts[count-1]);
 el('circle',{cx:lx,cy:ly,r:5,class:'line-dot'},svg);
 const t=el('text',{x:Math.min(lx,W-mr-4),y:ly-10,'text-anchor':lx>W-90?'end':'start',class:'bar-val line-val'},svg);
 t.textContent=pct(coin.pts[count-1]*100)+'%';
}
function coinDraw(animate){
 const host=$('line-svg');if(!host)return;
 const out=$('line-status');
 const N=coin.pts.length;
 if(out)out.textContent=N
  ?'D · '+N+' lançamentos: '+coin.cara+' caras e '+coin.coroa+' coroas. R · '+coin.cara+' ÷ '+N+' = '+pct(coin.pts[N-1]*100)+'% de cara no ensaio. E · a linha mostra a frequência relativa a cada lançamento. L · o modelo mantém 1/2 em cada lançamento; a curva tende a estabilizar, mas nenhum lote é obrigado a fechar em 50%.'
  :'D · Nenhum lançamento ainda. R · frequência = caras ÷ total. E · —. L · Adicione lotes de 50 e observe a curva em relação à linha do modelo (1/2).';
 if(!N){coinDrawn=0;lineBase(host);return}
 const ctx=lineBase(host);
 if(animate===false||!motionOK()){coinDrawn=N;linePoints(ctx,N);return}
 if(coinDrawn>=N){linePoints(ctx,N);return}
 const start=coinDrawn,totalNew=N-start;
 const per=Math.max(6,Math.min(16,Math.floor(800/Math.max(1,totalNew))));
 let i=0;
 const step=()=>{i++;coinDrawn=start+i;linePoints(ctx,coinDrawn);if(i<totalNew)setTimeout(step,per)};
 step();
}

/* ---------------- montagem ---------------- */
function on(id,fn){const b=$(id);if(b)b.addEventListener('click',fn)}
function init(){
 if(!$('pie-svg')&&!$('bar-svg')&&!$('line-svg'))return;
 const pp=$('pie-presets');
 if(pp){
  PRESETS.forEach(p=>{
   const b=document.createElement('button');
   b.className='btn';b.type='button';b.textContent=p.label;
   b.addEventListener('click',()=>{
    pp.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));
    b.setAttribute('aria-pressed','true');
    pieApply(p);
   });
   if(p.id==='moeda')b.setAttribute('aria-pressed','true');
   pp.append(b);
  });
 }
 for(let i=0;i<3;i++){
  const inp=$('pie-in-'+i);
  if(inp){inp.value=pieData.vals[i];inp.addEventListener('input',()=>pieDraw(true))}
 }
 buildDie($('bar-die'));buildCoin($('line-coin'));
 const fb=$('feedback');
 if(fb&&window.MutationObserver){
  let prev=fb.dataset.kind;
  new MutationObserver(()=>{if(fb.dataset.kind==='confirm'&&prev!=='confirm'){confetti();logEv('confete_acerto')}prev=fb.dataset.kind}).observe(fb,{attributes:true,attributeFilter:['data-kind']});
 }
 pieDraw(true);diceDraw(true);coinDraw(true);
 on('pie-say',()=>{const s=$('pie-status');if(s)say(s.textContent)});
 on('bar-30',()=>diceRoll(30));
 on('bar-300',()=>diceRoll(300));
 on('bar-1000',()=>diceRoll(1000));
 on('bar-reset',diceReset);
 on('bar-say',()=>{const s=$('bar-status');if(s)say(s.textContent)});
 on('line-50',()=>coinAdd(50));
 on('line-reset',coinReset);
 on('line-say',()=>{const s=$('line-status');if(s)say(s.textContent)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
