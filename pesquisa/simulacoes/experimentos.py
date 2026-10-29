"""Despachante limitado para ensaios formais e comparação sintética de planejamento."""
import argparse
import hashlib
import json
from pathlib import Path
import platform
import os
from quantico import demonstracoes
from ux import executar as executar_ux

HERE = Path(__file__).resolve().parent


def salvar_json(path, dado):
    path.write_text(json.dumps(dado, ensure_ascii=False, indent=2, allow_nan=False)+'\n', encoding='utf-8')


def executar(saida, semente=20261029):
    pasta = Path(saida); pasta.mkdir(parents=True, exist_ok=True)
    if any(pasta.iterdir()):
        raise ValueError('Use uma pasta vazia para preservar execuções anteriores.')
    quantum = demonstracoes(semente)
    ux = executar_ux()
    # Reutiliza o motor estatístico existente, sem atribuir efeito a um layout específico.
    from modelos import executar as planejar
    import numpy
    import scipy
    config = json.loads((HERE/'cenarios/individuos.json').read_text())
    config.update(id='ux-planejamento-20261029', titulo='Sensibilidade de um futuro piloto de materiais',
        unidades_por_grupo=[30, 60], efeitos_pp=[-5, 0, 5], perdas=[0.2])
    planejamento = planejar(config, 5000, semente)
    salvar_json(pasta/'quantico.json', quantum)
    salvar_json(pasta/'ux.json', ux)
    salvar_json(pasta/'planejamento.json', planejamento)
    linhas = ['# Ensaios de interface e circuitos quânticos', '',
        'Dados sintéticos e modelos formais. Nenhum estudante observado; nenhuma aula alterada por este executor.', '',
        '## Políticas de interface', '',
        '| Proposta | Casos enumerados | Casos com conflito de requisito |', '| --- | ---: | ---: |']
    for nome, v in ux['variantes'].items():
        linhas.append(f"| {nome} | {v['total_casos']} | {v['casos_com_conflito']} |")
    linhas += ['', 'Os conflitos são consequência das regras programadas, não medidas de usabilidade ou eficácia. A grade inclui recuperação, teclado, ausência de voz/colega e movimento reduzido. Não representa prevalências.', '',
        '## Circuitos ideais simulados em CPU', '', '| Circuito | Probabilidades exatas (arredondadas) |', '| --- | --- |']
    for nome, r in quantum.items():
        probabilidades = ', '.join(f'{k}: {v:.3f}' for k,v in r['probabilidades'].items())
        linhas.append(f'| {nome} | {probabilidades} |')
    linhas += ['', 'Cada circuito tem 4.096 disparos com reposição/preparação; frequências amostrais e amplitudes constam no JSON. Não há hardware, ruído, medição intermediária ou vantagem quântica demonstrada.', '',
        '## Planejamento de futura comparação', '',
        '30.000 estudos sintéticos (6 cenários × 5.000). Efeito adicional assumido −5, 0 ou +5 pontos na probabilidade de acerto; perda aleatória de 20%. Nenhum efeito foi estimado para as propostas de interface.', '',
        '| Pessoas iniciais por grupo | Efeito assumido (pp) | Rejeição bilateral | Erro Monte Carlo |', '| ---: | ---: | ---: | ---: |']
    for r in planejamento['cenarios']:
        linhas.append(f"| {r['unidades_por_grupo']} | {r['efeito_assumido_pp']} | {r['frequencia_rejeicao']:.4f} | {r['erro_monte_carlo']:.4f} |")
    linhas += ['', 'Esta grade usa participantes independentes. Para intervenções organizadas por turma, usar o modelo turmas existente; não tratar alunos da mesma turma como unidades independentes.', '',
        '## Decisão de engenharia', '',
        'Preparar protótipo com progresso visível, conquistas por investigação/recuperação, cartões por toque/teclado e voz opcional, dupla opcional, efeitos desligados e movimento reduzido. A aplicação integral na Missão Ponte e os testes com alunos permanecem pendentes. Primeiro conferir acesso sem leitura e equivalência dos comandos; depois comparar exemplos novos e relatos de desconforto.', '',
        'Referência formal: IBM Quantum Learning, Quantum circuits; IBM Quantum Documentation, Statevector. URLs e limites em ARQUITETURA_SIMULACOES.md.']
    (pasta/'RELATORIO.md').write_text('\n'.join(linhas)+'\n', encoding='utf-8')
    arquivos = ['quantico.json', 'ux.json', 'planejamento.json', 'RELATORIO.md']
    codigo = ['quantico.py', 'ux.py', 'experimentos.py', 'modelos.py', 'cenarios/individuos.json']
    hash_arquivo = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
    salvar_json(pasta/'manifesto.json', dict(schema_version='1.0.0', dados_reais=False,
        semente=semente, python=platform.python_version(), numpy=numpy.__version__, scipy=scipy.__version__, commit=os.getenv('GITHUB_SHA'),
        arquivos_sha256={p:hash_arquivo(pasta/p) for p in arquivos},
        codigo_sha256={p:hash_arquivo(HERE/p) for p in codigo}, chamadas_ia=0,
        modulos=['ux-regras', 'quantico-ideal', 'planejamento-individual']))
    return pasta


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--saida', required=True)
    parser.add_argument('--semente', type=int, default=20261029)
    args = parser.parse_args()
    pasta = executar(args.saida, args.semente)
    print((pasta/'RELATORIO.md').read_text())
