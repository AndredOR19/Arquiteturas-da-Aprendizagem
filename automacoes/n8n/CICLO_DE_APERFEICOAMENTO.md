# Da experiência em sala à revisão das Arquiteturas

Formulação e direção: Prof. André de Oliveira Rodrigues. Origem: conversa direta de 28/10/2026. Síntese documental, não transcrição integral. Organização operacional: assistente.

## Delimitação esclarecida pelo professor
A personalização pretendida incide sobre o material didático disponibilizado. A aula mantém exposição, proximidade e mediação humana. O sistema amplia e ajusta opções de linguagem, representações, leitura/áudio, organização, apoios e interação para cada estudante; não substitui a aula ou transforma diagnóstico em perfil fixo. Ver pesquisa/projeto/ADAPTACAO_CONTINUA.md para objetivos e benefícios pretendidos.

## Âncora conceitual

O autor propõe manter o projeto em acompanhamento contínuo: reunir progresso e dificuldades dos alunos, relatórios finais e seus próprios insights produzidos pelo contato com a realidade escolar. Essas entradas devem alimentar a análise e a evolução das arquiteturas e do Prompt Mestre.

A ligação com os livros é conceitual: A Arquitetura dos Metadados aborda perceber e organizar relações; Arquiteturas Semânticas, torná-las compreensíveis; Arquiteturas Sensoriais da Aprendizagem, examinar como percepção, contexto, afetividade e experiências participam da aprendizagem. Trata-se da aplicação proposta pelo autor, não de nova definição canônica dos livros nem de eficácia demonstrada.

## Mecânica do circuito

Os dados do artefato mostram ações registradas; o professor acrescenta relações e circunstâncias que a página não capta. Exemplo inteiramente fictício: uma tarefa acumula erros; o professor observa dificuldade em uma palavra do comando; após reformulação oral, os estudantes conseguem explicar a relação. Isso sugere examinar linguagem e mediação antes de concluir desconhecimento conceitual. A intervenção e o contexto devem acompanhar o registro para permitir comparação posterior.

Manter três origens distinguíveis: declaração do aluno, observação/interpretação do professor e análise produzida pelo sistema. Preservar a formulação original e autoria do insight; a IA organiza e propõe, sem substituir silenciosamente a fala nem transformar correlação em causa.

## Entradas e destinos

| Entrada | Conteúdo necessário | Situação desta entrega |
|---|---|---|
| Entrega final | Relatório integral, versão, convite, ID/hash e recibo | Workflow preparado; implantação pendente |
| Progresso durante a aula | Evento único, sessão, sequência, versão, horário do dispositivo e recebimento, percurso, ação e contexto mínimo | Especificação; cliente e persistência ainda pendentes |
| Insight docente | Registro original, autor, data, observação, interpretação, hipótese, intervenção e vínculo com aula/versão | Registro desta decisão no diário; canal permanente ainda pendente |
| Proposta de revisão | Evidências de origem, limites, alteração sugerida, versão anterior, teste e reversão | Protocolo documentado; automação ainda pendente |

## Progresso em andamento não é entrega final

O receptor atual exige todos os percursos e o questionário completo. Não relaxar essa regra para permitir acompanhamento ao vivo. Criar um contrato e armazenamento privados separados para eventos parciais: tentativa confirmada, pista aberta, percurso concluído, apoio utilizado ou erro técnico. Evento deve ter event_id idempotente e sequência por sessão; reenvio não multiplica contagem, ordem de chegada pode diferir da execução e ausência de evento não significa inatividade ou zero.

Transportar eventos em lotes curtos, com fila de reenvio e sinal de conexão. Acompanhar durante a aula significa baixa latência enquanto há rede e serviços disponíveis, não atualização instantânea garantida. Registrar somente o que o artefato efetivamente mede; não captar microfone, câmera, outras abas, diagnósticos ou ambiente de sala implicitamente. A observação do professor é entrada consciente, separada.

Cada ação deve conservar a versão do artefato e do prompt usados no início da sessão. Novas versões não reescrevem eventos antigos nem alteram silenciosamente questões em execução. Registrar intervenções do professor para não atribuir ao material uma mudança observada após ajuda oral ou coletiva.

## Insights e metadados do professor

