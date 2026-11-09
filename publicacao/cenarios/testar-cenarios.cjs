// Ensaio DOM (jsdom) do piloto de cenários e da sessão 2 de frases. Sem navegador real, rede, voz real ou dados de estudantes.
// Uso: NODE_PATH=<pasta com jsdom> node publicacao/cenarios/testar-cenarios.cjs [--evidencias pasta]
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {JSDOM,VirtualConsole,ResourceLoader}=require('jsdom');
const ROOT=path.resolve(__dirname,'../..');
const LESSON='aulas/estrategias-de-estudo-8ano';
const PAGE=LESSON+'/apoio/index.html';
const ORIGIN='https://arquiteturas-aulas.vercel.app/';
const QUERY='?materia=Estudos+Orientados&tema=Distrito+das+Estrat%C3%A9gias&voltar=..%2F';
const registro=[];const log=(...a)=>{const line=a.join(' ');registro.push(line);console.log(line);};
const sha=buf=>crypto.createHash('sha256').update(buf).digest('hex');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// _recursos/apoios é criado pelo empacotador a partir de publicacao/apoios; aqui o mapeamento é direto.
function local(url){const u=new URL(url);if(!url.startsWith(ORIGIN))throw new Error('recurso externo bloqueado: '+url);const rel=decodeURIComponent(u.pathname.replace(/^\//,'')).replace(/^_recursos\/apoios\//,'publicacao/apoios/');return path.join(ROOT,rel);}
class Loader extends ResourceLoader{fetch(url){try{return Promise.resolve(fs.readFileSync(local(url)));}catch(e){return Promise.reject(e);}}}

// Reproduz a injeção do empacotador (publicacao/preparar.py: decorar_apoios) para o ensaio "publicado".
function decorar(text){const css='<link rel="stylesheet" href="../../../_recursos/apoios/experiencia.css?v=3.6.0">';const scripts=['experiencia.js','relatorios.js'].map(n=>'<script defer src="../../../_recursos/apoios/'+n+'?v=3.6.0" data-apoio-ui-script></script>').join('');text=text.replace('</head>',css+'</head>');const at=text.toLowerCase().lastIndexOf('</body>');return text.slice(0,at)+scripts+text.slice(at);}

async function abrir({publicado=false,storage={},reduzirMovimento=false,semVoz=false}={}){
 let html=fs.readFileSync(path.join(ROOT,PAGE),'utf8');if(publicado)html=decorar(html);
 const erros=[],vc=new VirtualConsole();vc.on('jsdomError',e=>erros.push(e.message));vc.on('error',m=>erros.push(String(m)));
 const falas=[];
 const dom=new JSDOM(html,{url:ORIGIN+LESSON+'/apoio/'+QUERY,runScripts:'dangerously',resources:new Loader(),pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  for(const [k,v] of Object.entries(storage))w.localStorage.setItem(k,v);
  w.HTMLElement.prototype.scrollIntoView=function(){};
  w.matchMedia=q=>({matches:reduzirMovimento&&/reduce/.test(q),media:q,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}});
  if(!semVoz){w.SpeechSynthesisUtterance=function(t){this.text=t;};w.speechSynthesis={cancel(){},getVoices(){return [];},speak(u){falas.push(u.text);}};}
  w.fetch=async url=>{const file=local(new URL(url,w.location.href).href);if(!fs.existsSync(file))return {ok:false,status:404,json:async()=>{throw new Error('404');}};const text=fs.readFileSync(file,'utf8');return {ok:true,status:200,json:async()=>JSON.parse(text),text:async()=>text};};
  w.crypto=w.crypto||{};if(!w.crypto.randomUUID)w.crypto.randomUUID=()=>'qa-'+Math.random().toString(36).slice(2);
  w.URL.createObjectURL=()=>'blob:qa';w.URL.revokeObjectURL=()=>{};
 }});
 await new Promise(r=>dom.window.addEventListener('load',r));
 const w=dom.window;await Promise.all([w.Cenarios&&w.Cenarios.pronto,w.FrasesApoio&&w.FrasesApoio.pronto]);await sleep(5);
 return {dom,w,d:w.document,erros,falas};}

function respostaSessao1(config,bank,d){const n=Number(d.getElementById('step').textContent.match(/Percurso (\d+)/)[1])-1,t=config.percursos[n],wd=config.bancos[bank][t.palavra];const v=t.modo==='silaba'?wd[2][0]:t.modo==='letra'?wd[0][0]:['final','montagem'].includes(t.modo)?wd[2].at(-1):t.modo==='frase'?wd[3]:wd[0];return {n,t,valor:v};}
function clicarCerta(config,d){const {valor}=respostaSessao1(config,'orientados',d);const b=[...d.querySelectorAll('#choices button')].find(x=>x.getAttribute('aria-label')===valor);assert.ok(b,'opção correta ausente');b.click();}
function textosDoPainel(p){return [...p.querySelectorAll('h2,h3,p,button')].map(x=>x.textContent.trim()).filter(Boolean);}

(async()=>{
 const resultado={versao:'1.0.0',ensaio:'cenarios-piloto',pagina:PAGE,gerado_em:new Date().toISOString(),verificacoes:{}};
 // 0. Banco preservado: o JSON apoio-dados continua igual ao hash registrado na proveniência.
 const html=fs.readFileSync(path.join(ROOT,PAGE),'utf8');
 const bloco=html.match(/<script id="apoio-dados" type="application\/json">([\s\S]*?)<\/script>/)[1];
 const prov=JSON.parse(fs.readFileSync(path.join(ROOT,LESSON,'apoio/proveniencia.json'),'utf8'));
 assert.equal(sha(bloco),prov.banco_sha256,'banco apoio-dados alterado');
 const config=JSON.parse(bloco);assert.equal(config.percursos.length,57);
 const engine=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const fonte=fs.readFileSync(path.join(ROOT,'publicacao/alfabetizacao/index.html'),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
 assert.equal(engine,fonte,'motor inline do apoio diverge da fonte publicacao/alfabetizacao');
 resultado.verificacoes.banco_preservado={sha256:sha(bloco),percursos:57,motor_inline_igual_fonte:true};log('OK banco apoio-dados preservado',sha(bloco).slice(0,12),'· 57 percursos · motor inline igual à fonte');
 // 0b. Cópias da biblioteca idênticas à fonte canônica.
 const arquivos=['catalogo.json','cenarios.js','cenarios.css','frases.js','frases-conjunto-1.json','sala-das-palavras-1365.webp','sala-das-palavras-960.webp','sala-das-palavras-miniatura.webp'];
 for(const f of arquivos)assert.equal(sha(fs.readFileSync(path.join(ROOT,'publicacao/cenarios',f))),sha(fs.readFileSync(path.join(ROOT,LESSON,'apoio/cenarios',f))),'cópia divergente: '+f);
 resultado.verificacoes.copias_identicas=arquivos;log('OK',arquivos.length,'arquivos da biblioteca idênticos entre publicacao/cenarios e a aula');

 // 1. Página sem a injeção do empacotador (repositório) e com ela (publicada).
 for(const publicado of [false,true]){
  const {d,w,erros,falas}=await abrir({publicado});
  const nome=publicado?'publicado':'repositorio';
  assert.equal(erros.length,0,'erros de script ('+nome+'): '+erros.join(' | '));
  const fundo=d.querySelector('.cen-fundo');assert.ok(fundo,'camada de fundo ausente');assert.equal(fundo.getAttribute('aria-hidden'),'true');assert.equal(fundo.querySelectorAll('a,button,input,[tabindex]').length,0,'fundo com elementos focáveis');
  assert.equal(d.body.dataset.cenario,'sala-das-palavras');assert.equal(d.body.dataset.cenarioPerfil,'8-9');assert.equal(d.body.dataset.cenarioEstado,'ativo');
  assert.ok(fundo.style.getPropertyValue('--cen-img').includes('sala-das-palavras-1365.webp'));assert.ok(fundo.style.getPropertyValue('--cen-img-movel').includes('sala-das-palavras-960.webp'));
  assert.equal(d.body.style.getPropertyValue('background-color'),'transparent');
  const placa=d.querySelector('.cen-placa');assert.ok(placa);assert.equal(d.getElementById('cen-nome').textContent,'Sala das Palavras');
  assert.ok(d.getElementById('cen-estimulos'));assert.ok(d.getElementById('frases-abrir'),'entrada da sessão 2 ausente');
  assert.equal(placa.compareDocumentPosition(d.getElementById('activity'))&4,4,'placa deve vir antes da atividade');
  // Sessão 1 intacta: mesmos elementos, mesma primeira tarefa, mesmas 3 opções.
  assert.equal(d.getElementById('step').textContent,'Percurso 1 de 57');assert.equal(d.querySelectorAll('#choices button').length,3);
  const {valor}=respostaSessao1(config,'orientados',d);assert.ok([...d.querySelectorAll('#choices button')].some(b=>b.getAttribute('aria-label')===valor));
  assert.equal(d.getElementById('convite-frases'),null,'convite não pode aparecer antes do fim');
  if(publicado){assert.ok(d.querySelector('.ap-hero'),'experiência publicada ausente');assert.ok(d.getElementById('ap-report'),'relatório ausente');assert.ok(d.body.style.getPropertyValue('--ap-scene').includes('sala-das-palavras'),'hero sem o cenário');}
  // Movimento normal → parallax ligado; relação com estímulos.
  assert.equal(d.body.dataset.cenarioAnimacao,'parallax');
  d.getElementById('cen-estimulos').click();assert.ok(d.body.classList.contains('cen-reduzido'));assert.ok(d.body.classList.contains('ap-calm'));assert.equal(d.getElementById('cen-estimulos').getAttribute('aria-pressed'),'true');assert.equal(d.body.dataset.cenarioAnimacao,'nenhuma');assert.equal(w.localStorage.getItem('arquiteturas:cenarios:estimulos:v1'),'1');
  if(publicado){const calmo=d.querySelector('.ap-hero button[aria-pressed]');assert.equal(calmo.getAttribute('aria-pressed'),'true');calmo.click();await sleep(5);assert.equal(d.body.classList.contains('ap-calm'),false);assert.equal(d.body.classList.contains('cen-reduzido'),false,'botão da experiência deve desligar o modo reduzido');assert.equal(d.getElementById('cen-estimulos').getAttribute('aria-pressed'),'false');}
  else{d.getElementById('cen-estimulos').click();assert.equal(d.body.classList.contains('cen-reduzido'),false);}
  log('OK ambiente ('+nome+'): fundo decorativo aria-hidden sem foco, placa antes da atividade, perfil 8-9, estímulos ↔ ap-calm sincronizados, 57 percursos intactos');
  resultado.verificacoes['ambiente_'+nome]={erros:0,fundo:'sala-das-palavras-1365.webp / 960.webp',perfil:'8-9',placa:true,sincronia_ap_calm:true};

  // 2. Percorrer os 57 percursos com a resposta certa; o relatório (publicado) deve registrar 57 tentativas da sessão 1.
  const tentativasAntes=publicado?w.RelatorioApoio.report().tentativas.length:0;
  for(let i=0;i<57;i++){clicarCerta(config,d);assert.equal(d.getElementById('next').disabled,false,'próximo bloqueado em '+(i+1));d.getElementById('next').click();await sleep(0);}
  assert.ok(d.getElementById('feedback').textContent.includes('Você terminou este percurso!'),'conclusão da sessão 1 não exibida');
  assert.equal(d.getElementById('progress').textContent,'Percursos concluídos: 57 de 57');
  await sleep(5);
  const convite=d.getElementById('convite-frases');assert.ok(convite&&!convite.hidden,'convite ausente após a conclusão');
  const textos=textosDoPainel(convite);
  for(const t of ['Parabéns! Você terminou as 57 atividades!','Quer aprender a formar frases?','Agora você pode juntar palavras para contar o que acontece nas imagens.','Quero aprender a formar frases','Terminar por hoje'])assert.ok(textos.includes(t),'texto do convite ausente: '+t);
  assert.equal(d.activeElement,convite,'foco deve ir ao convite');
  // A conclusão da sessão 1 não muda com o convite.
  assert.ok(d.getElementById('feedback').textContent.includes('Você terminou este percurso!'));assert.equal(d.getElementById('next').disabled,true);
  if(publicado){const r=w.RelatorioApoio.report();assert.equal(r.tentativas.length-tentativasAntes,57);assert.equal(r.concluidos,57);assert.equal(r.estado,'atividades_do_apoio_concluidas');}
  log('OK ('+nome+') 57 percursos concluídos → convite com os textos exatos; feedback/next/progress da sessão 1 inalterados');
  resultado.verificacoes['conclusao_'+nome]={percursos:57,convite:textos.slice(0,5),relatorio_sessao1:publicado?w.RelatorioApoio.report().tentativas.length:null};

  // 3. "Terminar por hoje" fecha sem alterar nada; a entrada pela placa continua disponível.
  d.getElementById('convite-nao').click();assert.equal(convite.hidden,true);assert.equal(d.activeElement.id,'back');
  d.getElementById('frases-abrir').click();await sleep(5);
  const painel=d.getElementById('frases');assert.ok(painel&&!painel.hidden,'painel da sessão 2 ausente');assert.equal(d.activeElement,painel);
  assert.ok(d.body.classList.contains('cen-sessao2-ativa'));assert.equal(d.getElementById('frases-abrir').getAttribute('aria-expanded'),'true');assert.ok(d.getElementById('cen-desc').textContent.includes('Sessão 2'));
  assert.ok(textosDoPainel(painel).includes('1 · Veja um exemplo'));assert.ok(d.getElementById('frases-comecar'));
  assert.ok(painel.querySelector('.cen-cena'),'exemplo sem imagem');
  d.getElementById('frases-ouvir-exemplo').click();assert.ok(falas.at(-1).includes('Davi rega a planta'));
  // Voltar às atividades: sessão 1 reaparece exatamente como estava.
  d.getElementById('frases-voltar').click();assert.equal(painel.hidden,true);assert.equal(d.body.classList.contains('cen-sessao2-ativa'),false);assert.equal(d.getElementById('frases-abrir').getAttribute('aria-expanded'),'false');assert.ok(d.getElementById('cen-desc').textContent.includes('Sessão 1'));assert.ok(d.getElementById('feedback').textContent.includes('Você terminou este percurso!'));
  // 4. Começar o conjunto 1: 12 frases, 3 opções, pista após erro, resposta indicada após o segundo erro, progresso salvo.
  d.getElementById('frases-abrir').click();await sleep(5);d.getElementById('frases-comecar').click();
  const conjunto=JSON.parse(fs.readFileSync(path.join(ROOT,LESSON,'apoio/cenarios/frases-conjunto-1.json'),'utf8'));
  const tentativasSessao1=publicado?w.RelatorioApoio.report().tentativas.length:null;
  const relatos=[];
  for(let i=0;i<conjunto.atividades.length;i++){
   const a=conjunto.atividades[i];assert.equal(d.getElementById('frases-passo').textContent,'Frase '+(i+1)+' de 12');
   const botoes=[...d.querySelectorAll('#frases-opcoes button')];assert.equal(botoes.length,3);
   for(const b of botoes)assert.ok(b.getAttribute('aria-label').startsWith('Opção '),'opção sem nome acessível');
   if(a.tipo==='imagem-frase'){assert.ok(d.getElementById('frases-cena').querySelector('svg[role="img"]'));assert.ok(botoes.every(b=>b.querySelector('.cen-opcao-frase')));}
   else{assert.equal(d.getElementById('frases-texto').textContent,a.frase);assert.ok(botoes.every(b=>b.querySelector('svg')));}
   const certa=botoes.find(b=>Number(b.dataset.indice)===a.correta),erradas=botoes.filter(b=>b!==certa);
   assert.equal(d.getElementById('frases-proxima').disabled,true);
   d.getElementById('frases-ouvir').click();assert.ok(falas.length>0);
   if(i%4===0){erradas[0].click();assert.equal(d.getElementById('frases-pista-texto').hidden,false,'pista deve aparecer após o erro');assert.ok(d.getElementById('frases-retorno').textContent.startsWith('Ainda não.'));assert.equal(d.getElementById('frases-proxima').disabled,true);
    if(i===0){erradas[1].click();assert.ok(certa.classList.contains('cen-indicada'),'resposta deve ser indicada após o segundo erro');}}
   certa.click();assert.ok(d.getElementById('frases-retorno').textContent.startsWith('Isso! '+a.frase));assert.equal(d.getElementById('frases-proxima').disabled,false);assert.equal(d.activeElement.id,'frases-proxima');
   assert.ok(falas.at(-1).startsWith('Isso! '+a.frase));
   relatos.push({id:a.id,tipo:a.tipo,erro_provocado:i%4===0,frase:a.frase});
   if(i===2){ // interromper e retomar em nova carga da página
    d.getElementById('frases-proxima').click();d.getElementById('frases-parar').click();
    const guardado=JSON.parse(w.localStorage.getItem('arquiteturas:frases:v1:/'+LESSON+'/apoio/'));assert.deepEqual(guardado.concluidas,conjunto.atividades.slice(0,3).map(x=>x.id));
    assert.equal(painel.hidden,true);assert.equal(d.activeElement.id,'activity');
    const {d:d2,w:w2,erros:e2}=await abrir({publicado,storage:{['arquiteturas:frases:v1:/'+LESSON+'/apoio/']:JSON.stringify(guardado)}});
    assert.equal(e2.length,0,e2.join(' | '));
    assert.equal(d2.getElementById('step').textContent,'Percurso 1 de 57','a sessão 1 continua só em memória, como antes');
    d2.getElementById('frases-abrir').click();await sleep(5);assert.ok(d2.getElementById('frases-continuar'),'retomada ausente');assert.ok(textosDoPainel(d2.getElementById('frases')).some(t=>t.includes('Você parou na frase 4 de 12')));
    d2.getElementById('frases-continuar').click();assert.equal(d2.getElementById('frases-passo').textContent,'Frase 4 de 12');
    log('OK ('+nome+') interrupção após 3 frases, recarga e retomada na frase 4; sessão 1 reiniciada em memória como antes');
    // volta ao fluxo original: continuar no primeiro DOM
    d.getElementById('frases-abrir').click();await sleep(5);d.getElementById('frases-continuar').click();assert.equal(d.getElementById('frases-passo').textContent,'Frase 4 de 12');continue;}
   d.getElementById('frases-proxima').click();}
  assert.ok(textosDoPainel(painel).some(t=>t.startsWith('Você terminou o conjunto 1')),'tela final ausente');
  const final=JSON.parse(w.localStorage.getItem('arquiteturas:frases:v1:/'+LESSON+'/apoio/'));assert.equal(final.concluidas.length,12);
  if(publicado){const r=w.RelatorioApoio.report();assert.equal(r.tentativas.length,tentativasSessao1,'a sessão 2 não pode entrar nas tentativas da sessão 1');assert.equal(r.concluidos,57);}
  // Reabrir após concluir: tela final com opção de repetir; sessão 1 inalterada.
  d.getElementById('frases-voltar').click();d.getElementById('frases-abrir').click();await sleep(5);assert.ok(d.getElementById('frases-recomecar'));assert.ok(d.getElementById('feedback').textContent.includes('Você terminou este percurso!'));
  log('OK ('+nome+') conjunto 1: 12 frases, 3 opções nomeadas, pista após erro, indicação após segundo erro, narração em cada etapa, progresso próprio em localStorage; relatório da sessão 1 sem tentativas da sessão 2');
  resultado.verificacoes['sessao2_'+nome]={frases:relatos.length,tipos:{imagem_frase:relatos.filter(x=>x.tipo==='imagem-frase').length,frase_imagem:relatos.filter(x=>x.tipo==='frase-imagem').length},erros_provocados:relatos.filter(x=>x.erro_provocado).length,falas:falas.length,retomada:'frase 4 após recarga',relatorio_sessao1_tentativas:tentativasSessao1};
 }
 // 5. Movimento reduzido: sem parallax; preferência de estímulos persistida; ausência de voz tratada.
 {const {d,erros}=await abrir({reduzirMovimento:true,storage:{'arquiteturas:cenarios:estimulos:v1':'1'}});assert.equal(erros.length,0);assert.equal(d.body.dataset.cenarioAnimacao,'nenhuma');assert.ok(d.body.classList.contains('cen-reduzido'));assert.equal(d.getElementById('cen-estimulos').textContent,'Mostrar cenário');
  log('OK prefers-reduced-motion → sem parallax; preferência "reduzir estímulos" restaurada da sessão anterior');}
 {const {d,erros}=await abrir({semVoz:true});assert.equal(erros.length,0);d.getElementById('frases-abrir').click();await sleep(5);d.getElementById('frases-ouvir-exemplo').click();assert.ok(d.getElementById('frases-audio').textContent.includes('Áudio indisponível'));
  log('OK sem speechSynthesis → aviso escrito "Áudio indisponível", sem erro de script');}
 // 6. Catálogo inexistente → página continua funcionando sem fundo.
 {const {d,w,erros}=await (async()=>{const r=await abrir();return r;})();assert.equal(erros.length,0);
  const semCenario=new JSDOM(fs.readFileSync(path.join(ROOT,PAGE),'utf8').replace('data-cenario="sala-das-palavras"','data-cenario="inexistente"'),{url:ORIGIN+LESSON+'/apoio/'+QUERY,runScripts:'dangerously',resources:new Loader(),pretendToBeVisual:true,beforeParse(w2){w2.HTMLElement.prototype.scrollIntoView=function(){};w2.matchMedia=q=>({matches:false,media:q,addEventListener(){},addListener(){}});w2.fetch=async url=>{const file=local(new URL(url,w2.location.href).href);const text=fs.readFileSync(file,'utf8');return {ok:true,status:200,json:async()=>JSON.parse(text)};};}});
  await new Promise(r=>semCenario.window.addEventListener('load',r));await semCenario.window.Cenarios.pronto;
  assert.equal(semCenario.window.document.body.dataset.cenarioEstado,'indisponivel');assert.equal(semCenario.window.document.querySelector('.cen-fundo'),null);assert.equal(semCenario.window.document.getElementById('step').textContent,'Percurso 1 de 57');
  log('OK cenário ausente no catálogo → sem fundo, sem erro, atividades intactas');}
 resultado.limites='Emulação DOM (jsdom): não mede legibilidade, contraste renderizado, toque físico, voz real nem desempenho em Chromebook/celular. Teclado: controles são <button>/<a> nativos com foco gerenciado; eventos de tecla não são sintetizados. A conferência visual real continua necessária em sala.';
 const idx=process.argv.indexOf('--evidencias');
 if(idx>0){const out=path.resolve(process.argv[idx+1]);fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'revisao.json'),JSON.stringify(resultado,null,1)+'\n');fs.writeFileSync(path.join(out,'interacoes.txt'),registro.join('\n')+'\n');log('Evidências gravadas em',out);}
 log('ENSAIO DE CENÁRIOS: concluído sem falhas');
})().catch(e=>{console.error('FALHA:',e&&e.stack||e);process.exit(1);});
