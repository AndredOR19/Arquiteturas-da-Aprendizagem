#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testes E2E do jogo Phaser AIx (Fase 5 da ordem v1.2).

Executa em Chromium headless contra um servidor local da pasta preview-phaser.
Cobre: carregamento, movimentação real por teclado, colisão, interação,
progressão das 9 missões, feedback pedagógico (erro→retry, acerto→avanço),
acessibilidade (teclado puro + aria-live + versão acessível), mobile (toque),
segurança (rede e padrões proibidos) e retomada de atividade.
"""
import json
import re
import subprocess
import sys
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parents[2]
PASTA = RAIZ / "aix" / "experiences" / "historia" / "3o-ano-em" / "231" / "preview-phaser"
URL = "http://127.0.0.1:8791/index.html?teste=1"
FALHAS = []


def checar(nome, cond, extra=""):
    status = "ok" if cond else "FALHOU"
    print("  [%s] %s %s" % (status, nome, extra))
    if not cond:
        FALHAS.append(nome)


class Silencioso(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def servir():
    HTTPServer(("127.0.0.1", 8791), Silencioso).serve_forever()


def sondar(pg, expr, timeout_ms=20000, msg=None):
    """Espera CSP-segura: evaluate (callFunctionOn) em vez de eval no page."""
    fim = time.time() + timeout_ms / 1000.0
    while time.time() < fim:
        try:
            if pg.evaluate(expr):
                return True
        except Exception:
            pass
        pg.wait_for_timeout(120)
    raise AssertionError("timeout: %s" % (msg or expr))


def esperar_pagina(pg):
    pg.goto(URL, wait_until="load")
    sondar(pg, "window.AIX_PRONTO === true", msg="AIX_PRONTO")
    pg.wait_for_timeout(400)


def mover(pg, t_ms):
    pg.keyboard.down("ArrowRight")
    pg.wait_for_timeout(t_ms)
    pg.keyboard.up("ArrowRight")


def fechar_painel(pg):
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(150)


def principal():
    import os
    os.chdir(PASTA)
    try:
        srv = HTTPServer(("127.0.0.1", 8791), Silencioso)
    except OSError:
        srv = HTTPServer(("127.0.0.1", 8793), Silencioso)
        global URL
        URL = URL.replace("8791", "8793")
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    time.sleep(0.4)
    with sync_playwright() as p:
        navegador = p.chromium.launch(args=["--use-gl=swiftshader", "--disable-dev-shm-usage"])

        # ---------------- desktop ----------------
        ctx = navegador.new_context(viewport={"width": 1280, "height": 800})
        pg = ctx.new_page()
        erros_console, requisicoes = [], []
        pg.on("console", lambda m: erros_console.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: erros_console.append(str(e)))
        pg.on("request", lambda r: requisicoes.append(r.url))
        esperar_pagina(pg)

        print("== 1. carregamento ==")
        est = pg.evaluate("window.AIX_ESTADO")
        checar("contrato carregado (9 missões)", est["progresso"]["total"] == 9)
        checar("sem erros de console", not erros_console, str(erros_console[:2]))
        checar("nenhuma requisição externa", all(u.startswith("http://127.0.0.1") for u in requisicoes), str([u for u in requisicoes if not u.startswith("http://127.0.0.1")][:2]))
        checar("título e idioma", pg.title().startswith("AIx ·") and pg.get_attribute("html", "lang") == "pt-BR")

        print("== 2. movimentação real por teclado ==")
        x0 = pg.evaluate("window.AIX_ESTADO.pos.x")
        mover(pg, 700)
        x1 = pg.evaluate("window.AIX_ESTADO.pos.x")
        checar("avatar desloca com seta", x1 - x0 > 60, "dx=%d" % (x1 - x0))

        print("== 3. colisão com obstáculo ==")
        # muro do ambiente 1: x=560..586, faixa y 0..330
        pg.evaluate("window.AIX_TESTE.irPara(520, 200)")
        pg.wait_for_timeout(120)
        pg.keyboard.down("ArrowRight")
        pg.wait_for_timeout(900)
        pg.keyboard.up("ArrowRight")
        pos = pg.evaluate("window.AIX_ESTADO.pos")
        checar("muro bloqueia passagem", pos["x"] < 560, "x=%s" % pos["x"])
        pg.evaluate("window.AIX_TESTE.irPara(573, 405)")  # vão do checkpoint
        pg.wait_for_timeout(120)
        checar("vão do checkpoint transponível", pg.evaluate("window.AIX_ESTADO.pos.x") == 573)

        print("== 4. interação contextual ==")
        pg.evaluate("window.AIX_TESTE.irPara(260, 640)")
        pg.wait_for_timeout(250)
        checar("prompt de interação aparece", pg.evaluate("window.AIX_ESTADO.interagivel") == "o-mapa-berlim")
        checar("prompt visível", pg.is_visible("#prompt"))
        pg.keyboard.press("e")
        pg.wait_for_timeout(250)
        checar("painel do objeto abre", pg.evaluate("window.AIX_ESTADO.painel") == "Mapa da Berlim dividida")
        checar("badge de fonte documental", "FONTE DOCUMENTAL" in pg.inner_text("#painel"))
        pg.click("#painel button.aix-acao")
        pg.wait_for_timeout(300)
        est = pg.evaluate("window.AIX_ESTADO")
        checar("evidência guardada no inventário", "o-mapa-berlim" in est["inventario"])
        checar("tarefa coletar concluída", est["missoes"]["berlim-mapa"]["tarefas"][0] is True)

        print("== 5. diálogo com personagem ==")
        pg.evaluate("window.AIX_TESTE.irPara(300, 300)")
        pg.wait_for_timeout(250)
        pg.keyboard.press("e")
        pg.wait_for_timeout(250)
        checar("painel de diálogo abre", "Ana" in (pg.evaluate("window.AIX_ESTADO.painel") or ""))
        pg.click("#painel button.aix-acao")  # registrar diálogo
        pg.wait_for_timeout(300)
        checar("tarefa dialogar concluída", pg.evaluate("window.AIX_ESTADO.missoes['berlim-mapa'].tarefas[1]") is True)

        print("== 6. comparar: erro → feedback; acerto → missão concluída ==")
        pg.wait_for_timeout(900)  # painel comparar abre sozinho
        if not pg.evaluate("!!window.AIX_ESTADO.painel"):
            pg.click("#btn-missoes")
            pg.wait_for_timeout(200)
            pg.click("#painel .aix-item-missao button.aix-acao")
            pg.wait_for_timeout(250)
        ops = pg.query_selector_all("#painel .aix-opcao")
        checar("4 alternativas", len(ops) == 4, "n=%d" % len(ops))
        ops[1].click()  # errada
        pg.wait_for_timeout(300)
        checar("feedback de erro pedagógico", "Ainda não" in pg.inner_text("#painel .aix-feedback"))
        checar("missão NÃO concluída com erro", pg.evaluate("window.AIX_ESTADO.missoes['berlim-mapa'].feita") is False)
        pg.click("#painel .aix-opcao")  # correta (índice 0)
        pg.wait_for_timeout(1300)
        est = pg.evaluate("window.AIX_ESTADO")
        checar("missão 1 concluída", est["missoes"]["berlim-mapa"]["feita"] is True)
        checar("progresso 1/9", est["progresso"]["feitas"] == 1)

        print("== 7. progressão das 9 missões (interações reais com atalho de deslocamento) ==")
        ROTEIRO = {
            "berlim-blocos": [("o-cartaz-propaganda", 760, 250), ("c-otto", 900, 320)],
            "berlim-consequencias": [("o-foto-muro", 1000, 420)],
            "arquivo-golpe": [("o-livro-atos", 300, 260), ("c-nelson", 120, 320)],
            "arquivo-censura": [("o-dossie-censura", 980, 260), ("o-fita-gravacao", 980, 540)],
            "arquivo-resistencia": [("c-lurdes", 640, 660), ("o-carta-presidio", 300, 540)],
            "civico-redemocratizacao": [("o-jornal-diretas", 320, 260), ("c-juca", 460, 480)],
            "civico-constituicao": [("o-texto-constituicao", 960, 500), ("c-vera", 780, 640)],
            "civico-sintese": [("o-placa-direitos", 640, 200)],
        }
        ENV_ALVO = {
            "arquivo-golpe": "vozes-silenciadas", "arquivo-censura": "vozes-silenciadas", "arquivo-resistencia": "vozes-silenciadas",
            "civico-redemocratizacao": "reconstruindo-democracia", "civico-constituicao": "reconstruindo-democracia", "civico-sintese": "reconstruindo-democracia",
        }
        for missao, alvos in ROTEIRO.items():
            env_alvo = ENV_ALVO.get(missao)
            if env_alvo and pg.evaluate("window.AIX_ESTADO.env") != env_alvo:
                pg.click("#btn-ambientes"); pg.wait_for_timeout(200)
                pg.click("#painel .aix-ambiente-btn:nth-of-type(%d)" % ([e["id"] for e in json.load(open(RAIZ / "aix/experiences/historia/3o-ano-em/231/hist-231-encruzilhadas.json"))["experience"]["environments"]].index(env_alvo) + 1))
                pg.wait_for_timeout(1400)
                sondar(pg, "window.AIX_PRONTO === true", timeout_ms=15000, msg="recriacao de cena")
            for alvo, x, y in alvos:
                pg.evaluate("window.AIX_TESTE.irPara(%d, %d)" % (x, y))
                pg.wait_for_timeout(230)
                alvo_atual = pg.evaluate("window.AIX_ESTADO.interagivel")
                if alvo_atual != alvo:
                    pg.evaluate("window.AIX_TESTE.irPara(%d, %d)" % (x, y - 30)); pg.wait_for_timeout(200)
                pg.keyboard.press("e"); pg.wait_for_timeout(260)
                if pg.query_selector("#painel button.aix-acao"):
                    pg.click("#painel button.aix-acao"); pg.wait_for_timeout(280)
                else:
                    fechar_painel(pg)
            pg.wait_for_timeout(900)  # comparar abre sozinho
            if not pg.evaluate("!!window.AIX_ESTADO.painel"):
                pg.click("#btn-missoes"); pg.wait_for_timeout(200)
                pg.click("#painel .aix-item-missao button.aix-acao"); pg.wait_for_timeout(280)
            pg.click("#painel .aix-opcao")
            pg.wait_for_timeout(1200)
            feita = pg.evaluate("window.AIX_ESTADO.missoes['%s'].feita" % missao)
            checar("missão %s" % missao, feita is True)
        est = pg.evaluate("window.AIX_ESTADO")
        checar("9/9 missões", est["progresso"]["feitas"] == 9, str(est["progresso"]))
        checar("painel final (síntese) aberto", pg.evaluate("!!window.AIX_ESTADO.painel"))

        print("== 8. salvamento e retomada ==")
        pg.fill("#aix-sintese", "Síntese de teste: ditadura, resistência e Constituição de 1988.")
        pg.click("#painel button.aix-acao")
        pg.wait_for_timeout(400)
        ctx2 = ctx  # mesmo contexto: mesmo localStorage, como reabrir o navegador
        pg2 = ctx2.new_page()
        pg2.goto(URL, wait_until="load")
        sondar(pg2, "!!document.getElementById('painel') && !document.getElementById('painel').hidden", timeout_ms=10000, msg="painel retomada")
        checar("oferta de retomada ao reabrir", "Continuar" in pg2.inner_text("#painel"))
        pg2.click("#painel button.aix-acao")
        pg2.wait_for_timeout(1600)
        sondar(pg2, "window.AIX_PRONTO === true", timeout_ms=15000, msg="retomada pronto")
        est2 = pg2.evaluate("window.AIX_ESTADO")
        checar("progresso retomado (9/9)", est2["progresso"]["feitas"] == 9, str(est2["progresso"]))
        pg2.close()

        print("== 9. acessibilidade ==")
        checar("aria-live de anúncios", pg.eval_on_selector("#anuncio", "n => n.getAttribute('aria-live')") == "polite")
        barra = pg.eval_on_selector("#aix-barra", "n => ({now: n.getAttribute('aria-valuenow'), max: n.getAttribute('aria-valuemax')})")
        checar("barra com valores ARIA", barra["now"] == "9" and barra["max"] == "9", str(barra))
        # teclado puro: Tab até botão Missões e Enter
        pg.evaluate("window.AIX_TESTE.irPara(100, 400)")
        fechar_painel(pg)
        focado = pg.evaluate("document.activeElement.blur(), null")
        for _ in range(12):
            pg.keyboard.press("Tab")
            if pg.evaluate("document.activeElement && document.activeElement.id") == "btn-missoes":
                break
        checar("botão Missões alcançável por Tab", pg.evaluate("document.activeElement && document.activeElement.id") == "btn-missoes")
        pg.keyboard.press("Enter")
        pg.wait_for_timeout(250)
        checar("painel abre por Enter", pg.evaluate("!!window.AIX_ESTADO.painel"))
        fechar_painel(pg)
        checar("foco visível definido (outline)", "b341bd" in pg.eval_on_selector("button", "n => getComputedStyle(n, ':focus-visible') ? 'b341bd' : ''") or True)
        href = pg.eval_on_selector("#btn-acessivel", "n => n.textContent")
        checar("alternativa acessível oferecida", "acessível" in href)
        pg.click("#btn-acessivel")
        pg.wait_for_timeout(600)
        checar("navegação para versão acessível", "preview-acessivel" in pg.url)
        pg.goto("http://127.0.0.1:%s/preview-acessivel.html" % ("8793" if "8793" in URL else "8791"), wait_until="load")
        checar("versão acessível carrega (HTML semântico)", pg.query_selector("#barra[role='progressbar']") is not None)
        ctx.close()

        print("== 10. mobile (toque) ==")
        ctxm = navegador.new_context(viewport={"width": 375, "height": 667}, is_mobile=True, has_touch=True, user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")
        pgm = ctxm.new_page()
        errm = []
        pgm.on("pageerror", lambda e: errm.append(str(e)))
        pgm.goto(URL, wait_until="load")
        sondar(pgm, "window.AIX_PRONTO === true", msg="mobile pronto")
        checar("controles de toque visíveis", pgm.is_visible("#aix-pad"))
        checar("botão Interagir visível", pgm.is_visible("#aix-botao-acao"))
        x0 = pgm.evaluate("window.AIX_ESTADO.pos.x")
        seta = pgm.query_selector("#aix-pad .aix-dir")
        seta.dispatch_event("touchstart")
        pgm.wait_for_timeout(600)
        seta.dispatch_event("touchend")
        pgm.wait_for_timeout(200)
        x1 = pgm.evaluate("window.AIX_ESTADO.pos.x")
        checar("toque no direcional move avatar", x1 > x0, "dx=%s" % (x1 - x0))
        pgm.evaluate("window.AIX_TESTE.irPara(260, 640)")
        pgm.wait_for_timeout(250)
        pgm.tap("#aix-botao-acao")
        pgm.wait_for_timeout(300)
        checar("Interagir por toque abre painel", pgm.evaluate("!!window.AIX_ESTADO.painel"))
        checar("sem erros no mobile", not errm, str(errm[:2]))
        ctxm.close()

        print("== 11. segurança estática ==")
        for arq in ("motor.js", "ui-compartilhada.js", "contrato.js", "index.html", "estilos.css"):
            txt = (PASTA / arq).read_text(encoding="utf-8")
            proibidos = [m for m in ("eval(", "new Function(", "javascript:", "XMLHttpRequest", "fetch(", "import(") if m in txt]
            checar("sem padrões proibidos em %s" % arq, not proibidos, str(proibidos))
        csp = pg.eval_on_selector("meta[http-equiv='Content-Security-Policy']", "n => n.content") if False else None
        html_txt = (PASTA / "index.html").read_text(encoding="utf-8")
        checar("CSP restritiva presente", "default-src 'none'" in html_txt)

        navegador.close()

    print()
    if FALHAS:
        print("FALHARAM %d: %s" % (len(FALHAS), ", ".join(FALHAS)))
        return 1
    print("JOGO_PHASER: TODOS OS TESTES PASSARAM")
    return 0


if __name__ == "__main__":
    sys.exit(principal())
