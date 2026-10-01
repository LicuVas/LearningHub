"""GARDA LOCALĂ (01.10.2026, regula 24 din _campaign/revizuire_completa_2026_09/05_STANDARD_LECTIE.md).

ATENȚIE (01.10.2026 seara): garda NU e etanșă. Rutele probei au întâietate și sendBeacon la închiderea paginii a
scăpat: sub ea, proba_prezenta.py a lăsat 6 înregistrări „Proba Prezenta Stergere” pe serverul VIU (șterse apoi).
NU rula proba_prezenta.py nici sub gardă. După orice probă: `python C:/00/AI_0/tools/activitate.py lista | grep -i proba`.

Rulează o probă EXISTENTĂ cu tot ce nu e 127.0.0.1 / localhost abandonat:
  - în browser: fiecare context nou primește o rută „**/*” care lasă doar file:/data:/blob: și 127.0.0.1/localhost;
    rutele probei (înregistrate după) au întâietate, deci serverele simulate ale probei merg ca înainte;
  - în Python: nicio conexiune de rețea spre altă adresă (socket.connect / getaddrinfo), niciun subproces în afară de
    driverul Playwright și de `python -m http.server`;
  - `teste.api` (AI_0/tools/teste.py) întoarce {} în loc să întrebe serverul viu al testelor.
De ce: unele probe vechi (proba_prezenta, proba_diploma) vorbeau cu teste-vasile.netlify.app. Sub gardă, pașii
aceia pică la fel înainte și după o schimbare, iar restul probei spune tot ce spunea.

    python garda_locala.py <proba.py> [argumentele probei]

Ultima linie = ultima linie a probei. Ce s-a blocat se scrie pe stderr.
"""
import os
import runpy
import socket
import sys
from urllib.parse import urlsplit

LOCALE = {"127.0.0.1", "localhost", "::1", "0.0.0.0", ""}
blocate = []


def e_local(host):
    return str(host or "").strip("[]").lower() in LOCALE


def garda(eveniment, args):
    if eveniment == "socket.connect":
        adr = args[1] if len(args) > 1 else None
        if isinstance(adr, tuple) and adr and not e_local(adr[0]):
            blocate.append("conexiune %s" % (adr[0],))
            raise ConnectionRefusedError("garda_locala: conexiune blocată spre %s" % (adr[0],))
    elif eveniment == "socket.getaddrinfo":
        if args and args[0] and not e_local(args[0] if isinstance(args[0], str) else args[0].decode("ascii", "ignore")):
            blocate.append("nume %s" % (args[0],))
            raise socket.gaierror("garda_locala: nume blocat %s" % (args[0],))
    elif eveniment == "subprocess.Popen":
        argv = args[1] if len(args) > 1 else ""
        s = " ".join(map(str, argv)) if isinstance(argv, (list, tuple)) else str(argv)
        if "playwright" in s.lower() or "http.server" in s:
            return
        blocate.append("subproces " + s[:120])
        raise PermissionError("garda_locala: subproces blocat: " + s[:120])


def ruta(r):
    u = r.request.url
    if u.startswith(("file:", "data:", "blob:")) or e_local(urlsplit(u).hostname):
        return r.continue_()
    blocate.append("browser " + u[:100])
    return r.abort()


def pune_garda():
    from playwright.sync_api._generated import Browser, BrowserType
    nc, np_, pc = Browser.new_context, Browser.new_page, BrowserType.launch_persistent_context

    def new_context(self, *a, **k):
        c = nc(self, *a, **k)
        c.route("**/*", ruta)
        return c

    def new_page(self, *a, **k):
        p = np_(self, *a, **k)
        p.context.route("**/*", ruta)
        return p

    def persistent(self, *a, **k):
        c = pc(self, *a, **k)
        c.route("**/*", ruta)
        return c

    Browser.new_context, Browser.new_page, BrowserType.launch_persistent_context = new_context, new_page, persistent
    # serverul viu al testelor: întrebările probelor primesc „nimic”
    sys.path.insert(0, r"C:\00\AI_0\tools")
    try:
        import teste
        teste.api = lambda *a, **k: (blocate.append("teste.api %s" % (a[:1],)) or {})
    except Exception:
        pass
    sys.addaudithook(garda)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    proba = os.path.abspath(sys.argv[1])
    sys.argv = [proba] + sys.argv[2:]
    sys.path.insert(0, os.path.dirname(proba))
    pune_garda()
    try:
        runpy.run_path(proba, run_name="__main__")
    finally:
        if blocate:
            uniq = sorted(set(blocate))
            sys.stderr.write("[garda_locala] blocat %d (%d distincte): %s\n" % (len(blocate), len(uniq), "; ".join(uniq[:12])))
        sys.stderr.flush()


if __name__ == "__main__":
    main()
