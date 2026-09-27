# -*- coding: utf-8 -*-
"""Planul anului + programa, pentru linia de verificare (verifica_lectie.py).

Sursele (NU profil.json scris de autor):
  - Info_Gimnaziu_2026/data/unitati.json          : lectiile clasei, in ordine (nr, titlu, unitate)
  - Info_Gimnaziu_2026/planificari/Calendar_ore_* : titlul exact si modulul (M1...) al fiecarei ore
  - AI_0/data/informatica_gimnaziu/curriculum.json: continuturile programei, pe domenii
  - jocuri/_motor/unitati_domenii.json            : unitate -> domeniile ei din programa
Legatura lectie -> continuturi: suprapunerea cuvintelor din titlul lectiei cu fiecare continut al domeniilor
unitatii (ponderata cu raritatea cuvantului in domeniu). E o euristica; raportul arata ce a ales.
"""
from __future__ import annotations

import json
import math
import re
from pathlib import Path

UNITATI = Path(r"C:/00/Projects/Info_Gimnaziu_2026/data/unitati.json")
CURRIC = Path(r"C:/00/AI_0/data/informatica_gimnaziu/curriculum.json")
DOMENII = Path(r"C:/00/Projects/LearningHub/jocuri/_motor/unitati_domenii.json")
PLANIF = Path(r"C:/00/Projects/Info_Gimnaziu_2026/planificari")
CALENDAR = {"V": "Calendar_ore_5AM_5M.md", "VI": "Calendar_ore_6A_6M.md",
            "VII": "Calendar_ore_7_MA.md", "VIII": "Calendar_ore_8A_8M.md"}
CLASE = ["V", "VI", "VII", "VIII"]

# cuvinte de legatura si cuvinte „de cap” generice: nu spun despre ce e lectia
CUV_LEGATURA = set("""a al ale ai cu de din in în la pe pentru prin sau si și un o unei unui unor care ce
dupa după despre este sunt sa să se ca că mai din dintr dintr-un dintr-o unul sau fara fără intre între cel
doua două trei acest aceasta această lor lui ei""".split())
GENERICE = {"operatii", "operații", "elemente", "tipuri", "tip", "notiuni", "noțiuni", "instrumente", "structura",
            "structură", "aplicatii", "aplicații", "aplicatie", "aplicație", "specifice", "interfata", "interfață",
            "utilizarea", "utilizare", "elaborarea", "reguli", "etape", "modalitati", "modalități", "normele", "norme",
            "poziția", "pozitia", "momente", "generală", "generala", "rolul", "rol", "exemple", "mod", "organizarea",
            "organizare", "sisteme", "sistem", "evoluția", "evolutia", "principale", "caracteristici", "proprietăți",
            "proprietati", "operații", "etc"}
# cuvinte de zi cu zi: nu le tratam ca termeni de specialitate cand stau singure
COMUNE = {"text", "texte", "date", "data", "dată", "numeric", "numar", "număr", "numere", "pagina", "pagină", "pagini",
          "imagine", "imagini", "fisier", "fișier", "fisiere", "fișiere", "lista", "listă", "liste", "tabel", "tabele",
          "culori", "culoare", "fundal", "titlu", "corp", "paragraf", "suma", "sumă", "maxim", "minim", "decizie",
          "valori", "valoare", "informatii", "informații", "calcul", "tabelar", "program", "programe", "creare",
          "deschidere", "inchidere", "închidere", "accesare", "serii", "serie", "sunet", "video", "mediu", "medii",
          "calculator", "calculatoare", "mouse", "tastatura", "tastatură", "ecran", "desen", "desene", "joc", "jocuri",
          # văzute la proba pe V-VIII (27.09): cuvinte obișnuite care apar în orice lecție
          "răspuns", "raspuns", "verificare", "bază", "baza", "exemplu", "lucru", "produs", "citire", "afișare", "afisare",
          "mesaj", "mesaje", "dosar", "dosare", "document", "documente", "prezentare", "prezentări", "prezentari",
          "comunicare", "efect", "efecte", "forme", "forma", "sunete", "legături", "legaturi", "stil", "stiluri", "comenzi",
          "comandă", "servicii", "drepturi", "măsuri", "masuri", "datelor", "căutarea", "cautarea", "căutare", "salvarea",
          "crearea", "culorilor", "controlul", "etapele", "exersare", "generale", "elementare", "permise", "etică",
          "protecția", "protectia", "siguranța", "siguranta", "construcția", "noțiunea", "notiunea", "clasificarea",
          "unități", "unitati", "reprezentare", "facilități", "publicare", "prelucrare", "compunere", "trimitere",
          "obiecte", "obiect", "imagine", "pagină"}


