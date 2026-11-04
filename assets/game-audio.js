/* Small synthesized SFX; no downloads and no audio until a user gesture. */
(()=>{
 'use strict';
 const AudioEngine=window.AudioContext||window.webkitAudioContext;
 let enabled=true,context,master,lastAt=-Infinity,lastPriority=-1;
 const voices=new Set();
 try{enabled=localStorage.getItem('revival-sound')!=='off';}catch{}
 const cues={
  tap:{notes:[420],duration:.045,level:.07,type:'sine',priority:0},
  good:{notes:[660,880],duration:.11,level:.10,type:'sine',priority:1},
  excellent:{notes:[784,1047,1319],duration:.15,level:.10,type:'triangle',priority:2},
  bonus:{notes:[880,1175,1568,1760],duration:.15,level:.09,type:'triangle',priority:3},
  break:{notes:[260,520,1040],duration:.09,level:.10,type:'triangle',priority:3},
  miss:{notes:[220,165],duration:.12,level:.08,type:'sine',priority:1},
  catch:{notes:[523,659,784,1047],duration:.22,level:.11,type:'triangle',priority:4}
 };
 function unlock(){
  if(!enabled||!AudioEngine||document.hidden)return;
  try{
   if(!context){context=new AudioEngine();master=context.createGain();master.gain.value=.55;master.connect(context.destination);}
   if(context.state==='suspended')context.resume().catch(()=>{});
  }catch{}
 }
 function stop(){
  for(const voice of voices){try{voice.stop();}catch{}}
  voices.clear();lastAt=-Infinity;lastPriority=-1;
 }
 function play(kind='tap'){
  if(!enabled||!AudioEngine||document.hidden)return;
  unlock();
  if(!context||context.state!=='running')return;
  const cue=cues[kind]||cues.tap;
  const now=context.currentTime;
  if((now-lastAt<.06&&cue.priority<=lastPriority)||(now-lastAt<.18&&cue.priority<lastPriority))return;
  lastAt=now;lastPriority=cue.priority;
  cue.notes.forEach((frequency,index)=>{
   if(voices.size>=20)return;
   const oscillator=context.createOscillator(),gain=context.createGain();
   const start=now+index*.055,end=start+cue.duration;
   oscillator.type=cue.type;oscillator.frequency.setValueAtTime(frequency,start);
   gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(cue.level,start+.008);
   gain.gain.exponentialRampToValueAtTime(.0001,end);
   oscillator.connect(gain);gain.connect(master);voices.add(oscillator);
   oscillator.onended=()=>{voices.delete(oscillator);oscillator.disconnect();gain.disconnect();};
   oscillator.start(start);oscillator.stop(end+.01);
  });
 }
 function sync(){document.querySelectorAll('.gameSoundToggle').forEach(button=>{
  button.textContent=AudioEngine?'Âm: '+(enabled?'Bật':'Tắt'):'Âm: Không hỗ trợ';
  button.setAttribute('aria-pressed',String(enabled&&!!AudioEngine));button.disabled=!AudioEngine;
 });}
 function attachControls(){
  document.querySelectorAll('.previewControls,.fishingViewControls').forEach(parent=>{
   const button=document.createElement('button');button.type='button';button.className='gameSoundToggle';
   button.addEventListener('click',()=>{
    enabled=!enabled;try{localStorage.setItem('revival-sound',enabled?'on':'off');}catch{}
    if(!enabled)stop();else{unlock();play('good');}sync();
   });parent.appendChild(button);
  });sync();
 }
 document.addEventListener('pointerdown',event=>{
  unlock();const button=event.target.closest('button');
  if(button&&!button.disabled&&!button.matches('.fishingTap,.gameSoundToggle'))play('tap');
 },{capture:true,passive:true});
 document.addEventListener('pointerup',unlock,{capture:true,passive:true});
 document.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')unlock();},{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();if(context?.state==='running')context.suspend().catch(()=>{});}else unlock();});
 window.addEventListener('blur',stop);
 window.RevivalAudio={play,stop};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attachControls,{once:true});else attachControls();
})();
