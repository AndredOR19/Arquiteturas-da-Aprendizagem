# Base curricular e documental

Este diretório é o ponto de entrada para BNCC, Referencial Curricular Gaúcho (RCG), orientações SEDUC-RS, EJA/EJATEC e documentos institucionais. Consulte [catalogo.json](catalogo.json) antes de usar uma fonte.

## Situação inicial — 26/10/2026
A estrutura está preparada. Os arquivos oficiais ainda não foram incorporados nesta atualização. Não confundir pastas previstas e metadados com conteúdo disponível para consulta.

## Organização prevista
| Caminho | Conteúdo |
| --- | --- |
| bncc/ | BNCC por etapa e versão |
| rcg/ | Referencial Curricular Gaúcho por etapa e componente |
| seduc-rs/ | Matrizes, orientações e documentos da rede |
| eja-ejatec/ | Documentos específicos da modalidade |
| institucional/ | Documentos escolares autorizados, sem dados pessoais desnecessários |
| extracoes/ | Texto extraído dos arquivos, com vínculo ao original |
| mapeamentos/ | Relações conferidas entre documentos e habilidades |

Criar as pastas de conteúdo quando houver documentos a incorporar. Não inventar arquivos vazios com aparência de documento oficial.

## Entrada de um documento
1. Identificar o título completo, órgão emissor, ano/versão, etapa, componente e proveniência.
2. Preservar o arquivo original com nome legível e estável.
3. Registrar caminho, data de incorporação, URL oficial quando conferida e SHA-256 do arquivo quando calculado.
4. Se houver extração de texto, manter vínculo ao original e verificar amostras, tabelas, códigos e paginação.
5. Marcar o status como disponível somente após confirmar que o arquivo existe e pode ser lido.
6. Registrar substituições sem apagar a identificação da versão anterior.
7. Atualizar o histórico e realizar commit.
8. Não subir informações identificáveis de estudantes nem documentos restritos sem autorização pertinente.

## Uso nas aulas
Citar documento, versão e habilidade consultados. Diferenciar texto oficial de síntese didática. Não inferir equivalências BNCC/RCG automaticamente. Se a referência estiver pendente, informar a limitação e consultar a fonte oficial quando possível.

## Status do catálogo
- aguardando_documento: não há arquivo incorporado.
- recebido_a_conferir: arquivo recebido, verificação incompleta.
- disponivel: arquivo legível, proveniência e versão identificadas.
- substituido: preservado como histórico; há versão mais recente indicada.
