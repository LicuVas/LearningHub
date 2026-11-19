# -*- coding: utf-8 -*-
"""Critic r10: Excel real INVIZIBIL (DispatchEx, instanta noua, Visible=False, DisplayAlerts=False), registru nou NESALVAT.
Ctrl+sageti = Range.End (xlDown -4121, xlToRight -4161) dupa blocul de date. Inchid doar PID-ul meu."""
import json, time, os, subprocess
import pythoncom, win32com.client, win32process
OUT = "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/10/critic_probe/com_r10k2.json"
r = {"metoda": "DispatchEx, Visible=False, DisplayAlerts=False, Workbooks.Add() nesalvat; Formula2 = ce tasteaza omul in 365"}
pythoncom.CoInitialize()
xl = win32com.client.DispatchEx("Excel.Application")
pid = None
try:
    xl.Visible = False; xl.DisplayAlerts = False; xl.ScreenUpdating = False
    pid = win32process.GetWindowThreadProcessId(xl.Hwnd)[1]
    r["versiune"] = "%s %s" % (xl.Version, xl.Build)
    wb = xl.Workbooks.Add(); ws = wb.Worksheets(1)
    def pune():
        ws.Cells.Clear()
        for i, v in enumerate([9, 7, 8, 10, 6, 8]): ws.Range("B%d" % (i + 2)).Value = v
    def txt(a, b): return [ws.Range("%s%d" % (a, i)).Text for i in range(b[0], b[1])]
    pune()
    for c in "ABC":
        for i in range(1, 8): ws.Range("%s%d" % (c, i)).Value = i
    r["A1_xlDown"] = ws.Range("A1").End(-4121).Address
    r["A7_xlDown"] = ws.Range("A7").End(-4121).Address
    r["C7_xlToRight"] = ws.Range("C7").End(-4161).Address
    r["A7_xlDown_apoi_xlUp"] = ws.Range(ws.Range("A7").End(-4121).Address).End(-4162).Address
    wb.Close(False)
except Exception as e:
    r["eroare"] = repr(e)
finally:
    try: xl.Quit()
    except Exception as e: r["quit_eroare"] = repr(e)
    xl = None
    pythoncom.CoUninitialize()
    time.sleep(3)
    viu = pid and str(pid) in subprocess.run(["tasklist", "/FI", "PID eq %d" % pid, "/NH"], capture_output=True, text=True).stdout
    r["pid_ramas_dupa_quit"] = bool(viu)
    if viu:
        subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True); r["oprire_fortata_pid_meu"] = True
    json.dump(r, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps(r, ensure_ascii=False))
