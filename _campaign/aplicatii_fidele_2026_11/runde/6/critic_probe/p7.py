import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(); s.deschide(); pg = s.page; kb = pg.keyboard
def bara(): return s.ev("()=>{const r=document.querySelector('[data-lh-aplicatie]');return {mod:(r.querySelector('[data-lh-suprafata=\"bara_stare\"] [data-lh-eticheta^=\"Cell Mode\"]')||{}).textContent,nume:r.querySelector('.lh-ap-x-nume-in').value,fx:r.querySelector('.lh-ap-x-bara-in').value}}")
# 1. Enter mode
clic_cel(s,"D2"); kb.type("=B2+C2"); pg.wait_for_timeout(150)
print("enter-mode", bara(), s.stare()["celule"].get("D2")); s.shot("x_mod_enter.png", clip={"x":0,"y":180,"width":420,"height":140})
# Point: click on a cell while typing formula
kb.type("+"); x,y = s.ev(CEL,"B3"); pg.mouse.click(x,y); pg.wait_for_timeout(150)
print("point", bara(), s.stare()["celule"].get("D2")); s.shot("x_mod_point.png", clip={"x":0,"y":180,"width":420,"height":140})
s.shot("x_mod_point_stare.png", clip={"x":0,"y":740,"width":300,"height":28})
kb.press("Enter"); pg.wait_for_timeout(150); print("dupa enter", s.stare()["celule"].get("D2"), s.stare()["selectie"])
# F2 edit
clic_cel(s,"A2"); kb.press("F2"); pg.wait_for_timeout(150); print("F2", bara()); s.shot("x_mod_edit.png", clip={"x":0,"y":180,"width":420,"height":140}); kb.press("Escape")
# range selection by drag
x0,y0 = s.ev(CEL,"B2"); x1,y1 = s.ev(CEL,"C4"); pg.mouse.move(x0,y0); pg.mouse.down(); pg.mouse.move((x0+x1)/2,(y0+y1)/2, steps=4); pg.mouse.move(x1,y1, steps=4); pg.mouse.up(); pg.wait_for_timeout(150)
print("zona", s.stare()["selectie"], bara()); s.shot("x_zona.png", clip={"x":0,"y":180,"width":420,"height":160})
print("rect sel", s.rect('.lh-ap-x-sel'), s.rect('.lh-ap-x-maner'))
print("statusbar-sum", s.ev("()=>[...document.querySelectorAll('[data-lh-suprafata=\"bara_stare\"] [data-lh-tip]')].map(e=>e.textContent.trim()).filter(Boolean)"))
# right click
x,y = s.ev(CEL,"B4"); pg.mouse.click(x,y,button="right"); pg.wait_for_timeout(250)
print("clic dreapta la", [round(x),round(y)], "meniu", s.rect('.lh-ap-x-meniu')[:1], s.rect('.lh-ap-x-meniu [data-lh-tip="MenuItem"]')[:4])
s.shot("x_meniu.png")
kb.press("Escape"); pg.wait_for_timeout(150)
print("ev", ultimele_ev(s,4)); print("erori", s.erori); s.gata()
