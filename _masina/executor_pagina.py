"""Executorul în pagină (01_PLAN.md §3, nivelul 1): face acțiunile agentului STRICT ca un elev, în pagina reală.

    python _masina/executor_pagina.py <pagina> --pas k --actiuni raspuns.json [--nivel i] [--sarcina ex]
                                      [--dosar dosar.json] [--out executor.json] [--profile desktop,telefon]

- Deschide pagina în Chromium (Playwright), pe două profile: „desktop_1280” (mouse + tastatură) și „pixel_7”
  (atingere; tragerea cu degetul prin evenimente touch reale, CDP). Ajunge la pasul k (navigarea se face prin
  cârligele de test ale motorului - ea NU e ce se verifică) și face acțiunile agentului prin GESTURI reale:
  clic/atingere pe celulă, tragere, tastare, Enter/Tab/Delete/Ctrl+C/Ctrl+V…, clic pe textul butonului.
  Niciodată rezolvarea automată a motorului.
- Pe telefon, tastele pe care tastatura de pe ecran nu le are (Ctrl+…, Delete, Esc, Tab, F2…) sunt IMPOSIBILE.
- După fiecare acțiune citește starea simulatorului (Excel: valorile, celula activă, zona, caseta de nume, bara fx,
  modul Gata/Introducere/Editare; Word: rândurile documentului, cursorul, textul netrimis, testele bifate).
- La final notează dacă a rămas ceva în editare, apasă „Verifică” (ca elevul) și citește mesajul; verifică apoi
  ce promite lecția după agent (`astept`: „caseta de nume arată X”, „în X apare Y”, „zona X se colorează”).

Scrie executor.json: pe fiecare profil și lectură, acțiunile (făcută / imposibilă / neexecutabilă + de ce + starea de
după), verificarea simulatorului, promisiunea îndeplinită da/nu; sus: `confirmat` (profilul desktop),
`celula_in_editare`, `nepotriviri`. valideaza_pas.py --executor <fișier> (sau --executor auto) îl folosește.
Ultima linie: numărul de nepotriviri + acțiuni imposibile pe desktop (0 = confirmat sau nimic de confirmat).
"""
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import comun as C  # noqa: E402
from valideaza_pas import citeste_raspuns  # noqa: E402

TASTE_TELEFON = {"enter", "backspace"}          # ce are tastatura de pe ecran a telefonului
NUME_TASTE = {"enter": "Enter", "tab": "Tab", "esc": "Escape", "escape": "Escape", "delete": "Delete", "del": "Delete",
              "backspace": "Backspace", "f2": "F2", "f4": "F4", "home": "Home", "end": "End", "shift": "Shift",
              "ctrl": "Control", "control": "Control", "alt": "Alt", "sus": "ArrowUp", "jos": "ArrowDown",
              "stânga": "ArrowLeft", "dreapta": "ArrowRight", "spațiu": " ", "space": " "}
MODIF = {"Control", "Shift", "Alt"}
RX_CEL = re.compile(rf"^{C.CELULA}(?::{C.CELULA})?$")

