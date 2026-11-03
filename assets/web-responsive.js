/* Presentation-only browser adapter. No gameplay state is read or changed. */
(()=>{
 const scene=document.getElementById('scene');
 const fitShop=()=>scene.style.setProperty('--web-shop-scale',Math.min((innerWidth-16)/1196,(innerHeight-24)/804,1));
 fitShop();window.addEventListener('resize',fitShop,{passive:true});
 const layer=document.getElementById('gddMilestoneLayer');
 if(layer){const annotate=()=>{let threshold='';for(const child of layer.children){if(child.classList.contains('msnode'))threshold=child.textContent.trim();else if(child.classList.contains('msrow'))child.dataset.threshold=threshold;}};annotate();new MutationObserver(annotate).observe(layer,{childList:true});}
 document.querySelectorAll('img').forEach(img=>{img.decoding='async';img.draggable=false;});
})();
