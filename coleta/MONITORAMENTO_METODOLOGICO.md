# Monitoramento de metodologias e circuitos

Versão 1.0.0 · 29/10/2026. Autoria pedagógica: Prof. André de Oliveira Rodrigues.

## Âncora
Registrar a escolha metodológica e sua experiência de uso para orientar a próxima aula. Extensão opcional do envelope 1.0.0: legados sem `metodologia` permanecem válidos; ausência significa não coletado. Nas novas aulas sob o Prompt 2.23.0, integrar este registro e conferir todas as saídas do relatório.

## Mecânica
`comMetodologia(payload,dados)` em metodologia.mjs valida e anexa o mesmo objeto ao JSON e ao texto do relatório sem alterar o original, a nota ou as respostas. Chamar após atividades e avaliações confirmadas; não preencher opinião pelo estudante. `resumirMetodologia` calcula totais por circuito a partir dos históricos, sem limiar automático de tédio, domínio ou eficácia. O receptor conserva o objeto integral; não há novas colunas no painel ou envio ativo.

Metadados definidos pelo produtor: estilo/versão, método principal/secundários, fluxo visual, justificativa, espiral e circuitos. Cada circuito possui ID, método, operação, critério e IDs dos percursos. Cada percurso é associado uma única vez, para evitar duplicar contagem. Circuito significa bloco metodológico; não exige uma nova tela. Use operação recuperação ou transferência somente quando a tarefa realmente as verifica. Tempos não são inferidos; registrar somente se medidos em instrumento próprio.

Na espiral, indicar conceito, evidência anterior disponível, novidade, ponte interdisciplinar, critério e próxima retomada. Se não houver evidência, escrever “não disponível”; se ponte não for pertinente ao recorte, justificar isso no campo. Uma intenção de retomada não demonstra aplicação.

## Circuito
| Origem | Registro | Uso docente |
|---|---|---|
| Produtor | Método, estilo/versão e mapa de circuitos | Identificar o roteiro efetivamente entregue |
| Atividades | Primeiros acertos/total, tentativas e pistas por circuito | Localizar dificuldade e apoio usado |
| Estudante | Interesse, repetição e ritmo; circuito comentado opcional | Identificar percepção declarada |
| Professor | Contexto, tarefas comparáveis e próxima decisão, em registro privado | Manter, revisar ou variar com justificativa |

Perguntas sem alternativa pré-marcada:
- Como foi seu interesse nesta aula? Manteve meu interesse / Em parte / Perdi o interesse / Não sei avaliar.
- Como foi a repetição das atividades? Ajudou a consolidar / Repetiu mais do que precisei / Precisei de mais prática / Não sei avaliar.
- Como foi o ritmo? Adequado / Rápido demais / Lento demais / Variou entre partes / Não sei avaliar.
- Quer indicar uma parte? Circuito opcional (`null` sem indicação); comentário opcional. Confirmar as três respostas.

As três respostas e a confirmação são necessárias nas novas aulas instrumentadas, com qualquer opinião válida; não modificam nota. Preservar o questionário legado de layout e leitura. Conferir bloqueio na interface, conclusão, recarga e rotas alternativas. Exigir extensão no adaptador da nova aula: o receptor mantém compatibilidade e, isoladamente, não exige sua presença. Texto deve seguir na prévia, cópia, TXT e e-mail integral, usando a alternativa para mensagens longas já existente.

## Dialética
Perda de interesse relatada pede revisão de representação, tarefa, ritmo e condições; acerto baixo com interesse mantido pede investigar pré-requisitos e apoios. Repetição útil pode justificar manter prática. Conferir transferência em tarefa apropriada antes de concluir domínio. Sem relato, não classificar tédio com base em clique, erro ou demora. Não somar opinião à nota, inferir diagnóstico ou comparar métodos com tarefas/populações diferentes como prova causal.

Comparar relatórios por turma/componente, objetivo, versão do método/estilo e critérios semelhantes. Informar denominador, dados ausentes e limitações; observar conjuntamente percepção e desempenho. Propor ajuste ao professor sem trocar método durante avaliação ou reescrever tentativas anteriores. Dados individuais permanecem privados; somente fixtures fictícios no GitHub.

## Estado e verificação
Módulo de anexo, validação e resumo implementados para integração; testes locais em `node coleta/testes-metodologia.mjs`. Regenerar Code.gs com `node coleta/build-server.mjs`. Nenhuma aula antiga foi migrada, não foi adicionado formulário às páginas e a coleta online continua não implantada. A adoção exige integrar UI, relatório e bloqueios por aula e testar em navegador e receptor real; documentação/módulo não equivalem a monitoramento ativo em sala.
