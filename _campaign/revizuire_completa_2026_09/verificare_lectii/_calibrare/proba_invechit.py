# -*- coding: utf-8 -*-
"""Proba amprentei: pagina se schimbă în timpul rulării -> raportul trebuie să spună ÎNVECHIT și ultima linie -1.

    python proba_invechit.py

Copiază copia `control` în _calibrare/invechit/vii/m1-l04/, pornește linia (--fara-t1), iar după 6 secunde adaugă un
comentariu HTML la finalul paginii (ca un autor care salvează o reparație). Lecția originală NU e atinsă."""
import shutil
import subprocess
import sys
import time
from pathlib import Path

AICI = Path(__file__).resolve().parent
LINIA = AICI.parent / "verifica_lectie.py"
SRC = AICI / "control" / "vii" / "m1-l04" / "index.html"
DST = AICI / "invechit" / "vii" / "m1-l04" / "index.html"
OUT = AICI / "rezultate" / "invechit"


def main() -> int:
    DST.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SRC, DST)
    p = subprocess.Popen([sys.executable, str(LINIA), str(DST), "--fara-t1", "--iesire", str(OUT)],
                         stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8")
    time.sleep(6)
    with DST.open("a", encoding="utf-8") as f:
        f.write("\n<!-- reparație salvată în timpul rulării -->\n")
    out, _ = p.communicate(timeout=600)
    linii = [l for l in out.splitlines() if l.strip()]
    print("\n".join(linii[-4:]))
    print(f"cod de ieșire: {p.returncode}")
    raport = (OUT / "raport.md").read_text(encoding="utf-8")
    ok = linii[-1].strip() == "-1" and "ÎNVECHIT" in raport and p.returncode == 2
    print("PROBA ÎNVECHIT:", "TRECUTĂ" if ok else "PICATĂ")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
