#!/usr/bin/env python3
"""Base privada local. Não envia dados, não integra automaticamente o coletor."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import sqlite3
import uuid

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]


def diretorio_privado(value):
    p = Path(value).expanduser().resolve()
    if p == ROOT or p.is_relative_to(ROOT):
        raise ValueError('A base individual deve ficar fora do repositorio publico.')
    return p


def inicializar(value):
    p = diretorio_privado(value)
    p.mkdir(parents=True, exist_ok=True, mode=0o700)
    for filename, schema in [('acompanhamento.sqlite3', 'schema.sql'),
                             ('identidades.sqlite3', 'identidades.sql')]:
        file = p / filename
        with sqlite3.connect(file) as db:
            version = db.execute('PRAGMA user_version').fetchone()[0]
            if version not in (0, 1):
                raise ValueError('Versao de banco nao suportada; nao sobrescrever.')
            db.executescript((HERE / schema).read_text(encoding='utf-8'))
        file.chmod(0o600)
    return p


def abrir(value):
    p = diretorio_privado(value)
    file = p / 'acompanhamento.sqlite3'
    db = sqlite3.connect(file.as_uri() + '?mode=rw', uri=True)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    return db


def cadastrar(value, lista):
    """Cadastro explícito; não deduz identidade por nome nem por hash do nome."""
    p = diretorio_privado(value)
    if not (p / 'identidades.sqlite3').is_file():
        raise ValueError('Inicialize a base antes do cadastro.')
    if not isinstance(lista, list) or not lista:
        raise ValueError('Forneca uma lista privada nao vazia.')
    ids = []
    db = abrir(value)
    try:
        db.execute('ATTACH DATABASE ? AS nominal', (str(p / 'identidades.sqlite3'),))
        now = datetime.now(timezone.utc).isoformat()
        with db:
            for row in lista:
                nome = row.get('nome_oficial', '')
                fonte = row.get('fonte_lista', '')
                if not isinstance(nome, str) or not nome.strip() or not isinstance(fonte, str) or not fonte.strip():
                    raise ValueError('Nome oficial e fonte da lista sao obrigatorios.')
                aid = row.get('aluno_id') or str(uuid.uuid4())
                uuid.UUID(aid)
                old = db.execute('SELECT nome_oficial FROM nominal.identidades WHERE aluno_id=?', (aid,)).fetchone()
                if old and old[0] != nome:
                    raise ValueError('ID existente com nome diferente; conferir manualmente sem mesclar.')
                if not old:
                    db.execute('INSERT INTO alunos VALUES (?,?,?)', (aid, now, fonte))
                    db.execute('INSERT INTO nominal.identidades VALUES (?,?,?,?)', (aid, nome, fonte, now))
                ids.append(aid)
    finally:
        db.close()
    return ids


def matricular(value, row):
    """Nova matrícula sem alterar série ou ano de matrículas anteriores."""
    fields = ['matricula_id','aluno_id','ano_letivo','escola_id','turma','etapa',
              'serie','inicio','fim','situacao','fonte_confirmacao','anterior_id']
    row = dict(row)
    row.setdefault('matricula_id', str(uuid.uuid4()))
    row.setdefault('fim', None)
    row.setdefault('anterior_id', None)
    for key in ['escola_id','turma','etapa','serie','fonte_confirmacao']:
        if not isinstance(row.get(key), str) or not row[key].strip():
            raise ValueError('Campo obrigatorio: ' + key)
    for key in ['inicio','fim']:
        if row.get(key) is not None:
            datetime.strptime(row[key], '%Y-%m-%d')
    if not isinstance(row.get('ano_letivo'), int) or isinstance(row['ano_letivo'], bool):
        raise ValueError('Ano letivo precisa ser inteiro confirmado.')
    db = abrir(value)
    try:
        if row['anterior_id']:
            old = db.execute('SELECT aluno_id,inicio FROM matriculas WHERE matricula_id=?',
                             (row['anterior_id'],)).fetchone()
            if not old or old['aluno_id'] != row.get('aluno_id') or row['inicio'] < old['inicio']:
                raise ValueError('Matricula anterior incompativel com aluno ou cronologia.')
        with db:
            db.execute('INSERT INTO matriculas (' + ','.join(fields) + ') VALUES (' + ','.join('?' for _ in fields) + ')',
                       [row[key] for key in fields])
    finally:
        db.close()
    return row['matricula_id']


def relatorio(value, aluno_id):
    db = abrir(value)
    try:
        if not db.execute('SELECT 1 FROM alunos WHERE aluno_id=?', (aluno_id,)).fetchone():
            raise ValueError('Aluno nao cadastrado.')
        rows = [dict(row) for row in db.execute(
            'SELECT * FROM trajetoria WHERE aluno_id=? ORDER BY ano_letivo,inicio,data,medida_id', (aluno_id,))]
    finally:
        db.close()
    return {'aluno_id': aluno_id, 'trajetoria': rows,
            'conclusao': 'Descritivo; nao calcula significancia nem demonstra causalidade.',
            'nomes_incluidos': False,
            'ausencias': 'NULL conserva dado ausente; zero significa medida observada igual a zero.'}


def consultar(termo):
    base = ROOT / 'pesquisa'
    result = []
    for filename, key in [('registros.json','registros'),('producoes.json','producoes')]:
        for row in json.loads((base / filename).read_text(encoding='utf-8'))[key]:
            if termo.casefold() in json.dumps(row, ensure_ascii=False).casefold():
                result.append(row)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='acao', required=True)
    p = sub.add_parser('consultar'); p.add_argument('termo')
    for action in ['iniciar','cadastrar','matricular','relatorio']:
        p = sub.add_parser(action); p.add_argument('--diretorio', required=True)
        if action in ['cadastrar','matricular']: p.add_argument('--entrada', required=True)
        if action == 'relatorio': p.add_argument('--aluno-id', required=True)
    args = parser.parse_args()
    try:
        if args.acao == 'consultar': result = consultar(args.termo)
        elif args.acao == 'iniciar':
            inicializar(args.diretorio); result = {'estado':'base_privada_inicializada_sem_dados_inventados'}
        elif args.acao == 'relatorio': result = relatorio(args.diretorio, args.aluno_id)
        else:
            entrada = Path(args.entrada).expanduser().resolve()
            if entrada.is_relative_to(ROOT):
                raise ValueError('Arquivo nominal/matriculas reais deve ficar fora do repositorio.')
            data = json.loads(entrada.read_text(encoding='utf-8'))
            if args.acao == 'cadastrar': result = {'aluno_ids': cadastrar(args.diretorio, data)}
            else: result = {'matricula_id': matricular(args.diretorio, data)}
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except (ValueError, KeyError, OSError, sqlite3.Error) as exc:
        parser.exit(1, 'Falha: ' + str(exc) + '\n')


if __name__ == '__main__':
    main()
