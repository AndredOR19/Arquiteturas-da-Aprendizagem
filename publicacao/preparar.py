#!/usr/bin/env python3
"""Empacota apenas materiais discentes cadastrados para GitHub Pages."""
import html
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_site'
ALLOWED = {'.html', '.css', '.js', '.json', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp3', '.wav', '.ogg', '.woff', '.woff2', '.ico'}

def safe_path(base, name):
    p = (base / name).resolve()
    if p == base.resolve() or not p.is_relative_to(base.resolve()):
        raise ValueError('Caminho inválido: ' + name)
    return p

def main():
    items = json.loads((ROOT / 'publicacao/catalogo.json').read_text())['materiais']
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    links = []
    destinations = set()
    for item in items:
        source = safe_path(ROOT, item['origem'])
        dest = safe_path(OUT, item['destino'])
        if dest in destinations:
            raise ValueError('Destino repetido.')
        destinations.add(dest)
        if item['tipo'] == 'html':
            if source.parts[len(ROOT.parts)] not in {'aulas', 'laboratorios'}:
                raise ValueError('HTML deve vir de aulas/ ou laboratorios/.')
            if not (source / 'index.html').is_file():
                raise ValueError('Material sem index.html: ' + item['origem'])
            for p in source.rglob('*'):
                if p.is_symlink():
                    raise ValueError('Links simbólicos não são publicados.')
                relative = p.relative_to(source)
                if any(part.lower() in {'professor', 'gabarito', 'privado'} or part.startswith('.') for part in relative.parts):
                    continue
                if p.is_file() and p.suffix.lower() in ALLOWED:
                    target = dest / relative
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(p, target)
        elif item['tipo'] == 'slides':
            if source.parts[len(ROOT.parts)] != 'projetos':
                raise ValueError('Slides devem vir de projetos/.')
            # Renderização usa a configuração criada pelo modelo central.
            # A pasta temporária evita publicar fontes, notas e guias.
            with tempfile.TemporaryDirectory() as tmp:
                staging = Path(tmp) / 'slides'
                shutil.copytree(source, staging)
                subprocess.run(['quarto', 'render', str(staging), '--to', 'revealjs', '--output-dir', str(dest)], check=True)
        else:
            raise ValueError('Tipo de publicação desconhecido.')
        if not (dest / 'index.html').is_file():
            raise ValueError('HTML final ausente.')
        links.append('<li><a href="' + html.escape(item['destino'], quote=True) + '/">' + html.escape(item['titulo']) + '</a></li>')
    index = '''<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Arquiteturas da Aprendizagem</title><style>body{font:1.2rem/1.6 system-ui;max-width:850px;margin:8vh auto;padding:24px;color:#16334b;background:#f4f7fa}h1{line-height:1.15}li{margin:22px 0}a{color:#145ca4}</style><h1>Arquiteturas da Aprendizagem</h1><p>Prof. André de Oliveira Rodrigues</p><ul>'''
    (OUT / 'index.html').write_text(index + ''.join(links) + '</ul></html>', encoding='utf-8')
    (OUT / '.nojekyll').touch()
    print('Materiais públicos preparados:', len(items))

if __name__ == '__main__':
    main()
