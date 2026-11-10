export const GLITCH_REWARDS=Object.freeze({
  cash:{name:'Tiền',icon:'assets/polish-cash.png'},
  dust:{name:'Dust',icon:'assets/polish-dust.png'},
  spins:{name:'Spins',icon:'assets/polish-spins.png'},
  pet:{name:'Pet',icon:'assets/polish-pet1.png'},
  mutagen:{name:'MutaGen',icon:'assets/polish-mutation.png'}
});
// Prototype milestones reuse Revival's assets; no shared-account grants.
export const GLITCH_BONUS_MILESTONES=Object.freeze([{every:20,type:'pet',amount:1},{every:15,type:'mutagen',amount:1},{every:10,type:'spins',amount:1},{every:5,type:'dust',amount:1}]);
export function glitchBonus(streak){return GLITCH_BONUS_MILESTONES.find(m=>streak>0&&streak%m.every===0)||null;}
