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
        'percursos':[dict(unit) for _ in range(26)]}
mod.check(answer)
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
        mod.ask=lambda prompt: answer
        sys.argv=['gerar.py','--pedido','automacoes/aulas/pedidos/teste.json']
        mod.main()
    finally:
        os.chdir(old)
    page=(root/'aulas/teste-171/index.html').read_text()
    assert 'type="application/json"' in page
    found=re.search(r'<script id="dados" type="application/json">(.*?)</script>',page,re.S)
    assert len(json.loads(found.group(1))['percursos'])==26
    scripts=re.findall(r'<script>(.*?)</script>',page,re.S)
    assert scripts
    for i,script in enumerate(scripts):
        file=root/f'script-{i}.js'
        file.write_text(script)
        subprocess.run(['node','--check',str(file)],check=True)
    assert any(x.get('destino')=='aulas/teste-171' for x in json.loads((root/'publicacao/catalogo.json').read_text())['materiais'])
    assert (root/'automacoes/aulas/ultima-geracao.json').is_file()
print('OK: pedido -> gerador sintético -> HTML 26 percursos -> catálogo -> sintaxe JS')
