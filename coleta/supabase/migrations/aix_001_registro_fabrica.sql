-- AIx 001 — registro da fábrica no banco (PREPARADA, NÃO APLICADA)
-- Aplicar somente com autorização docente, via Supabase migrations,
-- seguindo o padrão das 14 migrações já existentes do schema educacional.
-- Reversível: DROP SCHEMA IF EXISTS aix CASCADE;

create schema if not exists aix;

-- Espelho de rastreio dos contratos. O contrato-canônico continua no
-- repositório (aix/experiences/...); aqui ficam metadados e aprovações.
create table if not exists aix.solicitacoes (
  id text primary key,
  texto_original text not null,
  contexto jsonb not null,
  criada_em timestamptz not null default now()
);
create table if not exists aix.experiencias (
  experience_id text primary key,
  schema_version text not null,
  turma text not null,
  componente text not null,
  sha256_contrato char(64) not null,
  blockers jsonb not null default '[]',
  criada_em timestamptz not null default now()
);
create table if not exists aix.aprovacoes (
  id bigint generated always as identity primary key,
  experience_id text not null references aix.experiencias(experience_id),
  sha256_contrato char(64) not null,
  aprovado_por text not null,
  aprovado_em timestamptz not null default now(),
  unique (experience_id, sha256_contrato)
);
create table if not exists aix.publicacoes (
  experience_id text primary key references aix.experiencias(experience_id),
  url text not null,
  sha256_contrato char(64) not null,
  qrcode_path text,
  publicada_em timestamptz not null default now()
);

-- Mesma política de acesso do schema educacional: RLS forçado e NENHUMA
-- policy — acesso negado por padrão; leitura/escrita somente via edge
-- functions com validação própria (padrão coleta-educacional/painel-docente).
alter table aix.solicitacoes enable row level security;
alter table aix.solicitacoes force row level security;
alter table aix.experiencias enable row level security;
alter table aix.experiencias force row level security;
alter table aix.aprovacoes enable row level security;
alter table aix.aprovacoes force row level security;
alter table aix.publicacoes enable row level security;
alter table aix.publicacoes force row level security;
