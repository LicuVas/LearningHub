import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(); pg = s.page; kb = pg.keyboard; R = {}
def pas(nume, extra=None):
    st = s.stare(); R[nume] = {"selectie": st["selectie"], "mesaj": mesaj(s), "ev": ultimele_ev(s, 2), "dialog": st.get("dialog"), "backstage": st.get("pagina_backstage"), "nume_fisier": st.get("nume_fisier"), "titlu": st.get("titlu_fereastra")}
    if extra: R[nume].update(extra)
    print(nume, json.dumps(R[nume], ensure_ascii=False)[:520])
NOTE = {"A1":"Elev","B1":"Puncte","A2":"Ana","B2":8,"A3":"Bogdan","B3":9,"A4":"Dan","B4":7,"A5":"Ema","B5":10,"A6":"Ion","B6":8}
# m2-l08: Σ apoi scrii zona peste cea propusă
deschide_cu(s, {"celule": NOTE, "selectie": "B7"})
clic_cel(s, "B7"); clic_el(s, '[data-lh-id-mso="AutoSum"]'); kb.type("B2:B5"); pg.wait_for_timeout(100)
pas("autosum_scrie_peste", {"B7": s.stare()["celule"].get("B7")}); kb.press("Enter"); pg.wait_for_timeout(100); pas("autosum_peste_enter", {"B7": s.stare()["celule"].get("B7")})
# m2-l08: #NAME? cu AVEGARE
scrie(s, "C2", "=AVEGARE(B2:B6)"); pas("avegare", {"C2": s.stare()["celule"].get("C2"), "ecran": vezi(s,"C2")["text"]})
# m2-l09: IF cu ; și DACĂ
scrie(s, "D2", "=IF(B2<9;10;20)"); pas("if", {"D2": s.stare()["celule"].get("D2")})
scrie(s, "D3", "=DACĂ(B3<9;10;20)"); pas("daca", {"D3": s.stare()["celule"].get("D3")})
# m1-l07: #VALUE! apoi Ctrl+Z
deschide_cu(s, {"celule": {"A1":"Bucăți","B1":"Preț","C1":"Total","A2":10,"B2":120,"C2":"=A2*B2"}, "selectie": "A2"})
scrie(s, "A2", "5 bucăți"); pas("value", {"C2": s.stare()["celule"].get("C2")})
kb.press("Control+z"); pg.wait_for_timeout(150); pas("ctrlz", {"A2": s.stare()["celule"].get("A2"), "C2": s.stare()["celule"].get("C2")})
scrie(s, "E2", "9"); scrie(s, "F2", "8"); scrie(s, "G2", "=(E2+F2)/2"); pas("media", {"G2": s.stare()["celule"].get("G2"), "ecran": vezi(s,"G2")["text"]})
# umplere: pătrățelul tras de la G2 la G4
scrie(s, "E3", "10"); scrie(s, "F3", "9"); scrie(s, "E4", "7"); scrie(s, "F4", "10")
clic_cel(s, "G2"); m = s.rect('.lh-ap-x-maner')[0]; mx, my = m[0]+3.5, m[1]+3.5; x4,y4 = s.ev(CEL,"G4")
pg.mouse.move(mx,my); pg.mouse.down(); pg.mouse.move(mx, (my+y4)/2, steps=5); s.shot("b_umplere_tragere.png", clip={"x":300,"y":220,"width":300,"height":120}); pg.mouse.move(mx, y4, steps=5); pg.mouse.up(); pg.wait_for_timeout(200)
pas("umplere", {"G3": s.stare()["celule"].get("G3"), "G4": s.stare()["celule"].get("G4"), "optiuni": s.rect('[data-lh-eticheta*="Auto Fill"]')})
s.shot("b_umplere.png", clip={"x":300,"y":220,"width":300,"height":120})
# m2-l10: sortare cu o celulă din coloana-criteriu, Data › A→Z
deschide_cu(s, {"celule": {"A1":"Elev","B1":"Media","A2":"Ion","B2":8.5,"A3":"Ana","B3":9.5,"A4":"Dan","B4":7}, "selectie": "B2"})
clic_cel(s, "B3"); clic_el(s, '[data-lh-id-mso="TabData"]'); clic_el(s, '[data-lh-id-mso="SortAscendingExcel"]')
pas("sort_az", {"A2": s.stare()["celule"].get("A2"), "B2": s.stare()["celule"].get("B2"), "A4": s.stare()["celule"].get("A4")})
gol_mesaj(s); clic_el(s, '[data-lh-id-mso="SortDialog"]'); pg.wait_for_timeout(200); pas("sort_dialog", {"dlg": s.rect('[data-lh-suprafata^="dialog"]')[:1]}); s.shot("b_sort_dialog.png")
kb.press("Escape"); gol_mesaj(s)
# m1-l02: Name Box → C4, zoom +, fila Insert
clic_el(s, '[data-lh-id-mso="TabHome"]')
x = s.rect('.lh-ap-x-nume-in')[0]; pg.mouse.click(x[0]+20, x[1]+9); kb.press("Control+a"); kb.type("C4"); kb.press("Enter"); pg.wait_for_timeout(150); pas("namebox_C4")
clic_el(s, '[data-lh-suprafata="bara_stare"] [data-lh-eticheta="Zoom In"]'); pg.wait_for_timeout(150); pas("zoom_plus", {"zoom": s.rect('[data-lh-suprafata="bara_stare"] [data-lh-eticheta^="Zoom 1"]'), "lat_col": s.rect('.lh-ap-x-ant-col')[0]})
print("erori", s.erori); json.dump(R, open(P+"p9.json","w",encoding="utf-8"), ensure_ascii=False, indent=1); s.gata()
