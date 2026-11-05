# Verificação — Laboratório dos Dados (Matemática · 7º ano)

Data da verificação: 05/11/2026 (ambiente de desenvolvimento, jsdom 24.1.3; sem navegador físico).

## Validações executadas
1. **Montador** (`ferramentas/montar-aula.py`): conteudo.json aprovado — 26 percursos (Planejar 7, Coletar e organizar 7, Representar 7, Concluir 5), 3 alternativas e retorno por alternativa em todos, 3 pistas, 4 blocos com âncora e fonte, 3 cartões de exploração, glossário e dicionário, habilidades registradas (EF07MA36 oficial + referência da professora parceira preservada), id coerente com o diretório, sem data no conteúdo. `app.js` (67.909 bytes) e `recuperacao-dados.js` (50.592 bytes) gerados. O JSON embutido no app.js foi conferido idêntico ao conteudo.json do disco (26 percursos).
2. **Sintaxe**: `node --check` aprovado para `app.js`, `estudo.js`, `coleta.js`, `lab.js`, `recuperacao-dados.js`, `recuperacao-core.js`.
3. **Teste de integração** (`ferramentas/testar-aula.cjs`, jsdom com scripts na ordem do navegador e drenagem de microtasks; receptor Supabase simulado):
   - **Modo servidor (aula cadastrada): 31 verificações aprovadas** — inclusive: ação `iniciar` com artefato `pesquisa-estatistica-7ano`; eventos transmitidos em lote; relatório final `concluir` com `percursos_total: 26`; tentativas transmitidas como eventos; nota inicial 9,6 (25/26 na primeira) sem penalização por recuperação; relatório com jogo, recuperação adaptativa e experiência; persistência da sessão.
   - **Modo recusa (aula não cadastrada): 31 verificações aprovadas** — inclusive: entrada bloqueada após recusa; botão de modo local oferecido após duas recusas; aula liberada em modo local; **nenhum** evento ou relatório enviado; relatório **não** declara coleta online.
   - **Medidas**: fullReport 36.114 caracteres (servidor) / 35.804 (recusa); payload `concluir` 42.581 caracteres — dentro dos tetos do receptor para artefatos novos (60.000 JSON / 80.000 raw), com ~17 KB de folga para sessões reais mais longas.
4. **Jogo**: 10 etapas na versão em botões; etapa concluída com explicação; erro não pune e explica; progresso registrado (`S.jogo`: 2 concluídas, 1 acerto de primeira); contrato `window.JogoAula` exposto e consultável pelo teste.
5. **Endpoint real** (HTTP, dados 100% fictícios): `iniciar` com artefato `pesquisa-estatistica-7ano` e identidade fictícia recusado pelo receptor real ("Turma ou professor não correspondem à aula cadastrada") — gate de autorização confirmado também para este artefato; nada foi gravado.

## Limites declarados desta verificação
- O **painel p5** não é exercitado no jsdom (canvas indisponível; o caminho testado é a versão em botões, que espelha as mesmas 10 etapas e a mesma função `responder`). O painel tem guarda `typeof p5` e try/catch com aviso de fallback. Recomendado abrir a aula publicada em navegador real (Chromebook da escola) antes da aplicação.
- O receptor simulado replica o contrato documentado em `coleta/supabase/livre/index.ts`; o teste **não** grava na base real. A transmissão real exige cadastro prévio (ver pendências).
- Sem QR code nesta versão (decisão: gerar somente após validar o endereço publicado).

## Pendências
1. Cadastro da aula na base (SQL administrativo em `professor/cadastro-coleta.sql` — executar apenas no SQL Editor do Supabase, com as turmas reais).
2. Teste em navegador físico (Chromebook) do painel p5 e da voz.
3. QR code + painel de compartilhamento após a publicação validar o endereço.
4. Validação da URL pública após o merge (projeto central) e conferência do espelho no GitHub Pages.
