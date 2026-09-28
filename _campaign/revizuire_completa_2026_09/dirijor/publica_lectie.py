# Publicarea unei lecții, cu TOATE porțile și fără scurtături: comite și împinge DOAR dacă fiecare poartă trece.
# (28.09.2026: un [PICAT] al porții test_joc a trecut neobservat într-o comandă înlănțuită; scriptul ăsta nu mai lasă asta.)
#
# Folosire:
#   python publica_lectie.py vii/m1-l01                 # o lecție
#   python publica_lectie.py vi/m2-l08 vi/m2-l09        # mai multe, publicate împreună
#   python publica_lectie.py vii/m1-l01 --fara-push     # toate porțile + commit, fără push
# Extensiile noi din lectii/_sim/ folosite de lecție se adaugă singure (din <script src>).
# Poarta test_joc, dacă pică fără nicio întrebare jucată (pagina n-a pornit sub încărcare), se reia o dată singură.
# Ultima linie = 0 dacă s-a publicat și s-a verificat live; altfel numărul porților picate.
import re
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
R = Path(r"C:\00\Projects\LearningHub")
C = R / "_campaign" / "revizuire_completa_2026_09"
PY = sys.executable
lectii = [a.strip("/").replace("\\", "/") for a in sys.argv[1:] if not a.startswith("--")]
fara_push = "--fara-push" in sys.argv
if not lectii:
    print("folosire: publica_lectie.py <clasa>/<modul>-lNN [...] [--fara-push]")
    sys.exit(2)


def rul(cmd, timeout=900):
    # Un timeout e o poartă picată, nu o prăbușire a scriptului (28.09: build-ul a depășit 900 s sub încărcare).
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=timeout)
    except subprocess.TimeoutExpired:
        return 124, f"depășit timpul ({timeout} s)"
    return p.returncode, (p.stdout or "") + (p.stderr or "")


def ultima(txt):
    linii = [x.strip() for x in txt.splitlines() if x.strip()]
    return linii[-1] if linii else ""


picate = []


def poarta(nume, ok, detaliu):
    print(f"{'OK    ' if ok else 'PICAT '} {nume}: {detaliu}")
    if not ok:
        picate.append(nume)


# 0. dosarele există
for l in lectii:
    if not (R / "lectii" / l / "index.html").exists():
        print(f"lipsește lectii/{l}/index.html")
        sys.exit(2)

# 1. marcaj în plan.json + build + linkuri + plan
cod, out = rul([PY, str(C / "dirijor" / "dirijor_publica.py")] + lectii)
poarta("plan.json (publicat + insignă)", cod == 0 and "negăsite: []" in out, ultima(out))
for nume, cmd in [("build_lectii", [PY, str(R / "lectii/_build/build_lectii.py")]),
                  ("verifica_linkuri", [PY, str(R / "lectii/_build/verifica_linkuri.py")]),
                  ("plan_din_calendar --verifica", [PY, str(R / "lectii/_build/plan_din_calendar.py"), "--verifica"]),
                  ("curata_metadate (fișiere Office)", [PY, str(C / "verificare_lectii/curata_metadate.py")]),
                  ("date personale (regula 27)", [PY, r"C:\00\AI_0\tools\learninghub_date_personale.py"])]:
    # build_lectii rulează test_joc pe FIECARE lecție publicată (29+): sub încărcare trece de 15 min
    cod, out = rul(cmd, timeout=3600 if nume == "build_lectii" else 900)
    poarta(nume, ultima(out) == "0", ultima(out))

