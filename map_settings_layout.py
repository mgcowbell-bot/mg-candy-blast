import os
ROOT=os.environ.get('MG_ROOT',os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')))
URL='file://'+ROOT+'/index.html'
from playwright.sync_api import sync_playwright
import json
errs=[]
def rect(pg,sel):return pg.evaluate("(s)=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [r.left,r.top,r.right,r.bottom]}",sel)
with sync_playwright() as p:
    b=p.chromium.launch()
    # ---------- startup failure handling ----------
    pg=b.new_page(viewport={'width':390,'height':780})
    pg.route("**/game.js",lambda r:r.fulfill(body="var x = ;",content_type="application/javascript"))
    pg.goto(URL);pg.wait_for_timeout(800)
    print('syntax-error file -> loading shows error:',pg.evaluate("document.querySelector('#loading').classList.contains('err')"),'| msg:',pg.evaluate("document.querySelector('.lerr span').textContent")[:70],'| Retry visible:',pg.evaluate("getComputedStyle(document.querySelector('#lretry')).display!=='none'"))
    pg.close()
    pg=b.new_page(viewport={'width':390,'height':780})
    pg.route("**/ui.js",lambda r:r.abort())
    pg.goto(URL);pg.wait_for_timeout(10000)
    print('missing ui.js (9s watchdog) -> error shown:',pg.evaluate("document.querySelector('#loading').classList.contains('err')"),'|',pg.evaluate("document.querySelector('.lerr span').textContent")[:60])
    pg.close()
    # ---------- normal startup: loading content visible immediately ----------
    pg=b.new_page(viewport={'width':390,'height':780})
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
    pg.on('console',lambda m:errs.append('CONSOLE '+m.text) if m.type=='error' else None)
    pg.goto(URL,wait_until='commit');pg.wait_for_timeout(60)
    print('loading visible before JS finishes:',pg.evaluate("!!document.querySelector('#loading .lfallback, #loading svg')"))
    pg.evaluate("localStorage.clear()");pg.reload();pg.wait_for_function("!document.querySelector('#loading')")
    pg.close()
    # ---------- map + settings at several sizes ----------
    for w,h in [(320,568),(360,640),(390,780),(412,915),(768,1024),(800,420)]:
        pg=b.new_page(viewport={'width':w,'height':h});
        pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
        pg.goto(URL);pg.evaluate("localStorage.clear();localStorage.setItem('mgcb_save_v1',JSON.stringify({v:1,unlocked:8,coins:123456,levels:{1:{stars:3,best:1},2:{stars:3,best:1},3:{stars:3,best:1}}}))");pg.reload();pg.wait_for_function("!document.querySelector('#loading')")
        pg.click('[data-a=play]');pg.wait_for_timeout(700)
        issues=[]
        # top bar elements inside screen, none overlapping, coin text not clipped
        hb={k:rect(pg,s) for k,s in {'home':'.mapHead .roundbtn','hearts':'#map .pill.hearts','coins':'#map .pill.coins','gear':'.mapHead .roundbtn:last-child'}.items()}
        order=['home','hearts','coins','gear']
        for i in range(3):
            if hb[order[i]][2]>hb[order[i+1]][0]+0.5:issues.append(f'{order[i]} overlaps {order[i+1]}')
        if hb['gear'][2]>w:issues.append('gear off-screen')
        clip=pg.evaluate("(()=>{const e=document.querySelector('#map .pill.coins');return [...e.children].some(c=>c.getBoundingClientRect().right>e.getBoundingClientRect().right+0.5)})()")
        if clip:issues.append('coin pill content clipped')
        # level nodes inside the scroller horizontally and clear of the world panel
        wp=rect(pg,'#worldPanel')
        bad=pg.evaluate("""(wp)=>[...document.querySelectorAll('.node')].filter(n=>{const r=n.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return false;return r.left<0||r.right>innerWidth||(r.right>wp[0]&&r.left<wp[2]&&r.bottom>wp[1]&&r.top<wp[3]);}).map(n=>n.dataset.n)""",wp)
        if bad:issues.append(f'nodes clipped/under world panel: {bad}')
        # world buttons: icon/label centred inside the button
        wb=pg.evaluate("""()=>[...document.querySelectorAll('.wbtn')].map(b=>{const r=b.getBoundingClientRect(),cs=[...b.children].map(c=>c.getBoundingClientRect());
            const cx=cs.map(c=>Math.abs((c.left+c.right)/2-(r.left+r.right)/2));const top=Math.min(...cs.map(c=>c.top))-r.top,bot=r.bottom-Math.max(...cs.map(c=>c.bottom));
            return {w:Math.round(r.width),h:Math.round(r.height),dx:Math.max(...cx).toFixed(1),dy:Math.abs(top-bot).toFixed(1),inside:cs.every(c=>c.left>=r.left&&c.right<=r.right&&c.top>=r.top&&c.bottom<=r.bottom)}})""")
        for i,x in enumerate(wb):
            if float(x['dx'])>1.5 or float(x['dy'])>3 or not x['inside']:issues.append(f'world btn {i+1} off-centre {x}')
        # level node icon/number/stars centred
        nd=pg.evaluate("""()=>[...document.querySelectorAll('.node')].slice(0,9).map(n=>{const r=n.getBoundingClientRect(),c=n.querySelector(':scope>svg'),s=n.querySelector('.ns');if(s&&!s.offsetParent)return 0;let dx=0;if(c){const q=c.getBoundingClientRect();dx=Math.abs((q.left+q.right)/2-(r.left+r.right)/2);}let ds=0;if(s){const q=s.getBoundingClientRect();ds=Math.abs((q.left+q.right)/2-(r.left+r.right)/2);}return Math.max(dx,ds)})""")
        if max(nd)>1.5:issues.append(f'node icon/stars off-centre {max(nd):.1f}')
        print(f'{w}x{h} MAP issues:',issues or 'none')
        # settings: scrollable, everything reachable
        pg.click('.mapHead .roundbtn:last-child');pg.wait_for_timeout(500)
        sc=pg.evaluate("""()=>{const b=document.querySelector('#modals .mbox');const before=b.scrollTop;b.scrollTop=99999;const reach=b.scrollTop;const last=[...b.querySelectorAll('button')].pop().getBoundingClientRect(),br=b.getBoundingClientRect();
            const wide=[...b.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().right>br.right+1).length;return {scrollable:b.scrollHeight>b.clientHeight,canReachEnd:reach>0||b.scrollHeight<=b.clientHeight,lastBtnVisible:last.bottom<=br.bottom+1&&last.top>=br.top-1,overflowRight:wide}}""")
        print(f'{w}x{h} SETTINGS',sc)
        pg.close()
    # ---------- settings function + persistence ----------
    pg=b.new_page(viewport={'width':390,'height':780});pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
    pg.goto(URL);pg.evaluate("localStorage.clear()");pg.reload();pg.wait_for_function("!document.querySelector('#loading')")
    pg.click('[data-a=settings]');pg.wait_for_timeout(500)
    for k in ('music','sfx','voice','vib'):pg.click(f'#modals [data-t={k}]')
    for r,v in (('mvol',20),('svol',30),('vvol',40)):
        pg.evaluate("([r,v])=>{const i=document.querySelector('#modals [data-r='+r+']');i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}))}",[r,v])
    pg.click('#modals .seg[data-g=quality] [data-v=low]');pg.click('#modals .seg[data-g=fx] [data-v=reduced]')
    print('lang note present:',pg.evaluate("document.querySelector('#modals .langrow').nextElementSibling.textContent"),'| fake lang options:',pg.evaluate("document.querySelectorAll('#modals .langrow button, #modals select').length"))
    print('duplicate volume sliders in settings:',pg.evaluate("document.querySelectorAll('#modals [data-r]').length"),'(expect 3)')
    pg.click('#modals [data-a=priv]');pg.wait_for_timeout(300);print('privacy opens:',pg.evaluate("!!document.querySelector('#modals .legal')"));pg.click('#modals .legal');pg.evaluate("document.querySelectorAll('#modals .modal')[1]&&document.querySelectorAll('#modals .modal')[1].querySelector('[data-a=x]').click()");pg.wait_for_timeout(300)
    pg.reload();pg.wait_for_function("!document.querySelector('#loading')")
    print('after reload settings:',pg.evaluate("(()=>{const s=Store.d.settings;return JSON.stringify({m:s.music,sfx:s.sfx,v:s.voice,vib:s.vib,mv:s.mvol,sv:s.svol,vv:s.vvol,q:s.quality,fx:s.fx})})()"))
    print('ERRORS',[e for e in errs if 'ERR_NAME' not in e])
    b.close()
