from pathlib import Path
import json, html, qrcode
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from pypdf import PdfWriter, PdfReader

ROOT=Path(__file__).resolve().parent
BASE="https://andredor19.github.io/Arquiteturas-da-Aprendizagem/gincana-erer/"
TOPICS=[
"Identidade, respeito e convivencia","Brincadeiras e jogos de matrizes africanas","Palavras africanas presentes no portugues","Historias e contos de povos africanos",
"Quilombos e comunidades quilombolas","Alimentacao e memoria afro-brasileira","Mapas e diversidade dos paises africanos","Musica e ritmos afro-brasileiros",
"Abolicao e seus limites historicos","Mulheres negras que transformaram a historia","Arte afro-brasileira e artistas negros","Religioes de matriz africana e liberdade de crenca",
"Movimentos negros e direitos civis","Lanceiros Negros e memoria regional","Literatura negra brasileira","Racismo na midia e estereotipos",
"Ciencia e representatividade negra","Tecnologias e inventores negros","Cinema negro e representatividade","Africa contemporanea e inovacao",
"Trabalho e desigualdades raciais","Esporte e combate ao racismo","Educacao antirracista e legislacao","Moda, estetica e identidade negra",
"Acoes afirmativas e universidade","Racismo algoritmico e cidadania digital","Memoria, patrimonio e reparacao historica","Projetos de intervencao antirracista"]
STATIONS=["Portal da Gincana ERER","Literatura e autoria","Memoria e territorios","Ciencia e representatividade","Jogos e matematica","Linguagens e respeito","Direitos e compromisso"]
QUESTIONS=[
("Quem escreveu Quarto de Despejo?",["Conceicao Evaristo","Carolina Maria de Jesus","Lelia Gonzalez"],1,"Carolina Maria de Jesus e autora de Quarto de Despejo."),
("Porongos, em 1844, esta relacionado a qual grupo?",["Lanceiros Negros","Inconfidentes mineiros","Tupinambas"],0,"Porongos remete a memoria historica dos Lanceiros Negros."),
("O que e importante estudar sobre cientistas negros?",["Somente a idade","Barreiras historicas e acesso a oportunidades","A cor de suas roupas"],1,"O acesso as instituicoes cientificas foi historicamente desigual."),
("Mancala e:",["Um unico jogo universal","Uma familia de jogos de semeadura","Um instrumento musical"],1,"Mancala nomeia uma familia diversa de jogos."),
("Qual atitude combate o preconceito linguistico?",["Investigar origens, contextos e respeito","Proibir palavras africanas","Ignorar ofensas"],0,"Reconhecer origens e combater ofensas fortalece o respeito."),
("Um compromisso antirracista deve ser:",["Pontual e sem retorno","Continuo e verificavel","Somente uma atividade anual"],1,"Compromissos efetivos requerem continuidade.")]
qr_dir=ROOT/"qr_codes";qr_dir.mkdir(exist_ok=True)
for i in range(7):
    u=BASE if i==0 else BASE+"#e"+str(i)
    qr=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H,box_size=12,border=4)
    qr.add_data(u);qr.make(fit=True)
    qr.make_image(fill_color="#12383b",back_color="#ffffff").convert("RGB").save(qr_dir/f"QR_{i:02}.png")

def decor(c,w,h):
    c.setFillColor(colors.HexColor("#f9f3e5"));c.rect(0,0,w,h,fill=1,stroke=0)
    c.setFillColor(colors.HexColor("#143c42"));c.rect(0,h-123,w,123,fill=1,stroke=0)
    for j in range(13):
        for x in (35,w-35):
            y=95+j*46
            c.setStrokeColor(colors.HexColor("#bd9147") if j%2 else colors.HexColor("#17807b"))
            p=c.beginPath();p.moveTo(x-10,y);p.lineTo(x,y+10);p.lineTo(x+10,y);p.lineTo(x,y-10);p.close()
            c.drawPath(p,stroke=1,fill=0)
    c.setFillColor(colors.white);c.setFont("Helvetica-Bold",23);c.drawCentredString(w/2,h-51,"GINCANA ERER")
    c.setFont("Helvetica",11);c.drawCentredString(w/2,h-73,"EDUCACAO DAS RELACOES ETNICO-RACIAIS")

