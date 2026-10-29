# Arquiteturas da Aprendizagem
## Projeto de pesquisa, rede de escolas e prospecção acadêmica
Prof. André de Oliveira Rodrigues • Vacaria, Rio Grande do Sul • 28 de outubro de 2026

### Personalização dos materiais: ampliação definida pelo autor
O projeto incorpora o desenvolvimento e a investigação de materiais didáticos ajustáveis às necessidades de cada estudante, incluindo estudantes neurodivergentes. A aula do professor mantém seu caráter expositivo, sua proximidade e sua mediação; a personalização se concentra no material disponibilizado e em seus recursos de acesso, explicação e interação.

O circuito reúne registros da interação, dificuldades declaradas e insights docentes; produz ajustes locais e documenta seu uso e resultados. O autor denomina o horizonte de opções de “ajuste fino universal”. Essa expressão não significa uniformidade de percurso ou eficácia universal comprovada. Objetivos, benefícios pretendidos, método, relação com os livros e estado técnico constam em [ADAPTACAO_CONTINUA.md](ADAPTACAO_CONTINUA.md).

O primeiro workflow n8n de recebimento final está preparado e testado localmente com simulações; implantação e coleta real pendentes. A extensão a eventos parciais, configurações individuais durante o uso e revisões automáticas será desenvolvida separadamente. Essa ampliação do programa não substitui o recorte acadêmico delimitado abaixo.

### Proposta central
Investigar como materiais digitais que explicitam relações entre conceitos, exemplos e representações podem apoiar a compreensão, a retenção e a aplicação do conhecimento na educação básica. O projeto articula autoria docente, desenvolvimento de software, simulação de cenários e avaliação em contexto escolar.

A proposta tem duas escalas: um estudo delimitado para o mestrado e, como expansão, uma rede colaborativa de escolas. As escolas podem participar da produção e revisão dos instrumentos, da formação docente e da avaliação dos materiais. A participação institucional e a coleta para pesquisa dependem de pactuação própria; a atuação do proponente como professor não constitui autorização de pesquisa.

### Base existente e resultado pretendido
O repositório público Arquiteturas-da-Aprendizagem reúne metodologias, documentação e um laboratório computacional. A execução remota conferida produziu cenários sintéticos por indivíduos e por turmas. Esses cenários ajudam a planejar estudos; não constituem resultados com estudantes nem demonstram eficácia cognitiva. A infraestrutura de coleta possui etapas de implantação pendentes.

O produto proposto para o mestrado é um conjunto educacional replicável: materiais versionados, protocolo de aplicação, instrumentos, documentação técnica e análise do piloto. A ambição da rede é criar condições para replicação em contextos diferentes, com revisão dos resultados e dos limites encontrados.

### Sofia Cog OS como origem tecnológica
O autor esclarece que a referência à Sofia/Sophia Cog OS diz respeito à arquitetura de programação e tratamento de dados desenvolvida também para o Operador Cognitivo. O aproveitamento pretendido inclui organização modular, recuperação de documentos, persistência, processamento e governança. A adequação educacional será objeto de desenvolvimento e avaliação técnica.

### Pedido a uma instituição parceira
Busca-se orientação para delimitar a investigação, revisar instrumentos e procedimentos éticos, acolher a candidatura conforme as regras do programa e avaliar cooperação tecnológica. Recursos para o projeto, admissão no mestrado e bolsa pessoal são solicitações distintas.

Repositório público: https://github.com/AndredOR19/Arquiteturas-da-Aprendizagem


# 1. Pergunta e desenho do mestrado
### Pergunta principal
Em um conteúdo curricular delimitado, uma sequência digital com relações explicativas explícitas, pistas graduadas e retomadas planejadas apresenta resultados de compreensão e retenção diferentes de uma sequência comparável em conteúdo, duração e oportunidades de prática?

### Recorte recomendado
Escolher um componente, uma etapa escolar e uma unidade curricular. A formação do proponente em História e sua atuação em áreas afins favorecem um primeiro recorte em educação ou tecnologias educacionais. Programas de Ensino de Ciências e Matemática exigem uma conexão curricular substantiva com sua área, a ser negociada com a orientação.

Dança, progressão das alternâncias, noções espaciais e cadência textual permanecem como linhas autorais de investigação. O estudo inicial deve selecionar uma intervenção principal; testar simultaneamente todas as arquiteturas dificultaria a interpretação. A proposta de alternância entre hemisférios não será usada como mecanismo comprovado.

