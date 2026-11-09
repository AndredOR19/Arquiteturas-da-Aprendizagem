# Orientações de trabalho — Arquiteturas da Aprendizagem

Este é o repositório de referência pedagógica do Prof. André de Oliveira Rodrigues.

## Antes de produzir ou revisar aulas
1. Leia PROMPT_MESTRE_AULAS_DIGITAIS.md integralmente e MEMORIA_OPERACIONAL_AULAS.md. A seção 37 e a política 3.8.0 consolidam a entrega integral.
2. Leia as últimas entradas de HISTORICO_APERFEICOAMENTOS.md.
3. Consulte banco-pedagogico/catalogo.json por turma/componente/período, originais e alertas; depois base-curricular/catalogo.json e as fontes curriculares disponíveis.
4. Confira horário, escola, turma, componente e continuidade no registro mais recente, sem tratar aula planejada como aplicada.
5. Preserve arquivos existentes e modelos enviados pelo professor.
6. Selecione um dos três prompts em prompts/README.md. Use planos de turma efetivamente recebidos conforme base-curricular/PLANOS_DE_TURMA.md; documento anunciado não é documento consultado.

## Biblioteca de arquiteturas
- Ler biblioteca-arquiteturas/PROTOCOLO_IA.md e catalogo.json; conferir compatibilidade com o prompt, núcleo transversal, dependências e ramo disciplinar.
- Preencher registro de composição com decisões observáveis; outra IA deve conseguir executar sem presumir histórico de conversa.
- Respeitar estado das plantas e pendências. AEE atual é Exposição Explicativa; manter filiação de variantes editoriais.
- Aplicar preferências de leitura: fontes reais, tamanho e espaçamento ajustáveis, apresentação reversível e sem classificar ou inferir diagnósticos; oferecer atalhos opcionais identificados “Dislexia” e “TDAH”, conforme pedido do professor. Não inferir dislexia/TDAH ou prometer benefício universal de fontes.
- Atualizar catálogo e validar ligações/dependências ao alterar plantas. Distinguir documentação, implementação e aplicação.

## Ao incorporar um aperfeiçoamento
- Atualize a seção correspondente do prompt vigente.
- Incremente sua versão e registre a mudança no histórico na mesma entrega.
- Mantenha o Prompt Mestre como núcleo comum e os três prompts de entrada em prompts/ como fluxos complementares, sem regras contraditórias.
- Diferencie diretriz registrada de funcionalidade realmente implementada e testada.
- Faça commit descritivo e confira o conteúdo salvo.
- Não prometa atualização automática em sessões sem acesso ao GitHub.

## Requisitos atuais de destaque
- Atualização de 04/11/2026: Fluxo 03 — Território de Experiências é o padrão solicitado para novas aulas; seguir seção 6.4 e prompts/FLUXO_03_TERRITORIO_EXPERIENCIAS.md. Diretriz adotada não equivale a motor homologado: registrar implementação/testes e fallback. Preservar aulas antigas e Fluxos 01/02.
- Dois fluxos anteriores preservados: prompts/FLUXO_01_CADERNO_ILUSTRADO.md (apresentação anterior) e prompts/FLUXO_02_MISSAO_INTERATIVA.md (Fredoka e efeitos do código aprovado). Fluxo 02 é alternativa preservada; preserve o fluxo da aula existente salvo pedido de mudança. Registre a escolha na composição.
- Texto explicativo ampliado, didático, com referências próximas das afirmações e âncoras visuais que ensinam.
- Design de associações: cumprir seção 6.1 do prompt. Definir relação, aproximar imagem e frase, manter sinais redundantes e D/R/E/L, oferecer interação acessível, reduzir pistas gradualmente e conferir aplicação em novo exemplo. Layout flexível; não prometer aprendizagem automática ou perfil único de neurodivergência.
- Integração estético-semântica: cumprir seção 6.2 do prompt. A linguagem do objeto participa da composição e das ações; sketchnote é uma possibilidade. Fundamentar escolhas, manter acesso e D/R/E/L, diferenciar produção didática e documento e conferir transferência além do estilo. Levar o briefing ao HTML, aos slides e aos demais suportes.
- AEE + MACI + ARN + SVS + EPC + SSS, integradas em ASA.
- 32 percursos curriculares; pistas graduadas; glossário e dicionário.
- Circuitos de descobertas: novas aulas geradas devem carregar `circuito` versionado, com perfis 5º–6º acolhedor, 7º transição RPG, 8º–9º RPG contemporâneo ou Ensino Médio investigação madura; estações, cartões, IDs estáveis e última pista com retorno explícito. Validar com `python3 automacoes/aulas/testar_circuitos.py` e `validar_gerados.py`; não confundir contrato com homologação ou publicação.
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
- Registrar espiral MACI, ponte interdisciplinar justificada, circuito personalizado e motivo da variação; 32 percursos não significam 32 perguntas investigativas.
- Novas aulas devem integrar e testar coleta/metodologia.mjs conforme coleta/MONITORAMENTO_METODOLOGICO.md. Legados continuam válidos; registrar migração efetiva. Não inferir tédio ou eficácia de erros/cliques; revisão docente e dados privados.

