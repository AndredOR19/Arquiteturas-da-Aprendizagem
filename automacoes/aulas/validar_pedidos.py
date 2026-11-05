#!/usr/bin/env python3
"""Validador conservador de pedidos de aula; não gera nem publica sozinho."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REQUESTS = ROOT / "automacoes" / "aulas" / "pedidos"
REQUIRED = {"id", "data", "turma", "disciplina", "tema", "fonte_curricular", "habilidades", "design", "estado"}
STATES = {"rascunho", "pronto_para_revisao", "aprovado"}
def verify(path):
    errors = []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (ValueError, UnicodeError) as exc:
        return [f"{path}: JSON inválido: {exc}"]
    missing = REQUIRED - set(data)
    if missing:
        errors.append(f"{path}: faltam {sorted(missing)}")
        return errors
    if data["estado"] not in STATES:
        errors.append(f"{path}: estado inválido")
    if not isinstance(data["habilidades"], list) or not data["habilidades"]:
        errors.append(f"{path}: habilidades devem ser lista não vazia; usar 'a_conferir' quando necessário")
    if not isinstance(data["design"], dict) or not all(data["design"].get(k) for k in ("biblioteca", "revisao", "modelo")):
        errors.append(f"{path}: design exige biblioteca, revisao e modelo")
    if data["design"].get("biblioteca") != "AndredOR19/Biblioteca-de-Diagramacao":
        errors.append(f"{path}: biblioteca incorreta")
    if not data.get("fonte_curricular"):
        errors.append(f"{path}: fonte curricular vazia")
    if data["estado"] == "aprovado":
        location = data.get("artefato")
        if not isinstance(location, str) or not location.startswith(("aulas/", "laboratorios/")) or ".." in Path(location).parts:
            errors.append(f"{path}: aprovado exige artefato seguro em aulas/ ou laboratorios/")
        elif not (ROOT / location / "index.html").is_file():
            errors.append(f"{path}: index.html ausente do artefato aprovado: {location}")
        if not data.get("aprovacao_docente"):
            errors.append(f"{path}: aprovado exige aprovacao_docente documentada")
    return errors

def main():
    paths = sorted(REQUESTS.glob("*.json"))
    failures = [msg for path in paths for msg in verify(path)]
    for msg in failures:
        print("ERRO:", msg, file=sys.stderr)
    if failures:
        return 1
    print(f"OK: {len(paths)} pedido(s) validado(s); nenhum material foi publicado por este validador.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
