// Full pet + Gen casts: node tools/simulate-fishing.cjs [casts/scenario/RB=1000] [seed=20261105]
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),context={window:{}};vm.createContext(context);
for(const file of ['fishing-config.js','fishing-pool.js','gen-config.js','gen-core.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets',file),'utf8'),context);
const {GenCore:core,FishingPool:fish}=context.window,count=Number(process.argv[2]||1000),seed=Number(process.argv[3]||20261105);
if(!Number.isInteger(count)||count<1||count>1000000||!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Invalid count or seed');
const reports=[];
for(const rb of core.config.rebirthProfiles.map(profile=>profile.min))for(const scenario of core.scenarios){
  const current=core.profile(rb);assert.equal(current.total,1000000);assert.equal(current.pool.length,core.config.catalog.filter(g=>g.fishingEnabled).length);
  const sim=core.simulation(scenario,seed,{rebirth:rb,fishing:true,logLimit:1000}),result=sim.step(count);
  assert.equal(result.none+result.one+result.two,count);assert.equal(result.two,0);
  const fp=fish.profile(rb),check=(actual,probability,label)=>assert(Math.abs(actual-count*probability)<=7*Math.sqrt(count*probability*(1-probability))+3,label+' outside sampling tolerance');
  check(result.one,result.expected.one,'Any Gen');
  for(const pet of fish.config.pets)check(result.petCounts[pet.id]?.count||0,pet.weights[fp.index]/fp.total,pet.name);
  for(const gen of core.config.catalog)check(result.counts[gen.id],result.expected.gen[gen.id],gen.name);
  assert.equal(Object.values(result.petCounts).reduce((n,p)=>n+p.count,0),count);
  assert.equal(Object.values(result.combinations).reduce((n,c)=>n+c.count,0),count);
  assert.equal(Object.values(result.counts).reduce((n,c)=>n+c,0),result.one+result.two*2);
  for(const gen of core.config.catalog){
    assert.equal(Object.values(result.petCounts).reduce((n,p)=>n+(p.gens[gen.id]||0),0),result.counts[gen.id]);
    if(!gen.fishingEnabled)assert.equal(result.counts[gen.id],0);
  }
  for(const row of result.records){assert(fish.config.pets.find(p=>p.id===row.petId).weights[fish.bandIndex(rb)]>0);assert.equal(new Set(row.genIds).size,row.genIds.length);}
  assert.equal(JSON.stringify(core.simulation(scenario,seed,{rebirth:rb,fishing:true,logLimit:1000}).step(Math.min(count,1000)).records),JSON.stringify(result.records));
  reports.push({...result,pattern:scenario.pattern||null,distribution:scenario.distribution||null});
}
const percentage=x=>(100*x).toFixed(3)+'%';
const lines=['# Full Fishing simulation','','Seed '+seed+'. '+count+' casts per scenario per Rebirth band. '+core.scenarios.length+' patterns and '+core.config.rebirthProfiles.length+' Rebirth bands; '+(count*reports.length)+' casts total. Up to the first 1,000 casts of each run are retained in JSON/CSV; aggregates cover every cast. These are revealed offers, not automatic inventory grants.','','| Rebirth | Pattern | Unique pets | No Gen | One Gen | Two Gen | Common pets |','|---|---|---:|---:|---:|---:|---:|'];
for(const r of reports)lines.push(`| ${r.band} | ${r.name} | ${Object.keys(r.petCounts).length} | ${r.none} | ${r.one} | ${r.two} | ${percentage(Object.values(r.petCounts).filter(p=>p.rarity==='COMMON').reduce((n,p)=>n+p.count,0)/count)} |`);
lines.push('','See fishing-casts.csv for individual casts: Rebirth, taps, points, pet ID, pet, rarity and exact Gen combination. fishing-simulation.json additionally contains all pet counts, per-pet Gen incidence and every observed combination. All enabled Gen have positive weights; rare outcomes may be absent in a finite sample.');
const rows=[['Scenario','Rebirth','Band','Seed','Cast','Tap1','Points','PetID','Pet','Rarity','Gen','ClaimCents','GenConfig','FishConfig']];
for(const r of reports)for(const row of r.records)rows.push([r.name,r.rebirth,r.band,r.seed,row.cast,...row.pattern,row.points,row.petId,row.pet,row.rarity,row.genIds.map(id=>core.config.catalog.find(g=>g.id===id).name).join('+'),row.claimCents,r.configVersion,r.fishConfigVersion]);
fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports/fishing-simulation.json'),JSON.stringify({seed,castsPerRun:count,totalCasts:count*reports.length,reports},null,2));
fs.writeFileSync(path.join(root,'reports/fishing-simulation.md'),lines.join('\n'));
fs.writeFileSync(path.join(root,'reports/fishing-casts.csv'),'\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n'));
console.log(lines.join('\n'));console.log('PASS: totals, pet/Gen aggregation, locked Gen, no duplicates, deterministic records, pool eligibility.');
