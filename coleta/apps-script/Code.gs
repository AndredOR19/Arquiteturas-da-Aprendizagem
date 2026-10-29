/* Contrato compartilhado entre navegador, receptor e testes. */
(function (root) {
  'use strict';
  const indisponivel = 'Recurso não disponibilizado';
  const opcoes = Object.freeze({
    legibilidade: ['Fácil','Em parte fácil','Difícil','Não sei avaliar'],
    organizacao: ['Sim','Em parte','Não','Não usei essas partes'],
    navegacao: ['Sim','Em parte','Não','Não testei'],
    controles: ['Sim','Em parte','Não','Não usei',indisponivel],
    fonte_percepcao: ['Mais confortável','Sem diferença percebida','Menos confortável','Não troquei','Não sei avaliar',indisponivel],
    espacamento_percepcao: ['Mais confortável','Sem diferença percebida','Menos confortável','Não ajustei','Não sei avaliar',indisponivel],
    representacoes_percepcao: ['Ajudaram','Ajudaram em parte','Atrapalharam','Não percebi diferença','Não usei',indisponivel],
    dificuldades: ['Texto','Organização','Botões','Fontes ou ajustes','Imagens ou fórmulas','Áudio','Celular ou tela','Outra','Não percebi dificuldade'],
    sugestao: ['Quero comentar','Não tenho sugestão agora']
  });
  function falha(codigo, mensagem) {
    const e = new Error(mensagem); e.codigo = codigo; throw e;
  }
  function texto(v, nome, max, opcional) {
    if (opcional && (v === undefined || v === null || v === '')) return '';
    if (typeof v !== 'string' || !v.trim() || v.length > max) falha('DADOS_INVALIDOS', nome + ' ausente ou inválido.');
    return v;
  }
  function inteiro(v, nome, min, max) {
    if (!Number.isInteger(v) || v < min || v > max) falha('DADOS_INVALIDOS', nome + ' inválido.');
    return v;
  }
  function serializar(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(serializar).join(',') + ']';
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + serializar(v[k])).join(',') + '}';
  }
  function validarAvaliacao(e) {
    const pendencias = [];
    if (!e || e.versao !== '1.1.0') return ['versao_questionario'];
    const r = e.respostas || {};
    Object.keys(opcoes).forEach(k => {
      if (k === 'dificuldades') {
        if (!Array.isArray(r[k]) || !r[k].length || new Set(r[k]).size !== r[k].length || r[k].some(v => !opcoes[k].includes(v)) || (r[k].includes('Não percebi dificuldade') && r[k].length !== 1)) pendencias.push(k);
      } else if (!opcoes[k].includes(r[k])) pendencias.push(k);
    });
    if (r.sugestao === 'Quero comentar' && (typeof e.comentario !== 'string' || !e.comentario.trim())) pendencias.push('comentario');
    if (e.comentario !== undefined && (typeof e.comentario !== 'string' || e.comentario.length > 5000)) pendencias.push('comentario');
    if (e.confirmada !== true) pendencias.push('confirmacao');
    return [...new Set(pendencias)];
  }
  function validar(p) {
    if (!p || p.schema_version !== '1.0.0') falha('VERSAO_INVALIDA','Formato de relatório não reconhecido.');
    if (!/^[a-zA-Z0-9_-]{16,100}$/.test(p.submission_id || '')) falha('DADOS_INVALIDOS','ID da entrega inválido.');
    if (!['teste','producao'].includes(p.ambiente)) falha('DADOS_INVALIDOS','Ambiente inválido.');
    const a = p.aula || {}, s = p.estudante || {}, l = p.aprendizagem || {};
    ['id','titulo','versao','prompt'].forEach(k => texto(a[k],'Aula: '+k,k==='titulo'?300:100));
    ['escola','turma','componente'].forEach(k => texto(a[k],'Aula: '+k,200,true));
    texto(s.codigo,'Código do estudante',100); texto(s.nome,'Nome informado',200,true);
    const total = inteiro(l.percursos_total,'Percursos previstos',26,1000);
    if (l.percursos_concluidos !== total || !Array.isArray(l.percursos) || l.percursos.length !== total) falha('ATIVIDADES_PENDENTES','Conclua todos os percursos antes de enviar.');
    const ids = new Set(); let acertos = 0, tentativas = 0;
    l.percursos.forEach((r, i) => {
      texto(String(r.id === undefined ? '' : r.id),'ID do percurso',100);
      if (ids.has(String(r.id))) falha('DADOS_INVALIDOS','Percurso repetido.');
      ids.add(String(r.id));
      if (r.concluido !== true || !Array.isArray(r.tentativas) || !r.tentativas.length || !Array.isArray(r.pistas)) falha('ATIVIDADES_PENDENTES','Percurso incompleto: '+(i+1));
      r.tentativas.forEach(t => { if (!t || typeof t.correta !== 'boolean' || !Object.prototype.hasOwnProperty.call(t,'resposta')) falha('DADOS_INVALIDOS','Tentativa incompleta.'); });
      if (r.tentativas[r.tentativas.length-1].correta !== true) falha('ATIVIDADES_PENDENTES','O percurso precisa ser concluído após correção.');
      if (r.acerto_inicial !== r.tentativas[0].correta || serializar(r.primeira_resposta) !== serializar(r.tentativas[0].resposta)) falha('DADOS_INVALIDOS','Primeira resposta não corresponde ao histórico.');
      if (r.acerto_inicial) acertos++;
      tentativas += r.tentativas.length;
    });
    if (l.acertos_iniciais !== acertos || l.tentativas !== tentativas) falha('DADOS_INVALIDOS','Totais não correspondem ao histórico.');
    if (typeof l.nota !== 'number' || !Number.isFinite(l.nota) || typeof l.nota_maxima !== 'number' || !Number.isFinite(l.nota_maxima) || l.nota_maxima <= 0 || l.nota < 0 || l.nota > l.nota_maxima) falha('DADOS_INVALIDOS','Nota informada fora da escala.');
    const pendencias = validarAvaliacao(p.experiencia);
    if (pendencias.length) falha('AVALIACAO_PENDENTE','Responda e confirme a avaliação: '+pendencias.join(', '));
    const pref=p.experiencia.preferencias;
    if(pref!==undefined && (!pref || typeof pref!=='object' || Array.isArray(pref))) falha('DADOS_INVALIDOS','Preferências inválidas.');
    ['fonte_solicitada','tamanho','entrelinha','largura'].forEach(k=>{const v=pref&&pref[k];if(v!==undefined && v!==null && !['string','number','boolean'].includes(typeof v))falha('DADOS_INVALIDOS','Preferência inválida: '+k);if(typeof v==='string'&&v.length>200)falha('DADOS_INVALIDOS','Preferência maior que o limite: '+k);if(typeof v==='number'&&!Number.isFinite(v))falha('DADOS_INVALIDOS','Preferência numérica inválida.');});
    texto(p.relatorio_texto,'Relatório completo',700000);
    if (p.acompanhamento !== undefined) validarAcompanhamento(p.acompanhamento);
    const raw = serializar(p);
    if (raw.length > 1000000) falha('RELATORIO_GRANDE','Relatório maior que o limite; preserve o arquivo integral e solicite orientação.');
    return {raw:raw, acertos:acertos, tentativas:tentativas};
  }
  function validarAcompanhamento(a) {
    if (!a || a.versao !== '1.0.0') falha('DADOS_INVALIDOS','Acompanhamento: versão inválida.');
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuid.test(a.aluno_id || '') || !uuid.test(a.matricula_id || '')) falha('DADOS_INVALIDOS','Acompanhamento: IDs estáveis inválidos.');
    inteiro(a.ano_letivo,'Ano letivo',2000,2200);
    ['etapa','serie','fonte_confirmacao','protocolo_id','versao_protocolo','metodo'].forEach(k=>texto(a[k],'Acompanhamento: '+k,500));
    texto(a.coorte_id,'Coorte',100,true);
    if (typeof a.data_aplicacao !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(a.data_aplicacao) || !Number.isFinite(Date.parse(a.data_aplicacao)) || new Date(a.data_aplicacao).toISOString().slice(0,10)!==a.data_aplicacao) falha('DADOS_INVALIDOS','Data de aplicação inválida.');
    if (!Array.isArray(a.medidas) || a.medidas.length>1000) falha('DADOS_INVALIDOS','Medidas de acompanhamento inválidas.');
    a.medidas.forEach(m=>{
      if(!m || !['inicial','treino','pos','retencao','transferencia'].includes(m.momento)) falha('DADOS_INVALIDOS','Momento da medida inválido.');
      ['indicador','instrumento_id','versao_instrumento','rubrica','unidade','fonte'].forEach(k=>texto(m[k],'Medida: '+k,500));
      if(m.valor===null) texto(m.motivo_ausencia,'Motivo da ausência',500);
      else if(typeof m.valor!=='number' || !Number.isFinite(m.valor) || (m.motivo_ausencia!==null && m.motivo_ausencia!==undefined)) falha('DADOS_INVALIDOS','Valor ou ausência da medida inválido.');
      if(m.denominador!==null && (typeof m.denominador!=='number' || !Number.isFinite(m.denominador) || m.denominador<=0)) falha('DADOS_INVALIDOS','Denominador da medida inválido.');
    });
    return a;
  }
  function celula(v) {
    if (v === undefined || v === null) return '';
    if (typeof v === 'string' && /^[\s]*[=+\-@]/.test(v)) return "'"+v;
    return v;
  }
  const api=Object.freeze({opcoes:opcoes,validar:validar,validarAvaliacao:validarAvaliacao,validarAcompanhamento:validarAcompanhamento,serializar:serializar,celula:celula,falha:falha});
  root.ColetaContrato=api;
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
/* Eventos parciais: não substituem o contrato de conclusão. */
(function(root){
  'use strict';
  function validar(p){
    const fail=()=>{throw new Error('DADOS_INVALIDOS');};
    const id=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(v);
    if(!p||p.schema_version!=='eventos-1.0.0'||!id(p.batch_id)||!id(p.sessao_id)||!['teste','producao'].includes(p.ambiente))fail();
    if(!p.aula||!id(p.aula.id)||!(typeof p.aula.versao==='string'&&/^[a-zA-Z0-9_.-]{1,100}$/.test(p.aula.versao))||!p.estudante||!id(p.estudante.codigo))fail();
    if(!Array.isArray(p.eventos)||!p.eventos.length||p.eventos.length>20)fail();
    const seen=new Set();
    const eventos=p.eventos.map(e=>{
      if(!e||!id(e.id)||seen.has(e.id)||!Number.isInteger(e.sequencia)||e.sequencia<1||typeof e.ocorrido_em!=='string'||!Number.isFinite(Date.parse(e.ocorrido_em)))fail();
      seen.add(e.id);
      if(!['inicio','tentativa','pista','etapa_concluida','recurso'].includes(e.tipo))fail();
      const d=e.dados||{};if(Array.isArray(d)||typeof d!=='object'||d===null)fail();
      if(Object.keys(d).some(k=>!['item_id','correta','nivel','recurso_id','ativo'].includes(k)))fail();
      if(['tentativa','pista','etapa_concluida'].includes(e.tipo)&&!id(d.item_id))fail();
      if(e.tipo==='tentativa'&&typeof d.correta!=='boolean')fail();
      if(e.tipo==='pista'&&(!Number.isInteger(d.nivel)||d.nivel<1||d.nivel>100))fail();
      if(e.tipo==='recurso'&&(!id(d.recurso_id)||typeof d.ativo!=='boolean'))fail();
      if(d.item_id!==undefined&&!id(d.item_id))fail();
      if(d.recurso_id!==undefined&&!id(d.recurso_id))fail();
      if(d.correta!==undefined&&typeof d.correta!=='boolean')fail();
      if(d.ativo!==undefined&&typeof d.ativo!=='boolean')fail();
      if(d.nivel!==undefined&&(!Number.isInteger(d.nivel)||d.nivel<1||d.nivel>100))fail();
      return {id:e.id,sequencia:e.sequencia,ocorrido_em:e.ocorrido_em,tipo:e.tipo,dados:d};
    });
    const limpo={schema_version:p.schema_version,batch_id:p.batch_id,sessao_id:p.sessao_id,ambiente:p.ambiente,aula:{id:p.aula.id,versao:p.aula.versao},estudante:{codigo:p.estudante.codigo},eventos};
    if(JSON.stringify(limpo).length>30000)fail();return limpo;
  }
  root.EventosContrato={validar};
})(globalThis);

