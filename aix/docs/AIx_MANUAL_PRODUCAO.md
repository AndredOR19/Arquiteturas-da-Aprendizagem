# AIx — MANUAL DE PRODUÇÃO (do pedido à publicação)

## 1. Pedido
O professor descreve em uma frase: **turma + série + componente + período + tema**. Sem turma, a fábrica recusa (registro em `aix/jobs/`). Exemplo real: o pedido do piloto 231.

## 2. O que sai do pedido
Um **Contrato Universal** (`aix/experiences/…/<id>.json`) com currículo rastreado, movimentos pedagógicos, acessibilidade, rubrica de apoio e **pendências explícitas** (`blockers`). Conteúdo autoral (ambientes, missões, fontes) entra por `--conteudo` — a fábrica nunca o inventa.

## 3. Revisão docente (obrigatória)
Abrir `preview-acessivel.html` ao lado do contrato. Conferir: (a) habilidades BNCC — confirmar as que estão `confirmed:false` com a fonte oficial; (b) período/tema — a classificação por data é só indício, a atribuição definitiva é do plano docente; (c) fontes — verificar cada `verified:false` antes de qualquer uso em aula; (d) redação das missões.

## 4. Aprovação (vinculada à versão exata)
Aprovar é declarar, no contrato: `status:"approved"`, `approvedBy`, `approvedAt` e conferir o `artifactSha256`. O validador **recusa** aprovação se houver qualquer blocker. Mudou qualquer campo ⇒ sha muda ⇒ precisa reaprovar. Nunca aprovar em nome de terceiros.

## 5. Publicação (reusa a cadeia existente)
1. PR com os artefatos (contrato + conteúdo + prévia) para o repositório.
2. Revisão e merge (a cadeia de 13 checks roda; nada contorna).
3. Workflows existentes: static → `publicar-pages` → conferência pós-publicação → **QR só depois de endereço válido confirmado**.
4. Registrar a publicação (`aix.publicacoes` quando a migração for autorizada; enquanto isso, o próprio commit é o registro).

## 6. Versões e rollback
- **Versionar pelo commit**: cada publicação referencia o commit exato; o contrato carrega `artifactSha256`.
- **Corrigir**: novo pedido/edição ⇒ novo contrato ⇒ nova aprovação ⇒ novo merge. Nunca editar artefato publicado diretamente.
- **Rollback**: `git revert` do merge na main + reexecução da cadeia de publicação (o Pages volta ao estado anterior). Os contratos antigos permanecem no histórico — nada se perde.
- **Suspender**: remover o HTML do catálogo num commit revertível; o painel docente mantém os registros já coletados.

## 7. Durante a aula
A prévia acessível roda offline no navegador; registros ficam na sessão (padrão de eventos da coleta) e o relatório é copiado/baixado. Presença oficial ≠ participação: o relatório é **apoio à leitura docente**, nota sempre revisável, nunca diagnóstico automático.

## 8. Depois da aula
O professor lê os relatórios, registra o que observou no planejamento (banco-pedagógico) e decide ajustes. A fábrica não altera nada automaticamente — cada ciclo recomeça no passo 1.