# 2. porțile pe fiecare lecție + extensiile _sim
extensii = set()
for l in lectii:
    cls, dos = l.split("/")
    for incercare in (1, 2):
        cod, out = rul([PY, str(R / "jocuri/_motor/test_joc.py"), "--dir", str(R / "lectii" / cls), dos])
        m = re.search(r"\[(TRECUT|PICAT)\][^\n]*întrebări jucate: (\S+)", out)
        trecut = bool(m and m.group(1) == "TRECUT")
        if trecut or not (m and m.group(2) == "None") or incercare == 2:
            break
        print(f"   test_joc {l}: pagina n-a pornit (sub încărcare?) — reiau o dată")
    poarta(f"test_joc {l}", trecut, m.group(0) if m else ultima(out))
    cod, out = rul([PY, str(C / "verificare_lectii/verifica_lectie.py"), str(R / "lectii" / l / "index.html"), "--fara-t1"])
    poarta(f"verifica_lectie {l}", ultima(out) == "0", ultima(out))
    html = (R / "lectii" / l / "index.html").read_text(encoding="utf-8")
    for src in re.findall(r'src="(?:\.\./)+_sim/([^"]+\.js)"', html):
        extensii.add(f"lectii/_sim/{src}")

# 2b. o componentă comună deja publicată NU pleacă modificată odată cu o lecție: trece prin poarta de lansare
for e in sorted(extensii):
    urmarit = rul(["git", "-C", str(R), "ls-files", "--error-unmatch", "--", e])[0] == 0
    if urmarit and rul(["git", "-C", str(R), "diff", "--quiet", "HEAD", "--", e])[0] != 0:
        poarta(f"componentă comună neschimbată {e}", False,
               "modificată pe disc față de ce e publicat — o schimbare într-un fișier comun se publică separat, după poarta de lansare")

if picate:
    print(f"NU public: {len(picate)} porți picate: {picate}")
    print("(plan.json a fost deja marcat — readu-l cu: git -C C:/00/Projects/LearningHub checkout -- lectii/plan.json lectii/index.html lectii/*/index.html)")
    print(len(picate))
    sys.exit(1)

# 3. commit DOAR pe fișierele numite (alte sesiuni lucrează în același depozit)
clase = sorted({l.split("/")[0] for l in lectii})
cai = [f"lectii/{l}/" for l in lectii] + sorted(extensii) + ["lectii/index.html", "lectii/plan.json"] + [f"lectii/{c}/index.html" for c in clase]
cod, out = rul(["git", "-C", str(R), "add", "--"] + cai)
poarta("git add (doar fișierele numite)", cod == 0, ", ".join(cai[:6]) + ("…" if len(cai) > 6 else ""))
mesaj = (f"Lecții: {', '.join(l.upper() for l in lectii)} publicate (insigna „verificat parțial”) prin dirijor/publica_lectie.py — "
         "toate porțile trecute (plan, build, linkuri, metadate, date personale, test_joc, verifica_lectie)\n\n"
         "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>")
cod, out = rul(["git", "-C", str(R), "commit", "-q", "-m", mesaj])
poarta("git commit", cod == 0, ultima(out) or "ok")
if picate or fara_push:
    print(len(picate))
    sys.exit(1 if picate else 0)
env_push = ["cmd", "/c", "set GIT_TERMINAL_PROMPT=0&& set GCM_INTERACTIVE=never&& git -C " + str(R) + " push -q"]
cod, out = rul(env_push, timeout=120)
poarta("git push", cod == 0, ultima(out) or "ok")

# 4. verificare LIVE: marcajele + proba de fum
marcaje = []
for l in lectii:
    cls, dos = l.split("/")
    marcaje.append(f"/lectii/{l}/|lectie_{cls}_{dos.replace('-', '_')}")
for e in sorted(extensii):
    marcaje.append(f"/{e}|function")
cod, out = rul([PY, str(C / "dirijor/dirijor_verifica_live.py")] + marcaje, timeout=600)
poarta("marcaje LIVE", ultima(out) == "0", ultima(out))
cod, out = rul([PY, str(C / "verificare_lectii/fum_live.py")] + [f"/lectii/{l}/" for l in lectii], timeout=600)
poarta("fum LIVE (390 + 1280, 0 erori)", ultima(out) == "0", ultima(out))
print(f"{'PUBLICAT și verificat live' if not picate else 'PROBLEME după publicare'}: {lectii}")
print(len(picate))
