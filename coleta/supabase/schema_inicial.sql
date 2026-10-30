-- Base privada v0.1.0. Não é um receptor nem concede acesso ao navegador.
-- Aplicar via migration do Supabase; preservar o identificador remoto em STATUS.json.
create schema educacional;
revoke all on schema educacional from public, anon, authenticated, service_role;
alter default privileges in schema educacional revoke all on tables from public, anon, authenticated, service_role;
alter default privileges in schema educacional revoke all on functions from public, anon, authenticated, service_role;

create table educacional.escolas (
 id uuid primary key default gen_random_uuid(),
 nome text not null check (length(trim(nome)) between 2 and 200),
 criada_em timestamptz not null default now()
);
create table educacional.professores (
 id uuid primary key default gen_random_uuid(),
 auth_user_id uuid unique references auth.users(id),
 nome text not null check (length(trim(nome)) between 2 and 200),
 criado_em timestamptz not null default now()
);
create table educacional.vinculos_professores (
 escola_id uuid not null references educacional.escolas(id),
 professor_id uuid not null references educacional.professores(id),
 papel text not null check (papel in ('professor','gestor')),
 ativo boolean not null default true,
 primary key (escola_id,professor_id)
);
create index vinculos_professor_idx on educacional.vinculos_professores(professor_id);
create table educacional.turmas (
 id uuid primary key default gen_random_uuid(),
 escola_id uuid not null references educacional.escolas(id),
 ano_letivo integer not null check (ano_letivo between 2000 and 2200),
 codigo text not null check (length(trim(codigo)) between 1 and 80),
 etapa text not null check (length(trim(etapa)) between 1 and 80),
 serie text not null check (length(trim(serie)) between 1 and 40),
 unique (escola_id,ano_letivo,codigo),
 unique (escola_id,id,ano_letivo)
);
create table educacional.alunos (
 id uuid primary key default gen_random_uuid(),
 nome text not null check (length(trim(nome)) between 2 and 200),
 criado_em timestamptz not null default now()
);
-- Nome não é chave. Matrícula registra vínculo anual sem presumir promoção.
create table educacional.matriculas (
 id uuid primary key default gen_random_uuid(),
 aluno_id uuid not null references educacional.alunos(id),
 escola_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 codigo_interno text not null check (length(trim(codigo_interno)) between 1 and 80),
 confirmada_em timestamptz not null,
 fonte_confirmacao text not null check (length(trim(fonte_confirmacao)) between 1 and 200),
 foreign key (escola_id,turma_id,ano_letivo) references educacional.turmas(escola_id,id,ano_letivo),
 unique (escola_id,turma_id,ano_letivo,aluno_id),
 unique (escola_id,turma_id,ano_letivo,codigo_interno),
 unique (escola_id,turma_id,ano_letivo,id)
);
create index matriculas_aluno_idx on educacional.matriculas(aluno_id);
create table educacional.aulas (
 id uuid primary key default gen_random_uuid(),
 escola_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 professor_id uuid not null,
 artefato_id text not null check (length(trim(artefato_id)) between 1 and 200),
 versao text not null check (length(trim(versao)) between 1 and 80),
 componente text not null check (length(trim(componente)) between 1 and 120),
 titulo text not null check (length(trim(titulo)) between 1 and 300),
 data_planejada date not null,
 aplicada_em timestamptz,
 registro_planejado text not null,
 habilidades jsonb not null default '[]'::jsonb check (jsonb_typeof(habilidades)='array'),
 percursos_total integer not null check (percursos_total between 1 and 500),
 coleta_ativa boolean not null default false,
 foreign key (escola_id,turma_id,ano_letivo) references educacional.turmas(escola_id,id,ano_letivo),
 foreign key (escola_id,professor_id) references educacional.vinculos_professores(escola_id,professor_id),
 unique (escola_id,turma_id,ano_letivo,id)
);
create index aulas_professor_idx on educacional.aulas(escola_id,professor_id,data_planejada);
create table educacional.sessoes (
 id uuid primary key default gen_random_uuid(),
 escola_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 aula_id uuid not null,
 matricula_id uuid not null,
 ambiente text not null check (ambiente in ('teste','producao')),
 iniciada_em timestamptz not null default now(),
 ultimo_recebimento_em timestamptz,
 estado text not null default 'em_andamento' check (estado in ('em_andamento','atividades_concluidas','avaliacao_pendente','concluida')),
 foreign key (escola_id,turma_id,ano_letivo,aula_id) references educacional.aulas(escola_id,turma_id,ano_letivo,id),
 foreign key (escola_id,turma_id,ano_letivo,matricula_id) references educacional.matriculas(escola_id,turma_id,ano_letivo,id),
 unique (escola_id,id)
);
create index sessoes_aula_idx on educacional.sessoes(escola_id,turma_id,ano_letivo,aula_id);
create index sessoes_matricula_idx on educacional.sessoes(escola_id,turma_id,ano_letivo,matricula_id);
create table educacional.eventos (
 id uuid primary key, -- ID estável do cliente para reenvio idempotente.
 escola_id uuid not null,
 sessao_id uuid not null,
 sequencia bigint not null check (sequencia >= 0),
 tipo text not null check (tipo in ('inicio','tentativa','pista','consulta','reformulacao','audio','visibilidade','tempo','conclusao_etapa','avaliacao','fim')),
 ocorrido_em_cliente timestamptz not null,
 recebido_em timestamptz not null default now(),
 dados jsonb not null check (jsonb_typeof(dados)='object' and octet_length(dados::text)<=16384),
 foreign key (escola_id,sessao_id) references educacional.sessoes(escola_id,id),
 unique (sessao_id,sequencia)
);
create index eventos_sessao_idx on educacional.eventos(escola_id,sessao_id,recebido_em);
create table educacional.relatorios (
 id uuid primary key,
 escola_id uuid not null,
 sessao_id uuid not null,
 revisao integer not null check (revisao>=1),
 sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
 recebido_em timestamptz not null default now(),
 percursos_total integer not null check (percursos_total between 1 and 500),
 percursos_concluidos integer not null,
 acertos_iniciais integer not null check (acertos_iniciais>=0 and acertos_iniciais<=percursos_total),
 experiencia_confirmada boolean not null check (experiencia_confirmada),
 experiencia_preenchida boolean not null check (experiencia_preenchida),
 nota_indicador numeric generated always as (round(acertos_iniciais::numeric/percursos_total*10,1)) stored,
 origem_nota text not null default 'cliente_nao_validada' check (origem_nota='cliente_nao_validada'),
 conteudo jsonb not null check (jsonb_typeof(conteudo)='object' and octet_length(conteudo::text)<=2097152),
 texto text not null check (length(texto)>0 and octet_length(texto)<=2097152),
 foreign key (escola_id,sessao_id) references educacional.sessoes(escola_id,id),
 check (percursos_concluidos=percursos_total),
 unique (sessao_id,revisao)
);
create index relatorios_sessao_idx on educacional.relatorios(escola_id,sessao_id,recebido_em);
-- Convites individuais futuros: armazenar somente hash, nunca o segredo bruto.
create table educacional.convites (
 id uuid primary key default gen_random_uuid(),
 escola_id uuid not null,
 turma_id uuid not null,
 ano_letivo integer not null,
 aula_id uuid not null,
 matricula_id uuid not null,
 segredo_sha256 text not null unique check (segredo_sha256 ~ '^[0-9a-f]{64}$'),
 expira_em timestamptz not null,
 revogado_em timestamptz,
 criado_em timestamptz not null default now(),
 foreign key (escola_id,turma_id,ano_letivo,aula_id) references educacional.aulas(escola_id,turma_id,ano_letivo,id),
 foreign key (escola_id,turma_id,ano_letivo,matricula_id) references educacional.matriculas(escola_id,turma_id,ano_letivo,id)
);
create index convites_aula_idx on educacional.convites(escola_id,turma_id,ano_letivo,aula_id);
create index convites_matricula_idx on educacional.convites(escola_id,turma_id,ano_letivo,matricula_id);

-- Negação por padrão. Sem políticas/grants para o cliente nesta etapa.
do $$ declare t record; begin
 for t in select tablename from pg_tables where schemaname='educacional' loop
  execute format('alter table educacional.%I enable row level security',t.tablename);
  execute format('alter table educacional.%I force row level security',t.tablename);
 end loop;
end $$;
revoke all on all tables in schema educacional from public, anon, authenticated, service_role;
revoke all on all functions in schema educacional from public, anon, authenticated, service_role;
