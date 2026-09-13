"""Aplica corecturile gasite de verificator (doar diacritice), fiecare pe linia ei, cu o singura aparitie."""
from pathlib import Path

T = Path(r"C:\00\Projects\LearningHub\content\tic")
FIX = [
    ("cls8/m1-excel-fundamente/lectia7-sortare.html", 119, "pentru a mută", "pentru a muta"),
    ("cls8/m1-excel-fundamente/lectia7-sortare.html", 251, "pentru a aplică", "pentru a aplica"),
    ("cls8/m1-excel-fundamente/lectia7-sortare.html", 195, "a două oară", "a doua oară"),
    ("cls8/m1-excel-fundamente/lectia7-sortare.html", 108, "o singură coloana", "o singură coloană"),
    ("cls8/m1-excel-fundamente/lectia7-sortare.html", 158, "Această coloana", "Această coloană"),
    ("cls8/m1-excel-fundamente/lectia7-sortare.html", 226, "o selectie", "o selecție"),
    ("cls5/m1-sisteme/lectia1-calculator.html", 133, "citesti", "citești"),
    ("cls5/m1-sisteme/lectia1-calculator.html", 147, "(optional)", "(opțional)"),
]
for rel, ln, old, new in FIX:
    p = T / rel
    raw = p.read_bytes().decode("utf-8")
    lines = raw.split("\n")
    n = lines[ln - 1].count(old)
    if n != 1:
        print(f"SARIT {rel}:{ln} {old!r} apare de {n} ori pe linie: {lines[ln-1].strip()[:120]!r}")
        continue
    lines[ln - 1] = lines[ln - 1].replace(old, new)
    p.write_bytes("\n".join(lines).encode("utf-8"))
    print(f"OK    {rel}:{ln} {old} -> {new}")