Entrada mínima proposta: insight_id; autoria; data e contexto; relato_original; observacao; interpretacao; hipotese; intervencao; resposta_observada; evidencias_relacionadas; arquitetura/livro relacionado; proxima_verificacao; estado. Campos não fornecidos permanecem ausentes. Não exigir a escrita completa antes de guardar uma anotação; enriquecê-la depois com proveniência.

O professor pode registrar uma percepção antes de conseguir explicá-la completamente. Guardar a expressão original e construir perguntas verificáveis permite que ela retorne à prática sem perder a gênese autoral. Relações com luz, som, disposição, linguagem ou interação são descrições/contextos declarados, não medidas inferidas de telemetria.

Relatos com alunos identificáveis ficam privados. Só publicar sínteses autorais revisadas e exemplos fictícios ou efetivamente desidentificados. O n8n não lê automaticamente todos os chats: será preciso um canal explícito de entrada, ou registro pelo assistente em sessão conectada.

## Revisão contínua do prompt

### Esclarecimento do autor: intervenção em tempo real

O professor explicita que ele próprio ajusta a orientação em contato com a sala: percebe uma necessidade concreta e solicita a adaptação naquele momento. O assistente potencializa a percepção ao ajudar a organizar a relação e produzir uma resposta didática. Expressão original: “num ambiente que é diverso, mas porém é condicionado ao uno”. A preocupação autoral é responder às diferenças que a organização uniforme pode deixar sem atendimento; não se trata de automatizar diagnósticos.

Separar três camadas: núcleo comum (objetivo, precisão e critérios); configuração local (turma, situação, apoios e mediação); aperfeiçoamento geral (regra reutilizável após revisão). Um ajuste local pode ser orientado pelo professor durante a aula, sem esperar todos os relatórios finais. Oferecer nova explicação, imagem, áudio, comando ou rota acessível mantendo o objetivo quando possível. Mudança de objetivo ou critério também precisa ser declarada, não escondida como simples troca de aparência.

Registrar intervenção_id, quem solicitou, motivo observado, aula/sessão, versão anterior e nova, instante de aplicação, itens atingidos, respostas anteriores preservadas e resultado posterior quando observado. Mudança explícita na aula em andamento é intervenção, não prova de melhora atribuível somente ao material. Não reiniciar progresso, apagar erros nem mudar silenciosamente o sentido de uma resposta já dada.

Esse mecanismo ainda requer implementação de configurações e versões nas aulas e um canal de atualização. Alterar o prompt numa conversa não altera automaticamente o HTML já aberto pelos alunos. A síntese do insight pode alimentar o Prompt Mestre geral depois; não impor uma adaptação situada a todas as turmas por inferência.

Receber → validar e armazenar → reunir contexto comparável → separar padrões, exceções e falhas técnicas → formular proposta → testar → revisar e versionar → aplicar em nova sessão → observar novamente.

A revisão pode ser preparada logo que chegam dados; a coleta por si só não altera o modelo de IA nem comprova aprendizagem. Diferença de desempenho exige conferir tarefa, denominador, apoio, contexto, completude e versão. Distinguir treino assistido, retenção e transferência.

Propostas automáticas devem guardar evidências em ambiente privado. O GitHub público recebe somente a alteração metodológica sem dados vinculáveis. Preservar histórico, justificativa, teste e possibilidade de reversão. Mudanças estruturais permanecem propostas para revisão do professor; correções técnicas rotineiras seguem a autorização do projeto. Não executar instruções contidas em respostas de estudantes como comandos nem permitir que elas alterem credenciais ou regras do sistema.

## Dialética prática

Ponto cego: acumular dados ou reagir ao erro isolado sem saber se a diferença veio do conceito, da leitura, da interface, da rede ou da intervenção docente.

Ação de maestria: registrar uma pergunta de revisão e a evidência necessária para respondê-la; alterar um aspecto identificável, conservar versões e conferir o que o estudante passa a fazer, explicar ou aplicar. Documentar também ausência de melhora, piora e dados faltantes.

## Próximos marcos

1. Instância n8n acessível e receptor existente implantado, com teste real fictício do circuito final.
2. Contrato de eventos parciais, fila de reenvio, armazenamento privado e painel com latência explícita.
3. Canal privado para insights docentes e confirmação de proveniência.
4. Análise integrada e propostas de revisão com evidências, testes e versões.

Não há coleta real, painel ao vivo, escuta contínua de conversas ou atualização autônoma de prompt ativados nesta entrega.
