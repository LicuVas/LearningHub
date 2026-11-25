# -*- coding: utf-8 -*-
"""Generează interfața Excel a bibliotecii (aplicatii/date/excel.json) DIN referința reală înghețată.

Sursa unică a etichetelor, tipurilor, idMso-urilor, ordinii și pozițiilor: dump-ul UI Automation al lui Excel real
(`_campaign/aplicatii_fidele_2026_11/referinte/uia_excel.json`, 1366x768, 100% DPI — doar citit, niciodată scris).
Aceleași reguli ca la Word: funcțiile de transformare vin din `genereaza_word.py` (neschimbat, deci `word.json` iese la
fel). Nicio etichetă nu e scrisă de mână aici: ce lipsește din referință rămâne lipsă și se notează în `lipsa`.
În plus față de Word: `zona` = geometria foii citită din `zona_document` (Name Box, Formula Bar, antetele coloanelor și
rândurilor, filele foilor, barele de derulare), ca `excel.js` să așeze grila la coordonatele reale.
Pictogramele: Fluent UI System Icons (MIT, Microsoft), din `jocuri/_motor/panglica-excel.js` (doar citit), după idMso, iar
PE LÂNGĂ ele cele din `aplicatii/_unelte/icoane_excel.json` (maparea bibliotecii; vezi `icoane_bib.py`): sursa veche are
întâietate, fișierul bibliotecii umple ce lipsește. `fara_icoana` = idMso-urile care AR TREBUI să aibă pictogramă și nu au;
`fara_icoana_real` = cele care nici în Excel nu au (casete, bife, săgeata ▾, lansatoare), fiecare cu motivul.

Rulare:
    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/genereaza_excel.py            # scrie aplicatii/date/excel.json
    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/genereaza_excel.py --verifica # ultima linie = nr. de diferențe
"""
import argparse
import hashlib
import json
import re
import sys
import time
from pathlib import Path

AICI = Path(__file__).resolve().parent
sys.path.insert(0, str(AICI))
import genereaza_word as GW  # noqa: E402  (aceleași reguli de transformare; modulul nu scrie nimic la import)
import icoane_bib as IB  # noqa: E402  (pictogramele bibliotecii, pe lângă sursa veche)

BIB = AICI.parent
REF = GW.D / "referinte" / "uia_excel.json"
ICOANE = GW.WT / "jocuri" / "_motor" / "panglica-excel.js"
IESIRE = BIB / "date" / "excel.json"


def icoane_fluent():
    t = ICOANE.read_text(encoding="utf-8")
    d = json.loads(t[t.find("{"):t.rfind("}") + 1])
    return d.get("icoane") or {}, d.get("_icoane") or ""


def geometria_zonei(z, lipsa):
    """Din `zona_document` (nodul brut al referinței): dreptunghiurile și numele elementelor foii."""
    out = {"coloane": [], "randuri": []}

    def umbla(n, cale):
        t, e, r, idm = n.get("tip"), n.get("eticheta") or "", n.get("rect_css"), n.get("id_mso")
        if t == "ComboBox" and e == "Name Box" and "caseta_nume" not in out:
            out["caseta_nume"] = {"e": e, "r": r, "t": t}
        elif t == "Edit" and e == "Name Box":
            out["caseta_nume_edit"] = {"e": e, "r": r, "t": t}
        elif t == "Button" and idm == "DropDown" and "caseta_nume" in out and "caseta_nume_buton" not in out:
            out["caseta_nume_buton"] = {"e": e, "id": idm, "r": r, "t": t}
        elif t == "Edit" and idm == "FormulaBar":
            out["bara_formule"] = {"e": e, "id": idm, "r": r, "t": t}
        elif t == "DataGrid":
            out["grila"] = {"e": e, "id": idm, "r": r, "t": t}
        elif t == "HeaderItem":
            out["colt"] = {"e": e, "r": r, "t": t}
        elif t == "DataItem" and re.fullmatch(r"[A-Z]{1,3}", e):
            out["coloane"].append({"e": e, "r": r})
        elif t == "DataItem" and re.fullmatch(r"\d+", e):
            out["randuri"].append({"e": e, "r": r})
        elif t == "Tab" and idm and n.get("copii"):
            out["file_foi"] = {"e": e, "id": idm, "r": r, "t": t,
                               "c": [{"t": c.get("tip"), "e": c.get("eticheta"), "id": c.get("id_mso"), "r": c.get("rect_css"),
                                      **({"a": 0} if c.get("activ") is False else {})} for c in n["copii"]]}
        elif t == "Pane" and e.startswith("Sheet ") and idm:
            out["foaie"] = {"e": e, "id": idm, "r": r, "t": t}
        elif t == "Pane" and idm and idm == e and "registru" not in out:
            out["registru"] = {"e": e, "id": idm, "r": r, "t": t}
        elif t == "Pane" and e in ("Vertical", "Horizontal"):
            bs = []
            for c in n.get("copii") or []:
                for s in c.get("copii") or []:
                    for b in s.get("copii") or []:
                        bs.append({"t": b.get("tip"), "e": b.get("eticheta"), "r": b.get("rect_css")})
            out["derulare_" + ("v" if e == "Vertical" else "o")] = {"e": e, "r": r, "c": bs}
        for i, c in enumerate(n.get("copii") or []):
            umbla(c, f"{cale}/{i}")
    umbla(z, "zona_document")
    for k in ("caseta_nume", "bara_formule", "grila", "colt", "file_foi", "foaie", "registru"):
        if k not in out:
            lipsa.append({"cale": "zona." + k, "motiv": "nu e în zona_document a referinței"})
    return out


