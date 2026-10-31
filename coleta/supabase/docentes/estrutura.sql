-- Base docente v0.1.0. Estrutura privada; não ativa cadastro ou painel público.
create table educacional.solicitacoes_vinculo_docente (
 id uuid primary key default gen_random_uuid(),
 auth_user_id uuid not null references auth.users(id),
 escola_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 componente text not null check(length(trim(componente)) between 1 and 120),
 estado text not null default 'pendente' check(estado in ('pendente','aprovada','recusada','cancelada')),
 solicitada_em timestamptz not null default now(),
 revisada_em timestamptz,
 revisada_por uuid,
 foreign key(escola_id,turma_id,ano_letivo) references educacional.turmas(escola_id,id,ano_letivo),
 foreign key(escola_id,revisada_por) references educacional.vinculos_professores(escola_id,professor_id),
 check(estado not in ('aprovada','recusada') or (revisada_em is not null and revisada_por is not null))
);
create unique index solicitacao_docente_pendente_idx on educacional.solicitacoes_vinculo_docente(auth_user_id,escola_id,turma_id,ano_letivo,componente) where estado='pendente';
create index solicitacoes_docentes_escola_idx on educacional.solicitacoes_vinculo_docente(escola_id,estado,solicitada_em);
create index solicitacoes_docentes_revisor_idx on educacional.solicitacoes_vinculo_docente(escola_id,revisada_por);
create index solicitacoes_docentes_turma_idx on educacional.solicitacoes_vinculo_docente(escola_id,turma_id,ano_letivo);

create table educacional.atribuicoes_docentes (
 id uuid primary key default gen_random_uuid(),
 escola_id uuid not null,
 professor_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 componente text not null check(length(trim(componente)) between 1 and 120),
 ativa boolean not null default true,
 confirmada_em timestamptz not null,
 fonte_confirmacao text not null check(length(trim(fonte_confirmacao)) between 2 and 300),
 solicitacao_id uuid references educacional.solicitacoes_vinculo_docente(id),
 foreign key(escola_id,professor_id) references educacional.vinculos_professores(escola_id,professor_id),
 foreign key(escola_id,turma_id,ano_letivo) references educacional.turmas(escola_id,id,ano_letivo),
 unique(escola_id,professor_id,turma_id,ano_letivo,componente),
 unique(id,escola_id,professor_id,turma_id,ano_letivo,componente)
);
create index atribuicoes_docentes_turma_idx on educacional.atribuicoes_docentes(escola_id,turma_id,ano_letivo,componente);
create index atribuicoes_docentes_professor_idx on educacional.atribuicoes_docentes(professor_id,ativa);
create index atribuicoes_docentes_solicitacao_idx on educacional.atribuicoes_docentes(solicitacao_id);

create table educacional.planejamentos_docentes (
 id uuid primary key default gen_random_uuid(),
 plano_id uuid not null default gen_random_uuid(),
 revisao integer not null default 1 check(revisao>=1),
 atribuicao_id uuid not null,
 escola_id uuid not null,
 professor_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 componente text not null,
 aula_id uuid,
 titulo text not null check(length(trim(titulo)) between 2 and 300),
 data_prevista date not null,
 estado text not null default 'rascunho' check(estado in ('rascunho','planejada','aplicada','adiada','cancelada')),
 aplicada_em timestamptz,
 objetivos text not null check(length(trim(objetivos)) between 2 and 10000),
 metodologia text not null check(length(trim(metodologia)) between 2 and 10000),
 avaliacao text not null check(length(trim(avaliacao)) between 2 and 10000),
 habilidades jsonb not null default '[]'::jsonb check(jsonb_typeof(habilidades)='array' and octet_length(habilidades::text)<=32768),
 documentos_base jsonb not null default '[]'::jsonb check(jsonb_typeof(documentos_base)='array' and octet_length(documentos_base::text)<=32768),
 criado_em timestamptz not null default now(),
 foreign key(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente) references educacional.atribuicoes_docentes(id,escola_id,professor_id,turma_id,ano_letivo,componente),
 foreign key(escola_id,turma_id,ano_letivo,aula_id) references educacional.aulas(escola_id,turma_id,ano_letivo,id),
 unique(plano_id,revisao),
 check((estado='aplicada' and aplicada_em is not null) or (estado<>'aplicada' and aplicada_em is null))
);
create index planejamentos_docente_agenda_idx on educacional.planejamentos_docentes(professor_id,data_prevista);
create index planejamentos_atribuicao_idx on educacional.planejamentos_docentes(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente);
create index planejamentos_aula_idx on educacional.planejamentos_docentes(escola_id,turma_id,ano_letivo,aula_id);

