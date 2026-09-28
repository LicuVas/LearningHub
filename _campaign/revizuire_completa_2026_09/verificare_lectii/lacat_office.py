# Lacăt pentru aplicațiile Office care rulează O SINGURĂ instanță (PowerPoint) când mai mulți autori probează în paralel.
# Folosire:
#   python lacat_office.py ia powerpoint --cine VI-2      (așteaptă până e liber, apoi îl ia; exit 0 = e al tău)
#   python lacat_office.py elibereaza powerpoint --cine VI-2
#   python lacat_office.py reinnoieste powerpoint --cine VI-2   (la fiecare rundă: lacătul expiră după 60 min fără reînnoire)
#   python lacat_office.py stare
# Un lacăt nereînnoit de 60 de minute e socotit abandonat și se poate lua (28.09: 30 min era prea puțin pentru probele lungi).
import os
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
DOSAR = Path(__file__).resolve().parent / "_lacate"
VECHIME_MAX = 60 * 60


def cale(app):
    return DOSAR / f"{app.lower()}.lacat"


def ia(app, cine, asteapta_max=45 * 60):
    DOSAR.mkdir(exist_ok=True)
    f = cale(app)
    start = time.time()
    while True:
        try:
            fd = os.open(str(f), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            os.write(fd, f"{cine}|{time.strftime('%H:%M:%S')}|{time.time():.0f}".encode("utf-8"))
            os.close(fd)
            print(f"LUAT: {app} de {cine}")
            return 0
        except FileExistsError:
            try:
                continut = f.read_text(encoding="utf-8")
                t = float(continut.split("|")[2])
            except (OSError, IndexError, ValueError):
                continut, t = "?", 0.0
            if time.time() - t > VECHIME_MAX:
                print(f"lacăt abandonat ({continut}), îl scot")
                f.unlink(missing_ok=True)
                continue
            if time.time() - start > asteapta_max:
                print(f"OCUPAT încă după {asteapta_max // 60} min: {continut}")
                return 1
            time.sleep(10)


def elibereaza(app, cine):
    f = cale(app)
    if not f.exists():
        print(f"{app}: nu era luat")
        return 0
    continut = f.read_text(encoding="utf-8")
    if not continut.startswith(cine + "|"):
        print(f"{app}: e al altcuiva ({continut}), nu-l eliberez")
        return 1
    f.unlink()
    print(f"ELIBERAT: {app} de {cine}")
    return 0


def reinnoieste(app, cine):
    f = cale(app)
    if not f.exists():
        print(f"{app}: nu e luat; îl iau")
        return ia(app, cine)
    continut = f.read_text(encoding="utf-8")
    if not continut.startswith(cine + "|"):
        print(f"{app}: e al altcuiva ({continut}), nu-l reînnoiesc")
        return 1
    f.write_text(f"{cine}|{time.strftime('%H:%M:%S')}|{time.time():.0f}", encoding="utf-8")
    print(f"REÎNNOIT: {app} de {cine}")
    return 0


def stare():
    DOSAR.mkdir(exist_ok=True)
    gasit = list(DOSAR.glob("*.lacat"))
    for f in gasit:
        print(f"{f.stem}: {f.read_text(encoding='utf-8')}")
    if not gasit:
        print("niciun lacăt")
    return 0


if __name__ == "__main__":
    a = sys.argv[1:]
    cine = a[a.index("--cine") + 1] if "--cine" in a else "?"
    if a and a[0] == "ia" and len(a) > 1:
        sys.exit(ia(a[1], cine))
    if a and a[0] == "elibereaza" and len(a) > 1:
        sys.exit(elibereaza(a[1], cine))
    if a and a[0] == "reinnoieste" and len(a) > 1:
        sys.exit(reinnoieste(a[1], cine))
    if a and a[0] == "stare":
        sys.exit(stare())
    print(__doc__ or "folosire: ia|elibereaza <app> --cine X | stare")
    sys.exit(2)
