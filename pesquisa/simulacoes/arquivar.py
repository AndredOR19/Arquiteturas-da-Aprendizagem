#!/usr/bin/env python3
"""Arquiva apenas o pacote sintético validado na branch de resultados do mesmo repositório."""
import base64
import json
import os
from pathlib import Path
import re
import urllib.error
import urllib.request
from laboratorio import carregar,hash_arquivo,verificar
from inventario import diferencas

ARQUIVOS={'configuracao.json','resultados.json','resultados.csv','RELATORIO.md','RESUMO.md',
          'grafico.png','relatorio.html','manifesto.json','inventario_arquiteturas.json','PROGRESSAO.md'}
BRANCH='resultados-simulacoes'


def pacote(base):
    roots=[p for p in Path(base).iterdir() if p.is_dir()]
    if len(roots)!=1:raise ValueError('Arquivamento exige exatamente um pacote da execução.')
    root=roots[0];verificar(root)
    manifest=carregar(root/'manifesto.json');result=carregar(root/'resultados.json')
    if manifest.get('dados_reais') is not False or result.get('dados_reais') is not False:
        raise ValueError('Somente dados sintéticos podem ser arquivados aqui.')
    if {p.name for p in root.iterdir()}!=ARQUIVOS:raise ValueError('Pacote contém arquivo inesperado.')
    for p in root.iterdir():
        if p.is_symlink() or not p.is_file() or p.stat().st_size>5_000_000:
            raise ValueError('Arquivo inválido no pacote.')
    return root


class GitHub:
    def __init__(self,repo,token):
        if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+',repo):raise ValueError('Repositório inválido.')
        self.base='https://api.github.com/repos/'+repo;self.token=token

    def call(self,method,path,data=None,missing=False):
        req=urllib.request.Request(self.base+path,
            data=None if data is None else json.dumps(data).encode(),method=method,
            headers={'Authorization':'Bearer '+self.token,'Accept':'application/vnd.github+json',
                     'Content-Type':'application/json','X-GitHub-Api-Version':'2022-11-28'})
        try:
            with urllib.request.urlopen(req,timeout=45) as response:return json.load(response)
        except urllib.error.HTTPError as exc:
            if exc.code==404 and missing:return None
            raise RuntimeError('GitHub recusou '+method+' '+path+' (HTTP '+str(exc.code)+').') from None


def arquivar(root,api,repo,run_id,attempt,source_sha):
    if not run_id.isdigit() or not attempt.isdigit() or not re.fullmatch('[0-9a-f]{40}',source_sha):
        raise ValueError('Identificação da execução inválida.')
    config=carregar(root/'configuracao.json')
    slug=config['id']
    if not re.fullmatch('[A-Za-z0-9_-]+',slug):raise ValueError('ID de cenário inválido para arquivo.')
    execution_key=run_id+'-'+attempt+'-'+slug
    prefix='execucoes/'+execution_key
    manifest=carregar(root/'manifesto.json')
    if manifest['github']['commit']!=source_sha or manifest['github']['execucao']!=run_id:
        raise ValueError('Pacote não corresponde à execução atual.')
    # Repetir o passo de arquivo nunca substitui uma execução já arquivada.
    old=api.call('GET','/contents/'+prefix+'/manifesto.json?ref='+BRANCH,missing=True)
    if old:
        previous=base64.b64decode(old['content'])
        if previous!=(root/'manifesto.json').read_bytes():raise ValueError('Arquivo anterior diferente; preservar sem sobrescrever.')
        return 'https://github.com/'+repo+'/tree/'+BRANCH+'/'+prefix
    elements=[]
    for name in sorted(ARQUIVOS):
        blob=api.call('POST','/git/blobs',{'content':base64.b64encode((root/name).read_bytes()).decode(),'encoding':'base64'})
        elements.append({'path':prefix+'/'+name,'mode':'100644','type':'blob','sha':blob['sha']})
    for _ in range(3):
        ref=api.call('GET','/git/ref/heads/'+BRANCH,missing=True)
        parent=ref['object']['sha'] if ref else source_sha
        commit=api.call('GET','/git/commits/'+parent)
        old_index=api.call('GET','/contents/laboratorio/indice.json?ref='+parent,missing=True)
        index=json.loads(base64.b64decode(old_index['content'])) if old_index else {'schema_version':'1.0.0','execucoes':[],'ultimo_inventario':{}}
        inventory=carregar(root/'inventario_arquiteturas.json')
        changes=diferencas(index['ultimo_inventario'],inventory)
        record={'execucao':run_id,'tentativa':attempt,'cenario':slug,'commit_fonte':source_sha,'pasta':prefix,
                'experimento':manifest['identificador_experimento'],'diferencas':changes}
        index['execucoes'].append(record);index['ultimo_inventario']=inventory
        extra=[{'path':'laboratorio/indice.json','mode':'100644','type':'blob','content':json.dumps(index,ensure_ascii=False,indent=2)},
               {'path':'evolucao/'+execution_key+'.json','mode':'100644','type':'blob','content':json.dumps(record,ensure_ascii=False,indent=2)}]
        tree=api.call('POST','/git/trees',{'base_tree':commit['tree']['sha'],'tree':elements+extra})
        new=api.call('POST','/git/commits',{'message':'research: arquiva simulação sintética '+run_id+'-'+attempt,
                     'tree':tree['sha'],'parents':[parent]})
        try:
            if ref:api.call('PATCH','/git/refs/heads/'+BRANCH,{'sha':new['sha'],'force':False})
            else:api.call('POST','/git/refs',{'ref':'refs/heads/'+BRANCH,'sha':new['sha']})
            return 'https://github.com/'+repo+'/tree/'+BRANCH+'/'+prefix
        except RuntimeError:
            # Outra execução pode ter avançado a branch. Recriar sobre o novo pai, sem force.
            continue
    raise RuntimeError('Não foi possível avançar a branch de resultados; o artefato temporário foi preservado.')


if __name__=='__main__':
    root=pacote('exportacoes/simulacoes')
    repo=os.environ['GITHUB_REPOSITORY'];api=GitHub(repo,os.environ['GH_TOKEN'])
    url=arquivar(root,api,repo,os.environ['GITHUB_RUN_ID'],os.environ['GITHUB_RUN_ATTEMPT'],os.environ['GITHUB_SHA'])
    print('Resultados versionados: '+url)
    summary=os.environ.get('GITHUB_STEP_SUMMARY')
    if summary:
        with open(summary,'a',encoding='utf-8') as f:f.write('\n[Resultados versionados]('+url+')\n')
