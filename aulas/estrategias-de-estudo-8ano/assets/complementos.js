/* Orientação, acesso e relatórios do mesmo componente curricular central. */
(()=>{'use strict';const A=window.AulaCentralGEI,C=A.content,S=A.getState(),root=document.getElementById('jogo'),$=s=>root.querySelector(s);
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
root.style.setProperty('--theme',C.palette[0]);root.style.setProperty('--accent',C.palette[1]);
$('.inicio-card').style.setProperty('--scene','url("assets/cenario.png")');
const how=make('div',undefined,'orientacao-inicial');how.innerHTML='<p><strong>01 Entender</strong> · Veja uma relação explicada.</p><p><strong>02 Observar</strong> · Localize dados e limites.</p><p><strong>03 Construir</strong> · Caminhe, converse e monte sua resposta.</p><p><strong>04 Explicar</strong> · Guarde a evidência e aplique em outro caso.</p>';
$('.controles-intro').before(how);
const rule=make('div',undefined,'regra-inicial');rule.innerHTML='<p><strong>Regra de recuperação</strong>: acertou de primeira, siga. O primeiro erro naquele conjunto acrescenta uma experiência. O segundo amplia para três extras. O limite é quatro atividades por conjunto: de 32 a 128 no principal. Pistas, áudio e apoios opcionais não aumentam a carga.</p><label><input type="checkbox" data-regra-confirmar> Conferi as regras; posso pedir ajuda para entendê-las.</label><p data-regra-status role="status"></p>';
$('[data-comecar]').closest('.inicio-acoes').before(rule);$('[data-regra-confirmar]').checked=S.rulesConfirmed;
const worldIntro=make('button','Entender a aula');worldIntro.type='button';$('.ferramentas').prepend(worldIntro);
const intro=make('section',undefined,'painel painel-entender');intro.hidden=true;intro.setAttribute('role','dialog');intro.setAttribute('aria-modal','true');intro.innerHTML='<article class="tarefa-card"><div class="tarefa-top"><span>ENTENDER · EXPOSIÇÃO E EXEMPLO</span><button data-entender-voltar>Voltar ao cenário</button></div><h2></h2><div data-exposicao></div><h3>Um exemplo de construção</h3><p>Uma representação tem dados, uma relação e um limite. Primeiro veja o modelo; depois aplique o critério às peças. O exemplo explicado é treino e não conta como atividade concluída.</p><div data-modelo-resolvido></div><button data-entender-ouvir>Ouvir a explicação</button></article>';root.append(intro);
intro.querySelector('h2').textContent=C.title;
for(const [title,text]of C.exposition||[]){intro.querySelector('[data-exposicao]').append(make('h3',title),make('p',text));}
const demo=C.cases[0];intro.querySelector('[data-modelo-resolvido]').append(make('p','Dado: '+demo.facts.dado),make('p','Relação: '+demo.facts.relacao),make('p','Limite: '+demo.facts.limite));
worldIntro.onclick=()=>{intro.hidden=false;A.api.setPaused(true);intro.querySelector('[data-entender-voltar]').focus();};
intro.querySelector('[data-entender-voltar]').onclick=()=>{intro.hidden=true;A.api.setPaused(false);$('.gei-arena').focus();};
intro.querySelector('[data-entender-ouvir]').onclick=()=>A.speak((C.exposition||[]).map(x=>x.join('. ')).join('. '));
// Representações do caso ficam junto da ação, sem confundir fundo com fonte.
const representation=make('div',undefined,'relacao-visual');$('[data-tarefa-explica]').after(representation);
root.addEventListener('aula:tarefa',e=>{const t=e.detail.task;representation.replaceChildren();
 if(C.guidedClarity||t.kind==='wordmatch'||t.kind==='letters')return;
 const c=C.cases[t.case];if(!c)return;
 for(const [code,key]of [['D','dado'],['R','relacao'],['E','efeito'],['L','limite']]){const item=make('details');item.className='relacao-'+code;const title=make('summary',code+' · '+({D:'Dado',R:'Relação',E:'Efeito',L:'Limite'})[code]);item.append(title,make('p',c.facts[key]));representation.append(item);}
 if(t.kind==='order'&&C.kind==='history'){const line=make('figure',undefined,'linha-tempo');line.setAttribute('aria-label','Sequência explicada do caso');c.steps.forEach(v=>line.append(make('span',v)));representation.prepend(line);}
 });
const previousStart=$('[data-comecar]').onclick;$('[data-comecar]').onclick=()=>{previousStart();if(C.guidedClarity&&$('[data-inicio]').hidden)A.showTask();if(!C.guidedClarity&&$('[data-inicio]').hidden&&!S.introSeen){S.introSeen=true;A.save();worldIntro.click();}};
const progress=make('p',undefined,'progresso-complementar');progress.setAttribute('role','status');$('.gei-arena').append(progress);
function updateProgress(){const r=A.report(),ex=A.extraProgress();progress.textContent=(S.route==='principal'?'Principal '+r.rotas.principal.concluidos+'/32 · Recuperação '+ex.done+'/'+ex.required+' · Total exigido '+(32+ex.required)+'/128':({exemplos:'Exemplos',apoio:'Apoio à leitura'})[S.route]+' · '+r.rotas[S.route].concluidos+'/'+r.rotas[S.route].total);}
root.addEventListener('aula:evento',updateProgress);root.addEventListener('aula:progresso',updateProgress);updateProgress();
// Preferências são reversíveis; não representam diagnóstico.
const settings=$('#gei-config'),read=make('fieldset');read.innerHTML='<legend>Fontes e layout · Dislexia / TDAH</legend><p>Atalhos opcionais: ajustam apresentação, não diagnosticam nem mudam a atividade.</p><button data-perfil-leitura>Apoio à leitura</button><button data-perfil-foco>Foco e menos estímulos</button><button data-perfil-padrao>Restaurar apresentação</button><label>Entrelinha <input data-entrelinha type="range" min="1.3" max="2" step="0.1" value="1.5"></label><label>Espaço entre letras <input data-letras type="range" min="0" max="0.15" step="0.03" value="0"></label><label>Aparência <select data-aparencia><option value="dia">Dia</option><option value="noite">Noite</option><option value="pb">Preto e branco</option><option value="projetor">Projetor</option></select></label><label><input type="checkbox" data-leitura-simples> Leitura simples · reduzir fundo e ornamento</label><label>Velocidade da voz <select data-voz-velocidade><option value="0.85">Mais lenta</option><option value="1" selected>Padrão</option><option value="1.15">Mais rápida</option></select></label><button data-parar-voz>Parar voz e sons</button>';
settings.insertBefore(read,settings.lastElementChild);
function prefs(){S.layout={line:read.querySelector('[data-entrelinha]').value,letters:read.querySelector('[data-letras]').value,appearance:read.querySelector('[data-aparencia]').value,simple:read.querySelector('[data-leitura-simples]').checked};root.style.setProperty('--line',S.layout.line);root.style.setProperty('--letters',S.layout.letters+'em');root.dataset.aparencia=S.layout.appearance;root.classList.toggle('leitura-simples',S.layout.simple);A.save();}
for(const el of read.querySelectorAll('input,select'))el.addEventListener('change',prefs);
read.querySelector('[data-perfil-leitura]').onclick=()=>{$('[data-aula-tamanho]').value='21';$('[data-aula-tamanho]').dispatchEvent(new Event('change'));read.querySelector('[data-entrelinha]').value='1.8';read.querySelector('[data-letras]').value='0.06';read.querySelector('[data-leitura-simples]').checked=true;prefs();};
read.querySelector('[data-perfil-foco]').onclick=()=>{read.querySelector('[data-leitura-simples]').checked=true;$('[data-baixa-estimulacao]').checked=true;$('[data-baixa-estimulacao]').dispatchEvent(new Event('change'));prefs();};
read.querySelector('[data-perfil-padrao]').onclick=()=>{$('[data-aula-tamanho]').value='16';$('[data-aula-tamanho]').dispatchEvent(new Event('change'));read.querySelector('[data-entrelinha]').value='1.5';read.querySelector('[data-letras]').value='0';read.querySelector('[data-aparencia]').value='dia';read.querySelector('[data-leitura-simples]').checked=false;prefs();};
if(S.layout){read.querySelector('[data-entrelinha]').value=S.layout.line;read.querySelector('[data-letras]').value=S.layout.letters;read.querySelector('[data-aparencia]').value=S.layout.appearance;read.querySelector('[data-leitura-simples]').checked=S.layout.simple;prefs();}
read.querySelector('[data-parar-voz]').onclick=()=>window.speechSynthesis?.cancel();
// Glossário sempre disponível; explicação conceitual e vocabulário dos comandos separados.
const vocab=make('details');vocab.innerHTML='<summary>Glossário e palavras dos comandos</summary>';const dl=make('dl');C.words.forEach(w=>dl.append(make('dt',w.word),make('dd',w.meaning)));vocab.append(dl,make('p','Comparar: observar semelhanças e diferenças. Sustentar: indicar a informação que justifica uma conclusão. Delimitar: dizer até onde a afirmação vale.'));
intro.querySelector('[data-exposicao]').append(vocab);
// Relatórios completos e opção de e-mail sem truncamento.
const reportActions=$('[data-baixar-json]').parentElement,email=make('button','Enviar relatório ao professor');reportActions.append(email);
email.onclick=async()=>{const text=A.reportText(),r=A.report();if(r.estado!=='concluido'){A.openReport();$('[data-relatorio-status]').textContent='O relatório parcial pode ser salvo. A entrega final requer originais, recuperações e avaliação confirmada.';return;}const subject='Relatório · '+C.title,base='mailto:andre-orodrigues@educar.rs.gov.br?subject='+encodeURIComponent(subject),full=base+'&body='+encodeURIComponent(text);if(full.length<=1800){location.href=full;$('[data-relatorio-status]').textContent='Aplicativo de e-mail aberto; confira e envie. Isso não comprova recebimento.';}else{try{await navigator.clipboard.writeText(text);$('[data-relatorio-status]').textContent='Relatório integral copiado. Cole no aplicativo de e-mail ou anexe o TXT; confira e envie.';}catch{$('[data-relatorio-status]').textContent='Copie a prévia integral ou anexe o TXT. O relatório é grande e não será truncado no endereço de e-mail.';}location.href=base;}};
// Devolve todos os controles de foco ao diálogo ativo, inclusive no teclado.
root.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const modal=[...root.querySelectorAll('.painel')].reverse().find(x=>!x.hidden);if(!modal)return;const els=[...modal.querySelectorAll('button,input,select,textarea,summary,a[href]')].filter(x=>!x.disabled&&!x.hidden&&!x.closest('[hidden]'));if(!els.length)return;const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
// Resumo administrativo não revela turma ou data de aplicação.
const record=make('details',undefined,'registro-publico');record.innerHTML='<summary>Registro para Escola RS</summary>';const recordText=C.title+'\n'+C.grade+' · '+C.subject+'\n'+C.objective+'\nHabilidades: '+C.skills;record.append(make('p',recordText));const copy=make('button','Copiar registro');copy.onclick=async()=>{try{await navigator.clipboard.writeText(recordText);copy.textContent='Registro copiado';}catch{copy.textContent='Selecione o texto acima para copiar';}};record.append(copy);$('.inicio-card').append(record);
// Revisão didática compartilhada: uma ação por vez, modelo visível e avanço direto.
if(C.guidedClarity){
 root.classList.add('aula-guiada');
 how.innerHTML='<p><strong>Observe</strong> a situação e o exemplo.</p><p><strong>Responda</strong> uma atividade por vez. Pode ouvir ou pedir ajuda.</p><p><strong>Explique</strong> sua escolha ao professor.</p>';
 rule.hidden=true;$('.controles-intro').hidden=true;
 $('[data-comecar]').textContent='Começar a atividade';
 $('[data-ouvir-inicio]').onclick=()=>A.speak(C.title+'. '+C.objective+'. Veja o exemplo, escolha sua resposta e confira. Pode pedir ajuda sem ganhar tarefas extras.');
 $('[data-tarefa-voltar]').textContent='Pausar / ver cenário';
 $('[data-tarefa-conferir]').textContent='Conferir minha resposta';
 $('[data-tarefa-seguir]').textContent='Continuar';
 const direct=make('button','Continuar minha atividade');direct.onclick=()=>{A.closeModal();A.showTask();};$('.ferramentas').prepend(direct);
 const guide=make('section',undefined,'guia-claro');$('[data-tarefa-explica]').after(guide);
 const operation={order:['Coloque os acontecimentos na ordem.','O que acontece antes? Depois escolha o que vem em seguida.'],match:['Ligue uma ideia à frase que a explica.','Leia uma ideia de cada vez. Escolha a frase que fala dela.'],sort:['Leia uma frase e escolha um dos dois grupos.','Pergunte: esta frase combina com as informações do caso?'],number:['Encontre o número pedido.','Use os valores mostrados. Faça uma conta de cada vez.'],bars:['Faça cada barra chegar ao número indicado.','Cada barra mostra quantas respostas aquela categoria recebeu.'],tally:['Conte as respostas de cada categoria.','Separe os cartões pelo nome. Conte um grupo de cada vez.'],lab:['Mude uma coisa e mantenha as outras iguais.','Para descobrir o efeito de uma mudança, não mude tudo ao mesmo tempo.']};
 function model(t){const d=t.data;if(t.kind==='order')return d.parts.join(' → ');if(t.kind==='match')return d.pairs.map(p=>p.join(' → ')).join('\n');if(t.kind==='sort')return d.labels[0]+': '+d.yes[0]+'\n'+d.labels[1]+': '+d.no[0];if(t.kind==='number')return 'Resultado para conferir depois da tentativa: '+d.answer+' '+(d.unit||'');if(t.kind==='bars'||t.kind==='tally')return d.labels.map((l,i)=>l+': '+d.values[i]).join(' · ');if(t.kind==='lab')return 'Exemplo: para testar agitação, use a mesma água, a mesma quantidade de sal e a mesma temperatura nos dois copos. Mexa somente um deles. Outros ensaios podem estudar outra mudança.';return t.explain;}
 root.addEventListener('aula:tarefa',e=>{const t=e.detail.task,o=operation[t.kind]||['Observe a figura e escolha.','Você pode ouvir e comparar.'];guide.replaceChildren();
  const label=make('p','Uma atividade de cada vez · '+((S.routes[S.route].index%4)+1)+' de 4 neste bloco.');guide.append(label,make('h3','O que fazer'),make('p',o[0]));
  const alternate=make('details');alternate.append(make('summary','Diga de outro jeito'),make('p',o[1]));guide.append(alternate);
  const example=make('details');example.append(make('summary','Ver exemplo explicado / conferir o modelo'),make('p',model(t)),make('p',t.relation));guide.append(example);
  const hear=make('button','Ouvir a orientação');hear.onclick=()=>A.speak(o.join('. ')+'. '+t.explain+'. '+t.command);guide.append(hear);
  $('[data-tarefa-capitulo]').textContent=t.context+' · Bloco '+(t.case+1);
  $('[data-tarefa-feedback]').textContent='Pode consultar o exemplo. Errar não acrescenta atividades. Se não entender, peça outra explicação.';
 });
 function clearProgress(){progress.textContent='Bloco atual: '+(Math.min(4,S.routes[S.route].index%4+1))+' de 4 atividades · Os outros blocos podem ficar para outro encontro.';}
 root.addEventListener('aula:evento',clearProgress);root.addEventListener('aula:progresso',clearProgress);clearProgress();
 // O conteúdo do apoio relacional continua sendo aberto pelo adaptador específico.
 const oldMap=A.openMap;
 const mapObserver=new MutationObserver(()=>{const m=$('.painel-mapa');if(!m||m.hidden)return;const p=m.querySelector('p');if(p)p.textContent='Conclua um bloco por vez, no ritmo combinado com o professor. Para retomar, use Continuar minha atividade.';});
 mapObserver.observe($('.painel-mapa'),{attributes:true,attributeFilter:['hidden']});
}

})();
