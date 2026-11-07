# Administração sênior

A entrada está em `docentes/admin/` e aparece na Home como “Administração”. O painel usa Google OAuth ou senha Supabase Auth; autenticação não é autorização. Depois do login, a Edge Function `admin-panel` compara o e-mail e o `auth_user_id` com `educacional.administradores_plataforma`, que atualmente autoriza `aty.rod@gmail.com` e `andre-orodrigues@educar.rs.gov.br` como administradores seniores.

O painel oferece visão agregada de escolas, professores, turmas, alunos, aulas, sessões e relatórios; aprovação/recusa de solicitações docentes; emissão e revogação de convites; recuperação de acesso por link e trilha de auditoria. Convites e links aparecem uma única vez e devem ser enviados por canal privado.

Os indicadores de tempo, sessões, tentativas, pistas e conclusão são descritivos. Tempo é intervalo de recebimentos no servidor; sessão não prova presença; clique não prova compreensão; nenhum gráfico é diagnóstico cognitivo, ranking clínico ou causalidade. A autorização de professores continua anual e limitada a escola, turma e componente.
