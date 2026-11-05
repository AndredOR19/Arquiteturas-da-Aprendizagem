# Composição — Territórios da Independência (História · 9º ano)

Slug: `descolonizacao-africa-asia-9ano` — sem data e sem turma no conteúdo (convenção: só o ano cursado).

## Arquivos autorais
- `index.html` — esqueleto do padrão app.js v2.0.0 (adaptação de `aulas/04-11-2026-estudos-orientados-172/`), com a seção `#game` (mapa + versão em lista) adicionada entre o texto e os percursos. Sem painel de QR nesta versão: o QR entra após validar o endereço publicado.
- `conteudo.json` — conteúdo integral (16 chaves; 26 percursos nas fases Investigar 1–7, Relacionar 8–14, Explicar 15–21, Aplicar 22–26; 4 blocos; 3 cartões de exploração; glossário; dicionário). Fonte de verdade da aula.
- `estudo.js` — figuras SVG (mapa de impérios, bandeira, linha do tempo, jornal), oficina "investigar uma fonte", apoio de alfabetização emergente (FONTE, MAPA, BANDEIRA, DATAS), porta de entrada (#entry), circuitos do relatório e botão de relatório JSON.
- `jogo.js` — jogo "Territórios da Independência": mapa didático simplificado (6 regiões retangulares, representação de estudo, não carta de precisão) com 8 missões de investigação; versão em lista espelhada para leitores de tela; progresso em `S.jogo`; eventos via `log('jogo_missao'/'jogo_concluido')`.
- `professor/recuperacao.json` — banco da recuperação adaptativa (26 conceitos × 3 experiências: relacionar/organizar/aplicar). Não publicado.
- `professor/plano-diario.md`, `professor/apoio-docente.md` — plano de aula e respostas comentadas (gerado por `ferramentas/gerar-apoio.py`). Não publicados.

## Arquivos gerados (não editar à mão)
- `app.js` — `ferramentas/motor-app.head.js` + `Promise.resolve(<conteudo.json>).then(init)`; gerado por `python3 ferramentas/montar-aula.py aulas/descolonizacao-africa-asia-9ano`.
- `recuperacao-dados.js` — gerado do `professor/recuperacao.json` pelo mesmo montador (schema `[26][3]` do padrão).

## Arquivos genéricos copiados do padrão (idênticos ao template)
`sons.js`, `style.css`, `fredoka.css`, `fredoka-0..3.woff`, `OFL.txt`, `leitura/painel.js`, `recuperacao-core.js`, `recuperacao.js`.

## Motor
- **Phaser 4.2.1** vendado em `phaser-4.2.1.min.js` (1.375.976 bytes; sha256 `66348b1b5141e49b7d5ebbe688cddcb502eab1cb00f21c538686a5b2c5abe4de`; via jsDelivr). Sem outros motores: o jogo usa apenas retângulos/texto/interação — API estável. Se o Phaser não carregar, a aula continua íntegra e a versão em lista oferece as mesmas missões.
- Única dependência de execução além do motor padrão. Nenhum asset externo (mapa desenhado em código).

## Adaptações conscientes em relação ao template (documentadas)
1. **`coleta.js` 1.1.0 adaptado**: mesmo endpoint `coleta-livre`; `storageKey` próprio; **fallback de modo local** — após duas recusas de cadastro ("Turma ou professor não correspondem à aula cadastrada"), oferece iniciar com registros apenas neste navegador + exportação TXT/JSON/e-mail. Nenhum texto declara coleta confirmada sem recibo do servidor; as trocas de texto público só ocorrem quando o servidor confirma a entrada.
2. **Motor (#meta)**: linha de identificação condicional — mostra o campo turma apenas como rótulo do `D.turma` (aqui "9º ano") e omite a data quando "não fixada" (convenção da aula). Patch aplicado em `ferramentas/motor-app.head.js`, documentado aqui; não altera o comportamento das aulas já publicadas.
3. **QR code**: ausente nesta versão por decisão do fluxo de publicação (gerar somente após validar o endereço publicado no domínio central).
4. `recuperacao.js`/`recuperacao-core.js` inalterados (regras 2.0.0: 26 originais + até 78 complementares = 104).

## Publicação
- Projeto central (rotas estáveis): `https://arquiteturas-aulas.vercel.app/aulas/descolonizacao-africa-asia-9ano/` e mirror GitHub Pages. Entrada no catálogo: `publicacao/catalogo.json` (tipo html, ano 9º, sem data/turma).
- Cadastro da coleta: ver `professor/cadastro-coleta.sql` (passo administrativo do professor; sem esse cadastro a aula opera em modo local com exportação).
