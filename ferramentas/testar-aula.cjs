#!/usr/bin/env node
/* Teste de integração de aula do padrão app.js v2.0.0 (jsdom, sem navegador).
   Uso: NODE_PATH=/home/user/domtest/node_modules node ferramentas/testar-aula.cjs aulas/<slug> [servidor|recusa]
   - 'servidor' (padrão): receptor Supabase simulado confirma iniciar/eventos/concluir.
   - 'recusa': aula não cadastrada no receptor — verifica o modo local com exportação.
   Motores de jogo (phaser/p5) são bloqueados no carregamento: o jogo é testado na
   versão em lista, que espelha as mesmas missões. Requer jsdom 24. */
const fs = require('fs'), path = require('path'), assert = require('node:assert/strict');
const { JSDOM, VirtualConsole, ResourceLoader } = require('jsdom');

const slugDir = process.argv[2], modo = process.argv[3] || 'servidor';
if (!slugDir || !fs.existsSync(path.join(slugDir, 'index.html'))) {
  console.error('uso: node ferramentas/testar-aula.cjs aulas/<slug> [servidor|recusa]'); process.exit(1);
}
const id = path.basename(path.resolve(slugDir));
let passed = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); passed++; console.log('  ✓ ' + msg); };

class SemMotores extends ResourceLoader {
  fetch(url, options) {
    if (/phaser|p5-|kaplay/.test(url)) return Promise.resolve(Buffer.from(''));
    return super.fetch(url, options);
  }
}

