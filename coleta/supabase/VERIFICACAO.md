# Verificação do receptor e piloto — 31/10/2026

## Confirmado
- Organização existente no plano free; projeto ativo. Nenhum recurso pago criado.
- Receptor coleta-educacional implantado com autorização individual própria; não depende de JWT público como autorização. A validação de convite ocorre no servidor. Dados não podem ser lidos por esse endpoint.
- Teste HTTP no serviço real: entrada válida; turma divergente recusada; evento e reenvio confirmados; mesmo ID com outro conteúdo recusado; relatório incompleto recusado; relatório integral e reenvio com mesma revisão confirmados.
- Readback administrativo inicial: uma sessão, um evento, um relatório, todos fictícios. Testes não representam aplicação escolar.
- Contrato local: campos obrigatórios, convite, eventos e completude/avaliação obrigatória. Advisors de segurança: somente 12 INFO de RLS sem policies, negação intencional do acesso direto.

## Navegador e publicação conferidos
- Endereço público abriu com os quatro campos e acesso individual, mantendo conteúdo oculto/inativo antes da identificação. Envio vazio recusado pelo navegador.
- Ensaio próprio com receptor simulado: identificação incorreta, falta de rede, fila/reenvio, 26 percursos, avaliação vazia recusada, relatório completo, não duplicação sem mudanças, recarga com nova identificação e layout móvel. Inclui apoio por imagens somente após entrada.
- Ensaio com navegador Chromium e página pública, receptor e banco reais, usando cadastro fictício temporário: entrada → erro inicial/pista → 26 percursos → todas as respostas da avaliação → confirmação → recibo de relatório.
- Readback administrativo: ambiente teste, sessão concluída, 56 eventos, 26/26 conclusões, 25 primeiros acertos, indicador 9,6, avaliação preenchida/confirmada e texto integral com mais de 10 mil caracteres. Esses números são ensaio técnico, não resultados de alunos.
- Cadastro e registros fictícios removidos após conferência. Readback final: zero alunos, sessões, eventos e relatórios; cadastro institucional do piloto permanece, sem acessos de alunos reais.
- Regressão de empacotamento: apoios de imagens aguardam a identificação no piloto e usam chave por sessão; os testes gerais verificam o bloqueio e o ensaio específico verifica os apoios após entrada. Legados mantêm a inicialização anterior. Testes locais do piloto usam saída HTML real do empacotador; apenas a demonstração de slides foi substituída por fixture nesse ensaio local, pois Quarto não está instalado. Slides e fluxo completo são conferidos remotamente.

## Pendências operacionais
Lista nominal conferida e acessos individuais dos alunos reais; teste no Chromebook físico da escola; painel docente e duração detalhada. Links legados não foram migrados. Nenhum dado real de estudante foi inserido nesta implantação.
