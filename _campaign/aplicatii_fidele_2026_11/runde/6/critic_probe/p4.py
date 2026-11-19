import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune()
for app in ("excel","word"):
    s.deschide(app)
    print(app, s.ev("""()=>[...document.querySelectorAll('.lh-ap-jos,.lh-ap-sus')].map(c=>({cls:c.className,sw:c.scrollWidth,cw:c.clientWidth,kids:[...c.querySelectorAll('*')].map(e=>e.getBoundingClientRect().right).reduce((a,b)=>Math.max(a,b),0)}))"""))
    print(app, s.rect('[data-lh-suprafata="bara_stare"]'), s.rect('[data-lh-suprafata="bara_stare"] [data-lh-tip]')[-4:])
s.gata()
