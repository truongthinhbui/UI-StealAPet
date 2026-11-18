export const SHOT_COUNT=6;
export const GREEN_MIN=.42,GREEN_MAX=.62;
export const GOAL_Z=-5;
export const GOAL_WIDTH=10.4,GOAL_HEIGHT=3.6;
export function powerAt(seconds){return ((seconds%1.8)+1.8)%1.8/1.8;}
export function judgeShot(power){return power<GREEN_MIN?'low':power>GREEN_MAX?'high':'goal';}
export const TARGET_RADIUS=.72,BALL_RADIUS=.2;
export function targetCenter(index){return {x:(index%3-1)*GOAL_WIDTH/3,y:index<3?2.7:.9};}
export function targetAt(x,y){if(!Number.isFinite(x)||!Number.isFinite(y))return -1;for(let i=0;i<6;i++){const c=targetCenter(i);if(Math.hypot(x-c.x,y-c.y)<=TARGET_RADIUS-BALL_RADIUS+1e-9)return i;}return -1;}
export class KickRound{
 constructor(){this.reset();}
 reset(){this.shots=[];this.phase='ready';this.cleared=new Set();}
 canTarget(cell){return Number.isInteger(cell)&&cell>=0&&cell<6&&!this.cleared.has(cell);}
 impact(result){const shot=this.shots.at(-1);if(this.phase!=='flight'||!shot||shot.settled)return false;if(result)shot.result=result;shot.settled=true;if(shot.result==='goal')this.cleared.add(shot.cell);return true;}
 shoot(cell,power,aim={x:(cell%3-1)*GOAL_WIDTH/3,y:cell<3?2.7:.9}){if(this.phase!=='ready'||this.shots.length>=SHOT_COUNT||!this.canTarget(cell))return null;const result={cell,power,aim:{...aim},result:judgeShot(power)==='goal'?(targetAt(aim.x,aim.y)===cell?'goal':'miss'):judgeShot(power),settled:false};this.shots.push(result);this.phase='flight';return result;}
 settle(){if(this.phase==='flight'){this.impact();this.phase=this.shots.length===SHOT_COUNT?'done':'ready';}}
 get goals(){return this.shots.filter(s=>s.settled&&s.result==='goal').length;}
 get score(){return this.goals*10;}
}
