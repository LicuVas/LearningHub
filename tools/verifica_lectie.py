# -*- coding: utf-8 -*-
"""Poarta pentru o lectie NOUA: e intreaga si legata, sau doar arata bine?

    python tools/verifica_lectie.py <fisier>

Verifica, in ordinea in care lucrurile chiar se strica:
  1. cele 5 sectiuni ale formatului C (frame, obiectiv, atomi, practica, recapitulare)
  2. chestionarele se PARSEAZA si au cheia o litera existenta  (altfel raman moarte
     pe ecran - exact esecul tacut care ne-a costat 417 pagini)
  3. fiecare atom cu chestionar are container .atom-quiz SI un identificator
  4. cheia de progres (storage key) e UNICA pe tot situl - doua lectii cu aceeasi
     cheie isi suprascriu reciproc progresul elevului
  5. scripturile se rezolva pe disc (calea relativa are adancimea corecta)
  6. legaturile inainte/inapoi duc la fisiere care exista
  7. lectia e legata din index-ul modulului ei

Iese cu 0 doar daca toate trec.
"""
import os, io, re, sys, json, html as _html

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECTIUNI = (
    ("frame", r'class="lesson-frame"'),
    ("obiectiv", r'class="goal-section"'),
    ("atomi", r'id="atomic-content"'),
    ("practica", r'class="practice-section"'),
    ("recapitulare", r'class="review-section"'),
)


def verifica(path):
    probleme = []
    src = io.open(path, encoding="utf-8", errors="replace").read()
    dp = os.path.dirname(path)

    for nume, marca in SECTIUNI:
        if not re.search(marca, src):
            probleme.append("lipseste sectiunea: %s" % nume)

    # 2 + 3. chestionarele
    n_quiz = 0
    for m in re.finditer(r"data-quiz\s*=\s*(\"|')(.*?)\1", src, re.S):
        n_quiz += 1
        try:
            date = json.loads(_html.unescape(m.group(2)))
        except Exception as e:
            probleme.append("chestionarul %d nu se parseaza: %s" % (n_quiz, str(e)[:70]))
            continue
        if not isinstance(date, list):
            probleme.append("chestionarul %d e obiect, nu lista (motorul crapa cu questions.map)" % n_quiz)
            continue
        for k, q in enumerate(date, 1):
            opt = q.get("options") or []
            cor = (q.get("correct") or "").strip().lower()
            if len(cor) != 1 or not ("a" <= cor <= "z"):
                probleme.append("chestionarul %d, intrebarea %d: cheia %r nu e o singura litera" % (n_quiz, k, q.get("correct")))
            elif ord(cor) - 97 >= len(opt):
                probleme.append("chestionarul %d, intrebarea %d: cheia %r depaseste cele %d variante" % (n_quiz, k, cor, len(opt)))
    if n_quiz == 0:
        probleme.append("lectia nu are niciun chestionar")

    for m in re.finditer(r'<div class="atom"[^>]*>', src):
        cap = m.group(0)
        bloc = src[m.end():m.end() + 6000]
        if "data-quiz" in cap or "data-quiz" in bloc[:2000]:
            if "atom-quiz" not in bloc[:6000]:
                probleme.append("un atom are chestionar dar n-are container .atom-quiz (ramane mort pe ecran)")
            if not re.search(r'id="[^"]+"|data-atom-id="[^"]+"', cap):
                probleme.append("un atom are chestionar dar n-are identificator (motorul nu-l gaseste)")

    # 4. cheia de progres
    chei = set(re.findall(r"(?:AtomicLearning|PracticeSimple|LessonSummary)\.init\(\s*'([^']+)'", src))
    if not chei:
        probleme.append("nu gasesc cheia de progres (AtomicLearning.init)")
    for cheie in chei:
        altele = []
        for d2, _, f2 in os.walk(os.path.join(R, "content")):
            if ".backup" in d2.lower():
                continue
            for f in f2:
                p2 = os.path.join(d2, f)
                if not f.endswith(".html") or os.path.abspath(p2) == os.path.abspath(path):
                    continue
                s2 = io.open(p2, encoding="utf-8", errors="replace").read()
                if ("'" + cheie + "'") in s2 and "AtomicLearning.init" in s2:
                    altele.append(os.path.relpath(p2, R).replace(os.sep, "/"))
        if altele:
            probleme.append("cheia de progres %r e folosita si de: %s" % (cheie, ", ".join(altele[:3])))

    # 5. scripturile
    for src_attr in re.findall(r'<script[^>]+src="([^"]+)"', src):
        if src_attr.startswith("http"):
            continue
        t = os.path.normpath(os.path.join(R if src_attr.startswith("/") else dp,
                                          src_attr.lstrip("/")))
        if not os.path.exists(t):
            probleme.append("scriptul nu exista pe disc: %s" % src_attr)

    # 6. inainte / inapoi
    for h in re.findall(r'href="((?:\.\./)*[a-z0-9][^"]*\.html)"', src):
        t = os.path.normpath(os.path.join(dp, h.split("#")[0]))
        if not os.path.exists(t):
            probleme.append("legatura moarta: %s" % h)

    # 7. legata din index
    ix = os.path.join(dp, "index.html")
    if os.path.exists(ix):
        if os.path.basename(path) not in io.open(ix, encoding="utf-8", errors="replace").read():
            probleme.append("lectia NU e legata din index.html-ul modulului")
    else:
        probleme.append("modulul n-are index.html")

    return probleme, n_quiz


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    rau = 0
    for arg in sys.argv[1:]:
        p = arg if os.path.isabs(arg) else os.path.join(R, arg.replace("/", os.sep))
        if not os.path.exists(p):
            print("NU EXISTA: %s" % arg)
            rau = 1
            continue
        probleme, nq = verifica(p)
        eticheta = os.path.relpath(p, R).replace(os.sep, "/")
        if probleme:
            rau = 1
            print("PICA  %s  (%d chestionare)" % (eticheta, nq))
            for x in probleme:
                print("        - %s" % x)
        else:
            print("OK    %s  (%d chestionare, toate se parseaza)" % (eticheta, nq))
    sys.exit(rau)
