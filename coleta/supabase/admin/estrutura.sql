-- Administradores globais da plataforma. Nenhuma conta é incluída automaticamente.
create table if not exists educacional.administradores_plataforma (
  auth_user_id uuid primary key references auth.users(id) on delete restrict,
  nome text not null check(length(trim(nome)) between 2 and 200),
  ativo boolean not null default true,
  concedido_em timestamptz not null default now(),
  concedido_por uuid references auth.users(id),
  revogado_em timestamptz,
  check((ativo and revogado_em is null) or (not ativo))
);

alter table educacional.administradores_plataforma enable row level security;
alter table educacional.administradores_plataforma force row level security;
revoke all on educacional.administradores_plataforma from public, anon, authenticated, service_role;

comment on table educacional.administradores_plataforma is 'Allowlist explícita para administração global; gerenciada por migração/SQL privado, nunca por parâmetro do navegador.';
