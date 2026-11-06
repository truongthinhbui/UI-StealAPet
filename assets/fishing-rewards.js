(function(){
  'use strict';
  window.initFishingRewards=function(){
  const config=window.FishingConfig;
  const root=document.getElementById('tab-fishing'),scene=root.querySelector('.fishingScene');
  const key='revival-fishing-1.0.1';
  let saved;
  try{saved=JSON.parse(localStorage.getItem(key));}catch{}
  const valid=saved?.version===1&&/^\d+$/.test(saved.money)&&Array.isArray(saved.inventory);
  let account=valid?saved:{version:1,money:'100000000',inventory:[],pending:null};
  let cast=null;
  const settings={rebirth:9,weather:'HeavyRain',outdoors:true,water:true,capacity:12};
  function save(){try{localStorage.setItem(key,JSON.stringify(account));}catch{}}
  function money(cents){
    const value=BigInt(cents),whole=value/100n,fraction=value%100n;
    return whole.toLocaleString('en-US')+(fraction?'.'+fraction.toString().padStart(2,'0'):'');
  }
  function pick(rebirth,random=Math.random){return window.FishingPool.pick(rebirth,random);}
  function eligibility(){
    if(settings.rebirth<config.mechanic.minRebirth)return 'Mở khóa câu cá từ Rebirth 9.';
    if(account.pending)return 'Hãy mua hoặc thả kết quả đang chờ.';
    if(!config.allowedWeather.includes(settings.weather))return 'Chỉ câu được khi Triều cường hoặc Mưa lớn.';
    if(!settings.outdoors)return 'Hãy ra ngoài trời để câu.';
    if(!settings.water)return 'Hãy hướng về mặt nước để câu.';
    return '';
  }
  const card=document.createElement('section');card.className='fishingOffer';card.hidden=true;card.setAttribute('aria-label','Kết quả câu cá');
  card.innerHTML='<h3 class="offerHeading">ĐÃ BẮT ĐƯỢC CÁ!</h3><small class="offerRarity"></small><strong class="offerName"></strong><div class="offerMutations" aria-label="Mutation nhận được"></div><span class="offerPrice"></span><p class="offerError" role="status"></p><div class="offerActions"><button type="button" data-offer="release">Thả</button><button type="button" data-offer="buy">Mua</button></div>';
  scene.appendChild(card);
  const debug=document.createElement('div');debug.className='fishingRewardDebug';
  debug.innerHTML='<strong>Fishing · Dữ liệu & điều kiện thử</strong><label>Rebirth <input class="rewardRebirth" type="number" min="1" max="999" value="9"></label><label>Thời tiết <select class="rewardWeather"><option value="HeavyRain">Mưa lớn</option><option value="HighTide">Triều cường</option><option value="Normal">Bình thường</option><option value="Rainy">Mưa thường</option></select></label><label><input class="rewardOutdoors" type="checkbox" checked> Ngoài trời</label><label><input class="rewardWater" type="checkbox" checked> Hướng mặt nước</label><label>Sức chứa túi thử <input class="rewardCapacity" type="number" min="0" max="999" value="12"></label><label>Tiền thử <input class="rewardMoney" type="text" inputmode="decimal" value="1000000"></label><button type="button" data-reward-debug="money">Đặt tiền</button><button type="button" data-reward-debug="fund">Đủ tiền mua kết quả</button><button type="button" data-reward-debug="clear">Dọn túi thử</button><output class="rewardDebugStatus"></output>';
  root.querySelector('.fishingDebugPanel').appendChild(debug);
  function render(){
    const pending=account.pending;
    card.hidden=!pending;scene.toggleAttribute('data-offer',!!pending);
    if(pending){
      card.dataset.rarity=pending.rarity.toLowerCase();
      card.querySelector('.offerRarity').textContent=pending.rarity;
      card.querySelector('.offerName').textContent=pending.name.replaceAll('_',' ');
      const mutations=card.querySelector('.offerMutations');
      mutations.replaceChildren();
      for(const reward of pending.mutationRewards){
        const badge=document.createElement('span');badge.className='offerMutation';
        const gen=window.GenConfig.catalog.find(gen=>gen.id===reward.id);
        badge.dataset.tier=gen?.tier||'basic';badge.dataset.gen=reward.id;
        const icon=gen?window.GenCore.icon(gen):document.createElement('img');
        if(!gen){icon.src='assets/mutations/'+reward.id+'.png';icon.alt='';}
        const label=document.createElement('span');label.textContent=reward.name;
        badge.append(icon,label);mutations.appendChild(badge);
      }
      if(!pending.mutationRewards.length)mutations.textContent='Không có Gen';
      card.querySelector('.offerPrice').textContent=money(pending.price)+' Money';

      card.querySelector('.offerError').textContent=account.inventory.length>=settings.capacity?'Túi thử đã đầy. Dọn túi hoặc thả kết quả.':BigInt(account.money)<BigInt(pending.price)?'Chưa đủ tiền. Bạn có thể thả miễn phí.':'';
      card.querySelector('[data-offer="buy"]').disabled=account.inventory.length>=settings.capacity||BigInt(account.money)<BigInt(pending.price);
    }
    debug.querySelector('.rewardDebugStatus').textContent='Pool '+config.bands.find(b=>settings.rebirth>=b.min&&(b.max===null||settings.rebirth<=b.max)).label+' · Tiền '+money(account.money)+' · Túi '+account.inventory.length+'/'+settings.capacity+(pending?' · Có kết quả chờ':'');
  }
  debug.addEventListener('change',event=>{
    const target=event.target;
    if(target.matches('.rewardRebirth'))settings.rebirth=Math.max(1,Math.min(999,Math.floor(Number(target.value)||1)));
    if(target.matches('.rewardCapacity'))settings.capacity=Math.max(0,Math.min(999,Math.floor(Number(target.value)||0)));
    if(target.matches('.rewardWeather'))settings.weather=target.value;
    if(target.matches('.rewardOutdoors'))settings.outdoors=target.checked;
    if(target.matches('.rewardWater'))settings.water=target.checked;
    render();
  });
  debug.addEventListener('click',event=>{
    const action=event.target.dataset.rewardDebug;
    if(action==='money'){
      const input=debug.querySelector('.rewardMoney').value.trim();
      if(!/^\d+(\.\d{1,2})?$/.test(input)){debug.querySelector('.rewardDebugStatus').textContent='Nhập số tiền không âm, tối đa 2 chữ số thập phân.';return;}
      const [whole,fraction='']=input.split('.');account.money=(BigInt(whole)*100n+BigInt(fraction.padEnd(2,'0'))).toString();
    }
    if(action==='fund'&&account.pending)account.money=account.pending.price;
    if(action==='clear')account.inventory=[];
    if(action){save();render();}
  });
  card.addEventListener('click',event=>{
    const action=event.target.dataset.offer,pending=account.pending;
    if(!action||!pending)return;
    if(action==='buy'){
      if(BigInt(account.money)<BigInt(pending.price)||account.inventory.length>=settings.capacity){render();return;}
      account.money=(BigInt(account.money)-BigInt(pending.price)).toString();
      account.inventory.push({...pending,boughtAt:Date.now()});
    }
    account.pending=null;save();render();
    root.dispatchEvent(new CustomEvent('fishingofferresolved',{detail:{action,catch:pending}}));
  });
  window.FishingRewards={
    config,settings,pick,money,
    get pending(){return account.pending;},
    get isCasting(){return !!cast;},
    get castRebirth(){return cast?.rebirth??settings.rebirth;},
    get castRarity(){return cast?.pet.rarity??null;},
    begin(){const error=eligibility();if(error)return error;if(cast)return 'Đang câu.';cast={id:crypto.randomUUID(),rebirth:settings.rebirth,version:config.version,pet:pick(settings.rebirth)};return '';},
    cancelCast(){cast=null;},
    resolve(detail){
      if(account.pending)return account.pending;
      if(!cast)return null;
      const mutationPoints=window.GenCore.points(detail.results);
      const pet=cast.pet,rewards=window.GenCore.roll(mutationPoints,Math.random,cast.rebirth);
      const priceQuote=window.FishingPool.quote(pet,rewards);
      account.pending={catchId:cast.id,petId:pet.id,name:pet.name,rarity:pet.rarity,...priceQuote,rebirth:cast.rebirth,poolVersion:cast.version,genVersion:window.GenConfig.version,balancePreset:window.GenConfig.activeBalancePreset,mutationPoints,mutationRewards:rewards.map(({id,name})=>({id,name})),results:detail.results.slice(0,window.GenConfig.rules.taps)};
      cast=null;save();render();return account.pending;
    },
    render
  };
  render();
  };
})();