/* Receptor Apps Script. Executar em conta proprietária da planilha. */
var COLETA_VERSAO = '1.0.0';
var HEADERS_COLETA = {"Entregas":["ID da entrega","Recebido em","Ambiente","Estado","Protocolo","Aula ID","Título","Versão da aula","Versão do prompt","Versão do questionário","Escola","Turma","Componente","Código do estudante","Nome informado","Percursos previstos","Percursos concluídos","Acertos iniciais","Tentativas","Nota informada","Nota máxima","Leitura","Organização","Navegação","Controles","Fonte","Espaçamento","Representações","Dificuldades","Sugestão","Comentário","Fonte solicitada","Tamanho do texto","Entrelinha","Largura","SHA-256","Partes do relatório","Avisos"],"Relatorios":["ID da entrega","Protocolo","Parte","Total de partes","SHA-256","Relatório JSON integral"],"Acessos":["Hash do convite","Aula ID","Código do estudante","Ambiente","Expira em","Ativo","Convite para distribuir","Criado em","Observação"]};

function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function propriedades_() { return PropertiesService.getScriptProperties(); }
function banco_() {
  var id = propriedades_().getProperty('SPREADSHEET_ID');
  if (!id) ColetaContrato.falha('NAO_CONFIGURADO','Serviço ainda não configurado.');
  return SpreadsheetApp.openById(id);
}
function sha256_(text) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,text,Utilities.Charset.UTF_8).map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join('');
}
function aba_(db,nome) {
  var s=db.getSheetByName(nome);
  if (!s) ColetaContrato.falha('ESTRUTURA_INVALIDA','Estrutura de armazenamento não configurada.');
  var got=s.getRange(1,1,1,HEADERS_COLETA[nome].length).getValues()[0];
  if (JSON.stringify(got)!==JSON.stringify(HEADERS_COLETA[nome])) ColetaContrato.falha('ESTRUTURA_INVALIDA','Cabeçalhos de armazenamento divergentes.');
  return s;
}
function garantirEspaco_(sheet,ultimo,cols) {
  if (sheet.getMaxRows()<ultimo) sheet.insertRowsAfter(sheet.getMaxRows(),ultimo-sheet.getMaxRows());
  if (sheet.getMaxColumns()<cols) sheet.insertColumnsAfter(sheet.getMaxColumns(),cols-sheet.getMaxColumns());
}
function localizarEntrega_(sheet,id) {
  var n=sheet.getLastRow()-1;
  if(n<1)return null;
  var ids=sheet.getRange(2,1,n,1).getValues();
  for(var i=0;i<ids.length;i++)if(ids[i][0]===id)return {linha:i+2,valores:sheet.getRange(i+2,1,1,38).getValues()[0]};
  return null;
}
function convite_(sheet,token,p) {
  if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))ColetaContrato.falha('CONVITE_INVALIDO','Convite inválido ou expirado.');
  var hash=sha256_(token),n=sheet.getLastRow()-1;
  if(n<1)ColetaContrato.falha('CONVITE_INVALIDO','Convite inválido ou expirado.');
  var rows=sheet.getRange(2,1,n,9).getValues(), now=Date.now();
  for(var i=0;i<rows.length;i++){
    var r=rows[i];
    if(r[0]===hash&&r[1]===p.aula.id&&r[2]===p.estudante.codigo&&r[3]===p.ambiente&&r[5]===true&&new Date(r[4]).getTime()>now)return;
  }
  ColetaContrato.falha('CONVITE_INVALIDO','Convite inválido ou expirado.');
}
function removerPartes_(sheet,id) {
  var n=sheet.getLastRow()-1;if(n<1)return;
  var rows=sheet.getRange(2,1,n,1).getValues();
  for(var i=rows.length-1;i>=0;i--)if(rows[i][0]===id)sheet.deleteRows(i+2,1);
}
function recibo_(row,repetida){return {ok:true,estado:'recebido',submission_id:row[0],protocolo:row[4],recebido_em:new Date(row[1]).toISOString(),sha256:row[35],duplicada:repetida,versao_coletor:COLETA_VERSAO};}
function doGet() {
  return json_({servico:'coleta-arquiteturas',versao:COLETA_VERSAO,recebimento_ativo:propriedades_().getProperty('RECEBIMENTO_ATIVO')==='true'});
}
function doPost(e) {
  var lock=null;
  try {
    if(propriedades_().getProperty('RECEBIMENTO_ATIVO')!=='true')ColetaContrato.falha('DESATIVADO','Recebimento ainda não ativado.');
    var raw=e&&e.postData&&e.postData.contents;
    if(typeof raw!=='string'||raw.length>1100000)ColetaContrato.falha('DADOS_INVALIDOS','Solicitação ausente ou maior que o limite.');
    var envelope;try{envelope=JSON.parse(raw);}catch(_){ColetaContrato.falha('DADOS_INVALIDOS','Solicitação inválida.');}
    if(envelope.payload&&envelope.payload.schema_version==='eventos-1.0.0')return receberEventos_(envelope);
    var p=envelope.payload,parsed=ColetaContrato.validar(p),hash=sha256_(parsed.raw);
    if(propriedades_().getProperty('MODO_RECEBIMENTO')!=='producao'&&p.ambiente!=='teste')ColetaContrato.falha('SOMENTE_TESTE','O serviço ainda está em modo de teste.');
    lock=LockService.getScriptLock();if(!lock.tryLock(10000))ColetaContrato.falha('OCUPADO','Recebimento ocupado. Tente novamente com a mesma entrega.');
    var db=banco_(),access=aba_(db,'Acessos'),ent=aba_(db,'Entregas'),parts=aba_(db,'Relatorios');
    convite_(access,envelope.token,p);
    var old=localizarEntrega_(ent,p.submission_id);
    if(old&&old.valores[35]!==hash)ColetaContrato.falha('CONFLITO','O ID já corresponde a outro conteúdo. Preserve o recibo e solicite revisão ao professor.');
    if(old&&old.valores[3]==='recebido')return json_(recibo_(old.valores,true));
    // Uma entrega por convite de aula/estudante/ambiente; reenvio idêntico é idempotente.
    var count=ent.getLastRow()-1;
    if(count>0){
      var existing=ent.getRange(2,1,count,14).getValues();
      for(var x=0;x<existing.length;x++)if(existing[x][0]!==p.submission_id&&existing[x][5]===p.aula.id&&existing[x][13]===p.estudante.codigo&&existing[x][2]===p.ambiente)ColetaContrato.falha('ENTREGA_EXISTENTE','Já existe uma entrega para este convite. Peça orientação ao professor.');
    }
    var r=p.experiencia.respostas,pr=p.experiencia.preferencias||{},l=p.aprendizagem,a=p.aula;
    var protocolo=old?old.valores[4]:'ARQ-'+Utilities.getUuid().replace(/-/g,'').slice(0,16).toUpperCase();
    var chunks=[];for(var pos=0;pos<parsed.raw.length;pos+=30000)chunks.push(parsed.raw.slice(pos,pos+30000));
    var row=[p.submission_id,old?old.valores[1]:new Date(),p.ambiente,'gravando',protocolo,a.id,a.titulo,a.versao,a.prompt,p.experiencia.versao,a.escola||'',a.turma||'',a.componente||'',p.estudante.codigo,p.estudante.nome||'',l.percursos_total,l.percursos_concluidos,l.acertos_iniciais,l.tentativas,l.nota,l.nota_maxima,r.legibilidade,r.organizacao,r.navegacao,r.controles,r.fonte_percepcao,r.espacamento_percepcao,r.representacoes_percepcao,r.dificuldades.join(' | '),r.sugestao,p.experiencia.comentario||'',pr.fonte_solicitada||'',pr.tamanho||'',pr.entrelinha||'',pr.largura||'',hash,chunks.length,'Nota declarada pelo artefato; renderização da fonte apenas se verificada.'];
    var line=old?old.linha:ent.getLastRow()+1;
    garantirEspaco_(ent,line,38);ent.getRange(line,1,1,38).setValues([row.map(ColetaContrato.celula)]);SpreadsheetApp.flush();
    removerPartes_(parts,p.submission_id);
    var start=parts.getLastRow()+1;
    garantirEspaco_(parts,start+chunks.length-1,6);
    parts.getRange(start,1,chunks.length,6).setValues(chunks.map(function(chunk,i){return [p.submission_id,protocolo,i+1,chunks.length,hash,chunk];}));
    SpreadsheetApp.flush();
    ent.getRange(line,4).setValue('recebido');SpreadsheetApp.flush();row[3]='recebido';
    return json_(recibo_(row,false));
  } catch(error) {
    return json_({ok:false,codigo:error.codigo||'ERRO_ARMAZENAMENTO',mensagem:error.codigo?error.message:'Não foi possível confirmar a gravação. Preserve o relatório e tente novamente com o mesmo ID.'});
  } finally {if(lock&&lock.hasLock())lock.releaseLock();}
}

