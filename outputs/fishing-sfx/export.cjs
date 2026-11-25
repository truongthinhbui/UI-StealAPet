const fs=require('fs'),vm=require('vm'),path=require('path');
const source=fs.readFileSync('assets/game-audio.js','utf8');
const cues=vm.runInNewContext('('+source.match(/const cues=(\{[\s\S]*?\n \});/)[1]+')');
const names=['tap','good','excellent','bonus','break','miss','fail','catch','glitchLand','kickCharge','glitchIgnite','ballBounce','glitchOpen','glitchJump','kick'];
const html=`<!doctype html><body><pre id="result">pending</pre><script>
const cues=${JSON.stringify(Object.fromEntries(names.map(n=>[n,cues[n]])))};
(async()=>{const result={};for(const [name,cue] of Object.entries(cues)){
const rate=48000,ctx=new OfflineAudioContext(1,Math.ceil(((cue.notes.length-1)*.055+cue.duration+.06)*rate),rate);
const master=ctx.createGain();master.gain.value=.55;master.connect(ctx.destination);
cue.notes.forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),start=i*.055,end=start+cue.duration;o.type=cue.type;o.frequency.setValueAtTime(f,start);g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(cue.level,start+.008);g.gain.exponentialRampToValueAtTime(.0001,end);o.connect(g);g.connect(master);o.start(start);o.stop(end+.01)});
const a=(await ctx.startRendering()).getChannelData(0);const b=new ArrayBuffer(44+a.length*2),v=new DataView(b);function s(p,t){for(let i=0;i<t.length;i++)v.setUint8(p+i,t.charCodeAt(i))}s(0,'RIFF');v.setUint32(4,b.byteLength-8,true);s(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);s(36,'data');v.setUint32(40,a.length*2,true);for(let i=0;i<a.length;i++)v.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,a[i]))*32767),true);let str='';for(const x of new Uint8Array(b))str+=String.fromCharCode(x);result[name]=btoa(str);
}document.getElementById('result').textContent=JSON.stringify(result)})().catch(e=>document.getElementById('result').textContent=String(e));
</script>`;
fs.writeFileSync('outputs/fishing-sfx/render.html',html);
