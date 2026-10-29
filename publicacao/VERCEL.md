# Publicação no Vercel

Correção técnica de 29/10/2026. Responsável pedagógico: Prof. André de Oliveira Rodrigues.

## Configuração

Importar o repositório AndredOR19/Arquiteturas-da-Aprendizagem, branch main.

- Root Directory: raiz do repositório, campo vazio; não selecionar pesquisa/simulacoes.
- Framework Preset: Other (`framework: null` no vercel.json).
- Install Command: vazio, desabilitado pelo vercel.json.
- Build Command: `bash publicacao/vercel-build.sh`.
- Output Directory: `_site`.

O vercel.json na raiz versiona as configurações. A configuração de Root Directory deve ser conferida no painel: se apontar para subpasta, o Vercel não encontrará esse arquivo. Usar o commit mais recente de main; redeploy do commit antigo não incorpora a correção.

## Causa do erro anterior

PYTHON_ENTRYPOINT_NOT_FOUND indica que o Vercel tentou construir uma aplicação Python. Aqui, os scripts Python preparam arquivos estáticos; não são um serviço web. Não criar app.py fictício para contornar a detecção.

O script de construção prepara Quarto 1.10.19, mesma versão do Actions, se ainda não estiver disponível. Download oficial Linux x86_64 com SHA-256 conferido contra o digest do release. Depois valida o catálogo e executa o empacotador existente, que inclui somente materiais discentes cadastrados, recursos de leitura e slides. Não publica a raiz do repositório, guias docentes, arquivos de coleta ou credenciais. Nenhuma variável secreta é necessária para esta publicação estática. Esta configuração não conecta ou ativa Supabase/n8n.

## Verificação

`bash publicacao/vercel-build.sh` é executado também pelo workflow Conferir construção Vercel. Conferir logs do Vercel e página real após a implantação; aprovação no Actions não comprova implantação no Vercel. Publicação no Pages e seus QR codes são mantidos.

Referências primárias: https://vercel.com/docs/project-configuration/vercel-json (framework, buildCommand, installCommand e outputDirectory); https://quarto.org/docs/download/tarball.html (instalação local sem root).
