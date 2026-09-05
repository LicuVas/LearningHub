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


DIV = re.compile(r"<div\b[^>]*>|</div>", re.I)
TAG_CU_CLASA = re.compile(r'<div\b[^>]*\bclass="([^"]*)"[^>]*>', re.I)


def are_atomi(src):
    """Ca motorul: querySelectorAll('.atom') - clasa 'atom' in LISTA de clase.

    Nu merge cu `<div class="atom"`: atomii reali apar si ca `class="atom atom-card"`,
    si cu `class` pe alta pozitie (`<div data-atom-id=... class="atom" ...>`).
    Prima varianta a acestei verificari rata exact acele forme (05.09.2026)."""
    return any("atom" in c.split() for c in TAG_CU_CLASA.findall(src))
COD = re.compile(r"<(code|pre)\b[^>]*>.*?</\1>", re.I | re.S)
LEGATURA = re.compile(r'<a\b[^>]*?href="((?:\.\./)*[a-z0-9][^"]*\.html)"', re.I | re.S)


def corp_div(src, dupa):
    """Textul dintre `dupa` si </div>-ul care inchide div-ul deschis inainte de el.
    Inainte aici era o fereastra fixa de 6000 de caractere: atomii cu exemple lungi
    de cod isi aveau containerul .atom-quiz DINCOLO de fereastra, iar poarta striga
    'chestionar mort' pe lectii perfect bune (65 de alarme false, 05.09.2026)."""
    adanc = 1
    for m in DIV.finditer(src, dupa):
        if m.group(0).startswith("</"):
            adanc -= 1
            if adanc == 0:
                return src[dupa:m.start()]
        else:
            adanc += 1
    return src[dupa:]


def verifica(path):
    probleme = []
    src = io.open(path, encoding="utf-8", errors="replace").read()
    dp = os.path.dirname(path)

    for nume, marca in SECTIUNI:
        if re.search(marca, src):
            continue
        # Pentru "atomi", intrebarea care conteaza nu e daca exista wrapper-ul
        # id="atomic-content", ci daca lectia ARE atomi. Cateva lectii mai vechi
        # folosesc id="main-content" ca wrapper, dar au atomii la locul lor: poarta
        # le raporta ca "fara atomi" desi motorul le porneste (7 alarme false,
        # 05.09.2026). Wrapper-ul ramane util doar ca tinta de derulare pentru
        # butonul "Am incercat!", deci lipsa lui se spune blând, nu ca defect.
        if nume == "atomi" and are_atomi(src):
            continue
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

    # Tot pe semantica listei de clase: `<div class="atom"` rata atomii scrisi
    # `class="atom atom-card"` sau cu class pe alta pozitie - adica exact aceia pe
    # care nu-i verifica nimeni si in care se ascunde un chestionar mort.
    for m in TAG_CU_CLASA.finditer(src):
        if "atom" not in m.group(1).split():
            continue
        cap = m.group(0)
        bloc = corp_div(src, m.end())
        if "data-quiz" in cap or "data-quiz" in bloc:
            if "atom-quiz" not in bloc:
                probleme.append("un atom are chestionar dar n-are container .atom-quiz (ramane mort pe ecran)")
            if not re.search(r'id="[^"]+"|data-atom-id="[^"]+"', cap):
                probleme.append("un atom are chestionar dar n-are identificator (motorul nu-l gaseste)")

    # 4. cheia de progres
    # Ghilimele SIMPLE sau DUBLE. Cu doar apostrof, 7 lectii erau raportate ca
    # "fara cheie de progres" desi o aveau, iar - mai rau - cheile scrise cu ghilimele
    # duble scapau tacut si de verificarea de unicitate de mai jos (05.09.2026).
    chei = set(m.group(2) for m in re.finditer(
        r"(?:AtomicLearning|PracticeSimple|LessonSummary)\.init\(\s*(['\"])(.+?)\1", src))
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
                if (("'" + cheie + "'") in s2 or ('"' + cheie + '"') in s2) and "AtomicLearning.init" in s2:
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
    # Doua straturi de aparare impotriva exemplelor didactice luate drept navigare
    # (o lectie care PREDA HTML e plina de <a href="...">, si niciunul nu e navigare):
    #  - COD.sub scoate blocurile <code>/<pre>
    #  - LEGATURA cere un tag <a> REAL: exemplele scapate (&lt;a href="pagina2.html"&gt;)
    #    n-au niciun "<a" literal inaintea lui href, deci nu se potrivesc.
    # Impreuna: 69 + 12 alarme false eliminate (05.09.2026).
    for h in LEGATURA.findall(COD.sub("", src)):
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