### Procedimentos propostos
1. Revisar literatura e documentar a intervenção, os instrumentos e as hipóteses antes da coleta.
2. Fazer avaliação dos materiais com docentes e um ensaio de usabilidade autorizado.
3. Aplicar pré-avaliação, sequência didática e avaliação imediata; planejar retenção após cerca de 14 dias e tarefa de transferência para exemplo novo.
4. Usar comparação ativa, quando viável: os dois percursos recebem ensino adequado, com tempo e conteúdo comparáveis. Definir alocação e critérios antes da aplicação.
5. Registrar fidelidade de aplicação, apoios, faltas e falhas técnicas. Integrar análise quantitativa com relatos docentes e respostas dos participantes.

### Medidas e análise
Desfecho principal proposto: compreensão na avaliação de retenção, com rubrica previamente revisada. Transferência, compreensão imediata, experiência de uso e carga de trabalho docente são medidas secundárias. Tempo de tela, cliques e satisfação não substituem aprendizagem.

Se a intervenção for atribuída por turma, a análise deve considerar essa estrutura. O número de participantes depende de acesso, variabilidade, perdas e desenho; as simulações existentes permitem explorar essas premissas. Um piloto pequeno pode estimar viabilidade e incerteza sem sustentar alegações causais definitivas. Relatar efeitos, intervalos de confiança, perdas e resultados nulos ou negativos.


# 2. Arquitetura tecnológica e reaproveitamento da Sofia
### Levantamento inicial conferido
A especificação Sophia CogOS — Arquitetura Técnica foi localizada, e foram consultados arquivos do software: dependências do aplicativo, orquestrador de atendimento, busca hierárquica, limitador de requisições e adaptador modular. A leitura confirma a existência de código de interface React/TypeScript e integração com Supabase, além de recuperação vetorial e componentes de processamento. Não foi feita auditoria completa nem teste da implantação em produção.

### Composição proposta para o projeto educacional
| Camada | Função no novo projeto | Condição de entrega |
|---|---|---|
| Interface | Material discente, área docente e recursos de acessibilidade | Testar em equipamentos e conexões das escolas |
| Dados privados | Escolas, turmas, matrículas, sessões, respostas e permissões | Isolamento por instituição e testes de acesso |
| Base documental | Currículo, materiais aprovados e protocolos com versão e origem | Recuperação com fonte e regras de atualização |
| Processamento | Correção por rubrica, relatórios e análises reproduzíveis | Critérios explícitos e revisão docente |
| IA com recuperação | Apoio à consulta e preparação docente | Avaliar fidelidade às fontes, abstenção e custo |
| Simulações | Planejamento de amostra e cenários | Dados sintéticos claramente identificados |

### Primeira adaptação técnica
Mapear dependências e licenças; selecionar módulos; definir esquema educacional; criar uma instância de desenvolvimento separada; alimentar um corpus pedagógico aprovado; implementar permissões; validar recuperação e relatórios com dados fictícios. Só depois testar o fluxo autorizado em campo.

O código consultado contém caminhos de busca, contexto e chamadas externas. O reaproveitamento exige revisão dos provedores, dos limites, das instruções e dos registros. A presença de um controle no código não comprova que ele está aplicado corretamente em todas as rotas ou no banco implantado.

### Uso de IA e custo operacional
O laboratório de simulações atual calcula por código sem chamadas a modelos. Uma futura IA que gere respostas e embeddings poderá consumir recursos de inferência, hospedagem e armazenamento. A arquitetura deve medir custo por sessão, usar cache quando apropriado e impor limites. O primeiro piloto pode funcionar sem tutor generativo, mantendo a pesquisa viável enquanto esse módulo é avaliado.


# 3. Rede de escolas e acompanhamento longitudinal
### Expansão por etapas
| Etapa | Escala de planejamento | Evidência para avançar |
|---|---|---|
| Preparação | Equipe do proponente e instituição parceira | Protocolo, infraestrutura e responsabilidades pactuadas |
| Piloto | Uma ou duas escolas, se autorizadas | Coleta íntegra, aplicação viável e instrumentos utilizáveis |
| Replicação | Pequeno conjunto de escolas adicionais | Resultados e dificuldades comparados entre contextos |
| Rede | Expansão definida com a mantenedora | Suporte, orçamento e governança sustentáveis |

