# Lucky Kick third-person minigame

## Design brief
Play Kelly lining up six penalty shots. Aim at one of six goal cells, then stop a repeating low-to-high power marker inside its green zone. The player reads the meter, times the shot, sees its trajectory, and learns from low/high feedback. Accurate timing earns a goal. Every shot consumes one of six attempts; restart immediately from the results panel. Character movement and extra Luck shots are outside this six-shot minigame.

## Core loop contract
Select a cell with touch, mouse or keys 1–6/arrows, then press Shoot or Space while the moving marker is green. A green shot reaches the selected cell; low power travels low and wide, high power clears the crossbar. Each attempt updates the six-slot history and goals counter. Flight locks input; the sixth landing opens results and restart.

## Encounter plan
A fixed third-person camera behind the existing Kelly idle model faces an 8m × 3.6m goal with three columns and two rows. Six projected buttons correspond to six world-space target cells. The meter repeats every 1.8 seconds with a 42–62% success band; no time pressure before shooting. Six equal-difficulty attempts form one event. Mobile camera backs out to preserve the whole goal. Simulation pauses while the tab/page is hidden. Ball flight uses a deterministic interpolated arc rather than a physics engine; frame delta is capped at 50ms.

## Validation
`node tools/check-kick-ball.mjs` covers timing boundaries, low/high misses, all attempts counting, input locking, six-shot finish, score and reset. `node tools/check-web-entrypoints.cjs` checks all linked scripts and the existing config fingerprint.

## Drag aiming update
Drag the field with mouse or touch to move a reticle across the goal, with a highlight for its current cell. Aim is clamped inside the posts and captured when shooting. Score is 10 per landed goal; misses give zero. Power is captured on pointer-down from the last rendered meter position. Green shots cross the goal plane exactly at the reticle and settle inside the net, remaining visible for 650ms before the next ball. Low shots fall short; high shots clear the bar. Tests cover every goal cell and both green boundaries, drag extremes, frozen shot aim, scoring on arrival and duplicate-settle protection.

## Camera aiming correction
Dragging now rotates the actual third-person camera in yaw/pitch. The reticle stays fixed at screen center; its camera ray intersects the goal plane to determine the shot aim and highlighted cell. Clicking a numbered cell or using keyboard selection also points the camera at that cell. Resize preserves the selected world aim. Rotation limits retain aim inside the posts. Camera tests verify quaternion changes, moving world projection, centered aim, all six targets, and desktop/mobile limits.

## Original-game recording review and feedback update
Reviewed four frames at approximately 2.5s, 7.5s, 12.5s and 17.5s from `Recording 2026-11-16 100902.mp4` (21.5s, 1772×992). This is ordinary traversal footage, not a football minigame. Observable layout: close, low third-person view; avatar occupies the lower central area; center reticle; large circular action at right around x83%, y70%. The prototype now uses a 55-degree vertical FOV, closer camera at (0.2,1.9,6.8), landscape stage ratio based on the video, circular right action button, and separate lower-center power meter. Exact original FOV and kick UI cannot be established from the supplied footage.

Successful goal-plane crossing triggers score, GOAL/+10 announcement, expanding ring at impact and shared synthesized sound. Its target overlay and number disappear. Cleared targets reject further shots without consuming an attempt, with a muted reticle and instruction to aim elsewhere. Missed targets remain available. Exactly six attempts still end the event; replay restores all targets. Audio toggle uses the existing shared mute preference. Additional tests cover scoring exactly once at impact, duplicate target blocking, miss retry, perfect completion and reset.

## Supplied image mockup (v5)
Use `assets/kick-ball-mockup-reference.png`, copied from the user's supplied image, as the current visual reference. The tab includes an expandable reference image for side-by-side review. Its composition drives the 1266:710 stage ratio, larger 10.4m goal at z=-5, 45-degree vertical FOV and low close camera, blue coastal horizon, palms on both sides, glowing base ring, upper resource-style pills populated with actual attempts/score/cleared-target counts, and translucent right-hand circular kick action. Kelly remains the playable idle character. Goal geometry, target projection, aim ray limits and ball paths use the updated goal dimensions together, so green shots still enter the chosen cell. The gameplay remains six attempts, +10 per distinct completed target and disappearing targets. No unrelated navigation or fake economic values are added.
