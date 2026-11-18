/* Lucky Kick prototype. Economy values below are demo settings, pending GDD configuration. */
(function(){
'use strict';
const root=document.getElementById('tab-kick-ball');if(!root)return;
const config={cap:300,slots:8,luck:.2,petPrice:600,cycle:600000};
let phase='room',remaining=0,gems=0,daily=0,claimed=false,luckyReward=0,target=0,nextSpawn=Date.now()+config.cycle,balls=5,players=6;
root.innerHTML=`<div class="kickHero"><div><span class="kickEyebrow">EVENT · 21 DAYS</span><h2>LUCKY KICK <span>⚽</span></h2><p>Tranh bóng. Mang về nhà. Sút vận may!</p></div><div class="kickWallet">◆ <strong id="kickWallet">0</strong> Gems<br><small id="kickDaily"></small></div></div><div class="kickLayout"><section class="kickArena"><div class="kickTopline"><span id="kickPhase"></span><span id="kickTimer"></span></div><div class="kickPitch"><div class="kickGoal"><i></i><i></i><i></i><i></i><i></i></div><div class="kickTargets" aria-label="Chọn vùng sút"></div><div class="kickBall" aria-hidden="true">⚽</div><div class="kickShield" hidden>🛡 Được bảo vệ · Không thể bị cướp, đẩy hoặc choáng</div></div><div class="kickMessage" role="status" aria-live="polite"></div><div class="kickActions"><button id="kickMain" type="button"></button><button id="kickShopToggle" type="button">◆ Event Shop</button></div><p class="kickHint"></p></section><aside class="kickAside"><h3>ĐƯỜNG ĐẾN CHIẾN THẮNG</h3><ol><li>Nhặt bóng ở giữa bản đồ.</li><li>Mang bóng về nhà an toàn.</li><li>Chọn vùng sáng để ghi bàn.</li><li>Gặp Luck? Hoàn thành cú sút thứ hai để nhận x4!</li></ol><div class="kickPrize"><span>✦ EVENT EXCLUSIVE ✦</span><div>🏆</div><strong>Event Exclusive Pet</strong><p>Mỗi tài khoản nhận tối đa 1 lần.</p></div><details><summary>Thiết lập prototype</summary><p>GDD có điểm chưa thống nhất về thưởng sau cap. Demo dùng Goal 2 / Critical 5 sau cap; trước cap 10 / 30. Luck x4 chỉ áp dụng sau cú sút thứ hai thành công.</p><p>Thông số demo: 300 Gems/ngày, 8 lượt/bóng, Luck 20%, pet 600 Gems. Chưa có giá shop theo ngày trong GDD.</p><label>Người chơi trong phòng <input id="kickPlayers" type="number" min="2" max="20" value="6"></label><button id="kickNext" type="button">Mô phỏng chu kỳ tiếp theo</button><button id="kickDay" type="button">Mô phỏng ngày mới</button><button id="kickLuck" type="button">Thử Luck ở cú trúng tiếp theo</button></details></aside></div><section class="kickShop" hidden><h3>◆ EVENT SHOP</h3><p>Event Exclusive Pet · 600 Gems · 1/tài khoản (giá demo)</p><button id="kickBuy" type="button">Đổi pet</button><p id="kickShopStatus" role="status"></p></section>`;
const $=s=>root.querySelector(s),message=$('.kickMessage'),main=$('#kickMain');
for(let i=0;i<5;i++){const b=document.createElement('button');b.type='button';b.textContent=String(i+1);b.setAttribute('aria-label','Sút vùng '+(i+1));b.addEventListener('click',()=>shoot(i));$('.kickTargets').append(b);}
let forceLuck=false;
function aim(){target=Math.floor(Math.random()*5);}
function award(value){gems+=value;daily+=value;}
function render(){
$('#kickWallet').textContent=gems;$('#kickDaily').textContent=`Hôm nay: ${daily} / ${config.cap} Gems`;
$('#kickPhase').textContent={room:`GIỮA BẢN ĐỒ · ${balls} bóng / ${players} người`,carry:'MANG BÓNG VỀ NHÀ',home:'SÂN NHÀ · CHỌN VÙNG SÁNG',luck:'LUCK ×4 · CÚ SÚT THỨ HAI',spent:'BÓNG ĐÃ HẾT THƯỞNG'}[phase];
$('.kickShield').hidden=phase!=='carry';root.dataset.phase=phase;
main.hidden=phase==='home'||phase==='luck';main.disabled=phase==='room'&&balls===0;
main.textContent=phase==='room'?'⚽ Nhặt bóng':phase==='carry'?'🛡 Mang về nhà':'Trở lại giữa bản đồ';
$('.kickHint').textContent=phase==='room'?'Ai tương tác trước nhận bóng trước. Mỗi chu kỳ có số bóng bằng số người chơi − 1.':phase==='carry'?'Bảo vệ chỉ áp dụng cho bóng sự kiện.':'Không giới hạn thời gian. Vùng sáng: Goal · Vùng giữa: Critical Goal. Trượt không mất lượt thưởng.';
$('.kickTargets').querySelectorAll('button').forEach((b,i)=>{b.disabled=!['home','luck'].includes(phase);b.classList.toggle('lit',i===target&&['home','luck'].includes(phase));b.setAttribute('aria-label',`Sút vùng ${i+1}${i===target?' · Vùng sáng':''}`);});
$('#kickBuy').disabled=claimed||gems<config.petPrice;$('#kickBuy').textContent=claimed?'✓ Đã nhận pet':'Đổi pet · 600 Gems';tick();
}
function finish(){phase=remaining?'home':'spent';aim();}
function shoot(zone){
if(!['home','luck'].includes(phase))return;
const hit=zone===target;
if(phase==='luck'){if(hit){award(luckyReward*4);message.textContent=`LUCK ×4! +${luckyReward*4} Gems`;}else{award(luckyReward);message.textContent=`Chưa trúng Luck. Nhận thưởng gốc +${luckyReward} Gems.`;}luckyReward=0;finish();render();return;}
if(!hit){message.textContent='Sút lệch! Chọn vùng sáng để thử lại.';return;}
remaining--;const critical=zone===2,value=daily>=config.cap?(critical?5:2):(critical?30:10);
if(forceLuck||Math.random()<config.luck){forceLuck=false;luckyReward=value;phase='luck';aim();message.textContent='LUCK! Sút trúng vùng sáng một lần nữa để nhân 4 thưởng.';}else{award(value);message.textContent=`${critical?'CRITICAL GOAL!':'GOAL!'} +${value} Gems${remaining?'':' · Bóng đã hết thưởng.'}`;finish();}render();
}
main.addEventListener('click',()=>{if(phase==='room'&&balls){balls--;phase='carry';message.textContent='Đã nhặt bóng! Bạn được bảo vệ trên đường về nhà.';}else if(phase==='carry'){remaining=config.slots;phase='home';aim();message.textContent='Bóng đã đặt tại sân nhà. Chọn vùng sáng để sút!';}else if(phase==='spent'){phase='room';message.textContent='Chờ chu kỳ mới hoặc nhặt bóng còn lại.';}render();});
$('#kickShopToggle').onclick=()=>{$('.kickShop').hidden=!$('.kickShop').hidden;};
$('#kickBuy').onclick=()=>{if(claimed||gems<config.petPrice)return;gems-=config.petPrice;claimed=true;$('#kickShopStatus').textContent='Đã nhận Event Exclusive Pet!';render();};
function spawn(){players=Math.max(2,Math.min(20,Number($('#kickPlayers').value)||6));balls=players-1;nextSpawn=Date.now()+config.cycle;render();}
$('#kickNext').onclick=spawn;$('#kickDay').onclick=()=>{daily=0;message.textContent='Ngày mới: đã đặt lại Gems nhận trong ngày.';render();};$('#kickLuck').onclick=()=>{forceLuck=true;message.textContent='Cú trúng tiếp theo sẽ kích hoạt Luck (demo).';};
function tick(){if(Date.now()>=nextSpawn){spawn();return;}const s=Math.ceil((nextSpawn-Date.now())/1000);$('#kickTimer').textContent=`Bóng mới sau ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
setInterval(tick,1000);message.textContent='Bóng đã xuất hiện ở giữa bản đồ. Nhặt một quả để bắt đầu!';render();
})();
