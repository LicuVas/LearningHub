# -*- coding: utf-8 -*-
"""Validator de CONTINUT pentru meniuri_ro_en.json (dictionarul RO<->EN al Office).

Validatorul vechi (acum verifica_forma.py) verifica doar FORMA: exista 2 URL-uri
si un text. Dadea 0 si cand sursele nu dovedeau nimic. Acesta citeste textul
REAL al fiecarei pagini-sursa din _cache/ (descarcat cu cache_surse.py) si
verifica, pentru fiecare intrare CONFIRMAT:

  (a) numele RO exact apare in textul paginii-sursa si in citat
      (normalizare DOAR la spatii si la s/t cu sedila -> s/t cu virgula;
       majusculele conteaza; cuvant intreg, nu bucata din alt cuvant);
      la FUNCTII: macar o sursa arata functia folosita intr-o formula, NUME(
  (b) citatul apare, cuvant cu cuvant, in pagina;
  (c) cele >=2 surse sunt din DOCUMENTE diferite (dupa URL-ul final, GUID-ul
      articolului Microsoft si continut) si macar una e Microsoft
      (support.microsoft.com / learn.microsoft.com) sau o captura din aplicatia
      reala (url "captura:<fisier text din calibrare/capturi>");
  (d) o sursa care scrie numele RO doar ca traducere dupa numele englezesc
      ("Print (Tiparire)", "Bold - Ingrosat") nu conteaza; siturile care predau
      Office cu interfata ENGLEZA (lista SITURI_OFFICE_EN) nu conteaza deloc
      pentru etichetele de panglica.
  + la CONFIRMAT: "ro" e UN singur nume (nu lista); nicaieri s/t cu sedila.

NESIGUR: fiecare sursa web trebuie sa aiba citatul pe pagina (ce am gasit e real)
si intrarea trebuie sa aiba "nota". NEGASIT: trebuie sa aiba "nota".
constante_lume.json: verificare de forma (sursa + citat + valoare), ca inainte.

Ultimele 3 randuri sunt pline; ultima = DOAR numarul de intrari care nu trec.
Optiuni: --toate (arata toate problemele), --intrare N (doar intrarea N, detaliat).
"""
import hashlib
import json
import os
import re
import sys
from urllib.parse import urlparse, unquote

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "_cache")
INDEX = os.path.join(CACHE, "index.json")

MICROSOFT = ("support.microsoft.com", "learn.microsoft.com")
# Situri care predau Office cu interfata ENGLEZA si pun in paranteza traducerea
# autorului ("Print (Tiparire)", "Bold - Ingrosat"): nu dovedesc eticheta romaneasca.
SITURI_OFFICE_EN = ("itlearning.ro", "pdfcoffee.com")

CEDILA = str.maketrans({"ş": "ș", "ţ": "ț",
                        "Ş": "Ș", "Ţ": "Ț"})
GUID = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", re.I)


def norm(s):
    """Normalizare DOAR la spatii si la sedila->virgula."""
    s = (s or "").translate(CEDILA)
    s = re.sub(r"[\s ​  ]+", " ", s)
    s = re.sub(r" ([,.;:!?)\]])", r"\1", s)
    s = re.sub(r"([(\[]) ", r"\1", s)
    return s.strip()


def name_regex(name):
    return re.compile(r"(?<!\w)" + re.escape(norm(name)) + r"(?!\w)")


def url_key(url):
    return hashlib.sha1(url.encode("utf-8")).hexdigest()[:16]


class Pages:
    def __init__(self):
        self.idx = {}
        if os.path.isfile(INDEX):
            with open(INDEX, encoding="utf-8") as f:
                self.idx = json.load(f)
        self._text = {}

    def text(self, url):
        """Textul normalizat al sursei sau None daca nu e in cache."""
        if url in self._text:
            return self._text[url]
        t = None
        if url.startswith("captura:"):
            p = os.path.join(HERE, url[len("captura:"):].strip())
            if os.path.isfile(p):
                with open(p, encoding="utf-8") as f:
                    t = f.read()
        elif url.startswith("http"):
            info = self.idx.get(url, {})
            p = os.path.join(CACHE, url_key(url) + ".txt")
            if info.get("stare_http") == 200 and os.path.isfile(p):
                with open(p, encoding="utf-8") as f:
                    t = f.read()
        t = norm(t) if t is not None else None
        self._text[url] = t
        return t

    def doc_key(self, url):
        if not url.startswith("http"):
            return ("local", url)
        # URL-ul FINAL (dupa redirect): Microsoft trimite adresele cu GUID si
        # pe cele "prietenoase" catre aceeasi adresa finala -> acelasi document.
        final = self.idx.get(url, {}).get("url_final") or url
        m = GUID.search(unquote(final))
        if m:
            return ("ms-guid", m.group(0).lower())
        p = urlparse(final)
        return (p.netloc.lower().replace("www.", ""), p.path.rstrip("/").lower())

    def content_hash(self, url):
        t = self.text(url)
        return hashlib.sha1(t.encode("utf-8")).hexdigest() if t else None


