const fs=require('fs'),cp=require('child_process'),a=require('assert/strict');
const html=fs.readFileSync('index.html','utf8'),scripts=[...html.matchAll(/<script[^>]+src="([^"]+)/g)].map(m=>m[1].split('?')[0]).filter(p=>!p.includes('://'));
for(const f of scripts){a(fs.existsSync(f),'Missing '+f);cp.execFileSync(process.execPath,['--check',f]);}
console.log('PASS syntax and local entrypoints: '+scripts.length+' scripts.');
global.window=global;for(const f of ['fishing-config','fishing-pool','gen-config','gen-core','fishing-cohort','fishing-cohort-snapshot'])require('../assets/'+f+'.js');
a.equal(FishingCohortSnapshot.configSignature,FishingCohort.signature());console.log('PASS snapshot config fingerprint.');