JS_STARE = r"""() => {
  const q = s => document.querySelector(s), fb = q('#fb .fb');
  const out = {mesaj: fb ? {fel: fb.classList.contains('ok') ? 'ok' : (fb.classList.contains('bad') ? 'bad' : ''), text: fb.innerText.trim().slice(0, 300)} : null};
  const g = q('#body #xgw');
  if (g) {
    const cells = {};
    g.querySelectorAll('td[data-a]').forEach(td => {
      const t = [...td.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('');
      if (t.trim()) cells[td.dataset.a] = t;
    });
    const act = g.querySelector('td.act');
    // zona = dreptunghiul peste celulele colorate + celula activă (albă în zonă, are clasa act, nu z)
    const zc = [...g.querySelectorAll('td.z, td.act')].map(td => td.dataset.a).map(a => { const m = a.match(/^([A-Z]+)(\d+)$/);
      return {c: m[1].split('').reduce((x, ch) => x * 26 + ch.charCodeAt(0) - 64, 0), l: m[1], r: +m[2]}; });
    const z = zc.length > 1 && g.querySelector('td.z') ? (() => { const mn = zc.reduce((a, b) => b.c < a.c ? b : a), mx = zc.reduce((a, b) => b.c > a.c ? b : a);
      return [mn.l + Math.min(...zc.map(x => x.r)), mx.l + Math.max(...zc.map(x => x.r))]; })() : [];
    const mod = q('#body #xst span');
    Object.assign(out, {sim: 'excel', valori: cells, activa: act ? act.dataset.a : null,
      zona: z.length > 1 ? z[0] + ':' + z[z.length - 1] : null, caseta_nume: q('#body .nb') ? q('#body .nb').textContent.trim() : null,
      bara_fx: q('#body #xfx') ? q('#body #xfx').value : null, mod: mod ? mod.textContent.trim() : null,
      marcaj_copiere: [...g.querySelectorAll('td.mq')].map(td => td.dataset.a),
      meniu: [...document.querySelectorAll('[role=menu], .xm, .ctx, .meniu')].filter(e => e.offsetParent).map(e => e.innerText.trim().slice(0, 80))});
    out.in_editare = !!(out.mod && !/^Gata|^Ready/i.test(out.mod));
    return out;
  }
  const d = q('#body .wo-doc');
  if (d) {
    const bl = [...d.children].map(e => e.tagName === 'TABLE'
      ? {tabel: [...e.rows].map(r => [...r.cells].map(c => c.innerText.trim()))}
      : {text: e.innerText.trim(), poze: [...e.querySelectorAll('.wo-pic')].map(p => p.getAttribute('aria-label') || '')});
    const car = d.querySelector('.wo-car'), cur = car && car.closest('[data-b]'), pend = d.querySelector('.wo-pend');
    Object.assign(out, {sim: 'word', blocuri: bl, cursor: cur ? cur.dataset.b : null, netrimis: pend ? pend.textContent : '',
      caseta_tastatura: q('#body .wo-in') ? q('#body .wo-in').value : null,
      teste: [...document.querySelectorAll('#body .wo-teste li')].map(li => ({ok: li.classList.contains('ok'), ce: li.innerText.replace(/^[✔○]\s*/, '').replace(/ — gata$/, '').trim()})),
      nota: q('#body .wo-nota') ? q('#body .wo-nota').textContent.trim() : ''});
    out.in_editare = false;  // Word n-are „mod de editare”; textul din caseta Tastatura e doar raportat (netrimis)
    return out;
  }
  out.sim = null; out.in_editare = false;
  return out;
}"""

JS_TINTA = r"""([t, cuTitlu, doarDoc]) => {
  const N = s => (s || '').normalize('NFC').replace(/[„“”"«»]/g, '"').replace(/[’‘`]/g, "'").replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
  const want = N(t);
  document.querySelectorAll('[data-exec-tinta]').forEach(e => e.removeAttribute('data-exec-tinta'));
  const vizibil = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const sel = doarDoc ? '#body .wo-doc .wo-p, #body .wo-doc td, #body .wo-pic'
                      : 'button, [role=button], [role=menuitem], [role=tab], a, .opt, label, summary, [data-wo], [data-k], th';
  let best = null, bs = 0, cum = '';
  // o fereastră deschisă (dialog, meniu) e deasupra: elevul caută întâi acolo
  const sus = [...document.querySelectorAll('[role=dialog], [role=menu]')].filter(vizibil);
  const inSus = e => sus.some(d => d.contains(e));
  for (const e of document.querySelectorAll(sel)) {
    if (!vizibil(e)) continue;
    const tx = N(e.innerText), al = N(e.getAttribute('aria-label')), ti = N(e.getAttribute('title'));
    let s = 0, c = '';
    if (tx === want) { s = 5; c = 'textul de pe ecran'; }
    else if (al === want) { s = 4; c = 'eticheta (aria-label)'; }
    else if (tx.startsWith(want) && want.length >= 3) { s = 3; c = 'începutul textului de pe ecran'; }
    else if (cuTitlu && ti && ti.startsWith(want) && want.length >= 3) { s = 2; c = 'bula cu numele (title), la trecerea mouse-ului'; }
    else if (doarDoc && tx.includes(want) && want.length >= 3) { s = 1; c = 'text din document'; }
    if (s && sus.length && inSus(e)) { s += 10; c += ', în fereastra deschisă'; }
    if (s > bs) { best = e; bs = s; cum = c; }
  }
  if (!best) return null;
  best.setAttribute('data-exec-tinta', '1');
  return cum;
}"""


