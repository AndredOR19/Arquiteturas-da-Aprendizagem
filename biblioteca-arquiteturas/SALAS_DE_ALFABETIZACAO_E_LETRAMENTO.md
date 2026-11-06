# Salas de Alfabetização e Letramento — Arquiteturas da Aprendizagem
Versão: 1.0.0 · 03/11/2026 · Diretriz: Prompt Mestre 2.30.0, seção 34.

## Decisão
Todas as aulas novas oferecem uma rota curricular e uma rota opcional de alfabetização/letramento com retorno de progresso independente. Não separar permanentemente estudante da turma. Sem etiqueta diagnóstica ou nome de aluno no portal. O professor pode criar aulas específicas de alfabetização e disponibilizá-las na Biblioteca, sem misturá-las automaticamente às notas de História, Arte, Matemática etc.

## Organização
- **Sala 01 — Ver e nomear:** objeto/ação/imagem, nome oral e contexto; explicar a relação com o tema.
- **Sala 02 — Ouvir e distinguir:** consciência de palavras, sílabas, rima e fonemas com instrução oral.
- **Sala 03 — Ligar letra e som:** correspondência grafofonêmica explícita e prática com exemplos variados.
- **Sala 04 — Formar palavras:** composição, segmentação, decodificação e leitura de palavras.
- **Sala 05 — Construir frases:** ordem, sentido, leitura/escuta de frases curtas, produção oral/por toque.
- **Sala 06 — Letramento real:** placas, bilhetes, listas, instruções, etiquetas, legendas e situações da comunidade.
- **Sala 07 — Jogos de recuperar:** trilha, memória de sons, dominó grafema–som, bingo e classificação por categorias.
- **Sala 08 — Ponte curricular:** vocabulário/representações do assunto da turma; aplicação nova, sem repetir perguntas.

## Cartão de especificação por jogo
```yaml
id: sala-03-grafema-som
objetivo_de_leitura: reconhecer correspondência explícita entre letra e som em palavras conhecidas e inéditas
objetivo_curricular_relacionado: opcional, informado por aula
idade_publico: livre
entrada: imagem|audio|texto
saida: toque|fala|montagem|escrita
pistas: 3
apoio_sem_leitura: verdadeiro
criterio_de_avanco: evidencia da habilidade, não somente clique correto
registro: opcional e separado da nota curricular
```

## Exemplo de implementação diária
**Turma:** 182 · **Objetivo imediato:** relacionar palavras de uma aula de Estudos Orientados a imagem/voz e reconhecer sons iniciais, conforme mediação.
**Início:** mostrar e ouvir duas palavras familiares do tema, com cena e objeto.
**Mecânica:** falar nome, identificar som inicial, escolher a letra em outro exemplo; reduzir pistas.
**Avaliação:** observar associação sem ajuda, reconhecimento do som e aplicação em palavra nova; aceitar resposta oral/tátil.
**Ajuste:** oferecer retorno ao modelo e escolha de outras palavras; não registrar "não alfabetizado" como resultado automático.

## Quantidade mínima e automação
Cada apoio opcional oferece no mínimo 26 percursos significativos, independentes dos curriculares e da nota (Prompt Mestre 3.4.0, seção 34.4.1). O recurso compartilhado oferece 28 por área: sete palavras com quatro operações diferentes. O empacotador valida quantidade, unicidade e referências antes da publicação. Não contar áudio, instruções ou novas tentativas como percursos. Testes em `publicacao/alfabetizacao/testar.py`; adaptação por aula e avaliação docente continuam necessárias.

## Contrato de interface
- Entrada da sala em todas as aulas novas, título amigável e sem exposição da dificuldade individual.
- Uma operação principal por tela; modos claro/escuro com contraste AA; controle de tamanho/fonte e movimento.
- TTS pt-BR com botão iniciar, repetir e parar; texto alternativo e mediação sem áudio.
- Foco visível, teclado/Chromebook, botões amplos, palavras ligadas ao significado. Não depender só de emoji.
- Voltar à aula preserva ambas as atividades.
- Pistas explicam a relação; erros geram orientação, não exposição pública nem punição.
- Avaliação de leitura/letramento separada de avaliação da disciplina.
- Dados pessoais e planos individualizados permanecem em área docente privada.

## Implementado versus previsto
**Existente:** `publicacao/alfabetizacao/index.html` fornece um banco compartilhado de 28 atividades por área (imagem, palavra, sílaba inicial e frase/contexto), com áudio opcional, com link pelo acervo; `publicacao/imagens/` já reúne suporte por imagens.
**Previsto, não concluído:** oito salas independentes com progressão, banco por matéria/idade, coleta granular da sala, painel de habilidades, adaptação a partir de evidências, jogos multiformato e testes de campo. Não declarar esses recursos ativos antes da implementação e auditoria.

## Indicadores de avaliação pedagógica
Registros possíveis (quando instrumentados): tarefa, objetivo, resposta/produção, primeira tentativa, pistas, tempo de interação, transferência, comentário docente. Não converter clique/tempo/reprodução de voz em diagnóstico, presença ou comprovação de escuta.

## Privacidade
Nome, turma e professor da coleta livre são dados autodeclarados. Evitar coleta excessiva, identificar institucionalmente responsáveis, autorizar tratamento conforme LGPD e proteger dados de menores. Nunca publicar PEI, nome ou situação individual no código público.

## Próximo passo técnico
1. Publicar rotas de salas no GitHub Pages e verificar links.
2. Criar jogos específicos por conteúdo/competência, com testes automáticos e avaliação de contraste.
3. Aplicar aula piloto com mediação e coletar comentário docente sem identificar estudantes em relatório público.
4. Integrar eventos de alfabetização ao painel privado somente após revisão das permissões e validação ponta a ponta.
