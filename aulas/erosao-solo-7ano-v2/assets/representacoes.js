/* Representações didáticas originais, reutilizadas no jogo e no impresso. */
(()=>{'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function svg(word,meaning,theme='study'){
const w=String(word).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
const stroke='#274758',fill='#79b8b0',gold='#e5b16d';let body='';
const person=(x,y,color=fill)=>`<circle cx="${x}" cy="${y}" r="12" fill="${color}"/><path d="M${x-20} ${y+52}v-18q0-22 20-22t20 22v18" fill="${color}"/>`;
if(/COPO|AGUA|SAL|VOLUME|SOLUCAO|CRISTAL|AGITACAO|MEDIDA|UNIDADE/.test(w)){
 body=`<path d="M135 22h115l-13 126h-89Z" fill="#edf7fa" stroke="${stroke}" stroke-width="4"/><path d="M144 76h97l-7 66h-83Z" fill="${fill}"/><path d="M246 54h18m-20 26h14m-18 26h14" stroke="${stroke}" stroke-width="3"/>`;
 if(/SAL|CRISTAL|SOLUCAO/.test(w))body+=`<g fill="#fff8da" stroke="${stroke}"><path d="m168 116 8-6 8 6-8 8Z"/><path d="m196 125 8-6 8 6-8 8Z"/><path d="m211 102 7-6 7 6-7 7Z"/></g>`;
 if(w==='AGITACAO')body+=`<path d="M195 12v92m-24-9q24 20 48 0" fill="none" stroke="${stroke}" stroke-width="5"/>`;
 if(w==='MEDIDA'||w==='UNIDADE')body+=`<text x="275" y="89" font-size="22">mL</text>`;
}else if(/TEMPO|DATA|PAUSA/.test(w)){
 body=`<circle cx="200" cy="83" r="61" fill="#edf7fa" stroke="${stroke}" stroke-width="4"/><path d="M200 39v44l33 23" fill="none" stroke="${stroke}" stroke-width="6"/><path d="M200 25v10m58 48h-10m-48 58v-10m-58-48h10" stroke="${stroke}" stroke-width="3"/>`;
 if(w==='PAUSA')body+=`<path d="M285 60v52m22-52v52" stroke="${gold}" stroke-width="12"/>`;
}else if(/DADO|TOTAL|TABELA|BARRA|EIXO|ESCALA|MAIOR|MENOR|MEDIA|CONTAGEM|PESQUISA|CENSO|AMOSTRA/.test(w)){
 if(w==='CENSO'||w==='AMOSTRA'||w==='CONTAGEM'){
  for(let r=0;r<2;r++)for(let c=0;c<5;c++)body+=`<circle cx="${100+c*46}" cy="${55+r*60}" r="17" fill="${w==='AMOSTRA'&&c>1?'#e9edf0':fill}" stroke="${stroke}" stroke-width="2"/>`;
  body+=`<rect x="74" y="27" width="240" height="115" rx="14" fill="none" stroke="${stroke}" stroke-width="3"/>`;
 }else{
  body=`<path d="M95 21v125h230" fill="none" stroke="${stroke}" stroke-width="4"/>`;
  [48,95,70].forEach((h,i)=>body+=`<rect x="${126+i*65}" y="${145-h}" width="38" height="${h}" rx="3" fill="${i===1?gold:fill}"/><text x="${145+i*65}" y="${135-h}" text-anchor="middle" font-size="15">${[4,8,6][i]}</text>`);
  if(w==='MEDIA')body+=`<path d="M102 75h218" stroke="#9d5d5b" stroke-width="3" stroke-dasharray="5 4"/>`;
 }
}else if(/MAPA|PAIS|AFRICA|ASIA|COLONIA/.test(w)){
 body=`<path d="m84 34 71-15 79 15 80-15v119l-80 15-79-15-71 15Z" fill="#edf7fa" stroke="${stroke}" stroke-width="3"/><path d="M155 19v119m79-104v119" stroke="${stroke}" stroke-width="2"/><path d="m103 70 24-20 35 25 30-22 39 21 33-31 29 39-12 35-40 3-29-21-31 24-35-10Z" fill="${fill}"/>`;
 if(w==='COLONIA')body+=`<path d="M84 165h225m-18-10 18 10-18 10" fill="none" stroke="${stroke}" stroke-width="3"/>`;
}else if(/META|PLANO|PASSO|PROJETO|TESTE|CONTROLE|REPETICAO|REVISAO|ERRO|HIPOTESE|PERGUNTA|EXEMPLO|CASO/.test(w)){
 body=`<path d="M80 83h235" stroke="${stroke}" stroke-width="4"/>`;
 [100,200,300].forEach((x,i)=>body+=`<rect x="${x-31}" y="51" width="62" height="64" rx="12" fill="${i===1?gold:fill}"/><text x="${x}" y="92" font-size="25" text-anchor="middle">${i+1}</text>`);
 if(/REVISAO|REPETICAO/.test(w))body+=`<path d="M300 127q-100 51-200 0m0 0 3 17m-3-17 18 3" fill="none" stroke="${stroke}" stroke-width="4"/>`;
 if(/ERRO|HIPOTESE|PERGUNTA/.test(w))body+=`<text x="340" y="95" fill="#8f4949" font-size="38">?</text>`;
}else if(/FONTE|TEXTO|LIVRO|REGISTRO|TITULO|EVIDENCIA|PISTA|IDEIA/.test(w)){
 body=`<path d="M95 32q55-26 105 0 55-26 105 0v113q-55-22-105 0-55-22-105 0Z" fill="#f6e7cb" stroke="${stroke}" stroke-width="4"/><path d="M200 32v113m-88-85h65m-65 20h65m45-20h65m-65 20h65m-65 20h50" stroke="${stroke}" stroke-width="3"/>`;
 if(/EVIDENCIA|PISTA|FONTE/.test(w))body+=`<circle cx="265" cy="106" r="29" fill="none" stroke="${gold}" stroke-width="7"/><path d="m286 128 29 27" stroke="${gold}" stroke-width="8"/>`;
}else if(/FALA|DIALOGO|ESCUTA|ACORDO|CONVIVENCIA|DIFERENCA|CRENCA|RELIGIAO|CONVICCAO|POVO|SUJEITO|GRUPO|DIGNIDADE|RESPEITO|LIBERDADE|DIREITO|ESCOLHA|PAZ|AJUDA|CUIDADO|VIDA|LUTA|PODER|GUERRA/.test(w)){
 body=person(115,73,fill)+person(285,73,gold)+`<path d="M156 30h90q15 0 15 15v30q0 15-15 15h-38l-24 19V90h-28q-15 0-15-15V45q0-15 15-15Z" fill="#edf7fa" stroke="${stroke}" stroke-width="3"/><path d="M161 49h79m-79 21h55" stroke="${stroke}" stroke-width="3"/>`;
 if(w==='GUERRA')body+=`<path d="m191 108 14 12-13 13 14 13" stroke="#a54d4d" stroke-width="5" fill="none"/>`;
 if(/DIREITO|DIGNIDADE|LIBERDADE/.test(w))body+=`<path d="m183 110 18-8 18 8v19q-7 15-18 19-12-4-18-19Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
}else{
 body=`<path d="M90 83h220" stroke="${stroke}" stroke-width="4"/><rect x="90" y="38" width="90" height="90" rx="15" fill="${fill}"/><path d="M220 38v90" stroke="${gold}" stroke-width="8" stroke-dasharray="8 6"/><path d="m280 63 27 20-27 20" fill="none" stroke="${stroke}" stroke-width="5"/>`;
}
return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 185" role="img" aria-label="${esc(meaning)}"><rect width="400" height="185" rx="18" fill="#f2f6f2"/>${body}</svg>`;
}
window.Representacoes={svg};
})();

