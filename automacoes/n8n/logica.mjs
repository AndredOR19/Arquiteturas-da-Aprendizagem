// Funções puras também incorporadas aos nós Code pelo gerador.
export function prepararEntrada(body, config, contrato) {
  const recusar=(codigo,mensagem,status=400)=>({encaminhar:false,status,recibo:{ok:false,codigo,mensagem}});
  if(!config||!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(config.receptor||'')||config.receptor.includes('PREENCHER')) return recusar('NAO_CONFIGURADO','Coleta ainda não configurada.',503);
  if(!['teste','producao'].includes(config.ambiente))return recusar('NAO_CONFIGURADO','Ambiente de coleta não configurado.',503);
  let e;
  try {
    const raw=typeof body==='string'?body:JSON.stringify(body);
    if(typeof raw!=='string'||raw.length>1100000)return recusar('DADOS_INVALIDOS','Relatório ausente ou maior que o limite.');
    e=JSON.parse(raw);
    if(!e||typeof e.token!=='string'||!/^[a-f0-9]{64}$/.test(e.token))return recusar('CONVITE_INVALIDO','Informe um convite individual válido.');
    contrato.validar(e.payload);
    if(config.ambiente==='teste'&&e.payload.ambiente!=='teste')return recusar('SOMENTE_TESTE','Coleta ainda em modo de teste.');
  }catch(_){return recusar('DADOS_INVALIDOS','Relatório incompleto ou inválido. Preserve o arquivo e revise as atividades e a avaliação.');}
  return {encaminhar:true,receptor:config.receptor,submission_id:e.payload.submission_id,envelope:{token:e.token,payload:e.payload}};
}

export function normalizarRecibo(value, submissionId) {
  const falha=(codigo,mensagem,status=502)=>({status,recibo:{ok:false,codigo,mensagem}});
  let r=value;
  try{if(typeof r==='string')r=JSON.parse(r);}catch(_){return falha('RECEPTOR_INDISPONIVEL','Não foi possível confirmar o armazenamento. Reenvie com o mesmo ID.');}
  if(r&&r.ok===false){
    const mensagens={CONVITE_INVALIDO:'Convite inválido ou expirado.',SOMENTE_TESTE:'Coleta ainda em modo de teste.',DESATIVADO:'Recebimento pausado.',CONFLITO:'Este ID já corresponde a outro conteúdo. Solicite revisão ao professor.',ENTREGA_EXISTENTE:'Já existe uma entrega para este convite. Solicite revisão ao professor.',OCUPADO:'Serviço ocupado. Reenvie com o mesmo ID.',AVALIACAO_PENDENTE:'Responda e confirme a avaliação.',ATIVIDADES_PENDENTES:'Conclua todas as atividades.',DADOS_INVALIDOS:'Relatório inválido. Preserve o arquivo e solicite orientação.'};
    return falha(Object.hasOwn(mensagens,r.codigo)?r.codigo:'ERRO_ARMAZENAMENTO',mensagens[r.codigo]||'Não foi possível confirmar o armazenamento. Reenvie com o mesmo ID.',200);
  }
  if(!r||r.ok!==true||r.estado!=='recebido'||r.submission_id!==submissionId||!/^[a-f0-9]{64}$/.test(r.sha256||'')||!/^ARQ-[A-F0-9]{16}$/.test(r.protocolo||'')||typeof r.recebido_em!=='string'||!Number.isFinite(Date.parse(r.recebido_em))||typeof r.duplicada!=='boolean')return falha('RECIBO_INVALIDO','O armazenamento não forneceu confirmação válida. Reenvie com o mesmo ID.');
  return {status:200,recibo:{ok:true,estado:'recebido',submission_id:r.submission_id,protocolo:r.protocolo,recebido_em:r.recebido_em,sha256:r.sha256,duplicada:r.duplicada,versao_coletor:'1.0.0'}};
}
