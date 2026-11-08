#!/usr/bin/env python3
"""Compilado continua em revisão; publicação exige contrato completo separado."""
import json
from pathlib import Path
from contrato_entrega import digest,validate_routes
ROOT=Path(__file__).resolve().parents[2]
def main():
    state=json.loads((ROOT/'automacoes/aulas/ultima-geracao.json').read_text())
    if state.get('estado')!='revisao_pendente' or not state.get('artefatos'):raise ValueError('Estado de produção inválido')
    policy=json.loads((ROOT/'automacoes/aulas/politica-entrega.json').read_text())
    registry=json.loads((ROOT/'automacoes/aulas/entregas.json').read_text())['aulas']
    for rel in state['artefatos']:
        record=next(x for x in registry if x['destino']==rel)
        bundle=(ROOT/rel).resolve()
        if not bundle.is_relative_to(ROOT):raise ValueError('Destino fora da raiz')
        receipt=json.loads((ROOT/record['recibo']).read_text())
        if receipt['pacote_sha256']!=digest(bundle):raise ValueError('Pacote diverge do recibo')
        for f in ['index.html','aula-impressa.pdf','manifesto.json']:
            if not (bundle/f).is_file():raise ValueError('Saída central ausente: '+f)
        print('COMPILADO EM REVISÃO:',rel,'; não publicado nem homologado')
if __name__=='__main__':main()
