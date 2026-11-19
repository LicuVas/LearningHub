import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(); pg = s.page; kb = pg.keyboard
NOTE = {"A1":"Elev","B1":"Puncte","A2":"Ana","B2":8,"A3":"Bogdan","B3":9,"A4":"Dan","B4":7,"A5":"Ema","B5":10,"A6":"Ion","B6":8,"B7":"=SUM(B2:B6)"}
deschide_cu(s, {"celule": NOTE, "selectie": "B8"})
clic_cel(s, "B8"); clic_el(s, '[data-lh-id-mso="AutoSum"]')
print("dupa Σ", s.stare()["celule"].get("B8"), "selectat in editor:", s.ev("()=>{const e=document.querySelector('.lh-ap-x-ed');return e?[e.selectionStart,e.selectionEnd,e.value]:null}"), "marcaje", s.rect('.lh-ap-x-umple, .lh-ap-x-clip, [class*=ref]'))
kb.type("B2:B6"); print("dupa scris", s.stare()["celule"].get("B8"))
kb.press("Enter"); pg.wait_for_timeout(300)
print("dupa Enter", s.stare()["celule"].get("B8"), "fereastra_mesaj", s.stare().get("fereastra_mesaj"), "mesaje", mesaj(s), "dialog", s.stare().get("dialog"))
s.shot("b_autosum_peste.png")
print("ev", ultimele_ev(s, 3))
kb.press("Escape"); pg.wait_for_timeout(200); kb.press("Escape"); pg.wait_for_timeout(200)
print("dupa Esc", s.stare()["celule"].get("B8"), s.stare()["selectie"])
for a, t in [("C2","=AVEGARE(B2:B6)"),("D2","=IF(B2<9;10;20)"),("D3","=DACĂ(B3<9;10;20)"),("D4","=SUM(B2:B6)/5"),("D5","=MAX(B2:B6)"),("D6","=AVERAGE(B2:B4)")]:
    scrie(s, a, t); print(a, t, "->", s.stare()["celule"].get(a), "| ecran:", vezi(s,a)["text"], "| sel", s.stare()["selectie"]["activa"])
print("erori", s.erori); s.gata()
