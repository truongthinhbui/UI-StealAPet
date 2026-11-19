/* Mini game · Throw Snowball
   Verb: giữ để lấy tầm → kéo để chỉnh hướng → thả để ném, đúng nhịp ném lựu đạn Free Fire.
   Trong khi giữ, nút ném hiện đường bay dự đoán và vòng sát thương ở điểm rơi; thả tay là ném.
   "Lăn" (underhand) là cú ném thấp và gần, dùng cho bia sát mặt — đối ứng với nút lob/roll của FF. */
(function () {
  'use strict';
  const root = document.getElementById('tab-snowball');
  if (!root) return;

  root.innerHTML = `
<header class="sbHeader">
  <div>
    <span>Mini game · Throw Snowball</span>
    <h2>NÉM TUYẾT NHƯ NÉM LỰU ĐẠN.</h2>
    <p>Giữ nút NÉM để nạp tầm xa, kéo ngang màn hình để chỉnh hướng, thả tay để ném. Đường bay và vòng rơi hiện ngay khi đang giữ — đúng cách ngắm lựu đạn trong Free Fire.</p>
  </div>
  <div class="sbScore"><strong>0</strong><span>ĐIỂM · LƯỢT NÀY</span></div>
</header>

<div class="sbStage" tabindex="0" aria-label="Sân ném tuyết">
  <canvas></canvas>
  <div class="sbHud">
    <span>❄ QUẢ <b class="sbBallCount">1</b> / <b class="sbBallTotal">5</b></span>
    <span class="sbWind" hidden>GIÓ <i class="sbWindArrow">→</i> <b class="sbWindValue">0</b></span>
    <span>◎ BIA CÒN <b class="sbTargetCount">4</b></span>
  </div>
  <div class="sbCallout" role="status" aria-live="polite"><strong></strong><span></span></div>
  <div class="sbPowerWrap">
    <div class="sbPowerLabels"><span>GẦN</span><span>TẦM NÉM</span><span>XA</span></div>
    <div class="sbPower" role="meter" aria-label="Tầm ném" aria-valuemin="0" aria-valuemax="100"><i></i><b></b></div>
  </div>
  <button type="button" class="sbRoll" aria-pressed="false">LĂN THẤP</button>
  <button type="button" class="sbThrow"><span>❄</span><b>NÉM</b><small>GIỮ</small></button>
  <p class="sbHint">Giữ nút NÉM để nạp tầm · Kéo trên sân để xoay hướng · Thả để ném</p>
</div>

<div class="sbResult">
  <div class="sbHistory" aria-label="Kết quả từng quả"></div>
  <p class="sbVerdict" role="status">Giữ nút NÉM để bắt đầu lượt.</p>
  <button type="button" class="sbRestart" style="background:#0a1e2e;color:#eaf6ff;border:1px solid #1b3f5c;border-radius:8px;padding:8px 14px;cursor:pointer">Lượt mới</button>
</div>

<details class="sbDebug">
  <summary>Debug · tùy chỉnh cơ chế</summary>
  <div class="sbDebugTools">
    <label>Tốc nạp tầm <select class="sbChargeSpeed"><option value=".6">Chậm</option><option value=".85" selected>Vừa</option><option value="1.15">Nhanh</option></select></label>
    <label>Bán kính nổ <select class="sbAoe"><option value="1.9">Hẹp 1.9m</option><option value="2.6" selected>Vừa 2.6m</option><option value="3.4">Rộng 3.4m</option></select></label>
    <label>Bia di chuyển <select class="sbTargetSpeed"><option value="0">Đứng yên</option><option value="1.2" selected>Vừa</option><option value="2.1">Nhanh</option></select></label>
    <label>Gió <select class="sbWindSetting"><option value="0" selected>Tắt</option><option value="0.18">Nhẹ</option><option value="0.34">Mạnh</option></select></label>
    <label>Số quả / lượt <select class="sbThrows"><option value="3">3</option><option value="5" selected>5</option><option value="8">8</option></select></label>
    <button type="button" class="sbRestart2">Chơi lại</button>
  </div>
  <output class="sbDebugReadout" aria-live="off"></output>
</details>

<details class="sbPlan" open>
  <summary>Bản thiết kế · Throw Snowball trên Craftland</summary>

  <h3>1 · Concept &amp; người chơi phục vụ</h3>
  <p>Một activity ném tuyết 60–90 giây trong hub: dùng đúng bộ cảm giác ném lựu đạn mà người chơi Free Fire đã thuộc lòng (giữ – ngắm – thả), nhưng mục tiêu là bia tuyết chứ không phải người. Verb quen nên không cần dạy; cái mới nằm ở việc đọc cự ly và gió.</p>
  <table>
    <tr><th>Nhóm</th><th>Giá trị nhận được</th></tr>
    <tr><td><b>Primary · New</b></td><td>Verb đã biết từ game chính, 3 quả đầu là bia gần đứng yên — gần như chắc trúng, có thưởng ngay.</td></tr>
    <tr><td><b>Secondary · Mid</b></td><td>Bia xa + bia di chuyển, săn điểm PERFECT để lên bậc thưởng.</td></tr>
    <tr><td><b>Not served</b></td><td>Người chơi muốn PvP đối kháng — bản này cố ý là bia tĩnh, không ném nhau.</td></tr>
  </table>

  <h3>2 · Core loop</h3>
  <table>
    <tr><th>Bước</th><th>Input</th><th>Phản hồi phải thấy</th></tr>
    <tr><td>Ngắm</td><td>Kéo ngang trên sân</td><td>Đường bay chấm + vòng rơi xoay theo, tức thì</td></tr>
    <tr><td>Nạp tầm</td><td>Giữ nút NÉM</td><td>Thanh tầm chạy lên–xuống, vòng rơi tiến/lùi theo</td></tr>
    <tr><td>Thả</td><td>Nhả tay</td><td>Tuyết bay theo đúng đường vừa xem — không có randomness ẩn</td></tr>
    <tr><td>Chạm đất</td><td>—</td><td>Bụp tuyết + vòng AoE + chữ PERFECT / GOOD / MISS</td></tr>
    <tr><td>Hết quả</td><td>—</td><td>Tổng điểm → bậc rương thưởng</td></tr>
  </table>
  <p><b>Hai kiểu ném</b> giống nút lob/roll của FF: <i>NÉM</i> (cầu vồng cao, qua vật cản, tầm 6–26m) và <i>LĂN THẤP</i> (đường thấp, tầm 4–12m, tới nhanh hơn). Bia gần mà dùng cú cao thì dễ quá tầm — đó là lựa chọn thật, không phải nút trang trí.</p>

  <h3>3 · Chấm điểm &amp; thưởng</h3>
  <table>
    <tr><th>Kết quả</th><th>Điều kiện</th><th>Điểm</th></tr>
    <tr><td>PERFECT</td><td>Rơi trong 0.8m tính từ tâm bia</td><td>3</td></tr>
    <tr><td>GOOD</td><td>Bia nằm trong bán kính nổ</td><td>1</td></tr>
    <tr><td>MISS</td><td>Ngoài bán kính nổ</td><td>0</td></tr>
  </table>
  <table>
    <tr><th>Tổng điểm (5 quả)</th><th>Rương</th></tr>
    <tr><td>12–15</td><td>MYTHIC</td></tr>
    <tr><td>8–11</td><td>LEGENDARY</td></tr>
    <tr><td>4–7</td><td>RARE</td></tr>
    <tr><td>0–3</td><td>COMMON (không bao giờ về tay không)</td></tr>
  </table>

  <h3>4 · Nhịp 8 phút (chống churn T4)</h3>
  <ul>
    <li><b>Phút 0–2:</b> chỉ một verb — bia gần, đứng yên, không gió. Không chữ hướng dẫn, đường bay tự dạy.</li>
    <li><b>Phút 3–5:</b> thêm bia di chuyển ngang và bia xa buộc đổi sang cú ném cao.</li>
    <li><b>Phút 6–8:</b> bật gió lệch — đường bay dự đoán <i>không</i> tính gió, người chơi phải tự bù hướng. Đây là lúc kỹ năng tách khỏi may mắn.</li>
  </ul>

  <h3>5 · Khả thi trên Craftland</h3>
  <table>
    <tr><th>Hạng mục</th><th>Cách làm</th><th>Rủi ro</th></tr>
    <tr><td>Asset</td><td>Không cần model mới: bia = object/decoration có sẵn xếp theo cụm; tuyết = projectile + particle.</td><td>Thấp</td></tr>
    <tr><td>Ngắm &amp; đường bay</td><td>Block-script tính parabol, vẽ bằng chuỗi marker nhỏ cập nhật mỗi frame khi đang giữ nút.</td><td>Trung bình — cần giới hạn số marker để không tụt FPS trên máy yếu</td></tr>
    <tr><td>Chấm điểm</td><td>Chạy <b>server-side</b>: điểm và rương thưởng là giá trị thật, client chỉ gửi điểm rơi.</td><td>Bắt buộc, nếu để client thì dupe ngay</td></tr>
    <tr><td>Lưu tiến độ</td><td>Player script giữ điểm cao và pity rương; Global script giữ mùa/sự kiện.</td><td>Cần save/load tường minh</td></tr>
    <tr><td>Phòng 6 người</td><td>Bia spawn riêng cho từng người (per-player), không tranh bia. Bảng điểm chung chỉ để so vui.</td><td>Tránh winner-take-all trong phòng lệch trình độ</td></tr>
  </table>

  <h3>6 · Chưa làm trong prototype này</h3>
  <ul>
    <li>Bảng điểm 6 người và phần so điểm trong phòng.</li>
    <li>Rương thưởng thật — hiện chỉ hiện bậc rương theo điểm.</li>
    <li>Vật cản che bia (lý do thật sự để chọn cú ném cao) — cần thêm layer che khuất.</li>
  </ul>
</details>`;

  const $ = selector => root.querySelector(selector);
  const canvas = $('canvas');
  const ctx = canvas.getContext('2d');
  const stage = $('.sbStage');
  const throwButton = $('.sbThrow');
  const rollButton = $('.sbRoll');
  const callout = $('.sbCallout');
  const powerFill = $('.sbPower i');
  const powerMark = $('.sbPower b');
  const readout = $('.sbDebugReadout');

  // Camera: đứng sau vai người ném, nhìn về +z. Chỉ cần pinhole đơn giản.
  const CAM = {height: 3.2, back: 3.5, focal: .7};
  const HAND = {x: 0, y: 1.45, z: .6};
  const settings = {chargeSpeed: .85, aoe: 2.6, targetSpeed: 1.2, wind: 0, throws: 5};

  let view = {w: 0, h: 0, cx: 0, cy: 0, f: 0};
  let state = 'ready';            // ready | charging | flying | done
  let game = null;
  let charge = 0, chargeDir = 1;  // tầm ném chạy lên xuống khi giữ nút
  let yaw = 0;                    // hướng ném, radian
  let shot = null;                // quả đang bay
  let puffs = [];
  let lastFrame = 0, raf = 0, drag = null, calloutUntil = 0;

  function resize() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    view.w = Math.max(1, Math.round(rect.width));
    view.h = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(view.w * dpr);
    canvas.height = Math.round(view.h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    view.cx = view.w / 2;
    view.cy = view.h * .42;
    view.f = view.w * CAM.focal;
  }

  function project(x, y, z) {
    const depth = z + CAM.back;
    if (depth <= .4) return null;
    const scale = view.f / depth;
    return {x: view.cx + x * scale, y: view.cy - (y - CAM.height) * scale, scale};
  }

  const throwRange = () => (game && game.roll ? {min: 4, max: 12, arc: .12} : {min: 6, max: 26, arc: .34});

  function landingOf(power, aim) {
    const range = throwRange();
    const distance = range.min + power * (range.max - range.min);
    return {x: Math.sin(aim) * distance, z: Math.cos(aim) * distance, distance};
  }

  // Một điểm trên đường bay, s đi từ 0 (tay) tới 1 (chạm đất).
  function arcPoint(land, s, windDrift) {
    const range = throwRange();
    const height = land.distance * range.arc;
    return {
      x: HAND.x + (land.x - HAND.x) * s + (windDrift || 0) * s * s,
      y: HAND.y * (1 - s) + 4 * height * s * (1 - s),
      z: HAND.z + (land.z - HAND.z) * s
    };
  }

  function spawnTargets(count) {
    const list = [];
    for (let i = 0; i < count; i++) {
      const near = i < 2;                       // hai bia đầu luôn gần: người mới trúng được ngay
      const distance = near ? 7 + Math.random() * 5 : 14 + Math.random() * 10;
      const spread = Math.atan2(5.5, distance);
      list.push({
        baseX: Math.sin((Math.random() - .5) * 2 * spread) * distance,
        z: distance,
        moving: !near && Math.random() < .6,
        phase: Math.random() * Math.PI * 2,
        swing: 1.6 + Math.random() * 1.8,
        hit: false
      });
    }
    return list;
  }

  function targetX(target, time) {
    return target.moving ? target.baseX + Math.sin(time * settings.targetSpeed * .9 + target.phase) * target.swing : target.baseX;
  }

  function startRound() {
    cancelAnimationFrame(raf);
    game = {
      ball: 0, score: 0, results: [], roll: false,
      targets: spawnTargets(4), time: 0,
      windDir: Math.random() < .5 ? -1 : 1
    };
    state = 'ready';
    charge = 0; chargeDir = 1; yaw = 0; shot = null; puffs = [];
    rollButton.setAttribute('aria-pressed', 'false');
    throwButton.disabled = false;
    callout.removeAttribute('data-show');
    $('.sbVerdict').textContent = 'Giữ nút NÉM để nạp tầm, thả để ném.';
    syncHud();
    lastFrame = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function syncHud() {
    $('.sbBallCount').textContent = Math.min(game.ball + 1, settings.throws);
    $('.sbBallTotal').textContent = settings.throws;
    $('.sbTargetCount').textContent = game.targets.filter(target => !target.hit).length;
    $('.sbScore strong').textContent = game.score;
    const windBox = $('.sbWind');
    windBox.hidden = settings.wind === 0;
    $('.sbWindArrow').textContent = game.windDir < 0 ? '←' : '→';
    $('.sbWindValue').textContent = settings.wind.toFixed(2);
    const history = $('.sbHistory');
    history.replaceChildren(...game.results.map(result => {
      const chip = document.createElement('span');
      chip.dataset.r = result;
      chip.textContent = result === 'perfect' ? '★' : result === 'good' ? '✓' : '×';
      return chip;
    }));
    updateReadout();
  }

  function updateReadout() {
    readout.textContent = `Trạng thái ${state} · tầm ${(charge * 100).toFixed(0)}% · hướng ${(yaw * 57.3).toFixed(0)}° · `
      + `${game.roll ? 'LĂN THẤP 4–12m' : 'NÉM CAO 6–26m'} · nổ ${settings.aoe}m · gió ${settings.wind}`;
  }

  function showCallout(kind, title, note) {
    callout.dataset.kind = kind;
    callout.dataset.show = '';
    callout.querySelector('strong').textContent = title;
    callout.querySelector('span').textContent = note || '';
    calloutUntil = performance.now() + 1100;
  }

  function release() {
    if (state !== 'charging') return;
    const land = landingOf(charge, yaw);
    const drift = settings.wind * land.distance * game.windDir;
    shot = {land, drift, age: 0, duration: .55 + land.distance * .045};
    state = 'flying';
    throwButton.removeAttribute('data-charging');
    throwButton.disabled = true;
    window.RevivalAudio?.play('kickCharge');
    updateReadout();
  }

  function resolveShot() {
    const landX = shot.land.x + shot.drift;
    const landZ = shot.land.z;
    let best = null;
    game.targets.forEach(target => {
      if (target.hit) return;
      const dx = targetX(target, game.time) - landX;
      const dz = target.z - landZ;
      const distance = Math.hypot(dx, dz);
      if (!best || distance < best.distance) best = {target, distance};
    });
    let result = 'miss';
    if (best && best.distance <= .8) result = 'perfect';
    else if (best && best.distance <= settings.aoe) result = 'good';

    for (let i = 0; i < (result === 'miss' ? 10 : 22); i++) {
      puffs.push({
        x: landX, z: landZ, y: .1,
        vx: (Math.random() - .5) * 4, vy: 1.5 + Math.random() * 3, vz: (Math.random() - .5) * 4,
        life: 0, span: .5 + Math.random() * .45
      });
    }

    if (result !== 'miss') {
      best.target.hit = true;
      game.score += result === 'perfect' ? 3 : 1;
      showCallout(result, result === 'perfect' ? 'PERFECT!' : 'GOOD', result === 'perfect' ? 'Trúng tâm bia · +3' : 'Dính vùng nổ · +1');
      window.RevivalAudio?.play(result === 'perfect' ? 'excellent' : 'good');
    } else {
      showCallout('miss', 'TRƯỢT', best ? `Lệch ${best.distance.toFixed(1)}m` : '');
      window.RevivalAudio?.play('miss');
    }

    game.results.push(result);
    game.ball++;
    if (game.targets.every(target => target.hit)) game.targets = spawnTargets(4);
    shot = null;
    charge = 0; chargeDir = 1;

    if (game.ball >= settings.throws) {
      state = 'done';
      throwButton.disabled = true;
      const crate = game.score >= 12 ? 'MYTHIC' : game.score >= 8 ? 'LEGENDARY' : game.score >= 4 ? 'RARE' : 'COMMON';
      $('.sbVerdict').innerHTML = `Hết lượt · <b>${game.score}</b> điểm → rương <b>${crate}</b>. Bấm "Lượt mới" để chơi tiếp.`;
      window.RevivalAudio?.play('catch');
    } else {
      state = 'ready';
      throwButton.disabled = false;
    }
    syncHud();
  }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(.05, (now - lastFrame) / 1000);
    lastFrame = now;
    if (!root.classList.contains('active')) return;
    game.time += dt;

    if (state === 'charging') {
      charge += chargeDir * settings.chargeSpeed * dt;
      if (charge >= 1) { charge = 1; chargeDir = -1; }
      if (charge <= 0) { charge = 0; chargeDir = 1; }
    }

    if (state === 'flying' && shot) {
      shot.age += dt;
      if (shot.age >= shot.duration) resolveShot();
    }

    puffs = puffs.filter(puff => {
      puff.life += dt;
      puff.x += puff.vx * dt; puff.z += puff.vz * dt;
      puff.y = Math.max(0, puff.y + puff.vy * dt);
      puff.vy -= 7 * dt;
      return puff.life < puff.span;
    });

    if (calloutUntil && now > calloutUntil) { callout.removeAttribute('data-show'); calloutUntil = 0; }
    draw();
  }

  function drawGround() {
    const sky = ctx.createLinearGradient(0, 0, 0, view.h);
    sky.addColorStop(0, '#0a2135');
    sky.addColorStop(.42, '#17415e');
    sky.addColorStop(.46, '#dceaf5');
    sky.addColorStop(1, '#f6fbff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, view.w, view.h);

    ctx.strokeStyle = '#b9d2e333';
    ctx.lineWidth = 1;
    for (let z = 5; z <= 30; z += 5) {
      const left = project(-14, 0, z), right = project(14, 0, z);
      if (!left || !right) continue;
      ctx.beginPath(); ctx.moveTo(left.x, left.y); ctx.lineTo(right.x, right.y); ctx.stroke();
      const tag = project(-13.6, 0, z);
      if (tag) { ctx.fillStyle = '#5c7f99aa'; ctx.font = '11px system-ui'; ctx.fillText(z + 'm', tag.x, tag.y - 3); }
    }
  }

  function drawTarget(target) {
    const x = targetX(target, game.time);
    const base = project(x, 0, target.z);
    const head = project(x, 1.75, target.z);
    if (!base || !head) return;
    const radius = Math.max(4, (base.y - head.y) * .22);
    ctx.globalAlpha = target.hit ? .22 : 1;
    ctx.fillStyle = '#20374a33';
    ctx.beginPath(); ctx.ellipse(base.x, base.y, radius * 1.5, radius * .5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#8fb4cf';
    ctx.lineWidth = 1.5;
    [[0, 1.35], [1, .95], [2, .62]].forEach(([index, scale]) => {
      const y = base.y - radius * (1.35 + index * 1.7);
      ctx.beginPath(); ctx.arc(base.x, y, radius * scale, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    const topY = base.y - radius * 4.75;
    ctx.fillStyle = target.hit ? '#5c7f99' : target.moving ? '#5fd0ff' : '#ff7a7a';
    ctx.fillRect(base.x - radius * .8, topY - radius * .9, radius * 1.6, radius * .8);
    if (target.moving && !target.hit) {
      ctx.fillStyle = '#5fd0ff';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('↔', base.x, topY - radius * 1.5);
      ctx.textAlign = 'left';
    }
    ctx.globalAlpha = 1;
  }

  function drawRing(x, z, radius, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 2;
    ctx.beginPath();
    let started = false;
    for (let a = 0; a <= Math.PI * 2 + .01; a += Math.PI / 24) {
      const point = project(x + Math.cos(a) * radius, .02, z + Math.sin(a) * radius);
      if (!point) { started = false; continue; }
      if (!started) { ctx.moveTo(point.x, point.y); started = true; } else ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }

  function drawPreview() {
    const land = landingOf(charge, yaw);
    // Đường bay dự đoán KHÔNG tính gió: gió là phần người chơi phải tự bù.
    ctx.fillStyle = '#eaf6ffcc';
    for (let s = .06; s < 1; s += .045) {
      const point = arcPoint(land, s, 0);
      const screen = project(point.x, point.y, point.z);
      if (!screen) continue;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, Math.max(1.2, 3.2 * screen.scale / 90), 0, Math.PI * 2);
      ctx.fill();
    }
    drawRing(land.x, land.z, settings.aoe, '#5fd0ffcc', 2);
    drawRing(land.x, land.z, .8, '#ffd75ecc', 2);
  }

  function drawShot() {
    const s = Math.min(1, shot.age / shot.duration);
    const point = arcPoint(shot.land, s, shot.drift);
    const screen = project(point.x, point.y, point.z);
    drawRing(shot.land.x + shot.drift, shot.land.z, settings.aoe, '#ffffff55', 1.5);
    if (!screen) return;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, Math.max(2.5, 9 * screen.scale / 90), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPuffs() {
    puffs.forEach(puff => {
      const screen = project(puff.x, puff.y, puff.z);
      if (!screen) return;
      ctx.globalAlpha = Math.max(0, 1 - puff.life / puff.span);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, Math.max(1.5, 7 * screen.scale / 90), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // Chỉ gợi vai người ném ở mép dưới, không che sân.
  function drawThrower() {
    const hand = project(HAND.x, HAND.y, HAND.z);
    if (!hand) return;
    const shoulder = ctx.createLinearGradient(0, view.h * .82, 0, view.h);
    shoulder.addColorStop(0, '#0d263900');
    shoulder.addColorStop(1, '#0d2639ee');
    ctx.fillStyle = shoulder;
    ctx.beginPath();
    ctx.ellipse(view.w * .5, view.h + 86, view.w * .22, view.h * .26, 0, 0, Math.PI * 2);
    ctx.fill();
    if (state !== 'flying') {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#8fb4cf';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(view.w * .5 + view.w * .14, view.h * .9, Math.max(6, view.w * .013), 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }
  }

  function draw() {
    drawGround();
    [...game.targets].sort((a, b) => b.z - a.z).forEach(drawTarget);
    if (state === 'charging' || state === 'ready') drawPreview();
    if (state === 'flying' && shot) drawShot();
    drawPuffs();
    drawThrower();

    powerFill.parentElement.style.setProperty('--sb-power', (charge * 100).toFixed(1) + '%');
    // Vạch trắng = tầm cần thiết để chạm bia gần nhất theo hướng đang ngắm.
    const range = throwRange();
    let needed = null;
    game.targets.forEach(target => {
      if (target.hit) return;
      const distance = Math.hypot(targetX(target, game.time), target.z);
      const required = (distance - range.min) / (range.max - range.min);
      if (required < 0 || required > 1) return;
      if (needed === null || Math.abs(required - charge) < Math.abs(needed - charge)) needed = required;
    });
    powerMark.style.left = ((needed === null ? 0 : needed) * 100).toFixed(1) + '%';
    powerMark.style.opacity = needed === null ? '0' : '1';
  }

  // ---- input ----
  function beginCharge(event) {
    if (state !== 'ready') return;
    event.preventDefault();
    state = 'charging';
    charge = 0; chargeDir = 1;
    throwButton.dataset.charging = '';
    throwButton.setPointerCapture?.(event.pointerId);
    updateReadout();
  }
  throwButton.addEventListener('pointerdown', beginCharge);
  throwButton.addEventListener('pointerup', release);
  throwButton.addEventListener('pointercancel', release);
  throwButton.addEventListener('lostpointercapture', release);

  stage.addEventListener('pointerdown', event => {
    if (event.target.closest('.sbThrow, .sbRoll')) return;
    drag = {id: event.pointerId, x: event.clientX};
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    yaw = Math.max(-.6, Math.min(.6, yaw + (event.clientX - drag.x) * .0022));
    drag.x = event.clientX;
    updateReadout();
  });
  const endDrag = event => { if (drag?.id === event.pointerId) drag = null; };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  stage.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { yaw = Math.max(-.6, yaw - .04); updateReadout(); }
    if (event.key === 'ArrowRight') { yaw = Math.min(.6, yaw + .04); updateReadout(); }
    if (event.key === ' ' && state === 'ready') { event.preventDefault(); state = 'charging'; charge = 0; chargeDir = 1; throwButton.dataset.charging = ''; }
  });
  stage.addEventListener('keyup', event => { if (event.key === ' ') release(); });

  rollButton.addEventListener('click', () => {
    if (state === 'charging' || state === 'flying') return;
    game.roll = !game.roll;
    rollButton.setAttribute('aria-pressed', String(game.roll));
    updateReadout();
  });

  root.addEventListener('click', event => {
    if (event.target.closest('.sbRestart, .sbRestart2')) startRound();
  });

  const bind = (selector, key, cast = Number) => $(selector).addEventListener('change', event => {
    settings[key] = cast(event.target.value);
    startRound();
  });
  bind('.sbChargeSpeed', 'chargeSpeed');
  bind('.sbAoe', 'aoe');
  bind('.sbTargetSpeed', 'targetSpeed');
  bind('.sbWindSetting', 'wind');
  bind('.sbThrows', 'throws');

  new ResizeObserver(resize).observe(stage);
  resize();
  startRound();
})();
