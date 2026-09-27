# -*- coding: utf-8 -*-
"""Proba reparației WinError 32: (1) un dosar temporar cu un fișier ținut deschis nu mai oprește rularea;
(2) o treaptă care crapă nu mai oprește raportul (raportul se scrie oricum, cu eroarea ca problemă care blochează).

    python proba_rmtree.py"""
import sys
from pathlib import Path

AICI = Path(__file__).resolve().parent
sys.path.insert(0, str(AICI.parent))
import verifica_lectie as VL  # noqa: E402

ok = True
# (1) dosar temporar cu un fișier deschis (pe Windows: WinError 32 la ștergere)
try:
    with VL.dosar_temp() as gol:
        f = open(Path(gol) / "ocupat.txt", "w")
        f.write("x")
    print("dosar_temp cu fișier deschis: fără excepție (curățenia a fost amânată)")
    f.close()
except Exception as e:
    ok = False
    print(f"dosar_temp a aruncat: {e!r}")
d = AICI / "rezultate" / "_ocupat"
d.mkdir(parents=True, exist_ok=True)
g = open(d / "ocupat.txt", "w")
try:
    VL.sterge(d)
    print("sterge() pe un dosar cu fișier deschis: fără excepție")
except Exception as e:
    ok = False
    print(f"sterge() a aruncat: {e!r}")
g.close()
VL.sterge(d)

# (2) o treaptă care crapă: raportul se scrie oricum
def _crapa(*a, **k):
    raise PermissionError(32, "The process cannot access the file because it is being used by another process")


VL.treapta_t0 = _crapa
out = AICI / "rezultate" / "crash"
cod = VL.main([str(AICI / "control" / "vii" / "m1-l04" / "index.html"), "--fara-t1", "--iesire", str(out)])
raport = (out / "raport.md").read_text(encoding="utf-8")
scris = "T0 s-a oprit cu o eroare" in raport and raport.strip().splitlines()[-1].strip().isdigit()
print(f"treapta T0 care crapă: raport scris = {scris}, cod {cod}")
ok = ok and scris
print("PROBA RMTREE/RAPORT:", "TRECUTĂ" if ok else "PICATĂ")
sys.exit(0 if ok else 1)
