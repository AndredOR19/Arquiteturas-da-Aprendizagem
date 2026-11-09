#!/usr/bin/env python3
"""Validador de linguagem clara (Prompt mestre 3.9, seção 38) para aulas-gei.

Confere, atividade por atividade, o texto que o estudante realmente lê (extraído por
linguagem_extrair.cjs, com a camada de exibição aplicada) e separa:
  - BLOQUEIOS: problemas objetivamente verificáveis (rótulo interno visível, jargão no
    comando, comando sem ação, exemplo com os dados do próprio item, situação ausente,
    pergunta vazia). Qualquer bloqueio impede a entrega (contrato_entrega.py).
  - AVISOS: questões interpretativas (frase longa, jargão no conteúdo do banco, palavra
    difícil além do glossário mostrado, muitas opções, opção longa). Geram "revisao_humana".
A ausência de alertas não comprova compreensão pelo estudante: a aprovação pedagógica exige
revisão humana e observação em sala ("Olhe esta atividade e me diga: o que você precisa fazer?").

Uso: python3 automacoes/aulas/validar_linguagem.py [aulas/<aula> ...] [--saida DIR] [--sem-bloqueio]
"""
import argparse, datetime, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AULAS = ['pesquisa-e-dados-7ano', 'estrategias-de-estudo-8ano', 'arquivo-independencias-9ano', 'convivencia-e-dialogo-9ano', 'laboratorio-teste-justo-9ano']
ROTULOS_INTERNOS = {'Dado observado', 'Relação explicada', 'Efeito ou resultado', 'Limite da conclusão', 'Sustentado', 'Não sustentado', 'Sustentado neste caso', 'Compatível com o caso', 'Exige correção', 'Mantém os limites', 'Amplia sem evidência'}
JARGAO = re.compile(r"\b(extrapol\w*|sustentad\w*|alcance|procedimento|operaç(ão|ões) cognitiva\w*|transfer(ir|ência)|critério de comparação|generaliz\w*|delimit\w*|explicit\w*|síntese|interpretaç\w*|evidência|restrição|equivalente|conservar as frequências|registros fictícios|unidade)\b", re.I)
ACAO = re.compile(r"^(coloque|ligue|escolha|conte|some|calcule|mude|monte|decida|leia|toque|faça|veja|separe|use|marque|compare|arraste|observe|para cada|qual|quais|quantos|quantas|entre o copo|deixe|cada |já temos|isso é|o que|onde|como)\b", re.I)
PALAVRAS_MAX = 22

def sem_casos(texto, casos):
    t = texto or ''
    for c in casos:
        t = t.replace('«' + c + '»', '«caso»').replace(c, '«caso»')
    return re.sub(r'«[^»]*»', '«caso»', t)

def frases(texto):
    return [f for f in re.split(r'(?<=[.!?])\s+', texto or '') if f.strip()]

def avaliar_item(it, casos):
    bloqueios, avisos = [], []
    visiveis = [it['titulo'], it['comando'], *it['perguntas'], *it['opcoes']]
    internos = sorted({v for v in visiveis if v.strip() in ROTULOS_INTERNOS})
    if internos:
        bloqueios.append({'regra': 'rotulo_interno_visivel', 'detalhe': internos})
    for campo in ('titulo', 'comando'):
        m = JARGAO.search(sem_casos(it[campo], casos))
        if m:
            bloqueios.append({'regra': 'jargao_no_comando', 'detalhe': campo + ': ' + m.group(0)})
    comando = sem_casos(it['comando'], casos).strip()
    if len(comando) < 15 or comando[-1] not in '.?!':
        bloqueios.append({'regra': 'pergunta_vazia', 'detalhe': comando})
    if not ACAO.match(comando):
        bloqueios.append({'regra': 'comando_sem_acao', 'detalhe': comando[:80]})
    ex = it.get('exemplo')
    if not ex:
        bloqueios.append({'regra': 'exemplo_ausente', 'detalhe': 'sem exemplo de outro caso'})
    elif ex['caso'] == it['caso_titulo'] or ex.get('operandos_iguais'):
        bloqueios.append({'regra': 'exemplo_do_proprio_caso', 'detalhe': ex['caso']})
    if not it.get('situacao') or len(it['situacao']) < 40:
        bloqueios.append({'regra': 'situacao_ausente', 'detalhe': (it.get('situacao') or '')[:60]})
    for campo in ('titulo', 'comando'):
        for f in frases(it[campo]):
            if len(f.split()) > PALAVRAS_MAX:
                avisos.append({'regra': 'frase_longa', 'detalhe': campo + ': ' + str(len(f.split())) + ' palavras'})
    conteudo = [*it['perguntas'], *it['opcoes']]
    jargao_conteudo = sorted({m.group(0).lower() for s in conteudo for m in [JARGAO.search(sem_casos(s, casos))] if m})
    if jargao_conteudo:
        avisos.append({'regra': 'jargao_no_conteudo', 'detalhe': jargao_conteudo})
    faltam = [t for t in it.get('glossario_encontrado', []) if t not in it.get('glossario_mostrado', [])]
    if faltam:
        avisos.append({'regra': 'palavra_dificil_alem_do_glossario', 'detalhe': faltam})
    if len(it['opcoes']) > 6:
        avisos.append({'regra': 'muitas_opcoes', 'detalhe': len(it['opcoes'])})
    if any(len(o) > 160 for o in it['opcoes']):
        avisos.append({'regra': 'opcao_longa', 'detalhe': max(len(o) for o in it['opcoes'])})
    estado = 'bloqueado' if bloqueios else ('revisao_humana' if avisos else 'aprovado_automatico')
    return {'id': it['id'], 'rota': it['rota'], 'caso': it['caso_titulo'], 'kind': it['kind'], 'titulo': it['titulo'], 'comando': it['comando'], 'antes': it['original'], 'estado': estado, 'bloqueios': bloqueios, 'avisos': avisos}

