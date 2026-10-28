"""Modelos geradores sintéticos. Não representam mecanismos cerebrais ou eficácia medida."""
import hashlib
import itertools
import json
import math
import numpy as np
from scipy.stats import t as student_t

VERSAO='0.1.0'
LIMITE_PESSOAS_REPLICAS=50_000_000


def numero(x, minimo, maximo, inteiro=False):
    if isinstance(x,bool) or not isinstance(x,(int,float)) or not math.isfinite(x):
        raise ValueError('Parâmetro precisa ser número finito.')
    if inteiro and not isinstance(x,int): raise ValueError('Parâmetro precisa ser inteiro.')
    if not minimo<=x<=maximo: raise ValueError('Parâmetro fora dos limites.')


def validar(config,repeticoes,semente):
    numero(repeticoes,200,20000,True);numero(semente,0,2**32-1,True)
    campos={'schema_version','id','titulo','modelo','estado','origem_parametros',
        'unidades_por_grupo','efeitos_pp','perdas','desvios_turma','estudantes_por_turma',
        'itens','beta_inicial','ganho_comum_pp','alfa','alvo_planejamento'}
    if set(config)!=campos: raise ValueError('Campos do cenário ausentes ou desconhecidos.')
    if config['schema_version']!='1.0.0' or config['modelo'] not in ['individuos','turmas']:
        raise ValueError('Modelo ou versão não suportados.')
    if config['estado']!='ilustrativo_nao_calibrado':
        raise ValueError('Este motor aceita apenas cenários ilustrativos não calibrados.')
    for k in ['id','titulo','origem_parametros']:
        if not isinstance(config[k],str) or not config[k].strip() or len(config[k])>500:
            raise ValueError('Texto de cenário inválido: '+k)
    if not all(c.isalnum() or c in '_-' for c in config['id']): raise ValueError('ID inválido.')
    for key,lo,hi,integer in [('unidades_por_grupo',4,500,True),('efeitos_pp',-30,30,False),
                             ('perdas',0,.6,False),('desvios_turma',0,.15,False)]:
        values=config[key]
        if not isinstance(values,list) or not 1<=len(values)<=8: raise ValueError('Grade inválida: '+key)
        for x in values:numero(x,lo,hi,integer)
        if len(set(values))!=len(values): raise ValueError('Grade duplicada: '+key)
    if 0 not in config['efeitos_pp'] or not any(x<0 for x in config['efeitos_pp']):
        raise ValueError('Incluir cenários nulo e negativo, além de eventuais benefícios.')
    if not isinstance(config['beta_inicial'],list) or len(config['beta_inicial'])!=2:
        raise ValueError('Distribuição inicial inválida.')
    for x in config['beta_inicial']:numero(x,.1,100)
    numero(config['itens'],5,100,True);numero(config['estudantes_por_turma'],1,50,True)
    numero(config['ganho_comum_pp'],-20,20);numero(config['alfa'],.001,.1)
    numero(config['alvo_planejamento'],.5,.99)
    if config['modelo']=='individuos' and (config['desvios_turma']!=[0] or config['estudantes_por_turma']!=1):
        raise ValueError('Modo individual não aceita efeito compartilhado de turma.')
    scenarios=list(grade(config))
    if len(scenarios)>64:raise ValueError('Grade excede 64 cenários.')
    custo=sum(2*s['unidades_por_grupo']*config['estudantes_por_turma']*repeticoes for s in scenarios)
    if custo>LIMITE_PESSOAS_REPLICAS:raise ValueError('Orçamento excedido; reduzir grade, amostra ou repetições.')
    return custo


def grade(c):
    for n,e,p,s in itertools.product(c['unidades_por_grupo'],c['efeitos_pp'],c['perdas'],c['desvios_turma']):
        yield dict(unidades_por_grupo=n,efeito_assumido_pp=e,perda=p,desvio_turma=s)


def semente_cenario(base,params):
    raw=json.dumps(params,sort_keys=True,separators=(',',':')).encode()
    digest=hashlib.sha256(raw).digest()
    return int.from_bytes(digest[:8],'big')^base


