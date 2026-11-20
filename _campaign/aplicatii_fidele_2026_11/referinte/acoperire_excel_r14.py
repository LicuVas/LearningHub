# -*- coding: utf-8 -*-
"""Runda `acoperire` pe Excel, redeschisă după runda 14 (20.11.2026) — generator-soră al lui acoperire_excel_r7.py.

Ținta: deblocatorul GRAV-ului X10 (runde/10/raport.md › Deblocatorii; runde/10/critic.md:34) + R10-3 a/c, R10-5, R10-6.
Tot din Excel-ul REAL de pe PC, cu metoda din runda 7: instanță NOUĂ `EXCEL.EXE /x` pe desktopul ASCUNS (LHRefOffice
pentru capturi, LHScenarii pentru scenarii), arborii UIA normalizați și redactați de dump_uia_office.py, gesturile ca în
ruleaza_real.py; refuză ecranul omului. Niciun Save, niciun Ctrl+C (clipboard-ul omului nu e atins), niciun fișier scris
de Excel. Închid doar PID-ul meu. O sesiune Excel durează cel mult 10 minute: după LIMITA_S nu mai pornesc nimic nou.

  stare --eticheta=X — starea mașinii (fără nume): PID-urile EXCEL / WINWORD / POWERPNT, numărul secvenței clipboard-ului,
              câte intrări are lista Recent (Office + ComDlg32 + dosarul Recent), câte fișiere lh_xl_r14_* în %TEMP%.
  capturi   — x. galeria Insert › Insert Line or Area Chart ▾ (rândurile, grupurile, tastele) + Line pe tabelul atelierului
              m2-l11 (tipul, seriile, categoriile, titlul, legenda — prin COM);  y. Chart Design › Add Chart Element ▾ +
              submeniul Data Labels ▸ pe graficul Line, apoi Right (etichetele pe serii, prin COM);  z. la fel pe un grafic
              Clustered Column (submeniul e altul), apoi Outside End;  v. vărsarea, prin COM (Formula / Formula2, #SPILL!,
              HasSpill, SpillParent, End(xlDown) / End(xlUp), CurrentRegion, End la marginea foii).
              Ieșirea brută: ../runde/14/acoperire_excel/capturi_excel_brut.json.  --doar=f1,f2 reia doar unele.
  scrie     — cheile noi în uia_excel.json (cele vechi neatinse) + blocul `acoperire_r14`. Fără Office.
  scrie_scenarii — scenariile noi în ../scenarii/excel/.
  scenarii  — le joacă pe Excel real (desktopul ascuns LHScenarii) -> scenarii_real/<id>.json.  --id=a,b reia doar unele.
  verifica  — oracolul livrabilului; ULTIMA linie = numărul de probleme.
"""
import json
import re
import subprocess
import sys
import time
import traceback
from pathlib import Path

AICI = Path(__file__).resolve().parent
D = AICI.parent
sys.path.insert(0, str(AICI))
import acoperire_excel_r7 as R7  # noqa: E402

IES = D / "runde" / "14" / "acoperire_excel"
BRUT = IES / "capturi_excel_brut.json"
REF = AICI / "uia_excel.json"
HIDDEN = Path(r"C:\00\AI_0\tools\hidden_desktop.py")
DESKTOP = "LHRefOffice"
DESKTOP_SC = "LHScenarii"
LIMITA_S = 480            # după 8 minute nu mai pornesc nimic nou: închiderea încape în cele 10 minute ale sesiunii
RULAT_DE = "referinte/acoperire_excel_r14.py"
JURNAL_SC = IES / "scenarii_excel_jurnal.json"
U = RR = W3 = None
log = R7.log
LOG = R7.LOG

# Chart.ChartType -> numele din galeria Excel (enumerarea XlChartType)
TIP = {4: "Line", 65: "Line with Markers", 63: "Stacked Line", 64: "100% Stacked Line", 66: "Stacked Line with Markers",
       67: "100% Stacked Line with Markers", -4101: "3-D Line", 1: "Area", 76: "Stacked Area", 77: "100% Stacked Area",
       51: "Clustered Column", 52: "Stacked Column", 53: "100% Stacked Column", 57: "Clustered Bar", 5: "Pie"}
# DataLabels.Position -> numele din Add Chart Element › Data Labels (enumerarea XlDataLabelPosition)
POZ = {-4152: "Right", -4131: "Left", 0: "Above", 1: "Below", -4108: "Center", 3: "Inside End", 4: "Inside Base",
       2: "Outside End", 5: "Best Fit", 6: "Mixed", 7: "Custom"}
LEGENDA = {-4107: "Bottom", -4152: "Right", -4160: "Top", -4131: "Left", 2: "Corner"}
# codul CVErr (XlCVError) -> numele erorii
ERR = {2000: "#NULL!", 2007: "#DIV/0!", 2015: "#VALUE!", 2023: "#REF!", 2029: "#NAME?", 2036: "#NUM!", 2042: "#N/A",
       2043: "#GETTING_DATA", 2045: "#SPILL!"}
FILE_CTX = {"Ctx_ChartDesign": "Chart Design", "Ctx_Format": "Format"}

TARG = {"A1": "Clasa", "B1": "miercuri", "C1": "joi", "D1": "vineri", "A2": "8A", "B2": 45, "C2": 60, "D2": 90,
        "A3": "8B", "B3": 50, "C3": 42, "D3": 80, "A4": "8C", "B4": 38, "C4": 66, "D4": 72, "A5": "8D", "B5": 55,
        "C5": 48, "D5": 70}                                   # lectii/viii/m2-l11/index.html:244 (atelierul)
CARTI = {"A1": "Elev", "B1": "Cărți citite", "A2": "Ana", "B2": 6, "A3": "Bogdan", "B3": 4, "A4": "Carla", "B4": 9,
         "A5": "Dan", "B5": 3, "A6": "Elena", "B6": 7}       # lectii/viii/m2-l11/index.html:54 (pasul 5, coloane)
NOTE_B = {"B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": 8}   # ca la criticul 10 (com_r10k*.json): SUM = 48
FORMULA_V = "=SUM(B2:B7)*B2:B6"


def incarca():
    global U, RR, W3
    R7.incarca()
    U, RR, W3 = R7.U, R7.RR, R7.W3


def txt(x):
    if isinstance(x, float) and x.is_integer():
        return str(int(x))
    return str(x)


def eroare_din(v, text):
    """Valoarea unei celule cu eroare: COM dă codul CVErr ca întreg (0x800A0000 + cod); întoarce numele erorii."""
    if isinstance(v, int) and not isinstance(v, bool) and v < -2146800000:
        nume = ERR.get(v & 0xFFFF)
        if nume and nume == str(text):
            return nume
        return str(text) if str(text).startswith("#") else v
    return v


