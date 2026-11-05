#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Motor acessível AIx — renderiza um contrato AIx em experiência HTML semântica.

Propriedades: navegação 100% por teclado, leitor de tela (landmarks + aria),
sem arrastar, sem dependência de movimentação espacial, registro local no padrão
de eventos da coleta (sessão + tentativas + evidências), relatório integral
copiável/baixável. Sem rede, sem credenciais, sem dados pessoais obrigatórios.

Uso: python3 aix/engines/accessible/gerar.py <contrato.json> [saida.html]
"""
import html
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[3]


def e(texto):
    return html.escape(str(texto), quote=True)


def renderizar(contrato):
    curr = contrato["curriculum"]
    exp = contrato["experience"]
    pend = contrato["publication"].get("blockers", [])
    avisos = "".join("<li>%s</li>" % e(b) for b in pend)
    ambiente_html = []
    for ambiente in exp["environments"]:
        interacoes = "".join("<li>%s</li>" % e(i) for i in ambiente.get("interactions", []))
        missoes = [m for m in exp["missions"] if m["environmentId"] == ambiente["id"]]
        missoes_html = []
        for missao in missoes:
            pistas = "".join("<li>%s</li>" % e(p) for p in missao.get("clues", []))
            missoes_html.append(
                '<details class="missao" id="%s"><summary><span class="rotulo">Missão</span> %s</summary>'
                "<p><strong>Objetivo:</strong> %s</p>"
                "%s"
                '<label for="%s-resp">Seu registro de investigação (não altera nota):</label>'
                '<textarea id="%s-resp" data-missao="%s" rows="4"></textarea>'
                '<button type="button" class="registrar" data-missao="%s" data-titulo="%s">Registrar evidência</button>'
                '<p class="estado" role="status"></p></details>'
                % (e(missao["id"]), e(missao["title"]), e(missao["objective"]),
                   ('<details class="pistas"><summary>Pistas</summary><ul>%s</ul></details>' % pistas) if pistas else "",
                   e(missao["id"]), e(missao["id"]), e(missao["id"]), e(missao["id"]), e(missao["title"]))
            )
        ambiente_html.append(
            '<section class="ambiente" id="%s" aria-labelledby="%s-t">'
            '<h2 id="%s-t">%s</h2><p>%s</p><h3>O que fazer aqui</h3><ul>%s</ul>%s'
            "</section>"
            % (e(ambiente["id"]), e(ambiente["id"]), e(ambiente["id"]), e(ambiente["title"]),
               e(ambiente["scenario"]), interacoes, "".join(missoes_html))
        )
    fonte_html = "".join(
        '<li>%s — <em>%s</em>%s</li>' % (e(f["title"]), "verificada pelo professor" if f.get("verified") else "verificação pendente",
                                         (" · " + e(f.get("reference", ""))) if f.get("reference") else "")
        for f in exp.get("sources", [])
    )
    documento = """<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITULO__</title>
