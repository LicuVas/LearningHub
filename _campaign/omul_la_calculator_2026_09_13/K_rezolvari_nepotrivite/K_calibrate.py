"""K_calibrate.py - calculeaza overlap-ul (aceeasi formula ca in K_scan.py) pentru
10 perechi cerinta<->rezolvare CITITE manual si confirmate CORECTE + cele 3 perechi
CUNOSCUTE ca gresite (cls8 lectia1-interfata), ca sa aleg un prag, nu sa-l inventez.
"""
import re
from pathlib import Path

import sys
sys.path.insert(0, str(Path(__file__).parent))
from K_scan import EX_RE, norm_words  # reuse exact same parsing/normalization

ROOT = Path("C:/00/Projects/LearningHub/content")

GOOD = [
    ("liceu/mat-info/cls9/m1-gandire-comp/lectia1-intro-algoritmi.html", 1),
    ("liceu/mat-info/cls9/m1-gandire-comp/lectia1-intro-algoritmi.html", 2),
    ("liceu/mat-info/cls9/m1-gandire-comp/lectia1-intro-algoritmi.html", 3),
    ("tic/cls5/m1-sisteme/lectia1-calculator.html", 1),
    ("tic/cls5/m1-sisteme/lectia1-calculator.html", 2),
    ("tic/cls5/m1-sisteme/lectia1-calculator.html", 3),
    ("tic/cls6/m1-prezentari/lectia1-powerpoint-intro.html", 1),
    ("tic/cls6/m1-prezentari/lectia1-powerpoint-intro.html", 2),
    ("tic/cls7/m1-word-fundamente/lectia1-interfata-word.html", 1),
    ("tic/cls7/m1-word-fundamente/lectia1-interfata-word.html", 2),
    ("tic/cls7/m1-word-fundamente/lectia1-interfata-word.html", 3),
]

BAD = [
    ("tic/cls8/m1-excel-fundamente/lectia1-interfata.html", 1),
    ("tic/cls8/m1-excel-fundamente/lectia1-interfata.html", 2),
    ("tic/cls8/m1-excel-fundamente/lectia1-interfata.html", 3),
]


def score_all(relpath):
    s = (ROOT / relpath).read_text(encoding="utf-8", errors="ignore")
    exs = []
    for m in EX_RE.finditer(s):
        level, cer_html, rez_html = m.group(1), m.group(2), m.group(3)
        exs.append({"cer": norm_words(cer_html), "rez": norm_words(rez_html)})
    out = []
    for i, e in enumerate(exs):
        n_rez = max(len(e["rez"]), 1)
        inter = e["rez"] & e["cer"]
        overlap = round(100 * len(inter) / n_rez, 1)
        best_other = 0.0
        for j, other in enumerate(exs):
            if j == i:
                continue
            ov = 100 * len(e["rez"] & other["cer"]) / n_rez
            best_other = max(best_other, ov)
        out.append((i + 1, overlap, round(best_other, 1)))
    return out


def main():
    print("=== GOOD (confirmate corecte prin citire) ===")
    good_scores = []
    cache = {}
    for relpath, idx in GOOD:
        if relpath not in cache:
            cache[relpath] = score_all(relpath)
        res = dict((i, (ov, bo)) for i, ov, bo in cache[relpath])
        ov, bo = res[idx]
        good_scores.append(ov)
        print(f"{relpath} ex{idx}: overlap={ov}%  best_other={bo}%")

    print("\n=== BAD (cunoscute gresite, cls8 lectia1-interfata) ===")
    bad_scores = []
    for relpath, idx in BAD:
        if relpath not in cache:
            cache[relpath] = score_all(relpath)
        res = dict((i, (ov, bo)) for i, ov, bo in cache[relpath])
        ov, bo = res[idx]
        bad_scores.append(ov)
        print(f"{relpath} ex{idx}: overlap={ov}%  best_other={bo}%")

    print("\nmin(GOOD) =", min(good_scores), " max(BAD) =", max(bad_scores))


if __name__ == "__main__":
    main()
