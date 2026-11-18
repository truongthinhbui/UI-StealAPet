(() => {
  'use strict';

  const tab = document.getElementById('tab-fishing');
  const scene = tab.querySelector('.fishingScene');
  const duration = 5000;
  const kirinSprite = 'assets/fishing-luck-kirin.png';
  const preview = document.createElement('button');
  preview.type = 'button';
  preview.className = 'fishingLuckPreview';
  preview.textContent = 'Preview Luck Burst';
  tab.querySelector('.fishingViewControls').append(preview);

  const announcement = document.createElement('span');
  announcement.className = 'fishingLuckAnnouncement';
  announcement.setAttribute('role', 'status');
  preview.after(announcement);

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
  let playing = false;

  function play() {
    if (playing) return;
    playing = true;
    preview.disabled = true;
    announcement.textContent = 'Luck Burst started.';
    const controls = [...scene.querySelectorAll('button:not([inert])')];
    controls.forEach(control => { control.inert = true; });
    overlay.hidden = false;
    overlay.classList.toggle('fishingLuckReduced', motion.matches);
    overlay.style.setProperty('--luck-duration', duration + 'ms');

    // The parent fade is the master clock, including when its tab is hidden.
    const clock = overlay.animate([
      { opacity: 1 }, { opacity: 1, offset: .94 }, { opacity: 0 }
    ], { duration, fill: 'both' });
    clock.finished.finally(() => {
      overlay.hidden = true;
      clock.cancel();
      controls.forEach(control => { control.inert = false; });
      preview.disabled = false;
      playing = false;
      announcement.textContent = 'Luck Burst: Kirin revealed.';
    });
  }

  preview.addEventListener('click', () => {
    if (!window.FishingRewards?.isCasting && !scene.hasAttribute('data-active')) play();
  });
  tab.addEventListener('fishingcatch', event => {
    const pet = event.detail.catch;
    if (pet?.rarity === 'APEX') play();
  });
})();
