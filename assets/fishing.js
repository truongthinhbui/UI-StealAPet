(function () {
  'use strict';
  const root = document.getElementById('tab-fishing');
  const scene = root.querySelector('.fishingScene');
  const viewport = root.querySelector('.fishingViewport');
  const rotateButton = root.querySelector('.fishingRotate');
  const fullscreenButton = root.querySelector('.fishingFullscreen');
  const hapticPatterns = {
    tap:{pattern:10,priority:0}, good:{pattern:22,priority:1},
    excellent:{pattern:[18,22,35],priority:2}, bonus:{pattern:[20,18,25,18,45],priority:3},
    break:{pattern:[30,24,55],priority:3}, miss:{pattern:[12,35,12],priority:1},
    catch:{pattern:[25,25,40,25,65],priority:4}
  };
  let hapticsEnabled = true, hapticUntil = 0, hapticPriority = -1;
  try { hapticsEnabled = localStorage.getItem('revival-haptics') !== 'off'; } catch {}
  const hapticToggle = document.createElement('button');
  hapticToggle.type = 'button';
  hapticToggle.className = 'fishingHaptics';
  const hapticTest = document.createElement('button');
  hapticTest.type = 'button'; hapticTest.textContent = 'Thử rung';
  const hapticStatus = document.createElement('span');
  hapticStatus.className = 'fishingHapticStatus';
  hapticStatus.setAttribute('role','status');
  const canVibrate = typeof navigator.vibrate === 'function';
  const updateHaptics = () => {
    hapticToggle.textContent = canVibrate ? 'Rung: ' + (hapticsEnabled ? 'Bật' : 'Tắt') : 'Rung: Không hỗ trợ';
    hapticToggle.setAttribute('aria-pressed',String(hapticsEnabled));
    hapticToggle.disabled = !canVibrate;
    hapticTest.disabled = !canVibrate || !hapticsEnabled;
    if (!canVibrate) hapticStatus.textContent = 'Trình duyệt không hỗ trợ rung';
  };
  function stopHaptic() {
    try { if (canVibrate) navigator.vibrate(0); } catch {}
    hapticUntil = 0; hapticPriority = -1;
  }
  hapticToggle.addEventListener('click',()=>{
    hapticsEnabled = !hapticsEnabled;
    try { localStorage.setItem('revival-haptics',hapticsEnabled ? 'on' : 'off'); } catch {}
    if (!hapticsEnabled) stopHaptic();
    hapticStatus.textContent = '';
    updateHaptics();
    if (hapticsEnabled) haptic('good');
  });
  hapticTest.addEventListener('click',()=>{
    stopHaptic();
    hapticStatus.textContent = haptic('bonus') ? 'Đã gửi nhịp rung thử' : 'Trình duyệt chưa cho phép rung';
  });
  root.querySelector('.fishingViewControls').append(hapticToggle,hapticTest,hapticStatus);
  updateHaptics();
  // A light tap must not interrupt a stronger hit, bonus, or catch pattern.
  function haptic(kind = 'tap') {
    if (!hapticsEnabled || document.hidden || !canVibrate || navigator.userActivation?.hasBeenActive === false) return false;
    const effect = hapticPatterns[kind] || hapticPatterns.tap;
    const now = performance.now();
    if (now < hapticUntil && effect.priority < hapticPriority) return false;
    try {
      const accepted = navigator.vibrate(effect.pattern);
      if (accepted) {
        hapticUntil = now + (Array.isArray(effect.pattern) ? effect.pattern.reduce((sum,n)=>sum+n,0) : effect.pattern);
        hapticPriority = effect.priority;
      }
      return accepted;
    } catch {
      return false;
    }
  }

  function setFullscreen(enabled) {
    viewport.toggleAttribute('data-immersive', enabled);
    document.documentElement.classList.toggle('fishingImmersive', enabled);
    fullscreenButton.setAttribute('aria-pressed', String(enabled));
    fullscreenButton.textContent = enabled ? 'Exit fullscreen' : 'Fullscreen';
  }

  rotateButton.addEventListener('click', () => {
    const rotated = viewport.toggleAttribute('data-rotated');
    rotateButton.setAttribute('aria-pressed', String(rotated));
    rotateButton.textContent = rotated ? 'Reset rotation' : 'Rotate';
  });

  fullscreenButton.addEventListener('click', async () => {
    if (viewport.hasAttribute('data-immersive')) {
      setFullscreen(false);
      if (document.fullscreenElement === viewport) await document.exitFullscreen();
      return;
    }
    setFullscreen(true);
    try {
      await viewport.requestFullscreen?.();
    } catch {
      // Use the fixed viewport when native fullscreen is unavailable.
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) setFullscreen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && viewport.hasAttribute('data-immersive') && !document.fullscreenElement) {
      setFullscreen(false);
      fullscreenButton.focus();
    }
  });

  for (const eventName of ['contextmenu', 'selectstart', 'dragstart']) {
    scene.addEventListener(eventName, event => event.preventDefault());
  }

  const button = root.querySelector('.fishingTap');
  const status = root.querySelector('.fishingFeedback');
  const title = root.querySelector('.fishingHud strong');
  const detail = root.querySelector('.fishingHud small');
  const rod = root.querySelector('.fishingHoldRod');
  let tapMotion;
  const holdFill = root.querySelector('.fishingHoldFill');
  const jointLayer = root.querySelector('.fishingHoldJoints');
  const jointCount = root.querySelector('#fishingJointCount');
  const jointThickness = root.querySelector('#fishingJointThickness');
  const debugControls = root.querySelector('.fishingDebug');
  let holdJoints = [];
  let stops = [];
  const debris = root.querySelector('.fishingHoldDebris');
  const circularCombo = root.querySelector('.circularCombo');
  const circularPrompt = root.querySelector('.circularPrompt');
  const circularHint = root.querySelector('.circularHint');
  let circularMotion;
  const circularDial = root.querySelector('.circularDial');
  const circularTarget = root.querySelector('.circularTarget');
  const circularEffects = new Set();
  const circularSpeed = () => .75 + Math.random() * .5;
  const qtePips = Array.from(root.querySelectorAll('.qtePips i'));
  const catchPercent = root.querySelector('.catchProgress strong');
  let qteLastCycle = -1;
  let qteMotion;
  const distanceEffects = new Set();
  const sharedEffects = new Set();
  function hitJuice(x, y, strong = false, parent = scene) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const burst = document.createElement('div');
    burst.className = 'gameJuice' + (strong ? ' gameJuice-gold' : '');
    burst.style.left = x + '%';
    burst.style.top = y + '%';
    parent.appendChild(burst);
    const motion = burst.animate([{opacity:1},{opacity:1,offset:.65},{opacity:0}],{duration:strong ? 650 : 420});
    sharedEffects.add(motion);
    const cleanup = () => { sharedEffects.delete(motion); burst.remove(); };
    motion.onfinish = cleanup;
    motion.oncancel = cleanup;
    const count = strong ? 12 : 6;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('i');
      spark.style.setProperty('--spark-angle', (i * 360 / count) + 'deg');
      burst.appendChild(spark);
    }
  }
  const distanceKnots = [0, 1].map(() => {
    const knot = document.createElement('i');
    knot.className = 'distanceKnot';
    knot.textContent = '✦';
    root.querySelector('.fishingTrack').appendChild(knot);
    return knot;
  });
  function spawnDistanceKnot(index) {
    const [min, max] = index === 0 ? [.23, .43] : [.66, .77];
    const old = game.knots[index]?.position;
    const unit = old === undefined ? Math.random() : ((old - min) / (max - min) + .4 + Math.random() * .2) % 1;
    const position = min + unit * (max - min);
    game.knots[index] = {position, respawnAt:0};
    distanceKnots[index].style.left = position * 100 + '%';
    distanceKnots[index].hidden = false;
  }
  function clearDistanceEffects() {
    distanceEffects.forEach(motion => motion.cancel());
    distanceEffects.clear();
    root.querySelectorAll('.distanceBurst,.distanceFloat,.distanceImpact').forEach(item => item.remove());
  }
  function distanceJuice(hit, perfect, meters) {
    clearDistanceEffects();
    scene.style.setProperty('--distance-color', hit ? perfect ? '#ffe49b' : '#a4f1be' : '#ffb1ae');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hud = root.querySelector('.fishingHud');
    const track = root.querySelector('.fishingTrack');
    const animate = (element, frames, options, temporary = false) => {
      const motion = element.animate(frames, options);
      distanceEffects.add(motion);
      const cleanup = () => { distanceEffects.delete(motion); if (temporary) element.remove(); };
      motion.onfinish = cleanup;
      motion.oncancel = cleanup;
    };
    animate(hud, hit ? [{scale:1},{scale:.98,offset:.12},{scale:perfect ? 1.06 : 1.035,offset:.35},{scale:1}]
      : [{translate:'0 0'},{translate:'-4px 0',offset:.2},{translate:'4px 0',offset:.4},{translate:'-2px 0',offset:.65},{translate:'0 0'}],{duration:280,easing:'ease-out'});
    animate(title,[{scale:1},{scale:1.2,offset:.25},{scale:1}],{duration:300,easing:'ease-out'});
    const label = document.createElement('b');
    label.className = 'distanceFloat';
    label.textContent = (meters > 0 ? '−' : '+') + Math.abs(meters) + ' m';
    label.style.left = (game.marker * 100) + '%';
    track.appendChild(label);
    animate(label,[{translate:'-50% 0',opacity:0,scale:.6},{translate:'-50% -24px',opacity:1,scale:1.25,offset:.18},{translate:'-50% -30px',opacity:1,scale:1,offset:.65},{translate:'-50% -55px',opacity:0,scale:1}],{duration:850,easing:'ease-out'},true);
    if (!hit) return;
    const marker = root.querySelector('.fishingMarker');
    animate(marker,[{scale:1},{scale:perfect ? 1.7 : 1.4,offset:.2},{scale:1}],{duration:350,easing:'ease-out'});
    for (let ring = 0; ring < (perfect ? 2 : 1); ring++) {
      const impact = document.createElement('i');
      impact.className = 'distanceImpact';
      impact.style.left = (game.marker * 100) + '%';
      track.appendChild(impact);
      animate(impact,[{scale:.3,opacity:1},{scale:perfect ? 3.5 : 2.5,opacity:0}],{duration:450,delay:ring*65,easing:'ease-out'},true);
    }
    animate(track,[{filter:'brightness(1)'},{filter:perfect ? 'brightness(1.8)' : 'brightness(1.4)',offset:.2},{filter:'brightness(1)'}],{duration:300});
    const count = perfect ? 14 : 8;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('i');
      spark.className = 'distanceBurst';
      spark.style.left = (game.marker * 100) + '%';
      spark.style.background = perfect ? '#ffe49b' : '#a4f1be';
      track.appendChild(spark);
      const angle = i / count * Math.PI * 2;
      const travel = track.clientWidth * (perfect ? .10 : .065);
      animate(spark,[{translate:'-50% -50%',opacity:1,scale:1},{translate:`calc(-50% + ${Math.cos(angle)*travel}px) calc(-50% + ${Math.sin(angle)*travel}px)`,opacity:0,scale:0}],{duration:perfect ? 480 : 360,easing:'ease-out'},true);
    }
  }

  function circularJuice(quality) {
    haptic(quality);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const excellent = quality === 'excellent';
    const animate = (element, frames, options, transient = false) => {
      const motion = element.animate(frames, options);
      circularEffects.add(motion);
      const cleanup = () => { circularEffects.delete(motion); if (transient) element.remove(); };
      motion.onfinish = cleanup;
      motion.oncancel = cleanup;
    };
    animate(circularTarget, [{scale:1},{scale:excellent ? 1.09 : 1.04,offset:.25},{scale:1}], {duration:240,easing:'cubic-bezier(.16,1,.3,1)'});
    animate(circularCombo, [{scale:1},{scale:excellent ? 1.32 : 1.18,offset:.25},{scale:1}], {duration:260,easing:'cubic-bezier(.16,1,.3,1)'});
    const count = excellent ? 16 : 8;
    for (let index = 0; index < count; index++) {
      const angle = index / count * Math.PI * 2;
      const spark = document.createElement('i');
      spark.className = 'circularSpark';
      // Keep the hit color after the next round clears its judgement state.
      spark.style.setProperty('--hit-color', excellent ? '#ffe69c' : '#adffcb');
      spark.style.left = (50 + Math.cos(angle) * 48) + '%';
      spark.style.top = (50 + Math.sin(angle) * 48) + '%';
      circularDial.appendChild(spark);
      const distance = circularDial.clientWidth * (excellent ? .35 : .22);
      animate(spark, [{transform:'translate(-50%,-50%) scale(1)',opacity:1},
        {transform:`translate(calc(-50% + ${Math.cos(angle) * distance}px),calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`,opacity:0}],
        {duration:excellent ? 420 : 320,easing:'cubic-bezier(.1,.65,.3,1)'}, true);
    }
  }

  function updateCircular() {
    const playing = state === 'active';
    circularCombo.textContent = state === 'idle' ? '0' : String(game.combo);
    circularPrompt.textContent = playing ? '' : state === 'idle' ? 'FISH ON' : scene.hasAttribute('data-caught') ? 'CAUGHT' : 'ESCAPED';
    circularHint.textContent = playing ? '' : state === 'idle' ? 'TAP TO START' : 'TRY AGAIN SOON';
  }

  function judgeCircular(quality) {
    if (state !== 'active' || game.roundPause > 0) return;
    const good = quality !== 'bad';
    game.combo = good ? game.combo + 1 : 0;
    if (!good) game.misses++;
    scene.dataset.judgement = quality;
    status.textContent = quality.toUpperCase();
    game.roundPause = .28;
    updateCircular();
    if (good) {
      circularJuice(quality);
      hitJuice(50, 44, quality === 'excellent');
    } else haptic('miss');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      circularMotion?.cancel();
      circularMotion = status.animate([{opacity:0,scale:.82,translate:'0 4px'},{opacity:1,scale:1.08,translate:'0 0',offset:.35},{opacity:1,scale:1,translate:'0 0'}],{duration:230,easing:'ease-out'});
    }
    if (game.combo >= 3) finish(true);
    else if (game.misses >= 4) finish(false);
  }

  function rodEdge(progress) {
    return [183 - 66 * progress, 81 + 168 * progress,
      188 - 42 * progress, 83 + 167 * progress];
  }

  const widthPresets = {
    mixed: [.032, .047, .037, .053, .041],
    thin: [.024],
    thick: [.075],
    alternating: [.024, .075],
    rising: [.024, .036, .050, .063, .075]
  };
  let jointWidths = widthPresets.mixed;
  const jointHalfWidth = index => jointWidths[index % jointWidths.length] / 2;
  const tapsPerJoint = 5;
  const decayDelay = .35;
  const decayRate = .13;
  let holdPress = false;

  function buildJoints() {
    const count = Number(jointCount.value);
    jointWidths = widthPresets[jointThickness.value];
    stops = count === 3 ? [.15, .40, .72] : Array.from({length:count}, (_, i) => (i + 1) / (count + 1));
    holdJoints = stops.map((progress, index) => {
      const joint = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const [left, top, right, bottom] = rodEdge(progress - jointHalfWidth(index));
      const [endLeft, endTop, endRight, endBottom] = rodEdge(progress + jointHalfWidth(index));
      joint.classList.add('fishingHoldJoint');
      joint.dataset.progress = progress;
      joint.setAttribute('d', 'M' + left + ' ' + top + 'L' + right + ' ' + bottom + 'L' + endRight + ' ' + endBottom + 'L' + endLeft + ' ' + endTop + 'Z');
      return joint;
    });
    jointLayer.replaceChildren(...holdJoints);
  }

  function drawHoldFill(progress) {
    const [left, top, right, bottom] = rodEdge(progress);
    holdFill.setAttribute('d', 'M183 81L188 83L' + right + ' ' + bottom + 'L' + left + ' ' + top + 'Z');
    holdJoints.forEach((joint, index) => {
      const threshold = Number(joint.dataset.progress);
      if (progress < threshold + jointHalfWidth(index) || joint.classList.contains('is-broken')) return;
      joint.classList.add('is-broken');
      haptic('break');
      const [hitX, hitY, hitRight] = rodEdge(threshold);
      hitJuice((hitX + hitRight) / 2 / 640 * 100 + 23.4, hitY / 360 * 100 - 2.5, true);
      if (!debris || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const [x, y, edge] = rodEdge(threshold);
      for (const direction of [-1, 1]) {
        const chip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const center = direction < 0 ? x : edge;
        chip.setAttribute('d', 'M' + center + ' ' + y + 'l5 2 -2 3 -5 -2Z');
        chip.setAttribute('fill', '#eee1c4');
        debris.appendChild(chip);
        chip.animate([
          {transform:'translate(0,0)', opacity:1},
          {transform:'translate(' + (direction * 15) + 'px,9px)', opacity:0}
        ], {duration:300,easing:'ease-out'}).onfinish = () => chip.remove();
      }
    });
  }
  const modes = Array.from(root.querySelectorAll('[data-fishing-mode]'));
  const instructions = [
    'Hold to the next joint, then tap to break it. Hold again after breaking a joint to keep the bar from draining.',
    'Hold to pull toward Catch. Release to cool the line.',
    'Use the TAP button when the purple rings overlap. Build a combo of 3 to catch the fish.',
    'Tap when the fish enters either green zone. Reel the distance down to 0 m before 40 seconds run out.',
    'Hold to lift the green zone. Release to lower it. Keep the fish inside.',
    'Hold to reel, then release before tension reaches its limit.',
    'Tap in the green arc three times to catch the fish.'
  ];
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  let mode = 0, state = 'idle', held = false, frame, timer, game;

  function finish(caught, reason) {
    haptic(caught ? 'catch' : reason === 'LINE BROKE' ? 'break' : 'miss');
    state = 'result';
    held = false;
    holdPress = false;
    cancelAnimationFrame(frame);
    delete scene.dataset.active;
    delete scene.dataset.ring;
    delete scene.dataset.holding;
    delete scene.dataset.tapping;
    delete scene.dataset.decaying;
    scene.toggleAttribute('data-caught', caught);
    if (caught && [0, 2, 4, 6].includes(mode)) hitJuice(50, 44, true);
    status.textContent = caught ? 'CAUGHT!' : reason || 'FISH ESCAPED';
    if (mode === 2) updateCircular();
    timer = setTimeout(reset, 1500);
  }

  function reset() {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    state = 'idle';
    delete scene.dataset.caught;
    stopHaptic();
    held = false;
    holdPress = false;
    status.textContent = '';
    delete scene.dataset.active;
    delete scene.dataset.ring;
    delete scene.dataset.timing;
    delete scene.dataset.holding;
    delete scene.dataset.judgement;
    circularMotion?.cancel();
    circularEffects.forEach(motion => motion.cancel());
    circularEffects.clear();
    qteMotion?.cancel();
    qteLastCycle = -1;
    delete scene.dataset.zoneInside;
    delete scene.dataset.qteHit;
    delete scene.dataset.distanceHit;
    delete scene.dataset.distanceBonus;
    root.querySelector('.fishingHud').dataset.bonusLabel = 'BONUS 0';
    distanceKnots.forEach(knot => knot.hidden = true);
    clearDistanceEffects();
    sharedEffects.forEach(motion => motion.cancel());
    sharedEffects.clear();
    root.querySelectorAll('.gameJuice').forEach(burst => burst.remove());
    qtePips.forEach(pip => pip.classList.remove('is-filled'));
    catchPercent.textContent = '0%';
    scene.style.setProperty('--catch-progress', '0%');
    root.querySelectorAll('.circularSpark').forEach(spark => spark.remove());
    tapMotion?.cancel();
    holdJoints.forEach(joint => joint.classList.remove('is-broken', 'is-target'));
    debris?.replaceChildren();
    drawHoldFill(0);
    scene.style.removeProperty('--hold-angle');
    button.setAttribute('aria-label', 'Tap to fish');
    updateCircular();
    scene.style.setProperty('--timing-scale', '1.65');
  }

  function startChallenge() {
    state = 'active';
    scene.dataset.active = '';
    if ([0, 2, 5, 6].includes(mode)) scene.dataset.ring = '';
    if (mode === 2 || mode === 6) scene.dataset.timing = '';
    status.textContent = 'FISH ON!';
    game = {age:0, last:performance.now(), phase:0, tapping:false, phaseTime:0, progress:0, idleTime:0,
      position:.42, tension:0, distance:mode === 3 ? 35 : 25, zone:.60, fish:.48, marker:0, hits:0, misses:0, combo:0,
      roundAge:0, roundPause:0, timingScale:1.65, roundSpeed:circularSpeed(), distancePhase:0, distanceFreezeUntil:0,
      qteArcStart:Math.random(), knots:[], bonusScore:0};
    if (mode === 3) [0, 1].forEach(spawnDistanceKnot);
    if (mode === 6) {
      scene.style.setProperty('--ring-start', game.qteArcStart * 360 + 'deg');
      scene.style.setProperty('--angle', '0deg');
    }
    if (mode === 2) { status.textContent = ''; scene.style.setProperty('--timing-scale', '1.65'); }
    button.setAttribute('aria-label', instructions[mode]);
    if (mode === 2) updateCircular();
    frame = requestAnimationFrame(tick);
  }

  function tap() {
    if (holdPress) {
      holdPress = false;
      return;
    }
    if (state === 'idle') {
      haptic('tap');
      startChallenge();
      return;
    }
    if (state !== 'active') return;
    if (mode === 3 && game.age < game.distanceFreezeUntil) return;
    if (mode === 2) {
      const error = Math.abs(game.timingScale - 1);
      judgeCircular(error <= .055 ? 'excellent' : error <= .15 ? 'good' : 'bad');
      return;
    }
    if (mode === 0 && game.tapping) {
      const stop = stops[game.phase];
      const halfWidth = jointHalfWidth(game.phase);
      const farEdge = stop + halfWidth;
      game.progress = Math.min(farEdge, game.progress + 2 * halfWidth / tapsPerJoint + 1e-10);
      game.idleTime = 0;
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        tapMotion?.cancel();
        tapMotion = rod.animate([
          {rotate:'0deg'},
          {rotate:'-4deg',offset:.24},
          {rotate:'1.5deg',offset:.62},
          {rotate:'0deg'}
        ], {duration:210,easing:'ease-out'});
      }
      if (game.progress === farEdge) {
        game.progress = stop + halfWidth;
        game.phase++;
        game.tapping = false;
      }
      game.phaseTime = 0;
      drawHoldFill(game.progress);
      return;
    }
    if (![2, 3, 6].includes(mode)) return;
    if (mode === 6) {
      const cycle = Math.floor(game.age / 2.25);
      if (cycle === qteLastCycle) return;
      qteLastCycle = cycle;
    }
    const [start, end] = mode === 3 ? (game.marker < .55 ? [.18,.48] : [.61,.82]) : [.16,.36];
    const arcOffset = mode === 6 ? (game.marker - game.qteArcStart + 1) % 1 : 0;
    const hit = mode === 6 ? arcOffset <= .20 : game.marker >= start && game.marker <= end;
    const perfect = hit && (mode === 6 ? Math.abs(arcOffset - .10) : Math.abs(game.marker - (start + end) / 2)) < .045;
    const distanceBefore = game.distance;
    if (hit) {
      game.combo++;
      game.hits += mode === 2 && perfect ? 2 : 1;
      game.distance = Math.max(0, game.distance - (mode === 3 ? perfect ? 7 : 5 : perfect ? 10 : 7));
    } else {
      game.combo = 0;
      game.misses++;
      game.hits = Math.max(0, game.hits - 1);
      game.distance = Math.min(mode === 3 ? 35 : 32, game.distance + (mode === 3 ? 3 : 4));
    }
    status.textContent = hit ? (mode === 6 ? 'HIT' : perfect ? 'PERFECT' : 'GOOD') : 'MISS';
    if (mode === 3) {
      let bonus = false;
      if (hit) game.knots.forEach((knot, index) => {
        if (!knot.respawnAt && Math.abs(game.marker - knot.position) <= .035) {
          bonus = true;
          game.bonusScore += 100;
          knot.respawnAt = game.age + .85;
          distanceKnots[index].hidden = true;
        }
      });
      scene.toggleAttribute('data-distance-bonus', bonus);
      root.querySelector('.fishingHud').dataset.bonusLabel = 'BONUS ' + game.bonusScore;
      scene.dataset.distanceHit = hit ? 'hit' : 'miss';
      scene.style.setProperty('--distance-left', Math.round(game.distance / 35 * 100) + '%');
      title.textContent = game.distance + ' m';
      game.distanceFeedbackUntil = game.age + .9;
      game.distanceFreezeUntil = game.age + (hit ? perfect ? .16 : .11 : .07);
      status.textContent = bonus ? 'KNOT BONUS +100' : hit ? (perfect ? 'PERFECT!' : 'GOOD!') : 'MISS!';
      distanceJuice(hit, perfect || bonus, distanceBefore - game.distance);
      if (bonus) hitJuice(game.marker * 100, 50, true, root.querySelector('.fishingTrack'));
      haptic(hit ? bonus ? 'bonus' : perfect ? 'excellent' : 'good' : 'miss');
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        qteMotion?.cancel();
        qteMotion = status.animate([{scale:.85,opacity:.4},{scale:1.08,opacity:1,offset:.35},{scale:1,opacity:1}],{duration:240,easing:'ease-out'});
      }
    }
    if (mode === 6) {
      scene.dataset.qteHit = hit ? 'hit' : 'miss';
      qtePips.forEach((pip, index) => pip.classList.toggle('is-filled', index < game.hits));
      haptic(hit ? perfect ? 'excellent' : 'good' : 'miss');
      if (hit) hitJuice(50, 44, perfect);
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        qteMotion?.cancel();
        qteMotion = root.querySelector('.qteCenter').animate([{scale:.94},{scale:1.05,offset:.3},{scale:1}],{duration:240,easing:'ease-out'});
      }
      if (hit && game.hits < 3) {
        game.qteArcStart = (game.qteArcStart + .25 + Math.random() * .5) % 1;
        scene.style.setProperty('--ring-start', game.qteArcStart * 360 + 'deg');
      }
    }
    if ((mode === 3 && game.distance === 0) || (mode !== 3 && game.hits >= (mode === 6 ? 3 : 5))) finish(true);
    else if (mode !== 3 && game.misses >= 4) finish(false);
  }

  function draw(label, hint, marker, zoneStart, zoneSize, ringFill = 0, ringStart = 0, color = '#57d594') {
    title.textContent = label;
    detail.textContent = hint;
    scene.style.setProperty('--marker', (clamp(marker) * 100) + '%');
    scene.style.setProperty('--zone-start', (zoneStart * 100) + '%');
    scene.style.setProperty('--zone-size', (zoneSize * 100) + '%');
    scene.style.setProperty('--ring-fill', (ringFill * 100) + '%');
    scene.style.setProperty('--ring-start', ringStart + 'deg');
    scene.style.setProperty('--ring-color', color);
    scene.style.setProperty('--angle', (game.marker * 360) + 'deg');
  }

  function tick(now) {
    if (state !== 'active') return;
    const dt = Math.min(.05, (now - game.last) / 1000);
    game.last = now;
    game.age += dt;
    game.phaseTime += dt;
    if (game.age >= (mode === 3 ? 40 : 22)) { finish(false, mode === 3 ? 'TIME UP' : undefined); return; }
    switch (mode) {
      case 0: {
        const stop = stops[game.phase];
        const limit = stop === undefined ? 1 : stop - jointHalfWidth(game.phase);
        if (!game.tapping && held) {
          game.progress = Math.min(limit, game.progress + dt * .29);
          if (game.progress >= limit) {
            if (stop === undefined) {
              drawHoldFill(1);
              finish(true);
              return;
            }
            game.tapping = true;
            haptic('good');
            game.phaseTime = 0;
          }
        }
        const pulling = !game.tapping && held;
        game.idleTime = pulling || game.tapping ? 0 : game.idleTime + dt;
        const decaying = !game.tapping && game.idleTime > decayDelay && game.progress > 0;
        if (decaying) game.progress = Math.max(0, game.progress - dt * decayRate);
        scene.toggleAttribute('data-decaying', decaying);
        scene.toggleAttribute('data-holding', pulling);
        scene.toggleAttribute('data-tapping', game.tapping);
        holdJoints.forEach((joint, index) => joint.classList.toggle('is-target', game.tapping && index === game.phase));
        drawHoldFill(game.progress);
        scene.style.setProperty('--hold-angle', (game.progress * 235) + 'deg');
        const tapsLeft = game.tapping
          ? Math.ceil((stop + jointHalfWidth(game.phase) - game.progress) / (2 * jointHalfWidth(game.phase)) * tapsPerJoint - 1e-8)
          : 0;
        const prompt = game.tapping ? 'TAP · ' + tapsLeft + ' LEFT' : 'HOLD';
        if (status.textContent !== prompt) status.textContent = prompt;
        if (game.phaseTime > 7) finish(false);
        break;
      }
      case 1:
        game.tension = clamp(game.tension + dt * (held ? .46 : -.80));
        game.position = clamp(game.position + dt * ((held ? .34 : -.22) - .10 * Math.sin(game.age * 5)));
        draw('ESCAPE → CATCH', 'Line tension ' + Math.round(game.tension * 100) + '%', game.position, .90, .10);
        if (game.position >= .90) finish(true);
        else if (game.tension >= 1 || game.position === 0) finish(false, game.tension >= 1 ? 'LINE BROKE' : 'FISH ESCAPED');
        break;
      case 2: {
        if (game.roundPause > 0) {
          game.roundPause = Math.max(0, game.roundPause - dt);
          if (game.roundPause === 0) {
            game.roundAge = 0;
            game.roundSpeed = circularSpeed();
            game.timingScale = 1.65;
            scene.style.setProperty('--timing-scale', game.timingScale);
            status.textContent = '';
            delete scene.dataset.judgement;
          }
        } else {
          game.roundAge += dt;
          game.timingScale = Math.max(.45, 1.65 - game.roundAge * game.roundSpeed);
          scene.style.setProperty('--timing-scale', game.timingScale);
          if (game.timingScale <= .65) judgeCircular('bad');
        }
        break;
      }
      case 6: {
        if (Math.floor(game.age / 2.25) !== qteLastCycle) delete scene.dataset.qteHit;
        game.marker = (game.age / 2.25) % 1;
        draw(game.hits + ' / 3 hits', 'Tap in the green arc', game.hits / 3, 0, 0, .20, game.qteArcStart * 360);
        break;
      }
      case 3:
        game.knots.forEach((knot, index) => {
          if (knot.respawnAt && game.age >= knot.respawnAt) spawnDistanceKnot(index);
        });
        if (game.distanceFeedbackUntil && game.age > game.distanceFeedbackUntil) {
          delete scene.dataset.distanceHit;
          delete scene.dataset.distanceBonus;
          status.textContent = '';
          game.distanceFeedbackUntil = 0;
        }
        if (game.age >= game.distanceFreezeUntil) game.distancePhase += dt * 2.3;
        game.marker = (1 - Math.cos(game.distancePhase)) / 2;
        scene.style.setProperty('--distance-left', Math.round(game.distance / 35 * 100) + '%');
        draw(Math.ceil(game.distance) + ' m', Math.ceil(40 - game.age) + ' s · TAP IN GREEN', game.marker, .18, .30);
        break;
      case 4: {
        game.zone = clamp(game.zone + dt * (held ? -.63 : .49), .15, .85);
        game.fish = .5 + .28 * Math.sin(game.age * 1.9) + .09 * Math.sin(game.age * 4.1);
        const inside = Math.abs(game.fish - game.zone) < .15;
        game.progress = clamp(game.progress + dt * (inside ? .28 : -.12));
        const milestone = Math.floor(game.progress * 4);
        if (inside && ((!game.zoneWasInside && game.age - (game.lastZoneJuice || -1) > .65) || milestone > (game.zoneMilestone || 0))) {
          hitJuice(50, 44, milestone > (game.zoneMilestone || 0));
          haptic('good');
          game.lastZoneJuice = game.age;
        }
        game.zoneWasInside = inside;
        game.zoneMilestone = Math.max(game.zoneMilestone || 0, milestone);
        scene.toggleAttribute('data-zone-inside', inside);
        scene.style.setProperty('--catch-progress', Math.round(game.progress * 100) + '%');
        catchPercent.textContent = Math.round(game.progress * 100) + '%';
        draw(Math.round(game.progress * 100) + '% caught', inside ? 'In zone' : 'Hold up · release down', game.fish, game.zone - .15, .30);
        if (game.progress >= 1) finish(true);
        break;
      }
      case 5:
        game.tension = clamp(game.tension + dt * (held ? .55 + .13 * Math.sin(game.age * 4) : -.70));
        game.distance = clamp(game.distance + dt * (held ? -10 : 3), 0, 32);
        draw(Math.ceil(game.distance) + ' m', game.tension > .74 ? 'RELEASE!' : 'Hold to reel', game.tension, 0, game.tension, game.tension, 0, game.tension > .74 ? '#ff6767' : game.tension > .48 ? '#ffd46d' : '#57d594');
        if (game.tension >= 1) finish(false, 'LINE BROKE');
        else if (game.distance === 0) finish(true);
        break;
    }
    if (state === 'active') frame = requestAnimationFrame(tick);
  }

  function select(index) {
    reset();
    mode = index;
    debugControls.hidden = index !== 0;
    scene.dataset.mode = String(index);
    if (index === 2) {
      scene.style.setProperty('--angle', '0deg');
      updateCircular();
    }
    root.querySelector('.fishingInstructions').textContent = instructions[index];
    modes.forEach(item => item.setAttribute('aria-pressed', String(Number(item.dataset.fishingMode) === index)));
  }

  modes.forEach(item => item.addEventListener('click', () => select(Number(item.dataset.fishingMode))));
  button.addEventListener('click', tap);
  button.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    if (state !== 'result') haptic();
    held = state === 'active';
    holdPress = held && mode === 0 && !game.tapping;
    button.setPointerCapture(event.pointerId);
  });
  ['pointerup','pointercancel','lostpointercapture','blur'].forEach(event => button.addEventListener(event, () => { held = false; }));
  button.addEventListener('keydown', event => {
    if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
      held = state === 'active';
      holdPress = held && mode === 0 && !game.tapping;
    }
    if (event.repeat && (event.key === ' ' || event.key === 'Enter')) event.preventDefault();
  });
  button.addEventListener('keyup', () => { held = false; });
  window.addEventListener('blur',()=>{held=false;holdPress=false;stopHaptic();});
  document.addEventListener('visibilitychange',()=>{
    held=false; holdPress=false; stopHaptic();
    if (state !== 'active') return;
    cancelAnimationFrame(frame);
    if (!document.hidden) { game.last=performance.now(); frame=requestAnimationFrame(tick); }
  });
  document.querySelectorAll('.prototypeTabs button').forEach(item => item.addEventListener('click', () => {
    if (item.dataset.tab !== 'tab-fishing') reset();
  }));
  [jointCount, jointThickness].forEach(control => {
    control.addEventListener('change', () => {
      reset();
      buildJoints();
    });
  });
  buildJoints();
  select(2);
})();
