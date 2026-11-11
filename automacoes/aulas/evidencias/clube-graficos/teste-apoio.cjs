const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const {JSDOM,VirtualConsole}=require(process.env.JSDOM_MODULE||'jsdom');
const original=fs.readFileSync(process.argv[2]||'../correcao-apoio/publicacao/alfabetizacao/index.html','utf8');
const base=path.resolve(__dirname,'aulas-repo/aulas/clube-dos-graficos-7ano/apoio/index.html'),html=fs.readFileSync(base,'utf8');
const bank=s=>s.match(/<script id="apoio-dados" type="application\/json">([\s\S]*?)<\/script>/)[1];
assert.equal(bank(html),bank(original),'Dados e sequência devem ser exatamente os anteriores');
const config=JSON.parse(bank(html));assert.equal(config.percursos.length,57);assert.equal(new Set(config.percursos.map(x=>x.modo)).size,9);
(async()=>{let total=0;
for(const [subject,kind]of [['Estudos Orientados','orientados']]){
 const errors=[],spoken=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://aula.example/apoio/?materia='+encodeURIComponent(subject)+'&voltar=../',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.speechSynthesis={cancel(){},getVoices(){return[]},speak(u){spoken.push(u.text)}};w.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};}}),doc=dom.window.document;
 const visual=doc.createElement('script');visual.textContent=fs.readFileSync(path.join(path.dirname(base),'visuais.js'),'utf8');doc.body.append(visual);doc.dispatchEvent(new dom.window.Event('DOMContentLoaded'));await Promise.resolve();
 assert(doc.querySelector('#symbol svg[data-rel-ilustracao]'),'Ilustração do objeto deve estar presente');
 assert.equal(doc.querySelector('canvas'),null,'Apoio não exige caminhar num cenário');doc.querySelector('#hearIntro').click();assert(spoken.length);
 for(const task of config.percursos){
  await Promise.resolve();if(task.modo!=='aplicar')assert(doc.querySelector('#symbol svg[data-rel-ilustracao]'),'Imagem clara em '+task.id);
  const word=config.bancos[kind][task.palavra],value=task.modo==='silaba'?word[2][0]:task.modo==='letra'?word[0][0]:['final','montagem'].includes(task.modo)?word[2].at(-1):task.modo==='frase'?word[3]:word[0];
  const options=[...doc.querySelectorAll('#choices button')];assert(options.length>=2);assert(doc.querySelector('#next').disabled);
  const wrong=options.find(b=>b.getAttribute('aria-label')!==value);wrong.click();assert(doc.querySelector('#next').disabled,'Erro mantém a mesma relação para nova tentativa');
  const right=options.find(b=>b.getAttribute('aria-label')===value);assert(right,task.id);right.click();assert(!doc.querySelector('#next').disabled);assert(spoken.at(-1));doc.querySelector('#next').click();total++;
 }
 assert(doc.querySelector('#progress').textContent.includes('57 de 57'));assert.deepEqual(errors,[]);dom.window.close();
}
console.log('PASS '+total+' associações nas cinco aulas; mesmos dados, ordem e critérios, nove operações, voz, erro/repetição e acesso sem RPG.');
console.log('Banco SHA256 '+crypto.createHash('sha256').update(bank(html)).digest('hex'));

})().catch(e=>{console.error(e);process.exitCode=1});

