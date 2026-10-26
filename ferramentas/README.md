# Produção conectada

A Biblioteca de Diagramação fornece o motor e os modelos. Este repositório fornece o conteúdo. `biblioteca.lock.json` fixa o commit técnico conferido. Nenhum motor privado é copiado para este repositório público.

## Produzir pelo GitHub

Abra [Produzir Arquiteturas da Aprendizagem](https://github.com/AndredOR19/Biblioteca-de-Diagramacao/actions/workflows/produzir-aprendizagem.yml), clique em Run workflow e informe `todos` ou `projetos/demonstracao-slides`. Baixe `materiais-aprendizagem` na execução concluída. O fluxo roda na biblioteca privada e requer acesso a ela. Geração não publica sites.

## Produzir com os dois clones locais

Instale Python 3.11+, as dependências da biblioteca e Quarto 1.10.19. Faça checkout do commit indicado no lock em um clone limpo da biblioteca.

```bash
python ferramentas/produzir.py --biblioteca ../Biblioteca-de-Diagramacao novo slides projetos/minha-aula
python ferramentas/produzir.py --biblioteca ../Biblioteca-de-Diagramacao validar todos
python ferramentas/produzir.py --biblioteca ../Biblioteca-de-Diagramacao compilar projetos/demonstracao-slides
```

Substitua `slides` por `documento`, `artefato` ou `html` para outras saídas. Um novo modelo contém campos que precisam ser preenchidos antes da produção. Preserve as aulas existentes; a integração não migra automaticamente HTMLs antigos.

## Uso pelo assistente

1. Cumpra a consulta a AGENTS, prompt mestre, histórico e currículo pertinente.
2. Confira o lock e leia somente o modelo e as instruções técnicas necessários na biblioteca.
3. Prepare o conteúdo específico e as fontes. Não substitua a explicação extensa por slides resumidos.
4. Valide, compile e confira cada formato. HTML e PPTX podem ter diferenças de aparência.
5. Registre aperfeiçoamentos no prompt vigente e no histórico. Atualize o lock apenas depois de testar a nova revisão.

Não há economia percentual garantida de tokens. O ganho vem de reutilizar o motor e limitar as leituras técnicas ao necessário. Guias e respostas docentes ficam fora do pacote público, inclusive de notas dos slides.

O exemplo de slides é uma demonstração transversal, sem turma, horário ou código curricular inventado. Um material de aula real exige confirmar esses dados e acrescentar imagens e fontes específicas do tema.
