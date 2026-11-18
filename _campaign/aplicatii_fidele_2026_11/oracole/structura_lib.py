# -*- coding: utf-8 -*-
"""structura_lib.py — piesele comune ale oracolelor de STRUCTURĂ (Etapa 0, 16.11.2026):
O1 oracol_central.py (R1) · O2 oracol_identic.py (R2) · O3 oracol_ui.py (R4a) · O7 oracol_text_ui.py (R11) ·
O8 oracol_comenzi_moarte.py (R12).

Ce face:
- citește reperele ÎNGHEȚATE din dosarul lucrării (inventar.json, suprafete.json, referinte/uia_*.json) — mereu din
  dosarul acestui fișier, nu din copia măsurată;
- citește SITUL de măsurat din LH_RADACINA (implicit C:/00/Projects/LearningHub_fidel; convenția din
  oracole/CONVENTIE_RADACINA.md, scrisă de infrastructură) — paginile, simulatoarele, biblioteca aplicatii/;
- randează fiecare pagină din inventar într-un Chromium (Playwright), pe un server static local pe port liber
  (127.0.0.1, 0), cu TOT ce nu e 127.0.0.1/localhost abandonat (regula 24), cu navigator.sendBeacon oprit (întoarce
  false) și assets/js/prezenta.js + site-credit.js neîncărcate (ca oracole/sarcini_lib/joaca.py: sendBeacon la
  închiderea paginii scăpa odată de rută), fereastra 1366×768, Math.random fixat (jocurile trag întrebări la
  întâmplare: aceeași măsurare de două ori = același număr);
- extrage arborele randat cu oracole/arbore_randat.js și îl compară cu referința reală după oracole/CONVENTIE_ARBORE.md;
- ține randarea într-un cache (randare_<amprentă>.json) cheiat pe sha256 al fișierelor sitului + al extractorului + al
  acestui modul: O1/O2/O3/O7/O8 rulate unul după altul randează o singură dată. Unde stă cache-ul: LH_IESIRI dacă e
  dat; altfel oracole/_iesiri/ (scutit de repere.lock) DOAR pe worktree; pe orice altă rădăcină (copiile din %TEMP%)
  în %TEMP%/lh_structura_cache/ — niciodată în dosarul lucrării. În cache și în <oracol>.json se scriu doar căi
  RELATIVE la rădăcina sitului (rădăcina însăși = „.”). LH_FARA_CACHE=1 = randare de la zero: se acceptă doar o
  randare terminată DUPĂ pornirea acestui proces (a doua linie de bază a mutanților, reparația 11).
Ieșirile după oracole/CONVENTIE_RADACINA.md: <oracol>.json în LH_IESIRE (sinonim LH_IESIRI), altfel lângă oracol;
LH_PAGINI (exact) / LH_DOAR_PAGINI (subșiruri) restrâng paginile din inventar. Nimic scris în LH_RADACINA.
Nu scrie nimic pe serverul viu, nu atinge Office."""
import os
import re
import sys
import json
import html
import time
import hashlib
import tempfile
import unicodedata
import threading
import functools
import traceback
from pathlib import Path

T_PORNIRE = time.time()        # LH_FARA_CACHE=1: doar o randare terminată după acest moment e „de la zero”

D = Path(__file__).resolve().parent.parent
ORACOLE = D / "oracole"
WT_IMPLICIT = Path(r"C:/00/Projects/LearningHub_fidel")
APLICATII = ["windows", "explorer", "word", "excel", "powerpoint", "paint"]
OFFICE = ["word", "excel", "powerpoint"]
TOL_PX = 8           # toleranța poziției relative (px CSS, la 1366×768): R4a
VIEWPORT = {"width": 1366, "height": 768}
VERSIUNE = "structura-1"


# ====================================================================== căi, ieșire
def radacina():
    r = os.environ.get("LH_RADACINA")
    return Path(r).resolve() if r else WT_IMPLICIT.resolve()


def e_radacina_implicita():
    return radacina() == WT_IMPLICIT.resolve()


def dir_iesiri():
    """unde scrie oracolul <oracol>.json (CONVENTIE_RADACINA.md): LH_IESIRE (sau sinonimul LH_IESIRI); altfel lângă oracol."""
    e = os.environ.get("LH_IESIRE") or os.environ.get("LH_IESIRI")
    p = Path(e).resolve() if e else ORACOLE
    p.mkdir(parents=True, exist_ok=True)
    return p


def dir_cache():
    """cache-ul randării, comun tuturor oracolelor de structură; fișierul poartă amprenta sitului, deci copiile
    (mutanții) nu se amestecă între ele. Unde (reparația 3, verificare_etapa0.md):
    - LH_IESIRI, dacă e dat (mutanti.py îl pune în %TEMP%);
    - altfel, DOAR când situl măsurat e worktree-ul: oracole/_iesiri/ (scutit de repere.lock);
    - pe orice altă rădăcină (copiile din %TEMP%, autotestele): %TEMP%/lh_structura_cache/ — niciodată în dosarul
      lucrării, unde poarta date_personale ar găsi calea copiei (cu numele contului). Nimic în LH_RADACINA."""
    e = os.environ.get("LH_IESIRI")
    if e:
        p = Path(e).resolve()
    elif e_radacina_implicita():
        p = ORACOLE / "_iesiri"
    else:
        p = Path(tempfile.gettempdir()) / "lh_structura_cache"
    p.mkdir(parents=True, exist_ok=True)
    return p


def fara_cache():
    """LH_FARA_CACHE=1: randarea se face de la zero (orice altă valoare decât gol / 0)."""
    return os.environ.get("LH_FARA_CACHE", "").strip() not in ("", "0")


def _inlocuiri_cai(R, base=None):
    """perechile (absolut -> relativ) cu care se curăță tot ce se scrie: adresa serverului local -> „/”, rădăcina
    sitului -> „.” (fișierele sub ea -> calea relativă), apoi %TEMP% și dosarul utilizatorului (nume de cont) ->
    marcaje. Numele contului nu e scris nicăieri în cod: vine din căile mediului."""
    out = []
    if base:
        out.append((base, "/"))
    s = str(R)
    for v in (s, s.replace("\\", "/")):
        out += [(v + ("\\" if "\\" in v else "/"), ""), (v, ".")]
    for v, marcaj in ((tempfile.gettempdir(), "%TEMP%"), (os.path.expanduser("~"), "~")):
        if v and len(v) > 3:
            out += [(v, marcaj), (v.replace("\\", "/"), marcaj)]
    return out


def relativ(o, inlocuiri):
    """aplică _inlocuiri_cai pe toate șirurile dintr-o structură JSON (chei și valori)."""
    if isinstance(o, str):
        for a, b in inlocuiri:
            if a and a in o:
                o = o.replace(a, b)
        return o
    if isinstance(o, list):
        return [relativ(x, inlocuiri) for x in o]
    if isinstance(o, dict):
        return {relativ(k, inlocuiri): relativ(v, inlocuiri) for k, v in o.items()}
    return o


def pregateste_consola():
    for s in (sys.stdout, sys.stderr):
        try:
            s.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass


def ruleaza(nume, functie):
    """Învelișul fiecărui oracol: ultima linie = un întreg, cod 0/1; orice prăbușire = cod 2 și ultima linie NU e număr."""
    pregateste_consola()
    try:
        numar, detalii, linii = functie()
    except SystemExit:
        raise
    except BaseException:
        traceback.print_exc()
        print(f"{nume}: EROARE (oracolul s-a prăbușit; vezi mai sus)")
        print("NECONCLUDENT")
        sys.exit(2)
    p = dir_iesiri() / f"{nume}.json"
    detalii = dict(detalii)
    # rădăcina NU se scrie absolut (pe o copie din %TEMP% calea conține numele contului): „.” + dacă e worktree-ul
    detalii.update(oracol=nume, numar=int(numar), generat=time.strftime("%Y-%m-%d %H:%M:%S"), radacina=".",
                   radacina_e_worktree=e_radacina_implicita(), versiune=VERSIUNE, fara_cache=fara_cache(),
                   filtru_pagini=os.environ.get("LH_PAGINI", "") or os.environ.get("LH_DOAR_PAGINI", ""))
    detalii = relativ(detalii, _inlocuiri_cai(radacina()))
    p.write_text(json.dumps(detalii, ensure_ascii=False, indent=1), encoding="utf-8")
    for l in linii:                 # rândurile informative stau ÎNAINTEA penultimei linii
        l = str(l).strip()
        if l:
            print(l)
    print(str(p))                   # penultima linie: calea JSON-ului cu detalii
    print(int(numar))               # ultima linie: numărul de probleme
    sys.exit(0 if int(numar) == 0 else 1)


# ====================================================================== reperele înghețate
_CACHE = {}


def citeste_json(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def inventar():
    if "inv" not in _CACHE:
        _CACHE["inv"] = citeste_json(D / "inventar.json")
    return _CACHE["inv"]


def suprafete():
    if "supr" not in _CACHE:
        _CACHE["supr"] = citeste_json(D / "suprafete.json")
    return _CACHE["supr"]


def referinta_bruta(app):
    """referinte/uia_<app>.json în formatul nodurilor {tip, eticheta, id_mso, rect_css, copii}; altfel None
    (uia_explorer.json de azi are doar fereastra Proprietăți, în alt format, și nu acoperă nicio suprafață din suprafete.json)."""
    k = "ref:" + app
    if k not in _CACHE:
        p = D / "referinte" / f"uia_{app}.json"
        d = None
        if p.exists():
            try:
                d = citeste_json(p)
                s = d.get("suprafete") or {}
                if not any(isinstance(v, dict) and "tip" in v and "copii" in v for v in s.values()):
                    d = None
            except Exception:
                d = None
        _CACHE[k] = d
    return _CACHE[k]


# ====================================================================== normalizarea etichetelor
_SUF_SCURT = re.compile(r"\s*\((?:ctrl|alt|shift|f\d{1,2})\b[^)]*\)\s*$", re.I)


def norm(s):
    if s is None:
        return ""
    s = unicodedata.normalize("NFC", str(s))
    s = (s.replace("\u2011", "-").replace("\u2010", "-").replace("\u2013", "-").replace("\u2012", "-")
         .replace("\u00a0", " ").replace("\u202f", " ").replace("\u200b", ""))
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r"^¶\s*", "", s)
    s = _SUF_SCURT.sub("", s)
    s = re.sub(r"(\.\.\.|…|▾|▼|:)+\s*$", "", s).strip()
    return s.casefold()


def variante(s):
    """Variantele unei etichete randate/citate: întreagă, părțile „X (Y)”, partea dinainte de „ · ” și de „: ”."""
    out = []
    if s is None:
        return out
    s = re.sub(r"\s+", " ", str(s)).strip()
    if not s:
        return out

    def add(x):
        x = (x or "").strip()
        if x and x not in out:
            out.append(x)
    add(s)
    parti = re.split(r"\s+·\s+", s)
    for x in parti:
        add(x)
    p = parti[0]
    c = re.split(r":\s", p)[0]
    add(c)
    for z in (p, c):
        m = re.match(r"^(.*?)\s*\(([^()]*)\)\s*$", z)
        if m:
            add(m.group(1))
            add(m.group(2))
    return out[:12]


def cand_norm(lista):
    out = []
    for c in lista or []:
        for v in variante(c):
            n = norm(v)
            if n and n not in out:
                out.append(n)
    return out