def wrapped(c,text,x,y,width=85,font=10,leading=17):
    words=text.split();line=""
    for word in words:
        if len(line+" "+word)>width:
            c.drawString(x,y,line);y-=leading;line=word
        else:line=(line+" "+word).strip()
    if line:c.drawString(x,y,line);y-=leading
    return y

posters=ROOT/"Cartazes_QR_Gincana_ERER.pdf"
c=canvas.Canvas(str(posters),pagesize=A4)
w,h=A4
for i,name in enumerate(STATIONS):
    decor(c,w,h)
    c.setFillColor(colors.white);c.setFont("Helvetica-Bold",14);c.drawCentredString(w/2,h-108,name.upper())
    c.drawImage(str(qr_dir/f"QR_{i:02}.png"),w/2-163,h/2-185,326,326)
    c.setFillColor(colors.HexColor("#17363a"));c.setFont("Helvetica-Bold",14)
    c.drawCentredString(w/2,165,"APONTE A CAMERA E DESCUBRA A MISSAO")
    c.setFont("Helvetica",9);c.drawCentredString(w/2,139,"Todos os percursos estao abertos a todas as equipes")
    c.setFont("Helvetica",8);c.drawCentredString(w/2,100,BASE if i==0 else BASE+"#e"+str(i))
    c.showPage()
c.save()
manual=ROOT/"Manual_Gincana_ERER_2026.pdf"
c=canvas.Canvas(str(manual),pagesize=A4)
page_groups=[
[("Objetivo","Organizar uma gincana interdisciplinar de Educacao das Relacoes Etnico-Raciais em qualquer escola, sem turmas ou instituicoes previamente definidas."),
("Modelo de participacao","Todas as equipes podem integrar estudantes de diferentes anos e turmas. Cada equipe cria seu proprio nome e recebe um tema definido pela organizacao, inclusive por sorteio. A apresentacao aborda somente esse tema, enquanto todos os desafios sao compartilhados."),
("Organizacao inicial","Definir mediadores, tempo de atividade e espacos seguros; apresentar as regras; mesclar estudantes de diferentes turmas nas equipes e sortear temas; testar internet e dispositivos; imprimir e fixar os QR Codes."),
("Acesso","O QR do portal e os seis QR das estacoes sao universais e podem ser utilizados por qualquer escola. Os estudantes informam nome de escola, nome de equipe e tema na pagina.")],
[("Preparacao da apresentacao","Pesquisar com fontes confiaveis, comparar perspectivas, produzir material autoral e apresentar exclusivamente o tema da equipe. Nao e obrigatorio apresentar os demais temas."),
("Percursos","Distribuir os seis cartazes tematicos pela escola em locais acessiveis. Equipes podem percorrer todas as estacoes em qualquer ordem. Em cada uma, ler a questao, discutir, responder e receber explicacao."),
("Avaliacao das apresentacoes","Mediador pode avaliar qualidade das fontes, clareza, colaboracao, reflexao critica e criatividade, atribuindo de zero a dois pontos por criterio. Provas presenciais tambem precisam de validacao humana."),
("Limitacao da versao demonstrativa","Os seis desafios objetivos usam pontuacao local (10 pontos por acerto, uma vez por estacao). Nao ha sincronizacao entre aparelhos nem placar oficial multi-escola. Mantenha registro separado para a avaliacao oficial.")],
[("Seguranca e convivencia","Nao correr nem disputar fisicamente os codigos. Nao realizar simulacao de escravizacao, blackface ou encenacoes religiosas. Nao exigir que estudantes negros sejam porta-vozes de suas comunidades."),
("Inclusao","Oferecer leitura mediada, apoio por imagens, cooperação entre colegas e alternativas impressas. Adequar a tarefa ao perfil dos participantes e garantir acessibilidade dos locais."),
("Privacidade","Evitar cadastro de estudantes individualmente. A demonstracao utiliza identificacao por escola e nome da equipe salva no aparelho, sem cadastro central."),
("Falha de internet","Imprima perguntas e fichas de registro, mantenha gabarito com os mediadores e lance a pontuacao posteriormente."),
("Encerramento","Organize mostra de apresentacoes, compromisso coletivo de enfrentamento ao racismo e retorno para verificar resultados apos aproximadamente 30 dias.")]]
for page_no,items in enumerate(page_groups,1):
    decor(c,w,h);c.setFillColor(colors.HexColor("#17363a"));c.setFont("Helvetica-Bold",15)
    c.drawString(72,h-161,"MANUAL DO ORGANIZADOR - PARTE "+str(page_no))
    y=h-203
    for heading,body in items:
        c.setFont("Helvetica-Bold",12);c.drawString(72,y,heading);y-=26
        c.setFont("Helvetica",10);y=wrapped(c,body,72,y,91);y-=21
    c.showPage()
