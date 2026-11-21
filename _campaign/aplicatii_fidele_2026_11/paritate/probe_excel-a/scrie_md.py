"""Scrie paritate/excel-a.md din paritate/excel-a.json (numerele, lista NU / PARȚIAL cu cele cerute de exerciții întâi)."""
import json, pathlib, collections, re

P = pathlib.Path(__file__).resolve().parents[1]
d = json.load(open(P / "excel-a.json", encoding="utf-8"))
F = d["functii"]
c = collections.Counter(x["biblioteca"] for x in F)
cer = [x for x in F if x["ceruta_de_exercitiu"]]
scurt = lambda s, n=150: (s if len(s) <= n else s[:n - 1].rstrip() + "…")


def rand(x):
    de_ce = x.get("lipsa") if x["biblioteca"] == "PARTIAL" and x.get("lipsa") else x.get("biblioteca_dovada", "")
    ex = ""
    if x["ceruta_de_exercitiu"] and x["exercitii"]:
        ex = " — exercițiu: " + scurt(x["exercitii"][0], 90)
    return f"- `{x['id']}` {scurt(x['functie'], 120)}{ex}  \n  _{scurt(de_ce, 190)}_"


L = ["# Paritate Excel, partea A (foaia, tipurile de date, editarea, interfața, formulele și funcțiile, formatarea, foile)", "",
     "Vechiul = simulatoarele din lecțiile publicate pe proba (commitul 0dcd4ffb, `proba_src/`); noul = biblioteca `aplicatii/excel.js`.",
     "Inventarul l-am făcut pe patru bucăți, apoi le-am unit: baza (excelx.js, excelx-interfata.js, tip-foaie.js, panglica, "
     "simulatoarele din pagini), formatarea (excelx-formatare.js), foile (registru-foi.js), formulele (excelx-formule.js, excelx-functii.js). "
     "Probele headless (poligonul, rețeaua blocată în afara 127.0.0.1) sunt în `probe_excel-a/`.", "",
     "## Numerele", "",
     f"- **{len(F)} funcții**: **{c['DA']} DA**, **{c['PARTIAL']} PARȚIAL**, **{c['NU']} NU**.",
     f"- Cerute de un exercițiu: {len(cer)} (DA {sum(x['biblioteca']=='DA' for x in cer)}, PARȚIAL {sum(x['biblioteca']=='PARTIAL' for x in cer)}, NU {sum(x['biblioteca']=='NU' for x in cer)}).",
     "- Toate cele 31 de funcții de foaie de calcul din motorul vechi (SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, COUNTBLANK, COUNTIF, SUMIF, "
     "AVERAGEIF, ROUND, ROUNDUP, ROUNDDOWN, INT, ABS, SQRT, POWER, MOD, LEN, UPPER, LOWER, TRIM, LEFT, RIGHT, MID, CONCATENATE, CONCAT, AND, OR, NOT, IF) "
     "dau în bibliotecă ACELAȘI rezultat pe aceleași date, inclusiv #DIV/0!, #NUM!, #VALUE!, #NAME? (61 de formule; singura diferență: "
     "ghilimelele „ ” — vechiul dă #NAME?, biblioteca nu primește formula; `probe_excel-a/proba_functii.json`).", ""]
for titlu, filtru in [("## Cerute de exerciții și lipsă (NU)", lambda x: x["ceruta_de_exercitiu"] and x["biblioteca"] == "NU"),
                      ("## Cerute de exerciții, făcute doar pe jumătate (PARȚIAL)", lambda x: x["ceruta_de_exercitiu"] and x["biblioteca"] == "PARTIAL"),
                      ("## Necerute de exerciții, lipsă (NU)", lambda x: not x["ceruta_de_exercitiu"] and x["biblioteca"] == "NU"),
                      ("## Necerute de exerciții, PARȚIAL", lambda x: not x["ceruta_de_exercitiu"] and x["biblioteca"] == "PARTIAL")]:
    xs = [x for x in F if filtru(x)]
    L += [f"{titlu} — {len(xs)}", ""] + [rand(x) for x in xs] + [""]
L += ["## Ce n-am apucat / ce e nesigur", "",
      "- `jocuri/_motor/tip-excel.js` (foaia de bază: tastarea, selecția cu mouse-ul, Ctrl+C/V, umplerea, butoanele legate ale panglicii) e la excel-b; "
      "aici am trecut doar ce adaugă fișierele mele peste ea. `motor.js` nu l-am citit (verificarea exercițiilor am luat-o din câmpurile `verifica` ale paginilor).",
      "- `panglica-excel.json` l-am citit doar ca rezumat (7 file, 200 de butoane); ce buton face ceva hotărăște tip-excel.js (excel-b).",
      "- Exercițiile din m2-l08…m2-l13 le-am legat de funcții doar prin căutarea formulelor (SUM, AVERAGE, MIN, MAX, IF); detaliile lor sunt în partea de formule și la excel-b.",
      "- Neprobate pe dispozitiv real: tastele moarte (apostroful), tragerea și atingerea lungă pe telefon.",
      ] + [f"- {scurt(s, 220)}" for s in d["nesigure"]] + ["",
      f"GATA_PARITATE excel-a total={len(F)} da={c['DA']} partial={c['PARTIAL']} nu={c['NU']}"]
(P / "excel-a.md").write_text("\n".join(L) + "\n", encoding="utf-8")
print("scris excel-a.md", len(L), "rânduri")
