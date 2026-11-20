# -*- coding: utf-8 -*-
"""Runda `acoperire` pe PowerPoint după runda 12 a valului B-powerpoint (20.11.2026) — generator-soră al lui
acoperire_powerpoint_r11.py (îi folosește ajutoarele: pornirea, închiderea sigură, curățarea Recent, clasa de scenarii).

Tot din PowerPoint-ul REAL de pe PC: `POWERPNT /B` pe desktopul ASCUNS (LHRefOffice pentru capturi, LHScenarii pentru
scenarii); refuză ecranul omului. PowerPoint are O SINGURĂ instanță pe mașină: înainte de fiecare pornire verific că nu
rulează niciun POWERPNT.EXE (altfel nu pornesc și nu ating nimic); legătura COM o iau din fereastra instanței mele
(AccessibleObjectFromWindow, ca dump_uia_office.py), niciodată Dispatch / GetObject / GetActiveObject / DispatchEx.
Prezentările mele poartă eticheta LHREF; înainte de închidere le număr: dacă a intrat una străină, NU închid nimic.
Fișierele de probă stau în %TEMP%\\lh_ppt_r12_*; intrările lor din lista Recent se șterg la final (doar ele).
Clipboard-ul omului: salvat (doar dacă are numai text), golit înainte de Ctrl+C, pus la loc după.

  capturi   — a_forma_clic: clicul de mouse pe o stea / săgeată / dreptunghi / casetă de text (ce alege PowerPoint),
                 apoi Ctrl+C, clic pe miniatura 2, Ctrl+V;
              b_fisiere: File › New › Blank Presentation; Ctrl+O › Browse (fereastra Open) › nume + Enter;
                 Enter în File name din „Save your changes”;
              c_liste: Font ▾, Animations › Start ▾, Shape Fill ▾ / Shape Outline ▾ (+ Weight ▸), Background Styles ▾;
              c_note_vederi: View › Notes, Notes din bara de stare, tastarea în note; Normal / Slide Sorter / Reading View /
                 Slide Show din bara de stare;
              d_durate: Duration după Fade / Push / Wipe (UIA față de COM) + EntryEffect pus prin COM;
              e_extra: imaginea pe Two Content cu caseta din dreapta goală; numele la hover (ToolTip).
              Ieșirea brută: ../runde/12/acoperire/capturi_powerpoint_brut.json.  --doar=f1,f2 reia doar unele.
  scrie     — cheile noi în uia_powerpoint.json (cele vechi neatinse) + blocul `acoperire_r12`. Fără Office.
  scrie_scenarii — scenariile noi în ../scenarii/powerpoint/.
  scenarii  — rezultatele reale (referinte/scenarii_real/), pe desktopul ascuns LHScenarii.  --id=a,b
  verifica  — oracolul livrabilului; ULTIMA linie = numărul de probleme.
"""
import json
import re
import shutil
import subprocess
import sys
import tempfile
import time
import traceback
from pathlib import Path

AICI = Path(__file__).resolve().parent
D = AICI.parent
sys.path.insert(0, str(AICI))
import acoperire_powerpoint_r11 as R11  # noqa: E402

IES = D / "runde" / "12" / "acoperire"
BRUT = IES / "capturi_powerpoint_brut.json"
REF = AICI / "uia_powerpoint.json"
HIDDEN = R11.HIDDEN
DESKTOP = "LHRefOffice"
DESKTOP_SC = "LHScenarii"
MARCAJ = "lh_ppt_r12_"
R11.MARCAJ = MARCAJ            # dosarul temporar al clasei de scenarii din R11 poartă marcajul rundei 12
RULAT_DE = "referinte/acoperire_powerpoint_r12.py"
JURNAL_SC = IES / "scenarii_powerpoint_jurnal.json"
SURSA_PNG = R11.SURSA_PNG
U = RR = W3 = X7 = None
LOG = R11.LOG
log = R11.log
Straina = R11.Straina
COD_FORMA = {v: k for k, v in R11.FORME_COD.items()}
TRIGGER = {1: "la_clic", 2: "cu_precedenta", 3: "dupa_precedenta"}
VEDERI = {9: "normala", 7: "sortare", 3: "pagina_note", 1: "diapozitiv", 6: "schita"}


def incarca():
    global U, RR, W3, X7
    R11.incarca()
    U, RR, W3, X7 = R11.U, R11.RR, R11.W3, R11.X7


# ------------------------------------------------------------------------------------------------ ajutoare
def bgr(hexa):
    h = hexa.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return r | (g << 8) | (b << 16)


def ferestre_copil(h):
    import win32gui
    out = []

    def cb(x, _):
        try:
            if win32gui.IsWindowVisible(x):
                out.append((x, win32gui.GetClassName(x), win32gui.GetWindowRect(x)))
        except Exception:  # noqa: BLE001
            pass
        return True
    try:
        win32gui.EnumChildWindows(h, cb, None)
    except Exception:  # noqa: BLE001
        pass
    return out


def clic(hmain, x, y, fel="clic"):
    RR.trimite_mouse(U.hwnd_la(hmain, int(x), int(y)), x, y, fel)


def misca(hmain, x, y):
    """Doar WM_MOUSEMOVE postat (pentru sfaturile la hover)."""
    import win32gui
    h = U.hwnd_la(hmain, int(x), int(y))
    cx, cy = win32gui.ScreenToClient(h, (int(x), int(y)))
    lp = ((cy & 0xFFFF) << 16) | (cx & 0xFFFF)
    for dx in (0, 1, 0):
        win32gui.PostMessage(h, 0x0200, 0, lp + dx)
        time.sleep(0.15)
    return h


def punct_forma(a, sh, fx=0.5, fy=0.5):
    w = a.ActiveWindow
    return (w.PointsToScreenPixelsX(float(sh.Left) + float(sh.Width) * fx),
            w.PointsToScreenPixelsY(float(sh.Top) + float(sh.Height) * fy))


def selectia(a):
    """Ce e ales acum în fereastra activă: Selection.Type (0 nimic, 1 diapozitive, 2 forme ca obiect, 3 text)."""
    w = a.ActiveWindow
    o = {}
    try:
        t = int(w.Selection.Type)
    except Exception as e:  # noqa: BLE001
        return {"eroare": repr(e)[:80]}
    o["Selection.Type"] = t
    o["fel"] = {0: "nimic", 1: "diapozitive", 2: "forma_ca_obiect", 3: "cursor_in_text"}.get(t, str(t))
    try:
        if t == 2:
            o["forme"] = [str(sh.Name) for sh in w.Selection.ShapeRange]
        elif t == 3:
            tr = w.Selection.TextRange
            o["forma"] = str(w.Selection.ShapeRange(1).Name)
            o["text_ales"] = {"start": int(tr.Start), "lungime": int(tr.Length)}
        elif t == 1:
            o["diapozitive"] = [int(sl.SlideIndex) for sl in w.Selection.SlideRange]
    except Exception as e:  # noqa: BLE001
        o["detaliu_eroare"] = repr(e)[:80]
    try:
        o["panou_activ_ViewType"] = int(w.ActivePane.ViewType)
    except Exception:  # noqa: BLE001
        pass
    try:
        o["diapozitiv_curent"] = int(w.View.Slide.SlideIndex)
    except Exception:  # noqa: BLE001
        pass
    return o


def descrie_forme(sl):
    out = []
    for sh in sl.Shapes:
        d = dict(R11.tip_forma(sh), text=R11.text_forma(sh),
                 pozitie=[round(float(sh.Left)), round(float(sh.Top)), round(float(sh.Width)), round(float(sh.Height))],
                 nume=str(sh.Name))
        try:
            if int(sh.Type) == 14:
                d["substituent_contine"] = int(sh.PlaceholderFormat.ContainedType)
                d["substituent_tip"] = int(sh.PlaceholderFormat.Type)
        except Exception:  # noqa: BLE001
            pass
        out.append(d)
    return out


def umplere(sh):
    try:
        fl = sh.Fill
        if not int(fl.Visible):
            return {"tip": "fara"}
        t = {1: "solid", 3: "gradient", 6: "imagine", 4: "textura", 2: "model"}.get(int(fl.Type), "alt")
        o = {"tip": t}
        if t == "solid":
            o["culoare"] = R11.hexrgb(fl.ForeColor.RGB)
        return o
    except Exception as e:  # noqa: BLE001
        return {"tip": "necitit", "eroare": repr(e)[:60]}


def fundal(sl):
    fl = sl.Background.Fill
    t = {1: "solid", 3: "gradient", 6: "imagine", 4: "textura", 2: "model"}.get(int(fl.Type), "alt")
    o = {"tip": t, "Fill.Type": int(fl.Type)}
    try:
        o["FollowMasterBackground"] = int(sl.FollowMasterBackground)
    except Exception:  # noqa: BLE001  (SlideMaster n-are FollowMasterBackground)
        pass
    try:
        o["ForeColor"] = R11.hexrgb(fl.ForeColor.RGB)
        o["BackColor"] = R11.hexrgb(fl.BackColor.RGB)
    except Exception:  # noqa: BLE001
        pass
    if t == "gradient":
        try:
            o["opriri"] = [{"poz": round(float(gs.Position), 2), "culoare": R11.hexrgb(gs.Color.RGB)}
                           for gs in fl.GradientStops]
            o["GradientStyle"] = int(fl.GradientStyle)
        except Exception:  # noqa: BLE001
            pass
    return o


def nota(sl):
    try:
        ph = sl.NotesPage.Shapes.Placeholders(2)
        return str(ph.TextFrame.TextRange.Text)
    except Exception as e:  # noqa: BLE001
        return f"necitit {e!r}"[:60]


def vedere(a):
    try:
        n = int(a.SlideShowWindows.Count)
    except Exception:  # noqa: BLE001
        n = 0
    if n:
        try:
            return "expunere" if int(a.SlideShowWindows(1).IsFullScreen) else "citire"
        except Exception:  # noqa: BLE001
            return "expunere?"
    vt = int(a.ActiveWindow.ViewType)
    return VEDERI.get(vt, f"ViewType {vt}")


def clipboard_formate():
    import win32clipboard as cb
    for _ in range(10):
        try:
            cb.OpenClipboard()
            break
        except Exception:  # noqa: BLE001
            time.sleep(0.2)
    else:
        return None
    try:
        f, out = 0, []
        while True:
            f = cb.EnumClipboardFormats(f)
            if not f:
                break
            try:
                out.append(cb.GetClipboardFormatName(f))
            except Exception:  # noqa: BLE001
                out.append(str(f))
        return out
    finally:
        cb.CloseClipboard()


def bara_stare_buton(s, nume):
    sb = U.gaseste(U.din_hwnd(s.hmain), U.P_NAME, "Status Bar")
    if not sb:
        return None
    for e in U.gaseste_toate(sb, U.P_CT, 50000):
        try:
            if str(e.CurrentName or "").strip() == nume.strip():
                return e
        except Exception:  # noqa: BLE001
            pass
    return None


def apasa_fir(el, t=5):
    return W3.pornit_in_fir(lambda e=el: RR.uia_invoke(e) or RR.uia_toggle(e) or RR.uia_legacy(e), t)


def fila_dupa_nume(s, nume):
    for e in U.gaseste_toate(U.din_hwnd(s.hmain), U.P_CT, 50019):
        try:
            if str(e.CurrentName) == nume:
                U.selecteaza(e)
                time.sleep(1.2)
                return True
        except Exception:  # noqa: BLE001
            pass
    return False


def element_in(noi, nume, tipuri=(50007, 50011, 50000), incepe=False):
    pred = (lambda n: n.startswith(nume)) if incepe else (lambda n: n == nume)
    return R11.cauta_in(noi, pred, tipuri)


def nume_redactate(c, x, nod):
    """Fereastra Open: dosarul curent (din „Adresă: …”) dacă NU e un nume de sistem -> „<folder>” peste tot în nod."""
    personale = set()
    for n in W3.cauta_noduri(nod, lambda n: str(n.get("eticheta") or "").startswith("Adresă:")):
        rest = str(n["eticheta"])[len("Adresă:"):].strip()
        if rest and rest not in W3.NAV_IMPLICIT:
            personale.add(rest)
    for n in W3.cauta_noduri(nod, lambda n: str(n.get("eticheta") or "").startswith("Căutați în")):
        rest = str(n["eticheta"])[len("Căutați în"):].strip()
        if rest and rest not in W3.NAV_IMPLICIT:
            personale.add(rest)

    def rd(t):
        if not isinstance(t, str):
            return t
        for p_ in personale:
            if p_ and p_ in t:
                t = t.replace(p_, "<folder>")
        if MARCAJ in t.lower():
            t = re.sub(MARCAJ + r"\w*", "<folder>", t, flags=re.I)
        return t

    def mers(n):
        for k in ("eticheta", "valoare", "ajutor"):
            if k in n:
                n[k] = rd(n[k])
        for k in n.get("copii", []):
            mers(k)
    mers(nod)
    if personale:
        c.excluse.append(f"fereastra Open: {len(personale)} nume de dosar înlocuite cu „<folder>”")
    return rd


