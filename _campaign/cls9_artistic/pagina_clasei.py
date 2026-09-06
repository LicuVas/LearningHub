# -*- coding: utf-8 -*-
"""Rescrie pagina clasei a IX-a (artistic) ca sa arate cele 3 module NOI.

    python pagina_clasei.py            -> arata
    python pagina_clasei.py --aplica   -> scrie

Cele doua module vechi (m1-tic-baze, m2-intro-grafica) ies din pagina: predau pe
programa dinainte de reforma. m2-intro-grafica (imaginea digitala) a trecut, prin
programa noua, la clasa a X-a - nu mai e materie de a IX-a.
Fisierele lor NU se sterg de aici; raman pe disc pana cand lectiile noi sunt scrise
si verificate, ca sa poata fi folosite ca sursa (mai ales lectia despre componentele
sistemului de calcul, care se suprapune cu M3).
"""
import io, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from plan import MODULE, PROFIL, CLASA, toate_lectiile

P = r"C:\00\Projects\LearningHub\content\liceu\artistic\cls9\index.html"

CARD = """            <a href="%s/index.html" class="module-card">
                <div class="module-header">
                    <div class="module-number">M%s</div>
                    <div class="module-info">
                        <h3>%s</h3>
                        <span class="module-lessons">%d lectii</span>
                    </div>
                </div>
                <p class="module-desc">%s</p>
                <div class="module-tags"><span class="tag tag-tic">TIC</span></div>
            </a>"""

if __name__ == "__main__":
    aplica = "--aplica" in sys.argv
    s = io.open(P, encoding="utf-8", errors="replace").read()

    pe_modul = {}
    for x in toate_lectiile():
        pe_modul.setdefault(x["modul"], []).append(x)
    total = sum(len(v) for v in pe_modul.values())

    carduri = "\n".join(CARD % (m["id"], m["id"][1], m["titlu"], len(pe_modul[m["id"]]), m["descriere"])
                        for m in MODULE)

    # Inlocuiesc TOT blocul modules-grid, gasindu-i </div>-ul pereche prin adancime.
    # Prima varianta folosea un regex ne-lacom care se oprea la primul "</div></div>",
    # adica INAUNTRUL primului card vechi: ramaneau resturi din cardurile scoase
    # (pagina arata 4 module in loc de 3). Verificat si reparat pe loc.
    m0 = re.search(r'<div class="modules-grid">', s)
    if not m0:
        raise SystemExit("nu gasesc blocul modules-grid")
    adanc, poz_final = 1, -1
    for mm in re.finditer(r"<div\b[^>]*>|</div>", s[m0.end():]):
        if mm.group(0).startswith("</"):
            adanc -= 1
            if adanc == 0:
                poz_final = m0.end() + mm.start()
                break
        else:
            adanc += 1
    if poz_final < 0:
        raise SystemExit("nu gasesc unde se inchide modules-grid")
    nou = s[:m0.end()] + "\n" + carduri + "\n        " + s[poz_final:]
    nou = re.sub(r"<span>&#128218;\s*\d+ module</span>", "<span>&#128218; %d module</span>" % len(MODULE), nou)
    nou = re.sub(r"(<span>\U0001F4DA )\d+( module</span>)", r"\g<1>%d\g<2>" % len(MODULE), nou)
    nou = re.sub(r"(<span>\U0001F4D6 )\d+( lectii</span>)", r"\g<1>%d\g<2>" % total, nou)
    nou = re.sub(r'(<p class="subtitle">).*?(</p>)',
                 r"\g<1>T.I.C., programa noua (Anexa 22 la OMEC 6.930/2025), aplicata din 2026-2027\g<2>",
                 nou, count=1, flags=re.S)

    schimbat = nou != s
    print("pagina modificata:", schimbat)
    for m in MODULE:
        print("   %s/index.html  ->  %s (%d lectii)" % (m["id"], m["titlu"], len(pe_modul[m["id"]])))
    for vechi in ("m1-tic-baze", "m2-intro-grafica"):
        print("   scos din pagina: %s  (%s)" % (vechi, "inca pe disc" if os.path.isdir(
            os.path.join(os.path.dirname(P), vechi)) else "sters"))
    print("module in pagina noua:", len(re.findall(r'class="module-card"', nou)),
          "| lectii anuntate:", total)
    if aplica and schimbat:
        io.open(P, "w", encoding="utf-8", newline="").write(nou)
        print("SCRIS:", P)
    elif not aplica:
        print("ruleaza cu --aplica ca sa scrie")
