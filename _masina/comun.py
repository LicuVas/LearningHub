"""Piesele comune ale mașinii de verificat, nivelul 3 (agentul „dumb”).

Folosit de dosar_dumb.py (construiește dosarul) și de valideaza_pas.py (pune verdictul).
Configurația lecției se scoate cu parserul existent al jocurilor: pagina se deschide în Chromium
(Playwright) și se citește JocMotor.test.config() - exact apelul din jocuri/_motor/test_joc.py
(linia cu `JocMotor.test.config()`), împachetat ca funcție în jocuri/_motor/ilustratii.py::config.
"""
import hashlib
import html as htmlmod
import json
import random
import re
import secrets
import sys
from pathlib import Path

MASINA = Path(__file__).resolve().parent
LH = MASINA.parent
MOTOR = LH / "jocuri" / "_motor"
SECRET = MASINA / "_secret"
CACHE = MASINA / "_cache"
MENIURI = LH / "_campaign" / "revizuire_completa_2026_09" / "calibrare" / "meniuri_ro_en.json"
CUNOSTINTE = MASINA / "cunostinte_actiuni.json"
BUCATA = 12        # testul de scurgere: bucăți de 12 caractere
FEREASTRA = 40     # obiectul acțiunii: în citat sau la cel mult 40 de caractere de el

# ce fel de bloc poate fi sursă, pe tipul de sursă declarat de agent
TIPURI_LECTIE = {"obiectiv", "nevoie", "pas", "exemplu", "altfel", "enunt", "variante", "indiciu", "provocare"}
TIPURI_CAIET = {"caiet"}
TIPURI_NEPRIMITE = {"ecran", "sarcina", "antet"}

ACTIUNI = ["selectez", "tastez", "apas_tasta", "clic_buton", "clic_dreapta", "dublu_clic", "trag",
           "copiez", "lipesc", "aleg_varianta", "potrivesc", "ordonez", "sortez", "deschid", "salvez", "observ"]
SURSE = ["lectia_curenta", "lectia_anterioara", "imagine", "nicaieri"]

CELULA = r"[A-Z]{1,3}[1-9]\d{0,4}"


# ---------------------------------------------------------------- configurația lecției
def incarca_config(pagina):
    """Configurația JocMotor a paginii (sau un .json deja extras). Păstrată în _cache după amprentă."""
    p = Path(pagina).resolve()
    if p.suffix.lower() == ".json":
        return json.loads(p.read_text(encoding="utf-8"))
    h = hashlib.sha256(p.read_bytes() + (MOTOR / "motor.js").read_bytes()).hexdigest()[:20]
    cf = CACHE / f"cfg_{h}.json"
    if cf.exists():
        return json.loads(cf.read_text(encoding="utf-8"))
    if str(MOTOR) not in sys.path:
        sys.path.insert(0, str(MOTOR))
    from ilustratii import config as _config  # parserul existent: JocMotor.test.config() în Chromium
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        try:
            pg = b.new_page()
            cfg = _config(pg, p)
        finally:
            b.close()
    CACHE.mkdir(parents=True, exist_ok=True)
    cf.write_text(json.dumps(cfg, ensure_ascii=False), encoding="utf-8")
    return cfg


