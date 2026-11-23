import * as T from './vendor/three/three.module.js';
import {variantBriefs,buildVariant} from './base-lock-variants.js';
const kind=new URLSearchParams(location.search).get('concept')||'pawlock';
if(variantBriefs[kind]){
 const brief=variantBriefs[kind]; document.title=brief.title+' · SAP Concept';
 document.querySelector('h1').textContent=brief.title;document.querySelector('.color-only').textContent=brief.subtitle;
 brief.callouts.forEach(([title,description],i)=>{const el=document.querySelector('.c'+(i+1));el.replaceChildren(document.createTextNode(title));const small=document.createElement('small');small.textContent=description;el.append(small)});
 const notes=document.querySelector('.notes');notes.childNodes[2].textContent=brief.notes;
}
const palette={gold:'#f2b84f',cream:'#ffe0b5',navy:'#344547',blue:'#6f9ea4',dark:'#16444b'};
const wire=new URLSearchParams(location.search).has('wire');document.body.classList.toggle('wire',wire);
const p=document.querySelector('.palette');
const asset=new T.Group(),materials={};Object.entries(palette).forEach(([k,v])=>materials[k]=new T.MeshStandardMaterial({color:v,roughness:.65,metalness:.08}));
function add(name,g,color,x=0,y=0,z=0){g.computeVertexNormals();const m=new T.Mesh(g,materials[color]);m.name=name;m.position.set(x,y,z);asset.add(m);return m}
function cylinder(name,r1,r2,h,y,color,n=16){return add(name,new T.CylinderGeometry(r1,r2,h,n,1,false),color,0,y,0)}
function roundedShape(w,h,r){const s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
function panel(name,w,h,d,r,x,y,z,color){return add(name,new T.ExtrudeGeometry(roundedShape(w,h,r),{depth:d,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:1,steps:1,curveSegments:3}),color,x,y,z)}
// One shared concept revision for every clean and wireframe view. Front is +Z; up is +Y.
if(kind==='pawlock'){
cylinder('Pedestal lower foot',.57,.62,.13,.065,'navy',20);
cylinder('Pedestal cream rim',.57,.57,.065,.1625,'cream',20);
cylinder('Pedestal upper slope',.39,.56,.14,.265,'navy',20);
cylinder('Status band',.395,.395,.07,.35,'blue',20);
cylinder('Pedestal collar',.35,.4,.075,.4225,'navy',16);
panel('Short upright support',.35,.3,.25,.055,0,.57,-.125,'navy');
panel('Rounded gold lock housing',.91,.72,.38,.14,0,1.03,-.19,'gold');
panel('Cream inset face',.70,.51,.035,.1,0,1.04,.211,'cream');
// Continuous U-shaped shackle, with its feet penetrating the lock housing.
class ShacklePath extends T.Curve {getPoint(t,target=new T.Vector3()){const r=.32,base=1.30,top=1.64;if(t<.25)return target.set(-r,base+(top-base)*t*4,0);if(t>.75)return target.set(r,top-(top-base)*(t-.75)*4,0);const a=Math.PI-(t-.25)*2*Math.PI;return target.set(Math.cos(a)*r,top+Math.sin(a)*r,0)}}
add('Heavy U shackle',new T.TubeGeometry(new ShacklePath(),18,.085,6,false),'gold');
function pad(name,x,y,rx,ry){const m=add(name,new T.SphereGeometry(1,8,4),'navy',x,y,.275);m.scale.set(rx,ry,.047);return m}
pad('Paw palm',0,1.015,.13,.10);
pad('Paw toe L outer',-.17,1.15,.061,.073);pad('Paw toe L inner',-.065,1.21,.060,.078);pad('Paw toe R inner',.065,1.21,.060,.078);pad('Paw toe R outer',.17,1.15,.061,.073);
add('Keyhole round',new T.CircleGeometry(.037,10),'dark',0,.87,.283);
const keyShape=new T.Shape();keyShape.moveTo(-.018,0);keyShape.lineTo(-.029,-.075);keyShape.lineTo(.029,-.075);keyShape.lineTo(.018,0);keyShape.closePath();add('Keyhole stem',new T.ShapeGeometry(keyShape),'dark',0,.87,.284);
// Rear access panel is structural; it does not repeat the front emblem.
panel('Rear inset access plate',.42,.30,.018,.045,0,1.03,-.233,'navy');
}else if(variantBriefs[kind]){buildVariant(kind,{T,add,panel,cylinder})}else{throw new Error('Unknown concept: '+kind)}
const meshes=[...asset.children],stats={triangles:0,vertices:0,parts:[]};
for(const m of meshes){const n=(m.geometry.index?m.geometry.index.count:m.geometry.attributes.position.count)/3;stats.triangles+=n;stats.vertices+=m.geometry.attributes.position.count;stats.parts.push({name:m.name,triangles:n})}
const usedPalette=Object.entries(palette).filter(([name])=>meshes.some(m=>m.material===materials[name]));
usedPalette.forEach(([,hex])=>{const d=document.createElement('div');d.className='color';d.innerHTML=`<i style="background:${hex}"></i>${hex.toUpperCase()}`;p.append(d)});
document.getElementById('stats').textContent=`CONCEPT MESH · ${stats.triangles} tris · ${stats.vertices} geometry vertices · ${meshes.length} parts · ${usedPalette.length} atlas-sampled colors`;
window.conceptStats=stats;
asset.updateMatrixWorld(true);
window.conceptMeshData={kind,parts:meshes.map(m=>({name:m.name,color:Object.keys(materials).find(k=>m.material===materials[k]),positions:Array.from(m.geometry.attributes.position.array),normals:Array.from(m.geometry.attributes.normal.array),indices:m.geometry.index?Array.from(m.geometry.index.array):null,matrix:Array.from(m.matrixWorld.elements)}))};
if(wire){for(const m of meshes){m.material=new T.MeshBasicMaterial({color:'#66717c',polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});const edges=new T.LineSegments(new T.WireframeGeometry(m.geometry),new T.LineBasicMaterial({color:'#e5c9ff',transparent:true,opacity:.83}));m.add(edges)}}
const views=[['hero',[3.5,2.8,4.8],2.9,980,706],['front',[0,1.0,5],2.25,290,223],['side',[5,1.0,0],2.25,290,223],['back',[0,1.0,-5],2.25,290,223]];
for(const [id,pos,scale,w,h] of views){const canvas=document.getElementById(id);const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1.5);renderer.setSize(w,h,false);renderer.outputColorSpace=T.SRGBColorSpace;renderer.setClearColor(0,0);const scene=new T.Scene();scene.add(asset.clone(true));scene.add(new T.HemisphereLight(0xf5edff,0x4b5960,2.4));const key=new T.DirectionalLight(0xffedcc,3.1);key.position.set(-3,5,6);scene.add(key);const fill=new T.DirectionalLight(0xa4c9ff,1.5);fill.position.set(4,3,-2);scene.add(fill);const aspect=w/h,camera=new T.OrthographicCamera(-scale*aspect/2,scale*aspect/2,scale/2,-scale/2,.01,100);camera.position.set(...pos);camera.lookAt(0,1.0,0);renderer.render(scene,camera)}
window.conceptReady=true;
