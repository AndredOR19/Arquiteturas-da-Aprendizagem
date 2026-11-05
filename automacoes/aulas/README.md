# Produção de aulas — contrato entre duas bibliotecas

## Estado real
- O GitHub Pages **já tem publicação automática por push em main** através de `.github/workflows/static.yml`, a partir do catálogo `publicacao/catalogo.json`. O Vercel tem conexão Git por projeto; o piloto Matemática 172 foi corrigido no commit `774faa0`.
- A **Biblioteca de Diagramação** é privada: `AndredOR19/Biblioteca-de-Diagramacao`. Seu `docs/INTEGRACAO-APRENDIZAGEM.md` e workflow `produzir-aprendizagem.yml` já permitem **compilar projetos existentes**, com revisão de motor fixada em `ferramentas/biblioteca.lock.json`. Esse workflow é manual; não gera conteúdo novo de um tema por IA sem provedor configurado.
- `.github/workflows/validar-aulas-aee.yml` verifica pedidos em PR e execução manual. **Não cria aulas, não acessa o repositório privado nem publica automaticamente no merge por conta própria.**
- A publicação de aulas completas ocorre após revisão, aprovação e inclusão no catálogo público; uma alteração na ramificação principal aciona o Pages existente. Verifique separadamente Vercel e URL de cada aula.

## Circuito executável pela IA autorizada
1. Leia `AGENTS.md`, Prompt Mestre, `biblioteca-arquiteturas/PROTOCOLO_IA.md`, planejamento e `prompts/FLUXO_03_TERRITORIO_EXPERIENCIAS.md`.
2. Leia, **no repositório privado autorizado**, `Biblioteca-de-Diagramacao/AGENTS.md`, `docs/INTEGRACAO-APRENDIZAGEM.md`, `estacao/README.md`. Confirme `ferramentas/biblioteca.lock.json` e escolha componente/modelo real versionado. Nunca invente componente.
3. Grave o pedido em `automacoes/aulas/pedidos/*.json`, a composição docente em área autorizada, e implemente os quatro artefatos. É obrigatório distinguir `rascunho`, `pronto_para_revisao` e `aprovado`.
4. Teste objetivo, relações, feedback, recuperação, transferência, acesso por imagens/voz, regras de jogo e consistência do relatório; use dados fictícios.
5. Abra PR. O workflow `Validar pedidos e aulas AEE` faz **pré-validação estrutural**. Não confunda o teste sintático com teste de aprendizagem ou navegador.
6. Após aprovação e merge autorizados, cadastre a aula em `publicacao/catalogo.json` seguindo a estrutura vigente. `static.yml` prepara e publica o acervo público; confira o build, links, HTTP 200, JS e CSS. O portal Vercel e projetos independentes exigem configuração Git correspondente; não pressupor implantação sem teste.
7. Registre versões, commits, endereços finais, evidências e pendências. Gere QR apenas após confirmar a URL.

## Fase futura de automação total
Para **gerar novas aulas a partir apenas de um tema e publicá-las sem operação manual**, é necessário configurar um executor de IA autorizado (modelo/API ou agente), permissões de acesso à biblioteca privada, políticas de aprovação e orçamento. A conexão de produção privada existente não é um gerador de conteúdo autônomo. Não disparar geração paga ou publicação irrestrita sem este contrato.

## Privacidade
Nunca copiar o motor privado, originais curriculares reservados, gabaritos docentes nem dados pessoais para o site público. Não criar chaves ou tokens neste repositório.
