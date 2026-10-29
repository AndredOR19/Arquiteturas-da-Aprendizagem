// Apenas identificadores de materiais cadastrados; sem texto, token, e-mail ou URLs arbitrárias.
export function prepararPedido(p){
  if(!p||!['aula-historia-192','capitulo-demonstracao'].includes(p.material_id))throw Error('Material não cadastrado.');
  if(!/^[A-Za-z0-9][A-Za-z0-9_-]{7,79}$/.test(p.pedido_id||''))throw Error('ID do pedido inválido.');
  return {pedido_id:p.pedido_id,material_id:p.material_id,tentativas:0,
    repositorio:'AndredOR19/Biblioteca-de-Diagramacao',workflow:'estacao-automatica.yml',
    base:'https://api.github.com/repos/AndredOR19/Biblioteca-de-Diagramacao',
    dispatch:{ref:'main',inputs:{material:p.material_id,pedido_id:p.pedido_id}}};
}
export function conferirDisparo(res,p){
  if(res?.statusCode!==204)throw Error('Disparo sem confirmação. Confira execuções pelo ID antes de reenviar; não repetir cegamente.');
  return {...p,estado:'solicitado'};
}
export function localizarExecucao(res,p){
  if(!Array.isArray(res?.workflow_runs))throw Error('Resposta de execuções inválida.');
  const encontrados=res.workflow_runs.filter(r=>r.display_title==='estacao-'+p.pedido_id&&r.event==='workflow_dispatch');
  if(encontrados.length>1)throw Error('Pedido repetido em mais de uma execução. Conferência necessária.');
  const n=p.tentativas+1;
  if(!encontrados.length){if(n>=120)throw Error('Prazo excedido sem localizar execução. Confira no GitHub antes de repetir.');return {...p,tentativas:n,finalizada:false};}
  const r=encontrados[0];
  if(!Number.isSafeInteger(r.id)||!/^https:\/\/github\.com\/AndredOR19\/Biblioteca-de-Diagramacao\/actions\/runs\/\d+$/.test(r.html_url||''))throw Error('Execução não reconhecida.');
  return {...p,tentativas:n,run_id:r.id,run_url:r.html_url,finalizada:r.status==='completed',conclusao:r.conclusion};
}
export function conferirEstado(res,p){
  if(res?.id!==p.run_id)throw Error('ID de execução divergente.');
  if(p.tentativas>=120&&res.status!=='completed')throw Error('Tempo de acompanhamento excedido. A produção pode continuar no GitHub.');
  return {...p,tentativas:p.tentativas+1,finalizada:res.status==='completed',conclusao:res.conclusion};
}
export function conferirResultado(p){
  if(p.finalizada!==true||p.conclusao!=='success')throw Error('Produção não concluída com sucesso. Consulte '+p.run_url);
  return p;
}
export function pacoteParaRevisao(res,p){
  const a=res?.artifacts?.find(a=>a.name==='estacao-'+p.pedido_id);
  if(!a||a.expired||!Number.isSafeInteger(a.id))throw Error('Pacote ausente ou expirado. Não afirmar produção entregue.');
  return {pedido_id:p.pedido_id,material_id:p.material_id,estado:'aguardando_revisao',aprovado:false,publicado:false,
    execucao:p.run_url,artefato:{id:a.id,nome:a.name,bytes:a.size_in_bytes},
    observacao:'Baixar pela execução privada. Sucesso técnico não equivale a revisão linguística, pedagógica, visual ou aprovação editorial.'};
}
