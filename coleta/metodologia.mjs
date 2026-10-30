// Extensão optativa: não modifica o questionário legado nem a nota.
import './contrato.js';
const C=globalThis.ColetaContrato;
export function comMetodologia(payload, dados){
  if(payload.metodologia!==undefined) throw new Error('Metodologia já anexada; preserve o snapshot.');
  const out=JSON.parse(JSON.stringify(payload));
  out.metodologia=JSON.parse(JSON.stringify(dados));
  C.validarMetodologia(out.metodologia,out.aprendizagem);
  out.relatorio_texto+='\n\nMONITORAMENTO METODOLÓGICO 1.0.0\n'+JSON.stringify(out.metodologia,null,2)+
    '\nPercepção declarada e desempenho são registros distintos. Não demonstram tédio, diagnóstico ou causalidade.';
  C.validar(out);
  return out;
}
export function resumirMetodologia(payload){
  C.validar(payload);
  if(!payload.metodologia)return {status:'nao_coletado',circuitos:[]};
  const m=payload.metodologia;
  return {status:'coletado',estilo_id:m.estilo_id,metodo:m.metodo_principal,
    percepcao:m.percepcao,confirmada:m.confirmada,circuitos:m.circuitos.map(c=>{
      const p=payload.aprendizagem.percursos.filter(p=>c.percursos_ids.includes(String(p.id)));
      return {id:c.id,metodo:c.metodo,operacao:c.operacao,total:p.length,
        acertos_iniciais:p.filter(p=>p.acerto_inicial).length,
        tentativas:p.reduce((n,p)=>n+p.tentativas.length,0),
        pistas:p.reduce((n,p)=>n+p.pistas.length,0)};
    }),interpretacao:'Sinais descritivos para revisão docente; não são classificação automática de tédio ou efeito do método.'};
}
