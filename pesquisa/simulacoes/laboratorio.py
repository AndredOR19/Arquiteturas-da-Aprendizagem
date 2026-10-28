#!/usr/bin/env python3
"""Executa cenários versionados e gera um pacote independente de IA."""
import argparse
from datetime import datetime,timezone
import hashlib
import json
import os
from pathlib import Path
import platform
import sys
import numpy
import scipy
import matplotlib
from modelos import VERSAO,executar
from relatorios import gerar
from inventario import construir,salvar

HERE=Path(__file__).resolve().parent


def hash_arquivo(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def carregar(path):
    def constantes(x):raise ValueError('JSON contém constante não finita: '+x)
    return json.loads(Path(path).read_text(encoding='utf-8'),parse_constant=constantes)


def executar_laboratorio(config,repeticoes,semente,saida):
    result=executar(config,repeticoes,semente)
    inventory=construir()
    sources={p:hash_arquivo(HERE/p) for p in ['laboratorio.py','modelos.py','relatorios.py','inventario.py','requirements.txt']}
    ident=json.dumps(dict(config=config,repeticoes=repeticoes,semente=semente,codigo=sources,inventario=inventory),
                     sort_keys=True,separators=(',',':'),allow_nan=False).encode()
    fingerprint=hashlib.sha256(ident).hexdigest()
    now=datetime.now(timezone.utc)
    pasta=Path(saida).resolve()/(now.strftime('%Y%m%dT%H%M%S%fZ')+'_'+fingerprint[:12])
    pasta.mkdir(parents=True,exist_ok=False)
    gerar(result,pasta)
    salvar(inventory,pasta)
    expected=['configuracao.json','resultados.json','resultados.csv','RELATORIO.md','RESUMO.md','grafico.png','relatorio.html','inventario_arquiteturas.json','PROGRESSAO.md']
    manifest=dict(schema_version='1.0.0',versao_laboratorio=VERSAO,
        criado_em_utc=now.isoformat(),identificador_experimento=fingerprint,
        dados_reais=False,chamadas_ia=0,tokens_de_api_ia_no_motor=0,
        codigo_sha256=sources,arquivos_sha256={p:hash_arquivo(pasta/p) for p in expected},
        ambiente={'python':platform.python_version(),'numpy':numpy.__version__,'scipy':scipy.__version__,
                  'matplotlib':matplotlib.__version__,'sistema':platform.system()},
        github={'commit':os.environ.get('GITHUB_SHA'),'execucao':os.environ.get('GITHUB_RUN_ID'),
                'tentativa':os.environ.get('GITHUB_RUN_ATTEMPT')},
        inferencia='Cenário ilustrativo, sem calibração ou validação empírica.')
    (pasta/'manifesto.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    return pasta,manifest,result


def verificar(pasta):
    pasta=Path(pasta).resolve();manifest=carregar(pasta/'manifesto.json')
    for name,expected in manifest['arquivos_sha256'].items():
        p=(pasta/name).resolve()
        if p.parent!=pasta or hash_arquivo(p)!=expected:raise ValueError('Arquivo alterado ou caminho inválido: '+name)
    return True


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    sources=parser.add_mutually_exclusive_group()
    sources.add_argument('--cenario',choices=['individuos','turmas'])
    sources.add_argument('--config')
    parser.add_argument('--repeticoes',type=int,default=1000)
    parser.add_argument('--semente',type=int,default=20261028)
    parser.add_argument('--saida',default='exportacoes/simulacoes')
    parser.add_argument('--verificar',metavar='PASTA')
    args=parser.parse_args()
    try:
        if args.verificar:
            verificar(args.verificar);print('Integridade dos arquivos conferida.');return
        path=Path(args.config) if args.config else HERE/'cenarios'/((args.cenario or 'individuos')+'.json')
        pasta,manifest,result=executar_laboratorio(carregar(path),args.repeticoes,args.semente,args.saida)
        verificar(pasta)
        # Somente o resumo é anexado ao Actions; o pacote conserva os dados completos.
        summary=os.environ.get('GITHUB_STEP_SUMMARY')
        if summary:
            with open(summary,'a',encoding='utf-8') as f:
                f.write((pasta/'RESUMO.md').read_text(encoding='utf-8'))
        print(json.dumps({'pasta':str(pasta),'identificador':manifest['identificador_experimento'],
                          'cenarios':len(result['cenarios']),'chamadas_ia':0},ensure_ascii=False))
    except (ValueError,KeyError,OSError,TypeError) as exc:
        parser.exit(1,'Falha: '+str(exc)+'\n')


if __name__=='__main__':main()
