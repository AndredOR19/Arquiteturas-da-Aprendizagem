#!/usr/bin/env python3
"""produzir-aula.py — orquestração permanente da produção de uma aula-jogo.

Cadeia (adendo 05/11/2026): Planejamento → Composição pedagógica → Diagramação
→ Criação dos jogos → Validação → Publicação → Verificação → Registro.

Este orquestrador executa e registra as etapas locais:
  1. CONSULTA às bibliotecas (Arquiteturas + Diagramação via ponte local) —
     arquivos lidos, sha256 e papel de cada um; falha se algo não for encontrado
     (não presume acesso).
  2. COMPOSIÇÃO: montar-aula.py valida conteudo.json/recuperacao.json e gera
     app.js + recuperacao-dados.js.
  3. DIAGRAMAÇÃO/JOGO: conferência de sintaxe dos scripts autorais e do motor.
  4. VALIDAÇÃO: testar-aula.cjs nos dois modos (servidor simulado e recusa).
  5. APOIO DOCENTE: gerar-apoio.py.
  6. REGISTRO: professor/manifesto-producao.json com referências, fluxo
     pedagógico, modelo visual, motor, acessibilidade e evidências.

A publicação (preparar.py + workflows Pages/Vercel) NÃO roda aqui: ocorre por
push aprovado, conforme política do repositório. Uso:
  python3 ferramentas/produzir-aula.py aulas/<slug> [--sem-testes]
"""
import hashlib
import json
import os
import subprocess
import sys
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def sha256(caminho: Path) -> str:
    h = hashlib.sha256()
    with open(caminho, 'rb') as f:
        for bloco in iter(lambda: f.read(65536), b''):
            h.update(bloco)
    return h.hexdigest()


def rodar(cmd, cwd=RAIZ):
    env = dict(os.environ)
    if not (env.get('NODE_PATH') and Path(env['NODE_PATH'], 'jsdom').is_dir()):
        for cand in [Path('/home/user/domtest/node_modules'), RAIZ.parent / 'domtest' / 'node_modules']:
            if (cand / 'jsdom').is_dir():
                env['NODE_PATH'] = str(cand)
                break
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, env=env)
    return r.returncode, (r.stdout + r.stderr).strip()


