# Ensaios de interface e circuitos quânticos

Dados sintéticos e modelos formais. Nenhum estudante observado; nenhuma aula alterada por este executor.

## Políticas de interface

| Proposta | Casos enumerados | Casos com conflito de requisito |
| --- | ---: | ---: |
| proposta-inicial | 192 | 186 |
| proposta-acessivel | 192 | 0 |

Os conflitos são consequência das regras programadas, não medidas de usabilidade ou eficácia. A grade inclui recuperação, teclado, ausência de voz/colega e movimento reduzido. Não representa prevalências.

## Circuitos ideais simulados em CPU

| Circuito | Probabilidades exatas (arredondadas) |
| --- | --- |
| superposicao | 0: 0.500, 1: 0.500 |
| interferencia-retorno | 0: 1.000, 1: 0.000 |
| interferencia-fase | 0: 0.000, 1: 1.000 |
| fase-complexa | 0: 0.500, 1: 0.500 |
| bell | 00: 0.500, 01: 0.000, 10: 0.000, 11: 0.500 |

Cada circuito tem 4.096 disparos com reposição/preparação; frequências amostrais e amplitudes constam no JSON. Não há hardware, ruído, medição intermediária ou vantagem quântica demonstrada.

## Planejamento de futura comparação

30.000 estudos sintéticos (6 cenários × 5.000). Efeito adicional assumido −5, 0 ou +5 pontos na probabilidade de acerto; perda aleatória de 20%. Nenhum efeito foi estimado para as propostas de interface.

| Pessoas iniciais por grupo | Efeito assumido (pp) | Rejeição bilateral | Erro Monte Carlo |
| ---: | ---: | ---: | ---: |
| 30 | -5 | 0.2064 | 0.0057 |
| 30 | 0 | 0.0498 | 0.0031 |
| 30 | 5 | 0.2142 | 0.0058 |
| 60 | -5 | 0.3756 | 0.0068 |
| 60 | 0 | 0.0462 | 0.0030 |
| 60 | 5 | 0.3792 | 0.0069 |

Esta grade usa participantes independentes. Para intervenções organizadas por turma, usar o modelo turmas existente; não tratar alunos da mesma turma como unidades independentes.

## Decisão de engenharia

Preparar protótipo com progresso visível, conquistas por investigação/recuperação, cartões por toque/teclado e voz opcional, dupla opcional, efeitos desligados e movimento reduzido. A aplicação integral na Missão Ponte e os testes com alunos permanecem pendentes. Primeiro conferir acesso sem leitura e equivalência dos comandos; depois comparar exemplos novos e relatos de desconforto.

Referência formal: IBM Quantum Learning, Quantum circuits; IBM Quantum Documentation, Statevector. URLs e limites em ARQUITETURA_SIMULACOES.md.
