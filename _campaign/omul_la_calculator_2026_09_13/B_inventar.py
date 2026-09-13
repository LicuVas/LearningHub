#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Inventar mecanic pentru Modulul 1 din fiecare clasa gimnaziala TIC (LearningHub).
Citeste fiecare fisier lectie cu HTMLParser (fara librarii externe), extrage:
  - path, title, nr cuvinte text vizibil, nr atomi (class contine "atom"),
    nr itemi de quiz, nr exercitii, are/nu "rezolvare"/model de raspuns.
Scrie B_inventar.csv langa acest script.
"""
import csv
import os
import re
from html.parser import HTMLParser

BASE = r"C:\00\Projects\LearningHub\content\tic"
OUT_CSV = r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\B_inventar.csv"

FILES = [
    (r"cls5\m1-sisteme\lectia1-calculator.html", "cls5"),
    (r"cls5\m1-sisteme\lectia2-hardware.html", "cls5"),
    (r"cls5\m1-sisteme\lectia3-software.html", "cls5"),
    (r"cls5\m1-sisteme\lectia4-ergonomie.html", "cls5"),
    (r"cls5\m1-sisteme\lectia5-reguli.html", "cls5"),
    (r"cls5\m1-sisteme\lectia6-proiect.html", "cls5"),
    (r"cls6\m1-prezentari\lectia1-powerpoint-intro.html", "cls6"),
    (r"cls6\m1-prezentari\lectia2-slide-uri.html", "cls6"),
    (r"cls6\m1-prezentari\lectia3-text-imagini.html", "cls6"),
    (r"cls6\m1-prezentari\lectia4-animatii.html", "cls6"),
    (r"cls6\m1-prezentari\lectia5-tranzitii.html", "cls6"),
    (r"cls6\m1-prezentari\lectia6-proiect.html", "cls6"),
    (r"cls7\m1-word-fundamente\lectia1-interfata-word.html", "cls7"),
    (r"cls7\m1-word-fundamente\lectia2-formatare-text.html", "cls7"),
    (r"cls7\m1-word-fundamente\lectia3-paragrafe.html", "cls7"),
    (r"cls7\m1-word-fundamente\lectia4-liste.html", "cls7"),
    (r"cls7\m1-word-fundamente\lectia5-tabele.html", "cls7"),
    (r"cls7\m1-word-fundamente\lectia6-evaluare.html", "cls7"),
    (r"cls8\m1-excel-fundamente\lectia1-interfata.html", "cls8"),
    (r"cls8\m1-excel-fundamente\lectia2-date.html", "cls8"),
    (r"cls8\m1-excel-fundamente\lectia3-formule.html", "cls8"),
    (r"cls8\m1-excel-fundamente\lectia4-functii.html", "cls8"),
    (r"cls8\m1-excel-fundamente\lectia5-grafice.html", "cls8"),
    (r"cls8\m1-excel-fundamente\lectia6-proiect.html", "cls8"),
    (r"cls8\m1-excel-fundamente\lectia7-sortare.html", "cls8"),
]


class LessonParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_skip = 0  # script/style depth
        self.in_title = False
        self.title = ""
        self.text_parts = []
        self.atom_count = 0
        self.quiz_count = 0
        self.exercise_count = 0
        self.has_rezolvare = False
        self._class_stack = []

    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        cls = attrs_d.get("class", "") or ""
        id_ = attrs_d.get("id", "") or ""
        cls_l = cls.lower()
        id_l = id_.lower()

        if tag in ("script", "style"):
            self.in_skip += 1
        if tag == "title":
            self.in_title = True

        if "atom" in cls_l:
            self.atom_count += 1
        if "data-quiz" in attrs_d:
            # data-quiz holds a JSON array of {"question": ...} objects; count the questions inside.
            dq = attrs_d.get("data-quiz") or ""
            n = len(re.findall(r'"question"\s*:', dq))
            self.quiz_count += n if n else 1
        cls_tokens = cls_l.split()
        if "practice-exercise" in cls_tokens or "exercitiu" in cls_tokens:
            self.exercise_count += 1
        if "rezolvare" in cls_l or "rezolvare" in id_l or "model-raspuns" in cls_l or "solutie" in cls_l:
            self.has_rezolvare = True

    def handle_endtag(self, tag):
        if tag in ("script", "style") and self.in_skip > 0:
            self.in_skip -= 1
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_skip == 0:
            self.text_parts.append(data)


def analyze(path):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        raw = f.read()

    # Also grep raw text for "rezolvare"/"model" keywords in visible-ish text, as a fallback signal.
    raw_lower = raw.lower()

    p = LessonParser()
    p.feed(raw)
    p.close()

    text = " ".join(p.text_parts)
    text = re.sub(r"\s+", " ", text).strip()
    words = [w for w in re.split(r"\s+", text) if w]
    word_count = len(words)

    # Fallback keyword scan on raw HTML for rezolvare-like model answers (case some are in data attrs / JS strings)
    kw_rezolvare = bool(re.search(r"rezolvare|model[\s-]*de[\s-]*r[aă]spuns|r[aă]spuns[\s-]*corect|solu[țt]ie[\s-]*model", raw_lower))

    return {
        "title": p.title.strip(),
        "words": word_count,
        "atoms": p.atom_count,
        "quiz_items": p.quiz_count,
        "exercises": p.exercise_count,
        "has_rezolvare": p.has_rezolvare or kw_rezolvare,
    }


def main():
    rows = []
    for rel, grade in FILES:
        full = os.path.join(BASE, rel)
        if not os.path.isfile(full):
            rows.append({
                "grade": grade, "path": full, "title": "LIPSA", "words": 0,
                "atoms": 0, "quiz_items": 0, "exercises": 0, "has_rezolvare": False,
                "error": "FISIER LIPSA",
            })
            continue
        try:
            r = analyze(full)
            r["grade"] = grade
            r["path"] = full
            r["error"] = ""
            rows.append(r)
        except Exception as e:
            rows.append({
                "grade": grade, "path": full, "title": "EROARE", "words": 0,
                "atoms": 0, "quiz_items": 0, "exercises": 0, "has_rezolvare": False,
                "error": str(e),
            })

    with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=[
            "grade", "path", "title", "words", "atoms", "quiz_items",
            "exercises", "has_rezolvare", "error",
        ])
        w.writeheader()
        for r in rows:
            w.writerow(r)

    print(f"Scris {len(rows)} randuri in {OUT_CSV}")
    for r in rows:
        print(f"{r['grade']:5} {os.path.basename(r['path']):35} words={r['words']:5} atoms={r['atoms']:3} "
              f"quiz={r['quiz_items']:2} exerc={r['exercises']:2} rezolvare={r['has_rezolvare']} {r['error']}")


if __name__ == "__main__":
    main()
