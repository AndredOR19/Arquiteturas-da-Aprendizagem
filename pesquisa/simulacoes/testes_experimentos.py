import unittest
import math
from quantico import simular, demonstracoes
from ux import executar, avaliar, POLITICAS


class CircuitosTest(unittest.TestCase):
    def test_probabilidades_analiticas(self):
        r = demonstracoes()
        for nome, esperado in [('superposicao', [.5, .5]), ('interferencia-retorno', [1, 0]),
                               ('interferencia-fase', [0, 1]), ('bell', [.5, 0, 0, .5])]:
            for a,b in zip(r[nome]['probabilidades'].values(), esperado):
                self.assertAlmostEqual(a,b,places=12)

    def test_fase_complexa_preservada(self):
        r=demonstracoes()['fase-complexa']
        self.assertAlmostEqual(r['amplitudes']['1'][1],1/math.sqrt(2))
        self.assertEqual(r['amplitudes']['1'][0],0)

    def test_ordem_bits_e_cx_reversa(self):
        r=simular(2,[{'porta':'X','alvo':1},{'porta':'CX','controle':1,'alvo':0}])
        self.assertEqual(r['probabilidades']['11'],1)
        self.assertEqual(simular(2,[{'porta':'X','alvo':1}])['probabilidades']['10'],1)

    def test_disparos_reprodutiveis_e_sem_estados_impossiveis(self):
        a=demonstracoes(); self.assertEqual(a, demonstracoes())
        bell=a['bell']; self.assertEqual(sum(bell['contagens'].values()),4096)
        self.assertEqual(bell['contagens']['01']+bell['contagens']['10'],0)
        self.assertLess(abs(bell['contagens']['00']/4096-.5),.04)

    def test_identidades_e_norma(self):
        for porta in ['H','X','Z']:
            r=simular(3,[{'porta':porta,'alvo':2}]*2)
            self.assertAlmostEqual(r['probabilidades']['000'],1)
            self.assertTrue(all(abs(n-1)<1e-12 for n in r['normas_por_etapa']))
        self.assertAlmostEqual(simular(1,[{'porta':'H','alvo':0}]+[{'porta':'S','alvo':0}]*4)['probabilidades']['0'],.5)

    def test_limites_e_entradas_invalidas(self):
        for qubits,portas,shots,seed in [(True,[],1,0),(9,[],1,0),(1,[],0,0),(1,[],1,-1),
            (1,[{'porta':'H','alvo':1}],1,0),(1,[{'porta':'CX','alvo':0,'controle':0}],1,0),
            (1,[{'porta':'H','alvo':False}],1,0),(1,[{'porta':'Q','alvo':0}],1,0),
            (1,[{'porta':'H','alvo':0,'url':'externo'}],1,0),(1,[{'porta':'X','alvo':0}]*257,1,0)]:
            with self.assertRaises(ValueError):simular(qubits,portas,shots,seed)


class PoliticasTest(unittest.TestCase):
    def test_grade_e_ausencia_de_conflitos_na_proposta(self):
        r=executar()['variantes']
        self.assertEqual(r['proposta-acessivel']['total_casos'],192)
        self.assertEqual(r['proposta-acessivel']['casos_com_conflito'],0)
        self.assertEqual(r['proposta-inicial']['casos_com_conflito'],186)

    def test_erro_recuperacao_nao_impede_conclusao(self):
        casos=executar()['variantes']['proposta-acessivel']['casos']
        for c in casos:
            entrada=c['entrada']
            self.assertEqual(c['final_liberado'],entrada['percursos']==26 and entrada['devolutiva_confirmada'])

    def test_mutacao_de_cada_recurso_e_detectada(self):
        caso=dict(somente_teclado=True,sem_voz=True,movimento_reduzido=True,
            sem_colega=True,revisou_apos_erro=True,percursos=26,devolutiva_confirmada=True)
        for chave in POLITICAS['proposta-acessivel']:
            politica=dict(POLITICAS['proposta-acessivel']); politica[chave]=False
            self.assertEqual(len(avaliar(politica,caso)['falhas']),1)


class InventarioFormalTest(unittest.TestCase):
    def test_cobertura_formal_separada_de_mecanismo_pedagogico(self):
        from inventario import construir
        inv=construir()
        q=next(a for a in inv['arquiteturas'] if a['id']=='simulacoes-quanticas')
        self.assertEqual(q['dominio'],'formal')
        self.assertEqual(q['modulos_formais'],['quantico-ideal'])
        self.assertEqual(q['modulos_mecanisticos'],[])
        self.assertFalse(q['validacao_empirica'])


if __name__=='__main__':unittest.main(verbosity=2)