As quantidades são propostas de planejamento. Nenhuma escola está apresentada como conveniada ou como local já autorizado. Mais escolas aumentam a diversidade dos contextos, mas também exigem formação, suporte e análise das diferenças entre instituições.

### Dados mínimos
Identificador estável do participante; vínculo escolar por ano; etapa, série e turma; versão do material e do instrumento; momento da avaliação; respostas e rubricas; apoios utilizados; presença; condições de aplicação; status de autorização pertinente. O nome e a chave de correspondência ficam em cadastro privado com acesso restrito.

O mesmo estudante pode ser acompanhado em 2026 e 2027, se houver base e autorização adequadas. A mudança de série é registrada pela matrícula confirmada. Promoção, repetência, transferência e saída não são inferidas pelo calendário. Ausência de medida não equivale a nota zero.

### Responsabilidades e proteção dos participantes
Definir instituição responsável, guarda dos dados, acessos, prazo de conservação e canal de atendimento. A pesquisa com participantes deve seguir o enquadramento ético vigente e os procedimentos definidos com a instituição e seu comitê de ética. Para menores, planejar informação acessível, consentimento dos responsáveis e assentimento conforme o protocolo aplicável. A decisão de participar não deve afetar notas ou o acesso ao ensino. [S26]

O repositório público recebe métodos, código publicável, exemplos sintéticos e resultados agregados após revisão do risco de identificação. Dados pseudonimizados continuam exigindo proteção; não devem ser tratados automaticamente como anônimos. Uma parceria estrangeira exige pactuar acesso e eventual transferência de dados antes do compartilhamento.

### Participação das escolas
Cada escola deve ter um interlocutor docente e um canal de suporte. A devolutiva inclui dificuldades de acesso, resultados de aprendizagem com seus limites e mudanças propostas. O registro técnico também deve permitir identificar quando um problema é de conectividade, instrumento ou implementação.


# 4. Cronograma, recursos e entregas
### Percurso de 24 meses
Os prazos começam com o ingresso e a pactuação institucional; a coleta inicia após as autorizações pertinentes.

| Período | Trabalho principal | Entrega verificável |
|---|---|---|
| Meses 1–3 | Recorte, literatura e orientação | Protocolo e matriz de hipóteses |
| Meses 4–6 | Instrumentos, adaptação técnica e tramitação ética | Materiais revisados e ensaios com dados fictícios |
| Meses 7–10 | Piloto autorizado e revisão operacional | Relatório de viabilidade e qualidade dos dados |
| Meses 11–16 | Aplicação do estudo conforme protocolo | Base privada documentada e registro de desvios |
| Meses 17–20 | Análise e revisão com escolas | Resultados com incerteza e limites |
| Meses 21–24 | Produto, dissertação e divulgação | Pacote replicável e submissão acadêmica |

### Recursos a dimensionar com a instituição
| Item | Unidade de planejamento | Como compor o orçamento |
|---|---|---|
| Laboratórios | Equipamentos utilizáveis por escola | Inventário, manutenção e cotações de reposição |
| Conectividade | Cobertura e simultaneidade por ambiente | Medição local e orçamento de adequação |
| Desenvolvimento | Horas por módulo e função | Escopo, profissional responsável e valor contratado |
| Formação e suporte | Horas por docente e escola | Oficinas, acompanhamento e atendimento |
| Hospedagem e IA | Armazenamento, sessões e consultas | Teste de carga, consumo e limites mensais |
| Pesquisa | Instrumentos, deslocamentos e análise | Plano de campo e regras do financiador |

Não há cotação de equipamentos ou compromisso financeiro neste projeto. O primeiro orçamento deve separar contrapartida já disponível, investimento inicial e manutenção anual. Construir três cenários: uso do laboratório existente; adequação de duas escolas; expansão para rede. O cenário menor precisa produzir uma pesquisa válida mesmo sem financiamento da expansão.

### Entregas e critérios de progresso
Projeto institucional; instrumentos e rubricas; módulos adaptados com testes; manual de aplicação; documentação do uso de IA; relatórios de integridade da coleta; análise do piloto; dissertação e produto educacional. A expansão depende de recursos, suporte e qualidade da execução, além dos resultados pedagógicos. Não se atribui TRL 6/7 à solução educacional sem avaliação documentada.