def cand_intreg(lista):
    """Candidații unui text VĂZUT pe un nod RANDAT (reverificare_etapa0.md 6.b): fiecare rând întreg și toate rândurile
    împreună, normalizate (norm: litere mici, fără „...”/„▾”/„:” la final, fără sufixul „(Ctrl …)”) — FĂRĂ variantele
    „X (Y)”, „X · Y”, „X: Y”. Acelea sunt pentru citatele din LECȚII (textul pe „ambele nume”, I3 / O7); pe ecranul
    aplicației Office scrie „Insert”, nu „Inserare (Insert)” — o etichetă bilingvă pe ecran e o diferență, nu o potrivire."""
    out = []
    for c in lista or []:
        n = norm(c)
        if n and n not in out:
            out.append(n)
    return out


# ====================================================================== forma canonică (aceeași pentru referință și randare)
TIPURI_UNITATE = {"Button", "SplitButton", "MenuItem", "ComboBox", "CheckBox", "RadioButton", "Edit", "Spinner", "ListItem",
                  "Slider", "TabItem", "Hyperlink", "Text", "TreeItem", "DataItem", "Dropdown"}
FAMILIE = {"Button": "Button", "SplitButton": "Split", "MenuItem": "Menu", "ComboBox": "Combo", "CheckBox": "Check",
           "RadioButton": "Radio", "Edit": "Edit", "Spinner": "Edit", "ListItem": "Item", "TreeItem": "Item", "DataItem": "Item",
           "TabItem": "Tab", "Slider": "Slider", "Text": "Text", "Hyperlink": "Link"}


def tip_compatibil(tref, trend):
    if trend == "Dropdown":
        return tref in ("SplitButton", "MenuItem")
    return FAMILIE.get(tref, tref) == FAMILIE.get(trend, trend)


def _turteste(n, out):
    if not isinstance(n, dict) or n.get("vizibil") is False:
        return
    tip = n.get("tip")
    et = (n.get("eticheta") or "").strip()
    if tip in TIPURI_UNITATE and et and not et.startswith("[redactat"):
        out.append(n)
        return
    for c in n.get("copii") or []:
        _turteste(c, out)


LITERE_RE = re.compile(r"[A-Za-zĂÂÎȘȚăâîșțŞŢşţÀ-ɏ]")
SCURT_FINAL_RE = re.compile(r"\s+(?:(?:ctrl|alt|shift|win)\s*\+\s*)+\S+\s*$|\s+f\d{1,2}\s*$", re.I)
TIPURI_VALOARE = {"ComboBox", "Edit", "Spinner", "Slider"}


def linii_vizibile(n):
    """rândurile de text VĂZUTE ale unui nod randat (arbore_randat.js: „text_vizibil”), fără scurtătura scrisă la capăt
    („Copy Ctrl+C”); un rând cu mai puțin de 2 litere (B, ✕, ¶→, x²) e o pictogramă, nu un nume."""
    out = []
    for l in n.get("text_vizibil") or []:
        l = SCURT_FINAL_RE.sub("", re.sub(r"\s+", " ", str(l)).strip()).strip()
        if len(LITERE_RE.findall(l)) >= 2 and len(l) <= 120:
            out.append(l)
    return out


def eticheta_vizibila(n, lax=False):
    """Reparația 9 (verificare_etapa0.md 3.c): eticheta COMPARATĂ a unui nod RANDAT = textul de pe ecran.
    → (eticheta, candidați normalizați sau None = cei vechi, declarata_diferita).
    - nodul referinței (n-are „text_vizibil”), un control care arată o valoare (caseta fontului) sau un buton doar cu
      pictogramă: numele declarat (data-lh-eticheta / aria-label / title), ca înainte;
    - cu text vizibil: se compară textul vizibil ÎNTREG (cand_intreg: rândurile și toate împreună, fără variantele
      „RO (EN)” — reverificare_etapa0.md 6.b: „Inserare (Insert)” pe ecran nu mai trece drept „Insert”);
      data-lh-eticheta e acceptată doar dacă e chiar pe ecran (unul dintre rânduri sau toate împreună; File Tab ~ File
      la FileTabButton; pe bara de stare / de titlu și forma lungă „Page Number Page 1 of 1” ~ „Page 1 of 1”) — altfel
      e o diferență în sine (`eticheta_declarata`: atributul „Insert”, ecranul „Inserare” sau „Inserare (Insert)”)."""
    et = n.get("eticheta") or ""
    if "text_vizibil" not in n or n.get("valoare") or n.get("tip") in TIPURI_VALOARE:
        return et, None, False
    linii = linii_vizibile(n)
    if not linii:
        return et, None, False
    tot = " ".join(linii)
    cv = cand_intreg([tot] + linii)
    decl = n.get("declarata")
    if decl is not None and str(decl).strip():
        nd = norm(decl)
        ok = nd in cv
        if not ok and n.get("id_mso") == "FileTabButton":
            ok = nd in ("file tab", "file") and "file" in cv
        if not ok and lax:
            ok = any(len(c) >= 4 and (nd.endswith(" " + c) or nd.startswith(c + " ")) for c in cv)
        if ok:
            return decl, [nd] + [c for c in cv if c != nd], False
        return tot, cv, True
    return tot, cv, False


def _unit(n, lax=False):
    et, cv, dif = eticheta_vizibila(n, lax)
    if n.get("id_mso") == "FileTabButton" and norm(et) in ("file tab", "file"):
        et = "File"
    c = list(cv) if cv is not None else cand_norm(n.get("cand") or [])
    ne = norm(et)
    if ne and ne not in c:
        c.insert(0, ne)
    return {"et": ne, "raw": et, "cand": c, "id": n.get("id_mso") or None, "tip": n.get("tip"),
            "rect": n.get("rect_css") or n.get("rect"), "nesim": bool(n.get("nesim")), "activ": n.get("activ") is not False,
            "decl_dif": dif, "declarata": n.get("declarata") if dif else None}


def legenda_lipsa(c):
    """reverificare_etapa0.md 6.a: un grup RANDAT al panglicii fără legendă VIZIBILĂ (în Office numele grupului se vede
    mereu sub el; referința: toate cele 223 de grupuri Word/Excel/PowerPoint au nume). Vechi: „legenda” din
    arbore_randat.js (.pg-nume, altfel textul grupului din afara comenzilor); convenție: textul propriu al grupului
    („text_vizibil”, fără comenzile lui). Un nume doar în aria-label / data-lh-eticheta NU e legendă: elevul nu-l vede."""
    if "text_vizibil" not in c:
        return False                      # nodul referinței
    leg = c.get("legenda") if "legenda" in c else c.get("text_vizibil")
    return not linii_vizibile({"text_vizibil": leg or []})


def _eticheta_grup(c):
    """numele unui grup al panglicii: referința — ca înainte; randat — legenda VIZIBILĂ (vechi: .pg-nume; convenție:
    textul propriu al grupului), comparată ÎNTREAGĂ (cand_intreg, 6.b). Convenția: data-lh-eticheta rămâne numele de
    aliniere, dar dacă grupul are text propriu pe ecran și numele declarat nu e printre rânduri, e o diferență în sine.
    → (eticheta, cand, declarata_diferita)."""
    lbl = c.get("eticheta") or ""
    if "text_vizibil" not in c:
        return lbl, cand_norm([lbl] + list(c.get("cand") or [])), False
    linii = linii_vizibile(c)
    decl = c.get("declarata")
    if decl is not None and str(decl).strip():
        return decl, cand_norm([decl]), bool(linii) and norm(decl) not in cand_intreg([" ".join(linii)] + linii)
    if linii:
        tot = " ".join(linii)
        return tot, cand_intreg([tot] + linii), False
    return lbl, cand_norm([lbl] + list(c.get("cand") or [])), False


def e_panglica(cheie):
    return cheie.split("#")[0].startswith("panglica")


def canon(cheie, root):
    """→ {"rect", "grupuri": [{"g", "raw", "cand", "rect", "u": [unit]}]}. Panglica: Pane › Group(fila) › Group-uri › comenzi;
    restul suprafețelor: un singur grup implicit „” cu toate unitățile turtite."""
    rr = root.get("rect_css") or root.get("rect")
    grupuri = []
    lax = cheie in ("bara_stare", "bara_titlu")
    if e_panglica(cheie):
        n = root
        kids = [c for c in n.get("copii") or [] if c.get("vizibil") is not False]
        if n.get("tip") == "Pane" and len(kids) == 1 and kids[0].get("tip") == "Group":
            n = kids[0]
        impl = []
        for c in n.get("copii") or []:
            if c.get("vizibil") is False:
                continue
            if c.get("tip") == "Group":
                us = []
                _turteste(c, us)
                lbl, cg, dif = _eticheta_grup(c)
                grupuri.append({"g": norm(lbl), "raw": lbl, "cand": cg, "decl_dif": dif, "fara_legenda": legenda_lipsa(c),
                                "rect": c.get("rect_css") or c.get("rect"), "u": [_unit(x, lax) for x in us]})
            else:
                _turteste(c, impl)
        if impl:
            grupuri.insert(0, {"g": "", "raw": "", "cand": [""], "rect": rr, "u": [_unit(x, lax) for x in impl]})
    else:
        us = []
        _turteste(root, us)
        grupuri.append({"g": "", "raw": "", "cand": [""], "rect": rr, "u": [_unit(x, lax) for x in us]})
    return {"rect": rr, "grupuri": grupuri}


def nr_unitati(c):
    return sum(len(g["u"]) for g in c["grupuri"]) + sum(1 for g in c["grupuri"] if g["g"])


# ====================================================================== referința canonică + indexul ei
class Referinta:
    def __init__(self, app):
        self.app = app
        self.bruta = referinta_bruta(app)
        self.canon = {}
        self.file = {}          # norm(eticheta filei) -> cheia suprafeței (panglica.X / panglica_context.X)
        self.file_brut = []     # etichetele filelor principale, în ordine
        self.dialoguri = {}     # norm(titlu) -> cheia de bază (dialog.X / panou.X)
        self.lansatoare = []    # dialogurile deschise prin ExecuteMso(idMso), cu fila controlului
        if not self.bruta:
            return
        S = self.bruta["suprafete"]
        for k, v in S.items():
            self.canon[k] = canon(k, v)
        fp = S.get("file_panglicii")
        if fp:
            def walk(n):
                if n.get("tip") == "TabItem" and n.get("id_mso"):
                    self.file[norm(n.get("eticheta"))] = "panglica." + n["id_mso"]
                    self.file_brut.append(n.get("eticheta"))
                for c in n.get("copii") or []:
                    walk(c)
            walk(fp)
        for k, v in S.items():
            if k.startswith("panglica_context."):
                f = v.get("fila") or {}
                if f.get("eticheta"):
                    self.file.setdefault(norm(f["eticheta"]), k)
            if (k.startswith("dialog.") or k.startswith("panou.")) and "#" not in k:
                self.dialoguri.setdefault(norm(v.get("eticheta")), k)
        alias = {"avertisment de sortare": "sort warning", "sortare particularizată": "sort", "sortare": "sort",
                 "inserare tabel": "insert table", "paragraf": "paragraph", "inițializare pagină": "page setup",
                 "salvare ca": "save as", "formatare celule": "format cells", "formatare fundal": "format background"}
        for ro, en in alias.items():
            if en in self.dialoguri:
                self.dialoguri.setdefault(ro, self.dialoguri[en])
        # lansatoarele dialogurilor: idMso din deschis_prin -> controlul cu acel idMso dintr-o filă
        for k, v in S.items():
            m = re.search(r"ExecuteMso\('([A-Za-z0-9]+)'\)", v.get("deschis_prin") or "")
            if not m or "#" in k:
                continue
            idm = m.group(1)
            loc = self.gaseste_id(idm)
            self.lansatoare.append({"cheie": k, "id": idm, "fila": loc[0] if loc else None,
                                    "eticheta": loc[1] if loc else None, "fila_eticheta": self.eticheta_filei(loc[0]) if loc else None})

    def gaseste_id(self, idm):
        for k, c in self.canon.items():
            if not e_panglica(k):
                continue
            for g in c["grupuri"]:
                for u in g["u"]:
                    if u["id"] == idm:
                        return (k, u["raw"])
        return None

    def eticheta_filei(self, cheie):
        for et, k in self.file.items():
            if k == cheie:
                return et
        return None

    def taburi_norm(self):
        return list(self.file.keys())

    def info_js(self):
        return {"tabs": self.file_brut, "lansatoare": self.lansatoare}

    def cheie_pentru(self, cheie_randata):
        """Cheia de referință pentru o cheie randată: convenția dă direct cheia; modul vechi dă „panglica?<filă>”,
        „dialog?<titlu>”, „backstage?nav”."""
        if cheie_randata in self.canon:
            return cheie_randata
        if cheie_randata.startswith("panglica?"):
            for v in variante(cheie_randata[9:]):
                k = self.file.get(norm(v))
                if k:
                    return k
            return None
        if cheie_randata.startswith("dialog?"):
            for v in variante(cheie_randata[7:]):
                for n in (norm(v), re.sub(r"^(?:fereastra|caseta(?: de dialog)?|dialogul)\s+", "", norm(v)).strip("„”\"' ")):
                    k = self.dialoguri.get(n)
                    if k:
                        return k
            return None
        if cheie_randata == "backstage?nav":
            return "backstage.nav" if "backstage.nav" in self.canon else None
        return None


