/* GEI 2.1.1 — núcleo de entrada, apresentação e ciclo de jogo. Sem dependências. */
(function(global){
'use strict';
const directions={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
function criar(root, hooks={}){
  const $=s=>root.querySelector(s), arena=$('.gei-arena'), canvas=$('[data-gei-canvas]'), ctx=canvas.getContext('2d');
  if(!ctx) throw new Error('Canvas 2D indisponível');
  const keyHeld=new Map(), taps=new Map(), pointers=new Map(), handlers=[];
  const on=(target,event,fn,opts)=>{target.addEventListener(event,fn,opts);handlers.push(()=>target.removeEventListener(event,fn,opts))};
  const settings=$('#gei-config'), pauseButton=$('[data-gei-pausa]'), reduced=$('[data-gei-reduzir]');
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  reduced.checked=media.matches;
  let paused=false, menu=false, last=0, raf=0, hidden=document.hidden, narration='', quality=1, elapsed=0, frames=0, destroyed=false;
  const logical={width:960,height:540};
  function clear(){keyHeld.clear();taps.clear();pointers.clear()}
  function direction(){
    const active=new Set([...keyHeld.values(),...taps.values(),...pointers.values()]);
    let x=Number(active.has('right'))-Number(active.has('left')),y=Number(active.has('down'))-Number(active.has('up'));
    const length=Math.hypot(x,y); if(length){x/=length;y/=length} return {x,y};
  }
  function gameFocus(){const a=document.activeElement;return a===arena || a===canvas}
  function speak(text){
    if(text) narration=text;
    if(!narration) return;
    if('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window){
      window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(narration);u.lang='pt-BR';u.rate=Number(root.querySelector('[data-voz-velocidade]')?.value||1);window.speechSynthesis.speak(u);
    } else { $('[data-gei-voz-status]').hidden=false;hooks.onNarrationUnavailable?.() }
  }
  function mission(text){$('[data-gei-missao]').textContent=text;narration=text}
  function setPaused(value){paused=value;clear();last=0;pauseButton.textContent=paused?'Continuar':'Pausar';$('[data-gei-pausado]').hidden=!paused;hooks.onPause?.(paused);wake()}
  function interact(){if(!paused&&!menu) hooks.interact?.(api)}
  function resize(){
    const r=arena.getBoundingClientRect(), scale=Math.max(0,(hooks.immersive?Math.max:Math.min)(r.width/logical.width,r.height/logical.height));
    const w=logical.width*scale,h=logical.height*scale;
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    const dpr=Math.min(window.devicePixelRatio||1,quality===1?2:1);
    const pixelWidth=Math.max(1,Math.round(w*dpr)),pixelHeight=Math.max(1,Math.round(h*dpr));
    if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight}
  }
  const ro=new ResizeObserver(resize);ro.observe(arena);on(window,'resize',resize);
  function wake(){if(!destroyed&&!hidden&&!paused&&!menu&&!raf)raf=requestAnimationFrame(frame)}
  function frame(now){
    raf=0;if(destroyed)return;
    if(!hidden&&!paused&&!menu){
      const raw=last?(now-last)/1000:0;const dt=Math.min(raw,.05);last=now;
      if(raw>0&&raw<1){elapsed+=raw;frames++;if(elapsed>=5){const fps=frames/elapsed;const next=fps<35?.5:fps>50?1:quality;if(next!==quality){quality=next;resize()}elapsed=0;frames=0}}
      hooks.update?.(taps.size?Math.max(.012,dt):dt,direction(),api);taps.clear();
      ctx.setTransform(canvas.width/logical.width,0,0,canvas.height/logical.height,0,0);
      ctx.clearRect(0,0,logical.width,logical.height);
      hooks.render?.(ctx,logical,api);
    }else last=0;
    wake();
  }
  on(document,'keydown',e=>{
    if(e.key==='Escape'&&!menu&&root.contains(document.activeElement)&&!document.activeElement.matches('input,select,textarea')){e.preventDefault();setPaused(!paused);return}
    if(!gameFocus())return;
    const k=e.key.length===1?e.key.toLowerCase():e.key;
    if(directions[k]){e.preventDefault();if(!paused&&!menu){keyHeld.set(e.code,directions[k]);taps.set(e.code,directions[k])}return}
    if(k==='Escape'){e.preventDefault();if(menu){closeSettings()}else setPaused(!paused);return}
    if(k==='Enter'||k===' '||k==='e'){e.preventDefault();if(!e.repeat)interact();return}
    if(k===$('[data-gei-tecla]').value){e.preventDefault();if(!e.repeat)speak()}
  });
  on(document,'keyup',e=>keyHeld.delete(e.code));
  on(window,'blur',clear);on(arena,'focusout',e=>{if(!arena.contains(e.relatedTarget))clear()});
  on(document,'visibilitychange',()=>{hidden=document.hidden;clear();last=0;wake()});
  on(canvas,'pointerdown',()=>arena.focus({preventScroll:true}));
  root.querySelectorAll('[data-gei-move]').forEach(button=>{
    function stop(e){pointers.delete(e.pointerId)}
    on(button,'pointerdown',e=>{if(paused||menu)return;e.preventDefault();button.setPointerCapture(e.pointerId);pointers.set(e.pointerId,button.dataset.geiMove);taps.set('pointer:'+e.pointerId,button.dataset.geiMove)});
    on(button,'pointerup',stop);on(button,'pointercancel',stop);on(button,'lostpointercapture',stop);
    on(button,'keydown',e=>{if((e.key===' '||e.key==='Enter')&&!paused&&!menu){e.preventDefault();keyHeld.set('button:'+e.code,button.dataset.geiMove);taps.set('button:'+e.code,button.dataset.geiMove)}});
    on(button,'keyup',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();keyHeld.delete('button:'+e.code)}});
    on(button,'blur',clear);
  });
  const action=$('[data-gei-interagir]');
  on(action,'pointerdown',e=>{if(e.button!==0)return;e.preventDefault();interact()});
  on(action,'click',e=>{if(e.detail===0&&!e.pointerType)interact()});
  on($('[data-gei-narrar]'),'click',()=>speak());
  on(pauseButton,'click',()=>setPaused(!paused));
  const fullscreen=$('[data-gei-tela]');
  if(!root.requestFullscreen)fullscreen.hidden=true;
  on(fullscreen,'click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await root.requestFullscreen()}catch(_){fullscreen.textContent='Tela cheia indisponível'}});
  on(document,'fullscreenchange',()=>{fullscreen.textContent=document.fullscreenElement?'Sair da tela cheia':'Tela cheia';resize()});
  const adjust=$('[data-gei-ajustes]');
  function closeSettings(){settings.hidden=true;menu=false;adjust.setAttribute('aria-expanded','false');last=0;adjust.focus();wake()}
  on(adjust,'click',()=>{if(menu){closeSettings();return}clear();menu=true;settings.hidden=false;adjust.setAttribute('aria-expanded','true');$('[data-gei-tamanho]').focus()});
  on($('[data-gei-fechar]'),'click',closeSettings);
  on(settings,'keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeSettings()}});
  const size=$('[data-gei-tamanho]'), opacity=$('[data-gei-opacidade]'), side=$('[data-gei-lado]');
  function controls(){root.style.setProperty('--gei-size',size.value+'px');root.style.setProperty('--gei-opacity',opacity.value/100);$('[data-gei-tamanho-valor]').value=size.value+' px';$('[data-gei-opacidade-valor]').value=opacity.value+'%';root.classList.toggle('invertido',side.value==='invertido')}
  [size,opacity,side].forEach(input=>on(input,'input',controls));controls();
  const api={mission,speak,interact,setPaused,
    camera(ctx,{x,y,zoom=1,width=960,height=540}){
      zoom=Math.max(1,zoom);const visibleWidth=logical.width/zoom,visibleHeight=logical.height/zoom;
      const rect=arena.getBoundingClientRect(),surface=canvas.getBoundingClientRect();
      const clipW=hooks.immersive?Math.min(logical.width,logical.width*rect.width/Math.max(1,surface.width)):logical.width,clipH=hooks.immersive?Math.min(logical.height,logical.height*rect.height/Math.max(1,surface.height)):logical.height;
      const minLeft=-(logical.width-clipW)/(2*zoom),maxLeft=width-(logical.width+clipW)/(2*zoom),minTop=-(logical.height-clipH)/(2*zoom),maxTop=height-(logical.height+clipH)/(2*zoom);
      const left=Math.max(minLeft,Math.min(Math.max(minLeft,maxLeft),x-visibleWidth/2));
      const top=Math.max(minTop,Math.min(Math.max(minTop,maxTop),y-visibleHeight/2));
      ctx.scale(zoom,zoom);ctx.translate(-left,-top);return {left,top,width:visibleWidth,height:visibleHeight};
    },
    get paused(){return paused},get reducedMotion(){return reduced.checked||media.matches},get quality(){return quality},logical,
    // Carregamento sob demanda: o projeto decide quando solicitar cada recurso.
    loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Falha ao carregar imagem: '+src));img.src=src})},
    destroy(){destroyed=true;cancelAnimationFrame(raf);ro.disconnect();clear();handlers.forEach(off=>off());window.speechSynthesis?.cancel()}
  };
  resize();wake();return api;
}
global.GEI={criar};
})(window);

