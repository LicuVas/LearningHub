from pathlib import Path
D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls5\lectia4-ergonomie\diacritice")
lines = (D / "original.html").read_bytes().decode("utf-8").splitlines(keepends=True)
N = 120
for k in range(0, len(lines), N):
    (D / f"in_{k // N + 1:02d}.txt").write_bytes("".join(lines[k:k + N]).encode("utf-8"))
print(len(lines), "linii")
