#!/usr/bin/env python3
"""Testa `producao_ci.py` com uma biblioteca fictícia: credencial ausente, lock, clone sujo, ponte e mudanças.

Sem rede, sem segredo real e sem a biblioteca privada: um repositório git sintético faz o papel dela.
Não comprova a produção real pelo motor privado.
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
STUB_ORQUESTRADOR = '''import argparse,pathlib
p=argparse.ArgumentParser();p.add_argument('--raiz',required=True);p.add_argument('--pedido',required=True);p.add_argument('--roteiro',default='');p.add_argument('--gerar-dados',action='store_true')
a=p.parse_args();d=pathlib.Path(a.raiz)/'aulas/sintetica';d.mkdir(parents=True,exist_ok=True);(d/'index.html').write_text('<!doctype html><title>sintética</title>')
(pathlib.Path(a.raiz)/'aulas/sintetica/assets').mkdir(exist_ok=True);(pathlib.Path(a.raiz)/'aulas/sintetica/assets/aula.js').write_text('console.log(1)')
print('ORQUESTRADOR_SINTETICO',a.pedido,a.roteiro,a.gerar_dados)
'''
STUB_PRODUZIR = '''import sys;print('PRODUZIR_SINTETICO',sys.argv[1:])'''


def sh(*cmd, cwd, env=None, ok=True):
    r = subprocess.run([str(c) for c in cmd], cwd=cwd, env=env, capture_output=True, text=True)
    if ok and r.returncode:
        raise AssertionError('falhou: ' + ' '.join(map(str, cmd)) + '\n' + r.stdout + r.stderr)
    return r


def git(cwd, *args):
    return sh('git', '-C', cwd, *args, cwd=cwd).stdout.strip()


def preparar(tmp):
    raiz = tmp / 'repo'
    for rel in ('ferramentas/producao_ci.py', 'ferramentas/produzir.py', 'automacoes/aulas/gerar.py'):
        (raiz / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(RAIZ / rel, raiz / rel)
    (raiz / 'automacoes/aulas/pedidos').mkdir(parents=True)
    (raiz / 'automacoes/aulas/pedidos/x.json').write_text('{}')
    (raiz / 'automacoes/aulas/roteiros').mkdir()
    (raiz / 'automacoes/aulas/roteiros/x.md').write_text('# roteiro')
    git(raiz, 'init', '-q')
    git(raiz, 'config', 'user.email', 'qa@example.invalid'); git(raiz, 'config', 'user.name', 'QA')
    git(raiz, 'add', '-A'); git(raiz, 'commit', '-q', '-m', 'base')
    clone = raiz / '_biblioteca_privada'
    (clone / 'estacao').mkdir(parents=True)
    (clone / 'estacao/orquestrar_aulas.py').write_text(STUB_ORQUESTRADOR)
    (clone / 'estacao/produzir.py').write_text(STUB_PRODUZIR)
    git(clone, 'init', '-q'); git(clone, 'config', 'user.email', 'qa@example.invalid'); git(clone, 'config', 'user.name', 'QA')
    git(clone, 'add', '-A'); git(clone, 'commit', '-q', '-m', 'motor sintético')
    head = git(clone, 'rev-parse', 'HEAD')
    (raiz / 'ferramentas/biblioteca.lock.json').write_text(json.dumps({'repositorio': 'AndredOR19/Biblioteca-de-Diagramacao', 'commit': head, 'versao_integracao': 2, 'quarto': '1.10.19', 'contrato_aulas': '3.9.0'}))
    (raiz / '.gitignore').write_text('/_biblioteca_privada/\n')
    git(raiz, 'add', '-A'); git(raiz, 'commit', '-q', '-m', 'lock')
    return raiz, clone, head


def main():
    with tempfile.TemporaryDirectory() as d:
        raiz, clone, head = preparar(Path(d))
        ci = [sys.executable, raiz / 'ferramentas/producao_ci.py', '--raiz', raiz]
        limpo = {k: v for k, v in os.environ.items() if k not in ('BIBLIOTECA_DEPLOY_KEY', 'BIBLIOTECA_READ_TOKEN', 'GITHUB_OUTPUT', 'GITHUB_STEP_SUMMARY', 'AULA_LLM_API_KEY')}
        # 1. Sem segredo: falha com orientação clara e sem produzir nada.
        r = sh(*ci, 'credencial', cwd=raiz, env=limpo, ok=False)
        assert r.returncode == 1 and 'BIBLIOTECA_DEPLOY_KEY' in r.stderr and 'BIBLIOTECA_READ_TOKEN' in r.stderr and 'Nada foi produzido' in r.stderr, r.stderr
        saida = Path(d) / 'out.txt'
        r = sh(*ci, 'credencial', cwd=raiz, env={**limpo, 'BIBLIOTECA_READ_TOKEN': 'ghp_sintetico', 'GITHUB_OUTPUT': str(saida)})
        assert 'ghp_sintetico' not in r.stdout + r.stderr, 'segredo exibido'
        assert f'modo=token\ncommit={head}\n' == saida.read_text(), saida.read_text()
        r = sh(*ci, 'credencial', cwd=raiz, env={**limpo, 'BIBLIOTECA_DEPLOY_KEY': '-----BEGIN OPENSSH PRIVATE KEY-----'})
        assert 'modo=ssh' in r.stdout
        print('OK credencial: ausência orienta e bloqueia; token/deploy key detectados sem exibir o valor')
        # 2. Conferência do clone: commit do lock, limpeza e motor.
        assert 'Biblioteca conferida' in sh(*ci, 'conferir', cwd=raiz, env=limpo).stdout
        (clone / 'estacao/produzir.py').write_text(STUB_PRODUZIR + '\n# editado')
        r = sh(*ci, 'conferir', cwd=raiz, env=limpo, ok=False); assert r.returncode == 1 and 'alterações locais' in r.stderr
        git(clone, 'checkout', '--', '.')
        lock = raiz / 'ferramentas/biblioteca.lock.json'; original = lock.read_text()
        lock.write_text(original.replace(head, '0' * 40))
        r = sh(*ci, 'conferir', cwd=raiz, env=limpo, ok=False); assert r.returncode == 1 and 'lock fixa' in r.stderr
        lock.write_text(original)
        print('OK conferir: clone sujo e commit diferente do lock são recusados')
        # 3. Produção pela ponte: argumentos integrais; --gerar-dados exige provedor; modos de produzir.py.
        r = sh(*ci, 'produzir', '--modo', 'orquestrar', '--pedido', 'automacoes/aulas/pedidos/x.json', '--roteiro', 'automacoes/aulas/roteiros/x.md', cwd=raiz, env=limpo)
        assert 'ORQUESTRADOR_SINTETICO automacoes/aulas/pedidos/x.json automacoes/aulas/roteiros/x.md False' in r.stdout, r.stdout
        assert (raiz / 'aulas/sintetica/index.html').is_file()
        r = sh(*ci, 'produzir', '--modo', 'orquestrar', '--pedido', 'automacoes/aulas/pedidos/x.json', '--gerar-dados', cwd=raiz, env=limpo, ok=False)
        assert r.returncode == 1 and 'AULA_LLM_API_KEY' in r.stderr
        r = sh(*ci, 'produzir', '--modo', 'orquestrar', '--pedido', 'automacoes/aulas/pedidos/x.json', '--gerar-dados', cwd=raiz, env={**limpo, 'AULA_LLM_API_KEY': 'sk-sintetico'})
        assert 'True' in r.stdout and 'sk-sintetico' not in r.stdout
        r = sh(*ci, 'produzir', '--modo', 'orquestrar', '--pedido', '../fora.json', cwd=raiz, env=limpo, ok=False); assert r.returncode == 1 and 'fora do repositório' in r.stderr
        r = sh(*ci, 'produzir', '--modo', 'validar', '--', 'todos', cwd=raiz, env=limpo)
        assert "PRODUZIR_SINTETICO ['--raiz', '" in r.stdout and "'validar', 'todos']" in r.stdout, r.stdout
        print('OK produzir: ponte gerar.py com pedido/roteiro, bloqueio de --gerar-dados sem provedor, produzir.py com lock')
        # 4. Mudanças: clone presente bloqueia; caminhos proibidos bloqueiam; lista correta.
        lista = Path(d) / 'mudancas.txt'
        r = sh(*ci, 'mudancas', '--lista', lista, cwd=raiz, env=limpo, ok=False); assert r.returncode == 1 and 'clone privado ainda' in r.stderr
        shutil.rmtree(clone)
        r = sh(*ci, 'mudancas', '--lista', lista, cwd=raiz, env={**limpo, 'GITHUB_OUTPUT': str(saida)})
        assert lista.read_text().splitlines() == ['aulas/sintetica/assets/aula.js', 'aulas/sintetica/index.html'], lista.read_text()
        assert 'total=2' in saida.read_text()
        (raiz / 'docs/_biblioteca_privada').mkdir(parents=True); (raiz / 'docs/_biblioteca_privada/motor.py').write_text('x')
        r = sh(*ci, 'mudancas', '--lista', lista, cwd=raiz, env=limpo, ok=False); assert r.returncode == 1 and 'proibidos' in r.stderr
        print('OK mudancas: clone residual e caminhos privados bloqueados; lista com os arquivos produzidos')
    print('PASS: producao_ci.py — credencial, lock, ponte e mudanças conferidos com biblioteca sintética (não comprova o motor real)')


if __name__ == '__main__':
    main()
