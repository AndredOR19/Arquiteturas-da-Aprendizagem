#!/usr/bin/env python3
"""Pedido/roteiro -> dados pedagógicos (LLM) -> HTML seguro -> catálogo; PR é responsabilidade do workflow."""
import argparse
import html
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(Path(__file__).resolve().parent))
from exemplos import validar as validar_exemplos, renderizar as renderizar_exemplos
from circuitos import build_circuit, validate_circuit

def read(path):
    p=Path(path)
    if p.is_absolute() or '..' in p.parts or not (ROOT/p).is_file():
        raise ValueError('Caminho de pedido/roteiro inválido ou ausente: '+str(path))
    return (ROOT/p).read_text(encoding='utf-8')

def ask(prompt):
    token=os.getenv('AULA_LLM_API_KEY')
    model=os.getenv('AULA_LLM_MODEL')
    if not token or not model:
        raise RuntimeError('Configurar AULA_LLM_API_KEY e AULA_LLM_MODEL antes de gerar')
    endpoint=(os.getenv('AULA_LLM_BASE_URL') or 'https://api.openai.com/v1').rstrip('/')
    if not endpoint.startswith('https://'):
        raise ValueError('Provedor deve utilizar HTTPS')
    payload={'model':model,'response_format':{'type':'json_object'},'messages':[
        {'role':'system','content':'Gere apenas JSON válido em português do Brasil, sem HTML, scripts, dados pessoais ou citações inventadas.'},
        {'role':'user','content':prompt}]}
    req=urllib.request.Request(endpoint+'/chat/completions',data=json.dumps(payload,ensure_ascii=False).encode(),
        headers={'Authorization':'Bearer '+token,'Content-Type':'application/json'},method='POST')
    try:
        with urllib.request.urlopen(req,timeout=180) as response:
            result=json.load(response)
    except urllib.error.HTTPError as exc:
        raise RuntimeError('Falha do provedor HTTP '+str(exc.code)) from exc
    return json.loads(result['choices'][0]['message']['content'])

def check(data):
    assert all(isinstance(data.get(k),str) and len(data[k])>15 for k in ('titulo','objetivo','conceito','conclusao'))
    assert isinstance(data.get('percursos'),list) and len(data['percursos'])==32, 'São exigidos 32 percursos'
    for i,item in enumerate(data['percursos']):
        assert all(isinstance(item.get(k),str) and len(item[k])>=12 for k in ('contexto','pergunta','explicacao','transferencia')),i
        assert isinstance(item.get('alternativas'),list) and len(item['alternativas'])==4,i
        assert all(isinstance(o.get('texto'),str) and isinstance(o.get('feedback'),str) and o['feedback'] for o in item['alternativas']),i
        assert type(item.get('correta')) is int and 0 <= item['correta'] <= 3,i
    return data

