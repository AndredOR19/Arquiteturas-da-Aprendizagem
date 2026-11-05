#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testes E2E do protótipo Three.js AIx (Fase 3/5).

Verifica que o MESMO contrato do motor 2D produz uma experiência 3D funcional:
cena explorável, avatar controlável por teclado e toque, colisão, objetos
interativos, missão completa, modo leve, mobile e segurança.
"""
import os
import sys
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parents[2]
PASTA = RAIZ / "aix" / "experiences" / "historia" / "3o-ano-em" / "231" / "preview-3d"
FALHAS = []


def checar(nome, cond, extra=""):
    print("  [%s] %s %s" % ("ok" if cond else "FALHOU", nome, extra))
    if not cond:
        FALHAS.append(nome)


class Silencioso(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def sondar(pg, expr, timeout_ms=20000, msg=None):
    fim = time.time() + timeout_ms / 1000.0
    while time.time() < fim:
        try:
            if pg.evaluate(expr):
                return True
        except Exception:
            pass
        pg.wait_for_timeout(120)
    raise AssertionError("timeout: %s" % (msg or expr))


def principal():
    os.chdir(PASTA)
    porta = 8795
    srv = HTTPServer(("127.0.0.1", porta), Silencioso)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    time.sleep(0.3)
    base = "http://127.0.0.1:%d" % porta
    with sync_playwright() as p:
        navegador = p.chromium.launch(args=["--use-gl=swiftshader", "--disable-dev-shm-usage"])

        print("== 3D desktop: cena, movimento, colisão, interação, missão ==")
        ctx = navegador.new_context(viewport={"width": 1280, "height": 800})
        pg = ctx.new_page()
        erros = []
        pg.on("pageerror", lambda e: erros.append(str(e)))
        pg.on("console", lambda m: erros.append(m.text) if m.type == "error" else None)
        pg.goto(base + "/index.html?teste=1", wait_until="load")
        sondar(pg, "window.AIX_PRONTO3D === true", msg="cena 3D pronta")
        pg.wait_for_timeout(500)
        checar("cena WebGL renderiza (canvas)", pg.evaluate("!!document.querySelector('#palco canvas')"))
        checar("mesmas 9 missões do contrato", pg.evaluate("window.AIX_ESTADO.progresso.total") == 9)
        checar("sem erros JS", not erros, str(erros[:2]))

        x0 = pg.evaluate("window.AIX_ESTADO.pos.x")
        pg.keyboard.down("ArrowRight")
        pg.wait_for_timeout(700)
        pg.keyboard.up("ArrowRight")
        x1 = pg.evaluate("window.AIX_ESTADO.pos.x")
        checar("avatar 3D move com teclado", x1 - x0 > 50, "dx=%s" % (x1 - x0))

        pg.evaluate("window.AIX_TESTE.irPara(520, 200)")
        pg.wait_for_timeout(120)
        pg.keyboard.down("ArrowRight")
        pg.wait_for_timeout(800)
        pg.keyboard.up("ArrowRight")
        pos = pg.evaluate("window.AIX_ESTADO.pos")
        checar("muro 3D bloqueia (colisão AABB)", pos["x"] < 544, "x=%s" % pos["x"])

        # missão 1 completa no 3D (coletar + dialogar + comparar)
        pg.evaluate("window.AIX_TESTE.irPara(260, 640)")
        pg.wait_for_timeout(250)
        checar("objeto interativo detectado", pg.evaluate("window.AIX_ESTADO.interagivel") == "o-mapa-berlim")
        pg.keyboard.press("e")
        pg.wait_for_timeout(250)
        pg.click("#painel button.aix-acao")
        pg.wait_for_timeout(300)
        pg.evaluate("window.AIX_TESTE.irPara(300, 300)")
        pg.wait_for_timeout(250)
        pg.keyboard.press("e")
        pg.wait_for_timeout(250)
        pg.click("#painel button.aix-acao")
        pg.wait_for_timeout(900)
        if not pg.evaluate("!!window.AIX_ESTADO.painel"):
            pg.click("#btn-missoes"); pg.wait_for_timeout(200)
            pg.click("#painel .aix-item-missao button.aix-acao"); pg.wait_for_timeout(250)
        pg.click("#painel .aix-opcao")
        pg.wait_for_timeout(1300)
        est = pg.evaluate("window.AIX_ESTADO")
        checar("missão completa no 3D (coletar+dialogar+comparar)", est["missoes"]["berlim-mapa"]["feita"] is True)
        checar("progresso 1/9", est["progresso"]["feitas"] == 1)

        # troca de ambiente reconstrói a cena 3D
        pg.click("#btn-ambientes"); pg.wait_for_timeout(200)
        pg.click("#painel .aix-ambiente-btn:nth-of-type(2)")
        pg.wait_for_timeout(700)
        est = pg.evaluate("window.AIX_ESTADO")
        checar("ambiente 2 carregado no 3D", est["env"] == "vozes-silenciadas")
        checar("retomada de posição no novo ambiente", pg.evaluate("window.AIX_ESTADO.pos.x") < 300)
        ctx.close()

        print("== 3D mobile + modo leve ==")
        ctxm = navegador.new_context(viewport={"width": 375, "height": 667}, is_mobile=True, has_touch=True)
        pgm = ctxm.new_page()
        errm = []
        pgm.on("pageerror", lambda e: errm.append(str(e)))
        pgm.goto(base + "/index.html?teste=1&leve=1", wait_until="load")
        sondar(pgm, "window.AIX_PRONTO3D === true", msg="3D mobile leve")
        pgm.wait_for_timeout(400)
        checar("modo leve ativo", pgm.evaluate("window.AIX_ESTADO.leve") is True)
        checar("controles de toque visíveis", pgm.is_visible("#aix-pad"))
        x0 = pgm.evaluate("window.AIX_ESTADO.pos.x")
        seta = pgm.query_selector("#aix-pad .aix-dir")
        seta.dispatch_event("touchstart")
        pgm.wait_for_timeout(600)
        seta.dispatch_event("touchend")
        pgm.wait_for_timeout(200)
        x1 = pgm.evaluate("window.AIX_ESTADO.pos.x")
        checar("toque move avatar 3D", x1 > x0, "dx=%s" % (x1 - x0))
        pgm.evaluate("window.AIX_TESTE.irPara(260, 640)")
        pgm.wait_for_timeout(250)
        pgm.tap("#aix-botao-acao")
        pgm.wait_for_timeout(300)
        checar("Interagir por toque no 3D", pgm.evaluate("!!window.AIX_ESTADO.painel"))
        checar("sem erros no mobile 3D", not errm, str(errm[:2]))
        ctxm.close()

        print("== segurança estática ==")
        for arq in ("motor3d.js", "ui-compartilhada.js", "contrato.js", "index.html"):
            txt = (PASTA / arq).read_text(encoding="utf-8")
            proibidos = [m for m in ("eval(", "new Function(", "javascript:", "XMLHttpRequest", "fetch(", "import(") if m in txt]
            checar("sem padrões proibidos em %s" % arq, not proibidos, str(proibidos))
        checar("CSP restritiva", "default-src 'none'" in (PASTA / "index.html").read_text(encoding="utf-8"))

        navegador.close()
    print()
    if FALHAS:
        print("FALHARAM %d: %s" % (len(FALHAS), ", ".join(FALHAS)))
        return 1
    print("JOGO_3D: TODOS OS TESTES PASSARAM")
    return 0


if __name__ == "__main__":
    sys.exit(principal())
