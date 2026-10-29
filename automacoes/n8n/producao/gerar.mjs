import fs from 'node:fs/promises';
import {prepararPedido,conferirDisparo,localizarExecucao,conferirEstado,conferirResultado,pacoteParaRevisao} from './logica.mjs';
const node=(name,type,position,parameters,version=2,extra={})=>({id:name.replace(/[^a-zA-Z0-9]/g,'_'),name,type:'n8n-nodes-base.'+type,typeVersion:version,position,parameters,...extra});
const code=(name,position,text)=>node(name,'code',position,{jsCode:text});
const api=(name,position,method,url,extra={})=>node(name,'httpRequest',position,{method,url,authentication:'predefinedCredentialType',nodeCredentialType:'githubApi',sendHeaders:true,headerParameters:{parameters:[{name:'Accept',value:'application/vnd.github+json'},{name:'X-GitHub-Api-Version',value:'2022-11-28'}]},options:{timeout:20000,response:{response:{responseFormat:'json',...extra.response}}},...extra.parameters},4.2);
const iff=(name,position,prop)=>node(name,'if',position,{conditions:{options:{caseSensitive:true,typeValidation:'strict',version:2},conditions:[{id:'condicao',leftValue:'={{ $json.'+prop+' }}',rightValue:true,operator:{type:'boolean',operation:'true',singleValue:true}}],combinator:'and'},options:{}},2.2);
const nodes=[
 node('Iniciar produção','manualTrigger',[0,0],{},1),
 code('Configurar pedido',[220,0],"// Edite o material; conserve o ID para verificar um pedido já enviado.\nreturn [{json:{material_id:'aula-historia-192',pedido_id:'pedido-'+Date.now()}}];"),
 code('Validar pedido',[440,0],'return [{json:('+prepararPedido.toString()+')($json)}];'),
 api('Solicitar produção privada',[660,0],'POST',"={{ $json.base + '/actions/workflows/' + $json.workflow + '/dispatches' }}",{response:{fullResponse:true},parameters:{sendBody:true,specifyBody:'json',jsonBody:'={{ $json.dispatch }}'}}),
 code('Conferir solicitação',[880,0],'return [{json:('+conferirDisparo.toString()+")($json,$('Validar pedido').first().json)}];"),
 node('Aguardar registro','wait',[1100,0],{amount:10,unit:'seconds'},1.1),
 api('Localizar pedido no GitHub',[1320,0],'GET',"={{ $json.base + '/actions/workflows/' + $json.workflow + '/runs?event=workflow_dispatch&per_page=100' }}"),
 code('Identificar execução',[1540,0],'return [{json:('+localizarExecucao.toString()+")($json,$('Aguardar registro').item.json)}];"),
 iff('Execução localizada',[1760,0],'run_id'),
 node('Aguardar execução','wait',[1980,0],{amount:10,unit:'seconds'},1.1),
 api('Consultar execução',[2200,0],'GET',"={{ $json.base + '/actions/runs/' + $json.run_id }}"),
 code('Atualizar estado',[2420,0],'return [{json:('+conferirEstado.toString()+")($json,$('Aguardar execução').item.json)}];"),
 iff('Terminou',[2640,0],'finalizada'),
 code('Conferir produção',[2860,-120],'return [{json:('+conferirResultado.toString()+')($json)}];'),
 api('Obter pacote privado',[3080,-120],'GET',"={{ $json.base + '/actions/runs/' + $json.run_id + '/artifacts' }}"),
 code('Aguardando sua revisão',[3300,-120],'return [{json:('+pacoteParaRevisao.toString()+")($json,$('Conferir produção').item.json)}];")
];
// O IF verifica booleanos: tornar explícito o sinal da localização.
nodes.find(n=>n.name==='Identificar execução').parameters.jsCode="const p=("+localizarExecucao.toString()+")($json,$('Aguardar registro').item.json);return [{json:{...p,localizada:Number.isSafeInteger(p.run_id)}}];";
nodes.find(n=>n.name==='Execução localizada').parameters.conditions.conditions[0].leftValue='={{ $json.localizada }}';
const w={name:'Estação — produzir aulas e livros para revisão v1',active:false,nodes,connections:{},settings:{executionOrder:'v1',executionTimeout:1500,timezone:'America/Sao_Paulo',saveDataErrorExecution:'none',saveDataSuccessExecution:'none',saveManualExecutions:false,saveExecutionProgress:false},pinData:{},tags:[]};
const link=(a,b,index=0)=>{w.connections[a]??={main:[]};w.connections[a].main[index]=[{node:b,type:'main',index:0}];};
for(const[a,b]of [['Iniciar produção','Configurar pedido'],['Configurar pedido','Validar pedido'],['Validar pedido','Solicitar produção privada'],['Solicitar produção privada','Conferir solicitação'],['Conferir solicitação','Aguardar registro'],['Aguardar registro','Localizar pedido no GitHub'],['Localizar pedido no GitHub','Identificar execução'],['Identificar execução','Execução localizada'],['Execução localizada','Aguardar execução'],['Aguardar execução','Consultar execução'],['Consultar execução','Atualizar estado'],['Atualizar estado','Terminou'],['Terminou','Conferir produção'],['Conferir produção','Obter pacote privado'],['Obter pacote privado','Aguardando sua revisão']])link(a,b);
link('Execução localizada','Aguardar registro',1);link('Terminou','Aguardar execução',1);
await fs.writeFile(new URL('produzir-materiais.json',import.meta.url),JSON.stringify(w,null,2)+'\n');
console.log('Workflow de produção gerado; inativo e sem credenciais.');
