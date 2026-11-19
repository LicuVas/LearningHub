import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(); pg = s.page; kb = pg.keyboard
def st(n):
    x = s.stare(); print(n, json.dumps({k: x.get(k) for k in ("nume_fisier","dialog","pagina_backstage","titlu_fereastra","foi","foaie_activa")}, ensure_ascii=False), "| mesaj", mesaj(s), "| ev", ultimele_ev(s,1))
s.deschide()
clic_cel(s, "D2"); kb.press("Control+s"); pg.wait_for_timeout(400); st("ctrl_s"); s.shot("c_ctrl_s.png")
print("camp File name vizibil:", s.rect('[data-lh-tinta="camp:nume_fisier"]'), "| Choose a Location:", s.ev("()=>document.body.innerText.includes('Choose a Location')"))
kb.press("Escape"); pg.wait_for_timeout(300); st("esc")
kb.press("F12"); pg.wait_for_timeout(400); st("f12"); s.shot("c_f12.png")
print("save as rect", s.rect('[data-lh-suprafata="dialog.FileSaveAs"]')[:1])
kb.press("Control+a"); kb.type("Popescu_Ana_8A_lectia3"); kb.press("Enter"); pg.wait_for_timeout(400); st("f12_enter")
scrie(s, "D2", "9,5"); kb.press("Control+w"); pg.wait_for_timeout(400); st("ctrl_w"); s.shot("c_ctrl_w.png")
kb.press("Escape"); pg.wait_for_timeout(300)
kb.press("Control+o"); pg.wait_for_timeout(400); st("ctrl_o"); kb.press("Escape"); pg.wait_for_timeout(300)
kb.press("Control+n"); pg.wait_for_timeout(400); st("ctrl_n"); kb.press("Escape"); pg.wait_for_timeout(300)
# foile: +, redenumire prin dublu clic, clic dreapta pe filă
clic_el(s, '[data-lh-eticheta="Add Sheet"]'); st("plus")
b = s.rect('.lh-ap-x-ff'); print("file foi", b)
x = b[-1]; pg.mouse.dblclick(x[0]+x[2]/2, x[1]+x[3]/2); pg.wait_for_timeout(300); kb.type("Note"); kb.press("Enter"); pg.wait_for_timeout(300); st("redenumire")
b = s.rect('.lh-ap-x-ff'); x = b[-1]; pg.mouse.click(x[0]+x[2]/2, x[1]+x[3]/2, button="right"); pg.wait_for_timeout(300); st("clic_dr_fila")
print("meniu fila", s.rect('.lh-ap-x-meniu')[:1], [r[4] for r in s.rect('.lh-ap-x-meniu [data-lh-tip="MenuItem"]')])
s.shot("c_meniu_fila.png")
mi = [r for r in s.rect('.lh-ap-x-meniu [data-lh-tip="MenuItem"]') if r[4].startswith('Move or Copy')]
if mi: pg.mouse.click(mi[0][0]+30, mi[0][1]+mi[0][3]/2); pg.wait_for_timeout(300); st("move_copy"); s.shot("c_move_copy.png")
print("erori", s.erori); s.gata()
