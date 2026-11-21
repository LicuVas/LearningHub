# Verifica mecanic parte_C.json: JSON valid; fiecare vechi_dovada / biblioteca_dovada / exercitii indica o linie existenta, nevida, care nu e comentariu.
import json, os, re, sys

AICI = os.path.dirname(os.path.abspath(__file__))
P = os.path.dirname(AICI)
SRC = os.path.join(P, "proba_src")
LIB = os.path.dirname(os.path.dirname(os.path.dirname(P)))   # C:/00/Projects/LearningHub_fidel
d = json.load(open(os.path.join(AICI, "parte_C.json"), encoding="utf-8"))
cache = {}
def linie(cale, n):
    if cale not in cache:
        cache[cale] = open(cale, encoding="utf-8").read().split("\n")
    L = cache[cale]
    return L[n - 1] if 1 <= n <= len(L) else None
def comentariu(s):
    t = s.strip()
    return t.startswith("//") or t.startswith("/*") or t.startswith("*") or t.startswith("<!--")
probleme, n = [], 0
def verifica(cale, nr, unde):
    global n
    n += 1
    if not os.path.exists(cale):
        probleme.append(f"{unde}: fisier lipsa {cale}"); return
    s = linie(cale, nr)
    if s is None or not s.strip():
        probleme.append(f"{unde}: linia {nr} lipsa/goala in {cale}")
    elif comentariu(s):
        probleme.append(f"{unde}: linia {nr} e comentariu in {cale}: {s.strip()[:80]}")
REF = re.compile(r"((?:aplicatii/)?(?:date/)?[\w.\-]+\.(?:js|json))?:(\d+)")
for f in d["functii"]:
    for v in f["vechi_dovada"]:
        c, nr = v.rsplit(":", 1); verifica(os.path.join(SRC, c), int(nr), f["id"] + " vechi")
    for e in f["exercitii"]:
        c, nr = re.match(r"(lectii/[^:]+):(\d+)", e).groups(); verifica(os.path.join(SRC, c), int(nr), f["id"] + " exercitiu")
    if f["biblioteca"] in ("DA", "PARTIAL") or "aplicatii/" in f["biblioteca_dovada"]:
        cur = None
        for m in REF.finditer(f["biblioteca_dovada"]):
            fis, nr = m.group(1), int(m.group(2))
            if fis:
                if fis.endswith(".json") and "probe_" in f["biblioteca_dovada"][max(0, m.start() - 40):m.start() + 5]:
                    continue
                fis = fis[len("aplicatii/"):] if fis.startswith("aplicatii/") else fis
                if fis.startswith("C_proba"):
                    continue
                cur = fis
            if cur is None:
                continue
            verifica(os.path.join(LIB, "aplicatii", cur), nr, f["id"] + " biblioteca " + cur)
for g in d["doar_afisate"]:
    c, nr = g["dovada"].rsplit(":", 1); verifica(os.path.join(SRC, c), int(nr), "doar_afisate")
ids = [f["id"] for f in d["functii"]]
assert len(ids) == len(set(ids))
chei = [f["cheie"] for f in d["functii"]]
if len(chei) != len(set(chei)): probleme.append("chei duplicate")
for f in d["functii"]:
    for k in ("id", "functie", "grup", "gest", "vechi_dovada", "unde", "ceruta_de_exercitiu", "exercitii", "biblioteca", "biblioteca_dovada", "lipsa", "nota", "aplicatie", "cheie"):
        if k not in f: probleme.append(f"{f['id']}: lipseste {k}")
    if f["biblioteca"] == "PARTIAL" and not f["lipsa"]: probleme.append(f"{f['id']}: PARTIAL fara lipsa")
    if f["ceruta_de_exercitiu"] != bool(f["exercitii"]): probleme.append(f"{f['id']}: ceruta vs exercitii")
print("referinte verificate:", n)
print("\n".join(probleme) if probleme else "OK: nicio problema")
print(len(probleme))
