#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Validador do Contrato Universal AIx.

Três barreiras, sem dependências externas:
  1. Estrutura — subconjunto do JSON Schema draft-07 (type, properties, required,
     additionalProperties, items, enum, const, pattern, minLength/maxLength, minItems).
  2. Segurança — nenhuma propriedade pode carregar código (script/eval/handlers etc.)
     e nenhuma string pode conter URL javascript:.
  3. Semântica pedagógica — integridade referencial das missões, ordem dos estágios
     E-O-P-E e D-R-E-L, modo acessível obrigatório, pendências curriculares e de
     fontes bloqueando publicação, aprovação vinculada a aprovador + data + sha256.

Uso:
  python3 aix/contracts/validador.py <contrato.json> [--root DIRETORIO_DO_REPO]
Saída: relatório e código de saída 0 (válido) ou 1 (inválido).
"""
import argparse
import json
import re
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
PROPRIEDADES_PROIBIDAS = {
    "script", "javascript", "code", "eval", "exec", "innerhtml", "srcdoc",
    "onload", "onerror", "onclick", "onchange", "onmouseover",
}
TIPOS = {"object": dict, "array": list, "string": str, "boolean": bool, "number": (int, float), "integer": int}


# ---------------------------------------------------------------- segurança
def varrer_seguranca(no, caminho="$", erros=None):
    if erros is None:
        erros = []
    if isinstance(no, dict):
        for chave, valor in no.items():
            if str(chave).lower() in PROPRIEDADES_PROIBIDAS:
                erros.append(
                    "seguranca: propriedade proibida '%s' em %s (o contrato carrega "
                    "dados, nunca codigo)" % (chave, caminho)
                )
            if isinstance(valor, str) and "javascript:" in valor.strip().lower():
                erros.append("seguranca: URL javascript: em %s.%s" % (caminho, chave))
            varrer_seguranca(valor, "%s.%s" % (caminho, chave), erros)
    elif isinstance(no, list):
        for indice, valor in enumerate(no):
            varrer_seguranca(valor, "%s[%d]" % (caminho, indice), erros)
    return erros


# ---------------------------------------------------------------- estrutura
def _tipo_ok(no, esperado):
    alvo = TIPOS.get(esperado)
    if alvo is None:
        return False, "tipo nao suportado pelo validador: %s" % esperado
    if esperado in ("number", "integer"):
        return isinstance(no, int) and not isinstance(no, bool) or isinstance(no, float) and esperado == "number", None
    return isinstance(no, alvo), None


def validar(no, esq, caminho="$", erros=None):
    if erros is None:
        erros = []
    if not isinstance(esq, dict):
        return erros
    esperado = esq.get("type")
    if esperado:
        ok, motivo = _tipo_ok(no, esperado)
        if not ok:
            erros.append("%s: esperado %s, encontrado %s" % (caminho, esperado, type(no).__name__))
            return erros
    if "const" in esq and no != esq["const"]:
        erros.append("%s: deve ser exatamente %r" % (caminho, esq["const"]))
    if "enum" in esq and no not in esq["enum"]:
        erros.append("%s: valor %r fora do permitido %s" % (caminho, no, esq["enum"]))
    if isinstance(no, str):
        if "pattern" in esq and not re.search(esq["pattern"], no):
            erros.append("%s: %r nao atende ao padrao %s" % (caminho, no, esq["pattern"]))
        if "minLength" in esq and len(no) < esq["minLength"]:
            erros.append("%s: tamanho %d abaixo do minimo %d" % (caminho, len(no), esq["minLength"]))
        if "maxLength" in esq and len(no) > esq["maxLength"]:
            erros.append("%s: tamanho %d acima do maximo %d" % (caminho, len(no), esq["maxLength"]))
    if isinstance(no, list):
        if "minItems" in esq and len(no) < esq["minItems"]:
            erros.append("%s: %d itens, minimo %d" % (caminho, len(no), esq["minItems"]))
        if "maxItems" in esq and len(no) > esq["maxItems"]:
            erros.append("%s: %d itens, maximo %d" % (caminho, len(no), esq["maxItems"]))
        if esq.get("uniqueItems") and len(no) != len(set(map(json.dumps, no))):
            erros.append("%s: itens repetidos" % caminho)
        if "items" in esq:
            for indice, item in enumerate(no):
                validar(item, esq["items"], "%s[%d]" % (caminho, indice), erros)
    if isinstance(no, dict):
        for campo in esq.get("required", []):
            if campo not in no:
                erros.append("%s: campo obrigatorio ausente '%s'" % (caminho, campo))
        propriedades = esq.get("properties", {})
        for chave, valor in no.items():
            if chave in propriedades:
                validar(valor, propriedades[chave], "%s.%s" % (caminho, chave), erros)
            elif esq.get("additionalProperties") is False:
                erros.append("%s: propriedade nao prevista '%s'" % (caminho, chave))
    return erros


# ---------------------------------------------------------------- semântica
def regras_semanticas(c, raiz, erros=None):
    if erros is None:
        erros = []
    exp = c.get("experience", {})
    curr = c.get("curriculum", {})
    publ = c.get("publication", {})

    # 1. toda experiência oferece modo acessível (Prompt Mestre AIx §8)
    if "accessible" not in exp.get("modes", []):
        erros.append("semantica: experience.modes precisa incluir 'accessible'")

    # 2. integridade referencial e unicidade
    ambientes = exp.get("environments", [])
    ids_ambiente = [a.get("id") for a in ambientes]
    if len(ids_ambiente) != len(set(ids_ambiente)):
        erros.append("semantica: ambientes com id repetido")
    for missao in exp.get("missions", []):
        if missao.get("environmentId") not in ids_ambiente:
            erros.append(
                "semantica: missao '%s' aponta ambiente inexistente '%s'"
                % (missao.get("id"), missao.get("environmentId"))
            )
    ids_missao = [m.get("id") for m in exp.get("missions", [])]
    if len(ids_missao) != len(set(ids_missao)):
        erros.append("semantica: missoes com id repetido")
    ids_fonte = [f.get("id") for f in exp.get("sources", [])]
    if len(ids_fonte) != len(set(ids_fonte)):
        erros.append("semantica: fontes com id repetido")

    # 3. movimentos pedagógicos na ordem definida
    ped = c.get("pedagogy", {})
    if ped.get("stages") and ped["stages"] != ["entender", "observar", "percursos", "explicar"]:
        erros.append("semantica: stages deve seguir Entender→Observar→Percursos→Explicar")
    if ped.get("drel") and ped["drel"] != ["dado", "relacao", "efeito", "limite"]:
        erros.append("semantica: drel deve seguir Dado→Relação→Efeito→Limite")

    # 4. pendências curriculares e de fontes bloqueiam publicação
    pendencias = []
    if curr.get("pending"):
        pendencias.append("curriculum.pending")
    for hab in curr.get("skills", []):
        if not hab.get("confirmed", False):
            pendencias.append("habilidade nao confirmada: %s" % hab.get("code"))
    for fonte in exp.get("sources", []):
        if not fonte.get("verified", False):
            pendencias.append("fonte nao verificada: %s" % fonte.get("id"))
    if pendencias and publ.get("status") != "draft":
        erros.append(
            "semantica: existem pendencias (%s) e o status de publicacao e '%s'; "
            "so e permitido 'draft' ate resolucao docente" % (", ".join(pendencias[:4]), publ.get("status"))
        )
    if pendencias and not publ.get("blockers"):
        erros.append("semantica: pendencias exigem publication.blockers declarados")

    # 5. aprovação vinculada a aprovador, data e hash do artefato
    if publ.get("status") in ("approved", "published"):
        for campo in ("approvedBy", "approvedAt", "artifactSha256"):
            if not publ.get(campo):
                erros.append("semantica: status '%s' exige publication.%s" % (publ["status"], campo))

    # 6. fontes curriculares rastreáveis em disco (quando apontam caminho do repo)
    raiz_dir = Path(raiz) if raiz else AQUI.parents[2]
    for fonte in curr.get("sources", []):
        caminho = fonte.get("path", "")
        if caminho and not caminho.startswith(("docente:", "pendente:")):
            if not (raiz_dir / caminho).exists():
                erros.append("semantica: fonte curricular inexistente no repo: %s" % caminho)
    for hab in curr.get("skills", []):
        origem = hab.get("source", "")
        if origem and not origem.startswith(("docente:", "pendente:")) and hab.get("confirmed"):
            if not (raiz_dir / origem).exists():
                erros.append("semantica: habilidade confirmada sem fonte rastreavel: %s" % origem)

    # 7. dados de jogo (opcional na 1.0.0; exigem integridade total quando presentes)
    fontes_exp = {f.get("id") for f in exp.get("sources", [])}
    for amb in ambientes:
        aid = amb.get("id")
        objetos = amb.get("objects") or []
        personagens = amb.get("characters") or []
        layout = amb.get("layout")
        ids_obj = [o.get("id") for o in objetos]
        if len(ids_obj) != len(set(ids_obj)):
            erros.append("semantica: ambiente '%s' com objetos de id repetido" % aid)
        ids_char = [p.get("id") for p in personagens]
        if len(ids_char) != len(set(ids_char)):
            erros.append("semantica: ambiente '%s' com personagens de id repetido" % aid)
        for fala_id in [f.get("id") for p in personagens for f in p.get("falas", [])]:
            pass  # unicidade de falas verificada por personagem abaixo
        for p in personagens:
            ids_fala = [f.get("id") for f in p.get("falas", [])]
            if len(ids_fala) != len(set(ids_fala)):
                erros.append("semantica: personagem '%s' com falas de id repetido" % p.get("id"))
        if layout:
            for obst in layout.get("obstacles", []):
                sx, sy = layout["spawn"]["x"], layout["spawn"]["y"]
                if obst["x"] <= sx <= obst["x"] + obst["w"] and obst["y"] <= sy <= obst["y"] + obst["h"]:
                    erros.append("semantica: spawn do ambiente '%s' dentro do obstaculo '%s'" % (aid, obst.get("label", "?")))
            if layout["spawn"]["x"] > layout["bounds"]["w"] or layout["spawn"]["y"] > layout["bounds"]["h"]:
                erros.append("semantica: spawn fora dos limites no ambiente '%s'" % aid)
        for obj in objetos:
            if obj.get("tipo") == "documento" and not obj.get("fictional", False):
                if obj.get("sourceId") not in fontes_exp:
                    erros.append(
                        "semantica: documento '%s' nao-ficticio sem fonte declarada valida (sourceId)"
                        % obj.get("id")
                    )
            if layout and (obj["x"] > layout["bounds"]["w"] or obj["y"] > layout["bounds"]["h"]):
                erros.append("semantica: objeto '%s' fora dos limites do ambiente '%s'" % (obj.get("id"), aid))
    objetos_por_amb = {a.get("id"): {o.get("id") for o in (a.get("objects") or [])} for a in ambientes}
    chars_por_amb = {}
    for a in ambientes:
        chars_por_amb[a.get("id")] = {p.get("id"): {f.get("id") for f in p.get("falas", [])} for p in (a.get("characters") or [])}
    for missao in exp.get("missions", []):
        for tarefa in missao.get("tasks", []):
            tipo, alvo = tarefa.get("tipo"), tarefa.get("alvo")
            if tipo == "coletar" and alvo not in objetos_por_amb.get(missao.get("environmentId"), set()):
                erros.append("semantica: tarefa 'coletar' da missao '%s' aponta objeto inexistente '%s'" % (missao.get("id"), alvo))
            if tipo == "dialogar":
                falas = chars_por_amb.get(missao.get("environmentId"), {}).get(alvo, set())
                if alvo not in chars_por_amb.get(missao.get("environmentId"), {}):
                    erros.append("semantica: tarefa 'dialogar' da missao '%s' aponta personagem inexistente '%s'" % (missao.get("id"), alvo))
                elif tarefa.get("fala") and tarefa["fala"] not in falas:
                    erros.append("semantica: tarefa 'dialogar' da missao '%s' aponta fala inexistente '%s'" % (missao.get("id"), tarefa.get("fala")))
            if tipo == "comparar":
                opcoes = tarefa.get("opcoes") or []
                correta = tarefa.get("correta")
                if len(opcoes) < 2 or not isinstance(correta, int) or not (0 <= correta < len(opcoes)):
                    erros.append("semantica: tarefa 'comparar' da missao '%s' exige >=2 opcoes e 'correta' valida" % missao.get("id"))
                if not tarefa.get("pergunta") or not tarefa.get("feedbackAcerto") or not tarefa.get("feedbackErro"):
                    erros.append("semantica: tarefa 'comparar' da missao '%s' exige pergunta e feedbacks pedagogicos" % missao.get("id"))
    return erros


# ---------------------------------------------------------------- orquestração
def validar_contrato(dados, raiz=None):
    esquema = json.loads((AQUI / "aix-experience.schema.json").read_text(encoding="utf-8"))
    erros = []
    erros += validar(dados, esquema)
    erros += varrer_seguranca(dados)
    erros += regras_semanticas(dados, raiz)
    return erros


def main():
    parser = argparse.ArgumentParser(description="Valida um contrato AIx")
    parser.add_argument("arquivo")
    parser.add_argument("--root", default=None)
    args = parser.parse_args()
    try:
        dados = json.loads(Path(args.arquivo).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print("INVALIDO: %s" % exc)
        return 1
    erros = validar_contrato(dados, args.root)
    if erros:
        print("INVALIDO (%d problema[s]):" % len(erros))
        for erro in erros:
            print("  -", erro)
        return 1
    print("VALIDO: contrato AIx 1.0.0 integral (estrutura, seguranca e semantica)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