# 5. Instituições próximas: prioridade de aproximação
Consulta de referência: 28/10/2026. A afinidade indicada é uma avaliação de aderência da proposta, não confirmação de vagas, orientação ou parceria.

### Vacaria: construir a base local
IFRS Campus Vacaria — Coordenação de Pesquisa, Pós-Graduação e Inovação: Jeferson Barp, pesquisa@vacaria.ifrs.edu.br. Contato técnico complementar: Rafhael Rodrigues Cunha, rafhael.cunha@vacaria.ifrs.edu.br. Propor reunião sobre cooperação, infraestrutura e desenvolvimento. A função aqui é parceria local; não há confirmação de mestrado ofertado no campus. [S1–S2]

UERGS, Unidade Vacaria — chefia: Daniela Basso Poletto, daniela-poletto@uergs.edu.br. Propor aproximação para educação, extensão e encaminhamento a grupos de pesquisa. O mestrado em Educação da UERGS deve ser tratado conforme sua sede e edital; não presumir oferta em Vacaria. [S3]

### Caxias do Sul: UCS, Programa de Pós-Graduação em Educação
Secretaria: ppgedu@ucs.br. Docentes com temas próximos: Cristina Maria Pescador, cmpescad@ucs.br, tecnologias e cultura digital; Carla Beatris Valentini, cbvalent@ucs.br, aprendizagem e inclusão; Eliana Rela, erela@ucs.br, formação docente e História. A existência de afinidade não significa disponibilidade para orientação. [S4–S5]

O processo para 2027/1 recebeu inscrições de 21/09 a 14/10/2026, já encerradas nesta data. O resultado final está previsto até 16/11/2026. O contato deve consultar próxima oportunidade ou cooperação, sem pressupor reabertura. Solicitar preço total, dias presenciais e edital de bolsas. [S6]

### Passo Fundo: UPF e IFSul
UPF, PPG em Ensino de Ciências e Matemática: ppgecm@upf.br. A página anuncia inscrições de 07/11/2026 a 04/02/2027, com edital ainda indicado como “em breve”. Confirmar requisitos e adequação do conteúdo do projeto à área do programa. A tabela da turma 2027 informa 24 parcelas de R$ 2.235,73, com reajuste anual; multiplicação nominal sem reajustes: R$ 53.657,52. Há isenções competitivas próprias. [S7–S9]

IFSul, PPGCITED: vg-ppgcited@ifsul.edu.br. Confirmar polo, presencialidade e situação da candidatura/memorial já preparados pelo proponente. A página de seleção remete aos editais do CaVG. Não confundir preparação do memorial com admissão. [S10]

### Lages e Pelotas: alternativas regionais
UNIPLAC, PPGE, Lages: ppge@uniplaclages.edu.br. Programa de Educação com perspectiva interdisciplinar; consultar seleção vigente, agenda, mensalidade e bolsas. [S11]

IFSul, Mestrado Profissional em Educação e Tecnologia, Pelotas: pl-ppgedu@ifsul.edu.br. Curso presencial; considerar deslocamento e oferta do próximo edital antes de priorizar. [S12]


# 6. Rotas internacionais e permanência no Brasil
Um mestrado online oferece uma rota compatível com permanência no Brasil, mas a instituição precisa confirmar defesa, eventuais encontros e autorização para pesquisar em escolas brasileiras. Estudar remotamente não implica aprovação automática do campo de pesquisa.

### Universidade Aberta, Portugal — primeira consulta internacional
Mestrado em Pedagogia do E-learning, em português, por e-learning, com 120 ECTS e percurso de dissertação ou trabalho de projeto. A admissão de diploma estrangeiro depende da apreciação prevista pelo curso. Coordenação: António Moreira Teixeira, antonio.teixeira@uab.pt; vice-coordenação: Teresa Cardoso, teresa.cardoso@uab.pt. [S13–S15]

Tabela 2026/27: propinas totais de € 2.500; candidatura de € 45; matrícula de € 250. Verificar abatimentos e demais condições da tabela antes de somar taxas. Não há bolsa confirmada para este perfil. Perguntar se toda a investigação pode ser conduzida em Vacaria e qual o calendário de candidatura seguinte. [S16]

