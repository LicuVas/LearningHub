"""Proba: formulele lectiei cls8/m2/lectia1, TASTATE ca de elev (FormulaLocal = setarile regionale ale PC-ului),
in Excel-ul real, instanta separata si invizibila. Nu salveaza nimic."""
import sys
import win32com.client
import pywintypes

for s in (sys.stdout,):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

ERORI = {-2146826281: "#DIV/0!", -2146826246: "#N/A", -2146826259: "#NAME?", -2146826288: "#NULL!",
         -2146826252: "#NUM!", -2146826265: "#REF!", -2146826273: "#VALUE!"}

xl = win32com.client.DispatchEx("Excel.Application")
xl.Visible = False
xl.DisplayAlerts = False


def arata(c):
    v = c.Value
    if isinstance(v, int) and v in ERORI:
        return f"EROARE {ERORI[v]}"
    return f"{type(v).__name__} {v!r} | afisat: {c.Text!r}"


def scenariu(nume, celule, formula_cel):
    wb = xl.Workbooks.Add()
    sh = wb.Worksheets(1)
    out = []
    try:
        for a, tastat in celule.items():
            try:
                sh.Range(a).FormulaLocal = tastat
            except pywintypes.com_error:
                out.append(f"  {a} <- {tastat!r}: REFUZAT de Excel (ar aparea fereastra de eroare)")
                continue
        for a in formula_cel:
            out.append(f"  {a} {sh.Range(a).FormulaLocal!r} -> {arata(sh.Range(a))}")
    finally:
        wb.Close(False)
    print(nume)
    print("\n".join(out))


try:
    intl = xl.International
    print(f"Excel {xl.Version}; separator lista {intl[4]!r}; zecimal {intl[2]!r}")
    # 1. cum a facut Vasile: denumiri pe randul 1, numere pe randul 2, formulele lectiei pe randul 1
    scenariu("#1 denumiri pe randul 1, numere pe randul 2", {
        "A1": "Cantitate", "B1": "Pret unitar", "C1": "Discount (%)", "D1": "TVA (%)",
        "A2": "5", "B2": "120", "C2": "10", "D2": "19",
        "E1": "=A1*B1", "F1": "=A1*B1*(1-C1/100)", "G1": "=A1*B1*(1-C1/100)*(1+D1/100)"}, ["E1", "F1", "G1"])
    # 1b. literal: 'A1 = Cantitate: 5'
    scenariu("#1b literal 'Cantitate: 5' in A1", {"A1": "Cantitate: 5", "B1": "Pret unitar: 120", "E1": "=A1*B1"}, ["A1", "E1"])
    # 2. cum trebuie: numere in A1:D1 -> ce AFISEAZA Excel pentru G1
    scenariu("#2 afisarea rezultatului (numere in A1:D1)", {
        "A1": "5", "B1": "120", "C1": "10", "D1": "19",
        "G1": "=A1*B1*(1-C1/100)*(1+D1/100)", "H1": "642.6", "H2": "642,6"}, ["G1", "H1", "H2"])
    # 2b. IF cu virgule, cum scrie lectia
    scenariu("#2b IF scris cu virgule / cu punct si virgula", {
        "A1": "10", "B1": "0",
        "C1": "=IF(B1=0, 0, A1/B1)", "C2": "=IF(B1=0; 0; A1/B1)", "C3": '=IF(B1=0, "N/A", A1/B1)'}, ["C1", "C2", "C3"])
    # 4. mini-factura: formula 'protejata' fara nicio impartire
    scenariu("#4 cantitatea 0 in formula fara impartire", {
        "B2": "0", "C2": "25", "D2": "10", "E2": "=B2*C2*(1-D2/100)"}, ["E2"])
    # 5. exercitiul 2, formula cu formula
    scenariu("#5 exercitiul 2", {
        "A1": "100", "B1": "text", "C1": "3",
        "D1": "=(A1+B1*C1", "D2": "=SUMM(A1:A10)", "D3": "=A1+B1", "D4": "=A1+C1*2",
        "E1": "5", "E2": "0", "E3": "=E1/E2"}, ["D1", "D2", "D3", "D4", "E3"])
finally:
    xl.Quit()
