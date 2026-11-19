import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(375, 667, mobil=True); pg = s.page
s.deschide(); cdp = s.ctx.new_cdp_session(pg)
AE = "()=>{const a=document.activeElement;return a?(a.tagName+'.'+a.className+' in:'+((a.closest('[data-lh-tinta]')||{}).getAttribute&&a.closest('[data-lh-tinta]').getAttribute('data-lh-id'))):null}"
x, y = s.ev(CEL, "D3"); pg.touchscreen.tap(x, y); pg.wait_for_timeout(400)
print("dupa tap: activ =", s.ev(AE), "| sel", s.stare()["selectie"])
cdp.send("Input.insertText", {"text": "7,5"}); pg.wait_for_timeout(300)
print("insertText:", s.stare()["celule"].get("D3"), "| activ", s.ev(AE), "| ev", ultimele_ev(s, 3))
pg.keyboard.type("8"); pg.wait_for_timeout(200)
print("keyboard.type:", s.stare()["celule"].get("D3"), "| ev", ultimele_ev(s, 2))
pg.keyboard.press("Escape")
# compunere ca la tastatura de telefon: imeSetComposition apoi commit
x, y = s.ev(CEL, "D4"); pg.touchscreen.tap(x, y); pg.wait_for_timeout(400)
cdp.send("Input.imeSetComposition", {"text": "Ana", "selectionStart": 3, "selectionEnd": 3}); pg.wait_for_timeout(150)
print("compunere in curs:", s.stare()["celule"].get("D4"), "| ecran", vezi(s, "D4")["text"], s.ev("()=>{const e=document.querySelector('.lh-ap-x-ed');return e?e.value:null}"))
cdp.send("Input.insertText", {"text": "Ana"}); pg.wait_for_timeout(200)
print("dupa commit:", s.stare()["celule"].get("D4"), "| ev", ultimele_ev(s, 2))
# Word, pentru comparatie
s.deschide("word"); x = s.rect('[data-lh-tinta="text"]'); 
if x: pg.touchscreen.tap(x[0][0]+20, x[0][1]+8); pg.wait_for_timeout(300)
cdp.send("Input.insertText", {"text": "zz"}); pg.wait_for_timeout(200)
print("word insertText:", json.dumps(s.stare("word").get("text"), ensure_ascii=False)[:120], "| activ", s.ev(AE))
s.gata()
