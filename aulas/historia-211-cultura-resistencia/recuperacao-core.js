/* Regra 2.0.0 — 1 percurso original + no máximo 3 atividades complementares. */
((root)=>{const A={
 create(enabled=true,total=32){return {version:'2.0.0',enabled,rulesConfirmed:false,families:Array.from({length:total},()=>({errors:0,target:0,extras:Array.from({length:3},()=>({attempts:[],hints:0,correct:false,selection:null,order:[]}))}))}},
 error(f){f.errors++;f.target=f.errors===1?1:3;return f.target},
 pending(f){for(let i=0;i<f.target;i++)if(!f.extras[i].correct)return i;return -1},
 total(a){return a.families.length+a.families.reduce((n,f)=>n+f.target,0)},
 complete(a){return !a.enabled||a.families.every(f=>A.pending(f)===-1)},
 record(f,i,choice,correct){const e=f.extras[i];if(e.correct)return;e.attempts.push({choice,correct,hintsBefore:e.hints,at:new Date().toISOString()});e.correct=correct;if(!correct)A.error(f);return e},
 valid(a){return a?.version==='2.0.0'&&[26,32].includes(a.families?.length)&&a.families.every(f=>Number.isInteger(f.errors)&&f.errors>=0&&f.target===(f.errors===0?0:f.errors===1?1:3)&&f.extras?.length===3&&f.extras.every(e=>Array.isArray(e.attempts)&&(!e.correct||e.attempts.at(-1)?.correct===true)))&&A.total(a)<=a.families.length*4}
};root.RecuperacaoCore=A;if(typeof module!=='undefined')module.exports=A;})(globalThis);
