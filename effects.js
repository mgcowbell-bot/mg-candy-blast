/* MG Candy Blast - particles, score pop-ups, confetti, fireworks, screen shake */
const FX=(()=>{
  let cv,cx,parts=[],texts=[],rays=[],raf=0,last=0,shake=0,shakeEl=null,w=0,h=0,dpr=1;
  const COL=['#ff3b4f','#2f8cff','#3ed425','#ffd21a','#c24ff0','#ff8f1f'];
  const S=()=>Store.d.settings;
  const mult=()=>{const q={low:.3,medium:.65,high:1}[S().quality];return S().fx==='reduced'?q*.25:q;};
  const cap=()=>({low:60,medium:160,high:320}[S().quality]);
  function init(el,shk){if(!cv){cv=el;cx=cv.getContext('2d');addEventListener('resize',resize);}if(shk)shakeEl=shk;resize();}
  function resize(){if(!cv)return;dpr=Math.min(devicePixelRatio||1,S&&Store.d&&S().quality==='high'?2:1.5);w=innerWidth;h=innerHeight;cv.width=w*dpr;cv.height=h*dpr;cv.style.width=w+'px';cv.style.height=h+'px';}
  function kick(){if(!raf&&!document.hidden){last=performance.now();raf=requestAnimationFrame(loop);}}
  function burst(x,y,n,colors,spd=1,star=false){
    n=Math.round(n*mult());if(n<=0)return;
    for(let i=0;i<n&&parts.length<cap();i++){const a=Math.random()*6.283,v=(1+Math.random()*3.2)*spd*60;
      parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,g:520,l:0,max:.5+Math.random()*.5,s:3+Math.random()*4,c:colors[i%colors.length],star,rot:Math.random()*6});}
    kick();
  }
  function ray(x,y,size=130){if(S().fx==='reduced'||S().quality==='low')return;rays.push({x,y,l:0,max:.6,size});kick();}
  function text(x,y,str,color='#fff',size=26){texts.push({x,y,str,color,size,l:0,max:.9});kick();}
  function confetti(n=120){
    n=Math.round(n*mult());
    for(let i=0;i<n&&parts.length<cap()+80;i++)parts.push({x:Math.random()*w,y:-20-Math.random()*h*.4,vx:(Math.random()-.5)*90,vy:60+Math.random()*120,g:60,l:0,max:3+Math.random()*2,s:5+Math.random()*5,c:COL[i%6],rect:true,rot:Math.random()*6,vr:(Math.random()-.5)*8});
    kick();
  }
  function firework(x,y){burst(x,y,60,['#fff',COL[Math.floor(Math.random()*6)],'#ffd21a'],1.6,true);}
  function fireworks(count=5){if(S().fx==='reduced')return;for(let i=0;i<count;i++)setTimeout(()=>{if(!document.hidden)firework(w*(.15+Math.random()*.7),h*(.15+Math.random()*.35));},i*350);}
  function doShake(p){if(S().fx==='reduced'||S().quality==='low')return;shake=Math.max(shake,p);kick();}
  function starPath(c,r){c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();}
  function loop(t){
    raf=0;if(document.hidden)return;
    const dt=Math.min(.05,(t-last)/1000);last=t;
    cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,w,h);
    for(let i=rays.length-1;i>=0;i--){const q=rays[i];q.l+=dt;const k=q.l/q.max;if(k>=1){rays.splice(i,1);continue;}
      cx.save();cx.translate(q.x,q.y);cx.globalCompositeOperation='lighter';cx.globalAlpha=(1-k)*.85;const Rr=q.size*(.35+k*1.1);
      const gg=cx.createRadialGradient(0,0,2,0,0,Rr*.5);gg.addColorStop(0,'rgba(255,255,255,1)');gg.addColorStop(1,'rgba(255,230,120,0)');cx.fillStyle=gg;cx.beginPath();cx.arc(0,0,Rr*.5,0,7);cx.fill();
      cx.rotate(k*.6);for(let r=0;r<12;r++){cx.rotate(Math.PI/6);const lg=cx.createLinearGradient(0,0,0,-Rr);lg.addColorStop(0,'rgba(255,255,255,.9)');lg.addColorStop(1,'rgba(255,240,150,0)');cx.fillStyle=lg;cx.beginPath();cx.moveTo(0,0);cx.lineTo(-Rr*.07,-Rr);cx.lineTo(Rr*.07,-Rr);cx.closePath();cx.fill();}
      cx.restore();}
    for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.l+=dt;if(p.l>=p.max||p.y>h+30){parts.splice(i,1);continue;}
      p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=(p.vr||3)*dt;
      cx.globalAlpha=Math.max(0,1-(p.l/p.max)**3);cx.fillStyle=p.c;cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);
      if(p.rect)cx.fillRect(-p.s/2,-p.s/3,p.s,p.s*.6);else if(p.star){starPath(cx,p.s);cx.fill();}else{cx.beginPath();cx.arc(0,0,p.s*(1-p.l/p.max*.5),0,6.3);cx.fill();}
      cx.restore();}
    for(let i=texts.length-1;i>=0;i--){const q=texts[i];q.l+=dt;if(q.l>=q.max){texts.splice(i,1);continue;}
      const k=q.l/q.max;cx.globalAlpha=1-k*k;cx.font='900 '+q.size+'px "Arial Rounded MT Bold",Arial,sans-serif';cx.textAlign='center';
      cx.lineWidth=5;cx.strokeStyle='#5a1a00';cx.strokeText(q.str,q.x,q.y-k*50);cx.fillStyle=q.color;cx.fillText(q.str,q.x,q.y-k*50);}
    cx.globalAlpha=1;
    if(shakeEl){if(shake>.3){shakeEl.style.transform=`translate(${(Math.random()-.5)*shake}px,${(Math.random()-.5)*shake}px)`;shake*=.86;}else if(shake){shake=0;shakeEl.style.transform='';}}
    if(parts.length||texts.length||rays.length||shake)raf=requestAnimationFrame(loop);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(parts.length||texts.length)kick();});
  return {init,burst,ray,text,confetti,fireworks,firework,shake:doShake,mult,clear(){parts.length=0;texts.length=0;rays.length=0;if(cx)cx.clearRect(0,0,w,h);},resize,get count(){return parts.length;}};
})();

