// Passos abafados de carpete/veludo. Síntese local, sem áudio externo.
export function createFootstepAudio(stage){
 const AC=window.AudioContext||window.webkitAudioContext;
 const stride=.75,minInterval=.48;
 let ctx,enabled=false,distance=0,foot=0,lastStep=-Infinity,lastMovement=-Infinity;
 const active=new Set();
 const button=document.createElement('button');button.type='button';
 const reset=()=>{distance=0;lastStep=lastMovement=-Infinity;for(const source of active){try{source.stop()}catch{}}active.clear()};
 const label=()=>{button.setAttribute('aria-pressed',String(enabled));button.textContent=enabled?'🔊 Passos':'🔇 Passos';button.setAttribute('aria-label',enabled?'Desativar som dos passos':'Ativar som dos passos')};
 label();stage.querySelector('.scene-tools')?.appendChild(button);
 button.onclick=async()=>{
  if(enabled){enabled=false;reset();label();return}
  if(!AC){button.disabled=true;button.textContent='Áudio indisponível';return}
  try{ctx??=new AC();await ctx.resume()}catch{return}
  enabled=true;reset();label();
 };
 return {step(meters){
  if(!enabled||!ctx||ctx.state!=='running'||document.hidden)return;
  if(!Number.isFinite(meters)||meters<=0)return;
  const now=ctx.currentTime;
  if(now-lastMovement>.25)distance=0;
  lastMovement=now;
  // Nunca acumular uma fila de impactos: no máximo um passo a cada 480 ms.
  distance=Math.min(stride,distance+meters);
  if(distance<stride||now-lastStep<minInterval)return;
  distance=0;lastStep=now;foot++;
  const duration=.22,n=Math.ceil(ctx.sampleRate*duration);
  const buffer=ctx.createBuffer(1,n,ctx.sampleRate),data=buffer.getChannelData(0);
  let low=0;
  for(let i=0;i<n;i++){
   const t=i/ctx.sampleRate;
   low+=((Math.random()*2-1)-low)*.025;
   // Início e fim em zero; sem o estalo da antiga envoltória instantânea.
   const envelope=Math.sin(Math.PI*i/(n-1))**2;
   data[i]=(low*.11+Math.sin(2*Math.PI*(foot%2?62:67)*t)*.022*Math.exp(-18*t))*envelope;
  }
  const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;gain.gain.value=.3;source.connect(gain);
  let pan;
  if(ctx.createStereoPanner){pan=ctx.createStereoPanner();pan.pan.value=foot%2?.1:-.1;gain.connect(pan);pan.connect(ctx.destination)}else gain.connect(ctx.destination);
  source.onended=()=>{active.delete(source);source.disconnect();gain.disconnect();pan?.disconnect()};
  active.add(source);source.start();
 }};
}
