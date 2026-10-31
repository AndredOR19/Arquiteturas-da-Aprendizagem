# Área docente — escola, ano letivo, turma e componente

Diretrizes do Prof. André de Oliveira Rodrigues, 31/10/2026. Base em preparação; **login, painel, importação por IA e avisos ainda não estão disponíveis**. Consultar [estado](../coleta/supabase/docentes/STATUS.json). O portal público reúne aulas; o painel docente será restrito.

## Identidade que permanece, vínculos que mudam

Aluno possui um identificador estável; matrícula registra escola, ano letivo, série e turma. Professor possui identidade própria; atribuição registra escola, ano, turma e componente. 2027 recebe novos vínculos sem sobrescrever 2026. Não presumir aprovação, troca de turma, regência ou acesso por mudança de ano. Não juntar pessoas apenas por nome. Homônimos, códigos diferentes e dados incompletos exigem conferência privada.

## Jornada docente prevista

Login verificado → solicitação de vínculo → responsável autorizado confere escola/turma/componente/ano → atribuição liberada → importação da chamada, ementa, planos e calendário → IA prepara prévia e aponta conflitos → professor confirma → cadastro versionado → aula → eventos/relatório → consulta e proposta de replanejamento.

Um professor pode atuar em várias escolas e disciplinas. Cadastro não concede acesso a dados de outra escola/turma; seleção de um campo ou metadado editável do perfil não autoriza nada. O backend deverá conferir usuário autenticado, vínculo ativo e atribuição anual em cada operação. Gestor somente vê a escola para a qual tem papel autorizado. Não expor chaves administrativas a professores, alunos ou suas IAs.

## O que o futuro painel deve mostrar

| Área | Evidência e apresentação |
|---|---|
| Participação | Participantes previstos, registros recebidos, em andamento e conclusão com recibo; sem registro não significa falta nem não realização |
| Aprendizagem | Primeira resposta, recuperação, tentativas e pistas por item/habilidade, com denominador e versão da aula |
| Preferências | Fonte/layout solicitados, mudanças efetivamente registradas e conforto declarado; não uso e ausência distintos |
| Histórico | Mesmo estudante entre anos, com matrículas e instrumentos separados; troca de professor não transfere acesso automaticamente |
| Planejamento | Ementa, objetivo, habilidade, metodologia, avaliação, data prevista, aplicação confirmada e revisão |
| Calendário | Documento escolar por ano/versão, dias não letivos, eventos e reposições conferidos |
| Replanejamento | Propostas para deslocar, combinar aulas compatíveis, reduzir ou ampliar ritmo, preservar pré-requisitos e registrar aprovação |

Gráficos devem mostrar contagens e denominadores, permitir ver os registros de origem e filtrar escola/ano/série/turma/componente/aula/período. Não gerar diagnóstico, ranking clínico ou causalidade. Fonte escolhida não comprova fonte renderizada; clicar em áudio não comprova escuta. Comparar tarefas diferentes não demonstra melhora causada por um recurso. Destacar padrões descritivos para mediação, sem rótulo definitivo de aluno.

## Importação mediada pela IA do professor

O professor fornece sua lista em ambiente restrito, com nome, código interno, turma, série, escola e ano. A IA prepara o mapeamento para o serviço autorizado, valida duplicações/homônimos e pede conferência das correspondências. Aluno novo recebe ID; aluno existente reutiliza ID confirmado e ganha matrícula anual. Uma importação repetida usa hash e ID de operação para evitar duplicação. Lista incorreta não apaga matrículas antigas. O professor responde pela confirmação do vínculo e da fonte.

Calendário e ementa também entram por fonte/versão e escopo anual. A IA pode extrair e sugerir; documento ausente, ilegível ou ambíguo permanece pendente. Upload, extração, confirmação e aplicação são estados diferentes. A IA não recebe acesso ao banco por ler este GitHub: precisará de uma integração autenticada com escopo do professor, ainda a implementar.

## Cronograma flexível, com registro

Data prevista não prova aplicação. Depois de cada aula, o professor confirma realizada, adiada ou cancelada. Em dia sem confirmação, o sistema deverá dizer “aplicação não confirmada”, sem afirmar que a aula não ocorreu. Dias não letivos não contam como atraso automaticamente. Avisos exigem rotina agendada e canal autorizados; nenhum aviso foi criado/enviado nesta etapa.

A IA poderá propor uma nova sequência, informando objetivo/habilidade preservados, pré-requisitos, aulas de origem, conteúdos combinados/adiados e motivo. O professor aprova ou ajusta; a revisão anterior permanece. Não comprimir conteúdo apenas para igualar datas, mudar critérios ou denominadores de uma atividade em andamento, nem sobrescrever respostas já recebidas.

## Público e restrito

No GitHub: arquiteturas, modelos vazios, metadados de aulas e planos gerais autorizados sem dados pessoais. No banco privado: contas/vínculos, chamada, matrículas, notas, preferências individuais, observações e planos reservados. O portal não revela listas ou gráficos nominais. PEI preenchido não é conteúdo público. Consulte [protocolo para IAs](PROTOCOLO_IA.md).
