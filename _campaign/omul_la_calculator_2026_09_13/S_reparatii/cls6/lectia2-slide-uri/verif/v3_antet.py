import re, io, sys
sys.stdout.reconfigure(encoding="utf-8")
F = r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\F_evaluari\cls6\lectia2-slide-uri\surse"
for fn, pats in [(r"raw\numere_ro.txt", [r"Aplicare|aplică|Se aplic", r"Număr diapozitiv|Numărul diapozitivului"]),
                 (r"raw\numere_en.txt", [r"Apply to All"]),
                 (r"raw\teme_ro.txt", [r"Bază", r"Integrală"]),
                 (r"raw\master_ro.txt", [r"Casetă text|casetă text"])]:
    t = io.open(F + "\\" + fn, encoding="utf-8", errors="replace").read()
    for p in pats:
        ms = [m.start() for m in re.finditer(p, t)]
        print(f"--- {fn} :: {p} -> {len(ms)}")
        for s in ms[:3]:
            print("   ", t[max(0, s - 140):s + 140].replace("\n", " "))
