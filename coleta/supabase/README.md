# Coleta educacional no Supabase — base privada 0.1.0

Decisão do Prof. André de Oliveira Rodrigues em 30/10/2026: organizar identificação, interações, notas e registros por escola, professor, turma, aluno e aula, sem depender do e-mail. Origem: nesta conversa, após discutir duração e reformulações de linguagem. A organização abaixo é elaboração técnica do assistente a partir da decisão autoral.

## Estado verificado
Projeto existente Arquiteturas da Aprendizagem, ativo, inspecionado sem tabelas de aplicação ou Edge Functions. Criada a base privada `educacional` com onze tabelas. Migração remota `20261030173315`, `base_privada_coleta_educacional_v010`; fonte em [schema_inicial.sql](schema_inicial.sql). Não é arquivo de migração CLI: é a fonte SQL da migração aplicada pelo conector. [STATUS.json](STATUS.json) distingue implantação e pendências.

**Ainda não existe receptor, entrada identificada integrada, painel docente ou coleta automática nas aulas.** O coletor Google/Apps Script anterior continua preparado e não implantado; seu STATUS não foi convertido artificialmente em Supabase ativo. As aulas publicadas preservam seu comportamento local/e-mail. Dados antigos não chegaram retrospectivamente ao banco e podem ter sido apagados do navegador.

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
| convites | Vínculo individual futuro com hash do segredo e validade |

Nome pode se repetir. Mudança de série, escola ou turma não sobrescreve a identidade nem presume promoção. Professores podem ter vínculos em mais de uma escola; os limites de acesso por vínculo ainda precisam ser implementados no receptor e painel. Nada foi importado de listas nominais reais.

## Mecânica — entrada e persistência propostas
Aluno confirma sua identificação e turma antes de começar a atividade registrada. Escola, docente, componente e aula são preenchidos pelo acesso emitido para a aplicação, com confirmação visível; o servidor resolve os IDs a partir da autorização, sem confiar nos campos livres do navegador. Evitar redigitação de nome completo a cada percurso e não exibir lista nominal pública. Um nome digitado, sozinho, não autentica a pessoa. Convite individual/matrícula ou login devem impedir assumir identidade alheia. Quem necessita apoio pode ser identificado pelo professor sem exigir digitação autônoma.

Aula → fila local por estudante/sessão → receptor autenticado → validação → transação no banco → recibo → remoção da fila confirmada. Repetir a mesma mensagem/ID e conteúdo devolve o mesmo resultado; colisão de ID com outro conteúdo é erro, sem sobrescrita. Restrição de unicidade no banco é base para idempotência, não é o protocolo implementado. Interações enviadas em lotes permitem recuperar progresso parcial sem envio por e-mail. Sem internet, mostrar pendência e preservar fila; sem recibo, não declarar salvamento central. No Chromebook compartilhado, não misturar sessões nem restaurar dados de outro aluno; encerrar sessão e explicar a remoção dos dados locais depois da sincronização.

Tempo: distinguir início/fim, tempo visível e intervalos por percurso; áudio e leitura sem cliques não são automaticamente inatividade. Registrar relógio do dispositivo separadamente do recebimento do servidor. Suspensão, recarga, troca de dispositivo e abas duplicadas exigem tratamento, sem somar intervalos sobrepostos. Não medir outros sites nem inferir atenção. Medidor e agregação ainda não implementados.

## Circuito — consulta pelo professor
Cadastro autorizado → acesso da aula → identificação confirmada → eventos parciais → atividades concluídas → avaliação integral confirmada → relatório final com recibo → painel docente por escola/turma/componente/aula/período → exportação de notas e registro de aula. E-mail permanece alternativa de entrega. Eventos parciais não liberam nota ou conclusão e não substituem relatório final. Conclusão online não confirma envio de e-mail.

O painel deve distinguir planejada de aplicada; não deduzir realização apenas de uma data prevista. Indicadores automáticos permanecem sujeitos à conferência docente antes do registro escolar oficial. No banco, `nota_indicador` reproduz primeiros acertos/total ×10, arredondado a uma casa; `origem_nota=cliente_nao_validada` deixa explícito que a base não valida acertos contra gabarito servidor. O receptor deverá conferir payload completo, totais contra a versão da aula, todas as respostas da experiência e conteúdo correspondente ao hash. Os CHECKs de booleanos/totais não realizam essa validação por si mesmos.

## Dialética — acesso restrito e próximos passos
Ponto cego: uma chave pública, nome digitado ou schema criado não constitui autenticação, coleta ativa ou isolamento completo de aplicação.

Base implantada com RLS em todas as onze tabelas e privilégios retirados de PUBLIC, anon, authenticated e service_role. Não há função SECURITY DEFINER, endpoint de leitura ou grant público; negar por padrão é intencional nesta etapa. O futuro receptor precisa de credencial exclusivamente no servidor e permissões mínimas, conferência de vínculo, convites limitados, quotas e proteção contra reenvio abusivo. O painel só poderá consultar registros sob autorização docente por escola/turma. Não publicar nome, notas, convites ou chaves secretas no GitHub; não usar user_metadata editável para autorizar.

Antes de produção: revisar finalidade informada, responsáveis institucionais, acesso, retenção e exclusão; implementar receptor/entrada/fila/painel e testar navegador → servidor → banco → confirmação, incluindo rede interrompida, duplicação, edição, identidade incorreta e escola diferente. Até isso passar, `coleta_automatica_ativa=false`.

## Verificação executada
[testar_base.sql](testar_base.sql) executado no banco real, com fixtures fictícios em transação revertida. Conferidos vínculos entre escolas, recusa de evento/seq duplicada, recusa de relatório incompleto ou sem confirmação, cálculo 20/26=7,7 e acesso recusado a anon/authenticated. Resultado `BASE_PRIVADA_OK`. Alunos, escolas, eventos e relatórios: zero após o rollback. Advisors retornaram somente INFO: RLS sem policies (negação intencional) e índices ainda sem uso numa base nova. Não abrir políticas permissivas apenas para remover o aviso.

Referências oficiais consultadas em 30/10/2026: [grants e RLS](https://supabase.com/docs/guides/api/securing-your-api), [autorização de funções](https://supabase.com/docs/guides/functions/auth-headers), [aviso RLS sem policies](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy), [índices sem uso](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).
