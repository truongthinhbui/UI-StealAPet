import {GlitchEscape} from './glitch-engine.js?v=deadline-4';
export function setupGlitchGame({THREE:T,root,stage,scene,position,clearInput,focusStage,onLost,onRestart}){
  const engine=new GlitchEscape(),world=new T.Group(),home=new T.Group();scene.add(world,home);world.visible=home.visible=false;
  const mode=document.createElement('button');mode.type='button';mode.dataset.ropeMode='glitch';mode.textContent='Vòng tròn Glitch';root.querySelector('.ropeModes').append(mode);
  const panel=document.createElement('section');panel.className='glitchPanel';panel.innerHTML='<div class="glitchTop"><strong>Chạm vòng · 3 giây · Vô hạn vòng</strong><span data-glitch-charges>0 Glitch Charge</span></div><p data-glitch-message></p><div class="glitchProgress"><i></i></div><div class="glitchActions"><button type="button" data-glitch-start>Bắt đầu Glitch</button><button type="button" data-glitch-home>Về nhà ngay</button></div>';stage.before(panel);
  const staticFx=document.createElement('div');staticFx.className='glitchStatic';staticFx.setAttribute('aria-hidden','true');stage.append(staticFx);
  const cue=document.createElement('div');cue.className='glitchCue';cue.setAttribute('role','status');stage.append(cue);
  const message=panel.querySelector('[data-glitch-message]'),start=panel.querySelector('[data-glitch-start]'),homeButton=panel.querySelector('[data-glitch-home]'),bar=panel.querySelector('.glitchProgress i'),count=panel.querySelector('[data-glitch-charges]');
  function box(w,h,d,color){return new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.7}));}
  function disc(radius,color,y,opacity=1){const m=new T.Mesh(new T.CircleGeometry(radius,80),new T.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:opacity===1}));m.rotation.x=-Math.PI/2;m.position.y=y;world.add(m);return m;}
  function ring(radius,color,y){const m=new T.Mesh(new T.TorusGeometry(radius,.035,8,80),new T.MeshBasicMaterial({color}));m.rotation.x=-Math.PI/2;m.position.y=y;world.add(m);return m;}
  const arena=disc(engine.arenaRadius,0x302444,.035);ring(engine.arenaRadius,0xc295ff,.065);
  const safe=disc(engine.safeRadius,0x49e0a3,.07,.55),safeRing=ring(engine.safeRadius,0xa6ffcf,.085);
  const floor=box(5,.08,5,0x71644c);floor.position.set(0,.015,9);home.add(floor);const wall=box(5,2.6,.15,0x32465c);wall.position.set(0,1.3,6.6);home.add(wall);const door=box(1.15,2.1,.05,0xa0d7bd);door.position.set(0,1.05,6.7);home.add(door);
  const burst=ring(engine.safeRadius,0xc8ffe8,.10);burst.material.transparent=true;burst.visible=false;
  const sparks=[];for(let i=0;i<18;i++){const m=box(.07,.07,.07,0x9fffd6);m.material.transparent=true;m.visible=false;world.add(m);sparks.push(m);}
  const reward=document.createElement('div');reward.className='glitchReward';stage.append(reward);
  let active=false,lastState='',fxTime=0,fxX=0,fxZ=0,clock=0;
  function resetFx(){fxTime=0;burst.visible=false;sparks.forEach(m=>m.visible=false);reward.classList.remove('pop');reward.hidden=true;stage.classList.remove('glitchHit','glitchDanger','glitchDead');}
  function celebrate(x,z){fxTime=.7;fxX=x;fxZ=z;reward.hidden=false;reward.textContent='+1 GLITCH CHARGE';reward.classList.remove('pop');stage.classList.remove('glitchHit');void reward.offsetWidth;reward.classList.add('pop');stage.classList.add('glitchHit');window.RevivalAudio?.play('excellent');}

  function text(el,value){if(el.textContent!==value)el.textContent=value;}
  function startRound(){if(!engine.start())return;resetFx();onRestart();position.set(0,0,0);clearInput();lastState='';focusStage();}
  start.onclick=startRound;homeButton.onclick=()=>{if(engine.returnHome()){clearInput();focusStage();}};
  function setActive(value){active=value;root.dataset.glitch=String(value);panel.hidden=!value;cue.hidden=!value;world.visible=value;home.visible=false;engine.reset();resetFx();lastState='';if(value){root.querySelector('.characterHeader h2').textContent='Vòng tròn Glitch · Kelly 3D';root.querySelector('.characterHeader p').textContent='Chạm vòng xanh trước 3 giây để nhận thưởng. Space / nút Nhảy để nhảy, vẫn di chuyển được trên không.';root.querySelector('.characterViewLabel').textContent='GLITCH / THIRD PERSON';root.querySelector('.characterFloorHint').textContent='WASD / joystick để đi · Kéo chuột / vuốt để xoay camera';}}
  function update(dt){
    if(!active)return;
    const previousCharges=engine.charges,previousX=engine.safeX,previousZ=engine.safeZ;
    engine.update(dt,position.x,position.z);clock+=dt;
    if(engine.charges>previousCharges)celebrate(previousX,previousZ);
    fxTime=Math.max(0,fxTime-dt);const progress=1-fxTime/.7;
    burst.visible=fxTime>0;burst.position.set(fxX,.10,fxZ);burst.scale.setScalar(1+progress*1.8);burst.material.opacity=1-progress;
    sparks.forEach((m,i)=>{m.visible=fxTime>0;const a=i*Math.PI*2/sparks.length,r=.2+progress*1.45;m.position.set(fxX+Math.cos(a)*r,.12+Math.sin(progress*Math.PI)*(.3+i%3*.1),fxZ+Math.sin(a)*r);m.material.opacity=1-progress;m.rotation.x+=dt*5;m.rotation.z+=dt*4;});
    if(fxTime===0){reward.hidden=true;stage.classList.remove('glitchHit','glitchDanger','glitchDead');}
    if(engine.state==='returning')clearInput();
    if(engine.state==='home'){position.set(0,0,9);world.visible=false;home.visible=true;}else{world.visible=true;home.visible=false;}
    const stateKey=engine.state+':'+engine.round;
    if(stateKey!==lastState){
      lastState=stateKey;
      if(engine.state==='failed'){onLost();window.RevivalAudio?.play('fail');}
      const copy={ready:'Bấm bắt đầu rồi chạy chạm vòng xanh. Mỗi lần chạm nhận +1 Charge và xuất hiện vòng mới ngay. Vô hạn vòng; không chạm kịp trong 3 giây sẽ thua.',dodge:'Vòng '+engine.round+' · Chạm vòng xanh: +1 Charge ngay và chuyển vòng tiếp theo. Mỗi vòng 3 giây.',returning:'Đang đưa bạn về nhà…',failed:'Bạn đã chết vì đứng ngoài vòng xanh. Thử lại hoặc về nhà.',home:'Đã về nhà · Giữ nguyên toàn bộ Charge đã nhận.'};text(message,copy[engine.state]);
      start.disabled=['dodge','returning'].includes(engine.state);text(start,engine.state==='ready'?'Bắt đầu Glitch':'Thử lại');homeButton.disabled=!['ready','failed','dodge'].includes(engine.state);text(count,engine.charges+' Glitch Charge');
    }
    const playing=engine.state==='dodge',inside=Math.hypot(position.x-engine.safeX,position.z-engine.safeZ)<=engine.safeRadius;
    text(cue,playing?'VÒNG '+engine.round+' · '+Math.max(0,engine.duration-engine.time).toFixed(1)+'s':engine.state==='failed'?'ĐÃ CHẾT':engine.state==='returning'?'ĐANG VỀ NHÀ':engine.state==='home'?'ĐÃ VỀ NHÀ':'');
    safe.visible=safeRing.visible=['dodge','failed','returning'].includes(engine.state);safe.position.set(engine.safeX,.07,engine.safeZ);safeRing.position.set(engine.safeX,.085,engine.safeZ);arena.material.color.setHex(engine.state==='failed'?0x692b46:0x302444);
    const spawn=Math.min(1,engine.time/.25),pop=.25+.75*(1-Math.pow(1-spawn,3));safe.scale.setScalar(pop);safeRing.scale.setScalar(pop*(1+.035*Math.sin(clock*5)));safe.material.opacity=.62+.12*Math.sin(clock*4);
    bar.style.transform='scaleX('+(playing?Math.max(0,1-engine.time/engine.duration):0)+')';
    stage.classList.toggle('glitchDanger',playing&&engine.time>=2);stage.classList.toggle('glitchDead',engine.state==='failed');
  }
  return {get active(){return active;},get canMove(){return ['ready','dodge'].includes(engine.state);},get atHome(){return engine.state==='home';},engine,setActive,update,startRound};
}
