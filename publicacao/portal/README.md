# Portal público da escola

Página inicial gerada de `publicacao/catalogo.json`: menu, busca, ordenação, filtros por ano letivo, série, turma, matéria e escola; coleções de aulas, treinamento cognitivo e apresentações. As 18 URLs existentes são preservadas. Há dois laboratórios de treinamento no acervo inicial; ampliar exige produzir, testar e cadastrar materiais, não apenas aumentar um contador.

`portal` em cada item declara `ano_letivo`, `categoria`, `componentes`, `series`, `turmas`, `escola`, `escola_curta`, `palavras_chave`, `titulo_exibicao` e `descricao`. Materiais multisséries reutilizáveis usam `ano_letivo: null`; não atribuir turma numérica a material que só informa série. Ano letivo e série são filtros distintos. Acrescentar 2027 não renomeia/apaga 2026. Data de catálogo não comprova aplicação.

`gerar.py` usa somente uma lista explícita de metadados públicos; não consulta Supabase nem exporta campos arbitrários do catálogo. A busca é local, tolera acentos e usa filtros na URL para compartilhar a seleção; não registra pesquisa, nome, nota ou navegação do visitante. Estatísticas da página são contagens de materiais, não alunos ou eficácia.

`python publicacao/portal/gerar.py` atualiza `index.html` da raiz e `acervo.json` de fonte. `publicacao/preparar.py` gera a mesma página final em `_site`, com recursos em `_recursos/portal`. Conferir com `node ferramentas/conferir-portal.cjs`. O teste abrange todos os materiais, links, filtros, vazio, busca, URL, menu e celular. A publicação oficial usa o workflow Pages existente.

O botão docente abre a área restrita em docentes/area, com e-mail autorizado e autorização anual. O portal também aponta o protocolo público para professores/IA. Notas, listas e observações individuais nunca entram no índice público; o painel consulta o receptor autenticado.
