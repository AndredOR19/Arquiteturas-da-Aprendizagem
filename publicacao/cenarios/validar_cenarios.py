#!/usr/bin/env python3
"""Valida a biblioteca de cenários e a sessão 2 de frases sem navegador.

Confere: catálogo (campos, arquivos, proporção), conjunto de frases (12 atividades, 3 opções, resposta
presente, vocabulário dentro do banco da sessão 1, textos do convite), cópias idênticas na aula piloto e
banco `apoio-dados` da aula igual ao hash de proveniência. Não mede legibilidade nem uso em sala.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIB = ROOT / 'publicacao/cenarios'
RUNTIME = ['catalogo.json', 'cenarios.js', 'cenarios.css', 'frases.js', 'frases-conjunto-1.json',
           'sala-das-palavras-1365.webp', 'sala-das-palavras-960.webp', 'sala-das-palavras-miniatura.webp']
PILOTOS = {'aulas/estrategias-de-estudo-8ano': {'cenario': 'sala-das-palavras', 'perfil': '8-9', 'banco': 'orientados'}}
CONVITE = {'titulo': 'Parabéns! Você terminou as {total} atividades!', 'pergunta': 'Quer aprender a formar frases?',
           'apoio': 'Agora você pode juntar palavras para contar o que acontece nas imagens.',
           'aceitar': 'Quero aprender a formar frases', 'recusar': 'Terminar por hoje'}
PERFIS = {'5-6', '7', '8-9', 'medio'}


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def webp_size(p):
    data = Path(p).read_bytes()
    if data[:4] != b'RIFF' or data[8:12] != b'WEBP':
        raise ValueError('não é WebP: ' + str(p))
    chunk = data[12:16]
    if chunk == b'VP8X':
        w = 1 + int.from_bytes(data[24:27], 'little'); h = 1 + int.from_bytes(data[27:30], 'little')
    elif chunk == b'VP8L':
        b = data[21:25]; w = 1 + (((b[1] & 0x3F) << 8) | b[0]); h = 1 + (((b[3] & 0xF) << 10) | (b[2] << 2) | ((b[1] & 0xC0) >> 6))
    elif chunk == b'VP8 ':
        w = int.from_bytes(data[26:28], 'little') & 0x3FFF; h = int.from_bytes(data[28:30], 'little') & 0x3FFF
    else:
        raise ValueError('cabeçalho WebP desconhecido: ' + str(p))
    return w, h


def validar_catalogo():
    cat = json.loads((LIB / 'catalogo.json').read_text(encoding='utf-8'))
    erros = []
    if not re.fullmatch(r'\d+\.\d+\.\d+', cat.get('versao', '')):
        erros.append('catálogo sem versão semântica')
    if set(cat.get('perfis_etarios', {})) != PERFIS:
        erros.append('perfis etários devem ser exatamente ' + str(sorted(PERFIS)))
    ids = set()
    for c in cat.get('cenarios', []):
        for campo in ('id', 'versao', 'nome', 'descricao', 'estado', 'perfis', 'proporcao', 'direitos', 'interface', 'resolucao', 'arquivos'):
            if campo not in c:
                erros.append(f"{c.get('id')}: campo ausente {campo}")
        if c['id'] in ids:
            erros.append('id repetido ' + c['id'])
        ids.add(c['id'])
        if not set(c.get('perfis', [])) <= PERFIS:
            erros.append(c['id'] + ': perfil desconhecido')
        if c.get('estado') == 'disponivel':
            arq = c.get('arquivos') or {}
            for chave in ('desktop', 'movel'):
                f = LIB / arq.get(chave, '')
                if not f.is_file():
                    erros.append(f"{c['id']}: arquivo {chave} ausente"); continue
                w, h = webp_size(f)
                if abs(w / h - 16 / 9) > 0.01:
                    erros.append(f"{c['id']}: {chave} não é 16:9 ({w}x{h})")
                if chave == 'desktop' and w < 1280:
                    erros.append(f"{c['id']}: desktop com menos de 1280 px ({w})")
                if chave == 'movel' and w > 1024:
                    erros.append(f"{c['id']}: versão móvel maior que 1024 px ({w})")
            if not c['direitos'].get('origem'):
                erros.append(c['id'] + ': direitos sem origem')
            if 'provisoria' in c.get('versao', '') and 'substituicao' not in c['direitos']:
                erros.append(c['id'] + ': imagem provisória sem regra de substituição')
        elif c.get('estado') != 'planejado':
            erros.append(c['id'] + ': estado desconhecido ' + str(c.get('estado')))
    return cat, erros


def banco_da_aula(aula):
    html = (ROOT / aula / 'apoio/index.html').read_text(encoding='utf-8')
    bloco = re.search(r'<script id="apoio-dados" type="application/json">(.*?)</script>', html, re.S).group(1)
    prov = json.loads((ROOT / aula / 'apoio/proveniencia.json').read_text(encoding='utf-8'))
    if hashlib.sha256(bloco.encode('utf-8')).hexdigest() != prov['banco_sha256']:
        raise ValueError(aula + ': banco apoio-dados diferente do hash de proveniência (sessão 1 alterada)')
    return json.loads(bloco), html


def validar_frases(cat):
    conj = json.loads((LIB / 'frases-conjunto-1.json').read_text(encoding='utf-8'))
    erros = []
    if conj.get('sessao') != 2 or conj.get('conjunto') != 1:
        erros.append('conjunto deve ser sessão 2, conjunto 1')
    itens = conj.get('atividades', [])
    if len(itens) != 12:
        erros.append(f'conjunto 1 com {len(itens)} atividades; esperado 12')
    if conj.get('convite') != CONVITE:
        erros.append('textos do convite diferentes do pedido')
    ids, assinaturas = set(), set()
    arte = conj.get('arte', {})
    vocab = set(conj.get('nomes_objetos', {}))
    for a in itens:
        if a['id'] in ids:
            erros.append('id repetido ' + a['id'])
        ids.add(a['id'])
        if a.get('tipo') not in ('imagem-frase', 'frase-imagem'):
            erros.append(a['id'] + ': tipo desconhecido')
        if len(a.get('opcoes', [])) != 3:
            erros.append(a['id'] + ': precisa de 3 opções')
        if not (0 <= a.get('correta', -1) < len(a.get('opcoes', []))):
            erros.append(a['id'] + ': índice da resposta inválido')
        if a['tipo'] == 'imagem-frase':
            if a['opcoes'][a['correta']] != a['frase']:
                erros.append(a['id'] + ': a opção correta deve ser a própria frase')
            if len(set(a['opcoes'])) != 3:
                erros.append(a['id'] + ': opções repetidas')
        else:
            if a['opcoes'][a['correta']] != a['cena']:
                erros.append(a['id'] + ': a imagem correta deve ser a cena da frase')
            if len({json.dumps(o, sort_keys=True) for o in a['opcoes']}) != 3:
                erros.append(a['id'] + ': imagens repetidas')
        for chave in ('pessoa', 'objeto'):
            if chave not in a['cena']:
                erros.append(a['id'] + f': cena sem {chave}')
        for palavra in [a['cena'].get('objeto'), a['cena'].get('lugar')] + [o.get(k) for o in a['opcoes'] if isinstance(o, dict) for k in ('objeto', 'lugar')]:
            if palavra and (palavra not in vocab or palavra not in arte):
                erros.append(a['id'] + ': palavra fora do vocabulário/arte: ' + str(palavra))
        if a['cena']['pessoa'] not in conj.get('personagens', {}):
            erros.append(a['id'] + ': personagem desconhecido')
        if not a.get('pista'):
            erros.append(a['id'] + ': sem pista')
        if not a['frase'].endswith('.') or len(a['frase'].split()) > 7:
            erros.append(a['id'] + ': frase deve ser curta e terminar com ponto')
        assinatura = (a['tipo'], a['frase'])
        if assinatura in assinaturas:
            erros.append(a['id'] + ': atividade literalmente repetida')
        assinaturas.add(assinatura)
    # Vocabulário dentro da sessão 1 das aulas piloto (banco da própria área + geral).
    for aula, cfg in PILOTOS.items():
        dados, html = banco_da_aula(aula)
        palavras = {w[0] for w in dados['bancos'][cfg['banco']]} | {w[0] for w in dados['bancos']['geral']}
        fora = sorted(vocab - palavras)
        if fora:
            erros.append(f'{aula}: palavras da sessão 2 fora da sessão 1: {fora}')
        if f'data-cenario="{cfg["cenario"]}"' not in html or f'data-perfil="{cfg["perfil"]}"' not in html:
            erros.append(aula + ': index.html do apoio sem o cenário/perfil do piloto')
        if 'cenarios/frases.js' not in html or 'cenarios/cenarios.css' not in html:
            erros.append(aula + ': index.html do apoio sem a camada de cenários')
        if not any(c['id'] == cfg['cenario'] and c['estado'] == 'disponivel' and cfg['perfil'] in c['perfis'] for c in cat['cenarios']):
            erros.append(aula + ': cenário do piloto não está disponível no catálogo para o perfil')
        for f in RUNTIME:
            copia = ROOT / aula / 'apoio/cenarios' / f
            if not copia.is_file() or sha(copia) != sha(LIB / f):
                erros.append(f'{aula}: cópia divergente ou ausente de {f}')
    # Arte igual à da sessão 1 (visuais.js), para o estudante ver o mesmo desenho.
    visuais = (ROOT / next(iter(PILOTOS)) / 'apoio/visuais.js').read_text(encoding='utf-8')
    cores = {'${ink}': '#264653', '${gold}': '#d8ae60', '${teal}': '#62b6aa', '${paper}': '#fff9e8'}
    for palavra, corpo in arte.items():
        chave = palavra if re.fullmatch(r'[A-Z]+', palavra) else "'" + palavra + "'"
        m = re.search(r'\n ' + re.escape(chave) + r':`(.*?)`,?\n', visuais, re.S)
        esperado = m.group(1) if m else None
        for token, cor in cores.items():
            esperado = esperado.replace(token, cor) if esperado else esperado
        if esperado != corpo:
            erros.append('arte de ' + palavra + ' não corresponde a visuais.js')
    return conj, erros


def main():
    cat, erros = validar_catalogo()
    conj, erros2 = validar_frases(cat)
    erros += erros2
    if erros:
        print('\n'.join('ERRO: ' + e for e in erros))
        sys.exit(1)
    disponiveis = [c['id'] for c in cat['cenarios'] if c['estado'] == 'disponivel']
    print(f"CENÁRIOS: catálogo {cat['versao']} com {len(cat['cenarios'])} ambientes ({len(disponiveis)} disponível: {', '.join(disponiveis)}); "
          f"sessão 2 conjunto {conj['conjunto']} com {len(conj['atividades'])} frases; piloto(s): {', '.join(PILOTOS)}; banco da sessão 1 preservado.")


if __name__ == '__main__':
    main()
