# Arquitetura de Simulações: Interface, Planejamento e Circuitos Quânticos

ID: `simulacoes-quanticas`. Versão: 0.1.0. Data: 29/10/2026.
Proposição e direção do projeto: Prof. André de Oliveira Rodrigues. Formalização, implementação e ensaios assistidos por IA. Domínio do módulo quântico: formal/computacional.

## 1. Âncora conceitual

O laboratório passa a ter três perguntas delimitadas. Quais regras de interface entram em conflito com condições de acesso? Qual a sensibilidade de um futuro estudo sob efeitos assumidos? Que distribuição resulta de um pequeno circuito quântico ideal?

O módulo quântico simula operações quânticas em CPU convencional. Um vetor complexo representa amplitudes de estados; portas transformam esse vetor; o módulo quadrado das amplitudes fornece probabilidades. Ele não prevê trajetórias pessoais, respostas de alunos ou efeitos didáticos por propriedades quânticas. A computação quântica aqui é objeto formal de estudo, separado do modelo de interface e da estatística educacional.

## 2. Mecânica e contrato

### Interface proposta

`ux.py` enumera duas políticas explicitamente hipotéticas: uma leitura restritiva das sugestões recebidas (gesto/áudio/animação/colega obrigatórios e reconhecimento só sem erro) e uma proposta com alternativas. A política restritiva não descreve uma auditoria da Missão Ponte atual nem presume que o parecer tenha exigido essas restrições.

Cada política recebe 192 combinações de cinco condições binárias, três estados de progresso e confirmação ou não da devolutiva. Condições: teclado, ausência de voz, movimento reduzido, ausência de colega e recuperação após erro. São situações de acesso, não diagnósticos. A enumeração tem pesos iguais por conveniência; não representa distribuição de estudantes.

Os conflitos decorrem das regras programadas. Uma política escrita para satisfazer esses requisitos satisfaz a grade por construção; isso não a torna a melhor interface. Os testes de mutação removem uma alternativa por vez e verificam que a respectiva falha reaparece. A regra de conclusão exige todos os 26 percursos e devolutiva confirmada; reconhecer recuperação não modifica a nota da primeira tentativa.

Limites: sem navegador, DOM, tempo de tarefa, percepção de estudantes, leitura por tela ou métrica de aprendizagem. Progresso fixo no topo pode encobrir conteúdo e exige teste de foco/tela pequena. Texto alternativo não garante acesso independente a quem ainda não lê e está sem voz; prever mediação, recursos visuais demonstráveis e dispositivos adequados.

### Planejamento de pesquisa

`experimentos.py` reutiliza `modelos.py`, com 30/60 participantes independentes por grupo, efeitos adicionais assumidos −5/0/+5 pontos na probabilidade de acerto, 20% de perdas aleatórias e 5.000 réplicas por combinação. As demais regras estão na configuração exportada. Não há efeito atribuído a insígnias, HQ ou voz. Os efeitos são hipóteses de sensibilidade e não estimativas de eficácia.

O resultado com efeito assumido +5 tem rejeição bilateral em cerca de 21%/38% das réplicas, para 30/60 por grupo nesta execução. Isso aponta baixa sensibilidade neste desenho específico; não fornece um tamanho amostral universal. Pesquisas por turma devem usar o modelo de turmas, com unidade de inferência coerente e perdas revistas. Ausência de significância não equivale a ausência de benefício.

### Circuitos quânticos

`quantico.py` aceita 1–8 qubits, até 256 portas e 1–100.000 disparos por execução. Estado inicial: todos os qubits em zero. Portas permitidas: H, X, Z, S e CX. A lista é fixa; dados não podem indicar código, serviços ou funções arbitrárias. Os rótulos seguem q(n−1)…q0, com q0 à direita. A norma é conferida após cada porta.

