# -*- coding: utf-8 -*-
"""Pictogramele bibliotecii, pe lângă sursa veche (`jocuri/_motor/panglica-<aplicatie>.js › icoane`).

Fiecare aplicație are un fișier `aplicatii/_unelte/icoane_<aplicatie>.json`:
    icoane     idMso -> {nume_fluent, path}      pictograma comenzii (Fluent UI System Icons, 20 px regular, viewBox 0 0 20 20, MIT)
    dupa_nume  eticheta -> {nume_fluent, path}   pentru nodurile fără idMso (numele accesibil sau partea dinainte de „:”)
    unelte     {forme: fel -> forma, culori: nume -> #hex}   galeria de unelte de desen (List cu SplitButton fără părți):
               „Pen: Red, 0.35 mm” = felul „Pen”, culoarea „Red”
    fara       idMso -> motivul                  comenzi care în aplicația reală NU au pictogramă (scrise de mână, cu motiv)
Maparea (idMso -> nume_fluent) se scrie de mână, după ce FACE comanda; `path` îl completează acest script din pachetul npm
`@fluentui/svg-icons` despachetat ÎN AFARA depozitului (nu e dependență, nu intră în depozit).

Rulare (după ce ai adăugat un rând cu `nume_fluent`):
    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/icoane_bib.py excel --pachet C:/00/AI_0/.scratch/fluent_icons/pachet/package
    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/icoane_bib.py excel --verifica   # ultima linie = rânduri fără path
Generatoarele (`genereaza_<aplicatie>.py`) cheamă `citeste()` / `citeste_lant()` și `imparte()`; nu citesc pachetul npm.

Comenzile comune NU se rescriu: `citeste_lant(["powerpoint", "word", "excel"])` pune fișierele unul peste altul (primul are
întâietate). Ce e comun celor trei aplicații (Shape Fill, Text Effects, Alt Text…) stă în `icoane_excel.json`; ce e comun Word +
PowerPoint (tabel, imagine, casetă) stă în `icoane_word.json`; în `icoane_powerpoint.json` e doar ce are numai PowerPoint.
`icoane_vechi()` dă și pictogramele surselor vechi ale celorlalte aplicații (Undo, Save…), ca ultimă rezervă.
"""
import argparse
import json
import re
import sys
from pathlib import Path

AICI = Path(__file__).resolve().parent
VERSIUNE = "@fluentui/svg-icons@1.1.343"

# tipurile de nod care poartă pictogramă pe panglică / în meniuri; restul (casete, bife, grupuri, file) nu au în aplicația reală
CU_PICTOGRAMA = {"Button", "MenuItem", "SplitButton", "ListItem"}


def cale(aplicatie):
    return AICI / f"icoane_{aplicatie}.json"


def citeste(aplicatie):
    """-> (icoane {idMso: [path]}, dupa_nume {eticheta: [path]}, unelte {forme, culori}, fara {idMso: motiv})."""
    p = cale(aplicatie)
    if not p.exists():
        return {}, {}, {}, {}
    d = json.loads(p.read_text(encoding="utf-8"))
    ic = {k: v["path"] for k, v in (d.get("icoane") or {}).items() if v.get("path")}
    nume = {k: v["path"] for k, v in (d.get("dupa_nume") or {}).items() if v.get("path")}
    return ic, nume, d.get("unelte") or {}, d.get("fara") or {}


def citeste_lant(aplicatii):
    """Ca `citeste`, pe mai multe fișiere: primul din listă are întâietate, următoarele umplu ce lipsește."""
    ic, nume, unelte, fara = {}, {}, {}, {}
    for a in reversed(aplicatii):
        i, n, u, f = citeste(a)
        ic.update(i)
        nume.update(n)
        if u:
            unelte = u
        if a == aplicatii[0]:
            fara.update(f)
    return ic, nume, unelte, fara


