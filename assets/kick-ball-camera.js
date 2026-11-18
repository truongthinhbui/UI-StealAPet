import * as THREE from './vendor/three/three.module.js';
// The screen-center camera ray is the shot aim. Rotation limits retain the goal's safe interior.
export function cameraAim(camera){
 const direction=camera.getWorldDirection(new THREE.Vector3());
 const distance=(-10-camera.position.z)/direction.z;
 return {x:camera.position.x+direction.x*distance,y:camera.position.y+direction.y*distance};
}
export function pointCamera(camera,point){camera.lookAt(point.x,point.y,-10);camera.updateMatrixWorld();return cameraAim(camera);}
export function rotateAimCamera(camera,dx,dy){
 const direction=camera.getWorldDirection(new THREE.Vector3());
 const yaw=Math.atan2(direction.x,-direction.z)+dx*.0025;
 const pitch=Math.atan2(direction.y,Math.hypot(direction.x,direction.z))-dy*.0025;
 const depth=camera.position.z+10;
 const minYaw=Math.atan2(-3.65-camera.position.x,depth),maxYaw=Math.atan2(3.65-camera.position.x,depth);
 const safeYaw=THREE.MathUtils.clamp(yaw,minYaw,maxYaw);
 const x=camera.position.x+Math.tan(safeYaw)*depth;
 const range=depth/Math.cos(safeYaw);
 const safePitch=THREE.MathUtils.clamp(pitch,Math.atan2(.35-camera.position.y,range),Math.atan2(3.25-camera.position.y,range));
 return pointCamera(camera,{x,y:camera.position.y+Math.tan(safePitch)*range});
}
