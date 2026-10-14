/* MG Candy Blast - screens, menus, map, modals, rewards, tutorial, dev menu */
const UI=(()=>{
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const S=()=>Store.d.settings,fmt=n=>Number(n).toLocaleString();
  const I={
    gear:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.4 13a7.6 7.6 0 000-2l2.1-1.6-2-3.4-2.5 1a7.5 7.5 0 00-1.7-1L15 3h-4l-.4 3a7.5 7.5 0 00-1.7 1l-2.5-1-2 3.4L6.6 11a7.6 7.6 0 000 2l-2.1 1.6 2 3.4 2.5-1a7.5 7.5 0 001.7 1l.4 3h4l.4-3a7.5 7.5 0 001.7-1l2.5 1 2-3.4zM13 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" transform="translate(-1 0)"/></svg>',
    pad:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 6h10a5 5 0 015 5v3a3 3 0 01-5.2 2L14.700 14H9.300l-2.100 2A3 3 0 012 14v-3a5 5 0 015-5zm0 3v1.5H5.500V12H7v1.500h1.500V12H10v-1.500H8.500V9zm9 1a1 1 0 100 2 1 1 0 000-2zm2 2a1 1 0 100 2 1 1 0 000-2z"/></svg>',
    back:'<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" d="M15 5l-7 7 7 7"/></svg>',
    pause:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 5h3.500v14H7zm6.500 0H17v14h-3.500z"/></svg>',
    note:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 18V6l11-2v12a3 3 0 11-2-2.800V7.300L11 8.600V18a3 3 0 11-2-2.800z"/></svg>',
    spk:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 4V5L7 9zm13 3a4 4 0 00-2-3.500v7A4 4 0 0016 12zm-2-8.500v2.100a7 7 0 010 12.800v2.100a9 9 0 000-17z"/></svg>',
    vib:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 3h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2zm0 3v12h8V6zM2 8h2v8H2zm18 0h2v8h-2z"/></svg>',
    gfx:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h18a1 1 0 011 1v11a1 1 0 01-1 1h-7l1 3h2v2H8v-2h2l1-3H3a1 1 0 01-1-1V5a1 1 0 011-1zm1 2v9h16V6z"/></svg>',
    globe:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.900 6h-3a15 15 0 00-1.300-3.600A8 8 0 0118.900 8zM12 4c.8 1.100 1.500 2.500 1.900 4h-3.800c.4-1.500 1.100-2.900 1.900-4zM4.300 14a8 8 0 010-4h3.400a16 16 0 000 4zm.8 2h3a15 15 0 001.300 3.600A8 8 0 015.100 16zm3-8h-3a8 8 0 014.300-3.600A15 15 0 008.100 8zM12 20c-.8-1.100-1.500-2.500-1.900-4h3.800c-.4 1.500-1.100 2.900-1.900 4zm2.300-6H9.700a14 14 0 010-4h4.600a14 14 0 010 4zm.3 5.600c.6-1 1-2.200 1.300-3.600h3a8 8 0 01-4.300 3.600zM16.300 14a16 16 0 000-4h3.400a8 8 0 010 4z"/></svg>',
    trophy:'<svg viewBox="0 0 24 24"><path fill="#ffd21a" stroke="#8a5200" stroke-width="1" d="M7 3h10v5a5 5 0 01-10 0zM5 4H2v2a4 4 0 004 4M19 4h3v2a4 4 0 01-4 4M10 14h4v3h3v3H7v-3h3z"/></svg>',
    mic:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.900V21h2v-3.100A7 7 0 0019 11z"/></svg>',
    crown:'<svg viewBox="0 0 24 24"><path fill="#ffd21a" stroke="#8a5200" stroke-width="1.2" stroke-linejoin="round" d="M3 18l-1-11 5 4 5-8 5 8 5-4-1 11z"/></svg>',
    list:'<svg viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M8 6h13M8 12h13M8 18h13M3.500 6h.1M3.500 12h.1M3.500 18h.1"/></svg>',
    bolt:'<svg viewBox="0 0 24 24"><path fill="#fff" d="M13 2L4 14h6l-1 8 10-13h-6z"/></svg>',
    wifi:'<svg viewBox="0 0 24 24"><path fill="none" stroke="#9fe0ff" stroke-width="2.4" stroke-linecap="round" d="M2 9a15 15 0 0120 0M5 13a10 10 0 0114 0M8.500 17a5 5 0 017 0"/><circle cx="12" cy="20" r="1.800" fill="#9fe0ff"/><path stroke="#ff5a7a" stroke-width="2.600" stroke-linecap="round" d="M4 4l16 17"/></svg>',
    bheart:'<svg viewBox="0 0 24 24"><path fill="#ff3b4f" stroke="#7a0a1e" stroke-width="1.200" stroke-linejoin="round" d="M11 21C3 14.500 1.500 9.500 4 6.200 6 3.500 9.500 3.700 10.800 6.300L9.200 9.400l3 2.300-2.200 3.200z"/><path fill="#ff3b4f" stroke="#7a0a1e" stroke-width="1.200" stroke-linejoin="round" d="M12.200 21l-1.400-5.500 2.700-3-3-2.300 1.800-3.400C13.800 4.200 17 3.500 19 6.200c2.500 3.300 1 8.300-6.800 14.800z"/></svg>',
    heart:'<svg viewBox="0 0 24 24"><defs><linearGradient id="hr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a8a"/><stop offset="1" stop-color="#d1102f"/></linearGradient></defs><path fill="url(#hr)" stroke="#7a0a1e" stroke-width="1.200" d="M12 21C3 14.500 1.500 9.500 4 6.200c2.300-3 6.200-2.200 8 .8 1.800-3 5.700-3.800 8-.8 2.500 3.300 1 8.300-8 14.800z"/></svg>',
    coin:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffc400" stroke="#a15a00" stroke-width="1.600"/><circle cx="12" cy="12" r="6.500" fill="none" stroke="#ff9f00" stroke-width="1.600"/><path d="M12 7v10" stroke="#a15a00" stroke-width="2"/></svg>',
    star:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l3 6.500 7 .8-5.200 4.800 1.500 7L12 17.500 5.700 21l1.500-7L2 9.300l7-.8z"/></svg>',
    lock:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 10V8a5 5 0 0110 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H6a1 1 0 01-1-1v-9a1 1 0 011-1zm2 0h6V8a3 3 0 00-6 0z"/></svg>',
    gift:'<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="2" fill="#ff4a6a"/><rect x="2" y="6" width="20" height="5" rx="1.500" fill="#ff7a8a"/><rect x="10.500" y="6" width="3" height="15" fill="#ffd21a"/><path d="M12 6C8 6 6 2 9 2s3 4 3 4zm0 0c4 0 6-4 3-4s-3 4-3 4z" fill="#ffd21a"/></svg>',
    user:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.500-9 5.500V22h18v-2.500c0-3-4-5.500-9-5.500z"/></svg>',
    home:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3l10 9h-3v9h-5v-6h-4v6H5v-9H2z"/></svg>',
    retry:'<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M20 12a8 8 0 11-2.500-5.800M20 3v5h-5"/></svg>',
    play:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 4l14 8-14 8z"/></svg>',
    close:'<svg viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="3.500" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="M5 12.500l4.500 4.500L19 7"/></svg>'
  };
  const HOME_IMG=window.MG_HOME||'assets/images/home.jpg';
  let cur='title',mapBuilt=false,bgCache={};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const bg=(k,w,h,theme,mode,seed,scale)=>bgCache[k]||(bgCache[k]=Art.paint(w,h,theme,mode,seed,scale));
  /* ---------- helpers ---------- */
  function toast(t){const el=$('#toast');el.textContent=t;el.classList.remove('go');void el.offsetWidth;el.classList.add('go');}
  function modal(html,cls=''){const m=document.createElement('div');m.className='modal '+cls;m.innerHTML=`<div class="mbox">${html}</div>`;$('#modals').appendChild(m);requestAnimationFrame(()=>m.classList.add('in'));return m;}
  function close(m){if(!m||!m.parentNode)return;m.classList.remove('in');setTimeout(()=>m.remove(),200);}
  function closeAll(){$$('#modals .modal').forEach(m=>m.remove());}
  function stars(n,total=3){let s='';for(let i=0;i<total;i++)s+=`<i class="${i<n?'on':''}">${I.star}</i>`;return s;}
  function confirmBox(title,text,okLabel,onOk,danger){
    const m=modal(`<h2>${title}</h2><p class="mt">${text}</p><div class="row"><button class="btn blue" data-a="no">Cancel</button><button class="btn ${danger?'red':'green'}" data-a="ok">${okLabel}</button></div>`,'small');
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;close(m);if(a.dataset.a==='ok')onOk();};
  }
  function show(id){
    cur=id;['title','map','game'].forEach(s=>$('#'+s).classList.toggle('on',s===id));
    if(id==='game')Game.show();else Game.leave();
    if(id==='map')openMap();if(id==='title')refreshTitle();
    tickLives();
  }
  /* ---------- lives & coins ---------- */
  function livesLabel(){const ms=Store.msToNextLife();if(S().noLives)return '∞';return Store.d.lives>=Store.MAXLIVES?'Full':Math.floor(ms/60000)+':'+String(Math.floor(ms/1000)%60).padStart(2,'0');}
  let lastLives=-1;
  function tickLives(){
    Store.updateLives();
    $$('.livesN').forEach(e=>e.textContent=S().noLives?'∞':Store.d.lives);$$('.livesT').forEach(e=>e.textContent=livesLabel());$$('.coinsN').forEach(e=>e.textContent=fmt(Store.d.coins));
    if(lastLives>=0&&Store.d.lives>lastLives){Snd.play('life');}lastLives=Store.d.lives;
    $('#devBadge').style.display=Store.dev?'block':'none';
    const nl=$('#nolives');if(nl){const t=$('.nlT',nl);if(t)t.textContent=livesLabel();if(Store.hasLife()&&nl.parentNode){close(nl);}}
  }
  setInterval(()=>{if(!document.hidden)tickLives();},1000);
  /* ---------- title ---------- */
  function buildTitle(){
    const el=$('#title');
    el.innerHTML=`<div class="bgimg" id="titleBg"></div>
    <div class="topbar"><button class="roundbtn" data-a="profile" aria-label="Profile">${I.user}</button><button class="roundbtn" data-a="snd" id="sndBtn" aria-label="Sound on/off">${I.spk}</button><span class="sp"></span><button class="roundbtn" data-a="ach" aria-label="Achievements">${I.trophy}</button></div>
    <div class="tcol"><div class="homeBox"><img src="${HOME_IMG}" alt="MG Candy Blast - Match, Blast, Win!" draggable="false"></div>
    <div class="tlow"><div class="tbtns"><button class="btn green big" data-a="play">Play ${I.play}</button><button class="btn blue" data-a="settings">${I.gear} Settings</button><button class="btn purple" data-a="more">${I.pad} More Games</button></div>
    <div class="trow"><div class="tleft"><button class="pill coins" data-a="shop" aria-label="Coins and Boosters"><span class="ic">${I.coin}</span><b class="coinsN"></b><span class="plus">+</span></button><button class="chip" data-a="daily"><span class="gi">${I.gift}</span><span><b>Daily Rewards</b><small>Free Coins &amp; Boosters!</small></span><em id="dailyDot"></em></button></div>
    <div class="mascotW">${Art.mascot()}</div></div></div></div>`;
    el.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;({play(){Snd.unlock();show('map');},settings:openSettings,more:openMore,daily:openDaily,profile:openProfile,ach:openAch,snd:toggleSound,shop:openShop})[a.dataset.a]();};
  }
  function toggleSound(){const st=S(),on=st.sfx||st.music;st.sfx=st.music=!on;if(on)Voice.stop();Store.save();Snd.unlock();Snd.apply();Snd.syncMusic();sndIcon();if(!on)Snd.preview('click');}
  function sndIcon(){const b=$('#sndBtn');if(b)b.classList.toggle('muted',!(S().sfx||S().music));}
  function refreshTitle(){sndIcon();$('#titleBg').style.backgroundImage=`url(${bg('t',360,640,1,'sky',3,1.4)})`;$('#dailyDot').style.display=dailyState().can?'block':'none';}
  /* ---------- level map ---------- */
  const GAP=92;let mapBlocks=0;
  function blocksNeeded(){return Math.max(1,Math.ceil((Store.d.unlocked+25)/PER_WORLD));}
  function nodePos(n){const x=50+33*Math.sin(n*.85+Math.sin(n*.3)),y=(n-1)*GAP;return {x,y};}
  function buildMap(){
    const el=$('#map'),B=blocksNeeded(),H=B*PER_WORLD*GAP+260,Wd=Math.min(innerWidth,560);mapBlocks=B;
    el.innerHTML=`<div class="mapHead"><button class="roundbtn" data-a="home" aria-label="Home">${I.home}</button>
      <div class="pill hearts" data-a="lives"><span class="ic">${I.heart}</span><b class="livesN"></b><small class="livesT"></small></div>
      <div class="pill coins" data-a="shop"><span class="ic">${I.coin}</span><b class="coinsN"></b><span class="plus">+</span></div>
      <button class="roundbtn" data-a="settings" aria-label="Settings">${I.gear}</button></div>
    <div class="scroller" id="scroller"><div class="inner" id="inner" style="height:${H}px"></div></div>
    <div class="worldPanel" id="worldPanel"></div><div class="sweetAd">Sweet Adventure!</div>`;
    const inner=$('#inner');
    for(let b=B-1;b>=0;b--){const w=(b%20)+1,cyc=Math.floor(b/20);const sec=document.createElement('div');sec.className='wsec';
      let top=H-130-(PER_WORLD*b+PER_WORLD-1)*GAP-GAP/2-30,hh=PER_WORLD*GAP;if(b===B-1){top-=130;hh+=130;}if(b===0)hh+=130;
      sec.style.cssText=`top:${top}px;height:${hh}px;background-image:url(${bg('m'+w+'_'+Wd+'_'+hh,Wd,hh,w,'land',w+10,.5)})`;
      sec.innerHTML=`<div class="wbanner">World ${w} · ${WORLDS[w].name}${cyc?' · Lap '+(cyc+1):''}</div>`;inner.appendChild(sec);}
    inner.insertAdjacentHTML('beforeend',`<svg class="trail" viewBox="0 0 100 ${H}" preserveAspectRatio="none"><path id="trail" fill="none" vector-effect="non-scaling-stroke"/><path id="trail2" fill="none" vector-effect="non-scaling-stroke"/></svg><div id="nodes"></div>`);
    const pts=[];for(let n=1;n<=B*PER_WORLD;n++){const p=nodePos(n);pts.push([p.x,H-130-p.y]);}
    let d='M'+pts[0][0].toFixed(2)+' '+pts[0][1].toFixed(1);for(let i=1;i<pts.length-1;i++){const mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;d+=' Q'+pts[i][0].toFixed(2)+' '+pts[i][1].toFixed(1)+' '+mx.toFixed(2)+' '+my.toFixed(1);}d+=' L'+pts[pts.length-1][0].toFixed(2)+' '+pts[pts.length-1][1].toFixed(1);
    $('#trail').setAttribute('d',d);$('#trail2').setAttribute('d',d);
    el.onclick=e=>{const a=e.target.closest('[data-a]');if(a){const f=({home(){show('title');},lives:openLives,shop:openShop,settings:openSettings,levels:openLevels,worlds:openWorlds})[a.dataset.a];if(f)f();return;}
      const nd=e.target.closest('.node');if(nd)onNode(+nd.dataset.n);const wb=e.target.closest('.wbtn');if(wb)onWorld(+wb.dataset.from);};
    mapBuilt=true;
  }
  function openMap(){
    if(!mapBuilt||blocksNeeded()!==mapBlocks)buildMap();
    const H=mapBlocks*PER_WORLD*GAP+260,u=Store.d.unlocked;
    $('#nodes').innerHTML=Array.from({length:mapBlocks*PER_WORLD},(_,i)=>{const n=i+1,p=nodePos(n),L=Store.d.levels[n],lock=n>u,curr=n===u&&!(L&&L.stars>0);
      const boss=n%PER_WORLD===0;return `<button class="node n${String(n).length}${boss?' boss':''}${lock?' lock':''}${curr?' cur':''}${L&&L.stars?' done':''}" data-n="${n}" style="left:${p.x}%;top:${H-130-p.y}px" aria-label="Level ${n}">${lock?I.lock:n}${boss&&!lock?'<i class="bossTag"></i>':''}<span class="ns">${stars(L?L.stars:0)}</span></button>`;}).join('');
    const wc=Math.ceil(u/PER_WORLD),first=Math.max(1,Math.min(wc-2,mapBlocks-4)),ws=[];for(let i=0;i<5&&first+i<=mapBlocks+1;i++)ws.push(first+i);
    $('#worldPanel').innerHTML=ws.map(wa=>{const from=(wa-1)*PER_WORLD+1,lk=u<from,act=wa===wc,wn=((wa-1)%20)+1;return `<button class="wbtn${lk?' lock':''}${act?' act':''}" data-w="${wa}" data-from="${from}">${lk?I.lock:act?'<span class="crn">'+I.crown+'</span>':'<b>'+wn+'</b>'}<small>World ${wn}</small></button>`;}).join('')+`<button class="wbtn lst" data-a="worlds">${I.globe}<small>All Worlds</small></button>`;
    tickLives();
    requestAnimationFrame(()=>{const sc=$('#scroller'),p=nodePos(u);sc.scrollTop=Math.max(0,H-130-p.y-sc.clientHeight*.55);});
  }
  function onWorld(from){if(Store.d.unlocked<from){toast(`Reach Level ${from} to unlock this world`);Snd.play('invalid');return;}
    const sc=$('#scroller'),H=mapBlocks*PER_WORLD*GAP+260,p=nodePos(from);sc.scrollTo({top:Math.max(0,H-130-p.y-sc.clientHeight*.6),behavior:S().fx==='reduced'?'auto':'smooth'});}
  function openWorlds(){
    const u=Store.d.unlocked,lap=cycleOf(Math.max(1,u)),m=modal('','settings'),box=$('.mbox',m);
    let rows='';for(let i=1;i<=20;i++){const wa=lap*20+i,from=(wa-1)*PER_WORLD+1,to=wa*PER_WORLD,lk=u<from;let done=0,st=0;for(let n=from;n<=to;n++){const L=Store.d.levels[n];if(L&&L.stars>0){done++;st+=L.stars;}}
      rows+=`<button class="wrow${lk?' lock':''}" data-from="${from}"><span class="wno">${lk?I.lock:i}</span><span class="wnm"><b>${WORLDS[i].name}</b><small>Levels ${from}–${to} · ${lk?'Reach level '+from:done+'/'+PER_WORLD+' done'}</small></span></button>`;}
    box.innerHTML=`<div class="mhead"><button class="roundbtn sm" data-a="x" aria-label="Back">${I.back}</button><h2>All Worlds${lap?' · Lap '+(lap+1):''}</h2></div><div class="lvlist">${rows}</div>`;
    m.onclick=e=>{if(e.target.closest('[data-a=x]')){close(m);return;}const w=e.target.closest('.wrow');if(!w)return;const from=+w.dataset.from;if(Store.d.unlocked<from){toast('Reach Level '+from+' to unlock this world');Snd.play('invalid');return;}close(m);onWorld(from);};
  }
  function onNode(n){
    if(n>Store.d.unlocked){toast(`Locked — complete Level ${n-1} first`);Snd.play('invalid');const b=$(`.node[data-n="${n}"]`);b.classList.remove('shk');void b.offsetWidth;b.classList.add('shk');return;}
    openPreview(n);
  }
  function objText(L){
    const o=[];const hasTasks=L.obj.some(x=>x!=='score');
    for(const t in L.collect)o.push(`Collect ${L.collect[t]} <img class="ti" src="${Art.icon(t)}" alt="">`);
    if(L.obj.includes('jelly'))o.push(`Clear all jelly (${L.jelly.length} tiles)`);
    if(L.obj.includes('choc'))o.push(`Remove ${L.choc.length} chocolate blocks`);
    if(L.obj.includes('box'))o.push(`Break all wooden boxes (${L.box.length})`);
    if(L.obj.includes('crate'))o.push(`Break all crates (${L.crate.length})`);
    if(L.obj.includes('ice'))o.push(`Free all frozen candies (${L.ice.length})`);
    if(L.obj.includes('special'))o.push(`Create ${L.special} special candies`);
    o.push(hasTasks?(WIN_RULE==='both'?`and earn 3 stars (${fmt(L.score)} points)`:`or earn 3 stars (${fmt(L.score)} points)`):`Earn 3 stars: reach ${fmt(L.score)} points`);
    return o;
  }
  function openPreview(n){
    const L=LEVELS[n],W=WORLDS[L.world],best=Store.d.levels[n],names={hammer:'Hammer',striped:'Striped',bomb:'Color Bomb',extra:'Extra Moves',hand:'Hand',shuffle:'Shuffle',rowblast:'Row Blaster',areabomb:'Area Bomb'};
    const m=modal(`<button class="x" data-a="x">${I.close}</button><div class="ribbon">Level ${n}</div>${L.boss?`<div class="bossRibbon">Challenge: ${L.boss.name}</div>`:''}<p class="sub">${W.name} · <b class="dif d${n<=5?0:n<=20?1:n<=60?2:3}">${n<=5?'Easy':n<=20?'Medium':n<=60?'Hard':'Very Hard'}</b></p>
      <div class="pbox"><h3>Goal</h3>${objText(L).map(t=>`<div class="goal">${t}</div>`).join('')}</div>
      <div class="two"><div class="pbox"><h3>Moves</h3><b class="big">${L.moves}</b></div><div class="pbox"><h3>Best</h3><b class="big">${best?fmt(best.best):'—'}</b><div class="stars sm">${stars(best?best.stars:0)}</div></div></div>
      <div class="pbox"><h3>Boosters</h3><div class="bl">${L.boosters.length?L.boosters.map(k=>`<span class="bchip">${names[k]} <b>${Store.d.boosters[k]}</b></span>`).join(''):'<small>None on this level — learn the basics first!</small>'}</div></div>
      ${L.boosters.includes('striped')&&Store.d.boosters.striped>0?`<button class="btn pink sm" data-a="pre">Start with a Striped Candy <b>×${Store.d.boosters.striped}</b></button>`:''}<button class="btn green big" data-a="go">Play ${I.play}</button>`,'preview');
    let pre=false;
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a==='x')close(m);else if(a.dataset.a==='pre'){pre=!pre;a.classList.toggle('on',pre);a.style.outline=pre?'4px solid #ffe14a':'';}else if(a.dataset.a==='go'){close(m);launch(n,false,pre);}};
  }
  /* ---------- launching levels ---------- */
  let launchLock=0;
  function launch(n,forceTut,pre){
    if(Date.now()-launchLock<500)return;launchLock=Date.now();
    if(n>Store.d.unlocked&&!Store.dev){toast('Level locked');return;}
    if(!Store.hasLife()){openLives();return;}
    closeAll();Snd.unlock();if(forceTut)S().tutorialDone=false;
    if(!$('#board')){buildGame();}
    show('game');
    $('#game').classList.remove('enter');void $('#game').offsetWidth;$('#game').classList.add('enter');
    Game.start(n);if(pre&&Store.useBooster('striped'))Game.preStriped();setTimeout(()=>{Game.relayout();Game.intro();},60);
  }
  function buildGame(){
    $('#game').innerHTML=`<div class="bgimg" id="gameBg"></div><div class="hud" id="hud"><div class="hbox moves"><span>Moves</span><b id="hMoves">0</b></div><div class="hbox target"><span id="hLevel">Target</span><div id="hObj"></div></div><button class="roundbtn" id="btnPause" aria-label="Pause">${I.pause}</button></div>
    <div class="scoreRow" id="scoreRow"><span class="sc"><i id="hLv"></i>Score <b id="hScore">0</b></span><div class="sbar"><i id="starFill"></i><u id="st0">${I.star}</u><u id="st1">${I.star}</u><u id="st2">${I.star}</u></div></div>
    <div class="boardArea" id="boardArea"><div id="boardWrap"><canvas id="board" data-ready="1"></canvas></div><div id="banner"></div></div>
    <div class="gmBar" id="gmBar"><i>${I.star}</i><b>Great Moves!</b><i>${I.star}</i></div>
    <div class="boostBar" id="boostBar"></div>`;
    Game.init();$('#btnPause').onclick=()=>openPause();
    Game.cb.win=showWin;Game.cb.lose=showLose;Game.cb.tutorial=()=>tutorial();Game.cb.pause=openPause;
  }
  const origStart=Game.start;
  Game.start=function(n){const ok=origStart(n);if(ok){$('#gameBg').style.backgroundImage=`url(${bg('g'+LEVELS[n].theme,360,640,LEVELS[n].theme,'sky',LEVELS[n].theme+20,1.2)})`;}return ok;};
  /* ---------- pause / win / lose ---------- */
  function openPause(){
    const g=Game.state;if(!g||g.ended||$('#modals .modal'))return;Game.setPaused(true);
    const m=modal(`<div class="ribbon">Paused</div><div class="stack"><button class="btn green" data-a="res">Resume ${I.play}</button>${g.goalReached?'<button class="btn pink" data-a="fin">Finish level now</button>':''}<button class="btn blue" data-a="re">${I.retry} Restart</button><button class="btn blue" data-a="set">${I.gear} Settings</button><button class="btn purple" data-a="map">${I.back} Level Map</button></div>`,'small');
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;const k=a.dataset.a;
      if(k==='set'){openSettings(()=>{});return;}
      close(m);Game.setPaused(false);if(k==='fin'){Game.finishNow();return;}if(k==='re')launch(g.n);else if(k==='map')show('map');};
  }
  function showWin(r){
    Snd.play('win');FX.confetti(160);FX.fireworks(4);
    const rw=[`<span class="rw">${I.coin}<b>+${r.coins}</b></span>`,`<span class="rw"><i class="sm on">${I.star}</i><b>+${r.stars}</b></span>`];
    if(r.booster){const bn={hammer:'Hammer',striped:'Striped',bomb:'Bomb',extra:'+5 Moves',hand:'Hand'}[r.booster],bi=Game.boostIcons()[r.booster];rw.push(`<span class="rw"><span class="rwi">${bi}</span><b>+1 ${bn}</b></span>`);}
    const m=modal(`<div class="stars lg" id="wst">${stars(0)}</div><div class="ribbon big"${r.boss?' style="font-size:24px"':''}>${r.boss?'Challenge Complete!':'Level Complete!'}</div>${r.boss?`<div class="sub2">${r.boss} cleared!</div>`:''}${r.record?'<div class="sub2">NEW RECORD!</div>':''}
      <p class="scorerow">Score <b>${fmt(r.score)}</b></p>${r.bonus?`<small class="bn">includes ${fmt(r.bonus)} bonus for unused moves</small>`:''}<div class="rewbar">${rw.join('')}</div>
      <button class="btn green big" data-a="next">${r.hasNext?'Next':'Level Map'}</button><div class="row mini"><button class="btn blue sm" data-a="re">${I.retry} Retry</button><button class="btn purple sm" data-a="home">${I.home} Home</button></div>`,'win');
    $$('#wst i',m).forEach((st,i)=>{if(i<r.stars)setTimeout(()=>{st.classList.add('on','pop');Snd.play('star');const bb=st.getBoundingClientRect();FX.burst(bb.left+bb.width/2,bb.top+bb.height/2,14,['#fff','#ffd21a','#ffb400'],1.2,true);},350+i*420);});
    Voice.say('complete',true);setTimeout(()=>{if(m.parentNode&&(r.record||r.stars===3))Voice.say(r.record?'m_record':'three',true);},2900);
    if(r.record)setTimeout(()=>{if(m.parentNode){Msg.show('record','New Record!',innerWidth/2,innerHeight*.12);}},1500);
    if(r.world)setTimeout(()=>{Snd.play('world');Msg.banner('World Unlocked!',WORLDS[r.world].name);Voice.say('world',true);},3800);
    setTimeout(announceAch,r.world?5200:2400);
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;Voice.stop();close(m);const k=a.dataset.a;
      if(k==='next'){if(r.hasNext)launch(r.n+1);else show('map');}else if(k==='re')launch(r.n);else show('title');};
  }
  function showLose(r){
    Store.loseLife();tickLives();
    const ex=Store.d.boosters.extra>0,canC=Store.d.coins>=200,line=['TRY AGAIN!','ONE MORE ADVENTURE?','YOU CAN DO IT!'][(Math.random()*3)|0];
    const m=modal(`<div class="brk">${I.bheart}</div><div class="gotxt">Game Over</div><p class="mt">Don't worry!<br>Better luck next time!</p><p class="fs">Final score <b>${fmt(r.score)}</b></p>
      <button class="btn blue" data-a="re">${I.retry} Retry</button><button class="btn purple" data-a="home">${I.home} Home</button>
      <button class="btn pink sm" data-a="extra" ${ex||canC?'':'disabled'}>+5 Moves ${ex?`(${Store.d.boosters.extra} left)`:`· 200 ${I.coin}`}</button>`,'lose');
    Voice.say(Math.random()<.5?'try1':'try2',true);
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(!a||a.disabled)return;const k=a.dataset.a;
      if(k==='extra'){if(Game.extraFromLose(!ex)){Store.refundLife();tickLives();Voice.stop();close(m);}else toast('Not enough coins');return;}
      Voice.stop();close(m);if(k==='re')launch(r.n);else show('title');};
  }
  /* ---------- settings ---------- */
  const SFXN=[['match','Match Sound','match','note'],['blast','Blast Sound','blast','blast'],['win','Level Complete','win','star'],['click','Button Click','click','click'],['lose','Game Over','lose','lose'],['life','Life Refill','life','life'],['reward','Reward','reward','reward'],['booster','Booster Use','booster','booster']];
  function sw(id,on){return `<button class="sw${on?' on':''}" data-t="${id}" role="switch" aria-checked="${on}"><i></i></button>`;}
  const FLAG='<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#012169"/><path d="M0 0L60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" stroke-width="3"/><path d="M30 0V40M0 20H60" stroke="#fff" stroke-width="13"/><path d="M30 0V40M0 20H60" stroke="#C8102E" stroke-width="8"/></svg>';
  function openSettings(onClose){
    const s=S();
    const m=modal(`<div class="mhead"><button class="roundbtn sm" data-a="x" aria-label="Back">${I.back}</button><h2>Settings</h2></div>
    <div class="list">
    <div class="sgroup"><div class="srow"><span class="si">${I.note}</span>Music${sw('music',s.music)}</div><div class="vrow"><input type="range" min="0" max="100" value="${Math.round(s.mvol*100)}" data-r="mvol" aria-label="Music volume"><b id="mv">${Math.round(s.mvol*100)}%</b></div></div>
    <div class="sgroup"><div class="srow"><span class="si">${I.spk}</span>Sound Effects${sw('sfx',s.sfx)}</div><div class="vrow"><input type="range" min="0" max="100" value="${Math.round(s.svol*100)}" data-r="svol" aria-label="Sound effects volume"><b id="sv">${Math.round(s.svol*100)}%</b></div></div>
    <div class="sgroup"><div class="srow"><span class="si">${I.mic}</span>Voice Announcements${sw('voice',s.voice)}</div><div class="vrow"><input type="range" min="0" max="100" value="${Math.round(s.vvol*100)}" data-r="vvol" aria-label="Voice volume"><b id="vv">${Math.round(s.vvol*100)}%</b></div>${Voice.usesFiles?'':'<p class="note">Uses your device speech engine (synthetic voice, not a human recording).</p>'}</div>
    <div class="srow"><span class="si">${I.vib}</span>Vibration${sw('vib',s.vib)}</div>
    <div class="sbox"><div class="shead"><span class="si">${I.gfx}</span>Graphics Quality</div><div class="seg" data-g="quality">${['low','medium','high'].map(q=>`<button class="${s.quality===q?'on':''}" data-v="${q}">${q[0].toUpperCase()+q.slice(1)}</button>`).join('')}</div><p class="note" id="qnote">${({low:'Low: fewer particles and lighter rendering.',medium:'Medium: balanced.',high:'High: full effects and sharper rendering.'})[s.quality]}</p></div>
    <div class="sbox"><div class="shead"><span class="si">${I.globe}</span>Language</div><div class="langrow"><span class="flag">${FLAG}</span><span>English</span><em class="chk">${I.check}</em></div><p class="note">English is the only language available in this version.</p></div>
    <div class="grid2"><button class="btn purple" data-a="priv">Privacy Policy</button><button class="btn blue" data-a="about">About</button></div>
    <h3 class="moreh">More options</h3>
    <div class="sbox"><div class="shead">Effects</div><div class="seg" data-g="fx">${['full','reduced'].map(q=>`<button class="${s.fx===q?'on':''}" data-v="${q}">${q[0].toUpperCase()+q.slice(1)}</button>`).join('')}</div></div>
    <div class="srow">Shape symbols on candies${sw('shapes',s.shapes)}</div>
    <div class="grid2"><button class="btn blue sm" data-a="tut">Replay Tutorial</button><button class="btn blue sm" data-a="help">Gameplay Help</button><button class="btn blue sm" data-a="sfx">Sound Effects</button><button class="btn blue sm" data-a="prof">Profile</button><button class="btn pink sm" data-a="shop">Boosters</button><button class="btn pink sm" data-a="ach">Achievements</button><button class="btn pink sm" data-a="quests">Daily Challenges</button></div>
    <button class="btn red sm wide" data-a="reset">Reset Progress</button></div>`,'settings');
    const stop=()=>{close(m);onClose&&onClose();};
    m.onclick=e=>{
      const t=e.target.closest('[data-t]');if(t){const k=t.dataset.t;s[k]=!s[k];t.classList.toggle('on',s[k]);t.setAttribute('aria-checked',s[k]);Store.save();
        if(k==='music'){Snd.unlock();Snd.syncMusic();}if(k==='voice'){if(s.voice){Snd.unlock();Voice.say('choice',true);}else Voice.stop();}if(k==='sfx'){Snd.apply();if(s.sfx){Snd.unlock();Snd.preview('click');}}if(k==='vib'&&s.vib&&navigator.vibrate)navigator.vibrate(40);
        if(k==='shapes')Game.relayout();return;}
      const sg=e.target.closest('.seg button');if(sg){const g=sg.parentNode.dataset.g;s[g]=sg.dataset.v;Store.save();$$('button',sg.parentNode).forEach(b=>b.classList.toggle('on',b===sg));Snd.play('click');FX.resize();Game.relayout();
        if(g==='quality')$('#qnote',m).textContent=({low:'Low: fewer particles and lighter rendering.',medium:'Medium: balanced.',high:'High: full effects and sharper rendering.'})[s.quality];return;}
      const a=e.target.closest('[data-a]');if(!a)return;
      const fn=({x:stop,lang(){toast('English is the only language in this version');},
        tut(){close(m);if(Game.state&&cur==='game')show('map');launch(1,true);},
        help:openHelp,sfx(){openSfx();},prof:openProfile,priv:openPrivacy,about:openAbout,shop:openShop,ach:openAch,quests:openQuests,
        reset(){confirmBox('Reset progress?','This permanently deletes your levels, stars, coins, boosters and stats on this device. Settings are kept.','Delete everything',()=>{const keep=Object.assign({},S());Store.reset();Object.assign(S(),keep);Store.save();mapBuilt=false;tickLives();toast('Progress reset');if(cur==='map')openMap();if(cur==='game')show('title');},true);}
      })[a.dataset.a];if(typeof fn==='function')fn();};
    m.addEventListener('input',e=>{const r=e.target.closest('[data-r]');if(!r)return;const v=+r.value/100;s[r.dataset.r]=v;$(({mvol:'#mv',svol:'#sv',vvol:'#vv'})[r.dataset.r],m).textContent=Math.round(v*100)+'%';Snd.apply();});
    m.addEventListener('change',e=>{const r=e.target.closest('[data-r]');if(!r)return;Store.save();if(r.dataset.r==='svol'){Snd.unlock();Snd.preview('match');}if(r.dataset.r==='vvol'){Snd.unlock();Voice.say('awesome',true);}});
  }
  /* ---------- sound effects screen ---------- */
  const SFXI={match:'<path fill="#fff" d="M12 2l3 6.500 7 .8-5.200 4.800 1.500 7L12 17.500 5.700 21l1.500-7L2 9.300l7-.8z"/>',blast:'<path fill="#fff" d="M12 1l2.500 6 6-2.500L18 11l5 1-5 1.500 2 6-6-2.500L12 23l-2-5.500-6 2 2-6L1 12l5-1-2-6 6 2.500z"/>',click:'<path fill="#fff" d="M9 3a2 2 0 014 0v8l2-1a2 2 0 012 2v2l1-1a2 2 0 012 2l-2 6H9l-4-7a2 2 0 013-2l1 1z"/>',life:'<path fill="#ff6a8a" d="M12 21C3 14.500 1.500 9.500 4 6.200c2.300-3 6.200-2.200 8 .8 1.800-3 5.700-3.800 8-.8 2.500 3.300 1 8.300-8 14.800z"/>',reward:'<rect x="3" y="9" width="18" height="12" rx="2" fill="#ff4a6a"/><rect x="10.500" y="6" width="3" height="15" fill="#ffd21a"/><path d="M12 6C8 6 6 2 9 2s3 4 3 4zm0 0c4 0 6-4 3-4s-3 4-3 4z" fill="#ffd21a"/>',booster:'<path fill="#ffd21a" d="M13 2L4 14h6l-1 8 10-13h-6z"/>',lose:'<circle cx="12" cy="12" r="10" fill="#cfe0ff"/><circle cx="8.500" cy="10" r="1.500" fill="#1a2f6a"/><circle cx="15.500" cy="10" r="1.500" fill="#1a2f6a"/><path d="M8 17c1-2 7-2 8 0" stroke="#1a2f6a" stroke-width="2" fill="none" stroke-linecap="round"/>'};
  SFXI.star=SFXI.match;SFXI.note='<path fill="#fff" d="M9 18V6l11-2v12a3 3 0 11-2-2.800V7.300L11 8.600V18a3 3 0 11-2-2.800z"/>';
  function openSfx(){
    const s=S(),rows=SFXN.slice(0,5).map(([k,label,snd,ic])=>`<div class="srow sfxr"><button class="sprev" data-p="${snd}" aria-label="Preview ${label}"><svg viewBox="0 0 24 24">${SFXI[ic]}</svg></button><span>${label}</span>${sw('sfx:'+k,s.sfxOn[k])}</div>`).join('');
    const m=modal(`<div class="mhead"><span class="hic">${I.note}</span><h2>Sound Effects</h2><button class="roundbtn sm" data-a="x" aria-label="Back" style="margin-left:auto">${I.back}</button></div>
      <div class="list">${rows}</div>
      <div class="sbox"><div class="shead">Sound Preview</div><div class="prev"><button class="roundbtn" data-a="play" aria-label="Play preview">${I.play}</button><div class="wave" id="wave">${Array.from({length:34},(_,i)=>`<i style="height:${20+Math.abs(Math.sin(i*1.7))*70}%"></i>`).join('')}</div></div></div><div class="srow volr"><span class="si">${I.spk}</span><input type="range" min="0" max="100" value="${Math.round(s.svol*100)}" data-r="svol" aria-label="Sound effects volume"><b id="sv">${Math.round(s.svol*100)}%</b></div>`,'settings sfxm');
    const wave=()=>{const w=$('#wave',m);w.classList.add('go');setTimeout(()=>w.classList.remove('go'),1400);};
    m.onclick=e=>{const t=e.target.closest('[data-t]');if(t){const k=t.dataset.t.split(':')[1];s.sfxOn[k]=!s.sfxOn[k];t.classList.toggle('on',s.sfxOn[k]);t.setAttribute('aria-checked',s.sfxOn[k]);Store.save();return;}
      const p=e.target.closest('[data-p]');if(p){Snd.unlock();Snd.preview(p.dataset.p);wave();return;}
      const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a==='x')close(m);else if(a.dataset.a==='play'){Snd.unlock();Snd.preview('match',3);setTimeout(()=>Snd.preview('win'),450);wave();}};
    m.addEventListener('input',e=>{const r=e.target.closest('[data-r]');if(!r)return;const v=+r.value/100;s[r.dataset.r]=v;$(({mvol:'#mv',svol:'#sv',vvol:'#vv'})[r.dataset.r],m).textContent=Math.round(v*100)+'%';Snd.apply();});
    m.addEventListener('change',e=>{if(e.target.closest('[data-r]'))Store.save();});
  }
  /* ---------- level selection list ---------- */
  function openLevels(){
    let count=Math.max(20,Store.d.unlocked+10);
    const m=modal('','settings lvl'),box=$('.mbox',m);
    const render=()=>{let rows='';for(let n=1;n<=count;n++){const L=Store.d.levels[n],lock=n>Store.d.unlocked;
      rows+=`<div class="lrow${lock?' lock':''}"><b class="lnum">${n}</b><div class="stars sm">${stars(L?L.stars:0)}</div>${lock?`<span class="llock">${I.lock}</span>`:`<button class="btn green sm" data-n="${n}">Play</button>`}</div>`;}
      box.innerHTML=`<div class="mhead"><button class="roundbtn sm" data-a="x" aria-label="Back">${I.back}</button><h2>Levels</h2></div><div class="lvlist">${rows}<button class="btn blue sm wide" data-a="more">Show more levels</button></div>`;};
    render();
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(a){if(a.dataset.a==='x')close(m);else{const y=$('.lvlist',m).scrollTop;count+=20;render();$('.lvlist',m).scrollTop=y;}return;}
      const b=e.target.closest('[data-n]');if(b){close(m);onNode(+b.dataset.n);}};
  }
  /* ---------- daily rewards ---------- */
  const DAILY=[{c:100},{c:200},{b:1,k:'striped'},{c:300},{b:2,k:'striped'},{c:500},{b:3,k:'bomb'}];   // same rewards as the reference image
  const BK=['hammer','striped','bomb','extra','hand'];
  function dailyState(){const d=Store.d.daily,t=Store.today();
    if(d.last===t)return {can:false,next:d.day};
    const nextDay=(d.last===Store.yesterday()&&d.day>0&&d.day<7)?d.day+1:1;return {can:true,next:nextDay};}
  function dailyLabel(r){return r.c?r.c:'x'+r.b;}
  function openDaily(){
    const st=dailyState(),claimedDay=st.can?(Store.d.daily.last===Store.yesterday()&&Store.d.daily.day<7?Store.d.daily.day:0):Store.d.daily.day;
    const tile=(i)=>{const r=DAILY[i],claimed=i+1<=claimedDay,isNext=st.can&&i+1===st.next;
      const ic=r.c?`<span class="ico">${I.coin}</span>`:`<img src="${Art.icon(r.k)}" alt="">`;
      return `<div class="dt${claimed?' got':''}${isNext?' next':''}${i===6?' d7':''}"><small>Day ${i+1}</small>${ic}<b>${i===6?'x'+r.b+' <em>Amazing Reward!</em>':dailyLabel(r)}</b>${claimed?`<i class="tick">${I.check}</i>`:''}</div>`;};
    const m=modal(`<div class="mhead"><span class="hic">${I.gift}</span><h2>Daily Rewards</h2><button class="roundbtn sm" data-a="x" style="margin-left:auto;background:radial-gradient(circle at 35% 30%,#ff9aa8,#e8283e)">${I.close}</button></div><div class="dgrid">${[0,1,2,3,4,5,6].map(tile).join('')}</div>
      <p class="mt sm">${st.can?`Day ${st.next} reward is ready. Come back every day to keep your streak.`:'You already claimed today. Come back tomorrow!'}</p>
      <button class="btn green big" data-a="claim" ${st.can?'':'disabled'}>${st.can?'Claim Day '+st.next:'Claimed'}</button><button class="btn blue sm" data-a="quests">Daily Challenges</button>`,'daily');
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a==='x'){close(m);return;}
      if(a.dataset.a==='quests'){close(m);openQuests();return;}
      if(a.dataset.a==='claim'){const s2=dailyState();if(!s2.can)return; // prevents double claim
        const d=Store.d.daily,day=s2.next,r=DAILY[day-1];d.day=day;d.last=Store.today();
        let msg='';if(r.c){Store.addCoins(r.c);msg=`+${r.c} coins`;}
        else if(r.b){Store.addBooster(r.k,r.b);msg='+'+r.b+' '+(r.k==='bomb'?'Color Bomb':'Striped Candy')+(r.b>1?'s':'');}
        Store.save();Snd.unlock();Snd.play('reward');Voice.say('choice');FX.confetti(80);toast(msg);tickLives();close(m);setTimeout(openDaily,260);if(cur==='title')refreshTitle();}};
  }
  /* ---------- other panels ---------- */
  function openLives(){
    if($('#nolives'))return;
    const m=modal(`<div class="brk big">${I.heart}</div><div class="ribbon">${Store.hasLife()?'Lives':'Out of Lives'}</div><p class="mt">Lives: <b class="livesN"></b> / ${Store.MAXLIVES}<br>Next life in <b class="nlT"></b></p>
      <button class="btn pink" data-a="fill">Refill · 100 ${I.coin}</button><button class="btn blue" data-a="x">Close</button>`,'small');m.id='nolives';
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a==='x')close(m);else if(Store.d.lives>=Store.MAXLIVES)toast('Lives are already full');else if(Store.spendCoins(100)){Store.refillLives();Snd.play('life');tickLives();close(m);}else toast('Not enough coins (need 100)');};
    tickLives();
  }
  function openMore(){
    const m=modal(`<button class="x" data-a="x">${I.close}</button><div class="ribbon">More Games</div><div class="pbox"><h3>MG Cowbell Games</h3><div class="gcard"><img src="${Art.icon('bomb')}" alt=""><div><b>MG Candy Blast</b><small>Match • Blast • Win! — you are playing it now</small></div></div><p class="mt sm">More MGCowbell / MGTECH games will be listed here when they are released. There is no online store inside this game.</p></div><button class="btn blue" data-a="about">About the developer</button>`,'small');
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;close(m);if(a.dataset.a==='about')openAbout();};
  }
  function openProfile(){
    const d=Store.d,st=d.stats;
    const m=modal(`<button class="x" data-a="x">${I.close}</button><div class="ribbon">Profile</div><label class="nick">Nickname<input id="nick" maxlength="14" value="${esc(d.name)}"></label>
      <div class="stats">${[['Highest unlocked level',d.unlocked],['Levels completed',Store.completed()],['Total stars',Store.totalStars()],['Best score',fmt(st.best)],['Total matches',fmt(st.matches)],['Special candies activated',fmt(st.specials)],['Levels won',st.won],['Levels replayed',st.replayed],['Coins',fmt(d.coins)]].map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join('')}</div><p class="mt sm">Everything stays on this device. No account needed.</p>`,'small');
    m.onclick=e=>{if(e.target.closest('[data-a]')){const n=$('#nick',m).value.trim();if(n)d.name=n.slice(0,14);Store.save();close(m);}};
  }
  function openPrivacy(){
    const m=modal(`<div class="mhead"><button class="roundbtn sm" data-a="x">${I.back}</button><h2>Privacy Policy</h2></div><div class="legal"><p>MG Candy Blast keeps your progress, settings and nickname only on your own device (browser LocalStorage).</p><p>The game has no accounts, no ads, no analytics and no online features. It does not send your data anywhere and does not collect personal information.</p><p>Clearing your browser data or using Reset Progress deletes the saved game.</p><p><small>This is a plain-language summary written by the developer. It has not been reviewed by a lawyer. If you publish the game in a store, check what that store requires.</small></p></div>`,'settings');
    m.onclick=e=>{if(e.target.closest('[data-a]'))close(m);};
  }
  let aboutTaps=0;
  function openAbout(){
    aboutTaps=0;
    const m=modal(`<div class="mhead"><button class="roundbtn sm" data-a="x">${I.back}</button><h2>About</h2></div><div class="aboutLogo" data-a="logo"><img src="${HOME_IMG}" alt="MG Candy Blast"></div>
      <div class="legal c"><p><b>MG CANDY BLAST</b></p><p>Developed by <b>MG Cowbell</b><br>Brand: MGCowbell / MGTECH</p><p>“Match • Blast • Win!”</p><p>Email: <a href="mailto:mgcowbell@gmail.com">mgcowbell@gmail.com</a><br>Phone: <a href="tel:0539512387">0539512387</a><br>Country: Ghana</p><p><small>Version 1.0 · Works offline once loaded</small></p></div>`,'settings');
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a==='x')close(m);else if(++aboutTaps>=5){close(m);openDev();}};
  }
  function openHelp(){
    const m=modal(`<div class="mhead"><button class="roundbtn sm" data-a="x">${I.back}</button><h2>How to Play</h2></div><div class="legal"><p><b>Swap</b> two neighbouring candies (tap one, tap the next — or drag) to line up 3 or more of the same kind.</p><p><b>Match 4</b> makes a Striped Candy that clears a row or column. <b>Match 5</b> in a line makes a Color Bomb. An <b>L or T</b> shape makes a Wrapped Candy that explodes. Swap two specials together for huge blasts!</p><p><b>Goals</b> are shown at the top: reach a score, collect candies, clear jelly, smash chocolate or create special candies. Finish before your moves run out.</p><p><b>Blockers</b>: wooden boxes and crates break after the shown number of hits when you match next to them. Frozen candies thaw the same way. Stone is immovable (Hammer, Area Bomb or Row Blaster can break it). Chocolate disappears when you match next to it.</p><p><b>Boosters</b>: Hammer smashes one tile, Striped and Color Bomb turn a candy into that special, Hand gives one free swap, Extra Moves adds 5 moves.</p><p><b>Keyboard</b>: arrows move, Enter selects, arrow swaps, keys 1–5 use boosters, Esc pauses.</p></div>`,'settings');
    m.onclick=e=>{if(e.target.closest('[data-a]'))close(m);};
  }
  /* ---------- tutorial ---------- */
  const TUT=[['#boardArea','Pick a candy','Tap a candy to select it. It will glow.'],['#boardArea','Swap neighbours','Tap an adjacent candy, or just drag, to swap them.'],['#boardArea','Match three','Line up 3 or more of the same candy to pop them. Bigger matches make special candies!'],['#scoreRow','Score','Every candy you pop adds points. Fill the star bar for up to 3 stars.'],['#hud','Objectives','Your goal and remaining moves are up here. Finish the goal before moves run out.'],['#boostBar','Boosters','Stuck? Tap a booster, then use it on the board. You start with a few free ones.']];
  function tutorial(){
    if($('#tut'))return;let i=0;const el=document.createElement('div');el.id='tut';el.innerHTML='<div class="spot"></div><div class="tcard"><h3></h3><p></p><div class="row"><button class="btn blue sm" data-a="skip">Skip</button><button class="btn green sm" data-a="next">Next</button></div></div>';$('#app').appendChild(el);
    Game.setPaused(true);
    const step=()=>{const [sel,t,p]=TUT[i],r=$(sel).getBoundingClientRect(),a=$('#app').getBoundingClientRect(),sp=$('.spot',el);
      Object.assign(sp.style,{left:r.left-a.left-6+'px',top:r.top-a.top-6+'px',width:r.width+12+'px',height:r.height+12+'px'});
      $('h3',el).textContent=`${i+1}/${TUT.length}  ${t}`;$('p',el).textContent=p;$('[data-a=next]',el).textContent=i===TUT.length-1?'Got it!':'Next';
      const c=$('.tcard',el);c.style.top=(r.top-a.top>a.height*.5)?'14%':'auto';c.style.bottom=(r.top-a.top>a.height*.5)?'auto':'6%';};
    const end=()=>{el.remove();Game.setPaused(false);S().tutorialDone=true;Store.save();};
    el.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a==='skip')end();else if(++i>=TUT.length)end();else step();};
    step();
  }
  /* ---------- developer / test menu ---------- */
  function openDev(){
    const d=Store.d;
    const m=modal(`<div class="mhead"><button class="roundbtn sm" data-a="x">${I.back}</button><h2>Test Menu</h2></div><div class="legal"><p><small>${Store.dev?'TEST MODE is ON. Changes here are stored in a separate sandbox save and never touch your real progress.':'Entering test mode copies your save to a sandbox. Your real save stays untouched until you exit.'}</small></p></div>
      <div class="list">${Store.dev?`<div class="grid2"><button class="btn blue sm" data-a="unl">Unlock all levels</button><button class="btn blue sm" data-a="coins">+1000 coins</button><button class="btn blue sm" data-a="boost">+5 each booster</button><button class="btn blue sm" data-a="lives">Lives: ${d.settings.noLives?'unlimited (on)':'normal'}</button><button class="btn blue sm" data-a="win">Instant win</button><button class="btn blue sm" data-a="lose">Instant lose</button></div>
      <div class="srow">Play level <input id="devN" type="number" min="1" max="100" value="1" class="num"><button class="btn green sm" data-a="lv">Go</button></div>
      <div class="grid2">${['click','swap','match','invalid','special','blast','combo','booster','star','win','lose','reward','life'].map(s=>`<button class="btn purple sm" data-s="${s}">${s}</button>`).join('')}</div>
      <button class="btn blue sm wide" data-a="chk">Run self-check (all 100 levels)</button><pre id="devOut" class="out"></pre><button class="btn red sm wide" data-a="exit">Exit test mode (restore real save)</button>`:`<button class="btn green wide" data-a="enter">Enter test mode</button>`}</div>`,'settings');
    m.onclick=e=>{const sb=e.target.closest('[data-s]');if(sb){Snd.unlock();Snd.preview(sb.dataset.s,3);return;}
      const a=e.target.closest('[data-a]');if(!a)return;const k=a.dataset.a;
      if(k==='x'){close(m);return;}
      if(k==='enter'){Store.enterDev();tickLives();close(m);openDev();return;}
      if(k==='exit'){Store.exitDev();mapBuilt=false;close(m);closeAll();show('title');tickLives();toast('Real save restored');return;}
      if(k==='unl'){d.unlocked=100;Store.save();toast('All levels unlocked (sandbox)');}
      if(k==='coins'){Store.addCoins(1000);tickLives();}
      if(k==='boost'){BK.forEach(b=>Store.addBooster(b,5));toast('+5 boosters');}
      if(k==='lives'){d.settings.noLives=!d.settings.noLives;Store.save();close(m);tickLives();openDev();}
      if(k==='win'){close(m);if(Game.state)Game.devWin();else toast('Start a level first');}
      if(k==='lose'){close(m);if(Game.state)Game.devLose();else toast('Start a level first');}
      if(k==='lv'){const n=Math.min(100,Math.max(1,+$('#devN',m).value|0));d.unlocked=Math.max(d.unlocked,n);close(m);launch(n);}
      if(k==='chk'){let bad=0,txt='';for(let n=1;n<=100;n++){const L=LEVELS[n],b=new Engine.Board(L,Engine.mulberry(n));const ok=b.fill()&&!b.findMatches().set.size&&!!b.findMove();if(!ok){bad++;txt+='L'+n+' FAIL\n';}}$('#devOut',m).textContent=bad?txt:'All 100 levels generate a playable board (no start matches, at least one move).';}};
  }
  /* ---------- achievements ---------- */
  const ACH=[
    ['first','First Win','Win your first level',()=>Store.d.stats.won,1,50],['win10','Candy Rookie','Win 10 levels',()=>Store.d.stats.won,10,150],
    ['win50','Candy Pro','Win 50 levels',()=>Store.d.stats.won,50,400],['win200','Candy Legend','Win 200 levels',()=>Store.d.stats.won,200,1000],
    ['star30','Star Collector','Collect 30 stars',()=>Store.totalStars(),30,150],['star150','Star Hoarder','Collect 150 stars',()=>Store.totalStars(),150,500],
    ['m100','Matcher','Make 100 matches',()=>Store.d.stats.matches,100,100],['m1000','Match Master','Make 1,000 matches',()=>Store.d.stats.matches,1000,300],
    ['sp25','Special Touch','Activate 25 special candies',()=>Store.d.stats.specials,25,100],['sp250','Blast Master','Activate 250 special candies',()=>Store.d.stats.specials,250,300],
    ['lv25','Explorer','Reach level 25',()=>Store.d.unlocked,25,200],['lv100','Centurion','Reach level 100',()=>Store.d.unlocked,100,600],
    ['three10','Perfectionist','Earn 3 stars on 10 levels',()=>Object.keys(Store.d.levels).filter(k=>Store.d.levels[k].stars>=3).length,10,250],
    ['score10k','High Scorer','Score 10,000 in one level',()=>Store.d.stats.best,10000,150],['score50k','Sugar Rush','Score 50,000 in one level',()=>Store.d.stats.best,50000,400],
    ['rich','Candy Banker','Hold 2,000 coins',()=>Store.d.coins,2000,100],
    ['w2','World Traveller','Reach World 2 (level 51)',()=>Store.d.unlocked,51,150],['w5','Candy Explorer','Reach World 5 (level 201)',()=>Store.d.unlocked,201,400],['w10','Kingdom Hopper','Reach World 10 (level 451)',()=>Store.d.unlocked,451,800],['w20','Ultimate Kingdom','Reach World 20 (level 951)',()=>Store.d.unlocked,951,2000],
    ['boxes','Box Breaker','Break 50 boxes or crates',()=>Store.d.stats.blocks||0,50,200]];
  const annAch={};
  function announceAch(){const n=ACH.filter(a=>!Store.d.achv[a[0]]&&!annAch[a[0]]&&a[3]()>=a[4]);if(!n.length)return;n.forEach(a=>{annAch[a[0]]=1;});Snd.play('achv');Msg.badge('Achievement Unlocked!',n[0][1]+(n.length>1?' +'+(n.length-1)+' more':''));Voice.say('achv',true);}
  function achReady(){return ACH.filter(a=>!Store.d.achv[a[0]]&&a[3]()>=a[4]).length;}
  function openAch(){
    const m=modal('',''),box=$('.mbox',m);
    const render=()=>{box.innerHTML=`<button class="x" data-a="x">${I.close}</button><div class="ribbon">Achievements</div><div class="alist">${ACH.map(a=>{const p=Math.min(a[4],a[3]()),done=!!Store.d.achv[a[0]],can=!done&&p>=a[4];
      return `<div class="arow${done?' got':''}"><div class="ai">${I.trophy}</div><div class="at"><b>${a[1]}</b><small>${a[2]}</small><div class="abar"><i style="width:${Math.round(p/a[4]*100)}%"></i></div><small>${fmt(p)} / ${fmt(a[4])}</small></div>${done?`<span class="ok">${I.check}</span>`:`<button class="btn ${can?'green':'blue'} sm" data-c="${a[0]}" ${can?'':'disabled'}>${a[5]} ${I.coin}</button>`}</div>`;}).join('')}</div>`;};
    render();
    m.onclick=e=>{if(e.target.closest('[data-a=x]')){close(m);return;}const c=e.target.closest('[data-c]');if(!c)return;const a=ACH.find(x=>x[0]===c.dataset.c);
      if(a&&!Store.d.achv[a[0]]&&a[3]()>=a[4]){Store.d.achv[a[0]]=1;Store.addCoins(a[5]);Store.save();Snd.unlock();Snd.play('coin');FX.confetti(40);tickLives();toast(`+${a[5]} coins`);render();}};
  }
  /* ---------- boosters screen / shop (in-game coins only) ---------- */
  const SHOP=[['hammer','Hammer','Smash a candy or any blocker',60],['striped','Striped Candy','Turn a candy into a striped candy',80],['bomb','Color Bomb','Turn a candy into a color bomb',100],['extra','Extra Moves','+5 moves',70],['hand','Hand','One free swap',60],['shuffle','Shuffle','Rearrange the board',50],['rowblast','Row Blaster','Clear one row',90],['areabomb','Area Bomb','Clear a 3x3 area',110]];
  function openShop(){
    const m=modal('',''),box=$('.mbox',m),ic=Game.boostIcons();
    const render=()=>{const dd=dailyState().can,sp=Store.d.spin!==Store.today();
      box.innerHTML=`<div class="mhead"><span class="hic bl">${I.bolt}</span><h2>Boosters</h2><button class="roundbtn sm" data-a="x" aria-label="Close" style="margin-left:auto;background:radial-gradient(circle at 35% 30%,#ff9aa8,#e8283e)">${I.close}</button></div>
      <div class="bgrid">${SHOP.map(([k,n,d,p])=>`<button class="bcard" data-b="${k}" data-p="${p}" aria-label="Buy ${n} for ${p} coins"><b>${n}</b><span class="bic">${ic[k]}<i class="qty">${Store.d.boosters[k]}</i></span><small class="price">Buy ${p} <span class="ci">${I.coin}</span></small></button>`).join('')}</div>
      <div class="sbox"><h3>Other Features</h3><div class="ofeat"><button data-a="daily"><span class="oi2">${I.gift}${dd?'<em></em>':''}</span><small>Daily<br>Rewards</small></button><button data-a="spin"><span class="oi2">${I.coin}${sp?'<em></em>':''}</span><small>Free<br>Coins</small></button><button data-a="offline"><span class="oi2">${I.wifi}</span><small>Offline<br>Play</small></button><button data-a="ach"><span class="oi2">${I.trophy}</span><small>Achieve-<br>ments</small></button></div></div>
      <p class="coinline">Your coins: <b>${fmt(Store.d.coins)}</b> ${I.coin}</p><button class="btn green sm wide" data-a="lives">Refill Lives · 100 ${I.coin}</button><p class="mt sm">Coins are earned by playing. Nothing here costs real money.</p>`;};
    render();
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(a){const k=a.dataset.a;if(k==='x')close(m);else if(k==='daily'){close(m);openDaily();}else if(k==='spin'){close(m);openSpin();}else if(k==='ach'){close(m);openAch();}else if(k==='offline')toast('MG Candy Blast works without internet once it is loaded.');
        else if(k==='lives'){if(Store.d.lives>=Store.MAXLIVES)toast('Lives are already full');else if(Store.spendCoins(100)){Store.refillLives();Snd.play('life');tickLives();render();}else toast('Not enough coins');}return;}
      const b=e.target.closest('[data-b]');if(b){const p=+b.dataset.p;if(Store.d.boosters[b.dataset.b]>=99){toast('You already have the maximum');return;}if(Store.spendCoins(p)){Store.addBooster(b.dataset.b,1);Snd.unlock();Snd.play('booster');Voice.say('choice');tickLives();render();}else{toast('Not enough coins');Snd.play('invalid');}}};
  }
  /* ---------- lucky spin (free once a day, in-game prizes) ---------- */
  const SPIN=[{t:'c',v:50,l:'50'},{t:'b',v:'hammer',l:'Hammer'},{t:'c',v:100,l:'100'},{t:'b',v:'striped',l:'Striped'},{t:'c',v:200,l:'200'},{t:'b',v:'bomb',l:'Bomb'},{t:'c',v:75,l:'75'},{t:'b',v:'hand',l:'Hand'}];
  function openSpin(){
    const cols=['#ff6fb5','#ffd21a','#5ad1ff','#7dff4a','#c24ff0','#ff8f1f','#ff4a6a','#4aa8ff'];
    const grad=cols.map((c,i)=>`${c} ${i*45}deg ${(i+1)*45}deg`).join(',');
    const m=modal(`<button class="x" data-a="x">${I.close}</button><div class="ribbon">Lucky Spin</div><div class="wheelWrap"><div class="ptr"></div><div class="wheel" id="wheel" style="background:${cols[0]};background:conic-gradient(${grad})">${SPIN.map((p,i)=>`<span style="transform:rotate(${i*45+22.5}deg) translateY(-82px)">${p.l}</span>`).join('')}</div></div><p class="mt sm" id="spMsg">One free spin every day. Prizes are in-game coins and boosters.</p><button class="btn green big" data-a="spin" id="spBtn">Spin!</button>`,'small');
    const btn=$('#spBtn',m),upd=()=>{const ok=Store.d.spin!==Store.today();btn.disabled=!ok;btn.textContent=ok?'Spin!':'Come back tomorrow';};upd();
    m.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a==='x'){close(m);return;}
      if(Store.d.spin===Store.today())return;Snd.unlock();
      const idx=Math.floor(Math.random()*SPIN.length),pz=SPIN[idx];Store.d.spin=Store.today();
      if(pz.t==='c')Store.addCoins(pz.v);else Store.addBooster(pz.v,1);Store.save();upd();
      const w=$('#wheel',m),rot=360*5+(360-(idx*45+22.5));w.style.transition=S().fx==='reduced'?'none':'transform 4s cubic-bezier(.15,.7,.1,1)';w.style.transform=`rotate(${rot}deg)`;
      Snd.play('click');const msg=pz.t==='c'?`You won ${pz.v} coins!`:`You won a ${pz.l} booster!`;
      setTimeout(()=>{$('#spMsg',m).textContent=msg;Snd.play('reward');FX.confetti(60);tickLives();},S().fx==='reduced'?50:4200);};
  }
  /* ---------- boot ---------- */
  /* ---------- daily challenges (real tracked progress) ---------- */
  function openQuests(){
    const m=modal('','settings'),box=$('.mbox',m);
    const render=()=>{const qs=Store.dayQuests();
      box.innerHTML=`<div class="mhead"><span class="hic">${I.star}</span><h2>Daily Challenges</h2><button class="roundbtn sm" data-a="x" style="margin-left:auto" aria-label="Back">${I.back}</button></div><p class="mt sm">Progress comes from your real games today. New challenges tomorrow.</p><div class="alist">${qs.map(q=>{const p=Math.min(q.goal,Store.questProg(q.id)),done=Store.d.dq.claimed[q.id],can=!done&&p>=q.goal;
        return `<div class="arow${done?' got':''}"><div class="at"><b>${q.txt}</b><div class="abar"><i style="width:${Math.round(p/q.goal*100)}%"></i></div><small>${fmt(p)} / ${fmt(q.goal)}</small></div>${done?`<span class="ok">${I.check}</span>`:`<button class="btn ${can?'green':'blue'} sm" data-c="${q.id}" ${can?'':'disabled'}>${q.reward} ${I.coin}</button>`}</div>`;}).join('')}</div>`;};
    render();
    m.onclick=e=>{if(e.target.closest('[data-a=x]')){close(m);return;}const c=e.target.closest('[data-c]');if(c){const r=Store.questClaim(c.dataset.c);if(r){Snd.unlock();Snd.play('coin');FX.confetti(30);tickLives();toast('+'+r+' coins');render();}}};
  }
  /* ---------- boot / loading screen (indeterminate bar, rotating messages, error + Retry) ---------- */
  function boot(){
    const ld=$('#loading'),tx=$('.ltxt',ld),er=$('.lerr',ld),bar=$('.lbar i',ld);
    
    const MSG=['Preparing Your Candy Adventure...','Mixing the Magic...','Getting the Candies Ready...','Entering Candy World...'];
    $('#lretry').onclick=()=>location.reload();
    let welcomed=false;
    const steps=[
      ()=>{Store.load();FX.init($('#fx'),null);},
      ()=>{ld.querySelector('.lbg').style.backgroundImage=`url(${bg('t',360,640,1,'sky',3,1.4)})`;},
      ()=>{$('.lcandy',ld).innerHTML=[0,1,2,3,4,5].map(t=>`<img src="${Art.icon(t)}" alt="">`).join('');},
      ()=>{buildTitle();},
      ()=>{['bomb','striped','choc','jelly','wrapped','box','crate','ice','stone'].forEach(k=>Art.icon(k));},
      ()=>{bg('g1',360,640,1,'sky',21,1.2);},
      ()=>{
        if(/[?&#]dev\b/.test(location.search+location.hash)){setTimeout(openDev,400);}
        document.addEventListener('pointerdown',e=>{
          if(e.target.closest('.btn,.roundbtn,.node,.wbtn,.sw,.seg button,.bb,.pill,.sprev,.chip,.bcard,.ofeat button,.langrow')){Snd.unlock();if(!e.target.closest('.bb,.node'))Snd.play('click');}
          if(!welcomed&&cur==='title'){welcomed=true;Snd.unlock();Voice.say('welcome',true);if(dailyState().can)setTimeout(()=>{if(cur==='title')Voice.say('daily');},2800);}
        },true);
        document.addEventListener('contextmenu',e=>{if(e.target.closest('#app'))e.preventDefault();});
        // Android back button: close the top dialog, pause a level, go map -> menu; on the menu press twice to leave
        try{history.pushState({mg:1},'');}catch(err){}
        let exitArmed=0;
        window.addEventListener('popstate',()=>{
          const mods=$$('#modals .modal'),tut=$('#tut');
          if(tut){try{history.pushState({mg:1},'');}catch(err){}tut.querySelector('[data-a=skip]').click();return;}
          if(mods.length){try{history.pushState({mg:1},'');}catch(err){}
            const top=mods[mods.length-1];
            if(top.classList.contains('win')||top.classList.contains('lose')){toast('Choose an option to continue');return;}
            const x=top.querySelector('[data-a=x]')||top.querySelector('[data-a=res]')||top.querySelector('[data-a=no]');if(x)x.click();else close(top);return;}
          if(cur==='game'){try{history.pushState({mg:1},'');}catch(err){}if(Game.state&&!Game.state.ended)openPause();return;}
          if(cur==='map'){try{history.pushState({mg:1},'');}catch(err){}show('title');return;}
          if(Date.now()-exitArmed<2000){history.back();return;}   // second press: leave
          exitArmed=Date.now();try{history.pushState({mg:1},'');}catch(err){}toast('Press back again to exit');
        });
        document.addEventListener('visibilitychange',()=>{if(document.hidden&&cur==='game'&&Game.state&&!Game.state.ended&&!$('#modals .modal')&&!$('#tut'))openPause();});
        if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){navigator.serviceWorker.register('service-worker.js').catch(()=>{});}
      },
      ()=>{show('title');}
    ];
    let i=0;
    const fail=e=>{window.__mgFail?window.__mgFail('Could not start the game: '+((e&&e.message)||e)+'.'):0;};
    const next=()=>{
      if(i>=steps.length){window.__mgReady=true;ld.classList.add('done');setTimeout(()=>{if(ld.parentNode)ld.parentNode.removeChild(ld);},500);return;}
      try{steps[i++]();}catch(e){fail(e);return;}
      const pct=Math.round(i/steps.length*100);bar.style.setProperty('--p',pct+'%');tx.textContent='Loading... '+pct+'%';   // share of real start-up steps completed
      setTimeout(next,i===steps.length?40:70);
    };
    setTimeout(next,30);
  }
  return {boot,toast,show,launch};
})();
(function(){function go(){try{UI.boot();}catch(e){window.__mgErr&&window.__mgErr('Start-up error: '+(e&&e.message||e));}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
