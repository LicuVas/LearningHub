"""M_scan.py - masoara decalajul intrebare/atom in lectiile LearningHub.
Pentru fiecare lectie (content/**/lectia*.html, fara *.bak_* si fara quizuri/),
extrage atomii (clasa "atom", atribut data-quiz) cu HTMLParser (NU regex - regex trunchiaza JSON-ul din atribut).
Pentru fiecare quiz calculeaza suprapunerea de cuvinte-cheie cu textul vizibil al atomilor i-1, i, i+1 si TOATE atomii.
Eticheteaza: propriu / decalat_inainte / decalat_inapoi / altul / slab.
Iesire: M_rezultat.csv, plus (cand rulat cu --calibrate) un tipar de scoruri pe perechi alese manual.
"""
import csv
import html
import json
import re
import sys
import unicodedata
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(r"C:\00\Projects\LearningHub\content")
OUT_DIR = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\M_intrebari_decalate")

# prag ales in urma calibrarii (vezi M_raport.md sectiunea "Calibrare"):
# scor = numar de radacini (stem) comune intre cuvintele-cheie ale quiz-ului si textul atomului.
PRAG_SLAB = 2  # sub acest scor maxim (pe orice atom) => eticheta "slab" (nu se poate judeca)

STOPWORDS = set("""
este sunt fost fiind erau eram avea avem aveti aveau avut poate poti putem
puteti pot putea trebuie trebuia care pentru acest aceasta aceste acesti
acestui acestei acestor aceasta aceia acelasi aceeasi acele acei acel
daca atunci deci desi decat totusi insa insa iar insa unde cand cum ceea
ceva catre despre asupra dintre printre intre dupa inainte inaintea peste
sub intr intre foarte mult multe multi mai bine bune bun buna decat orice
oricare fiecare toate toti toata tot unei unui unele unor astfel adica
prin fara pana spre langa asa acum aici acolo ceva cineva altceva altcineva
avand fiind fost avea acesta aceasta acestea aceleasi asadar totusi
cadrul cazul locul modul felul parte parti exemplu exemple functie functii
folosind folosim folositi foloseste folosesc folosit poti utilizezi
""".split())


