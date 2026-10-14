import os
ROOT=os.environ.get('MG_ROOT',os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')))
URL='file://'+ROOT+'/index.html'
from playwright.sync_api import sync_playwright
import os,re,json
errs=[];res=[]
def check(n,ok,extra=''):res.append(ok);print(('PASS ' if ok else 'FAIL ')+n+(' '+str(extra) if extra else ''))
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':780})
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
    pg.on('console',lambda m:errs.append('CONSOLE '+m.type+' '+m.text) if m.type=='error' else None)
    reqs=set();pg.on('request',lambda r:reqs.add(r.url))
    pg.goto(URL);pg.evaluate("localStorage.clear()");pg.reload();pg.wait_for_function("!document.querySelector('#loading')")
    R=pg.evaluate
    def launch(n):
        R("document.querySelectorAll('#modals .modal').forEach(m=>m.remove())");R(f"Store.d.unlocked=Math.max(Store.d.unlocked,{n});Store.d.lives=5;Store.d.lifeTs=0;UI.launch({n})");pg.wait_for_timeout(1700)
        if R("!!document.querySelector('#tut')"):pg.click('#tut [data-a=skip]')
    # 1 life lost when Game Over is SHOWN (no need to press anything), refunded by +5 moves
    launch(40);R("Store.d.boosters.extra=2");lv0=R("Store.d.lives");R("Game.devLose()");pg.wait_for_timeout(1500)
    check('Game Over costs the life immediately (closing the app cannot avoid it)',R("Store.d.lives")==lv0-1,(lv0,R("Store.d.lives")))
    pg.click('#modals [data-a=extra]');pg.wait_for_timeout(500)
    check('Using +5 Moves refunds that life and resumes play',R("Store.d.lives")==lv0 and not R("Game.state.ended") and R("Game.state.moves")==5)
    # 2 first true 3-star clear pays once even if an old save had a 1-star entry
    launch(3);R("Store.d.levels[3]={stars:1,best:100};Store.save()");c0=R("Store.d.coins");R("Game.devWin()");pg.wait_for_timeout(2500);c1=R("Store.d.coins")
    check('Old 1-star level: reaching 3 stars pays only the star-upgrade bonus (not the full first-clear reward) and saves 3 stars',50<=c1-c0<100 and R('Store.d.levels[3].stars')==3,(c0,c1))
    R("document.querySelectorAll('#modals .modal').forEach(m=>m.remove())");launch(3);c2=R("Store.d.coins");R("Game.devWin()");pg.wait_for_timeout(2500)
    check('Replaying the same level does not repay the first-clear reward',R("Store.d.coins")-c2<=30,R("Store.d.coins")-c2)
    # 3 name escaping
    R("document.querySelectorAll('#modals .modal').forEach(m=>m.remove())");R("UI.show('title')");pg.wait_for_timeout(300);pg.click('[data-a=profile]');pg.wait_for_timeout(400)
    pg.fill('#nick','"><img src=x onerror=window.__x=1>');pg.click('#modals [data-a=x]');pg.wait_for_timeout(300)
    pg.click('[data-a=profile]');pg.wait_for_timeout(400)
    check('Profile name cannot inject HTML',R("!window.__x && !document.querySelector('#modals img[src=x]') && document.querySelector('#nick').value.length<=14"),R("Store.d.name"))
    R("document.querySelectorAll('#modals .modal').forEach(m=>m.remove())")
    # 4 back button
    pg.click('[data-a=settings]');pg.wait_for_timeout(400);R("history.back()");pg.wait_for_timeout(600)
    check('Back button closes Settings',R("document.querySelectorAll('#modals .modal').length")==0)
    pg.click('[data-a=play]');pg.wait_for_timeout(500);R("history.back()");pg.wait_for_timeout(600)
    check('Back button: map -> main menu',R("document.querySelector('#title').classList.contains('on')"))
    launch(1);R("history.back()");pg.wait_for_timeout(600)
    check('Back button during a level opens Pause (no progress lost)',R("!!document.querySelector('#modals [data-a=res]')"))
    R("history.back()");pg.wait_for_timeout(600)
    check('Back again resumes the level',R("document.querySelectorAll('#modals .modal').length")==0 and R("!Game.state.paused"))
    # 5 interruption -> auto pause
    R("Object.defineProperty(document,'hidden',{get:()=>true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))");pg.wait_for_timeout(400)
    check('App sent to background during a level -> Pause opens',R("!!document.querySelector('#modals [data-a=res]')"))
    R("Object.defineProperty(document,'hidden',{get:()=>false,configurable:true});document.dispatchEvent(new Event('visibilitychange'))");pg.click('#modals [data-a=res]');pg.wait_for_timeout(500)
    # 6 watchdog
    R("Game.state.busy=true");pg.wait_for_timeout(9500)
    check('Watchdog releases a stuck busy state',R("!Game.state.busy"))
    # 7 exception inside a move -> recovered, board intact
    launch(2);R("(()=>{const g=Game.state;g.b.valid=()=>{throw new Error('injected test failure')};})()")
    info=R("(()=>{const g=Game.state,b=g.b;const cv=document.querySelector('#board'),r=cv.getBoundingClientRect();return {l:r.left,t:r.top,w:r.width,cols:g.L.cols}})()")
    cell=[c for c in range(20,140) if c*info['cols']+2*round(c*.15)==round(info['w'])][0];P=round(cell*.15)
    x1=info['l']+P+cell/2;y1=info['t']+P+cell/2;pg.mouse.move(x1,y1);pg.mouse.down();pg.mouse.move(x1+cell,y1,steps=3);pg.mouse.up();pg.wait_for_timeout(1200)
    check('Exception during a swap is recovered (input unlocked, board full)',R("(()=>{const g=Game.state;return !g.busy&&g.b.g.every((row,r)=>row.every((x,c)=>g.b.choc[r][c]?x===null:x!==null))})()"))
    # 8 double launch
    R("document.querySelectorAll('#modals .modal').forEach(m=>m.remove())");R("UI.show('map')");pg.wait_for_timeout(500)
    R("window.__a=null;UI.launch(1);window.__a=Game.state;UI.launch(1)");pg.wait_for_timeout(1500)
    check('Double tap on Play starts the level once',R("Game.state===window.__a"))
    # 9 title currency pill works
    R("UI.show('title')");pg.wait_for_timeout(300);pg.click('#title .pill.coins');pg.wait_for_timeout(400)
    check('Title coin pill opens Boosters/Shop',R("!!document.querySelector('#modals .bgrid')"))
    # 10 asset audit
    root=ROOT+'/';sw=open(root+'service-worker.js').read();files=re.findall(r"'([^']+\.(?:js|css|html|json|svg|png))'",sw)
    miss=[f for f in files if f!='./' and not os.path.exists(root+f)]
    mf=json.load(open(root+'manifest.json'));miss+= [i['src'] for i in mf['icons'] if not os.path.exists(root+i['src'])]
    check('Service-worker file list and manifest icons all exist',not miss,miss)
    check('No external network requests during play',not [r for r in reqs if r.startswith('http')],[r for r in reqs if r.startswith('http')])
    check('No console/page errors during audit run',not [e for e in errs if 'ERR_NAME' not in e and 'injected test failure' not in e and 'recovered from a game error' not in e],[e[:100] for e in errs][:4])
    b.close()
print('\nAUDIT SUMMARY:',sum(res),'/',len(res),'passed')
