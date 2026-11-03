(function(){
 'use strict';
 var root=document.getElementById('tab-secret-luck'),slider=document.getElementById('secretLuckValue'),output=document.getElementById('secretLuckOutput'),play=document.getElementById('secretLuckPlay'),frame=null;
 var rewards = Array.from(root.querySelectorAll('[data-luck-reward]'));
 var claimed = new Set();
 var logos = root.querySelectorAll('.luckBarRewardLogo');
 var icons = {25:'milestone-cash.png',50:'polish-dust.png',75:'milestone-cash.png',100:'luckybox-icon.png'};
 var pendingReward;
 logos.forEach(function(logo) {
  logo.addEventListener('click', function() {
   if (pendingReward) pendingReward.click();
  });
 });

 function renderRewardLogos() {
  pendingReward = rewards.find(function(button) { return !button.disabled; });
  var name = pendingReward ? 'Claim ' + pendingReward.previousElementSibling.textContent : 'Lucky Box';
  var threshold = pendingReward?.dataset.luckReward;
  logos.forEach(function(logo) {
   logo.classList.toggle('rewardReady', Boolean(pendingReward));
   logo.classList.toggle('bonusBoxReady', threshold === '100');
   logo.setAttribute('aria-label', name);
   logo.setAttribute('aria-disabled', String(!pendingReward));
   logo.tabIndex = pendingReward ? 0 : -1;
   logo.querySelector('img').src = 'assets/' + (icons[threshold] || 'luckybox-icon.png');
   var label = logo.querySelector('.boxRewardLogoLabel');
   label.textContent = name;
   label.hidden = !pendingReward;
  });
 }
 var rewardStatus = document.getElementById('luckRewardStatus');
 var meters = root.querySelectorAll('.secretLuck, .luckConcept');
 var knots = [];
 meters.forEach(function(meter) {
  var dial = meter.querySelector('.luckDial');
  var arc = meter.classList.contains('luckConcept-arc');
  var vertical = meter.classList.contains('vertical');
  var center = meter.classList.contains('center');
  var track = dial || meter.querySelector('.luckMiniTrack, .luckMilestoneTrack') || meter;
  rewards.forEach(function(button) {
   var threshold = Number(button.dataset.luckReward);
   var knot = track.querySelector('[data-threshold="' + threshold + '"]');
   if (!knot) {
    knot = document.createElement('span');
    knot.className = 'luckRewardKnot';
    knot.setAttribute('aria-hidden', 'true');
    var position = center ? 50 + threshold / 2 : threshold;
    if (dial) {
     var angle = (arc ? 225 + threshold * 2.7 : threshold * 3.6) * Math.PI / 180;
     knot.style.left = (50 + 46 * Math.sin(angle)) + '%';
     knot.style.top = (50 - 46 * Math.cos(angle)) + '%';
    } else if (vertical) {
     knot.style.top = (100 - position) + '%';
    } else {
     knot.style.left = position + '%';
    }
    track.appendChild(knot);
   }
   knot.title = (100 + threshold) + '% Luck Boost · ' + button.previousElementSibling.textContent;
   knots.push({element:knot, threshold:threshold});
  });
 });

 function renderKnots(value) {
  var next = rewards.find(function(button) { return Number(button.dataset.luckReward) > value; });
  var nextThreshold = next ? Number(next.dataset.luckReward) : null;
  knots.forEach(function(knot) {
   knot.element.classList.toggle('knotNext', knot.threshold === nextThreshold);
   knot.element.classList.toggle('knotReady', value >= knot.threshold && !claimed.has(knot.threshold));
   knot.element.classList.toggle('knotClaimed', claimed.has(knot.threshold));
  });
  document.getElementById('luckNextReward').textContent = next
   ? 'Next reward at ' + (100 + nextThreshold) + '% · ' + next.previousElementSibling.textContent + ' · ' + (nextThreshold - value) + ' percentage points to go'
   : 'All reward milestones reached.';
 }

 function renderRewards(value) {
  rewards.forEach(function(button) {
   var threshold = Number(button.dataset.luckReward);
   var received = claimed.has(threshold);
   button.disabled = received || value < threshold;
   button.textContent = received ? 'Claimed' : button.disabled ? 'Locked' : 'Claim';
  });
  renderRewardLogos();
  renderKnots(value);
 }
 rewards.forEach(function(button) {
  button.addEventListener('click', function() {
   var threshold = Number(button.dataset.luckReward);
   if (claimed.has(threshold) || Number(slider.value) < threshold) return;
   claimed.add(threshold);
   renderRewards(Number(slider.value));
   rewardStatus.textContent = 'Claimed ' + button.previousElementSibling.textContent + '.';
  });
 });
 var stages=[{at:0,color:'#75bc75',light:'#c1efad',name:'Growing'},{at:35,color:'#59b9ed',light:'#bdefff',name:'Rare'},{at:60,color:'#ae79ef',light:'#e5c4ff',name:'Epic'},{at:85,color:'#f4a44c',light:'#ffe0a2',name:'Legendary'},{at:100,color:'#ffd143',light:'#fff5bb',name:'MAX'}];
 function blend(a,b,t){var x=a.match(/\w\w/g).map(function(v){return parseInt(v,16)}),y=b.match(/\w\w/g).map(function(v){return parseInt(v,16)});return '#'+x.map(function(v,i){return Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')}).join('')}
 function render(value){
  value=Math.max(0,Math.min(100,Number(value)));slider.value=value;output.textContent=(100+value)+'%';renderRewards(value);
  var low=stages[0],high=stages[1];for(var i=1;i<stages.length;i++){high=stages[i];if(value<=high.at)break;low=high}var t=(value-low.at)/(high.at-low.at),color=blend(low.color,high.color,t),light=blend(low.light,high.light,t),stage=value===100?'Boost capped':low.name;
  document.getElementById('secretLuckStage').textContent=stage;root.style.setProperty('--luck-color',color);
  root.querySelectorAll('.secretLuck, .luckConcept').forEach(function(bar){bar.style.setProperty('--fill',value+'%');bar.style.setProperty('--luck-color',color);bar.style.setProperty('--luck-light',light);bar.style.setProperty('--luck-glow',color+'99');bar.style.setProperty('--luck-strength',(.12+value/150).toFixed(2));bar.classList.toggle('luckNearFull',value>=85);bar.classList.toggle('luckEmpty',value===0);bar.setAttribute('aria-valuenow',value);bar.setAttribute('aria-valuetext',(100+value)+'% Luck Boost, '+stage);bar.querySelector('.secretLuckPercent').textContent=(100+value)+'%';bar.querySelectorAll('[data-threshold]').forEach(function(marker){marker.classList.toggle('reached',value>=Number(marker.dataset.threshold))})})
 }

 function stop(){if(frame!==null)cancelAnimationFrame(frame);frame=null;play.textContent='Play fill';play.setAttribute('aria-pressed','false')}
 slider.addEventListener('input',function(){stop();render(Number(slider.value))});
 document.getElementById('secretLuckReset').addEventListener('click',function(){stop();claimed.clear();rewardStatus.textContent='';render(54)});
 play.addEventListener('click',function(){if(frame!==null){stop();return}play.textContent='Pause';play.setAttribute('aria-pressed','true');var started=null;function tick(time){if(started===null)started=time;var value=Math.min(100,Math.round((time-started)/35));render(value);if(value<100)frame=requestAnimationFrame(tick);else stop()}frame=requestAnimationFrame(tick)});
 document.getElementById('secretLuckEffects').addEventListener('change',function(){root.classList.toggle('luckEffectsOff',!this.checked)});
 root.querySelectorAll('.secretLuckHelp').forEach(function(button){button.addEventListener('click',function(){document.getElementById('secretLuckExplanation').textContent='Luck Boost raises the Mythic drop chance from 1% to a cap of 3%. Mythic pets are never guaranteed. Milestone bonuses can be claimed separately.'})});
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
