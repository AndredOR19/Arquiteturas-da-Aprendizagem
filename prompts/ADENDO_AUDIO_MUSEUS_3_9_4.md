# Adendo 3.9.4 — Áudio de passos nos museus

Diretriz permanente do Prof. André — 15/11/2026. Complementa o Prompt Mestre, especialmente 6.4 e 11, e o protocolo de museus. Preserva a base 3.9.0 e seus hashes de recibos legados, conforme a decisão de 13/11. Não modifica os adendos inclusivos 3.9.1–3.9.3.

## Âncora
Museus com caminhada devem oferecer passos opcionais vinculados ao deslocamento real, com alternância discreta entre os canais esquerdo e direito. O som é apoio à ambientação; conteúdo, portas e navegação continuam disponíveis sem áudio e sem caminhar em 3D.

## Mecânica
Reutilizar o módulo de áudio da produção. Iniciar desativado; ativar somente por ação explícita do visitante, com botão acessível para ligar/desligar e estado anunciado corretamente. Medir distância efetivamente percorrida após os limites do cenário, sem disparar por giro, câmera panorâmica, teletransporte ou movimento bloqueado. Manter volume discreto, não cobrir a fala e interromper a emissão ao parar, ocultar a página ou abrir diálogo. Não baixar áudio externo nem coletar dados para esta função. Ausência de Web Audio ou de panner estéreo deve permitir continuar a visita, com fallback mono quando pertinente.

## Circuito de implementação
Ação no botão → contexto de áudio liberado pelo navegador → caminhada real → distância acumulada → passo curto com L/R alternados → parada ou desativação sem novos passos.

Estado corrigido pelo professor: os dois museus usam síntese local abafada de carpete/veludo, com ataque e saída suaves, volume baixo e alternância L/R discreta. A caminhada usa 1,4 unidade/segundo (1 em movimento reduzido), passada de 0,75 unidade e intervalo mínimo de 480 ms entre sons. Não acumular fila de impactos; limpar a distância após pausa e interromper sons ativos ao desligar. Não usar ruído com ataque instantâneo. Os cenários ainda não identificam materiais automaticamente. Carpete, pedra/mármore por sala e fontes ambientais posicionais/HRTF são expansões futuras. Alternância estéreo L/R não equivale a surround 3D completo.

## Dialética prática e verificação
Ponto cego: áudio obrigatório, passos ao girar ou promessa de surround sem implementação. Resolução: controle explícito, deslocamento real como gatilho e descrição fiel ao código.

Conferir nos dois museus: início mudo; ativar/desativar por teclado e toque; parada, giro e limite sem novos passos; L/R em fones; página oculta e diálogo; fallback sem áudio/panner; preservação das portas, conteúdo e anotações. Registrar separadamente ensaio automatizado, inspeção em navegador, teste em celular físico e publicação. Não declarar escuta ou teste físico a partir da análise do código. Publicar e verificar os arquivos reais no GitHub Pages e na Vercel antes de confirmar cada destino.

## Correção 3.9.5 — cadência e veludo (15/11/2026)
Relato do professor: a primeira versão parecia uma metralhadora. O padrão vigente é o som abafado descrito acima; madeira e cadência de seis impactos por segundo ficam substituídas. Testar também movimento duplicado e distâncias grandes para assegurar o limite temporal. A síntese é uma aproximação de superfície macia; escuta e aceite do professor são distintos dos ensaios automatizados.
