import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';

for(const slug of ['museu-ditadura-redemocratizacao','museu-territorios-vivos']){
 const dir=new URL('../laboratorios/'+slug+'/assets/',import.meta.url);
 const code=readFileSync(new URL('footstep-audio.js',dir),'utf8');
 const {createFootstepAudio}=await import('data:text/javascript;base64,'+Buffer.from(code+'\n//'+slug).toString('base64'));
 for(const mode of ['stereo','mono','unavailable','resume-error']){
  let context,button;const starts=[],buffers=[],pans=[],sources=[];
  globalThis.document={hidden:false,createElement:()=>({setAttribute(k,v){this[k]=v}})};
  class AudioContext {
   constructor(){context=this;this.sampleRate=48000;this.currentTime=0;this.state='suspended';this.destination={};if(mode==='mono')this.createStereoPanner=undefined}
   async resume(){if(mode==='resume-error')throw Error('unavailable');this.state='running'}
   createBuffer(c,n){const data=new Float32Array(n);buffers.push(data);return {getChannelData:()=>data}}
   createBufferSource(){const s={connect(){},disconnect(){},start(){starts.push(context.currentTime)},stop(){this.stopped=true;this.onended?.()}};sources.push(s);return s}
   createGain(){return {gain:{},connect(){},disconnect(){}}}
   createStereoPanner(){const pan={};pans.push(pan);return {pan,connect(){},disconnect(){}}}
  }
  globalThis.window=mode==='unavailable'?{}:{AudioContext};
  const audio=createFootstepAudio({querySelector:()=>({appendChild:b=>button=b})});
  audio.step(10);assert.equal(starts.length,0);assert.equal(button['aria-pressed'],'false');
  await button.onclick();
  if(mode==='unavailable'){assert.equal(button.disabled,true);continue}
  if(mode==='resume-error'){assert.equal(button['aria-pressed'],'false');continue}
  assert.equal(button['aria-label'],'Desativar som dos passos');
  for(let frame=0;frame<300;frame++){context.currentTime=frame/60;audio.step(1.4/60)}
  assert.ok(starts.length>=8&&starts.length<=10,'cadência normal de caminhada');
  for(let i=1;i<starts.length;i++)assert.ok(starts[i]-starts[i-1]>=.48-1e-9,'limite temporal');
  const count=starts.length;
  // Um segundo de movimento duplicado e distâncias enormes não cria rajadas.
  for(let frame=300;frame<360;frame++){context.currentTime=frame/60;audio.step(100);audio.step(100)}
  assert.ok(starts.length-count<=3);
  for(let i=1;i<starts.length;i++)assert.ok(starts[i]-starts[i-1]>=.48-1e-9);
  for(const data of buffers){
   assert.equal(Math.abs(data[0]),0);assert.ok(Math.abs(data.at(-1))<1e-12);
   assert.ok(data.length/48000>=.219&&data.length/48000<=.221);
   let peak=0,maxJump=0;
   for(let i=0;i<data.length;i++){peak=Math.max(peak,Math.abs(data[i]));if(i)maxJump=Math.max(maxJump,Math.abs(data[i]-data[i-1]))}
   assert.ok(peak*.3<.04,'volume baixo');assert.ok(maxJump*.3<.003,'sem estalo abrupto');
  }
  if(mode==='stereo')for(let i=0;i<pans.length;i++)assert.equal(pans[i].value,i%2?-.1:.1);
  const before=starts.length;
  context.currentTime=10;audio.step(0);audio.step(NaN);audio.step(Infinity);audio.step(-1);assert.equal(starts.length,before);
  document.hidden=true;audio.step(10);assert.equal(starts.length,before);document.hidden=false;
  await button.onclick();audio.step(10);assert.equal(starts.length,before);assert.ok(sources.every(s=>s.stopped));
  assert.equal(button['aria-label'],'Ativar som dos passos');
  await button.onclick();context.currentTime=11;audio.step(.74);assert.equal(starts.length,before);
  // Pausa longa limpa a distância residual, sem passo imediato ao retornar.
  context.currentTime=13;audio.step(.02);assert.equal(starts.length,before);
 }
 const scene=readFileSync(new URL('museum.js',dir),'utf8');
 assert.match(scene,/const speed=reduced\?1:1\.4/);
 assert.match(scene,/Math.hypot\(walkPos.x-beforeX,walkPos.z-beforeZ\)/);
 assert.ok(!scene.includes(",'wood')"));
 console.log(slug+': cadência, limite anti-rajada, envelope, volume, L/R, parada e fallbacks OK');
}
