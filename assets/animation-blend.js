// Blend from the current weighted pose, including when a transition is interrupted.
export class AnimationBlend {
  constructor(actions){this.actions=actions;this.current=null;this.transition=null;}
  to(name,immediate=false){
    if(name===this.current&&!immediate)return;
    const next=this.actions[name];if(!next)throw new Error('Unknown animation: '+name);
    const previous=this.current;this.current=name;
    if(immediate||previous===null){
      for(const action of Object.values(this.actions))action.stop();
      next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();this.transition=null;return;
    }
    const weights={};let total=0;
    for(const [key,action] of Object.entries(this.actions)){action.stopFading().stopWarping();weights[key]=action.isScheduled()?action.getEffectiveWeight():0;total+=weights[key];}
    if(weights[name]<.0001)next.reset();
    next.setEffectiveTimeScale(1).setEffectiveWeight(weights[name]).play();
    if(total>0)for(const key in weights)weights[key]/=total;
    else weights[previous]=1;
    const duration=name==='jump'?.06:name==='death'?.10:previous==='jump'?.12:.10;
    this.transition={weights,name,elapsed:0,duration};
  }
  update(dt){
    const t=this.transition;if(!t)return;
    t.elapsed=Math.min(t.duration,t.elapsed+dt);const u=t.elapsed/t.duration,alpha=1-(1-u)*(1-u);
    for(const [name,action] of Object.entries(this.actions)){
      const weight=t.weights[name]*(1-alpha)+(name===t.name?alpha:0);
      action.setEffectiveWeight(weight);
      if(t.elapsed===t.duration&&name!==t.name)action.stop();
    }
    if(t.elapsed===t.duration)this.transition=null;
  }
}
