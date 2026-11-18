export const W=2400,H=1600,STEP=1/60,SAVE_KEY='port-meridian-save-v1';
export const COLORS={sky:'#0b1026',road:'#252840',roadLine:'#746b85',water:'#12344d',grass:'#173b3e',neon:'#ff4fba',cyan:'#55d8e8',gold:'#ffc857',ink:'#080b16'};
export function rng(seed=1){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
