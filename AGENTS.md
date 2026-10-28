# Orientações de trabalho — Arquiteturas da Aprendizagem

Este é o repositório de referência pedagógica do Prof. André de Oliveira Rodrigues.

## Antes de produzir ou revisar aulas
1. Leia PROMPT_MESTRE_AULAS_DIGITAIS.md integralmente.
2. Leia as últimas entradas de HISTORICO_APERFEICOAMENTOS.md.
3. Consulte base-curricular/catalogo.json e os documentos pertinentes efetivamente disponíveis.
4. Confira horário, escola, turma, componente e continuidade no registro mais recente, sem tratar aula planejada como aplicada.
5. Preserve arquivos existentes e modelos enviados pelo professor.

## Biblioteca de arquiteturas
- Ler biblioteca-arquiteturas/PROTOCOLO_IA.md e catalogo.json; conferir compatibilidade com o prompt, núcleo transversal, dependências e ramo disciplinar.
- Preencher registro de composição com decisões observáveis; outra IA deve conseguir executar sem presumir histórico de conversa.
- Respeitar estado das plantas e pendências. AEE atual é Exposição Explicativa; manter filiação de variantes editoriais.
- Aplicar preferências de leitura: fontes reais, tamanho e espaçamento ajustáveis, apresentação reversível e sem rótulos diagnósticos. Não inferir dislexia/TDAH ou prometer benefício universal de fontes.
- Atualizar catálogo e validar ligações/dependências ao alterar plantas. Distinguir documentação, implementação e aplicação.

## Ao incorporar um aperfeiçoamento
- Atualize a seção correspondente do prompt vigente.
- Incremente sua versão e registre a mudança no histórico na mesma entrega.
- Não acumule instruções contraditórias ou prompts concorrentes.
- Diferencie diretriz registrada de funcionalidade realmente implementada e testada.
- Faça commit descritivo e confira o conteúdo salvo.
- Não prometa atualização automática em sessões sem acesso ao GitHub.

## Requisitos atuais de destaque
- Modelo visual aprovado: aula de 19/10 e captura de 15–16/10.
- Texto explicativo ampliado, didático, com referências próximas das afirmações e âncoras visuais que ensinam.
- Design de associações: cumprir seção 6.1 do prompt. Definir relação, aproximar imagem e frase, manter sinais redundantes e D/R/E/L, oferecer interação acessível, reduzir pistas gradualmente e conferir aplicação em novo exemplo. Layout flexível; não prometer aprendizagem automática ou perfil único de neurodivergência.
- Integração estético-semântica: cumprir seção 6.2 do prompt. A linguagem do objeto participa da composição e das ações; sketchnote é uma possibilidade. Fundamentar escolhas, manter acesso e D/R/E/L, diferenciar produção didática e documento e conferir transferência além do estilo. Levar o briefing ao HTML, aos slides e aos demais suportes.
- AEE + MACI + ARN + SVS + EPC + SSS, integradas em ASA.
- No mínimo 26 percursos; pistas graduadas; glossário e dicionário.
- Próximo percurso liberado somente após acerto; preservar tentativas e apoios.
- Relatório completo, não somente nota; prévia, cópia e download. Ao final, botão “Enviar relatório ao professor” abre o aplicativo de e-mail com destinatário confirmado do solicitante, assunto e relatório completo preenchidos; o estudante confere e envia. Não exige backend de e-mail e não confirmar envio pelo simples clique. Consulte a seção 13 do prompt para limites e alternativas.
- Guias e gabaritos docentes separados do material público; não usar senha no JavaScript como proteção.
- Nunca registrar alunos identificáveis, senhas, tokens ou segredos neste repositório.

## Base curricular
O diretório base-curricular organiza documentos oficiais e seus metadados. Espaço reservado não significa documento recebido. Use status explícito e proveniência verificável.

Autoria pedagógica: Prof. André de Oliveira Rodrigues.


## Produção conectada
- Consulte ferramentas/README.md e ferramentas/biblioteca.lock.json antes de produzir com o motor central.
- A biblioteca privada é a fonte técnica; este repositório público guarda os conteúdos. Não copie o motor ou credenciais.
- Leia só os arquivos técnicos pertinentes depois de cumprir a consulta pedagógica obrigatória.
- Slides: uma ideia por tela, imagens explicativas e aplicação. Confira HTML e PPTX separadamente e mantenha material docente fora dos arquivos públicos.

## Publicação de HTML
- Publique as aulas HTML no GitHub Pages. Cadastre cada entrega em publicacao/catalogo.json e acompanhe publicar-pages.yml até o deploy.
- Confirme o endereço público funcional antes de entregar. Preserve os caminhos anteriores de aulas e laboratórios.
- Somente material discente pode entrar no pacote público; exclua guias, dados de estudantes e respostas docentes reservadas.


## Gamma na produção de apresentações
- Prefira o conector Gamma disponível para apresentações didáticas visuais, conforme ferramentas/GAMMA.md e seção 22 do prompt.
- Prepare conteúdo, exemplos e fontes antes da geração. Confira o resultado e corrija profundidade e apoio visual insuficientes.
- Mantenha o modelo Quarto como alternativa técnica; a demonstração simples não define o padrão final de qualidade.
- Não confunda o uso do conector nesta sessão com uma API instalada no Actions. Registre apenas o link final, sem credenciais.

## Devolutiva dos estudantes
Aplicar seção 13.1 e planta avaliacao-experiencia: exigir todas as respostas e confirmação da avaliação de layout, leitura, fontes e interação para concluir, liberar nota e relatório final/e-mail, sem a opinião afetar o cálculo da nota; explicar finalidade de pesquisa e revisão; preservar respostas e preferências no relatório completo, inclusive e-mail. Distinguir não uso, indisponibilidade e ausência de resposta; não inferir diagnósticos ou efeito causal.

Bloqueio de conclusão: validar completude em todas as rotas de resultado e após recarregar; sem alternativas pré-marcadas. Aceitar não uso/não teste/não saber quando pertinentes. Sugestão escrita tem alternativa explícita “não tenho sugestão agora”. Preservar progresso e revalidar após edição. E-mail aberto não comprova entrega; o professor confere relatório recebido.
