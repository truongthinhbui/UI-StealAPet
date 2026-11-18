(() => {
  'use strict';

  const tab = document.getElementById('tab-lucky-burst');
  const scene = tab.querySelector('.luckyBurstStage');
  const duration = 5000;
  const kirinSprite = 'assets/fishing-luck-kirin.png';
  const preview = tab.querySelector('.fishingLuckPreview');
  preview.dataset.burstVersion = '1';
  preview.textContent = 'V1 · Thả quà';
  const previews = document.createElement('div');
  previews.className = 'luckyBurstPreviews';
  previews.setAttribute('role', 'group');
  previews.setAttribute('aria-label', 'Chọn bản chạy thử 5 giây');
  preview.before(previews);
  previews.append(preview);
  ['Sét', 'Trứng', 'Rương', 'Thẻ'].forEach((label, index) => {
    const button = preview.cloneNode(false);
    button.dataset.burstVersion = String(index + 2);
    button.textContent = 'V' + (index + 2) + ' · ' + label;
    previews.append(button);
  });

  const announcement = document.createElement('span');
  announcement.className = 'fishingLuckAnnouncement';
  announcement.setAttribute('role', 'status');
  previews.after(announcement);

  const overlay = document.createElement('div');
  overlay.className = 'fishingLuck';
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="fishingLuckRunner"><img src="${kirinSprite}" alt=""></div>
    <div class="fishingLuckGift">
      <img class="fishingLuckBase" src="assets/fishing-luck-base.png" alt="">
      <img class="fishingLuckLid" src="assets/fishing-luck-lid.png" alt="">
    </div>
    <div class="fishingLuckBurst"></div>
    <div class="fishingLuckRing"></div>
    <div class="burstStorm"><i></i><i></i><i></i><b></b></div>
    <div class="burstEgg"><i></i><i></i><b></b></div>
    <div class="burstChestBeam"></div>
    <div class="burstPack"><i></i><b></b></div>
    <div class="burstCard"><i>✦</i><img src="${kirinSprite}" alt=""></div>
    <div class="fishingLuckParticles"></div>
    <div class="fishingLuckReward">
      <img src="${kirinSprite}" alt="">
      <strong>APEX</strong>
      <span>KIRIN</span>
    </div>`;
  scene.append(overlay);

  const particles = overlay.querySelector('.fishingLuckParticles');
  const colors = ['#fff3aa', '#ffc440', '#fffdf1', '#57e1c9'];
  for (let index = 0; index < 24; index++) {
    const particle = document.createElement('i');
    const angle = index * Math.PI * 2 / 24;
    const distance = 10 + (index * 7 % 16);
    particle.style.setProperty('--particle-x', Math.cos(angle) * distance + 'cqw');
    particle.style.setProperty('--particle-y', (Math.sin(angle) * distance * .68 - 7) + 'cqw');
    particle.style.setProperty('--particle-spin', (index % 2 ? -1 : 1) * (100 + index * 11) + 'deg');
    particle.style.setProperty('--particle-color', colors[index % colors.length]);
    particle.classList.toggle('is-sparkle', index % 3 === 0);
    particles.append(particle);
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cues = {
    1: [[2150, 'glitchLand'], [3300, 'bonus']],
    2: [[1300, 'kickCharge'], [1900, 'glitchIgnite'], [2550, 'excellent'], [3300, 'catch']],
    3: [[1800, 'ballBounce'], [2530, 'good'], [3300, 'break'], [3510, 'bonus']],
    4: [[1100, 'glitchLand'], [2800, 'glitchOpen'], [3680, 'bonus']],
    5: [[1750, 'break'], [3180, 'glitchJump'], [3450, 'bonus']]
  };
  let playing = false;

  function play(button) {
    if (playing) return;
    playing = true;
    previews.querySelectorAll('button').forEach(item => { item.disabled = true; });
    overlay.dataset.version = button.dataset.burstVersion;
    button.classList.add('is-playing');
    announcement.textContent = 'Lucky Burst started.';
    overlay.hidden = false;
    overlay.classList.toggle('fishingLuckReduced', motion.matches);
    overlay.style.setProperty('--luck-duration', duration + 'ms');

    // The parent fade is the master clock, including when its tab is hidden.
    const clock = overlay.animate([
      { opacity: 1 }, { opacity: 1, offset: .94 }, { opacity: 0 }
    ], { duration, fill: 'both' });
    const audioTimers = cues[overlay.dataset.version].map(([at, cue]) => setTimeout(() => {
      if (tab.classList.contains('active')) window.RevivalAudio?.play(cue);
    }, at));
    clock.finished.finally(() => {
      audioTimers.forEach(timer => clearTimeout(timer));
      overlay.hidden = true;
      clock.cancel();
      previews.querySelectorAll('button').forEach(item => { item.disabled = false; });
      button.classList.remove('is-playing');
      playing = false;
      announcement.textContent = 'Lucky Burst: Kirin revealed.';
    });
  }

  previews.addEventListener('click', event => {
    const button = event.target.closest('button[data-burst-version]');
    if (button) play(button);
  });
})();