# ------------------------------------------------------------------------------------------------ capturile
def scena_forme(c):
    """Diapozitivul 1 „Soarele” (Title Only) cu steaua, săgeata, dreptunghiul și caseta de text, puse prin COM;
    diapozitivul 2 „Planetele” (Title Only)."""
    s = c.s
    a = s.appcom
    p = a.ActivePresentation
    lay = {str(cl.Name): cl for cl in p.SlideMaster.CustomLayouts}
    while p.Slides.Count:
        p.Slides(1).Delete()
    s1 = p.Slides.AddSlide(1, lay["Title Only"])
    s1.Shapes(1).TextFrame.TextRange.Text = "Soarele"
    s2 = p.Slides.AddSlide(2, lay["Title Only"])
    s2.Shapes(1).TextFrame.TextRange.Text = "Planetele"
    forme = {"stea": s1.Shapes.AddShape(92, 60, 180, 180, 170), "sageata": s1.Shapes.AddShape(33, 290, 210, 180, 110),
             "dreptunghi": s1.Shapes.AddShape(1, 520, 190, 160, 130)}
    tb = s1.Shapes.AddTextbox(1, 730, 220, 180, 50)
    tb.TextFrame.TextRange.Text = "O stea"
    forme["caseta_text"] = tb
    w = a.ActiveWindow
    w.ViewType = 9
    w.Panes(2).Activate()
    w.View.GotoSlide(1)
    w.Selection.Unselect()
    time.sleep(1.0)
    return p, forme


def al_meu(s, t):
    """Titlul unei ferestre cu fișierul MEU de probă (Plante_6A_Pop.pptx) rămâne întreg; restul trece prin redactare."""
    return t if re.fullmatch(r"Plante_6A_Pop(\.pptx)?( - PowerPoint)?", t or "") else s.cur.text(t)


def clic_miniatura(s, a, n, incercari=None):
    """Clic de mouse postat pe miniatura n (panoul din stânga, desenat în mdiClass — nu e o fereastră separată): pe o
    verticală între marginea stângă a zonei și marginea stângă a diapozitivului (din COM), de sus în jos din 18 în 18 px
    css, până când PowerPoint raportează diapozitivul n ales în panoul miniaturilor (Selection.Type 1)."""
    import win32gui
    w = a.ActiveWindow
    mdi = U.copii_clasa(s.hmain, ["mdiClass"])
    if not mdi:
        return {"gasit": False, "motiv": "mdiClass negăsit"}
    r = win32gui.GetWindowRect(mdi[0])
    w.Panes(2).Activate()
    st_dia = w.PointsToScreenPixelsX(0)
    cx = r[0] + (st_dia - r[0]) * (incercari or 0.42)
    pas = 18 * s.f
    probe = []
    y = r[1] + 14 * s.f
    while y < r[1] + 520 * s.f and len(probe) < 28:
        clic(s.hmain, cx, y)
        time.sleep(0.3)
        sel = selectia(a)
        probe.append([round((y - r[1]) / s.f), sel.get("fel"), sel.get("diapozitive")])
        if sel.get("fel") == "diapozitive" and sel.get("diapozitive") == [n]:
            return {"gasit": True, "punct_css_in_zona": [round((cx - r[0]) / s.f), round((y - r[1]) / s.f)],
                    "marginea_diapozitivului_css": round((st_dia - r[0]) / s.f), "incercari": len(probe), "selectia": sel}
        y += pas
    return {"gasit": False, "probe": probe, "zona_px": list(r)}


def a_forma_clic(c):
    """a. P4: clicul de mouse în mijlocul unei stele / săgeți / unui dreptunghi / unei casete de text (ce alege PowerPoint);
    Ctrl+C pe steaua aleasă, clic pe miniatura 2, Ctrl+V."""
    s = c.s
    a = s.appcom
    R11.tit(c)
    p, forme = scena_forme(c)
    w = a.ActiveWindow
    f = {"forme_puse_prin_com": {k: [str(v.Name), int(v.Type), round(float(v.Left)), round(float(v.Top)),
                                     round(float(v.Width)), round(float(v.Height))] for k, v in forme.items()}}
    clicuri = {}
    for nume, sh, unde in (("stea", forme["stea"], (0.5, 0.55)), ("sageata", forme["sageata"], (0.45, 0.5)),
                           ("dreptunghi", forme["dreptunghi"], (0.5, 0.5)),
                           ("caseta_text", forme["caseta_text"], (0.5, 0.5)),
                           ("caseta_text_pe_chenar", forme["caseta_text"], (0.0, 0.5)),
                           ("stea_pe_chenar_dreptunghiului_care_o_incadreaza", forme["stea"], (0.0, 0.1)),
                           ("loc_gol_control", None, None)):
        w.Panes(2).Activate()
        w.Selection.Unselect()
        time.sleep(0.4)
        if sh is None:
            ps = p.PageSetup
            x, y = w.PointsToScreenPixelsX(ps.SlideWidth * 0.5), w.PointsToScreenPixelsY(ps.SlideHeight * 0.93)
        else:
            x, y = punct_forma(a, sh, *unde)
        clic(s.hmain, x, y)
        time.sleep(0.6)
        clicuri[nume] = selectia(a)
        log(f"  a. clic {nume}: {clicuri[nume]}")
    f["clic_mijloc"] = clicuri
    # Ctrl+C pe steaua aleasă prin clic, miniatura 2, Ctrl+V
    ok, clip = R11.clipboard_doar_text()
    g = {"clipboard_omului_doar_text": ok}
    if not ok:
        g["nerulat"] = f"clipboard-ul omului are și altceva decât text ({clip}) — nu-l ating"
    else:
        try:
            R11.clipboard_pune(None)
            g["clipboard_golit_inainte"] = True
            w.Panes(2).Activate()
            w.Selection.Unselect()
            x, y = punct_forma(a, forme["stea"], 0.5, 0.55)
            clic(s.hmain, x, y)
            time.sleep(0.6)
            g["dupa_clic_pe_stea"] = selectia(a)
            RR.trimite_taste(s.hpane, "Ctrl+C")
            time.sleep(0.8)
            g["clipboard_dupa_ctrl_c"] = clipboard_formate()
            g["miniatura_2"] = clic_miniatura(s, a, 2)
            if not g["miniatura_2"].get("gasit"):
                w.Panes(1).Activate()
                p.Slides(2).Select()
                g["miniatura_2_prin_com"] = True
                time.sleep(0.8)
            RR.trimite_taste(s.hpane, "Ctrl+V")
            time.sleep(1.5)
            g["dupa_ctrl_v"] = {"diapozitiv_2": descrie_forme(p.Slides(2)), "diapozitiv_1_forme": int(p.Slides(1).Shapes.Count),
                                "selectia": selectia(a)}
            log(f"  a. Ctrl+C/V: {g}")
        finally:
            g["clipboard_pus_la_loc"] = R11.clipboard_pune(clip)
    f["ctrl_c_v_stea"] = g
    c.fapte["a_forma_clic"] = f


def blank_din_new(c, f):
    s = c.s
    a = s.appcom
    vechi = {str(p.Name) for p in a.Presentations}
    U.apasa(U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "FileTabButton"))
    time.sleep(3)
    nav = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "NavBarMenu")
    it = RR.gaseste_nume(nav, "New", (50019, 50007, 50011, 50000)) if nav else None
    if it is None:
        raise RuntimeError("File › New negăsit")
    if not U.selecteaza(it):
        U.apasa(it)
    time.sleep(3)
    f["pagina"] = c.backstage_pagina()
    bv = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "BackstageView")
    bl = RR.gaseste_nume(bv, "Blank Presentation", (50007, 50000, 50011)) if bv else None
    if bl is None:
        raise RuntimeError("„Blank Presentation” negăsit în File › New")
    f["rand"] = c.nod(bl)
    cum = None
    for nume, fn in (("Invoke", RR.uia_invoke), ("LegacyDefaultAction", RR.uia_legacy), ("SelectionItem.Select", RR.uia_select)):
        W3.pornit_in_fir(lambda e=bl, fn=fn: fn(e), 5)
        for _ in range(16):
            time.sleep(0.5)
            if int(a.Presentations.Count) > len(vechi):
                cum = nume
                break
        if cum:
            break
    f["cum"] = f"UIA {cum} pe ListItem „Blank Presentation” (File › New)" if cum else "nicio metodă UIA n-a creat prezentarea"
    time.sleep(2)
    f["prezentari_deschise"] = int(a.Presentations.Count)
    if cum:
        f["nume_noua"] = R11.eticheteaza_noua(a, vechi)
    f["prezentare_activa"] = str(a.ActivePresentation.Name) if int(a.Presentations.Count) else None
    f["fereastra_activa_com"] = s.cur.text(str(a.ActiveWindow.Caption))
    f["ferestre_powerpoint"] = [s.cur.text(t) for _, cl, t in c.ferestre() if cl == "PPTFrameClass"]
    f["backstage_dupa"] = c.backstage_pagina()
    f["diapozitive_noua"] = [str(sl.CustomLayout.Name) for sl in a.ActivePresentation.Slides]
    log(f"  b. Blank Presentation -> {f}")
    return vechi


def b_fisiere(c):
    """b. P3: File › New › Blank Presentation; Ctrl+O › Browse (fereastra Open) › nume + Enter; Enter în File name din
    „Save your changes”."""
    s = c.s
    a = s.appcom
    R11.tit(c)
    f = {}
    try:
        vechi = blank_din_new(c, f)
        for p in list(a.Presentations):
            if R11.a_mea(p) and str(p.Name) not in vechi:
                p.Saved = -1
                p.Close()
        time.sleep(1.5)
        R11.cadru(s)
    except Straina:
        raise
    except Exception:  # noqa: BLE001
        c.erori.append("b_blank: " + traceback.format_exc()[-500:])
    c.fapte["b_blank_presentation"] = f
    # fișierul de deschis (prin COM, în dosarul meu din %TEMP%), cu eticheta LHREF salvată în el
    q = a.Presentations.Add(False)
    q.Tags.Add("LHREF", "1")
    q.Slides.AddSlide(1, q.SlideMaster.CustomLayouts(1)).Shapes(1).TextFrame.TextRange.Text = "Plante"
    fis = c.tmp / "Plante_6A_Pop.pptx"
    q.SaveAs(str(fis))
    q.Close()
    time.sleep(1)
    R11.cadru(s)
    g = {}
    try:
        RR.trimite_taste(s.hpane, "Ctrl+O")
        time.sleep(3)
        g["backstage"] = c.backstage_pagina()
        br = RR.gaseste_nume(U.din_hwnd(s.hmain), "Browse", (50000, 50007, 50011, 50005))
        g["browse"] = c.nod(br) if br is not None else None
        if br is None:
            raise RuntimeError("Backstage › Open: „Browse” negăsit")
        inainte = {x for x, _, _ in c.ferestre()}
        W3.pornit_in_fir(lambda e=br: RR.uia_invoke(e) or RR.uia_legacy(e), 4)
        noi = c.noi(inainte, 10, ("#32770",))
        if not noi:
            raise RuntimeError("fereastra Open n-a apărut după Browse")
        x, cl, t = noi[0]
        time.sleep(2.5)
        # la deschidere: doar faptele (titlul, butoanele, focusul, valorile câmpurilor), fără listele omului
        nod0 = c.nod(x, fara_liste=True)
        rd = nume_redactate(c, x, nod0)
        campuri = []
        for n in W3.cauta_noduri(nod0, lambda n: n.get("tip") in ("ComboBox", "Edit", "SplitButton")):
            campuri.append({"tip": n.get("tip"), "eticheta": n.get("eticheta"), "valoare": n.get("valoare"),
                            "id_win32": n.get("id_win32")})
        g["la_deschidere"] = {"titlu": s.cur.text(t), "clasa": cl, "butoane": c.butoane(x), "focus": X7.focus_in(c, x),
                              "campuri": campuri,
                              "adresa": [rd(n.get("eticheta")) for n in W3.cauta_noduri(
                                  nod0, lambda n: str(n.get("eticheta") or "").startswith("Adresă:"))]}
        log(f"  b. Open (la deschidere): {g['la_deschidere']}")
        # dosarul meu: calea + Enter în File name (fereastra trece în dosar), apoi captura structurii
        RR.trimite_text(s.hpane, str(c.tmp))
        RR.trimite_taste(s.hpane, "Enter", 1.5)
        time.sleep(2.0)
        nod = c.nod(x, fara_liste=True)
        nume_redactate(c, x, nod)
        W3.nav_implicit(c, x, nod, "dialog.FileOpen")
        nod["clasa_fereastra"] = cl
        nod["titlu_fereastra"] = s.cur.text(t)
        nod["deschis_prin"] = ("Ctrl+O › Browse (Backstage › Open; UIA Invoke) — fereastra Windows de deschidere; capturată după "
                               "ce am trecut-o în dosarul de probă din %TEMP% (calea + Enter în File name), ca listele omului să "
                               "nu intre; elementele listelor înlocuite cu „[element de listă, nesalvat]”")
        nod["butoane_ordine"] = c.butoane(x)
        nod["focus"] = X7.focus_in(c, x)
        c.supr["dialog.FileOpen"] = nod
        # numele fișierului + Enter
        RR.trimite_taste(s.hpane, "Ctrl+A", 0.3)
        RR.trimite_text(s.hpane, "Plante_6A_Pop.pptx")
        g["camp_inainte_de_enter"] = [{"eticheta": n.get("eticheta"), "valoare": n.get("valoare")} for n in W3.cauta_noduri(
            c.nod(x, fara_liste=True), lambda n: n.get("tip") == "Edit")][:3]
        n0 = int(a.Presentations.Count)
        try:
            RR.trimite_taste(s.hpane, "Enter", 1.0)
        except Exception as e:  # noqa: BLE001
            if "1400" not in repr(e):
                raise
        for _ in range(30):
            time.sleep(0.5)
            if int(a.Presentations.Count) > n0:
                break
        time.sleep(2)
        R11.cadru(s)
        st = R11.straine(a)
        if st:
            raise Straina(f"după Open: prezentări care nu sunt ale mele: {st}")
        g["dupa_enter"] = {"prezentari_deschise": int(a.Presentations.Count),
                           "prezentare_activa": str(a.ActivePresentation.Name),
                           "fereastra_activa_com": al_meu(s, str(a.ActiveWindow.Caption)),
                           "ferestre_powerpoint": [al_meu(s, tt) for _, cl2, tt in c.ferestre() if cl2 == "PPTFrameClass"],
                           "fereastra_open_inchisa": x not in {y for y, _, _ in c.ferestre()}}
        log(f"  b. Open › nume + Enter -> {g['dupa_enter']}")
        for p in list(a.Presentations):
            if R11.a_mea(p) and str(p.Name) == "Plante_6A_Pop.pptx":
                p.Saved = -1
                p.Close()
        time.sleep(1.5)
        R11.cadru(s)
    except Straina:
        raise
    except Exception:  # noqa: BLE001
        c.erori.append("b_open: " + traceback.format_exc()[-600:])
        c.inchide_noi({x for x, cl, _ in c.ferestre() if cl == "PPTFrameClass"})
        if c.backstage_pagina():
            s.iesi_backstage()
    c.fapte["b_ctrl_o_browse"] = g
    # Enter în File name din „Save your changes”: NU se probează — Enter = Save ar salva în locul implicit al omului
    # (Documente / OneDrive), iar caseta nu primește o cale (prima încercare, 20.11 12:10: PowerPoint a rămas „ocupat”, nimic
    # salvat: 0 fișiere .pptx noi pe disc, 0 intrări „Vulcanii” în HKCU\Software\Microsoft\Office) -> [NEVERIFICAT]
    c.fapte["b_enter_in_save_your_changes"] = {"NEVERIFICAT": "Enter = Save ar scrie în Documentele / OneDrive-ul omului; "
                                               "caseta File name nu primește o cale spre %TEMP%"}


