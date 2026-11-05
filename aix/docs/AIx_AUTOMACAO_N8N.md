# AIx — AUTOMAÇÃO (CLI e n8n)

## A. CLI (núcleo — sempre disponível, sem serviços externos)

| Passo | Comando |
|---|---|
| 1. Solicitar | `python3 aix/fabrica.py solicitar --texto "Turma 231, 3º ano EM, História, 3º trimestre, Guerra Fria" [--id hist-231-encruzilhadas] [--conteudo aix/experiences/historia/3o-ano-em/231/conteudo-encruzilhadas.json]` |
| 1-bis. **Construir (v1.2)** | `python3 aix/fabrica.py construir --texto "…" --id … --conteudo … --motores acessivel,phaser,3d` — solicitação → contrato validado → prévia acessível + jogo Phaser + protótipo 3D, sem programação manual de aula |
| 2–3. Recuperar/Planejar | incluídos em `solicitar` (Camadas A/B/C); pendências viram `blockers` |
| 4. Conteúdo | autoria manual (JSON como o do piloto) OU agente LLM externo — **custo de LLM só aqui** |
| 5. Construir | `python3 aix/engines/accessible/gerar.py <contrato.json>` → `preview-acessivel.html` ao lado |
| 6. Auditar | `python3 aix/tests/testar_contrato.py && python3 aix/tests/testar_fabrica.py` + `node --check` no JS extraído + checks `ferramentas/conferir-*.cjs` na publicação |
| 7. Aprovar | docente confere prévia; aprovação registrada com **sha256 exato**; blockers impedem `approved` |
| 8. Publicar | rascunho → PR → merge com aprovação → workflows existentes (static → Pages → conferir → QR) |
| 9. Monitorar | painel docente existente; relatórios de participação/progresso; sem alteração automática de publicadas |

## B. n8n (opcional — artefatos prontos, NÃO presumir instalado)

9 workflows em `automacoes/n8n/workflows/aix-*.json`, no mesmo formato do `receber-eventos.json` existente (nodes/connections/settings v1), **todos `active:false` e sem credenciais embutidas**:

| Workflow | Gatilho | O que faz |
|---|---|---|
| `aix-01-receber-solicitacao` | webhook POST `/aix-01-receber-solicitacao` (CORS restrito ao domínio do catálogo) | chama `fabrica.py solicitar` |
| `aix-02-recuperar-curriculo` | manual | valida contexto/currículo |
| `aix-03-planejar-experiencia` | manual | esqueleto determinístico |
| `aix-04-gerar-conteudo` | manual | ponto de encaixe do agente LLM (externo, com custo) |
| `aix-05-construir-experiencia` | manual | contrato + prévia acessível |
| `aix-06-auditar` | manual | suítes de teste + node --check |
| `aix-07-aprovacao` | manual | registro de aprovação por sha256 |
| `aix-08-publicacao` | manual | dispara a cadeia existente de publicação |
| `aix-09-monitoramento` | manual | leitura do painel docente |

**Para importar**: n8n → Import from File → selecionar o JSON → conferir caminhos absolutos do repositório nos nós `executeCommand` → criar credenciais próprias → ativar. Nenhum workflow altera produção sem o passo de aprovação.

## C. CI (existente — reusada sem alteração)

`gerar-aulas-aee.yml` (pedido→PR) e a cadeia de publicação (13 checks + static + Pages + QR) continuam sendo a única via de publicação. A AIx não cria canal paralelo.
