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
