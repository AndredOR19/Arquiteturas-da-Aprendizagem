# Biblioteca de cenários e sessão 2 de frases — 1.0.0 (piloto de 09/11/2026)

Camada de ambientação para as aulas inclusivas (apoio "Aprender com imagens, palavras e áudio") e continuação opcional de formação de frases. **Fundo separado da lógica pedagógica:** nenhum arquivo desta pasta altera o banco `apoio-dados`, a sequência dos 57 percursos, as opções, as respostas, os critérios, a nota, a conclusão ou o progresso da sessão 1. O ensaio `testar-cenarios.cjs` confere o hash do banco contra `apoio/proveniencia.json` a cada execução.

## Arquivos (fonte canônica; cada aula recebe cópia idêntica em `apoio/cenarios/`)

| Arquivo | Papel |
|---|---|
| `catalogo.json` | Catálogo dos quatro ambientes (id, versão, descrição, resolução, proporção, direitos, relação com a interface, perfis etários, animação). Só `sala-das-palavras` está `disponivel`; os demais estão `planejado` até chegarem os originais. |
| `cenarios.js` | Gerenciador de fundos e painel do ambiente (`.cen-placa`): camada fixa `.cen-fundo` (desktop/móvel), parallax discreto só com movimento permitido, botão **Reduzir estímulos** persistido e sincronizado com `body.ap-calm` da experiência publicada; expõe `window.Cenarios.registrarAcao(botão)`. |
| `cenarios.css` | Painéis opacos sobre o fundo, perfis etários (`body[data-cenario-perfil]`: `5-6`, `7`, `8-9`, `medio`), convite e sessão 2, alvos de 48 px, foco visível, `prefers-reduced-motion`. |
| `frases.js` | Motor de frases: observa a conclusão da sessão 1 e mostra o convite com os textos do pedido; abre o conjunto 1 (exemplo resolvido → 12 atividades → tela final); pistas, indicação da resposta após o segundo erro, narração opcional, **Voltar às atividades**, **Parar por hoje**, retomada; progresso em `localStorage` (`arquiteturas:frases:v1:<caminho>`); entrada permanente pela placa ("Formar frases · sessão 2") para começar depois. |
| `frases-conjunto-1.json` | Conjunto 1 "Imagem e frase": 12 atividades (7 imagem→frase, 5 frase→imagem), personagens Ana/Léo/Bia/Davi, vocabulário da sessão 1 (ESCOLA, LIVRO, CASA, BOLA, TEMPO, LÁPIS, MAPA, PLANTA), arte vetorial copiada de `visuais.js` (o estudante vê o mesmo desenho), textos do convite, conjuntos 2–8 listados como planejados. |
| `sala-das-palavras-*.webp` | Cenário A em 1365×768 (desktop), 960×540 (móvel) e miniatura. **Provisório**: gerado pela ferramenta integrada de imagens a partir da miniatura enviada pelo professor; substituir pelo original (≥1920 px, 16:9). |
| `validar_cenarios.py` | Validação sem navegador (catálogo, conjunto, vocabulário ⊆ sessão 1, cópias idênticas, banco preservado, arte igual à de `visuais.js`). |
| `testar-cenarios.cjs` | Ensaio DOM em jsdom (página do repositório e página como publicada, com `experiencia.js`/`relatorios.js`): 57 percursos → convite exato; sessão 2 completa com erro provocado, interrupção, recarga e retomada; estímulos ↔ `ap-calm`; movimento reduzido; ausência de voz; catálogo sem o cenário. |

## Como uma aula adota a biblioteca

1. Copiar os arquivos de execução para `aulas/<aula>/apoio/cenarios/` (o validador exige igualdade byte a byte com esta pasta).
2. No `apoio/index.html`, acrescentar apenas: `<link rel="stylesheet" href="cenarios/cenarios.css">` no `head` e, após `visuais.js`, `<script defer src="cenarios/cenarios.js" data-cenario="<id>" data-perfil="<5-6|7|8-9|medio>" data-sessao="<texto da placa>"></script><script defer src="cenarios/frases.js" data-frases="frases-conjunto-1.json"></script>`. O bloco `apoio-dados` e o script do motor não mudam.
3. Registrar o piloto em `validar_cenarios.py` (`PILOTOS`), atualizar `manifesto.json`, `LICENCAS.md` e o recibo (`pacote_sha256`, evidências) da aula.
4. Executar `python3 publicacao/cenarios/validar_cenarios.py` e `NODE_PATH=<jsdom> node publicacao/cenarios/testar-cenarios.cjs --evidencias automacoes/aulas/evidencias/cenarios`.

## Contrato com a fábrica privada (Biblioteca de Diagramação)

Entrada: id do cenário, perfil etário, texto da placa, arquivo do conjunto de frases. Saída esperada: o mesmo HTML do apoio com as duas linhas acima e a pasta `cenarios/` copiada. Invariantes verificáveis: hash do `apoio-dados` igual à proveniência; motor inline igual a `publicacao/alfabetizacao/index.html`; convite só após o texto de conclusão do motor; sessão 2 em contêineres próprios (`#frases*`, `#convite-frases`) fora de `#choices`, `#step` e `#next`, para que `relatorios.js` não registre a sessão 2 como tentativa da sessão 1.

## Limites

Emulação DOM não mede legibilidade real, contraste renderizado, toque físico, voz nem desempenho em Chromebook/celular; a conferência em sala continua necessária. O cenário não ensina nada por si: é fundo de interface. Os conjuntos 2–8 da sessão 2 e os cenários B–D ainda não existem como atividades.
