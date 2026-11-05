#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fábrica AIx — núcleo determinístico da orquestração.

Pipeline local (sem LLM, sem rede, sem credenciais):
  solicitar → [Camada A] interpretar → [Camada B] recuperar currículo real
            → [Camada C] planejar metodologia → [Camada D] montar contrato
            → validar (estrutura + segurança + semântica) → registrar (idempotente)

A geração de CONTEÚDO (textos, missões, fontes) é o Workflow 04 e entra por
--conteudo (JSON), produzido por agente/LLM ou pelo professor — nunca embutido aqui.

Uso:
  python3 aix/fabrica.py solicitar --texto "..." [--id slug] [--conteudo arquivo.json]
  python3 aix/fabrica.py validar aix/experiences/.../contrato.json
  python3 aix/fabrica.py demo
"""
import argparse
import hashlib
import json
import subprocess
import sys
from datetime import date
from pathlib import Path

AIX = Path(__file__).resolve().parent
RAIZ = AIX.parent
sys.path.insert(0, str(AIX))
sys.path.insert(0, str(AIX / "contracts"))

import camadas  # noqa: E402
import validador  # noqa: E402

PIPELINE = "1.2.0"

DEMO = ("Crie uma aula imersiva de História para a turma 231 do 3º ano do Ensino Médio, "
        "3º trimestre, sobre Guerra Fria, ditadura militar brasileira e redemocratização, "
        "com investigação documental, jogo 2D, ambiente 3D opcional, avaliação e versão acessível.")


def _sha(dados):
    return hashlib.sha256(json.dumps(dados, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()


def _esqueleto_conteudo():
    """Quando o Workflow 04 ainda não rodou: estrutura honesta, sem invenção de conteúdo."""
    return {
        "environments": [{
            "id": "ambiente-inicial",
            "title": "Ambiente inicial (esqueleto)",
            "scenario": "Conteúdo narrativo a ser produzido no Workflow 04 (geração de conteúdo) e revisado pelo professor antes de qualquer publicação.",
            "interactions": ["Explorar o ambiente após aprovação do conteúdo pelo professor"],
        }],
        "missions": [{
            "id": "missao-inicial",
            "environmentId": "ambiente-inicial",
            "title": "Missão inicial (esqueleto)",
            "objective": "Definir com o professor o objetivo de aprendizagem específico desta missão.",
            "clues": ["Pistas serão definidas junto ao conteúdo do Workflow 04"],
            "evidence": "Evidência de aprendizagem a ser especificada com revisão docente.",
        }],
        "sources": [],
    }


def solicitar(texto, id_contrato=None, caminho_conteudo=None):
    pedido = camadas.parse_solicitacao(texto)
    if not pedido["classroom"]:
        raise ValueError(
            "solicitação sem turma identificada: a fábrica não inventa contexto; "
            "pedir ao professor escola/turma/_componente antes de gerar o contrato"
        )
    curriculo = camadas.recuperar_curriculo(pedido)
    plano = camadas.planejar(pedido, curriculo)

    conteudo = _esqueleto_conteudo()
    if caminho_conteudo:
        conteudo = json.loads(Path(caminho_conteudo).read_text(encoding="utf-8"))

    pendencias = list(curriculo["pendencias"])
    pendencias += ["habilidades extraídas do planejamento aguardam conferência docente na fonte oficial"] if curriculo["skills"] else []
    pendencias += ["habilidade curricular sem confirmação para esta turma"] if not curriculo["skills"] else []
    pendencias += ["fontes documentais ainda não verificadas pelo professor"] if any(not f.get("verified", False) for f in conteudo.get("sources", [])) else []
    pendencias += ["conteúdo em esqueleto: aguardando Workflow 04 (geração de conteúdo)"] if not caminho_conteudo else []

    contrato = {
        "schemaVersion": "1.1.0",
        "experienceId": id_contrato or _derive_id(pedido),
        "generated": {"by": "aix-fabrica", "pipelineVersion": PIPELINE},
        "request": {
            "originalText": pedido["originalText"],
            "requestId": "req-%s" % hashlib.sha256(
                (pedido["originalText"] + "|" + (id_contrato or "")).encode("utf-8")
            ).hexdigest()[:12],
            "receivedAt": date.today().isoformat(),
        },
        "curriculum": {
            "school": pedido["school"] or camadas.ESCOLA_PADRAO,
            "grade": pedido["grade"] or "a definir",
            "classroom": pedido["classroom"] or "000",
            "subject": pedido["subject"] or "Componente a definir",
            "term": pedido["term"] or 3,
            "skills": curriculo["skills"],
            "sources": curriculo["sources"],
            "pending": True,
        },
        "pedagogy": {k: plano[k] for k in ("architecture", "method", "plantRef", "stages", "drel", "justification")},
        "experience": {
            "template": plano["template"],
            "modes": ["accessible"] + (["2d"] if pedido["flags"]["jogo2d"] or pedido["flags"]["imersiva"] or _tem_jogo(conteudo) else []) + (["3d"] if pedido["flags"]["tridimensional"] or _tem_jogo(conteudo) else []),
            "narrative": conteudo.get("narrative", ""),
            "environments": conteudo["environments"],
            "missions": conteudo["missions"],
            "sources": conteudo.get("sources", []),
        },
        "assessment": {"strategy": "formativa", "teacherReview": True, "evidenceEvents": "coleta-livre"},
        "accessibility": {
            "wcag": "2.2-AA",
            "features": ["teclado", "leitor-de-tela", "contraste", "ajuste-de-fonte", "reducao-de-movimento",
                         "instrucoes-claras", "controle-de-audio", "apoio-imagens-voz"],
            "imageLearning": True,
        },
        "publication": {"status": "draft", "requiresApproval": True, "blockers": pendencias},
    }
    if not contrato["experience"]["modes"] or "accessible" not in contrato["experience"]["modes"]:
        contrato["experience"]["modes"] = ["accessible"]
    return contrato, pedido


def _derive_id(pedido):
    base = "aula-%s-%s" % (pedido.get("classroom") or "turma", camadas._slug(pedido.get("subject") or "componente"))
    return base[:64]


def _tem_jogo(conteudo):
    """Conteúdo com dados de jogo (layout+objects em >=1 ambiente) é jogável em 2D e 3D."""
    return any(a.get("layout") and a.get("objects") for a in conteudo.get("environments", []))


def gravar(contrato, pedido):
    erros = validador.validar_contrato(contrato, str(RAIZ))
    if erros:
        return None, erros
    destino_dir = AIX / "experiences" / camadas._slug(contrato["curriculum"]["subject"]) / camadas._slug(contrato["curriculum"]["grade"]) / contrato["curriculum"]["classroom"]
    destino_dir.mkdir(parents=True, exist_ok=True)
    destino = destino_dir / ("%s.json" % contrato["experienceId"])
    carga = _sha(contrato)
    registro = {
        "requestId": contrato["request"]["requestId"],
        "receivedAt": contrato["request"]["receivedAt"],
        "experienceId": contrato["experienceId"],
        "contractPath": destino.relative_to(RAIZ).as_posix(),
        "sha256": carga,
        "blockers": contrato["publication"]["blockers"],
        "planning": next((s["path"] for s in contrato["curriculum"]["sources"] if s["kind"] == "planejamento"), None),
    }
    if destino.exists():
        anterior = json.loads(destino.read_text(encoding="utf-8"))
        if _sha(anterior) == carga:
            registro["resultado"] = "inalterado (idempotente)"
            return registro, []
        registro["resultado"] = "atualizado"
    else:
        registro["resultado"] = "criado"
    destino.write_text(json.dumps(contrato, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (AIX / "jobs").mkdir(exist_ok=True)
    tarefa = AIX / "jobs" / ("%s-%s.json" % (contrato["request"]["receivedAt"], contrato["experienceId"]))
    tarefa.write_text(json.dumps(registro, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return registro, []


def principal():
    parser = argparse.ArgumentParser(description="Fábrica AIx — núcleo determinístico")
    sub = parser.add_subparsers(dest="comando", required=True)
    p1 = sub.add_parser("solicitar", help="solicitação docente em linguagem natural")
    p1.add_argument("--texto", required=True)
    p1.add_argument("--id", default=None)
    p1.add_argument("--conteudo", default=None)
    p2 = sub.add_parser("validar", help="valida um contrato existente")
    p2.add_argument("arquivo")
    p3 = sub.add_parser("construir", help="solicitação docente → contrato → prévias (acessível, 2D, 3D)")
    p3.add_argument("--texto", required=True)
    p3.add_argument("--id", default=None)
    p3.add_argument("--conteudo", required=True)
    p3.add_argument("--motores", default="acessivel,phaser,3d")
    sub.add_parser("demo", help="executa a solicitação-piloto da turma 231")
    args = parser.parse_args()

    if args.comando == "validar":
        dados = json.loads(Path(args.arquivo).read_text(encoding="utf-8"))
        erros = validador.validar_contrato(dados, str(RAIZ))
        if erros:
            print("INVALIDO (%d problema[s]):" % len(erros))
            for erro in erros:
                print("  -", erro)
            return 1
        print("VALIDO: contrato AIx 1.1.0 integral (estrutura, seguranca e semantica)")
        return 0

    if args.comando == "construir":
        try:
            contrato, pedido = solicitar(args.texto, args.id, args.conteudo)
        except ValueError as exc:
            print("SOLICITACAO INCOMPLETA: %s" % exc)
            return 1
        registro, erros = gravar(contrato, pedido)
        if erros:
            print("CONTRATO INVALIDO (%d problema[s]):" % len(erros))
            for erro in erros:
                print("  -", erro)
            return 1
        print("CONTRATO_OK %s (sha256 %s, %d bloqueio[s])" % (registro["contractPath"], registro["sha256"][:16], len(registro["blockers"])))
        caminho = str(RAIZ / registro["contractPath"])
        motores = [m.strip() for m in args.motores.split(",") if m.strip()]
        if "acessivel" in motores:
            r = subprocess.run([sys.executable, str(AIX / "engines" / "accessible" / "gerar.py"), caminho])
            if r.returncode != 0:
                return 1
        if "phaser" in motores:
            r = subprocess.run([sys.executable, str(AIX / "engines" / "phaser-2d" / "gerar.py"), caminho])
            if r.returncode != 0:
                return 1
        if "3d" in motores:
            r = subprocess.run([sys.executable, str(AIX / "engines" / "three-3d" / "gerar3d.py"), caminho])
            if r.returncode != 0:
                return 1
        print("CONSTRUIDO: %s" % ", ".join(motores))
        return 0

    if args.comando == "demo":
        args.texto, args.id, args.conteudo = (
            DEMO, "hist-231-encruzilhadas",
            str(AIX / "experiences" / "historia" / "3em" / "231" / "conteudo-encruzilhadas.json"),
        )
        if not Path(args.conteudo).exists():
            print("demo: arquivo de conteudo ausente: %s" % args.conteudo)
            return 1

    try:
        contrato, pedido = solicitar(args.texto, args.id, args.conteudo)
    except ValueError as exc:
        print("SOLICITACAO INCOMPLETA: %s" % exc)
        return 1
    registro, erros = gravar(contrato, pedido)
    if erros:
        print("CONTRATO INVALIDO (%d problema[s]):" % len(erros))
        for erro in erros:
            print("  -", erro)
        return 1
    print(json.dumps(registro, ensure_ascii=False, indent=2))
    print("interpretado:", json.dumps({k: pedido[k] for k in ("school", "grade", "classroom", "subject", "term", "tema")}, ensure_ascii=False))
    print("pendencias bloqueantes: %d" % len(registro["blockers"]))
    for pendencia in registro["blockers"]:
        print("  [pendente]", pendencia)
    return 0


if __name__ == "__main__":
    sys.exit(principal())
