#!/usr/bin/env python3
"""Sincroniza a biblioteca de cenários com a aula piloto e atualiza hashes dependentes.

Passos: copia os arquivos de execução para `apoio/cenarios/` da aula; executa o validador e o ensaio DOM
(se `jsdom` estiver acessível por NODE_PATH); regrava evidências; atualiza `manifesto.json` (bloco
`apoio_cenarios`); atualiza o recibo da aula (`pacote_sha256` e hashes das evidências) e confere o contrato
na etapa `publicar`. Não altera `apoio-dados`, catálogo público nem o estado de publicação.
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'automacoes/aulas'))
from contrato_entrega import digest, sha, validate  # noqa: E402

LIB = ROOT / 'publicacao/cenarios'
RUNTIME = ['catalogo.json', 'cenarios.js', 'cenarios.css', 'frases.js', 'frases-conjunto-1.json',
           'sala-das-palavras-1365.webp', 'sala-das-palavras-960.webp', 'sala-das-palavras-miniatura.webp']
AULA = ROOT / 'aulas/estrategias-de-estudo-8ano'
EVID = ROOT / 'automacoes/aulas/evidencias/cenarios'


def main():
    destino = AULA / 'apoio/cenarios'
    destino.mkdir(parents=True, exist_ok=True)
    for f in RUNTIME:
        shutil.copyfile(LIB / f, destino / f)
    subprocess.run([sys.executable, str(LIB / 'validar_cenarios.py')], check=True)
    if '--sem-dom' not in sys.argv:
        subprocess.run(['node', str(LIB / 'testar-cenarios.cjs'), '--evidencias', str(EVID)], check=True, env=os.environ)
    manifesto = json.loads((AULA / 'manifesto.json').read_text(encoding='utf-8'))
    for a in manifesto['arquivos']:
        f = AULA / a['arquivo']
        a['bytes'] = f.stat().st_size
        a['sha256'] = sha(f)
    manifesto['apoio_cenarios'] = [{'arquivo': 'apoio/cenarios/' + f.name, 'bytes': f.stat().st_size, 'sha256': sha(f)} for f in sorted(destino.iterdir())]
    manifesto['apoio_cenarios'].append({'arquivo': 'apoio/index.html', 'bytes': (AULA / 'apoio/index.html').stat().st_size, 'sha256': sha(AULA / 'apoio/index.html')})
    (AULA / 'manifesto.json').write_text(json.dumps(manifesto, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    policy = json.loads((ROOT / 'automacoes/aulas/politica-entrega.json').read_text())
    master = ROOT / 'PROMPT_MESTRE_AULAS_DIGITAIS.md'
    registro = json.loads((ROOT / 'automacoes/aulas/entregas.json').read_text())['aulas']
    for r in registro:
        p = ROOT / r['recibo']
        rec = json.loads(p.read_text(encoding='utf-8'))
        rec['prompt_sha256'] = sha(master)
        if (ROOT / r['destino']).resolve() == AULA.resolve():
            rec['pacote_sha256'] = digest(AULA)
            for req in rec['requisitos'].values():
                for ev in req['evidencias']:
                    arq = ROOT / ev['arquivo']
                    if arq.is_relative_to(EVID):
                        ev['sha256'] = sha(arq)
        p.write_text(json.dumps(rec, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        erros = validate(rec, policy, ROOT, ROOT / r['destino'], master)
        if erros:
            raise SystemExit(r['id'] + ': ' + '; '.join(erros))
    print('PILOTO SINCRONIZADO: cópias, evidências, manifesto e recibos coerentes; contrato (publicar) válido para', len(registro), 'aulas')


if __name__ == '__main__':
    main()
