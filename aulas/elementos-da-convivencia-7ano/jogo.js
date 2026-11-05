/* Elementos da Convivência — DOM nativo (sem motor, sem canvas). Oito situações
   hipotéticas de convivência: identificar problema → observar consequências →
   intervenção fundamentada. Os "elementos" são valores treináveis (respeito,
   escuta, coragem, solidariedade) — nunca características de pessoas ou grupos.
   Situações 100% fictícias; nenhum sofrimento real é pontuado; nenhum material
   do filme Elementos é reproduzido. */
(()=>{'use strict';
const SITUACOES=[
 {cena:'No grupo de mensagens da turma, alguém posta um meme que zomba do sotaque de uma região — e o meme não usa nome de ninguém. Vários respondem com risadas.',
  perg:'Situação 1 · Identificar: qual é o problema central?',opcoes:['Zombar de marca de origem em espaço coletivo, com risadas que normalizam','O meme está mal formatado','O aplicativo permite memes demais'],correta:0,
  certo:'O alvo é uma marca de grupo (origem/fala), em espaço de todos — e as risadas em cadeia transformam a zombaria em coisa normal.',
  errado:'O formato e o aplicativo são detalhes: o problema é o conteúdo e o que ele faz com quem carrega essa marca.'},
 {cena:'A colega dona do sotaque leu tudo. No dia seguinte, pediu para não apresentar o trabalho em voz alta.',
  perg:'Situação 2 · Observar: o que essas consequências mostram?',opcoes:['Efeito real: silêncio, retirada e perda de participação de quem foi atingida','Nada aconteceu de concreto','Ela é que deveria ter treinado a voz'],correta:0,
  certo:'O efeito é observável: quem foi atingida se retrai e perde espaço — é esse registro que fundamenta a intervenção.',
  errado:'O efeito existe e é concreto: participação e presença perdidas são consequências medidas em atos.'},
 {cena:'Você decidiu agir na cena do meme.',
  perg:'Situação 3 · Intervir: qual é a sequência correta?',opcoes:['Acolher a colega, nomear o problema com calma no grupo, guardar as telas e buscar um adulto se persistir','Revidar com memes contra quem postou','Apagar a conversa e não falar nada com ninguém'],correta:0,
  certo:'Acolher, nomear com serenidade, registrar e escalar se precisar: cada passo tem fundamento em efeito observado e direito garantido.',
  errado:'Revanche reproduz o problema; apagar destrói o registro e isola quem foi atingida.'},
 {cena:'No pátio, um estudante novo é chamado de "onome do país dele" em vez do próprio nome — "era pra ficar mais fácil".',
  perg:'Situação 4 · Identificar: o que está em jogo?',opcoes:['Apagar a identidade da pessoa: o nome é a mínima marca de quem ela é','Só um apelido carinhoso','Um problema de memória dos colegas'],correta:0,
  certo:'O nome é parte da identidade; substituí-lo por um rótulo coletivo apaga a pessoa — e "facilitar" nunca precisa de apelido imposto.',
  errado:'Apelido imposto que apaga o nome não é carinho: é apagamento.'},
 {cena:"A turma vai montar o mural sobre convivência. Alguém sugere desenhar 'todos iguais, sem diferenças nenhuma'.",
  perg:'Situação 5 · Analisar: a sugestão resolve?',opcoes:['Não: apagar as diferenças apaga as pessoas — o respeito está em representá-las com protagonismo, sem caricatura','Sim: é a solução perfeita','É igual, tanto faz'],correta:0,
  certo:'Igualar apagando não é respeito: é invisibilidade. Representar bem é mostrar a diversidade real, com protagonismo e sem caricatura.',
  errado:'"Sem diferenças" soa bonito, mas nega identidades reais — e quem some do mural também some da convivência.'},
 {cena:'Um colega repete uma "verdade" sobre um grupo: "eles não se esforçam". Um professor mostra os dados históricos de acesso à escola e ao trabalho.',
  perg:'Situação 6 · Dialogar: como usar os dados?',opcoes:['Como evidência de terreno desigual construído pela história — não de mérito diferente entre grupos','Como prova de que o grupo se esforça menos','Como números sem relação com o assunto'],correta:0,
  certo:'Os dados descrevem o terreno (quem teve acesso ao quê, geração após geração); ler como mérito individual culpabiliza quem foi excluído.',
  errado:'Essa leitura transforma efeito em culpa — é o erro clássico que sustenta o racismo estrutural.'},
 {cena:'Durante o intervalo, você vê um estudante sendo deixado de fora de um jogo "porque gente como ele joga mal". Ele finge que nem queria jogar.',
  perg:'Situação 7 · Intervir: o que fazer primeiro?',opcoes:['Acolher o estudante convidando-o para outra atividade e depois falar do caso com um adulto de confiança','Explicar em voz alta que o critério é racista na frente de todos','Fingir que não viu — ele nem queria jogar'],correta:0,
  certo:'Acolher primeiro (presença real), depois nomear o problema em fórum adequado com mediação adulta: proporção e cuidado.',
  errado:'Expor na hora pode virar briga e recair sobre quem já foi atingido; ignorar deixa o padrão seguir — o "nem queria" é defesa.'},
 {cena:'A turma vai assinar o plano de convivência. Cada grupo propõe um item.',
  perg:'Situação 8 · Agir: qual item é mais forte?',opcoes:['"Nomeamos problemas falando do ato e do efeito, apoiamos quem é atingido e procuramos a rede de confiança da escola quando preciso"','"Todos vão se respeitar"','"Quem errar será punido pela direção"'],correta:0,
  certo:'Compromisso concreto + caminho para nomear + apoio + rede de confiança: plano-ferramenta, que funciona quando precisa.',
  errado:'Frase genérica é enfeite; lista só de punição não constrói caminho — o plano precisa dos elementos juntos.'}
];
function estadoJogo(){S.jogo||={feitas:0,acertos:0,tentativas:0,errosPorEtapa:{}};if(!S.jogo.errosPorEtapa)S.jogo.errosPorEtapa={};return S.jogo}
function responder(mi,escolha){const j=estadoJogo(),m=SITUACOES[mi];const ok=escolha===m.correta;j.tentativas++;let primeira=false;
 if(!ok){j.errosPorEtapa[mi]=(j.errosPorEtapa[mi]||0)+1}
 else{if(!j.errosPorEtapa[mi]){j.acertos++;primeira=true}j.feitas=Math.max(j.feitas,mi+1)}
 log('jogo_missao',JSON.stringify({missao:mi+1,correta:ok,erros:(j.errosPorEtapa[mi]||0),primeira_tentativa:primeira}));
 if(j.feitas>=SITUACOES.length)log('jogo_concluido',JSON.stringify({acertos:j.acertos,tentativas:j.tentativas}));
 save();return {ok,primeira,concluiu:j.feitas>=SITUACOES.length}}
function statusJogo(t){const el=document.getElementById('jogo-status');if(el)el.textContent=t}
function instrucoes(){return 'Elementos da Convivência: oito situações hipotéticas, todas fictícias. Em cada uma, identifique o problema, observe as consequências ou planeje a intervenção. Errar não desconta pontos e sempre aparece explicação. Os elementos da convivência — respeito, escuta, coragem e solidariedade — são valores que se treinam. Nenhum sofrimento real é pontuado.'}
document.getElementById('jogo-como').onclick=()=>{statusJogo(instrucoes());speak(instrucoes())};
document.getElementById('jogo-falar').onclick=()=>{const j=estadoJogo();const m=SITUACOES[Math.min(j.feitas,SITUACOES.length-1)];speak(j.feitas>=SITUACOES.length?'Você concluiu as oito situações do jogo.':'Situação '+(j.feitas+1)+' de 8. '+m.perg)};
document.getElementById('jogo-reiniciar').onclick=()=>{S.jogo={feitas:0,acertos:0,tentativas:0,errosPorEtapa:{}};save();log('jogo_reiniciado');statusJogo('Situações reiniciadas. Boa análise!');montarPassos()};
function montarPassos(){const box=document.getElementById('jogo-passos');if(!box)return;box.replaceChildren();
 const j=estadoJogo();SITUACOES.forEach((m,mi)=>{const div=document.createElement('div');div.className='game-missao'+(mi<j.feitas?' concluida':'');
  const cena=document.createElement('p');cena.className='game-cena';cena.textContent=m.cena;div.append(cena);
  const tit=document.createElement('h3');tit.textContent=m.perg;div.append(tit);
  const fb=document.createElement('p');fb.setAttribute('role','status');div.append(fb);
  const alts=document.createElement('div');alts.className='game-alts';
  m.opcoes.forEach((t,i)=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.dataset.valor=String(i);
   b.onclick=()=>{if(mi<j.feitas){fb.textContent='Situação já concluída.';return}const r=responder(mi,i);fb.textContent=r.ok?m.certo:m.errado;if(r.ok){alts.querySelectorAll('button').forEach(x=>x.disabled=true);b.setAttribute('aria-pressed','true');div.classList.add('concluida');if(r.concluiu)statusJogo('Você concluiu as 8 situações: '+j.acertos+' acertos de primeira. Siga para os percursos ou refaça o que quiser.')}};
   alts.append(b)});
  div.append(alts);box.append(div)})}
montarPassos();
window.JogoAula={total:SITUACOES.length,corretas:SITUACOES.map(m=>String(m.correta)),valores:(mi)=>SITUACOES[mi].opcoes.map((t,i)=>String(i))};
})();
