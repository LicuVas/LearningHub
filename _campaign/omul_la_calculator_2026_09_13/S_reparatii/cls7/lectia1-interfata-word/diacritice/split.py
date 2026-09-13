"""Imparte original.html in in_NN.txt de cate 120 de linii (fara sa taie o linie)."""
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls7\lectia1-interfata-word\diacritice")
data = (D / "original.html").read_bytes().decode("utf-8")
lines = data.splitlines(keepends=True)
print("CRLF" if "\r\n" in data else "LF", len(lines), "linii")
for k in range(0, len(lines), 120):
    (D / f"in_{k // 120 + 1:02d}.txt").write_bytes("".join(lines[k:k + 120]).encode("utf-8"))
