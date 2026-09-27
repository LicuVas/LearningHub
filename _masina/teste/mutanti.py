"""Banc de mutanți: fiecare mutant strică O regulă a mașinii; ruleaza_teste.py trebuie să pice pe FIECARE.
Dovada că testele „mușcă” (testele scrise de același autor confirmă ușor propriile orbiri).

    python _masina/teste/mutanti.py        # ultima linie = numărul de mutanți supraviețuitori (0 = bine)

Lucrează pe o copie a lui _masina într-un dosar temporar; originalul nu se atinge.
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SRC = Path(__file__).resolve().parents[1]
BAZA = Path(tempfile.mkdtemp(prefix="masina_mutanti_"))
MUTANTI = [
    ("citatul din ecran e primit", "valideaza_pas.py",
     'curent = [(b, o) for b, o in pot_s if self.bl[b]["tip"] in C.TIPURI_LECTIE]',
     'curent = [(b, o) for b, o in pot_s if self.bl[b]["tip"] in C.TIPURI_LECTIE | {"ecran"}]'),
    ("dosarul include explicația (why)", "dosar_dumb.py",
     'bl.append({"id": f"{pref}.ENUNT"',
     'enunt_html += (item.get("why") or "")\n    bl.append({"id": f"{pref}.ENUNT"'),
    ("canarul de număr nu mai e verificat", "valideaza_pas.py",
     'if can["vechi"] in tast and can["nou"] not in tast:', 'if False:'),
    ("momeala găsită nu invalidează", "valideaza_pas.py",
     'if isinstance(src, dict) and src.get("tip") != "nicaieri" and self.sursa(src, ms)[0] in ("ok", "imagine"):', 'if False:'),
    ("fără tabelul de cunoștințe", "valideaza_pas.py",
     'if not self.predat(conc, pana, sid):', 'if False:'),
    ("fără foaia ținută de script", "valideaza_pas.py",
     'for c in self.conflicte(sid, celule_agent):', 'for c in []:'),
    ("fără mască NU ȘTIE", "dosar_dumb.py",
     'for t, loc in C.termeni_profil(profil):', 'for t, loc in []:'),
    ("fără repararea ghilimelelor care rup JSON-ul", "valideaza_pas.py",
     '    if repara:\n', '    if False:\n'),
    ("obiectul nu mai trebuie să fie lângă citat", "valideaza_pas.py",
     'return any(C.nc(obs) in f for f in fer)', 'return True'),
    ("ghilimelele/liniuțele nu se mai normalizează", "comun.py",
     '    return ns(str(s or "").translate(_SEMNE))', '    return ns(str(s or ""))'),
    ("testul de scurgere dezactivat", "dosar_dumb.py",
     '    if scurs:\n', '    if False:\n'),
    ("metoda citată din enunț e primită", "valideaza_pas.py",
     'if doua and st_m == "ok" and act["actiune"] not in ALEGERI and',
     'if False and doua and st_m == "ok" and act["actiune"] not in ALEGERI and'),
    ("executorul nu mai compară caseta de nume", "executor_pagina.py",
     '"ok": (st.get("caseta_nume") or "").upper() == m.group(1).upper()', '"ok": True'),
    ("executorul nu mai vede celula în editare", "executor_pagina.py",
     "out.in_editare = !!(out.mod && !/^Gata|^Ready/i.test(out.mod));", "out.in_editare = false;"),
]
if len(sys.argv) > 1:  # python mutanti.py <bucată din nume> = doar mutanții potriviți
    MUTANTI = [m for m in MUTANTI if sys.argv[1].casefold() in m[0].casefold()]
MUTANTI.insert(0, ("MARTOR (fără mutație: trebuie 0 picate)", "comun.py", "", ""))
LH = SRC.parent
rez = []
for i, (nume, fis, vechi, nou) in enumerate(MUTANTI):
    d = BAZA / f"m{i}" / "_masina"
    shutil.rmtree(d.parent, ignore_errors=True)
    shutil.copytree(SRC, d, ignore=shutil.ignore_patterns("_secret", "_dosare", "proba", "__pycache__", "_iesire"))
    motor = [p.relative_to(LH) for p in (LH / "jocuri" / "_motor").iterdir() if p.suffix in (".js", ".css", ".json")]
    for rel in motor + [Path(r"_campaign\revizuire_completa_2026_09\calibrare\meniuri_ro_en.json")]:
        (d.parent / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(LH / rel, d.parent / rel)
    f = d / fis
    s = f.read_text(encoding="utf-8")
    if not vechi:
        p = subprocess.run([sys.executable, str(d / "teste" / "ruleaza_teste.py")], capture_output=True, text=True, encoding="utf-8")
        ult = [x for x in p.stdout.splitlines() if x.strip()]
        rez.append((nume, f"picate={ult[-1] if ult else '?'}" + ("" if ult and ult[-1] == "0" else "  <-- BAZA STRICATĂ " + p.stdout[-300:] + p.stderr[-300:])))
        shutil.rmtree(d.parent, ignore_errors=True)
        continue
    if vechi not in s:
        rez.append((nume, "NEAPLICAT (textul nu există)"))
        continue
    f.write_text(s.replace(vechi, nou, 1), encoding="utf-8")
    p = subprocess.run([sys.executable, str(d / "teste" / "ruleaza_teste.py")], capture_output=True, text=True, encoding="utf-8")
    ult = [x for x in p.stdout.splitlines() if x.strip()]
    picate = ult[-1] if ult else "?"
    rez.append((nume, f"picate={picate}" + ("  <-- MUTANT SUPRAVIEȚUITOR" if picate == "0" else "")))
    shutil.rmtree(d.parent, ignore_errors=True)
for n, r in rez:
    print(f"{n}: {r}")
shutil.rmtree(BAZA, ignore_errors=True)
supr = sum(1 for _, r in rez if "SUPRAVIE" in r or "NEAPLICAT" in r or "STRICATĂ" in r)
print(f"mutanți: {len(rez) - 1}")
print(f"prinși: {len(rez) - 1 - supr}")
print(supr)
