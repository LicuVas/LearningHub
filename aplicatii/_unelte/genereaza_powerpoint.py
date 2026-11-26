# -*- coding: utf-8 -*-
"""Generează interfața PowerPoint a bibliotecii (aplicatii/date/powerpoint.json) DIN referința reală înghețată.

Sursa unică a etichetelor, tipurilor, idMso-urilor, ordinii și pozițiilor: dump-ul UI Automation al lui PowerPoint real
(`_campaign/aplicatii_fidele_2026_11/referinte/uia_powerpoint.json`, 1366x768, 100% DPI — doar citit, niciodată scris).
Aceleași reguli ca la Word și Excel: funcțiile de transformare vin din `genereaza_word.py` și `genereaza_excel.py`
(neschimbate, deci `word.json` și `excel.json` ies la fel). Nicio etichetă nu e scrisă de mână aici: ce lipsește din
referință rămâne lipsă și se notează în `lipsa`.
În plus față de Word: `zona` = geometria zonei de lucru citită din `zona_document` (panoul „Desktop” în care PowerPoint
își desenează miniaturile și diapozitivul). PowerPoint NU-și expune diapozitivul și miniaturile în UI Automation
(README_referinte.md): desenul lor îl face powerpoint.js, simplu, din scenarii, fără pretenție de fidelitate de pixel.
Grupul „Claude” din Home (add-in instalat de om) e deja scos din referință (`excluse_personal`); nu intră aici.
Pictogramele: Fluent UI System Icons (MIT, Microsoft), din `jocuri/_motor/panglica-powerpoint.js` (doar citit), după idMso, iar
PE LÂNGĂ ele cele din `aplicatii/_unelte/icoane_powerpoint.json` și comunele din `icoane_word.json` / `icoane_excel.json` (vezi
`icoane_bib.py`): sursa veche are întâietate, biblioteca umple ce lipsește. `fara_icoana` = idMso-urile care AR TREBUI să aibă
pictogramă și nu au; `fara_icoana_real` = cele care nici în PowerPoint nu au (casete, bife, săgeata ▾, lansatoare), cu motivul.

Rulare:
    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/genereaza_powerpoint.py            # scrie date/powerpoint.json
    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/genereaza_powerpoint.py --verifica # ultima linie = nr. de diferențe
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
REF = GW.D / "referinte" / "uia_powerpoint.json"
ICOANE = GW.WT / "jocuri" / "_motor" / "panglica-powerpoint.js"
IESIRE = BIB / "date" / "powerpoint.json"


def icoane_fluent():
    t = ICOANE.read_text(encoding="utf-8")
    d = json.loads(t[t.find("{"):t.rfind("}") + 1])
    return d.get("icoane") or {}, d.get("_icoane") or ""


def geometria_zonei(z, lipsa):
    """Din `zona_document`: panoul „Desktop” (locul miniaturilor și al diapozitivului). Restul nodurilor sunt cadrul
    ferestrei-document (bară de titlu goală, butoanele ei în afara ecranului) — nu se desenează, se notează."""
    out = {}

    def umbla(n):
        if n.get("tip") == "Pane" and n.get("eticheta") == "Desktop" and "desktop" not in out:
            out["desktop"] = {"e": n["eticheta"], "t": "Pane", "r": [round(float(x), 1) for x in n.get("rect_css") or []]}
        for c in n.get("copii") or []:
            umbla(c)
    umbla(z)
    if "desktop" not in out:
        lipsa.append({"cale": "zona.desktop", "motiv": "nu e în zona_document a referinței"})
    lipsa.append({"cale": "zona_document", "motiv": "PowerPoint nu expune în UI Automation diapozitivul și miniaturile "
                  "(12 noduri, doar cadrul); desenul lor vine din scenarii, nu din referință"})
    return out


def genereaza():
    brut = REF.read_bytes()
    ref = json.loads(brut.decode("utf-8"))
    S = ref["suprafete"]
    lipsa = []
    sup = {}
    for k, v in S.items():
        if k == "zona_document":
            continue      # zona o desenează powerpoint.js din `zona` (mai jos)
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
    ic_bib, ic_nume, unelte, fara_manual = IB.citeste_lant(["powerpoint", "word", "excel"])
    # sursa veche a PowerPointului are întâietate; apoi biblioteca (powerpoint, word, excel); la urmă sursele vechi ale celorlalte
    ic = {**IB.icoane_vechi(GW.WT, ["word", "excel"]), **ic_bib, **ic}
    folosite = set()
    for v in sup.values():
        GW.toate_id(v, folosite)
    icoane = {k: v for k, v in sorted(ic.items()) if k in folosite}
    fara_icoana, fara_icoana_real = IB.imparte(sup, ic, fara_manual)
    return {
        "_despre": "GENERAT de aplicatii/_unelte/genereaza_powerpoint.py din referința UI Automation a lui PowerPoint real — "
                   "nu edita de mână; schimbarea vine din referință (o rundă `acoperire`) sau din generator.",
        "aplicatie": "powerpoint",
        "sursa": {"referinta": "_campaign/aplicatii_fidele_2026_11/referinte/uia_powerpoint.json",
                  "sha256": hashlib.sha256(brut).hexdigest(), "versiune_powerpoint": ref.get("versiune"),
                  "generat_referinta": ref.get("generat"), "fereastra": ref.get("fereastra"),
                  "icoane": "jocuri/_motor/panglica-powerpoint.js › icoane (" + licenta + ") + aplicatii/_unelte/"
                            "icoane_powerpoint.json, icoane_word.json, icoane_excel.json (" + IB.VERSIUNE + ", MIT)"},
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
        # Font ▾ › All Fonts: în suprafața lista.Font sunt doar cele 17 rânduri vizibile la deschidere; toate numele, în ordine,
        # sunt în acoperire_r12.fapte › c_font › all_fonts (fonturile PC-ului capturat) — runda 13, A4
        "fonturi_toate": (((ref.get("acoperire_r12") or {}).get("fapte") or {}).get("c_font") or {}).get("all_fonts") or [],
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--verifica", action="store_true", help="compară powerpoint.json de pe disc cu ce ar genera referința")
    ap.add_argument("--iesire", default=str(IESIRE))
    a = ap.parse_args()
    nou = genereaza()
    p = Path(a.iesire)
    if a.verifica:
        try:
            vechi = json.loads(p.read_text(encoding="utf-8"))
        except Exception as e:
            print("powerpoint.json nu se poate citi:", e)
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
