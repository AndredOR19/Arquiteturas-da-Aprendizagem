# Laboratório reutilizável

Extensão de 29/10/2026: [Arquitetura de simulações de interface, planejamento e circuitos quânticos](ARQUITETURA_SIMULACOES.md), com implementação e execução de referência em [execucoes/20261029-ux-quantico/RELATORIO.md](execucoes/20261029-ux-quantico/RELATORIO.md). O módulo quântico é simulação clássica de circuitos ideais; a avaliação da interface examina políticas propostas, sem prever aprendizagem.

Para executar pelo GitHub e acompanhar a evolução, começar por [LABORATORIO.md](LABORATORIO.md). Os arquivos abaixo preservam a primeira simulação como marco histórico; o motor reutilizável é laboratorio.py.

# Simulações para desenvolver e examinar as Arquiteturas

Primeira execução: 28/10/2026. Estado: experimento computacional ilustrativo, sem dados reais, sem calibração das arquiteturas e sem validação de eficácia. Código e análise preparados pelo assistente a pedido do Prof. André.

## O que uma simulação permite
Transformar hipóteses em regras explícitas, variar condições e observar consequências do modelo. Isso permite examinar coerência, sensibilidade e desenho de pesquisa. Resultados dependem das regras e parâmetros; programar um benefício e reencontrá-lo na saída não comprova que exista com alunos.

## Primeira execução
`simular.py` gera 40.000 estudos sintéticos, em oito combinações de tamanho de amostra e efeito adicional hipotético. Pergunta: uma comparação de ganhos conseguiria distinguir efeito nulo de diferenças pequenas, maiores ou negativas? Não é simulação de mecanismos cognitivos ou das teorias inteiras.

Dois grupos independentes começam com 30 ou 60 participantes cada. Cada pessoa fictícia tem probabilidade inicial Beta(6,4), média 60%, e realiza pré/pós com 20 itens independentes por teste. Os dois grupos recebem incremento comum de 5 pontos percentuais na probabilidade de acerto; apenas um recebe incremento adicional assumido de −5, 0, +5 ou +10 pontos. Probabilidades são limitadas a 1%–99%. A perda de acompanhamento é 20%, aleatória e independente. Comparam-se ganhos individuais por Welch bilateral com alfa 5%. São 5.000 réplicas por combinação e sementes fixas.

Todos os parâmetros são ilustrativos. Não foram extraídos de estudos de dança, nem medidos com alunos. Não há ajuste estatístico a dados reais, intervalo de previsão do projeto ou probabilidade de sucesso da teoria. O pequeno limite imposto às probabilidades pode fazer o efeito médio efetivo diferir do incremento assumido.

## Reprodução
Requer Python 3.10+, NumPy e SciPy. A execução original utilizou NumPy 2.3.5 e SciPy 1.17.0; conservar versões e sementes para reprodução exata.

```bash
python3 pesquisa/simulacoes/simular.py
```

O resultado completo fica em `resultados.json`, com hipóteses, sementes, estimativas, percentis, frequência de rejeição e erro de Monte Carlo. Dados sintéticos não devem ser importados para o cadastro dos alunos ou relatados como achados empíricos. Não interromper ou ampliar uma pesquisa real apenas para obter significância.

## Relação com as propostas do autor
- Progressão e alternância: um modelo futuro pode representar precisão, dificuldade da troca, prática, pausas e eventual transferência. Antes, definir regras observáveis e confrontá-las com dados.
- Cadência textual: modelar relações entre organização, esforço e recuperação exige especificar a tarefa, as medidas e hipóteses concorrentes. Não representar hemisférios como interruptores texto/imagem.
- Operador Cognitivo: modelos de agentes podem explorar coordenação de equipes, deixando explícito se sincronização, comunicação e desempenho são regras assumidas ou medidas de validação.
- Mestrado: esta primeira simulação contribui para planejamento metodológico; não constitui evidência de eficácia da intervenção. Uma simulação pode ser objeto legítimo de pesquisa se o projeto tiver essa pergunta e método, mas o presente exercício não valida as arquiteturas com alunos.

## Referências consultadas e limites de uso
- Morris TP, White IR, Crowther MJ. Using simulation studies to evaluate statistical methods. Statistics in Medicine. 2019;38:2074–2102. DOI 10.1002/sim.8086. https://doi.org/10.1002/sim.8086. Orienta explicitar objetivos, gerador dos dados, estimando, métodos e desempenho; não fornece os parâmetros deste exercício.
- Pavlik PI, Anderson JR. Practice and forgetting effects on vocabulary memory. Cognitive Science. 2005;29:559–586. DOI 10.1207/s15516709cog0000_14. https://pubmed.ncbi.nlm.nih.gov/21702785/. Resumo consultado: modelo de prática, espaçamento e retenção de vocabulário; não foi implementado nem calibrado aqui e não valida transferência da dança para lógica.
- NetLogo, Northwestern University. https://docs.netlogo.org/whatis.html. Ferramenta de modelagem por agentes, pertinente a cenários coletivos.
- PsychoPy Builder. https://psychopy.org/builder/. Ferramenta de construção de experimentos, útil à coleta de respostas; não é simulador autônomo da mente nem evidência para a teoria.

Próximo passo: escolher um mecanismo delimitado e comparar modelos concorrentes, incluindo efeito ausente e prejuízo; usar dados reais adequados para calibrar e testar previsões fora dos dados de ajuste. A calibração pode aproximar o modelo das observações, sem transformar suas premissas em realidade comprovada.

