/* Motor de progressão sequencial; o conteúdo e as condições pertencem ao jogo. */
(function(GEI){
'use strict';
GEI.criarMissoes=function(etapas,aoAtualizar=()=>{}){
  if(!Array.isArray(etapas)||!etapas.length||etapas.some(e=>!e||typeof e.texto!=='string'||typeof e.verificar!=='function'))throw new Error('Missões inválidas');
  let indice=0;
  const estado=()=>({indice,total:etapas.length,concluida:indice===etapas.length,atual:etapas[indice]||null});
  return {
    estado,
    tentar(contexto){
      if(indice>=etapas.length)return false;
      const etapa=etapas[indice];
      if(!etapa.verificar(contexto))return false;
      indice++;aoAtualizar(estado(),etapa);return true;
    },
    restaurar(valor){if(!Number.isInteger(valor)||valor<0||valor>etapas.length)throw new Error('Índice de missão inválido');indice=valor;aoAtualizar(estado(),null)},
    reiniciar(){indice=0;aoAtualizar(estado(),null)}
  };
};
})(window.GEI);