def c_liste(c):
    """c. A4: Font ▾; Animations › Start ▾; Shape Fill ▾ / Shape Outline ▾ (+ Weight ▸); Background Styles ▾."""
    s = c.s
    a = s.appcom
    # ---- Font ▾
    f = {}
    try:
        p = R11.tit(c)
        sh = p.Slides(1).Shapes(1)
        sh.TextFrame.TextRange.Font.Name = "Comic Sans MS"
        sh.Select()
        time.sleep(0.8)
        R11.fila(s, "TabHome")
        el = R11.gid(s, "Font")
        f["caseta_inainte"] = R11.valoare(el)
        nod, inainte, noi = R11.deschide_lista(c, el, "lista.Font", "Font ▾ (Home › Font), titlul ales ca obiect, scris cu "
                                                                      "Comic Sans MS")
        if nod is not None:
            grupuri = []
            for g_ in W3.cauta_noduri(nod, lambda n: n.get("tip") == "Group"):
                rr = [k.get("eticheta") for k in g_.get("copii", []) if k.get("tip") in ("ListItem", "MenuItem")]
                grupuri.append({"grup": g_.get("eticheta"), "randuri": len(rr), "primele": rr[:12]})
            f["grupuri"] = grupuri
            f["toate_randurile"] = R11.randuri(nod)
            tinta = element_in(noi, "Calibri Light", incepe=True) or element_in(noi, "Calibri Light (Headings)")
            f["rand_calibri_light"] = c.nod(tinta) if tinta is not None else None
            if tinta is not None:
                W3.pornit_in_fir(lambda e=tinta: RR.uia_invoke(e) or RR.uia_select(e) or RR.uia_legacy(e), 4)
                time.sleep(1.5)
                tr = p.Slides(1).Shapes(1).TextFrame.TextRange
                f["dupa_calibri_light"] = {"Font.Name": str(tr.Font.Name), "caseta": R11.valoare(R11.gid(s, "Font"))}
            c.inchide_noi(inainte)
        log(f"  c. Font: { {k: v for k, v in f.items() if k not in ('toate_randurile', 'rand_calibri_light')} }")
    except Straina:
        raise
    except Exception:  # noqa: BLE001
        c.erori.append("c_font: " + traceback.format_exc()[-500:])
    c.fapte["c_font"] = f
    c.esc_main(1)
    # ---- Animations › Start ▾
    g = {}
    try:
        p = R11.tit(c)
        sl = p.Slides(1)
        sh = sl.Shapes(1)
        ef = sl.TimeLine.MainSequence.AddEffect(sh, 10)
        sh.Select()
        R11.fila(s, "TabAnimations")
        time.sleep(0.8)
        st = RR.gaseste_nume(U.din_hwnd(s.hmain), "Start", (50003,))
        g["caseta_inainte"] = R11.valoare(st)
        g["TriggerType_inainte"] = int(ef.Timing.TriggerType)
        nod, inainte, noi = R11.deschide_lista(c, st, "lista.AnimationStartDropdown",
                                               "Start ▾ (Animations › Timing; idMso AnimationStartDropdown după "
                                               "powerpointcontrols.xlsx — în UI Automation caseta n-are AutomationId), "
                                               "cu titlul ales și un efect Fade pe el")
        randuri = R11.randuri(nod) if nod is not None else []
        c.inchide_noi(inainte)
        g["randuri"] = randuri
        dupa = {}
        for r in randuri:
            st = RR.gaseste_nume(U.din_hwnd(s.hmain), "Start", (50003,))
            inainte = {x for x, _, _ in c.ferestre()}
            RR.uia_expand(st)
            noi = c.noi(inainte, 4)
            it = element_in(noi, r) or RR.gaseste_nume(st, r, (50007,))
            if it is None:
                dupa[r] = "rândul negăsit la redeschidere"
                c.inchide_noi(inainte)
                continue
            ok = RR.uia_select(it) or RR.uia_invoke(it) or RR.uia_legacy(it)
            time.sleep(1.0)
            RR.uia_collapse(st)
            c.inchide_noi(inainte)
            time.sleep(0.6)
            st = RR.gaseste_nume(U.din_hwnd(s.hmain), "Start", (50003,))
            dupa[r] = {"ales": ok, "Timing.TriggerType": int(sl.TimeLine.MainSequence.Item(1).Timing.TriggerType),
                       "caseta": R11.valoare(st)}
        g["dupa_fiecare_rand"] = dupa
        log(f"  c. Start: {g}")
    except Straina:
        raise
    except Exception:  # noqa: BLE001
        c.erori.append("c_start: " + traceback.format_exc()[-500:])
    c.fapte["c_start"] = g
    c.esc_main(1)
    # ---- Shape Fill ▾ / Shape Outline ▾
    h = {}
    try:
        p = R11.tit(c)
        sl = p.Slides(1)
        star = sl.Shapes.AddShape(92, 600, 250, 150, 140)
        h["stea_la_inceput"] = {"umplere": umplere(star), "Line.Weight": float(star.Line.Weight),
                                "Line.ForeColor": R11.hexrgb(star.Line.ForeColor.RGB)}
        star.Select()
        time.sleep(1.0)
        h["fila_shape_format"] = fila_dupa_nume(s, "Shape Format")
        for cheie, aid in (("lista.ShapeFillColorPicker", "ShapeFillColorPicker"),
                           ("lista.OutlineColorPicker", "OutlineColorPicker")):
            el = R11.gid(s, aid)
            if el is None:
                c.erori.append(f"{cheie}: {aid} negăsit pe Shape Format")
                continue
            nod, inainte, noi = R11.deschide_lista(c, el, cheie, f"{aid} ▾ (Shape Format › Shape Styles), steaua aleasă ca obiect")
            if nod is not None:
                h[f"structura.{cheie}"] = R11.struct(nod)
            if aid == "ShapeFillColorPicker" and nod is not None:
                # sfatul la hover: WM_MOUSEMOVE postat pe „Yellow”
                y_ = element_in(noi, "Yellow")
                if y_ is not None:
                    rc = y_.CurrentBoundingRectangle
                    inainte_h = {x for x, _, _ in c.ferestre()}
                    misca(noi[0][0] if noi else s.hmain, (rc.left + rc.right) // 2, (rc.top + rc.bottom) // 2)
                    time.sleep(2.0)
                    nh = [(cl, s.cur.text(t)) for x, cl, t in c.ferestre() if x not in inainte_h]
                    tt = []
                    for x, cl, t in c.ferestre():
                        if x in inainte_h:
                            continue
                        for e in U.gaseste_toate(U.din_hwnd(x), U.P_CT, 50022):    # ToolTip
                            tt.append(str(e.CurrentName or ""))
                    h["hover_yellow"] = {"ferestre_noi": nh, "tooltip": tt, "ajutor_uia": str(y_.CurrentHelpText or "")}
                    W3.pornit_in_fir(lambda e=y_: RR.uia_invoke(e) or RR.uia_select(e) or RR.uia_legacy(e), 4)
                    time.sleep(1.2)
                    h["dupa_yellow"] = umplere(star)
            if aid == "OutlineColorPicker" and nod is not None:
                o_ = element_in(noi, "Orange")
                wt = element_in(noi, "Weight", (50011,))
                h["weight_gasit"] = wt is not None
                if wt is not None:
                    inainte2 = {x for x, _, _ in c.ferestre()}
                    if not RR.uia_expand(wt):
                        W3.pornit_in_fir(lambda e=wt: RR.uia_invoke(e) or RR.uia_legacy(e), 3)
                    noi2 = c.noi(inainte2, 4)
                    nod2 = c.lista_deschisa(wt, noi2)
                    if nod2 is not None and R11.randuri(nod2):
                        nod2["deschis_prin"] = "Shape Outline ▾ › Weight ▸ (UIA Expand), steaua aleasă"
                        c.supr["lista.OutlineColorPicker#Weight"] = nod2
                        h["randuri.Weight"] = R11.randuri(nod2)
                        p3 = element_in(noi2, "3 pt", (50011, 50007, 50000), incepe=True)
                        if p3 is not None:
                            W3.pornit_in_fir(lambda e=p3: RR.uia_invoke(e) or RR.uia_legacy(e), 4)
                            time.sleep(1.2)
                            h["dupa_3_pt"] = {"Line.Weight": float(star.Line.Weight)}
                c.inchide_noi(inainte)
                time.sleep(0.6)
                if o_ is not None:
                    el = R11.gid(s, aid)
                    nod, inainte, noi = R11.deschide_lista(c, el, "_tmp_outline", "redeschisă pentru Orange")
                    c.supr.pop("_tmp_outline", None)
                    c.fapte.pop("randuri._tmp_outline", None)
                    o_ = element_in(noi, "Orange")
                    if o_ is not None:
                        W3.pornit_in_fir(lambda e=o_: RR.uia_invoke(e) or RR.uia_select(e) or RR.uia_legacy(e), 4)
                        time.sleep(1.2)
                        h["dupa_orange"] = {"Line.ForeColor": R11.hexrgb(star.Line.ForeColor.RGB),
                                            "Line.Visible": int(star.Line.Visible)}
            c.inchide_noi(inainte)
            time.sleep(0.6)
        # varianta din Home › Drawing
        star.Select()
        R11.fila(s, "TabHome")
        el = R11.gid(s, "ShapeFillColorPicker")
        if el is not None:
            nod, inainte, _ = R11.deschide_lista(c, el, "lista.ShapeFillColorPicker#Home", "Shape Fill ▾ (Home › Drawing), steaua aleasă")
            if nod is not None:
                la_fel = R11.randuri(nod) == c.fapte.get("randuri.lista.ShapeFillColorPicker")
                h["home_la_fel_ca_shape_format"] = la_fel
                if la_fel:
                    c.supr.pop("lista.ShapeFillColorPicker#Home", None)
            c.inchide_noi(inainte)
        log(f"  c. Shape Fill/Outline: { {k: v for k, v in h.items() if not k.startswith('structura')} }")
    except Straina:
        raise
    except Exception:  # noqa: BLE001
        c.erori.append("c_fill: " + traceback.format_exc()[-500:])
    c.fapte["c_shape_fill_outline"] = h
    c.esc_main(1)
    # ---- Background Styles ▾
    b = {}
    try:
        p = R11.tit(c, 2)
        b["inainte"] = [fundal(sl) for sl in p.Slides]
        R11.fila(s, "TabDesign")
        el = R11.gid(s, "SlideBackgroundStylesGallery")
        nod, inainte, noi = R11.deschide_lista(c, el, "lista.SlideBackgroundStylesGallery",
                                               "Background Styles ▾ (Design), diapozitivul 1 activ, nimic ales")
        if nod is not None:
            b["structura"] = R11.struct(nod)
            stil = None
            for nm in ("Style 6", "Style 4", "Style 2"):
                stil = element_in(noi, nm)
                if stil is not None:
                    b["ales"] = nm
                    break
            if stil is not None:
                W3.pornit_in_fir(lambda e=stil: RR.uia_invoke(e) or RR.uia_select(e) or RR.uia_legacy(e), 4)
                time.sleep(2.0)
                b["dupa"] = [fundal(sl) for sl in p.Slides]
                b["master"] = fundal(p.SlideMaster)
        c.inchide_noi(inainte)
        log(f"  c. Background Styles: { {k: v for k, v in b.items() if k != 'structura'} }")
    except Straina:
        raise
    except Exception:  # noqa: BLE001
        c.erori.append("c_bg: " + traceback.format_exc()[-500:])
    c.fapte["c_background_styles"] = b
    c.esc_main(1)


def c_note_vederi(c):
    """c. A4: zona de note (View › Notes, Notes din bara de stare, tastarea) și vederile din bara de stare."""
    s = c.s
    a = s.appcom
    f = {}
    p = R11.tit(c, 3)
    cb = a.CommandBars
    f["ShowNotes_la_pornire"] = bool(cb.GetPressedMso("ShowNotes"))
    f["panouri_la_pornire"] = [(cl, list(r)) for _, cl, r in ferestre_copil(s.hmain) if cl in ("paneClassDC", "mdiClass")]
    try:
        R11.fila(s, "TabView")
        el = R11.gid(s, "ShowNotes")
        f["buton_view_notes"] = c.nod(el)
        apasa_fir(el)
        time.sleep(1.5)
        f["dupa_view_notes"] = {"ShowNotes": bool(cb.GetPressedMso("ShowNotes")),
                                "panouri": [(cl, list(r)) for _, cl, r in ferestre_copil(s.hmain) if cl in ("paneClassDC",)]}
        if not f["dupa_view_notes"]["ShowNotes"]:
            apasa_fir(R11.gid(s, "ShowNotes"))
            time.sleep(1.5)
            f["dupa_view_notes_a_doua"] = bool(cb.GetPressedMso("ShowNotes"))
        # panoul de note în UI Automation
        b = U.arbore(U.din_hwnd(s.hmain))
        cand = U.cauta(b, lambda n: "note" in str(n.get("n") or "").lower() and n.get("ct") not in (50000, 50019))
        f["uia_noduri_note"] = [(n.get("ct"), n.get("c"), s.cur.text(str(n.get("n")))) for n in cand][:12]
        if cand:
            nod = s.norm().nod(cand[0])
            nod["deschis_prin"] = "View › Show › Notes (UIA Invoke pe ShowNotes): panoul de sub diapozitiv"
            c.supr["panou.Notes"] = nod
        # tastarea: clic de mouse în panoul de note (al treilea panou al ferestrei, sub diapozitiv), apoi WM_CHAR
        w = a.ActiveWindow
        w.View.GotoSlide(2)
        pan = [(h, r) for h, cl, r in ferestre_copil(s.hmain) if cl == "paneClassDC"]
        f["paneClassDC"] = [list(r) for _, r in pan]
        jos = max(pan, key=lambda x: x[1][1]) if pan else None
        if jos is not None:
            r = jos[1]
            clic(s.hmain, (r[0] + r[2]) / 2, r[1] + (r[3] - r[1]) * 0.4)
            time.sleep(0.8)
            f["dupa_clic_in_note"] = selectia(a)
            RR.trimite_text(s.hpane, "Arat pe tabla.")
            time.sleep(0.8)
            f["note_dupa_tastare"] = [nota(sl) for sl in p.Slides]
            f["text_diapozitive_dupa_tastare"] = [[R11.text_forma(sh) for sh in sl.Shapes] for sl in p.Slides]
        # Notes din bara de stare
        sbn = bara_stare_buton(s, "Notes")
        f["bara_stare_notes"] = c.nod(sbn) if sbn is not None else None
        if sbn is not None:
            apasa_fir(sbn)
            time.sleep(1.5)
            f["dupa_notes_bara_1"] = bool(cb.GetPressedMso("ShowNotes"))
            apasa_fir(bara_stare_buton(s, "Notes"))
            time.sleep(1.5)
            f["dupa_notes_bara_2"] = bool(cb.GetPressedMso("ShowNotes"))
    except Straina:
        raise
    except Exception:  # noqa: BLE001
        c.erori.append("c_note: " + traceback.format_exc()[-500:])
    finally:
        try:
            if bool(cb.GetPressedMso("ShowNotes")) != f["ShowNotes_la_pornire"]:
                R11.fila(s, "TabView")
                apasa_fir(R11.gid(s, "ShowNotes"))
                time.sleep(1.2)
            f["ShowNotes_pus_la_loc"] = bool(cb.GetPressedMso("ShowNotes")) == f["ShowNotes_la_pornire"]
        except Exception as e:  # noqa: BLE001
            f["ShowNotes_pus_la_loc"] = f"eroare {e!r}"[:80]
    log(f"  c. Note: {f}")
    c.fapte["c_note"] = f
    # ---- vederile din bara de stare
    v = {"la_pornire": {"vedere": vedere(a), "ViewType": int(a.ActiveWindow.ViewType)}}
    for nume, inapoi in (("Slide Sorter", "Normal"), ("Reading View", "Esc"), ("Slide Show", "Esc"), ("Normal", None)):
        try:
            R11.cadru(s)
            bt = bara_stare_buton(s, nume)
            if bt is None:
                v[nume] = "butonul negăsit în bara de stare"
                continue
            inainte = {x for x, _, _ in c.ferestre()}
            apasa_fir(bt)
            time.sleep(2.5)
            noi = [(cl, s.cur.text(t)) for x, cl, t in c.ferestre() if x not in inainte]
            o = {"vedere": vedere(a), "SlideShowWindows": int(a.SlideShowWindows.Count), "ferestre_noi": noi}
            try:
                o["ViewType"] = int(a.ActiveWindow.ViewType)
            except Exception:  # noqa: BLE001
                pass
            if nume == "Slide Sorter":
                o["selectia"] = selectia(a)
                sb = X7.bara_stare_nod(c)
                if sb is not None:
                    sb["deschis_prin"] = "Slide Sorter din bara de stare (UIA Invoke), 3 diapozitive"
                    c.supr["bara_stare#Slide Sorter"] = sb
                o["bara_stare"] = R11.struct(sb) if sb else None
                b = U.arbore(U.din_hwnd(s.hmain))
                o["zona_document"] = [(n.get("ct"), n.get("c"), s.cur.text(str(n.get("n") or ""))) for n in
                                      U.cauta(b, lambda n: n.get("c") in ("paneClassDC", "mdiClass"))][:6]
            v[nume] = o
            if inapoi == "Normal":
                apasa_fir(bara_stare_buton(s, "Normal"))
                time.sleep(2)
                o["dupa_normal"] = {"vedere": vedere(a), "ViewType": int(a.ActiveWindow.ViewType)}
            elif inapoi == "Esc":
                for x, cl, t in c.ferestre():
                    if x not in inainte:
                        R11.esc_la(x)
                time.sleep(1.5)
                if int(a.SlideShowWindows.Count):
                    for ssw in a.SlideShowWindows:
                        ssw.View.Exit()
                    time.sleep(1)
                o["dupa_esc"] = {"vedere": vedere(a), "SlideShowWindows": int(a.SlideShowWindows.Count)}
            log(f"  c. vederea {nume}: {o if nume != 'Slide Sorter' else {k: o[k] for k in ('vedere', 'ViewType', 'dupa_normal') if k in o}}")
        except Straina:
            raise
        except Exception:  # noqa: BLE001
            c.erori.append(f"c_vedere {nume}: " + traceback.format_exc()[-400:])
            try:
                if int(a.SlideShowWindows.Count):
                    for ssw in a.SlideShowWindows:
                        ssw.View.Exit()
                a.ActiveWindow.ViewType = 9
            except Exception:  # noqa: BLE001
                pass
    c.fapte["c_vederi"] = v


def d_durate(c):
    """d. Duration imediat după clic pe Fade / Push / Wipe în galerie (UIA Value față de COM Duration), pe diapozitive fără
    tranziție și unul după altul pe același diapozitiv; plus EntryEffect = Fade pus prin COM (drumul capturii din runda 11)."""
    s = c.s
    a = s.appcom
    p = R11.tit(c, 5)
    f = {}
    R11.fila(s, "TabTransitions")
    w = a.ActiveWindow

    def citire(i):
        sp = R11.gid(s, "TransitionDuration")
        tr = p.Slides(i).SlideShowTransition
        return {"valoare_uia": R11.valoare(sp), "com": round(float(tr.Duration), 2), "EntryEffect": int(tr.EntryEffect),
                "activ_uia": bool(sp.CurrentIsEnabled) if sp is not None else None}

    def aplica(efect):
        gal = R11.gid(s, "AnimationTransitionGallery")
        it = RR.gaseste_nume(gal, efect, (50007,)) if gal is not None else None
        if it is None:
            raise RuntimeError(f"„{efect}” nu e în galeria Transitions de pe panglică")
        for fn in (RR.uia_invoke, RR.uia_select, RR.uia_legacy):
            try:
                if fn(it):
                    break
            except Exception:  # noqa: BLE001
                continue
        time.sleep(1.8)

    w.View.GotoSlide(1)
    time.sleep(0.8)
    f["fara_tranzitie"] = citire(1)
    for i, ef in enumerate(("Fade", "Push", "Wipe"), start=1):
        try:
            w.View.GotoSlide(i)
            time.sleep(0.8)
            aplica(ef)
            f[f"{ef}_pe_diapozitiv_fara_tranzitie"] = citire(i)
        except Exception:  # noqa: BLE001
            c.erori.append(f"d {ef}: " + traceback.format_exc()[-300:])
    try:
        w.View.GotoSlide(4)
        time.sleep(0.8)
        seq = []
        for ef in ("Fade", "Push", "Wipe", "Fade"):
            aplica(ef)
            seq.append({"efect": ef, **citire(4)})
        f["pe_acelasi_diapozitiv_unul_dupa_altul"] = seq
    except Exception:  # noqa: BLE001
        c.erori.append("d secventa: " + traceback.format_exc()[-300:])
    try:
        w.View.GotoSlide(5)
        time.sleep(0.8)
        p.Slides(5).SlideShowTransition.EntryEffect = 3849
        time.sleep(1.5)
        f["EntryEffect_3849_pus_prin_COM"] = citire(5)
    except Exception:  # noqa: BLE001
        c.erori.append("d com: " + traceback.format_exc()[-300:])
    log(f"  d. durate: {f}")
    c.fapte["d_durate"] = f


def e_extra(c):
    """e. Imaginea pe Two Content cu caseta din dreapta goală (unde o pune PowerPoint)."""
    s = c.s
    a = s.appcom
    f = {}
    p = R11.tit(c, 1)
    lay = {str(cl.Name): cl for cl in p.SlideMaster.CustomLayouts}
    sl = p.Slides.AddSlide(2, lay["Two Content"])
    sl.Shapes(1).TextFrame.TextRange.Text = "Pământul"
    sl.Shapes(2).TextFrame.TextRange.Text = "A treia planetă"
    w = a.ActiveWindow
    w.View.GotoSlide(2)
    w.Panes(2).Activate()
    w.Selection.Unselect()
    time.sleep(0.8)
    f["inainte"] = descrie_forme(sl)
    png = c.tmp / "pamant.png"
    shutil.copyfile(SURSA_PNG, png)
    try:
        R11.fila(s, "TabInsert")
        el = R11.gid(s, "FlyoutAnchorInsertPictures")
        inainte = {x for x, _, _ in c.ferestre()}
        if not RR.uia_expand(el):
            W3.pornit_in_fir(lambda e=el: RR.uia_invoke(e), 4)
        noi = c.noi(inainte, 5)
        it = element_in(noi, "This Device...", (50011, 50000, 50007))
        if it is None:
            raise RuntimeError("This Device... negăsit")
        inainte2 = {x for x, _, _ in c.ferestre()}
        W3.pornit_in_fir(lambda e=it: RR.uia_invoke(e) or RR.uia_legacy(e), 4)
        dl = c.noi(inainte2, 10, ("#32770",))
        if not dl:
            raise RuntimeError("fereastra Insert Picture n-a apărut")
        time.sleep(1.5)
        RR.trimite_text(s.hpane, str(png))
        try:
            RR.trimite_taste(s.hpane, "Enter", 1.0)
        except Exception as e:  # noqa: BLE001
            if "1400" not in repr(e):
                raise
        for _ in range(30):
            time.sleep(0.3)
            if dl[0][0] not in {x for x, _, _ in c.ferestre()}:
                break
        time.sleep(2)
        f["dupa"] = descrie_forme(sl)
        f["selectia"] = selectia(a)
        f["cum"] = ("diapozitivul 2 Two Content, titlul și caseta din stânga scrise, caseta din dreapta goală, nimic ales; "
                    "Insert › Pictures ▾ › This Device... (UIA), numele fișierului + Enter (WM_CHAR / WM_KEYDOWN)")
        log(f"  e. imagine pe Two Content: {f}")
    except Straina:
        raise
    except Exception:  # noqa: BLE001
        c.erori.append("e_imagine: " + traceback.format_exc()[-500:])
        c.inchide_noi({x for x, cl, _ in c.ferestre() if cl == "PPTFrameClass"})
    c.fapte["e_imagine_two_content"] = f


TOATE = (a_forma_clic, b_fisiere, c_liste, c_note_vederi, d_durate, e_extra)


def capturi_intern():
    incarca()
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    if R11.ppt_ruleaza():
        print("SĂRIT: POWERPNT.EXE rulează deja — nu pornesc.")
        return 3
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    s = U.Sesiune("powerpoint")
    c = W3.Cap(s)
    c.tmp = Path(tempfile.mkdtemp(prefix=MARCAJ))
    t0 = time.time()
    doar = next((x.split("=", 1)[1].split(",") for x in sys.argv if x.startswith("--doar=")), None)
    alese_f = [f for f in TOATE if not doar or f.__name__ in doar]
    inchis = {}
    try:
        R11.porneste(s)
        for f in alese_f:
            if time.time() - t0 > 480:
                c.erori.append(f"{f.__name__}: sărită (sesiunea a trecut de 8 minute)")
                continue
            try:
                log(f"== {f.__name__}")
                st = R11.straine(s.appcom)
                if st:
                    raise Straina(f"prezentări străine: {st}")
                f(c)
            except Straina:
                raise
            except Exception:  # noqa: BLE001
                c.erori.append(f"{f.__name__}: " + traceback.format_exc()[-600:])
                log(traceback.format_exc()[-600:])
                try:
                    c.inchide_noi({x for x, cl, _ in c.ferestre() if cl == "PPTFrameClass"})
                    if c.backstage_pagina():
                        s.iesi_backstage()
                    R11.cadru(s)
                except Exception:  # noqa: BLE001
                    pass
    except Straina as e:
        c.erori.append(f"STRĂINĂ: {e}")
    finally:
        try:
            inchis = R11.inchide_sigur(s, c.erori)
        except Exception:  # noqa: BLE001
            c.erori.append("închidere: " + traceback.format_exc()[-300:])
        shutil.rmtree(c.tmp, ignore_errors=True)
    out = {"aplicatie": "powerpoint", "generat": time.strftime("%Y-%m-%d %H:%M"), "versiune": U.versiune_exe("POWERPNT.EXE"),
           "versiune_com_build": s.build, "desktop": DESKTOP, "dpi_factor": s.f, "fereastra": getattr(s, "fereastra_css", None),
           "suprafete": c.supr, "fapte": c.fapte, "excluse_personal": c.excluse, "redactari": s.cur.redactari,
           "sarite_cont": sorted(set(s.sarite)), "erori": c.erori + s.erori, "jurnal": LOG, "inchidere": inchis,
           "durata_s": round(time.time() - t0), "rulari": [{"generat": time.strftime("%Y-%m-%d %H:%M"),
                                                            "functii": [f.__name__ for f in alese_f], "inchidere": inchis,
                                                            "durata_s": round(time.time() - t0)}]}
    if BRUT.exists():
        vechi = json.loads(BRUT.read_text(encoding="utf-8"))
        vechi["suprafete"].update(c.supr)
        vechi["fapte"].update(c.fapte)
        for k, v in s.cur.redactari.items():
            vechi["redactari"][k] = vechi["redactari"].get(k, 0) + v
        vechi["excluse_personal"] = sorted(set(vechi.get("excluse_personal", []) + c.excluse))
        vechi["erori"] = [e for e in vechi.get("erori", []) if not any(e.startswith(f.__name__) for f in alese_f)] + \
            c.erori + s.erori
        vechi["jurnal"] = vechi.get("jurnal", []) + LOG
        vechi["rulari"] = vechi.get("rulari", []) + out["rulari"]
        vechi["generat"] = out["generat"]
        out = vechi
    text = W3.fara_cale_personala(json.dumps(out, ensure_ascii=False, indent=1, default=str))
    text = re.sub(MARCAJ + r"[A-Za-z0-9_]*", "<folder>", text)
    for x in s.cur.interzise:
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text.lower()):
            raise RuntimeError("un nume interzis a rămas în ieșire — NU scriu fișierul")
    IES.mkdir(parents=True, exist_ok=True)
    BRUT.write_text(text, encoding="utf-8")
    print(f"{BRUT.name}: {len(c.supr)} suprafețe, {len(c.erori)} erori, {round(time.time() - t0)} s, închidere {inchis}")
    return 0


