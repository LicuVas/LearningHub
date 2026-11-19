import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(); pg = s.page; s.deschide()
print("cautare", s.rect('[data-lh-suprafata="bara_titlu"] [data-lh-tip="MenuItem"], [data-lh-suprafata="bara_titlu"] [data-lh-tip="Edit"]'))
print("titlu", s.rect('[data-lh-suprafata="bara_titlu"] [data-lh-tip="TitleBar"], .lh-ap-x-titlu'))
print("QAT glife", s.ev("""()=>[...document.querySelectorAll('[data-lh-suprafata="acces_rapid"] > [data-lh-tip], [data-lh-suprafata="bara_titlu"] [data-lh-eticheta="Customize Quick Access Toolbar"]')].map(e=>[e.getAttribute('data-lh-eticheta'),(e.querySelector('svg path')||{getAttribute:()=>''}).getAttribute('d').slice(0,40)])"""))
print("lupa din panglica.js:", open("C:/00/Projects/LearningHub_fidel/aplicatii/panglica.js",encoding="utf-8").read().split("cauta: '")[1][:50])
# selectia de text a browserului dupa tragere
x0,y0 = s.ev(CEL,"B2"); x1,y1 = s.ev(CEL,"C4"); pg.mouse.move(x0,y0); pg.mouse.down(); pg.mouse.move(x1,y1,steps=8); pg.mouse.up(); pg.wait_for_timeout(200)
print("getSelection dupa tragere:", repr(s.ev("()=>String(window.getSelection())")[:80]), "| user-select pe celula:", s.ev("()=>getComputedStyle(document.querySelector('[data-lh-tinta=\"celula\"]')).userSelect"))
# antet coloana: cursorul pe margine si in mijloc
b = s.rect('.lh-ap-x-ant-col')[0]
print("cursor margine A|B:", s.ev("([x,y])=>getComputedStyle(document.elementFromPoint(x,y)).cursor", [b[0]+b[2]-1, b[1]+10]), "| mijloc A:", s.ev("([x,y])=>getComputedStyle(document.elementFromPoint(x,y)).cursor", [b[0]+30, b[1]+10]))
s.gata()
