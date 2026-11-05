#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Camadas A, B e C da Fábrica AIx.

Camada A — Entrada docente: interpreta solicitação em linguagem natural (pt-BR),
sem exigir que o professor conheça programação.
Camada B — Recuperação curricular: consulta fontes reais do repositório
(banco-pedagogico/planejamentos, base-curricular) e NUNCA inventa habilidade.
Camada C — Orquestrador AEE/MACI: escolhe metodologia e planta pedagógica,
com justificativa em função do objetivo.

Nenhuma camada chama LLM: geração de conteúdo (Workflow 04) é estágio separado.
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]

ESCOLA_PADRAO = "ETE Bernardina Rodrigues Padilha"
ESCOLA_SLUG = "bernardina"  # diretório real em banco-pedagogico/planejamentos/

DISCIPLINAS = [
    ("práticas experimentais", "Práticas Experimentais"),
    ("praticas experimentais", "Práticas Experimentais"),
    ("estudos orientados", "Estudos Orientados"),
    ("ensino religioso", "Ensino Religioso"),
    ("erer", "ERER"),
    ("história", "História"),
    ("historia", "História"),
    ("matemática", "Matemática"),
    ("matematica", "Matemática"),
    ("ciências", "Ciências"),
    ("ciencias", "Ciências"),
    ("espanhol", "Espanhol"),
    ("português", "Português"),
    ("portugues", "Português"),
    ("cultura digital", "Cultura Digital"),
]

# Camada C: palavra-chave → (metodologia, modelo jogável, planta em biblioteca-arquiteturas)
METODOLOGIAS = [
    (r"investiga|fonte|document|arquivo|autora", "investigacao-documental", "document-investigation", "labirinto-evidencias.md"),
    (r"simul|decis|escolha|consequ", "simulacao-historica", "decision-simulator", "epc.md"),
    (r"laborat|experiment|medi|vari[áa]vel", "laboratorio-experimental", "virtual-lab", "svs.md"),
    (r"museu|exposi|explor|mapa|ambiente", "exploracao-espacial", "historical-museum", "aies.md"),
    (r"colaborat|equipe|grupo|junto", "resolucao-colaborativa", "collaborative-gincana", "associacoes.md"),
    (r"narrativa|personagem|di[áa]logo|história interativa", "narrativa-interativa", "interactive-narrative", "arn.md"),
    (r"alfabetiza|letra|palavra|s[íi]laba", "alfabetizacao", "association-literacy", "associacoes.md"),
]
METODOLOGIA_PADRAO = ("percursos-interativos", "percursos-interativos", "aee.md")


# ---------------------------------------------------------------- Camada A
def _normalizar_serie(texto):
    baixo = texto.lower()
    if re.search(r"3\s*[ºo°]?\s*ano.{0,20}(ensino m[ée]dio|\bem\b)|\b3\s*em\b", baixo):
        return "3º ano · EM"
    if re.search(r"2\s*[ºo°]?\s*ano.{0,20}(ensino m[ée]dio|\bem\b)|\b2\s*em\b", baixo):
        return "2º ano · EM"
    if re.search(r"1\s*[ºo°]?\s*ano.{0,20}(ensino m[ée]dio|\bem\b)|\b1\s*em\b", baixo):
        return "1º ano · EM"
    for numero in (9, 8, 7, 6, 5, 4, 3, 2, 1):
        if re.search(r"%d\s*[ºo°]\s*ano" % numero, baixo):
            return "%dº ano · EF" % numero
    if "eja" in baixo:
        return "EJA"
    return None


def parse_solicitacao(texto):
    """Extrai contexto docente de texto livre. Não inventa: campos ausentes voltam None."""
    baixo = texto.lower()
    turma = re.search(r"\b([0-9]{3})[a-z]?\b", texto)
    trimestre = re.search(r"([123])\s*[ºo°]?\s*(tri|semestre)", baixo)
    serie = _normalizar_serie(texto)
    disciplina = None
    for chave, nome in DISCIPLINAS:
        if chave in baixo:
            disciplina = nome
            break
    tema = None
    casou = re.search(r"\bsobre\s+([^,.;\n]{6,160})", texto, re.I)
    if casou:
        tema = casou.group(1).strip()
    return {
        "school": ESCOLA_PADRAO if ("bernardina" in baixo or serie or turma) else None,
        "grade": serie,
        "classroom": turma.group(1) if turma else None,
        "subject": disciplina,
        "term": int(trimestre.group(1)) if trimestre else None,
        "tema": tema,
        "flags": {
            "imersiva": bool(re.search(r"imersi", baixo)),
            "jogo2d": bool(re.search(r"jogo 2d|2d|jog[áa]vel", baixo)),
            "tridimensional": bool(re.search(r"3d|tridimensional", baixo)),
            "acessivel": bool(re.search(r"acess[íi]vel|acessibilidade", baixo)),
            "avaliacao": bool(re.search(r"avalia|registo|registro", baixo)),
            "investigacao": bool(re.search(r"investiga", baixo)),
        },
        "originalText": texto.strip(),
    }


