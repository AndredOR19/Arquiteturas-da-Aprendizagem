#!/usr/bin/env python3
"""Monta e valida os arquivos gerados de uma aula do padrão app.js v2.0.0.

Uso: python3 ferramentas/montar-aula.py aulas/<slug>

Fontes (autorais):
  aulas/<slug>/conteudo.json            -> conteúdo da aula (publicado; igual ao EO-172)
  aulas/<slug>/professor/recuperacao.json -> banco da recuperação adaptativa (NÃO publicado)

Saídas (geradas, sobrescritas):
  aulas/<slug>/app.js               = ferramentas/motor-app.head.js + Promise.resolve(<conteudo>).then(init)
  aulas/<slug>/recuperacao-dados.js = window.RecuperacaoDados = [[associacao, ordem, aplicacao] x 26]

O motor (motor-app.head.js) é o cabeçalho genérico extraído de aulas/04-11-2026-estudos-orientados-172/app.js
(15.648 bytes, sem literais de aula). Não editar à mão os arquivos gerados.
"""
import json, sys, pathlib

REPO = pathlib.Path(__file__).resolve().parent.parent
HEAD = (REPO / 'ferramentas' / 'motor-app.head.js').read_text(encoding='utf-8')
GEN_PISTA = ["Observe o objetivo do exemplo.", "Relacione a ação com o que ela permite verificar."]


def erro(msg):
    print(f"ERRO: {msg}", file=sys.stderr)
    sys.exit(1)


def validar_conteudo(d, slug):
    obr = ['id', 'escola', 'turma', 'componente', 'data', 'titulo', 'pergunta', 'resumo',
           'habilidades', 'continuidade', 'fontes', 'blocos', 'exploracao', 'glossario',
           'dicionario', 'percursos']
    faltam = [k for k in obr if k not in d]
    if faltam:
        erro(f"{slug}: chaves ausentes em conteudo.json: {faltam}")
    if d['id'] != slug:
        erro(f"{slug}: conteudo.id={d['id']!r} difere do diretório")
    if 'data' in d and re_data(d):
        erro(f"{slug}: convenção da aula: sem data no conteúdo (usar 'não fixada')")
    esperado=d.get('quantidade_percursos',26)
    if esperado not in (26,32):
        erro('Total curricular não suportado')
    if len(d['percursos']) != esperado:
        erro(f"{slug}: {len(d['percursos'])} percursos (esperados {esperado})")
    for i, p in enumerate(d['percursos']):
        for k in ['titulo', 'fase', 'explicacao', 'pergunta', 'justificativa', 'ponto', 'acao']:
            if not str(p.get(k, '')).strip():
                erro(f"{slug}: percurso {i+1} sem {k}")
        alts = p.get('alternativas')
        if not isinstance(alts, list) or len(alts) != 3 or any(not str(a).strip() for a in alts):
            erro(f"{slug}: percurso {i+1} precisa de 3 alternativas não vazias")
        if not isinstance(p.get('correta'), int) or p['correta'] not in (0, 1, 2):
            erro(f"{slug}: percurso {i+1} correta inválida")
        pis = p.get('pistas')
        if not isinstance(pis, list) or len(pis) != 3:
            erro(f"{slug}: percurso {i+1} precisa de 3 pistas")
        ret = p.get('retorno', {})
        if not isinstance(ret, dict) or set(ret) - {'0', '1', '2'}:
            erro(f"{slug}: percurso {i+1} retorno deve ter chaves '0'/'1'/'2'")
        if str(p['correta']) not in ret:
            erro(f"{slug}: percurso {i+1} sem retorno para a alternativa correta")
    if len(d['blocos']) != 4:
        erro(f"{slug}: {len(d['blocos'])} blocos (esperados 4: Âncora/Mecânica/Circuito/Dialética)")
    for b in d['blocos']:
        for k in ['titulo', 'texto', 'ancora']:
            if not str(b.get(k, '')).strip():
                erro(f"{slug}: bloco sem {k}")
        if not isinstance(b.get('fonte'), int) or not (0 <= b['fonte'] < len(d['fontes'])):
            erro(f"{slug}: bloco '{b.get('titulo')}' com fonte inválida")
    if len(d['exploracao']) != 3:
        erro(f"{slug}: {len(d['exploracao'])} cartões de exploração (esperados 3)")
    for e in d['exploracao']:
        if not (isinstance(e, list) and len(e) == 3):
            erro(f"{slug}: cartão de exploração deve ser [título, subtítulo, texto]: {e!r}")
    fases = {}
    for p in d['percursos']:
        fases[p['fase']] = fases.get(p['fase'], 0) + 1
    print(f"  fases: {fases}")
    if not isinstance(d['glossario'], dict) or not isinstance(d['dicionario'], dict):
        erro(f"{slug}: glossario e dicionario devem ser objetos")
    if len(d['habilidades']) < 1:
        erro(f"{slug}: registrar habilidades")
    tam = len(json.dumps(d, ensure_ascii=False))
    if tam > 60000:
        print(f"  AVISO: conteudo.json tem {tam} bytes (cota do relatório no receptor é 60 KB; "
              f"o relatório final inclui registros além do conteúdo)")
    print(f"  conteudo.json OK ({tam} bytes, {len(d['percursos'])} percursos, {len(d['blocos'])} blocos, "
          f"{len(d['fontes'])} fontes)")


