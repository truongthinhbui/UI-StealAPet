export const GREEN_MIN=.42,GREEN_MAX=.62;
export const GOAL_Z=-5;
export const GOAL_WIDTH=10.4,GOAL_HEIGHT=3.6;
export function powerAt(seconds){return ((seconds%1.8)+1.8)%1.8/1.8;}
export function judgeShot(power){return power<GREEN_MIN?'low':power>GREEN_MAX?'high':'goal';}
export const TARGET_RADIUS=.72,BALL_RADIUS=.2;
export function targetCenter(index,time=0,mode='static',speed=1){const x=(index%3-1)*GOAL_WIDTH/3;if(mode!=='moving')return {x,y:index<3?2.7:.9};const t=time*speed;return {x:x+.8*Math.sin(t*.85+index*.9),y:(index<3?2.55:1.05)+.3*Math.sin(t*1.45+(index%3)*1.3)};}
export function targetAt(x,y,time=0,mode='static',speed=1,ignored=[]){if(!Number.isFinite(x)||!Number.isFinite(y))return -1;for(let i=0;i<6;i++){if(ignored.includes(i))continue;const c=targetCenter(i,time,mode,speed);if(Math.hypot(x-c.x,y-c.y)<=TARGET_RADIUS-BALL_RADIUS+1e-9)return i;}return -1;}
export class KickRound{
 constructor(){this.reset();}
 reset(){this.shots=[];this.totalShots=0;this.totalGoals=0;this.wave=1;this.phase='ready';this.cleared=new Set();}
 canTarget(cell){return Number.isInteger(cell)&&cell>=0&&cell<6&&!this.cleared.has(cell);}
 impact(result,cell){const shot=this.shots.at(-1);if(this.phase!=='flight'||!shot||shot.settled)return false;if(result)shot.result=result;if(Number.isInteger(cell)&&cell>=0)shot.cell=cell;shot.settled=true;if(shot.result==='goal'&&this.canTarget(shot.cell)){this.cleared.add(shot.cell);this.totalGoals++;}return true;}
 shoot(cell,power,aim=targetCenter(cell)){
 if(this.phase!=='ready'||(cell!==-1&&!this.canTarget(cell))||!Number.isFinite(aim.x)||!Number.isFinite(aim.y)||Math.abs(aim.x)>GOAL_WIDTH/2||aim.y<0||aim.y>GOAL_HEIGHT)return null;
 const shot={cell,power,aim:{...aim},result:judgeShot(power),settled:false,ignoredTargets:[...this.cleared]};this.shots.push(shot);if(this.shots.length>60)this.shots.shift();this.totalShots++;this.phase='flight';return shot;
 }
 settle(){if(this.phase==='flight'){this.impact();if(this.cleared.size===6){this.cleared.clear();this.wave++;}this.phase='ready';}}
 get goals(){return this.totalGoals;}
 get score(){return this.totalGoals*10;}
}
