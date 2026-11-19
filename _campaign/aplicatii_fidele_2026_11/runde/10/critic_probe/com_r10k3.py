# -*- coding: utf-8 -*-
"""Critic r10: Excel real INVIZIBIL (DispatchEx, instanta noua, Visible=False, DisplayAlerts=False), registru nou NESALVAT.
Varsarea si tastele: End (Ctrl+sageti) peste celulele varsate, CurrentRegion, Copy D3 -> F3, SUM peste ele. Inchid doar PID-ul meu."""
import json, time, os, subprocess
import pythoncom, win32com.client, win32process
OUT = "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/10/critic_probe/com_r10k3.json"
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
    pune(); ws.Range("D2").Formula2 = "=SUM(B2:B7)*B2:B6"
    r["D2_D7"] = txt("D", (2, 8))
    r["D2_End_xlDown"] = ws.Range("D2").End(-4121).Address
    r["D7_End_xlUp"] = ws.Range("D7").End(-4162).Address
    r["D3_CurrentRegion"] = ws.Range("D3").CurrentRegion.Address
    r["D3_HasSpill"] = bool(ws.Range("D3").HasSpill); r["D3_SpillParent"] = ws.Range("D3").SpillParent.Address
    ws.Range("D3").Copy(ws.Range("F3"))
    r["F3_dupa_copy_D3"] = [ws.Range("F3").Formula2, ws.Range("F3").Text, ws.Range("F4").Text]
    ws.Range("D8").Formula2 = "=SUM(D2:D6)"; r["D8_sum"] = ws.Range("D8").Text
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
