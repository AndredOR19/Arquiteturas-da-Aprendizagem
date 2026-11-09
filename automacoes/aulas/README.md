# Produção integral — versão 3.8.0

A entrada atual é gerar.py → Biblioteca de Diagramação/estacao/orquestrar_aulas.py. Leia o Prompt Mestre integral e MEMORIA_OPERACIONAL_AULAS.md. A interface independente do gerador foi retirada. O workflow público encaminha ao workflow privado; guias permanecem privados. Consulte STATUS_INTEGRAL.json para limites reais.

O orquestrador aceita qualquer pedido com id/data internos e aulas com ID estável, série e tema. Use conteudo apontando para JSON curricular ou --gerar-dados com provedor configurado; documentos_base aponta a fontes locais efetivamente recebidas. A série é pública, a turma e a data de aplicação pertencem apenas ao relatório interno. Não use uma data planejada como data real da sessão.

politica-entrega.json: 32 principais, mínimo 64/padrão 96 de exemplos e pelo menos 57 de apoio. Todos têm games, cenários por tema/série, acesso e relatório separados. PDFs discentes diagramados incluindo apoios e plano diário privado são exigidos; compilar não os homologa. O motor atual ainda precisa ser ampliado/revisado onde faltar requisito.

Cada produção fica em revisão_pendente. Complete o trabalho e registre evidências reais em execucoes/ID/ID-aceite.json; não marque aprovado por existir um arquivo. contrato_entrega.py valida versões, hashes e evidências. Novos destinos fora da lista legada não podem ser publicados sem registro. Após aceite completo, preparar.py cadastra o material discente no catálogo de build, e os deploys existentes usam a mesma política. O workflow Pages confere ambos os destinos e gera QR só após identidade dos arquivos. Sem versão nos dois destinos, a entrega permanece parcial.

Para conferir: python -m unittest discover -s automacoes/aulas -p test_entrega.py -v; python automacoes/aulas/testar_gerador.py. Migração de legados é explícita. Segredos/serviços não são criados por documentação; o estado remoto deve ser verificado.

## Produzir com a Biblioteca lida no runner (complemento 09/11/2026)

Workflow: **Actions → "Produzir com a Biblioteca de Diagramação (leitura no runner)" → Run workflow** (`.github/workflows/producao-biblioteca.yml`, apoio em `ferramentas/producao_ci.py`). Ele clona a biblioteca privada **dentro do runner**, no commit fixado por `ferramentas/biblioteca.lock.json`, produz pela ponte existente (`gerar.py` → `estacao/orquestrar_aulas.py`; ou `ferramentas/produzir.py` para `validar/compilar/novo`), apaga o clone antes de qualquer registro, roda os validadores do repositório e abre **PR em rascunho** com a saída (também guardada como artefato por 14 dias). Nenhum arquivo privado é versionado: `_biblioteca_privada/` está no `.gitignore` e o passo de mudanças bloqueia qualquer caminho desse tipo. Nada é mesclado nem publicado pelo workflow; o merge continua sendo decisão docente após revisão, teste em navegador e recibo.

Entradas: `modo` (padrão `orquestrar`), `pedido` (padrão `automacoes/aulas/pedidos/2026-11-10-terca.json`), `roteiro` (padrão `automacoes/aulas/roteiros/2026-11-10-terca.md`), `gerar_dados` (só com provedor configurado), `argumentos` (para `produzir.py`) e `abrir_pr`.

Requer **um** segredo de leitura da biblioteca, criado pelo professor em **Settings → Secrets and variables → Actions** do repositório Arquiteturas-da-Aprendizagem (nunca colado em conversa, prompt ou arquivo):

| Nome | Tipo | Uso |
|---|---|---|
| `BIBLIOTECA_DEPLOY_KEY` | Secret (**recomendado**) | Chave privada de uma *deploy key* **somente leitura** cadastrada na Biblioteca de Diagramação; vale só para esse repositório e não expira |
| `BIBLIOTECA_READ_TOKEN` | Secret (alternativa) | *Fine-grained PAT* restrito à Biblioteca, permissão **Contents: read** (Metadata: read vem junto), validade curta; renovar ao vencer |

Deploy key, passo a passo (no computador do professor):

1. `ssh-keygen -t ed25519 -C "arquiteturas-leitura" -f biblioteca_deploy -N ""` — gera `biblioteca_deploy` (privada) e `biblioteca_deploy.pub` (pública).
2. Na **Biblioteca de Diagramacao** → Settings → Deploy keys → Add deploy key: cole o conteúdo de `biblioteca_deploy.pub`, **sem** marcar "Allow write access".
3. Em **Arquiteturas-da-Aprendizagem** → Settings → Secrets and variables → Actions → New repository secret: nome `BIBLIOTECA_DEPLOY_KEY`, valor = conteúdo completo de `biblioteca_deploy` (incluindo as linhas BEGIN/END).
4. Apague os dois arquivos locais depois de cadastrar.

Alternativa por token: GitHub → Settings → Developer settings → Fine-grained tokens → Generate: *Resource owner* `AndredOR19`, *Only select repositories* → `Biblioteca-de-Diagramacao`, *Repository permissions* → Contents: Read-only; validade de até 90 dias; cadastre como segredo `BIBLIOTECA_READ_TOKEN`. Os dois segredos podem coexistir; a deploy key tem prioridade.

