/* AIX UI compartilhada — missões, inventário, diálogos, feedback e salvamento.
   Consumida pelos motores 2D (Phaser) e 3D (Three.js): o roteiro pedagógico
   vive no contrato JSON; este módulo apenas interpreta dados.
   Sem rede, sem eval, sem dados pessoais. Strings do contrato sempre via textContent. */
(function () {
  'use strict';

  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto !== undefined && texto !== null) n.textContent = texto;
    return n;
  }
  function limpar(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function armazenamento() {
    try { var t = '__aix_t'; window.localStorage.setItem(t, '1'); window.localStorage.removeItem(t); return window.localStorage; } catch (e) {
      var mem = {};
      return { getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; }, setItem: function (k, v) { mem[k] = String(v); }, removeItem: function (k) { delete mem[k]; } };
    }
  }

  var AIXUI = {
    contrato: null, opcoes: null, motor: null, pronto: false,
    estado: null, _chave: null, _timer: null, _painelAberto: null
  };

  AIXUI.iniciar = function (contrato, opcoes) {
    this.contrato = contrato;
    this.opcoes = opcoes || {};
    var exp = contrato.experience;
    this._chave = 'aix:' + contrato.experienceId + ':v1';
    this.estado = {
      v: 1, env: exp.environments[0].id, pos: null,
      missoes: {}, inventario: [], notas: [], salvoEm: null
    };
    exp.missions.forEach(function (m) {
      AIXUI.estado.missoes[m.id] = { feita: false, tarefas: (m.tasks || []).map(function () { return false; }) };
    });
    this._construirHud();
    this._construirToque();
    var salvo = armazenamento().getItem(this._chave);
    if (salvo && this.opcoes.retomar !== false) {
      try { this._oferecerRetomada(JSON.parse(salvo)); } catch (e) { /* save corrompido: ignorar */ }
    }
    this._anunciar('Experiência carregada: ' + (contrato.experience.narrative || '').slice(0, 120));
    var me = this;
    this._timer = window.setInterval(function () { me.salvar(); }, 3000);
    this.pronto = true;
  };

  AIXUI.registrarMotor = function (api) { this.motor = api; };

  // ------------------------------------------------------------ ambiente/missões
  AIXUI.ambiente = function (id) { return this.contrato.experience.environments.filter(function (a) { return a.id === id; })[0]; };
  AIXUI.envAtual = function () { return this.ambiente(this.estado.env); };
  AIXUI.missoesDoEnv = function (idEnv) {
    return this.contrato.experience.missions.filter(function (m) { return m.environmentId === idEnv; });
  };
  AIXUI.missaoAtiva = function () {
    var ms = this.missoesDoEnv(this.estado.env);
    for (var i = 0; i < ms.length; i++) { if (!this.estado.missoes[ms[i].id].feita) return ms[i]; }
    return null;
  };
  AIXUI.tarefaPendente = function (tipo, alvo) {
    var m = this.missaoAtiva();
    if (!m || !m.tasks) return null;
    for (var i = 0; i < m.tasks.length; i++) {
      var t = m.tasks[i];
      if (t.tipo === tipo && !this.estado.missoes[m.id].tarefas[i] && (alvo === undefined || t.alvo === alvo)) return { missao: m, indice: i, tarefa: t };
    }
    return null;
  };
  AIXUI.concluirTarefa = function (tipo, alvo) {
    var alvoT = this.tarefaPendente(tipo, alvo);
    if (!alvoT) return false;
    this.estado.missoes[alvoT.missao.id].tarefas[alvoT.indice] = true;
    this._anunciar('Tarefa cumprida: ' + this._rotuloTarefa(alvoT.tarefa) + '.');
    var m = alvoT.missao, est = this.estado.missoes[m.id];
    if (est.tarefas.every(function (x) { return x; })) {
      est.feita = true;
      this._toast('Missão concluída: ' + m.title);
      this._anunciar('Missão concluída: ' + m.title + '. ' + (m.evidence || ''));
      if (this._tudoFeito()) this._painelFinal();
    } else {
      var me2 = this;
      var restantes = m.tasks.filter(function (tt, ii) { return !est.tarefas[ii]; });
      if (restantes.length && restantes.every(function (tt) { return tt.tipo === 'comparar'; })) {
        window.setTimeout(function () { if (!me2._painelAberto) me2.abrirComparar(restantes[0]); }, 650);
      }
    }
    this._atualizarHud();
    this.salvar();
    return true;
  };
  AIXUI._tudoFeito = function () {
    var e = this.estado.missoes;
    return Object.keys(e).every(function (k) { return e[k].feita; });
  };
  AIXUI.progresso = function () {
    var total = this.contrato.experience.missions.length, feitas = 0;
    var e = this.estado.missoes;
    Object.keys(e).forEach(function (k) { if (e[k].feita) feitas++; });
    return { feitas: feitas, total: total };
  };
  AIXUI._rotuloTarefa = function (t) {
    if (t.tipo === 'coletar') return 'examinar e guardar a evidência';
    if (t.tipo === 'dialogar') return 'conversar com a personagem';
    return 'comparar e concluir';
  };

  // ------------------------------------------------------------ HUD
  AIXUI._construirHud = function () {
    var hud = document.getElementById('hud'); limpar(hud);
    var exp = this.contrato.experience, curr = this.contrato.curriculum;
    var topo = el('div', 'aix-topo');
    var tit = el('div', 'aix-titulo');
    tit.appendChild(el('strong', null, exp.environments.length + ' ambientes · ' + exp.missions.length + ' missões'));
    tit.appendChild(el('span', 'aix-sub', curr.grade + ' · Turma ' + curr.classroom + ' · ' + curr.subject + ' · ' + curr.term + 'º trimestre'));
    topo.appendChild(tit);
    var botoes = el('div', 'aix-botoes');
    [['btn-missoes', 'Missões (M)'], ['btn-inventario', 'Inventário (I)'], ['btn-ambientes', 'Ir para…'], ['btn-toque', 'Controles de toque'], ['btn-acessivel', 'Versão acessível'], ['btn-ajuda', 'Ajuda']].forEach(function (par) {
      var b = el('button', null, par[1]); b.id = par[0]; b.type = 'button'; botoes.appendChild(b);
    });
    topo.appendChild(botoes);
    var linha = el('div', 'aix-linha');
    var env = el('span', 'aix-env', ''); env.id = 'aix-env-nome';
    var mis = el('span', 'aix-missao', ''); mis.id = 'aix-missao-nome';
    var barra = el('progress', 'aix-barra'); barra.id = 'aix-barra'; barra.max = 100; barra.value = 0;
    barra.setAttribute('role', 'progressbar'); barra.setAttribute('aria-label', 'Missões concluídas');
    linha.appendChild(env); linha.appendChild(mis); linha.appendChild(barra);
    hud.appendChild(topo); hud.appendChild(linha);
    var me = this;
    document.getElementById('btn-missoes').addEventListener('click', function () { me._painelMissoes(); });
    document.getElementById('btn-inventario').addEventListener('click', function () { me._painelInventario(); });
    document.getElementById('btn-ambientes').addEventListener('click', function () { me._painelAmbientes(); });
    document.getElementById('btn-acessivel').addEventListener('click', function () { me._irParaAcessivel(); });
    document.getElementById('btn-ajuda').addEventListener('click', function () { me._painelAjuda(); });
    document.getElementById('btn-toque').addEventListener('click', function () {
      document.body.classList.toggle('aix-toque');
      me._toast(document.body.classList.contains('aix-toque') ? 'Controles de toque visíveis.' : 'Controles de toque ocultos.');
    });
    this._atualizarHud();
  };
  AIXUI._atualizarHud = function () {
    var env = this.envAtual(), m = this.missaoAtiva(), p = this.progresso();
    document.getElementById('aix-env-nome').textContent = 'Ambiente: ' + env.title;
    document.getElementById('aix-missao-nome').textContent = m ? ('Missão: ' + m.title) : 'Missões deste ambiente concluídas — explore outro ambiente.';
    var barra = document.getElementById('aix-barra');
    barra.value = Math.round(100 * p.feitas / p.total);
    barra.textContent = p.feitas + ' de ' + p.total;
    barra.setAttribute('aria-valuenow', String(p.feitas)); barra.setAttribute('aria-valuemax', String(p.total));
  };

  // ------------------------------------------------------------ painéis
  AIXUI._fecharPainel = function () {
    var p = document.getElementById('painel');
    p.hidden = true; limpar(p); this._painelAberto = null;
  };
  AIXUI._abrirPainel = function (titulo, conteudo, focarBotao) {
    var p = document.getElementById('painel'); limpar(p); p.hidden = false;
    var caixa = el('div', 'aix-caixa');
    var h = el('h2', null, titulo);
    var fechar = el('button', 'aix-fechar', 'Fechar (Esc)'); fechar.type = 'button';
    var me = this;
    fechar.addEventListener('click', function () { me._fecharPainel(); });
    var cab = el('div', 'aix-cabecalho'); cab.appendChild(h); cab.appendChild(fechar);
    caixa.appendChild(cab); caixa.appendChild(conteudo);
    p.appendChild(caixa);
    (focarBotao || fechar).focus();
    this._painelAberto = titulo;
  };
  AIXUI.abrirObjeto = function (obj) {
    var c = el('div', 'aix-conteudo');
    var badge = obj.fictional
      ? el('p', 'aix-badge aix-ficticio', 'ELEMENTO FICTÍCIO DA SIMULAÇÃO — criado para fins didáticos')
      : el('p', 'aix-badge aix-fonte', 'FONTE DOCUMENTAL — verificação docente pendente');
    c.appendChild(badge);
    c.appendChild(el('p', null, obj.descricao));
    if (obj.sourceId) {
      var f = this.contrato.experience.sources.filter(function (s) { return s.id === obj.sourceId; })[0];
      if (f) c.appendChild(el('p', 'aix-fonte-ref', 'Vínculo declarado: ' + f.title + (f.verified ? ' (verificada)' : ' (não verificada)')));
    }
    var me = this;
    var pend = this.tarefaPendente('coletar', obj.id);
    if (pend) {
      var b = el('button', 'aix-acao', 'Guardar evidência no inventário'); b.type = 'button';
      b.addEventListener('click', function () {
        if (me.estado.inventario.indexOf(obj.id) < 0) me.estado.inventario.push(obj.id);
        me.concluirTarefa('coletar', obj.id);
        me._toast('Evidência guardada: ' + obj.titulo);
        me._fecharPainel();
      });
      c.appendChild(el('p', 'aix-dica', 'Missão atual: ' + pend.missao.title));
      c.appendChild(b);
    } else {
      var nota = el('textarea', 'aix-nota'); nota.rows = 3; nota.placeholder = 'Observação livre (fica só neste dispositivo)';
      var bn = el('button', 'aix-acao', 'Registrar observação'); bn.type = 'button';
      bn.addEventListener('click', function () {
        var t = nota.value.trim();
        if (t.length < 3) { me._toast('Escreva a observação antes de registrar.'); return; }
        me.estado.notas.push({ objeto: obj.id, texto: t, quando: new Date().toISOString() });
        me.salvar(); me._toast('Observação registrada neste dispositivo.');
        me._fecharPainel();
      });
      c.appendChild(nota); c.appendChild(bn);
    }
    this._abrirPainel(obj.titulo, c);
  };
  AIXUI.abrirPersonagem = function (char, falaId) {
    var c = el('div', 'aix-conteudo');
    c.appendChild(el('p', 'aix-badge aix-ficticio', 'PERSONAGEM FICTÍCIA DA SIMULAÇÃO — ' + char.papel));
    var fala = (char.falas || []).filter(function (f) { return f.id === falaId; })[0] || (char.falas || [])[0];
    if (fala) c.appendChild(el('p', 'aix-fala', '“' + fala.texto + '”'));
    var me = this;
    var pend = this.tarefaPendente('dialogar', char.id);
    if (pend) {
      var b = el('button', 'aix-acao', 'Registrar o diálogo'); b.type = 'button';
      b.addEventListener('click', function () { me.concluirTarefa('dialogar', char.id); me._fecharPainel(); });
      c.appendChild(el('p', 'aix-dica', 'Missão atual: ' + pend.missao.title));
      c.appendChild(b);
    }
    this._abrirPainel(char.nome, c);
  };
  AIXUI.abrirComparar = function (tarefa) {
    var me = this;
    var c = el('div', 'aix-conteudo');
    c.appendChild(el('p', 'aix-pergunta', tarefa.pergunta));
    var fb = el('p', 'aix-feedback'); fb.setAttribute('role', 'status');
    var lista = el('div', 'aix-opcoes'); lista.setAttribute('role', 'radiogroup'); lista.setAttribute('aria-label', 'Alternativas');
    tarefa.opcoes.forEach(function (op, i) {
      var b = el('button', 'aix-opcao', op); b.type = 'button'; b.setAttribute('role', 'radio');
      b.addEventListener('click', function () {
        if (i === tarefa.correta) {
          fb.textContent = tarefa.feedbackAcerto;
          fb.className = 'aix-feedback aix-ok';
          window.setTimeout(function () {
            me.concluirTarefa('comparar');
            if (me._painelAberto === 'Comparar e concluir') me._fecharPainel();
          }, 900);
        } else {
          fb.textContent = tarefa.feedbackErro;
          fb.className = 'aix-feedback aix-retry';
          me._anunciar(tarefa.feedbackErro);
        }
      });
      lista.appendChild(b);
    });
    c.appendChild(lista); c.appendChild(fb);
    this._abrirPainel('Comparar e concluir', c, c.querySelector('button'));
  };
  AIXUI._painelMissoes = function () {
    var me = this, c = el('div', 'aix-conteudo');
    this.contrato.experience.environments.forEach(function (env) {
      c.appendChild(el('h3', null, env.title));
      me.missoesDoEnv(env.id).forEach(function (m) {
        var est = me.estado.missoes[m.id];
        var item = el('div', 'aix-item-missao' + (est.feita ? ' aix-feita' : ''));
        item.appendChild(el('p', 'aix-m-titulo', (est.feita ? '✔ ' : '') + m.title));
        item.appendChild(el('p', 'aix-m-obj', m.objective));
        if (m.tasks && !est.feita) {
          var ul = el('ul', 'aix-tarefas');
          m.tasks.forEach(function (t, i) {
            ul.appendChild(el('li', est.tarefas[i] ? 'aix-t-feita' : '', (est.tarefas[i] ? '✔ ' : '○ ') + me._rotuloTarefa(t) + (t.alvo ? ': ' + me._nomeAlvo(m.environmentId, t) : '')));
          });
          item.appendChild(ul);
          m.tasks.forEach(function (t, i) {
            if (t.tipo === 'comparar' && !est.tarefas[i]) {
              var br = el('button', 'aix-acao', 'Responder ao desafio de comparação'); br.type = 'button';
              br.addEventListener('click', function () { me.abrirComparar(t); me._fecharPainel(); });
              item.appendChild(br);
            }
          });
        }
        c.appendChild(item);
      });
    });
    this._abrirPainel('Missões', c);
  };
  AIXUI._nomeAlvo = function (idEnv, t) {
    var env = this.ambiente(idEnv);
    if (t.tipo === 'coletar') { var o = (env.objects || []).filter(function (x) { return x.id === t.alvo; })[0]; return o ? o.titulo : t.alvo; }
    if (t.tipo === 'dialogar') { var p = (env.characters || []).filter(function (x) { return x.id === t.alvo; })[0]; return p ? p.nome : t.alvo; }
    return '';
  };
  AIXUI._painelInventario = function () {
    var me = this, c = el('div', 'aix-conteudo');
    if (!this.estado.inventario.length) c.appendChild(el('p', null, 'Nenhuma evidência guardada ainda.'));
    this.contrato.experience.environments.forEach(function (env) {
      (env.objects || []).forEach(function (o) {
        if (me.estado.inventario.indexOf(o.id) < 0) return;
        var item = el('div', 'aix-item-ev');
        item.appendChild(el('p', 'aix-m-titulo', o.titulo));
        item.appendChild(el('p', 'aix-badge ' + (o.fictional ? 'aix-ficticio' : 'aix-fonte'), o.fictional ? 'FICTÍCIO (simulação)' : 'FONTE DOCUMENTAL (verificação pendente)'));
        var n = me.estado.notas.filter(function (x) { return x.objeto === o.id; }).length;
        if (n) item.appendChild(el('p', 'aix-m-obj', n + ' observação(ões) registrada(s) neste dispositivo.'));
        c.appendChild(item);
      });
    });
    c.appendChild(el('p', 'aix-dica', 'Evidências e observações ficam apenas neste dispositivo e servem à conversa com o professor — não são prova e não alteram nota.'));
    this._abrirPainel('Inventário de evidências', c);
  };
  AIXUI._painelAmbientes = function () {
    var me = this, c = el('div', 'aix-conteudo');
    c.appendChild(el('p', null, 'Escolha o ambiente histórico para explorar:'));
    this.contrato.experience.environments.forEach(function (env) {
      var b = el('button', 'aix-ambiente-btn', env.title); b.type = 'button';
      var feito = me.missoesDoEnv(env.id).every(function (m) { return me.estado.missoes[m.id].feita; });
      b.appendChild(el('span', 'aix-sub', feito ? ' — missões concluídas' : ''));
      b.addEventListener('click', function () { me.trocarAmbiente(env.id); me._fecharPainel(); });
      c.appendChild(b);
    });
    this._abrirPainel('Ambientes', c, c.querySelector('button'));
  };
  AIXUI._painelAjuda = function () {
    var c = el('div', 'aix-conteudo');
    [['Mover', 'Setas ou W A S D (teclado) · direcional na tela (toque)'], ['Interagir', 'Chegue perto de objetos e personagens e pressione E ou o botão Interagir'], ['Missões', 'Tecla M · painel com objetivos e tarefas'], ['Inventário', 'Tecla I · evidências guardadas'], ['Salvamento', 'Automático neste dispositivo · botão Continuar ao reabrir'], ['Acessibilidade', 'Botão “Versão acessível”: mesma experiência sem movimentação, em HTML semântico'], ['Segurança', 'Nenhum dado pessoal é pedido; nada sai deste dispositivo']].forEach(function (par) {
      var p = el('p', null); p.appendChild(el('strong', null, par[0] + ': ')); p.appendChild(document.createTextNode(par[1])); c.appendChild(p);
    });
    this._abrirPainel('Como jogar', c);
  };
  AIXUI._painelFinal = function () {
    var me = this, c = el('div', 'aix-conteudo');
    c.appendChild(el('p', null, 'Você concluiu as ' + this.progresso().total + ' missões dos três ambientes.'));
    var t = el('textarea', 'aix-nota'); t.id = 'aix-sintese'; t.rows = 6; t.placeholder = 'Sua síntese histórica argumentativa (usa as fontes dos três ambientes)...';
    if (this.estado.sintese) t.value = this.estado.sintese;
    c.appendChild(t);
    var b = el('button', 'aix-acao', 'Guardar síntese'); b.type = 'button';
    b.addEventListener('click', function () { me.estado.sintese = t.value; me.salvar(); me._toast('Síntese guardada neste dispositivo.'); });
    c.appendChild(b);
    c.appendChild(el('p', 'aix-dica', 'O registro serve à conversa com o professor — não é prova, não substitui a avaliação docente e não altera nota.'));
    this._abrirPainel('Síntese final', c, b);
  };
  AIXUI._irParaAcessivel = function () {
    var me = this;
    this.salvar();
    var destino = this.opcoes.urlAcessivel || 'preview-acessivel.html';
    window.location.href = destino;
  };

  // ------------------------------------------------------------ ambientes/troca
  AIXUI.trocarAmbiente = function (idEnv) {
    if (!this.ambiente(idEnv)) return;
    this.estado.env = idEnv;
    this.estado.pos = null; // posição é do ambiente anterior: recomeça no spawn do novo
    this._atualizarHud();
    this._anunciar('Ambiente: ' + this.ambiente(idEnv).title);
    if (this.motor && this.motor.carregarAmbiente) this.motor.carregarAmbiente(idEnv);
    this.salvar();
  };

  // ------------------------------------------------------------ toque
  AIXUI._construirToque = function () {
    var t = document.getElementById('toque'); limpar(t);
    var pad = el('div', 'aix-pad'); pad.id = 'aix-pad';
    [['esq', '◀', 'Mover para a esquerda'], ['cima', '▲', 'Mover para cima'], ['baixo', '▼', 'Mover para baixo'], ['dir', '▶', 'Mover para a direita']].forEach(function (par) {
      var b = el('button', 'aix-seta aix-' + par[0], par[1]); b.type = 'button'; b.setAttribute('aria-label', par[2]); b.dataset.dir = par[0];
      pad.appendChild(b);
    });
    var acao = el('button', 'aix-acao-grande', 'Interagir'); acao.type = 'button'; acao.id = 'aix-botao-acao';
    t.appendChild(pad); t.appendChild(acao);
    if ((window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window) {
      document.body.classList.add('aix-toque');
    }
    window.AIX_TOQUE = { esq: false, dir: false, cima: false, baix: false };
    function liga(elm) {
      var d = elm.dataset.dir;
      var on = function (e) { e.preventDefault(); window.AIX_TOQUE[d] = true; };
      var off = function (e) { e.preventDefault(); window.AIX_TOQUE[d] = false; };
      elm.addEventListener('touchstart', on, { passive: false }); elm.addEventListener('touchend', off); elm.addEventListener('touchcancel', off);
      elm.addEventListener('mousedown', on); elm.addEventListener('mouseup', off); elm.addEventListener('mouseleave', off);
    }
    Array.prototype.forEach.call(pad.querySelectorAll('button'), liga);
    var me = this;
    acao.addEventListener('click', function () { if (me.motor && me.motor.interagir) me.motor.interagir(); });
  };

  // ------------------------------------------------------------ salvar/retomar
  AIXUI.salvar = function () {
    if (!this.pronto) return;
    try {
      if (this.motor && this.motor.obterPosicao) this.estado.pos = this.motor.obterPosicao();
      this.estado.salvoEm = new Date().toISOString();
      armazenamento().setItem(this._chave, JSON.stringify(this.estado));
    } catch (e) { /* sem armazenamento: segue em memória */ }
  };
  AIXUI._oferecerRetomada = function (salvo) {
    var me = this, c = el('div', 'aix-conteudo');
    if (!salvo || !salvo.missoes) return;
    c.appendChild(el('p', null, 'Encontramos uma atividade salva neste dispositivo (' + new Date(salvo.salvoEm || Date.now()).toLocaleString('pt-BR') + ').'));
    var b1 = el('button', 'aix-acao', 'Continuar de onde parei'); b1.type = 'button';
    var b2 = el('button', null, 'Recomeçar do início'); b2.type = 'button';
    b1.addEventListener('click', function () {
      me.estado = salvo;
      if (!me.estado.notas) me.estado.notas = [];
      me._atualizarHud();
      if (me.motor && me.motor.carregarAmbiente) me.motor.carregarAmbiente(me.estado.env);
      me._fecharPainel();
      me._toast('Atividade retomada.');
    });
    b2.addEventListener('click', function () { armazenamento().removeItem(me._chave); me._fecharPainel(); });
    c.appendChild(b1); c.appendChild(b2);
    this._abrirPainel('Retomar atividade', c, b1);
  };

  // ------------------------------------------------------------ avisos
  AIXUI._toast = function (msg) {
    var t = document.getElementById('toast');
    limpar(t); t.appendChild(el('span', null, msg)); t.classList.add('aix-on');
    window.clearTimeout(this._toastT);
    this._toastT = window.setTimeout(function () { t.classList.remove('aix-on'); }, 3500);
  };
  AIXUI._anunciar = function (msg) {
    var a = document.getElementById('anuncio');
    limpar(a); a.appendChild(el('span', null, msg));
  };

  window.AIXUI = AIXUI;
})();
