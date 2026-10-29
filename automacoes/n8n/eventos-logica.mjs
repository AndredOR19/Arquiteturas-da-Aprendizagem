export function prepararEventos(body,config,contrato){
  const erro=(codigo,status=400)=>({encaminhar:false,status,recibo:{ok:false,codigo}});
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(config?.receptor||'')||config.receptor.includes('PREENCHER')||!['teste','producao'].includes(config.ambiente))return erro('NAO_CONFIGURADO',503);
  try{
    const raw=typeof body==='string'?body:JSON.stringify(body);if(raw.length>40000)return erro('DADOS_INVALIDOS');
    const e=JSON.parse(raw);if(!/^[a-f0-9]{64}$/.test(e.token||''))return erro('CONVITE_INVALIDO');
    const p=contrato.validar(e.payload);if(config.ambiente==='teste'&&p.ambiente!=='teste')return erro('SOMENTE_TESTE');
    return {encaminhar:true,receptor:config.receptor,envelope:{token:e.token,payload:p},batch_id:p.batch_id,ids:p.eventos.map(e=>e.id)};
  }catch{return erro('DADOS_INVALIDOS');}
}
export function conferirEventos(value,entrada){
  try{
    const r=typeof value==='string'?JSON.parse(value):value;
    if(r?.ok===false)return {status:200,recibo:{ok:false,codigo:'RECEBIMENTO_RECUSADO'}};
    if(r?.ok!==true||r.estado!=='recebido'||r.batch_id!==entrada.batch_id||typeof r.duplicada!=='boolean'||JSON.stringify(r.ids)!==JSON.stringify(entrada.ids))throw Error();
    return {status:200,recibo:{ok:true,estado:'recebido',batch_id:r.batch_id,ids:r.ids,duplicada:r.duplicada}};
  }catch{return {status:502,recibo:{ok:false,codigo:'SEM_CONFIRMACAO'}};}
}