def citeste_grafic(ch, k):
    if ch is None:
        return None
    if k == "tip_grafic":
        ct = int(ch.ChartType)
        return TIP.get(ct, f"ChartType {ct}")
    n = int(ch.SeriesCollection().Count)
    serii = [ch.SeriesCollection(i) for i in range(1, n + 1)]
    if k == "serii_grafic":
        return [str(s.Name) for s in serii]
    if k == "categorii_grafic":
        return [txt(x) for x in (serii[0].XValues or ())] if serii else []
    if k == "etichete_date":
        out = {}
        for s in serii:
            if s.HasDataLabels:
                p = int(s.DataLabels().Position)
                out[str(s.Name)] = POZ.get(p, f"Position {p}")
            else:
                out[str(s.Name)] = None
        return out
    raise RuntimeError(f"cheie de grafic necunoscută: {k}")


def fapte_grafic(a, ws):
    """Tot ce spune COM despre primul grafic de pe foaie (fapte pentru referință, nu stare de scenariu)."""
    f = {"grafice_pe_foaie": int(ws.ChartObjects().Count)}
    if not f["grafice_pe_foaie"]:
        return f
    ch = ws.ChartObjects(1).Chart
    f["chart_type"] = int(ch.ChartType)
    f["tip"] = TIP.get(f["chart_type"], f"ChartType {f['chart_type']}")
    f["plot_by"] = {1: "xlRows (seriile pe rânduri)", 2: "xlColumns (seriile pe coloane)"}.get(int(ch.PlotBy), int(ch.PlotBy))
    f["serii"] = citeste_grafic(ch, "serii_grafic")
    f["categorii"] = citeste_grafic(ch, "categorii_grafic")
    f["etichete_date"] = citeste_grafic(ch, "etichete_date")
    f["are_titlu"] = bool(ch.HasTitle)
    if ch.HasTitle:
        f["titlu"] = str(ch.ChartTitle.Text)
    f["are_legenda"] = bool(ch.HasLegend)
    if ch.HasLegend:
        f["legenda"] = LEGENDA.get(int(ch.Legend.Position), int(ch.Legend.Position))
    det = []
    for i in range(1, int(ch.SeriesCollection().Count) + 1):
        s = ch.SeriesCollection(i)
        d = {"serie": str(s.Name), "HasDataLabels": bool(s.HasDataLabels)}
        if s.HasDataLabels:
            dl = s.DataLabels()
            d.update(Position=int(dl.Position), ShowValue=bool(dl.ShowValue), ShowCategoryName=bool(dl.ShowCategoryName),
                     ShowSeriesName=bool(dl.ShowSeriesName))
        det.append(d)
    f["serii_detalii"] = det
    try:
        f["grafic_activ"] = a.ActiveChart is not None
    except Exception as e:  # noqa: BLE001
        f["grafic_activ"] = f"necitit: {e!r}"[:80]
    return f


def sterge_grafice(ws):
    while int(ws.ChartObjects().Count):
        ws.ChartObjects(1).Delete()


def pune(ws, celule):
    for adr, v in celule.items():
        ws.Range(adr).Value = v


# ------------------------------------------------------------------------------------------------ capturile
def inchide_sigur(c, inainte):
    """c.inchide_noi, dar o fereastră a galeriei poate dispărea chiar în timpul citirii (COMError în ElementFromHandle)."""
    for _ in range(3):
        try:
            return c.inchide_noi(inainte)
        except Exception as e:  # noqa: BLE001
            log(f"  închiderea ferestrelor noi: {e!r}"[:160])
            time.sleep(1.0)
    return False


def file_si_alegere(c):
    b = U.arbore(U.din_hwnd(c.s.hmain))
    file_ = [c.s.cur.text(str(n.get("n"))) for n in U.cauta(b, lambda n: n.get("ct") == 50019)]
    return {"file": [x for x in file_ if x != "Developer"],      # Developer = setarea omului (ca în runda 7)
            "fila_aleasa": R7.alese(c, c.s.hmain)[:4]}


def deschide_submeniu(c, item, noi_vechi, cheie, cum):
    """Submeniul unui rând de meniu (Data Labels ▸): Expand; rândurile apar într-o fereastră nouă sau sub rând."""
    inainte = {x for x, _, _ in c.ferestre()}
    ok = RR.uia_expand(item)
    if not ok:
        R7.apasa_in_fir(item)
    noi = c.noi(inainte, 6)
    nod = c.lista_deschisa(item, noi)
    if nod is None:
        c.erori.append(f"{cheie}: submeniul nu s-a deschis (expand={ok})")
        return None, noi
    nod["deschis_prin"] = cum
    c.supr[cheie] = nod
    randuri = [e for t_, e in W3.etichete(nod) if t_ in ("ListItem", "MenuItem", "Button", "DataItem")]
    c.fapte[f"randuri.{cheie}"] = randuri
    log(f"  {cheie}: {len(randuri)} rânduri {randuri[:24]}")
    return nod, noi


def gaseste_in(c, ferestre, nume, item=None):
    it = R7.element_in_noi(c, list(reversed(ferestre)), nume)
    if it is None and item is not None:
        it = RR.gaseste_nume(item, nume, (50007, 50011, 50000))
    return it


def data_labels(c, cheie, alege, cum_grafic):
    """Chart Design › Add Chart Element ▾ › Data Labels ▸ (capturile), apoi `alege` (COM: etichetele pe serii)."""
    s = c.s
    ws = s.appcom.ActiveSheet
    try:
        if s.appcom.ActiveChart is None:
            ws.ChartObjects(1).Activate()
            time.sleep(1.0)
    except Exception as e:  # noqa: BLE001
        log(f"  activarea graficului: {e!r}"[:160])
    tab = RR.gaseste_nume(U.din_hwnd(s.hmain), "Chart Design", (50019,))
    if tab is None:
        c.erori.append(f"{cheie}: fila Chart Design negăsită")
        return None
    U.selecteaza(tab)
    time.sleep(1.2)
    el = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "AddChartElementMenu")
    if el is None:
        c.erori.append(f"{cheie}: AddChartElementMenu negăsit")
        return None
    cheie_meniu = "lista.AddChartElementMenu" if "lista.AddChartElementMenu" not in c.supr else None
    if cheie_meniu:
        nod, inainte, noi = R7.deschide_lista(c, el, cheie_meniu,
                                              f"UIA ExpandCollapse.Expand pe „Add Chart Element” (Chart Design › Chart "
                                              f"Layouts), {cum_grafic}")
    else:
        inainte = {x for x, _, _ in c.ferestre()}
        RR.uia_expand(el)
        noi = c.noi(inainte, 6)
    dl = gaseste_in(c, noi, "Data Labels", None)
    if dl is None:
        c.erori.append(f"{cheie}: rândul „Data Labels” negăsit în Add Chart Element")
        inchide_sigur(c, inainte)
        return None
    _, noi2 = deschide_submeniu(c, dl, noi, cheie, f"Add Chart Element ▾ › Data Labels ▸ (UIA Expand pe rând), {cum_grafic}")
    it = gaseste_in(c, noi2 + noi, alege, dl)
    f = {"ales": alege}
    if it is None:
        f["ales"] = f"„{alege}” negăsit"
        inchide_sigur(c, inainte)
    else:
        R7.apasa_in_fir(it)
        time.sleep(2.5)
        inchide_sigur(c, inainte)
    f["dupa"] = fapte_grafic(s.appcom, ws)
    return f


