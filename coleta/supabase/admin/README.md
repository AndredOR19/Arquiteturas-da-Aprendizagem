# Painel administrativo global — primeira fase

Esta pasta contém a primeira versão do painel administrativo da plataforma. Ela é separada da área docente e funciona em modo somente leitura.

A autorização não depende de domínio, nome, papel de gestor escolar ou parâmetro enviado pelo navegador. O endpoint valida a sessão Supabase e consulta `educacional.administradores_plataforma` no servidor.

## Ativação controlada

1. Aplicar a migração `estrutura.sql` no projeto Supabase correto.
2. Criar ou confirmar uma conta Supabase Auth administrada pelo responsável.
3. Inserir explicitamente essa identidade na tabela privada, informando nome e responsável pela concessão.
4. Publicar a função com o slug `painel-admin`.
5. Abrir `admin/` e validar login autorizado e recusa de conta autenticada sem registro.

A inserção do administrador não faz parte da interface pública e não deve ser automatizada por e-mail. Nenhuma ação de escrita é oferecida nesta fase.

## Escopo atual

O painel mostra métricas agregadas, escolas ativas, quantidade de turmas, aulas, professores, sessões, relatórios e solicitações de vínculo pendentes. Não retorna nomes de estudantes nem permite editar, excluir, convidar, alterar notas ou publicar materiais.

A liberação de operações globais exige auditoria imutável, revisão de RLS, confirmação humana e testes de rollback. O painel não deve ser anunciado como acesso total enquanto essas etapas não forem concluídas.
