"""Executa os mesmos sorteios/testes do código recebido e registra cada chamada.

Não modifica o gerador, os parâmetros ou a ordem das chamadas.
"""
import contextlib
import csv
import hashlib
import io
import json
import math
import platform
import sys
import textwrap
import time
from pathlib import Path
import numpy
import scipy

ROOT=Path(__file__).resolve().parent
source=(ROOT/'sim_power.py').read_text()
prefix,main=source.split('if __name__ == "__main__":',1)
ns={'__name__':'auditoria_codigo_recebido'}
exec(compile(prefix,str(ROOT/'sim_power.py'),'exec'),ns)
original=ns['power']
rows=[]
start=time.monotonic()
def measured(k,n_arms,m,icc,d,attrition,reps=2000):
    value=float(original(k,n_arms,m,icc,d,attrition,reps))
    row=dict(k_por_condicao=k,condicoes=n_arms,alunos_planejados_por_turma=m,icc=icc,d_assumido=d,perda_assumida=attrition,replicas=reps,alpha_por_contraste=0.05/(n_arms-1),taxa_rejeicao_primeiro_contraste=value,erro_padrao_monte_carlo=math.sqrt(value*(1-value)/reps))
    rows.append(row)
    print(f"Cenário {len(rows)}/54: condições={n_arms}, d={d}, k={k}, ICC={icc}, rejeição={value:.4f}",file=sys.__stdout__,flush=True)
    return value
ns['power']=measured
buffer=io.StringIO()
# Registra stdout original sem substituir o fluxo do gerador aleatório.
class Tee:
    def write(self,value):
        buffer.write(value)
        return len(value)
    def flush(self): pass
# Mensagens de andamento são emitidas pelo wrapper; texto original vai para arquivo.
with contextlib.redirect_stdout(Tee()):
    exec(compile(textwrap.dedent(main),str(ROOT/'sim_power.py'),'exec'),ns)
out=ROOT/'resultados';out.mkdir(exist_ok=True)
(out/'saida.txt').write_text(buffer.getvalue())
with (out/'cenarios.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
manifest=dict(estado='executado',seed=ns['SEED'],cenarios=len(rows),replicas=sum(r['replicas'] for r in rows),python=platform.python_version(),numpy=numpy.__version__,scipy=scipy.__version__,codigo_sha256=hashlib.sha256(source.encode()).hexdigest(),segundos=time.monotonic()-start,parametros='todos fictícios/assumidos',escopo='poder ou taxa de rejeição do primeiro contraste; sem dados reais ou mecanismo cognitivo',resultados=rows)
(out/'execucao.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
assert len(rows)==54 and manifest['replicas']==90000
assert all(0<=r['taxa_rejeicao_primeiro_contraste']<=1 for r in rows)
print(json.dumps({k:manifest[k] for k in ['estado','cenarios','replicas','segundos']},ensure_ascii=False),flush=True)
