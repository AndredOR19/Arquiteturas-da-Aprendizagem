# Arquiteturas da Aprendizagem

Base de referência pedagógica do **Prof. André de Oliveira Rodrigues**: prompt mestre, modelos de aulas digitais, aperfeiçoamentos e documentos curriculares.

## Proposta de mestrado

[Leia o README da proposta](pesquisa/projeto/README.md): metodologia, arquiteturas, estado da pesquisa, bancos vetoriais e roteiro Supabase → adaptação da Sofia → Vercel na etapa final.

## Comece aqui
- [Prompt mestre completo — versão 2.19.0](PROMPT_MESTRE_AULAS_DIGITAIS.md)
- [Biblioteca de Arquiteturas — plantas e protocolo para IA](biblioteca-arquiteturas/README.md)
- [Histórico de aperfeiçoamentos](HISTORICO_APERFEICOAMENTOS.md)
- [Orientações para o trabalho no repositório](AGENTS.md)
- [Base curricular: organização e incorporação](base-curricular/README.md)
- [Catálogo e situação dos documentos](base-curricular/catalogo.json)

## Diretriz vigente
Preservar o modelo visual aprovado de 19/10, com texto explicativo ampliado, referências verificáveis e âncoras visuais que representem o conteúdo. Integrar AEE, MACI, ARN, SVS, EPC e SSS/ASA. Aulas digitais com no mínimo 26 percursos, pistas graduadas, glossário, dicionário e relatório completo.

## Design de associações — atualização 2.5.0
A partir de 27/10/2026, novas produções e revisões devem seguir a seção 6.1 do prompt: relações perceptíveis entre imagem e linguagem, referências estáveis, sinais redundantes, interação acessível, retirada gradual de pistas e aplicação em novo contexto. Preservar D/R/E/L e adaptar a disposição ao conteúdo. Registro documental não altera automaticamente aulas anteriores.

[Esboço do novo livro — Arquitetura das Associações](livros/arquitetura-das-associacoes/ESBOCO.md), título provisório, de André de Oliveira Rodrigues. Inclui proposta, 14 capítulos, instrumentos e roteiro para contribuições do autor.

## Forma e conteúdo — atualização 2.6.0
A seção 6.2 do prompt institui a **Arquitetura de Integração Estético-Semântica (AIES)**: a linguagem do objeto orienta composição, imagens e ações de aprendizagem. Sketchnotes são uma possibilidade; cada tema exige decisões fundamentadas. Preservar a estrutura funcional aprovada, acessibilidade e códigos D/R/E/L. Exemplo de projeto: aula sobre Basquiat com relações entre palavras, figuras e símbolos integradas à explicação e à exploração.

[Novo projeto editorial — Quando o conteúdo desenha a aula](livros/integracao-estetico-semantica/ESBOCO.md), de André de Oliveira Rodrigues: fundamentos, 14 capítulos propostos e abertura preliminar. Documento em desenvolvimento, distinto do livro Arquitetura das Associações. Atualização documental não redesenha aulas existentes.

## Biblioteca de arquiteturas — atualização 2.8.0
[Entrada da biblioteca](biblioteca-arquiteturas/README.md) e [arquitetura de organização](biblioteca-arquiteturas/ARQUITETURA_DA_BIBLIOTECA.md). Doze plantas transversais/de integração, Matemática e Arte em desenvolvimento, mapa de 15 componentes e pendências explícitas. O [protocolo para IA](biblioteca-arquiteturas/PROTOCOLO_IA.md) orienta consulta, composição e continuidade; o catálogo estruturado identifica versões e dependências.

[Preferências de leitura](biblioteca-arquiteturas/plantas/leitura-acessivel.md): fontes, tamanho, espaçamento e apresentação ajustáveis para todos, sem exigir diagnóstico. Fontes especializadas são opções, sem promessa de superioridade universal ou identificação de dislexia/TDAH. [Avaliação da experiência](biblioteca-arquiteturas/plantas/avaliacao-experiencia.md): questionário obrigatório sobre leitura e interação, com todas as respostas e confirmação para liberar conclusão, nota e relatório final/e-mail. Opiniões não alteram o cálculo da nota; relatório integral orienta pesquisa e revisão. Diretrizes registradas; controles e relatórios das aulas existentes não foram alterados.

## Modelos existentes
As capturas MHTML de 19/10 e 15–16/10 permanecem como referências de interface e evolução. Capturas podem não conter todas as interações do aplicativo; o prompt vigente define os requisitos atuais.

