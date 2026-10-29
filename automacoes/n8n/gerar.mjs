import fs from 'node:fs/promises';
import {prepararEntrada,normalizarRecibo} from './logica.mjs';
const base=new URL('./',import.meta.url);
const contrato=await fs.readFile(new URL('../../coleta/contrato.js',base),'utf8');
const node=(name,type,typeVersion,position,parameters,extra={})=>({id:name.replace(/[^a-zA-Z0-9]/g,'_'),name,type:'n8n-nodes-base.'+type,typeVersion,position,parameters,...extra});
const headers={entries:[{name:'Access-Control-Allow-Origin',value:'https://andredor19.github.io'},{name:'Cache-Control',value:'no-store'}]};
const responder=(name,x,y)=>node(name,'respondToWebhook',1.4,[x,y],{respondWith:'json',responseBody:'={{ $json.recibo }}',options:{responseCode:'={{ $json.status }}',responseHeaders:headers}});
const workflow={name:'Arquiteturas — receber relatórios v1',active:false,nodes:[
  node('Receber relatório','webhook',2,[0,0],{httpMethod:'POST',path:'arquiteturas-relatorios-v1',responseMode:'responseNode',options:{allowedOrigins:'https://andredor19.github.io'}},{webhookId:'664ac5b8-4a02-493f-a112-56fb487c81c8'}),
  node('Configurar receptor','code',2,[240,0],{jsCode:"// Preencher somente na instância privada do n8n. Não incluir convites.\nreturn [{json:{...$json,config:{receptor:'https://script.google.com/macros/s/PREENCHER/exec',ambiente:'teste'}}}];"}),
  node('Validar relatório','code',2,[480,0],{jsCode:contrato+'\nreturn [{json:('+prepararEntrada.toString()+')($json.body,$json.config,globalThis.ColetaContrato)}];'}),
  node('Pode encaminhar','if',2.2,[720,0],{conditions:{options:{caseSensitive:true,leftValue:'',typeValidation:'strict',version:2},conditions:[{id:'validado',leftValue:'={{ $json.encaminhar }}',rightValue:true,operator:{type:'boolean',operation:'true',singleValue:true}}],combinator:'and'},options:{}}),
  node('Persistir na coleta existente','httpRequest',4.2,[960,-100],{method:'POST',url:'={{ $json.receptor }}',sendBody:true,contentType:'raw',rawContentType:'text/plain;charset=UTF-8',body:'={{ JSON.stringify($json.envelope) }}',options:{timeout:20000,response:{response:{responseFormat:'json'}}}},{onError:'continueRegularOutput',retryOnFail:true,maxTries:2,waitBetweenTries:1000}),
  node('Conferir confirmação','code',2,[1200,-100],{jsCode:'return [{json:('+normalizarRecibo.toString()+")($json,$('Validar relatório').first().json.submission_id)}];"}),
  responder('Responder recibo',1440,-100),responder('Responder pendência',960,140)
],connections:{},settings:{executionOrder:'v1',timezone:'America/Sao_Paulo',executionTimeout:60,saveDataErrorExecution:'none',saveDataSuccessExecution:'none',saveManualExecutions:false,saveExecutionProgress:false},pinData:{},tags:[]};
const link=(from,to,index=0)=>{workflow.connections[from]??={main:[]};workflow.connections[from].main[index]=[{node:to,type:'main',index:0}];};
link('Receber relatório','Configurar receptor');link('Configurar receptor','Validar relatório');link('Validar relatório','Pode encaminhar');link('Pode encaminhar','Persistir na coleta existente');link('Pode encaminhar','Responder pendência',1);link('Persistir na coleta existente','Conferir confirmação');link('Conferir confirmação','Responder recibo');
await fs.writeFile(new URL('receber-relatorios.json',base),JSON.stringify(workflow,null,2)+'\n');
console.log('Workflow n8n gerado; permanece inativo e em modo teste.');
