/* Extrai, sem navegador, exatamente o que o estudante lê em cada atividade de uma aula-gei:
   título, comando, opções, situação em palavras simples, exemplo de outro caso e glossário.
   Carrega conteudo.js e, se existir, clareza.js (camada de exibição) na mesma ordem do index.html.
   Uso: node automacoes/aulas/linguagem_extrair.cjs aulas/<aula> [...]  → JSON em stdout. */
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function load(dir){const w={};const ctx=vm.createContext({window:w,document:{getElementById:()=>null,readyState:'complete',addEventListener(){}},console});
 vm.runInContext(fs.readFileSync(path.join(dir,'assets/conteudo.js'),'utf8'),ctx);
 const clareza=path.join(dir,'assets/clareza.js');if(fs.existsSync(clareza))vm.runInContext(fs.readFileSync(clareza,'utf8'),ctx);
 return {C:w.AULA_GEICONTEUDO,clareza:fs.existsSync(clareza)?sha(clareza):null};}
function extract(dir){const {C,clareza}=load(dir);const P=C.plain||null;const out={aula:C.id,titulo:C.title,kind:C.kind,revisao:C.didacticRevision||null,conteudo_sha256:sha(path.join(dir,'assets/conteudo.js')),clareza_sha256:clareza,abertura:P?P.inicio:C.objective,casos:C.cases.map(c=>c.title),itens:[]};
 for(const rota of ['principal','exemplos'])for(const t of C.routes[rota]||[]){const d=t.data||{};
  const opcoes=t.kind==='match'?d.pairs.map(p=>p[1]):t.kind==='order'?d.parts.slice():t.kind==='sort'?[...d.yes,...d.no]:t.kind==='bars'||t.kind==='tally'?d.labels.slice():[];
  const perguntas=t.kind==='match'?d.pairs.map(p=>p[0]):t.kind==='sort'?d.labels.slice():[];
  const situacao=P?(P.taskStory?.(t)||P.story(t.case)):null,exemplo=P?P.example(t,C.routes[rota]):null;
  const irmao=exemplo?C.routes[rota].find(x=>x.id===exemplo.id):null;
  const texto=[t.title,t.command,situacao?situacao.texto:t.explain,...perguntas,...opcoes].join(' ');
  out.itens.push({id:t.id,rota,caso:t.case,caso_titulo:C.cases[t.case]?.title||t.context,kind:t.kind,titulo:t.title,comando:t.command,original:t.original||{title:t.title,command:t.command},perguntas,opcoes,
   situacao:situacao?situacao.texto:null,explicacao_original:t.explain,exemplo:exemplo?{caso:exemplo.caso,texto:exemplo.texto,id:exemplo.id,operandos_iguais:!!(irmao&&t.kind==='number'&&JSON.stringify(irmao.data.operands)===JSON.stringify(d.operands))}:null,
   glossario_mostrado:P?P.glossary(texto).map(g=>g.term):[],glossario_encontrado:P?P.glossaryAll(texto).map(g=>g.term):[],resposta:t.kind==='number'?d.answer:null});}
 out.dicionario=P?P.dicionario:null;return out;}
const dirs=process.argv.slice(2);if(!dirs.length){console.error('informe aulas/<aula>');process.exit(2);}
process.stdout.write(JSON.stringify(dirs.map(extract),null,1));
