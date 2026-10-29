#!/usr/bin/env python3
"""Verifica catálogo/caminhos/hashes. Não certifica privacidade nem currículo."""
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parents[1]
def main():
 cat=json.loads((R/'banco-pedagogico/catalogo.json').read_text())
 seen=set()
 for d in cat['documentos']:
  assert d['id'] not in seen, 'ID duplicado'
  seen.add(d['id'])
  assert d['classificacao']=='publico' and d['revisao_privacidade'], 'Revisão de classificação ausente'
  assert d['tipo']!='pei_preenchido', 'PEI individual não entra no catálogo público'
  for field in ['arquivo','texto_consulta']:
   p=(R/d[field]).resolve();assert p.is_relative_to(R/'banco-pedagogico') and p.is_file(),d[field]
  assert hashlib.sha256((R/d['arquivo']).read_bytes()).hexdigest()==d['sha256'],'Hash divergente: '+d['id']
  p=R/d['arquivo'];m=json.loads((p.parent/'metadados.json').read_text());assert m==d,'Metadados e catálogo divergentes'
 for path in cat['fontes_conectadas'].values():assert (R/path).is_file(),path
 print(f'BANCO_OK: {len(seen)} documentos, IDs, caminhos, metadados e hashes conferidos. Não audita normas nem dados pessoais automaticamente.')
if __name__=='__main__':main()
