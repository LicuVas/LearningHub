#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""arbitru_office.py — schela arbitrului „aplicația reală” (regula 7): citește afirmatii.json al unei lecții și execută
MECANIC, într-o instanță Office NOUĂ și INVIZIBILĂ (COM, DispatchEx, Visible=False, fără salvare, Quit() doar pe ea),
afirmațiile scrise în forma structurată. Restul le marchează DE_EXECUTAT_DE_AGENT (le face dirijorul/un agent).

    python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint [--out <fișier.json>]

Modelul: faza0/excel_real_viii4.py și faza0/proba_word_com.py. Nu atinge nicio instanță deschisă a utilizatorului:
Excel/Word pornesc o instanță nouă; dacă instanța primită are deja registre/documente (nu e a mea), mă opresc fără
Quit. PowerPoint are o singură instanță pe calculator: dacă rulează deja, nu îl ating (totul -> DE_EXECUTAT_DE_AGENT).

FORMA STRUCTURATĂ a unei afirmații (orice altceva = text liber = DE_EXECUTAT_DE_AGENT):
  {"id": "A3", "loc": "P2 incearca", "aplicatie": "excel",
   "actiune": [ {"scrie": {"A1": "Ana", "B1": "9"}}, {"trage": "A1:B1"}, {"ctrl_c": true}, {"clic": "D1"}, {"ctrl_v": true} ],
   "rezultat_promis": {"valori": {"D1": "Ana", "E1": 9}, "celula_activa": "D1"}}
  Excel — acțiuni: scrie {adr: text tastat, pe setările regionale ale PC-ului (FormulaLocal)} · formula {adr: formulă în
    engleză, cu virgulă} · clic adr (clic simplu pe o celulă; pe o zonă = tragere) · trage "B2:C4" sau ["C4","B2"]
    (de la primul colț la celălalt) · shift_clic adr (echivalent COM: zona de la celula activă) · clic_coloana "B" ·
    clic_rand 3 · ctrl_c · ctrl_x · ctrl_v (lipește la selecția curentă) · delete (golește selecția) · esc
    (echivalent: CutCopyMode=False) · umple_in_jos "E2:E4" (echivalentul mânerului de umplere) · sterge_coloana "B" ·
    sterge_rand 2 · insereaza_coloana "B" · insereaza_rand 2 · foaie_noua · redenumeste_foaia "Note" ·
    aldin · umplere "#FFFF00" · aliniere "stanga|centru|dreapta" · borduri "toate" ·
    sorteaza {"zona":"A1:C6","dupa":"C","ordine":"crescator|descrescator","antet":true}
  Excel — rezultate: valori {adr: valoare} · afisat {adr: textul afișat} · gol [adr] · selectie "B2:C4" ·
    celula_activa "B2" (= caseta de nume) · numar_celule {"B2:D4": 9} · formula {adr: formula în engleză} ·
    foi ["Foaie1", "Note"] · aldin {adr: true} · aliniere {adr: "centru"} · tip {adr: "numar|text|data"}
  Word — acțiuni: scrie_text "…" · enter (paragraf nou) · insereaza_tabel {"randuri":4,"coloane":3} ·
    clic_celula {"tabel":1,"rand":4,"coloana":3} · tab (Tab în tabel: celula următoare / rând nou în ultima celulă) ·
    selecteaza_tot · aldin · aliniere "stanga|centru|dreapta"
  Word — rezultate: tabele N · randuri_tabel {"tabel":1,"valoare":5} · coloane_tabel {…} · paragrafe N ·
    text_contine "…" · imagini_in_linie N
  PowerPoint — acțiuni: diapozitiv_nou "titlu|titlu_si_continut|doar_titlu|gol" · scrie_titlu {"diapozitiv":1,"text":"…"} ·
    sterge_diapozitiv 2 · duplica_diapozitiv 1
  PowerPoint — rezultate: diapozitive N · titlu {"diapozitiv":1,"text":"…"} · substituenti {"diapozitiv":1,"valoare":2}
