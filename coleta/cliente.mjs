import './contrato.js';
const C=globalThis.ColetaContrato;

export function criarColetor({endpoint, storage, fetchImpl=globalThis.fetch, timeoutMs=20000, prefixo='arquiteturas.coleta.v1'}) {
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint||'')) throw new Error('Informe o endereço publicado /exec do receptor.');
  const memoria=new Map();
  if(storage===undefined){try{storage=globalThis.localStorage;}catch(_){storage=null;}}
  function key(id){return prefixo+'.'+id;}
  function ler(id){if(memoria.has(id))return memoria.get(id);try{return JSON.parse(storage.getItem(key(id))||'null');}catch(_){return null;}}
  function guardar(id,obj){memoria.set(id,obj);try{storage.setItem(key(id),JSON.stringify(obj));return true;}catch(_){return false;}}
  async function hash(raw){const b=await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}
  async function enviar(payload,token){
    const {raw}=C.validar(payload);
    if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))throw new Error('Informe o convite individual recebido do professor.');
    const salvo=ler(payload.submission_id);
    if(salvo&&C.serializar(salvo.payload)!==raw)throw new Error('Este ID já possui um envio diferente. Preserve o relatório e peça revisão ao professor.');
    const esperado=await hash(raw);
    const snapshot=JSON.parse(raw);
    const persistido=guardar(payload.submission_id,{estado:'pendente',payload:snapshot,recibo:null});
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),timeoutMs);
    try{
      const response=await fetchImpl(endpoint,{method:'POST',mode:'cors',credentials:'omit',redirect:'follow',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({token,payload:snapshot}),signal:controller.signal});
      if(!response.ok)throw new Error('O serviço não confirmou o recebimento.');
      const recibo=await response.json();
      if(!recibo.ok)throw new Error(recibo.mensagem||'O serviço recusou a entrega.');
      if(recibo.estado!=='recebido'||recibo.submission_id!==payload.submission_id||recibo.sha256!==esperado||typeof recibo.protocolo!=='string'||!/^ARQ-[A-F0-9]{16}$/.test(recibo.protocolo)||!Number.isFinite(Date.parse(recibo.recebido_em)))throw new Error('A confirmação recebida não corresponde ao relatório.');
      const salvoRecibo=guardar(payload.submission_id,{estado:'recebido',payload:snapshot,recibo});
      return {...recibo,persistencia_local:persistido&&salvoRecibo};
    }catch(error){
      const e=new Error((error.name==='AbortError'?'O tempo de espera terminou.':error.message)+' O recebimento permanece sem confirmação nesta tela. Preserve o relatório e tente novamente com o mesmo ID.');
      e.persistencia_local=persistido;throw e;
    }finally{clearTimeout(timer);}
  }
  async function podeFinalizar(payload){
    try{
      const {raw}=C.validar(payload),salvo=ler(payload.submission_id);
      return !!(salvo&&salvo.estado==='recebido'&&salvo.recibo&&salvo.recibo.submission_id===payload.submission_id&&salvo.recibo.sha256===await hash(raw));
    }catch(_){return false;}
  }
  function pendente(id){const s=ler(id);return s&&s.estado==='pendente'?s.payload:null;}
  return Object.freeze({enviar,podeFinalizar,pendente});
}
