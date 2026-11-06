const fs=require('fs'),vm=require('vm'),a=require('assert/strict'),c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('assets/gen-config.js','utf8'),c);const g=c.window.GenConfig;
fs.writeFileSync('outputs/fishing-v2/authoring/gen-before-r19-top.json',JSON.stringify(g,null,2));
const bands=[[9,10,'R9–R10'],[11,12,'R11–R12'],[13,15,'R13–R15'],[16,18,'R16–R18'],[19,null,'R19+']],weights={basic:[265000,232500,200000,167500,135000],uncommon:[90000,97500,105000,112500,120000],advanced:[47500,55625,63750,71875,80000],rare:[5000,10000,15000,20000,25000]};
g.version='merged-gen-24-five-bands-top-r19';g.rebirthProfiles=bands.map(([min,max,label],i)=>({min,max,label,weights:Object.fromEntries(g.catalog.map(x=>[x.id,weights[x.tier][i]]))}));
g.rarityBudgetByBand=bands.map((_,i)=>Object.fromEntries(['basic','uncommon','advanced','rare','epic','exclusive'].map(t=>[t,g.catalog.filter(x=>x.tier===t).reduce((s,x)=>s+(weights[t]?.[i]||0),0)])));
for(const x of g.catalog)x.fishingWeight=g.rebirthProfiles[0].weights[x.id];
g.typeGroups={main:{ids:g.catalog.filter(x=>x.tier!=='rare').map(x=>x.id),rateByBand:[.99,.98,.97,.96,.95]},legendary:{ids:['fossilized','rainbow'],eachRateByBand:[.005,.01,.015,.02,.025],rateByBand:[.01,.02,.03,.04,.05]},appliesTo:'Conditional on receiving one Gen; five Rebirth bands ending at R19+',method:'Equal rate per Gen within rarity. COMMON shifts to RARE, EPIC and LEGENDARY with Rebirth. Actual weight total 1000000 in each band.'};
for(const p of g.rebirthProfiles)a.equal(Object.values(p.weights).reduce((s,x)=>s+x,0),1000000);
fs.writeFileSync('assets/gen-config.js','window.GenConfig = '+JSON.stringify(g,null,2)+';\n');console.log('Updated five Gen bands; top R19+, unchanged tap rules and fish pool');
