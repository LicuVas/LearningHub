"""Dovada de publicare: fiecare din cele 25 de lectii M1 + JS-ul comun de pe site = continutul din git HEAD
(dupa normalizarea capetelor de linie). 200 + index.html NU e dovada pe Cloudflare Pages - comparam continutul."""
import random
import subprocess
import sys
import urllib.request

BASE = "https://learninghub-8z6.pages.dev/"
SITE = r"C:\00\Projects\LearningHub"
MOD = {"cls5": "m1-sisteme", "cls6": "m1-prezentari", "cls7": "m1-word-fundamente", "cls8": "m1-excel-fundamente"}


def head(rel):
    return subprocess.run(["git", "-C", SITE, "show", f"HEAD:{rel}"], capture_output=True).stdout.replace(b"\r\n", b"\n")


rels = subprocess.run(["git", "-C", SITE, "ls-files", *[f"content/tic/{c}/{m}/lectia*.html" for c, m in MOD.items()]],
                      capture_output=True, text=True).stdout.split()
rels += ["assets/js/atomic-learning.js", "assets/js/practice-simple.js", "assets/js/user-system.js"]
bad = 0
for rel in rels:
    req = urllib.request.Request(BASE + rel + f"?v={random.randint(1, 10**9)}", headers={"User-Agent": "Mozilla/5.0"})
    try:
        live = urllib.request.urlopen(req, timeout=30).read().replace(b"\r\n", b"\n")
    except Exception as e:  # noqa: BLE001
        live = f"EROARE {e}".encode()
    ok = live.strip() == head(rel).strip()
    bad += not ok
    print(f"{'OK  ' if ok else 'DIF '} {rel} ({len(live)} octeti live)")
print(f"\n{len(rels) - bad}/{len(rels)} identice cu git HEAD")
sys.exit(1 if bad else 0)