def tasta_playwright(s):
    parti = [p for p in re.split(r"\s*\+\s*", C.nc(s)) if p]
    out = []
    for p in parti:
        k = NUME_TASTE.get(p.casefold())
        out.append(k if k else (p.lower() if len(p) == 1 else p))
    return out


def zona_norm(z):
    m = re.fullmatch(rf"({C.CELULA}):({C.CELULA})", (z or "").upper())
    if not m:
        return (z or "").upper()
    (c1, r1), (c2, r2) = [(re.match(r"[A-Z]+", x).group(0), int(re.search(r"\d+", x).group(0))) for x in m.groups()]
    k = lambda c: C.coloana(c)
    lo, hi = (min(c1, c2, key=k), min(r1, r2)), (max(c1, c2, key=k), max(r1, r2))
    return f"{lo[0]}{lo[1]}:{hi[0]}{hi[1]}"


def efect_selectie(ob, st):
    """după clic/tragere pe foaie: s-a ales chiar ce voia elevul?"""
    if not st or st.get("sim") != "excel":
        return None
    if ":" in ob:
        return None if zona_norm(st.get("zona")) == zona_norm(ob) else f"ecranul arată zona {st.get('zona') or st.get('activa')}, nu {ob}"
    return None if (st.get("activa") or "").upper() == ob.upper() else f"celula activă e {st.get('activa')}, nu {ob}"


def obiect_text(ob):
    ob = C.nc(ob if isinstance(ob, str) else "")
    m = re.search(r'"([^"]{2,})"', ob)
    return m.group(1) if m else ob


