# Faza 0: uneste citirile ca elevul (_citire/*.json), uneltele (_unelte, _oracol) si arbitrul Excel
# (excel_real_viii4.json) in candidati.json. Verifica MECANIC fiecare citat (>=12 caractere, exista in sursa).
# Aplica judecata (nivelul 4 din plan) doar unde e scrisa explicit mai jos, cu motiv.
import json, sys
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
F0 = Path(r"C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/faza0")
EX, CI = F0 / "_extras", F0 / "_citire"

def strings(o):
    if isinstance(o, str):
        yield o
    elif isinstance(o, dict):
        for x in o.values():
            yield from strings(x)
    elif isinstance(o, list):
        for x in o:
            yield from strings(x)

CORPUS = "\n".join(p.read_text(encoding="utf-8") for p in EX.glob("*.txt"))
for p in EX.glob("*.config.json"):
    CORPUS += "\n" + "\n".join(strings(json.loads(p.read_text(encoding="utf-8"))))
norm = lambda s: " ".join(s.split())
CORPUS_N = norm(CORPUS)

def verif(p):
    c = p.get("citat") or ""
    p["citat_verificat"] = len(c) >= 12 and (c in CORPUS or norm(c) in CORPUS_N)
    return p

ORACOL = json.loads((F0 / "_oracol" / "_rezumat.json").read_text(encoding="utf-8"))
EXCEL = json.loads((F0 / "excel_real_viii4.json").read_text(encoding="utf-8"))
TEST = {"calculator-v": 170, "prezentari-vi": 186, "word-obiecte-vii": 158, "excel-viii": 206, "excel-pas-cu-pas-viii": 228,
        "calculator-antrenament-v": 94, "prezentari-antrenament-vi": 88, "word-antrenament-vii": 88, "excel-antrenament-viii": 102}
PREREQ_SEMNALE = {"calculator-v": ["calculator-v N4P2: „salvarea” folosit înainte de animatii-3d-vi N2 (semnal, nenumărat)"],
                  "word-obiecte-vii": ["word-obiecte-vii N3P2: „câte” (semnal fals: cuvânt obișnuit)"]}
BAZIN4 = {"calculator-antrenament-v": 10, "prezentari-antrenament-vi": 4, "word-antrenament-vii": 3, "excel-antrenament-viii": 4}

def scor_joc(slug, cls, imagini=None):
    s = {"test_joc": f"TRECUT, exit 0 ({TEST[slug]} întrebări jucate pe Pixel 7 + iPhone SE)",
         "ilustratii": "0 probleme pe tot situl (exit 0)",
         "prereq_jocuri": "0 numărate" + ("; semnale: " + " · ".join(PREREQ_SEMNALE[slug]) if slug in PREREQ_SEMNALE else ""),
         "oracol_novice": f"{ORACOL[cls]['ultima_linie']} pe situl clasei (config necalibrat; vezi _oracol/raport_{cls}.txt)"}
    if imagini is not None:
        s["imagini_in_nivel"] = imagini
    return s

def excel_pe(candidat):
    ps = [p for p in EXCEL["probe"] if p["candidat"] == candidat]
    return {k: sum(1 for p in ps if p["verdict"] == k) for k in ("CONFIRMAT", "INFIRMAT", "NETESTABIL")}

def din_alternativa(alt):
    out = []
    for x in alt.get("probleme_grave_vazute") or []:
        citat, _, de_ce = x.partition(" — ")
        out.append(verif({"gravitate": "NEEVALUAT (alternativă, citită pe scurt)", "citat": citat.strip("„”\" "), "loc": alt["cale"], "ce_se_intampla": de_ce or x}))
    return out

def cit(cls):
    d = json.loads((CI / f"{cls}.json").read_text(encoding="utf-8"))
    return d

out = {"generat": "2026-09-27", "reguli": "GRAV = împiedică elevul să facă lecția sau îl învață ceva fals; MINOR = restul. "
       "Citatele au fost verificate mecanic în textul extras din sit (citat_verificat). Judecata mea e marcată cu «judecator».",
       "clase": []}