### Athabasca University, Canadá — pesquisa a distância em inglês
MEd em Open, Digital, and Distance Education, online, 33 créditos, com rota de dissertação ou de disciplinas. Contato: mde@athabascau.ca. Os prazos anuais publicados são 15/01, 15/05 e 15/09, conforme a entrada. Confirmar equivalência do diploma, inglês e disponibilidade de supervisão. [S17–S18]

Para residentes fora do Canadá, a tabela de setembro/2026 a agosto/2027 informa CAD 2.302 por disciplina, CAD 201 de candidatura e CAD 265 de admissão. Onze equivalentes de três créditos somam CAD 25.788 com essas duas taxas, sem reajustes ou despesas adicionais; solicitar cálculo formal para a rota de dissertação. Bolsa para este perfil não confirmada. [S18]

### Outras alternativas online
University of Edinburgh, Reino Unido: Digital Education, MSc online e parcial. Contato acadêmico publicado: digitaled@ed.ac.uk. A página consultada indicou início em janeiro/2027 e prazo de 07/12/2026. Confirmar calendário, custo integral e elegibilidade brasileira para bolsas; não contar com financiamento antes da confirmação. [S19]

University of British Columbia, Canadá: Master of Educational Technology, online. Contatos: met.advising@ubc.ca e met.support@ubc.ca. Consultar compatibilidade entre projeto final e pesquisa com participantes, custo total para residente no Brasil e bolsas. Evitar equiparar automaticamente um curso por disciplinas a um mestrado com dissertação. [S20]

### Alternativas com mudança de país
University of Oulu, Finlândia: Learning, Education and Technology, dois anos, presencial em inglês; candidaturas de 07 a 21/01/2027. Para não europeus, € 10.000/ano; a página anuncia desconto de 10% na propina do segundo ano. Não é bolsa mensal nem cobertura integral. Campo no Brasil exigiria negociação específica. [S21]

University of Twente, Países Baixos: Educational Science & Technology. Contatos: study@utwente.nl e studentservices@utwente.nl. Tratar como rota presencial; consultar equivalência, eventual preparação adicional e possibilidade de campo no Brasil. A bolsa UTS é tratada na página seguinte. [S22–S23]


# 7. Bolsas, financiamento e viabilidade
### Três decisões financeiras diferentes
Bolsa de manutenção do pesquisador, pagamento das mensalidades e financiamento do laboratório são rubricas diferentes. Uma isenção de mensalidade não fornece necessariamente renda; uma bolsa pessoal não equipa automaticamente escolas. Preparar o orçamento de cada candidatura em sua moeda, sem converter valores com câmbio presumido.

| Rota | Valor ou modalidade verificada | Condição decisiva |
|---|---|---|
| CAPES, mestrado no Brasil | R$ 2.100/mês | Seleção e disponibilidade no programa; até 24 meses |
| CAPES, doutorado | R$ 3.100/mês | Etapa futura e regras próprias; não é o ingresso imediato proposto |
| UPF/FUPF | Isenção parcial ou integral de mensalidades | Edital específico e disponibilidade |
| Twente, UTS | € 3.000 a € 22.000 por um ano | Admissão e seleção competitiva; contribuição para custos |
| Oulu, LET | Desconto de 10% na propina do segundo ano | Regras do programa; não cobre manutenção |

Fontes: CAPES [S24–S25], UPF [S9], Twente [S23], Oulu [S21]. O recebimento da bolsa CAPES pelo docente empregado depende das regras aplicáveis e da seleção do programa. Perguntar expressamente sobre vínculo e prioridades, sem presumir acumulação automática.

### Twente: janela e alcance da UTS
A página informa candidatura de 15/10/2026 a 01/04/2027 para ingresso em setembro/2027 e exige encaminhamento da admissão antes da bolsa. O recurso contribui para despesas de estudo; a universidade esclarece que custos como mensalidade não serão pagos separadamente em nome do bolsista. O valor concedido pode não cobrir a soma de curso e vida no exterior. [S23]

### Equipar a rede
Uma instituição parceira pode estruturar propostas para chamadas de pesquisa, extensão e inovação, incluindo oportunidades da FAPERGS e da FINEP quando houver aderência e edital elegível. Essa é uma via de prospecção, não indicação de chamada aberta ou recurso assegurado. Definir quem pode submeter, contrapartidas, propriedade intelectual, itens financiáveis e manutenção após o término do apoio.

