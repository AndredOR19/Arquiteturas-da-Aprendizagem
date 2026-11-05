/* Motor AIX Phaser 2D — interpreta o Contrato Universal AIx (schema >= 1.1.0).
   Nenhuma missão é codificada aqui: ambientes, objetos, personagens, tarefas e
   feedback vêm dos dados. Requisitos: phaser.min.js + ui-compartilhada.js. */
(function () {
  'use strict';

  var CONTRATO = window.AIX_CONTRATO;
  if (!CONTRATO) { document.getElementById('falha').hidden = false; return; }

  var PARAMS = new URLSearchParams(window.location.search);
  var TESTE = PARAMS.get('teste') === '1';
  var VELOCIDADE = TESTE ? 520 : 230;
  var RAIO_INTERACAO = 88;

  var Mundo = {}; // estado da cena atual
  var jogo = null;

  function paletaDe(env) {
    return env.paleta || { fundo: '#232e3d', chao: '#2f3d50', destaque: '#7ec8e3' };
  }

  function criarCena(Phaser) {
    var cena = new Phaser.Scene('mundo');
    cena.preload = function () { /* sem assets externos: tudo desenhado em código */ };
    cena.create = function () {
      var env = AIXUI.envAtual();
      var lay = env.layout || { bounds: { w: 1280, h: 800 }, spawn: { x: 100, y: 400 }, obstacles: [] };
      var pal = paletaDe(env);
      var W = lay.bounds.w, H = lay.bounds.h;

      this.physics.world.setBounds(0, 0, W, H);
      this.cameras.main.setBounds(0, 0, W, H);
      this.cameras.main.setBackgroundColor(pal.fundo);

      // chão
      var chao = this.add.rectangle(W / 2, H / 2, W, H, Phaser.Display.Color.HexStringToColor(pal.chao).color);
      this.physics.add.existing(chao, true);

      // grade sutil de referência espacial
      for (var gx = 128; gx < W; gx += 128) this.add.line(gx, H / 2, 0, 0, 0, H, 0xffffff, 0.05).setOrigin(0.5, 0.5);
      for (var gy = 128; gy < H; gy += 128) this.add.line(W / 2, gy, 0, 0, W, 0, 0xffffff, 0.05).setOrigin(0.5, 0.5);

      // obstáculos (colisão + rótulo)
      Mundo.estaticos = this.physics.add.staticGroup();
      var corObs = Phaser.Display.Color.HexStringToColor(pal.fundo).darken(18).color;
      (lay.obstacles || []).forEach(function (o) {
        var r = cena.add.rectangle(o.x + o.w / 2, o.y + o.h / 2, o.w, o.h, corObs, 1);
        r.setStrokeStyle(3, 0x000000, 0.35);
        cena.physics.add.existing(r, true);
        Mundo.estaticos.add(r);
        if (o.label) {
          cena.add.text(o.x + o.w / 2, o.y - 6, o.label, { fontFamily: 'system-ui', fontSize: '11px', color: '#e8eef2' }).setOrigin(0.5, 1);
        }
      });

      // objetos e personagens
      Mundo.interagiveis = [];
      var corDest = Phaser.Display.Color.HexStringToColor(pal.destaque).color;
      (env.objects || []).forEach(function (obj) {
        var g = cena.add.container(obj.x, obj.y);
        var base = cena.add.rectangle(0, 0, 44, 44, obj.tipo === 'documento' ? corDest : 0xb9a06b, 1);
        base.setStrokeStyle(3, 0x101418, 0.8);
        g.add(base);
        g.add(cena.add.text(0, 0, obj.tipo === 'documento' ? '¶' : '◆', { fontSize: '22px', color: '#101418' }).setOrigin(0.5));
        g.add(cena.add.text(0, -34, obj.titulo, { fontFamily: 'system-ui', fontSize: '12px', color: '#f2f6f8', backgroundColor: '#10161c', padding: { x: 4, y: 2 } }).setOrigin(0.5, 1));
        var area = cena.add.rectangle(obj.x, obj.y, 46, 46);
        cena.physics.add.existing(area, true);
        Mundo.interagiveis.push({ tipo: 'objeto', dado: obj, x: obj.x, y: obj.y, sprite: g });
      });
      (env.characters || []).forEach(function (ch) {
        var g = cena.add.container(ch.x, ch.y);
        var corpo = cena.add.rectangle(0, 0, 40, 64, 0xd67ba8, 1);
        corpo.setStrokeStyle(3, 0x101418, 0.8);
        g.add(corpo);
        g.add(cena.add.text(0, -40, ch.nome, { fontFamily: 'system-ui', fontSize: '12px', color: '#f2f6f8', backgroundColor: '#10161c', padding: { x: 4, y: 2 } }).setOrigin(0.5, 1));
        var area = cena.add.rectangle(ch.x, ch.y, 42, 66);
        cena.physics.add.existing(area, true);
        Mundo.interagiveis.push({ tipo: 'personagem', dado: ch, x: ch.x, y: ch.y, sprite: g });
      });

      // avatar (textura antes do sprite)
      if (!this.textures.exists('__branco')) {
        var g2 = this.textures.createCanvas('__branco', 26, 26);
        var ctx = g2.context;
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#1c2b33'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(13, 13, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        g2.refresh();
      }
      var pos = (AIXUI.estado.pos && AIXUI.estado.env === env.id) ? AIXUI.estado.pos : lay.spawn;
      Mundo.avatar = this.physics.add.sprite(pos.x, pos.y, '__branco');
      Mundo.avatar.setCollideWorldBounds(true).setDepth(10);
      Mundo.avatar.setSize(24, 24);
      this.physics.add.collider(Mundo.avatar, Mundo.estaticos);

      this.cameras.main.startFollow(Mundo.avatar, true, 0.12, 0.12);

      Mundo.teclas = this.input.keyboard.createCursorKeys();
      Mundo.teclas.w = this.input.keyboard.addKey('W');
      Mundo.teclas.a = this.input.keyboard.addKey('A');
      Mundo.teclas.s = this.input.keyboard.addKey('S');
      Mundo.teclas.d = this.input.keyboard.addKey('D');
      Mundo.painelFechado = true;
      window.AIX_PRONTO = true;
      AIXUI._anunciar('Ambiente carregado: ' + env.title + '. Use as setas para caminhar e E para interagir.');
    };

    cena.update = function () {
      if (!Mundo.avatar) return;
      var vel = Mundo.avatar.body.velocity;
      var k = Mundo.teclas || {};
      var T = window.AIX_TOQUE || {};
      var painelAberto = AIXUI._painelAberto !== null && AIXUI._painelAberto !== undefined;
      var dx = 0, dy = 0;
      if (!painelAberto) {
        if (k.left && k.left.isDown || T.esq) dx = -1;
        else if (k.right && k.right.isDown || T.dir) dx = 1;
        if (k.up && k.up.isDown || T.cima) dy = -1;
        else if (k.down && k.down.isDown || T.baixo) dy = 1;
      }
      var norma = Math.hypot(dx, dy) || 1;
      Mundo.avatar.setVelocity((dx / norma) * VELOCIDADE, (dy / norma) * VELOCIDADE);
      Mundo.velAtual = { x: (dx / norma) * VELOCIDADE, y: (dy / norma) * VELOCIDADE };

      // interagível mais próximo
      var melhor = null, melhorD = RAIO_INTERACAO;
      Mundo.interagiveis.forEach(function (it) {
        var d = Phaser.Math.Distance.Between(Mundo.avatar.x, Mundo.avatar.y, it.x, it.y);
        if (d < melhorD) { melhorD = d; melhor = it; }
      });
      Mundo.interagivel = melhor;
      var p = document.getElementById('prompt');
      if (melhor && !painelAberto) {
        p.hidden = false;
        p.textContent = (melhor.tipo === 'objeto' ? 'Examinar: ' + melhor.dado.titulo : 'Conversar com: ' + melhor.dado.nome) + ' — pressione E ou toque em Interagir';
      } else { p.hidden = true; }
    };
    return cena;
  }

  function interagir() {
    if (AIXUI._painelAberto) return;
    var it = Mundo.interagivel;
    if (!it) return;
    if (it.tipo === 'objeto') AIXUI.abrirObjeto(it.dado);
    else {
      var pend = AIXUI.tarefaPendente('dialogar', it.dado.id);
      AIXUI.abrirPersonagem(it.dado, pend ? pend.tarefa.fala : null);
    }
  }

  // teclas globais de interface (fora do jogo)
  document.addEventListener('keydown', function (ev) {
    var painelAberto = AIXUI._painelAberto !== null && AIXUI._painelAberto !== undefined;
    if (ev.key === 'Escape' && painelAberto) { AIXUI._fecharPainel(); return; }
    if (painelAberto) return;
    if (ev.key === 'e' || ev.key === 'E' || ev.key === 'Enter') interagir();
    else if (ev.key === 'm' || ev.key === 'M') AIXUI._painelMissoes();
    else if (ev.key === 'i' || ev.key === 'I') AIXUI._painelInventario();
  });

  window.AIXUI.iniciar(CONTRATO, { urlAcessivel: 'preview-acessivel.html' });

  function montar() {
    var cena = criarCena(window.Phaser);
    jogo = new window.Phaser.Game({
      type: window.Phaser.CANVAS,
      parent: 'palco',
      backgroundColor: '#10161c',
      scale: { mode: window.Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      physics: { default: 'arcade', arcade: { debug: false } },
      render: { antialias: true },
      scene: cena
    });
    window.AIXUI.registrarMotor({
      interagir: interagir,
      obterPosicao: function () { return Mundo.avatar ? { x: Math.round(Mundo.avatar.x), y: Math.round(Mundo.avatar.y) } : null; },
      carregarAmbiente: function () {
        if (jogo) { jogo.destroy(true); jogo = null; }
        window.setTimeout(montar, 30);
      }
    });
  }
  montar();

  // ganchos de teste (não alteram regras do jogo; apenas aceleram e inspecionam)
  if (TESTE) {
    Object.defineProperty(window, 'AIX_ESTADO', { get: function () {
      return {
        pronto: !!window.AIX_PRONTO, env: AIXUI.estado.env,
        pos: Mundo.avatar ? { x: Math.round(Mundo.avatar.x), y: Math.round(Mundo.avatar.y) } : null,
        interagivel: Mundo.interagivel ? Mundo.interagivel.dado.id : null,
        painel: AIXUI._painelAberto || null,
        missoes: AIXUI.estado.missoes, inventario: AIXUI.estado.inventario,
        progresso: AIXUI.progresso()
      };
    }});
    window.AIX_TESTE = {
      irPara: function (x, y) { if (Mundo.avatar) { Mundo.avatar.setPosition(x, y); Mundo.avatar.setVelocity(0, 0); } },
      interagir: interagir
    };
  }
})();
