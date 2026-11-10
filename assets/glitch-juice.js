export function createGlitchJuice({THREE:T,world,stage,panel,arena,entry,position}){
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const control=document.createElement('label');control.className='glitchFxOption';control.innerHTML='<input type="checkbox"> Giảm hiệu ứng';panel.append(control);const toggle=control.querySelector('input');toggle.checked=preference.matches;
  const uniforms={time:{value:0},danger:{value:0},reduced:{value:toggle.checked?1:0}};
  const fallback=arena.material;
  const material=new T.ShaderMaterial({uniforms,transparent:true,depthWrite:false,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
    varying vec2 vUv;uniform float time;uniform float danger;uniform float reduced;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float t=time*(1.-reduced*.85);vec2 cell=floor(vUv*32.);float n=hash(cell);float grid=step(.94,fract(vUv.x*32.))+step(.94,fract(vUv.y*32.));float scan=pow(max(0.,1.-abs(r-fract(t*.28))*10.),3.);float pixel=step(.91,n)*(.35+.25*sin(t*2.+n*30.));vec3 base=mix(vec3(.055,.025,.12),vec3(.18,.03,.10),danger);vec3 energy=mix(vec3(.14,.85,.76),vec3(.95,.18,.45),danger);vec3 c=base+energy*(scan*.30+pixel*.32+grid*.035);float rim=smoothstep(.88,1.,r);c+=vec3(.48,.13,.85)*rim*.5;gl_FragColor=vec4(c,.95);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }
  `});arena.material=material;
  const geometry=new T.BoxGeometry(.065,.065,.065),particles=[];
  for(let i=0;i<32;i++){const m=new T.Mesh(geometry,new T.MeshBasicMaterial({color:i%3?0x6effd6:0xe47fff,transparent:true,depthWrite:false}));m.visible=false;world.add(m);particles.push(m);}
  function ring(color){const m=new T.Mesh(new T.RingGeometry(.88,1,64),new T.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}));m.rotation.x=-Math.PI/2;m.visible=false;world.add(m);return m;}
  const wave=ring(0xc691ff),feet=ring(0x82ffe2);let clock=0,particleAge=1,waveAge=1,feetAge=1,sourceX=0,sourceZ=0,feetX=0,feetZ=0,landing=false;
  function pickup(x,z){particleAge=0;sourceX=x;sourceZ=z;stage.dataset.juice='pickup';}
  function expand(){waveAge=0;window.RevivalAudio?.play('glitchOpen');}
  function jump(){feetAge=0;feetX=position.x;feetZ=position.z;landing=false;window.RevivalAudio?.play('glitchJump');}
  function land(){feetAge=0;feetX=position.x;feetZ=position.z;landing=true;window.RevivalAudio?.play('glitchLand');}
  function reset(){clock=0;particleAge=waveAge=feetAge=1;particles.forEach(m=>m.visible=false);feet.visible=wave.visible=false;stage.dataset.juice='';}
  function update(dt,engine){arena.material=toggle.checked?fallback:material;fallback.color.setHex(engine.state==='failed'?0x54223c:0x302444);clock+=dt;uniforms.time.value=clock;uniforms.reduced.value=toggle.checked?1:0;uniforms.danger.value=engine.state==='failed'?1:engine.state==='dodge'?Math.max(0,engine.time-2):0;stage.dataset.reducedFx=String(toggle.checked);
    particleAge+=dt;waveAge+=dt;feetAge+=dt;
    const p=Math.min(1,particleAge/.65);for(let i=0;i<particles.length;i++){const m=particles[i];m.visible=p<1&&(!toggle.checked||i<8);if(!m.visible)continue;const a=i*Math.PI*2/particles.length,r=(.2+Math.sin(p*Math.PI)*(.6+i%4*.15))*(1-p);const pull=p*p;m.position.set(sourceX+(position.x-sourceX)*pull+Math.cos(a)*r,.12+Math.sin(p*Math.PI)*(.5+i%3*.18),sourceZ+(position.z-sourceZ)*pull+Math.sin(a)*r);m.scale.setScalar(1.2-p*.9);m.material.opacity=1-p*p;m.rotation.set(p*8+i,p*5+i,p*4);}
    if(p===1)stage.dataset.juice='';
    wave.visible=waveAge<.6;wave.position.set(0,.10,0);wave.scale.setScalar(.4+Math.min(1,waveAge/.6)*engine.arenaRadius);wave.material.opacity=Math.max(0,1-waveAge/.6)*(toggle.checked?.25:.65);
    feet.visible=feetAge<.32;feet.position.set(feetX,.095,feetZ);feet.scale.setScalar(.16+Math.min(1,feetAge/.32)*(landing?.7:.4));feet.material.opacity=Math.max(0,1-feetAge/.32)*(toggle.checked?.3:.8);
    entry.material.color.setHex(Math.floor(clock*5)%7===0&&!toggle.checked?0x36c9b7:0x7536ae);
  }
  return {pickup,expand,jump,land,reset,update,get reduced(){return toggle.checked;}};
}
