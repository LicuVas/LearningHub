import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(); s.deschide()
cazuri = [("A6","7,5"),("A7","7.5"),("A8","12.03.2026"),("A9","=1/3"),("A10","=25/3"),("A11","123456789012"),("A12","=1/0"),("A13","=SUMA(A2)"),
          ("A14","Elevii clasei a VIII-a B"),("A15","1234567890"),("A16","=123456789*1000"),("A17","TRUE"),("A18","=B2>8"),("A19","-3,25"),("A20","=2/3*100"),("A21","5 bucăți"),("A22","=A21*2"),("A23","  12"),("A24","3,0")]
out = {}
for a, t in cazuri:
    scrie(s, a, t)
for a, t in cazuri:
    st = s.stare()["celule"].get(a)
    out[a] = {"tastat": t, "stare": st, "ecran": vezi(s, a)}
    print(a, repr(t), "->", json.dumps(st, ensure_ascii=False), "| ecran", json.dumps(out[a]["ecran"], ensure_ascii=False))
s.shot("x_celule.png", clip={"x":0,"y":220,"width":420,"height":500})
json.dump(out, open(P+"p5.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
print("erori", s.erori); s.gata()
