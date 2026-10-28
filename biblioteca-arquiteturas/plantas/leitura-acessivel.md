# Acessibilidade de leitura e preferências tipográficas
ID: leitura-acessivel  
Versão documental: 1.0.0 — 28/10/2026  
Estado: diretriz documentada para novas produções e revisões; controles ainda não implementados nas aulas existentes.  
Origem: insight do Prof. André de Oliveira Rodrigues, em 28/10/2026.  
Fonte normativa: [Prompt mestre 2.8.0](../../PROMPT_MESTRE_AULAS_DIGITAIS.md), seções 11, 11.1 e 25.  
Dependências: [SVS](svs.md), [AIES](aies.md).

## Âncora conceitual — autonomia de leitura
Permitir que cada pessoa experimente ajustes de apresentação para reduzir barreiras e encontrar maior conforto. Disponibilizar para todos, sem exigir diagnóstico ou relato de condição. A preferência pode orientar uma adaptação pedagógica; não constitui identificação de dislexia, TDAH ou outra condição, nem prova de mudança cognitiva.

Entradas: texto estruturado, fontes realmente disponíveis, controles acessíveis e critérios de verificação. Saídas: painel de preferências, prévia reversível, leitura ajustável e registro técnico da implementação.

## Mecânica — painel Preferências de leitura
1. Oferecer escolha entre fonte padrão do dispositivo e alternativas efetivamente disponíveis. Incluir opções comuns e, quando incorporada com licença e testada, fonte associada à dislexia, como OpenDyslexic. Não anunciar uma fonte inexistente ou uma troca apenas simulada.
2. Permitir ajustar tamanho, espaçamento entre linhas, letras e palavras, largura do bloco e cores de apresentação com contraste adequado. Usar limites de interface legíveis e manter compatibilidade com ajustes adicionais do navegador.
3. Oferecer foco em um bloco de texto, com acesso fácil aos demais, redução de movimento e leitura por voz. Não esconder pergunta, legenda ou instrução necessária.
4. Mostrar prévia imediata no mesmo trecho, com controles nomeados, teclado, foco visível e estado selecionado. Manter texto e exigência conceitual; alteração de fonte não simplifica automaticamente a linguagem.
5. Oferecer desfazer e restaurar padrão, sem apagar respostas ou progresso. Não recarregar a atividade nem iniciar cronômetro ao ajustar.
6. Usar “Lembrar preferências neste navegador” como escolha explícita, especialmente em dispositivos compartilhados. Informar que isso não sincroniza dispositivos. Não inferir condição nem coletar dados clínicos.

## Circuito — experimentar e escolher
Abrir preferências → ler trecho → alterar um ajuste → comparar conforto e facilidade percebida → escolher ou desfazer → continuar na mesma atividade.

Não transformar a comparação em teste diagnóstico ou competição de velocidade. Releitura do mesmo trecho envolve familiaridade; uma mudança de tempo ou acerto não prova efeito causal da fonte. Distinguir preferência declarada, observação pedagógica e resultado de pesquisa.

**Texto de orientação para o estudante:**
“Cada pessoa pode preferir uma forma de ler. Experimente fontes, tamanhos e espaçamentos e escolha o que fica mais confortável. Você pode mudar ou restaurar o padrão a qualquer momento.”

**Explicação opcional sobre fontes associadas à dislexia:**
“Algumas fontes foram desenhadas pensando em leitores com dislexia. Elas são uma opção para experimentar; não há uma fonte que funcione melhor para todas as pessoas. Escolher uma fonte não identifica uma condição.”

Não criar botões “Você tem dislexia” ou “Fonte para TDAH”. Explicar o propósito de um recurso sem associar seu uso a um rótulo pessoal. As fontes pesquisadas não sustentam afirmar que uma família tipográfica trata TDAH ou dislexia.

## Acesso dentro da identidade visual
Preferências de leitura têm prioridade sobre a aparência expressiva da AIES. Manter estrutura, navegação, símbolos D/R/E/L e conteúdo ao simplificar a apresentação. Não depender de texto desenhado em imagem para comandos ou explicação essencial.

Fórmulas, índices, expoentes, radicais, unidades, código e símbolos precisam de renderização apropriada e equivalentes acessíveis. Não forçar uma fonte de prosa sobre notação se isso eliminar glifos ou deslocar relações. Conferir português, acentos, letras e algarismos.

## Dialética — critérios de verificação
Ponto cego: presumir que a etiqueta “fonte para dislexia” garante melhor compreensão. Revisão: oferecer escolha individual, explicar os limites e manter ensino e apoios pedagógicos.

Antes de entregar:
- Conferir que a família selecionada realmente está sendo usada, ou informar fallback.
- Testar teclado, leitor de tela, ampliação e celular; controles com rótulos.
- Conferir conteúdo sem cortes, sobreposição ou perda de função após mudanças de fonte e espaçamento.
- Testar a tolerância aos valores do WCAG 1.4.12: entrelinha 1,5; espaço após parágrafos 2 vezes o tamanho da fonte; letras 0,12 em; palavras 0,16 em, aplicados em conjunto. São condições de tolerância a ajustes, não um padrão universal a impor ao leitor.
- Conferir texto ampliado, navegação, fórmulas e diagramas com descrições.
- Confirmar que restaurar aparência preserva respostas e progresso.
- Testar persistência somente se implementada e autorizada pela escolha do usuário.

O WCAG 1.4.12 não obriga um painel próprio; o painel é uma decisão deste projeto. Um painel isolado também não certifica conformidade integral com WCAG.

## Fundamentação consultada e limites
Fontes consultadas em 28/10/2026:
- W3C/WAI. Presentation — distinguishing and understanding. https://www.w3.org/WAI/people-use-web/tools-techniques/presentation/ . Sustenta apresentação ajustável conforme necessidades individuais.
- W3C/WAI. Understanding SC 1.4.12: Text Spacing. https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html . Explica tolerância a ajustes sem perda de conteúdo ou função.
- The effect of a specialized dyslexia font, OpenDyslexic, on reading rate and accuracy. Registro/resumo e trechos recuperados na pesquisa: https://pubmed.ncbi.nlm.nih.gov/26993270/ . O estudo não encontrou melhora nas tarefas e participantes examinados; não generalizar para toda preferência individual.
- Dyslexie font does not benefit reading in children with or without dyslexia. Resumo recuperado: https://pubmed.ncbi.nlm.nih.gov/29204931/ . Os experimentos não demonstraram vantagem de velocidade ou precisão frente às fontes comparadas. A abertura direta dos registros de pesquisa encontrou verificação do navegador; não declarar leitura integral desses artigos.

Esses resultados justificam não prometer superioridade universal de fontes especializadas. A proposta pedagógica é permitir acesso e escolha, sem atribuir efeito clínico ou eficácia cognitiva garantida.
