/* Laboratório do Planeta Terra — Canvas 2D nativo (sem motor externo) + etapas
   acessíveis em DOM. Oito capacidades do investigador: observar, registrar,
   medir, estruturar camadas, ler evidências, atmosfera, modelo × medição e
   planejar a investigação. Modelos com física simplificada correta; nada aqui
   é medição real — o próprio painel é exemplo de representação didática.
   As etapas em botões carregam o mesmo conteúdo e funcionam sem o canvas. */
(()=>{'use strict';
const ETAPAS=[
 {perg:'Capacidade 1 · Observar: qual destes é um fenômeno observável?',opcoes:['A chuva que começou no pátio agora','A opinião de que chuva atrapalha','Um conto sobre uma tempestade'],correta:0,
  certo:'A chuva é o que acontece e dá para observar, descrever e registrar — isso é um fenômeno.',
  errado:'Isso é opinião ou história — não é o acontecimento observável em si.'},
 {perg:'Capacidade 2 · Registrar: o que o caderno de campo precisa ter?',opcoes:['Data, hora, local e descrição do observado','Só um desenho bem feito','A conclusão logo no início'],correta:0,
  certo:'Sem quando e onde, o registro não se compara nem se repete — data, hora, local e descrição completam o dado.',
  errado:'Falta o essencial: sem data e local, ninguém confere nem compara depois.'},
 {perg:'Capacidade 3 · Medir: como saber se o dia esquentou de verdade?',opcoes:['Ler o valor do termômetro e anotar com hora','Sentir com a mão se está quente','Perguntar a quem está de camiseta'],correta:0,
  certo:'O termômetro compara com um padrão e devolve valor conferível: instrumento mede, sentido estima.',
  errado:'Sensação e opinião variam de pessoa para pessoa — não são medição.'},
 {perg:'Capacidade 4 · Estruturar: qual a ordem das camadas, da superfície para o centro?',opcoes:['Crosta → manto → núcleo','Manto → crosta → núcleo','Núcleo → manto → crosta'],correta:0,
  certo:'A casca externa (crosta), a camada mais espessa (manto) e o centro metálico (núcleo) — nessa ordem.',
  errado:'Reveja: a crosta é a mais externa e o núcleo é o centro.'},
 {perg:'Capacidade 5 · Evidências: como se conhece o interior da Terra?',opcoes:['Por ondas de terremotos, material de vulcões e meteoritos','Cavando até o núcleo','Por fotografia direta do interior'],correta:0,
  certo:'As ondas atravessam o planeta e mudam conforme o material — como um raio-X; lava e meteoritos complementam. Evidência indireta é caminho.',
  errado:'O furo mais profundo tem ~12 km — nem a crosta foi vencida. Ninguém fotografou o interior.'},
 {perg:'Capacidade 6 · Atmosfera: o que ela é e do que é feita em maioria?',opcoes:['Camada de gases retida pela gravidade; principalmente nitrogênio (~78%) e oxigênio (~21%)','Parede sólida ao redor do planeta; metade de oxigênio','Nuvem gigante; metade de vapor d\u2019água'],correta:0,
  certo:'Gases presos pela gravidade, rarefazendo com a altitude — e o ar é sobretudo nitrogênio, com oxigênio em segundo.',
  errado:'Não há parede sólida nem metade de vapor: a atmosfera é gás, e nitrogênio domina a mistura.'},
 {perg:'Capacidade 7 · Modelo × medição: o desenho da Terra em corte é…',opcoes:['Representação didática: comunica camadas, mas não está em escala e não é fotografia','Uma foto real do interior do planeta','Uma medição feita com termômetro'],correta:0,
  certo:'O corte comunica a ideia de camadas com cores e espessuras escolhidas — a crosta real tem menos de 1% do raio.',
  errado:'Ninguém fotografou nem mediu o interior com termômetro: é representação para estudo.'},
 {perg:'Capacidade 8 · Planejar: a semana vai medir a poça ao sol e à sombra. O que não pode faltar?',opcoes:['Mesmo copo e cronômetro, horário igual, locais definidos, repetição e registro datado','Medir uma vez só, de qualquer jeito','Cada um estimar com o olhar'],correta:0,
  certo:'Só a condição estudada (sol × sombra) varia; todo o resto controlado e registrado — a diferença se deve ao sol, não ao método.',
  errado:'Sem controle e repetição, a diferença não tem a quem ser atribuída.'}
];
function estadoJogo(){S.jogo||={feitas:0,acertos:0,tentativas:0,errosPorEtapa:{}};if(!S.jogo.errosPorEtapa)S.jogo.errosPorEtapa={};return S.jogo}
function responder(mi,escolha){const j=estadoJogo(),m=ETAPAS[mi];const ok=escolha===m.correta;j.tentativas++;let primeira=false;
 if(!ok){j.errosPorEtapa[mi]=(j.errosPorEtapa[mi]||0)+1}
 else{if(!j.errosPorEtapa[mi]){j.acertos++;primeira=true}j.feitas=Math.max(j.feitas,mi+1)}
 log('jogo_missao',JSON.stringify({missao:mi+1,correta:ok,erros:(j.errosPorEtapa[mi]||0),primeira_tentativa:primeira}));
 if(j.feitas>=ETAPAS.length)log('jogo_concluido',JSON.stringify({acertos:j.acertos,tentativas:j.tentativas}));
 save();return {ok,primeira,concluiu:j.feitas>=ETAPAS.length}}
function statusJogo(t){const el=document.getElementById('jogo-status');if(el)el.textContent=t}
function instrucoes(){return 'Laboratório do Planeta Terra: oito capacidades do investigador, do observar ao planejar. Modelos criados para a prática com física simplificada correta. Leia cada etapa e escolha uma resposta. Errar não desconta pontos e sempre aparece explicação. O painel animado é opcional.'}
document.getElementById('jogo-como').onclick=()=>{statusJogo(instrucoes());speak(instrucoes())};
document.getElementById('jogo-falar').onclick=()=>{const j=estadoJogo();const m=ETAPAS[Math.min(j.feitas,ETAPAS.length-1)];speak(j.feitas>=ETAPAS.length?'Você concluiu as oito capacidades do laboratório.':'Etapa '+(j.feitas+1)+' de 8. '+m.perg)};
document.getElementById('jogo-reiniciar').onclick=()=>{S.jogo={feitas:0,acertos:0,tentativas:0,errosPorEtapa:{}};save();log('jogo_reiniciado');statusJogo('Etapas reiniciadas. Boa investigação!');montarPassos();redesenhar()};
function montarPassos(){const box=document.getElementById('jogo-passos');if(!box)return;box.replaceChildren();
 const j=estadoJogo();ETAPAS.forEach((m,mi)=>{const div=document.createElement('div');div.className='game-missao'+(mi<j.feitas?' concluida':'');
  const tit=document.createElement('h3');tit.textContent=m.perg;div.append(tit);
  const fb=document.createElement('p');fb.setAttribute('role','status');div.append(fb);
  const alts=document.createElement('div');alts.className='game-alts';
  m.opcoes.forEach((t,i)=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.dataset.valor=String(i);
   b.onclick=()=>{if(mi<j.feitas){fb.textContent='Etapa já concluída.';return}const r=responder(mi,i);fb.textContent=r.ok?m.certo:m.errado;if(r.ok){alts.querySelectorAll('button').forEach(x=>x.disabled=true);b.setAttribute('aria-pressed','true');div.classList.add('concluida');redesenhar();if(r.concluiu)statusJogo('Você concluiu as 8 capacidades: '+j.acertos+' acertos de primeira. Siga para os percursos ou refaça o que quiser.')}};
   alts.append(b)});
  div.append(alts);box.append(div)})}
montarPassos();
window.JogoAula={total:ETAPAS.length,corretas:ETAPAS.map(m=>String(m.correta)),valores:(mi)=>ETAPAS[mi].opcoes.map((t,i)=>String(i))};
/* painel opcional em Canvas 2D nativo — sem dependências */
function redesenhar(){
 try{
  const host=document.getElementById('jogo-lab');if(!host)return;
  let cv=host.querySelector('canvas');
  if(!cv){cv=document.createElement('canvas');cv.width=760;cv.height=340;cv.setAttribute('role','img');cv.setAttribute('aria-label','Painel do laboratório do planeta Terra: visualização da etapa atual');host.replaceChildren(cv)}
  const ctx=cv.getContext('2d');
  if(!ctx){statusJogo('O painel animado não carregou neste dispositivo. As etapas em botões abaixo têm o mesmo conteúdo.');return}
  const j=estadoJogo();const etapa=Math.min(j.feitas,7);
  const c=ctx;c.fillStyle='#e0f2fe';c.fillRect(0,0,760,340);
  c.fillStyle='#0c4a6e';c.font='15px Verdana, sans-serif';c.textAlign='left';c.textBaseline='top';
  c.fillText('Painel do laboratório · capacidade '+(etapa+1)+' de 8',16,10);
  c.textAlign='center';c.textBaseline='middle';
  const centro=(texto,y)=>{c.fillStyle='#0c4a6e';c.font='15px Verdana, sans-serif';c.fillText(texto,380,y)};
  if(etapa===0){ // observar: paisagem com fenômenos
   c.fillStyle='#fbbf24';c.beginPath();c.arc(660,70,34,0,Math.PI*2);c.fill();c.strokeStyle='#92400e';c.lineWidth=4;c.stroke();
   c.fillStyle='#cbd5e1';c.beginPath();c.ellipse(150,70,58,26,0,0,Math.PI*2);c.fill();c.strokeStyle='#334155';c.lineWidth=3;c.stroke();
   c.fillStyle='#94a3b8';c.beginPath();c.ellipse(180,84,44,20,0,0,Math.PI*2);c.fill();c.stroke();
   c.fillStyle='#64748b';c.beginPath();c.moveTo(400,150);c.lineTo(430,88);c.lineTo(460,150);c.closePath();c.fill();c.strokeStyle='#1e293b';c.lineWidth=3;c.stroke();
   c.fillStyle='#f97316';c.beginPath();c.moveTo(424,95);c.lineTo(430,60);c.lineTo(436,95);c.closePath();c.fill();
   c.fillStyle='#0ea5e9';c.beginPath();c.ellipse(250,255,52,12,0,0,Math.PI*2);c.fill();c.strokeStyle='#075985';c.lineWidth=3;c.stroke();
   c.fillStyle='#16a34a';c.fillRect(0,268,760,72);c.fillStyle='#166534';c.fillRect(0,268,760,8);
   centro('fenômenos observáveis: nuvem, sol, vulcão ao longe, poça',318);
  }else if(etapa===1){ // registrar: caderno de campo
   c.fillStyle='#fff';c.strokeStyle='#1e293b';c.lineWidth=5;c.fillRect(190,50,380,240);c.strokeRect(190,50,380,240);
   c.fillStyle='#0c4a6e';c.font='bold 16px Verdana';c.fillText('CADERNO DE CAMPO',380,80);
   c.font='14px Verdana';c.fillStyle='#334155';c.textAlign='left';
   ['Data: ____/____  Hora: ____:____','Local: ______________________','Descrição: o que eu observei…','(desenho ou valor medido, se houver)'].forEach((t,i)=>c.fillText(t,215,115+i*42));
   c.textAlign='center';
   centro('registrar é datar, situar e descrever — antes de interpretar',318);
  }else if(etapa===2){ // medir: termômetro
   c.fillStyle='#fff';c.strokeStyle='#1e293b';c.lineWidth=5;c.beginPath();c.roundRect(350,40,60,240,30);c.fill();c.stroke();
   c.fillStyle='#dc2626';c.beginPath();c.arc(380,260,26,0,Math.PI*2);c.fill();c.stroke();
   c.fillRect(368,120,24,145);
   c.strokeStyle='#334155';c.lineWidth=2;c.font='13px Verdana';c.fillStyle='#334155';c.textAlign='right';
   for(let t=0;t<=40;t+=10){const y=250-(t/40)*180;c.beginPath();c.moveTo(356,y);c.lineTo(368,y);c.stroke();c.fillText(t+'°',352,y)}
   c.textAlign='center';c.fillStyle='#0c4a6e';c.font='15px Verdana';
   centro('termômetro: valor em graus, conferível por qualquer pessoa',318);
  }else if(etapa===3){ // estruturar: corte da Terra
   const cx=380,cy=165;
   c.fillStyle='#f59e0b';c.beginPath();c.arc(cx,cy,110,0,Math.PI*2);c.fill();c.strokeStyle='#92400e';c.lineWidth=4;c.stroke();
   c.fillStyle='#ea580c';c.beginPath();c.arc(cx,cy,62,0,Math.PI*2);c.fill();c.stroke();
   c.fillStyle='#fde047';c.beginPath();c.arc(cx,cy,30,0,Math.PI*2);c.fill();c.stroke();
   c.strokeStyle='#0c4a6e';c.lineWidth=8;c.beginPath();c.arc(cx,cy,110,-.6,1.1);c.stroke();
   c.fillStyle='#0c4a6e';c.font='bold 14px Verdana';
   c.fillText('CROSTA (fina!)',cx+128,cy-78);c.fillText('MANTO',cx-2,cy+95);c.fillText('NÚCLEO',cx-2,cy);
   c.font='12px Verdana';c.fillStyle='#475569';
   centro('representação didática: espessuras fora de escala, de propósito',318);
  }else if(etapa===4){ // evidências: ondas sísmicas
   const cx=380,cy=165;
   c.fillStyle='#93c5fd';c.beginPath();c.arc(cx,cy,110,0,Math.PI*2);c.fill();c.strokeStyle='#1e293b';c.lineWidth=4;c.stroke();
   c.strokeStyle='#dc2626';c.lineWidth=3;
   for(const ang of[-0.9,-0.3,0.3,0.9]){c.beginPath();c.arc(cx,cy,70,ang-0.5,ang+0.5);c.stroke()}
   c.fillStyle='#dc2626';c.beginPath();c.arc(cx,cy,8,0,Math.PI*2);c.fill();
   c.fillStyle='#0c4a6e';c.font='13px Verdana';
   c.fillText('epicentro',cx+16,cy+14);c.fillText('ondas atravessam e contam o interior',380,72);
   centro('evidência indireta: o comportamento das ondas revela os materiais',318);
  }else if(etapa===5){ // atmosfera + composição
   const cx=290,cy=170;
   c.fillStyle='#1d4ed8';c.beginPath();c.arc(cx,cy,92,0,Math.PI*2);c.fill();c.strokeStyle='#1e3a8a';c.lineWidth=4;c.stroke();
   c.strokeStyle='#7dd3fc';c.lineWidth=14;c.globalAlpha=.75;c.beginPath();c.arc(cx,cy,102,0,Math.PI*2);c.stroke();c.globalAlpha=1;
   c.fillStyle='#7dd3fc';c.font='12px Verdana';c.fillText('atmosfera',cx,cy-118);
   const px=590,py=170;
   c.fillStyle='#e2e8f0';c.beginPath();c.moveTo(px,py);c.arc(px,py,78,-Math.PI/2,-Math.PI/2+2*Math.PI*.78);c.closePath();c.fill();c.strokeStyle='#334155';c.lineWidth=3;c.stroke();
   c.fillStyle='#38bdf8';c.beginPath();c.moveTo(px,py);c.arc(px,py,78,-Math.PI/2+2*Math.PI*.78,-Math.PI/2+2*Math.PI*.99);c.closePath();c.fill();c.stroke();
   c.fillStyle='#f472b6';c.beginPath();c.moveTo(px,py);c.arc(px,py,78,-Math.PI/2+2*Math.PI*.99,-Math.PI/2+2*Math.PI);c.closePath();c.fill();c.stroke();
   c.fillStyle='#0c4a6e';c.font='13px Verdana';c.fillText('N 78%',px-6,py-34);c.fillText('O 21%',px+34,py+30);c.fillText('outros',px-44,py+44);
   centro('gases retidos pela gravidade: sobretudo nitrogênio, depois oxigênio',318);
  }else if(etapa===6){ // modelo × medição
   const cx=200,cy=170;
   c.fillStyle='#f59e0b';c.beginPath();c.arc(cx,cy,70,0,Math.PI*2);c.fill();c.strokeStyle='#92400e';c.lineWidth=4;c.stroke();
   c.fillStyle='#ea580c';c.beginPath();c.arc(cx,cy,40,0,Math.PI*2);c.fill();c.stroke();
   c.fillStyle='#fde047';c.beginPath();c.arc(cx,cy,18,0,Math.PI*2);c.fill();c.stroke();
   c.fillStyle='#0c4a6e';c.font='bold 14px Verdana';c.fillText('MODELO',cx,258);c.font='12px Verdana';c.fillText('representa, comunica',cx,278);
   c.fillStyle='#fff';c.strokeStyle='#1e293b';c.lineWidth=4;c.beginPath();c.roundRect(500,80,34,150,18);c.fill();c.stroke();
   c.fillStyle='#dc2626';c.fillRect(507,150,20,72);c.beginPath();c.arc(517,224,14,0,Math.PI*2);c.fill();c.stroke();
   c.fillStyle='#0c4a6e';c.font='bold 14px Verdana';c.fillText('MEDIÇÃO',517,258);c.font='12px Verdana';c.fillText('valor, unidade, hora',517,278);
   centro('o desenho não substitui o termômetro: cada um no seu papel',318);
  }else{ // planejar
   c.fillStyle='#fff';c.strokeStyle='#1e293b';c.lineWidth=5;c.fillRect(140,44,480,240);c.strokeRect(140,44,480,240);
   c.fillStyle='#0c4a6e';c.font='bold 15px Verdana';c.fillText('PLANO DA SEMANA: a poça ao sol × à sombra',380,70);
   c.font='13px Verdana';c.fillStyle='#334155';c.textAlign='left';
   ['✓ mesma quantidade de água (copo graduado)','✓ mesmo horário, três dias','✓ locais definidos: sol e sombra','✓ cronômetro para a duração','✓ registro datado de cada medição'].forEach((t,i)=>c.fillText(t,170,105+i*36));
   c.textAlign='center';c.fillStyle='#0c4a6e';
   centro('varia só a condição estudada; todo o resto controlado',318);
  }
  if(j.feitas>=8){c.fillStyle='#0369a1';c.font='13px Verdana';c.fillText('✔ oito capacidades concluídas',380,332)}
 }catch(e){statusJogo('O painel animado não iniciou neste dispositivo. As etapas em botões abaixo têm o mesmo conteúdo.')}
}
redesenhar();
})();
