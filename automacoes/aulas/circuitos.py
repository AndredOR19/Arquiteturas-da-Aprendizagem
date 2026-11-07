#!/usr/bin/env python3
"""Contrato determinístico para mapas, cartões, pistas e retorno da última pista."""
from __future__ import annotations

AGE_BANDS = {"5-6", "7", "8-9", "medio"}
ROUTES = {"principal", "apoio-leitura", "aprender-outro-jeito"}


def build_circuit(doc: dict, lesson: dict) -> dict:
    """Deriva um circuito mínimo e rastreável do conteúdo curricular gerado.

    O motor permanece separado do conteúdo: esta função só cria IDs e vínculos
    determinísticos para que a pergunta nunca aponte para uma estação por texto.
    """
    serie = str(lesson.get("serie", "")).lower()
    if "médio" in serie or "medio" in serie or "em" in serie:
        age = "medio"
        skin = "investigacao-madura"
    elif "8" in serie or "9" in serie:
        age = "8-9"
        skin = "rpg-contemporaneo"
    elif "7" in serie:
        age = "7"
        skin = "transicao-rpg"
    else:
        age = "5-6"
        skin = "aventura-acolhedora"
    n = len(doc["percursos"])
    groups = [("preparar", 0, min(8, n)), ("relacionar", min(8, n), min(16, n)),
              ("conferir", min(16, n), min(24, n)), ("aplicar", min(24, n), n)]
    stations = []
    question_links = []
    for sid, start, end in groups:
        cards = []
        for i in range(start, end):
            p = doc["percursos"][i]
            cid = f"c-{i + 1:02d}"
            cards.append({
                "id": cid,
                "essential": p["explicacao"],
                "action": "observar e relacionar a evidência",
                "audioText": f"{p['contexto']} {p['explicacao']}",
            })
            question_links.append((i, sid, cid))
        stations.append({
            "id": f"s-{sid}",
            "title": sid.capitalize(),
            "objective": f"Explorar e aplicar a relação do bloco {sid}.",
            "action": "observar, comparar e justificar",
            "evidence": "uma explicação ligada à pergunta",
            "cards": cards,
        })
    questions = []
    for i, sid, cid in question_links:
        p = doc["percursos"][i]
        questions.append({
            "id": f"q-{i + 1:02d}",
            "concept": doc["conceito"],
            "evidenceCardIds": [cid],
            "hints": [
                {"level": 1, "kind": "orientar"},
                {"level": 2, "kind": "comparar", "cardId": cid},
                {"level": 3, "kind": "retorno", "targetStationId": f"s-{sid}", "targetCardId": cid},
            ],
        })
    return {
        "schemaVersion": "1.0",
        "lessonId": lesson["id"],
        "contentVersion": lesson.get("contentVersion", "1.0.0"),
        "visualProfile": {"ageBand": age, "theme": lesson.get("tema", "investigacao"), "skin": skin},
        "route": "principal",
        "stations": stations,
        "questions": questions,
    }


def validate_circuit(circuit: dict, expected_questions: int | None = None) -> dict:
    def fail(path: str, message: str):
        raise ValueError(f"Circuito inválido em {path}: {message}")
    if circuit.get("schemaVersion") != "1.0":
        fail("schemaVersion", "esperado 1.0")
    if circuit.get("route") not in ROUTES:
        fail("route", "rota desconhecida")
    profile = circuit.get("visualProfile")
    if not isinstance(profile, dict) or profile.get("ageBand") not in AGE_BANDS:
        fail("visualProfile.ageBand", "faixa etária ausente ou inválida")
    stations = circuit.get("stations")
    questions = circuit.get("questions")
    if not isinstance(stations, list) or not stations:
        fail("stations", "é obrigatória uma lista não vazia")
    if not isinstance(questions, list) or not questions:
        fail("questions", "é obrigatória uma lista não vazia")
    if expected_questions is not None and len(questions) != expected_questions:
        fail("questions", f"esperadas {expected_questions}, recebidas {len(questions)}")
    station_ids = [s.get("id") for s in stations]
    if any(not isinstance(x, str) or not x for x in station_ids) or len(set(station_ids)) != len(station_ids):
        fail("stations.id", "IDs ausentes ou duplicados")
    card_ids = set()
    card_station = {}
    for si, station in enumerate(stations):
        if not all(isinstance(station.get(k), str) and station[k] for k in ("id", "title", "objective", "action", "evidence")):
            fail(f"stations[{si}]", "campos obrigatórios ausentes")
        cards = station.get("cards")
        if not isinstance(cards, list) or not cards:
            fail(f"stations[{si}].cards", "estação sem cartão")
        for ci, card in enumerate(cards):
            cid = card.get("id")
            if not isinstance(cid, str) or not cid or cid in card_ids:
                fail(f"stations[{si}].cards[{ci}].id", "ID ausente ou duplicado")
            if not all(isinstance(card.get(k), str) and card[k] for k in ("essential", "action", "audioText")):
                fail(f"stations[{si}].cards[{ci}]", "conteúdo essencial ausente")
            card_ids.add(cid)
            card_station[cid] = station["id"]
    question_ids = [q.get("id") for q in questions]
    if any(not isinstance(x, str) or not x for x in question_ids) or len(set(question_ids)) != len(question_ids):
        fail("questions.id", "IDs ausentes ou duplicados")
    for qi, question in enumerate(questions):
        refs = question.get("evidenceCardIds")
        if not isinstance(refs, list) or not refs or any(x not in card_ids for x in refs):
            fail(f"questions[{qi}].evidenceCardIds", "cartão inexistente")
        hints = question.get("hints")
        if not isinstance(hints, list) or len(hints) < 3:
            fail(f"questions[{qi}].hints", "são necessárias três pistas graduadas")
        last = hints[-1]
        if last.get("kind") != "retorno" or last.get("targetCardId") not in card_ids or last.get("targetStationId") not in station_ids:
            fail(f"questions[{qi}].hints[-1]", "última pista sem alvo válido")
        if card_station[last["targetCardId"]] != last["targetStationId"]:
            fail(f"questions[{qi}].hints[-1]", "cartão e estação não correspondem")
    return circuit