### Critério de escolha
Priorizar orientação compatível, execução possível em Vacaria e custo sustentável. Comparar dias presenciais, afastamento do trabalho, proficiência, duração, taxas, bolsa efetivamente concedida e condições para uso do produto. Para diploma estrangeiro, verificar reconhecimento no Brasil antes da matrícula, especialmente para carreira e progressão funcional.


# 8. Proposta breve para primeiro contato
### Versão em português
Assunto: Proposta de pesquisa em tecnologias educacionais e parceria com escolas de Vacaria

Prezada equipe do programa,

Sou André de Oliveira Rodrigues, licenciado em História e professor da rede pública estadual em Vacaria, no Rio Grande do Sul. Desenvolvo as Arquiteturas da Aprendizagem, uma proposta de organização de materiais digitais que articula explicações, relações entre conceitos, pistas graduadas e acompanhamento das atividades.

O projeto já possui documentação e um laboratório computacional no GitHub para simular cenários de planejamento. A etapa que pretendo desenvolver no mestrado é a avaliação de uma intervenção curricular delimitada, com instrumentos revisados, procedimentos éticos e aplicação autorizada em escolas. A expansão futura prevê uma rede colaborativa de escolas e adaptação de componentes de software da Sofia Cog OS para organização documental e tratamento de dados.

Busco orientação para verificar a aderência às linhas do programa e os caminhos de candidatura ou cooperação. Gostaria de saber se há docentes com interesse no tema, quais atividades exigem presença, se o campo pode ser desenvolvido em Vacaria e quais bolsas ou apoios podem ser pleiteados por um professor em exercício.

Posso apresentar o repositório, uma demonstração do laboratório e o projeto de pesquisa. Agradeço a indicação do canal ou docente adequado para essa conversa.

Atenciosamente,
Prof. André de Oliveira Rodrigues
https://github.com/AndredOR19/Arquiteturas-da-Aprendizagem

### English version
Subject: Educational technology research proposal with school-based fieldwork in Brazil

Dear programme team,

My name is André de Oliveira Rodrigues. I hold a teaching degree in History and work in public secondary education in Vacaria, southern Brazil. I am developing Learning Architectures, a framework for digital teaching materials with explicit conceptual relations, graduated support and documented learning activities.

The project has a GitHub repository and a computational laboratory for study-planning simulations. I am seeking a master's research pathway to evaluate a focused curricular intervention through reviewed instruments, ethics approval and authorised school-based fieldwork. A longer-term goal is a collaborative school network supported by adapted software components for document retrieval and data management.

Could you advise on programme fit, potential supervision, admission requirements and funding available to an employed Brazilian teacher? I would also like to confirm whether study and fieldwork could be conducted from Brazil, including any residency, assessment or defence requirements.

I would be glad to share the proposal and demonstrate the computational laboratory.

Kind regards,
André de Oliveira Rodrigues


# 9. Fontes e canais institucionais
Referência temporal: 28/10/2026. Editais, preços, contatos e bolsas devem ser reconferidos antes da candidatura. As referências sustentam as informações institucionais; o desenho de pesquisa é uma proposta para revisão com orientação.

[S1] IFRS Vacaria. Gestão atual, Coordenação de Pesquisa.
https://ifrs.edu.br/vacaria/institucional/gestao-atual/

[S2] IFRS Vacaria. Professores.
https://ifrs.edu.br/vacaria/professores/

[S3] UERGS. Unidade Vacaria.
https://www.uergs.edu.br/vacaria

[S4] UCS. Programa de Pós-Graduação em Educação.
https://www.ucs.br/site/pos-graduacao/formacao-stricto-sensu/educacao/

[S5] UCS. Corpo docente do PPGEdu.
https://www.ucs.br/site/pos-graduacao/formacao-stricto-sensu/educacao/corpo-docente/

[S6] UCS. Seleção do mestrado para 2027/1.
https://www.ucs.br/site/pos-graduacao/formacao-stricto-sensu/educacao/processo-seletivo-mestrado/

[S7] UPF. PPGECM, contato.
https://www.upf.br/ppgecm/contato

[S8] UPF. PPGECM, editais.
https://www.upf.br/ppgecm/editais

[S9] UPF. PPGECM, investimento.
https://www.upf.br/ppgecm/ingresso/investimento

[S10] IFSul. PPGCITED, seleção e contato.
https://ppgcited.cavg.ifsul.edu.br/index.php/selecao/

