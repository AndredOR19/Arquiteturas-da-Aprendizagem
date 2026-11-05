# AIx — RELATÓRIO TÉCNICO v1.2 (05/11/2026)

> Escopo da ordem: primeiro jogo histórico 2D/3D da Fábrica AIx para História 3º ano, turma 231, na branch `feature/aix-fabrica`. **Sem publicação em produção; main intocada; migrações não aplicadas; bloqueios curriculares da 231 mantidos.**

## 1. O que foi entregue

| Fase | Item | Estado |
|---|---|---|
| 1 | Motor Phaser 2D reutilizável (`aix/engines/phaser-2d/`) | ✅ implementado e testado |
| 1 | UI compartilhada 2D/3D (`ui-compartilhada.js`): missões, inventário, diálogos, feedback, salvamento | ✅ |
| 2 | 3 ambientes (Berlim Dividida, Arquivo da Memória, Praça da Democracia) × 3+ missões (9 no total, 25 tarefas) | ✅ |
| 2 | Fontes documentais ≠ elementos ficcionais (badges e regras) | ✅ |
| 3 | Motor Three.js (`aix/engines/three-3d/motor3d.js`) interpretando o mesmo contrato | ✅ protótipo funcional |
| 4 | `fabrica.py construir` (solicitação → contrato → 3 prévias) demonstrado; n8n aix-05 atualizado, `active:false` | ✅ |
| 5 | Testes (ver §3) e prévia jogável | ✅ |

## 2. Arquitetura (data-only, sem código por missão)

- **Contrato Universal 1.1.0** (schema estendido, retrocompatível): ambientes ganham `layout` (spawn, limites, obstáculos), `objects` (documento/cenário, `fictional`, `sourceId`), `characters` (falas); missões ganham `tasks` (`coletar`/`dialogar`/`comparar` com feedbacks pedagógicos).
- **Validador**: novas regras semânticas (spawn fora de obstáculo, ids únicos, alvos existentes, comparar com ≥2 opções e feedbacks, documento não-fictício exige fonte). **25/25 testes de mutação.**
- **Motores 2D e 3D são renderizadores genéricos**: lêem o contrato; nenhuma missão é codificada. O roteiro pedagógico vive no JSON de conteúdo (`conteudo-encruzilhadas.json`), reutilizado pelos três motores (acessível, Phaser, Three).
- Bibliotecas vendadas com sha256: Phaser 3.80.1 (MIT) e three.js r128 (MIT) em `vendor/` — funciona offline, sem CDN.
- Saídas por contrato: pasta `preview-phaser/` (CSP `default-src 'none'; script-src 'self'`), `preview-3d/`, `preview-acessivel.html` e arquivos únicos `preview-phaser.html` / `preview-3d.html` (tudo embutido, abre com dois cliques).

## 3. Testes executados (Fase 5) — todos verdes

| Suíte | Resultado | Cobertura |
|---|---|---|
| `aix/tests/testar_contrato.py` | **25/25 OK** | estrutura, segurança, semântica incl. dados de jogo |
| `aix/tests/testar_fabrica.py` | **7/7 OK** | camadas, idempotência, rejeição sem turma |
| `aix/tests/testar_jogo.py` (Chromium headless, desktop+mobile) | **TODOS PASSARAM** | carregamento; movimentação real por teclado (dx=355px); colisão com muro (bloqueia) e vão do checkpoint; interação contextual (prompt→painel→badge); inventário; diálogos; comparar com erro→feedback→retry e acerto→avanço; **progressão 9/9 missões**; salvamento/retomada (9/9 preservados); acessibilidade (Tab/Enter, aria-live, ARIA na barra, versão acessível navegável); mobile (controles de toque visíveis, direcional move dx=312, Interagir por toque); segurança (zero requisições externas, zero erros de console, sem eval/fetch/XMLHttpRequest, CSP) |
| `aix/tests/testar_jogo3d.py` | **TODOS PASSARAM** | cena WebGL; avatar por teclado (dx=364) e toque (dx=321); colisão AABB; interação; **missão completa no 3D**; troca de ambiente; modo leve (`?leve=1`); segurança |
| `aix/tests/testar_integracao_supabase.py` | **OK** | evento 100% sintético (sessão `TESTE-SINTETICO-AIx-DESCARTAR`, turma 231 da aula registrada) aceito pelo pipeline existente `coleta-livre`: `iniciar→identificado`, `eventos→recebido` com recibo. Migração `aix_001` **não aplicada**. |

## 4. Prévias jogáveis

- **Ao vivo (temporária)**: servidor local da sessão — `/preview-phaser/index.html` (2D), `/preview-3d/index.html` (3D), `/preview-acessivel.html`.
- **Offline**: `aix/experiences/historia/3o-ano-em/231/preview-phaser.html` e `preview-3d.html` (arquivo único, abre no navegador sem rede).
- Link privado persistente via conector Vercel não foi viável (deploy por arquivos exige conteúdo embutido; biblioteca de 1,2 MB). Alternativa registrada: URL sha-pinned via jsDelivr do branch (repositório público; não é o catálogo de produção).

## 5. Critério final de aceite — verificado

Abrir a prévia → controlar avatar → caminhar com colisões → interagir com objetos → realizar missão → receber feedback (erro e acerto) → avançar (progressão 9/9 comprovada em teste automatizado e reproduzível). O **mesmo contrato** produz experiência funcional em Three.js (missão completa, 3 ambientes, modo leve) — requisito atendido.

## 6. Limitações honestas

1. **Bloqueios curriculares da 231 mantidos** (plano da turma inexistente; habilidade sem confirmação; fontes `verified:false`). O contrato segue `draft` e a prévia é para **revisão docente** — não para uso em aula.
2. Personagens e parte dos objetos são **fictícios de simulação** (marcados em contrato e na interface); documentos vinculam-se às fontes declaradas, ainda não verificadas.
3. O 3D é protótipo: sem sombras/texturas, rótulos simplificados, colisão AABB (funcional, não realista). Modo leve cobre baixo desempenho; não testado em hardware real de baixo custo.
4. Retomada usa `localStorage` (mesmo navegador/dispositivo); sem sincronização entre dispositivos — intencional (privacidade).
5. Progressão testada com deslocamento assistido por gancho de teste (`?teste=1`) + interações reais; movimentação, colisão e interação tiveram testes com entrada 100% real.
6. n8n permanece em ambiente de testes (`active:false`) até validação docente; E2E completo (solicitação→publicação monitorada) não executado — não declarar automação total.
7. Sessão sintética gravada na coleta (2 registros marcados `TESTE-SINTETICO-AIx-DESCARTAR`) para comprovar integração — descartável no painel docente.

## 7. Decisões registradas

- `modes` agora deriva também dos dados: conteúdo com `layout+objects` declara 2d/3d automaticamente.
- Posição do avatar não persiste entre ambientes (cada ambiente recomeça no spawn) — previsibilidade e simplicidade.
- UI em DOM (não no canvas) para acessibilidade real (foco, aria-live, contraste); canvas só para o mundo.
- Painel final abre só ao concluir as 9 missões; síntese fica no dispositivo e serve à conversa com o professor (não altera nota).
