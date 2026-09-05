# -*- coding: utf-8 -*-
"""Verific pe disc ca defectele raportate ca reparate chiar au disparut.
Oracol independent de agentii care au facut munca: caut markerii direct in HTML."""
import io, os, re, sys
sys.path.insert(0, r"C:\00\Projects\LearningHub\tools")
import practice_io as P
R = r"C:\00\Projects\LearningHub"

def corp(f, idx):
    src = io.open(os.path.join(R, f.replace("/", os.sep)), encoding="utf-8", errors="replace").read()
    b = P.bucati(src)
    return src[b[idx - 1][1]:b[idx - 1][2]]

def sol(f, idx):
    """Doar textul rezolvarii, nu si cerinta - altfel gasesc in enunt ce caut in raspuns."""
    m = P.SOL.search(corp(f, idx))
    return m.group(0) if m else ""

T = []
def t(nume, val): T.append((nume, bool(val)))

NEGATIE = r"nu |nu e |eroare|gresit|Atentie|nu se |niciodata"

def doar_ca_avertisment(text, tipar):
    """O rezolvare BUNA numeste forma gresita ca sa avertizeze impotriva ei.
    Deci nu e destul sa cer absenta tiparului - cer ca fiecare aparitie sa stea
    langa o negatie. Fara asta, testul confunda greseala cu avertismentul
    despre greseala (mi s-a intamplat: 3 fals-pozitive, 05.09.2026)."""
    for m in re.finditer(tipar, text, re.I):
        fereastra = text[max(0, m.start() - 180):m.end() + 60]
        if not re.search(NEGATIE, fereastra, re.I):
            return False
    return True

# 1. umanist cls10 calcul tabelar - rezolvarile erau despre Word
f = "content/liceu/umanist/cls10/m2-calcul-tabelar/lectia1-tabel-formule.html"
tot = "".join(sol(f, i) for i in (1, 2, 3))
t("umanist: zero termeni de Word in rezolvari", not re.search(r"Ctrl\+B|Ctrl\+E|Ctrl\+J|\.docx|Justified|Times New Roman|Print Preview", tot))
t("umanist: apar SUM si AVERAGE", "SUM(" in tot and "AVERAGE(" in tot)
t("umanist: apare .xlsx (ce cere ex.1)", ".xlsx" in tot)
t("umanist: apare referinta absoluta cu $ (ex.3)", "$" in sol(f, 3))

# 2. stiinte cls11 imagini - punctul e) fara clasificare
f = "content/liceu/stiinte/cls11/m2-imagini-web/lectia1-imagine-digitala.html"
s = sol(f, 1)
t("imagini: ex1 clasifica de 5 ori (raster/vectorial)", len(re.findall(r"raster|vectorial", s, re.I)) >= 5)
t("imagini: apare Arrhenius (punctul e chiar tratat)", "Arrhenius" in s)

# 3. tehnici de cautare - performanta dadea produsul gata
f = "content/liceu/tehnologic/cls11/m4-surse-si-cautare/lectia2-tehnici-cautare.html"
s = sol(f, 3)
t("cautare: interogarea finala verbatim a disparut", "filetype:pdf site:.ro" not in s)

# 4. m7 functii - em-dash
f = "content/liceu/tehnologic/cls11/m7-functii/lectia4-siruri-financiare-utilizator.html"
s = sol(f, 2)
t("m7: formula are linie de pauza, nu cratima", "\u2014" in s)

# 5. m8 rapoarte - SUMIF cu virgula
f = "content/liceu/tehnologic/cls11/m8-instrumente-si-studii-de-caz/lectia2-rapoarte.html"
s = sol(f, 2)
t("m8: SUMIF cu punct-si-virgula", re.search(r"SUMIF\([^)]*;[^)]*;", s))
t("m8: forma cu virgula apare doar ca avertisment", doar_ca_avertisment(P.vizibil(s), r"SUMIF\([A-Z0-9:$]+,"))

# 6. cls5 prezentari - lipsea a 4-a greseala
f = "content/tic/cls5/extra-siguranta-backup/lectia5-prezentari-design.html"
s = P.vizibil(sol(f, 1))
t("cls5: rezolvarea numara macar 4 greseli", len(re.findall(r"\b[4-9]\)|\b4\.", s)) >= 1 or s.count("greseala") >= 4)

# 7. header-footer - Different First Page in sectiunea gresita
f = "content/tic/cls7/m2-word-avansat/lectia4-header-footer.html"
s = sol(f, 2)
t("header: Different First Page apare doar ca avertisment", doar_ca_avertisment(P.vizibil(s), r"Different First Page"))
t("header: spune ca antetul sectiunii 1 se lasa gol", re.search(r"sectiunii 1 se lasa gol", P.vizibil(s), re.I))

# 8. liste - butonul Font din Define New Multilevel List
f = "content/tic/cls7/m2-word-avansat/lectia1-liste.html"
s = sol(f, 2)
t("liste: Define New Multilevel List -> Font apare doar ca avertisment", doar_ca_avertisment(P.vizibil(s), r"Define New Multilevel List\s*-?&gt;?\s*Font"))
t("liste: trimite la calea corecta pentru fontul titlului", re.search(r"Home\s*-?&gt;?\s*Font|Heading 1", P.vizibil(s), re.I))

# 9. for - long vs long long
f = "content/tic/cls7/m3-algoritmi-schema/lectia7-for.html"
s = sol(f, 3)
t("for: apare long long", "long long" in s)
t("for: nu mai apare 'long fact' simplu", not re.search(r"(?<!long )long fact", s))

# 10. fizica - h citit degeaba
f = "content/tic/cls7/m3-algoritmi-schema/lectia8-fizica.html"
s = P.vizibil(sol(f, 2))
t("fizica: rezolvarea numeste legatura h = 9.8*t*t/2", "9.8" in s and "h" in s)

# 11. CV - telefonul
f = "content/tic/cls7/m5-proiecte-recap/lectia1-proiect-cv.html"
s = P.vizibil(sol(f, 2))
t("CV: nu mai recomanda telefonul", not re.search(r"telefon(ul)? si email|email si telefon", s, re.I))

# global: nimic stricat
import subprocess
ex = fara = 0
for root, _, files in os.walk(os.path.join(R, "content")):
    for fn in files:
        if fn.endswith(".html"):
            d = P.dump(os.path.join(root, fn))
            ex += len(d); fara += sum(1 for x in d if not x["are_rezolvare"])
t("global: 1606 exercitii, 0 fara rezolvare", ex == 1606 and fara == 0)
dubluri = []
for root, _, files in os.walk(os.path.join(R, "content")):
    for fn in files:
        if not fn.endswith(".html"): continue
        p = os.path.join(root, fn)
        src = io.open(p, encoding="utf-8", errors="replace").read()
        for i, (a, b, e) in enumerate(P.bucati(src), 1):
            if src[b:e].count('class="practice-solution"') > 1:
                dubluri.append((os.path.relpath(p, R), i))
t("global: niciun exercitiu cu doua rezolvari lipite", not dubluri)

for nume, val in T:
    print(("  PASS  " if val else "  FAIL  ") + nume)
print("exercitii:", ex, "| fara rezolvare:", fara, "| dubluri:", len(dubluri))
print("VERDICT:", "PASS %d/%d" % (sum(v for _, v in T), len(T)) if all(v for _, v in T) else "FAIL %d/%d" % (sum(v for _, v in T), len(T)))
