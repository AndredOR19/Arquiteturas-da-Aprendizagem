"""Rota opcional por exemplos: banco curricular separado, sem nota."""
import html
import json

MINIMO = 64
PADRAO = 96

def validar(data, minimo=MINIMO):
    items = data.get('percursos', [])
    if not isinstance(items, list) or len(items) < minimo:
        raise ValueError('Exemplos e relações: mínimo de '+str(minimo)+' percursos')
    ids = set()
    assinaturas = set()
    for item in items:
        if not isinstance(item.get('id'), str) or not item['id'] or item['id'] in ids:
            raise ValueError('ID de percurso ausente ou duplicado')
        ids.add(item['id'])
        for key in ('exemplo', 'relacao', 'pergunta', 'transferencia'):
            if not isinstance(item.get(key), str) or not 5 <= len(item[key]) <= 180:
                raise ValueError('Texto breve obrigatório: '+key)
        linguagens = item.get('linguagens', {})
        if not isinstance(linguagens, dict) or any(not isinstance(linguagens.get(k), str) or not 5 <= len(linguagens[k]) <= 180 for k in ('direta','cotidiana','comparacao')):
            raise ValueError('Exigir explicações direta, cotidiana e por comparação')
        elementos = item.get('elementos', [])
        if not isinstance(elementos, list) or not 2 <= len(elementos) <= 4 or any(not isinstance(x, str) or not 1 <= len(x) <= 55 for x in elementos):
            raise ValueError('Exigir de dois a quatro elementos relacionados')
        assinatura = tuple(' '.join(item[k].lower().split()) for k in ('exemplo', 'relacao', 'pergunta'))
        if assinatura in assinaturas:
            raise ValueError('Percurso literal duplicado')
        assinaturas.add(assinatura)
        options = item.get('alternativas', [])
        if not isinstance(options, list) or not 2 <= len(options) <= 3:
            raise ValueError('Exigir duas ou três alternativas curtas comentadas')
        if type(item.get('correta')) is not int or not 0 <= item['correta'] < len(options):
            raise ValueError('Resposta inválida')
        for option in options:
            if not isinstance(option.get('texto'), str) or not 1 <= len(option['texto']) <= 80 or not isinstance(option.get('feedback'), str) or not 5 <= len(option['feedback']) <= 180:
                raise ValueError('Alternativa ou feedback inválido')
    return data

