# Avaliação da experiência e devolutiva no relatório completo
ID: avaliacao-experiencia  
Versão documental: 1.0.0 — 28/10/2026  
Estado: diretriz documentada; questionário e campos ainda requerem implementação nas aulas.  
Origem: decisão do Prof. André de Oliveira Rodrigues em 28/10/2026.  
Fonte: [Prompt mestre 2.7.0](../../PROMPT_MESTRE_AULAS_DIGITAIS.md), seções 12, 13, 13.1 e 25.  
Dependências: [Leitura acessível](leitura-acessivel.md), [EPC](epc.md).

## Âncora conceitual
Recolher a impressão dos estudantes sobre leitura, fontes, layout, navegação, controles e representações, para orientar pesquisa e aperfeiçoamento das arquiteturas. Separar aprendizagem demonstrada, eventos técnicos e percepção declarada. Responder à avaliação do artefato não compõe a nota.

Entradas: versão do artefato e do questionário, controles realmente disponíveis, preferências quando registradas e respostas voluntárias. Saída: seção completa no mesmo relatório já previsto, com prévia, cópia, download e corpo do e-mail.

## Mecânica — aviso e perguntas
Apresentar antes do questionário:
“Queremos saber como este material funcionou para você. Suas respostas sinceras vão ajudar a pesquisar e melhorar os próximos materiais. Pode dizer o que ajudou, atrapalhou ou não fez diferença. Esta avaliação não muda sua nota. Você pode marcar ‘não usei’, ‘não sei’ ou deixar perguntas sem resposta.”

Não induzir resposta positiva nem prometer benefício individual. Não exigir diagnóstico, identificação de deficiência ou relato de condição clínica.

### Questionário inicial, versão 1.0.0
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
| comentario_opcional | O que você mudaria ou manteria? | Campo livre opcional; não exigir escrita |

Permitir selecionar mais de uma dificuldade e não combinar “não percebi dificuldade” com uma dificuldade sem pedir revisão clara. Se o artefato não tiver um recurso, mostrar “recurso não disponibilizado” em vez de induzir resposta de uso. Diferenciar isso de “não usei”, “não testei” e pergunta não respondida. Para estudantes que precisem, oferecer mediação e seleção por toque/teclado, sem registrar resposta presumida pelo adulto.

## Circuito — do uso ao aperfeiçoamento
Experiência → aviso de finalidade → avaliação voluntária → prévia do relatório → conferir e enviar pelo aplicativo de e-mail → análise docente → revisão documentada → nova versão.

Após revisão, registrar o que mudou, por quê e quais dados motivaram a mudança. Usar versões estáveis de perguntas para comparação, documentando alterações de redação e contexto. O questionário é instrumento inicial do projeto, não escala validada.

## Estrutura no relatório
Acrescentar a seção **Experiência com o artefato e preferências de leitura** ao relatório completo. Incluir:
- Versão do artefato, do prompt e do questionário.
- Recursos disponibilizados e recursos não disponíveis.
- Preferências registradas: fonte solicitada, disponibilidade/carregamento quando verificado, tamanho, espaçamentos, largura, aparência, foco, voz e movimento, conforme implementação.
- Respostas exatas às perguntas; perguntas sem resposta marcadas como “não respondida”.
- Dificuldades selecionadas e comentário, quando fornecido.
- Eventos pertinentes de ajuste ou uso somente se implementados, informados e efetivamente registrados; ausência de evento não significa que o recurso não foi usado.
- Observações e limitações técnicas pertinentes; não inventar fonte efetivamente renderizada a partir de uma lista CSS. Se não verificada, declarar “renderização não verificada”.

Manter junto aos dados de aprendizagem existentes: primeira confirmação, pistas, consultas, tentativas, recuperação e aplicação. Não transformar satisfação em nota ou índice de domínio. Não diagnosticar nem criar “perfil de TDAH/dislexia” a partir das escolhas.

A representação interna pode usar objeto avaliacao_experiencia com versao_questionario, recursos_disponiveis, preferencias, respostas e comentario_opcional. Campos ausentes ficam nulos/ausentes com rótulo explicativo, não são convertidos em respostas negativas. As preferências lembradas no navegador dependem de escolha explícita; o relatório permite que o estudante confira os dados que enviará.

## Entrega pelo e-mail
A mesma informação deve aparecer na prévia, cópia, download e corpo do e-mail. O botão abre o aplicativo com destinatário confirmado, assunto e relatório completo codificados. O estudante confere e envia. Não enviar automaticamente nem declarar envio pelo clique.

Se o tamanho exceder limites do aplicativo/link, avisar e oferecer cópia ou download para anexo manual; preservar integralmente a avaliação e os dados de aprendizagem. Não cortar texto silenciosamente nem substituir relatório completo por nota/resumo.

## Dialética — interpretação dos dados
Ponto cego: concluir que uma fonte melhorou cognição ou que uma arquitetura causou aprendizagem porque foi bem avaliada. Revisão: separar preferência, barreira percebida, desempenho e condições de uso; examinar exemplos e procurar padrões com limites.

Uma resposta pode indicar que a leitura pareceu melhor, embora ainda haja dificuldade no conceito. Repetição, familiaridade, ajuda recebida e mudança de dispositivo podem influenciar resultados. Registros de experiência são dados para formular e examinar perguntas, não prova causal isolada.

Não publicar relatos identificáveis em repositório público. Para divulgar sínteses, retirar identificadores e trechos que permitam reconhecer estudantes. Não apresentar teste técnico como experiência real de turma.

## Critérios de verificação
1. Aviso compreensível, participação sem efeito na nota e respostas negativas permitidas.
2. Perguntas e controles acessíveis, com opção de não uso e ausência de resposta preservada.
3. Correspondência exata entre formulário e seção do relatório.
4. Preferências relatadas corretamente e eventos ausentes distinguidos de zero.
5. Prévia, cópia, download e e-mail preservam as respostas completas.
6. Restaurar aparência não apaga avaliação ou progresso.
7. Nenhuma inferência diagnóstica ou promessa de eficácia.