def referinte():
    if "refs" not in _CACHE:
        _CACHE["refs"] = {a: Referinta(a) for a in APLICATII}
    return _CACHE["refs"]


# ====================================================================== comparația
def _lis_indici(seq):
    """indicii (în seq) ai unui cel mai lung subșir strict crescător."""
    import bisect
    if not seq:
        return set()
    tails, tails_i, prev = [], [], [-1] * len(seq)
    for i, v in enumerate(seq):
        j = bisect.bisect_left(tails, v)
        if j == len(tails):
            tails.append(v)
            tails_i.append(i)
        else:
            tails[j] = v
            tails_i[j] = i
        prev[i] = tails_i[j - 1] if j > 0 else -1
    out, k = set(), tails_i[-1]
    while k >= 0:
        out.add(k)
        k = prev[k]
    return out


def potriveste(r, x, lax=False):
    if r.get("id") and x.get("id") and r["id"] == x["id"]:
        return True
    if r["et"] and r["et"] in x["cand"]:
        return True
    if lax and r["et"]:
        for c in x["cand"]:
            if len(c) >= 4 and (r["et"].endswith(" " + c) or r["et"].startswith(c + " ")):
                return True
    return False


def aliniaza(R, X, lax=False):
    used, pr = set(), {}
    for ri, r in enumerate(R):
        if r.get("id"):
            for xi, x in enumerate(X):
                if xi not in used and x.get("id") == r["id"]:
                    used.add(xi)
                    pr[ri] = xi
                    break
    for ri, r in enumerate(R):
        if ri in pr:
            continue
        for xi, x in enumerate(X):
            if xi not in used and potriveste(r, x, lax):
                used.add(xi)
                pr[ri] = xi
                break
    pairs = sorted(pr.items())
    keep = _lis_indici([xi for _, xi in pairs])
    dez = [pairs[k] for k in range(len(pairs)) if k not in keep]
    lipsa = [ri for ri in range(len(R)) if ri not in pr]
    plus = [xi for xi in range(len(X)) if xi not in used]
    return pairs, lipsa, plus, dez


def _poz_dif(r, rp, x, xp):
    try:
        if not (r and rp and x and xp) or x[2] <= 0 or x[3] <= 0:
            return False
        dx = (r[0] - rp[0]) - (x[0] - xp[0])
        dy = (r[1] - rp[1]) - (x[1] - xp[1])
        return abs(dx) > TOL_PX or abs(dy) > TOL_PX
    except Exception:
        return False


def compara(cheie, ref, rend, detaliat=False):
    """→ listă de diferențe (fel, grup, eticheta). rend=None = suprafața nu e desenată (toate unitățile ei lipsă + 1)."""
    out = []
    lax = cheie in ("bara_stare", "bara_titlu")
    if rend is None:
        out.append(("suprafata_lipsa", "", cheie))
        for g in ref["grupuri"]:
            if g["g"]:
                out.append(("grup_lipsa", g["g"], g["raw"]))
            out += [("lipsa", g["g"], u["raw"]) for u in g["u"]]
        return out
    RG, XG = ref["grupuri"], rend["grupuri"]
    # grupul implicit „” (suprafețele fără grupuri) se potrivește doar cu grupul implicit
    gR = [{"et": g["g"], "cand": [g["g"]], "id": None if g["g"] else "__implicit__"} for g in RG]
    gX = [{"et": g["g"], "cand": g.get("cand") or [g["g"]], "id": None if g["g"] else "__implicit__"} for g in XG]
    gp, gl, gx, gd = aliniaza(gR, gX)
    for ri in gl:
        g = RG[ri]
        out.append(("grup_lipsa", g["g"], g["raw"]))
        out += [("lipsa", g["g"], u["raw"]) for u in g["u"]]
    for xi in gx:
        g = XG[xi]
        out.append(("grup_in_plus", g["g"], g["raw"]))
        out += [("in_plus", g["g"], u["raw"]) for u in g["u"]]
    for ri, _ in gd:
        out.append(("ordine_grup", RG[ri]["g"], RG[ri]["raw"]))
    # reparația 9: o etichetă declarată (data-lh-eticheta) care NU e textul de pe ecran = o diferență în sine, la O2 și
    # la O3, oricum s-ar fi aliniat comanda (atributul „Insert”, ecranul „Inserare”)
    for x in XG:
        if x.get("decl_dif"):
            out.append(("eticheta_declarata", x["g"], x["raw"]))
        # reverificare_etapa0.md 6.a: grupul desenat fără legendă vizibilă (numele doar în aria-label) — la O2 și la O3
        if x.get("fara_legenda"):
            out.append(("grup_fara_legenda", x["g"], x["raw"]))
        for u in x["u"]:
            if u.get("decl_dif"):
                out.append(("eticheta_declarata", x["g"], u["raw"]))
    lipsuri, plusuri = [], []
    for ri, xi in gp:
        g, x = RG[ri], XG[xi]
        pairs, lipsa, plus, dez = aliniaza(g["u"], x["u"], lax)
        lipsuri += [(g, g["u"][i]) for i in lipsa]
        plusuri += [(x, g, x["u"][i]) for i in plus]
        out += [("ordine", g["g"], g["u"][a]["raw"]) for a, _ in dez]
        for a, b in pairs:
            r, u = g["u"][a], x["u"][b]
            # același idMso, alt nume PE ECRAN: la O2 și la O3 (potrivirea după id nu mai ascunde eticheta vizibilă)
            if r.get("id") and u.get("id") == r["id"] and r["et"] not in u["cand"]:
                out.append(("eticheta", g["g"], r["raw"]))
            if detaliat:
                if not tip_compatibil(r["tip"], u["tip"]):
                    out.append(("tip", g["g"], r["raw"]))
                if _poz_dif(r["rect"], g["rect"], u["rect"], x["rect"]):
                    out.append(("pozitie", g["g"], r["raw"]))
        if detaliat and g["g"] and _poz_dif(g["rect"], ref["rect"], x["rect"], rend["rect"]):
            out.append(("pozitie_grup", g["g"], g["raw"]))
    if detaliat:
        folosite = set()
        for g, r in lipsuri:
            gasit = None
            for k, (x, gref, u) in enumerate(plusuri):
                if k in folosite or gref is g:
                    continue
                if potriveste(r, u, lax):
                    gasit = k
                    break
            if gasit is not None:
                folosite.add(gasit)
                out.append(("grupare", g["g"], r["raw"]))
            else:
                out.append(("lipsa", g["g"], r["raw"]))
        out += [("in_plus", x["g"], u["raw"]) for k, (x, gref, u) in enumerate(plusuri) if k not in folosite]
    else:
        out += [("lipsa", g["g"], r["raw"]) for g, r in lipsuri]
        out += [("in_plus", x["g"], u["raw"]) for x, gref, u in plusuri]
    return out


def chei_diferente(cheie, difs):
    """cheile stabile ale diferențelor (cu numărul aparițiilor aceleiași etichete), pentru reuniuni pe pagini."""
    cnt, out = {}, []
    for fel, g, et in difs:
        b = f"{cheie}|{g}|{fel}|{norm(et)}"
        cnt[b] = cnt.get(b, 0) + 1
        out.append(f"{b}#{cnt[b]}")
    return out


# ====================================================================== suprafețele comparate
def chei_o2(ref):
    """O2 (R2): filele, panglica fiecărei file principale, Acces rapid, bara de stare, File › nav, meniurile de clic dreapta."""
    out = []
    for k in ref.canon:
        if (k in ("file_panglicii", "acces_rapid", "bara_stare", "backstage.nav") or k.startswith("panglica.")
                or k.startswith("meniu_contextual.")):
            out.append(k)
    return out


MEREU_LA_VEDERE = ("file_panglicii", "bara_stare", "acces_rapid", "bara_titlu")


CONTEXT_TAB = {"TabPictureToolsFormat": "Ctx_PictureFormat", "TabTableToolsDesign": "Ctx_TableDesign",
               "TabTableToolsLayout": "Ctx_TableLayout", "TabChartToolsDesignNew": "Ctx_ChartDesign",
               "TabChartToolsFormatNew": "Ctx_Format"}


def referinta_suprafata(app, sid, ref):
    """Suprafața din suprafete.json -> cheile de referință care o acoperă ([] = fără referință = 1 diferență la O3)."""
    if not ref or not ref.canon:
        return []
    rest = sid[len(app) + 1:]
    S = ref.canon
    bru = ref.bruta["suprafete"]
    if rest in S:
        return [rest]
    if rest == "backstage":
        return [k for k in S if k.startswith("backstage.")]
    if rest == "buton_file":
        return ["file_panglicii"] if ref.gaseste_id("FileTabButton") or any(
            u["id"] == "FileTabButton" for g in S.get("file_panglicii", {"grupuri": []})["grupuri"] for u in g["u"]) else []
    if rest in ("meniu_clic_dreapta", "mini_bara"):
        return [k for k in S if k.startswith("meniu_contextual.")]
    if rest.startswith("panglica."):
        t = rest[9:]
        if "panglica." + t in S:
            return ["panglica." + t]
        c = CONTEXT_TAB.get(t)
        if t == "TabDrawingToolsFormat":
            c = "Ctx_ShapeFormat"
        if c and "panglica_context." + c in S:
            return ["panglica_context." + c]
        return []
    if rest.startswith("dialog."):
        slug = rest[7:]
        for k, v in bru.items():
            if (k.startswith("dialog.") or k.startswith("panou.")) and "#" not in k:
                if re.sub(r"[^a-z0-9]+", "_", norm(v.get("eticheta"))).strip("_") == slug:
                    return [k]
        return []
    def contine(k, rx):
        c = S.get(k)
        return bool(c) and any(re.search(rx, u["et"]) for g in c["grupuri"] for u in g["u"])
    if rest == "zoom" and contine("bara_stare", r"^zoom"):
        return ["bara_stare"]
    if rest == "vederi" and contine("bara_stare", r"^(read mode|print layout|normal|page layout|slide sorter|reading view)"):
        return ["bara_stare"]
    if rest == "bara_formule" and contine("zona_document", r"^formula bar$"):
        return ["zona_document"]
    if rest == "caseta_nume" and contine("zona_document", r"^name box$"):
        return ["zona_document"]
    if rest == "panou_format" and "panou.LaunchFormatBackground" in S:
        return ["panou.LaunchFormatBackground"]
    return []


