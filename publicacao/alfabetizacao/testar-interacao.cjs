// Ensaio DOM isolado, sem navegador, rede, voz real ou dados de estudantes.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const page=fs.readFileSync(__dirname+'/index.html','utf8');
const data=JSON.parse(page.match(/<script id="apoio-dados" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const script=page.match(/<script>([\s\S]*?)<\/script>/)[1];
class Element{
 constructor(){this.textContent='';this.children=[];this.attrs={};this.style={};this.disabled=false;this.classList={toggle(){}};}
 setAttribute(k,v){this.attrs[k]=v;}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=nodes;}
}
for(const materia of ['História','Matemática','Ciências','Arte','Estudos Orientados','Aula']){
 const nodes={};const get=id=>nodes[id]??=new Element();get('apoio-dados').textContent=JSON.stringify(data);
 const document={getElementById:get,createElement:()=>new Element(),documentElement:new Element(),referrer:'https://arquiteturas-aulas.vercel.app/aulas/teste/'};
 const location=new URL('https://arquiteturas-aulas.vercel.app/_recursos/alfabetizacao/index.html?'+new URLSearchParams({materia,voltar:'./'}));
 const ctx={document,location,URL,URLSearchParams,window:{},console};vm.runInNewContext(script,ctx);
 assert.equal(get('back').href,document.referrer);
 get('hear').onclick();assert.match(get('audioStatus').textContent,/indisponível/);
 for(let i=0;i<57;i++){
  assert.equal(get('step').textContent,`Percurso ${i+1} de 57`);
  assert.equal(get('next').disabled,true);
  const bank=data.bancos[materia==='História'?'historia':materia==='Matemática'?'matematica':materia==='Ciências'?'ciencias':materia==='Arte'?'arte':materia==='Estudos Orientados'?'orientados':'geral'];
  const word=bank[data.percursos[i].palavra];const mode=data.percursos[i].modo;const answer=mode==='silaba'?word[2][0]:mode==='letra'?word[0][0]:['final','montagem'].includes(mode)?word[2].at(-1):mode==='frase'?word[3]:word[0];
  const choices=get('choices').children;choices.find(b=>b.attrs['aria-label']!==answer).onclick();assert.equal(get('next').disabled,true);
  choices.find(b=>b.attrs['aria-label']===answer).onclick();assert.equal(get('next').disabled,false);
  assert.match(get('progress').textContent,new RegExp(`concluídos: ${i+1} de 57`));
  if(i===0){get('repeat').onclick();get('choices').children.find(b=>b.attrs['aria-label']===answer).onclick();assert.match(get('progress').textContent,/concluídos: 1 de 57/);}
  get('next').onclick();
 }
 assert.match(get('feedback').textContent,/terminou/);assert.equal(get('next').disabled,true);
 console.log(materia+': 57 percursos, erro/recuperação, repetição e conclusão OK');
}
