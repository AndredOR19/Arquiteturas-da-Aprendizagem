/* Territórios da Independência — jogo de mapa (Phaser 4.2.1 vendado).
   Mapa didático simplificado: representação de estudo, não carta geográfica de precisão.
   A versão em lista (#jogo-lista) espelha as mesmas missões para leitores de tela. */
(()=>{'use strict';
const REGIOES=[
 {id:'norte',nome:'Norte da África',x:40,y:60,w:300,h:90,cor:0xfde68a},
 {id:'oeste',nome:'África Ocidental',x:40,y:165,w:145,h:150,cor:0xbbf7d0},
 {id:'central',nome:'África Central',x:200,y:165,w:145,h:150,cor:0xbfdbfe},
 {id:'oriental',nome:'África Oriental',x:360,y:165,w:145,h:150,cor:0xddd6fe},
 {id:'austral',nome:'África Austral',x:200,y:330,w:305,h:130,cor:0xfed7aa},
 {id:'asia',nome:'Sul e Sudeste Asiático',x:570,y:60,w:150,h:400,cor:0xf9a8d4}
];
const MISSOES=[
 {perg:'Missão 1: clique na região onde fica a Índia, independente do Reino Unido em 1947, por negociação.',tipo:'regiao',alvo:'asia',
  certo:'É isso: a Índia fica no Sul da Ásia. Sua independência (1947) veio por negociação — e veio acompanhada da partição, com custos enormes.',
  errado:'Não é essa. A Índia fica no Sul da Ásia: o bloco alto à direita do mapa. Tente de novo — errar aqui não desconta nada.'},
 {perg:'Missão 2: em 1960, o Ano da África, 17 países novos surgiram. Em qual região ficava a maioria deles?',tipo:'regiao',alvo:'oeste',
  certo:'Correto: a África Ocidental concentrou a maior parte das independências de 1960, como Senegal, Mali e Costa do Marfim.',
  errado:'Quase. A maioria dos 17 países de 1960 ficava na África Ocidental — o bloco verde à esquerda, abaixo do Norte da África.'},
 {perg:'Missão 3: onde fica a Argélia, que conquistou a independência após uma guerra de oito anos (1954–1962) contra a França?',tipo:'regiao',alvo:'norte',
  certo:'Exato: a Argélia fica no Norte da África. Ali a independência veio por uma guerra longa e dura, diferente da negociação indiana.',
  errado:'A Argélia fica no Norte da África: a faixa amarela no topo do mapa. Compare com a Índia: regiões e caminhos diferentes.'},
 {perg:'Missão 4: clique na região da Namíbia, a última colônia africana reconhecida, independente apenas em 1990.',tipo:'regiao',alvo:'austral',
  certo:'Isso: a Namíbia fica na África Austral. 1990 mostra que o processo se estendeu por décadas depois do Ano da África.',
  errado:'A Namíbia fica na África Austral: o bloco largo na parte de baixo do mapa. Trinta anos depois de 1960, ainda havia colônia.'},
 {perg:'Missão 5: onde fica Gana, que em 1957 tornou-se a primeira colônia britânica da África subsaariana a conquistar a independência?',tipo:'regiao',alvo:'oeste',
  certo:'Correto: Gana (1957) fica na África Ocidental — o mesmo recanto que concentraria o Ano da África três anos depois.',
  errado:'Gana fica na África Ocidental: o bloco verde à esquerda. Lembre: 1957, negociação com o Reino Unido.'},
 {perg:'Missão 6: onde fica a Etiópia, sede da Organização da Unidade Africana (1963), que não foi colônia de forma duradoura?',tipo:'regiao',alvo:'oriental',
  certo:'Exato: a Etiópia fica na África Oriental e sediou a organização que uniu os países novos do continente.',
  errado:'A Etiópia fica na África Oriental: o bloco lilás à direita do centro. Ali também ficou a sede da unidade africana.'},
 {perg:'Missão 7: onde ficava o Congo Belga, que em 1960 tornou-se independente como República Democrática do Congo?',tipo:'regiao',alvo:'central',
  certo:'Correto: o Congo Belga ficava na África Central — independência em 1960, seguida de crise e conflito com intervenções externas.',
  errado:'O Congo fica na África Central: o bloco azul no meio do mapa. Um caso de 1960 que logo virou tabuleiro da Guerra Fria.'},
 {perg:'Missão 8 (final): qual par mostra caminhos DIFERENTES de independência?',tipo:'escolha',
  opcoes:['Índia (1947, negociação) e Argélia (1962, guerra)','Gana (1957) e Gana (1957)','Angola (1975) e Angola (1975)'],correta:0,
  certo:'Resposta completa: datas e caminhos diferentes — exatamente o que impede a história única da descolonização.',
  errado:'O par repetido mostra um único caso. Procure o par com datas e caminhos diferentes: negociação e guerra.'}
];
function estadoJogo(){S.jogo||={feitas:0,acertos:0,tentativas:0,errosPorMissao:{}};if(!S.jogo.errosPorMissao)S.jogo.errosPorMissao={};return S.jogo}
function responder(mi,escolha){const j=estadoJogo(),m=MISSOES[mi];const ok=m.tipo==='regiao'?escolha===m.alvo:escolha===m.correta;j.tentativas++;let primeira=false;
 if(!ok){j.errosPorMissao[mi]=(j.errosPorMissao[mi]||0)+1}
 else{if(!j.errosPorMissao[mi]){j.acertos++;primeira=true}j.feitas=Math.max(j.feitas,mi+1)}
 log('jogo_missao',JSON.stringify({missao:mi+1,correta:ok,erros:(j.errosPorMissao[mi]||0),primeira_tentativa:primeira}));
 if(j.feitas>=MISSOES.length)log('jogo_concluido',JSON.stringify({acertos:j.acertos,tentativas:j.tentativas}));
 save();return {ok,primeira,concluiu:j.feitas>=MISSOES.length}}
function statusJogo(t){const el=document.getElementById('jogo-status');if(el)el.textContent=t}
function instrucoes(){return 'Territórios da Independência. Mapa didático simplificado da África e da Ásia. Leia cada missão e toque na região certa. Errar não desconta pontos e sempre aparece explicação. Você também pode usar a versão em lista, abaixo do mapa.'}
document.getElementById('jogo-como').onclick=()=>{statusJogo(instrucoes());speak(instrucoes())};
document.getElementById('jogo-falar').onclick=()=>{const j=estadoJogo();const m=MISSOES[Math.min(j.feitas,MISSOES.length-1)];speak(j.feitas>=MISSOES.length?'Você concluiu as oito missões. '+m.perg:instrucoes()+' '+m.perg)};
document.getElementById('jogo-reiniciar').onclick=()=>{S.jogo={feitas:0,acertos:0,tentativas:0,errosPorMissao:{}};save();log('jogo_reiniciado');statusJogo('Missões reiniciadas. Boa investigação!');montarLista();if(window.__jogoCena)window.__jogoCena.reiniciar()};
function montarLista(){const box=document.getElementById('jogo-lista');if(!box)return;box.replaceChildren();const aviso=document.createElement('p');aviso.className='notice';aviso.textContent='As mesmas missões em botões, sem o mapa animado. Serve para leitores de tela e para quem prefere texto.';box.append(aviso);
 const j=estadoJogo();MISSOES.forEach((m,mi)=>{const div=document.createElement('div');div.className='game-missao'+(mi<j.feitas?' concluida':'');
  const tit=document.createElement('h3');tit.textContent=m.perg;div.append(tit);
  const fb=document.createElement('p');fb.setAttribute('role','status');div.append(fb);
  const alts=document.createElement('div');alts.className='game-alts';
  const opcoes=m.tipo==='regiao'?REGIOES.map(r=>({v:r.id,t:r.nome})):m.opcoes.map((t,i)=>({v:i,t}));
  const embaralhado=[...opcoes].sort((a,b)=>(a.t>b.t?1:-1));
  embaralhado.forEach(o=>{const b=document.createElement('button');b.className='btn';b.textContent=o.t;b.dataset.valor=String(o.v);
   b.onclick=()=>{if(mi<j.feitas){fb.textContent='Missão já concluída.';return}const r=responder(mi,o.v);fb.textContent=r.ok?m.certo:m.errado;if(r.ok){alts.querySelectorAll('button').forEach(x=>x.disabled=true);b.setAttribute('aria-pressed','true');div.classList.add('concluida');if(r.concluiu)statusJogo('Você concluiu as 8 missões: '+j.acertos+' acertos de primeira. Explore o mapa ou siga para os percursos.')}};
   alts.append(b)});
  div.append(alts);box.append(div)})}
montarLista();
window.JogoAula={total:MISSOES.length,corretas:MISSOES.map(m=>m.tipo==='regiao'?m.alvo:String(m.correta)),valores:(mi)=>MISSOES[mi].tipo==='regiao'?REGIOES.map(r=>r.id):MISSOES[mi].opcoes.map((t,i)=>String(i))};
if(typeof Phaser==='undefined'){statusJogo('O motor do mapa não carregou nesta página. Use a versão em lista abaixo: as missões são as mesmas.');return}
class CenaTerritorios extends Phaser.Scene{
 constructor(){super('territorios')}
 create(){this.rects={};this.missoesText=this.add.text(380,20,'',{fontFamily:'Fredoka, Verdana, sans-serif',fontSize:'17px',color:'#0f172a',wordWrap:{width:700},align:'center'}).setOrigin(0.5,0);
  this.progresso=this.add.text(380,500,'',{fontFamily:'Verdana, sans-serif',fontSize:'14px',color:'#334155'}).setOrigin(0.5,1);
  REGIOES.forEach(r=>{const rect=this.add.rectangle(r.x+r.w/2,r.y+r.h/2,r.w-8,r.h-8,r.cor).setStrokeStyle(3,0x1e293b);
   const rot=this.add.text(r.x+r.w/2,r.y+r.h/2,r.nome,{fontFamily:'Fredoka, Verdana, sans-serif',fontSize:'15px',color:'#0f172a',wordWrap:{width:r.w-20},align:'center'}).setOrigin(0.5);
   rect.setInteractive({useHandCursor:true});rect.on('pointerdown',()=>this.clicar(r.id));this.rects[r.id]={rect,rot}});
  this.opcaoBox=[];for(let i=0;i<3;i++){const y=395+i*0;const b=this.add.rectangle(380,390+i*36,560,30,0xffffff).setStrokeStyle(2,0x1e293b).setInteractive({useHandCursor:true}).setVisible(false);const t=this.add.text(380,390+i*36,'',{fontFamily:'Verdana, sans-serif',fontSize:'14px',color:'#0f172a'}).setOrigin(0.5).setVisible(false);b.on('pointerdown',()=>this.clicar(i));this.opcaoBox.push({b,t})}
  this.continuar=this.add.rectangle(380,300,260,44,0x15803d).setStrokeStyle(3,0x0f172a).setInteractive({useHandCursor:true}).setVisible(false);
  this.continuarT=this.add.text(380,300,'Toque para continuar ▶',{fontFamily:'Fredoka, Verdana, sans-serif',fontSize:'17px',color:'#ffffff'}).setOrigin(0.5).setVisible(false);
  this.continuar.on('pointerdown',()=>this.proxima());
  window.__jogoCena=this;this.mostrar()}
 get mi(){const j=estadoJogo();return Math.min(j.feitas,MISSOES.length-1)}
 reiniciar(){this.mostrar()}
 mostrar(){const j=estadoJogo();const m=MISSOES[this.mi];this.missoesText.setText(j.feitas>=MISSOES.length?'Missões concluídas: '+j.acertos+' de 8 acertos de primeira. Toque em Reiniciar ou siga para os percursos.':m.perg);
  this.progresso.setText('Missão '+Math.min(j.feitas+1,8)+' de 8 · acertos de primeira: '+j.acertos);
  const escolha=m.tipo==='escolha';Object.values(this.rects).forEach(({rect,rot})=>{rect.setVisible(!escolha);rot.setVisible(!escolha);rect.setFillStyle(rect.fillColor,escolha?0.25:1)});
  this.opcaoBox.forEach((o,i)=>{o.b.setVisible(escolha);o.t.setVisible(escolha);if(escolha){o.t.setText(m.opcoes[i])}})}
 clicar(v){const j=estadoJogo();if(j.feitas>=MISSOES.length)return;const mi=this.mi,m=MISSOES[mi];const r=responder(mi,v);statusJogo(r.ok?m.certo:m.errado);speak(r.ok?m.certo:m.errado);
  if(r.ok){if(m.tipo==='regiao'&&this.rects[m.alvo]){this.rects[m.alvo].rect.setFillStyle(0x86efac);this.tweens.add({targets:this.rects[m.alvo].rect,scaleX:1.04,scaleY:1.04,yoyo:true,duration:140})}
   this.continuar.setVisible(true);this.continuarT.setVisible(true)}
  else{if(typeof v==='string'&&this.rects[v]){this.tweens.add({targets:this.rects[v].rect,angle:{from:-2,to:2},yoyo:true,repeat:2,duration:60,onComplete:()=>this.rects[v].rect.setAngle(0)})}}}
 proxima(){this.continuar.setVisible(false);this.continuarT.setVisible(false);Object.values(this.rects).forEach(({rect},id)=>rect.setFillStyle(REGIOES.find(r=>this.rects[r.id]&&this.rects[r.id].rect===rect).cor));this.mostrar();montarLista()}
}
try{new Phaser.Game({audio:{noAudio:true},type:Phaser.AUTO,parent:'jogo-mapa',width:760,height:520,backgroundColor:'#eef7fb',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:CenaTerritorios});}
catch(e){statusJogo('O mapa interativo não iniciou neste dispositivo. Use a versão em lista abaixo: as missões são as mesmas.')}
})();