Ce NU se poate prin COM (lista de anulare se golește la orice operație COM; tastele nu ajung la o instanță invizibilă):
ctrl_z, Enter care mută cursorul, animațiile de pe ecran, meniurile/dialogurile — le face agentul.

Ieșire: JSON (implicit verificare_lectii/<clasa>-<folder>/arbitru_<aplicatie>.json). Ultimele trei linii pline;
ultima = DOAR numărul afirmațiilor INFIRMATE.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import time
import traceback
from pathlib import Path

AICI = Path(__file__).resolve().parent
ERORI_XL = {-2146826281: "#DIV/0!", -2146826246: "#N/A", -2146826259: "#NAME?", -2146826288: "#NULL!",
            -2146826252: "#NUM!", -2146826265: "#REF!", -2146826273: "#VALUE!"}
FARA_COM = {"ctrl_z": "Anularea nu se reproduce prin COM: orice operație COM golește lista de anulare.",
            "enter": "Enter (unde se mută cursorul) nu ajunge la o instanță invizibilă; scrie deja confirmă celula.",
            "tasta": "Tastele trimise nu ajung la o instanță invizibilă."}

ACT = {
    "excel": {"scrie", "formula", "clic", "trage", "shift_clic", "clic_coloana", "clic_rand", "ctrl_c", "ctrl_x", "ctrl_v",
              "delete", "esc", "umple_in_jos", "sterge_coloana", "sterge_rand", "insereaza_coloana", "insereaza_rand",
              "foaie_noua", "redenumeste_foaia", "aldin", "umplere", "aliniere", "borduri", "sorteaza"},
    "word": {"scrie_text", "enter", "insereaza_tabel", "clic_celula", "tab", "selecteaza_tot", "aldin", "aliniere"},
    "powerpoint": {"diapozitiv_nou", "scrie_titlu", "sterge_diapozitiv", "duplica_diapozitiv"},
}
REZ = {
    "excel": {"valori", "afisat", "gol", "selectie", "celula_activa", "numar_celule", "formula", "foi", "aldin", "aliniere", "tip"},
    "word": {"tabele", "randuri_tabel", "coloane_tabel", "paragrafe", "text_contine", "imagini_in_linie"},
    "powerpoint": {"diapozitive", "titlu", "substituenti"},
}
# la Word, „enter” e mecanic (TypeParagraph); la Excel e în FARA_COM (clasifica() face excepția)


def pliaza(s: str) -> str:
    return str(s or "").lower().translate(str.maketrans("șşțţăâî", "ssttaai")).strip()


def clasifica(a: dict, app: str) -> tuple[bool, str]:
    act, rez = a.get("actiune"), a.get("rezultat_promis")
    if not isinstance(act, list) or not act or not all(isinstance(x, dict) and len(x) == 1 for x in act):
        return False, "acțiunea e text liber (nu o listă de pași {operație: argument})"
    if not isinstance(rez, dict) or not rez:
        return False, "rezultatul promis e text liber (nu un obiect cu verificări)"
    for x in act:
        op = next(iter(x))
        if op in FARA_COM and not (app == "word" and op == "enter"):
            return False, f"«{op}»: {FARA_COM[op]}"
        if op not in ACT[app]:
            return False, f"operația «{op}» nu e în vocabularul arbitrului pentru {app}"
    for k in rez:
        if k not in REZ[app]:
            return False, f"verificarea «{k}» nu e în vocabularul arbitrului pentru {app}"
    return True, ""


def ruleaza_proces(nume: str) -> bool:
    try:
        out = subprocess.run(["tasklist", "/FI", f"IMAGENAME eq {nume}", "/NH"], capture_output=True, text=True, timeout=20).stdout
        return nume.lower() in out.lower()
    except Exception:
        return True  # nu știu -> presupun că rulează (prudent)


# ============================================================ Excel
def _v(c):
    x = c.Value
    if isinstance(x, int) and x in ERORI_XL:
        return ERORI_XL[x]
    if isinstance(x, float) and x.is_integer():
        return int(x)
    return x


