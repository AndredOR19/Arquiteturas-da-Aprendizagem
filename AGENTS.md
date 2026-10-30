# Orientações de trabalho — Arquiteturas da Aprendizagem

Este é o repositório de referência pedagógica do Prof. André de Oliveira Rodrigues.

## Antes de produzir ou revisar aulas
1. Leia PROMPT_MESTRE_AULAS_DIGITAIS.md integralmente.
2. Leia as últimas entradas de HISTORICO_APERFEICOAMENTOS.md.
3. Consulte banco-pedagogico/catalogo.json por turma/componente/período, originais e alertas; depois base-curricular/catalogo.json e as fontes curriculares disponíveis.
4. Confira horário, escola, turma, componente e continuidade no registro mais recente, sem tratar aula planejada como aplicada.
5. Preserve arquivos existentes e modelos enviados pelo professor.
6. Selecione um dos dois prompts em prompts/README.md. Use planos de turma efetivamente recebidos conforme base-curricular/PLANOS_DE_TURMA.md; documento anunciado não é documento consultado.

## Biblioteca de arquiteturas
- Ler biblioteca-arquiteturas/PROTOCOLO_IA.md e catalogo.json; conferir compatibilidade com o prompt, núcleo transversal, dependências e ramo disciplinar.
- Preencher registro de composição com decisões observáveis; outra IA deve conseguir executar sem presumir histórico de conversa.
- Respeitar estado das plantas e pendências. AEE atual é Exposição Explicativa; manter filiação de variantes editoriais.
- Aplicar preferências de leitura: fontes reais, tamanho e espaçamento ajustáveis, apresentação reversível e sem classificar ou inferir diagnósticos; oferecer atalhos opcionais identificados “Dislexia” e “TDAH”, conforme pedido do professor. Não inferir dislexia/TDAH ou prometer benefício universal de fontes.
- Atualizar catálogo e validar ligações/dependências ao alterar plantas. Distinguir documentação, implementação e aplicação.

## Ao incorporar um aperfeiçoamento
- Atualize a seção correspondente do prompt vigente.
- Incremente sua versão e registre a mudança no histórico na mesma entrega.
- Mantenha o Prompt Mestre como núcleo comum e os dois prompts de entrada em prompts/ como fluxos complementares, sem regras contraditórias.
- Diferencie diretriz registrada de funcionalidade realmente implementada e testada.
- Faça commit descritivo e confira o conteúdo salvo.
- Não prometa atualização automática em sessões sem acesso ao GitHub.

## Requisitos atuais de destaque
- Dois fluxos aprovados: prompts/FLUXO_01_CADERNO_ILUSTRADO.md (apresentação anterior) e prompts/FLUXO_02_MISSAO_INTERATIVA.md (Fredoka e efeitos do código aprovado). Fluxo 02 é padrão para novas aulas; preserve o fluxo da aula existente salvo pedido de mudança. Registre a escolha na composição.
- Texto explicativo ampliado, didático, com referências próximas das afirmações e âncoras visuais que ensinam.
- Design de associações: cumprir seção 6.1 do prompt. Definir relação, aproximar imagem e frase, manter sinais redundantes e D/R/E/L, oferecer interação acessível, reduzir pistas gradualmente e conferir aplicação em novo exemplo. Layout flexível; não prometer aprendizagem automática ou perfil único de neurodivergência.
- Integração estético-semântica: cumprir seção 6.2 do prompt. A linguagem do objeto participa da composição e das ações; sketchnote é uma possibilidade. Fundamentar escolhas, manter acesso e D/R/E/L, diferenciar produção didática e documento e conferir transferência além do estilo. Levar o briefing ao HTML, aos slides e aos demais suportes.
- AEE + MACI + ARN + SVS + EPC + SSS, integradas em ASA.
- No mínimo 26 percursos; pistas graduadas; glossário e dicionário.
- Próximo percurso liberado somente após acerto; preservar tentativas e apoios.
- Relatório completo, não somente nota; prévia, cópia e download. Ao final, botão “Enviar relatório ao professor” abre o aplicativo de e-mail com destinatário confirmado do solicitante, assunto e relatório completo preenchidos; o estudante confere e envia. Não exige backend de e-mail e não confirmar envio pelo simples clique. Consulte a seção 13 do prompt para limites e alternativas.
- Guias e gabaritos docentes separados do material público; não usar senha no JavaScript como proteção.
- Nunca registrar alunos identificáveis, senhas, tokens ou segredos neste repositório.

