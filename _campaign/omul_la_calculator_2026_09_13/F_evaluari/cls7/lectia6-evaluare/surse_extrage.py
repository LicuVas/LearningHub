"""Extrage citatele din TEXTUL BRUT (surse/raw/*.txt) in surse/sNN_*.txt, cu adresa si numarul randului.
Plus dovada comportamentului motorului de grile (atomic-learning.js). Tipareste <= 20 de randuri."""
from pathlib import Path

L = Path(__file__).resolve().parent
R = L / "surse" / "raw"
S = L / "surse"
JS = Path(r"C:\00\Projects\LearningHub\assets\js\atomic-learning.js")

CAUT = {
    "s01_inserare_imagine": [("insert_pictures_en-us.txt", "Insert > Pictures > This Device"), ("insert_pictures_ro-ro.txt", "acest dispozitiv"),
                             ("insert_pictures_en-us.txt", "Online Pictures"), ("insert_pictures_ro-ro.txt", "imagini online")],
    "s02_incadrare_text": [("wrap_text_en-us.txt", "Wrap Text > Square"), ("wrap_text_ro-ro.txt", "Încadrare text > pătrat"),
                           ("wrap_text_en-us.txt", "In Line with Text puts"), ("wrap_text_ro-ro.txt", "În linie cu textul plasează"),
                           ("wrap_text_ro-ro.txt", "Format imagine")],
    "s03_trunchiere": [("crop_en-us.txt", "Crop a picture in Office"), ("crop_ro-ro.txt", "Trunchiere"), ("crop_en-us.txt", "Picture Format")],
    "s04_bara_acces_rapid": [("qat_move_en-us.txt", "(default location)"), ("qat_move_ro-ro.txt", "(locația implicită)"),
                             ("qat_customize_ro-ro.txt", "Ascundere bară de instrumente Acces rapid"),
                             ("undo_redo_ro-ro.txt", "selectați Anulare pe Bara de instrumente Acces rapid"),
                             ("undo_redo_en-us.txt", "select Undo on the Quick Access Toolbar")],
    "s05_scurtaturi": [("shortcuts_ro-ro.txt", "Selectați tot conținutul documentului"), ("shortcuts_en-us.txt", "Select all document content"),
                       ("shortcuts_ro-ro.txt", "Eliminarea formatării manuale a caracterelor"),
                       ("shortcuts_ro-ro.txt", "spațierea la un rând și jumătate"), ("shortcuts_ro-ro.txt", "Refaceți acțiunea anterioară"),
                       ("shortcuts_en-us.txt", "Select the whole table")],
}


def adresa(fis):
    t = (R / fis).read_text(encoding="utf-8", errors="replace").splitlines()
    return t[0].replace("ADRESA: ", "") if t and t[0].startswith("ADRESA") else "(adresa: vezi lectia2-formatare-text/surse/raw, pagina keyboard-shortcuts-in-word-95ef89dd)"


for nume, lista in CAUT.items():
    rows = [f"Citate copiate din textul brut (curl, 13.09.2026). Fisierele brute: surse/raw/."]
    for fis, fraza in lista:
        lines = (R / fis).read_text(encoding="utf-8", errors="replace").splitlines()
        hits = [(i + 1, x.strip()) for i, x in enumerate(lines) if fraza.lower() in x.lower()][:2]
        rows.append(f"ADRESA: {adresa(fis)}")
        if not hits:
            rows.append(f"  [{fis}] NEGASIT: {fraza}")
        for n, x in hits:
            nxt = lines[n].strip() if n < len(lines) else ""
            rows.append(f"  [{fis} r.{n}] {x[:300]}" + (f"  || urmatorul rand: {nxt[:60]}" if len(x) < 70 else ""))
    (S / f"{nume}.txt").write_text("\n".join(rows) + "\n", encoding="utf-8")
    print(nume, sum(1 for r in rows if "NEGASIT" in r), "negasite")

# shortcuts: adresa canonica
for n in ("s05_scurtaturi",):
    f = S / f"{n}.txt"
    f.write_text(f.read_text(encoding="utf-8").replace(
        "(adresa: vezi lectia2-formatare-text/surse/raw, pagina keyboard-shortcuts-in-word-95ef89dd)",
        "https://support.microsoft.com/{ro-ro|en-us}/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2"), encoding="utf-8")

js = JS.read_text(encoding="utf-8").splitlines()
out = ["Motorul grilelor: C:/00/Projects/LearningHub/assets/js/atomic-learning.js (citit 13.09.2026)"]
for i, x in enumerate(js):
    if any(k in x for k in ("requireCorrectToProgress:", "Wrong answer - show correct answer", "Save progress to localStorage", "score: null", "even wrong answers count")):
        out.append(f"  r.{i+1}: {x.strip()}")
(S / "s06_motor_grile.txt").write_text("\n".join(out) + "\n", encoding="utf-8")
print("s06_motor_grile", len(out) - 1, "randuri")
