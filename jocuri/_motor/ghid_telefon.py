#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Telefonul emulat: pornire, explorare, capturi pentru ghidurile pas-cu-pas.

De ce exista: provocarile jocurilor cer documente reale (document, registru,
prezentare). Multi elevi au doar telefon. Ghidul le arata EXACT ecranul lor,
deci capturile se fac pe un Android real emulat, nu desenate.

Doua moduri de lucru:
  1. EXPLORARE (om/agent): `start`, `ui`, `shot`, `tap`, `tap-text`, `text`, `key`
     - te uiti la ecran, afli ce se atinge, notezi pasul in fluxul JSON.
  2. REDARE (mecanica): `replay <flux.json>` reface acelasi drum de la zero si
     scoate capturile finale, numerotate, cu proveninta in SURSE.json.
     Fiecare pas isi verifica ecranul (`asteapta`) inainte de captura: daca
     ecranul nu e cel asteptat, redarea SE OPRESTE - nu produce un ghid fals.

Datele personale: `--ascunde` sterge din captura orice nod din arborele de
interfata al carui text contine numele/adresa contului (lista din
`ghid_secrete.json`), plus pozele de profil declarate ca zone fixe.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
import xml.etree.ElementTree as ET

SDK = os.environ.get("ANDROID_SDK", r"C:\Android\sdk")
ADB = os.path.join(SDK, "platform-tools", "adb.exe")
EMULATOR = os.path.join(SDK, "emulator", "emulator.exe")
AVD = "ghid_telefon"
AICI = os.path.dirname(os.path.abspath(__file__))
GHIDURI = os.path.join(os.path.dirname(AICI), "_ghiduri")
# lista de acoperit (nume, adresa de mail) sta IN AFARA depozitului public
SECRETE = os.environ.get("GHID_SECRETE", "C:/00/AI_0/data/ghid_secrete.json")


def rulează(args, **kw):
    kw.setdefault("capture_output", True)
    kw.setdefault("text", True)
    if kw.get("text"):          # cu `encoding` pus, subprocess trece in mod TEXT
        kw.setdefault("encoding", "utf-8")
        kw.setdefault("errors", "replace")
    return subprocess.run(args, **kw)


def adb(*args, **kw):
    return rulează([ADB] + list(args), **kw)


# ---------------------------------------------------------------- pornire/oprire
def pornit():
    r = adb("shell", "getprop", "sys.boot_completed")
    return r.returncode == 0 and r.stdout.strip() == "1"


def start(fereastra=False, timeout=300):
    if pornit():
        print("telefonul emulat e deja pornit")
        return 0
    cmd = [EMULATOR, "-avd", AVD, "-no-boot-anim", "-no-snapshot-save"]
    if not fereastra:
        cmd.append("-no-window")
        cmd += ["-gpu", "swiftshader_indirect"]
    subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    t0 = time.time()
    while time.time() - t0 < timeout:
        if pornit():
            # asteapta si lansatorul, altfel primele capturi prind ecranul gol
            time.sleep(6)
            adb("shell", "settings", "put", "global", "window_animation_scale", "0")
            adb("shell", "settings", "put", "global", "transition_animation_scale", "0")
            adb("shell", "settings", "put", "global", "animator_duration_scale", "0")
            print("pornit in %d s" % int(time.time() - t0))
            return 0
        time.sleep(3)
    print("NU a pornit in %d s" % timeout, file=sys.stderr)
    return 1


def stop():
    adb("emu", "kill")
    print("oprit")
    return 0


# ---------------------------------------------------------------- interfata
def dump_ui():
    """Arborele de interfata, ca XML (text)."""
    adb("shell", "rm", "-f", "/sdcard/win.xml")
    r = adb("shell", "uiautomator", "dump", "/sdcard/win.xml")
    if "dumped" not in (r.stdout or "") + (r.stderr or ""):
        # unele ecrane refuza dump-ul cat timp se animeaza
        time.sleep(1.5)
        adb("shell", "uiautomator", "dump", "/sdcard/win.xml")
    out = adb("exec-out", "cat", "/sdcard/win.xml", capture_output=True, text=False)
    return out.stdout.decode("utf-8", "replace")