def pliaza(s: str) -> str:
    s = s.replace("ş", "ș").replace("ţ", "ț").replace("Ş", "Ș").replace("Ţ", "Ț")
    return s.lower().translate(str.maketrans("șțăâî", "staai"))


def virgule_jos(s: str) -> str:
    """Programa are uneori ş/ţ cu sedila; lectiile au ș/ț cu virgula."""
    return s.replace("ş", "ș").replace("ţ", "ț").replace("Ş", "Ș").replace("Ţ", "Ț")


# pentru legarea titlu -> continut: forme neregulate si prefixe care nu deosebesc nimic
LEME = {"foile": "foi", "foilor": "foi", "foaie": "foi", "foaia": "foi", "foi": "foi", "rand": "rand", "randuri": "rand",
        "randurilor": "rand", "randul": "rand"}
PREFIXE_GENERICE = {"aplic", "eleme", "tipur", "notiu", "instr", "utili", "speci", "opera", "gener", "princ"}


def _tokeni(s: str, fara: set[str] | None = None) -> set[str]:
    out = set()
    legatura = {pliaza(x) for x in CUV_LEGATURA}
    for w in re.findall(r"[^\W\d_]+", pliaza(s)):
        if w in LEME:
            out.add(LEME[w])
            continue
        if len(w) < 4 or w in legatura:
            continue
        t = w[:5]
        if t in PREFIXE_GENERICE or t in (fara or set()):
            continue
        out.add(t)
    return out


def incarca():
    un = json.loads(UNITATI.read_text(encoding="utf-8"))["clase"]
    cur = json.loads(CURRIC.read_text(encoding="utf-8"))["clase"]
    dom = json.loads(DOMENII.read_text(encoding="utf-8"))
    return un, cur, dom


def continuturi_domenii(cur: dict, cls: str, domenii: list[str]) -> list[str]:
    want = {pliaza(d) for d in domenii}
    out = []
    for blk in cur.get(cls, {}).get("continuturi", []):
        if pliaza(blk["domeniu"]) in want:
            out += [virgule_jos(c) for c in blk["continuturi"]]
    return out