def x_line(c):
    """x. Insert › Insert Line or Area Chart ▾ pe tabelul atelierului (A1:D5), apoi Line."""
    s = c.s
    ws = s.appcom.ActiveSheet
    sterge_grafice(ws)
    ws.Cells.Clear()
    pune(ws, TARG)
    ws.Range("A1:D5").Select()
    R7.fila(c, "TabInsert")
    el = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "ChartTypeLineInsertGallery")
    if el is None:
        c.erori.append("x: ChartTypeLineInsertGallery negăsit")
        return
    nod, inainte, noi = R7.deschide_lista(c, el, "lista.ChartTypeLineInsertGallery",
                                          "UIA ExpandCollapse.Expand pe „Insert Line or Area Chart” (Insert › Charts), "
                                          "A1:D5 aleasă (tabelul atelierului din m2-l11: Clasa / miercuri, joi, vineri)")
    f = {"randuri": c.fapte.get("randuri.lista.ChartTypeLineInsertGallery")}
    it = R7.element_in_noi(c, noi, "Line")
    if it is None:
        f["inserat"] = "rândul „Line” negăsit"
    else:
        R7.apasa_in_fir(it)
        time.sleep(3.0)
        f["inserat"] = "Line (UIA Invoke pe rândul galeriei)"
        f["dupa"] = fapte_grafic(s.appcom, ws)
        f.update(file_si_alegere(c))
    try:
        inchide_sigur(c, inainte)
    except Exception as e:  # noqa: BLE001
        log(f"  x: închiderea galeriei: {e!r}"[:160])
    c.fapte["x_line"] = f
    log(f"  x. {json.dumps(f, ensure_ascii=False)[:600]}")


def y_data_labels_line(c):
    """y. Add Chart Element ▾ › Data Labels ▸ pe graficul Line de la x (îl refac dacă lipsește), apoi Right."""
    s = c.s
    ws = s.appcom.ActiveSheet
    if not int(ws.ChartObjects().Count):
        sterge_grafice(ws)
        ws.Cells.Clear()
        pune(ws, TARG)
        ch = ws.Shapes.AddChart2(-1, 4, ws.Range("F2").Left, ws.Range("F2").Top).Chart   # xlLine
        ch.SetSourceData(ws.Range("A1:D5"))
        c.fapte["y_grafic_prin_com"] = "graficul Line refăcut prin Shapes.AddChart2(-1, xlLine) (x n-a lăsat grafic)"
        time.sleep(1.5)
    f = data_labels(c, "lista.AddChartElementMenu#Data Labels", "Right",
                    "graficul Line ales (tabelul atelierului m2-l11, A1:D5)")
    c.fapte["y_data_labels_line"] = f
    log(f"  y. {json.dumps(f, ensure_ascii=False)[:600]}")
    R7.esc(c, 1)


def z_data_labels_coloana(c):
    """z. Clustered Column pe tabelul CARTI (A1:B6, pasul 5 din m2-l11) + Add Chart Element › Data Labels ▸ › Outside End."""
    s = c.s
    ws = s.appcom.ActiveSheet
    sterge_grafice(ws)
    ws.Cells.Clear()
    pune(ws, CARTI)
    ws.Range("A1:B6").Select()
    R7.fila(c, "TabInsert")
    el = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "ChartTypeColumnInsertGallery")
    if el is None:
        c.erori.append("z: ChartTypeColumnInsertGallery negăsit")
        return
    inainte = {x for x, _, _ in c.ferestre()}
    RR.uia_expand(el)
    noi = c.noi(inainte, 6)
    c.lista_deschisa(el, noi)
    it = R7.element_in_noi(c, noi, "Clustered Column")
    f = {}
    if it is None:
        f["inserat"] = "rândul „Clustered Column” negăsit"
        inchide_sigur(c, inainte)
    else:
        R7.apasa_in_fir(it)
        time.sleep(3.0)
        inchide_sigur(c, inainte)
        f["inserat"] = "Clustered Column (UIA Invoke pe rândul galeriei)"
        f["data_labels"] = data_labels(c, "lista.AddChartElementMenu#Data Labels#Clustered Column", "Outside End",
                                       "graficul Clustered Column ales (tabelul CARTI din m2-l11, A1:B6)")
    c.fapte["z_data_labels_coloana"] = f
    log(f"  z. {json.dumps(f, ensure_ascii=False)[:600]}")
    R7.esc(c, 1)
    try:
        sterge_grafice(ws)
    except Exception as e:  # noqa: BLE001
        c.erori.append(f"z: ștergerea graficului: {e!r}"[:160])


