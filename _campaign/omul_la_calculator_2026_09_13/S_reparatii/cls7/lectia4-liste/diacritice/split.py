import re
import sys
from pathlib import Path
D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls7\lectia4-liste\diacritice")
data = (D / "original.html").read_bytes()
print("CRLF:", b"\r\n" in data)
lines = data.decode("utf-8").split("\n")
chunks = [lines[k:k + 120] for k in range(0, len(lines), 120)]
for n, ch in enumerate(chunks, 1):
    txt = "\n".join(ch)
    if n < len(chunks):
        txt += "\n"
    (D / f"in_{n:02d}.txt").write_bytes(txt.encode("utf-8"))
print("bucati:", len(chunks))
# vedere compacta: doar liniile cu text (global nr), pentru citire
out = []
for i, l in enumerate(lines, 1):
    t = re.sub(r"<[^>]*>", "", l).strip()
    if re.search(r"[A-Za-z]{2,}", t) or re.search(r"data-quiz|alt=|title=|aria-label|placeholder", l):
        out.append(f"{i}|{l.strip()}")
(D / "text_lines.txt").write_bytes("\n".join(out).encode("utf-8"))
print("linii cu text:", len(out))