# ====================================================================== instanțele de randat (din inventar)
CALE_RE = re.compile(r"^nivele\.(\d+)\.(?:pasi\.(\d+)\.(?:incearca|inca\.(\d+))|(atelier)(?:\.inca\.(\d+))?|(qs|bazin)\.\d+)$")


def instante_pagina(p):
    inst, vazut = [], set()
    for e in p.get("exercitii") or []:
        m = CALE_RE.match(e.get("cale") or "")
        if not m or e.get("aplicatie") not in APLICATII:
            continue
        li = int(m.group(1))
        if m.group(2) is not None:
            nav = {"fel": "pas", "li": li, "si": int(m.group(2)), "ei": 0 if m.group(3) is None else int(m.group(3)) + 1}
        elif m.group(4):
            nav = {"fel": "atelier", "li": li, "ei": 0 if m.group(5) is None else int(m.group(5)) + 1}
        else:
            nav = {"fel": "qs", "li": li}
        k = json.dumps(nav, sort_keys=True)
        if k in vazut:
            continue
        vazut.add(k)
        inst.append({"id": e["id"], "tip": e.get("tip"), "aplicatie": e["aplicatie"], "nav": nav})
    tipuri, apps = set(), set()
    for i in inst:
        i["complet"] = i["tip"] not in tipuri
        i["dialoguri"] = i["aplicatie"] not in apps
        tipuri.add(i["tip"])
        apps.add(i["aplicatie"])
    return inst


# ====================================================================== partea statică (O1)
SIM_APP_RE = [
    (r"lectii/_sim/desktop-windows\.js$", "windows"), (r"lectii/_sim/siguranta-pc\.js$", "windows"),
    (r"lectii/_sim/explorer-[\w-]+\.js$", "explorer"), (r"lectii/_sim/wordobj[\w-]*\.js$", "word"),
    (r"lectii/_sim/wordfisier\.js$", "word"), (r"lectii/_sim/wordteh-[\w-]+\.js$", "word"),
    (r"lectii/_sim/excelx[\w-]*\.js$", "excel"), (r"lectii/_sim/registru-foi\.js$", "excel"),
    (r"jocuri/_motor/tip-excel\.js$", "excel"), (r"jocuri/_motor/tip-foaie\.js$", "excel"),
    (r"jocuri/_motor/panglica-excel\.js$", "excel"), (r"jocuri/_motor/panglica-word\.js$", "word"),
    (r"jocuri/_motor/panglica-powerpoint\.js$", "powerpoint"), (r"lectii/_sim/simppt[\w-]*\.js$", "powerpoint"),
    (r"lectii/_sim/paint[\w-]*\.js$", "paint"), (r"jocuri/_motor/ui-panglica\.js$", "office"),
]
SIMBOL_INLINE_APP = ["TipWordObiecte", "SimPPT", "ExcelPlus", "TipEditor", "TipCorectura", "JocPagina", "JocDiapozitiv",
                     "JocPPT", "JocFormatare", "TIP_EXPLORER", "TIP_ECRAN", "JocPaint", "JocCaseta"]
SCRIPT_RE = re.compile(r"<script\b([^>]*)>(.*?)</script\s*>", re.S | re.I)
SRC_RE = re.compile(r"\bsrc\s*=\s*[\"']([^\"']+)[\"']")
INLINE_DEF_RE = re.compile(r"(?:\b(?:const|let|var|function|class)\s+(%s)\b|\b(%s)\s*=\s*(?:function\b|class\b|\(|\{))"
                           % ("|".join(SIMBOL_INLINE_APP), "|".join(SIMBOL_INLINE_APP)))
PANGLICA_INLINE_RE = re.compile(r"\bUiPanglica\b|\bPANGLICA_(?:WORD|EXCEL|POWERPOINT)\b")
FEREASTRA_INLINE_RE = re.compile(r"role=\\?[\"'](?:tablist|menubar|toolbar)\\?[\"']")
# reparația 8: rădăcina [data-lh-aplicatie] o pune DOAR biblioteca (și o înregistrează în LH.aplicatii.radacini());
# o pagină care scrie singură atributul (în HTML sau în scriptul ei) își desenează interfața și o deghizează. Locul
# rezervat al lecției e data-lh-aplicatie-loc (alt atribut, permis).
RADACINA_IN_PAGINA_RE = re.compile(r"data-lh-aplicatie(?![-\w])|setAttribute\(\s*[\"']data-lh-aplicatie[\"']|"
                                   r"dataset\.lhAplicatie(?![\w])")
BIBLIOTECA_IN_PAGINA_RE = re.compile(r"\b(?:LH\s*\.\s*aplicatii|LHAplicatii)\s*=(?!=)|\.\s*radacini\s*=(?!=)|\bradacini\s*:\s*(?:function|\()")


def pagini_site():
    R = radacina()
    out = []
    for p in sorted((R / "lectii").glob("*/*/index.html")) + sorted((R / "jocuri").glob("*/index.html")):
        out.append(p.relative_to(R).as_posix())
    return out


def analiza_statica(rel_pagina):
    """motivele statice pentru care o pagină desenează interfață de aplicație în afara lui aplicatii/."""
    R = radacina()
    p = R / rel_pagina
    try:
        t = p.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return []
    mot = []
    baza = (R / rel_pagina).parent
    for m in SCRIPT_RE.finditer(t):
        attrs, cod = m.group(1), m.group(2)
        s = SRC_RE.search(attrs)
        if s:
            src = s.group(1).split("?")[0].split("#")[0]
            if re.match(r"^[a-z]+:", src) or src.startswith("//"):
                continue
            try:
                ab = (R / src.lstrip("/")) if src.startswith("/") else (baza / src)
                rel = os.path.relpath(os.path.normpath(str(ab)), str(R)).replace("\\", "/")
            except Exception:
                continue
            if rel.startswith("aplicatii/"):
                continue
            for pat, app in SIM_APP_RE:
                if re.search(pat, rel):
                    mot.append(f"încarcă simulatorul vechi {rel} ({app})")
                    break
        else:
            for d in sorted({x for g in INLINE_DEF_RE.findall(cod) for x in g if x}):
                mot.append(f"își definește simulatorul în pagină: {d}")
            if PANGLICA_INLINE_RE.search(cod):
                mot.append("desenează panglica veche din pagină (UiPanglica / PANGLICA_*)")
            if FEREASTRA_INLINE_RE.search(cod):
                mot.append("își construiește fereastra în pagină (role=tablist/menubar/toolbar în scriptul paginii)")
            if BIBLIOTECA_IN_PAGINA_RE.search(cod):
                mot.append("își definește în pagină biblioteca / registrul rădăcinilor (LH.aplicatii / LHAplicatii / radacini)")
    if RADACINA_IN_PAGINA_RE.search(t):
        mot.append("pune singură o rădăcină [data-lh-aplicatie] (doar biblioteca o pune și o înregistrează în "
                   "LH.aplicatii.radacini(); lecția are doar data-lh-aplicatie-loc)")
    return list(dict.fromkeys(mot))


# ====================================================================== citatele din textul lecțiilor (O7, O8)
KW = [("dialog", r"fereastr(?:a|ă|ei)|caset(?:a|ei) de dialog|dialogul(?:ui)?"),
      ("fila", r"fil(?:a|ei|ele|elor)"),
      ("grup", r"grup(?:ul|ului|urile|urilor)"),
      ("comanda", r"buton(?:ul|ului|ele|elor)|comand(?:a|ă|ii)|bif(?:a|ei)|list(?:a|ei)|meniul(?:ui)?|op[țţt]iun(?:ea|ii)|"
                  r"pictogram(?:a|ei)|iconi[țţ](?:a|ei)|caset(?:a|ei)|glisorul(?:ui)?"),
      ("apasa", r"apas[ăa]|ape[șşs]i|bifeaz[ăa]|bifezi")]
# după „apasă” un nume de TASTĂ nu e o comandă de interfață
TASTE = {"enter", "esc", "escape", "tab", "delete", "del", "backspace", "shift", "ctrl", "alt", "space", "spațiu", "spatiu",
         "insert", "end", "page up", "page down", "caps lock", "windows", "fn"}
KW_RE = [(k, re.compile(r"(?:^|[^\wăâîșțşţ])(?:%s)\s+(?:(?:de|din|pe|numit[ăa]?)\s+)?$" % rx, re.I)) for k, rx in KW]
LITERA_RE = re.compile(r"[A-Za-zĂÂÎȘȚăâîșțŞŢşţ]")
PAREN_DUPA_RE = re.compile(r"^\s*\(([^()<>{}`$]{2,40})\)")
BOLD_RE = re.compile(r"<(b|strong)\b[^>]*>(.*?)</\1\s*>", re.S | re.I)
SEG_RE = re.compile(r"(?:(?<!\.)[.!?;](?=\s)|<br\s*/?>|</(?:p|li|div|td|h\d|ol|ul)\s*>|\n)", re.I)
LANT_RE = re.compile(r"^\s*(?:›|>|→|»|&gt;|&rsaquo;)\s*$")
TAG_RE = re.compile(r"<[^>]+>")


def _imparte_lant(s):
    """„File › Save As” -> [File, Save As]; săgețile din paranteze („crescător (A → Z)”) nu despart."""
    out, cur, ad = [], "", 0
    for ch in s:
        if ch == "(":
            ad += 1
        elif ch == ")":
            ad = max(0, ad - 1)
        if ch in "›→»" and ad == 0:
            out.append(cur)
            cur = ""
        else:
            cur += ch
    out.append(cur)
    return [x.strip() for x in out if x.strip()]


def _text_lectie(t):
    t = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), t)
    t = t.replace("\\\"", "\"").replace("\\'", "'").replace("\\n", "\n").replace("\\/", "/")
    return t


