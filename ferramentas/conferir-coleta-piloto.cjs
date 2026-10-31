// Interface em navegador com receptor simulado; o teste real do receptor é separado.
const {chromium}=require('playwright');const {spawn}=require('child_process');const assert=require('node:assert/strict');const crypto=require('node:crypto');
const srv=spawn('python3',['-m','http.server','8789','--directory','_site'],{stdio:'ignore'});process.on('exit',()=>srv.kill());
(async()=>{
 for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:8789/')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));let events=0,reports=0,offline=false,lastReport;
 await page.route('**/functions/v1/coleta-educacional',async route=>{
  if(offline)return route.abort('internetdisconnected');const b=JSON.parse(route.request().postData());let data,status=200;
  if(b.acao==='iniciar'){
   if(b.identificacao.aluno!=='Aluno de Teste'){status=400;data={ok:false,mensagem:'Dados não correspondem ao acesso.'};}
   else data={ok:true,estado:'identificado',sessao_id:b.sessao_id,ambiente:'teste',identificacao:b.identificacao};
  }else if(b.acao==='eventos'){events+=b.eventos.length;data={ok:true,estado:'recebido',sessao_id:b.sessao_id,ids:b.eventos.map(e=>e.id)};}
  else{reports++;lastReport=b.relatorio;data={ok:true,estado:'recebido',id:b.relatorio.id,sha256:crypto.createHash('sha256').update(JSON.stringify(b.relatorio)).digest('hex'),revisao:1};}
  await route.fulfill({status,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(data)});
 });
 await page.goto('http://127.0.0.1:8789/aulas/piloto-coleta-historia-192/');
 assert(await page.locator('#aula-conteudo').isHidden());assert.equal(await page.evaluate(()=>typeof S),'undefined');
 await page.click('#entrada-form button');assert(await page.locator('#aula-conteudo').isHidden());
 for(const[k,v]of Object.entries({escola:'Escola de Teste',aluno:'Nome errado',materia:'História',turma:'192',convite:'a'.repeat(64)}))await page.fill('[name='+k+']',v);
 await page.click('#entrada-form button');await page.waitForFunction(()=>document.getElementById('entrada-status').textContent.includes('não correspondem'));assert(await page.locator('#aula-conteudo').isHidden());
 await page.fill('[name=aluno]','Aluno de Teste');await page.click('#entrada-form button');await page.waitForFunction(()=>typeof S!=='undefined'&&!!S?.experience&&document.getElementById('coleta-status').textContent.includes('recebidas'));
 await page.waitForSelector('#background-noise');await page.waitForSelector('#image-learning-open');await page.click('#image-learning-open');assert(await page.locator('#image-learning').isVisible());await page.getByRole('button',{name:'Voltar à aula',exact:true}).click();
 assert(await page.locator('#student').isEditable()===false);assert(!await page.evaluate(()=>resultReady()));
 offline=true;await page.evaluate(()=>{answer((D.percursos[0].correta+1)%3);document.getElementById('hint').click();});await page.getByRole('button',{name:'Sincronizar agora',exact:true}).click();await page.waitForFunction(()=>document.getElementById('coleta-status').textContent.includes('pendente'));
 offline=false;await page.getByRole('button',{name:'Sincronizar agora',exact:true}).click();await page.waitForFunction(()=>document.getElementById('coleta-status').textContent.includes('recebidas'));
 for(let i=0;i<26;i++)await page.evaluate(i=>{index=i;render();answer(D.percursos[i].correta)},i);
 await page.click('#confirmExperience');assert(!await page.evaluate(()=>resultReady()));assert.equal(reports,0);
 await page.evaluate(()=>{for(const[id,,opts]of experienceQuestions){const value=opts.at(-1);[...document.querySelectorAll('[name="exp-'+id+'"]')].find(e=>e.value===value).click();}});
 await page.click('#confirmExperience');await page.waitForFunction(()=>document.getElementById('coleta-status').textContent.includes('Relatório final recebido'));
 assert.equal(lastReport.records.length,26);assert.equal(lastReport.records.filter(r=>r.attempts[0].correct).length,25);assert(lastReport.texto.includes('EXPERIÊNCIA COM O ARTEFATO'));assert(events>26);assert.equal(reports,1);
 await page.getByRole('button',{name:'Sincronizar agora',exact:true}).click();await page.waitForTimeout(300);assert.equal(reports,1);
 await page.reload();assert(await page.locator('#aula-conteudo').isHidden());
 // Recarga exige nova identificação; a sessão é retomada apenas pelo mesmo acesso.
 for(const[k,v]of Object.entries({escola:'Escola de Teste',aluno:'Aluno de Teste',materia:'História',turma:'192',convite:'a'.repeat(64)}))await page.fill('[name='+k+']',v);
 await page.click('#entrada-form button');await page.waitForFunction(()=>typeof S!=='undefined'&&!!S?.experience);assert(await page.evaluate(()=>resultReady()));
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
 await page.screenshot({path:'coleta-piloto-mobile.png',fullPage:true});await browser.close();srv.kill();console.log('COLETA_UI_OK: bloqueio, identificação, falta de rede, reenvio, 26 percursos, avaliação, relatório e recarga.');
})().catch(e=>{console.error(e);srv.kill();process.exit(1)});