# ------------------------------------------------ V
d = cit("V")
alt = {a["cale"]: a for a in d["alternative"]}
out["clase"].append({"clasa": "V", "lectia": 4, "titlu": d["titlu"], "recomandat": "jocuri/calculator-v/index.html#N4",
  "candidati": [
    {"cale": "jocuri/calculator-v/index.html#N4", "tip": "nivel-joc (pe pași)", "rol": "RECOMANDAT", "scor_unelte": scor_joc("calculator-v", "V", 3),
     "acoperire": d["acoperire"], "probleme": [verif(p) for p in d["probleme"]],
     "de_reparat_pentru_verificat_partial": d["recomandare"]["de_reparat_pentru_verificat_partial"]},
    {"cale": "jocuri/calculator-antrenament-v/index.html", "tip": "antrenament (bazin)", "rol": "recapitulare după N4, nu lecție",
     "scor_unelte": {**scor_joc("calculator-antrenament-v", "V"), "intrebari_lectia4_in_bazin": BAZIN4["calculator-antrenament-v"]},
     "probleme": din_alternativa(alt.get("jocuri/calculator-antrenament-v/index.html", {})), "verdict_scurt": alt.get("jocuri/calculator-antrenament-v/index.html", {}).get("verdict_scurt")},
    {"cale": "content/tic/cls5/m1-sisteme/lectia2-hardware.html", "tip": "lecție veche (ținta PANOULUI azi)", "rol": "nerecomandat",
     "scor_unelte": {"imagini_in_pagina": 0, "test_joc": "nu se aplică"}, "probleme": din_alternativa(alt.get("content/tic/cls5/m1-sisteme/lectia2-hardware.html", {})),
     "verdict_scurt": alt.get("content/tic/cls5/m1-sisteme/lectia2-hardware.html", {}).get("verdict_scurt")}]})

# ------------------------------------------------ VI
d = cit("VI")
alt = {a["cale"]: a for a in d["alternative"]}
cands = [{"cale": "jocuri/prezentari-vi/index.html#N3", "tip": "nivel-joc (pe pași)", "rol": "RECOMANDAT", "scor_unelte": scor_joc("prezentari-vi", "VI", 1),
          "acoperire": d["acoperire"], "probleme": [verif(p) for p in d["probleme"]],
          "de_reparat_pentru_verificat_partial": d["recomandare"]["de_reparat_pentru_verificat_partial"]}]
for c, a in alt.items():
    cands.append({"cale": c, "tip": a.get("tip"), "rol": "nerecomandat" + (" (ținta PANOULUI azi)" if "lectia2-slide-uri" in c else ""),
                  "scor_unelte": ({**scor_joc("prezentari-antrenament-vi", "VI"), "intrebari_lectia4_in_bazin": BAZIN4["prezentari-antrenament-vi"]}
                                  if "antrenament" in c else {"imagini_in_pagina": 0}),
                  "probleme": din_alternativa(a), "verdict_scurt": a.get("verdict_scurt")})
out["clase"].append({"clasa": "VI", "lectia": 4, "titlu": d["titlu"], "recomandat": "jocuri/prezentari-vi/index.html#N3", "candidati": cands})

# ------------------------------------------------ VII
d = cit("VII")
alt = {a["cale"]: a for a in d["alternative"]}
pr = [verif(p) for p in d["probleme"]]
for p in pr:
    if p["gravitate"] == "GRAV" and p["categorie"] == "BLOCAJ" and "meniul de niveluri" in p["loc"]:
        p["judecator"] = "CONFIRMAT în cod: jocuri/_motor/motor.js rândul 58, const unlocked=i=>i===0||!!S.lv[i-1]"
    if p["gravitate"] == "GRAV" and "Imagini (Pictures)" in p["citat"]:
        p["judecator"] = "CONFIRMAT pe captura lecției (inserare-imagini-tabel.webp: săgeata ˅ sub Pictures = meniu). Gravitatea depinde de versiunea Office din laborator (2016 deschide direct fereastra de fișiere)."
    if p["gravitate"] == "GRAV" and p["categorie"] == "IMAGINE_GRESITA":
        p["judecator"] = "CONFIRMAT: am deschis tabel-antet.webp — doar rândul de antet și celula 41 sunt încadrate; eticheta «o coloană ↓» arată spre rândul de antet."
    if p["gravitate"] == "GRAV" and p["categorie"] == "EVALUARE_NEPREDATA":
        p["judecator"] = "CONFIRMAT în cod (word-obiecte-vii/index.html: init antet:false; problems() cere s.antet). Nu blochează definitiv: după o greșeală apare indiciul cu «Rând de antet»; rămâne GRAV pentru că respinge numărătoarea corectă predată."
out["clase"].append({"clasa": "VII", "lectia": 4, "titlu": d["titlu"], "recomandat": "jocuri/word-obiecte-vii/index.html#N1+N3",
  "panou": "NU are nicio intrare pentru lecția 4 (C:/00/AI_0/data/panou/lectii.json)",
  "dependenta_N3_de_N2": d.get("dependenta_N3_de_N2"),
  "candidati": [{"cale": "jocuri/word-obiecte-vii/index.html#N1+N3", "tip": "nivel-joc (pe pași)", "rol": "RECOMANDAT", "scor_unelte": scor_joc("word-obiecte-vii", "VII", 6),
                 "acoperire": d["acoperire"], "probleme": pr, "rezultate_promise_word": d.get("rezultate_promise_word"),
                 "de_reparat_pentru_verificat_partial": d["recomandare"]["de_reparat_pentru_verificat_partial"]}] +
  [{"cale": c, "tip": a.get("tip"), "rol": "nerecomandat",
    "scor_unelte": ({**scor_joc("word-antrenament-vii", "VII"), "intrebari_lectia4_in_bazin": BAZIN4["word-antrenament-vii"]}
                    if "antrenament" in c else {"imagini_in_pagina": 0}),
    "probleme": din_alternativa(a), "verdict_scurt": a.get("verdict_scurt")} for c, a in alt.items()]})

