# AIx — Arquiteturas Imersivas de Aprendizagem (v1.0)

Fábrica de experiências de aprendizagem jogáveis e acessíveis para a escola pública.
**A IA sugere, a pessoa docente decide.**

- Contrato Universal (`contracts/aix-experience.schema.json`) — data-only, validado em 3 barreiras.
- Fábrica determinística (`fabrica.py`) — Python puro, idempotente por sha256, sem custo de LLM.
- Motor acessível (`engines/accessible/gerar.py`) — HTML semântico jogável (teclado + leitor de tela).
- Composição sobre a Fábrica AEE existente (`automacoes/aulas`) — nada do que funciona foi substituído.
- Publicação pela cadeia existente (13 checks + Pages + QR) — só após aprovação docente vinculada ao sha256.

## Comece aqui
- `docs/AIx_PROMPT_MESTRE_v1.1.md` — projeto revisado (mudanças rastreáveis da v1.0 para a v1.1).
- `docs/AIx_AUDITORIA_INICIAL.md` — Fase Zero somente leitura, com evidências.
- `docs/AIx_ARQUITETURA_TECNICA.md` — componentes, decisões e CLI.
- `docs/AIx_CATALOGO_MODELOS.md` — modelos jogáveis e regras.
- `docs/AIx_AUTOMACAO_N8N.md` — CLI + 9 workflows n8n opcionais.
- `docs/AIx_MANUAL_PRODUCAO.md` — do pedido à publicação, versões e rollback.

## Comandos
```
python3 aix/fabrica.py demo                          # gera/valida o piloto (idempotente)
python3 aix/fabrica.py solicitar --texto "…" [--conteudo …]
python3 aix/fabrica.py validar <contrato.json>
python3 aix/engines/accessible/gerar.py <contrato.json>
python3 aix/tests/testar_contrato.py && python3 aix/tests/testar_fabrica.py
```

**Estado**: núcleo testado (25/25); piloto histórico em draft com 3 blockers honestos; 2D/3D e aplicação da migração = fases seguintes com autorização. Nenhum dado de estudante; LGPD por design; WCAG 2.2 AA como exigência de primeira classe.
