// Síntese local de passos, sem downloads ou coleta de dados.
export function createFootstepAudio(stage){
 const AC=window.AudioContext||window.webkitAudioContext;let ctx,enabled=false,distance=0,foot=0;
 const button=document.createElement('button');button.type='button';button.textContent='🔇 Passos';button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','Ativar som dos passos');
 stage.querySelector('.scene-tools')?.appendChild(button);
 button.onclick=async()=>{if(!AC){button.disabled=true;button.textContent='Áudio indisponível';return}try{ctx??=new AC();await ctx.resume()}catch{return}enabled=!enabled;button.setAttribute('aria-pressed',String(enabled));button.textContent=enabled?'🔊 Passos':'🔇 Passos';button.setAttribute('aria-label',enabled?'Desativar som dos passos':'Ativar som dos passos')};
 return {step(meters,surface='wood'){
  if(!enabled||!ctx||ctx.state!=='running'||document.hidden)return;
  distance+=Math.max(0,meters);if(distance<.65)return;distance%=.65;foot++;
  const duration=surface==='carpet'?.09:surface==='wood'?.12:.16,n=Math.ceil(ctx.sampleRate*duration);
  const buffer=ctx.createBuffer(1,n,ctx.sampleRate),data=buffer.getChannelData(0);let low=0;
  const cutoff=surface==='carpet'?.08:surface==='wood'?.22:.32;
  for(let i=0;i<n;i++){low+=((Math.random()*2-1)-low)*cutoff;data[i]=low*Math.pow(1-i/n,3)*.32}
  const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;gain.gain.value=.4;source.connect(gain);
  if(ctx.createStereoPanner){const pan=ctx.createStereoPanner();pan.pan.value=foot%2?.18:-.18;gain.connect(pan);pan.connect(ctx.destination)}else gain.connect(ctx.destination);
  source.start();
 }};
}