# ------------------------------------------------------------------------------------------------ scrie / verifica
NUME_SUPR = {   # cheia -> (numele, ce conține, lecțiile care o folosesc)
    "dialog.FileOpen": ("fereastra Open (Ctrl+O › Browse)", "fereastra Windows de deschidere: File name, Files of type "
                        "(All PowerPoint Presentations), Open ▾, Cancel, panoul de navigare, bara de adrese",
                        ["lectii/vi/m1-l03/index.html"]),
    "lista.Font": ("Font ▾ (Home › Font)", "Font ▾: Theme Fonts (Calibri Light (Headings), Calibri (Body)) și All Fonts "
                   "(rândurile vizibile la deschidere)", ["lectii/vi/m2-l08/index.html"]),
    "lista.AnimationStartDropdown": ("Start ▾ (Animations › Timing)", "Start ▾: On Click, With Previous, After Previous",
                                     ["lectii/vi/m1-l07/index.html"]),
    "lista.ShapeFillColorPicker": ("Shape Fill ▾ (Shape Format › Shape Styles; la fel în Home › Drawing)",
                                   "Shape Fill ▾: Theme Colors, Standard Colors, No Fill, More Fill Colors..., Eyedropper, "
                                   "Picture..., Gradient ▸, Texture ▸", ["lectii/vi/m1-l06/index.html"]),
    "lista.OutlineColorPicker": ("Shape Outline ▾ (Shape Format › Shape Styles)", "Shape Outline ▾: Theme Colors, Standard "
                                 "Colors, No Outline, More Outline Colors..., Eyedropper, Weight ▸, Sketched ▸, Dashes ▸, "
                                 "Arrows ▸", ["lectii/vi/m1-l06/index.html"]),
    "lista.OutlineColorPicker#Weight": ("Shape Outline ▾ › Weight ▸", "Weight ▸: ¼ pt … 6 pt, More Lines...",
                                        ["lectii/vi/m1-l06/index.html"]),
    "lista.SlideBackgroundStylesGallery": ("Background Styles ▾ (Design)", "Background Styles ▾: Style 1 … Style 12, Format "
                                           "Background..., Reset Slide Background", ["lectii/vi/m1-l06/index.html"]),
    "bara_stare#Slide Sorter": ("bara de stare în Slide Sorter", "bara de stare după Slide Sorter: fără Notes / Comments, "
                                "Slide Sorter apăsat, Zoom 100 %", ["lectii/vi/m1-l02/index.html"]),
}
NEVERIFICAT_R12 = {
    "hover_tooltip": ("Sfaturile la hover (numele culorii / formei): WM_MOUSEMOVE postat pe „Yellow” din Shape Fill ▾ n-a "
                      "deschis nicio fereastră ToolTip pe desktopul ascuns (c_shape_fill_outline.hover_yellow) — mișcarea "
                      "mouse-ului nu se trimite fidel; rămâne la proba omului (A1 / A2). Numele culorilor și ale formelor "
                      "sunt cele din UIA (Name), nu textul sfatului."),
    "enter_in_save_your_changes": ("Enter în File name din „Save your changes”: Enter = Save ar scrie în Documentele / "
                                   "OneDrive-ul omului, iar caseta nu primește o cale spre %TEMP% (prima încercare: PowerPoint "
                                   "„ocupat”, nimic salvat — 0 fișiere .pptx noi, 0 intrări în HKCU\\Software\\Microsoft\\Office)."),
    "chenarul_formei_alese": ("Ce desenează PowerPoint în jurul formei alese (chenar plin, mânere): diapozitivul nu e expus în "
                              "UI Automation; COM dă doar Selection.Type (2 = forma ca obiect)."),
    "zona_de_note_in_uia": ("Zona de note nu e expusă în UI Automation (niciun nod cu „Notes”, nicio fereastră separată — "
                            "doar mdiClass); textul de îndemn („Click to add notes”) nu se poate citi. Vizibilitatea ei = "
                            "CommandBars.GetPressedMso(\"ShowNotes\")."),
    "all_fonts": ("All Fonts depinde de fonturile instalate pe PC (aici 318); în suprafață doar rândurile vizibile la "
                  "deschidere, toate numele în fapte.c_font.all_fonts. Recently Used Fonts n-a apărut în instanța nouă."),
    "duration_0_5_enter": "„0,5” + Enter în caseta Duration — tot [NEVERIFICAT] (R11-14), neîncercat în runda asta.",
}


