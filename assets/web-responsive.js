/* Presentation-only browser adapter. No gameplay state is read or changed. */
(()=>{
 const scene=document.getElementById('scene');
 const fitShop=()=>scene.style.setProperty('--web-shop-scale',Math.min((innerWidth-16)/1196,(innerHeight-24)/804,1));
 fitShop();window.addEventListener('resize',fitShop,{passive:true});
 const layer=document.getElementById('gddMilestoneLayer');
 if(layer){const annotate=()=>{let threshold='';for(const child of layer.children){if(child.classList.contains('msnode'))threshold=child.textContent.trim();else if(child.classList.contains('msrow'))child.dataset.threshold=threshold;}};annotate();new MutationObserver(annotate).observe(layer,{childList:true});}
 document.querySelectorAll('img').forEach(img=>{img.decoding='async';img.draggable=false;});
 // Images created by reward/shop scripts should also wait until visible.
 new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes){
   if(node.nodeType!==1)continue;
   const images=node.matches('img')?[node]:node.querySelectorAll('img');
   for(const img of images){if(!img.hasAttribute('loading'))img.loading='lazy';img.decoding='async';img.draggable=false;}
  }
 }).observe(document.querySelector('main'),{childList:true,subtree:true});
 const main=document.querySelector('main');
 if(!main)return;
 const controls=document.createElement('div');
 controls.className='previewControls';
 controls.innerHTML='<button type="button" aria-pressed="false">↻ Xoay ngang</button><button type="button" aria-pressed="false">⛶ Toàn màn hình</button><span class="previewNotice" role="status"></span>';
 main.prepend(controls);
 const [rotate,fullscreen]=controls.querySelectorAll('button');
 const notice=controls.querySelector('[role="status"]');
 let immersive=false;
 const sync=()=>{
  const active=!!document.fullscreenElement||!!document.webkitFullscreenElement||immersive;
  document.documentElement.classList.toggle('previewImmersive',active);
  fullscreen.textContent=active?'⛶ Thoát toàn màn hình':'⛶ Toàn màn hình';
  fullscreen.setAttribute('aria-pressed',String(active));
 };
 rotate.addEventListener('click',()=>{
  const active=document.documentElement.classList.toggle('previewRotated');
  rotate.setAttribute('aria-pressed',String(active));
  rotate.textContent=active?'↻ Về chiều dọc':'↻ Xoay ngang';
  window.dispatchEvent(new Event('resize'));
 });
 fullscreen.addEventListener('click',async()=>{
  notice.textContent='';
  try{
   if(document.fullscreenElement)await document.exitFullscreen();
   else if(document.webkitFullscreenElement)document.webkitExitFullscreen();
   else if(immersive){immersive=false;}
   else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();
   else if(document.documentElement.webkitRequestFullscreen)document.documentElement.webkitRequestFullscreen();
   else {immersive=true;notice.textContent='Chế độ tràn màn hình. Trình duyệt này không hỗ trợ ẩn thanh địa chỉ.';}
  }catch(error){immersive=true;notice.textContent='Đang dùng chế độ tràn màn hình vì trình duyệt không cho phép fullscreen.';}
  sync();
 });
 document.addEventListener('fullscreenchange',sync);
 document.addEventListener('webkitfullscreenchange',sync);
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&immersive){immersive=false;sync();}});
 // Suppress the mobile callout without cancelling pointer events used by hold actions.
 main.addEventListener('contextmenu',event=>{
  if(!event.target.closest('input,textarea,[contenteditable="true"]'))event.preventDefault();
 });
})();
