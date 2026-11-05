# Composição — Laboratório do Planeta Terra (Práticas Experimentais · 6º ano)

Slug: `laboratorio-planeta-terra-6ano` — sem data e sem turma no conteúdo (convenção: só o ano cursado).

## Justificativa da composição visual (adendo 05/11/2026)
Práticas Experimentais privilegia **instrumentos, observação, manipulação de variáveis e gráficos** (adendo §2; estilos/praticas-experimentais.md: modalidades demonstrativa-procedimental e investigativa). Por isso o objeto central é o **painel de bancada em Canvas 2D nativo** que redesenha, a cada capacidade, o instrumento ou modelo da vez (paisagem com fenômenos → caderno de campo → termômetro → corte da Terra → ondas sísmicas → atmosfera + gráfico de setores do ar → modelo × medição → plano da semana) — variando a visualização conforme a operação mental, em vez de repetir o layout da aula de Matemática (bancada de dados) ou da de História (mapa). Identidade aprovada do Fluxo 03 preservada: Fredoka, botões com feedback explicativo, painéis, cartões de exploração e percursos. Azul-ciência como cor de destaque do componente.

## Arquivos autorais
- `index.html` — esqueleto do padrão app.js v2.0.0 (adaptação de `aulas/04-11-2026-estudos-orientados-172/`), com a seção `#game` "Laboratório do Planeta Terra" (`#jogo-lab` + `#jogo-passos`). Sem painel de QR nesta versão. Rodapé: "Prof. André de Oliveira Rodrigues · Práticas Experimentais · 6º ano". `#meta` registra a limitação do documento de planejamento (docx 162 não acessível; divergência entre trimestres não presumida resolvida).
- `conteudo.json` — conteúdo integral (26 percursos nas fases Observar 1–7, Estruturar 8–14, Explicar 15–21, Aplicar 22–26; 4 blocos; 3 cartões de exploração; glossário 7 verbetes; dicionário 4 verbetes). Fonte de verdade. Habilidade EF06CI11 oficial conferida; física simplificada correta (manto rocha dúctil; efeito estufa natural ~15 °C; convecção; placas e tensão).
- `estudo.js` — figuras SVG (paisagem com fenômenos, corte da Terra, termômetro, nuvem com chuva), oficina "meu registro de observação" (caderno de campo), apoio de alfabetização emergente (TERRA, CALOR, NUVEM, MEDIR), porta de entrada (#entry), circuitos do relatório (Observar / Estruturar / Explicar / Aplicar), bilhete termômetro × paisagem, botão de relatório JSON (`relatorio-observacao.json`) e metodologia registrada.
- `jogo.js` — jogo "Laboratório do Planeta Terra": 8 capacidades do investigador em botões DOM (observar, registrar, medir, estruturar camadas, ler evidências, atmosfera, modelo × medição, planejar), com 3 alternativas, feedback explicativo no acerto e no erro, progresso em `S.jogo`, eventos via `log('jogo_missao'/'jogo_concluido')` e painel **Canvas 2D nativo** (sem motor externo) que redesenha por capacidade e degrada com aviso se o canvas não estiver disponível. Contrato `window.JogoAula` (total 8, corretas, valores).
- `professor/recuperacao.json` — banco da recuperação adaptativa (26 conceitos × 3 experiências), espelhando os percursos. Não publicado.
- `professor/plano-diario.md`, `professor/apoio-docente.md`, `professor/cadastro-coleta.sql`, `professor/manifesto-entrada.json`, `professor/manifesto-producao.json` — plano diário, respostas comentadas, SQL administrativo e manifesto de produção. Não publicados.

## Arquivos gerados (não editar à mão)
- `app.js` — `ferramentas/motor-app.head.js` + `Promise.resolve(<conteudo.json>).then(init)`; gerado por `python3 ferramentas/montar-aula.py aulas/laboratorio-planeta-terra-6ano` (67.159 bytes).
- `recuperacao-dados.js` — gerado do `professor/recuperacao.json` pelo mesmo montador (schema `[26][3]`).

## Arquivos genéricos copiados do padrão (idênticos ao template)
`sons.js`, `style.css`, `fredoka.css`, `fredoka-0..3.woff`, `OFL.txt`, `leitura/painel.js`, `recuperacao-core.js`, `recuperacao.js`.

## Motor
- **Canvas 2D nativo** — decisão de produção (uma tecnologia por aula: 01 Phaser / 02 p5 / 03 Canvas nativo / 04 DOM nativo). Zero dependências, zero bytes de motor: o painel usa apenas `getContext('2d')` com retângulos, arcos, setores e texto. Sem assets externos.

## Adaptações conscientes em relação ao template (documentadas)
1. **`coleta.js` 1.1.0 adaptado** (sed da aula 01): `storageKey` próprio (`coleta-livre:laboratorio-planeta-terra-6ano:1.1.0`); fallback de modo local após duas recusas; payload `concluir` enxuto (adaptacao/apoios apenas no `relatorio_texto`).
2. **Motor (#meta)**: identificação condicional — turma como rótulo do `D.turma` ("6º ano") e data omitida quando "não fixada".
3. **QR code**: ausente nesta versão (gerar somente após validar o endereço publicado).
4. `recuperacao.js`/`recuperacao-core.js` inalterados (regras 2.0.0).

## Publicação
- Projeto central (rotas estáveis): `https://arquiteturas-aulas.vercel.app/aulas/laboratorio-planeta-terra-6ano/` e mirror GitHub Pages. Entrada no catálogo: `publicacao/catalogo.json` (tipo html, ano 6º, sem data/turma).
- Cadastro da coleta: ver `professor/cadastro-coleta.sql` (passo administrativo; sem cadastro, modo local com exportação).
