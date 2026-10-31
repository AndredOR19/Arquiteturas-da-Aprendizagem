# Base docente anual e painel 0.2.0

Fonte: [estrutura.sql](estrutura.sql), índices em [indices.sql](indices.sql), ensaio real em [testar_base.sql](testar_base.sql). [Estado](STATUS.json) e [protocolo funcional](../../../docentes/README.md).

Nove tabelas privadas adicionadas ao schema educacional existente. Elas não concedem acesso público nem criam contas. Todas têm RLS e privilégios de anon/authenticated/service_role retirados. O receptor de estudantes marca a execução da aula após primeira tentativa válida de produção, preservando estados individuais e origem do registro. O receptor `painel-docente` valida usuário/e-mail/sessão e autorização anual aprovada; oferece consulta restrita, chamada CSV com prévia, plano diário, parecer versionado e nota docente revisada. O painel tem impressão e gráfico descritivo de participação. A integração direta de IA, importação de calendário/ementa e avisos seguem pendentes.

O teste de banco executou em transação revertida: mesma identidade de aluno em matrículas 2026 e 2027; professores diferentes com atribuições anuais; recusa de escola/ano/professor divergentes; duas revisões do plano; recusa de aplicação sem confirmação; calendário com dia no ano correto; importação idempotente por hash; observação vinculada à matrícula anual; participante previsto; proposta de replanejamento; aprovação sem revisor e usuário inexistente recusados; acesso anon/authenticated negado. Readback após rollback: zero atribuições, planos, alunos e calendários novos.

O painel futuro precisa de verificação do usuário no servidor e consulta restrita por vínculo ativo/atribuição anual em cada requisição. Solicitação aprovada e papel de gestor exigem revisão do responsável; constraints não comprovam identidade real, regência ou autoridade do revisor. Não autorizar por user_metadata editável, escola livre, ID do cliente ou simples cadastro. Também validar a consistência da solicitação com a atribuição, da referência de plano com o ano e de todas as aulas de uma proposta de junção. Não implementar política universal `authenticated=true`.

Participantes previstos permitem distinguir ausência de registro de execução. Lista e calendário reais precisam ser importados e confirmados antes de qualquer conclusão. Fonte final no relatório do piloto não equivale a histórico de mudanças nem a preferência comprovada. O banco aceita observação docente e percepção declarada para mediação; não produz diagnóstico ou eficácia causal. Indicadores do cliente continuam sujeitos à conferência docente.

As importações futuras deverão preservar histórico, usar recibo/ID/hash e transação, revisar homônimos e distinguir prévia de confirmação. Os planos são revisões, não sobrescritas silenciosas. Notificações exigem implementação e canal/agendamento autorizados; nenhuma foi enviada.


## Extensão do painel

[painel.sql](painel.sql) adiciona autorizações privadas por e-mail/ano/escopo e pareceres/nota docente com revisões. [Receptor](receptor/index.ts) usa conexão somente no servidor; a chave de `docentes/area/config.js` é publicável e não tem grant no schema educacional. Cada requisição verifica Supabase Auth, e-mail confirmado, sessão ainda ativa, autorização não expirada, vínculo e atribuição ativos. Gestor monitora a escola/ano, sem ganhar edição docente automaticamente.

Teste HTTP real com usuário fictício: login confirmado, primeira vinculação, outra escola oculta e edição recusada; prévia/importação repetida sem duplicação, aluno sem registro sem nota zero, plano diário e parecer/nota salvos. Teste de execução: entrada sozinha não marca aula; tentativa válida marca uma vez e reenvio não duplica. Testes de navegador e limpeza estão em [STATUS](STATUS.json). Usuário, e-mails e senhas fictícios nunca entram neste Git.

Cadastro nominal de professores/escola aguarda e-mails e escopos aprovados pelo Prof. André. Colaboração GitHub não foi conectada automaticamente à autorização escolar; não há consulta de e-mails privados de colaboradores. O professor pode usar seu e-mail institucional ou outro aprovado, confirmando o endereço no Auth. Entrega de mensagens do provedor e políticas institucionais precisam ser conferidas no uso real.


## Resultado da conferência do painel

Auth e API reais passaram com cadastro fictício. A interface de teste, servida sob a origem autorizada, consultou o serviço real, editou parecer/nota em nova revisão, acionou a rota de impressão simulada (sem papel) e encerrou a sessão. Os testes de UI com receptor simulado cobrem ausência de registro/nota, importação com prévia, escola/ano e celular. Não foi enviado e-mail a docente real nem concedida autorização real.

A confirmação da ferramenta para exclusão definitiva do conjunto de teste expirou. Em vez de repetir a exclusão, foi aplicada alternativa reversível: autorizações e convites fictícios desativados, escolas QA inativas, conta Auth bloqueada e sessões escolares de QA marcadas como teste. Nada desse conjunto aparece no portal público ou nos contextos disponíveis do painel. O conjunto técnico foi preservado no banco restrito; não afirmar que foi apagado. A base histórica anual teve seu teste anterior em rollback normalmente.

Advisor: 23 tabelas com RLS e sem acesso direto ao cliente; aviso INFO pela ausência intencional de policies. Há WARN Auth de proteção contra senhas vazadas, recurso não disponível no plano gratuito usado aqui. A aplicação exige conta ativada por convite administrativo, e-mail autorizado, senha própria da plataforma, sessão ativa e autorização escolar privada; não afirmar equivalência ao SSO institucional nem solicitar a senha do e-mail/IA/GitHub. A entrega do convite deve ocorrer por canal privado confirmado pelo responsável.


## Ativação administrativa sem SMTP

[ativacao.sql](ativacao.sql) guarda hash e uso do convite individual. A ação `ativar` verifica e-mail aprovado, convite não usado/expirado, escola/vínculo ativos e cria a conta via Admin API exclusivamente no servidor. A senha é enviada somente ao Auth; não entra no SQL, logs da aplicação ou repositório. Não modifica senhas existentes. Auth confirma o usuário a partir do convite administrativo, sem afirmar que houve verificação independente da caixa de e-mail. Esta rota evita depender do SMTP padrão, restrito à equipe do projeto. Aprovar o e-mail e entregar o convite por canal privado verificado é responsabilidade administrativa. Não desabilitar globalmente a confirmação de e-mail.

Teste real de ativação administrativa: Admin API criou a conta fictícia sem SMTP; reutilização do convite foi recusada; login e painel autenticado passaram. A segunda conta de QA foi bloqueada e a escola/autorizações de teste desativadas depois da conferência.
