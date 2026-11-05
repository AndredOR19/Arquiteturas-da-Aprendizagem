# Verificação — Elementos da Convivência (ERER · 7º ano)

Data da verificação: 05/11/2026 (ambiente de desenvolvimento, jsdom 24.1.3; sem navegador físico).

## Validações executadas
1. **Montador** (`ferramentas/montar-aula.py`): conteudo.json aprovado — 26 percursos (Reconhecer 7, Analisar 7, Dialogar 7, Agir 5), 3 alternativas e retorno por alternativa, 3 pistas, 4 blocos, 3 cartões de exploração, glossário e dicionário, fundamentos registrados (Leis 10.639/2003 e 11.645/2008 + DCNERER; **nenhum código BNCC inventado**), id coerente, sem data. `app.js` (69.545 bytes) e `recuperacao-dados.js` (50.431 bytes) gerados.
2. **Sintaxe**: `node --check` aprovado para `app.js`, `estudo.js`, `coleta.js`, `jogo.js`, `recuperacao-dados.js`, `recuperacao-core.js`.
3. **Teste de integração** (`ferramentas/testar-aula.cjs`, jsdom, receptor simulado):
   - **Modo servidor: 31 verificações aprovadas** — `iniciar` com artefato `elementos-da-convivencia-7ano`; eventos em lote; `concluir` com `percursos_total: 26`; tentativas como eventos; nota 9,6 sem penalização; relatório com jogo, recuperação e experiência; persistência.
   - **Modo recusa: 31 verificações aprovadas** — entrada bloqueada; modo local após duas recusas; nenhum envio; sem declaração de coleta online.
   - **Medidas**: fullReport 37.561 (servidor) / 37.251 (recusa); payload `concluir` 44.028 — dentro dos tetos (60.000/80.000).
4. **Jogo**: 8 situações hipotéticas; conclusão com explicação; erro não pune e explica; progresso registrado (`S.jogo`); contrato `window.JogoAula` consultável. Os elementos são valores (respeito, escuta, coragem, solidariedade) — sem características raciais; nenhum asset do filme; sofrimento real não pontuado.
5. **Endpoint real** (HTTP, dados fictícios): `iniciar` com artefato L04 recusado pelo receptor real — gate confirmado; nada gravado.

## Limites declarados desta verificação
- Jogo em DOM nativo é integralmente testável no jsdom (sem canvas/motor) — a cobertura inclui as 8 situações por completo; ainda assim, recomendado conferir voz e leiaute em navegador real (Chromebook/celular).
- Receptor simulado replica `coleta/supabase/livre/index.ts`; transmissão real exige cadastro.
- Nenhum código BNCC registrado: habilidade específica só entra após conferência em fonte oficial (decisão registrada no `#meta` e no plano).
- Sem QR code nesta versão.

## Pendências
1. Cadastro da aula na base (`professor/cadastro-coleta.sql`).
2. Conferência de habilidade BNCC (se o professor decidir registrar) em fonte oficial.
3. Teste em navegador físico (Chromebook/celular), inclusive voz.
4. QR code após a publicação validar o endereço.
5. Validação da URL pública pós-merge e conferência do espelho GitHub Pages.
