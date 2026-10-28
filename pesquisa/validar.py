#!/usr/bin/env python3
"""Valida os vínculos do banco documental, sem certificar hipóteses."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]


def main():
    registros=json.loads((ROOT/'pesquisa/registros.json').read_text(encoding='utf-8'))['registros']
    producoes=json.loads((ROOT/'pesquisa/producoes.json').read_text(encoding='utf-8'))['producoes']
    cat=json.loads((ROOT/'biblioteca-arquiteturas/catalogo.json').read_text(encoding='utf-8'))
    rids={r['id'] for r in registros}; pids={p['id'] for p in producoes}
    aids={a['id'] for a in cat['arquiteturas']}
    assert len(rids)==len(registros), 'ID de registro duplicado'
    assert len(pids)==len(producoes), 'ID de produção duplicado'
    def arquivo(p):
        f=(ROOT/p).resolve()
        assert f.is_relative_to(ROOT) and f.is_file(), 'Caminho ausente ou externo: '+p
    for r in registros:
        assert r['tipo_texto'] in ['parafrase_da_fala_do_autor','fala_literal_conferida','proposta_assistente']
        assert set(r['relacionados']) <= rids
        assert set(r['producoes']) <= pids
        assert set(r['arquiteturas']) <= aids
        assert r['origem']['transcricao_integral'] is False
        assert r['evidencia']['eficacia_demonstrada'] is False
        arquivo(r['origem']['registro'])
    for p in producoes:
        assert set(p['depende_de']) <= pids
        if 'caminho' in p: arquivo(p['caminho'])
    print(f'OK: {len(registros)} registros e {len(producoes)} produções; origem, IDs e vínculos conferidos.')
    print('Limite: consistência documental, não validação empírica ou importação de dados reais.')


if __name__=='__main__': main()
