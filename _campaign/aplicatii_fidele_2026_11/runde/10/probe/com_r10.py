# -*- coding: utf-8 -*-
"""Runda 10 (A1): unde pune Excel real graficul nou, în funcție de mărimea ferestrei și de derulare.
Excel invizibil (DispatchEx, Visible=False, DisplayAlerts=False), registre noi NESALVATE, închid doar PID-ul meu.
Ieșirea: com_r10.json lângă script. Fără căi personale în ieșire."""
import json, os, time, threading
import pythoncom, win32com.client, win32process, win32api, win32con

AICI = os.path.dirname(os.path.abspath(__file__))
OUT = {"erori": [], "masuri": []}
CARTI = [("Elev", "Cărți citite"), ("Ana", 4), ("Bogdan", 7), ("Carla", 3), ("Dan", 9), ("Elena", 5)]

def masura(xl, eticheta, w=None, h=None, scroll=None, sel="A1:B6"):
    wb = xl.Workbooks.Add(); ws = wb.Worksheets(1)
    for i, (a, b) in enumerate(CARTI, 1):
        ws.Cells(i, 1).Value = a; ws.Cells(i, 2).Value = b
    win = xl.ActiveWindow
    rez = {"eticheta": eticheta}
    try:
        if w is not None:
            xl.WindowState = -4143           # xlNormal (aplicația; fereastra registrului nu se lasă, vezi com_r10_a.json)
            xl.Width = w; xl.Height = h
    except Exception as e: rez["eroare_marime"] = repr(e)[:200]
    if scroll: win.SmallScroll(Down=scroll[0], ToRight=scroll[1])
    ws.Range(sel).Select()
    ch = ws.Shapes.AddChart2(201, 51)
    rez.update({"win_w": win.Width, "win_h": win.Height, "UsableWidth": win.UsableWidth, "UsableHeight": win.UsableHeight,
                "VisibleRange": win.VisibleRange.Address, "ScrollRow": win.ScrollRow, "ScrollColumn": win.ScrollColumn,
                "left_pt": ch.Left, "top_pt": ch.Top, "w_pt": ch.Width, "h_pt": ch.Height,
                "TopLeftCell": ch.TopLeftCell.Address, "vis_left_pt": win.VisibleRange.Left, "vis_top_pt": win.VisibleRange.Top,
                "app_w": xl.Width, "app_h": xl.Height, "zoom": win.Zoom})
    wb.Close(False)
    OUT["masuri"].append(rez)

def main():
    pythoncom.CoInitialize()
    xl = win32com.client.DispatchEx("Excel.Application")
    _, pid = win32process.GetWindowThreadProcessId(xl.Hwnd)
    xl.Visible = False; xl.DisplayAlerts = False; xl.ScreenUpdating = True
    OUT["versiune"] = "%s %s" % (xl.Version, xl.Build)
    caine = threading.Timer(60, lambda: os.kill(pid, 9)); caine.start()
    try:
        import sys
        if "--joase" in sys.argv:      # runda 10, a treia trecere: fereastra mai JOASĂ decât graficul (com_r10_c.json)
            for (w, h) in [(600, 250), (300, 250), (1024.5, 300)]:
                masura(xl, "fereastra_%gx%g_pt" % (w, h), w, h)
        else:                          # a doua trecere (com_r10_b.json)
            masura(xl, "implicit")
            masura(xl, "implicit_derulat_r20_c5", scroll=(20, 5))
            for (w, h) in [(1024.5, 576), (819.75, 394.5), (600, 450), (300, 450), (281.25, 500.25), (1200, 700)]:
                masura(xl, "fereastra_%gx%g_pt" % (w, h), w, h)
            masura(xl, "fereastra_281x500_derulat_r20_c5", 281.25, 500.25, scroll=(20, 5))
    except Exception as e:
        OUT["erori"].append(repr(e)[:300])
    finally:
        try: xl.Quit()
        except Exception as e: OUT["erori"].append("quit " + repr(e)[:100])
        del xl; pythoncom.CoUninitialize()
        caine.cancel()
        for _ in range(20):
            try:
                hnd = win32api.OpenProcess(win32con.SYNCHRONIZE | win32con.PROCESS_QUERY_INFORMATION, False, pid)
                win32api.CloseHandle(hnd); time.sleep(0.5)
            except Exception:
                break
        else:
            OUT["oprire_fortata_pid_propriu"] = True
            os.kill(pid, 9)
    json.dump(OUT, open(os.path.join(AICI, "com_r10_c.json" if "--joase" in __import__("sys").argv else "com_r10_b.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps(OUT, ensure_ascii=False)[:3000])

if __name__ == "__main__":
    main()
