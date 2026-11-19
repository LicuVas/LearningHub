import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(375, 667, mobil=True); pg = s.page
s.deschide(); pg.wait_for_timeout(500)
s.shot("t_deschis.png")
print("root", s.ev("()=>{const b=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();return [b.x,b.y,b.width,b.height, document.documentElement.scrollWidth, innerWidth]}"))
def mici(sel, lim=32):
    r = s.rect(sel); vis = [x for x in r if x[0] < 375 and x[0]+x[2] > 0 and x[1] < 667]
    return len(vis), [x for x in vis if min(x[2], x[3]) < lim][:8]
for sel in ['[data-lh-tip="TabItem"]', '[data-lh-suprafata^="panglica"] [data-lh-tinta]', '[data-lh-suprafata="acces_rapid"] [data-lh-tinta]', '.lh-ap-x-ff, .lh-ap-x-file-foi [data-lh-tip="Button"]', '[data-lh-suprafata="bara_stare"] [data-lh-tinta]', '[data-lh-tinta="celula"]', '.lh-ap-x-ant-col', '.lh-ap-x-nume-in, .lh-ap-x-fx, .lh-ap-x-bara-formule']:
    print(sel, mici(sel))
print("sus scroll", s.ev("()=>{const e=document.querySelector('.lh-ap-sus');return [e.scrollWidth,e.clientWidth,getComputedStyle(e).overflowX]}"))
# atingere pe o celulă + tastare compusă (CDP)
x, y = s.ev(CEL, "D3"); pg.touchscreen.tap(x, y); pg.wait_for_timeout(300)
cdp = s.ctx.new_cdp_session(pg)
cdp.send("Input.imeSetComposition", {"text": "7", "selectionStart": 1, "selectionEnd": 1}); cdp.send("Input.insertText", {"text": "7,5"}); pg.wait_for_timeout(200)
print("dupa compunere", s.stare()["celule"].get("D3"), s.stare()["selectie"])
pg.keyboard.press("Enter"); pg.wait_for_timeout(200); print("dupa enter", s.stare()["celule"].get("D3"), s.stare()["selectie"], vezi(s,"D3"))
s.shot("t_dupa.png")
# derulare panglica: swipe orizontal prin CDP pe panglică
b = s.rect('[data-lh-suprafata^="panglica"]')[0]; yy = b[1]+40
def touch(t, pts): cdp.send("Input.dispatchTouchEvent", {"type": t, "touchPoints": [{"x": p[0], "y": p[1]} for p in pts]})
sl0 = s.ev("()=>document.querySelector('.lh-ap-sus').scrollLeft")
touch("touchStart", [(300, yy)]);
for k in range(1, 9): touch("touchMove", [(300-k*25, yy)]); pg.wait_for_timeout(16)
touch("touchEnd", []); pg.wait_for_timeout(500)
print("panglica scrollLeft", sl0, "->", s.ev("()=>document.querySelector('.lh-ap-sus').scrollLeft"))
s.shot("t_panglica.png")
print("erori", s.erori); s.gata()
