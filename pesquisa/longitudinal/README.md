# Acompanhamento privado entre anos e séries

Versão 1.0.0 — estrutura local, sem dados reais carregados e sem integração online ativa.

## Identidade e matrícula
`aluno_id` é um UUID aleatório permanente. O nome oficial e a fonte da lista ficam em `identidades.sqlite3`, separado de `acompanhamento.sqlite3`. Não usar nome, número de chamada, turma ou hash de nome como identidade permanente. Homônimos não são mesclados. Na continuidade, reaproveitar o ID confirmado e criar uma nova matrícula com outro `matricula_id`.

A matrícula contém ano letivo, escola, turma, etapa, série, início, fim e situação confirmada. A matrícula de 2027 aponta para a anterior, sem substituir 2026. Repetência conserva a série; transferência pode mudar escola/turma no mesmo ano. A passagem de ano não gera aprovação automática. Fechar o período anterior apenas mediante confirmação; as observações permanecem ligadas à matrícula da ocasião.

Coortes mantêm participantes acompanhados, entradas e saídas. Sessões vinculam protocolo, versões, data e contexto à matrícula correta. Medidas mantêm indicador, momento, instrumento, rubrica, unidade, denominador e motivo de ausência. Respostas distinguem aprendizagem, percepção, evento técnico e observação docente; relatórios conservam origem, confirmação e conteúdo integral com hash. O esquema não corrige uma avaliação nem verifica a identidade civil de quem enviou um arquivo.

## Uso local
Requer Python 3.10+ e SQLite com JSON1. Executar da raiz do projeto. A ferramenta recusa criar o banco dentro deste repositório, inclusive por caminho que resolva para ele.

```bash
python3 pesquisa/longitudinal/banco.py consultar cadência
python3 pesquisa/longitudinal/banco.py iniciar --diretorio /CAMINHO/PRIVADO/arquiteturas
python3 pesquisa/longitudinal/banco.py cadastrar --diretorio /CAMINHO/PRIVADO/arquiteturas --entrada /CAMINHO/PRIVADO/lista.json
python3 pesquisa/longitudinal/banco.py matricular --diretorio /CAMINHO/PRIVADO/arquiteturas --entrada /CAMINHO/PRIVADO/matricula.json
python3 pesquisa/longitudinal/banco.py relatorio --diretorio /CAMINHO/PRIVADO/arquiteturas --aluno-id UUID_CONFIRMADO
```

`/CAMINHO/PRIVADO` é um marcador que deve ser substituído por pasta restrita do professor. Não é endereço de uma base já criada. Novos bancos recebem arquivos com permissão 600; a pasta nova usa 700. Isso não é criptografia, serviço hospedado ou cópia de segurança. Conferir proteção e backup do armazenamento escolhido.

Lista JSON privada: array de objetos com `nome_oficial`, `fonte_lista` e, quando já existente e conferido, `aluno_id`. Cadastrar sem ID cria um novo; não repetir a mesma lista sem reutilizar os IDs devolvidos. Atualização de nome sob o mesmo ID exige conferência explícita, não substituição automática. Guardar a lista com os IDs em ambiente privado.

Matrícula JSON privada: `aluno_id`, `ano_letivo` inteiro, `escola_id`, `turma`, `etapa`, `serie`, `inicio` em AAAA-MM-DD, `situacao`, `fonte_confirmacao`; opcionais `matricula_id`, `fim` e `anterior_id`. Não preencher matrícula de 2027 por previsão.

## Limites e próximos passos
O CLI cadastra identidades/matrículas e consulta a trajetória; as tabelas de sessões e medidas estão prontas para integração técnica, mas não há importação automática da coleta para SQLite. A extensão coleta/longitudinal.mjs prepara texto e JSON e o contrato valida os novos campos opcionais; seu uso nas aulas e o recebimento online real dependem de integração e implantação. A planilha privada já existente continua com suas abas e seu contrato anteriores. Esta entrega não altera dados nem permissões nela.

O relatório é descritivo, conserva matrículas ainda sem sessão e não contém nome. Ele pode conter informações vinculáveis e continua privado. Não calcula significância estatística ou ganho causal. Aplicar `pesquisa/modelos/RELATORIO_ACOMPANHAMENTO.md` para análise; definir previamente critérios de comparação, retenção e transferência. Campos ausentes não viram zeros; não comparar automaticamente notas de séries/instrumentos diferentes. O banco guarda versões originais; correções precisam de registro e proveniência.

```bash
python3 pesquisa/longitudinal/testes.py
```

Os ensaios criam e removem bancos temporários com participantes inteiramente fictícios. Não são evidência de resultado com alunos.
