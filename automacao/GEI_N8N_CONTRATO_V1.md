# GEI 1.0 — Contrato de automação de assets e jogos (n8n / Arena A.I.)
Data: 2026-11-06 | Estado: especificação para implantação e integração, **não** prova de execução do n8n.

## Objetivo
Criar jogos educacionais reais (personagens controláveis, cenários navegáveis, NPCs, inventário, missões, estados e consequências), sem reduzir gameplay a quiz. O n8n **orquestra**, não substitui Phaser/Three.js, ferramentas de imagem, runtime de build nem revisões pedagógicas. O Arena A.I. está conduzindo implementação paralela: primeiro auditar branch, PR, workflows e contratos existentes; preservar trabalho em andamento e coordenar integração por PR.

## Fonte de verdade e integração
- Este Prompt Mestre: regras pedagógicas; AGENTS.md: instruções a agentes.
- Biblioteca de Diagramação: motores/templates, consultar lock e ponte `ferramentas/README.md` sem expor códigos privados.
- Supabase projeto `ifyiarwygywoexsflfsx`: catálogo GEI criado e verificado; tabelas `public.gei_assets`, `gei_asset_files`, `gei_generation_jobs`, `gei_asset_usages`. Todas com RLS habilitada, sem acesso direto concedido a `anon`/`authenticated`; API confiável com autorização específica ainda deve ser implantada. Não usar o projeto Cabala.
- Arquivos binários: Supabase Storage ou outro armazenamento autorizado, com bucket, permissões, URLs e custos auditados. **Não** gravar binários diretamente no SQL nem manipular `storage.objects` por SQL. Criar buckets via API oficial.
- GitHub: código, schemas, catálogo de metadados não sensíveis, workflow e testes versionados; binários grandes fora do Git, salvo justificativa. Vercel e Pages: publicar somente pacotes validados.
- n8n: credenciais de servidor/variáveis seguras, webhooks autenticados, rate-limit, idempotência, fila, retry com backoff e DLQ. Nunca registrar chaves de API em repo, logs ou páginas.
- IA geradora: selecionar provedores pela compatibilidade, licença, custo e disponibilidade; não presumir existência de API ou geração 3D/rigging. Diferenciar imagem ilustrativa, sprite com animações verificadas e modelo GLB com rig validado.

## Pipeline com gates
1. **Solicitação**: briefing curricular (série, habilidade BNCC/RCG, gênero, 2D/3D, estilo visual, dispositivo, acessibilidade), orçamento e requerente autorizado. Não incluir dados identificáveis dos alunos.
2. **Pesquisa no acervo**: consulta indexada por tipo, tags, estilo, licença, tamanho, engine, versão e compatibilidade. Reusar primeiro, não gerar duplicatas.
3. **Planejamento**: manifest JSON de recursos, dependências, critérios de aceitação e estimativa de custo. Se operação cara, exigir aprovação configurável.
4. **Fila**: criar `gei_generation_jobs` com `idempotency_key` único, estados `queued→running→review→complete` ou `failed/cancelled`; registrar tentativa, provedor, custo, erro sanitizado e IDs externos.
5. **Geração/importação**: imagens, sprite sheets, tilesets, áudio, modelos GLB, metadados; invocar geradores externos apenas em serviços autorizados. Cada saída tem proveniência/licença, prompt_version e hash.
6. **Verificação técnica**: formato, integridade, dimensões, performance, animação idle/walk/interact, direções, colisões, hitbox, LOD quando 3D, ausência de arquivos quebrados, direitos de uso e créditos. Invalidar output que só pareça jogo.
7. **Revisão**: aprovação humana da pertinência pedagógica, representação cultural, segurança, faixa etária e acessibilidade. Assets pendentes ficam em `review` e não entram no catálogo publicado.
8. **Catálogo**: arquivo no storage, linha em `gei_asset_files`, asset em `gei_assets` com estado `approved`, origem/licença/tags. Registrar `gei_asset_usages` ao construir aula.
9. **Montagem da aula**: motor Phaser para RPG/plataforma, Three.js para 3D quando justificado; pacote curricular + manifest de assets + lógica de missões + coleta autorizada. O jogo deve ter ações e consequências verificáveis.
10. **Validação e deploy**: testes unitários, integridade dos recursos, teclado/toque/Chromebook, acessibilidade, desempenho, salvamento, privacidade e decisão pedagógica; CI → Vercel + Pages; comparar rotas e QR codes após deploy. Em caso de falha, não afirmar que publicou; apresentar fallback sem mascarar erro.

