/* MG Candy Blast - procedural art: candy sprites, scenery, logo, mascot, icons */
const Art=(()=>{
  const COLS=[['#ff9a9a','#ff2a3d','#9b0820'],['#a6e9ff','#2a8cff','#0b3aa0'],['#b6ff7a','#33c91c','#0d7a10'],['#fff59a','#ffcc10','#e07a00'],['#f2b3ff','#b43ee8','#5b1a96'],['#ffe08a','#ff8c1a','#c24a00']];
  const MID=COLS.map(c=>c[1]);
  const R=38,GLYPH=['♥','●','■','★','✿','▲'];
  function rr(c,x,y,w,h,r){c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
  const SH=[
    c=>{const w=R*.98,h=R*.62;rr(c,-w,-h,w*2,h*2,h);},
    c=>{c.arc(0,0,R*.92,0,7);},
    c=>{const s=R*.86;rr(c,-s,-s,s*2,s*2,R*.3);},
    c=>{for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?R*.52:R*1.05;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();},
    c=>{c.arc(0,0,R*.5,0,7);for(let i=0;i<6;i++){const a=i*Math.PI/3;c.moveTo(Math.cos(a)*R*.6+R*.38,Math.sin(a)*R*.6);c.arc(Math.cos(a)*R*.6,Math.sin(a)*R*.6,R*.38,0,7);}},
    c=>{c.moveTo(0,-R);c.bezierCurveTo(R*.25,-R*.5,R*.9,-R*.15,R*.9,R*.2);c.arc(0,R*.2,R*.9,0,Math.PI,false);c.bezierCurveTo(-R*.9,-R*.15,-R*.25,-R*.5,0,-R);c.closePath();}
  ];
  function grad(c,t,k=1){const g=c.createRadialGradient(-R*.3,-R*.35,R*.1,0,0,R*1.15*k),p=COLS[t];g.addColorStop(0,p[0]);g.addColorStop(.5,p[1]);g.addColorStop(1,p[2]);return g;}
  function facets(c,t){
    if(t===3){for(let i=0;i<5;i++){const a1=-Math.PI/2+i*2*Math.PI/5,o=[Math.cos(a1)*R*1.05,Math.sin(a1)*R*1.05],l=a1-Math.PI/5,r2=a1+Math.PI/5,il=[Math.cos(l)*R*.52,Math.sin(l)*R*.52],ir=[Math.cos(r2)*R*.52,Math.sin(r2)*R*.52];
      c.beginPath();c.moveTo(0,0);c.lineTo(il[0],il[1]);c.lineTo(o[0],o[1]);c.closePath();c.fillStyle='rgba(255,255,255,.3)';c.fill();
      c.beginPath();c.moveTo(0,0);c.lineTo(o[0],o[1]);c.lineTo(ir[0],ir[1]);c.closePath();c.fillStyle='rgba(150,60,0,.25)';c.fill();}}
    else if(t===2){const s=R*.86*.62;c.lineJoin='round';c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=5;c.beginPath();rr(c,-s,-s,s*2,s*2,R*.14);c.stroke();
      c.strokeStyle='rgba(0,70,0,.4)';c.beginPath();c.moveTo(s,-s*.9);c.lineTo(s,s);c.lineTo(-s*.9,s);c.stroke();}
    else if(t===0){c.fillStyle='rgba(255,255,255,.2)';c.fillRect(-R,-R*.06,R*2,R*.16);c.fillStyle='rgba(120,0,20,.18)';c.fillRect(-R,R*.2,R*2,R*.1);}
    else if(t===4){for(let i=0;i<6;i++){const a=i*Math.PI/3;c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.ellipse(Math.cos(a)*R*.6-R*.1,Math.sin(a)*R*.6-R*.15,R*.14,R*.08,-.5,0,7);c.fill();}}
    else if(t===5){c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=3;c.beginPath();c.arc(0,R*.25,R*.55,Math.PI*.15,Math.PI*.85);c.stroke();}
  }
  function body(c,t,scale=1,stripe=null,glyph=false){
    c.save();c.scale(scale,scale);
    c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(0,R*.96,R*.72,R*.13,0,0,7);c.fill();
    if(t===0)c.rotate(-.6);
    c.save();c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=8;c.shadowOffsetY=4;c.beginPath();SH[t](c);c.fillStyle=grad(c,t);c.fill();c.restore();
    c.beginPath();SH[t](c);c.save();c.clip();
    const vg=c.createRadialGradient(-R*.25,-R*.3,R*.3,0,0,R*1.2);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(10,0,50,.42)');c.fillStyle=vg;c.fillRect(-R*1.4,-R*1.4,R*2.8,R*2.8);
    const g2=c.createRadialGradient(R*.15,R*.85,2,R*.1,R*.6,R*.95);g2.addColorStop(0,'rgba(255,255,255,.45)');g2.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g2;c.fillRect(-R*1.4,-R*1.4,R*2.8,R*2.8);
    facets(c,t);
    c.lineJoin='round';c.lineWidth=8;c.strokeStyle='rgba(255,255,255,.22)';c.beginPath();SH[t](c);c.stroke();
    if(stripe){if(t===0)c.rotate(.6);c.fillStyle='rgba(255,255,255,.9)';
      for(let k=-R;k<R;k+=R*.5){if(stripe==='h')c.fillRect(-R*1.3,k-R*.07,R*2.6,R*.2);else c.fillRect(k-R*.07,-R*1.3,R*.2,R*2.6);}
      c.fillStyle='rgba(0,0,0,.08)';for(let k=-R;k<R;k+=R*.5){if(stripe==='h')c.fillRect(-R*1.3,k+R*.13,R*2.6,R*.05);else c.fillRect(k+R*.13,-R*1.3,R*.05,R*2.6);}
      if(t===0)c.rotate(-.6);}
    c.restore();
    c.lineJoin='round';c.lineWidth=2.6;c.strokeStyle=COLS[t][2];c.beginPath();SH[t](c);c.stroke();
    c.save();c.rotate(-.5);const hg=c.createRadialGradient(-R*.18,-R*.5,1,-R*.18,-R*.5,R*.38);hg.addColorStop(0,'rgba(255,255,255,.95)');hg.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=hg;c.beginPath();c.ellipse(-R*.18,-R*.5,R*.4,R*.18,0,0,7);c.fill();
    c.fillStyle='#fff';c.beginPath();c.ellipse(-R*.2,-R*.52,R*.17,R*.06,0,0,7);c.fill();c.beginPath();c.arc(R*.34,-R*.5,R*.055,0,7);c.fill();c.restore();
    c.fillStyle='rgba(255,255,255,.32)';c.beginPath();c.ellipse(R*.25,R*.55,R*.22,R*.07,.6,0,7);c.fill();
    if(glyph){c.rotate(t===0?.6:0);c.fillStyle='rgba(0,0,0,.45)';c.font='bold 26px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(GLYPH[t],0,3);}
    c.restore();
  }
  function wrapped(c,t,glyph){
    const p=COLS[t];c.save();
    [-1,1].forEach(s=>{c.save();c.scale(s,1);c.beginPath();c.moveTo(R*.55,0);c.lineTo(R*1.18,-R*.55);c.quadraticCurveTo(R*1.05,0,R*1.18,R*.55);c.closePath();const g=c.createLinearGradient(R*.5,0,R*1.2,0);g.addColorStop(0,p[1]);g.addColorStop(1,p[2]);c.fillStyle=g;c.fill();c.strokeStyle='#fff';c.lineWidth=2;c.stroke();c.restore();});
    body(c,t,.78,null,glyph);
    c.beginPath();c.arc(0,0,R*.78,0,7);c.strokeStyle='#fff6b0';c.lineWidth=3;c.setLineDash([6,5]);c.stroke();c.setLineDash([]);
    c.restore();
  }
  function bomb(c){
    c.save();c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=8;c.shadowOffsetY=4;
    const g=c.createRadialGradient(-R*.3,-R*.35,R*.1,0,0,R);g.addColorStop(0,'#9a6a46');g.addColorStop(.5,'#4a2814');g.addColorStop(1,'#1f0e06');
    c.beginPath();c.arc(0,0,R*.95,0,7);c.fillStyle=g;c.fill();c.restore();
    const cols=['#ff3b4f','#2f8cff','#3ed425','#ffd21a','#c24ff0','#ff8f1f'];
    for(let i=0;i<16;i++){const a=i*2.4,d=R*(.2+((i*37)%10)/14);c.save();c.translate(Math.cos(a)*d,Math.sin(a)*d*.95);c.rotate(a*3);c.fillStyle=cols[i%6];c.beginPath();rr(c,-6,-2.5,12,5,2.5);c.fill();c.restore();}
    c.lineWidth=2.4;c.strokeStyle='#ffe9b0';c.beginPath();c.arc(0,0,R*.95,0,7);c.stroke();
    c.fillStyle='rgba(255,255,255,.75)';c.beginPath();c.ellipse(-R*.3,-R*.55,R*.26,R*.12,-.5,0,7);c.fill();
  }
  function choc(c){
    c.save();c.shadowColor='rgba(0,0,0,.4)';c.shadowBlur=5;c.shadowOffsetY=3;
    const g=c.createLinearGradient(-R,-R,R,R);g.addColorStop(0,'#9a5a30');g.addColorStop(1,'#4c260f');c.beginPath();rr(c,-R*.92,-R*.92,R*1.84,R*1.84,10);c.fillStyle=g;c.fill();c.restore();
    c.strokeStyle='rgba(20,8,0,.6)';c.lineWidth=3;c.beginPath();c.moveTo(0,-R*.9);c.lineTo(0,R*.9);c.moveTo(-R*.9,0);c.lineTo(R*.9,0);c.stroke();
    c.strokeStyle='rgba(255,200,140,.55)';c.lineWidth=2;c.beginPath();c.moveTo(-R*.8,-R*.8);c.lineTo(-R*.1,-R*.8);c.moveTo(-R*.8,-R*.8);c.lineTo(-R*.8,-R*.1);c.stroke();
  }
  function boxDraw(c,dmg){
    c.save();c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=6;c.shadowOffsetY=4;const g=c.createLinearGradient(-R,-R,R,R);g.addColorStop(0,'#e8b36a');g.addColorStop(1,'#9a6430');c.beginPath();rr(c,-R*.9,-R*.9,R*1.8,R*1.8,6);c.fillStyle=g;c.fill();c.restore();
    c.lineWidth=2.5;c.strokeStyle='#4a2810';c.beginPath();rr(c,-R*.9,-R*.9,R*1.8,R*1.8,6);c.stroke();
    c.strokeStyle='rgba(74,40,16,.75)';c.lineWidth=2;[-R*.3,R*.3].forEach(y=>{c.beginPath();c.moveTo(-R*.9,y);c.lineTo(R*.9,y);c.stroke();});
    c.strokeStyle='rgba(255,225,170,.55)';c.beginPath();c.moveTo(-R*.8,-R*.8);c.lineTo(R*.8,-R*.8);c.stroke();
    c.fillStyle='#3a2008';[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{c.beginPath();c.arc(a*R*.7,b*R*.7,2.6,0,7);c.fill();});
    c.strokeStyle='rgba(74,40,16,.6)';c.lineWidth=3;c.beginPath();c.moveTo(-R*.6,-R*.6);c.lineTo(R*.6,R*.6);c.moveTo(R*.6,-R*.6);c.lineTo(-R*.6,R*.6);c.stroke();
    if(dmg>=1){c.strokeStyle='#2a1204';c.lineWidth=3;c.beginPath();c.moveTo(-R*.1,-R*.9);c.lineTo(R*.05,-R*.4);c.lineTo(-R*.15,-R*.05);c.lineTo(R*.1,R*.4);c.lineTo(-R*.05,R*.9);c.stroke();}
    if(dmg>=2){c.fillStyle='#2a1204';c.beginPath();c.moveTo(R*.2,-R*.9);c.lineTo(R*.9,-R*.9);c.lineTo(R*.9,-R*.2);c.lineTo(R*.55,-R*.45);c.lineTo(R*.4,-R*.7);c.closePath();c.fill();c.strokeStyle='#d9a05a';c.lineWidth=2;c.beginPath();c.moveTo(R*.2,-R*.9);c.lineTo(R*.4,-R*.7);c.lineTo(R*.55,-R*.45);c.lineTo(R*.9,-R*.2);c.stroke();}
  }
  function crateDraw(c,dmg){
    c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=6;c.shadowOffsetY=4;const g=c.createLinearGradient(-R,-R,R,R);g.addColorStop(0,'#c4d4ea');g.addColorStop(.5,'#7f96b8');g.addColorStop(1,'#46597a');c.beginPath();rr(c,-R*.92,-R*.92,R*1.84,R*1.84,8);c.fillStyle=g;c.fill();c.restore();
    c.lineWidth=3;c.strokeStyle='#243450';c.beginPath();rr(c,-R*.92,-R*.92,R*1.84,R*1.84,8);c.stroke();
    c.strokeStyle='#2c3e5e';c.lineWidth=6;c.beginPath();c.moveTo(-R*.85,-R*.85);c.lineTo(R*.85,R*.85);c.moveTo(R*.85,-R*.85);c.lineTo(-R*.85,R*.85);c.stroke();
    c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;c.beginPath();c.moveTo(-R*.8,-R*.88);c.lineTo(R*.8,-R*.88);c.stroke();
    c.fillStyle='#e8f0ff';[[-1,-1],[1,-1],[-1,1],[1,1],[0,0]].forEach(([a,b])=>{c.beginPath();c.arc(a*R*.7,b*R*.7,3.4,0,7);c.fill();c.strokeStyle='#243450';c.lineWidth=1;c.stroke();});
    c.strokeStyle='#14203a';c.lineWidth=2.4;
    if(dmg>=1){c.beginPath();c.moveTo(-R*.9,R*.2);c.lineTo(-R*.5,R*.05);c.lineTo(-R*.35,R*.35);c.stroke();}
    if(dmg>=2){c.beginPath();c.moveTo(R*.9,-R*.3);c.lineTo(R*.5,-R*.15);c.lineTo(R*.6,R*.15);c.lineTo(R*.2,R*.3);c.stroke();}
    if(dmg>=3){c.fillStyle='#14203a';c.beginPath();c.moveTo(-R*.9,-R*.9);c.lineTo(-R*.3,-R*.9);c.lineTo(-R*.6,-R*.55);c.lineTo(-R*.9,-R*.4);c.closePath();c.fill();}
  }
  function stoneDraw(c){
    c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=6;c.shadowOffsetY=4;const g=c.createLinearGradient(-R,-R,R,R);g.addColorStop(0,'#b8bcc8');g.addColorStop(1,'#5a5e6e');c.beginPath();c.moveTo(-R*.85,-R*.4);c.lineTo(-R*.45,-R*.9);c.lineTo(R*.5,-R*.85);c.lineTo(R*.92,-R*.3);c.lineTo(R*.85,R*.5);c.lineTo(R*.4,R*.92);c.lineTo(-R*.5,R*.88);c.lineTo(-R*.92,R*.35);c.closePath();c.fillStyle=g;c.fill();c.restore();
    c.strokeStyle='#33363f';c.lineWidth=2.5;c.stroke();c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=2;c.beginPath();c.moveTo(-R*.7,-R*.4);c.lineTo(-R*.4,-R*.75);c.lineTo(R*.3,-R*.72);c.stroke();
    c.strokeStyle='rgba(30,32,40,.55)';c.beginPath();c.moveTo(-R*.2,-R*.3);c.lineTo(R*.1,R*.05);c.lineTo(-R*.1,R*.5);c.moveTo(R*.1,R*.05);c.lineTo(R*.5,R*.2);c.stroke();
  }
  function iceDraw(c,hp){
    const a=.28+.14*hp;c.save();const g=c.createLinearGradient(-R,-R,R,R);g.addColorStop(0,'rgba(220,250,255,'+(a+.25)+')');g.addColorStop(1,'rgba(90,200,255,'+a+')');c.beginPath();rr(c,-R*.95,-R*.95,R*1.9,R*1.9,10);c.fillStyle=g;c.fill();c.lineWidth=2+hp;c.strokeStyle='rgba(235,252,255,.95)';c.stroke();
    c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=2;c.beginPath();c.moveTo(-R*.7,-R*.5);c.lineTo(-R*.3,-R*.8);c.moveTo(R*.5,R*.75);c.lineTo(R*.8,R*.4);c.stroke();
    for(let i=0;i<hp;i++){c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1.6;c.beginPath();c.moveTo(-R*.5+i*R*.4,R*.1);c.lineTo(-R*.3+i*R*.4,-R*.2);c.stroke();}
    c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.ellipse(-R*.4,-R*.55,R*.3,R*.1,-.5,0,7);c.fill();c.restore();
  }
  function crossOverlay(c){
    c.save();c.lineJoin='round';c.fillStyle='#ffe14a';c.strokeStyle='#8a5a00';c.lineWidth=3;const w=R*.2,l=R*.95;c.beginPath();c.moveTo(-w,-l);c.lineTo(w,-l);c.lineTo(w,-w);c.lineTo(l,-w);c.lineTo(l,w);c.lineTo(w,w);c.lineTo(w,l);c.lineTo(-w,l);c.lineTo(-w,w);c.lineTo(-l,w);c.lineTo(-l,-w);c.lineTo(-w,-w);c.closePath();c.globalAlpha=.9;c.fill();c.globalAlpha=1;c.stroke();
    c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.ellipse(-R*.05,-R*.7,R*.1,R*.05,0,0,7);c.fill();c.restore();
  }
  function make(draw,size){const cv=document.createElement('canvas');cv.width=cv.height=size;const c=cv.getContext('2d');c.scale(size/100,size/100);c.translate(50,50);draw(c);return cv;}
  const iconCache={};
  const api={
    COLS,MID,GLYPH,
    build(cell,dpr,shapes){
      const size=Math.max(24,Math.ceil(cell*dpr)),S={};
      for(let t=0;t<6;t++){S[t]=make(c=>body(c,t,1,null,shapes),size);S[t+'h']=make(c=>body(c,t,1,'h',shapes),size);S[t+'v']=make(c=>body(c,t,1,'v',shapes),size);S[t+'w']=make(c=>wrapped(c,t,shapes),size);}
      for(let t=0;t<6;t++)S[t+'x']=make(c=>{body(c,t,1,null,shapes);crossOverlay(c);},size);
      for(let d=0;d<3;d++)S['box'+d]=make(c=>boxDraw(c,d),size);for(let d=0;d<4;d++)S['crate'+d]=make(c=>crateDraw(c,d),size);S.stone=make(stoneDraw,size);for(let h=1;h<=3;h++)S['ice'+h]=make(c=>iceDraw(c,h),size);
      S.b=make(bomb,size);S.choc=make(choc,size);return S;
    },
    key(x){return x.s==='b'?'b':x.s?x.t+x.s:''+x.t;},
    icon(k){ if(iconCache[k])return iconCache[k];
      let cv;if(k==='bomb')cv=make(bomb,96);else if(k==='choc')cv=make(choc,96);else if(k==='striped')cv=make(c=>body(c,0,1,'v'),96);
      else if(k==='wrapped')cv=make(c=>wrapped(c,3),96);else if(k==='box')cv=make(c=>boxDraw(c,0),96);else if(k==='crate')cv=make(c=>crateDraw(c,0),96);else if(k==='stone')cv=make(stoneDraw,96);else if(k==='ice')cv=make(c=>{body(c,1,1);iceDraw(c,2);},96);else if(k==='cross')cv=make(c=>{body(c,3,1);crossOverlay(c);},96);else if(k==='jelly'){cv=make(c=>{c.beginPath();rr(c,-34,-34,68,68,14);c.fillStyle='rgba(140,230,255,.75)';c.fill();c.lineWidth=5;c.strokeStyle='#d6f7ff';c.stroke();c.fillStyle='rgba(255,255,255,.8)';c.beginPath();c.ellipse(-12,-18,14,6,-.4,0,7);c.fill();},96);}
      else cv=make(c=>body(c,+k,1),96);
      return iconCache[k]=cv.toDataURL();},
    tile(t,s){const sz=60;const cv=make(c=>{if(s==='b')bomb(c);else if(s==='w')wrapped(c,t);else body(c,t,1,s||null);},sz);return cv;},
    /* ---------- scenery ---------- */
    THEMES:[null,
      {sky:['#4fc3ff','#cdf2ff'],g:['#7be04f','#3fb23a'],acc:['#ff6fb5','#ffd23f','#7b5cff','#5ad1ff'],water:'#4cc9ff',deco:['house','tree','lolli','tree','bush','tree','cane']},
      {sky:['#ff9f5a','#ffe3b8'],g:['#b8794a','#7d4a28'],acc:['#fff0d6','#ff6fb5','#ffd23f','#d9a066'],water:'#6b3a1c',deco:['mount','choc','lolli','bush']},
      {sky:['#6fc0ff','#e6d6ff'],g:['#9be86f','#47c26a'],acc:['#ff4f9a','#ffd23f','#8f5bff','#3ad0ff'],water:'#6fd6ff',deco:['tree','lolli','tree','lolli','cane','bush']},
      {sky:['#2fd4ea','#d0fff3'],g:['#86ecd2','#2fbfae'],acc:['#ff7ac8','#ffe45e','#9b7bff','#7dffb0'],water:'#2f9bff',deco:['jelly','house','jelly','bush']},
      {sky:['#7a4dff','#ffbfe9'],g:['#e0b4ff','#a470ff'],acc:['#ff6fb5','#ffd23f','#5ad1ff','#fff'],water:'#ff9ae0',deco:['castle','lolli','rainbow','bush']}],
    cloud(c,x,y,s){c.fillStyle='rgba(255,255,255,.92)';c.beginPath();[[0,0,26],[24,-10,30],[52,0,26],[26,8,28]].forEach(([a,b,r])=>{c.moveTo(x+a*s+r*s,y+b*s);c.arc(x+a*s,y+b*s,r*s,0,7);});c.fill();},
    lolli(c,x,y,s,col){c.fillStyle='#fff';c.fillRect(x-3*s,y-10*s,6*s,40*s);c.strokeStyle='#e8d9ff';c.lineWidth=1;c.strokeRect(x-3*s,y-10*s,6*s,40*s);
      const cs=[col[0],col[1]];for(let i=5;i>0;i--){c.beginPath();c.arc(x,y-30*s,i*7*s,0,7);c.fillStyle=cs[i%2];c.fill();}const lg=c.createRadialGradient(x-10*s,y-42*s,2,x,y-30*s,36*s);lg.addColorStop(0,'rgba(255,255,255,.55)');lg.addColorStop(1,'rgba(0,0,60,.2)');c.fillStyle=lg;c.beginPath();c.arc(x,y-30*s,35*s,0,7);c.fill();c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=2*s;c.beginPath();c.arc(x,y-30*s,35*s,0,7);c.stroke();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.ellipse(x-12*s,y-44*s,9*s,4*s,-.6,0,7);c.fill();},
    house(c,x,y,s,col){c.fillStyle='#fff3e0';c.fillRect(x-24*s,y-22*s,48*s,34*s);c.fillStyle=col[3]||'#ffd';c.fillRect(x-24*s,y-6*s,48*s,4*s);
      c.fillStyle=col[0];c.beginPath();c.moveTo(x-30*s,y-20*s);c.lineTo(x,y-52*s);c.lineTo(x+30*s,y-20*s);c.closePath();c.fill();c.fillStyle='#fff';[-18,-4,10,22].forEach((d,i)=>{c.beginPath();c.arc(x+d*s,y-20*s,5*s,0,7);c.fill();});
      c.fillStyle=col[2];c.beginPath();rr(c,x-6*s,y-4*s,12*s,16*s,6*s);c.fill();c.fillStyle='#8fdcff';c.fillRect(x-20*s,y-16*s,9*s,9*s);c.fillRect(x+11*s,y-16*s,9*s,9*s);},
    bush(c,x,y,s,col){[[0,0,14,col[0]],[14,2,11,col[1]],[-13,3,10,col[2]]].forEach(([a,b,r,f])=>{c.fillStyle=f;c.beginPath();c.arc(x+a*s,y+b*s,r*s,0,7);c.fill();c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.arc(x+a*s-r*.3*s,y+b*s-r*.3*s,r*.25*s,0,7);c.fill();});},
    tree(c,x,y,s,col){c.fillStyle='#8a5a2a';c.fillRect(x-4*s,y-8*s,8*s,22*s);[[0,-34,20,'#2fa83a'],[-13,-22,15,'#3fc04a'],[13,-22,15,'#3fc04a'],[0,-18,17,'#46cc50']].forEach(([a,b,r,f])=>{const g=c.createRadialGradient(x+a*s-r*.3*s,y+b*s-r*.3*s,1,x+a*s,y+b*s,r*s);g.addColorStop(0,'#9cff7a');g.addColorStop(.45,f);g.addColorStop(1,'#1f7a2a');c.fillStyle=g;c.beginPath();c.arc(x+a*s,y+b*s,r*s,0,7);c.fill();});c.fillStyle=col[0];[[-8,-40],[6,-30],[-14,-22],[12,-20]].forEach(([a,b])=>{c.beginPath();c.arc(x+a*s,y+b*s,2.4*s,0,7);c.fill();});},
    cane(c,x,y,s){c.lineCap='round';c.lineWidth=7*s;c.strokeStyle='#fff';c.beginPath();c.moveTo(x,y+20*s);c.lineTo(x,y-22*s);c.arc(x+9*s,y-22*s,9*s,Math.PI,0);c.stroke();c.strokeStyle='#ff3b4f';c.setLineDash([5*s,7*s]);c.stroke();c.setLineDash([]);},
    mount(c,x,y,s){c.fillStyle='#6a3a1c';c.beginPath();c.moveTo(x-45*s,y+10*s);c.lineTo(x,y-70*s);c.lineTo(x+45*s,y+10*s);c.closePath();c.fill();c.fillStyle='#fff0d6';c.beginPath();c.moveTo(x-16*s,y-42*s);c.lineTo(x,y-70*s);c.lineTo(x+16*s,y-42*s);c.quadraticCurveTo(x+8*s,y-34*s,x+2*s,y-44*s);c.quadraticCurveTo(x-6*s,y-32*s,x-16*s,y-42*s);c.fill();},
    choc(c,x,y,s){c.fillStyle='#5a2d12';c.fillRect(x-18*s,y-18*s,36*s,28*s);c.strokeStyle='#2c1406';c.lineWidth=2;c.strokeRect(x-18*s,y-18*s,36*s,28*s);c.beginPath();c.moveTo(x,y-18*s);c.lineTo(x,y+10*s);c.moveTo(x-18*s,y-4*s);c.lineTo(x+18*s,y-4*s);c.stroke();},
    jelly(c,x,y,s,col){c.save();c.globalAlpha=.85;const g=c.createLinearGradient(x,y-40*s,x,y+10*s);g.addColorStop(0,col[0]);g.addColorStop(1,col[2]);c.fillStyle=g;c.beginPath();c.moveTo(x-30*s,y+10*s);c.quadraticCurveTo(x-30*s,y-42*s,x,y-42*s);c.quadraticCurveTo(x+30*s,y-42*s,x+30*s,y+10*s);c.closePath();c.fill();c.restore();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.ellipse(x-12*s,y-26*s,8*s,12*s,.4,0,7);c.fill();c.fillStyle='#ffd23f';c.beginPath();c.arc(x,y-46*s,5*s,0,7);c.fill();},
    castle(c,x,y,s,col){c.fillStyle='#fff3fb';c.fillRect(x-40*s,y-30*s,80*s,40*s);[-40,-6,28].forEach((d,i)=>{const h=i===1?70:50;c.fillStyle='#fff3fb';c.fillRect(x+d*s,y-h*s,24*s,h*s);c.fillStyle=col[i%3];c.beginPath();c.moveTo(x+(d-4)*s,y-h*s);c.lineTo(x+(d+12)*s,y-(h+30)*s);c.lineTo(x+(d+28)*s,y-h*s);c.fill();});c.fillStyle=col[1];c.beginPath();rr(c,x-9*s,y-8*s,18*s,18*s,9*s);c.fill();},
    rainbow(c,x,y,s){['#ff3b4f','#ff8f1f','#ffd21a','#3ed425','#2f8cff','#c24ff0'].forEach((cl,i)=>{c.strokeStyle=cl;c.lineWidth=7*s;c.beginPath();c.arc(x,y,(60-i*7)*s,Math.PI,0);c.stroke();});},
    sky(c,w,h,T,seed=1){
      const g=c.createLinearGradient(0,0,0,h*.7);g.addColorStop(0,T.sky[0]);g.addColorStop(1,T.sky[1]);c.fillStyle=g;c.fillRect(0,0,w,h);
      const sc=w/360,rnd=Engine.mulberry(seed*31+5);
      const sg=c.createRadialGradient(w*.82,h*.08,4,w*.82,h*.08,h*.55);sg.addColorStop(0,'rgba(255,255,235,.95)');sg.addColorStop(.25,'rgba(255,255,220,.35)');sg.addColorStop(1,'rgba(255,255,220,0)');c.fillStyle=sg;c.fillRect(0,0,w,h);
      c.save();c.translate(w*.82,h*.08);for(let i=0;i<8;i++){c.rotate(Math.PI/8);c.fillStyle='rgba(255,255,255,.07)';c.beginPath();c.moveTo(0,0);c.lineTo(-18*sc,h);c.lineTo(18*sc,h);c.closePath();c.fill();}c.restore();
      for(let i=0;i<7;i++){const mx=(i+.5)*w/7,mh=h*(.1+rnd()*.07),mg=c.createLinearGradient(0,h*.6-mh,0,h*.62);mg.addColorStop(0,'rgba(255,255,255,.6)');mg.addColorStop(1,'rgba(255,190,235,.4)');c.fillStyle=mg;c.beginPath();c.moveTo(mx-w*.12,h*.62);c.quadraticCurveTo(mx,h*.6-mh*1.6,mx+w*.12,h*.62);c.fill();}
      for(let i=0;i<5;i++)api.cloud(c,rnd()*w,h*(.04+rnd()*.3),(.7+rnd()*.6)*sc);
      [[.62,T.g[0]],[.72,T.g[1]]].forEach(([y,col],i)=>{c.fillStyle=col;c.beginPath();c.moveTo(0,h);c.lineTo(0,h*y);for(let x=0;x<=w;x+=w/8)c.quadraticCurveTo(x+w/16,h*(y-.06-rnd()*.04),x+w/8,h*y+(i?10:0));c.lineTo(w,h);c.fill();});
      c.lineCap='round';c.lineJoin='round';[['#fff6d0',.2],['#ffd98a',.15]].forEach(([col,wd])=>{c.strokeStyle=col;c.lineWidth=w*wd;c.beginPath();c.moveTo(w*.55,h*1.02);c.bezierCurveTo(w*.05,h*.92,w*.95,h*.82,w*.4,h*.74);c.bezierCurveTo(w*.1,h*.7,w*.7,h*.66,w*.5,h*.62);c.stroke();});
      const items=[];for(let i=0;i<10;i++)items.push([(i%2?.06+rnd()*.2:.74+rnd()*.22)*w,h*(.64+rnd()*.3),T.deco[i%T.deco.length]]);items.sort((a,b)=>a[1]-b[1]);
      items.forEach(([x,y,k])=>api[k](c,x,y,sc*(.95+(y/h-.6)*2),T.acc));
      for(let i=0;i<26;i++){c.fillStyle='rgba(255,255,255,'+(.3+rnd()*.5)+')';c.beginPath();c.arc(rnd()*w,rnd()*h*.6,(1+rnd()*2)*sc,0,7);c.fill();}
      const gg=c.createLinearGradient(0,h*.85,0,h);gg.addColorStop(0,'rgba(0,0,0,0)');gg.addColorStop(1,'rgba(0,30,90,.25)');c.fillStyle=gg;c.fillRect(0,h*.85,w,h*.15);
    },
    land(c,w,h,T,seed=1){
      const rnd=Engine.mulberry(seed*77+3),sc=w/360;
      const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,T.g[0]);g.addColorStop(.5,T.g[1]);g.addColorStop(1,T.g[0]);c.fillStyle=g;c.fillRect(0,0,w,h);
      for(let i=0;i<h/40;i++){c.fillStyle='rgba(255,255,255,.07)';c.beginPath();c.ellipse(rnd()*w,rnd()*h,(20+rnd()*50)*sc,(8+rnd()*18)*sc,0,0,7);c.fill();}
      c.lineCap='round';c.strokeStyle=T.water;c.lineWidth=30*sc;c.beginPath();for(let y=0;y<=h;y+=20){const x=w*(.12+.1*Math.sin(y/180+seed));y?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
      c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=4*sc;c.beginPath();for(let y=0;y<=h;y+=20){const x=w*(.12+.1*Math.sin(y/180+seed))-6*sc;y?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
      const items=[];const n=Math.floor(h/34);for(let i=0;i<n;i++){const left=rnd()<.5;items.push([left?rnd()*w*.25+w*.05:w*.68+rnd()*w*.3,i*h/n+rnd()*30,T.deco[Math.floor(rnd()*T.deco.length)]]);}
      for(let i=0;i<n/2;i++)items.push([w*(.05+rnd()*.9),rnd()*h,T.deco[Math.floor(rnd()*T.deco.length)]]);
      items.sort((a,b)=>a[1]-b[1]).forEach(([x,y,k])=>api[k](c,x,y,sc*(.85+rnd()*.35),T.acc));
      for(let i=0;i<h/260;i++)api.cloud(c,rnd()<.5?-10:w-60,rnd()*h,sc*(.9+rnd()*.5));
    },
    paint(w,h,theme,mode,seed,scale=1){const cv=document.createElement('canvas');cv.width=Math.round(w*scale);cv.height=Math.round(h*scale);const c=cv.getContext('2d');c.scale(scale,scale);api[mode](c,w,h,api.THEMES[theme],seed||theme);return cv.toDataURL('image/jpeg',.82);},
    /* ---------- logo / mascot ---------- */
    _n:0,
    logo(){const n=++api._n;return api.logoRaw().replace(/id="(\w+)"/g,(m,i)=>'id="'+i+n+'"').replace(/url\(#(\w+)\)/g,(m,i)=>'url(#'+i+n+')');},
    logoRaw(sm){return `<svg class="logo" viewBox="0 0 400 365" xmlns="http://www.w3.org/2000/svg" aria-label="MG Candy Blast">
<defs>
<linearGradient id="gy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8b0"/><stop offset=".4" stop-color="#ffd21a"/><stop offset="1" stop-color="#ff8c00"/></linearGradient>
<linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb0f5"/><stop offset=".5" stop-color="#e83fd0"/><stop offset="1" stop-color="#9a1fb8"/></linearGradient>
<linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b0f4ff"/><stop offset=".5" stop-color="#2aa8ff"/><stop offset="1" stop-color="#1250d0"/></linearGradient>
<linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6a6a"/><stop offset="1" stop-color="#b3101f"/></linearGradient>
<radialGradient id="gc" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#ff5a7a"/><stop offset="1" stop-color="#b0102e"/></radialGradient>
<radialGradient id="gch" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#b07a54"/><stop offset="1" stop-color="#3a1c0c"/></radialGradient>
<radialGradient id="gg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#d6ff9a"/><stop offset="1" stop-color="#2fa31a"/></radialGradient>
<filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="3" flood-color="#2a0a50" flood-opacity=".6"/></filter>
</defs>
<g filter="url(#sh)">
<circle cx="52" cy="78" r="28" fill="url(#gch)" stroke="#2a0e00" stroke-width="3"/><circle cx="44" cy="68" r="4" fill="#ffd21a"/><circle cx="62" cy="84" r="4" fill="#3ed425"/><circle cx="52" cy="95" r="3.500" fill="#2f8cff"/><ellipse cx="42" cy="62" rx="9" ry="4" fill="#fff" opacity=".6"/>
<circle cx="352" cy="100" r="30" fill="url(#gc)" stroke="#7a0a20" stroke-width="3"/><path d="M335 82l32 36M326 98l30 34M346 74l26 28" stroke="#fff" stroke-width="7" opacity=".9"/>
<circle cx="30" cy="190" r="21" fill="url(#gg)" stroke="#1a6a10" stroke-width="3"/><ellipse cx="372" cy="200" rx="24" ry="13" transform="rotate(-30 372 200)" fill="url(#gc)" stroke="#7a0a20" stroke-width="3"/>
<text x="200" y="120" text-anchor="middle" font-size="124" textLength="200" lengthAdjust="spacingAndGlyphs" class="lt" fill="url(#gy)" stroke="#5a2400" stroke-width="13" paint-order="stroke" stroke-linejoin="round">MG</text>
<text x="200" y="208" text-anchor="middle" font-size="88" textLength="320" lengthAdjust="spacingAndGlyphs" class="lt" fill="url(#gp)" stroke="#3c0a5a" stroke-width="12" paint-order="stroke" stroke-linejoin="round">Candy</text>
<text x="200" y="288" text-anchor="middle" font-size="88" textLength="270" lengthAdjust="spacingAndGlyphs" class="lt" fill="url(#gb)" stroke="#0a2a7a" stroke-width="12" paint-order="stroke" stroke-linejoin="round">Blast</text>
<path d="M170 34l12 24 18-34 18 34 12-24 6 40h-72z" fill="url(#gy)" stroke="#8a4a00" stroke-width="3" stroke-linejoin="round"/><circle cx="200" cy="24" r="5" fill="#ff3b4f"/><circle cx="170" cy="34" r="4" fill="#ff3b4f"/><circle cx="236" cy="34" r="4" fill="#2f8cff"/>
<g fill="#fff" opacity=".75"><ellipse cx="120" cy="52" rx="20" ry="5" transform="rotate(-8 120 52)"/><ellipse cx="108" cy="140" rx="24" ry="5" transform="rotate(-6 108 140)"/><ellipse cx="124" cy="224" rx="24" ry="5"/></g>
</g>
<g filter="url(#sh)"><path d="M6 312l56 0 0 40-56 0 18-20z" fill="#8a0c1a"/><path d="M394 312l-56 0 0 40 56 0-18-20z" fill="#8a0c1a"/><path d="M48 304Q200 290 352 304L352 350Q200 336 48 350Z" fill="url(#gr)" stroke="#5a0610" stroke-width="3" stroke-linejoin="round"/><path d="M52 308Q200 294 348 308" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/></g>
<text x="200" y="335" text-anchor="middle" font-size="27" textLength="270" lengthAdjust="spacingAndGlyphs" class="lt" fill="#fff0b0" stroke="#5a0610" stroke-width="5" paint-order="stroke" stroke-linejoin="round">Match • Blast • Win!</text>
</svg>`;},
    mascot(){return `<svg class="mascot" viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="mb" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#ffc0e0"/><stop offset=".6" stop-color="#ff5aa8"/><stop offset="1" stop-color="#c81f7a"/></radialGradient><linearGradient id="mc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff59a"/><stop offset="1" stop-color="#ffa800"/></linearGradient></defs>
<ellipse cx="60" cy="122" rx="38" ry="7" fill="rgba(0,0,0,.25)"/>
<ellipse cx="22" cy="86" rx="11" ry="15" fill="url(#mb)" transform="rotate(25 22 86)" stroke="#a01562" stroke-width="2"/><ellipse cx="98" cy="86" rx="11" ry="15" fill="url(#mb)" transform="rotate(-25 98 86)" stroke="#a01562" stroke-width="2"/>
<ellipse cx="60" cy="82" rx="46" ry="40" fill="url(#mb)" stroke="#a01562" stroke-width="3"/>
<path d="M32 46l8-24 10 14 10-20 10 20 10-14 8 24z" fill="url(#mc)" stroke="#8a4a00" stroke-width="2.5" stroke-linejoin="round"/><circle cx="60" cy="18" r="4" fill="#ff3b4f"/>
<ellipse cx="42" cy="78" rx="12" ry="14" fill="#fff"/><ellipse cx="78" cy="78" rx="12" ry="14" fill="#fff"/><circle cx="44" cy="81" r="8" fill="#2a6bff"/><circle cx="76" cy="81" r="8" fill="#2a6bff"/><circle cx="44" cy="81" r="4" fill="#0a1a50"/><circle cx="76" cy="81" r="4" fill="#0a1a50"/><circle cx="47" cy="77" r="3" fill="#fff"/><circle cx="79" cy="77" r="3" fill="#fff"/>
<ellipse cx="30" cy="96" rx="7" ry="4.5" fill="#ff8ab8"/><ellipse cx="90" cy="96" rx="7" ry="4.5" fill="#ff8ab8"/>
<path d="M48 98q12 14 24 0z" fill="#8a0f3a" stroke="#6a0a2a" stroke-width="2" stroke-linejoin="round"/><path d="M52 100q8 7 16 0z" fill="#ff7a9a"/>
<ellipse cx="42" cy="58" rx="14" ry="6" fill="#fff" opacity=".45" transform="rotate(-20 42 58)"/></svg>`;}
  };
  /* ---- decorations and palettes for worlds 6-20 ---- */
  api.cookie=function(c,x,y,s,col){c.fillStyle='#c98a4a';c.beginPath();c.arc(x,y-14*s,18*s,0,7);c.fill();c.strokeStyle='#8a5a2a';c.lineWidth=2;c.stroke();c.fillStyle='#4a2a14';[[-7,-18],[5,-22],[8,-10],[-4,-8],[0,-15]].forEach(([a,b])=>{c.beginPath();c.arc(x+a*s,y+b*s,3*s,0,7);c.fill();});c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(x-7*s,y-24*s,6*s,3*s,-.5,0,7);c.fill();};
  api.icecream=function(c,x,y,s,col){c.fillStyle='#e0a860';c.beginPath();c.moveTo(x-12*s,y-18*s);c.lineTo(x+12*s,y-18*s);c.lineTo(x,y+14*s);c.closePath();c.fill();c.strokeStyle='#a87030';c.lineWidth=1.5;c.stroke();[[col[0],0,-26],[col[1],-9,-22],[col[2],9,-22]].forEach(([f,a,b])=>{c.fillStyle=f;c.beginPath();c.arc(x+a*s,y+b*s,12*s,0,7);c.fill();});c.fillStyle='#ff3b4f';c.beginPath();c.arc(x,y-40*s,4*s,0,7);c.fill();};
  api.crystal=function(c,x,y,s,col){[[-14,24,.8],[0,34,1],[14,22,.7]].forEach(([a,h,k],i)=>{const g=c.createLinearGradient(x+a*s,y-h*s,x+a*s,y);g.addColorStop(0,'#f2e4ff');g.addColorStop(1,col[i%col.length]);c.fillStyle=g;c.beginPath();c.moveTo(x+a*s,y-h*s*1.6);c.lineTo(x+(a+9)*s,y-h*s*.6);c.lineTo(x+(a+6)*s,y);c.lineTo(x+(a-6)*s,y);c.lineTo(x+(a-9)*s,y-h*s*.6);c.closePath();c.fill();c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1.5;c.stroke();});};
  api.marsh=function(c,x,y,s,col){c.fillStyle='#fff';c.strokeStyle='#e0d4f4';c.lineWidth=2;[[-12,0],[12,0],[0,-16]].forEach(([a,b])=>{c.beginPath();rr(c,x+a*s-13*s,y+b*s-18*s,26*s,24*s,10*s);c.fill();c.stroke();});c.fillStyle='rgba(255,170,220,.5)';c.beginPath();c.ellipse(x,y-26*s,8*s,4*s,0,0,7);c.fill();};
  api.bubble=function(c,x,y,s,col){const g=c.createRadialGradient(x-6*s,y-26*s,2,x,y-20*s,18*s);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.5,'rgba(150,230,255,.45)');g.addColorStop(1,'rgba(60,170,255,.55)');c.fillStyle=g;c.beginPath();c.arc(x,y-20*s,18*s,0,7);c.fill();c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=2;c.stroke();};
  api.tower=function(c,x,y,s,col){c.fillStyle='#fff3fb';c.fillRect(x-12*s,y-62*s,24*s,66*s);c.strokeStyle='#d8b0e0';c.lineWidth=1.5;c.strokeRect(x-12*s,y-62*s,24*s,66*s);c.fillStyle=col[0];c.beginPath();c.moveTo(x-16*s,y-62*s);c.lineTo(x,y-90*s);c.lineTo(x+16*s,y-62*s);c.closePath();c.fill();c.fillStyle=col[2];c.beginPath();rr(c,x-5*s,y-8*s,10*s,12*s,5*s);c.fill();c.fillStyle='#8fdcff';[-40,-24].forEach(b=>c.fillRect(x-4*s,y+b*s,8*s,8*s));};
  api.gummy=function(c,x,y,s,col){const f=col[0];c.fillStyle=f;c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=2;[[-11,-34,8],[11,-34,8]].forEach(([a,b,r])=>{c.beginPath();c.arc(x+a*s,y+b*s,r*s,0,7);c.fill();c.stroke();});c.beginPath();c.arc(x,y-20*s,15*s,0,7);c.fill();c.stroke();c.beginPath();c.ellipse(x,y-2*s,13*s,12*s,0,0,7);c.fill();c.stroke();c.fillStyle='#3a1a0a';[-5,5].forEach(a=>{c.beginPath();c.arc(x+a*s,y-22*s,2*s,0,7);c.fill();});c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.ellipse(x-6*s,y-26*s,5*s,3*s,-.5,0,7);c.fill();};
  const P=(sky,g,acc,deco,water)=>({sky,g,acc,water:water||'#4cc9ff',deco});
  [P(['#7ad0ff','#fff0c8'],['#9be86f','#5ad08a'],['#ff6fb5','#ffd23f','#7b5cff','#5ad1ff'],['rainbow','lolli','bush','house']),
   P(['#ffd08a','#fff0d0'],['#d9a066','#a8703a'],['#ffe0b0','#ff6fb5','#ffd23f','#c98a4a'],['cookie','castle','cookie','bush'],'#8a5a2a'),
   P(['#bfe6ff','#ffffff'],['#f4ecff','#d8c8f0'],['#ffc0e8','#c0d8ff','#fff','#d8c0ff'],['marsh','mount','marsh','cane'],'#b8d8ff'),
   P(['#2fd0ff','#d6fff8'],['#7fe0ff','#2a9ae0'],['#ff7ac8','#ffe45e','#7dffb0','#fff'],['bubble','jelly','bubble','house'],'#2a7aff'),
   P(['#ffb25a','#ffe0a8'],['#f0b050','#c88428'],['#ffe0a0','#d9843a','#ff6fb5','#fff0c0'],['mount','choc','cane','bush'],'#c8782a'),
   P(['#7ad8ff','#e8ffd0'],['#8aea6a','#3ac04a'],['#ff4a4a','#ffd23f','#ff9a2a','#4acb4a'],['gummy','gummy','bush','lolli']),
   P(['#5a3aa0','#b080ff'],['#6a4ac0','#3a2a80'],['#ff9af0','#7ad8ff','#ffe45e','#b0ff9a'],['crystal','crystal','jelly','bush'],'#7a5aff'),
   P(['#ff9ad8','#ffe0f4'],['#ff7ac0','#d04a9a'],['#ffd23f','#7ad8ff','#b07aff','#fff'],['house','tower','bubble','lolli'],'#ff9ae0'),
   P(['#9ad0ff','#ffffff'],['#ffe0f0','#f0a8d0'],['#ff6fb5','#ffd23f','#7b5cff','#5ad1ff'],['castle','castle','cane','marsh'],'#ffb0e0'),
   P(['#ff8a5a','#ffd8a0'],['#8a4a2a','#5a2a14'],['#ff6a1a','#ffd23f','#ff9a5a','#c98a4a'],['mount','choc','mount','crystal'],'#ff6a1a'),
   P(['#6ab8ff','#ffffff'],['#ffffff','#d8ecff'],['#ff9ad8','#ffe27a','#9ad8ff','#d0b0ff'],['marsh','castle','rainbow','bubble'],'#b0d8ff'),
   P(['#3ac8ff','#c8f4ff'],['#3aa0ff','#1a60c8'],['#ff7ac8','#ffe45e','#7dffb0','#fff'],['bubble','rainbow','jelly','bubble'],'#1a90ff'),
   P(['#a06a3a','#e0b080'],['#6a3a1a','#40200a'],['#ffd23f','#ff6fb5','#e0a060','#fff0d0'],['tower','choc','cane','choc'],'#4a2410'),
   P(['#4a2a9a','#e07af0'],['#8a5ae0','#5a30b0'],['#ffe45e','#7ad8ff','#ff9af0','#b0ff9a'],['tower','crystal','castle','rainbow'],'#a07aff'),
   P(['#ff6ad0','#ffe27a'],['#7be04f','#ff9ad8'],['#ff6fb5','#ffd23f','#7b5cff','#5ad1ff'],['castle','rainbow','lolli','tower'],'#ff9ae0')
  ].forEach(t=>api.THEMES.push(t));
  return api;
})();
