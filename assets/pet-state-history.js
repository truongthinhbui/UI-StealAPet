(() => {
 'use strict';
 const pane=document.getElementById('tab-pet-state-history');
 if(!pane)return;
 const pets=[{name:'Giraffe',rarity:'LEGENDARY',level:14,icon:'🦒'},{name:'Owl',rarity:'EPIC',level:8,icon:'🦉'},{name:'Crab',rarity:'RARE',level:5,icon:'🦀'}];
 const rarities=['COMMON','RARE','EPIC','LEGENDARY','MYTHIC','APEX','LIMITED'];
 const now=Date.now(),day=86400000;
 const logs=[.02,.15,.7,1.4,2.2,3.5,5.8,6.6].map((age,i)=>({pet:pets[i%3],thief:String(19071564765+i*137),player:['Pandabeo04','KeKho1KOx1v0','Bon2014'][i%3],time:now-age*day}));
 pane.innerHTML=`<p class="ph-note">Demo · Lịch sử pet bị trộm · Dữ liệu minh họa</p><div class="ph-scene"><button class="ph-launch" aria-label="Mở lịch sử pet" aria-haspopup="dialog"><span aria-hidden="true">↶</span>History</button><div class="ph-shade" hidden><section class="ph-panel" role="dialog" aria-modal="true" aria-labelledby="ph-title"><h2 id="ph-title">LỊCH SỬ PET</h2><button class="ph-close" aria-label="Đóng lịch sử"></button><div class="ph-body"><div class="ph-filters"><div class="ph-filter-group ph-rarity-group"><span>Rarity</span><div class="ph-rarity-options" role="group" aria-label="Lọc theo rarity"><button type="button" data-rarity="" aria-pressed="true">Tất cả</button>${rarities.map(r=>`<button type="button" data-rarity="${r}" aria-pressed="false">${r}</button>`).join('')}</div></div><div class="ph-filter-group"><span>Thời gian</span><div class="ph-day-options" role="group" aria-label="Lọc theo thời gian">${[1,3,7].map(d=>`<button type="button" data-days="${d}" aria-pressed="${d===7}">${d} ngày</button>`).join('')}</div></div><button class="ph-refresh">↻ Làm mới</button></div><div class="ph-logs" tabindex="0" aria-label="Danh sách lịch sử pet"></div></div></section></div></div>`;
 const shade=pane.querySelector('.ph-shade');
 const q=s=>pane.querySelector(s)||shade.querySelector(s);
 let cooldown=0,rarity="",days=7;
 const date=new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Bangkok',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
 function render(){

  const rows=logs.filter(l=>(!rarity||l.pet.rarity===rarity)&&l.time>=Date.now()-days*day);
  q('.ph-logs').innerHTML=rows.length?rows.map(l=>`<article class="ph-log"><div class="ph-pet-icon" aria-hidden="true">${l.pet.icon}</div><div class="ph-detail"><div class="ph-log-head"><strong>${l.pet.name}</strong><time datetime="${new Date(l.time).toISOString()}">${date.format(l.time)}</time></div><p class="ph-rarity">${l.pet.rarity} · Lv.${l.pet.level} <span class="ph-stolen">BỊ TRỘM</span></p><p>Người trộm: <b>${l.player}</b></p><p>UID người trộm: <code>${l.thief}</code></p></div></article>`).join(''):'<p class="ph-empty">Không có lịch sử phù hợp với bộ lọc.</p>';
 }
 function tick(){const seconds=Math.max(0,Math.ceil((cooldown-Date.now())/1000));q('.ph-refresh').disabled=seconds>0;q('.ph-refresh').textContent=seconds?`↻ Chờ ${seconds}s`:'↻ Làm mới';}
 let savedOverflow='';
 function close(){shade.hidden=true;pane.querySelector('.ph-scene').append(shade);document.body.style.overflow=savedOverflow;q('.ph-launch').focus();}
 q('.ph-launch').onclick=()=>{render();savedOverflow=document.body.style.overflow;if(window.matchMedia('(max-width: 1000px)').matches){document.body.append(shade);document.body.style.overflow='hidden';}shade.hidden=false;shade.querySelector('.ph-close').focus();};
 q('.ph-close').onclick=close;
 q('.ph-refresh').onclick=()=>{if(Date.now()<cooldown)return;cooldown=Date.now()+10000;render();tick();};
 shade.querySelectorAll('[data-rarity]').forEach(button=>button.onclick=()=>{rarity=button.dataset.rarity;shade.querySelectorAll('[data-rarity]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();q('.ph-logs').scrollTop=0;});
 shade.querySelectorAll('[data-days]').forEach(button=>button.onclick=()=>{days=Number(button.dataset.days);shade.querySelectorAll('[data-days]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();q('.ph-logs').scrollTop=0;});
 shade.addEventListener('click',e=>{if(e.target===shade)close();});
 shade.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const elements=[...shade.querySelectorAll('button:not(:disabled),select,input,[tabindex="0"]')];const first=elements[0],last=elements.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 setInterval(tick,250);render();
})();