class Rulare:
    def __init__(self, pg, cdp, telefon):
        self.pg, self.cdp, self.tel = pg, cdp, telefon
        self.modif = []

    def stare(self):
        return self.pg.evaluate(JS_STARE)

    # ---------------- ținte
    def celula(self, adr):
        loc = self.pg.locator(f'#body #xgw td[data-a="{adr}"]')
        return loc if loc.count() else None

    def centru(self, loc, centreaza=True):
        """mijlocul țintei, după ce o aduce în mijlocul ecranului; None dacă punctul e acoperit de altceva"""
        if centreaza:
            loc.evaluate("e => e.scrollIntoView({block: 'center', inline: 'center'})")
            self.pg.wait_for_timeout(60)
        b = loc.bounding_box()
        if not b:
            return None
        x, y = b["x"] + b["width"] / 2, b["y"] + b["height"] / 2
        lovit = loc.evaluate("(e, p) => { const h = document.elementFromPoint(p[0], p[1]); return !!h && (h === e || e.contains(h) || h.contains(e)); }", [x, y])
        if not lovit:
            self.acoperit = self.pg.evaluate(f"(() => {{ const h = document.elementFromPoint({x}, {y}); return h ? (h.innerText || h.className || h.tagName).slice(0, 60) : '?'; }})()")
            return None
        return (x, y)

    def tinta_text(self, t, doar_doc=False):
        cum = self.pg.evaluate(JS_TINTA, [t, not self.tel, doar_doc])
        return (self.pg.locator('[data-exec-tinta="1"]').first, cum) if cum else (None, None)

    def tinta(self, ob):
        """o celulă (A1) sau un element după text: întâi în document (Word), apoi butoanele"""
        o = obiect_text(ob)
        if RX_CEL.match(o) and ":" not in o:
            c = self.celula(o)
            if c:
                return c, "celula din foaie"
        loc, cum = self.tinta_text(o, doar_doc=True)
        if loc:
            return loc, cum
        return self.tinta_text(o)

    # ---------------- gesturi
    def apasa(self, loc, buton="left"):
        if self.tel:
            if buton == "right":
                x, y = self.centru(loc)
                self.cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x, "y": y}]})
                self.pg.wait_for_timeout(900)
                self.cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
            else:
                p = self.centru(loc)
                if not p:
                    raise RuntimeError(f"ținta e acoperită de „{self.acoperit}”")
                self.pg.touchscreen.tap(*p)
        else:
            p = self.centru(loc)
            if not p:
                raise RuntimeError(f"ținta e acoperită de „{self.acoperit}”")
            x, y = p
            for m in self.modif:
                self.pg.keyboard.down(m)
            self.pg.mouse.click(x, y, button=buton)
            for m in reversed(self.modif):
                self.pg.keyboard.up(m)
        self.modif = []

    def trage(self, a, b):
        # întâi primul capăt în mijlocul ecranului, apoi AMÂNDOUĂ coordonatele, fără altă derulare
        pa = self.centru(a)
        pb = self.centru(b, centreaza=False) if pa else None
        if not pa or not pb:
            raise RuntimeError(f"un capăt al tragerii e acoperit sau în afara ecranului ({getattr(self, 'acoperit', '?')})")
        def reinta():  # ca omul: se uită unde e ACUM capătul (foaia se poate muta când începe tragerea)
            bb = b.bounding_box()
            return (bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2) if bb else pb
        if self.tel:
            atinge = lambda t, p: self.cdp.send("Input.dispatchTouchEvent", {"type": t, "touchPoints": [{"x": p[0], "y": p[1]}]})
            atinge("touchStart", pa)
            for i in range(1, 11):
                atinge("touchMove", (pa[0] + (pb[0] - pa[0]) * i / 10, pa[1] + (pb[1] - pa[1]) * i / 10))
                self.pg.wait_for_timeout(15)
            for _ in range(2):
                atinge("touchMove", reinta())
                self.pg.wait_for_timeout(30)
            self.cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
        else:
            self.pg.mouse.move(*pa)
            self.pg.mouse.down()
            self.pg.mouse.move(*pb, steps=10)
            for _ in range(2):
                self.pg.mouse.move(*reinta(), steps=3)
                self.pg.wait_for_timeout(30)
            self.pg.mouse.up()
        return True

    # ---------------- o acțiune
    def executa(self, act):
        a, ob = act.get("actiune"), act.get("obiect")
        obs = obiect_text(ob) if isinstance(ob, str) else ""
        inainte = self.stare()
        if a == "observ":
            return "făcută", "doar privește", inainte
        if a in ("copiez", "lipesc", "deschid", "salvez", "potrivesc", "ordonez", "sortez"):
            return "neexecutabilă", f"„{a}” nu spune gestul (tastă, meniu sau buton); elevul n-are ce apăsa", inainte
        if a == "apas_tasta":
            taste = tasta_playwright(obs)
            if not taste:
                return "imposibilă", "tastă fără nume", inainte
            if self.tel and (len(taste) > 1 or taste[0].casefold() not in TASTE_TELEFON):
                return "imposibilă", f"tastatura de pe ecranul telefonului n-are „{obs}”", inainte
            if len(taste) == 1 and taste[0] in MODIF:
                self.modif.append(taste[0])
                return "făcută", f"ține apăsat {taste[0]} pentru gestul următor", inainte
            self.pg.keyboard.press("+".join(taste))
        elif a == "tastez":
            self.pg.keyboard.type(C.nc(ob) if isinstance(ob, str) else str(ob), delay=15)
        elif a in ("selectez", "clic_buton", "clic_dreapta", "dublu_clic", "aleg_varianta"):
            if a == "selectez" and ":" in obs and RX_CEL.match(obs):
                x, y = obs.split(":")
                ca, cb = self.celula(x), self.celula(y)
                if not ca or not cb:
                    return "imposibilă", f"zona {obs} nu e pe foaie", inainte
                self.trage(ca, cb)
                self.pg.wait_for_timeout(150)
                dupa = self.stare()
                gres = efect_selectie(obs, dupa)
                return ("imposibilă", f"tragerea n-a selectat zona: {gres}", dupa) if gres else ("făcută", "", dupa)
            else:
                loc, cum = self.tinta(ob) if a != "aleg_varianta" else self.tinta_text(obs)
                if loc is None:
                    return "imposibilă", f"pe ecran nu există „{obs}”", inainte
                if a == "dublu_clic":
                    if self.tel:
                        self.apasa(loc)
                        self.apasa(loc)
                    else:
                        x, y = self.centru(loc)
                        self.pg.mouse.dblclick(x, y)
                else:
                    self.apasa(loc, "right" if a == "clic_dreapta" else "left")
                self.pg.wait_for_timeout(150)
                dupa = self.stare()
                if a == "selectez" and RX_CEL.match(obs):
                    gres = efect_selectie(obs, dupa)
                    if gres:
                        return "imposibilă", f"gestul n-a ales ce trebuia: {gres}", dupa
                return "făcută", f"găsit după {cum}", dupa
        elif a == "trag":
            m = re.search(rf"({C.CELULA}).*?({C.CELULA})", obs)
            if m and self.celula(m.group(1)) and self.celula(m.group(2)):
                self.trage(self.celula(m.group(1)), self.celula(m.group(2)))
                self.pg.wait_for_timeout(150)
                dupa = self.stare()
                gres = efect_selectie(f"{m.group(1)}:{m.group(2)}", dupa)
                return ("imposibilă", f"tragerea n-a selectat zona: {gres}", dupa) if gres else ("făcută", "", dupa)
            else:
                parti = re.split(r"\s+(?:la|până la|->|→)\s+", re.sub(r"^de la\s+", "", obs))
                if len(parti) != 2:
                    return "imposibilă", f"nu înțeleg de unde până unde: „{obs}”", inainte
                (la, _), (lb, _) = self.tinta(parti[0]), self.tinta(parti[1])
                if la is None or lb is None:
                    return "imposibilă", f"capetele tragerii nu sunt pe ecran: „{obs}”", inainte
                self.trage(la, lb)
        else:
            return "neexecutabilă", f"acțiune necunoscută „{a}”", inainte
        self.pg.wait_for_timeout(150)
        dupa = self.stare()
        if a in ("tastez", "apas_tasta") and dupa == inainte:
            return "imposibilă", "nu s-a schimbat nimic pe ecran (tasta/textul n-a ajuns în simulator)", dupa
        return "făcută", "", dupa


