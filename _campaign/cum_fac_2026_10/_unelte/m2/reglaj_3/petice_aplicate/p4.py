p=r'C:/00/Projects/LearningHub/cum-fac/cautare.js'
s=open(p,encoding='utf8').read()
rep=[
("    var sensTare = R.sens_tare == null ? null : R.sens_tare;\n",""),
("""          // la „am găsit”, potrivirea doar pe sens (alt cuvânt din același grup) cântărește sens_tare, nu cât la ordonare
          if (sensTare != null && m && (c === IX_FX ? mt === R.potrivire.sens * tfT(fxN) : m === R.potrivire.sens)) mt = sensTare * (c === IX_FX ? tfT(fxN) : 1);
""",""),
("""        var slab = R.margine_slab, wT = slab != null ? w : w, wS = slab != null ? w * slab : w;""","""        var slab = R.margine_slab;"""),
("""          toate(postariT, wT, semn);""","""          toate(postariT, w, semn);"""),
("""          toate(postari, wS, -semn, true);""","""          toate(postari, w * slab, -semn, true);"""),
]
for a,b in rep:
    assert a in s, a[:60]
    s=s.replace(a,b)
open(p,'w',encoding='utf8').write(s)
print('ok')
