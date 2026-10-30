-- Somente dados fictícios; nada desta transação permanece no banco.
begin;
do $$
declare
 e uuid; e2 uuid; p uuid; t uuid; t2 uuid; a uuid; m uuid; l uuid; s uuid;
 ev uuid:=gen_random_uuid();
 denied boolean;
begin
 insert into educacional.escolas(nome) values ('TESTE FICTICIO A') returning id into e;
 insert into educacional.escolas(nome) values ('TESTE FICTICIO B') returning id into e2;
 insert into educacional.professores(nome) values ('DOCENTE FICTICIO') returning id into p;
 insert into educacional.vinculos_professores values(e,p,'professor',true);
 insert into educacional.turmas(escola_id,ano_letivo,codigo,etapa,serie) values(e,2026,'TESTE','EF','6') returning id into t;
 insert into educacional.turmas(escola_id,ano_letivo,codigo,etapa,serie) values(e2,2026,'TESTE','EF','6') returning id into t2;
 insert into educacional.alunos(nome) values ('ALUNO FICTICIO') returning id into a;
 insert into educacional.matriculas(aluno_id,escola_id,turma_id,ano_letivo,codigo_interno,confirmada_em,fonte_confirmacao)
 values(a,e,t,2026,'TESTE',now(),'fixture ficticio') returning id into m;
 insert into educacional.aulas(escola_id,turma_id,ano_letivo,professor_id,artefato_id,versao,componente,titulo,data_planejada,registro_planejado,percursos_total)
 values(e,t,2026,p,'TESTE','0.1','TESTE','AULA FICTICIA',current_date,'PLANEJADA',26) returning id into l;
 if (select coleta_ativa from educacional.aulas where id=l) then raise exception 'Coleta iniciou ativa'; end if;
 denied:=false;
 begin
  insert into educacional.sessoes(escola_id,turma_id,ano_letivo,aula_id,matricula_id,ambiente) values(e2,t2,2026,l,m,'teste');
 exception when foreign_key_violation then denied:=true;
 end;
 if not denied then raise exception 'Sessao cruzou escola'; end if;
 insert into educacional.sessoes(escola_id,turma_id,ano_letivo,aula_id,matricula_id,ambiente) values(e,t,2026,l,m,'teste') returning id into s;
 insert into educacional.eventos values(ev,e,s,0,'inicio',now(),now(),'{}');
 denied:=false;
 begin
  insert into educacional.eventos values(gen_random_uuid(),e,s,0,'inicio',now(),now(),'{}');
 exception when unique_violation then denied:=true;
 end;
 if not denied then raise exception 'Sequencia duplicada aceita'; end if;
 denied:=false;
 begin
  insert into educacional.eventos values(gen_random_uuid(),e2,s,1,'inicio',now(),now(),'{}');
 exception when foreign_key_violation then denied:=true;
 end;
 if not denied then raise exception 'Evento cruzou escola'; end if;
 denied:=false;
 begin
  insert into educacional.relatorios(id,escola_id,sessao_id,revisao,sha256,percursos_total,percursos_concluidos,acertos_iniciais,experiencia_confirmada,experiencia_preenchida,conteudo,texto)
  values(gen_random_uuid(),e,s,1,repeat('a',64),26,25,20,true,true,'{}','FICTICIO');
 exception when check_violation then denied:=true;
 end;
 if not denied then raise exception 'Relatorio incompleto aceito'; end if;
 denied:=false;
 begin
  insert into educacional.relatorios(id,escola_id,sessao_id,revisao,sha256,percursos_total,percursos_concluidos,acertos_iniciais,experiencia_confirmada,experiencia_preenchida,conteudo,texto)
  values(gen_random_uuid(),e,s,1,repeat('a',64),26,26,20,false,true,'{}','FICTICIO');
 exception when check_violation then denied:=true;
 end;
 if not denied then raise exception 'Relatorio sem confirmacao aceito'; end if;
 insert into educacional.relatorios(id,escola_id,sessao_id,revisao,sha256,percursos_total,percursos_concluidos,acertos_iniciais,experiencia_confirmada,experiencia_preenchida,conteudo,texto)
 values(gen_random_uuid(),e,s,1,repeat('a',64),26,26,20,true,true,'{}','FICTICIO');
 if (select nota_indicador from educacional.relatorios where sessao_id=s)<>7.7 then raise exception 'Nota incorreta'; end if;
 if exists(select 1 from pg_tables where schemaname='educacional' and not rowsecurity) then raise exception 'Tabela sem RLS'; end if;
end $$;
set local role anon;
do $$ declare denied boolean:=false; begin
 begin perform 1 from educacional.alunos; exception when insufficient_privilege then denied:=true; end;
 if not denied then raise exception 'Anon leu alunos'; end if;
end $$;
reset role;
set local role authenticated;
do $$ declare denied boolean:=false; begin
 begin perform 1 from educacional.relatorios; exception when insufficient_privilege then denied:=true; end;
 if not denied then raise exception 'Authenticated leu relatorios'; end if;
end $$;
reset role;
select 'BASE_PRIVADA_OK: isolamento, duplicacao, completude, nota, RLS e negacao de acesso; fixtures revertidos' as resultado;
rollback;
