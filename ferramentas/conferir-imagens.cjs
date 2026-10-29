const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const srv=spawn('python3',['-m','http.server','8788','--bind','127.0.0.1','--directory','_site'],{stdio:'ignore'});
process.on('exit',()=>srv.kill());
(async()=>{
 for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:8788/')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 const browser=await chromium.launch();
 try{
  const cat=JSON.parse(fs.readFileSync('publicacao/catalogo.json','utf8')).materiais.filter(m=>m.tipo==='html');
  for(const item of cat){
   console.log('CONFERINDO_IMAGENS',item.destino);
   const p=await browser.newPage({viewport:{width:390,height:844}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.addInitScript(()=>{
    window.__imageSpeech=[];
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){},getVoices(){return []},speak(u){window.__imageSpeech.push(u.text)},speaking:false}});
    window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
   });
   await p.goto('http://127.0.0.1:8788/'+item.destino+'/');
   await p.waitForSelector('#image-learning-open').catch(e=>{throw Error(item.destino+' | '+errors.join(';')+' | '+e.message)});
   if(await p.locator('#image-learning-open').count()!==1)throw Error('Entrada duplicada');
   await p.locator('#image-learning-open').focus();await p.keyboard.press('Enter');
   if(!await p.locator('#image-learning').getAttribute('open').then(v=>v!==null))throw Error('Não abriu por teclado');
   if(await p.locator('#il-start').isEnabled())throw Error('Treino antes da apresentação');
   await p.click('#il-explain');
   if(await p.locator('.il-speaking').count()!==1)throw Error('Cena narrada sem destaque');
   if(!await p.evaluate(()=>__imageSpeech.some(t=>t.includes('Veja'))))throw Error('Sem orientação oral de cena');
   const ids=await p.evaluate(()=>ImageLearningContents[ImageLearning.aula].conceitos.map(c=>c.id));
   for(const id of ids)await p.locator('[data-conceito="'+id+'"]').click();
   await p.click('#il-initial');
   if(!await p.evaluate(()=>__imageSpeech.some(t=>t.includes('começa com a letra'))))throw Error('Sem aproximação da palavra/letra');
   if(!await p.locator('#il-start').isEnabled())throw Error('Não liberou treino');
   await p.click('#il-start');
   for(let i=0;i<ids.length;i++){
    if(i===0){const wrong=await p.locator('.il-choice').evaluateAll((nodes,id)=>nodes.find(n=>n.dataset.choice!==id).dataset.choice,ids[i]);await p.locator('[data-choice="'+wrong+'"]').click();if(await p.locator('#il-next').isEnabled())throw Error('Avanço após erro');await p.click('#il-hint');}
    await p.locator('[data-choice="'+ids[i]+'"]').click();await p.click('#il-next');
   }
   const correct=await p.evaluate(()=>ImageLearningContents[ImageLearning.aula].aplicacao.correto);
   await p.locator('[data-choice="'+correct+'"]').click();await p.click('#il-next');
   const state=await p.evaluate(()=>ImageLearning.snapshot());
   if(state.tentativas.length!==6||state.tentativas[0].correta!==false||state.tentativas[0].pistas_antes!==0||state.tentativas[1].pistas_antes!==1||!state.completos.includes('aplicacao'))throw Error('Histórico incorreto '+item.destino);
   if(!await p.evaluate(()=>__imageSpeech.some(t=>t.includes('Qual imagem'))))throw Error('Comando não chegou à síntese de voz');
   await p.reload();await p.waitForSelector('#image-learning-open');
   if(await p.evaluate(()=>ImageLearning.snapshot().tentativas.length)!==6)throw Error('Perdeu apoio na recarga');
   await p.click('#image-learning-open');
   if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Overflow '+item.destino);
   await p.locator('#image-learning').scrollIntoViewIfNeeded();await p.screenshot({path:'imagens-'+item.destino.split('/').at(-1)+'-mobile.png'});
   if(errors.length)throw Error(item.destino+': '+errors.join(';'));await p.close();
  }
  // Ausência de voz precisa aparecer como limitação real.
  const p=await browser.newPage();await p.addInitScript(()=>Object.defineProperty(window,'speechSynthesis',{value:undefined,configurable:true}));
  await p.goto('http://127.0.0.1:8788/aulas/29-10-2026-historia-192/');await p.waitForSelector('#image-learning-open');await p.click('#image-learning-open');
  if(!await p.locator('#il-voice-status').innerText().then(s=>s.includes('indisponível')))throw Error('Não avisou falta de voz');await p.close();
  // O apoio não libera a nota e precisa entrar no relatório quando a aula estiver concluída.
  const q=await browser.newPage();await q.goto('http://127.0.0.1:8788/aulas/29-10-2026-historia-192/');
  await q.waitForFunction(()=>typeof D!=='undefined'&&D?.percursos&&window.ImageLearning);
  await q.evaluate(()=>answer((D.percursos[0].correta+1)%D.percursos[0].alternativas.length));
  const before=await q.evaluate(()=>JSON.stringify(S.records[0]));
  await q.click('#image-learning-open');await q.locator('[data-conceito]').first().click();
  if(await q.evaluate(()=>JSON.stringify(S.records[0]))!==before)throw Error('Apoio mudou respostas');
  if(await q.evaluate(()=>resultReady()))throw Error('Apoio liberou nota');
  await q.evaluate(()=>{for(let i=0;i<D.percursos.length;i++){index=i;render();answer(D.percursos[i].correta);}for(const [id,,opts]of experienceQuestions){[...document.querySelectorAll('[name="exp-'+id+'"]')].find(e=>e.value===opts.at(-1)).click();}document.getElementById('confirmExperience').click();});
  await q.waitForTimeout(200);
  const report=await q.evaluate(()=>fullReport());
  if(!report.includes('APRENDER COM IMAGENS E ÁUDIO')||!report.includes('não comprova escuta')||!report.includes('25/26'))throw Error('Relatório incompleto ou nota alterada');
  if(await q.evaluate(()=>ImageLearning.snapshot().vistos.length)!==1)throw Error('Disponibilidade virou uso presumido');
  await q.close();
  console.log('IMAGENS_OK: '+cat.length+' HTMLs, teclado, palavra/cena/voz, erro e pista preservados, aplicação, recarga, celular, falta de voz e relatório com nota preservada. Voz simulada não comprova áudio no dispositivo real.');
 }finally{await browser.close();srv.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;srv.kill();});
