#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Redarea unui ghid: reface drumul pe telefonul emulat si scoate capturile finale.

Un ghid = `jocuri\\_ghiduri\\<id>\\flux.json`:

{
  "app": "Google Docs", "pachet": "com.google.android.apps.docs.editors.docs",
  "titlu": "Cum faci un document pe telefon",
  "intro": "...", "jocuri": ["word-vii", "word-antrenament-vii"],
  "pasi": [
    {"t": "Deschide aplicatia Docs",
     "d": "...explicatie pentru elev...",
     "asteapta": "Documente",              # textul care DOVEDESTE ca ecranul e cel bun
     "incercuieste": "Creare",             # (optional) ce se marcheaza cu rosu in poza
     "actiune": {"tip": "tap-text", "ce": "Creare"},   # + "oriunde": true daca
                                                       # butonul nu e marcat atingibil
     "dupa": 1.5}                          # (optional) secunde de asteptare dupa actiune
  ]
}

Reguli:
- Fiecare pas se verifica INAINTE de captura (`asteapta`). Daca ecranul nu e cel
  asteptat, redarea se opreste cu eroare: mai bine niciun ghid decat un ghid fals.
- CONFIDENTIALITATE, pastita greu: emulatorul OGLINDESTE CLIPBOARDUL WINDOWS, iar
  Gboard arata ce ai copiat ultima data intr-o pastila deasupra tastaturii. Pe
  22.09.2026 a ajuns asa un link personal in doua capturi. Aparat: in telefonul
  emulat, Setari > Tastatura pe ecran > Gboard > Clipboard > „Afiseaza textul si
  imaginile copiate recent in bara de sugestii” = OPRIT. Daca refaci AVD-ul, o
  oprești din nou INAINTE de prima redare, si te uiti la capturile cu tastatura.
- Datele personale se acopera din arborele de interfata (nod cu numele/adresa
  contului), nu din OCR: e exact, nu aproximativ. Lista: `ghid_secrete.json`.
- Ultima linie tiparita = numarul de probleme (oracol pentru contracte).

