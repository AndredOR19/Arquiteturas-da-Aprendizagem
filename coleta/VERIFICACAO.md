# Conferências do coletor 1.0.0
28/10/2026.

## Concluído
- Planilha criada como Google Sheets, conta proprietária e acesso privado conferidos por metadados.
- Quatro abas: Painel, Entregas, Relatorios e Acessos; fuso America/Sao_Paulo.
- Fórmulas do painel conferidas no serviço nativo; zero registros de estudantes, sem dados reais.
- Workbook local renderizado nas quatro abas antes da importação; exportação nativa usada para conferência visual de conversão.
- Receptor e cliente implementados; contrato de dados e avaliação obrigatória compartilhados no build.
- Dezoito ensaios locais aprovados, usando serviços Google simulados: validade de dados, todas as perguntas obrigatórias, opiniões negativas sem efeito no cálculo, comentários condicionais, atividades incompletas, gravação integral, protocolos, duplicações, conflitos, convites inválidos/expirados/inativos, modo teste, concorrência ocupada, falha parcial, relatórios em partes, injeção de fórmulas tratada como texto, perda de confirmação, recibo incompatível e persistência indisponível.

## Ainda pendente
- Projeto Apps Script vinculado à planilha, autorização e implantação real.
- Endereço /exec, ativação em modo teste e convite emitido no Google.
- POST real do navegador de origem, confirmação, readback e reenvio sem duplicação no Google.
- Validação de acesso pelos dispositivos da escola e eventuais restrições da conta.
- Integração e testes nas aulas existentes; nenhuma foi migrada nesta entrega.
- Ativação de produção e primeiros registros efetivos.

Não interpretar teste simulado como recebimento de estudante. Não há monitoramento automático de novas entregas nesta conversa.


## Extensão longitudinal de 28 de outubro de 2026
Cinco ensaios adicionais, totalizando 23: texto/JSON preservados, campos e datas inválidas recusados, ausência distinta de zero, persistência integral no receptor simulado e mesmo aluno com matrículas de 2026/2027. Code.gs regenerado da fonte compartilhada. Nenhum teste real de navegador, implantação ou migração de aula foi realizado nesta extensão. O estado online permanece não implantado.