def calendar(cls: str) -> dict[int, dict]:
    """nr lectie (ordinea din calendar) -> {titlu, modul, data}"""
    p = PLANIF / CALENDAR[cls]
    out = {}
    if not p.exists():
        return out
    k = 0
    for linie in p.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\|\s*(\d{2}\.\d{2}\.\d{4})\s*\|\s*(\d+)\s*\|\s*(M\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$", linie)
        if m:
            k += 1
            out[k] = {"data": m.group(1), "modul": m.group(3), "titlu": m.group(4).strip(), "tip": m.group(5).strip()}
    return out


def lectiile_clasei(un: dict, cur: dict, dom: dict, cls: str) -> list[dict]:
    """Toate lectiile clasei, in ordine, cu unitatea si continuturile programei legate de titlu."""
    cal = calendar(cls)
    out = []
    for u in un.get(cls, {}).get("unitati", []):
        domenii = dom.get(cls, {}).get(u["id"], [])
        conts = continuturi_domenii(cur, cls, domenii)
        N = len(conts)
        df0 = {}
        for c in conts:
            for t in _tokeni(c):
                df0[t] = df0.get(t, 0) + 1
        # cuvintele din numele domeniului care apar in peste jumatate din continuturi („calcul tabelar”) nu deosebesc nimic
        dom_tok = {t for d in domenii for t in _tokeni(d) if df0.get(t, 0) > N / 2}
        df = {t: n for t, n in df0.items() if t not in dom_tok}   # raritatea cuvintelor in domeniu
        titluri, scoruri = {}, {}
        for l in u["lectii"]:
            titlu = (cal.get(l["nr"]) or {}).get("titlu") or l["titlu"]
            titluri[l["nr"]] = titlu
            tt = _tokeni(titlu, dom_tok)
            scor = []
            for c in conts:
                comun = tt & _tokeni(c, dom_tok)
                s = sum(math.log((N + 1) / (df[t] + 0.5)) for t in comun)
                scor.append((s, c))
            scoruri[l["nr"]] = scor
        # calibrare 27.09: un conținut merge la lecția (lecțiile) unității unde scorul LUI e cel mai mare, nu la toate
        # lecțiile unde trece pragul (VII-4 „Obiecte într-un document” primea „Operații de formatare a unui document”,
        # care e lecția 6-7). Iar dacă cuvântul-cap al conținutului („formatare”) e în titlul unei lecții („Formatarea…”),
        # conținutul merge acolo. Pragul vechi pe lecție (≥ 0,8 și ≥ jumătate din cel mai bun scor al lecției) rămâne.
        atribuit = {nr: [] for nr in scoruri}
        for j, c in enumerate(conts):
            vals = {nr: sc[j][0] for nr, sc in scoruri.items()}
            best_c = max(vals.values(), default=0)
            if best_c <= 0:
                continue
            cap = cuvant_cap(c, dom_tok)
            cu_cap = [nr for nr in vals if cap and cap in _tokeni(titluri[nr], dom_tok)]
            tinta = cu_cap or [nr for nr, s in vals.items() if s >= best_c - 1e-9]
            for nr in tinta:
                best_l = max((s for s, _ in scoruri[nr]), default=0)
                if vals[nr] > 0 and vals[nr] >= max(0.8, 0.5 * best_l):
                    atribuit[nr].append(c)
        for l in u["lectii"]:
            out.append({"nr": l["nr"], "titlu": titluri[l["nr"]], "titlu_unitati": l["titlu"], "tip": l.get("tip", ""),
                        "unitate": u["id"], "unitate_titlu": u["titlu"], "cs": u.get("cs", []),
                        "modul": (cal.get(l["nr"]) or {}).get("modul"), "data": (cal.get(l["nr"]) or {}).get("data"),
                        "domenii": domenii, "continuturi": atribuit[l["nr"]]})
    return out


def cuvant_cap(c: str, fara: set[str] | None = None) -> str | None:
    """Primul cuvânt de conținut al unui conținut din programă, după capetele generice („Operații de formatare a
    unui document” -> „forma”), ca token (primele 5 litere, pliat). None dacă nu deosebește nimic."""
    c = re.sub(r"\([^)]*\)", " ", virgule_jos(c)).partition(":")[0]
    for w in c.split():
        wl = w.lower().strip(".,:;")
        if wl in CUV_LEGATURA or pliaza(wl) in {pliaza(g) for g in GENERICE}:
            continue
        tok = _tokeni(wl, fara)
        return next(iter(tok)) if tok else None
    return None


# ---------------------------------------------------------------- materialele cursului (definițiile pe lecții)
MATERIALE = Path(r"C:/00/Projects/Info_Gimnaziu_2026/materiale/continut")


def definitii_materiale(cls: str) -> dict[int, list[str]]:
    """Termenii din blocurile `definitii` ale materialelor cursului (Info_Gimnaziu_2026/materiale/continut/
    clasa_<cls>_M*.json), pe numărul lecției din plan: {6: ["aliniere", "indentare", "spațiere între rânduri", …]}.
    Articolul hotărât se scoate („Alinierea” -> „aliniere”), la fel paranteza („bitul (b)” -> „bit”).
    Calibrare 27.09: fără sursa asta, T0 nu știa că „aliniere”/„indentare” sunt vocabularul lecției 6 a clasei a VII-a."""
    out: dict[int, list[str]] = {}
    for f in sorted(MATERIALE.glob(f"clasa_{cls}_M*.json")):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        for l in d.get("lectii") or []:
            for s in l.get("sectiuni") or []:
                for b in s.get("blocuri") or []:
                    if b.get("tip") != "definitii":
                        continue
                    for it in b.get("items") or []:
                        brut = re.sub(r"<[^>]+>", "", str(it[0] if isinstance(it, list) and it else it))
                        brut = re.sub(r"\([^)]*\)", " ", virgule_jos(brut))
                        for t in re.split(r"/", brut):
                            t = _fara_articol(re.sub(r"\s+", " ", t).strip(" .:-"))
                            if t and re.search(r"[^\W\d_]{3,}", t) and not re.search(r"\bctrl\b|\+", t, re.I):
                                lst = out.setdefault(int(l.get("nr") or 0), [])
                                if t.lower() not in [x.lower() for x in lst]:
                                    lst.append(t)
    return out


def _fara_articol(t: str) -> str:
    """Primul cuvânt fără articolul hotărât: „Alinierea” -> „aliniere”, „Rândul” -> „rând”, „byte-ul” -> „byte”."""
    cuv = t.split()
    if not cuv:
        return t
    w = cuv[0]
    lw = w.lower()
    for suf, inloc in (("-ul", ""), ("ea", "e"), ("ul", ""), ("ua", "ă"), ("ile", "i"), ("le", "")):
        if lw.endswith(suf) and len(lw) - len(suf) >= 3:
            w = w[: len(w) - len(suf)] + inloc
            break
    cuv[0] = w[0].lower() + w[1:] if not w[:2].isupper() else w
    return " ".join(cuv)


def toate_continuturile_clasei(cur: dict, cls: str) -> list[str]:
    return [virgule_jos(c) for blk in cur.get(cls, {}).get("continuturi", []) for c in blk["continuturi"]]


# ---------------------------------------------------------------- termeni din continuturi
def _desparte(lista: str) -> list[str]:
    parti = re.split(r",|/|\bși\b|\bsi\b|\bsau\b|;", lista)
    return [p.strip(" .:-") for p in parti if p.strip(" .:-")]


def termeni_din_paranteze(c: str) -> set[str]:
    """Doar enumerările din paranteze („(aliniere conținut, borduri, …)”): acolo programa numește termeni tehnici."""
    c = virgule_jos(c)
    return {x.strip() for m in re.finditer(r"\(([^)]*)\)", c) for x in _desparte(m.group(1))}


def termeni_din_continut(c: str) -> list[str]:
    """„Operații de editare (selectare, copiere, mutare, ștergere)” -> editare, selectare, copiere, mutare, ștergere."""
    c = re.sub(r"^\s*[-–•]\s*", "", virgule_jos(c)).replace(" etc.", "").replace(" etc", "")
    termeni = []
    for m in re.finditer(r"\(([^)]*)\)", c):          # lista din paranteza
        termeni += _desparte(m.group(1))
    fara_par = re.sub(r"\([^)]*\)", " ", c)
    cap, _, dupa = fara_par.partition(":")
    if dupa.strip():                                 # lista de dupa doua puncte
        termeni += _desparte(dupa)
    m = re.search(r"\bpentru\b(.*)$", cap)
    if m and "," in m.group(1):                      # „... pentru sumă, maxim, minim, medie aritmetică și decizie”
        termeni += _desparte(m.group(1))
        cap = cap[: m.start()]
    cuv = cap.split()
    if 1 <= len(cuv) <= 4:
        termeni.append(cap.strip())
    for w in cuv:                                    # primul cuvant de continut dupa capetele generice
        wl = w.lower().strip(".,:;")
        if wl in CUV_LEGATURA or wl in GENERICE or pliaza(wl) in {pliaza(g) for g in GENERICE}:
            continue
        if len(wl) >= 4 and re.fullmatch(r"[^\W\d_]+(-[^\W\d_]+)?", wl):
            termeni.append(wl)
        break
    out = []
    for t in termeni:
        t = re.sub(r"\s+", " ", t).strip()
        if not re.search(r"[^\W\d_]{3,}", t) or "," in t:
            continue
        if t.split()[0].lower() in CUV_LEGATURA:      # „de intrare”, „de manevră”: doar o bucată de listă
            continue
        cuvinte = t.split()
        if len(cuvinte) > 4:
            continue
        if len(cuvinte) == 1 and (pliaza(t) in {pliaza(x) for x in COMUNE} or pliaza(t) in {pliaza(g) for g in GENERICE}):
            continue
        if cuvinte[0].lower() in {pliaza(g) for g in GENERICE} | GENERICE:
            continue
        if t.lower() not in [o.lower() for o in out]:
            out.append(t[0].lower() + t[1:] if not t[:2].isupper() else t)
    return out
