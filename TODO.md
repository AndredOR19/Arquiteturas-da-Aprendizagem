# TODO — Painel administrativo seguro

## MVP de leitura global
- [ ] Servir `/admin/` pelo pacote público sem adicionar dados escolares ao catálogo público.
- [ ] Autenticar por Supabase Auth e manter a sessão fora do HTML.
- [ ] Autorizar somente usuários presentes em `educacional.administradores_plataforma`.
- [ ] Exibir métricas globais agregadas e escolas sem nomes de estudantes.
- [ ] Exibir solicitações de vínculo pendentes e estado do sistema.
- [ ] Recusar a operação quando o usuário estiver autenticado, mas não for administrador.
- [ ] Validar a função Edge sem alterar dados reais.

## Fase posterior, deliberadamente bloqueada
- [ ] Auditoria imutável das ações administrativas.
- [ ] Gestão de convites e vínculos.
- [ ] Revisão de políticas RLS e funções protegidas.
- [ ] Ações de escrita com confirmação humana e rollback.
- [ ] Integração com Notion após conexão autorizada.
