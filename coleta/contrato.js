/* Contrato compartilhado entre navegador, receptor e testes. */
(function (root) {
  'use strict';
  const indisponivel = 'Recurso não disponibilizado';
  const opcoes = Object.freeze({
    legibilidade: ['Fácil','Em parte fácil','Difícil','Não sei avaliar'],
    organizacao: ['Sim','Em parte','Não','Não usei essas partes'],
    navegacao: ['Sim','Em parte','Não','Não testei'],
    controles: ['Sim','Em parte','Não','Não usei',indisponivel],
    fonte_percepcao: ['Mais confortável','Sem diferença percebida','Menos confortável','Não troquei','Não sei avaliar',indisponivel],
    espacamento_percepcao: ['Mais confortável','Sem diferença percebida','Menos confortável','Não ajustei','Não sei avaliar',indisponivel],
    representacoes_percepcao: ['Ajudaram','Ajudaram em parte','Atrapalharam','Não percebi diferença','Não usei',indisponivel],
    dificuldades: ['Texto','Organização','Botões','Fontes ou ajustes','Imagens ou fórmulas','Áudio','Celular ou tela','Outra','Não percebi dificuldade'],
    sugestao: ['Quero comentar','Não tenho sugestão agora']
  });
  function falha(codigo, mensagem) {
    const e = new Error(mensagem); e.codigo = codigo; throw e;
  }
  function texto(v, nome, max, opcional) {
    if (opcional && (v === undefined || v === null || v === '')) return '';
    if (typeof v !== 'string' || !v.trim() || v.length > max) falha('DADOS_INVALIDOS', nome + ' ausente ou inválido.');
    return v;
  }
  function inteiro(v, nome, min, max) {
    if (!Number.isInteger(v) || v < min || v > max) falha('DADOS_INVALIDOS', nome + ' inválido.');
    return v;
  }
  function serializar(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(serializar).join(',') + ']';
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + serializar(v[k])).join(',') + '}';
  }
  function validarAvaliacao(e) {
    const pendencias = [];
    if (!e || e.versao !== '1.1.0') return ['versao_questionario'];
    const r = e.respostas || {};
    Object.keys(opcoes).forEach(k => {
      if (k === 'dificuldades') {
        if (!Array.isArray(r[k]) || !r[k].length || new Set(r[k]).size !== r[k].length || r[k].some(v => !opcoes[k].includes(v)) || (r[k].includes('Não percebi dificuldade') && r[k].length !== 1)) pendencias.push(k);
      } else if (!opcoes[k].includes(r[k])) pendencias.push(k);
    });
    if (r.sugestao === 'Quero comentar' && (typeof e.comentario !== 'string' || !e.comentario.trim())) pendencias.push('comentario');
    if (e.comentario !== undefined && (typeof e.comentario !== 'string' || e.comentario.length > 5000)) pendencias.push('comentario');
    if (e.confirmada !== true) pendencias.push('confirmacao');
    return [...new Set(pendencias)];
  }
  function validar(p) {
    if (!p || p.schema_version !== '1.0.0') falha('VERSAO_INVALIDA','Formato de relatório não reconhecido.');
    if (!/^[a-zA-Z0-9_-]{16,100}$/.test(p.submission_id || '')) falha('DADOS_INVALIDOS','ID da entrega inválido.');
    if (!['teste','producao'].includes(p.ambiente)) falha('DADOS_INVALIDOS','Ambiente inválido.');
    const a = p.aula || {}, s = p.estudante || {}, l = p.aprendizagem || {};
    ['id','titulo','versao','prompt'].forEach(k => texto(a[k],'Aula: '+k,k==='titulo'?300:100));
    ['escola','turma','componente'].forEach(k => texto(a[k],'Aula: '+k,200,true));
    texto(s.codigo,'Código do estudante',100); texto(s.nome,'Nome informado',200,true);
    const total = inteiro(l.percursos_total,'Percursos previstos',26,1000);
    if (l.percursos_concluidos !== total || !Array.isArray(l.percursos) || l.percursos.length !== total) falha('ATIVIDADES_PENDENTES','Conclua todos os percursos antes de enviar.');
    const ids = new Set(); let acertos = 0, tentativas = 0;
    l.percursos.forEach((r, i) => {
      texto(String(r.id === undefined ? '' : r.id),'ID do percurso',100);
      if (ids.has(String(r.id))) falha('DADOS_INVALIDOS','Percurso repetido.');
      ids.add(String(r.id));
      if (r.concluido !== true || !Array.isArray(r.tentativas) || !r.tentativas.length || !Array.isArray(r.pistas)) falha('ATIVIDADES_PENDENTES','Percurso incompleto: '+(i+1));
      r.tentativas.forEach(t => { if (!t || typeof t.correta !== 'boolean' || !Object.prototype.hasOwnProperty.call(t,'resposta')) falha('DADOS_INVALIDOS','Tentativa incompleta.'); });
      if (r.tentativas[r.tentativas.length-1].correta !== true) falha('ATIVIDADES_PENDENTES','O percurso precisa ser concluído após correção.');
      if (r.acerto_inicial !== r.tentativas[0].correta || serializar(r.primeira_resposta) !== serializar(r.tentativas[0].resposta)) falha('DADOS_INVALIDOS','Primeira resposta não corresponde ao histórico.');
      if (r.acerto_inicial) acertos++;
      tentativas += r.tentativas.length;
    });
    if (l.acertos_iniciais !== acertos || l.tentativas !== tentativas) falha('DADOS_INVALIDOS','Totais não correspondem ao histórico.');
    if (typeof l.nota !== 'number' || !Number.isFinite(l.nota) || typeof l.nota_maxima !== 'number' || !Number.isFinite(l.nota_maxima) || l.nota_maxima <= 0 || l.nota < 0 || l.nota > l.nota_maxima) falha('DADOS_INVALIDOS','Nota informada fora da escala.');
    const pendencias = validarAvaliacao(p.experiencia);
    if (pendencias.length) falha('AVALIACAO_PENDENTE','Responda e confirme a avaliação: '+pendencias.join(', '));
    const pref=p.experiencia.preferencias;
    if(pref!==undefined && (!pref || typeof pref!=='object' || Array.isArray(pref))) falha('DADOS_INVALIDOS','Preferências inválidas.');
    ['fonte_solicitada','tamanho','entrelinha','largura'].forEach(k=>{const v=pref&&pref[k];if(v!==undefined && v!==null && !['string','number','boolean'].includes(typeof v))falha('DADOS_INVALIDOS','Preferência inválida: '+k);if(typeof v==='string'&&v.length>200)falha('DADOS_INVALIDOS','Preferência maior que o limite: '+k);if(typeof v==='number'&&!Number.isFinite(v))falha('DADOS_INVALIDOS','Preferência numérica inválida.');});
    texto(p.relatorio_texto,'Relatório completo',700000);
    if (p.acompanhamento !== undefined) validarAcompanhamento(p.acompanhamento);
    const raw = serializar(p);
    if (raw.length > 1000000) falha('RELATORIO_GRANDE','Relatório maior que o limite; preserve o arquivo integral e solicite orientação.');
    return {raw:raw, acertos:acertos, tentativas:tentativas};
  }
  function validarAcompanhamento(a) {
    if (!a || a.versao !== '1.0.0') falha('DADOS_INVALIDOS','Acompanhamento: versão inválida.');
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuid.test(a.aluno_id || '') || !uuid.test(a.matricula_id || '')) falha('DADOS_INVALIDOS','Acompanhamento: IDs estáveis inválidos.');
    inteiro(a.ano_letivo,'Ano letivo',2000,2200);
    ['etapa','serie','fonte_confirmacao','protocolo_id','versao_protocolo','metodo'].forEach(k=>texto(a[k],'Acompanhamento: '+k,500));
    texto(a.coorte_id,'Coorte',100,true);
    if (typeof a.data_aplicacao !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(a.data_aplicacao) || !Number.isFinite(Date.parse(a.data_aplicacao)) || new Date(a.data_aplicacao).toISOString().slice(0,10)!==a.data_aplicacao) falha('DADOS_INVALIDOS','Data de aplicação inválida.');
    if (!Array.isArray(a.medidas) || a.medidas.length>1000) falha('DADOS_INVALIDOS','Medidas de acompanhamento inválidas.');
    a.medidas.forEach(m=>{
      if(!m || !['inicial','treino','pos','retencao','transferencia'].includes(m.momento)) falha('DADOS_INVALIDOS','Momento da medida inválido.');
      ['indicador','instrumento_id','versao_instrumento','rubrica','unidade','fonte'].forEach(k=>texto(m[k],'Medida: '+k,500));
      if(m.valor===null) texto(m.motivo_ausencia,'Motivo da ausência',500);
      else if(typeof m.valor!=='number' || !Number.isFinite(m.valor) || (m.motivo_ausencia!==null && m.motivo_ausencia!==undefined)) falha('DADOS_INVALIDOS','Valor ou ausência da medida inválido.');
      if(m.denominador!==null && (typeof m.denominador!=='number' || !Number.isFinite(m.denominador) || m.denominador<=0)) falha('DADOS_INVALIDOS','Denominador da medida inválido.');
    });
    return a;
  }
  function celula(v) {
    if (v === undefined || v === null) return '';
    if (typeof v === 'string' && /^[\s]*[=+\-@]/.test(v)) return "'"+v;
    return v;
  }
  const api=Object.freeze({opcoes:opcoes,validar:validar,validarAvaliacao:validarAvaliacao,validarAcompanhamento:validarAcompanhamento,serializar:serializar,celula:celula,falha:falha});
  root.ColetaContrato=api;
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
})(typeof globalThis !== 'undefined' ? globalThis : this);

