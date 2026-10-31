-- Convite administrativo individual; guardar somente hash e data de uso.
alter table educacional.autorizacoes_email_docente add column ativacao_sha256 text check(ativacao_sha256 ~ '^[0-9a-f]{64}$');
alter table educacional.autorizacoes_email_docente add column ativacao_usada_em timestamptz;
create unique index autorizacoes_ativacao_idx on educacional.autorizacoes_email_docente(ativacao_sha256) where ativacao_sha256 is not null;