def domain(url):
    if url.startswith("captura:"):
        return "captura"
    return urlparse(url).netloc.lower()


def is_microsoft(url):
    d = domain(url)
    return any(d == m or d.endswith("." + m) for m in MICROSOFT)


def is_office_en_site(url):
    d = domain(url)
    return any(d == s or d.endswith("." + s) for s in SITURI_OFFICE_EN)


def en_aliases(e):
    en = e.get("en", "")
    out = {en}
    base = re.sub(r"\s*\(.*?\)\s*", " ", en).strip()
    if base:
        out.add(base)
    for inner in re.findall(r"\((.*?)\)", en):
        out.add(inner)
    for a in e.get("en_alias", []) or []:
        out.add(a)
    return [a for a in out if a and len(a) > 1]


def only_glosses(page, rx, aliases):
    """True daca TOATE aparitiile numelui RO sunt traduceri dupa numele EN:
    'EN (RO)', 'EN - RO', 'EN – RO', 'EN: RO'."""
    hits = list(rx.finditer(page))
    if not hits:
        return False
    low_aliases = [a.lower() for a in aliases]
    for m in hits:
        before = page[max(0, m.start() - 90):m.start()]
        stripped = before.rstrip()
        gloss_mark = stripped.endswith(("(", "–", "-", "—", ":", "|"))
        has_en = any(a in before.lower() for a in low_aliases)
        if not (gloss_mark and has_en):
            return False
    return True


def check_entry(i, e, pages):
    probs = []
    stare = e.get("stare")
    tip = e.get("tip")
    ro = e.get("ro")
    surse = e.get("surse", []) or []
    names = ro if isinstance(ro, list) else [ro]
    for n in names:
        if isinstance(n, str) and n != n.translate(CEDILA):
            probs.append(f"'ro' are s/t cu SEDILA ({n!r}); corect: virgula dedesubt")
    if stare not in ("CONFIRMAT", "NESIGUR", "NEGASIT"):
        return probs + [f"stare invalida {stare!r}"]
    if stare == "NEGASIT":
        if not (e.get("nota") or "").strip():
            probs.append("NEGASIT fara nota")
        return probs
    if stare == "NESIGUR":
        if not (e.get("nota") or "").strip():
            probs.append("NESIGUR fara nota (spune ce ai gasit si ce lipseste)")
        if not surse:
            probs.append("NESIGUR fara nicio sursa")
        for s in surse:
            u = (s.get("url") or "").strip()
            c = norm(s.get("citat"))
            if not u or not c:
                probs.append("sursa fara url sau citat")
                continue
            if u.startswith("local:"):
                continue
            t = pages.text(u)
            if t is None:
                probs.append(f"sursa nu e in _cache (ruleaza cache_surse.py): {u}")
            elif c not in t:
                probs.append(f"(b) citatul NU e pe pagina: {u} :: {c[:70]!r}")
        return probs

    # ---- CONFIRMAT ----
    if not isinstance(ro, str) or not ro.strip():
        return probs + ["CONFIRMAT dar 'ro' nu e un singur nume (lista/gol)"]
    rx = name_regex(ro)
    aliases = en_aliases(e)
    ribbon = norm(ro) != norm(e.get("en", ""))
    good = []
    for s in surse:
        u = (s.get("url") or "").strip()
        c = norm(s.get("citat"))
        tag = u[:90]
        if not u or not c:
            probs.append("sursa fara url sau citat")
            continue
        if u.startswith("local:"):
            probs.append(f"sursa 'local:' nu poate sustine CONFIRMAT (foloseste captura:<fisier>): {tag}")
            continue
        t = pages.text(u)
        if t is None:
            probs.append(f"sursa nu e in _cache (ruleaza cache_surse.py): {tag}")
            continue
        ok = True
        if c not in t:
            probs.append(f"(b) citatul NU e pe pagina: {tag} :: {c[:70]!r}")
            ok = False
        if not rx.search(t):
            probs.append(f"(a) numele {ro!r} NU apare in pagina: {tag}")
            ok = False
        elif not rx.search(c):
            probs.append(f"(a) citatul nu contine numele {ro!r}: {tag}")
            ok = False
        if ribbon and is_office_en_site(u):
            probs.append(f"(d) sit care preda Office in ENGLEZA (traducerea autorului): {tag}")
            ok = False
        elif ribbon and not is_microsoft(u) and not u.startswith("captura:") and only_glosses(t, rx, aliases):
            probs.append(f"(d) numele apare doar ca traducere dupa cel englezesc: {tag}")
            ok = False
        if ok:
            good.append(u)
    keys = {pages.doc_key(u) for u in good}
    hashes = {}
    for u in good:
        h = pages.content_hash(u)
        hashes.setdefault(h, []).append(u)
    distinct = min(len(keys), len(hashes))
    if distinct < 2:
        probs.append(f"(c) mai putin de 2 surse BUNE din documente diferite (bune: {len(good)}, documente: {distinct})")
    if good and not any(is_microsoft(u) or u.startswith("captura:") for u in good):
        probs.append("(c) nicio sursa buna de la Microsoft si nicio captura din aplicatia reala")
    if tip == "functie":
        frx = re.compile(r"(?<![\w.])" + re.escape(ro) + r"\s*\(")
        if not any(frx.search(pages.text(u) or "") for u in good):
            probs.append(f"(a) nicio sursa buna nu arata functia intr-o formula ({ro}()")
    return probs


