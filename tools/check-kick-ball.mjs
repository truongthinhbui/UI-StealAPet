import assert from 'node:assert/strict';
import * as THREE from '../assets/vendor/three/three.module.js';
import {KickRound,judgeShot,powerAt,GREEN_MIN,GREEN_MAX,GOAL_Z,TARGET_RADIUS,BALL_RADIUS,targetAt,targetCenter} from '../assets/kick-ball-engine.js';
import {flightPoint} from '../assets/kick-ball-engine.js';
import {cameraAim,pointCamera,rotateAimCamera,resizeOrbit} from '../assets/kick-ball-camera.js';
assert.equal(judgeShot(GREEN_MIN),'goal');assert.equal(judgeShot(GREEN_MAX),'goal');assert.equal(judgeShot(GREEN_MIN-.001),'low');assert.equal(judgeShot(GREEN_MAX+.001),'high');assert.equal(powerAt(0),0);assert(Math.abs(powerAt(.9)-.5)<1e-10);assert(Math.abs(powerAt(1.8))<1e-10);
for(let id=0;id<6;id++)for(const power of [GREEN_MIN,.52,GREEN_MAX]){
 const round=new KickRound(),center=targetCenter(id),shot=round.shoot(id,power);assert.equal(targetAt(center.x,center.y),id);assert.equal(round.score,0);
 const cross=flightPoint(shot,.82);assert.equal(cross.z,GOAL_Z);assert(Math.abs(cross.x-center.x)<1e-9);assert(Math.abs(cross.y-center.y)<1e-9);assert.equal(shot.result,'goal');
 const end=flightPoint(shot,1);assert(end.z<GOAL_Z&&end.z>GOAL_Z-2);assert(round.impact());assert(!round.impact());assert.equal(round.score,10);round.settle();assert.equal(round.score,10);assert(round.cleared.has(id));assert.equal(round.shoot(id,.52),null);assert.equal(round.shots.length,1);
 const radius=TARGET_RADIUS-BALL_RADIUS;assert.equal(targetAt(center.x+radius,center.y),id);assert.equal(targetAt(center.x+radius+.001,center.y),-1);assert.equal(targetAt(center.x+radius*.8,center.y+radius*.8),-1,'Square corners outside circle must miss');
}
assert.equal(targetAt(NaN,0),-1);assert.equal(targetAt(100,0),-1);
const off=new KickRound();const c=targetCenter(0),shot=off.shoot(0,.52,{x:c.x+.6,y:c.y+.6});assert.equal(shot.result,'miss');off.settle();assert.equal(off.score,0);assert(off.canTarget(0));
for(const power of [.1,.9]){const round=new KickRound(),shot=round.shoot(0,power);const cross=flightPoint(shot,.82);assert(power<.42?cross.z>GOAL_Z:cross.y>3.8);round.settle();assert.equal(round.score,0);assert(round.canTarget(0));}
const game=new KickRound();for(let i=0;i<6;i++){assert(game.shoot(i,[.1,.5,.9][i%3]));assert.equal(game.shoot(i,.5),null);game.settle();}assert.equal(game.phase,'done');assert.equal(game.goals,2);assert.equal(game.shoot(0,.5),null);game.reset();assert.equal(game.phase,'ready');assert.equal(game.shots.length,0);assert.equal(game.cleared.size,0);
const perfect=new KickRound();for(let i=0;i<6;i++){perfect.shoot(i,.52);perfect.impact();perfect.settle();}assert.equal(perfect.cleared.size,6);assert.equal(perfect.score,60);assert.equal(perfect.phase,'done');
console.log('PASS six circular targets, edge clearance for ball radius, square-corner misses, goal trajectories, exact-once score, cleared target lock, six-shot finish and reset.');
for(const portrait of [false,true]){
 const camera=new THREE.PerspectiveCamera(45,portrait?.65:1266/710,.1,140);resizeOrbit(camera,portrait);
 for(let id=0;id<6;id++){const center=targetCenter(id),point=pointCamera(camera,center);assert(point);assert(Math.abs(point.x-center.x)<1e-8&&Math.abs(point.y-center.y)<1e-8);assert.equal(targetAt(point.x,point.y),id);const projected=new THREE.Vector3(center.x,center.y,GOAL_Z).project(camera);assert(Math.abs(projected.x)<1e-8&&Math.abs(projected.y)<1e-8);}
 pointCamera(camera,targetCenter(4));const start=camera.position.clone(),quaternion=camera.quaternion.clone();rotateAimCamera(camera,100,0);assert(camera.position.distanceTo(start)>.5,'Orbit must move camera position around Kelly');assert(!camera.quaternion.equals(quaternion));
 pointCamera(camera,targetCenter(4));const initial=camera.position.clone();rotateAimCamera(camera,Math.PI/.004,0);assert(camera.position.z<3,'Half orbit shows front of Kelly');assert.equal(cameraAim(camera),null,'Looking away cannot target goal');rotateAimCamera(camera,Math.PI/.004,0);assert(camera.position.distanceTo(initial)<1e-7,'Full 360 degree orbit');
 const pivot=new THREE.Vector3(-.15,1.45,3),distance=camera.position.distanceTo(pivot);for(let i=0;i<40;i++){rotateAimCamera(camera,74,0);assert(Math.abs(camera.position.distanceTo(pivot)-distance)<1e-8);}
 rotateAimCamera(camera,0,-100000);assert(camera.position.y>.1,'Lower pitch keeps camera above pitch');rotateAimCamera(camera,0,100000);assert(camera.position.y>pivot.y);assert(Number.isFinite(camera.quaternion.w));
 pointCamera(camera,targetCenter(2));resizeOrbit(camera,!portrait);const after=cameraAim(camera);assert(after&&targetAt(after.x,after.y)===2,'Resize retains orbit direction and aim');
}
console.log('PASS actual orbital position change, front/back views, 360° wrap, constant radius, pitch limits, centered ray for all six targets and resize preservation.');
