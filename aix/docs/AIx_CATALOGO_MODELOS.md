# AIx — CATÁLOGO DE MODELOS JOGÁVEIS (v1.0)

> Cada modelo é um par (requisitos de contrato + motor). A IA sugere o modelo; o professor decide.
> Nenhum modelo executa código gerado por LLM. Nenhum layout é copiado entre disciplinas —
> consultar a Biblioteca de Diagramação (`biblioteca-arquiteturas/plantas/`) antes de desenhar interface.

| # | Modelo | Template (`contract.template`) | Método típico | Estado | Avaliação como apoio |
|---|---|---|---|---|---|
| 1 | Percursos interativos — 26 perguntas D-R-E-L | `percursos-interativos` | tutoria/fixação | **produção** (Fábrica AEE) | tentativas, pistas, avaliação por percurso |
| 2 | Investigação documental | `document-investigation` | investigação documental | **implementado** (MVP acessível + **jogo Phaser 2D** + protótipo Three.js; piloto 231) | registros por missão + síntese argumentativa |
| 3 | Museu histórico | `historical-museum` | aprendizagem por exposição crítica | especificado (Fase 2) | objetos consultados, hipóteses, síntese |
| 4 | Simulador de decisões éticas | `decision-simulator` | estudo de caso/dilema | roteirizado | decisões + justificativas registradas |
| 5 | Laboratório experimental | `virtual-lab` | investigação experimental | roteirizado | hipóteses, dados, conclusão |
| 6 | Cidade virtual | `virtual-city` | projeto/problematização | roteirizado (Fase 3) | entregas por etapa + co-responsabilidade |
| 7 | Gincana colaborativa | `collaborative-quiz` | competição cooperativa | roteirizado | participação + acertos por equipe |
| 8 | Associação e alfabetização | `matching-game` | tutoria (leitura/escrita) | roteirizado | pares formados, tempo, reforço |
| 9 | Narrativa interativa | `interactive-story` | storyteling situado | roteirizado | escolhas + reflexão final |

**Regras do catálogo**: (1) todo modelo declara `modes` incluindo `accessible`; (2) evidência de aprendizagem é registro de apoio docente — nunca diagnóstico nem nota automática; (3) dados de estudantes jamais entram no catálogo ou no contrato; (4) fontes históricas/científicas vão em `sources` com `verified` honesto (`false` até o professor conferir).
