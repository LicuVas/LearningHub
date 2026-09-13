"""Cauta tiparul de greseala gasit de verificator: infinitiv cu ă final dupa „a" (pentru a mută) si „a două"."""
import re
from pathlib import Path

SITE = Path(r"C:\00\Projects\LearningHub\content\tic")
L = "a-zA-ZăâîșțĂÂÎȘȚ"
PAT = re.compile(rf"(?<![{L}])(pentru a|de a|a putea|poți|pot|poate|vei|va|vor|putea|a) ([{L}]+ă)(?![{L}])|(?<![{L}])a două(?![{L}])")
for mod in ["cls5/m1-sisteme", "cls6/m1-prezentari", "cls7/m1-word-fundamente", "cls8/m1-excel-fundamente"]:
    for f in sorted((SITE / mod).glob("lectia*.html")):
        for i, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            for m in PAT.finditer(line):
                print(f"{mod.split('/')[0]}/{f.stem}:{i}: …{re.sub('<[^>]+>', '', line)[max(0, m.start()-40):m.end()+30].strip()}…")
