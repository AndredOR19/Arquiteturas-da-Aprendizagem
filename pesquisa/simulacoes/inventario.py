"""Relaciona documentação e modelos, sem converter conceitos em parâmetros por inferência."""
import hashlib
import json
from pathlib import Path

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]


def json_local(path):return json.loads(Path(path).read_text(encoding='utf-8'))


def fontes_hash(paths,root):
    out={}
    for name in paths:
        p=(root/name).resolve()
        if not p.is_relative_to(root.resolve()) or not p.is_file():raise ValueError('Fonte ausente ou externa: '+name)
        out[name]=hashlib.sha256(p.read_bytes()).hexdigest()
    return out


def construir(root=ROOT):
    root=Path(root);base=root/'pesquisa/simulacoes'
    cat=json_local(root/'biblioteca-arquiteturas/catalogo.json')
    extras=json_local(base/'arquiteturas_externas.json')
    models=json_local(base/'catalogo_modelos.json')
    ids=[];rows=[]
    for a in cat['arquiteturas']:
        rows.append(dict(id=a['id'],nome=a['nome'],dominio='pedagogico',versao_documental=a['versao'],
            estado_documental=a['status'],fontes_sha256=fontes_hash([a['caminho']],root)))
    for a in extras['arquiteturas']:
        if a['dominio'] not in ['simbolico_filosofico','pedagogico','formal','outro']:
            raise ValueError('Domínio externo inválido.')
        rows.append(dict(id=a['id'],nome=a['nome'],dominio=a['dominio'],versao_documental=a['versao'],
            estado_documental=a['status'],fontes_sha256=fontes_hash(a['fontes'],root)))
    for a in rows:
        ids.append(a['id'])
        links=[v for v in models['vinculos_mecanisticos'] if v['arquitetura_id']==a['id']]
        # Registro de módulos ainda não implementados nunca é ativado como execução.
        if links:raise ValueError('Não há despachante mecanístico nesta versão; formalizar extensão com testes.')
        a.update(estado_modelagem='aguardando_formalizacao',modulos_mecanisticos=[],
            modulos_de_apoio=[m['id'] for m in models['modulos']] if a['dominio']=='pedagogico' else [],
            calibracao_empirica=False,validacao_empirica=False)
        signature=json.dumps(a,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()
        a['revisao_sha256']=hashlib.sha256(signature).hexdigest()
    if len(ids)!=len(set(ids)):raise ValueError('Arquiteturas com IDs duplicados.')
    sources=['biblioteca-arquiteturas/catalogo.json','pesquisa/simulacoes/arquiteturas_externas.json',
             'pesquisa/simulacoes/catalogo_modelos.json','PROMPT_MESTRE_AULAS_DIGITAIS.md',
             'pesquisa/registros.json','pesquisa/producoes.json']
    return dict(schema_version='1.0.0',fontes_gerais_sha256=fontes_hash(sources,root),
        arquiteturas=rows,modulos=models['modulos'],
        nota='Inventário e cobertura; documentação, execução computacional e validação são estados distintos.')


def diferencas(anterior,atual):
    prev={r['id']:r['revisao_sha256'] for r in anterior.get('arquiteturas',[])}
    now={r['id']:r['revisao_sha256'] for r in atual['arquiteturas']}
    return dict(novas=sorted(set(now)-set(prev)),removidas=sorted(set(prev)-set(now)),
        alteradas=sorted(k for k in set(prev)&set(now) if prev[k]!=now[k]),
        fontes_gerais_alteradas=sorted(k for k,v in atual['fontes_gerais_sha256'].items()
            if anterior.get('fontes_gerais_sha256',{}).get(k)!=v))


def salvar(inventario,pasta):
    pasta=Path(pasta)
    (pasta/'inventario_arquiteturas.json').write_text(json.dumps(inventario,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    lines=['# Cobertura e progressão das arquiteturas','',
        'Este pacote registra as versões documentais disponíveis no momento da execução. As diferenças em relação à execução anterior são guardadas no índice e no histórico da branch resultados-simulacoes.','',
        '| Arquitetura | Domínio | Versão documental | Modelagem |','| --- | --- | --- | --- |']
    for a in inventario['arquiteturas']:
        lines.append('| '+' | '.join(str(a[k]).replace('|','/') for k in ['nome','dominio','versao_documental','estado_modelagem'])+' |')
    lines+=['','Os módulos atuais planejam pesquisas; não simulam os mecanismos dessas arquiteturas. Cada nova entrada é registrada e sinalizada, mas não ganha um efeito numérico por suposição.',
        'Arquiteturas simbólicas e filosóficas, incluindo a entrada Cabala, precisam de corpus e regras explícitas para análise formal. Uma análise de coerência interna não comprova afirmações empíricas ou metafísicas.',
        'Resultados reais só podem orientar parâmetros após verificação de fonte, adequação e versão; dados de alunos não entram neste laboratório público. Resultados sintéticos não contam como calibração empírica.']
    (pasta/'PROGRESSAO.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
