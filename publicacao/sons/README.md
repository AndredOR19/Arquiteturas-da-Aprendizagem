# Sons de fundo opcionais — 1.0.0

Pedido do Prof. André em 30/10/2026: volume e seleção explicada. O módulo é injetado pelo empacotamento nos HTMLs cadastrados; não modifica slides nem cópias antigas. Recarregar páginas depois do deploy.

Seletor branco/rosa/marrom, texto explicativo e botão para ouvir a explicação; volume 0–100% independente, iniciar/parar e status visível. Começa desligado em toda abertura. Sem persistência automática de reprodução ou identificação clínica. Narração/áudio silencia temporariamente o fundo; mute global e saída da aba param. Falha de Web Audio tem aviso. Dados ficam na memória da página e só entram em relatório fullReport compatível, que conserva sua validação de atividades/experiência; não há envio automático.

## Características e limites
Branco: espectro amplo, chiado mais brilhante. Rosa: menos agudos, graves relativamente mais presentes. Marrom: ainda mais presença de graves. São opções para experimentar conforto/mascaramento, sem prometer ganho de concentração, aprendizagem ou tratamento. A alternativa de silêncio é explícita. O volume do aplicativo não é calibrado em dB e depende de sistema/dispositivo/fones; começar baixo, parar se incomodar.

Buffer local pseudoaleatório, filtro aproximado rosa por combinação de filtros recursivos e marrom por integração com vazamento; branco sem coloração. Normalização por RMS e limite de pico evitam diferenças grosseiras de nível digital entre opções. Colorações aproximadas, sem calibração acústica ou certificação de espectro. Repetição com transição curta para reduzir descontinuidade. Não depende de rede nem grava áudio do aluno. Uma saída digital limitada não garante exposição segura nos fones.

Fontes de consulta: IEEE, definições de ruídos coloridos: https://technav.ieee.org/topic/colored-noise/ . Web Audio, fonte de buffer e controle de ganho: https://webaudio.github.io/web-audio-api/ . NIDCD, reduzir volume e reconhecer riscos de exposição: https://www.nidcd.nih.gov/listen-text-only-version . As fontes não validam benefício pedagógico desta interface.

## Verificação
`node ferramentas/conferir-sons.cjs` no workflow Pages: todos os HTMLs cadastrados, sem autoplay, volume zero e ajuste, tipos distintos por autocorrelação, limite digital dos buffers, teclado, prioridade de voz, parada, recarga, celular, indisponibilidade e relatório. Conferir resultado remoto antes de declarar publicação. Nenhum teste técnico demonstra que o usuário ouviu ou melhorou atenção. Escuta e conforto no Chromebook não verificados.
