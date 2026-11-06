# Painel administrativo seguro — Arquiteturas da Aprendizagem

## Objetivo
Criar uma área administrativa global, separada da área docente, com autenticação Supabase e autorização server-side por uma tabela explícita de administradores da plataforma.

## Entrega desta fase
- Rota pública `/admin/` servida pelo GitHub Pages.
- Login com a mesma autenticação Supabase existente.
- Endpoint Edge dedicado, sem confiar em papel enviado pelo navegador.
- Visão global somente leitura: escolas, professores, turmas, aulas, sessões, relatórios e solicitações pendentes.
- Lista resumida de escolas e pendências de vínculo.
- Nenhum nome individual de estudante retornado no painel inicial.
- Nenhuma exclusão, alteração de nota, alteração de vínculo ou publicação automática.

## Segurança
A autorização será feita pelo endpoint usando o usuário autenticado e a tabela `educacional.administradores_plataforma`. O navegador recebe apenas dados agregados necessários à operação. A ativação de um administrador exige inserção administrativa explícita no banco e não será inferida por domínio de e-mail.

## Estrutura
- `admin/index.html`: tela e conteúdo acessível.
- `admin/admin.css`: estilo compatível com a área docente.
- `admin/admin.js`: login, carregamento e renderização sem inserir HTML vindo do banco.
- `coleta/supabase/admin/estrutura.sql`: migração da tabela de administradores.
- `coleta/supabase/admin/index.ts`: função Edge de leitura administrativa.
- `coleta/supabase/admin/README.md`: procedimento de ativação e limites.

## Próxima fase
Depois da revisão da primeira versão: auditoria de ações, gestão de convites, revisão das políticas RLS, edição de vínculos e integração com Notion. Nenhuma dessas ações será habilitada apenas por existir na interface.

## Direção visual
- **Opção A — Escola de caminhos silenciosa (0,62):** continuidade direta do portal existente, verde profundo, papel claro, serifas editoriais e painéis de trabalho.
- **Opção B — Sala de controle documental (0,21):** mais compacta, tipográfica e orientada a filas.
- **Opção C — Quadro operacional de alto contraste (0,17):** mais utilitária, com indicadores destacados.

Escolha: **Escola de caminhos silenciosa**. O painel deve parecer parte do mesmo projeto, mas comunicar claramente que é uma área restrita e operacional.

Princípios: privacidade por padrão, escopo explícito, leitura antes de mutação e linguagem descritiva sem inferir desempenho pedagógico.
