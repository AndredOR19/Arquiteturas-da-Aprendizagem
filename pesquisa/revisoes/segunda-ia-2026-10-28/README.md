# Devolutiva de outra IA — auditoria e reprodução

Data: 28/10/2026. Origem: texto e código fornecidos pelo Prof. André nesta conversa. Autoria original da análise/código não confirmada. A duplicação da mensagem recebida foi desconsiderada. Não é parecer de pesquisador humano nem revisão por pares.

## O que foi conferido aqui

1. Os **14 testes** de `pesquisa/simulacoes/testes_lab.py` passaram no ambiente desta sessão.
2. O laboratório existente foi executado por indivíduos com **24 cenários × 5.000 réplicas = 120.000 estudos sintéticos**, semente 20261028. O pacote local passou na verificação de integridade do próprio laboratório. O extrato público está em [replicacao_verificada](replicacao_verificada/VERIFICACAO.json), com resultados e identificação do código/ambiente.
3. O script adicional recebido foi executado preservando as regras, a sequência de chamadas e os sorteios: **36 cenários × 2.000 + 18 × 1.000 = 90.000 réplicas em 54 cenários**. É uma segunda simulação, diferente da anterior. Ver [código recebido](sim_power.py), [executor instrumentado](executar_auditoria.py), [configurações e resultados](resultados/execucao.json), [CSV](resultados/cenarios.csv) e [saída](resultados/saida.txt).

Ambiente do script recebido: Python 3.12.14, NumPy 2.3.5 e SciPy 1.17.0. O executor registra parâmetros e erro padrão Monte Carlo por cenário; os parâmetros são todos assumidos/fictícios. A instrumentação não altera o gerador ou os testes. A reprodução exata pressupõe preservar versões e ordem das chamadas.

O caminho `/home/ubuntu/parecer_independente_acesso_simbolico.md` pertence ao ambiente da outra IA e não fornece aqui o arquivo. A auditoria abrange o texto e o código efetivamente recebidos. A matriz de construtos, bibliografia integral e arquivos daquela execução não foram recebidos ou certificados.

## O que o código adicional mede

Gera turmas com um efeito compartilhado e variação individual normal. Calcula uma média por turma e usa Welch bilateral entre as médias de duas condições. Na configuração de três condições, faz dois testes contra o controle, aplica limiar 0,025 a cada um e contabiliza somente a rejeição do primeiro contraste.

Isso estima sensibilidade estatística sob premissas. Não simula hipnose, inconsciente, memória ou a eficácia das arquiteturas. O efeito `d` é inserido no gerador, em unidades do desvio-padrão individual assumido como 1; não foi estimado em estudantes.

## Resultados ilustrativos do código recebido

Recorte: duas condições, 25 estudantes planejados por turma, perda aleatória de 15%, ICC 0,10, efeito imposto `d=0,4`, 2.000 réplicas por linha. Cada linha representa uma escolha de planejamento, não uma recomendação de amostra.

| Turmas por condição | Total de turmas | Estudantes inicialmente planejados | Frequência de detecção |
|---|---|---|---|
| 4 | 8 | 200 | 20,7% |
| 8 | 16 | 400 | 48,9% |
| 12 | 24 | 600 | 70,1% |
| 16 | 32 | 800 | 82,1% |
| 24 | 48 | 1.200 | 95,2% |

As frequências têm incerteza Monte Carlo. Nesse recorte, os erros padrão são aproximadamente de 0,5 a 1,1 ponto percentual. Com `d=0,2` e 24 turmas por condição, a frequência foi 42,7%. Esses resultados sustentam cautela ao prometer uma comparação conclusiva com poucas turmas, mas não determinam o tamanho necessário do estudo real. Um piloto pequeno pode investigar viabilidade e instrumentos.

## Limites e correções necessárias antes de integrar outro modelo

- **Preparação atencional adicional:** os efeitos são `[0,d,d]`. Não há diferença imposta entre B e C e o código não analisa C versus B. Para estudar esse acréscimo, definir explicitamente seu contraste e um parâmetro adicional, por exemplo `[0,d,d+delta]`, com `delta` nulo, positivo e negativo. Esses valores continuariam hipotéticos até haver base empírica.
- **Multiplicidade:** a linha `d=0` estima falso positivo do primeiro contraste. Não é a frequência de pelo menos um falso positivo na família. A distinção precisa aparecer no relatório; a rotina atual não contabiliza essa última medida.
- **Comparação de orçamento:** manter o mesmo número de turmas por condição faz três condições usarem 50% mais turmas e estudantes que duas. Também muda o limiar de teste. As linhas não comparam desenhos com o mesmo orçamento total.
- **Perdas:** são individuais, aleatórias e iguais entre condições. Não há perda de turmas nem ausência relacionada ao desempenho. `max(2, ...)` mantém pelo menos dois estudantes, mesmo quando o sorteio seria zero ou um; essa regra deve ser revista para cenários de perdas elevadas. Não houve perda artificial relevante esperada com os parâmetros atuais, mas a regra impede representar corretamente abandono total.
- **Efeitos negativos:** não aparecem na grade adicional recebida. O laboratório existente tem cenários negativos, mas isso não supre essa ausência no novo script.
- **Semente:** o gerador é global; reordenar cenários altera os sorteios atribuídos a cada um. O laboratório central já possui sementes por cenário e teste de invariância à reordenação. Preservar essa propriedade numa integração futura.
- **Medidas:** o script adicional simula uma medida contínua por estudante, sem pré-teste, retenção ou transferência. Não assume a existência de instrumento válido para atenção, expectativa, absorção ou processos implícitos.

## Consequência para o projeto

A devolutiva ajuda a distinguir a pergunta educacional do planejamento estatístico. Ela reforça a proposta em avaliação sobre representações, explicitação de relações e transferência. Não resolveu ainda a definição operacional de cada construto hipnótico ou um teste que distinga efeito de sugestão de efeitos de expectativa, explicação, prática e apoio visual.

Próximo marco: receber o parecer completo e sua matriz, confrontar as referências, definir uma contribuição operacional e um contraste principal com orientação. O script recebido fica preservado como objeto de auditoria; não substitui automaticamente o motor central nem altera o laboratório dos estudantes. Não houve experimento com pessoas ou incorporação de hipnose.

## Reprodução

```bash
python pesquisa/simulacoes/testes_lab.py
python pesquisa/simulacoes/laboratorio.py --cenario individuos --repeticoes 5000 --semente 20261028 --saida /caminho/para/resultados
python pesquisa/revisoes/segunda-ia-2026-10-28/executar_auditoria.py
```

O último comando escreve os arquivos em `resultados/` desta revisão. A criação de novos resultados não é evidência de calibração empírica.
