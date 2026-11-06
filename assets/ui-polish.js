(function(){
  const palette={COMMON:'#6de0ac',RARE:'#7bc3ff',EPIC:'#c49aff',LEGENDARY:'#ffda83',MYTHIC:'#ff9298',APEX:'#65e8dc'};
  const root=document.querySelector('main');let queued=false;
  function decorate(){queued=false;for(const td of root.querySelectorAll('.genDebug td,.fishingDebugPanel td')){const rarity=td.textContent.trim();if(palette[rarity]&&!td.classList.contains('uiRarity')){td.classList.add('uiRarity');td.style.setProperty('--rarity-color',palette[rarity]);}}}
  new MutationObserver(records=>{if(queued||!records.some(r=>r.type==='childList'))return;queued=true;requestAnimationFrame(decorate);}).observe(root,{childList:true,subtree:true});decorate();
})();
