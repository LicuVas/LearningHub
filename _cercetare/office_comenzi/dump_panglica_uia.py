"""Dump-ul panglicii unei aplicații Office INSTALATE, prin UI Automation (26.09.2026).

Extinde _cercetare/ghid_excel_real/_id_panglica.py (care scria doar butoanele, fără grup și fără loc):
pentru fiecare filă scrie eticheta filei, GRUPURILE (id + eticheta afișată + dreptunghi) și controalele
(idMso, tip, etichetă, dreptunghi, grupul care le conține). Sursa etichetelor = aplicația însăși.

Rulează pe un DESKTOP ASCUNS (nu atinge ecranul omului), într-o instanță NOUĂ a aplicației, pe care o închide:
  python C:/00/AI_0/tools/hidden_desktop.py run --timeout 240 -- python dump_panglica_uia.py excel
Sare peste rândurile cu contul utilizatorului (MeControl*, Account*) — nu scriem nume de persoane.
Ieșire: dump_<aplicatie>_uia.json lângă script.
"""
import ctypes
import json
import subprocess
import sys
import time
from pathlib import Path

ctypes.windll.shcore.SetProcessDpiAwareness(2)
from pywinauto import Desktop  # noqa: E402

APLICATII = {
    "excel": (r"C:\Program Files\Microsoft Office\root\Office16\EXCEL.EXE", ["/x", "/e"], "XLMAIN",
              ["TabHome", "TabInsert", "TabPageLayoutExcel", "TabFormulas", "TabData", "TabReview", "TabView"]),
    "word": (r"C:\Program Files\Microsoft Office\root\Office16\WINWORD.EXE", ["/x", "/q", "/w"], "OpusApp",   # /x = instanță NOUĂ (altfel se lipește de un Word deja pornit)
             ["TabHome", "TabInsert", "TabWordDesign", "TabPageLayoutWord", "TabReferences", "TabReviewWord", "TabView"]),
    "powerpoint": (r"C:\Program Files\Microsoft Office\root\Office16\POWERPNT.EXE", ["/B"], "PPTFrameClass",   # /B = prezentare goală (cu /S pornea expunerea, fără panglică)
                   ["TabHome", "TabInsert", "TabDesign", "TabTransitions", "TabAnimations", "TabSlideShow", "TabView"]),
}
SARI = ("MeControl", "Account", "UserName", "Profile")

