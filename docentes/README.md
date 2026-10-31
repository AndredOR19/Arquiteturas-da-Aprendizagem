# Área docente — escola, ano letivo, turma e componente

Diretrizes do Prof. André de Oliveira Rodrigues, 31/10/2026. **Área docente inicial implementada:** login por e-mail autorizado e convite administrativo, autorização anual, monitoramento por professor/escola, importação CSV da chamada com prévia, impressão e parecer revisável. **Nenhum docente real foi autorizado automaticamente.** Integração direta de IA, upload de calendário/ementa, avisos e tendências longitudinais ainda pendentes. Consultar [estado](../coleta/supabase/docentes/STATUS.json). O portal público reúne aulas; o painel docente será restrito.

## Identidade que permanece, vínculos que mudam

Aluno possui um identificador estável; matrícula registra escola, ano letivo, série e turma. Professor possui identidade própria; atribuição registra escola, ano, turma e componente. 2027 recebe novos vínculos sem sobrescrever 2026. Não presumir aprovação, troca de turma, regência ou acesso por mudança de ano. Não juntar pessoas apenas por nome. Homônimos, códigos diferentes e dados incompletos exigem conferência privada.

## Jornada docente

Ativação por convite e login → solicitação de vínculo → responsável autorizado confere escola/turma/componente/ano → atribuição liberada → importação da chamada, ementa, planos e calendário → IA prepara prévia e aponta conflitos → professor confirma → cadastro versionado → aula → eventos/relatório → consulta e proposta de replanejamento.

Um professor pode atuar em várias escolas e disciplinas. Cadastro não concede acesso a dados de outra escola/turma; seleção de um campo ou metadado editável do perfil não autoriza nada. O backend deverá conferir usuário autenticado, vínculo ativo e atribuição anual em cada operação. Gestor somente vê a escola para a qual tem papel autorizado. Não expor chaves administrativas a professores, alunos ou suas IAs.

## Acompanhamento e expansão do painel

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

O professor fornece sua lista em ambiente restrito, com nome, código interno, turma, série, escola e ano. A IA prepara o mapeamento para o serviço autorizado, valida duplicações/homônimos e pede conferência das correspondências. Aluno novo recebe ID; aluno existente reutiliza ID confirmado e ganha matrícula anual. A importação CSV atual deduplica pelo vínculo anual/código e pelos participantes da aula, valida tudo em transação e preserva conflitos para revisão. O manifesto de importação por hash/ID permanece disponível para a futura integração documental completa. Lista incorreta não apaga matrículas antigas. O professor responde pela confirmação do vínculo e da fonte.

Calendário e ementa também entram por fonte/versão e escopo anual. A IA pode extrair e sugerir; documento ausente, ilegível ou ambíguo permanece pendente. Upload, extração, confirmação e aplicação são estados diferentes. A IA não recebe acesso ao banco por ler este GitHub: precisará de uma integração autenticada com escopo do professor, ainda a implementar.

## Cronograma flexível, com registro

Data prevista não prova aplicação. Depois de cada aula, o professor confirma realizada, adiada ou cancelada. Em dia sem confirmação, o sistema deverá dizer “aplicação não confirmada”, sem afirmar que a aula não ocorreu. Dias não letivos não contam como atraso automaticamente. Avisos exigem rotina agendada e canal autorizados; nenhum aviso foi criado/enviado nesta etapa.

A IA poderá propor uma nova sequência, informando objetivo/habilidade preservados, pré-requisitos, aulas de origem, conteúdos combinados/adiados e motivo. O professor aprova ou ajusta; a revisão anterior permanece. Não comprimir conteúdo apenas para igualar datas, mudar critérios ou denominadores de uma atividade em andamento, nem sobrescrever respostas já recebidas.

## Público e restrito

No GitHub: arquiteturas, modelos vazios, metadados de aulas e planos gerais autorizados sem dados pessoais. No banco privado: contas/vínculos, chamada, matrículas, notas, preferências individuais, observações e planos reservados. O portal não revela listas ou gráficos nominais. PEI preenchido não é conteúdo público. Consulte [protocolo para IAs](PROTOCOLO_IA.md).

## Acesso inicial e escola

A página `docentes/area/` usa Supabase Auth: o professor recebe um convite administrativo individual para seu e-mail aprovado, ativa a conta com senha própria e entra. Uma conta já confirmada também pode solicitar novo vínculo. Para liberar dados, o responsável precisa aprovar o e-mail em `autorizacoes_email_docente`, vinculado à identidade docente, escola, ano e atribuição. O gestor recebe leitura da escola/ano autorizado; edição de notas/pareceres/planos exige atribuição docente. Domínio educar, e-mail da conta de IA ou convite de colaborador GitHub não concedem acesso ao banco por si sós. Convites GitHub protegem código; autorização escolar fica no banco privado. Não publicar a lista de e-mails.

A primeira tentativa válida de produção recebida marca a aula como dada, com `origem_aplicacao=execucao_estudante`; simples entrada não marca. Todos os alunos continuam com seus estados próprios. A data é de recebimento no servidor, não comprovação de aula presencial naquela hora. Modo teste não altera esse registro. Registro docente anterior não é sobrescrito.

A tabela imprime indicador e nota docente separadamente, mantém ausência como ausência e usa pareamento aluno/aula no recorte. O parecer é rascunho por regras, baseado nos registros; pode ser alterado e salvo em nova revisão pelo professor. A nota docente só aparece como revisada após confirmação humana. Não há uso de modelo de IA ou envio automático de parecer para terceiros.

## Ativação sem custo de SMTP

O envio padrão Supabase Auth é limitado a endereços da equipe do projeto; por isso, a primeira ativação operacional não depende desse envio. O responsável aprova e-mail/escopo e emite um segredo individual, do qual só o hash é guardado. O professor recebe esse segredo por canal privado confirmado pelo responsável e o usa uma vez para criar a senha própria da plataforma. O servidor cria a conta Auth confirmada com base nessa validação administrativa do convite; isso não é uma verificação independente da caixa postal. O domínio do e-mail não concede autorização.

Não publicar códigos nem endereços na colaboração GitHub. Um convite GitHub pode motivar o cadastro administrativo, mas é preciso confirmar o e-mail e o escopo escolar no banco privado. Ativação não altera senha de conta já existente. Código expirado, utilizado ou revogado é recusado. Troca de e-mail/identidade exige revisão administrativa. Nenhum convite real foi emitido nesta entrega; fornecer e-mails e contexto anual ao responsável para liberação.
