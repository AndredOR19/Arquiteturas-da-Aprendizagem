#!/usr/bin/env python3
"""Confere integridade documental, sem homologar currículo ou vigência."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'base-curricular'


def arquivo_relativo(caminho):
    arquivo = (ROOT / caminho).resolve()
    assert arquivo.is_relative_to(BASE), f'Caminho fora da base: {caminho}'
    assert arquivo.is_file(), f'Arquivo ausente: {caminho}'
    return arquivo


def main():
    catalogo = json.loads((BASE / 'catalogo.json').read_text())
    ids = set()
    disponiveis = 0
    for doc in catalogo['documentos']:
        assert doc['id'] not in ids, f'ID duplicado: {doc["id"]}'
        ids.add(doc['id'])
        assert doc['status'] in {'aguardando_documento', 'recebido_a_conferir', 'disponivel', 'substituido'}
        if doc['status'] != 'disponivel':
            continue
        original = arquivo_relativo(doc['caminho'])
        assert original.read_bytes().startswith(b'%PDF-'), f'PDF inválido: {original}'
        assert hashlib.sha256(original.read_bytes()).hexdigest() == doc['sha256'], doc['id']
        assert doc['versao'] and doc['orgao'] and doc['url_oficial_verificada'].startswith('https://')
        if doc.get('texto_consulta'):
            texto = arquivo_relativo(doc['texto_consulta']).read_bytes()
            assert hashlib.sha256(texto).hexdigest() == doc['sha256_texto'], doc['id']
            assert len(texto.decode('utf-8').strip()) > 100, doc['id']
            assert texto.decode('utf-8').count('\f') == doc['paginas_pdf'], doc['id']
        disponiveis += 1
    print(f'BASE_CURRICULAR_OK: {len(ids)} registros; {disponiveis} PDFs íntegros. Vigência curricular não certificada.')


if __name__ == '__main__':
    main()
