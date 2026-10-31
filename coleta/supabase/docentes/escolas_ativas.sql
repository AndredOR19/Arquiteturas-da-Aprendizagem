-- Estado institucional: escola desativada não aceita solicitações ou leitura no painel.
alter table educacional.escolas add column ativa boolean not null default true;
