(() => {
 'use strict';
 const pane = document.getElementById('tab-base-lock');
 if (!pane) return;
 pane.innerHTML = `<div class="bl-toolbar" aria-label="Ba bước khóa base">
 <button data-bl-step="near" aria-pressed="true">1 · Đứng gần trụ khóa</button><button data-bl-step="dialog" aria-pressed="false">2 · Nạp token vào trụ</button><button data-bl-step="locked" aria-pressed="false">3 · Bảo vệ và nạp thêm</button><button class="bl-reset">Chơi lại luồng</button></div>
 <div class="bl-description" aria-live="polite"></div>
 <div class="bl-frame"><div class="bl-stage">
 <div class="bl-altar" data-tier="idle"><div class="bl-aura" aria-hidden="true"><span class="bl-orbit"></span><span class="bl-orbit bl-orbit-outer"></span><span class="bl-rays"></span><span class="bl-sparks">${Array.from({length:8},()=>'<i></i>').join('')}</span></div><img class="bl-prop" src="assets/base-lock/lockshield-prop.png" alt="Tượng ổ khóa có huy hiệu khiên, model Blender" draggable="false"></div>
 <div class="bl-world"><button class="bl-interact" aria-label="Mở bảng khóa base"><img src="assets/base-lock/lock.png" alt=""><span>NẠP TOKEN</span></button><div class="bl-lock-status" hidden><div class="bl-locked-title">BASE ĐÃ KHÓA</div><div class="bl-timer">03:00</div><div class="bl-world-note">Đang bảo vệ pet</div></div><span class="bl-away" hidden>Đến gần để khóa</span></div>
 <div class="bl-shade" hidden><section class="bl-dialog" role="dialog" aria-modal="true" aria-labelledby="bl-dialog-title" aria-describedby="bl-dialog-copy"><h2 class="bl-title" id="bl-dialog-title">KHÓA BASE</h2><button class="bl-close" aria-label="Đóng bảng"></button><div class="bl-dialog-body"><div class="bl-token-wallet"><img src="assets/base-lock/lock.png" alt=""><div><strong>Lock Token</strong><small>Có <b class="bl-token-stock"></b> token · 1 token = <span class="bl-token-seconds"></span> giây</small></div></div>
 <div class="bl-token-layout">
 <div class="bl-token-preview" id="bl-dialog-copy"><img src="assets/base-lock/lockshield-prop.png" alt=""><div><span>Thời gian còn lại</span><div class="bl-time-row"><strong class="bl-current-time">00:00</strong><output class="bl-time-added" aria-label="Thời gian cộng thêm" hidden></output></div></div></div>
 <div class="bl-token-picker" role="group" aria-label="Số Lock Token muốn nạp">
 <input class="bl-token-range" type="range" min="0" max="24" step="1" value="0" aria-label="Số token muốn nạp" aria-orientation="vertical">
 <div class="bl-token-controls"><button class="bl-max">Tối đa</button><button class="bl-plus" aria-label="Tăng 1 token">▲</button><div class="bl-token-amount"><img src="assets/base-lock/lock.png" alt=""><output class="bl-quantity" aria-label="Token đã chọn">0 / 24</output></div><button class="bl-minus" aria-label="Giảm 1 token">▼</button><button class="bl-clear-selection">Đặt lại</button></div></div></div>
 <p class="bl-token-note">Token đã nạp sẽ được tiêu hao và không thể lấy lại.</p>
 <div class="bl-actions bl-token-actions"><button class="bl-use">NẠP TOKEN</button></div>
 <p class="bl-token-feedback" role="status"></p></div></section></div>
 <div class="bl-toast" role="status" hidden></div></div></div>
 <div class="bl-test"><span>Thử tình huống:</span><button class="bl-distance" aria-pressed="true">Đang đứng gần</button><button class="bl-expire">Cho khóa hết giờ</button><button class="bl-empty">Thử hết token</button></div>`;
 pane.insertAdjacentHTML('beforeend', `<details class="bl-concept"><summary>Concept vật dụng · Trụ Khóa Chân Thú</summary><p>Ổ khóa vàng có huy hiệu chân thú, đặt trên bệ thấp cạnh cửa base. Đây là concept 3D để chọn thiết kế; chưa phải asset đã kiểm tra trong game.</p><figure><img src="assets/base-lock/concept.png" alt="Concept Trụ Khóa Chân Thú: góc 3/4, mặt trước, bên và sau" loading="lazy"><figcaption>Concept màu · Bảng màu lấy từ AllPets.png của skill SAP.</figcaption></figure><figure><img src="assets/base-lock/wireframe.png" alt="Wireframe thật từ cùng mô hình concept 1348 tam giác" loading="lazy"><figcaption>Wireframe cùng hình học concept · 1.348 tam giác.</figcaption></figure></details>`);
 const concepts=[['lockshield','Trụ Khóa Huy Hiệu Khiên','Giữ tượng ổ khóa và bệ tròn ban đầu; gắn huy hiệu khiên nổi trên mặt trước.'],['shieldlock','Khiên Khóa Bảo Hộ','Phương án tham khảo: khiên là thân chính, ổ khóa vàng nổi ở giữa.'],['bell','Chuông bảo hộ','Chuông rung khi kích hoạt, vòng bảo vệ lan từ bệ.'],['dog','Tượng chó canh cửa','Chó giữ khiên bảo vệ, đặt cố định bên cửa base.'],['breaker','Cầu dao bảo vệ','Cần gạt lớn thể hiện trạng thái bật hàng rào.']];
 const gallery=document.createElement('section');gallery.className='bl-concept-gallery';
 gallery.innerHTML='<h2>Concept vật dụng khóa base</h2><p>Bốn góc nhìn và wireframe từ cùng hình học concept. Bảng màu lấy từ AllPets.png theo skill SAP; chưa phải asset đã kiểm tra trong game.</p>'+concepts.map(([id,name,description])=>`<details class="bl-concept" ${id==='lockshield'?'open':''}><summary>${name}${id==='lockshield'?' · Thiết kế hiện tại':''}</summary><p>${description}</p><figure><img src="assets/base-lock/${id}-concept.png" alt="${name}: góc 3/4, trước, bên và sau" loading="lazy"><figcaption>Concept 3D · ${name}</figcaption></figure><details><summary>Xem wireframe</summary><img src="assets/base-lock/${id}-wireframe.png" alt="Wireframe hình học concept ${name}" loading="lazy"></details></details>`).join('');
 pane.insertBefore(gallery,pane.querySelector('.bl-concept'));
 const q = s => pane.querySelector(s);
 // Keep HUD and dialog independent of the cropped gameplay layer.
 for(const selector of ['.bl-interact','.bl-toast','.bl-shade'])q('.bl-frame').append(q(selector));
 const SECONDS_PER_TOKEN = 30;
 const STARTING_TOKENS = 24;
 q('.bl-token-seconds').textContent = SECONDS_PER_TOKEN;
 let state = 'near', quantity = 0, inventory = STARTING_TOKENS, near = true, expires = 0, toastUntil = 0;
 // Góc nhìn người đi trộm. Giá lấy từ Master Data!UnlockCost (rarity cao nhất trộm được x RB gap).
 const UNLOCK_COST={COMMON:[4,5,7,11],RARE:[6,8,11,18],EPIC:[9,12,17,27],LEGENDARY:[13,17,23,36],MYTHIC:[19,24,33,52],APEX:[28,35,48,75],LIMITED:[40,50,68,106]};
 const GAP_BANDS=['<3','4-6','7-9','10+'];
 let view='owner', raidRarity='APEX', raidGap=0, raidDialog=null, raidCoins=518;
 function raidPrice(){ return UNLOCK_COST[raidRarity][raidGap]; }
 const descriptions = {
  near: 'Đến gần trụ và bấm “NẠP TOKEN” để mở bảng.',
  dialog: 'Chọn số Lock Token muốn nạp.',
  locked: 'Base đang được bảo vệ. Nạp thêm token để cộng vào thời gian còn lại.'
 };
 function chooseQuantity(amount) {
  quantity = Math.max(0, Math.min(inventory, amount));
  render();
 }
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
  q('.bl-world-note').textContent=tier==='gold'?'Bảo vệ tối thượng':tier==='purple'?'Bảo vệ nâng cao':'Đang bảo vệ pet';
  if(tier!==previousTier){q('.bl-prop').src=`assets/base-lock/${tierImages[tier]}.png`;previousTier=tier;}
  q('.bl-token-stock').textContent = inventory;
  q('.bl-quantity').textContent = `${quantity} / ${inventory}`;
  const timeAdded = q('.bl-time-added');
  timeAdded.hidden = quantity === 0;
  timeAdded.textContent = quantity ? `+${formatTime(quantity * SECONDS_PER_TOKEN)}` : '';
  const range = q('.bl-token-range');
  range.max = inventory;
  range.value = quantity;
  range.disabled = inventory === 0;
  range.style.setProperty('--bl-token-fill', `${inventory ? quantity / inventory * 100 : 0}%`);
  q('.bl-clear-selection').disabled = quantity === 0;
  q('.bl-minus').disabled = quantity === 0;
  q('.bl-plus').disabled = quantity >= inventory;
  q('.bl-max').disabled = quantity >= inventory;
  q('.bl-use').disabled = quantity === 0 || quantity > inventory;
  q('.bl-use').textContent = inventory === 0 ? 'HẾT TOKEN' : quantity ? `NẠP ${quantity} TOKEN` : 'NẠP TOKEN';
  q('.bl-description').textContent = view==='thief'
   ? (active?'Góc nhìn người đi trộm · Bấm “MỞ KHÓA” để xem thông báo: nhà đang được khóa bằng Lock Token, không thể mở.':'Góc nhìn người đi trộm · Nhà không được bảo vệ. Bấm “MỞ KHÓA” để trả Pet Coin theo bảng UnlockCost.')
   : descriptions[state];
  pane.querySelectorAll('[data-bl-step]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.blStep === state)));
  q('.bl-shade').hidden = state !== 'dialog' || view !== 'owner';
  q('.bl-interact').hidden = state === 'dialog' || !near || view !== 'owner';
  q('.bl-interact span').firstChild.textContent = active ? 'NẠP THÊM' : 'NẠP TOKEN';
  q('.bl-interact').setAttribute('aria-label',active?'Nạp thêm Lock Token vào trụ':'Mở bảng nạp Lock Token');
  q('.bl-world').dataset.protected=String(active);q('.bl-frame').dataset.protected=String(active);q('.bl-world').dataset.low=String(active&&seconds<=30);
  q('.bl-away').hidden = state === 'dialog' || near || view !== 'owner';
  q('.bl-lock-status').hidden = !active || view !== 'owner';
  if(!gainUntil)q('.bl-current-time').textContent=formatTime(seconds);
  q('.bl-distance').textContent = near ? 'Đang đứng gần' : 'Đang đứng xa'; q('.bl-distance').setAttribute('aria-pressed', String(near));
  q('.bl-expire').disabled = !active;
  if(!gainUntil)q('.bl-timer').textContent=formatTime(seconds);
  renderRaid();
 }
 function open() {
  if (state === 'dialog' || !near || view !== 'owner') return;
  quantity = 0;
  q('.bl-token-feedback').textContent = '';
  state = 'dialog';
  render();
  q(inventory ? '.bl-token-range' : '.bl-close').focus();
 }
 function close() {
  gainUntil = 0;
  quantity = 0;
  state = remaining() > 0 ? 'locked' : 'near';
  render();
  if (near) q('.bl-interact').focus();
 }
 function activate() {
  if (state !== 'dialog' || !near || view !== 'owner' || quantity < 1 || quantity > inventory) return;
  const before = remaining();
  const spent = quantity;
  const added = spent * SECONDS_PER_TOKEN;
  inventory -= spent;
  expires = Math.max(Date.now(), expires) + added * 1000;
  quantity = 0;
  render();
  playGain(before, added);
  q('.bl-token-feedback').textContent = `Đã nạp ${spent} token · +${formatTime(added)} bảo vệ`;
  q(inventory ? '.bl-token-range' : '.bl-close').focus();
 }
 let gainUntil=0, gainFrom=0, gainAdded=0, gainStart=0;
 const GAIN_MS=900;
 function playGain(before, added){
  gainFrom=before;gainAdded=added;gainStart=performance.now();gainUntil=gainStart+GAIN_MS;
  [q('.bl-current-time'),q('.bl-timer')].forEach(el=>{el.classList.remove('bl-time-pump');void el.offsetWidth;el.classList.add('bl-time-pump');});
  requestAnimationFrame(stepGain);
 }
 function stepGain(now){
  if(!gainUntil){return;}
  if(now>=gainUntil){gainUntil=0;render();return;}
  const t=(now-gainStart)/GAIN_MS, eased=1-Math.pow(1-t,3);
  const value=Math.round(gainFrom+gainAdded*eased);
  q('.bl-current-time').textContent=formatTime(value);
  q('.bl-timer').textContent=formatTime(value);
  requestAnimationFrame(stepGain);
 }
 function reset() {
  gainUntil = 0;
  quantity = 0;
  state = 'near';
  inventory = STARTING_TOKENS;
  near = true;
  expires = 0;
  toastUntil = 0;
  q('.bl-toast').hidden = true;
  render();
 }
 /* ---- Góc nhìn người đi trộm ---- */
 const viewNav=document.createElement('div');viewNav.className='bl-view-nav';viewNav.setAttribute('role','group');viewNav.setAttribute('aria-label','Góc nhìn');
 viewNav.innerHTML=`<button type="button" data-bl-view="owner" aria-pressed="true"><small>GÓC NHÌN</small><span>Chủ nhà</span></button><button type="button" data-bl-view="thief" aria-pressed="false"><small>GÓC NHÌN</small><span>Người đi trộm</span></button>`;
 pane.prepend(viewNav);
 q('.bl-frame').insertAdjacentHTML('beforeend',`
 <button class="bl-raid" type="button" aria-label="Mở khóa nhà"><span class="bl-raid-icon" aria-hidden="true"></span><span class="bl-raid-label">MỞ KHÓA</span></button>
 <div class="bl-raid-guard" hidden><span class="bl-raid-guard-icon" aria-hidden="true"></span><span class="bl-raid-guard-text">NHÀ ĐANG ĐƯỢC BẢO VỆ</span><b class="bl-raid-guard-timer">00:00</b></div>
 <span class="bl-raid-away" hidden>Đến gần để xem khóa nhà</span>
 <div class="bl-raid-shade" hidden><section class="bl-raid-dialog" role="dialog" aria-modal="true" aria-labelledby="bl-raid-title">
  <h2 class="bl-raid-title" id="bl-raid-title">XÁC NHẬN MỞ KHÓA</h2><button class="bl-raid-close" type="button" aria-label="Đóng"></button>
  <div class="bl-raid-body">
   <img class="bl-raid-premium-lock" src="assets/base-lock/lock.png" alt="" hidden>
   <p class="bl-raid-copy">Bạn có muốn mở khóa nhà này với giá:</p>
   <p class="bl-raid-price"><span class="bl-coin" aria-hidden="true"></span><b>28</b></p>
   <p class="bl-raid-reason" hidden></p>
   <div class="bl-raid-left" hidden><span>Mở lại sau</span><b class="bl-raid-countdown">00:00</b></div>
   <div class="bl-raid-actions"><button class="bl-raid-no" type="button">KHÔNG</button><button class="bl-raid-yes" type="button">CÓ</button></div>
  </div></section></div>`);
 const raidTest=document.createElement('div');raidTest.className='bl-raid-test';
 raidTest.innerHTML=`<span>Giá mở khóa:</span><label>Rarity cao nhất trộm được <select class="bl-raid-rarity">${Object.keys(UNLOCK_COST).map(r=>`<option${r==='APEX'?' selected':''}>${r}</option>`).join('')}</select></label><label>RB gap <select class="bl-raid-band">${GAP_BANDS.map((b,i)=>`<option value="${i}">${b}</option>`).join('')}</select></label>`;
 q('.bl-test').after(raidTest);
 viewNav.querySelectorAll('button').forEach(button=>button.onclick=()=>{view=button.dataset.blView;raidDialog=null;if(view==='thief'&&state==='dialog')state=remaining()>0?'locked':'near';render();});
 q('.bl-raid-rarity').onchange=e=>{raidRarity=e.target.value;render();};
 q('.bl-raid-band').onchange=e=>{raidGap=Number(e.target.value);render();};
 function openRaid(){ raidDialog = remaining()>0 ? 'blocked' : 'confirm'; render(); (raidDialog==='blocked'?q('.bl-raid-yes'):q('.bl-raid-no')).focus(); }
 function closeRaid(){ raidDialog=null; render(); if(view==='thief')q('.bl-raid').focus(); }
 q('.bl-raid').onclick=openRaid;
 q('.bl-raid-close').onclick=closeRaid; q('.bl-raid-no').onclick=closeRaid;
 q('.bl-raid-yes').onclick=()=>{
  if(raidDialog==='blocked'){closeRaid();return;}
  if(remaining()>0){raidDialog='blocked';render();notify('Nhà đang được khóa bằng Lock Token, không thể mở khóa.');return;}
  if(raidCoins<raidPrice()){notify('Không đủ Pet Coin');return;}
  raidCoins-=raidPrice();closeRaid();notify(`Đã mở khóa nhà · Trừ ${raidPrice()} Pet Coin`);
 };
 pane.addEventListener('keydown',e=>{ if(raidDialog&&e.key==='Escape'){e.preventDefault();closeRaid();} });
 function renderRaid(){
  const seconds=remaining(), active=seconds>0, thief=view==='thief';
  // Trạng thái bảo vệ đổi khi popup đang mở: đổi luôn nội dung popup, không để người chơi bấm nhầm.
  if(raidDialog==='confirm'&&active)raidDialog='blocked';
  else if(raidDialog==='blocked'&&!active)raidDialog='confirm';
  pane.dataset.view=view;
  viewNav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.blView===view)));
  raidTest.hidden=!thief;
  q('.bl-raid').hidden=!thief||!near||raidDialog!==null;
  q('.bl-raid').dataset.blocked=String(active);
  q('.bl-raid-label').textContent='MỞ KHÓA';
  // Băng bảo vệ dùng chung tầm với nút mở khóa (chốt 25/11/2026), nên cũng tắt khi đứng xa.
  q('.bl-raid-guard').hidden=!thief||!active||!near;
  q('.bl-raid-away').hidden=!thief||near;
  q('.bl-raid-guard-timer').textContent=formatTime(seconds);
  q('.bl-raid-shade').hidden=!thief||raidDialog===null;
  const blocked=raidDialog==='blocked';
  q('.bl-raid-dialog').dataset.mode=raidDialog||'confirm';
  q('.bl-raid-title').textContent=blocked?'KHÔNG THỂ MỞ KHÓA':'XÁC NHẬN MỞ KHÓA';
  q('.bl-raid-premium-lock').hidden=!blocked;
  q('.bl-raid-copy').textContent=blocked?'Nhà này đang được khóa bằng Lock Token, không thể mở khóa.':'Bạn có muốn mở khóa nhà này với giá:';
  q('.bl-raid-price').hidden=blocked;
  q('.bl-raid-price b').textContent=raidPrice();
  q('.bl-raid-reason').hidden=!blocked;
  q('.bl-raid-reason').textContent='Vui lòng chờ hết thời gian bảo vệ.';
  q('.bl-raid-left').hidden=!blocked;
  q('.bl-raid-countdown').textContent=formatTime(seconds);
  q('.bl-raid-no').hidden=blocked;
  q('.bl-raid-yes').textContent=blocked?'ĐÃ HIỂU':'CÓ';
 }
 q('.bl-interact').onclick = open;
 q('.bl-close').onclick = close;
 q('.bl-use').onclick = activate;
 q('.bl-minus').onclick = () => chooseQuantity(quantity - 1);
 q('.bl-plus').onclick = () => chooseQuantity(quantity + 1);
 q('.bl-max').onclick = () => chooseQuantity(inventory);
 q('.bl-clear-selection').onclick = () => { chooseQuantity(0); q('.bl-token-range').focus(); };
 q('.bl-token-range').oninput = e => chooseQuantity(Number(e.target.value));
 q('.bl-reset').onclick = reset;
 pane.querySelectorAll('[data-bl-step]').forEach(b => b.onclick = () => { reset(); if (b.dataset.blStep !== 'near') open(); if (b.dataset.blStep === 'locked' && state === 'dialog') { chooseQuantity(4); activate(); close(); } });
 q('.bl-distance').onclick = () => {near = !near; if (state === 'dialog') state = remaining()>0?'locked':'near'; render(); };
 q('.bl-expire').onclick = () => { expires = 0; if(state!=='dialog')state = 'near'; render(); notify('Đã hết thời gian bảo vệ · Nạp token để bảo vệ tiếp'); };
 q('.bl-empty').onclick = () => { reset(); inventory=0; open(); };
 pane.addEventListener('keydown', e => {
  if (state !== 'dialog'||!e.target.closest('.bl-dialog')) return;
  if (e.key === 'Escape') { e.preventDefault(); close(); }
  if (e.key === 'Tab') { const buttons = [...q('.bl-dialog').querySelectorAll('button:not(:disabled), input:not(:disabled)')]; const index = buttons.indexOf(document.activeElement); const next = (index + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length; e.preventDefault(); buttons[next].focus(); }
 });
 new ResizeObserver(() => { const frame=q('.bl-frame'),stage=q('.bl-stage');const scale=Math.max(frame.clientWidth/1774,frame.clientHeight/993);stage.style.transform=`scale(${scale})`;stage.style.left=`${(frame.clientWidth-1774*scale)/2}px`;stage.style.top=`${(frame.clientHeight-993*scale)/2}px`; }).observe(q('.bl-frame'));
 setInterval(() => { if(expires>0&&!remaining()){expires=0;if(state==='locked')state='near';notify('Đã hết thời gian bảo vệ · Nạp token để bảo vệ tiếp');render();} if(state==='dialog'||expires>0)render(); if (toastUntil && Date.now() >= toastUntil) { q('.bl-toast').hidden = true; toastUntil = 0; } }, 250);
 render();
})();
