/* MG Candy Blast - pure match-3 board logic (no DOM) */
(function(root){
'use strict';
let uid=1;const BOMB=6;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
class Board{
  constructor(cfg,rng){
    this.cols=cfg.cols;this.rows=cfg.rows;this.types=cfg.types;this.rng=rng||Math.random;
    this.g=[];this.jelly=[];this.choc=[];this.box=[];this.crate=[];this.stone=[];this.ice=[];
    for(let r=0;r<this.rows;r++){this.g.push(Array(this.cols).fill(null));this.jelly.push(Array(this.cols).fill(0));this.choc.push(Array(this.cols).fill(false));this.box.push(Array(this.cols).fill(0));this.crate.push(Array(this.cols).fill(0));this.stone.push(Array(this.cols).fill(false));this.ice.push(Array(this.cols).fill(0));}
    (cfg.jelly||[]).forEach(([c,r,l])=>{this.jelly[r][c]=l;});
    (cfg.choc||[]).forEach(([c,r])=>{this.choc[r][c]=true;});
    this.boxMax=this.box.map(r=>r.slice());this.crateMax=this.box.map(r=>r.slice());this.iceMax=this.box.map(r=>r.slice());
    (cfg.box||[]).forEach(([c,r,h])=>{this.box[r][c]=h||1;this.boxMax[r][c]=h||1;});         // wooden box: 1-3 hits
    (cfg.crate||[]).forEach(([c,r,h])=>{this.crate[r][c]=h||2;this.crateMax[r][c]=h||2;});     // crate: 2-4 hits
    (cfg.stone||[]).forEach(([c,r])=>{this.stone[r][c]=true;});       // stone: immovable, only Hammer / Area Bomb / Row Blaster break it
    (cfg.ice||[]).forEach(([c,r,h])=>{this.ice[r][c]=h||1;this.iceMax[r][c]=h||1;});         // frozen candy: 1-3 layers
  }
  wall(r,c){return this.choc[r][c]||this.box[r][c]>0||this.crate[r][c]>0||this.stone[r][c];}   // cell holds a blocker instead of a candy
  blocked(r,c){return this.wall(r,c)||this.ice[r][c]>0;}                                         // candy cannot move / be swapped here
  blockerAt(r,c){return this.choc[r][c]?'choc':this.box[r][c]>0?'box':this.crate[r][c]>0?'crate':this.stone[r][c]?'stone':this.ice[r][c]>0?'ice':null;}
  mk(t,s){return {t,s:s||null,id:uid++};}
  rnd(){return Math.floor(this.rng()*this.types);}
  at(i){return this.g[(i/this.cols)|0][i%this.cols];}
  rc(i){return [(i/this.cols)|0,i%this.cols];}
  formsMatchAt(r,c,t){
    const g=this.g;
    if(c>=2&&g[r][c-1]&&g[r][c-2]&&g[r][c-1].t===t&&g[r][c-2].t===t)return true;
    if(r>=2&&g[r-1][c]&&g[r-2][c]&&g[r-1][c].t===t&&g[r-2][c].t===t)return true;
    return false;
  }
  fill(){
    for(let tries=0;tries<300;tries++){
      for(let r=0;r<this.rows;r++)for(let c=0;c<this.cols;c++){
        if(this.wall(r,c)){this.g[r][c]=null;continue;}
        let t,k=0;do{t=this.rnd();k++;}while(k<40&&this.formsMatchAt(r,c,t));
        this.g[r][c]=this.mk(t);
      }
      if(!this.findMatches().set.size&&this.findMove())return true;
    }
    return false;
  }
  findMatches(pref){
    const {g,rows,cols}=this;const runs=[];
    const ok=(r,c)=>{const x=g[r][c];return x&&x.t<BOMB&&!this.ice[r][c]?x.t:-1;};
    for(let r=0;r<rows;r++){let c=0;while(c<cols){const t=ok(r,c);if(t<0){c++;continue;}let e=c+1;while(e<cols&&ok(r,e)===t)e++;if(e-c>=3){const cells=[];for(let k=c;k<e;k++)cells.push(r*cols+k);runs.push({d:'h',cells,t});}c=e;}}
    for(let c=0;c<cols;c++){let r=0;while(r<rows){const t=ok(r,c);if(t<0){r++;continue;}let e=r+1;while(e<rows&&ok(e,c)===t)e++;if(e-r>=3){const cells=[];for(let k=r;k<e;k++)cells.push(k*cols+c);runs.push({d:'v',cells,t});}r=e;}}
    const set=new Set();runs.forEach(x=>x.cells.forEach(i=>set.add(i)));
    const creates=[],used=new Set();
    const hs=new Map(),vs=new Map();
    runs.forEach(x=>x.cells.forEach(i=>(x.d==='h'?hs:vs).set(i,x.t)));
    for(const [i,t] of hs)if(vs.has(i)){creates.push({i,s:'w',t});used.add(i);}
    const pick=(cells)=>{
      const free=cells.filter(i=>!used.has(i)&&!this.at(i).s);
      if(!free.length)return -1;
      if(pref)for(const p of pref)if(free.includes(p))return p;
      return free.includes(cells[cells.length>>1])?cells[cells.length>>1]:free[0];
    };
    runs.forEach(x=>{
      if(x.cells.length>=6){const p=pick(x.cells);if(p>=0){used.add(p);creates.push({i:p,s:'x',t:x.t});}}   // cross blast candy
      else if(x.cells.length>=5){const p=pick(x.cells);if(p>=0){used.add(p);creates.push({i:p,s:'b',t:x.t});}}
      else if(x.cells.length===4){const p=pick(x.cells);if(p>=0){used.add(p);creates.push({i:p,s:x.d==='h'?'v':'h',t:x.t});}}
    });
    return {set,creates,runs};
  }
  commonType(){const n=Array(this.types).fill(0);this.g.forEach(row=>row.forEach(x=>{if(x&&x.t<BOMB)n[x.t]++;}));let b=0;n.forEach((v,i)=>{if(v>n[b])b=i;});return b;}
  expand(set,bombType){
    const {g,rows,cols}=this;const all=new Set(set),q=[...set],act=new Set(),acts=[],chocHit=new Set();
    const add=(r,c)=>{if(r<0||c<0||r>=rows||c>=cols)return;const i=r*cols+c;if(this.wall(r,c)){if(!this.stone[r][c])chocHit.add(i);return;}if(this.ice[r][c]>0){chocHit.add(i);return;}if(g[r][c]&&!all.has(i)){all.add(i);q.push(i);}};
    while(q.length){
      const i=q.pop();const r=(i/cols)|0,c=i%cols;const x=g[r][c];
      if(!x||!x.s||act.has(i))continue;act.add(i);acts.push({i,s:x.s,t:x.t});
      if(x.s==='h')for(let k=0;k<cols;k++)add(r,k);
      else if(x.s==='v')for(let k=0;k<rows;k++)add(k,c);
      else if(x.s==='x'){for(let k=0;k<cols;k++)add(r,k);for(let k=0;k<rows;k++)add(k,c);}
      else if(x.s==='w'){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)add(r+a,c+b);}
      else if(x.s==='b'){const col=bombType!==undefined&&bombType!==null?bombType:this.commonType();for(let a=0;a<rows;a++)for(let b=0;b<cols;b++)if(g[a][b]&&g[a][b].t===col)add(a,b);}
    }
    return {set:all,acts,chocHit};
  }
  // swap two cells in the grid (no animation)
  swap(a,b){const [ar,ac]=this.rc(a),[br,bc]=this.rc(b);const t=this.g[ar][ac];this.g[ar][ac]=this.g[br][bc];this.g[br][bc]=t;}
  // special combination triggered by swapping a and b (call BEFORE swapping grid cells)
  combo(a,b){
    const x=this.at(a),y=this.at(b),{rows,cols}=this;const set=new Set([a,b]);let bombType=null,mode='';
    const area=(i,rad)=>{const [r,c]=this.rc(i);for(let p=-rad;p<=rad;p++)for(let q=-rad;q<=rad;q++){const rr=r+p,cc=c+q;if(rr>=0&&cc>=0&&rr<rows&&cc<cols&&this.g[rr][cc])set.add(rr*cols+cc);}};
    if(x.s==='b'||y.s==='b'){
      if(x.s==='b'&&y.s==='b'){this.g.forEach((row,r)=>row.forEach((z,c)=>{if(z)set.add(r*cols+c);}));return {set,bombType:null,kind:'allclear'};}
      const o=x.s==='b'?y:x,bi=x.s==='b'?a:b;
      if(o.t>=BOMB)return null;
      bombType=o.t;
      this.g.forEach((row,r)=>row.forEach((z,c)=>{if(z&&z.t===o.t){set.add(r*cols+c);if(o.s&&o.s!=='b'&&z!==o)z.s=o.s==='w'?'w':(this.rng()<.5?'h':'v');}}));
      return {set,bombType,kind:o.s?'bombspecial':'bombcolor',bombIdx:bi};
    }
    if(x.s&&y.s){
      const sx=x.s,sy=y.s;
      if(sx==='w'&&sy==='w'){area(b,2);return {set,bombType:null,kind:'ww'};}
      if(sx==='w'||sy==='w'||sx==='x'||sy==='x'){const [r,c]=this.rc(b);for(let k=-1;k<=1;k++){for(let cc=0;cc<cols;cc++)if(r+k>=0&&r+k<rows&&this.g[r+k][cc])set.add((r+k)*cols+cc);for(let rr=0;rr<rows;rr++)if(c+k>=0&&c+k<cols&&this.g[rr][c+k])set.add(rr*cols+c+k);}return {set,bombType:null,kind:'sw'};}
      // two stripes: cross
      x.s='h';y.s='v';return {set,bombType:null,kind:'ss'};
    }
    return null;
  }
  collapse(){ // gravity + spawn. returns {moves,spawns}
    const {g,rows,cols}=this;const moves=[],spawns=[];
    for(let c=0;c<cols;c++){
      let r=rows-1;
      while(r>=0){
        if(this.blocked(r,c)){r--;continue;}
        let top=r;while(top-1>=0&&!this.blocked(top-1,c))top--;
        let w=r;
        for(let i=r;i>=top;i--){if(g[i][c]){if(i!==w){g[w][c]=g[i][c];g[i][c]=null;moves.push({cell:g[w][c],c,from:i,to:w});}w--;}}
        for(let i=w;i>=top;i--){const cell=this.mk(this.rnd());g[i][c]=cell;spawns.push({cell,c,r:i,top:top===0,n:w-i+1});}
        r=top-1;
      }
    }
    return {moves,spawns};
  }
  lineAt(r,c){
    const {g,rows,cols}=this;const x=g[r][c];if(!x||x.t>=BOMB||this.ice[r][c]>0)return false;
    const same=(a,b)=>g[a][b]&&g[a][b].t===x.t&&!this.ice[a][b];
    let n=1,k=c-1;while(k>=0&&same(r,k)){n++;k--;}k=c+1;while(k<cols&&same(r,k)){n++;k++;}
    if(n>=3)return true;
    n=1;k=r-1;while(k>=0&&same(k,c)){n++;k--;}k=r+1;while(k<rows&&same(k,c)){n++;k++;}
    return n>=3;
  }
  valid(a,b){
    const x=this.at(a),y=this.at(b);if(!x||!y)return false;
    const [ar0,ac0]=this.rc(a),[br0,bc0]=this.rc(b);if(this.blocked(ar0,ac0)||this.blocked(br0,bc0))return false;   // blockers and frozen candies cannot be swapped
    if(x.s==='b'||y.s==='b')return true;
    if(x.s&&y.s)return true;
    this.swap(a,b);const [ar,ac]=this.rc(a),[br,bc]=this.rc(b);const ok=this.lineAt(ar,ac)||this.lineAt(br,bc);this.swap(a,b);return ok;
  }
  moves(limit){
    const out=[],{rows,cols}=this;
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      if(!this.g[r][c]||this.blocked(r,c))continue;const i=r*cols+c;
      if(c+1<cols&&this.g[r][c+1]&&this.valid(i,i+1)){out.push([i,i+1]);if(limit&&out.length>=limit)return out;}
      if(r+1<rows&&this.g[r+1][c]&&this.valid(i,i+cols)){out.push([i,i+cols]);if(limit&&out.length>=limit)return out;}
    }
    return out;
  }
  findMove(){const m=this.moves(1);return m.length?m[0]:null;}
  shuffle(){
    const {rows,cols}=this;const cells=[];
    this.g.forEach((row,r)=>row.forEach((x,c)=>{if(x&&!this.ice[r][c])cells.push(x);}));
    for(let t=0;t<200;t++){
      for(let i=cells.length-1;i>0;i--){const j=Math.floor(this.rng()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]];}
      let k=0;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){if(this.wall(r,c))this.g[r][c]=null;else if(this.ice[r][c]>0){/* frozen candy stays */}else this.g[r][c]=cells[k++];}
      if(!this.findMatches().set.size&&this.findMove())return true;
    }
    // fallback: regenerate colours but keep specials count out
    return this.fill();
  }
  clear(set,hitSet,stoneSet){
    const {cols}=this;const res={removed:[],jelly:[],choc:[],hit:[],collect:{}};
    for(const i of set){const [r,c]=this.rc(i);const x=this.g[r][c];if(!x||this.ice[r][c]>0)continue;
      res.removed.push({i,t:x.t,s:x.s,cell:x});this.g[r][c]=null;
      if(x.t<BOMB)res.collect[x.t]=(res.collect[x.t]||0)+1;
      if(this.jelly[r][c]>0){this.jelly[r][c]--;res.jelly.push(i);}
    }
    // every blocker next to a cleared cell, or hit by a special/booster, takes exactly ONE hit per step (no double damage)
    const cs=new Set(hitSet||[]);
    for(const i of set){const [r,c]=this.rc(i);[[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([a,b])=>{if(a>=0&&b>=0&&a<this.rows&&b<cols&&this.blockerAt(a,b)&&!this.stone[a][b])cs.add(a*cols+b);});}
    if(stoneSet)for(const j of stoneSet)cs.add(j);
    for(const j of cs){const [r,c]=this.rc(j);
      if(this.choc[r][c]){this.choc[r][c]=false;res.choc.push(j);res.hit.push({i:j,k:'choc',hp:0});}
      else if(this.box[r][c]>0){this.box[r][c]--;res.hit.push({i:j,k:'box',hp:this.box[r][c]});}
      else if(this.crate[r][c]>0){this.crate[r][c]--;res.hit.push({i:j,k:'crate',hp:this.crate[r][c]});}
      else if(this.stone[r][c]&&stoneSet&&stoneSet.has(j)){this.stone[r][c]=false;res.hit.push({i:j,k:'stone',hp:0});}
      else if(this.ice[r][c]>0){this.ice[r][c]--;res.hit.push({i:j,k:'ice',hp:this.ice[r][c]});}
    }
    return res;
  }
  count(){let j=0,ch=0,bx=0,cr=0,ic=0;for(let r=0;r<this.rows;r++)for(let c=0;c<this.cols;c++){if(this.jelly[r][c]>0)j++;if(this.choc[r][c])ch++;if(this.box[r][c]>0)bx++;if(this.crate[r][c]>0)cr++;if(this.ice[r][c]>0)ic++;}return {jelly:j,choc:ch,box:bx,crate:cr,ice:ic};}
}
const api={Board,mulberry,BOMB};
if(typeof module!=='undefined')module.exports=api;else root.Engine=api;
})(typeof window!=='undefined'?window:globalThis);
