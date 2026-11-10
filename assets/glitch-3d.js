import {GlitchEscape} from './glitch-engine.js?v=entry-expand-8';
export function setupGlitchGame({THREE:T,root,stage,scene,position,clearInput,focusStage,onLost,onRestart}){
  const engine=new GlitchEscape(),world=new T.Group();scene.add(world);world.visible=false;
  const mode=document.createElement('button');mode.type='button';mode.dataset.ropeMode='glitch';mode.textContent='Vòng tròn Glitch';root.querySelector('.ropeModes').append(mode);
  const panel=document.createElement('section');panel.className='glitchPanel';panel.innerHTML='<div class="glitchTop"><strong>Chạm vòng · 3 giây · Vô hạn vòng</strong><span data-glitch-charges>0 Glitch Charge</span></div><p data-glitch-message></p><div class="glitchProgress"><i></i></div><div class="glitchActions"><button type="button" data-glitch-start>Đặt lại vị trí</button></div>';stage.before(panel);
  const staticFx=document.createElement('div');staticFx.className='glitchStatic';staticFx.setAttribute('aria-hidden','true');stage.append(staticFx);
  const cue=document.createElement('div');cue.className='glitchCue';cue.setAttribute('role','status');stage.append(cue);
  const message=panel.querySelector('[data-glitch-message]'),start=panel.querySelector('[data-glitch-start]'),bar=panel.querySelector('.glitchProgress i'),count=panel.querySelector('[data-glitch-charges]');
  function box(w,h,d,color){return new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.7}));}
  function disc(radius,color,y,opacity=1){const m=new T.Mesh(new T.CircleGeometry(radius,80),new T.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:opacity===1}));m.rotation.x=-Math.PI/2;m.position.y=y;world.add(m);return m;}
  function ring(radius,color,y){const m=new T.Mesh(new T.TorusGeometry(radius,.035,8,80),new T.MeshBasicMaterial({color}));m.rotation.x=-Math.PI/2;m.position.y=y;world.add(m);return m;}
  const arena=disc(engine.arenaRadius,0x302444,.035),arenaRing=ring(engine.arenaRadius,0xc295ff,.065);
  const entry=disc(.65,0x7536ae,.055,.8),entryRing=ring(.65,0x82fff1,.08),entryPixels=[];
  for(let i=0;i<12;i++){const pixel=box(.08+i%3*.035,.06,.12,i%2?0x6cffe6:0xe778ff);world.add(pixel);entryPixels.push(pixel);}
  const safe=disc(engine.safeRadius,0x49e0a3,.07,.55),safeRing=ring(engine.safeRadius,0xa6ffcf,.085);
  const burst=ring(engine.safeRadius,0xc8ffe8,.10);burst.material.transparent=true;burst.visible=false;
  const sparks=[];for(let i=0;i<18;i++){const m=box(.07,.07,.07,0x9fffd6);m.material.transparent=true;m.visible=false;world.add(m);sparks.push(m);}
  const reward=document.createElement('div');reward.className='glitchReward';stage.append(reward);
  let active=false,lastState='',fxTime=0,fxX=0,fxZ=0,clock=0;
  function resetFx(){fxTime=0;burst.visible=false;sparks.forEach(m=>m.visible=false);reward.classList.remove('pop');reward.hidden=true;stage.classList.remove('glitchHit','glitchDanger','glitchDead');}
  function celebrate(x,z){fxTime=.7;fxX=x;fxZ=z;reward.hidden=false;reward.textContent='+1 GLITCH CHARGE';reward.classList.remove('pop');stage.classList.remove('glitchHit');void reward.offsetWidth;reward.classList.add('pop');stage.classList.add('glitchHit');window.RevivalAudio?.play('excellent');}

  function text(el,value){if(el.textContent!==value)el.textContent=value;}
  function startRound(){engine.reset();resetFx();onRestart();position.set(0,0,5);clearInput();lastState='';focusStage();}
  start.onclick=startRound;
  function setActive(value){active=value;root.dataset.glitch=String(value);panel.hidden=!value;cue.hidden=!value;world.visible=value;engine.reset();if(value)position.set(0,0,5);resetFx();lastState='';if(value){root.querySelector('.characterHeader h2').textContent='Vòng tròn Glitch · Kelly 3D';root.querySelector('.characterHeader p').textContent='Đi tới điểm glitch trên sàn để mở sân. Chạm vòng xanh trước 3 giây; đi ra ngoài sân để kết thúc.';root.querySelector('.characterViewLabel').textContent='GLITCH / THIRD PERSON';root.querySelector('.characterFloorHint').textContent='WASD / joystick để đi · Kéo chuột / vuốt để xoay camera';}}
  function update(dt){
    if(!active)return;
    const previousCharges=engine.charges,previousX=engine.safeX,previousZ=engine.safeZ;
    engine.update(dt,position.x,position.z);clock+=dt;
    if(engine.charges>previousCharges)celebrate(previousX,previousZ);
    fxTime=Math.max(0,fxTime-dt);const progress=1-fxTime/.7;
    burst.visible=fxTime>0;burst.position.set(fxX,.10,fxZ);burst.scale.setScalar(1+progress*1.8);burst.material.opacity=1-progress;
    sparks.forEach((m,i)=>{m.visible=fxTime>0;const a=i*Math.PI*2/sparks.length,r=.2+progress*1.45;m.position.set(fxX+Math.cos(a)*r,.12+Math.sin(progress*Math.PI)*(.3+i%3*.1),fxZ+Math.sin(a)*r);m.material.opacity=1-progress;m.rotation.x+=dt*5;m.rotation.z+=dt*4;});
    if(fxTime===0){reward.hidden=true;stage.classList.remove('glitchHit','glitchDanger','glitchDead');}
    const stateKey=engine.state+':'+engine.round;
    if(stateKey!==lastState){
      lastState=stateKey;
      if(engine.state==='failed'){onLost();window.RevivalAudio?.play('fail');}
      const copy={ready:'Bạn đang ở ngoài sân. Đi tới điểm glitch tím phía trước để tự động mở minigame.',expanding:'Glitch đang mở rộng thành sân tròn…',ended:'Đã ra khỏi sân · Lượt chơi kết thúc. Giữ nguyên Charge đã nhận. Bấm Chơi lại để trở về điểm xuất phát.',dodge:'Vòng '+engine.round+' · Chạm vòng xanh: +1 Charge ngay và chuyển vòng tiếp theo. Mỗi vòng 3 giây.',failed:'Bạn đã chết vì đứng ngoài vòng xanh. Bấm Thử lại để chơi tiếp.'};text(message,copy[engine.state]);
      start.disabled=engine.state==='expanding';text(start,engine.state==='ready'?'Đặt lại vị trí':engine.state==='dodge'?'Kết thúc & đặt lại':'Chơi lại');text(count,engine.charges+' Glitch Charge');
    }
    const playing=engine.state==='dodge',inside=Math.hypot(position.x-engine.safeX,position.z-engine.safeZ)<=engine.safeRadius;
    text(cue,playing?'VÒNG '+engine.round+' · '+Math.max(0,engine.duration-engine.time).toFixed(1)+'s':engine.state==='failed'?'ĐÃ CHẾT':engine.state==='ended'?'ĐÃ KẾT THÚC':engine.state==='expanding'?'GLITCH ĐANG MỞ':'ĐI TỚI ĐIỂM GLITCH');
    safe.visible=safeRing.visible=['dodge','failed'].includes(engine.state);safe.position.set(engine.safeX,.07,engine.safeZ);safeRing.position.set(engine.safeX,.085,engine.safeZ);arena.material.color.setHex(engine.state==='failed'?0x692b46:0x302444);
    const expanding=engine.state==='expanding',inArena=['expanding','dodge','failed'].includes(engine.state);
    arena.visible=arenaRing.visible=inArena;const expansion=expanding?Math.min(1,engine.expandTime/.6):1;arena.scale.setScalar(.22+.78*(1-Math.pow(1-expansion,3)));arenaRing.scale.copy(arena.scale);
    entry.visible=entryRing.visible=engine.state==='ready';entryRing.scale.setScalar(1+.08*Math.sin(clock*5));entry.material.opacity=.65+.15*Math.sin(clock*8);
    entryPixels.forEach((m,i)=>{m.visible=engine.state==='ready';const a=clock*.7+i*Math.PI/6;m.position.set(Math.cos(a)*(.45+i%3*.12),.15+Math.sin(clock*3+i)*.08,Math.sin(a)*(.45+i%3*.12));m.rotation.y=clock+i;});
    const spawn=Math.min(1,engine.time/.25),pop=.25+.75*(1-Math.pow(1-spawn,3));safe.scale.setScalar(pop);safeRing.scale.setScalar(pop*(1+.035*Math.sin(clock*5)));safe.material.opacity=.62+.12*Math.sin(clock*4);
    bar.style.transform='scaleX('+(playing?Math.max(0,1-engine.time/engine.duration):0)+')';
    stage.classList.toggle('glitchDanger',playing&&engine.time>=2);stage.classList.toggle('glitchDead',engine.state==='failed');
  }
  return {get active(){return active;},get canMove(){return ['ready','expanding','dodge','ended'].includes(engine.state);},engine,setActive,update,startRound};
}