decor(c,w,h);c.setFillColor(colors.HexColor("#17363a"));c.setFont("Helvetica-Bold",16);c.drawString(72,h-158,"CATALOGO DE 28 TEMAS")
y=h-190
for i,t in enumerate(TOPICS):
    c.setFont("Helvetica",9);c.drawString(72,y,f"T{i+1:02} - {t}");y-=19
    if y<85:c.showPage();decor(c,w,h);y=h-165
c.showPage();c.save()
writer=PdfWriter()
for src in (manual,posters):
    for p in PdfReader(str(src)).pages:writer.add_page(p)
with (ROOT/"Manual_Completo_Com_QR_Codes.pdf").open("wb") as f:writer.write(f)

style="""*{box-sizing:border-box}body{margin:0;font:16px/1.58 system-ui,sans-serif;background:#fbf5e9;color:#17393b}header{padding:65px max(24px,calc((100% - 1080px)/2));background:linear-gradient(115deg,#102e39,#197d79);color:white;border-bottom:11px solid #d9a450}header h1{font-size:clamp(45px,8vw,78px);line-height:1.04;margin:8px 0}header p{max-width:700px;font-size:19px}.eyebrow{letter-spacing:.16em;text-transform:uppercase;font-size:12px;color:#f1d298}nav{padding:12px max(20px,calc((100% - 1080px)/2));background:#fff8e9;display:flex;gap:18px;flex-wrap:wrap;position:sticky;top:0;border-bottom:1px solid #ddcaa3}nav a{color:#15585b;font-weight:700;text-decoration:none}main{max-width:1080px;margin:auto;padding:12px}section{background:#fff;border:1px solid #e6d3ac;border-radius:18px;padding:26px;margin:20px 0}h2{font-size:28px;color:#174e50;margin:0 0 16px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}.tile{background:#fff8ec;padding:16px;border-radius:13px;border:1px solid #e8d4ad}.tile h3{margin:0}label{display:block;font-weight:700;margin:12px 0}input,select{width:100%;padding:12px;border:1px solid #9cafae;border-radius:9px;font:inherit}button,.btn{background:#176e72;color:white;border:0;border-radius:10px;padding:13px 18px;font:700 15px system-ui;display:inline-block;cursor:pointer;text-decoration:none;margin:5px 5px 5px 0}.btn{background:#e1ae57;color:#183337}.notice{border-left:5px solid #d7aa54;background:#fff4dc;padding:13px;margin:15px 0}.card{padding:16px;border:1px solid #d5e3de;border-radius:14px}.choice{background:#f5f5ef;border-radius:10px;padding:10px;margin:6px 0;font-weight:400}.choice input{width:auto}.hidden{display:none}.bar{background:#e4f1ed;height:14px;border-radius:20px;overflow:hidden}.bar div{height:100%;background:#15837f}.subtle{color:#587075}.motif{height:10px;background:repeating-linear-gradient(90deg,#dca453 0 24px,#17505a 24px 48px,#edd29b 48px 72px,#258a80 72px 96px)}@media(max-width:650px){nav{position:static}section{padding:17px}}"""
js="""const TOPICS=__TOPICS__,NAMES=__NAMES__,Q=__QUESTIONS__,el=id=>document.getElementById(id);let index=-1;let data;try{data=JSON.parse(localStorage.getItem('erer-public-demo')||'{"teams":{},"current":null}')}catch{data={teams:{},current:null}}function current(){return data.teams[data.current]}function save(){localStorage.setItem('erer-public-demo',JSON.stringify(data))}function render(){let t=current();el('profile').textContent=t?t.school+' • '+t.name+' • Tema: '+TOPICS[t.topic]:'Cadastre a equipe.';let hits=t?Object.values(t.answers||{}).filter(Boolean).length:0;el('score').textContent=t?hits+' de 6 provas concluídas • '+hits*10+' pontos locais':'Cadastre sua equipe.';el('barfill').style.width=(hits/6*100)+'%';el('stations').replaceChildren();Q.forEach((q,i)=>{let x=document.createElement('article');x.className='card';let h=document.createElement('h3');h.textContent='E'+(i+1)+' · '+NAMES[i+1];let p=document.createElement('p');p.textContent=t&&t.answers[i]?'Concluída · 10 pontos':'Disponível';let b=document.createElement('button');b.textContent='Abrir desafio';b.onclick=()=>openChallenge(i);x.append(h,p,b);el('stations').append(x)})}TOPICS.forEach((t,i)=>{let o=document.createElement('option');o.value=i;o.textContent='T'+String(i+1).padStart(2,'0')+' · '+t;el('topic').append(o)});TOPICS.forEach((topic,i)=>{let x=document.createElement('article');x.className='tile';let h=document.createElement('h3');h.textContent='Tema '+String(i+1).padStart(2,'0');let p=document.createElement('p');p.textContent=topic;x.append(h,p);el('catalog').append(x)})el('register').onclick=()=>{let school=el('school').value.trim(),name=el('team').value.trim(),topic=el('topic').value;if(school.length<3||name.length<2||topic===''){el('msg').textContent='Informe escola, nome de equipe e tema.';return}let key=(school+'|'+name).normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();let old=data.teams[key];data.teams[key]={school,name,topic:Number(topic),answers:old?.answers||{}};data.current=key;save();render();el('msg').textContent='Equipe salva neste dispositivo.';location.hash='equipe'};el('switch').onclick=()=>{let entries=Object.entries(data.teams);if(!entries.length)return;let s=prompt('Número da equipe:\\n'+entries.map(([k,v],i)=>(i+1)+' - '+v.name).join('\\n'));let n=Number(s);if(!Number.isInteger(n)||n<1||n>entries.length)return;data.current=entries[n-1][0];save();render()};function openChallenge(i){if(!current()){location.hash='cadastro';el('msg').textContent='Cadastre a equipe antes.';return}index=i;el('challenge').classList.remove('hidden');el('question-title').textContent='E'+(i+1)+' · '+NAMES[i+1];el('question').textContent=Q[i][0];el('choices').replaceChildren();Q[i][1].forEach((a,j)=>{let label=document.createElement('label');label.className='choice';let b=document.createElement('input');b.type='radio';b.name='answer';b.value=j;label.append(b,document.createTextNode(' '+a));el('choices').append(label)});el('feedback').textContent='';history.replaceState(null,'',location.pathname+'#e'+(i+1));el('challenge').scrollIntoView({behavior:'smooth'})}el('submit').onclick=()=>{let a=document.querySelector('input[name="answer"]:checked');if(!a||index<0)return;let ok=Number(a.value)===Q[index][2];el('feedback').textContent=ok?'Correto! '+Q[index][3]:'Ainda não. Leia e tente outra alternativa.';if(ok){current().answers[index]=true;save();render()}};el('export').onclick=()=>{if(!current())return;let b=new Blob([JSON.stringify(current(),null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='gincana-erer-registro-local.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};render();let m=location.hash.match(/^#e([1-6])$/);if(m){if(current())openChallenge(Number(m[1])-1);else{el('msg').textContent='Cadastre a equipe e depois abra o desafio E'+m[1];location.hash='cadastro'}}"""
js=js.replace("__TOPICS__",json.dumps(TOPICS,ensure_ascii=False)).replace("__NAMES__",json.dumps(STATIONS,ensure_ascii=False)).replace("__QUESTIONS__",json.dumps(QUESTIONS,ensure_ascii=False))
style += "\n/* Identidade visual ERER: grafismos originais, contraste alto e leitura acessivel */\n:root{--terra:#b84823;--ouro:#ffca55;--verde:#0b786d;--azul:#184f8a;--roxo:#7b387f;--tinta:#17383b}\nbody{background-color:#fff6df;background-image:radial-gradient(circle at 8% 14%,#ffd2795e 0 7%,transparent 7.5%),radial-gradient(circle at 92% 28%,#b8dad35e 0 9%,transparent 9.5%),repeating-linear-gradient(135deg,transparent 0 55px,#c98d4730 56px 58px,transparent 59px 112px);background-attachment:fixed}\nheader{position:relative;isolation:isolate;overflow:hidden;min-height:390px;background:radial-gradient(circle at 17% 16%,#fbba5475 0 10%,transparent 11%),linear-gradient(118deg,#112b49 0%,#145c62 48%,#a84025 100%);border-bottom:15px solid #eec359;padding-right:max(24px,calc((100% - 1080px)/2));}\nheader:after{content:\"\";position:absolute;inset:auto 0 0;opacity:.7;height:42px;background:repeating-linear-gradient(90deg,#eeb34b 0 24px,#f0d39b 24px 32px,#196d69 32px 58px,#203e64 58px 66px,#c04a2a 66px 90px);z-index:-1}\nheader h1{max-width:680px;font-size:clamp(45px,7vw,84px);letter-spacing:-.045em;text-shadow:0 3px 2px #122e3970;position:relative;z-index:1}\nheader p,header strong,header .eyebrow{position:relative;z-index:1}header strong{display:inline-flex;background:#ffcf70;color:#193d40;padding:8px 15px;border-radius:20px;box-shadow:5px 5px 0 #112a4e;font-weight:850}\n.motif{height:16px;background:repeating-linear-gradient(90deg,#eec359 0 25px,#b64f2d 25px 50px,#1e7d72 50px 75px,#2d5690 75px 100px,#7a3d78 100px 125px)}\nsection{box-shadow:7px 9px 0 #c17a3445;border:2px solid #eac789;background:#fffdf7}\nsection:nth-of-type(3n){border-color:#8ec7c1}section:nth-of-type(4n){border-color:#e1ae70}\nh2{border-left:7px solid #dc773c;padding-left:13px}section:nth-of-type(2n) h2{border-left-color:#177e76}\n.tile{background:linear-gradient(165deg,#ffeed1,#fffaf0);border-color:#dcb780;box-shadow:4px 4px 0 #b76b3f2b;transition:transform .2s ease}\n.tile:nth-child(4n+2){background:linear-gradient(165deg,#e4f5ef,#fffdf1);border-color:#a3d4c7}\n.tile:nth-child(4n+3){background:linear-gradient(165deg,#eee9ff,#fffdf1);border-color:#c2b2e5}\n.tile:nth-child(4n+4){background:linear-gradient(165deg,#fce1d4,#fffdf1);border-color:#e5b29d}\n.tile:hover{transform:translateY(-3px)}\nbutton,.btn{background:#126f6e;box-shadow:3px 4px 0 #143c43;transition:transform .15s ease,box-shadow .15s ease}\nbutton:hover,.btn:hover{transform:translateY(-2px);box-shadow:4px 6px 0 #143c43}\nbutton:focus-visible,.btn:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #e29b31;outline-offset:3px}\n.btn{background:#efb647;color:#17363b}nav{box-shadow:0 2px 10px #193e3528}\n.erer-visual{position:absolute;right:max(15px,calc((100% - 1140px)/2));top:22px;width:min(39vw,420px);height:350px;opacity:.97;filter:drop-shadow(0 10px 10px #092d3650);z-index:0;pointer-events:none}\n.erer-visual svg{width:100%;height:100%}\n.erer-small{display:inline-block;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#b64b2c;font-size:.78rem}\n@media(max-width:900px){.erer-visual{opacity:.28;right:-35px;top:55px;width:350px;height:310px}header h1{max-width:100%}}\n@media(max-width:600px){header{padding-top:38px;min-height:320px}.erer-visual{width:270px;height:280px;opacity:.17}section{box-shadow:3px 4px 0 #c17a3445}nav{position:static}}\n@media(prefers-reduced-motion:reduce){.tile,button,.btn{transition:none}}\n"
page="""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gincana ERER | Plataforma aberta</title><style>__CSS__</style></head><body><header><div class="erer-visual" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 390" role="presentation">
<circle cx="225" cy="190" r="168" fill="#f6c45b" opacity=".92"/>
<circle cx="225" cy="190" r="148" fill="none" stroke="#183b60" stroke-width="4" stroke-dasharray="19 12"/>
<circle cx="225" cy="190" r="124" fill="#f3a35b" opacity=".8"/>
<path d="M70 210Q190 285 382 175" fill="none" stroke="#f7e7b9" stroke-width="14" opacity=".5"/>
<!-- Berimbau: curved wooden bow, single string, gourd and playing stick -->
<path d="M253 26 Q394 177 244 363" fill="none" stroke="#653520" stroke-width="12" stroke-linecap="round"/>
<path d="M253 26L244 363" fill="none" stroke="#fff2be" stroke-width="2.5"/>
<ellipse cx="293" cy="250" rx="37" ry="48" transform="rotate(-18 293 250)" fill="#99501d" stroke="#522d1d" stroke-width="4"/>
<ellipse cx="288" cy="251" rx="20" ry="29" fill="#c67e32"/>
<path d="M211 134L357 348" stroke="#59351c" stroke-width="6" stroke-linecap="round"/>
<!-- Atabaque -->
<path d="M94 235L112 334Q148 355 177 331L193 235Z" fill="#8e4131" stroke="#4f3043" stroke-width="5"/>
<ellipse cx="143" cy="234" rx="50" ry="18" fill="#efd3a1" stroke="#4f3043" stroke-width="5"/>
<path d="M110 255L122 327M175 255L162 329" stroke="#f1bd5b" stroke-width="6"/>
<path d="M97 267L190 267M105 313L182 313" stroke="#f4c06c" stroke-width="5"/>
<!-- symbolic dance energy, non-sacred geometric shapes -->
<path d="M98 130L125 85L152 130L125 175Z" fill="#197b76"/>
<path d="M100 130L125 103L150 130L125 157Z" fill="#fff2b7"/>
<circle cx="178" cy="99" r="12" fill="#c64b2f"/><circle cx="355" cy="103" r="16" fill="#184e88"/>
<path d="M333 80l16 29-16 29-16-29Z" fill="#7a3b79"/>
<path d="M53 190l21-21 21 21-21 21Z" fill="#ba4b2b"/>
<circle cx="352" cy="312" r="10" fill="#226e6b"/>
</svg></div><div class="eyebrow">Memória • diversidade • respeito • conhecimento</div><h1>Gincana ERER</h1><p>Uma identidade para cada equipe. Um circuito de aprendizagem para qualquer escola.</p><strong>28 temas • seis estações • acesso aberto</strong></header><div class="motif"></div><nav><a href="#organizador">Manual e QR Codes</a><a href="#cadastro">Cadastro</a><a href="#equipe">Minha equipe</a><a href="#temas">Temas</a><a href="#circuito">Percursos</a><a href="#placar">Pontos</a></nav><main><section id="organizador"><h2>Organize a gincana na sua escola</h2><p>Utilização aberta a todas as escolas. Prepare suas equipes, distribua os QR Codes e escolha os temas para apresentação.</p><div class="grid"><div class="tile"><h3>01 • Leia o manual</h3>Organização, mediação, regras, avaliação, acessibilidade.</div><div class="tile"><h3>02 • Imprima os cartazes</h3>Sete QR Codes em A4, com identidade gráfica temática.</div><div class="tile"><h3>03 • Forme as equipes</h3>Cada equipe cria o próprio nome e escolhe um tema.</div><div class="tile"><h3>04 • Realize os percursos</h3>Todos fazem os desafios; cada equipe apresenta só o seu tema.</div></div><p><a class="btn" href="Manual_Completo_Com_QR_Codes.pdf" download>↓ Manual completo e QR Codes</a><a class="btn" href="Cartazes_QR_Gincana_ERER.pdf" download>↓ Cartazes para imprimir</a></p><div class="notice"><b>Versão inicial:</b> cadastro e pontos salvos somente no aparelho. Ainda não há sincronização entre escolas, ranking oficial ou validação digital de provas presenciais.</div></section><section id="cadastro"><h2>Cadastre sua equipe</h2><p>Todas as equipes são mistas, reunindo estudantes de diferentes turmas e anos. Não é preciso identificar a série ou informar nomes dos estudantes. O tema poderá ser atribuído por sorteio pela organização.</p><label>Nome da escola<input id="school" maxlength="100" placeholder="Nome da instituição"></label><label>Nome próprio da equipe<input id="team" maxlength="60" placeholder="Ex.: Vozes da Resistência"></label><label>Tema da apresentação<select id="topic"><option value="">Escolha um tema</option></select></label><button id="register">Salvar equipe neste aparelho</button><button id="switch">Trocar equipe</button><p id="msg" role="status"></p></section><section id="equipe"><h2>Minha equipe</h2><div class="tile" id="profile">Cadastre sua equipe.</div><p>Pesquise seu tema principal, organize fontes e prepare sua apresentação. Você pode visitar todas as estações e fazer todos os desafios.</p></section><section id="temas"><h2>28 temas para apresentações</h2><p class="subtle">Catálogo único de 28 temas, sem separação por ano ou turma. As equipes são integradas, com estudantes de diferentes turmas e anos. A distribuição dos temas pode ser feita por sorteio pela organização.</p><div id="catalog" class="grid"></div></section><section id="circuito"><h2>Circuito de QR Codes</h2><p>Seis desafios objetivos demonstrativos. Os cartazes com QR Codes podem ser espalhados pela escola.</p><div class="grid" id="stations"></div><div class="card hidden" id="challenge"><h3 id="question-title"></h3><p id="question"></p><div id="choices"></div><button id="submit">Conferir resposta</button><p id="feedback" role="status"></p></div></section><section id="placar"><h2>Pontuação local</h2><p id="score">Cadastre sua equipe.</p><div class="bar"><div id="barfill" style="width:0"></div></div><p class="subtle">A pontuação deste demonstrador não é um placar oficial entre escolas.</p><button id="export">Exportar registro local</button></section><section><h2>Regras essenciais</h2><p>Respeito, colaboração, pesquisa em fontes confiáveis, cuidado com materiais e espaços da escola. Provas práticas e apresentações precisam da avaliação do mediador. Não serão admitidas representações estereotipadas ou ofensivas. Garanta alternativas acessíveis.</p></section></main><script>__JS__</script></body></html>""".replace("__CSS__",style).replace("__JS__",js)
(ROOT/"index.html").write_text(page,encoding="utf-8")
print("ERER build complete",len(page),len(PdfReader(str(ROOT/"Manual_Completo_Com_QR_Codes.pdf")).pages))
