# -*- coding: utf-8 -*-
"""Citeste exercitiile unei lectii si le adauga o REZOLVARE MODEL pliabila.

    python tools/practice_io.py dump    <fisier>          -> JSON cu exercitiile
    python tools/practice_io.py apply   <fisier> <json>   -> insereaza rezolvarile
    python tools/practice_io.py replace <fisier> <json>   -> INLOCUIESTE rezolvarile existente

Rezolvarea se pune ca <details class="practice-solution"> la finalul exercitiului -
HTML nativ, fara JavaScript, deci merge oriunde si nu poate strica motorul.

Garzi la scriere (orice incalcare => se sare peste acel exercitiu):
  - exercitiul exista si NU are deja o rezolvare
  - textul rezolvarii are macar 80 de caractere
  - nu contine taguri neinchise care ar putea inghiti pagina
"""
import os, io, re, sys, json, html as _html

EX = re.compile(r'<div class="practice-exercise"[^>]*>', re.I)
DIV = re.compile(r"<div\b[^>]*>|</div>", re.I)
PERICULOS = re.compile(r"</?(script|style|textarea|iframe|title|head|body|html)\b", re.I)


def vizibil(s):
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", _html.unescape(s)).strip()


def inchidere(src, dupa):
    """Pozitia lui </div> care inchide div-ul deschis inainte de `dupa`."""
    adanc = 1
    for m in DIV.finditer(src, dupa):
        if m.group(0).startswith("</"):
            adanc -= 1
            if adanc == 0:
                return m.start()
        else:
            adanc += 1
    return -1


def bucati(src):
    """[(start_tag, end_of_open_tag, pozitia_lui_</div>_care_inchide)]"""
    out = []
    for m in EX.finditer(src):
        e = inchidere(src, m.end())
        if e > 0:
            out.append((m.start(), m.end(), e))
    return out


def dump(path):
    src = io.open(path, encoding="utf-8", errors="replace").read()
    out = []
    for i, (a, b, e) in enumerate(bucati(src), 1):
        corp = src[b:e]
        nivel = re.search(r'data-level="([^"]+)"', src[a:b])
        titlu = re.search(r"<h3[^>]*>(.*?)</h3>", corp, re.S)
        out.append({
            "idx": i,
            "nivel": nivel.group(1) if nivel else "",
            "titlu": vizibil(titlu.group(1)) if titlu else "",
            "text": vizibil(corp)[:1400],
            "are_rezolvare": "practice-solution" in corp,
        })
    return out


SOL = re.compile(r'\s*<details class="practice-solution">.*?</details>\s*', re.I | re.S)


def sterge_solutii(corp):
    """Scoate blocul de rezolvare dintr-un corp de exercitiu. Intoarce (corp_curat, cate)."""
    return SOL.subn("\n        ", corp)


def apply(path, rezolvari, inlocuieste=False):
    prin_idx = {int(r["idx"]): r["rezolvare"] for r in rezolvari}
    src = io.open(path, encoding="utf-8", errors="replace").read()
    puncte = bucati(src)
    inserari, sarite = [], []
    # La inlocuire scoatem intai rezolvarile vechi ale exercitiilor vizate, apoi
    # recalculam pozitiile - altfel offset-urile de mai jos ar fi gresite.
    if inlocuieste:
        taieri = []
        for i, (a, b, e) in enumerate(puncte, 1):
            if i not in prin_idx:
                continue
            curat, n = sterge_solutii(src[b:e])
            if n:
                taieri.append((b, e, curat))
        if taieri:
            out, last = [], 0
            for b, e, curat in sorted(taieri):
                out.append(src[last:b])
                out.append(curat)
                last = e
            out.append(src[last:])
            src = "".join(out)
            puncte = bucati(src)
    for i, (a, b, e) in enumerate(puncte, 1):
        rez = prin_idx.get(i)
        if not rez:
            continue
        corp = src[b:e]
        if "practice-solution" in corp:
            sarite.append((i, "are deja rezolvare"))
            continue
        txt = str(rez).strip()
        if len(vizibil(txt)) < 80:
            sarite.append((i, "rezolvare prea scurta (%d caractere)" % len(vizibil(txt))))
            continue
        if PERICULOS.search(txt):
            sarite.append((i, "contine taguri interzise"))
            continue
        if txt.count("<") != txt.count(">"):
            sarite.append((i, "taguri neinchise"))
            continue
        bloc = ('\n            <details class="practice-solution">\n'
                '                <summary>Vezi rezolvarea</summary>\n'
                '                <div class="practice-solution-body">' + txt + '</div>\n'
                '            </details>\n        ')
        inserari.append((e, bloc))
    if inserari:
        out, last = [], 0
        for poz, bloc in sorted(inserari):
            out.append(src[last:poz])
            out.append(bloc)
            last = poz
        out.append(src[last:])
        io.open(path, "w", encoding="utf-8").write("".join(out))
    return len(inserari), sarite


if __name__ == "__main__":
    cmd, p = sys.argv[1], sys.argv[2]
    if not os.path.isabs(p):
        p = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), p.replace("/", os.sep))
    if cmd == "dump":
        print(json.dumps(dump(p), ensure_ascii=False, indent=1))
    elif cmd in ("apply", "replace"):
        rez = json.loads(io.open(sys.argv[3], encoding="utf-8").read())
        n, s = apply(p, rez, inlocuieste=(cmd == "replace"))
        print("inserate: %d" % n)
        for i, motiv in s:
            print("  SARIT ex%d: %s" % (i, motiv))
