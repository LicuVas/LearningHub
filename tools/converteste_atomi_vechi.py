# -*- coding: utf-8 -*-
"""Aduce lectiile din formatul VECHI de atomi in formatul pe care motorul il citeste.

    python tools/converteste_atomi_vechi.py            -> arata ce ar schimba
    python tools/converteste_atomi_vechi.py --aplica   -> scrie

PROBLEMA (gasita 05.09.2026). Cateva lectii sunt scrise asa:

    <div class="atom-card" data-atom="1">
      ...
      <div class="atom-quiz" data-qid="atom-1-q0">
        <div class="atom-question-text">Ce este o baza de date?</div>
        <div class="atom-options">
          <div class="atom-option">Un program de desenat</div>
          ...
        </div>
        <div class="atom-quiz-data" style="display:none;">{"correct": "b"}</div>
      </div>
    </div>

Motorul (assets/js/atomic-learning.js) cauta insa `document.querySelectorAll('.atom')`
si citeste raspunsurile din atributul `data-quiz`. Nimic din tot JS-ul sitului nu
cunoaste `atom-card` sau `atom-quiz-data`. Deci: AtomicLearning.init() porneste,
gaseste ZERO atomi, si variantele de raspuns raman inerte pe ecran - elevul da clic
si nu se intampla nimic, nu primeste raspuns si nu i se inregistreaza nimic.
E acelasi esec TACUT care a costat 417 pagini, in alta deghizare.

CE FACE CONVERSIA, exact:
  class="atom-card" -> class="atom", plus id="atom-N" (motorul si poarta cer un
  identificator), plus atributul data-quiz construit din ce era deja in pagina:
  intrebarea, variantele in ORDINEA lor si litera corecta. Nimic nu se inventeaza -
  daca un bloc n-are toate cele trei, se SARE peste el si se raporteaza.

Indiciile lipsesc din formatul vechi si NU le inventez: motorul are text de rezerva.
Raman de scris intr-o trecere de continut, separata.
"""
import os, io, re, sys, json, html as _html

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIV = re.compile(r"<div\b[^>]*>|</div>", re.I)
CARD = re.compile(r'<div class="atom-card"([^>]*)>', re.I)
QUIZ = re.compile(r'<div class="atom-quiz"[^>]*>', re.I)
INTREBARE = re.compile(r'<div class="atom-question-text"[^>]*>(.*?)</div>', re.I | re.S)
OPTIUNE = re.compile(r'<div class="atom-option"[^>]*>(.*?)</div>', re.I | re.S)
DATE = re.compile(r'<div class="atom-quiz-data"[^>]*>(.*?)</div>', re.I | re.S)
NR = re.compile(r'data-atom="([^"]+)"', re.I)


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


def text(s):
    return re.sub(r"\s+", " ", _html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def converteste(src):
    """(src_nou, convertiti, sarite) - sarite = [(nr_atom, motiv)]"""
    if 'class="atom-card"' not in src:
        return src, 0, []
    out, last, n, sarite = [], 0, 0, []
    for m in CARD.finditer(src):
        e = inchidere(src, m.end())
        if e < 0:
            sarite.append(("?", "nu gasesc unde se inchide atom-card"))
            continue
        atribute = m.group(1)
        corp = src[m.end():e]
        nr = NR.search(atribute)
        nr = nr.group(1) if nr else str(n)

        q = QUIZ.search(corp)
        if not q:
            # atom fara chestionar: doar redenumesc clasa, motorul il trece ca atom de continut
            out.append(src[last:m.start()])
            out.append('<div class="atom"%s id="atom-%s">' % (atribute, nr))
            last = m.end()
            n += 1
            continue
        qe = inchidere(corp, q.end())
        if qe < 0:
            sarite.append((nr, "nu gasesc unde se inchide atom-quiz"))
            continue
        blocq = corp[q.end():qe]

        mi = INTREBARE.search(blocq)
        optiuni = [text(o) for o in OPTIUNE.findall(blocq)]
        md = DATE.search(blocq)
        if not (mi and optiuni and md):
            sarite.append((nr, "lipseste intrebarea, variantele sau litera corecta"))
            continue
        try:
            corect = (json.loads(md.group(1).strip()) or {}).get("correct", "")
        except Exception as ex:
            sarite.append((nr, "atom-quiz-data nu se parseaza: %s" % str(ex)[:40]))
            continue
        corect = str(corect).strip().lower()
        if len(corect) != 1 or not ("a" <= corect <= "z") or ord(corect) - 97 >= len(optiuni):
            sarite.append((nr, "litera corecta %r nu se potriveste cu cele %d variante" % (corect, len(optiuni))))
            continue

        date = [{"question": text(mi.group(1)), "options": optiuni, "correct": corect}]
        atr = _html.escape(json.dumps(date, ensure_ascii=False), quote=True)

        out.append(src[last:m.start()])
        out.append('<div class="atom"%s id="atom-%s" data-quiz="%s">' % (atribute, nr, atr))
        # corpul ramane la fel, doar containerul de chestionar se goleste:
        # motorul isi scrie singur intrebarea si variantele acolo (innerHTML).
        out.append(corp[:q.start()])
        out.append('<div class="atom-quiz"></div>')
        out.append(corp[qe + len("</div>"):] if corp[qe:qe + 6].lower() == "</div>" else corp[qe:])
        last = e
        n += 1
    out.append(src[last:])
    return "".join(out), n, sarite


if __name__ == "__main__":
    aplica = "--aplica" in sys.argv
    fisiere, total, toate_sarite = 0, 0, []
    for dp, _, fns in os.walk(os.path.join(R, "content")):
        if ".backup" in dp.lower():
            continue
        for f in sorted(fns):
            if not f.endswith(".html"):
                continue
            p = os.path.join(dp, f)
            src = io.open(p, encoding="utf-8", errors="replace").read()
            nou, n, sar = converteste(src)
            if not n and not sar:
                continue
            rel = os.path.relpath(p, R).replace(os.sep, "/")
            fisiere += 1
            total += n
            for nr, motiv in sar:
                toate_sarite.append((rel, nr, motiv))
            print("  %-70s %d atomi" % (rel[-70:], n))
            if aplica and nou != src:
                io.open(p, "w", encoding="utf-8", newline="").write(nou)
    print()
    for rel, nr, motiv in toate_sarite:
        print("  SARIT %s (atom %s): %s" % (rel, nr, motiv))
    print(("SCRIS: %d fisiere, %d atomi" % (fisiere, total)) if aplica else
          ("s-ar schimba: %d fisiere, %d atomi\nruleaza cu --aplica ca sa scrie" % (fisiere, total)))
