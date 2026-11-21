"""uneste.py — unește inventarele de paritate ale agenților și le verifică (contract.md, R1-R3).

Cum:  python .../paritate/uneste.py            (verifică + scrie paritate.json)
Ultima linie tipărită: numărul de probleme (întreg; 0 = R1-R3 îndeplinite).

R1: fiecare fișier de simulator / pagină cu simulator din `ASTEPTATE` apare în `fisiere_citite` al grupului.
R2: fiecare `vechi_dovada` = cale:rând (sau cale:rând-rând) care există în proba_src, iar rândul nu e gol.
R3: fiecare funcție are `biblioteca` în {DA, PARTIAL, NU}; la DA / PARTIAL dovada citează aplicatii/<fișier>:<rând>
    care există; la NU dovada nu e goală; la PARTIAL `lipsa` nu e goală.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

P = Path(__file__).resolve().parent
SRC = P / "proba_src"
LIB = P.parents[2]  # C:/00/Projects/LearningHub_fidel
ETICHETE = ["word", "excel-a", "excel-b", "powerpoint", "explorer-windows", "paint"]
GRUP = {"word": "word", "excel-a": "excel", "excel-b": "excel", "powerpoint": "powerpoint",
        "explorer-windows": "explorer-windows", "paint": "paint"}
S = "lectii/_sim/"
ASTEPTATE = {
    "word": [S + f for f in ("wordobj.js", "wordobj-formatare.js", "wordobj-hartie.js", "wordobj-interfata.js",
                             "wordobj-pagina.js", "wordobj-proba.js", "wordobj-tehnoredactare.js", "wordfisier.js",
                             "wordteh-stiluri.js")]
            + ["lectii/vii/m1-l04/index.html", "jocuri/word-antrenament-vii/index.html",
               "jocuri/word-obiecte-vii/index.html", "jocuri/word-vii/index.html"],
    "excel": [S + f for f in ("excelx.js", "excelx-interfata.js", "excelx-formatare.js", "excelx-formule.js",
                              "excelx-functii.js", "registru-foi.js", "excelx-sortare.js", "excelx-grafic.js",
                              "excelx-decizie.js", "excelx-proiect.js", "excelx-test.js")]
             + ["jocuri/_motor/tip-foaie.js", "jocuri/_motor/tip-excel.js", "lectii/viii/m1-l04/index.html",
                "jocuri/excel-antrenament-viii/index.html", "jocuri/excel-viii/index.html"],
    "powerpoint": [S + f for f in ("simppt.js", "simppt-animatii.js", "simppt-estetica.js", "simppt-fisier.js",
                                   "simppt-formatare.js", "simppt-interfata.js", "simppt-proba.js",
                                   "simppt-proiect.js")]
                  + ["lectii/vi/m1-l04/index.html", "jocuri/prezentari-antrenament-vi/index.html",
                     "jocuri/prezentari-vi/index.html"],
    "explorer-windows": [S + f for f in ("explorer-citire.js", "explorer-operatii.js", "explorer-organizare.js",
                                         "explorer-proba.js", "desktop-windows.js", "siguranta-pc.js")]
                        + ["jocuri/fisiere-v/index.html"],
    "paint": [S + f for f in ("paint.js", "paint-culori.js", "paint-imagine.js", "paint-proba.js",
                              "paint-selectie.js", "paint-text.js")] + ["jocuri/grafica-v/index.html"],
}
RE_LOC = re.compile(r"^\s*([^:\s][^:]*?):(\d+)(?:\s*-\s*(\d+))?\s*$")
RE_LIB = re.compile(r"(aplicatii/[\w./-]+?\.(?:js|json|css|html)):(\d+)")
_cache: dict[Path, list[str]] = {}


def randuri(cale: Path) -> list[str] | None:
    if cale not in _cache:
        if not cale.is_file():
            return None
        _cache[cale] = cale.read_text(encoding="utf-8", errors="replace").splitlines()
    return _cache[cale]


def norm(cale: str) -> str:
    c = cale.replace("\\", "/").strip()
    for pref in (str(SRC).replace("\\", "/") + "/", "proba_src/", "paritate/proba_src/"):
        if pref in c:
            c = c.split(pref, 1)[1]
    return c.lstrip("./")


def main() -> int:
    probleme: list[str] = []
    citite: dict[str, set[str]] = {}
    toate: list[dict] = []
    lipsa_fisier = []
    for et in ETICHETE:
        f = P / f"{et}.json"
        if not f.is_file():
            lipsa_fisier.append(et)
            continue
        d = json.loads(f.read_text(encoding="utf-8"))
        g = GRUP[et]
        citite.setdefault(g, set()).update(norm(x["cale"] if isinstance(x, dict) else x) for x in d.get("fisiere_citite", []))
        for fn in d.get("functii", []):
            fn = dict(fn)
            fn["_eticheta"] = et
            fn.setdefault("aplicatie", d.get("aplicatie", g))
            # excel-b: funcțiile de bază reimplementate de motorul jocurilor (tip-excel.js) = aceeași funcție ca în lecții
            fn["dublura"] = et == "excel-b" and "dublur" in (str(fn.get("nota", "")) + str(fn.get("lipsa", ""))).lower()
            toate.append(fn)
    for et in lipsa_fisier:
        probleme.append(f"R1 lipsește {et}.json")
    # R1
    for g, ast in ASTEPTATE.items():
        if g not in citite:
            continue
        for c in ast:
            if c not in citite[g]:
                probleme.append(f"R1 {g}: necitit {c}")
    # R2 + R3
    ids = set()
    for fn in toate:
        fid = fn.get("id", "?")
        if fid in ids:
            probleme.append(f"id dublat {fid}")
        ids.add(fid)
        dov = fn.get("vechi_dovada") or []
        if isinstance(dov, str):
            dov = [dov]
        if not dov:
            probleme.append(f"R2 {fid}: fără dovadă veche")
        for x in dov:
            m = RE_LOC.match(norm(str(x)))
            if not m:
                probleme.append(f"R2 {fid}: dovadă nelizibilă {x!r}")
                continue
            r = randuri(SRC / m.group(1))
            n = int(m.group(2))
            if r is None:
                probleme.append(f"R2 {fid}: fișier inexistent {m.group(1)}")
            elif not (1 <= n <= len(r)) or not r[n - 1].strip():
                probleme.append(f"R2 {fid}: rândul {n} lipsește / e gol în {m.group(1)}")
        v = str(fn.get("biblioteca", "")).upper().replace("Ț", "T")
        bd = str(fn.get("biblioteca_dovada", ""))
        if v not in ("DA", "PARTIAL", "NU"):
            probleme.append(f"R3 {fid}: verdict {v!r}")
            continue
        fn["biblioteca"] = v
        if v in ("DA", "PARTIAL"):
            loc = RE_LIB.findall(bd)
            if not loc:
                probleme.append(f"R3 {fid}: {v} fără aplicatii/<fișier>:<rând>")
            for cale, n in loc:
                r = randuri(LIB / cale)
                if r is None or not (1 <= int(n) <= len(r)):
                    probleme.append(f"R3 {fid}: dovadă inexistentă {cale}:{n}")
            if v == "PARTIAL" and not str(fn.get("lipsa", "")).strip():
                probleme.append(f"R3 {fid}: PARTIAL fără «lipsa»")
        elif not bd.strip():
            probleme.append(f"R3 {fid}: NU fără ce s-a căutat")
    # Verificarea independentă (R4) și corecturile: se aplică DUPĂ R1-R3 (care judecă ieșirile agenților, neatinse).
    vf = P / "verificare_rezultat.json"
    if vf.is_file():
        ver = {r["id"]: r for r in json.loads(vf.read_text(encoding="utf-8"))}
        for fn in toate:
            r = ver.get(fn.get("id"))
            if r:
                fn["verificat"] = {"cum": r.get("cum"), "acord": r["acord"], "verificator": r["verificator"]}
    cf = P / "corectii.json"
    if cf.is_file():
        cor = json.loads(cf.read_text(encoding="utf-8"))
        for fn in toate:
            c = cor.get(fn.get("id"))
            if c:
                fn["corectat"] = {"din": fn.get("biblioteca"), "motiv": c.get("motiv", "")}
                for k in ("biblioteca", "lipsa", "nota", "vechi_dovada"):
                    if k in c:
                        fn[k] = c[k]
    rez: dict[str, dict] = {}
    for fn in toate:
        a = fn.get("aplicatie") or GRUP[fn["_eticheta"]]
        r = rez.setdefault(a, {"total": 0, "DA": 0, "PARTIAL": 0, "NU": 0, "cerute_lipsa": 0, "dubluri": 0})
        if fn.get("dublura"):
            r["dubluri"] += 1
            continue
        r["total"] += 1
        if fn.get("biblioteca") in r:
            r[fn["biblioteca"]] += 1
        if fn.get("ceruta_de_exercitiu") and fn.get("biblioteca") in ("NU", "PARTIAL"):
            r["cerute_lipsa"] += 1
    (P / "paritate.json").write_text(json.dumps({"rezumat": rez, "functii": toate, "probleme": probleme},
                                                ensure_ascii=False, indent=1), encoding="utf-8")
    for a, r in sorted(rez.items()):
        print(f"{a:12} total {r['total']:4}  DA {r['DA']:4}  PARTIAL {r['PARTIAL']:4}  NU {r['NU']:4}  "
              f"(cerute de exerciții și lipsă/parțial: {r['cerute_lipsa']})")
    for p in probleme[:60]:
        print("  -", p)
    if len(probleme) > 60:
        print(f"  … încă {len(probleme) - 60}")
    print(len(probleme))
    return 0


if __name__ == "__main__":
    sys.exit(main())
