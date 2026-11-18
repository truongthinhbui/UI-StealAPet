(() => {
  'use strict';

  const tab = document.getElementById('tab-lucky-burst');
  const scene = tab.querySelector('.luckyBurstStage');
  const defaultTiming = { duration: 5000, openingDuration: 3000 };
  const activityTiming = {
    7: { duration: 6400, openingDuration: 4200 },
    8: { duration: 7200, openingDuration: 5000 }
  };
  const kirinSprite = 'assets/fishing-luck-kirin.png';
  const preview = tab.querySelector('.fishingLuckPreview');
  preview.dataset.burstVersion = '1';
  preview.textContent = 'V1 · Thả quà';
  const previews = document.createElement('div');
  previews.className = 'luckyBurstPreviews';
  previews.setAttribute('role', 'group');
  previews.setAttribute('aria-label', 'Chọn bản chạy thử Lucky Burst');
  preview.before(previews);
  previews.append(preview);
  ['Sét', 'Trứng', 'Rương', 'Thẻ', 'Xé hộp', 'Đào quà', 'Câu quà'].forEach((label, index) => {
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
  const giftArt = `
    <img class="fishingLuckBase" src="assets/fishing-luck-base.png" alt="">
    <img class="fishingLuckLid" src="assets/fishing-luck-lid.png" alt="">`;
  const tornPieces = [
    ['0 0,53% 0,47% 19%,54% 30%,33% 32%,21% 26%,0 35%', -82, -84, -54],
    ['53% 0,100% 0,100% 35%,75% 26%,54% 30%,47% 19%', 78, -88, 48],
    ['0 35%,21% 26%,33% 32%,54% 30%,46% 45%,52% 57%,47% 70%,27% 64%,0 70%', -142, -22, -40],
    ['54% 30%,75% 26%,100% 35%,100% 70%,73% 64%,47% 70%,52% 57%,46% 45%', 140, -16, 42],
    ['0 70%,27% 64%,47% 70%,54% 83%,49% 100%,0 100%', -91, 26, -69],
    ['47% 70%,73% 64%,100% 70%,100% 100%,49% 100%,54% 83%', 94, 32, 72]
  ].map(([shape, x, y, rotation]) =>
    `<div class="burstTornPiece" style="clip-path:polygon(${shape});--tear-x:${x}%;--tear-y:${y}%;--tear-turn:${rotation}deg">${giftArt}</div>`
  ).join('');
  overlay.innerHTML = `
    <div class="fishingLuckRunner"><img src="${kirinSprite}" alt=""></div>
    <div class="burstDigProps"><i class="burstSoil"></i><div class="burstShovel"><i></i></div><span>ĐÀO</span></div>
    <div class="burstFishProps"><i class="burstPuddle"></i><i class="burstRipple"></i><i class="burstBobber"></i><div class="burstFishingRod"><i></i></div><span>CÂU CÁ</span></div>
    <div class="fishingLuckGift">${giftArt}</div>
    <div class="burstActivitySpray"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="burstTornGift">
      <i class="burstGiftLine"></i>
      <div class="burstTornPiece burstIntactGift">${giftArt}</div>
      ${tornPieces}
      <i class="burstTearSeam"></i>
      <div class="burstSlashTrails"><i></i><i></i><i></i></div>
    </div>
    <div class="fishingLuckBurst"></div>
    <div class="fishingLuckRing"></div>
    <div class="burstStorm"><i></i><i></i><i></i><b></b></div>
    <div class="burstEgg"><i></i><i></i><b></b></div>
    <div class="burstChestBeam"></div>
    <div class="burstPack"><i></i><b></b></div>
    <div class="burstCard"><i>✦</i><img src="${kirinSprite}" alt=""></div>
    <div class="burstRevealBackdrop"></div>
    <div class="burstRevealLights"></div>
    <div class="fishingLuckParticles"></div>
    <div class="burstRevealStars">
      <i></i><i></i><i></i><i></i><i></i><i></i>
    </div>
    <div class="fishingLuckReward">
      <img src="${kirinSprite}" alt="">
      <strong>APEX</strong>
      <span>KIRIN</span>
    </div>`;
  scene.append(overlay);
  const idleTools = document.createElement('div');
  idleTools.className = 'burstIdleTools';
  idleTools.setAttribute('aria-hidden', 'true');
  idleTools.append(
    overlay.querySelector('.burstShovel').cloneNode(true),
    overlay.querySelector('.burstFishingRod').cloneNode(true)
  );
  const meter = document.createElement('div');
  meter.className = 'burstLuckMeter';
  meter.innerHTML = '<i class="burstClover"><b></b><b></b><b></b><b></b></i><span>0%</span>';
  meter.setAttribute('aria-hidden', 'true');
  const pulse = document.createElement('div');
  pulse.className = 'burstLuckPulse';
  pulse.setAttribute('aria-hidden', 'true');
  scene.append(idleTools, pulse, meter);

  const debug = document.createElement('div');
  debug.className = 'burstLuckDebug';
  debug.innerHTML = `
    <label for="burstLuckInput">Debug Luck</label>
    <input id="burstLuckInput" type="range" min="0" max="100" value="0">
    <output for="burstLuckInput">0%</output>
    <button type="button">+10%</button>`;
  scene.before(debug);
  const luckInput = debug.querySelector('input');
  const luckAdd = debug.querySelector('button');
  const luckOutput = debug.querySelector('output');
  const meterText = meter.querySelector('span');
  const versions = [...previews.querySelectorAll('button')];
  let selectedActivity = versions.find(button => button.dataset.burstVersion === '7');
  let triggering = false;

  function selectActivity(button) {
    selectedActivity = button;
    scene.dataset.activity = button.dataset.burstVersion;
    versions.filter(item => activityTiming[item.dataset.burstVersion]).forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
  }
  selectActivity(selectedActivity);

  function setControls(disabled) {
    versions.forEach(item => { item.disabled = disabled; });
    luckInput.disabled = disabled;
    luckAdd.disabled = disabled;
  }

  function renderLuck() {
    const value = Number(luckInput.value);
    const label = value + '%';
    meterText.textContent = label;
    luckOutput.value = label;
    meter.style.setProperty('--luck-size', 1 + value / 100);
  }

  const particles = overlay.querySelector('.fishingLuckParticles');
  const colors = ['#fff3aa', '#ffc440', '#fffdf1', '#57e1c9'];
  for (let index = 0; index < 24; index++) {
    const particle = document.createElement('i');
    const jitter = (index * 53 % 17) / 17;
    const angle = index * Math.PI * 2 / 24 + (jitter - .5) * .35;
    const distance = 9 + (index * 7 % 17) + jitter * 5;
    particle.style.setProperty('--particle-x', Math.cos(angle) * distance + 'cqw');
    particle.style.setProperty('--particle-y', (Math.sin(angle) * distance * .68 - 7) + 'cqw');
    particle.style.setProperty('--particle-spin', (index % 2 ? -1 : 1) * (100 + index * 11) + 'deg');
    particle.style.setProperty('--particle-color', colors[index % colors.length]);
    particle.style.setProperty('--particle-scale', (.7 + jitter * .6).toFixed(2));
    particle.style.setProperty('--particle-delay', Math.round(jitter * 70) + 'ms');
    particle.classList.toggle('is-sparkle', index % 3 === 0);
    particles.append(particle);
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cues = {
    1: [[.43, 'glitchLand'], [.66, 'bonus']],
    2: [[.26, 'kickCharge'], [.38, 'glitchIgnite'], [.51, 'excellent'], [.66, 'catch']],
    3: [[.36, 'ballBounce'], [.51, 'good'], [.66, 'break'], [.74, 'bonus']],
    4: [[.22, 'glitchLand'], [.56, 'glitchOpen'], [.73, 'bonus']],
    5: [[.35, 'break'], [.62, 'glitchJump'], [.70, 'bonus']],
    6: [[.22, 'glitchLand'], [.41, 'glitchJump'], [.53, 'glitchJump'], [.65, 'break'], [.75, 'bonus']],
    7: [[.24, 'glitchLand'], [.39, 'glitchLand'], [.55, 'glitchJump'], [.60, 'glitchJump'], [.65, 'break'], [.74, 'bonus']],
    8: [[.24, 'ballBounce'], [.33, 'kickCharge'], [.40, 'kick'], [.55, 'glitchJump'], [.60, 'glitchJump'], [.65, 'break'], [.74, 'bonus']]
  };
  let playing = false;

  function play(button) {
    if (playing) return;
    const version = button.dataset.burstVersion;
    const { duration, openingDuration } = activityTiming[version] ?? defaultTiming;
    playing = true;
    setControls(true);
    scene.classList.add('burstActivityPlaying');
    overlay.dataset.version = version;
    button.classList.add('is-playing');
    announcement.textContent = 'Lucky Burst started.';
    overlay.hidden = false;
    overlay.classList.toggle('fishingLuckReduced', motion.matches);
    overlay.style.setProperty('--luck-duration', openingDuration + 'ms');
    overlay.style.setProperty('--luck-reveal-delay', ((openingDuration - defaultTiming.openingDuration) * .7) + 'ms');

    // The parent fade is the master clock, including when its tab is hidden.
    const clock = overlay.animate([
      { opacity: 1 }, { opacity: 1, offset: .96 }, { opacity: 0 }
    ], { duration, fill: 'both' });
    const audioTimers = cues[overlay.dataset.version].map(([at, cue]) => setTimeout(() => {
      if (tab.classList.contains('active')) window.RevivalAudio?.play(cue);
    }, openingDuration * at));
    clock.finished.finally(() => {
      audioTimers.forEach(timer => clearTimeout(timer));
      overlay.hidden = true;
      clock.cancel();
      setControls(false);
      scene.classList.remove('burstActivityPlaying', 'burstLuckCharged');
      if (activityTiming[version]) {
        luckInput.value = 0;
        renderLuck();
      }
      button.classList.remove('is-playing');
      playing = false;
      announcement.textContent = 'Lucky Burst: Kirin revealed.';
    });
  }

  previews.addEventListener('click', event => {
    const button = event.target.closest('button[data-burst-version]');
    if (!button || playing || triggering) return;
    if (activityTiming[button.dataset.burstVersion]) selectActivity(button);
    else play(button);
  });

  function updateLuck() {
    if (playing || triggering) return;
    renderLuck();
    if (Number(luckInput.value) !== 100) return;
    if (motion.matches) {
      play(selectedActivity);
      return;
    }
    triggering = true;
    setControls(true);
    announcement.textContent = 'Luck đã đạt 100%.';
    scene.classList.add('burstLuckCharged');
    const flight = meter.animate([
      { left: '7%', top: '83%', translate: '-50% -50%', scale: 1 },
      { left: '50%', top: '50%', translate: '-50% -50%', scale: 1.2, offset: .65 },
      { left: '50%', top: '50%', translate: '-50% -50%', scale: 1.55, opacity: 0 }
    ], { duration: 850, easing: 'ease-in-out', fill: 'both' });
    flight.finished.then(() => {
      triggering = false;
      play(selectedActivity);
      flight.cancel();
    });
  }
  luckInput.addEventListener('input', updateLuck);
  luckAdd.addEventListener('click', () => {
    luckInput.value = Math.min(100, Number(luckInput.value) + 10);
    updateLuck();
  });
})();
