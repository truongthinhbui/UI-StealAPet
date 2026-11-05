(function(){
  'use strict';
  const root=document.getElementById('tab-fishing'),debug=root.querySelector('.fishingDebugPanel'),page=root.querySelector('#debug-page-catalog');
  const oldCatalog=page.querySelector('.genCatalog');
  page.querySelector('h3').textContent='Pool cá & Muta/Weather Gen';
  const shell=document.createElement('section');shell.className='poolBrowser';
  shell.innerHTML='<div class="poolTabs" role="tablist" aria-label="Pool dữ liệu"><button type="button" data-pool="fish" role="tab" id="pool-tab-fish" aria-controls="pool-panel-fish">Fish Pool <small>35</small></button><button type="button" data-pool="gen" role="tab" id="pool-tab-gen" aria-controls="pool-panel-gen">Muta/Weather Pool <small>17</small></button></div><div class="poolFilters"><label>Tìm nhanh <input class="poolSearch" type="search" placeholder="Tên hoặc ID"></label><label>Rebirth <select class="poolBand"></select></label><label>Nhóm <select class="poolGroup"></select></label><label class="poolFamilyLabel">Nguồn Gen <select class="poolFamily"><option value="all">Tất cả</option><option value="MutaGen">MutaGen</option><option value="WeatherGen">WeatherGen</option></select></label></div><div class="poolToolbar"><label><input class="poolAllBands" type="checkbox"> Xem cả 5 mốc Rebirth</label><button type="button" class="poolCurrent">Theo Rebirth đang chơi</button><button type="button" class="poolCsv">CSV pool đã lọc</button></div><p class="poolNote"></p><output class="poolStats" aria-live="polite"></output><section id="pool-panel-fish" role="tabpanel" aria-labelledby="pool-tab-fish"><div class="poolFishTable genTableScroll"></div></section><section id="pool-panel-gen" role="tabpanel" aria-labelledby="pool-tab-gen" hidden><div class="poolGenTable genTableScroll"></div></section><p class="poolVersion"></p>';
  page.insertBefore(shell,oldCatalog);
  const $=selector=>shell.querySelector(selector),tiers={basic:'COMMON',uncommon:'RARE',advanced:'EPIC',rare:'LEGENDARY',epic:'MYTHIC',exclusive:'APEX'};
  for(const [index,band] of window.FishingConfig.bands.entries()){const option=document.createElement('option');option.value=index;option.textContent=band.label;$('.poolBand').appendChild(option);}
  let kind='fish';
  const bands=()=>kind==='fish'?window.FishingConfig.bands:window.GenConfig.rebirthProfiles;
  const currentIndex=()=>Math.max(0,bands().findIndex(b=>window.FishingRewards.settings.rebirth>=b.min&&(b.max===null||window.FishingRewards.settings.rebirth<=b.max)));
  const configDownload=document.createElement('button');configDownload.type='button';configDownload.className='poolConfigDownload';configDownload.textContent='Tải config JSON';
  $('.poolToolbar').appendChild(configDownload);
  configDownload.addEventListener('click',()=>{
    const config={schemaVersion:1,exportedAt:new Date().toISOString(),description:'Full active Fishing and merged Muta/Weather Gen configuration; independent of table filters.',rollOrder:['fish','genCount','genTypes'],fishing:window.FishingConfig,gen:window.GenConfig};
    const url=URL.createObjectURL(new Blob([JSON.stringify(config,null,2)],{type:'application/json;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='fishing-pool-config.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  });
  $('.poolAllBands').checked=true;
  const horizontal=document.createElement('div');horizontal.className='poolHorizontalControls';
  horizontal.innerHTML='<span>Kéo ngang để xem đủ Weight / Rate của 5 mốc</span><div class="poolHorizontalBar"><button type="button" class="poolScrollLeft" aria-label="Cuộn bảng sang trái">←</button><div class="poolScrollTrack" tabindex="0" aria-label="Thanh cuộn ngang bảng pool"><div></div></div><button type="button" class="poolScrollRight" aria-label="Cuộn bảng sang phải">→</button></div>';
  $('#pool-panel-fish').before(horizontal);
  const track=horizontal.querySelector('.poolScrollTrack'),spacer=track.firstElementChild;
  function activeTable(){return $(kind==='fish'?'.poolFishTable':'.poolGenTable');}
  function refreshScroll(){
    const wrapper=activeTable(),overflow=wrapper.scrollWidth-wrapper.clientWidth;
    horizontal.hidden=wrapper.clientWidth===0||overflow<2;
    spacer.style.width=wrapper.scrollWidth+'px';
    if(track.scrollLeft!==wrapper.scrollLeft)track.scrollLeft=wrapper.scrollLeft;
    horizontal.querySelector('.poolScrollLeft').disabled=wrapper.scrollLeft<1;
    horizontal.querySelector('.poolScrollRight').disabled=wrapper.scrollLeft>=overflow-1;
  }
  track.addEventListener('scroll',()=>{if(activeTable().scrollLeft!==track.scrollLeft)activeTable().scrollLeft=track.scrollLeft;refreshScroll();});
  for(const wrapper of [$('.poolFishTable'),$('.poolGenTable')])wrapper.addEventListener('scroll',refreshScroll);
  horizontal.querySelector('.poolScrollLeft').addEventListener('click',()=>{activeTable().scrollLeft-=activeTable().clientWidth*.75;refreshScroll();});
  horizontal.querySelector('.poolScrollRight').addEventListener('click',()=>{activeTable().scrollLeft+=activeTable().clientWidth*.75;refreshScroll();});
  const resize=new ResizeObserver(refreshScroll);resize.observe($('.poolFishTable'));resize.observe($('.poolGenTable'));
  const fullRows=document.createElement('label');
  fullRows.innerHTML='<input class="poolFullRows" type="checkbox" checked> Hiện toàn bộ dòng';
  shell.querySelector('.poolToolbar').insertBefore(fullRows,$('.poolCurrent'));
  shell.classList.add('poolExpanded');
  $('.poolFullRows').addEventListener('change',()=>shell.classList.toggle('poolExpanded',$('.poolFullRows').checked));
  const number=value=>value.toLocaleString('vi-VN'),percent=value=>(value*100).toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:4})+'%';
  function table(headers,rows){
    const t=document.createElement('table'),head=t.createTHead(),tr=head.insertRow();
    for(const label of headers){const th=document.createElement('th');th.scope='col';th.textContent=label;tr.appendChild(th);}
    const body=t.createTBody();for(const values of rows){const row=body.insertRow();for(const value of values){const cell=row.insertCell();if(value instanceof Node)cell.appendChild(value);else cell.textContent=String(value);}}
    return t;
  }
  function list(){
    const query=$('.poolSearch').value.trim().toLowerCase(),group=$('.poolGroup').value,family=$('.poolFamily').value;
    return (kind==='fish'?window.FishingConfig.pets:window.GenConfig.catalog).filter(item=>(!query||item.name.toLowerCase().includes(query)||String(item.id).toLowerCase().includes(query))&&(group==='all'||(kind==='fish'?item.rarity:item.tier)===group)&&(kind==='fish'||family==='all'||item.family===family));
  }
  function weight(item,index){return kind==='fish'?item.weights[index]:item.fishingEnabled?window.GenConfig.rebirthProfiles[index].weights[item.id]||0:0;}
  function total(index){return kind==='fish'?window.FishingPool.profile(window.FishingConfig.bands[index].min).total:window.GenCore.profile(window.GenConfig.rebirthProfiles[index].min).total;}
  function render(){
    const index=Number($('.poolBand').value),all=$('.poolAllBands').checked,items=list(),band=bands()[index];
    shell.classList.toggle('poolAllColumns',all);$('.poolBand').disabled=all;
    const headers=['ID',kind==='fish'?'Cá':'Gen','Nhóm',kind==='fish'?'Rank':'Family',...(all?[...bands().map(b=>'Weight '+b.label),...bands().map(b=>'Rate '+b.label)]:['Weight '+band.label,'Rate '+band.label])];
    const rows=items.map(item=>{
      let label=item.name;if(kind==='gen'){label=document.createElement('span');label.className='genCatalogLabel';label.append(window.GenCore.icon(item),document.createTextNode(item.name));}
      return [item.id,label,kind==='fish'?item.rarity:tiers[item.tier],kind==='fish'?item.rank:item.family,...(all?[...bands().map((_,b)=>number(weight(item,b))),...bands().map((_,b)=>percent(weight(item,b)/total(b)))]:[number(weight(item,index)),percent(weight(item,index)/total(index))])];
    });
    $(kind==='fish'?'.poolFishTable':'.poolGenTable').replaceChildren(table(headers,rows));
    $('.poolStats').textContent='Hiện '+items.length+' / '+(kind==='fish'?window.FishingConfig.pets.length:window.GenConfig.catalog.length)+' loại · '+(all?'Đủ 5 mốc · 5 cột Weight + 5 cột Rate':band.label+' · Tổng weight pool trước lọc: '+number(total(index)));
    $('.poolNote').textContent=kind==='fish'?'Roll cá trước theo pool Fishing cũ. Tỉ lệ tính trên toàn pool; tìm kiếm và bộ lọc không thay đổi xác suất.':'Roll Gen sau khi có cá; mỗi cá tối đa 1 Gen. Xanh +5%, vàng +20%, đỏ +0%. Tỉ lệ trong bảng là loại Gen, có điều kiện được nhận Gen. Cả 17 loại đều có thể rơi.';
    $('.poolVersion').textContent='Config: '+(kind==='fish'?window.FishingConfig.version:window.GenConfig.version)+' · Bảng chỉ để xem, không đổi cấu hình đang chơi.';
    activeTable().scrollLeft=0;requestAnimationFrame(refreshScroll);
  }
  function select(type){
    kind=type;$('.poolBand').replaceChildren();for(const [i,b] of bands().entries()){const o=document.createElement('option');o.value=i;o.textContent=b.label;$('.poolBand').appendChild(o);}$('.poolBand').value=String(currentIndex());$('.poolSearch').value='';$('.poolGroup').replaceChildren();
    const groups=kind==='fish'?[...new Set(window.FishingConfig.pets.map(p=>p.rarity))]:Object.keys(tiers);
    for(const [id,label] of [['all','Tất cả'],...groups.map(id=>[id,kind==='fish'?id:tiers[id]])]){const option=document.createElement('option');option.value=id;option.textContent=label;$('.poolGroup').appendChild(option);}
    $('.poolFamilyLabel').hidden=kind==='fish';oldCatalog.hidden=kind==='fish';
    for(const button of shell.querySelectorAll('[data-pool]')){const active=button.dataset.pool===kind;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}
    $('#pool-panel-fish').hidden=kind!=='fish';$('#pool-panel-gen').hidden=kind!=='gen';render();
  }
  shell.querySelector('.poolTabs').addEventListener('click',event=>{const button=event.target.closest('[data-pool]');if(button)select(button.dataset.pool);});
  shell.querySelector('.poolTabs').addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();select(event.key==='Home'?'fish':event.key==='End'?'gen':kind==='fish'?'gen':'fish');shell.querySelector('[data-pool="'+kind+'"]').focus();}});
  for(const selector of ['.poolBand','.poolGroup','.poolFamily','.poolAllBands'])$(selector).addEventListener('change',render);$('.poolSearch').addEventListener('input',render);
  function current(){ $('.poolBand').value=String(currentIndex());render(); }
  $('.poolCurrent').addEventListener('click',()=>{$('.poolAllBands').checked=false;current();});
  $('.poolCsv').addEventListener('click',()=>{
    const rows=[['Config','ID','Name','Group','Family',...bands().flatMap(b=>['Weight_'+b.label,'Rate_'+b.label])]];
    for(const item of list())rows.push([kind==='fish'?window.FishingConfig.version:window.GenConfig.version,item.id,item.name,kind==='fish'?item.rarity:tiers[item.tier],kind==='fish'?'Fish':item.family,...bands().flatMap((_,index)=>[weight(item,index),weight(item,index)/total(index)])]);
    const csv='\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=(kind==='fish'?'fish':'muta-weather-gen')+'-pool.csv';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  });
  oldCatalog.open=false;oldCatalog.querySelector(':scope>summary').hidden=false;oldCatalog.querySelector(':scope>summary').textContent='Tham khảo giá & xác suất dùng item gốc';page.appendChild(oldCatalog);
  const shortcuts=document.createElement('div');shortcuts.className='fishingPoolLinks';
  for(const [type,label] of [['fish','Xem Fish Pool'],['gen','Xem Muta/Weather Pool']]){const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',()=>{debug.open=true;root.querySelector('[data-debug-page="catalog"]').click();current();select(type);page.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});shortcuts.appendChild(button);}
  debug.before(shortcuts);current();select('fish');
})();
