import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(); pg = s.page; kb = pg.keyboard
deschide_cu(s, {"foi": [{"nume": "Note", "celule": {"A1": "Elev", "B1": "Nota", "A2": "Ana", "B2": 9, "A3": "Dan", "B3": 7}}, {"nume": "Excursie", "celule": {"A1": "Suma"}}, {"nume": "Orar", "celule": {}}], "selectie": "A1"})
print("file", [r[4] for r in s.rect('.lh-ap-x-ff')])
clic_el(s, '.lh-ap-x-ff[data-lh-id="Excursie"]'); print("foaie activa", s.stare()["foaie_activa"], s.stare()["celule"])
clic_el(s, '.lh-ap-x-ff[data-lh-id="Note"]')
# m2-l11: selectezi A1:B3, Insert › grafic coloană
x0,y0 = s.ev(CEL,"A1"); x1,y1 = s.ev(CEL,"B3"); pg.mouse.move(x0,y0); pg.mouse.down(); pg.mouse.move(x1,y1,steps=5); pg.mouse.up()
clic_el(s, '[data-lh-id-mso="TabInsert"]')
ids = s.ev("()=>[...document.querySelectorAll('[data-lh-suprafata=\"panglica.TabInsert\"] [data-lh-id-mso]')].map(e=>e.getAttribute('data-lh-id-mso')).filter(x=>/Chart/i.test(x))")
print("butoane grafic", ids[:12])
for i in ids:
    if i in ("ChartTypeColumnInsertGallery", "ChartsRecommended", "InsertChartColumn", "ChartTypeColumnInsertGallery_Dropdown"):
        gol_mesaj(s); clic_el(s, '[data-lh-id-mso="%s"]' % i); print(i, "->", mesaj(s), ultimele_ev(s,1), "dialog", s.stare().get("dialog"))
        kb.press("Escape")
# m1-l06: clic dreapta antet coloană › Column Width
clic_el(s, '[data-lh-id-mso="TabHome"]')
b = s.rect('.lh-ap-x-ant-col')[1]; pg.mouse.click(b[0]+30, b[1]+10, button="right"); pg.wait_for_timeout(250)
it = [r for r in s.rect('.lh-ap-x-meniu [data-lh-tip="MenuItem"]') if r[4].startswith('Column Width')]
print("meniu antet:", [r[4] for r in s.rect('.lh-ap-x-meniu [data-lh-tip="MenuItem"]')][:12])
if it:
    pg.mouse.click(it[0][0]+30, it[0][1]+it[0][3]/2); pg.wait_for_timeout(300); print("Column Width ->", s.stare().get("dialog"), mesaj(s))
    kb.press("Control+a"); kb.type("20"); kb.press("Enter"); pg.wait_for_timeout(300)
    print("dupa OK latime B:", s.rect('.lh-ap-x-ant-col')[1], "| dialog", s.stare().get("dialog"), "| mesaj", mesaj(s), ultimele_ev(s,2))
s.shot("d_col_width.png")
print("erori", s.erori); s.gata()