// Funções abaixo só são executadas pelo proprietário no editor, não pelo endpoint.
function prepararColeta() {
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  if(!ss)throw new Error('Abra o Apps Script por Extensões na planilha da coleta.');
  Object.keys(HEADERS_COLETA).forEach(function(n){aba_(ss,n);});
  propriedades_().setProperties({SPREADSHEET_ID:ss.getId(),RECEBIMENTO_ATIVO:'false',MODO_RECEBIMENTO:'teste'});
  ss.setSpreadsheetTimeZone('America/Sao_Paulo');
  ss.getSheetByName('Painel').getRange('B4').setValue('Preparado; implantação e teste pendentes');
}
function ativarRecebimentoParaTeste() {
  var ss=banco_();propriedades_().setProperty('RECEBIMENTO_ATIVO','true');
  ss.getSheetByName('Painel').getRange('B4').setValue('Recebimento ativado; validar teste real antes de usar com alunos');
}
function pausarRecebimento() {propriedades_().setProperty('RECEBIMENTO_ATIVO','false');banco_().getSheetByName('Painel').getRange('B4').setValue('Recebimento pausado');}
function ativarProducaoAposTeste() {
  var ss=banco_(),sh=aba_(ss,'Entregas'),n=sh.getLastRow()-1;
  var ok=n>0&&sh.getRange(2,3,n,2).getValues().some(function(r){return r[0]==='teste'&&r[1]==='recebido';});
  if(!ok)throw new Error('Conclua e confira o teste real de recebimento antes de ativar produção.');
  propriedades_().setProperties({RECEBIMENTO_ATIVO:'true',MODO_RECEBIMENTO:'producao'});
  ss.getSheetByName('Painel').getRange('B4').setValue('Recebimento de produção ativado');
}
function emitirConvites_(aula,codigos,ambiente,expira) {
  if(!aula||!Array.isArray(codigos)||!codigos.length||!['teste','producao'].includes(ambiente)||new Date(expira).getTime()<=Date.now())throw new Error('Configuração dos convites inválida.');
  var lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
    var sh=aba_(banco_(),'Acessos'),rows=codigos.map(function(c){
      if(typeof c!=='string'||!c.trim()||c.length>100)throw new Error('Código inválido.');
      var token=(Utilities.getUuid()+Utilities.getUuid()).replace(/-/g,'');
      return [sha256_(token),aula,c,ambiente,new Date(expira),true,token,new Date(),'Distribuir individualmente; convite não comprova identidade civil.'];
    });
    var start=sh.getLastRow()+1;garantirEspaco_(sh,start+rows.length-1,9);sh.getRange(start,1,rows.length,9).setValues(rows.map(function(row){return row.map(ColetaContrato.celula);}));
    SpreadsheetApp.flush();
  }finally{lock.releaseLock();}
}
function criarConviteDeTeste(){emitirConvites_('teste-coleta',['TESTE-001'],'teste',new Date(Date.now()+7*86400000).toISOString());}
function criarConvitesDaTurma(){
  // Preencher com códigos internos, sem e-mails ou diagnósticos.
  var aula='PREENCHER_ID_DA_AULA';var codigos=[];
  if(!codigos.length||aula==='PREENCHER_ID_DA_AULA')throw new Error('Preencha ID da aula e códigos dos estudantes antes de executar.');
  emitirConvites_(aula,codigos,'producao',new Date(Date.now()+14*86400000).toISOString());
}


