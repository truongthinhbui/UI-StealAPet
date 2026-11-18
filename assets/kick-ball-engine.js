export const SHOT_COUNT=6;
export const GREEN_MIN=.42,GREEN_MAX=.62;
export function powerAt(seconds){return ((seconds%1.8)+1.8)%1.8/1.8;}
export function judgeShot(power){return power<GREEN_MIN?'low':power>GREEN_MAX?'high':'goal';}
export class KickRound{
 constructor(){this.reset();}
 reset(){this.shots=[];this.phase='ready';}
 shoot(cell,power){if(this.phase!=='ready'||this.shots.length>=SHOT_COUNT)return null;const result={cell,power,result:judgeShot(power)};this.shots.push(result);this.phase='flight';return result;}
 settle(){if(this.phase==='flight')this.phase=this.shots.length===SHOT_COUNT?'done':'ready';}
 get goals(){return this.shots.filter(s=>s.result==='goal').length;}
}
