# -*- coding: utf-8 -*-
"""Cheia de raspuns e mereu aceeasi litera intr-o lectie? Atunci se ia 10 ghicind.

    python tools/verifica_distributia_cheilor.py [--prag N]

Un corector a gasit, la o lectie rescrisa, ca toate cele 6 raspunsuri corecte erau
"a": elevul care alege mecanic prima varianta ia scor maxim fara sa citeasca nimic.
Verific daca e o scapare izolata sau un tipar pe tot situl.

Motorul AMESTECA variantele la afisare (atomic-learning.js recalculeaza litera
corecta dupa amestecare), deci pe ecran defectul nu se vede la o lectie. Dar
chestionarele de PRACTICA si cele scrise in alte formate nu trec toate prin acelasi
drum - iar un fisier in care cheia e mereu aceeasi litera e oricum un semn ca
rescrierea n-a variat pozitia, nu ca a variat-o si a iesit din intamplare.
"""
import os, io, re, sys, json, html as _html, collections

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def chei_din(src):
    """Toate literele corecte dintr-o lectie, in ordinea aparitiei."""
    out = []
    for m in re.finditer(r"data-quiz\s*=\s*(\"|')(.*?)\1", src, re.S):
        try:
            date = json.loads(_html.unescape(m.group(2)))
        except Exception:
            continue
        if not isinstance(date, list):
            continue
        for q in date:
            c = (q.get("correct") or "").strip().lower()
            if len(c) == 1 and "a" <= c <= "z":
                out.append(c)
    return out


if __name__ == "__main__":
    prag = 4
    if "--prag" in sys.argv:
        prag = int(sys.argv[sys.argv.index("--prag") + 1])

    rau, total_intrebari, global_ = [], 0, collections.Counter()
    for dp, _, fns in os.walk(os.path.join(R, "content")):
        if ".backup" in dp.lower():
            continue
        for f in sorted(fns):
            if not f.endswith(".html"):
                continue
            p = os.path.join(dp, f)
            chei = chei_din(io.open(p, encoding="utf-8", errors="replace").read())
            if not chei:
                continue
            total_intrebari += len(chei)
            global_.update(chei)
            c = collections.Counter(chei)
            litera, n = c.most_common(1)[0]
            # o lectie e semnalata daca are macar `prag` intrebari SI toate au aceeasi cheie
            if len(chei) >= prag and n == len(chei):
                rau.append((os.path.relpath(p, R).replace(os.sep, "/"), litera, len(chei)))

    print("intrebari cu cheie citita: %d" % total_intrebari)
    print("distributia pe tot situl: %s" % ", ".join(
        "%s=%d (%.1f%%)" % (k, v, 100.0 * v / max(1, total_intrebari)) for k, v in sorted(global_.items())))
    print()
    print("LECTII in care TOATE raspunsurile au aceeasi litera (minim %d intrebari): %d" % (prag, len(rau)))
    for rel, litera, n in sorted(rau, key=lambda x: -x[2]):
        print("   %2d x '%s'   %s" % (n, litera, rel))
