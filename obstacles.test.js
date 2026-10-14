const E=require('../engine.js');let fails=0,n=0;const ok=(c,m)=>{n++;if(!c){fails++;console.log('FAIL',m);}};
function mk(rows,cfg={}){const R=rows.length,C=rows[0].length;const b=new E.Board(Object.assign({cols:C,rows:R,types:6},cfg),E.mulberry(1));rows.forEach((s,r)=>[...s].forEach((ch,c)=>{b.g[r][c]=(ch==='.'||b.wall(r,c))?null:b.mk(+ch);}));return b;}
// BOX: two hits, one hit per step even if two cleared cells touch it
let b=mk(['0123','1.30','2301','3012'],{box:[[1,1,2]]});
let r=b.clear(new Set([1,4]),[]);   // cells (0,1) and (1,0) both touch the box
ok(b.box[1][1]===1&&r.hit.length===1&&r.hit[0].k==='box'&&r.hit[0].hp===1,'box takes exactly ONE hit per step');
r=b.clear(new Set([1]),[]);ok(b.box[1][1]===0&&r.hit[0].hp===0&&!b.wall(1,1),'box breaks at hp 0 and cell becomes free');
// CRATE hp 3 with a striped sweep through it
b=mk(['0123','1.30','2301','3012'],{crate:[[1,1,3]]});b.g[1][0].s='h';let ex=b.expand(new Set([4]));ok(ex.chocHit.has(5),'striped sweep marks crate as hit');
r=b.clear(ex.set,ex.chocHit);ok(b.crate[1][1]===2&&r.hit.filter(h=>h.k==='crate').length===1,'crate hit once by striped (no double damage)');
// STONE: not damaged by neighbours or specials, broken only on request
b=mk(['0123','1.30','2301','3012'],{stone:[[1,1]]});b.g[1][0].s='h';ex=b.expand(new Set([4]));ok(!ex.chocHit.has(5),'stone ignored by striped');
r=b.clear(ex.set,ex.chocHit);ok(b.stone[1][1]&&!r.hit.length,'stone survives adjacent clears');
r=b.clear(new Set(),[],new Set([5]));ok(!b.stone[1][1]&&r.hit[0].k==='stone','stone breaks with Hammer/area request');
// ICE: frozen candy never matches, cannot swap, thaws by adjacent clears
b=mk(['0001','2345','1230','3452']);ok(b.findMatches().set.size===3,'baseline 0-0-0 match');
b=mk(['1001','2345','1230','3452'],{ice:[[1,0,1]]});b.g[0][1].t=0;b.g[0][2].t=0;b.g[0][0].t=0;ok(b.findMatches().set.size===0,'frozen candy does not form a match');
ok(!b.valid(0,1)&&!b.valid(0,4),'frozen candy cannot be swapped');
b.ice[0][1]=0;ok(b.findMatches().set.size===3,'after thaw it matches normally');
b=mk(['0123','1230','2301','3012'],{ice:[[1,1,2]]});r=b.clear(new Set([1]),[]);ok(b.ice[1][1]===1&&r.hit[0].k==='ice','adjacent clear removes one ice layer');
r=b.clear(new Set([4]),[]);ok(b.ice[1][1]===0&&b.at(5)&&true,'second layer thaws, candy stays');
// gravity treats frozen candy as fixed
b=mk(['0123','1230','2301','3012'],{ice:[[1,1,1]]});const frozen=b.g[1][1];b.clear(new Set([13]),[]);b.collapse();ok(b.g[1][1]===frozen,'frozen candy does not fall');
ok(b.g.every((row,rr)=>row.every((x,c)=>b.wall(rr,c)?x===null:x!==null)),'board refilled around fixed cells');
// gravity with box wall
b=mk(['0123','1230','2301','3012'],{box:[[1,1,2]]});b.clear(new Set([9,13]),[]);b.collapse();ok(b.g[1][1]===null&&b.g.every((row,rr)=>row.every((x,c)=>b.wall(rr,c)?x===null:x!==null)),'candies refill below a box');
// CROSS candy from 6 in a row
b=mk(['012345','234501','450123','012345'].map(s=>s));for(let c=0;c<6;c++)b.g[0][c].t=2;let m=b.findMatches();ok(m.creates.length===1&&m.creates[0].s==='x','6-in-line creates cross-blast candy');
b.g[1][2].s='x';ex=b.expand(new Set([1*6+2]));ok(ex.set.size===6+4-1,'cross blast clears row + column ('+ex.set.size+')');
// shuffle keeps frozen candies and blockers fixed
b=mk(['01234501','12345012','23450123','34501234','45012345','50123450','01234501','12345012'],{ice:[[2,2,1]],box:[[4,4,2]],stone:[[0,7]]});const fz=b.g[2][2];ok(b.shuffle(),'shuffle ok');ok(b.g[2][2]===fz&&b.g[4][4]===null&&b.g[7][0]===null,'shuffle keeps frozen candy and blockers in place');
ok(!b.findMatches().set.size&&!!b.findMove(),'shuffled board playable');
// swap rules and move search never offer blocked swaps
b=mk(['0123','1230','2301','3012'],{box:[[2,2,1]],stone:[[0,0]]});ok(b.moves().every(([a,c])=>!b.blocked(...b.rc(a))&&!b.blocked(...b.rc(c))),'moves() never offers blocked cells');
// 200 random cascades on obstacle boards: no holes, terminates
for(let s=0;s<200;s++){const rnd=E.mulberry(s+7);const cfg={cols:8,rows:8,types:6,box:[[1,1,2],[6,2,3]],crate:[[3,3,3]],stone:[[0,0],[7,7]],ice:[[2,5,2],[5,5,1]],choc:[[4,6]],jelly:[[3,4,1]]};
 const bb=new E.Board(cfg,rnd);if(!bb.fill())continue;
 for(let k=0;k<25;k++){const mv=bb.moves();if(!mv.length){bb.shuffle();continue;}const [a,c]=mv[Math.floor(rnd()*mv.length)];const cb=bb.combo(a,c);bb.swap(a,c);let first=true,loops=0;
  while(loops<60){let set,creates=[],hs;if(first&&cb){const e=bb.expand(cb.set,cb.bombType);set=e.set;hs=e.chocHit;}else{const mm=bb.findMatches(first?[c]:null);if(!mm.set.size)break;const e=bb.expand(mm.set);set=e.set;hs=e.chocHit;creates=mm.creates;}
   first=false;creates.forEach(x=>set.delete(x.i));bb.clear(set,hs);creates.forEach(x=>{const y=bb.at(x.i);if(y){y.s=x.s;if(x.s==='b')y.t=6;}});bb.collapse();loops++;}
  ok(loops<60,'cascade terminates');
  ok(bb.g.every((row,rr)=>row.every((x,cc)=>bb.wall(rr,cc)?x===null:x!==null)),'no holes');}}
console.log(fails?('OBSTACLE TESTS FAILED: '+fails+' of '+n):('ALL '+n+' OBSTACLE/ENGINE CHECKS PASSED'));process.exit(fails?1:0);
