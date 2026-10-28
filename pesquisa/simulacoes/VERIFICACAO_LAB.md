# Conferência do laboratório 0.1.0

Data: 28/10/2026. Prompt 2.11.0, catálogo pedagógico 1.4.0. Separar os estados abaixo de validação científica.

## Local
Quatorze testes passaram: validação dos cenários; números/JSON inválidos; limite de cálculo; Welch conferido contra SciPy; sementes/reprodução; invariância à ordem da grade; cenário nulo e sinais dos efeitos; turma como unidade de inferência; perdas; pacote/HTML/integridade; inventário com domínio simbólico separado; identificação de fontes/arquiteturas alteradas; arquivo em branch separada e recusa de arquivo inesperado, com API GitHub simulada.

Executados os dois cenários completos com 1.000 réplicas por combinação: 24 combinações individuais e 16 por turmas, total 40.000 estudos sintéticos. Gerados JSON, CSV, Markdown, HTML, gráficos e manifestos; integridade conferida e os dois gráficos inspecionados. Inventário inclui as 18 entradas pedagógicas existentes e a entrada Cabala pendente de corpus/formalização, sem módulos mecanísticos ou validação empírica.

Validador pedagógico conferiu 18 registros/15 ramos e compatibilidade com prompt 2.11.0. Validador do diário conferiu nove registros e onze produções. YAML do workflow e passagem de entradas por variáveis de ambiente revisados. Nenhuma chamada a API de IA no motor ou nos testes.

## GitHub
Execução real conferida com sucesso: https://github.com/AndredOR19/Arquiteturas-da-Aprendizagem/actions/runs/40701331247

Commit-fonte executado: cb07d00c4e7c214675a7678899581c79a7571f71. Os dois jobs, executar individuos e executar turmas, concluíram instalação, testes, cálculo, upload de artefatos e arquivo em branch separada com sucesso. Resultados lidos novamente pelo conector: 24 cenários individuais e 16 por turmas, 1.000 réplicas cada, 40.000 estudos sintéticos ao todo; contagens de válidas/inválidas coerentes. Manifestos registram zero chamadas a IA, commit correto e nove arquivos com hashes, além do próprio manifesto.

O índice laboratorio/indice.json na branch resultados-simulacoes contém as duas execuções e o inventário de 19 arquiteturas. As pastas arquivadas são execucoes/40701331247-1-individuos e execucoes/40701331247-1-turmas. Ambas conservam resultados, configuração, gráfico, relatório e snapshot do inventário; também há histórico de diferenças. Foram conferidos os dois artefatos temporários no run e os arquivos JSON versionados. A primeira entrada registra as fontes novas; a segunda reconhece que elas não mudaram. Não houve sobrescrita da primeira execução pela segunda.

O registro desta conferência é documental e pode usar skip ci para evitar repetição sem mudança no motor. Código, workflow e parâmetros já executados permanecem identificados pelo commit-fonte acima. A execução pelo botão manual está configurada no mesmo workflow; nesta sessão foi verificada a rota automática por push, não um clique manual.

## Limites
Sem dados reais, calibração empírica, modelo mecanístico de aprendizagem ou modelo da Cabala. O inventário registra evolução documental, sem inventar regras novas ou aprender mecanismos autonomamente. A comparação de mudanças usa a execução arquivada anterior, que pode ter cenário diferente; o tipo/configuração de cada execução permanece identificado. Hash confere integridade, sem certificação científica. Recursos e retenção seguem as condições do GitHub.
