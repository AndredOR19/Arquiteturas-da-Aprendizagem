# Verificação — Territórios da Independência (História · 9º ano)

Data da verificação: 05/11/2026 (ambiente de desenvolvimento, jsdom 24.1.3; sem navegador físico).

## Validações executadas
1. **Montador** (`ferramentas/montar-aula.py`): conteudo.json aprovado — 26 percursos (Investigar 7, Relacionar 7, Explicar 7, Aplicar 5), 3 alternativas e retorno por alternativa em todos, 3 pistas, 4 blocos com âncora e fonte, 3 cartões de exploração, glossário e dicionário, habilidades registradas, id coerente com o diretório, sem data no conteúdo. Correção ortográfica aplicada no percurso 4 ("Achatar") com remontagem e re-teste. `app.js` (69.543 bytes) e `recuperacao-dados.js` (54.191 bytes) gerados.
2. **Sintaxe**: `node --check` aprovado para `app.js`, `estudo.js`, `coleta.js`, `jogo.js`, `recuperacao-dados.js`, `recuperacao-core.js`.
3. **Teste de integração** (`ferramentas/testar-aula.cjs`, jsdom com scripts na ordem do navegador e drenagem de microtasks; receptor Supabase simulado):
   - **Modo servidor (aula cadastrada): 31 verificações aprovadas** — inclusive: ação `iniciar` com artefato correto; eventos transmitidos em lote com recibo validado; relatório final `concluir` com `percursos_total: 26`; tentativas transmitidas como eventos; nota inicial 9,6 (25/26 na primeira) sem penalização por recuperação; relatório com jogo, recuperação adaptativa e experiência; persistência da sessão.
   - **Modo recusa (aula não cadastrada): 31 verificações aprovadas** — inclusive: entrada bloqueada após recusa; botão de modo local oferecido após duas recusas; aula liberada em modo local; **nenhum** evento ou relatório enviado; relatório **não** declara coleta online.
   - **Medidas**: fullReport 35.922 caracteres (servidor) / 35.612 (recusa); payload `concluir` 42.389 caracteres — dentro dos tetos do receptor para artefatos novos (60.000 JSON / 80.000 raw).
4. **Jogo**: 8 missões na versão em lista (mesmas do mapa); missão concluída com explicação; erro não pune e explica; progresso registrado (`S.jogo`: 2 concluídas, 1 acerto de primeira).

## Limites declarados desta verificação
- O **mapa Phaser** não é exercitado no jsdom (canvas bloqueado no teste; o caminho testado é a versão em lista, que espelha as mesmas missões e a mesma função `responder`). Recomendado abrir a aula publicada em navegador real (Chromebook da escola) antes da aplicação.
- O receptor simulado replica o contrato documentado em `coleta/supabase/livre/index.ts` (recibos `iniciar`/`eventos`/`concluir`); o teste **não** grava na base real. A transmissão real exige cadastro prévio (ver pendências).
- Cota do receptor: para artefatos além de `04-11-2026-estudos-orientados-172`, o relatório final é limitado a 60 KB (JSON) / 80 KB (payload). Medido no modo servidor simulado: fullReport 35.922 caracteres e payload `concluir` 42.389 caracteres — dentro do limite com folga. As cópias estruturais de `adaptacao` e `apoios` foram removidas do payload (permanecem integralmente no `relatorio_texto`).
- Sem QR code nesta versão (decisão: gerar somente após validar o endereço publicado).

## Pendências
1. Cadastro da aula na base (SQL administrativo em `professor/cadastro-coleta.sql` — executar apenas no SQL Editor do Supabase, com as turmas reais).
2. Teste em navegador físico (Chromebook) do mapa Phaser.
3. QR code + painel de compartilhamento após a publicação validar o endereço.
4. Validação da URL pública após o merge (projeto central) e conferência do espelho no GitHub Pages.
