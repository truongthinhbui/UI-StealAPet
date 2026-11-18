export const SHOT_COUNT=6;
export const GREEN_MIN=.42,GREEN_MAX=.62;
export const GOAL_Z=-10;
export function powerAt(seconds){return ((seconds%1.8)+1.8)%1.8/1.8;}
export function judgeShot(power){return power<GREEN_MIN?'low':power>GREEN_MAX?'high':'goal';}
export function aimCell(x,y){return (y>=1.8?0:3)+Math.max(0,Math.min(2,Math.floor((x+4)/(8/3))));}
export function flightPoint(shot,t){
 const hit=shot.result==='goal',cross=.82;
 const end={x:shot.aim.x,y:shot.result==='high'?5.2:shot.result==='low'?.2:shot.aim.y,z:shot.result==='low'?-6.5:GOAL_Z};
 const u=Math.min(1,t/cross),arc=shot.result==='high'?1.4:shot.result==='low'?.1:.65;
 const p={x:.33+(end.x-.33)*u,y:.2+(end.y-.2)*u+Math.sin(Math.PI*u)*arc,z:2.5+(end.z-2.5)*u};
 if(t>cross){const v=(t-cross)/(1-cross);p.z=end.z-(hit?1.25:2)*v;p.y=hit?Math.max(.2,end.y-.3*v):end.y;}
 return p;
}
export class KickRound{
 constructor(){this.reset();}
 reset(){this.shots=[];this.phase='ready';}
 shoot(cell,power,aim={x:(cell%3-1)*8/3,y:cell<3?2.7:.9}){if(this.phase!=='ready'||this.shots.length>=SHOT_COUNT)return null;const result={cell,power,aim:{...aim},result:judgeShot(power),settled:false};this.shots.push(result);this.phase='flight';return result;}
 settle(){if(this.phase==='flight'){this.shots.at(-1).settled=true;this.phase=this.shots.length===SHOT_COUNT?'done':'ready';}}
 get goals(){return this.shots.filter(s=>s.settled&&s.result==='goal').length;}
 get score(){return this.goals*10;}
}