def genereaza():
    brut = REF.read_bytes()
    ref = json.loads(brut.decode("utf-8"))
    S = ref["suprafete"]
    lipsa = []
    sup = {}
    for k, v in S.items():
        if k == "zona_document":
            continue      # zona foii o desenează excel.js din `zona` (geometria de mai jos), cu numele de aici
        x = GW.nod(v, lipsa, k)
        if x is None:
            continue
        for camp in ("afisat", "obiect_selectat", "deschis_prin", "file_dialog", "punct_css"):
            if camp in v:
                x["_" + camp] = v[camp]
        if "fila" in v:
            x["_fila"] = {"id": v["fila"].get("id_mso"), "e": v["fila"].get("eticheta")}
        sup[k] = x
    file = []

    def caut_file(n):
        if n.get("t") == "TabItem" and n.get("id"):
            file.append({"id": n["id"], "e": n["e"], "s": "panglica." + n["id"]})
        for c in n.get("c") or []:
            caut_file(c)
    caut_file(sup["file_panglicii"])
    for f in file:
        if f["s"] not in sup:
            lipsa.append({"cale": f["s"], "motiv": "fila e în rândul filelor, dar panglica ei nu e în referință"})
    context = {}
    for k, v in sup.items():
        if k.startswith("panglica_context."):
            context.setdefault(v.get("_obiect_selectat") or "?", []).append(
                {"s": k, "id": (v.get("_fila") or {}).get("id"), "e": (v.get("_fila") or {}).get("e")})
    dialoguri, lansatoare = {}, {}
    for k, v in sup.items():
        if not (k.startswith("dialog.") or k.startswith("panou.")):
            continue
        baza = k.split("#")[0]
        d = dialoguri.setdefault(baza, {"titlu": S[baza]["eticheta"] if baza in S else v.get("e"), "file": []})
        d["file"].append({"s": k, "fila": k.split("#")[1] if "#" in k else None})
        m = re.search(r"ExecuteMso\('([A-Za-z0-9]+)'\)", v.get("_deschis_prin") or "")
        if m and "#" not in k and m.group(1) not in lansatoare:
            lansatoare[m.group(1)] = baza
            d["id_mso"] = m.group(1)
    zona = geometria_zonei(S["zona_document"], lipsa)
    ic, licenta = icoane_fluent()
    ic_bib, ic_nume, unelte, fara_manual = IB.citeste("excel")
    ic = {**ic_bib, **ic}                      # sursa veche are întâietate; biblioteca umple ce lipsește
    folosite = set()
    for v in sup.values():
        GW.toate_id(v, folosite)
    icoane = {k: v for k, v in sorted(ic.items()) if k in folosite}
    fara_icoana, fara_icoana_real = IB.imparte(sup, ic, fara_manual)
    return {
        "_despre": "GENERAT de aplicatii/_unelte/genereaza_excel.py din referința UI Automation a lui Excel real — nu edita "
                   "de mână; schimbarea vine din referință (o rundă `acoperire`) sau din generator.",
        "aplicatie": "excel",
        "sursa": {"referinta": "_campaign/aplicatii_fidele_2026_11/referinte/uia_excel.json",
                  "sha256": hashlib.sha256(brut).hexdigest(), "versiune_excel": ref.get("versiune"),
                  "generat_referinta": ref.get("generat"), "fereastra": ref.get("fereastra"),
                  "icoane": "jocuri/_motor/panglica-excel.js › icoane (" + licenta + ") + aplicatii/_unelte/icoane_excel.json ("
                            + IB.VERSIUNE + ", MIT)"},
        "chei": {"t": "tip (ControlType UIA)", "e": "eticheta (numele accesibil real)", "id": "idMso", "r": "rect_css absolut",
                 "a": "0 = gri (activ:false)", "b": "bifat (ToggleState)", "v": "valoare", "k": "scurtătura", "h": "sfatul",
                 "ta": "KeyTip", "ascuns": "1 = în afara ecranului în referință", "c": "copiii"},
        "acces_rapid_afisat": str(S.get("acces_rapid", {}).get("afisat")) == "True",
        "file": file,
        "context": context,
        "dialoguri": dialoguri,
        "lansatoare": lansatoare,
        "zona": zona,
        "suprafete": sup,
        "icoane": icoane,
        "icoane_nume": ic_nume,
        "unelte": {k: v for k, v in unelte.items() if not k.startswith("_")},
        "lipsa": lipsa,
        "fara_icoana": fara_icoana,
        "fara_icoana_real": fara_icoana_real,
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--verifica", action="store_true", help="compară excel.json de pe disc cu ce ar genera referința")
    ap.add_argument("--iesire", default=str(IESIRE))
    a = ap.parse_args()
    nou = genereaza()
    p = Path(a.iesire)
    if a.verifica:
        try:
            vechi = json.loads(p.read_text(encoding="utf-8"))
        except Exception as e:
            print("excel.json nu se poate citi:", e)
            print(1)
            return 1
        dif = sum(1 for k in set(nou) | set(vechi) if k != "generat" and nou.get(k) != vechi.get(k))
        print(f"chei diferite față de generarea de azi: {dif}")
        print(dif)
        return 0 if dif == 0 else 1
    p.parent.mkdir(parents=True, exist_ok=True)
    nou["generat"] = time.strftime("%Y-%m-%d %H:%M:%S")
    p.write_text(json.dumps(nou, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    n = sum(1 for _ in re.finditer(r'"t":', p.read_text(encoding="utf-8")))
    print(f"scris {p.name} ({p.stat().st_size} octeți, {len(nou['suprafete'])} suprafețe, ~{n} noduri, "
          f"{len(nou['icoane'])} icoane, {len(nou['fara_icoana'])} idMso fără icoană, {len(nou['lipsa'])} note de lipsă)")
    print(0)
    return 0


if __name__ == "__main__":
    sys.exit(main())
