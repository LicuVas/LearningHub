#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
prereq_jocuri.py — harta prerechizitelor pentru jocurile de învățare (plimbarea novicelui, 26.09.2026).

Întrebarea profesorului: la fiecare pas, „ce se presupune să știi până în acel moment și unde cauți
dacă nu știi — în ce lecții”. Jocurile sunt date (JocMotor.test.config()), nu pagini, așa că le
citim ca poarta (Playwright, file://) și le punem în ORDINEA PROGRAMEI (catalog.js: clasa → unitatea → jocul).

Ce se socotește „predat” (introdus): un termen **îngroșat** (<b>/<strong>) sau un <code>/<kbd> dintr-un
text de PAS (text, exemplu, altfel), din `intro`/`cum` sau din `text`-ul unui nivel vechi. Locul primei
introduceri = ADRESA (jocul, nivelul, fraza care îl explică).

Verificări (se numără, ultima linie = numărul):
  E  exercițiu (incearca / inca / atelier) care cere un <code>/<kbd> încă nepredat până în acel punct
     al jocului (poarta face asta doar pentru întrebările de verificare `qs`);
  O  ordine: un termen folosit într-un joc e introdus ÎNTÂI într-un joc de MAI TÂRZIU din programă
     (și nici jocul curent nu-l introduce înainte) — elevul n-are unde să-l fi învățat.

Harta (jocuri/_motor/prerechizite.json): pentru fiecare joc și nivel, termenii introduși în jocurile de
DINAINTE pe care nivelul îi folosește fără să-i reintroducă — cu fraza-amintire și adresa. Motorul o
arată elevului ca blocul restrâns „Ce trebuie să știi” la începutul nivelului.

  python _tests/prereq_jocuri.py [--scrie] [--doar slug1,slug2] [--detalii]
"""
from __future__ import annotations

import argparse
import html as htmlmod
import json
import re
import sys
from pathlib import Path

RAD = Path(__file__).resolve().parents[1]
JOCURI = RAD / "jocuri"
HARTA = JOCURI / "_motor" / "prerechizite.json"

sys.path.insert(0, r"C:/00/AI_0/tools/plimbare/oracol")
from oracol_novice import _regex_termen, _regex_definitie, _forme_termen  # noqa: E402  (aceleași forme românești ca la plimbare)

RE_BOLD = re.compile(r"<(b|strong)\b[^>]*>(.*?)</\1\s*>", re.I | re.S)
# și <pre>: formulele și codul lucrat stau adesea în blocuri <pre> (găsit de bucla 26.09: IF predat în <pre>, raportat nepredat)
RE_COD = re.compile(r"<(code|kbd|pre)\b[^>]*>(.*?)</\1\s*>", re.I | re.S)
RE_TAG = re.compile(r"<[^>]+>")
# îngroșări care NU sunt termeni (accent, instrucțiuni, etichete de pas)
NU_TERMEN = re.compile(r"^(nu|da|atenție|atentie|important|sfat|exemplu|corect|greșit|gresit|pasul?\s*\d*|"
                       r"regula|reține|retine|de ce|cum|unde|când|cand|o singură|toate?|fiecare|mereu|niciodată|"
                       r"înainte|inainte|după|dupa|după punct|apoi|primul|prima|al doilea|a doua|diferit|la fel|"
                       r"în ordine|in ordine|minge|\d+.*)$", re.I)
MAX_PE_NIVEL = 6


def plain(s: str) -> str:
    return re.sub(r"\s+", " ", htmlmod.unescape(RE_TAG.sub(" ", s or ""))).strip()


def norm(s: str) -> str:
    return plain(s).lower()


def e_termen(t: str) -> bool:
    t = t.strip(" .,:;!?„”\"'()")
    if t.isupper():
        return 2 <= len(t) <= 6          # sigle scurte (RAM, CPU, HTML) sunt termeni; restul = strigat
    return 3 <= len(t) <= 40 and len(t.split()) <= 4 and not NU_TERMEN.match(t)


def fraza(text_plain: str, termen: str) -> str:
    """propoziția care conține termenul — amintirea arătată elevului"""
    # cuvânt întreg, întâi cu literele exacte: „NU” nu se găsește în „Operatori, … zona …” (bucla 26.09, T1)
    m = (re.search(rf"(?<!\w){re.escape(termen)}(?!\w)", text_plain)
         or re.search(rf"(?<!\w){re.escape(termen)}(?!\w)", text_plain, re.I))
    i = m.start() if m else text_plain.lower().find(termen.lower())
    if i < 0:
        return ""
    a = max(text_plain.rfind(".", 0, i), text_plain.rfind("!", 0, i), text_plain.rfind("?", 0, i)) + 1
    b = min([j for j in (text_plain.find(".", i), text_plain.find("!", i), text_plain.find("?", i)) if j != -1] or [len(text_plain)])
    f = text_plain[a:b + 1].strip()
    f = re.sub(r"\s+([,.;:!?)])", r"\1", re.sub(r"\(\s+", "(", f))   # spațiile lăsate de etichetele scoase
    return f if len(f) <= 220 else f[:217].rsplit(" ", 1)[0] + "…"


CUVINTE_CHEIE = {  # pseudocod (manual) + C++ din gimnaziu; restul cuvintelor din cod sunt nume sau texte
    "citește", "citeste", "scrie", "dacă", "daca", "atunci", "altfel", "pentru", "execută", "executa", "cât", "timp",
    "repetă", "repeta", "până", "când", "și", "sau", "not", "div", "mod",
    "cout", "cin", "endl", "int", "float", "double", "char", "bool", "string", "if", "else", "for", "while", "do",
    "return", "include", "iostream", "using", "namespace", "std", "main", "void", "break", "true", "false", "long", "const"}
OPERATORI = ["<<", ">>", "←", "==", "!=", "<=", ">=", "&&", "||", "++", "+=", "%"]


def constructe(eticheta: str, cod: str) -> set[str]:
    """bucățile de limbaj dintr-un <code>/<kbd>: taste (întregi), etichete HTML, funcții de foaie, cuvinte-cheie, operatori"""
    c = cod.strip()
    if not c:
        return set()
    if eticheta.lower() == "kbd":
        return {c.lower()} if len(c) > 1 else set()
    fara_texte = re.sub(r"\"[^\"]*\"|'[^']*'", " ", c)
    out = {f"<{m.lower()}>" for m in re.findall(r"</?([a-zA-Z][a-zA-Z0-9]*)", fara_texte)}
    out |= {f"{m.upper()}(" for m in re.findall(r"(?<![\w.])([A-Z][A-Z0-9.]{1,})\s*\(", fara_texte)}
    fara_etichete = re.sub(r"</?[a-zA-Z][^>]*>", " ", fara_texte)
    out |= {w.lower() for w in re.findall(r"[A-Za-zăâîșțĂÂÎȘȚ_]{2,}", fara_etichete) if w.lower() in CUVINTE_CHEIE}
    out |= {o for o in OPERATORI if o in fara_etichete}
    return out


def def_stricta(t: str) -> re.Pattern:
    """definiție în cuvinte: „X este/sunt/înseamnă/reprezintă/se numește…”, „numim/se numește X”, „ce este X”.
    Fără „X:” / „X —” / „X =”: la jocuri, două puncte după un cuvânt îngroșat e aproape mereu o etichetă."""
    T = rf"(?:{_regex_termen(t, None).pattern})"
    return re.compile(   # definiția începe propoziția: „Antetul e zona de sus…” (nu „…pași făcuți în ordine e…”)
        rf"(?:^|[.!?:;]\s+|\(\s*)(?:un|o|niște)?\s*{T}\s*(?:\([^)]*\)\s*)?(?:este|e|sunt|înseamnă|inseamna|reprezintă|reprezinta|se nume[șs]te|se numesc)\s"
        rf"|(?:numim|se nume[șs]te|se numesc|se cheamă|îi spunem|ii spunem)\s+(?:o|un|niște)?\s*{T}"
        rf"|ce (?:este|e|înseamnă)\s+(?:o|un)?\s*{T}", re.I | re.U)


# --- SENSUL termenului (bucla 26.09, T1): același cuvânt poate însemna altceva în alt joc -----------------
# „SAU” (operatorul logic) ≠ conjuncția „sau”; „închidere” (butonul ✕ al ferestrei) ≠ eticheta </html>;
# „adresă” de e-mail ≠ adresa unei pagini; „Cursorul” de text ≠ indicatorul mouse-ului; „Variabile” (categoria
# din Scratch) ≠ variabilele C++. Două filtre, amândouă mecanice:
#   1. LITERE MARI: un termen scris cu majuscule (SAU, ȘI) sau cu majusculă în mijlocul propoziției în fraza care
#      îl definește (numele unui buton/unei categorii: „categoria Variabile”) se caută cu literele lui exacte;
#   2. SENS: în jurul folosirii (±FEREASTRA_SENS caractere) trebuie să apară măcar MIN_SEMNE cuvinte din
#      fraza-amintire (tulpini de 5 litere, fără diacritice, fără cuvintele de legătură și fără ceilalți termeni
#      definiți în aceeași frază — „parolă” nu confirmă sensul lui „adresă”). Altfel e un omonim: nu intră în hartă.
#      Măsurat 26.09 pe cele 30 de intrări: cu UN singur cuvânt comun treceau omonimele („bara” lângă </html>,
#      „clic” lângă indicatorul mouse-ului, „se numește” lângă scena de film); cu DOUĂ cad toate cele 9 greșite.
FEREASTRA_SENS = 200
MIN_SEMNE = 2
_FARA_DIACRITICE = str.maketrans("ăâîșşțţĂÂÎȘŞȚŢ", "aaisstt" + "AAISSTT")
CUVINTE_LEGATURA = {  # tulpini (5 litere, fără diacritice) care nu spun nimic despre sens
    "acest", "aceea", "acolo", "adica", "alege", "altul", "atunc", "avand", "cand", "care", "catre", "ceea", "cele",
    "celui", "cineva", "ceva", "cum", "dacă", "daca", "decat", "despr", "dintr", "doar", "doua", "dupa", "este",
    "fiecar", "fieca", "foart", "inain", "intai", "intre", "intr", "mereu", "multe", "nevoi", "numai", "pentr",
    "poate", "prima", "primu", "sunt", "toate", "totul", "trei", "unde", "unei", "unui", "vreau", "vrei", "asta",
    "aici", "apoi", "cand", "mult", "fara", "sau", "unul", "una", "lui", "lor", "ei", "tau", "tale", "tine",
    "numes", "face", "faci", "fac", "exemp", "folos"}


def _tulpini(text: str, fara: str = "") -> set[str]:
    fara_t = {w[:5] for w in re.findall(r"\w{4,}", fara.translate(_FARA_DIACRITICE).lower())}
    out = set()
    for w in re.findall(r"[^\W\d_]{4,}", text.translate(_FARA_DIACRITICE).lower()):
        t = w[:5]
        if t not in CUVINTE_LEGATURA and t not in fara_t:
            out.add(t)
    return out


def _e_nume_propriu(fraza_def: str, termen: str) -> bool:
    """SAU / ȘI (majuscule) sau „categoria Variabile” (majusculă în mijlocul propoziției) = se caută exact"""
    t = termen.strip()
    if t.isupper() and len(t) >= 2:
        return True
    if not t[:1].isupper():
        return False
    i = fraza_def.find(t)
    if i <= 0:
        return False
    inainte = fraza_def[:i].rstrip(" „\"'(")
    return bool(inainte) and inainte[-1] not in ".!?"


def regex_sens(termen: str, fraza_def: str) -> re.Pattern:
    """ca _regex_termen, dar cu literele exacte pentru nume proprii / majuscule"""
    if not _e_nume_propriu(fraza_def, termen):
        return _regex_termen(termen, None)
    alt = []
    for f in _forme_termen(termen, None):
        if f.endswith(r"\w{0,3}"):   # tulpina automată e scrisă mic — îi punem la loc majuscula
            f = (termen[0] + f[1:]) if termen[:1].isupper() and f[:1].lower() == termen[:1].lower() else f
            alt.append(f)
        else:
            alt.append(re.escape(f))
    return re.compile(rf"(?<!\w)(?:{'|'.join(alt)})(?!\w)", re.U)


def in_sensul(rx: re.Pattern, semne: set[str], text: str, termen: str = "") -> bool:
    """termenul apare în text ȘI măcar o dată lângă cuvinte din fraza-amintire (același sens). Un nume propriu
    scris CU MAJUSCULE (regex fără re.I: „SAU”, „ȘI”) e deja potrivit pe literele exacte: îi ajunge UN cuvânt comun.
    Un nume cu majusculă inițială („Variabile”, „Scenă”) nu: la început de propoziție orice cuvânt are majusculă
    („Scena 1: intrarea” din filmare ≠ coloana Scenă din animație) — cere tot MIN_SEMNE."""
    prag = 1 if not (rx.flags & re.I) and termen.isupper() else MIN_SEMNE
    for m in rx.finditer(text):
        vecin = text[max(0, m.start() - FEREASTRA_SENS): m.end() + FEREASTRA_SENS]
        if not semne or len(_tulpini(vecin) & semne) >= min(prag, len(semne)):
            return True
    return False


def predat_contine(predat: str, c: str) -> bool:
    if c.startswith("<") and c.endswith(">"):
        return c[:-1] in predat                     # „<h1” acoperă și „<h1 class=…>”
    if c[0].isalpha() and c.isalnum():
        return re.search(rf"(?<!\w){re.escape(c)}(?!\w)", predat) is not None
    return c in predat


FAMILII = {  # domeniul din programă (unitati_domenii.json) → familia în care un termen e „același lucru”
    "Norme de ergonomie": "baza", "Tipuri de sisteme de calcul": "baza", "Elemente de arhitectură": "baza",
    "Tipuri de dispozitive": "baza", "Sisteme de operare": "baza",
    "Algoritmi": "program", "Limbaj de programare": "program",
    "Internet": "web", "Pagini web": "web",
    "Editor de texte": "birou", "Prezentări": "birou", "Calcul tabelar": "birou", "Aplicații colaborative": "birou",
    "Editoare grafice": "media", "Aplicații de prelucrare audio-video": "media", "Animaţii grafice": "media"}
_DOMENII = json.loads((JOCURI / "_motor" / "unitati_domenii.json").read_text(encoding="utf-8"))


def familie(unitate: str) -> str:
    clasa = unitate.split("-")[0]
    for dom in (_DOMENII.get(clasa) or {}).get(unitate, []):
        for cheie, fam in FAMILII.items():
            if dom.startswith(cheie):
                return fam
    return "altele"


def ordinea() -> list[dict]:
    brut = (JOCURI / "catalog.js").read_text(encoding="utf-8")
    cat = json.loads(brut[brut.index("{"): brut.rindex("}") + 1])
    out = []
    for cl in cat["clase"]:
        for u in cl["unitati"]:
            for j in u["jocuri"]:
                if j.get("mod") == "invatare" and j.get("motor") and (JOCURI / j["slug"] / "index.html").exists():
                    out.append({"slug": j["slug"], "titlu": j["titlu"], "clasa": cl["clasa"], "unitate": u["id"],
                                "familie": familie(u["id"])})
    return out


def configuri(jocuri: list[dict]) -> dict[str, dict]:
    from playwright.sync_api import sync_playwright
    out = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        for j in jocuri:
            pg.goto((JOCURI / j["slug"] / "index.html").as_uri(), timeout=30000)
            pg.wait_for_timeout(200)
            out[j["slug"]] = pg.evaluate(
                "JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
        b.close()
    return out


def text_exercitiu(e: dict) -> str:
    parti = [e.get("q", ""), e.get("intro", ""), e.get("titlu", "")]
    for k in ("o", "items", "src", "cats"):
        v = e.get(k)
        if isinstance(v, list):
            parti += [x if isinstance(x, str) else json.dumps(x, ensure_ascii=False) for x in v]
    for pr in e.get("pairs") or []:
        parti += [str(x) for x in (pr if isinstance(pr, list) else [pr])]
    return " ".join(p for p in parti if isinstance(p, str))


def segmente(cfg: dict):
    """(nivel, fel, eticheta, html) în ordinea în care le întâlnește elevul; fel = 'predat' | 'exercitiu' | 'verificare'"""
    yield 0, "predat", "intro", (cfg.get("intro") or "") + " " + (cfg.get("cum") or "")
    for li, lv in enumerate(cfg.get("nivele") or [], 1):
        if lv.get("bazin"):
            continue
        if lv.get("text"):
            yield li, "predat", f"N{li} text", lv["text"]
        for si, pas in enumerate(lv.get("pasi") or [], 1):
            yield li, "predat", f"N{li}P{si}", " ".join(pas.get(k, "") or "" for k in ("text", "exemplu", "altfel"))
            for ei, e in enumerate([pas.get("incearca")] + list(pas.get("inca") or []), 1):
                if e:
                    yield li, "exercitiu", f"N{li}P{si}E{ei}", text_exercitiu(e)
        if lv.get("atelier"):
            for ei, e in enumerate([lv["atelier"]] + list(lv["atelier"].get("inca") or []), 1):
                yield li, "exercitiu", f"N{li}A{ei}", text_exercitiu(e)
        for qi, q in enumerate(lv.get("qs") or [], 1):
            yield li, "verificare", f"N{li}Î{qi}", text_exercitiu(q)


def main(argv=None) -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--scrie", action="store_true", help=f"scrie harta în {HARTA.relative_to(RAD)}")
    ap.add_argument("--doar", help="doar aceste jocuri (virgulă) — harta tot se calculează pe toate")
    ap.add_argument("--detalii", action="store_true")
    ap.add_argument("--config-json", help="(test) configurile dintr-un fișier în loc de browser")
    a = ap.parse_args(argv)

    jocuri = ordinea()
    cfgs = json.loads(Path(a.config_json).read_text(encoding="utf-8")) if a.config_json else configuri(jocuri)
    jocuri = [j for j in jocuri if j["slug"] in cfgs]
    titlu_nivel = {j["slug"]: {li: (lv.get("t") or f"Nivelul {li}") for li, lv in enumerate(cfgs[j["slug"]].get("nivele") or [], 1)}
                   for j in jocuri}

    # 1. prima introducere, în ordinea programei:
    #    - NOȚIUNE = termen îngroșat URMAT DE DEFINIȚIE („X este…”, „numim X”, „X: …”) — îngroșarea de accent nu contează;
    #    - CONSTRUCȚIE = bucată de limbaj dintr-un <code>/<kbd> predat (cuvânt-cheie, etichetă HTML, funcție, operator, tastă)
    intro: dict[str, dict] = {}
    for gi, j in enumerate(jocuri):
        for li, fel, et, h in segmente(cfgs[j["slug"]]):
            if fel != "predat":
                continue
            pl = plain(h)
            for m in RE_BOLD.finditer(h):
                t = plain(m.group(2)).strip(" .,:;!?„”\"'()")
                k = t.lower()
                if t and k not in intro and e_termen(t) and def_stricta(t).search(pl):
                    intro[k] = {"termen": t, "slug": j["slug"], "gi": gi, "nivel": li, "loc": et,
                                "fraza": fraza(pl, t), "cod": False}
            for m in RE_COD.finditer(h):
                for c in constructe(m.group(1), plain(m.group(2))):
                    if c not in intro:
                        intro[c] = {"termen": c, "slug": j["slug"], "gi": gi, "nivel": li, "loc": et,
                                    "fraza": fraza(pl, c) or f"(exemplul din „{titlu_nivel[j['slug']].get(li, 'introducere')}”)",
                                    "cod": True}

    rx_cache = {k: (_regex_termen(v["termen"], None) if not v["cod"] else None) for k, v in intro.items()}
    # potrivirea pe SENS (T1, 26.09): literele exacte pentru nume proprii/majuscule + vecinătate cu fraza-amintire
    rx_sens = {k: (regex_sens(v["termen"], v["fraza"]) if not v["cod"] else None) for k, v in intro.items()}
    semne_sens = {k: (_tulpini(v["fraza"], fara=v["termen"] + " " + " ".join(
                      w["termen"] for w in intro.values() if not w["cod"] and w["termen"].lower() in v["fraza"].lower()))
                      if not v["cod"] else set()) for k, v in intro.items()}
    probleme = []
    harta: dict[str, dict] = {}
    doar = set(a.doar.split(",")) if a.doar else None

    for gi, j in enumerate(jocuri):
        slug, cfg = j["slug"], cfgs[j["slug"]]
        predat = ""                       # cumulat în joc, ca la poartă
        introdus_aici: set[str] = set()
        deja: set[str] = set()
        h_joc: dict[str, list] = {}
        for li, fel, et, h in segmente(cfg):
            pl = plain(h)
            folosite_cod = {c for m in RE_COD.finditer(h) for c in constructe(m.group(1), plain(m.group(2)))}
            if fel == "predat":
                predat += " " + pl.lower()
                for m in RE_BOLD.finditer(h):
                    introdus_aici.add(plain(m.group(2)).strip(" .,:;!?„”\"'()").lower())
                introdus_aici |= folosite_cod
            # E: exercițiu care cere o construcție încă nepredată în joc
            if fel == "exercitiu":
                for c in sorted(folosite_cod - introdus_aici):
                    if not predat_contine(predat, c):
                        unde = intro.get(c)
                        de_unde = (f" (se predă în {unde['slug']} N{unde['nivel']})" if unde and unde["slug"] != slug and unde["gi"] < gi
                                   else " (nu se predă în niciun joc de dinainte)" if not unde or unde["gi"] > gi else "")
                        probleme.append({"tip": "E", "slug": slug, "loc": et,
                                         "detaliu": f"exercițiul cere „{c}”, nepredat până aici în joc{de_unde}"})
                        introdus_aici.add(c)   # o dată pe joc, nu la fiecare exercițiu
            # prerechizite din jocurile de DINAINTE + ordinea
            for k, inf in intro.items():
                if k in introdus_aici or k in deja or inf["slug"] == slug:
                    continue
                if not (k in folosite_cod if inf["cod"] else in_sensul(rx_sens[k], semne_sens[k], pl, inf["termen"])):
                    continue
                deja.add(k)
                if inf["gi"] < gi:
                    sursa_fam = jocuri[inf["gi"]]["familie"]
                    if sursa_fam not in ("baza", j["familie"]):
                        continue   # omonim din alt domeniu („Direcția” din Scratch nu e prerechizit pentru Excel)
                    lista_niv = h_joc.setdefault(str(li), []) if li > 0 else []
                    if li > 0 and not any(e["termen"].lower() != k and rx_cache.get(e["termen"].lower()) is not None
                                          and rx_cache[e["termen"].lower()].search(inf["termen"]) for e in lista_niv):
                        lista_niv.append({
                            "termen": inf["termen"], "amintire": inf["fraza"], "joc": inf["slug"],
                            "joc_titlu": next(x["titlu"] for x in jocuri if x["slug"] == inf["slug"]),
                            "nivel": inf["nivel"], "nivel_titlu": titlu_nivel[inf["slug"]].get(inf["nivel"], "")})
                else:
                    probleme.append({"tip": "O" if inf["cod"] else "o", "slug": slug, "loc": et,
                                     "detaliu": f"„{inf['termen']}” e folosit aici, dar se introduce abia în "
                                                f"{inf['slug']} (clasa a {jocuri[inf['gi']]['clasa']}-a) N{inf['nivel']}"})
        for li in list(h_joc):
            h_joc[li] = h_joc[li][:MAX_PE_NIVEL]
        h_joc = {li: v for li, v in h_joc.items() if v}
        harta[slug] = h_joc

    # se NUMĂRĂ doar ce se măsoară precis (construcții de limbaj: E, O); noțiunile în cuvinte (o) sunt
    # semnal pentru critici/profesor — potrivirea pe cuvinte românești nu e destul de sigură ca să țină bucla
    # harta de pe disc (pe care o vede elevul) trebuie să fie cea calculată acum; altfel un joc reparat lasă în
    # pagină prerechizite vechi. Se repară cu --scrie.
    if not a.scrie:
        try:
            pe_disc = json.loads(HARTA.read_text(encoding="utf-8")).get("jocuri")
            js_ok = HARTA.with_suffix(".js").exists() and json.dumps(harta, ensure_ascii=False) in \
                HARTA.with_suffix(".js").read_text(encoding="utf-8")
        except (OSError, ValueError):
            pe_disc, js_ok = None, False
        if pe_disc != harta or not js_ok:
            probleme.append({"tip": "H", "slug": "_motor", "loc": "prerechizite.json/.js",
                             "detaliu": "harta de pe disc e veche față de jocuri — rulează _tests/prereq_jocuri.py --scrie"})
    semnal = [p for p in probleme if p["tip"] == "o" and (not doar or p["slug"] in doar)]
    arata = [p for p in probleme if p["tip"] != "o" and (not doar or p["slug"] in doar)]
    print(f"Jocuri de învățare: {len(jocuri)} · termeni introduși: {len(intro)} "
          f"(îngroșați: {sum(1 for v in intro.values() if not v['cod'])}, cod: {sum(1 for v in intro.values() if v['cod'])})")
    n_harta = sum(len(v) for h in harta.values() for v in h.values())
    print(f"Harta: {n_harta} prerechizite din jocurile de dinainte, pe {sum(len(h) for h in harta.values())} niveluri")
    for tip, nume in (("E", "Exerciții cu cod/taste nepredate până acolo"),
                      ("O", "Cod/taste folosite înainte de jocul care le introduce"),
                      ("H", "Harta de pe disc nepotrivită cu jocurile"),
                      ("o", "(semnal, nenumărat) Noțiuni folosite înainte de jocul care le definește")):
        lista = [p for p in arata + semnal if p["tip"] == tip]
        print(f"== {nume}: {len(lista)} ==")
        for p in lista if a.detalii or len(lista) <= 40 else lista[:40]:
            print(f"  - {p['slug']} {p['loc']}: {p['detaliu']}")
        if not a.detalii and len(lista) > 40:
            print(f"  … încă {len(lista) - 40} (--detalii)")
    if a.scrie:
        HARTA.write_text(json.dumps({"_despre": "GENERAT de _tests/prereq_jocuri.py --scrie; nu edita de mână. "
                                                 "Pentru fiecare joc și nivel: ce presupune din jocurile de dinainte și unde se învață.",
                                     "jocuri": harta}, ensure_ascii=False, indent=1), encoding="utf-8")
        # varianta pentru motor: un <script> merge și din file:// (poarta), unde fetch() pe JSON nu merge
        HARTA.with_suffix(".js").write_text(
            "/* GENERAT de _tests/prereq_jocuri.py --scrie - nu edita de mână. Blocul „Ce trebuie să știi” din motor. */\n"
            "window.JOCURI_PREREQ = " + json.dumps(harta, ensure_ascii=False) + ";\n", encoding="utf-8")
        print(f"(scris {HARTA.relative_to(RAD)} + .js)")
    print("----")
    print(len(arata))
    return 0 if not arata else 1


if __name__ == "__main__":
    sys.exit(main())
