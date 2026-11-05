#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Teste de integração Supabase (Fase 5.7) — dados 100% sintéticos.

Prova que o formato de eventos adotado pelos motores AIx (sessão + registros)
é compatível com o pipeline de coleta EXISTENTE (edge function coleta-livre).
Envia UMA sessão e UM evento com nome explicitamente TESTE-SINTETICO — a
coleta-livre valida turma/professor contra a aula cadastrada, por isso usamos
a aula registrada 03-11-2026-historia-231 (turma 231). Nenhum dado de
estudante é usado; a sessão sintética fica marcada para descarte no painel.
A migração aix_001 NÃO é aplicada neste teste.
"""
import json
import sys
import uuid
import urllib.request

ENDPOINT = "https://ifyiarwygywoexsflfsx.supabase.co/functions/v1/coleta-livre"
ARTEFATO = "03-11-2026-historia-231"  # aula registrada na coleta (validação server-side)
SESSAO = str(uuid.uuid4())  # UUID v4 sintético, formato crypto.randomUUID()


def post(payload):
    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.status, json.loads(r.read().decode("utf-8"))


def principal():
    ok = True
    token = "ab" * 32

    # 1. iniciar sessão sintética (nome marca o descarte; turma/professor são os cadastrados)
    status, d1 = post({
        "acao": "iniciar", "artefato": ARTEFATO, "sessao_id": SESSAO, "token": token,
        "nome": "TESTE-SINTETICO-AIx-DESCARTAR", "turma": "231",
        "professor": "André de Oliveira Rodrigues",
    })
    print("iniciar ->", status, json.dumps(d1, ensure_ascii=False)[:160])
    ok &= status == 200 and d1.get("ok") is True and d1.get("estado") == "identificado"

    # 2. evento no formato coleta (tipos validados server-side; 'inicio' é o tipo
    #    de abertura usado pelas aulas — o contexto AIx vai em 'dados')
    evento = {
        "id": str(uuid.uuid4()),
        "sequencia": 0,
        "tipo": "inicio",
        "dados": {
            "origem": "fabrica-aix-v1-2-teste-sintetico",
            "experienceId": "hist-231-encruzilhadas",
            "ambiente": "mundo-dividido",
            "missoesConcluidas": 1, "missoesTotal": 9,
            "nota": "TESTE SINTETICO da fabrica AIx v1.2 — validar transporte do formato de eventos. Descartar esta sessao.",
        },
    }
    status, d2 = post({
        "acao": "eventos", "sessao_id": SESSAO, "token": token, "eventos": [evento],
    })
    print("eventos ->", status, json.dumps(d2, ensure_ascii=False)[:160])
    ok &= status == 200 and d2.get("ok") is True and d2.get("estado") == "recebido"

    print()
    if ok:
        print("INTEGRACAO_SUPABASE: OK (evento sintetico aceito pelo pipeline existente)")
        print("Sessao %s marcada TESTE-SINTETICO-AIx-DESCARTAR — descartavel no painel docente." % SESSAO)
        return 0
    print("INTEGRACAO_SUPABASE: FALHOU")
    return 1


if __name__ == "__main__":
    sys.exit(principal())
