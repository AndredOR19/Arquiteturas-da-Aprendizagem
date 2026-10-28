# Resultado da primeira simulação de planejamento

Execução em 28/10/2026. Quarenta mil estudos sintéticos; parâmetros ilustrativos, sem calibração com alunos ou com as Arquiteturas. Não é teste de um mecanismo cognitivo.

| Efeito adicional assumido | Pessoas iniciais em cada grupo | Estudos sintéticos com p menor que 0,05 | Erro de Monte Carlo aproximado |
| --- | ---: | ---: | ---: |
| -5 pontos percentuais | 30 | 19.9% | 0.56 ponto percentual |
| +0 pontos percentuais | 30 | 5.4% | 0.32 ponto percentual |
| +5 pontos percentuais | 30 | 21.3% | 0.58 ponto percentual |
| +10 pontos percentuais | 30 | 65.2% | 0.67 ponto percentual |
| -5 pontos percentuais | 60 | 37.4% | 0.68 ponto percentual |
| +0 pontos percentuais | 60 | 4.7% | 0.30 ponto percentual |
| +5 pontos percentuais | 60 | 39.6% | 0.69 ponto percentual |
| +10 pontos percentuais | 60 | 91.9% | 0.38 ponto percentual |

No cenário nulo, a frequência de p menor que 0,05 representa falso positivo. Nos cenários com efeito imposto, a frequência é uma medida aproximada de poder sob essas premissas, não a chance de a teoria estar correta.

## Leitura prática
Um benefício de 5 pontos percentuais foi imposto ao modelo; com 30 pessoas iniciais por grupo e 20% de perdas, apenas 21,3% das réplicas o distinguiram de zero pelo teste escolhido. Para 10 pontos, a proporção foi 65,2%. Isso ilustra como um estudo pequeno pode não detectar um efeito que foi programado para existir. Não estima o efeito real da proposta nem justifica presumir benefício quando um estudo real não o encontra.

O grupo de comparação também recebe mudança comum de 5 pontos. A análise compara os ganhos individuais entre os grupos; não confunde todo ganho após a aula com efeito específico da arquitetura. Cada grupo é gerado da mesma população, com indivíduos independentes. Turmas reais têm dependências e condições que não estão modeladas.

## O que ainda falta
Definir o mecanismo de uma hipótese específica; reunir literatura diretamente pertinente; calibrar parâmetros com dados adequados; examinar modelos concorrentes e comparar previsões com observações novas. Esta execução pode ajudar a planejar a investigação, mas não comprova transferência da dança para lógica, retenção pela cadência ou alternância cerebral.

Código em simular.py; premissas e fontes em README.md; resultados integrais e sementes em resultados.json.
