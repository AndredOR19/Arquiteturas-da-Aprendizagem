# Organização curricular do acervo — proposta 0.1.0 (04/11/2026)

## Decisão visual
O catálogo de aulas do estudante expõe **etapa/série, trimestre ou semestre, componente, tema, habilidade BNCC/RCG quando oficialmente confirmada e resumo de registro**. Não usar a data como rótulo da aula; datas continuam na base de histórico/registro docente. EJA é semestral. Organização geral: ano letivo interno → escola → etapa/série → período → matéria → tema.

## Referências normativas
- BNCC oficial: https://basenacionalcomum.mec.gov.br/app/11a/
- Calendário RS 2026: https://www3.educacao.rs.gov.br/calendario-escolar-de-2026
- Matrizes de referência RS: https://educacao.rs.gov.br/upload/arquivos/202202/17182418-matrizes-de-referencia-2022.pdf

**A BNCC não estabelece cronograma trimestral nacional de conteúdos**; distribuição das habilidades por período deve vir do plano da escola, RCG/matriz orientadora aplicável e sequência efetivamente adotada pela turma. Não inventar código, descrição ou vínculo de trimestre.

## Datas da rede estadual em 2026 (para classificação do período; não exibir nos cartões)
Regular: 1º tri 18/02–22/05; 2º tri 25/05–04/09; 3º tri 08/09–18/12.
EJA: 1º semestre 18/02–24/07; 2º semestre 03/08–18/12.
Datas fora dos intervalos não devem ser classificadas automaticamente. Classificar aula por data é apenas um **indício operacional de localização temporal**, não valida que aquele conteúdo pertença curricularmente ao trimestre. A atribuição definitiva é feita por plano docente.

## Campos públicos
```json
{
 "portal": {
  "ano_letivo": 2026,
  "categoria": "aula",
  "series": ["9º ano · EF"],
  "componentes": ["História"],
  "periodo": "3º trimestre",
  "habilidades_bncc": [
    {"codigo": "EXEMPLO_NAO_PUBLICAR", "descricao": "Substituir apenas por descritor oficial confirmado"}
  ],
  "resumo_registro": "Síntese objetiva do objeto trabalhado e da ação cognitiva da aula."
 }
}
```
O modelo acima é demonstrativo: nunca importar o marcador EXEMPLO_NAO_PUBLICAR como habilidade. Sem confirmação, usar `habilidades_bncc: []` e sinalizar a pendência na interface.

## Entrada na aula
O catálogo oferece acesso à aula pelo tema. Ao abrir:
1. Supabase Auth oficial para a conta escolar; a senha Google nunca é inserida em campo nosso.
2. Vínculo `auth_user_id → aluno_id` e matrícula anual confirmados por responsável institucional.
3. A matrícula validada e o `aula_id` definem a inscrição na aula sem duplicar cadastro.
4. Receptor central protegido registra sessão, tentativas, evidências e relatório automaticamente após recibo.
5. Identidade e progresso se compartilham entre Pages e Vercel **somente quando os dois frontends estiverem integrados ao mesmo receptor e versões compatíveis**.
6. Experiência sem login próprio do aluno usa convite individual revogável e mediação docente — nunca pede senha do Google em formulário HTML.
7. Sessões de Chromebook compartilhado exigem saída clara e prevenção de mistura de registros.

## Estado desta implementação
Ramificação experimental apenas:
- campo de filtro `Período letivo` na interface;
- rótulo de trimestre no cartão quando a origem tem data e se enquadra em 2026;
- rótulo de habilidades oficiais **quando comprovadas na fonte**; sem códigos fictícios;
- descrição resumida para registro docente.
A interface agrupa os materiais em seções visuais com cabeçalhos por trimestre/semestre e oferece filtro de período. Histórico interno de data preservado. A origem curricular de cada aula precisa de revisão docente. Login Google, auto-inscrição e coleta online de todas as aulas **não estão ativados** por esta mudança.

## Critérios de aceitação
- Testar filtro com 1º, 2º e 3º trimestre e EJA semestral, mais aulas sem período.
- Garantir que metadados de escolas de outro calendário não recebam classificação automática de 2026 indevida.
- Testar temas sem data, habilidades ausentes, no celular, e exportação docente.
- Validar que não apareçam dados de estudantes no acervo público.
- Não publicar na branch principal sem confirmar geração do portal e autenticação.
