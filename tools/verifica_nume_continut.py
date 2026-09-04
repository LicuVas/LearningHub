# -*- coding: utf-8 -*-
"""Numele fisierului promite un subiect, fisierul preda altul.

Testul nu depinde de index (unde titlul cartonasului e uneori butonul "Incepe →"):
compar slug-ul din numele fisierului cu <h1> + titlurile atomilor din acelasi fisier.
Un fisier numit lectia2-pagini-web.html care preda prelucrarea imaginilor e o
nepotrivire sigura - orice ar scrie indexul.
"""
import os, io, re, sys, json, html as _html, collections

R = r"C:\00\Projects\LearningHub"
STOP = {"lectia", "extra", "recap", "final", "intro", "html", "cls", "proiect", "evaluare"}
# radacini care inseamna acelasi lucru, ca sa nu semnalez sinonime
SINONIM = {
    "web": "web", "pagini": "web", "html": "web", "site": "web",
    "imagine": "imagine", "imagini": "imagine", "grafica": "imagine", "foto": "imagine",
    "text": "text", "word": "text", "documente": "text", "redactare": "text",
    "calcul": "calcul", "excel": "calcul", "tabelar": "calcul", "formule": "calcul",
    "prezentari": "prezentari", "powerpoint": "prezentari", "slide": "prezentari",
    "retele": "retele", "internet": "retele", "network": "retele",
    "securitate": "securitate", "siguranta": "securitate", "cibernetica": "securitate",
    "algoritmi": "algoritmi", "algoritm": "algoritmi", "pseudocod": "algoritmi",
    "date": "date", "baze": "date", "database": "date", "access": "date",
}


def viz(s):
    return re.sub(r"\s+", " ", _html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


def normeaza(w):
    # Taiere la radacina: romana schimba terminatia (sortari/sortare, parametri/parametrilor)
    # si fara asta iese o alarma falsa la fiecare plural.
    w = w.lower()
    for k, v in SINONIM.items():
        if w.startswith(k[:5]) and len(k) >= 5:
            return v
    if w in SINONIM:
        return SINONIM[w]
    return w[:6]


def din_nume(f):
    s = re.sub(r"\.html$", "", f)
    s = re.sub(r"^lectia\d+[-_]?", "", s)
    return {normeaza(w) for w in re.split(r"[-_]+", s) if len(w) > 3 and w not in STOP}


def din_continut(s):
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S | re.I)
    atomi = re.findall(r'<h3 class="atom-title"[^>]*>(.*?)</h3>', s, re.S | re.I)
    goal = re.search(r'class="goal-section".*?<p[^>]*>(.*?)</p>', s, re.S | re.I)
    txt = " ".join([viz(h1.group(1)) if h1 else ""] + [viz(a) for a in atomi] +
                   [viz(goal.group(1)) if goal else ""])
    txt = re.sub(r"[^a-zA-Z0-9 ]+", " ", txt).lower()
    return {normeaza(w) for w in txt.split() if len(w) > 3}, (viz(h1.group(1)) if h1 else "")


gasite = []
for dp, _, fns in os.walk(os.path.join(R, "content")):
    if ".backup" in dp.lower() or "_atasamente" in dp.lower():
        continue
    for f in fns:
        if not f.endswith(".html") or f == "index.html":
            continue
        p = os.path.join(dp, f)
        s = io.open(p, encoding="utf-8", errors="replace").read()
        if "atomic-learning.js" not in s:
            continue
        nume = din_nume(f)
        if not nume:
            continue
        corp, h1 = din_continut(s)
        comun = nume & corp
        if not comun:
            gasite.append({
                "fisier": os.path.relpath(p, R).replace(os.sep, "/"),
                "promite": sorted(nume),
                "h1": h1,
            })

print("lectii unde NICIUN cuvant din numele fisierului nu apare in titlu/atomi/obiectiv: %d" % len(gasite))
print("")
sect = collections.Counter("/".join(g["fisier"].split("/")[:4]) for g in gasite)
for k, v in sect.most_common():
    print("   %-46s %2d" % (k, v))
print("")
for g in gasite:
    print("-- %s" % g["fisier"])
    print("   numele promite : %s" % ", ".join(g["promite"]))
    print("   fisierul preda : %s" % g["h1"][:88])

io.open(os.path.join(R, "_campaign", "proba_elevi_2026_09_03", "nume_vs_continut.json"),
        "w", encoding="utf-8", newline="").write(json.dumps(gasite, ensure_ascii=False, indent=1))
print("")
print("scris: nume_vs_continut.json")

# Nu corectez automat: din cele 21 gasite pe 04.09.2026, 11 erau titluri motivationale
# legitime ("Vreau sa iau decizii complexe in Excel!" pentru lectia de functii logice)
# sau sinonime reale (birotica = suite office). Semnalez si las omul sa citeasca.
sys.exit(1 if gasite else 0)
