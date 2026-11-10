export const ROPE_RULES=Object.freeze({duration:90,hearts:3,minRPM:24,maxRPM:42,gemCap:15,comboStep:10,comboGems:3,syncPlayers:4,syncGems:1,immunity:3,jumpDuration:.8833333,clearStart:.07,clearEnd:.43,autoLead:.23});
const TAU=Math.PI*2;
export class RopeEngine {
  constructor({random=Math.random,auto=true,rpm=30}={}){this.random=random;this.auto=auto;this.setRPM(rpm);this.reset();}
  setRPM(rpm){if(!Number.isFinite(rpm))throw Error('Invalid rope speed');this.rpm=Math.max(24,Math.min(42,rpm));}
  reset(){this.time=0;this.angle=-1.4;this.hearts=3;this.combo=0;this.bestCombo=0;this.gems=0;this.comboGems=0;this.syncGems=0;this.immuneUntil=0;this.jumpAt=-Infinity;this.status='playing';this.plans=new Map();this.rounds=new Map();this.lastOutcomes=Array(6).fill(null);this.events=[];}
  get airborne(){return this.time-this.jumpAt<ROPE_RULES.jumpDuration;}
  jump(at=this.time){if(this.status!=='playing'||at-this.jumpAt<ROPE_RULES.jumpDuration-1e-7)return false;this.jumpAt=at;this.events.push({type:'jump',at});return true;}
  plan(round,index){const key=round+':'+index;if(!this.plans.has(round+':1'))for(let i=1;i<6;i++)this.plans.set(round+':'+i,this.random()<.88);return this.plans.get(key);}
  grant(amount,source){const paid=Math.min(amount,ROPE_RULES.gemCap-this.gems);this.gems+=paid;this[source]+=paid;return paid;}
  update(dt){
    this.events=[];if(!Number.isFinite(dt))throw Error('Invalid elapsed time');
    if(this.status!=='playing'||dt<=0)return this.events;
    if(dt>.05){const events=[];while(dt>1e-9&&this.status==='playing'){const step=Math.min(dt,.05);events.push(...this.update(step));dt-=step;}this.events=events;return events;}
    dt=Math.min(dt,ROPE_RULES.duration-this.time);
    const oldTime=this.time,oldAngle=this.angle,speed=this.rpm*TAU/60,newAngle=oldAngle+speed*dt;
    if(this.auto){const turn=Math.max(0,Math.floor(oldAngle/TAU)+1),at=oldTime+(turn*TAU-oldAngle)/speed-ROPE_RULES.autoLead;if(at<=oldTime+dt&&at>=oldTime-1e-8)this.jump(Math.max(oldTime,at));}
    const crossings=[];
    for(let player=0;player<6;player++){
      const phase=player*TAU/6,first=Math.max(0,Math.floor((oldAngle-phase)/TAU)+1);
      for(let round=first;round*TAU+phase<=newAngle+1e-10;round++)crossings.push({round,player,at:oldTime+(round*TAU+phase-oldAngle)/speed});
    }
    crossings.sort((a,b)=>a.at-b.at);
    for(const {round,player,at} of crossings){
      if(this.status!=='playing')break;
      const age=at-this.jumpAt,success=player===0?age>=ROPE_RULES.clearStart&&age<=ROPE_RULES.clearEnd:this.plan(round,player);
      this.lastOutcomes[player]={success,at};let results=this.rounds.get(round);if(!results){results=Array(6).fill(null);this.rounds.set(round,results);}results[player]=success;
      if(player===0){if(success){this.combo++;this.bestCombo=Math.max(this.bestCombo,this.combo);const paid=this.combo%10===0?this.grant(3,'comboGems'):0;this.events.push({type:'success',at,combo:this.combo,paid});}else{this.combo=0;if(at>=this.immuneUntil){this.hearts--;this.immuneUntil=at+3;this.events.push({type:'hit',at});if(this.hearts===0){this.status='lost';this.time=at;this.angle=oldAngle+(at-oldTime)*speed;}}}}
      if(results.every(v=>v!==null)){if(results.filter(Boolean).length>=4){const paid=this.grant(1,'syncGems');this.events.push({type:'sync',at,paid});}this.rounds.delete(round);for(const key of this.plans.keys())if(Number(key.split(':')[0])<round-1)this.plans.delete(key);}
    }
    if(this.status==='playing'){this.time=oldTime+dt;this.angle=newAngle;if(this.time>=90-1e-8){this.time=90;this.status='finished';}}
    return this.events;
  }
}
