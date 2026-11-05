#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testes do Contrato Universal AIx: o exemplo do piloto valida e mutações
hostis são rejeitadas (estrutura, segurança e semântica)."""
import copy
import json
import sys
import unittest
from pathlib import Path

AIX = Path(__file__).resolve().parents[1]
RAIZ = AIX.parent
sys.path.insert(0, str(AIX / "contracts"))
import validador  # noqa: E402

EXEMPLO = AIX / "experiences" / "historia" / "3o-ano-em" / "231" / "hist-231-encruzilhadas.json"


def validar(mutacao):
    return validador.validar_contrato(mutacao, str(RAIZ))


class TesteContrato(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not EXEMPLO.exists():
            raise unittest.SkipTest("execute antes: python3 aix/fabrica.py demo")
        cls.base = json.loads(EXEMPLO.read_text(encoding="utf-8"))

    def _m(self):
        return copy.deepcopy(self.base)

    def test_exemplo_piloto_valido(self):
        self.assertEqual(validar(self._m()), [])

    def test_campo_obrigatorio_ausente(self):
        d = self._m(); del d["experienceId"]
        self.assertTrue(any("experienceId" in e for e in validar(d)))

    def test_versao_incompativel(self):
        d = self._m(); d["schemaVersion"] = "2.0.0"
        self.assertTrue(any("schemaVersion" in e for e in validar(d)))

    def test_modo_acessivel_obrigatorio(self):
        d = self._m(); d["experience"]["modes"] = ["2d", "3d"]
        self.assertTrue(any("accessible" in e for e in validar(d)))

    def test_missao_aponta_ambiente_inexistente(self):
        d = self._m(); d["experience"]["missions"][0]["environmentId"] = "ambiente-fantasma"
        self.assertTrue(any("ambiente inexistente" in e for e in validar(d)))

    def test_ambiente_com_id_repetido(self):
        d = self._m(); d["experience"]["environments"][1]["id"] = d["experience"]["environments"][0]["id"]
        self.assertTrue(any("id repetido" in e for e in validar(d)))

    def test_habilidade_com_fonte_inexistente_marcada_como_confirmada(self):
        d = self._m()
        d["curriculum"]["skills"] = [{"code": "EM13CHS999", "confirmed": True, "source": "caminho/que/nao/existe.md"}]
        self.assertTrue(any("fonte rastreavel" in e or "inexistente" in e for e in validar(d)))

    def test_propriedade_de_codigo_e_rejeitada(self):
        d = self._m(); d["experience"]["script"] = "alert(1)"
        self.assertTrue(any("propriedade proibida" in e for e in validar(d)))

    def test_url_javascript_e_rejeitada(self):
        d = self._m(); d["experience"]["narrative"] = "Veja <a href='javascript:alert(1)'>isto</a>."
        self.assertTrue(any("javascript:" in e for e in validar(d)))

    def test_pendencia_exige_status_draft(self):
        d = self._m(); d["publication"]["status"] = "pending-approval"
        self.assertTrue(any("so e permitido 'draft'" in e for e in validar(d)))

    def test_pendencia_exige_blockers(self):
        d = self._m(); d["publication"]["blockers"] = []
        self.assertTrue(any("blockers" in e for e in validar(d)))

    def test_aprovado_exige_aprovador_data_sha(self):
        d = self._m(); d["publication"]["status"] = "approved"
        erros = validar(d)
        self.assertTrue(any("approvedBy" in e for e in erros))
        self.assertTrue(any("artifactSha256" in e for e in erros))

    def test_estagios_fora_de_ordem(self):
        d = self._m(); d["pedagogy"]["stages"] = ["observar", "entender", "percursos", "explicar"]
        self.assertTrue(any("Entender" in e for e in validar(d)))

    def test_drel_fora_de_ordem(self):
        d = self._m(); d["pedagogy"]["drel"] = ["limite", "dado", "relacao", "efeito"]
        self.assertTrue(any("Dado" in e for e in validar(d)))

    def test_justificativa_curta_demais(self):
        d = self._m(); d["pedagogy"]["justification"] = "porque sim"
        self.assertTrue(any("justification" in e for e in validar(d)))

    def test_padrao_de_turma(self):
        d = self._m(); d["curriculum"]["classroom"] = "23"
        self.assertTrue(any("classroom" in e for e in validar(d)))

    def test_trimestre_fora_do_enum(self):
        d = self._m(); d["curriculum"]["term"] = 5
        self.assertTrue(any("term" in e for e in validar(d)))

    def test_fonte_nao_verificada_bloqueia_publicacao(self):
        d = self._m()
        d["curriculum"]["pending"] = False
        d["curriculum"]["skills"] = []
        d["publication"]["status"] = "pending-approval"
        d["publication"]["blockers"] = ["outra pendencia qualquer"]
        self.assertTrue(any("fonte nao verificada" in e for e in validar(d)))

    # ---- mutações de dados de jogo (schema 1.1.0) ----

    def _env(self, d, idx=0):
        return d["experience"]["environments"][idx]

    def test_objeto_de_id_repetido(self):
        d = self._m()
        rep = copy.deepcopy(self._env(d)["objects"][1])
        rep["titulo"] = "duplicado em titulo apenas"
        self._env(d)["objects"][0]["id"] = rep["id"]
        self.assertTrue(any("objetos de id repetido" in e for e in validar(d)))

    def test_documento_nao_ficticio_sem_fonte(self):
        d = self._m()
        self._env(d)["objects"][0]["sourceId"] = "fonte-inexistente"
        self.assertTrue(any("sem fonte declarada valida" in e for e in validar(d)))

    def test_spawn_dentro_de_obstaculo(self):
        d = self._m()
        obs = self._env(d)["layout"]["obstacles"][0]
        self._env(d)["layout"]["spawn"] = {"x": obs["x"] + 5, "y": obs["y"] + 5}
        self.assertTrue(any("dentro do obstaculo" in e for e in validar(d)))

    def test_tarefa_coletar_aponta_objeto_inexistente(self):
        d = self._m()
        d["experience"]["missions"][0]["tasks"][0]["alvo"] = "obj-fantasma"
        self.assertTrue(any("aponta objeto inexistente" in e for e in validar(d)))

    def test_tarefa_comparar_sem_feedback(self):
        d = self._m()
        del d["experience"]["missions"][0]["tasks"][2]["feedbackErro"]
        self.assertTrue(any("feedbacks pedagogicos" in e for e in validar(d)))

    def test_tarefa_dialogar_fala_inexistente(self):
        d = self._m()
        d["experience"]["missions"][0]["tasks"][1]["fala"] = "f-fantasma"
        self.assertTrue(any("fala inexistente" in e for e in validar(d)))

    def test_versao_1_0_0_continua_aceita(self):
        d = self._m()
        d["schemaVersion"] = "1.0.0"
        self.assertEqual(validar(d), [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
