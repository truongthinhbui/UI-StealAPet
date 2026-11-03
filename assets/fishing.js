(function () {
  'use strict';
  const root = document.getElementById('tab-fishing');
  const scene = root.querySelector('.fishingScene');
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
    'Tap in the green arc. Aim for its center to score Perfect and build a combo.',
    'Tap in the green window to reduce the distance to 0 m.',
    'Hold to lift the green zone. Release to lower it. Keep the fish inside.',
    'Hold to reel, then release before tension reaches its limit.',
    'Tap in the green arc three times to catch the fish.'
  ];
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  let mode = 0, state = 'idle', held = false, frame, timer, game;

  function finish(caught, reason) {
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
    status.textContent = caught ? 'CAUGHT!' : reason || 'FISH ESCAPED';
    timer = setTimeout(reset, 1500);
  }

  function reset() {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    state = 'idle';
    delete scene.dataset.caught;
    held = false;
    holdPress = false;
    status.textContent = '';
    delete scene.dataset.active;
    delete scene.dataset.ring;
    delete scene.dataset.timing;
    delete scene.dataset.holding;
    tapMotion?.cancel();
    holdJoints.forEach(joint => joint.classList.remove('is-broken', 'is-target'));
    debris?.replaceChildren();
    drawHoldFill(0);
    scene.style.removeProperty('--hold-angle');
    button.setAttribute('aria-label', 'Tap to fish');
  }

  function startChallenge() {
    state = 'active';
    scene.dataset.active = '';
    if ([0, 2, 5, 6].includes(mode)) scene.dataset.ring = '';
    if (mode === 2 || mode === 6) scene.dataset.timing = '';
    status.textContent = 'FISH ON!';
    game = {age:0, last:performance.now(), phase:0, tapping:false, phaseTime:0, progress:0, idleTime:0,
      position:.42, tension:0, distance:25, zone:.60, fish:.48, marker:0, hits:0, misses:0, combo:0};
    button.setAttribute('aria-label', instructions[mode]);
    frame = requestAnimationFrame(tick);
  }

  function tap() {
    if (holdPress) {
      holdPress = false;
      return;
    }
    if (state === 'idle') {
      startChallenge();
      return;
    }
    if (state !== 'active') return;
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
    const [start, end] = mode === 3 ? [.39,.65] : [.16,.36];
    const hit = game.marker >= start && game.marker <= end;
    const perfect = hit && Math.abs(game.marker - (start + end) / 2) < .045;
    if (hit) {
      game.combo++;
      game.hits += mode === 2 && perfect ? 2 : 1;
      game.distance = Math.max(0, game.distance - (perfect ? 10 : 7));
    } else {
      game.combo = 0;
      game.misses++;
      game.hits = Math.max(0, game.hits - 1);
      game.distance = Math.min(32, game.distance + 4);
    }
    status.textContent = hit ? (mode === 6 ? 'HIT' : perfect ? 'PERFECT' : 'GOOD') : 'MISS';
    if ((mode === 3 && game.distance === 0) || (mode !== 3 && game.hits >= (mode === 6 ? 3 : 5))) finish(true);
    else if (game.misses >= 4) finish(false);
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
    scene.style.setProperty('--angle', (game.marker * 359) + 'deg');
  }

  function tick(now) {
    if (state !== 'active') return;
    const dt = Math.min(.05, (now - game.last) / 1000);
    game.last = now;
    game.age += dt;
    game.phaseTime += dt;
    if (game.age >= 22) { finish(false); return; }
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
      case 2:
      case 6:
        game.marker = (game.age / (mode === 6 ? 2.25 : 1.7)) % 1;
        draw(game.hits + ' / ' + (mode === 6 ? 3 : 5) + ' hits', mode === 2 ? 'Combo ×' + game.combo : 'Tap in the green arc', game.hits / (mode === 6 ? 3 : 5), 0, 0, .20, 57.6);
        break;
      case 3:
        game.marker = (1 - Math.cos(game.age * 3.2)) / 2;
        draw(Math.ceil(game.distance) + ' m', 'Tap in green to reel in', game.marker, .39, .26);
        break;
      case 4: {
        game.zone = clamp(game.zone + dt * (held ? -.63 : .49), .15, .85);
        game.fish = .5 + .28 * Math.sin(game.age * 1.9) + .09 * Math.sin(game.age * 4.1);
        const inside = Math.abs(game.fish - game.zone) < .15;
        game.progress = clamp(game.progress + dt * (inside ? .28 : -.12));
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
    root.querySelector('.fishingInstructions').textContent = instructions[index];
    modes.forEach((item, i) => item.setAttribute('aria-pressed', String(i === index)));
  }

  modes.forEach((item, index) => item.addEventListener('click', () => select(index)));
  button.addEventListener('click', tap);
  button.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
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
  select(0);
})();
