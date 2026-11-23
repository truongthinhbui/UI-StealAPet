const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('C:/Users/truongthinh.bui_ctv/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1100}});await page.clock.install();
 await page.goto('file:///D:/revival-prototype-ui-update/index.html#/base-lock');await page.locator('#base-lock-tab').click();
 const flows=['confirm','cards'];
 assert.equal(await page.locator('[data-bl-flow]').count(),2);
 async function hold(ms){const b=await page.locator('.bl-use').boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.clock.fastForward(ms);await page.mouse.up();}
 async function fill(flow,minutes){
  if(flow==='socket')await page.locator(`[data-key-minutes="${minutes}"]`).dragTo(page.locator('.bl-socket'));
  else await page.locator(`[data-key-minutes="${minutes}"]`).click();
  if(flow==='hold')await hold(950);else if(flow!=='cards')await page.locator('.bl-use').click();
 }
 for(const flow of flows){
  await page.locator(`[data-bl-flow="${flow}"]`).click();await page.locator('.bl-reset').click();
  await page.locator('.bl-distance').click();assert.equal(await page.locator('.bl-interact').isVisible(),false);
  await page.locator('.bl-distance').click();await page.locator('.bl-interact').click();
  if(flow==='socket')assert.equal(await page.locator('.bl-use').isDisabled(),true);
  if(flow==='hold'){await hold(300);assert.equal(await page.locator('.bl-item-count').textContent(),'×3');assert.equal(await page.locator('.bl-shade').isVisible(),true);}
  await fill(flow,5);assert.equal(await page.locator('.bl-timer').textContent(),'05:00',flow+' first fill');
  assert.equal(await page.locator('[data-key-minutes="5"] small').textContent(),'×2');
  await page.locator('.bl-interact').click();await fill(flow,10);
  assert.equal(await page.locator('.bl-timer').textContent(),flow==='hold'?'14:59':'15:00',flow+' mixed refill');
  assert.equal(await page.locator('.bl-altar').getAttribute('data-tier'),'gold');
  await page.locator('.bl-interact').click();await page.locator('.bl-cancel').click();assert.equal(await page.locator('.bl-timer').textContent(),flow==='hold'?'14:59':'15:00');
 }
 // Switching presentations must retain the shared inventory and remaining protection.
 await page.locator('[data-bl-flow="confirm"]').click();assert.equal(await page.locator('.bl-timer').textContent(),'15:00');
 assert.equal(await page.locator('[data-key-minutes="5"] small').textContent(),'×2');
 const reports=[];
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1200});
  for(const flow of flows){
   await page.locator(`[data-bl-flow="${flow}"]`).click();await page.locator('.bl-reset').click();await page.locator('.bl-interact').click();await page.evaluate(()=>document.fonts.ready);await page.locator('.bl-dialog').evaluate(el=>el.getAnimations().forEach(animation=>animation.finish()));
   const data=await page.evaluate(()=>{const d=document.querySelector('.bl-dialog'),f=document.querySelector('.bl-frame'),a=d.getBoundingClientRect(),b=f.getBoundingClientRect();return {inside:a.left>=b.left&&a.right<=b.right&&a.top>=b.top&&a.bottom<=b.bottom,pageOverflow:document.documentElement.scrollWidth>innerWidth,dialogOverflow:d.scrollWidth>d.clientWidth+1};});
   assert(data.inside,`${flow}/${width}: dialog clipped`);assert(!data.pageOverflow,`${flow}/${width}: page overflow`);assert(!data.dialogOverflow,`${flow}/${width}: dialog overflow`);
   if(width===1440||width===390)await page.locator('.bl-frame').screenshot({path:`outputs/base-lock/flow-${flow}-${width}.png`});
   reports.push({flow,width,...data});await page.locator('.bl-close').click();
  }
 }
 fs.writeFileSync('outputs/base-lock/flow-checks.json',JSON.stringify(reports,null,2));
 console.log('PASS: two retained flows, quick fill, confirmation, mixed refill, shared state, proximity and 8 responsive layouts');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