[S11] UNIPLAC. PPGE, apresentação e contato.
https://ww4.uniplaclages.edu.br/mestrado_educacao/sobre

[S12] IFSul Pelotas. Mestrado Profissional em Educação e Tecnologia.
https://www.pelotas.ifsul.edu.br/ensino/cursos-stricto-sensu/copy_of_mestrado-profissional-em-educacao-e-tecnologia


# Fontes internacionais e financiamento
[S13] Universidade Aberta. Mestrado em Pedagogia do E-learning.
https://guiadoscursos.uab.pt/cursos/mestrado-em-pedagogia-do-e-learning/

[S14] Universidade Aberta. António Moreira Teixeira, página pessoal.
https://paginapessoal.uab.pt/amt

[S15] Universidade Aberta. Teresa Cardoso, página pessoal.
https://paginapessoal.uab.pt/tcardoso

[S16] Universidade Aberta. Tabela de propinas de 2.º e 3.º ciclos, 2026/27.
https://portal.uab.pt/wp-content/uploads/2026/08/2026-2027-Tabela-propinas-de-Cursos-de-2.o-e-3.o-Ciclos.pdf

[S17] Athabasca. MEd, apresentação e contato.
https://www.athabascau.ca/humanities-and-social-sciences/programs/master-of-education-in-distance-education/index.html

[S18] Athabasca. MEd, programa, prazos e taxas 2026/27.
https://www.athabascau.ca/programs/summary/master-of-education-in-open-digital-distance-education.html

[S19] University of Edinburgh. Digital Education, MSc online.
https://study.ed.ac.uk/programmes/postgraduate-taught/106-digital-education-online-learning

[S20] UBC. Master of Educational Technology, contatos e taxas.
https://met.ubc.ca/contact-us/
https://met.ubc.ca/prospective-students/tuition-fees/

[S21] University of Oulu. Learning, Education and Technology.
https://www.oulu.fi/en/apply/masters-learning-education-and-technology

[S22] University of Twente. Educational Science & Technology, contato.
https://www.utwente.nl/en/education/master/programmes/educational-science-technology/contact/

[S23] University of Twente. University of Twente Scholarship.
https://www.utwente.nl/en/education/scholarship-finder/university-of-twente-scholarship/

[S24] CAPES. Valores de bolsas no país.
https://www.gov.br/capes/pt-br/acesso-a-informacao/acoes-e-programas/bolsas/prestacao-de-contas/valores-de-bolsas

[S25] CAPES. Obter bolsa de pós-graduação no país.
https://www.gov.br/capes/pt-br/acesso-a-informacao/acoes-e-programas/carta-de-servicos-ao-usuario/obter-bolsa-de-pos-graduacao-no-pais

[S26] Conselho Nacional de Saúde. Resolução 510/2016, pesquisa em Ciências Humanas e Sociais.
https://www.gov.br/conselho-nacional-de-saude/pt-br/atos-normativos/resolucoes/2016/resolucao-no-510.pdf/view

Autoria das arquiteturas e das propostas: Prof. André de Oliveira Rodrigues. Apoio de IA: organização, pesquisa de fontes, redação e análise técnica preliminar, sujeitos à revisão do proponente e da instituição.


# 10. Rede, autoria e acompanhamento — ampliação de 28/10/2026
A proposta do autor é acelerar a produção e o exame de soluções para necessidades educacionais, articulando software livre sem cobrança de licença, materiais ajustáveis, dados pertinentes das aplicações e relatos dos professores. O núcleo reutilizável poderá ser aberto após seleção de escopo, licenciamento e funcionamento conferido; infraestrutura, manutenção e serviços têm custos a dimensionar.

Preparados [governança de colaboração](GOVERNANCA_COLABORACAO.md), [indicadores e diagramas](PLANO_INDICADORES.md), guia de contribuição e metadados de referência. A autoria de proposição de André de Oliveira Rodrigues é preservada; contribuições de outros participantes devem ser identificadas. A devolutiva de estudos será objeto de adesão/protocolo da rede e não será representada como obrigação automática de todo fork de software livre. Coleta, acesso e circulação de resultados devem ter finalidade e escopo próprios, preservando participantes.

O exame deve aceitar confirmação, limitação e contestação do método ou da aplicação. A preparação documental não confirma novos participantes, resultados, licença adotada ou compartilhamento ativo de dados.
