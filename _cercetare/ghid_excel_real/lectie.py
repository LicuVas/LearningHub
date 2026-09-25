"""Lectiile ghidului, scrise in fisiere .yaml (fara Python). Un exemplu complet: lectii/01_note_suma_media.yaml.

Fiecare pas are:
  titlu:  scurt ("Capul de tabel")
  text:   ce face elevul (poate avea mai multe randuri)
  tinta:  unde e chenarul:  A1  |  A2:A6  |  {buton: AutoSum, fila: Pornire}
  gata:   cand trece singur la pasul urmator (toate conditiile trebuie sa fie adevarate) - vezi VERIFICARI
  proba:  (optional) ce face un „elev simulat” la --verifica - vezi ACTIUNI

La nivel de lectie: titlu, clasa (optional), pregatire: {A1: Elev, B1: Nota} (scris in foaie la pornire),
final: textul de la sfarsit.
"""
import re
from pathlib import Path

import yaml

# fila din panglica -> ID-ul Microsoft (acelasi in Office RO si EN); se accepta si ID-ul direct (TabHome)
FILE = {
    "pornire": "TabHome", "home": "TabHome",
    "inserare": "TabInsert", "insert": "TabInsert",
    "aspect pagina": "TabPageLayoutExcel", "aspect pagină": "TabPageLayoutExcel", "page layout": "TabPageLayoutExcel",
    "formule": "TabFormulas", "formulas": "TabFormulas",
    "date": "TabData", "data": "TabData",
    "revizuire": "TabReview", "review": "TabReview",
    "vizualizare": "TabView", "view": "TabView",
}
NUME_FILA = {"TabHome": "Pornire (Home)", "TabInsert": "Inserare (Insert)",
             "TabPageLayoutExcel": "Aspect pagină (Page Layout)", "TabFormulas": "Formule (Formulas)",
             "TabData": "Date (Data)", "TabReview": "Revizuire (Review)", "TabView": "Vizualizare (View)"}

ADRESA = re.compile(r"^\$?[A-Z]{1,3}\$?\d{1,7}(:\$?[A-Z]{1,3}\$?\d{1,7})?$")


class LectieGresita(Exception):
    pass


# ---------------------------------------------------------------- verificari (citite din Excel prin COM)

def _celule(ws, adresa):
    v = ws.Range(adresa).Value
    if not isinstance(v, tuple):
        return [v]
    return [x for rand in v for x in rand]


def _are_text(ws, a):
    return all(isinstance(v, str) and v.strip() for v in _celule(ws, a))


def _text(ws, d):
    return all(str(ws.Range(a).Value or "").strip().lower() == str(t).strip().lower() for a, t in d.items())


def _numere(ws, d):
    lo, hi = d.get("intre", [None, None])
    vals = _celule(ws, d["zona"])
    return all(isinstance(v, (int, float)) and (lo is None or lo <= v <= hi) for v in vals)


def _valoare(ws, d):
    ok = True
    for a, t in d.items():
        v = ws.Range(a).Value
        ok &= (abs(v - t) < 1e-9) if isinstance(v, (int, float)) and isinstance(t, (int, float)) else v == t
    return ok


def _formula(ws, d):
    ok = True
    for a, functii in d.items():
        f = str(ws.Range(a).Formula).upper().replace(" ", "")
        for fn in ([functii] if isinstance(functii, str) else functii):
            ok &= f.startswith("=") and (str(fn).upper() + "(") in f
    return ok


def _font(prop):
    def f(ws, a):
        return all(bool(getattr(ws.Range(c).Font, prop)) for c in _lista(a))
    return f


def _lista(a):
    return a if isinstance(a, list) else [a]


def _umplere(ws, a):
    return all(ws.Range(c).Interior.ColorIndex not in (-4142, None) for c in _lista(a))


