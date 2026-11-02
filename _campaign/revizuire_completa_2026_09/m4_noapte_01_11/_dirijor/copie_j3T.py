"""Copiază proba J3-T a judecătorului VI/23 în _proba/t_dirijor/, cu ieșirea mutată acolo (singura schimbare: rândul OUT)."""
from pathlib import Path
V = Path(r"C:/00/Projects/LearningHub/lectii/vi/m4-l23/_verificare")
D = Path(r"C:/00/Projects/LearningHub/lectii/vi/m4-l23/_proba/t_dirijor")
D.mkdir(exist_ok=True)
lib = (V / "j2_lib.py").read_bytes().decode("utf-8")
vechi = 'OUT = LH / "lectii/vi/m4-l23/_verificare"'
assert lib.count(vechi) == 1, "randul OUT nu e unic"
(D / "j2_lib.py").write_bytes(lib.replace(vechi, 'OUT = LH / "lectii/vi/m4-l23/_proba/t_dirijor"').encode("utf-8"))
(D / "j3_T.py").write_bytes((V / "j3_T.py").read_bytes())
print("copiat", sorted(p.name for p in D.iterdir()))
