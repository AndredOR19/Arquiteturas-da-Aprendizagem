# PROMPT MESTRE AIx — v1.1 (revisada e implantada)

> **Objeto:** Arquiteturas Imersivas de Aprendizagem (AIx) — versão 1.0.
> **Origem:** v1.0 (base) → v1.1 revisada após Auditoria Inicial (Fase Zero) do repositório em 05/11/2026.
> **Estado:** núcleo determinístico implementado e testado no branch `feature/aix-fabrica`; piloto histórico gerado com pendências honestas; publicação em produção **depende de aprovação docente**.

## 0. Mudanças da v1.0 para esta v1.1 (rastreáveis)

| # | v1.0 dizia | v1.1 passa a dizer | Motivo da revisão |
|---|---|---|---|
| 1 | Fábrica AIx nova, ao lado da Fábrica AEE | AIx **compõe sobre** a Fábrica AEE existente: `automacoes/aulas/gerar.py` (26 percursos por aula) permanece e é o template `percursos-interativos`; seu pipeline pedido→PR é o **Workflow 04** da cadeia AIx | Auditoria: não duplicar automação em produção desde 2025 |
| 2 | Diretórios ideais (`/fabrica`, `/engines`) | Diretórios **reais** do repositório: `aix/contracts`, `aix/camadas.py`, `aix/fabrica.py`, `aix/engines/accessible`, `aix/experiences`, `aix/templates`, `automacoes/n8n/workflows`, `coleta/supabase/migrations` | Auditoria: "adaptar diretórios à estrutura real sem mover arquivos existentes" |
| 3 | Experiência definida só pelo JSON de conteúdo | **Contrato Universal** (`aix-experience.schema.json` 1.0.0) com 9 blocos, habilidades com `confirmed` + fonte, `blockers` e `artifactSha256`; conteúdo autoral (LLM) separado do esqueleto determinístico (fábrica) | Nenhum código arbitrário de LLM; aprovação vinculada à versão exata |
| 4 | Camada B "recupera o currículo" | Camada B **nunca inventa**: lê somente planejamentos existentes em `banco-pedagogico/planejamentos/bernardina/…`; habilidade transcrita nasce `confirmed:false`; **classificação por data é só indício — a atribuição definitiva de período/tema é do plano docente** | Piloto 231 sem planejamento ⇒ contrato draft com blocker, não "adivinhação" |
| 5 | 3 motores (museu, investigação, percursos) | 4 modelos no catálogo mínimo, com `percursos-interativos` como primeiro; motores 2D/3D são **fase seguinte** — o MVP entregue é o motor acessível HTML | Ampliar sem substituir; MVP jogável já publicável pela cadeia existente |
| 6 | n8n orquestra tudo | n8n é **opcional**: 9 workflows prontos (`automacoes/n8n/workflows/aix-*.json`, `active:false`, sem credenciais) **OU** CLI pura (`python3 aix/fabrica.py …`) | Auditoria: não presumir n8n instalado/conectado |
| 7 | Banco novo para experiências | Migração incremental `coleta/supabase/migrations/aix_001_…sql` (schema `aix`, 4 tabelas, RLS default-deny) — **preparada, NÃO aplicada**; o schema `educacional` (31 tabelas) permanece intocado | Auditoria: migrações só com autorização |
| 8 | Publicação própria AIx | Publicação **reusa a cadeia existente**: 13 checks `ferramentas/conferir-*.cjs` + static + `publicar-pages` + QR pós-endereço válido | Auditoria: nada do que funciona em produção pode regredir |
| 9 | Aprovação "pelo professor" | Aprovação **vinculada ao sha256 do contrato exato**; contrato com pendência ⇒ `status:"draft"` + `blockers` ⇒ validador impede `approved` | Aprovação por versão exata (commit/artefato) |
| 10 | Custos de LLM na fábrica | Fábrica é **determinística e gratuita** (Python puro, sem dependências); LLM somente no **Workflow 04** opcional (produção do conteúdo autoral), sob decisão de custo do professor | Priorizar gratuito/open-source observando licenças |

## 1. Princípios inegociáveis (inalterados da v1.0)

1. **A IA sugere, a pessoa docente decide.** Nenhum artefato chega a estudante sem aprovação explícita.
2. **Nenhum código arbitrário de LLM.** O contrato é data-only; templates são renderizadores testados uma vez e reutilizados N vezes.
3. **Acessibilidade como exigência de primeira classe** (WCAG 2.2 AA): todo jogo tem alternativa nativa HTML por teclado e leitor de tela; `modes` sem `accessible` ⇒ contrato inválido.
4. **Avaliação como apoio docente** — registros de participação/progresso; nunca diagnóstico automático, nunca substituição da leitura docente, nota sempre revisável.
5. **Privacidade desde o design** (LGPD): nenhum dado pessoal obrigatório no estudante; coleta anonimizada por sessão; catálogo sem dados de estudantes.
6. **Presença oficial ≠ participação.** Registro de acesso não certifica aprendizagem.
7. **Custo mínimo**: open-source primeiro (Phaser/A-Frame/MIT), LLM opcional e consciente.

## 2. Contrato Universal AIx (o artefato central)

