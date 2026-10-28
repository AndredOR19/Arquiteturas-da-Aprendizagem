-- Cadastro nominal separado; nunca inserir registros reais neste arquivo.
CREATE TABLE IF NOT EXISTS identidades (
 aluno_id TEXT PRIMARY KEY,
 nome_oficial TEXT NOT NULL CHECK(length(trim(nome_oficial))>0),
 fonte_lista TEXT NOT NULL CHECK(length(trim(fonte_lista))>0),
 confirmado_em TEXT NOT NULL
);
-- Nome não é UNIQUE: homônimos precisam conservar identidades distintas.
PRAGMA user_version = 1;