def icoane_vechi(wt, aplicatii):
    """Pictogramele surselor vechi (`jocuri/_motor/panglica-<aplicatie>.js › icoane`, doar citite); primul din listă are întâietate."""
    out = {}
    for a in reversed(aplicatii):
        p = Path(wt) / "jocuri" / "_motor" / f"panglica-{a}.js"
        if not p.exists():
            continue
        t = p.read_text(encoding="utf-8")
        out.update((json.loads(t[t.find("{"):t.rfind("}") + 1]).get("icoane") or {}))
    return out


def _motiv_nod(n):
    """De ce nodul acesta nu are pictogramă în aplicația reală (None = ar trebui să aibă)."""
    t, e = n.get("t"), n.get("e") or ""
    r = n.get("r") or [0, 0, 99, 99]
    if t not in CU_PICTOGRAMA:
        return f"{t}: fără pictogramă în aplicația reală"
    if t == "MenuItem" and not e:
        return "caseta unei galerii din panglică: se desenează elementele ei, nu are pictogramă proprie"
    if t == "MenuItem" and e == "More Options":
        return "săgeata ▾ a unui buton divizat (glif propriu)"
    if t == "Button" and r[2] <= 18 and r[3] <= 18:
        return "lansatorul unui grup (glif propriu)"
    return None


def imparte(suprafete, icoane, fara_manual):
    """idMso-urile folosite, fără pictogramă -> (fara_icoana [cele care AR TREBUI să aibă], fara_icoana_real {id: motiv})."""
    noduri = {}

    def umbla(n):
        if n.get("id"):
            noduri.setdefault(n["id"], []).append(n)
        for c in n.get("c") or []:
            umbla(c)
    for v in suprafete.values():
        umbla(v)
    lipsa, real = [], {}
    for i in sorted(noduri):
        if i in icoane:
            continue
        if i in fara_manual:
            real[i] = fara_manual[i]
            continue
        motive = [_motiv_nod(n) for n in noduri[i]]
        if all(motive):
            real[i] = motive[0]
        else:
            lipsa.append(i)
    return lipsa, real


def completeaza(aplicatie, pachet):
    p = cale(aplicatie)
    d = json.loads(p.read_text(encoding="utf-8"))
    dosar = Path(pachet) / "icons"
    lipsa = 0
    for sectiune in ("icoane", "dupa_nume"):
        for k, v in (d.get(sectiune) or {}).items():
            f = dosar / f"{v['nume_fluent']}_20_regular.svg"
            if not f.exists():
                print(f"NU EXISTĂ în pachet: {sectiune}.{k} -> {v['nume_fluent']}")
                lipsa += 1
                continue
            v["path"] = re.findall(r'<path[^>]*\sd="([^"]+)"', f.read_text(encoding="utf-8"))
    d["_sursa"] = f"Fluent UI System Icons (Microsoft, MIT), {VERSIUNE}, <nume_fluent>_20_regular.svg; licența: aplicatii/date/LICENSE-fluent-icons.txt"
    p.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return lipsa


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("aplicatie", help="excel | word | powerpoint")
    ap.add_argument("--pachet", help="dosarul `package` al pachetului npm despachetat (în afara depozitului)")
    ap.add_argument("--verifica", action="store_true", help="numără rândurile fără path")
    a = ap.parse_args()
    if a.pachet:
        n = completeaza(a.aplicatie, a.pachet)
    else:
        d = json.loads(cale(a.aplicatie).read_text(encoding="utf-8"))
        n = sum(1 for s in ("icoane", "dupa_nume") for v in (d.get(s) or {}).values() if not v.get("path"))
    d = json.loads(cale(a.aplicatie).read_text(encoding="utf-8"))
    print(f"{cale(a.aplicatie).name}: {len(d.get('icoane') or {})} după idMso, {len(d.get('dupa_nume') or {})} după nume, "
          f"{len(d.get('fara') or {})} fără pictogramă (cu motiv); rânduri fără path: {n}")
    print(n)
    return 0 if n == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
