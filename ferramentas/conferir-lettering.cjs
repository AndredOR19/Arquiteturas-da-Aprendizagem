const {chromium}=require('playwright');
const {spawn}=require('child_process');
const assert=require('node:assert/strict');
const server=spawn('python3',['-m','http.server','8786','--directory','_site'],{stdio:'ignore'});
process.on('exit',()=>server.kill());
(async()=>{
  for(let n=0;n<50;n++){try{if((await fetch('http://127.0.0.1:8786/')).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
  const browser=await chromium.launch();
  try{
    for(const day of ['21','29']){
      const page=await browser.newPage({viewport:{width:1365,height:1000}}),errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(`http://127.0.0.1:8786/aulas/${day}-10-2026-historia-192/`);
      await page.waitForSelector('#lettering-simple');
      if(day==='29')await page.waitForFunction(()=>typeof D!=='undefined'&&D?.percursos?.length===26&&document.getElementById('experienceStatus'));
      const font=await page.evaluate(async()=>{const f=await document.fonts.load('700 24px KalamEscolar','Cidadania e participação');return f.length>0&&f.every(x=>x.status==='loaded');});
      assert.ok(font,'Fonte local não carregada');
      assert.match(await page.locator('main h1').evaluate(el=>getComputedStyle(el).fontFamily),/KalamEscolar/);
      assert.equal(await page.locator('.lettering-note').count(),4);
      assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
      await page.screenshot({path:`historia-192-lettering-${day}-desktop.png`,fullPage:false});
      // Um acerto inicial e uma pista permanecem idênticos ao alternar a apresentação.
      const before=await page.evaluate(day=>{if(day==='21'){choose(units[0][5]);showHint();return JSON.stringify({answers:state.answers,hints:state.hints});}answer(D.percursos[0].correta);document.getElementById('hint').click();return JSON.stringify(S.records);},day);
      await page.locator('#lettering-simple').click();
      assert.equal(await page.locator('#lettering-simple').getAttribute('aria-pressed'),'true');
      assert.doesNotMatch(await page.locator('main h1').evaluate(el=>getComputedStyle(el).fontFamily),/KalamEscolar/);
      const after=await page.evaluate(day=>day==='21'?JSON.stringify({answers:state.answers,hints:state.hints}):JSON.stringify(S.records),day);
      assert.equal(after,before,'Troca de visual alterou respostas');
      if(day==='29')assert.match(await page.evaluate(()=>fullReport()),/ainda não liberado/);
      await page.locator('#lettering-simple').click();
      assert.match(await page.locator('main h1').evaluate(el=>getComputedStyle(el).fontFamily),/KalamEscolar/);
      for(const theme of ['dark','mono']){
        if(day==='21'&&theme==='mono')continue;
        await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
        assert.equal(await page.locator('.lettering-note').first().isVisible(),true);
      }
      await page.evaluate(()=>document.documentElement.dataset.theme='light');
      await page.setViewportSize({width:390,height:844});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Transbordamento móvel');
      await page.screenshot({path:`historia-192-lettering-${day}-mobile.png`,fullPage:false});
      await page.locator('#rp-open').click();
      await page.locator('[data-profile=dyslexic]').click();
      await page.locator('#rp-close').click();
      assert.match(await page.locator('main h1').evaluate(el=>getComputedStyle(el).fontFamily),/OpenDyslexic/);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Transbordamento com apoio de leitura');
      assert.deepEqual(errors,[]);
      await page.close();
    }
    console.log('LETTERING_OK: duas aulas, fonte local, apresentação reversível, respostas preservadas, liberação protegida, celular e prioridade dos apoios de leitura.');
  }finally{await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exit(1);});