def noduri(xml_text):
    """Toate nodurile cu text/descriere, cu dreptunghiul lor."""
    rez = []
    try:
        rad = ET.fromstring(xml_text)
    except ET.ParseError:
        return rez
    for n in rad.iter("node"):
        t = (n.get("text") or "").strip()
        d = (n.get("content-desc") or "").strip()
        if not t and not d:
            continue
        m = re.match(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]", n.get("bounds") or "")
        if not m:
            continue
        x1, y1, x2, y2 = (int(v) for v in m.groups())
        rez.append({
            "text": t, "desc": d, "clasa": n.get("class", ""),
            "clic": n.get("clickable") == "true",
            "box": [x1, y1, x2, y2],
            "centru": [(x1 + x2) // 2, (y1 + y2) // 2],
        })
    return rez


def caută(nod_list, tinta, doar_clic=False):
    """Primul nod al carui text sau descriere contine tinta (fara diacritice, fara majuscule)."""
    def plat(s):
        s = s.lower()
        for a, b in (("ă", "a"), ("â", "a"), ("î", "i"), ("ș", "s"), ("ş", "s"), ("ț", "t"), ("ţ", "t")):
            s = s.replace(a, b)
        return s
    t = plat(tinta)
    for n in nod_list:
        if doar_clic and not n["clic"]:
            continue
        if t in plat(n["text"]) or t in plat(n["desc"]):
            return n
    return None


def cmd_ui(args):
    ns = noduri(dump_ui())
    for n in ns:
        if args.doar_clic and not n["clic"]:
            continue
        eticheta = n["text"] or ("«" + n["desc"] + "»")
        print("%-46s  %s  %s" % (eticheta[:46], n["centru"], n["clasa"].split(".")[-1]))
    print("NODURI: %d" % len(ns))
    return 0


# ---------------------------------------------------------------- gesturi
def tap(x, y):
    adb("shell", "input", "tap", str(x), str(y))
    time.sleep(0.8)


def dublu_tap(x, y):
    """Doua atingeri in aceeasi comanda: in Prezentari, casetele se editeaza numai asa.
    Doua apeluri `tap` separate sunt prea departate in timp si Androidul nu le leaga."""
    adb("shell", "input tap %d %d; input tap %d %d" % (x, y, x, y))
    time.sleep(0.9)


def tap_text(tinta, doar_clic=True):
    n = caută(noduri(dump_ui()), tinta, doar_clic)
    if not n:
        return None
    tap(*n["centru"])
    return n


def scrie(txt):
    """Scrie textul in campul cu cursorul, bucata cu bucata.

    Doua capcane platite:
    - `adb shell input text` trece prin INTERPRETORUL de comenzi al telefonului, deci
      paranteze si alte semne din formule (`=(B2+C2)/2`) sunt inghitite si textul nu
      ajunge niciodata in celula. De aceea bucata se trimite intre apostrofuri.
    - spatiul nu trece prin `input text`, il dam ca tasta - dar NU si dupa ultima
      bucata, altfel fiecare celula ar ramane cu un spatiu in coada.
    - diacriticele NU trec deloc (keymap US): textul de pus in capturi se alege
      corect in romana FARA diacritice.
    """
    bucati = [b for b in txt.split(" ")]
    for k, bucata in enumerate(bucati):
        if bucata:
            adb("shell", "input", "text", "'" + bucata.replace("'", "") + "'")
        if k < len(bucati) - 1:
            adb("shell", "input", "keyevent", "62")  # SPACE
        time.sleep(0.2)


def cmd_shot(args):
    out = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    r = adb("exec-out", "screencap", "-p", capture_output=True, text=False)
    with open(out, "wb") as f:
        f.write(r.stdout)
    print(out, os.path.getsize(out), "octeti")
    return 0


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    s = p.add_subparsers(dest="cmd", required=True)

    ps = s.add_parser("start", help="porneste telefonul emulat")
    ps.add_argument("--fereastra", action="store_true", help="arata fereastra (implicit: ascuns)")
    s.add_parser("stop", help="opreste telefonul emulat")
    s.add_parser("stare", help="pornit sau nu")

    pu = s.add_parser("ui", help="ce se vede pe ecran (noduri cu text)")
    pu.add_argument("--doar-clic", action="store_true", help="doar ce se poate atinge")

    psh = s.add_parser("shot", help="captura de ecran")
    psh.add_argument("out")

    pt = s.add_parser("tap", help="atinge la coordonate")
    pt.add_argument("x", type=int)
    pt.add_argument("y", type=int)

    ptt = s.add_parser("tap-text", help="atinge elementul cu textul dat")
    ptt.add_argument("text")

    px = s.add_parser("text", help="scrie text")
    px.add_argument("text")

    pk = s.add_parser("key", help="tasta (ex. KEYCODE_BACK, KEYCODE_ENTER)")
    pk.add_argument("key")

    a = p.parse_args()
    if a.cmd == "start":
        return start(a.fereastra)
    if a.cmd == "stop":
        return stop()
    if a.cmd == "stare":
        print("PORNIT" if pornit() else "OPRIT")
        return 0
    if a.cmd == "ui":
        return cmd_ui(a)
    if a.cmd == "shot":
        return cmd_shot(a)
    if a.cmd == "tap":
        tap(a.x, a.y)
        return 0
    if a.cmd == "tap-text":
        n = tap_text(a.text)
        print("atins:", n["text"] or n["desc"], n["centru"]) if n else print("NU am gasit:", a.text)
        return 0 if n else 1
    if a.cmd == "text":
        scrie(a.text)
        return 0
    if a.cmd == "key":
        adb("shell", "input", "keyevent", a.key)
        return 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
