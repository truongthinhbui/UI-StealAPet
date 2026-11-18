import {BALL_RADIUS,GOAL_Z,GOAL_WIDTH,GOAL_HEIGHT,targetAt} from './kick-ball-engine.js?v=physical-v7';
export const BALL_START={x:.33,y:BALL_RADIUS,z:2.5};
export const PHYSICS_DT=1/120;
export const BALL_MASS=.43;
const GRAVITY=9.81,DRAG=.12,GROUND_RESTITUTION=.48,NET_RESTITUTION=.16;
const copy=p=>({...p});
const length=v=>Math.hypot(v.x,v.y,v.z);
export class BallPhysics{
 constructor(){this.reset();}
 reset(){this.position=copy(BALL_START);this.velocity={x:0,y:0,z:0};this.angular={x:0,y:0,z:0};this.time=0;this.accumulator=0;this.active=false;this.resolved=false;this.resolvedAt=0;this.grounded=true;this.events=[];this.shot=null;}
 launch(shot){this.reset();this.shot=shot;this.active=true;this.grounded=false;
 const t=.78-(shot.power-.52)*.32,k=DRAG,a=(1-Math.exp(-k*t))/k;
 const target={x:shot.aim.x,y:shot.result==='high'?5.2:shot.aim.y,z:GOAL_Z};
 this.velocity={x:(target.x-this.position.x)/a,y:(target.y-this.position.y+GRAVITY/k*t)/a-GRAVITY/k,z:(target.z-this.position.z)/a};
 if(shot.result==='low'){this.velocity.x*=.4;this.velocity.z*=.4;this.velocity.y=1.4+shot.power;}
 this.angular={x:this.velocity.z/BALL_RADIUS*.22,y:1.8*(shot.power-.52),z:-this.velocity.x/BALL_RADIUS*.22};
 }
 resolve(result){if(this.resolved)return;this.resolved=true;this.resolvedAt=this.time;this.events.push({type:'result',result,position:copy(this.position)});}
 update(delta){this.events=[];if(!this.active)return this.events;this.accumulator+=Math.min(.1,Math.max(0,delta));while(this.accumulator+1e-10>=PHYSICS_DT){this.step(PHYSICS_DT);this.accumulator-=PHYSICS_DT;}return this.events;}
 step(dt){
 this.time+=dt;const old=copy(this.position),p=this.position,v=this.velocity,oldV=copy(this.velocity),k=DRAG,e=Math.exp(-k*dt),a=(1-e)/k;
 p.x+=v.x*a;p.y+=(v.y+GRAVITY/k)*a-GRAVITY/k*dt;p.z+=v.z*a;v.x*=e;v.z*=e;v.y=(v.y+GRAVITY/k)*e-GRAVITY/k;
 // Primitive goal-frame capsules; 120Hz keeps displacement below the ball diameter.
 for(const post of [{x:-GOAL_WIDTH/2},{x:GOAL_WIDTH/2},{y:GOAL_HEIGHT}]){
  const closest={x:post.x??Math.max(-GOAL_WIDTH/2,Math.min(GOAL_WIDTH/2,p.x)),y:post.y??Math.max(0,Math.min(GOAL_HEIGHT,p.y)),z:GOAL_Z};
  const dx=p.x-closest.x,dy=p.y-closest.y,dz=p.z-closest.z,d=Math.hypot(dx,dy,dz),r=BALL_RADIUS+.085;
  if(d>0&&d<r){const nx=dx/d,ny=dy/d,nz=dz/d,normal=v.x*nx+v.y*ny+v.z*nz;if(normal<0){p.x=closest.x+nx*r;p.y=closest.y+ny*r;p.z=closest.z+nz*r;v.x-=1.62*normal*nx;v.y-=1.62*normal*ny;v.z-=1.62*normal*nz;this.events.push({type:'frame',position:copy(p),speed:-normal});this.resolve('miss');}}
 }
 if(!this.resolved&&old.z>GOAL_Z&&p.z<=GOAL_Z){const crossing=-Math.log(1-DRAG*(GOAL_Z-old.z)/oldV.z)/DRAG,travel=(1-Math.exp(-DRAG*crossing))/DRAG,x=old.x+oldV.x*travel,y=old.y+(oldV.y+GRAVITY/DRAG)*travel-GRAVITY/DRAG*crossing;this.resolve(this.shot.result==='low'?'low':this.shot.result==='high'?'high':targetAt(x,y)===this.shot.cell?'goal':'miss');}
 // A soft rear net absorbs most of the shot, then lets the ball drop to the grass.
 const netZ=GOAL_Z-2+BALL_RADIUS;
 if(old.z>netZ&&p.z<=netZ&&Math.abs(p.x)<GOAL_WIDTH/2&&Math.max(p.y,BALL_RADIUS)<GOAL_HEIGHT){const speed=-v.z;p.z=netZ;v.z=Math.abs(v.z)*NET_RESTITUTION;v.x*=.45;v.y*=.38;this.angular.x*=.45;this.angular.z*=.45;this.events.push({type:'net',position:copy(p),speed});}
 if(p.z<GOAL_Z&&p.z>GOAL_Z-2&&p.y<GOAL_HEIGHT){const edge=GOAL_WIDTH/2-BALL_RADIUS;if(Math.abs(p.x)>edge&&v.x*Math.sign(p.x)>0){const speed=Math.abs(v.x);p.x=Math.sign(p.x)*edge;v.x=-v.x*.22;this.events.push({type:'net',position:copy(p),speed});}}
 if(p.z<GOAL_Z&&p.z>GOAL_Z-2&&old.y<GOAL_HEIGHT-BALL_RADIUS&&p.y>=GOAL_HEIGHT-BALL_RADIUS&&v.y>0){p.y=GOAL_HEIGHT-BALL_RADIUS;v.y=-v.y*.2;this.events.push({type:'net',position:copy(p),speed:Math.abs(oldV.y)});}
 if(p.y<=BALL_RADIUS){p.y=BALL_RADIUS;const impact=-v.y;if(impact>.65){v.y=impact*GROUND_RESTITUTION;v.x*=.79;v.z*=.79;this.grounded=false;this.events.push({type:'bounce',position:copy(p),speed:impact});}else{v.y=0;this.grounded=true;const rolling=Math.exp(-2.7*dt);v.x*=rolling;v.z*=rolling;if(Math.hypot(v.x,v.z)<.06)v.x=v.z=0;}
  this.angular.x=v.z/BALL_RADIUS;this.angular.z=-v.x/BALL_RADIUS;this.angular.y*=.95;if(!this.resolved&&this.shot.result==='low')this.resolve('low');
 }else this.grounded=false;
 if(!this.grounded){this.angular.x*=Math.exp(-.1*dt);this.angular.y*=Math.exp(-.1*dt);this.angular.z*=Math.exp(-.1*dt);}
 if(this.time>3.8&&!this.resolved)this.resolve(this.shot.result==='high'?'high':'miss');
 }
 get speed(){return length(this.velocity);}
 get finished(){return this.resolved&&this.time-this.resolvedAt>1.5&&(this.time>2.8||this.speed<.3);}
}
