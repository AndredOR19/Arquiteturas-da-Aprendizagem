# Registro e prevenção de repetição no apoio inclusivo

Diretriz do Prof. André, 13/11/2026. Complemento operacional 3.9.2 do Prompt Mestre. Não altera aulas publicadas nem sessões iniciadas.

## Registro obrigatório antes de produzir
Consultar `registro.json` e a última versão do banco da mesma série/componente. Registrar aula, versão, tema, palavras, situação, operação, imagem, assinatura da atividade e origem de retomadas. Aplicação em sala só muda de `nao_confirmada` após confirmação docente, em registro privado quando envolver alunos. Não registrar nomes, diagnósticos ou desempenho individual aqui.

O ID global combina aula, versão, fase e ID local. Os IDs locais atuais (por exemplo `ass-1-1`) se repetem entre aulas e não servem como identificador global.

## Comparação executável
Da raiz do repositório:

```sh
python3 automacoes/aulas/inclusao/auditar.py --write
python3 automacoes/aulas/inclusao/auditar.py --candidate ID-DA-NOVA-AULA
```

A segunda chamada termina com código 2 quando encontra coincidências de relação com outro banco. Não está integrada ao CI nem ao gerador privado: o produtor deve executá-la e anexar sua revisão antes da entrega. Não afirmar bloqueio automático da fábrica. O inventário abrange os sete `apoio/banco.json`; oito configurações HTML legadas são registradas separadamente por hash, sem alegar auditoria semântica completa delas.

Assinatura exata ignora ID/variant e inclui imagem-alvo; assinatura de relação também ignora distratores e compara palavra, ação, situação, resposta e imagem. Alterar somente distratores não cria conteúdo novo. Hashes não compreendem paráfrases: revisão humana continua obrigatória. Reuso de um desenho ou de uma palavra, isoladamente, não caracteriza aula repetida.

## Retomada permitida e cópia indevida
Retomada precisa apontar origem, finalidade, mudança de relação/cena/operação/apoio e critério da nova aplicação. Mesma palavra com nova operação pode ser progressão; mesma tarefa com outra cor, outro ID ou alternativas em outra ordem não conta como novidade. Não proibir repetições necessárias à alfabetização; torná-las intencionais e verificáveis. Não aprovar só por alcançar 96.

Para cada coincidência de uma aula nova, registrar revisão em arquivo próprio com IDs envolvidos, origem, justificativa, novidade observável e decisão (reformular ou retomada intencional). O detector permanece conservador e não dispensa o alerta por uma justificativa genérica. Bancos existentes ficam marcados para revisão, sem apagar respostas ou alterar o material no meio de uma sessão.

## Auditoria de 13/11/2026 — cinco aulas de sexta
Todos os bancos têm 96 associações + 96 frases opcionais, usando 12 palavras por fase em oito conjuntos. Não há duplicata literal interna após retirar ID e variant; isso não garante diversidade de relações ou cenas.

| Comparação | Atividades integralmente iguais* | Mesma relação/solicitação e resposta* | Desenhos-alvo iguais |
|---|---:|---:|---:|
| História 2ª série × História 1ª série | 4 associações + 12 frases | 56 associações + 49 frases | 8 |
| Frações 6º × Misturas 9º | 0 | 10 associações | 6 |

*Contagem de assinaturas únicas, considerando figura-alvo; segunda coluna ignora ID/variant, terceira também ignora distratores. As outras combinações e todos os IDs estão no registro. Coincidências entre componentes exigem avaliar o percurso do estudante, sem presumir que turmas diferentes receberam o mesmo material.

Conclusão: as cinco aulas não são cópias integrais, mas existe repetição parcial significativa, principalmente nos apoios das duas aulas de História. A mesma estrutura de oito conjuntos e o vocabulário reduzido também requerem revisão pedagógica; não afirmar 96 cenas diferentes. A conferência anterior de acesso às páginas não auditou essa diversidade.

Estado: registro e comparador implementados; bancos publicados preservados; reformulação pedagógica das coincidências e integração do controle à fábrica/CI pendentes. Nenhuma aplicação a alunos foi inferida.
