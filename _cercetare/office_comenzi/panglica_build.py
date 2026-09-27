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
    toate = [g for g in f["grupuri"] if g["eticheta"] not in NU_GRUP and g["eticheta"] != f["eticheta"]]

    def contine(a, b):   # a conține complet b (și nu e același dreptunghi)
        return a is not b and a["rect"][0] <= b["rect"][0] and a["rect"][1] <= b["rect"][1] and \
            a["rect"][0] + a["rect"][2] >= b["rect"][0] + b["rect"][2] and a["rect"][1] + a["rect"][3] >= b["rect"][1] + b["rect"][3]
    # un grup cuprins COMPLET în altul e doar un container (galeria „Transition Effects” din „Transition to This Slide”,
    # „Styles” interior din „Styles”): conținutul lui trece la grupul vizibil, cel cu numele scris dedesubt
    parinte = {}
    for g in toate:
        cand = [h for h in toate if contine(h, g)]
        if cand:
            parinte[id(g)] = min(cand, key=lambda h: h["rect"][2] * h["rect"][3])
    grupuri_uia = [g for g in toate if id(g) not in parinte]
    redenumire = {}
    for g in toate:
        p = g
        while id(p) in parinte:
            p = parinte[id(p)]
        if p is not g:
            redenumire[g["eticheta"]] = p["eticheta"]
    for c in f["controale"] + f.get("galerie", []):
        if c.get("grup") in redenumire and not any(x["eticheta"] == c["grup"] for x in grupuri_uia):
            c["grup"] = redenumire[c["grup"]]
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
        # GALERIILE (27.09.2026): tranzițiile, animațiile, stilurile, temele — elementele au nume, nu id; fiecare
        # devine o „dală” la poziția ei reală din grup (sursa = aplicația; lista oficială nu le enumeră)
        # doar dalele VIZIBILE în panglică: rândurile ascunse ale galeriei (derulate) au dreptunghiul sub grup
        dale = [it for it in f.get("galerie", []) if it["grup"] == g["eticheta"]
                and it["rect"][1] + it["rect"][3] <= gy + g["rect"][3] - 8]
        vazute_d = set()
        for it in dale:
            if it["eticheta"] in vazute_d:
                continue
            vazute_d.add(it["eticheta"])
            butoane.append({"id": "galerie:" + it["eticheta"], "eticheta": it["eticheta"], "tip_uia": "ListItem",
                            "tip_oficial": "galleryItem", "split": False, "meniu": False, "lansator": False,
                            "galerie": True, "marime": "mare" if it["rect"][3] >= 80 else "mic",
                            "rect": [it["rect"][0] - gx, it["rect"][1] - gy, it["rect"][2], it["rect"][3]]})
        if not id_grupuri and not dale:
            continue   # grup fără niciun buton din lista oficială a filei și fără galerie = supliment instalat (ex. „Claude”)
        grupuri.append({"eticheta": g["eticheta"], "id_oficial": id_grupuri.most_common(1)[0][0] if id_grupuri else None,
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
