#!/usr/bin/env python3
"""Apoio ao workflow `producao-biblioteca.yml`: produção com a Biblioteca de Diagramação lida no runner.

A biblioteca privada é clonada em uma pasta temporária do runner, no commit fixado por
`ferramentas/biblioteca.lock.json`, e nunca entra no repositório público. Este script só organiza as
etapas (credencial, conferência do clone, produção pela ponte existente, validadores, lista de mudanças);
a produção em si continua sendo feita por `automacoes/aulas/gerar.py` e `ferramentas/produzir.py`.
Nada aqui publica, mescla ou homologa material.
"""
import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

RAIZ_PADRAO = Path(__file__).resolve().parents[1]
CLONE_PADRAO = '_biblioteca_privada'
SEGREDOS = ('BIBLIOTECA_DEPLOY_KEY', 'BIBLIOTECA_READ_TOKEN')
PROIBIDOS = (CLONE_PADRAO + '/', '.git/')
LIMITE_BYTES = 25 * 1024 * 1024


def falhar(msg):
    print('ERRO: ' + msg, file=sys.stderr)
    sys.exit(1)


def saida(nome, valor):
    arquivo = os.environ.get('GITHUB_OUTPUT')
    if arquivo:
        with open(arquivo, 'a', encoding='utf-8') as f:
            f.write(f'{nome}={valor}\n')
    print(f'{nome}={valor}')


def resumo(texto):
    arquivo = os.environ.get('GITHUB_STEP_SUMMARY')
    if arquivo:
        with open(arquivo, 'a', encoding='utf-8') as f:
            f.write(texto + '\n')


def ler_lock(raiz):
    lock = json.loads((raiz / 'ferramentas/biblioteca.lock.json').read_text(encoding='utf-8'))
    if lock.get('repositorio') != 'AndredOR19/Biblioteca-de-Diagramacao' or not re.fullmatch(r'[0-9a-f]{40}', lock.get('commit', '')):
        falhar('ferramentas/biblioteca.lock.json inválido (repositório ou commit).')
    return lock


def cmd_credencial(a):
    chave = os.environ.get('BIBLIOTECA_DEPLOY_KEY', '').strip()
    token = os.environ.get('BIBLIOTECA_READ_TOKEN', '').strip()
    if chave:
        modo = 'ssh'
    elif token:
        modo = 'token'
    else:
        falhar('Nenhuma credencial de leitura da Biblioteca de Diagramação foi configurada. '
               'Crie, em Settings → Secrets and variables → Actions deste repositório, o segredo BIBLIOTECA_DEPLOY_KEY '
               '(chave privada de uma deploy key somente leitura cadastrada na Biblioteca) ou BIBLIOTECA_READ_TOKEN '
               '(fine-grained PAT restrito à Biblioteca, Contents: read). Passo a passo em automacoes/aulas/README.md. '
               'Nada foi produzido.')
    saida('modo', modo)
    saida('commit', ler_lock(a.raiz)['commit'])
    print('Credencial encontrada (' + modo + '); o valor não é exibido.')


def git(clone, *args):
    return subprocess.check_output(['git', '-C', str(clone), *args], text=True).strip()


def cmd_conferir(a):
    lock = ler_lock(a.raiz)
    clone = (a.raiz / a.clone).resolve()
    if not (clone / '.git').exists():
        falhar('Clone da biblioteca ausente em ' + str(clone))
    head = git(clone, 'rev-parse', 'HEAD')
    if head != lock['commit']:
        falhar(f'Clone no commit {head[:12]}, mas o lock fixa {lock["commit"][:12]}. Atualize o lock de forma explícita ou use o commit fixado.')
    if git(clone, 'status', '--porcelain', '--untracked-files=no'):
        falhar('O clone da biblioteca tem alterações locais; use um clone limpo.')
    faltam = [p for p in ('estacao/orquestrar_aulas.py', 'estacao/produzir.py') if not (clone / p).is_file()]
    if faltam:
        falhar('Motor da biblioteca incompleto no commit fixado: ' + ', '.join(faltam))
    print(f'Biblioteca conferida: commit {head[:12]} (lock {lock["versao_integracao"]}, contrato {lock.get("contrato_aulas")}); motor presente.')
    resumo(f'- Biblioteca de Diagramação no commit `{head[:12]}` (lock conferido, clone limpo).')


