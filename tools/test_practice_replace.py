# -*- coding: utf-8 -*-
"""Control pentru practice_io.py replace: inlocuieste, nu strica restul paginii."""
import io, os, sys, json, shutil, subprocess
sys.path.insert(0, r"C:\00\Projects\LearningHub\tools")
import practice_io as P

SRC = r"C:\00\Projects\LearningHub\content\liceu\umanist\cls10\m2-calcul-tabelar\lectia1-tabel-formule.html"
TMP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ctrl_lectia1.html")
JSN = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ctrl_rez.json")
shutil.copyfile(SRC, TMP)

inainte = io.open(TMP, encoding="utf-8").read()
d0 = P.dump(TMP)
assert all(x["are_rezolvare"] for x in d0), "controlul presupune ca toate au deja rezolvare"
print("inainte: %d exercitii, toate cu rezolvare, %d octeti" % (len(d0), len(inainte)))

nou = "<p>REZOLVARE DE CONTROL, scrisa doar ca sa dovedeasca inlocuirea. Trebuie sa aiba peste optzeci de caractere vizibile ca sa treaca de garda uneltei.</p>"
io.open(JSN, "w", encoding="utf-8").write(json.dumps([{"idx": 1, "rezolvare": nou}], ensure_ascii=False))

r = subprocess.run([sys.executable, r"C:\00\Projects\LearningHub\tools\practice_io.py", "replace", TMP, JSN],
                   capture_output=True, text=True, encoding="utf-8")
print("stdout:", r.stdout.strip(), "| stderr:", r.stderr.strip()[:200])

dupa = io.open(TMP, encoding="utf-8").read()
d1 = P.dump(TMP)
ok = []
ok.append(("acelasi numar de exercitii", len(d1) == len(d0)))
ok.append(("toate au rezolvare si dupa", all(x["are_rezolvare"] for x in d1)))
ok.append(("noua rezolvare e in ex1", "REZOLVARE DE CONTROL" in dupa))
ok.append(("o SINGURA rezolvare in ex1 (nu doua lipite)", dupa.count("practice-solution") == inainte.count("practice-solution")))
ok.append(("titlurile exercitiilor neatinse", [x["titlu"] for x in d1] == [x["titlu"] for x in d0]))

def cerinte(html):
    """Textul cerintelor, cu rezolvarea decupata - altfel comparam si ce am schimbat intentionat."""
    return [P.vizibil(P.sterge_solutii(html[b:e])[0]) for a, b, e in P.bucati(html)]

ok.append(("textul cerintelor neatins", cerinte(dupa) == cerinte(inainte)))
ok.append(("restul paginii neatins (head/script)", inainte[:inainte.find('practice-exercise')] == dupa[:dupa.find('practice-exercise')]))
# control NEGATIV: apply simplu (fara replace) trebuie sa REFUZE, pentru ca are deja rezolvare
r2 = subprocess.run([sys.executable, r"C:\00\Projects\LearningHub\tools\practice_io.py", "apply", TMP, JSN],
                    capture_output=True, text=True, encoding="utf-8")
ok.append(("control negativ: apply refuza cand exista deja", "SARIT ex1" in r2.stdout))

for nume, val in ok:
    print(("  PASS  " if val else "  FAIL  ") + nume)
print("VERDICT:", "PASS" if all(v for _, v in ok) else "FAIL")
os.remove(TMP); os.remove(JSN)
