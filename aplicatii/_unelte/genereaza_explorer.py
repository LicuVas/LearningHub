# -*- coding: utf-8 -*-
"""Generează interfața File Explorer a bibliotecii (aplicatii/date/explorer.json) DIN referința reală înghețată.

Sursa unică a etichetelor, tipurilor (ControlType), AutomationId-urilor, ordinii, pozițiilor și stărilor (gri / ales):
dump-ul UI Automation al File Explorer-ului de pe Windows 11 (română) al profesorului, sesiunea din 20.11.2026
(`_campaign/aplicatii_fidele_2026_11/referinte/uia_explorer.json`, formatul shell al `referinte/dump_shell_uia.py`;
doar citit, pe chei, niciodată scris). Nicio etichetă nu e scrisă de mână aici: ce lipsește din referință rămâne lipsă
și se notează în `lipsa` (rânduri R15-… în `de_verificat.md`).
Reguli (aceleași idei ca în `oracole/structura_lib.py › referinte_shell`, scrise independent, ca diagnosticul să nu
copieze greșelile convertorului):
- pozițiile = `rect` față de colțul ferestrei capturate (100% DPI, deci pixeli CSS); la meniurile din mai multe ferestre
  (lista + rândul de pictograme, meniul + submeniul) = față de colțul reuniunii, din `rect_ecran_100`;
- nodurile `in_afara_ecranului` sau fără `rect` nu se desenează; ToolTip-urile și ferestrele-zgomot (SysShadow) se sar;
- un Pop-up citit de două ori (aceeași etichetă, același loc ±2 px) se păstrează o dată;
- nodurile ascunse pentru date personale („[element personal ascuns]”, „[utilizator]” …) intră ca loc gol: `ascuns: true`;
- separatoarele meniurilor = golurile dintre rânduri mai mari decât pasul obișnuit (referința nu are nod Separator).

Rulare:
    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/genereaza_explorer.py            # scrie date/explorer.json
    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/genereaza_explorer.py --verifica # ultima linie = nr. de diferențe
"""
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

AICI = Path(__file__).resolve().parent
BIB = AICI.parent
WT = BIB.parent
D = WT / "_campaign" / "aplicatii_fidele_2026_11"
if not D.exists():
    WT = Path("C:/00/Projects/LearningHub_fidel")
    D = WT / "_campaign" / "aplicatii_fidele_2026_11"
REF = D / "referinte" / "uia_explorer.json"
IESIRE = BIB / "date" / "explorer.json"
ASCUNS_RE = re.compile(r"\[(?:[^\[\]]*ascuns[ăa]?|utilizator|calculator|cont|nume|SID|email|telefon)\]", re.I)
ZGOMOT_CLASE = {"SysShadow", "tooltips_class32", "Shell_SecondaryTrayWnd"}


def ascuns(nume):
    return bool(ASCUNS_RE.search(str(nume or "")))


def noduri_captura(cap):
    """Toate nodurile vizibile ale unei capturi, cu dreptunghiul față de colțul reuniunii ferestrelor (pixeli la 100%)."""
    fer = [f for f in cap.get("ferestre") or [] if f.get("clasa") not in ZGOMOT_CLASE and f.get("arbore")]
    if not fer:
        return [], [0, 0, 0, 0]
    x0 = min(f["rect_ecran_100"][0] for f in fer)
    y0 = min(f["rect_ecran_100"][1] for f in fer)
    x1 = max(f["rect_ecran_100"][0] + f["rect_ecran_100"][2] for f in fer)
    y1 = max(f["rect_ecran_100"][1] + f["rect_ecran_100"][3] for f in fer)
    out, vazut = [], []

    def umbla(n, f, ad, parinte):
        if n.get("tip") == "ToolTip":
            return
        r = n.get("rect")
        viz = bool(r) and not n.get("in_afara_ecranului")
        rr = None
        if r:
            rr = [r[0] + f["rect_ecran_100"][0] - x0, r[1] + f["rect_ecran_100"][1] - y0, r[2], r[3]]
        nod = {"nume": n.get("nume") or "", "tip": n.get("tip"), "id": n.get("id"), "r": rr, "viz": viz, "ad": ad,
               "parinte": parinte, "x": n}
        dub = viz and rr and any(v["nume"] == nod["nume"] and v["tip"] == nod["tip"] and abs(v["r"][0] - rr[0]) <= 2
                                 and abs(v["r"][1] - rr[1]) <= 2 for v in vazut)
        if not dub:
            out.append(nod)
            if viz and rr:
                vazut.append(nod)
        for c in n.get("copii") or []:
            umbla(c, f, ad + 1, nod)
    for f in fer:
        umbla(f["arbore"], f, 0, None)
    return out, [0, 0, x1 - x0, y1 - y0]


