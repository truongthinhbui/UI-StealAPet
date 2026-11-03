/* Shared pity presentation and paired concept navigation for both activities. */
(function(){
 'use strict';
 window.PityConcepts={render:function(root,pity,action){
  var ready=pity===10,color=ready?'#ffe08a':pity>=9?'#ff9775':pity>=7?'#f3c66b':'#8be1ba';
  function all(s){return root.querySelectorAll(s)}
  all('.lbScene,.digScene').forEach(function(scene){scene.style.setProperty('--pity-color',color);scene.style.setProperty('--pity-value',pity/10);scene.classList.toggle('pityMeterReady',ready)});
  all('.pityMeter').forEach(function(m){m.setAttribute('aria-valuenow',pity);m.setAttribute('aria-valuetext',ready?'Guaranteed reward on next '+action:pity+' of 10')});
  all('.pityMeterCount').forEach(function(n){n.textContent=pity+'/10'});
  all('.pityMeterFill').forEach(function(f){f.style.width=pity*10+'%'});
  all('.pityMeterRingFill').forEach(function(f){f.style.strokeDashoffset=339.3*(1-pity/10)});
  all('.pityMeterSegments').forEach(function(track){Array.from(track.children).forEach(function(cell,i){cell.classList.toggle('filled',i<pity)})});
  all('.pityMeterCaption').forEach(function(c){c.textContent=ready?'Next '+action+': guaranteed reward':(10-pity)+' to guarantee'});
 }};
 // Keep the selected concept paired across tabs; activity counters stay independent.
 document.querySelectorAll('[data-concept]').forEach(function(button){button.addEventListener('click',function(){
  document.querySelectorAll('.prototypePane').forEach(function(pane){var match=pane.querySelector('[data-concept="'+button.dataset.concept+'"]');if(!match)return;pane.querySelectorAll('.lbSubBtn').forEach(function(b){var active=b===match;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))});pane.querySelectorAll('.lbSubPane').forEach(function(p){p.classList.toggle('active',p.id===match.dataset.sub)})});
 })});
 var root=document.getElementById('tab-luckybox'),pity=7,timer;
 function render(message){window.PityConcepts.render(root,pity,'open');root.querySelector('.activityFeedback').textContent=message||(pity===10?'Pity 10/10 · Your next box guarantees a reward.':'Pity '+pity+'/10 · Open a box to add 1 pity.')}
 function open(){clearTimeout(timer);var reward=pity===10;pity=reward?0:pity+1;render(reward?'✦ Guaranteed reward found! Pity reset to 0/10.':null);root.querySelectorAll('.digFindResult').forEach(function(r){r.textContent=reward?'✦ Guaranteed reward found!':pity===10?'✦ Pity full · Next box is guaranteed':'Pity +1 · '+pity+'/10';r.classList.add('visible')});timer=setTimeout(function(){root.querySelectorAll('.digFindResult').forEach(function(r){r.classList.remove('visible')})},1800)}
 root.querySelectorAll('.lbOpenHit').forEach(function(b){b.addEventListener('click',open)});
 document.getElementById('luckyDemoComplete').addEventListener('click',open);
 document.getElementById('luckyDemoReset').addEventListener('click',function(){clearTimeout(timer);pity=7;root.querySelectorAll('.digFindResult').forEach(function(r){r.classList.remove('visible')});render()});
 render();
})();
