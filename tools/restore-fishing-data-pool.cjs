const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');global.window=global;
for(const f of ['fishing-config','gen-config'])vm.runInThisContext(fs.readFileSync('assets/'+f+'.js','utf8'));
const baseline=JSON.parse(fs.readFileSync('reports/fishing-before-apex-balance.json','utf8'));
for(const p of FishingConfig.pets)p.weights=[...baseline.find(b=>b.id===p.id).weights];
FishingConfig.version='fishing-1.0.1-source-v5';delete FishingConfig.balance;
fs.writeFileSync('assets/fishing-config.js','window.FishingConfig = '+JSON.stringify(FishingConfig,null,2)+';\n');
for(const f of ['fishing-pool','gen-core','fishing-cohort'])vm.runInThisContext(fs.readFileSync('assets/'+f+'.js','utf8'));
const run=FishingCohort.create({players:100000,seed:20261109});run.step(100000);const r=run.result;for(const p of FishingConfig.pets)assert.deepEqual(p.weights,baseline.find(b=>b.id===p.id).weights);
const {players,...snapshot}=r;snapshot.csvPath='reports/cohort-single-tap-original-pool/players.csv';fs.mkdirSync('reports/cohort-single-tap-original-pool',{recursive:true});const keys=Object.keys(players[0]);fs.writeFileSync(snapshot.csvPath,[keys.join(','),...players.map(p=>keys.map(k=>p[k]??'').join(','))].join('\n'));fs.writeFileSync('assets/fishing-cohort-snapshot.js','window.FishingCohortSnapshot='+JSON.stringify(snapshot)+';\n');fs.writeFileSync('reports/fishing-single-tap-cohort.json',JSON.stringify(snapshot,null,2));console.log(JSON.stringify({players:r.completed,casts:r.casts,apexGenPercent:r.playersApexGen/r.completed*100,apexPercent:r.playersApex/r.completed*100,rules:GenConfig.rules,groups:r.groups.map(g=>({name:g.name,rate:g.playersApexGen/g.players*100}))},null,2));
