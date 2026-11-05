#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Motor Phaser 2D AIx — gera a experiência jogável a partir do Contrato Universal.

Saídas (ao lado do contrato):
  preview-phaser/            — pasta publicável (index.html + assets + CSP restritiva)
  preview-phaser.html        — arquivo único offline (tudo embutido)

Uso: python3 aix/engines/phaser-2d/gerar.py <contrato.json> [--sem-arquivo-unico]
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[2]
TEMPLATES_ACEITOS = {"document-investigation", "historical-museum"}


def _checar_js(caminho):
    r = subprocess.run(["node", "--check", str(caminho)], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit("JS INVALIDO em %s:\n%s" % (caminho, r.stderr[:600]))


def gerar(caminho_contrato, arquivo_unico=True):
    contrato = json.loads(Path(caminho_contrato).read_text(encoding="utf-8"))

    sys.path.insert(0, str(RAIZ / "aix" / "contracts"))
    import validador  # noqa: E402
    erros = validador.validar_contrato(contrato, str(RAIZ))
    if erros:
        raise SystemExit("CONTRATO INVALIDO (%d): %s" % (len(erros), "; ".join(erros[:4])))
    exp = contrato["experience"]
    if exp["template"] not in TEMPLATES_ACEITOS:
        raise SystemExit("template '%s' nao suportado pelo motor 2D" % exp["template"])
    sem_jogo = [a["id"] for a in exp["environments"] if not (a.get("layout") and a.get("objects"))]
    if sem_jogo:
        raise SystemExit("ambientes sem dados de jogo (layout/objects): %s" % ", ".join(sem_jogo))
    if "2d" not in exp.get("modes", []):
        raise SystemExit("contrato nao declara modo 2d em experience.modes")

    destino = Path(caminho_contrato).parent / "preview-phaser"
    if destino.exists():
        shutil.rmtree(destino)
    destino.mkdir(parents=True)

    # prévia acessível ao lado (mesma experiência, sem movimentação)
    acessivel = Path(caminho_contrato).parent / "preview-acessivel.html"
    if not acessivel.exists():
        subprocess.run([sys.executable, str(RAIZ / "aix" / "engines" / "accessible" / "gerar.py"), str(caminho_contrato)], check=True)

    for nome in ("motor.js", "ui-compartilhada.js", "estilos.css"):
        shutil.copy2(AQUI / nome, destino / nome)
    shutil.copy2(AQUI / "vendor" / "phaser.min.js", destino / "phaser.min.js")
    shutil.copy2(acessivel, destino / "preview-acessivel.html")
    (destino / "contrato.js").write_text(
        "window.AIX_CONTRATO = %s;\n" % json.dumps(contrato, ensure_ascii=False), encoding="utf-8"
    )

    titulo = "AIx · %s — %s" % (exp["environments"][0]["title"], contrato["curriculum"]["subject"])
    html = """<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=2">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:;">
<title>__TITULO__</title><link rel="stylesheet" href="estilos.css">
</head><body>
<div id="palco"></div>
<div id="hud"></div>
<div id="prompt" hidden></div>
<div id="toast"></div><div id="anuncio" aria-live="polite"></div>
<div id="painel" hidden></div>
<div id="toque"></div>
<div id="falha" hidden><p>Não foi possível carregar o contrato desta experiência.</p></div>
<script src="phaser.min.js"></script>
<script src="contrato.js"></script>
<script src="ui-compartilhada.js"></script>
<script src="motor.js"></script>
</body></html>""".replace("__TITULO__", titulo)
    (destino / "index.html").write_text(html, encoding="utf-8")

    for js in ("motor.js", "ui-compartilhada.js", "contrato.js"):
        _checar_js(destino / js)

    n = 0
    if arquivo_unico:
        unico = Path(caminho_contrato).parent / "preview-phaser.html"
        css = (AQUI / "estilos.css").read_text(encoding="utf-8")
        partes = ["""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=2">
<title>__TITULO__ (arquivo único)</title><style>__CSS__</style></head><body>
<div id="palco"></div><div id="hud"></div><div id="prompt" hidden></div>
<div id="toast"></div><div id="anuncio" aria-live="polite"></div>
<div id="painel" hidden></div><div id="toque"></div>
<div id="falha" hidden><p>Não foi possível carregar o contrato desta experiência.</p></div>""".replace("__TITULO__", titulo).replace("__CSS__", css)]
        for js in ("phaser.min.js", "ui-compartilhada.js", "contrato.js", "motor.js"):
            partes.append("<script>\n%s\n</script>" % (destino / js).read_text(encoding="utf-8"))
        partes.append("</body></html>")
        unico.write_text("\n".join(partes), encoding="utf-8")
        n = unico.stat().st_size
    print("PREVIA_PHASER_OK %s (%d bytes) | arquivo unico: %s (%d bytes)"
          % (destino, sum(f.stat().st_size for f in destino.iterdir()), arquivo_unico, n))
    return destino


def main():
    if len(sys.argv) < 2:
        print("uso: gerar.py <contrato.json> [--sem-arquivo-unico]")
        return 1
    gerar(sys.argv[1], "--sem-arquivo-unico" not in sys.argv)
    return 0


if __name__ == "__main__":
    sys.exit(main())
