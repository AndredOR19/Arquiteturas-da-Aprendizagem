# Avaliação da experiência e devolutiva no relatório completo
ID: avaliacao-experiencia  
Versão documental: 1.1.0 — 28/10/2026  
Estado: diretriz documentada; questionário e campos ainda requerem implementação nas aulas.  
Origem: decisão do Prof. André de Oliveira Rodrigues em 28/10/2026.  
Fonte: [Prompt mestre 2.8.0](../../PROMPT_MESTRE_AULAS_DIGITAIS.md), seções 12, 13, 13.1 e 25.  
Dependências: [Leitura acessível](leitura-acessivel.md), [EPC](epc.md).

## Âncora conceitual
Recolher a impressão dos estudantes sobre leitura, fontes, layout, navegação, controles e representações, para orientar pesquisa e aperfeiçoamento das arquiteturas. Separar aprendizagem demonstrada, eventos técnicos e percepção declarada. Responder à avaliação do artefato não compõe a nota.

Entradas: versão do artefato e do questionário, controles realmente disponíveis, preferências quando registradas e respostas obrigatórias a todas as perguntas, com alternativas pertinentes de não uso ou não saber. Saída: seção completa no mesmo relatório já previsto, com prévia, cópia, download e corpo do e-mail.

## Mecânica — aviso e perguntas
Apresentar antes do questionário:
“Queremos saber como este material funcionou para você. Suas respostas sinceras vão ajudar a pesquisar e melhorar os próximos materiais. Pode dizer o que ajudou, atrapalhou ou não fez diferença. Esta avaliação não muda sua nota. Para concluir a aula e liberar sua nota e o relatório, responda a todas as perguntas e confirme. Você pode marcar ‘não usei’, ‘não testei’ ou ‘não sei avaliar’ quando essas opções corresponderem à sua experiência.”

Não induzir resposta positiva nem prometer benefício individual. Não exigir diagnóstico, identificação de deficiência ou relato de condição clínica.

### Questionário inicial, versão 1.1.0
| Campo | Pergunta | Opções |
| --- | --- | --- |
| legibilidade | Como foi ler os textos? | Fácil / Em parte fácil / Difícil / Não sei avaliar |
| organizacao | Você encontrou textos, atividades e apoios? | Sim / Em parte / Não / Não usei essas partes |
| navegacao | Conseguiu ir e voltar pelas partes permitidas? | Sim / Em parte / Não / Não testei |
| controles | Conseguiu usar os botões e ajustes de que precisava? | Sim / Em parte / Não / Não usei |
| fonte_percepcao | Ao trocar a fonte, como ficou a leitura? | Mais confortável / Sem diferença percebida / Menos confortável / Não troquei / Não sei avaliar |
| espacamento_percepcao | Ao ajustar tamanho ou espaçamento, como ficou a leitura? | Mais confortável / Sem diferença percebida / Menos confortável / Não ajustei / Não sei avaliar |
| representacoes_percepcao | Imagens, diagramas ou objetos ajudaram a acompanhar a explicação? | Ajudaram / Ajudaram em parte / Atrapalharam / Não percebi diferença / Não usei |
| dificuldades | Onde encontrou dificuldade? | Texto / Organização / Botões / Fontes ou ajustes / Imagens ou fórmulas / Áudio / Celular ou tela / Outra / Não percebi dificuldade |
| sugestao | Quer sugerir algo para manter ou mudar? | Quero comentar / Não tenho sugestão agora; comentário solicitado somente ao escolher comentar |

Permitir selecionar mais de uma dificuldade e não combinar “não percebi dificuldade” com uma dificuldade sem pedir revisão clara. Se o artefato não tiver um recurso, oferecer “recurso não disponibilizado” para seleção explícita. Não pré-marcar respostas. Diferenciar isso de “não usei”, “não testei” e pergunta pendente. Todas as perguntas devem receber uma escolha válida por toque, clique ou teclado. Ao escolher comentar, exigir comentário não vazio ou permitir mudar para “não tenho sugestão agora”; nenhuma escrita é exigida de quem seleciona essa alternativa. Para estudantes que precisem, oferecer mediação e seleção por toque/teclado, sem registrar resposta presumida pelo adulto.

## Circuito — do uso ao aperfeiçoamento
Atividades concluídas → aviso de finalidade e avaliação obrigatória → todas as perguntas válidas → confirmação → liberação da nota e relatório final → conferir e enviar pelo aplicativo de e-mail → recebimento pelo professor → análise e revisão documentada.

Após revisão, registrar o que mudou, por quê e quais dados motivaram a mudança. Usar versões estáveis de perguntas para comparação, documentando alterações de redação e contexto. O questionário é instrumento inicial do projeto, não escala validada.

## Estrutura no relatório
Acrescentar a seção **Experiência com o artefato e preferências de leitura** ao relatório completo. Incluir:
- Versão do artefato, do prompt e do questionário.
- Recursos disponibilizados e recursos não disponíveis.
- Preferências registradas: fonte solicitada, disponibilidade/carregamento quando verificado, tamanho, espaçamentos, largura, aparência, foco, voz e movimento, conforme implementação.
- Respostas exatas a todas as perguntas e confirmação válida da avaliação. Registros parciais podem indicar perguntas pendentes, mas não liberam conclusão nem relatório final.
- Dificuldades selecionadas e comentário, quando fornecido.
- Eventos pertinentes de ajuste ou uso somente se implementados, informados e efetivamente registrados; ausência de evento não significa que o recurso não foi usado.
- Observações e limitações técnicas pertinentes; não inventar fonte efetivamente renderizada a partir de uma lista CSS. Se não verificada, declarar “renderização não verificada”.