# ---------------------------------------------------------------- Camada B
def _slug(texto):
    import unicodedata
    normalizado = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", normalizado.lower()).strip("-")


PADRAO_HABILIDADE = re.compile(r"\b(EF[0-9]{2}[A-Z]{2}[0-9]+|EM[0-9]{2}[A-Z]{2,3}[0-9]+)\b")


def recuperar_curriculo(solicitacao, raiz=None):
    """Localiza planejamento e extrai habilidades COM fonte; ausência vira pendência declarada."""
    raiz = Path(raiz) if raiz else RAIZ
    pacote = {
        "planejamento": None,
        "skills": [],
        "sources": [],
        "pending": True,
        "pendencias": [],
    }
    if not (solicitacao.get("classroom") and solicitacao.get("subject")):
        pacote["pendencias"].append("solicitação sem turma ou disciplina definidas")
        return pacote
    disciplina = _slug(solicitacao["subject"])
    trimestre = solicitacao.get("term") or 3
    caminhos = [
        raiz / "banco-pedagogico" / "planejamentos" / ESCOLA_SLUG / "2026"
        / ("%d-trimestre" % trimestre) / disciplina / ("turma-%s" % solicitacao["classroom"]) / "conteudo.md",
    ]
    planos = raiz / "base-curricular" / "PLANOS_DE_TURMA.md"
    if planos.exists():
        pacote["sources"].append({"path": "base-curricular/PLANOS_DE_TURMA.md", "kind": "base-curricular"})
    caminho = next((c for c in caminhos if c.exists()), None)
    if caminho is None:
        pacote["pendencias"].append(
            "planejamento não localizado em banco-pedagogico/planejamentos para turma %s (%s, %dº trimestre); "
            "validação curricular definitiva fica pendente de revisão docente" % (
                solicitacao["classroom"], solicitacao["subject"], trimestre
            )
        )
        return pacote
    relativo = caminho.relative_to(raiz).as_posix()
    pacote["planejamento"] = relativo
    pacote["sources"].append({"path": relativo, "kind": "planejamento"})
    texto = caminho.read_text(encoding="utf-8")
    # Cabeçalho do repositório adverte: transcrição sem certificação BNCC/RCG → confirmed=false.
    vistas = set()
    for numero_linha, linha in enumerate(texto.splitlines(), 1):
        for codigo in PADRAO_HABILIDADE.findall(linha):
            if codigo in vistas:
                continue
            vistas.add(codigo)
            pacote["skills"].append({
                "code": codigo,
                "description": linha.strip()[:200],
                "confirmed": False,
                "source": "pendente:transcricao do planejamento exige conferencia docente na fonte oficial (%s:%d)" % (relativo, numero_linha),
            })
    if not vistas:
        pacote["pendencias"].append("planejamento localizado sem habilidades citadas (%s)" % relativo)
    return pacote


# ---------------------------------------------------------------- Camada C
def planejar(solicitacao, curriculo):
    """Seleciona metodologia/planta com justificativa; a decisão final é docente."""
    tema = (solicitacao.get("tema") or "tema da solicitação").strip()
    alvo = " ".join(filter(None, [
        tema, solicitacao.get("subject"),
        "investigação" if solicitacao["flags"]["investigacao"] else "",
        "laboratório" if solicitacao["flags"].get("avaliacao") and "experimen" in tema.lower() else "",
    ])).lower()
    escolhido = None
    for padrao, metodo, modelo, planta in METODOLOGIAS:
        if re.search(padrao, alvo):
            escolhido = (metodo, modelo, planta)
            break
    if escolhido is None:
        escolhido = METODOLOGIA_PADRAO
    metodo, modelo, planta = escolhido
    caminho_planta = "biblioteca-arquiteturas/plantas/%s" % planta
    justificativa = (
        "A solicitação sobre \"%s\" pede %s. A metodologia %s foi selecionada porque organiza o percurso em "
        "Entender→Observar→Percursos→Explicar com ciclo Dado→Relação→Efeito→Limite, sustentando evidência de "
        "aprendizagem sem transformar permanência em prova. Planta pedagógica de referência: %s. "
        "A escolha é recomendação da fábrica e permanece sujeita à decisão docente."
        % (tema[:80], "investigação com fontes e registro" if metodo == "investigacao-documental" else "percurso interativo",
           metodo, caminho_planta)
    )
    return {
        "architecture": "AEE-MACI",
        "method": metodo,
        "plantRef": caminho_planta,
        "stages": ["entender", "observar", "percursos", "explicar"],
        "drel": ["dado", "relacao", "efeito", "limite"],
        "justification": justificativa,
        "template": modelo,
    }