## Contratos mínimos (exemplos; ajustar ao schema final sem quebrar consumidores)
Solicitação:
```json
{
  "request_id": "uuid",
  "lesson_key": "matematica-7ano-ef07ma36-cidade-dos-dados",
  "curriculum": {"year": 7, "subject": "Matemática", "skills": ["EF07MA36"]},
  "asset_requirements": [{"type": "character", "count": 1, "style_key": "pixel-topdown", "animations": ["idle", "walk", "interact"]}],
  "target_engine": "phaser",
  "accessibility": {"keyboard": true, "touch": true, "non_reader": true},
  "max_budget": null
}
```
Manifest:
```json
{
  "asset_id": "uuid",
  "slug": "personagem-pesquisadora-v1",
  "type": "character",
  "version": "1.0.0",
  "status": "approved",
  "engine": "phaser",
  "variants": [{"format": "png", "role": "spritesheet", "frame_width": 64, "frame_height": 64, "frames": 16, "storage_path": "characters/pesquisadora/v1/spritesheet.png"}],
  "license": {"name": "original", "attribution": ""},
  "sha256": "sha256 do arquivo verificado"
}
```
Esses JSON são contratos de referência, não evidência de recursos gerados.

## Workflows n8n propostos
- GEI-01-Receber-e-Reusar: webhook autenticado/manual → validar briefing → buscar catálogo → decidir reuso/geração → registrar job.
- GEI-02-Produzir-e-Revisar: consumir fila → provedor autorizado → gravar storage → validar → revisão → aprovar/rejeitar → atualizar banco.
- GEI-03-Montar-Testar-Publicar: disparo por aula ou assets aprovados → gerar jogo → rodar CI → deploy dual → smoke tests → QR → recibo.
- GEI-04-Reconciliacao: rotina de inconsistências, custos, jobs presos, hashes e arquivos órfãos; alerta sem vazar dados.

Não usar polling agressivo; preferir eventos/filas. Conter loops, definir tentativas máximas e evitar recursão webhook→deploy→webhook. Fluxos reais devem ser exportados como JSON de n8n, com credenciais removidas e instruções de instalação/testes.

## Direitos autorais e importação de projetos
Reutilizar MIT/CC0 somente após checar `LICENSE` real, atribuição exigida, dependências, assets embarcados e compatibilidade; repositório público sem licença não autoriza copiar código. Registrar fonte, versão e hash. Fazer avaliação de qualidade e segurança de dependências.

## Condições pedagógicas obrigatórias
Aplicar AEE, D/R/E/L, progressão, avaliação com evidência e acessibilidade não leitora (áudio, imagens, mediação), sem associar diagnóstico a aluno em HTML. Distinguir nota por evidência, tentativa, ajuda e bug técnico. Não equiparar tempo em tela a aprendizagem. Manter critérios vigentes do Prompt Mestre (incluindo 26 percursos e limites de recuperação), adaptando a incorporação de gameplay sem inflar a nota nem bloquear por falhas técnicas.

## Piloto e entregáveis concretos
Piloto: **A Cidade dos Dados**, Matemática 7º ano EF07MA36. Deve oferecer personagem controlável, mapa urbano, ao menos 3 NPCs, coleta de amostra, gráfico construído pelo estudante, decisão urbana com consequência e relatório docente. Se não houver implementação dessas mecânicas, marcar protótipo, não game completo.
Entregar: export n8n sem segredos; migration SQL/schema; buckets com controles documentados; manifests e assets testados; fonte Phaser; testes; PR; URLs de deploy, relatório de falhas e evidências de recibo.
Cada agente deve devolver estados distintos: `documentado`, `implementado`, `testado`, `publicado`. Nunca converter intenção em confirmação.

## Convivência com Arena A.I.
Auditar antes de escrever: detectar trabalho Arena em outras branches, mapear conflito de arquivos, respeitar decisões existentes e pedir revisão via PR. Não sobrescrever main automaticamente, não renomear schema existente sem migração, não rodar deploy ou migração destrutiva sem teste. Integração se dá por contratos versionados, com PR pequeno e testes reproduzíveis.
