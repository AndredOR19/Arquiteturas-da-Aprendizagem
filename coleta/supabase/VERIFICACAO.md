# Verificação do receptor e piloto — 31/10/2026

## Confirmado
- Organização existente no plano free; projeto ativo. Nenhum recurso pago criado.
- Receptor coleta-educacional implantado com autorização individual própria; não depende de JWT público como autorização. A validação de convite ocorre no servidor. Dados não podem ser lidos por esse endpoint.
- Teste HTTP no serviço real: entrada válida; turma divergente recusada; evento e reenvio confirmados; mesmo ID com outro conteúdo recusado; relatório incompleto recusado; relatório integral e reenvio com mesma revisão confirmados.
- Readback administrativo inicial: uma sessão, um evento, um relatório, todos fictícios. Testes não representam aplicação escolar.
- Contrato local: campos obrigatórios, convite, eventos e completude/avaliação obrigatória. Advisors de segurança: somente 12 INFO de RLS sem policies, negação intencional do acesso direto.

## Conferências em andamento
- Navegador: entrada, erro, fila/rede, retomada, 26 percursos, avaliação, relatório e celular, com teste próprio do workflow. Ensaios com receptor simulado devem ser declarados separadamente de teste ponta a ponta real.
- Publicação do novo link piloto e teste pelo navegador final.

## Pendências operacionais
Lista nominal conferida e acessos individuais dos alunos reais; teste no Chromebook físico da escola; painel docente e duração detalhada. Links legados não foram migrados. Nenhum dado real de estudante foi inserido nesta implantação.