SC_NEVERIFICAT = {   # scenarii scrise, dar fără rezultat real probat în runda asta (motivul: nota_autor din scenarii_real)
    "powerpoint-stea-ctrl-c-v": "clipboard-ul omului ocupat în ambele sesiuni — Ctrl+C nu se apasă fără clipboard salvat",
    "powerpoint-note": "clicul postat n-a nimerit zona de note; reluarea cu punctul reparat s-a întrerupt (INCIDENT 12:30)",
}


def taie_all_fonts(v):
    """lista.Font: grupul All Fonts păstrează doar rândurile vizibile în fereastra listei la deschidere."""
    jos = v["rect_css"][1] + v["rect_css"][3]
    for g in W3.cauta_noduri(v, lambda n: n.get("tip") == "Group" and n.get("eticheta") == "All Fonts"):
        tot = len(g.get("copii", []))
        g["copii"] = [k for k in g.get("copii", []) if k.get("rect_css") and k["rect_css"][1] + k["rect_css"][3] <= jos + 0.5]
        g["nota"] = (f"All Fonts are {tot} de rânduri pe acest PC (fonturile instalate); aici doar cele {len(g['copii'])} "
                     "vizibile la deschiderea listei; numele tuturor: acoperire_r12.fapte.c_font.all_fonts")
    return v


def scrie():
    incarca()
    b = json.loads(BRUT.read_text(encoding="utf-8"))
    r = json.loads(REF.read_text(encoding="utf-8"))
    S = r["suprafete"]
    ale_mele = set(r.get("acoperire_r12", {}).get("suprafete_adaugate", []))
    puse, sarite = [], []
    fapte = json.loads(json.dumps(b["fapte"]))
    rs = fapte.get("randuri.lista.ShapeFillColorPicker") or []
    rh = fapte.get("randuri.lista.ShapeFillColorPicker#Home") or []
    fapte.setdefault("c_shape_fill_outline", {})["home_la_fel_ca_shape_format"] = bool(rs) and rs[1:] == rh[1:]
    fapte["c_shape_fill_outline"]["nota_home"] = ("Home › Drawing › Shape Fill ▾ = aceleași rânduri ca Shape Format › Shape "
                                                  "Fill ▾, în afară de primul (numele butonului poartă culoarea de acum: "
                                                  f"„{rs[:1]}” / „{rh[:1]}”) → o singură suprafață, lista.ShapeFillColorPicker")
    if "c_font" in fapte:
        fapte["c_font"]["all_fonts"] = [x for x in fapte["c_font"].pop("toate_randurile", [])
                                        if x not in ("Close", "Line up", "Page up", "Page down", "Line down",
                                                     "Calibri Light (Headings)", "Calibri (Body)")]
    for k, v in b["suprafete"].items():
        if k == "lista.ShapeFillColorPicker#Home" and fapte["c_shape_fill_outline"]["home_la_fel_ca_shape_format"]:
            continue
        if k in S and k not in ale_mele:
            sarite.append(k)
            continue
        v = json.loads(json.dumps(v))
        if k.startswith("lista."):
            pop = W3.cauta_noduri(v, lambda n: n.get("tip") == "Menu")
            if pop and pop[0] is not v:
                nv = dict(pop[0])
                nv["deschis_prin"] = v.get("deschis_prin")
                nv["nota"] = ("lista deschisă = fereastra-popup (Menu) a controlului; controlul („" + str(v.get("eticheta")) +
                              "”) e în panglica.<filă> / panglica_context.<filă>")
                v = nv
        if k == "lista.Font":
            v = taie_all_fonts(v)
        S[k] = v
        puse.append(k)
    r["acoperire_r12"] = {
        "generat": b["generat"], "versiune": b["versiune"], "versiune_com_build": b["versiune_com_build"],
        "cum": ("referinte/acoperire_powerpoint_r12.py capturi: instanța MEA POWERPNT /B pe desktopul ascuns "
                f"{b['desktop']} (pornită doar după ce tasklist n-a arătat niciun POWERPNT.EXE), fereastra 1366×768 css "
                "(Sesiune din dump_uia_office.py), legătura COM din fereastra instanței (AccessibleObjectFromWindow); "
                "gesturile: clic de mouse postat (WM_LBUTTONDOWN/UP) pe forme și în zona de lucru, WM_KEYDOWN cu Ctrl ținut, "
                "WM_CHAR, UIA Expand/Invoke/Select/Toggle; formele de probă puse prin COM (Shapes.AddShape / AddTextbox); "
                "fișierele de probă în %TEMP% (dosar unic, șters la final); arborii normalizați și redactați ca în dump"),
        "suprafete_adaugate": puse, "chei_vechi_neatinse": sarite, "fapte": fapte, "NEVERIFICAT": NEVERIFICAT_R12,
        "excluse_personal": b.get("excluse_personal", []), "redactari": b.get("redactari", {}),
        "erori": [e for e in b.get("erori", []) if not e.startswith(("b_enter_save", "c_bg"))],
        "erori_lamurite": ["b_enter_save: vezi NEVERIFICAT.enter_in_save_your_changes",
                           "c_bg (prima rulare): SlideMaster n-are FollowMasterBackground — doar citirea masterului a căzut; "
                           "fundalurile diapozitivelor sunt citite (fapte.c_background_styles)"],
        "rulari": b.get("rulari", []),
    }
    text = json.dumps(r, ensure_ascii=False, indent=1)
    for x in W3.interzise():
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text.lower()):
            raise RuntimeError("un nume interzis a rămas — NU scriu uia_powerpoint.json")
    if re.search(r"c:[\\/]+users[\\/]", text.lower()):
        raise RuntimeError("o cale C:/Users a rămas — NU scriu uia_powerpoint.json")
    REF.write_text(text, encoding="utf-8")
    print(f"uia_powerpoint.json: {len(puse)} suprafețe noi: {puse}; neatinse: {sarite}")
    scrie_suprafete(puse)
    return 0


