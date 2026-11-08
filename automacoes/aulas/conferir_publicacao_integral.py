#!/usr/bin/env python3
"""Confere a versão discente nos dois destinos e gera QR somente após resposta íntegra."""
import argparse
import hashlib
import json
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote,urlparse

def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Arquiteturas-Verificacao/3.8'})
    with urllib.request.urlopen(req,timeout=20) as r:
        if r.status!=200:raise ValueError('HTTP diferente de 200')
        if urlparse(r.url).netloc!=urlparse(url).netloc:raise ValueError('Redirecionamento para outro domínio')
        return r.read()

def verify(root,site,bases,output,fetcher=fetch):
    root=Path(root);site=Path(site);output=Path(output);output.mkdir(parents=True,exist_ok=True)
    registry=root/'automacoes/aulas/entregas.json'
    rows=json.loads(registry.read_text())['aulas'] if registry.exists() else []
    items=json.loads((root/'publicacao/catalogo.json').read_text())['materiais']
    published={i.get('destino') for i in items if bool(i.get('contrato_entrega'))}
    results=[]
    for row in rows:
        dest=row['destino']
        if dest not in published:continue
        if not (site/dest).resolve().is_relative_to(site.resolve()):raise ValueError('Destino fora do pacote')
        for target,base in bases.items():
            if not base.startswith('https://'):raise ValueError('Destino deve usar HTTPS')
            url=base.rstrip('/')+'/'+quote(dest,safe='/')+'/';result={'aula':row['id'],'destino':target,'url':url,'estado':'pendente'}
            try:
                files=sorted(p for p in (site/dest).rglob('*') if p.is_file())
                if not files:raise ValueError('Pacote público ausente')
                for f in files:
                    expected=hashlib.sha256(f.read_bytes()).hexdigest()
                    remote=url+quote(str(f.relative_to(site/dest)),safe='/')
                    last=None
                    for attempt in range(3):
                        try:
                            if hashlib.sha256(fetcher(remote)).hexdigest()!=expected:raise ValueError('Versão remota diferente: '+f.name)
                            last=None;break
                        except Exception as exc:
                            last=exc
                            if attempt<2:time.sleep(3)
                    if last:raise last
                import qrcode
                name=hashlib.sha256((target+dest).encode()).hexdigest()[:20]+'.png'
                qrcode.make(url).save(output/name)
                result.update(estado='verificado',http=200,arquivos=len(files),qr_arquivo=name,qr_sha256=hashlib.sha256((output/name).read_bytes()).hexdigest(),verificado_em=datetime.now(timezone.utc).isoformat())
            except Exception as exc:result['erro']=str(exc)
            results.append(result)
    # Preserva recibos atualizados sem alterar o conteúdo ou a revisão já conferidos.
    from contrato_entrega import validate
    policy=json.loads((root/'automacoes/aulas/politica-entrega.json').read_text())
    receipts=output/'recibos';receipts.mkdir(exist_ok=True);receipt_states=[]
    for row in rows:
        if row['destino'] not in published:continue
        receipt=json.loads((root/row['recibo']).read_text())
        for entry in [e for e in results if e['aula']==row['id']]:
            e=dict(entry);target=e.pop('destino');e['pacote_sha256']=receipt['pacote_sha256']
            if e.get('qr_arquivo'):e['qr_arquivo']=str((output/e['qr_arquivo']).resolve().relative_to(root.resolve()))
            receipt['publicacao'][target]=e
        pending=validate(receipt,policy,root,root/row['destino'],root/'PROMPT_MESTRE_AULAS_DIGITAIS.md','concluir')
        receipt['estado']='concluido' if not pending else 'publicado_parcial'
        receipt_states.append(receipt['estado'])
        receipt['pendencias_finais']=pending
        (receipts/(row['id']+'-aceite.json')).write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
    state={'estado':'concluido' if results and all(x['estado']=='verificado' for x in results) and all(x=='concluido' for x in receipt_states) else 'sem_novas_aulas' if not results else 'publicado_parcial','verificacoes':results}
    (output/'publicacao.json').write_text(json.dumps(state,ensure_ascii=False,indent=2)+'\n')
    return state

def main():
    p=argparse.ArgumentParser();p.add_argument('--raiz',type=Path,default=Path(__file__).resolve().parents[2]);p.add_argument('--site',type=Path,default=Path('_site'));p.add_argument('--pages',required=True);p.add_argument('--vercel',required=True);p.add_argument('--saida',type=Path,default=Path('verificacao-publicacao'));a=p.parse_args()
    r=verify(a.raiz,a.site,{'pages':a.pages,'vercel':a.vercel},a.saida);print(r['estado'])
    if r['estado']=='publicado_parcial':raise SystemExit(1)
if __name__=='__main__':main()
