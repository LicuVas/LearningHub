"""K_scan.py - scaneaza TOATE lectiile din content/ pentru perechi cerinta<->rezolvare
unde rezolvarea nu se potriveste cu cerinta (shuffle / copy-paste gresit).

Read-only pe site; scrie doar in acest folder (K_rezultat.csv, K_raport.md).
"""
import csv
import glob
import html
import re
import subprocess
from pathlib import Path

ROOT = Path("C:/00/Projects/LearningHub")
CONTENT = ROOT / "content"
OUT = ROOT / "_campaign/omul_la_calculator_2026_09_13/K_rezolvari_nepotrivite"

DIACRITICE = str.maketrans({
    "ă": "a", "â": "a", "î": "i", "ș": "s", "ş": "s", "ț": "t", "ţ": "t",
    "Ă": "a", "Â": "a", "Î": "i", "Ș": "s", "Ş": "s", "Ț": "t", "Ţ": "t",
})

STOPWORDS = set("""
este sunt fost fiind fiti fie erau era fusese suntem sunteti avea aveau
avem aveti trebuie poate puteti putem pute vei veti vom voi
care acest aceasta aceste acestor acestea acesta aceluia acelei acelui
acelasi aceeasi aceiasi altfel altceva alte alta altul alti altele
atunci daca dupa cand unde catre asupra asadar apoi iar insa deci doar
fiecare toate toata totul totusi totodata atat atata atatea atati
despre intre prin dintre peste langa pana fara catre cum cine ceva
cineva nimeni nimic niciun niciuna vreun vreo unui unei unor unele
unul una acei acele acelui acelei celor acel acele lui sale sai
noastre nostri nostru noastra vostru voastra vostri voastre meu mea
mei mele tau tale tai dumneavoastra dumnealui dumneaei oricare
oricine orice oricum oricand undeva pentru despre foarte mult multe
multi foarte destul aceasi acesti aceleasi
""".split())


def norm_words(raw_html: str) -> set:
    """html -> text -> cuvinte de continut (fara diacritice, lowercase, >=4 litere, fara stopwords)."""
    text = re.sub(r"<[^>]+>", " ", raw_html)
    text = html.unescape(text)
    text = text.translate(DIACRITICE).lower()
    words = re.findall(r"[a-z]{4,}", text)
    return set(w for w in words if w not in STOPWORDS)


# Prag calibrat in K_calibrate.py pe 11 perechi CORECTE (citite manual) + 3 perechi
# GRESITE cunoscute (cls8 lectia1-interfata): min(overlap la GOOD)=8.3% , max(overlap la BAD)=6.7%.
# Prag ales in golul dintre ele: overlap < 8% => suspect (plus semnalul de shuffle, care a prins
# toate cele 3 perechi gresite si nicio pereche buna in calibrare).
THRESHOLD_OVERLAP = 8.0

EX_RE = re.compile(
    r'<div class="practice-exercise" data-level="(\w+)">(.*?)'
    r'<details class="practice-solution">.*?'
    r'<div class="practice-solution-body">(.*?)</div>\s*</details>',
    re.S,
)


def find_lesson_files():
    files = []
    for f in glob.glob(str(CONTENT / "**" / "*.html"), recursive=True):
        if ".bak_" in f:
            continue
        if re.search(r"[\\/]quizuri[\\/]", f):
            continue
        files.append(f)
    return sorted(files)


def rel(f):
    return str(Path(f).relative_to(ROOT)).replace("\\", "/")


def folder_bucket(relpath: str) -> str:
    # content/tic/cls8/... -> tic/cls8 ; content/liceu/mat-info/cls9/... -> liceu/mat-info
    parts = relpath.split("/")
    # parts[0] == 'content'
    if len(parts) < 3:
        return parts[1] if len(parts) > 1 else "?"
    if parts[1] == "tic":
        return f"tic/{parts[2]}"
    if parts[1] in ("liceu", "profesional"):
        return f"{parts[1]}/{parts[2]}" if len(parts) > 2 else parts[1]
    return parts[1]


def load_touched(commit_names_file: Path) -> set:
    names = set()
    for line in commit_names_file.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if line:
            names.add(line.replace("\\", "/"))
    return names


def main():
    files = find_lesson_files()
    touched_21b = load_touched(OUT / "names_21b141a.txt") if (OUT / "names_21b141a.txt").exists() else set()

    rows = []
    pages_scanned = 0
    pages_with_exercises = 0
    pages_with_suspect = 0
    total_pairs = 0
    total_suspect = 0

    for f in files:
        pages_scanned += 1
        s = Path(f).read_text(encoding="utf-8", errors="ignore")
        matches = list(EX_RE.finditer(s))
        if not matches:
            continue
        pages_with_exercises += 1
        relpath = rel(f)
        touched = relpath in touched_21b

        exs = []
        for m in matches:
            level, cer_html, rez_html = m.group(1), m.group(2), m.group(3)
            cer_words = norm_words(cer_html)
            rez_words = norm_words(rez_html)
            exs.append({"level": level, "cer_words": cer_words, "rez_words": rez_words,
                        "cer_html": cer_html, "rez_html": rez_html})

        page_has_suspect = False
        for i, e in enumerate(exs):
            rez_words = e["rez_words"]
            cer_words = e["cer_words"]
            n_rez = max(len(rez_words), 1)
            n_cer = max(len(cer_words), 1)
            own_inter = rez_words & cer_words
            overlap = round(100 * len(own_inter) / n_rez, 1)
            overlap_rev = round(100 * len(own_inter) / n_cer, 1)

            best_other_idx = -1
            best_other_overlap = -1.0
            for j, other in enumerate(exs):
                if j == i:
                    continue
                inter = rez_words & other["cer_words"]
                ov = 100 * len(inter) / n_rez
                if ov > best_other_overlap:
                    best_other_overlap = ov
                    best_other_idx = j
            best_other_overlap = round(best_other_overlap, 1) if best_other_idx >= 0 else 0.0

            shuffled = best_other_overlap > overlap and len(exs) > 1
            suspect = overlap < THRESHOLD_OVERLAP or shuffled
            if suspect:
                total_suspect += 1
                page_has_suspect = True
            total_pairs += 1

            rows.append({
                "file": relpath,
                "ex_index": i + 1,
                "level": e["level"],
                "overlap_pct": overlap,
                "overlap_reverse_pct": overlap_rev,
                "best_match_other_idx": best_other_idx + 1 if best_other_idx >= 0 else "",
                "best_match_other_overlap_pct": best_other_overlap,
                "shuffled_signal": shuffled,
                "verdict": "suspect" if suspect else "ok",
                "touched_by_21b141a": touched,
                "folder": folder_bucket(relpath),
                "statement_start": re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", e["cer_html"]))).strip()[:120],
                "solution_start": re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", e["rez_html"]))).strip()[:120],
            })
        if page_has_suspect:
            pages_with_suspect += 1

    # CSV
    csv_path = OUT / "K_rezultat.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        for r in rows:
            w.writerow(r)

    print("pages_scanned", pages_scanned)
    print("pages_with_exercises", pages_with_exercises)
    print("pages_with_suspect", pages_with_suspect)
    print("total_pairs", total_pairs)
    print("total_suspect", total_suspect)
    return rows


if __name__ == "__main__":
    main()
