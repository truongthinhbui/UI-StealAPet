const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const c={window:{}};vm.createContext(c);for(const name of ['fishing-config','fishing-pool','gen-config','gen-core','fishing-cohort'])vm.runInContext(fs.readFileSync('assets/'+name+'.js','utf8'),c);
const sim=c.window.FishingCohort.create({players:1000});sim.step(1000);const r=sim.result;
assert.equal(r.completed,1000);assert.deepEqual(Array.from(r.groups,g=>g.players),[200,600,200]);assert.equal(r.daily[6].playersApexGen,r.playersApexGen);
const out='reports/cohort-1000-7days';fs.mkdirSync(out,{recursive:true});const {players,...summary}=r;fs.writeFileSync(out+'/result.json',JSON.stringify(summary,null,2));const keys=Object.keys(players[0]);fs.writeFileSync(out+'/players.csv','\uFEFF'+keys.join(',')+'\n'+players.map(p=>keys.map(k=>p[k]??'').join(',')).join('\n'));
console.log(JSON.stringify({players:r.completed,casts:r.casts,playersApex:r.playersApex,playersApexGen:r.playersApexGen,apexGenCatches:r.apexGen,groups:r.groups.map(g=>({name:g.name,players:g.players,playersApex:g.playersApex,playersApexGen:g.playersApexGen})),daily:r.daily.map(d=>({day:d.day,playersApexGen:d.playersApexGen}))},null,2));
