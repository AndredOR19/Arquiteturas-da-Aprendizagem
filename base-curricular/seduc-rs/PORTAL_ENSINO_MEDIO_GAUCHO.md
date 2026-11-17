# Portal Ensino Médio Gaúcho — fontes oficiais

**Órgão:** Secretaria de Estado da Educação do Rio Grande do Sul (SEDUC-RS)  
**Portal:** https://ensinomediogaucho.educacao.rs.gov.br/  
**Registro de consulta:** 2026-11-17  
**Situação:** dois PDFs originais incorporados e catalogados com SHA-256 e extração de consulta. Vigência para 2026 não confirmada. Três endereços informados retornaram HTTP 404 no download direto em 17/11/2026.

## Endereços originalmente informados (não equivalem a arquivos recebidos)

| Documento | Link oficial | Observação de versão / uso |
| --- | --- | --- |
| Referencial Curricular Gaúcho — Ensino Médio (RCGEM) | https://ensinomediogaucho.educacao.rs.gov.br/doctos/RCGEM_Jul_22.pdf | Arquivo identificado como edição de julho de 2022; conferir atualização, etapa, componente e habilidade antes de utilizar |
| Unidades Curriculares Eletivas | https://ensinomediogaucho.educacao.rs.gov.br/doctos/eletivas_2024.pdf | Material identificado como Eletivas 2024; não presumir vigência inalterada em 2026 |
| Caderno de Redação — Aprofundamento ENEM | https://ensinomediogaucho.educacao.rs.gov.br/doctos/caderno_redacao.pdf | Material de aprofundamento; conferir matriz e orientação da escola |
| Caderno de Resolução de Problemas — Aprofundamento ENEM | https://ensinomediogaucho.educacao.rs.gov.br/doctos/caderno_resolucao.pdf | Material de aprofundamento; conferir matriz e orientação da escola |

## Protocolo de uso na produção de aulas

1. Identificar escola, série, turma, componente e período letivo.
2. Consultar planejamento da turma e matriz vigente antes de selecionar habilidades.
3. Usar os documentos oficiais como fontes, citando título, versão, seção e URL; não atribuir códigos ou competências não conferidos.
4. Diferenciar fonte oficial, interpretação pedagógica e material digital produzido.
5. Aplicar percurso regular e percursos de acessibilidade conforme o Prompt Mestre e o protocolo da Biblioteca de Diagramação.
6. Registrar a data e o recorte da consulta na ficha de produção, não necessariamente na interface do aluno.
7. Antes de classificar qualquer documento como `disponivel` em `base-curricular/catalogo.json`, preservar e verificar o PDF original, sua versão e SHA-256, conforme `base-curricular/README.md`.

## Arquivos incorporados

| Documento | Original preservado | Consulta textual | Identificação |
| --- | --- | --- | --- |
| RCG — Ensino Médio | [PDF](RCGEM_Jul_22.pdf) | [Texto](../extracoes/RCGEM_Jul_22.txt) | Arquivo de julho/2022; 287 páginas PDF |
| Unidades Curriculares Eletivas Complementares | [PDF](cadernos_eletivas.pdf) | [Texto](../extracoes/cadernos_eletivas.txt) | Edição 2023, atualização 04/04/2023 |

O caderno de eletivas de 2023 é um documento adicional, não uma substituição comprovada do material de 2024. Os endereços `eletivas_2024.pdf`, `caderno_redacao.pdf` e `caderno_resolucao.pdf` retornaram 404. O endereço adicional `aprofundamento_enem.pdf`, encontrado na busca institucional, também retornou 404 e não foi incorporado.

## Consulta pela produção de aulas

1. Ler `base-curricular/catalogo.json` e selecionar somente registros `disponivel` para consulta local.
2. Pesquisar no campo `texto_consulta` por tema, componente ou código.
3. Conferir a passagem no PDF do campo `caminho`, especialmente tabelas e códigos; páginas PDF e páginas impressas podem divergir.
4. Registrar documento, versão, seção/página, URL e SHA-256 na composição da aula.
5. Conferir planejamento da turma e matriz vigente. Os PDFs não definem, por si, a matriz de 2026.

## Limitações

A integração é documental: catálogo, originais e texto pesquisável. Não altera o motor privado da Biblioteca de Diagramação nem demonstra consulta automática pelo gerador. A extração preserva separadores de página, mas não substitui o layout original; nenhuma equivalência de habilidades foi inferida. Versões de 2023 e 2022 permanecem identificadas como tais.
