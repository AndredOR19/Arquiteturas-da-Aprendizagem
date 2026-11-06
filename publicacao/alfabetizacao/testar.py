"""Regressões do contrato compartilhado, sem credenciais ou rede."""
import json
import tempfile
from pathlib import Path
from validar import validar_apoio

source = Path(__file__).with_name('index.html')
data = validar_apoio(source)
assert len(data['percursos']) == 28
with tempfile.TemporaryDirectory() as tmp:
    path = Path(tmp) / 'index.html'
    for invalid in ('curto', 'duplicado', 'indice'):
        broken = json.loads(json.dumps(data))
        if invalid == 'curto':
            broken['percursos'] = broken['percursos'][:25]
        elif invalid == 'duplicado':
            broken['percursos'][-1] = broken['percursos'][0]
        else:
            broken['percursos'][0]['palavra'] = 99
        path.write_text('<script id="apoio-dados" type="application/json">'+json.dumps(broken)+'</script>')
        try:
            validar_apoio(path)
        except ValueError:
            pass
        else:
            raise AssertionError('Contrato aceitou banco inválido: '+invalid)
print('OK: 28 percursos; rejeição de 25, duplicação e referência inexistente')
