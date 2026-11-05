// Idempotent balance from the frozen v8 baseline. Pet data is read only.
const fs=require('fs'),assert=require('assert/strict');
const baseline=JSON.parse(fs.readFileSync('outputs/fishing-v2/authoring/gen-v8-before-time-balance.json','utf8')),g=structuredClone(baseline),targets=[.001,.003,.007,.015,.03],alphas=[];
for(let b=0;b<5;b++){
 const tierOrder=['basic','uncommon','advanced','rare','epic','exclusive'],original=baseline.rebirthProfiles[b].weights;
 const ranked=[...g.catalog].sort((a,z)=>tierOrder.indexOf(a.tier)-tierOrder.indexOf(z.tier)||original[z.id]-original[a.id]);
 const values=Object.values(original).sort((a,z)=>z-a),weights=Object.fromEntries(ranked.map((x,i)=>[x.id,values[i]])),entries=Object.entries(weights);let lo=0,hi=1;
 const chance=a=>Math.pow(weights.webbed,a)/entries.reduce((s,[,w])=>s+Math.pow(w,a),0);
 for(let i=0;i<80;i++){const mid=(lo+hi)/2;if(chance(mid)>targets[b])lo=mid;else hi=mid;}
 const alpha=(lo+hi)/2;alphas.push(alpha);const total=entries.reduce((s,[,w])=>s+Math.pow(w,alpha),0),rows=entries.map(([id,w])=>{const exact=Math.pow(w,alpha)/total*1e6;return{id,n:Math.floor(exact),fraction:exact%1};});
 let remainder=1e6-rows.reduce((s,r)=>s+r.n,0);rows.sort((a,b)=>b.fraction-a.fraction);for(let i=0;i<remainder;i++)rows[i].n++;
 g.rebirthProfiles[b].weights=Object.fromEntries(entries.map(([id])=>[id,rows.find(r=>r.id===id).n]));assert.equal(g.rebirthProfiles[b].weights.webbed,Math.round(targets[b]*1e6));
 for(const [id,w] of entries)for(const [other,v] of entries)if(w>v)assert(g.rebirthProfiles[b].weights[id]>g.rebirthProfiles[b].weights[other]);
}
for(const c of g.catalog)c.fishingWeight=g.rebirthProfiles[0].weights[c.id];
g.version='merged-gen-9-time-balanced-17';g.rarityBudgetByBand=g.rebirthProfiles.map(p=>Object.fromEntries(['basic','uncommon','advanced','rare','epic','exclusive'].map(t=>[t,g.catalog.filter(c=>c.tier===t).reduce((s,c)=>s+p.weights[c.id],0)])));
g.timeBalance={reference:'R19+ natural conveyor Apex + Webbed ~281 hours; user chose preserving mechanic and rarity order over exact time parity.',secondsPerCast:10,weatherCycleMinutes:69,fishingMinutesPerCycle:11,castsPerCycle:66,referenceTapChance:.6,webbedConditionalByBand:targets,method:'tier-ordered baseline score ^ alpha, normalize to 1000000; largest-remainder rounding',alphaByBand:alphas,baselineVersion:baseline.version,fishPoolChanged:false};g.notes=g.notes.filter(n=>!n.includes('progression v7'));g.notes.push('v9 compresses weight gaps, retaining within-tier order and enforcing lower-tier Gen more common than higher-tier Gen. Webbed conditional chances: 0.1%, 0.3%, 0.7%, 1.5%, 3%. Max one Gen; green 5%, gold 20%, red 0%. Full-gold elapsed time includes weather waiting; no guarantee.');
fs.writeFileSync('assets/gen-config.js','// Time-balanced 17-entry Gen pool; original pet data unchanged.\nwindow.GenConfig = '+JSON.stringify(g,null,2)+';\n');
console.log(JSON.stringify({webbed:targets,alpha:alphas,budgets:g.rarityBudgetByBand},null,2));
