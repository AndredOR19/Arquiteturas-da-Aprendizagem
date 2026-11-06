#!/usr/bin/env python3
"""Teste sintético sem credenciais, rede ou publicação."""
import importlib.util
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT=Path(__file__).with_name('gerar.py')
spec=importlib.util.spec_from_file_location('gerador_aee',SCRIPT)
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
unit={'contexto':'Compare uma situação concreta e examine suas evidências.',
      'pergunta':'Qual conclusão é sustentada pelas informações apresentadas?',
      'explicacao':'A comparação entre dois dados sustenta a conclusão.',
      'transferencia':'Agora aplique a mesma relação em outra situação.',
      'alternativas':[{'texto':'Resposta explicativa '+str(i),'feedback':'Explicação para a alternativa '+str(i)} for i in range(4)],
      'correta':1}
answer={'titulo':'Aula experimental de validação','objetivo':'Identificar relações em representações e situações concretas.',
        'conceito':'Relação entre variáveis numéricas e categóricas.',
        'conclusao':'Comparar evidências e justificar uma resposta em novo contexto.',
        'percursos':[dict(unit) for _ in range(32)]}
mod.check(answer)
from exemplos import validar as validar_exemplos, renderizar as renderizar_exemplos
def banco(n):
    return {'percursos':[{'id':'ex-'+str(i),'exemplo':'Uma mensagem '+str(i)+' informa horário sem indicar a fonte.','relacao':'Uma origem identificada permite conferir o aviso.','elementos':['Mensagem','Fonte original'],'linguagens':{'direta':'A fonte permite conferir a mensagem.','cotidiana':'Veja se o horário está no aviso da própria escola.','comparacao':'É como consultar o convite original em vez de confiar em uma cópia sem origem.'},'pergunta':'Qual ação ajuda a verificar este caso?','alternativas':[{'texto':'Conferir o canal original','feedback':'A origem permite comparar o anúncio com o registro.'},{'texto':'Repassar sem conferir','feedback':'Repetir não acrescenta evidência ao aviso.'}],'correta':0,'transferencia':'Confira a origem em outro aviso da escola.'} for i in range(n)]}
exemplos=banco(96)
validar_exemplos(exemplos,96)
validar_exemplos(banco(64))
for bad in [banco(63),{'percursos':[exemplos['percursos'][0]]*96}]:
    try: validar_exemplos(bad)
    except ValueError: pass
    else: raise AssertionError('Banco inválido aceito')

with tempfile.TemporaryDirectory() as tmp:
    root=Path(tmp)
    (root/'automacoes/aulas/pedidos').mkdir(parents=True)
    (root/'biblioteca-arquiteturas').mkdir()
    (root/'prompts').mkdir()
    (root/'publicacao').mkdir()
    (root/'_biblioteca_privada/docs').mkdir(parents=True)
    (root/'_biblioteca_privada/docs/INTEGRACAO-APRENDIZAGEM.md').write_text('Motor privado versionado; modelos HTML e componentes')
    (root/'prompts/FLUXO_03_TERRITORIO_EXPERIENCIAS.md').write_text('Fluxo 03: observar, comparar, explicar, transferir')
    (root/'biblioteca-arquiteturas/PROTOCOLO_IA.md').write_text('AEE: exposição, relação, efeito, limite')
    (root/'publicacao/catalogo.json').write_text(json.dumps({'materiais':[]}))
    request={'data':'2026-11-05','estado':'rascunho','aulas':[{
        'id':'teste-171','turma':'171','serie':'7º ano','disciplina':'Matemática',
        'tema':'Pesquisa com gráficos','fonte_curricular':'teste local','habilidades':['EF07MA36']}]}
    (root/'automacoes/aulas/pedidos/teste.json').write_text(json.dumps(request))
    old=Path.cwd()
    try:
        os.chdir(root)
        mod.ROOT=root
        mod.ask=lambda prompt: exemplos if 'Retorne JSON {percursos:' in prompt else answer
        sys.argv=['gerar.py','--pedido','automacoes/aulas/pedidos/teste.json']
        mod.main()
    finally:
        os.chdir(old)
    page=(root/'aulas/teste-171/index.html').read_text()
    assert 'type="application/json"' in page
    found=re.search(r'<script id="dados" type="application/json">(.*?)</script>',page,re.S)
    assert len(json.loads(found.group(1))['percursos'])==32
    scripts=re.findall(r'<script>(.*?)</script>',page,re.S)
    assert scripts
    for i,script in enumerate(scripts):
        file=root/f'script-{i}.js'
        file.write_text(script)
        subprocess.run(['node','--check',str(file)],check=True)
    assert any(x.get('destino')=='aulas/teste-171' for x in json.loads((root/'publicacao/catalogo.json').read_text())['materiais'])
    assert (root/'automacoes/aulas/ultima-geracao.json').is_file()
    route=(root/'aulas/teste-171/exemplos/index.html').read_text()
    assert 'Aprender de outro jeito — exemplos e relações' in page
    embedded=re.search(r'<script id="dados-exemplos" type="application/json">(.*?)</script>',route,re.S)
    assert len(json.loads(embedded.group(1))['percursos'])==96
    for i,script in enumerate(re.findall(r'<script>(.*?)</script>',route,re.S)):
        file=root/f'exemplos-{i}.js';file.write_text(script)
        subprocess.run(['node','--check',str(file)],check=True)

print('OK: pedido -> gerador sintético -> HTML 32 percursos -> catálogo -> sintaxe JS')
