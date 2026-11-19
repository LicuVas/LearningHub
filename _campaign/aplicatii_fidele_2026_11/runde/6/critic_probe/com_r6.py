# -*- coding: utf-8 -*-
"""Criticul runda 6: Excel REAL, instanta NOUA si invizibila (DispatchEx), doar citiri de afisare (Range.Text) + un PDF in %TEMP%.
Inchide doar PID-ul propriu. Iesire: com_r6.json (fara cai de utilizator)."""
import json, os, time, uuid, shutil, subprocess
import pythoncom, win32com.client, win32process
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "com_r6.json")
tmp = os.path.join(os.environ["TEMP"], "lh_critic_r6_" + uuid.uuid4().hex[:8]); os.makedirs(tmp)
pythoncom.CoInitialize()
xl = win32com.client.DispatchEx("Excel.Application")
xl.Visible = False; xl.DisplayAlerts = False; xl.ScreenUpdating = False
pid = win32process.GetWindowThreadProcessId(xl.Hwnd)[1]
rez = {"pid_propriu": True, "versiune": xl.Version, "build": xl.Build, "cazuri": {}}
try:
    wb = xl.Workbooks.Add(); ws = wb.Worksheets(1)
    rez["font_implicit"] = [wb.Styles("Normal").Font.Name, wb.Styles("Normal").Font.Size]
    rez["latime_std"] = ws.StandardWidth
    cazuri = [("A6","7,5"),("A7","7.5"),("A8","12.03.2026"),("A9","=1/3"),("A10","=25/3"),("A11","123456789012"),("A12","=1/0"),("A13","=SUMA(A2)"),
              ("A14","Elevii clasei a VIII-a B"),("A15","1234567890"),("A16","=123456789*1000"),("A17","TRUE"),("A19","-3,25"),("A20","=2/3*100"),("A24","3,0")]
    for a, t in cazuri:
        r = ws.Range(a); r.FormulaLocal = t
    for a, t in cazuri:
        r = ws.Range(a)
        rez["cazuri"][a] = {"tastat": t, "Text": r.Text, "Value2": r.Value2 if not isinstance(r.Value2, int) or abs(r.Value2) < 2**31 else str(r.Value2),
                            "latime_coloana": r.ColumnWidth, "NumberFormatLocal": r.NumberFormatLocal, "FormulaLocal": r.FormulaLocal}
    # coloana îngustă: număr și dată (lecția m1-l06: „75,5 poate apărea 76”; „datele se văd ca ####”)
    ws.Range("C1").ColumnWidth = 3.5
    for a, t in [("C2","75,5"),("C3","12.03.2026"),("C4","=25/3"),("C5","1234")]:
        ws.Range(a).FormulaLocal = t
        rez["cazuri"][a + "_ingust"] = {"tastat": t, "Text": ws.Range(a).Text, "latime_coloana": ws.Range(a).ColumnWidth}
    # textul lung cu vecina goală / plină, pentru PDF
    ws.Range("E2").Value = "Situatia notelor la informatica"; ws.Range("E3").Value = "Situatia notelor la informatica"; ws.Range("F3").Value = "x"
    pdf = os.path.join(tmp, "r6.pdf")
    ws.PageSetup.PrintGridlines = True
    ws.Range("A1:H24").ExportAsFixedFormat(0, pdf)
    import fitz
    d = fitz.open(pdf); pg = d[0]; pix = pg.get_pixmap(dpi=110)
    pix.save(os.path.join(os.path.dirname(OUT), "com_r6_pdf.png"))
    rez["pdf_text_E"] = [b[4].strip() for b in pg.get_text("blocks") if "Situatia" in b[4]]
    d.close()
    wb.Close(False)
finally:
    try: xl.Quit()
    except Exception as e: rez["quit_err"] = str(e)
    xl = None; pythoncom.CoUninitialize()
    for _ in range(30):
        r = subprocess.run(["tasklist", "/FI", "PID eq %d" % pid, "/NH"], capture_output=True, text=True)
        if str(pid) not in r.stdout: break
        time.sleep(0.5)
    else:
        subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True); rez["oprit_fortat"] = True
    shutil.rmtree(tmp, ignore_errors=True)
json.dump(rez, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps(rez, ensure_ascii=False)[:3000])