HTML='''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITULO__</title><style>
:root{font:18px system-ui,sans-serif;color:#182b39;background:#eef7fa}*{box-sizing:border-box}
body{max-width:900px;margin:auto;padding:20px}main{background:white;padding:24px;border-radius:16px;box-shadow:5px 7px #a6cde2}
h1{line-height:1.2}p{line-height:1.6}button,input,textarea{font:inherit;padding:12px;border:2px solid #243849;border-radius:8px}
button{background:#ffe279;cursor:pointer;margin:5px}button:focus-visible,input:focus-visible{outline:4px solid #b341bd}
.opcao{display:block;width:100%;text-align:left;background:#e6f4fc}fieldset{border-radius:12px;margin:12px 0}
#feedback{padding:14px;background:#e4f5ec;border-left:5px solid #216c52;min-height:50px}
.esconder{display:none}label{display:block;margin:12px 0}textarea{width:100%}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style></head><body><main>
<p>Arquiteturas da Aprendizagem · __DISCIPLINA__ · __TURMA__</p><h1>__TITULO__</h1><p>__OBJETIVO__</p>
<section id="entrada"><p>A atividade não registra presença nem envia dados automaticamente. O relatório será baixado ao final.</p>
<label>Nome para o relatório <input id="nome" maxlength="100"></label><button id="iniciar">Iniciar</button></section>
<section id="aula" class="esconder"><p><strong>Entender → Observar → Percursos → Explicar</strong></p>
<section id="circuito" aria-label="Mapa de descobertas"><h2>Mapa de descobertas</h2><p id="estacao"></p><div id="estacoes"></div><p id="cartao" role="status"></p></section>
<h2 id="contador"></h2><p id="contexto"></p><button id="voz">Ouvir</button>
<fieldset><legend id="pergunta"></legend><div id="alternativas"></div></fieldset>
<p id="feedback" role="status" aria-live="polite"></p><button id="seguir" disabled>Próximo percurso</button></section>
<section id="fim" class="esconder"><h2>Explique e aplique</h2><p id="conclusao"></p>
<label>O que aprendeu? <textarea id="explicacao" rows="4"></textarea></label>
<button id="baixar">Baixar relatório</button><p id="aviso" role="status"></p></section>
</main><script id="dados" type="application/json">__DADOS__</script><script>
(()=>{'use strict';const doc=JSON.parse(document.querySelector('#dados').textContent),$=id=>document.getElementById(id);
 let pos=0,erros=0,acertos=0,registros=[],nome='',inicio=0;
 function mostrar(){const q=doc.percursos[pos],link=doc.circuito.questions[pos],station=doc.circuito.stations.find(s=>s.id===link.hints.at(-1).targetStationId),card=station.cards.find(c=>c.id===link.hints.at(-1).targetCardId);$('contador').textContent='Percurso '+(pos+1)+' de 32';$('contexto').textContent=q.contexto;$('pergunta').textContent=q.pergunta;$('estacao').textContent='Estação atual: '+station.title+' · ação: '+station.action;$('cartao').textContent='Cartão essencial: '+card.essential;
$('alternativas').replaceChildren();$('seguir').disabled=true;$('feedback').textContent='Analise a situação antes de responder.';
q.alternativas.forEach((o,i)=>{const b=document.createElement('button');b.className='opcao';b.textContent=String.fromCharCode(65+i)+'. '+o.texto;b.onclick=()=>{
 const certo=i===q.correta;registros.push({percurso:pos+1,alternativa:i+1,acerto:certo});$('feedback').textContent=o.feedback+(certo?' '+q.explicacao:' Relacione a evidência com outra possibilidade. Pista disponível: volte à estação '+station.title+'.');
if(certo){acertos++;$('seguir').disabled=false;[...$('alternativas').children].forEach(x=>x.disabled=true)}else{erros++;}
};$('alternativas').appendChild(b)})}
$('iniciar').onclick=()=>{nome=$('nome').value.trim();if(!nome){$('nome').focus();return}inicio=Date.now();$('entrada').classList.add('esconder');$('aula').classList.remove('esconder');mostrar()};
$('seguir').onclick=()=>{pos++;if(pos<32)mostrar();else{$('aula').classList.add('esconder');$('fim').classList.remove('esconder');$('conclusao').textContent=doc.conclusao}};
$('voz').onclick=()=>{if(!('speechSynthesis'in window))return;const a=new SpeechSynthesisUtterance($('contexto').textContent+' '+$('pergunta').textContent);a.lang='pt-BR';speechSynthesis.cancel();speechSynthesis.speak(a)};
$('baixar').onclick=()=>{const txt=$('explicacao').value.trim();if(txt.length<20){$('aviso').textContent='Explique o que aprendeu antes de gerar o relatório.';return}
const dados={atividade:document.title,nome,acertos,erros,tempoSegundos:Math.round((Date.now()-inicio)/1000),tentativas:registros,explicacao:txt};
const u=URL.createObjectURL(new Blob([JSON.stringify(dados,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='relatorio-aula.json';a.click();URL.revokeObjectURL(u);$('aviso').textContent='Relatório gerado. Confirme o envio ao professor pelo canal autorizado.'};
})();
</script></body></html>'''

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--pedido',required=True)
    parser.add_argument('--script',default='')
    args=parser.parse_args()
    pedido=json.loads(read(args.pedido))
    if pedido.get('estado') not in ('rascunho','pronto_para_revisao'):
        raise ValueError('Pedido bloqueado para geração')
    aulas=pedido.get('aulas')
    if not isinstance(aulas,list) or not aulas:
        raise ValueError('Pedido deve ter array aulas')
    private=Path('_biblioteca_privada/docs/INTEGRACAO-APRENDIZAGEM.md')
    if not private.is_file():
        raise RuntimeError('Biblioteca de Diagramação privada ausente')
    guia=private.read_text(encoding='utf-8')[:4000]
    fluxo=read('prompts/FLUXO_03_TERRITORIO_EXPERIENCIAS.md')[:6000]
    protocolo=read('biblioteca-arquiteturas/PROTOCOLO_IA.md')[:6000]
    roteiro=read(args.script)[:6000] if args.script else ''
    caminho=ROOT/'publicacao/catalogo.json'
    catalogo=json.loads(caminho.read_text(encoding='utf-8'))
    usados={x.get('destino') for x in catalogo['materiais']}
    gerados=[]
    for aula in aulas:
        slug=aula['id']
        if not re.fullmatch(r'[0-9a-z]+(?:-[0-9a-z]+)*',slug):
            raise ValueError('ID inválido: '+slug)
        rel='aulas/'+slug
        pasta=ROOT/rel
        if pasta.exists() or rel in usados:
            raise ValueError('Aula já existe; preservada: '+rel)
        prompt=('Crie uma aula para dois períodos, 32 percursos completos, ensinando antes de perguntar, '
                'com variação entre observar, associar, comparar, inferir e aplicar. Responda JSON com '
                'titulo, objetivo, conceito, conclusao, percursos; cada percurso tem contexto, pergunta, '
                'alternativas [4 objetos {texto,feedback}], correta [0..3], explicacao e transferencia. '
                'Inclua conteúdo adequado à turma e não invente fontes. Use linguagem pt-BR. '
                'O apoio à leitura é opcional, separado da nota e dos 32 percursos curriculares. '
                'A publicação integra o recurso compartilhado com no mínimo 57 percursos de apoio: '
                'imagem-palavra, palavra-imagem, sílabas e frases em contexto, com áudio e mediação. '
                'Nunca conte telas de instrução, tentativas ou repetição idêntica como novos percursos. '
                'A aparência deve acompanhar a série: 5º-6º aventura acolhedora, 7º transição RPG, '
                '8º-9º RPG contemporâneo e Ensino Médio investigação madura; os três caminhos mantêm a mesma maturidade. '
                'O gerador anexará um circuito com estações, cartões essenciais, IDs estáveis e três pistas; '
                'não copie Roblox ou ativos protegidos. '
                'ERER: diferencie analogia fílmica de racismo real e não copie personagens protegidos.\n'
                +json.dumps(aula,ensure_ascii=False)+'\n'+roteiro+'\n'+protocolo+'\n'+fluxo+
                '\nReferência versionada da Biblioteca de Diagramação (não copiar motor): '+guia)
        doc=check(ask(prompt))
        doc['circuito']=build_circuit(doc,aula)
        validate_circuit(doc['circuito'],32)
        total_exemplos=aula.get('percursos_exemplos',96)
        if type(total_exemplos) is not int or total_exemplos < max(64,2*len(doc['percursos'])):
            raise ValueError('Solicitar pelo menos o dobro dos percursos curriculares; mínimo 64')
        prompt_exemplos=('Crie o caminho opcional Aprender de outro jeito — exemplos e relações para a mesma aula. '
            'Há leitura breve, não ausência de leitura. Use diferentes linguagens explicativas equivalentes: '
            'direta, exemplo cotidiano e comparação, além de elementos visuais/áudio opcional. '
            'Preserve conceitos e objetivo curricular; não classifique por diagnóstico. '
            'Gere '+str(total_exemplos)+' percursos distintos, em grupos curtos de 6 a 13. '
            'Cada percurso mostra um exemplo concreto e os elementos relacionados antes de perguntar. '
            'Varie observar, associar, comparar, ordenar, causa/efeito e aplicar em novo contexto. '
            'Não conte instruções, tentativas ou repetições idênticas como percursos. '
            'Retorne JSON {percursos:[{id,exemplo,relacao,elementos:[2 a 4 rótulos de até 55 caracteres],'
            'pergunta,alternativas:[2 ou 3 objetos {texto,feedback}],correta,transferencia,'
            'linguagens:{direta,cotidiana,comparacao}}]}. '
            'Campos exemplo, relacao, pergunta e transferencia: entre 5 e 180 caracteres. '
            'Alternativa até 80 caracteres e feedback entre 5 e 180. Cada linguagem tem 5 a 180 caracteres, '
            'explicando a mesma relação com outra representação, sem empilhar todas de uma vez. '
            'Texto simples, sem HTML e sem dados pessoais. '
            'Não invente fontes nem considere facilidade de leitura prova de domínio. '
            +json.dumps(aula,ensure_ascii=False)+'\\n'+json.dumps(doc,ensure_ascii=False))
        exemplos=validar_exemplos(ask(prompt_exemplos),total_exemplos)
        dados=json.dumps(doc,ensure_ascii=False).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
        page=HTML.replace('__TITULO__',html.escape(doc['titulo'])).replace('__OBJETIVO__',html.escape(doc['objetivo']))
        page=page.replace('__DISCIPLINA__',html.escape(aula['disciplina'])).replace('__TURMA__',html.escape(str(aula['turma']))).replace('__DADOS__',dados)
        page=page.replace('<section id="entrada">','<p><a href="exemplos/">Aprender de outro jeito — exemplos e relações · caminho opcional</a></p><section id="entrada">',1)
        pagina_exemplos=renderizar_exemplos(exemplos,doc['titulo'],slug)
        pasta.mkdir(parents=True)
        (pasta/'index.html').write_text(page,encoding='utf-8')
        (pasta/'exemplos').mkdir()
        (pasta/'exemplos/index.html').write_text(pagina_exemplos,encoding='utf-8')
        catalogo['materiais'].append({
            'tipo':'html','origem':rel,'destino':rel,'titulo':doc['titulo'],'estilo_visual':'territorio-experiencias',
            'rota_exemplos':{'arquivo':'exemplos/index.html','minimo':64,'quantidade':len(exemplos['percursos'])},
            'versao_visual':'piloto-1.0','atualizado_em':pedido['data'],
            'portal':{'ano_letivo':int(pedido['data'][:4]),'categoria':'aula',
              'componentes':[aula['disciplina']],'series':[aula.get('serie','Ensino Fundamental')],
              'turmas':[str(aula['turma'])],'escola':'Bernardina Rodrigues Padilha',
              'escola_curta':'Bernardina','palavras_chave':[aula['tema']],
              'descricao':doc['objetivo'],'titulo_exibicao':doc['titulo'],
              'metadados_fonte':'Gerado a partir de pedido curricular; revisão docente obrigatória.'}})
        gerados.append(rel)
    caminho.write_text(json.dumps(catalogo,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (ROOT/'automacoes/aulas/ultima-geracao.json').write_text(json.dumps(
        {'pedido':args.pedido,'estado':'pronto_para_revisao','artefatos':gerados},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Aulas geradas para revisão (não publicadas):',gerados)

if __name__=='__main__':
    try: main()
    except Exception as exc:
        print('ERRO:',str(exc),file=sys.stderr)
        sys.exit(1)