def rect_rel(r, baza):
    return [round(r[0] - baza[0]), round(r[1] - baza[1]), round(r[2]), round(r[3])]


def element(n, baza=None, **extra):
    x = n["x"]
    e = {"e": "[ascuns]" if ascuns(n["nume"]) else n["nume"], "t": n["tip"]}
    if ascuns(n["nume"]):
        e["ascuns"] = True
    if n["id"] and not ascuns(n["id"]) and n["id"] not in ("TextBox", "UpButton", "DownButton", "UpPageButton", "DownPageButton", "DropDown"):
        e["id"] = n["id"]
    elif n["id"]:
        e["id_repetat"] = n["id"]
    if n["r"]:
        e["r"] = rect_rel(n["r"], baza or [0, 0])
    if x.get("dezactivat"):
        e["gri"] = True
    if x.get("selectat"):
        e["ales"] = True
    if x.get("scurtatura"):
        e["sc"] = x["scurtatura"]
    if x.get("tasta_acces"):
        e["ta"] = x["tasta_acces"]
    if x.get("extins") is False and n["tip"] in ("MenuItem", "SplitButton"):
        e["sub"] = True
    e.update(extra)
    return e


def gaseste(nod_lista, **cond):
    for n in nod_lista:
        if all((n["x"].get(k) if k not in ("nume", "tip", "id") else n[k]) == v for k, v in cond.items()):
            return n
    return None


def sub(nod_lista, parinte):
    """descendenții (toate nivelurile) ai unui nod, în ordinea din arbore"""
    out, ok = [], False
    for n in nod_lista:
        p = n["parinte"]
        while p is not None and p is not parinte:
            p = p["parinte"]
        if p is parinte:
            out.append(n)
    return out


def meniu(cap, lipsa, cheie):
    N, uni = noduri_captura(cap)
    rand = [n for n in N if n["tip"] == "MenuItem" and n["viz"] and n["r"]]
    rand.sort(key=lambda n: (n["r"][1], n["r"][0]))
    # ferestrele reuniunii (meniu + submeniu / listă + rândul de pictograme), în ordinea de pe ecran
    fer = [f for f in cap.get("ferestre") or [] if f.get("clasa") not in ZGOMOT_CLASE and f.get("arbore")]
    x0 = min(f["rect_ecran_100"][0] for f in fer)
    y0 = min(f["rect_ecran_100"][1] for f in fer)
    cutii = sorted([[f["rect_ecran_100"][0] - x0, f["rect_ecran_100"][1] - y0, f["rect_ecran_100"][2], f["rect_ecran_100"][3]]
                    for f in fer], key=lambda r: (r[1], r[0]))
    # doar cutiile în care stă cel puțin un rând de meniu (fereastra unui ToolTip nu e o cutie de meniu)
    cutii = [c for c in cutii if any(c[0] - 2 <= n["r"][0] <= c[0] + c[2] and c[1] - 2 <= n["r"][1] <= c[1] + c[3] for n in rand)]
    elem = [element(n) for n in rand]
    # separatoarele: un gol mai mare decât pasul obișnuit între două rânduri din aceeași coloană (același x)
    for a, b in zip(elem, elem[1:]):
        if a["r"][0] == b["r"][0] and a["r"][3] == b["r"][3] or abs(a["r"][0] - b["r"][0]) <= 2:
            gol = b["r"][1] - (a["r"][1] + a["r"][3])
            if gol >= 5:
                b["sep"] = True
    return {"w": uni[2], "h": uni[3], "cutii": cutii, "randuri": elem, "sursa": cap.get("ce_e")}


