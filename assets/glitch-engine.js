export class GlitchEscape {
  constructor(random=Math.random){this.random=random;this.charges=0;this.arenaRadius=3;this.safeRadius=.85;this.duration=3;this.testMode=false;this.reset();}
  reset(){this.state='ready';this.time=0;this.round=0;this.safeX=0;this.safeZ=0;this.success=false;this.returnTime=0;this.rewardTime=0;}
  nextCircle(){const previousX=this.safeX,previousZ=this.safeZ;let angle=this.random()*Math.PI*2,r=1.25+this.random()*.75;let x=Math.cos(angle)*r,z=Math.sin(angle)*r;if(this.round>0&&Math.hypot(x-previousX,z-previousZ)<this.safeRadius*2){x=-previousX;z=-previousZ;}this.safeX=x;this.safeZ=z;this.round++;this.time=0;this.state='dodge';}
  start(){if(!['ready','failed','home'].includes(this.state))return false;this.reset();this.nextCircle();return true;}
  returnHome(){if(!['failed','ready','dodge'].includes(this.state))return false;this.state='returning';this.returnTime=0;return true;}
  update(dt,x,z){
    if(!Number.isFinite(dt)||dt<0)throw Error('Invalid delta');
    this.rewardTime=Math.max(0,this.rewardTime-dt);
    if(this.state==='dodge'){
      this.time+=dt;
      this.success=Math.hypot(x-this.safeX,z-this.safeZ)<=this.safeRadius;
      if(!this.testMode&&this.time>this.duration){this.state='failed';}
      else if(this.success){this.charges++;this.rewardTime=1.2;this.nextCircle();}
      else if(!this.testMode&&this.time>=this.duration)this.state='failed';
    }else if(this.state==='returning'){this.returnTime+=dt;if(this.returnTime>=.65)this.state='home';}
  }
}
