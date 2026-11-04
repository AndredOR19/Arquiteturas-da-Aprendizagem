const assert=require('node:assert/strict'),C=require('./recuperacao-core.js');
const a=C.create(),f=a.families[0];assert(C.valid(a));assert.equal(C.total(a),26);assert.equal(C.pending(f),-1);
C.error(f);assert.equal(f.target,1);assert.equal(C.total(a),27);assert.equal(C.pending(f),0);
C.record(f,0,2,false);assert.equal(f.target,3);assert.equal(C.total(a),29);assert.equal(C.complete(a),false);
for(let i=0;i<20;i++)C.record(f,0,2,false);assert.equal(f.target,3);assert.equal(C.total(a),29);
for(let i=0;i<3;i++)C.record(f,i,i===1?[0,1,2]:0,true);assert.equal(C.pending(f),-1);assert(C.complete(a));assert(C.valid(a));
for(const g of a.families.slice(1)){C.error(g);C.error(g)}assert.equal(C.total(a),104);assert(!C.complete(a));assert(C.valid(a));
const restored=JSON.parse(JSON.stringify(a));assert(C.valid(restored));restored.families[0].target=4;assert(!C.valid(restored));assert(C.complete(C.create(false)));
console.log('RECUPERACAO_OK: 26→52→104 no máximo; erros posteriores não expandem; extras obrigatórias e estado restaurado.');