def citate_din_text(t, sursa):
    """→ [{lant:[nume], fel, ctx_fila, ctx_grup, sursa:'fișier:rând', text}]. Un nume = conținutul unui <b>/<strong>;
    se iau doar cele precedate de un cuvânt-cheie (fila / grupul / butonul / bifa / lista / meniul / fereastra …) sau
    legate cu „›” (lanțuri: File › Save As › Browse). Bold-urile fără cuvânt-cheie NU se judecă (pot fi termeni)."""
    t = _text_lectie(t)
    out = []
    poz_linii = [m.start() for m in re.finditer(r"\n", t)]

    def linia(off):
        import bisect
        return bisect.bisect_right(poz_linii, off) + 1
    start = 0
    segs = []
    for m in SEG_RE.finditer(t):
        segs.append((start, m.start()))
        start = m.end()
    segs.append((start, len(t)))
    for a, b in segs:
        seg = t[a:b]
        if "<b" not in seg.lower() and "<strong" not in seg.lower():
            continue
        ctx_fila = ctx_grup = None
        prev_end = 0
        lant = None
        for m in BOLD_RE.finditer(seg):
            inainte = seg[prev_end:m.start()]
            nume = html.unescape(TAG_RE.sub("", m.group(2))).strip()
            prev_end = m.end()
            # cod de șablon (${en}), scurtături, nume fără litere (¶, ✕, 100 %) sau de o literă (B, A→Z) = pictograme /
            # taste, nu nume de comenzi: nu se judecă
            if (not nume or len(nume) > 70 or re.search(r"\$\{|[{}`]", nume) or re.search(r"\b(?:Ctrl|Alt|Shift)\s*\+", nume)
                    or len(LITERA_RE.findall(nume)) < 2):
                lant = None
                continue
            # „grupul <b>Temporizare</b> (Timing)”: perechea engleză scrisă imediat după bold face parte din nume
            if "(" not in nume:
                pd = PAREN_DUPA_RE.match(html.unescape(TAG_RE.sub("", seg[m.end():m.end() + 80])))
                if pd:
                    nume = f"{nume} ({pd.group(1).strip()})"
            parti = [x.strip() for x in _imparte_lant(nume) if len(LITERA_RE.findall(x)) >= 2]
            if not parti:
                lant = None
                continue
            leg = lant is not None and LANT_RE.match(html.unescape(TAG_RE.sub("", inainte)))
            if leg:
                lant["lant"] += parti
                continue
            fel = None
            pre = html.unescape(TAG_RE.sub("", inainte))[-45:]
            for k, rx in KW_RE:
                if rx.search(pre):
                    fel = k
                    break
            if fel == "apasa":
                # „apasă <b>de două ori</b>” = accent, nu nume; „apasă <b>Enter</b>” = tastă
                prima = LITERA_RE.search(parti[0])
                if (norm(parti[0]) in TASTE or re.fullmatch(r"(?i)f\d{1,2}", parti[0].strip())
                        or (prima and prima.group(0).islower())):
                    lant = None
                    continue
                fel = "comanda"
            lant = {"lant": parti, "fel": fel, "ctx_fila": ctx_fila, "ctx_grup": ctx_grup,
                    "sursa": f"{sursa}:{linia(a + m.start())}", "text": TAG_RE.sub("", seg)[:160].strip()}
            out.append(lant)
            if fel == "fila" and len(parti) == 1:
                ctx_fila, ctx_grup = parti[0], None
            elif fel == "grup" and len(parti) == 1:
                ctx_grup = parti[0]
    hub = nume_learninghub()
    return [c for c in out if (c["fel"] or len(c["lant"]) >= 2) and not (
        len(c["lant"]) == 1 and any(v in hub for v in cand_norm([c["lant"][0], re.split(r"\s+[/—–]\s+", c["lant"][0])[0]])))]


def nume_learninghub():
    """etichetele butoanelor LearningHub ÎNSUȘI (Verifică, Sunt alt elev, Continuă de unde ai rămas …), citite din
    jocuri/_motor/motor.js și assets/js/*.js ale sitului măsurat — minus orice etichetă care există și în referințele
    reale (ca un nume de aplicație să nu fie scuzat). „Apasă Verifică” vorbește despre lecție, nu despre aplicație."""
    if "hub" in _CACHE:
        return _CACHE["hub"]
    R = radacina()
    s = set()
    fis = [R / "jocuri" / "_motor" / "motor.js"] + sorted((R / "assets" / "js").glob("*.js"))
    for f in fis:
        try:
            t = f.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue
        for m in re.finditer(r">([^<>{}$`]{2,50})</button>", t):
            s.add(norm(m.group(1)))
        for m in re.finditer(r"\|\|\s*'([^'<>{}$]{2,50})'", t):
            s.add(norm(m.group(1)))
        for m in re.finditer(r"[„\"']([A-ZĂÂÎȘȚ][^„”\"'<>{}$`\n]{2,50})[”\"']", t):
            x = m.group(1)
            s.add(norm(x))
            s.add(norm(re.split(r"\s+[/—–]\s+", x)[0]))
    reale = set()
    for app in OFFICE:
        rb = referinta_bruta(app)
        if not rb:
            continue

        def walk(n):
            et = n.get("eticheta")
            if et:
                reale.add(norm(et))
            for c in n.get("copii") or []:
                walk(c)
        for v in rb["suprafete"].values():
            walk(v)
    _CACHE["hub"] = {x for x in s if x and len(x) >= 3} - reale - {"start", "file", "home", "insert", "view", "ok"}
    return _CACHE["hub"]


def citate_pagina(rel_pagina):
    p = radacina() / rel_pagina
    try:
        t = p.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return []
    return citate_din_text(t, rel_pagina)


def fise_cum_fac():
    R = radacina()
    out = []
    for f in sorted((R / "cum-fac" / "_sursa").glob("fise_*.json")):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        for i, fs in enumerate(d if isinstance(d, list) else []):
            app = (fs.get("aplicatie") or "").lower()
            buc = []
            for k in ("intrebare", "titlu", "rezultat", "atentie"):
                if fs.get(k):
                    buc.append(str(fs[k]))
            buc += [str(x) for x in fs.get("pasi") or []]
            out.append({"fisa": fs.get("id") or f"{f.name}#{i}", "aplicatie": app, "fisier": f.relative_to(R).as_posix(),
                        "text": "\n".join(buc)})
    return out


class IndexUI:
    """Indexul numelor pentru O7: din formele canonice (referința sau randarea bibliotecii)."""

    def __init__(self, canon_map, ref):
        self.file = dict(ref.file) if ref else {}
        self.canon = canon_map
        self.grupuri = {}       # cheia filei -> {norm(grup): set(norm(comenzi))}
        self.cmd_fila = {}      # cheia filei -> set(norm comenzi)
        self.toate = set()
        self.tip = {}           # norm(comandă) -> set(tip)
        self.dialoguri = dict(ref.dialoguri) if ref else {}
        self.deschide = {}      # norm(comanda) -> cheia dialogului (din lansatoarele referinței)
        self.bs_nav = set()
        self.bs_pag = {}
        for k, c in canon_map.items():
            for g in c["grupuri"]:
                for u in g["u"]:
                    for x in [u["et"]] + list(u.get("cand") or [])[:1]:
                        self.toate.add(x)
                        self.tip.setdefault(x, set()).add(u["tip"])
            if e_panglica(k):
                gg = self.grupuri.setdefault(k, {})
                cf = self.cmd_fila.setdefault(k, set())
                for g in c["grupuri"]:
                    s = gg.setdefault(g["g"], set())
                    for u in g["u"]:
                        s.add(u["et"])
                        cf.add(u["et"])
            if k == "backstage.nav":
                self.bs_nav = {u["et"] for g in c["grupuri"] for u in g["u"]}
            elif k.startswith("backstage."):
                self.bs_pag[norm(k[10:])] = {u["et"] for g in c["grupuri"] for u in g["u"]}
        for k in list(self.dialoguri.values()):
            for kk, c in canon_map.items():
                if kk.split("#")[0] == k:
                    for g in c["grupuri"]:
                        for u in g["u"]:
                            self.toate.add(u["et"])
        if ref:
            for l in ref.lansatoare:
                if l.get("eticheta"):
                    self.deschide[norm(l["eticheta"])] = l["cheie"]
        for t in self.file:
            self.toate.add(t)
        # „fila” poate fi și fila unui dialog (Page Setup › Margins / Paper), a unei pagini Backstage sau a foii (Sheet1)
        self.file_alte = {}
        if ref and ref.bruta:
            for k, v in ref.bruta["suprafete"].items():
                for j, t in enumerate(v.get("file_dialog") or []):
                    self.file_alte.setdefault(norm(t), ("dialog", k if j == 0 else f"{k}#{t}"))
        self.foi = False        # aplicația are file de foi (Excel: Sheet1 în zona documentului)
        for k, c in canon_map.items():
            if e_panglica(k) or k == "file_panglicii":
                continue
            for g in c["grupuri"]:
                for u in g["u"]:
                    if u["tip"] == "TabItem":
                        self.file_alte.setdefault(u["et"], ("sup", k))
                        if k == "zona_document":
                            self.foi = True
        # referința: și nodurile ascunse (galeriile derulate, ex. teme) și containerele cu nume EXISTĂ în aplicația reală
        if ref and ref.bruta and canon_map is ref.canon:
            def toate_etichetele(n, out):
                et = (n.get("eticheta") or "").strip()
                if et and not et.startswith("[redactat"):
                    out.add(norm(et))
                for x in n.get("copii") or []:
                    toate_etichetele(x, out)
            for k, v in ref.bruta["suprafete"].items():
                s = set()
                toate_etichetele(v, s)
                self.toate |= s
                if e_panglica(k) and k in canon_map:
                    n = v
                    kids = n.get("copii") or []
                    if n.get("tip") == "Pane" and len(kids) == 1 and kids[0].get("tip") == "Group":
                        n = kids[0]
                    for gnod in n.get("copii") or []:
                        if gnod.get("tip") == "Group":
                            sg = set()
                            toate_etichetele(gnod, sg)
                            sg.discard(norm(gnod.get("eticheta")))
                            self.grupuri.setdefault(k, {}).setdefault(norm(gnod.get("eticheta")), set()).update(sg)
                            self.cmd_fila.setdefault(k, set()).update(sg)

    def unitati_suprafata(self, cheie):
        c = self.canon.get(cheie)
        return {u["et"] for g in c["grupuri"] for u in g["u"]} if c else set()

    def unitati_dialog(self, cheie):
        s = set()
        for kk, c in self.canon.items():
            if kk.split("#")[0] == cheie.split("#")[0]:
                for g in c["grupuri"]:
                    for u in g["u"]:
                        s.add(u["et"])
        return s

    def _gaseste(self, cand, multime):
        for c in cand:
            if c in multime:
                return c
        return None

    def rezolva(self, cit):
        """→ (True, None) sau (False, motiv): fila_inexistenta / grup_inexistent / comanda_inexistenta /
        dialog_inexistent / loc_gresit / neacoperit (lista derulantă sau galeria nu e în referință)."""
        nume = [cand_norm([n]) for n in cit["lant"]]
        fel = cit.get("fel")
        cf = cand_norm([cit["ctx_fila"]]) if cit.get("ctx_fila") else []
        cg = cand_norm([cit["ctx_grup"]]) if cit.get("ctx_grup") else []
        ctx_f = next((self.file[c] for c in cf if c in self.file), None)
        prim = nume[0]
        scop = None
        if "file" in prim or "fișier" in prim:
            scop = ("file",)
        elif fel == "fila" or (len(nume) > 1 and self._gaseste(prim, self.file)):
            c = self._gaseste(prim, self.file)
            if c:
                scop = ("fila", self.file[c])
            else:
                c = self._gaseste(prim, self.file_alte)
                if c:
                    scop = self.file_alte[c]
                elif self.foi and len(nume) <= 2 and re.search(r"(?i)culoare|colorea|\bfoa(?:ie|ia|ii)\b|sheet|tab color|redenume",
                                                               cit.get("text") or ""):
                    return True, None     # numele unei foi (conținut: Octombrie, Luni), nu o filă a panglicii
                else:
                    return False, "fila_inexistenta"
        elif fel == "grup":
            file_cautate = [ctx_f] if ctx_f else list(self.grupuri)
            for f in file_cautate:
                c = self._gaseste(prim, self.grupuri.get(f, {}))
                if c:
                    scop = ("grup", f, c)
                    break
            if not scop:
                if ctx_f and any(self._gaseste(prim, self.grupuri.get(f, {})) for f in self.grupuri):
                    return False, "loc_gresit"
                return False, "grup_inexistent"
        elif fel == "dialog":
            c = self._gaseste(prim, self.dialoguri)
            if not c:
                return False, "dialog_inexistent"
            scop = ("dialog", self.dialoguri[c])
        else:
            if ctx_f or cg:
                # locul spus: grupul numit (în fila numită sau, fără filă, în orice filă care are grupul) / fila numită
                multime = set()
                if cg:
                    for f in ([ctx_f] if ctx_f else list(self.grupuri)):
                        for c in cg:
                            multime |= self.grupuri.get(f, {}).get(c, set())
                if not multime and ctx_f:
                    multime = self.cmd_fila.get(ctx_f, set())
                c = self._gaseste(prim, multime) if multime else self._gaseste(prim, self.toate)
                if c:
                    scop = ("cmd", c)
                elif self._gaseste(prim, self.toate):
                    return False, "loc_gresit"
                else:
                    return False, "comanda_inexistenta"
            else:
                c = self._gaseste(prim, self.toate) or self._gaseste(prim, self.dialoguri)
                if not c:
                    return False, "comanda_inexistenta"
                scop = ("dialog", self.dialoguri[c]) if c in self.dialoguri and c not in self.toate else ("cmd", c)
        for n in nume[1:]:
            scop, motiv = self._pas(scop, n)
            if scop is None:
                return False, motiv
        return True, None

    def _pas(self, scop, n):
        fel = scop[0]
        if fel == "fila":
            f = scop[1]
            c = self._gaseste(n, self.grupuri.get(f, {}))
            if c:
                return ("grup", f, c), None
            c = self._gaseste(n, self.cmd_fila.get(f, set()))
            if c:
                return ("cmd", c), None
        elif fel == "grup":
            c = self._gaseste(n, self.grupuri.get(scop[1], {}).get(scop[2], set()))
            if c:
                return ("cmd", c), None
        elif fel == "file":
            c = self._gaseste(n, self.bs_nav)
            if c:
                return ("bs", c), None
        elif fel == "bs":
            c = self._gaseste(n, self.bs_pag.get(scop[1], set()))
            if c:
                return ("cmd", c), None
        elif fel == "dialog":
            c = self._gaseste(n, self.unitati_dialog(scop[1]))
            if c:
                return ("cmd", c), None
        elif fel == "sup":
            c = self._gaseste(n, self.unitati_suprafata(scop[1]))
            if c:
                return ("cmd", c), None
        elif fel == "cmd":
            d = self.deschide.get(scop[1])
            if d:
                c = self._gaseste(n, self.unitati_dialog(d))
                if c:
                    return ("cmd", c), None
            elif self.tip.get(scop[1], set()) & {"MenuItem", "SplitButton", "ComboBox", "Dropdown"}:
                return None, "neacoperit"
        return None, ("loc_gresit" if self._gaseste(n, self.toate) else "comanda_inexistenta")


