import re
from pathlib import Path
D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls8\lectia7-sortare\diacritice")
t = (D / "nou.html").read_text(encoding="utf-8")
t = re.sub(r"<(title|script|style|code)\b.*?</\1>", " ", t, flags=re.S)
t = re.sub(r'data-quiz="([^"]*)"', lambda m: ">" + m.group(1) + "<", t)
t = re.sub(r"<[^>]+>", " ", t)
H = str.maketrans("ăâîșțĂÂÎȘȚ", "aaistAAIST")
words = re.findall(r"[\wăâîșțĂÂÎȘȚ-]+", t)
dia = {}
for w in words:
    if w != w.translate(H):
        dia.setdefault(w.translate(H), set()).add(w)
plain = {}
for w in words:
    if w == w.translate(H) and w in dia:
        plain[w] = plain.get(w, 0) + 1
for w, n in sorted(plain.items()):
    print(w, n, "vs", sorted(dia[w]))
