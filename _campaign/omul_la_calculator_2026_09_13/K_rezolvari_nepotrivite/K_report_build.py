import csv
import random
from collections import defaultdict
from pathlib import Path

OUT = Path("C:/00/Projects/LearningHub/_campaign/omul_la_calculator_2026_09_13/K_rezolvari_nepotrivite")

rows = list(csv.DictReader(open(OUT / "K_rezultat.csv", encoding="utf-8")))

pages = defaultdict(list)
for r in rows:
    pages[r["file"]].append(r)

total_pairs = len(rows)
total_suspect = sum(1 for r in rows if r["verdict"] == "suspect")
pages_scanned_with_ex = len(pages)
pages_with_suspect = sum(1 for f, rs in pages.items() if any(r["verdict"] == "suspect" for r in rs))

# breakdown by folder
folder_stats = defaultdict(lambda: {"pairs": 0, "suspect": 0, "pages": set(), "pages_suspect": set()})
for r in rows:
    fs = folder_stats[r["folder"]]
    fs["pairs"] += 1
    fs["pages"].add(r["file"])
    if r["verdict"] == "suspect":
        fs["suspect"] += 1
        fs["pages_suspect"].add(r["file"])

print("=== BREAKDOWN PE FOLDER ===")
for folder in sorted(folder_stats):
    fs = folder_stats[folder]
    print(f"{folder:20s} pagini={len(fs['pages']):3d} perechi={fs['pairs']:4d} suspecte={fs['suspect']:3d} pagini_cu_suspect={len(fs['pages_suspect']):3d}")

# M1 lessons
M1 = [
    "content/tic/cls5/m1-sisteme",
    "content/tic/cls6/m1-prezentari",
    "content/tic/cls7/m1-word-fundamente",
    "content/tic/cls8/m1-excel-fundamente",
]
print("\n=== LECTIILE M1 ===")
for prefix in M1:
    matched = {f: rs for f, rs in pages.items() if f.startswith(prefix)}
    for f, rs in sorted(matched.items()):
        verdicts = [r["verdict"] for r in rs]
        n_susp = verdicts.count("suspect")
        print(f"{f}: {len(rs)} exercitii, {n_susp} suspecte -> {['ex%s:%s(%s%%)' % (r['ex_index'], r['verdict'], r['overlap_pct']) for r in rs]}")

# touched by 21b141a among suspects
susp_rows = [r for r in rows if r["verdict"] == "suspect"]
touched = sum(1 for r in susp_rows if r["touched_by_21b141a"] == "True")
not_touched = len(susp_rows) - touched
print(f"\n=== SUSPECTE vs commit 21b141a ===\ntouched={touched}  not_touched={not_touched}  total_suspect={len(susp_rows)}")

# 5 random suspect examples
random.seed(42)
sample = random.sample(susp_rows, min(5, len(susp_rows)))
print("\n=== 5 EXEMPLE SUSPECTE (random, seed=42) ===")
for r in sample:
    print("---")
    print("file:", r["file"], "ex", r["ex_index"], "overlap:", r["overlap_pct"], "best_other:", r["best_match_other_overlap_pct"], "shuffled:", r["shuffled_signal"])
    print("statement:", r["statement_start"])
    print("solution :", r["solution_start"])

print("\ntotal_pairs", total_pairs, "total_suspect", total_suspect)
print("pages_with_exercises", pages_scanned_with_ex, "pages_with_suspect", pages_with_suspect)
