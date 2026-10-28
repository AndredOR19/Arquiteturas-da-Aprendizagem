# Laboratório de simulações das Arquiteturas

Versão 0.1.0. Autoria das arquiteturas: Prof. André de Oliveira Rodrigues. Desenvolvimento e documentação computacional com apoio do assistente. Finalidade atual: planejamento de pesquisa e rastreabilidade da evolução, sem validação empírica das arquiteturas.

## Usar no GitHub
1. Abra **Actions → Laboratorio de simulacoes → Run workflow** na branch main.
2. Escolha todos, individuos ou turmas. Informe repetições por cenário e semente. O padrão manual é 5.000 repetições; entradas fora do orçamento são recusadas.
3. Abra a execução concluída. O resumo mostra os indicadores principais; os artefatos contêm HTML, gráfico, CSV, JSON, configuração, cobertura das arquiteturas e manifesto. O passo de arquivo aponta o endereço permanente na branch resultados-simulacoes.

Também há execução automática após mudanças no motor, cenários, catálogo de arquiteturas, prompt e registros/produções. Nessa rota, os dois modelos são executados com 1.000 repetições por cenário. Não há execução contínua em segundo plano, horário agendado ou leitura automática de conversas. Uma conversa precisa ser registrada no repositório para entrar nessa cadeia.

## O que já funciona
- Dois modelos de planejamento: participantes independentes e atribuição por turmas. No segundo, a turma é a unidade de inferência, com variação compartilhada explícita no pós-teste.
- Grade configurável de amostra, efeitos negativos/nulos/positivos, perdas, itens e variabilidade entre turmas.
- Validação de entradas, limites de cálculo, sementes estáveis por cenário, teste de integridade e dependências fixadas.
- Relatório com regras determinísticas, gráfico, tabela exata e JSON integral, sem chamadas de IA.
- Inventário automático das arquiteturas cadastradas, com domínio, versão, hashes de fontes e estado de modelagem.
- Arquivo por execução na branch resultados-simulacoes, índice e diferenças das fontes/arquiteturas desde a execução arquivada anterior. As execuções antigas não são substituídas por resultados melhores.

O exemplo inicial de 40.000 estudos em simular.py e resultados.json é preservado como primeira versão do experimento. O laboratório novo usa laboratorio.py; resultados de cada execução ficam em pastas próprias.

## Como a progressão é absorvida
Uma nova arquitetura cadastrada no catálogo pedagógico ou em arquiteturas_externas.json aparece no próximo inventário. Mudanças nas plantas alteram seus hashes e são registradas no histórico de evolução. O inventário distingue documentação, apoio ao planejamento, modelo mecanístico, calibração e validação. Atualmente todas as arquiteturas aguardam formalização mecanística; os dois modelos executáveis são de planejamento.

Resultados sintéticos anteriores tornam-se material de comparação e rastreabilidade. Para modificar um parâmetro, registrar a fonte e a justificativa em nova versão de cenário; repetir o experimento. Não treinar o simulador com suas próprias saídas como se fossem observações de alunos. Resultados empíricos só poderão calibrar modelos após conferência metodológica e preparação de dados adequados; essa integração ainda não está implementada.

A entrada Cabala está no domínio simbólico e filosófico, aguardando o corpus e as regras do autor. Não há simulador cabalístico implementado. Uma futura análise formal pode examinar relações, caminhos, consistência ou consequências de regras explícitas. Seus resultados não serão apresentados como comprovação de afirmações metafísicas, mecanismo cerebral ou eficácia pedagógica.

## Tokens e recursos
O cálculo, o gráfico, os relatórios por regras, o inventário e o arquivo são programas convencionais. Não chamam modelos de linguagem, não solicitam chave OpenAI e usam zero tokens de API de IA. A conversa, a interpretação assistida e alterações de código com IA continuam usando o contexto e os tokens do assistente. Não há percentual de economia medido.

O workflow usa runner padrão ubuntu-24.04, sem máquina ampliada e com timeout de 12 minutos. Artefatos temporários ficam por 14 dias; a cópia versionada permanece na branch de resultados enquanto ela for preservada. Uso de computação e armazenamento segue as condições do GitHub; não confundir ausência de tokens de IA com promessa de custo total sempre zero.

## Execução local
Da raiz do repositório:

```bash
python3 -m pip install -r pesquisa/simulacoes/requirements.txt
python3 pesquisa/simulacoes/testes_lab.py
python3 pesquisa/simulacoes/laboratorio.py --cenario individuos --repeticoes 5000 --semente 20261028
python3 pesquisa/simulacoes/laboratorio.py --cenario turmas --repeticoes 5000 --semente 20261028
```

Para cenário novo, copiar um JSON, documentar o recorte e usar --config CAMINHO. Para conferir um pacote baixado: `python3 pesquisa/simulacoes/laboratorio.py --verificar PASTA`. Hash confere integridade, não autoria certificada ou validade científica. Reproduzir exatamente requer a configuração, sementes, código e versões de ambiente registrados no manifesto.

## Arquivo e permissões
O workflow pode escrever somente conteúdo no mesmo repositório para criar/avançar a branch de resultados. A branch main não recebe resultados por push automático. A execução não usa convites de estudantes, planilhas, dados reais ou segredos do usuário. O token efêmero fornecido pelo GitHub é usado só no passo de arquivo e não é salvo nos relatórios. Mudanças simultâneas na branch são conciliadas sem force-push. Falha no arquivo não é tratada como sucesso; o pacote temporário continua disponível.

O laboratório público aceita somente cenários sintéticos. Arquivar listas ou trajetórias individuais aqui é proibido, mesmo com pseudônimos vinculáveis. As bases privadas e a coleta escolar continuam separadas.

## Fontes técnicas consultadas
- GitHub. Manually running a workflow. https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow
- GitHub. GitHub Actions billing. https://docs.github.com/en/billing/concepts/product-billing/github-actions
- GitHub Actions. Upload artifact. https://github.com/actions/upload-artifact
- OpenAI. Counting tokens. https://developers.openai.com/api/docs/guides/token-counting

Essas fontes sustentam o funcionamento das ferramentas; não validam os modelos pedagógicos. A fundamentação científica e os limites do exercício inicial estão em README.md. Consultar CONTRATO_MODELO.md e ROADMAP.md antes de ampliar o laboratório.
