"""U1 - fac sarcinile lectiei cls8/lectia1-interfata ca elevul, in fisiere .xlsx (openpyxl).
Formulele sunt in forma de FISIER (engleza, virgula). Copierea in jos = Translator, ca in Excel.
Iesire: produs_elev/*.xlsx + u1_iesire.json; tipareste <= 20 de randuri."""
import json
from pathlib import Path

import openpyxl
from openpyxl.formula.translate import Translator
from openpyxl.utils import get_column_letter

L = Path(__file__).resolve().parent
P = L / "produs_elev"
P.mkdir(exist_ok=True)
out = {}

# --- „Incearca" (misiunea de 5 minute): catalog 5 elevi x 3 note, foaia redenumita „Catalog"
wb = openpyxl.Workbook()
ws = wb.active
out["incearca_foaie_implicita_openpyxl"] = ws.title  # openpyxl numeste „Sheet"; Excel ro-ro: „Foaie1"
ws.title = "Catalog"
date = [("Nume", "Nota1", "Nota2", "Nota3"), ("Ion", 9, 7, 10), ("Ana", 8, 10, 9), ("Mihai", 7, 6, 8),
        ("Elena", 10, 9, 10), ("Alex", 6, 8, 7)]
for r, row in enumerate(date, 1):
    for c, v in enumerate(row, 1):
        ws.cell(r, c, v)
# verificari luate din lectie: =SUM(B2:B6) (atomul 4) si =AVERAGE(B2:D2) -> 8.67 (intrebarea atomului 6)
ws["E1"] = "Media"
ws["E2"] = "=AVERAGE(B2:D2)"
for r in range(3, 7):
    ws[f"E{r}"] = Translator(ws["E2"].value, origin="E2").translate_formula(f"E{r}")
ws["A7"] = "Suma Nota1"
ws["B7"] = "=SUM(B2:B6)"
ws["G1"] = "Celule in B2:D6"
ws["G2"] = "=ROWS(B2:D6)*COLUMNS(B2:D6)"
ws["G3"] = "=COUNT(B2:D6)"
out["incearca_formule_copiate"] = {f"E{r}": ws[f"E{r}"].value for r in range(2, 7)}
out["incearca_dimensiune_folosita"] = ws.calculate_dimension()
wb.save(P / "incearca_catalog.xlsx")

# --- Exercitiul 1: catalog ghidat 3 elevi x 2 note
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Catalog"
ex1 = [("Nume", "Nota Matematica", "Nota Romana"), ("Ion", 8, 9), ("Ana", 10, 7), ("Mihai", 6, 8)]
for r, row in enumerate(ex1, 1):
    for c, v in enumerate(row, 1):
        ws.cell(r, c, v)
# Pas 4: prima / ultima celula cu note - calculat din foaie, nu din „Raspuns asteptat"
note = [c.coordinate for row in ws.iter_rows(min_row=2) for c in row if isinstance(c.value, (int, float))]
out["ex1_prima_celula_nota"] = note[0]
out["ex1_ultima_celula_nota"] = note[-1]
out["ex1_dimensiune_folosita (Ctrl+End = coltul dreapta-jos)"] = ws.calculate_dimension()
# verificare proprie pe a doua cale (nu cerute de lectie): media fiecarui elev + total
ws["D1"] = "Media"
ws["D2"] = "=AVERAGE(B2:C2)"
for r in (3, 4):
    ws[f"D{r}"] = Translator(ws["D2"].value, origin="D2").translate_formula(f"D{r}")
ws["B5"] = "=SUM(B2:B4)"
ws["C5"] = "=SUM(C2:C4)"
wb.save(P / "ex1_catalog.xlsx")

# --- Exercitiul 2: navigare si foi
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Navigare"
ws["M25"] = "Am ajuns aici!"
t = wb.create_sheet("Test")
for i, n in enumerate(["Maria", "Andrei", "Ioana"], 1):
    t[f"A{i}"] = n
t["C1"] = "Nr. colegi"
t["C2"] = '=COUNTA(A1:A3)'
out["ex2_foi"] = wb.sheetnames
out["ex2_Ctrl+End_pe_Navigare"] = ws.calculate_dimension().split(":")[-1]
out["ex2_Ctrl+End_pe_Test (foaia activa la final)"] = "A3 (inainte de celula mea de verificare C1:C2)"
out["ex2_selectie_A1:E10_celule"] = 5 * 10
wb.save(P / "ex2_navigare.xlsx")

# --- Rezolvarea pliata a Ex.1, executata exact cum scrie (ca sa vad ce tabel descrie)
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Rezolvare_pliata_Ex1"
prod = [("Produs", "Cantitate", "Pret/buc", "Subtotal", "Total cu discount 10%"), ("Pizza", 5, 25), ("Sucuri", 10, 4),
        ("Chipsuri", 8, 6), ("Baloane", 20, 1), ("Muzica", 1, 50)]
for r, row in enumerate(prod, 1):
    for c, v in enumerate(row, 1):
        ws.cell(r, c, v)
ws["D2"] = "=B2*C2"
ws["E2"] = "=B2*C2*(1-10/100)"
for r in range(3, 7):
    ws[f"D{r}"] = Translator(ws["D2"].value, origin="D2").translate_formula(f"D{r}")
    ws[f"E{r}"] = Translator(ws["E2"].value, origin="E2").translate_formula(f"E{r}")
ws["E7"] = "=SUM(E2:E6)"
ws["D7"] = "=SUM(D2:D6)"
wb.save(P / "rezolvare_pliata_ex1.xlsx")

# --- a doua cale in Python (fara Excel/LibreOffice)
out["py_medie_Ion"] = round((9 + 7 + 10) / 3, 2)
out["py_medii_catalog"] = [round(sum(r[1:]) / 3, 2) for r in date[1:]]
out["py_suma_Nota1"] = sum(r[1] for r in date[1:])
out["py_celule_B2:D6"] = len("BCD") * len(range(2, 7))
out["py_rezolvare_ex1_E7"] = round(sum(q * p for _, q, p in prod[1:]) * 0.9, 2)
out["py_ultima_coloana_16384"] = get_column_letter(16384)
(L / "u1_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in list(out.items())[:20]:
    print(k, "=", v)
