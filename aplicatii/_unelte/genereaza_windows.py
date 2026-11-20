# -*- coding: utf-8 -*-
"""Generează aplicatii/date/windows.json din referința REALĂ înghețată (runda 18, valul B-windows, 20.11.2026).

Sursa unică a etichetelor: _campaign/aplicatii_fidele_2026_11/referinte/uia_windows.json (UI Automation pe Windows 11 25H2 RO,
sesiunea din 20.11.2026; ecran 1536×864 logic la 125%): bara de activități (fereastra Shell_TrayWnd — bara monitorului al
doilea, Shell_SecondaryTrayWnd, se sare, ca în structura_lib.SHELL_ZGOMOT_CLASE), meniul Start, meniul de clic dreapta pe
desktop (nou + clasic). Completări citite tot din referințe înghețate, cu sursa pe fiecare valoare:
  - submeniul „Nou” al desktopului: NU e capturat; lista vine din uia_explorer.json › explorer_meniu_nou (același meniu
    „Nou” al shell-ului, deschis din Explorer) — [NEVERIFICAT] R18-2;
  - butoanele ferestrei (Minimizare / Maximizare / Închidere): uia_explorer.json › explorer_fereastra (bara de titlu);
  - numele folderului nou: scenarii_real/explorer_folder_nou*.json („Folder nou”, „Folder nou (2)”);
  - pictogramele desktopului: „Acest PC” din uia_explorer.json (panoul de navigare); „Coș de reciclare” din
    api_biblioteca.md §3 (exemplul țintei desktop:) — desktopul nu e capturat: [NEVERIFICAT] R18-5;
  - pictogramele: Fluent UI System Icons (MIT), din _cercetare/office_comenzi/fluent (setul deja folosit; contract I7).
Ce e STARE în captură (cele 4 butoane „… fereastră deschisă / ferestre deschise”, ora) NU devine interfață: butoanele
deschise le dă `ferestre` din starea simulatorului, ceasul e viu, în formatul din referință (runde/18/cadru.md, citirea B).
Nicio etichetă scrisă de mână: ce lipsește din referință rămâne lipsă și e în `lipsuri`.

    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/genereaza_windows.py [--verifica]
--verifica: nu scrie; iese cu 1 dacă date/windows.json nu e la zi. Ultima linie = numărul de diferențe (0 = la zi).
"""
import argparse
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
AICI = Path(__file__).resolve().parent
WT = AICI.parents[1]
D = WT / "_campaign" / "aplicatii_fidele_2026_11"
REF = D / "referinte"
IESIRE = WT / "aplicatii" / "date" / "windows.json"
FLUENT = WT / "_cercetare" / "office_comenzi" / "fluent"
LRM = re.compile("[\u200e\u200f\u202a-\u202e]")
ASCUNS = re.compile(r"\[(?:element personal ascuns|[^\]]* ascuns[ăa]?|id ascuns|utilizator|cont|calculator)\]")

ICOANE = {  # numele intern -> fișierul Fluent (doar cele care există în setul local)
    "cautare": "search_20_regular.svg", "setari": "settings_20_regular.svg", "web": "globe_20_regular.svg",
    "notepad": "notepad_20_regular.svg", "grila": "grid_20_regular.svg", "document": "document_20_regular.svg",
    "imagine": "image_20_regular.svg", "difuzor": "speaker_2_20_regular.svg", "fereastra": "window_new_20_regular.svg",
    "copiere": "copy_20_regular.svg", "decupare": "cut_20_regular.svg", "lipire": "clipboard_paste_20_regular.svg",
    "straturi": "layer_20_regular.svg", "sortare": "arrow_sort_20_regular.svg", "vizualizare": "icons_20_regular.svg",
    "reimprospatare": "arrow_reset_20_regular.svg", "personalizare": "paint_brush_20_regular.svg",
    "afisare": "options_20_regular.svg", "nou": "document_add_20_regular.svg", "lista": "list_20_regular.svg",
    "video": "video_20_regular.svg", "anulare": "arrow_swap_20_regular.svg", "terminal": "textbox_20_regular.svg",
    "pornire": "play_20_regular.svg", "sparkle": "sparkle_20_regular.svg", "link": "link_20_regular.svg"}


