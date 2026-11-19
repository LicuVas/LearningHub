# -*- coding: utf-8 -*-
"""Critic r9: Excel real, instanta NOUA si invizibila (DispatchEx, Visible=False, DisplayAlerts=False), fara fisier salvat.
Graficul implicit (AddChart2 201 = stilul implicit, xlColumnClustered) pe tabelele lectiei m2-l11: titlul, legenda, seriile,
categoriile, axa valorilor, marimea si locul; Switch Row/Column (PlotBy); Pie / Line. Inchid doar PID-ul meu."""
import json, os, time, subprocess
import pythoncom, win32com.client, win32process
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "com_r9.json")
out = {"erori": []}
pythoncom.CoInitialize()
xl = win32com.client.DispatchEx("Excel.Application")
xl.Visible = False; xl.DisplayAlerts = False; xl.ScreenUpdating = True
pid = win32process.GetWindowThreadProcessId(xl.Hwnd)[1]
out["pid_ok"] = bool(pid); out["versiune"] = xl.Version + " " + str(xl.Build)
def info(ch, shp):
    d = {"tip": ch.ChartType, "HasTitle": ch.HasTitle, "titlu": ch.ChartTitle.Text if ch.HasTitle else None, "HasLegend": ch.HasLegend,
         "legenda_pozitie": ch.Legend.Position if ch.HasLegend else None, "PlotBy": ch.PlotBy,
         "serii": [ch.SeriesCollection(i).Name for i in range(1, ch.SeriesCollection().Count + 1)],
         "categorii": [str(x) for x in (ch.SeriesCollection(1).XValues or [])],
         "w_pt": shp.Width, "h_pt": shp.Height, "left_pt": shp.Left, "top_pt": shp.Top, "TopLeftCell": shp.TopLeftCell.Address, "nume": shp.Name}
    try:
        ax = ch.Axes(2); d["axa"] = [ax.MinimumScale, ax.MaximumScale, ax.MajorUnit]
    except Exception as e: d["axa"] = "n/a"
    return d
try:
    wb = xl.Workbooks.Add(); ws = wb.Worksheets(1)
    out["fereastra"] = {"UsableWidth": xl.UsableWidth, "UsableHeight": xl.UsableHeight, "VisibleRange": xl.ActiveWindow.VisibleRange.Address}
    CARTI = [["Elev", "Cărți citite"], ["Ana", 6], ["Bogdan", 4], ["Carla", 9], ["Dan", 3], ["Elena", 7]]
    for i, r in enumerate(CARTI):
        for j, v in enumerate(r): ws.Cells(i + 1, j + 1).Value = v
    ws.Range("A1:B6").Select()
    shp = ws.Shapes.AddChart2(201, 51); ch = shp.Chart
    out["carti"] = info(ch, shp)
    ws.Range("B4").Value = 20; time.sleep(0.3); out["carti_b4_20_axa"] = info(ch, shp)["axa"]
    ch.ChartType = 5; out["carti_pie"] = info(ch, shp)
    ch.ChartType = 4; out["carti_line"] = info(ch, shp)
    shp.Delete()
    # o singura celula aleasa -> zona curenta
    ws.Range("A1").Select(); shp = ws.Shapes.AddChart2(201, 51); out["carti_din_A1"] = info(shp.Chart, shp); shp.Delete()
    # LUNI pe alta foaie
    ws2 = wb.Worksheets.Add()
    LUNI = [["Luna", "8A", "8B"], ["septembrie", 12, 9], ["octombrie", 18, 14], ["noiembrie", 25, 20], ["decembrie", 15, 22]]
    for i, r in enumerate(LUNI):
        for j, v in enumerate(r): ws2.Cells(i + 1, j + 1).Value = v
    ws2.Range("A1:C5").Select(); shp = ws2.Shapes.AddChart2(201, 51); ch = shp.Chart
    out["luni"] = info(ch, shp)
    ch.PlotBy = 1 if ch.PlotBy == 2 else 2; out["luni_switch"] = info(ch, shp)
    wb.Saved = True
except Exception as e:
    out["erori"].append(repr(e))
finally:
    try:
        for w in list(xl.Workbooks): w.Saved = True; w.Close(False)
    except Exception as e: out["erori"].append("close " + repr(e))
    try: xl.Quit()
    except Exception as e: out["erori"].append("quit " + repr(e))
    del xl
    pythoncom.CoUninitialize()
    time.sleep(3)
    viu = subprocess.run(["tasklist", "/FI", "PID eq %d" % pid], capture_output=True, text=True).stdout
    out["pid_ramas_dupa_quit"] = ("EXCEL.EXE" in viu.upper())
    if out["pid_ramas_dupa_quit"]:
        time.sleep(10)
        viu = subprocess.run(["tasklist", "/FI", "PID eq %d" % pid], capture_output=True, text=True).stdout
        if "EXCEL.EXE" in viu.upper():
            subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True); out["oprit_fortat"] = True
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1, default=str)
