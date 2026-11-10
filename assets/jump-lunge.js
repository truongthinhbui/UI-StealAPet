export class JumpLunge {
  constructor(){this.reset();}
  reset(){this.remaining=0;this.x=0;this.z=0;}
  start(angle){this.remaining=.22;this.x=Math.sin(angle);this.z=Math.cos(angle);}
  update(dt,position){if(this.remaining<=0)return;const before=this.remaining/.22;this.remaining=Math.max(0,this.remaining-dt);const after=this.remaining/.22;const travel=.45*(before*before-after*after);position.x+=this.x*travel;position.z+=this.z*travel;}
}
