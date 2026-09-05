# -*- coding: utf-8 -*-
"""Cheia de progres numeste ALT subiect decat fisierul in care sta?

    python tools/verifica_cheie_vs_fisier.py            -> arata
    python tools/verifica_cheie_vs_fisier.py --aplica   -> rescrie cheia

De ce conteaza (gasit 05.09.2026): la rescrierea lectiilor asezate gresit, agentilor
li s-a cerut sa NU atinga cheia de progres - corect atunci, ca sa nu reseteze degeaba
progresul. Dar continutul s-a schimbat COMPLET, iar cheia a ramas cu numele
subiectului vechi:

    fisier : lectia1-calculator-fisiere.html      (preda gestionarea fisierelor)
    cheie  : cls12-...-lectia1-retele-calculatoare  (subiectul de dinainte)

Efectul: progresul se inregistreaza sub un nume care nu mai descrie nimic, incoerent
cu restul modulului. Si, fiindca lectia e alta acum, progresul VECHI nici n-ar trebui
pastrat - elevul n-a citit lectia asta.

Cheia asteptata: <profil>-<clasa>-<modul>-<numele fisierului fara .html>
unde <profil> exista doar la liceu/ si profesional/ (asa cum le-a pus
repara_chei_progres.py acolo unde erau ciocniri).

Semnalez DOAR cazurile in care coada cheii nu se potriveste cu numele fisierului -
nu impun prefixul de profil unde n-a fost nevoie de el, ca sa nu resetez progres bun.
"""
import os, io, re, sys

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INIT = re.compile(r"((?:AtomicLearning|PracticeSimple|LessonSummary)\.init\(\s*)(['\"])(.+?)\2")


def slug(nume_fisier):
    return os.path.splitext(nume_fisier)[0]


def asteptat(p):
    rel = os.path.relpath(p, os.path.join(R, "content")).replace(os.sep, "/").split("/")
    fisier = slug(rel[-1])
    modul = rel[-2] if len(rel) >= 2 else ""
    clasa = next((x for x in rel if re.match(r"^(cls\d+|an\d+)", x)), "")
    profil = rel[1] if rel[0] in ("liceu", "profesional") and len(rel) > 1 else ""
    parti = [x for x in (profil, clasa, modul, fisier) if x]
    return "-".join(parti)


def toate_lectiile():
    for dp, _, fns in os.walk(os.path.join(R, "content")):
        if ".backup" in dp.lower():
            continue
        for f in sorted(fns):
            if f.endswith(".html") and f != "index.html":
                yield os.path.join(dp, f)


if __name__ == "__main__":
    aplica = "--aplica" in sys.argv
    # ATENTIE, lectia din 05.09.2026: cand cheia si numele fisierului se contrazic,
    # nu e sigur ca gresita e CHEIA. La 3 din 6 cazuri gasite, lectia preda exact ce
    # zicea cheia, iar numele fisierului era cel mincinos - adica o lectie asezata
    # gresit. Renumirea oarba a cheii ar fi ASCUNS doua subiecte de bacalaureat care
    # nu se predau nicaieri. De aceea `--aplica` cere fisierele explicit.
    tinte = [a for a in sys.argv[1:] if not a.startswith("--")]
    if aplica and not tinte:
        print("Refuz sa rescriu la gramada. Da fisierele explicit, dupa ce ai verificat")
        print("CE PREDA fiecare lectie: daca preda ce zice cheia, gresit e numele fisierului.")
        sys.exit(2)

    rele, n = [], 0
    for p in toate_lectiile():
        if True:
            f = os.path.basename(p)
            src = io.open(p, encoding="utf-8", errors="replace").read()
            chei = set(m.group(3) for m in INIT.finditer(src))
            if not chei:
                continue
            fisier = slug(f)
            # cheia trebuie sa se termine cu numele fisierului; altfel numeste alt subiect
            gresite = [c for c in chei if not c.endswith(fisier)]
            if not gresite:
                continue
            rel = os.path.relpath(p, R).replace(os.sep, "/")
            nou_c = asteptat(p)
            rele.append((rel, sorted(gresite), nou_c))
            if aplica and any(rel.endswith(t.replace(chr(92), "/").lstrip("./")) or t in rel for t in tinte):
                out = src
                for c in gresite:
                    out = INIT.sub(lambda m: m.group(1) + m.group(2) + (nou_c if m.group(3) == c else m.group(3)) + m.group(2), out)
                if out != src:
                    io.open(p, "w", encoding="utf-8", newline="").write(out)
                    n += 1

    for rel, g, nou_c in rele:
        print("  %s" % rel)
        print("      cheia :  %s" % ", ".join(g))
        print("      ar fi :  %s" % nou_c)
    print()
    print(("SCRIS: %d fisiere" % n) if aplica else
          ("chei care numesc alt subiect decat fisierul: %d\nruleaza cu --aplica ca sa rescrie" % len(rele)))
