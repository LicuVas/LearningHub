"""Proba excel-a (2): forma de dată rămasă în celulă, Delete, Ctrl+Z; ștergerea de rânduri / celule (meniul antetului,
fereastra Delete, butonul Delete din Home), Clear ▾, Paste ▾, zoom-ul pe foi. Headless, pe poligonul bibliotecii.
Rulare: python proba_forma_stergere.py <port>."""
import json, sys
from playwright.sync_api import sync_playwright

PORT = sys.argv[1] if len(sys.argv) > 1 else "8764"
URL = f"http://127.0.0.1:{PORT}/aplicatii/poligon.html?aplicatie=excel"
OUT = __file__.replace(".py", ".json")


def local(route):
    u = route.request.url
    return route.continue_() if u.startswith(f"http://127.0.0.1:{PORT}/") else route.abort()


def main():
    rez = {}
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        ctx = b.new_context(viewport={"width": 1400, "height": 900})
        ctx.route("**/*", local)
        pg = ctx.new_page()
        pg.goto(URL)
        pg.wait_for_function("() => window.LH && LH.aplicatii && LH.aplicatii.stare('excel')", timeout=20000)
        pg.wait_for_timeout(800)

        def xy(t):
            return pg.evaluate("t => { const e = LH.aplicatii.element('excel', t); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }", t)

        def clic(t, buton="left"):
            pg.wait_for_timeout(650)   # fără dublu-clic din greșeală
            q = xy(t)
            if not q:
                return False
            pg.mouse.click(q[0], q[1], button=buton)
            pg.wait_for_timeout(120)
            return True

        st = lambda: pg.evaluate("() => LH.aplicatii.stare('excel')")
        cel = lambda a: (st().get("celule") or {}).get(a)
        fmt = lambda a: (st().get("format_celule") or {}).get(a)
        mesaj = lambda: pg.evaluate("() => { const s = LH.aplicatii.stare('excel'); return {fereastra_mesaj: s.fereastra_mesaj, dialog: s.dialog}; }")
        nesim = lambda: pg.evaluate("() => { const e = document.querySelector('[data-lh-mesaj-central], .lh-ap-mesaj, .lh-ap-x-mesaj'); return e ? e.textContent.trim().slice(0, 160) : null; }")

        # 1. forma de dată rămasă
        clic("celula:H6"); pg.keyboard.type("7.5"); pg.keyboard.press("Enter")
        a = cel("H6")
        clic("celula:H6"); pg.keyboard.type("7,5"); pg.keyboard.press("Enter")
        rez["forma"] = {"7.5": a, "7,5_peste": cel("H6"), "format": fmt("H6")}
        clic("celula:H8"); pg.keyboard.type("8.5"); pg.keyboard.press("Enter")
        clic("celula:H8"); pg.keyboard.press("Delete")
        clic("celula:H8"); pg.keyboard.type("8,5"); pg.keyboard.press("Enter")
        rez["delete_apoi_8,5"] = {"H8": cel("H8"), "format": fmt("H8")}
        # 2. Clear ▾ și Paste ▾ și Delete (pictograma) din Home
        for mso in ["ClearMenu", "PasteMenu_Dropdown", "CellsDeleteSmart", "CopySplitButton_Dropdown", "CellsInsertSmart"]:
            clic("celula:H8")
            ok = clic("mso:" + mso)
            rez["home_" + mso] = {"gasit": ok, "mesaj": nesim(), "meniu": pg.evaluate("() => { const m = document.querySelector('[role=menu]'); return m ? m.textContent.trim().slice(0, 200) : null; }"), "H8": cel("H8"), "H9": cel("H9")}
            pg.keyboard.press("Escape")
        # 3. meniul antetului de rând: Delete
        rez["inainte_rand3"] = {"A3": cel("A3"), "A4": cel("A4")}
        clic("antet_rand:3", "right")
        rez["meniu_rand"] = pg.evaluate("() => { const m = document.querySelector('[data-lh-suprafata=\"meniu_contextual.antet_rand\"]'); return !!m; }")
        rez["tinte_meniu"] = [t for t in pg.evaluate("() => LH.aplicatii.tinte('excel')") if "Delete" in t or "Insert" in t or "Clear" in t]
        clic("meniu:Delete")
        rez["dupa_delete_rand3"] = {"A3": cel("A3"), "A4": cel("A4"), "mesaj": nesim()}
        pg.keyboard.press("Escape")
        # 4. fereastra Delete… din meniul celulei: Shift cells up + OK
        clic("celula:B2", "right")
        clic("meniu:Delete...")
        d = mesaj()
        rez["fereastra_delete"] = d
        clic("fereastra:OK") or clic("dialog:OK")
        rez["dupa_ok_delete"] = {"B2": cel("B2"), "B3": cel("B3"), "mesaj": nesim(), "dialog": mesaj()}
        pg.keyboard.press("Escape")
        # 5. Insert… din meniul celulei
        clic("celula:B2", "right"); clic("meniu:Insert...")
        rez["fereastra_insert"] = mesaj()
        pg.keyboard.press("Escape")
        # 6. zoom pe foi: + pe Sheet1, foaie nouă, zoom-ul ei
        z0 = pg.evaluate("() => (document.querySelector('[data-lh-tinta=\"zoom:Zoom 100 %\"], [data-lh-eticheta^=\"Zoom \"]')||{}).textContent")
        tz = [t for t in pg.evaluate("() => LH.aplicatii.tinte('excel')") if t.startswith(("zoom", "fila_foii"))]
        rez["tinte_zoom_foi"] = tz
        zin = next((t for t in tz if "Zoom In" in t), None)
        if zin:
            clic(zin); clic(zin)
        plus = next((t for t in tz if "Add Sheet" in t or "New sheet" in t), None)
        rez["zoom_dupa_2plus"] = pg.evaluate("() => [...document.querySelectorAll('[data-lh-eticheta]')].map(e => e.getAttribute('data-lh-eticheta')).filter(x => /^Zoom \\d/.test(x))")
        if plus:
            clic(plus)
            rez["zoom_foaie_noua"] = pg.evaluate("() => [...document.querySelectorAll('[data-lh-eticheta]')].map(e => e.getAttribute('data-lh-eticheta')).filter(x => /^Zoom \\d/.test(x))")
            rez["foi"] = [t for t in pg.evaluate("() => LH.aplicatii.tinte('excel')") if t.startswith("fila_foii")]
        b.close()
    json.dump(rez, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("scris", OUT)


if __name__ == "__main__":
    main()
