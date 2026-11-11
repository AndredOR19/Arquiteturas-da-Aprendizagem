#!/usr/bin/env python3
"""Bloqueios verificáveis do Prompt Mestre. Evidência não é avaliação automática de qualidade."""
import argparse
import hashlib
import json
from pathlib import Path

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def inside(root, rel):
    p = (root / rel).resolve()
    if not p.is_relative_to(root.resolve()) or not p.is_file() or p.is_symlink():
        raise ValueError('Arquivo de evidência ausente/fora da raiz: '+str(rel))
    return p

def digest(bundle):
    files = sorted(p for p in bundle.rglob('*') if p.is_file())
    if not files or any(p.is_symlink() for p in files):
        raise ValueError('Pacote vazio ou com link simbólico')
    return hashlib.sha256('\n'.join(str(p.relative_to(bundle))+':'+sha(p) for p in files).encode()).hexdigest()

def validate_routes(data, policy):
    routes = data.get('routes', {})
    counts = {k:len(routes.get(k, [])) for k in ('principal','exemplos','apoio')}
    q = policy['rotas']
    if counts['principal'] != q['principal'] or counts['exemplos'] < q['exemplos_minimo'] or counts['apoio'] < q['apoio_minimo']:
        raise ValueError('Quantidades inválidas: '+str(counts))
    ids = set()
    for route, tasks in routes.items():
        seen = set()
        operations = set()
        for t in tasks:
            if not t.get('id') or t['id'] in ids:
                raise ValueError('ID ausente/duplicado: '+str(t.get('id')))
            ids.add(t['id'])
            signature = json.dumps({k:t.get(k) for k in ('kind','command','data')},sort_keys=True,ensure_ascii=False)
            if signature in seen:
                raise ValueError('Atividade literalmente repetida na rota '+route)
            seen.add(signature)
            operations.add(t.get('kind'))
        if len(operations) < 2:
            raise ValueError('Rota sem variedade de operações: '+route)
    return counts

def pending(policy, lesson_id, bundle, master):
    return {'versao':policy['versao'], 'aula':lesson_id, 'estado':'revisao_pendente',
            'prompt_sha256':sha(master), 'pacote_sha256':digest(bundle),
            'requisitos':{key:{'estado':'pendente','evidencias':[],'observacao':label}
                          for key,label in policy['requisitos'].items()},
            'publicacao':{target:{'estado':'pendente'} for target in policy['publicacao']['destinos']}}

def clear_language_gate(receipt, policy, root, bundle):
    """Seção 38 do Prompt Mestre: relatório do validador de linguagem para esta aula, atual e sem bloqueios.
    Não substitui a revisão humana: zero bloqueios não comprova compreensão pelo estudante."""
    rule=policy.get('linguagem_clara')
    if not rule:return []
    try:
        report=json.loads(inside(root,receipt.get('linguagem_relatorio',rule['relatorio'])).read_text())
    except (ValueError,KeyError) as exc:
        return ['linguagem_clara: relatório ausente ('+str(exc)+'); executar automacoes/aulas/validar_linguagem.py']
    entry=report.get('aulas',{}).get(receipt.get('aula'))
    if not entry:return ['linguagem_clara: aula sem auditoria de linguagem no relatório']
    errors=[]
    if int(entry.get('bloqueado',1)) > int(rule.get('bloqueios_maximos',0)):
        errors.append('linguagem_clara: '+str(entry.get('bloqueado'))+' atividade(s) bloqueada(s); corrigir antes de entregar')
    for name,key in (('assets/conteudo.js','conteudo_sha256'),('assets/clareza.js','clareza_sha256')):
        f=bundle/name
        if (sha(f) if f.is_file() else None)!=entry.get(key):
            errors.append('linguagem_clara: relatório desatualizado para '+name+'; reexecutar validar_linguagem.py')
    return errors