/* ---------- gameplay message system: one message at a time, priority based ---------- */
const Msg=(()=>{
  const PRI={sweet:1,great:1,excellent:1,combo:2,bonus:2,nomoves:2,amazing:3,fantastic:3,unbelievable:4,record:5};
  let active=null,activeP=0,lastT=0,tmr=0,badgeEl=null,bTmr=0,wEl=null,wTmr=0;
  const host=()=>document.getElementById('msgs');
  function clear(){if(active&&active.parentNode)active.parentNode.removeChild(active);active=null;activeP=0;}
  function show(type,text,x,y){
    const h=host();if(!h)return false;const p=PRI[type]||1,now=Date.now();
    if(active&&p<activeP)return false;
    if(p<2&&now-lastT<1300)return false;
    clear();
    const el=document.createElement('div');el.className='msg t-'+type;el.innerHTML='<b class="bk"></b><b class="fr"></b>';
    el.firstChild.textContent=text;el.lastChild.textContent=text;
    x=Math.max(130,Math.min(innerWidth-130,x));y=Math.max(90,Math.min(innerHeight-130,y));el.style.left=x+'px';el.style.top=y+'px';
    h.appendChild(el);active=el;activeP=p;lastT=now;clearTimeout(tmr);tmr=setTimeout(()=>{if(active===el)clear();},1250);
    if(p>=2)FX.burst(x,y,p>=3?24:12,['#fff','#ffd21a','#ff8ad8','#7ad8ff'],1.1,true);
    return true;
  }
  function badge(title,sub){const h=host();if(!h)return;if(badgeEl&&badgeEl.parentNode)badgeEl.parentNode.removeChild(badgeEl);
    const el=document.createElement('div');el.className='badge2';el.innerHTML='<i></i><div><b></b><small></small></div>';el.querySelector('b').textContent=title;el.querySelector('small').textContent=sub||'';
    h.appendChild(el);badgeEl=el;clearTimeout(bTmr);bTmr=setTimeout(()=>{if(el.parentNode)el.parentNode.removeChild(el);},2800);FX.burst(innerWidth/2,70,18,['#ffd21a','#fff'],1,true);}
  function banner(title,sub){const h=host();if(!h)return;if(wEl&&wEl.parentNode)wEl.parentNode.removeChild(wEl);
    const el=document.createElement('div');el.className='wbn';el.innerHTML='<b></b><small></small>';el.querySelector('b').textContent=title;el.querySelector('small').textContent=sub||'';
    h.appendChild(el);wEl=el;clearTimeout(wTmr);wTmr=setTimeout(()=>{if(el.parentNode)el.parentNode.removeChild(el);},2600);FX.confetti(60);}
  return {show,badge,banner,clear};
})();
