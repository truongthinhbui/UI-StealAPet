(function(){
  'use strict';
  const host=document.querySelector('#tab-fishing .fishingDebugPanel');
  const sim=host.querySelector('.genDebug'),liveTools=host.querySelector('.fishingDebugTools'),rewards=host.querySelector('.fishingRewardDebug');
  const exportButton=host.querySelector('.genSimExport');
  const $=selector=>host.querySelector(selector);
  host.classList.add('debugOrganized');host.querySelector(':scope>summary').textContent='Debug Fishing';
  const make=(tag,className,text)=>{const node=document.createElement(tag);node.className=className;if(text)node.textContent=text;return node;};
  const nav=make('div','debugMainNav');nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Mục debug');
  host.querySelector(':scope>summary').after(nav);
  const pages={simulation:make('section','debugPage'),live:make('section','debugPage'),catalog:make('section','debugPage')};
  const titles={simulation:'Mô phỏng lượt',live:'Chơi thử',catalog:'Pool cá & Gen'};
  for(const [key,page] of Object.entries(pages)){
    const button=make('button','debugMainTab',titles[key]);button.type='button';button.dataset.debugPage=key;button.id='debug-tab-'+key;button.setAttribute('role','tab');button.setAttribute('aria-controls','debug-page-'+key);
    page.id='debug-page-'+key;page.setAttribute('role','tabpanel');page.setAttribute('aria-labelledby',button.id);nav.appendChild(button);sim.appendChild(page);
  }
  function selectPage(key){
    for(const [id,page] of Object.entries(pages)){page.hidden=id!==key;const button=nav.querySelector('[data-debug-page="'+id+'"]');button.setAttribute('aria-selected',String(id===key));button.tabIndex=id===key?0:-1;}
  }
  nav.addEventListener('click',event=>{const button=event.target.closest('[data-debug-page]');if(button)selectPage(button.dataset.debugPage);});
  function arrowTabs(element,selector,activate){element.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const buttons=[...element.querySelectorAll(selector)],current=buttons.indexOf(document.activeElement);if(current<0)return;event.preventDefault();const index=event.key==='Home'?0:event.key==='End'?buttons.length-1:(current+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[index].focus();activate(buttons[index]);});}
  arrowTabs(nav,'button',button=>selectPage(button.dataset.debugPage));

  // Move existing controls so all delegated listeners retain their original owner.
  pages.live.append(make('h3','debugSectionTitle','Điều khiển lượt câu'),liveTools,$('.fishingDebugReadout'),rewards);
  const lockedControls=$('.fishingDebug');if(lockedControls)pages.live.appendChild(lockedControls);
  rewards.querySelector('strong').textContent='Điều kiện chơi thử';
  const wallet=make('details','debugAdvanced'),walletSummary=make('summary','','Tiền & túi thử');wallet.appendChild(walletSummary);
  const walletFields=make('div','debugFieldGrid');wallet.appendChild(walletFields);
  for(const selector of ['.rewardCapacity','.rewardMoney'])walletFields.appendChild(rewards.querySelector(selector).closest('label'));
  for(const button of [...rewards.querySelectorAll('[data-reward-debug]')])walletFields.appendChild(button);
  rewards.querySelector('.rewardDebugStatus').before(wallet);
  $('.debugSpeed').closest('label').firstChild.textContent='Tốc độ chơi ';
  $('[data-debug="step"]').textContent='Tiến 1 frame';$('[data-debug="shuffle"]').textContent='Đổi vùng trúng';$('[data-debug="defaults"]').textContent='Khôi phục';

  const intro=sim.querySelector(':scope>h3');intro.textContent='Mô phỏng lượt câu';pages.simulation.appendChild(intro);
  const explanation=sim.querySelector(':scope>p');explanation.textContent='Chọn cấu hình → chạy thử → xem pet và Gen. Không thay đổi tiền hoặc túi đang chơi.';pages.simulation.appendChild(explanation);
  const setup=make('div','debugSimSetup');pages.simulation.appendChild(setup);
  for(const selector of ['.genBalancePreset','.genSimCount','.genSimScenario','.genSimRebirth'])setup.appendChild($(selector).closest('label'));
  const compare=$('.genCompareRebirth').closest('label');compare.classList.add('debugCompare');compare.lastChild.textContent=' So sánh cả 5 mốc Rebirth';setup.appendChild(compare);
  const presets=make('div','debugPresets');presets.appendChild(make('span','','Chọn nhanh'));
  for(const [id,label] of [['red','Full đỏ'],['green','Full xanh'],['gold','Full vàng'],['all','6 kịch bản']]){const button=make('button','',label);button.type='button';button.dataset.simPreset=id;presets.appendChild(button);}setup.after(presets);
  const advanced=make('details','debugAdvanced');advanced.appendChild(make('summary','','Nâng cao · seed & tỉ lệ tap'));
  const advancedFields=make('div','debugFieldGrid');advanced.appendChild(advancedFields);advancedFields.appendChild($('.genSimSeed').closest('label'));
  const mix=make('div','debugMixFields');for(const selector of ['.genMixRed','.genMixGreen','.genMixGold'])mix.appendChild($(selector).closest('label'));advancedFields.appendChild(mix);
  advancedFields.appendChild(make('small','debugMixHelp','Tổng đỏ + xanh + vàng = 100%. Chỉ dùng cho kịch bản ngẫu nhiên.'));
  presets.after(advanced);
  const actionbar=make('div','debugRunBar');actionbar.append($('.genSimRun'),$('.genSimStop'));advanced.after(actionbar);
  $('.genSimStop').textContent='Dừng chạy';$('.genSimRun').textContent='Chạy mô phỏng';
  const estimate=make('span','debugRunEstimate');actionbar.appendChild(estimate);
  actionbar.after($('.genSimStatus'));$('.genSimStatus').after($('.fishingChart'));
  const controls=sim.querySelector(':scope>.genSimControls');if(controls)controls.remove();const rebirthControls=sim.querySelector(':scope>.genRebirthControls');if(rebirthControls)rebirthControls.remove();
  function updateSetup(){
    const scenario=$('.genSimScenario').value,compareAll=$('.genCompareRebirth').checked;
    $('.genSimRebirth').disabled=compareAll;mix.hidden=!['all','mixed'].includes(scenario);advancedFields.querySelector('.debugMixHelp').hidden=mix.hidden;
    const runs=(scenario==='all'?6:1)*(compareAll?5:1),count=Number($('.genSimCount').value);
    estimate.textContent=runs+' bộ thử · '+(runs*count).toLocaleString('vi-VN')+' lượt';
    for(const button of presets.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.simPreset===scenario));
  }
  presets.addEventListener('click',event=>{const button=event.target.closest('[data-sim-preset]');if(button){$('.genSimScenario').value=button.dataset.simPreset;updateSetup();}});
  for(const selector of ['.genSimScenario','.genCompareRebirth','.genSimCount'])$(selector).addEventListener('change',updateSetup);
  $('.genSimScenario').value='gold';updateSetup();

  const results=make('section','debugResultArea');results.hidden=true;pages.simulation.appendChild(results);
  const resultHeader=make('div','debugResultHeader');resultHeader.append(make('h3','debugSectionTitle','Kết quả chạy thử'),exportButton);exportButton.textContent='CSV tổng hợp';results.appendChild(resultHeader);
  for(const leftover of sim.querySelectorAll(':scope>.genSimControls'))if(!leftover.children.length)leftover.remove();
  const selected=$('.genDetailLabel');selected.firstChild.textContent='Bộ kết quả ';results.appendChild(selected);
  const metrics=make('div','debugMetrics');results.appendChild(metrics);
  const resultNav=make('div','debugResultNav');resultNav.setAttribute('role','tablist');resultNav.setAttribute('aria-label','Xem kết quả');results.appendChild(resultNav);
  const detailParent=$('.fishingSimDetail'),existingDetails=[...detailParent.querySelectorAll(':scope>details')];
  const views={overview:['Tổng quan',$('.genSummary')],pets:['Pet',existingDetails[0]],gen:['Gen',$('.genDetail')],combos:['Pet + Gen',existingDetails[1]],log:['Từng lượt',existingDetails[2]]};
  let activeView='overview';
  for(const [id,[title,content]] of Object.entries(views)){
    const button=make('button','',title);button.type='button';button.dataset.resultView=id;button.id='debug-result-tab-'+id;button.setAttribute('role','tab');button.setAttribute('aria-controls','debug-result-'+id);resultNav.appendChild(button);
    const pane=make('section','debugResultPane');pane.id='debug-result-'+id;pane.setAttribute('role','tabpanel');pane.setAttribute('aria-labelledby',button.id);
    if(content.tagName==='DETAILS'){content.open=true;content.querySelector(':scope>summary').hidden=true;}
    pane.appendChild(content);results.appendChild(pane);views[id].push(pane);
  }
  const note=detailParent.querySelector('p');note.textContent='Kết quả là pet câu được, chưa tính tiền Mua hoặc sức chứa túi. Nhật ký có bộ lọc và xuất CSV riêng.';results.appendChild(note);detailParent.hidden=true;
  $('.genLogExport').textContent='CSV nhật ký đã lọc';
  function selectView(id){activeView=id;for(const [key,[,,pane]] of Object.entries(views)){pane.hidden=key!==id;const button=resultNav.querySelector('[data-result-view="'+key+'"]');button.setAttribute('aria-selected',String(key===id));button.tabIndex=key===id?0:-1;}}
  resultNav.addEventListener('click',event=>{const button=event.target.closest('[data-result-view]');if(button)selectView(button.dataset.resultView);});
  arrowTabs(resultNav,'button',button=>selectView(button.dataset.resultView));
  function refreshResults(){
    const rows=[...$('.genSummary').querySelectorAll('tbody tr')];results.hidden=!rows.length||sim.dataset.status==='running';detailParent.hidden=true;
    if(!rows.length)return;
    const index=$('.genDetailScenario').selectedIndex,row=rows[index];if(!row)return;
    const values=[...row.cells].map(cell=>cell.textContent),parse=text=>Number(text.replaceAll('.',''));
    const unique=[...$('.genPetTable').querySelectorAll('tbody tr')].filter(row=>parse(row.cells[2].textContent)>0).length;
    metrics.replaceChildren();for(const [title,value] of [['Lượt câu',values[2]],['Loại pet',String(unique)],['Pet có Gen',values[4]],['Không có Gen',values[3]]]){const item=make('div','debugMetric');item.append(make('strong','',value),make('span','',title));metrics.appendChild(item);}
    rows.forEach((row,rowIndex)=>{
      row.classList.toggle('is-selected',rowIndex===index);
      if(!row.cells[0].querySelector('button')){const button=make('button','debugSelectRun',row.cells[0].textContent);button.type='button';button.title='Xem pet và Gen của bộ thử này';button.addEventListener('click',()=>{$('.genDetailScenario').selectedIndex=rowIndex;$('.genDetailScenario').dispatchEvent(new Event('change'));selectView('pets');});row.cells[0].replaceChildren(button);}
    });
    selectView(activeView);
  }
  $('.genDetailScenario').addEventListener('change',refreshResults);
  new MutationObserver(()=>{
    const busy=sim.dataset.status==='running';
    for(const container of [setup,presets,advanced])for(const control of container.querySelectorAll('input,select,button'))control.disabled=busy;
    if(!busy)updateSetup();refreshResults();
  }).observe(sim,{attributes:true,attributeFilter:['data-status']});
  const catalog=$('.genCatalog');catalog.open=true;catalog.querySelector(':scope>summary').hidden=true;pages.catalog.append(make('h3','debugSectionTitle','Danh mục & tỉ lệ Gen'),catalog);
  selectPage('simulation');selectView('overview');
})();
