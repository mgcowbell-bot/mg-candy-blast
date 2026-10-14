/* MG Candy Blast - synthesized audio (Web Audio API). No audio files needed. */
const Snd=(()=>{
  const recent={};
  let ctx=null,mus=null,sfx=null,timer=null,step=0,nextT=0,playing=false;
  const S=()=>Store.d.settings;
  function init(){
    if(!ctx){
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
      ctx=new AC();mus=ctx.createGain();sfx=ctx.createGain();
      const comp=ctx.createDynamicsCompressor();mus.connect(comp);sfx.connect(comp);comp.connect(ctx.destination);
      apply();
    }
    if(ctx.state==='suspended')ctx.resume();
    return true;
  }
  function apply(){if(!ctx)return;mus.gain.value=S().music?S().mvol*.35:0;sfx.gain.value=S().sfx?S().svol*.6:0;}
  function tone(f,d,type='sine',v=.3,to=null,delay=0){
    if(!ctx||!S().sfx)return;const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);g.connect(sfx);o.start(t);o.stop(t+d+.05);
  }
  function noise(d,v=.3,f=1800,delay=0){
    if(!ctx||!S().sfx)return;const t=ctx.currentTime+delay,n=Math.floor(ctx.sampleRate*d),b=ctx.createBuffer(1,n,ctx.sampleRate),a=b.getChannelData(0);
    for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);
    const s=ctx.createBufferSource(),fl=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=b;fl.type='lowpass';fl.frequency.value=f;g.gain.value=v;
    s.connect(fl);fl.connect(g);g.connect(sfx);s.start(t);
  }
  const N=n=>440*Math.pow(2,(n-69)/12);
  const lib={
    click(){tone(660,.07,'square',.12,880);},
    swap(){tone(380,.09,'sine',.2,560);},
    match(k=1){const b=60+Math.min(k,6)*2;tone(N(b+7),.14,'triangle',.28);tone(N(b+12),.18,'sine',.22,null,.06);tone(N(b+16),.2,'sine',.18,null,.12);},
    invalid(){tone(180,.18,'sawtooth',.18,110);},
    fall(){tone(300,.08,'sine',.1,160);},
    special(){tone(500,.35,'sawtooth',.18,1500);tone(N(84),.25,'sine',.2,null,.12);},
    blast(){noise(.45,.5,1500);tone(140,.4,'sawtooth',.3,40);tone(900,.2,'square',.1,200);},
    combo(k=2){for(let i=0;i<Math.min(k+1,5);i++)tone(N(72+i*3),.12,'triangle',.22,null,i*.06);},
    booster(){tone(300,.12,'square',.14,600);tone(600,.18,'triangle',.2,1200,.1);tone(N(88),.2,'sine',.15,null,.22);},
    star(){tone(N(84),.25,'sine',.28);tone(N(91),.35,'triangle',.22,null,.1);},
    win(){[72,76,79,84,88,91].forEach((n,i)=>tone(N(n),.3,'triangle',.28,null,i*.11));tone(N(96),.9,'sine',.2,null,.7);},
    lose(){[67,64,60,55].forEach((n,i)=>tone(N(n),.34,'sawtooth',.14,N(n)*.97,i*.22));},
    reward(){[76,81,85,88,93].forEach((n,i)=>tone(N(n),.2,'sine',.25,null,i*.09));noise(.15,.1,6000,.35);},
    life(){tone(N(72),.15,'sine',.3);tone(N(79),.15,'sine',.3,null,.1);tone(N(84),.3,'sine',.3,null,.2);},
    shuffle(){for(let i=0;i<5;i++)tone(300+i*80,.07,'square',.1,null,i*.05);},
    crack(){noise(.12,.35,2600);tone(220,.08,'square',.12,120);},
    crack2(){noise(.25,.5,1800);tone(160,.2,'sawtooth',.2,70);tone(520,.1,'triangle',.12,260,.05);},
    start(){[67,72,76].forEach((n,i)=>tone(N(n),.16,'triangle',.22,null,i*.08));},
    coin(){tone(N(88),.08,'square',.12);tone(N(95),.2,'square',.12,null,.07);},
    world(){[72,76,79,84,79,84,88].forEach((n,i)=>tone(N(n),.2,'triangle',.24,null,i*.09));},
    achv(){tone(N(79),.14,'sine',.28);tone(N(84),.14,'sine',.28,null,.1);tone(N(91),.4,'triangle',.26,null,.2);},
    select(){tone(520,.06,'sine',.16,700);}
  };
  const group={crack:'blast',crack2:'blast',start:'win',coin:'reward',world:'win',achv:'reward',select:'click',click:'click',match:'match',blast:'blast',special:'blast',win:'win',lose:'lose',life:'life',reward:'reward',booster:'booster',star:'win',combo:'match',invalid:'match',swap:'match',fall:'match',shuffle:'match'};
  // melody (C major pentatonic) for background music
  const mel=[72,74,76,79,76,74,72,69, 71,72,74,76,74,72,69,67, 72,76,79,81,79,76,74,72, 74,71,72,67,69,71,72,0];
  const bass=[48,48,53,53,55,55,48,43];
  function sched(){
    if(!ctx||!playing||!S().music)return;
    while(nextT<ctx.currentTime+.4){
      const nn=mel[step%mel.length],bt=bass[Math.floor(step/4)%bass.length];
      if(nn){const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=N(nn);g.gain.setValueAtTime(.0001,nextT);g.gain.exponentialRampToValueAtTime(.5,nextT+.02);g.gain.exponentialRampToValueAtTime(.0001,nextT+.38);o.connect(g);g.connect(mus);o.start(nextT);o.stop(nextT+.4);}
      if(step%4===0){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=N(bt);g.gain.setValueAtTime(.0001,nextT);g.gain.exponentialRampToValueAtTime(.6,nextT+.03);g.gain.exponentialRampToValueAtTime(.0001,nextT+1.1);o.connect(g);g.connect(mus);o.start(nextT);o.stop(nextT+1.2);}
      nextT+=.3;step++;
    }
  }
  const api={
    unlock(){init();api.syncMusic();},
    apply,
    play(name,arg){
      const g=group[name];if(!S().sfx||(g&&S().sfxOn[g]===false))return;
      const now=performance.now();if(recent[name]&&now-recent[name]<45)return;recent[name]=now; // no duplicate playback
      if(!init())return;if(lib[name])lib[name](arg);
    },
    preview(name,arg){ // previews ignore per-sound switches but respect master SFX
      if(!S().sfx||!init())return;if(lib[name])lib[name](arg);
    },
    syncMusic(){
      if(!ctx)return;apply();
      if(S().music&&!document.hidden){if(!playing){playing=true;step=0;nextT=ctx.currentTime+.1;timer=setInterval(sched,120);}}
      else{playing=false;clearInterval(timer);timer=null;}
    },
    pauseAll(){if(ctx&&ctx.state==='running')ctx.suspend();},
    resumeAll(){if(ctx&&ctx.state==='suspended')ctx.resume();},
    get ready(){return !!ctx;}
  };
  document.addEventListener('visibilitychange',()=>{if(document.hidden){api.pauseAll();}else{api.resumeAll();api.syncMusic();}});
  return api;
})();

