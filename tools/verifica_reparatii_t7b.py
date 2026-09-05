# -*- coding: utf-8 -*-
"""Oracol independent pe reparatiile casetelor: caut markerii direct in HTML.
Lectia de dimineata: o corectare BUNA poate NUMI forma gresita ca sa avertizeze,
deci pentru fiecare defect verific si POZITIV (a aparut ce trebuie), nu doar negativ."""
import io, os, re, sys, json
sys.path.insert(0, r"C:\00\Projects\LearningHub\tools")
import depth_io as D
R = r"C:\00\Projects\LearningHub"

def caseta(rel):
    s = io.open(os.path.join(R, rel.replace("/", os.sep)), encoding="utf-8", errors="replace").read()
    i = s.find('class="depth-box"')
    return s[i:i + 6000] if i >= 0 else ""

def text(rel):
    return D.vizibil(caseta(rel))

T = []
def t(n, v): T.append((n, bool(v)))

def toate(pat, fisiere, cond):
    return all(cond(text(f)) for f in fisiere)

d = {x["idx"]: x for x in json.load(io.open(
    os.path.join(R, "_campaign", "proba_elevi_2026_09_03", "valuri", "defecte_t7b.json"), encoding="utf-8"))}

# 0. YouTube / H.265 - afirmatia falsa
f0 = d[0]["fisiere"]
t("0: formularea falsa 'H.265 sau AV1' a disparut din toate cele %d" % len(f0),
  toate(None, f0, lambda s: "H.265 sau AV1" not in s))
t("0: apare codecul corect pentru YouTube (vp09/VP9)",
  toate(None, f0, lambda s: "vp09" in s.lower() or "VP9" in s))

# 1. Monitorul Oficial
f1 = d[1]["fisiere"]
t("1: numirea institutiei a disparut", toate(None, f1, lambda s: "Monitorul Oficial" not in s))
t("1: a ramas o afirmatie moderata despre tipar", toate(None, f1, lambda s: "tipar" in s.lower() or "ziare" in s.lower()))

# 2. referinte absolute - caseta repeta Atomul 2
f2 = d[2]["fisiere"]
t("2: caseta aduce ceva nou (referinte MIXTE sau nume definite) in toate cele %d" % len(f2),
  toate(None, f2, lambda s: "mixt" in s.lower() or "Name Box" in s or "prag_minim" in s))

# 3. crop distructiv
f3 = d[3]["fisiere"]
t("3: afirmatia 'ramane distructiv' a disparut de peste tot",
  all("ramane distructiv" not in caseta(f) for f in f3))

# 9. caseta din alt subiect (spatiu neseparabil pe lectia de identitate digitala)
# ATENTIE: lista mea de fisiere-frate a prins si o lectie de PROCESARE DE TEXT, unde
# spatiul neseparabil e la locul lui. Defectul era doar pe lectia de identitate digitala.
f9 = [x for x in d[9]["fisiere"] if "societate-digitala" in x or "identitate" in x]
t("9: pe lectia de identitate digitala nu mai apare spatiul neseparabil",
  toate(None, f9, lambda s: "spatiu neseparabil" not in s.lower()))
t("9: caseta e acum pe subiectul lectiei (identitate/parole/phishing/extensii)",
  toate(None, f9, lambda s: any(k in s.lower() for k in ("parol", "phishing", "identitate", "extensi", "atasament"))))

# 12. sintaxa LibreOffice intr-un modul Excel.
# Aceeasi capcana ca dimineata: o corectare BUNA numeste forma cealalta ca sa o
# contrasteze ("LibreOffice scrie acelasi lucru cu punct"). Deci nu cer absenta,
# ci cer forma CORECTA plus contextul de contrast acolo unde apare cea veche.
f12 = d[12]["fisiere"]
t("12: apare sintaxa corecta cu semnul exclamarii",
  toate(None, f12, lambda s: "Evidenta!C:C" in s))
t("12: forma cu punct apare doar ca termen de comparatie",
  all("Evidenta.C:C" not in caseta(f) or
      re.search(r"LibreOffice[^<]{0,120}Evidenta\.C:C|Evidenta\.C:C[^<]{0,80}LibreOffice", text(f))
      for f in f12))

# global
lipsa, duble = [], []
CURATE = re.findall(r'"(content/[^"]+\.html)"',
                    io.open(os.path.join(R, "_campaign", "proba_elevi_2026_09_03", "valuri", "wf_t7.js"),
                            encoding="utf-8").read().split("const TOATE_RAW")[1].split("]")[0])
for rel in CURATE:
    s = io.open(os.path.join(R, rel.replace("/", os.sep)), encoding="utf-8", errors="replace").read()
    n = s.count('class="depth-box"')
    if n == 0: lipsa.append(rel)
    elif n > 1: duble.append((rel, n))
t("global: toate cele %d de lectii au caseta" % len(CURATE), not lipsa)
t("global: niciuna cu doua casete lipite", not duble)

for n, v in T:
    print(("  PASS  " if v else "  FAIL  ") + n)
print("lectii fara caseta:", len(lipsa), "| cu doua casete:", len(duble))
b = sum(v for _, v in T)
print("VERDICT: %s %d/%d" % ("PASS" if b == len(T) else "FAIL", b, len(T)))
