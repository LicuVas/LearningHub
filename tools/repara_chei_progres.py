# -*- coding: utf-8 -*-
"""Cheia de progres nu contine profilul, deci cele sase versiuni de liceu
ale aceleiasi lectii scriu in acelasi loc din memoria browserului.

    cls10-m1-procesare-text-lectia1-documente-formatare   <- artistic SI stiinte SI ...

Cine termina lectia la tehnologic o vede bifata si la umanist, desi e alt continut.
Masurat 04.09.2026: 21 de chei folosite de 105 lectii, TOATE cu continut diferit.

    python tools/repara_chei_progres.py            -> arata ce ar schimba
    python tools/repara_chei_progres.py --aplica   -> scrie

Prefixez cu profilul DOAR unde exista ciocnire, ca sa nu resetez degeaba progresul
lectiilor sanatoase.
"""
import os, io, re, sys, collections

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Ghilimele SIMPLE sau DUBLE. Cu doar apostrof, cheile a 7 lectii (mai ales mat-info)
# nu erau nici macar VAZUTE de unealta, deci n-au intrat niciodata in verificarea de
# ciocniri. Aceeasi orbire o avea si poarta verifica_lectie.py (gasit 05.09.2026).
INIT = re.compile(r"((?:AtomicLearning|PracticeSimple|LessonSummary)\.init\(\s*)(['\"])(.+?)\2")


def lectii():
    for dp, _, fns in os.walk(os.path.join(R, "content")):
        if ".backup" in dp.lower() or "_atasamente" in dp.lower():
            continue
        for f in fns:
            if f.endswith(".html"):
                yield os.path.join(dp, f)


def profil_de(p):
    """Ramura care face lectia unica: liceu/<profil> sau profesional/<ramura>."""
    rel = os.path.relpath(p, os.path.join(R, "content")).replace(os.sep, "/").split("/")
    if rel[0] in ("liceu", "profesional") and len(rel) > 1:
        return rel[1]
    return None


# Atentie: fiecare lectie apeleaza init de TREI ori (AtomicLearning, PracticeSimple,
# LessonSummary) cu aceeasi cheie. Daca strang caile intr-o lista, fiecare fisier apare
# de trei ori si pare ca se ciocneste cu el insusi - 304 fisiere in loc de 105.
# Deci: multime de CAI, si iau doar grupul cheii.
chei = collections.defaultdict(set)
for p in lectii():
    s = io.open(p, encoding="utf-8", errors="replace").read()
    for _, _q, cheie in set(INIT.findall(s)):
        chei[cheie].add(p)

ciocnite = {k for k, v in chei.items() if len(v) > 1}
print("chei distincte: %d   ciocnite: %d" % (len(chei), len(ciocnite)))

aplica = "--aplica" in sys.argv
schimbari, sarite = 0, []
for p in lectii():
    s = io.open(p, encoding="utf-8", errors="replace").read()
    if not INIT.search(s):
        continue
    prof = profil_de(p)
    nou = s
    local = 0
    for m in INIT.finditer(s):
        q, cheie = m.group(2), m.group(3)
        if cheie not in ciocnite:
            continue
        if not prof:
            sarite.append((os.path.relpath(p, R), cheie, "nu-i pot deduce ramura"))
            continue
        if cheie.startswith(prof + "-"):
            continue
        # pastrez ghilimelele exact cum erau in fisier
        nou = nou.replace(m.group(1) + q + cheie + q,
                          m.group(1) + q + prof + "-" + cheie + q)
        local += 1
    if local:
        schimbari += 1
        if aplica:
            io.open(p, "w", encoding="utf-8", newline="").write(nou)
        else:
            print("   %-72s %d chei" % (os.path.relpath(p, R).replace(os.sep, "/")[-72:], local))

print("")
print("%s: %d fisiere" % ("SCRIS" if aplica else "s-ar schimba", schimbari))
for x in sarite[:10]:
    print("   SARIT %s (%s): %s" % (x[0], x[1], x[2]))
if not aplica:
    print("ruleaza cu --aplica ca sa scrie")
