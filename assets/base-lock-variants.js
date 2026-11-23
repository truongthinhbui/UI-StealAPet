// SAP concept proposals. Shapes are local Three.js geometry, not external imagery.
export const variantBriefs = {
 lockshield:{title:'TRỤ KHÓA HUY HIỆU KHIÊN',subtitle:'Lockshield Sentinel · Ổ khóa là thân chính',callouts:[['Giữ tượng ổ khóa','Quai khóa lớn, thân vàng bo tròn'],['Khiên nổi trên mặt','Huy hiệu bảo vệ trên thân ổ khóa'],['Giữ bệ tròn thấp','Đặt cạnh cửa · cao dự kiến 1,2 m']],notes:'Dùng item: ổ khóa kích hoạt, huy hiệu khiên và dải đèn ở bệ sáng lên. Đếm ngược hiện phía trên tượng.'},
 shieldlock:{title:'KHIÊN KHÓA BẢO HỘ',subtitle:'Shieldlock · Khóa base, bảo vệ pet',callouts:[['Khiên là thân chính','Viền vàng dày, lòng khiên xanh'],['Ổ khóa nổi ở giữa','Nhận diện ngay chức năng khóa'],['Bệ thấp cạnh cửa','Cao dự kiến 1,2 m · không che lối đi']],notes:'Dùng item: quai khóa đóng lại, lòng khiên và dải đèn bật sáng. Đếm ngược hiện phía trên vật dụng.'},
 bell:{title:'CHUÔNG BẢO HỘ',subtitle:'Guardian Bell · Gõ chuông, bật bảo vệ',callouts:[['Chuông vàng bản lớn','Silhouette quen thuộc, dễ nhận ra'],['Núm gõ dấu chân','Điểm tương tác của chủ base'],['Khung thấp, chân vững','Đặt bên cửa · cao dự kiến 1,2 m']],notes:'Dùng item: chuông rung một nhịp, dải đèn bật sáng. Vòng bảo vệ lan từ bệ ra quanh base.'},
 dog:{title:'TƯỢNG CHÓ CANH CỬA',subtitle:'Shield Pup · Người gác cổng của base',callouts:[['Đầu lớn, tai cụp','Tượng hộ vệ thân thiện với pet'],['Hai chân giữ khiên','Khiên là điểm tương tác chính'],['Dáng ngồi chắc chắn','Đặt bên cửa · cao dự kiến 1,1 m']],notes:'Dùng item: huy hiệu trên khiên sáng lên, vòng bảo vệ lan từ bệ. Tượng cố định, không phải pet thu thập.'},
 breaker:{title:'CẦU DAO BẢO VỆ',subtitle:'Base Breaker · Gạt cần, bật hàng rào',callouts:[['Hộp bo góc, mái che','Thiết bị đặt ngoài cửa base'],['Cần gạt khổ lớn','Bật / tắt đọc rõ bằng hình dáng'],['Chân đế gọn, thấp','Đặt bên cửa · cao dự kiến 1,2 m']],notes:'Dùng item: cần gạt chuyển xuống, đèn trạng thái bật sáng. Hàng rào bảo vệ kích hoạt đồng thời.'}
};
export function buildVariant(kind,{T,add,panel,cylinder}) {
 function ball(name,color,x,y,z,sx,sy,sz,w=8,h=4){const m=add(name,new T.SphereGeometry(1,w,h),color,x,y,z);m.scale.set(sx,sy,sz);return m}
 function tube(name,points,r,color,segments=10,sides=6){return add(name,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),segments,r,sides,false),color)}
 function paw(x,y,z,s=.7,color='navy') {ball('Paw palm',color,x,y,z,.13*s,.11*s,.025*s);for(const [dx,dy] of [[-.17,.14],[-.065,.20],[.065,.20],[.17,.14]])ball('Paw toe',color,x+dx*s,y+dy*s,z,.06*s,.07*s,.025*s,6,3)}
 function base(){cylinder('Wide plinth',.51,.57,.14,.07,'navy',16);cylinder('Pale plinth trim',.50,.51,.06,.17,'cream',16);cylinder('Status light band',.45,.49,.06,.23,'blue',16)}
 if(kind==='lockshield'){
  cylinder('Pedestal lower foot',.57,.62,.13,.065,'navy',20);
  cylinder('Pedestal cream rim',.57,.57,.065,.1625,'cream',20);
  cylinder('Pedestal upper slope',.39,.56,.14,.265,'navy',20);
  cylinder('Status band',.395,.395,.07,.35,'blue',20);
  cylinder('Pedestal collar',.35,.4,.075,.4225,'navy',16);
  panel('Short upright support',.35,.3,.25,.055,0,.57,-.125,'navy');
  panel('Original rounded gold lock housing',.91,.72,.38,.14,0,1.03,-.19,'gold');
  panel('Original cream inset face',.70,.51,.035,.1,0,1.04,.211,'cream');
  class OriginalShackle extends T.Curve{getPoint(t,target=new T.Vector3()){const r=.32,base=1.30,top=1.64;if(t<.25)return target.set(-r,base+(top-base)*t*4,0);if(t>.75)return target.set(r,top-(top-base)*(t-.75)*4,0);const a=Math.PI-(t-.25)*2*Math.PI;return target.set(Math.cos(a)*r,top+Math.sin(a)*r,0)}}
  add('Original heavy U shackle',new T.TubeGeometry(new OriginalShackle(),18,.085,6,false),'gold');
  // A shield is mounted ON the original lock face; it does not replace the housing.
  const badge=new T.Shape();badge.moveTo(-.20,.17);badge.quadraticCurveTo(0,.23,.20,.17);badge.lineTo(.18,-.04);badge.quadraticCurveTo(.14,-.16,0,-.25);badge.quadraticCurveTo(-.14,-.16,-.18,-.04);badge.closePath();
  add('Raised navy shield border',new T.ExtrudeGeometry(badge,{depth:.025,bevelEnabled:true,bevelThickness:.009,bevelSize:.012,bevelSegments:1,curveSegments:4}),'navy',0,1.08,.284);
  const inset=add('Blue shield emblem',new T.ShapeGeometry(badge,4),'blue',0,1.08,.320);inset.scale.set(.81,.81,1);
  add('Gold badge keyhole',new T.CircleGeometry(.028,10),'gold',0,1.11,.323);
  const key=new T.Shape();key.moveTo(-.012,0);key.lineTo(-.020,-.060);key.lineTo(.020,-.060);key.lineTo(.012,0);key.closePath();add('Badge keyhole stem',new T.ShapeGeometry(key),'gold',0,1.10,.324);
  panel('Original rear access plate',.42,.30,.018,.045,0,1.03,-.233,'navy');
 } else if(kind==='shieldlock'){
  base();
  panel('Short shield support',.26,.36,.22,.045,0,.43,-.11,'navy');
  const shield=new T.Shape();shield.moveTo(-.55,.47);shield.quadraticCurveTo(0,.65,.55,.47);shield.lineTo(.50,-.06);shield.quadraticCurveTo(.42,-.37,0,-.61);shield.quadraticCurveTo(-.42,-.37,-.50,-.06);shield.closePath();
  add('Thick gold shield rim',new T.ExtrudeGeometry(shield,{depth:.18,bevelEnabled:true,bevelThickness:.04,bevelSize:.035,bevelSegments:1,curveSegments:5}),'gold',0,1.16,-.12);
  const face=add('Blue shield inset',new T.ShapeGeometry(shield,5),'blue',0,1.16,.108);face.scale.set(.86,.86,1);
  const back=add('Rear shield panel',new T.ShapeGeometry(shield,5),'navy',0,1.16,-.165);back.scale.set(.84,.84,1);back.rotation.y=Math.PI;
  panel('Central lock housing',.49,.41,.11,.065,0,1.13,.135,'gold');
  const path=new T.CatmullRomCurve3([new T.Vector3(-.16,1.31,.20),new T.Vector3(-.16,1.49,.20),new T.Vector3(0,1.61,.20),new T.Vector3(.16,1.49,.20),new T.Vector3(.16,1.31,.20)]);
  add('Lock shackle',new T.TubeGeometry(path,14,.051,6,false),'gold');
  add('Dark keyhole round',new T.CircleGeometry(.048,12),'dark',0,1.17,.274);
  const key=new T.Shape();key.moveTo(-.021,0);key.lineTo(-.034,-.105);key.lineTo(.034,-.105);key.lineTo(.021,0);key.closePath();add('Dark keyhole stem',new T.ShapeGeometry(key),'dark',0,1.16,.275);
  // The paw mark connects the shield to pet protection without replacing the lock.
  paw(0,.73,.125,.43,'cream');
  for(const side of [-1,1]){const rivet=add('Shield rivet',new T.SphereGeometry(.035,6,3),'cream',side*.43,1.52,.11);rivet.scale.z=.45;}
 } else if(kind==='bell'){
  base();
  for(const x of [-.46,.46])panel('Rounded frame leg',.15,1.30,.18,.05,x,.91,-.09,'navy');
  panel('Frame top crossbar',1.1,.18,.22,.065,0,1.59,-.11,'navy');
  cylinder('Hanging neck',.085,.085,.19,1.40,'gold',10);
  const profile=[[.0,-.31],[.39,-.31],[.41,-.27],[.36,-.22],[.27,-.02],[.24,.18],[.17,.28],[.08,.32],[.0,.32]].map(([x,y])=>new T.Vector2(x,y));
  add('Flared bell dome',new T.LatheGeometry(profile,16),'gold',0,1.08,0);
  cylinder('Thick bell lip',.40,.42,.075,.775,'gold',16);
  cylinder('Dark bell underside',.335,.335,.025,.7275,'dark',16);
  ball('Bell clapper','dark',0,.70,0,.075,.10,.075);
  const disk=add('Cream paw medallion',new T.CylinderGeometry(.17,.17,.045,12),'cream',0,1.06,.29);disk.rotation.x=Math.PI/2;
  paw(0,1.015,.323,.56);
  panel('Activation plaque',.42,.15,.06,.035,0,.32,.27,'gold');
 } else if(kind==='dog'){
  base();
  ball('Seated dog torso','cream',0,.73,-.03,.32,.43,.27,10,6);
  for(const side of [-1,1]){
   ball('Seated haunch','cream',side*.27,.45,-.06,.20,.23,.24);
   ball('Rear paw','gold',side*.32,.31,.13,.18,.10,.22);
  }
  ball('Dog head','cream',0,1.36,.015,.40,.36,.30,12,7);
  for(const side of [-1,1]){
   const ear=ball('Floppy ear','gold',side*.345,1.33,-.01,.145,.27,.145,8,5);ear.rotation.z=side*.24;
  }
  ball('Muzzle','cream',0,1.23,.275,.225,.135,.13,10,5);
  ball('Nose','dark',0,1.275,.390,.078,.057,.035,8,4);
  for(const side of [-1,1]){
   ball('Light eye front','cream',side*.155,1.435,.267,.103,.116,.048,8,4);
   const pupil=add('Dark pupil',new T.CircleGeometry(.064,12),'dark',side*.155,1.435,.314);pupil.scale.y=1.10;
  }
  // Shield rests against the body, with front paws overlapping its upper sides.
  const shield=new T.Shape();shield.moveTo(-.28,.25);shield.lineTo(.28,.25);shield.lineTo(.28,-.04);shield.quadraticCurveTo(.23,-.22,0,-.34);shield.quadraticCurveTo(-.23,-.22,-.28,-.04);shield.closePath();
  add('Gold shield rim',new T.ExtrudeGeometry(shield,{depth:.07,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:1,curveSegments:3}),'gold',0,.72,.27);
  const inset=add('Blue shield face',new T.ShapeGeometry(shield,3),'blue',0,.72,.370);inset.scale.set(.82,.82,1);
  for(const side of [-1,1])ball('Paw holding shield','cream',side*.28,.85,.31,.095,.16,.11,8,4);
  // A simple gold keyhole keeps the statue distinct from a collectible pet.
  add('Shield keyhole round',new T.CircleGeometry(.05,10),'gold',0,.74,.376);
  const stem=new T.Shape();stem.moveTo(-.018,0);stem.lineTo(-.03,-.085);stem.lineTo(.03,-.085);stem.lineTo(.018,0);stem.closePath();add('Shield keyhole stem',new T.ShapeGeometry(stem),'gold',0,.73,.377);
  tube('Curled tail',[[0,.44,-.20],[.28,.46,-.36],[.37,.64,-.36],[.26,.72,-.32]],.075,'cream',8,5);
 } else if(kind==='breaker'){
  base();
  panel('Support post',.23,.83,.22,.04,0,.66,-.11,'navy');
  panel('Rounded control cabinet',.86,.93,.30,.10,0,1.18,-.15,'navy');
  panel('Cream cabinet face',.68,.76,.025,.065,0,1.18,.187,'cream');
  panel('Gold rain hood',1.02,.14,.46,.035,0,1.70,-.23,'gold');
  panel('Switch recess',.29,.43,.022,.04,0,1.14,.242,'dark');
  for(const y of [1.31,.98])add('Switch travel mark',new T.BoxGeometry(.08,.035,.014),'navy',-.235,y,.244);
  const axle=add('Lever pivot',new T.CylinderGeometry(.09,.09,.12,12),'gold',0,1.10,.29);axle.rotation.x=Math.PI/2;
  const rod=add('Lever arm',new T.CylinderGeometry(.045,.045,.33,8),'gold',0,1.24,.425);rod.rotation.x=.65;
  panel('Wide lever grip',.36,.12,.11,.04,0,1.38,.475,'gold');
  panel('Status lamp housing',.20,.13,.03,.035,.20,1.455,.225,'navy');
  panel('Status lamp',.145,.07,.018,.025,.20,1.455,.269,'blue');
  for(const side of [-1,1]){
   const bolt=add('Cabinet fastening',new T.CylinderGeometry(.025,.025,.025,6),'gold',side*.29,.86,.244);bolt.rotation.x=Math.PI/2;
  }
  // Side conduit is mounted flush to the post and cabinet.
  tube('Conduit',[[.32,.76,-.05],[.42,.72,-.05],[.42,.48,-.05],[.18,.41,-.05]],.035,'navy',8,5);
 }
}
