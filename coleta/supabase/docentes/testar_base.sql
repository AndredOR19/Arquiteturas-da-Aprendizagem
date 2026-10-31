begin;
do $$
declare
 e uuid:=gen_random_uuid();e2 uuid:=gen_random_uuid();p uuid:=gen_random_uuid();p2 uuid:=gen_random_uuid();t26 uuid:=gen_random_uuid();t27 uuid:=gen_random_uuid();al uuid:=gen_random_uuid();m26 uuid:=gen_random_uuid();m27 uuid:=gen_random_uuid();a26 uuid:=gen_random_uuid();a27 uuid:=gen_random_uuid();pl uuid:=gen_random_uuid();cal uuid:=gen_random_uuid();aula uuid:=gen_random_uuid();n integer;
begin
 insert into educacional.escolas(id,nome) values(e,'Escola fictícia A'),(e2,'Escola fictícia B');
 insert into educacional.professores(id,nome) values(p,'Docente fictício 2026'),(p2,'Docente fictício 2027');
 insert into educacional.vinculos_professores(escola_id,professor_id,papel) values(e,p,'professor'),(e,p2,'professor');
 insert into educacional.turmas(id,escola_id,ano_letivo,codigo,etapa,serie) values(t26,e,2026,'192','EF','9º ano'),(t27,e,2027,'211','EM','1ª série');
 insert into educacional.alunos(id,nome) values(al,'Estudante fictício');
 insert into educacional.matriculas(id,aluno_id,escola_id,turma_id,ano_letivo,codigo_interno,confirmada_em,fonte_confirmacao) values(m26,al,e,t26,2026,'TESTE26',now(),'Fixture'),(m27,al,e,t27,2027,'TESTE27',now(),'Fixture; mudança de série confirmada neste ensaio');
 insert into educacional.atribuicoes_docentes(id,escola_id,professor_id,turma_id,ano_letivo,componente,confirmada_em,fonte_confirmacao) values(a26,e,p,t26,2026,'História',now(),'Fixture'),(a27,e,p2,t27,2027,'História',now(),'Fixture');
 select count(*) into n from educacional.matriculas where aluno_id=al;
 if n<>2 then raise exception 'Histórico anual perdido';end if;
 begin
 insert into educacional.atribuicoes_docentes(escola_id,professor_id,turma_id,ano_letivo,componente,confirmada_em,fonte_confirmacao) values(e,p,t27,2026,'História',now(),'Fixture');
 raise exception 'Atribuição cruzada entre anos aceita';exception when foreign_key_violation then null;end;
 begin
 insert into educacional.atribuicoes_docentes(escola_id,professor_id,turma_id,ano_letivo,componente,confirmada_em,fonte_confirmacao) values(e2,p,t26,2026,'História',now(),'Fixture');
 raise exception 'Atribuição cruzada entre escolas aceita';exception when foreign_key_violation then null;end;
 insert into educacional.planejamentos_docentes(plano_id,revisao,atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente,titulo,data_prevista,objetivos,metodologia,avaliacao) values(pl,1,a26,e,p,t26,2026,'História','Plano de teste','2026-11-01','Objetivo fictício','Método fictício','Avaliação fictícia'),(pl,2,a26,e,p,t26,2026,'História','Revisão de teste','2026-11-03','Objetivo fictício','Método revisto','Avaliação fictícia');
 begin
 insert into educacional.planejamentos_docentes(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente,titulo,data_prevista,objetivos,metodologia,avaliacao) values(a26,e,p,t26,2026,'História','Data errada','2027-01-01','Objetivo','Método','Avaliação');
 raise exception 'Data de outro ano aceita';exception when check_violation then null;end;
 begin
 insert into educacional.planejamentos_docentes(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente,titulo,data_prevista,objetivos,metodologia,avaliacao,estado) values(a26,e,p,t26,2026,'História','Não aplicada','2026-11-01','Objetivo','Método','Avaliação','aplicada');
 raise exception 'Aplicação sem confirmação aceita';exception when check_violation then null;end;
 begin
 insert into educacional.planejamentos_docentes(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente,titulo,data_prevista,objetivos,metodologia,avaliacao) values(a26,e,p2,t26,2026,'História','Professor divergente','2026-11-01','Objetivo','Método','Avaliação');
 raise exception 'Professor sem atribuição aceito';exception when foreign_key_violation then null;end;
 insert into educacional.calendarios_letivos(id,escola_id,ano_letivo,titulo,fonte,sha256,confirmado_por) values(cal,e,2026,'Calendário fictício','Fixture',repeat('a',64),p);
 insert into educacional.dias_calendario(calendario_id,escola_id,ano_letivo,data,tipo,descricao) values(cal,e,2026,'2026-11-02','nao_letivo','Dia fictício sem aula');
 begin
 insert into educacional.dias_calendario(calendario_id,escola_id,ano_letivo,data,tipo,descricao) values(cal,e,2026,'2027-01-01','nao_letivo','Data fora do ano');
 raise exception 'Calendário cruzado aceito';exception when check_violation then null;end;
 insert into educacional.importacoes_docentes(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente,tipo,fonte,sha256) values(a26,e,p,t26,2026,'História','chamada','Fixture',repeat('b',64));
 begin
 insert into educacional.importacoes_docentes(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente,tipo,fonte,sha256) values(a26,e,p,t26,2026,'História','chamada','Fixture repetida',repeat('b',64));
 raise exception 'Importação duplicada aceita';exception when unique_violation then null;end;
 insert into educacional.observacoes_pedagogicas(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente,matricula_id,tipo,observacao,acao_proposta) values(a26,e,p,t26,2026,'História',m26,'preferencia_declarada','Preferiu letra ampliada no ensaio fictício','Conferir preferência em outra atividade');
 begin
 insert into educacional.observacoes_pedagogicas(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente,matricula_id,tipo,observacao,acao_proposta) values(a26,e,p,t26,2026,'História',m27,'observacao_docente','Matrícula do outro ano','Revisar vínculo');
 raise exception 'Observação de outro ano aceita';exception when foreign_key_violation then null;end;
 begin
 insert into educacional.solicitacoes_vinculo_docente(auth_user_id,escola_id,turma_id,ano_letivo,componente,estado) values(gen_random_uuid(),e,t26,2026,'História','aprovada');
 raise exception 'Aprovação sem revisor aceita';exception when check_violation then null;end;
 begin
 insert into educacional.solicitacoes_vinculo_docente(auth_user_id,escola_id,turma_id,ano_letivo,componente) values(gen_random_uuid(),e,t26,2026,'História');
 raise exception 'Solicitação sem usuário autenticado existente aceita';exception when foreign_key_violation then null;end;
 insert into educacional.aulas(id,escola_id,turma_id,ano_letivo,professor_id,artefato_id,versao,componente,titulo,data_planejada,registro_planejado,percursos_total) values(aula,e,t26,2026,p,'teste-docentes','1.0','História','Aula fictícia','2026-11-01','Fixture',26);
 insert into educacional.participantes_aula(escola_id,turma_id,ano_letivo,aula_id,matricula_id,confirmado_por) values(e,t26,2026,aula,m26,p);
 begin
 insert into educacional.participantes_aula(escola_id,turma_id,ano_letivo,aula_id,matricula_id,confirmado_por) values(e,t26,2026,aula,m27,p);
 raise exception 'Participante de outra matrícula anual aceito';exception when foreign_key_violation then null;end;
 insert into educacional.propostas_replanejamento(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente,calendario_id,motivo,proposta) values(a26,e,p,t26,2026,'História',cal,'Dia não letivo confirmado','{"tipo":"deslocar","requer_confirmacao_docente":true}'::jsonb);
 execute 'set local role anon';
 begin perform count(*) from educacional.planejamentos_docentes;raise exception 'Acesso anônimo indevido';exception when insufficient_privilege then null;end;
 execute 'reset role';
 execute 'set local role authenticated';
 begin perform count(*) from educacional.observacoes_pedagogicas;raise exception 'Acesso docente genérico indevido';exception when insufficient_privilege then null;end;
 execute 'reset role';
end $$;
select 'DOCENTES_ANUAL_OK: vínculos 2026/2027, trocas de professor, calendário, importação, histórico e negação de acesso conferidos; fixtures revertidos' as resultado;
rollback;