## Banco documental e base curricular

- Leia banco-pedagogico/README.md e COMO_CADASTRAR.md. Arquive planos gerais autorizados com original, extração, metadados e SHA-256; deduplique por hash e preserve autoria/regente e responsável distintos.
- Outros professores contribuem por revisão; nenhuma permissão é concedida por cadastro. Registre fonte/recorte/adaptações em cada composição. Não transformar plano escolar em norma BNCC verificada.
- Não arquive PEI preenchido ou dados individuais no repositório público, mesmo em pasta chamada privada. Somente modelos vazios e orientações gerais; armazenamento restrito exige permissões reais e ainda não foi configurado.
- Execute python3 banco-pedagogico/validar.py ao alterar documentos ou catálogo, além do validador de arquiteturas.
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


## Diário, metodologias e acompanhamento entre anos
- Consultar pesquisa/MEMORIA.md, registros.json, producoes.json e o diário pertinente antes de continuar esses projetos. Registrar os insights em sessão autorizada, preservando autoria, origem, hipótese e evidência; não prometer memória automática.
- Aplicar seções 27–28 do prompt: progressão coordenada e cadência textual são propostas em desenvolvimento. Não afirmar alternância neural, benefício universal ou transferência demonstrada.
- Seguir seção 13.2 e pesquisa/longitudinal/README.md: aluno estável, matrículas por ano/série/turma, listas nominais privadas, ausências diferentes de zero e promoção somente confirmada. Nunca publicar dados individuais ou códigos vinculáveis.
- Validar catálogo e banco documental; executar os ensaios longitudinais ao alterar esquema ou ferramenta. Registrar o estado real da integração com a coleta, sem ativação implícita.

## Laboratório e absorção de novas arquiteturas
- Cumprir seções 29–30 do prompt e pesquisa/simulacoes/CONTRATO_MODELO.md. Atualizar catálogo, fontes e domínio ao registrar arquitetura nova. Não deduzir parâmetros ou promover simulações a validação.
- Workflow executa cálculo e relatórios sem IA, com arquivo na branch resultados-simulacoes. Conferir teste remoto e arquivo real antes de afirmar execução no GitHub.
- Domínios simbólicos/filosóficos, incluindo Cabala, permanecem separados de alegações empíricas. Entrada pendente não é modelo implementado.

## Projeto institucional e Sofia Cog OS
- Cumprir seção 31 do prompt e consultar pesquisa/projeto. Sofia nesta frente significa arquitetura de software e dados; recuperar fonte técnica e conferir o estado, sem presumir adaptação escolar ou implantação.
- Diferenciar mestrado delimitado e expansão em rede; admissão, bolsa, custeio e fomento são processos distintos. Mensagem preparada não é enviada, afinidade não é vaga e código lido não é produção auditada.

## Fontes e layout
- Cumprir seção 33: botão visível e opções explicadas, perfis reversíveis, fonte real/licenciada e fallback informado. Não exigir diagnóstico nem prometer tratamento. Conferir empacotamento, teclado/celular e preservação das respostas.


