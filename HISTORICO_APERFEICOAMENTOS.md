# Histórico de aperfeiçoamentos

O prompt vigente é [PROMPT_MESTRE_AULAS_DIGITAIS.md](PROMPT_MESTRE_AULAS_DIGITAIS.md). O histórico do Git preserva o conteúdo anterior.

## 2.5.0 — 27/10/2026
**Pedido:** incorporar ao Prompt Mestre o aperfeiçoamento sobre associações entre imagens, linguagem, disposição espacial e interação; iniciar esboço de novo livro.

**Regra anterior e nova regra:** âncoras visuais e associação já eram previstas, mas sem protocolo operacional suficiente. A seção 6.1 passa a exigir relação definida, correspondência visível imagem–texto, referências estáveis na introdução, sinais redundantes, ação acessível, retirada gradual de pistas e aplicação em exemplo diferente. Layout funcional flexível; código D/R/E/L preservado.

**Justificativa pedagógica:** ajudar o estudante a localizar e construir relações, distinguindo resposta apoiada, reconhecimento e aplicação. Não presumir aprendizagem inconsciente garantida nem necessidades uniformes entre estudantes neurodivergentes.

**Arquivos:** PROMPT_MESTRE_AULAS_DIGITAIS.md (6.1, 16, 18 e 23), AGENTS.md, README.md, este histórico e livros/arquitetura-das-associacoes/ESBOCO.md. Novo livro com título provisório, autoria André de Oliveira Rodrigues, 14 capítulos propostos, instrumentos e roteiro de contribuição textual.

**Verificação:** leitura integral do prompt vigente e das orientações; conferência de consistência com cores existentes, exposição ampliada, acessibilidade e avaliação. Conferência por releitura dos arquivos salvos. Alteração documental: não exige teste de execução do motor.

**Limites:** aulas antigas e motor não modificados; a aplicação deve ser conferida nas próximas produções/revisões. Esboço editorial não é manuscrito completo nem metodologia com eficácia empiricamente validada. Bibliografia do novo livro ainda requer pesquisa e verificação.

## 2.4.2 — 26/10/2026
**Pedido:** “aula” deve ser entendida como artefato digital completo no fluxo GitHub; conferir memória e diretrizes antes de produzir. Acrescentar QR Code ao final.

**Alterações:** interpretação padrão explicitada na seção 1. Criadas aulas de História 231 e Ensino Religioso 192 do Bernardina, previstas para 27/10, com 26 percursos cada, quatro pistas por percurso, texto ampliado, fundo SVG temático, exploração, glossário e dicionário, leitura por voz, aparência, progresso e relatório completo com mailto. Documentos e guia docente permanecem fora do pacote público.

**Produção:** modelo de interface de 19/10 consultado; estilo funcional de 21/10 reaproveitado. Motor central de produção HTML, revisão d10a9a45ab2b06ef1d9b51383947f6dcc13502b8, consultado pelo conector por ser privado. O arquivo de motor não foi copiado para este repositório público. Conteúdos e interfaces de cada projeto ficam em aulas/, com projeto.yml e recursos explícitos.

**Verificação:** validação e compilação pelo motor; sintaxe JavaScript; conferência de publicação e interação registrada em aulas/VERIFICACAO_27-10-2026.md. QR Codes devem apontar apenas para endereços públicos conferidos.

**Limites:** último conteúdo aplicado à 231 não confirmado; tema proposto com retomada diagnóstica. BNCC consultada em fontes públicas, sem declarar os documentos do catálogo incorporados. Matriz escolar e RCG aguardam conferência. Voz depende do dispositivo. E-mail é aberto com mensagem completa; envio deve ser confirmado no aplicativo pelo estudante. Não há envio por servidor ou monitoramento externo.

## 2.4.1 — 26/10/2026
**Pedido:** esclarecer que a entrega desejada é um botão que abre o aplicativo de e-mail com a mensagem pronta, para o aluno conferir e enviar.

**Alterações:** seção 13 exige botão final “Enviar relatório ao professor”, link mailto: com destinatário do professor solicitante, assunto e relatório completo preenchidos. Endereço habitual de André mantido somente para suas solicitações. Acrescentados parâmetro de destinatário e conferência do botão; orientações AGENTS.md alinhadas.

**Verificação:** conferência documental da regra, preservação de prévia/cópia/download e alternativas para limites de tamanho. Abertura do aplicativo não deve ser tratada como confirmação de envio.

**Escopo e pendências:** atualização do prompt e das orientações. Não altera retroativamente os artefatos publicados; implementação e teste dos botões nesses materiais continuam pendentes.

## 2.4.0 — 26/10/2026
**Pedido:** os slides ficaram pouco desenvolvidos; incorporar Gamma ao processo.

**Alterações:** Gamma como etapa preferencial para slides, com briefing pedagógico, conteúdo e fontes preparados pelo assistente, design/geração pelo Gamma e conferência posterior; Quarto mantido como alternativa técnica. Prompt, orientações e README atualizados. Portal passa a aceitar links HTTPS identificados para apresentações no Gamma.

**Verificação:** nova apresentação gerada e ampliada de 10 para 18 cartões após conferência. Acrescentados livro, comparação científica, pistas, recuperação e transferência; corrigidas afirmações exageradas e removidas notas do orador. Conteúdo e amostras visuais conferidos no navegador; link do laboratório aberto com sucesso. ID e endereço registrados em ferramentas/gamma-aprender-a-aprender.json. Inclusão do link no portal validada localmente, com rejeição de URLs inválidas.

