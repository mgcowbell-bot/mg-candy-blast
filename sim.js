/* Bot players used to estimate how hard each level is. A bot that wins proves the level CAN be won; a bot that never wins
   only flags the level as suspicious (it is not a proof that the level is unwinnable). Bots use no boosters. */
const E=require('../engine.js'),{LEVELS,makeLevel,PER_WORLD}=require('../levels.js');
function play(L,seed,policy){
  const rng=E.mulberry(seed),b=new E.Board(L,rng);if(!b.fill())return {won:false,invalid:true};
  let moves=L.moves,score=0,special=L.special;const collect=Object.assign({},L.collect),o=L.obj;
  const tasks=()=>{const c=b.count();return (!o.includes('collect')||Object.values(collect).every(v=>v<=0))&&(!o.includes('jelly')||c.jelly===0)&&(!o.includes('choc')||c.choc===0)&&(!o.includes('box')||c.box===0)&&(!o.includes('crate')||c.crate===0)&&(!o.includes('ice')||c.ice===0)&&(!o.includes('special')||special<=0);};
  const done=()=>score>=L.stars[2]&&tasks();
  const cascade=(forced,pref)=>{let combo=0,first=true;for(let g=0;g<80;g++){let set,creates=[],acts=[],hit;
    if(first&&forced){const ex=b.expand(forced.set,forced.bombType);set=ex.set;acts=ex.acts;hit=ex.chocHit;}
    else{const m=b.findMatches(first?pref:null);if(!m.set.size)break;const ex=b.expand(m.set);set=ex.set;acts=ex.acts;hit=ex.chocHit;creates=m.creates;}
    first=false;combo++;creates.forEach(c=>set.delete(c.i));const res=b.clear(set,hit);
    creates.forEach(c=>{const x=b.at(c.i);if(x){x.s=c.s;if(c.s==='b')x.t=6;special--;}});
    let pts=0;res.hit.forEach(h=>{if(h.k!=='choc')pts+=h.hp===0?60:15;});
    score+=(res.removed.length*20+acts.length*60+creates.length*100)*combo+pts;for(const t in res.collect)if(collect[t]!==undefined)collect[t]=Math.max(0,collect[t]-res.collect[t]);b.collapse();}};
  while(moves>0){
    if(!b.findMove())b.shuffle();
    const mv=b.moves();let pick;
    if(policy==='random')pick=mv[Math.floor(rng()*mv.length)];
    else{let best=-1,cand=[];
      for(const [a,c] of mv){b.swap(a,c);const m=b.findMatches([a,c]);let v=m.set.size+m.creates.length*3;
        const x=b.at(a),y=b.at(c);if((x&&x.s)||(y&&y.s))v+=5;
        m.set.forEach(i=>{const cell=b.at(i),[r,cc]=b.rc(i);if(cell&&collect[cell.t]>0)v+=1.5;if(b.jelly[r][cc]>0)v+=1.5;
          [[r-1,cc],[r+1,cc],[r,cc-1],[r,cc+1]].forEach(([p,q])=>{if(p>=0&&q>=0&&p<b.rows&&q<b.cols&&b.blockerAt(p,q)&&!b.stone[p][q])v+=2;});});
        b.swap(a,c);if(v>best){best=v;cand=[[a,c]];}else if(v===best)cand.push([a,c]);}
      pick=cand[Math.floor(rng()*cand.length)];}
    const [a,c]=pick;const cmb=b.combo(a,c);b.swap(a,c);moves--;cascade(cmb,[a,c]);if(done())return {won:true,left:moves};
  }
  return {won:done(),left:0};
}
function rate(L,runs,policy='greedy',seed0=1){let w=0;for(let i=0;i<runs;i++)if(play(L,seed0+i*977+L.n,policy).won)w++;return w/runs;}
module.exports={play,rate};