## Atualizações
Cada aperfeiçoamento acordado com o professor deve atualizar o prompt e o histórico, com versão e commit descritivo. O repositório deve ser consultado antes de criar ou revisar materiais; não há carregamento automático garantido em todas as conversas.

## Documentos curriculares
Estrutura preparada para BNCC, Referencial Curricular Gaúcho, matrizes SEDUC-RS e EJA/EJATEC. Nesta atualização, o cadastro está pendente de incorporação e verificação dos arquivos; não estão sendo anunciados documentos já carregados.

Não incluir senhas, tokens, dados identificáveis de estudantes ou guias docentes que devam permanecer restritos.

## Laboratório de aprender a aprender
[Código e orientações do laboratório](laboratorios/aprender-a-aprender/README.md). Quatro experiências e 28 passos para treinar organização do estudo, investigação e transferência. [Abrir o laboratório publicado](https://andredor19.github.io/Arquiteturas-da-Aprendizagem/laboratorios/aprender-a-aprender/). Publicação e abertura conferidas em 26/10/2026.


## Produção conectada: aulas, documentos e slides
[Como usar a Biblioteca de Diagramação](ferramentas/README.md). O motor central usa uma revisão fixada, sem duplicação neste repositório. [Demonstração técnica editável em Quarto](projetos/demonstracao-slides/index.qmd), com saídas HTML e PowerPoint.

## Publicação das aulas
Aulas HTML devem ser entregues com link funcional no GitHub Pages. `publicacao/catalogo.json` lista o que será publicado; o fluxo `Publicar aulas no GitHub Pages` prepara, testa e publica. Cadastre cada nova aula antes da entrega e preserve o endereço dos materiais existentes.

### Onde abrir e produzir
- [Portal das aulas no GitHub Pages](https://andredor19.github.io/Arquiteturas-da-Aprendizagem/)
- [Publicar aulas no GitHub Pages — execução e resultados](https://github.com/AndredOR19/Arquiteturas-da-Aprendizagem/actions/workflows/publicar-pages.yml)
- [Produzir com a biblioteca central privada](https://github.com/AndredOR19/Biblioteca-de-Diagramacao/actions/workflows/produzir-aprendizagem.yml)
- [Catálogo do que entra na publicação](publicacao/catalogo.json)
- [Conferências e limitações registradas](ferramentas/VERIFICACAO.md)

| Entrega | Produção | Disponibilização |
|---|---|---|
| Aula digital | Motor central e conteúdo da aula | GitHub Pages, com link conferido |
| Slides | Gamma como opção preferencial; Quarto como alternativa técnica | Link Gamma no portal; HTML no Pages e PowerPoint quando produzidos pelo modelo local |
| Documento escolar | Modelo de documento e conteúdo por turma | Arquivo editável nas exportações |
| Material reservado do professor | Canal próprio com acesso adequado | Fora do pacote público |

Cada atualização na branch main dispara o fluxo do Pages, que aguarda a publicação automática anterior para evitar conflito. Apenas salvar um HTML no GitHub não comprova que o site foi publicado: confira o deploy e o endereço final. A conexão usa uma versão fixa do motor para evitar mudanças inesperadas e reduzir a repetição de código, sem prometer economia percentual de tokens.


## Gamma no processo de apresentações
O Gamma integra o fluxo de slides: o assistente prepara conteúdo e fontes, o Gamma escreve e desenha, e o assistente confere e solicita correções antes de disponibilizar o resultado. [Procedimento e critérios de qualidade](ferramentas/GAMMA.md).

O conector está disponível para uso nas sessões em que houver acesso. Isso não instala uma chave de API no GitHub nem configura geração autônoma pelo Actions. Aulas HTML continuam publicadas no Pages; apresentações nativas Gamma podem ser abertas por links identificados no portal.

[Apresentação ilustrada no Gamma — Meu caminho para aprender](https://gamma.app/docs/Meu-caminho-para-aprender-Laboratorio-de-ideias-7u1ljgpnc3dywz5). A versão ampliada tem 18 cartões e integra o mesmo laboratório de estudo.

## Aulas do Bernardina previstas para 27 de outubro
- História 231 — Ditadura e redemocratização, 26 percursos.
- Ensino Religioso 192 — Conviver com quem pensa diferente, 26 percursos.

Incluídas no catálogo de publicação. “Aula” significa a entrega digital completa conforme o prompt mestre. Confira o registro de validação em aulas/VERIFICACAO_27-10-2026.md.

## Coleta de relatórios — implementação em preparação
[Receptor e orientações](coleta/README.md), [estado](coleta/STATUS.json) e [conferências](coleta/VERIFICACAO.md). Planilha privada criada na conta autorizada; contrato, cliente e receptor preparados com 23 ensaios locais. Implantação Apps Script, autorização, envio real pelo navegador e migração de aulas ainda pendentes. Relatórios de estudantes não entram no GitHub público. O fluxo atual de e-mail permanece até integração conferida.


## Diário de pesquisa e continuidade
O [diário e banco de insights](pesquisa/README.md) registram as correlações autorais, as metodologias em desenvolvimento e a fila dos livros. Começar por [MEMORIA.md](pesquisa/MEMORIA.md). O [acompanhamento longitudinal](pesquisa/longitudinal/README.md) separa aluno, matrícula histórica, coorte e observação; nomes e dados reais ficam fora do repositório público. Prompt vigente 2.11.0. O registro não ativa coleta online nem memória automática.

## Laboratório de simulações
[Usar o laboratório](pesquisa/simulacoes/LABORATORIO.md): execução no Actions, cenários individuais/por turmas, relatórios e arquivo de resultados. [Workflow](.github/workflows/laboratorio-simulacoes.yml). O inventário acompanha as arquiteturas cadastradas e sinaliza formalizações pendentes. Somente cenários sintéticos; sem chamadas a IA no cálculo ou comprovação de eficácia.


## n8n e aperfeiçoamento a partir da sala — 2.15.0
[Integração n8n](automacoes/n8n/README.md): primeiro workflow preparado para importação, com 13 testes locais e 23 ensaios existentes preservados; ainda não implantado. [Ciclo de aperfeiçoamento](automacoes/n8n/CICLO_DE_APERFEICOAMENTO.md): dados dos artefatos, insights docentes, adaptações situadas e revisão versionada. Progresso ao vivo e coleta permanente ainda não ativados.

## Colaboração e referência
Propositor das Arquiteturas da Aprendizagem: **André de Oliveira Rodrigues**. [Metadados para referência](CITATION.cff) · [Como contribuir](CONTRIBUTING.md) · [Objetos de estudo](pesquisa/projeto/OBJETOS_DE_ESTUDO.md).

A [proposta de governança da rede](pesquisa/projeto/GOVERNANCA_COLABORACAO.md) e o [plano de indicadores](pesquisa/projeto/PLANO_INDICADORES.md) preparam colaboração, devolutivas de estudos e acompanhamento. Licenciamento e abertura do núcleo ainda em discussão; esses documentos não aplicam uma licença ou exigem entrega de dados por todo fork. Dados individuais permanecem privados.


## Lettering Digital escolar/pedagógico — 2.16.0
Preferência visual registrada e aplicada inicialmente às aulas de História 192 de 21/10 e 29/10: caderno ilustrado, livro central, títulos manuscritos com fonte local licenciada, faixas e conexões. Botão Leitura simples reversível e prioridade dos apoios de leitura. [Recursos](publicacao/lettering/README.md) e [conferência](aulas/VERIFICACAO_LETTERING_192.md).

## Estação coordenada de livros e aulas — 2.18.0

[Produção com n8n e GitHub](automacoes/n8n/producao/README.md): fluxo preparado para pedir materiais cadastrados ao motor privado, acompanhar a execução e entregar provas com revisão técnica e manifestos. [Executar pelo GitHub](https://github.com/AndredOR19/Biblioteca-de-Diagramacao/actions/workflows/estacao-automatica.yml). Inicialmente, capítulo demonstrativo e aula existente. n8n real, revisão por IA e publicação após aprovação permanecem etapas distintas. [Estado verificável](automacoes/n8n/producao/STATUS.json).



## Aprender com imagens e voz — 2.19.0

[Arquitetura permanente de acesso](biblioteca-arquiteturas/plantas/imagens-voz-palavra.md): cenas, orientação falada, objeto/cor/forma, significado, palavra e letra inicial para quem ainda não lê/escreve. [Apoio HTML](publicacao/imagens/README.md) com conteúdo inicial para os oito materiais cadastrados e registro separado da nota. [Capítulo em desenvolvimento](livros/integracao-estetico-semantica/CAPITULO_ACESSO_IMAGENS_VOZ.md). Conferir testes/publicação; sem promessa de alfabetização automática ou conversão integral de todos os percursos.
