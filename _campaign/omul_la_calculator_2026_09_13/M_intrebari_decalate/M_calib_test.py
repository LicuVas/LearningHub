import M_scan as m
from pathlib import Path

fisiere = [
    r"C:\00\Projects\LearningHub\content\tic\cls8\m1-excel-fundamente\lectia1-interfata.html",
    r"C:\00\Projects\LearningHub\content\tic\cls6\m1-prezentari\lectia2-slide-uri.html",
    r"C:\00\Projects\LearningHub\content\tic\cls5\m1-sisteme\lectia1-calculator.html",
]
for f in fisiere:
    atomi = m.parseaza_lectie(Path(f))
    print(f, "-> atomi:", len(atomi))
    et = m.eticheteaza(atomi)
    for e in et:
        print(" ", e)
