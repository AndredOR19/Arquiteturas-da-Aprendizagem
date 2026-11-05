# AIx — Arquiteturas Imersivas de Aprendizagem (v1.0)

Fábrica de experiências de aprendizagem jogáveis e acessíveis para a escola pública.
**A IA sugere, a pessoa docente decide.**

- Contrato Universal (`contracts/aix-experience.schema.json`) — data-only, validado em 3 barreiras.
- Fábrica determinística (`fabrica.py`) — Python puro, idempotente por sha256, sem custo de LLM.
- Motor acessível (`engines/accessible/gerar.py`) — HTML semântico jogável (teclado + leitor de tela).
- **Motor Phaser 2D** (`engines/phaser-2d/`) e **motor Three.js** (`engines/three-3d/`) — jogos que interpretam o mesmo contrato (v1.2).
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
python3 aix/fabrica.py construir --texto "…" --id … --conteudo … --motores acessivel,phaser,3d
python3 aix/fabrica.py validar <contrato.json>
python3 aix/engines/accessible/gerar.py <contrato.json>
python3 aix/engines/phaser-2d/gerar.py <contrato.json>
python3 aix/engines/three-3d/gerar3d.py <contrato.json>
python3 aix/tests/testar_contrato.py && python3 aix/tests/testar_fabrica.py
python3 aix/tests/testar_jogo.py && python3 aix/tests/testar_jogo3d.py   # exigem playwright + chromium
```

**Estado**: núcleo testado (25/25 contrato + 7/7 fábrica + E2E 2D/3D verdes); piloto histórico em draft com 3 blockers honestos; migração preparada e NÃO aplicada. Nenhum dado de estudante; LGPD por design; WCAG 2.2 AA como exigência de primeira classe. Ver `docs/AIx_RELATORIO_V1_2.md`.
