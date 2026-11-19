# -*- coding: utf-8 -*-
"""Critic r10: Excel real INVIZIBIL (DispatchEx, instanta noua, Visible=False, DisplayAlerts=False), registru nou NESALVAT.
Varsarea: zona ocupata, scris peste o celula varsata, =B2:B6 simplu, =B2:B6*2. Inchid doar PID-ul meu."""
import json, time, os, subprocess
import pythoncom, win32com.client, win32process
OUT = "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/10/critic_probe/com_r10k.json"
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
    # 1. zona ocupata dinainte
    pune(); ws.Range("D4").Value = "x"; ws.Range("D2").Formula2 = "=SUM(B2:B7)*B2:B6"
    r["1_ocupat_D2_D7"] = txt("D", (2, 8)); r["1_ocupat_D2_haspill"] = bool(ws.Range("D2").HasSpill)
    # 2. varsat, apoi scriu 5 peste D4
    pune(); ws.Range("D2").Formula2 = "=SUM(B2:B7)*B2:B6"
    r["2_varsat_D2_D7"] = txt("D", (2, 8))
    ws.Range("D4").Value = 5
    r["2_dupa_D4_5"] = txt("D", (2, 8))
    ws.Range("D4").ClearContents()
    r["2_dupa_golire_D4"] = txt("D", (2, 8))
    # 3. =B2:B6 simplu, in F5
    pune(); ws.Range("F5").Formula2 = "=B2:B6"
    r["3_F5_B2B6"] = txt("F", (4, 11)); r["3_F5_haspill"] = bool(ws.Range("F5").HasSpill)
    # 4. =B2:B6*2 in D2
    pune(); ws.Range("D2").Formula2 = "=B2:B6*2"
    r["4_D2_ori2"] = txt("D", (2, 8))
    # 5. =B2:B6>8 si =B2:B6&"a"
    pune(); ws.Range("H2").Formula2 = "=B2:B6>8"; ws.Range("I2").Formula2 = '=B2:B6&"a"'
    r["5_H_comparatie"] = txt("H", (2, 7)); r["5_I_concat"] = txt("I", (2, 7))
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
