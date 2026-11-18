# -*- coding: utf-8 -*-
"""Generează interfața Word a bibliotecii (aplicatii/date/word.json) DIN referința reală înghețată.

Sursa unică a etichetelor, tipurilor, idMso-urilor, ordinii și pozițiilor: dump-ul UI Automation al lui Word real
(`_campaign/aplicatii_fidele_2026_11/referinte/uia_word.json`, 1366x768, 100% DPI — doar citit, niciodată scris).
Nicio etichetă nu e scrisă de mână aici: ce lipsește din referință rămâne lipsă și se notează în `lipsa`.
Pictogramele: Fluent UI System Icons (MIT, Microsoft), luate din `jocuri/_motor/panglica-word.js` (doar citit), după idMso.

Rulare:
    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/genereaza_word.py            # scrie aplicatii/date/word.json
    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/genereaza_word.py --verifica # ultima linie = nr. de diferențe
                                                                                            # între word.json și referință
Ultima linie la --verifica = un întreg (0 = word.json e exact ce ar genera referința de azi).
"""
import argparse
import hashlib
import json
import re
import sys
import time
from pathlib import Path

AICI = Path(__file__).resolve().parent
BIB = AICI.parent                                   # aplicatii/
WT = BIB.parent                                     # worktree-ul
D = WT / "_campaign" / "aplicatii_fidele_2026_11"
if not D.exists():                                  # rulat dintr-o copie a bibliotecii: reperele stau în worktree
    WT = Path("C:/00/Projects/LearningHub_fidel")
    D = WT / "_campaign" / "aplicatii_fidele_2026_11"
REF = D / "referinte" / "uia_word.json"
ICOANE = WT / "jocuri" / "_motor" / "panglica-word.js"
IESIRE = BIB / "date" / "word.json"

# câmpurile nodului din referință -> cheia scurtă din word.json
CAMPURI = (("tip", "t"), ("eticheta", "e"), ("id_mso", "id"), ("valoare", "v"), ("scurtatura", "k"), ("ajutor", "h"),
           ("tasta_acces", "ta"))


def redactat(s):
    return isinstance(s, str) and s.startswith("[redactat")


def nod(n, lipsa, cale):
    """nodul referinței -> nodul compact (r = rect_css ABSOLUT, ca în referință; renderer-ul îl face relativ la părinte)."""
    if redactat(n.get("eticheta")):
        lipsa.append({"cale": cale, "motiv": "etichetă personală redactată în referință (nu se desenează)"})
        return None
    o = {}
    for a, b in CAMPURI:
        v = n.get(a)
        if v is None or v == "":
            continue
        if redactat(v):
            continue
        o[b] = v
    if "e" not in o:
        o["e"] = ""
    r = n.get("rect_css")
    if r:
        o["r"] = [round(float(x), 1) for x in r]
    if n.get("activ") is False:
        o["a"] = 0
    if n.get("bifat") in (0, 1):
        o["b"] = n["bifat"]
    if n.get("vizibil") is False:
        o["ascuns"] = 1
    copii = []
    for i, c in enumerate(n.get("copii") or []):
        x = nod(c, lipsa, f"{cale}/{i}:{c.get('eticheta', '')}")
        if x is not None:
            copii.append(x)
    if copii:
        o["c"] = copii
    return o


def icoane_fluent():
    t = ICOANE.read_text(encoding="utf-8")
    d = json.loads(t[t.find("{"):t.rfind("}") + 1])
    return d.get("icoane") or {}, d.get("_icoane") or ""


def toate_id(n, out):
    if n.get("id"):
        out.add(n["id"])
    for c in n.get("c") or []:
        toate_id(c, out)


