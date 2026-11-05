#!/usr/bin/env python3
"""Checa links públicos do último lote após publicação GitHub Pages."""
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
last=ROOT/'automacoes/aulas/ultima-geracao.json'
if not last.is_file():
    print('Sem lote gerado na branch principal; nada a conferir.')
    sys.exit(0)
manifest=json.loads(last.read_text(encoding='utf-8'))
entries=json.loads((ROOT/'publicacao/catalogo.json').read_text(encoding='utf-8'))['materiais']
allowed={e.get('destino') for e in entries if e.get('tipo')=='html'}
base='https://andredor19.github.io/Arquiteturas-da-Aprendizagem/'
errors=[]
for path in manifest['artefatos']:
    if path not in allowed or not path.startswith('aulas/') or '..' in Path(path).parts:
        errors.append(f'Aula ausente do catálogo ou caminho inválido: {path}')
        continue
    url=base+path+'/'
    status='indisponível'
    for attempt in range(8):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'AEE-Publicacao/1.0'}),timeout=20) as response:
                status=response.status
                body=response.read(4000).lower()
                if status==200 and b'<html' in body:
                    break
        except (urllib.error.HTTPError,urllib.error.URLError,TimeoutError) as exc:
            status=str(exc)
        time.sleep(8)
    if status!=200:
        errors.append(f'{url}: {status}')
    else:
        print('HTTP 200:',url)
if errors:
    print('\n'.join(errors),file=sys.stderr)
    sys.exit(1)
print('OK: URLs do lote conferidas. Não substitui teste funcional de navegador.')
