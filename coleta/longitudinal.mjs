// Vínculos declarados; a conferência do cadastro privado cabe ao professor.
import './contrato.js';
const C=globalThis.ColetaContrato;
export function comAcompanhamento(payload, acompanhamento){
  C.validarAcompanhamento(acompanhamento);
  if(payload.acompanhamento!==undefined)throw new Error('Acompanhamento já anexado; preserve o snapshot ou crie nova entrega revisada.');
  const out=JSON.parse(JSON.stringify(payload));
  out.acompanhamento=JSON.parse(JSON.stringify(acompanhamento));
  out.relatorio_texto+='\n\nACOMPANHAMENTO LONGITUDINAL\n'+JSON.stringify(out.acompanhamento,null,2)+
    '\nVínculos declarados; conferência do cadastro pelo professor necessária. Medidas não coletadas permanecem ausentes. Este registro não demonstra causalidade.';
  C.validar(out);
  return out;
}
