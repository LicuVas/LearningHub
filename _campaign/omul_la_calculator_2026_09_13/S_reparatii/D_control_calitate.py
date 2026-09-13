"""Control de calitate al diacriticelor (dupa val): ce NU prinde poarta octet-cu-octet.

python D_control_calitate.py            -> raport pe cele 25 de lectii M1

1. Cuvinte romanesti ramase FARA diacritice in textul vizibil (si, sa, daca, fara, pana, inca, asa, dupa...):
   aproape mereu gresite in romana; exceptii reale se vad in context.
2. Pentru fiecare cuvant ascii care a primit forme diferite (ex. 'ca' -> 'ca'/'că'), numarul fiecarei forme
   pe lectie - ca un om sa citeasca exemplele la cele suspecte.
3. Exemple de context pentru fiecare suspiciune (max 3).
"""
import collections
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path

SITE = Path(r"C:\00\Projects\LearningHub")
OUT = Path(__file__).resolve().parent / "D_control_calitate.md"
MOD = {"cls5": "m1-sisteme", "cls6": "m1-prezentari", "cls7": "m1-word-fundamente", "cls8": "m1-excel-fundamente"}
TR = str.maketrans("ăâîșțşţĂÂÎȘȚŞŢ", "aaistSTAAISTST")
# cuvinte care in romana au (aproape) mereu diacritice; forma ascii e suspecta in text vizibil
SUSPECTE = {"si", "sa", "daca", "fara", "pana", "inca", "asa", "dupa", "cand", "cat", "mai", "tau", "ta", "sunt",
            "poti", "esti", "trebuie", "invata", "intrebare", "raspuns", "raspunsul", "urmatorul", "inainte",
            "apasa", "scrie", "salveaza", "foloseste", "lectia", "lectiei", "atentie", "incearca", "intai", "insa",
            "exista", "aceeasi", "acelasi", "fiecare", "doua", "celula", "tasta", "fereastra", "pagina"}
BENIGNE_ASCII = {"mai", "trebuie", "scrie", "fiecare", "sunt", "tau"}  # corecte si fara diacritice; nu se raporteaza


class Vizibil(HTMLParser):
    SKIP = {"script", "style", "title", "code", "pre", "kbd"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self.depth += 1
        for k, v in attrs:
            if k in ("data-quiz", "alt", "title", "aria-label") and v and not self.depth:
                self.parts.append(v)

    def handle_endtag(self, tag):
        if tag in self.SKIP and self.depth:
            self.depth -= 1

    def handle_data(self, data):
        if not self.depth:
            self.parts.append(data)


def text(src):
    p = Vizibil()
    p.feed(src)
    return re.sub(r"\s+", " ", " ".join(p.parts))


rep = ["# Controlul calității diacriticelor (M1, 25 de lecții)\n"]
forme_global = collections.defaultdict(collections.Counter)
for cls, mod in MOD.items():
    for f in sorted((SITE / "content" / "tic" / cls / mod).glob("lectia*.html")):
        t = text(f.read_text(encoding="utf-8"))
        cuv = re.findall(r"[A-Za-zăâîșțşţĂÂÎȘȚŞŢ]+", t)
        for w in cuv:
            forme_global[w.lower().translate(TR)][w.lower()] += 1
        ramase = collections.Counter(w.lower() for w in cuv if w.lower() in SUSPECTE - BENIGNE_ASCII)
        if ramase:
            rep.append(f"\n## {cls}/{f.stem} — ascii rămase: " + ", ".join(f"{k}×{v}" for k, v in ramase.most_common()))
            for k in list(ramase)[:6]:
                for m in list(re.finditer(rf"(?i)(?<![\wăâîșț]){k}(?![\wăâîșț])", t))[:2]:
                    rep.append(f"- `{k}`: …{t[max(0, m.start()-50):m.end()+50]}…")

rep.append("\n# Cuvinte cu forme amestecate în tot modulul (ascii și cu diacritice)\n")
for base, c in sorted(forme_global.items(), key=lambda x: -sum(x[1].values())):
    if len(c) > 1 and base in c and sum(c.values()) >= 3 and base not in {"ca", "sa", "a", "in", "si"} | BENIGNE_ASCII:
        rep.append(f"- {base}: " + ", ".join(f"{k}×{v}" for k, v in c.most_common()))
OUT.write_text("\n".join(rep), encoding="utf-8")
print(f"scris {OUT} ({len(rep)} randuri)")