def re_data(d):
    import re
    return bool(re.search(r'\d{2}/\d{2}/\d{4}', str(d.get('data', ''))))


def validar_recuperacao(r, slug, esperado=32):
    if not isinstance(r, list) or len(r) != esperado:
        erro(f"{slug}: recuperacao.json precisa de {esperado} entradas (recebi {len(r) if isinstance(r, list) else 'não-lista'})")
    for i, e in enumerate(r):
        for k in ['conceito', 'explicacao']:
            if not str(e.get(k, '')).strip():
                erro(f"{slug}: recuperação {i+1} sem {k}")
        for parte, campos in (('assoc', ['pergunta', 'alternativas', 'correta', 'retorno']),
                              ('apl', ['pergunta', 'alternativas', 'correta', 'retorno'])):
            b = e.get(parte)
            if not isinstance(b, dict):
                erro(f"{slug}: recuperação {i+1} sem {parte}")
            if not str(b.get('pergunta', '')).strip():
                erro(f"{slug}: recuperação {i+1}/{parte} sem pergunta")
            if not isinstance(b.get('alternativas'), list) or len(b['alternativas']) != 3:
                erro(f"{slug}: recuperação {i+1}/{parte} precisa de 3 alternativas")
            if not isinstance(b.get('correta'), int) or b['correta'] not in (0, 1, 2):
                erro(f"{slug}: recuperação {i+1}/{parte} correta inválida")
            if not str(b.get('retorno', '')).strip():
                erro(f"{slug}: recuperação {i+1}/{parte} sem retorno")
        o = e.get('ordem')
        if not isinstance(o, dict) or not isinstance(o.get('passos'), list) or len(o['passos']) != 3 \
                or not str(o.get('retorno', '')).strip():
            erro(f"{slug}: recuperação {i+1}/ordem precisa de 3 passos e retorno")


def gerar_recuperacao_dados(r):
    saida = []
    for e in r:
        base = {'conceito': e['conceito'], 'explicacao': e['explicacao'],
                'pistas': GEN_PISTA + [e['explicacao']]}
        saida.append([
            {**base, 'titulo': 'Relacionar · ' + e['conceito'], 'tipo': 'associacao',
             'pergunta': e['assoc']['pergunta'], 'alternativas': e['assoc']['alternativas'],
             'correta': e['assoc']['correta'], 'retorno': e['assoc']['retorno']},
            {**base, 'titulo': 'Organizar · ' + e['conceito'], 'tipo': 'ordem',
             'pergunta': 'Monte uma sequência coerente para este procedimento. Toque nas três etapas e confira.',
             'passos': e['ordem']['passos'], 'retorno': e['ordem']['retorno']},
            {**base, 'titulo': 'Aplicar · ' + e['conceito'], 'tipo': 'aplicacao',
             'pergunta': e['apl']['pergunta'], 'alternativas': e['apl']['alternativas'],
             'correta': e['apl']['correta'], 'retorno': e['apl']['retorno']},
        ])
    return saida


def main():
    if len(sys.argv) != 2:
        erro("uso: montar-aula.py aulas/<slug>")
    caminho = sys.argv[1].rstrip('/')
    pasta = REPO / caminho
    if not pasta.is_dir():
        erro(f"diretório {caminho} não existe")
    slug = caminho.split('/')[-1]
    print(f"[montar-aula] {caminho}")

    d = json.loads((pasta / 'conteudo.json').read_text(encoding='utf-8'))
    validar_conteudo(d, slug)

    r = json.loads((pasta / 'professor' / 'recuperacao.json').read_text(encoding='utf-8'))
    validar_recuperacao(r, slug, len(d['percursos']))

    conteudo_js = json.dumps(d, ensure_ascii=False, separators=(',', ':'))
    cauda = ('Promise.resolve(' + conteudo_js + ').then(d=>init(d))'
             '.catch(e=>{document.getElementById("title").textContent=e.message});')
    (pasta / 'app.js').write_text(HEAD.rstrip('\n') + '\n' + cauda + '\n', encoding='utf-8')

    rec_js = json.dumps(gerar_recuperacao_dados(r), ensure_ascii=False, separators=(',', ':'))
    (pasta / 'recuperacao-dados.js').write_text('window.RecuperacaoDados=' + rec_js + ';\n',
                                                encoding='utf-8')
    print(f"  app.js gerado ({len(HEAD) + len(cauda)} bytes); "
          f"recuperacao-dados.js gerado ({len(rec_js) + 30} bytes)")
    print(f"[montar-aula] concluído")


if __name__ == '__main__':
    main()