def main():
    if len(sys.argv) < 2 or not sys.argv[1].startswith('aulas/'):
        sys.exit('uso: python3 ferramentas/produzir-aula.py aulas/<slug> [--sem-testes]')
    slug = sys.argv[1].rstrip('/')
    pasta = RAIZ / slug
    sem_testes = '--sem-testes' in sys.argv
    entrada_path = pasta / 'professor' / 'manifesto-entrada.json'
    if not pasta.is_dir() or not entrada_path.is_file():
        sys.exit(f'aula não encontrada ou sem professor/manifesto-entrada.json: {slug}')

    entrada = json.loads(entrada_path.read_text(encoding='utf-8'))
    estilo = entrada['componente_estilo']
    referencias_base = [
        ('prompt-mestre', RAIZ / 'PROMPT_MESTRE_AULAS_DIGITAIS.md'),
        ('agents', RAIZ / 'AGENTS.md'),
        ('fluxo-03-territorio-experiencias', RAIZ / 'prompts' / 'FLUXO_03_TERRITORIO_EXPERIENCIAS.md'),
        ('estilo-' + estilo, RAIZ / 'biblioteca-arquiteturas' / 'estilos' / f'{estilo}.md'),
        ('arquitetura-da-biblioteca', RAIZ / 'biblioteca-arquiteturas' / 'ARQUITETURA_DA_BIBLIOTECA.md'),
        ('ponte-diagramacao', RAIZ / 'ferramentas' / 'README.md'),
        ('lock-diagramacao', RAIZ / 'ferramentas' / 'biblioteca.lock.json'),
    ]
    print(f'[produzir-aula] {slug} — cadeia consulta→composição→validação→registro')

    # 1. consulta às bibliotecas — nenhum arquivo pode faltar
    referencias = []
    for papel, caminho in referencias_base:
        if not caminho.is_file():
            sys.exit(f'[FALHA] referência não encontrada: {caminho.relative_to(RAIZ)}')
        referencias.append({'papel': papel, 'caminho': str(caminho.relative_to(RAIZ)), 'sha256': sha256(caminho)})
        print(f'  consulta: {caminho.relative_to(RAIZ)}')

    # 2. composição pedagógica
    codigo, saida = rodar([sys.executable, 'ferramentas/montar-aula.py', slug])
    print(saida)
    if codigo != 0:
        sys.exit('[FALHA] montar-aula.py reprovou o conteúdo')

    # 3. diagramação/jogo — sintaxe dos scripts
    conteudo = json.loads((pasta / 'conteudo.json').read_text(encoding='utf-8'))
    for js in ['app.js', 'estudo.js', 'coleta.js', 'recuperacao-dados.js']:
        codigo, saida = rodar(['node', '--check', str(pasta / js)])
        if codigo != 0:
            sys.exit(f'[FALHA] sintaxe {js}:\n{saida}')
        print(f'  sintaxe OK: {js}')
    jogo = entrada.get('script_jogo')
    if jogo:
        codigo, saida = rodar(['node', '--check', str(pasta / jogo)])
        if codigo != 0:
            sys.exit(f'[FALHA] sintaxe {jogo}:\n{saida}')
        print(f'  sintaxe OK: {jogo}')

    # 4. validação funcional (dois modos)
    verificacoes = None
    if not sem_testes:
        resultados = {}
        for modo in ['servidor', 'recusa']:
            codigo, saida = rodar(['node', 'ferramentas/testar-aula.cjs', slug, modo])
            resultados[modo] = saida
            if codigo != 0 or 'FALHA' in saida or 'aprovadas' not in saida:
                sys.exit(f'[FALHA] teste modo {modo}:\n{saida}')
        aprovadas = [l for l in resultados['servidor'].splitlines() if 'aprovadas' in l]
        print(aprovadas[-1] if aprovadas else resultados['servidor'])
        aprovadas_r = [l for l in resultados['recusa'].splitlines() if 'aprovadas' in l]
        print(aprovadas_r[-1] if aprovadas_r else resultados['recusa'])
        verificacoes = {'modo_servidor': resultados['servidor'].splitlines()[-2:],
                        'modo_recusa': resultados['recusa'].splitlines()[-2:]}

    # 5. apoio docente
    codigo, saida = rodar([sys.executable, 'ferramentas/gerar-apoio.py', slug])
    print(saida)
    if codigo != 0:
        sys.exit('[FALHA] gerar-apoio.py')

    # 6. registro — manifesto de produção
    fases = {}
    for p in conteudo['percursos']:
        fases[p['fase']] = fases.get(p['fase'], 0) + 1
    manifesto = {
        'versao': '1.0.0',
        'gerado_em': str(date.today()),
        'aula': conteudo['id'],
        'referencias_utilizadas': referencias,
        'fluxo_pedagogico': {
            'padrao': 'AEE/MACI — 01 ENTENDER, 02 OBSERVAR, 03 PERCURSOS, 04 EXPLICAR',
            'fases': fases,
            'percursos': len(conteudo['percursos']),
            'habilidades': conteudo['habilidades'],
        },
        'modelo_visual': {
            'fluxo': entrada['fluxo_visual'],
            'estilo_componente': estilo,
            'modalidade_principal': entrada['modalidade_principal'],
            'identidade_visual': entrada['identidade_visual'],
            'justificativa_visual': entrada['justificativa_visual'],
        },
        'motor_jogo': entrada['motor_jogo'],
        'acessibilidade': entrada['acessibilidade'],
        'verificacoes': verificacoes,
        'limitacoes': [
            'Biblioteca de Diagramação (AndredOR19/Biblioteca-de-Diagramacao, commit d10a9a45) é privada: '
            'não acessível nesta estação; integração pelos artefatos locais autorizados (ponte ferramentas/README.md, '
            'lock, Fluxo 03 e identidade aprovada das aulas publicadas), conforme ARQUITETURA_DA_BIBLIOTECA.md.',
        ] + entrada.get('limitacoes_extra', []),
        'publicacao': 'preparar.py + workflows existentes (Pages/Vercel por push aprovado); sem Deploy Hooks manuais',
    }
    destino = pasta / 'professor' / 'manifesto-producao.json'
    destino.write_text(json.dumps(manifesto, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'[produzir-aula] manifesto de produção: {destino.relative_to(RAIZ)}')
    print('[produzir-aula] concluído')


if __name__ == '__main__':
    main()
