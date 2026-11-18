import {GOAL_Z,GOAL_WIDTH,GOAL_HEIGHT} from './kick-ball-engine.js?v=physical-v7';
import * as THREE from './vendor/three/three.module.js';
const rigs=new WeakMap();
function rigFor(camera){if(!rigs.has(camera))rigs.set(camera,{pivot:new THREE.Vector3(-.15,1.45,3),yaw:0,pitch:.07,radius:3.8,shoulder:.55});return rigs.get(camera);}
function apply(camera,rig){const {yaw,pitch,radius,pivot,shoulder}=rig;const back=new THREE.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));camera.position.copy(pivot).addScaledVector(back,radius).add(new THREE.Vector3(Math.cos(yaw)*shoulder,0,-Math.sin(yaw)*shoulder));camera.lookAt(camera.position.clone().addScaledVector(back,-10));camera.updateMatrixWorld();}
export function cameraAim(camera){const direction=camera.getWorldDirection(new THREE.Vector3());if(Math.abs(direction.z)<1e-6)return null;const distance=(GOAL_Z-camera.position.z)/direction.z;if(distance<=0)return null;const x=camera.position.x+direction.x*distance,y=camera.position.y+direction.y*distance;if(Math.abs(x)>GOAL_WIDTH/2||y<0||y>GOAL_HEIGHT)return null;return {x,y};}
export function resizeOrbit(camera,portrait=false){const rig=rigFor(camera);rig.radius=portrait?5.2:3.8;apply(camera,rig);return cameraAim(camera);}
export function pointCamera(camera,point){const rig=rigFor(camera),dx=point.x-rig.pivot.x,dz=GOAL_Z-rig.pivot.z,distance=Math.hypot(dx,dz);rig.yaw=Math.atan2(-dx,-dz)+Math.asin(rig.shoulder/distance);rig.pitch=Math.atan2(rig.pivot.y-point.y,Math.sqrt(distance*distance-rig.shoulder*rig.shoulder));apply(camera,rig);return cameraAim(camera);}
export function rotateAimCamera(camera,dx,dy){const rig=rigFor(camera);rig.yaw-=dx*.004;rig.pitch=THREE.MathUtils.clamp(rig.pitch+dy*.004,-.25,1.1);apply(camera,rig);return cameraAim(camera);}