def validate(receipt, policy, root, bundle, master, stage='publicar'):
    errors=[]
    if receipt.get('versao') != policy['versao'] or receipt.get('prompt_sha256') != sha(master):
        errors.append('Prompt/contrato desatualizado; reler e revisar a produção')
    if receipt.get('pacote_sha256') != digest(bundle):
        errors.append('Pacote alterado depois da revisão')
    errors.extend(clear_language_gate(receipt,policy,root,bundle))
    for key in policy['requisitos']:
        entry=receipt.get('requisitos',{}).get(key,{})
        if entry.get('estado') != 'aprovado' or not entry.get('responsavel') or not entry.get('verificado_em') or not entry.get('evidencias'):
            errors.append(key+': revisão/evidência pendente')
            continue
        for evidence in entry['evidencias']:
            try:
                p=inside(root,evidence['arquivo'])
                if evidence.get('sha256') != sha(p):
                    raise ValueError('Hash de evidência divergente')
            except (ValueError, KeyError, TypeError) as exc:
                errors.append(key+': '+str(exc))
    if stage == 'concluir':
        for target in policy['publicacao']['destinos']:
            e=receipt.get('publicacao',{}).get(target,{})
            if e.get('estado') != 'verificado' or e.get('http') != 200 or not str(e.get('url','')).startswith('https://') or e.get('pacote_sha256') != receipt.get('pacote_sha256') or not e.get('verificado_em'):
                errors.append(target+': publicação ainda não confirmada para esta versão')
            try:
                qr=inside(root,e.get('qr_arquivo',''))
                if e.get('qr_sha256') != sha(qr):raise ValueError('QR divergente')
            except (ValueError,KeyError,TypeError):errors.append(target+': QR verificado ausente')
    return errors

def catalog_gate(root):
    """Legado preservado; novas entregas cadastradas sob 3.8 exigem recibo e pacote atual."""
    catalog=json.loads((root/'publicacao/catalogo.json').read_text())
    registry=root/'automacoes/aulas/entregas.json'
    registered=json.loads(registry.read_text()).get('aulas',[]) if registry.exists() else []
    by_dest={x['destino']:x for x in registered}
    policy=json.loads((root/'automacoes/aulas/politica-entrega.json').read_text())
    errors=[]
    legacy_path=root/'automacoes/aulas/legados-entrega.json'
    legacy=set(json.loads(legacy_path.read_text())['destinos']) if legacy_path.exists() else set()
    # Um recibo completo promove apenas o discente; pendentes continuam fora do acervo.
    known={x.get('destino') for x in catalog['materiais']}
    for record in registered:
        if record['destino'] in known:continue
        try:
            receipt=json.loads(inside(root,record['recibo']).read_text())
            bundle=(root/record['destino']).resolve()
            if not bundle.is_relative_to(root.resolve()):raise ValueError('Destino fora da raiz')
            if not validate(receipt,policy,root,bundle,root/'PROMPT_MESTRE_AULAS_DIGITAIS.md'):
                candidate=record.get('catalogo')
                if not candidate or candidate.get('destino')!=record['destino'] or candidate.get('contrato_entrega')!=policy['versao']:
                    raise ValueError('Metadados de publicação ausentes/divergentes')
                catalog['materiais'].append(candidate);known.add(record['destino'])
        except (ValueError,KeyError) as exc:
            errors.append(record['destino']+': '+str(exc))
    for item in catalog['materiais']:
        dest=item.get('destino')
        required=bool(item.get('contrato_entrega')) or dest in by_dest or (item.get('tipo')=='html' and str(item.get('origem','')).startswith('aulas/') and dest not in legacy)
        if not required:continue
        try:
            r=by_dest[dest]
            receipt=json.loads(inside(root,r['recibo']).read_text())
            bundle=(root/dest).resolve()
            if not bundle.is_relative_to(root.resolve()):raise ValueError('Destino fora da raiz')
            errors.extend(dest+': '+e for e in validate(receipt,policy,root,bundle,root/'PROMPT_MESTRE_AULAS_DIGITAIS.md'))
        except (KeyError,ValueError) as exc:errors.append(str(dest)+': '+str(exc))
    if errors:raise ValueError('\n'.join(errors))
    (root/'publicacao/catalogo.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--raiz',type=Path,default=Path(__file__).resolve().parents[2])
    p.add_argument('--catalogo',action='store_true')
    p.add_argument('--recibo');p.add_argument('--pacote');p.add_argument('--etapa',choices=['publicar','concluir'],default='publicar')
    a=p.parse_args();root=a.raiz.resolve()
    if a.catalogo:catalog_gate(root);print('CONTRATO DE ENTREGA: catálogo conferido');return
    if not a.recibo or not a.pacote:p.error('--recibo e --pacote são obrigatórios')
    errors=validate(json.loads(inside(root,a.recibo).read_text()),json.loads((root/'automacoes/aulas/politica-entrega.json').read_text()),root,(root/a.pacote).resolve(),root/'PROMPT_MESTRE_AULAS_DIGITAIS.md',a.etapa)
    if errors:raise SystemExit('\n'.join(errors))
    print('CONTRATO DE ENTREGA: etapa '+a.etapa+' validada')

if __name__=='__main__':main()