def _egal(a, b) -> bool:
    if isinstance(b, (int, float)) and not isinstance(b, bool):
        try:
            return abs(float(a) - float(b)) < 1e-9
        except (TypeError, ValueError):
            return False
    return str("" if a is None else a).strip() == str(b).strip()


def excel_executa(xl, sh, pas: dict):
    op, arg = next(iter(pas.items()))
    if op == "scrie":
        for adr, t in arg.items():
            sh.Range(adr).FormulaLocal = str(t)
    elif op == "formula":
        for adr, t in arg.items():
            sh.Range(adr).Formula = str(t)
    elif op == "clic":
        sh.Range(arg).Select()
    elif op == "trage":
        a, b = (arg.split(":") + [None])[:2] if isinstance(arg, str) else arg
        sh.Range(a, b or a).Select()
        sh.Range(a).Activate()          # celula de pornire rămâne activă
    elif op == "shift_clic":
        ancora = xl.ActiveCell.Address
        sh.Range(ancora, arg).Select()
        sh.Range(ancora).Activate()
    elif op == "clic_coloana":
        sh.Columns(arg).Select()
    elif op == "clic_rand":
        sh.Rows(arg).Select()
    elif op == "ctrl_c":
        xl.Selection.Copy()
    elif op == "ctrl_x":
        xl.Selection.Cut()
    elif op == "ctrl_v":
        sh.Paste()
    elif op == "delete":
        xl.Selection.ClearContents()
    elif op == "esc":
        xl.CutCopyMode = False
    elif op == "umple_in_jos":
        sh.Range(arg).FillDown()
    elif op == "sterge_coloana":
        sh.Columns(arg).Delete()
    elif op == "sterge_rand":
        sh.Rows(arg).Delete()
    elif op == "insereaza_coloana":
        sh.Columns(arg).Insert()
    elif op == "insereaza_rand":
        sh.Rows(arg).Insert()
    elif op == "foaie_noua":
        sh.Parent.Worksheets.Add(After=sh.Parent.Worksheets(sh.Parent.Worksheets.Count))
        sh.Activate()
    elif op == "redenumeste_foaia":
        sh.Name = str(arg)
    elif op == "aldin":
        xl.Selection.Font.Bold = True
    elif op == "umplere":
        h = str(arg).lstrip("#")
        xl.Selection.Interior.Color = int(h[4:6] + h[2:4] + h[0:2], 16)   # BGR
    elif op == "aliniere":
        xl.Selection.HorizontalAlignment = {"stanga": -4131, "centru": -4108, "dreapta": -4152}[pliaza(arg)]
    elif op == "borduri":
        for i in (7, 8, 9, 10, 11, 12):                                   # xlEdgeLeft..xlInsideHorizontal
            xl.Selection.Borders(i).LineStyle = 1
    elif op == "sorteaza":
        z = sh.Range(arg["zona"])
        cheie = sh.Range(f"{arg['dupa']}{z.Row}")
        z.Sort(Key1=cheie, Order1=2 if pliaza(arg.get("ordine", "")).startswith("desc") else 1,
               Header=1 if arg.get("antet", True) else 2)


