#!/usr/bin/env python3
"""Confere delegação real ao motor e ausência de produção independente."""
import importlib.util
import sys
import tempfile
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('ponte',Path(__file__).with_name('gerar.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
with tempfile.TemporaryDirectory() as d:
    root=Path(d);m.ROOT=root
    with patch.object(sys,'argv',['gerar.py','--pedido','pedido.json']):
        try:m.main()
        except SystemExit as e:assert 'produção independente' in str(e)
        else:raise AssertionError('Biblioteca ausente não bloqueou')
    entry=root/'motor/estacao/orquestrar_aulas.py';entry.parent.mkdir(parents=True);entry.write_text('# motor sintético')
    with patch.object(sys,'argv',['gerar.py','--pedido','pedido.json','--biblioteca',str(root/'motor'),'--script','roteiro.md','--gerar-dados']),patch.object(m.subprocess,'run') as call:
        m.main();args=call.call_args.args[0]
        assert str(entry) in args and '--raiz' in args and '--gerar-dados' in args and 'pedido.json' in args and '--roteiro' in args
    assert not list(root.rglob('*.html'))
assert not hasattr(m,'HTML')
print('PASS: ponte exige biblioteca, delega pedido/roteiro integral e não gera HTML próprio')
