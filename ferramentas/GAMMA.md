# Apresentações com Gamma

O Gamma passa a ser a opção preferencial para apresentações didáticas visuais, quando seu conector estiver disponível na sessão. O modelo Quarto continua como alternativa técnica editável e para produção local, sem substituir a exigência de qualidade pedagógica.

## Divisão de trabalho

1. O assistente consulta o prompt pedagógico, o conteúdo da aula e suas fontes.
2. Prepara um briefing com objetivo, público, explicações, exemplos resolvidos, perguntas de participação, referências e função de cada recurso visual.
3. O Gamma escreve e desenha a apresentação a partir desse briefing. A apresentação precisa desenvolver relações, não apenas enumerar títulos.
4. O assistente confere o resultado e solicita correções quando necessárias. Quantidade de telas ou beleza visual não comprovam compreensão.
5. O endereço final é registrado no catálogo e no portal. Aulas HTML continuam no GitHub Pages; o link do Gamma abre a apresentação no serviço correspondente.

## Requisitos de qualidade

- Linguagem da turma, contexto inicial claro, explicações desenvolvidas e exemplos concretos.
- Imagens que mostrem o objeto ou a relação em estudo, com consistência visual.
- Conceito, mecanismo, organização visual e aplicação com risco/ação de correção.
- Perguntas de recuperação e transferência, além de pausas para participação.
- Uma ideia central por tela, distribuindo a profundidade sem transformar a apresentação em um texto corrido.
- Dado/azul, relação/âmbar, efeito/verde e limite/roxo acompanhados de rótulos, quando pertinentes.
- Fontes verificadas, sem bibliografia inventada. Situações fictícias e imagens de reconstrução devem ser identificadas.
- Nenhum guia reservado, gabarito consolidado, dado identificável de estudante ou credencial na apresentação pública.
- Tempo flexível e alternativas de expressão. Hesitar ou gaguejar não comprova falta de compreensão. Conferir relações e evidências, sem diagnósticos a partir da fluência.
- Na revisão, verificar se o Gamma omitiu conteúdo do briefing ou acrescentou garantias de aprendizagem e fatos sem fonte. Solicitar edição antes de apresentar a geração como material conferido.

## Conexão disponível e automação

O conector Gamma disponível ao assistente permite gerar, editar e consultar apresentações. Isso não significa que uma chave de API do Gamma foi instalada no GitHub Actions. O workflow atual não cria apresentações Gamma sozinho.

Uma automação futura sem intervenção dependeria de uma integração própria e credenciais guardadas em Secrets, nunca no código, prompt ou README. Não solicitar nem copiar chaves para o chat. Neste fluxo, use o conector autorizado da sessão e registre apenas os IDs e links dos materiais.

## Publicação

Cadastre uma apresentação final com `tipo: link`, `titulo` e `url` em `publicacao/catalogo.json`. O endereço deve ser HTTPS no domínio gamma.app. O portal aponta para ela; não declara que o conteúdo nativo do Gamma foi convertido em HTML ou hospedado no Pages. Exporte PPTX/PDF somente quando solicitado e confira o formato exportado separadamente.
