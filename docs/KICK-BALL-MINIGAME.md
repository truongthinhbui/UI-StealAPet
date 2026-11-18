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
