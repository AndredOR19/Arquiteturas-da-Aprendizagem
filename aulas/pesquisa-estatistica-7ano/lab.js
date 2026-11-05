/* Laboratório dos Dados — p5.js 2.3.4 (vendado) + etapas acessíveis em DOM.
   Dez etapas: pergunta → variáveis → planejar coleta → dados fictícios → tabela →
   gráfico adequado → construir/manipular → interpretar → limites → conclusão.
   Dados fictícios (30 respondentes: ônibus 12, a pé 10, carro 6, bicicleta 2;
   tempos em minutos 5–45). O painel p5 é visualização opcional; as etapas em
   botões carregam o mesmo conteúdo e funcionam sem o motor. */
(()=>{'use strict';
const ETAPAS=[
 {perg:'Etapa 1 · A pergunta: qual delas pode ser respondida coletando dados?',opcoes:['Quanto tempo, em minutos, os alunos levam para chegar à escola?','Qual é o melhor meio de transporte que existe?','Por que as pessoas se atrasam tanto?'],correta:0,
  certo:'Essa: ela diz o que medir (tempo) e em quem (alunos). Pergunta pesquisável é a que dados conseguem responder.',
  errado:'Essa pergunta pede opinião ou explica causas — a pesquisa começa pelo que dá para observar e contar.'},
 {perg:'Etapa 2 · A variável “meio de transporte” (ônibus, a pé, carro, bicicleta) é…',opcoes:['Categórica: categorias sem ordem numérica','Numérica: valores medidos em números','Nenhuma: transporte não se pesquisa'],correta:0,
  certo:'Categórica — as respostas são rótulos que agrupam; a análise conta quantos há em cada um.',
  errado:'Reveja os valores possíveis: são nomes de categorias, sem soma nem média possível.'},
 {perg:'Etapa 3 · E a variável “tempo de deslocamento, em minutos”?',opcoes:['Numérica: admite ordem, soma e média','Categórica: cada minuto é um rótulo','Igual à anterior'],correta:0,
  certo:'Numérica — minutos podem ser ordenados e operados; é por isso que se calcula média e amplitude.',
  errado:'Minutos não são rótulos: 15 e 40 têm ordem e admitem contas com sentido.'},
 {perg:'Etapa 4 · O 7º ano tem 120 alunos. Para uma estimativa rápida, a turma consulta 30 de duas turmas. Isso é…',opcoes:['Amostra: parte da população, escolhida para representar o todo','Censo: todos são consultados','Um erro: só vale perguntar a todos'],correta:0,
  certo:'Amostra — e a conclusão vale como estimativa, com o limite declarado no relatório.',
  errado:'Consultar 30 de 120 não é censo; é amostra, e ela pede ressalva de generalização.'},
 {perg:'Etapa 5 · Os 30 registros fictícios aparecem no painel. O que cada cartão representa?',opcoes:['Uma resposta: o valor da variável para um participante','A média da turma','Uma categoria de transporte'],correta:0,
  certo:'Cada cartão é um dado bruto; os resumos (tabela, média) vêm depois, organizando esses registros.',
  errado:'Média e categorias são resumos posteriores — aqui cada cartão é uma resposta individual.'},
 {perg:'Etapa 6 · Contando os registros: ônibus 12, a pé 10, carro 6, bicicleta 2. Essa contagem é…',opcoes:['A tabela de frequência: quantas vezes cada categoria apareceu','A frequência relativa em porcentagem','A ordem de chegada das respostas'],correta:0,
  certo:'A tabela de frequência resume os 30 registros — e 12+10+6+2 fecha em 30, a conferência do total.',
  errado:'Frequência é contagem; porcentagem e ordem de chegada são outras coisas.'},
 {perg:'Etapa 7 · Para a variável categórica “meio de transporte”, o gráfico adequado é…',opcoes:['Barras (ou setores), que comparam categorias','Linha, que mostra evolução no tempo','Qualquer um colorido'],correta:0,
  certo:'Barras comparam frequências; setores mostram partes do total — os dois respeitam a variável categórica.',
  errado:'Linha pressupõe sequência temporal, que não existe entre categorias; cor não corrige a escolha.'},
 {perg:'Etapa 8 · No painel, reordene as barras (maior→menor) e troque o tipo de gráfico. O que acontece com 12, 10, 6 e 2?',opcoes:['Nada: muda a apresentação, os dados continuam os mesmos','As frequências mudam conforme a ordem','O total de respondentes muda'],correta:0,
  certo:'Manipular a forma não altera o conteúdo: as frequências e o total 30 são invariantes.',
  errado:'A ordem e o tipo de gráfico não mexem nas contagens nem no total.'},
 {perg:'Etapa 9 · Ônibus teve 12 de 30 (40%). Qual frase interpreta corretamente?',opcoes:['O meio mais frequente foi ônibus, com 12 de 30 (40%)','A maioria dos alunos usa ônibus','Todos preferem ônibus'],correta:0,
  certo:'Preciso: 40% é a maior parcela — maioria seria mais da metade (acima de 50%).',
  errado:'40% não é maioria: maioria exige mais da metade dos 30, ou seja, mais de 15.'},
 {perg:'Etapa 10 · Para o relatório final, o que não pode faltar?',opcoes:['Pergunta, variáveis, método, tabela, gráfico, conclusão justificada e limites da amostra','Somente o gráfico final','Somente a conclusão'],correta:0,
  certo:'O relatório comunica a pesquisa inteira — quem lê pode conferir o caminho dos dados e os limites declarados.',
  errado:'Gráfico ou conclusão sozinhos não sustentam decisão: método e limite fazem parte.'}
];
function estadoJogo(){S.jogo||={feitas:0,acertos:0,tentativas:0,errosPorEtapa:{}};if(!S.jogo.errosPorEtapa)S.jogo.errosPorEtapa={};return S.jogo}
function responder(mi,escolha){const j=estadoJogo(),m=ETAPAS[mi];const ok=escolha===m.correta;j.tentativas++;let primeira=false;
 if(!ok){j.errosPorEtapa[mi]=(j.errosPorEtapa[mi]||0)+1}
 else{if(!j.errosPorEtapa[mi]){j.acertos++;primeira=true}j.feitas=Math.max(j.feitas,mi+1)}
 log('jogo_missao',JSON.stringify({missao:mi+1,correta:ok,erros:(j.errosPorEtapa[mi]||0),primeira_tentativa:primeira}));
 if(j.feitas>=ETAPAS.length)log('jogo_concluido',JSON.stringify({acertos:j.acertos,tentativas:j.tentativas}));
 save();return {ok,primeira,concluiu:j.feitas>=ETAPAS.length}}
function statusJogo(t){const el=document.getElementById('jogo-status');if(el)el.textContent=t}
function instrucoes(){return 'Laboratório dos Dados: dez etapas, da pergunta à conclusão, com dados fictícios de uma pesquisa sobre o deslocamento até a escola. Leia cada etapa e escolha uma resposta. Errar não desconta pontos e sempre aparece explicação. O painel animado é opcional.'}
document.getElementById('jogo-como').onclick=()=>{statusJogo(instrucoes());speak(instrucoes())};
document.getElementById('jogo-falar').onclick=()=>{const j=estadoJogo();const m=ETAPAS[Math.min(j.feitas,ETAPAS.length-1)];speak(j.feitas>=ETAPAS.length?'Você concluiu as dez etapas do laboratório.':'Etapa '+(j.feitas+1)+' de 10. '+m.perg)};
document.getElementById('jogo-reiniciar').onclick=()=>{S.jogo={feitas:0,acertos:0,tentativas:0,errosPorEtapa:{}};save();log('jogo_reiniciado');statusJogo('Etapas reiniciadas. Boa investigação!');montarPassos();window.__labRedraw&&window.__labRedraw()};
function montarPassos(){const box=document.getElementById('jogo-passos');if(!box)return;box.replaceChildren();
 const j=estadoJogo();ETAPAS.forEach((m,mi)=>{const div=document.createElement('div');div.className='game-missao'+(mi<j.feitas?' concluida':'');
  const tit=document.createElement('h3');tit.textContent=m.perg;div.append(tit);
  const fb=document.createElement('p');fb.setAttribute('role','status');div.append(fb);
  const alts=document.createElement('div');alts.className='game-alts';
  m.opcoes.forEach((t,i)=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.dataset.valor=String(i);
   b.onclick=()=>{if(mi<j.feitas){fb.textContent='Etapa já concluída.';return}const r=responder(mi,i);fb.textContent=r.ok?m.certo:m.errado;if(r.ok){alts.querySelectorAll('button').forEach(x=>x.disabled=true);b.setAttribute('aria-pressed','true');div.classList.add('concluida');window.__labRedraw&&window.__labRedraw();if(r.concluiu)statusJogo('Você concluiu as 10 etapas: '+j.acertos+' acertos de primeira. Siga para os percursos ou refaça o que quiser.')}};
   alts.append(b)});
  div.append(alts);box.append(div)})}
montarPassos();
window.JogoAula={total:ETAPAS.length,corretas:ETAPAS.map(m=>String(m.correta)),valores:(mi)=>ETAPAS[mi].opcoes.map((t,i)=>String(i))};
/* visualização opcional em p5 — mesmo conteúdo das etapas */
const DADOS={categorias:[['Ônibus',12,'#fde68a'],['A pé',10,'#bbf7d0'],['Carro',6,'#bfdbfe'],['Bicicleta',2,'#f9a8d4']],tempos:[5,10,10,15,15,15,20,20,20,20,25,25,25,25,25,30,30,30,30,35,35,35,40,40,45,12,18,22,28,32]};
if(typeof p5==='undefined'){statusJogo('O painel animado não carregou nesta página. As etapas em botões abaixo têm o mesmo conteúdo.');}
else{try{
 window.__labRedraw=null;
 const sketch=p=>{p.setup=()=>{const c=p.createCanvas(760,340);c.parent('jogo-lab');p.textFont('Verdana');};
  p.draw=()=>{const j=estadoJogo();const etapa=Math.min(j.feitas,9);p.background(240,253,244);p.fill(15,23,42);p.textSize(15);p.textAlign(p.LEFT,p.TOP);
   p.text('Painel do laboratório · etapa '+(etapa+1)+' de 10',16,10);
   p.textAlign(p.CENTER,p.CENTER);
   if(etapa===0){p.textSize(14);p.text('Pergunta da pesquisa fictícia:',380,60);p.textSize(17);p.text('“Quanto tempo os alunos do 7º ano levam\npara chegar à escola — e por qual meio?',380,140);p.textSize(13);p.text('População: 120 alunos · Amostra: 30 respondentes fictícios',380,250)}
   else if(etapa===1||etapa===2){p.textSize(14);p.text(etapa===1?'Variável categórica: categorias':'Variável numérica: minutos',380,55);
    if(etapa===1){const cs=['ônibus','a pé','carro','bicicleta'];cs.forEach((c2,i)=>{p.fill(255);p.stroke(30,41,59);p.rect(90+i*150,110,130,60,8);p.noStroke();p.fill(15,23,42);p.text(c2,90+i*150+65,140)})}
    else{p.stroke(30,41,59);p.line(120,220,640,220);p.noStroke();for(let m2=0;m2<=45;m2+=5){const x=120+m2*11.5;p.line(x,215,x,225);if(m2%15===0){p.fill(15,23,42);p.text(m2+' min',x,245)}p.stroke(30,41,59)}p.noStroke();p.fill(15,23,42);p.text('cada marca é um valor possível, em ordem',380,170)}}
   else if(etapa===3){p.textSize(14);p.text('Censo × amostra',380,55);p.stroke(30,41,59);p.noFill();p.rect(100,90,220,180,10);p.rect(440,90,220,180,10);p.noStroke();p.fill(15,23,42);p.text('CENSO\ntodos os 120',210,180);p.text('AMOSTRA\n30 de 2 turmas',550,180);p.textSize(12);p.text('exato · demorado',210,255);p.text('estimativa · rápida\n(com limite declarado)',550,255)}
   else if(etapa===4){p.textSize(14);p.text('30 registros fictícios (um cartão por resposta)',380,50);p.textSize(12);let x=40,y=90;DADOS.tempos.forEach((t2,i)=>{p.fill(255);p.stroke(30,41,59);p.rect(x,y,62,40,6);p.noStroke();p.fill(15,23,42);p.text(t2+' min',x+31,y+20);x+=68;if(x>690){x=40;y+=46}});p.textSize(12);p.text('valores variam: 5 a 45 minutos',380,315)}
   else if(etapa===5||etapa===6||etapa===7||etapa===8){p.textSize(14);p.text('Meio de transporte · 30 respondentes fictícios',380,48);
    const L=90,T=80,W=580,H=200,max=12;let x=L+10;
    const ordem=etapa>=7?DADOS.categorias:[...DADOS.categorias].sort((a,b)=>b[1]-a[1]);
    ordem.forEach(([nome,v,cor])=>{const h=v/max*H;p.fill(cor);p.stroke(30,41,59);p.rect(x,T+H-h,110,h);p.noStroke();p.fill(15,23,42);p.text(nome,x+55,T+H+18);p.textSize(13);p.text(v,x+55,T+H-h-12);p.textSize(12);p.text((v/30*100).toFixed(0)+'%',x+55,T+H-h-28);p.textSize(12);x+=145});
    if(etapa===8){p.textSize(13);p.text('barras e setores mostram os mesmos dados: 12, 10, 6, 2 — total 30',380,318)}}
   else if(etapa===9){p.textSize(14);p.text('Interpretação com porcentagem',380,50);p.textSize(16);p.text('ônibus: 12 de 30 = 40% → maior parcela\n(maioria seria mais de 50%)',380,150);p.textSize(13);p.text('amostra: 2 turmas da manhã — estimativa com limite',380,260)}
   else{p.textSize(15);p.text('Relatório: pergunta · variáveis · método · tabela ·\ngráfico · conclusão · limites',380,130);p.textSize(13);p.text('Laboratório concluído: '+j.acertos+' acertos de primeira em 10 etapas',380,260)}
   if(j.feitas>=10){p.fill(21,128,61);p.textSize(13);p.text('✔ dez etapas concluídas',380,320)}};
 };
 new p5(sketch);window.__labRedraw=()=>{try{if(window.__labSketch&&window.__labSketch.redraw)window.__labSketch.redraw()}catch(e){}};
}catch(e){statusJogo('O painel animado não iniciou neste dispositivo. As etapas em botões abaixo têm o mesmo conteúdo.')}}
})();
