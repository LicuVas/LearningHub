"""Lista ID-urilor (idMso) din panglica Excel, pe fiecare fila. Iesire: id_panglica.txt"""
import ctypes
import time
from pathlib import Path

ctypes.windll.shcore.SetProcessDpiAwareness(2)
import ghid_excel as g
from pywinauto import Desktop

xl = g.porneste_excel()
time.sleep(2)
win = Desktop(backend="uia").window(handle=xl.Hwnd)
linii = []
file_gasite = [e.element_info.automation_id for e in win.descendants(control_type="TabItem")
               if e.element_info.automation_id.startswith("Tab")]
linii.append("FILE: " + ", ".join(file_gasite))
for fila in ["TabHome", "TabInsert", "TabData", "TabFormulas"]:
    try:
        win.child_window(auto_id=fila, control_type="TabItem").wrapper_object().select()
    except Exception as e:
        linii.append(f"{fila}: nu pot selecta ({e})")
        continue
    time.sleep(1.2)
    vazute = set()
    for el in win.descendants():
        ai, ct = el.element_info.automation_id, el.element_info.control_type
        if ai and not ai.isdigit() and ct in ("Button", "SplitButton", "MenuItem", "CheckBox", "ComboBox") and ai not in vazute:
            r = el.rectangle()
            if r.width() > 0:
                vazute.add(ai)
                linii.append(f"{fila}\t{ai}\t{ct}\t{el.window_text()}")
xl.ActiveWorkbook.Saved = True
xl.Quit()
Path(__file__).with_name("id_panglica.txt").write_text("\n".join(linii), encoding="utf-8")
print(len(linii))
