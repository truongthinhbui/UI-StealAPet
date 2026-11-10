import assert from 'node:assert/strict';import {GlitchEscape} from '../assets/glitch-engine.js';
const e=new GlitchEscape();e.start();for(let i=0;i<1000;i++){const x=e.safeX,z=e.safeZ;e.update(.1,x,z);assert.equal(e.charges,i+1);assert.equal(e.round,i+2);assert.equal(e.time,0);e.update(.016,x,z);assert.equal(e.charges,i+1);}
e.update(3,10,10);assert.equal(e.state,'failed');assert.equal(e.charges,1000);assert(e.start());e.update(3.01,e.safeX,e.safeZ);assert.equal(e.state,'failed');assert.equal(e.charges,1000);
const edge=new GlitchEscape(()=>0);edge.start();edge.update(3,edge.safeX,edge.safeZ+edge.safeRadius);assert.equal(edge.charges,1);assert(edge.returnHome());edge.update(.65,0,0);assert.equal(edge.state,'home');assert.equal(edge.charges,1);
console.log('PASS 1000 immediate rewards; full 3s each circle; timeout death; late touch rejected; exact deadline accepted; manual home preserves charges.');
