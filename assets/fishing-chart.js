(function(){
'use strict';
const colors={COMMON:'#9db4c5',RARE:'#59baff',EPIC:'#bf8cff',LEGENDARY:'#ffd45a',MYTHIC:'#ff7897',APEX:'#53ead2'},rarities=Object.keys(colors);
window.FishingChart=function(host){
 host.className='fishingChart';host.hidden=true;
 host.innerHTML='<div class="chartHeading"><h3>Cá hiếm theo lượt câu</h3><label>Theo dõi <select><option value="LEGENDARY">LEGENDARY trở lên</option><option value="RARE">RARE trở lên</option><option value="EPIC">EPIC trở lên</option><option value="MYTHIC">MYTHIC trở lên</option><option value="APEX">APEX</option></select></label></div><p class="chartRun"></p><div class="chartMetrics"></div><svg viewBox="0 0 800 280" role="img" aria-label="Số cá hiếm tích lũy theo số lượt câu"></svg><p class="chartLegend">━━ Thực tế &nbsp; ┄┄ Lý thuyết · Trục ngang: lượt câu · Trục dọc: số cá tích lũy</p><div class="genTableScroll chartFirst"></div><p>Đường lý thuyết là giá trị trung bình, không bảo đảm cá hiếm sau một số lượt cố định. Tap và Gen không tăng độ hiếm của cá.</p>';
 let report;const select=host.querySelector('select'),fmt=n=>n.toLocaleString('vi-VN');
 function render(r){
  if(!r?.iterations)return;report=r;host.hidden=false;
  const allowed=rarities.slice(rarities.indexOf(select.value)),sum=c=>allowed.reduce((s,k)=>s+(c[k]||0),0),count=sum(r.rarityCounts),profile=FishingPool.profile(r.rebirth),chance=FishingConfig.pets.filter(p=>allowed.includes(p.rarity)).reduce((s,p)=>s+p.weights[profile.index],0)/profile.total;
  const first=allowed.map(k=>r.rarityFirst[k]).filter(Boolean).sort((a,b)=>a.cast-b.cast)[0];
  host.querySelector('.chartRun').textContent=r.name+' · '+r.band+' · '+fmt(r.iterations)+' lượt';
  host.querySelector('.chartMetrics').textContent='Đã gặp: '+fmt(count)+' cá · Lần đầu: '+(first?'lượt '+fmt(first.cast)+' ('+first.pet+')':'chưa xuất hiện')+' · Tỉ lệ pool: '+(chance*100).toLocaleString('vi-VN',{maximumFractionDigits:4})+'%';
  const points=[...r.timeline];if(points.at(-1).cast!==r.iterations)points.push({cast:r.iterations,counts:r.rarityCounts});
  const max=Math.max(1,count,r.iterations*chance),x=n=>58+n/r.iterations*720,y=n=>230-n/max*205;
  let svg='';for(let i=0;i<=4;i++){const v=max*i/4;svg+='<line x1="58" y1="'+y(v)+'" x2="778" y2="'+y(v)+'" stroke="#315066"/><text x="48" y="'+(y(v)+4)+'" text-anchor="end">'+fmt(Math.round(v*10)/10)+'</text>';const n=Math.round(r.iterations*i/4);svg+='<text x="'+x(n)+'" y="255" text-anchor="middle">'+fmt(n)+'</text>';}
  svg+='<path d="M58 230 L778 '+y(r.iterations*chance)+'" fill="none" stroke="#afc6da" stroke-dasharray="7 5" stroke-width="2"/><polyline points="'+points.map(p=>x(p.cast)+','+y(sum(p.counts))).join(' ')+'" fill="none" stroke="'+colors[select.value]+'" stroke-width="3"/>';
  host.querySelector('svg').innerHTML=svg;
  const table=document.createElement('table');table.innerHTML='<thead><tr><th>Độ hiếm</th><th>Số cá</th><th>Lượt đầu tiên</th><th>Pet đầu tiên</th></tr></thead>';
  const body=table.createTBody();for(const k of rarities){const row=body.insertRow();for(const val of [k,fmt(r.rarityCounts[k]||0),r.rarityFirst[k]?fmt(r.rarityFirst[k].cast):'Chưa gặp',r.rarityFirst[k]?.pet||'—'])row.insertCell().textContent=val;row.cells[0].style.color=colors[k];}
  host.querySelector('.chartFirst').replaceChildren(table);
 }
 select.addEventListener('change',()=>render(report));return {render,reset(){host.hidden=true;report=null;}};
};
})();
