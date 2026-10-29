# Produção coordenada de livros e aulas — n8n 0.1.0

Propositor e responsável editorial/pedagógico: Prof. André de Oliveira Rodrigues, Vacaria/RS. Registro: 29/10/2026.

## Circuito implementado

Pedido de material cadastrado → GitHub Actions privado → motor da Biblioteca de Diagramação + fonte pedagógica versionada → validação e compilação → conferência técnica e imagens → pacote privado → revisão do autor.

O workflow `produzir-materiais.json` é importável, inativo e sem credenciais. Usa disparo manual no n8n. Não foi importado nem executado em uma instância real; a instância ainda não foi informada. O executor GitHub existe na biblioteca privada: `.github/workflows/estacao-automatica.yml`.

## O que já pode ser produzido

| ID | Fonte | Saídas |
|---|---|---|
| `capitulo-demonstracao` | Capítulo de demonstração existente na biblioteca | PDF/Typst, HTML, EPUB, DOCX, imagens das páginas e relatório técnico |
| `aula-historia-192` | Aula existente de 29/10, revisão Git fixada | HTML e recursos de leitura, imagens em duas larguras e relatório técnico |

O capítulo é uma prova de infraestrutura, não um novo texto autoral nem uma revisão de um dos romances. A aula não é nova e não teve conteúdo reescrito por este fluxo. O material original é preservado. Para incluir um manuscrito real ou nova aula, cadastrar origem e configuração na biblioteca privada, conferir arquitetura/modelo e rodar uma prova; não varrer indiscriminadamente todos os livros.

## Usar agora pelo GitHub

Abrir https://github.com/AndredOR19/Biblioteca-de-Diagramacao/actions/workflows/estacao-automatica.yml → Run workflow. Escolher material e pedido_id único. O modo todos-pilotos executa ambos. Baixar artefato privado estacao-<pedido>. Não é necessário n8n para executar essa etapa. A retenção é de sete dias; o usuário deve conservar a prova aprovada e as fontes versionadas. A conta privada possui quotas próprias de Actions.

## Conectar ao n8n autohospedado

1. Importar produzir-materiais.json na instância privada, mantendo-o inativo até teste.
2. Criar/selecionar credencial GitHub na instância. Permissões mínimas: Actions write/read e Contents read no repositório Biblioteca-de-Diagramacao. A conexão GitHub do ChatGPT não é automaticamente transferida ao n8n. Não colar token em nós Code, arquivos, HTML, URLs ou nesta conversa.
3. Selecionar a credencial nos quatro nós HTTP GitHub: Solicitar produção privada, Localizar pedido no GitHub, Consultar execução e Obter pacote privado.
4. Em Configurar pedido, escolher um dos dois material_id. O exemplo gera ID por horário. Para recuperar pedido já enviado, usar seu mesmo ID e consultar a execução; não repetir dispatch sem conferir resultado anterior.
5. Executar manualmente com o capítulo demonstrativo. Conferir confirmação do dispatch, execução exata pelo pedido, conclusão e artefato. A saída final fornece link privado da execução, identificador do artefato e estado aguardando_revisao.
6. Testar falha, expiração de pacote e indisponibilidade de rede. Não habilitar repetição automática do POST de dispatch: falha de resposta pode ocorrer depois de o GitHub aceitar o pedido.

Um HTTP 204 do GitHub confirma apenas a solicitação. O workflow aguarda em intervalos de dez segundos, até aproximadamente vinte minutos, e só entrega após success e artefato encontrado. Ele não baixa nem publica manuscritos. Ausência de resposta ou timeout não comprova cancelamento da produção. A listagem busca as cem execuções recentes; para uso em alto volume será necessário índice privado durável/paginação. A concorrência do Actions não é garantia de idempotência global; conferir ID antes de reenviar.

## Revisão e limites

Implementado: montagem dos materiais existentes, diagramação pelo motor, verificações técnicas, preservação de fontes, versões, hashes, imagens para inspeção e pacote aguardando revisão. Nenhum estado técnico é promovido automaticamente a aprovação editorial.

Pendente: autoria a partir de texto/tema, revisão linguística e continuidade por modelo, pesquisa/verificação factual, seleção/geração de imagens, revisão humana completa, aprovação com assinatura do hash do pacote, publicação após aprovação e integração com Supabase/painel Vercel. Essas etapas devem usar versão e orçamento explícitos. Não tratar a revisão técnica como revisão linguística ou pedagógica. Nenhuma chamada paga a IA ou Gamma foi ativada por esta entrega.

O n8n organiza a execução; a biblioteca é o motor privado; Arquiteturas guarda regras e conteúdos pedagógicos públicos. Não copiar motor, livros privados ou guias docentes para o repositório público. Nomes, observações e respostas de alunos não são entrada desse workflow. O JSON não usa webhook público nem envia mensagens.

## Testar e regenerar

```sh
node automacoes/n8n/producao/gerar.mjs
node automacoes/n8n/producao/testes.mjs
```

Doze ensaios locais com API simulada; ensaios do executor e produção real no Actions privado são verificados separadamente. JSON válido não comprova importação/execução no n8n.

Referências primárias consultadas em 29/10/2026:
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.github/
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
- https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event

## Evidência do piloto

[Execução privada 40889867708](https://github.com/AndredOR19/Biblioteca-de-Diagramacao/actions/runs/40889867708), commit e0946bac93687a1a34195d27a998573cd9a4af80: sucesso, dois materiais e pacote de 49 arquivos com hashes conferidos após download. PDF demonstrativo de sete páginas e entradas HTML em computador/celular inspecionados pelo assistente. O template de livro mantém páginas pares vazias de abertura; não é defeito de perda de conteúdo. Aprovação do autor e revisão substantiva de um livro real permanecem pendentes. Artefato 12903628538 expira em 05/11/2026; execução e fontes versionadas permanecem como evidência. Ver STATUS.json.
