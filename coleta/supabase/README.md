# Coleta educacional no Supabase — receptor e piloto 0.2.0

Decisão do Prof. André de Oliveira Rodrigues em 30/10/2026: organizar identificação, interações, notas e registros por escola, professor, turma, aluno e aula, sem depender do e-mail. Origem: nesta conversa, após discutir duração e reformulações de linguagem. A organização abaixo é elaboração técnica do assistente a partir da decisão autoral.

## Estado em 31/10/2026

Receptor `coleta-educacional` implantado no projeto existente, cuja organização foi conferida no plano gratuito. O schema `educacional` continua privado: 11 tabelas originais e uma tabela de cotas; nenhum grant para consulta pelo navegador. Convites têm ambiente e sessões têm vínculo com o convite. Fonte aditiva em [receptor/estrutura.sql](receptor/estrutura.sql), código em [receptor/index.ts](receptor/index.ts).

Piloto separado [História 192](https://andredor19.github.io/Arquiteturas-da-Aprendizagem/aulas/piloto-coleta-historia-192/): escola, aluno, matéria e turma obrigatórios antes da abertura, com convite individual conferido no servidor. A entrada depende de rede; após entrar, falha no envio mantém pendências nesta aba e nunca confirma recebimento fictício. As aulas antigas continuam locais/e-mail; não foram migradas. Consulta e exportação docente pelo painel ainda não implementadas.

Teste HTTP e teste de navegador → receptor → banco receberam dados fictícios com recibo. Readback confirmou 56 eventos, 26 percursos e relatório integral; fixtures foram removidos. Ver [VERIFICACAO](VERIFICACAO.md) e [STATUS](STATUS.json) para navegador e publicação. Cadastro dos alunos reais continua pendente. Não há recuperação retrospectiva automática.

## Cadastro e uso do piloto

1. Conferir a lista nominal da turma 192 em ambiente restrito; cada estudante precisa de código interno estável. Identidade entre anos deve reutilizar `aluno_id` confirmado; não deduzir por nome.
2. Preparar JSON privado com `artefato`, `expira_em` e `alunos` (`nome`, `codigo`, `aluno_id` opcional). Executar o script administrativo [cadastrar-acessos.mjs](cadastrar-acessos.mjs) com entrada/saída fora do Git ou dentro de `dados-privados/`, ignorado. A saída contém dados e segredos; não publicar, nem enviar como issue/PR/log.
3. Conferir e executar `cadastro.sql` pelo administrador no SQL Editor Supabase. É uma transação; código existente com nome divergente é recusado. Não executar por um aluno nem abrir SQL público. Somente o hash do convite vai ao banco.
4. Distribuir cada acesso individual ao respectivo aluno. O mesmo código de turma não é um acesso coletivo. Quem precisar de apoio pode preencher com o professor.
5. Abrir o link piloto, preencher os quatro campos e colar o acesso; dados precisam corresponder ao cadastro. Recarga exige identificar-se novamente; progresso é restaurado apenas para o mesmo acesso/sessão na mesma aba.
6. Acompanhar o indicador de interações e do relatório. Encerrar o acesso antes de entregar o dispositivo a outra pessoa; fila sem confirmação gera aviso explícito antes de apagar temporários.

O receptor não oferece GET/listas de nomes/consulta de notas, nem funções administrativas públicas. Usa convite revogável/expirável e resolve escola/matrícula/aula no servidor. Usa conexão Postgres disponível somente no ambiente da função; não entrega credencial privilegiada ao cliente. CORS limita origem de navegador, mas não autentica; o convite é a autorização. A revisão do relatório preserva o indicador `cliente_nao_validada`, não uma prova sigilosa.

## Limites de operação

Envio a cada 15 segundos, quando há pendências, com até 20 eventos por chamada. Cotas iniciais: 180 requisições/minuto e 12.000/dia globalmente no receptor; até 5 sessões por convite, 5.000 eventos/sessão e 20 revisões de relatório. São limites de piloto, não capacidade garantida de rede escolar. Limite de eventos paralisa a interface com aviso e preserva as pendências; ajustar somente após medir uso. Tentativa de fechar a página não garante entrega.

Fila/estado ficam em sessionStorage desta aba, sem convite persistido; se o armazenamento falhar, fila fica somente em memória e há aviso. Fechar/limpar a aba pode perder pendências. Exportação/e-mail permanece disponível após completude, mesmo sem recibo online. Opiniões não alteram nota. `Relatório final recebido` exige ID/hash do conteúdo enviado; alterações posteriores geram outra revisão. Dados de tempo/visibilidade não comprovam atenção.

O plano gratuito pode pausar o projeto por inatividade e não oferece backups automáticos; exportação administrativa privada e conferência antes de voltar às aulas são responsabilidades operacionais. Nenhum serviço de IA, n8n, Vercel ou plano pago é necessário para esta rota inicial.

## Âncora — identidade e organização

| Entidade | Função |
|---|---|
| escolas | Separação institucional desde o primeiro cadastro |
| professores | Identidade docente e futuro vínculo ao Supabase Auth |
| vinculos_professores | Papel e vínculo do docente em cada escola |
| turmas | Escola, código, ano letivo, etapa e série |
| alunos | Identificador estável; nome não é chave |
| matriculas | Aluno na turma/escola/ano, com fonte de confirmação |
| aulas | Artefato e versão, componente, professor, planejamento e data aplicada distinta |
| sessoes | Realização da aula pela matrícula, em teste ou produção |
| eventos | Interações parciais com ID estável e horário de recebimento |
| relatorios | Entrega final versionada, conteúdo integral e indicador |
| convites | Vínculo individual com hash do segredo e validade |

Nome pode se repetir. Mudança de série, escola ou turma não sobrescreve a identidade nem presume promoção. Professores podem ter vínculos em mais de uma escola; os limites de acesso por vínculo ainda precisam ser implementados no receptor e painel. Nada foi importado de listas nominais reais.

## Mecânica — entrada e persistência propostas
Aluno confirma sua identificação e turma antes de começar a atividade registrada. Escola, docente, componente e aula são preenchidos pelo acesso emitido para a aplicação, com confirmação visível; o servidor resolve os IDs a partir da autorização, sem confiar nos campos livres do navegador. Evitar redigitação de nome completo a cada percurso e não exibir lista nominal pública. Um nome digitado, sozinho, não autentica a pessoa. Convite individual/matrícula ou login devem impedir assumir identidade alheia. Quem necessita apoio pode ser identificado pelo professor sem exigir digitação autônoma.

Aula → fila local por estudante/sessão → receptor autenticado → validação → transação no banco → recibo → remoção da fila confirmada. Repetir a mesma mensagem/ID e conteúdo devolve o mesmo resultado; colisão de ID com outro conteúdo é erro, sem sobrescrita. O receptor implementa transações e reenvio por ID/conteúdo além das restrições de unicidade. Interações enviadas em lotes permitem recuperar progresso parcial sem envio por e-mail. Sem internet, mostrar pendência e preservar fila; sem recibo, não declarar salvamento central. No Chromebook compartilhado, não misturar sessões nem restaurar dados de outro aluno; encerrar sessão e explicar a remoção dos dados locais depois da sincronização.

Tempo: distinguir início/fim, tempo visível e intervalos por percurso; áudio e leitura sem cliques não são automaticamente inatividade. Registrar relógio do dispositivo separadamente do recebimento do servidor. Suspensão, recarga, troca de dispositivo e abas duplicadas exigem tratamento, sem somar intervalos sobrepostos. Não medir outros sites nem inferir atenção. Medidor e agregação ainda não implementados.

## Circuito — consulta pelo professor
Cadastro autorizado → acesso da aula → identificação confirmada → eventos parciais → atividades concluídas → avaliação integral confirmada → relatório final com recibo → painel docente por escola/turma/componente/aula/período → exportação de notas e registro de aula. E-mail permanece alternativa de entrega. Eventos parciais não liberam nota ou conclusão e não substituem relatório final. Conclusão online não confirma envio de e-mail.

O painel deve distinguir planejada de aplicada; não deduzir realização apenas de uma data prevista. Indicadores automáticos permanecem sujeitos à conferência docente antes do registro escolar oficial. No banco, `nota_indicador` reproduz primeiros acertos/total ×10, arredondado a uma casa; `origem_nota=cliente_nao_validada` deixa explícito que a base não valida acertos contra gabarito servidor. O receptor deverá conferir payload completo, totais contra a versão da aula, todas as respostas da experiência e conteúdo correspondente ao hash. Os CHECKs de booleanos/totais não realizam essa validação por si mesmos.

## Dialética — acesso restrito e próximos passos
Ponto cego: uma chave pública, nome digitado ou schema criado não constitui autenticação, coleta ativa ou isolamento completo de aplicação.

Base com RLS em todas as doze tabelas e privilégios retirados de PUBLIC, anon, authenticated e service_role. Sem funções SECURITY DEFINER e sem grant público de leitura. O receptor usa a conexão disponível exclusivamente no servidor, com SQL parametrizado, validação de acesso, cotas e recibos. O cadastro usa administração privada. Para produção real, confirmar lista/autorização da aplicação, retenção e acessos institucionais. O painel e a medição detalhada continuam pendentes; consultar o estado atualizado antes de anunciar expansão.

## Verificação executada
[testar_base.sql](testar_base.sql) executado no banco real, com fixtures fictícios em transação revertida. Conferidos vínculos entre escolas, recusa de evento/seq duplicada, recusa de relatório incompleto ou sem confirmação, cálculo 20/26=7,7 e acesso recusado a anon/authenticated. Resultado `BASE_PRIVADA_OK`. Alunos, escolas, eventos e relatórios: zero após o rollback. Advisors retornaram somente INFO: RLS sem policies (negação intencional) e índices ainda sem uso numa base nova. Não abrir políticas permissivas apenas para remover o aviso.

Referências oficiais consultadas em 30/10/2026: [grants e RLS](https://supabase.com/docs/guides/api/securing-your-api), [autorização de funções](https://supabase.com/docs/guides/functions/auth-headers), [aviso RLS sem policies](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy), [índices sem uso](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).
