import re
import sys
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls7\lectia5-tabele\diacritice")
if len(sys.argv) > 1 and sys.argv[1] == "view":
    nn = sys.argv[2]
    lines = (D / f"in_{nn}.txt").read_bytes().decode("utf-8").split("\n")
    for i, l in enumerate(lines, 1):
        txt = re.sub(r"<[^>]*>", "", l).strip()
        if re.search(r"[a-zA-Z]{2,}", txt) or "data-quiz" in l or "alt=" in l or "title=" in l or "aria-label" in l or "placeholder" in l:
            print(f"{i}|{l.strip()}")
    sys.exit(0)
data = (D / "original.html").read_bytes().decode("utf-8")
lines = data.split("\n")
N = 120
chunks = [lines[i:i + N] for i in range(0, len(lines), N)]
for k, ch in enumerate(chunks, 1):
    body = "\n".join(ch)
    if k < len(chunks):
        body += "\n"
    (D / f"in_{k:02d}.txt").write_bytes(body.encode("utf-8"))
print(len(chunks))
