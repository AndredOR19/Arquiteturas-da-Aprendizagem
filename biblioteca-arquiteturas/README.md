# Biblioteca de Arquiteturas da Aprendizagem
Versão documental: 1.0.0 — 28/10/2026  
Responsável pedagógico: Prof. André de Oliveira Rodrigues.  
Compatível com o [Prompt Mestre 2.7.0](../PROMPT_MESTRE_AULAS_DIGITAIS.md).

Esta biblioteca transforma diretrizes em plantas consultáveis: o que cada arquitetura faz, suas entradas, operações, saídas, relações, exemplos e critérios de revisão. O prompt é a porta de entrada; a biblioteca detalha sua execução; os recursos técnicos produzem os formatos. Uma IA deve ler os documentos: links e siglas sozinhos não transferem contexto nem garantem execução idêntica.

## Começar
1. Ler prompt, orientações do repositório e histórico vigente.
2. Ler [protocolo de consulta e composição](PROTOCOLO_IA.md).
3. Consultar [catálogo estruturado](catalogo.json), núcleo transversal e ramo disciplinar.
4. Seguir a [arquitetura de organização das bibliotecas](ARQUITETURA_DA_BIBLIOTECA.md).
5. Preencher o [registro de composição](MODELO_DE_COMPOSICAO.md) antes de produzir.
6. Conferir [pendências e diferenças entre versões](PENDENCIAS.md).

## Plantas disponíveis
| Planta | Função |
| --- | --- |
| [AEE — Arquitetura de Exposição Explicativa](plantas/aee.md) | Tornar explícitos conceito, relações, representação e limites de uma explicação. |
| [MACI — conexões, retomadas e complexificação](plantas/maci.md) | Articular conhecimentos e fazer a retomada exigir reconstrução, com avanço gradual. |
| [ARN — percurso investigativo e retorno ao problema](plantas/arn.md) | Dar sentido à investigação por meio de problema, pistas, explicação e retorno. |
| [SVS — Sintaxe Visual Semântica](plantas/svs.md) | Tornar perceptíveis as relações por convenções visuais ensinadas e acessíveis. |
| [EPC — Experiência Perceptível de Compreensão](plantas/epc.md) | Tornar observável o que mudou na compreensão por exploração, reorganização e explicação. |
| [SSS — Sintaxe Sonora Semântica](plantas/sss.md) | Sinalizar eventos conceituais com som opcional, acompanhado por equivalente visual ou textual. |
| [ASA — Arquiteturas Sensoriais da Aprendizagem](plantas/asa.md) | Compor as arquiteturas conforme sua função e ajustar os recursos sensoriais. |
| [Arquitetura das Associações](plantas/associacoes.md) | Representar correspondências específicas entre elementos e verificar a relação além das pistas iniciais. |
| [AIES — Arquitetura de Integração Estético-Semântica](plantas/aies.md) | Traduzir a linguagem do objeto em composição, representações e ações de aprendizagem. |
| [Organização do pensamento e autoaprendizagem](plantas/autoaprendizagem.md) | Apoiar o estudante na organização da investigação e da leitura. |

“Disponível” significa documentação operacional do projeto; não significa eficácia empiricamente comprovada nem implementação automática de todas as regras no motor.

[Planta transversal de acessibilidade de leitura](plantas/leitura-acessivel.md): fontes, tamanho, espaçamento, largura, foco e escolhas reversíveis; sem rótulos diagnósticos.

[Avaliação da experiência](plantas/avaliacao-experiencia.md): impressão dos estudantes, recursos e preferências no relatório completo, sem efeito na nota.

## Ramificações por componente
- [Matemática por Dentro](disciplinas/matematica.md): planta inicial da relação entre situação, representação, símbolos, procedimento e aplicação.
- [Arte](disciplinas/arte.md): roteiro inicial e ligação ao exemplo Basquiat.
- [Mapa das disciplinas](disciplinas/MAPA.md): 15 entradas com operações, representações e checagens. Os demais ramos têm roteiros iniciais; suas plantas específicas serão desenvolvidas a partir de conteúdo, etapa e fontes.

## Expandir e conferir
Usar o [modelo de planta](MODELO_DE_PLANTA.md). Atualizar o catálogo, dependências, prompt quando necessário e histórico na mesma entrega. Manter ID estável e registrar diferenças, sem renomear retroativamente obras anteriores.

O [validador do catálogo](validar_catalogo.py) confere integridade estrutural e referências locais. Ele não avalia qualidade pedagógica, currículo nem eficácia. Executar na raiz do repositório: `python biblioteca-arquiteturas/validar_catalogo.py`.

## Estado desta entrega
Doze plantas transversais/de integração, duas plantas ou roteiros disciplinares iniciais e duas pendências nominais catalogadas. Nenhuma aula existente foi redesenhada nesta atualização. Arquivos curriculares continuam sujeitos ao status de seu catálogo. O motor privado mantém a revisão já fixada.
