# n8n — integração das Arquiteturas

Responsável pedagógico e autor das formulações: Prof. André de Oliveira Rodrigues.
Versão técnica: 0.1.0. Registro: 28/10/2026.

## Estado verificável

Primeiro workflow JSON preparado para importação, inativo e em modo teste. Cliente de coleta aceita n8n mediante opção explícita. Treze ensaios novos e os 23 anteriores da coleta passaram localmente, com serviços simulados. Não houve importação, execução na plataforma n8n, implantação Apps Script ou envio real. Nenhuma aula foi migrada. Não há coleta permanente ativa.

## Primeiro circuito implementado

Artefato → webhook n8n → contrato compartilhado → receptor Apps Script existente → planilha privada → protocolo → artefato.

O n8n reutiliza o contrato e a persistência existentes em coleta/, sem criar outra planilha ou contornar convites individuais. A validação completa é executada antes de encaminhar e novamente no servidor. Protocolo só vem da persistência; a resposta final remove envelope, relatório e convite. O cliente confere também o hash do conteúdo. A nota e a opinião do estudante continuam separadas.

Arquivo para importar: [receber-relatorios.json](receber-relatorios.json). Fontes: [gerar.mjs](gerar.mjs), [logica.mjs](logica.mjs) e coleta/contrato.js. Regenerar o JSON sempre que essas fontes mudarem.

## Ativação na instância

1. Implantar e testar o receptor conforme [coleta/README.md](../../coleta/README.md), usando a planilha privada existente. Manter convites fora de arquivos públicos.
2. Importar receber-relatorios.json em uma instância n8n acessível por HTTPS. Manter inativo até o teste; usar a URL de teste com o listener aberto.
3. No nó Configurar receptor, substituir PREENCHER pelo endereço /exec efetivamente implantado. Preservar ambiente teste. O destinatário não é aceito a partir da requisição do aluno.
4. Conferir CORS no webhook e no nó de resposta: origem https://andredor19.github.io, sem barra ou caminho. O POST do cliente é text/plain e não usa credenciais de navegador. CORS não substitui convite ou proteção contra abuso; limites de requisição e acesso ao editor devem ser configurados na infraestrutura.
5. Conferir na instância as configurações de não salvar execuções bem-sucedidas, falhas, manuais ou progresso; remover dados fixados. Usar somente dados fictícios em testes do editor. Rever também logs, backups e políticas do provedor, pois o fluxo processa dados privados em memória.
6. Enviar fixture fictício com convite de teste privado. Conferir protocolo no navegador, ID/hash, linha em Entregas e todas as partes em Relatorios. Reenviar sem duplicar. Interromper a conexão e conferir que não há sucesso falso.
7. Publicar o workflow e usar a Production URL. A publicação do n8n não muda o ambiente dos dados: configurar produção somente após teste real aprovado e ativação correspondente no receptor. Migrar uma aula identificada e testar o ciclo completo antes de ampliar.

O workflow não envia e-mail. Preserva-se a alternativa já documentada de abrir o aplicativo com o relatório completo. Alertas/e-mail automáticos e painel de acompanhamento exigem etapas próprias.

## Cliente

```js
import {criarColetor} from '../../coleta/cliente.mjs';
const coletor = criarColetor({
  endpoint: URL_HTTPS_DA_INSTANCIA + '/webhook/arquiteturas-relatorios-v1',
  transporte: 'n8n',
  timeoutMs: 55000
});
// Mesmo contrato, convite individual, recibo, reenvio e bloqueios anteriores.
const recibo = await coletor.enviar(payload, conviteIndividual);
```

Usar a URL exata retornada pela instância; o trecho acima é um ponto de integração, não uma aula já migrada. Nunca incluir token administrativo n8n ou GitHub no HTML. Não tratar retorno HTTP 200 ou início do workflow como confirmação; exigir o recibo correspondente ao snapshot.

## Evolução solicitada pelo autor

O [ciclo de observação e aperfeiçoamento](CICLO_DE_APERFEICOAMENTO.md) liga progresso, relatos do professor, metadados, arquiteturas e propostas versionadas. O recebimento de entregas finais está preparado em código; eventos durante a aula, entrada contínua de insights, análise integrada e criação automática de propostas ainda não estão implementados. Livros, Gamma e produção editorial permanecem frentes posteriores, sem novos fluxos ativados por esta entrega.

## Verificação reproduzível

Na raiz do repositório:

```bash
node automacoes/n8n/gerar.mjs
node automacoes/n8n/testes.mjs
node coleta/build-server.mjs
node coleta/testes.mjs
```

Treze ensaios n8n: configuração incompleta, URLs, modo teste, contrato, questionário, recibos, preservação de dados, perda de confirmação, reenvio, ligações do grafo e execução do código dos nós em sandbox. Vinte e três ensaios anteriores: persistência simulada, convites, bloqueios, falha parcial, idempotência e acompanhamento longitudinal. Nenhum desses ensaios comprova importação/execução real no n8n ou CORS no dispositivo do aluno.

Referências primárias consultadas em 28/10/2026:
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/
- https://docs.n8n.io/workflows/settings/


## Eventos parciais automáticos — 29/10/2026

Novo circuito implementado separadamente: [integração e limites](../../coleta/eventos/README.md), [workflow inativo](receber-eventos.json). Cliente envia interações instrumentadas em lotes, com convite e confirmação de persistência. Testes locais simulados; importação, implantação, integração nas aulas e teste real pendentes. Esta atualização substitui apenas a indicação anterior de que eventos parciais ainda não tinham código; insights e análise integrada continuam pendentes.
