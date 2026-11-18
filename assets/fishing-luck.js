(() => {
  'use strict';

  const tab = document.getElementById('tab-fishing');
  const scene = tab.querySelector('.fishingScene');
  const duration = 5000;
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
    <img class="fishingLuckRunner" src="assets/fishing-luck-kirin.png" alt="">
    <div class="fishingLuckGift">
      <img class="fishingLuckBase" src="assets/fishing-luck-base.png" alt="">
      <img class="fishingLuckLid" src="assets/fishing-luck-lid.png" alt="">
    </div>
    <div class="fishingLuckBurst"></div>
    <div class="fishingLuckReward">
      <img alt="">
      <svg viewBox="0 0 120 75"><path d="M28 37 7 15v45l21-19C53 72 95 63 117 38 93 11 53 7 28 37Z" fill="#ffcf60" stroke="#fff2b0" stroke-width="4" stroke-linejoin="round"/><circle cx="90" cy="33" r="5" fill="#754429"/></svg>
      <strong>APEX</strong>
      <span></span>
    </div>`;
  scene.append(overlay);

  const reward = overlay.querySelector('.fishingLuckReward');
  const rewardImage = reward.querySelector('img');
  const rewardIcon = reward.querySelector('svg');
  const demo = { name: 'GOLDFISH', rarity: 'APEX' };
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const goldfish = new Image();
  goldfish.src = 'assets/fishing-luck-goldfish.png';
  let playing = false;

  function play(pet) {
    if (playing) return;
    playing = true;
    preview.disabled = true;
    const name = pet.name.replaceAll('_', ' ');
    announcement.textContent = 'Luck Burst started.';
    reward.querySelector('span').textContent = name;
    const hasArtwork = pet.name === demo.name;
    rewardImage.hidden = !hasArtwork;
    rewardIcon.hidden = hasArtwork;
    if (hasArtwork) rewardImage.src = goldfish.src;
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
      announcement.textContent = 'Apex reveal: ' + name;
    });
  }

  preview.addEventListener('click', () => {
    if (!window.FishingRewards?.isCasting && !scene.hasAttribute('data-active')) play(demo);
  });
  tab.addEventListener('fishingcatch', event => {
    const pet = event.detail.catch;
    if (pet?.rarity === 'APEX') play(pet);
  });
})();