Arquivo: `aix/contracts/aix-experience.schema.json` (JSON Schema draft-07, versão 1.0.0). Nove blocos: `experienceId`, `schemaVersion`, `experience` (arquitetura, template, narrative, environments, missions, sources), `curriculum` (escola, ano/turma, componente, termo, habilidades com `code/skill/confirmed/source`), `pedagogy` (método, estágios E-O-P-E/D-R-E-L, razão pedagógica ≥120 chars), `accessibility`, `assessment` (rubrica de apoio), `publication` (`status`, `blockers`, aprovação com sha256), `generated` (pipeline, versão, requestId determinístico), `artifactSha256`.

Validação em **3 barreiras** (`aix/contracts/validador.py`): estrutura (schema), segurança (chaves proibidas, `javascript:` em qualquer posição), semântica (referencial BNCC real em disco, ordem dos movimentos, `accessible` obrigatório, pendência ⇒ draft+blockers, `approved` ⇒ aprovador+data+sha, fontes marcadas verificadas existem no disco). **18 testes de mutação + 7 de fábrica, todos verdes.**

## 3. Camadas e fábrica (implementado)

- **Camada A** — interpreta a solicitação em pt-BR (turma `192`, `3º ano · EM`, componente, período).
- **Camada B** — recuperação curricular **real**: procura planejamento docente em disco; extrai habilidades do plano (BNCC via regex EF/EM); **nunca confirma** habilidade por conta própria (transcrição ⇒ `confirmed:false`).
- **Camada C** — método → template → planta de diagramação (consulta `biblioteca-arquiteturas/plantas/`).
- **Fábrica** (`aix/fabrica.py`, CLI determinística, Python puro sem dependências): `solicitar` → contrato; `validar`; `demo`. Idempotente por sha256 (requestId = hash do texto|id — **sem uuid/datas voláteis dentro do contrato**); recusa solicitação sem turma; registro em `aix/jobs/`.

## 4. Modelos jogáveis (catálogo mínimo)

| Modelo | Estado | Motor |
|---|---|---|
| Percursos interativos (26 D-R-E-L) | **produção** (Fábrica AEE) | HTML semântico herdado |
| Investigação documental | **implementado (MVP)** | `aix/engines/accessible/gerar.py` |
| Museu histórico | especificado | Phaser 2D + acessível (Fase 2) |
| Simulador de decisões, laboratório, cidade virtual, gincana, associação/alfabetização, narrativa | roteirizados | fases seguintes |

Ver `aix/docs/AIx_CATALOGO_MODELOS.md`. Nenhum layout copiado entre disciplinas; consultar a Biblioteca de Diagramação antes de qualquer interface.

## 5. Cadeia de produção (9 passos, todos executáveis hoje)

1. **Solicitar** — docente escreve em linguagem natural → `aix/fabrica.py solicitar`.
2. **Recuperar currículo** — Camada B sobre planejamentos reais (sem invenção).
3. **Planejar** — esqueleto determinístico com pendências explícitas.
4. **Produzir conteúdo** — LLM opcional (custo aqui e somente aqui) OU autoria manual; JSON de conteúdo conforme exemplo do piloto.
5. **Construir** — fábrica gera contrato validado + `preview-acessivel.html` (elementos nativos, textareas por missão, eventos no padrão da coleta, botão relatório).
6. **Auditar** — suítes de teste + `node --check` no JS embutido + 13 checks da cadeia existentes.
7. **Aprovar** — docente confere prévia e pendências; aprovação vinculada ao sha256; blockers impedem aprovação.
8. **Publicar** — reusa a cadeia existente (rascunho → PR → merge com aprovação → static + Pages + QR pós-endereço válido); nada quebra em produção.
9. **Monitorar** — painel docente existente (edge function `painel-docente`); relatórios de participação/progresso; **nenhuma alteração automática de aula publicada**.

## 6. Automação

- **CLI (núcleo, sempre disponível):** os 9 passos rodam por comandos locais documentados em `aix/docs/AIx_AUTOMACAO_N8N.md`.
- **n8n (opcional):** 9 workflows prontos em `automacoes/n8n/workflows/aix-*.json`, `active:false`, sem credenciais, formato compatível com a instância existente (`receber-eventos.json`).
- **CI (existente, reusada):** `gerar-aulas-aee.yml` e a cadeia de publicação não foram alteradas.

## 7. Segurança, privacidade e limites

- Nenhuma chave em arquivo; tokens só na conversa; revogação após publicação confirmada.
- RLS default-deny em tudo que for ao banco; migração AIx preparada e **não aplicada** sem autorização.
- O que a fábrica **não faz**: não inventa planejamento, não confirma habilidade BNCC sem fonte, não verifica fonte histórica (só declara `verified:false`), não publica sem aprovação, não diagnostica estudante, não altera produção automaticamente.

## 8. Limitações conhecidas (honestidade da v1.1)

- Piloto 231 gerado como **draft com 3 blockers** (planejamento 231 inexistente; habilidade sem confirmação docente; fontes não verificadas) — a prévia serve à revisão docente, não ao uso em aula.
- Motores 2D/3D não implementados nesta versão (acessível HTML é o MVP).
- n8n não instalado/conectado nesta sessão — workflows são artefatos prontos para importação.
- Migração SQL preparada, não aplicada.
- E2E completo (solicitação→publicação monitorada) ainda não executado — **não declarar automação total** antes disso.

## 9. Próximas versões

v1.2: motor Phaser 2D (museu + gincana) com alternativa acessível obrigatória; v1.3: aprovação assistida com diff de contratos; v2.0: motor 3D (A-Frame) e cidades virtuais, sempre com alternativa nativa.
