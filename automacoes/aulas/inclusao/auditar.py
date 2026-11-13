"""Inventário reproduzível dos bancos inclusivos; não altera aulas ou progresso."""
import argparse, collections, hashlib, itertools, json, re, unicodedata
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
def norm(v):
    if isinstance(v, str): return ' '.join(unicodedata.normalize('NFKC', v).casefold().split())
    if isinstance(v, list): return [norm(x) for x in v]
    if isinstance(v, dict): return {k:norm(x) for k,x in sorted(v.items())}
    return v
def digest(v): return hashlib.sha256(json.dumps(norm(v),ensure_ascii=False,sort_keys=True).encode()).hexdigest()
def signature(item, art, semantic=False):
    obj={k:v for k,v in item.items() if k not in ('id','variant')}
    if semantic:
        # Mesma solicitação, alvo e resposta continuam iguais mesmo com novos distratores.
        answer=item.get('correct')
        indexes=answer if isinstance(answer,list) else [answer]
        options=item.get('options',[])
        answers=[options[i] for i in indexes if isinstance(i,int) and 0<=i<len(options)]
        obj={k:item.get(k) for k in ('word','kind','situation','command','showWord')}
        obj['answers']=answers
    word=item.get('word'); obj['target_art']=art.get(word)
    return digest(obj)
def build():
    banks=[]
    for path in sorted(ROOT.glob('aulas/*/apoio/banco.json')):
        d=json.loads(path.read_text()); entry={'aula':path.parts[-3],'arquivo':str(path.relative_to(ROOT)), 'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'versao':d.get('version'),'titulo':d.get('title'),'componente':d.get('subject'),'serie':d.get('grade'),'estado_aplicacao':'nao_confirmada','fases':{},'arte':{k:digest(v) for k,v in d.get('art',{}).items()}}
        for phase,items in d['phases'].items():
            records=[{'id_global':f"{entry['aula']}:{entry['versao']}:{phase}:{x['id']}",'id_local':x['id'],'palavra':x.get('word'),'operacao':x.get('command'),'situacao':x.get('situation'),'hash_exato':signature(x,d.get('art',{})),'hash_relacao':signature(x,d.get('art',{}),True)} for x in items]
            entry['fases'][phase]={'total':len(items),'palavras':sorted({x.get('word','') for x in items}),'atividades':records}
        banks.append(entry)
    pairs=[]
    for a,b in itertools.combinations(banks,2):
        phases={}
        for phase in sorted(set(a['fases'])&set(b['fases'])):
            aa=a['fases'][phase]['atividades'];bb=b['fases'][phase]['atividades']
            phases[phase]={}
            for key in ('hash_exato','hash_relacao'):
                common={x[key] for x in aa}&{x[key] for x in bb}
                phases[phase][key]={'assinaturas_comuns':len(common),'atividades_a':[x['id_local'] for x in aa if x[key] in common],'atividades_b':[x['id_local'] for x in bb if x[key] in common]}
        pairs.append({'a':a['aula'],'b':b['aula'],'fases':phases,'desenhos_identicos':sorted(k for k in a['arte'].keys()&b['arte'].keys() if a['arte'][k]==b['arte'][k])})
    legacy=[]
    for path in sorted(ROOT.glob('aulas/*/apoio/index.html')):
        m=re.search(r'<script[^>]*id=[\"\']apoio-dados[\"\'][^>]*>(.*?)</script>',path.read_text(),re.S)
        if m:
            d=json.loads(m[1]);legacy.append({'arquivo':str(path.relative_to(ROOT)),'hash_configuracao':digest(d),'estado':'legado; comparar configuracao integral; revisao semantica pendente'})
    return {'schema_version':'1.0.0','escopo':'Todos os banco.json inclusivos encontrados em aulas/; configurações inline legadas inventariadas separadamente. Não atesta aplicação em sala nem equivalência semântica completa.','criterio':'Exato ignora ID/variant e inclui figura-alvo; relação compara alvo, figura, ação, situação e resposta, ignorando distratores. Coincidência exige revisão, não diagnóstico automático.','bancos':banks,'comparacoes':pairs,'legados_inline':legacy}
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--write',action='store_true');ap.add_argument('--candidate',help='ID de aula: saída 2 quando há coincidências com outro banco');args=ap.parse_args(); data=build()
    if args.write: Path(__file__).with_name('registro.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    selected=[p for p in data['comparacoes'] if not args.candidate or args.candidate in (p['a'],p['b'])]
    if args.candidate and args.candidate not in {b['aula'] for b in data['bancos']}: ap.error('Aula não encontrada entre banco.json; legado exige revisão própria')
    alerts=[p for p in selected if any(v['hash_relacao']['assinaturas_comuns'] for v in p['fases'].values())]
    print(json.dumps({'bancos':len(data['bancos']),'legados':len(data['legados_inline']),'pares_com_coincidencias':len(alerts),'pares':alerts},ensure_ascii=False,indent=2))
    if args.candidate and alerts: raise SystemExit(2)
if __name__=='__main__': main()
