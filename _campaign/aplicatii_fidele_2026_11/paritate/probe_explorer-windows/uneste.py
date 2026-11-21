"""Unește părțile A/B/C ale inventarului explorer-windows într-un singur JSON + verifică dovezile.

Folosire: python uneste.py [--scrie]
Fără --scrie: doar raportează (dezacorduri între părți, dovezi care nu se găsesc).
Cu --scrie: scrie P/explorer-windows.json.
"""
import json, re, sys
from pathlib import Path

P = Path(r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate")
SRC = P / "proba_src"
RAD = Path(r"C:/00/Projects/LearningHub_fidel")
D = P / "probe_explorer-windows"
ORD = {"NU": 0, "PARTIAL": 1, "DA": 2}

# aceeași funcție cu chei diferite în părți (hotărât de orchestrator după citirea celor trei liste)
RECHEIE = {"A-002": "nav_acest_pc", "C-033": "nav_acest_pc", "C-035": "selectie_clic"}
NOTE = {"A-024": "Se suprapune cu funcțiile din lecția 10 (semne interzise, extensie schimbată, nume existent), "
                 "trecute separat: aici e validarea din jocul fisiere-v, cu mesajele lui.",
        "A-020": "Caseta de răspuns ține de stratul exercițiului (motor / lecție), nu de Explorer; trecută aici fiindcă "
                 "biblioteca (§8) n-are încă un tip de exercițiu cu răspuns scris. Partea C a socotit la fel de casete "
                 "(ora, numărul de amenințări) ca fiind ale lecției și nu le-a trecut ca funcții.",
        "A-039": "Caseta de răspuns ține de stratul exercițiului (motor / lecție), nu de Windows; vezi nota de la caseta pentru cale."}

def citeste_parti():
    parti = []
    for x in "ABC":
        f = D / f"parte_{x}.json"
        if f.exists():
            p = json.loads(f.read_text(encoding="utf-8"))
            for fn in p.get("functii", []):
                if fn["id"] in RECHEIE:
                    fn["cheie"] = RECHEIE[fn["id"]]
                if fn["id"] in NOTE:
                    fn["nota"] = (fn.get("nota", "") + " " + NOTE[fn["id"]]).strip()
            parti.append(p)
        else:
            print(f"LIPSĂ parte_{x}.json")
    return parti

_cache = {}
def linie(cale: Path, n: int):
    if cale not in _cache:
        try:
            _cache[cale] = cale.read_text(encoding="utf-8", errors="replace").split("\n")
        except OSError:
            _cache[cale] = None
    t = _cache[cale]
    if t is None or n < 1 or n > len(t):
        return None
    return t[n - 1]

def e_comentariu(s: str) -> bool:
    s = s.strip()
    return s == "" or s.startswith("//") or s.startswith("/*") or s.startswith("*") or s.startswith("<!--")

REF = re.compile(r"([\w./\-]+\.(?:js|html|json|css)):(\d+)")

def verifica_vechi(d):
    m = REF.match(d.strip())
    if not m:
        return f"format: {d}"
    l = linie(SRC / m.group(1), int(m.group(2)))
    if l is None:
        return f"nu există: {d}"
    if e_comentariu(l):
        return f"comentariu/gol: {d}"
    return None

def verifica_bib(d):
    probleme = []
    for m in REF.finditer(d or ""):
        c = m.group(1)
        if not c.startswith("aplicatii/"):
            continue
        l = linie(RAD / c, int(m.group(2)))
        if l is None:
            probleme.append(f"nu există: {c}:{m.group(2)}")
        elif e_comentariu(l) and not c.endswith(".json"):
            probleme.append(f"comentariu/gol: {c}:{m.group(2)}")
    return probleme

def uniq(xs):
    out = []
    for x in xs:
        if x and x not in out:
            out.append(x)
    return out

def main():
    scrie = "--scrie" in sys.argv
    parti = citeste_parti()
    grupuri = {}   # (aplicatie, cheie) -> list of (parte, f)
    ordine = []
    for p in parti:
        vazute_in_parte = {}
        for f in p.get("functii", []):
            k = (f.get("aplicatie"), f.get("cheie") or f["id"])
            # aceeași cheie de două ori în ACEEAȘI parte = funcții diferite
            if k in vazute_in_parte:
                vazute_in_parte[k] += 1
                k = (k[0], f"{k[1]}#{p['parte']}{vazute_in_parte[k]}")
            else:
                vazute_in_parte[k] = 0
            if k not in grupuri:
                grupuri[k] = []
                ordine.append(k)
            grupuri[k].append((p["parte"], f))
    functii = []
    dezacord = []
    for k in ordine:
        g = grupuri[k]
        f0 = dict(g[0][1])
        if len(g) > 1:
            verd = [x[1].get("biblioteca") for x in g]
            if len(set(verd)) > 1:
                dezacord.append((k, [(x[0], x[1]["id"], x[1].get("biblioteca")) for x in g]))
            f0["vechi_dovada"] = uniq(sum((x[1].get("vechi_dovada", []) for x in g), []))
            f0["unde"] = uniq(sum((x[1].get("unde", []) for x in g), []))
            f0["exercitii"] = uniq(sum((x[1].get("exercitii", []) for x in g), []))
            f0["ceruta_de_exercitiu"] = any(x[1].get("ceruta_de_exercitiu") for x in g)
            f0["gest"] = " / ".join(uniq([x[1].get("gest", "") for x in g]))
            cel_mai_rau = min(g, key=lambda x: ORD.get(x[1].get("biblioteca"), 0))[1]
            f0["biblioteca"] = cel_mai_rau.get("biblioteca")
            f0["biblioteca_dovada"] = " | ".join(uniq([x[1].get("biblioteca_dovada", "") for x in g]))
            f0["lipsa"] = " | ".join(uniq([x[1].get("lipsa", "") for x in g]))
            f0["nota"] = " | ".join(uniq([x[1].get("nota", "") for x in g]))
            f0["_din"] = [x[1]["id"] for x in g]
        else:
            f0["_din"] = [f0["id"]]
        functii.append(f0)
    # verificarea dovezilor
    rele = []
    for f in functii:
        for d in f.get("vechi_dovada", []):
            e = verifica_vechi(d)
            if e:
                rele.append((f["_din"], "vechi", e))
        for e in verifica_bib(f.get("biblioteca_dovada", "")):
            rele.append((f["_din"], "bib", e))
        if f.get("biblioteca") not in ORD:
            rele.append((f["_din"], "verdict", str(f.get("biblioteca"))))
        if f.get("ceruta_de_exercitiu") and not f.get("exercitii"):
            rele.append((f["_din"], "exercitii", "ceruta fără loc"))
    print(f"funcții după unire: {len(functii)} (din {sum(len(p.get('functii', [])) for p in parti)})")
    print("dezacorduri:", len(dezacord))
    for k, v in dezacord:
        print("  ", k, v)
    print("dovezi rele:", len(rele))
    for r in rele:
        print("  ", r)
    if scrie:
        out_f = []
        for i, f in enumerate(functii, 1):
            o = {"id": f"explorer-windows-F{i:03d}", "aplicatie": f.get("aplicatie")}
            for c in ["functie", "grup", "gest", "vechi_dovada", "unde", "ceruta_de_exercitiu", "exercitii",
                      "biblioteca", "biblioteca_dovada", "lipsa", "nota"]:
                o[c] = f.get(c, [] if c in ("vechi_dovada", "unde", "exercitii") else ("" if c != "ceruta_de_exercitiu" else False))
            out_f.append(o)
        fc = []
        for p in parti:
            for x in p.get("fisiere_citite", []):
                cale = x["cale"].split(" (")[0].split(" §")[0].strip()
                if cale not in [y["cale"] for y in fc]:
                    fc.append({"cale": cale, "linii": x["linii"]})
        rez = {
            "aplicatie": "explorer+windows",
            "eticheta": "explorer-windows",
            "fisiere_citite": fc,
            "functii": out_f,
            "doar_afisate": sum((p.get("doar_afisate", []) for p in parti), []),
            "nesigure": sum(([f"[{p['parte']}] {n}" for n in p.get("nesigure", [])] for p in parti), []),
        }
        (P / "explorer-windows.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
        from collections import Counter
        c = Counter(f["biblioteca"] for f in out_f)
        print("SCRIS", len(out_f), dict(c))

if __name__ == "__main__":
    main()