# ------------------------------------------------ VIII
d = cit("VIII")
alt = {a["cale"]: a for a in d["alternative"]}
cands = []
IMG = {"jocuri/excel-viii/index.html#N2": 1, "jocuri/excel-pas-cu-pas-viii/index.html#N2": 1, "jocuri/excel-pas-cu-pas-viii/index.html#N5": 3}
EXC = {"jocuri/excel-viii/index.html#N2": "excel-viii N2", "jocuri/excel-pas-cu-pas-viii/index.html#N2": "excel-pas-cu-pas-viii N2",
       "jocuri/excel-pas-cu-pas-viii/index.html#N5": "excel-pas-cu-pas-viii N5"}
for c in d["candidati"]:
    slug = c["cale"].split("/")[1]
    pr = [verif(p) for p in c["probleme"]]
    if c["cale"].endswith("excel-viii/index.html#N2"):
        for p in pr:
            if "apasă pe un colț, apoi pe colțul opus" in p["citat"]:
                p["gravitate_cititor"] = p["gravitate"]
                p["gravitate"] = "GRAV"
                p["judecator"] = ("RIDICAT la GRAV de arbitrul Excel (excel_real_viii4.json, A20: INFIRMAT): în Excel-ul real "
                                  "clic pe B2 și apoi clic pe C4 lasă selectată DOAR C4. Exercițiul și întrebarea de test Q2 exersează un gest "
                                  "care în aplicație nu merge (simulator ≠ aplicație, nivelul 2 din plan).")
    rol = "RECOMANDAT" if c["cale"].endswith("excel-viii/index.html#N2") else "nerecomandat"
    cands.append({"cale": c["cale"], "tip": c["tip"], "rol": rol,
                  "scor_unelte": {**scor_joc(slug, "VIII", IMG.get(c["cale"])), "excel_real": excel_pe(EXC[c["cale"]])},
                  "acoperire": c.get("acoperire"), "probleme": pr})
cands[0]["de_reparat_pentru_verificat_partial"] = d["recomandare"]["de_reparat_pentru_verificat_partial"]
for c, a in alt.items():
    pr = din_alternativa(a)
    sc = {"imagini_in_pagina": 0}
    if "lectia1-interfata" in c:
        sc["excel_real"] = excel_pe("lectia veche cls8/m1/lectia1-interfata")
        pr.append(verif({"gravitate": "MINOR", "categorie": "FAPT_GRESIT", "citat": "Ctrl + End = sari la ultima celulă cu date",
                         "loc": c + " (Scurtături)", "ce_se_intampla": "Arbitrul Excel (D05, INFIRMAT): după ce golești o celulă departată (Z100), Ctrl+End te duce tot acolo — la ultima celulă FOLOSITĂ, nu la ultima cu date.",
                         "judecator": "adăugat din excel_real_viii4.json"}))
    if "antrenament" in c:
        sc = {**scor_joc("excel-antrenament-viii", "VIII"), "intrebari_lectia4_in_bazin": BAZIN4["excel-antrenament-viii"]}
    cands.append({"cale": c, "tip": a.get("tip"), "rol": "nerecomandat" + (" (ținta PANOULUI azi, și pentru nr. 3)" if "lectia1-interfata" in c else ""),
                  "scor_unelte": sc, "probleme": pr, "verdict_scurt": a.get("verdict_scurt")})
out["clase"].append({"clasa": "VIII", "lectia": 4, "titlu": d["titlu"], "recomandat": "jocuri/excel-viii/index.html#N2", "candidati": cands})

# ------------------------------------------------ totaluri
tot = {"grave_recomandati": 0, "grave_nerecomandati": 0, "minore_recomandati": 0, "citate_neverificate": []}
for cl in out["clase"]:
    for c in cl["candidati"]:
        g = sum(1 for p in c["probleme"] if p["gravitate"] == "GRAV")
        m = sum(1 for p in c["probleme"] if p["gravitate"] == "MINOR")
        c["numar"] = {"GRAV": g, "MINOR": m}
        if c["rol"] == "RECOMANDAT":
            tot["grave_recomandati"] += g; tot["minore_recomandati"] += m
            cl["grave"], cl["minore"] = g, m
        else:
            tot["grave_nerecomandati"] += g
        tot["citate_neverificate"] += [f"{cl['clasa']} {c['cale']} {p['loc']}" for p in c["probleme"] if not p["citat_verificat"]]
out["totaluri"] = tot
(F0 / "candidati.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for cl in out["clase"]:
    print(cl["clasa"], cl["recomandat"], "GRAV", cl["grave"], "MINOR", cl["minore"], "|", [(c["cale"][-40:], c["numar"]) for c in cl["candidati"]])
print(json.dumps(tot, ensure_ascii=False))
