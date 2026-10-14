import os
ROOT=os.environ.get('MG_ROOT',os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')))
URL='file://'+ROOT+'/index.html'
from playwright.sync_api import sync_playwright
errs=[];res=[]
def check(n,ok,x=''):res.append(ok);print(('PASS ' if ok else 'FAIL ')+n+(' '+str(x) if x!='' else ''))
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':780})
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
    pg.on('console',lambda m:errs.append('CONSOLE '+m.text) if m.type=='error' else None)
    pg.goto(URL);pg.evaluate("localStorage.clear()");pg.reload();pg.wait_for_function("!document.querySelector('#loading')")
    R=pg.evaluate
    R("Store.d.unlocked=6000;Store.d.lives=5;Store.d.settings.tutorialDone=true;for(const k in Store.d.boosters)Store.d.boosters[k]=9;Store.save()")
    def launch(n):
        R("document.querySelectorAll('#modals .modal').forEach(m=>m.remove())");R(f"Store.d.lives=5;UI.launch({n})");pg.wait_for_timeout(1700)
        if R("!!document.querySelector('#tut')"):pg.click('#tut [data-a=skip]')
    find=lambda cond:R("(()=>{for(let n=11;n<400;n++){const L=LEVELS[n];if("+cond+")return n;}})()")
    nbox=find("L.obj.includes('box')&&!L.boss");ncr=find("L.obj.includes('crate')&&!L.boss");nice=find("L.obj.includes('ice')&&!L.boss");nstone=find("L.stone.length>0&&!L.boss")
    print('levels used: box',nbox,'crate',ncr,'ice',nice,'stone',nstone)
    for name,n in (('box',nbox),('crate',ncr),('ice',nice),('stone',nstone),('boss 50',50),('boss 100',100),('boss 150',150),('boss 200',200),('boss 250',250)):
        launch(n);pg.wait_for_timeout(300)
        pg.screenshot(path=f'/tmp/o_{name.replace(" ","")}.png')
        s=R("(()=>{const g=Game.state;return {n:g.L.n,boss:g.L.boss&&g.L.boss.name,counts:g.b.count(),hasMove:!!g.b.findMove(),matches:g.b.findMatches().set.size}})()")
        check(f'Level {n} ({name}) starts playable with blockers {s["counts"]}',s['hasMove'] and s['matches']==0)
    # --- hammer breaks a box one hit at a time; HUD counter follows ---
    launch(nbox);R("(()=>{const g=Game.state;g.paused=false;})()")
    pos=R("(()=>{const b=Game.state.b;for(let r=0;r<b.rows;r++)for(let c=0;c<b.cols;c++)if(b.box[r][c]>0)return [r,c,b.box[r][c]];})()")
    def cell_xy(r,c):
        i=R("(()=>{const cv=document.querySelector('#board'),b=cv.getBoundingClientRect(),g=Game.state;return {l:b.left,t:b.top,w:b.width,cols:g.L.cols}})()")
        cell=[k for k in range(20,140) if k*i['cols']+2*round(k*.15)==round(i['w'])][0];P=round(cell*.15)
        return i['l']+P+c*cell+cell/2,i['t']+P+r*cell+cell/2
    hp0=pos[2];cnt0=R("Game.state.b.count().box")
    pg.click('#boostBar .bb[data-k=hammer]');pg.wait_for_timeout(200);x,y=cell_xy(pos[0],pos[1]);pg.mouse.click(x,y);pg.wait_for_timeout(2600)
    hp1=R("Game.state.b.box[%d][%d]"%(pos[0],pos[1]))
    check('Hammer damages a wooden box by exactly one hit',hp1==hp0-1,(hp0,hp1))
    # --- new boosters ---
    launch(30);R("(()=>{const g=Game.state;g.moves=30;})()");sc0=R("Game.state.score");mv0=R("Game.state.moves")
    pg.click('#boostBar .bb[data-k=rowblast]');pg.wait_for_timeout(200);x,y=cell_xy(3,3);pg.mouse.click(x,y);pg.wait_for_timeout(2800)
    check('Row Blaster clears a row, scores points, costs no move',R("Game.state.score")>sc0 and R("Game.state.moves")==mv0 and R("Store.d.boosters.rowblast")==8,(R("Game.state.score")-sc0))
    sc0=R("Game.state.score");pg.click('#boostBar .bb[data-k=areabomb]');pg.wait_for_timeout(200);x,y=cell_xy(4,4);pg.mouse.click(x,y);pg.wait_for_timeout(2800)
    check('Area Bomb clears a 3x3 area',R("Game.state.score")>sc0 and R("Store.d.boosters.areabomb")==8)
    before=R("Game.state.b.g.map(r=>r.map(x=>x&&x.id).join(',')).join('|')");sc0=R("Game.state.score")
    pg.click('#boostBar .bb[data-k=shuffle]');pg.wait_for_timeout(1800)
    after=R("Game.state.b.g.map(r=>r.map(x=>x&&x.id).join(',')).join('|')")
    check('Shuffle booster rearranges the board without points or moves',before!=after and R("Game.state.score")==sc0 and R("Game.state.moves")==mv0 and R("!Game.state.busy"))
    # rapid taps on a booster only use ONE
    n0=R("Store.d.boosters.shuffle")
    pg.click('#boostBar .bb[data-k=shuffle]',click_count=3,delay=20);pg.wait_for_timeout(1800)
    check('Rapid triple tap on Shuffle uses only one',n0-R("Store.d.boosters.shuffle")==1,(n0,R("Store.d.boosters.shuffle")))
    # 1000+ levels: map, worlds
    R("document.querySelectorAll('#modals .modal').forEach(m=>m.remove());UI.show('map')");pg.wait_for_timeout(1200)
    check('Map shows many worlds (world panel + All Worlds)',R("document.querySelectorAll('#worldPanel .wbtn').length")>=5)
    pg.click('#worldPanel .wbtn.lst');pg.wait_for_timeout(500);rows=R("document.querySelectorAll('#modals .wrow').length")
    check('All Worlds list has 20 worlds',rows==20,rows);pg.screenshot(path='/tmp/o_worlds.png')
    pg.click('#modals [data-a=x]');pg.wait_for_timeout(300)
    check('1,000 level configs validate (no invalid ones)',R("(()=>{let bad=0;for(let n=1;n<=1000;n++){if(LEVELS[n].repaired)bad++;}return bad})()")==0)
    check('Level 1,000 and 5,000 launch',True) if (launch(1000) or True) and R("Game.state.n")==1000 else check('Level 1000 launch',False)
    launch(5000);check('Level 5000 launches',R("Game.state.n")==5000)
    print('ERRORS',[e for e in errs if 'ERR_NAME' not in e]);b.close()
print('SUMMARY',sum(res),'/',len(res))
