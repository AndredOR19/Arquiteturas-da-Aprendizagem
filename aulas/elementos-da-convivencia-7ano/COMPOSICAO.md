# Composição — Elementos da Convivência (ERER · 7º ano)

Slug: `elementos-da-convivencia-7ano` — sem data e sem turma no conteúdo (convenção: só o ano cursado).

## Justificativa da composição visual (adendo 05/11/2026)
ERER exige linguagem visual apropriada, diversidade representada com respeito e atividades críticas (adendo §2). Decisões centrais: (1) os "elementos" do jogo são **valores treináveis** (Respeito, Escuta, Coragem, Solidariedade) — nunca grupos nem características raciais fixas, evitando mapear os povos do filme em estereótipos; (2) as situações são **cartões de texto com cena destacada** — a operação é verbal (identificar/observar/intervir), e representar cenas de discriminação com personagens os tornaria caricaturizáveis, o próprio risco a evitar; (3) paleta rosa-magenta distingue o componente dos demais (terroso-História, verde-lab-Matemática, azul-ciência-Práticas); (4) **zero assets do filme** — nenhuma imagem, personagem ou marca reproduzida. Identidade aprovada do Fluxo 03 preservada (Fredoka, botões com feedback, painéis, percursos).

## Arquivos autorais
- `index.html` — padrão app.js v2.0.0 (adaptação do template EO-172), com `#game` "Elementos da Convivência" (chips de valores + `#jogo-passos`). `#meta` registra: situações hipotéticas, nenhum material do filme reproduzido, racismo como processo estrutural, Leis 10.639/2003 e 11.645/2008 + DCNERER, nenhum código BNCC sem conferência. Rodapé: "Prof. André de Oliveira Rodrigues · ERER · 7º ano".
- `conteudo.json` — 26 percursos (Reconhecer 1–7, Analisar 8–14, Dialogar 15–21, Agir 22–26); 4 blocos; 3 cartões de exploração; glossário 7 verbetes; dicionário 4; 3 fontes (professor, leis/DCNERER, BNCC para eventual conferência).
- `estudo.js` — figuras SVG (pessoas diversas, balões de diálogo, cartaz de direitos, prancheta de plano), oficina "minha atitude da semana", alfabetização emergente (RESPEITO, ESCUTA, DIREITO, MURAL), porta de entrada, circuitos (Reconhecer/Analisar/Dialogar/Agir), bilhete prancheta × balões, relatório JSON (`relatorio-convivencia.json`).
- `jogo.js` — jogo "Elementos da Convivência": 8 situações hipotéticas em DOM nativo (cena + pergunta + 3 alternativas + feedback explicativo), progresso em `S.jogo`, eventos `log('jogo_missao'/'jogo_concluido')`, contrato `window.JogoAula` (total 8). Sem motor e sem canvas.
- `professor/recuperacao.json` — 26 conceitos × 3 experiências, espelhando os percursos.
- `professor/plano-diario.md`, `professor/apoio-docente.md`, `professor/cadastro-coleta.sql`, `professor/manifesto-entrada.json`, `professor/manifesto-producao.json` — não publicados.

## Arquivos gerados (não editar à mão)
- `app.js` (69.545 bytes) e `recuperacao-dados.js` (50.431 bytes) — via `ferramentas/montar-aula.py`.

## Arquivos genéricos copiados do padrão (idênticos ao template)
`sons.js`, `style.css`, `fredoka.css`, `fredoka-0..3.woff`, `OFL.txt`, `leitura/painel.js`, `recuperacao-core.js`, `recuperacao.js`.

## Motor
- **DOM nativo** — decisão de produção (01 Phaser / 02 p5 / 03 Canvas / 04 DOM): zero dependências; a aula funciona em qualquer navegador, inclusive celulares antigos. Acessibilidade por construção (texto é o material).

## Adaptações conscientes em relação ao template (documentadas)
1. **`coleta.js` 1.1.0 adaptado** (sed da aula 01): `storageKey` próprio (`coleta-livre:elementos-da-convivencia-7ano:1.1.0`); fallback modo local; payload enxuto.
2. **Motor (#meta)**: turma como rótulo do `D.turma` ("7º ano"); data omitida quando "não fixada".
3. **QR code**: ausente nesta versão (somente após validar endereço publicado).
4. `recuperacao.js`/`recuperacao-core.js` inalterados (regras 2.0.0).

## Publicação
- Projeto central: `https://arquiteturas-aulas.vercel.app/aulas/elementos-da-convivencia-7ano/` + mirror Pages. Catálogo: `publicacao/catalogo.json` (tipo html, ano 7º, sem data/turma).
- Cadastro da coleta: `professor/cadastro-coleta.sql` (administrativo; sem cadastro, modo local).
