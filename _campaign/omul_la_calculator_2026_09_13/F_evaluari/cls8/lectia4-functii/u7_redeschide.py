"""U7 - redeschid artefactele intr-un proces Python NOU: formula din fisier + valoarea recalculata de LibreOffice,
plus textul AFISAT din PDF-urile randate (ce vede ochiul pe Windows ro-RO). Iesire: 07_redeschis.json. Tipareste <= 20 randuri."""
import json
from pathlib import Path

import fitz
import openpyxl

L = Path(__file__).resolve().parent
CEL = {
    "incearca_note.xlsx": ["Incearca!E2", "Incearca!E3", "Incearca!E4", "Incearca!E5", "Incearca!E6", "Incearca!G2", "Incearca!G4",
                           "Pas6_B4_3!E2", "Pas6_B4_3!E3", "Pas6_B4_3!E4", "Pas6_nota10_3!E2", "Pas6_nota10_3!E3", "Pas6_nota10_3!E4",
                           "Bonus_sters!E5", "Bonus_sters!E6", "Lipire!E2", "Lipire!E3", "Lipire!E4", "Lipire!E5", "Lipire!E6"],
    "atomi_note.xlsx": ["Atom3_4!E1", "Atom3_4!E2", "Atom3_4!E3", "Atom4_B9_gol!E1", "Atom5_count!C1", "Atom5_count!C2",
                        "Atom5_count!F1", "Atom5_count!F2", "Intrebari!E1", "Intrebari!E2", "Atom7_tabel!E1", "Atom7_tabel!E4",
                        "Atom7_tabel!E7", "Atom8_B7_la_10!E1", "Atom8_B7_la_10!E3", "Atom8_nota4_la_10!E1", "Atom8_nota4_la_10!E3",
                        "Atom9_IF!C2", "Atom9_IF!C3", "Atom9_IF!C4", "Atom9_IF!D2", "Atom9_IF!B10", "Atom9_IF!B11",
                        "Provocare!C2", "Provocare!F2"],
    "ex1_note.xlsx": ["Initial!D2", "Initial!D3", "Initial!D4", "Initial!D5", "Initial!D6", "Dan10!D2", "Dan10!D3", "Dan10!D4",
                      "Dan10!D5", "Dan10!D6"],
    "ex2_meteo.xlsx": ["Meteo!E2", "Meteo!E3", "Meteo!E4", "Meteo!F2", "Meteo!F3", "Meteo!F4", "Meteo!E5", "Meteo!H4"],
    "ex3_count.xlsx": ["Ex3!C1", "Ex3!C2", "Ex3!C3", "Ex3!C4", "Ex3!C5"],
}
r = {}
for nume, cel in CEL.items():
    f = openpyxl.load_workbook(L / "produs_elev" / nume)
    v = openpyxl.load_workbook(L / "recalculat" / nume, data_only=True)
    r[nume] = {}
    for c in cel:
        ws, a = c.split("!")
        r[nume][c] = {"in_fisier": f[ws][a].value, "valoare_LibreOffice": v[ws][a].value}
pdfs = {}
for p in sorted((L / "randat_xlsx").glob("*.pdf")):
    d = fitz.open(p)
    pdfs[p.name] = " | ".join(pg.get_text().replace("\n", " ; ") for pg in d)[:900]
r["text_afisat_in_pdf_LibreOffice"] = pdfs
(L / "07_redeschis.json").write_text(json.dumps(r, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
for k, x in r.items():
    if k.endswith(".xlsx"):
        print(k, "; ".join(f"{c}={y['valoare_LibreOffice']}" for c, y in x.items())[:700])
for k, t in pdfs.items():
    print(k, t[:250])