Permissão para abrir o PR: **Settings → Actions → General → Workflow permissions** = *Read and write permissions* e marque *Allow GitHub Actions to create and approve pull requests*. Sem isso, a produção e o artefato ficam disponíveis, mas o passo do PR falha.

Sem segredo, o workflow para no primeiro passo com a mensagem que nomeia os dois segredos e aponta para este README; nada é produzido. O teste local `python3 ferramentas/testar_producao_ci.py` cobre credencial, lock, clone sujo, ponte e bloqueio de caminhos privados com uma biblioteca sintética — **não comprova o motor real**, que só roda no GitHub com o segredo cadastrado. A primeira execução real é a confirmação pendente das opções de linha de comando do orquestrador privado (`--raiz --pedido --roteiro --gerar-dados`, as mesmas já usadas por `gerar.py`).

---
## Histórico técnico anterior (não é o caminho atual de geração)

# Fábrica AEE — pedido/roteiro → IA → biblioteca → aula → PR → Pages → conferência

## Estado implementado (04/11/2026)

O pedido de aula fica em `automacoes/aulas/pedidos/*.json`; o roteiro complementar em `automacoes/aulas/roteiros/*.md`.
O workflow `.github/workflows/gerar-aulas-aee.yml` recebe esses caminhos em **Actions → Gerar aulas AEE → Run workflow**.

Fluxo executável **quando credenciais e permissões estiverem habilitadas**:

1. Validar arquivo do pedido com `validar_pedidos.py`.
2. Consultar Prompt Mestre e Fluxo 03, e fazer checkout da **Biblioteca de Diagramação privada no commit fixado** por `ferramentas/biblioteca.lock.json`.
3. Passar o pedido e o roteiro ao modelo configurado via API de chat compatível com OpenAI, exigindo JSON pedagógico estruturado. Cada aula recebe 32 percursos e quatro alternativas comentadas. O código executável é um template local fixo: **o modelo não escreve JavaScript arbitrário**.
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


## Apoio opcional de leitura — regra de 06/11/2026
O mínimo de 57 percursos de apoio é independente dos 32 curriculares, sem mudar a nota ou exigir conclusão do apoio. O gerador inclui essa regra na solicitação ao modelo; o empacotador integra `publicacao/alfabetizacao/index.html` e executa `publicacao/alfabetizacao/validar.py` antes de publicar. O banco compartilhado atual oferece 57 percursos por área (oito operações sobre sete palavras e aplicação final). Banco menor que 57, IDs/atividades duplicados ou referências inexistentes interrompem o build; não basta anunciar 57 no texto. Execute `python3 publicacao/alfabetizacao/testar.py`. A geração por API continua dependente das credenciais configuradas e de revisão docente.

## Circuitos de descobertas — contrato 1.0
Cada nova aula gerada recebe um objeto `circuito` derivado dos 32 percursos. O contrato separa conteúdo e motor e contém perfil visual por faixa, estações, cartões essenciais e perguntas com evidências. A terceira pista de cada pergunta aponta por IDs estáveis para a estação e o cartão que explicam a questão; visita, tempo de tela ou clique não equivalem a compreensão. O validador está em `circuitos.py` e o comando único de verificação é `python3 automacoes/aulas/testar_circuitos.py`.

O gerador mantém os três caminhos independentes: principal, apoio à leitura e Aprender de outro jeito. A pele visual é escolhida pela série informada, não por diagnóstico: 5º–6º aventura acolhedora, 7º transição RPG, 8º–9º RPG contemporâneo e Ensino Médio investigação madura. O template da fábrica demonstra o mapa e o retorno; os pilotos 161 e 211 continuam sendo as referências funcionais de território e devem ser conferidos em navegador antes de qualquer anúncio de homologação.


## Opção Aprender de outro jeito — exemplos e relações — 06/11/2026
Além da aula principal de 32 percursos e do apoio à leitura de 57, cada geração cria `exemplos/index.html`. O gerador faz uma segunda chamada de conteúdo ao modelo, usando o mesmo objetivo curricular. Padrão 96 exemplos (triplo); `percursos_exemplos` permite adaptação de no mínimo 64 (dobro). São opções independentes, sem soma de carga obrigatória ou nota automática.

`exemplos.py` valida banco, IDs, duplicações literais, campos breves e respostas. O template mostra exemplo, elementos relacionados, relação explicada, resposta e feedback, com áudio opcional, retorno e progresso na aba. O template atual representa relações por cartões textuais: cenas/imagens específicas e diversidade pedagógica exigem revisão e enriquecimento antes da publicação. Não anunciar que todas as operações cognitivas sugeridas foram implementadas por este template de seleção. Não há coleta nominal ou diagnóstico.

O empacotador rejeita página ausente ou contagem divergente nas aulas com metadado `rota_exemplos`. A revisão docente continua obrigatória, inclusive para relações repetidas com outra redação, precisão e adequação etária. Teste sintético sem API: `python3 automacoes/aulas/testar_gerador.py`. A rotina continua dependente de credenciais/modelo e biblioteca privada configurados; esta atualização não executa geração real por API nem migra o acervo antigo.

