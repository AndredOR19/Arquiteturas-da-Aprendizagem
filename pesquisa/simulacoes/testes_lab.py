#!/usr/bin/env python3
import copy
import json
from pathlib import Path
import tempfile
import unittest
import os
from unittest.mock import patch
import numpy as np
from scipy.stats import ttest_ind
from modelos import executar,grade,semente_cenario,simular_cenario,validar,welch
from laboratorio import carregar,executar_laboratorio,verificar
from inventario import construir,diferencas
from arquivar import pacote,arquivar

HERE=Path(__file__).resolve().parent


class LaboratorioTest(unittest.TestCase):
    def setUp(self):
        self.c=carregar(HERE/'cenarios/individuos.json')

    def pequeno(self):
        c=copy.deepcopy(self.c);c['unidades_por_grupo']=[30];c['perdas']=[.2]
        c['efeitos_pp']=[-5,0,10];return c

    def test_cenarios_publicados_sao_validos(self):
        for name in ['individuos','turmas']:
            self.assertGreater(validar(carregar(HERE/f'cenarios/{name}.json'),5000,20261028),0)

    def test_parametros_nao_finitos_bool_e_sem_nulo_recusados(self):
        for key,value in [('alfa',float('nan')),('itens',True),('efeitos_pp',[5,10]),('perdas',[.99])]:
            c=copy.deepcopy(self.c);c[key]=value
            with self.assertRaises(ValueError):validar(c,1000,1)

    def test_limite_total_de_calculo(self):
        c=self.pequeno();c['unidades_por_grupo']=[500];c['perdas']=[0,.2,.4]
        with self.assertRaisesRegex(ValueError,'Orçamento'):validar(c,20000,1)

    def test_json_invalido_recusa_nan(self):
        with tempfile.TemporaryDirectory() as temp:
            p=Path(temp)/'config.json';p.write_text('{"a":NaN}')
            with self.assertRaises(ValueError):carregar(p)

    def test_welch_confere_com_scipy(self):
        a=np.array([[1.,2,3,4,np.nan],[2,1,3,2,5]])
        b=np.array([[2.,3,4,5,5],[4,4,3,5,4]])
        _,p,valid,na,nb=welch(a,b)
        expected=ttest_ind(a,b,axis=1,equal_var=False,nan_policy='omit').pvalue
        np.testing.assert_allclose(p,expected,atol=1e-12)
        self.assertTrue(valid.all());self.assertEqual(na.tolist(),[4,5])

    def test_semente_e_reproducao(self):
        c=self.pequeno();p=next(grade(c));seed=semente_cenario(42,p)
        self.assertEqual(simular_cenario(c,p,300,seed),simular_cenario(c,p,300,seed))

    def test_reordenar_grade_preserva_resultado_por_cenario(self):
        c=self.pequeno();a=executar(c,200,99)
        c['efeitos_pp'].reverse();b=executar(c,200,99)
        lookup=lambda doc:{r['efeito_assumido_pp']:r for r in doc['cenarios']}
        self.assertEqual(lookup(a),lookup(b))

    def test_nulo_proximo_do_alfa_e_direcoes_dos_efeitos(self):
        c=self.pequeno();r=executar(c,2500,2026)['cenarios']
        m={x['efeito_assumido_pp']:x for x in r}
        self.assertTrue(.025<m[0]['frequencia_rejeicao']<.08)
        self.assertLess(m[-5]['diferenca_media_pp'],0)
        self.assertGreater(m[10]['diferenca_media_pp'],0)
        self.assertGreater(m[10]['frequencia_rejeicao'],m[0]['frequencia_rejeicao'])

    def test_turma_e_unidade_de_analise(self):
        c=carregar(HERE/'cenarios/turmas.json');p=next(grade(c));r=simular_cenario(c,p,300,44)
        self.assertEqual(r['unidade_analise'],'turma')
        self.assertLessEqual(r['media_unidades_analisadas_por_grupo'],4)
        self.assertEqual(r['pessoas_iniciais_total'],160)

    def test_inventario_separa_cabala_e_modelos_de_planejamento(self):
        inv=construir();cabala=next(a for a in inv['arquiteturas'] if a['id']=='cabala')
        self.assertEqual(cabala['dominio'],'simbolico_filosofico')
        self.assertEqual(cabala['estado_modelagem'],'aguardando_formalizacao')
        self.assertEqual(cabala['modulos_de_apoio'],[])
        self.assertFalse(any(a['validacao_empirica'] for a in inv['arquiteturas']))

    def test_diferencas_identificam_arquitetura_nova_e_fonte_alterada(self):
        inv=construir();next_=copy.deepcopy(inv)
        next_['arquiteturas'][0]['revisao_sha256']='alterada'
        next_['arquiteturas'].append({'id':'nova','revisao_sha256':'nova'})
        diff=diferencas(inv,next_)
        self.assertEqual(diff['novas'],['nova']);self.assertEqual(diff['alteradas'],[inv['arquiteturas'][0]['id']])

    def test_pacote_de_arquivo_e_branch_separada(self):
        class FakeAPI:
            def __init__(self):self.calls=[]
            def call(self,method,path,data=None,missing=False):
                self.calls.append((method,path,data))
                if method=='GET' and path.startswith('/contents/'):return None
                if method=='GET' and path.startswith('/git/ref/'):return None
                if method=='GET' and path.startswith('/git/commits/'):return {'tree':{'sha':'base'}}
                if path=='/git/refs':return {'ok':True}
                return {'sha':'nova'}
        with tempfile.TemporaryDirectory() as temp,patch.dict(os.environ,{
            'GITHUB_SHA':'a'*40,'GITHUB_RUN_ID':'123','GITHUB_RUN_ATTEMPT':'1'}):
            root,_,_=executar_laboratorio(self.pequeno(),200,7,temp)
            self.assertEqual(pacote(temp),root)
            api=FakeAPI();url=arquivar(root,api,'autor/repositorio','123','1','a'*40)
            self.assertIn('resultados-simulacoes/execucoes/123-1-individuos',url)
            ref=next(c[2] for c in api.calls if c[1]=='/git/refs')
            self.assertEqual(ref['ref'],'refs/heads/resultados-simulacoes')
            (root/'nao-publicar.txt').write_text('arquivo inesperado')
            with self.assertRaises(ValueError):pacote(temp)

    def test_perdas_reduzem_pessoas_sem_virar_zero(self):
        c=self.pequeno();p=next(grade(c));r=simular_cenario(c,p,500,33)
        self.assertTrue(44<r['media_pessoas_acompanhadas']<52)
        self.assertEqual(r['validas']+r['invalidas'],500)

    def test_pacote_integro_html_seguro_e_corrupcao_detectada(self):
        c=self.pequeno();c['titulo']='<script>nome</script>'
        with tempfile.TemporaryDirectory() as temp:
            p,manifest,result=executar_laboratorio(c,200,8,temp)
            self.assertTrue(verificar(p))
            self.assertEqual(manifest['chamadas_ia'],0)
            self.assertTrue((p/'grafico.png').stat().st_size>1000)
            self.assertNotIn('<script>nome</script>',(p/'relatorio.html').read_text())
            self.assertIn('&lt;script&gt;',(p/'relatorio.html').read_text())
            with (p/'resultados.csv').open('a') as f:f.write('alterado')
            with self.assertRaises(ValueError):verificar(p)


if __name__=='__main__':unittest.main(verbosity=2)
