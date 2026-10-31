-- Extensão aditiva; nenhum acesso direto ao schema privado é aberto.
alter table educacional.convites add column ambiente text not null default 'producao' check(ambiente in ('teste','producao'));
alter table educacional.sessoes add column convite_id uuid references educacional.convites(id);
create index sessoes_convite_idx on educacional.sessoes(convite_id);
create table educacional.limites_receptor(chave text primary key,quantidade integer not null default 0,criado_em timestamptz not null default now());
alter table educacional.limites_receptor enable row level security;
alter table educacional.limites_receptor force row level security;
revoke all on educacional.limites_receptor from public,anon,authenticated,service_role;
