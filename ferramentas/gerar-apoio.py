#!/usr/bin/env python3
"""Gera professor/apoio-docente.md a partir de conteudo.json (respostas comentadas).
Uso: python3 ferramentas/gerar-apoio.py aulas/<slug> [gabarito-do-jogo.md]
O arquivo é gerado na pasta professor/, excluída da publicação pelo preparar.py."""
import json, sys, pathlib

REPO = pathlib.Path(__file__).resolve().parent.parent

def main():
    if len(sys.argv) < 2:
        sys.exit('uso: gerar-apoio.py aulas/<slug>')
    pasta = REPO / sys.argv[1]
    slug = sys.argv[1].rstrip('/').split('/')[-1]
    d = json.loads((pasta / 'conteudo.json').read_text(encoding='utf-8'))
    linhas = [
        f"# Apoio docente — {d['titulo']}",
        '',
        f"Componente: {d['componente']} · Série: {d['turma']} · Escola: {d['escola']}",
        '',
        'Texto de apoio para mediação. **Não publicar** (pasta professor/ é excluída da publicação).',
        '',
        '## Habilidades registradas',
        '',
    ]
    for h in d['habilidades']:
        linhas.append(f'- {h}')
    linhas += ['', '## Respostas comentadas dos 26 percursos', '',
               'A = primeira alternativa, B = segunda, C = terceira. A nota inicial usa apenas a primeira resposta; pistas e recuperação não descontam.', '']
    for i, p in enumerate(d['percursos']):
        letra = 'ABC'[p['correta']]
        texto = p['alternativas'][p['correta']]
        linhas.append(f"**{i+1}. {p['titulo']}** ({p['fase']})")
        linhas.append('')
        linhes_alt = [f"{'ABC'[j]}) {a}" for j, a in enumerate(p['alternativas'])]
        linhas.extend(linhes_alt)
        linhas.append('')
        linhas.append(f"**Resposta: {letra}) {texto}**")
        linhas.append('')
        linhas.append(f"- Por quê: {p['justificativa']}")
        linhas.append(f"- Ponto cego frequente: {p['ponto']}")
        linhas.append(f"- Ação de revisão: {p['acao']}")
        linhas.append(f"- Retorno para alternativas erradas: " + ' | '.join(
            f"{'ABC'[j]}: {p['retorno'][str(j)]}" for j in range(3) if j != p['correta']))
        linhas.append('')
    linhas += ['## Mediação sugerida', '',
               '- Exposição antes das conclusões: blocos de leitura e área de exploração antes dos percursos.',
               '- Pistas progressivas: a 3ª pista revela a justificativa; não há penalização.',
               '- Recuperação adaptativa: primeiro erro acrescenta 1 experiência; segundo erro amplia para 3; limite 4 atividades por conjunto (104 no total). A nota usa somente as 26 originais.',
               '- Encerramento: pedir explicação oral de uma relação com evidência e aplicação em situação nova; o clique é indício parcial.',
               '- Registros: identificação, percursos, tentativas, pistas, apoios, tempo visível (não equivale a atenção), evidências e relatório final; exportação TXT/JSON/e-mail como alternativa à transmissão.',
               '']
    (pasta / 'professor' / 'apoio-docente.md').write_text('\n'.join(linhas), encoding='utf-8')
    print(f"apoio-docente.md gerado ({len(linhas)} linhas) em {slug}/professor/")

if __name__ == '__main__':
    main()