def momentos(a):
    valid=np.isfinite(a); n=valid.sum(axis=1)
    total=np.where(valid,a,0).sum(axis=1)
    media=np.divide(total,n,out=np.full(len(n),np.nan),where=n>0)
    residual=np.where(valid,a-media[:,None],0)
    var=np.divide((residual**2).sum(axis=1),n-1,out=np.full(len(n),np.nan),where=n>1)
    return media,var,n


def welch(a,b):
    ma,va,na=momentos(a);mb,vb,nb=momentos(b)
    with np.errstate(divide='ignore',invalid='ignore'):
        v0=va/na;v1=vb/nb;se=np.sqrt(v0+v1)
        gl=(v0+v1)**2/(v0**2/(na-1)+v1**2/(nb-1))
        diff=mb-ma;p=2*student_t.sf(np.abs(diff/se),gl)
    valid=(na>=2)&(nb>=2)&np.isfinite(p)
    return diff,p,valid,na,nb


def simular_cenario(config,params,repeticoes,semente):
    rng=np.random.default_rng(semente);n=params['unidades_por_grupo']
    turma=config['modelo']=='turmas';por_turma=config['estudantes_por_turma']
    diffs=[];ps=[];n0s=[];n1s=[];pessoas=[];invalidas=0
    for start in range(0,repeticoes,256):
        batch=min(256,repeticoes-start);groups=[];counts=[]
        for arm in [0,1]:
            shape=(batch,n,por_turma)
            habilidade=rng.beta(*config['beta_inicial'],size=shape)
            pre=rng.binomial(config['itens'],habilidade)/config['itens']
            shift=rng.normal(0,params['desvio_turma'],size=(batch,n,1)) if turma else 0
            probability=np.clip(habilidade+config['ganho_comum_pp']/100+
                                (params['efeito_assumido_pp']/100 if arm else 0)+shift,.01,.99)
            post=rng.binomial(config['itens'],probability)/config['itens']
            keep=rng.random(shape)>=params['perda'];gain=np.where(keep,post-pre,np.nan)
            counts.append(keep.sum(axis=(1,2)))
            if turma:
                # A unidade de inferência é a turma, não cada aluno da turma.
                present=keep.sum(axis=2)
                mean=np.divide(np.where(keep,gain,0).sum(axis=2),present,
                               out=np.full((batch,n),np.nan),where=present>0)
                groups.append(mean)
            else:groups.append(gain[:,:,0])
        delta,p,valid,n0,n1=welch(*groups)
        invalidas+=int((~valid).sum());diffs.extend(delta[valid]);ps.extend(p[valid])
        n0s.extend(n0[valid]);n1s.extend(n1[valid]);pessoas.extend((counts[0]+counts[1])[valid])
    if not len(ps): raise ValueError('Nenhuma réplica tem dados suficientes; revisar cenário.')
    ps=np.array(ps);diffs=np.array(diffs);hit=ps<config['alfa'];f=float(hit.mean())
    mcse=float(np.sqrt(f*(1-f)/len(ps)))
    return dict(**params,semente=semente,repeticoes=repeticoes,validas=len(ps),invalidas=invalidas,
        unidade_analise='turma' if turma else 'individuo',
        pessoas_iniciais_total=2*n*por_turma,media_pessoas_acompanhadas=float(np.mean(pessoas)),
        media_unidades_analisadas_por_grupo=float(np.mean(n0s+n1s)),
        diferenca_media_pp=float(diffs.mean()*100),
        percentis_estimativas_pp=(np.quantile(diffs,[.025,.975])*100).tolist(),
        frequencia_rejeicao=f,erro_monte_carlo=mcse,
        intervalo_monte_carlo_aprox=[max(0,f-1.96*mcse),min(1,f+1.96*mcse)],
        rejeicao_positiva=float((hit&(diffs>0)).mean()),
        rejeicao_negativa=float((hit&(diffs<0)).mean()))


def executar(config,repeticoes,semente):
    custo=validar(config,repeticoes,semente)
    results=[simular_cenario(config,s,repeticoes,semente_cenario(semente,s)) for s in grade(config)]
    return dict(versao_motor=VERSAO,tipo='simulacao_sintetica',dados_reais=False,
        validacao_empirica=False,modelo_cognitivo=False,configuracao=config,
        repeticoes_por_cenario=repeticoes,semente_base=semente,
        pessoas_replicas_planejadas=custo,cenarios=results)
