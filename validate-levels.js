/* Usage: node tools/validate-levels.js [first] [last] [runs]   -> basic validation + bot simulation, JSON written to reports/ */
const fs=require('fs'),path=require('path');
const {makeLevel,validateLevel,LEVELS}=require('../levels.js'),E=require('../engine.js'),{rate}=require('./sim.js');
const first=+process.argv[2]||1,last=+process.argv[3]||1000,runs=+process.argv[4]||6,out=process.argv[5];
const rows=[];let invalid=0,unplayable=0;const t0=Date.now();
for(let n=first;n<=last;n++){
  const L=makeLevel(n),bad=validateLevel(L);const row={n,world:L.world,kind:L.kind,boss:L.boss?L.boss.name:null,moves:L.moves,score:L.score,issues:bad};
  if(bad.length)invalid++;
  const b=new E.Board(L,E.mulberry(n));row.playableStart=b.fill()&&!b.findMatches().set.size&&!!b.findMove();if(!row.playableStart)unplayable++;
  row.greedy=row.playableStart?rate(L,runs,'greedy'):0;rows.push(row);
}
const res={range:[first,last],runs,invalid,unplayable,seconds:Math.round((Date.now()-t0)/1000),rows};
if(out)fs.writeFileSync(out,JSON.stringify(res));
const never=rows.filter(r=>r.greedy===0).map(r=>r.n);
console.log(`levels ${first}-${last}: invalid=${invalid} unplayableStart=${unplayable} never-won-by-bot=${never.length} (${res.seconds}s)`);
