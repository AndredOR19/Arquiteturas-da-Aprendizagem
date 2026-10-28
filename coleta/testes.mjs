import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash,randomUUID,webcrypto} from 'node:crypto';
import {criarExemploTeste} from './fixture.mjs';
import './contrato.js';
import {criarColetor} from './cliente.mjs';
const C=globalThis.ColetaContrato;
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const source=fs.readFileSync(new URL('./apps-script/Code.gs',import.meta.url),'utf8');
const headers=JSON.parse(fs.readFileSync(new URL('./headers.json',import.meta.url),'utf8'));
const hash=s=>createHash('sha256').update(s).digest('hex');
const token='a'.repeat(64);
const clone=o=>JSON.parse(JSON.stringify(o));
class Sheet{
 constructor(rows){this.rows=clone(rows);this.maxRows=1000;this.maxCols=40;this.failParts=false;}
 getLastRow(){return this.rows.length;}
 getMaxRows(){return this.maxRows;}getMaxColumns(){return this.maxCols;}
 insertRowsAfter(_,n){this.maxRows+=n;}insertColumnsAfter(_,n){this.maxCols+=n;}
 deleteRows(start,n){this.rows.splice(start-1,n);}
 getRange(row,col,nr=1,nc=1){
  const self=this;
  return {getValues(){return Array.from({length:nr},(_,i)=>Array.from({length:nc},(_,j)=>self.rows[row+i-1]?.[col+j-1]??''));},
   setValues(values){if(self.failParts){self.failParts=false;throw new Error('simulated storage failure');}values.forEach((r,i)=>r.forEach((v,j)=>{self.rows[row+i-1]??=[];self.rows[row+i-1][col+j-1]=v;}));return this;},
   setValue(value){return this.setValues([[value]]);}};
 }
}
function environment(){
 const sheets=Object.fromEntries(Object.entries(headers).map(([n,h])=>[n,new Sheet([h])]));
 sheets.Acessos.rows.push([hash(token),'teste-coleta','TESTE-001','teste','2099-12-31T00:00:00Z',true,token,new Date(),'Teste fictício']);
 const props={SPREADSHEET_ID:'private-id',RECEBIMENTO_ATIVO:'true'};
 let locked=false,busy=false;
 const lock={tryLock(){if(busy)return false;locked=true;return true;},hasLock(){return locked;},releaseLock(){locked=false;},waitLock(){locked=true;}};
 const context={console,Date,JSON,Number,String,Array,Object,Set,Error,Math,RegExp,
  PropertiesService:{getScriptProperties(){return {getProperty(k){return props[k]},setProperty(k,v){props[k]=v},setProperties(v){Object.assign(props,v)}}}},
  SpreadsheetApp:{openById(id){assert.equal(id,'private-id');return {getSheetByName(n){return sheets[n]}}},flush(){}},
  LockService:{getScriptLock(){return lock;}},
  Utilities:{DigestAlgorithm:{SHA_256:'sha'},Charset:{UTF_8:'utf8'},computeDigest(_,text){return Array.from(createHash('sha256').update(text).digest())},getUuid:randomUUID},
  ContentService:{MimeType:{JSON:'json'},createTextOutput(text){return {text,setMimeType(){return this}}}}
 };
 vm.createContext(context);vm.runInContext(source,context);
 return {sheets,props,context,call(payload,t=token){return JSON.parse(context.doPost({postData:{contents:JSON.stringify({token:t,payload})}}).text)},busy(v){busy=v;},locked(){return locked;}};
}
let count=0;
async function test(name,fn){await fn();count++;console.log('OK '+name);}
await test('contrato preserva erro inicial, pista e recuperação',()=>{const p=criarExemploTeste();const v=C.validar(p);assert.equal(v.acertos,25);assert.equal(v.tentativas,27);assert.equal(JSON.parse(v.raw).aprendizagem.percursos[0].tentativas[0].correta,false)});
await test('todas as perguntas obrigatórias, uma a uma',()=>{for(const k of Object.keys(C.opcoes)){const p=criarExemploTeste();delete p.experiencia.respostas[k];assert.throws(()=>C.validar(p),/Responda e confirme/)}const p=criarExemploTeste();p.experiencia.confirmada=false;assert.throws(()=>C.validar(p),/confirmacao/)});
await test('opiniões negativas e não uso não alteram nota',()=>{const p=criarExemploTeste();p.experiencia.respostas.legibilidade='Difícil';p.experiencia.respostas.fonte_percepcao='Menos confortável';const before=p.aprendizagem.nota;C.validar(p);assert.equal(p.aprendizagem.nota,before)});
await test('comentário condicional e dificuldades incoerentes',()=>{const p=criarExemploTeste();p.experiencia.respostas.sugestao='Quero comentar';assert.throws(()=>C.validar(p),/comentario/);p.experiencia.comentario='Manter a navegação.';C.validar(p);p.experiencia.respostas.dificuldades=['Texto','Não percebi dificuldade'];assert.throws(()=>C.validar(p),/dificuldades/)});
await test('atividades e totais incompletos recusados',()=>{const p=criarExemploTeste();p.aprendizagem.percursos_concluidos=25;assert.throws(()=>C.validar(p));p.aprendizagem.percursos_concluidos=26;p.aprendizagem.tentativas=26;assert.throws(()=>C.validar(p));});
await test('receptor grava relatório integral e emite protocolo',()=>{const e=environment(),p=criarExemploTeste();const r=e.call(p);assert.equal(r.ok,true);assert.match(r.protocolo,/^ARQ-[A-F0-9]{16}$/);assert.equal(r.sha256,hash(C.serializar(p)));assert.equal(e.sheets.Entregas.rows[1][3],'recebido');const stored=e.sheets.Relatorios.rows.slice(1).map(x=>x[5]).join('');assert.equal(stored,C.serializar(p));assert.equal(e.locked(),false)});
await test('reenvio idêntico não duplica',()=>{const e=environment(),p=criarExemploTeste();const r=e.call(p),again=e.call(p);assert.equal(again.duplicada,true);assert.equal(again.protocolo,r.protocolo);assert.equal(e.sheets.Entregas.rows.length,2);assert.equal(e.sheets.Relatorios.rows.length,2)});
await test('ID com conteúdo diferente e segunda entrega recusados',()=>{const e=environment(),p=criarExemploTeste();e.call(p);p.experiencia.respostas.legibilidade='Difícil';assert.equal(e.call(p).codigo,'CONFLITO');p.submission_id='teste_segunda_entrega_0002';assert.equal(e.call(p).codigo,'ENTREGA_EXISTENTE');assert.equal(e.sheets.Entregas.rows.length,2)});
await test('convites inválidos, expirados, inativos e de outra aula recusados',()=>{for(const mutate of [e=>e.sheets.Acessos.rows[1][4]='2000-01-01',e=>e.sheets.Acessos.rows[1][5]=false,e=>e.sheets.Acessos.rows[1][1]='outra']){const e=environment();mutate(e);assert.equal(e.call(criarExemploTeste()).codigo,'CONVITE_INVALIDO')}const e=environment();assert.equal(e.call(criarExemploTeste(),'b'.repeat(64)).codigo,'CONVITE_INVALIDO');assert.equal(e.sheets.Entregas.rows.length,1)});
await test('serviço desligado, JSON inválido e bloqueio ocupado',()=>{const e=environment();e.props.RECEBIMENTO_ATIVO='false';assert.equal(e.call(criarExemploTeste()).codigo,'DESATIVADO');e.props.RECEBIMENTO_ATIVO='true';e.busy(true);assert.equal(e.call(criarExemploTeste()).codigo,'OCUPADO');assert.equal(e.sheets.Entregas.rows.length,1);e.busy(false);assert.equal(JSON.parse(e.context.doPost({postData:{contents:'{'}}).text).codigo,'DADOS_INVALIDOS')});
await test('falha parcial não confirma e reenvio recupera sem duplicar',()=>{const e=environment(),p=criarExemploTeste();e.sheets.Relatorios.failParts=true;assert.equal(e.call(p).ok,false);assert.equal(e.sheets.Entregas.rows[1][3],'gravando');const protocol=e.sheets.Entregas.rows[1][4];const r=e.call(p);assert.equal(r.ok,true);assert.equal(r.protocolo,protocol);assert.equal(e.sheets.Entregas.rows.length,2);assert.equal(e.sheets.Relatorios.rows.length,2)});
await test('relatório longo dividido e reconstituído sem corte',()=>{const e=environment(),p=criarExemploTeste();p.relatorio_texto='Relatório integral de teste. '.repeat(4000);assert.equal(e.call(p).ok,true);assert.ok(e.sheets.Relatorios.rows.length>3);assert.equal(e.sheets.Relatorios.rows.slice(1).map(x=>x[5]).join(''),C.serializar(p));assert.ok(e.sheets.Relatorios.rows.slice(1).every(x=>x[5].length<=30000))});
await test('fórmulas injetadas são texto e dados não ficam no GET',()=>{const e=environment(),p=criarExemploTeste();p.estudante.nome='=IMPORTXML("malicioso")';e.call(p);assert.equal(e.sheets.Entregas.rows[1][14],"'=IMPORTXML(\"malicioso\")");const text=e.context.doGet().text;assert.ok(!text.includes('TESTE-001'));assert.ok(!text.includes(token));});
class MemoryStorage{constructor(){this.map=new Map()}getItem(k){return this.map.get(k)??null}setItem(k,v){this.map.set(k,v)}}
const endpoint='https://script.google.com/macros/s/teste-publicacao/exec';
await test('cliente exige confirmação real e não usa no-cors',async()=>{const e=environment(),storage=new MemoryStorage(),p=criarExemploTeste();const client=criarColetor({endpoint,storage,fetchImpl:async(_,opt)=>{assert.equal(opt.mode,'cors');assert.equal(opt.credentials,'omit');const b=JSON.parse(opt.body);return {ok:true,json:async()=>e.call(b.payload,b.token)}}});assert.equal(await client.podeFinalizar(p),false);const r=await client.enviar(p,token);assert.equal(r.estado,'recebido');assert.equal(await client.podeFinalizar(p),true);assert.ok(![...storage.map.values()].join('').includes(token));p.experiencia.respostas.legibilidade='Difícil';assert.equal(await client.podeFinalizar(p),false)});
await test('perda de confirmação preserva envio e reenvio idempotente',async()=>{const e=environment(),storage=new MemoryStorage(),p=criarExemploTeste();let first=true;const client=criarColetor({endpoint,storage,fetchImpl:async(_,opt)=>{const b=JSON.parse(opt.body),r=e.call(b.payload,b.token);if(first){first=false;throw new Error('rede interrompida após gravação')}return {ok:true,json:async()=>r}}});await assert.rejects(()=>client.enviar(p,token));assert.equal(await client.podeFinalizar(p),false);assert.deepEqual(client.pendente(p.submission_id),p);const r=await client.enviar(p,token);assert.equal(r.duplicada,true);assert.equal(e.sheets.Entregas.rows.length,2)});
await test('confirmação de outro relatório não libera resultado',async()=>{const storage=new MemoryStorage(),p=criarExemploTeste();const client=criarColetor({endpoint,storage,fetchImpl:async()=>({ok:true,json:async()=>({ok:true,estado:'recebido',submission_id:p.submission_id,sha256:'0'.repeat(64),protocolo:'ARQ-0123456789ABCDEF',recebido_em:new Date().toISOString()})})});await assert.rejects(()=>client.enviar(p,token),/não corresponde/);assert.equal(await client.podeFinalizar(p),false)});
await test('sem armazenamento local confirma em memória e avisa limitação',async()=>{const e=environment(),p=criarExemploTeste(),client=criarColetor({endpoint,storage:null,fetchImpl:async(_,opt)=>{const b=JSON.parse(opt.body);return {ok:true,json:async()=>e.call(b.payload,b.token)}}});const r=await client.enviar(p,token);assert.equal(r.persistencia_local,false);assert.equal(await client.podeFinalizar(p),true)});
await test('modo de teste não recebe produção',()=>{const e=environment(),p=criarExemploTeste();p.ambiente='producao';assert.equal(e.call(p).codigo,'SOMENTE_TESTE');assert.equal(e.sheets.Entregas.rows.length,1)});



