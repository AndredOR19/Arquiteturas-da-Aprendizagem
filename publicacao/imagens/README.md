# Aprender com imagens e áudio

Propositor: Prof. André de Oliveira Rodrigues — 29/10/2026, Vacaria/RS. Versão técnica 1.0.0.

Arquitetura permanente: biblioteca-arquiteturas/plantas/imagens-voz-palavra.md. Fonte normativa: seção 11.2 do Prompt Mestre 2.19.0. Capítulo em desenvolvimento: livros/integracao-estetico-semantica/CAPITULO_ACESSO_IMAGENS_VOZ.md.

## Acesso do estudante

Botão visível junto ao título: Aprender com imagens e áudio. Abre seção própria, sem solicitar diagnóstico, digitação ou leitura como condição de resposta. A primeira ação lê orientações curtas; o botão Ouvir a explicação da aula com imagens narra quatro cenas e destaca a correspondente. Os cartões apresentam objeto, cor/forma, palavra e frase; o toque solicita voz e permite repetir a palavra e sua letra inicial, visualmente destacada. O apoio não é apenas ajuste de fonte.

Depois de explorar as quatro palavras, há reconhecimento de palavra/imagem e aplicação em outra representação, com alternativas em ordem variável, pistas, feedback falado e registro separado das tentativas. Não é obrigatório concluir esse treino para usar a aula. Concluir não libera nota, não substitui os 26 percursos e não contorna a avaliação final. O objetivo é acesso inicial ao assunto; não foi feita conversão integral de todos os comandos/atividades da aula para um percurso sem leitura.

As cenas são SVGs autorais e selecionáveis como elementos de interface; não são fotos ou documentos históricos. O texto não fica achatado nas imagens. A paleta das cenas descreve objetos concretos e não redefine D/R/E/L. Pistas de cor vêm acompanhadas de forma, posição e descrição. A narração de documento em História explicita origem/data/contexto; a de ponte explicita comparação entre formas com papel/distância/carga comparáveis.

## Conteúdo por material

Configurações em conteudos.js:
- História 192 (21/10 e 29/10) e História 231: informação, documento, mensagem, diálogo e participação.
- Ensino Religioso 192: comunicação, escuta, diálogo e acordo respeitando diferenças.
- Missão Ponte 6º e 7º: papel, dobra, carga e registro.
- Laboratórios Aprender a aprender e Conectar e investigar: observar, comparar, registrar e revisar.

Novas aulas precisam cadastrar conceitos, cenas e narrativa próprios. Não usar um conjunto genérico como se cobrisse qualquer tema. Respeitar a idade e as necessidades observadas; referências de HQ/animação são possibilidades de composição, não franquias/personagens reproduzidos ou pré-requisito do acesso.

## Voz e dispositivos

Síntese de voz do navegador, iniciada por ação do usuário, preferindo voz selecionada na aula ou pt-BR disponível. Não há áudio gravado contratado, API paga ou promessa de voz específica. As quatro cenas são encadeadas pelo evento de término de cada fala; a próxima recebe destaque ao iniciar. Repetir outra fala ou Parar áudio cancela a sequência. Sem voz, aviso e mediação docente são necessários; o HTML não resolve sozinho ausência de áudio, barreiras de visão ou compreensão dos símbolos. Testar fones, vozes e controles no dispositivo real antes da aplicação.

## Registro e relatório

O estado do apoio usa sessionStorage por aula: recarga na mesma aba preserva; fechar a aba/limpar os dados pode apagar. Há limite de 200 entradas por tipo de evento com aviso ao atingir; sem descarte silencioso dos antigos. Botão Apagar registro deste apoio não apaga a aula principal; apagar a aula principal não substitui esse botão do apoio. Uso de dispositivo compartilhado requer encerrar e limpar também esse registro. Não há sincronização, coleta online, nome ou diagnóstico nesse módulo.

O adaptador anexa a seção APRENDER COM IMAGENS E ÁUDIO ao fullReport após liberação normal. Inclui cenas selecionadas, pedidos de áudio, tentativas, pistas, recuperação e aplicação; pedido de áudio não comprova escuta. O relatório original mantém nota e bloqueios. Materiais com outras funções de relatório não recebem esses dados automaticamente; não afirmar integração universal. ImageLearning.snapshot() e .report() expõem o registro local para adaptadores autorizados, sem publicar dados.

## Manutenção e verificação

O empacotador publicacao/preparar.py copia estes recursos para _site/_recursos/imagens e injeta nos HTMLs cadastrados. Não altera Gamma, impressos ou slides externos. O script ferramentas/conferir-imagens.cjs testa os oito HTMLs, interação por teclado, voz simulada, erro/pista, aplicação, recarga, largura de celular, falta de voz e nota/relatório. Ver VERIFICACAO.md para o estado real. Teste de síntese simulada não comprova áudio ouvido em Chromebook nem eficácia pedagógica.
