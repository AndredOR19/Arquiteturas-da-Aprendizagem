-- Cadastro da aula "Elementos da Convivência" no receptor coleta-livre
-- Artefato: elementos-da-convivencia-7ano · versão 1.0.0 · 26 percursos
--
-- ONDE EXECUTAR: somente no SQL Editor do Supabase, por perfil administrativo.
-- Não executar na máquina do estudante; não publicar; este arquivo não contém
-- dados de estudantes (LGPD). A pasta professor/ é excluída da publicação.
--
-- PREENCHER os três valores entre << >> antes de executar:
--   <<NOME EXATO DA ESCOLA CADASTRADA>>  — como está em educacional.escolas.nome
--   <<CÓDIGO EXATO DA TURMA>>            — como está em educacional.turmas.codigo
--     (turmas de 7º ano do período da tarde; conferir o código exato no cadastro)
--   <<NOME EXATO DO PROFESSOR CADASTRADO>> — como está em educacional.professores.nome
--     (é o nome que os estudantes digitarão na porta de entrada)
--
-- IDEMPOTENTE: pode reexecutar sem duplicar. Se a aula já existir, apenas
-- (re)ativa a coleta. Para desativar a coleta sem apagar nada:
--   update educacional.aulas set coleta_ativa=false
--    where artefato_id='elementos-da-convivencia-7ano';
-- Os registros já recebidos permanecem; novas sessões passam a operar em modo local.

DO $$
DECLARE
  v_escola text := '<<NOME EXATO DA ESCOLA CADASTRADA>>';
  v_turma  text := '<<CÓDIGO EXATO DA TURMA>>';
  v_prof   text := '<<NOME EXATO DO PROFESSOR CADASTRADO>>';
  v_ano    int  := 2026;
  v_escola_id uuid;
  v_turma_id  uuid;
  v_prof_id   uuid;
  v_existe    uuid;
BEGIN
  SELECT id INTO v_escola_id FROM educacional.escolas WHERE nome = v_escola;
  IF v_escola_id IS NULL THEN RAISE EXCEPTION 'Escola não encontrada: confira o nome exato no cadastro.'; END IF;

  SELECT t.id INTO v_turma_id FROM educacional.turmas t
   WHERE t.escola_id = v_escola_id AND t.ano_letivo = v_ano AND t.codigo = v_turma;
  IF v_turma_id IS NULL THEN RAISE EXCEPTION 'Turma não encontrada (escola/ano/código): confira o cadastro.'; END IF;

  SELECT p.id INTO v_prof_id FROM educacional.professores p
   JOIN educacional.vinculos_professores vp ON vp.professor_id = p.id AND vp.escola_id = v_escola_id AND vp.ativo
   WHERE p.nome = v_prof;
  IF v_prof_id IS NULL THEN RAISE EXCEPTION 'Professor sem vínculo ativo nesta escola: confira o nome exato no cadastro.'; END IF;

  SELECT a.id INTO v_existe FROM educacional.aulas a
   WHERE a.escola_id = v_escola_id AND a.turma_id = v_turma_id AND a.ano_letivo = v_ano
     AND a.artefato_id = 'elementos-da-convivencia-7ano';

  IF v_existe IS NOT NULL THEN
    UPDATE educacional.aulas SET coleta_ativa = true WHERE id = v_existe;
    RAISE NOTICE 'Aula já cadastrada (%). Coleta (re)ativada.', v_existe;
  ELSE
    INSERT INTO educacional.aulas
      (escola_id, turma_id, ano_letivo, professor_id, artefato_id, versao, componente, titulo,
       data_planejada, registro_planejado, habilidades, percursos_total, coleta_ativa)
    VALUES
      (v_escola_id, v_turma_id, v_ano, v_prof_id, 'elementos-da-convivencia-7ano', '1.0.0', 'ERER',
       'Elementos da Convivência — relações étnico-raciais a partir do filme Elementos (7º ano)',
       current_date,
       'identificacao_autodeclarada;tentativas;pistas;consultas;apoio_alfabetizacao;jogo;tempo_visivel;avaliacao;relatorio_integral',
       '["Lei 10.639/2003","Lei 11.645/2008","DCNERER"]'::jsonb,
       26, true);
    RAISE NOTICE 'Aula cadastrada. A coleta recusa sessões até os dados digitados corresponderem a este cadastro.';
  END IF;
END $$;

-- Após executar, conferir (leitura apenas da própria linha):
--   select artefato_id, versao, percursos_total, coleta_ativa from educacional.aulas
--    where artefato_id='elementos-da-convivencia-7ano';
--
-- Teste recomendado antes da aula: abrir a página publicada, preencher a porta
-- de entrada com dados FICTÍCIOS que não correspondam (deve recusar e oferecer
-- modo local) e depois com os dados reais em um dispositivo de teste.
