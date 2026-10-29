# Banco pedagógico das Arquiteturas da Aprendizagem

Acervo documental versionado de planejamentos, ementas, fontes curriculares, guias e modelos para produzir aulas nos dois fluxos aprovados. Este é um banco de documentos com catálogo pesquisável; não é um serviço de banco de dados, repositório vetorial ou sistema de prontuários em funcionamento.

## 1. Âncora — o que orienta uma aula

O plano da turma informa objetivos, conteúdos e sequência prevista. Os documentos curriculares oficiais sustentam habilidades e enquadramento. As arquiteturas orientam a mediação e os dois prompts definem a apresentação. Os registros de aplicação mostram o que foi efetivamente realizado. Uma fonte não substitui a outra.

## 2. Mecânica — consultar e produzir

1. Leia [AGENTS](../AGENTS.md), [Prompt Mestre](../PROMPT_MESTRE_AULAS_DIGITAIS.md) e [protocolo de cadastro](COMO_CADASTRAR.md).
2. Consulte [catalogo.json](catalogo.json) por escola, turma, componente, período e responsável. Confira alertas, original e texto de consulta. Nome de arquivo não prova etapa nem currículo validado.
3. Confira as [fontes curriculares](../base-curricular/catalogo.json). Habilidade transcrita do plano não é automaticamente redação oficial verificada.
4. Confirme a sequência aplicada com o professor ou registro, selecione o recorte e registre IDs/fontes/adaptações na composição da aula.
5. Escolha [Fluxo 01 ou 02](../prompts/README.md), produza e confira a aula. Cadastre o material discente em publicacao/catalogo.json e verifique o Pages.
6. Novos documentos entram por uma sessão autorizada ou contribuição revista no GitHub. Esta pasta não observa conversas, não recebe arquivos automaticamente e não confere permissão a colaboradores.

## 3. Circuito — onde encontrar

| Categoria | Local e função |
|---|---|
| Planejamentos | `planejamentos/escola/ano/periodo/componente/turma/`: original intacto, texto de consulta e metadados |
| Ementas | `ementas/componente/ano-de-recebimento/`: base e abrangência, sem atribuir turma não declarada |
| Currículos | [curriculos](curriculos/README.md) aponta para base-curricular, fonte única de documentos oficiais |
| Guias | [guias](guias/README.md): roteiros compartilháveis; versões reservadas ficam fora do público |
| PEI | [pei](pei/README.md): política de consulta restrita; somente modelos vazios podem estar aqui |
| Professores | [professores](professores/README.md): ingresso e separação entre autoria, custódia e fonte |
| Aulas | [publicacao/catalogo.json](../publicacao/catalogo.json): índice das aulas existentes, sem cópias paralelas |
| Modelos | [modelos](modelos/): cadastro e PEI sem dados individuais |

### Lote recebido em 29/10/2026

| Documento distinto | Original | Consulta |
|---|---|---|
| História 192 — 9º ano — 3º trimestre | [DOCX](planejamentos/bernardina/2026/3-trimestre/historia/turma-192/original.docx) | [Texto](planejamentos/bernardina/2026/3-trimestre/historia/turma-192/conteudo.md) |
| História 211 — 1ª série — 3º trimestre | [DOCX](planejamentos/bernardina/2026/3-trimestre/historia/turma-211/original.docx) | [Texto](planejamentos/bernardina/2026/3-trimestre/historia/turma-211/conteudo.md) |
| História 221 — 2ª série — 3º trimestre | [DOCX](planejamentos/bernardina/2026/3-trimestre/historia/turma-221/original.docx) | [Texto](planejamentos/bernardina/2026/3-trimestre/historia/turma-221/conteudo.md) |
| Eletiva 192 — Cores, sensações, sabores e transformações | [PDF](planejamentos/bernardina/2026/3-trimestre/eletiva/turma-192/original.pdf) | [Texto](planejamentos/bernardina/2026/3-trimestre/eletiva/turma-192/conteudo.md) |
| Cultura Digital — turma a confirmar | [DOCX](ementas/cultura-digital/2026/original.docx) | [Texto](ementas/cultura-digital/2026/conteudo.md) |

A segunda cópia da ementa é idêntica em bytes e está registrada como duplicata, sem ocupar outro lugar no acervo. Os cinco originais foram preservados com SHA-256. Os textos extraídos facilitam busca; não substituem a diagramação dos originais.

**Pendências de uso:** a ementa menciona Anos Iniciais e não identifica escola/turma; o PDF da Eletiva identifica 9º ano, cita código de EM e contém rótulos internos de 1º trimestre apesar do nome de 3º trimestre. Preservar esses dados e conferir adequação antes da aula. Os planos de História têm redações de habilidades a confrontar com a fonte oficial; não foram certificados como transcrições normativas.

## 4. Dialética — arquivo público não é arquivo individual

**Ponto cego:** supor que uma pasta chamada “privado” ou um nome abreviado protege PEIs, laudos, notas ou relatos individuais.

**Ação:** manter documentos preenchidos em repositório realmente privado ou serviço institucional com acesso limitado e autorizado. Nunca colocá-los nesta árvore ou em seu histórico público. Código pseudônimo também não autoriza publicação de dados vinculáveis. O catálogo público reúne somente documentos gerais aprovados e modelos vazios. Não há armazenamento restrito configurado por esta entrega.

A pasta não é incluída no pacote GitHub Pages: o empacotador publica somente aulas cadastradas. Mesmo fora do Pages, arquivos deste repositório continuam públicos no GitHub.