def renderizar(data, titulo, chave):
    validar(data)
    payload = json.dumps(data, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
    return PAGE.replace('__TITULO__', html.escape(titulo)).replace('__CHAVE__', html.escape(chave, quote=True)).replace('__DADOS__', payload)

PAGE = '''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aprender de outro jeito — exemplos e relações · __TITULO__</title><style>
:root{font:19px/1.5 system-ui;color:#18323b;background:#eff5fa}*{box-sizing:border-box}body{max-width:900px;margin:auto;padding:16px}header,main{background:white;border:2px solid #24495c;border-radius:16px;padding:20px;margin:14px 0}button,a,select{font:inherit;min-height:48px;padding:12px;border:2px solid #24495c;border-radius:10px;background:#edf6ff;color:#18323b;cursor:pointer}a{display:inline-block}button:disabled{opacity:.6;cursor:default}button:focus-visible,a:focus-visible{outline:4px solid #b94f00;outline-offset:3px}#elementos{display:flex;flex-wrap:wrap;gap:12px}#elementos span{flex:1;min-width:140px;border:2px solid #24495c;padding:12px;border-radius:10px;background:#e8f2ea}#opcoes{display:grid;gap:12px}.menu{display:flex;flex-wrap:wrap;gap:12px}details{margin:12px 0}small{display:block}
</style></head><body data-chave="__CHAVE__"><header><h1>Aprender de outro jeito — exemplos e relações</h1><p>__TITULO__</p><p>Caminho opcional com leitura breve, exemplos e diferentes formas de explicar. Sem alterar sua nota. Pode parar e voltar à aula quando quiser.</p><div class="menu"><a href="../">Voltar à aula</a><button id="ouvir">Ouvir esta etapa</button><button id="parar">Parar áudio</button><button id="reiniciar">Recomeçar este caminho</button></div><small id="audio" role="status"></small><small id="salvo"></small></header><main><p id="progresso"></p><h2>Veja o exemplo</h2><p id="exemplo"></p><div id="elementos" aria-label="Elementos para relacionar"></div><details id="modelo" open><summary>Como os elementos se relacionam</summary><label>Forma de explicar <select id="linguagem"><option value="direta">Direta</option><option value="cotidiana">Exemplo cotidiano</option><option value="comparacao">Comparação</option></select></label><p id="relacao"></p></details><h2 id="pergunta"></h2><div id="opcoes"></div><p id="retorno" role="status" aria-live="polite"></p><p id="transferencia" hidden></p><button id="proximo" disabled>Próximo exemplo</button><p>Este banco permite prática distribuída. Você não precisa concluir tudo hoje. Não é uma avaliação diagnóstica.</p></main><script id="dados-exemplos" type="application/json">__DADOS__</script><script>
(()=>{'use strict';const $=id=>document.getElementById(id),data=JSON.parse($('dados-exemplos').textContent),items=data.percursos,key='exemplos-v1:'+document.body.dataset.chave;
let pos=0,done=false;
try{const n=JSON.parse(sessionStorage.getItem(key));if(n&&Number.isInteger(n.pos)&&n.pos>=0&&n.pos<items.length){pos=n.pos;done=n.done===true;}}catch{$('salvo').textContent='Não foi possível restaurar o progresso. Pode continuar sem salvar.';}
function save(){try{sessionStorage.setItem(key,JSON.stringify({pos,done}));$('salvo').textContent='Progresso salvo nesta aba. Ao trocar de aluno, use Recomeçar este caminho.';}catch{$('salvo').textContent='O navegador não permite salvar. Mantenha a página aberta para continuar.';}}
function speak(text){if(!('speechSynthesis'in window)){$('audio').textContent='Áudio indisponível. Use os exemplos e peça mediação.';return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='pt-BR';u.rate=.85;u.onerror=()=>{$('audio').textContent='Voz indisponível neste dispositivo. Peça mediação.';};speechSynthesis.speak(u);}
function render(){const q=items[pos];$('progresso').textContent='Bloco '+(Math.floor(pos/12)+1)+' · Percurso '+(pos+1)+' de '+items.length;$('exemplo').textContent=q.exemplo;$('relacao').textContent=q.linguagens[$('linguagem').value]||q.relacao;$('modelo').open=true;
$('elementos').replaceChildren(...q.elementos.map(t=>{const n=document.createElement('span');n.textContent=t;return n;}));$('pergunta').textContent=q.pergunta;$('retorno').textContent=done?'Etapa concluída. Você pode seguir.':'Observe o exemplo e escolha a relação.';$('transferencia').textContent=q.transferencia;$('transferencia').hidden=!done;$('proximo').disabled=!done;
$('opcoes').replaceChildren(...q.alternativas.map((o,i)=>{const b=document.createElement('button');b.textContent=o.texto;b.disabled=done;b.onclick=()=>{const correct=i===q.correta;$('retorno').textContent=o.feedback;if(correct){done=true;save();$('proximo').disabled=false;$('transferencia').hidden=false;[...$('opcoes').children].forEach(x=>x.disabled=true);}else{$('modelo').open=true;$('retorno').textContent+=' Observe a relação e tente novamente. Peça ajuda se precisar.';}};return b;}));$('proximo').textContent=pos===items.length-1?'Concluir este caminho':'Próximo exemplo';}
$('linguagem').onchange=()=>{$('relacao').textContent=items[pos].linguagens[$('linguagem').value];};$('reiniciar').onclick=()=>{pos=0;done=false;save();render();};$('ouvir').onclick=()=>{const q=items[pos];speak([q.exemplo,q.elementos.join('. '),$('relacao').textContent,q.pergunta,...q.alternativas.map((o,i)=>(i+1)+'. '+o.texto)].join('. '));};$('parar').onclick=()=>window.speechSynthesis?.cancel();
$('proximo').onclick=()=>{if(!done)return;if(pos===items.length-1){$('retorno').textContent='Você concluiu este caminho de exemplos. Volte à aula para combinar os próximos passos com o professor.';$('proximo').disabled=true;return;}pos++;done=false;save();render();};render();
})();</script></body></html>'''
