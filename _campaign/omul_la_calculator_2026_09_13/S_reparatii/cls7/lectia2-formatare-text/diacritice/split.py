from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls7\lectia2-formatare-text\diacritice")
lines = (D / "original.html").read_bytes().decode("utf-8").splitlines(keepends=True)
n = 0
for k in range(0, len(lines), 120):
    n += 1
    (D / f"in_{n:02d}.txt").write_bytes("".join(lines[k:k + 120]).encode("utf-8"))
print(n, "bucati")
