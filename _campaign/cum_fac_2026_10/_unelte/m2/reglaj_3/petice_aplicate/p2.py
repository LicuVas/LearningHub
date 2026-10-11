p=r'C:/00/Projects/LearningHub/cum-fac/cautare.js'
s=open(p,encoding='utf8').read()
rep=[
("""    var postari = new Map();         // aceeași cheie -> Set(indicii fișelor)
""","""    var postari = new Map();         // aceeași cheie -> Set(indicii fișelor)
    var postariT = new Map();        // … doar din câmpurile tari și formulările în plus (pentru marginea candidaților)
"""),
("""        var tinta = eFx ? cheiFx : chei;
        C.s.forEach(function (s) { tinta.add('s:' + s); });
        C.g.forEach(function (g) { tinta.add('g:' + g); });""","""        var tinta = eFx ? cheiFx : chei;
        C.s.forEach(function (s) { tinta.add('s:' + s); if (tare) cheiT.add('s:' + s); });
        C.g.forEach(function (g) { tinta.add('g:' + g); if (tare) cheiT.add('g:' + g); });"""),
("""      var chei = new Set();
      var cheiFx = new Set();""","""      var chei = new Set();
      var cheiT = new Set();          // cheile câmpurilor tari
      var cheiFx = new Set();"""),
("""      chei.forEach(function (k) { df.set(k, (df.get(k) || 0) + 1); adauga(postari, k, ix); });""","""      chei.forEach(function (k) { df.set(k, (df.get(k) || 0) + 1); adauga(postari, k, ix); });
      if (R.margine_slab != null) { cheiT.forEach(function (k) { adauga(postariT, k, ix); }); cheiFx.forEach(function (k) { adauga(postariT, k, ix); }); }"""),
("""        function ia(p) { if (p) p.forEach(function (x) { if (vazut[x] !== semn) { vazut[x] = semn; if (!margine[x]) cand.push(x); margine[x] += w; } }); }
        ia(postari.get('s:' + t.s));
        t.g.forEach(function (g) { ia(postari.get('g:' + g)); });
        if (t.ps) t.ps.forEach(function (s) { ia(postari.get('s:' + s)); });
        if (t.alt) { ia(postari.get('s:' + t.alt.s)); t.alt.g.forEach(function (g) { ia(postari.get('g:' + g)); }); }""","""        // margine_slab: cuvântul găsit doar în pași / rezultat / termeni_def adaugă la margine doar atât din idf
        // (ponderile acelor câmpuri sunt ≤ 0,45), ca o fișă care îl are în titlu să nu fie tăiată de una cu pași lungi
        var slab = R.margine_slab, wT = slab != null ? w : w, wS = slab != null ? w * slab : w;
        function ia(p, cat, semnX, vaz) { if (p) p.forEach(function (x) { if (vazut[x] !== semnX && (!vaz || vazut2[x] !== semn)) { vazut[x] = semnX; if (!margine[x]) cand.push(x); margine[x] += cat; } }); }
        function toate(M, cat, semnX, vaz) {
          ia(M.get('s:' + t.s), cat, semnX, vaz);
          t.g.forEach(function (g) { ia(M.get('g:' + g), cat, semnX, vaz); });
          if (t.ps) t.ps.forEach(function (s) { ia(M.get('s:' + s), cat, semnX, vaz); });
          if (t.alt) { ia(M.get('s:' + t.alt.s), cat, semnX, vaz); t.alt.g.forEach(function (g) { ia(M.get('g:' + g), cat, semnX, vaz); }); }
        }
        if (slab == null) toate(postari, w, semn);
        else {
          // întâi câmpurile tari (idf întreg), apoi restul (idf × slab), fără să numărăm de două ori aceeași fișă
          toate(postariT, wT, semn);
          for (var it = 0; it < cand.length; it++) if (vazut[cand[it]] === semn) vazut2[cand[it]] = semn;
          toate(postari, wS, -semn, true);
        }"""),
("""      var cand = [], margine = new Float64Array(N), vazut = new Int32Array(N);""","""      var cand = [], margine = new Float64Array(N), vazut = new Int32Array(N), vazut2 = new Int32Array(N);"""),
]
for a,b in rep:
    assert a in s, a[:70]
    s=s.replace(a,b)
open(p,'w',encoding='utf8').write(s)
print('ok')