/* Adicionado ao Code.gs pelo build-server.mjs; usa os convites privados existentes. */
function receberEventos_(envelope){
  var lock=null;
  try{
    if(propriedades_().getProperty('EVENTOS_ATIVOS')!=='true')throw new Error('DESATIVADO');
    var p=EventosContrato.validar(envelope.payload);
    if(propriedades_().getProperty('MODO_RECEBIMENTO')!=='producao'&&p.ambiente!=='teste')throw new Error('SOMENTE_TESTE');
    lock=LockService.getScriptLock();if(!lock.tryLock(10000))throw new Error('OCUPADO');
    var db=banco_();convite_(aba_(db,'Acessos'),envelope.token,p);
    var sh=db.getSheetByName('Eventos');if(!sh)throw new Error('NAO_CONFIGURADO');
    var cab=['batch_id','recebido_em','sha256','payload_json'];
    if(JSON.stringify(sh.getRange(1,1,1,4).getValues()[0])!==JSON.stringify(cab))throw new Error('NAO_CONFIGURADO');
    var raw=ColetaContrato.serializar(p),hash=sha256_(raw),n=sh.getLastRow()-1;
    if(n>0){var rows=sh.getRange(2,1,n,3).getValues();for(var i=0;i<rows.length;i++)if(rows[i][0]===p.batch_id){if(rows[i][2]!==hash)throw new Error('CONFLITO');return json_({ok:true,estado:'recebido',batch_id:p.batch_id,ids:p.eventos.map(function(e){return e.id;}),duplicada:true});}}
    garantirEspaco_(sh,sh.getLastRow()+1,4);
    sh.getRange(sh.getLastRow()+1,1,1,4).setValues([[p.batch_id,new Date(),hash,raw]]);SpreadsheetApp.flush();
    return json_({ok:true,estado:'recebido',batch_id:p.batch_id,ids:p.eventos.map(function(e){return e.id;}),duplicada:false});
  }catch(e){return json_({ok:false,codigo:['DESATIVADO','SOMENTE_TESTE','OCUPADO','NAO_CONFIGURADO','CONFLITO','CONVITE_INVALIDO'].indexOf(e.codigo||e.message)>=0?(e.codigo||e.message):'DADOS_INVALIDOS'});}
  finally{if(lock&&lock.hasLock())lock.releaseLock();}
}
function prepararEventos(){
  var db=banco_(),sh=db.getSheetByName('Eventos')||db.insertSheet('Eventos');
  if(sh.getLastRow()===0)sh.getRange(1,1,1,4).setValues([['batch_id','recebido_em','sha256','payload_json']]);
  propriedades_().setProperty('EVENTOS_ATIVOS','false');
}
function ativarEventosParaTeste(){if(propriedades_().getProperty('MODO_RECEBIMENTO')==='producao')throw new Error('Use ambiente de teste.');propriedades_().setProperty('EVENTOS_ATIVOS','true');}
function pausarEventos(){propriedades_().setProperty('EVENTOS_ATIVOS','false');}
function ativarEventosAposTeste(){
  var sh=banco_().getSheetByName('Eventos'),n=sh?sh.getLastRow()-1:0;
  if(n<1||!sh.getRange(2,4,n,1).getValues().some(function(r){try{return JSON.parse(r[0]).ambiente==='teste';}catch(_){return false;}}))throw new Error('Confira primeiro um lote de teste gravado.');
  if(propriedades_().getProperty('MODO_RECEBIMENTO')!=='producao')throw new Error('Ative produção do coletor após teste.');
  propriedades_().setProperty('EVENTOS_ATIVOS','true');
}