app = sys.argv[1] if len(sys.argv) > 1 else "excel"
exe, args, clasa, file_ = APLICATII[app]
proc = subprocess.Popen([exe] + args)
jurnal = []
rezultat = {"aplicatie": app, "exe": exe, "generat": time.strftime("%Y-%m-%d %H:%M"), "file": [], "erori": jurnal}
try:
    # 27.09.2026: a doua pornire după o închidere forțată arăta un dialog (recuperare / mod sigur) și panglica nu
    # apărea în 4 s fixe. Acum: așteptăm până când apar FILELE (max 90 s), notăm titlurile ferestrelor, închidem
    # dialoagele simple cu Esc, iar la final închidem aplicația normal.
    win, tabs, excel_nou = None, {}, False
    for sec in range(90):
        time.sleep(1)
        ws = [w for w in Desktop(backend="uia").windows() if w.element_info.process_id == proc.pid]
        rezultat["ferestre"] = sorted({f"{w.element_info.class_name}: {w.window_text()[:60]}" for w in ws})
        principale = [w for w in ws if w.element_info.class_name == clasa]
        if not principale:
            if ws and sec % 10 == 9:
                try:
                    ws[0].type_keys("{ESC}")   # dialog de pornire: Esc = „nu” / închide
                except Exception:  # noqa: BLE001
                    pass
            continue
        win = principale[0]
        if app == "excel" and not excel_nou:  # pornită cu /e nu are registru; unul gol aprinde panglica
            try:
                win.type_keys("^n")
            except Exception as e:  # noqa: BLE001
                jurnal.append(f"Ctrl+N: {e}")
            excel_nou = True
            continue
        try:
            tabs = {e.element_info.automation_id: e for e in win.descendants(control_type="TabItem")
                    if (e.element_info.automation_id or "").startswith("Tab")}
        except Exception:  # noqa: BLE001
            tabs = {}
        if tabs:
            time.sleep(2)
            break
    if win is None:
        raise RuntimeError(f"fereastra principală nu a apărut în 90 s; ferestre: {rezultat.get('ferestre')}")
    if not tabs:
        jurnal.append(f"filele nu au apărut în 90 s; ferestre: {rezultat.get('ferestre')}")
    rezultat["file_gasite"] = [(k, v.window_text()) for k, v in tabs.items()]
    for fila in file_:
        if fila not in tabs:
            jurnal.append(f"{fila}: nu există în aplicația instalată")
            continue
        try:
            tabs[fila].select()
        except Exception:
            try:
                tabs[fila].click_input()
            except Exception as e:  # noqa: BLE001
                jurnal.append(f"{fila}: nu pot selecta ({e})")
                continue
        time.sleep(1.5)
        grupuri, controale, vazute, galerie = [], [], set(), []
        for el in win.descendants():
            info = el.element_info
            ai, ct = info.automation_id or "", info.control_type
            if any(s in ai for s in SARI):
                continue
            # grupurile panglicii au de obicei automation_id GOL: le recunoaștem după tip + nume + înălțimea de panglică
            if ct in ("Group", "ToolBar") and not ai.isdigit():
                try:
                    r = el.rectangle()
                    nume = el.window_text()
                except Exception:  # noqa: BLE001
                    continue
                if nume and 40 <= r.height() <= 160 and r.width() > 0 and not any(s in nume for s in SARI):
                    grupuri.append({"id": ai or None, "eticheta": nume, "rect": [r.left, r.top, r.width(), r.height()]})
                continue
            # elementele GALERIILOR (tranziții, animații, stiluri, teme): de obicei fără automation_id, dar cu nume
            if ct == "ListItem":
                try:
                    r = el.rectangle()
                    nume = el.window_text()
                except Exception:  # noqa: BLE001
                    continue
                if nume and r.width() > 0 and r.height() > 0:
                    galerie.append({"eticheta": nume, "rect": [r.left, r.top, r.width(), r.height()]})
                continue
            if not ai or ai.isdigit():
                continue
            try:
                r = el.rectangle()
            except Exception:  # noqa: BLE001
                continue
            if r.width() <= 0 or r.height() <= 0:
                continue
            dr = [r.left, r.top, r.width(), r.height()]
            if False:
                pass
            # același id poate sta și în bara Acces rapid și în filă („From Beginning” la PowerPoint): cheia e id + loc
            elif ct in ("Button", "SplitButton", "MenuItem", "CheckBox", "ComboBox", "Edit", "List") and (ai, r.left // 4, r.top // 4) not in vazute:
                vazute.add((ai, r.left // 4, r.top // 4))
                controale.append({"id": ai, "tip": ct, "eticheta": el.window_text(), "rect": dr})
        # grupul fiecărui control = grupul al cărui dreptunghi îl conține
        for c in controale:
            x, y = c["rect"][0] + c["rect"][2] / 2, c["rect"][1] + c["rect"][3] / 2
            cont = [g for g in grupuri if g["rect"][0] <= x <= g["rect"][0] + g["rect"][2]
                    and g["rect"][1] <= y <= g["rect"][1] + g["rect"][3]]
            g = min(cont, key=lambda g: g["rect"][2] * g["rect"][3]) if cont else None   # cel mai mic = grupul real, nu panoul filei
            c["grup"] = g["eticheta"] if g else None
        for it in galerie:   # la fel pentru elementele galeriilor (doar cele vizibile în panglică, nu din meniuri deschise)
            x, y = it["rect"][0] + it["rect"][2] / 2, it["rect"][1] + it["rect"][3] / 2
            cont = [g for g in grupuri if g["rect"][0] <= x <= g["rect"][0] + g["rect"][2]
                    and g["rect"][1] <= y <= g["rect"][1] + g["rect"][3]]
            g = min(cont, key=lambda g: g["rect"][2] * g["rect"][3]) if cont else None
            it["grup"] = g["eticheta"] if g else None
        rezultat["file"].append({"id": fila, "eticheta": tabs[fila].window_text(), "grupuri": grupuri, "controale": controale,
                                 "galerie": [it for it in galerie if it["grup"]]})
finally:
    out = Path(__file__).with_name(f"dump_{app}_uia.json")
    out.write_text(json.dumps(rezultat, ensure_ascii=False, indent=1), encoding="utf-8")
    # închidere NORMALĂ (Alt+F4, fără salvare), ca la pornirea următoare să nu apară dialogul de recuperare;
    # forțat doar dacă nu se închide în 20 s — și doar instanța pornită de noi
    try:
        if win is not None:
            win.type_keys("%{F4}")
            time.sleep(2)
            for w in Desktop(backend="uia").windows():
                if w.element_info.process_id == proc.pid and w.element_info.class_name != clasa:
                    w.type_keys("n")          # „Salvați modificările?” → Nu (Don't Save)
        proc.wait(20)
    except Exception:  # noqa: BLE001
        try:
            proc.kill()
        except Exception:  # noqa: BLE001
            pass
    print(out, sum(len(f["controale"]) for f in rezultat["file"]), "controale")
