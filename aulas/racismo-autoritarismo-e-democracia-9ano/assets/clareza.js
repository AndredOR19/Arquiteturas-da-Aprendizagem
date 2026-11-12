/* Camada de linguagem simples (revisão clareza-2).
   Reescreve, somente para exibição, títulos, comandos, rótulos e prefixos das atividades
   do banco curricular em linguagem direta para a idade; acrescenta a situação de cada caso
   contada em palavras simples, uma frase de abertura e um glossário de palavras difíceis.
   O banco (ids, dados, respostas, quantidades, apoio não leitor) permanece o mesmo. */
(()=>{'use strict';
const C=window.AULA_GEICONTEUDO;if(!C||!C.guidedClarity||C.plain)return;

/* ---------- 1. Perguntas no lugar dos rótulos D/R/E/L, por tipo de aula ---------- */
const DREL={
 data:{dado:'📌 Quais foram os números da pesquisa?',relacao:'💡 O que os números mostram?',efeito:'➡️ Qual é o total e o grupo menor?',limite:'⚠️ Para quem vale esse resultado?'},
 history:{dado:'📌 O que aconteceu? (fato e data)',relacao:'💡 Que ideia esse caso ensina?',efeito:'➡️ O que veio depois?',limite:'⚠️ O que NÃO dá para concluir?'},
 religion:{dado:'📌 Qual é a situação?',relacao:'💡 Que direito ou ideia protege a pessoa?',efeito:'➡️ O que ajuda a resolver?',limite:'⚠️ O que NÃO dá para concluir?'},
 study:{dado:'📌 Com o que estamos trabalhando?',relacao:'💡 Qual é a estratégia (a ideia que ajuda)?',efeito:'➡️ O que a estratégia produz?',limite:'⚠️ O que NÃO dá para concluir?'},
 lab:{dado:'📌 Quais foram as medidas?',relacao:'💡 O que a média mostra?',efeito:'➡️ Qual foi o resultado (a média)?',limite:'⚠️ O que NÃO dá para afirmar?'}};
const Q=DREL[C.kind]||{dado:'📌 O que aconteceu?',relacao:'💡 Qual é a ideia que explica?',efeito:'➡️ O que resulta disso?',limite:'⚠️ Até onde vale a conclusão?'};
const LABEL={'Dado observado':Q.dado,'Relação explicada':Q.relacao,'Efeito ou resultado':Q.efeito,'Limite da conclusão':Q.limite,
 'O que não posso generalizar?':'⚠️ O que vale só para este caso?','Que conclusão cabe aqui?':'💡 O que dá para concluir?',
 'Minha conclusão ficou ampla demais':'Minha conclusão foi longe demais','Não expliquei a ligação':'Não expliquei a ligação entre as ideias'};
const label=s=>LABEL[s]||s.replace(/^O que foi apresentado em (.+)\?$/,'📌 O que aconteceu em «$1»?').replace(/^Não entendi o dado de (.+)$/,'Não entendi os dados de «$1»')
 .replace(/^A fala sobre (.+) não identifica o dado$/,'A fala sobre «$1» não diz quais foram os dados').replace(/^A fala apresenta certeza além da fonte$/,'A fala afirma mais do que a fonte mostra').replace(/^A fala lista fatos sem relacionar$/,'A fala só lista fatos, sem explicar a ligação')
 .replace(/^Retomar: /,'Volte aos dados: ').replace(/^Delimitar: /,'Diga até onde vale: ').replace(/^Reformular: /,'Explique a ideia: ').replace(/^Acrescentar: /,'Acrescente: ');
const sentence=s=>s.replace(/^Apresentar (.+) e sustentar a ligação entre dado e conclusão\.$/,'Apresentar «$1» e mostrar como o dado leva à conclusão.').replace(/^Identificar a origem da afirmação sobre (.+)$/,'Dizer de onde veio a informação sobre «$1»').replace(/^Indicar explicitamente: /,'Dizer claramente o limite: ').replace(/^Registrar (.+)$/,'Anotar o que foi observado: $1')
 .replace(/^Inventar um dado para confirmar a interpretação de (.+)$/,'Inventar um dado para provar a minha ideia sobre «$1»').replace(/^Usar só o cenário de (.+) como prova de compreensão\.$/,'Dizer que entendi só porque vi o cenário de «$1».').replace(/^O levantamento (.+) representa quem não foi consultado\.$/,'A pesquisa «$1» vale também para quem não respondeu.').replace(/^O caso (.+) explica sozinho todos os processos de África e Ásia\.$/,'O caso «$1» explica sozinho tudo o que aconteceu na África e na Ásia.');

/* ---------- 2. Rótulos dos grupos (classificação) ---------- */
const SORT={'Testar o alcance':['✔ É verdade neste caso','✘ Não dá para afirmar'],'Comunicar sem extrapolar':['✔ Os dados mostram isso','✘ Os dados não mostram isso'],
 'Distinguir observar e inventar':['✔ Observar com cuidado','✘ Inventar'],'Validar a síntese do caso':['✔ Mostra que entendi','✘ Não mostra que entendi'],
 'Conferir duas leituras':['✔ Combina com o caso','✘ Precisa corrigir'],'Reconhecer uma extrapolação':['✔ Fica dentro do que sabemos','✘ Exagera, sem prova']};
const SORT_GENERIC={'Sustentado':'✔ Tem base nos dados','Não sustentado':'✘ Não dá para afirmar','Sustentado neste caso':'✔ É verdade neste caso','Compatível com o caso':'✔ Combina com o caso','Exige correção':'✘ Precisa corrigir','Mantém os limites':'✔ Fica dentro do que sabemos','Amplia sem evidência':'✘ Exagera, sem prova'};

/* ---------- 3. Prefixos dos passos (sequências) ---------- */
const PREFIX=[['Situar o caso ','1º — Apresento o caso: '],['Apresentar o dado: ','2º — Digo o que aconteceu: '],['Explicar a relação: ','3º — Explico a ideia: '],['Delimitar a conclusão: ','4º — Digo até onde vale: '],
 ['Localizar a informação: ','Acho a informação: '],['Conferir a ligação com a pergunta de ','Vejo se ela responde à pergunta de '],['Comparar a interpretação com ','Comparo com a ideia: '],['Registrar a restrição: ','Anoto o limite: '],
 ['Reconhecer a informação do caso: ','Começo pelo fato: '],['Explicitar o critério de comparação de ','Digo como vou comparar '],['Construir uma interpretação: ','Explico a ideia: '],['Declarar o alcance: ','Digo até onde vale: '],
 ['Receber outra apresentação do mesmo caso','Vejo o mesmo caso contado de outro jeito'],['Procurar nela uma informação equivalente a ','Procuro nela a mesma informação: '],['Conferir se a relação ','Vejo se a ideia «'],['Manter ou rever a conclusão explicitando ','Mantenho ou corrijo a conclusão, lembrando: ']];
function part(s){for(const [a,b] of PREFIX)if(s.startsWith(a)){let r=b+s.slice(a.length);if(a==='Conferir se a relação ')r=r.replace(/ continua sustentada$/,'» continua valendo');return r;}return s;}

/* ---------- 4. Títulos e comandos ---------- */
const caseOf=t=>C.cases[t.case]?.title||t.context||'';
const numbersOf=t=>[...(t.explain||'').matchAll(/([^,=.;]+?) = (\d+)/g)].map(m=>[m[1].trim(),+m[2]]);
const ensaio=t=>(t.command.match(/ensaio (\d+)/)||[])[1];
const VAR={agitacao:'a agitação (mexer ou não)',temperatura:'a temperatura inicial',sal:'a quantidade de sal',agua:'o volume de água'};
const FRASE={Caminhada:'vão a pé',Ônibus:'vão de ônibus',Bicicleta:'vão de bicicleta',Conto:'preferem conto',HQ:'preferem HQ',Reportagem:'preferem reportagem',Esporte:'usam o pátio para esporte',Conversa:'usam o pátio para conversar',Leitura:'usam o pátio para ler',Reciclável:'separam resíduo reciclável',Orgânico:'separam resíduo orgânico',Rejeito:'separam rejeito',Caderno:'estudam pelo caderno',Livro:'estudam pelo livro',Digital:'estudam no digital',Bebedouro:'bebem água no bebedouro',Garrafa:'trazem garrafa de água',Outro:'bebem água de outro jeito',Semanal:'vão à biblioteca toda semana',Mensal:'vão à biblioteca todo mês',Raro:'quase não vão à biblioteca',Praça:'querem uma praça',Biblioteca:'querem uma biblioteca',Ciclovia:'querem uma ciclovia'};
const frase=l=>FRASE[l]||('escolheram «'+l+'»');const dupla=(a,b)=>{const fa=frase(a),fb=frase(b),w=fa.split(' ')[0];return fa+' ou '+(fb.startsWith(w+' ')?fb.slice(w.length+1):fb);};
const TITLE={
 'Reconstruir o percurso':['Coloque os passos na ordem',t=>'Coloque os passos de «'+caseOf(t)+'» na ordem certa, um de cada vez.'],
 'Conectar dado e explicação':['Ligue cada pergunta à sua resposta',t=>'Para cada pergunta sobre «'+caseOf(t)+'», escolha a frase que responde.'],
 'Testar o alcance':['Isso é verdade neste caso?',()=>'Para cada frase, decida: é verdade neste caso ou não dá para afirmar?'],
 'Preparar uma explicação':['Monte sua explicação em 4 passos',t=>'Monte, na ordem, a sua explicação sobre «'+caseOf(t)+'».'],
 'Conferir a coleta':['Conte as respostas',()=>'Conte quantos cartões há de cada resposta. Toque nos cartões enquanto conta.'],
 'Construir a representação':['Monte o gráfico de barras',()=>'Deixe cada barra do tamanho do número de respostas daquela opção.'],
 'Recuperar o total':['Some tudo: qual é o total?',t=>{const n=numbersOf(t);return n.length===3?'Quantos alunos responderam no total? Some os três grupos: os que '+frase(n[0][0])+', os que '+frase(n[1][0])+' e os que '+frase(n[2][0])+'.':'Some as respostas das três opções. Quantas pessoas responderam no total?';}],
 'Comunicar sem extrapolar':['O que dá para afirmar com esses dados?',()=>'Para cada frase, decida: os dados mostram isso ou não?'],
 'Montar uma comparação controlada':['Mude só uma coisa',t=>'Entre o copo A e o copo B, mude somente '+(VAR[t.data?.variable]||t.data?.variable)+'. Deixe todo o resto igual.'],
 'Descrever as repetições':['Calcule a média',t=>'Calcule a média dos três tempos do ensaio '+ensaio(t)+': some os três e divida por 3.'],
 'Conferir a variação':['Veja a diferença entre as medidas',t=>'Qual é a diferença entre o maior e o menor tempo do ensaio '+ensaio(t)+'?'],
 'Aplicar a contagem em outro problema':['Conte de outro jeito',t=>{const n=numbersOf(t),c=t.command;if(/duas primeiras/.test(c)&&n.length>=2)return 'Quantos alunos '+dupla(n[0][0],n[1][0])+'? Some os dois grupos.';if(/diferença/.test(c))return 'Qual é a diferença entre o grupo maior e o grupo menor? Faça: maior menos menor.';if(/mais três/.test(c))return 'Já temos todas as respostas. Se mais 3 alunos responderem, qual será o novo total? Some tudo e mais 3.';return c;}],
 'Reconhecer a explicação':['Que pergunta esta frase responde?',()=>'Leia a frase. Depois escolha a pergunta que ela responde.'],
 'Separar informação e alcance':['Qual é o fato e qual é o limite?',()=>'Para cada pergunta, escolha a frase que responde: o que aconteceu, ou até onde vale.'],
 'Conferir duas leituras':['Combina com o caso ou precisa corrigir?',()=>'Cada frase combina com o caso ou precisa ser corrigida?'],
 'Escolher a pergunta certa':['Qual trecho responde à pergunta?',()=>'Para cada pergunta, escolha o trecho que a responde.'],
 'Reconhecer uma extrapolação':['Está dentro do que sabemos?',()=>'Cada frase fica dentro do que sabemos ou exagera sem prova?'],
 'Produzir um roteiro de revisão':['Qual ação resolve a dúvida?',()=>'Para cada dúvida, escolha a ação que ajuda a resolver.'],
 'Distinguir observar e inventar':['Isso é observar ou inventar?',()=>'Cada ação é observar com cuidado ou inventar?'],
 'Transferir o procedimento':['Use o mesmo jeito em outra situação',t=>'Coloque na ordem o que você faria se visse «'+caseOf(t)+'» contado de outro jeito.'],
 'Revisar uma fala pública':['O que falta na fala?',()=>'Para cada problema da fala, escolha o que precisa ser acrescentado.'],
 'Validar a síntese do caso':['Isso mostra que entendi o caso?',()=>'Cada frase mostra que a pessoa entendeu o caso, ou não mostra?'],
 'Preparar a conferência':['Monte o roteiro para conferir',t=>'Coloque na ordem os passos para conferir «'+caseOf(t)+'».'],
 'Dado não é conclusão':['Do fato até a conclusão, passo a passo',()=>'Monte o caminho do fato até a conclusão, passo a passo.']};

/* ---------- 5. Aplicação sobre as rotas curriculares (o apoio não é alterado) ---------- */
for(const route of ['principal','exemplos'])for(const t of C.routes[route]||[]){
 t.original={title:t.title,command:t.command};
 const tt=TITLE[t.title];if(tt){t.title=tt[0];t.command=tt[1](t);}
 const d=t.data||{};
 if(t.kind==='match'&&d.pairs)d.pairs=d.pairs.map(p=>[label(p[0]),label(p[1])]);
 if(t.kind==='sort'&&d.labels){const s=SORT[t.original.title];d.labels=s?s.slice():d.labels.map(l=>SORT_GENERIC[l]||l);d.yes=d.yes.map(sentence);d.no=d.no.map(sentence);}
 if(t.kind==='order'&&d.parts)d.parts=d.parts.map(part);
 if(t.kind==='lab'){const w=k=>({agitacao:'a agitação',temperatura:'a temperatura',sal:'a quantidade de sal',agua:'a quantidade de água'})[k]||k;t.relation=(t.relation||'').replace(/^Somente (\w+) deve diferir entre A e B\.$/,(m,k)=>'Só '+w(k)+' pode ser diferente entre o copo A e o copo B.');t.explain=(t.explain||'').replace(/^A pergunta deste caso investiga (\w+)\. Alterar dois fatores impede atribuir a diferença somente a um deles\.$/,(m,k)=>'Neste caso, queremos descobrir o efeito d'+w(k)+'. Se mudarmos duas coisas ao mesmo tempo, não dá para saber qual delas causou a diferença.');}
}

/* ---------- 6. A situação de cada caso em palavras simples ---------- */
const LIMITE_HIST='Atenção: uma data vir depois da outra não prova, sozinha, que uma causou a outra. E um caso não representa todo o continente.';
const HISTORIAS={
 'arquivo-independencias-9ano':[
  {icones:'🇮🇳 1947 ✂️ 📜 1950',texto:'Em 1947, a Índia deixou de ser colônia britânica e ficou independente. No mesmo momento, o território foi dividido em dois países (a partição), com muita violência e milhões de pessoas mudando de lugar. Em 1950, a Índia passou a ter sua própria Constituição republicana. Ideia: um país pode ficar independente e, mesmo assim, viver violência e deslocamentos. '+LIMITE_HIST},
  {icones:'🇩🇿 1954 ⚔️ 1962',texto:'A Argélia era colônia da França. Em 1954 começou uma guerra pela independência, que durou anos. Em 1962, a Argélia ficou independente. Ideia: aqui a independência veio por meio de uma guerra — isso diferencia esse caminho de outros, mais negociados. '+LIMITE_HIST},
  {icones:'🇬🇭 1957 ✊ 🏛️ 1960',texto:'Em 1957, Gana ficou independente do Reino Unido, depois de muita mobilização popular. Em 1960, a ONU aprovou a Resolução 1514, que defendeu o fim do colonialismo. Ideia: os movimentos locais tinham seus próprios projetos e ações; a independência não foi um presente vindo de fora. '+LIMITE_HIST},
  {icones:'🇨🇩 1960 ⚠️ 1961',texto:'Em 1960, o Congo ficou independente da Bélgica. Logo depois veio uma grande crise política e, em 1961, o primeiro-ministro Patrice Lumumba foi morto. Ideia: trocar quem manda (a soberania) não acaba automaticamente com as disputas e as desigualdades. '+LIMITE_HIST},
  {icones:'🇦🇴 1961 🌹 1974 🎉 1975',texto:'Em Angola, a luta armada contra o domínio português começou em 1961. Em 1974, a Revolução dos Cravos derrubou a ditadura em Portugal. Em 1975, Angola ficou independente. Ideia: para entender o caso, é preciso olhar junto a ação dos próprios angolanos e as disputas internacionais da Guerra Fria. '+LIMITE_HIST},
  {icones:'🌏 1955 🤝 1961',texto:'Em 1955, países da Ásia e da África se reuniram na Conferência de Bandung, na Indonésia, para defender sua autonomia diante das grandes potências. Em 1961, em Belgrado, nasceu o Movimento Não Alinhado. Ideia: «não alinhado» não quer dizer sem interesses nem todos iguais — cada país tinha seus objetivos. '+LIMITE_HIST},
  {icones:'🇺🇳 1945 📜 1960 🇳🇦 1990',texto:'A ONU foi fundada em 1945. Em 1960, aprovou a Resolução 1514, que declarou o direito dos povos coloniais à independência. Mas a Namíbia, por exemplo, só ficou independente em 1990. Ideia: uma resolução é um documento com uma regra — não prova que tudo mudou de imediato em todo lugar. '+LIMITE_HIST},
  {icones:'🇳🇦 1960 ⏳ 1988 🎉 1990',texto:'Mesmo depois da Resolução 1514 (1960), a Namíbia continuou sob domínio da África do Sul. Em 1988, acordos abriram caminho para a transição; em 1990 veio a independência. Ideia: os ritmos são diferentes — 1960 não encerra todos os processos de descolonização. '+LIMITE_HIST}],
 'estrategias-de-estudo-8ano':[
  {icones:'🎤 📚 ⚖️',texto:'Você precisa apresentar um seminário comparando duas independências. Tem duas fontes, e cada uma conta um processo. Estratégia: comparar quem agiu (os sujeitos) e como agiu (as estratégias) em cada caso. Ensaiar a fala sem olhar ajuda a ver o que ainda falta. Limite: duas fontes não contam a história de todos os países.'},
  {icones:'🍕 ½ = ¼ + ¼',texto:'Metade de uma pizza (1/2) e dois quartos da mesma pizza (2/4) ocupam o mesmo espaço. Ideia: frações equivalentes dependem de comparar partes do MESMO inteiro. Limite: se os desenhos forem de inteiros diferentes, não dá para comparar.'},
  {icones:'📰 🔍 📄',texto:'Uma notícia diz que «um levantamento mostrou» algo, mas não mostra o documento. Estratégia: descobrir quem publicou e procurar o levantamento original. Isso confirma ou limita o que a notícia afirma. Limite: muita gente compartilhar não prova que é verdade.'},
  {icones:'🥤 🥤 🌀 📝',texto:'Dois copos com a mesma água e o mesmo sal; só um é mexido. Estratégia: manter tudo igual e mudar só uma coisa (a agitação) para ver o efeito dela. Anotar o resultado permite comparar. Limite: um único teste não prova uma regra para sempre.'},
  {icones:'📊 8 · 7 · 5',texto:'Um gráfico mostra 8, 7 e 5 respostas de um grupo. Com a mesma escala dá para comparar as barras; somando, são 20 respostas. Limite: o gráfico não diz nada sobre quem não respondeu.'},
  {icones:'📖 🔤 ✍️',texto:'A palavra «evidência» aparece num texto de História. Estratégia: ver no contexto o que ela significa (a informação que sustenta uma interpretação) e usar a palavra numa frase sua. Limite: copiar a palavra várias vezes não mostra que você entendeu.'},
  {icones:'🧠 🕳️ 🔁',texto:'Você tentou explicar sem consultar e uma parte ficou incompleta. Estratégia: esse «buraco» (a lacuna) mostra exatamente o que estudar; depois, tente outro exemplo sem copiar. Limite: passar horas estudando não garante que aprendeu.'},
  {icones:'📅 🎯 🔄',texto:'Seu plano da semana tem metas e momentos para retomar o conteúdo. Estratégia: metas que dá para ver («vou conseguir explicar X») permitem ajustar o plano pelo que você realmente consegue fazer. Limite: agenda cheia não prova aprendizagem.'}],
 'convivencia-e-dialogo-9ano':[
  {icones:'🙏 🙅 🤝',texto:'Numa atividade coletiva, um colega não quer fazer a oração. Ideia: liberdade de consciência — ele pode participar do grupo sem aderir à oração. Solução: oferecer um jeito de participar sem orar e combinar com todos. Limite: respeitar a escolha dele não nos diz qual é a crença dele — e não precisamos saber.'},
  {icones:'😂 ✋ 💬',texto:'Uma pessoa pediu que parassem de fazer piada com a crença dela. Ideia: a dignidade de alguém limita o que podemos fazer, mesmo de brincadeira. Solução: parar a piada, ouvir como a pessoa se sentiu e reparar o dano. Limite: discordar de uma ideia não autoriza humilhar ninguém.'},
  {icones:'🖼️ 📚 🌍',texto:'Uma exposição na escola descreve tradições religiosas e filosofias de vida. Ideia: usar fontes identificadas e apresentar as perspectivas com cuidado. Mostrar a diversidade dentro de cada tradição evita tratar um grupo como se fosse um bloco só. Limite: uma descrição não representa cada pessoa daquela tradição.'},
  {icones:'🙋 ❤️ 📦',texto:'Um colega sem religião quer participar de uma ação solidária. Ideia: participar não depende de ter religião. Solução: combinar critérios iguais para todos e distribuir as funções sem exigir crença. Limite: não seguir religião não diz nada sobre o caráter de alguém.'},
  {icones:'🗣️ ↔️ 🗣️ 📋',texto:'Duas pessoas discordam de uma ideia e precisam trabalhar juntas. Ideia: discutir ideias sem atacar pessoas preserva a dignidade. Solução: deixar clara a ideia em discussão, ouvir as razões e combinar a tarefa. Limite: cooperar não obriga a concordar com tudo.'},
  {icones:'👂 📦 🏘️',texto:'Uma comunidade pediu materiais específicos para uma ação de ajuda. Ideia: escutar o que as pessoas precisam, em vez de decidir por elas. A ajuda pode atender ao pedido sem exigir que ninguém adote uma religião. Limite: boa intenção não substitui perguntar às pessoas atendidas.'},
  {icones:'📱 ❌ 🔍',texto:'Uma mensagem viral acusa todas as pessoas de um grupo religioso. Ideia: o que uma pessoa fez não sustenta acusar o grupo inteiro. Solução: parar de repassar, procurar a origem e corrigir sem repetir a ofensa. Limite: mensagem viral não é prova sobre um grupo inteiro.'},
  {icones:'📜 👥 ⚖️',texto:'Um grupo precisa combinar regras para lidar com as diferenças. Ideia: regras comuns têm de preservar os direitos também da minoria. Solução: ouvir os pedidos, escrever regras ligadas à dignidade, conferir quem poderia ficar de fora e ajustar. Limite: a maioria votar não torna aceitável humilhar ou forçar alguém.'}]};
function story(i){const c=C.cases[i];if(!c)return null;const fixed=HISTORIAS[C.id]?.[i];if(fixed)return fixed;
 if(C.kind==='data'){const n=[...c.facts.dado.matchAll(/([^,=.;]+?) = (\d+)/g)].map(m=>[m[1].trim(),+m[2]]);if(n.length){const total=n.reduce((s,x)=>s+x[1],0),max=n.reduce((a,b)=>b[1]>a[1]?b:a);return{icones:'📋 ✏️ 📊',texto:'Na pesquisa «'+c.title+'», '+total+' pessoas responderam. '+n.map(x=>x[0]+' = '+x[1]).join(', ')+'. A resposta mais escolhida foi «'+max[0]+'». Somando tudo, dá '+total+'. Atenção: esse resultado vale só para quem respondeu — não para toda a escola nem para a cidade. Os números são inventados para treinar.'};}}
 if(C.kind==='lab'){const m=c.facts.dado.match(/(\d+), (\d+), (\d+) segundos/),media=(c.facts.efeito.match(/é (\d+) segundos/)||[])[1];if(m)return{icones:'🧪 ⏱️ 🧂',texto:'Caso «'+c.title+'»: o copo A foi medido três vezes: '+m[1]+', '+m[2]+' e '+m[3]+' segundos. A média é '+media+' segundos (somamos os três tempos e dividimos por 3). A média resume as medidas, mas elas não são todas iguais. Atenção: esses tempos são simulados — não foram medidos de verdade na bancada.'};}
 return{icones:'📌 💡 ⚠️',texto:c.facts.dado+' '+c.facts.relacao+' '+c.facts.limite};}

/* ---------- 6b. Exemplo resolvido com OUTRO caso: mesma operação, outros dados; o resultado do caso atual só aparece depois da primeira tentativa ---------- */
const stripCases=s=>C.cases.reduce((x,c)=>x.split(c.title).join('<caso>'),String(s||''));
const variantKey=t=>t.kind==='lab'?'lab|'+(t.original?.title||t.title):t.kind+'|'+(t.original?.title||t.title)+'|'+(t.data?.operation||'')+'|'+stripCases(t.original?.command||t.command).replace(/ensaio \d+/,'ensaio').replace(/Pesquisa: .*$/,'');
function sibling(t,bank){const n=C.cases.length,key=variantKey(t);const same=(bank||[]).filter(x=>x!==t&&x.case!==t.case&&variantKey(x)===key&&(t.kind!=='lab'||x.data?.variable!==t.data?.variable));for(let k=1;k<n;k++){const s=same.find(x=>x.case===(t.case+k)%n);if(s)return s;}return same[0]||null;}
function formulaResult(d){const ops=Array.isArray(d.operands)?d.operands:[];if(!ops.length)return '';if(d.operation==='media')return '('+ops.join(' + ')+') ÷ '+ops.length+' = '+d.answer;if(ops.reduce((a,b)=>a+b,0)===d.answer)return ops.join(' + ')+' = '+d.answer;if(Math.max(...ops)-Math.min(...ops)===d.answer)return 'maior − menor: '+Math.max(...ops)+' − '+Math.min(...ops)+' = '+d.answer;return '';}
function example(t,bank){const s=sibling(t,bank);if(!s)return null;const d=s.data||{},caso=C.cases[s.case]?.title||s.context;let texto='';
 if(t.kind==='order')texto=d.parts.map((p,i)=>(i+1)+'º '+p).join('\n');
 else if(t.kind==='match')texto=d.pairs.map(p=>p[0]+'\n   → '+p[1]).join('\n');
 else if(t.kind==='sort')texto=d.labels[0]+': '+d.yes[0]+'\n'+d.labels[1]+': '+d.no[0];
 else if(t.kind==='number')texto=formulaResult(d)?'Como fazer a conta: '+formulaResult(d)+' '+(d.unit||''):'Naquele caso a resposta foi '+d.answer+' '+(d.unit||'');
 else if(t.kind==='bars'||t.kind==='tally')texto=d.labels.map((l,i)=>l+': '+d.values[i]).join(' · ')+'\nCada barra fica com o número de respostas daquela opção.';
 else if(t.kind==='lab')texto='Naquele caso a pergunta era sobre '+(VAR[d.variable]||d.variable)+'. Os dois copos ficaram iguais em tudo; só '+(VAR[d.variable]||d.variable)+' mudou no copo B.';
 else return null;
 return{caso,texto,id:s.id};}

/* ---------- 7. Frase de abertura e glossário ---------- */
const INICIO={'pesquisa-e-dados-7ano':'Hoje você vai ser um pesquisador: contar respostas, montar um gráfico de barras e dizer o que os números mostram — e o que eles não mostram.',
 'estrategias-de-estudo-8ano':'Hoje você vai treinar jeitos de estudar que funcionam: planejar, explicar sem olhar e conferir com evidência. Cada bloco é uma situação de estudo diferente.',
 'arquivo-independencias-9ano':'Hoje você vai investigar como países da África e da Ásia ficaram independentes: colocar fatos na ordem, ligar fato e ideia e dizer até onde vale a conclusão.',
 'convivencia-e-dialogo-9ano':'Hoje você vai pensar em situações reais de convivência: ouvir, respeitar a liberdade de cada pessoa e combinar soluções que não humilhem ninguém.',
 'laboratorio-teste-justo-9ano':'Hoje você vai montar um teste justo: mudar só uma coisa de cada vez, calcular a média das medidas e separar o que foi simulado do que foi medido de verdade.'};
const GLOSSARIO=[[/integralismo|integralista/i,'integralismo','movimento político organizado na AIB em 1932, de inspiração fascista e projeto autoritário. Não se confunde automaticamente com outros regimes.'],[/autoritarismo|autoritário/i,'autoritarismo','forma de exercer poder que reduz a participação e a possibilidade de discordar.'],[/racismo/i,'racismo','tratamento desigual e inferiorização de pessoas e grupos por sua identificação racial.'],[/AI-5/i,'AI-5','ato de 1968 que ampliou os poderes da ditadura e restringiu garantias.'],[/redemocratiza/i,'redemocratização','processo de recuperação e construção da participação e dos direitos democráticos.'],
 [/frequ[êe]ncias?/i,'frequência','quantas vezes algo aparece. Aqui: quantas pessoas deram cada resposta.'],[/\bcenso\b/i,'censo','pesquisa que pergunta para TODAS as pessoas do grupo.'],[/\bamostra\b/i,'amostra','pesquisa que pergunta só para uma parte do grupo, escolhida com critério.'],
 [/categorias?/i,'categoria','cada opção de resposta (por exemplo: caminhada, ônibus, bicicleta).'],[/\bescala\b/i,'escala','os números marcados no gráfico; precisa ser a mesma para todas as barras.'],[/extrapola\w*/i,'extrapolar','ir além do que os dados mostram; concluir mais do que dá para concluir.'],
 [/generaliza\w*/i,'generalizar','pegar o que vale para um caso ou um grupo pequeno e dizer que vale para todos.'],[/sustenta\w*/i,'sustentado','apoiado por dados ou provas. Afirmação sustentada = afirmação que tem base.'],[/\balcance\b/i,'alcance','até onde uma conclusão vale: para quem, para onde, quando.'],
 [/\blimites?\b/i,'limite','o que o dado ou a fonte NÃO permite afirmar.'],[/evid[êe]ncias?/i,'evidência','informação que serve de prova para uma ideia.'],[/\bfontes?\b/i,'fonte','de onde vem uma informação: documento, jornal, pessoa, levantamento.'],[/crit[ée]rios?/i,'critério','a regra usada para decidir ou comparar.'],
 [/\bm[ée]dia\b/i,'média','soma de todos os valores dividida por quantos valores são.'],[/varia[çc][ãa]o/i,'variação','quanto os valores mudam de uma medida para outra.'],[/\bcontrol\w*/i,'controle','manter uma condição igual nos dois copos, para ela não atrapalhar a comparação.'],[/vari[áa]vel/i,'variável','a coisa que muda (ou que decidimos mudar) no teste.'],
 [/\bensaios?\b/i,'ensaio','cada teste feito no laboratório.'],[/repeti[çc][õo]es?/i,'repetição','fazer o mesmo teste de novo para ver se o resultado se repete.'],[/simulad\w*/i,'simulado','feito no computador ou inventado para treinar; não foi medido de verdade.'],[/\bbancada\b/i,'bancada','a mesa do laboratório onde se faz o experimento de verdade.'],[/dissolu\w*/i,'dissolução','quando o sal «some» na água, espalhando-se nela.'],
 [/parti[çc][ãa]o/i,'partição','divisão de um território em partes ou países.'],[/descoloniza\w*/i,'descolonização','processo em que colônias deixam de ser controladas por outro país e ficam independentes.'],[/soberania/i,'soberania','o poder de um país de governar a si mesmo.'],[/metr[óo]pole/i,'metrópole','o país que controla a colônia.'],
 [/resolu[çc][ãa]o/i,'resolução (ONU)','decisão escrita e aprovada pelos países da ONU.'],[/autodetermina\w*/i,'autodeterminação','direito de um povo de decidir o próprio destino.'],[/n[ãa]o alinha\w*/i,'não alinhado','países que não queriam ficar do lado dos EUA nem da União Soviética na Guerra Fria.'],[/guerra fria/i,'Guerra Fria','disputa entre EUA e União Soviética (1947–1991), sem guerra direta entre os dois, mas com conflitos em outros países.'],
 [/normativ\w*/i,'fonte normativa','documento que diz como as coisas DEVEM ser (uma regra), não como elas são de fato.'],[/\bag[êe]ncia local\b/i,'agência local','a capacidade das próprias pessoas e grupos do lugar de agir e decidir.'],[/coexist\w*/i,'coexistir','existir ao mesmo tempo, lado a lado.'],
 [/liberdade de consci[êe]ncia/i,'liberdade de consciência','direito de cada pessoa acreditar (ou não) no que quiser, sem ser forçada.'],[/dignidade/i,'dignidade','o valor de toda pessoa; ninguém pode ser humilhado.'],[/\bades[ãa]o\b/i,'adesão','concordar e entrar em algo. «Sem adesão» = participar sem precisar concordar.'],
 [/constrangimento/i,'constrangimento','situação em que a pessoa se sente forçada ou envergonhada.'],[/coer[çc][ãa]o/i,'coerção','forçar alguém a fazer algo.'],[/convic[çc][ãa]o/i,'convicção','aquilo em que a pessoa acredita com firmeza.'],[/hierarquiza\w*/i,'hierarquizar','colocar em ordem de «melhor» para «pior»; aqui, tratar uma crença como superior a outra.'],[/proselitismo/i,'proselitismo','tentar convencer alguém a mudar de religião.'],
 [/\blacunas?\b/i,'lacuna','uma parte que ficou faltando.'],[/equival[êe]n\w*/i,'equivalente','que vale o mesmo (1/2 e 2/4 são equivalentes).'],[/\binteiro\b/i,'inteiro','o todo que foi dividido em partes.'],[/levantamento/i,'levantamento','pesquisa que reúne informações.'],[/semin[áa]rio/i,'seminário','apresentação oral de um tema para a turma.'],
 [/\bsujeitos?\b/i,'sujeitos','as pessoas ou grupos que agem numa situação.'],[/estrat[ée]gias?/i,'estratégia','o jeito planejado de fazer algo.'],[/s[íi]ntese/i,'síntese','resumo com as ideias principais.'],[/interpreta[çc][ãa]o/i,'interpretação','o sentido que damos ao que lemos ou observamos.'],[/transfer\w*/i,'transferir','usar o que aprendeu em outra situação.'],
 [/procedimento/i,'procedimento','sequência de passos para fazer algo.'],[/delimit\w*/i,'delimitar','marcar até onde vale.'],[/hip[óo]tese/i,'hipótese','uma explicação provisória que ainda vai ser testada.'],[/\bunidades?\b/i,'unidade','a medida que acompanha o número: segundos, mililitros, graus.']];
const words=(C.words||[]).map(w=>[new RegExp('\\b'+w.word.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'),w.word.toLowerCase(),w.meaning]);
function glossaryAll(text){const out=[],seen=new Set();for(const [re,term,meaning] of GLOSSARIO.concat(words)){if(seen.has(term))continue;const m=text.match(re);if(m){seen.add(term);out.push({term,meaning,at:m.index});}}return out.filter(a=>!out.some(b=>b!==a&&b.term.length>a.term.length&&b.term.includes(a.term))).sort((a,b)=>a.at-b.at);}
function glossary(text){return glossaryAll(text).slice(0,6);}

C.plain={revision:'clareza-2',story,example,glossaryAll,inicio:INICIO[C.id]||C.objective,glossary,question:Q,label,frase,dicionario:{perguntas:Q,rotulos:LABEL,grupos:{porTitulo:SORT,porRotulo:SORT_GENERIC},prefixos:PREFIX,titulos:Object.fromEntries(Object.entries(TITLE).map(([k,v])=>[k,v[0]])),frases:FRASE,situacoes:HISTORIAS[C.id]||null,abertura:INICIO[C.id]||null,glossario:GLOSSARIO.map(g=>({termo:g[1],significado:g[2]}))}};
C.didacticRevision='clareza-2';

/* ---------- 8. Camada de tela: situação em palavras simples, glossário, fala informal e passagem de bloco ---------- */
const root=document.getElementById('jogo');let booted=false;
const INFORMAL={order:'Pensa assim: é como contar uma história. O que rolou primeiro vem primeiro.',match:'É um jogo de pares: cada pergunta tem uma frase que é a resposta dela.',sort:'Separe em dois montinhos: o que o caso mostra de verdade e o que é exagero ou erro.',number:'Pegue os números do caso e faça a conta. Só isso.',bars:'Puxe cada barra até o número de respostas daquela opção.',tally:'Conte quantos cartões têm cada nome. Toque neles para não se perder.',lab:'Dois copos iguais. Mude só uma coisa em um deles. Assim dá para saber o que causou a diferença.'};
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function drawVisual(fig,i){const c=C.cases[i];fig.replaceChildren();fig.hidden=true;if(!c)return;
 if(C.kind==='data'){const n=[...c.facts.dado.matchAll(/([^,=.;]+?) = (\d+)/g)].map(m=>[m[1].trim(),+m[2]]);if(!n.length)return;const max=Math.max(...n.map(x=>x[1]));fig.setAttribute('aria-label','Respostas da pesquisa: '+n.map(x=>x[0]+' '+x[1]).join(', '));for(const [l,v] of n){const row=el('div',undefined,'barra-caso'),bar=el('i');bar.style.width=Math.round(v/max*100)+'%';row.append(el('span',l),bar,el('b',String(v)));fig.append(row);}fig.append(el('figcaption','Cada barra mostra quantas pessoas deram aquela resposta.'));fig.hidden=false;}
 else if(C.kind==='history'&&Array.isArray(c.steps)){const ol=el('ol',undefined,'linha-caso');for(const s of c.steps){const m=String(s).match(/^(\d{4})\s*[-–]\s*(.+)$/),li=el('li');li.append(el('b',m?m[1]:''),el('span',m?m[2]:s));ol.append(li);}fig.append(ol,el('figcaption','Linha do tempo do caso: o que veio antes e o que veio depois.'));fig.hidden=false;}
 else if(C.kind==='lab'){const m=c.facts.dado.match(/(\d+), (\d+), (\d+) segundos/),media=(c.facts.efeito.match(/é (\d+) segundos/)||[])[1];if(!m)return;const row=el('div',undefined,'medidas-caso');[m[1],m[2],m[3]].forEach((v,k)=>row.append(el('span','ensaio '+(k+1)+': '+v+' s')));row.append(el('b','média: '+media+' s'));fig.append(row,el('figcaption','Três medidas do copo A e a média delas (soma dos três ÷ 3).'));fig.hidden=false;}}
function boot(){if(booted||!root)return;const A=window.AulaCentralGEI;if(!A||!A.content.guidedClarity)return;booted=true;const $=s=>root.querySelector(s),S=A.getState();
 /* Tela inicial: o que vai acontecer hoje, em linguagem direta; o objetivo formal fica disponível. */
 const objective=$('[data-objetivo-inicial]');if(objective){objective.textContent=C.plain.inicio;const det=el('details',undefined,'objetivo-formal');det.append(el('summary','Objetivo da aula (texto para o professor)'),el('p',C.objective));objective.parentElement.after(det);}
 const start=$('[data-ouvir-inicio]');if(start)start.onclick=()=>A.speak(C.title+'. '+C.plain.inicio+'. Toque em Começar a atividade. Você vai ver a situação, um exemplo resolvido e uma atividade de cada vez.');
 /* Situação de cada caso junto da atividade. */
 const explain=$('[data-tarefa-explica]');if(!explain)return;
 const icons=el('p',undefined,'situacao-icones');icons.setAttribute('aria-hidden','true');const tag=el('p','1 · Veja e entenda','situacao-rotulo');const visual=el('figure',undefined,'caso-visual');explain.before(tag,icons,visual);
 const command=$('[data-tarefa-comando]');const turn=el('p','3 · Agora é sua vez','etapa-rotulo');if(command)command.before(turn);const check=$('[data-tarefa-conferir]');if(check)check.textContent='4 · Conferir minha resposta';
 const original=el('details',undefined,'situacao-original');const originalBody=el('p');original.append(el('summary','Ler com as palavras do texto original'),originalBody);explain.after(original);
 const hearStory=el('button','Ouvir a situação');hearStory.type='button';original.after(hearStory);
 root.addEventListener('aula:guia',e=>{const t=e.detail.task,guide=e.detail.guide,route=A.getState().route,st=route==='apoio'?null:story(t.case);
  if(st){tag.hidden=false;icons.hidden=false;original.hidden=false;hearStory.hidden=false;turn.hidden=false;icons.textContent=st.icones;explain.textContent=st.texto;originalBody.textContent=t.explain;hearStory.onclick=()=>A.speak(st.texto);drawVisual(visual,t.case);}
  else{tag.hidden=true;icons.hidden=true;original.hidden=true;hearStory.hidden=true;turn.hidden=true;visual.hidden=true;}
  const informal=INFORMAL[t.kind];if(informal&&e.detail.alternate)e.detail.alternate.append(el('p',informal,'informal'));
  const d=t.data||{},text=[t.title,t.command,t.explain,t.relation,...(d.parts||[]),...(d.yes||[]),...(d.no||[]),...(d.pairs||[]).flat()].join(' '),terms=route==='apoio'?[]:glossary(text);
  if(terms.length){const g=el('details',undefined,'glossario-atividade'),dl=el('dl');g.append(el('summary','Palavras desta atividade'),dl);for(const w of terms)dl.append(el('dt',w.term),el('dd',w.meaning));(e.detail.hear||guide.lastElementChild).before(g);}
 });
 /* Passagem de bloco: ao fechar 4 atividades, um botão grande leva ao bloco seguinte. */
 const map=$('.painel-mapa');if(map){const banner=el('div',undefined,'bloco-feito');const h=el('p'),go=el('button',undefined,'primario');go.type='button';banner.append(h,go);map.querySelector('.tarefa-card h2')?.before(banner);
  const refresh=()=>{if(map.hidden)return;const s=A.getState(),idx=s.routes[s.route].index,tasks=C.routes[s.route],size=s.route==='principal'?4:s.route==='exemplos'?12:3,t=A.current();
   if(!t){banner.hidden=false;h.textContent='✔ Você concluiu todas as atividades deste caminho!';go.textContent='Abrir o caderno de bordo';go.onclick=()=>{A.closeModal();A.openReport();};return;}
   const block=Math.floor(idx/size),closedBlock=idx>0&&idx%size===0&&tasks.slice(idx-size,idx).every(x=>s.routes[s.route].records[x.id]?.done);banner.hidden=false;
   h.textContent=closedBlock?'✔ Bloco '+block+' concluído! Próximo: «'+(C.cases[t.case]?.title||t.context)+'».':'Você está no bloco '+(block+1)+', atividade '+(idx%size+1)+' de '+size+'.';
   go.textContent=closedBlock?'Continuar para o bloco '+(block+1)+' →':'Continuar minha atividade →';go.onclick=()=>{A.closeModal();A.showTask();};};
  root.addEventListener('aula:painel',e=>{if(e.detail?.which==='map')refresh();});refresh();}
}
window.AulaClareza={boot,content:C};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
root?.addEventListener('aula:tarefa',boot);
})();
