# Arquiteturas da Aprendizagem

Base de referência pedagógica do **Prof. André de Oliveira Rodrigues**: prompt mestre, modelos de aulas digitais, aperfeiçoamentos e documentos curriculares.

## Comece aqui
- [Prompt mestre completo — versão 2.4.0](PROMPT_MESTRE_AULAS_DIGITAIS.md)
- [Histórico de aperfeiçoamentos](HISTORICO_APERFEICOAMENTOS.md)
- [Orientações para o trabalho no repositório](AGENTS.md)
- [Base curricular: organização e incorporação](base-curricular/README.md)
- [Catálogo e situação dos documentos](base-curricular/catalogo.json)

## Diretriz vigente
Preservar o modelo visual aprovado de 19/10, com texto explicativo ampliado, referências verificáveis e âncoras visuais que representem o conteúdo. Integrar AEE, MACI, ARN, SVS, EPC e SSS/ASA. Aulas digitais com no mínimo 26 percursos, pistas graduadas, glossário, dicionário e relatório completo.

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
