# Verificarea publicării pe live: fiecare adresă trebuie să conțină un text anume (200 singur nu dovedește nimic,
# situl întoarce prima pagină la orice adresă). Reîncearcă până la 6 minute (Cloudflare Pages construiește ~1-2 min).
import sys
import time
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")
BAZA = "https://learninghub-8z6.pages.dev"
TINTE = [
    ("/lectii/", "Lecții"),
    ("/lectii/v/", "verificat parțial"),
    ("/lectii/vii/", "verificat parțial"),
    ("/lectii/v/m1-l04/", "lectie_v_m1_l04"),
    ("/lectii/vi/m1-l04/", "lectie_vi_m1_l04"),
    ("/lectii/vii/m1-l04/", "lectie_vii_m1_l04"),
    ("/lectii/viii/m1-l04/", "lectie_viii_m1_l04"),
    ("/hub/", "LECTII:START"),
    ("/content/tic/cls8/m2-formule-functii/lectia1-introducere-formule.html", "REVIZIE:START"),
    ("/jocuri/_motor/motor.js", "aplicatieReala"),
]


if len(sys.argv) > 1:  # ținte date în linia de comandă: "cale|marcaj" ...
    TINTE = [tuple(a.split("|", 1)) for a in sys.argv[1:]]


def ia(url):
    req = urllib.request.Request(url, headers={"Cache-Control": "no-cache",
                                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) verificare-dirijor"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode("utf-8", errors="replace")


start = time.time()
ramase = list(TINTE)
while ramase and time.time() - start < 360:
    urm = []
    for cale, marcaj in ramase:
        try:
            st, corp = ia(BAZA + cale)
            if marcaj in corp:
                print(f"OK   {cale}  ({st}, conține «{marcaj}»)")
            else:
                urm.append((cale, marcaj))
        except Exception as e:
            print(f"EROARE {cale}: {type(e).__name__}: {e}")
            urm.append((cale, marcaj))
    ramase = urm
    if ramase:
        time.sleep(20)
for cale, marcaj in ramase:
    print(f"LIPSĂ {cale}  (nu conține «{marcaj}»)")
print(f"verificate {len(TINTE)}, lipsă {len(ramase)}, după {int(time.time() - start)} s")
print(len(ramase))
