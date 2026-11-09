(function(){
  'use strict';
  const core=window.GenCore,config=core.config;
  const host=document.querySelector('#tab-fishing .fishingDebugPanel');
  const panel=document.createElement('section');panel.className='genDebug';
  panel.innerHTML='<h3>Gen · Mô phỏng cân bằng</h3><p>Chung danh mục MutaGen + WeatherGen. Cả 11 Gen có thể xuất hiện; Rarity xếp theo giá Pet Coin grade SSS trong Master Data; tỷ lệ từng Gen theo config đang nạp. Fossilized và Prismatic thuộc APEX. Mô phỏng dùng đúng thuật toán đang chơi, không thay đổi tiền, túi hoặc kết quả chờ.</p><div class="genSimControls"><label>Số lượt / kịch bản <select class="genSimCount"><option value="1000" selected>1.000</option><option value="10000">10.000</option><option value="100000">100.000</option><option value="1000000">1.000.000</option></select></label><label>Seed <input class="genSimSeed" type="number" value="20261105" min="0" max="4294967295"></label><label>Kịch bản <select class="genSimScenario"><option value="all">Tất cả '+core.scenarios.length+' kịch bản</option></select></label><label>Đỏ % <input class="genMixRed" type="number" min="0" max="100" value="30"></label><label>Xanh % <input class="genMixGreen" type="number" min="0" max="100" value="50"></label><label>Vàng % <input class="genMixGold" type="number" min="0" max="100" value="20"></label><button type="button" class="genSimRun">Chạy mô phỏng</button><button type="button" class="genSimStop" disabled>Dừng</button><button type="button" class="genSimExport" disabled>Tải CSV</button></div><output class="genSimStatus" role="status">Chọn số lượt rồi chạy. Tỉ lệ tap chỉ áp dụng cho kịch bản ngẫu nhiên.</output><div class="genSummary genTableScroll"></div><label class="genDetailLabel" hidden>Xem từng Gen <select class="genDetailScenario"></select></label><div class="genDetail genTableScroll"></div><details class="genCatalog"><summary>Danh mục 11 Gen · tỉ lệ và nguồn cân bằng</summary><p>Weight Fishing là cân bằng mới. Giá và xác suất grade S bên dưới lấy từ Master Data, không dùng làm xác suất rơi. Frozen và Frost là hai Gen khác nhau.</p><div class="genTableScroll"></div></details>';
  host.appendChild(panel);
  const $=selector=>panel.querySelector(selector),num=value=>value.toLocaleString('vi-VN');
  const balanceLabel=document.createElement('label');balanceLabel.innerHTML='Mục tiêu Apex + Gen <select class="genBalancePreset"></select><small class="genBalanceInfo"></small>';
  panel.appendChild(balanceLabel);
  for(const [id,preset] of Object.entries(config.balancePresets)){const option=document.createElement('option');option.value=id;option.textContent=preset.label;$('.genBalancePreset').appendChild(option);}
  function balanceInfo(){const p=config.balancePresets[config.activeBalancePreset],pct=n=>n.toLocaleString('vi-VN',{maximumFractionDigits:2})+'%';$('.genBalancePreset').value=config.activeBalancePreset;$('.genBalanceInfo').textContent='Áp dụng chơi thử và mô phỏng. Xanh +'+pct(p.green)+', vàng +'+pct(p.gold)+'; full vàng '+pct(Math.min(100,p.gold*config.rules.taps))+'. Tổng tối đa 100%, tối đa 1 Gen. Mục tiêu trung bình, không bảo đảm.';}
  balanceInfo();
  $('.genBalancePreset').addEventListener('change',()=>{if(running||window.FishingRewards.isCasting){balanceInfo();$('.genSimStatus').textContent='Hãy kết thúc lượt câu hoặc mô phỏng trước khi đổi preset.';return;}core.setBalancePreset($('.genBalancePreset').value);balanceInfo();document.getElementById('tab-fishing').dispatchEvent(new Event('fishingbalancechange'));});
  const rebirthControls=document.createElement('div');rebirthControls.className='genSimControls genRebirthControls';
  rebirthControls.innerHTML='<label>Rebirth mô phỏng <input class="genSimRebirth" type="number" min="9" max="999" value="9"></label><label><input class="genCompareRebirth" type="checkbox"> So sánh R9 / R11 / R13 / R16 / R19</label>';
  $('.genSimControls').before(rebirthControls);
  const fishDetails=document.createElement('section');fishDetails.className='fishingSimDetail';
  fishDetails.innerHTML='<p>Mô phỏng kết quả câu, chưa tính tiền Mua hoặc sức chứa túi. Rebirth đổi pool pet và weight Gen; không đổi điểm tap, số Gen hoặc bảo đảm Gen hiếm.</p><details open><summary>Pet xuất hiện</summary><div class="genPetTable genTableScroll"></div></details><details><summary>Tổ hợp pet + Gen</summary><div class="genComboTable genTableScroll"></div></details><details><summary>Nhật ký từng lượt</summary><div class="genSimControls"><label>Tìm pet <input class="genLogPet" type="search" placeholder="Tên hoặc ID pet"></label><label>Lọc Gen <select class="genLogGen"><option value="all">Tất cả Gen</option><option value="none">Không có Gen</option></select></label><button type="button" class="genLogExport">CSV từng lượt đang xem</button></div><output class="genLogCaption"></output><div class="genLogTable genTableScroll"></div><div class="genLogPages"><button type="button" class="genLogPrev">Trước</button><span class="genLogPage"></span><button type="button" class="genLogNext">Sau</button></div></details>';
  $('.genDetail').after(fishDetails);fishDetails.hidden=true;
  for(const gen of config.catalog){const option=document.createElement('option');option.value=gen.id;option.textContent=gen.name;$('.genLogGen').appendChild(option);}
  let logPage=0;
  const genNames=ids=>ids.map(id=>config.catalog.find(gen=>gen.id===id)?.name||id).join(' + ')||'Không có Gen';
  const formatMoney=cents=>{const value=BigInt(cents);return (value/100n).toString()+'.'+(value%100n).toString().padStart(2,'0');};
  const selectedReport=()=>reports.find(r=>r.runId===$('.genDetailScenario').value);
  const percent=value=>(value*100).toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:4})+'%';
  const tiers={basic:'COMMON',uncommon:'RARE',advanced:'EPIC',rare:'LEGENDARY',epic:'MYTHIC',exclusive:'APEX'};
  for(const scenario of core.scenarios){const option=document.createElement('option');option.value=scenario.id;option.textContent=scenario.name;$('.genSimScenario').appendChild(option);}
  let reports=[],cancelled=false,running=false;
  function table(headers,rows){
    const element=document.createElement('table'),head=document.createElement('thead'),tr=document.createElement('tr');
    for(const title of headers){const th=document.createElement('th');th.scope='col';th.textContent=title;tr.appendChild(th);}head.appendChild(tr);element.appendChild(head);
    const body=document.createElement('tbody');
    for(const cells of rows){const row=document.createElement('tr');for(const content of cells){const cell=document.createElement('td');if(content instanceof Node)cell.appendChild(content);else cell.textContent=content;row.appendChild(cell);}body.appendChild(row);}element.appendChild(body);return element;
  }
  function genLabel(gen){const label=document.createElement('span');label.className='genCatalogLabel';label.append(core.icon(gen),document.createTextNode(gen.name));return label;}
  $('.genCatalog .genTableScroll').appendChild(table(['Gen','Nguồn','Nhóm','Fishing / lần chọn đầu R9','Giá S (Pet Coin)','Chance S cơ bản'],config.catalog.map(gen=>{
    const grade=gen.source.grades.find(g=>g.grade==='S');
    return [genLabel(gen),gen.family,tiers[gen.tier],gen.fishingEnabled?percent(gen.fishingWeight/core.total):'Khóa · 0%',grade?.petCoinCost===null?'Chưa có':String(grade?.petCoinCost??'Chưa có'),grade?.baseChance===null?'Chưa có':percent(grade?.baseChance||0)];
  })));
  $('.genCatalog .genTableScroll').appendChild(table(['Gen / Rebirth',...config.rebirthProfiles.map(p=>p.label)],core.pool.map(gen=>[genLabel(gen),...config.rebirthProfiles.map(p=>percent((p.weights[gen.id]||0)/core.profile(p.min).total))])));
  const chartHost=document.createElement('section');panel.appendChild(chartHost);const chart=window.FishingChart(chartHost);
  function detail(){
    const report=selectedReport();if(!report)return;
    chart.render(report);
    $('.genDetail').replaceChildren(table(['Gen','Số pet có Gen','Thực tế / lượt','Lý thuyết / lượt','Fishing'],config.catalog.map(gen=>[
      genLabel(gen),num(report.counts[gen.id]),percent(report.counts[gen.id]/report.iterations),percent(report.expected.gen[gen.id]),gen.fishingEnabled?tiers[gen.tier]:'Khóa'
    ])));
    const current=window.FishingPool.profile(report.rebirth);
    $('.genPetTable').replaceChildren(table(['Pet','Độ hiếm','Lượt','Thực tế','Lý thuyết','Có Gen'],[...window.FishingConfig.pets].sort((a,b)=>(report.petCounts[b.id]?.count||0)-(report.petCounts[a.id]?.count||0)).map(pet=>{
      const entry=report.petCounts[pet.id];return [pet.name+' (#'+pet.id+')',pet.rarity,num(entry?.count||0),percent((entry?.count||0)/report.iterations),percent(pet.weights[current.index]/current.total),num(entry?.one||0)];
    })));
    $('.genComboTable').replaceChildren(table(['Pet','Độ hiếm','Gen nhận được','Số lượt'],Object.values(report.combinations).sort((a,b)=>b.count-a.count).map(combo=>[combo.pet,combo.rarity,genNames(combo.genIds),num(combo.count)])));
    fishDetails.hidden=false;logPage=0;renderLog();
  }
  function filteredRecords(report){const pet=$('.genLogPet').value.trim().toLowerCase(),gen=$('.genLogGen').value;return report.records.filter(row=>(!pet||row.pet.toLowerCase().includes(pet)||String(row.petId)===pet)&&(gen==='all'||gen==='none'&&!row.genIds.length||row.genIds.includes(gen)));}
  function renderLog(){
    const report=selectedReport();if(!report)return;
    const records=filteredRecords(report),pages=Math.max(1,Math.ceil(records.length/50));logPage=Math.min(logPage,pages-1);
    $('.genLogCaption').textContent='Đã lưu '+num(report.records.length)+' / '+num(report.iterations)+' lượt'+(report.records.length<report.iterations?' (10.000 dòng đầu; thống kê pet và tổ hợp tính đủ mọi lượt)':' (đủ toàn bộ)')+' · Khớp bộ lọc: '+num(records.length);
    $('.genLogTable').replaceChildren(table(['Lượt','Rebirth','Kết quả bấm','Điểm','Pet','Độ hiếm','Gen','Giá Money'],records.slice(logPage*50,logPage*50+50).map(row=>[num(row.cast),row.rebirth,row.pattern.map(type=>({red:'Đỏ',green:'Xanh',gold:'Vàng'})[type]).join(' / '),row.points,row.pet,row.rarity,genNames(row.genIds),formatMoney(row.claimCents)])));
    $('.genLogPage').textContent=(logPage+1)+' / '+pages;$('.genLogPrev').disabled=logPage===0;$('.genLogNext').disabled=logPage>=pages-1;
  }
  $('.genLogPet').addEventListener('input',()=>{logPage=0;renderLog();});$('.genLogGen').addEventListener('change',()=>{logPage=0;renderLog();});
  $('.genLogPrev').addEventListener('click',()=>{logPage--;renderLog();});$('.genLogNext').addEventListener('click',()=>{logPage++;renderLog();});
  function downloadCsv(rows,filename){const csv='\uFEFF'+rows.map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  $('.genLogExport').addEventListener('click',()=>{const report=selectedReport();if(!report)return;const rows=[['Scenario','Seed','GenConfig','PetConfig','Cast','Rebirth','Tap1','Points','PetId','Pet','Rarity','Gen','ClaimMoney']];for(const row of filteredRecords(report))rows.push([report.name,report.seed,report.configVersion,report.fishConfigVersion,row.cast,row.rebirth,...row.pattern,row.points,row.petId,row.pet,row.rarity,genNames(row.genIds),formatMoney(row.claimCents)]);downloadCsv(rows,'fishing-casts-'+report.runId+'.csv');});
  $('.genDetailScenario').addEventListener('change',detail);
  function show(){
    $('.genSummary').replaceChildren(table(['Kịch bản','Rebirth','Lượt','Không Gen','Có Gen','Có Gen thực tế','Có Gen lý thuyết'],reports.map(r=>[r.name,r.band,num(r.iterations),num(r.none),num(r.one),percent(r.one/r.iterations),percent(1-r.expected.none)])));
    $('.genDetailLabel').hidden=false;$('.genDetailScenario').replaceChildren();
    for(const report of reports){const option=document.createElement('option');option.value=report.runId;option.textContent=report.name+' · '+report.band;$('.genDetailScenario').appendChild(option);}detail();
  }
  $('.genSimStop').addEventListener('click',()=>{cancelled=true;});
  $('.genSimRun').addEventListener('click',async()=>{
    if(running)return;
    const iterations=Number($('.genSimCount').value),seed=Number($('.genSimSeed').value),rebirth=Number($('.genSimRebirth').value),mix=['Red','Green','Gold'].map(key=>Number($('.genMix'+key).value));
    const selected=$('.genSimScenario').value;
    if(!Number.isInteger(rebirth)||rebirth<9||rebirth>999){$('.genSimStatus').textContent='Rebirth phải là số nguyên 9–999.';return;}
    if(!Number.isInteger(seed)||seed<0||seed>4294967295||(['all','mixed'].includes(selected)&&(mix.some(x=>!Number.isFinite(x)||x<0||x>100)||Math.abs(mix.reduce((s,x)=>s+x,0)-100)>.001))){$('.genSimStatus').textContent='Seed phải là số nguyên 0–4294967295. Tổng tỉ lệ đỏ + xanh + vàng phải bằng 100%.';return;}
    const scenarios=core.scenarios.filter(s=>selected==='all'||s.id===selected).map(s=>s.id==='mixed'?{...s,distribution:{red:mix[0]/100,green:mix[1]/100,gold:mix[2]/100}}:s);
    const runs=($('.genCompareRebirth').checked?config.rebirthProfiles.map(profile=>profile.min):[rebirth]).flatMap(rb=>scenarios.map(scenario=>({rebirth:rb,scenario})));
    chart.reset();running=true;cancelled=false;reports=[];$('.genSimRun').disabled=true;$('.genSimStop').disabled=false;$('.genSimExport').disabled=true;panel.dataset.status='running';$('.genSummary').replaceChildren();$('.genDetail').replaceChildren();$('.genDetailLabel').hidden=true;
    try{
      fishDetails.hidden=true;
      for(const run of runs){
        const {scenario,rebirth}=run,simulation=core.simulation(scenario,seed,{rebirth,fishing:true,logLimit:10000,chartEvery:Math.max(1,Math.ceil(iterations/500))});
        while(simulation.result.iterations<iterations&&!cancelled){
          simulation.step(Math.min(20000,iterations-simulation.result.iterations));
          chart.render(simulation.result);
          $('.genSimStatus').textContent=simulation.result.band+' · '+scenario.name+' · '+num(simulation.result.iterations)+' / '+num(iterations)+' lượt';
          await new Promise(resolve=>setTimeout(resolve,0));
        }
        if(simulation.result.iterations)reports.push({...simulation.result,pattern:scenario.pattern||null,distribution:scenario.distribution||null});
        if(cancelled)break;
      }
      if(reports.length)show();
      const forbidden=reports.reduce((sum,r)=>sum+config.catalog.filter(gen=>!gen.fishingEnabled).reduce((n,gen)=>n+r.counts[gen.id],0),0);
      $('.genSimStatus').textContent=(cancelled?'Đã dừng · kết quả chưa đủ lượt':'Hoàn tất')+' · '+num(reports.reduce((sum,r)=>sum+r.iterations,0))+' lượt · Seed '+seed+' · Gen ngoài pool: '+forbidden;
      panel.dataset.status=cancelled?'cancelled':'done';$('.genSimExport').disabled=!reports.length;
    }catch(error){$('.genSimStatus').textContent='Không chạy được mô phỏng: '+error.message;panel.dataset.status='error';}
    finally{running=false;$('.genSimRun').disabled=false;$('.genSimStop').disabled=true;}
  });
  $('.genSimExport').addEventListener('click',()=>{
    const rows=[['Config','Scenario','Rebirth','Band','Pattern','MixRed','MixGreen','MixGold','Seed','Iterations','NoGen','OneGen','Gen','GenCount','ObservedPerCast','ExpectedPerCast']];
    for(const r of reports)for(const gen of config.catalog)rows.push([r.configVersion,r.name,r.rebirth,r.band,r.pattern?.join('+')||'',r.distribution?.red??'',r.distribution?.green??'',r.distribution?.gold??'',r.seed,r.iterations,r.none,r.one,gen.name,r.counts[gen.id],r.counts[gen.id]/r.iterations,r.expected.gen[gen.id]]);
    downloadCsv(rows,'fishing-gen-'+config.version+'.csv');
  });
})();