def _imbinat(ws, a):
    # MergeArea se cere pe O celula (coltul), altfel Excel raspunde pentru toata zona
    colt = ws.Range(a.split(":")[0])
    return bool(colt.MergeCells) and colt.MergeArea.Address == ws.Range(a).Address


def _sortat(ws, d):
    vals = [v for v in _celule(ws, d["zona"]) if v is not None]
    desc = str(d.get("ordine", "cresc")).startswith("desc")
    return len(vals) > 1 and vals == sorted(vals, key=lambda v: (isinstance(v, str), v), reverse=desc)


def _grafic(ws, cate):
    return ws.ChartObjects().Count >= (1 if cate is True else int(cate))


VERIFICARI = {
    "are_text": _are_text,                         # are_text: A1   (sau A1:C1)
    "text": _text,                                 # text: {A1: Nota}
    "numere": _numere,                             # numere: {zona: A2:A6, intre: [1, 10]}
    "valoare": _valoare,                           # valoare: {A7: 40}
    "formula": _formula,                           # formula: {A7: SUM}  sau {A7: [ROUND, AVERAGE]}
    "aldin": _font("Bold"),                        # aldin: A1  (sau o lista)
    "cursiv": _font("Italic"),
    "subliniat": _font("Underline"),
    "umplere": _umplere,                           # umplere: A1
    "imbinat": _imbinat,                           # imbinat: A1:C1
    "sortat": _sortat,                             # sortat: {zona: B2:B6, ordine: cresc|desc}
    "grafic": _grafic,                             # grafic: true
}
# verificarile care au nevoie de aplicatie, nu doar de foaie
VERIFICARI_XL = {
    # celula_activa: A7 (exact) sau B2:B6 (oricare celula din zona)
    "celula_activa": lambda xl, a: xl.Intersect(xl.ActiveCell, xl.ActiveSheet.Range(a)) is not None,
    "selectie": lambda xl, a: xl.Selection.Address.replace("$", "") == a.replace("$", ""),
}


def construieste_gata(cond, unde):
    if not isinstance(cond, dict) or not cond:
        raise LectieGresita(f"{unde}: „gata” trebuie să aibă cel puțin o condiție (ex. are_text: A1)")
    for k in cond:
        if k not in VERIFICARI and k not in VERIFICARI_XL:
            raise LectieGresita(f"{unde}: condiția „{k}” nu există. Se pot folosi: "
                                + ", ".join(sorted(list(VERIFICARI) + list(VERIFICARI_XL))))

    def gata(ws, xl):
        for k, v in cond.items():
            ok = VERIFICARI[k](ws, v) if k in VERIFICARI else VERIFICARI_XL[k](xl, v)
            if not ok:
                return False
        return True
    return gata


# ---------------------------------------------------------------- actiunile elevului simulat (--verifica)

def _scrie(ws, xl, d):
    for a, v in d.items():
        if isinstance(v, list):                    # A2: [9, 7, 10] -> in jos de la A2
            r0, c0 = ws.Range(a).Row, ws.Range(a).Column
            for k, x in enumerate(v):
                ws.Cells(r0 + k, c0).Formula = x
        else:
            ws.Range(a).Formula = v


def _sorteaza(ws, xl, d):
    z = ws.Range(d["zona"])
    cheie = ws.Range(d.get("dupa", d["zona"].split(":")[0]))
    z.Sort(Key1=cheie, Order1=2 if str(d.get("ordine", "cresc")).startswith("desc") else 1, Header=2)


def _grafic_fa(ws, xl, a):
    r = ws.Range(a)
    ch = ws.ChartObjects().Add(r.Left + r.Width + 20, r.Top, 360, 220)
    ch.Chart.SetSourceData(r)


