#!/usr/bin/env python3
"""Validação estrutural de artefatos gerados antes da proposta de revisão."""
import json
import re
import subprocess
import tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
import sys
sys.path.insert(0, str(ROOT / 'automacoes/aulas'))
from circuitos import validate_circuit
manifest=json.loads((ROOT/'automacoes/aulas/ultima-geracao.json').read_text())
catalog=json.loads((ROOT/'publicacao/catalogo.json').read_text())['materiais']
assert manifest['estado']=='pronto_para_revisao' and manifest['artefatos']
for rel in manifest['artefatos']:
    assert rel.startswith('aulas/') and '..' not in Path(rel).parts
    src=ROOT/rel/'index.html'
    html=src.read_text(encoding='utf-8')
    m=re.search(r'<script id="dados" type="application/json">(.*?)</script>',html,re.S)
    assert m,'JSON embutido não encontrado'
    data=json.loads(m.group(1))
    assert len(data['percursos'])==32
    assert all(len(p['alternativas'])==4 and 0<=p['correta']<4 for p in data['percursos'])
    validate_circuit(data['circuito'], 32)
    with tempfile.TemporaryDirectory() as tmp:
        scripts=re.findall(r'<script>(.*?)</script>',html,re.S)
        assert scripts
        for i,script in enumerate(scripts):
            file=Path(tmp)/f'script{i}.js'
            file.write_text(script,encoding='utf-8')
            subprocess.run(['node','--check',str(file)],check=True)
    assert any(item.get('destino')==rel for item in catalog)
    print('OK:',rel,'32 percursos, JS sintaticamente válido, catalogado')
