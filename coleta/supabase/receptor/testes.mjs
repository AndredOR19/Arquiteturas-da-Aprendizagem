import assert from 'node:assert/strict';import {envelope,relatorio,perguntas,normalizar} from './validacao.mjs';import {randomUUID} from 'node:crypto';
const b={acao:'iniciar',sessao_id:randomUUID(),convite:'a'.repeat(64),artefato:'piloto',identificacao:{escola:'Escola',aluno:'Aluno',materia:'História',turma:'192'}};
assert.equal(envelope(b),b);
for(const k of ['escola','aluno','materia','turma'])assert.throws(()=>envelope({...b,identificacao:{...b.identificacao,[k]:' '}}));
assert.throws(()=>envelope({...b,convite:'curto'}));assert.equal(normalizar('  HISTÓRIA  '),'historia');
const e={id:randomUUID(),sequencia:1,tipo:'inicio',ocorrido_em:new Date().toISOString(),dados:{}};
assert.equal(envelope({...b,acao:'eventos',eventos:[e]}).eventos.length,1);
assert.throws(()=>envelope({...b,acao:'eventos',eventos:[e,e]}));assert.throws(()=>envelope({...b,acao:'eventos',eventos:[{...e,tipo:'captura_de_tela'}]}));
const p={id:randomUUID(),records:Array.from({length:26},()=>({correct:true,attempts:[{correct:true,option:0}]})),experience:{confirmed:true,answers:Object.fromEntries(Object.entries(perguntas).map(([k,v])=>[k,v.at(-1)]))},texto:'Relatório fictício completo'};
assert.equal(relatorio(p,26).primeiros,26);assert.throws(()=>relatorio({...p,records:[]},26));assert.throws(()=>relatorio({...p,experience:{...p.experience,confirmed:false}},26));
for(const k of Object.keys(perguntas)){const x=structuredClone(p);delete x.experience.answers[k];assert.throws(()=>relatorio(x,26));}
const x=structuredClone(p);x.experience.answers.sugestao='Quero comentar';assert.throws(()=>relatorio(x,26));x.experience.comment='Comentário fictício';assert.equal(relatorio(x,26).total,26);
console.log('COLETA_CONTRATO_OK: quatro campos obrigatórios, acesso, limites de eventos e completude do relatório.');
