import os
ROOT=os.environ.get('MG_ROOT',os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')))
URL='file://'+ROOT+'/index.html'
from playwright.sync_api import sync_playwright
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':780})
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'ERR_NAME' not in m.text else None)
    pg.add_init_script("""window.__spoken=[];window.__shown=[];
      (function(){const fake={speak(u){window.__spoken.push({t:u.text,at:Date.now()});setTimeout(()=>u.onend&&u.onend(),350);},cancel(){},getVoices(){return[]},onvoiceschanged:null};
      Object.defineProperty(window,'speechSynthesis',{value:fake,configurable:true});window.SpeechSynthesisUtterance=function(t){this.text=t;};})();
      document.addEventListener('DOMContentLoaded',()=>{new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.classList&&n.classList.contains('msg'))window.__shown.push({t:n.querySelector('.fr').textContent,at:Date.now()});}))).observe(document.getElementById('msgs'),{childList:true});});""")
    pg.goto(URL);pg.evaluate("localStorage.clear()");pg.reload();pg.wait_for_function("!document.querySelector('#loading')")
    R=pg.evaluate
    R("Store.d.unlocked=40;Store.d.lives=5;UI.launch(30)");pg.wait_for_timeout(1800)
    if R("!!document.querySelector('#tut')"):pg.click('#tut [data-a=skip]')
    R("window.__spoken.length=0;window.__shown.length=0")
    def info():
        i=R("(()=>{const cv=document.querySelector('#board'),b=cv.getBoundingClientRect(),g=Game.state;return {l:b.left,t:b.top,w:b.width,cols:g.L.cols}})()")
        cell=[c for c in range(20,140) if c*i['cols']+2*round(c*.15)==round(i['w'])][0];P=round(cell*.15)
        return i,cell,P
    def swap(a,bb):
        i,cell,P=info();xy=lambda k:(i['l']+P+(k%i['cols'])*cell+cell/2,i['t']+P+(k//i['cols'])*cell+cell/2)
        x1,y1=xy(a);x2,y2=xy(bb);pg.mouse.move(x1,y1);pg.mouse.down();pg.mouse.move(x2,y2,steps=4);pg.mouse.up()
    # special activation -> "Fantastic!"
    R("(()=>{const g=Game.state;g.b.g[3][3].s='b';g.b.g[3][3].t=6;g.b.g[3][4].s='h';})()")
    n=R("Game.state.L.cols");swap(3*n+3,3*n+4);pg.wait_for_timeout(3500)
    # then ordinary play for sweet / combos
    for _ in range(14):
        if R("Game.state.ended"):break
        mv=R("(()=>{const m=Game.state.b.moves(30);return m[Math.floor(Math.random()*m.length)]})()");swap(mv[0],mv[1]);pg.wait_for_timeout(2300)
    shown=R("window.__shown");spoken=R("window.__spoken")
    print('messages shown :',[s['t'] for s in shown])
    print('lines spoken   :',[s['t'] for s in spoken])
    norm=lambda s:s.lower().replace(' ','')
    shown_set={norm(s['t']) for s in shown}
    mism=[s['t'] for s in spoken if norm(s['t']) not in shown_set and s['t'] not in ("Let's get matching!",'Level complete! Amazing work!','Three stars! Fantastic!')]
    print('PASS' if not mism else 'FAIL','every spoken gameplay line matches a message that was on screen',mism)
    print('PASS' if any(norm(s['t'])=='fantastic!' for s in spoken) else 'FAIL','"Fantastic!" was spoken when it appeared')
    # voice off -> silent
    R("Store.d.settings.voice=false");n0=len(R("window.__spoken"));R("Voice.say('m_amazing',true)");print('PASS' if len(R("window.__spoken"))==n0 else 'FAIL','Voice OFF = no speech')
    print('errors',errs);b.close()