def excel_verifica(xl, sh, promis: dict) -> tuple[bool, dict]:
    obs, ok = {}, True
    for k, v in promis.items():
        if k == "valori":
            got = {a: _v(sh.Range(a)) for a in v}
            obs[k] = got
            ok &= all(_egal(got[a], v[a]) for a in v)
        elif k == "afisat":
            got = {a: sh.Range(a).Text for a in v}
            obs[k] = got
            ok &= all(str(got[a]) == str(v[a]) for a in v)
        elif k == "gol":
            got = {a: _v(sh.Range(a)) for a in v}
            obs[k] = got
            ok &= all(got[a] in (None, "") for a in v)
        elif k == "selectie":
            got = str(xl.Selection.Address).replace("$", "")      # proprietatea simplă (ca în faza0); fără $
            obs[k] = got
            ok &= got.upper() == str(v).replace("$", "").upper()
        elif k == "celula_activa":
            got = str(xl.ActiveCell.Address).replace("$", "")
            obs[k] = got
            ok &= got.upper() == str(v).upper()
        elif k == "numar_celule":
            got = {z: sh.Range(z).Count for z in v}
            obs[k] = got
            ok &= all(got[z] == v[z] for z in v)
        elif k == "formula":
            got = {a: sh.Range(a).Formula for a in v}
            obs[k] = got
            ok &= all(re.sub(r"\s", "", got[a]).upper() == re.sub(r"\s", "", str(v[a])).upper() for a in v)
        elif k == "foi":
            got = [ws.Name for ws in sh.Parent.Worksheets]
            obs[k] = got
            ok &= all(n in got for n in v)
        elif k == "aldin":
            got = {a: bool(sh.Range(a).Font.Bold) for a in v}
            obs[k] = got
            ok &= all(got[a] == bool(v[a]) for a in v)
        elif k == "aliniere":
            cod = {-4131: "stanga", -4108: "centru", -4152: "dreapta", 1: "general"}
            got = {a: cod.get(sh.Range(a).HorizontalAlignment, str(sh.Range(a).HorizontalAlignment)) for a in v}
            obs[k] = got
            ok &= all(got[a] == pliaza(v[a]) for a in v)
        elif k == "tip":
            def tip(c):
                x = c.Value
                if x is None:
                    return "gol"
                if hasattr(x, "year"):
                    return "data"
                return "numar" if isinstance(x, (int, float)) and not isinstance(x, bool) else "text"
            got = {a: tip(sh.Range(a)) for a in v}
            obs[k] = got
            ok &= all(got[a] == pliaza(v[a]) for a in v)
    return ok, obs


# ============================================================ Word
def word_executa(w, doc, pas: dict):
    op, arg = next(iter(pas.items()))
    s = w.Selection
    if op == "scrie_text":
        s.TypeText(str(arg))
    elif op == "enter":
        for _ in range(int(arg) if isinstance(arg, int) and not isinstance(arg, bool) else 1):
            s.TypeParagraph()
    elif op == "insereaza_tabel":
        t = doc.Tables.Add(s.Range, int(arg["randuri"]), int(arg["coloane"]))
        t.Cell(1, 1).Select()
    elif op == "clic_celula":
        doc.Tables(int(arg.get("tabel", 1))).Cell(int(arg["rand"]), int(arg["coloana"])).Select()
    elif op == "tab":
        s.MoveRight(12)                                   # wdCell = echivalentul lui Tab într-un tabel
    elif op == "selecteaza_tot":
        doc.Content.Select()
    elif op == "aldin":
        s.Font.Bold = True
    elif op == "aliniere":
        s.ParagraphFormat.Alignment = {"stanga": 0, "centru": 1, "dreapta": 2}[pliaza(arg)]


def word_verifica(w, doc, promis: dict) -> tuple[bool, dict]:
    obs, ok = {}, True
    for k, v in promis.items():
        if k == "tabele":
            obs[k] = doc.Tables.Count
            ok &= obs[k] == int(v)
        elif k in ("randuri_tabel", "coloane_tabel"):
            t = doc.Tables(int(v.get("tabel", 1)))
            obs[k] = t.Rows.Count if k == "randuri_tabel" else t.Columns.Count
            ok &= obs[k] == int(v["valoare"])
        elif k == "paragrafe":
            obs[k] = doc.Paragraphs.Count
            ok &= obs[k] == int(v)
        elif k == "text_contine":
            txt = doc.Content.Text
            obs[k] = txt[:300]
            ok &= str(v) in txt
        elif k == "imagini_in_linie":
            obs[k] = doc.InlineShapes.Count
            ok &= obs[k] == int(v)
    return ok, obs


# ============================================================ PowerPoint
ASPECT = {"titlu": 1, "titlu_si_continut": 2, "doar_titlu": 11, "gol": 12}


