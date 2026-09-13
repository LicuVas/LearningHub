"""Imparte original.html in in_NN.txt de cate 120 de linii (fara sa taie o linie; fiecare bucata isi pastreaza \n-urile)."""
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls6\lectia2-slide-uri\diacritice")
data = (D / "original.html").read_bytes().decode("utf-8")
print("CRLF:", "\r\n" in data)
lines = data.splitlines(keepends=True)
for k in range(0, len(lines), 120):
    nn = k // 120 + 1
    (D / f"in_{nn:02d}.txt").write_bytes("".join(lines[k:k + 120]).encode("utf-8"))
    print(f"in_{nn:02d}.txt: linii {k + 1}-{min(k + 120, len(lines))}")
