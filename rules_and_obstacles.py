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
    print('WIN_RULE =',R("WIN_RULE"))
    R("Store.d.unlocked=3000;Store.d.settings.tutorialDone=true;Store.save()")
    def launch(n):
        R("document.querySelectorAll('#modals .modal').forEach(m=>m.remove())");R(f"Store.d.lives=5;UI.launch({n})");pg.wait_for_timeout(1700)
        if R("!!document.querySelector('#tut')"):pg.click('#tut [data-a=skip]')
    def move():
        info=R("(()=>{const g=Game.state;const m=g.b.moves(30);const mv=m[Math.floor(Math.random()*m.length)];const cv=document.querySelector('#board'),r=cv.getBoundingClientRect();return {mv,l:r.left,t:r.top,w:r.width,cols:g.L.cols}})()")
        cell=[c for c in range(20,140) if c*info['cols']+2*round(c*.15)==round(info['w'])][0];P=round(cell*.15)
        xy=lambda i:(info['l']+P+(i%info['cols'])*cell+cell/2,info['t']+P+(i//info['cols'])*cell+cell/2)
        a,bb=info['mv'];x1,y1=xy(a);x2,y2=xy(bb);pg.mouse.move(x1,y1);pg.mouse.down();pg.mouse.move(x2,y2,steps=4);pg.mouse.up()
    st=lambda:R("({ended:Game.state.ended,won:!!Game.state.won,lost:!!Game.state.lost,moves:Game.state.moves,score:Game.state.score,winM:document.querySelectorAll('.modal.win').length,loseM:document.querySelectorAll('.modal.lose').length})")
    def run(maxm=8):
        for _ in range(maxm):
            if st()['ended']:break
            move();pg.wait_for_timeout(2600)
        pg.wait_for_timeout(1600)
    def clear_tasks():
        R("(()=>{const g=Game.state;g.collect={};g.special=0;const b=g.b;['jelly','box','crate','ice'].forEach(k=>b[k].forEach(r=>r.fill(0)));b.choc.forEach(r=>r.fill(false));})()")
    def unreachable():R("(()=>{const g=Game.state;window.__s=g.L.stars[2];g.L.stars[2]=g.L.stars[2]+10000000;})()")
    def restore(n):R(f"LEVELS[{n}].stars[2]=window.__s")
    # A
    launch(1);R("(()=>{const g=Game.state;g.score=g.L.stars[2]-50;g.shown=g.score;g.moves=20;})()");c0=R("Store.d.coins");run();s=st()
    check('A: 3 stars (+no tasks on level 1), moves left -> WIN once',s['won'] and s['winM']==1 and s['loseM']==0 and s['moves']>0,s)
    check('A: rewards paid once (+100) and next level unlocked',R("Store.d.coins")-c0==100 and R("Store.d.levels[1].stars")==3)
    ck=R("(()=>{for(let n=11;n<300;n++){if(LEVELS[n].kind==='collect')return n;}})()")
    launch(ck);R("(()=>{const g=Game.state;g.collect={};g.score=g.L.stars[2]-50;g.shown=g.score;g.moves=20;})()");run();s=st()
    check(f'A: 3 stars + collect task done (level {ck}) -> WIN',s['won'] and s['winM']==1 and s['loseM']==0)
    # B
    launch(2);R("(()=>{const g=Game.state;g.score=g.L.stars[2]-50;g.shown=g.score;g.moves=1;})()");run();s=st()
    check('B: requirement met on the FINAL move (moves=0) -> WIN, not Game Over',s['won'] and s['moves']==0 and s['winM']==1 and s['loseM']==0,s)
    # C
    launch(3);unreachable();R("(()=>{const g=Game.state;g.score=g.L.stars[0]+10;g.shown=g.score;g.moves=1;})()");run();s=st();restore(3)
    check('C: ONE star + moves reach zero -> GAME OVER only',s['lost'] and not s['won'] and s['loseM']==1 and s['winM']==0 and R("Store.d.levels[3]")is None)
    launch(4);unreachable();R("(()=>{const g=Game.state;g.score=g.L.stars[1]+10;g.shown=g.score;g.moves=1;})()");run();s=st();restore(4)
    check('C: TWO stars + moves reach zero -> GAME OVER only',s['lost'] and not s['won'] and s['loseM']==1 and s['winM']==0)
    # D
    jl=R("(()=>{for(let n=11;n<300;n++){const L=LEVELS[n];if(L.obj.includes('jelly')&&!L.boss)return n;}})()")
    launch(jl);R("(()=>{const g=Game.state;g.score=g.L.stars[2]+500;g.shown=g.score;g.moves=1;})()");run();s=st()
    check(f'D: 3 stars but jelly goal incomplete, moves zero -> GAME OVER only (level {jl})',s['lost'] and not s['won'] and s['loseM']==1 and s['winM']==0 and R(f"Store.d.levels[{jl}]")is None)
    bx=R("(()=>{for(let n=11;n<400;n++){const L=LEVELS[n];if(L.obj.includes('box')&&!L.boss)return n;}})()")
    launch(bx);R("(()=>{const g=Game.state;g.score=g.L.stars[2]+500;g.shown=g.score;g.moves=1;})()");run();s=st()
    check(f'D2: 3 stars but wooden boxes left, moves zero -> GAME OVER only (level {bx})',s['lost'] and not s['won'] and s['winM']==0)
    launch(bx);clear_tasks();R("(()=>{const g=Game.state;g.score=g.L.stars[2]-50;g.shown=g.score;g.moves=15;})()");run();s=st()
    check(f'A2: boxes all broken + 3 stars, moves left -> WIN (level {bx})',s['won'] and s['winM']==1 and s['loseM']==0)
    # E
    ck=R("(()=>{for(let n=%d+1;n<300;n++){if(LEVELS[n].kind==='collect')return n;}})()"%ck)
    launch(ck);unreachable();R("(()=>{const g=Game.state;g.collect={};g.score=g.L.stars[1]+10;g.shown=g.score;g.moves=12;})()");move();pg.wait_for_timeout(2600);s=st()
    check(f'E: tasks complete but fewer than 3 stars -> NOT completed, play continues (level {ck})',(not s['ended']) and s['winM']==0 and R(f"Store.d.levels[{ck}]")is None)
    R("Game.state.moves=1");run();s=st();restore(ck)
    check('E: ...and Game Over when the moves run out',s['lost'] and s['loseM']==1 and s['winM']==0)
    # F
    launch(30)
    R("(()=>{const g=Game.state,b=g.b;for(let r=0;r<b.rows;r++)for(let c=0;c<b.cols;c++){if(b.wall(r,c)||b.ice[r][c]>0){continue;}const x=b.mk((2*r+3*c)%6);x.px=c;x.py=r;x.sc=1;x.al=1;x.fl=0;b.g[r][c]=x;}g.moves=20;g.busy=false;})()")
    pre=R("({moves:!!Game.state.b.findMove(),matches:Game.state.b.findMatches().set.size})");R("Game.testEndTurn()");pg.wait_for_timeout(1500)
    post=R("({moves:!!Game.state.b.findMove(),matches:Game.state.b.findMatches().set.size,busy:Game.state.busy})")
    check(f'F: no valid moves {pre} -> automatic shuffle {post}',(not pre['moves']) and post['moves'] and post['matches']==0 and not post['busy'])
    # duplicates / restart
    launch(5);R("Game.devWin();Game.devWin();Game.devWin()");pg.wait_for_timeout(2500);w=st()['winM'];R("Game.devLose()");pg.wait_for_timeout(1500)
    check('Duplicate win calls -> one win screen; Game Over after win ignored',w==1 and st()['loseM']==0)
    launch(6);R("Game.state.score=400;Game.state.moves=2");R("document.querySelector('#btnPause').click()");pg.wait_for_timeout(400);pg.click('#modals [data-a=re]');pg.wait_for_timeout(1900)
    check('Restart resets the level state',R("Game.state.score")==0 and R("Game.state.moves")==R("Game.state.L.moves") and not R("Game.state.ended"))
    print('ERRORS',[e for e in errs if 'ERR_NAME' not in e]);b.close()
print('SUMMARY',sum(res),'/',len(res))
