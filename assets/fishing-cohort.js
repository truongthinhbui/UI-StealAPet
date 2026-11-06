(function(global){
  'use strict';
  const defaults={players:1000,days:7,seed:20261106,rebirthMin:19,rebirthMax:30,rebirthPerDay:0,castSeconds:10,handlingSeconds:0,travelSeconds:10,efficiency:90,attendance:100,timeVariance:20,loginJitterMinutes:10,preset:'saved',tapGreen:10,tapGold:34,groups:[{id:'casual',name:'Casual',share:20,minutes:20,red:25,green:55,gold:20},{id:'regular',name:'Thường',share:60,minutes:40,red:15,green:35,gold:50},{id:'hardcore',name:'Hardcore',share:20,minutes:60,red:5,green:25,gold:70}]};
  function validate(s){
    const bounds={players:[1,200000,true],days:[1,365,true],seed:[0,4294967295,true],rebirthMin:[19,999,true],rebirthMax:[19,999,true],rebirthPerDay:[0,20,true],castSeconds:[1,120],handlingSeconds:[0,120],travelSeconds:[0,300],efficiency:[1,100],attendance:[0,100],timeVariance:[0,90],loginJitterMinutes:[0,1440]};
    for(const [k,[lo,hi,int]] of Object.entries(bounds))if(!Number.isFinite(s[k])||s[k]<lo||s[k]>hi||(int&&!Number.isInteger(s[k])))throw Error(k+' ngoài giới hạn '+lo+'–'+hi);
    if(s.rebirthMax<s.rebirthMin)throw Error('Rebirth tối đa phải ≥ tối thiểu');
    if(!global.GenConfig.balancePresets[s.preset])throw Error('Preset không hợp lệ');
    for(const key of ['tapGreen','tapGold'])if(s[key]!==undefined&&(!Number.isFinite(s[key])||s[key]<0||s[key]>100))throw Error('Điểm tap phải từ 0–100%');
    if(s.groups.length!==3||Math.abs(s.groups.reduce((a,g)=>a+g.share,0)-100)>1e-8)throw Error('Tổng nhóm phải bằng 100%');
    for(const g of s.groups){for(const k of ['share','red','green','gold'])if(!Number.isFinite(g[k])||g[k]<0||g[k]>100)throw Error('Tỉ lệ nhóm/tap không hợp lệ');if(!Number.isFinite(g.minutes)||g.minutes<1||g.minutes*(1+s.timeVariance/100)>1440||Math.abs(g.red+g.green+g.gold-100)>1e-8)throw Error('Tổng tap phải bằng 100%; phiên dài nhất không quá 24 giờ');}
  }
  function seedFor(id,root){let x=(id+root)>>>0;x=Math.imul(x^(x>>>16),0x21f0aaad);x=Math.imul(x^(x>>>15),0x735a2d97);return (x^(x>>>15))>>>0;}
  function create(settings={}){
    const s=JSON.parse(JSON.stringify({...defaults,...settings}));validate(s);
    const core=global.GenCore,fish=global.FishingPool,gens=global.GenConfig.catalog,preset={...global.GenConfig.balancePresets[s.preset]};
    if(s.tapGreen!==undefined)preset.green=s.tapGreen;if(s.tapGold!==undefined)preset.gold=s.tapGold;
    const result={version:'cohort-v2',settings:s,genVersion:global.GenConfig.version,fishVersion:global.FishingConfig.version,tapValues:{red:preset.red,green:preset.green,gold:preset.gold},completed:0,casts:0,onlineMinutes:0,genCatches:0,apex:0,apexGen:0,playersApex:0,playersApexGen:0,playersGen:0,firstApexGenDays:Array(s.days).fill(0),daily:Array.from({length:s.days},(_,i)=>({day:i+1,casts:0,apex:0,apexGen:0,gen:0,playersApexGen:0,playersApex:0,groups:Object.fromEntries(s.groups.map(g=>[g.id,0]))})),groups:s.groups.map(g=>({...g,players:0,casts:0,onlineMinutes:0,genCatches:0,apex:0,apexGen:0,playersApex:0,playersApexGen:0,playersGen:0})),petCounts:{},genCounts:{},combos:{},players:[]};
    const cache=new Map(),groupEnds=[];let cum=0;for(const g of s.groups){cum+=g.share;groupEnds.push(Math.round(s.players*cum/100));}
    function pools(rb){if(cache.has(rb))return cache.get(rb);const fp=fish.profile(rb),gp=core.profile(rb),v={fish:fp.pets,total:fp.total,index:fp.index,gens:gp.pool,genTotal:gp.total};cache.set(rb,v);return v;}
    function pick(list,total,key,rng){let x=rng()*total;for(const item of list){x-=key(item);if(x<0)return item;}return list[list.length-1];}
    function one(id){
      const seed=seedFor(id,s.seed),schedule=core.seeded(seed^0xa341316c),rng=core.seeded(seed),gi=groupEnds.findIndex(end=>id<end),group=result.groups[gi],baseRb=s.rebirthMin+Math.floor(schedule()*(s.rebirthMax-s.rebirthMin+1)),phase=Math.floor(schedule()*4140);
      const player={id:id+1,seed,group:group.id,rebirth:baseRb,casts:0,gen:0,apex:0,apexGen:0,firstApexDay:null,firstApexGenDay:null,onlineMinutes:0};
      const petsOwned=new Set(),gensOwned=new Set(),combosOwned=new Set();
      for(let d=0;d<s.days;d++){
        if(schedule()*100>=s.attendance)continue;
        const minutes=group.minutes*(1+(schedule()*2-1)*s.timeVariance/100),start=d*86400+phase+(schedule()*2-1)*s.loginJitterMinutes*60,end=start+minutes*60,rb=Math.min(999,baseRb+d*s.rebirthPerDay),pool=pools(rb),daily=result.daily[d];player.onlineMinutes+=minutes;
        let count=0;for(let cycle=Math.floor(start/4140);cycle<=Math.floor(end/4140);cycle++)for(const [a,b] of [[360,540],[1440,1620],[2520,2640],[3720,3900]]){const overlap=Math.max(0,Math.min(end,cycle*4140+b)-Math.max(start,cycle*4140+a)-s.travelSeconds);count+=Math.floor(overlap*s.efficiency/100/(s.castSeconds+s.handlingSeconds));}
        for(let cast=0;cast<count;cast++){
          const pet=pick(pool.fish,pool.total,x=>x.weights[pool.index],rng);let points=0;for(let tap=0;tap<3;tap++){const roll=rng()*100;points+=roll<group.red?preset.red:roll<group.red+group.green?preset.green:preset.gold;}
          const hasGen=Number(rng()*100<Math.min(100,points)),gen=hasGen?pick(pool.gens,pool.genTotal,x=>x.fishingWeight,rng):null,isApex=pet.rarity==='APEX',comboKey=pet.id+'|'+(gen?.id||'none');
          let pc=result.petCounts[pet.id];if(!pc)pc=result.petCounts[pet.id]={id:pet.id,name:pet.name,rarity:pet.rarity,count:0,withGen:0,players:0};pc.count++;pc.withGen+=hasGen;petsOwned.add(pet.id);
          let cc=result.combos[comboKey];if(!cc)cc=result.combos[comboKey]={pet:pet.name,rarity:pet.rarity,gen:gen?.name||'Không Gen',count:0,players:0};cc.count++;combosOwned.add(comboKey);
          if(gen){let gc=result.genCounts[gen.id];if(!gc)gc=result.genCounts[gen.id]={id:gen.id,name:gen.name,count:0,players:0,apex:0,apexPlayers:0};gc.count++;gc.apex+=Number(isApex);gensOwned.add(gen.id);if(isApex)gensOwned.add('apex:'+gen.id);}
          player.casts++;player.gen+=hasGen;player.apex+=Number(isApex);player.apexGen+=Number(isApex&&hasGen);daily.casts++;daily.gen+=hasGen;daily.apex+=Number(isApex);daily.apexGen+=Number(isApex&&hasGen);
          if(isApex&&player.firstApexDay===null)player.firstApexDay=d+1;if(isApex&&hasGen&&player.firstApexGenDay===null){player.firstApexGenDay=d+1;result.firstApexGenDays[d]++;}
        }
      }
      if(player.firstApexGenDay!==null)for(let d=player.firstApexGenDay-1;d<s.days;d++){result.daily[d].playersApexGen++;result.daily[d].groups[group.id]++;}
      if(player.firstApexDay!==null)for(let d=player.firstApexDay-1;d<s.days;d++)result.daily[d].playersApex++;
      for(const key of petsOwned)result.petCounts[key].players++;for(const key of combosOwned)result.combos[key].players++;for(const key of gensOwned)if(key.startsWith('apex:'))result.genCounts[key.slice(5)].apexPlayers++;else result.genCounts[key].players++;
      group.players++;for(const target of [result,group]){target.casts+=player.casts;target.onlineMinutes+=player.onlineMinutes;target.genCatches+=player.gen;target.apex+=player.apex;target.apexGen+=player.apexGen;target.playersApex+=Number(player.apex>0);target.playersApexGen+=Number(player.apexGen>0);target.playersGen+=Number(player.gen>0);}
      result.players.push(player);result.completed++;
    }
    return {result,step(n=250){const end=Math.min(s.players,result.completed+n);while(result.completed<end)one(result.completed);return result.completed===s.players;}};
  }
  global.FishingCohort={defaults,validate,create,seedFor};
})(typeof window!=='undefined'?window:globalThis);
