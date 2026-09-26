#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
proba_prereq_bloc.py — blocul „Ce trebuie să știi” se vede în pagina reală a jocului (26.09.2026).

Pentru fiecare nivel din jocuri/_motor/prerechizite.json (sau doar primele --max): deschide jocul pe telefon
emulat (Pixel 7), deblochează nivelurile, intră în nivel la primul pas și verifică:
  1. există <details class="prereq"> cu exact atâtea rânduri câte are harta;
  2. e restrâns la intrare și se deschide la clic;
  3. fiecare link duce la ../<joc>/ și acel joc există pe disc;
  4. pagina nu e mai lată decât ecranul după deschidere; zero erori JS.
Plus: un nivel FĂRĂ prerechizite nu are blocul, iar pasul 2 al unui nivel cu bloc nu-l repetă.

  python _tests/proba_prereq_bloc.py [--baza https://proba.learninghub-8z6.pages.dev] [--max 0]
Ultima linie: numărul de verificări picate.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

RAD = Path(__file__).resolve().parents[1]
JOCURI = RAD / "jocuri"


def main(argv=None) -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--baza", help="URL-ul sitului (implicit: fișierele de pe disc, file://)")
    ap.add_argument("--max", type=int, default=0, help="câte niveluri (0 = toate)")
    a = ap.parse_args(argv)
    harta = json.loads((JOCURI / "_motor" / "prerechizite.json").read_text(encoding="utf-8"))["jocuri"]
    cazuri = [(s, int(li), v) for s, h in harta.items() for li, v in h.items()]
    if a.max:
        cazuri = cazuri[:a.max]
    url = (lambda s: f"{a.baza.rstrip('/')}/jocuri/{s}/") if a.baza else (lambda s: (JOCURI / s / "index.html").as_uri())
    picate = 0

    def nota(ok: bool, text: str):
        nonlocal picate
        if not ok:
            picate += 1
            print("  PICAT " + text)

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(**p.devices["Pixel 7"])
        pg = ctx.new_page()
        pg.set_default_timeout(8000)
        errs: list[str] = []
        pg.on("pageerror", lambda e: errs.append(str(e)))

        def intra(slug: str, li: int):
            pg.goto(url(slug), timeout=30000)
            pg.evaluate("JocMotor.test.deblocheaza()")
            pg.goto(url(slug), timeout=30000)
            pg.wait_for_function("!!window.JOCURI_PREREQ", timeout=8000)
            pg.click(f'.lvl[data-l="{li - 1}"]')
            pg.evaluate("JocMotor.test.pas(0)")

        for slug, li, v in cazuri:
            errs.clear()
            eticheta = f"{slug} N{li}"
            try:
                intra(slug, li)
                d = pg.locator("details.prereq")
                nota(d.count() == 1, f"{eticheta}: blocul lipsește")
                if d.count() != 1:
                    continue
                n = d.locator("li").count()
                nota(n == len(v), f"{eticheta}: {n} rânduri în pagină, {len(v)} în hartă")
                nota(not d.evaluate("e=>e.open"), f"{eticheta}: blocul e deschis la intrare (trebuia restrâns)")
                d.locator("summary").click()
                nota(d.evaluate("e=>e.open"), f"{eticheta}: blocul nu se deschide la clic")
                for href in d.locator("a").evaluate_all("as=>as.map(x=>x.getAttribute('href'))"):
                    joc = href.strip("./").strip("/")
                    nota(href.startswith("../") and (JOCURI / joc / "index.html").exists(), f"{eticheta}: link spre un joc inexistent: {href}")
                w = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
                nota(w[0] <= w[1] + 1, f"{eticheta}: pagina e mai lată decât ecranul după deschidere ({w[0]} > {w[1]})")
                pg.evaluate("JocMotor.test.pas(1)")
                nota(pg.locator("details.prereq").count() == 0, f"{eticheta}: blocul se repetă la pasul 2")
                nota(not errs, f"{eticheta}: erori JS: {errs[:2]}")
                print(f"  ok   {eticheta}: {n} prerechizite")
            except Exception as e:  # noqa: BLE001
                nota(False, f"{eticheta}: {type(e).__name__}: {str(e)[:160]}")

        # control negativ: un nivel fără prerechizite nu are bloc
        fara = next(((s, li) for s, h in harta.items()
                     for li in range(1, 12) if str(li) not in h and (JOCURI / s / "index.html").exists()), None)
        if fara:
            try:
                intra(*fara)
                nota(pg.locator("details.prereq").count() == 0, f"{fara[0]} N{fara[1]}: bloc apărut fără prerechizite")
                print(f"  ok   control: {fara[0]} N{fara[1]} fără bloc")
            except Exception as e:  # noqa: BLE001
                nota(False, f"control {fara}: {type(e).__name__}: {str(e)[:160]}")
        b.close()
    print(f"niveluri verificate: {len(cazuri)}")
    print("----")
    print(picate)
    return 0 if picate == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
