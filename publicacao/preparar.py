#!/usr/bin/env python3
"""Empacota apenas materiais discentes cadastrados para GitHub Pages."""
import html
import json
import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import urlparse, urlencode
from portal.gerar import preparar_portal
from alfabetizacao.validar import validar_apoio

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_site'
ALLOWED = {'.html', '.css', '.js', '.json', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp3', '.wav', '.ogg', '.woff', '.woff2', '.ico', '.pdf'}

def safe_path(base, name):
    p = (base / name).resolve()
    if p == base.resolve() or not p.is_relative_to(base.resolve()):
        raise ValueError('Caminho inválido: ' + name)
    return p

def decorar_apoios(text, page, assets):
    if 'id="apoio-dados"' not in text and 'id="dados-exemplos"' not in text:
        return text
    if 'data-apoio-ui-script' in text:
        return text
    prefix = os.path.relpath(assets, page.parent).replace(os.sep, '/') + '/'
    css = '<link rel="stylesheet" href="' + prefix + 'experiencia.css?v=3.6.0">'
    scripts = ''.join('<script defer src="' + prefix + name + '?v=3.6.0" data-apoio-ui-script></script>' for name in ['experiencia.js','relatorios.js'])
    text = text.replace('</head>', css + '</head>', 1)
    at = text.lower().rfind('</body>')
    return text[:at] + scripts + text[at:] if at >= 0 else text + scripts

def main():
    import sys
    sys.path.insert(0, str(ROOT / "automacoes/aulas"))
    from contrato_entrega import catalog_gate
    catalog_gate(ROOT)
    apoio = validar_apoio(ROOT / "publicacao/alfabetizacao/index.html")
    print("Apoio opcional:", len(apoio["percursos"]), "percursos por área; mínimo 57")
    items = json.loads((ROOT / 'publicacao/catalogo.json').read_text())['materiais']
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    support_assets = OUT / "_recursos" / "apoios"
    support_assets.mkdir(parents=True, exist_ok=True)
    for name in ['experiencia.css','experiencia.js','relatorios.js','oficina-fracoes.webp','arquivo-historia.webp']:
        shutil.copyfile(ROOT / 'publicacao' / 'apoios' / name, support_assets / name)
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
    literacy = OUT / "_recursos" / "alfabetizacao"
    literacy.mkdir(parents=True, exist_ok=True)
    literacy_page = literacy / "index.html"
    literacy_source = (ROOT / "publicacao/alfabetizacao/index.html").read_text(encoding='utf-8')
    literacy_page.write_text(decorar_apoios(literacy_source, literacy_page, support_assets), encoding='utf-8')
    sounds = OUT / "_recursos" / "sons"
    sounds.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ROOT / "publicacao/sons/painel.js", sounds / "painel.js")
    links = []
    destinations = set()
    for item in items:
        if item['tipo'] == 'link':
            url = item.get('url', '')
            parsed = urlparse(url)
            if parsed.scheme != 'https' or parsed.netloc not in {'gamma.app', 'aulas-03-11-2026.vercel.app'}:
                raise ValueError('Link externo deve usar HTTPS no Gamma ou no Vercel de aulas.')
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
            if item.get('apoio_local'):
                info_apoio=item['apoio_local']
                dados_apoio=validar_apoio(safe_path(source,info_apoio['arquivo']))
                if len(dados_apoio['percursos']) != info_apoio['quantidade']:
                    raise ValueError('Contagem do apoio local diverge do catálogo')
            if item.get('rota_exemplos'):
                info=item['rota_exemplos']
                rota=safe_path(source,info['arquivo'])
                if not rota.is_file():
                    raise ValueError('Rota opcional de exemplos ausente')
                fragment=re.search(r'<script id="dados-exemplos" type="application/json">(.*?)</script>',rota.read_text(encoding='utf-8'),re.S)
                if not fragment:
                    raise ValueError('Rota de exemplos sem banco verificável')
                tarefas=json.loads(fragment.group(1)).get('percursos',[])
                if len(tarefas) < 64 or len(tarefas) != info['quantidade']:
                    raise ValueError('Rota de exemplos exige no mínimo 64 percursos; contagem divergente')
                ids=[t.get('id') for t in tarefas]
                if not all(ids) or len(set(ids)) != len(ids):
                    raise ValueError('Rota de exemplos com IDs ausentes ou duplicados')
            for p in source.rglob('*'):
                if p.is_symlink():
                    raise ValueError('Links simbólicos não são publicados.')
                relative = p.relative_to(source)
                if any(part.lower() in {'professor', 'gabarito', 'privado'} or part.startswith('.') for part in relative.parts):
                    continue
                if p.is_file() and p.suffix.lower() in ALLOWED:
                    if p.suffix.lower()=='.pdf' and p.name not in {'aula-impressa.pdf','apoio-leitura.pdf','exemplos.pdf'}:
                        raise ValueError('PDF não autorizado como discente: '+str(p))
                    target = dest / relative
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(p, target)
            for page in dest.rglob('*.html'):
                text = decorar_apoios(page.read_text(encoding='utf-8'), page, support_assets)
                page.write_text(text, encoding='utf-8')
                integrated_gei = 'data-escolher-rotas' in text and 'assets/aula.js' in text
                if page == dest / 'index.html' and 'data-apoio-local' not in text and not integrated_gei:
                    materia = ', '.join(item.get('portal', {}).get('componentes', [])) or 'Aula'
                    params = urlencode({'materia': materia, 'tema': item.get('titulo', ''), 'voltar': './'})
                    support_path = os.path.relpath(literacy / 'index.html', page.parent).replace(os.sep, '/')
                    support_link = '<aside class="apoio-alfabetizacao" style="max-width:900px;margin:24px auto;padding:16px;background:#eaf6ef;color:#123e36;border:2px solid #377266;border-radius:12px;font:17px/1.5 system-ui"><strong>Percurso opcional de apoio à leitura</strong><p style="margin:8px 0">57 percursos com imagens, palavras, sílabas, frases e áudio, sem alterar sua nota.</p><a style="display:inline-block;padding:10px 14px;color:#123e36;background:white;border:2px solid #377266;border-radius:8px" href="' + html.escape(support_path + '?' + params, quote=True) + '">Aprender com imagens, palavras e áudio</a></aside>'
                    gate = '<div id="aula-conteudo" hidden inert>'
                    if gate in text:
                        text = text.replace(gate, gate + support_link, 1)
                    else:
                        end = text.lower().rfind('</body>')
                        text = text[:end] + support_link + text[end:] if end >= 0 else text + support_link
                if 'data-school-lettering' in text:
                    prefix = os.path.relpath(lettering, page.parent).replace(os.sep, '/') + '/'
                    text = text.replace('../../publicacao/lettering/', prefix)
                    page.write_text(text, encoding='utf-8')
                if page == dest / 'index.html' and 'data-image-learning' not in text and not integrated_gei:
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
    teacher_area = OUT / "docentes/area"
    teacher_area.mkdir(parents=True, exist_ok=True)
    for name in ["index.html", "area.css", "area.js", "config.js"]:
        shutil.copyfile(ROOT / "docentes/area" / name, teacher_area / name)
    admin_area = OUT / "docentes/admin"
    admin_area.mkdir(parents=True, exist_ok=True)
    for name in ["index.html", "admin.css", "admin.js"]:
        shutil.copyfile(ROOT / "docentes/admin" / name, admin_area / name)
    preparar_portal(ROOT, OUT, items)
    (OUT / '.nojekyll').touch()
    print('Materiais públicos preparados:', len(items))

if __name__ == '__main__':
    main()




