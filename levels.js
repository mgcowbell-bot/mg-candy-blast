/* MG Candy Blast - 1,000+ levels: 20 worlds x 50 levels, then the worlds start again ("Lap 2"...). Level n is generated from n
   (deterministic: the same level every time), validated before use, and built lazily so only levels that are opened use memory. */
const WORLDS=[null,'Candy Meadow','Chocolate Hills','Lollipop Forest','Ice Cream Island','Jelly Jungle','Rainbow Valley','Cookie Kingdom','Marshmallow Mountains','Soda Splash Bay','Caramel Desert','Gummy Bear Garden','Crystal Candy Cave','Bubblegum City','Frosting Castle','Toffee Volcano','Sugar Cloud Kingdom','Rainbow Ocean','Chocolate Factory','Magic Candy Tower','Ultimate Candy Kingdom'].map((name,i)=>i?{n:i,name}:null);
const BOOSTERS=['hammer','striped','bomb','extra','hand','shuffle','rowblast','areabomb'];
const MAX_LEVEL=99999,PER_WORLD=50;
/* WIN RULE: 'both' = a level is won as soon as ALL tasks are done AND the 3-star score is reached (moves left do not matter).
   'either' = tasks OR 3 stars. Change this one word to switch. */
const WIN_RULE='both';
const BOSSES=['Candy Monster','Chocolate Castle','Ice Queen','Giant Candy Crusher','Rainbow Guardian'];
function worldOf(n){return ((Math.ceil(n/PER_WORLD)-1)%20)+1;}
function cycleOf(n){return Math.floor((Math.ceil(n/PER_WORLD)-1)/20);}
const UNLOCK={score:1,collect:1,jelly:2,choc:3,special:3,box:4,ice:5,crate:6,multi:7};   // first world that uses each kind of level
const BONUS={jelly:8,box:6,crate:8,ice:7,choc:4,special:3,collect:0,score:0};             // extra moves per goal type
const TUNE=(typeof LEVEL_TUNING!=='undefined')?LEVEL_TUNING:(typeof require!=='undefined'?(()=>{try{return require('./level-tuning.js');}catch(e){return {};}})():{});   // per-level moves / score adjustments written by tools/calibrate.js
function rndSeed(a){let s=a>>>0;return()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function makeLevel(n,simple){
  const r=rndSeed(n*7919+13),wAbs=Math.ceil(n/PER_WORLD),world=worldOf(n),inW=((n-1)%PER_WORLD)+1,boss=!simple&&n%PER_WORLD===0;
  const nn=Math.min(n,400),d10=Math.min(10,1+Math.floor(n/45));
  let cols=8,rows=8;
  if(!boss&&n>10){ if(n%7===0){cols=7;rows=9;} else if(n%5===0){cols=7;rows=7;} }
  const types=n<=5?5:6;
  const avail=Object.keys(UNLOCK).filter(k=>UNLOCK[k]<=Math.min(world+Math.floor(wAbs/21)*0,20));
  let kind;
  if(simple||n<=3)kind='score';
  else if(n<=10)kind=n%2?'collect':'score';
  else{
    const newest=avail.filter(k=>UNLOCK[k]===world);
    if(newest.length&&inW>=2&&inW<=6&&wAbs<=20)kind=newest[0];                       // each world introduces its new goal gently
    else{const pool=avail.filter(k=>k!=='multi'||inW%3===0);kind=pool[(inW*5+world*3)%pool.length];}
  }
  if(boss)kind='multi';
  let moves=Math.max(14,(n<=10?26:28)-Math.floor(Math.min(n,360)/25)+(n%3===0?1:0));
  const ratio=n<=5?.1+.03*n:Math.min(.95,.45+.003*Math.min(n,170)),perMove=types===5?570:260;
  const target=Math.max(1000,Math.round(moves*perMove*ratio/100)*100);
  const cfg={n,world,cols,rows,types,moves:0,score:target,stars:[0,0,0],collect:{},jelly:[],choc:[],box:[],crate:[],stone:[],ice:[],special:0,difficulty:d10,theme:world,
    boosters:n<3?[]:n<10?['hammer','extra']:n<25?['hammer','striped','bomb','extra','hand','shuffle']:BOOSTERS.slice(),extraLimit:2,kind,obj:[],boss:null,lap:cycleOf(n)};
  // goals
  let goals=[];
  if(kind==='multi'){const pool=avail.filter(k=>k!=='multi'&&k!=='score'&&k!=='special'&&k!=='choc'||(k==='choc'&&world>=6));goals=[];while(goals.length<(world>=12||boss?3:2)&&pool.length){goals.push(pool.splice(Math.floor(r()*pool.length),1)[0]);}}
  else if(kind!=='score')goals=[kind];
  const used=new Set();
  const place=(count,minRow)=>{const out=[];let g=0;while(out.length<count&&g++<800&&used.size<cols*rows*.4){const c=Math.floor(r()*cols),rr=minRow+Math.floor(r()*(rows-minRow)),i=rr*cols+c;if(!used.has(i)){used.add(i);out.push([c,rr]);}}return out;};
  // board shape from world 8: immovable stone in corners / centre (breakable only with Hammer, Area Bomb or Row Blaster; never required)
  if(!simple&&world>=8&&inW%4===0&&!boss){const sh=(inW/4)%3;const cells=sh===0?[[0,0],[cols-1,0],[0,rows-1],[cols-1,rows-1]]:sh===1?[[3,3],[4,3],[3,4],[4,4]]:[[0,3],[0,4],[cols-1,3],[cols-1,4]];cells.forEach(([c,rr])=>{if(c<cols&&rr<rows){cfg.stone.push([c,rr]);used.add(rr*cols+c);}});}
  const hp=(base,max)=>Math.min(max,base+(r()<Math.min(.6,n/500)?1:0)+(n>300&&r()<.3?1:0));
  let extra=0;
  if(boss){
    const b=BOSSES[(wAbs-1)%5];cfg.boss={name:b,idx:(wAbs-1)%5};cfg.obj=[];goals=[];moves=30;
    const mid=3;const P=(c,rr)=>{used.add(rr*cols+c);return [c,rr];};
    if(cfg.boss.idx===0){[[3,3],[4,3],[3,4],[4,4]].forEach(([c,rr])=>cfg.crate.push([...P(c,rr),3]));[[2,2],[5,2],[2,5],[5,5],[3,2],[4,2],[3,5],[4,5]].forEach(([c,rr])=>cfg.box.push([...P(c,rr),2]));goals=['crate','box'];}
    else if(cfg.boss.idx===1){for(let c=1;c<7;c+=1){if(c%2===1){cfg.choc.push(P(c,2));cfg.choc.push(P(c,5));}}for(let rr=3;rr<5;rr++){cfg.choc.push(P(0,rr));cfg.choc.push(P(7,rr));}for(let c=2;c<6;c++)for(let rr=3;rr<5;rr++)cfg.jelly.push([c,rr,1]);goals=['choc','jelly'];}
    else if(cfg.boss.idx===2){[[1,1],[6,1],[1,6],[6,6],[2,3],[5,3],[2,4],[5,4],[3,2],[4,2],[3,5],[4,5]].forEach(([c,rr])=>cfg.ice.push([...P(c,rr),2]));[[0,0],[7,0],[0,7],[7,7]].forEach(([c,rr])=>cfg.stone.push(P(c,rr)));goals=['ice'];}
    else if(cfg.boss.idx===3){[[1,2],[6,2],[1,5],[6,5],[3,1],[4,1],[3,6],[4,6],[0,3],[7,4]].forEach(([c,rr])=>cfg.box.push([...P(c,rr),2]));[[3,3],[4,4],[3,4],[4,3]].forEach(([c,rr])=>cfg.crate.push([...P(c,rr),3]));cfg.collect[0]=24;goals=['box','crate','collect'];}
    else{for(let c=1;c<7;c++)for(let rr=3;rr<5;rr++)cfg.jelly.push([c,rr,1]);[[2,2],[5,2],[2,5],[5,5],[1,1],[6,6]].forEach(([c,rr])=>cfg.ice.push([...P(c,rr),1]));[[3,1],[4,6],[1,4],[6,3]].forEach(([c,rr])=>cfg.box.push([...P(c,rr),2]));cfg.special=3+Math.min(4,Math.floor(wAbs/4));goals=['jelly','ice','box','special'];}
    extra=goals.reduce((a,k)=>a+(BONUS[k]||0),0)*.8;
  }else{
    goals.forEach(k=>{
      if(k==='collect'){const kk=kind==='multi'?1:(n>140?2:1),pool=[...Array(types).keys()];for(let i=0;i<kk;i++){const t=pool.splice(Math.floor(r()*pool.length),1)[0];cfg.collect[t]=Math.max(10,Math.round(moves*3.0/types*(0.85+d10*0.10)));}}
      else if(k==='jelly'){const cnt=Math.round(Math.min(Math.floor(rows*cols*.4),8+Math.floor(nn/9))*(kind==='multi'?.65:1)),layers=n>150?2:1;place(cnt,0).forEach(([c,rr])=>cfg.jelly.push([c,rr,(layers===2&&r()<.25)?2:1]));}
      else if(k==='choc'){place(Math.min(18,3+Math.floor(nn/20)),1).forEach(p=>cfg.choc.push(p));}
      else if(k==='box'){place(Math.min(14,3+Math.floor(nn/30)),0).forEach(([c,rr])=>cfg.box.push([c,rr,hp(1,3)]));}
      else if(k==='crate'){place(Math.min(10,2+Math.floor(nn/50)),0).forEach(([c,rr])=>cfg.crate.push([c,rr,hp(2,4)]));}
      else if(k==='ice'){place(Math.min(12,3+Math.floor(nn/40)),0).forEach(([c,rr])=>cfg.ice.push([c,rr,hp(1,3)]));}
      else if(k==='special'){cfg.special=Math.min(8,3+Math.floor(nn/28));}
    });
    extra=goals.reduce((a,k)=>a+(BONUS[k]||0),0)*(kind==='multi'?.8:1);
  }
  cfg.moves=moves+Math.round(extra)+((TUNE[n]&&TUNE[n].moves)||0);
  let goalScore=(kind==='score'||n<=3)?target:Math.max(800,Math.round(target*(kind==='multi'?.45:.55)/100)*100);
  if(TUNE[n]&&TUNE[n].sm)goalScore=Math.max(800,Math.round(goalScore*TUNE[n].sm/100)*100);
  cfg.score=goalScore;cfg.stars=[Math.round(goalScore*.5/100)*100,Math.round(goalScore*.75/100)*100,goalScore];
  cfg.obj=['score'].concat(goals);
  return cfg;
}
/* ---- basic configuration validation (NOT a proof that a level is solvable) ---- */
function validateLevel(L){
  const bad=[];const need=(c,m)=>{if(!c)bad.push(m);};
  need(L&&typeof L==='object','not an object');if(!L||typeof L!=='object')return bad;
  need(Number.isInteger(L.n)&&L.n>=1,'bad level number');need(L.cols>=5&&L.cols<=10&&L.rows>=5&&L.rows<=10,'bad board size');need([4,5,6].includes(L.types),'bad candy types');
  need(L.moves>=8&&L.moves<=80,'move limit out of range');need(L.world>=1&&L.world<=20,'bad world');
  need(Array.isArray(L.stars)&&L.stars.length===3&&L.stars[0]>0&&L.stars[0]<L.stars[1]&&L.stars[1]<L.stars[2]&&L.stars[2]===L.score,'bad star thresholds');
  need(Array.isArray(L.obj)&&L.obj[0]==='score','objectives must start with score');
  const seen=new Set(),cells=L.cols*L.rows;let blk=0;
  const chk=(arr,name,hpMax)=>{(L[name]||[]).forEach(a=>{const [c,r,h]=a;if(!(c>=0&&c<L.cols&&r>=0&&r<L.rows)){bad.push(name+' outside board');return;}const i=r*L.cols+c;if(name!=='jelly'){if(seen.has(i))bad.push(name+' overlaps another blocker');seen.add(i);blk++;}
    if(hpMax&&!(h>=1&&h<=hpMax))bad.push(name+' bad durability');});};
  chk(L.box,'box',3);chk(L.crate,'crate',4);chk(L.ice,'ice',3);chk(L.choc,'choc',0);chk(L.stone,'stone',0);chk(L.jelly,'jelly',3);
  (L.jelly||[]).forEach(([c,r])=>{if((L.stone||[]).some(s=>s[0]===c&&s[1]===r))bad.push('jelly under stone (can never be cleared)');});
  need(blk<=cells*.45,'too many blockers');
  const objOk={score:1,collect:()=>Object.keys(L.collect).length>0,jelly:()=>L.jelly.length>0,choc:()=>L.choc.length>0,box:()=>L.box.length>0,crate:()=>L.crate.length>0,ice:()=>L.ice.length>0,special:()=>L.special>0};
  L.obj.forEach(k=>{const f=objOk[k];need(f!==undefined,'unknown objective '+k);if(typeof f==='function')need(f(),'objective '+k+' has nothing to do');});
  Object.keys(L.collect).forEach(t=>{need(+t<L.types,'collect colour missing');need(L.collect[t]>0&&L.collect[t]<=L.moves*8,'collect count unreasonable');});
  if(L.boss)need(L.boss.name&&L.n%PER_WORLD===0,'bad challenge level');
  return bad;
}
const _levelCache={};
function buildChecked(n){
  let L=makeLevel(n),bad=validateLevel(L);
  if(bad.length){if(typeof console!=='undefined')console.warn('MG Candy Blast: level '+n+' failed validation ('+bad.join('; ')+') - using a simplified version');L=makeLevel(n,true);L.repaired=bad;bad=validateLevel(L);if(bad.length){L=makeLevel(1);L.n=n;L.repaired=bad;}}
  return L;
}
const LEVELS=new Proxy({},{get(t,k){const n=+k;if(Number.isInteger(n)&&n>=1&&n<=MAX_LEVEL)return _levelCache[n]||(_levelCache[n]=buildChecked(n));return undefined;}});
if(typeof module!=='undefined')module.exports={LEVELS,WORLDS,worldOf,cycleOf,makeLevel,validateLevel,PER_WORLD,BOOSTERS};
