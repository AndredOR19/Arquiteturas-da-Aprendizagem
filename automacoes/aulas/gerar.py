#!/usr/bin/env python3
"""Ponte única: autoria/compilação ocorrem na Biblioteca de Diagramação."""
import argparse
import subprocess
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--pedido',required=True);p.add_argument('--script',default='')
    p.add_argument('--biblioteca',type=Path,default=ROOT/'_biblioteca_privada')
    p.add_argument('--gerar-dados',action='store_true')
    a=p.parse_args();engine=a.biblioteca.resolve();entry=engine/'estacao/orquestrar_aulas.py'
    if not entry.is_file():raise SystemExit('Biblioteca central/revisão incompatível; não haverá produção independente')
    cmd=[sys.executable,str(entry),'--raiz',str(ROOT),'--pedido',a.pedido]
    if a.script:cmd+=['--roteiro',a.script]
    if a.gerar_dados:cmd+=['--gerar-dados']
    subprocess.run(cmd,check=True)
if __name__=='__main__':main()
