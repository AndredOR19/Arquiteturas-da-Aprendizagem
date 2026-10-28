#!/usr/bin/env python3
"""Ensaios com dados fictícios, sem estudantes reais."""
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
import banco


class BancoTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.folder = Path(self.tmp.name) / 'base'
        banco.inicializar(self.folder)
        self.a, self.b = banco.cadastrar(self.folder, [
            {'nome_oficial':'Participante Fictício','fonte_lista':'fixture'},
            {'nome_oficial':'Participante Fictício','fonte_lista':'fixture'}])

    def tearDown(self):
        self.tmp.cleanup()

    def matricula(self, aid=None, year=2026, serie='1', anterior=None):
        return banco.matricular(self.folder, {
            'aluno_id':aid or self.a,'ano_letivo':year,'escola_id':'ESCOLA-FICTICIA',
            'turma':'T-FICTICIA','etapa':'Etapa fictícia','serie':serie,
            'inicio':f'{year}-02-01','fim':f'{year}-12-31','situacao':'cursando',
            'fonte_confirmacao':'fixture','anterior_id':anterior})

    def preparar_sessao(self, mid, aid=None, date='2026-10-28', sid='SESSAO-TESTE'):
        with banco.abrir(self.folder) as db:
            db.execute('INSERT OR IGNORE INTO protocolos VALUES (?,?,?,?,?)',
                       ('PROTOCOLO-TESTE','0.1.0','pergunta fictícia','hipótese fictícia','{}'))
            db.execute('INSERT INTO sessoes VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                       (sid,aid or self.a,mid,date,'teste','artefato-ficticio','0.1','2.10.0',
                        'PROTOCOLO-TESTE','0.1.0','{}'))

    def test_homonimos_tem_ids_distintos_e_nome_fora_da_base_de_medidas(self):
        self.assertNotEqual(self.a, self.b)
        with banco.abrir(self.folder) as db:
            cols = [r[1] for r in db.execute('PRAGMA table_info(alunos)')]
            self.assertNotIn('nome_oficial', cols)

    def test_2027_preserva_2026_e_mesmo_aluno(self):
        old = self.matricula(); self.matricula(year=2027,serie='2',anterior=old)
        report = banco.relatorio(self.folder,self.a)
        self.assertEqual([(r['ano_letivo'],r['serie']) for r in report['trajetoria']],[(2026,'1'),(2027,'2')])
        self.assertTrue(all(r['aluno_id']==self.a for r in report['trajetoria']))
        self.assertFalse(report['nomes_incluidos'])

    def test_repetencia_nao_promove_automaticamente(self):
        old = self.matricula(); self.matricula(year=2027,serie='1',anterior=old)
        rows = banco.relatorio(self.folder,self.a)['trajetoria']
        self.assertEqual([r['serie'] for r in rows],['1','1'])

    def test_nao_conecta_matricula_anterior_de_outro_aluno(self):
        old=self.matricula()
        with self.assertRaises(ValueError): self.matricula(aid=self.b,year=2027,anterior=old)

    def test_nao_cria_base_em_repositorio_publico(self):
        with self.assertRaises(ValueError): banco.inicializar(banco.ROOT/'dados-privados')

    def test_lista_invalida_reverte_lote_e_nao_mescla_identidade(self):
        with self.assertRaises(ValueError):
            banco.cadastrar(self.folder,[{'nome_oficial':'Novo fictício','fonte_lista':'fixture'},
                                        {'nome_oficial':'','fonte_lista':'fixture'}])
        with banco.abrir(self.folder) as db:
            self.assertEqual(db.execute('SELECT count(*) FROM alunos').fetchone()[0],2)
        with self.assertRaises(ValueError):
            banco.cadastrar(self.folder,[{'aluno_id':self.a,'nome_oficial':'Outra pessoa fictícia','fonte_lista':'fixture'}])

    def test_sessao_na_matricula_errada_e_fora_do_periodo_recusadas(self):
        mid=self.matricula()
        with self.assertRaises(sqlite3.IntegrityError): self.preparar_sessao(mid,aid=self.b)
        with self.assertRaises(sqlite3.IntegrityError): self.preparar_sessao(mid,date='2027-10-28')

    def test_ausente_diferente_de_zero_e_preservacao_do_original(self):
        mid=self.matricula(); self.preparar_sessao(mid)
        with banco.abrir(self.folder) as db:
            sql='INSERT INTO medidas VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
            db.execute(sql,('M1','SESSAO-TESTE','acertos','inicial','I1','1','R1','itens',0,10,None,'fixture'))
            db.execute(sql,('M2','SESSAO-TESTE','acertos','retencao','I1','1','R1','itens',None,10,'nao_coletado','fixture'))
        rows=banco.relatorio(self.folder,self.a)['trajetoria']
        self.assertEqual(rows[0]['valor'],0); self.assertIsNone(rows[1]['valor'])
        with banco.abrir(self.folder) as db:
            with self.assertRaises(sqlite3.IntegrityError):
                db.execute('UPDATE medidas SET valor=5 WHERE medida_id=?',('M1',))
            with self.assertRaises(sqlite3.IntegrityError):
                db.execute('INSERT INTO medidas VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                           ('M3','SESSAO-TESTE','acertos','pos','I1','1','R1','itens',None,10,None,'fixture'))

    def test_inicializar_novamente_nao_apaga_cadastro(self):
        banco.inicializar(self.folder)
        with banco.abrir(self.folder) as db:
            self.assertEqual(db.execute('SELECT count(*) FROM alunos').fetchone()[0],2)

    def test_consulta_memoria_encontra_insight_e_producao(self):
        rows=banco.consultar('cadência')
        self.assertTrue(any(r['id']=='INS-20261028-005' for r in rows))
        self.assertTrue(any(r['id']=='LIV-004' for r in rows))


if __name__ == '__main__':
    unittest.main(verbosity=2)