Saídas: amplitudes complexas (pares real/imaginário), probabilidades, contagens, norma por etapa, semente e configuração. A regra de Born usa |amplitude|². Cada disparo amostra a medição final de uma nova preparação do mesmo estado. Não há colapso intermediário, ruído, decoerência, otimização de algoritmos, hardware quântico ou alegação de vantagem de desempenho.

Cinco exemplos: H (superposição), H–H (retorno), H–Z–H (interferência de fase), H–S (fase complexa) e H(0)–CX(0,1) (Bell). No último, 00/11 têm probabilidades 1/2 cada, e 01/10 têm probabilidade zero. Correlação nesse circuito não descreve relações entre pessoas. O espaço de amplitudes cresce como 2ⁿ; o limite de oito qubits é uma decisão de orçamento deste protótipo.

## 3. Circuito de execução

| Entrada | Motor | Saída | Critério de conferência |
| --- | --- | --- | --- |
| Condições de acesso + política | ux.py | Conflitos e conclusão formal | Invariantes e mutações |
| Efeitos e perdas assumidos | modelos.py | Frequências Monte Carlo | Testes estatísticos existentes |
| Portas e qubits | quantico.py | Amplitudes, probabilidades e disparos | Soluções analíticas e norma |

```bash
python -m pip install -r pesquisa/simulacoes/requirements.txt
python pesquisa/simulacoes/testes_experimentos.py
python pesquisa/simulacoes/experimentos.py --saida exportacoes/novo-ensaio
```

A pasta de saída precisa estar vazia. O pacote contém código/configuração com hashes e ambiente. O workflow `conferir-experimentos.yml` executa os mesmos ensaios sem chamadas a IA, com artefato de 14 dias. A execução de referência está em `execucoes/20261029-ux-quantico/`; o manifesto registra o código usado, não um commit ainda inexistente. Novas execuções conservam seus próprios manifestos. Nenhuma coleta é ativada.

## 4. Dialética prática

**Ponto cego:** tratar a coerência do simulador como prova do que ocorrerá na sala, ou usar “quântico” como sinônimo de examinar muitas possibilidades.

**Ação:** declarar a pergunta e o domínio antes de executar; conferir o modelo com casos conhecidos; testar o protótipo real com teclado, celular, voz ausente e movimento reduzido; só depois observar compreensão em exemplo novo e relatos dos estudantes. Mudanças gerais exigem revisão humana e versão explícita.

### Soluções para o próximo protótipo da Missão Ponte

1. Progresso compacto e visível, com espaço reservado e foco não encoberto; alternativa no modo de leitura simples.
2. Conquistas por exploração, revisão e explicação; sem ranking/velocidade e sem alterar a nota.
3. Cartões com imagem, palavra e orientação falada; revelar por toque/teclado, com animação opcional.
4. Efeitos desligados inicialmente; controles independentes de narração, cancelamento e repetição.
5. Troca em duplas opcional, sem nome obrigatório; registro de participação não certifica compreensão.
6. HQ moderno com composição original adequada à idade, preservando D/R/E/L e o acesso por imagens/voz. A estética continua sendo hipótese de design, não prêmio no simulador.

Estado: código de simulação e ensaios implementados. Integração desses novos componentes no HTML da Missão Ponte, adaptação integral dos percursos sem leitura e observação com alunos permanecem pendentes. Os apoios iniciais já publicados são um trabalho distinto.

## Fontes consultadas

- IBM Quantum Learning. *Quantum circuits — Introduction*. https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits/introduction (29/10/2026). Modelo de circuitos e operações matriciais.
- IBM Quantum Documentation. *Statevector*. https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit.quantum_info.Statevector (29/10/2026). Estados complexos, evolução, inicialização e amostragem. O protótipo usa biblioteca padrão Python, sem dependência de Qiskit e sem certificação de equivalência a toda sua API.
- As referências de planejamento estatístico e as premissas prévias permanecem em README.md e CONTRATO_MODELO.md.