def cmd_produzir(a):
    clone = (a.raiz / a.clone).resolve()
    if a.modo == 'orquestrar':
        if not a.pedido:
            falhar('Informe --pedido (arquivo JSON em automacoes/aulas/pedidos/).')
        pedido = (a.raiz / a.pedido).resolve()
        if not pedido.is_relative_to(a.raiz) or not pedido.is_file():
            falhar('Pedido inexistente ou fora do repositório: ' + a.pedido)
        if a.roteiro:
            roteiro = (a.raiz / a.roteiro).resolve()
            if not roteiro.is_relative_to(a.raiz) or not roteiro.is_file():
                falhar('Roteiro inexistente ou fora do repositório: ' + a.roteiro)
        cmd = [sys.executable, str(a.raiz / 'automacoes/aulas/gerar.py'), '--pedido', a.pedido, '--biblioteca', str(clone)]
        if a.roteiro:
            cmd += ['--script', a.roteiro]
        if a.gerar_dados:
            if not os.environ.get('AULA_LLM_API_KEY'):
                falhar('--gerar-dados exige o segredo AULA_LLM_API_KEY (e a variável AULA_LLM_MODEL). Sem provedor configurado, use dados preparados.')
            cmd.append('--gerar-dados')
    else:
        cmd = [sys.executable, str(a.raiz / 'ferramentas/produzir.py'), '--biblioteca', str(clone), a.modo, *a.argumentos]
    print('Executando: ' + ' '.join(x if not x.startswith('/') else Path(x).name for x in cmd))
    r = subprocess.run(cmd, cwd=a.raiz)
    if r.returncode:
        falhar(f'A produção terminou com código {r.returncode}. Veja o log acima; o motor privado é quem emite as mensagens.')
    resumo(f'- Produção executada: modo `{a.modo}`' + (f', pedido `{a.pedido}`' if a.pedido else '') + (f', roteiro `{a.roteiro}`' if a.roteiro else '') + '.')


def cmd_validar(a):
    etapas = [
        ('pedidos', [sys.executable, 'automacoes/aulas/validar_pedidos.py']),
        ('contrato (17 testes)', [sys.executable, '-m', 'unittest', 'discover', '-s', 'automacoes/aulas', '-p', 'test_entrega.py']),
        ('catálogo de arquiteturas', [sys.executable, 'biblioteca-arquiteturas/validar_catalogo.py']),
        ('cenários e sessão 2', [sys.executable, 'publicacao/cenarios/validar_cenarios.py']),
        ('linguagem clara (seção 38)', [sys.executable, 'automacoes/aulas/validar_linguagem.py', '--saida', a.saida_linguagem]),
        ('catálogo público (contrato_entrega --catalogo)', [sys.executable, 'automacoes/aulas/contrato_entrega.py', '--catalogo']),
    ]
    if (a.raiz / 'automacoes/aulas/ultima-geracao.json').is_file():
        etapas.insert(1, ('lote gerado (validar_gerados.py)', [sys.executable, 'automacoes/aulas/validar_gerados.py']))
    resultados = []
    for nome, cmd in etapas:
        r = subprocess.run(cmd, cwd=a.raiz, capture_output=True, text=True)
        ok = r.returncode == 0
        resultados.append((nome, ok, (r.stdout + r.stderr).strip().splitlines()[-1:] or ['']))
        print(('OK  ' if ok else 'ERR ') + nome + ' — ' + resultados[-1][2][0][:200])
    js = [p for p in mudancas(a.raiz) if p.endswith('.js') and (a.raiz / p).is_file()]
    for p in js:
        r = subprocess.run(['node', '--check', p], cwd=a.raiz, capture_output=True, text=True)
        if r.returncode:
            resultados.append(('sintaxe ' + p, False, [r.stderr.strip()[:200]]))
            print('ERR sintaxe ' + p)
    falhas = [x for x in resultados if not x[1]]
    resumo('### Validadores\n' + '\n'.join(f'- {"✅" if ok else "❌"} {nome}: `{linha[0][:160]}`' for nome, ok, linha in resultados))
    saida('validacao', 'ok' if not falhas else 'falhou')
    if falhas:
        falhar(f'{len(falhas)} validador(es) com falha: ' + '; '.join(n for n, _, _ in falhas) + '. O PR, se aberto, nasce em rascunho e não deve ser mesclado antes da correção.')
    print('Validadores concluídos sem falhas. Isso não substitui a revisão pedagógica nem o teste em navegador.')


