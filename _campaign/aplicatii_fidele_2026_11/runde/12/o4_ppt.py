# -*- coding: utf-8 -*-
"""Unealta de lucru a constructorului 12: O4 doar pe scenariile PowerPoint, cu ieșirea în %TEMP% (nu atinge iesiri/ ale rundei).
Tipărește scenariile care nu trec (verdict + prima diferență, scurt); ultima linie = numărul O4 pe PowerPoint.
    python runde/12/o4_ppt.py [--doar <subșir>]"""
import json, os, subprocess, sys, tempfile
from pathlib import Path

D = Path(__file__).resolve().parents[2]
OUT = Path(tempfile.gettempdir()) / "lh_r12_o4"


def main():
    doar = sys.argv[sys.argv.index("--doar") + 1] if "--doar" in sys.argv else None
    OUT.mkdir(exist_ok=True)
    env = dict(os.environ, LH_IESIRE=str(OUT), PYTHONIOENCODING="utf-8")
    scen = D / "scenarii" / "powerpoint"
    if doar:   # o copie cu scenariile cerute (oracolul citește un dosar)
        tmp = OUT / "scen"
        tmp.mkdir(exist_ok=True)
        for f in tmp.glob("*.json"):
            f.unlink()
        for f in scen.glob("*.json"):
            if any(x in f.name for x in doar.split(",")):
                (tmp / f.name).write_bytes(f.read_bytes())
        scen = tmp
    r = subprocess.run([sys.executable, "-X", "utf8", str(D / "oracole" / "oracol_comportament.py"), "--scenarii", str(scen)],
                       capture_output=True, text=True, encoding="utf-8", env=env, timeout=900)
    o = json.loads((OUT / "oracol_comportament.json").read_text(encoding="utf-8"))
    sc = o["scenarii"]
    it = sc.items() if isinstance(sc, dict) else [(s.get("id"), s) for s in sc]
    for k, v in it:
        if v.get("verdict") == "ok":
            continue
        d = v.get("eroare") or json.dumps(v.get("diferente"), ensure_ascii=False)
        print(k, v.get("verdict"), d[:400])
    print(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr[-400:])


if __name__ == "__main__":
    main()
