/* Shared pity presentation and paired concept navigation for both activities. */
(function(){
 'use strict';
 window.PityConcepts={render:function(root,pity,action,boost){
  var ready=pity===10,color=ready?'#ffe08a':pity>=9?'#ff9775':pity>=7?'#f3c66b':'#8be1ba';
  function all(s){return root.querySelectorAll(s)}
  all('.lbScene,.digScene').forEach(function(scene){scene.style.setProperty('--pity-color',color);scene.style.setProperty('--pity-value',pity/10);scene.classList.toggle('pityMeterReady',ready)});
  all('.pityMeter').forEach(function(m){m.setAttribute('aria-valuenow',boost ? boost.level : pity);m.setAttribute('aria-valuetext',boost ? boost.label : ready?'Guaranteed reward on next '+action:pity+' of 10')});
  all('.pityMeterCount').forEach(function(n){n.textContent=boost ? boost.label : pity+'/10'});
  all('.pityMeterFill').forEach(function(f){f.style.width=pity*10+'%'});
  all('.pityMeterRingFill').forEach(function(f){f.style.strokeDashoffset=339.3*(1-pity/10)});
  all('.pityMeterSegments').forEach(function(track){Array.from(track.children).forEach(function(cell,i){cell.classList.toggle('filled',i<pity)})});
  all('.pityMeterCaption').forEach(function(c){c.textContent=boost ? 'Luck Boost' : ready?'Next '+action+': guaranteed reward':(10-pity)+' to guarantee'});
 }};
 // Keep the selected concept paired across tabs; activity counters stay independent.
 document.querySelectorAll('[data-concept]').forEach(function(button){button.addEventListener('click',function(){
  document.querySelectorAll('.prototypePane').forEach(function(pane){var match=pane.querySelector('[data-concept="'+button.dataset.concept+'"]');if(!match)return;pane.querySelectorAll('.lbSubBtn').forEach(function(b){var active=b===match;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))});pane.querySelectorAll('.lbSubPane').forEach(function(p){p.classList.toggle('active',p.id===match.dataset.sub)})});
 })});
 var root = document.getElementById('tab-luckybox');
 var rewardButtons = root.querySelectorAll('[data-box-reward]');
 var rewardStatus = document.getElementById('boxRewardStatus');
 var logos = root.querySelectorAll('.boxRewardLogo');
 var rewardIcons = {
  5: 'milestone-cash.png',
  10: 'polish-dust.png',
  15: 'milestone-cash.png',
  20: 'luckybox-icon.png'
 };
 var pendingReward;

 function renderLogo() {
  pendingReward = Array.from(rewardButtons).find(function(button) { return !button.disabled; });
  var rewardName = pendingReward && pendingReward.previousElementSibling.textContent;
  logos.forEach(function(logo) {
   logo.classList.toggle('rewardReady', Boolean(pendingReward));
   logo.classList.toggle('bonusBoxReady', pendingReward?.dataset.boxReward === '20');
   logo.setAttribute('aria-disabled', String(!pendingReward));
   logo.tabIndex = pendingReward ? 0 : -1;
   logo.setAttribute('aria-label', rewardName ? 'Claim ' + rewardName : 'Lucky Box');
   logo.querySelector('img').src = 'assets/' + (pendingReward ? rewardIcons[pendingReward.dataset.boxReward] : 'luckybox-icon.png');
   var label = logo.querySelector('.boxRewardLogoLabel');
   label.hidden = !pendingReward;
   label.textContent = rewardName ? 'Claim ' + rewardName : '';
  });
 }
 logos.forEach(function(logo) {
  logo.addEventListener('click', function() {
   if (pendingReward) pendingReward.click();
  });
 });
 var claimed = new Set();
 var opens = 0;
 var timer;

 function chance() {
  return (10 + Math.min(opens, 20)) / 1000;
 }

 function render(message) {
  var level = Math.min(opens, 20);
  var odds = (chance() * 100).toFixed(1) + '%';
  window.PityConcepts.render(root, level / 2, 'open', {level:level, label:(100 + level * 5) + '%'});
  root.querySelector('.activityFeedback').textContent = (message ? message + ' · ' : '') +
   'Next box: ' + odds + ' Mythic chance' + (level === 20 ? ' · Boost capped' : '');
  rewardButtons.forEach(function(button) {
   var threshold = Number(button.dataset.boxReward);
   var received = claimed.has(threshold);
   button.disabled = received || opens < threshold;
   button.textContent = received ? 'Claimed' : button.disabled ? 'Locked' : 'Claim';
  });
  renderLogo();
 }

 function open() {
  clearTimeout(timer);
  var mythic = Math.random() < chance();
  opens++;
  var result = mythic ? 'Mythic pet found!' : 'Box opened';
  render(result);
  var results = root.querySelectorAll('.digFindResult');
  results.forEach(function(label) {
   label.textContent = result;
   label.classList.add('visible');
  });
  timer = setTimeout(function() {
   results.forEach(function(label) { label.classList.remove('visible'); });
  }, 1800);
 }

 rewardButtons.forEach(function(button) {
  button.addEventListener('click', function() {
   var threshold = Number(button.dataset.boxReward);
   if (opens < threshold || claimed.has(threshold)) return;
   claimed.add(threshold);
   rewardStatus.textContent = 'Claimed ' + button.previousElementSibling.textContent + '.';
   render();
  });
 });
 root.querySelectorAll('.lbOpenHit').forEach(function(button) { button.addEventListener('click', open); });
 document.getElementById('luckyDemoComplete').addEventListener('click', open);
 document.getElementById('luckyDemoReset').addEventListener('click', function() {
  clearTimeout(timer);
  opens = 0;
  claimed.clear();
  root.querySelectorAll('.digFindResult').forEach(function(label) { label.classList.remove('visible'); });
  rewardStatus.textContent = 'Each milestone bonus can be claimed once. Mythic drops are random.';
  render();
 });
 render();
})();
