# Verificação — Laboratório do Planeta Terra (Práticas Experimentais · 6º ano)

Data da verificação: 05/11/2026 (ambiente de desenvolvimento, jsdom 24.1.3; sem navegador físico).

## Validações executadas
1. **Montador** (`ferramentas/montar-aula.py`): conteudo.json aprovado — 26 percursos (Observar 7, Estruturar 7, Explicar 7, Aplicar 5), 3 alternativas e retorno por alternativa em todos, 3 pistas, 4 blocos com âncora e fonte, 3 cartões de exploração, glossário e dicionário, habilidades registradas (EF06CI11 oficial), id coerente com o diretório, sem data no conteúdo. `app.js` (67.159 bytes) e `recuperacao-dados.js` (48.220 bytes) gerados.
2. **Sintaxe**: `node --check` aprovado para `app.js`, `estudo.js`, `coleta.js`, `jogo.js`, `recuperacao-dados.js`, `recuperacao-core.js`.
3. **Teste de integração** (`ferramentas/testar-aula.cjs`, jsdom, receptor Supabase simulado):
   - **Modo servidor: 31 verificações aprovadas** — inclusive `iniciar` com artefato `laboratorio-planeta-terra-6ano`; eventos em lote; `concluir` com `percursos_total: 26`; tentativas como eventos; nota 9,6 sem penalização; relatório com jogo, recuperação e experiência; persistência.
   - **Modo recusa: 31 verificações aprovadas** — entrada bloqueada; modo local após duas recusas; nenhum envio; relatório sem declaração de coleta online.
   - **Medidas**: fullReport 36.522 (servidor) / 36.212 (recusa); payload `concluir` 42.989 — dentro dos tetos (60.000/80.000).
4. **Jogo**: 8 capacidades na versão em botões; capacidade concluída com explicação; erro não pune e explica; progresso registrado (`S.jogo`: 2 concluídas, 1 acerto de primeira); contrato `window.JogoAula` consultável.
5. **Endpoint real** (HTTP, dados fictícios): `iniciar` com artefato L03 e identidade fictícia recusado pelo receptor real — gate confirmado também para este artefato; nada gravado.

## Limites declarados desta verificação
- O **painel Canvas** não é exercitado no jsdom (canvas indisponível; caminho testado é a versão em botões, mesma função `responder`). O painel tem guarda `getContext` + try/catch com aviso de fallback. Recomendado navegador real (Chromebook) antes da aplicação.
- **Conteúdo conforme resumo fornecido pelo professor**: o docx 162 da turma não estava acessível; possível divergência de sequência entre trimestres não presumida resolvida (registrada no `#meta`, no plano diário e no manifesto).
- Receptor simulado replica `coleta/supabase/livre/index.ts`; transmissão real exige cadastro prévio.
- Sem QR code nesta versão.

## Pendências
1. Cadastro da aula na base (`professor/cadastro-coleta.sql`; SQL Editor do Supabase, turmas reais).
2. Conferência da sequência com a professora parceira (docx 162) antes da aplicação.
3. Teste em navegador físico (Chromebook) do painel Canvas e da voz.
4. QR code após a publicação validar o endereço.
5. Validação da URL pública após o merge e conferência do espelho GitHub Pages.
