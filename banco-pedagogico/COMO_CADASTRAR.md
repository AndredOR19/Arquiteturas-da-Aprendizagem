# Cadastro de documentos e participação docente

## Entrada e autoria

Cada professor pode propor seus planejamentos, ementas e guias, usando uma branch e pull request para revisão do responsável. Participar do projeto não transfere autoria, concede acesso ao GitHub ou autoriza compartilhar documentos de estudantes. Use identificador profissional estável do responsável, escola, turma, componente, ano e período. Regente indicado no original pode ser diferente de quem envia ou adapta; conserve os papéis separados.

## Procedimento obrigatório

1. Ler o arquivo inteiro, incluindo tabelas, comentários, mídia, anexos e propriedades pertinentes. Definir se é planejamento, ementa, currículo, guia, aula ou modelo vazio. Documento preenchido individual não entra no repositório público.
2. Confirmar autorização de compartilhamento, abrangência e classificação. Planos gerais sem dados individuais podem ser públicos; PEI preenchido, laudo, notas, contatos e relatório individual são restritos. Remover texto visível não garante remoção de comentários, revisões, mídia ou metadados; não publicar até revisão adequada.
3. Preservar o original, normalizar apenas o caminho e registrar nome recebido e SHA-256. Nunca corrigir silenciosamente o arquivo de origem. Atualização nova recebe versão identificada, com status do arquivo anterior e justificativa; não tratar duplicata idêntica como novo plano.
4. Gerar texto de consulta com rótulo de extração e limitações. Manter contexto de tabelas, semestre/trimestre, datas, código e redação da habilidade tal como recebido. Não acrescentar código por memória.
5. Usar um diretório distinto por escola/ano/período/componente/turma e, quando houver mais de uma fonte para a mesma turma, um subdiretório por responsável e versão. O catálogo aponta cada documento por ID único. Fontes normativas transversais ficam uma vez em base-curricular, com etapa, versão, origem e data.
6. Preencher metadados: ID, título, tipo, nome recebido, responsável pelo acervo, autor/regente original quando informado, escola, turma, etapa/série, período, vigência, data de recebimento, caminhos, hash, status de leitura, estado de aplicação, classificação, temas, habilidades citadas e alertas. Campo desconhecido é `null`, nunca inventado. Registrar fonte e escopo das inferências.
7. Incluir no catalogo.json público somente materiais gerais revisados. Não cadastrar alunos, diagnósticos, matrícula, links privados de prontuários ou códigos vinculáveis. A documentação privada tem seu próprio catálogo restrito; este acervo não cria esse serviço nem seus acessos.
8. Validar com `python3 banco-pedagogico/validar.py` e o validador das arquiteturas; revisar diff, arquivos binários e arquivos públicos alcançáveis. Salvar por commit/PR descritivo. Revisão e integração não equivalem a aplicação em sala.

## Da fonte à aula

Consultar o documento exato e sua vigência, os alertas e o currículo oficial. Selecionar a unidade prevista e conferir a última aplicação real; uma data no plano não confirma que a aula aconteceu. Registrar na composição `documentos_base` (IDs e caminhos), `recorte_utilizado`, `adaptacoes` e `fluxo_visual`. O plano orienta; BNCC/RCG/matriz precisam de fonte verificável e adaptação pedagógica explícita. Não considerar o texto de uma habilidade oficial apenas porque há um código no plano.

Produzir a aula diária com explicação, relações visuais, apoios, recuperação/aplicação, avaliação e relatório; usar Fluxo 01 ou 02. Revisões curriculares não alteram automaticamente aulas já publicadas. Casos individualizados exigem consulta autorizada ao PEI privado e tradução em apoios pedagógicos sem expor diagnóstico ou identidade no HTML.

## Saída e estados

Distinguir `recebido`, `consultado`, `vinculacao_pendente`, `substituido` e `arquivado`; marcar aplicação separadamente como planejada ou confirmada com fonte. Não chamar cadastro JSON de coleta automática, IA treinada, base vetorial ativa ou prontuário com controle de acesso. Novos uploads devem ser lidos/cadastrados a cada contribuição.
