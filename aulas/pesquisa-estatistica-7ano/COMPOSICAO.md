# Composição — Laboratório dos Dados (Matemática · 7º ano)

Slug: `pesquisa-estatistica-7ano` — sem data e sem turma no conteúdo (convenção: só o ano cursado).

## Arquivos autorais
- `index.html` — esqueleto do padrão app.js v2.0.0 (adaptação de `aulas/04-11-2026-estudos-orientados-172/`), com a seção `#game` "Laboratório dos Dados" (`#jogo-lab` + `#jogo-passos`) entre o texto e os percursos. Sem painel de QR nesta versão: o QR entra após validar o endereço publicado. Rodapé: "Prof. André de Oliveira Rodrigues · Matemática · 7º ano".
- `conteudo.json` — conteúdo integral (26 percursos nas fases Planejar 1–7, Coletar e organizar 8–14, Representar 15–21, Concluir 22–26; 4 blocos; 3 cartões de exploração; glossário 7 verbetes; dicionário 4 verbetes). Fonte de verdade da aula. Dados 100% fictícios (30 respondentes: ônibus 12, a pé 10, carro 6, bicicleta 2; tempos 5–45 min). Habilidades: EF07MA36 oficial conferida + **formulação da professora parceira preservada como referência fornecida** + complemento EF07MA35.
- `estudo.js` — figuras SVG (prancheta de pesquisa, tabela, gráfico de barras, gráfico de setores), oficina "minha pergunta de pesquisa", apoio de alfabetização emergente (PESQUISA, TABELA, GRÁFICO, DADOS), porta de entrada (#entry), circuitos do relatório (Planejar / Coletar e organizar / Representar / Concluir), bilhete tabela × prancheta, botão de relatório JSON (`relatorio-pesquisa.json`) e metodologia matemática registrada no relatório.
- `lab.js` — jogo "Laboratório dos Dados": 10 etapas em botões DOM (pergunta → variáveis → planejar coleta → dados fictícios → tabela → gráfico adequado → construir/manipular → interpretar → limites → conclusão), cada uma com 3 alternativas, feedback explicativo no acerto e no erro, progresso em `S.jogo` e eventos via `log('jogo_missao'/'jogo_concluido')`; painel p5 opcional (`#jogo-lab`) desenha a visualização de cada etapa (prancheta, categorias, reta numérica, censo × amostra, 30 cartões, barras ordenadas/na ordem, interpretação e relatório) e degrada com aviso quando o motor não carrega. Contrato `window.JogoAula` (total 10, corretas, valores).
- `professor/recuperacao.json` — banco da recuperação adaptativa (26 conceitos × 3 experiências: relacionar/organizar/aplicar), espelhando os conceitos dos percursos. Não publicado.
- `professor/plano-diario.md`, `professor/apoio-docente.md`, `professor/cadastro-coleta.sql` — plano diário, respostas comentadas (gerado por `ferramentas/gerar-apoio.py`) e SQL administrativo idempotente do cadastro no receptor. Não publicados.

## Arquivos gerados (não editar à mão)
- `app.js` — `ferramentas/motor-app.head.js` + `Promise.resolve(<conteudo.json>).then(init)`; gerado por `python3 ferramentas/montar-aula.py aulas/pesquisa-estatistica-7ano` (67.909 bytes no disco; JSON compacto do conteúdo: 38.650 caracteres).
- `recuperacao-dados.js` — gerado do `professor/recuperacao.json` pelo mesmo montador (schema `[26][3]` do padrão).

## Arquivos genéricos copiados do padrão (idênticos ao template)
`sons.js`, `style.css`, `fredoka.css`, `fredoka-0..3.woff`, `OFL.txt`, `leitura/painel.js`, `recuperacao-core.js`, `recuperacao.js`.

## Motor
- **p5.js 2.3.4** vendado em `p5-2.3.4.min.js` (990.638 bytes; sha256 `bb8b82b97fcbcd5bb2d5475d1b6a3904f3ab4ed01b821134fd8f1e7710fce559`; via jsDelivr, lib/p5.min.js do pacote 2.3.4). Usado apenas no painel de visualização do jogo; sem outros motores e sem assets externos (tudo desenhado em código).
- O painel p5 é **opcional por projeto**: as 10 etapas em botões carregam o mesmo conteúdo e seguem acessíveis a leitores de tela; se o motor não carregar, a aula continua íntegra e um aviso no `#jogo-status` explica o fallback.

## Adaptações conscientes em relação ao template (documentadas)
1. **`coleta.js` 1.1.0 adaptado** (sed da aula 01): mesmo endpoint `coleta-livre`; `storageKey` próprio (`coleta-livre:pesquisa-estatistica-7ano:1.1.0`); **fallback de modo local** — após duas recusas de cadastro, oferece iniciar com registros apenas neste navegador + exportação TXT/JSON/e-mail. Nenhum texto declara coleta confirmada sem recibo do servidor.
2. **Payload do `concluir` enxuto**: as cópias estruturais de `adaptacao` e `apoios` foram removidas do objeto enviado (permanecem integralmente no `relatorio_texto`), mantendo o payload com folga sob o teto de 60 KB do receptor para artefatos novos (medido: 42.581 caracteres no modo servidor simulado).
3. **Motor (#meta)**: linha de identificação condicional — mostra o campo turma apenas como rótulo do `D.turma` (aqui "7º ano") e omite a data quando "não fixada". Patch em `ferramentas/motor-app.head.js`, partilhado com as demais aulas novas; não altera o comportamento das aulas já publicadas.
4. **QR code**: ausente nesta versão por decisão do fluxo de publicação (gerar somente após validar o endereço publicado no domínio central).
5. `recuperacao.js`/`recuperacao-core.js` inalterados (regras 2.0.0: 26 originais + até 78 complementares = 104).

## Publicação
- Projeto central (rotas estáveis): `https://arquiteturas-aulas.vercel.app/aulas/pesquisa-estatistica-7ano/` e mirror GitHub Pages. Entrada no catálogo: `publicacao/catalogo.json` (tipo html, ano 7º, sem data/turma).
- Cadastro da coleta: ver `professor/cadastro-coleta.sql` (passo administrativo do professor; sem esse cadastro a aula opera em modo local com exportação).
