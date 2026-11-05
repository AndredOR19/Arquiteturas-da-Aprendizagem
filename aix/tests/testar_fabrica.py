#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testes de ponta a ponta da Fábrica AIx (Fase 1): solicitação em linguagem
natural → contrato validado, com currículo REAL do repositório e pendências
declaradas — nunca inventadas."""
import json
import sys
import unittest
from pathlib import Path

AIX = Path(__file__).resolve().parents[1]
RAIZ = AIX.parent
sys.path.insert(0, str(AIX))
sys.path.insert(0, str(AIX / "contracts"))
import camadas  # noqa: E402
import fabrica  # noqa: E402
import validador  # noqa: E402

CONTEUDO_231 = AIX / "experiences" / "historia" / "3em" / "231" / "conteudo-encruzilhadas.json"


class TesteCamadaA(unittest.TestCase):
    def test_piloto_e_interpretado(self):
        pedido = camadas.parse_solicitacao(fabrica.DEMO)
        self.assertEqual(pedido["classroom"], "231")
        self.assertEqual(pedido["grade"], "3º ano · EM")
        self.assertEqual(pedido["subject"], "História")
        self.assertEqual(pedido["term"], 3)
        self.assertIn("guerra fria", pedido["tema"].lower())
        self.assertTrue(pedido["flags"]["investigacao"])
        self.assertTrue(pedido["flags"]["acessivel"])


class TesteCamadaB(unittest.TestCase):
    def test_turma_231_sem_planejamento_vira_pendencia(self):
        pedido = camadas.parse_solicitacao(fabrica.DEMO)
        pacote = camadas.recuperar_curriculo(pedido)
        self.assertTrue(pacote["pending"])
        self.assertEqual(pacote["skills"], [])
        self.assertTrue(any("planejamento não localizado" in p for p in pacote["pendencias"]))

    def test_turma_192_recupera_habilidades_com_fonte(self):
        pedido = camadas.parse_solicitacao(
            "Crie uma aula de História para a turma 192 do 9º ano, 3º trimestre, "
            "sobre descolonização da África e da Ásia na Guerra Fria"
        )
        pacote = camadas.recuperar_curriculo(pedido)
        self.assertIsNotNone(pacote["planejamento"])
        self.assertIn("banco-pedagogico/planejamentos/bernardina/2026/3-trimestre/historia/turma-192", pacote["planejamento"])
        self.assertGreaterEqual(len(pacote["skills"]), 1)
        self.assertIn("EF09HI28", [s["code"] for s in pacote["skills"]])
        for habilidade in pacote["skills"]:
            self.assertFalse(habilidade["confirmed"], "transcricao de planejamento nunca e codigo confirmado")
            self.assertTrue((RAIZ / pacote["planejamento"]).exists())


class TesteFabrica(unittest.TestCase):
    def test_piloto_gera_contrato_valido_com_pendencias(self):
        contrato, pedido = fabrica.solicitar(fabrica.DEMO, "hist-231-encruzilhadas", str(CONTEUDO_231))
        self.assertEqual(contrato["experienceId"], "hist-231-encruzilhadas")
        self.assertEqual(validador.validar_contrato(contrato, str(RAIZ)), [])
        self.assertEqual(contrato["publication"]["status"], "draft")
        self.assertTrue(contrato["curriculum"]["pending"])
        self.assertTrue(any("planejamento" in b for b in contrato["publication"]["blockers"]))
        self.assertEqual(len(contrato["experience"]["environments"]), 3)
        self.assertEqual(len(contrato["experience"]["missions"]), 9)
        self.assertIn("accessible", contrato["experience"]["modes"])
        self.assertEqual(contrato["pedagogy"]["method"], "investigacao-documental")

    def test_solicitacao_sem_turma_e_rejeitada(self):
        with self.assertRaises(ValueError):
            fabrica.solicitar("Crie uma aula sobre fotossíntese com jogo e avaliação")

    def test_idempotencia_mesma_solicitacao_mesmo_hash(self):
        c1, _ = fabrica.solicitar(fabrica.DEMO, "hist-231-encruzilhadas", str(CONTEUDO_231))
        c2, _ = fabrica.solicitar(fabrica.DEMO, "hist-231-encruzilhadas", str(CONTEUDO_231))
        self.assertEqual(fabrica._sha(c1), fabrica._sha(c2))

    def test_esqueleto_sem_conteudo_continua_valido_e_declarado(self):
        contrato, _ = fabrica.solicitar(
            "Crie uma aula de História para a turma 231, 3º trimestre, sobre Guerra Fria com investigação",
            "hist-231-esqueleto",
        )
        self.assertEqual(validador.validar_contrato(contrato, str(RAIZ)), [])
        self.assertTrue(any("esqueleto" in b for b in contrato["publication"]["blockers"]))


if __name__ == "__main__":
    unittest.main(verbosity=2)