def scrie_suprafete(puse):
    f = D / "suprafete.json"
    s = json.loads(f.read_text(encoding="utf-8"))
    pp = s["aplicatii"]["powerpoint"]
    ids = {x["id"] for x in pp["suprafete"]}
    noi = []
    for k in puse:
        sid = "powerpoint." + k
        nume, ce, pag = NUME_SUPR.get(k, (k, k, []))
        e = {"id": sid, "nume": nume, "ce_contine": ce,
             "sursa": f"referinte/uia_powerpoint.json › {k} (UI Automation pe PowerPoint real, desktop ascuns, "
                      "referinte/acoperire_powerpoint_r12.py, 20.11.2026)",
             "in_aplicatia_reala": True, "pagini": len(pag), "lista_pagini": pag, "folosita_in_lectii": bool(pag)}
        if sid in ids:
            pp["suprafete"] = [e if x["id"] == sid else x for x in pp["suprafete"]]
        else:
            pp["suprafete"].append(e)
        noi.append(sid)
    pp["nr_suprafete"] = len(pp["suprafete"])
    pp["nr_suprafete_folosite"] = sum(1 for x in pp["suprafete"] if x.get("folosita_in_lectii"))
    s["acoperire_r12"] = ("20.11.2026, runda `acoperire` pe PowerPoint după runda 12: suprafețele PowerPoint capturate din "
                          "aplicația reală (referinte/acoperire_powerpoint_r12.py) adăugate cu sursa: " + ", ".join(noi) +
                          ". inventar_build.py NU le știe: o regenerare a fișierului le-ar pierde (de refăcut din "
                          "uia_powerpoint.json › acoperire_r12).")
    f.write_text(json.dumps(s, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"suprafete.json: {len(noi)} intrări powerpoint.<cheie> ({pp['nr_suprafete']} suprafețe PowerPoint)")


def verifica():
    incarca()
    p = []
    r = json.loads(REF.read_text(encoding="utf-8"))
    S = r["suprafete"]
    ac = r.get("acoperire_r12")
    if not ac:
        p.append("uia_powerpoint.json nu are blocul acoperire_r12")
    else:
        for k in ac.get("suprafete_adaugate", []):
            if k not in S:
                p.append(f"suprafața {k} anunțată, dar lipsă")
    text = REF.read_text(encoding="utf-8").lower()
    for x in W3.interzise():
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text):
            p.append("nume interzis în uia_powerpoint.json")
    if re.search(r"c:[\\/]+users[\\/]", text) or MARCAJ in text:
        p.append("cale cu C:/Users sau dosarul meu temporar în uia_powerpoint.json")
    sup = json.loads((D / "suprafete.json").read_text(encoding="utf-8"))
    sids = {x["id"] for x in sup["aplicatii"]["powerpoint"]["suprafete"]}
    for k in (ac or {}).get("suprafete_adaugate", []):
        if "powerpoint." + k not in sids:
            p.append(f"suprafete.json n-are powerpoint.{k}")
    for s in SCENARII:
        f = D / "scenarii" / "powerpoint" / f"{s['id']}.json"
        if not f.exists():
            p.append(f"scenariul {s['id']} lipsește")
        fr = AICI / "scenarii_real" / f"{s['id']}.json"
        if not fr.exists():
            p.append(f"scenarii_real/{s['id']}.json lipsește (nerulat)")
            continue
        tr = fr.read_text(encoding="utf-8")
        if re.search(r"c:[\\/]+users[\\/]", tr.lower()) or MARCAJ in tr.lower():
            p.append(f"cale personală / dosarul meu în scenarii_real/{s['id']}.json")
        rz = json.loads(tr)
        if s["id"] in SC_NEVERIFICAT:
            if not rz.get("nota_autor") or rz.get("mod_probat"):
                p.append(f"scenarii_real/{s['id']}.json: [NEVERIFICAT] fără nota_autor (sau marcat probat)")
            continue
        if rz.get("eroare") or not rz.get("mod_probat"):
            p.append(f"scenarii_real/{s['id']}.json: eroare sau mod_probat false")
    for x in p:
        print("PROBLEMĂ:", x)
    print(len(p))
    return 1 if p else 0


# ------------------------------------------------------------------------------------------------ scenariile (lotul 2)
D_DIA = R11.D_DIA
D_FORME = (R11.D_FORME + "; un substituent al aspectului care a primit o imagine (Two Content › Pictures) are fel: imagine")
D_FONT = ("font_text = numele fontului literelor casetei din forma_citita, cum îl dă PowerPoint (TextRange.Font.Name: "
          "„Calibri Light” după Calibri Light (Headings) din Theme Fonts — caseta Font arată atunci „Calibri Light (Headings)”)")
D_PORNIRE = ("pornire_animatii = pe fiecare diapozitiv, cum pornește fiecare animație, în ordinea din Animation Pane: "
             "la_clic (On Click) | cu_precedenta (With Previous) | dupa_precedenta (After Previous) "
             "(Effect.Timing.TriggerType 1 / 2 / 3)")
D_UMPLERE = ("umplere_forme = pe fiecare diapozitiv, umplerea fiecărei forme în ordinea din Shapes: {tip: fara | solid | "
             "gradient | imagine | textura | model | alt, culoare: #RRGGBB (doar la solid)} (Shape.Fill: Visible, Type, "
             "ForeColor.RGB); casetele aspectului fără umplere = {tip: fara}")
D_NOTE = ("note_diapozitive = textul din zona de note a fiecărui diapozitiv, \"\" dacă n-are "
          "(NotesPage.Shapes.Placeholders(2).TextFrame.TextRange.Text)")
D_VEDERE = ("vedere = normala (Normal) | sortare (Slide Sorter) | citire (Reading View) | expunere (Slide Show) | "
            "pagina_note (Notes Page) — ActiveWindow.ViewType 9 / 7 / 3; citire / expunere = o fereastră de expunere "
            "deschisă (SlideShowWindows), IsFullScreen fals / adevărat")
D_DURATA = ("durata_tranzitie = durata tranziției fiecărui diapozitiv, în secunde (SlideShowTransition.Duration, 2 zecimale); "
            "caseta Duration arată aceeași valoare („00,70”, „01,00”)")
L = "lectii/vi/"
STEA = {"fel": "forma", "forma": "Star: 5 Points", "pozitie": [60, 180, 180, 170]}
TREI = [{"aspect": "Title Slide", "texte": ["Albinele"]}, {"aspect": "Title and Content", "texte": ["B"]},
        {"aspect": "Title and Content", "texte": ["C"]}]
SCENARII = [   # ordinea contează: blank-presentation PRIMUL (numele PresentationN depinde de câte prezentări a făcut instanța)
    {"id": "powerpoint-blank-presentation", "mod": "gest_real", "start": {"diapozitive": [{"aspect": "Title Slide"}]},
     "pasi": [{"gest": "clic", "tinta": "mso:FileTabButton", "real": "uia:FileTabButton"},
              {"gest": "clic", "tinta": "backstage:New", "real": "uia:nav:New"},
              {"gest": "clic", "tinta": "backstage:Blank Presentation", "real": "uia:blank"}],
     "stare_citita": ["prezentare_activa", "prezentari_deschise"],
     "descriere": "PowerPoint abia pornit, cu prezentarea lui („Presentation1”, un diapozitiv Title Slide gol); File › New › "
                  "Blank Presentation. prezentare_activa = numele prezentării active după gest (Presentation.Name; null fără "
                  "prezentare); prezentari_deschise = câte prezentări sunt deschise.",
     "lectii": ["vi/m1-l03"], "sursa_gest": L + "m1-l03/index.html:105", "pornire": True},
    {"id": "powerpoint-ctrl-o-browse", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide"}],
               "fisiere": [{"nume": "Plante_6A_Pop.pptx", "diapozitive": [{"aspect": "Title Slide", "texte": ["Plante"]}]}]},
     "pasi": [{"gest": "taste", "taste": "Ctrl+O"},
              {"gest": "clic", "tinta": "backstage:Browse", "real": "uia:Browse_open"},
              {"gest": "tasteaza", "text": "Plante_6A_Pop.pptx", "real": "cale_temp"},
              {"gest": "taste", "taste": "Enter"}],
     "stare_citita": ["prezentare_activa", "prezentari_deschise"],
     "descriere": "O prezentare nouă deschisă; în dosarul de lucru e fișierul Plante_6A_Pop.pptx (start.fisiere); Ctrl+O "
                  "(Backstage › Open) › Browse (fereastra Open, Files of type: All PowerPoint Presentations), numele "
                  "„Plante_6A_Pop.pptx” în File name, Enter (= Open). prezentare_activa = numele prezentării active "
                  "(Presentation.Name, cu extensia); prezentari_deschise = câte sunt deschise (cea nouă rămâne).",
     "lectii": ["vi/m1-l03"], "sursa_gest": L + "m1-l03/index.html:241"},
    {"id": "powerpoint-stea-ctrl-c-v", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Only", "texte": ["Soarele"], "forme": [STEA]},
                               {"aspect": "Title Only", "texte": ["Planetele"]}], "diapozitiv_activ": 1},
     "pasi": [{"gest": "clic", "tinta": "forma:1/2", "real": "mouse:forma:1/2"},
              {"gest": "taste", "taste": "Ctrl+C"},
              {"gest": "clic", "diapozitiv": 2, "real": "mouse:miniatura:2"},
              {"gest": "taste", "taste": "Ctrl+V"}],
     "stare_citita": ["forme_diapozitiv", "pozitii_forme"],
     "descriere": "Diapozitivul 1 „Soarele” (Title Only) cu o stea (Star: 5 Points, fără text) pusă din start.forme; un clic "
                  "în MIJLOCUL stelei (PowerPoint o alege ca obiect — Selection.Type 2, nu cursor în text), Ctrl+C, clic pe "
                  "miniatura diapozitivului 2, Ctrl+V. " + D_FORME + ".",
     "lectii": ["vi/m1-l05"], "sursa_gest": L + "m1-l05/index.html:188"},
    {"id": "powerpoint-font-titlu", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Munții Rodnei"], "fonturi": ["Comic Sans MS"]}],
               "selectie_forma": [1, 1], "forma_citita": [1, 1]},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabHome", "id_mso": "Font", "element": "Calibri Light (Headings)"}],
     "stare_citita": ["font_text"],
     "descriere": "Titlul „Munții Rodnei”, scris cu Comic Sans MS (start.diapozitive[].fonturi), ales ca obiect (clic pe "
                  "chenar); Home › Font ▾ › Calibri Light (Headings), primul rând din Theme Fonts. " + D_FONT + ".",
     "lectii": ["vi/m2-l08"], "sursa_gest": L + "m2-l08/index.html:167"},
    {"id": "powerpoint-animatie-start", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Norul"]}], "selectie_forma": [1, 1]},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabAnimations", "id_mso": "AnimationGallery", "element": "Fade"},
              {"gest": "comanda_panglica", "fila": "TabAnimations", "tinta": "panglica:Animations/Timing/Start",
               "element": "After Previous", "real": "uia:start:After Previous"}],
     "stare_citita": ["pornire_animatii", "diapozitive"],
     "descriere": "Titlul „Norul” ales ca obiect; Animations › Fade; apoi Start ▾ (Animations › Timing; idMso "
                  "AnimationStartDropdown) › After Previous. " + D_PORNIRE + "; " + D_DIA + ".",
     "lectii": ["vi/m1-l07"], "sursa_gest": L + "m1-l07/index.html:225"},
    {"id": "powerpoint-shape-fill", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Only", "texte": ["Soarele"],
                                "forme": [{"fel": "forma", "forma": "Star: 5 Points", "pozitie": [380, 200, 200, 190]}]}],
               "selectie_forma": [1, 2]},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabHome", "id_mso": "ShapeFillColorPicker_Dropdown", "element": "Yellow"}],
     "stare_citita": ["umplere_forme"],
     "descriere": "Steaua (din start.forme) aleasă ca obiect; Shape Fill ▾ › Yellow (Standard Colors) — aceeași listă în Home › "
                  "Drawing și în Shape Format › Shape Styles (uia_powerpoint.json › lista.ShapeFillColorPicker). " + D_UMPLERE + ".",
     "lectii": ["vi/m1-l06"], "sursa_gest": L + "m1-l06/index.html:172"},
    {"id": "powerpoint-background-styles", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}, {"aspect": "Title and Content", "texte": ["B"]}],
               "diapozitiv_activ": 1},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabDesign", "id_mso": "SlideBackgroundStylesGallery", "element": "Style 6"}],
     "stare_citita": ["fundal_diapozitive"],
     "descriere": "Două diapozitive, primul activ, nimic ales; Design › Background Styles ▾ › Style 6 (clic simplu: stilul "
                  "trece pe TOATE diapozitivele). fundal_diapozitive = pe fiecare diapozitiv {tip: solid | gradient | imagine "
                  "| textura | model | alt, culoare: #RRGGBB (doar la solid)} (Slide.Background.Fill).",
     "lectii": ["vi/m1-l06"], "sursa_gest": L + "m1-l06/index.html:207"},
    {"id": "powerpoint-note", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Șahul"]},
                               {"aspect": "Title and Content", "texte": ["Cum mută calul"]}], "diapozitiv_activ": 2},
     "pasi": [{"gest": "clic", "tinta": "zona_note", "real": "mouse:note"},
              {"gest": "tasteaza", "text": "Arăt pe tablă o mutare a calului."}],
     "stare_citita": ["note_diapozitive"],
     "descriere": "Două diapozitive, al doilea activ; zona de note vizibilă sub diapozitiv (View › Notes apăsat, ca la "
                  "pornirea PowerPoint pe acest PC); clic în zona de note, apoi tastarea propoziției. " + D_NOTE + ".",
     "lectii": ["vi/m2-l09", "vi/m1-l02"], "sursa_gest": L + "m2-l09/index.html:329"},
    {"id": "powerpoint-slide-sorter", "mod": "gest_real", "start": {"diapozitive": TREI, "diapozitiv_activ": 2},
     "pasi": [{"gest": "clic", "tinta": "bara_stare:Slide Sorter", "real": "uia:bara_stare:Slide Sorter"}],
     "stare_citita": ["vedere"],
     "descriere": "Trei diapozitive, al doilea activ, vederea Normal; Slide Sorter din bara de stare. " + D_VEDERE + ".",
     "lectii": ["vi/m1-l02"], "sursa_gest": L + "m1-l02/index.html:222"},
    {"id": "powerpoint-slide-sorter-normal", "mod": "gest_real", "start": {"diapozitive": TREI, "diapozitiv_activ": 2},
     "pasi": [{"gest": "clic", "tinta": "bara_stare:Slide Sorter", "real": "uia:bara_stare:Slide Sorter"},
              {"gest": "clic", "tinta": "bara_stare:Normal", "real": "uia:bara_stare:Normal"}],
     "stare_citita": ["vedere"],
     "descriere": "Trei diapozitive; Slide Sorter din bara de stare, apoi Normal (drumul înapoi). " + D_VEDERE + ".",
     "lectii": ["vi/m1-l02"], "sursa_gest": L + "m1-l02/index.html:225"},
    {"id": "powerpoint-durata-fade", "mod": "gest_real", "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["A"]}]},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabTransitions", "id_mso": "AnimationTransitionGallery", "element": "Fade"}],
     "stare_citita": ["durata_tranzitie"],
     "descriere": "Un diapozitiv fără tranziție (Duration „02,00”); Transitions › Fade. " + D_DURATA + ".",
     "lectii": ["vi/m1-l07", "vi/m2-l10"], "sursa_gest": L + "m1-l07/index.html:156"},
    {"id": "powerpoint-durata-push", "mod": "gest_real", "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["A"]}]},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabTransitions", "id_mso": "AnimationTransitionGallery", "element": "Push"}],
     "stare_citita": ["durata_tranzitie"],
     "descriere": "Un diapozitiv fără tranziție; Transitions › Push. " + D_DURATA + ".",
     "lectii": ["vi/m1-l07"], "sursa_gest": L + "m1-l07/index.html:156"},
    {"id": "powerpoint-durata-wipe", "mod": "gest_real", "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["A"]}]},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabTransitions", "id_mso": "AnimationTransitionGallery", "element": "Wipe"}],
     "stare_citita": ["durata_tranzitie"],
     "descriere": "Un diapozitiv fără tranziție; Transitions › Wipe. " + D_DURATA + ".",
     "lectii": ["vi/m1-l07"], "sursa_gest": L + "m1-l07/index.html:156"},
    {"id": "powerpoint-imagine-two-content", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Planetele"]},
                               {"aspect": "Two Content", "texte": ["Pământul", "A treia planetă"]}], "diapozitiv_activ": 2},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabInsert", "id_mso": "FlyoutAnchorInsertPictures",
               "element": "This Device...", "fisier": "pamant.png", "real": "uia:imagine"}],
     "stare_citita": ["forme_diapozitiv", "pozitii_forme"],
     "descriere": "Diapozitivul 2 Two Content: titlul și caseta din stânga scrise, caseta din dreapta GOALĂ, nimic ales; Insert "
                  "› Pictures › This Device..., numele „pamant.png”, Enter. PowerPoint pune imaginea ÎN caseta goală din "
                  "dreapta (rămân 3 forme). " + D_FORME + ".",
     "lectii": ["vi/m2-l09"], "sursa_gest": L + "m2-l09/index.html:242"},
]


