import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(); pg = s.page; s.deschide(); cdp = s.ctx.new_cdp_session(pg)
AE = "()=>{const a=document.activeElement;return a?(a.tagName+'.'+a.className):null}"
clic_cel(s, "A6"); print("desktop dupa clic: activ =", s.ev(AE))
cdp.send("Input.insertText", {"text": "Mădălina"}); pg.wait_for_timeout(200)
print("insertText:", s.stare()["celule"].get("A6"))
pg.keyboard.press("Enter"); pg.wait_for_timeout(150); print("dupa Enter:", s.stare()["celule"].get("A6"), s.stare()["selectie"])
clic_cel(s, "A7"); cdp.send("Input.imeSetComposition", {"text": "ș", "selectionStart": 1, "selectionEnd": 1}); cdp.send("Input.insertText", {"text": "ș"}); pg.keyboard.type("i"); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
print("compunere ș + i:", s.stare()["celule"].get("A7"))
# tastare in editare (dupa ce a pornit cu o litera)
clic_cel(s, "A8"); pg.keyboard.type("Io"); cdp.send("Input.insertText", {"text": "ă"}); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
print("Io + ă (insertText in editare):", s.stare()["celule"].get("A8"))
s.gata()
