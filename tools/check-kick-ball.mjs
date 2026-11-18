import assert from 'node:assert/strict';
import {KickRound,judgeShot,powerAt,GREEN_MIN,GREEN_MAX} from '../assets/kick-ball-engine.js';
assert.equal(judgeShot(GREEN_MIN),'goal');assert.equal(judgeShot(GREEN_MAX),'goal');assert.equal(judgeShot(GREEN_MIN-.001),'low');assert.equal(judgeShot(GREEN_MAX+.001),'high');assert.equal(powerAt(0),0);assert(Math.abs(powerAt(.9)-.5)<1e-10);assert(Math.abs(powerAt(1.8))<1e-10);
const game=new KickRound();for(let i=0;i<6;i++){assert(game.shoot(i,[.1,.5,.9][i%3]));assert.equal(game.shoot(i,.5),null,'No duplicate input during ball flight');game.settle();}assert.equal(game.phase,'done');assert.equal(game.shots.length,6);assert.equal(game.goals,2);assert.equal(game.shoot(0,.5),null);game.reset();assert.equal(game.phase,'ready');assert.equal(game.shots.length,0);assert.equal(game.goals,0);console.log('PASS green boundaries, low/high misses, repeating low-to-high power, all attempts count, flight input guard, six-shot limit, score and restart.');
import {aimCell,flightPoint} from '../assets/kick-ball-engine.js';
for(let cell=0;cell<6;cell++)for(const power of [GREEN_MIN,.52,GREEN_MAX]){
 const round=new KickRound(),shot=round.shoot(cell,power);assert.equal(round.score,0,'No points before arrival');
 const cross=flightPoint(shot,.82);assert.equal(cross.z,-10);assert(Math.abs(cross.x-shot.aim.x)<1e-9);assert(Math.abs(cross.y-shot.aim.y)<1e-9);assert.equal(aimCell(cross.x,cross.y),cell);
 const end=flightPoint(shot,1);assert(end.z<-10&&end.z>-12);assert(end.x> -3.8&&end.x<3.8);assert(end.y>=.2&&end.y<3.4);round.settle();assert.equal(round.score,10);round.settle();assert.equal(round.score,10,'Settle cannot duplicate score');
}
for(const x of [-3.65,0,3.65])for(const y of [.35,.9,2.7,3.25]){const round=new KickRound();const point={x,y};const shot=round.shoot(aimCell(x,y),.52,point);point.x=999;const cross=flightPoint(shot,.82);assert.equal(cross.x,x,'Aim captured at shot');assert(Math.abs(cross.y-y)<1e-9);}
for(const power of [.1,.9]){const round=new KickRound(),shot=round.shoot(0,power);const cross=flightPoint(shot,.82);assert(power<.42?cross.z>-10:cross.y>3.8);round.settle();assert.equal(round.score,0);}
console.log('PASS all six cells and green edges cross the selected target; green balls stay inside net; drag aim snapshot; points only on settled hits, no duplicate points; low/high miss trajectories.');
