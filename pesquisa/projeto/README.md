# Proposta de mestrado — Arquiteturas da Aprendizagem

**Autor:** Prof. André de Oliveira Rodrigues · **Local:** Vacaria/RS · **Versão:** 0.1.0 · **Data:** 28/10/2026

> Laboratório de pesquisa e produção educacional apoiado por arquiteturas pedagógicas versionadas, simulação de cenários e avaliação futura em escolas, com adaptação progressiva da infraestrutura de software da Sofia Cog OS.

Este README apresenta a metodologia, o que foi construído e a sequência de implantação proposta para discussão com programas de mestrado. O programa maior admite várias frentes; a dissertação deverá delimitar uma pergunta, uma intervenção curricular e instrumentos viáveis com a orientação.

## 1. Problema e contribuição pretendida

Investigar como a organização de explicações, relações entre conceitos, representações, retomadas e oportunidades de aplicação pode apoiar compreensão, retenção e transferência na educação básica. O projeto procura tornar essa organização explícita, reutilizável, revisável e acompanhável por registros.

A contribuição pretendida reúne uma metodologia autoral documentada, materiais digitais, instrumentos e procedimentos de acompanhamento, além de software para organizar fontes e produzir análises rastreáveis. A existência desses componentes não demonstra, por si, ganho de aprendizagem.

## 2. Metodologia e arquiteturas

A metodologia parte do conteúdo e de suas relações, organiza uma experiência didática, acompanha respostas e dificuldades e retorna aos registros para revisar a composição. A autoria pedagógica, as hipóteses e as decisões pertencem ao pesquisador; a IA auxilia na organização, programação e redação, com fontes e revisão humana.

| Componente | Papel no conjunto | Referência |
|---|---|---|
| AEE — Exposição Explicativa | Explicitar conceitos, processos e relações causais | [Planta](../../biblioteca-arquiteturas/plantas/aee.md) |
| MACI | Organizar retomadas e progressão da complexidade | [Biblioteca](../../biblioteca-arquiteturas/README.md) |
| ARN | Trabalhar tensão, investigação e ressignificação | [Biblioteca](../../biblioteca-arquiteturas/README.md) |
| SVS, EPC e SSS, integradas em ASA | Articular representações, experiência e composição dos percursos | [Catálogo](../../biblioteca-arquiteturas/catalogo.json) |
| Associações e AIES | Relacionar linguagem, imagem, organização visual e significado | [Biblioteca](../../biblioteca-arquiteturas/README.md) |
| Leitura acessível e avaliação da experiência | Ajustes de apresentação e devolutivas para revisão | [Biblioteca](../../biblioteca-arquiteturas/README.md) |
| Progressão coordenada e cadência textual | Linhas propostas sobre alternância, corpo, espaço e ritmo textual | [Memória](../MEMORIA.md) |

As arquiteturas têm versões e estados próprios; consulta ao catálogo evita tratar propostas em desenvolvimento como eficácia demonstrada.

**DAIA:** denominação mencionada pelo autor nesta etapa. A expansão da sigla, a definição operacional e a fonte canônica ainda precisam ser identificadas. Não foi equiparada a AEE, AIES, Sofia ou a uma arquitetura genérica de IA. Esta pendência não suspende o registro das demais partes.

## 3. Estrutura do programa

1. **Escola-Polo:** frente proposta de governança, reciprocidade e campo institucional; a vinculação depende de pactuação e do documento de referência correspondente.
2. **Arquiteturas da Aprendizagem:** modelos pedagógicos, materiais e critérios versionados.
3. **Laboratório computacional:** cenários sintéticos de planejamento, parâmetros explícitos e arquivo de execuções.
4. **Sofia Cog OS:** origem de componentes de interface, organização, recuperação, persistência, processamento e governança a adaptar.
5. **Estudo de mestrado:** intervenção delimitada e avaliação de compreensão, retenção e transferência.

O recorte AEE foi proposto pelo assistente para discussão; a arquitetura principal, série e conteúdo ainda dependem da decisão do autor e da orientação.

## 4. O que existe e o que está pendente

| Frente | Estado documentado |
|---|---|
| Biblioteca, prompt e materiais HTML | Arquivos e diretrizes existentes; aplicação e resultados exigem registros próprios |
| Diário e banco documental | Insights, decisões, vínculos e fila de produções versionados |
| Acompanhamento longitudinal | Esquema e ferramentas preparados; não há base empírica de pesquisa confirmada |
| Simulações | Modelos de planejamento por indivíduos/turmas executados no GitHub Actions com dados sintéticos e sem chamadas a IA |
| Coleta online | Implantação e integração em campo ainda pendentes; conferir [estado](../../coleta/STATUS.json) |
| Sofia Cog OS | Especificação e amostra de código consultadas; adaptação educacional e auditoria de produção pendentes |
| Supabase educacional | Preparação autorizada como próxima frente; acesso, projeto de destino e banco ainda não conferidos nesta etapa |
| Bancos de vetores de revelação | Inclusão solicitada; fontes conceituais localizadas, estrutura concreta do banco ainda a inventariar |
| Vercel | Última etapa prevista; nenhuma implantação ou conexão realizada nesta entrega |

## 5. Supabase e os diferentes tipos de vetor

O autor define a prioridade: preparar primeiro os bancos e os bancos vetoriais no Supabase para sustentar a implantação da Sofia. O código e as migrações educacionais poderão ser versionados no GitHub; o banco ativo permanece no serviço de dados. Nenhum acesso ao Supabase é considerado concedido apenas pelo anúncio de que será disponibilizado.

Três estruturas devem ser distinguidas no inventário e no modelo de dados:

- **Embeddings de documentos:** representações numéricas geradas por um modelo para recuperação semântica. Registrar modelo, dimensão, versão, fragmento e fonte. Similaridade não comprova verdade nem relação causal.
- **Vetores autorais com eixos explícitos:** representações definidas por regras e taxonomias do autor. Foi localizado um protocolo de seis eixos; sua reutilização educacional exige fonte, domínio, critérios e avaliação próprios. Não são automaticamente embeddings.
- **Vetores de revelação:** conceito do acervo autoral, utilizado anteriormente no contexto da Kabalá e dos livros segundo o relato do professor. Foi localizada a formulação sobre sintaxe, forma e processo/causalidade. Isso identifica uma fonte conceitual, mas não comprova que já exista um banco completo com esse nome ou um esquema pronto para migração.

Essas categorias não são equivalentes. A relação entre elas deve ser formalizada antes de programar cálculos ou transferir registros. A adaptação educacional pode investigar como registrar relações e processos, preservando a origem de cada formulação e sua natureza de hipótese. O corpus anterior não será importado integralmente para atividades escolares por padrão.

### Contrato de dados proposto para revisão

| Grupo | Registros a especificar | Critério de preparação |
|---|---|---|
| Documentos e fontes | Documento, versão, licença, origem e fragmentos | Proveniência e atualização verificáveis |
| Recuperação vetorial | Embedding e referência ao fragmento/modelo | Dimensão consistente e teste de recuperação |
| Vetores autorais | Definição, eixos, valores, domínio, atribuição e revisão | Regras explícitas e divergências preservadas |
| Relações e processos | Nós, relações, sequência, justificativa e fontes | Separar observação, hipótese e interpretação |
| Pesquisa escolar | Instituição, matrícula histórica, sessão, medida e instrumento | Minimização e isolamento; identidade nominal separada |
| Governança | Papéis, permissões e registros operacionais | Testes de acesso e rastreabilidade |

Os nomes físicos de tabelas, extensões, índices e funções só serão fixados após conferir o projeto de destino e as migrações existentes. Esta tabela é um contrato proposto, não um banco criado.

## 6. Ordem de implantação decidida pelo autor

1. **Documentação:** consolidar este README, fontes, inventário e pendências de DAIA/vetores.
2. **Acesso e levantamento do Supabase:** identificar projeto, ambiente, schema, extensões, políticas e dados já existentes; preservar a operação atual.
3. **Preparação dos bancos:** definir migrações revisáveis, proveniência, isolamento, dados fictícios e testes de integridade, acesso e exportação.
4. **Bancos vetoriais:** preparar recuperação documental e estruturas autorais distintas; testar a busca e o vínculo com as fontes.
5. **Adaptação da Sofia:** integrar somente os módulos necessários, com corpus pedagógico aprovado, revisão docente, limites de custo e ensaio completo com dados fictícios.
6. **Campo de pesquisa:** executar o protocolo somente após orientação e autorizações pertinentes.
7. **Vercel:** avaliar conexão e implantação da interface na última etapa, após a base e a integração conferidas. O calendário do campo e da interface será pactuado conforme a aplicação exigir.

Uma IA com embeddings e geração pode consumir tokens, hospedagem e chamadas externas. O cálculo do simulador atual não chama modelos; isso não significa custo zero para toda a plataforma.

## 7. Método proposto para o mestrado

Delimitar conteúdo, etapa escolar, hipótese e desfecho principal; revisar literatura e rubrica; preparar material versionado e comparação adequada quando viável; testar os procedimentos com dados fictícios. Planejar avaliação inicial, imediata, retenção e transferência, registrando apoios, faltas e fidelidade de aplicação.

O ensaio fictício verifica o procedimento e a infraestrutura. A aprendizagem será investigada posteriormente com participantes autorizados. Se a alocação for por turma, a análise deverá considerar essa estrutura. O tamanho do estudo será definido por viabilidade e premissas explícitas, apoiado por simulações. Resultados nulos, negativos e alterações também serão registrados.

## 8. Governança, autoria e continuidade

Dados nominais e individuais permanecem privados. O repositório público guarda métodos, documentação, código publicável e exemplos sintéticos. Permissões por instituição e por papel devem ser testadas antes da integração. Credenciais administrativas não pertencem a README, HTML, chat ou histórico do Git.

Cada atualização deve conservar origem, autor, versão, domínio, estado e próximo marco. A consulta ao acervo apoia continuidade, mas não instala memória automática de conversas. A migração técnica preservará autoria e licenças, com seleção de componentes e sem publicação indiscriminada de código reservado.

## 9. Próxima entrega mínima

Um inventário do Supabase de destino e uma proposta revisável de schema/migrações, acompanhados de dados fictícios e critérios de teste. Antes disso, recuperar a definição canônica de DAIA e identificar quais tabelas e regras existentes correspondem aos bancos de vetores mencionados pelo autor.

## 10. Documentação de apoio

- [Projeto, cronograma e prospecção acadêmica](PROJETO.md)
- [Definição técnica da Sofia Cog OS](SOFIA_COGOS.md)
- [Viabilidade e marcos](VIABILIDADE.md)
- [Memória de continuidade](../MEMORIA.md)
- [Laboratório de simulações](../simulacoes/LABORATORIO.md)
- [Acompanhamento longitudinal](../longitudinal/README.md)
- [Biblioteca de arquiteturas](../../biblioteca-arquiteturas/README.md)
- [Prompt mestre](../../PROMPT_MESTRE_AULAS_DIGITAIS.md)

**Proveniência:** decisão direta do autor em 28/10/2026; documentos do projeto e consulta ao acervo técnico/conceitual autorizado. As fontes reservadas permanecem no acervo de origem. Apoio do assistente na organização e redação; nenhuma nova conexão, migração Supabase, importação vetorial ou implantação Vercel foi executada nesta entrega.
