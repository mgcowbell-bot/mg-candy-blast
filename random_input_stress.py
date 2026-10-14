import os
ROOT=os.environ.get('MG_ROOT',os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')))
URL='file://'+ROOT+'/index.html'
import random,sys,json
from playwright.sync_api import sync_playwright
seed=int(sys.argv[1]);W,H=int(sys.argv[2]),int(sys.argv[3]);steps=int(sys.argv[4])
random.seed(seed)
errs=[];reqs=set();stuck=[]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':W,'height':H},has_touch=False)
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
    pg.on('console',lambda m:errs.append('CONSOLE '+m.type+' '+m.text) if m.type in('error','warning') else None)
    pg.on('request',lambda r:reqs.add(r.url.split('?')[0].replace('file://'+ROOT+'/','')))
    pg.on('requestfailed',lambda r:errs.append('REQFAIL '+r.url))
    pg.goto(URL);pg.evaluate("localStorage.clear();localStorage.setItem('mgcb_save_v1',JSON.stringify({v:1,unlocked:30,coins:900,levels:{}}))");pg.reload();pg.wait_for_function("!document.querySelector('#loading')")
    for i in range(steps):
        try:
            r=random.random()
            if r<.55:
                # click a random visible interactive element
                pts=pg.evaluate("""()=>{const out=[];document.querySelectorAll('button,[data-a],[data-n],[data-t],[data-b],[data-c],.node,.bb,.chip,.pill,.seg button,.wbtn').forEach(e=>{const r=e.getBoundingClientRect();if(r.width>4&&r.height>4&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&!e.disabled){const top=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);if(top&&(e===top||e.contains(top)))out.push([r.left+r.width/2,r.top+r.height/2]);}});return out}""")
                if pts:x,y=random.choice(pts);pg.mouse.click(x,y)
            elif r<.85:
                bd=pg.evaluate("(()=>{const e=document.querySelector('#board');if(!e||!e.offsetParent)return null;const r=e.getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()")
                if bd:
                    x1=bd[0]+random.random()*bd[2];y1=bd[1]+random.random()*bd[3];dx=random.choice([-1,0,1])*bd[2]/8;dy=random.choice([-1,0,1])*bd[2]/8
                    pg.mouse.move(x1,y1);pg.mouse.down();pg.mouse.move(x1+dx,y1+dy,steps=3);pg.mouse.up()
            elif r<.9:
                pg.keyboard.press(random.choice(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter','Space','Escape','1','2','3','4','5']))
            elif r<.93:
                pg.evaluate("document.dispatchEvent(new Event('visibilitychange'))")
            elif r<.96:
                pg.set_viewport_size({'width':random.choice([320,360,412,768]),'height':random.choice([480,640,800,915])})
            else:
                pg.mouse.wheel(0,random.choice([-600,600]))
            pg.wait_for_timeout(random.choice([30,80,150,400]))
            if i%25==24:
                st=pg.evaluate("(()=>{const g=typeof Game!=='undefined'&&Game.state;if(!g)return null;const cv=document.querySelector('#game.on');return {on:!!cv,busy:g.busy,ended:g.ended,moves:g.moves,full:g.b.g.every((row,r)=>row.every((x,c)=>g.b.wall(r,c)?x===null:x!==null))}})()")
                if st and st["on"] and not st["busy"] and not st["full"]:errs.append(f'BOARD HOLE at step {i}: {st}')
                if st and st['on'] and st['busy'] and not st['ended']:
                    pg.wait_for_timeout(9000)
                    st2=pg.evaluate("Game.state.busy&&!Game.state.ended&&!document.querySelector('#modals .modal')&&!document.querySelector('#tut')")
                    if st2:stuck.append(f'STUCK busy at step {i}')
        except Exception as e:
            errs.append('HARNESS '+str(e)[:120])
    b.close()
print(f'seed {seed} {W}x{H}: errors={len([e for e in errs if "ERR_NAME" not in e and "HARNESS" not in e])} stuck={len(stuck)}')
for e in sorted(set(errs)):
    if 'ERR_NAME' not in e and 'HARNESS' not in e:print('  ',e[:200])
for s in stuck:print('  ',s)
print('  external requests:',[r for r in reqs if r.startswith('http')])
