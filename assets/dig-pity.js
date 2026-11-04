/* Shared dig state lets each presentation show the same pity cycle. */
(function(){
 'use strict';
 var root=document.getElementById('tab-dig'),pity=7,dug=0,completed=false,result='',timer;
 function all(selector){return root.querySelectorAll(selector)}
 function render(){
  var ready=pity===10;window.PityConcepts.render(root,pity,'dig');
  all('.digScene').forEach(function(scene){scene.classList.toggle('digComplete',completed)});
  all('.digProgressFill').forEach(function(f){f.style.width=dug+'%';var t=f.parentElement;t.setAttribute('role','progressbar');t.setAttribute('aria-label','Current dig progress');t.setAttribute('aria-valuemin','0');t.setAttribute('aria-valuemax','100');t.setAttribute('aria-valuenow',dug)});
  all('.digShovelMarker').forEach(function(m){m.style.left=dug+'%'});
  all('.digFindResult').forEach(function(r){r.textContent=result;r.classList.toggle('visible',completed)});
  all('.digHit').forEach(function(b){b.disabled=completed});
  document.getElementById('digDemoComplete').disabled=completed||root.querySelector('#dig-scan.active')!==null;
  root.querySelector('.activityFeedback').textContent=completed?result:ready?'Pity 10/10 · Your next completed dig guarantees a reward.':'Dig '+dug+'% · Pity '+pity+'/10 · Complete a dig to add 1 pity.';
 }
 function finish(){
  if(completed)return;
  dug=100;completed=true;
  window.RevivalAudio?.play(pity===10 ? 'catch' : 'excellent');
  if(pity===10){pity=0;result='✦ Guaranteed reward found! Pity reset to 0/10.'}
  else{pity++;result=pity===10?'✦ Pity 10/10! Your next dig is guaranteed.':'Discovery complete · Pity +1 ('+pity+'/10)'}
  render();
  timer=setTimeout(function(){dug=0;completed=false;result='';render()},1800);
 }
 all('.digHit').forEach(function(btn){btn.addEventListener('click',function(){if(completed)return;dug=Math.min(100,dug+20);if(dug===100){finish();return}render();var scene=btn.closest('.digScene');scene.classList.remove('digJustHit');void scene.offsetWidth;scene.classList.add('digJustHit')})});
 document.getElementById('digDemoComplete').addEventListener('click',finish);
 document.getElementById('digDemoReset').addEventListener('click',function(){clearTimeout(timer);pity=7;dug=0;completed=false;result='';render()});
 all('.lbSubBtn').forEach(function(b){b.addEventListener('click',render)});
 document.querySelectorAll('.prototypeTabs button').forEach(function(b){b.addEventListener('click',render)});
 render();
})();