<style>
:root{font:19px/1.65 system-ui,sans-serif;color:#1c2b33;background:#eef4f2}
*{box-sizing:border-box}body{max-width:920px;margin:0 auto;padding:18px}
header,section,.missao{background:#fff;border:2px solid #2d5f52;border-radius:14px;padding:18px;margin:16px 0}
h1{font-size:1.5rem;line-height:1.25}h2{font-size:1.2rem}.rotulo{font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:#2d5f52}
.aviso{background:#fff4d6;border-color:#8a6d1a}ul{padding-left:1.2rem}
summary{cursor:pointer;font-weight:700;padding:6px 0}summary:focus-visible{outline:4px solid #b341bd}
textarea{width:100%;font:inherit;padding:10px;border:2px solid #2d5f52;border-radius:8px;margin:6px 0}
button{font:inherit;padding:10px 14px;border:2px solid #2d5f52;border-radius:8px;background:#ffe279;cursor:pointer}
button:focus-visible{outline:4px solid #b341bd}.estado{min-height:1.4rem;font-weight:600}
progresso{display:block}
#barra{height:14px;background:#d9e6e1;border-radius:7px;overflow:hidden}#barra div{height:100%;background:#2d5f52;width:0}
footer small{display:block;margin-top:8px}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style></head><body>
<header>
<p class="rotulo">Arquiteturas da Aprendizagem · Fábrica AIx · prévia acessível (não publicada)</p>
<h1>__TITULO__</h1>
<p><strong>__ESCOLA__ · __SERIE__ · Turma __TURMA__ · __COMPONENTE__ · __PERIODO__</strong></p>
<p>__NARRATIVA__</p>
<p>Método: <strong>__METODO__</strong>. Andamento: <span id="contagem">0 de __TOTAL__ missões registradas</span>.</p>
<div id="barra" role="progressbar" aria-valuemin="0" aria-valuemax="__TOTAL__" aria-valuenow="0" aria-label="Missões com registro"><div></div></div>
</header>
__AVISOS__
<main>
__AMBIENTES__
<section class="ambiente" id="sintese"><h2 id="sintese-t">Síntese final</h2>
<p>Reúna o que você investigou. Este registro serve à conversa com o professor — não é prova e não altera sua nota.</p>
<label for="sintese-texto">Sua síntese histórica argumentativa:</label>
<textarea id="sintese-texto" rows="6"></textarea>
<button type="button" id="relatorio">Gerar relatório da investigação</button>
</section>
</main>
<section class="missao" id="relatorios" hidden><h2>Relatório</h2><textarea id="relatorio-texto" rows="12" readonly></textarea>
<p><button type="button" id="copiar">Copiar relatório</button> <button type="button" id="baixar">Baixar TXT</button></p></section>
<footer><small>Contrato __ID__ · gerado por __GERADOR__ v__VERSAO__ · eventos locais no padrão da coleta; nenhum dado pessoal é exigido.</small>
<small>Fontes: __FONTES__</small></footer>
<script>
(function(){
'use strict';
var CHAVE='aix:'+__IDJSON__+':v1';
var estado={sessao:'sess-'+Date.now().toString(36),registros:[],sintese:''};
try{var salvo=sessionStorage.getItem(CHAVE);if(salvo){estado=JSON.parse(salvo);}}catch(e){}
function salvar(){try{sessionStorage.setItem(CHAVE,JSON.stringify(estado));}catch(e){}}
function atualizarBarra(){
 var total=__TOTAL__,feitos=estado.registros.length;
 document.getElementById('contagem').textContent=feitos+' de '+total+' missões registradas';
 var barra=document.getElementById('barra');barra.setAttribute('aria-valuenow',String(feitos));barra.firstElementChild.style.width=(total?Math.round(100*feitos/total):0)+'%';
}
document.querySelectorAll('.registrar').forEach(function(botao){
 var id=botao.getAttribute('data-missao');
 var campo=document.getElementById(id+'-resp');var estadoP=botao.parentElement.querySelector('.estado');
 if(estado.registros.some(function(r){return r.missao===id;})){estadoP.textContent='Evidência já registrada nesta sessão.';botao.disabled=true;}
 botao.addEventListener('click',function(){
  var texto=campo.value.trim();
  if(texto.length<5){estadoP.textContent='Escreva seu registro antes de salvar (mínimo 5 caracteres).';return;}
  estado.registros.push({missao:id,titulo:botao.getAttribute('data-titulo'),texto:texto,quando:new Date().toISOString()});
  salvar();botao.disabled=true;campo.readOnly=true;estadoP.textContent='Registrado. Você pode continuar investigando.';atualizarBarra();
 });
});
var campoSintese=document.getElementById('sintese-texto');
if(estado.sintese){campoSintese.value=estado.sintese;}
campoSintese.addEventListener('input',function(){estado.sintese=campoSintese.value;salvar();});
document.getElementById('relatorio').addEventListener('click',function(){
 var linhas=['RELATÓRIO DA INVESTIGAÇÃO','Contrato: __ID__','Sessão local: '+estado.sessao,''];
 estado.registros.forEach(function(r,i){linhas.push((i+1)+'. ['+r.titulo+'] '+r.texto);});
 linhas.push('','SÍNTESE: '+(estado.sintese||'(não escrita)'));
 linhas.push('','Este apoio registra participação e progresso. Não é diagnóstico, não certifica leitura e não substitui a avaliação docente.');
 var saida=document.getElementById('relatorios');saida.hidden=false;
 document.getElementById('relatorio-texto').value=linhas.join('\\n');
 saida.scrollIntoView({behavior:'auto',block:'start'});
});
document.getElementById('copiar').addEventListener('click',function(){
 var texto=document.getElementById('relatorio-texto').value;
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(texto);}else{document.getElementById('relatorio-texto').select();}
});
document.getElementById('baixar').addEventListener('click',function(){
 var blob=new Blob([document.getElementById('relatorio-texto').value],{type:'text/plain;charset=utf-8'});
 var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='relatorio-investigacao-__ID__.txt';a.click();URL.revokeObjectURL(a.href);
});
atualizarBarra();
})();
</script>
</body></html>"""
    return (documento
            .replace("__TITULO__", e("As Encruzilhadas da História — %s" % exp.get("narrative", "")[:0] or "Investigação"))
            .replace("__ESCOLA__", e(curr["school"]))
            .replace("__SERIE__", e(curr["grade"]))
            .replace("__TURMA__", e(curr["classroom"]))
            .replace("__COMPONENTE__", e(curr["subject"]))
            .replace("__PERIODO__", e("%sº trimestre" % curr["term"] if isinstance(curr["term"], int) else curr["term"]))
            .replace("__NARRATIVA__", e(exp.get("narrative", "")))
            .replace("__METODO__", e(contrato["pedagogy"]["method"]))
            .replace("__AVISOS__", ('<section class="missao aviso" id="pendencias"><h2>Pendências antes do uso em aula</h2><ul>%s</ul><p>Estas pendências bloqueiam a publicação; a prévia serve à revisão docente.</p></section>' % avisos) if avisos else "")
            .replace("__AMBIENTES__", "".join(ambiente_html))
            .replace("__TOTAL__", str(len(exp["missions"])))
            .replace("__IDJSON__", json.dumps(contrato["experienceId"]))
            .replace("__ID__", e(contrato["experienceId"]))
            .replace("__GERADOR__", e(contrato["generated"]["by"]))
            .replace("__VERSAO__", e(contrato["generated"]["pipelineVersion"]))
            .replace("__FONTES__", fonte_html or "nenhuma declarada no contrato"))


def main():
    if len(sys.argv) < 2:
        print("uso: gerar.py <contrato.json> [saida.html]")
        return 1
    contrato = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    destino = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(sys.argv[1]).with_name("preview-acessivel.html")
    destino.write_text(renderizar(contrato), encoding="utf-8")
    print("PREVIA_ACESSIVEL_OK %s (%d bytes)" % (destino, destino.stat().st_size))
    return 0


if __name__ == "__main__":
    sys.exit(main())
