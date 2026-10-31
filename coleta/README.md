# Coleta de relatórios — Google Sheets e Apps Script

Versão do coletor: 1.0.0. Data: 28/10/2026. Responsável pedagógico: Prof. André de Oliveira Rodrigues.

## Supabase — receptor e piloto verificados em 31/10/2026

O [receptor Supabase e piloto identificado](supabase/README.md) foram implantados e testados pelo navegador até o banco e o recibo, com dados fictícios removidos depois. A entrada do piloto exige escola, aluno, matéria, turma e acesso individual. Cadastro dos alunos reais e painel docente continuam pendentes; consulte [STATUS Supabase](supabase/STATUS.json). Essa rota não depende nem ativa o coletor Google descrito abaixo.

## Estado da alternativa Google/Apps Script
A planilha nativa foi criada na conta pessoal escolhida pelo professor e sua permissão privada foi conferida. O receptor, o contrato de dados, o cliente e os testes estão preparados. **O serviço ainda não está publicado; não existe endpoint de coleta ativo nesta entrega.** Nenhuma aula existente foi alterada para transmitir dados. Consulte [VERIFICACAO.md](VERIFICACAO.md) e [STATUS.json](STATUS.json).

## Funcionamento
O artefato envia um relatório integral e um convite individual ao receptor. O servidor valida atividades, questionário e convite, grava o relatório, confirma a persistência e devolve protocolo, ID e hash. Repetir a mesma entrega retorna o mesmo protocolo; modificar conteúdo sob o mesmo ID é recusado.

As informações resumidas ficam em Entregas. O objeto completo, incluindo texto do relatório, histórico de percursos, respostas iniciais, tentativas, pistas, consultas, preferências e avaliação, fica em Relatorios, dividido em partes numeradas de até 30.000 caracteres. Para reconstruir, selecionar o ID, ordenar pelo número da parte, concatenar a coluna JSON e conferir SHA-256. Não somar nem remover partes. Uma linha em estado gravando não é entrega recebida.

Painel distingue teste e produção. Acessos guarda convites privados para distribuição individual; a planilha não deve ser compartilhada com estudantes. Convite comprova posse de uma autorização de entrega, não identidade civil. O endpoint não retorna dados dos relatórios e não aceita consultas de leitura.

## Ativação pelo proprietário
Usar a planilha já criada, na conta pessoal autorizada. Não criar outra cópia para cada turma.

1. Na planilha, abrir **Extensões → Apps Script**. Isso cria/abre o projeto vinculado à planilha.
2. Substituir o conteúdo de Code.gs pelo arquivo pronto [apps-script/Code.gs](apps-script/Code.gs). Não colar receptor.gs isoladamente: o arquivo pronto já inclui contrato e cabeçalhos.
3. Em Configurações do projeto, exibir o manifesto e usar [apps-script/appsscript.json](apps-script/appsscript.json). O código pede acesso a planilhas; não usa Gmail, contatos ou Drive completo.
4. Executar prepararColeta e concluir a autorização Google na conta proprietária. Esse passo reconhece a planilha vinculada, confere cabeçalhos e deixa recebimento desativado, em modo teste.
5. Executar criarConviteDeTeste. O convite fica na coluna G da aba Acessos, associado a teste-coleta e TESTE-001. Não publicar nem enviar esse convite ao repositório.
6. Publicar em **Implantar → Nova implantação → Aplicativo da Web**, executando como proprietário. Para receber de estudantes sem conta Google, a implantação precisa permitir visitantes e confiar nos convites individuais; conferir as opções realmente disponíveis na conta. A planilha permanece privada.
7. Executar ativarRecebimentoParaTeste. Copiar o endereço publicado terminado em /exec.
8. Abrir o teste técnico por um servidor HTTP/HTTPS, preencher endereço e convite e enviar. Conferir confirmação no navegador, uma linha de ambiente teste em Entregas e todas as partes em Relatorios. Reenviar e verificar o mesmo protocolo, sem duplicação. Não usar dados reais nessa etapa.
9. Somente após conferir o teste real, executar ativarProducaoAposTeste e emitir convites de produção, preenchendo ID da aula e códigos em criarConvitesDaTurma. Essa função não inclui exemplos de alunos reais.
10. Configurar o endereço no cliente das aulas selecionadas, testar o bloqueio de conclusão e registrar quais foram efetivamente migradas.

A publicação e a autorização exigem acesso ao Apps Script; o conector do Drive não oferece implantação desse serviço. Não registrar credenciais ou convites no código público. A entrada em produção não é consequência da existência dos arquivos.

## Integração com a aula
Usar [cliente.mjs](cliente.mjs) e [contrato.js](contrato.js) juntos. O formato de exemplo fica em [fixture.mjs](fixture.mjs), exclusivamente com dados fictícios.

```js
import {criarColetor} from './cliente.mjs';
const coletor=criarColetor({endpoint:ENDERECO_PUBLICADO});
// payload deve representar o estado atual completo e confirmado da aula.
const recibo=await coletor.enviar(payload,conviteIndividual);
if(await coletor.podeFinalizar(payload)){
  mostrarResultadoEProtocolo(recibo);
}
```

