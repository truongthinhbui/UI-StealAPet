(function(global){
  'use strict';
  const config=global.GenConfig;
  const pool=config.catalog.filter(gen=>gen.fishingEnabled&&gen.fishingWeight>0);
  if(!pool.length)throw new Error('Fishing Gen pool is empty');
  const total=pool.reduce((sum,gen)=>sum+gen.fishingWeight,0);
  const profiles=config.rebirthProfiles.map(profile=>{
    const entries=pool.map(gen=>({...gen,fishingWeight:profile.weights[gen.id]||0})).filter(gen=>gen.fishingWeight>0);
    return {...profile,pool:entries,total:entries.reduce((sum,gen)=>sum+gen.fishingWeight,0)};
  });
  function profile(rebirth=9){return profiles.find(p=>rebirth>=p.min&&(p.max===null||rebirth<=p.max))||profiles[0];}
  function seeded(seed){let value=Number(seed)>>>0;return ()=>{value=(value+0x6D2B79F5)>>>0;let x=value;x=Math.imul(x^x>>>15,x|1);x^=x+Math.imul(x^x>>>7,x|61);return ((x^x>>>14)>>>0)/4294967296;};}
  function setBalancePreset(id){
    const preset=config.balancePresets[id];if(!preset)throw new Error('Unknown Gen balance preset');
    config.activeBalancePreset=id;for(const key of ['green','gold','red'])config.rules[key]=preset[key];
    if(global.FishingConfig){global.FishingConfig.mechanic.greenMutation=preset.green;global.FishingConfig.mechanic.goldMutation=preset.gold;global.FishingConfig.mechanic.missMutation=preset.red;}
  }
  function count(points,random=Math.random,rules=config.rules){
    const maximum=rules.taps*Math.max(rules.green,rules.gold,rules.red);
    const chance=Math.max(0,Math.min(rules.maxGen*100,maximum,Number(points)||0));
    return random()*100<chance?1:0;
  }
  function choose(amount,random=Math.random,rebirth=9){
    const active=profile(rebirth).pool;
    const selected=[];let remaining=profile(rebirth).total;
    for(let slot=0;slot<Math.min(amount,config.rules.maxGen,active.length);slot++){
      let roll=random()*remaining;
      for(const gen of active){
        if(selected.includes(gen))continue;
        roll-=gen.fishingWeight;
        if(roll<0){selected.push(gen);remaining-=gen.fishingWeight;break;}
      }
    }
    return selected;
  }
  function roll(points,random=Math.random,rebirth=9,rules=config.rules){return choose(count(points,random,rules),random,rebirth);}
  function catchRoll(score,rebirth=9,random=Math.random,rules=config.rules){
    const pet=global.FishingPool.pick(rebirth,random);
    const rewards=roll(score,random,rebirth,rules);
    return {pet,rewards};
  }
  function timingResult(marker,start){const offset=(marker-start+1)%1;const epsilon=1e-12;return offset>=.45-epsilon&&offset<=.53+epsilon?'gold':offset<=.20+epsilon?'green':'red';}
  function points(pattern,rules=config.rules){return Math.min(100,pattern.slice(0,rules.taps).reduce((sum,result)=>sum+(rules[result]||0),0));}
  function expected(score,rebirth=9,rules=config.rules){
    const current=profile(rebirth),active=current.pool,total=current.total;
    const maximum=rules.taps*Math.max(rules.green,rules.gold,rules.red);
    score=Math.max(0,Math.min(rules.maxGen*100,maximum,score));
    const one=Math.min(1,score/100);
    const gen={};
    for(const item of config.catalog){
      gen[item.id]=0;const entry=active.find(gen=>gen.id===item.id);if(!entry)continue;
      gen[item.id]=one*entry.fishingWeight/total;
    }
    return {none:1-one,one,two:0,gen};
  }
  const scenarios=[
    {id:'red',name:'Full đỏ',pattern:['red']},
    {id:'green',name:'Full xanh',pattern:['green']},
    {id:'gold',name:'Full vàng',pattern:['gold']},
    {id:'mixed',name:'Ngẫu nhiên theo tỉ lệ tap',distribution:{red:.3,green:.5,gold:.2}}
  ];
  function expectation(scenario,rebirth=9,rules=config.rules){
    if(scenario.pattern)return expected(points(scenario.pattern,rules),rebirth,rules);
    const out={none:0,one:0,two:0,gen:Object.fromEntries(config.catalog.map(g=>[g.id,0]))};
    const d=scenario.distribution;
    for(const a of ['red','green','gold']){
      const probability=d[a],e=expected(points([a],rules),rebirth,rules);
      for(const key of ['none','one','two'])out[key]+=probability*e[key];
      for(const id in out.gen)out.gen[id]+=probability*e.gen[id];
    }
    return out;
  }
  function simulation(scenario,seed,options={}){
    const rules={...config.rules};
    scenario=JSON.parse(JSON.stringify(scenario));
    const rebirth=options.rebirth||9,full=!!options.fishing,logLimit=options.logLimit??10000;
    const random=seeded(seed),counts=Object.fromEntries(config.catalog.map(gen=>[gen.id,0]));
    const result={scenario:scenario.id,runId:scenario.id+'-r'+rebirth,name:scenario.name+' · '+config.activeBalancePreset,balancePreset:config.activeBalancePreset,seed,rebirth,band:profile(rebirth).label,configVersion:config.version,fishConfigVersion:global.FishingPool?.config.version||null,iterations:0,none:0,one:0,two:0,counts,tapRules:rules,expected:expectation(scenario,rebirth,rules),petCounts:{},combinations:{},records:[],logLimit};
    result.rarityCounts={};result.rarityFirst={};result.genFirst={};result.timeline=[{cast:0,counts:{},pets:{},gens:{},combos:{}}];
    const chartEvery=Math.max(1,options.chartEvery||1000);
    const fixed=scenario.pattern?points(scenario.pattern,rules):null;
    return {result,step(amount){
      if(!Number.isInteger(amount)||amount<1)throw Error('Số lượt mỗi bước phải là số nguyên dương');
      for(let i=0;i<amount;i++){
        let score=fixed,pattern=scenario.pattern;
        if(score===null){score=0;pattern=[];for(let tap=0;tap<rules.taps;tap++){const x=random(),d=scenario.distribution,type=x<d.red?'red':x<d.red+d.green?'green':'gold';score+=rules[type];pattern.push(type);}}
        score=Math.min(100,score);
        const outcome=full?catchRoll(score,rebirth,random,rules):null;
        const rewards=outcome?outcome.rewards:roll(score,random,rebirth,rules);
        result[rewards.length===0?'none':rewards.length===1?'one':'two']++;
        for(const reward of rewards)counts[reward.id]++;
        if(full){
          const pet=outcome.pet;
          const cast=result.iterations+i+1;
          result.rarityCounts[pet.rarity]=(result.rarityCounts[pet.rarity]||0)+1;
          if(!result.rarityFirst[pet.rarity])result.rarityFirst[pet.rarity]={cast,pet:pet.name};
          const entry=result.petCounts[pet.id]||(result.petCounts[pet.id]={id:pet.id,name:pet.name,rarity:pet.rarity,firstCast:cast,count:0,none:0,one:0,two:0,gens:{}});
          entry.count++;entry[rewards.length===0?'none':rewards.length===1?'one':'two']++;
          for(const gen of rewards){entry.gens[gen.id]=(entry.gens[gen.id]||0)+1;if(!result.genFirst[gen.id])result.genFirst[gen.id]=cast;}
          const ids=rewards.map(g=>g.id).sort(),key=pet.id+'|'+ids.join('+');
          const combo=result.combinations[key]||(result.combinations[key]={petId:pet.id,pet:pet.name,rarity:pet.rarity,genIds:ids,firstCast:cast,count:0});combo.count++;
          if(cast%chartEvery===0)result.timeline.push({cast,counts:{...result.rarityCounts},pets:Object.fromEntries(Object.entries(result.petCounts).map(([k,v])=>[k,v.count])),gens:{...counts},combos:Object.fromEntries(Object.entries(result.combinations).map(([k,v])=>[k,v.count]))});
          if(result.records.length<logLimit)result.records.push({cast:result.iterations+i+1,rebirth,pattern:[...pattern],points:score,petId:pet.id,pet:pet.name,rarity:pet.rarity,genIds:rewards.map(g=>g.id),claimCents:global.FishingPool.quote(pet,rewards).price});
        }
      }
      result.iterations+=amount;return result;
    }};
  }
  function icon(gen){
    if(gen.icon.file){const img=document.createElement('img');img.src=gen.icon.file;img.alt='';img.width=32;img.height=32;img.loading='lazy';img.decoding='async';return img;}
    const element=document.createElement('span');element.className='genAtlasIcon';
    element.style.backgroundPosition=(gen.icon.atlas%4*100/3)+'% '+(Math.floor(gen.icon.atlas/4)*50)+'%';
    element.setAttribute('aria-hidden','true');return element;
  }
  setBalancePreset(config.activeBalancePreset);
  global.GenCore={config,pool,total,profile,seeded,timingResult,count,choose,roll,catchRoll,points,expected,scenarios,expectation,simulation,icon,setBalancePreset};
})(typeof window!=='undefined'?window:globalThis);
