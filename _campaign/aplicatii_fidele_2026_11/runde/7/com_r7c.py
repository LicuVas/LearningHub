# -*- coding: utf-8 -*-
"""Runda 7 (continuare): dovezi din Excel REAL pentru X7 rest, X10 (sortarea pe niveluri) și X8 (Ctrl+N).
Excel doar prin win32com.client.DispatchEx (instanță NOUĂ), Visible=False, DisplayAlerts=False; nimic salvat pe disc;
la final Quit, apoi se închide DOAR PID-ul instanței noastre dacă n-a ieșit singură. Excel-ul omului nu e atins.
Ieșirea: com_r7c.json (lângă script). Mod: `model_obiect` (ExecuteMso + modelul obiect, nu gest pe ecran)."""
import json, os, subprocess, sys, time
import pythoncom, win32com.client, win32process

AICI = os.path.dirname(os.path.abspath(__file__))
R = {"mod": "model_obiect", "nota": "DispatchEx invizibil; ExecuteMso pe registrul activ; Range.Text = textul afișat"}

def sigur(nume, fn):
    try: R[nume] = fn()
    except Exception as e: R[nume] = {"eroare": repr(e)[:300]}

pythoncom.CoInitialize()
xl = win32com.client.DispatchEx("Excel.Application")
_, pid = win32process.GetWindowThreadProcessId(xl.Hwnd)
try:
    xl.Visible = False
    xl.DisplayAlerts = False
    R["versiune"] = xl.Version
    wb = xl.Workbooks.Add()
    R["registru_1"] = wb.Name
    ws = wb.Worksheets(1)
    ws.Activate()
    CB = xl.CommandBars
    GAL = ["BorderBottomNoToggle", "BorderTopNoToggle", "BorderLeftNoToggle", "BorderRightNoToggle", "BorderNone", "BordersAll",
           "BorderOutside", "BorderThickOutside", "BorderDoubleBottom", "BorderThickBottom", "BorderTopAndBottom",
           "BorderTopAndThickBottom", "BorderTopAndDoubleBottom", "BorderDrawLine", "BorderDrawGrid", "BorderErase",
           "BorderColorPickerExcel", "BorderStyle", "BordersMoreDialog", "BordersGallery", "CellFillColorPicker", "WrapText", "PercentStyle"]
    sigur("etichete", lambda: {k: CB.GetLabelMso(k) for k in GAL})

    def margini(rg):
        o = {}
        for c in rg.Cells:
            b = c.Borders
            o[c.Address.replace("$", "")] = {n: [b(i).LineStyle, b(i).Weight] for n, i in (("stanga", 7), ("sus", 8), ("jos", 9), ("dreapta", 10))}
        return o
    def exec_pe(adresa, mso):
        ws.Range(adresa).Select()
        CB.ExecuteMso(mso)
        return True

    # Borders › All Borders pe A1:C4
    ws.Range("A1:C4").Value = [["Elev", "Suma", "Cod"], ["Ana", 150, "001"], ["Bogdan", 75.5, "002"], ["Cristi", 120, "003"]]
    sigur("all_borders_exec", lambda: exec_pe("A1:C4", "BordersAll"))
    sigur("all_borders", lambda: margini(ws.Range("A1:C4")))
    # Bottom Border (butonul principal) pe E2:F3
    sigur("bottom_exec", lambda: exec_pe("E2:F3", "BorderBottomNoToggle"))
    sigur("bottom_border", lambda: margini(ws.Range("E2:F3")))
    # Outside Borders pe H2:I3
    sigur("outside_exec", lambda: exec_pe("H2:I3", "BorderOutside"))
    sigur("outside_border", lambda: margini(ws.Range("H2:I3")))
    # No Border pe A1:C4 (după All Borders)
    sigur("none_exec", lambda: exec_pe("B2:B3", "BorderNone"))
    sigur("none_border", lambda: margini(ws.Range("A1:C4")))

    # Percent Style pe C2:C4 (0,1 0,25 0,5) + 9 + 0,125
    ws2 = wb.Worksheets.Add(); ws2.Activate(); ws = ws2
    ws.Range("C2:C6").Value = [[0.1], [0.25], [0.5], [9], [0.125]]
    sigur("percent_exec", lambda: exec_pe("C2:C6", "PercentStyle"))
    sigur("percent", lambda: {c.Address.replace("$", ""): {"NumberFormat": c.NumberFormat, "Text": c.Text, "Value": c.Value} for c in ws.Range("C2:C6").Cells})

    # Fill Color (butonul principal: „Fill Color RGB(255, 255, 0)” în uia_excel.json)
    ws.Range("A1:C1").Value = [["Echipa", "Puncte", "Loc"]]
    sigur("fill_exec", lambda: exec_pe("A1:C1", "CellFillColorPicker"))
    sigur("fill", lambda: {c.Address.replace("$", ""): {"Color": c.Interior.Color, "ColorIndex": c.Interior.ColorIndex, "Pattern": c.Interior.Pattern} for c in ws.Range("A1:C1").Cells})

    # Wrap Text pe B2 cu observația lungă (lecția m1-l06:177)
    ws.Range("A1:B3").Value = [["Elev", "Observație"], ["Ana", "Plătește restul în octombrie, la dirigintă"], ["Bogdan", "Plătit"]]
    R["wrap_inainte"] = {"RowHeight2": ws.Rows(2).RowHeight, "ColumnWidthB": ws.Columns(2).ColumnWidth, "Width_pt_B": ws.Columns(2).Width, "StandardHeight": ws.StandardHeight}
    sigur("wrap_exec", lambda: exec_pe("B2", "WrapText"))
    sigur("wrap", lambda: {"WrapText": ws.Range("B2").WrapText, "RowHeight2": ws.Rows(2).RowHeight, "RowHeight3": ws.Rows(3).RowHeight, "Text": ws.Range("B2").Text,
                           "VerticalAlignment": ws.Range("B2").VerticalAlignment})
    sigur("wrap_din_nou_exec", lambda: exec_pe("B2", "WrapText"))
    sigur("wrap_din_nou", lambda: {"WrapText": ws.Range("B2").WrapText, "RowHeight2": ws.Rows(2).RowHeight})
    # alt text, altă lungime: câte rânduri
    ws.Range("D5").Value = "Situația notelor la informatică"
    sigur("wrap2_exec", lambda: exec_pe("D5", "WrapText"))
    sigur("wrap2", lambda: {"RowHeight5": ws.Rows(5).RowHeight, "WrapText": ws.Range("D5").WrapText})

    # Sortarea pe două niveluri (m2-l10: Clasa A to Z, apoi Punctaj Largest to Smallest), antet
    ws3 = wb.Worksheets.Add(); ws3.Activate(); ws = ws3
    date_ = [["Nume", "Clasa", "Punctaj"], ["Ana", "VIII B", 78], ["Bogdan", "VIII A", 95], ["Cristi", "VIII B", 95], ["Dan", "VIII A", 60],
             ["Elena", "VIII A", 88], ["Flavia", "VIII B", 60]]
    ws.Range("A1:C7").Value = date_
    def sort2():
        s = ws.Sort
        s.SortFields.Clear()
        s.SortFields.Add(ws.Range("B2:B7"), 0, 1)   # xlSortOnValues, xlAscending
        s.SortFields.Add(ws.Range("C2:C7"), 0, 2)   # xlDescending
        s.SetRange(ws.Range("A1:C7")); s.Header = 1; s.Apply()
        return [[c.Text for c in r.Cells] for r in ws.Range("A1:C7").Rows]
    sigur("sortare_doua_niveluri", sort2)

    # Ctrl+N: registrele noi și numele lor; după închiderea lui Book2, următorul
    def noi():
        o = []
        b2 = xl.Workbooks.Add(); o.append(b2.Name)
        b3 = xl.Workbooks.Add(); o.append(b3.Name)
        b3.Close(False)
        b4 = xl.Workbooks.Add(); o.append(b4.Name)
        o.append([w.Name for w in xl.Workbooks])
        return o
    sigur("registre_noi", noi)
    R["registre_noi_nota"] = "Workbooks.Add = comanda New (Ctrl+N) prin modelul obiect; închiderea cu Close(False) = fără salvare"
finally:
    try:
        for w in list(xl.Workbooks): w.Close(False)
    except Exception: pass
    try: xl.Quit()
    except Exception: pass
    del xl
    pythoncom.CoUninitialize()
    time.sleep(3)
    viu = subprocess.run(["tasklist", "/FI", "PID eq %d" % pid, "/NH"], capture_output=True, text=True).stdout
    if "EXCEL" in viu.upper():
        subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True)
        R["inchidere"] = "oprit PID-ul nostru"
    else:
        R["inchidere"] = "a ieșit singur"
json.dump(R, open(os.path.join(AICI, "com_r7c.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps({k: R[k] for k in R if k in ("versiune", "inchidere", "etichete")}, ensure_ascii=False)[:1500])