async function boot() {
  const chamadas = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => { if (!/canvas|getContext|WebGL|not implemented|audio|Could not load link|Invalid base URL/i.test(String(e && e.message))) console.error('jsdomError:', e && e.message); });
  const htmlPath = path.resolve(slugDir, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  // extrai os scripts na ordem do documento; remove as tags (serão injetadas manualmente)
  const tags = [...html.matchAll(/<script([^>]*)src="([^"]+)"([^>]*)><\/script>/g)].map(m => ({ attrs: m[1] + m[3], src: m[2] }));
  const stripped = html.replace(/<script[^>]*src="[^"]+"[^>]*><\/script>/g, '');
  const dom = new JSDOM(stripped, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://arquiteturas-aulas.vercel.app/' + slugDir + '/index.html', virtualConsole: vc,
    beforeParse(w) {
      w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
      if (!w.crypto.randomUUID) w.crypto.randomUUID = () => require('node:crypto').randomUUID();
      if (!w.performance.getEntriesByType) w.performance.getEntriesByType = () => [];
      if (!w.Element.prototype.scrollIntoView) w.Element.prototype.scrollIntoView = function () {};
      w.HTMLCanvasElement.prototype.getContext = () => null;
      w.speechSynthesis = { getVoices: () => [], speak() {}, cancel() {}, pause() {}, resume() {}, paused: false, pending: false, speaking: false };
      w.AudioContext = w.AudioContext || function () { return { createOscillator: () => ({ connect() {}, start() {}, stop() {}, frequency: { value: 0, setValueAtTime() {} }, type: '' }), createGain: () => ({ connect() {}, gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} } }), destination: {}, currentTime: 0, state: 'running', sampleRate: 44100, resume() { return Promise.resolve(); }, close() { return Promise.resolve(); }, addEventListener() {} }; };
      if (!w.URL.createObjectURL) w.URL.createObjectURL = () => 'blob:teste';
      if (!w.URL.revokeObjectURL) w.URL.revokeObjectURL = () => {};
      w.fetch = async (url, opts = {}) => {
        const body = opts.body ? JSON.parse(opts.body) : null; if (body) chamadas.push(body);
        const R = o => ({ ok: o.ok !== false, json: async () => o, text: async () => JSON.stringify(o) });
        if (body && body.acao === 'iniciar') {
          if (modo === 'recusa') return R({ ok: false, mensagem: 'Turma ou professor não correspondem à aula cadastrada.' });
          return R({ ok: true, estado: 'identificado', sessao_id: body.sessao_id });
        }
        if (body && body.acao === 'eventos') return R({ ok: true, estado: 'recebido', sessao_id: body.sessao_id, quantidade: body.eventos.length, eventos_ids: body.eventos.map(e => e.id) });
        if (body && body.acao === 'concluir') return R({ ok: true, estado: 'recebido', sessao_id: body.sessao_id, snapshot_id: body.relatorio.snapshot_id });
        return R({ ok: false, mensagem: 'Ação desconhecida (teste).' });
      };
    }
  });
  const w = dom.window;
  // ordem do navegador: scripts comuns na ordem do DOM; defer após a análise
  const comuns = tags.filter(t => !/defer/.test(t.attrs)).map(t => t.src);
  const defers = tags.filter(t => /defer/.test(t.attrs)).map(t => t.src);
  const drain = () => new Promise(r => setImmediate(r));
  for (const src of [...comuns, ...defers]) {
    if (/phaser|p5-|kaplay/.test(src)) continue;
    const file = path.join(slugDir, src.replace(/^\.\//, '').split('?')[0]);
    const s = w.document.createElement('script');
    s.textContent = fs.readFileSync(file, 'utf-8');
    w.document.body.appendChild(s);
    await drain();
    if (/app\.js/.test(src)) { await drain(); } // garante init() (microtask) antes dos wrappers
  }
  await new Promise(r => setTimeout(r, 300));
  return { dom, w, chamadas };
}

(async () => {
  console.log('[teste] ' + id + ' — modo ' + modo);
  const { dom, w, chamadas } = await boot();
  const $ = s => w.document.querySelector(s);
  const E = w.eval.bind(w);
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // 1. inicialização
  ok(E('D.percursos.length') === 26, '26 percursos carregados');
  ok(/9º ano|7º ano|6º ano/.test(w.document.title), 'título da página com o ano cursado');
  ok(!/Turma \d|\d{2}\/\d{2}\/\d{4}/.test($('#meta').textContent), '#meta sem código de turma e sem data');
  ok(E('D.percursos.every(p=>p.alternativas.length===3&&typeof p.correta==="number"&&p.pistas.length===3)'), 'percursos com 3 alternativas, correta e 3 pistas');
  ok(E('D.percursos.every(p=>p.retorno&&Object.keys(p.retorno).length===3)'), 'feedback de retorno nas 3 alternativas');
  ok(E('D.blocos.length===4&&D.exploracao.length===3&&Object.keys(D.glossario).length>0'), '4 blocos, 3 cartões de exploração e glossário');

  // 2. porta de entrada + coleta
  ok(!!$('#entry') && $('section#journey').hidden, 'porta de entrada presente; percursos fechados até identificar');
  const regras = $('#recovery-understood');
  regras.checked = true; regras.dispatchEvent(new w.Event('change', { bubbles: true }));
  $('#entry-name').value = 'Aluna Teste Da Silva'; $('#entry-class').value = '9º ano'; $('#entry-teacher').value = 'André de Oliveira Rodrigues';
  $('#entry-confirm').click();
  await wait(400);
  if (modo === 'servidor') {
    ok(!$('section#journey').hidden, 'entrada liberada com confirmação do servidor simulado');
    ok(chamadas.some(c => c.acao === 'iniciar' && c.artefato === id), 'ação iniciar enviada com o artefato correto');
  } else {
    ok($('section#journey').hidden, 'entrada segue bloqueada após a primeira recusa');
    $('#entry-confirm').click(); await wait(400);
    ok(!!$('#entry-local'), 'botão de modo local oferecido após duas recusas de cadastro');
    $('#entry-local').click(); await wait(200);
    ok(!$('section#journey').hidden, 'modo local libera a aula sem confirmação do servidor');
    ok(!chamadas.some(c => c.acao === 'eventos' || c.acao === 'concluir'), 'nenhum evento ou relatório enviado no modo recusa');
  }

  // 3. jogo (versão acessível — mesmas missões do jogo principal)
  const jogoCaixa = $('#jogo-lista') || $('#jogo-passos');
  ok(!!jogoCaixa && !!w.JogoAula, 'jogo com versão acessível e gabarito consultável');
  ok(jogoCaixa.querySelectorAll('.game-missao').length === w.JogoAula.total, w.JogoAula.total + ' missões na versão acessível');
  const missao = n => jogoCaixa.querySelectorAll('.game-missao')[n];
  const btnValor = (n, v) => [...missao(n).querySelectorAll('button')].find(b => b.dataset.valor === String(v));
  btnValor(0, w.JogoAula.corretas[0]).click();
  ok(missao(0).classList.contains('concluida') && missao(0).querySelector('[role=status]').textContent.length > 20, 'missão 1 concluída com explicação');
  const errar = w.JogoAula.valores(1).find(v => String(v) !== String(w.JogoAula.corretas[1]));
  btnValor(1, errar).click();
  ok(!missao(1).classList.contains('concluida') && missao(1).querySelector('[role=status]').textContent.length > 20, 'erro na missão 2 não pune e explica');
  btnValor(1, w.JogoAula.corretas[1]).click();
  ok(missao(1).classList.contains('concluida'), 'missão 2 concluída após correção');
  ok(E('S.jogo.feitas') === 2 && E('S.jogo.acertos') === 1, 'progresso do jogo registrado (2 concluídas, 1 acerto de primeira)');

  // 4. percursos — 1º com erro e recuperação; demais corretos
  const clicar = j => w.document.querySelectorAll('#options .choice')[j].click();
  const errada = E('D.percursos[0].correta') === 0 ? 1 : 0;
  clicar(errada);
  ok(!!$('#confirm-original') && !$('#confirm-original').disabled, 'confirmação da resposta original habilitada');
  $('#confirm-original').click(); await wait(60);
  ok($('#counter').textContent.includes('RECUPERAÇÃO'), 'primeiro erro abre experiência de recuperação');
  const extra = E('RecuperacaoDados[0][0]');
  const alvoTexto = extra.alternativas[extra.correta];
  [...w.document.querySelectorAll('#options .choice')].find(b => b.textContent.endsWith(alvoTexto)).click();
  $('#confirm-recovery').click(); await wait(60);
  ok(E('S.adaptive.families[0].extras[0].correct') === true, 'atividade extra concluída corretamente');
  clicar(E('D.percursos[0].correta')); $('#confirm-original').click(); await wait(60);
  ok(E('S.records[0].correct') === true && E('S.records[0].attempts.length') === 2, 'percurso 1 concluído após recuperação (2 tentativas)');
  $('#next').click(); await wait(30);
  for (let i = 1; i < 26; i++) {
    clicar(E('D.percursos[' + i + '].correta')); $('#confirm-original').click();
    await wait(10);
    if (i < 25) $('#next').click();
  }
  ok(E('S.records.filter(r=>r.correct).length') === 26, '26 percursos concluídos');

  // 5. experiência
  ok(!$('section#experience').hidden, 'avaliação de experiência visível ao concluir os percursos');
  for (const f of w.document.querySelectorAll('#experience fieldset')) {
    const first = f.querySelector('input'); first.checked = true; first.dispatchEvent(new w.Event('change', { bubbles: true }));
  }
  const comentario = $('#exp-comment');
  comentario.value = 'Teste de integração.'; comentario.dispatchEvent(new w.Event('input', { bubbles: true }));
  ok(E('missingExperience().length') === 0, 'todas as perguntas da experiência respondidas');
  $('#confirmExperience').click(); await wait(200);
  ok(E('S.experience.confirmed') === true && E('resultReady()'), 'avaliação confirmada e resultado liberado');

  // 6. relatório
  const rep = E('fullReport()');
  ok(/9[.,]6/.test(rep), 'nota inicial 9,6 (25 de 26 na primeira) — recuperação não penaliza');
  ok(rep.includes('JOGO') && rep.includes('RECUPERAÇÃO ADAPTATIVA') && rep.includes('EXPERIÊNCIA COM O ARTEFATO'), 'relatório inclui jogo, recuperação e experiência');
  console.log('  [medida] fullReport: ' + rep.length + ' caracteres (limites do receptor: JSON 60000 / raw 80000)');
  if (modo === 'servidor') {
    ok(rep.includes('COLETA ONLINE'), 'relatório marca coleta online no modo servidor');
    ok(chamadas.some(c => c.acao === 'concluir' && c.relatorio && c.relatorio.percursos_total === 26), 'relatório final enviado ao receptor simulado');
    const fin = chamadas.find(c => c.acao === 'concluir');
    console.log('  [medida] payload concluir: ' + JSON.stringify(fin.relatorio).length + ' caracteres (teto do receptor p/ artefatos novos: 60000)');
    ok(chamadas.some(c => c.acao === 'eventos' && c.eventos.some(e => e.tipo === 'tentativa')), 'tentativas transmitidas como eventos');
  } else {
    ok(!rep.includes('COLETA ONLINE'), 'modo local não declara coleta online');
  }

  // 7. persistência e convenções
  ok(!!w.localStorage.getItem('andre:aula:' + id + ':v1'), 'sessão persistida neste navegador');
  const rodape = w.document.querySelector('footer').textContent;
  ok(/(9º|7º|6º) ano/.test(rodape) && !/\d{2}\/\d{2}\/\d{4}/.test(rodape) && !/turma \d/i.test(rodape), 'rodapé só com o ano, sem turma e sem data');
  // Política do repositório: QR somente após validar o endereço publicado (HTTP 200 no Vercel).
  const slugPub = slugDir.replace(/\/+$/, '').split('/').pop();
  const urlPublicada = 'https://arquiteturas-aulas.vercel.app/aulas/' + slugPub + '/';
  const qrSec = w.document.querySelector('section#compartilhar');
  if (qrSec || /qrcode/i.test(w.document.body.innerHTML)) {
    const qrImg = qrSec ? qrSec.querySelector('img[src="qrcode.svg"][alt]') : null;
    const qrLink = qrSec ? [...qrSec.querySelectorAll('a')].find(a => a.href === urlPublicada) : null;
    const qrArquivo = fs.existsSync(path.join(slugDir, 'qrcode.svg'));
    ok(qrSec && qrImg && qrLink && qrArquivo, 'QR code presente, com alternativa textual e link para o endereço publicado validado');
  } else {
    ok(true, 'sem QR code nesta versão (será incluído após validar o endereço publicado)');
  }

  dom.window.close();
  console.log('[teste] ' + passed + ' verificações aprovadas — ' + id + ' (' + modo + ')');
  process.exit(0);
})().catch(e => { console.error('[FALHA]', e && e.message); process.exit(1); });
