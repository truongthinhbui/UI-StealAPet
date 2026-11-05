(function(){
'use strict';
const colors={COMMON:'#31c779',RARE:'#59baff',EPIC:'#bf8cff',LEGENDARY:'#f05252',MYTHIC:'#ffcc40',APEX:'#53ead2'},rarities=Object.keys(colors);
window.FishingChart=function(host){
 host.className='fishingChart';host.hidden=true;
 host.innerHTML='<div class="chartHeading"><h3>Kết quả theo lượt câu</h3><label>Biểu đồ <select class="chartMode"><option value="pet">Pet</option><option value="gen">Gen</option><option value="combo">Pet + Gen</option></select></label><label class="chartPetLabel">Pet <select class="chartPet"></select></label><label class="chartGenLabel">Gen <select class="chartGen"></select></label></div><p class="chartRun"></p><div class="chartMetrics"></div><svg viewBox="0 0 800 280" role="img" aria-label="Số kết quả tích lũy theo lượt câu"></svg><p class="chartLegend">━━ Thực tế &nbsp; ┄┄ Lý thuyết · Trục ngang: lượt câu · Trục dọc: số kết quả tích lũy</p><div class="genTableScroll chartFirst"></div><p>Thống kê đủ mọi lượt, kể cả sau giới hạn nhật ký. Đường lý thuyết là trung bình, không bảo đảm thời điểm xuất hiện. Tap không tăng độ hiếm pet.</p>';
 const $=s=>host.querySelector(s),mode=$('.chartMode'),pet=$('.chartPet'),gen=$('.chartGen'),fmt=n=>n.toLocaleString('vi-VN');let report;
 function option(select,value,label){const o=document.createElement('option');o.value=value;o.textContent=label;select.appendChild(o);}
 option(pet,'all','Tất cả pet');for(const k of rarities.slice(1))option(pet,'rarity:'+k,k+' trở lên');for(const p of FishingConfig.pets)option(pet,String(p.id),p.name);pet.value='rarity:LEGENDARY';
 function genOptions(){const prev=gen.value;gen.replaceChildren();option(gen,'all','Bất kỳ Gen');if(mode.value==='combo')option(gen,'none','Không Gen');for(const g of GenConfig.catalog)option(gen,g.id,g.name);gen.value=[...gen.options].some(o=>o.value===prev)?prev:'all';}
 genOptions();
 function render(r){
  if(!r?.iterations)return;report=r;host.hidden=false;
  $('.chartPetLabel').hidden=mode.value==='gen';$('.chartGenLabel').hidden=mode.value==='pet';
  const allowed=pet.value.startsWith('rarity:')?rarities.slice(rarities.indexOf(pet.value.slice(7))):rarities;
  const pets=FishingConfig.pets.filter(p=>pet.value==='all'||pet.value.startsWith('rarity:')&&allowed.includes(p.rarity)||String(p.id)===pet.value),ids=new Set(pets.map(p=>String(p.id))),profile=FishingPool.profile(r.rebirth),petChance=pets.reduce((s,p)=>s+p.weights[profile.index],0)/profile.total;
  const genChance=gen.value==='none'?r.expected.none:gen.value==='all'?1-r.expected.none:r.expected.gen[gen.value]||0;
  const chance=mode.value==='pet'?petChance:mode.value==='gen'?genChance:petChance*genChance;
  const matches=c=>ids.has(String(c.petId))&&(gen.value==='none'?!c.genIds.length:gen.value==='all'?c.genIds.length>0:c.genIds.includes(gen.value));
  const combos=Object.entries(r.combinations).filter(([,c])=>matches(c));
  const sum=s=>mode.value==='pet'?pets.reduce((n,p)=>n+(s.pets?.[p.id]||0),0):mode.value==='gen'?(gen.value==='all'?Object.values(s.gens||{}).reduce((a,b)=>a+b,0):s.gens?.[gen.value]||0):combos.reduce((n,[k])=>n+(s.combos?.[k]||0),0);
  const endpoint={cast:r.iterations,pets:Object.fromEntries(Object.entries(r.petCounts).map(([k,v])=>[k,v.count])),gens:r.counts,combos:Object.fromEntries(Object.entries(r.combinations).map(([k,v])=>[k,v.count]))},count=sum(endpoint);
  const firsts=mode.value==='pet'?pets.map(p=>r.petCounts[p.id]?.firstCast):mode.value==='gen'?(gen.value==='all'?Object.values(r.genFirst):[r.genFirst[gen.value]]):combos.map(([,c])=>c.firstCast),first=Math.min(...firsts.filter(Boolean));
  $('.chartRun').textContent=r.name+' · '+r.band+' · '+fmt(r.iterations)+' lượt';
  $('.chartMetrics').textContent='Đã gặp: '+fmt(count)+' · Lần đầu: '+(Number.isFinite(first)?'lượt '+fmt(first):'chưa xuất hiện')+' · Lý thuyết / lượt: '+(chance*100).toLocaleString('vi-VN',{maximumFractionDigits:6})+'%';
  const points=[...r.timeline];if(points.at(-1).cast!==r.iterations)points.push(endpoint);
  const max=Math.max(1,count,r.iterations*chance),x=n=>58+n/r.iterations*720,y=n=>230-n/max*205;let svg='';
  for(let i=0;i<=4;i++){const v=max*i/4,n=Math.round(r.iterations*i/4);svg+='<line x1="58" y1="'+y(v)+'" x2="778" y2="'+y(v)+'" stroke="#315066"/><text x="48" y="'+(y(v)+4)+'" text-anchor="end">'+fmt(Math.round(v*10)/10)+'</text><text x="'+x(n)+'" y="255" text-anchor="middle">'+fmt(n)+'</text>';}
  svg+='<path d="M58 230 L778 '+y(r.iterations*chance)+'" fill="none" stroke="#afc6da" stroke-dasharray="7 5" stroke-width="2"/><polyline points="'+points.map(p=>x(p.cast)+','+y(sum(p))).join(' ')+'" fill="none" stroke="'+(mode.value==='pet'?colors[pet.value.slice(7)]||'#59baff':mode.value==='gen'?'#bf8cff':'#53ead2')+'" stroke-width="3"/>'; $('svg').innerHTML=svg;
  const rows=mode.value==='pet'?pets.map(p=>[p.name,p.rarity,r.petCounts[p.id]?.count||0,r.petCounts[p.id]?.firstCast]):mode.value==='gen'?GenConfig.catalog.filter(g=>gen.value==='all'||g.id===gen.value).map(g=>[g.name,({basic:'COMMON',uncommon:'RARE',advanced:'EPIC',rare:'LEGENDARY',epic:'MYTHIC',exclusive:'APEX'})[g.tier],r.counts[g.id]||0,r.genFirst[g.id]]):combos.map(([,c])=>[c.pet,c.genIds.map(id=>GenConfig.catalog.find(g=>g.id===id)?.name||id).join(' + ')||'Không Gen',c.count,c.firstCast]);
  rows.sort((a,b)=>b[2]-a[2]);const table=document.createElement('table');table.innerHTML='<thead><tr><th>'+(mode.value==='gen'?'Gen':'Pet')+'</th><th>'+(mode.value==='combo'?'Gen':'Độ hiếm')+'</th><th>Số lần</th><th>Lượt đầu tiên</th></tr></thead>';const body=table.createTBody();for(const data of rows){const row=body.insertRow();for(const v of [data[0],data[1],fmt(data[2]),data[3]?fmt(data[3]):'Chưa gặp'])row.insertCell().textContent=v;}$('.chartFirst').replaceChildren(table);
 }
 mode.addEventListener('change',()=>{genOptions();render(report);});pet.addEventListener('change',()=>render(report));gen.addEventListener('change',()=>render(report));return {render,reset(){host.hidden=true;report=null;}};
};
})();
