PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS alunos (
 aluno_id TEXT PRIMARY KEY,
 criado_em TEXT NOT NULL,
 origem TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS matriculas (
 matricula_id TEXT PRIMARY KEY,
 aluno_id TEXT NOT NULL REFERENCES alunos(aluno_id),
 ano_letivo INTEGER NOT NULL CHECK(ano_letivo BETWEEN 2000 AND 2200),
 escola_id TEXT NOT NULL,
 turma TEXT NOT NULL,
 etapa TEXT NOT NULL,
 serie TEXT NOT NULL,
 inicio TEXT NOT NULL CHECK(date(inicio) IS NOT NULL AND date(inicio)=inicio),
 fim TEXT CHECK(fim IS NULL OR (date(fim) IS NOT NULL AND date(fim)=fim AND fim>=inicio)),
 situacao TEXT NOT NULL CHECK(situacao IN ('cursando','concluida','aprovado','reprovado','transferido','evasao','pendente')),
 fonte_confirmacao TEXT NOT NULL,
 anterior_id TEXT,
 UNIQUE(matricula_id,aluno_id),
 FOREIGN KEY(anterior_id,aluno_id) REFERENCES matriculas(matricula_id,aluno_id),
 CHECK(anterior_id IS NULL OR anterior_id<>matricula_id)
);
CREATE TABLE IF NOT EXISTS coortes (
 coorte_id TEXT PRIMARY KEY,
 inicio TEXT NOT NULL,
 descricao TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS membros_coorte (
 coorte_id TEXT NOT NULL REFERENCES coortes(coorte_id),
 aluno_id TEXT NOT NULL REFERENCES alunos(aluno_id),
 entrada TEXT NOT NULL,
 saida TEXT,
 motivo_saida TEXT,
 PRIMARY KEY(coorte_id,aluno_id)
);
CREATE TABLE IF NOT EXISTS protocolos (
 protocolo_id TEXT NOT NULL,
 versao TEXT NOT NULL,
 pergunta TEXT NOT NULL,
 hipotese TEXT NOT NULL,
 criterios_json TEXT NOT NULL CHECK(json_valid(criterios_json)),
 PRIMARY KEY(protocolo_id,versao)
);
CREATE TABLE IF NOT EXISTS sessoes (
 sessao_id TEXT PRIMARY KEY,
 aluno_id TEXT NOT NULL,
 matricula_id TEXT NOT NULL,
 data TEXT NOT NULL CHECK(date(data) IS NOT NULL AND date(data)=data),
 ambiente TEXT NOT NULL CHECK(ambiente IN ('teste','producao')),
 artefato_id TEXT NOT NULL,
 versao_artefato TEXT NOT NULL,
 versao_prompt TEXT NOT NULL,
 protocolo_id TEXT NOT NULL,
 versao_protocolo TEXT NOT NULL,
 contexto_json TEXT NOT NULL CHECK(json_valid(contexto_json)),
 FOREIGN KEY(matricula_id,aluno_id) REFERENCES matriculas(matricula_id,aluno_id),
 FOREIGN KEY(protocolo_id,versao_protocolo) REFERENCES protocolos(protocolo_id,versao)
);
CREATE TRIGGER IF NOT EXISTS sessao_periodo_insert BEFORE INSERT ON sessoes
BEGIN
 SELECT CASE WHEN NOT EXISTS(
  SELECT 1 FROM matriculas m WHERE m.matricula_id=NEW.matricula_id
  AND m.aluno_id=NEW.aluno_id AND NEW.data>=m.inicio
  AND (m.fim IS NULL OR NEW.data<=m.fim)
 ) THEN RAISE(ABORT,'Sessao fora do periodo da matricula') END;
END;
CREATE TRIGGER IF NOT EXISTS sessao_imutavel BEFORE UPDATE ON sessoes
BEGIN SELECT RAISE(ABORT,'Preservar sessao original; registrar nova observacao'); END;
CREATE TABLE IF NOT EXISTS medidas (
 medida_id TEXT PRIMARY KEY,
 sessao_id TEXT NOT NULL REFERENCES sessoes(sessao_id),
 indicador TEXT NOT NULL,
 momento TEXT NOT NULL CHECK(momento IN ('inicial','treino','pos','retencao','transferencia')),
 instrumento_id TEXT NOT NULL,
 versao_instrumento TEXT NOT NULL,
 rubrica TEXT NOT NULL,
 unidade TEXT NOT NULL,
 valor REAL,
 denominador REAL CHECK(denominador IS NULL OR denominador>0),
 motivo_ausencia TEXT,
 fonte TEXT NOT NULL,
 CHECK((valor IS NULL AND motivo_ausencia IS NOT NULL AND length(trim(motivo_ausencia))>0)
 OR (valor IS NOT NULL AND motivo_ausencia IS NULL))
);
CREATE TRIGGER IF NOT EXISTS medida_imutavel BEFORE UPDATE ON medidas
BEGIN SELECT RAISE(ABORT,'Preservar medida original; registrar nova observacao'); END;
CREATE TABLE IF NOT EXISTS respostas (
 resposta_id TEXT PRIMARY KEY,
 sessao_id TEXT NOT NULL REFERENCES sessoes(sessao_id),
 instrumento_id TEXT NOT NULL,
 versao TEXT NOT NULL,
 item_id TEXT NOT NULL,
 resposta_json TEXT NOT NULL CHECK(json_valid(resposta_json)),
 natureza TEXT NOT NULL CHECK(natureza IN ('aprendizagem','percepcao','evento_tecnico','observacao_docente'))
);
CREATE TABLE IF NOT EXISTS relatorios (
 relatorio_id TEXT PRIMARY KEY,
 sessao_id TEXT NOT NULL REFERENCES sessoes(sessao_id),
 canal TEXT NOT NULL CHECK(canal IN ('arquivo','email','online','observacao_docente')),
 recebido_em TEXT NOT NULL,
 recebimento_confirmado INTEGER NOT NULL CHECK(recebimento_confirmado IN (0,1)),
 sha256 TEXT NOT NULL CHECK(length(sha256)=64),
 conteudo_json TEXT NOT NULL CHECK(json_valid(conteudo_json))
);
CREATE VIEW IF NOT EXISTS trajetoria AS
 SELECT m.aluno_id,m.matricula_id,m.ano_letivo,m.etapa,m.serie,m.turma,m.escola_id,
 m.inicio,m.fim,m.situacao,m.anterior_id,s.sessao_id,s.data,s.ambiente,s.artefato_id,
 s.versao_artefato,s.versao_prompt,s.protocolo_id,s.versao_protocolo,
 x.medida_id,x.indicador,x.momento,x.instrumento_id,x.versao_instrumento,x.rubrica,
 x.unidade,x.valor,x.denominador,x.motivo_ausencia
 FROM matriculas m LEFT JOIN sessoes s ON s.matricula_id=m.matricula_id
 LEFT JOIN medidas x ON x.sessao_id=s.sessao_id;
PRAGMA user_version = 1;
