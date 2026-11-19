# -*- coding: utf-8 -*-
"""Critic r8: Excel REAL, instanta NOUA si INVIZIBILA (DispatchEx, Visible=False, DisplayAlerts=False).
Nicio fereastra de dialog provocata. Un singur fisier de proba in %TEMP% cu nume unic, sters la final.
(1) Saved dupa tastare / Save / Undo; (2) =SUM(B2:B7)*B2:B6 tastata ca Formula2 (ce primeste Excel dupa Yes in fereastra typo).
Inchid doar PID-ul instantei mele."""
import json, time, os, subprocess, uuid, tempfile
import win32com.client, win32gui, win32api, win32con, win32process
OUT = "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/8/critic_probe/com_r8.json"
rez = {"metoda": "DispatchEx, Visible=False, DisplayAlerts=False; tastare prin PostMessage WM_CHAR/WM_KEYDOWN pe EXCEL7; Undo prin Application.Undo; Saved/Formula/Text prin COM"}
fis = os.path.join(tempfile.gettempdir(), "lh_critic_r8_%s.xlsx" % uuid.uuid4().hex[:10])
app = win32com.client.DispatchEx("Excel.Application")
app.Visible = False; app.DisplayAlerts = False
hwnd = app.Hwnd
pid = win32process.GetWindowThreadProcessId(hwnd)[1]
rez["versiune"] = str(app.Version) + " build " + str(app.Build)
def vk(h, code):
    sc = win32api.MapVirtualKey(code, 0); lp = 1 | (sc << 16)
    win32api.PostMessage(h, win32con.WM_KEYDOWN, code, lp); time.sleep(0.15)
    win32api.PostMessage(h, win32con.WM_KEYUP, code, lp | (1 << 30) | (1 << 31)); time.sleep(0.3)
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
wb = None
try:
    wb = app.Workbooks.Add(); ws = wb.Worksheets(1)
    for i, v in enumerate([9, 7, 8, 10, 6, 8], start=2):
        ws.Range("B%d" % i).Value = v
    wb.SaveAs(fis, 51); time.sleep(0.5)
    rez["1_saved_dupa_saveas"] = bool(wb.Saved)
    xldesk = win32gui.FindWindowEx(hwnd, 0, "XLDESK", None)
    h7 = win32gui.FindWindowEx(xldesk, 0, "EXCEL7", None)
    rez["excel7_gasit"] = bool(h7)
    ws.Range("C1").Select(); time.sleep(0.3)
    chars(h7, "5"); vk(h7, win32con.VK_RETURN); time.sleep(0.5); asteapta()
    rez["1_C1_dupa_tastare"] = ws.Range("C1").Text
    rez["1_saved_dupa_tastare"] = bool(wb.Saved)
    wb.Save(); time.sleep(0.5)
    rez["1_saved_dupa_save"] = bool(wb.Saved)
    try:
        app.Undo(); time.sleep(0.5)
        rez["1_undo"] = "ok"
    except Exception as e:
        rez["1_undo"] = "eroare: " + str(e)[:150]
    rez["1_C1_dupa_undo"] = ws.Range("C1").Text
    rez["1_saved_dupa_undo"] = bool(wb.Saved)
    # (2) formula corectata de fereastra typo, ca la tastare (Formula2 = matrice dinamica)
    ws.Range("D2").Formula2 = "=SUM(B2:B7)*B2:B6"; time.sleep(0.5)
    rez["2_D2_D7_text"] = [ws.Range("D%d" % i).Text for i in range(2, 8)]
    rez["2_D2_formula2"] = ws.Range("D2").Formula2
    rez["2_D3_formula2"] = ws.Range("D3").Formula2
    rez["2_D2_spill"] = bool(ws.Range("D2").HasSpill)
finally:
    try:
        if wb is not None: wb.Close(False)
    except Exception as e:
        rez["inchidere_wb"] = str(e)[:100]
    try: app.Quit()
    except Exception: pass
    del app
    time.sleep(2)
    viu = subprocess.run(["tasklist", "/FI", "PID eq %d" % pid], capture_output=True, text=True).stdout
    if str(pid) in viu:
        time.sleep(8)
        viu = subprocess.run(["tasklist", "/FI", "PID eq %d" % pid], capture_output=True, text=True).stdout
        if str(pid) in viu:
            subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True)
            rez["oprire_fortata"] = True
    rez["iesit_singur"] = "oprire_fortata" not in rez
    try:
        os.remove(fis); rez["fisier_sters"] = True
    except Exception as e:
        rez["fisier_sters"] = str(e)[:100]
    rez["fisier"] = "%TEMP%\\" + os.path.basename(fis)
    json.dump(rez, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps(rez, ensure_ascii=False))
