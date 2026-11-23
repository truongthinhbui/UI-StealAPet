const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/truongthinh.bui_ctv/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage();const results=[];
 for(const width of [1440,1024,768,650,390,320]){
  await page.setViewportSize({width,height:1000});await page.goto('file:///D:/revival-prototype-ui-update/index.html#/base-lock');await page.locator('#base-lock-tab').click();await page.locator('[data-bl-step="dialog"]').click();await page.evaluate(()=>document.fonts.ready);
  const r=await page.evaluate(()=>{
   const q=s=>document.querySelector(s),rect=s=>q(s).getBoundingClientRect(),frame=rect('.bl-frame'),dialog=rect('.bl-dialog');
   const buttons=[...document.querySelectorAll('.bl-actions button')].map(button=>{const r=button.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(button);const text=range.getBoundingClientRect();return {width:r.width,height:r.height,textWidth:text.width,centerOffsetX:(text.left+text.right-r.left-r.right)/2,centerOffsetY:(text.top+text.bottom-r.top-r.bottom)/2,font:getComputedStyle(button).fontFamily}});
   return {overflow:document.documentElement.scrollWidth>innerWidth,dialogInFrame:dialog.left>=frame.left&&dialog.right<=frame.right&&dialog.top>=frame.top&&dialog.bottom<=frame.bottom,scrolling:q('.bl-dialog').scrollHeight>q('.bl-dialog').clientHeight+1,buttons,fonts:[getComputedStyle(q('.bl-title')).fontWeight,getComputedStyle(q('.bl-dialog-copy')).fontWeight]};
  });
  assert(!r.overflow,`${width}: page overflow`);assert(r.dialogInFrame,`${width}: clipped dialog`);assert(!r.scrolling,`${width}: dialog unexpectedly scrolls`);
  assert(Math.abs(r.buttons[0].width-r.buttons[1].width)<1,`${width}: uneven buttons`);
  for(const b of r.buttons){assert(Math.abs(b.centerOffsetX)<2,`${width}: label off center`);assert(b.textWidth<b.width-12,`${width}: label clipped`);assert(b.height>=48,`${width}: touch size`);}
  assert.deepEqual(r.fonts,['700','400']);results.push({width,...r});
  if([1440,768,390,320].includes(width))await page.locator('.bl-frame').screenshot({path:`outputs/base-lock/ui-dialog-${width}.png`});
 }
 fs.writeFileSync('outputs/base-lock/ui-layout-checks.json',JSON.stringify(results,null,2));console.log('PASS: 6 viewport widths, dialog bounds, equal buttons, centered labels, type weights and touch sizes');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
