#!/usr/bin/env python3
"""Empacota apenas materiais discentes cadastrados para GitHub Pages."""
import html
import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import urlparse

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
    reading = OUT / "_recursos" / "leitura"
    reading.mkdir(parents=True, exist_ok=True)
    for name in ["painel.js", "OpenDyslexic-Regular.woff2", "OFL.txt"]:
        shutil.copyfile(ROOT / "publicacao" / "leitura" / name, reading / name)
    lettering = OUT / "_recursos" / "lettering"
    lettering.mkdir(parents=True, exist_ok=True)
    for name in ["estilo.css", "aplicar.js", "Kalam-Bold.woff", "OFL.txt"]:
        shutil.copyfile(ROOT / "publicacao" / "lettering" / name, lettering / name)
    image_learning = OUT / "_recursos" / "imagens"
    image_learning.mkdir(parents=True, exist_ok=True)
    for name in ["conteudos.js", "cenas.js", "aplicar.js", "estilo.css"]:
        shutil.copyfile(ROOT / "publicacao" / "imagens" / name, image_learning / name)
    sounds = OUT / "_recursos" / "sons"
    sounds.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ROOT / "publicacao/sons/painel.js", sounds / "painel.js")
    links = []
    destinations = set()
    for item in items:
        if item['tipo'] == 'link':
            url = item.get('url', '')
            parsed = urlparse(url)
            if parsed.scheme != 'https' or parsed.netloc != 'gamma.app':
                raise ValueError('Apresentação externa deve usar HTTPS no Gamma.')
            links.append('<li><a href="' + html.escape(url, quote=True) + '">' + html.escape(item['titulo']) + '</a></li>')
            continue
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
            for page in dest.rglob('*.html'):
                text = page.read_text(encoding='utf-8')
                if 'data-school-lettering' in text:
                    prefix = os.path.relpath(lettering, page.parent).replace(os.sep, '/') + '/'
                    text = text.replace('../../publicacao/lettering/', prefix)
                    page.write_text(text, encoding='utf-8')
                if page == dest / 'index.html' and 'data-image-learning' not in text:
                    prefix = os.path.relpath(image_learning, page.parent).replace(os.sep, '/') + '/'
                    learning = '<link rel="stylesheet" href="' + prefix + 'estilo.css?v=1.0.0">'
                    for name in ['conteudos.js', 'cenas.js', 'aplicar.js']:
                        learning += '<script defer src="' + prefix + name + '?v=1.0.1" data-image-learning data-learning-key="' + html.escape(item.get('apoio_imagens', item['destino']), quote=True) + '"></script>'
                    index = text.lower().rfind('</body>')
                    text = text[:index] + learning + text[index:] if index >= 0 else text + learning
                    page.write_text(text, encoding='utf-8')
                if page == dest / 'index.html' and 'data-background-noise' not in text:
                    relative_sound = os.path.relpath(sounds / 'painel.js', page.parent).replace(os.sep, '/')
                    tag_sound = '<script defer src="' + relative_sound + '?v=1.0.0" data-background-noise></script>'
                    index = text.lower().rfind('</body>')
                    text = text[:index] + tag_sound + text[index:] if index >= 0 else text + tag_sound
                    page.write_text(text, encoding='utf-8')
                relative = os.path.relpath(reading / 'painel.js', page.parent).replace(os.sep, '/')
                tag = '<script defer src="' + relative + '?v=1.0.1" data-reading-panel></script>'
                if 'data-reading-panel' not in text:
                    if '</body>' in text.lower():
                        index = text.lower().rfind('</body>')
                        text = text[:index] + tag + text[index:]
                    else:
                        text += tag
                    page.write_text(text, encoding='utf-8')
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