ACTIUNI = {
    "scrie": _scrie,                                               # scrie: {A1: Nota, A2: [9,7,10]}
    "selecteaza": lambda ws, xl, a: ws.Range(a).Select(),         # selecteaza: A7
    "aldin": lambda ws, xl, a: [setattr(ws.Range(c).Font, "Bold", True) for c in _lista(a)],
    "cursiv": lambda ws, xl, a: [setattr(ws.Range(c).Font, "Italic", True) for c in _lista(a)],
    "subliniat": lambda ws, xl, a: [setattr(ws.Range(c).Font, "Underline", 2) for c in _lista(a)],
    "umple": lambda ws, xl, a: [setattr(ws.Range(c).Interior, "Color", 0x99E6FF) for c in _lista(a)],
    "imbina": lambda ws, xl, a: ws.Range(a).Merge(),
    "sorteaza": _sorteaza,                                         # sorteaza: {zona: A1:C6, dupa: B1, ordine: desc}
    "grafic": _grafic_fa,                                          # grafic: A1:B6
}


def construieste_proba(act, unde):
    if act is None:
        return None
    if not isinstance(act, dict):
        raise LectieGresita(f"{unde}: „proba” trebuie să fie de forma  acțiune: valoare")
    for k in act:
        if k not in ACTIUNI:
            raise LectieGresita(f"{unde}: acțiunea de probă „{k}” nu există. Se pot folosi: " + ", ".join(ACTIUNI))

    def fa(ws, xl):
        for k, v in act.items():
            ACTIUNI[k](ws, xl, v)
    return fa


# ---------------------------------------------------------------- incarcarea

def construieste_tinta(t, unde):
    if isinstance(t, str) and ADRESA.match(t.strip().upper()):
        return ("celula", t.strip().upper())
    if isinstance(t, dict) and "buton" in t:
        fila = str(t.get("fila", "Pornire"))
        fila_id = FILE.get(fila.strip().lower(), fila)
        if not fila_id.startswith("Tab"):
            raise LectieGresita(f"{unde}: fila „{fila}” necunoscută. Se pot folosi: Pornire, Inserare, "
                                "Aspect pagină, Formule, Date, Revizuire, Vizualizare")
        return ("buton", str(t["buton"]), fila_id)
    raise LectieGresita(f"{unde}: „tinta” trebuie să fie o celulă (A1), o zonă (A2:A6) "
                        "sau un buton: {buton: AutoSum, fila: Pornire}")


def incarca(cale):
    cale = Path(cale)
    try:
        date = yaml.safe_load(cale.read_text(encoding="utf-8"))
    except yaml.YAMLError as e:
        raise LectieGresita(f"{cale.name}: nu se poate citi ({e})")
    if not isinstance(date, dict) or not isinstance(date.get("pasi"), list) or not date["pasi"]:
        raise LectieGresita(f"{cale.name}: lecția trebuie să aibă „titlu” și o listă „pasi”")
    n = len(date["pasi"])
    pasi = []
    for i, p in enumerate(date["pasi"], 1):
        unde = f"{cale.name}, pasul {i}"
        for k in ("titlu", "text", "tinta", "gata"):
            if k not in p:
                raise LectieGresita(f"{unde}: lipsește „{k}”")
        tinta = construieste_tinta(p["tinta"], unde)
        pasi.append({
            "titlu": f"Pasul {i} din {n} · {p['titlu']}",
            "text": str(p["text"]).strip(),
            "tinta": tinta,
            "gata": construieste_gata(p["gata"], unde),
            "proba": construieste_proba(p.get("proba"), unde),
        })
    pregatire = date.get("pregatire") or {}
    for a in pregatire:
        if not ADRESA.match(str(a).upper()):
            raise LectieGresita(f"{cale.name}: în „pregatire”, „{a}” nu e o celulă")
    return {
        "titlu": str(date.get("titlu", cale.stem)),
        "clasa": str(date.get("clasa", "")),
        "pregatire": pregatire,
        "final": str(date.get("final", "Ai terminat lecția — în Excel-ul adevărat.")).strip(),
        "pasi": pasi,
        "fisier": str(cale),
    }


def lectii(dosar):
    return sorted(Path(dosar).glob("*.yaml"))
