# -*- coding: utf-8 -*-
"""Construieste INSTALATIA celor 29 de lectii noi de clasa a IX-a, profil artistic.

    python schela.py            -> arata ce ar crea
    python schela.py --aplica   -> scrie fisierele

De ce mecanic si nu cu agenti: caile relative (cinci niveluri in sus), cheile de
progres, legaturile inainte/inapoi si apelurile de initializare sunt exact lucrurile
pe care agentii le gresesc si pe care poarta le prinde abia dupa. Le generez de aici,
dintr-un sablon care functioneaza deja, si las agentilor doar continutul pedagogic.

Sablonul: content/liceu/artistic/cls9/m1-tic-baze/lectia1-sisteme-calcul.html
Continutul lui ramane in fisierele noi ca PLACEHOLDER si trebuie inlocuit integral -
valul de agenti primeste asta ca sarcina, iar verificatorul cauta resturi.
"""
import io, os, re, sys, shutil

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from plan import MODULE, PROFIL, CLASA, toate_lectiile

R = r"C:\00\Projects\LearningHub"
BAZA = os.path.join(R, "content", "liceu", PROFIL, CLASA)
SABLON_LECTIE = os.path.join(BAZA, "m1-tic-baze", "lectia1-sisteme-calcul.html")
SABLON_MODUL = os.path.join(BAZA, "m1-tic-baze", "index.html")

CULORI = {"m1-societate-digitala": "#8b5cf6", "m2-continuturi-digitale": "#06b6d4",
          "m3-sisteme-de-calcul": "#f59e0b"}
ICOANE = {"m1-societate-digitala": "&#127760;", "m2-continuturi-digitale": "&#128196;",
          "m3-sisteme-de-calcul": "&#128187;"}


def patch_lectie(sablon, L, urmatoare):
    s = sablon
    # 1. titlul paginii si titlul mare
    s = re.sub(r"<title>.*?</title>",
               "<title>Lectia %d: %s | Clasa a IX-a Arte (TIC)</title>" % (L["nr"], L["titlu"]),
               s, count=1, flags=re.S)
    s = re.sub(r'(<h1 class="lesson-title">).*?(</h1>)', r"\g<1>%s\g<2>" % L["titlu"], s, count=1, flags=re.S)

    # 2. navigarea de sus: butonul "Urmatoarea"
    if urmatoare:
        s = re.sub(r'(<a href=")[^"]*(" class="nav-btn" title="Lectia urmatoare">)',
                   r"\g<1>%s\g<2>" % urmatoare["fisier"], s, count=1)
    else:
        s = re.sub(r'<a href="[^"]*" class="nav-btn" title="Lectia urmatoare">.*?</a>',
                   '<a href="../index.html" class="nav-btn" title="Inapoi la modul">Modulul &#8594;</a>',
                   s, count=1, flags=re.S)

    # 3. cheile de progres (toate trei) si Breadcrumb / LearningProgress
    s = re.sub(r"(AtomicLearning|PracticeSimple|LessonSummary)\.init\('[^']*'\)",
               lambda m: "%s.init('%s')" % (m.group(1), L["cheie"]), s)
    s = re.sub(r"(module:\s*')[^']*(')", r"\g<1>%s\g<2>" % L["modul"], s, count=1)
    s = re.sub(r"(moduleName:\s*')[^']*(')", r"\g<1>%s\g<2>" % L["modul_titlu"], s, count=1)
    s = re.sub(r"(lesson:\s*')[^']*(')", lambda m: m.group(1) + L["titlu"].replace("'", "") + m.group(2), s, count=1)
    s = re.sub(r"LearningProgress\.init\('[^']*',\s*'[^']*',\s*'[^']*'\)",
               "LearningProgress.init('%s', '%s', '%s')" % (CLASA, L["modul"], L["fisier"]), s, count=1)

    # 4. caseta "Urmatoarea lectie" de la finalul recapitularii
    if urmatoare:
        s = re.sub(r'(<a href=")[^"]*(" class="btn-next">)', r"\g<1>%s\g<2>" % urmatoare["fisier"], s, count=1)
        s = re.sub(r"(Continua cu <strong>).*?(</strong>)", r"\g<1>%s\g<2>" % urmatoare["titlu"], s, count=1, flags=re.S)
    else:
        s = re.sub(r'(<a href=")[^"]*(" class="btn-next">)', r"\g<1>../index.html\g<2>", s, count=1)
        s = re.sub(r"(Continua cu <strong>).*?(</strong>)", r"\g<1>recapitularea modulului\g<2>", s, count=1, flags=re.S)

    # 5. semn ca fisierul e SCHELA, nu lectie terminata (agentul il scoate)
    s = s.replace("<body>", "<body>\n<!-- SCHELA: continutul pedagogic e inca cel al lectiei-sablon "
                            "(componentele sistemului de calcul) si trebuie inlocuit INTEGRAL. "
                            "Programa: %s | Continut: %s -->" % (L["domeniu"], L["continut"][:220]), 1)
    return s


