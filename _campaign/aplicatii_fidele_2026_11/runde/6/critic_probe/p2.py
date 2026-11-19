import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(); s.deschide()
print(s.ev("""()=>{const c=document.querySelector('.lh-ap-x-corp');const cs=getComputedStyle(c);
 return {ow:c.offsetWidth,cw:c.clientWidth,oh:c.offsetHeight,ch:c.clientHeight,sw:c.scrollWidth,sh:c.scrollHeight,ov:cs.overflow,sbw:cs.scrollbarWidth,
 rules:[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules].map(r=>r.cssText).filter(t=>/scrollbar/.test(t))}catch(e){return []}}).slice(0,10)}}"""))
s.gata()
