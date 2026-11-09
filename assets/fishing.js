(function () {
  'use strict';
  const root = document.getElementById('tab-fishing');
  const scene = root.querySelector('.fishingScene');
  const viewport = root.querySelector('.fishingViewport');
  const rotateButton = root.querySelector('.fishingRotate');
  const fullscreenButton = root.querySelector('.fishingFullscreen');
  const hapticPatterns = {
    tap:{pattern:16,priority:0}, good:{pattern:40,priority:1},
    excellent:{pattern:[30,45,70],priority:2}, bonus:{pattern:[25,30,40,45,75],priority:3},
    break:{pattern:[35,45,80],priority:3}, miss:{pattern:[20,60,20],priority:1},
    fail:{pattern:[30,60,45],priority:2},
    catch:{pattern:[45,60,65,85,95],priority:4}
  };
  let hapticsEnabled = true, hapticUntil = 0, hapticPriority = -1;
  let hapticFeel=1;
  try { hapticsEnabled = localStorage.getItem('revival-haptics') !== 'off'; } catch {}
  try { const saved=Number(localStorage.getItem('revival-haptic-feel'));if([.65,1,1.4].includes(saved))hapticFeel=saved; } catch {}
  const hapticToggle = document.createElement('button');
  hapticToggle.type = 'button';
  hapticToggle.className = 'fishingHaptics';
  const hapticTest = document.createElement('button');
  hapticTest.type = 'button'; hapticTest.textContent = 'Thử rung';
  const hapticStatus = document.createElement('span');
  hapticStatus.className = 'fishingHapticStatus';
  hapticStatus.setAttribute('role','status');
  const canVibrate = typeof navigator.vibrate === 'function';
  const hapticFeelLabel=document.createElement('label');
  hapticFeelLabel.className='fishingHapticFeel';
  hapticFeelLabel.innerHTML='Nhịp rung <select aria-label="Độ dài nhịp rung"><option value="0.65">Nhẹ</option><option value="1">Vừa</option><option value="1.4">Rõ</option></select>';
  const hapticFeelSelect=hapticFeelLabel.querySelector('select');
  hapticFeelSelect.value=String(hapticFeel);
  hapticFeelSelect.addEventListener('change',()=>{
    hapticFeel=Number(hapticFeelSelect.value);
    try{localStorage.setItem('revival-haptic-feel',String(hapticFeel));}catch{}
    stopHaptic();haptic('excellent');
  });
  const updateHaptics = () => {
    hapticToggle.textContent = canVibrate ? 'Rung: ' + (hapticsEnabled ? 'Bật' : 'Tắt') : 'Rung: Không hỗ trợ';
    hapticToggle.setAttribute('aria-pressed',String(hapticsEnabled));
    hapticToggle.disabled = !canVibrate;
    hapticTest.disabled = !canVibrate || !hapticsEnabled;
    hapticFeelSelect.disabled = !canVibrate || !hapticsEnabled;
    if (!canVibrate) hapticStatus.textContent = 'Trình duyệt không hỗ trợ rung';
  };
  function stopHaptic() {
    try { if (canVibrate) navigator.vibrate(0); } catch {}
    hapticUntil = 0; hapticPriority = -1;
  }
  hapticToggle.addEventListener('click',()=>{
    hapticsEnabled = !hapticsEnabled;
    try { localStorage.setItem('revival-haptics',hapticsEnabled ? 'on' : 'off'); } catch {}
    if (!hapticsEnabled) stopHaptic();
    hapticStatus.textContent = '';
    updateHaptics();
    if (hapticsEnabled) haptic('good');
  });
  hapticTest.addEventListener('click',()=>{
    stopHaptic();
    hapticStatus.textContent = haptic('bonus') ? 'Đã gửi nhịp rung thử' : 'Trình duyệt chưa cho phép rung';
  });
  root.querySelector('.fishingViewControls').append(hapticToggle,hapticFeelLabel,hapticTest,hapticStatus);
  updateHaptics();
  // A light tap must not interrupt a stronger hit, bonus, or catch pattern.
  function haptic(kind = 'tap') {
    window.RevivalAudio?.play(kind);
    if (!hapticsEnabled || document.hidden || !canVibrate || navigator.userActivation?.hasBeenActive === false) return false;
    const effect = hapticPatterns[kind] || hapticPatterns.tap;
    const now = performance.now();
    if (now < hapticUntil && effect.priority <= hapticPriority) return false;
    const pattern=Array.isArray(effect.pattern)?effect.pattern.map((duration,index)=>index%2?duration:Math.round(duration*hapticFeel)):Math.round(effect.pattern*hapticFeel);
    try {
      const accepted = navigator.vibrate(pattern);
      if (accepted) {
        hapticUntil = now + (Array.isArray(pattern) ? pattern.reduce((sum,n)=>sum+n,0) : pattern);
        hapticPriority = effect.priority;
      }
      return accepted;
    } catch {
      return false;
    }
  }

  function setFullscreen(enabled) {
    viewport.toggleAttribute('data-immersive', enabled);
    document.documentElement.classList.toggle('fishingImmersive', enabled);
    fullscreenButton.setAttribute('aria-pressed', String(enabled));
    fullscreenButton.textContent = enabled ? 'Exit fullscreen' : 'Fullscreen';
  }

  rotateButton.addEventListener('click', () => {
    const rotated = viewport.toggleAttribute('data-rotated');
    rotateButton.setAttribute('aria-pressed', String(rotated));
    rotateButton.textContent = rotated ? 'Reset rotation' : 'Rotate';
  });

  fullscreenButton.addEventListener('click', async () => {
    if (viewport.hasAttribute('data-immersive')) {
      setFullscreen(false);
      if (document.fullscreenElement === viewport) await document.exitFullscreen();
      return;
    }
    setFullscreen(true);
    try {
      await viewport.requestFullscreen?.();
    } catch {
      // Use the fixed viewport when native fullscreen is unavailable.
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) setFullscreen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && viewport.hasAttribute('data-immersive') && !document.fullscreenElement) {
      setFullscreen(false);
      fullscreenButton.focus();
    }
  });

  for (const eventName of ['contextmenu', 'selectstart', 'dragstart']) {
    scene.addEventListener(eventName, event => event.preventDefault());
  }

  const button = root.querySelector('.fishingTap');
  // Cancel native long-press handling only on the game action, leaving page
  // scrolling and debug fields alone. Touch actions are handled on pointerup.
  let actionPointer=null,lastTouchAction=-Infinity;
  for(const eventName of ['touchstart','touchmove']){
    button.addEventListener(eventName,event=>{if(event.cancelable)event.preventDefault();},{passive:false});
  }
  const status = root.querySelector('.fishingFeedback');
  const title = root.querySelector('.fishingHud strong');
  const detail = root.querySelector('.fishingHud small');
  const rod = root.querySelector('.fishingHoldRod');
  let tapMotion;
  const holdFill = root.querySelector('.fishingHoldFill');
  const jointLayer = root.querySelector('.fishingHoldJoints');
  const jointCount = root.querySelector('#fishingJointCount');
  const jointThickness = root.querySelector('#fishingJointThickness');
  const debugControls = root.querySelector('.fishingDebug');
  const debugSettings = {speed:1, values:{0:5,2:0,3:2.3,4:.30,6:2.25}};
  let debugPaused = false;
  const debugPanel = document.createElement('details');
  debugPanel.className = 'fishingDebugPanel';
  debugPanel.innerHTML = '<summary>Debug · tùy chỉnh cơ chế</summary><div class="fishingDebugTools"><label>Tốc độ mô phỏng <select class="debugSpeed"><option value=".5">0.5×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option></select></label><label class="debugModeLabel"><span></span><select class="debugModeValue"></select></label><button type="button" data-debug="restart">Chơi lại</button><button type="button" data-debug="pause" aria-pressed="false">Tạm dừng</button><button type="button" data-debug="step">Bước +1/30s</button><button type="button" data-debug="shuffle">Đổi mục tiêu</button><button type="button" data-debug="win">Thử bắt cá</button><button type="button" data-debug="lose">Thử thất bại</button><button type="button" data-debug="defaults">Mặc định</button></div><output class="fishingDebugReadout" aria-live="off"></output>';
  debugControls.before(debugPanel);
  debugPanel.appendChild(debugControls);
  window.initFishingRewards();
  const rewards=window.FishingRewards;
  const debugReadout = debugPanel.querySelector('output');
  const debugModeValue = debugPanel.querySelector('.debugModeValue');
  const debugPauseButton = debugPanel.querySelector('[data-debug="pause"]');
  const debugModes = {
    0:{label:'Tap / khớp',options:[[3,'3 tap'],[5,'5 tap'],[7,'7 tap']]},
    2:{label:'Tốc độ thu vòng',options:[[0,'Random'],[.75,'Chậm'],[1,'Vừa'],[1.25,'Nhanh']]},
    3:{label:'Tốc độ cá',options:[[1.7,'Chậm'],[2.3,'Hiện tại'],[2.8,'Nhanh']]},
    4:{label:'Độ rộng vùng xanh',options:[[.22,'Hẹp'],[.30,'Hiện tại'],[.40,'Rộng']]},
    6:{label:'Tốc độ theo rarity',options:[[3,'Chậm ×0.75'],[2.25,'Theo config rarity'],[1.75,'Nhanh ×1.29']]}
  };
  let holdJoints = [];
  let stops = [];
  const debris = root.querySelector('.fishingHoldDebris');
  const circularCombo = root.querySelector('.circularCombo');
  const circularPrompt = root.querySelector('.circularPrompt');
  const circularHint = root.querySelector('.circularHint');
  let circularMotion;
  const circularDial = root.querySelector('.circularDial');
  const circularTarget = root.querySelector('.circularTarget');
  const circularEffects = new Set();
  const circularSpeed = () => debugSettings.values[2] || .75 + Math.random() * .5;
  const qtePips = Array.from(root.querySelectorAll('.qtePips i'));
  const qteLuckChip=root.querySelector('.qteLuckChip');
  const mutationPool=window.GenConfig.catalog;
  mutationPool.forEach(({id,name})=>{
    const token=document.createElement('span');token.className='mutationToken';token.dataset.mutation=id;token.title=name;
    token.appendChild(window.GenCore.icon(mutationPool.find(gen=>gen.id===id)));
    qteLuckChip.querySelector('.mutationPool').appendChild(token);
  });
  function chooseMutations(count){return window.GenCore.choose(count,Math.random,rewards.castRebirth).map(({id,name})=>({id,name}));}
  root.addEventListener('fishingbalancechange',()=>{instructions[6]=qteInstruction();if(mode===6)root.querySelector('.fishingInstructions').textContent=instructions[6];if(!rewards.isCasting&&!rewards.pending)renderMutation();});
  function renderMutation(result=false,previewPoints=null){
    const points=Math.min(100,previewPoints??game?.mutationPoints??0);
    qteLuckChip.hidden=false;
    qteLuckChip.querySelector('.mutationPercent').textContent=points.toLocaleString('vi-VN',{maximumFractionDigits:2})+'%';
    qteLuckChip.dataset.result=result?'true':'false';
    qteLuckChip.querySelectorAll('.mutationToken').forEach(token=>{
      const won=!!(result&&game.mutationRewards?.some(reward=>reward.id===token.dataset.mutation));
      token.classList.toggle('is-won',won);token.hidden=!won;
    });
    qteLuckChip.dataset.guaranteed=points>=100?'true':'false';
    qteLuckChip.querySelector('.mutationPool').hidden=!result||!game.mutations;
    const hint=qteLuckChip.querySelector('.mutationHint');
    hint.hidden=!result&&points<100;
    hint.textContent=result
      ? game.mutations===0?'Cá thường':game.mutationRewards.map(reward=>reward.name).join(' + ')
      : 'Tối đa 1 Gen';
  }
  function rollMutations(points){return window.GenCore.count(points);}
  function qteHitPoint(){
    const angle=game.marker*Math.PI*2;
    const radius=root.querySelector('.fishingRing').clientWidth*.432;
    return {x:50+Math.sin(angle)*radius/scene.clientWidth*100,y:44-Math.cos(angle)*radius/scene.clientHeight*100};
  }
  function luckMotes(point){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const dx=(50-point.x)/100*scene.clientWidth;
    const dy=(71-point.y)/100*scene.clientHeight+qteLuckChip.clientHeight/2;
    for(let index=0;index<6;index++){
      const mote=document.createElement('b');mote.className='qteLuckMote';mote.textContent='✦';
      mote.style.left=point.x+'%';mote.style.top=point.y+'%';scene.appendChild(mote);
      const motion=mote.animate([
        {transform:'translate(-50%,-50%) scale(.4)',opacity:0},
        {transform:`translate(calc(-50% + ${dx*.3+(index-2.5)*8}px),calc(-50% + ${dy*.2-25}px)) scale(1.15)`,opacity:1,offset:.3},
        {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.3)`,opacity:0}
      ],{duration:620,delay:index*45,easing:'cubic-bezier(.2,.65,.3,1)'});
      sharedEffects.add(motion);
      const cleanup=()=>{sharedEffects.delete(motion);mote.remove();};motion.onfinish=cleanup;motion.oncancel=cleanup;
    }
  }
  const catchPercent = root.querySelector('.catchProgress strong');
  let qteMotion;
  const distanceEffects = new Set();
  const sharedEffects = new Set();
  let fireworksCanvas,fireworksContext,fireworksFrame=0,fireworksLast=0;
  let fireworksQueue=[],fireworksParticles=[];
  function stopFireworks(){
    cancelAnimationFrame(fireworksFrame);fireworksFrame=0;
    fireworksQueue=[];fireworksParticles=[];
    if(fireworksCanvas){fireworksContext.clearRect(0,0,scene.clientWidth,scene.clientHeight);fireworksCanvas.hidden=true;fireworksCanvas.dataset.particles='0';}
  }
  function fireworks(kind='hit'){
    if(document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(!fireworksCanvas){
      fireworksCanvas=document.createElement('canvas');fireworksCanvas.className='fishingFireworks';
      fireworksCanvas.setAttribute('aria-hidden','true');
      fireworksContext=fireworksCanvas.getContext('2d');
      if(!fireworksContext){fireworksCanvas=null;return;}
      scene.appendChild(fireworksCanvas);
    }
    const width=scene.clientWidth,height=scene.clientHeight,dpr=Math.min(devicePixelRatio||1,1.5);
    if(fireworksCanvas.width!==Math.round(width*dpr)||fireworksCanvas.height!==Math.round(height*dpr)){
      fireworksCanvas.width=Math.round(width*dpr);fireworksCanvas.height=Math.round(height*dpr);
      fireworksContext.setTransform(dpr,0,0,dpr,0,0);
    }
    fireworksCanvas.hidden=false;
    const now=performance.now();
    const shells=kind==='catch'?[[.24,.32,0],[.76,.32,240],[.5,.38,480]]:[[.5,.42,0]];
    for(const [x,y,delay] of shells){
      if(fireworksQueue.length>=6)break;
      fireworksQueue.push({x:x*width,y:y*height,born:now+delay+170,launch:now+delay,count:kind==='catch'?48:kind==='excellent'?36:20,power:kind==='catch'?1:kind==='excellent'?.8:.6});
    }
    if(fireworksFrame)return;
    fireworksLast=now;
    const draw=now=>{
      const dt=Math.min(.035,(now-fireworksLast)/1000);fireworksLast=now;
      const ctx=fireworksContext,w=scene.clientWidth,h=scene.clientHeight;
      ctx.clearRect(0,0,w,h);
      const colors=['#ffe28a','#fff5cf','#80f6c1','#91ceff'];
      fireworksQueue=fireworksQueue.filter(shell=>{
        if(now<shell.born){
          if(now>=shell.launch){const progress=(now-shell.launch)/170;ctx.globalAlpha=.9;ctx.fillStyle='#ffeaa5';ctx.fillRect(shell.x,shell.y+(1-progress)*h*.17,2,10);}
          return true;
        }
        for(let i=0;i<shell.count&&fireworksParticles.length<180;i++){
          const angle=i/shell.count*Math.PI*2,speed=w*(.10+Math.random()*.13)*shell.power;
          fireworksParticles.push({x:shell.x,y:shell.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,age:0,life:.7+Math.random()*.55,color:colors[i%4],star:i%5===0});
        }
        return false;
      });
      fireworksParticles=fireworksParticles.filter(p=>{
        p.age+=dt;if(p.age>=p.life)return false;
        const oldX=p.x,oldY=p.y;
        p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=h*.22*dt;p.vx*=Math.exp(-dt*.8);
        ctx.globalAlpha=Math.max(0,1-p.age/p.life);ctx.strokeStyle=p.color;ctx.fillStyle=p.color;
        ctx.lineWidth=Math.max(1,w*.002);ctx.beginPath();ctx.moveTo(oldX,oldY);ctx.lineTo(p.x,p.y);ctx.stroke();
        const size=p.star?Math.max(2,w*.0035):Math.max(1.5,w*.002);
        if(p.star){ctx.fillRect(p.x-size,p.y-1,size*2,2);ctx.fillRect(p.x-1,p.y-size,2,size*2);}else ctx.fillRect(p.x,p.y,size,size);
        return true;
      });
      ctx.globalAlpha=1;
      fireworksCanvas.dataset.particles=String(fireworksParticles.length);
      if(fireworksQueue.length||fireworksParticles.length)fireworksFrame=requestAnimationFrame(draw);
      else{fireworksFrame=0;fireworksCanvas.hidden=true;ctx.clearRect(0,0,w,h);}
    };
    fireworksFrame=requestAnimationFrame(draw);
  }
  const impactMotions = new Map();
  function impactPunch(element, strong=false) {
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    impactMotions.get(element)?.cancel();
    const motion=element.animate([{scale:1},{scale:.94,offset:.12},{scale:strong?1.14:1.07,offset:.35},{scale:.99,offset:.7},{scale:1}],{duration:strong?480:320,easing:'ease-out'});
    impactMotions.set(element,motion);
    const cleanup=()=>{if(impactMotions.get(element)===motion)impactMotions.delete(element);};
    motion.onfinish=cleanup;motion.oncancel=cleanup;
  }
  function badFeedback(element){
    hitJuice(50,44,'bad');
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    impactMotions.get(element)?.cancel();
    const motion=element.animate([
      {transform:'translateX(0)',scale:1},
      {transform:'translateX(-5px)',scale:.96,offset:.15},
      {transform:'translateX(5px)',scale:.99,offset:.32},
      {transform:'translateX(-3px)',scale:1,offset:.5},
      {transform:'translateX(2px)',scale:1,offset:.7},
      {transform:'translateX(0)',scale:1}
    ],{duration:340,easing:'ease-out'});
    impactMotions.set(element,motion);
    const cleanup=()=>{if(impactMotions.get(element)===motion)impactMotions.delete(element);};
    motion.onfinish=cleanup;motion.oncancel=cleanup;
  }
  function hitJuice(x, y, strong = false, parent = scene) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const celebration=strong==='catch';
    const bad=strong==='bad';
    const existing=parent.querySelectorAll(':scope > .gameJuice');
    if(existing.length>=4)existing[0].getAnimations().forEach(animation=>animation.cancel());
    const burst = document.createElement('div');
    burst.className = 'gameJuice' + (strong&&!bad ? ' gameJuice-gold' : '') + (celebration?' gameJuice-catch':'')+(bad?' gameJuice-bad':'');
    burst.style.left = x + '%';
    burst.style.top = y + '%';
    parent.appendChild(burst);
    const flash=document.createElement('b');flash.className='juiceFlash';burst.appendChild(flash);
    const halo=document.createElement('b');halo.className='juiceHalo';burst.appendChild(halo);
    if(bad){const mark=document.createElement('b');mark.className='badMark';mark.textContent='×';burst.appendChild(mark);}
    const motion = burst.animate([{opacity:1},{opacity:1,offset:.65},{opacity:0}],{duration:bad?520:celebration?1150:strong ? 800 : 500});
    sharedEffects.add(motion);
    const cleanup = () => { sharedEffects.delete(motion); burst.remove(); };
    motion.onfinish = cleanup;
    motion.oncancel = cleanup;
    const count = bad?8:celebration?32:strong ? 20 : 10;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('i');
      spark.style.setProperty('--spark-angle', (i * 360 / count) + 'deg');
      spark.style.setProperty('--spark-travel',(bad?4+i%3:celebration?12+i%4*2:strong?8+i%3*2:5+i%3)+'cqw');
      spark.style.setProperty('--spark-wait',(i%4*18)+'ms');
      spark.style.setProperty('--spark-color',celebration?['#fff5b6','#ffd45a','#8cf2cd','#b7d9ff'][i%4]:'var(--juice)');
      burst.appendChild(spark);
    }
  }
  const distanceKnots = [0, 1].map(() => {
    const knot = document.createElement('i');
    knot.className = 'distanceKnot';
    knot.textContent = '✦';
    root.querySelector('.fishingTrack').appendChild(knot);
    return knot;
  });
  function spawnDistanceKnot(index) {
    const [min, max] = index === 0 ? [.23, .43] : [.66, .77];
    const old = game.knots[index]?.position;
    const unit = old === undefined ? Math.random() : ((old - min) / (max - min) + .4 + Math.random() * .2) % 1;
    const position = min + unit * (max - min);
    game.knots[index] = {position, respawnAt:0};
    distanceKnots[index].style.left = position * 100 + '%';
    distanceKnots[index].hidden = false;
  }
  function clearDistanceEffects() {
    distanceEffects.forEach(motion => motion.cancel());
    distanceEffects.clear();
    root.querySelectorAll('.distanceBurst,.distanceFloat,.distanceImpact').forEach(item => item.remove());
  }
  function distanceJuice(hit, perfect, meters) {
    clearDistanceEffects();
    scene.style.setProperty('--distance-color', hit ? perfect ? '#ffe49b' : '#a4f1be' : '#ffb1ae');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hud = root.querySelector('.fishingHud');
    const track = root.querySelector('.fishingTrack');
    const animate = (element, frames, options, temporary = false) => {
      const motion = element.animate(frames, options);
      distanceEffects.add(motion);
      const cleanup = () => { distanceEffects.delete(motion); if (temporary) element.remove(); };
      motion.onfinish = cleanup;
      motion.oncancel = cleanup;
    };
    animate(hud, hit ? [{scale:1},{scale:.98,offset:.12},{scale:perfect ? 1.06 : 1.035,offset:.35},{scale:1}]
      : [{transform:'translateX(0)'},{transform:'translateX(-4px)',offset:.2},{transform:'translateX(4px)',offset:.4},{transform:'translateX(-2px)',offset:.65},{transform:'translateX(0)'}],{duration:280,easing:'ease-out'});
    animate(title,[{scale:1},{scale:1.2,offset:.25},{scale:1}],{duration:300,easing:'ease-out'});
    const label = document.createElement('b');
    label.className = 'distanceFloat';
    label.textContent = (meters > 0 ? '−' : '+') + Math.abs(meters) + ' m';
    label.style.left = (game.marker * 100) + '%';
    track.appendChild(label);
    animate(label,[{translate:'-50% 0',opacity:0,scale:.6},{translate:'-50% -24px',opacity:1,scale:1.25,offset:.18},{translate:'-50% -30px',opacity:1,scale:1,offset:.65},{translate:'-50% -55px',opacity:0,scale:1}],{duration:850,easing:'ease-out'},true);
    if (!hit) return;
    const marker = root.querySelector('.fishingMarker');
    animate(marker,[{scale:1},{scale:perfect ? 1.7 : 1.4,offset:.2},{scale:1}],{duration:350,easing:'ease-out'});
    for (let ring = 0; ring < (perfect ? 2 : 1); ring++) {
      const impact = document.createElement('i');
      impact.className = 'distanceImpact';
      impact.style.left = (game.marker * 100) + '%';
      track.appendChild(impact);
      animate(impact,[{scale:.3,opacity:1},{scale:perfect ? 3.5 : 2.5,opacity:0}],{duration:450,delay:ring*65,easing:'ease-out'},true);
    }
    animate(track,[{filter:'brightness(1)'},{filter:perfect ? 'brightness(1.8)' : 'brightness(1.4)',offset:.2},{filter:'brightness(1)'}],{duration:300});
    const count = perfect ? 14 : 8;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('i');
      spark.className = 'distanceBurst';
      spark.style.left = (game.marker * 100) + '%';
      spark.style.background = perfect ? '#ffe49b' : '#a4f1be';
      track.appendChild(spark);
      const angle = i / count * Math.PI * 2;
      const travel = track.clientWidth * (perfect ? .10 : .065);
      animate(spark,[{translate:'-50% -50%',opacity:1,scale:1},{translate:`calc(-50% + ${Math.cos(angle)*travel}px) calc(-50% + ${Math.sin(angle)*travel}px)`,opacity:0,scale:0}],{duration:perfect ? 480 : 360,easing:'ease-out'},true);
    }
  }

  function circularJuice(quality) {
    haptic(quality);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const excellent = quality === 'excellent';
    const animate = (element, frames, options, transient = false) => {
      const motion = element.animate(frames, options);
      circularEffects.add(motion);
      const cleanup = () => { circularEffects.delete(motion); if (transient) element.remove(); };
      motion.onfinish = cleanup;
      motion.oncancel = cleanup;
    };
    animate(circularTarget, [{scale:1},{scale:excellent ? 1.09 : 1.04,offset:.25},{scale:1}], {duration:240,easing:'cubic-bezier(.16,1,.3,1)'});
    animate(circularCombo, [{scale:1},{scale:excellent ? 1.32 : 1.18,offset:.25},{scale:1}], {duration:260,easing:'cubic-bezier(.16,1,.3,1)'});
    const count = excellent ? 16 : 8;
    for (let index = 0; index < count; index++) {
      const angle = index / count * Math.PI * 2;
      const spark = document.createElement('i');
      spark.className = 'circularSpark';
      // Keep the hit color after the next round clears its judgement state.
      spark.style.setProperty('--hit-color', excellent ? '#ffe69c' : '#adffcb');
      spark.style.left = (50 + Math.cos(angle) * 48) + '%';
      spark.style.top = (50 + Math.sin(angle) * 48) + '%';
      circularDial.appendChild(spark);
      const distance = circularDial.clientWidth * (excellent ? .35 : .22);
      animate(spark, [{transform:'translate(-50%,-50%) scale(1)',opacity:1},
        {transform:`translate(calc(-50% + ${Math.cos(angle) * distance}px),calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`,opacity:0}],
        {duration:excellent ? 420 : 320,easing:'cubic-bezier(.1,.65,.3,1)'}, true);
    }
  }

  function updateCircular() {
    const playing = state === 'active';
    circularCombo.textContent = state === 'idle' ? '0' : String(game.combo);
    circularPrompt.textContent = playing ? '' : state === 'idle' ? 'FISH ON' : scene.hasAttribute('data-caught') ? 'CAUGHT' : 'ESCAPED';
    circularHint.textContent = playing || state === 'idle' ? '' : scene.hasAttribute('data-caught') ? 'NICE CATCH!' : 'TRY AGAIN SOON';
  }

  function judgeCircular(quality) {
    if (state !== 'active' || game.roundPause > 0) return;
    const good = quality !== 'bad';
    game.combo = good ? game.combo + 1 : 0;
    if (!good) game.misses++;
    scene.dataset.judgement = quality;
    status.textContent = quality.toUpperCase();
    game.roundPause = quality === 'excellent' ? .8 : good ? .45 : .65;
    updateCircular();
    if (good) {
      circularJuice(quality);
      hitJuice(50, 44, quality === 'excellent');
      impactPunch(circularDial,quality==='excellent');
      if(quality==='excellent')fireworks('excellent');
    } else {haptic('miss');badFeedback(circularDial);}
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      circularMotion?.cancel();
      circularMotion = status.animate([{opacity:0,scale:.82},{opacity:1,scale:1.08,offset:.35},{opacity:1,scale:1}],{duration:quality === 'excellent' ? 360 : 280,easing:'ease-out'});
    }
    if (game.combo >= 3) finish(true);
    else if (game.misses >= 4) finish(false);
  }

  function rodEdge(progress) {
    return [183 - 66 * progress, 81 + 168 * progress,
      188 - 42 * progress, 83 + 167 * progress];
  }

  const widthPresets = {
    mixed: [.032, .047, .037, .053, .041],
    thin: [.024],
    thick: [.075],
    alternating: [.024, .075],
    rising: [.024, .036, .050, .063, .075]
  };
  let jointWidths = widthPresets.mixed;
  const jointHalfWidth = index => jointWidths[index % jointWidths.length] / 2;
  let tapsPerJoint = 5;
  const decayDelay = .35;
  const decayRate = .13;
  let holdPress = false;

  function buildJoints() {
    const count = Number(jointCount.value);
    jointWidths = widthPresets[jointThickness.value];
    stops = count === 3 ? [.15, .40, .72] : Array.from({length:count}, (_, i) => (i + 1) / (count + 1));
    holdJoints = stops.map((progress, index) => {
      const joint = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const [left, top, right, bottom] = rodEdge(progress - jointHalfWidth(index));
      const [endLeft, endTop, endRight, endBottom] = rodEdge(progress + jointHalfWidth(index));
      joint.classList.add('fishingHoldJoint');
      joint.dataset.progress = progress;
      joint.setAttribute('d', 'M' + left + ' ' + top + 'L' + right + ' ' + bottom + 'L' + endRight + ' ' + endBottom + 'L' + endLeft + ' ' + endTop + 'Z');
      return joint;
    });
    jointLayer.replaceChildren(...holdJoints);
  }

  function drawHoldFill(progress) {
    const [left, top, right, bottom] = rodEdge(progress);
    holdFill.setAttribute('d', 'M183 81L188 83L' + right + ' ' + bottom + 'L' + left + ' ' + top + 'Z');
    holdJoints.forEach((joint, index) => {
      const threshold = Number(joint.dataset.progress);
      if (progress < threshold + jointHalfWidth(index) || joint.classList.contains('is-broken')) return;
      joint.classList.add('is-broken');
      haptic('break');
      const [hitX, hitY, hitRight] = rodEdge(threshold);
      hitJuice((hitX + hitRight) / 2 / 640 * 100 + 23.4, hitY / 360 * 100 - 2.5, true);
      if (!debris || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const [x, y, edge] = rodEdge(threshold);
      for (const direction of [-1, 1]) {
        const chip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const center = direction < 0 ? x : edge;
        chip.setAttribute('d', 'M' + center + ' ' + y + 'l5 2 -2 3 -5 -2Z');
        chip.setAttribute('fill', '#eee1c4');
        debris.appendChild(chip);
        chip.animate([
          {transform:'translate(0,0)', opacity:1},
          {transform:'translate(' + (direction * 15) + 'px,9px)', opacity:0}
        ], {duration:300,easing:'ease-out'}).onfinish = () => chip.remove();
      }
    });
  }
  const modes = Array.from(root.querySelectorAll('[data-fishing-mode]'));
  function qteInstruction(){const r=window.GenConfig.rules,p=n=>n.toLocaleString('vi-VN',{maximumFractionDigits:2})+'%';return 'Bấm 1 lần để nhận cá. Xanh '+p(r.green)+', vàng '+p(r.gold)+', đỏ '+p(r.red)+' nhận Gen · tối đa 1 Gen.';}
  const instructions = [
    'Hold to the next joint, then tap to break it. Hold again after breaking a joint to keep the bar from draining.',
    'Hold to pull toward Catch. Release to cool the line.',
    'Use the TAP button when the gold ring overlaps the blue target. Build a combo of 3 to catch the fish.',
    'Tap when the fish enters either green zone. Reel the distance down to 0 m before 40 seconds run out.',
    'Hold to lift the green zone. Release to lower it. Keep the fish inside.',
    'Hold to reel, then release before tension reaches its limit.',
    qteInstruction()
  ];
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  let mode = 0, state = 'idle', held = false, frame, timer, game;
  function syncDebug() {
    const config = debugModes[mode];
    debugPanel.querySelector('.debugModeLabel span').textContent = config.label;
    debugModeValue.replaceChildren(...config.options.map(([value,label])=>{
      const option = document.createElement('option');option.value=value;option.textContent=label;return option;
    }));
    debugModeValue.value=String(debugSettings.values[mode]);
    debugPauseButton.textContent=debugPaused ? 'Tiếp tục' : 'Tạm dừng';
    debugPauseButton.setAttribute('aria-pressed',String(debugPaused));
    debugPanel.querySelector('[data-debug="step"]').disabled=!debugPaused;
    debugPanel.querySelector('[data-debug="shuffle"]').hidden=![2,3,6].includes(mode);
    updateDebugReadout();
  }
  function updateDebugReadout() {
    debugReadout.dataset.time=state==='active'?game.age.toFixed(3):'';
    debugReadout.textContent = 'Tab '+(mode+1)+' · '+(state==='idle'?'Sẵn sàng':state==='result'?'Kết quả':debugPaused?'Tạm dừng':'Đang chạy')+(state==='active'?' · '+game.age.toFixed(1)+'s · Combo '+game.combo:'');
  }
  function renderPreview() {
    status.textContent='';
    scene.dataset.preview='';
    button.setAttribute('aria-label',mode===0||mode===4?'Hold to start fishing':'Tap to start fishing');
    scene.style.setProperty('--angle','0deg');
    scene.style.setProperty('--marker',mode===4?'48%':'0%');
    scene.style.setProperty('--zone-start',mode===4 ? (60-debugSettings.values[4]*50)+'%' : '18%');
    scene.style.setProperty('--zone-size',mode===4 ? debugSettings.values[4]*100+'%' : '30%');
    scene.style.setProperty('--distance-left','100%');
    if(mode===0)status.textContent='HOLD TO START';
    if(mode===3){
      title.textContent='35 m';detail.textContent='40 s · TAP TO START';
      distanceKnots.forEach((knot,index)=>{knot.style.left=(index===0?'33%':'71.5%');knot.hidden=false;});
    }
    if(mode===4){title.textContent='KEEP FISH IN GREEN';detail.textContent='Hold ↑ · Release ↓';}
    if(mode===6){scene.dataset.timing='';scene.style.setProperty('--ring-start','57.6deg');scene.style.setProperty('--ring-fill','20%');}
    updateDebugReadout();
  }

  function finish(caught, reason, reveal=false) {
    if(state!=='active')return;
    if(caught&&mode===6&&!reveal){
      state='settling';held=false;holdPress=false;
      cancelAnimationFrame(frame);
      delete scene.dataset.holding;
      delete scene.dataset.tapping;
      scene.dataset.revealing='';
      timer=setTimeout(()=>{
        if(state!=='settling')return;
        delete scene.dataset.revealing;
        state='active';finish(caught,reason,true);
      },350);
      return;
    }
    if(caught&&mode===6){
      const pending=rewards.resolve({mutationPoints:game.mutationPoints,results:game.qteResults});
      game.mutationPoints=pending.mutationPoints;game.mutationRewards=pending.mutationRewards;game.mutations=pending.mutationRewards.length;
      renderMutation(true);
      const detail={mode:7,mutationPoints:game.mutationPoints,mutations:game.mutations,mutationRewards:game.mutationRewards.map(reward=>({...reward})),results:[...game.qteResults]};
      root.dispatchEvent(new CustomEvent('fishingcatch',{bubbles:true,detail:{...detail,catch:pending}}));
    }
    haptic(caught ? 'catch' : mode===6 ? 'fail' : reason === 'LINE BROKE' ? 'break' : 'miss');
    state = 'result';
    held = false;
    holdPress = false;
    cancelAnimationFrame(frame);
    delete scene.dataset.active;
    delete scene.dataset.ring;
    delete scene.dataset.holding;
    delete scene.dataset.tapping;
    delete scene.dataset.decaying;
    scene.toggleAttribute('data-caught', caught);
    if (caught && [0, 2, 4, 6].includes(mode)) {
      hitJuice(50, 44, 'catch');
      stopFireworks();fireworks('catch');
      impactPunch(mode===2?circularDial:root.querySelector(mode===6?'.qteCenter':'.fishingHud'),true);
    }
    status.textContent = caught ? 'ĐÃ BẮT ĐƯỢC CÁ!' : reason || 'FISH ESCAPED';
    if(caught)impactPunch(status,true);
    if (mode === 2) updateCircular();
    if(!rewards.pending)timer = setTimeout(reset, caught ? 2800 : 1500);
    updateDebugReadout();
  }

  function reset() {
    rewards.cancelCast();
    window.RevivalAudio?.stop();
    stopFireworks();
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    state = 'idle';
    delete scene.dataset.fishRarity;
    scene.style.removeProperty('--qte-fish-color');
    scene.style.removeProperty('--qte-fish-fin');
    delete scene.dataset.revealing;
    debugPaused=false;
    delete scene.dataset.caught;
    stopHaptic();
    held = false;
    holdPress = false;
    status.textContent = '';
    delete scene.dataset.active;
    delete scene.dataset.ring;
    delete scene.dataset.timing;
    delete scene.dataset.holding;
    delete scene.dataset.tapping;
    delete scene.dataset.decaying;
    delete scene.dataset.judgement;
    circularMotion?.cancel();
    circularEffects.forEach(motion => motion.cancel());
    circularEffects.clear();
    qteMotion?.cancel();
    delete scene.dataset.zoneInside;
    delete scene.dataset.qteHit;
    delete scene.dataset.distanceHit;
    delete scene.dataset.distanceBonus;
    root.querySelector('.fishingHud').dataset.bonusLabel = 'BONUS 0';
    distanceKnots.forEach(knot => knot.hidden = true);
    clearDistanceEffects();
    sharedEffects.forEach(motion => motion.cancel());
    sharedEffects.clear();
    impactMotions.forEach(motion=>motion.cancel());impactMotions.clear();
    root.querySelectorAll('.gameJuice').forEach(burst => burst.remove());
    qtePips.forEach(pip => {pip.classList.remove('is-filled');delete pip.dataset.result;});
    catchPercent.textContent = '0%';
    scene.style.setProperty('--catch-progress', '0%');
    root.querySelectorAll('.circularSpark').forEach(spark => spark.remove());
    tapMotion?.cancel();
    holdJoints.forEach(joint => joint.classList.remove('is-broken', 'is-target'));
    debris?.replaceChildren();
    drawHoldFill(0);
    scene.style.removeProperty('--hold-angle');
    button.setAttribute('aria-label', 'Tap to fish');
    updateCircular();
    scene.style.setProperty('--timing-scale', '1.65');
    if(game){game.mutationPoints=0;game.mutations=0;}
    renderMutation();
    renderPreview();
    syncDebug();
    restorePendingCatch();
  }

  function restorePendingCatch(){
    const pending=rewards.pending;
    if(!pending)return;
    applyFishRarity(pending.rarity);
    state='result';game={mutationPoints:pending.mutationPoints,mutationRewards:pending.mutationRewards,mutations:pending.mutationRewards.length,qteResults:pending.results};
    qtePips.forEach((pip,index)=>{pip.dataset.result=pending.results[index];pip.classList.add('is-filled');});
    renderMutation(true);status.textContent='KẾT QUẢ ĐANG CHỜ';scene.dataset.caught='';rewards.render();
    updateDebugReadout();
  }
  root.addEventListener('fishingofferresolved',()=>{haptic('tap');reset();});

  function applyFishRarity(rarity){
    const timing=window.FishingConfig.mechanic.rarityTiming[rarity]||window.FishingConfig.mechanic.rarityTiming.COMMON;
    scene.dataset.fishRarity=rarity;
    scene.style.setProperty('--qte-fish-color',timing.color);
    scene.style.setProperty('--qte-fish-fin',timing.finColor);
    return timing;
  }
  function startChallenge() {
    if (mode !== 6) return;
    const error=rewards.begin();
    if(error){status.textContent=error;return;}
    const fishTiming=applyFishRarity(rewards.castRarity);
    state = 'active';
    delete scene.dataset.preview;
    scene.dataset.active = '';
    if ([0, 2, 5, 6].includes(mode)) scene.dataset.ring = '';
    if (mode === 2 || mode === 6) scene.dataset.timing = '';
    status.textContent = 'FISH ON!';
    game = {age:0, last:performance.now(), phase:0, tapping:false, phaseTime:0, progress:0, idleTime:0,
      position:.42, tension:0, distance:mode === 3 ? 35 : 25, zone:.60, fish:.48, marker:0, hits:0, misses:0, combo:0,
      roundAge:0, roundPause:0, timingScale:1.65, roundSpeed:circularSpeed(), distancePhase:0, distanceFreezeUntil:0,
      qteSecondsPerRevolution:fishTiming.secondsPerRevolution,
      qteArcStart:Math.random(), mutationPoints:0, mutations:0, qteResults:[], knots:[], bonusScore:0};
    if (mode === 3) [0, 1].forEach(spawnDistanceKnot);
    if (mode === 3 || mode === 6) status.textContent='';
    if (mode === 6) {
      renderMutation();
      scene.style.setProperty('--ring-start', game.qteArcStart * 360 + 'deg');
      scene.style.setProperty('--angle', '0deg');
    }
    if (mode === 2) { status.textContent = ''; scene.style.setProperty('--timing-scale', '1.65'); }
    button.setAttribute('aria-label', instructions[mode]);
    if (mode === 2) updateCircular();
    frame = requestAnimationFrame(tick);
  }

  function tap() {
    if (debugPaused) return;
    if (holdPress) {
      holdPress = false;
      return;
    }
    if (state === 'idle') {
      haptic('tap');
      startChallenge();
      return;
    }
    if (state !== 'active') return;
    if (mode === 3 && game.age < game.distanceFreezeUntil) return;
    if (mode === 2) {
      const error = Math.abs(game.timingScale - 1);
      judgeCircular(error <= .055 ? 'excellent' : error <= .15 ? 'good' : 'bad');
      return;
    }
    if (mode === 0 && game.tapping) {
      const stop = stops[game.phase];
      const halfWidth = jointHalfWidth(game.phase);
      const farEdge = stop + halfWidth;
      game.progress = Math.min(farEdge, game.progress + 2 * halfWidth / tapsPerJoint + 1e-10);
      game.idleTime = 0;
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        tapMotion?.cancel();
        tapMotion = rod.animate([
          {rotate:'0deg'},
          {rotate:'-4deg',offset:.24},
          {rotate:'1.5deg',offset:.62},
          {rotate:'0deg'}
        ], {duration:210,easing:'ease-out'});
      }
      if (game.progress === farEdge) {
        game.progress = stop + halfWidth;
        game.phase++;
        game.tapping = false;
      }
      game.phaseTime = 0;
      drawHoldFill(game.progress);
      return;
    }
    if (![2, 3, 6].includes(mode)) return;
    const [start, end] = mode === 3 ? (game.marker < .55 ? [.18,.48] : [.61,.82]) : [.16,.36];
    const timingResult=mode===6?window.GenCore.timingResult(game.marker,game.qteArcStart):null;
    const gold = timingResult==='gold';
    const hit = mode === 6 ? timingResult!=='red' : game.marker >= start && game.marker <= end;
    const perfect = mode===6 ? gold : hit && Math.abs(game.marker - (start + end) / 2) < .045;
    const distanceBefore = game.distance;
    if (hit) {
      game.combo++;
      game.hits += mode === 2 && perfect ? 2 : 1;
      game.distance = Math.max(0, game.distance - (mode === 3 ? perfect ? 7 : 5 : perfect ? 10 : 7));
    } else {
      game.combo = 0;
      game.misses++;
      game.hits = Math.max(0, game.hits - 1);
      game.distance = Math.min(mode === 3 ? 35 : 32, game.distance + (mode === 3 ? 3 : 4));
    }
    status.textContent = hit ? (mode === 6 ? 'HIT' : perfect ? 'PERFECT' : 'GOOD') : 'MISS';
    if (mode === 3) {
      let bonus = false;
      if (hit) game.knots.forEach((knot, index) => {
        if (!knot.respawnAt && Math.abs(game.marker - knot.position) <= .035) {
          bonus = true;
          game.bonusScore += 100;
          knot.respawnAt = game.age + .85;
          distanceKnots[index].hidden = true;
        }
      });
      scene.toggleAttribute('data-distance-bonus', bonus);
      root.querySelector('.fishingHud').dataset.bonusLabel = 'BONUS ' + game.bonusScore;
      scene.dataset.distanceHit = hit ? 'hit' : 'miss';
      scene.style.setProperty('--distance-left', Math.round(game.distance / 35 * 100) + '%');
      title.textContent = game.distance + ' m';
      game.distanceFeedbackUntil = game.age + .9;
      game.distanceFreezeUntil = game.age + (hit ? perfect ? .16 : .11 : .07);
      status.textContent = bonus ? 'KNOT BONUS +100' : hit ? (perfect ? 'PERFECT!' : 'GOOD!') : 'MISS!';
      distanceJuice(hit, perfect || bonus, distanceBefore - game.distance);
      if (bonus) hitJuice(game.marker * 100, 50, true, root.querySelector('.fishingTrack'));
      haptic(hit ? bonus ? 'bonus' : perfect ? 'excellent' : 'good' : 'miss');
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        qteMotion?.cancel();
        qteMotion = status.animate([{scale:.85,opacity:.4},{scale:1.08,opacity:1,offset:.35},{scale:1,opacity:1}],{duration:240,easing:'ease-out'});
      }
    }
    if (mode === 6) {
      scene.dataset.qteHit = gold ? 'gold' : hit ? 'hit' : 'miss';
      game.qteResults.push(gold ? 'gold' : hit ? 'green' : 'red');
      game.mutationPoints=window.GenCore.points(game.qteResults);
      renderMutation();
      game.qteFeedbackUntil=game.age+(gold? .85 : hit? .45 : .65);
      if(hit){
        status.textContent=gold?'EXCELLENT!':'GOOD!';impactPunch(qteLuckChip,gold);
        if(gold&&game.qteResults.length<window.GenConfig.rules.taps)luckMotes(qteHitPoint());impactPunch(status,gold);
      }
      qtePips.forEach((pip, index) => {
        pip.classList.toggle('is-filled', index < game.qteResults.length);
        if(game.qteResults[index])pip.dataset.result=game.qteResults[index];
      });
      impactPunch(qtePips[game.qteResults.length-1],gold);
      haptic(gold ? 'bonus' : hit ? 'good' : 'fail');
      if (hit) {
        const point=qteHitPoint();hitJuice(point.x,point.y,gold);
      }
      if(hit)impactPunch(root.querySelector('.fishingRing'),gold);
      if(hit&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
        const contact=document.createElement('span');contact.className='qteContact'+(gold?' qteContact-gold':'');
        contact.style.transform='rotate('+(game.marker*360)+'deg)';contact.appendChild(document.createElement('b'));
        root.querySelector('.fishingRing').appendChild(contact);
        const contactMotion=contact.animate([{opacity:1},{opacity:0}],{duration:gold?500:280,easing:'ease-out'});
        sharedEffects.add(contactMotion);
        const cleanContact=()=>{sharedEffects.delete(contactMotion);contact.remove();};
        contactMotion.onfinish=cleanContact;contactMotion.oncancel=cleanContact;
        impactPunch(root.querySelector('.qteFishIcon'),gold);
      }
      if(gold)fireworks('excellent');
      if(!hit)badFeedback(root.querySelector('.qteCenter'));
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        qteMotion?.cancel();
        qteMotion = root.querySelector('.qteCenter').animate([{scale:.97},{scale:gold?1.10:1.025,offset:.3},{scale:1}],{duration:gold?320:180,easing:'cubic-bezier(.16,1,.3,1)'});
      }
      if (hit && game.qteResults.length < window.GenConfig.rules.taps) {
        game.qteArcStart = (game.qteArcStart + .25 + Math.random() * .5) % 1;
        scene.style.setProperty('--ring-start', game.qteArcStart * 360 + 'deg');
      }
    }
    if (mode === 6) {
      if(game.qteResults.length===window.GenConfig.rules.taps)finish(true);
      return;
    }
    if ((mode === 3 && game.distance === 0) || (mode !== 3 && game.hits >= 5)) finish(true);
    else if (mode !== 3 && game.misses >= 4) finish(false);
  }

  function draw(label, hint, marker, zoneStart, zoneSize, ringFill = 0, ringStart = 0, color = '#57d594') {
    title.textContent = label;
    detail.textContent = hint;
    scene.style.setProperty('--marker', (clamp(marker) * 100) + '%');
    scene.style.setProperty('--zone-start', (zoneStart * 100) + '%');
    scene.style.setProperty('--zone-size', (zoneSize * 100) + '%');
    scene.style.setProperty('--ring-fill', (ringFill * 100) + '%');
    scene.style.setProperty('--ring-start', ringStart + 'deg');
    scene.style.setProperty('--ring-color', color);
    scene.style.setProperty('--angle', (game.marker * 360) + 'deg');
  }

  function tick(now) {
    if (state !== 'active' || debugPaused) return;
    const dt = Math.min(.05, (now - game.last) / 1000) * debugSettings.speed;
    game.last = now;
    game.age += dt;
    game.phaseTime += dt;
    if (mode !== 6 && game.age >= (mode === 3 ? 40 : 22)) { finish(false, mode === 3 ? 'TIME UP' : undefined); return; }
    switch (mode) {
      case 0: {
        const stop = stops[game.phase];
        const limit = stop === undefined ? 1 : stop - jointHalfWidth(game.phase);
        if (!game.tapping && held) {
          game.progress = Math.min(limit, game.progress + dt * .29);
          if (game.progress >= limit) {
            if (stop === undefined) {
              drawHoldFill(1);
              finish(true);
              return;
            }
            game.tapping = true;
            haptic('good');
            game.phaseTime = 0;
          }
        }
        const pulling = !game.tapping && held;
        game.idleTime = pulling || game.tapping ? 0 : game.idleTime + dt;
        const decaying = !game.tapping && game.idleTime > decayDelay && game.progress > 0;
        if (decaying) game.progress = Math.max(0, game.progress - dt * decayRate);
        scene.toggleAttribute('data-decaying', decaying);
        scene.toggleAttribute('data-holding', pulling);
        scene.toggleAttribute('data-tapping', game.tapping);
        holdJoints.forEach((joint, index) => joint.classList.toggle('is-target', game.tapping && index === game.phase));
        drawHoldFill(game.progress);
        scene.style.setProperty('--hold-angle', (game.progress * 235) + 'deg');
        const tapsLeft = game.tapping
          ? Math.ceil((stop + jointHalfWidth(game.phase) - game.progress) / (2 * jointHalfWidth(game.phase)) * tapsPerJoint - 1e-8)
          : 0;
        const prompt = game.tapping ? 'TAP · ' + tapsLeft + ' LEFT' : 'HOLD';
        if (status.textContent !== prompt) status.textContent = prompt;
        if (game.phaseTime > 7) finish(false);
        break;
      }
      case 1:
        game.tension = clamp(game.tension + dt * (held ? .46 : -.80));
        game.position = clamp(game.position + dt * ((held ? .34 : -.22) - .10 * Math.sin(game.age * 5)));
        draw('ESCAPE → CATCH', 'Line tension ' + Math.round(game.tension * 100) + '%', game.position, .90, .10);
        if (game.position >= .90) finish(true);
        else if (game.tension >= 1 || game.position === 0) finish(false, game.tension >= 1 ? 'LINE BROKE' : 'FISH ESCAPED');
        break;
      case 2: {
        if (game.roundPause > 0) {
          game.roundPause = Math.max(0, game.roundPause - dt);
          if (game.roundPause === 0) {
            game.roundAge = 0;
            game.roundSpeed = circularSpeed();
            game.timingScale = 1.65;
            scene.style.setProperty('--timing-scale', game.timingScale);
            status.textContent = '';
            delete scene.dataset.judgement;
          }
        } else {
          game.roundAge += dt;
          game.timingScale = Math.max(.45, 1.65 - game.roundAge * game.roundSpeed);
          scene.style.setProperty('--timing-scale', game.timingScale);
          if (game.timingScale <= .65) judgeCircular('bad');
        }
        break;
      }
      case 6: {
        if(game.qteFeedbackUntil&&game.age>game.qteFeedbackUntil){delete scene.dataset.qteHit;status.textContent='';game.qteFeedbackUntil=0;}
        game.marker = (game.age / (game.qteSecondsPerRevolution * debugSettings.values[6] / 2.25)) % 1;
        renderMutation(false,window.GenConfig.rules[window.GenCore.timingResult(game.marker,game.qteArcStart)]);
        draw(game.qteResults.length + ' / '+window.GenConfig.rules.taps+' tap', 'Green: Good · Gold: Excellent · Red: Miss', game.qteResults.length / window.GenConfig.rules.taps, 0, 0, .20, game.qteArcStart * 360);
        break;
      }
      case 3:
        game.knots.forEach((knot, index) => {
          if (knot.respawnAt && game.age >= knot.respawnAt) spawnDistanceKnot(index);
        });
        if (game.distanceFeedbackUntil && game.age > game.distanceFeedbackUntil) {
          delete scene.dataset.distanceHit;
          delete scene.dataset.distanceBonus;
          status.textContent = '';
          game.distanceFeedbackUntil = 0;
        }
        if (game.age >= game.distanceFreezeUntil) game.distancePhase += dt * debugSettings.values[3];
        game.marker = (1 - Math.cos(game.distancePhase)) / 2;
        scene.style.setProperty('--distance-left', Math.round(game.distance / 35 * 100) + '%');
        draw(Math.ceil(game.distance) + ' m', Math.ceil(40 - game.age) + ' s · TAP IN GREEN', game.marker, .18, .30);
        break;
      case 4: {
        const zoneSize = debugSettings.values[4];
        game.zone = clamp(game.zone + dt * (held ? -.63 : .49), zoneSize/2, 1-zoneSize/2);
        game.fish = .5 + .28 * Math.sin(game.age * 1.9) + .09 * Math.sin(game.age * 4.1);
        const inside = Math.abs(game.fish - game.zone) < zoneSize/2;
        game.progress = clamp(game.progress + dt * (inside ? .28 : -.12));
        const milestone = Math.floor(game.progress * 4);
        if (inside && ((!game.zoneWasInside && game.age - (game.lastZoneJuice || -1) > .65) || milestone > (game.zoneMilestone || 0))) {
          impactPunch(root.querySelector('.catchProgress'),milestone > (game.zoneMilestone || 0));
          haptic('good');
          game.lastZoneJuice = game.age;
        }
        game.zoneWasInside = inside;
        game.zoneMilestone = Math.max(game.zoneMilestone || 0, milestone);
        scene.toggleAttribute('data-zone-inside', inside);
        scene.style.setProperty('--catch-progress', Math.round(game.progress * 100) + '%');
        catchPercent.textContent = Math.round(game.progress * 100) + '%';
        draw(Math.round(game.progress * 100) + '% caught', inside ? 'In zone' : 'Hold up · release down', game.fish, game.zone - zoneSize/2, zoneSize);
        if (game.progress >= 1) finish(true);
        break;
      }
      case 5:
        game.tension = clamp(game.tension + dt * (held ? .55 + .13 * Math.sin(game.age * 4) : -.70));
        game.distance = clamp(game.distance + dt * (held ? -10 : 3), 0, 32);
        draw(Math.ceil(game.distance) + ' m', game.tension > .74 ? 'RELEASE!' : 'Hold to reel', game.tension, 0, game.tension, game.tension, 0, game.tension > .74 ? '#ff6767' : game.tension > .48 ? '#ffd46d' : '#57d594');
        if (game.tension >= 1) finish(false, 'LINE BROKE');
        else if (game.distance === 0) finish(true);
        break;
    }
    if (debugPanel.open && Math.floor(game.age*5)!==game.debugReadoutFrame){game.debugReadoutFrame=Math.floor(game.age*5);updateDebugReadout();}
    if (state === 'active') frame = requestAnimationFrame(tick);
  }

  function select(index) {
    if (index !== 6 || !debugModes[index]) return;
    reset();
    mode = index;
    debugControls.hidden = index !== 0;
    scene.dataset.mode = String(index);
    if (index === 2) {
      scene.style.setProperty('--angle', '0deg');
      updateCircular();
    }
    root.querySelector('.fishingInstructions').textContent = instructions[index];
    modes.forEach(item => item.setAttribute('aria-pressed', String(Number(item.dataset.fishingMode) === index)));
    renderPreview();
    syncDebug();
  }

  modes.forEach(item => item.addEventListener('click', () => select(Number(item.dataset.fishingMode))));
  modes.forEach(item=>{
    if(Number(item.dataset.fishingMode)!==6){
      item.disabled=true;
      item.setAttribute('aria-disabled','true');
      item.textContent+=' · 🔒';
      item.title='Mode đang khóa';
    }
  });
  debugPanel.addEventListener('toggle',updateDebugReadout);
  debugPanel.querySelector('.debugSpeed').addEventListener('change',event=>{
    debugSettings.speed=Number(event.target.value);
  });
  debugModeValue.addEventListener('change',()=>{
    debugSettings.values[mode]=Number(debugModeValue.value);
    tapsPerJoint=debugSettings.values[0];
    reset();
  });
  debugPanel.addEventListener('click',event=>{
    const action=event.target.closest('[data-debug]')?.dataset.debug;
    if(!action)return;
    if(action==='restart'){reset();startChallenge();}
    if(action==='defaults'){
      if(game){game.mutationPoints=0;game.mutations=0;}renderMutation();
      debugSettings.speed=1;
      Object.assign(debugSettings.values,{0:5,2:0,3:2.3,4:.30,6:2.25});
      tapsPerJoint=5;jointCount.value='3';jointThickness.value='mixed';buildJoints();
      debugPanel.querySelector('.debugSpeed').value='1';reset();
    }
    if(action==='pause'){
      if(state==='result')return;
      if(state==='idle')startChallenge();
      if(state!=='active')return;
      debugPaused=!debugPaused;held=false;holdPress=false;stopHaptic();cancelAnimationFrame(frame);
      if(!debugPaused){game.last=performance.now();frame=requestAnimationFrame(tick);}
    }
    if(action==='step'&&debugPaused&&state==='active'){
      debugPaused=false;tick(game.last+1000/30);cancelAnimationFrame(frame);debugPaused=state==='active';
    }
    if(action==='win'||action==='lose'){
      if(state!=='active'){reset();startChallenge();}
      if(state!=='active')return;
      if(action==='win'){
        if(mode===2)game.combo=3;
        if(mode===3){game.distance=0;title.textContent='0 m';scene.style.setProperty('--distance-left','0%');}
        if(mode===4){game.progress=1;title.textContent='100% caught';catchPercent.textContent='100%';scene.style.setProperty('--catch-progress','100%');}
        if(mode===6){game.hits=1;game.mutationPoints=window.GenConfig.rules.green;game.qteResults=['green'];qtePips.forEach(pip=>{pip.classList.add('is-filled');pip.dataset.result='green';});}
      }
      finish(action==='win',action==='lose'?'DEBUG · FISH ESCAPED':undefined);
    }
    if(action==='shuffle'){
      if(state!=='active'){reset();startChallenge();}
      if(state!=='active')return;
      if(mode===3)[0,1].forEach(spawnDistanceKnot);
      if(mode===2){game.roundAge=0;game.roundPause=0;game.roundSpeed=circularSpeed();game.timingScale=1.65;scene.style.setProperty('--timing-scale','1.65');delete scene.dataset.judgement;status.textContent='';}
      if(mode===6){game.qteArcStart=Math.random();scene.style.setProperty('--ring-start',game.qteArcStart*360+'deg');delete scene.dataset.qteHit;}
    }
    syncDebug();
  });
  button.addEventListener('click',event=>{
    if(event.detail!==0&&performance.now()-lastTouchAction<500){event.preventDefault();return;}
    tap();
  });
  button.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    actionPointer=event.pointerId;
    if(event.pointerType!=='mouse')window.getSelection()?.removeAllRanges();
    if (state !== 'result') haptic();
    if(state==='idle'&&(mode===0||mode===4))startChallenge();
    held = state === 'active' && !debugPaused;
    holdPress = held && mode === 0 && !game.tapping;
    button.setPointerCapture(event.pointerId);
  },{passive:false});
  button.addEventListener('pointerup',event=>{
    if(event.pointerId!==actionPointer)return;
    held=false;actionPointer=null;
    if(event.pointerType==='touch'||event.pointerType==='pen'){
      event.preventDefault();lastTouchAction=performance.now();tap();
    }
  },{passive:false});
  button.addEventListener('pointercancel',()=>{actionPointer=null;holdPress=false;});
  ['pointerup','pointercancel','lostpointercapture','blur'].forEach(event => button.addEventListener(event, () => { held = false; }));
  button.addEventListener('keydown', event => {
    if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
      if(state==='idle'&&(mode===0||mode===4))startChallenge();
      held = state === 'active' && !debugPaused;
      holdPress = held && mode === 0 && !game.tapping;
    }
    if (event.repeat && (event.key === ' ' || event.key === 'Enter')) event.preventDefault();
  });
  button.addEventListener('keyup', () => { held = false; });
  window.addEventListener('blur',()=>{held=false;holdPress=false;stopHaptic();});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)stopFireworks();
    held=false; holdPress=false; stopHaptic();
    if (state !== 'active') return;
    cancelAnimationFrame(frame);
    if (!document.hidden && !debugPaused) { game.last=performance.now(); frame=requestAnimationFrame(tick); }
  });
  document.querySelectorAll('.prototypeTabs button').forEach(item => item.addEventListener('click', () => {
    if (item.dataset.tab !== 'tab-fishing') reset();
  }));
  [jointCount, jointThickness].forEach(control => {
    control.addEventListener('change', () => {
      reset();
      buildJoints();
    });
  });
  buildJoints();
  select(6);
  restorePendingCatch();
})();
