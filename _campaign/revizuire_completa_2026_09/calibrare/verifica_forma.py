# -*- coding: utf-8 -*-
"""Valideaza meniuri_ro_en.json si constante_lume.json din acelasi folder.

Reguli:
  - fiecare intrare CONFIRMAT trebuie sa aiba >=2 surse cu URL-uri de pe
    domenii/articole DIFERITE (nu acelasi URL repetat) si citat nevid.
  - fiecare intrare NESIGUR trebuie sa aiba >=1 sursa cu citat nevid.
  - fiecare intrare NEGASIT nu are cerinte de surse (dar trebuie sa aiba o nota).
  - constante_lume.json: fiecare constanta CONFIRMATA (in lista "constante")
    trebuie sa aiba sursa + citat nevide.

Tipareste, pe ultimele 3 randuri, un raport scurt, iar ultima linie e
STRICT un singur numar intreg: cate intrari incalca regula.
"""
import json
import os
import sys
from urllib.parse import urlparse

HERE = os.path.dirname(os.path.abspath(__file__))


def domain_of(url):
    try:
        return urlparse(url).netloc.lower()
    except Exception:
        return url


def article_key(url):
    """A rough 'different article' key: domain + path without query string."""
    try:
        p = urlparse(url)
        return (p.netloc.lower(), p.path.rstrip("/").lower())
    except Exception:
        return (url, "")


def check_menus(path):
    problems = []
    if not os.path.isfile(path):
        problems.append(f"LIPSA fisier: {path}")
        return problems
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    entries = data.get("intrari", [])
    if not entries:
        problems.append("meniuri_ro_en.json: 0 intrari")
    for i, e in enumerate(entries):
        loc = f"intrarea #{i} ({e.get('aplicatie')}/{e.get('tip')}/{e.get('en')})"
        stare = e.get("stare")
        surse = e.get("surse", [])
        if stare not in ("CONFIRMAT", "NESIGUR", "NEGASIT"):
            problems.append(f"{loc}: stare invalida '{stare}'")
            continue
        if stare == "NEGASIT":
            continue
        # every source must have a url + non-empty citat
        for s in surse:
            if not s.get("url") or not s.get("citat", "").strip():
                problems.append(f"{loc}: sursa fara url sau citat gol")
        if stare == "NESIGUR":
            if len(surse) < 1:
                problems.append(f"{loc}: NESIGUR fara nicio sursa")
            continue
        if stare == "CONFIRMAT":
            if len(surse) < 2:
                problems.append(f"{loc}: CONFIRMAT cu mai putin de 2 surse")
                continue
            keys = {article_key(s["url"]) for s in surse if s.get("url")}
            if len(keys) < 2:
                problems.append(f"{loc}: CONFIRMAT dar sursele sunt acelasi articol ({keys})")
    return problems


def check_constante(path):
    problems = []
    if not os.path.isfile(path):
        problems.append(f"LIPSA fisier: {path}")
        return problems
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    for i, c in enumerate(data.get("constante", [])):
        loc = f"constanta #{i} ({c.get('nume')})"
        if not c.get("sursa") or not c.get("citat", "").strip():
            problems.append(f"{loc}: fara sursa sau citat gol")
        if not c.get("valoare"):
            problems.append(f"{loc}: fara valoare")
    for i, d in enumerate(data.get("de_verificat", [])):
        if d.get("valoare") not in (None, ""):
            problems.append(f"de_verificat #{i}: are valoare desi ar trebui sa fie fara (neconfirmata)")
    return problems


def main():
    menus_path = os.path.join(HERE, "meniuri_ro_en.json")
    const_path = os.path.join(HERE, "constante_lume.json")

    problems = []
    problems += check_menus(menus_path)
    problems += check_constante(const_path)

    print(f"Verificare calibrare LearningHub -- {len(problems)} probleme gasite")
    if problems:
        for p in problems[:40]:
            print(" -", p)
        if len(problems) > 40:
            print(f"   ... si inca {len(problems) - 40}")
    else:
        print("Toate intrarile CONFIRMAT au >=2 surse independente cu citate; NESIGUR au >=1.")
    print(len(problems))


if __name__ == "__main__":
    main()
