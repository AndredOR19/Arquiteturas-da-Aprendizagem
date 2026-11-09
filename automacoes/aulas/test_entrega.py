"""Ensaios do bloqueio de entrega, sem rede ou aprovação fictícia de aulas reais."""
import copy
import importlib.util
import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import contrato_entrega as c

POLICY=json.loads(Path(__file__).with_name('politica-entrega.json').read_text())

class Entrega(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name);self.bundle=self.root/'aulas/teste';self.bundle.mkdir(parents=True)
        (self.bundle/'index.html').write_text('Conteúdo sintético reutilizável — 9º ano')
        (self.bundle/'assets').mkdir();(self.bundle/'assets/conteudo.js').write_text('window.AULA_GEICONTEUDO={id:"teste"};')
        self.master=self.root/'PROMPT_MESTRE_AULAS_DIGITAIS.md';self.master.write_text('Prompt sintético 3.9.0')
        (self.root/'teste.txt').write_text('EVIDÊNCIA SINTÉTICA SOMENTE PARA TESTE')
        self.report=self.root/POLICY['linguagem_clara']['relatorio'];self.report.parent.mkdir(parents=True,exist_ok=True)
        self.write_report(bloqueado=0)
        self.receipt=c.pending(POLICY,'teste',self.bundle,self.master)
    def write_report(self,bloqueado):
        self.report.write_text(json.dumps({'protocolo':'linguagem-clara-3.9','aulas':{'teste':{'atividades':1,'bloqueado':bloqueado,'revisao_humana':0,'aprovado_automatico':1-bloqueado,'conteudo_sha256':c.sha(self.bundle/'assets/conteudo.js'),'clareza_sha256':None}}}))
    def approve_fixture(self):
        for entry in self.receipt['requisitos'].values():entry.update(estado='aprovado',responsavel='teste sintético',verificado_em='2026-11-08',evidencias=[{'arquivo':'teste.txt','sha256':c.sha(self.root/'teste.txt')}])
    def check(self,stage='publicar'):return c.validate(self.receipt,POLICY,self.root,self.bundle,self.master,stage)
    def test_compilar_nao_libera(self):self.assertTrue(self.check())
    def test_aceite_conferido(self):
        self.approve_fixture();self.assertEqual(self.check(),[])
    def test_alterar_pacote_invalida(self):
        self.approve_fixture();(self.bundle/'index.html').write_text('versão diferente');self.assertTrue(self.check())
    def test_alterar_prompt_invalida(self):
        self.approve_fixture();self.master.write_text('prompt novo');self.assertTrue(self.check())
    def test_evidencia_inexistente_invalida(self):
        self.approve_fixture();(self.root/'teste.txt').unlink();self.assertTrue(self.check())
    def test_linguagem_sem_relatorio_bloqueia(self):
        self.approve_fixture();self.report.unlink();self.assertTrue(any('linguagem_clara' in e for e in self.check()))
    def test_linguagem_bloqueio_impede_entrega(self):
        self.approve_fixture();self.write_report(bloqueado=1);self.assertTrue(any('bloqueada' in e for e in self.check()))
    def test_linguagem_relatorio_desatualizado(self):
        self.approve_fixture();(self.bundle/'assets/conteudo.js').write_text('window.AULA_GEICONTEUDO={id:"teste",v:2};')
        self.receipt['pacote_sha256']=c.digest(self.bundle);self.assertTrue(any('desatualizado' in e for e in self.check()))
    @unittest.skipUnless(shutil.which('node'),'node ausente')
    def test_validador_distingue_conteudo_original_da_camada_clara(self):
        repo=Path(__file__).resolve().parents[2];spec=importlib.util.spec_from_file_location('vl',Path(__file__).with_name('validar_linguagem.py'))
        vl=importlib.util.module_from_spec(spec);spec.loader.exec_module(vl)
        aula=repo/'aulas/pesquisa-e-dados-7ano';bruto=self.root/'bruto/aulas/x/assets';bruto.mkdir(parents=True);shutil.copy(aula/'assets/conteudo.js',bruto)
        saida=subprocess.run(['node',str(repo/'automacoes/aulas/linguagem_extrair.cjs'),str(aula),str(bruto.parent)],capture_output=True,text=True,check=True).stdout
        com,sem=[[vl.avaliar_item(i,ex['casos']) for i in ex['itens']] for ex in json.loads(saida)]
        self.assertEqual(len(com),128);self.assertEqual(sum(1 for i in com if i['estado']=='bloqueado'),0)
        self.assertEqual(sum(1 for i in sem if i['estado']=='bloqueado'),128)
        regras={b['regra'] for i in sem for b in i['bloqueios']};self.assertIn('rotulo_interno_visivel',regras);self.assertIn('exemplo_ausente',regras)
        self.assertTrue(all(i['estado']!='aprovado_automatico' or not i['avisos'] for i in com))
    def test_escape_evidencia_rejeitado(self):
        with self.assertRaises(ValueError):c.inside(self.root,'../arquivo.txt')
    def test_publicacao_parcial_nao_conclui(self):
        self.approve_fixture();self.assertTrue(self.check('concluir'))
    def test_duas_publicacoes_e_qr(self):
        self.approve_fixture();(self.root/'qr.png').write_bytes(b'QR SINTETICO')
        for target in POLICY['publicacao']['destinos']:
            self.receipt['publicacao'][target]={'estado':'verificado','http':200,'url':'https://example.org/aula/','pacote_sha256':self.receipt['pacote_sha256'],'verificado_em':'2026-11-08','qr_arquivo':'qr.png','qr_sha256':c.sha(self.root/'qr.png')}
        self.assertEqual(self.check('concluir'),[])
    def test_rotas_minimos_e_ids(self):
        data={'routes':{k:[{'id':k+str(i),'kind':'order' if i%2 else 'match','command':'Operação '+str(i),'data':{'valor':i}} for i in range(n)] for k,n in [('principal',32),('exemplos',64),('apoio',57)]}}
        c.validate_routes(data,POLICY)
        bad=copy.deepcopy(data);bad['routes']['apoio'].pop()
        with self.assertRaises(ValueError):c.validate_routes(bad,POLICY)
        bad=copy.deepcopy(data);bad['routes']['exemplos'][0]['id']=data['routes']['principal'][0]['id']
        with self.assertRaises(ValueError):c.validate_routes(bad,POLICY)
        bad=copy.deepcopy(data);bad['routes']['principal'][2]=dict(bad['routes']['principal'][0],id='outro-id')
        with self.assertRaises(ValueError):c.validate_routes(bad,POLICY)
    def test_nova_aula_sem_registro_bloqueia_catalogo(self):
        (self.root/'publicacao').mkdir();config=self.root/'automacoes/aulas';config.mkdir(parents=True,exist_ok=True)
        (config/'politica-entrega.json').write_text(json.dumps(POLICY))
        (config/'legados-entrega.json').write_text(json.dumps({'destinos':['aulas/antiga']}))
        (self.root/'publicacao/catalogo.json').write_text(json.dumps({'materiais':[{'tipo':'html','origem':'aulas/teste','destino':'aulas/teste'}]}))
        with self.assertRaises(ValueError):c.catalog_gate(self.root)
    def test_conferencia_remota_e_qr_apos_correspondencia(self):
        import conferir_publicacao_integral as checker
        self.approve_fixture();cfg=self.root/'automacoes/aulas';cfg.mkdir(parents=True,exist_ok=True)
        (cfg/'politica-entrega.json').write_text(json.dumps(POLICY))
        (self.root/'recibo.json').write_text(json.dumps(self.receipt))
        (cfg/'entregas.json').write_text(json.dumps({'aulas':[{'id':'teste','destino':'aulas/teste','recibo':'recibo.json'}]}))
        (self.root/'publicacao').mkdir();(self.root/'publicacao/catalogo.json').write_text(json.dumps({'materiais':[{'destino':'aulas/teste','contrato_entrega':'3.8.0'}]}))
        site=self.root/'_site';dest=site/'aulas/teste';dest.mkdir(parents=True)
        content=(self.bundle/'index.html').read_bytes();(dest/'index.html').write_bytes(content)
        result=checker.verify(self.root,site,{'pages':'https://pages.example','vercel':'https://vercel.example'},self.root/'resultado',fetcher=lambda url:content)
        self.assertEqual(result['estado'],'concluido');self.assertEqual(len(result['verificacoes']),2)
        self.assertTrue(all((self.root/'resultado'/x['qr_arquivo']).is_file() for x in result['verificacoes']))
        def wrong_version(url):return b'versao desatualizada' if 'vercel.example' in url else content
        with patch.object(checker.time,'sleep'):
            result=checker.verify(self.root,site,{'pages':'https://pages.example','vercel':'https://vercel.example'},self.root/'parcial',fetcher=wrong_version)
        self.assertEqual(result['estado'],'publicado_parcial');self.assertEqual(len(list((self.root/'parcial').glob('*.png'))),1)
    def test_acervo_por_serie_sem_contexto_de_aplicacao(self):
        portal=Path(__file__).resolve().parents[2]/'publicacao/portal/gerar.py'
        spec=importlib.util.spec_from_file_location('portal_teste',portal);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
        p={'componentes':['História'],'series':['9º ano'],'turmas':['192'],'palavras_chave':['fonte'],'ano_letivo':2026,'categoria':'aula','escola':'Escola','escola_curta':'Escola','descricao':'Comparar evidências','titulo_exibicao':'Independências — Turma 192 — 09/11/2026'}
        item={'tipo':'html','origem':'aulas/09-11-2026-historia-192','destino':'aulas/09-11-2026-historia-192','titulo':'Independências','portal':p}
        result=m.acervo_publico(self.root,[item])['materiais'][0]
        self.assertEqual(result['series'],['9º ano']);self.assertEqual(result['turmas'],[]);self.assertIsNone(result['ano_letivo']);self.assertEqual(result['data_catalogo'],'')
        self.assertNotIn('192',result['titulo']);self.assertNotIn('2026',result['titulo'])
        p['titulo_exibicao']='Berlim: 09/11/1989';result=m.acervo_publico(self.root,[item])['materiais'][0];self.assertIn('09/11/1989',result['titulo'])
    def test_legado_preservado(self):
        (self.root/'publicacao').mkdir();config=self.root/'automacoes/aulas';config.mkdir(parents=True,exist_ok=True)
        (config/'politica-entrega.json').write_text(json.dumps(POLICY));(config/'legados-entrega.json').write_text(json.dumps({'destinos':['aulas/antiga']}))
        (self.root/'publicacao/catalogo.json').write_text(json.dumps({'materiais':[{'tipo':'html','origem':'aulas/antiga','destino':'aulas/antiga'}]}))
        c.catalog_gate(self.root)

if __name__=='__main__':unittest.main()
