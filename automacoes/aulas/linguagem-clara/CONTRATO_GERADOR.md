# Contrato de integração — Protocolo de linguagem clara no gerador (Biblioteca de Diagramação)

Versão do contrato: **1.0 (Prompt Mestre 3.9.0, seção 38)** · Data: 09/11/2026
Destino: repositório privado `AndredOR19/Biblioteca-de-Diagramacao`, `estacao/produzir.py` e `estacao/orquestrar_aulas.py` (chamados pela ponte `automacoes/aulas/gerar.py`).

## 1. Situação honesta

- As cinco aulas publicadas em `aulas/` cumprem o protocolo por meio de uma **camada de compatibilidade** (`assets/clareza.js` + `complementos.js` + `aula.js`), que reescreve na tela o texto gerado pela fábrica sem alterar `conteudo.js`, ids, respostas, registros ou PDFs.
- Essa camada **não corrige a fábrica**. Toda aula nova produzida por `estacao/produzir.py` nascerá com os mesmos problemas (rótulos internos D/R/E/L visíveis, comandos abstratos, sem exemplo de outro caso, sem situação em palavras simples) até que este contrato seja implementado **lá** e testado.
- Este repositório não tem acesso de leitura ao repositório privado a partir do ambiente de automação (HTTP 403). Por isso a integração fica registrada como **pendência aberta**; a fábrica **não deve ser declarada integralmente corrigida** enquanto os itens da seção 5 não estiverem concluídos e verificados.

## 2. O que o gerador precisa passar a produzir (por atividade)

Campos a acrescentar em cada tarefa de `routes.principal` e `routes.exemplos` (e equivalentes de `apoio`), **sem remover** os campos atuais:

| Campo | Conteúdo | Regra objetiva (validador) |
|---|---|---|
| `title` | Pergunta ou ação concreta que o estudante entende sozinho | sem jargão (`extrapolar`, `sustentado`, `alcance`, `procedimento`, `operação cognitiva`…); sem D/R/E/L |
| `command` | Começa com verbo de ação ou pergunta (`Coloque…`, `Ligue…`, `Quantos…`), cita os dados do caso, termina com `.`/`?` | `comando_sem_acao`, `pergunta_vazia`, `jargao_no_comando` |
| `situacao` | 2–4 frases em palavras simples contando o caso com os dados que a atividade usa; disponível em áudio | `situacao_ausente` (mínimo 40 caracteres) |
| `exemplo` | `{caso, texto, id}` — mesma operação resolvida com **outro caso/outros dados**; nunca o resultado do próprio item | `exemplo_ausente`, `exemplo_do_proprio_caso` (também quando os operandos são iguais) |
| `rotulos` | Para `match`/`sort`/`order`: textos das perguntas/grupos em linguagem do estudante; o rótulo interno (`Dado observado`…) fica apenas em `facts` | `rotulo_interno_visivel` |
| `glossario` | até 6 termos curriculares da atividade com explicação de uma linha | aviso `palavra_dificil_alem_do_glossario` |
| `visual` | descrição do apoio visual do caso (barras, linha do tempo, medidas) a partir de `facts.dado` | — (revisão humana) |

Sequência obrigatória na tela (pode ser um só painel): **1 · Veja e entenda** (situação + visual) → **2 · Ver exemplo com outro caso** (aberto na primeira atividade do bloco, consultável depois) → **3 · Agora é sua vez** (comando + resposta) → **4 · Conferir minha resposta**. O resultado do **próprio** item só aparece depois da primeira tentativa confirmada (`construcao_conferida` ou `escolha_incorreta`); pistas não ampliam atividades nem alteram a nota.

## 3. Dicionário de referência (gerado a partir das cinco aulas)

`automacoes/aulas/evidencias/linguagem/dicionarios/<aula>.json` contém, por tipo de aula (`survey`, `study`, `history`, `dialogue`, `lab`):

- `perguntas`: tradução dos quatro núcleos D/R/E/L em perguntas do estudante (ex.: `dado` → "📌 Quais foram os números da pesquisa?");
- `rotulos`, `grupos`, `prefixos`, `titulos`, `frases`: tabelas antes → depois usadas pela camada de compatibilidade;
- `situacoes` e `abertura`: moldes da situação por caso e do "Hoje você vai…";
- `glossario`: termos e explicações;
- `antes_depois`: os 128 pares `{id, antes:{title,command}, depois:{title,command}}` de cada aula — servem como **conjunto de exemplos** para o provedor de autoria e como teste de regressão para o gerador.

O gerador deve usar essas tabelas como semente, **não** como cópia literal: aulas novas precisam de situações e exemplos com os dados do próprio caso.

## 4. Como testar a integração (sem este repositório depender da privada)

1. Gerar uma aula de teste pelo orquestrador para um diretório temporário.
2. Rodar `node automacoes/aulas/linguagem_extrair.cjs <dir>` — a aula gerada precisa expor `window.AULA_GEICONTEUDO.plain` (ou os novos campos diretamente em cada tarefa; o extrator aceita os dois caminhos quando `C.plain` existe).
3. Rodar `python3 automacoes/aulas/validar_linguagem.py <dir> --saida /tmp/linguagem` → exigir `bloqueadas 0`.
4. Rodar os testes DOM de clareza (`automacoes/aulas/evidencias/clareza-2/teste.cjs`) apontando para a aula gerada: erro em linha conta como primeira tentativa; gabarito do próprio item oculto antes da tentativa; exemplo de outro caso presente.
5. Só então remover a camada de compatibilidade da aula gerada (ou mantê-la inerte) e registrar no HISTORICO que a fábrica produz aulas conformes à seção 38.

## 5. Pendências que impedem declarar a fábrica corrigida

- [ ] Patch em `estacao/produzir.py` aplicando a seção 2 (campos novos + sequência de tela).
- [ ] `estacao/orquestrar_aulas.py` chamando `validar_linguagem.py` antes de gravar a aula e recusando saída com bloqueios.
- [ ] Teste automatizado na biblioteca privada que falha quando qualquer campo da seção 2 falta.
- [ ] Uma aula nova gerada de ponta a ponta, auditada com `bloqueadas 0`, publicada e observada em sala (`OBSERVACAO_EM_SALA.md`).

Enquanto esses itens estiverem abertos, o estado correto é: **"cinco aulas corrigidas na exibição; fábrica pendente de integração"**.
