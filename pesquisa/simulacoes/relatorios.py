"""Relatórios determinísticos; textos produzidos por regras, sem chamadas a IA."""
import csv
import html
import json
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

AVISO='DADOS SINTÉTICOS — premissas ilustrativas, sem calibração ou validação das Arquiteturas.'


def gerar(result,pasta):
    pasta=Path(pasta);rows=result['cenarios'];c=result['configuracao']
    (pasta/'resultados.json').write_text(json.dumps(result,ensure_ascii=False,indent=2,allow_nan=False)+'\n',encoding='utf-8')
    (pasta/'configuracao.json').write_text(json.dumps(c,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    columns=['unidade_analise','unidades_por_grupo','pessoas_iniciais_total','efeito_assumido_pp',
             'perda','desvio_turma','repeticoes','validas','invalidas','diferenca_media_pp',
             'frequencia_rejeicao','erro_monte_carlo','rejeicao_positiva','rejeicao_negativa']
    with (pasta/'resultados.csv').open('w',newline='',encoding='utf-8-sig') as f:
        writer=csv.DictWriter(f,fieldnames=columns,extrasaction='ignore');writer.writeheader();writer.writerows(rows)
    nulos=[r for r in rows if r['efeito_assumido_pp']==0]
    positivos=[r for r in rows if r['efeito_assumido_pp']>0]
    abaixo=sum(r['frequencia_rejeicao']<c['alvo_planejamento'] for r in positivos)
    lines=['# Relatório do laboratório de simulações','',AVISO,'',c['titulo'],'',
        f"Motor {result['versao_motor']} | {len(rows)} cenários | {sum(r['repeticoes'] for r in rows):,} réplicas planejadas.".replace(',','.'),'',
        '## Leitura do resultado','',
        f"Nos cenários nulos, a frequência de falsos positivos variou de {min(r['frequencia_rejeicao'] for r in nulos):.1%} a {max(r['frequencia_rejeicao'] for r in nulos):.1%}.",
        f"Entre {len(positivos)} cenários com benefício imposto, {abaixo} ficaram abaixo do alvo de planejamento de {c['alvo_planejamento']:.0%}. Esse alvo é uma escolha, não exigência institucional.",
        'A frequência de rejeição não é a probabilidade de a teoria estar correta. Benefícios ou prejuízos foram definidos como entrada, não descobertos em alunos.',
        'O intervalo Monte Carlo descreve a incerteza numérica da frequência estimada; os percentis das diferenças são distribuição de estudos sintéticos, não intervalo de efeito real.','',
        '## Comparação dos cenários','',
        '| Unidades por grupo | Pessoas iniciais no total | Efeito assumido em pp | Perdas | Desvio de turma | Frequência de p menor que alfa | Erro Monte Carlo | Válidas |',
        '| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |']
    for r in rows:
        lines.append(f"| {r['unidades_por_grupo']} | {r['pessoas_iniciais_total']} | {r['efeito_assumido_pp']:+g} | {r['perda']:.0%} | {r['desvio_turma']:g} | {r['frequencia_rejeicao']:.1%} | {r['erro_monte_carlo']:.2%} | {r['validas']} |")
    lines+=['','## Direções para a pesquisa','',
        '1. Escolher a unidade real de atribuição: estudante ou turma. No modo turmas, o teste usa médias de turmas, evitando contar colegas como réplicas independentes.',
        '2. Estimar a variabilidade, a qualidade da medida e as perdas com dados apropriados antes de recomendar tamanho de amostra.',
        '3. Comparar benefícios pequenos, ausência de efeito e prejuízo. Um cenário favorável não comprova sua plausibilidade.',
        '4. Planejar precisão, relevância pedagógica, retenção e transferência; não ampliar a amostra após olhar resultados apenas para atingir significância.',
        '5. Manter a aplicação escolar e os procedimentos do mestrado alinhados com orientação e programa.','',
        '## Premissas e limites','',
        'Os grupos são gerados da mesma população fictícia. Probabilidade inicial Beta(a,b), pré e pós com itens binomiais e ganho comum definido na configuração. O efeito adicional entra apenas no pós; probabilidades são limitadas a 1%–99%.',
        'No modo turmas, acrescenta-se ao pós uma variação normal compartilhada por turma, com desvio indicado na configuração. Esse desvio não é uma estimativa de ICC. A inferência ocorre entre turmas.',
        'Perdas são aleatórias e independentes de desempenho. Não se modelam perdas seletivas, mudanças entre séries, múltiplas escolas ou contaminação entre grupos. Réplicas sem dados suficientes são excluídas e contadas como inválidas.',
        'Não há modelo de cérebro, dança, mecanismo da cadência textual ou validação da cooperação. O motor atual orienta planejamento estatístico. Modelos mecanísticos ficam na trilha de desenvolvimento.',
        'O manifesto identifica código, configuração, ambiente e hashes dos arquivos. Hash é conferência de integridade, não certificação científica.','',
        '## Arquivos','',
        'configuracao.json; resultados.json; resultados.csv; grafico.png; relatorio.html; manifesto.json. O conteúdo completo está no JSON; o resumo serve à consulta rápida.']
    md='\n'.join(lines)+'\n';(pasta/'RELATORIO.md').write_text(md,encoding='utf-8')
    resumo='\n'.join(lines[:lines.index('## Comparação dos cenários')])+f"\n\nLeia o artefato completo para premissas, tabela, gráfico e manifesto. Modelo: {c['modelo']}.\n"
    (pasta/'RESUMO.md').write_text(resumo,encoding='utf-8')
    panels=sorted({(r['perda'],r['desvio_turma']) for r in rows})
    fig,axes=plt.subplots(len(panels),1,figsize=(9,4*len(panels)),squeeze=False,layout='constrained')
    for ax,(perda,desvio) in zip(axes[:,0],panels):
        for effect in sorted(c['efeitos_pp']):
            seq=sorted([r for r in rows if r['efeito_assumido_pp']==effect and r['perda']==perda and r['desvio_turma']==desvio],key=lambda r:r['unidades_por_grupo'])
            ax.errorbar([r['unidades_por_grupo'] for r in seq],[r['frequencia_rejeicao'] for r in seq],
                yerr=[1.96*r['erro_monte_carlo'] for r in seq],label=f'{effect:+g} pp assumidos',marker='o',capsize=3)
        ax.axhline(c['alfa'],color='#555555',linestyle=':',label='Alfa')
        ax.set(xlabel=('Turmas' if c['modelo']=='turmas' else 'Pessoas')+' iniciais por grupo',
            ylabel='Frequência de p menor que alfa',ylim=(-.03,1.03),title=f'Perdas {perda:.0%} | desvio compartilhado {desvio:g}')
        ax.grid(alpha=.2);ax.legend(loc='best',fontsize=8)
    fig.suptitle('Simulação ilustrativa — efeito definido na entrada',fontsize=13)
    fig.savefig(pasta/'grafico.png',dpi=150);plt.close(fig)
    table=''.join('<tr>'+''.join('<td>'+html.escape(str(value))+'</td>' for value in [
        r['unidades_por_grupo'],r['pessoas_iniciais_total'],r['efeito_assumido_pp'],
        f"{r['perda']:.0%}",r['desvio_turma'],f"{r['frequencia_rejeicao']:.1%}",r['invalidas']])+'</tr>' for r in rows)
    page='''<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Laboratório de simulações</title><style>body{max-width:1000px;margin:40px auto;padding:20px;font:17px/1.6 system-ui;color:#17324d;background:#f7fafc}h1,h2{line-height:1.2}table{border-collapse:collapse;width:100%;background:white}td,th{padding:10px;border:1px solid #cbd5e1;text-align:right}img{max-width:100%;height:auto}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}.scroll{overflow:auto}a{color:#075cad}</style><h1>Laboratório de simulações</h1>'''
    page+='<p><strong>'+html.escape(AVISO)+'</strong></p><h2>'+html.escape(c['titulo'])+'</h2><p>'+html.escape(c['origem_parametros'])+'</p>'
    page+='<img src="grafico.png" alt="Frequência de rejeição por amostra e efeito assumido. Os valores exatos constam da tabela e do arquivo CSV."><div class="scroll"><table><thead><tr><th>Unidades por grupo</th><th>Pessoas totais</th><th>Efeito em pp</th><th>Perdas</th><th>Desvio turma</th><th>p menor que alfa</th><th>Inválidas</th></tr></thead><tbody>'+table+'</tbody></table></div>'
    page+='<h2>Interpretação e premissas completas</h2><pre>'+html.escape(md)+'</pre><p><a href="resultados.json">JSON completo</a> · <a href="resultados.csv">CSV</a> · <a href="manifesto.json">Manifesto</a></p></html>'
    (pasta/'relatorio.html').write_text(page,encoding='utf-8')
