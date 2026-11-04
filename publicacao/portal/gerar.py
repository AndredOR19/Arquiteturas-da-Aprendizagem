"""Gera o índice público; nunca consulta ou exporta o banco de estudantes."""
import json,re,shutil
from pathlib import Path

def acervo_publico(root,items):
    saida=[]
    for i,item in enumerate(items):
        p=item.get('portal')
        if not p:
            raise ValueError('Preencha metadados públicos do portal: '+item.get('origem',item['titulo']))
        for field in ['componentes','series','turmas','palavras_chave']:
            if not isinstance(p.get(field),list) or not all(isinstance(s,str) and s.strip() for s in p[field]):
                raise ValueError('Metadado inválido: '+field)
        ano=p['ano_letivo']
        if ano is not None and (not isinstance(ano,int) or not 2000<=ano<=2200):raise ValueError('Ano letivo inválido')
        if p['categoria'] not in ['aula','treinamento','apresentacao','demonstracao','piloto']:raise ValueError('Categoria inválida')
        date=item.get('data_aula','')
        if not date:
            m=re.search(r'(\d{2})-(\d{2})-(\d{4})',item.get('origem',''))
            if m:date=f'{m[3]}-{m[2]}-{m[1]}'
        periodo=p.get('periodo')
        if periodo is None and date and ano == 2026 and p['categoria'] == 'aula':
            from datetime import date as Date
            try:
                d=Date.fromisoformat(date)
                if p.get('modalidade') == 'EJA':
                    periodo='1º semestre' if Date(2026,2,18)<=d<=Date(2026,7,24) else '2º semestre' if Date(2026,8,3)<=d<=Date(2026,12,18) else None
                else:
                    periodo='1º trimestre' if Date(2026,2,18)<=d<=Date(2026,5,22) else '2º trimestre' if Date(2026,5,25)<=d<=Date(2026,9,4) else '3º trimestre' if Date(2026,9,8)<=d<=Date(2026,12,18) else None
            except ValueError:
                periodo=None
        habilidades=p.get('habilidades_bncc',[])
        if not isinstance(habilidades,list) or not all(isinstance(h,dict) and isinstance(h.get('codigo'),str) and isinstance(h.get('descricao'),str) for h in habilidades):
            raise ValueError('Habilidades BNCC inválidas: '+item['titulo'])
        out={k:p[k] for k in ['ano_letivo','categoria','componentes','series','turmas','escola','escola_curta','palavras_chave']}
        out.update(periodo=periodo,habilidades_bncc=habilidades,resumo_registro=p.get('resumo_registro',p['descricao']))
        out.update(id=item.get('destino') or 'apresentacao-'+str(i),titulo=p.get('titulo_exibicao',item['titulo']),descricao=p['descricao'],url=item.get('url') if item['tipo']=='link' else item['destino']+'/',data_catalogo=date,acesso=p.get('acesso','aberto'),formato=('GAMMA' if 'gamma.app' in item.get('url','') else 'AULA DIGITAL') if item['tipo']=='link' else 'SLIDES' if item['tipo']=='slides' else 'AULA DIGITAL')
        saida.append(out)
    return {'versao':'1.0.0','materiais':saida}

def preparar_portal(root,out,items):
    source=root/'publicacao/portal';target=out/'_recursos/portal';target.mkdir(parents=True,exist_ok=True)
    for name in ['portal.css','portal.js']:shutil.copyfile(source/name,target/name)
    (target/'acervo.json').write_text(json.dumps(acervo_publico(root,items),ensure_ascii=False,indent=2)+'\n')
    text=(source/'index.html').read_text().replace('__ASSETS__','_recursos/portal')
    (out/'index.html').write_text(text,encoding='utf-8')

def atualizar_fonte(root):
    items=json.loads((root/'publicacao/catalogo.json').read_text())['materiais'];source=root/'publicacao/portal'
    (source/'acervo.json').write_text(json.dumps(acervo_publico(root,items),ensure_ascii=False,indent=2)+'\n')
    (root/'index.html').write_text((source/'index.html').read_text().replace('__ASSETS__','publicacao/portal'),encoding='utf-8')

if __name__=='__main__':
    atualizar_fonte(Path(__file__).resolve().parents[2])
    print('Índice público atualizado a partir do catálogo; nenhum dado individual consultado.')
