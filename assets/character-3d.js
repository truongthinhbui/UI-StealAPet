import {JumpLunge} from './jump-lunge.js?v=fire-11';
import * as THREE from './vendor/three/three.module.js';
import {FBXLoader} from './vendor/three/FBXLoader.js';
import {AnimationBlend} from './animation-blend.js';
import {setupRopeGame} from './rope-3d.js?v=locked-4';
import {setupGlitchGame} from './glitch-3d.js?v=streak-12';

const root=document.getElementById('tab-character-3d');
root.innerHTML=`<header class="characterHeader"><div><span class="characterKicker">CHARACTER PLAYGROUND</span><h2>Kelly · 3D Movement</h2><p>Điều khiển tức thì, animation chuyển mượt. Nhảy không lấy đà.</p></div><span class="characterState" role="status">Đang tải</span></header><div class="characterStage"><span class="characterViewLabel">THIRD PERSON / TRAINING GROUND</span><span class="characterFloorHint">Kéo chuột hoặc vuốt bên phải để xoay camera</span><span class="characterCrosshair" aria-hidden="true"></span><div class="characterLoad"><strong>Đang chuẩn bị nhân vật…</strong><p>Đang tải model, texture và 4 animation.</p></div><div class="characterJoystick" role="group" aria-label="Joystick di chuyển"><span></span></div><div class="characterTouchActions"><button type="button" data-3d="death" disabled>Ngã</button><button type="button" data-3d="jump" disabled>Nhảy</button></div></div><div class="characterToolbar"><div class="characterAnimList"><span data-clip="idle">01 Idle</span><span data-clip="walking">02 Walking</span><span data-clip="jump">03 Jump</span><span data-clip="death">04 Flying Back Death</span></div><button type="button" data-3d="reset" disabled>Đặt lại nhân vật</button></div><div class="characterInstructions"><kbd>W A S D</kbd> hoặc <kbd>↑ ↓ ← →</kbd> Đi bộ &nbsp; <kbd>Space</kbd> Nhảy &nbsp; <kbd>K</kbd> Thử ngã &nbsp; <kbd>R</kbd> Đặt lại<br>Mobile: joystick trái để đi, vuốt vùng bên phải để nhìn. Nhấp vào sân để dùng bàn phím. Animation ngã phát một lần và giữ tư thế cuối.</div>`;
const stage=root.querySelector('.characterStage'),overlay=root.querySelector('.characterLoad'),stateLabel=root.querySelector('.characterState'),joy=root.querySelector('.characterJoystick'),knob=joy.querySelector('span');
let renderer,scene,camera,mixer,actor,model,blend,hipBone,ropeGame,glitchGame,actions={},activeAction,current='idle',yaw=0,pitch=.24,distance=4.2,frame=0,last=0,loaded=false,failed=false,dead=false,jumpRemaining=0;
let keys=new Set(),stick={x:0,y:0},lookPointer=null,joystickPointer=null;
const jumpLunge=new JumpLunge();
const position=new THREE.Vector3(),target=new THREE.Vector3(),lookAt=new THREE.Vector3(),desiredCamera=new THREE.Vector3(),worldSize=17;
const clipBadges=Array.from(root.querySelectorAll('[data-clip]'));
const fpsLabel=document.createElement('span');fpsLabel.className='characterFps';fpsLabel.textContent='FPS —';stage.append(fpsLabel);
let perfTime=0,perfFrames=0,slowWindows=0;
const labels={idle:'Idle · Đứng yên',walking:'Walking · Đi bộ',jump:'Jump · Nhảy',death:'Flying Back Death · Ngã'};
function clearInput(){keys.clear();stick.x=stick.y=0;joystickPointer=null;lookPointer=null;knob.style.transform='';}
function visible(){return root.classList.contains('active')&&!document.hidden;}
function setState(name,immediate=false){
  if(current===name&&activeAction)return;
  const next=actions[name];if(!next)return;
  current=name;activeAction=next;blend.to(name,immediate);
  stateLabel.textContent=labels[name];
  clipBadges.forEach(el=>el.dataset.active=String(el.dataset.clip===name));
}
function reset(){if(!loaded)return;clearInput();dead=false;jumpRemaining=0;jumpLunge.reset();position.set(0,0,0);actor.position.copy(position);actor.rotation.y=Math.PI;yaw=0;pitch=.24;stage.dataset.dead='false';mixer.stopAllAction();activeAction=null;setState('idle',true);root.querySelectorAll('[data-3d]').forEach(b=>b.disabled=false);camera.position.set(0,2,4.2);if(ropeGame?.active){position.set(0,0,ropeGame.radius);actor.position.copy(position);ropeGame.restart();}if(glitchGame?.active)glitchGame.setActive(true);mixer.update(0);drawOnce();}
function playJump(age=0){if(!loaded||dead)return;jumpRemaining=Math.max(0,actions.jump.getClip().duration-age);setState('jump');actions.jump.time=age;}
function jump(){if(glitchGame?.active&&!glitchGame.canMove)return;if(ropeGame?.active){ropeGame.jump();return;}if(!loaded||dead||jumpRemaining>0)return;playJump();jumpLunge.start(actor.rotation.y);glitchGame?.onJump?.();}
function death(){if(!loaded||dead)return;dead=true;jumpRemaining=0;jumpLunge.reset();clearInput();stage.dataset.dead='true';setState('death');root.querySelector('[data-3d=jump]').disabled=true;root.querySelector('[data-3d=death]').disabled=true;}
function cameraUpdate(dt){
  if(glitchGame?.active){
    // Follow the gameplay root, so the jump clip cannot shake the camera.
    target.copy(position);target.y=1.1;
    const back=distance+(camera.aspect<.8?.7:0);
    desiredCamera.set(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)).multiplyScalar(back).add(target);
    camera.position.copy(desiredCamera);camera.lookAt(target);return;
  }
  if(ropeGame?.active){
    if(dead&&hipBone)hipBone.getWorldPosition(target);else target.copy(position);
    camera.position.set(target.x,2.8,target.z+4.6);camera.lookAt(target.x,.95,target.z-1.8);return;
  }
  if(dead&&model){hipBone.getWorldPosition(target);target.y=.65;}else target.copy(position).add(new THREE.Vector3(0,1.15,0));
  const desired=desiredCamera.set(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)).multiplyScalar(distance).add(target);
  camera.position.copy(desired);lookAt.copy(target);camera.lookAt(lookAt);
}
function drawOnce(){if(!renderer||!loaded)return;cameraUpdate(0);renderer.render(scene,camera);}
function resize(){if(!renderer)return;const w=stage.clientWidth,h=stage.clientHeight;if(w<1||h<1)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();if(loaded)drawOnce();}
function animate(now){
  frame=0;if(!visible()||!loaded){last=0;return;}
  const elapsed=last?(now-last)/1000:0,dt=Math.min(elapsed,.05);last=now;
  if(elapsed>0){perfTime+=elapsed;perfFrames++;if(perfTime>=1){const fps=perfFrames/perfTime;fpsLabel.firstChild.nodeValue='FPS '+Math.round(fps);slowWindows=fps<42?slowWindows+1:0;if(slowWindows>=3&&renderer.getPixelRatio()>.75){renderer.setPixelRatio(Math.max(.75,renderer.getPixelRatio()-.25));resize();slowWindows=0;}perfTime=0;perfFrames=0;}}
  if(ropeGame?.active){
    if(jumpRemaining>0)jumpRemaining=Math.max(0,jumpRemaining-dt);
    if(jumpRemaining===0&&!dead)setState('idle');
    ropeGame.update(dt);
  }else if(glitchGame?.active){
    let moving=false;
    if(glitchGame.canMove&&!dead){let x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0)+stick.x,z=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0)+stick.y;const len=Math.hypot(x,z);moving=len>.04;if(moving){x/=len;z/=len;const wx=x*Math.cos(yaw)+z*Math.sin(yaw),wz=-x*Math.sin(yaw)+z*Math.cos(yaw);position.x+=wx*2.8*dt;position.z+=wz*2.8*dt;position.x=THREE.MathUtils.clamp(position.x,-worldSize,worldSize);position.z=THREE.MathUtils.clamp(position.z,-worldSize,worldSize);const turn=Math.atan2(Math.sin(Math.atan2(wx,wz)-actor.rotation.y),Math.cos(Math.atan2(wx,wz)-actor.rotation.y));actor.rotation.y+=turn*(1-Math.exp(-30*dt));}}
    if(!dead&&glitchGame.canMove)jumpLunge.update(dt,position);else jumpLunge.reset();
    if(jumpRemaining>0){jumpRemaining=Math.max(0,jumpRemaining-dt);if(jumpRemaining===0&&!dead)glitchGame.onLand();}
    if(!dead&&jumpRemaining===0)setState(moving?'walking':'idle');glitchGame.update(dt);
  }else if(!dead){
    jumpLunge.update(dt,position);
    let x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0)+stick.x;
    let z=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0)+stick.y;
    const len=Math.hypot(x,z);if(len>.04){x/=len;z/=len;const wx=x*Math.cos(yaw)+z*Math.sin(yaw),wz=-x*Math.sin(yaw)+z*Math.cos(yaw);position.x=THREE.MathUtils.clamp(position.x+wx*1.55*dt,-worldSize,worldSize);position.z=THREE.MathUtils.clamp(position.z+wz*1.55*dt,-worldSize,worldSize);const wanted=Math.atan2(wx,wz);actor.rotation.y=wanted;}
    if(jumpRemaining>0){jumpRemaining=Math.max(0,jumpRemaining-dt);if(jumpRemaining===0)setState(len>.04?'walking':'idle');}else setState(len>.04?'walking':'idle');
  }
  actor.position.copy(position);blend.update(dt);mixer.update(dt);cameraUpdate(dt);renderer.render(scene,camera);frame=requestAnimationFrame(animate);
}
function sync(){if(!visible()){if(renderer&&document.pointerLockElement===renderer.domElement)document.exitPointerLock();if(frame)cancelAnimationFrame(frame);frame=0;last=0;perfTime=0;perfFrames=0;clearInput();return;}if(!loaded&&!failed){load();return;}resize();if(loaded&&!frame){last=0;frame=requestAnimationFrame(animate);}}
let loading=false;
async function load(){
  if(loading)return;loading=true;
  try{
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
    const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('aria-label','Sân thử nhân vật Kelly 3D. WASD đi, Space nhảy, K ngã, R đặt lại.');stage.prepend(canvas);
    scene=new THREE.Scene();scene.background=new THREE.Color('#263e52');scene.fog=new THREE.Fog('#263e52',19,55);
    camera=new THREE.PerspectiveCamera(48,1,.05,90);
    scene.add(new THREE.HemisphereLight(0xd4eaff,0x657765,2.6));
    const sun=new THREE.DirectionalLight(0xffe9cd,3.1);sun.position.set(-5,9,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.1,far:30});sun.shadow.bias=-.0005;sun.shadow.normalBias=.025;scene.add(sun);
    const rim=new THREE.DirectionalLight(0xa4dfff,1.8);rim.position.set(4,3,-5);scene.add(rim);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshStandardMaterial({color:0x536f74,roughness:1}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
    const grid=new THREE.GridHelper(40,40,0x9fbdb5,0x68878a);grid.position.y=.003;grid.material.opacity=.3;grid.material.transparent=true;scene.add(grid);
    const border=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-17,.01,-17),new THREE.Vector3(17,.01,-17),new THREE.Vector3(17,.01,17),new THREE.Vector3(-17,.01,17)]),new THREE.LineBasicMaterial({color:0xc3cdae}));scene.add(border);
    for(let i=0;i<4;i++){const marker=new THREE.Mesh(new THREE.CylinderGeometry(.25,.32,.12,32),new THREE.MeshStandardMaterial({color:i%2?0xb9dfd6:0xf0dba2}));marker.position.set((i<2?-1:1)*8,.06,(i%2?-1:1)*8);marker.receiveShadow=true;scene.add(marker);}
    const manager=new THREE.LoadingManager();manager.setURLModifier(url=>url);
    const loader=new FBXLoader(manager),textureLoader=new THREE.TextureLoader();
    const assetURL=name=>new URL('./character-3d/'+name,import.meta.url).href;
    const files=['idle','walking','jump','death'];
    const models=await Promise.all(files.map(async(name,i)=>{const result=await loader.loadAsync(assetURL(name+'.fbx'));overlay.querySelector('p').textContent='Đã tải animation '+name+'.';return result;}));
    model=models[0];actor=new THREE.Group();scene.add(actor);actor.add(model);
    const height=new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).y;model.scale.setScalar(1.72/height);
    const textureNames={'0028':'tex_0252_0out.png','0008':'tex_0072_0out.png','0007':'tex_0063_0out.png','0006':'tex_0054_0out.png','0005':'tex_0045_0out.png'};
    const textures=Object.fromEntries(await Promise.all(Object.entries(textureNames).map(async([key,file])=>{const t=await textureLoader.loadAsync(assetURL(file));t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return [key,t];})));
    model.traverse(mesh=>{if(!mesh.isMesh)return;const id=Object.keys(textures).find(id=>mesh.name.includes('Mesh_'+id));mesh.material=new THREE.MeshStandardMaterial({map:textures[id],roughness:.88,metalness:0,side:id==='0028'?THREE.DoubleSide:THREE.FrontSide});mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;if(mesh.isSkinnedMesh)mesh.normalizeSkinWeights();});
    mixer=new THREE.AnimationMixer(model);
    const idleHip=models[0].animations[0].tracks.find(t=>t.name.endsWith('Hips.position')).values.slice(0,3);
    for(let i=0;i<files.length;i++){
      const name=files[i];
      // Skip the supplied jump's 0.6-second crouch wind-up; start on takeoff.
      const clip=name==='jump'?THREE.AnimationUtils.subclip(models[i].animations[0],name,36,90,60):models[i].animations[0].clone();clip.name=name;
      // Character motion is controlled by the actor; preserve vertical FBX motion and death knockback.
      const hip=clip.tracks.find(t=>t.name.endsWith('Hips.position'));
      if(hip){const x=hip.values[0],z=hip.values[2];for(let k=0;k<hip.values.length;k+=3){hip.values[k]=name==='death'?hip.values[k]-x+idleHip[0]:idleHip[0];hip.values[k+2]=name==='death'?hip.values[k+2]-z+idleHip[2]:idleHip[2];}}
      actions[name]=mixer.clipAction(clip);if(name==='jump'||name==='death'){actions[name].setLoop(THREE.LoopOnce,1);actions[name].clampWhenFinished=true;}
    }
    // Release the three duplicate meshes; their clips have been copied to the shared character.
    for(const object of models.slice(1))object.traverse(mesh=>{if(mesh.isMesh){mesh.geometry.dispose();for(const m of Array.isArray(mesh.material)?mesh.material:[mesh.material])m.dispose();}});
    hipBone=model.getObjectByName('mixamorigHips');blend=new AnimationBlend(actions);
    mixer.clipAction(actions.idle.getClip()).play();
    await renderer.compileAsync(scene,camera);
    loaded=true;root.dataset.loaded='true';overlay.hidden=true;
    ropeGame=setupRopeGame({THREE,root,stage,scene,onJump:playJump,onLost:death,onMode:(_active,mode)=>{glitchGame?.setActive(mode==='glitch');reset();}});
    glitchGame=setupGlitchGame({THREE,root,stage,scene,position,clearInput,focusStage,onLost:death,onRestart:()=>{dead=false;jumpRemaining=0;jumpLunge.reset();stage.dataset.dead='false';root.querySelector('[data-3d=jump]').disabled=false;setState('idle',true);}});ropeGame.setMode('glitch');resize();
    const lockHint=document.createElement('span');lockHint.className='characterLockHint';lockHint.textContent='Nhấp vào sân để khóa chuột · Esc để thoát';stage.append(lockHint);
    function rotateView(dx,dy){yaw-=dx*.004;pitch=THREE.MathUtils.clamp(pitch+dy*.003,-.08,.8);}
    function lockFallback(){lockHint.textContent='Trình duyệt chưa khóa được chuột · Kéo để xoay camera';}
    canvas.addEventListener('pointerdown',e=>{
      if(e.button!==0&&e.button!==2)return;canvas.focus({preventScroll:true});
      if(ropeGame?.active){if(e.button===0)jump();return;}
      if(e.pointerType==='mouse'&&canvas.requestPointerLock){
        lookPointer={id:e.pointerId,x:e.clientX,y:e.clientY};
        if(document.pointerLockElement!==canvas){try{const request=canvas.requestPointerLock();request?.catch(lockFallback);}catch{lockFallback();}}
        return;
      }
      canvas.setPointerCapture(e.pointerId);lookPointer={id:e.pointerId,x:e.clientX,y:e.clientY};
    });
    document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&visible())rotateView(e.movementX,e.movementY);});
    canvas.addEventListener('pointermove',e=>{if(document.pointerLockElement===canvas||lookPointer?.id!==e.pointerId)return;rotateView(e.clientX-lookPointer.x,e.clientY-lookPointer.y);lookPointer={id:e.pointerId,x:e.clientX,y:e.clientY};});
    document.addEventListener('pointerlockchange',()=>{const locked=document.pointerLockElement===canvas;stage.dataset.cursorLocked=String(locked);lockHint.textContent=locked?'Đã khóa chuột · Esc để thoát':'Nhấp vào sân để khóa chuột · Esc để thoát';clearInput();if(locked)canvas.focus({preventScroll:true});else updateLocomotion();});
    document.addEventListener('pointerlockerror',lockFallback);
    for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>lookPointer=null);
    canvas.addEventListener('contextmenu',e=>e.preventDefault());canvas.addEventListener('wheel',e=>{e.preventDefault();if(ropeGame?.active)return;distance=THREE.MathUtils.clamp(distance+e.deltaY*.004,2.2,7);},{passive:false});
    sync();
  }catch(error){failed=true;root.dataset.error=error.message;overlay.hidden=false;overlay.querySelector('strong').textContent='Chưa tải được sân 3D';overlay.querySelector('p').textContent=error.message+'. Hãy mở web qua localhost hoặc địa chỉ web, rồi tải lại trang.';stateLabel.textContent='Lỗi tải 3D';console.error(error);}
}
function updateLocomotion(){if(!loaded||dead||jumpRemaining>0||ropeGame?.active)return;if(glitchGame?.active&&!glitchGame.canMove)return;const x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0)+stick.x,z=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0)+stick.y;setState(Math.hypot(x,z)>.04?'walking':'idle');}
function focusStage(){if(loaded)renderer.domElement.focus({preventScroll:true});}
root.querySelector('[data-3d=jump]').onclick=()=>{jump();focusStage();};root.querySelector('[data-3d=death]').onclick=()=>{death();focusStage();};root.querySelector('[data-3d=reset]').onclick=()=>{reset();focusStage();};
const movementKeys=['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright'];
document.addEventListener('keydown',e=>{if(!visible()||!loaded||document.activeElement!==renderer.domElement)return;const key=e.key.toLowerCase();if(key==='escape'){if(document.pointerLockElement===renderer.domElement)document.exitPointerLock();clearInput();updateLocomotion();return;}if(movementKeys.includes(key)){e.preventDefault();if(ropeGame?.active)return;keys.add(key);updateLocomotion();}else if(!e.repeat&&[' ','k','r'].includes(key)){e.preventDefault();if(key===' ')jump();if(key==='k'&&!ropeGame?.active&&!glitchGame?.active)death();if(key==='r')reset();}});
document.addEventListener('keyup',e=>{keys.delete(e.key.toLowerCase());updateLocomotion();});
function moveStick(e){const box=joy.getBoundingClientRect(),dx=e.clientX-box.left-box.width/2,dy=e.clientY-box.top-box.height/2,r=box.width*.34,len=Math.hypot(dx,dy),scale=len>r?r/len:1;stick.x=dx*scale/r;stick.y=dy*scale/r;knob.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;updateLocomotion();}
joy.addEventListener('pointerdown',e=>{if(!loaded||dead||joystickPointer!==null)return;e.preventDefault();joystickPointer=e.pointerId;joy.setPointerCapture(e.pointerId);moveStick(e);});joy.addEventListener('pointermove',e=>{if(joystickPointer===e.pointerId)moveStick(e);});for(const event of ['pointerup','pointercancel','lostpointercapture'])joy.addEventListener(event,e=>{if(joystickPointer!==e.pointerId)return;joystickPointer=null;stick.x=stick.y=0;knob.style.transform='';updateLocomotion();});
window.addEventListener('blur',()=>{clearInput();if(renderer&&document.pointerLockElement===renderer.domElement)document.exitPointerLock();});document.addEventListener('visibilitychange',sync);new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['class']});new ResizeObserver(resize).observe(stage);sync();
