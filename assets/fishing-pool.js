(function(global){
  'use strict';
  const config=global.FishingConfig;
  function bandIndex(rebirth){return config.bands.findIndex(b=>rebirth>=b.min&&(b.max===null||rebirth<=b.max));}
  const pools=config.bands.map((band,index)=>{
    const pets=config.pets.filter(p=>p.weights[index]>0);
    return {band,index,pets,total:pets.reduce((sum,p)=>sum+p.weights[index],0)};
  });
  function profile(rebirth){return pools[Math.max(0,bandIndex(rebirth))];}
  function pick(rebirth,random=Math.random){
    const current=profile(rebirth);let roll=random()*current.total;
    for(const pet of current.pets){roll-=pet.weights[current.index];if(roll<0)return pet;}
    return current.pets[current.pets.length-1];
  }
  global.FishingPool={profile,pick,bandIndex,config};
})(typeof window!=='undefined'?window:globalThis);
