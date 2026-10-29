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
window.ImageLearningContents={
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
