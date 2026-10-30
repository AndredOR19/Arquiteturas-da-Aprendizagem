import assert from 'node:assert/strict';
import {criarExemploTeste} from './fixture.mjs';
import {comMetodologia,resumirMetodologia} from './metodologia.mjs';
const p=criarExemploTeste();
const d={versao:'1.0.0',estilo_id:'historia-relacional',estilo_versao:'1.0.0',metodo_principal:'relacional',metodos_secundarios:['expositiva-associativa'],fluxo_visual:'missao-interativa',justificativa:'Comparar relações em dois casos.',espiral:{conceito:'participação',evidencia_anterior:'não disponível',novidade:'novo contexto',ponte_interdisciplinar:'leitura de fonte em Cultura Digital',criterio:'identificar limite em novo caso',proxima_retomada:'recuperação planejada'},circuitos:[{id:'comparar',metodo:'relacional',operacao:'comparacao',criterio:'selecionar relação explicada',percursos_ids:p.aprendizagem.percursos.map(p=>String(p.id))}],percepcao:{interesse:'Não sei avaliar',repeticao:'Ajudou a consolidar',ritmo:'Adequado'},confirmada:true,circuito_comentado:null,comentario:''};
const out=comMetodologia(p,d), resumo=resumirMetodologia(out);
assert.equal(p.metodologia,undefined);assert.equal(out.aprendizagem.nota,p.aprendizagem.nota);
assert.ok(out.relatorio_texto.includes(JSON.stringify(d,null,2)));
assert.deepEqual(resumo.circuitos[0],{id:'comparar',metodo:'relacional',operacao:'comparacao',total:26,acertos_iniciais:25,tentativas:27,pistas:1});
assert.equal(resumirMetodologia(p).status,'nao_coletado');
for(const mutate of [x=>x.confirmada=false,x=>x.percepcao.interesse='',x=>x.circuitos[0].percursos_ids.push('999'),x=>x.circuitos[0].percursos_ids.pop(),x=>x.circuitos.push(x.circuitos[0]),x=>x.circuito_comentado='inexistente',x=>x.estilo_versao='futuro']){
 const bad=structuredClone(d);mutate(bad);assert.throws(()=>comMetodologia(p,bad));
}
assert.throws(()=>comMetodologia(out,d));
console.log('OK: legado, anexo integral, imutabilidade, nota, resumo e sete entradas inválidas.');
