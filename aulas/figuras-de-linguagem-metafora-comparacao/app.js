"use strict";
let D,S,index=0,resetting=false;const $=id=>document.getElementById(id);let key,sound=false,voices=[],utterances=[],audioContext;
function toast(t){$('toast').textContent=t;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,4200)}
function save(){if(resetting)return;try{localStorage.setItem(key,JSON.stringify(S))}catch(e){toast('Não foi possível salvar neste navegador. Baixe o relatório antes de sair.')}}
function log(type,detail=''){S.events.push({at:new Date().toISOString(),type,detail});save()}
function ear(type){if(!sound||window.speechSynthesis?.speaking)return;try{audioContext||=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.connect(g);g.connect(audioContext.destination);o.frequency.value=({descoberta:420,conexao:550,confirmacao:660,revisao:330,conclusao:880})[type]||440;g.gain.setValueAtTime(.035,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.16);o.start();o.stop(audioContext.currentTime+.17)}catch(e){}}
function theme(t){document.documentElement.dataset.theme=t;try{localStorage.setItem(key+':theme',t)}catch(e){}document.querySelectorAll('[data-theme-button]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.themeButton===t));}
function stop(){window.speechSynthesis?.cancel();utterances=[];}
function loadVoices(){if(!('speechSynthesis'in window)){$('voiceSelect').disabled=true;return}voices=speechSynthesis.getVoices().filter(v=>/^pt[-_]/i.test(v.lang));voices.sort((a,b)=>(/pt-BR/i.test(b.lang)?4:0)+(/natural|google|microsoft/i.test(b.name)?2:0)-(/pt-BR/i.test(a.lang)?4:0)-(/natural|google|microsoft/i.test(a.name)?2:0));const old=$('voiceSelect').value;$('voiceSelect').replaceChildren();if(!voices.length){const o=document.createElement('option');o.textContent='Voz padrão do dispositivo';$('voiceSelect').append(o)}voices.forEach((v,i)=>{const o=document.createElement('option');o.value=i;o.textContent=v.name+' · '+v.lang;$('voiceSelect').append(o)});if(old&&voices[+old])$('voiceSelect').value=old;}
function speak(text){if(!('speechSynthesis'in window)){toast('Voz indisponível; o texto permanece acessível.');return}stop();const chunks=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text];utterances=chunks.map(t=>{const u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';u.voice=voices[+$('voiceSelect').value]||null;u.rate=+$('rate').value;return u});let i=0;function next(){if(i>=utterances.length)return;const u=utterances[i++];u.onend=next;speechSynthesis.speak(u)}next();log('voz',text.slice(0,80))}
function done(){return S.records.filter(r=>r.correct).length}
function record(){return `ESCOLA: ${D.escola}\nTURMA: ${D.turma}\nCOMPONENTE: ${D.componente}\nDATA PREVISTA: ${D.data}\nTÍTULO: ${D.titulo}\nRESUMO: ${D.resumo}\nHABILIDADE: ${D.habilidades.join('; ')}\nMETODOLOGIA: exposição didática, exploração visual, 26 percursos com pistas, recuperação e transferência.\nAVALIAÇÃO: explicação oral, relações identificadas, primeira resposta, apoios e domínio após revisão.\nSTATUS: PLANEJADA. ${D.continuidade}`}
async function copy(t){try{await navigator.clipboard.writeText(t);toast('Texto copiado.')}catch(e){$('reportText').value=t;$('reportPanel').open=true;$('reportText').focus();$('reportText').select();toast('Selecione o texto e use Copiar.')}}
function map(labels){const wrap=document.createElement('div');wrap.className='map';const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 680 225');svg.setAttribute('role','img');svg.setAttribute('aria-label',labels.join(' se relaciona a '));labels.forEach((l,i)=>{const x=i===0?10:i===1?235:460,r=document.createElementNS(ns,'rect');r.setAttribute('x',x);r.setAttribute('y',40);r.setAttribute('width',210);r.setAttribute('height',135);r.setAttribute('rx',14);r.setAttribute('class','box');svg.append(r);const words=l.split(' '),lines=[];let line='';for(const w of words){if((line+' '+w).length>21){lines.push(line);line=w}else line+=(line?' ':'')+w}if(line)lines.push(line);lines.forEach((s,j)=>{const t=document.createElementNS(ns,'text');t.setAttribute('x',x+105);t.setAttribute('y',80+j*25);t.setAttribute('text-anchor','middle');t.setAttribute('font-size',18);t.textContent=s;svg.append(t)});if(i<2){const a=document.createElementNS(ns,'path');a.setAttribute('d',`M ${x+211} 108 h 13 m -6 -6 l 6 6 -6 6`);svg.append(a)}});wrap.append(svg);return wrap}
function selectScene(i){const item=D.exploracao[i];$('sceneTitle').textContent=item[0]+' · '+item[1];$('sceneText').textContent=item[2];document.querySelectorAll('#sceneButtons button').forEach((b,j)=>b.classList.toggle('active',i===j));if(!S.scenes.includes(i))S.scenes.push(i);log('exploracao',item[0]);ear('descoberta')}
function render(){const total=D.percursos.length,n=done();$('fill').style.width=n/total*100+'%';$('progress').setAttribute('aria-valuenow',n);$('progressLabel').textContent=n+' de '+total+' concluídos';$('summary').textContent=`Progresso: ${n}/${total}. A nota será liberada depois da avaliação final.`;
$('menu').replaceChildren();D.percursos.forEach((m,i)=>{let b=document.createElement('button');b.className='btn'+(index===i?' current':'');b.textContent=(S.records[i].correct?'✓ ':'')+String(i+1).padStart(2,'0')+' · '+m.titulo;b.disabled=i>0&&!S.records[i-1].correct;b.setAttribute('aria-current',index===i?'step':'false');b.onclick=()=>{index=i;S.index=i;log('revisita',i+1);render();$('mission').scrollIntoView()};$('menu').append(b)});
const m=D.percursos[index],r=S.records[index];$('counter').textContent=`${m.fase} · PERCURSO ${index+1} / ${total}`;$('missionTitle').textContent=m.titulo;$('explanation').textContent=m.explicacao;$('question').textContent=m.pergunta;$('options').replaceChildren();m.alternativas.forEach((text,j)=>{const b=document.createElement('button');b.className='choice'+(r.attempts.at(-1)?.option===j?' selected':'');b.textContent=String.fromCharCode(65+j)+'. '+text;b.disabled=r.correct;b.onclick=()=>answer(j);$('options').append(b)});$('hint').disabled=r.hints>=m.pistas.length;$('hint').textContent=`Abrir pista ${Math.min(r.hints+1,m.pistas.length)} de ${m.pistas.length}`;$('hintText').textContent=m.pistas.slice(0,r.hints).map((x,i)=>`${i+1}. ${x}`).join('\n');$('feedback').dataset.kind=r.correct?'confirm':'review';$('feedback').textContent=r.correct?'E · Conexão reconhecida: '+m.justificativa:(r.attempts.length?'R · Vamos revisar: procure o mecanismo no contexto e teste outra interpretação.':'D · Leia o contexto, compare as alternativas e escolha uma interpretação.');$('prev').disabled=index===0;$('next').disabled=!r.correct;$('next').textContent=index===total-1?'Ver conclusão':'Próximo percurso';$('practical').textContent='Ponto cego: '+m.ponto+' Ação: '+m.acao;$('conclusion').hidden=n!==total;$('email').hidden=n!==total;$('saveNotice').textContent='Progresso salvo somente neste navegador. Em dispositivo compartilhado, baixe seu relatório e apague a sessão ao terminar.';save();}
function answer(j){const m=D.percursos[index],r=S.records[index];if(r.correct)return;const ok=j===m.correta;r.attempts.push({option:j,at:new Date().toISOString(),correct:ok,hintsBefore:r.hints,consultsBefore:S.consults.length});r.correct=ok;log(ok?'acerto':'revisao',index+1);ear(ok?'confirmacao':'revisao');render();}
function fullReport(){let first=S.records.filter(r=>r.attempts[0]?.correct).length,master=done();let lines=[record(),`RELATÓRIO DE APRENDIZAGEM — ${S.experience?.confirmedAt||S.opened}`,`Estudante/código: ${S.name||'Não informado'}`,`Início: ${S.opened}`,`Critério: cada primeiro acerto vale 10 pontos; pistas não descontam. Erros permanecem registrados. Domínio final é apresentado separadamente.`,`Indicador inicial: ${first*10}/${D.percursos.length*10} (${(first/D.percursos.length*10).toFixed(1)}/10). Primeiros acertos: ${first}/${D.percursos.length}.`,`Domínio final: ${master}/${D.percursos.length}. Não substitui explicação oral e avaliação docente.`,`Explorações abertas: ${S.scenes.map(i=>D.exploracao[i][0]).join(', ')||'Nenhuma'}`,`Avaliação do estudante: ${S.rating||'Não informada'}`,''];S.records.forEach((r,i)=>{const m=D.percursos[i];lines.push(`${i+1}. ${m.titulo}`,`Pergunta: ${m.pergunta}`,`Primeira escolha: ${r.attempts.length?m.alternativas[r.attempts[0].option]:'Não respondido'}`,`Primeiro acerto: ${r.attempts.length?(r.attempts[0].correct?'Sim':'Não'):'Não realizado'}; apoio antes da primeira confirmação: ${r.attempts.length?r.attempts[0].hintsBefore+' pistas; '+r.attempts[0].consultsBefore+' consultas acumuladas':'Não registrado'}`,`Tentativas: ${r.attempts.length}; pistas abertas: ${r.hints}; conclusão: ${r.correct?'Sim':'Não'}; recuperação após erro: ${r.correct&&r.attempts[0]&&!r.attempts[0].correct?'Sim':'Não'}`);r.attempts.forEach((a,j)=>lines.push(`  ${j+1}: ${m.alternativas[a.option]} | ${a.correct?'correta':'revisar'} | ${a.hintsBefore} pistas antes | ${a.at}`));lines.push('')});lines.push('CONSULTAS',...S.consults.map(x=>x.at+' | '+x.type+' | '+x.term),'EVENTOS DA PRÓPRIA PÁGINA',...S.events.map(e=>e.at+' | '+e.type+' | '+e.detail),'Mudança de visibilidade não comprova atenção. Não são monitorados outros sites. Os registros ficam neste navegador; não há sincronização ou confirmação de envio.');return lines.join('\n')}
function download(){const txt=fullReport(),u=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=u;a.download='Relatorio_'+D.id+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function email(){const recipient=$('teacherEmail').value.trim();openReportEmail(recipient,D.componente+' | '+D.turma+' | '+D.titulo,fullReport());}
function init(d){D=d;key='andre:aula:'+D.id+':v1';const fresh={version:1,name:'',opened:new Date().toISOString(),index:0,records:D.percursos.map(()=>({attempts:[],hints:0,correct:false})),events:[],consults:[],scenes:[],rating:''};try{S=JSON.parse(localStorage.getItem(key))||fresh}catch(e){S=fresh}if(S.version!==1||S.records?.length!==D.percursos.length)S=fresh;index=Math.max(0,Math.min(S.index,25));if(index>0&&!S.records[index-1].correct)index=0;
$('title').textContent='A Magia das Palavras';$('lead').textContent=D.pergunta;$('meta').textContent=D.escola+' · '+D.componente+' · Turma '+D.turma+' · '+D.data;$('summaryText').textContent=D.resumo;$('skills').textContent=D.habilidades.join(' | ');$('continuity').textContent=D.continuidade;$('teacherEmail').value=S.teacherEmail||'';$('teacherEmail').oninput=()=>{S.teacherEmail=$('teacherEmail').value.trim();save()};$('student').value=S.name;$('student').oninput=()=>{S.name=$('student').value.slice(0,100);save()};$('register').textContent=record();$('copyRegister').onclick=()=>copy(record());
const labels=['D · Dois elementos','R · Semelhança','E · Imagem criada'];$('heroMap').append(map(labels));D.blocos.forEach((b,i)=>{const item=document.createElement('details');item.className='readblock';item.open=i===0;const su=document.createElement('summary');su.textContent=String(i+1).padStart(2,'0')+' · '+b.titulo;const div=document.createElement('div');div.className='reading';const text=document.createElement('p');text.textContent=b.texto;const an=document.createElement('p');an.className='semantic-map';an.textContent=b.ancora;const a=document.createElement('a');a.href=D.fontes[b.fonte][2];a.textContent='Fonte de apoio: '+D.fontes[b.fonte][0]+' — '+D.fontes[b.fonte][1];a.className='source';a.target='_blank';a.rel='noopener';const voice=document.createElement('button');voice.className='btn';voice.textContent='Ouvir este trecho';voice.onclick=()=>speak(b.titulo+'. '+b.texto);div.append(text,an,a,document.createElement('br'),voice);item.append(su,div);item.ontoggle=()=>{if(item.open)log('leitura_bloco',i+1)};$('readingBlocks').append(item)});
$('expandAll').onclick=()=>{$('readingBlocks').querySelectorAll('details').forEach(x=>x.open=true);log('texto_integral')};$('readAll').onclick=()=>speak(D.blocos.map(b=>b.titulo+'. '+b.texto).join('\n'));$('readMission').onclick=()=>speak(D.percursos[index].explicacao+'. '+D.percursos[index].pergunta+'. '+D.percursos[index].alternativas.join('. '));$('stopVoice').onclick=stop;
for(const [id,terms,type]of [['glossary',D.glossario,'glossario'],['dictionary',D.dicionario,'dicionario']])for(const [word,meaning]of Object.entries(terms)){const dt=document.createElement('details');const su=document.createElement('summary');su.textContent=word;const p=document.createElement('p');p.textContent=meaning;dt.append(su,p);dt.ontoggle=()=>{if(dt.open){S.consults.push({at:new Date().toISOString(),type,term:word});log('consulta',word)}};$(id).append(dt)}
D.exploracao.forEach((x,i)=>{const b=document.createElement('button');b.className='btn';b.textContent=x[0];b.onclick=()=>selectScene(i);$('sceneButtons').append(b)});$('sceneTitle').textContent='Abra os cartões para investigar';$('sceneText').textContent='Observe cada informação e compare o que muda de um cartão para outro.';
D.fontes.forEach(s=>{const li=document.createElement('li'),a=document.createElement('a');a.href=s[2];a.textContent=s[0]+' — '+s[1];a.target='_blank';a.rel='noopener';li.append(a);$('sources').append(li)});
$('begin').onclick=()=>{log('inicio_percursos');$('mission').scrollIntoView();$('mission').focus()};$('hint').onclick=()=>{const r=S.records[index];if(r.hints>=D.percursos[index].pistas.length)return;r.hints++;log('pista',`${index+1}:${r.hints}`);ear('conexao');render()};$('prev').onclick=()=>{if(index>0){index--;S.index=index;render();$('mission').scrollIntoView()}};$('next').onclick=()=>{if(!S.records[index].correct)return;if(index===25){log('conclusao');ear('conclusao');$('conclusion').scrollIntoView();return}index++;S.index=index;log('avanco',index+1);render();$('mission').scrollIntoView()};
$('preview').onclick=()=>{$('reportText').value=fullReport();$('reportPanel').open=true};$('copyReport').onclick=()=>copy(fullReport());$('download').onclick=download;$('email').onclick=email;$('reset').onclick=()=>{if(confirm('Baixou seu relatório? Apagar todo o progresso desta aula neste navegador?')){stop();resetting=true;localStorage.removeItem(key);location.reload()}};document.querySelectorAll('[data-rating]').forEach(b=>b.onclick=()=>{S.rating=b.dataset.rating;log('avaliacao',S.rating);toast('Avaliação registrada. Não altera os indicadores.')});
document.querySelectorAll('[data-theme-button]').forEach(b=>b.onclick=()=>theme(b.dataset.themeButton));$('projector').onclick=()=>{document.body.classList.toggle('projector');$('projector').setAttribute('aria-pressed',document.body.classList.contains('projector'))};$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Desativar sons':'Ativar sons';$('sound').setAttribute('aria-pressed',sound)};$('mute').onclick=()=>{sound=false;stop();$('sound').textContent='Ativar sons';$('sound').setAttribute('aria-pressed','false')};$('font').onchange=()=>document.body.style.setProperty('--fs',$('font').value+'px');try{theme(localStorage.getItem(key+':theme')||'light')}catch(e){theme('light')}loadVoices();if('speechSynthesis'in window)speechSynthesis.onvoiceschanged=loadVoices;document.addEventListener('visibilitychange',()=>log(document.hidden?'pagina_oculta':'retorno_visivel'));window.addEventListener('pagehide',()=>{stop();log('saida_pagina')});log(performance.getEntriesByType('navigation')[0]?.type==='reload'?'recarregamento':'abertura');render();}
Promise.resolve({
  "id": "figuras-de-linguagem-metafora-comparacao",
  "escola": "Escola de aplicação a confirmar",
  "turma": "a confirmar",
  "componente": "Língua Portuguesa",
  "data": "a combinar · produção 29/10/2026",
  "titulo": "Quando as palavras criam imagens",
  "pergunta": "Qual é a diferença entre dizer “seu sorriso é como o sol” e “seu sorriso é um sol”?",
  "resumo": "Leitura, interpretação e produção de metáforas e comparações, relacionando elementos, semelhanças e efeitos de sentido.",
  "habilidades": [
    "EF67LP38 — analisar efeitos de sentido de figuras de linguagem (síntese).",
    "EF67LP38RS-1 — interpretar figuras e a construção dos sentidos em diferentes textos (síntese)."
  ],
  "continuidade": "Proposta solicitada para Daiane. Aula planejada, sem aplicação confirmada. Série, turma e escola não informadas; introdução com referência ao 6º/7º ano, sem presumir sequência anterior.",
  "fontes": [
    [
      "SEDUC-RS",
      "Referencial Curricular Gaúcho, Ensino Fundamental: EF67LP38 e EF67LP38RS-1",
      "https://educacao.rs.gov.br/upload/arquivos/202102/17175700-rcg-ef-completo.pdf"
    ],
    [
      "SME Goiânia · Marlon Santos",
      "Língua Portuguesa — Figuras de palavras: comparação e metáfora",
      "https://sme.goiania.go.gov.br/conexaoescola/ensino_fundamental/lingua-portuguesa-figuras-de-palavras-comparacao-e-metafora/"
    ]
  ],
  "blocos": [
    {
      "titulo": "Âncora · Uma frase pode fazer enxergar",
      "texto": "Imagine uma mensagem de agradecimento: “Seu sorriso é como o sol”. Um sorriso pertence ao rosto de alguém; o sol é uma estrela. Mesmo assim, conseguimos relacionar os dois. Nesse contexto, a pessoa sugere que o sorriso traz alegria ou ilumina seu dia. Ela não está fazendo uma afirmação de Astronomia. Está escolhendo uma imagem para comunicar uma impressão. Figuras de linguagem são recursos expressivos que participam dessa construção de sentidos. Hoje vamos estudar duas formas de aproximar elementos: comparação e metáfora. Nosso objetivo vai além de acertar o nome da figura: precisamos reconhecer os elementos aproximados, explicar a semelhança sugerida e perceber o efeito dessa escolha para quem lê. Todos os exemplos e pequenos textos desta aula são criações didáticas, sem atribuição a escritores.",
      "ancora": "D · sorriso e sol → R · alegria/luz sugerida → E · mensagem afetuosa → L · sorriso não é uma estrela.",
      "fonte": 1
    },
    {
      "titulo": "Mecânica · Comece pela situação",
      "texto": "Leia duas frases: “O jardineiro encontrou uma pedra no caminho” e “A falta de tempo é uma pedra no meu caminho”. Na primeira, a situação descreve um objeto concreto que pode dificultar a passagem. Na segunda, o problema é o tempo disponível. A palavra pedra ajuda a representar uma dificuldade. O contexto orienta essa mudança de leitura. Não basta achar uma palavra bonita ou estranha e concluir que existe uma metáfora. Primeiro pergunte o que está acontecendo e se o sentido literal é adequado à situação. Depois procure a relação construída. Quando interpretamos a segunda frase como obstáculo, usamos uma propriedade da pedra no caminho. Não transferimos todas as propriedades de uma rocha para o tempo: não estamos dizendo que ele tem a mesma massa, cor ou composição.",
      "ancora": "Pedra concreta: objeto no chão | Pedra figurada: dificuldade | Relação selecionada: atrapalhar a passagem ou o objetivo.",
      "fonte": 1
    },
    {
      "titulo": "Mecânica · Comparação mostra a ponte",
      "texto": "Na comparação figurada, a semelhança aparece marcada por uma expressão comparativa. Em “a notícia se espalhou como fogo em capim seco”, os elementos são notícia e fogo. O conectivo como explicita a aproximação. A característica relevante é a rapidez de propagação. “Tal qual”, “assim como” e “que nem” também podem indicar esse tipo de relação em construções adequadas. Observe que aproximar dois elementos não significa dizer que são iguais em tudo. Uma notícia pode se espalhar rapidamente sem produzir calor nem queimar plantas. Para analisar, localize os dois elementos, identifique a expressão que os aproxima e explique a característica compartilhada no contexto. Esse caminho oferece uma justificativa para a classificação e evita responder apenas por reconhecer uma palavra isolada.",
      "ancora": "NOTÍCIA — “como” explicita a relação — FOGO | Semelhança: propagação rápida, não combustão real.",
      "fonte": 1
    },
    {
      "titulo": "Mecânica · Metáfora faz a transferência",
      "texto": "Agora leia: “A notícia foi um incêndio no grupo”. Na situação imaginada, uma mensagem gerou muitas reações e se espalhou rapidamente. Incêndio ajuda a compreender a notícia, sem um conectivo comparativo explícito. Essa transferência de sentido por semelhança constitui uma metáfora. Não significa que houve fogo de verdade. Também não precisamos encontrar sempre a forma “uma coisa é outra”. Na expressão “um mar de dúvidas”, o substantivo mar sugere grande quantidade ou extensão de dúvidas. A relação metafórica pode ser construída de outras maneiras. O procedimento continua sendo procurar os elementos e a característica transferida. A classificação é uma consequência dessa análise. Retirar como de uma frase pode ajudar em alguns exemplos iniciais, mas não é uma regra capaz de explicar todas as metáforas.",
      "ancora": "D · dúvidas + mar → R · vastidão/quantidade → E · muitas dúvidas → L · não há água nessa expressão.",
      "fonte": 1
    },
    {
      "titulo": "Circuito · Compare mantendo a mesma imagem",
      "texto": "Vamos manter o tema e mudar apenas a construção: “Minha memória é como um álbum” e “Minha memória é um álbum”. As duas frases aproximam memória e álbum por conservarem lembranças. A primeira apresenta a semelhança de modo explícito; a segunda usa álbum para representar a memória. Essa diferença ajuda a distinguir comparação e metáfora. Ela não estabelece que uma frase seja sempre melhor ou mais bonita. A escolha depende da intenção e do texto. Em uma explicação, a comparação pode deixar uma aproximação mais visível. Em um poema, a metáfora pode condensar uma imagem. Mas ambas podem aparecer em conversas, poemas, relatos e anúncios. Ao reformular, confira se a nova frase continua gramatical e se a imagem ainda faz sentido: mudar um conectivo pode exigir outros ajustes.",
      "ancora": "Comparação: memória + é como + álbum | Metáfora: memória + é + álbum | Nas duas: lembranças conservadas.",
      "fonte": 1
    },
    {
      "titulo": "Circuito · Do nome ao efeito de sentido",
      "texto": "Uma figura não está completa na análise quando apenas escrevemos “metáfora”. Considere o relato fictício: “Antes da apresentação, minha cabeça era um novelo. Depois de ensaiar, consegui organizar as ideias”. Cabeça e novelo se aproximam pelo emaranhado. O segundo período oferece uma pista importante: o ensaio ajudou a desfazer a confusão. Assim, a imagem sugere ideias embaralhadas, não um problema físico na cabeça. Uma boa resposta pode dizer: “É uma metáfora; o novelo representa ideias confusas, e o contraste com organizar as ideias sustenta essa leitura”. O texto permite essa interpretação, mas não autoriza qualquer conclusão. Não podemos inferir uma condição de saúde a partir da imagem. Ao interpretar, indique palavras que sustentam a leitura e reconheça o limite do que foi dito.",
      "ancora": "Trecho → elementos → semelhança → evidência no contexto → efeito de confusão → limite da interpretação.",
      "fonte": 1
    },
    {
      "titulo": "Dialética · Nem todo “como” compara",
      "texto": "A palavra como pode exercer funções diferentes. Em “como você resolveu o problema?”, há uma pergunta sobre o modo de resolver. Em “eu como arroz no almoço”, como é uma forma do verbo comer. Nenhum dos dois casos traz, por essa palavra, uma comparação figurada. Também existem comparações literais: “o lápis azul é tão comprido quanto o vermelho” compara comprimentos observáveis. Na análise de uma figura, procuramos uma aproximação expressiva que constrói uma imagem, como em “as nuvens são como algodão”. Já a ausência de como não transforma toda frase em metáfora. “A mesa é de madeira” informa o material do objeto. Por isso, o teste mecânico “tem como ou não tem?” é insuficiente. A pergunta útil é: quais elementos foram aproximados e que sentido resulta dessa aproximação?",
      "ancora": "COMO: pergunta sobre modo / verbo comer / marca de comparação | Contexto decide. Ausência de “como” não basta.",
      "fonte": 1
    },
    {
      "titulo": "Dialética · Uma imagem admite recortes",
      "texto": "Pense na frase “sua voz é um cobertor”. Em uma cena na qual alguém acalma uma pessoa assustada, cobertor pode sugerir acolhimento e proteção. Em outro texto, detalhes diferentes poderiam orientar outra leitura. Precisamos justificar a interpretação pelo contexto, sem transformar cada substantivo em um código de significado fixo. O mesmo cuidado vale para imagens sobre pessoas. Uma metáfora pode elogiar, criticar, ironizar ou ferir, dependendo da escolha e da situação. Criatividade não elimina responsabilidade. Antes de usar uma imagem para descrever alguém, verifique o que ela sugere e se expõe ou humilha a pessoa. Na nossa oficina, vamos preferir situações fictícias e objetos, sentimentos ou experiências de estudo. Podemos explicar uma ideia com inventividade e respeito ao mesmo tempo.",
      "ancora": "Voz + cobertor → proteção/acolhimento no contexto | Pergunte: qual detalhe sustenta a leitura? Quem pode ser afetado?",
      "fonte": 1
    },
    {
      "titulo": "Aplicação · Oficina de transformação",
      "texto": "Use o laboratório abaixo para transformar uma frase e observar o que muda. Comece escolhendo uma imagem: memória e álbum, ideias e sementes, ou leitura e viagem. Ative e retire a expressão comparativa. Diga em voz alta ou aponte: quais elementos continuam presentes? Qual característica liga os dois? O que mudou na maneira de apresentar a relação? Depois crie uma frase própria. Você pode falar para a professora, apontar cartões ou registrar por escrito, se quiser. Não há uma única imagem correta para uma produção aberta. A qualidade depende de a relação ser compreensível, combinar com a intenção e poder ser explicada. O navegador registra a sua produção opcional, mas a apreciação dessa criação cabe à professora. As perguntas fechadas treinam relações específicas e não substituem essa conversa.",
      "ancora": "Observar → relacionar → comparar versões → explicar efeito → criar → revisar com a professora.",
      "fonte": 1
    },
    {
      "titulo": "Transferência · Volte à pergunta inicial",
      "texto": "Retome “seu sorriso é como o sol” e “seu sorriso é um sol”. Agora você pode identificar sorriso e sol, propor uma característica como alegria ou luminosidade no contexto e explicar a diferença de construção. Na comparação, o conectivo torna explícita a aproximação; na metáfora, o sol representa o sorriso por uma relação figurada. Para verificar se compreendeu além desse exemplo, analise uma imagem nova: “A biblioteca é uma janela para outros mundos”. Janela sugere uma abertura; os outros mundos podem ser experiências e conhecimentos acessados pela leitura. Não se trata de procurar uma abertura física na parede. Se você conseguir explicar essa relação e reformulá-la como comparação, estará aplicando o procedimento a outro contexto. Nos percursos finais, as pistas continuam disponíveis, mas tente primeiro recuperar o caminho com autonomia.",
      "ancora": "Pergunta inicial → explicação com evidência → novo exemplo → reformulação → avaliação docente. Não confunda clique com domínio completo.",
      "fonte": 1
    }
  ],
  "exploracao": [
    [
      "Literal",
      "Uma estrela",
      "O sol é uma estrela. No contexto de uma explicação astronômica, a frase é literal."
    ],
    [
      "Comparação",
      "Seu sorriso é como o sol",
      "A expressão como aproxima sorriso e sol; na mensagem afetuosa, sugere alegria e luminosidade."
    ],
    [
      "Metáfora",
      "Seu sorriso é um sol",
      "Sol representa o sorriso por uma semelhança sugerida; não há identidade física."
    ],
    [
      "Limite",
      "Como você chegou?",
      "Como pergunta o modo de chegar; não aproxima dois elementos por semelhança."
    ]
  ],
  "percursos": [
    {
      "titulo": "O que é aproximado?",
      "fase": "Reconhecer",
      "explicacao": "Mensagem fictícia: “Seu sorriso é como o sol; alegrou minha manhã”.",
      "pergunta": "Quais elementos são aproximados?",
      "alternativas": [
        "Sorriso e sol",
        "Manhã e noite",
        "Mensagem e papel"
      ],
      "correta": 0,
      "justificativa": "Sorriso e sol são ligados por como. A alegria orienta o efeito.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Observe os termos antes e depois de “é como”.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Qual semelhança?",
      "fase": "Reconhecer",
      "explicacao": "Na mesma mensagem, o sorriso alegrou a manhã de quem escreve.",
      "pergunta": "Qual característica sustenta a aproximação com o sol?",
      "alternativas": [
        "Distância entre planetas",
        "Alegria e luminosidade sugeridas",
        "Temperatura medida do rosto"
      ],
      "correta": 1,
      "justificativa": "O contexto afetuoso destaca alegria, não uma medição física.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "A expressão “alegrou minha manhã” oferece a pista.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Ponte explícita",
      "fase": "Reconhecer",
      "explicacao": "“O corredor foi veloz como um raio durante a prova.”",
      "pergunta": "Qual expressão explicita a comparação?",
      "alternativas": [
        "Durante",
        "Corredor",
        "Como"
      ],
      "correta": 2,
      "justificativa": "Como liga a velocidade do corredor à imagem do raio.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Procure a expressão que liga corredor e raio.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Dar nome após analisar",
      "fase": "Reconhecer",
      "explicacao": "“O corredor foi veloz como um raio.” Os elementos foram aproximados pela rapidez.",
      "pergunta": "Qual figura aparece?",
      "alternativas": [
        "Comparação figurada",
        "Metáfora",
        "Descrição apenas literal"
      ],
      "correta": 0,
      "justificativa": "A aproximação figurada está marcada por como.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "A semelhança está explicitada pelo conectivo.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Outra construção",
      "fase": "Reconhecer",
      "explicacao": "Relato fictício: “Na corrida, Bia foi um raio: chegou em um instante”.",
      "pergunta": "Qual análise é adequada?",
      "alternativas": [
        "Comparação marcada por como",
        "Metáfora: raio representa rapidez",
        "Descrição de fenômeno elétrico real"
      ],
      "correta": 1,
      "justificativa": "Raio representa a rapidez de Bia sem conectivo comparativo.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Bia continua sendo uma pessoa no relato.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "O objeto concreto",
      "fase": "Reconhecer",
      "explicacao": "“Há uma pedra pequena dentro do vaso”, informa o jardineiro.",
      "pergunta": "Qual leitura é sustentada?",
      "alternativas": [
        "Pedra significa tristeza",
        "Pedra significa dúvida",
        "Pedra é um objeto concreto"
      ],
      "correta": 2,
      "justificativa": "O contexto do vaso e do jardineiro sustenta o sentido literal.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Não invente um obstáculo emocional ausente do contexto.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Sem verbo ser",
      "fase": "Reconhecer",
      "explicacao": "“Depois da explicação, ainda havia um mar de dúvidas.”",
      "pergunta": "O que a expressão sugere?",
      "alternativas": [
        "Grande quantidade de dúvidas",
        "Dúvidas dentro de água salgada",
        "Comparação explícita por tal qual"
      ],
      "correta": 0,
      "justificativa": "Mar transfere a ideia de vastidão para dúvidas: metáfora.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "A ausência de “é” não impede uma metáfora.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Outra marca comparativa",
      "fase": "Reconhecer",
      "explicacao": "“As nuvens são macias à vista, tal qual algodão.”",
      "pergunta": "Qual análise explica a construção?",
      "alternativas": [
        "Literal: nuvens feitas de tecido",
        "Comparação marcada por tal qual",
        "Metáfora sem marca comparativa"
      ],
      "correta": 1,
      "justificativa": "Tal qual explicita a aproximação visual entre nuvens e algodão.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Observe a expressão de duas palavras que aproxima os termos.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Pergunta sobre modo",
      "fase": "Interpretar e transformar",
      "explicacao": "“Como você preparou a apresentação?”, perguntou a professora.",
      "pergunta": "O que como faz nessa frase?",
      "alternativas": [
        "Compara apresentação e professora",
        "Representa metaforicamente a turma",
        "Pergunta o modo de preparar"
      ],
      "correta": 2,
      "justificativa": "A pergunta procura saber o procedimento, sem aproximar dois elementos.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Que informação a resposta deve fornecer?",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "O verbo comer",
      "fase": "Interpretar e transformar",
      "explicacao": "“Eu como fruta depois do almoço.”",
      "pergunta": "Por que não há comparação figurada por como?",
      "alternativas": [
        "Como é verbo nessa frase",
        "Toda fruta é uma metáfora",
        "A frase não tem a palavra sol"
      ],
      "correta": 0,
      "justificativa": "Como indica a ação de comer, não uma semelhança.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Troque mentalmente por “eu comia fruta”.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Ausência não resolve",
      "fase": "Interpretar e transformar",
      "explicacao": "“A cadeira é de madeira”, informa a ficha do móvel.",
      "pergunta": "Qual conclusão respeita o contexto?",
      "alternativas": [
        "É metáfora porque não tem como",
        "É informação literal sobre material",
        "É comparação de cadeira e árvore"
      ],
      "correta": 1,
      "justificativa": "A ficha identifica o material; ausência de como não comprova metáfora.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "O que uma ficha de móvel costuma informar?",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Comparação de medida",
      "fase": "Interpretar e transformar",
      "explicacao": "“O lápis azul é tão comprido quanto o vermelho.” Ambos foram medidos.",
      "pergunta": "Qual operação está ocorrendo?",
      "alternativas": [
        "Transferência figurada de cor",
        "Metáfora de comprimento",
        "Comparação literal de comprimento"
      ],
      "correta": 2,
      "justificativa": "A medida é comparada diretamente, sem imagem entre domínios diferentes.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Comparar medidas não é automaticamente figura de linguagem.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Explicar o novelo",
      "fase": "Interpretar e transformar",
      "explicacao": "“Antes de ensaiar, minha cabeça era um novelo. Depois organizei as ideias.”",
      "pergunta": "Qual leitura tem evidência no trecho?",
      "alternativas": [
        "Ideias confusas antes do ensaio",
        "Fios de lã reais na cabeça",
        "Uma descrição de penteado"
      ],
      "correta": 0,
      "justificativa": "Organizar as ideias sustenta a relação entre novelo e confusão.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Use a segunda frase para interpretar a primeira.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Selecionar evidência",
      "fase": "Interpretar e transformar",
      "explicacao": "No trecho anterior, a cabeça era um novelo antes de ensaiar.",
      "pergunta": "Qual detalhe sustenta a leitura de confusão de ideias?",
      "alternativas": [
        "A presença da palavra antes apenas",
        "A expressão “organizei as ideias”",
        "A ausência de nomes de pessoas"
      ],
      "correta": 1,
      "justificativa": "O contraste entre confusão e organização fornece a evidência.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Procure o que esclarece a situação mental descrita.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Da metáfora à comparação",
      "fase": "Interpretar e transformar",
      "explicacao": "“Minha memória é um álbum”, pois conserva lembranças.",
      "pergunta": "Qual reformulação explicita a mesma semelhança?",
      "alternativas": [
        "Minha memória guarda álbuns reais",
        "Minha memória não conserva nada",
        "Minha memória é como um álbum"
      ],
      "correta": 2,
      "justificativa": "É como explicita a semelhança e mantém a imagem das lembranças.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Preserve os dois elementos e a característica relevante.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Da comparação à metáfora",
      "fase": "Interpretar e transformar",
      "explicacao": "“A leitura é como uma viagem”, porque permite conhecer outras experiências.",
      "pergunta": "Qual versão mantém a relação em forma metafórica?",
      "alternativas": [
        "A leitura é uma viagem",
        "Viajei lendo uma placa na estrada",
        "A leitura acontece antes da viagem"
      ],
      "correta": 0,
      "justificativa": "Viagem representa a experiência de conhecer por meio da leitura.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Procure uma identificação figurada, não uma situação de transporte.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "O efeito do cobertor",
      "fase": "Interpretar e transformar",
      "explicacao": "Cena fictícia: uma voz calma tranquiliza uma pessoa assustada. “Sua voz é um cobertor.”",
      "pergunta": "Qual efeito é mais sustentado?",
      "alternativas": [
        "Medição de temperatura da voz",
        "Sensação de acolhimento e proteção",
        "Descrição de tecido que produz som"
      ],
      "correta": 1,
      "justificativa": "A cena de tranquilização orienta o sentido de acolhimento.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "O contexto dá uma função protetora à imagem.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "O limite da imagem",
      "fase": "Interpretar e transformar",
      "explicacao": "Na mesma cena, voz e cobertor se aproximam pelo acolhimento.",
      "pergunta": "Qual conclusão ultrapassa o que a metáfora permite?",
      "alternativas": [
        "A voz tranquiliza na cena",
        "A imagem sugere proteção",
        "A voz é feita de lã fisicamente"
      ],
      "correta": 2,
      "justificativa": "A metáfora não transfere a composição material do cobertor para a voz.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Nem todas as propriedades são transferidas.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Ler um anúncio",
      "fase": "Interpretar e transformar",
      "explicacao": "Anúncio fictício de livros: “Uma janela para novos mundos”. A imagem mostra alguém lendo.",
      "pergunta": "Que relação a janela sugere?",
      "alternativas": [
        "Acesso a experiências e conhecimentos",
        "Venda de esquadrias e vidros",
        "Obrigação de ler ao lado de uma janela"
      ],
      "correta": 0,
      "justificativa": "Na situação do anúncio, janela representa uma abertura ao conhecimento.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Combine a frase com o produto anunciado.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Escolha responsável",
      "fase": "Interpretar e transformar",
      "explicacao": "Você quer elogiar a colaboração de uma equipe em um relato escolar.",
      "pergunta": "Qual escolha combina imagem e respeito?",
      "alternativas": [
        "Usar uma ofensa para chamar atenção",
        "“A equipe foi uma ponte entre as ideias”, explicando a cooperação",
        "Descrever colegas com uma imagem humilhante"
      ],
      "correta": 1,
      "justificativa": "Ponte sugere conexão; a explicação da cooperação sustenta o elogio.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Considere tanto o sentido quanto o efeito sobre as pessoas.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Recuperar o procedimento",
      "fase": "Recuperar e transferir",
      "explicacao": "Sem voltar ao exemplo do sol, pense no procedimento de análise.",
      "pergunta": "Qual caminho ajuda a interpretar?",
      "alternativas": [
        "Contar letras e decidir a figura",
        "Procurar só o verbo ser",
        "Situar a frase, ligar elementos e explicar semelhança e efeito"
      ],
      "correta": 2,
      "justificativa": "O contexto e a relação sustentam o nome da figura e sua interpretação.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "O nome vem após observar como a imagem foi construída.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Novo contexto: tecnologia",
      "fase": "Recuperar e transferir",
      "explicacao": "“A senha é uma chave digital que libera o acesso à conta.”",
      "pergunta": "Qual relação sustenta a metáfora?",
      "alternativas": [
        "Permitir acesso",
        "Ter dentes de metal",
        "Precisar de uma fechadura física"
      ],
      "correta": 0,
      "justificativa": "Chave ajuda a compreender a função de acesso da senha, sem identidade material.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Que função uma chave e uma senha podem compartilhar?",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Novo contexto: ideias",
      "fase": "Recuperar e transferir",
      "explicacao": "“As ideias são sementes: precisam de cuidado para se desenvolver.”",
      "pergunta": "Qual interpretação acompanha a explicação?",
      "alternativas": [
        "Ideias são vegetais com raiz real",
        "Ideias podem ser desenvolvidas como algo que cresce com cuidado",
        "Toda ideia fica pronta imediatamente"
      ],
      "correta": 1,
      "justificativa": "Sementes representam possibilidades de desenvolvimento, segundo o contexto.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "O trecho depois dos dois-pontos orienta a interpretação.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Mais de uma figura no texto",
      "fase": "Recuperar e transferir",
      "explicacao": "“A cidade era um forno. As ruas brilhavam como espelhos.”",
      "pergunta": "Qual análise distingue as duas construções?",
      "alternativas": [
        "As duas são literais",
        "Comparação primeiro; metáfora depois",
        "Metáfora primeiro; comparação depois"
      ],
      "correta": 2,
      "justificativa": "Forno representa calor; como explicita a semelhança de brilho com espelhos.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Analise cada frase separadamente, sem classificar o texto inteiro por uma só palavra.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Revisar uma explicação",
      "fase": "Recuperar e transferir",
      "explicacao": "Uma colega diz: “É metáfora porque não tem como”, sobre “minha saudade é um oceano”.",
      "pergunta": "Qual revisão torna a análise suficiente?",
      "alternativas": [
        "Explicar que oceano sugere extensão ou intensidade da saudade no contexto",
        "Repetir apenas que não tem como",
        "Dizer que toda frase sem como é metafórica"
      ],
      "correta": 0,
      "justificativa": "A relação de sentido precisa sustentar a classificação; a ausência do conectivo é insuficiente.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Quais elementos foram relacionados e o que compartilham figuradamente?",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    },
    {
      "titulo": "Aplicar em uma produção",
      "fase": "Recuperar e transferir",
      "explicacao": "Intenção: expressar, em um texto fictício, que a amizade oferece segurança durante dificuldades.",
      "pergunta": "Qual frase realiza a intenção e justifica a relação?",
      "alternativas": [
        "“Amizade tem sete letras”, por contar uma palavra",
        "“A amizade é um porto”, porque sugere abrigo nas dificuldades",
        "“Como escrevo amizade?”, por perguntar a grafia"
      ],
      "correta": 1,
      "justificativa": "Porto representa abrigo; a justificativa liga a imagem à intenção comunicativa.",
      "pistas": [
        "Localize os elementos e considere a situação descrita.",
        "Procure uma imagem com relação explicável à segurança desejada.",
        "Compare com “a memória é como um álbum”: o conectivo explicita a semelhança. Em “a memória é um álbum”, a relação é metafórica."
      ],
      "ponto": "Decidir apenas por uma palavra isolada.",
      "acao": "Nomeie os elementos, explique a semelhança e confira o contexto."
    }
  ],
  "glossario": {
    "Metáfora": "Uma expressão constrói um sentido por semelhança com outro domínio: “a memória é um álbum”. Não é identidade literal.",
    "Comparação figurada": "Aproxima explicitamente elementos de domínios diferentes: “a memória é como um álbum”.",
    "Literal": "Sentido compatível com a situação concreta: “este álbum tem fotografias”.",
    "Efeito de sentido": "A imagem, impressão ou interpretação sugerida pela escolha das palavras em um contexto.",
    "Conectivo comparativo": "Expressão que marca semelhança, como “tal qual”, “que nem” ou “como”, quando exerce essa função."
  },
  "dicionario": {
    "Implícito": "Não está dito diretamente; precisa ser compreendido no contexto.",
    "Explícito": "Está expresso de forma direta.",
    "Associar": "Relacionar dois elementos segundo algum critério.",
    "Interpretar": "Construir uma explicação apoiada nas palavras e na situação.",
    "Reformular": "Dizer de outra maneira, conferindo se o sentido desejado foi preservado.",
    "Contexto": "As informações ao redor de uma frase e a situação em que é usada."
  }
}).then(d=>init(d)).catch(e=>{document.getElementById("title").textContent=e.message});


function openReportEmail(to, subject, body) {
  const mail = String(to || '').trim();
  if (!/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(mail)) {
    alert('Confirme o endereço do professor. Você pode copiar ou baixar o relatório completo.');
    return;
  }
  body = String(body ?? '');
  subject = String(subject ?? 'Relatório de aula');
  document.getElementById('report-email-options')?.remove();
  const panel = document.createElement('dialog');
  panel.id = 'report-email-options';
  panel.dataset.emailVersion = '2.0.0';
  panel.style.cssText = 'width:min(90vw,720px);max-height:85vh;overflow:auto;padding:24px;border:2px solid #526779;border-radius:12px;background:#fff;color:#172535';
  const title = document.createElement('h2'); title.textContent = 'Enviar relatório ao professor';
  const info = document.createElement('p');
  info.textContent = 'Destinatário: ' + mail + '. Confira o relatório e envie pelo seu e-mail. Esta página não confirma envio nem recebimento.';
  const preview = document.createElement('textarea');
  preview.value = body; preview.readOnly = true;
  preview.setAttribute('aria-label','Relatório completo para copiar');
  preview.style.cssText='width:100%;box-sizing:border-box;min-height:180px;color:#172535;background:white';
  const status = document.createElement('p'); status.setAttribute('role','status');
  const shortGmail = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(mail) + '&su=' + encodeURIComponent(subject);
  const gmail = shortGmail + '&body=' + encodeURIComponent(body);
  const shortMailto = 'mailto:' + mail + '?subject=' + encodeURIComponent(subject);
  const mailto = shortMailto + '&body=' + encodeURIComponent(body);
  // Limite conservador de transporte, não limite do texto preservado na prévia/TXT.
  const maxUrl = 1800;
  const longReport = gmail.length > maxUrl || mailto.length > maxUrl;
  status.textContent = longReport
    ? 'O relatório é longo demais para uma abertura confiável pelo endereço do e-mail. Use Copiar relatório e abrir Gmail; depois cole no corpo da mensagem (Ctrl+V). Ou baixe o TXT e anexe manualmente. O relatório permanece completo.'
    : 'Você pode abrir a mensagem preenchida. Se preferir, copie o texto ou baixe o TXT. Confira tudo antes de enviar.';
  function button(label, fn) {
    const b=document.createElement('button'); b.type='button'; b.textContent=label;
    b.style.cssText='margin:5px;padding:10px;cursor:pointer'; b.onclick=fn;panel.append(b);return b;
  }
  function launch(url) {
    const a=document.createElement('a'); a.href=url; a.target='_blank'; a.rel='noopener noreferrer';
    document.body.append(a); a.click(); a.remove();
  }
  function selectReport() { preview.focus(); preview.select(); preview.setSelectionRange(0,preview.value.length); }
  function copyReportText(afterCopy) {
    selectReport();
    let copied=false;
    try { copied=document.execCommand('copy')===true; } catch (_) {}
    const success=()=>{status.textContent=afterCopy;};
    const failure=()=>{status.textContent=copied?afterCopy:'A cópia automática não foi confirmada. Volte a esta janela, selecione o relatório e use Ctrl+C (ou Copiar). Depois cole no corpo do e-mail. Você também pode baixar o TXT.';};
    if(navigator.clipboard?.writeText) navigator.clipboard.writeText(body).then(success).catch(failure);
    else if(copied)success();else failure();
  }
  panel.append(title,info,preview,status);
  // Nunca navegar com um corpo grande: um aviso sozinho não impede o erro de URL.
  if (!longReport) {
    button('Abrir Gmail com relatório',()=>{launch(gmail);status.textContent='Abertura solicitada. Confira a mensagem antes de enviar; se nada abriu, use a opção de copiar abaixo.';});
    button('Abrir aplicativo de e-mail',()=>{launch(mailto);status.textContent='Abertura solicitada. Se não houver aplicativo configurado, use Gmail ou baixe o TXT.';});
  }
  button('Copiar relatório e abrir Gmail',()=>{
    // Abrir endereço curto no próprio clique evita depender de pop-up após await.
    copyReportText('Relatório completo copiado. Na mensagem do Gmail, clique no corpo e use Ctrl+V (ou Colar). Confira e envie. Se a aba não abriu, use Abrir Gmail para colar.');
    launch(shortGmail);
  });
  button('Copiar relatório completo',()=>copyReportText('Relatório completo copiado. Abra o e-mail, cole no corpo da mensagem, confira e envie.'));
  button('Abrir Gmail para colar',()=>{launch(shortGmail);status.textContent='Gmail solicitado com destinatário e assunto. Cole o relatório completo no corpo da mensagem (Ctrl+V). Se a aba foi bloqueada, use o link abaixo.';});
  const link=document.createElement('a');link.href=shortGmail;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Abrir Gmail pelo link direto (colar o relatório)';link.style.cssText='display:block;margin:12px 5px;color:#154c92;text-decoration:underline';panel.append(link);
  button('Baixar relatório TXT',()=>{
    const url=URL.createObjectURL(new Blob([body],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='relatorio-completo.txt';
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    status.textContent='Download solicitado. No Gmail, anexe o TXT manualmente antes de enviar. O arquivo contém o relatório completo.';
  });
  button('Fechar',()=>{panel.close();panel.remove();});
  document.body.append(panel);panel.showModal();
}


// Complemento da aula 29/10: avaliação obrigatória e relatório com apoios de leitura.
const experienceQuestions=[['leitura','Como foi ler os textos?',['Fácil','Em parte fácil','Difícil','Não sei avaliar']],['organizacao','Você encontrou textos, atividades e apoios?',['Sim','Em parte','Não','Não usei essas partes']],['navegacao','Conseguiu ir e voltar pelas partes permitidas?',['Sim','Em parte','Não','Não testei']],['controles','Conseguiu usar os botões e ajustes de que precisava?',['Sim','Em parte','Não','Não usei']],['fonte','Ao trocar a fonte, como ficou a leitura?',['Mais confortável','Sem diferença percebida','Menos confortável','Não troquei','Não sei avaliar']],['espacamento','Ao ajustar tamanho ou espaçamento, como ficou a leitura?',['Mais confortável','Sem diferença percebida','Menos confortável','Não ajustei','Não sei avaliar']],['imagens','As representações ajudaram a acompanhar a explicação?',['Ajudaram','Em parte','Atrapalharam','Não percebi diferença','Não usei']],['dificuldades','Onde encontrou dificuldade?',['Texto','Organização','Botões','Fontes ou ajustes','Imagens','Áudio','Tela','Outra','Não percebi dificuldade']],['sugestao','Quer sugerir algo?',['Quero comentar','Não tenho sugestão agora']]];
function missingExperience(){return experienceQuestions.filter(([id,,opts])=>!(id==='dificuldades'?(Array.isArray(S.experience.answers[id])&&S.experience.answers[id].length>0&&S.experience.answers[id].every(x=>opts.includes(x))&&!(S.experience.answers[id].includes('Não percebi dificuldade')&&S.experience.answers[id].length>1)):opts.includes(S.experience.answers[id]))||(id==='sugestao'&&S.experience.answers[id]==='Quero comentar'&&!S.experience.comment?.trim())).map(q=>q[0])}
function resultReady(){return done()===D.percursos.length&&missingExperience().length===0&&S.experience.confirmed===true}
function resultGuard(){if(resultReady())return true;toast('Complete os percursos e todas as perguntas da avaliação; depois confirme.');$('experience').scrollIntoView();return false}
const baseRender=render;render=function(){baseRender();if(!S.experience||!$('experienceStatus'))return;$('conclusion').hidden=!resultReady();if(!resultReady()){$('reportText').value='Resultado ainda não liberado.';$('reportPanel').open=false;document.getElementById('report-email-options')?.remove();}$('experience').hidden=done()!==D.percursos.length;$('email').hidden=!resultReady();$('experienceStatus').textContent=resultReady()?'Avaliação confirmada. Nota e relatório liberados.':'Responda às nove perguntas e confirme. Perguntas pendentes: '+missingExperience().length;};
const baseReport=fullReport;fullReport=function(){if(!resultReady())return 'Resultado ainda não liberado. Complete os percursos, responda à avaliação e confirme.';return baseReport()+'\n\nEXPERIÊNCIA COM O ARTEFATO\nVersão: 1.0.0 | Prompt: 2.20.0 | Questionário: 1.1.0\n'+experienceQuestions.map(([id,label])=>label+' '+S.experience.answers[id]).join('\n')+'\nComentário: '+(S.experience.comment||'Não fornecido')+'\nConfirmação: '+S.experience.confirmed+'\nPreferências atuais de leitura: '+JSON.stringify(window.ReadingPanel?.preferences()||'não disponíveis')+'\nFonte solicitada e ajustes não constituem diagnóstico. Carregamento da fonte: '+(document.getElementById('reading-panel-host')?.shadowRoot?.getElementById('rp-font-status')?.textContent||'não verificado')+'\nAparência: '+document.documentElement.dataset.theme+' | Voz selecionada: '+$('voiceSelect').selectedOptions[0]?.textContent+' | Velocidade: '+$('rate').value+' | Sons: '+sound+'\nOpiniões não alteram a nota; não há envio automático ou confirmação de recebimento.'};
const baseInit=init;init=function(d){baseInit(d);S.experience||={answers:{},confirmed:false};const section=document.createElement('section');section.id='experience';section.className='panel';section.innerHTML='<h2>Como este material funcionou para você?</h2><p>Suas respostas sinceras ajudarão a pesquisar e melhorar os próximos materiais. Pode dizer o que ajudou, atrapalhou ou não fez diferença. Esta avaliação não altera sua nota. Para concluir e liberar nota e relatório, responda a todas as perguntas e confirme. Não é preciso informar diagnóstico.</p>';
for(const [id,label,opts] of experienceQuestions){const field=document.createElement('fieldset');field.innerHTML='<legend>'+label+'</legend>';for(const value of opts){const l=document.createElement('label'),input=document.createElement('input');input.type=id==='dificuldades'?'checkbox':'radio';input.name='exp-'+id;input.value=value;input.checked=id==='dificuldades'?(Array.isArray(S.experience.answers[id])&&S.experience.answers[id].includes(value)):S.experience.answers[id]===value;input.onchange=()=>{if(id==='dificuldades'){let chosen=[...field.querySelectorAll('input:checked')].map(x=>x.value);if(value==='Não percebi dificuldade'&&input.checked){chosen=[value];field.querySelectorAll('input').forEach(x=>x.checked=x.value===value)}else if(input.checked){chosen=chosen.filter(x=>x!=='Não percebi dificuldade');field.querySelector('input[value="Não percebi dificuldade"]').checked=false}S.experience.answers[id]=chosen}else S.experience.answers[id]=value;S.experience.confirmed=false;$('exp-comment').hidden=S.experience.answers.sugestao!=='Quero comentar';log('experiencia',id);render()};l.append(input,document.createTextNode(' '+value));field.append(l)}section.append(field)}
const comment=document.createElement('textarea');comment.id='exp-comment';comment.placeholder='O que deseja sugerir?';comment.setAttribute('aria-label','Sua sugestão');comment.value=S.experience.comment||'';comment.hidden=S.experience.answers.sugestao!=='Quero comentar';comment.oninput=()=>{S.experience.comment=comment.value;S.experience.confirmed=false;save();render()};const confirmButton=document.createElement('button');confirmButton.className='btn primary';confirmButton.id='confirmExperience';confirmButton.textContent='Confirmar avaliação e liberar resultado';const status=document.createElement('p');status.id='experienceStatus';status.setAttribute('role','status');confirmButton.onclick=()=>{if(done()!==D.percursos.length||missingExperience().length){toast('Há perguntas pendentes. Responda a todas; se quiser comentar, escreva ou escolha não tenho sugestão.');const id=missingExperience()[0];section.querySelector('[name="exp-'+id+'"]')?.focus();return}S.experience.confirmed=true;S.experience.confirmedAt=new Date().toISOString();log('experiencia_confirmada');render();$('conclusion').scrollIntoView()};section.append(comment,status,confirmButton);$('conclusion').before(section);
$('preview').onclick=()=>{if(resultGuard()){$('reportText').value=fullReport();$('reportPanel').open=true}};$('copyReport').onclick=()=>{if(resultGuard())copy(fullReport())};$('download').onclick=()=>{if(resultGuard())download()};$('email').onclick=()=>{if(resultGuard())email()};const oldNext=$('next').onclick;$('next').onclick=()=>{if(index===25&&S.records[index].correct){$('experience').scrollIntoView();return}oldNext()};
installLanguageLab();render();};

function installLanguageLab(){
 const first=document.querySelector('main .panel'),simple=document.createElement('button');simple.className='btn';simple.textContent='Leitura simples';simple.setAttribute('aria-pressed','false');simple.onclick=()=>{document.body.dataset.letteringSimple=String(document.body.dataset.letteringSimple!=='true');simple.setAttribute('aria-pressed',document.body.dataset.letteringSimple)};first.querySelector('h1').before(simple);
 const lab=document.createElement('section');lab.className='panel';lab.id='language-lab';lab.innerHTML='<p class="eyebrow">Oficina · Observe o que muda</p><h2>Uma imagem, duas construções</h2><p>Escolha os elementos e transforme a frase. Explique a relação para a professora. Não há mudança literal de um objeto em outro.</p><label>Imagem <select id="pair"><option value="0">Memória e álbum</option><option value="1">Ideias e sementes</option><option value="2">Leitura e viagem</option></select></label><div class="nav"><button class="btn" id="asComparison">Mostrar comparação</button><button class="btn" id="asMetaphor">Mostrar metáfora</button><button class="btn" id="hearPhrase">Ouvir a relação</button></div><figure id="pairFigure"></figure><h3 id="phrase" aria-live="polite"></h3><p id="relation"></p><h3>Crie e explique</h3><p>Invente uma metáfora ou comparação sobre estudo, amizade ou natureza. Indique os elementos, a semelhança e o efeito desejado. Pode falar, apontar ou pedir que a professora registre. O navegador não julga a qualidade de sua criação.</p><label>Registro opcional <textarea id="ownPhrase" maxlength="2000" placeholder="Se quiser, registre sua frase e explique a relação."></textarea></label><p>Não inclua dados pessoais de colegas.</p>';document.getElementById('explore').after(lab);
 const pairs=[['Minha memória','um álbum','Conservar lembranças. O álbum representa recordações; não significa que a memória tenha folhas de papel.','memoria'],['As ideias','sementes','Desenvolver possibilidades com cuidado. Ideias não são plantas físicas.','ideias'],['A leitura','uma viagem','Conhecer outras experiências. Ler não exige deslocamento físico.','leitura']];
 S.language||={pair:0,comparison:true,production:''};document.getElementById('pair').value=S.language.pair;document.getElementById('ownPhrase').value=S.language.production;
 function update(){const v=pairs[S.language.pair],plural=S.language.pair===1;document.getElementById('phrase').textContent=v[0]+(plural?' são':' é')+(S.language.comparison?' como ':' ')+v[1]+'.';document.getElementById('relation').textContent=(S.language.comparison?'Comparação: a relação é explícita. ':'Metáfora: a relação é figurada e implícita. ')+v[2];document.getElementById('pairFigure').replaceChildren();if(window.ImageLearningScene){const scene=window.ImageLearningScene(v[3],v[0]+' e '+v[1]+': '+v[2]);scene.style.maxHeight='240px';document.getElementById('pairFigure').append(scene)}save()}
 document.getElementById('pair').onchange=()=>{S.language.pair=+document.getElementById('pair').value;update();log('oficina_imagem',S.language.pair)};
 for(const [id,mode]of [['asComparison',true],['asMetaphor',false]])document.getElementById(id).onclick=()=>{S.language.comparison=mode;update();log('oficina_construcao',mode?'comparacao':'metafora')};document.getElementById('hearPhrase').onclick=()=>speak(document.getElementById('phrase').textContent+'. '+document.getElementById('relation').textContent);document.getElementById('ownPhrase').oninput=()=>{S.language.production=document.getElementById('ownPhrase').value;save()};update();window.addEventListener('load',update);
 const link=document.createElement('a');link.href='#language-lab';link.className='btn';link.textContent='Oficina de frases';first.querySelector('nav').append(link);
}
const languageReport=fullReport;fullReport=function(){const text=languageReport();return resultReady()?text+'\n\nOFICINA DE METÁFORA E COMPARAÇÃO\n'+JSON.stringify(S.language,null,2)+'\nProdução aberta a avaliar pela professora; não corrigida automaticamente.':text;};

