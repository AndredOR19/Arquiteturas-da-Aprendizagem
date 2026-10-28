# Diário e base de pesquisa das Arquiteturas

Versão 1.0.0 — 28/10/2026. Autoria das formulações: Prof. André de Oliveira Rodrigues.

Este diretório registra a produção intelectual, as correlações propostas pelo autor, as decisões metodológicas e o trabalho a desenvolver. É uma memória documental consultável entre sessões, não uma memória automática do assistente nem comprovação científica das hipóteses.

## Entrada para continuar o trabalho
1. Ler [MEMORIA.md](MEMORIA.md), [registros.json](registros.json) e [producoes.json](producoes.json).
2. Consultar o [diário de 28/10/2026](diario/2026-10-28.md) e as plantas indicadas em cada registro.
3. Ler o prompt mestre vigente e conferir sua versão com o catálogo.
4. Identificar o que está documentado, implementado, aplicado e observado antes de propor o próximo passo.

## Organização
- `registros.json`: banco versionado de insights e decisões, com IDs, origem, autoria, situação da evidência, relações e próximas ações.
- `diario/`: narrativa datada das conversas relevantes e da evolução da proposta, preservando a ordem dos insights. Não é transcrição integral.
- `producoes.json`: fila de livros, instrumentos e implementação, com estado e critério de conclusão.
- `modelos/`: fichas para novos registros, aplicação e relatório de acompanhamento.
- `longitudinal/`: esquema SQLite, cadastro nominal separado e ferramenta local para acompanhar o mesmo aluno em matrículas diferentes.

## Como registrar novos insights
Durante uma sessão autorizada: consultar o estado → registrar a formulação do professor → separar interpretação do assistente → relacionar às arquiteturas → definir a hipótese e como examiná-la → atualizar pendências, prompt e catálogo quando pertinente → validar → salvar commit → conferir o que foi salvo.

Usar IDs estáveis e referências a registros anteriores. Uma revisão acrescenta estado e justificativa; não apagar a origem para parecer que a ideia já nasceu validada. Não arquivar conversas inteiras indiscriminadamente: registrar o conteúdo pertinente à produção e excluir detalhes privados sem função no projeto. Conversas anteriores só podem ser incorporadas após consulta à fonte; um resumo recuperado não equivale à leitura integral.

## Visibilidade
Este repositório é público. O diário pessoal aqui contém apenas as experiências e correlações intelectuais que o autor pediu para registrar nesta conversa. Nomes de alunos, listas nominais, respostas individuais, matrículas reais e informações pessoais reservadas pertencem à base privada, fora do Git e do GitHub Pages. Códigos vinculáveis também exigem acesso restrito. `.gitignore` ajuda a evitar inclusão acidental, mas não protege arquivos já publicados.

## Estado atual
Registros e propostas metodológicas documentados. Ferramenta longitudinal local implementada; os ensaios usam dados fictícios. Nenhum nome ou resultado real de aluno foi fornecido nesta conversa. O professor relata início do projeto em turmas de 2026, sem identificar quais; continuidade em 2027 é uma intenção. Não inventar turmas, listas, aplicação ou resultados. A coleta online existente continua no estado registrado em `coleta/STATUS.json`; este diretório não a ativa nem migra aulas antigas.
