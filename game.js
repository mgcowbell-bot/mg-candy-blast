/* MG Candy Blast - gameplay: board rendering, input, animations, boosters, objectives */
const Game=(()=>{
  const $=s=>document.querySelector(s);
  const S=()=>Store.d.settings;
  const BOMB=Engine.BOMB;
  let cv,ctx,dpr=1,cell=40,P=6,sprites=null,sKey='',G=null,tokc=0,raf=0,last=0,running=false,hintTimer=0,kb=null,ptr=null;
  const tw=[],cb={win(){},lose(){},tutorial(){}};
  const ease={out:p=>1-Math.pow(1-p,3),back:p=>{const c=1.5,q=p-1;return 1+(c+1)*q*q*q+c*q*q;},lin:p=>p,fall:p=>{const q=p-1;return 1+2.2*q*q*q+1.2*q*q;}};
  function tween(ms,fn,e=ease.out){return new Promise(res=>{tw.push({t:0,ms:Math.max(1,ms),fn,e,res});});}
  const wait=ms=>tween(ms,()=>{},ease.lin);
  function stepTw(dt){for(let i=tw.length-1;i>=0;i--){const a=tw[i];a.t+=dt;const p=Math.min(1,a.t/a.ms);a.fn(a.e(p));if(p>=1){tw.splice(i,1);a.res();}}}
  function flushTw(){while(tw.length){const a=tw.pop();try{a.fn(1);}catch(e){}a.res();}}
  const vib=n=>{if(S().vib&&navigator.vibrate)try{navigator.vibrate(n);}catch(e){}};

  function init(){
    cv=$('#board');ctx=cv.getContext('2d');
    cv.addEventListener('pointerdown',pDown);cv.addEventListener('pointermove',pMove);cv.addEventListener('pointerup',pUp);cv.addEventListener('pointercancel',()=>{ptr=null;});
    cv.addEventListener('contextmenu',e=>e.preventDefault());
    addEventListener('resize',()=>relayout());addEventListener('orientationchange',()=>setTimeout(relayout,250));
    document.addEventListener('keydown',onKey);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&running&&!raf){last=performance.now();raf=requestAnimationFrame(frame);}});
    FX.init($('#fx'),$('#boardWrap'));
  }
  /* ------------ lifecycle ------------ */
  function start(n){
    const L=LEVELS[n];if(!L)return false;
    flushTw();clearTimeout(hintTimer);
    const b=new Engine.Board(L,Engine.mulberry((Date.now()&0xffffff)+n*131));b.fill();
    G={n,L,b,moves:L.moves,score:0,shown:0,collect:Object.assign({},L.collect),special:L.special,busy:true,sel:null,mode:null,hand:false,extraUsed:0,ended:false,paused:false,tok:++tokc,ghosts:[],hint:null,hintT:0,time:0};
    b.g.forEach((row,r)=>row.forEach((x,c)=>{if(x){x.px=c;x.py=r-b.rows-1-((c+r)%4)*.3;x.sc=1;x.al=1;x.fl=0;}}));
    kb=null;ptr=null;
    $('#boardArea').dataset.world=L.theme;
    relayout();updateHUD();buildBoostBar();
    return true;
  }
  async function intro(){
    const g=G,tok=g.tok;g.busy=true;Snd.play('start');Voice.say('start');
    const cells=[];g.b.g.forEach((row,r)=>row.forEach((x,c)=>{if(x)cells.push({x,from:x.py,to:r,d:(g.b.rows-r)*40+c*18});}));
    let t=0;await tween(900,p=>{t=p*900;cells.forEach(o=>{const k=Math.min(1,Math.max(0,(t-o.d*.5)/450));o.x.py=o.from+(o.to-o.from)*ease.fall(k);});},ease.lin);
    if(g.tok!==tok)return;cells.forEach(o=>{o.x.py=o.to;});g.busy=false;scheduleHint();
    if(g.n===1&&!S().tutorialDone)cb.tutorial();
  }
  function show(){running=true;last=performance.now();if(!raf)raf=requestAnimationFrame(frame);}
  function leave(){running=false;cancelAnimationFrame(raf);raf=0;flushTw();clearTimeout(hintTimer);if(G){G.tok=++tokc;G.busy=true;}FX.clear();}
  function frame(ts){
    raf=0;if(!running||document.hidden)return;
    const dt=Math.min(40,ts-last);last=ts;stepTw(dt);
    if(G){G.time+=dt;if(G.shown<G.score){G.shown=Math.min(G.score,G.shown+Math.max(3,Math.ceil((G.score-G.shown)*.12)));$('#hScore').textContent=G.shown.toLocaleString();updateStarBar();}
      if(G.hint){G.hintT+=dt;}
      // watchdog: if the game says it is busy but nothing is animating for 8 s, unlock input instead of freezing
      if(G.busy&&!G.ended&&!tw.length){G.idleBusy=(G.idleBusy||0)+dt;if(G.idleBusy>8000){G.idleBusy=0;console.warn('MG Candy Blast: input watchdog released a stuck state');recover('watchdog');}}else G.idleBusy=0;
      draw(ts);}
    raf=requestAnimationFrame(frame);
  }
  /* ------------ layout & render ------------ */
  function relayout(){
    if(!G||!cv)return;const area=$('#boardArea'),aw=area.clientWidth,ah=area.clientHeight;if(aw<20||ah<20)return;
    const {cols,rows}=G.L;cell=Math.max(24,Math.floor(Math.min((aw-6)/(cols+.3),(ah-6)/(rows+.3))));P=Math.round(cell*.15);
    const w=cell*cols+2*P,h=cell*rows+2*P,q=S().quality;dpr=Math.min(window.devicePixelRatio||1,q==='high'?2:q==='medium'?1.5:1);
    cv.style.width=w+'px';cv.style.height=h+'px';cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);
    const key=[cell,dpr,S().shapes].join('|');if(key!==sKey){sprites=Art.build(cell*1.12,dpr,S().shapes);sKey=key;}
  }
  function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
  function spr(o,key,pulse){
    const s=cell*1.12*(o.sc||0)*(pulse||1);if(s<=0.5||!sprites[key])return;
    ctx.globalAlpha=o.al===undefined?1:Math.max(0,o.al);ctx.drawImage(sprites[key],P+o.px*cell+cell/2-s/2,P+o.py*cell+cell/2-s/2,s,s);
    if(o.fl>0&&S().quality!=='low'){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,o.fl);ctx.drawImage(sprites[key],P+o.px*cell+cell/2-s/2,P+o.py*cell+cell/2-s/2,s,s);ctx.globalCompositeOperation='source-over';}
    ctx.globalAlpha=1;
  }
  function draw(ts){
    const g=G,b=g.b,c=ctx,{cols,rows}=g.L,W=cell*cols+2*P,H=cell*rows+2*P,q=S().quality;
    c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
    const gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#143a86');gr.addColorStop(1,'#0a2058');
    rrect(c,1.5,1.5,W-3,H-3,cell*.3);c.fillStyle=gr;c.fill();c.lineWidth=3;c.strokeStyle='#4aa8ff';c.stroke();if(q!=='low'){c.lineWidth=1.5;c.strokeStyle='rgba(190,225,255,.55)';rrect(c,4,4,W-8,H-8,cell*.27);c.stroke();}
    for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){
      if(b.wall(r,k)){c.fillStyle='#10285f';rrect(c,P+k*cell+2,P+r*cell+2,cell-4,cell-4,7);c.fill();continue;}
      c.fillStyle=(r+k)%2?'#1a3f8e':'#163679';rrect(c,P+k*cell+1.5,P+r*cell+1.5,cell-3,cell-3,7);c.fill();if(q!=='low'){c.fillStyle='rgba(255,255,255,.08)';c.fillRect(P+k*cell+5,P+r*cell+3,cell-10,2);c.fillStyle='rgba(0,0,25,.28)';c.fillRect(P+k*cell+5,P+r*cell+cell-5,cell-10,2);}
      const j=b.jelly[r][k];if(j>0){rrect(c,P+k*cell+2,P+r*cell+2,cell-4,cell-4,7);c.fillStyle=j>1?'rgba(150,235,255,.7)':'rgba(130,225,255,.38)';c.fill();c.lineWidth=j>1?3:1.5;c.strokeStyle='rgba(215,248,255,.9)';c.stroke();}
    }
    for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const bk=b.blockerAt(r,k);if(!bk||bk==='ice')continue;
      let key='choc',hp=0;if(bk==='box'){hp=b.box[r][k];key='box'+Math.min(2,Math.max(0,b.boxMax[r][k]-hp));}else if(bk==='crate'){hp=b.crate[r][k];key='crate'+Math.min(3,Math.max(0,b.crateMax[r][k]-hp));}else if(bk==='stone')key='stone';
      spr({px:k,py:r,sc:.92,al:1},key);
      if(hp>1){const cx=P+k*cell+cell*.8,cy=P+r*cell+cell*.8;c.fillStyle='rgba(10,20,50,.85)';c.beginPath();c.arc(cx,cy,cell*.17,0,7);c.fill();c.fillStyle='#fff';c.font='bold '+Math.round(cell*.22)+'px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(hp,cx,cy+1);}}
    c.save();rrect(c,P*.5,P*.5,W-P,H-P,cell*.2);c.clip();
    const selI=g.sel!=null?g.sel:-1,hintOn=g.hint&&!g.busy&&!g.paused;
    let top=null;
    for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const x=b.g[r][k];if(!x)continue;const i=r*cols+k;
      if(i===selI){top=x;continue;}
      let p=1;if(hintOn&&(i===g.hint[0]||i===g.hint[1])){p=1+.1*Math.abs(Math.sin(g.hintT/260));}
      if(x.s&&q!=='low'){c.globalAlpha=.25+.2*Math.sin(ts/220+i);c.fillStyle=x.s==='b'?'#ffe9a0':'#fff';c.beginPath();c.arc(P+x.px*cell+cell/2,P+x.py*cell+cell/2,cell*.5*x.sc,0,7);c.fill();c.globalAlpha=1;}
      spr(x,Art.key(x),p);}
    if(top){const p=1+.1*Math.sin(ts/120);c.lineWidth=3;c.strokeStyle='#fff';rrect(c,P+top.px*cell+2,P+top.py*cell+2,cell-4,cell-4,8);c.stroke();spr(top,Art.key(top),p);}
    g.ghosts.forEach(o=>spr(o,o.k||Art.key(o)));
    for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const h=b.ice[r][k];if(h>0){spr({px:k,py:r,sc:.98,al:1},'ice'+Math.min(3,h));if(h>1){const cx=P+k*cell+cell*.8,cy=P+r*cell+cell*.8;c.fillStyle='rgba(10,50,90,.85)';c.beginPath();c.arc(cx,cy,cell*.17,0,7);c.fill();c.fillStyle='#fff';c.font='bold '+Math.round(cell*.22)+'px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(h,cx,cy+1);}}}
    c.restore();
    if(kb){c.lineWidth=3;c.strokeStyle='#ffe14a';rrect(c,P+kb.c*cell+1,P+kb.r*cell+1,cell-2,cell-2,8);c.stroke();}
    if(g.mode&&g.mode!=='hand'){c.fillStyle='rgba(255,230,80,.07)';rrect(c,1.5,1.5,W-3,H-3,cell*.3);c.fill();}
  }
  /* ------------ HUD ------------ */
  function objItems(){
    const g=G,L=g.L,out=[];
    if(L.obj.includes('score'))out.push({img:Art.icon('3'),txt:L.score.toLocaleString(),key:'score',done:g.score>=L.score,label:'pts'});
    for(const t in g.collect)out.push({img:Art.icon(t),txt:Math.max(0,g.collect[t]),done:g.collect[t]<=0});
    if(L.obj.includes('jelly')){const n=g.b.count().jelly;out.push({img:Art.icon('jelly'),txt:n,done:n===0});}
    if(L.obj.includes('choc')){const n=g.b.count().choc;out.push({img:Art.icon('choc'),txt:n,done:n===0});}
    ['box','crate','ice'].forEach(k=>{if(L.obj.includes(k)){const n=g.b.count()[k];out.push({img:Art.icon(k),txt:n,done:n===0});}});
    if(L.obj.includes('special')){out.push({img:Art.icon('striped'),txt:Math.max(0,g.special),done:g.special<=0});}
    return out;
  }
  function updateHUD(){
    if(!G)return;$('#hMoves').textContent=G.moves;
    $('#hObj').innerHTML=objItems().map(o=>`<span class="oi${o.done?' ok':''}"><img src="${o.img}" alt="">${o.done?'<i class="chk">✓</i>':'<b>'+o.txt+'</b>'}</span>`).join('');
    $('#hLevel').textContent='Target';const lv=$('#hLv');if(lv)lv.textContent=(G.L.boss?G.L.boss.name+' \u00b7 ':'Level '+G.n+' \u00b7 ');updateStarBar();
    const eb=$('#btnExtra');if(eb){eb.querySelector('.qty').textContent=Store.d.boosters.extra||0;eb.classList.toggle('off',!G.L.boosters.includes('extra')||!(Store.d.boosters.extra>0));}
    document.querySelectorAll('#boostBar .bb').forEach(el=>{const k=el.dataset.k;el.querySelector('.qty').textContent=Store.d.boosters[k]||0;el.classList.toggle('active',G.mode===k);el.classList.toggle('off',!G.L.boosters.includes(k)||!(Store.d.boosters[k]>0));});
  }
  function updateStarBar(){
    const L=G.L,mx=L.stars[2],f=Math.min(1,G.shown/mx);$('#starFill').style.width=(f*100)+'%';
    [0,1,2].forEach(i=>{const el=$('#st'+i);el.style.left=(L.stars[i]/mx*100)+'%';el.classList.toggle('got',G.shown>=L.stars[i]);});
  }
  let iconN=0;
  let gbT=0;
  function greatBar(){const el=$('#gmBar');if(!el)return;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');clearTimeout(gbT);gbT=setTimeout(()=>el.classList.remove('on'),1900);}
  function boostIcons(bar){
    const n=++iconN,u=s=>s.replace(/id="(\w+)"/g,(m,i)=>'id="'+i+n+'"').replace(/url\(#(\w+)\)/g,(m,i)=>'url(#'+i+n+')');
    const stripes=[-14,-2,10,22,34].map(y=>`<rect x="-10" y="${y}" width="70" height="6" transform="rotate(-35 24 24)"/>`).join('');
    return {
      hammer:u('<svg viewBox="0 0 48 48"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9a0ff"/><stop offset="1" stop-color="#6a2bd0"/></linearGradient></defs><rect x="21" y="18" width="7" height="26" rx="3" transform="rotate(35 24 31)" fill="#ffc83a" stroke="#8a5200" stroke-width="2"/><rect x="8" y="6" width="26" height="15" rx="5" transform="rotate(35 21 13)" fill="url(#hg)" stroke="#3a0f80" stroke-width="2"/></svg>'),
      striped:u(`<svg viewBox="0 0 48 48"><defs><clipPath id="sc"><circle cx="24" cy="24" r="19"/></clipPath><radialGradient id="sg" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#ffc0f4"/><stop offset="1" stop-color="#d0309c"/></radialGradient></defs><circle cx="24" cy="24" r="19" fill="url(#sg)" stroke="#7a1060" stroke-width="1.5"/><g clip-path="url(#sc)" fill="#fff" opacity=".92">${stripes}</g><ellipse cx="17" cy="14" rx="7" ry="3.5" fill="#fff" opacity=".8" transform="rotate(-30 17 14)"/></svg>`),
      bomb:bar?u('<svg viewBox="0 0 48 48"><defs><radialGradient id="bg" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#6a6a7a"/><stop offset=".5" stop-color="#22222e"/><stop offset="1" stop-color="#08080c"/></radialGradient></defs><path d="M30 12q4-6 9-4" fill="none" stroke="#c9a060" stroke-width="3" stroke-linecap="round"/><path d="M40 5l1 4 4 1-4 1-1 4-1-4-4-1 4-1z" fill="#ffd21a"/><circle cx="22" cy="28" r="16" fill="url(#bg)" stroke="#000" stroke-width="1.5"/><rect x="19" y="8" width="10" height="7" rx="2" fill="#3a3a48" transform="rotate(20 24 11)"/><ellipse cx="15" cy="21" rx="5" ry="3" fill="#fff" opacity=".6" transform="rotate(-30 15 21)"/></svg>'):`<img src="${Art.icon('bomb')}" alt="">`,
      shuffle:'<svg viewBox="0 0 48 48"><path d="M6 15h8c8 0 10 18 18 18h8M6 33h8c3 0 5-3 7-6M27 21c2-3 4-6 8-6h5" fill="none" stroke="#7ad8ff" stroke-width="4" stroke-linecap="round"/><path d="M36 9l6 6-6 6M36 27l6 6-6 6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      rowblast:'<svg viewBox="0 0 48 48"><rect x="4" y="18" width="40" height="12" rx="6" fill="#ffd21a" stroke="#8a5a00" stroke-width="2.4"/><path d="M10 24h28" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M24 6l5 8h-10zM24 42l5-8h-10z" fill="#ff8a00"/></svg>',
      areabomb:'<svg viewBox="0 0 48 48"><circle cx="24" cy="26" r="14" fill="#2a2a40" stroke="#8a5a00" stroke-width="2.4"/><path d="M30 14l5-6M33 9l4 1M35 8l-1 4" stroke="#ffd21a" stroke-width="3" stroke-linecap="round"/><rect x="14" y="4" width="20" height="3" fill="none"/><path d="M17 22c2-3 5-4 8-3" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M8 40h32" stroke="#ff8a00" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 4"/></svg>',
      extra:u('<svg viewBox="0 0 48 48"><defs><radialGradient id="eg" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#ff9ab0"/><stop offset="1" stop-color="#d1102f"/></radialGradient></defs><path d="M24 42C8 30 5 21 9 14c4-6 12-5 15 1 3-6 11-7 15-1 4 7 1 16-15 28z" fill="url(#eg)" stroke="#6a0a1e" stroke-width="2"/><text x="24" y="30" text-anchor="middle" font-size="16" font-weight="900" fill="#fff" stroke="#6a0a1e" stroke-width=".8">+5</text></svg>'),
      hand:u('<svg viewBox="0 0 48 48"><defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9ae0"/><stop offset="1" stop-color="#d030a8"/></linearGradient></defs><path d="M16 26V12a3 3 0 016 0v10V8a3 3 0 016 0v14V10a3 3 0 016 0v16l3-5a3 3 0 015 2c-2 8-5 17-12 19-8 2-14-3-18-12l-3-8a3 3 0 015-2z" fill="url(#pg)" stroke="#8a1068" stroke-width="2" stroke-linejoin="round"/><path d="M20 30q4 4 9 0" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/></svg>')
    };
  }
  function buildBoostBar(){
    const ic=boostIcons(true);
    const names={hammer:'Hammer',striped:'Striped',bomb:'Color Bomb',extra:'Extra Moves',hand:'Hand',shuffle:'Shuffle',rowblast:'Row Blaster',areabomb:'Area Bomb'};
    $('#boostBar').innerHTML=['hammer','striped','bomb','hand','shuffle','rowblast','areabomb'].map(k=>`<button class="bb" data-k="${k}" aria-label="${names[k]}">${ic[k]}<span class="qty">0</span></button>`).join('');
    document.querySelectorAll('#boostBar .bb').forEach(el=>el.addEventListener('click',()=>{Snd.unlock();useBooster(el.dataset.k);}));
    const mb=$('.hbox.moves');if(mb&&!$('#btnExtra')){const b=document.createElement('button');b.className='plusMoves';b.id='btnExtra';b.setAttribute('aria-label','Use Extra Moves booster');b.innerHTML=ic.extra+'<i class="qty">0</i>';b.addEventListener('click',()=>{Snd.unlock();useBooster('extra');});mb.appendChild(b);}
    updateHUD();
  }
  function toast(t){UI.toast(t);}
  /* ------------ input ------------ */
  function cellAt(e){const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)-P,y=(e.clientY-r.top)-P;const c=Math.floor(x/cell),rr=Math.floor(y/cell);if(c<0||rr<0||c>=G.L.cols||rr>=G.L.rows)return null;return {r:rr,c};}
  function pDown(e){if(!G||G.busy||G.ended||G.paused)return;Snd.unlock();const p=cellAt(e);if(!p)return;kb=null;clearHint();try{cv.setPointerCapture(e.pointerId);}catch(x){}ptr={r:p.r,c:p.c,x:e.clientX,y:e.clientY,moved:false,wasSel:G.sel};
    if(!(G.mode&&G.mode!=='hand')&&(G.sel==null||!adjacent(G.sel,p.r*G.L.cols+p.c))){/* select on press */ if(!G.b.blocked(p.r,p.c)&&G.b.g[p.r][p.c]){G.sel=p.r*G.L.cols+p.c;Snd.play('click');}}}
  function pMove(e){if(!ptr||!G||G.busy||G.ended)return;const dx=e.clientX-ptr.x,dy=e.clientY-ptr.y;if(Math.hypot(dx,dy)<cell*.4)return;
    if(G.mode&&G.mode!=='hand'){return;}
    const a=ptr.r*G.L.cols+ptr.c;let r=ptr.r,c=ptr.c;if(Math.abs(dx)>Math.abs(dy))c+=dx>0?1:-1;else r+=dy>0?1:-1;ptr.moved=true;ptr=null;
    if(r<0||c<0||r>=G.L.rows||c>=G.L.cols)return;tryMove(a,r*G.L.cols+c);}
  function pUp(e){if(!ptr)return;const p=ptr;ptr=null;if(!G||G.busy||G.ended||G.paused)return;if(p.moved)return;tap(p.r,p.c,p.wasSel);}
  const adjacent=(a,b)=>{const n=G.L.cols;const ar=(a/n)|0,ac=a%n,br=(b/n)|0,bc=b%n;return Math.abs(ar-br)+Math.abs(ac-bc)===1;};
  function tap(r,c,wasSel){
    const i=r*G.L.cols+c;
    if(G.mode&&G.mode!=='hand'){applyBoosterAt(r,c);return;}
    if(G.b.blocked(r,c)||!G.b.g[r][c]){G.sel=null;Snd.play('invalid');return;}
    if(wasSel!=null&&wasSel!==i&&adjacent(wasSel,i)){G.sel=null;tryMove(wasSel,i);return;}
    if(wasSel===i){G.sel=null;return;}
    G.sel=i;
  }
  function tryMove(a,b){const bb=G.b,n=G.L.cols;if(bb.blocked((b/n)|0,b%n)||bb.blocked((a/n)|0,a%n)||!bb.at(b)||!bb.at(a)){G.sel=null;Snd.play('invalid');return;}trySwap(a,b);}
  function onKey(e){
    if(!running||!G||document.querySelector('#modals .modal'))return;
    const k=e.key;if(k==='Escape'){cb.pause&&cb.pause();return;}
    if(G.busy||G.ended)return;
    const d={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]}[k];
    if(!kb)kb={r:0,c:0};
    if(d){e.preventDefault();Snd.unlock();clearHint();
      if(G.sel!=null){const r=kb.r+d[0],c=kb.c+d[1];if(r>=0&&c>=0&&r<G.L.rows&&c<G.L.cols){const a=G.sel;G.sel=null;kb={r,c};tryMove(a,r*G.L.cols+c);}}
      else kb={r:Math.min(G.L.rows-1,Math.max(0,kb.r+d[0])),c:Math.min(G.L.cols-1,Math.max(0,kb.c+d[1]))};}
    else if(k==='Enter'||k===' '){e.preventDefault();Snd.unlock();if(G.mode&&G.mode!=='hand')applyBoosterAt(kb.r,kb.c);else{const i=kb.r*G.L.cols+kb.c;G.sel=G.sel===i?null:(G.b.at(i)?i:null);}}
    else if('12345'.includes(k)){useBooster(['hammer','striped','bomb','hand','extra'][+k-1]);}
  }
  /* ------------ hints ------------ */
  function scheduleHint(){clearTimeout(hintTimer);if(!G)return;hintTimer=setTimeout(()=>{if(!G||G.busy||G.ended||G.paused){scheduleHint();return;}const m=G.b.moves(25);if(m.length){G.hint=m[Math.floor(Math.random()*m.length)];G.hintT=0;}},G.n<=3?3000:6500);}
  function clearHint(){if(G){G.hint=null;}scheduleHint();}
  /* ------------ core turn logic ------------ */
  function pos(o){const r=cv.getBoundingClientRect();return {x:r.left+P+o.px*cell+cell/2,y:r.top+P+o.py*cell+cell/2};}
  async function animSwap(a,b,ms=170){
    const bd=G.b,x=bd.at(a),y=bd.at(b);if(!x||!y)return;bd.swap(a,b);
    const n=G.L.cols,ax=x.px,ay=x.py,bx=y.px,by=y.py;
    await tween(ms,p=>{x.px=ax+(bx-ax)*p;x.py=ay+(by-ay)*p;y.px=bx+(ax-bx)*p;y.py=by+(ay-by)*p;},ease.out);
    x.px=bx;x.py=by;y.px=ax;y.py=ay;
  }
  function recover(err){
    console.error('MG Candy Blast: recovered from a game error',err);
    const g=G;if(!g||g.ended)return;
    try{const bd=g.b,mv=bd.collapse();bd.g.forEach((row,r)=>row.forEach((x,c)=>{if(x){x.px=c;x.py=r;x.sc=1;x.al=1;x.fl=0;}}));g.ghosts=[];}catch(e2){}
    g.busy=false;g.sel=null;g.mode=null;g.hand=false;g.hint=null;updateHUD();scheduleHint();
  }
  async function trySwap(a,b){try{await trySwapInner(a,b);}catch(e){recover(e);}}
  async function trySwapInner(a,b){
    const g=G;if(!g||g.busy||g.ended)return;const tok=g.tok,bd=g.b;g.busy=true;g.sel=null;g.hint=null;clearTimeout(hintTimer);
    const x=bd.at(a),y=bd.at(b);if(!x||!y){g.busy=false;return;}
    const cmb=(x.s||y.s)?bd.combo(a,b):null,valid=!!cmb||bd.valid(a,b),free=g.hand;
    Snd.play('swap');await animSwap(a,b);if(g.tok!==tok)return;
    if(!valid&&!free){Snd.play('invalid');vib(30);await animSwap(a,b,150);if(g.tok!==tok)return;g.busy=false;scheduleHint();return;}
    if(free){g.hand=false;g.mode=null;Store.useBooster('hand');Store.quest('boost',1);}else g.moves--;
    updateHUD();
    await resolve(cmb,[a,b],tok);if(g.tok!==tok)return;
    await endTurn(tok);
  }
  async function resolve(forced,pref,tok){
    const g=G,bd=g.b;let combo=0,first=true;
    for(let guard=0;guard<80;guard++){
      let set,creates=[],acts=[],chocHit,kind='match';
      if(first&&forced){const ex=bd.expand(forced.set,forced.bombType);set=ex.set;acts=ex.acts;chocHit=ex.chocHit;kind=forced.kind;}
      else{const m=bd.findMatches(first?pref:null);if(!m.set.size)break;const ex=bd.expand(m.set);set=ex.set;acts=ex.acts;chocHit=ex.chocHit;creates=m.creates;}
      first=false;combo++;
      await clearStep(set,creates,acts,chocHit,combo,kind);if(g.tok!==tok)return;
      await fall(tok);if(g.tok!==tok)return;
    }
  }
  async function clearStep(set,creates,acts,chocHit,combo,kind,stoneSet){
    const g=G,bd=g.b,tok=g.tok;creates.forEach(cr=>set.delete(cr.i));
    const res=bd.clear(set,chocHit,stoneSet);
    creates.forEach(cr=>{const x=bd.at(cr.i);if(x){x.s=cr.s;if(cr.s==='b')x.t=BOMB;x.pop=1;g.special--;Store.d.stats.specials++;}});
    Store.d.stats.matches+=kind==='match'?1:0;Store.d.stats.specials+=acts.length;
    const n=res.removed.length;let gain=(n*20+acts.length*60+creates.length*100)*combo;g.score+=gain;
    for(const t in res.collect)if(g.collect[t]!==undefined)g.collect[t]=Math.max(0,g.collect[t]-res.collect[t]);
    // sound & effects
    if(acts.length||kind!=='match'){Snd.play(kind==='allclear'||acts.some(a=>a.s==='b')?'blast':'special');Snd.play('blast');FX.shake(acts.some(a=>a.s==='b')||kind==='allclear'?16:9);vib([20,30,20]);}
    else{Snd.play('match',combo);vib(12);}
    if(combo>=2)Snd.play('combo',combo);
    // daily-challenge tracking (real events only)
    for(const t in res.collect){if(+t===1)Store.quest('blue',res.collect[t]);if(+t===0)Store.quest('red',res.collect[t]);}
    Store.quest('score',gain);if(combo>=2)Store.quest('casc',1);if(acts.length)Store.quest('spec',acts.length);
    acts.forEach(a=>{const p=pos({px:a.i%g.L.cols,py:(a.i/g.L.cols)|0});FX.ray(p.x,p.y,a.s==='b'?260:170);});
    creates.forEach(cr=>{const p=pos({px:cr.i%g.L.cols,py:(cr.i/g.L.cols)|0});FX.ray(p.x,p.y,110);});
    if(creates.length)Snd.play('special');
    let sx=0,sy=0;const fxn=S().quality==='low'?3:7;
    res.removed.forEach(o=>{const c=o.cell;c.fl=1;g.ghosts.push(c);const p=pos(c);sx+=p.x;sy+=p.y;FX.burst(p.x,p.y,fxn,[Art.MID[o.t]||'#ffd21a'],1,o.s&&S().quality!=='low');});
    res.jelly.forEach(i=>{const p=pos({px:i%g.L.cols,py:(i/g.L.cols)|0});FX.burst(p.x,p.y,8,['#bff3ff','#fff'],1.1);});
    res.choc.forEach(i=>{const px=i%g.L.cols,py=(i/g.L.cols)|0,p=pos({px,py});FX.burst(p.x,p.y,10,['#7a4424','#4a2410','#c98b5a'],1.1);const o={k:'choc',px,py,sc:.92,al:1};g.ghosts.push(o);res.removed.push({cell:o,i,t:0,s:null,ghostOnly:true});});
    // obstacle damage: one hit per blocker per step, visible cracks, sound, particles, points for each break
    let hitPts=0,broken=0;
    res.hit.forEach(h=>{if(h.k==='choc')return;const px=h.i%g.L.cols,py=(h.i/g.L.cols)|0,p=pos({px,py});
      const col={box:['#d9a05a','#8a5a2a','#ffe0a0'],crate:['#9fb4d0','#46597a','#e8f0ff'],ice:['#bff3ff','#ffffff','#7ad8ff'],stone:['#b8bcc8','#5a5e6e','#ffffff']}[h.k];
      FX.burst(p.x,p.y,h.hp===0?14:7,col,1.1);Snd.play(h.hp===0?'crack2':'crack');
      hitPts+=h.hp===0?60:15;if(h.hp===0&&(h.k==='box'||h.k==='crate')){broken++;}
      if(h.hp===0&&h.k!=='ice'){const o={k:h.k==='stone'?'stone':h.k+'0',px,py,sc:.92,al:1};g.ghosts.push(o);res.removed.push({cell:o,i:h.i,t:0,s:null,ghostOnly:true});}});
    if(hitPts){g.score+=hitPts;gain+=hitPts;}if(broken){Store.quest('boxes',broken);Store.d.stats.blocks=(Store.d.stats.blocks||0)+broken;}
    if(n){FX.text(sx/n,sy/n+22,'+'+gain.toLocaleString(),combo>1?'#ffe14a':'#fff',combo>1?26:22);
      // celebration message chosen from the REAL event, shown near the match
      let type='sweet',text='Sweet!';
      if(combo>=5){type='unbelievable';text='Unbelievable!';}
      else if(combo>=3){type='amazing';text='Amazing!';}
      else if(acts.length){type='fantastic';text='Fantastic!';}
      else if(combo===2){type='combo';text='Great Combo!';}
      else if(creates.length){type='great';text='Great!';}
      else if(n>=6){type='excellent';text='Excellent!';}
      if(Msg.show(type,text,sx/n,sy/n-34))Voice.say('m_'+type);
      if(acts.length||combo>=3)greatBar();}   // the voice reads the SAME text that appears
    await tween(230,p=>{res.removed.forEach(o=>{const c=o.cell;c.sc=(c.k?.92:1)*(p<.3?1+p*.8:1.24*(1-(p-.3)/.7));c.al=1-p*p;if(!c.k)c.fl=1-p;});creates.forEach(cr=>{const x=bd.at(cr.i);if(x)x.sc=1+.45*(1-p);});},ease.lin);
    if(g.tok!==tok)return;
    g.ghosts=g.ghosts.filter(o=>!res.removed.some(r=>r.cell===o));
    creates.forEach(cr=>{const x=bd.at(cr.i);if(x)x.sc=1;});
    updateHUD();
  }
  async function fall(tok){
    const g=G,bd=g.b,{moves,spawns}=bd.collapse();if(!moves.length&&!spawns.length)return;
    const items=[],fades=[];
    moves.forEach(m=>{items.push({o:m.cell,from:m.cell.py,to:m.to,dur:130+75*Math.sqrt(Math.abs(m.to-m.cell.py))});});
    spawns.forEach(s=>{const o=s.cell;o.px=s.c;o.fl=0;o.al=1;o.sc=1;if(s.top){o.py=-s.n;items.push({o,from:-s.n,to:s.r,dur:130+75*Math.sqrt(s.r+s.n)});}else{o.py=s.r;o.sc=0;o.al=0;fades.push(o);}});
    const mx=Math.max(200,...items.map(i=>i.dur));
    Snd.play('fall');
    await tween(mx+40,p=>{items.forEach(it=>{const k=Math.min(1,p*(mx+40)/it.dur);it.o.py=it.from+(it.to-it.from)*(k>=1?1:ease.fall(k));});fades.forEach(o=>{o.sc=p;o.al=p;});},ease.lin);
    if(g.tok!==tok)return;items.forEach(it=>{it.o.py=it.to;});fades.forEach(o=>{o.sc=1;o.al=1;});
  }
  // ---- win rule ----
  function starsDone(){return G.score>=G.L.stars[2];}                       // all three stars earned
  function tasksState(){                                                      // null = this level has no separate tasks
    const g=G,o=g.L.obj;if(!o.some(x=>x!=='score'))return null;
    return (!o.includes('collect')||Object.values(g.collect).every(v=>v<=0))&&(!o.includes('jelly')||g.b.count().jelly===0)&&(!o.includes('choc')||g.b.count().choc===0)&&(!o.includes('box')||g.b.count().box===0)&&(!o.includes('crate')||g.b.count().crate===0)&&(!o.includes('ice')||g.b.count().ice===0)&&(!o.includes('special')||g.special<=0);
  }
  function done(){const t=tasksState();return WIN_RULE==='both'?(starsDone()&&(t===null||t)):(starsDone()||t===true);}
  // rearranges the board (no points, no move used); blockers and frozen candies stay where they are
  async function shuffleBoard(tok,manual){
    const g=G;UI.toast(manual?'Shuffle!':'No moves left — shuffling!');Snd.play('shuffle');
    const old=[];g.b.g.forEach(row=>row.forEach(x=>{if(x)old.push([x,x.px,x.py]);}));
    g.b.shuffle();
    const tgt=[];g.b.g.forEach((row,r)=>row.forEach((x,c)=>{if(x){const o=old.find(q=>q[0]===x);tgt.push([x,o?o[1]:c,o?o[2]:r,c,r]);}}));
    await tween(520,p=>{tgt.forEach(([x,a,b,c,r])=>{x.px=a+(c-a)*p;x.py=b+(r-b)*p;x.sc=1+.15*Math.sin(p*Math.PI);});},ease.out);
    if(g.tok!==tok)return;tgt.forEach(([x,a,b,c,r])=>{x.px=c;x.py=r;x.sc=1;});
    if(manual&&g.b.findMatches().set.size){await resolve(null,null,tok);}
  }
  async function endTurn(tok){
    const g=G;updateHUD();Store.save();
    // THREE-STAR RULE: victory needs every goal AND the 3-star score (both are inside done()). Unused moves are fine.
    if(done()){win();return;}
    if(g.moves<=0){lose();return;}
    if(!g.b.findMove()){await shuffleBoard(tok,false);if(g.tok!==tok)return;if(g.b.findMatches().set.size){g.busy=true;await resolve(null,null,tok);if(g.tok!==tok)return;return endTurn(tok);}}
    g.busy=false;scheduleHint();
  }
  /* ------------ boosters ------------ */
  function useBooster(k){
    const g=G;if(!g||g.busy||g.ended||g.paused)return;
    if(!g.L.boosters.includes(k)){toast('Not available on this level');Snd.play('invalid');return;}
    if(!(Store.d.boosters[k]>0)){toast('None left — earn more with Daily Rewards and by winning levels');Snd.play('invalid');return;}
    if(k==='extra'){
      if(g.extraUsed>=g.L.extraLimit){toast('Extra Moves can be used '+g.L.extraLimit+' times per level');Snd.play('invalid');return;}
      Store.useBooster('extra');Store.quest('boost',1);g.extraUsed++;g.moves+=5;Snd.play('booster');const r=cv.getBoundingClientRect();FX.text(r.left+r.width/2,r.top+r.height/2,'+5 Moves!','#ff7a9a',34);FX.burst(r.left+r.width/2,r.top+r.height/2,24,['#ff5a7a','#fff'],1.2);updateHUD();return;}
    if(k==='shuffle'){g.busy=true;g.mode=null;Store.useBooster('shuffle');Store.quest('boost',1);Snd.play('booster');updateHUD();shuffleBoard(g.tok,true).then(()=>{if(G===g&&!g.ended){g.busy=false;scheduleHint();}}).catch(recover);return;}
    if(g.mode===k){g.mode=null;g.hand=false;updateHUD();return;}
    g.mode=k;g.hand=k==='hand';g.sel=null;Snd.play('click');Voice.say('power');
    toast({hammer:'Tap a candy or any blocker to smash it',rowblast:'Tap any cell: its whole row is cleared',areabomb:'Tap a cell: the 3x3 area around it is cleared',striped:'Tap a candy to turn it into a striped candy',bomb:'Tap a candy to turn it into a Color Bomb',hand:'Hand ready: your next swap is free and always allowed'}[k]);updateHUD();
  }
  async function applyBoosterAt(r,c){try{await applyBoosterInner(r,c);}catch(e){recover(e);}}
  async function applyBoosterInner(r,c){
    const g=G,bd=g.b,tok=g.tok,k=g.mode,i=r*g.L.cols+c,x=bd.at(i);
    if(k==='hammer'){
      if(!x&&!bd.wall(r,c)){Snd.play('invalid');return;}
      g.busy=true;g.mode=null;Store.useBooster('hammer');Store.quest('boost',1);Snd.play('booster');
      let set=new Set(),chocHit=new Set(),acts=[],stoneSet=null;
      if(bd.wall(r,c)||bd.ice[r][c]>0){if(bd.stone[r][c])stoneSet=new Set([i]);else chocHit.add(i);}else{const ex=bd.expand(new Set([i]));set=ex.set;acts=ex.acts;chocHit=ex.chocHit;}
      const p=pos({px:c,py:r});FX.burst(p.x,p.y,18,['#ffd21a','#fff','#c9a0ff'],1.3);FX.shake(8);
      await clearStep(set,[],acts,chocHit,1,'hammer',stoneSet);if(g.tok!==tok)return;await fall(tok);if(g.tok!==tok)return;await resolve(null,null,tok);if(g.tok!==tok)return;await endTurn(tok);return;
    }
    if(k==='rowblast'||k==='areabomb'){
      const cells=[];if(k==='rowblast'){for(let cc=0;cc<g.L.cols;cc++)cells.push([r,cc]);}else{for(let a=-1;a<=1;a++)for(let b2=-1;b2<=1;b2++)if(r+a>=0&&r+a<g.L.rows&&c+b2>=0&&c+b2<g.L.cols)cells.push([r+a,c+b2]);}
      const set=new Set(),hit=new Set(),stone=new Set();
      cells.forEach(([rr,cc])=>{const ii=rr*g.L.cols+cc;if(bd.wall(rr,cc)){if(bd.stone[rr][cc])stone.add(ii);else hit.add(ii);}else if(bd.ice[rr][cc]>0)hit.add(ii);else if(bd.g[rr][cc])set.add(ii);});
      g.busy=true;g.mode=null;Store.useBooster(k);Store.quest('boost',1);Snd.play('booster');
      const ex=bd.expand(set);ex.chocHit.forEach(h=>hit.add(h));
      const p=pos({px:c,py:r});FX.burst(p.x,p.y,22,['#ffd21a','#ff8a00','#fff'],1.4);FX.shake(12);
      await clearStep(ex.set,[],ex.acts,hit,1,k,stone);if(g.tok!==tok)return;await fall(tok);if(g.tok!==tok)return;await resolve(null,null,tok);if(g.tok!==tok)return;await endTurn(tok);return;
    }
    if(!x||x.s||bd.blocked(r,c)){toast('Pick a normal candy');Snd.play('invalid');return;}
    g.busy=true;g.mode=null;Store.useBooster(k);Store.quest('boost',1);Snd.play('booster');
    if(k==='striped')x.s=Math.random()<.5?'h':'v';else{x.s='b';x.t=BOMB;}
    const p=pos(x);FX.burst(p.x,p.y,16,['#fff','#ffe14a'],1.2);
    await tween(320,q=>{x.sc=1+.5*Math.sin(q*Math.PI);},ease.out);if(g.tok!==tok)return;x.sc=1;
    await resolve(null,null,tok);if(g.tok!==tok)return;await endTurn(tok);
  }
  /* ------------ results ------------ */
  function win(){
    const g=G;if(!g||g.ended)return;
    if(!done()){return;} // defensive: only win when the rule (stars OR tasks) is really satisfied
    g.ended=true;g.won=true;g.busy=true;g.mode=null;clearTimeout(hintTimer);
    const L=g.L,bonus=Math.max(0,g.moves)*30;
    let stars=g.score>=L.stars[2]?3:g.score>=L.stars[1]?2:g.score>=L.stars[0]?1:0;if(stars<1)stars=1; // stars come from the real score thresholds
    g.score+=bonus;                                  // unused-move bonus only raises the final score, after the check
    const d=Store.d,prev=d.levels[g.n],first=!prev||!(prev.stars>0),pst=prev?prev.stars:0;
    const hadBest=!!(prev&&prev.best>0),newBest=!prev||g.score>prev.best,record=newBest&&hadBest;
    let coins=first?40+stars*20:10+Math.max(0,stars-pst)*20,booster=null;if(record)coins+=20;
    if(first&&L.boss){coins+=200;booster='areabomb';}   // challenge levels pay a bigger first-clear reward
    if(first&&g.n%3===0)booster=['hammer','striped','bomb','extra','hand'][g.n%5];
    if(first&&g.n%10===0){coins+=100;booster=booster||['hammer','striped','bomb','extra','hand'][(g.n/10)%5];}
    d.levels[g.n]={stars:Math.max(stars,pst),best:Math.max(g.score,prev?prev.best:0)};
    d.unlocked=Math.max(d.unlocked,Math.min(99999,g.n+1));d.stats.won++;if(!first)d.stats.replayed++;d.stats.best=Math.max(d.stats.best,g.score);if(record)d.stats.records=(d.stats.records||0)+1;Store.quest('levels',1);
    d.coins+=coins;if(booster)d.boosters[booster]=Math.min(99,(d.boosters[booster]||0)+1);
    Store.save();updateHUD();
    const res={boss:L.boss?L.boss.name:null,n:g.n,score:g.score,stars,bonus,coins,booster,first,newBest,record,world:(first&&g.n%20===0)?worldOf(g.n+1):0,hasNext:g.n<99999};
    FX.fireworks(3);Snd.play('special');
    setTimeout(()=>{if(G===g&&g.ended)cb.win(res);},900);
  }
  function lose(){const g=G;if(!g||g.ended)return;g.ended=true;g.lost=true;g.busy=true;g.mode=null;clearTimeout(hintTimer);Snd.play('lose');vib([60,40,60]);setTimeout(()=>{if(G===g&&g.ended)cb.lose({n:g.n,score:g.score});},700);}
  function extraFromLose(useCoins){
    const g=G;if(!g||!g.ended||g.won||!g.lost)return false;
    if(useCoins){if(!Store.spendCoins(200))return false;}else if(!Store.useBooster('extra'))return false;
    g.moves+=5;g.ended=false;g.lost=false;g.busy=false;Snd.play('booster');updateHUD();scheduleHint();return true;
  }
  return {testEndTurn(){return G?endTurn(G.tok):null;},boostIcons,preStriped(){const gg=G;if(!gg)return;const cs=[];gg.b.g.forEach(r=>r.forEach(x=>{if(x&&!x.s)cs.push(x);}));if(cs.length){const x=cs[Math.floor(Math.random()*cs.length)];x.s=Math.random()<.5?'h':'v';}},init,start,intro,show,leave,relayout,updateHUD,useBooster,extraFromLose,cb,
    get state(){return G;},setPaused(v){if(G)G.paused=v;},
    devWin(){if(G&&!G.ended){G.score=Math.max(G.score,G.L.score);G.collect={};G.special=0;G.b.jelly.forEach(r=>r.fill(0));G.b.choc.forEach(r=>r.fill(false));G.b.box.forEach(r=>r.fill(0));G.b.crate.forEach(r=>r.fill(0));G.b.ice.forEach(r=>r.fill(0));win();}},
    devLose(){if(G&&!G.ended){G.moves=0;lose();}}};
})();
