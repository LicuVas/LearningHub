import re, io, sys
sys.stdout.reconfigure(encoding="utf-8")
F = r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\F_evaluari\cls6\lectia2-slide-uri\surse\raw"
def ctx(fn, pats, w=160):
    t = io.open(F + "\\" + fn, encoding="utf-8", errors="replace").read()
    for p in pats:
        ms = [m.start() for m in re.finditer(p, t)]
        print(f"--- {fn} :: {p} -> {len(ms)}")
        for s in ms[:4]:
            print("   ", t[max(0, s - w):s + w].replace("\n", " "))
ctx("fundal_en.txt", [r"for the web", r"Apply to All", r"gradient"])
ctx("fundal_ro.txt", [r"pentru web", r"Se aplică", r"toate", r"gradient"])
ctx("master_ro.txt", [r"fila Vizualizare", r"Închidere vizualizare"])
