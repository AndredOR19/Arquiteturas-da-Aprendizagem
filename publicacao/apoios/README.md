# Experiência orientada e relatórios dos apoios — 1.0.0

Integração pelo empacotador nas páginas com JSON `apoio-dados` ou `dados-exemplos`. Não modifica as respostas, a contagem de atividades, a sessão da aula principal ou o critério de nota.

## Interface

`experiencia.js` constrói instruções em três passos, botão para ir à atividade, exemplo resolvido fora da contagem, orientação lateral, representações didáticas e escolha de ambiente com menos estímulos. `experiencia.css` aplica hierarquia, contraste e composição responsiva. As representações matemáticas são SVGs calculados; os esquemas históricos organizam relações e não são fontes históricas nem evidência de causalidade.

As ilustrações de fundo são contemporâneas e geradas para a ambientação, não registros de acontecimentos. `oficina-fracoes.webp` foi criada a partir da imagem `exec-2482e210-aab3-40d8-beb7-5c1b656cd535.png`; `arquivo-historia.webp`, de `exec-e7d9a6f9-f190-4ec7-97cc-03b6595904b1.png`, pela ferramenta integrada de imagens. A conversão para WebP preserva dimensões e composição, com codificação de qualidade 84; os PNGs originais não foram sobrescritos. Ativos finais ficam nesta pasta e acompanham a publicação, sem dependência de links temporários.

Especificações dos prompts de produção:

- **Oficina de frações:** ilustração editorial em quadrinhos, estudantes adolescentes diversos investigando tiras de partes iguais e blocos, bancada e instrumentos, azul-petróleo/ocre/creme, área calma à esquerda para título; sem números, equações, textos ou logotipos. Arte de ambientação, não diagrama matemático.
- **Arquivo de investigação:** estudantes contemporâneos analisando mapas, papéis, fotografias e relações de evidências, estética editorial para ensino médio, vinho/petróleo/âmbar, área calma para título; sem reconstrução colonial, espetacularização da escravidão, fantasias culturais, textos ou documentos apresentados como autênticos.

## Registro e entrega

`relatorios.js` instrumenta apoios sem exportador próprio, sobretudo o percurso de alfabetização. As alternativas 161/211 já expõem `RotaExemplos` e preservam seu exportador completo. Os registros do coletor novo ficam em `sessionStorage`, separados por página, com identificação declarada opcional, tentativas, primeiras escolhas, conclusões por ID, apoios acionados, linguagem, reflexão e tempo aproximado de visibilidade. Não registrar diagnóstico, outros sites, teclas em geral ou dados ocultos da sessão principal.

TXT/JSON e prévia preservam o relatório completo. A preparação do e-mail copia o texto e oferece um link curto para rascunho; o aluno cola, confere e envia. Não há POST automático, integração Supabase nova ou confirmação de recebimento. Falha de cópia/salvamento é indicada e tem alternativa manual. Tempo visível não comprova atenção, áudio acionado não comprova escuta, e acerto de associação não comprova alfabetização.

## Verificação

Ensaio DOM em `testar-interface.cjs`: instrução, exemplo resolvido, imagens, modo calmo, avanço das 57/96, troca de linguagem sem avançar, exportador próprio preservado, registro de 114 tentativas em 57 atividades, primeiras escolhas e recarga do histórico, cópia negada e ausência de voz. Não equivale a teste de escuta ou desempenho em Chromebook real. Conferir URLs e recursos após o build antes de anunciar publicação.