def patch_modul(sablon, m, lectii):
    s = sablon
    s = re.sub(r"<title>.*?</title>",
               "<title>%s | Cls IX | LearningHub</title>" % m["titlu"], s, count=1, flags=re.S)
    s = re.sub(r'(<span class="module-badge">).*?(</span>)',
               r"\g<1>Modulul %s - TIC\g<2>" % m["id"][1], s, count=1, flags=re.S)
    s = re.sub(r'(<div class="header-icon">).*?(</div>)', r"\g<1>%s\g<2>" % ICOANE[m["id"]], s, count=1, flags=re.S)
    s = re.sub(r"(<h1>).*?(</h1>)", r"\g<1>%s\g<2>" % m["titlu"], s, count=1, flags=re.S)
    s = re.sub(r'(<p class="subtitle">).*?(</p>)', r"\g<1>%s\g<2>" % m["descriere"], s, count=1, flags=re.S)
    s = re.sub(r"(--module-color:\s*)[^;]+(;)", r"\g<1>%s\g<2>" % CULORI[m["id"]], s, count=1)
    s = re.sub(r'(<span id="completedLessons">0</span> din )\d+( lectii completate)',
               r"\g<1>%d\g<2>" % len(lectii), s, count=1)
    # competentele = domeniul de programa
    comp = "".join('\n                    <span class="comp-tag">%s</span>' % t
                   for t in [m["domeniu"]] + [l["titlu"][:46] for l in lectii[:2]])
    s = re.sub(r'(<div class="competencies-list">).*?(\n\s*</div>)', r"\g<1>%s\g<2>" % comp, s, count=1, flags=re.S)
    # cardurile de lectii
    carduri = []
    for l in lectii:
        carduri.append(
            '            <a href="%s" class="lesson-card">\n'
            '                <div class="lesson-number">%d</div>\n'
            '                <div class="lesson-content">\n'
            '                    <div class="lesson-title">%s</div>\n'
            '                    <div class="lesson-desc">%s</div>\n'
            '                </div>\n'
            '                <div class="lesson-meta">\n'
            '                    <span class="meta-badge badge-tic">TIC</span>\n'
            '                    <span class="meta-badge badge-artistic">Artistic</span>\n'
            '                    <span class="lesson-duration">~45 min</span>\n'
            '                </div>\n'
            '            </a>' % (l["fisier"], l["nr"], l["titlu"], l["continut"][:190]))
    s = re.sub(r'(<div class="lessons-grid">).*?(\n\s*</div>\s*\n\s*(?:<script|</div>))',
               lambda mm: mm.group(1) + "\n" + "\n\n".join(carduri) + mm.group(2), s, count=1, flags=re.S)
    return s


if __name__ == "__main__":
    aplica = "--aplica" in sys.argv
    sab_l = io.open(SABLON_LECTIE, encoding="utf-8", errors="replace").read()
    sab_m = io.open(SABLON_MODUL, encoding="utf-8", errors="replace").read()

    L = list(toate_lectiile())
    pe_modul = {}
    for x in L:
        pe_modul.setdefault(x["modul"], []).append(x)

    n_l = n_m = 0
    for m in MODULE:
        lect = pe_modul[m["id"]]
        d = os.path.join(BAZA, m["id"])
        if aplica:
            os.makedirs(d, exist_ok=True)
            io.open(os.path.join(d, "index.html"), "w", encoding="utf-8", newline="").write(patch_modul(sab_m, m, lect))
        n_m += 1
        print("  MODUL %-26s %d lectii" % (m["id"], len(lect)))
        for i, x in enumerate(lect):
            urm = lect[i + 1] if i + 1 < len(lect) else None
            if aplica:
                io.open(os.path.join(d, x["fisier"]), "w", encoding="utf-8", newline="").write(
                    patch_lectie(sab_l, x, urm))
            n_l += 1
            print("      %-36s cheie=%s" % (x["fisier"], x["cheie"]))
    print()
    print(("SCRIS: %d module, %d lectii" % (n_m, n_l)) if aplica
          else ("s-ar crea: %d module, %d lectii\nruleaza cu --aplica" % (n_m, n_l)))
