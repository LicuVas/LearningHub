# -*- coding: utf-8 -*-
"""Paza rețelei pentru porțile SITULUI rulate de porti.py: jocuri/_motor/test_joc.py, lectii/_build/oracol_controale_taiate.py,
jocuri/_motor/proba_fereastra_mica.py (17.11.2026, reverificare_etapa0.md 6.c și „Reparațiile rămase” 4).

De ce: cele trei probe sunt fișiere ale SITULUI (nu se ating în Etapa 0). Au ruta lor care abandonează tot ce nu e
127.0.0.1/localhost (regula 24), dar nu opresc navigator.sendBeacon și încarcă assets/js/prezenta.js. sendBeacon la
închiderea paginii a scăpat odată de rută (jocuri/_motor/garda_locala.py). Reparația 12 cere, în TOATE probele de
browser: sendBeacon înlocuit cu o funcție care întoarce false și prezenta.js / site-credit.js neîncărcate.

Cum (fără să copiem și fără să schimbăm probele): porti.py pune ACEST dosar în PYTHONPATH, deci Python încarcă singur
modulul la pornire (sitecustomize) — în proba porții și în orice proces Python pornit de ea, cu același mediu
(oracol_controale_taiate.py se împarte în bucăți = procese noi). Modulul învelește API-ul sincron Playwright, la nivel de clasă:
  - orice context nou (Browser.new_context, Browser.new_page, BrowserType.launch_persistent_context) primește, înaintea
    oricărui script al paginii, înlocuirea lui navigator.sendBeacon (întoarce false, nu trimite nimic) și o rută proprie;
  - orice rută pusă de probă (BrowserContext.route / Page.route) e învelită: prezenta.js / site-credit.js (și de pe disc,
    file:///…) și tot ce nu e 127.0.0.1 / localhost / file: se abandonează ÎNAINTE de handlerul probei (care altfel le-ar
    da continue_); restul merge la el;
  - ruta proprie (pusă prima, deci chemată ultima) face la fel, apoi fallback() — pentru o probă fără rută.
Dovada: la ieșire, fiecare proces adaugă un rând JSON în LH_PAZA_JURNAL (contexte păzite, cereri oprite); porti.py îl
citește și declară poarta NECONCLUDENTĂ dacă paza n-a prins niciun context. Proba pazei (control pozitiv și negativ):
oracole/porti_extra/paza_proba.py.
Nu scrie nimic altundeva și nu tipărește nimic (ieșirea probei rămâne exact a ei: ultima linie = numărul ei)."""
import atexit
import inspect
import json
import os
import re
import sys
from urllib.parse import urlsplit

FARA_BEACON_JS = ("(() => { try { Object.defineProperty(navigator, 'sendBeacon', "
                  "{ value: function () { return false; }, configurable: true, writable: true }); } catch (e) {} })();")
FARA_LOCALE = ("/assets/js/prezenta.js", "/assets/js/site-credit.js")
LOCAL_RE = re.compile(r"^https?://(127\.0\.0\.1|localhost)(:\d+)?(/|$)", re.I)

_J = {"pid": os.getpid(), "script": os.path.basename(sys.argv[0]) if sys.argv and sys.argv[0] else "", "playwright": False,
      "contexte": 0, "rute_invelite": 0, "cereri_locale_oprite": 0, "cereri_externe_oprite": 0, "eroare": None}


def _decide(url):
    """→ None (lasă cererea mai departe) sau motivul abandonului. Locale: 127.0.0.1 / localhost și file: (test_joc.py și
    oracol_controale_taiate.py deschid paginile direct de pe disc, file:///…); prezenta.js / site-credit.js se abandonează
    pe ORICE drum, și de pe disc (încărcate, ar vorbi cu serverul viu)."""
    if url.startswith(("data:", "blob:", "about:")):
        return None
    try:
        cale = urlsplit(url).path
    except Exception:  # noqa: BLE001
        cale = ""
    if cale.endswith(FARA_LOCALE):
        return "cereri_locale_oprite"
    if not (LOCAL_RE.match(url) or url.lower().startswith("file:")):
        return "cereri_externe_oprite"
    return None


def _inveleste(handler):
    """handlerul probei, cu paza în față; aceeași aritate (Playwright numără parametrii ca să știe ce să-i dea)."""
    try:
        n = len(inspect.signature(handler).parameters)
    except (TypeError, ValueError):
        n = 1
    _J["rute_invelite"] += 1
    if n >= 2:
        def h(route, request):
            m = _decide(route.request.url)
            if m:
                _J[m] += 1
                return route.abort()
            return handler(route, request)
    else:
        def h(route):
            m = _decide(route.request.url)
            if m:
                _J[m] += 1
                return route.abort()
            return handler(route)
    return h


def _instaleaza():
    from playwright.sync_api import _generated as G
    _J["playwright"] = True
    B, BC, P, BT = G.Browser, G.BrowserContext, G.Page, G.BrowserType
    o_ctx_route, o_page_route = BC.route, P.route

    def ruta_proprie(route):
        m = _decide(route.request.url)
        if m:
            _J[m] += 1
            return route.abort()
        return route.fallback()

    def pazeste(ctx):
        if getattr(ctx, "_lh_pazit", False):
            return ctx
        ctx.add_init_script(FARA_BEACON_JS)
        o_ctx_route(ctx, "**/*", ruta_proprie)
        try:
            ctx._lh_pazit = True
        except Exception:  # noqa: BLE001
            pass
        _J["contexte"] += 1
        return ctx

    o_new_context = B.new_context

    def new_context(self, *a, **k):
        return pazeste(o_new_context(self, *a, **k))

    o_new_page = B.new_page

    def new_page(self, *a, **k):
        pg = o_new_page(self, *a, **k)
        pazeste(pg.context)
        return pg

    o_persist = BT.launch_persistent_context

    def launch_persistent_context(self, *a, **k):
        return pazeste(o_persist(self, *a, **k))

    def ctx_route(self, url, handler, *a, **k):
        return o_ctx_route(self, url, _inveleste(handler), *a, **k)

    def page_route(self, url, handler, *a, **k):
        return o_page_route(self, url, _inveleste(handler), *a, **k)

    B.new_context, B.new_page, BT.launch_persistent_context = new_context, new_page, launch_persistent_context
    BC.route, P.route = ctx_route, page_route


def _scrie_jurnal():
    cale = os.environ.get("LH_PAZA_JURNAL")
    if not cale:
        return
    try:
        with open(cale, "a", encoding="utf-8") as f:
            f.write(json.dumps(_J, ensure_ascii=False) + "\n")
    except Exception:  # noqa: BLE001
        pass


try:
    _instaleaza()
except Exception as e:  # noqa: BLE001  (fără Playwright: procesul nu deschide browsere, nu e nimic de păzit)
    _J["eroare"] = repr(e)[:200]
atexit.register(_scrie_jurnal)
