"""U7 - redeschid artefactele intr-un proces Python nou: tipul graficului si seria din produs_elev (openpyxl citeste
graficele din xml-ul fisierului), valorile calculate din recalculat/ (LibreOffice) si textul din PDF-urile randate.
Iesire: 07_redeschis.json; tipareste <= 20 de randuri."""
import json
import zipfile
import re
from pathlib import Path

import fitz
import openpyxl

L = Path(__file__).resolve().parent
out = {}
for f in sorted((L / "produs_elev").glob("*.xlsx")):
    z = zipfile.ZipFile(f)
    charts = [n for n in z.namelist() if n.startswith("xl/charts/chart")]
    tipuri, serii = [], []
    for c in charts:
        x = z.read(c).decode("utf-8")
        tipuri += re.findall(r"<(?:c:)?(barChart|bar3DChart|lineChart|pieChart)>", x)
        tipuri += re.findall(r"<(?:c:)?barDir val=\"(col|bar)\"", x)
        serii += re.findall(r"<(?:c:)?f>([^<]+)</(?:c:)?f>", x)
    rec = L / "recalculat" / f.name
    wbv = openpyxl.load_workbook(rec, data_only=True)
    ws = wbv.active
    calc = {c.coordinate: c.value for row in ws.iter_rows() for c in row
            if isinstance(openpyxl.load_workbook(f)[ws.title][c.coordinate].value, str)
            and str(openpyxl.load_workbook(f)[ws.title][c.coordinate].value).startswith("=")}
    pdf = L / "randat_xlsx" / (f.stem + ".pdf")
    txt = fitz.open(str(pdf))[0].get_text().split("\n") if pdf.is_file() else []
    out[f.name] = {"grafice": len(charts), "tipuri": tipuri, "referinte_serii": serii[:6],
                   "B2_in_recalculat": ws["B2"].value, "formule_calculate": calc,
                   "pdf_are_titlul": any("Notele clasei" in t or "Bugetul" in t or "Numarul" in t or "Romana si" in t for t in txt),
                   "pdf_primele_randuri": txt[:6]}
(L / "07_redeschis.json").write_text(json.dumps(out, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
for k, v in out.items():
    print(k, v["tipuri"], "B2=", v["B2_in_recalculat"], {a: round(b, 3) if isinstance(b, float) else b for a, b in v["formule_calculate"].items()})