# ====================================================================== randarea (Playwright, server local)
JS_EXTRACTOR = ORACOLE / "arbore_randat.js"
JS_INIT = """(() => { let s = 123456789; Math.random = function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
  return (s >>> 0) / 4294967296; };
  /* reparația 12: sendBeacon (trimis la închiderea paginii) a scăpat odată de rută (jocuri/_motor/garda_locala.py):
     oprit înainte de orice script al paginii, ca în oracole/sarcini_lib/joaca.py */
  try { Object.defineProperty(navigator, 'sendBeacon', { value: function () { return false; }, configurable: true, writable: true }); } catch (e) {}
})();"""
# fișiere LOCALE care vorbesc cu serverul viu: cererea lor se abandonează (ca FARA din oracole/sarcini_lib/joaca.py)
FARA_LOCALE = ("/assets/js/prezenta.js", "/assets/js/site-credit.js")


def porneste_server(R):
    from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def end_headers(self):
            self.send_header("Cache-Control", "no-store")
            super().end_headers()

    class S(ThreadingHTTPServer):
        def handle_error(self, request, client_address):
            pass        # conexiuni închise de navigator la schimbarea paginii: nu sunt erori ale măsurării
    srv = S(("127.0.0.1", 0), functools.partial(H, directory=str(R)))
    srv.daemon_threads = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}/"


def blocheaza_externe(ctx):
    """regula 24: tot ce nu e 127.0.0.1/localhost se abandonează; în plus (reparația 12) prezenta.js și site-credit.js,
    deși locale, nu se încarcă deloc (ele ar vorbi cu serverul viu)."""
    from urllib.parse import urlsplit

    def ruta(r):
        u = r.request.url
        if u.startswith(("data:", "blob:", "about:")):
            return r.continue_()
        if re.match(r"^https?://(127\.0\.0\.1|localhost)(:\d+)?/", u):
            if urlsplit(u).path.endswith(FARA_LOCALE):
                return r.abort()
            return r.continue_()
        return r.abort()
    ctx.route("**/*", ruta)


def amprenta_site():
    """sha256 pe fișierele care decid randarea: simulatoarele, jocurile, biblioteca, paginile din inventar, assets/js,
    fișele Cum fac, plus extractorul și acest modul (o schimbare a oracolului invalidează cache-ul)."""
    R = radacina()
    h = hashlib.sha256()
    fis = []
    for sub in ("lectii/_sim", "jocuri", "aplicatii", "assets/js", "cum-fac/_sursa"):
        b = R / sub
        if b.exists():
            for p in b.rglob("*"):
                if p.is_file() and p.suffix.lower() in (".js", ".html", ".json", ".css", ".mjs") and "node_modules" not in p.parts:
                    fis.append(p)
    for pg in inventar()["pagini"]:
        fis.append(R / pg["pagina"])
    for p in sorted(set(fis), key=lambda x: x.as_posix()):
        try:
            h.update(p.relative_to(R).as_posix().encode())
            h.update(p.read_bytes())
        except Exception:
            pass
    for p in (JS_EXTRACTOR, Path(__file__), D / "inventar.json"):
        h.update(p.read_bytes())
    for a in OFFICE:
        q = D / "referinte" / f"uia_{a}.json"
        if q.exists():
            h.update(hashlib.sha256(q.read_bytes()).digest())
    h.update(VERSIUNE.encode())
    h.update(os.environ.get("LH_DOAR_PAGINI", "").encode())
    h.update(os.environ.get("LH_PAGINI", "").encode())
    return h.hexdigest()


def _apasa_fila(pg, js, o, i):
    """apasă fila i și așteaptă (cel mult ~1 s) să devină activă, ca extragerea să nu prindă banda filei vechi."""
    pg.evaluate("o => __LHO.file(o)", o)
    cum = _clic(pg, f'[data-lho-fila="{i}"]')
    for _ in range(14):
        pg.wait_for_timeout(70)
        try:
            pg.evaluate(js)
            tabs = pg.evaluate("o => __LHO.file(o)", o)
        except Exception:
            continue
        if i < len(tabs) and tabs[i].get("activ"):
            break
    return cum


def _pid_viu(pid):
    try:
        pid = int(str(pid).strip())
    except Exception:
        return False
    if os.name == "nt":
        import ctypes
        k = ctypes.windll.kernel32
        h = k.OpenProcess(0x1000, False, pid)        # PROCESS_QUERY_LIMITED_INFORMATION
        if not h:
            return False
        cod = ctypes.c_ulong()
        ok = k.GetExitCodeProcess(h, ctypes.byref(cod))
        k.CloseHandle(h)
        return bool(ok) and cod.value == 259          # STILL_ACTIVE
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


def _clic(pg, sel, buton="left"):
    try:
        pg.click(sel, timeout=1500, button=buton)
        return "mouse"
    except Exception:
        try:
            if buton == "right":
                ok = pg.evaluate("s => { const e = document.querySelector(s); if (!e) return false; const r = e.getBoundingClientRect();"
                                 " e.dispatchEvent(new MouseEvent('contextmenu', {bubbles: true, cancelable: true, button: 2,"
                                 " clientX: r.left + r.width / 2, clientY: r.top + r.height / 2})); return true; }", sel)
            else:
                ok = pg.evaluate("s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }", sel)
            return "js" if ok else None
        except Exception:
            return None


def _canon_inst(app, sup):
    ref = referinte()[app]
    out = {}
    for k, v in sup.items():
        kk = ref.cheie_pentru(k) if ref.canon else (k if not ("?" in k) else None)
        if kk is None:
            kk = k
        try:
            out[kk] = canon(kk, v)
        except Exception:
            continue
    return out


def _randeaza_pagina(pg, base, task, js):
    rez = {"pagina": task["pagina"], "instante": [], "erori": [], "o8": [], "unitati_o8": {}, "reincarcari": 0}
    t0 = time.time()

    def initializeaza():
        """pagina + motorul gata (configurația și lista nivelurilor); sub încărcare mare durează: până la 2 × 30 s."""
        for incercare in range(2):
            pg.goto(base + task["pagina"], wait_until="domcontentloaded", timeout=45000)
            try:
                pg.wait_for_function("() => { try { return !!(window.JocMotor && JocMotor.test && JocMotor.test.config() && "
                                     "document.querySelector('.lvl')); } catch (e) { return false; } }", timeout=30000)
                break
            except Exception:
                if incercare == 1:
                    raise RuntimeError("motorul paginii nu a pornit în 2 × 30 s")
        pg.wait_for_timeout(250)
        pg.evaluate(js)
        pg.evaluate("JocMotor.test.deblocheaza()")
        try:
            pg.mouse.wheel(0, 1)
        except Exception:
            pass
    initializeaza()
    refs = referinte()
    tinte = set(task.get("tinte_o8") or [])

    def mergi(nav):
        try:
            pg.evaluate("n => __LHO.mergi(n)", nav)
        except Exception:
            # o singură reluare, de la pagina reîncărcată (motorul poate rămâne într-o stare din care nu se mai poate naviga)
            rez["reincarcari"] += 1
            initializeaza()
            pg.evaluate("n => __LHO.mergi(n)", nav)
        pg.wait_for_timeout(110)
        pg.evaluate(js)

    def extrage(o):
        return pg.evaluate("o => __LHO.extrage(o)", o)

    o8_facut = set()
    complet_facut, incercari, dialog_facut = set(), {}, set()
    timpi = rez.setdefault("timpi", {})

    def ceas(k, t):
        timpi[k] = round(timpi.get(k, 0) + time.time() - t, 2)
    ceas("incarcare", t0)
    for inst in task["instante"]:
        app = inst["aplicatie"]
        ref = refs[app]
        o = {"app": app, "refTabs": ref.file_brut}
        t1 = time.time()
        try:
            mergi(inst["nav"])
            ex = extrage(o)
        except Exception as e:
            rez["erori"].append(f"{inst['id']}: {str(e).splitlines()[0][:160]}")
            continue
        ceas("exercitii", t1)
        sup = dict(ex["suprafete"])
        # trecerea completă (toate filele, File, dialogurile): pe primul exercițiu al simulatorului care ARE rândul
        # filelor (un exercițiu fără panglică nu o poate arăta); cel mult 3 încercări pe simulator
        are_file = "file_panglicii" in sup or not ref.canon
        complet = inst["tip"] not in complet_facut and incercari.get(inst["tip"], 0) < 3 and (are_file or incercari.get(inst["tip"], 0) == 2)
        incercari[inst["tip"]] = incercari.get(inst["tip"], 0) + 1
        if complet:
            complet_facut.add(inst["tip"])
        ir = {"id": inst["id"], "tip": inst["tip"], "aplicatie": app, "nav": inst["nav"], "complet": complet,
              "mod": ex["mod"], "ui": ex["ui"], "radacini": ex["radacini"], "rect": ex["rect"], "clic_js": 0}
        unit_file = []
        if complet:
            t1 = time.time()
            try:
                tabs = pg.evaluate("o => __LHO.file(o)", o)
                for t in tabs:
                    cum = _apasa_fila(pg, js, o, t["i"])
                    if cum == "js":
                        ir["clic_js"] += 1
                    e2 = extrage(o)
                    for k, v in e2["suprafete"].items():
                        if k.startswith("panglica"):
                            sup.setdefault(k, v)
                    if tinte:
                        unit_file.append((t["i"], t.get("cand") or [], pg.evaluate("o => __LHO.unitati(o)", o)))
            except Exception as e:
                rez["erori"].append(f"{inst['id']} file: {str(e).splitlines()[0][:160]}")
            ceas("file", t1)
            if app not in dialog_facut and ref.canon:
                dialog_facut.add(app)
                t1 = time.time()
                _deschide_restul(pg, js, inst, o, ref, sup, rez, mergi, extrage)
                ceas("dialoguri_backstage_meniuri", t1)
        ir["suprafete"] = _canon_inst(app, sup)
        rez["instante"].append(ir)
        # O8: comenzile citate în pagină, apăsate pe rând, pe primul exercițiu complet al fiecărui simulator
        if complet and tinte and inst["tip"] not in o8_facut:
            o8_facut.add(inst["tip"])
            t1 = time.time()
            try:
                _o8(pg, js, inst, o, tinte, unit_file, rez, mergi)
            except Exception as e:
                rez["erori"].append(f"{inst['id']} o8: {str(e).splitlines()[0][:160]}")
            ceas("o8", t1)
        if time.time() - t0 > 900:
            rez["erori"].append("pagina a depășit 15 minute; restul instanțelor sărite")
            break
    return rez