## n8n, insights e adaptação situada
- Consultar seção 26.1 do prompt e automacoes/n8n/README.md e STATUS.json.
- Reutilizar a coleta e os convites existentes; relatório final completo não é evento parcial.
- Separar necessidade percebida pelo professor, adaptação local e mudança geral; preservar autoria, contexto, versões e histórico das respostas.
- Conferir código, importação, implantação e teste real separadamente; workflow preparado não é coleta ativa.
- Regenerar JSON após mudar contrato/logica e executar os testes n8n e coleta. Não publicar envelopes, convites, observações identificáveis ou credenciais.


## Lettering Digital escolar/pedagógico
- Aplicar seção 6.3 e publicacao/lettering/README.md. Títulos e palavras-chave com fonte local licenciada; texto e comandos em fonte de leitura.
- Composição própria de caderno, objeto central e relações; manter alternativas de leitura e prioridade dos apoios.
- Oferecer Leitura simples sem apagar respostas; rever apresentação se houver desconforto.
- Conferir duas aulas de História 192 no workflow antes de entregar links; não confundir revisão visual com migração de conteúdo/estrutura do legado.


## Acesso ao tema para estudantes que ainda não leem/escrevem
- Cumprir seção 11.2 e publicacao/imagens/README.md: entrada visível Aprender com imagens e áudio, cenas específicas, orientação falada relacionando objeto/cor/forma/significado/palavra, repetição, letra inicial, resposta por toque/teclado e aplicação em outro exemplo.
- Não substituir por fonte especial, decoração ou leitura do texto extenso. Cor nunca é o único sinal; não exigir escrita/diagnóstico e não infantilizar.
- Registrar tentativas/pistas separadamente da nota; não liberar resultado/avaliação por concluir o apoio. Não afirmar alfabetização automática ou conversão integral da aula.
- Cadastrar novas cenas e narrativas no módulo compartilhado e conferir navegador, falta de voz, celular, preservação das respostas e relatório.

## Roteiros e monitoramento metodológico
- Cumprir seção 5.1 do prompt e consultar biblioteca-arquiteturas/estilos/README.md e o repertório do componente. Investigação é uma modalidade, não uma exigência de toda aula. Separar metodologia e fluxo visual.
- Registrar espiral MACI, ponte interdisciplinar justificada, circuito personalizado e motivo da variação; 26 percursos não significam 26 perguntas investigativas.
- Novas aulas devem integrar e testar coleta/metodologia.mjs conforme coleta/MONITORAMENTO_METODOLOGICO.md. Legados continuam válidos; registrar migração efetiva. Não inferir tédio ou eficácia de erros/cliques; revisão docente e dados privados.

## Leitura breve e linguagens alternativas
- Aplicar seção 3.1 do Prompt Mestre: uma explicação essencial curta por vez; oferecer reformulação direta, cotidiana/popular ou informal adolescente, exemplo e áudio opcionais, sem empilhar versões ou exigir sua leitura. Preservar significado, termos do componente, precisão e adequação à idade; gírias somente quando naturais e pertinentes.
- Aprofundamento permanece acessível; não cumprir metas de palavras por volume. Manter alternativas curtas, retorno explicativo e aplicação em novo exemplo com apoio menor. Não impor cinco alternativas nem tratar versões equivalentes como distratores.
- Registrar apoio realmente usado sem penalizar consulta ou inferir compreensão. Troca de linguagem preserva respostas/progresso; registro documental não migra aulas nem implementa controles.

## Coleta Supabase e identificação
- Consultar coleta/supabase/STATUS.json e README antes de afirmar coleta ativa. Base privada criada não é receptor, painel ou integração de aulas. Seguir seção 13.3 do prompt; identidade estável/matrícula e escola desde o início, vínculo servidor e identificação confirmada nas aulas migradas, com apoio docente.
- Não confiar em nome livre para autenticar ou em campos de escola/professor enviados pelo cliente para autorizar. Preservar dados privados, fila/recibo, registros parciais separados da conclusão, nota vigente e dispositivos compartilhados. Não expor credencial privilegiada, lista nominal ou relatório individual.
