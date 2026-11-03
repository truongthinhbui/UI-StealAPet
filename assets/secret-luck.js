(function(){
 'use strict';
 var root=document.getElementById('tab-secret-luck'),slider=document.getElementById('secretLuckValue'),output=document.getElementById('secretLuckOutput'),play=document.getElementById('secretLuckPlay'),frame=null;
 var stages=[{at:0,color:'#75bc75',light:'#c1efad',name:'Growing'},{at:35,color:'#59b9ed',light:'#bdefff',name:'Rare'},{at:60,color:'#ae79ef',light:'#e5c4ff',name:'Epic'},{at:85,color:'#f4a44c',light:'#ffe0a2',name:'Legendary'},{at:100,color:'#ffd143',light:'#fff5bb',name:'MAX'}];
 function blend(a,b,t){var x=a.match(/\w\w/g).map(function(v){return parseInt(v,16)}),y=b.match(/\w\w/g).map(function(v){return parseInt(v,16)});return '#'+x.map(function(v,i){return Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')}).join('')}
 function render(value){
  value=Math.max(0,Math.min(100,Number(value)));slider.value=value;output.textContent=value+'%';
  var low=stages[0],high=stages[1];for(var i=1;i<stages.length;i++){high=stages[i];if(value<=high.at)break;low=high}var t=(value-low.at)/(high.at-low.at),color=blend(low.color,high.color,t),light=blend(low.light,high.light,t),stage=value===100?'MAX':low.name;
  document.getElementById('secretLuckStage').textContent=stage;root.style.setProperty('--luck-color',color);
  root.querySelectorAll('.secretLuck, .luckConcept').forEach(function(bar){bar.style.setProperty('--fill',value+'%');bar.style.setProperty('--luck-color',color);bar.style.setProperty('--luck-light',light);bar.style.setProperty('--luck-glow',color+'99');bar.style.setProperty('--luck-strength',(.12+value/150).toFixed(2));bar.classList.toggle('luckNearFull',value>=85&&value<100);bar.classList.toggle('luckFull',value===100);bar.classList.toggle('luckEmpty',value===0);bar.closest('.luckStudyScene').classList.toggle('luckSceneFull',value===100);bar.setAttribute('aria-valuenow',value);bar.setAttribute('aria-valuetext',value+'%, '+stage);bar.querySelector('.secretLuckPercent').textContent='+'+(100+value)+'%';bar.querySelectorAll('[data-threshold]').forEach(function(marker){marker.classList.toggle('reached',value>=Number(marker.dataset.threshold))})})
 }

 function stop(){if(frame!==null)cancelAnimationFrame(frame);frame=null;play.textContent='Play fill';play.setAttribute('aria-pressed','false')}
 slider.addEventListener('input',function(){stop();render(Number(slider.value))});
 document.getElementById('secretLuckReset').addEventListener('click',function(){stop();render(54)});
 play.addEventListener('click',function(){if(frame!==null){stop();return}play.textContent='Pause';play.setAttribute('aria-pressed','true');var started=null;function tick(time){if(started===null)started=time;var value=Math.min(100,Math.round((time-started)/35));render(value);if(value<100)frame=requestAnimationFrame(tick);else stop()}frame=requestAnimationFrame(tick)});
 document.getElementById('secretLuckEffects').addEventListener('change',function(){root.classList.toggle('luckEffectsOff',!this.checked)});
 root.querySelectorAll('.secretLuckHelp').forEach(function(button){button.addEventListener('click',function(){document.getElementById('secretLuckExplanation').textContent='Preview: fill 0–100% maps to +100–200% Lucky Box. Colors and effects intensify as the bar fills.'})});
 document.querySelectorAll('.prototypeTabs button').forEach(function(button){button.addEventListener('click',function(){if(button.dataset.tab!=='tab-secret-luck')stop()})});
 var tabs = Array.from(root.querySelectorAll('.luckConceptTabs [role="tab"]'));
 function selectConcept(selected) {
  tabs.forEach(function(tab) {
   var active = tab === selected;
   tab.setAttribute('aria-selected', String(active));
   tab.tabIndex = active ? 0 : -1;
   document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
 }
 tabs.forEach(function(tab, index) {
  tab.addEventListener('click', function() { selectConcept(tab); });
  tab.addEventListener('keydown', function(event) {
   var next = {ArrowLeft:(index + tabs.length - 1) % tabs.length, ArrowRight:(index + 1) % tabs.length, Home:0, End:tabs.length - 1}[event.key];
   if (next === undefined) return;
   event.preventDefault();
   selectConcept(tabs[next]);
   tabs[next].focus();
  });
 });
 render(54);
})();