def check_constante(path):
    probs = []
    if not os.path.isfile(path):
        return [("constante", f"LIPSA fisier: {path}")]
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    for i, c in enumerate(data.get("constante", [])):
        loc = f"constanta #{i} ({c.get('nume')})"
        if not c.get("sursa") or not (c.get("citat") or "").strip():
            probs.append((loc, "fara sursa sau citat gol"))
        if not c.get("valoare"):
            probs.append((loc, "fara valoare"))
    for i, d in enumerate(data.get("de_verificat", [])):
        if d.get("valoare") not in (None, ""):
            probs.append((f"de_verificat #{i}", "are valoare desi e neconfirmata"))
    return probs


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    show_all = "--toate" in sys.argv
    only = None
    if "--intrare" in sys.argv:
        only = int(sys.argv[sys.argv.index("--intrare") + 1])
        show_all = True
    with open(os.path.join(HERE, "meniuri_ro_en.json"), encoding="utf-8") as f:
        data = json.load(f)
    entries = data.get("intrari", [])
    pages = Pages()
    failing = {}
    counts = {"CONFIRMAT": 0, "NESIGUR": 0, "NEGASIT": 0}
    for i, e in enumerate(entries):
        if only is not None and i != only:
            continue
        counts[e.get("stare")] = counts.get(e.get("stare"), 0) + 1
        p = check_entry(i, e, pages)
        if p:
            failing[i] = p
    cprobs = check_constante(os.path.join(HERE, "constante_lume.json")) if only is None else []
    cfail = sorted({loc for loc, _ in cprobs})

    shown = 0
    for i, plist in failing.items():
        e = entries[i]
        print(f"#{i} [{e.get('aplicatie')}/{e.get('tip')}] {e.get('en')} -> {e.get('ro')} ({e.get('stare')})")
        for p in plist:
            print("    -", p)
        shown += 1
        if not show_all and shown >= 40:
            print(f"   ... si inca {len(failing) - shown} intrari (--toate)")
            break
    for loc, p in cprobs:
        print(f"{loc}: {p}")
    total_fail = len(failing) + len(cfail)
    print(f"Dictionar: {sum(counts.values())} intrari verificate pe CONTINUT (CONFIRMAT {counts.get('CONFIRMAT', 0)}, "
          f"NESIGUR {counts.get('NESIGUR', 0)}, NEGASIT {counts.get('NEGASIT', 0)}); constante: forma")
    print(f"Intrari care nu trec: {total_fail} (dictionar {len(failing)}, constante {len(cfail)}); surse din _cache/, forma veche: verifica_forma.py")
    print(total_fail)


if __name__ == "__main__":
    main()