def genereaza():
    ref = json.loads(REF.read_text(encoding="utf-8"))
    S = ref["suprafete"]
    lipsa = []
    out = {"_ce": "File Explorer (Windows 11, română), generat din referinte/uia_explorer.json de "
                  "aplicatii/_unelte/genereaza_explorer.py — NU se editează de mână",
           "_sha256_referinta": hashlib.sha256(REF.read_bytes()).hexdigest()[:16]}
    cap = S["explorer_fereastra"]
    N, uni = noduri_captura(cap)
    win = gaseste(N, tip="Window")
    out["fereastra"] = {"w": uni[2], "h": uni[3], "titlu": win["nume"], "observat_vizual": cap.get("observat_vizual") or {}}
    tb = [n for n in N if n["tip"] in ("MenuItem", "Button") and n["viz"] and n["parinte"] and
          (n["parinte"]["tip"] in ("TitleBar", "MenuBar"))]
    out["fereastra"]["butoane"] = [element(n) for n in tb]

    def parte(id_, *, tip=None):
        n = gaseste(N, id=id_) if tip is None else gaseste(N, id=id_, tip=tip)
        if n is None:
            lipsa.append("nodul cu AutomationId " + id_)
        return n
    # file
    tv = parte("TabView")
    fila = gaseste(sub(N, tv), tip="TabItem")
    inch = gaseste(sub(N, fila), id="CloseButton")
    add = parte("AddButton")
    out["file"] = {"r": tv["r"], "fila": element(fila, tv["r"]), "inchide": element(inch, tv["r"]), "adauga": element(add, tv["r"])}
    # navigare
    nc = parte("NavigationCommands")
    out["navigare"] = {"r": nc["r"], "butoane": [element(n, nc["r"]) for n in sub(N, nc) if n["tip"] == "Button" and n["viz"]]}
    # adresa: caseta + firimiturile (ultimele două = folderul curent și părintele: din ele se fac șabloanele etichetelor)
    asb = parte("PART_AutoSuggestBox")
    ed = gaseste(sub(N, asb), tip="Edit")
    first = parte("FirstCrumbStackPanel")
    bb = parte("PART_BreadcrumbBar")
    crumbs = [n for n in sub(N, bb) if n["tip"] == "SplitButton"]
    viz = [n for n in crumbs if n["viz"]]
    curent, parinte = viz[-1]["nume"], viz[-2]["nume"]
    out["adresa"] = {"r": asb["r"], "edit": element(ed, asb["r"]), "prima": element(first, asb["r"]),
                     "firimituri": [element(n, asb["r"]) for n in crumbs if n["viz"]],
                     "exemplu_curent": curent, "exemplu_parinte": parinte}
    sab = lambda s: s.replace('"' + parinte + '"', '"{parinte}"').replace('"' + curent + '"', '"{folder}"').replace(" " + curent, " {folder}")
    for b in out["navigare"]["butoane"]:
        b["sablon"] = sab(b["e"])
    fil = out["file"]
    # căutarea
    sb = parte("FileExplorerSearchBox")
    se = gaseste(sub(N, sb), tip="Edit")
    out["cautare"] = {"r": sb["r"], "edit": element(se, sb["r"], sablon=sab(se["nume"]))}
    # bara de comenzi (principală + secundară)
    cb, cb2 = parte("FileExplorerCommandBar"), parte("FileExplorerSecondaryCommandBar")
    rc = [min(cb["r"][0], cb2["r"][0]), min(cb["r"][1], cb2["r"][1])]
    rc += [max(cb["r"][0] + cb["r"][2], cb2["r"][0] + cb2["r"][2]) - rc[0], max(cb["r"][3], cb2["r"][3])]
    out["bara_comenzi"] = {"r": rc,
                           "butoane": [element(n, rc) for n in sub(N, cb) if n["tip"] == "Button" and n["viz"]],
                           "dreapta": [element(n, rc) for n in sub(N, cb2) if n["tip"] == "Button" and n["viz"]]}
    # panoul de navigare
    th = parte("ProperTreeHost")
    tree = gaseste(sub(N, th), tip="Tree")
    sbar = gaseste(sub(N, th), tip="ScrollBar")
    elem = []
    for n in sub(N, tree):
        if n["tip"] != "TreeItem":
            continue
        nivel = 0
        p = n["parinte"]
        while p is not None and p is not tree:
            if p["tip"] == "TreeItem":
                nivel += 1
            p = p["parinte"]
        e = element(n, th["r"], nivel=nivel)
        if not n["viz"]:
            e["in_afara_ecranului"] = True
            e.pop("r", None)
        if n["x"].get("extins") is True:
            e["extins"] = True
        elem.append(e)
    out["panou_navigare"] = {"r": th["r"], "eticheta": tree["nume"], "defilare": [element(n, th["r"]) for n in sub(N, sbar)
                                                                                   if n["tip"] == "Button" and n["viz"]],
                             "elemente": elem}
    # zona de conținut
    lv = parte("listview")
    lst = gaseste(sub(N, lv), tip="List")
    hs = gaseste(sub(N, lv), tip="ScrollBar")
    hdr = gaseste(sub(N, lv), tip="Header")
    col = []
    for n in sub(N, hdr):
        if n["tip"] == "SplitButton":
            e = element(n, lv["r"])
            if not n["viz"]:
                e["in_afara_ecranului"] = True
            col.append(e)
    rows = [n for n in sub(N, lst) if n["tip"] == "ListItem"]
    tipuri, date_ex, dim_ex = {}, None, None
    for rw in rows:
        nm = rw["nume"]
        props = {c["nume"]: c["x"].get("valoare") for c in sub(N, rw) if c["tip"] == "Edit"}
        t = props.get("Tip")
        ext = nm.rsplit(".", 1)[1].lower() if "." in nm else "/"
        if t:
            tipuri[ext] = t
        if props.get("Data modificării") and not date_ex:
            date_ex = re.sub(r"[\u200e\u200f]", "", props["Data modificării"])
        if props.get("Dimensiune") and not dim_ex:
            dim_ex = props["Dimensiune"]
    r0, r1 = rows[0]["r"], rows[1]["r"]
    nume0 = gaseste(sub(N, rows[0]), tip="Edit", id="System.ItemNameDisplay")
    out["zona_continut"] = {"r": lv["r"], "eticheta_lista": lst["nume"], "eticheta_antet": hdr["nume"], "coloane": col,
                            "defilare_orizontala": [element(n, lv["r"]) for n in sub(N, hs) if n["tip"] == "Button" and n["viz"]],
                            "rand": {"x": r0[0] - lv["r"][0], "y0": r0[1] - lv["r"][1], "pas": r1[1] - r0[1], "h": r0[3],
                                     "nume_x": nume0["r"][0] - r0[0]},
                            "tipuri": tipuri, "data_exemplu": date_ex, "dimensiune_exemplu": dim_ex,
                            "exemplu_elemente": [rw["nume"] for rw in rows]}
    # panoul de detalii / examinare
    pt = parte("PreviewThumbnailInner")
    ns = parte("RPaneCoverSheet_NoSel")
    out["panou_detalii"] = {"r": pt["r"], "text": element(ns, pt["r"])}
    # bara de stare
    st = parte("StatusBarModuleInner")
    pv = gaseste(sub(N, st), id="PropertyValue")
    m = re.match(r"^(\d+)\s+(.*)$", pv["nume"])
    out["bara_stare"] = {"r": st["r"], "eticheta": st["nume"], "numar": element(pv, st["r"], cuvant_plural=m.group(2) if m else None),
                         "moduri": [element(n, st["r"]) for n in sub(N, st) if n["tip"] == "RadioButton"]}
    lipsa.append("forma la singular a numărului din bara de stare („1 element”?) — referința are doar „%s”" % pv["nume"])
    # meniurile
    out["meniuri"] = {}
    for k, c in (("meniu_nou", "explorer_meniu_nou"), ("meniu_sortare", "explorer_meniu_sortare"),
                 ("meniu_vizualizare", "explorer_meniu_vizualizare"), ("meniu_fisier", "explorer_meniu_fisier"),
                 ("meniu_fisier_clasic", "explorer_meniu_fisier_clasic"), ("meniu_fundal", "explorer_meniu_fundal")):
        if c in S:
            out["meniuri"][k] = meniu(S[c], lipsa, k)
        else:
            lipsa.append("captura " + c)
    # fereastra Proprietăți (captura explorer_proprietati, doar etichetele, în ordinea de pe ecran)
    if "explorer_proprietati" in S:
        Np, up = noduri_captura(S["explorer_proprietati"])
        out["proprietati"] = {"w": up[2], "h": up[3], "noduri": [element(n) for n in Np if n["viz"] and n["r"] and n["tip"] not in ("Pane",)]}
    lipsa += ["meniul de clic dreapta din Coșul de reciclare (scenariul explorer_restaurare_din_cos dă doar „Restaurare”)",
              "meniul clasic de clic dreapta pe fundal („Afișați mai multe opțiuni” din meniu_fundal)",
              "meniul „Mai multe opțiuni” (…) din bara de comenzi",
              "submeniurile „Nou” din meniul de clic dreapta, „Sortați după” / „Grupare după” / „Vizualizare” din meniu_fundal",
              "aspectul ferestrelor de dialog (doar titlul, întrebarea și butoanele, din scenarii_real/explorer_*.json)",
              "caseta de redenumire pe loc (F2): doar observat_vizual.f2_pe_tema_docx",
              "numele fișierelor noi altele decât Folder (Nou › Document text, Microsoft Word Document …)",
              "dialogul de ștergere definitivă pentru un FOLDER și pentru mai multe elemente",
              "rezultatele căutării (caseta Căutați în … e capturată, pagina de rezultate nu)",
              "fereastra îngustă (360-390 px): observat_vizual nu spune cum se strânge bara de comenzi"]
    # pictogramele: DOAR setul Fluent deja folosit în proiect (MIT; aplicatii/date/LICENSE-fluent-icons.txt), după nume;
    # ce nu e în set (dosar, coș, săgeți laterale, butoanele ferestrei) desenează explorer.js din forme simple proprii
    fl = WT / "_cercetare" / "office_comenzi" / "fluent"
    ic = {}
    for k, f in (("Decupare", "cut"), ("Copiere", "copy"), ("Lipire", "clipboard_paste"), ("Redenumire", "textbox"),
                 ("Sortați", "arrow_sort"), ("Vizualizați", "grid"), ("sus", "arrow_up"), ("reimprospatare", "arrow_reset"),
                 ("cautare", "search"), ("document", "document"), ("imagine", "image"), ("text", "notepad"),
                 ("Nou", "document_add"), ("Partajați", "link"), ("Galerie", "image"), ("Rețea", "globe")):
        p = fl / (f + "_20_regular.svg")
        if p.exists():
            ic[k] = re.findall(r'\sd="([^"]+)"', p.read_text(encoding="utf-8"))
        else:
            lipsa.append("pictograma Fluent " + f)
    out["icoane"] = ic
    out["_icoane"] = "Fluent UI System Icons (MIT, Microsoft), 20px regular, viewBox 0 0 20 20 — din " + \
                     "_cercetare/office_comenzi/fluent (același set ca panglica-*.js)"
    out["lipsa"] = lipsa
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--verifica", action="store_true", help="nu scrie; compară cu date/explorer.json (ultima linie = diferențe)")
    a = ap.parse_args()
    nou = json.dumps(genereaza(), ensure_ascii=False, indent=1)
    if a.verifica:
        vechi = IESIRE.read_text(encoding="utf-8") if IESIRE.exists() else ""
        dif = sum(1 for x, y in zip(nou.splitlines(), vechi.splitlines()) if x != y) + abs(len(nou.splitlines()) - len(vechi.splitlines()))
        print("date/explorer.json " + ("la zi" if not dif else "DE REGENERAT (%d rânduri diferite)" % dif))
        print(dif)
        return 0 if not dif else 1
    IESIRE.write_text(nou + "\n", encoding="utf-8")
    print(IESIRE)
    print(0)
    return 0


if __name__ == "__main__":
    sys.exit(main())
