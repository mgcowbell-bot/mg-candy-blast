const E=require('../engine.js');const {LEVELS}=require('../levels.js');
let fails=0;const ok=(c,m)=>{if(!c){fails++;console.log('FAIL',m);}};
// 1. every level generates a playable board
for(let n=1;n<=1000;n++){const L=LEVELS[n];const b=new E.Board(L,E.mulberry(n));ok(b.fill(),'fill L'+n);ok(b.findMatches().set.size===0,'no initial match L'+n);ok(!!b.findMove(),'move L'+n);
 ok(L.moves>=10&&L.score>0&&L.stars.length===3&&L.cols>=7&&L.theme>=1&&L.obj.length>0,'cfg L'+n);}
console.log('levels ok, count',LEVELS.length-1);
// 2. match detection + specials creation
function mk(rows){const b=new E.Board({cols:rows[0].length,rows:rows.length,types:6},E.mulberry(1));rows.forEach((s,r)=>[...s].forEach((ch,c)=>{b.g[r][c]=ch==='.'?null:b.mk(+ch);}));return b;}
let b=mk(['0012','3345','1234','5120']);ok(b.findMatches().set.size===0,'no match');
b=mk(['000','123','451']);let m=b.findMatches();ok(m.set.size===3&&m.creates.length===0,'match3');
b=mk(['0000','1234','2341','3412']);m=b.findMatches();ok(m.creates.length===1&&m.creates[0].s==='v','match4 -> striped');
b=mk(['00000','12341','23412','34123','41234']);m=b.findMatches();ok(m.creates.length===1&&m.creates[0].s==='b','match5 -> bomb');
b=mk(['000','500','500','123']);b.g[0][0].t=0;b.g[1][0].t=5;
b=mk(['011','011','000','234']);b.g[0][0].t=2;b.g[1][0].t=3;b.g[0][1].t=0;b.g[1][1].t=0;b.g[0][2].t=4;b.g[1][2].t=5;b.g[2][1].t=0;b.g[2][0].t=0;b.g[2][2].t=0;
m=b.findMatches();ok(m.creates.some(c=>c.s==='w'),'L/T -> wrapped');
// 3. striped expand clears row; wrapped 3x3; bomb color
b=mk(['012345','234501','450123','012345']);b.g[1][2].s='h';let e=b.expand(new Set([1*6+2]));ok(e.set.size===6,'striped row');
b.g[1][2].s='v';e=b.expand(new Set([1*6+2]));ok(e.set.size===4,'striped col');
b.g[1][2].s='w';e=b.expand(new Set([1*6+2]));ok(e.set.size===9,'wrapped 3x3 (got '+e.set.size+')');
b.g[1][2].s='b';const col=b.g[0][0].t;e=b.expand(new Set([1*6+2]),0);ok([...e.set].every(i=>i===8||b.at(i).t===0),'bomb colour');
// 4. gravity + chocolate walls
b=mk(['0123','1230','2301','3012']);b.choc[1][1]=true;b.g[1][1]=null;let res=b.clear(new Set([2*4+1,3*4+1]),[]);
let cl=b.collapse();ok(b.g.every((row,r)=>row.every((x,c)=>b.wall(r,c)?x===null:x!==null)),'board refilled');ok(res.removed.length===2,'cleared');
// choc adjacent removal
b=mk(['0123','1.30','2301','3012']);b.choc[1][1]=true;res=b.clear(new Set([0*4+1]),[]);ok(res.choc.length===1&&!b.choc[1][1],'choc removed by adjacent');
// jelly
b=mk(['0123','1230']);b.jelly[0][0]=2;res=b.clear(new Set([0]),[]);ok(b.jelly[0][0]===1,'jelly layer');
// combos
b=mk(['0123','1230','2301','3012']);b.g[0][0].s='b';b.g[0][1].t=1;res=b.combo(0,1);ok(res&&res.kind==='bombcolor'&&res.set.size>=2,'bomb combo');
b=mk(['0123','1230','2301','3012']);b.g[0][0].s='h';b.g[0][1].s='v';res=b.combo(0,1);ok(res&&res.kind==='ss','stripe combo');
// shuffle gives playable board
b=new E.Board({cols:8,rows:8,types:6},E.mulberry(5));b.fill();ok(b.shuffle()&&b.findMove()&&!b.findMatches().set.size,'shuffle');
// full cascade simulation on 200 random boards: loop must terminate & board stay full
for(let s=0;s<200;s++){const bb=new E.Board(LEVELS[1+s%100],E.mulberry(s+99));bb.fill();let steps=0;
 for(let k=0;k<30;k++){const mv=bb.moves();if(!mv.length){bb.shuffle();continue;}const [a,c]=mv[Math.floor(Math.random()*mv.length)];
  const cb=bb.combo(a,c);let forced=null;if(cb){forced=cb;}bb.swap(a,c);
  let set,creates=[],choc;
  if(forced){const ex=bb.expand(forced.set,forced.bombType);set=ex.set;choc=ex.chocHit;}
  let loops=0;
  while(true){let mm;if(forced&&loops===0){mm={set,creates:[],};}else{mm=bb.findMatches([c]);if(!mm.set.size)break;const ex=bb.expand(mm.set);mm={set:ex.set,creates:mm.creates,choc:ex.chocHit};choc=ex.chocHit;}
    mm.creates.forEach(cr=>mm.set.delete(cr.i));const r=bb.clear(mm.set,choc);mm.creates.forEach(cr=>{bb.at(cr.i).s=cr.s;});bb.collapse();loops++;ok(loops<60,'cascade terminates');if(loops>=60)break;}
  ok(bb.g.every((row,r)=>row.every((x,cc)=>bb.wall(r,cc)?x===null:x!==null)),'no holes after cascade');
 }}
console.log(fails?('FAILS: '+fails):'ALL ENGINE TESTS PASSED');process.exit(fails?1:0);