def verifica_promisiuni(text, st, citat=None):
    """ce spune agentul că promite lecția, comparat cu ecranul (doar formele pe care le putem citi mecanic).
    Dacă agentul dă și citatul, se verifică DOAR ce e în citat (altfel e deducția agentului, nu promisiunea lecției)."""
    out = []
    if citat is not None and st and st.get("sim") == "excel":
        cit = C.nc(citat).casefold()
        return [p for p in verifica_promisiuni(text, st) if C.nc(str(p["asteptat"])).casefold() in cit]
    if not text or re.search(r"lecția nu spune", text, re.I) or not st or st.get("sim") != "excel":
        return out
    t = C.nc(text)
    m = re.search(rf"caseta de nume[^.]{{0,40}}?\b(?:arat[ăa]|scrie|apare|afișează)\b[^A-Z]{{0,20}}({C.CELULA}(?::{C.CELULA})?)", t, re.I)
    if m:
        out.append({"ce": "caseta de nume", "asteptat": m.group(1), "vazut": st.get("caseta_nume"),
                    "ok": (st.get("caseta_nume") or "").upper() == m.group(1).upper()})
    for m in re.finditer(rf"(?:[îÎ]n|[iI]n)\s+({C.CELULA})\s+(?:apare|scrie|arată|rămâne|este|e)\s+[\"]?([^\".,;]+?)[\"]?(?=[.,;]|$)", t):
        v = (st.get("valori") or {}).get(m.group(1), "")
        out.append({"ce": f"valoarea din {m.group(1)}", "asteptat": m.group(2).strip(), "vazut": v,
                    "ok": C.nc(v).casefold() == C.nc(m.group(2)).casefold()})
    m = re.search(rf"(?:zona\s+)?({C.CELULA}:{C.CELULA})\s+(?:se colorează|e selectat|e selectată|e colorată)", t, re.I)
    if m:
        out.append({"ce": "zona selectată", "asteptat": m.group(1), "vazut": st.get("zona"),
                    "ok": (st.get("zona") or "").upper() == m.group(1).upper()})
    return out