create table educacional.participantes_aula (
 escola_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 aula_id uuid not null,
 matricula_id uuid not null,
 situacao text not null default 'previsto' check(situacao in ('previsto','dispensado','transferido')),
 confirmado_por uuid not null,
 confirmado_em timestamptz not null default now(),
 primary key(aula_id,matricula_id),
 foreign key(escola_id,turma_id,ano_letivo,aula_id) references educacional.aulas(escola_id,turma_id,ano_letivo,id),
 foreign key(escola_id,turma_id,ano_letivo,matricula_id) references educacional.matriculas(escola_id,turma_id,ano_letivo,id),
 foreign key(escola_id,confirmado_por) references educacional.vinculos_professores(escola_id,professor_id)
);
create index participantes_aula_matricula_idx on educacional.participantes_aula(escola_id,turma_id,ano_letivo,matricula_id);
create index participantes_aula_confirmador_idx on educacional.participantes_aula(escola_id,confirmado_por);

create table educacional.observacoes_pedagogicas (
 id uuid primary key default gen_random_uuid(),
 atribuicao_id uuid not null,
 escola_id uuid not null,
 professor_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 componente text not null,
 matricula_id uuid not null,
 tipo text not null check(tipo in ('observacao_docente','preferencia_declarada','sinal_descritivo')),
 observacao text not null check(length(trim(observacao)) between 2 and 10000),
 acao_proposta text not null check(length(trim(acao_proposta)) between 2 and 10000),
 estado text not null default 'a_conferir' check(estado in ('a_conferir','em_acompanhamento','revisada')),
 evidencia jsonb not null default '{}'::jsonb check(jsonb_typeof(evidencia)='object' and octet_length(evidencia::text)<=32768),
 criada_em timestamptz not null default now(),
 foreign key(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente) references educacional.atribuicoes_docentes(id,escola_id,professor_id,turma_id,ano_letivo,componente),
 foreign key(escola_id,turma_id,ano_letivo,matricula_id) references educacional.matriculas(escola_id,turma_id,ano_letivo,id)
);
create index observacoes_matricula_idx on educacional.observacoes_pedagogicas(escola_id,turma_id,ano_letivo,matricula_id,criada_em);
create index observacoes_atribuicao_idx on educacional.observacoes_pedagogicas(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente);

do $$ declare t text; begin
 foreach t in array array['solicitacoes_vinculo_docente','atribuicoes_docentes','planejamentos_docentes','participantes_aula','observacoes_pedagogicas'] loop
 execute format('alter table educacional.%I enable row level security',t);
 execute format('alter table educacional.%I force row level security',t);
 execute format('revoke all on educacional.%I from public, anon, authenticated, service_role',t);
 end loop;
end $$;

