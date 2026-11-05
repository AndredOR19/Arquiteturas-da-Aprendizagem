/* Motor AIX Three.js (protótipo 3D, Fase 3 da ordem v1.2).
   Interpreta o MESMO Contrato Universal do motor 2D — nenhum roteiro
   pedagógico é reconstruído: ambientes, objetos, personagens, tarefas e
   feedback vêm dos dados (window.AIX_CONTRATO) e a UI é a mesma
   (ui-compartilhada.js). Requisitos: three.min.js + ui-compartilhada.js. */
(function () {
  'use strict';

  var CONTRATO = window.AIX_CONTRATO;
  if (!CONTRATO) { document.getElementById('falha').hidden = false; return; }

  var PARAMS = new URLSearchParams(window.location.search);
  var TESTE = PARAMS.get('teste') === '1';
  var LEVE = PARAMS.get('leve') === '1';
  var VELOCIDADE = TESTE ? 520 : 230;
  var RAIO = 95;

  var cena = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, 16 / 9, 1, 4000);
  var renderer = new THREE.WebGLRenderer({ antialias: !LEVE, powerPreference: 'low-power' });
  renderer.setPixelRatio(LEVE ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  document.getElementById('palco').appendChild(renderer.domElement);

  var Mundo = { grupo: null, avatar: null, interagiveis: [], teclas: {}, yaw: 0 };

  function cor(hex) { return new THREE.Color(hex || '#3a4a56'); }

  function rotulo(texto, y) {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 96;
    var ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(16,22,28,0.85)';
    ctx.fillRect(0, 0, 512, 96);
    ctx.strokeStyle = '#7ec8e3'; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 508, 92);
    ctx.font = 'bold 34px system-ui, sans-serif';
    ctx.fillStyle = '#f2f6f8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var curto = texto.length > 34 ? texto.slice(0, 33) + '…' : texto;
    ctx.fillText(curto, 256, 48);
    var tex = new THREE.CanvasTexture(c);
    var spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
    spr.scale.set(150, 28, 1);
    spr.position.y = y;
    return spr;
  }

  function construirAmbiente() {
    if (Mundo.grupo) { cena.remove(Mundo.grupo); Mundo.grupo = null; }
    Mundo.interagiveis = [];
    var grupo = new THREE.Group();
    var env = AIXUI.envAtual();
    var lay = env.layout || { bounds: { w: 1280, h: 800 }, spawn: { x: 100, y: 400 }, obstacles: [] };
    var pal = env.paleta || { fundo: '#232e3d', chao: '#2f3d50', destaque: '#7ec8e3' };
    var W = lay.bounds.w, H = lay.bounds.h;
    cena.background = cor(pal.fundo);
    if (LEVE) cena.fog = new THREE.Fog(cor(pal.fundo), 600, 1600);

    var luz = new THREE.HemisphereLight(0xffffff, new THREE.Color(pal.chao), 0.95);
    grupo.add(luz);
    var dir = new THREE.DirectionalLight(0xffffff, 0.5); dir.position.set(200, 500, 300);
    grupo.add(dir);

    var chao = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshLambertMaterial({ color: cor(pal.chao) }));
    chao.rotation.x = -Math.PI / 2; chao.position.set(W / 2, 0, H / 2);
    grupo.add(chao);

    var matMuro = new THREE.MeshLambertMaterial({ color: cor(pal.fundo).multiplyScalar(0.6) });
    function caixa(x, z, w, d, alt, mat, label, yLabel) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, alt, d), mat);
      m.position.set(x, alt / 2, z);
      grupo.add(m);
      if (label) { var r = rotulo(label, yLabel === undefined ? alt + 24 : yLabel); r.position.x = x; r.position.z = z; grupo.add(r); }
      return m;
    }
    caixa(W / 2, 0, W, 24, 90, matMuro);
    caixa(W / 2, H, W, 24, 90, matMuro);
    caixa(0, H / 2, 24, H, 90, matMuro);
    caixa(W, H / 2, 24, H, 90, matMuro);

    Mundo.colisores = [];
    (lay.obstacles || []).forEach(function (o) {
      caixa(o.x + o.w / 2, o.y + o.h / 2, o.w, o.h, 46, matMuro, o.label);
      Mundo.colisores.push({ x0: o.x, x1: o.x + o.w, z0: o.y, z1: o.y + o.h });
    });

    var matDoc = new THREE.MeshLambertMaterial({ color: cor(pal.destaque) });
    var matCen = new THREE.MeshLambertMaterial({ color: 0xb9a06b });
    (env.objects || []).forEach(function (obj) {
      var m = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 12, 18), obj.tipo === 'documento' ? matDoc : matCen);
      m.position.set(obj.x, 6, obj.y);
      grupo.add(m);
      var r = rotulo(obj.titulo, 58); r.position.x = obj.x; r.position.z = obj.y;
      grupo.add(r);
      Mundo.interagiveis.push({ tipo: 'objeto', dado: obj, x: obj.x, y: obj.y });
    });
    var matChar = new THREE.MeshLambertMaterial({ color: 0xd67ba8 });
    (env.characters || []).forEach(function (ch) {
      var g = new THREE.Group();
      var corpo = new THREE.Mesh(new THREE.CylinderGeometry(14, 18, 78, 14), matChar);
      corpo.position.y = 39; g.add(corpo);
      var cabeca = new THREE.Mesh(new THREE.SphereGeometry(14, 12, 10), new THREE.MeshLambertMaterial({ color: 0xf2d8c9 }));
      cabeca.position.y = 90; g.add(cabeca);
      g.position.set(ch.x, 0, ch.y);
      grupo.add(g);
      var r = rotulo(ch.nome, 130); r.position.x = ch.x; r.position.z = ch.y;
      grupo.add(r);
      Mundo.interagiveis.push({ tipo: 'personagem', dado: ch, x: ch.x, y: ch.y });
    });

    // avatar (peão)
    var av = new THREE.Group();
    var corpo = new THREE.Mesh(new THREE.CylinderGeometry(12, 16, 64, 14), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    corpo.position.y = 32; av.add(corpo);
    var cabeca = new THREE.Mesh(new THREE.SphereGeometry(12, 12, 10), new THREE.MeshLambertMaterial({ color: 0xffe279 }));
    cabeca.position.y = 74; av.add(cabeca);
    var seta = new THREE.Mesh(new THREE.ConeGeometry(9, 22, 10), new THREE.MeshLambertMaterial({ color: 0x7ec8e3 }));
    seta.rotation.x = Math.PI / 2; seta.position.set(0, 34, -24); av.add(seta);
    var pos = (AIXUI.estado.pos && AIXUI.estado.env === env.id) ? AIXUI.estado.pos : lay.spawn;
    av.position.set(pos.x, 0, pos.y);
    grupo.add(av);
    Mundo.avatar = av;
    Mundo.limites = { w: W, h: H };
    cena.add(grupo);
    Mundo.grupo = grupo;
    window.AIX_PRONTO3D = true;
    AIXUI._anunciar('Ambiente 3D carregado: ' + env.title + '. Use as setas para caminhar e E para interagir.');
  }

  function colide(x, z) {
    var R = 16;
    if (x < R || z < R || x > Mundo.limites.w - R || z > Mundo.limites.h - R) return true;
    return Mundo.colisores.some(function (c) { return x > c.x0 - R && x < c.x1 + R && z > c.z0 - R && z < c.z1 + R; });
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

  var ult = null;
  function passo(t) {
    requestAnimationFrame(passo);
    var dt = ult === null ? 0.016 : Math.min((t - ult) / 1000, 0.05);
    ult = t;
    if (Mundo.avatar) {
      var painelAberto = AIXUI._painelAberto !== null && AIXUI._painelAberto !== undefined;
      var k = Mundo.teclas, T = window.AIX_TOQUE || {};
      var dx = 0, dz = 0;
      if (!painelAberto) {
        if (k.ArrowLeft || k.a || T.esq) dx = -1;
        else if (k.ArrowRight || k.d || T.dir) dx = 1;
        if (k.ArrowUp || k.w || T.cima) dz = -1;
        else if (k.ArrowDown || k.s || T.baixo) dz = 1;
      }
      var norma = Math.hypot(dx, dz) || 1;
      var nx = Mundo.avatar.position.x + (dx / norma) * VELOCIDADE * dt;
      var nz = Mundo.avatar.position.z + (dz / norma) * VELOCIDADE * dt;
      if (dx && !colide(nx, Mundo.avatar.position.z)) Mundo.avatar.position.x = nx;
      if (dz && !colide(Mundo.avatar.position.x, nz)) Mundo.avatar.position.z = nz;
      Mundo.vel = { x: (dx / norma) * VELOCIDADE, z: (dz / norma) * VELOCIDADE };

      // câmera orbital segue o avatar
      var dist = 380, alt = 300;
      var cx = Mundo.avatar.position.x + Math.sin(Mundo.yaw) * dist;
      var cz = Mundo.avatar.position.z + Math.cos(Mundo.yaw) * dist;
      camera.position.set(cx, alt, cz);
      camera.lookAt(Mundo.avatar.position.x, 40, Mundo.avatar.position.z);

      var melhor = null, melhorD = RAIO;
      Mundo.interagiveis.forEach(function (it) {
        var d = Math.hypot(Mundo.avatar.position.x - it.x, Mundo.avatar.position.z - it.y);
        if (d < melhorD) { melhorD = d; melhor = it; }
      });
      Mundo.interagivel = melhor;
      var p = document.getElementById('prompt');
      if (melhor && !painelAberto) {
        p.hidden = false;
        p.textContent = (melhor.tipo === 'objeto' ? 'Examinar: ' + melhor.dado.titulo : 'Conversar com: ' + melhor.dado.nome) + ' — pressione E ou toque em Interagir';
      } else { p.hidden = true; }
    }
    renderer.render(cena, camera);
  }

  function redimensionar() {
    var el = document.getElementById('palco');
    var w = el.clientWidth || window.innerWidth, h = el.clientHeight || window.innerHeight;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', redimensionar);

  document.addEventListener('keydown', function (ev) {
    var painelAberto = AIXUI._painelAberto !== null && AIXUI._painelAberto !== undefined;
    Mundo.teclas[ev.key] = true;
    if (ev.key === 'Escape' && painelAberto) { AIXUI._fecharPainel(); return; }
    if (painelAberto) return;
    if (ev.key === 'e' || ev.key === 'E' || ev.key === 'Enter') interagir();
    else if (ev.key === 'm' || ev.key === 'M') AIXUI._painelMissoes();
    else if (ev.key === 'i' || ev.key === 'I') AIXUI._painelInventario();
  });
  document.addEventListener('keyup', function (ev) { Mundo.teclas[ev.key] = false; });

  // arrastar para girar a câmera (mouse ou toque fora dos controles)
  var arrasto = null;
  var alvo = renderer.domElement;
  alvo.addEventListener('pointerdown', function (e) { arrasto = { x: e.clientX }; });
  window.addEventListener('pointerup', function () { arrasto = null; });
  window.addEventListener('pointermove', function (e) {
    if (arrasto) { Mundo.yaw += (e.clientX - arrasto.x) * 0.005; arrasto.x = e.clientX; }
  });

  window.AIXUI.iniciar(CONTRATO, { urlAcessivel: 'preview-acessivel.html' });
  construirAmbiente();
  redimensionar();
  requestAnimationFrame(passo);

  window.AIXUI.registrarMotor({
    interagir: interagir,
    obterPosicao: function () { return Mundo.avatar ? { x: Math.round(Mundo.avatar.position.x), y: Math.round(Mundo.avatar.position.z) } : null; },
    carregarAmbiente: function () { construirAmbiente(); }
  });

  if (TESTE) {
    Object.defineProperty(window, 'AIX_ESTADO', { get: function () {
      return {
        pronto: !!window.AIX_PRONTO3D, env: AIXUI.estado.env,
        pos: Mundo.avatar ? { x: Math.round(Mundo.avatar.position.x), y: Math.round(Mundo.avatar.position.z) } : null,
        interagivel: Mundo.interagivel ? Mundo.interagivel.dado.id : null,
        painel: AIXUI._painelAberto || null,
        missoes: AIXUI.estado.missoes, inventario: AIXUI.estado.inventario, progresso: AIXUI.progresso(), leve: LEVE
      };
    }});
    window.AIX_TESTE = {
      irPara: function (x, y) { if (Mundo.avatar) Mundo.avatar.position.set(x, 0, y); },
      interagir: interagir
    };
  }
})();
