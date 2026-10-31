-- Cobertura das chaves compostas apontadas pelo advisor.
create index dias_calendario_contexto_idx on educacional.dias_calendario(calendario_id,escola_id,ano_letivo);
create index importacoes_atribuicao_idx on educacional.importacoes_docentes(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente);
create index participantes_aula_contexto_idx on educacional.participantes_aula(escola_id,turma_id,ano_letivo,aula_id);
