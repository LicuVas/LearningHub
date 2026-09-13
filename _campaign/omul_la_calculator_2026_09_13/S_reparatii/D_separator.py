"""Pe fiecare lectie cls8: cate formule cu mai multe argumente (;/, intre paranteze) si cate zecimale apar,
si daca lectia pomeneste ca separatorul difera de la calculator la calculator."""
import re
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\content\tic\cls8\m1-excel-fundamente")
for f in sorted(D.glob("lectia*.html")):
    t = f.read_text(encoding="utf-8")
    multi_pv = len(re.findall(r"=[A-ZĂÂÎȘȚ]+\([^()<]*;[^()<]*\)", t))
    multi_v = len(re.findall(r"=[A-ZĂÂÎȘȚ]+\([^()<]*[A-Z]\d+,\s*[A-Z]?\d[^()<]*\)", t))
    formule = len(re.findall(r"=[A-Z]+\(", t))
    zec = len(re.findall(r"\b\d+,\d+\b", t))
    mentiune = [k for k in ("poate fi setat diferit", "punct și virgulă", "punct si virgula", "celălalt semn", "celalalt semn") if k in t]
    print(f"{f.stem:22} formule={formule:3} cu_;={multi_pv:3} cu_,={multi_v:3} zecimale_cu_virgula={zec:3} mentiune={mentiune}")
