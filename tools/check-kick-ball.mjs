import assert from 'node:assert/strict';
import {KickRound,judgeShot,powerAt,GREEN_MIN,GREEN_MAX,GOAL_Z,GOAL_WIDTH} from '../assets/kick-ball-engine.js';
assert.equal(judgeShot(GREEN_MIN),'goal');assert.equal(judgeShot(GREEN_MAX),'goal');assert.equal(judgeShot(GREEN_MIN-.001),'low');assert.equal(judgeShot(GREEN_MAX+.001),'high');assert.equal(powerAt(0),0);assert(Math.abs(powerAt(.9)-.5)<1e-10);assert(Math.abs(powerAt(1.8))<1e-10);
const game=new KickRound();for(let i=0;i<6;i++){assert(game.shoot(i,[.1,.5,.9][i%3]));assert.equal(game.shoot(i,.5),null,'No duplicate input during ball flight');game.settle();}assert.equal(game.phase,'done');assert.equal(game.shots.length,6);assert.equal(game.goals,2);assert.equal(game.shoot(0,.5),null);game.reset();assert.equal(game.phase,'ready');assert.equal(game.shots.length,0);assert.equal(game.goals,0);console.log('PASS green boundaries, low/high misses, repeating low-to-high power, all attempts count, flight input guard, six-shot limit, score and restart.');
import {aimCell,flightPoint} from '../assets/kick-ball-engine.js';
for(let cell=0;cell<6;cell++)for(const power of [GREEN_MIN,.52,GREEN_MAX]){
 const round=new KickRound(),shot=round.shoot(cell,power);assert.equal(round.score,0,'No points before arrival');
 const cross=flightPoint(shot,.82);assert.equal(cross.z,GOAL_Z);assert(Math.abs(cross.x-shot.aim.x)<1e-9);assert(Math.abs(cross.y-shot.aim.y)<1e-9);assert.equal(aimCell(cross.x,cross.y),cell);
 const end=flightPoint(shot,1);assert(end.z<GOAL_Z&&end.z>GOAL_Z-2);assert(end.x> -GOAL_WIDTH/2&&end.x<GOAL_WIDTH/2);assert(end.y>=.2&&end.y<3.4);round.settle();assert.equal(round.score,10);round.settle();assert.equal(round.score,10,'Settle cannot duplicate score');
}
for(const x of [-3.65,0,3.65])for(const y of [.35,.9,2.7,3.25]){const round=new KickRound();const point={x,y};const shot=round.shoot(aimCell(x,y),.52,point);point.x=999;const cross=flightPoint(shot,.82);assert.equal(cross.x,x,'Aim captured at shot');assert(Math.abs(cross.y-y)<1e-9);}
for(const power of [.1,.9]){const round=new KickRound(),shot=round.shoot(0,power);const cross=flightPoint(shot,.82);assert(power<.42?cross.z>GOAL_Z:cross.y>3.8);round.settle();assert.equal(round.score,0);}
console.log('PASS all six cells and green edges cross the selected target; green balls stay inside net; drag aim snapshot; points only on settled hits, no duplicate points; low/high miss trajectories.');
import * as THREE from '../assets/vendor/three/three.module.js';
import {cameraAim,pointCamera,rotateAimCamera} from '../assets/kick-ball-camera.js';
for(const [z,y] of [[6.8,1.7],[8.2,1.9]]){
 const camera=new THREE.PerspectiveCamera(45,1266/710,.1,140);camera.position.set(.45,y,z);
 pointCamera(camera,{x:0,y:.9});const before=camera.quaternion.clone();const scenePoint=new THREE.Vector3(-GOAL_WIDTH/2,3.6,GOAL_Z).project(camera);
 let aim=rotateAimCamera(camera,80,-40);assert(aim.x>0&&aim.y>.9);assert(!camera.quaternion.equals(before),'Dragging must rotate actual camera');
 const afterPoint=new THREE.Vector3(-GOAL_WIDTH/2,3.6,GOAL_Z).project(camera);assert(scenePoint.distanceTo(afterPoint)>.01,'World must move on screen');
 const center=new THREE.Vector3(aim.x,aim.y,GOAL_Z).project(camera);assert(Math.abs(center.x)<1e-8&&Math.abs(center.y)<1e-8,'Aim stays screen-centered');
 for(const cell of [0,1,2,3,4,5]){pointCamera(camera,{x:(cell%3-1)*GOAL_WIDTH/3,y:cell<3?2.7:.9});const p=cameraAim(camera);assert.equal(aimCell(p.x,p.y),cell);}
 for(const d of [-100000,100000]){aim=rotateAimCamera(camera,d,d);assert(aim.x>=-GOAL_WIDTH/2+.349999&&aim.x<=GOAL_WIDTH/2-.349999);assert(aim.y>=.349999&&aim.y<=3.250001);}
}
console.log('PASS real camera rotation, moving world projection, fixed center reticle, all six camera targets and rotation limits on desktop/mobile.');
const clears=new KickRound();assert(clears.shoot(2,.52));assert.equal(clears.impact(),true);assert(clears.cleared.has(2));assert.equal(clears.score,10);assert.equal(clears.impact(),false);assert.equal(clears.score,10);clears.settle();assert.equal(clears.shoot(2,.52),null,'Cleared cell rejects shots without using an attempt');assert.equal(clears.shots.length,1);assert(clears.shoot(1,.1));clears.settle();assert(clears.canTarget(1),'Miss leaves target available');for(const cell of [0,1,3,4]){assert(clears.shoot(cell,.52));clears.impact();clears.settle();}assert.equal(clears.phase,'done');assert.equal(clears.shots.length,6);assert.equal(clears.score,50);clears.reset();assert.equal(clears.cleared.size,0);assert(clears.canTarget(2));
const perfect=new KickRound();for(let i=0;i<6;i++){perfect.shoot(i,.52);perfect.impact();perfect.settle();}assert.equal(perfect.cleared.size,6);assert.equal(perfect.score,60);assert.equal(perfect.phase,'done');
console.log('PASS impact-time score and single feedback signal, cleared-cell lock without spending attempt, missed cell reusable, six-shot finish, 6/6 perfect run and reset restores targets.');