def v_varsare_com(c):
    """v. Vărsarea și marginile foii, prin COM (Formula2 = ce scrie omul în Excel 365)."""
    s = c.s
    a = s.appcom
    ws = a.ActiveSheet
    sterge_grafice(ws)
    ws.Cells.Clear()
    ws.Range("A1").Select()
    f = {}

    def cel(adr):
        r = ws.Range(adr)
        o = {"Text": str(r.Text), "Value2": r.Value2, "Formula": str(r.Formula), "Formula2": str(r.Formula2),
             "HasFormula": r.HasFormula, "HasSpill": bool(r.HasSpill)}
        o["valoare_citita"] = eroare_din(R7.RR.nr(r.Value2), r.Text) if isinstance(r.Value2, (int, float)) else r.Value2
        try:
            o["SpillParent"] = RR.adr(r.SpillParent)
        except Exception:  # noqa: BLE001
            o["SpillParent"] = None
        return o
    pune(ws, NOTE_B)
    ws.Range("D4").Value = "x"
    ws.Range("D2").Formula2 = FORMULA_V
    f["a_ocupat"] = {"D2": cel("D2"), "D4": cel("D4"), "D2:D6_text": [str(ws.Range(f"D{i}").Text) for i in range(2, 8)]}
    ws.Range("D4").ClearContents()
    f["a_dupa_golirea_D4"] = {"D2": cel("D2"), "D3": cel("D3"), "D2:D7_text": [str(ws.Range(f"D{i}").Text) for i in range(2, 8)]}
    try:
        f["a_dupa_golirea_D4"]["SpillingToRange"] = RR.adr(ws.Range("D2").SpillingToRange)
    except Exception as e:  # noqa: BLE001
        f["a_dupa_golirea_D4"]["SpillingToRange"] = f"necitit: {e!r}"[:80]
    f["r10_5"] = {"D2_End_xlDown": RR.adr(ws.Range("D2").End(-4121)), "D7_End_xlUp": RR.adr(ws.Range("D7").End(-4162)),
                  "D3_CurrentRegion": RR.adr(ws.Range("D3").CurrentRegion)}
    ws.Cells.Clear()
    pune(ws, {"B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6})
    for adr, frm in (("D2", "=B2:B6"), ("E2", '=B2:B6&"x"'), ("F2", "=B2:B6>8")):
        ws.Range(adr).Formula2 = frm
    f["c_simple"] = {k: {"D2": cel(k + "2"), "coloana": [str(ws.Range(f"{k}{i}").Text) for i in range(2, 8)]}
                     for k in ("D", "E", "F")}
    ws.Cells.Clear()
    pune(ws, {f"A{i}": i for i in range(1, 8)})
    pune(ws, {"B7": 2, "C7": 3})
    f["r10_6"] = {"A7_End_xlDown": RR.adr(ws.Range("A7").End(-4121)), "C7_End_xlToRight": RR.adr(ws.Range("C7").End(-4161)),
                  "Rows.Count": int(ws.Rows.Count), "Columns.Count": int(ws.Columns.Count)}
    ws.Cells.Clear()
    ws.Range("A1").Select()
    c.fapte["v_varsare_com"] = f
    log(f"  v. {json.dumps(f, ensure_ascii=False, default=str)[:900]}")


TOATE = (x_line, y_data_labels_line, z_data_labels_coloana, v_varsare_com)


def pid_excel():
    r = subprocess.run(["tasklist", "/FI", "IMAGENAME eq EXCEL.EXE", "/FO", "CSV", "/NH"], capture_output=True, text=True)
    return sorted(int(x.split('","')[1]) for x in r.stdout.splitlines() if x.startswith('"EXCEL.EXE"'))


def capturi_intern():
    incarca()
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    straine = pid_excel()
    log(f"EXCEL.EXE înainte de pornire: {len(straine)} procese (nu le ating)")
    s = U.Sesiune("excel")
    c = W3.Cap(s)
    t0 = time.time()
    doar = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--doar=")), None)
    alese_f = [f for f in TOATE if not doar or f.__name__ in doar]
    sarite = []
    try:
        s.porneste()
        log(f"  PID-ul meu: nou = {s.proc.pid not in straine}")
        RR.BARIERA[0] = lambda: s.appcom.Version
        for f in alese_f:
            if time.time() - t0 > LIMITA_S:
                sarite.append(f.__name__)
                log(f"== {f.__name__}: SĂRIT (limita sesiunii)")
                continue
            try:
                log(f"== {f.__name__} ({round(time.time() - t0)} s)")
                f(c)
            except Exception:  # noqa: BLE001
                c.erori.append(f"{f.__name__}: " + traceback.format_exc()[-600:])
                log(traceback.format_exc()[-600:])
                try:
                    c.inchide_noi({s.hmain})
                    c.esc_main(2)
                except Exception:  # noqa: BLE001
                    pass
    finally:
        try:
            s.inchide()
        except Exception:  # noqa: BLE001
            c.erori.append("închidere: " + traceback.format_exc()[-300:])
    dupa = pid_excel()
    out = {"aplicatie": "excel", "generat": time.strftime("%Y-%m-%d %H:%M"), "versiune": U.versiune_exe("EXCEL.EXE"),
           "versiune_com_build": s.build, "desktop": DESKTOP, "dpi_factor": s.f, "fereastra": getattr(s, "fereastra_css", None),
           "suprafete": c.supr, "fapte": c.fapte, "excluse_personal": c.excluse, "redactari": s.cur.redactari,
           "sarite_cont": sorted(set(s.sarite)), "erori": c.erori + s.erori, "jurnal": LOG,
           "durata_s": round(time.time() - t0),
           "procese": {"excel_straine_inainte": len(straine), "pid_meu_ramas": s.proc.pid in dupa,
                       "straine_neatinse": all(p in dupa for p in straine)},
           "rulari": [{"generat": time.strftime("%Y-%m-%d %H:%M"), "functii": [f.__name__ for f in alese_f],
                       "sarite_limita": sarite}]}
    if doar and BRUT.exists():
        vechi = json.loads(BRUT.read_text(encoding="utf-8"))
        vechi["suprafete"].update(c.supr)
        vechi["fapte"].update(c.fapte)
        vechi["excluse_personal"] = sorted(set(vechi.get("excluse_personal", [])) | set(c.excluse))
        for k, v in s.cur.redactari.items():
            vechi["redactari"][k] = vechi["redactari"].get(k, 0) + v
        vechi["erori"] = [e for e in vechi.get("erori", []) if not any(e.startswith(f.__name__) for f in alese_f)] + c.erori + s.erori
        vechi["jurnal"] = vechi.get("jurnal", []) + LOG
        vechi["rulari"] = vechi.get("rulari", []) + out["rulari"]
        vechi["procese"] = out["procese"]
        vechi["generat"] = out["generat"]
        out = vechi
    text = W3.fara_cale_personala(json.dumps(out, ensure_ascii=False, indent=1, default=str))
    for x in s.cur.interzise:
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text.lower()):
            raise RuntimeError("un nume interzis a rămas în ieșire — NU scriu fișierul")
    IES.mkdir(parents=True, exist_ok=True)
    BRUT.write_text(text, encoding="utf-8")
    print(f"{BRUT.name}: {len(c.supr)} suprafețe, {len(c.erori)} erori, {out['durata_s']} s, procese {out['procese']}")
    return 0


# ------------------------------------------------------------------------------------------------ scenariile noi
D_CEL = R7.D_CEL + "; la o celulă cu eroare, valoare = numele erorii, ca în celulă („#SPILL!”; COM dă codul CVErr 2045)"
D_GRAFIC = ("tip_grafic = tipul primului grafic de pe foaie, cu numele din galeria Excel („Line”, „Clustered Column”; "
            "Chart.ChartType 4 / 51), null fără grafic; serii_grafic = numele seriilor, în ordinea din grafic (ca în "
            "legendă); categorii_grafic = etichetele axei categoriilor, în ordine, ca text; etichete_date = {numele seriei: "
            "poziția etichetelor de date, cu numele din Add Chart Element › Data Labels („Right”, „Outside End”, …), sau "
            "null dacă seria n-are etichete}")
SEL = "selectie = {activa, zona} (adrese fără $)"
P_LINE = {"gest": "comanda_panglica", "fila": "TabInsert", "id_mso": "ChartTypeLineInsertGallery", "element": "Line"}
P_COL = {"gest": "comanda_panglica", "fila": "TabInsert", "id_mso": "ChartTypeColumnInsertGallery", "element": "Clustered Column"}
P_ACE = {"gest": "comanda_panglica", "fila": "Ctx_ChartDesign", "id_mso": "AddChartElementMenu",
         "real": "uia:deschide:AddChartElementMenu"}
P_DL = {"gest": "clic", "tinta": "meniu:Data Labels", "real": "uia:submeniu:Data Labels"}
P_FORMULA = [{"gest": "tasteaza", "text": FORMULA_V}, {"gest": "taste", "taste": "Enter"}]
NOTE = {k: v for k, v in NOTE_B.items()}
SCEN_R14 = [
    {"id": "excel-grafic-line-galerie", "mod": "gest_real", "start": {"celule": TARG, "selectie": "A1:D5"},
     "pasi": [P_LINE], "stare_citita": ["tip_grafic", "serii_grafic", "categorii_grafic"],
     "descriere": "Tabelul atelierului (A1:D5: Clasa / miercuri, joi, vineri; 8A…8D); A1:D5 aleasă; Insert › Insert Line or "
                  "Area Chart ▾ › Line (primul rând al galeriei). " + D_GRAFIC,
     "lectii": ["viii/m2-l11"], "sursa_gest": "lectii/viii/m2-l11/index.html:63, :252"},
    {"id": "excel-grafic-line-data-labels-right", "mod": "gest_real", "start": {"celule": TARG, "selectie": "A1:D5"},
     "pasi": [P_LINE, P_ACE, P_DL, {"gest": "clic", "tinta": "meniu:Right", "real": "uia:meniu:Right"}],
     "stare_citita": ["tip_grafic", "etichete_date"],
     "descriere": "Ca excel-grafic-line-galerie, apoi, cu graficul ales: Chart Design › Add Chart Element ▾ › Data Labels ▸ › "
                  "Right. " + D_GRAFIC, "lectii": ["viii/m2-l11"], "sursa_gest": "lectii/viii/m2-l11/index.html:66, :252"},
    {"id": "excel-grafic-coloane-data-labels-outside-end", "mod": "gest_real", "start": {"celule": CARTI, "selectie": "A1:B6"},
     "pasi": [P_COL, P_ACE, P_DL, {"gest": "clic", "tinta": "meniu:Outside End", "real": "uia:meniu:Outside End"}],
     "stare_citita": ["tip_grafic", "etichete_date"],
     "descriere": "Tabelul A1:B6 (Elev / Cărți citite, 5 rânduri); A1:B6 aleasă; Insert › Insert Column or Bar Chart ▾ › "
                  "Clustered Column; Chart Design › Add Chart Element ▾ › Data Labels ▸ › Outside End. " + D_GRAFIC,
     "lectii": ["viii/m2-l11"], "sursa_gest": "lectii/viii/m2-l11/index.html:227"},
    {"id": "excel-varsare-zona-ocupata", "mod": "gest_real", "start": {"celule": dict(NOTE, D4="x"), "selectie": "D2"},
     "pasi": P_FORMULA, "stare_citita": ["celule", "selectie"],
     "descriere": "B2:B7 = 9, 7, 8, 10, 6, 8; D4 = „x”; D2 activă; „" + FORMULA_V + "” tastat, Enter (formula s-ar vărsa în "
                  "D2:D6, dar D4 e ocupată). " + D_CEL, "lectii": ["viii/m2-l08"], "sursa_gest": "de_verificat.md R10-3 (a)"},
    {"id": "excel-varsare-simpla", "mod": "gest_real", "start": {"celule": {"B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6},
                                                                  "selectie": "D2"},
     "pasi": [{"gest": "tasteaza", "text": "=B2:B6"}, {"gest": "taste", "taste": "Tab"},
              {"gest": "tasteaza", "text": '=B2:B6&"x"'}, {"gest": "taste", "taste": "Tab"},
              {"gest": "tasteaza", "text": "=B2:B6>8"}, {"gest": "taste", "taste": "Enter"}],
     "stare_citita": ["celule", "selectie"],
     "descriere": "B2:B6 = 9, 7, 8, 10, 6; D2 activă; „=B2:B6”, Tab, „=B2:B6&\"x\"”, Tab, „=B2:B6>8”, Enter. " + D_CEL,
     "lectii": ["viii/m2-l08"], "sursa_gest": "de_verificat.md R10-3 (c)"},
    {"id": "excel-varsare-ctrl-jos", "mod": "gest_real", "start": {"celule": NOTE, "selectie": "D2"},
     "pasi": P_FORMULA + [{"gest": "taste", "taste": "Up"}, {"gest": "taste", "taste": "Ctrl+Down"}],
     "stare_citita": ["selectie"],
     "descriere": "B2:B7 = 9, 7, 8, 10, 6, 8; D2: „" + FORMULA_V + "”, Enter (se varsă în D2:D6), ↑ (înapoi pe D2), "
                  "Ctrl+↓. " + SEL, "lectii": ["viii/m2-l08"], "sursa_gest": "de_verificat.md R10-5"},
    {"id": "excel-varsare-ctrl-shift-jos", "mod": "gest_real", "start": {"celule": NOTE, "selectie": "D2"},
     "pasi": P_FORMULA + [{"gest": "taste", "taste": "Up"}, {"gest": "taste", "taste": "Ctrl+Shift+Down"}],
     "stare_citita": ["selectie"],
     "descriere": "Ca excel-varsare-ctrl-jos, cu Ctrl+Shift+↓ în loc de Ctrl+↓. " + SEL, "lectii": ["viii/m2-l08"],
     "sursa_gest": "de_verificat.md R10-5"},
    {"id": "excel-varsare-ctrl-sus-din-d7", "mod": "gest_real", "start": {"celule": NOTE, "selectie": "D2"},
     "pasi": P_FORMULA + [{"gest": "taste", "taste": "Down", "repeta": 4}, {"gest": "taste", "taste": "Ctrl+Up"}],
     "stare_citita": ["selectie"],
     "descriere": "B2:B7 = 9, 7, 8, 10, 6, 8; D2: „" + FORMULA_V + "”, Enter (D3), ↓ de 4 ori (D7, sub vărsare), Ctrl+↑. "
                  + SEL, "lectii": ["viii/m2-l08"], "sursa_gest": "de_verificat.md R10-5"},
    {"id": "excel-varsare-ctrl-a", "mod": "gest_real", "start": {"celule": NOTE, "selectie": "D2"},
     "pasi": P_FORMULA + [{"gest": "taste", "taste": "Ctrl+A"}],
     "stare_citita": ["selectie"],
     "descriere": "B2:B7 = 9, 7, 8, 10, 6, 8; D2: „" + FORMULA_V + "”, Enter (D3, în vărsare), Ctrl+A. " + SEL,
     "lectii": ["viii/m2-l08"], "sursa_gest": "de_verificat.md R10-5"},
    {"id": "excel-ctrl-jos-ultimul-rand", "mod": "gest_real", "start": {"celule": {f"A{i}": i for i in range(1, 8)},
                                                                         "selectie": "A7"},
     "pasi": [{"gest": "taste", "taste": "Ctrl+Down"}], "stare_citita": ["selectie"],
     "descriere": "A1:A7 = 1…7, restul coloanei goală; A7 activă (ultima plină); Ctrl+↓. " + SEL, "lectii": ["viii/m1-l02"],
     "sursa_gest": "de_verificat.md R10-6"},
    {"id": "excel-ctrl-dreapta-ultima-coloana", "mod": "gest_real", "start": {"celule": {"A7": 1, "B7": 2, "C7": 3},
                                                                               "selectie": "C7"},
     "pasi": [{"gest": "taste", "taste": "Ctrl+Right"}], "stare_citita": ["selectie"],
     "descriere": "A7:C7 = 1, 2, 3, restul rândului gol; C7 activă (ultima plină); Ctrl+→. " + SEL, "lectii": ["viii/m1-l02"],
     "sursa_gest": "de_verificat.md R10-6"},
]


def scrie_scenarii():
    dosar = D / "scenarii" / "excel"
    for s in SCEN_R14:
        sc = {"id": s["id"], "aplicatie": "excel", "mod": s["mod"], "descriere": s["descriere"] + " (runda `acoperire` "
              "Excel redeschisă după runda 14, 20.11.2026; rezultatul real: referinte/acoperire_excel_r14.py scenarii)",
              "start": s["start"], "pasi": s["pasi"], "stare_citita": s["stare_citita"], "lectii": s["lectii"],
              "sursa_gest": s["sursa_gest"], "rulat_de": RULAT_DE}
        (dosar / f"{s['id']}.json").write_text(json.dumps(sc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"scenarii: {len(SCEN_R14)} noi")
    return 0


def clasa_excel_r14():
    Baza = R7.clasa_excel_r7()

    class ExcelR14(Baza):
        CHEI_AMPRENTA = ["celule", "format_celule", "selectie", "inaltimi_randuri", "tip_grafic", "etichete_date"]
        CHEI_GRAFIC = ("tip_grafic", "serii_grafic", "categorii_grafic", "etichete_date")

        def start(self, st):
            self.meniuri = []
            self.inchide_ferestre_straine()
            try:
                sterge_grafice(self.ws)
            except Exception as e:  # noqa: BLE001
                log(f"  start: ștergerea graficelor: {e!r}"[:160])
            super().start(st)

        def grafic(self):
            ws = self.ws
            return ws.ChartObjects(1).Chart if int(ws.ChartObjects().Count) else None

        def citeste(self, chei):
            mele = [k for k in chei if k in self.CHEI_GRAFIC]
            rest = [k for k in chei if k not in self.CHEI_GRAFIC]
            rez = super().citeste(rest) if rest else {}
            if "celule" in rez:
                for o in rez["celule"].values():
                    o["valoare"] = eroare_din(o.get("valoare"), o.get("text"))
            if mele:
                ch = self.grafic()
                for k in mele:
                    rez[k] = citeste_grafic(ch, k)
            return {k: rez[k] for k in chei}

        def asteapta_noi(self, inainte, sec=6.0):
            t0 = time.time()
            while time.time() - t0 < sec:
                time.sleep(0.25)
                if [w for w in self.ferestre() if w[0] not in inainte]:
                    time.sleep(1.2)
                    return [w for w in self.ferestre() if w[0] not in inainte]
            return []

        def cauta_in_meniuri(self, nume):
            fer = self.meniuri or [w for w in self.ferestre() if w[0] != self.hmain and w[0] not in self.baza]
            for x, _, _ in reversed(fer):          # fereastra cea mai nouă întâi (submeniul)
                for hc in U.copii_clasa(x, ["NetUIHWND"]) + [x]:
                    it = RR.gaseste_nume(U.din_hwnd(hc), nume, (50007, 50011, 50000))
                    if it is not None:
                        return it
            return None

        def real(self, p):
            r = p.get("real", "")
            if r.startswith("uia:deschide:"):
                aid = r.split(":", 2)[2]
                cum = ""
                if str(p.get("fila", "")).startswith("Ctx_"):
                    nume = FILE_CTX.get(p["fila"], p["fila"][4:])
                    tab = RR.gaseste_nume(U.din_hwnd(self.hmain), nume, (50019,))
                    if tab is None:
                        raise RuntimeError(f"fila contextuală „{nume}” nu e în panglică")
                    U.selecteaza(tab)
                    time.sleep(1.0)
                    cum = f"fila „{nume}” aleasă prin UIA (SelectionItem), apoi "
                el = U.gaseste(U.din_hwnd(self.hmain), U.P_AID, aid)
                if el is None:
                    raise RuntimeError(f"controlul {aid} nu e în panglică")
                inainte = {x for x, _, _ in self.ferestre()}
                if not RR.uia_expand(el):
                    W3.pornit_in_fir(lambda e=el: RR.uia_invoke(e), 4)
                noi = self.asteapta_noi(inainte)
                if not noi:
                    raise RuntimeError(f"{aid}: lista nu s-a deschis")
                self.meniuri = list(noi)
                self.canale_r7.add("panglica")
                return cum + f"UIA ExpandCollapse.Expand pe {aid}"
            if r.startswith("uia:submeniu:"):
                nume = r.split(":", 2)[2]
                it = self.cauta_in_meniuri(nume)
                if it is None:
                    raise RuntimeError(f"rândul „{nume}” nu e în meniul deschis")
                inainte = {x for x, _, _ in self.ferestre()}
                if not RR.uia_expand(it):
                    W3.pornit_in_fir(lambda e=it: RR.uia_invoke(e) or RR.uia_legacy(e), 4)
                noi = self.asteapta_noi(inainte)
                self.meniuri = (self.meniuri or []) + noi
                self.canale_r7.add("panglica")
                return f"UIA ExpandCollapse.Expand pe rândul „{nume}” (submeniul)"
            if r.startswith("uia:meniu:"):
                nume = r.split(":", 2)[2]
                it = self.cauta_in_meniuri(nume)
                if it is None:
                    raise RuntimeError(f"rândul „{nume}” nu e în meniul deschis")
                W3.pornit_in_fir(lambda e=it: RR.uia_invoke(e) or RR.uia_select(e) or RR.uia_legacy(e), 5)
                time.sleep(2.0)
                self.meniuri = []
                self.canale_r7.add("panglica")
                return f"UIA Invoke pe rândul „{nume}”"
            return super().real(p)

        def pas_gest(self, p):
            if p.get("gest") == "taste" and "Ctrl" in str(p.get("taste")) and re.search(r"(Up|Down|Left|Right)$", p["taste"]):
                self.canale_r7.add("taste_ctrl_sageti")
            return super().pas_gest(p)
    return ExcelR14


def proba_sageti(r):
    """Canalul „taste_ctrl_sageti”: pozitiv = Ctrl+↓ din A1 (A1:A5 pline) ajunge la A5 și Ctrl+Shift+↓ alege A1:A5;
    control = ↓ fără Ctrl coboară doar la A2."""
    st = {"celule": {f"A{i}": i for i in range(1, 6)}, "selectie": "A1"}
    rez = {}
    for t in ("Ctrl+Down", "Ctrl+Shift+Down", "Down"):
        r.start(st)
        RR.trimite_taste(r.hdoc, t)
        rez[t] = r.citeste(["selectie"])["selectie"]
    poz = rez["Ctrl+Down"] == {"activa": "A5", "zona": "A5"} and rez["Ctrl+Shift+Down"] == {"activa": "A1", "zona": "A1:A5"}
    neg = rez["Down"] == {"activa": "A2", "zona": "A2"}
    r.probe["taste_ctrl_sageti"] = {"pozitiv": poz, "control": neg, "trecut": poz and neg, "detalii": rez}
    log(f"  proba taste_ctrl_sageti: {r.probe['taste_ctrl_sageti']}")


def ruleaza_unul(r, sc, versiune):
    cum, eroare, stare = [], None, {}
    mod = sc["mod"]
    try:
        r.start(sc["start"])
        for p in sc["pasi"]:
            cum.append(r.pas_gest(p) if mod == "gest_real" else r.pas_model(p))
        time.sleep(0.8)
        stare = r.citeste(sc["stare_citita"])
    except Exception as e:  # noqa: BLE001
        eroare = W3.fara_cale_personala(f"{type(e).__name__}: {e}"[:600])
        stare = {}
        log(traceback.format_exc()[-1200:])
    finally:
        try:
            r.inchide_tot()
        except Exception:  # noqa: BLE001
            pass
        rec = r.curata_recente()
    canale = set(r.canale_r7)
    probat = eroare is None and bool(canale) and all(r.probe.get(c, {}).get("trecut") for c in canale)
    rez = {"id": sc["id"], "mod_probat": probat, "stare": stare, "eroare": eroare,
           "cum": W3.fara_cale_personala(
               (f"{mod} — instanță NOUĂ excel ({versiune}), desktop ascuns {DESKTOP_SC}, {time.strftime('%d.%m.%Y %H:%M')}, "
                f"{RULAT_DE} (pe clasele din acoperire_excel_r7.py și ruleaza_real.py), DisplayAlerts = True; pașii: " +
                " · ".join(cum) + "; pornirea prin COM (formulele de pornire ca valori; graficele vechi șterse); starea "
                "citită prin COM" + (f"; {rec} intrări din lista Recent (fișierele mele) șterse" if rec else ""))),
           "canale": sorted(canale), "canale_neprobate": sorted(c for c in canale if not r.probe.get(c, {}).get("trecut"))}
    if not probat and eroare is None:
        rez["nota"] = "mod_probat = false: un canal folosit n-a trecut proba în aceeași rulare (vezi canale_neprobate)"
    (RR.REAL / f"{sc['id']}.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    log(f"  {sc['id']}: {'OK' if eroare is None else 'EROARE ' + eroare[:160]} probat={probat} "
        f"stare={json.dumps(stare, ensure_ascii=False)[:300]}")
    return rez


def scenarii_intern():
    incarca()
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    toate = {}
    for f in sorted((RR.SCEN / "excel").glob("*.json")):
        s = json.loads(f.read_text(encoding="utf-8"))
        if s.get("rulat_de") == RULAT_DE:
            toate[s["id"]] = s
    ordine = [s["id"] for s in SCEN_R14]
    iduri = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--id=")), ordine)
    sc = [toate[i] for i in ordine if i in iduri and i in toate]
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    straine = pid_excel()
    log(f"EXCEL.EXE înainte de pornire: {len(straine)} procese (nu le ating)")
    r = clasa_excel_r14()("excel")
    rez, t0, sarite = [], time.time(), []
    try:
        r.porneste()
        log(f"  PID-ul meu: nou = {r.s.proc.pid not in straine}")
        versiune = f"{U.versiune_exe(U.APPS['excel']['exe'])}, build COM {r.s.build}"
        try:
            RR.proba(r)
        except Exception:  # noqa: BLE001
            log("proba a căzut:\n" + traceback.format_exc())
        try:
            proba_sageti(r)
        except Exception:  # noqa: BLE001
            log("proba_sageti a căzut:\n" + traceback.format_exc())
        for s in sc:
            if time.time() - t0 > LIMITA_S:
                sarite.append(s["id"])
                log(f"  {s['id']}: SĂRIT (limita sesiunii)")
                continue
            rez.append(ruleaza_unul(r, s, versiune))
    except Exception:  # noqa: BLE001
        log(traceback.format_exc())
    finally:
        try:
            r.inchide()
        except Exception:  # noqa: BLE001
            log("închidere: " + traceback.format_exc())
    dupa = pid_excel()
    jurnal = {"generat": time.strftime("%Y-%m-%d %H:%M"), "desktop": DESKTOP_SC, "probe": r.probe,
              "scenarii": [x["id"] for x in sc], "sarite_limita": sarite,
              "rezultate": [{k: x[k] for k in ("id", "mod_probat", "eroare")} for x in rez],
              "procese": {"excel_straine_inainte": len(straine), "pid_meu_ramas": r.s.proc.pid in dupa,
                          "straine_neatinse": all(p in dupa for p in straine)},
              "erori_sesiune": r.s.erori, "durata_s": round(time.time() - t0), "jurnal": LOG}
    IES.mkdir(parents=True, exist_ok=True)
    nume = JURNAL_SC if not any(a.startswith("--id=") for a in sys.argv) else IES / f"scenarii_excel_jurnal_{time.strftime('%H%M')}.json"
    nume.write_text(W3.fara_cale_personala(json.dumps(jurnal, ensure_ascii=False, indent=1, default=str)), encoding="utf-8")
    print(f"scenarii: {len(rez)} rulate, {sum(1 for x in rez if x['mod_probat'])} probate, {round(time.time() - t0)} s, "
          f"procese {jurnal['procese']}")
    return 0


# ------------------------------------------------------------------------------------------------ starea mașinii
def stare_masina():
    import ctypes
    import os
    import winreg
    et = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--eticheta=")), "acum")

    def pids(img):
        r = subprocess.run(["tasklist", "/FI", f"IMAGENAME eq {img}", "/FO", "CSV", "/NH"], capture_output=True, text=True)
        return sorted(int(x.split('","')[1]) for x in r.stdout.splitlines() if x.startswith(f'"{img}"'))

    def valori(cheie):
        n = 0
        try:
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, cheie) as k:
                i = 0
                while True:
                    try:
                        winreg.EnumValue(k, i)
                        n += 1
                        i += 1
                    except OSError:
                        break
                j = 0
                while True:
                    try:
                        sub = winreg.EnumKey(k, j)
                    except OSError:
                        break
                    n += valori(cheie + "\\" + sub)
                    j += 1
        except OSError:
            pass
        return n
    tmp = Path(os.environ.get("TEMP", ""))
    recent = Path(os.environ.get("APPDATA", "")) / "Microsoft" / "Windows" / "Recent"
    out = {"eticheta": et, "ora": time.strftime("%Y-%m-%d %H:%M:%S"),
           "EXCEL.EXE": pids("EXCEL.EXE"), "WINWORD.EXE": pids("WINWORD.EXE"), "POWERPNT.EXE": pids("POWERPNT.EXE"),
           "clipboard_secventa": int(ctypes.windll.user32.GetClipboardSequenceNumber()),
           "recent_office_excel_valori": valori(r"Software\Microsoft\Office\16.0\Excel\User MRU"),
           "recent_comdlg32_valori": valori(r"Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32"),
           "recent_dosar_lh_xl_r14": len([f for f in recent.glob("*lh_xl_r14*")]) if recent.exists() else None,
           "temp_lh_xl_r14": len(list(tmp.glob("lh_xl_r14_*"))) if tmp.exists() else None,
           "resiliency_excel_valori": valori(r"Software\Microsoft\Office\16.0\Excel\Resiliency")}
    IES.mkdir(parents=True, exist_ok=True)
    (IES / f"stare_masina_{et}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False))
    return 0


# ------------------------------------------------------------------------------------------------ scrie / verifica
CHEI_NOI = ("lista.ChartTypeLineInsertGallery", "lista.AddChartElementMenu", "lista.AddChartElementMenu#Data Labels",
            "lista.AddChartElementMenu#Data Labels#Clustered Column")


def scrie():
    import acoperire_word_r3 as W
    b = json.loads(BRUT.read_text(encoding="utf-8"))
    r = json.loads(REF.read_text(encoding="utf-8"))
    S = r["suprafete"]
    ale_mele = set(r.get("acoperire_r14", {}).get("suprafete_adaugate", []))
    puse, sarite = [], []
    for k, v in b["suprafete"].items():
        if k in S and k not in ale_mele:
            sarite.append(k)
            continue
        v = json.loads(json.dumps(v))
        pop = W.cauta_noduri(v, lambda n: n.get("tip") == "Menu")
        if pop:
            nv = dict(pop[0])
            nv["deschis_prin"] = v.get("deschis_prin")
            nv["nota"] = ("lista deschisă = fereastra-popup (Menu) a controlului; controlul („" + str(v.get("eticheta")) +
                          "”) e în panglica.<filă> / panglica_context.<filă> sau în meniul-părinte")
            v = nv
        S[k] = v
        puse.append(k)
    r["acoperire_r14"] = {
        "generat": b["generat"], "versiune": b["versiune"], "versiune_com_build": b["versiune_com_build"],
        "cum": ("referinte/acoperire_excel_r14.py capturi: instanță NOUĂ EXCEL.EXE /x pe desktopul ascuns "
                f"{b['desktop']}, fereastra 1366×768 css (Sesiune din dump_uia_office.py), listele deschise prin UIA "
                "ExpandCollapse.Expand, rândurile alese prin UIA Invoke (ca în ruleaza_real.py); starea graficului și "
                "vărsarea citite prin COM pe aceeași instanță; nimic salvat, nimic copiat; arborii normalizați și "
                "redactați ca în dump"),
        "suprafete_adaugate": puse, "chei_vechi_neatinse": sarite, "fapte": b["fapte"],
        "excluse_personal": b["excluse_personal"], "redactari": b["redactari"], "erori": b["erori"],
        "procese": b.get("procese"), "rulari": b.get("rulari", []),
    }
    text = json.dumps(r, ensure_ascii=False, indent=1)
    for x in W.interzise():
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text.lower()):
            raise RuntimeError("un nume interzis a rămas — NU scriu uia_excel.json")
    if re.search(r"c:[\\/]+users[\\/]", text.lower()):
        raise RuntimeError("o cale C:/Users a rămas — NU scriu uia_excel.json")
    REF.write_text(text, encoding="utf-8")
    print(f"uia_excel.json: {len(puse)} suprafețe noi: {puse}; neatinse: {sarite}")
    return 0


def verifica():
    import acoperire_word_r3 as W
    p = []
    r = json.loads(REF.read_text(encoding="utf-8"))
    S = r["suprafete"]
    ac = r.get("acoperire_r14")
    if not ac:
        p.append("uia_excel.json nu are blocul acoperire_r14")
    else:
        for k in ac.get("suprafete_adaugate", []):
            if k not in S:
                p.append(f"suprafața {k} anunțată, dar lipsă")
        for k in CHEI_NOI:
            if k not in S:
                p.append(f"suprafața {k} lipsește din referință")
    if not r.get("acoperire_r7"):
        p.append("blocul acoperire_r7 a dispărut")
    text = REF.read_text(encoding="utf-8").lower()
    for x in W.interzise():
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text):
            p.append("nume interzis în uia_excel.json")
    if re.search(r"c:[\\/]+users[\\/]", text):
        p.append("cale cu C:/Users în uia_excel.json")
    for s in SCEN_R14:
        f = D / "scenarii" / "excel" / f"{s['id']}.json"
        if not f.exists():
            p.append(f"scenariul {s['id']} lipsește")
        g = AICI / "scenarii_real" / f"{s['id']}.json"
        if not g.exists():
            p.append(f"rezultatul real {s['id']} lipsește")
            continue
        t = g.read_text(encoding="utf-8")
        if re.search(r"c:[\\/]+users[\\/]", t.lower()):
            p.append(f"cale cu C:/Users în scenarii_real/{s['id']}.json")
        if json.loads(t).get("mod_probat") is not True:
            p.append(f"scenarii_real/{s['id']}.json fără mod_probat = true")
    for f in IES.glob("*.json") if IES.exists() else []:
        if re.search(r"c:[\\/]+users[\\/]", f.read_text(encoding="utf-8").lower()):
            p.append(f"cale cu C:/Users în runde/14/acoperire_excel/{f.name}")
    for x in p:
        print("PROBLEMĂ:", x)
    print(len(p))
    return 1 if p else 0


# ------------------------------------------------------------------------------------------------ main
def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd in ("capturi", "scenarii"):
        import dump_uia_office as U_
        intern = {"capturi": capturi_intern, "scenarii": scenarii_intern}[cmd]
        if U_.nume_desktop_curent().lower() != "default":
            return intern()
        r = subprocess.run([sys.executable, str(HIDDEN), "run", "--desktop", DESKTOP if cmd == "capturi" else DESKTOP_SC,
                            "--timeout", "1500", "--", sys.executable, str(Path(__file__).resolve()), "_" + cmd] +
                           [a for a in sys.argv if a.startswith(("--doar=", "--id="))])
        return r.returncode
    if cmd == "_capturi":
        return capturi_intern()
    if cmd == "_scenarii":
        return scenarii_intern()
    if cmd == "stare":
        return stare_masina()
    if cmd == "scrie":
        return scrie()
    if cmd == "scrie_scenarii":
        return scrie_scenarii()
    if cmd == "verifica":
        return verifica()
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
