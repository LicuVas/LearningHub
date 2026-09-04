# -*- coding: utf-8 -*-
"""Adauga la finalul lectiei caseta de aprofundare "Vrei mai mult?".

    python tools/depth_io.py dump  <fisier>          -> ce stie lectia + daca are deja caseta
    python tools/depth_io.py apply <fisier> <json>   -> insereaza caseta

JSON-ul asteptat:
    {"corp": "<p>...</p><ul><li>...</li></ul>"}

Caseta se pune in <section class="review-section">, inainte de blocul "next-lesson"
(sau, daca lipseste, inainte de inchiderea sectiunii). E HTML static: fara JavaScript,
deci nu poate strica motorul de lectie.

Garzi la scriere (orice incalcare => se refuza, nu se scrie nimic):
  - lectia nu are deja o caseta de aprofundare
  - corpul are intre 200 si 1600 de caractere
  - fara <script>/<style>/<body>/<iframe>; taguri echilibrate
  - ORICE legatura e verificata: cele interne trebuie sa existe pe disc, cele externe
    trebuie sa fie pe lista scurta de domenii stabile. Un agent care inventeaza un URL
    plauzibil produce o legatura moarta in fata elevului - de-aia lista e inchisa.
"""
import os, io, re, sys, json, html as _html

MARCA = 'class="depth-box"'
ANCORA_NEXT = re.compile(r'<div class="next-lesson"', re.I)
REVIEW = re.compile(r'<section class="review-section"[^>]*>', re.I)
SECT_END = re.compile(r"</section>", re.I)
PERICULOS = re.compile(r"</?(script|style|textarea|iframe|title|head|body|html|form|input)\b", re.I)
TAG = re.compile(r"</?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(/?)>")
GOALE = {"br", "hr", "img", "input", "meta", "link"}
HREF = re.compile(r'href\s*=\s*["\']([^"\']+)["\']', re.I)

# Domenii externe permise: stabile, gratuite, fara cont, relevante pentru scoala romaneasca.
DOMENII_OK = (
    "ro.wikipedia.org", "en.wikipedia.org",
    "developer.mozilla.org", "www.w3schools.com", "w3schools.com",
    "docs.python.org", "www.pbinfo.ro", "pbinfo.ro",
    "www.edu.ro", "edu.ro", "rocnee.eu", "www.rocnee.eu",
    "support.microsoft.com", "support.google.com",
    "www.geogebra.org", "scratch.mit.edu", "code.org",
)


def vizibil(s):
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", _html.unescape(s)).strip()


def _echilibrat(corp):
    stiva = []
    for m in TAG.finditer(corp):
        nume, auto = m.group(1).lower(), m.group(2)
        if auto or nume in GOALE:
            continue
        if m.group(0).startswith("</"):
            if not stiva or stiva.pop() != nume:
                return False
        else:
            stiva.append(nume)
    return not stiva


def _legaturi_rele(corp, path):
    """Lista de legaturi care nu se pot dovedi. Goala = toate sunt bune."""
    rele = []
    baza = os.path.dirname(os.path.abspath(path))
    for h in HREF.findall(corp):
        h = _html.unescape(h).strip()
        if h.startswith("#") or h.startswith("mailto:"):
            continue
        if h.startswith("http://") or h.startswith("https://"):
            gazda = h.split("//", 1)[1].split("/", 1)[0].split(":")[0].lower()
            if gazda not in DOMENII_OK:
                rele.append("%s (domeniu nepermis: %s)" % (h, gazda))
            continue
        tinta = h.split("#")[0].split("?")[0]
        if not tinta:
            continue
        abs_ = os.path.normpath(os.path.join(baza, tinta))
        if not os.path.exists(abs_):
            rele.append("%s (nu exista pe disc)" % h)
    return rele


def dump(path):
    src = io.open(path, encoding="utf-8", errors="replace").read()
    titlu = re.search(r"<title>(.*?)</title>", src, re.S | re.I)
    obiectiv = re.search(r'class="goal-section".*?<p[^>]*>(.*?)</p>', src, re.S | re.I)
    atomi = [vizibil(t) for t in re.findall(r'<h3 class="atom-title"[^>]*>(.*?)</h3>', src, re.S | re.I)]
    if not atomi:
        atomi = [vizibil(t) for t in re.findall(r'class="atom[^"]*"[^>]*>\s*<h[23][^>]*>(.*?)</h[23]>', src, re.S | re.I)]
    rezumat = re.findall(r'class="summary-box".*?</div>', src, re.S | re.I)
    puncte = [vizibil(li) for li in re.findall(r"<li[^>]*>(.*?)</li>", rezumat[0], re.S | re.I)] if rezumat else []
    return {
        "fisier": os.path.basename(path),
        "titlu": vizibil(titlu.group(1)) if titlu else "",
        "obiectiv": vizibil(obiectiv.group(1))[:400] if obiectiv else "",
        "atomi": atomi,
        "ce_a_invatat": puncte,
        "are_caseta": MARCA in src,
        "ancora_gasita": bool(REVIEW.search(src)),
    }


def apply(path, corp):
    """Returneaza (scris: bool, motiv: str)."""
    src = io.open(path, encoding="utf-8", errors="replace").read()
    if MARCA in src:
        return False, "lectia are deja o caseta de aprofundare"
    corp = (corp or "").strip()
    text = vizibil(corp)
    if len(text) < 200:
        return False, "prea scurt: %d caractere vizibile (minim 200)" % len(text)
    if len(corp) > 1600:
        return False, "prea lung: %d caractere (maxim 1600)" % len(corp)
    if PERICULOS.search(corp):
        return False, "contine un tag interzis (script/style/iframe/form/...)"
    if not _echilibrat(corp):
        return False, "taguri neinchise sau inchise gresit"
    rele = _legaturi_rele(corp, path)
    if rele:
        return False, "legaturi care nu se pot dovedi: " + "; ".join(rele[:4])

    m = REVIEW.search(src)
    if not m:
        return False, "lectia nu are <section class=\"review-section\"> - nu am unde sa pun caseta"
    urm = ANCORA_NEXT.search(src, m.end())
    fin = SECT_END.search(src, m.end())
    poz = urm.start() if (urm and (not fin or urm.start() < fin.start())) else (fin.start() if fin else -1)
    if poz < 0:
        return False, "nu am gasit unde se termina sectiunea de recapitulare"

    bloc = ('\n        <div class="depth-box">\n'
            '            <h3>Vrei mai mult?</h3>\n'
            '            %s\n'
            '        </div>\n\n        ' % corp.replace("\n", "\n            "))
    io.open(path, "w", encoding="utf-8", newline="").write(src[:poz] + bloc + src[poz:])
    return True, "scris (%d caractere vizibile)" % len(text)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)
    cmd, f = sys.argv[1], sys.argv[2]
    if not os.path.isabs(f):
        f = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), f.replace("/", os.sep))
    if cmd == "dump":
        print(json.dumps(dump(f), ensure_ascii=False, indent=1))
    elif cmd == "apply":
        d = json.load(io.open(sys.argv[3], encoding="utf-8"))
        corp = d.get("corp") if isinstance(d, dict) else d
        ok, motiv = apply(f, corp)
        print(json.dumps({"scris": ok, "motiv": motiv}, ensure_ascii=False))
        sys.exit(0 if ok else 1)
    else:
        print(__doc__)
        sys.exit(2)