create table educacional.calendarios_letivos (
 id uuid primary key default gen_random_uuid(),
 escola_id uuid not null references educacional.escolas(id),
 ano_letivo integer not null check(ano_letivo between 2000 and 2200),
 versao integer not null default 1 check(versao>=1),
 titulo text not null check(length(trim(titulo)) between 2 and 300),
 fonte text not null check(length(trim(fonte)) between 2 and 1000),
 sha256 text not null check(sha256 ~ '^[0-9a-f]{64}$'),
 confirmado_por uuid not null,
 confirmado_em timestamptz not null default now(),
 foreign key(escola_id,confirmado_por) references educacional.vinculos_professores(escola_id,professor_id),
 unique(escola_id,ano_letivo,versao), unique(id,escola_id,ano_letivo)
);
create index calendarios_confirmador_idx on educacional.calendarios_letivos(escola_id,confirmado_por);
create table educacional.dias_calendario (
 calendario_id uuid not null,
 escola_id uuid not null,
 ano_letivo integer not null,
 data date not null,
 tipo text not null check(tipo in ('letivo','nao_letivo','evento','reposicao')),
 descricao text not null check(length(trim(descricao)) between 2 and 500),
 primary key(calendario_id,data),
 foreign key(calendario_id,escola_id,ano_letivo) references educacional.calendarios_letivos(id,escola_id,ano_letivo),
 check(extract(year from data)=ano_letivo)
);
create index dias_calendario_escola_idx on educacional.dias_calendario(escola_id,ano_letivo,data);
create table educacional.importacoes_docentes (
 id uuid primary key default gen_random_uuid(),
 atribuicao_id uuid not null,
 escola_id uuid not null,
 professor_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 componente text not null,
 tipo text not null check(tipo in ('chamada','ementa','planejamento','calendario')),
 fonte text not null check(length(trim(fonte)) between 2 and 1000),
 sha256 text not null check(sha256 ~ '^[0-9a-f]{64}$'),
 estado text not null default 'aguardando_conferencia' check(estado in ('aguardando_conferencia','confirmada','recusada')),
 resumo jsonb not null default '{}'::jsonb check(jsonb_typeof(resumo)='object' and octet_length(resumo::text)<=65536),
 recebida_em timestamptz not null default now(),
 confirmada_em timestamptz,
 foreign key(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente) references educacional.atribuicoes_docentes(id,escola_id,professor_id,turma_id,ano_letivo,componente),
 unique(atribuicao_id,tipo,sha256),
 check((estado='confirmada' and confirmada_em is not null) or (estado<>'confirmada' and confirmada_em is null))
);
create index importacoes_contexto_idx on educacional.importacoes_docentes(escola_id,turma_id,ano_letivo,professor_id,estado);
create table educacional.propostas_replanejamento (
 id uuid primary key default gen_random_uuid(),
 atribuicao_id uuid not null,
 escola_id uuid not null,
 professor_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 componente text not null,
 calendario_id uuid,
 motivo text not null check(length(trim(motivo)) between 2 and 10000),
 proposta jsonb not null check(jsonb_typeof(proposta)='object' and octet_length(proposta::text)<=65536),
 estado text not null default 'proposta' check(estado in ('proposta','aprovada','recusada','substituida')),
 criada_em timestamptz not null default now(),
 decidida_em timestamptz,
 foreign key(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente) references educacional.atribuicoes_docentes(id,escola_id,professor_id,turma_id,ano_letivo,componente),
 foreign key(calendario_id,escola_id,ano_letivo) references educacional.calendarios_letivos(id,escola_id,ano_letivo),
 check(estado='proposta' or decidida_em is not null)
);
create index replanejamento_atribuicao_idx on educacional.propostas_replanejamento(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente);
create index replanejamento_calendario_idx on educacional.propostas_replanejamento(calendario_id,escola_id,ano_letivo);
alter table educacional.planejamentos_docentes add constraint planejamento_ano_data check(extract(year from data_prevista)=ano_letivo);
do $$ declare t text; begin
 foreach t in array array['calendarios_letivos','dias_calendario','importacoes_docentes','propostas_replanejamento'] loop
 execute format('alter table educacional.%I enable row level security',t);
 execute format('alter table educacional.%I force row level security',t);
 execute format('revoke all on educacional.%I from public, anon, authenticated, service_role',t);
 end loop;
end $$;
