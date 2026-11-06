"""Contrato de publicação do apoio opcional: 57 atividades reais, no mínimo."""
import json
import re
from pathlib import Path


def validar_apoio(path):
    source = Path(path).read_text(encoding='utf-8')
    match = re.search(r'<script id="apoio-dados" type="application/json">(.*?)</script>', source, re.S)
    if not match:
        raise ValueError('Apoio à leitura sem banco verificável de percursos')
    data = json.loads(match.group(1))
    tasks = data.get('percursos', [])
    if len(tasks) < 57:
        raise ValueError('O apoio à leitura exige no mínimo 57 percursos')
    ids = [t.get('id') for t in tasks]
    pairs = [(t.get('modo'), t.get('palavra')) for t in tasks]
    if not all(ids) or len(set(ids)) != len(ids) or len(set(pairs)) != len(pairs):
        raise ValueError('Percursos de apoio duplicados ou sem identificação')
    if len({t.get('modo') for t in tasks}) < 4:
        raise ValueError('Exigir variação: imagem, palavra, sílaba e contexto')
    for bank in data.get('bancos', {}).values():
        for task in tasks:
            if task.get('modo') not in {'imagem', 'palavra', 'silaba', 'contexto', 'letra', 'final', 'montagem', 'frase', 'aplicar'}:
                raise ValueError('Operação de apoio desconhecida')
            index = task.get('palavra')
            if type(index) is not int or not 0 <= index < len(bank):
                raise ValueError('Percurso aponta para palavra inexistente')
            word = bank[index]
            if len(word) != 5 or not all(word) or ''.join(word[2]) != word[0]:
                raise ValueError('Palavra, imagem, sílabas e frase são obrigatórias e coerentes')
    if not data.get('bancos'):
        raise ValueError('Banco de palavras ausente')
    return data


if __name__ == '__main__':
    data = validar_apoio(Path(__file__).with_name('index.html'))
    print('Apoio à leitura validado:', len(data['percursos']), 'percursos por área')
