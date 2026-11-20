const {chromium}=require('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({reducedMotion:'reduce'}), errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///D:/revival-prototype-ui-update/index.html');
 await page.locator('[data-tab="tab-fishing"]').click();
 fs.mkdirSync('reports/fishing-logo-fix',{recursive:true});
 const results=[];
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});
  await page.locator('.fishingScene').evaluate(el=>{el.dataset.mode='6';el.setAttribute('data-active','');el.dataset.fishingRound='2';});
  const result=await page.evaluate(()=>{
   const scene=document.querySelector('.fishingScene'),logo=scene.querySelector('.fishingRoundOneLogo'),ring=scene.querySelector('.fishingRing');
   const s=scene.getBoundingClientRect(),l=logo.getBoundingClientRect(),r=ring.getBoundingClientRect();
   return {width:innerWidth,scene:{width:s.width,height:s.height},logo:{width:l.width,height:l.height},visible:getComputedStyle(logo).display!=='none',loaded:logo.complete&&logo.naturalWidth>0,contained:l.left>=s.left&&l.right<=s.right&&l.top>=s.top&&l.bottom<=s.bottom,overlap:l.left<r.right&&l.right>r.left&&l.top<r.bottom&&l.bottom>r.top,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert(result.visible&&result.loaded&&result.contained&&!result.overlap&&!result.overflow,JSON.stringify(result));
  assert(result.logo.width<=150);
  await page.locator('.fishingScene').screenshot({path:`reports/fishing-logo-fix/${width}.png`});
  await page.locator('.fishingScene').evaluate(el=>delete el.dataset.active);
  assert.equal(await page.locator('.fishingRoundOneLogo').isVisible(),false);
  results.push(result);
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync('reports/fishing-logo-fix/checks.json',JSON.stringify({results,errors},null,2));
 await browser.close();console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
