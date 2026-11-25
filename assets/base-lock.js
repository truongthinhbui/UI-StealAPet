(() => {
 'use strict';
 const pane = document.getElementById('tab-base-lock');
 if (!pane) return;
 pane.innerHTML = `<div class="bl-toolbar" aria-label="Ba bước khóa base">
 <button data-bl-step="near" aria-pressed="true">1 · Đứng gần trụ khóa</button><button data-bl-step="dialog" aria-pressed="false">2 · Nạp khóa vào trụ</button><button data-bl-step="locked" aria-pressed="false">3 · Bảo vệ và nạp thêm</button><button class="bl-reset">Chơi lại luồng</button></div>
 <div class="bl-description" aria-live="polite"></div>
 <div class="bl-frame"><div class="bl-stage">
 <div class="bl-altar" data-tier="idle"><div class="bl-aura" aria-hidden="true"><span class="bl-orbit"></span><span class="bl-orbit bl-orbit-outer"></span><span class="bl-rays"></span><span class="bl-sparks">${Array.from({length:8},()=>'<i></i>').join('')}</span></div><img class="bl-prop" src="assets/base-lock/lockshield-prop.png" alt="Tượng ổ khóa có huy hiệu khiên, model Blender" draggable="false"></div>
 <div class="bl-world"><button class="bl-interact" aria-label="Mở bảng khóa base"><img src="assets/base-lock/lock.png" alt=""><span>NẠP KHÓA</span></button><div class="bl-lock-status" hidden><div class="bl-locked-title">BASE ĐÃ KHÓA</div><div class="bl-timer">03:00</div><div class="bl-world-note">Đang bảo vệ pet</div></div><span class="bl-away" hidden>Đến gần để khóa</span></div>
 <div class="bl-shade" hidden><section class="bl-dialog" role="dialog" aria-modal="true" aria-labelledby="bl-dialog-title" aria-describedby="bl-dialog-copy"><h2 class="bl-title" id="bl-dialog-title">KHÓA BASE</h2><button class="bl-close" aria-label="Đóng bảng"></button><div class="bl-dialog-body"><div class="bl-item-row"><div class="bl-item"><img src="assets/base-lock/lock.png" alt="Khóa bảo vệ"><b class="bl-item-count">×3</b></div><div class="bl-item-info"><h3>Khóa bảo vệ</h3><dl><div><dt>Mỗi khóa nạp thêm</dt><dd>3 phút</dd></div></dl></div></div><p class="bl-dialog-copy" id="bl-dialog-copy">Thời gian còn lại: <strong class="bl-current-time">00:00</strong></p><div class="bl-actions"><button class="bl-cancel">ĐỂ SAU</button><button class="bl-use">NẠP 1 KHÓA</button></div><p class="bl-after">Còn trong túi: <span>2</span> khóa</p></div></section></div>
 <div class="bl-toast" role="status" hidden></div></div></div>
 <div class="bl-test"><span>Thử tình huống:</span><button class="bl-distance" aria-pressed="true">Đang đứng gần</button><button class="bl-expire">Cho khóa hết giờ</button><button class="bl-empty">Thử hết khóa</button></div>`;
 pane.insertAdjacentHTML('beforeend', `<details class="bl-concept"><summary>Concept vật dụng · Trụ Khóa Chân Thú</summary><p>Ổ khóa vàng có huy hiệu chân thú, đặt trên bệ thấp cạnh cửa base. Đây là concept 3D để chọn thiết kế; chưa phải asset đã kiểm tra trong game.</p><figure><img src="assets/base-lock/concept.png" alt="Concept Trụ Khóa Chân Thú: góc 3/4, mặt trước, bên và sau" loading="lazy"><figcaption>Concept màu · Bảng màu lấy từ AllPets.png của skill SAP.</figcaption></figure><figure><img src="assets/base-lock/wireframe.png" alt="Wireframe thật từ cùng mô hình concept 1348 tam giác" loading="lazy"><figcaption>Wireframe cùng hình học concept · 1.348 tam giác.</figcaption></figure></details>`);
 const concepts=[['lockshield','Trụ Khóa Huy Hiệu Khiên','Giữ tượng ổ khóa và bệ tròn ban đầu; gắn huy hiệu khiên nổi trên mặt trước.'],['shieldlock','Khiên Khóa Bảo Hộ','Phương án tham khảo: khiên là thân chính, ổ khóa vàng nổi ở giữa.'],['bell','Chuông bảo hộ','Chuông rung khi kích hoạt, vòng bảo vệ lan từ bệ.'],['dog','Tượng chó canh cửa','Chó giữ khiên bảo vệ, đặt cố định bên cửa base.'],['breaker','Cầu dao bảo vệ','Cần gạt lớn thể hiện trạng thái bật hàng rào.']];
 const gallery=document.createElement('section');gallery.className='bl-concept-gallery';
 gallery.innerHTML='<h2>Concept vật dụng khóa base</h2><p>Bốn góc nhìn và wireframe từ cùng hình học concept. Bảng màu lấy từ AllPets.png theo skill SAP; chưa phải asset đã kiểm tra trong game.</p>'+concepts.map(([id,name,description])=>`<details class="bl-concept" ${id==='lockshield'?'open':''}><summary>${name}${id==='lockshield'?' · Thiết kế hiện tại':''}</summary><p>${description}</p><figure><img src="assets/base-lock/${id}-concept.png" alt="${name}: góc 3/4, trước, bên và sau" loading="lazy"><figcaption>Concept 3D · ${name}</figcaption></figure><details><summary>Xem wireframe</summary><img src="assets/base-lock/${id}-wireframe.png" alt="Wireframe hình học concept ${name}" loading="lazy"></details></details>`).join('');
 pane.insertBefore(gallery,pane.querySelector('.bl-concept'));
 const q = s => pane.querySelector(s);
 // Keep HUD and dialog independent of the cropped gameplay layer.
 for(const selector of ['.bl-interact','.bl-toast','.bl-shade'])q('.bl-frame').append(q(selector));
 const durations=[2,5,10];
 const flows={confirm:{name:'Chọn rồi xác nhận',hint:'Chọn một loại khóa, xem thông tin rồi bấm nạp.'},cards:{name:'Chọn thẻ nạp ngay',hint:'Bấm thẻ khóa để nạp ngay một khóa tương ứng.'}};
 let flow='confirm',pendingMinutes=null,holdTimer=null;
 const flowNav=document.createElement('div');flowNav.className='bl-flow-nav';flowNav.setAttribute('role','group');flowNav.setAttribute('aria-label','Phương án luồng nạp');
 flowNav.innerHTML=Object.entries(flows).map(([id,f],i)=>`<button type="button" data-bl-flow="${id}" aria-pressed="${id==='confirm'}"><small>PHƯƠNG ÁN ${i+1}</small><span>${f.name}</span></button>`).join('');pane.prepend(flowNav);
 const flowNote=document.createElement('p');flowNote.className='bl-flow-note';flowNav.after(flowNote);
 let state = 'near', selectedMinutes=2, inventory={2:3,5:3,10:3}, near = true, expires = 0, toastUntil = 0;
 const types=document.createElement('div');types.className='bl-key-types';types.setAttribute('role','group');types.setAttribute('aria-label','Chọn loại khóa');
 types.innerHTML=durations.map(minutes=>`<button type="button" draggable="false" data-key-minutes="${minutes}" data-key-tier="${minutes===2?'blue':minutes===5?'purple':'gold'}" aria-pressed="${minutes===2}"><img src="assets/base-lock/lock.png" alt=""><span>${minutes} phút<small>×3</small></span><b class="bl-type-action">Nạp ngay</b></button>`).join('');
 q('.bl-dialog-body').prepend(types);
 const hint=document.createElement('p');hint.className='bl-flow-hint';types.before(hint);
 const slot=document.createElement('button');slot.type='button';slot.className='bl-socket';slot.innerHTML='<span class="bl-socket-port" aria-hidden="true"><img src="assets/base-lock/lock.png" alt=""><b>+</b></span><span class="bl-socket-label">KHE NẠP KHÓA</span>';
 types.after(slot);
 function cancelHold(){clearTimeout(holdTimer);holdTimer=null;q('.bl-use').classList.remove('bl-holding');}
 flowNav.querySelectorAll('button').forEach(button=>button.onclick=()=>{cancelHold();flow=button.dataset.blFlow;pendingMinutes=null;render();});
 types.querySelectorAll('button').forEach(button=>{
  button.onclick=()=>{cancelHold();selectedMinutes=Number(button.dataset.keyMinutes);if(flow==='socket')pendingMinutes=inventory[selectedMinutes]>0?selectedMinutes:null;render();if(flow==='cards')activate();};
  button.ondragstart=e=>{if(flow!=='socket')return e.preventDefault();e.dataTransfer.setData('text/plain',button.dataset.keyMinutes);e.dataTransfer.effectAllowed='copy';};
 });
 slot.onclick=()=>{if(inventory[selectedMinutes]>0){pendingMinutes=selectedMinutes;render();}};
 slot.ondragover=e=>{if(flow==='socket'){e.preventDefault();slot.classList.add('bl-drop-over');}};
 slot.ondragleave=()=>slot.classList.remove('bl-drop-over');
 slot.ondrop=e=>{e.preventDefault();slot.classList.remove('bl-drop-over');const minutes=Number(e.dataTransfer.getData('text/plain'));if(durations.includes(minutes)&&inventory[minutes]>0){selectedMinutes=minutes;pendingMinutes=minutes;render();}};
 const descriptions = {
 near: 'Bước 1 · Đến gần trụ và bấm “NẠP KHÓA” để mở bảng. Có 3 loại khóa: 2 phút, 5 phút và 10 phút.',
 dialog: 'Bước 2 · Chọn khóa 2, 5 hoặc 10 phút rồi bấm “NẠP 1 KHÓA”. Có thể nạp thêm khi base đang được bảo vệ.',
 locked: 'Bước 3 · Trụ bảo vệ base và đếm ngược. Bấm “NẠP THÊM” để bổ sung khóa; thời gian mới cộng vào thời gian còn lại.'
 };
 function remaining() { return Math.max(0, Math.ceil((expires - Date.now()) / 1000)); }
 function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`; }
 function notify(text) { q('.bl-toast').textContent = text; toastUntil = Date.now() + 3500; q('.bl-toast').hidden = false; }
 let previousTier='idle';
 const tierImages={idle:'lockshield-prop',blue:'lockshield-blue',purple:'lockshield-purple',gold:'lockshield-gold'};
 Object.values(tierImages).forEach(name=>{const img=new Image();img.src=`assets/base-lock/${name}.png`;});
 function render() {
  const seconds=remaining(), active=seconds>0;
  const tier=!active?'idle':seconds>300?'gold':seconds>120?'purple':'blue';
  q('.bl-altar').dataset.tier=tier;
  q('.bl-world').dataset.tier=tier;
  q('.bl-dialog').dataset.keyTier=selectedMinutes===2?'blue':selectedMinutes===5?'purple':'gold';
  q('.bl-world-note').textContent=tier==='gold'?'Bảo vệ tối thượng':tier==='purple'?'Bảo vệ nâng cao':'Đang bảo vệ pet';
  if(tier!==previousTier){q('.bl-prop').src=`assets/base-lock/${tierImages[tier]}.png`;previousTier=tier;}
  const count=inventory[selectedMinutes];
  q('.bl-shade').dataset.flow=flow;
  flowNote.textContent=`${flows[flow].name} · ${flows[flow].hint}`;
  hint.textContent=flows[flow].hint;hint.hidden=flow==='confirm';
  flowNav.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.blFlow===flow)));
  slot.hidden=flow!=='socket';slot.dataset.loaded=String(pendingMinutes!==null);slot.querySelector('.bl-socket-label').textContent=pendingMinutes?`Đã đặt khóa ${pendingMinutes} phút`:'KHE NẠP KHÓA';
  q('.bl-item-row').hidden=flow==='cards'||flow==='socket';
  q('.bl-use').hidden=flow==='cards';q('.bl-cancel').textContent=flow==='cards'?'ĐÓNG':'ĐỂ SAU';
  types.querySelectorAll('button').forEach(button=>{const minutes=Number(button.dataset.keyMinutes);button.setAttribute('aria-pressed',String(minutes===selectedMinutes));button.querySelector('small').textContent='×'+inventory[minutes];button.disabled=flow==='cards'&&inventory[minutes]===0;button.draggable=flow==='socket'&&inventory[minutes]>0;});
  q('.bl-item-info h3').textContent=`Khóa bảo vệ ${selectedMinutes} phút`;
  q('.bl-item-info dd').textContent=`${selectedMinutes} phút`;
  q('.bl-description').textContent = state==='dialog'?flows[flow].hint:descriptions[state];
  pane.querySelectorAll('[data-bl-step]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.blStep === state)));
  q('.bl-shade').hidden = state !== 'dialog';
  q('.bl-interact').hidden = state === 'dialog' || !near;
  q('.bl-interact span').firstChild.textContent = active ? 'NẠP THÊM' : 'NẠP KHÓA';
  q('.bl-interact').setAttribute('aria-label',active?'Nạp thêm khóa vào trụ':'Mở bảng nạp khóa');
  q('.bl-world').dataset.protected=String(active);q('.bl-frame').dataset.protected=String(active);q('.bl-world').dataset.low=String(active&&seconds<=30);
  q('.bl-away').hidden = state === 'dialog' || near;
  q('.bl-lock-status').hidden = !active;
  q('.bl-item-count').textContent = '×' + count;
  q('.bl-current-time').textContent=formatTime(seconds);
  q('.bl-after span').textContent = Math.max(0, count - 1);
  q('.bl-use').disabled = count === 0 || (flow==='socket'&&pendingMinutes===null);q('.bl-use').textContent=count?(flow==='hold'?'GIỮ ĐỂ NẠP':'NẠP 1 KHÓA'):'HẾT KHÓA';
  q('.bl-after').hidden = !count||flow==='cards';
  q('.bl-distance').textContent = near ? 'Đang đứng gần' : 'Đang đứng xa'; q('.bl-distance').setAttribute('aria-pressed', String(near));
  q('.bl-expire').disabled = !active;
  q('.bl-timer').textContent=formatTime(seconds);
 }
 function open() { if (state === 'dialog' || !near) return; pendingMinutes=null;state = 'dialog'; render();if(flow==='cards'||q('.bl-use').disabled)q('.bl-close').focus();else q('.bl-use').focus(); }
 function close() { cancelHold();pendingMinutes=null;state = remaining()>0 ? 'locked' : 'near'; render(); if(near)q('.bl-interact').focus(); }
 function activate() { if (state !== 'dialog' || inventory[selectedMinutes] < 1) return;cancelHold();inventory[selectedMinutes]--;expires=Math.max(Date.now(),expires)+selectedMinutes*60000;pendingMinutes=null;state = 'locked'; render(); notify(`Đã nạp 1 khóa · Thêm ${selectedMinutes} phút bảo vệ`); q('.bl-interact').focus(); }
 function reset() {cancelHold();pendingMinutes=null;state = 'near'; selectedMinutes=2; inventory={2:3,5:3,10:3}; near = true; expires = 0; toastUntil = 0; q('.bl-toast').hidden = true; render(); }
 q('.bl-interact').onclick = open; q('.bl-close').onclick = close; q('.bl-cancel').onclick = close; q('.bl-use').onclick=()=>{if(flow!=='hold'&&(flow!=='socket'||pendingMinutes!==null))activate();};q('.bl-reset').onclick = reset;
 function startHold(){if(flow!=='hold'||state!=='dialog'||inventory[selectedMinutes]<1||holdTimer)return;q('.bl-use').classList.add('bl-holding');holdTimer=setTimeout(()=>{holdTimer=null;if(flow==='hold'&&state==='dialog')activate();},900);}
 q('.bl-use').onpointerdown=e=>{if(flow==='hold'){e.preventDefault();q('.bl-use').setPointerCapture(e.pointerId);startHold();}};
 q('.bl-use').onpointerup=cancelHold;q('.bl-use').onpointercancel=cancelHold;q('.bl-use').onlostpointercapture=cancelHold;q('.bl-use').onblur=cancelHold;
 q('.bl-use').onkeydown=e=>{if(flow==='hold'&&[' ','Enter'].includes(e.key)){e.preventDefault();if(!e.repeat)startHold();}};q('.bl-use').onkeyup=e=>{if([' ','Enter'].includes(e.key))cancelHold();};
 pane.querySelectorAll('[data-bl-step]').forEach(b => b.onclick = () => { reset(); if (b.dataset.blStep !== 'near') open(); if (b.dataset.blStep === 'locked') activate(); });
 q('.bl-distance').onclick = () => {cancelHold();near = !near; if (state === 'dialog') state = remaining()>0?'locked':'near'; render(); };
 q('.bl-expire').onclick = () => { expires = 0; if(state!=='dialog')state = 'near'; render(); notify('Đã hết thời gian bảo vệ · Nạp khóa để bảo vệ tiếp'); };
 q('.bl-empty').onclick = () => { reset(); inventory[selectedMinutes]=0; open(); };
 pane.addEventListener('keydown', e => {
  if (state !== 'dialog'||!e.target.closest('.bl-dialog')) return;
  if (e.key === 'Escape') { e.preventDefault(); close(); }
  if (e.key === 'Tab') { const buttons = [...q('.bl-dialog').querySelectorAll('button:not(:disabled)')]; const index = buttons.indexOf(document.activeElement); const next = (index + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length; e.preventDefault(); buttons[next].focus(); }
 });
 new ResizeObserver(() => { const frame=q('.bl-frame'),stage=q('.bl-stage');const scale=Math.max(frame.clientWidth/1774,frame.clientHeight/993);stage.style.transform=`scale(${scale})`;stage.style.left=`${(frame.clientWidth-1774*scale)/2}px`;stage.style.top=`${(frame.clientHeight-993*scale)/2}px`; }).observe(q('.bl-frame'));
 setInterval(() => { if(expires>0&&!remaining()){expires=0;if(state==='locked')state='near';notify('Đã hết thời gian bảo vệ · Nạp khóa để bảo vệ tiếp');render();} if(state==='dialog'||expires>0)render(); if (toastUntil && Date.now() >= toastUntil) { q('.bl-toast').hidden = true; toastUntil = 0; } }, 250);
 render();
})();