## Leitura breve e linguagens alternativas
- Aplicar seção 3.1 do Prompt Mestre: uma explicação essencial curta por vez; oferecer reformulação direta, cotidiana/popular ou informal adolescente, exemplo e áudio opcionais, sem empilhar versões ou exigir sua leitura. Preservar significado, termos do componente, precisão e adequação à idade; gírias somente quando naturais e pertinentes.
- Aprofundamento permanece acessível; não cumprir metas de palavras por volume. Manter alternativas curtas, retorno explicativo e aplicação em novo exemplo com apoio menor. Não impor cinco alternativas nem tratar versões equivalentes como distratores.
- Registrar apoio realmente usado sem penalizar consulta ou inferir compreensão. Troca de linguagem preserva respostas/progresso; registro documental não migra aulas nem implementa controles.

## Coleta Supabase e identificação
- Consultar coleta/supabase/STATUS.json e README antes de afirmar coleta ativa. Base privada criada não é receptor, painel ou integração de aulas. Seguir seção 13.3 do prompt; identidade estável/matrícula e escola desde o início, vínculo servidor e identificação confirmada nas aulas migradas, com apoio docente.
- Não confiar em nome livre para autenticar ou em campos de escola/professor enviados pelo cliente para autorizar. Preservar dados privados, fila/recibo, registros parciais separados da conclusão, nota vigente e dispositivos compartilhados. Não expor credencial privilegiada, lista nominal ou relatório individual.


## Portal e área docente anual
- Consultar docentes/README.md e PROTOCOLO_IA.md. Ano letivo pertence às matrículas e atribuições; preservar 2026 ao cadastrar 2027. Lista, calendário, fonte e correspondência de identidades requerem confirmação. Não presumir promoção nem transferência de permissão entre professores.
- Preencher metadados públicos `portal` de cada novo material em publicacao/catalogo.json; atualizar índice por `python publicacao/portal/gerar.py` e testar ferramentas/conferir-portal.cjs. Preservar URLs, distinguir série de turma e uso livre de vínculo anual. GitHub guarda arquitetura/modelos; dados individuais ficam restritos.
- Base docente privada não é painel ou login implementado. Conferir coleta/supabase/docentes/STATUS.json. Planejado, extraído, confirmado e aplicado são estados distintos; replanejamento por IA preserva histórico e exige confirmação docente. Não inferir aula não realizada de ausência de recibo nem diagnóstico de escolha de fonte. Avisos só existem após implementação e agendamento autorizados.


## Recuperação adaptativa até quatro atividades
- Aplicar seção 9.1 do Prompt Mestre 3.1.0. Regras visíveis e confirmadas antes de novos inícios: 1 original; primeiro erro +1 experiência; segundo erro do conjunto +3 extras no total; teto 4/conjunto e 128 para 32 originais. Sem ampliação por pista, áudio, pedido de ajuda, erro técnico ou treino complementar de alfabetização.
- Preservar sessões já iniciadas e cálculo de primeira resposta sobre 32 originais. Extras com novas relações, operações e contextos; não repetir a pergunta apenas para alongar. Registrar e conferir bloqueios, recarga, limites, relatórios integrais e recebimento antes de declarar implantação.


## Labirinto de Evidências e Perspectivas
- Aplicar seção 6.5 do Prompt Mestre 3.2.0 e biblioteca-arquiteturas/plantas/labirinto-evidencias.md ao configurar passagens por evidência. Declarar objetivo, fonte, unidade selecionável, relação, critério, retorno e saída; escolher a modalidade pelo objetivo.
- Distinguir outra linguagem (apoio livre/equivalente), outro ponto de vista (condição/interpretação com fonte e critério) e outra situação (aplicação). Nenhuma visita, espera ou palavra igual comprova compreensão. Evidência inválida não bloqueia apoios.
- Mapa e lista equivalentes; seleção e confirmação separadas; alternativa por imagens, voz e mediação. Exibir onde está, o que verifica, o que falta e como sai. Preservar sessões anteriores e nota original.
- Integrar atividades adicionais ao teto da seção 9.1, sem multiplicar por número de telas ou apoios. Não fixar cinco minutos por tarefa nem inferir atenção pelo tempo. Registrar resposta, evidência, relação, revisão e aplicação no relatório/e-mail/coleta quando realmente instrumentados.
- Estado inicial: arquitetura documentada, componente próprio ainda não implantado; não confundir a recuperação adaptativa já existente com o labirinto completo.


