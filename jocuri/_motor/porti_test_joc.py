"""test_joc.py pe TOATE lecțiile publicate (lectii/plan.json, stare „publicat”) și pe TOATE jocurile din /jocuri/
care folosesc motorul, fiecare sub garda_locala.py (regula 24). Rulează câte 4 deodată (test_joc merge pe file://).

    python porti_test_joc.py [--doar lectii|jocuri] [--paralel 4] [--jurnal fisier.txt]

Ultima linie = câte lecții/jocuri au PICAT (0 = toate trec).
"""
import argparse
import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
LH = Path(__file__).resolve().parents[2]
MOTOR = Path(__file__).resolve().parent
TEST = MOTOR / "test_joc.py"
GARDA = MOTOR / "garda_locala.py"


def tinte(doar):
    out = []
    if doar in (None, "lectii"):
        plan = json.loads((LH / "lectii" / "plan.json").read_text(encoding="utf-8"))
        for slug, cl in plan["clase"].items():
            for m in cl.get("module", []):
                for l in m.get("lectii", []):
                    if l.get("stare") == "publicat" and l.get("cale"):
                        p = LH / l["cale"]
                        if (p / "index.html").exists():
                            out.append(("lectie", str(p.parent), p.name))
    if doar in (None, "jocuri"):
        for d in sorted((LH / "jocuri").iterdir()):
            if d.is_dir() and not d.name.startswith("_") and (d / "index.html").exists() \
                    and "_motor/motor.js" in (d / "index.html").read_text(encoding="utf-8"):
                out.append(("joc", str(d.parent), d.name))
    return out


def ruleaza(t):
    tip, folder, slug = t
    r = subprocess.run([sys.executable, str(GARDA), str(TEST), "--dir", folder, slug], capture_output=True,
                       text=True, encoding="utf-8", errors="replace", timeout=900)
    linii = [x for x in (r.stdout or "").splitlines() if x.strip()]
    stare = next((x for x in linii if x.startswith(("[TRECUT]", "[PICAT]", "[SARIT]"))), "")
    fails = [x.strip() for x in linii if x.strip().startswith("FAIL")]
    return tip, folder, slug, r.returncode, stare, fails, (r.stderr or "")[-400:]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--doar", choices=["lectii", "jocuri"])
    ap.add_argument("--paralel", type=int, default=4)
    ap.add_argument("--jurnal")
    a = ap.parse_args()
    lista = tinte(a.doar)
    print("de rulat: %d (%d lecții, %d jocuri)" % (len(lista), sum(1 for x in lista if x[0] == "lectie"),
                                                    sum(1 for x in lista if x[0] == "joc")), flush=True)
    picate, rez = 0, []
    with ThreadPoolExecutor(max_workers=a.paralel) as ex:
        for tip, folder, slug, rc, stare, fails, err in ex.map(ruleaza, lista):
            nume = "%s/%s" % (Path(folder).name, slug)
            ok = rc == 0 and (stare.startswith("[TRECUT]") or stare.startswith("[SARIT]"))
            picate += not ok
            rand = "%s %s  (%s)" % ("ok  " if ok else "PICAT", nume, stare or "fără verdict, cod %d" % rc)
            print(rand, flush=True)
            rez.append(rand)
            for f in fails[:6]:
                print("      " + f, flush=True)
                rez.append("      " + f)
            if not ok and not fails:
                print("      " + err.replace("\n", " | ")[-300:], flush=True)
    if a.jurnal:
        Path(a.jurnal).write_text("\n".join(rez) + "\n", encoding="utf-8")
    print(picate)


if __name__ == "__main__":
    main()