Iesiri: `<id>\\NN-nume.webp` (360px latime), `<id>\\pasi.js` (pentru site),
`<id>\\SURSE.json` (provenienta, ca la README §6b).
"""
import argparse
import io
import json
import os
import re
import sys
import time
from datetime import date

from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ghid_telefon as T  # noqa: E402

AICI = os.path.dirname(os.path.abspath(__file__))
GHIDURI = os.path.join(os.path.dirname(AICI), "_ghiduri")
# lista de acoperit (nume, adresa de mail) sta IN AFARA depozitului public
SECRETE = os.environ.get("GHID_SECRETE", "C:/00/AI_0/data/ghid_secrete.json")
LATIME = 360           # latimea capturii pe site (rama de telefon are ~300-330px)
ROSU = (228, 0, 43)    # #E4002B, ca in README §6b


def secrete():
    if not os.path.exists(SECRETE):
        return {"texte": [], "descrieri": []}
    with open(SECRETE, encoding="utf-8") as f:
        return json.load(f)


def ecran_xml():
    return T.dump_ui()


def asteapta_text(tinta, secunde=25):
    """Asteapta pana cand textul apare pe ecran. Intoarce nodurile ecranului sau None."""
    t0 = time.time()
    while time.time() - t0 < secunde:
        ns = T.noduri(ecran_xml())
        if not tinta or T.caută(ns, tinta):
            return ns
        time.sleep(1.2)
    return None


def captura_bruta():
    r = T.adb("exec-out", "screencap", "-p", capture_output=True, text=False)
    return Image.open(io.BytesIO(r.stdout)).convert("RGB")


def acopera(img, noduri_ecran, sec):
    """Blureaza zonele cu date personale (nume, adresa, poza de profil)."""
    acoperite = 0
    for n in noduri_ecran:
        text = (n["text"] + " " + n["desc"]).lower()
        lovit = any(s.lower() in text for s in sec.get("texte", []) if s)
        if not lovit:
            lovit = any(re.search(d, n["desc"], re.I) for d in sec.get("descrieri", []) if d)
        if not lovit:
            continue
        x1, y1, x2, y2 = n["box"]
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(img.width, x2), min(img.height, y2)
        if x2 <= x1 or y2 <= y1:
            continue
        zona = img.crop((x1, y1, x2, y2)).filter(ImageFilter.GaussianBlur(14))
        img.paste(zona, (x1, y1))
        acoperite += 1
    return acoperite


def incercuieste(img, box, gros=6):
    d = ImageDraw.Draw(img)
    x1, y1, x2, y2 = box
    pad = 10
    d.rounded_rectangle([x1 - pad, y1 - pad, x2 + pad, y2 + pad], radius=18, outline=ROSU, width=gros)
    return img


def salveaza(img, cale):
    scala = LATIME / img.width
    mic = img.resize((LATIME, int(round(img.height * scala))), Image.LANCZOS)
    mic.save(cale, "WEBP", quality=82, method=6)
    return mic.size


def redare(idg, doar=None):
    dosar = os.path.join(GHIDURI, idg)
    flux_cale = os.path.join(dosar, "flux.json")
    if not os.path.exists(flux_cale):
        print("Nu exista", flux_cale, file=sys.stderr)
        print(1)
        return 1
    with open(flux_cale, encoding="utf-8") as f:
        F = json.load(f)
    sec = secrete()
    probleme = 0
    # La o redare PARTIALA (--doar) pastram provenienta pasilor pe care nu-i refacem:
    # altfel SURSE.json s-ar goli si n-am mai sti de unde vin capturile ramase pe disc.
    surse_vechi = {}
    cale_surse = os.path.join(dosar, "SURSE.json")
    if os.path.exists(cale_surse):
        try:
            with open(cale_surse, encoding="utf-8") as f:
                surse_vechi = {s["fisier"]: s for s in json.load(f)}
        except (ValueError, KeyError, TypeError):
            surse_vechi = {}
    surse = []
    pasi_site = []

    if not T.pornit():
        print("Telefonul emulat nu e pornit (ghid_telefon.py start)", file=sys.stderr)
        print(1)
        return 1

    # de la zero: inchide aplicatia si porneste-o curat
    if F.get("pachet"):
        T.adb("shell", "am", "force-stop", F["pachet"])
        T.adb("shell", "monkey", "-p", F["pachet"], "-c", "android.intent.category.LAUNCHER", "1")
        time.sleep(4)

    def fa_actiunile(P, i):
        """Miscarile pasului, la rand. Intoarce True daca una a esuat (redarea se opreste).

        Un pas poate avea o singura miscare (`actiune`) sau mai multe (`actiuni`) - de
        pilda „apasa bifa, apoi atinge in afara casetei ca sa dispara meniul de selectie”,
        ca sa nu iasa in poza urmatoare ce nu trebuie."""
        nonlocal probleme
        actiuni = P.get("actiuni") or ([P["actiune"]] if P.get("actiune") else [])
        for act in actiuni:
            tip = act["tip"]
            if tip == "tap-text":
                # unele butoane (ex. „+” din Documente) NU sunt marcate ca atingibile
                # in arborele de interfata; `"oriunde": true` le cauta oricum, dupa text.
                if not T.tap_text(act["ce"], doar_clic=not act.get("oriunde")):
                    print("PASUL %d: nu pot atinge „%s”" % (i, act["ce"]), file=sys.stderr)
                    probleme += 1
                    return True
            elif tip == "dublu-tap-text":
                n = T.caută(T.noduri(ecran_xml()), act["ce"], not act.get("oriunde"))
                if not n:
                    print("PASUL %d: nu gasesc „%s” ca sa-l ating de doua ori" % (i, act["ce"]),
                          file=sys.stderr)
                    probleme += 1
                    return True
                T.dublu_tap(*n["centru"])
            elif tip == "tap":
                T.tap(act["x"], act["y"])
            elif tip == "aplicatie":
                # un ghid poate trece prin mai multe aplicatii (ex. Setari -> Drive)
                T.adb("shell", "monkey", "-p", act["ce"],
                      "-c", "android.intent.category.LAUNCHER", "1")
            elif tip == "dublu-tap":
                # pe coordonate: celulele din Foi de calcul nu sunt in arborele de interfata
                T.dublu_tap(act["x"], act["y"])
            elif tip == "text":
                # `"goleste": true` sterge ce e deja in camp (ex. numele pus automat
                # de aplicatie in fereastra de redenumire) inainte de a scrie.
                if act.get("goleste"):
                    T.adb("shell", "input", "keyevent", "KEYCODE_MOVE_END")
                    for _ in range(act.get("cat", 60)):
                        T.adb("shell", "input", "keyevent", "67")
                T.scrie(act["ce"])
            elif tip == "key":
                T.adb("shell", "input", "keyevent", act["ce"])
            elif tip == "swipe":
                T.adb("shell", "input", "swipe", *[str(v) for v in act["ce"]])
            elif tip == "pauza":
                pass
            else:
                print("PASUL %d: nu stiu miscarea „%s”" % (i, tip), file=sys.stderr)
                probleme += 1
                return True
            time.sleep(act.get("dupa", P.get("dupa", 1.6)))
        return False

    neverificati = []
    for i, P in enumerate(F["pasi"], start=1):
        if not P.get("asteapta"):
            # Unele ecrane (editorul din Prezentari) nu-si expun deloc interfata, deci
            # pasul nu poate fi verificat inainte de captura. E o alegere, nu un accident:
            # o spunem cu voce tare, ca sa nu creada nimeni ca ghidul e verificat integral.
            neverificati.append(i)
        nume = "%02d-%s.webp" % (i, P.get("fisier") or re.sub(r"[^a-z0-9]+", "-", P["t"].lower())[:28].strip("-"))
        cale = os.path.join(dosar, nume)
        # `--doar` sare PESTE CAPTURA, nu peste drum: mișcările se fac oricum, altfel
        # aplicația n-ar ajunge niciodată la ecranul pasului pe care vrem să-l refacem.
        sari = bool(doar) and i not in doar
        ns = asteapta_text(P.get("asteapta", ""), P.get("rabdare", 25))
        if ns is None:
            print("PASUL %d: ecranul nu arata „%s”" % (i, P.get("asteapta")), file=sys.stderr)
            probleme += 1
            break
        if sari:
            pasi_site.append((P, nume, None))
            if nume in surse_vechi:
                surse.append(surse_vechi[nume])
            if fa_actiunile(P, i):
                break
            continue
        img = captura_bruta()
        acoperite = acopera(img, ns, sec)
        if P.get("incercuieste"):
            tinta = P["incercuieste"]
            n = T.caută(ns, tinta) if isinstance(tinta, str) else None
            if isinstance(tinta, list):
                incercuieste(img, tinta)
            elif n:
                incercuieste(img, n["box"])
            else:
                print("PASUL %d: nu gasesc „%s” ca sa-l incercuiesc" % (i, tinta), file=sys.stderr)
                probleme += 1
        dim = salveaza(img, cale)
        surse.append({
            "fisier": nume, "ce": P["t"], "sursa": "Android 14 emulat (AVD %s), %s" % (T.AVD, F["app"]),
            "data": date.today().isoformat(), "date_acoperite": acoperite,
        })
        pasi_site.append((P, nume, dim))
        print("  %2d. %-34s %s  (acoperite: %d)" % (i, P["t"][:34], dim, acoperite))

        if fa_actiunile(P, i):
            break

    scrie_pasi_js(idg, F, pasi_site, dosar)
    with open(os.path.join(dosar, "SURSE.json"), "w", encoding="utf-8") as f:
        json.dump(surse, f, ensure_ascii=False, indent=1)
    if neverificati:
        print("ATENTIE: pasi FARA verificare de ecran (fara `asteapta`): %s"
              % ", ".join(str(x) for x in neverificati))
    print("PROBLEME:", probleme)
    print(probleme)
    return 0 if probleme == 0 else 1


def doar_textele(idg):
    """Reface pasi.js din flux.json si din capturile EXISTENTE, fara telefon.

    De ce: o corectura de text (o formulare, numele englezesc al unui buton) nu are
    de ce sa ceara o redare intreaga pe telefonul emulat. Pozele raman cele de pe
    disc; se schimba doar ce citeste elevul.
    """
    dosar = os.path.join(GHIDURI, idg)
    flux_cale = os.path.join(dosar, "flux.json")
    if not os.path.exists(flux_cale):
        print("Nu exista", flux_cale, file=sys.stderr)
        print(1)
        return 1
    with open(flux_cale, encoding="utf-8") as f:
        F = json.load(f)
    lipsa = 0
    pasi_site = []
    for i, P in enumerate(F["pasi"], start=1):
        nume = "%02d-%s.webp" % (i, P.get("fisier") or re.sub(r"[^a-z0-9]+", "-", P["t"].lower())[:28].strip("-"))
        if not os.path.exists(os.path.join(dosar, nume)):
            print("PASUL %d: lipseste captura %s" % (i, nume), file=sys.stderr)
            lipsa += 1
        pasi_site.append((P, nume, None))
    if lipsa:
        print("PROBLEME:", lipsa)
        print(lipsa)
        return 1
    scrie_pasi_js(idg, F, pasi_site, dosar)
    print("  %s: %d pasi, textele refacute din flux.json (pozele neatinse)" % (idg, len(pasi_site)))
    print("PROBLEME: 0")
    print(0)
    return 0


def scrie_pasi_js(idg, F, pasi_site, dosar):
    """Fisierul pe care il incarca jocul: JocMotor.ghid('<id>', {...})."""
    out = []
    for P, nume, dim in pasi_site:
        if dim is None:
            cale_img = os.path.join(dosar, nume)
            if os.path.exists(cale_img):
                with Image.open(cale_img) as im:
                    dim = im.size
            else:
                dim = (LATIME, 780)
        pas = {"img": "../_ghiduri/%s/%s" % (idg, nume), "w": dim[0], "h": dim[1], "t": P["t"]}
        if P.get("d"):
            pas["d"] = P["d"]
        if P.get("atentie"):
            pas["atentie"] = P["atentie"]
        # textul alternativ e CITIT cu voce de cititoarele de ecran: fara etichete HTML
        pas["alt"] = P.get("alt") or (re.sub(r"<[^>]+>", "", P["t"]) + " — ecranul aplicației " + F["app"])
        out.append(pas)
    cfg = {"app": F["app"], "titlu": F["titlu"], "buton": F.get("buton"), "intro": F.get("intro"), "pasi": out}
    cfg = {k: v for k, v in cfg.items() if v is not None}
    txt = ("/* GENERAT de _motor\\ghid_capturi.py — nu edita de mana.\n"
           "   Capturile vin de pe un Android emulat; pasii din flux.json. */\n"
           "JocMotor.ghid(%s, %s);\n" % (json.dumps(idg, ensure_ascii=False),
                                         json.dumps(cfg, ensure_ascii=False, indent=1)))
    with open(os.path.join(dosar, "pasi.js"), "w", encoding="utf-8") as f:
        f.write(txt)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("ghid", help="id-ul ghidului (dosarul din _ghiduri)")
    p.add_argument("--doar", help="doar pasii astia, ex. 3,4,5")
    p.add_argument("--doar-textele", action="store_true",
                   help="reface DOAR fisierul pentru sit (pasi.js) din flux.json si din "
                        "capturile de pe disc, FARA telefon - pentru corecturi de text")
    a = p.parse_args()
    if a.doar_textele:
        return doar_textele(a.ghid)
    doar = set(int(x) for x in a.doar.split(",")) if a.doar else None
    return redare(a.ghid, doar)


if __name__ == "__main__":
    sys.exit(main())