def inchide_bara(pg, telefon):
    """bara „Spune cine ești” de jos acoperă foaia; elevul o închide („Nu, doar vizitez”) - navigare, nu gestul verificat"""
    b = pg.locator("#lhp-viz")
    if b.count() and b.first.is_visible():
        (b.first.tap() if telefon else b.first.click())
        pg.wait_for_timeout(150)
        return "am închis bara „Spune cine ești” cu „Nu, doar vizitez”"
    return ""


def navigheaza(pg, nivel, k, sid):
    pg.evaluate("JocMotor.test.deblocheaza()")
    if pg.locator(f'.lvl[data-l="{nivel - 1}"]').count():
        pg.click(f'.lvl[data-l="{nivel - 1}"]')
        pg.wait_for_timeout(200)
    m = re.fullmatch(r"ex(\d*)", sid)
    m2 = re.fullmatch(r"atelier(?:\.ex(\d+))?", sid)
    if m:
        pg.evaluate(f"JocMotor.test.pas({k})")
        if m.group(1):
            pg.evaluate(f"JocMotor.test.exercitiu({int(m.group(1))})")
    elif m2:
        pg.evaluate("JocMotor.test.atelier()")
        if m2.group(1):
            pg.evaluate(f"JocMotor.test.exercitiu({int(m2.group(1))})")
    elif sid == "q1":
        pg.evaluate(f"JocMotor.test.pas({k})")
        pg.click("#go")
    else:
        return f"sarcina „{sid}” n-are simulator în pagină (pas de citit, întrebare după altele sau aplicația reală)"
    pg.wait_for_timeout(300)
    return None


