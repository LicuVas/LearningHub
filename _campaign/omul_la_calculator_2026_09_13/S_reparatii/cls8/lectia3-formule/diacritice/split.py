from pathlib import Path
D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls8\lectia3-formule\diacritice")
lines = (D / "original.html").read_text(encoding="utf-8").splitlines(keepends=True)
n = 0
for i in range(0, len(lines), 120):
    n += 1
    (D / f"in_{n:02d}.txt").write_text("".join(lines[i:i + 120]), encoding="utf-8", newline="")
print(n, len(lines))
