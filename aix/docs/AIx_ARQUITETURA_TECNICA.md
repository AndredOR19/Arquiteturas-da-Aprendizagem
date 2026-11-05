# AIx — ARQUITETURA TÉCNICA (v1.0 implantada no branch `feature/aix-fabrica`)

## Visão geral

```
Solicitação docente (pt-BR) ──► aix/fabrica.py (CLI determinística)
                                   │
                                   ├─► Camada A  parser (turma/série/componente/período)
                                   ├─► Camada B  recuperação REAL (planejamentos em disco; BNCC confirmed:false)
                                   ├─► Camada C  método → template → planta (biblioteca-arquiteturas)
                                   │
                                   ▼
                     Contrato Universal (aix-experience.schema.json 1.0.0)
                                   │  validador.py — estrutura + segurança + semântica
                                   ▼
                 aix/engines/accessible/gerar.py ──► preview-acessivel.html
                                   │
                                   ▼
            Aprovação docente (vinculada ao sha256) ──► cadeia de publicação EXISTENTE
                                  (PR → merge → static → Pages → conferir-*.cjs → QR)
```

## Componentes

| Caminho | Papel | Dependências |
|---|---|---|
| `aix/contracts/aix-experience.schema.json` | Contrato Universal draft-07, 9 blocos | nenhuma |
| `aix/contracts/validador.py` | 3 barreiras (estrutura/segurança/semântica); CLI | stdlib |
| `aix/camadas.py` | Camadas A/B/C | stdlib |
| `aix/fabrica.py` | CLI `solicitar/validar/demo`; idempotente por sha256; registro em `aix/jobs/` | stdlib |
| `aix/engines/accessible/gerar.py` | Motor acessível: contrato → HTML semântico jogável | stdlib |
| `aix/experiences/…` | Contratos gerados + conteúdos de entrada + prévias | — |
| `aix/templates/*/modelo.json` | Catálogo de modelos jogáveis (requisitos por template) | — |
| `aix/tests/` | 18 mutações do contrato + 7 da fábrica (25/25 verdes) | stdlib + unittest |
| `automacoes/n8n/workflows/aix-*.json` | 9 workflows (opcional, `active:false`, sem credenciais) | n8n na instância do usuário |
| `coleta/supabase/migrations/aix_001_…sql` | Espelho de rastreio no banco — **NÃO APLICADA** | autorização docente |

## Decisões técnicas registradas

1. **Determinismo/idempotência**: `requestId = sha256(texto|experienceId)` recortado; `receivedAt` por dia (documentado como aceitável). UUIDs aleatórios e timestamps por segundo **quebram** a idempotência por sha — não reintroduzir.
2. **Slug de série**: `_slug("3º ano · EM")` = `3o-ano-em` (a pasta de ENTRADA do conteúdo pode usar outro rótulo; a SAÍDA da fábrica segue o slug canônico).
3. **Segurança no contrato**: varredura recursiva de chaves proibidas (`script`, `html`, `js`, `code`, `on*`) e de `javascript:` **em qualquer posição** do valor (não só prefixo).
4. **Semântica de aprovação**: `approved` exige aprovador+data+sha256; qualquer pendência ⇒ `draft` + `blockers` — o validador **impede** aprovar contrato pendente.
5. **Motor acessível**: elementos nativos (`details`, `textarea`, `progress`, `button`), `role="status"`, `aria-valuenow`, `prefers-reduced-motion`, foco visível, `lang="pt-BR"`; JS mínimo extraído e checado com `node --check`; eventos locais no padrão da coleta (`sessão + registros`), relatório copiável/baixável; **nenhum dado pessoal exigido**.
6. **Fases**: acessível HTML = MVP (pronto); Phaser 2D = Fase 2; 3D = Fase 4 — todo motor novo precisa de alternativa `accessible` para o mesmo contrato ser válido.

## Interfaces (CLI)

```
python3 aix/fabrica.py solicitar --texto "…" [--id …] [--conteudo caminho.json]
python3 aix/fabrica.py validar aix/experiences/…/contrato.json
python3 aix/fabrica.py demo
python3 aix/engines/accessible/gerar.py aix/experiences/…/contrato.json [saida.html]
python3 aix/tests/testar_contrato.py && python3 aix/tests/testar_fabrica.py
```