def ruleaza_profil(pw, browser, pagina, nivel, k, sid, lecturi, telefon):
    ctx = browser.new_context(**pw.devices["Pixel 7"]) if telefon else browser.new_context(viewport={"width": 1280, "height": 900})
    rez = []
    try:
        for li, L in enumerate(lecturi, 1):
            pg = ctx.new_page()
            erori = []
            pg.on("pageerror", lambda e: erori.append(str(e)[:200]))
            pg.goto(Path(pagina).as_uri(), timeout=30000)
            pg.wait_for_timeout(300)
            cdp = ctx.new_cdp_session(pg) if telefon else None
            inchis = inchide_bara(pg, telefon)
            fara = navigheaza(pg, nivel, k, sid)
            r = Rulare(pg, cdp, telefon)
            out = {"lectura": li, "actiuni": [], "fara_simulator": fara, "navigare": inchis}
            if fara:
                out.update(confirmat=None, in_editare_la_final=False, verificare=None, promisiune=None)
                rez.append(out)
                pg.close()
                continue
            out["stare_initiala"] = r.stare()
            for n, act in enumerate(L.get("actiuni") or [], 1):
                try:
                    fel, de_ce, st = r.executa(act)
                except Exception as e:  # noqa: BLE001 - un gest care nu se poate face e un rezultat, nu o prăbușire
                    fel, de_ce, st = "imposibilă", f"gestul a eșuat: {type(e).__name__}: {str(e)[:120]}", r.stare()
                out["actiuni"].append({"nr": n, "actiune": act.get("actiune"), "obiect": act.get("obiect"),
                                       "rezultat": fel, "de_ce": de_ce, "stare_dupa": st})
            fin = r.stare()
            out["in_editare_la_final"] = bool(fin.get("in_editare"))
            out["stare_finala"] = fin
            ver = {"buton": False, "corect": None, "mesaj": (fin.get("mesaj") or {}).get("text", "")}
            if fin.get("mesaj"):
                ver["corect"] = fin["mesaj"]["fel"] == "ok"
            elif pg.locator("#chk").count() and pg.locator("#chk").is_visible():
                (pg.locator("#chk").tap() if telefon else pg.locator("#chk").click())
                pg.wait_for_timeout(250)
                dupa = r.stare()
                ver.update(buton=True, corect=((dupa.get("mesaj") or {}).get("fel") == "ok") if dupa.get("mesaj") else None,
                           mesaj=(dupa.get("mesaj") or {}).get("text", ""), teste=dupa.get("teste"))
            out["verificare"] = ver
            a_ = L.get("astept") if isinstance(L.get("astept"), dict) else {}
            astept = a_.get("text", "")
            prom = verifica_promisiuni(astept, fin, a_.get("citat") if a_.get("citat") else None)
            ok_prom = all(p["ok"] for p in prom) if prom else None
            if ver["corect"] is False:
                ok_prom = False
            elif ver["corect"] is True and ok_prom is None:
                ok_prom = True
            out["promisiune"] = {"text_agent": astept, "verificari": prom, "indeplinita": ok_prom}
            facute = all(x["rezultat"] == "făcută" for x in out["actiuni"])
            out["confirmat"] = None if ok_prom is None else bool(facute and not out["in_editare_la_final"] and ok_prom)
            out["erori_js"] = erori
            rez.append(out)
            pg.close()
    finally:
        ctx.close()
    return rez


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pagina")
    ap.add_argument("--pas", type=int, required=True)
    ap.add_argument("--actiuni", required=True)
    ap.add_argument("--nivel", type=int, default=1)
    ap.add_argument("--sarcina", default=None)
    ap.add_argument("--sarcina-id", default=None)
    ap.add_argument("--dosar")
    ap.add_argument("--out")
    ap.add_argument("--profile", default="desktop,telefon")
    a = ap.parse_args()

    raspuns, reparat = citeste_raspuns(a.actiuni)
    note = [reparat] if reparat else []
    secret, dosar = None, None
    if a.dosar:
        dosar = C.citeste_json(a.dosar)
        secret = C.citeste_json(C.cale_secret(dosar["id"]))
    sid_r = a.sarcina_id or (secret["principal"] if secret else None)
    sarcini = raspuns.get("sarcini") or [] if isinstance(raspuns, dict) else []
    t = next((x for x in sarcini if x.get("id") == sid_r), None) if sid_r else (sarcini[0] if len(sarcini) == 1 else None)
    if t is None:
        print("EROARE: nu știu ce sarcină din răspuns să execut (dați --dosar sau --sarcina-id)")
        print(1)
        sys.exit(2)
    sid = a.sarcina or (secret["sarcini"][sid_r]["sid"] if secret else "ex")
    lecturi = [L for L in (t.get("lecturi") or []) if isinstance(L, dict)]
    amprenta = hashlib.sha256(Path(a.pagina).read_bytes()).hexdigest()[:16]
    if dosar and dosar.get("amprente", {}).get("pagina") and dosar["amprente"]["pagina"] != amprenta:
        note.append(f"pagina s-a schimbat de la construirea dosarului ({dosar['amprente']['pagina']} → {amprenta}): "
                    "executorul rulează versiunea de acum")
    canar = (secret or {}).get("canar") or {}
    from playwright.sync_api import sync_playwright
    rez = {"dosar_id": dosar["id"] if dosar else None, "pagina": str(a.pagina), "amprenta_pagina": amprenta, "nivel": a.nivel,
           "pas": a.pas, "sarcina": sid, "sarcina_id": t.get("id"), "profile": {}, "note": note}
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        try:
            for prof in [p.strip() for p in a.profile.split(",") if p.strip()]:
                nume = "pixel_7" if prof == "telefon" else "desktop_1280"
                rez["profile"][nume] = ruleaza_profil(pw, br, a.pagina, a.nivel, a.pas, sid, lecturi, prof == "telefon")
        finally:
            br.close()
    d = rez["profile"].get("desktop_1280") or next(iter(rez["profile"].values()), [])
    nep = []
    for prof, lst in rez["profile"].items():
        for L in lst:
            for x in L["actiuni"]:
                if x["rezultat"] != "făcută":
                    nep.append({"profil": prof, "lectura": L["lectura"], "fel": "acțiune " + x["rezultat"],
                                "ce": f"{x['actiune']} «{C.nc(str(x['obiect']))[:40]}»: {x['de_ce']}"})
            if L.get("in_editare_la_final"):
                nep.append({"profil": prof, "lectura": L["lectura"], "fel": "rămas în editare",
                            "ce": "după ultima acțiune, celula/textul a rămas în editare (neconfirmat cu Enter/Tab)"})
            v = L.get("verificare") or {}
            if v.get("corect") is False:
                nep.append({"profil": prof, "lectura": L["lectura"], "fel": "verificarea simulatorului",
                            "ce": f"„Verifică” spune: {v.get('mesaj', '')[:160]}"})
            for p in (L.get("promisiune") or {}).get("verificari") or []:
                if not p["ok"]:
                    nep.append({"profil": prof, "lectura": L["lectura"], "fel": "promisiune neîndeplinită",
                                "ce": f"{p['ce']}: lecția (după agent) promite «{p['asteptat']}», ecranul arată «{p['vazut']}»"})
    rez["nepotriviri"] = nep
    rez["celula_in_editare"] = any(L.get("in_editare_la_final") for L in d)
    conf = [L.get("confirmat") for L in d]
    rez["confirmat"] = None if (not conf or any(c is None for c in conf)) else all(conf)
    if canar.get("tip") == "numar":
        rez["note"].append("dosarul avea un număr schimbat (canar): pagina reală are alt număr, deci executorul nu poate confirma")
        rez["confirmat"] = None
    out = Path(a.out) if a.out else Path(a.actiuni).with_suffix(".executor.json")
    C.scrie_json(out, rez)
    for prof, lst in rez["profile"].items():
        for L in lst:
            fac = sum(1 for x in L["actiuni"] if x["rezultat"] == "făcută")
            print(f"{prof} · lectura {L['lectura']}: {fac}/{len(L['actiuni'])} acțiuni făcute; în editare la final: "
                  f"{'da' if L.get('in_editare_la_final') else 'nu'}; verificare: {(L.get('verificare') or {}).get('corect')}; "
                  f"promisiune: {(L.get('promisiune') or {}).get('indeplinita')}; confirmat: {L.get('confirmat')}"
                  + (f" ({L['fara_simulator']})" if L.get("fara_simulator") else ""))
    for x in nep:
        print(f"  ! {x['profil']} L{x['lectura']} {x['fel']}: {x['ce']}")
    for x in rez["note"]:
        print(f"  · {x}")
    print(f"executor: {out}")
    print(f"CONFIRMAT (desktop): {rez['confirmat']}")
    print(sum(1 for x in nep if x["profil"] == "desktop_1280"))


if __name__ == "__main__":
    main()