def genereaza():
    brut = REF.read_bytes()
    ref = json.loads(brut.decode("utf-8"))
    S = ref["suprafete"]
    lipsa = []
    sup = {}
    for k, v in S.items():
        x = nod(v, lipsa, k)
        if x is None:
            continue
        for camp in ("afisat", "obiect_selectat", "deschis_prin", "file_dialog"):
            if camp in v:
                x["_" + camp] = v[camp]
        if "fila" in v:
            x["_fila"] = {"id": v["fila"].get("id_mso"), "e": v["fila"].get("eticheta")}
        sup[k] = x
    # rândul filelor: ordinea și cheia suprafeței fiecărei file
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
    # filele contextuale, pe obiectul care le aduce
    context = {}
    for k, v in sup.items():
        if k.startswith("panglica_context."):
            context.setdefault(v.get("_obiect_selectat") or "?", []).append(
                {"s": k, "id": (v.get("_fila") or {}).get("id"), "e": (v.get("_fila") or {}).get("e")})
    # dialogurile: cheia de bază, titlul, filele (cheile cu #), lansatorul (idMso din deschis_prin)
    dialoguri, lansatoare = {}, {}
    for k, v in sup.items():
        if not (k.startswith("dialog.") or k.startswith("panou.")):
            continue
        baza = k.split("#")[0]
        d = dialoguri.setdefault(baza, {"titlu": S[baza]["eticheta"] if baza in S else v.get("e"), "file": []})
        d["file"].append({"s": k, "fila": k.split("#")[1] if "#" in k else None})
        m = re.search(r"ExecuteMso\('([A-Za-z0-9]+)'\)", v.get("_deschis_prin") or "")
        if m and "#" not in k:
            lansatoare[m.group(1)] = baza
            d["id_mso"] = m.group(1)
    ic, licenta = icoane_fluent()
    folosite = set()
    for v in sup.values():
        toate_id(v, folosite)
    icoane = {k: v for k, v in sorted(ic.items()) if k in folosite}
    fara_icoana = sorted(i for i in folosite if i not in ic)
    out = {
        "_despre": "GENERAT de aplicatii/_unelte/genereaza_word.py din referința UI Automation a lui Word real — nu edita de "
                   "mână; schimbarea vine din referință (o rundă `acoperire`) sau din generator.",
        "aplicatie": "word",
        "sursa": {"referinta": "_campaign/aplicatii_fidele_2026_11/referinte/uia_word.json",
                  "sha256": hashlib.sha256(brut).hexdigest(), "versiune_word": ref.get("versiune"),
                  "generat_referinta": ref.get("generat"), "fereastra": ref.get("fereastra"),
                  "icoane": "jocuri/_motor/panglica-word.js › icoane (" + licenta + ")"},
        "chei": {"t": "tip (ControlType UIA)", "e": "eticheta (numele accesibil real)", "id": "idMso", "r": "rect_css absolut",
                 "a": "0 = gri (activ:false)", "b": "bifat (ToggleState)", "v": "valoare", "k": "scurtătura", "h": "sfatul",
                 "ta": "KeyTip", "ascuns": "1 = în afara ecranului în referință", "c": "copiii"},
        "acces_rapid_afisat": bool(S.get("acces_rapid", {}).get("afisat")),
        "file": file,
        "context": context,
        "dialoguri": dialoguri,
        "lansatoare": lansatoare,
        "suprafete": sup,
        "icoane": icoane,
        "lipsa": lipsa,
        "fara_icoana": fara_icoana,
    }
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--verifica", action="store_true", help="compară word.json de pe disc cu ce ar genera referința")
    ap.add_argument("--iesire", default=str(IESIRE))
    a = ap.parse_args()
    nou = genereaza()
    p = Path(a.iesire)
    if a.verifica:
        try:
            vechi = json.loads(p.read_text(encoding="utf-8"))
        except Exception as e:
            print("word.json nu se poate citi:", e)
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
    print(f"scris {p} ({p.stat().st_size} octeți, {len(nou['suprafete'])} suprafețe, ~{n} noduri, "
          f"{len(nou['icoane'])} icoane, {len(nou['fara_icoana'])} idMso fără icoană, {len(nou['lipsa'])} note de lipsă)")
    print(0)
    return 0


if __name__ == "__main__":
    sys.exit(main())
