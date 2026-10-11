p=r'C:/00/Projects/LearningHub/cum-fac/cautare.js'
s=open(p,encoding='utf8').read()
rep=[
("""        if (distanta(w, v, max) <= max) return numeApp[i][1];
      }
      return null;
    }""","""        if (distanta(w, v, max) <= max) { numeGasit = v; return numeApp[i][1]; }
      }
      return null;
    }
    var numeGasit = null;           // ultimul nume corectat de numeAplicatieGresit (pentru programele aplicației)"""),
("""      var jet = [];
      A.jetoane.forEach(function (j, nrJ) {""","""      var jet = [];
      var corectate = [];             // numele de program scrise greșit („clipchap”, „audacyti”), corectate
      A.jetoane.forEach(function (j, nrJ) {"""),
("""          if (ca) { A.vot[ca] = (A.vot[ca] || 0) + 3; A.numite[ca] = true; return; }""","""          if (ca) { A.vot[ca] = (A.vot[ca] || 0) + 3; A.numite[ca] = true; if (numeGasit) corectate.push(radacina(numeGasit)); return; }"""),
("""          if (c && c.s[0] === '@') { var ap = c.s.slice(1); A.vot[ap] = (A.vot[ap] || 0) + 3; A.numite[ap] = true; return; }""","""          if (c && c.s[0] === '@') { var ap = c.s.slice(1); A.vot[ap] = (A.vot[ap] || 0) + 3; A.numite[ap] = true; corectate.push(radacina(c.w)); return; }"""),
("""        programe: programeIn(D, A.text ? A.text.split(' ').map(radacina) : []) };""","""        programe: programeIn(D, corectate, programeIn(D, A.text ? A.text.split(' ').map(radacina) : [])) };"""),
]
for a,b in rep:
    assert a in s, a[:60]
    s=s.replace(a,b)
open(p,'w',encoding='utf8').write(s)
print('ok')
