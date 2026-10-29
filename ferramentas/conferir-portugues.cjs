const {chromium}=require('playwright'),{spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const srv=spawn('python3',['-m','http.server','8794','--directory','_site'],{stdio:'ignore'});
(async()=>{for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:8794/')).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
const browser=await chromium.launch();try{
const p=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:8794/aulas/figuras-de-linguagem-metafora-comparacao/');await p.waitForSelector('#language-lab');await p.waitForFunction(()=>document.fonts.check('18px Fredoka'));
const visual=await p.evaluate(()=>({font:getComputedStyle(document.body).fontFamily,bg:getComputedStyle(document.body).backgroundColor,border:getComputedStyle(document.querySelector('.concept-card')).borderWidth,float:getComputedStyle(document.querySelector('.picture-art')).animationName,cards:document.querySelectorAll('.concept-card').length,headingButtons:document.querySelectorAll('h1 button').length}));
assert(visual.font.includes('Fredoka'));assert.equal(visual.bg,'rgb(240, 247, 255)');assert.equal(visual.border,'3px');assert.equal(visual.float,'float');assert.equal(visual.cards,3);assert.equal(visual.headingButtons,0);
assert(await p.locator('#next').isDisabled());await p.locator('.sound-object').nth(1).click();assert.match(await p.locator('#objectStatus').innerText(),/Folhas do álbum/);
await p.locator('#motion').click();assert.equal(await p.locator('body').getAttribute('data-motion'),'reduce');
await p.locator('#boss').click();await p.locator('[data-answer="0"]').click();assert.equal(await p.locator('#successMsg').getAttribute('data-correct'),'false');await p.locator('[data-answer="1"]').click();assert.equal(await p.locator('#successMsg').getAttribute('data-correct'),'true');await p.keyboard.press('Escape');assert.equal(await p.locator('#desafioModal').isVisible(),false);
await p.setViewportSize({width:390,height:844});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert(await p.locator('.concept-card').nth(2).isVisible());assert.equal(errors.length,0,errors.join('; '));console.log('PORTUGUES_OK: fonte local, cores, bordas, flutuação, efeitos, modal, bloqueio inicial e celular. Som físico depende do dispositivo.');
}finally{await browser.close();srv.kill()}})().catch(e=>{console.error(e);process.exitCode=1;srv.kill()});