def scrie_scenarii():
    dosar = D / "scenarii" / "powerpoint"
    for s in SCENARII:
        sc = {"id": s["id"], "aplicatie": "powerpoint", "mod": s["mod"], "descriere": s["descriere"] + " (runda `acoperire` "
              "după runda 12, 20.11.2026; rezultatul real: referinte/acoperire_powerpoint_r12.py scenarii)", "start": s["start"],
              "pasi": s["pasi"], "stare_citita": s["stare_citita"], "lectii": s["lectii"], "sursa_gest": s["sursa_gest"],
              "rulat_de": RULAT_DE}
        (dosar / f"{s['id']}.json").write_text(json.dumps(sc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"scenarii: {len(SCENARII)} noi (rulat_de = {RULAT_DE})")
    return 0


def fel_forma(sh):
    o = R11.tip_forma(sh)
    if o["fel"] == "substituent":
        try:
            if int(sh.PlaceholderFormat.ContainedType) == 13:
                return {"fel": "imagine"}
        except Exception:  # noqa: BLE001
            pass
    return o


def clasa_ppt_r12():
    import win32gui
    Baza = R11.clasa_ppt_r11()

    class PowerPointR12(Baza):
        @property
        def CHEI_AMPRENTA(self):   # noqa: N802
            return ["diapozitive", "tema", "fundal_diapozitive", "durata_tranzitie", "umplere_forme", "pornire_animatii",
                    "note_diapozitive", "vedere"] + \
                (["formatare_text", "culoare_text", "font_text"] if getattr(self, "forma_citita", None) else [])

        def start(self, st):
            """RR.PowerPoint.start (prezentare NOUĂ), plus din §7.1: diapozitive[].forme, diapozitive[].fonturi, fisiere."""
            self.canale_r11, self.dlg_r11, self.noi_r11, self.dlg_x = set(), None, [], None
            self.forma_citita = st.get("forma_citita")
            self.curata()
            self.inchide_ferestre_straine()
            a = self.a
            vechi = self.p
            nou = a.Presentations.Add(True)
            nou.Tags.Add("LHREF", "1")
            vechi.Saved = -1
            vechi.Close()
            time.sleep(1.5)
            self.ferestre()
            self.baza = {x for x, _, _ in U.ferestre_pid(self.s.proc.pid)}
            p = self.p
            self.construieste(p, st.get("diapozitive", [{"aspect": "Title Slide"}]))
            for fi in st.get("fisiere", []):
                q = a.Presentations.Add(False)
                q.Tags.Add("LHREF", "1")
                self.construieste(q, fi.get("diapozitive", [{"aspect": "Title Slide"}]))
                q.SaveAs(str(self.tmp / fi["nume"]))
                q.Close()
            time.sleep(0.5)
            self.ferestre()
            w = a.ActiveWindow
            w.ViewType = 9
            w.View.GotoSlide(st.get("diapozitiv_activ", 1))
            if st.get("selectie_forma"):
                n, k = st["selectie_forma"]
                p.Slides(n).Shapes(k).Select()
            if st.get("selectie_text"):
                n, k = st["selectie_text"]
                p.Slides(n).Shapes(k).TextFrame.TextRange.Select()
            if st.get("panou") == "miniaturi":
                w.Panes(1).Activate()
                p.Slides(st.get("diapozitiv_activ", 1)).Select()
            time.sleep(0.8)

        def construieste(self, p, diapozitive):
            lay = {str(cl.Name): cl for cl in p.SlideMaster.CustomLayouts}
            for i, dz in enumerate(diapozitive, start=1):
                sl = p.Slides.AddSlide(i, lay[dz.get("aspect", "Title Slide")])
                texte, fonturi = dz.get("texte", []), dz.get("fonturi", [])
                k = 0
                for sh in sl.Shapes:
                    if sh.HasTextFrame and k < len(texte):
                        sh.TextFrame.TextRange.Text = texte[k]
                        if k < len(fonturi) and fonturi[k]:
                            sh.TextFrame.TextRange.Font.Name = fonturi[k]
                        k += 1
                for fm in dz.get("forme", []):
                    l_, t_, w_, h_ = fm["pozitie"]
                    if fm["fel"] == "forma":
                        sh = sl.Shapes.AddShape(COD_FORMA[fm["forma"]], l_, t_, w_, h_)
                    elif fm["fel"] == "caseta_text":
                        sh = sl.Shapes.AddTextbox(1, l_, t_, w_, h_)
                    elif fm["fel"] == "imagine":
                        src = self.tmp / fm.get("fisier", "imagine.png")
                        shutil.copyfile(SURSA_PNG, src)
                        sh = sl.Shapes.AddPicture(str(src), False, True, l_, t_, w_, h_)
                    else:
                        raise RuntimeError(f"start.forme: fel necunoscut {fm['fel']}")
                    if fm.get("text"):
                        sh.TextFrame.TextRange.Text = fm["text"]
                    if fm.get("umplere"):
                        sh.Fill.ForeColor.RGB = bgr(fm["umplere"])

        def real(self, p):
            r, s, a = p["real"], self.s, self.a
            if r.startswith("mouse:forma:"):
                n, k = (int(v) for v in r.split(":")[-1].split("/"))
                w = a.ActiveWindow
                w.Panes(2).Activate()
                sh = self.p.Slides(n).Shapes(k)
                x, y = punct_forma(a, sh, 0.5, 0.55)
                clic(self.hmain, x, y)
                time.sleep(0.6)
                self.sel_r12 = selectia(a)
                self.canale_r11.add("mouse")
                return (f"clic de mouse postat (WM_LBUTTONDOWN/UP) în mijlocul formei {n}/{k} — după clic Selection.Type = "
                        f"{self.sel_r12.get('Selection.Type')} ({self.sel_r12.get('fel')})")
            if r.startswith("mouse:miniatura:"):
                n = int(r.split(":")[-1])
                rez = clic_miniatura(s, a, n)
                if rez.get("gasit"):
                    self.canale_r11.add("mouse")
                    return (f"clic de mouse postat pe miniatura {n} (punctul {rez['punct_css_in_zona']} css în zona documentului; "
                            f"după clic PowerPoint arată diapozitivul {n} ales în panoul miniaturilor)")
                a.ActiveWindow.Panes(1).Activate()
                self.p.Slides(n).Select()
                time.sleep(0.8)
                self.canale_r11.add("model_obiect")
                return f"miniatura {n} aleasă prin COM (Panes(1).Activate + Slide.Select) — clicul de mouse n-a nimerit-o"
            if r == "uia:blank":
                vechi = {str(q.Name) for q in a.Presentations}
                bv = U.gaseste(U.din_hwnd(self.hmain), U.P_AID, "BackstageView")
                bl = RR.gaseste_nume(bv, "Blank Presentation", (50007, 50000, 50011)) if bv else None
                if bl is None:
                    raise RuntimeError("„Blank Presentation” negăsit în File › New")
                W3.pornit_in_fir(lambda e=bl: RR.uia_invoke(e), 5)
                for _ in range(20):
                    time.sleep(0.5)
                    if int(a.Presentations.Count) > len(vechi):
                        break
                time.sleep(1.5)
                if int(a.Presentations.Count) > len(vechi):
                    R11.eticheteaza_noua(a, vechi)
                self.canale_r11.add("panglica")
                return "UIA Invoke pe „Blank Presentation” (File › New)"
            if r == "uia:Browse_open":
                it = RR.gaseste_nume(U.din_hwnd(self.hmain), "Browse", (50000, 50007, 50011, 50005))
                if it is None:
                    raise RuntimeError("Backstage › Open: „Browse” negăsit")
                inainte = {x for x, _, _ in self.cap.ferestre()}
                W3.pornit_in_fir(lambda e=it: RR.uia_invoke(e) or RR.uia_legacy(e), 4)
                dl = self.cap.noi(inainte, 10, ("#32770",))
                if not dl:
                    raise RuntimeError("fereastra Open n-a apărut după Browse")
                time.sleep(1.5)
                self.canale_r11.add("panglica")
                return f"UIA Invoke pe „Browse” (Backstage › Open) → fereastra „{dl[0][2]}” (#32770)"
            if r.startswith("uia:start:"):
                rand = r[len("uia:start:"):]
                self.fila(p["fila"])
                st = RR.gaseste_nume(U.din_hwnd(self.hmain), "Start", (50003,))
                if st is None:
                    raise RuntimeError("caseta Start (Animations › Timing) negăsită")
                inainte = {x for x, _, _ in self.cap.ferestre()}
                RR.uia_expand(st)
                noi = self.cap.noi(inainte, 4)
                it = element_in(noi, rand) or RR.gaseste_nume(st, rand, (50007,))
                if it is None:
                    raise RuntimeError(f"„{rand}” nu e în lista Start")
                if not (RR.uia_select(it) or RR.uia_invoke(it) or RR.uia_legacy(it)):
                    raise RuntimeError(f"„{rand}”: Select/Invoke refuzate")
                time.sleep(1.0)
                RR.uia_collapse(st)
                self.cap.inchide_noi(inainte)
                self.canale_r11.add("panglica")
                return f"UIA Expand pe Start ▾ (Animations › Timing), UIA Select pe „{rand}”"
            if r.startswith("uia:bara_stare:"):
                nume = r[len("uia:bara_stare:"):]
                bt = bara_stare_buton(s, nume)
                if bt is None:
                    raise RuntimeError(f"„{nume}” nu e în bara de stare")
                apasa_fir(bt)
                time.sleep(2.5)
                self.canale_r11.add("panglica")
                return f"UIA Invoke pe „{nume}” din bara de stare"
            if r == "mouse:note":
                w = a.ActiveWindow
                w.Panes(2).Activate()
                mc = U.copii_clasa(self.hmain, ["MDIClient"]) or U.copii_clasa(self.hmain, ["mdiClass"])
                rc = win32gui.GetWindowRect(mc[0])
                sv = float(w.SplitVertical)
                y_sep = rc[1] + (rc[3] - rc[1]) * sv / 100.0
                x = w.PointsToScreenPixelsX(self.p.PageSetup.SlideWidth * 0.5)
                probe = []
                for fr in (0.5, 0.35, 0.65, 0.2, 0.8):
                    y = y_sep + (rc[3] - y_sep) * fr
                    for _ in range(2):
                        clic(self.hmain, x, y)
                        time.sleep(0.6)
                        sel = selectia(a)
                        probe.append([fr, round((y - rc[1]) / s.f), sel.get("fel"), sel.get("forma"), sel.get("panou_activ_ViewType")])
                        if sel.get("fel") == "cursor_in_text" and "note" in str(sel.get("forma", "")).lower():
                            self.canale_r11.add("mouse")
                            return (f"clic de mouse postat în zona de note (SplitVertical = {sv:g} % din înălțimea zonei "
                                    f"documentului e diapozitivul; punctul la {fr:g} din zona de note, mijlocul diapozitivului; "
                                    f"încercări {len(probe)}) — după clic: cursor în „{sel.get('forma')}”")
                raise RuntimeError(f"clicul în zona de note n-a pus cursorul în note (SplitVertical {sv:g}; probe {probe})")
            return super().real(p)

        def citeste(self, chei):
            mele = {"font_text", "pornire_animatii", "umplere_forme", "note_diapozitive", "vedere", "forme_diapozitiv"}
            rest = [k for k in chei if k not in mele]
            rez = super().citeste(rest) if rest else {}
            for k in chei:
                if k == "font_text":
                    d, f = self.forma_citita
                    rez[k] = str(self.p.Slides(d).Shapes(f).TextFrame.TextRange.Font.Name)
                elif k == "pornire_animatii":
                    rez[k] = [[TRIGGER.get(int(sl.TimeLine.MainSequence.Item(i).Timing.TriggerType), "alt")
                               for i in range(1, sl.TimeLine.MainSequence.Count + 1)] for sl in self.p.Slides]
                elif k == "umplere_forme":
                    rez[k] = [[{x: v for x, v in umplere(sh).items() if x in ("tip", "culoare")} for sh in sl.Shapes]
                              for sl in self.p.Slides]
                elif k == "note_diapozitive":
                    rez[k] = [nota(sl) for sl in self.p.Slides]
                elif k == "vedere":
                    rez[k] = vedere(self.a)
                elif k == "forme_diapozitiv":
                    rez[k] = [[dict(fel_forma(sh), text=R11.text_forma(sh)) for sh in sl.Shapes] for sl in self.p.Slides]
            return {k: rez[k] for k in chei}

        def inchide_tot(self):
            try:
                if int(self.a.SlideShowWindows.Count):
                    for ssw in self.a.SlideShowWindows:
                        ssw.View.Exit()
                if int(self.a.ActiveWindow.ViewType) != 9:
                    self.a.ActiveWindow.ViewType = 9
            except Exception:  # noqa: BLE001
                pass
            super().inchide_tot()
    return PowerPointR12


def ruleaza_unul_r12(r, sc, versiune, pornire=False):
    cum, eroare, stare, extra = [], None, {}, {}
    clip, are_clip = None, any(p_.get("taste") == "Ctrl+C" for p_ in sc["pasi"])
    try:
        if are_clip:
            ok, clip = R11.clipboard_doar_text()
            if not ok:
                info, clip, are_clip = clip, None, False
                raise RuntimeError(f"NERULAT: clipboard-ul omului nu se poate salva ca text ({info}) — nu-l ating")
            R11.clipboard_pune(None)
            extra["clipboard"] = ("clipboard-ul omului (doar text) salvat înainte, golit înainte de Ctrl+C (ca o lipire fără "
                                  "copiere să nu aducă textul lui), pus la loc după scenariu")
        if pornire:
            r.start_pornire(sc["start"])
        else:
            r.start(sc["start"])
        if sc["id"] == "powerpoint-note":
            note0 = bool(r.a.CommandBars.GetPressedMso("ShowNotes"))
            extra["zona_note_vizibila_la_pornire"] = note0
            if not note0:
                raise RuntimeError("zona de note e ascunsă la pornire (View › Notes neapăsat) — nu o schimb")
        for p_ in sc["pasi"]:
            cum.append(r.pas_gest(p_))
        time.sleep(1.0)
        ram = [(c, r.s.cur.text(t)) for x, c, t in r.cap.ferestre() if x not in r.baza and c in ("#32770", "NUIDialog")]
        if ram:
            extra["ferestre_ramase_dupa_pasi"] = ram
            r.inchide_tot()
        st_ = R11.straine(r.a)
        if st_:
            raise Straina(f"prezentări străine după pași: {st_}")
        stare = r.citeste(sc["stare_citita"])
    except Straina:
        raise
    except Exception as e:  # noqa: BLE001
        eroare = W3.fara_cale_personala(f"{type(e).__name__}: {e}"[:600])
        stare = {}
        log(traceback.format_exc()[-1200:])
    finally:
        try:
            r.inchide_tot()
        except Exception:  # noqa: BLE001
            pass
        if are_clip:
            extra["clipboard_pus_la_loc"] = R11.clipboard_pune(clip)
    canale = set(r.canale_r11)
    rez = {"id": sc["id"], "stare": stare, "eroare": eroare,
           "cum": re.sub(MARCAJ + r"\w*", "<folder>", W3.fara_cale_personala(
               f"gest_real — instanță NOUĂ powerpoint ({versiune}), desktop ascuns {DESKTOP_SC}, "
               f"{time.strftime('%d.%m.%Y %H:%M')}, {RULAT_DE} (pe clasele din ruleaza_real.py și acoperire_powerpoint_r11.py); "
               "pașii: " + " · ".join(cum) + "; pornirea (diapozitive, forme, fonturi, fișiere) și citirea stării prin COM; "
               "fișierele de probă în %TEMP% (dosar unic, șters la final)")),
           "canale": sorted(canale), **extra}
    log(f"  {sc['id']}: {'OK' if eroare is None else 'EROARE ' + eroare[:200]} canale={sorted(canale)} "
        f"stare={json.dumps(stare, ensure_ascii=False)[:400]}")
    return rez


def scenarii_intern():
    incarca()
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    if R11.ppt_ruleaza():
        print("SĂRIT: POWERPNT.EXE rulează deja — nu pornesc.")
        return 3
    ordine = [s["id"] for s in SCENARII]
    iduri = next((x.split("=", 1)[1].split(",") for x in sys.argv if x.startswith("--id=")), ordine)
    sc = [s for s in SCENARII if s["id"] in iduri]
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    r = clasa_ppt_r12()("powerpoint")
    rez, t0, erori, inchis = [], time.time(), [], {}
    try:
        r.porneste()
        RR.BARIERA[0] = lambda: r.a.Version
        versiune = f"{U.versiune_exe('POWERPNT.EXE')}, build COM {r.s.build}"
        if sc and sc[0].get("pornire"):
            rez.append(ruleaza_unul_r12(r, sc.pop(0), versiune, pornire=True))
        for f_ in (RR.proba, R11.proba_mouse):
            try:
                f_(r)
            except Straina:
                raise
            except Exception:  # noqa: BLE001
                log(f"{f_.__name__} a căzut:\n" + traceback.format_exc()[-800:])
        for s in sc:
            if time.time() - t0 > 480:
                erori.append(f"{s['id']}: sărit (sesiunea a trecut de 8 minute)")
                continue
            rez.append(ruleaza_unul_r12(r, s, versiune))
    except Straina as e:
        erori.append(f"STRĂINĂ: {e} — NU_SE_POATE")
    except Exception:  # noqa: BLE001
        erori.append(traceback.format_exc()[-800:])
        log(traceback.format_exc())
    finally:
        try:
            inchis = R11.inchide_sigur(r.s, erori)
        except Exception:  # noqa: BLE001
            erori.append("închidere: " + traceback.format_exc()[-300:])
        shutil.rmtree(r.tmp, ignore_errors=True)
    RR.REAL.mkdir(parents=True, exist_ok=True)
    for x in rez:
        canale = x["canale"]
        probat = x["eroare"] is None and bool(canale) and all(r.probe.get(c, {}).get("trecut") for c in canale)
        neprob = sorted(c for c in canale if not r.probe.get(c, {}).get("trecut"))
        out = {"id": x["id"], "mod_probat": probat, "stare": x["stare"], "eroare": x["eroare"], "cum": x["cum"],
               "canale": canale, "canale_neprobate": neprob}
        out.update({k: v for k, v in x.items() if k not in out})
        if not probat and x["eroare"] is None:
            out["nota"] = "mod_probat = false: un canal folosit n-a trecut proba în aceeași rulare (vezi canale_neprobate)"
        text = W3.fara_cale_personala(json.dumps(out, ensure_ascii=False, indent=1))
        if re.search(r"c:[\\/]+users[\\/]", text.lower()):
            raise RuntimeError(f"{x['id']}: o cale C:/Users a rămas — nu scriu rezultatul")
        (RR.REAL / f"{x['id']}.json").write_text(text + "\n", encoding="utf-8")
    jurnal = {"generat": time.strftime("%Y-%m-%d %H:%M"), "desktop": DESKTOP_SC, "probe": r.probe,
              "scenarii": [x["id"] for x in rez], "rezultate": [{"id": x["id"], "eroare": x["eroare"]} for x in rez],
              "erori": erori, "erori_sesiune": r.s.erori, "inchidere": inchis, "durata_s": round(time.time() - t0),
              "jurnal": LOG}
    vechi = json.loads(JURNAL_SC.read_text(encoding="utf-8")) if JURNAL_SC.exists() else {"rulari": []}
    vechi.setdefault("rulari", []).append(jurnal)
    JURNAL_SC.write_text(re.sub(MARCAJ + r"\w*", "<folder>", W3.fara_cale_personala(
        json.dumps(vechi, ensure_ascii=False, indent=1, default=str))), encoding="utf-8")
    print(f"scenarii: {len(rez)} rulate, probe {[(k, v.get('trecut')) for k, v in r.probe.items()]}, erori {erori}, "
          f"{round(time.time() - t0)} s, închidere {inchis}")
    return 0


# ------------------------------------------------------------------------------------------------ main
def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd in ("capturi", "scenarii"):
        if R11.ppt_ruleaza():
            print("SĂRIT: POWERPNT.EXE rulează deja (o singură instanță) — nu pornesc și nu ating nimic.")
            return 3
        import dump_uia_office as U_
        if U_.nume_desktop_curent().lower() != "default":
            return {"capturi": capturi_intern, "scenarii": scenarii_intern}[cmd]()
        r = subprocess.run([sys.executable, str(Path(r"C:\00\AI_0\tools\hidden_desktop.py")), "run", "--desktop",
                            DESKTOP if cmd == "capturi" else DESKTOP_SC, "--timeout", "900", "--", sys.executable,
                            str(Path(__file__).resolve()), "_" + cmd] +
                           [x for x in sys.argv if x.startswith(("--doar=", "--id="))])
        try:
            print("curățare Recent:", R11.curata_mru(MARCAJ) or "nimic de șters")
        except Exception as e:  # noqa: BLE001
            print("curățare Recent: eroare", repr(e))
        print("POWERPNT.EXE încă rulează după sesiune:" if R11.ppt_ruleaza() else "nicio instanță PowerPoint rămasă")
        return r.returncode
    if cmd == "_capturi":
        return capturi_intern()
    if cmd == "_scenarii":
        return scenarii_intern()
    if cmd == "scrie":
        return scrie()
    if cmd == "scrie_scenarii":
        return scrie_scenarii()
    if cmd == "verifica":
        return verifica()
    if cmd == "curata_mru":
        print(R11.curata_mru(MARCAJ))
        return 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
