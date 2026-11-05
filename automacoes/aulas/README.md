# Fábrica AEE — pedido/roteiro → IA → biblioteca → aula → PR → Pages → conferência

## Estado implementado (04/11/2026)

O pedido de aula fica em `automacoes/aulas/pedidos/*.json`; o roteiro complementar em `automacoes/aulas/roteiros/*.md`.
O workflow `.github/workflows/gerar-aulas-aee.yml` recebe esses caminhos em **Actions → Gerar aulas AEE → Run workflow**.

Fluxo executável **quando credenciais e permissões estiverem habilitadas**:

1. Validar arquivo do pedido com `validar_pedidos.py`.
2. Consultar Prompt Mestre e Fluxo 03, e fazer checkout da **Biblioteca de Diagramação privada no commit fixado** por `ferramentas/biblioteca.lock.json`.
3. Passar o pedido e o roteiro ao modelo configurado via API de chat compatível com OpenAI, exigindo JSON pedagógico estruturado. Cada aula recebe 26 percursos e quatro alternativas comentadas. O código executável é um template local fixo: **o modelo não escreve JavaScript arbitrário**.
4. Gerar `aulas/<id>/index.html` e cadastrar a aula em `publicacao/catalogo.json` na nova branch.
5. Executar `validar_gerados.py`, `biblioteca-arquiteturas/validar_catalogo.py` e `publicacao/preparar.py`. Criar PR em **rascunho**, sem fazer merge e sem publicar a aula diretamente.
6. Professor revisa conteúdo, correção, currículo, acessibilidade e versão para uso; após aprovação e merge, os workflows **já existentes** do Pages geram o acervo público.
7. `.github/workflows/conferir-aulas-publicadas.yml` verifica HTTP 200 para cada aula do último lote quando um deploy Pages termina com sucesso. A verificação HTTP **não é teste funcional no Chromebook**.

## Configuração necessária antes da primeira execução real

No GitHub **Settings → Secrets and variables → Actions**:

| Nome | Tipo | Uso |
|---|---|---|
| `BIBLIOTECA_READ_TOKEN` | Secret | Token de acesso **somente leitura** ao repositório privado `AndredOR19/Biblioteca-de-Diagramacao`, usado pelo checkout |
| `AULA_LLM_API_KEY` | Secret | Chave da API do modelo escolhido pelo professor; nunca registrar no código |
| `AULA_LLM_MODEL` | Variable | Nome real de modelo habilitado no provedor, sem inventar disponibilidade |
| `AULA_LLM_BASE_URL` | Variable opcional | Endpoint HTTPS compatível com `/chat/completions`; omitir para usar `https://api.openai.com/v1` |

Verifique em **Settings → Actions → General → Workflow permissions** se o token de GitHub Actions pode criar e aprovar PRs. Não conceda permissões além das necessárias; **a aprovação docente não é substituída**.

O script só usa chamadas pagas quando o workflow é acionado explicitamente e as credenciais estão presentes. Não existe geração automática a partir da conversa do ChatGPT sem uma chamada ao workflow por um agente autorizado. Não há segredo cadastrado por este commit.

## Como entrar um novo pedido/script

- Criar um JSON com `id,data,turma,disciplina,tema,fonte_curricular,habilidades,design,estado` e campo `aulas` com uma lista de aulas. Cada aula tem `id,turma,serie,disciplina,tema,fonte_curricular,habilidades`.
- Criar um roteiro `.md` opcional indicando o recorte da aula, exemplos, modalidade, objetivos e restrições; conteúdo é **texto**, não comando executável.
- Iniciar o workflow com os caminhos do pedido e roteiro. Nenhum nome de estudante deve entrar nessas fontes.

Lote já registrado: `pedidos/2026-11-05-aulas.json` e `roteiros/2026-11-05.md`: História 192, EF07MA36 171, Práticas 162, ERER 172.

## Limites conhecidos

- A geração atual é **MVP de percursos HTML interativos**, não um motor Phaser/p5 homologado, nem substitui diagramação visual individual ou teste de acessibilidade em dispositivo real. É necessário revisão e evolução antes de aplicação geral.
- O modelo pode produzir erro factual mesmo passando verificações sintáticas. Códigos e ementas devem ser conferidos pelo professor.
- O script lê orientações da Biblioteca de Diagramação privada para orientar a geração; considere a política de compartilhamento com o provedor de IA escolhido. Não copia o motor para o site público.
- Os relatórios são baixados localmente; **não existe Supabase conectado neste gerador** nem envio automático de e-mail.
- O Vercel possui projetos múltiplos conectados ao mesmo Git, e prévias podem atingir limite de builds no plano. Isso requer consolidação/controle posterior; o fluxo de publicação garantido aqui é o **Pages existente** após merge.
- Não confundir: a validação sintética em GitHub Actions demonstra o percurso software sem API, não comprova geração real por LLM, nem publicação de quatro aulas.
- Nada em `automacoes/aulas/` publica documentos docentes, gabaritos reservados ou dados de alunos no Pages.

## Testes

`python automacoes/aulas/testar_gerador.py` verifica com conteúdo fictício o contrato: pedido → gerador → HTML → catálogo → sintaxe JS, **sem chave, API ou rede**.

`python automacoes/aulas/validar_pedidos.py` valida os arquivos de pedido.

`python automacoes/aulas/validar_gerados.py` valida o lote resultante quando existir.

O fluxo `Validar pedidos e aulas AEE` roda em PR e também manualmente. A checagem pós-deploy só roda após um workflow Pages concluído.

## Aprovação segura

**Pedido cadastrado não significa aula produzida. PR em rascunho não significa aula aprovada. Merge não substitui a conferência pedagógica e o teste de navegador.** Não automatizar merge de materiais discentes sem uma regra explícita de aprovação.
