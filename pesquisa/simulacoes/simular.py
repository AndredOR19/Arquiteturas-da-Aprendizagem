#!/usr/bin/env python3
"""Experimento Monte Carlo de desenho de pesquisa, sem dados reais ou efeito calibrado."""
import json
from pathlib import Path
import numpy as np
from scipy.stats import t as student_t

HERE=Path(__file__).resolve().parent


def cenario(n, efeito, repeticoes, seed):
    rng=np.random.default_rng(seed)
    ganhos=[]; ns=[]
    for grupo in range(2):
        # Heterogeneidade fictícia; mesmos indivíduos têm pré e pós no seu grupo.
        habilidade=rng.beta(6,4,size=(repeticoes,n))
        pre=rng.binomial(20,habilidade)/20
        pos_p=np.clip(habilidade+0.05+(efeito if grupo else 0),0.01,0.99)
        pos=rng.binomial(20,pos_p)/20
        acompanhado=rng.random((repeticoes,n))>=0.20
        ganho=np.where(acompanhado,pos-pre,np.nan)
        ganhos.append(ganho)
        ns.append(acompanhado.sum(axis=1))
    medias=[np.nanmean(g,axis=1) for g in ganhos]
    variancias=[np.nanvar(g,axis=1,ddof=1) for g in ganhos]
    diff=medias[1]-medias[0]
    v=[variancias[i]/ns[i] for i in range(2)]
    se=np.sqrt(v[0]+v[1])
    gl=(v[0]+v[1])**2/(v[0]**2/(ns[0]-1)+v[1]**2/(ns[1]-1))
    p=2*student_t.sf(np.abs(diff/se),gl)
    valid=np.isfinite(p)&(ns[0]>=2)&(ns[1]>=2)
    rejeita=p[valid]<0.05
    taxa=float(rejeita.mean())
    return dict(n_inicial_por_grupo=n,n_inicial_total=2*n,
        efeito_adicional_assumido_pp=100*efeito,repeticoes=repeticoes,
        repeticoes_validas=int(valid.sum()),semente=seed,
        media_acompanhados_total=float((ns[0]+ns[1]).mean()),
        diferenca_media_estimada_pp=float(100*diff[valid].mean()),
        percentis_2_5_e_97_5_das_estimativas_pp=(100*np.quantile(diff[valid],[.025,.975])).tolist(),
        fracao_p_menor_005=taxa,
        erro_padrao_monte_carlo=float(np.sqrt(taxa*(1-taxa)/valid.sum())))


def executar(repeticoes=5000):
    rows=[]
    for i,n in enumerate([30,60]):
        for j,efeito in enumerate([-.05,0,.05,.10]):
            rows.append(cenario(n,efeito,repeticoes,20261028+i*100+j))
    return dict(schema_version='1.0.0',tipo='simulacao_sintetica_de_planejamento',
        data_execucao='2026-10-28',dados_reais=False,calibrado_para_arquiteturas=False,
        modelo_cognitivo=False,
        pergunta='Como tamanho da amostra e efeito hipotético influenciam a detecção de uma diferença entre ganhos?',
        pressupostos={'grupos':2,'unidade':'indivíduo independente',
            'atribuicao':'grupos comparáveis gerados da mesma população fictícia',
            'itens_por_teste':20,'probabilidade_inicial':'Beta(6,4), média 0.60',
            'mudanca_comum_pos':0.05,'perda_acompanhamento':0.20,
            'mecanismo_perda':'independente de grupo, habilidade e resultado',
            'efeito':'incremento adicional na probabilidade pós, antes do limite 0.01 a 0.99',
            'teste':'Welch bilateral sobre ganho individual pós menos pré',
            'alfa':0.05,'parametros':'ilustrativos, não estimados de artigos ou alunos'},
        limitacoes=['Não simula cérebro, marcha, leitura ou mecanismo das arquiteturas.',
            'Não estima a chance de a teoria estar correta.',
            'Não modela agrupamento por turma, escola, maturação entre séries, contaminação ou perda seletiva.',
            'O efeito foi imposto; a diferença simulada não demonstra que ele existe.',
            'p<0.05 no cenário nulo é falso positivo; em cenários com efeito, rejeição pode inclusive ter sinal errado.',
            'Percentis de estimativas sintéticas não são intervalo de confiança de um efeito real.'],
        ambiente={'numpy':np.__version__},cenarios=rows)


if __name__=='__main__':
    result=executar()
    (HERE/'resultados.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False,indent=2))