def amprenta(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()[:16]


# ---------------------------------------------------------------- HTML → text, așa cum îl vede elevul
def _attr(tag, a):
    m = re.search(rf'\b{a}\s*=\s*"([^"]*)"', tag) or re.search(rf"\b{a}\s*=\s*'([^']*)'", tag)
    return m.group(1) if m else None


def html_text(s, imagini=None, loc=""):
    """Textul vizibil. <img> devine „[imaginea In]” (descrierea ei merge în lista `imagini`)."""
    if s is None:
        return ""
    if not isinstance(s, str):
        s = str(s)

    def img(m):
        tag = m.group(0)
        alt = htmlmod.unescape(_attr(tag, "alt") or "")
        if imagini is None:
            return " "
        iid = f"I{len(imagini) + 1}"
        imagini.append({"id": iid, "loc": loc, "src": _attr(tag, "src") or "", "alt": alt})
        return f" [imaginea {iid}] "

    def ol(m):
        n = [0]

        def li(_):
            n[0] += 1
            return f"\n{n[0]}. "
        return "\n" + re.sub(r"<li\b[^>]*>", li, m.group(1), flags=re.I) + "\n"

    s = re.sub(r"<img\b[^>]*>", img, s, flags=re.I)
    s = re.sub(r"<(t[dh])\b([^>]*)>\s*</\1>", r"<\1\2>·</\1>", s, flags=re.I)  # celulă goală: rămâne pe loc
    s = re.sub(r"</span>", "</span> ", s, flags=re.I)  # bara fx: „C4 fx 9”, nu „C4fx9”
    s = re.sub(r"<figcaption[^>]*>", "\nLegenda imaginii: ", s, flags=re.I)
    s = re.sub(r"<ol\b[^>]*>(.*?)</ol>", ol, s, flags=re.I | re.S)
    s = re.sub(r"<li\b[^>]*>", "\n- ", s, flags=re.I)
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</(p|li|tr|h[1-6]|div|ul|figure|figcaption|pre|table|thead|tbody|section|summary|details)>", "\n", s, flags=re.I)
    s = re.sub(r"<(p|div|pre|table|h[1-6])\b[^>]*>", "\n", s, flags=re.I)
    s = re.sub(r"</t[dh]>", " | ", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = htmlmod.unescape(s)
    out = []
    for line in s.split("\n"):
        line = re.sub(r"[ \t  ]+", " ", line).strip()
        line = re.sub(r"\s*\|$", "", line).strip()
        if line:
            out.append(line)
    return "\n".join(out)


def ns(s):
    """Doar spațiile."""
    return re.sub(r"\s+", " ", s or "").strip()


# Decizia dirijorului (27.09.2026): ghilimelele („…” "…" “…” «…»), apostrofurile (’ ') și liniuțele (– — -) se
# normalizează la fel în citat și în dosar, înainte de comparare - nu e o schimbare de sens. Înlocuire caracter cu caracter.
_SEMNE = str.maketrans({ch: '"' for ch in "„“”‟«»″〝〞＂"} | {ch: "'" for ch in "’‘‚‛`´′"} |
                       {ch: "-" for ch in "–—‒―−‐‑"})


def nc(s):
    """Normalizarea la compararea citatelor: spațiile + ghilimele/apostrofuri/liniuțe."""
    return ns(str(s or "").translate(_SEMNE))


# ---------------------------------------------------------------- grila („ecranul”)
def litera(i):
    s, i = "", i + 1
    while i:
        i, r = divmod(i - 1, 26)
        s = chr(65 + r) + s
    return s


def coloana(lit):
    n = 0
    for ch in lit:
        n = n * 26 + ord(ch) - 64
    return n - 1


def val_celula(v, mod="ro"):
    if isinstance(v, bool):
        return "TRUE" if v else "FALSE"
    if isinstance(v, (int, float)):
        s = str(int(v)) if float(v).is_integer() else repr(round(float(v), 10))
        return s.replace(".", ",") if mod == "ro" else s
    return html_text(str(v)).replace("\n", " ")


def grila(cells, cols=None, rows=None, mod="ro"):
    cells = cells or {}
    mc = mr = 0
    for a in cells:
        m = re.fullmatch(r"([A-Z]{1,3})(\d+)", a)
        if m:
            mc, mr = max(mc, coloana(m.group(1)) + 1), max(mr, int(m.group(2)))
    cols, rows = max(int(cols or 0), mc), max(int(rows or 0), mr)
    if not cols or not rows:
        return ""
    linii = ["   | " + " | ".join(litera(c) for c in range(cols))]
    for r in range(1, rows + 1):
        linii.append(f"{r:>2} | " + " | ".join(val_celula(cells.get(f"{litera(c)}{r}", ""), mod) for c in range(cols)))
    return "\n".join(linii)


# ---------------------------------------------------------------- jetoane de conținut
STOP = set("""acea acest aceasta această acum adica adică aici apoi asta atunci care catre către cand când cele celor
cum decat decât dacă daca doar după dupa este fără fara fiecare foarte iar intre între lângă lange mai mult multe
nici niciun nimic pentru prin sunt spre toate tot totul unde unei unor unui ține tine vreau vezi""".split())


def jetoane(s):
    """cuvinte cu conținut (≥4 litere), numere, adrese, formule - pentru potrivirea obiect ↔ citat"""
    out = set()
    for m in re.finditer(rf"=[^\s;]+|{CELULA}(?::{CELULA})?|\d+(?:,\d+)?|[^\W\d_]{{4,}}", s or ""):
        t = m.group(0)
        if re.fullmatch(r"[^\W\d_]+", t):
            t = t.casefold()
            if t in STOP:
                continue
        out.add(t)
    return out


def numere(s):
    return set(re.findall(r"(?<![\w$])\d+(?:,\d+)?(?![\w])", s or ""))


# ---------------------------------------------------------------- secretul (ce NU vede agentul)
def samanta():
    SECRET.mkdir(parents=True, exist_ok=True)
    f = SECRET / "samanta.txt"
    if not f.exists():
        f.write_text(secrets.token_hex(16), encoding="utf-8")
    return f.read_text(encoding="utf-8").strip()


def rng_secret(dosar_id, sare=""):
    return random.Random(hashlib.sha256((samanta() + "|" + dosar_id + "|" + sare).encode()).hexdigest())


def cale_secret(dosar_id):
    return SECRET / f"{dosar_id}.json"


# ---------------------------------------------------------------- măștile (NU ȘTIE + meniurile din cealaltă limbă)
_DIACR = {"a": "[aăâ]", "i": "[iî]", "s": "[sșş]", "t": "[tțţ]",
          "A": "[AĂÂ]", "I": "[IÎ]", "S": "[SȘŞ]", "T": "[TȚŢ]"}


def miez_regex(termen, fara_diacritice=False):
    parti = []
    for p in re.split(r"\s+", termen.strip()):
        if fara_diacritice:
            base = p.translate(str.maketrans("ăâîșşțţĂÂÎȘŞȚŢ", "aaisstt" + "AAISSTT"))
            parti.append("".join(_DIACR.get(ch, re.escape(ch)) for ch in base))
        else:
            parti.append(re.escape(p))
    return r"\s+".join(parti)


def _exact(termen, meniu):
    return meniu or termen.isupper() or len(termen) < 4


def miez_termen(termen, meniu=False, fara_diacritice=False):
    """expresia termenului. Cuvintele românești își schimbă finalul (adresă/adresa/adresele): la un ultim
    cuvânt terminat în ă/a/e se ia TULPINA (fără ultima literă), iar sufixul îl adaugă regex_termen."""
    if _exact(termen, meniu):
        return miez_regex(termen, fara_diacritice)
    parti = termen.split()
    if len(parti[-1]) >= 4 and parti[-1][-1] in "ăaeĂAE":
        parti[-1] = parti[-1][:-1]
    return miez_regex(" ".join(parti), fara_diacritice)


def regex_termen(termen, meniu=False, fara_diacritice=False):
    miez = miez_termen(termen, meniu, fara_diacritice)
    if _exact(termen, meniu):
        return re.compile(rf"(?<!\w)({miez})()(?!\w)")
    return re.compile(rf"(?<!\w)({miez})(\w{{0,4}})(?!\w)", re.I)


def pseudo(rng, folosite, text_tot):
    C, V = "bdfglmnprstvz", "aeiou"
    while True:
        w = "".join(rng.choice(C) + rng.choice(V) for _ in range(rng.choice([2, 3]))) + rng.choice("lnrs")
        if w not in folosite and w not in text_tot.casefold():
            folosite.add(w)
            return w


def potriveste_forma(w, original):
    if len(original) > 1 and original.isupper():
        return w.upper()
    if original[:1].isupper():
        return w.capitalize()
    return w


def explicat_in(miez, blocuri):
    """indicele primului bloc (în ordinea de citire) în care lecția EXPLICĂ termenul; None = niciodată.
    miez = expresia termenului (miez_regex). Euristic: <mark>/<dfn>, „T este/înseamnă/(...)/:”, „se numește T”."""
    fl = re.I
    pat = [
        re.compile(rf"<(mark|dfn)>\s*{miez}\w{{0,3}}\s*</\1>", fl),
        re.compile(rf"(?<!\w){miez}\w{{0,3}}\s*(\([^)]{{2,60}}\)\s*)?(este|e|înseamnă|reprezintă|se numește|adică|=|—|–|:)\s", fl),
        re.compile(rf"(?<!\w)(se numește|se numesc|numim|se cheamă|îi spunem|îi zicem|este|e|sunt)\s+(o\s+|un\s+|niște\s+)?[„\"]?{miez}", fl),
    ]
    for i, b in enumerate(blocuri):
        if b.get("tip") in TIPURI_NEPRIMITE:
            continue
        html_, txt = b.get("html") or "", b.get("text") or ""
        if pat[0].search(html_) or pat[1].search(txt) or pat[2].search(txt):
            return i
    return None


def termeni_meniu(limba, aplicatii=None):
    """numele din cealaltă limbă, de mascat: profil RO → numele EN (care diferă de RO); profil EN → numele RO"""
    if limba not in ("RO", "EN") or not MENIURI.exists():
        return []
    out = []
    for e in json.loads(MENIURI.read_text(encoding="utf-8")).get("intrari", []):
        if e.get("stare") == "NEGASIT" or (aplicatii and e.get("aplicatie") not in set(aplicatii) | {"office"}):
            continue
        en = re.sub(r"\s*\(.*?\)", "", str(e.get("en", ""))).strip()
        ro = e.get("ro")
        ro_l = [re.sub(r"\s*\(.*?\)", "", str(x)).strip() for x in (ro if isinstance(ro, list) else [ro])]
        if limba == "RO" and en and en not in ro_l:
            out.append((en, False))
        if limba == "EN":
            out += [(r, True) for r in ro_l if r and r != en]
    return out


# ---------------------------------------------------------------- profilul (două forme: a mașinii și a autorului lecției)
def texte_stie(profil):
    """ce ȘTIE elevul, ca șiruri: {"termen": …} (forma mașinii), {"ce": …} (forma autorului) sau text simplu"""
    return [x if isinstance(x, str) else (x.get("termen") or x.get("ce") or "") for x in profil.get("stie") or []]


def stie_cuvant(profil_texte, cuvant):
    """cuvântul (cu litere) apare ca atare într-una din propozițiile ȘTIE? (simbolurile singure nu contează)"""
    if len(re.findall(r"[^\W\d_]", cuvant)) < 3:
        return False
    rx = re.compile(rf"(?<!\w){re.escape(cuvant)}(?!\w)", re.I)
    return any(rx.search(t) for t in profil_texte)


def _cap_termen(s):
    s = re.split(r"\s+[—–-]\s+|\(", str(s))[0].strip(" ,;:.")
    if not s or re.search(r"[,;=/→]", s) or len(s.split()) > 3:
        return None
    return s


def termeni_profil(profil):
    """[(termen, explicat_la_de_rezervă)] de mascat. Forma autorului e text liber, deci citirea e PRUDENTĂ: se ia doar
    un termen scurt (≤3 cuvinte, fără virgule/„=”/„/”), capul dinaintea parantezei sau a liniei de pauză. Un termen care
    apare într-o propoziție din ȘTIE nu se maschează. `explicat_la_de_rezervă` vine din `invatat_in_lectie.unde`
    (P1 = „La ce folosește” la autor = P0 aici) și se folosește DOAR dacă scriptul nu găsește singur explicația."""
    stie = texte_stie(profil)
    decalaj = 1 if re.search(r"P1\s*=\s*„?La ce folosește", str(profil.get("numerotare", ""))) else 0
    out, vazut = [], set()
    for t in profil.get("nu_stie") or []:
        if isinstance(t, dict):
            out.append((t["termen"], t.get("explicat_la")))
        else:
            c = _cap_termen(t)
            if c:
                out.append((c, None))
    for t in profil.get("invatat_in_lectie") or []:
        c = _cap_termen(re.split(r"[,;]", str(t.get("termen", "")))[0]) if isinstance(t, dict) else None
        if not c:
            continue
        m = re.search(r"P(\d+)", str(t.get("unde", "")))
        loc = None
        if m:
            loc = f"P{int(m.group(1)) - decalaj}" + (".EX" if "Uite cum" in t["unde"] and "text" not in t["unde"] else "")
        out.append((c, loc))
    rez = []
    for c, loc in out:
        if c.casefold() in vazut or stie_cuvant(stie, c):
            continue
        vazut.add(c.casefold())
        rez.append((c, loc))
    return rez


# ---------------------------------------------------------------- rolurile celulelor („foaia ținută de script”)
RESET = re.compile(r"foaie nouă|foaie goală|foaie curată|registru nou|registru gol|document nou|exemplu nou|"
                   r"alt exemplu|alt tabel|tabel nou|de la capăt|alte celule", re.I)
_V_SCRIE = r"scrie|scrii|tastează|tastezi|introdu|introduci|pune|pui|completează|completezi"
_V_APARE = r"apare|apar|se afișează|afișează|arată|se vede|vei vedea|devine|obții"
_CONT = r"[„\"«]?(?P<x>[^„”\"».;\n]+?)[”\"»]?"
R_ROL = [
    ("scrie", re.compile(rf"(?:[îÎ]n|[iI]n)\s+(?:celula\s+)?(?P<c>{CELULA})\b[^.;\n]{{0,20}}?\b(?:{_V_SCRIE})\s+(?:doar\s+|acum\s+)?"
                         rf"(?:numărul\s+|textul\s+|cuvântul\s+|formula\s+)?{_CONT}(?=\s+(?:și|apoi|iar)\b|\s*[.;\n]|,\s|$)")),
    ("scrie", re.compile(rf"(?:{_V_SCRIE})\s+(?:doar\s+)?(?:numărul\s+|textul\s+|cuvântul\s+|formula\s+)?"
                         rf"(?:[„\"«](?P<x>[^„”\"»]+)[”\"»]|(?P<x2>\S+))\s+(?:[îÎ]n|[iI]n)\s+(?:celula\s+)?(?P<c>{CELULA})\b")),
    ("notatie", re.compile(rf"(?<![\w$=:*/+\-])(?P<c>{CELULA})\s*=\s*(?P<x>[^=,;\n][^,;\n]*?)(?=[,;\n]|\.\s|\.$|$)")),
    ("apare", re.compile(rf"(?:[îÎ]n|[iI]n)\s+(?:celula\s+)?(?P<c>{CELULA})\s+(?:{_V_APARE})\s+(?:rezultatul\s+|valoarea\s+|numărul\s+)?"
                         rf"{_CONT}(?=\s*[.;,\n]|\s+(?:și|iar)\b|$)")),
]


def clasa_continut(x, verb):
    x = x.strip().strip("„”\"«»").strip()
    if x.startswith("="):
        return "formula", x
    if re.fullmatch(r"-?\d+(?:[.,]\d+)?\s*%?", x) or x.startswith("#"):
        return ("rezultat" if verb == "apare" else "numar"), x
    return "eticheta", x.casefold()


def compatibil(a, b):
    ca, cb = a["clasa"], b["clasa"]
    if ca == "eticheta" or cb == "eticheta":
        return ca == cb and a["continut"] == b["continut"]
    if {ca, cb} == {"numar", "formula"}:
        return False
    return True


def roluri_din_text(text, bloc):
    """[(offset, celula, rol)] + offseturile resetărilor, dintr-un text simplu"""
    evenimente = []
    for verb, rx in R_ROL:
        for m in rx.finditer(text):
            x = m.groupdict().get("x") or m.groupdict().get("x2") or ""
            if not x.strip():
                continue
            cl, cont = clasa_continut(x, verb)
            evenimente.append((m.start(), m.group("c"), {"clasa": cl, "continut": cont, "bloc": bloc, "fraza": ns(m.group(0))[:80]}))
    for m in RESET.finditer(text):
        evenimente.append((m.start(), None, None))
    evenimente.sort(key=lambda e: e[0])
    return evenimente


def roluri_din_grila_html(html_, bloc):
    """rolurile din grilele desenate în exemple (<div class="gw">: bara fx + tabelul .gr)"""
    ev = []
    for g in re.finditer(r'<div class="gw">(.*?)</table>', html_ or "", re.S):
        corp = g.group(1)
        fx = re.search(r'<div class="fxb"><span>([A-Z]{1,3}\d+)</span><span>fx</span><span>(.*?)</span>', corp, re.S)
        formule = {}
        if fx and html_text(fx.group(2)).startswith("="):
            formule[fx.group(1)] = html_text(fx.group(2))
        litere = [html_text(x) for x in re.findall(r"<th[^>]*>(.*?)</th>", (re.search(r"<thead>(.*?)</thead>", corp, re.S) or [None, ""])[1], re.S)]
        for tr in re.findall(r"<tr>(.*?)</tr>", (re.search(r"<tbody>(.*?)</tbody>", corp, re.S) or [None, ""])[1], re.S):
            nr = re.search(r"<th[^>]*>(.*?)</th>", tr, re.S)
            tds = re.findall(r"<td[^>]*>(.*?)</td>", tr, re.S)
            if not nr:
                continue
            for j, td in enumerate(tds):
                if j + 1 >= len(litere):
                    break
                adr = f"{litere[j + 1]}{html_text(nr.group(1))}"
                v = html_text(td)
                if not v or not re.fullmatch(CELULA, adr):
                    continue
                if adr in formule:
                    ev.append((0, adr, {"clasa": "formula", "continut": formule[adr], "bloc": bloc, "fraza": f"grila: {adr} {formule[adr]}"}))
                else:
                    cl, cont = clasa_continut(v, "apare")
                    ev.append((0, adr, {"clasa": cl, "continut": cont, "bloc": bloc, "fraza": f"grila: {adr} = {v}"}))
    return ev


def conflicte_roluri(secvente):
    """secvente: listă de (bloc, [evenimente]) în ordinea citirii. Întoarce conflictele de rol."""
    foaie, out = {}, []
    for _bloc, evs in secvente:
        for _off, c, rol in evs:
            if c is None:
                foaie = {}
                for x in out:
                    x["inchis"] = True  # după „foaie nouă” conflictul vechi nu mai privește celulele noi
                continue
            if c in foaie and not compatibil(foaie[c], rol):
                out.append({"celula": c, "rol1": foaie[c], "rol2": rol})
            foaie[c] = rol
    return out


# ---------------------------------------------------------------- utilitare
def scrie_json(path, obj):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_text(json.dumps(obj, ensure_ascii=False, indent=1), encoding="utf-8")


def citeste_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def bucati(s, n=BUCATA):
    s = ns(s)
    return {s[i:i + n] for i in range(0, max(0, len(s) - n + 1))}