## Registro para Escola RS
- Cumprir seção 15.1 do Prompt Mestre: toda nova aula deve mostrar título, resumo para registro e habilidades (código e descrição com fonte verificada), tanto no painel de acesso/acervo quanto dentro da aula.
- Usar a mesma fonte de metadados, permitir consulta antes da entrada e oferecer cópia integral do registro com alternativa manual. Conferir presença, igualdade e leitura em celular; não exigir conclusão ou nota.
- O professor revisa e transfere o texto para o Escola RS. Não afirmar envio automático, aplicação da aula ou atualização de páginas antigas por uma mudança documental.


## Apoio à leitura com no mínimo 57 percursos
- Aplicar seção 34.4.1: pelo menos 57 atividades significativas no apoio opcional, separadas dos percursos curriculares e da nota. Variar imagens, palavras, sílabas e frases/contexto com áudio e alternativa mediada. Não contar instruções, repetições idênticas ou tentativas extras como novos percursos.
- O empacotamento deve executar `publicacao/alfabetizacao/validar.py` e bloquear banco com menos de 57. Conferir progresso, repetição, avanço, áudio indisponível e retorno. O recurso compartilhado atual oferece 57; não confundir com oito salas completas, eficácia comprovada ou instrumentação no painel.


## Exemplos e relações: terceira entrada opcional
- Seguir seção 35 do Prompt Mestre 3.5.0: 32 curriculares, apoio à leitura com 57 e opção curricular por exemplos com mínimo 64/padrão 96. Não confundir os dois apoios.
- Produzir página acoplada, exemplos concretos, relações explicadas, pouco texto e aplicação em outro contexto. Validar quantidade e duplicação literal; revisão docente verifica diversidade semântica e adequação visual. Banco ampliado é opção para prática distribuída, sem exigir tudo junto ou modificar a nota automaticamente.
- Preservar realizações iniciadas, notas e relatórios; migração de legado deve ser declarada e testada.

- Esclarecimento autoral: “Aprender de outro jeito” inclui leitura breve e várias linguagens explicativas equivalentes. Não é um caminho sem leitura. Troca de linguagem é apoio livre, preserva respostas e não aumenta a contagem.


## Orientação, imagens e relatório de cada alternativa
- Aplicar seção 36 do Prompt Mestre 3.6.0: três passos claros, exemplo resolvido, representação que ensina e fundo temático removível nas páginas de apoio e de leitura breve. Preservar dados, contraste, teclado e alternativa ao áudio.
- As três opções devem ter relatório próprio e exportação integral; integração local não é envio automático nem recebimento no painel. Conferir tentativas, apoios, identidade declarada, estado e alternativa manual de entrega, sem dados reais no Git público.


## Entrega integral — 3.8.0
- Aplicar seção 37 do Prompt Mestre e automacoes/aulas/politica-entrega.json a todas as aulas e rotas opcionais.
- Usar gerar.py somente como ponte para o orquestrador privado; nenhum HTML independente.
- Games, cenário temático adequado à idade, PDFs diagramados dos três caminhos e plano diário privado integram o padrão.
- Exigir evidências reais por requisito e hash de versão; contrato_entrega.py bloqueia novas publicações incompletas.
- Pages e Vercel verificados, QR depois da URL; compilação não encerra pedido. Não pedir que o professor repita o padrão.
- Preserve legados/sessões; as cinco aulas de 09/11 ainda precisam de revisão, não ficam conformes por atualização documental.

- Seção 37.7: materiais e acervo por série/tema, sem turma/data/horário de aplicação. Contexto real apenas no relatório/painel interno; preservar datas do conteúdo histórico. Separar conteúdo e aplicações.

