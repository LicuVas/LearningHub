from pathlib import Path
D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls5\lectia2-hardware\diacritice")
data = (D / "original.html").read_bytes()
print("CRLF:", b"\r\n" in data)
lines = data.decode("utf-8").split("\n")
chunks = []
for k in range(0, len(lines), 120):
    chunks.append(lines[k:k + 120])
for n, ch in enumerate(chunks, 1):
    txt = "\n".join(ch)
    if n < len(chunks):
        txt += "\n"
    (D / f"in_{n:02d}.txt").write_bytes(txt.encode("utf-8"))
print("bucati:", len(chunks))