**Limites:** o conector da sessão não equivale a uma API instalada no GitHub Actions. Não foram configuradas credenciais Gamma no repositório. Conteúdo Gamma nativo permanece no Gamma; o Pages publica o portal e as aulas HTML.

## 2.3.1 — 26/10/2026
**Pedido:** publicar as aulas HTML no GitHub Pages.

**Alterações:** regra de publicação no prompt; catálogo explícito de materiais discentes; preparação seletiva do site; workflow de conferência de slides, configuração e deploy. Preservados os caminhos da aula 192 e do laboratório. Slides de demonstração ganham endereço próprio.

**Verificação:** preparação local e execução remota documentadas em ferramentas/VERIFICACAO.md. A produção conectada anterior concluiu com sucesso na execução 40379468444 da biblioteca.

**Limites:** somente materiais cadastrados entram no site. Uma nova aula exige cadastro e conferência de publicação. Não inclui material docente reservado nem envio de e-mail.

## 2.3.0 — 26/10/2026
**Pedido:** conectar a Biblioteca de Diagramação para produzir aulas digitais, materiais e slides, com reutilização e menor repetição de código e instruções.

**Alterações:** seção 20 do prompt; motor central com raiz externa; modelo de slides HTML/PowerPoint; conexão por commit fixado; comando de produção e exemplo transversal de slides; fluxo de produção no repositório privado da biblioteca, sem copiar seu motor para o repositório pedagógico público.

**Verificação:** 13 testes do motor e integração passaram. Demonstração de slides submetida a compilação e conferência próprias. Consulte ferramentas/VERIFICACAO.md para os resultados efetivamente concluídos.

**Limites:** não migra automaticamente aulas antigas, não publica sites nem envia e-mail. Os slides de demonstração não são uma aula curricular aplicada. Economia de tokens não quantificada.

## 2.2.0 — 26/10/2026
**Pedido:** laboratório de aprender a aprender na linguagem dos alunos e mural de uma página com dois diagramas paralelos, sem campos de identificação, com QR Code após publicação verificada.

**Alterações:** criada seção 19 do prompt; regra de adaptação transversal; benefício organizador primeiro; comparação com investigação científica sem equivalência mecânica; decisão de dedicar livro ao tema. Laboratório com 4 experiências e 28 passos, cartões exploráveis, ordenação por botões, comparação simulada, 3 pistas por passo, feedback, progressão por acerto, retorno e relatório completo local. Aparência Dia/Noite/Preto e branco/Projetor, leitura por voz dependente do navegador e sons opcionais.

**Arquivos:** laboratorios/aprender-a-aprender/index.html, style.css, data.js, app.js e README.md; prompt mestre; este histórico; README da raiz. Mural entregue em documento próprio.

**Verificação:** sintaxe JavaScript; percurso integral dos 28 passos em navegador; erro inicial, pista e recuperação preservados; bloqueio antes de testar os dois formatos; progresso mantido após recarregamento. Relatório mostrou 28 conclusões, 27 acertos iniciais e 1 pista no ensaio. Os números pertencem a teste técnico, não a alunos. Não há dados de teste publicados.

**Limites:** treino estático, com respostas verificáveis no cliente; não é prova sigilosa. Dados permanecem no navegador, sem sincronização nem envio automático. Voz ainda depende do dispositivo final. Publicação GitHub Pages concluída com sucesso e endereço público aberto em navegador. QR Code gerado com esse endereço e inserido na folha de uma página, com dois diagramas paralelos e sem campos de identificação. Documento renderizado e conferido.

## 2.1.0 — 26/10/2026
**Origem:** o professor aprovou o modelo de 19/10, solicitou texto explicativo maior, referências e âncoras visuais e determinou que o prompt completo e cada aperfeiçoamento sejam registrados no GitHub. O repositório será a base documental para BNCC, RCG e demais documentos.

**Alterações consolidadas:**
- Instituído prompt mestre único e completo na raiz.
- Preservado o modelo de entrada, dados e layout das referências de 19/10 e 15–16/10.
- Ampliada a diretriz de exposição: desenvolvimento conceitual, mecanismo, exemplos, referências e apoio visual; extensão editorial orientativa, sem preenchimento artificial.
- Explicitada a diferença entre fundo temático e âncora visual que ensina.
- Consolidado o mínimo vigente de 26 percursos, substituindo instruções antigas de 13.
- Integradas AEE, MACI, ARN, SVS, EPC e SSS/ASA.
- Mantidos glossário, dicionário, pistas graduadas, voz, acessibilidade e bloqueio de avanço até o acerto.
- Consolidada a exigência de relatório completo e entrega transparente, incluindo alerta contra corte silencioso.
- Criadas orientações AGENTS.md para consulta prévia e atualização versionada.
- Criada estrutura e catálogo para os documentos curriculares, com status pendente explícito.

**Arquivos:** PROMPT_MESTRE_AULAS_DIGITAIS.md; AGENTS.md; HISTORICO_APERFEICOAMENTOS.md; README.md; base-curricular/README.md; base-curricular/catalogo.json.

**Escopo:** atualização documental. O cadastro de uma regra não declara sua aplicação retroativa às aulas já publicadas.

**Pendências:** receber e conferir os arquivos oficiais selecionados de BNCC, RCG e demais documentos. O catálogo não declara esses arquivos como carregados.

## Modelo para próxima entrada
- Versão e data:
- Pedido/observação do professor:
- Regra anterior e nova regra:
- Justificativa pedagógica:
- Arquivos e aulas efetivamente alterados:
- Verificação realizada:
- Pendências:


