# Leagă lecțiile nr. 4 publicate pe /lectii/ în datele panoului clasei (C:/00/AI_0/data/panou/lectii.json).
# Cheia = clasa + „|” + titlul exact din Calendar_ore. Face o copie de siguranță înainte.
import json
import shutil
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
F = Path(r"C:/00/AI_0/data/panou/lectii.json")
shutil.copy2(F, F.with_suffix(".json.inainte_lectii_noi"))
d = json.loads(F.read_text(encoding="utf-8"))
B = "https://learninghub-8z6.pages.dev/lectii/"
NOI = {
    "5|Structura generală a unui sistem de calcul. Rolul componentelor hardware": B + "v/m1-l04/",
    "6|Structura unei prezentări: diapozitive și obiecte": B + "vi/m1-l04/",
    "7|Obiecte într-un document: text, imagini, tabele": B + "vii/m1-l04/",
    "8|Adresa de celulă. Selectare, copiere, mutare, ștergere": B + "viii/m1-l04/",
}
for k, v in NOI.items():
    print(("schimbat" if k in d else "adăugat"), k, "->", v)
    d[k] = v
F.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("intrări:", len(d))
print(0)
