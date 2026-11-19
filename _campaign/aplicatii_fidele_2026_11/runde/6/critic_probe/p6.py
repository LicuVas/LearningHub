import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune()
deschide_cu(s, {"celule": {"A1": "Situația notelor la informatică", "A3": "Situația notelor la informatică", "B3": "x", "A5": "=25/3", "B5": "=AVERAGE(9;8;8)"}, "selectie": "D8"})
for a in ("A1","A3","A5","B5"): print(a, json.dumps(vezi(s,a), ensure_ascii=False), s.stare()["celule"].get(a))
s.shot("x_curgere.png", clip={"x":0,"y":220,"width":400,"height":140})
print(s.ev("()=>{const e=document.querySelector('[data-lh-id=\"A1\"]');const t=e.querySelector('.lh-ap-x-t');const cs=getComputedStyle(t);return {maxw:cs.maxWidth,flexShrink:cs.flexShrink,minw:cs.minWidth,var:e.style.getPropertyValue('--lh-ap-x-max'),ov:getComputedStyle(e).overflow}}"))
print("erori", s.erori); s.gata()