def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('aulas', nargs='*', default=['aulas/' + a for a in AULAS])
    p.add_argument('--saida', type=Path, default=ROOT / 'automacoes/aulas/evidencias/linguagem')
    p.add_argument('--sem-bloqueio', action='store_true', help='não encerrar com erro quando houver bloqueios')
    a = p.parse_args()
    dirs = [str((ROOT / x).resolve().relative_to(ROOT)) for x in a.aulas]
    raw = subprocess.run(['node', str(ROOT / 'automacoes/aulas/linguagem_extrair.cjs'), *dirs], cwd=ROOT, check=True, capture_output=True, text=True).stdout
    extraidos = json.loads(raw)
    relatorio = {'protocolo': 'linguagem-clara-3.9', 'gerado_em': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'criterios': {'bloqueios': ['rotulo_interno_visivel', 'jargao_no_comando', 'pergunta_vazia', 'comando_sem_acao', 'exemplo_ausente', 'exemplo_do_proprio_caso', 'situacao_ausente'], 'avisos': ['frase_longa', 'jargao_no_conteudo', 'palavra_dificil_alem_do_glossario', 'muitas_opcoes', 'opcao_longa']}, 'limite': 'Filtro preliminar. Ausência de alerta não comprova compreensão; exige revisão humana e observação com estudantes.', 'aulas': {}}
    total = {'atividades': 0, 'bloqueado': 0, 'revisao_humana': 0, 'aprovado_automatico': 0}
    linhas = []
    for ex in extraidos:
        itens = [avaliar_item(it, ex['casos']) for it in ex['itens']]
        contagem = {k: sum(1 for i in itens if i['estado'] == k) for k in ('bloqueado', 'revisao_humana', 'aprovado_automatico')}
        regras = {}
        for i in itens:
            for b in i['bloqueios']:
                regras.setdefault('bloqueio:' + b['regra'], 0); regras['bloqueio:' + b['regra']] += 1
            for w in i['avisos']:
                regras.setdefault('aviso:' + w['regra'], 0); regras['aviso:' + w['regra']] += 1
        relatorio['aulas'][ex['aula']] = {'titulo': ex['titulo'], 'revisao': ex['revisao'], 'conteudo_sha256': ex['conteudo_sha256'], 'clareza_sha256': ex['clareza_sha256'], 'abertura': ex['abertura'], 'atividades': len(itens), 'bloqueios': sum(len(i['bloqueios']) for i in itens), 'avisos': sum(len(i['avisos']) for i in itens), **contagem, 'regras': dict(sorted(regras.items())), 'itens': itens}
        total['atividades'] += len(itens)
        for k in contagem: total[k] += contagem[k]
        linhas.append(f"{ex['aula']}: {len(itens)} atividades · bloqueadas {contagem['bloqueado']} · revisão humana {contagem['revisao_humana']} · aprovadas automaticamente {contagem['aprovado_automatico']}")
        if ex.get('dicionario'):
            (a.saida / 'dicionarios').mkdir(parents=True, exist_ok=True)
            (a.saida / 'dicionarios' / (ex['aula'] + '.json')).write_text(json.dumps({'aula': ex['aula'], 'kind': ex['kind'], 'dicionario': ex['dicionario'], 'antes_depois': [{'id': i['id'], 'antes': i['antes'], 'depois': {'title': i['titulo'], 'command': i['comando']}} for i in itens]}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    relatorio['total'] = total
    a.saida.mkdir(parents=True, exist_ok=True)
    (a.saida / 'relatorio.json').write_text(json.dumps(relatorio, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    resumo = ['# Validação de linguagem clara — ' + relatorio['gerado_em'], '', *linhas, '', f"Total: {total['atividades']} atividades · bloqueadas {total['bloqueado']} · revisão humana {total['revisao_humana']} · aprovadas automaticamente {total['aprovado_automatico']}", '', relatorio['limite'], '']
    (a.saida / 'resumo.md').write_text('\n'.join(resumo), encoding='utf-8')
    print('\n'.join(linhas)); print(resumo[-4])
    if total['bloqueado'] and not a.sem_bloqueio:
        print('BLOQUEIOS encontrados; consulte ' + str(a.saida / 'relatorio.json'), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
