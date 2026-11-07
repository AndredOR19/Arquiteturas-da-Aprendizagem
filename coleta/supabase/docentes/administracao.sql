-- Administração sênior global, com trilha de auditoria e sem exposição ao cliente.
create table if not exists educacional.administradores_plataforma (
 id uuid primary key default gen_random_uuid(),
 auth_user_id uuid unique references auth.users(id),
 email text not null unique check(email=lower(trim(email)) and length(email) between 5 and 254 and email like '%@%'),
 papel text not null default 'administrador_senior' check(papel in ('administrador_senior','administrador')),
 ativo boolean not null default true,
 criado_em timestamptz not null default now(),
 ultimo_acesso_em timestamptz
);
create index if not exists administradores_plataforma_auth_idx on educacional.administradores_plataforma(auth_user_id,ativo);
create table if not exists educacional.auditoria_administrativa (
 id bigint generated always as identity primary key,
 auth_user_id uuid references auth.users(id),
 email text not null,
 acao text not null check(length(trim(acao)) between 2 and 120),
 alvo_tipo text not null check(length(trim(alvo_tipo)) between 2 and 80),
 alvo_id text,
 contexto jsonb not null default '{}'::jsonb check(jsonb_typeof(contexto)='object' and octet_length(contexto::text)<=32768),
 sucesso boolean not null default true,
 criado_em timestamptz not null default now()
);
create index if not exists auditoria_admin_data_idx on educacional.auditoria_administrativa(criado_em desc);
create index if not exists auditoria_admin_actor_idx on educacional.auditoria_administrativa(auth_user_id,criado_em desc);
alter table educacional.administradores_plataforma enable row level security;
alter table educacional.administradores_plataforma force row level security;
alter table educacional.auditoria_administrativa enable row level security;
alter table educacional.auditoria_administrativa force row level security;
revoke all on educacional.administradores_plataforma, educacional.auditoria_administrativa from public, anon, authenticated, service_role;
insert into educacional.administradores_plataforma(auth_user_id,email,papel)
select u.id,lower(u.email),'administrador_senior'
from auth.users u
where lower(u.email) in ('aty.rod@gmail.com','andre-orodrigues@educar.rs.gov.br')
on conflict(email) do update set auth_user_id=excluded.auth_user_id, ativo=true, papel='administrador_senior';