def _deschide_restul(pg, js, inst, o, ref, sup, rez, mergi, extrage):
    """Backstage, dialoguri (prin lansatorul din referință), meniuri de clic dreapta și file contextuale (convenție),
    plasa LHAplicatii.deschideSuprafata — toate prin gest, cu exercițiul reîncărcat între ele."""
    def tab_cu(eticheta):
        tabs = pg.evaluate("o => __LHO.file(o)", o)
        for t in tabs:
            if norm(eticheta) in cand_norm(t.get("cand") or []):
                return t
        return None
    # Backstage
    try:
        mergi(inst["nav"])
        if pg.evaluate("o => __LHO.fisier(o)", o):
            _clic(pg, '[data-lho-fisier="1"]')
            pg.wait_for_timeout(200)
            pg.evaluate(js)
            e2 = extrage(o)
            for k, v in e2["suprafete"].items():
                if k.startswith("backstage"):
                    sup.setdefault(k, v)
            for b in pg.evaluate("o => __LHO.listaBackstage(o)", o):
                _clic(pg, f'[data-lho-bs="{b["i"]}"]')
                pg.wait_for_timeout(150)
                pg.evaluate(js)
                e3 = extrage(o)
                for k, v in e3["suprafete"].items():
                    if k.startswith("backstage.") and k != "backstage.nav":
                        sup.setdefault(k, v)
                pg.evaluate("o => __LHO.listaBackstage(o)", o)
    except Exception as e:
        rez["erori"].append(f"{inst['id']} backstage: {str(e).splitlines()[0][:120]}")
    # dialogurile, prin controlul cu idMso-ul din deschis_prin
    for l in ref.lansatoare:
        try:
            mergi(inst["nav"])
            if l.get("fila_eticheta"):
                t = tab_cu(l["fila_eticheta"])
                if t and not t.get("activ"):
                    _apasa_fila(pg, js, o, t["i"])
            if not pg.evaluate("o => __LHO.gaseste(o)", dict(o, id=l["id"], raw=l.get("eticheta"))):
                continue
            _clic(pg, '[data-lho-t="1"]')
            pg.wait_for_timeout(220)
            pg.evaluate(js)
            e2 = extrage(dict(o, dialogeGlobale=True))
            for k, v in e2["suprafete"].items():
                if k.startswith("dialog") or k.startswith("panou"):
                    kk = k if k.startswith(("dialog.", "panou.")) else (ref.cheie_pentru(k) or k)
                    sup.setdefault(kk, v)
            # filele dialogului (convenție)
            for fd in pg.evaluate("o => __LHO.fileDialog(o)", dict(o, cheie=l["cheie"])):
                _clic(pg, f'[data-lho-fd="{fd["i"]}"]')
                pg.wait_for_timeout(120)
                pg.evaluate(js)
                e3 = extrage(o)
                for k, v in e3["suprafete"].items():
                    if k.split("#")[0] == l["cheie"]:
                        sup.setdefault(f'{l["cheie"]}#{fd["eticheta"]}' if fd["i"] else k, v)
                pg.evaluate("o => __LHO.fileDialog(o)", dict(o, cheie=l["cheie"]))
        except Exception as e:
            rez["erori"].append(f"{inst['id']} dialog {l['cheie']}: {str(e).splitlines()[0][:120]}")
    # meniurile de clic dreapta și filele contextuale (doar convenția le declară ținta)
    try:
        mergi(inst["nav"])
        tinte = pg.evaluate("o => __LHO.tinte(o)", o)
    except Exception:
        tinte = []
    for tinta in tinte:
        try:
            mergi(inst["nav"])
            if not pg.evaluate("o => __LHO.marcheazaTinta(o)", dict(o, tinta=tinta)):
                continue
            if tinta in ("tabel", "imagine", "forma", "grafic"):
                _clic(pg, '[data-lho-tinta="1"]')
                pg.wait_for_timeout(150)
                pg.evaluate(js)
                for t in pg.evaluate("o => __LHO.file(o)", o):
                    _apasa_fila(pg, js, o, t["i"])
                    for k, v in extrage(o)["suprafete"].items():
                        if k.startswith("panglica_context"):
                            sup.setdefault(k, v)
            else:
                _clic(pg, '[data-lho-tinta="1"]', buton="right")
                pg.wait_for_timeout(150)
                pg.evaluate(js)
                for k, v in extrage(o)["suprafete"].items():
                    if k.startswith("meniu_contextual"):
                        sup.setdefault(k, v)
        except Exception as e:
            rez["erori"].append(f"{inst['id']} tinta {tinta}: {str(e).splitlines()[0][:120]}")
    # plasa: biblioteca își deschide singură suprafețele încă necitite
    try:
        are = pg.evaluate("() => !!(window.LHAplicatii && typeof window.LHAplicatii.deschideSuprafata === 'function')")
    except Exception:
        are = False
    if are:
        for k in ref.canon:
            if k in sup or k.split("#")[0] in sup and "#" in k:
                continue
            try:
                mergi(inst["nav"])
                if pg.evaluate("k => __LHO.deschideSuprafata(k)", k):
                    pg.wait_for_timeout(150)
                    pg.evaluate(js)
                    v = extrage(o)["suprafete"].get(k)
                    if v:
                        sup[k] = v
            except Exception as e:
                rez["erori"].append(f"{inst['id']} deschideSuprafata {k}: {str(e).splitlines()[0][:100]}")


# Reparația 7b (R12, prima frază): o comandă CITATĂ de lecție care, apăsată, dă DOAR mesajul „aici nu e simulată” e
# MOARTĂ. Biblioteca marchează un asemenea mesaj cu atributul data-lh-nesimulat (api_biblioteca.md §3); simulatoarele
# vechi îl scriu ca text — tiparele de mai jos sunt cele găsite în lectii/_sim/*.js și jocuri/_motor/*.js (16-17.11.2026),
# cu locul fiecăruia. Se potrivesc fără deosebire de litere mari/mici, pe textul mesajului apărut după clic (și în JS).
TIPARE_NESIMULAT = [
    # „„X” nu e folosit în lecția asta: în simulator nu face nimic.” — simppt-fisier.js:260 (msgNesim), simppt.js:449,
    # simppt.js:757, simppt.js:490, simppt.js:505, simppt-animatii.js:334, :441, :734, simppt-formatare.js:559, :563,
    # simppt-fisier.js:432
    r"nu e folosit[ăa]? în lec[țţ]ia asta",
    # „Îl vei folosi mai târziu: în simulator nu face nimic.” — simppt.js:497; simppt-animatii.js:449 („nu fac nimic”)
    r"în simulator nu (?:face|fac) nimic",
    # „nu-l folosim” — wordobj.js:953, :964, wordobj-formatare.js:765, wordobj-interfata.js:399, wordobj-pagina.js:669,
    #   wordobj-hartie.js:259, wordteh-stiluri.js:213, excelx.js:444, excelx-sortare.js:308, excelx-grafic.js:462,
    #   tip-excel.js:522, paint-imagine.js:707, :717, paint-text.js:538, paint.js:235;
    # „nu o folosim” — excelx-functii.js:219, excelx-grafic.js:534, wordfisier.js:478, :671, explorer-citire.js:365, :402,
    #   siguranta-pc.js:431, paint.js:303, :556;
    # „nu le folosim” — excelx-grafic.js:426, excelx-sortare.js:279, explorer-operatii.js:587, explorer-organizare.js:972,
    #   paint-culori.js:406; „nu îl folosim” — registru-foi.js:410, :419, :429, simppt-fisier.js:295, simppt-interfata.js:373;
    # „nu folosim” — simppt-interfata.js:372, registru-foi.js:448
    r"nu(?:-l|-i| o| le| îl| il)? folosim",
    # „… nu e în simulator” / „… nu sunt în simulator” — wordobj-formatare.js:698, :712, :783, wordobj-hartie.js:181, :216,
    #   :217, wordobj-pagina.js:443, :462, :506, :522, :563, :600, :625, :637, :693, simppt-formatare.js:204,
    #   simppt-fisier.js:577
    r"nu (?:e|sunt) în simulator",
    # „Pagina asta e și în Word, dar în simulator nu e.” — wordobj-tehnoredactare.js:284
    r"dar în simulator nu e[.!]",
    # „În simulator pagina nu se deschide.” — wordobj-interfata.js:259; „aici nu se deschide” — simppt-interfata.js:240;
    #   „în simulator nu se deschide” — simppt-interfata.js:251; „În simulator lista nu se deschide.” — simppt-animatii.js:451
    r"(?:în simulator|aici)(?: \S+)? nu se deschide",
    # „Le înveți în lecția 3” — simppt-interfata.js:240; „îl înveți la lecția N” — paint.js:235
    r"(?:o|le|îl|il|-l) înve[țţ]i (?:în|la) lec[țţ]ia",
    # „Aici nu ne trebuie.” — simppt.js:470, simppt-animatii.js:423
    r"aici nu ne trebuie",
    # „În lecțiile noastre nu o folosim / nu folosim …” — simppt-interfata.js:193, :251, :372, :373
    r"în lec[țţ]iile noastre nu",
    # mesajul central standard al R12 („În aplicația reală, X …; aici nu e simulată”) — contract.md R12, api_biblioteca.md §3
    r"nu (?:e|este) simulat",
]


def e_mesaj_nesimulat(t):
    return any(re.search(p, t or "", re.I) for p in TIPARE_NESIMULAT)


def _clasifica_o8(s1, s2):
    """→ (efect, motiv, mesaje_noi). Efect = schimbare de STRUCTURĂ (DOM-ul aplicației fără blocurile-mesaj, ferestrele de
    dialog) sau de valori, ori un mesaj nou care NU e „aici nu e simulată”. Doar mesajul „nu e simulată” = moartă (R12)."""
    if s2 == "navigat":
        return True, None, []
    if s2["s"] != s1["s"] or s2["v"] != s1["v"]:
        return True, None, []
    noi = list(s2["m"])
    for x in s1["m"]:
        if x in noi:
            noi.remove(x)
    nesim = list(s2["n"])
    for x in s1["n"]:
        if x in nesim:
            nesim.remove(x)
    if noi:
        if all(x in nesim or e_mesaj_nesimulat(x) for x in noi):
            return False, "doar mesajul „aici nu e simulată”: " + noi[0][:140], noi[:3]
        return True, None, noi[:3]
    if s2["m"] != s1["m"]:
        return True, None, []           # un mesaj a dispărut / s-a schimbat ordinea: se socotește efect, ca înainte
    return False, "nicio schimbare: nici stare, nici mesaj", []


