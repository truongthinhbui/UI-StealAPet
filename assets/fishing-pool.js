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
  function decimalRatio(value){
    const match=String(value).match(/^(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i);
    if(!match)throw new Error('Invalid Fishing price input');
    const fraction=match[2]||'',scale=fraction.length-Number(match[3]||0),digits=BigInt(match[1]+fraction);
    return scale>=0?[digits,10n**BigInt(scale)]:[digits*10n**BigInt(-scale),1n];
  }
  function quote(pet,gens=[]){
    if(!gens.length)return {price:pet.claimCents,basePrice:pet.claimCents,genPriceMultiplier:'1',pricingVersion:config.pricing.version};
    if(gens.length>config.pricing.maxGens)throw new Error('Fishing supports at most one Gen');
    const multiplier=gens.length?config.pricing.genMultiplierById[gens[0].id]:'1';
    if(multiplier===undefined)throw new Error('Missing Fishing Gen price multiplier');
    let numerator=1n,denominator=1n;
    for(const value of [pet.spawnPrice,pet.claimK,multiplier]){const [n,d]=decimalRatio(value);numerator*=n;denominator*=d;}
    const whole=(2n*numerator+denominator)/(2n*denominator);
    return {price:(whole*100n).toString(),basePrice:pet.claimCents,genPriceMultiplier:multiplier,pricingVersion:config.pricing.version};
  }
  global.FishingPool={profile,pick,bandIndex,config,quote};
})(typeof window!=='undefined'?window:globalThis);