def mudancas(raiz):
    alterados = subprocess.check_output(['git', '-C', str(raiz), 'status', '--porcelain', '--untracked-files=all'], text=True).splitlines()
    return sorted({linha[3:].split(' -> ')[-1].strip().strip('"') for linha in alterados if linha.strip()})


def cmd_mudancas(a):
    lista = [p for p in mudancas(a.raiz) if not p.startswith(CLONE_PADRAO)]
    bloqueados = [p for p in lista if any(p.startswith(x) or ('/' + x) in p for x in PROIBIDOS)]
    grandes = [p for p in lista if (a.raiz / p).is_file() and (a.raiz / p).stat().st_size > LIMITE_BYTES]
    if (a.raiz / a.clone).exists():
        falhar('O clone privado ainda está no diretório de trabalho; remova-o antes de registrar mudanças.')
    if bloqueados:
        falhar('Caminhos proibidos nas mudanças: ' + ', '.join(bloqueados))
    if grandes:
        falhar('Arquivos acima de 25 MB: ' + ', '.join(grandes))
    Path(a.lista).write_text('\n'.join(lista) + ('\n' if lista else ''), encoding='utf-8')
    saida('total', str(len(lista)))
    resumo('### Arquivos produzidos/alterados (' + str(len(lista)) + ')\n' + ''.join(f'- `{p}`\n' for p in lista[:200]) + ('- …\n' if len(lista) > 200 else ''))
    if not lista:
        print('Nenhuma mudança no repositório; não há PR a abrir.')
    else:
        print(f'{len(lista)} arquivo(s) alterado(s); lista em {a.lista}.')


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--raiz', type=Path, default=RAIZ_PADRAO)
    p.add_argument('--clone', default=CLONE_PADRAO, help='pasta do clone privado, relativa à raiz')
    sub = p.add_subparsers(dest='comando', required=True)
    sub.add_parser('credencial', help='confere se há segredo de leitura e publica modo/commit')
    sub.add_parser('conferir', help='confere clone no commit do lock, limpo e com motor')
    pr = sub.add_parser('produzir', help='executa a ponte (gerar.py) ou produzir.py')
    pr.add_argument('--modo', choices=['orquestrar', 'validar', 'compilar', 'novo'], default='orquestrar')
    pr.add_argument('--pedido', default='')
    pr.add_argument('--roteiro', default='')
    pr.add_argument('--gerar-dados', action='store_true')
    pr.add_argument('argumentos', nargs='*')
    va = sub.add_parser('validar', help='roda os validadores do repositório')
    va.add_argument('--saida-linguagem', default=os.environ.get('RUNNER_TEMP', '/tmp') + '/linguagem')
    mu = sub.add_parser('mudancas', help='lista mudanças e bloqueia caminhos proibidos')
    mu.add_argument('--lista', default=os.environ.get('RUNNER_TEMP', '/tmp') + '/producao-mudancas.txt')
    a = p.parse_args()
    a.raiz = a.raiz.resolve()
    {'credencial': cmd_credencial, 'conferir': cmd_conferir, 'produzir': cmd_produzir, 'validar': cmd_validar, 'mudancas': cmd_mudancas}[a.comando](a)


if __name__ == '__main__':
    main()
