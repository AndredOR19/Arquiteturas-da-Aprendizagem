# Laboratório de Aulas Jogáveis — AEE/MACI

Protótipo isolado em `feature/laboratorio-aulas-jogaveis`; **não publicado** no portal principal.

## Objetivo
Transformar atividades do acervo em experiências manipuláveis, sem substituir a exposição causal, a acessibilidade, a verificação de entendimento ou o registro docente.

## Motores e seleção
- **HTML/Canvas nativo**: primeiro fallback, offline e leve.
- **p5.js**: simulações, probabilidade, gráficos e arte generativa.
- **Phaser 4**: missões, mapas 2D, física e jogos narrativos.
- **Kaplay**: protótipos curtos.
- **PixiJS**: visualizações avançadas.
- **3D**: somente com justificativa pedagógica e fallback 2D.

Cada motor deve ser carregado apenas na aula que o utiliza. Fixar versão e manter arquivos locais quando for necessária operação offline.

## Fluxo AEE/MACI
1. **Entender**: questão e objetivo, com áudio/imagem.
2. **Observar**: experiência com manipulação, hipótese e feedback.
3. **Percursos**: diferentes relações, sem repetição mecânica do mesmo item.
4. **Explicar**: transferir a descoberta a uma situação nova, registrar evidência e revisão docente.

Erro não é simplesmente punição: aciona uma intervenção de aprendizagem, progressiva até 4 percursos, sem repetição de tentativas aleatórias ou bloqueio infinito. Adaptar extensão para educação inclusiva.

## Contrato de eventos — futuro adaptador Supabase
A experiência emite `CustomEvent("aee:game-event", {detail: {...}})` no elemento `window`.
Campos mínimos: `schemaVersion`, `lessonId`, `eventType`, `timestamp`, `payload`. Nunca incluir nome, turma, escola, identificador persistente ou segredo nos logs públicos. O receptor autenticado e autorizado do sistema deverá associar eventos à sessão no servidor, com validação e consentimento apropriados; **a coleta ainda não está conectada**.

Eventos sugeridos: `experiment_started`, `hypothesis_submitted`, `trial_completed`, `explanation_submitted`, `support_used`, `lesson_completed`.

## Organização
- `exemplos/probabilidade-ef07ma37/index.html`: protótipo 100% local (não exige CDN).
- `modelos/aula-jogo.schema.json`: contrato declarativo de aula-jogo.
- Futuro: `motores/phaser/`, `motores/p5/`, `motores/kaplay/`, `adaptadores/supabase/`, `testes/`.

## Critérios de aceite antes da publicação
- Testar no Chromebook real, teclado/toque, baixa conectividade e sem WebGL.
- Audiodescrição/alternativa textual para informação não visual; controles acessíveis.
- Não enviar dados pessoais para GitHub ou telemetria de terceiros.
- Verificar cálculo probabilístico e variações de amostra.
- Revisão do professor para nota e presença; não equiparar abertura de jogo à presença.
- Testar no Vercel e Pages sem expor documentos privados.
