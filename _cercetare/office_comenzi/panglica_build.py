"""panglica_build.py — panglica unei aplicații Office, ca DATE, din două surse fără nimic inventat (26.09.2026).

  1. dump_<app>_uia.json  (dump_panglica_uia.py, pe aplicația INSTALATĂ): filele, grupurile și butoanele cu
     eticheta afișată și dreptunghiul real → aspectul și proporțiile.
  2. listele oficiale Microsoft (OfficeDev/office-fluent-ui-command-identifiers, MIT), `M365_SAEC/<app>controls.xlsx`:
     tipul oficial al controlului (toggleButton, splitButton, gallery, menu, dialogBoxLauncher) și grupul oficial.

Regula: un buton intră în panglică NUMAI dacă e în dump (există în aplicație). Lista oficială doar îl descrie.
Săgețile „More Options” (`<id>_Dropdown`) nu sunt butoane separate: devin `split:true` pe butonul lor.
Ieșire: jocuri/_motor/panglica-<app>.json.  Ultima linie: numărul de butoane fără sursă (trebuie 0).

  python _cercetare/office_comenzi/panglica_build.py excel
"""
import collections
import json
import sys
from pathlib import Path

import openpyxl

AICI = Path(__file__).resolve().parent
RAD = AICI.parents[1]
app = sys.argv[1] if len(sys.argv) > 1 else "excel"
dump = json.loads((AICI / f"dump_{app}_uia.json").read_text(encoding="utf-8"))
rows = list(openpyxl.load_workbook(AICI / "M365_SAEC" / f"{app}controls.xlsx", read_only=True).active.iter_rows(values_only=True))[1:]
oficial: dict[str, list] = collections.defaultdict(list)
for r in rows:
    if r[0]:
        oficial[r[0]].append({"tip": r[1], "fila": r[3], "grup": r[4]})

NU_GRUP = {"Quick Access Toolbar", "Add-ins"}          # bara de acces rapid și suplimentele instalate nu sunt ale filei
fara_sursa = 0
file_ = []
for f in dump["file"]:
    grupuri_uia = [g for g in f["grupuri"] if g["eticheta"] not in NU_GRUP and g["eticheta"] != f["eticheta"]
                   and g["rect"][2] < 800]
    etichete_ok = {g["eticheta"] for g in grupuri_uia}
    baza = {c["id"]: c for c in f["controale"] if not c["id"].endswith("_Dropdown")}
    grupuri = []
    for g in grupuri_uia:
        gx, gy = g["rect"][0], g["rect"][1]
        butoane, id_grupuri = [], collections.Counter()
        for c in f["controale"]:
            if c["grup"] != g["eticheta"] or c["id"].endswith("_Dropdown"):
                continue
            of = next((o for o in oficial.get(c["id"], []) if o["fila"] == f["id"]), None) or \
                 (oficial.get(c["id"]) or [None])[0]
            if of and of["fila"] == f["id"] and of["grup"]:
                id_grupuri[of["grup"]] += 1
            dd = [d for d in f["controale"] if d["grup"] == g["eticheta"] and d["id"].endswith("_Dropdown")
                  and (d["id"][:-9] == c["id"]
                       # săgeata SUB buton (Paste, Insert) …
                       or (d["rect"][0] >= c["rect"][0] - 2 and d["rect"][0] + d["rect"][2] <= c["rect"][0] + c["rect"][2] + 20
                           and abs(d["rect"][1] - (c["rect"][1] + c["rect"][3])) <= 4)
                       # … sau lipită în DREAPTA lui, pe același rând (Underline, Borders, Merge & Center)
                       or (abs(d["rect"][0] - (c["rect"][0] + c["rect"][2])) <= 4 and abs(d["rect"][1] - c["rect"][1]) <= 4))]
            lansator = bool(of and "dialogBoxLauncher" in (of["tip"] or "")) or (c["rect"][2] <= 22 and c["rect"][3] <= 22)
            h = c["rect"][3] + sum(d["rect"][3] for d in dd if d["rect"][1] > c["rect"][1])
            butoane.append({
                "id": c["id"], "eticheta": c["eticheta"], "tip_uia": c["tip"],
                "tip_oficial": of["tip"] if of else None,
                "split": bool(dd) or c["tip"] == "SplitButton",
                "meniu": c["tip"] == "MenuItem" and not dd,
                "lansator": lansator,
                "marime": "lansator" if lansator else ("mare" if h >= 80 else "mic"),
                "rect": [c["rect"][0] - gx, c["rect"][1] - gy, c["rect"][2], h],
            })
            if c["id"] not in baza:
                fara_sursa += 1
        if not id_grupuri:
            continue   # grup fără niciun buton din lista oficială a filei = supliment instalat (ex. „Claude”), nu Excel standard
        grupuri.append({"eticheta": g["eticheta"], "id_oficial": id_grupuri.most_common(1)[0][0],
                        "latime": g["rect"][2], "inaltime": g["rect"][3], "butoane": butoane})
    file_.append({"id": f["id"], "eticheta": f["eticheta"], "grupuri": grupuri})

out = RAD / "jocuri" / "_motor" / f"panglica-{app}.json"
out.write_text(json.dumps({
    "_despre": f"GENERAT de _cercetare/office_comenzi/panglica_build.py {app} - nu edita de mână. Surse: {dump['exe']} "
               f"(dump UI Automation {dump['generat']}, pe PC-ul profesorului) + lista oficială Microsoft M365 SAEC (MIT). "
               "Etichetele sunt cele afișate de aplicația instalată (engleză, ca în laborator); rect = poziția reală în grup, în pixeli.",
    "aplicatie": app, "file": file_}, ensure_ascii=False, indent=1), encoding="utf-8")
n = sum(len(g["butoane"]) for f in file_ for g in f["grupuri"])
print(f"{out.relative_to(RAD)}: {len(file_)} file, {sum(len(f['grupuri']) for f in file_)} grupuri, {n} butoane")
for f in file_:
    print(f"  {f['eticheta']}: " + " · ".join(f"{g['eticheta']} ({len(g['butoane'])})" for g in f["grupuri"]))
print(f"butoane fără sursă în aplicație: {fara_sursa}")
print(fara_sursa)
