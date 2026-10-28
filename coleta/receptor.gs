/* Receptor Apps Script. Executar em conta proprietária da planilha. */
var COLETA_VERSAO = '1.0.0';
var HEADERS_COLETA = __HEADERS_JSON__;

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
