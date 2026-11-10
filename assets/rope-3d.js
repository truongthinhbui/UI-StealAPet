import {RopeEngine,ROPE_RULES} from './rope-engine.js';
export function setupRopeGame({THREE:T,root,stage,scene,onJump,onLost,onMode}){
  const radius=3,engine=new RopeEngine(),group=new T.Group();scene.add(group);group.visible=false;
  const modes=document.createElement('div');modes.className='ropeModes';modes.innerHTML='<button type="button" data-rope-mode="rope" disabled title="Tạm khóa">Nhảy dây · 🔒</button><button type="button" data-rope-mode="movement">Di chuyển tự do</button>';root.querySelector('.characterHeader').after(modes);
  const panel=document.createElement('section');panel.className='ropePanel';panel.innerHTML=`<div class="ropeControls"><label><input type="checkbox" data-rope-auto checked> Chạy mẫu tự động</label><label>Tốc độ dây <input type="range" min="24" max="42" value="30" data-rope-speed><output data-rope-rpm>30 vòng/phút</output></label><button type="button" data-rope-restart>Chơi lại</button></div><div class="ropeStats"><span>Thời gian <strong data-rope-time>90s</strong></span><span>Tim <strong data-rope-hearts>♥ ♥ ♥</strong></span><span>Combo <strong data-rope-combo>0</strong></span><span>Gems <strong data-rope-gems>0 / 15</strong></span></div><p class="ropeInstructions">Tắt chạy mẫu để tự chơi. Nhìn bóng cam báo trước, bấm Nhảy / Space / chạm sân để vượt dây. Đang ở trên không không thể nhảy tiếp. Mỗi 10 combo +3 Gems; ít nhất 4/6 người đúng nhịp +1 Gem. Tổng trần 15 Gems/lượt, có thể đạt trước combo 50.</p>`;stage.before(panel);
  const feedback=document.createElement('div');feedback.className='ropeFeedback';feedback.setAttribute('role','status');stage.append(feedback);
  const result=document.createElement('div');result.className='ropeResult';result.hidden=true;stage.append(result);
  const readouts=Object.fromEntries(['time','hearts','combo','gems'].map(k=>[k,panel.querySelector('[data-rope-'+k+']')]));
  function disc(r,color,opacity=1){const m=new T.Mesh(new T.CircleGeometry(r,96),new T.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:opacity===1}));m.rotation.x=-Math.PI/2;return m;}
  const court=disc(4.4,0x294d59);court.position.y=.012;group.add(court);
  const circle=new T.Mesh(new T.RingGeometry(2.97,3.03,96),new T.MeshBasicMaterial({color:0x6d99a1,side:T.DoubleSide}));circle.rotation.x=-Math.PI/2;circle.position.y=.02;group.add(circle);
  const ropePivot=new T.Group(),rope=new T.Mesh(new T.CylinderGeometry(.035,.035,3.9,10),new T.MeshStandardMaterial({color:0xffa340,emissive:0x7c3100,emissiveIntensity:.4}));rope.rotation.x=Math.PI/2;rope.position.z=1.95;rope.position.y=.14;ropePivot.add(rope);group.add(ropePivot);
  const warningPivot=new T.Group();const wedge=new T.Mesh(new T.RingGeometry(.3,4,64,1,0,.34),new T.MeshBasicMaterial({color:0xffa33c,transparent:true,opacity:.2,side:T.DoubleSide,depthWrite:false}));wedge.rotation.x=-Math.PI/2;wedge.rotation.z=-Math.PI/2;wedge.position.y=.025;warningPivot.add(wedge);group.add(warningPivot);
  const characters=[];
  for(let i=1;i<6;i++){const p=new T.Group(),body=new T.Mesh(new T.CapsuleGeometry(.18,.5,4,8),new T.MeshStandardMaterial({color:0xadb7c1,roughness:1})),head=new T.Mesh(new T.SphereGeometry(.17,12,8),body.material);body.position.y=.65;head.position.y=1.2;p.add(body,head);p.position.set(-Math.sin(i*Math.PI/3)*radius,0,Math.cos(i*Math.PI/3)*radius);group.add(p);characters.push(p);}
  const spinner=new T.Group(),spinnerBody=new T.Mesh(new T.CapsuleGeometry(.22,.5,4,8),new T.MeshStandardMaterial({color:0xe9ca83,roughness:1})),spinnerHead=new T.Mesh(new T.SphereGeometry(.19,12,8),spinnerBody.material);spinnerBody.position.y=.65;spinnerHead.position.y=1.25;spinner.add(spinnerBody,spinnerHead);group.add(spinner);
  const labelCanvas=document.createElement('canvas');labelCanvas.width=192;labelCanvas.height=64;const labelContext=labelCanvas.getContext('2d');labelContext.fillStyle='#b1ffe6';labelContext.font='bold 36px Arial';labelContext.textAlign='center';labelContext.fillText('Bạn',96,45);const youLabel=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(labelCanvas),depthWrite:false}));youLabel.scale.set(.9,.3,1);youLabel.position.set(0,2.1,radius);group.add(youLabel);
  const safe=disc(.48,0x58d8b4,.26);safe.position.set(0,.03,radius);group.add(safe);
  const immuneRing=new T.Group(),ringMaterial=new T.MeshBasicMaterial({color:0xa7f4df,transparent:true,opacity:.8});for(let i=0;i<16;i++){const part=new T.Mesh(new T.RingGeometry(.48,.51,4,1,i*Math.PI/8,.12),ringMaterial);part.rotation.x=-Math.PI/2;immuneRing.add(part);}immuneRing.position.set(0,.04,radius);group.add(immuneRing);
  let active=false,lastUI='',feedbackUntil=0,ended=false;
  function text(el,value){if(el.textContent!==value)el.textContent=value;}
  function renderUI(){const key=[Math.ceil(90-engine.time),engine.hearts,engine.combo,engine.gems].join('|');if(key===lastUI)return;lastUI=key;text(readouts.time,Math.ceil(90-engine.time)+'s');text(readouts.hearts,'♥ '.repeat(engine.hearts)+'♡ '.repeat(3-engine.hearts));text(readouts.combo,String(engine.combo));text(readouts.gems,engine.gems+' / 15');}
  function notice(message){text(feedback,message);feedbackUntil=engine.time+1.1;}
  function restart(){engine.auto=panel.querySelector('[data-rope-auto]').checked;engine.reset();ended=false;lastUI='';feedbackUntil=0;text(feedback,'');result.hidden=true;renderUI();}
  function setMode(mode){if(mode==='rope')return;active=mode==='rope';root.dataset.rope=String(active);group.visible=active;panel.hidden=!active;feedback.hidden=!active;result.hidden=true;modes.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ropeMode===mode)));root.querySelector('.characterHeader h2').textContent=active?'Nhảy dây · Kelly 3D':'Kelly · 3D Movement';root.querySelector('.characterViewLabel').textContent=active?'NHẢY DÂY / GÓC NHÌN THỨ BA':'THIRD PERSON / TRAINING GROUND';root.querySelector('.characterFloorHint').textContent=active?'Chạm sân để nhảy':'Kéo để xoay camera';onMode(active,mode);}
  modes.addEventListener('click',e=>{const b=e.target.closest('[data-rope-mode]');if(b&&!b.disabled)setMode(b.dataset.ropeMode);});
  panel.querySelector('[data-rope-auto]').onchange=e=>{engine.auto=e.target.checked;notice(engine.auto?'Đã bật chạy mẫu':'Bạn điều khiển Kelly');};
  panel.querySelector('[data-rope-speed]').oninput=e=>{engine.setRPM(Number(e.target.value));text(panel.querySelector('[data-rope-rpm]'),engine.rpm+' vòng/phút');};
  panel.querySelector('[data-rope-restart]').onclick=()=>onMode(active);
  function jump(){if(!active||!engine.jump())return false;onJump(0);return true;}
  function update(dt){
    if(!active)return;
    const events=engine.update(dt);
    for(const e of events){if(e.type==='jump')onJump(Math.max(0,engine.time-e.at));if(e.type==='success')notice('Đúng nhịp · Combo '+e.combo+(e.paid?' · +'+e.paid+' Gems':''));if(e.type==='hit')notice('Trúng dây · −1 tim · Bất tử 3 giây');if(e.type==='sync'&&e.paid)notice('Đồng bộ nhóm · +1 Gem');}
    ropePivot.rotation.y=-engine.angle;warningPivot.rotation.y=-(engine.angle+engine.rpm*Math.PI*2/60*ROPE_RULES.autoLead);spinner.rotation.y=-engine.angle;
    immuneRing.visible=engine.time<engine.immuneUntil;safe.material.color.setHex(immuneRing.visible?0x7ad8ff:0x58d8b4);
    for(let i=0;i<characters.length;i++){const phase=(i+1)*Math.PI/3,turn=Math.max(0,Math.round((engine.angle-phase)/(Math.PI*2))),delta=(engine.angle-(turn*Math.PI*2+phase))/(engine.rpm*Math.PI*2/60)+.23;characters[i].position.y=engine.plan(turn,i+1)&&delta>=0&&delta<.55?Math.sin(delta/.55*Math.PI)*.65:0;}
    if(engine.time>feedbackUntil)text(feedback,'');renderUI();
    if(engine.status!=='playing'&&!ended){ended=true;root.querySelector('[data-3d=jump]').disabled=true;result.hidden=false;const title=document.createElement('strong'),detail=document.createElement('p');title.textContent=engine.status==='lost'?'Hết tim':'Hoàn thành lượt';detail.textContent=`${engine.gems} / 15 Gems · Combo cao nhất ${engine.bestCombo}. Thưởng combo ${engine.comboGems}, đồng bộ ${engine.syncGems}.`;result.replaceChildren(title,detail);if(engine.status==='lost')onLost();}
  }
  return {get active(){return active;},engine,setMode,restart,jump,update,radius};
}