Manter junto aos dados de aprendizagem existentes: primeira confirmação, pistas, consultas, tentativas, recuperação e aplicação. Não transformar satisfação em nota ou índice de domínio. Não diagnosticar nem criar “perfil de TDAH/dislexia” a partir das escolhas.

A representação interna pode usar objeto avaliacao_experiencia com versao_questionario, recursos_disponiveis, preferencias, respostas, sugestao, comentario, confirmado e estado_conclusao. Durante o preenchimento, campos ausentes ficam nulos/ausentes, sem convertê-los em respostas negativas ou válidas. A confirmação final exige todas as perguntas válidas. As preferências lembradas no navegador dependem de escolha explícita; o relatório permite que o estudante confira os dados que enviará.

## Entrega pelo e-mail
A mesma informação deve aparecer na prévia, cópia, download e corpo do e-mail. O botão abre o aplicativo com destinatário confirmado, assunto e relatório completo codificados. O estudante confere e envia. Não enviar automaticamente nem declarar envio pelo clique.

Se o tamanho exceder limites do aplicativo/link, avisar e oferecer cópia ou download para anexo manual; preservar integralmente a avaliação e os dados de aprendizagem. Não cortar texto silenciosamente nem substituir relatório completo por nota/resumo.

## Dialética — interpretação dos dados
Ponto cego: concluir que uma fonte melhorou cognição ou que uma arquitetura causou aprendizagem porque foi bem avaliada. Revisão: separar preferência, barreira percebida, desempenho e condições de uso; examinar exemplos e procurar padrões com limites.

Uma resposta pode indicar que a leitura pareceu melhor, embora ainda haja dificuldade no conceito. Repetição, familiaridade, ajuda recebida e mudança de dispositivo podem influenciar resultados. Registros de experiência são dados para formular e examinar perguntas, não prova causal isolada.

Não publicar relatos identificáveis em repositório público. Para divulgar sínteses, retirar identificadores e trechos que permitam reconhecer estudantes. Não apresentar teste técnico como experiência real de turma.

## Critérios de verificação
1. Aviso compreensível: avaliação obrigatória para conclusão, opinião sem efeito no cálculo da nota e respostas negativas permitidas.
2. Todas as perguntas sem seleção inicial; opções pertinentes de não uso, não teste ou não saber, com campos pendentes bloqueando a confirmação.
3. Correspondência exata entre formulário e seção do relatório.
4. Preferências relatadas corretamente e eventos ausentes distinguidos de zero.
5. Prévia, cópia, download e e-mail preservam as respostas completas.
6. Restaurar aparência não apaga avaliação ou progresso.
7. Nenhuma inferência diagnóstica ou promessa de eficácia.

## Bloqueio de conclusão — contrato funcional
- Manter separadas conclusão das atividades, conclusão da avaliação e liberação do resultado.
- Não liberar nota, tela final, relatório final com resultado, cópia/download finais ou e-mail antes de todas as respostas válidas e confirmação.
- Mostrar quantidade e identificação das perguntas pendentes, com erro textual acessível e foco na primeira; não exigir clicar em cada alternativa, mas responder a cada pergunta.
- Revalidar em todas as ações e rotas de resultado e após recarregar; um botão desabilitado isoladamente é insuficiente.
- Guardar atividades, tentativas e avaliação parcial. Retomar sem perder dados e sem revelar nota indevidamente.
- Se resposta obrigatória for apagada ou invalidada, retornar a avaliação pendente e pedir nova confirmação.
- A opinião não altera a nota calculada. Antes da liberação, mostrar “resultado ainda não liberado”, sem valor numérico, inclusive em exportações parciais eventualmente oferecidas.
- Depois da confirmação, mostrar nota e relatório integral para conferência. Liberar o botão que abre o e-mail; a ação não comprova envio nem recebimento.
- Para o professor, o relatório recebido é a evidência de entrega solicitada. Não registrar recebimento automaticamente sem evidência.
- Não tratar bloqueio de interface como proteção contra inspeção de dados calculados no cliente.

Estados sugeridos: em_atividade → avaliacao_pendente → avaliacao_confirmada → resultado_liberado → email_aberto. “Recebido pelo professor” depende de confirmação externa real; não é consequência automática de email_aberto.

### Ensaios necessários na implementação
1. Concluir os percursos e verificar que nota, conclusão e e-mail continuam bloqueados.
2. Deixar uma pergunta vazia; tentar todas as rotas de resultado; conferir aviso, foco e ausência de liberação.
3. Responder todas com opções válidas, inclusive opiniões negativas e não uso; confirmar e conferir liberação sem alterar o cálculo da nota.
4. Apagar uma resposta, editar sugestão, recarregar e retomar; conferir revalidação e preservação dos dados.
5. Operar por teclado e celular; ajustes de fonte não apagam avaliação.
6. Conferir igualdade das respostas e da nota liberada na prévia, cópia, download e corpo do e-mail, sem truncamento silencioso.
