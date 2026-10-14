/* MG Candy Blast - versioned LocalStorage save system */
const Store=(()=>{
  const REAL='mgcb_save_v1',DEV='mgcb_save_v1_dev',LIFE_MS=20*60*1000,MAXLIVES=5;
  let key=REAL,d=null,dev=false;
  const defaults=()=>({v:1,name:'Player',coins:300,lives:MAXLIVES,lifeTs:0,unlocked:1,levels:{},
    boosters:{hammer:3,striped:3,bomb:3,extra:3,hand:3,shuffle:2,rowblast:2,areabomb:2},
    settings:{music:true,sfx:true,vib:true,mvol:.5,svol:.8,quality:'medium',fx:'full',shapes:false,lang:'en',tutorialDone:false,noLives:false,voice:true,vvol:.9,sfxOn:{match:true,blast:true,win:true,click:true,life:true,reward:true,booster:true,lose:true}},
    daily:{day:0,last:''},achv:{},spin:'',dq:{date:'',prog:{},claimed:{}},stats:{matches:0,specials:0,won:0,replayed:0,best:0,stars:0,records:0,blocks:0}});
  const clone=o=>JSON.parse(JSON.stringify(o));
  function merge(def,src){ // keep only known keys, same types
    if(typeof def!=='object'||def===null) return typeof src===typeof def?src:def;
    const out=Array.isArray(def)?[]:{};
    for(const k in def){ out[k]=(src&&typeof src==='object'&&k in src)?merge(def[k],src[k]):clone(def[k]); }
    return out;
  }
  function sanitize(x){
    x.coins=Math.max(0,Math.floor(+x.coins||0));
    x.lives=Math.min(MAXLIVES,Math.max(0,Math.floor(+x.lives||0)));
    x.unlocked=Math.min(99999,Math.max(1,Math.floor(+x.unlocked||1)));
    x.name=String(x.name||'Player').slice(0,14);
    const L={};
    if(src_ok(x.levels)) for(const k in x.levels){const n=+k,e=x.levels[k];if(n>=1&&n<=99999&&e&&typeof e==='object')L[n]={stars:Math.min(3,Math.max(0,e.stars|0)),best:Math.max(0,e.best|0)};}
    // repair saves from the old version that lost star data: every level below the unlocked one was beaten
    for(let n=1;n<x.unlocked&&n<=99999;n++)if(!L[n])L[n]={stars:1,best:0};
    x.levels=L;
    const A={};if(src_ok(x.achv))for(const k in x.achv)if(x.achv[k])A[String(k).slice(0,20)]=1;x.achv=A;x.spin=String(x.spin||'').slice(0,10);
    for(const b in x.boosters) x.boosters[b]=Math.min(99,Math.max(0,x.boosters[b]|0));
    x.settings.mvol=Math.min(1,Math.max(0,+x.settings.mvol));x.settings.svol=Math.min(1,Math.max(0,+x.settings.svol));x.settings.vvol=Math.min(1,Math.max(0,+x.settings.vvol));
    const Q={date:'',prog:{},claimed:{}};if(src_ok(x.dq)){Q.date=String(x.dq.date||'').slice(0,10);if(src_ok(x.dq.prog))for(const k in x.dq.prog)Q.prog[String(k).slice(0,12)]=Math.max(0,+x.dq.prog[k]||0);if(src_ok(x.dq.claimed))for(const k in x.dq.claimed)if(x.dq.claimed[k])Q.claimed[String(k).slice(0,12)]=1;}x.dq=Q;
    if(!['low','medium','high'].includes(x.settings.quality))x.settings.quality='medium';
    if(!['full','reduced'].includes(x.settings.fx))x.settings.fx='full';
    return x;
  }
  const src_ok=o=>o&&typeof o==='object'&&!Array.isArray(o);
  function load(){
    let raw=null;
    try{raw=JSON.parse(localStorage.getItem(key));}catch(e){raw=null;}
    const base=merge(defaults(),src_ok(raw)?raw:null);
    if(src_ok(raw)){base.levels=src_ok(raw.levels)?raw.levels:{};base.achv=src_ok(raw.achv)?raw.achv:{};base.dq=src_ok(raw.dq)?raw.dq:{};}
    d=sanitize(base);
    d.settings.sfxOn=merge(defaults().settings.sfxOn,src_ok(raw)&&raw.settings?raw.settings.sfxOn:null);
    updateLives();
  }
  function save(){try{localStorage.setItem(key,JSON.stringify(d));}catch(e){}}
  function updateLives(){
    const now=Date.now();
    if(d.lives>=MAXLIVES){d.lifeTs=0;return;}
    if(!d.lifeTs||d.lifeTs>now)d.lifeTs=now;
    const g=Math.floor((now-d.lifeTs)/LIFE_MS);
    if(g>0){d.lives=Math.min(MAXLIVES,d.lives+g);d.lifeTs+=g*LIFE_MS;if(d.lives>=MAXLIVES)d.lifeTs=0;}
  }
  const QPOOL=[{id:'blue',txt:'Match 50 blue candies',goal:50,reward:100},{id:'red',txt:'Match 40 red candies',goal:40,reward:100},{id:'levels',txt:'Complete 3 levels',goal:3,reward:150},{id:'casc',txt:'Trigger 5 cascades',goal:5,reward:120},{id:'boost',txt:'Use 2 boosters',goal:2,reward:100},{id:'boxes',txt:'Break 6 boxes or crates',goal:6,reward:130},{id:'score',txt:'Earn 5,000 points',goal:5000,reward:120},{id:'spec',txt:'Activate 5 special candies',goal:5,reward:130}];
  function todayStr(){const t=new Date();return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');}
  function questRoll(){if(d.dq.date!==todayStr())d.dq={date:todayStr(),prog:{},claimed:{}};}
  function dayQuests(){const t=todayStr();let h=0;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;const pool=QPOOL.slice(),out=[];
    for(let k=0;k<3;k++){h=(Math.imul(h,1664525)+1013904223)>>>0;out.push(pool.splice(h%pool.length,1)[0]);}return out;}
  const api={
    LIFE_MS,MAXLIVES,QPOOL,
    dayQuests(){questRoll();return dayQuests();},
    quest(id,n){questRoll();d.dq.prog[id]=(d.dq.prog[id]||0)+n;},
    questProg(id){questRoll();return d.dq.prog[id]||0;},
    questClaim(id){questRoll();const q=dayQuests().find(x=>x.id===id);if(!q||d.dq.claimed[id]||(d.dq.prog[id]||0)<q.goal)return 0;d.dq.claimed[id]=1;d.coins+=q.reward;save();return q.reward;},
    get d(){return d;},get dev(){return dev;},
    load,save,
    reset(){d=defaults();save();},
    enterDev(){ if(dev)return; save(); dev=true; const snap=clone(d); key=DEV; d=snap; save(); },
    exitDev(){ if(!dev)return; try{localStorage.removeItem(DEV);}catch(e){} dev=false; key=REAL; load(); },
    updateLives,
    livesOn(){return !d.settings.noLives;},
    hasLife(){updateLives();return d.settings.noLives||d.lives>0;},
    loseLife(){ if(d.settings.noLives)return; updateLives(); if(d.lives<=0)return; if(d.lives>=MAXLIVES)d.lifeTs=Date.now(); d.lives--; save(); },
    refundLife(){if(d.settings.noLives)return;if(d.lives<MAXLIVES)d.lives++;if(d.lives>=MAXLIVES)d.lifeTs=0;save();},
    refillLives(){d.lives=MAXLIVES;d.lifeTs=0;save();},
    msToNextLife(){updateLives();if(d.lives>=MAXLIVES)return 0;return Math.max(0,LIFE_MS-(Date.now()-d.lifeTs));},
    addCoins(n){d.coins=Math.max(0,d.coins+Math.floor(n));save();},
    spendCoins(n){n=Math.floor(n);if(n<0||d.coins<n)return false;d.coins-=n;save();return true;},
    addBooster(k,n){d.boosters[k]=Math.min(99,Math.max(0,(d.boosters[k]||0)+n));save();},
    useBooster(k){if((d.boosters[k]||0)<=0)return false;d.boosters[k]--;save();return true;},
    today(){const t=new Date();return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');},
    yesterday(){const t=new Date(Date.now()-864e5);return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');},
    totalStars(){let s=0;for(const k in d.levels)s+=d.levels[k].stars;return s;},
    completed(){return Object.keys(d.levels).filter(k=>d.levels[k].stars>0).length;}
  };
  return api;
})();
if(typeof module!=='undefined')module.exports=Store;