def ppt_executa(app, pr, pas: dict):
    op, arg = next(iter(pas.items()))
    if op == "diapozitiv_nou":
        pr.Slides.Add(pr.Slides.Count + 1, ASPECT[pliaza(arg).replace(" ", "_")])
    elif op == "scrie_titlu":
        pr.Slides(int(arg["diapozitiv"])).Shapes.Title.TextFrame.TextRange.Text = str(arg["text"])
    elif op == "sterge_diapozitiv":
        pr.Slides(int(arg)).Delete()
    elif op == "duplica_diapozitiv":
        pr.Slides(int(arg)).Duplicate()


def ppt_verifica(app, pr, promis: dict) -> tuple[bool, dict]:
    obs, ok = {}, True
    for k, v in promis.items():
        if k == "diapozitive":
            obs[k] = pr.Slides.Count
            ok &= obs[k] == int(v)
        elif k == "titlu":
            sl = pr.Slides(int(v["diapozitiv"]))
            obs[k] = sl.Shapes.Title.TextFrame.TextRange.Text if sl.Shapes.HasTitle else None
            ok &= obs[k] == v["text"]
        elif k == "substituenti":
            obs[k] = pr.Slides(int(v["diapozitiv"])).Shapes.Placeholders.Count
            ok &= obs[k] == int(v["valoare"])
    return ok, obs


# ============================================================ rularea
def ruleaza(app_nume: str, mecanice: list[dict], rezultate: dict) -> dict:
    import pythoncom
    import pywintypes
    import win32com.client
    pythoncom.CoInitialize()
    mediu = {}
    if app_nume == "powerpoint" and ruleaza_proces("POWERPNT.EXE"):
        for a in mecanice:
            rezultate[a["id"]].update(verdict="DE_EXECUTAT_DE_AGENT",
                                      nota="PowerPoint e deschis pe calculator; are o singură instanță, nu o ating.")
        return {"oprit": "PowerPoint deja deschis"}
    progid = {"excel": "Excel.Application", "word": "Word.Application", "powerpoint": "PowerPoint.Application"}[app_nume]
    t0 = time.time()
    app = win32com.client.DispatchEx(progid)
    a_mea = True
    try:
        if app_nume == "excel":
            app.Visible = False
            app.DisplayAlerts = False
            a_mea = app.Workbooks.Count == 0
        elif app_nume == "word":
            app.Visible = False
            app.DisplayAlerts = 0
            a_mea = app.Documents.Count == 0
        else:
            a_mea = app.Presentations.Count == 0
        if not a_mea:
            for a in mecanice:
                rezultate[a["id"]].update(verdict="DE_EXECUTAT_DE_AGENT",
                                          nota="Instanța primită are deja fișiere deschise (nu e nouă); nu o ating.")
            return {"oprit": "instanța nu era nouă"}
        mediu = {"aplicatie": progid, "versiune": app.Version, "pornit_in_s": round(time.time() - t0, 1),
                 "instanta": "DispatchEx nouă, invizibilă; fișier nou pe afirmație, închis fără salvare"}
        if app_nume == "excel":
            intl = app.International
            mediu.update(separator_zecimal=intl[2], separator_lista=intl[4])
        for a in mecanice:
            r = rezultate[a["id"]]
            fis = None
            try:
                if app_nume == "excel":
                    fis = app.Workbooks.Add()
                    ctx = fis.Worksheets(1)
                    ctx.Activate()
                    for pas in a["actiune"]:
                        excel_executa(app, ctx, pas)
                    ok, obs = excel_verifica(app, ctx, a["rezultat_promis"])
                elif app_nume == "word":
                    fis = app.Documents.Add()
                    for pas in a["actiune"]:
                        word_executa(app, fis, pas)
                    ok, obs = word_verifica(app, fis, a["rezultat_promis"])
                else:
                    fis = app.Presentations.Add(0)       # WithWindow = msoFalse: fără fereastră
                    for pas in a["actiune"]:
                        ppt_executa(app, fis, pas)
                    ok, obs = ppt_verifica(app, fis, a["rezultat_promis"])
                r.update(verdict="CONFIRMAT" if ok else "INFIRMAT", observat=obs)
            except pywintypes.com_error as e:
                r.update(verdict="NETESTABIL", observat={"eroare_com": str(e)[:300]},
                         nota="Aplicația a refuzat operația prin COM; de făcut de agent.")
            except Exception as e:
                r.update(verdict="NETESTABIL", observat={"eroare": repr(e)[:300]}, nota=traceback.format_exc()[-300:])
            finally:
                if fis is not None:
                    try:
                        if app_nume == "excel":
                            app.CutCopyMode = False
                            fis.Close(False)
                        elif app_nume == "word":
                            fis.Close(0)                 # wdDoNotSaveChanges
                        else:
                            fis.Saved = True
                            fis.Close()
                    except Exception:
                        pass
    finally:
        if a_mea:
            try:
                app.Quit()
            except Exception:
                pass
        pythoncom.CoUninitialize()
    return mediu


