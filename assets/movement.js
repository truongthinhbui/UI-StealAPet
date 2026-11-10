(function(global){
  'use strict';
  const W=960,H=540,R=12;
  const walls=[{x:250,y:0,w:24,h:330},{x:490,y:210,w:24,h:330},{x:730,y:0,w:24,h:330}];
  const gems=[{x:145,y:150},{x:390,y:420},{x:625,y:125}],exit={x:865,y:410};
  function create(){return {x:80,y:430,time:60,age:0,cooldown:0,dash:0,dx:1,dy:0,collected:[],hits:0,status:'ready'};}
  function hazards(age){return [{x:140+Math.sin(age*1.4)*70,y:290},{x:390,y:255+Math.sin(age*1.6)*100},{x:620+Math.sin(age*1.3)*65,y:300},{x:850,y:220+Math.sin(age*1.7)*80}];}
  function blocked(x,y){return walls.some(w=>x+R>w.x&&x-R<w.x+w.w&&y+R>w.y&&y-R<w.y+w.h);}
  function step(s,dt,input={}){
    if(s.status!=='playing')return s;
    dt=Math.max(0,Math.min(dt,.05));s.time=Math.max(0,s.time-dt);s.age+=dt;s.cooldown=Math.max(0,s.cooldown-dt);
    let x=(input.right?1:0)-(input.left?1:0),y=(input.down?1:0)-(input.up?1:0),len=Math.hypot(x,y);
    if(len){x/=len;y/=len;s.dx=x;s.dy=y;}
    if(input.dash&&s.cooldown===0){s.dash=.14;s.cooldown=1.25;}
    const dashing=s.dash>0,speed=dashing?540:185;s.dash=Math.max(0,s.dash-dt);
    if(dashing){x=s.dx;y=s.dy;}
    const distance=speed*dt,parts=Math.max(1,Math.ceil(distance/4));
    for(let i=0;i<parts;i++){const nx=Math.max(R,Math.min(W-R,s.x+x*distance/parts)),ny=Math.max(R,Math.min(H-R,s.y+y*distance/parts));if(!blocked(nx,s.y))s.x=nx;if(!blocked(s.x,ny))s.y=ny;}
    for(let i=0;i<gems.length;i++)if(!s.collected.includes(i)&&Math.hypot(s.x-gems[i].x,s.y-gems[i].y)<27)s.collected.push(i);
    if(hazards(s.age).some(h=>Math.hypot(s.x-h.x,s.y-h.y)<27)){s.x=80;s.y=430;s.dash=0;s.hits++;s.time=Math.max(0,s.time-3);}
    if(s.time<=0)s.status='lost';else if(s.collected.length===gems.length&&Math.hypot(s.x-exit.x,s.y-exit.y)<35)s.status='won';
    return s;
  }
  global.MovementGameCore={W,H,R,walls,gems,exit,create,step,hazards,blocked};
  if(typeof document==='undefined')return;
  const root=document.getElementById('tab-movement');if(!root)return;
  root.innerHTML=`<header class="movementHead"><div><span class="movementEyebrow">PLAYGROUND / 01</span><h2>Movement Mini Game</h2><p>Thu thập 3 tinh thể, né chướng ngại và đến cổng trong 60 giây.</p></div><div class="movementStats"><span><small>Thời gian</small><strong data-stat="time">60.0s</strong></span><span><small>Tinh thể</small><strong data-stat="gems">0 / 3</strong></span><span><small>Dash</small><strong data-stat="dash">Sẵn sàng</strong></span></div></header><div class="movementStage"><canvas width="960" height="540" tabindex="0" aria-label="Sân chơi di chuyển. Dùng WASD hoặc phím mũi tên; Space để dash."></canvas><div class="movementMessage" aria-live="polite"><div><h3>Sẵn sàng xuất phát?</h3><p>Đi vòng qua các vách ngăn và né quả cầu đỏ.<br>Va chạm: trở về điểm đầu, trừ 3 giây.<br>Tinh thể đã nhặt được giữ lại.</p></div></div></div><div class="movementBottom"><div class="movementActions"><button type="button" data-action="start">Bắt đầu</button><button type="button" data-action="pause" disabled>Tạm dừng</button></div><div class="movementKeys"><kbd>W A S D</kbd> / <kbd>↑ ↓ ← →</kbd> Di chuyển &nbsp; <kbd>Space</kbd> Dash</div></div><div class="movementTouch" aria-label="Điều khiển cảm ứng"><div class="movementDpad"><button type="button" data-move="up" aria-label="Đi lên">↑</button><button type="button" data-move="left" aria-label="Sang trái">←</button><button type="button" data-move="down" aria-label="Đi xuống">↓</button><button type="button" data-move="right" aria-label="Sang phải">→</button></div><button type="button" data-dash>Dash</button></div><div class="movementLegend"><span><i></i>Tinh thể cần nhặt</span><span><i class="danger"></i>Chạm vào: −3 giây</span><span><i class="goal"></i>Cổng đích</span></div>`;
  const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d'),message=root.querySelector('.movementMessage'),start=root.querySelector('[data-action=start]'),pause=root.querySelector('[data-action=pause]');
  let state=create(),input={},last=0,frame=0;
  function circle(x,y,r,color){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
  function draw(){
    ctx.fillStyle='#0c1d2c';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#1b3345';ctx.lineWidth=1;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.fillStyle='#153d43';ctx.fillRect(35,380,90,100);ctx.fillStyle='#8bbabb';ctx.font='12px Arial';ctx.fillText('START',59,503);
    for(const w of walls){ctx.fillStyle='#2b4a61';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.fillStyle='#49738a';ctx.fillRect(w.x,w.y,3,w.h);}
    for(let i=0;i<gems.length;i++){const g=gems[i],got=state.collected.includes(i);circle(g.x,g.y,24,got?'#143b3a':'#194a46');ctx.save();ctx.translate(g.x,g.y);ctx.rotate(Math.PI/4);ctx.fillStyle=got?'#2c635b':'#86f3d3';ctx.fillRect(-9,-9,18,18);ctx.restore();ctx.fillStyle=got?'#4a8074':'#c4ffee';ctx.font='12px Arial';ctx.textAlign='center';ctx.fillText(got?'✓':String(i+1),g.x,g.y+43);}
    const unlocked=state.collected.length===3;circle(exit.x,exit.y,35,unlocked?'#68552a':'#34362f');ctx.strokeStyle=unlocked?'#ffe198':'#71715a';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle=unlocked?'#ffe198':'#8f978e';ctx.font='13px Arial';ctx.textAlign='center';ctx.fillText(unlocked?'EXIT':'CẦN 3 TINH THỂ',exit.x,exit.y+58);
    for(const h of hazards(state.age)){circle(h.x,h.y,22,'#542e42');circle(h.x,h.y,14,'#ff8499');circle(h.x-4,h.y-4,4,'#ffd8df');}
    circle(state.x,state.y,19,'#21616a');circle(state.x,state.y,R,state.dash>0?'#ffffff':'#8de8ff');circle(state.x+state.dx*5,state.y+state.dy*5,3,'#173a51');ctx.textAlign='left';
    root.querySelector('[data-stat=time]').textContent=state.time.toFixed(1)+'s';root.querySelector('[data-stat=gems]').textContent=state.collected.length+' / 3';root.querySelector('[data-stat=dash]').textContent=state.cooldown>0?state.cooldown.toFixed(1)+'s':'Sẵn sàng';
  }
  function show(title,body){message.hidden=false;message.querySelector('h3').textContent=title;message.querySelector('p').textContent=body;}
  function stop(){cancelAnimationFrame(frame);frame=0;input={};last=0;}
  function tick(now){if(state.status!=='playing')return;step(state,last?(now-last)/1000:0,input);last=now;input.dash=false;draw();if(state.status==='won'||state.status==='lost'){stop();pause.disabled=true;start.textContent='Chơi lại';show(state.status==='won'?'Hoàn thành!':'Hết giờ!',state.status==='won'?'Còn '+state.time.toFixed(1)+' giây · '+state.hits+' lần va chạm.':'Thử lại và dùng dash để vượt qua các khoảng trống.');return;}frame=requestAnimationFrame(tick);}
  function togglePause(){if(state.status==='playing'){state.status='paused';stop();pause.textContent='Tiếp tục';show('Đang tạm dừng','Thời gian được giữ lại. Bấm Tiếp tục để chơi.');}else if(state.status==='paused'){state.status='playing';message.hidden=true;pause.textContent='Tạm dừng';canvas.focus({preventScroll:true});frame=requestAnimationFrame(tick);}}
  start.onclick=()=>{stop();state=create();state.status='playing';message.hidden=true;start.textContent='Chơi lại';pause.disabled=false;pause.textContent='Tạm dừng';canvas.focus({preventScroll:true});draw();frame=requestAnimationFrame(tick);};pause.onclick=togglePause;
  const keys={w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right',' ':'dash'};
  document.addEventListener('keydown',e=>{if(state.status!=='playing'||!root.classList.contains('active')||document.activeElement!==canvas)return;const key=keys[e.key.toLowerCase()];if(key){e.preventDefault();if(key!=='dash'||!e.repeat)input[key]=true;}});
  document.addEventListener('keyup',e=>{const key=keys[e.key.toLowerCase()];if(key)input[key]=false;});
  for(const b of root.querySelectorAll('[data-move],[data-dash]')){const key=b.dataset.move||'dash';b.addEventListener('pointerdown',e=>{if(state.status!=='playing')return;e.preventDefault();b.setPointerCapture(e.pointerId);input[key]=true;});for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>{input[key]=false;});}
  window.addEventListener('blur',()=>{if(state.status==='playing')togglePause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.status==='playing')togglePause();});
  new MutationObserver(()=>{if(!root.classList.contains('active')&&state.status==='playing')togglePause();}).observe(root,{attributes:true,attributeFilter:['class']});draw();
})(typeof window==='undefined'?globalThis:window);
