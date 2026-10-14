/* Usage: node tools/calibrate.js first last runs passes out.json
   Nudges each level's move limit / score target until a simple greedy bot (no boosters) wins within a target band.
   Harder levels as n grows; a level the bot NEVER wins gets extra moves. This is a proxy for difficulty, not a human playtest. */
const fs=require('fs');const TUNE=require('../level-tuning.js');const {makeLevel}=require('../levels.js');const {rate}=require('./sim.js');
const [first,last,runs,passes,out]=[+process.argv[2],+process.argv[3],+process.argv[4]||10,+process.argv[5]||5,process.argv[6]];
function band(n,boss){let t=n<=5?.95:n<=15?.82:n<=50?.62:n<=150?.5:n<=400?.4:.32;if(boss)t=Math.min(t,.45);return [Math.max(.15,t-.12),Math.min(1,t+.12)];}
for(let p=1;p<=passes;p++){
  for(let n=first;n<=last;n++){
    const L=makeLevel(n),wr=rate(L,runs,'greedy',p*1337),[lo,hi]=band(n,!!L.boss),t=TUNE[n]||(TUNE[n]={moves:0,sm:1});
    if(wr===0){t.moves=Math.min(16,t.moves+4);t.sm=Math.max(.6,t.sm-.08);}
    else if(wr<lo){t.moves=Math.min(16,t.moves+2);t.sm=Math.max(.6,+(t.sm-.06).toFixed(2));}
    else if(wr>hi){if(t.sm<2.6){t.sm=Math.min(2.6,+(t.sm+.12).toFixed(2));}if(wr>hi+.15)t.moves=Math.max(-12,t.moves-2);}
  }
}
const o={};for(let n=first;n<=last;n++)if(TUNE[n]&&(TUNE[n].moves||TUNE[n].sm!==1))o[n]=TUNE[n];
fs.writeFileSync(out,JSON.stringify(o));console.log('calibrated',first,last,Object.keys(o).length,'levels adjusted');