def citeste(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def curat(s):
    return LRM.sub("", str(s or "")).replace("\r\n", "\n").strip()


def nod(n, cale, dx=0, dy=0):
    """nodul referinței -> nodul din windows.json (doar ce desenează biblioteca)."""
    r = n.get("rect")
    o = {"tip": n.get("tip"), "nume": curat(n.get("nume")), "sursa": cale}
    if isinstance(r, list) and len(r) == 4:
        o["rect"] = [r[0] - dx, r[1] - dy, r[2], r[3]]
    aid = n.get("id")
    if aid and not ASCUNS.search(str(aid)):
        o["id"] = aid
    for k_src, k in (("tasta_acces", "ta"), ("scurtatura", "scurtatura"), ("dezactivat", "dezactivat"),
                     ("extins", "extins"), ("in_afara_ecranului", "in_afara_ecranului")):
        if k_src in n:
            o[k] = n[k_src]
    if n.get("ascuns") or ASCUNS.search(o["nume"]):
        o["ascuns"] = True
    if "\t" in o["nume"]:
        o["nume"], o["scurtatura"] = o["nume"].split("\t", 1)[0].rstrip(), o["nume"].split("\t", 1)[1].strip()
    return o


def texte_copii(n):
    """textul VIZIBIL dovedit de referință: copiii Text ai unui buton (vremea, „Căutare”). Din grupurile dublate (vremea are
    un grup mic și unul mare) se ia cel cu cele mai multe texte."""
    best = []
    direct = [curat(c.get("nume")) for c in n.get("copii") or [] if c.get("tip") == "Text" and len(curat(c.get("nume"))) > 1]
    for c in n.get("copii") or []:
        if c.get("tip") == "Group":
            t = [curat(x.get("nume")) for x in c.get("copii") or [] if x.get("tip") == "Text" and curat(x.get("nume"))]
            if len(t) > len(best):
                best = t
    return best or direct


def bara(S):
    sup = S["bara_activitati"]
    fer = [i for i, f in enumerate(sup["ferestre"]) if f.get("clasa") == "Shell_TrayWnd"][0]
    F = sup["ferestre"][fer]
    base = "uia_windows.json › bara_activitati › ferestre[%d]" % fer
    w, h = F["rect_ecran_100"][2], F["rect_ecran_100"][3]
    out = {"rect": [0, 0, w, h], "sursa": base + " (Shell_TrayWnd; Shell_SecondaryTrayWnd = al doilea monitor, sărit)",
           "stanga": [], "centru": [], "deschise_ref": [], "tava": []}

    def walk(n, cale):
        for i, c in enumerate(n.get("copii") or []):
            cc = "%s › copii[%d]" % (cale, i)
            cls = c.get("clasa") or ""
            if c.get("tip") == "Button" and (cls in ("ToggleButton",) or "TaskListButton" in cls):
                o = nod(c, cc)
                tx = texte_copii(c)
                if tx:
                    o["text"] = tx
                if c.get("id") == "WidgetsButton":
                    out["stanga"].append(o)
                elif "TaskListButton" in cls and re.search(r" - \d+ (fereastră deschisă|ferestre deschise)$", o["nume"]):
                    out["deschise_ref"].append(o)          # STAREA momentului: nu se desenează (cadru.md, citirea B)
                else:
                    if "TaskListButton" in cls:
                        o["fixat"] = True
                    out["centru"].append(o)
            elif c.get("tip") == "Button" and cls.startswith("SystemTray."):
                o = nod(c, cc)
                o["clasa"] = cls
                out["tava"].append(o)
            else:
                walk(c, cc)
    walk(F["arbore"], base + " › arbore")
    return out


def start(S):
    sup = S["start"]
    F = sup["ferestre"][0]
    base = "uia_windows.json › start › ferestre[0] › arbore"
    w, h = F["rect_ecran_100"][2], F["rect_ecran_100"][3]
    out = {"rect": [0, 0, w, h], "sursa": base, "panou": None, "noduri": []}

    def adauga(o, rol):
        o["rol"] = rol
        out["noduri"].append(o)

    def walk(n, cale, ctx):
        for i, c in enumerate(n.get("copii") or []):
            cc = "%s › copii[%d]" % (cale, i)
            t, nm, aid = c.get("tip"), curat(c.get("nume")), c.get("id") or ""
            if t == "Window" and nm == "Căutați":
                out["panou"] = c.get("rect")                 # cadrul panoului (fereastra gazdei de căutare, centrată)
                out["panou_sursa"] = cc
                walk(c, cc, "cautare_ascunsa")
            elif t == "Edit":
                adauga(nod(c, cc), "caseta_cautare")
            elif t == "Button" and aid == "SearchBoxToggleButton":
                adauga(nod(c, cc), "cautare")
            elif t == "Group" and aid in ("PinnedListHeaderGrid", "TopLevelSuggestionsListHeader", "AllListHeading"):
                o = nod(c, cc)
                o["rol"] = "antet"
                out["noduri"].append(o)
                walk(c, cc, "antet")
            elif t == "Button" and ctx == "antet":
                adauga(nod(c, cc), "vizualizare")
            elif t == "Button" and n.get("id") == "AppsList":
                adauga(nod(c, cc), "mai_putine")
            elif t == "ListItem" and n.get("id") == "PinnedList":
                adauga(nod(c, cc), "fixat")
            elif t == "ListItem" and n.get("id") == "RecommendedList":
                adauga(nod(c, cc), "recomandat")
            elif t == "ListItem" and n.get("id") == "AppsList":
                o = nod(c, cc)
                o["butoane"] = [curat(b.get("nume")) for b in c.get("copii") or [] if b.get("tip") == "Button"]
                adauga(o, "categorie")
            elif t == "ListItem" and n.get("id") == "UserControl":
                o = nod(c, cc)
                if c.get("ascuns"):
                    o.update(nume="[utilizator]", ascuns=True, nota="contul (MeControl/Account) e sărit de dump; pe ecran: [utilizator]")
                    adauga(o, "cont")
                else:
                    adauga(o, "alimentare" if aid == "PowerButton" else "nav")
            elif t == "List" and aid == "UserControl":
                o = nod(c, cc)
                o["rol"] = "nav_lista"
                out["noduri"].append(o)
                walk(c, cc, ctx)
            elif t == "Button" and aid == "CloseStartAccessibleButton":
                adauga(nod(c, cc), "inchide_accesibil")
            else:
                walk(c, cc, ctx)
    walk(F["arbore"], base, None)
    return out


def meniu(S, cheie, fer_pref=None):
    sup = S[cheie]
    fs = sup["ferestre"]
    idx = fer_pref if fer_pref is not None else 0
    F = fs[idx]
    base = "uia_windows.json › %s › ferestre[%d] › arbore" % (cheie, idx)
    rr = F["rect_ecran_100"]
    out = {"rect": [0, 0, rr[2], rr[3]], "sursa": base, "randuri": []}

    def walk(n, cale):
        for i, c in enumerate(n.get("copii") or []):
            cc = "%s › copii[%d]" % (cale, i)
            if c.get("tip") == "MenuItem":
                out["randuri"].append(nod(c, cc))
            else:
                walk(c, cc)
    walk(F["arbore"], base)
    return out


def meniu_nou_explorer():
    E = citeste(REF / "uia_explorer.json")["suprafete"]["explorer_meniu_nou"]
    F = E["ferestre"][0]
    base = "uia_explorer.json › explorer_meniu_nou › ferestre[0] › arbore"
    rr = F["rect_ecran_100"]
    out = {"rect": [0, 0, rr[2], rr[3]], "sursa": base + " (desktopul nu are submeniul capturat: [NEVERIFICAT] R18-2)",
           "randuri": []}

    def walk(n, cale):
        for i, c in enumerate(n.get("copii") or []):
            cc = "%s › copii[%d]" % (cale, i)
            if c.get("tip") == "MenuItem":
                out["randuri"].append(nod(c, cc))
            else:
                walk(c, cc)
    walk(F["arbore"], base)
    return out


def butoane_fereastra():
    E = citeste(REF / "uia_explorer.json")["suprafete"]["explorer_fereastra"]
    F = E["ferestre"][0]
    out = []

    def walk(n, cale, dep):
        for i, c in enumerate(n.get("copii") or []):
            cc = "%s › copii[%d]" % (cale, i)
            if c.get("tip") == "Button" and curat(c.get("nume")) in ("Minimizare", "Maximizare", "Închidere") and dep < 4:
                o = nod(c, cc)
                o.pop("rect", None)
                o["w"], o["h"] = c["rect"][2], c["rect"][3]
                out.append(o)
            elif dep < 3:
                walk(c, cc, dep + 1)
    walk(F["arbore"], "uia_explorer.json › explorer_fereastra › ferestre[0] › arbore", 0)
    return out


def nume_din_explorer(nume):
    t = json.dumps(citeste(REF / "uia_explorer.json"), ensure_ascii=False)
    return ('"%s"' % nume) in t


def folder_nou():
    out = []
    for f in sorted((REF / "scenarii_real").glob("explorer_folder_nou*.json")):
        t = f.read_text(encoding="utf-8")
        for m in re.findall(r'"(Folder nou(?: \(\d+\))?)/"', t):
            if m not in out:
                out.append(m)
    return {"nume": out, "sursa": "referinte/scenarii_real/explorer_folder_nou*.json (nume_fisiere)"}


def icoane():
    out = {}
    for k, f in ICOANE.items():
        p = FLUENT / f
        if p.exists():
            out[k] = re.findall(r'\sd="([^"]+)"', p.read_text(encoding="utf-8"))
    return out


def construieste():
    U = citeste(REF / "uia_windows.json")
    S = U["suprafete"]
    B = bara(S)
    ceas = next((x for x in B["tava"] if x["nume"].startswith("Ceas ")), None)
    sabloane = {"sursa": "uia_windows.json › bara_activitati (numele butoanelor: „Explorer fixat”, „KeePassXC - 1 fereastră "
                         "deschisă”, „Terminal - 7 ferestre deschise”)",
                "fixat": "{x} fixat", "deschisa_1": "{x} - 1 fereastră deschisă", "deschise_n": "{x} - {n} ferestre deschise"}
    aplicatii = {
        "explorer": {"nume": "Explorer", "id": "Appid: Microsoft.Windows.Explorer",
                     "sursa": "uia_windows.json › bara_activitati („Explorer fixat”) + start („Explorer, Sistem”)"},
        "excel": {"nume": "Excel", "id": "Appid: Microsoft.Office.EXCEL.EXE.15",
                  "sursa": "uia_windows.json › start › Toate › Productivitate („Excel”, W~Microsoft.Office.EXCEL.EXE.15)"},
        "word": {"nume": "Word", "id": None, "sursa": "[NEVERIFICAT] R18-6: Word nu apare în referința Windows"},
        "powerpoint": {"nume": "PowerPoint", "id": None, "sursa": "[NEVERIFICAT] R18-6: PowerPoint nu apare în referința Windows"},
        "paint": {"nume": "Paint", "id": None, "sursa": "[NEVERIFICAT] R18-6: Paint nu apare în referința Windows"}}
    pict = [{"nume": "Acest PC", "fel": "pc", "sursa": "uia_explorer.json › explorer_fereastra (panoul de navigare: „Acest PC”)"
             if nume_din_explorer("Acest PC") else "[NEVERIFICAT]"},
            {"nume": "Coș de reciclare", "fel": "cos", "sursa": "api_biblioteca.md §3 (exemplul țintei „desktop:Coș de reciclare”) "
             "— desktopul nu e capturat: [NEVERIFICAT] R18-5"}]
    date = {
        "_despre": {
            "ce": "Windows 11 (RO) din biblioteca centrală: bara de activități, Start, meniurile de clic dreapta ale desktopului.",
            "generat_de": "aplicatii/_unelte/genereaza_windows.py (runda 18, valul B-windows)",
            "referinta": "referinte/uia_windows.json (UI Automation pe Windows-ul profesorului, 20.11.2026; ecran 1536×864 logic)",
            "citirea": "runde/18/cadru.md (B): configurația din referință; ferestrele deschise și ora vin din starea simulatorului",
            "icoane": "Fluent UI System Icons (MIT, Microsoft) — date/LICENSE-fluent-icons.txt; _cercetare/office_comenzi/fluent"},
        "ecran_ref": {"w": B["rect"][2], "h": B["rect"][3] + S["start"]["ferestre"][0]["rect_ecran_100"][3],
                      "sursa": "uia_windows.json › bara_activitati.ferestre[1].rect_ecran_100 + start.ferestre[0].rect_ecran_100"},
        "bara_activitati": B,
        "ceas": {"model": ceas["nume"] if ceas else None, "format": "Ceas {hh}:{mm}\n{zz}.{ll}.{aaaa}",
                 "sursa": (ceas or {}).get("sursa"), "nota": "ora e vie (de_aprobat A18-1); formatul e cel din referință"},
        "sabloane": sabloane,
        "aplicatii": aplicatii,
        "start": start(S),
        "meniu_desktop": meniu(S, "meniu_desktop", 1),
        "meniu_desktop_clasic": meniu(S, "meniu_desktop_clasic"),
        "meniu_nou": meniu_nou_explorer(),
        "fereastra": {"butoane": butoane_fereastra(),
                      "sursa": "uia_explorer.json › explorer_fereastra (bara de titlu) — fereastra generică Windows nu e capturată: "
                               "[NEVERIFICAT] R18-4"},
        "desktop": {"pictograme": pict},
        "folder_nou": folder_nou(),
        "icoane": icoane(),
        "lipsuri": [
            "submeniul Nou al desktopului (luat din Explorer, R18-2)", "meniul Alimentare (Oprire / Repornire), R18-3",
            "panoul de căutare cu rezultate (windows.cautare), R18-3", "calendarul de la ceas (windows.calendar), R18-3",
            "fereastra generică și Securitate Windows (windows.fereastra, windows.securitate_windows), R18-4",
            "pictogramele și fundalul desktopului (windows.desktop), R18-5",
            "textul de pe ecran al dalelor-folder și al categoriilor din Toate (UI Automation dă numele accesibil), R18-1"]}
    return date


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--verifica", action="store_true")
    a = ap.parse_args()
    nou = json.dumps(construieste(), ensure_ascii=False, indent=1) + "\n"
    if a.verifica:
        vechi = IESIRE.read_text(encoding="utf-8") if IESIRE.exists() else ""
        dif = 0 if vechi == nou else 1
        print("la zi" if not dif else "DE REGENERAT: %s" % IESIRE)
        print(dif)
        sys.exit(dif)
    IESIRE.write_text(nou, encoding="utf-8")
    d = json.loads(nou)
    print("scris %s: bara %d+%d+%d (deschise în referință, nedesenate: %d), start %d noduri, meniu %d, clasic %d, nou %d, "
          "icoane %d" % (IESIRE, len(d["bara_activitati"]["stanga"]), len(d["bara_activitati"]["centru"]),
                         len(d["bara_activitati"]["tava"]), len(d["bara_activitati"]["deschise_ref"]),
                         len(d["start"]["noduri"]), len(d["meniu_desktop"]["randuri"]),
                         len(d["meniu_desktop_clasic"]["randuri"]), len(d["meniu_nou"]["randuri"]), len(d["icoane"])))
    print(0)


if __name__ == "__main__":
    main()
