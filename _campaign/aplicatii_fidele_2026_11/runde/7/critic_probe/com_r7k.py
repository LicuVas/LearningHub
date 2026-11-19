# -*- coding: utf-8 -*-
"""Critic r7: Excel REAL, instanta NOUA si INVIZIBILA (DispatchEx, Visible=False, DisplayAlerts=False), fara fisiere.
Taste trimise ca mesaje (PostMessage WM_CHAR / WM_KEYDOWN) ferestrei EXCEL7 a instantei mele; citesc Range.Formula.
Nu ating Excel-ul omului (alt proces); inchid doar PID-ul meu."""
import json, time, os, subprocess
import win32com.client, win32gui, win32api, win32con, win32process, pythoncom
OUT = "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/7/critic_probe/com_r7k.json"
rez = {"metoda": "DispatchEx('Excel.Application'), Visible=False, DisplayAlerts=False; PostMessage pe fereastra EXCEL7 a instantei; Range.Formula/Text"}
app = win32com.client.DispatchEx("Excel.Application")
app.Visible = False; app.DisplayAlerts = False
hwnd = app.Hwnd
pid = win32process.GetWindowThreadProcessId(hwnd)[1]
rez["pid_propriu"] = "da (citit din Hwnd-ul instantei noi)"
def vk(h, code, sys_=False):
    sc = win32api.MapVirtualKey(code, 0)
    down = win32con.WM_SYSKEYDOWN if sys_ else win32con.WM_KEYDOWN
    up = win32con.WM_SYSKEYUP if sys_ else win32con.WM_KEYUP
    lp = 1 | (sc << 16) | ((1 << 29) if sys_ else 0)
    win32api.PostMessage(h, down, code, lp); time.sleep(0.15)
    win32api.PostMessage(h, up, code, lp | (1 << 30) | (1 << 31)); time.sleep(0.25)
def chars(h, t):
    for ch in t:
        win32api.PostMessage(h, win32con.WM_CHAR, ord(ch), 1); time.sleep(0.08)
    time.sleep(0.3)
def asteapta():
    for _ in range(40):
        try:
            return app.Ready
        except Exception:
            time.sleep(0.25)
try:
    wb = app.Workbooks.Add(); ws = wb.Worksheets(1)
    ws.Range("B2").Value = 9; ws.Range("B3").Value = 7; ws.Range("B4").Value = 8; ws.Range("E2").Value = 4
    xldesk = win32gui.FindWindowEx(hwnd, 0, "XLDESK", None)
    h7 = win32gui.FindWindowEx(xldesk, 0, "EXCEL7", None)
    rez["excel7_gasit"] = bool(h7)
    def proba(nume, adr, pasi):
        ws.Range(adr).Select(); time.sleep(0.3)
        for p in pasi:
            if isinstance(p, str): chars(h7, p)
            else: vk(h7, *p) if isinstance(p, tuple) else vk(h7, p)
        time.sleep(0.6); asteapta()
        try:
            rez[nume] = {"celula": adr, "Formula": ws.Range(adr).Formula, "Text": ws.Range(adr).Text, "activa_dupa": app.ActiveCell.Address}
        except Exception as e:
            rez[nume] = {"eroare": str(e)[:200]}
        print(nume, rez[nume])
        vk(h7, win32con.VK_ESCAPE); time.sleep(0.3)
    # T0 control: tastare simpla + Enter
    proba("T0_tastare_enter", "G2", ["5", win32con.VK_RETURN])
    # T1: „=” apoi sageata sus, Enter (modul Point)
    proba("T1_egal_sus", "B5", ["=", win32con.VK_UP, win32con.VK_RETURN])
    # T2: „=B2+” apoi sageata dreapta (din D2: E2), Enter
    proba("T2_plus_dreapta", "D2", ["=B2+", win32con.VK_RIGHT, win32con.VK_RETURN])
    # T3: „=AV”, Tab, „B2:B4)”, Enter (lista functiilor: prima = ?)
    proba("T3_av_tab", "C6", ["=AV", win32con.VK_TAB, "B2:B4)", win32con.VK_RETURN])
    # T4: „=AVER”, Tab, „B2:B4)”, Enter
    proba("T4_aver_tab", "C7", ["=AVER", win32con.VK_TAB, "B2:B4)", win32con.VK_RETURN])
    # T5: Alt+= sub B2:B4 (B5 e deja plina: folosesc coloana B, rand 5 golit)
    ws.Range("B5").ClearContents()
    proba("T5_alt_egal", "B5", [(0xBB, True), win32con.VK_RETURN])
    rez["T3_T4_nota"] = "Tab in lista functiilor cere ca lista sa apara; fara fereastra vizibila poate sa nu apara (atunci rezultatul nu e concludent)."
    vk(h7, win32con.VK_ESCAPE); vk(h7, win32con.VK_ESCAPE); time.sleep(0.5); asteapta()
    for _ in range(10):
        try: wb.Close(False); break
        except Exception: time.sleep(0.5)
finally:
    try: app.Quit()
    except Exception: pass
    del app
    pythoncom.CoUninitialize() if False else None
    time.sleep(2)
    viu = subprocess.run(["tasklist", "/FI", "PID eq %d" % pid], capture_output=True, text=True).stdout
    if str(pid) in viu:
        time.sleep(8)
        viu = subprocess.run(["tasklist", "/FI", "PID eq %d" % pid], capture_output=True, text=True).stdout
        if str(pid) in viu:
            subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True)
            rez["oprire_fortata"] = True
    rez["iesit_singur"] = "oprire_fortata" not in rez
    json.dump(rez, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps(rez, ensure_ascii=False)[:2000])
