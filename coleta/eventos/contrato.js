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