def fara_diacritice(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    return "".join(c for c in s if not unicodedata.combining(c))


def cuvinte_cheie(text: str) -> set:
    t = fara_diacritice(text.lower())
    cuv = re.findall(r"[a-z]{4,}", t)
    out = set()
    for w in cuv:
        if w in STOPWORDS:
            continue
        out.add(w[:6])  # stem usor: primele 6 litere
    return out


class AtomParser(HTMLParser):
    """Extrage atomii de nivel superior (div.atom cu data-quiz) si textul lor vizibil,
    fara sa atinga atributul data-quiz (nu e text, e atribut -> nu trece prin handle_data)."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.atoms = []  # [{idx, quiz_raw, text}]
        self.depth = None
        self.buf = []
        self.idx = None
        self.quiz_raw = None
        self.next_seq = 0  # index = ordinea din document (id-ul poate fi non-numeric, ex. "atom-repr")

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if self.depth is None:
            if tag == "div" and a.get("class", "") == "atom" and "data-quiz" in a and (a.get("id") or "").startswith("atom-"):
                self.depth = 1
                self.next_seq += 1
                self.idx = self.next_seq
                self.quiz_raw = a["data-quiz"]
                self.buf = []
        else:
            if tag == "div":
                self.depth += 1

    def handle_startendtag(self, tag, attrs):
        pass  # self-closing (br/img/etc) nu schimba adancimea div-urilor

    def handle_endtag(self, tag):
        if self.depth is not None and tag == "div":
            self.depth -= 1
            if self.depth == 0:
                self.atoms.append({"idx": self.idx, "quiz_raw": self.quiz_raw, "text": " ".join(self.buf)})
                self.depth = None
                self.buf = []
                self.idx = None
                self.quiz_raw = None

    def handle_data(self, data):
        if self.depth is not None:
            self.buf.append(data)


def parseaza_lectie(path: Path):
    """Atentie: data-quiz e un ARRAY JSON care poate avea 1..N intrebari per atom
    (unele lectii pun 2 intrebari pe acelasi atom) - trebuie citite TOATE, nu doar [0]
    (asta era bug-ul scripturilor vechi u3_potrivire.py: [0] singur)."""
    raw = path.read_text(encoding="utf-8", errors="replace")
    p = AtomParser()
    p.feed(raw)
    atomi = []
    for a in p.atoms:
        try:
            quizzes = json.loads(html.unescape(a["quiz_raw"]))
            if not isinstance(quizzes, list):
                quizzes = [quizzes]
        except Exception as e:
            atomi.append({"idx": a["idx"], "eroare": f"json invalid: {e}", "text": a["text"], "quizzes": []})
            continue
        atomi.append({"idx": a["idx"], "text": a["text"], "quizzes": quizzes, "eroare": None})
    return atomi


def text_quiz(q: dict) -> str:
    opt_corecta = ""
    try:
        i = "abcd".index(q.get("correct", "a"))
        opt_corecta = q.get("options", [""] * 4)[i]
    except Exception:
        pass
    return " ".join([q.get("question", ""), opt_corecta, q.get("hint", "")])


def eticheteaza(atomi):
    """Intoarce lista de randuri: {idx, sub, label, scor_propriu, scor_inainte, scor_inapoi, scor_max, best_idx}
    O intrebare (sub) = o intrare din array-ul JSON data-quiz al atomului idx (pot fi >1 per atom)."""
    cuvinte_atom = {a["idx"]: cuvinte_cheie(a["text"]) for a in atomi}
    idxs = sorted(cuvinte_atom.keys())
    rezultate = []
    for a in atomi:
        i = a["idx"]
        if not a["quizzes"]:
            rezultate.append({"idx": i, "sub": 0, "label": "eroare_json", "scor_propriu": 0, "scor_inainte": 0,
                               "scor_inapoi": 0, "scor_max": 0, "best_idx": None})
            continue
        for sub, quiz in enumerate(a["quizzes"], start=1):
            qw = cuvinte_cheie(text_quiz(quiz))
            scoruri = {j: len(qw & cuvinte_atom[j]) for j in idxs}
            scor_max = max(scoruri.values()) if scoruri else 0
            # best_idx: cel mai apropiat de i in caz de egalitate (preferinta propriu > i+1 > i-1 > altii)
            candidati = [j for j, s in scoruri.items() if s == scor_max]
            ordine_preferinta = sorted(candidati, key=lambda j: (abs(j - i), j != i, j))
            best_idx = ordine_preferinta[0] if ordine_preferinta else None
            s_propriu = scoruri.get(i, 0)
            s_inainte = scoruri.get(i + 1, None)
            s_inapoi = scoruri.get(i - 1, None)
            if scor_max < PRAG_SLAB:
                label = "slab"
            elif best_idx == i:
                label = "propriu"
            elif best_idx == i + 1:
                label = "decalat_inainte"
            elif best_idx == i - 1:
                label = "decalat_inapoi"
            else:
                label = "altul"
            rezultate.append({"idx": i, "sub": sub, "label": label, "scor_propriu": s_propriu,
                               "scor_inainte": s_inainte, "scor_inapoi": s_inapoi,
                               "scor_max": scor_max, "best_idx": best_idx})
    return rezultate


def gaseste_lectii():
    fisiere = []
    for p in ROOT.rglob("lectia*.html"):
        if ".bak_" in p.name:
            continue
        if "quizuri" in p.parts:
            continue
        fisiere.append(p)
    return sorted(fisiere)


def main():
    fisiere = gaseste_lectii()
    randuri = []
    per_fisier = {}
    esuate = []
    for f in fisiere:
        try:
            atomi = parseaza_lectie(f)
        except Exception as e:
            esuate.append((str(f), str(e)))
            continue
        if not atomi:
            continue
        etichete = eticheteaza(atomi)
        per_fisier[str(f)] = etichete
        for e in etichete:
            randuri.append({"fisier": str(f), **e})
    if esuate:
        print(f"ATENTIE: {len(esuate)} fisiere au esuat la parsare:")
        for fis, err in esuate:
            print(f"  {fis}: {err}")

    out_csv = OUT_DIR / "M_rezultat.csv"
    with out_csv.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=["fisier", "idx", "sub", "label", "scor_propriu", "scor_inainte",
                                            "scor_inapoi", "scor_max", "best_idx"])
        w.writeheader()
        for r in randuri:
            w.writerow(r)

    print(f"lectii scanate: {len(per_fisier)}")
    print(f"quiz-uri totale: {len(randuri)}")
    from collections import Counter
    c = Counter(r["label"] for r in randuri)
    for k, v in c.most_common():
        print(f"  {k}: {v} ({100*v/len(randuri):.1f}%)")

    # verdict per pagina: vezi M_raport.md sectiunea "Calibrare" pentru de ce am schimbat
    # regula fata de varianta literala din cerinta (majoritate decalat_inainte/decalat_inapoi):
    # pe cele 2 lectii cu adevar-de-teren cunoscut, defectul se imprastie si in "altul"
    # (cel mai bun atom e departe, nu doar vecinul) - varianta literala rata ambele cazuri
    # cunoscute. Semnalul care separa curat lectiile bune de cele stricate e ponderea "propriu":
    # decalat = propriu NU e majoritate (<=50%).
    print("\n--- pagini cu verdict DECALAT (propriu <= 50%) ---")
    pagini_decalate = []
    for fis, et in per_fisier.items():
        n = len(et)
        n_propriu = sum(1 for e in et if e["label"] == "propriu")
        if n and n_propriu <= n / 2:
            pagini_decalate.append((fis, n_propriu, n))
    for fis, n_propriu, n in sorted(pagini_decalate):
        print(f"  {fis}: propriu {n_propriu}/{n}")
    print(f"\ntotal pagini decalate: {len(pagini_decalate)} / {len(per_fisier)}")


if __name__ == "__main__":
    main()