def main(argv=None) -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("afirmatii")
    ap.add_argument("--aplicatie", required=True, choices=["excel", "word", "powerpoint"])
    ap.add_argument("--out")
    a = ap.parse_args(argv)
    p = Path(a.afirmatii).resolve()
    date = json.loads(p.read_text(encoding="utf-8-sig"))
    lista = date.get("afirmatii", []) if isinstance(date, dict) else date
    out = Path(a.out) if a.out else AICI / f"{p.parent.parent.name.lower()}-{p.parent.name}" / f"arbitru_{a.aplicatie}.json"
    out.parent.mkdir(parents=True, exist_ok=True)

    rezultate, mecanice = {}, []
    for k, af in enumerate(lista, 1):
        id_ = str(af.get("id") or f"#{k}")
        r = {"id": id_, "loc": af.get("loc"), "aplicatie": af.get("aplicatie"), "actiune": af.get("actiune"),
             "rezultat_promis": af.get("rezultat_promis"), "verdict": None, "observat": None, "nota": ""}
        rezultate[id_] = r
        if af.get("aplicatie") and pliaza(af["aplicatie"]) != a.aplicatie:
            r.update(verdict="ALTA_APLICATIE", nota=f"afirmația e pentru {af['aplicatie']}")
            continue
        ok, de_ce = clasifica(af, a.aplicatie)
        if ok:
            mecanice.append({**af, "id": id_})
        else:
            r.update(verdict="DE_EXECUTAT_DE_AGENT", nota=de_ce)
    mediu = ruleaza(a.aplicatie, mecanice, rezultate) if mecanice else {"nota": "nicio afirmație mecanică: aplicația nu a pornit"}
    num = {}
    for r in rezultate.values():
        num[r["verdict"]] = num.get(r["verdict"], 0) + 1
    out.write_text(json.dumps({"afirmatii": str(p), "aplicatie": a.aplicatie, "mediu": mediu, "numar": num,
                               "rezultate": list(rezultate.values())}, ensure_ascii=False, indent=1, default=str),
                   encoding="utf-8")
    for r in rezultate.values():
        print(f"{r['id']:<8} {r['verdict']:<21} {str(r.get('loc') or '')[:28]:<28} "
              + (json.dumps(r["observat"], ensure_ascii=False, default=str)[:150] if r["observat"] else r["nota"][:150]))
    print(f"{a.aplicatie}: " + ", ".join(f"{k} {v}" for k, v in sorted(num.items())) + f" · rezultat: {out}")
    print(f"INFIRMATE (de reparat în lecție): {num.get('INFIRMAT', 0)} · de executat de agent: {num.get('DE_EXECUTAT_DE_AGENT', 0) + num.get('NETESTABIL', 0)}")
    print(num.get("INFIRMAT", 0))
    return 0 if not num.get("INFIRMAT") else 1


if __name__ == "__main__":
    sys.exit(main())
