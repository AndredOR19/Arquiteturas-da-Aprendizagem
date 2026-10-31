# Base docente anual 0.1.1

Fonte: [estrutura.sql](estrutura.sql), índices em [indices.sql](indices.sql), ensaio real em [testar_base.sql](testar_base.sql). [Estado](STATUS.json) e [protocolo funcional](../../../docentes/README.md).

Nove tabelas privadas adicionadas ao schema educacional existente. Elas não concedem acesso público nem criam contas. Todas têm RLS e privilégios de anon/authenticated/service_role retirados. Receptor de estudantes permanece inalterado. Não há endpoints docentes, login, gráficos, importação de arquivos ou rotina de avisos nesta etapa.

O teste de banco executou em transação revertida: mesma identidade de aluno em matrículas 2026 e 2027; professores diferentes com atribuições anuais; recusa de escola/ano/professor divergentes; duas revisões do plano; recusa de aplicação sem confirmação; calendário com dia no ano correto; importação idempotente por hash; observação vinculada à matrícula anual; participante previsto; proposta de replanejamento; aprovação sem revisor e usuário inexistente recusados; acesso anon/authenticated negado. Readback após rollback: zero atribuições, planos, alunos e calendários novos.

O painel futuro precisa de verificação do usuário no servidor e consulta restrita por vínculo ativo/atribuição anual em cada requisição. Solicitação aprovada e papel de gestor exigem revisão do responsável; constraints não comprovam identidade real, regência ou autoridade do revisor. Não autorizar por user_metadata editável, escola livre, ID do cliente ou simples cadastro. Também validar a consistência da solicitação com a atribuição, da referência de plano com o ano e de todas as aulas de uma proposta de junção. Não implementar política universal `authenticated=true`.

Participantes previstos permitem distinguir ausência de registro de execução. Lista e calendário reais precisam ser importados e confirmados antes de qualquer conclusão. Fonte final no relatório do piloto não equivale a histórico de mudanças nem a preferência comprovada. O banco aceita observação docente e percepção declarada para mediação; não produz diagnóstico ou eficácia causal. Indicadores do cliente continuam sujeitos à conferência docente.

As importações futuras deverão preservar histórico, usar recibo/ID/hash e transação, revisar homônimos e distinguir prévia de confirmação. Os planos são revisões, não sobrescritas silenciosas. Notificações exigem implementação e canal/agendamento autorizados; nenhuma foi enviada.
