# Coleta automática de interações das aulas HTML

Autor e responsável pedagógico: Prof. André de Oliveira Rodrigues. Versão técnica 0.1.0 — 29/10/2026.

## Estado

Cliente, contrato, receptor e workflow implementados e testados localmente com serviços simulados. Não importado/executado no n8n; receptor não implantado; nenhuma aula instrumentada ou coleta real ativada. Não afirmar que dados já chegam ao professor. O fluxo de relatório final continua separado, com seu questionário obrigatório.

## Circuito

HTML instrumentado → fila temporária no navegador → POST em lotes ao webhook n8n → validação → Apps Script → aba Eventos da planilha privada → confirmação → remoção do lote da fila.

São registrados somente eventos definidos pela aula: início, tentativa com resultado declarado pelo próprio artefato, pista, conclusão de etapa e ativação/desativação de recurso. Não há captura genérica de cliques, digitação, tela, câmera, áudio, texto livre ou diagnóstico. Timestamp é do dispositivo, não prova tempo de estudo. Código pseudônimo continua sendo dado protegido quando vinculável. Interação e acerto não comprovam efeito causal nem diagnóstico.

## Preparar o servidor e n8n

1. Regenerar `node coleta/build-server.mjs` e implantar `coleta/apps-script/Code.gs` no projeto Apps Script privado já previsto para a planilha. Preservar SPREADSHEET_ID e Acessos; não criar outro banco nem publicar convites.
2. No editor privado, executar `prepararEventos()`: cria aba Eventos, coleta de eventos pausada. Conferir cabeçalhos. Usar os convites já emitidos, vinculados a aula/código/ambiente/validade; IDs técnicos devem conter somente letras, números, hífen e sublinhado. Versão admite ponto.
3. Manter coletor em teste e RECEBIMENTO_ATIVO=true; executar `ativarEventosParaTeste()`. O receptor requer as duas chaves de ativação. Esses comandos administrativos não ficam disponíveis no endpoint público.
4. Importar `automacoes/n8n/receber-eventos.json`. No nó Configurar receptor, preencher URL /exec real, ambiente teste. O workflow é inativo por padrão. Não alterar workflow de relatórios finais.
5. Usar URL de teste do webhook com listener aberto; configurar origem CORS exata da escola/site. O exemplo permite https://andredor19.github.io. CORS não autentica: o convite é verificado pelo receptor. Não salvar execuções/manuais com dados reais; verificar também logs do proxy e retenção da instância.
6. Fazer integração da página descrita abaixo. Conferir eventos reais na planilha, recibo, perda de rede, reenvio idêntico, convite inválido/expirado, celular/Chromebook e bloqueio do resultado final.
7. Só após teste real conferido: modo de produção do receptor, `ativarEventosAposTeste()`, ambiente produção no workflow, publicar workflow, URL de produção e convite de produção na sessão individual. Testes simulados não autorizam afirmar ativação.

O webhook público precisa de limite de requisições e tamanho no proxy antes de uso em turma; convite não impede tentativas de abuso contra o endpoint. Planilha é uma primeira persistência de pequeno porte: o receptor pesquisa lotes existentes linearmente; para muitas turmas/escolas, substituir por banco transacional com índice único em batch_id. Política de acesso, retenção e informação à comunidade escolar precisa ser definida pelo responsável antes do uso real. Nenhuma lista nominal será publicada.

## Integrar o HTML

Hospedar `cliente.mjs` e `contrato.js` juntos no pacote da aula. O empacotador atual não injeta esses arquivos automaticamente. Chamar explicitamente o módulo após preparar a sessão individual; não colocar convite de turma, credenciais administrativas ou dados de alunos no HTML público/URL. `sessaoPrivada` no exemplo representa dados recebidos de acesso individual em runtime, ainda a conectar à interface de entrada da aula.

```js
import {criarColetaEventos} from './eventos/cliente.mjs';
const coleta = criarColetaEventos({
  autorizado: true, // aplicação autorizada e finalidade informada; não presumir consentimento
  webhook: configuracaoPublica.webhookEventos,
  ambiente: 'teste',
  aula: {id: 'historia_192', versao: '1.0.0'},
  codigo: sessaoPrivada.codigo,
  convite: sessaoPrivada.convite,
  onStatus: estado => { statusVisivel.textContent = estado; }
});
coleta.registrar('inicio');
// Colocar no ponto em que a aula confirma a tentativa, após calcular a correção:
coleta.registrar('tentativa', {item_id: 'q1', correta: false});
coleta.registrar('pista', {item_id: 'q1', nivel: 1});
coleta.registrar('etapa_concluida', {item_id: 'q1'});
coleta.registrar('recurso', {recurso_id: 'animacoes', ativo: false});
// Alternativa para componentes desacoplados:
window.dispatchEvent(new CustomEvent('pedagogia:evento', {
  detail: {tipo: 'pista', dados: {item_id: 'q2', nivel: 1}}
}));
```

Após essa configuração inicial, o estudante não precisa clicar em enviar: há tentativa automática a cada 15 segundos, quando a rede volta e ao ocultar a aba. Cada lote leva até 20 eventos; espera confirmação real antes de retirar os eventos. Falha mantém mesmo lote/ID para reenvio. Não usa IA nem tokens de modelo por interação. Pode haver custo de hospedagem/execução e quota de Apps Script.

A fila guarda até 500 eventos em sessionStorage, sem persistir convite. Sobrevive a recarga na mesma aba; exige reintroduzir o acesso individual. Fechar a aba, limpar dados do navegador ou falha de armazenamento pode perder eventos ainda não enviados. Ocultar/fechar a página não garante entrega. Fila cheia recusa novos eventos com status explícito; não descarta silenciosamente os antigos. Esta versão não promete funcionamento offline permanente. Mostrar aviso de pendências e confirmação na interface; `parar()` interrompe novos registros/envios, `apagarFila()` remove pendências locais quando não há envio ativo, não apaga dados já recebidos. Não confundir fila sincronizada com conclusão pedagógica.

## Verificação

```sh
node automacoes/n8n/gerar-eventos.mjs
node coleta/build-server.mjs
node coleta/eventos/testes.mjs
node automacoes/n8n/testes.mjs
node coleta/testes.mjs
```

13 verificações novas com serviços simulados: eventos parciais, dados recusados, limites, configuração, ambiente, convite, recibo, persistência, duplicação/conflito, autorização, falha/recarga/reenvio, convite fora da fila e configuração/código do workflow. Importação real, CORS e browser continuam pendentes.

Referência primária consultada em 29/10/2026: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/ — POST, resposta por nó, URLs separadas de teste/produção e Allowed Origins.
