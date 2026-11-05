const fs=require('fs');
function read(file,name){const s=fs.readFileSync(file,'utf8');return JSON.parse(s.slice(s.indexOf('=')+1).trim().replace(/;$/,''));}
function allocate(items,budget,get){const total=items.reduce((s,p)=>s+get(p),0),rows=items.map(p=>{const exact=budget*get(p)/total;return {p,n:Math.floor(exact),fraction:exact%1}});let left=budget-rows.reduce((s,r)=>s+r.n,0);rows.sort((a,b)=>b.fraction-a.fraction);for(let i=0;i<left;i++)rows[i].n++;return rows;}
const gen=read('assets/gen-config.js');
const tiers=['basic','uncommon','advanced','rare','epic','exclusive'],gb=[[950000,49000,950,40,8,2],[900000,95000,4500,450,45,5],[830000,150000,18000,1800,180,20],[740000,220000,35000,4500,450,50],[630000,300000,60000,8500,1350,150]];
for(let b=0;b<5;b++)for(let t=0;t<6;t++)for(const r of allocate(gen.catalog.filter(p=>p.tier===tiers[t]),gb[b][t],p=>gen.rebirthProfiles[b].weights[p.id]))gen.rebirthProfiles[b].weights[r.p.id]=r.n;
for(const p of gen.catalog)p.fishingWeight=gen.rebirthProfiles[0].weights[p.id];gen.version='merged-gen-7-rebirth-progression';gen.rarityBudgetByBand=gb.map(row=>Object.fromEntries(tiers.map((k,i)=>[k,row[i]])));gen.notes.push('Rebirth progression v7: all Gen remain possible; higher Rebirth increases quality, not chance to receive a Gen. Green 5%, gold 20%, red 0%; max one Gen.');
fs.writeFileSync('assets/gen-config.js','// Rebirth balance applies only to Muta/Weather Gen.\nwindow.GenConfig = '+JSON.stringify(gen,null,2)+';\n');
