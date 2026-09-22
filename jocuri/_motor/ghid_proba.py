#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Proba ghidurilor de telefon: chiar ajung la elev, pe situl VIU?

De ce exista: „am facut capturile” si „elevul le vede” sunt doua lucruri diferite.
Intre ele stau: legatura din pagina jocului, fisierul `pasi.js` si fiecare poza.
Unealta asta le cere pe toate prin HTTP, exact cum le cere browserul copilului.

CE VERIFICA, pentru fiecare joc din `harta.json`:
  1. pagina jocului incarca `_ghiduri/<id>/pasi.js` SI declara `ghiduri:['<id>',...]`
  2. `pasi.js` se descarca si chiar inregistreaza ghidul (`JocMotor.ghid("<id>"`)
  3. fiecare poza din `pasi.js` se descarca SI E CHIAR O POZA WEBP (antet RIFF/WEBP)
  4. numarul de pasi din `pasi.js` e acelasi cu cel din `flux.json`

DE CE CONTINUTUL, NU CODUL 200: pe Cloudflare Pages o adresa gresita poate intoarce
tot 200, cu pagina de rezerva. Un „200” nu dovedeste ca fisierul exista. Dovada e
ce vine inauntru - de aceea se verifica anteturi si texte, nu statusuri.

Uz:
    python ghid_proba.py                              # pe serverul local (127.0.0.1:8777)
    python ghid_proba.py --baza https://learninghub-8z6.pages.dev
Ultima linie tiparita = numarul de probleme (oracol pentru contracte).
"""
import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request

AICI = os.path.dirname(os.path.abspath(__file__))
JOCURI = os.path.dirname(AICI)
GHIDURI = os.path.join(JOCURI, "_ghiduri")
HARTA = os.path.join(GHIDURI, "harta.json")


def ia(url, timeout=25):
    """Continutul de la adresa, ca octeti. Intoarce (octeti, eroare)."""
    cerere = urllib.request.Request(url, headers={"User-Agent": "ghid_proba/1.0"})
    try:
        with urllib.request.urlopen(cerere, timeout=timeout) as r:
            return r.read(), None
    except urllib.error.HTTPError as e:
        return b"", "HTTP %s" % e.code
    except Exception as e:                                  # retea, DNS, TLS
        return b"", str(e)[:120]


def e_webp(octeti):
    return len(octeti) > 12 and octeti[:4] == b"RIFF" and octeti[8:12] == b"WEBP"


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--baza", default="http://127.0.0.1:8777",
                   help="adresa sitului (implicit serverul local)")
    p.add_argument("--tacut", action="store_true", help="doar problemele si numarul")
    p.add_argument("--rapid", action="store_true",
                   help="cere doar PRIMA si ULTIMA poza din fiecare ghid (pentru contracte: "
                        "prinde ghidul disparut sau pagina de rezerva, fara 128 de cereri)")
    a = p.parse_args()
    baza = a.baza.rstrip("/")

    with open(HARTA, encoding="utf-8") as f:
        harta = json.load(f)["jocuri"]

    probleme = []
    poze_verificate = 0
    for joc in sorted(harta):
        pagina, er = ia("%s/jocuri/%s/index.html" % (baza, joc))
        if er:
            probleme.append("%s: nu pot lua pagina jocului (%s)" % (joc, er))
            continue
        text = pagina.decode("utf-8", "replace")
        for idg in harta[joc]:
            if '_ghiduri/%s/pasi.js' % idg not in text:
                probleme.append("%s: pagina nu incarca _ghiduri/%s/pasi.js" % (joc, idg))
                continue
            if not re.search(r"ghiduri:\[[^\]]*'%s'" % re.escape(idg), text):
                probleme.append("%s: pagina nu cere ghidul „%s” in configuratie "
                                "(butonul nu va aparea)" % (joc, idg))

            pasi_js, er = ia("%s/jocuri/_ghiduri/%s/pasi.js" % (baza, idg))
            if er:
                probleme.append("%s/%s: nu pot lua pasi.js (%s)" % (joc, idg, er))
                continue
            js = pasi_js.decode("utf-8", "replace")
            if 'JocMotor.ghid("%s"' % idg not in js:
                probleme.append("%s/%s: pasi.js nu inregistreaza ghidul "
                                "(pe Cloudflare, probabil e pagina de rezerva)" % (joc, idg))
                continue

            poze = re.findall(r'"img":\s*"\.\./_ghiduri/%s/([^"]+)"' % re.escape(idg), js)
            if not poze:
                probleme.append("%s/%s: pasi.js n-are nicio poza" % (joc, idg))
                continue

            # numarul de pasi trebuie sa fie cel din flux.json
            flux_cale = os.path.join(GHIDURI, idg, "flux.json")
            if os.path.exists(flux_cale):
                with open(flux_cale, encoding="utf-8") as f:
                    cat = len(json.load(f)["pasi"])
                if cat != len(poze):
                    probleme.append("%s/%s: %d pasi pe sit, %d in flux.json"
                                    % (joc, idg, len(poze), cat))

            de_cerut = ([poze[0], poze[-1]] if a.rapid and len(poze) > 1 else poze)
            for nume in de_cerut:
                octeti, er = ia("%s/jocuri/_ghiduri/%s/%s" % (baza, idg, nume))
                poze_verificate += 1
                if er:
                    probleme.append("%s/%s: poza %s nu se descarca (%s)" % (joc, idg, nume, er))
                elif not e_webp(octeti):
                    probleme.append("%s/%s: %s NU e o poza webp (%d octeti) - "
                                    "adresa raspunde, dar cu altceva"
                                    % (joc, idg, nume, len(octeti)))
        if not a.tacut:
            print("  %-28s %s" % (joc, ", ".join(harta[joc])))

    if not a.tacut:
        print()
        print("Jocuri: %d · poze cerute prin HTTP: %d · adresa: %s"
              % (len(harta), poze_verificate, baza))
    for x in probleme:
        print("  PROBLEMA:", x)
    print("PROBLEME:", len(probleme))
    print(len(probleme))
    return 0 if not probleme else 1


if __name__ == "__main__":
    sys.exit(main())
