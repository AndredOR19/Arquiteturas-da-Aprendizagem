# Biblioteca de modelos jogáveis AIx

Cada modelo é um par (modelo.json + motor(es)) que consome o Contrato Universal AIx.
Implementados: `percursos-interativos` (herdado da Fábrica AEE) e `document-investigation`
(MVP do motor acessível). Especificados: `historical-museum`. A expandir conforme o
Prompt Mestre AIx §4: simulador de decisões, laboratório experimental, cidade virtual,
gincana colaborativa, associação e alfabetização, narrativa interativa.

Regras: a IA sugere, o professor aprova; o template é testado uma vez e reutilizado
N vezes; nenhum modelo executa código gerado por LLM — o contrato carrega apenas dados.
