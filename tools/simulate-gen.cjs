// Same GenCore as the browser. Usage: node tools/simulate-gen.cjs [casts per scenario] [seed]
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),context={window:{}};
vm.createContext(context);
for(const name of ['gen-config.js','gen-core.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets',name),'utf8'),context);
const core=context.window.GenCore,config=core.config;
const count=Number(process.argv[2]||1000000),seed=Number(process.argv[3]||20261105);
if(!Number.isInteger(count)||count<1||count>1000000||!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Count: 1–1000000. Seed: 0–4294967295.');
assert.equal(new Set(config.catalog.map(gen=>gen.id)).size,config.catalog.length);
assert.equal(config.catalog.length,11);assert.equal(core.pool.length,11);assert.equal(core.total,1000000);
for(const gen of config.catalog){assert(fs.existsSync(path.join(root,gen.icon.file||'assets/mutations/gen-atlas.png')));}
for(const [points,expected] of [[0,0],[30,1],[60,1],[120,1]])assert.equal(core.count(points,()=>0),expected);
assert.equal(core.count(120,()=>.2),1);assert.equal(core.count(60,()=>.6),0);
const results=core.scenarios.map(scenario=>{
  const simulation=core.simulation(scenario,seed),result=simulation.step(count);
  assert.equal(result.none+result.one+result.two,count);assert.equal(result.two,0);
  assert.equal(Object.values(result.counts).reduce((sum,n)=>sum+n,0),result.one+2*result.two);
  for(const gen of config.catalog){
    const probability=result.expected.gen[gen.id],actual=result.counts[gen.id];
    if(!gen.fishingEnabled)assert.equal(actual,0);
    const tolerance=7*Math.sqrt(count*probability*(1-probability))+3;
    assert(Math.abs(actual-count*probability)<=tolerance,scenario.id+' '+gen.name+' outside sampling tolerance');
  }
  const repeated=core.simulation(scenario,seed).step(Math.min(1000,count));
  const repeatedAgain=core.simulation(scenario,seed).step(Math.min(1000,count));
  assert.equal(JSON.stringify(repeated),JSON.stringify(repeatedAgain));
  return {...result,pattern:scenario.pattern||null,distribution:scenario.distribution||null};
});
const percentage=value=>(value*100).toFixed(4)+'%';
const lines=['# Fishing Gen simulation','','Config: '+config.version+'. Seed: '+seed+'. Each scenario uses '+count.toLocaleString('en-US')+' casts. This is a prototype balance proposal, not a workbook drop-rate export.','','| Scenario | No Gen | 1 Gen | 2 Gen | Any Gen observed | Any Gen expected |','|---|---:|---:|---:|---:|---:|'];
for(const r of results)lines.push(`| ${r.name} | ${r.none} | ${r.one} | ${r.two} | ${percentage((r.one+r.two)/count)} | ${percentage(1-r.expected.none)} |`);
lines.push('','Gen incidence is measured per cast. Each cast awards at most one Gen. Gen incidence sums to the chance of receiving a Gen.','');
for(const r of results){lines.push('## '+r.name,'','| Gen | Count | Observed per cast | Expected per cast |','|---|---:|---:|---:|');for(const gen of config.catalog)lines.push(`| ${gen.name}${gen.fishingEnabled?'':' (locked)'} | ${r.counts[gen.id]} | ${percentage(r.counts[gen.id]/count)} | ${percentage(r.expected.gen[gen.id])} |`);lines.push('');}
fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports/gen-simulation.json'),JSON.stringify({configVersion:config.version,seed,castsPerScenario:count,results},null,2));
fs.writeFileSync(path.join(root,'reports/gen-simulation.md'),lines.join('\n'));
console.log(JSON.stringify(results.map(r=>({scenario:r.id||r.scenario,casts:r.iterations,none:r.none,one:r.one,two:r.two,anyGen:percentage((r.one+r.two)/count)})),null,2));
console.log('PASS: counts, conservation, forbidden Gen, probabilities, seed reproducibility and icon paths.');
