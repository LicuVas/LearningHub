# -*- coding: utf-8 -*-
"""Criticul runda 6 (b): Excel REAL, instanta NOUA invizibila (DispatchEx): DACĂ(...) si o formula stricata, prin FormulaLocal. Doar PID-ul propriu."""
import json, os, time, subprocess
import pythoncom, win32com.client, win32process
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "com_r6b.json")
pythoncom.CoInitialize()
xl = win32com.client.DispatchEx("Excel.Application"); xl.Visible = False; xl.DisplayAlerts = False
pid = win32process.GetWindowThreadProcessId(xl.Hwnd)[1]; rez = {}
try:
    wb = xl.Workbooks.Add(); ws = wb.Worksheets(1)
    ws.Range("B3").Value = 9
    for a, t in [("D3", "=DACĂ(B3<9;10;20)"), ("D4", "=SUM(B2:B7)B2:B6"), ("D5", "=dacă(B3<9;10;20)")]:
        try:
            ws.Range(a).FormulaLocal = t
            rez[a] = {"tastat": t, "acceptat": True, "Text": ws.Range(a).Text, "FormulaLocal": ws.Range(a).FormulaLocal}
        except Exception as e:
            rez[a] = {"tastat": t, "acceptat": False, "eroare": str(e)[:200]}
    wb.Close(False)
finally:
    try: xl.Quit()
    except Exception: pass
    xl = None; pythoncom.CoUninitialize()
    for _ in range(30):
        if str(pid) not in subprocess.run(["tasklist", "/FI", "PID eq %d" % pid, "/NH"], capture_output=True, text=True).stdout: break
        time.sleep(0.5)
    else:
        subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True); rez["oprit_fortat"] = True
json.dump(rez, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1); print(json.dumps(rez, ensure_ascii=False))