/* ---------- Voice announcements ----------
   Uses recorded files from assets/voice/<id><VOICE_FILE_EXT> when VOICE_FILE_EXT is set (see assets/voice/README.txt).
   Otherwise the device's speech engine is the fallback. That is synthetic speech, NOT a human recording. */
const Voice=(()=>{
  const VOICE_FILE_EXT='';
  const LINES={m_sweet:'Sweet!',m_great:'Great!',m_excellent:'Excellent!',m_combo:'Great combo!',m_amazing:'Amazing!',m_fantastic:'Fantastic!',m_unbelievable:'Unbelievable!',m_record:'New record!',welcome:'Welcome to MG Candy Blast!',start:"Let's get matching!",nice:'Nice match!',great:'Great move!',awesome:'Awesome!',sweet:'Sweet!',fantastic:'Fantastic!',supercombo:'Super combo!',incredible:'Incredible!',excellent:'Excellent score!',fire:"You're on fire!",complete:'Level complete! Amazing work!',three:'Three stars! Fantastic!',try1:'Give it another try!',try2:"Don't give up! You can do it!",daily:'Your daily reward is ready!',power:'Power up!',choice:'Great choice!',world:'A new candy world awaits!',achv:'Achievement unlocked!'};
  const PRI={m_sweet:1,m_great:1,m_excellent:1,m_combo:2,m_amazing:2,m_fantastic:2,m_unbelievable:3,m_record:4,complete:4,three:4,achv:4,world:4,welcome:3,excellent:3,try1:3,try2:3,daily:3,start:2,fire:2,supercombo:2,incredible:2,fantastic:2,power:2,choice:2,sweet:1,nice:1,great:1,awesome:1};
  let curPri=0,busy=false,lastT=0,tok=0,voice=null,cur=null;const lastId={};
  const S=()=>Store.d.settings;
  function pick(){if(voice)return voice;if(!window.speechSynthesis)return null;const vs=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));voice=vs.find(v=>/google us english|samantha|zira|jenny|aria|natural|female/i.test(v.name))||vs[0]||null;return voice;}
  function stop(){tok++;try{if(cur){cur.pause();cur=null;}if(window.speechSynthesis)speechSynthesis.cancel();}catch(e){}busy=false;curPri=0;}
  function tts(text,my){
    const done=()=>{if(tok===my){busy=false;curPri=0;}};
    if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){done();return;}
    try{const u=new SpeechSynthesisUtterance(text),v=pick();if(v)u.voice=v;u.lang='en-US';u.rate=1.05;u.pitch=1.15;u.volume=Math.min(1,S().vvol);u.onend=done;u.onerror=done;speechSynthesis.speak(u);setTimeout(done,4500);}catch(e){done();}
  }
  function say(id,force){
    const st=S();if(!st.voice||st.vvol<=0||!LINES[id])return false;
    const p=PRI[id]||1,now=Date.now();
    if(busy&&p<=curPri&&!force)return false;                 // never overlap, only higher priority interrupts
    const msgLine=id.indexOf('m_')===0;                       // lines that read the on-screen message aloud react faster
    if(!force&&p<3&&!(msgLine&&p>=2)&&now-lastT<(msgLine?900:2000))return false;  // global cooldown for small lines
    if(!force&&p<4&&lastId[id]&&now-lastId[id]<(msgLine?2500:9000))return false; // per-line cooldown
    stop();const my=tok;lastId[id]=now;lastT=now;busy=true;curPri=p;
    if(VOICE_FILE_EXT){try{const au=new Audio('assets/voice/'+id+VOICE_FILE_EXT);au.volume=st.vvol;cur=au;au.onended=()=>{if(tok===my){busy=false;curPri=0;}};au.onerror=()=>tts(LINES[id],my);au.play().catch(()=>tts(LINES[id],my));return true;}catch(e){}}
    tts(LINES[id],my);return true;
  }
  if(window.speechSynthesis)speechSynthesis.onvoiceschanged=()=>{voice=null;};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  return {say,stop,LINES,usesFiles:!!VOICE_FILE_EXT};
})();
