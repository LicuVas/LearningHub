import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune()
s.deschide()
s.shot("x_deschis.png")
print("root", s.ev("()=>{const b=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();return [b.x,b.y,b.width,b.height]}"))
for sel in ['[data-lh-suprafata="bara_titlu"]','[data-lh-suprafata="acces_rapid"] [data-lh-tip]','[data-lh-suprafata="file_panglicii"] [data-lh-tip="TabItem"]','[data-lh-id-mso="FileTabButton"]','.lh-ap-x-nume','.lh-ap-x-nume-in','.lh-ap-x-nume-btn','.lh-ap-x-fx','.lh-ap-x-bara-formule','.lh-ap-x-colt','.lh-ap-x-ant-col','.lh-ap-x-ant-rand','.lh-ap-x-file-foi','.lh-ap-x-file-foi [data-lh-tip]','[data-lh-suprafata="bara_stare"] [data-lh-tip]','.lh-ap-x-corp','.lh-ap-x-maner','.lh-ap-x-sel','.lh-ap-x-activa']:
    r = s.rect(sel)
    print(sel, len(r), r[:6])
print("stare", json.dumps(s.stare(), ensure_ascii=False)[:800])
print("erori", s.erori)
s.gata()
