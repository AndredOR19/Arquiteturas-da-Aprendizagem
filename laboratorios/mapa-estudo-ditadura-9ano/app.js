(()=>{'use strict';const $=id=>document.getElementById(id),key='mapa-ditadura-9ano-consulta-v1',fields=['words','relations','example','attention'];let scale=1,saved={};
try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{$('storage-warning').hidden=false}
for(const field of fields){$(field).value=typeof saved[field]==='string'?saved[field]:'';$(field).addEventListener('input',()=>{const data=Object.fromEntries(fields.map(id=>[id,$(id).value]));try{localStorage.setItem(key,JSON.stringify(data))}catch{$('storage-warning').hidden=false}})}
$('font-up').onclick=()=>{scale=Math.min(1.4,scale+.1);document.documentElement.style.setProperty('--scale',scale)};
$('font-down').onclick=()=>{scale=Math.max(.9,scale-.1);document.documentElement.style.setProperty('--scale',scale)};
$('theme').onclick=()=>{const dark=document.body.classList.toggle('dark');$('theme').setAttribute('aria-pressed',String(dark));$('theme').textContent=dark?'Modo claro':'Modo escuro'};
$('print').onclick=()=>window.print();
$('download').onclick=()=>{const labels=['PALAVRAS-CHAVE','SETAS E RELAÇÕES','EXEMPLO DA AULA OU MUSEU','MINHA ATENÇÃO NA PROVA'];const text='MINHA CONSULTA DE HISTÓRIA\nDitadura e redemocratização · 9º ano\n\n'+fields.map((id,i)=>labels[i]+'\n'+$(id).value).join('\n\n')+'\n\nConfira com o professor o tamanho e o formato permitido.\n';const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Minha_consulta_Historia_9ano.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('status').textContent='Arquivo preparado para baixar.'};
$('clear').onclick=()=>{if(!window.confirm('Apagar somente o rascunho deste mapa neste aparelho?'))return;for(const id of fields)$(id).value='';try{localStorage.removeItem(key)}catch{}$('status').textContent='Rascunho apagado deste aparelho.'};
})();
