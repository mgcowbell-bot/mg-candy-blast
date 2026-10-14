import os
ROOT=os.environ.get('MG_ROOT',os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')))
URL='file://'+ROOT+'/index.html'
from playwright.sync_api import sync_playwright
import json
sizes=[(320,568),(360,640),(390,780),(412,915),(768,1024),(800,420)]
def rect(pg,sel):
    return pg.evaluate("(s)=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]}",sel)
def ov(a,b):
    return a and b and not(a[2]<=b[0] or b[2]<=a[0] or a[3]<=b[1] or b[3]<=a[1])
with sync_playwright() as p:
    b=p.chromium.launch()
    for w,h in sizes:
        pg=b.new_page(viewport={'width':w,'height':h});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto(URL);pg.evaluate("localStorage.clear()");pg.reload();pg.wait_for_function("!document.querySelector('#loading')")
        pg.wait_for_timeout(400)
        R={k:rect(pg,s) for k,s in {'logo':'#title .homeBox','play':'#title .tbtns','chip':'#title .chip','mascot':'#title .mascotW','pill':'#title .tleft .pill','tl':'#title .topbar .roundbtn:nth-child(1)','tm':'#title .topbar .roundbtn:nth-child(2)','tr':'#title .topbar .roundbtn:last-child','app':'#app'}.items()}
        issues=[]
        for a,bn in [('play','tl'),('play','tm'),('play','tr'),('chip','tl'),('play','chip'),('play','mascot'),('chip','mascot'),('pill','chip'),('pill','play')]:
            if ov(R[a],R[bn]):issues.append(f'{a} overlaps {bn}')
        for k in ('play','chip','mascot','logo','pill'):
            r=R[k]
            if r and (r[0]<0 or r[2]>w or r[3]>h or r[1]<0):issues.append(f'{k} outside screen {r}')
        hs=pg.evaluate("document.documentElement.scrollWidth>innerWidth")
        print(f'{w}x{h} TITLE issues:',issues or 'none','hscroll',hs,errs)
        pg.screenshot(path=f'/tmp/h_{w}x{h}.png');pg.close()
    b.close()
