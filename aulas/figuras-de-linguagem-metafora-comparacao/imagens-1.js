/* Cenas didáticas autorais; as imagens não são documentos históricos ou diagnósticos. */
(function(){
'use strict';
const conceito=(id,palavra,frase,imagem)=>({id,palavra,frase,imagem});
const historia=[
 conceito('documento','DOCUMENTO','Um documento registra informações. Podemos conferir sua origem e sua data.','documento'),
 conceito('mensagem','MENSAGEM','Uma mensagem comunica uma informação. Precisamos verificar antes de compartilhar.','mensagem'),
 conceito('voto','VOTO','O voto é uma forma de participar. Participar também pode envolver diálogo e acompanhamento.','voto'),
 conceito('dialogo','DIÁLOGO','No diálogo, as pessoas falam e escutam para compreender uma questão.','dialogo')];
const ponte=[
 conceito('papel','PAPEL','A folha de papel pode ficar plana ou receber dobras.','papel'),
 conceito('dobra','DOBRA','Dobrar muda a forma do papel. Vamos comparar as formas no teste.','dobra'),
 conceito('carga','CARGA','A carga é o que colocamos sobre a ponte. Usamos objetos iguais para comparar.','carga'),
 conceito('registro','REGISTRO','Registramos o que aconteceu para comparar os resultados.','registro')];
const investigar=[
 conceito('observar','OBSERVAR','Observar é prestar atenção a detalhes. Veja as partes da folha.','observar'),
 conceito('comparar','COMPARAR','Comparar é olhar duas situações e perceber o que muda e o que fica igual.','comparar'),
 conceito('registro','REGISTRO','Um registro conserva o que foi observado. Ele pode usar desenhos, marcas e palavras.','registro'),
 conceito('revisar','REVISAR','Revisar é voltar ao que fizemos e conferir o que precisa mudar.','revisar')];
const convivencia=[
 conceito('dialogo','DIÁLOGO','No diálogo, as pessoas falam e escutam.','dialogo'),
 conceito('escuta','ESCUTA','Escutar é dar atenção ao que a outra pessoa comunica.','escuta'),
 conceito('acordo','ACORDO','Um acordo reúne uma decisão que as pessoas combinaram.','acordo'),
 conceito('mensagem','MENSAGEM','Uma mensagem comunica algo. Podemos escolher palavras que respeitam as pessoas.','mensagem')];
const config=(tema,conceitos,aplicacao)=>({tema,conceitos,aplicacao});
const historiaCfg=config('Informação e participação',historia,{pergunta:'Uma informação precisa ser conferida. Qual cena mostra um registro que podemos examinar?',correto:'documento',explicacao:'O documento tem informações registradas. Ainda precisamos conferir quem produziu, quando e em qual contexto.'});
const ponteCfg=config('Investigar uma ponte de papel',ponte,{pergunta:'Vamos guardar o resultado de um novo teste. Qual cena mostra essa ação?',correto:'registro',explicacao:'O registro conserva o resultado. Compare as marcas e o que foi observado em cada teste.'});
const investigarCfg=config('Observar, comparar e aprender',investigar,{pergunta:'Uma pessoa olha os detalhes de uma nova folha. Qual cena mostra essa ação?',correto:'observar',explicacao:'Ela observa detalhes da folha. Depois pode comparar, registrar e revisar.'});
const convivenciaCfg=config('Conviver com respeito',convivencia,{pergunta:'Duas pessoas têm ideias diferentes e procuram se compreender. Qual cena mostra essa ação?',correto:'dialogo',explicacao:'No diálogo, há espaço para falar e escutar. Uma diferença não precisa se transformar em agressão.'});
const descricoes={
 regua:'Veja a régua amarela, com números e marcas. Ela mede comprimentos.',
 balanca:'Veja a balança verde com um visor. Ela indica a massa.',
 jarra:'Veja a jarra com alça e água azul. Sua capacidade indica quanto cabe.',
 termometro:'Veja o tubo estreito com coluna vermelha e marcas. Ele indica temperatura.',
 documento:'Veja a folha clara com linhas azuis e um selo amarelo. Esse é um documento.',
 mensagem:'Veja o balão verde de conversa. Ele representa uma mensagem.',
 voto:'Veja a caixa azul e o papel entrando nela. É uma urna recebendo um voto.',
 dialogo:'Veja as duas pessoas e os balões amarelo e verde. Elas estão dialogando.',
 papel:'Veja a folha clara, sem dobras. Esse é o papel na forma plana.',
 dobra:'Veja o papel amarelo em zigue-zague. As mudanças de direção mostram as dobras.',
 carga:'Veja os dois blocos iguais sobre a ponte. Eles representam a carga do teste.',
 registro:'Veja a prancheta clara com linhas azuis e marcas verdes. Ela representa um registro.',
 observar:'Veja a folha verde e a lupa. A lupa destaca detalhes para observar.',
 comparar:'Veja a folha clara de um lado e a forma dobrada amarela do outro. Podemos comparar as duas formas.',
 revisar:'Veja a prancheta e a seta curva laranja. A seta representa voltar ao registro para revisar.',
 escuta:'Veja uma pessoa falando e a outra prestando atenção. Os traços curvos representam a comunicação.',
 acordo:'Veja as duas pessoas e a marca verde no papel entre elas. O papel representa o acordo que combinaram.'
};
for(const lista of [historia,ponte,investigar,convivencia])for(const c of lista)c.descricao=descricoes[c.id];
historiaCfg.sequencia=[
 {id:'mensagem',fala:'Uma mensagem chega até nós. Veja o balão verde e a palavra MENSAGEM. A mensagem pode trazer uma informação que ainda não foi conferida.'},
 {id:'documento',fala:'Agora veja a folha clara com linhas azuis. É um DOCUMENTO. Podemos conferir informações registradas, a origem e a data. Um documento também precisa de contexto.'},
 {id:'dialogo',fala:'Veja as pessoas conversando. Isso representa DIÁLOGO. Elas podem comparar informações e conversar sobre um problema comum.'},
 {id:'voto',fala:'Veja a caixa azul recebendo o papel. É um VOTO. Votar é uma forma de participar. Também podemos dialogar e acompanhar o que foi decidido.'}
];
ponteCfg.sequencia=[
 {id:'papel',fala:'Veja a folha clara e plana. A palavra é PAPEL. Usaremos folhas iguais para comparar duas formas de ponte.'},
 {id:'dobra',fala:'Veja o papel amarelo em zigue-zague. A palavra é DOBRA. Uma das folhas recebe dobras. Mantenha iguais o papel e a distância entre os apoios.'},
 {id:'carga',fala:'Veja os dois blocos iguais sobre a ponte. A palavra é CARGA. Colocamos objetos iguais, um de cada vez. Observe o que cada forma consegue sustentar.'},
 {id:'registro',fala:'Veja as marcas verdes na prancheta. A palavra é REGISTRO. Guarde o resultado com marcas ou desenhos. Depois compare o que aconteceu nas duas formas.'}
];
investigarCfg.sequencia=[
 {id:'observar',fala:'Veja a folha verde e a lupa. A palavra é OBSERVAR. Primeiro, preste atenção aos detalhes daquilo que vai investigar.'},
 {id:'comparar',fala:'Veja as duas formas lado a lado. A palavra é COMPARAR. Procure o que mudou e o que ficou igual.'},
 {id:'registro',fala:'Veja a prancheta com marcas verdes. A palavra é REGISTRO. Guarde o que você observou. Pode usar desenhos e marcas com a ajuda do professor.'},
 {id:'revisar',fala:'Veja a seta laranja voltando para a prancheta. A palavra é REVISAR. Volte ao registro e confira se a explicação combina com o que foi observado.'}
];
convivenciaCfg.sequencia=[
 {id:'mensagem',fala:'Veja o balão verde. A palavra é MENSAGEM. Uma pessoa comunica sua ideia. As pessoas podem ter crenças e ideias diferentes.'},
 {id:'escuta',fala:'Veja uma pessoa falando e a outra prestando atenção. A palavra é ESCUTA. Podemos ouvir sem agredir ou humilhar.'},
 {id:'dialogo',fala:'Veja as duas pessoas e os balões. A palavra é DIÁLOGO. Elas falam e escutam para compreender a diferença.'},
 {id:'acordo',fala:'Veja a marca verde no papel entre as pessoas. A palavra é ACORDO. Elas combinam como conviver com respeito. Um acordo não precisa fazer todas as pessoas terem a mesma crença.'}
];
const medidasCfg=config('Grandezas e medidas na feira',[
 conceito('regua','COMPRIMENTO','A régua mede o comprimento de uma faixa. Comparamos a distância entre duas marcas.','regua'),
 conceito('balanca','MASSA','A balança indica a massa de um pacote. Podemos registrar gramas ou quilogramas.','balanca'),
 conceito('jarra','CAPACIDADE','A jarra recebe água. Sua capacidade indica quanto cabe dentro dela.','jarra'),
 conceito('termometro','TEMPERATURA','O termômetro indica a temperatura. A unidade desta aula é o grau Celsius.','termometro')
],{pergunta:'Em outro desenho da feira, queremos saber a temperatura da água. Qual instrumento escolhemos?',correto:'termometro',explicacao:'O termômetro permite medir a temperatura; a unidade apresentada é °C.'});
medidasCfg.conceitos.forEach(c=>c.descricao=descricoes[c.id]);
medidasCfg.sequencia=[
 {id:'regua',fala:'Veja a faixa amarela com traços e números. É uma régua. A palavra é COMPRIMENTO. Os traços ajudam a comparar a distância entre as extremidades.'},
 {id:'balanca',fala:'Veja a base verde e o visor com quinhentos gramas. É uma balança. A palavra é MASSA. A balança indica a massa do pacote.'},
 {id:'jarra',fala:'Veja o recipiente claro com alça e água azul. É uma jarra. A palavra é CAPACIDADE. Um litro indica quanto cabe nessa jarra.'},
 {id:'termometro',fala:'Veja o tubo estreito e a coluna vermelha ao lado das marcas. É um termômetro. A palavra é TEMPERATURA. As marcas permitem ler graus Celsius. A cor vermelha ajuda a localizar a coluna, mas são as marcas que dão o valor.'}
];
window.ImageLearningContents={
'aulas/figuras-de-linguagem-metafora-comparacao':{"tema": "Metáfora e comparação: imagens e sentidos", "conceitos": [{"id": "sorriso", "palavra": "SORRISO", "frase": "Veja um rosto sorrindo e o sol redondo com raios. Seu sorriso é como o sol: a comparação sugere alegria; o rosto não vira estrela.", "imagem": "sorriso", "descricao": "Veja um rosto sorrindo e o sol redondo com raios. Seu sorriso é como o sol: a comparação sugere alegria; o rosto não vira estrela."}, {"id": "memoria", "palavra": "MEMÓRIA", "frase": "Veja o perfil da pessoa e o álbum aberto com fotografias. Minha memória é um álbum: a metáfora aproxima lembranças e fotografias guardadas.", "imagem": "memoria", "descricao": "Veja o perfil da pessoa e o álbum aberto com fotografias. Minha memória é um álbum: a metáfora aproxima lembranças e fotografias guardadas."}, {"id": "ideias", "palavra": "IDEIAS", "frase": "Veja o balão de pensamento e a planta saindo da terra. As ideias são sementes: a metáfora sugere possibilidades que se desenvolvem com cuidado.", "imagem": "ideias", "descricao": "Veja o balão de pensamento e a planta saindo da terra. As ideias são sementes: a metáfora sugere possibilidades que se desenvolvem com cuidado."}, {"id": "leitura", "palavra": "LEITURA", "frase": "Veja um livro aberto e o caminho ao lado. A leitura é uma viagem: a metáfora sugere conhecer experiências sem deslocamento físico.", "imagem": "leitura", "descricao": "Veja um livro aberto e o caminho ao lado. A leitura é uma viagem: a metáfora sugere conhecer experiências sem deslocamento físico."}], "sequencia": [{"id": "sorriso", "fala": "Veja um rosto sorrindo e o sol redondo com raios. Seu sorriso é como o sol: a comparação sugere alegria; o rosto não vira estrela. A palavra é SORRISO. A primeira letra é S."}, {"id": "memoria", "fala": "Veja o perfil da pessoa e o álbum aberto com fotografias. Minha memória é um álbum: a metáfora aproxima lembranças e fotografias guardadas. A palavra é MEMÓRIA. A primeira letra é M."}, {"id": "ideias", "fala": "Veja o balão de pensamento e a planta saindo da terra. As ideias são sementes: a metáfora sugere possibilidades que se desenvolvem com cuidado. A palavra é IDEIAS. A primeira letra é I."}, {"id": "leitura", "fala": "Veja um livro aberto e o caminho ao lado. A leitura é uma viagem: a metáfora sugere conhecer experiências sem deslocamento físico. A palavra é LEITURA. A primeira letra é L."}], "aplicacao": {"pergunta": "Em outro desenho, vemos um livro e um caminho. Qual imagem representa conhecer experiências pela leitura?", "correto": "leitura", "explicacao": "Livro e caminho representam leitura como viagem. Não é necessário sair do lugar."}},
 'aulas/demonstracao-matematica-medidas-6':medidasCfg,
 'aulas/21-10-2026-historia-192':historiaCfg,
 'aulas/29-10-2026-historia-192':historiaCfg,
 'aulas/27-10-2026-historia-231':{...historiaCfg,tema:'Registros e participação na História',aplicacao:{...historiaCfg.aplicacao,explicacao:'O registro é uma fonte a examinar. Ele não conta sozinho toda a história: precisamos de contexto e de outras fontes.'}},
 'aulas/27-10-2026-ensino-religioso-192':convivenciaCfg,
 'aulas/29-10-2026-missao-ponte-6':ponteCfg,
 'aulas/29-10-2026-missao-ponte-7':ponteCfg,
 'laboratorios/aprender-a-aprender':investigarCfg,
 'laboratorios/conectar-investigar':investigarCfg
};
})();