const {comAcompanhamento}=await import('./longitudinal.mjs');
function acompanhamentoFixture(){return {versao:'1.0.0',aluno_id:'11111111-1111-4111-8111-111111111111',matricula_id:'22222222-2222-4222-8222-222222222222',ano_letivo:2026,etapa:'etapa fictícia',serie:'1',fonte_confirmacao:'fixture',protocolo_id:'PROTOCOLO-FICTICIO',versao_protocolo:'0.1.0',metodo:'fixture',data_aplicacao:'2026-10-28',medidas:[{indicador:'acertos',momento:'inicial',instrumento_id:'I-FICTICIO',versao_instrumento:'1',rubrica:'R1',unidade:'itens',fonte:'fixture',valor:0,denominador:10}]};}
await test('extensão preserva relatório anterior e anexa texto e JSON',()=>{const p=criarExemploTeste(),a=acompanhamentoFixture(),out=comAcompanhamento(p,a);assert.equal(p.acompanhamento,undefined);assert.ok(out.relatorio_texto.startsWith(p.relatorio_texto));assert.deepEqual(out.acompanhamento,a);assert.throws(()=>comAcompanhamento(out,a));});
await test('ano, matrícula e instrumento incompletos são recusados',()=>{for(const mutate of [a=>a.ano_letivo='2027',a=>a.matricula_id='turma-1',a=>delete a.medidas[0].instrumento_id,a=>a.data_aplicacao='2026-02-31']){const a=acompanhamentoFixture();mutate(a);assert.throws(()=>comAcompanhamento(criarExemploTeste(),a));}});
await test('ausência explícita difere de zero no contrato',()=>{const a=acompanhamentoFixture();C.validarAcompanhamento(a);a.medidas[0].valor=null;assert.throws(()=>C.validarAcompanhamento(a));a.medidas[0].motivo_ausencia='não coletado';C.validarAcompanhamento(a);a.medidas[0].valor=0;assert.throws(()=>C.validarAcompanhamento(a));});
await test('receptor simulado conserva vínculo longitudinal integral',()=>{const e=environment(),p=comAcompanhamento(criarExemploTeste(),acompanhamentoFixture());assert.equal(e.call(p).ok,true);const stored=e.sheets.Relatorios.rows.slice(1).map(x=>x[5]).join('');assert.deepEqual(JSON.parse(stored).acompanhamento,p.acompanhamento);assert.ok(JSON.parse(stored).relatorio_texto.includes('ACOMPANHAMENTO LONGITUDINAL'));});
await test('matrícula de 2027 não substitui vínculo de 2026',()=>{const a=acompanhamentoFixture(),p=comAcompanhamento(criarExemploTeste(),a);a.ano_letivo=2027;a.serie='2';a.matricula_id='33333333-3333-4333-8333-333333333333';a.data_aplicacao='2027-02-01';const next=comAcompanhamento(criarExemploTeste(),a);assert.equal(p.acompanhamento.ano_letivo,2026);assert.equal(next.acompanhamento.aluno_id,p.acompanhamento.aluno_id);assert.notEqual(next.acompanhamento.matricula_id,p.acompanhamento.matricula_id);});

console.log(`${count} ensaios passaram. Serviços Google simulados; implantação e navegador reais pendentes.`);
