import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import './contrato.js';
import {criarColetaEventos} from './cliente.mjs';
import {prepararEventos,conferirEventos} from '../../automacoes/n8n/eventos-logica.mjs';
const fixture=()=>({schema_version:'eventos-1.0.0',batch_id:'lote_1',sessao_id:'sessao_1',ambiente:'teste',aula:{id:'aula_192',versao:'1.0.0'},estudante:{codigo:'TESTE_001'},eventos:[{id:'evento_1',sequencia:1,ocorrido_em:new Date().toISOString(),tipo:'tentativa',dados:{item_id:'q1',correta:false}}]});
const token='a'.repeat(64),config={receptor:'https://script.google.com/macros/s/TESTE/exec',ambiente:'teste'};
let checks=0;function test(nome,fn){fn();checks++;console.log('OK',nome);}
test('evento parcial aceito sem aula concluída',()=>assert.equal(EventosContrato.validar(fixture()).eventos.length,1));
test('texto livre e diagnóstico recusados',()=>{const p=fixture();p.eventos[0].dados.diagnostico='x';assert.throws(()=>EventosContrato.validar(p));});
test('limite do lote e IDs repetidos',()=>{const p=fixture();p.eventos.push(p.eventos[0]);assert.throws(()=>EventosContrato.validar(p));p.eventos=Array(21).fill(p.eventos[0]);assert.throws(()=>EventosContrato.validar(p));});
test('webhook não configurado fechado',()=>assert.equal(prepararEventos({}, {},EventosContrato).status,503));
test('modo teste recusa produção',()=>{const p=fixture();p.ambiente='producao';assert.equal(prepararEventos({token,payload:p},config,EventosContrato).recibo.codigo,'SOMENTE_TESTE');});
test('convite e atributos desconhecidos',()=>{assert.equal(prepararEventos({token:'x',payload:fixture()},config,EventosContrato).encaminhar,false);const p=fixture();p.nome='não guardar';assert.equal(EventosContrato.validar(p).nome,undefined);});
test('recibo exige IDs exatos',()=>{const e={batch_id:'x',ids:['a']};assert.equal(conferirEventos({ok:true,estado:'recebido',batch_id:'x',ids:['b'],duplicada:false},e).status,502);});
const rows=[['batch_id','recebido_em','sha256','payload_json']];let recusar=false,flushed=0;
const sh={getLastRow:()=>rows.length,getMaxRows:()=>1000,getMaxColumns:()=>4,getRange:(r,c,n=1,m=1)=>({getValues:()=>rows.slice(r-1,r-1+n).map(row=>row.slice(c-1,c-1+m)),setValues:values=>values.forEach((v,i)=>{rows[r-1+i]??=[];v.forEach((x,j)=>rows[r-1+i][c-1+j]=x);})})};
const props={EVENTOS_ATIVOS:'true',MODO_RECEBIMENTO:'teste'};
const context={EventosContrato,ColetaContrato:{serializar:JSON.stringify},propriedades_:()=>({getProperty:k=>props[k]}),LockService:{getScriptLock:()=>({tryLock:()=>true,hasLock:()=>true,releaseLock(){}})},banco_:()=>({getSheetByName:()=>sh}),aba_:()=>({}),convite_:()=>{if(recusar){const e=Error();e.codigo='CONVITE_INVALIDO';throw e;}},sha256_:s=>createHash('sha256').update(s).digest('hex'),json_:v=>v,garantirEspaco_(){},SpreadsheetApp:{flush:()=>{flushed++;}}};
vm.createContext(context);vm.runInContext(await fs.readFile(new URL('receptor.gs',import.meta.url),'utf8'),context);
test('persistência e reenvio sem duplicação',()=>{const e={token,payload:fixture()};assert.equal(context.receberEventos_(e).ok,true);assert.equal(flushed,1);assert.equal(context.receberEventos_(e).duplicada,true);assert.equal(rows.length,2);});
test('conflito de conteúdo e autorização no receptor',()=>{const p=fixture();p.eventos[0].dados.correta=true;assert.equal(context.receberEventos_({token,payload:p}).codigo,'CONFLITO');recusar=true;assert.equal(context.receberEventos_({token,payload:fixture()}).codigo,'CONVITE_INVALIDO');recusar=false;});
const mem=new Map();let mode='fail',sent=[];
const env={sessionStorage:{getItem:k=>mem.get(k),setItem:(k,v)=>mem.set(k,v)},fetch:async(u,opts)=>{const p=JSON.parse(opts.body).payload;sent.push(p);if(mode==='fail')throw Error('offline');return {ok:true,json:async()=>({ok:true,estado:'recebido',batch_id:p.batch_id,ids:p.eventos.map(e=>e.id)})};}};
const cfg={autorizado:true,webhook:'https://example.org/webhook/teste',convite:token,ambiente:'teste',aula:{id:'aula_192',versao:'1.0.0'},codigo:'TESTE_001'};
test('sem autorização não inicia',()=>assert.throws(()=>criarColetaEventos({...cfg,autorizado:false},env)));
let client=criarColetaEventos(cfg,env);
try{
 client.registrar('tentativa',{item_id:'q1',correta:false});await client.enviar();assert.equal(client.pendentes(),1);client.parar();
 client=criarColetaEventos(cfg,env);mode='ok';client.registrar('pista',{item_id:'q1',nivel:1});await client.enviar();assert.equal(sent[0].batch_id,sent[1].batch_id);assert.equal(client.pendentes(),1);await client.enviar();assert.equal(client.pendentes(),0);checks++;console.log('OK fila após falha/reabertura, lote estável e eventos novos preservados');
 assert.ok(![...mem.values()].join('').includes(token));checks++;console.log('OK convite não persistido pelo cliente');
}finally{client.parar();}
const w=JSON.parse(await fs.readFile(new URL('../../automacoes/n8n/receber-eventos.json',import.meta.url),'utf8'));
test('workflow inativo e sem retenção de execuções',()=>{assert.equal(w.active,false);assert.equal(w.settings.saveDataSuccessExecution,'none');assert.equal(w.settings.saveDataErrorExecution,'none');for(const node of w.nodes.filter(n=>n.parameters.jsCode))new vm.Script('(function(){'+node.parameters.jsCode+'})');});
console.log('EVENTOS_OK',checks,'verificações; serviços simulados.');
