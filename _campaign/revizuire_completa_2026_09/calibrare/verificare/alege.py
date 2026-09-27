# -*- coding: utf-8 -*-
"""Alege esantionul pentru verificarea independenta a meniuri_ro_en.json.

- 20 de intrari CONFIRMAT alese cu random.Random(777).sample(...)
  din lista CONFIRMAT in ordinea din fisier (indicele din "intrari").
- toate intrarile NESIGUR si NEGASIT.
Scrie esantion.json langa acest script si tipareste un rezumat.
Rulare: python alege.py [--overview]
"""
import json
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(HERE), "meniuri_ro_en.json")


def main():
    with open(SRC, encoding="utf-8") as f:
        data = json.load(f)
    intrari = data["intrari"]
    if "--overview" in sys.argv:
        for i, e in enumerate(intrari):
            print(f"{i:3d} {e['stare'][:4]} {e['aplicatie']:10s} {e['tip']:10s} "
                  f"{e['en']!s:30.30s} | {e['ro']!s:35.35s} | n_surse={len(e.get('surse', []))}")
        return
    confirmate = [i for i, e in enumerate(intrari) if e["stare"] == "CONFIRMAT"]
    rng = random.Random(777)
    esantion = sorted(rng.sample(confirmate, 20))
    nesigure = [i for i, e in enumerate(intrari) if e["stare"] == "NESIGUR"]
    negasite = [i for i, e in enumerate(intrari) if e["stare"] == "NEGASIT"]
    out = {
        "seed": 777,
        "metoda": "random.Random(777).sample(indici_CONFIRMAT, 20), indici din intrari[] in ordinea fisierului",
        "total": len(intrari),
        "n_confirmat": len(confirmate),
        "esantion_confirmat": esantion,
        "nesigur": nesigure,
        "negasit": negasite,
    }
    with open(os.path.join(HERE, "esantion.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    for tag, idxs in (("ESANTION", esantion), ("NESIGUR", nesigure), ("NEGASIT", negasite)):
        print(f"== {tag} ({len(idxs)})")
        for i in idxs:
            e = intrari[i]
            print(f"#{i} {e['aplicatie']}/{e['tip']} en={e['en']} ro={e['ro']}")
            for s in e.get("surse", []):
                print(f"    - {s['url']}")
                print(f"      citat: {s['citat'][:260]}")
            if e.get("nota"):
                print(f"    nota: {e['nota'][:300]}")


if __name__ == "__main__":
    main()
