#!/usr/bin/env python3
"""Usa uma revisão conferida da Biblioteca de Diagramação, sem copiar seu motor."""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--biblioteca', type=Path, required=True, help='Clone local da biblioteca privada')
    parser.add_argument('acao', choices=['novo', 'validar', 'compilar'])
    parser.add_argument('argumentos', nargs='*')
    args = parser.parse_args()
    lock = json.loads((ROOT / 'ferramentas/biblioteca.lock.json').read_text())
    if lock.get('repositorio') != 'AndredOR19/Biblioteca-de-Diagramacao' or not re.fullmatch(r'[0-9a-f]{40}', lock.get('commit', '')):
        raise ValueError('Arquivo de conexão inválido.')
    library = args.biblioteca.resolve()
    head = subprocess.check_output(['git', '-C', str(library), 'rev-parse', 'HEAD'], text=True).strip()
    if head != lock['commit']:
        raise ValueError('Versão diferente da conexão. Confira e use o commit ' + lock['commit'])
    # Uma edição local não conferida também quebra a garantia da versão fixada.
    dirty = subprocess.check_output(['git', '-C', str(library), 'status', '--porcelain', '--untracked-files=no'], text=True)
    if dirty.strip():
        raise ValueError('O motor tem alterações locais. Preserve-as e use um clone limpo da revisão fixada.')
    engine = library / 'estacao/produzir.py'
    if not engine.is_file():
        raise ValueError('Motor da biblioteca não encontrado.')
    subprocess.run([sys.executable, str(engine), '--raiz', str(ROOT), args.acao, *args.argumentos], check=True)

if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, subprocess.CalledProcessError) as exc:
        print('ERRO: ' + str(exc), file=sys.stderr)
        sys.exit(1)
