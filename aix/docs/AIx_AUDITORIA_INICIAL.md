# AIx — AUDITORIA INICIAL (Fase Zero) — 05/11/2026

> Auditoria **somente leitura** do estado real do repositório antes de qualquer implantação.
> Nada foi alterado nesta fase. Evidências citadas por caminho ou por consulta ao Supabase (ref `ifyiarwygywoexsflfsx`).

## 1. O que JÁ EXISTE e foi verificado (comprovação "existente")

| Item | Evidência |
|---|---|
| Fábrica AEE em produção | `automacoes/aulas/gerar.py`; pipeline pedido→PR; 26 percursos D-R-E-L por aula; workflow `gerar-aulas-aee.yml` |
| Cadeia de publicação com 13 checks | `.github/workflows/` + `ferramentas/conferir-*.cjs` (e-mail, imagens, sons, etc.); publicação em Pages + QR pós-endereço válido |
| Catálogo de aulas publicadas | `aulas/` (24 HTML), `publicacao/`; espelho `andredor19.github.io/Arquiteturas-da-Aprendizagem` |
| Planejamentos docentes | `banco-pedagogico/planejamentos/bernardina/2026/3-trimestre/historia/` — turmas **192, 211, 221** |
| Base curricular BNCC | `base-curricular/` — habilidades EF/EM em disco (usadas como fonte de confirmação) |
| Biblioteca de diagramação | `biblioteca-arquiteturas/plantas/` (repositório privado, checkout em CI no lock `d10a9a45`) |
| Prompt Mestre AEE 3.2.0 | prompt da fábrica existente em uso |
| Banco Supabase `educacional` | 31 tabelas, RLS habilitado+forçado em todas, **0 políticas, 0 grants** = default-deny; 14 migrações; edge functions ACTIVE: coleta-educacional v2, painel-docente v8, chamada v1, coleta-livre v5 |
| Periodização trimestral RS 2026 | 18/02–22/05, 25/05–04/09, 08/09–18/12 (base da classificação por data — **só indício**) |

## 2. Lacunas que a AIx precisa respeitar (e como a v1.1 respondeu)

| Lacuna encontrada | Resposta na implantação |
|---|---|
| Turma 231 sem planejamento em disco | Contrato do piloto sai `status:"draft"` com blocker explícito; Camada B não infere plano |
| Habilidades BNCC "de cabeça" | `confirmed:false` + `source` obrigatório; confirmar exige fonte real em disco ou docente |
| Nenhuma política RLS/grants no banco | Migração AIx segue o mesmo padrão default-deny; **não aplicada** sem autorização |
| n8n com um workflow apenas (`receber-eventos.json`) | 9 workflows AIx criados no MESMO formato, `active:false`, sem credenciais |
| Cota Vercel esgotada (402) | Publicação central permanece em Pages; Vercel só com nova tentativa autorizada |
| Catálogo sem padrão único de contrato | Contrato Universal 1.0.0 com sha256 e aprovação vinculada |

## 3. Decisões de composição (não duplicação)

1. AIx **estende** a Fábrica AEE: percursos existentes viram o template `percursos-interativos`; o pipeline pedido→PR existente é o Workflow 04.
2. A cadeia de publicação existente é **reusada integralmente** — nenhum check foi removido ou contornado.
3. Diretórios adaptados à estrutura real (`aix/…`, `automacoes/n8n/workflows/`, `coleta/supabase/migrations/`) sem mover arquivos existentes.
4. LLM fica fora do núcleo determinístico: a fábrica roda Python puro; geração de conteúdo (autoral/LLM) é etapa separada e opcional.

## 4. Veredito da auditoria

A infraestrutura existente é **madura e segura** para receber a AIx como camada adicional. Os riscos relevantes são: (a) invenção curricular — mitigado por contrato com blockers; (b) regressão de produção — mitigado por reuso integral da cadeia; (c) exposição de dados — mitigado por default-deny e nenhum dado pessoal obrigatório. Recomendação: prosseguir com o piloto draft e submeter à revisão docente antes de qualquer publicação.
