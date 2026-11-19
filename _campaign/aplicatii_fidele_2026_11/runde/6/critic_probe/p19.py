import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(); pg = s.page; kb = pg.keyboard
deschide_cu(s, {"celule": {"A1":"Elev","B1":"Clasa","C1":"Media","A2":"Ion","B2":"8A","C2":8.5,"A3":"Ana","B3":"8B","C3":9.5,"A4":"Dan","B4":"8A","C4":7}, "selectie": "C2"})
clic_cel(s, "C3"); clic_el(s, '[data-lh-id-mso="TabData"]'); clic_el(s, '[data-lh-id-mso="SortDialog"]'); pg.wait_for_timeout(300)
print("dialog", s.stare().get("dialog"), [r[4] for r in s.rect('[data-lh-suprafata="dialog.SortDialog"] [data-lh-tip="Button"]')][:12])
s.shot("e_sort.png")
for nume in ("Add Level", "OK"):
    gol_mesaj(s); ok = clic_el(s, '[data-lh-suprafata="dialog.SortDialog"] [data-lh-eticheta="%s"]' % nume); pg.wait_for_timeout(250)
    print(nume, ok, "->", mesaj(s), ultimele_ev(s,1), "| dialog", s.stare().get("dialog"), "| A2", s.stare()["celule"].get("A2"))
s.gata()