Essas funções da interface são pontos de integração, não componentes já instalados no motor. Chamá-las somente após validação e confirmação de todas as perguntas; impedir edição durante o envio ou conferir novamente o estado atual antes de mostrar o resultado. Revalidar todas as rotas de nota, exportação e conclusão. Não pré-selecionar respostas. A opinião do estudante não altera o cálculo da nota.

O cliente mantém um snapshot para reenvio e não armazena o convite. Reenviar exatamente o mesmo snapshot se a conexão cair, inclusive quando a gravação tiver ocorrido sem a confirmação chegar. Quando o armazenamento do navegador estiver indisponível, manter estado apenas na sessão e avisar a limitação; oferecer cópia/download para não perder o relatório ao sair.

No modo online, podeFinalizar confere avaliação, atividades e recibo correspondente ao conteúdo atual. A alternativa de e-mail continua disponível conforme a regra pedagógica do projeto, após avaliação completa, com aviso explícito de que o recebimento online não foi confirmado. Uma entrega por e-mail não deve ser marcada como protocolo online; abertura do aplicativo não prova envio. O professor confirma a entrega recebida por cada canal.

## Limites e tratamento de falhas
- Fetch usa POST simples text/plain, modo cors e redirecionamento permitido. **Não usar no-cors**: uma resposta opaca não confirma recebimento. A compatibilidade entre a implantação Apps Script e o navegador de origem precisa ser testada realmente.
- Falha de rede ou tempo excedido não vira mensagem de sucesso. Guardar o snapshot, permitir reenvio com o mesmo ID e oferecer arquivo/e-mail alternativo.
- O servidor usa bloqueio de concorrência e estados gravando/recebido. Uma interrupção parcial pode ser retomada, preservando protocolo e evitando multiplicar registros.
- O convite expira e pode ser desativado. É vinculado a aula, código interno e ambiente. Outra entrega no mesmo vínculo exige revisão do professor; não sobrescrever o histórico silenciosamente.
- Nota, respostas e eventos são declarados pelo artefato. A validação confere consistência, não corrige uma prova com gabarito secreto e não impede manipulação do cliente. Uso que exija integridade de avaliação requer outra validação no servidor.
- Preferências de fonte e avaliação de experiência não produzem diagnóstico. Não incluir diagnósticos, dados clínicos ou rastreamento externo ao artefato.
- A gravação de dados no repositório público é proibida. Apenas código, documentação e fixtures fictícios entram no GitHub.
- A planilha tem limites operacionais. O painel usa intervalos até a linha 10.001; ao alcançar essa capacidade, revisar fórmulas e considerar uma base de dados apropriada antes de expandir a coleta.

## Desenvolvimento e testes
Não depende de bibliotecas externas para os testes.

```bash
node coleta/build-server.mjs
node coleta/testes.mjs
```

Gerar Code.gs novamente após alterar contrato.js, headers.json ou receptor.gs. Não editar a cópia gerada como fonte primária. Os testes simulam serviços Google e incluem perda de confirmação, falha parcial e reenvio. Eles não substituem o envio real após implantação.

Referências técnicas consultadas em 28/10/2026: https://developers.google.com/apps-script/guides/web ; https://developers.google.com/apps-script/guides/content ; https://developers.google.com/apps-script/reference/lock/lock ; https://developers.google.com/apps-script/reference/properties/properties-service .


## Extensão longitudinal opcional
A seção 13.2 do prompt e pesquisa/longitudinal definem identidade estável e matrícula por ano/série. O módulo longitudinal.mjs oferece comAcompanhamento(payload,dados), que anexa a mesma informação ao relatório textual e ao JSON. Contrato.js valida a extensão opcional acompanhamento, versão 1.0.0; envelopes anteriores sem ela continuam válidos. O receptor conserva o objeto integral em Relatorios, sem mudar cabeçalhos ou abas.

A extensão exige aluno_id e matricula_id UUID, ano letivo confirmado, etapa, série, fonte, data de aplicação, protocolo e versão, método e lista de medidas. Cada medida identifica indicador, momento, instrumento/versão, rubrica, unidade, fonte, valor e denominador; valor null exige motivo de ausência. Lista vazia significa que não há medidas extras. Coorte é opcional; escola e turma continuam nos campos da aula.

Identificadores fornecidos pelo cliente são declarados, não prova da identidade ou matrícula. O professor precisa conferir os vínculos no cadastro privado antes da análise. Não publicar listas nominais. O módulo não consulta a lista, não atribui série e não importa entregas para SQLite. O serviço continua não implantado e nenhuma aula foi migrada. Conferir por teste real o armazenamento integral, texto e vínculo depois da implantação.


## Transporte n8n opcional
O cliente também aceita transporte: 'n8n' com URL HTTPS explícita de webhook. Consultar [integração e estado](../automacoes/n8n/README.md). A configuração padrão Apps Script foi preservada. O workflow é uma ponte para este mesmo receptor e não substitui sua implantação, convites ou validações. Treze ensaios adicionais locais não equivalem a execução real no n8n.

## Monitoramento metodológico opcional
Consultar [protocolo e estado](MONITORAMENTO_METODOLOGICO.md). O módulo metodologia.mjs anexa texto e JSON, valida estilo/método/espiral/circuitos e devolutiva confirmada, com resumo descritivo por circuito. Legados sem extensão permanecem válidos. Novas aulas devem integrar e testar UI e todas as saídas; nenhuma página foi migrada nesta atualização. Testes: `node coleta/testes-metodologia.mjs`.
