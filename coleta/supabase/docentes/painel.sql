-- Acesso por e-mail verificado + escopo anual aprovado; sem grant público.
alter table educacional.aulas add column origem_aplicacao text check(origem_aplicacao in ('execucao_estudante','confirmacao_docente'));
create table educacional.autorizacoes_email_docente (
 id uuid primary key default gen_random_uuid(),
 email text not null check(email=lower(trim(email)) and length(email) between 5 and 254 and email like '%@%'),
 professor_id uuid not null,
 escola_id uuid not null,
 ano_letivo integer not null check(ano_letivo between 2000 and 2200),
 turma_id uuid,
 componente text,
 papel text not null check(papel in ('professor','gestor')),
 ativa boolean not null default true,
 expira_em timestamptz not null,
 aprovada_por uuid not null,
 aprovada_em timestamptz not null default now(),
 foreign key(escola_id,professor_id) references educacional.vinculos_professores(escola_id,professor_id),
 foreign key(escola_id,aprovada_por) references educacional.vinculos_professores(escola_id,professor_id),
 foreign key(escola_id,professor_id,turma_id,ano_letivo,componente) references educacional.atribuicoes_docentes(escola_id,professor_id,turma_id,ano_letivo,componente),
 check((papel='professor' and turma_id is not null and componente is not null) or (papel='gestor' and turma_id is null and componente is null)),
 unique nulls not distinct(email,escola_id,ano_letivo,turma_id,componente,papel)
);
create index autorizacoes_email_professor_idx on educacional.autorizacoes_email_docente(escola_id,professor_id,turma_id,ano_letivo,componente);
create index autorizacoes_email_aprovador_idx on educacional.autorizacoes_email_docente(escola_id,aprovada_por);
create table educacional.pareceres_docentes (
 id uuid primary key default gen_random_uuid(),
 escola_id uuid not null,
 professor_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 componente text not null,
 atribuicao_id uuid not null,
 aula_id uuid not null,
 matricula_id uuid not null,
 revisao integer not null check(revisao>=1),
 texto text not null check(length(trim(texto)) between 2 and 20000),
 nota_docente numeric check(nota_docente between 0 and 10),
 revisado boolean not null default false,
 criado_em timestamptz not null default now(),
 foreign key(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente) references educacional.atribuicoes_docentes(id,escola_id,professor_id,turma_id,ano_letivo,componente),
 foreign key(escola_id,turma_id,ano_letivo,aula_id) references educacional.aulas(escola_id,turma_id,ano_letivo,id),
 foreign key(escola_id,turma_id,ano_letivo,matricula_id) references educacional.matriculas(escola_id,turma_id,ano_letivo,id),
 unique(professor_id,aula_id,matricula_id,revisao)
);
create index pareceres_atribuicao_idx on educacional.pareceres_docentes(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente);
create index pareceres_aula_idx on educacional.pareceres_docentes(escola_id,turma_id,ano_letivo,aula_id);
create index pareceres_matricula_idx on educacional.pareceres_docentes(escola_id,turma_id,ano_letivo,matricula_id);
do $$ declare t text; begin foreach t in array array['autorizacoes_email_docente','pareceres_docentes'] loop
 execute format('alter table educacional.%I enable row level security',t);
 execute format('alter table educacional.%I force row level security',t);
 execute format('revoke all on educacional.%I from public, anon, authenticated, service_role',t);
 end loop;end $$;
