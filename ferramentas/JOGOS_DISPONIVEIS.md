# Jogos e modelos disponíveis nas aulas da tarde

Consulta de 06/11/2026: a Biblioteca de Diagramação, na revisão fixada no lock e na árvore principal consultada, não contém um catálogo próprio de jogos. Não presumir acesso a um jogo citado em outro chat ou anunciá-lo publicado. Esta entrega reutiliza componentes públicos existentes, sem copiar código privado.

| Aula | Recurso em funcionamento | Ação do estudante |
|---|---|---|
| Práticas Experimentais 161 | Bancada 2D das partes | Ligar seis indícios aos conceitos e conferir relações |
| Práticas Experimentais 161 | Bloco 3D das frações, em CSS | Girar um modelo de oito volumes iguais e selecionar 2, 4 e 6 partes |
| História 211 | Mapa 2D de fontes e resistências | Relacionar indícios e conceitos de análise histórica |
| História 211 | Território 3D de relações, em CSS | Selecionar estações por casos; cenário esquemático, sem reconstrução histórica |

Os recursos ficam em `aulas/<slug>/territorio.js`, parametrizados por `config.js`; fonte pública preservada no histórico do Git. Os estilos estão em `territorio.css`. Cada uma das três páginas oferece acesso a `index.html#game`. Não somar jogos opcionais à quantidade de percursos exigidos nem usar treino de jogo como conclusão automática do currículo.

São atividades relacionais e modelos manipuláveis. Não são videogames com personagens controláveis, NPCs, inventário ou mundo explorável, nem simulações arqueológicas ou físicas. A adoção de um motor de videogame exige implementação e testes próprios; a existência de uma biblioteca JavaScript em outra aula não torna qualquer jogo curricular pronto.

## Conferência reproduzível

`ferramentas/testar-tres-caminhos-tarde.cjs` usa jsdom para verificar as duas aulas: principal de 32, erro/recuperação, evidências, relatório, recarga e preservação do legado de 26; terceira alternativa de 96 com linguagens, avaliação e relatório próprios; apoio local de 57; jogos 2D e modelos 3D sem exigência de identificação para o treino. Instale jsdom em um ambiente de teste e indique-o por `NODE_PATH`, ou use a instalação do projeto quando existente.

O ensaio de DOM não comprova áudio, desempenho ou conforto no Chromebook. A publicação deve ser verificada separadamente, e a avaliação de aprendizagem permanece docente.
