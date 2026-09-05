# -*- coding: utf-8 -*-
"""Control pentru depth_io.py replace.

Cazul care conteaza cel mai mult NU e cel fericit, ci cel in care textul nou e
RESPINS de garzi: caseta veche trebuie sa ramana pe loc. Daca as taia-o inainte de
validare, o reparatie esuata ar lasa lectia mai saraca decat era.
"""
import io, os, sys, json, shutil, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import depth_io as D

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(R, "content", "tic", "cls7", "m4-colaborare", "lectia2-google-docs.html")
TMP = os.path.join(os.path.dirname(SRC), "_ctrl_depth.html")
DIO = os.path.join(R, "tools", "depth_io.py")
J = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_ctrl_depth.json")

T = []
def t(nume, val): T.append((nume, bool(val)))

def scrie_json(corp):
    io.open(J, "w", encoding="utf-8").write(json.dumps({"corp": corp}, ensure_ascii=False))

def ruleaza(cmd):
    return subprocess.run([sys.executable, DIO, cmd, TMP, J],
                          capture_output=True, text=True, encoding="utf-8", errors="replace")

shutil.copyfile(SRC, TMP)
inainte = io.open(TMP, encoding="utf-8", errors="replace").read()
assert D.MARCA in inainte, "controlul presupune ca lectia ARE deja o caseta"
t("pornim de la o lectie CU caseta", D.dump(TMP)["are_caseta"])

BUN = ("<p><strong>Provocare de control:</strong> textul asta exista doar ca sa dovedeasca "
       "inlocuirea si trebuie sa treaca de garda de lungime minima, care cere peste doua sute "
       "de caractere vizibile. Scriu destul incat sa fie limpede ca nu e un fragment scurt.</p>")

# 1. apply simplu tot REFUZA cand exista deja o caseta
scrie_json(BUN)
r = ruleaza("apply")
t("apply refuza cand exista deja o caseta", "are deja o caseta" in r.stdout)
t("apply n-a atins fisierul", io.open(TMP, encoding="utf-8", errors="replace").read() == inainte)

# 2. replace o schimba
r = ruleaza("replace")
dupa = io.open(TMP, encoding="utf-8", errors="replace").read()
t("replace scrie", '"scris": true' in r.stdout)
t("textul nou e in pagina", "Provocare de control" in dupa)
t("textul vechi a disparut", "DA NUME unei versiuni" not in dupa)
t("o SINGURA caseta, nu doua lipite", dupa.count(D.MARCA) == 1)
t("restul paginii neatins", inainte[:inainte.find(D.MARCA)] == dupa[:dupa.find(D.MARCA)])

# 3. CAZUL CARE CONTEAZA: text nou respins => caseta veche ramane
inainte2 = dupa
scrie_json("<p>prea scurt</p>")
r = ruleaza("replace")
dupa2 = io.open(TMP, encoding="utf-8", errors="replace").read()
t("replace refuza textul prea scurt", '"scris": false' in r.stdout)
t("DUPA UN REFUZ, caseta veche e tot acolo", dupa2 == inainte2 and D.MARCA in dupa2)

# 4. la fel pentru o legatura care nu se poate dovedi
scrie_json(BUN.replace("</p>", ' <a href="https://exemplu-inventat.ro/x">sursa</a></p>'))
r = ruleaza("replace")
dupa3 = io.open(TMP, encoding="utf-8", errors="replace").read()
t("replace refuza legatura nedovedita", '"scris": false' in r.stdout)
t("DUPA acel refuz, caseta veche e tot acolo", dupa3 == inainte2 and D.MARCA in dupa3)

os.remove(TMP); os.remove(J)
for nume, val in T:
    print(("  PASS  " if val else "  FAIL  ") + nume)
bune = sum(v for _, v in T)
print("VERDICT: %s %d/%d" % ("PASS" if bune == len(T) else "FAIL", bune, len(T)))
sys.exit(0 if bune == len(T) else 1)