## PDF docente — diretriz expressa 3.8.1
O PDF do professor contém exclusivamente a aula expositiva pronta para ser falada antes de os estudantes entrarem nos percursos. Desenvolver conceitos, relações de causa e efeito e exemplos em texto contínuo e progressivo, adequado à série. AEE orienta internamente a clareza da explicação; não transformar o texto em checklist ou comandos ao professor. Não incluir planejamento por etapas/minutos, orientações do tipo ‘primeiro faça’, objetivos administrativos, metodologia, relatório dos jogos, métricas, gabarito ou avaliação. Relatórios, registros operacionais e gabaritos, quando necessários, são arquivos separados e não integram esse PDF. Identificar apenas série, componente e tema; sem turma ou data de aplicação. Nome padrão: Aula_Expositiva_Professor.pdf (ou Aulas_Expositivas_Professor.pdf em um lote).

## Correção prioritária — apoio não leitor (Prompt Mestre 3.8.2)
Preservar o modelo associativo anterior, seus dados, ordem e relações. Pedido de melhoria visual altera somente desenhos, cores, textura e composição. Não substituir esse caminho por RPG nem exigir leitura, personagem, caminhada, mapa ou NPC para realizar associações. Ler a seção 37.9, que prevalece sobre exigências anteriores de mesmo jogo nas três rotas.

## Variação visual do apoio — 3.8.4
Seguir 37.10: cada tema recebe fundo/composição e textura próprios, com ilustrações claras dos objetos existentes; não repetir uma mesma cena genérica. Preservar banco, sequência e critérios.

## Cenários visuais e sessão 2 de frases — piloto 34.4.2 (09/11/2026)
- Biblioteca em `publicacao/cenarios/` (catálogo, gerenciador de fundos, placa com "Reduzir estímulos", motor de frases, conjunto 1). Cada aula que adota recebe cópia idêntica em `apoio/cenarios/` e só duas linhas no `apoio/index.html`; o bloco `apoio-dados` e o motor inline não mudam (hash conferido contra `apoio/proveniencia.json`).
- Antes de entregar: `python3 publicacao/cenarios/validar_cenarios.py` e `NODE_PATH=<jsdom> node publicacao/cenarios/testar-cenarios.cjs --evidencias automacoes/aulas/evidencias/cenarios`. Sessão 2 nunca entra em `#choices/#step/#next` (o relatório da sessão 1 não pode registrá-la); convite só após o texto de conclusão do motor; contagem do convite é a real do banco (57), não a nominal do pedido (96).
- Imagens de referência do professor: receber, catalogar (direitos, resolução, proporção) e gerar versões desktop/móvel; arte provisória fica marcada `provisoria` no catálogo. Não declarar cenários B–D nem conjuntos 2–8 implantados antes de existirem e serem verificados nos links reais.

## Protocolo de linguagem clara — 3.9.0 (seção 38, transversal)
- Em toda disciplina, rota (curricular, exemplos, apoio, inclusiva, games, recuperação), instrução falada e retorno de erro: VEJA → ENTENDA → VEJA UM EXEMPLO → AGORA É SUA VEZ → CONFERIR. Não trocar atividade associativa/inclusiva por quiz ou game para padronizar; não infantilizar; termos curriculares entram por exemplo e glossário.
- Nunca expor rótulo interno (D/R/E/L, sustentado, alcance, extrapolar, procedimento). Comando começa com ação ou pergunta e cita os dados. Exemplo sempre com outros dados; resultado do próprio item só após a primeira tentativa; primeiro erro em linha conta como tentativa (`escolha_incorreta`); pistas não ampliam nem alteram nota.
- Antes de entregar: `python3 automacoes/aulas/validar_linguagem.py` (bloqueios objetivos impedem; avisos exigem revisão humana). `contrato_entrega.py` e o CI exigem relatório atual com zero bloqueios. Ausência de alerta não é prova de compreensão: validar com estudante ("Olhe esta atividade e me diga: o que você precisa fazer?") e registrar em `automacoes/aulas/linguagem-clara/OBSERVACAO_EM_SALA.md`.
- Produzir pela Biblioteca de Diagramação com a clareza nascendo no gerador (`linguagem-clara/CONTRATO_GERADOR.md`). `assets/clareza.js` é compatibilidade; não declarar a fábrica corrigida antes da integração testada no repositório privado.

## Linguagem para a idade — clareza-2
Quando o professor relatar que a turma não entende as atividades, conferir primeiro o que está escrito na tela, não a quantidade de cliques. Rótulos e títulos do banco (Dado observado, Relação explicada, Sustentado, "registre a operação") não podem chegar ao estudante: usar a camada assets/clareza.js (pergunta com ícone, situação contada em frases simples, exemplo resolvido aberto no primeiro bloco, conta montada, resposta certa destacada após erro). Ler "Revisão de clareza didática — clareza-2" no prompt mestre. O banco, os PDFs e o apoio relacional não mudam; a eficácia em sala é observada pelo professor, não presumida pelo teste.
