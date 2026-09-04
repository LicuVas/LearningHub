# -*- coding: utf-8 -*-
"""Cifrele afisate pe paginile de navigare trebuie sa fie ADEVARATE.

Verifica, pe paginile de clasa (content/<sectiune>/<profil>/<clasa>/index.html):
  - "N module"  din antet  == numarul de foldere de modul care chiar au lectii
  - "N lectii"  din antet  == numarul total de fisiere lectia*.html sub clasa
  - "N lectii"  de pe fiecare card de modul == cate are modulul acela

De ce exista: pe 04.09.2026, pagina de liceu anunta "380+ lectii" cand erau 273,
iar o pagina de clasa ramasese la 7 dupa ce se adaugase a 8-a lectie. Cifrele
scrise de mana imbatranesc in tacere.

Uz:
    python tools/verifica_cifre.py            # raporteaza, exit 1 daca ceva nu se potriveste
    python tools/verifica_cifre.py --repara   # scrie cifrele corecte
"""
import os, io, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPARA = "--repara" in sys.argv
SKIP = (".backup", "backup", "_atasamente", "node_modules")

STAT_MOD = re.compile(r'(<span class="stat-item">[^<]*?)(\d+)(\s*module</span>)')
STAT_LEC = re.compile(r'(<span class="stat-item">[^<]*?)(\d+)(\s*lectii</span>)')
CARD = re.compile(r'<a href="([^"/]+)/index\.html"[^>]*class="module-card".*?'
                  r'<span class="module-lessons">(\d+)\s*lecti[ei]</span>', re.S)


def lectii_in(d):
    n = 0
    for dp, _, fns in os.walk(d):
        if any(x in dp.lower() for x in SKIP):
            continue
        n += len([f for f in fns if re.match(r"lectia", f) and f.endswith(".html")])
    return n


def module_in(d):
    n = 0
    for sub in os.listdir(d):
        sd = os.path.join(d, sub)
        if os.path.isdir(sd) and not any(x in sub.lower() for x in SKIP):
            if lectii_in(sd):
                n += 1
    return n


probleme = []
reparate = 0
for dp, dirs, fns in os.walk(os.path.join(ROOT, "content")):
    if any(x in dp.lower() for x in SKIP):
        continue
    if "index.html" not in fns:
        continue
    if not module_in(dp):
        continue
    rel = os.path.relpath(dp, ROOT).replace(os.sep, "/")
    p = os.path.join(dp, "index.html")
    s = io.open(p, encoding="utf-8", errors="replace").read()
    nou = s

    real_mod, real_lec = module_in(dp), lectii_in(dp)

    m = STAT_MOD.search(s)
    if m and int(m.group(2)) != real_mod:
        probleme.append("%s: antet zice %s module, sunt %d" % (rel, m.group(2), real_mod))
        nou = STAT_MOD.sub(lambda x: x.group(1) + str(real_mod) + x.group(3), nou, count=1)
    m = STAT_LEC.search(s)
    if m and int(m.group(2)) != real_lec:
        probleme.append("%s: antet zice %s lectii, sunt %d" % (rel, m.group(2), real_lec))
        nou = STAT_LEC.sub(lambda x: x.group(1) + str(real_lec) + x.group(3), nou, count=1)

    for folder, scris in CARD.findall(s):
        sd = os.path.join(dp, folder)
        if not os.path.isdir(sd):
            continue
        adev = lectii_in(sd)
        if adev and int(scris) != adev:
            probleme.append("%s: cardul %s zice %s lectii, sunt %d" % (rel, folder, scris, adev))
            nou = re.sub(r'(<a href="' + re.escape(folder) + r'/index\.html".*?<span class="module-lessons">)\d+(\s*lecti[ei]</span>)',
                         lambda x: x.group(1) + str(adev) + x.group(2), nou, count=1, flags=re.S)

    if REPARA and nou != s:
        io.open(p, "w", encoding="utf-8").write(nou)
        reparate += 1

print("pagini de clasa verificate sub content/")
if probleme:
    print("")
    print("CIFRE CARE NU SE POTRIVESC: %d" % len(probleme))
    for x in probleme:
        print("   " + x)
else:
    print("toate cifrele afisate se potrivesc cu ce e pe disc")

if REPARA:
    print("")
    print("pagini rescrise: %d" % reparate)
sys.exit(1 if (probleme and not REPARA) else 0)