def _o8(pg, js, inst, o, tinte, unit_file, rez, mergi):
    """apasă fiecare comandă citată în pagină (găsită pe ecran) pe starea de pornire a exercițiului și vede dacă se
    schimbă ceva: structura aplicației (DOM fără blocurile-mesaj, dialogurile), valorile câmpurilor sau un mesaj vizibil
    care nu e „aici nu e simulată”. Fără nicio schimbare, sau doar cu mesajul „nu e simulată” = moartă. O comandă GRI se
    notează (gri=True, cu fila pe care stă) și O8 o judecă după referință (reparația 7a)."""
    mergi(inst["nav"])
    gasite = []
    vazute = set()
    tabs = pg.evaluate("o => __LHO.file(o)", o)
    activ = next((t["i"] for t in tabs if t.get("activ")), None)
    activ_cand = next((t.get("cand") or [] for t in tabs if t.get("activ")), [])
    surse = [(None, [], pg.evaluate("o => __LHO.unitati(o)", o))] + list(unit_file)
    for (fi, fcand, us) in surse:
        for u in us:
            cn = cand_norm(u.get("cand") or [])
            hit = next((c for c in cn if c in tinte), None)
            if not hit or hit in vazute:
                continue
            raw = next((c for c in (u.get("cand") or []) if norm(c) == hit or hit in cand_norm([c])), None)
            if raw is None:
                continue
            vazute.add(hit)
            gasite.append({"eticheta": hit, "raw": raw, "fila": None if (fi is None or fi == activ or u.get("tip") == "TabItem") else fi,
                           "fila_cand": activ_cand if (fi is None or fi == activ) else fcand, "cand": u.get("cand") or [],
                           "id": u.get("id"), "nesim": u.get("nesim"), "tip": u.get("tip")})
    rez["unitati_o8"][inst["id"]] = len(gasite)
    o8 = dict(o, tipare=TIPARE_NESIMULAT)
    for g in gasite[:30]:
        r = {"instanta": inst["id"], "tip_sim": inst["tip"], "aplicatie": inst["aplicatie"], "eticheta": g["eticheta"],
             "raw": g["raw"], "fila": g["fila"], "fila_cand": g["fila_cand"][:4], "cand": g["cand"][:6], "id": g["id"],
             "nesim_marcat": g["nesim"], "tip": g["tip"]}
        try:
            mergi(inst["nav"])
            if g["fila"] is not None:
                _apasa_fila(pg, js, o, g["fila"])
            if g["tip"] == "TabItem":
                tt = next((t for t in pg.evaluate("o => __LHO.file(o)", o) if g["raw"] in (t.get("cand") or [])), None)
                if tt and tt.get("activ"):
                    r["efect"] = None
                    r["motiv"] = "fila e deja activă la pornire (nu se judecă)"
                    rez["o8"].append(r)
                    continue
            gs = pg.evaluate("o => __LHO.gaseste(o)", dict(o, raw=g["raw"]))
            if not gs:
                r["efect"] = None
                r["motiv"] = "negăsită după reîncărcare"
                rez["o8"].append(r)
                continue
            if gs.get("tag") == "SELECT":
                r["efect"] = None
                r["motiv"] = "listă derulantă nativă (<select>): clicul doar o deschide (nu se judecă)"
                rez["o8"].append(r)
                continue
            if gs.get("dezactivat"):
                # reparația 7a: gri pe ecran NU mai scutește; O8 o judecă după referință (activă acolo = moartă)
                r["efect"] = None
                r["gri"] = True
                r["motiv"] = "gri pe ecran (dezactivată)"
                rez["o8"].append(r)
                continue
            # starea de pornire trebuie să stea pe loc: două instantanee la rând egale (un mesaj static al motorului
            # poate apărea abia la ~0,3 s după navigare); cel mult ~0,85 s de așteptare, apoi „instabil”
            s1 = pg.evaluate("o => __LHO.stareO8(o)", o8)
            stabil = False
            for _ in range(7):
                pg.wait_for_timeout(120)
                s_nou = pg.evaluate("o => __LHO.stareO8(o)", o8)
                if s_nou == s1:
                    stabil = True
                    break
                s1 = s_nou
            if not stabil:
                r["efect"] = None
                r["motiv"] = "pagina se schimbă singură (instabil)"
                rez["o8"].append(r)
                continue
            cum = _clic(pg, '[data-lho-t="1"]')
            if cum is None:
                r["efect"] = False
                r["motiv"] = "nu se poate apăsa"
                rez["o8"].append(r)
                continue
            s2 = s1
            for asteapta in (150, 200, 350):          # efectul poate veni după o animație: până la ~0,7 s
                pg.wait_for_timeout(asteapta)
                try:
                    pg.evaluate(js)
                    s2 = pg.evaluate("o => __LHO.stareO8(o)", o8)
                except Exception:
                    s2 = "navigat"
                # o schimbare de structură/valori/navigare oprește așteptarea; un mesaj singur nu (efectul poate urma)
                if s2 == "navigat" or s2["s"] != s1["s"] or s2["v"] != s1["v"]:
                    break
            r["efect"], motiv, noi = _clasifica_o8(s1, s2)
            r["clic"] = cum
            r["motiv"] = motiv
            if noi:
                r["mesaje_noi"] = [x[:200] for x in noi]
            if motiv and motiv.startswith("doar mesajul"):
                r["doar_nesimulat"] = True
        except Exception as e:
            r["efect"] = None
            r["motiv"] = "eroare: " + str(e).splitlines()[0][:100]
        rez["o8"].append(r)


def _lucreaza_felie(base, taskuri, js):
    """rulat într-un proces separat: un Chromium pentru o felie de pagini."""
    from playwright.sync_api import sync_playwright
    out = []
    with sync_playwright() as p:
        br = p.chromium.launch()
        try:
            for task in taskuri:
                ctx = br.new_context(viewport=VIEWPORT)
                ctx.add_init_script(JS_INIT)
                blocheaza_externe(ctx)
                pg = ctx.new_page()
                pg.set_default_timeout(8000)
                erori_js = []
                pg.on("pageerror", lambda e: erori_js.append(str(e)[:160]))
                try:
                    rez = _randeaza_pagina(pg, base, task, js)
                except Exception as e:
                    rez = {"pagina": task["pagina"], "instante": [], "erori": [f"pagina: {str(e).splitlines()[0][:200]}"], "o8": [],
                           "unitati_o8": {}}
                rez["erori_js"] = erori_js[:10]
                out.append(rez)
                try:
                    ctx.close()
                except Exception:
                    pass
        finally:
            br.close()
    return out


def pagini_inventar():
    """paginile din inventar; LH_DOAR_PAGINI (doar pentru depanare: subșiruri despărțite prin virgulă) le restrânge —
    intră și în amprenta cache-ului, deci nu amestecă o măsurare parțială cu una întreagă."""
    exact = [x.strip().replace("\\", "/") for x in os.environ.get("LH_PAGINI", "").split(",") if x.strip()]
    f = [x.strip() for x in os.environ.get("LH_DOAR_PAGINI", "").split(",") if x.strip()]
    out = inventar()["pagini"]
    if exact:
        out = [p for p in out if p["pagina"] in exact]
    if f:
        out = [p for p in out if any(x in p["pagina"] for x in f)]
    return out


def taskuri_randare():
    out = []
    for p in pagini_inventar():
        tinte = set()
        for c in citate_pagina(p["pagina"]):
            for n in c["lant"]:
                tinte.update(cand_norm([n]))
        out.append({"pagina": p["pagina"], "instante": instante_pagina(p), "tinte_o8": sorted(tinte)})
    return out


def randare(lucratori=None, forteaza=False):
    """randarea tuturor paginilor din inventar (cu cache). → dict {pagina: rezultat}. forteaza=True sau LH_FARA_CACHE=1:
    nu se folosește o randare veche — doar una terminată după pornirea acestui proces (de pildă a unui oracol pornit în
    paralel, care a ținut lacătul), altfel se randează de la zero."""
    am = amprenta_site()
    cache = dir_cache() / f"randare_{am[:16]}.json"
    proaspat = forteaza or fara_cache()

    def citeste_cache():
        try:
            c = json.loads(cache.read_text(encoding="utf-8"))
        except Exception:
            return None
        if c.get("amprenta") != am:
            return None
        if proaspat and float(c.get("generat_ts") or 0) < T_PORNIRE:
            return None
        return c
    if cache.exists():
        c = citeste_cache()
        if c is not None:
            return c
    # păstrez doar cele mai noi 12 randări (fiecare copie de mutant are amprenta ei)
    try:
        vechi = sorted(dir_cache().glob("randare_*.json"), key=lambda q: q.stat().st_mtime, reverse=True)[12:]
        for q in vechi:
            q.unlink()
    except Exception:
        pass
    lacat = dir_cache() / f"randare_{am[:16]}.lacat"
    t_lacat = time.time()
    while True:
        try:
            fd = os.open(str(lacat), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            os.write(fd, str(os.getpid()).encode())
            os.close(fd)
            break
        except FileExistsError:
            try:
                # lacătul unui proces mort (oprit, expirat) nu blochează: îl scot
                cine = lacat.read_text(encoding="utf-8").strip()
                varsta = time.time() - lacat.stat().st_mtime
                if (cine and not _pid_viu(cine)) or (not cine and varsta > 10) or varsta > 2400:
                    lacat.unlink()
                    continue
            except Exception:
                pass
            if cache.exists():
                c = citeste_cache()
                if c is not None:
                    return c
            if time.time() - t_lacat > 2400:
                raise RuntimeError("randarea ține lacătul de peste 40 de minute")
            time.sleep(3)
    try:
        # cine prinde lacătul DUPĂ ce altul l-a eliberat găsește de obicei randarea gata: n-o reface (altfel oracolele
        # pornite în paralel randează pe rând, fiecare încă o dată)
        if cache.exists():
            c = citeste_cache()
            if c is not None:
                return c
        R = radacina()
        srv, base = porneste_server(R)
        js = JS_EXTRACTOR.read_text(encoding="utf-8")
        taskuri = taskuri_randare()
        n = lucratori or int(os.environ.get("LH_LUCRATORI", "0")) or max(1, min(4, (os.cpu_count() or 4) - 2))
        # felii echilibrate după numărul de instanțe
        taskuri.sort(key=lambda t: -len(t["instante"]))
        felii = [[] for _ in range(max(1, n))]
        greut = [0] * len(felii)
        for t in taskuri:
            k = greut.index(min(greut))
            felii[k].append(t)
            greut[k] += 3 + len(t["instante"])
        t0 = time.time()
        rez = []
        if n <= 1:
            rez = _lucreaza_felie(base, felii[0], js)
        else:
            from concurrent.futures import ProcessPoolExecutor
            with ProcessPoolExecutor(max_workers=len(felii)) as ex:
                for r in ex.map(_lucreaza_felie, [base] * len(felii), felii, [js] * len(felii)):
                    rez += r
        srv.shutdown()
        # căi RELATIVE la rădăcina sitului: adresa serverului local și calea copiei (cu numele contului) nu intră în cache
        rez = relativ(rez, _inlocuiri_cai(R, base))
        c = {"amprenta": am, "generat": time.strftime("%Y-%m-%d %H:%M:%S"), "generat_ts": time.time(),
             "secunde": round(time.time() - t0, 1), "radacina": ".", "radacina_e_worktree": e_radacina_implicita(),
             "fara_cache": proaspat, "pagini": {r["pagina"]: r for r in rez}}
        tmp = cache.with_suffix(".tmp")
        tmp.write_text(json.dumps(c, ensure_ascii=False), encoding="utf-8")
        os.replace(tmp, cache)
        return c
    finally:
        try:
            lacat.unlink()
        except Exception:
            pass


def biblioteca_exista():
    b = radacina() / "aplicatii"
    return b.exists() and any(p.suffix == ".js" for p in b.rglob("*.js"))
