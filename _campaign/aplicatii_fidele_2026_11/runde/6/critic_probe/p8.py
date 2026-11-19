import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(); pg = s.page; kb = pg.keyboard; R = {}
def pas(nume, extra=None):
    st = s.stare(); R[nume] = {"selectie": st["selectie"], "mesaj": mesaj(s), "ev": ultimele_ev(s, 2), "dialog": st.get("dialog"), "backstage": st.get("pagina_backstage")}
    if extra: R[nume].update(extra)
    print(nume, json.dumps(R[nume], ensure_ascii=False)[:600])
# --- m2-l08: AutoSum sub numere + lista ▾
deschide_cu(s, {"celule": {"A1":"Elev","B1":"Puncte","A2":"Ana","B2":8,"A3":"Bogdan","B3":9,"A4":"Dan","B4":7,"A5":"Ema","B5":10,"A6":"Ion","B6":8}, "selectie": "B7"})
clic_cel(s, "B7"); clic_el(s, '[data-lh-id-mso="AutoSum"]'); pg.wait_for_timeout(200)
pas("autosum_clic", {"B7": s.stare()["celule"].get("B7"), "clip_vizibil": s.rect('.lh-ap-x-clip'), "furnici": s.rect('.lh-ap-x-umple')})
s.shot("b_autosum.png", clip={"x":0,"y":180,"width":420,"height":200})
kb.press("Enter"); pg.wait_for_timeout(150); pas("autosum_enter", {"B7": s.stare()["celule"].get("B7")})
clic_cel(s, "B8"); ok = clic_el(s, '[data-lh-id-mso="AutoSum_Dropdown"], [data-lh-suprafata] [data-lh-eticheta="AutoSum"] [data-lh-eticheta="More Options"]'); pg.wait_for_timeout(250)
pas("autosum_lista", {"gasit_sageata": ok, "meniu": s.rect('[data-lh-tinta^="meniu"]')[:8]})
s.shot("b_autosum_lista.png")
gol_mesaj(s); kb.press("Escape")
# --- m1-l06: Merge & Center, Bold, Fill, Borders ▾ › All Borders, Wrap Text, %, autofit coloană
deschide_cu(s, {"celule": {"A1":"Excursia clasei","A2":"Elev","B2":"Suma","C2":"Data","A3":"Popescu Alexandra","B3":150,"C3":"12.03.2026","A4":"Ionescu Bogdan","B4":120,"C4":"13.03.2026"}, "selectie": "A1"})
s.shot("b_l06_inainte.png", clip={"x":0,"y":180,"width":420,"height":140})
x0,y0 = s.ev(CEL,"A1"); x1,y1 = s.ev(CEL,"D1"); pg.mouse.move(x0,y0); pg.mouse.down(); pg.mouse.move(x1,y1,steps=6); pg.mouse.up()
clic_el(s, '[data-lh-id-mso="MergeCenter"]'); pas("merge", {"fmt": s.stare()["format_celule"].get("A1")})
x0,y0 = s.ev(CEL,"A2"); x1,y1 = s.ev(CEL,"C2"); pg.mouse.move(x0,y0); pg.mouse.down(); pg.mouse.move(x1,y1,steps=6); pg.mouse.up()
clic_el(s, '[data-lh-id-mso="Bold"]'); pas("bold", {"fmt": s.stare()["format_celule"].get("A2")})
gol_mesaj(s); clic_el(s, '[data-lh-eticheta^="Fill Color RGB"]'); pas("fill", {"fmt": s.stare()["format_celule"].get("A2")})
gol_mesaj(s); clic_el(s, '[data-lh-id-mso="BordersGallery_Dropdown"]'); pas("borders_sageata", {"meniu": s.rect('[data-lh-tinta^="meniu:"]')[:6]})
gol_mesaj(s); kb.press("Escape")
clic_cel(s, "B3"); gol_mesaj(s); clic_el(s, '[data-lh-id-mso="PercentStyle"]'); pas("procent", {"B3": s.stare()["celule"].get("B3")})
gol_mesaj(s); clic_el(s, '[data-lh-id-mso="WrapText"]'); pas("wrap")
# autofit: dublu clic pe linia dintre A și B
b = s.rect('.lh-ap-x-ant-col')[0]; xa = b[0]+b[2]; ya = b[1]+b[3]/2
gol_mesaj(s); pg.mouse.dblclick(xa, ya); pg.wait_for_timeout(250)
pas("autofit_A", {"lat_A": s.rect('.lh-ap-x-ant-col')[0], "cursor": s.ev("([x,y])=>getComputedStyle(document.elementFromPoint(x,y)).cursor",[xa,ya])})
# tragere pe linia dintre C și D (lățire)
b = s.rect('.lh-ap-x-ant-col')[2]; xc = b[0]+b[2]; pg.mouse.move(xc, ya); pg.mouse.down(); pg.mouse.move(xc+40, ya, steps=6); pg.mouse.up(); pg.wait_for_timeout(200)
pas("trage_C", {"lat_C": s.rect('.lh-ap-x-ant-col')[2]})
s.shot("b_l06_dupa.png", clip={"x":0,"y":180,"width":420,"height":140})
print("erori", s.erori); json.dump(R, open(P+"p8.json","w",encoding="utf-8"), ensure_ascii=False, indent=1); s.gata()
