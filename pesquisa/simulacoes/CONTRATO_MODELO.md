# Contrato para incorporar qualquer arquitetura ao laboratório

## Identificação e domínio
ID permanente, título, autor, versão e fontes. Classificar como pedagógica/empírica, formal, simbólica/filosófica ou outro domínio explicitado. Registrar o corpus efetivamente consultado. Arquiteturas externas entram em arquiteturas_externas.json; as pedagógicas vêm do catálogo principal.

## Pergunta modelável
Definir qual pergunta o modelo pode responder, variáveis observáveis ou símbolos formais, unidades, regras, entradas e saídas. Uma relação conceitual não vira automaticamente coeficiente numérico. Distinguir parâmetro observado, referência da literatura, ajuste do modelo e escolha ilustrativa.

## Hipóteses concorrentes e testes
Prever ausência de benefício, limites e consequências incompatíveis com a hipótese. Em modelos empíricos, definir calibração e validação com dados adequados, conservando parte das observações para exame fora do ajuste. Em modelos formais/simbólicos, especificar axiomas, regras, verificações de consistência e o que permanece fora do alcance do modelo. Coerência interna não estabelece verdade empírica ou metafísica.

## Implementação e registro
Adicionar módulo de código e testes, explicitar dependências e configurar o despachante. Cadastrar em catalogo_modelos.json e criar os vínculos de cobertura. O despachante atual aceita apenas planejamento individual e por turmas; adicionar um vínculo mecanístico antes da implementação gera erro explícito. Não executar código arbitrário indicado em dados de cenário.

## Evolução com resultados
Conservar resultados, código, fonte, configuração, semente e ambiente de cada execução. Registrar qual evidência motivou cada mudança. Atualizar parâmetros em nova versão, sem sobrescrever a experiência anterior ou promover resultados sintéticos a observações. Separar estados: documentado, formalizado, implementado/testado, calibrado e validado no recorte declarado. Esses estados não são intercambiáveis.

## Estados desta primeira entrega
Modelos de planejamento implementados. Inventário multiarquitetura implementado. Integração automática com dados reais, modelos mecanísticos da dança/cadência e formalização da Cabala permanecem pendentes. O catálogo extensível organiza o trabalho a fazer, sem declarar essas etapas concluídas.
