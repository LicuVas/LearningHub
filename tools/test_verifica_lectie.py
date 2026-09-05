# -*- coding: utf-8 -*-
"""Control pentru verifica_lectie.py dupa reparatia celor doua alarme false.

Alarmele false reparate (05.09.2026):
  - containerul .atom-quiz era cautat intr-o fereastra fixa de 6000 de caractere
    dupa atom; atomii cu exemple lungi de cod il aveau dincolo de ea
  - orice href="*.html" era socotit navigare, inclusiv exemplele didactice din
    <code>&lt;a href="despre.html"&gt;</code> dintr-o lectie care PREDA HTML

Controlul are doua fete, si ambele conteaza:
  POZITIV - lectiile bune nu mai sunt semnalate degeaba
  NEGATIV - poarta tot PRINDE defectul adevarat cand chiar il fabric
"""
import io, os, re, sys, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import verifica_lectie as V

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# lectie cu atomi lungi de cod (fostul fals-pozitiv pe .atom-quiz)
A = os.path.join(R, "content", "liceu", "mat-info", "cls10", "m1-structuri-date", "lectia5-matrice-operatii.html")
# lectie care preda HTML, plina de exemple <a href="...">  (fostul fals-pozitiv pe legaturi)
B = os.path.join(R, "content", "liceu", "mat-info", "cls12", "m3-web", "lectia4-proiect-web.html")

T = []
def t(nume, val): T.append((nume, bool(val)))

def prob(p):
    return V.verifica(p)[0]

# --- POZITIV: alarmele false au disparut ---
pa = prob(A)
t("A: nu mai zice 'chestionar mort' pe atomii cu cod lung",
  not any("atom-quiz" in x for x in pa))
pb = prob(B)
t("B: nu mai zice 'legatura moarta' pe exemplele din <code>",
  not any("legatura moarta" in x for x in pb))

# --- NEGATIV: poarta tot prinde defectul REAL ---
TMP = os.path.join(os.path.dirname(A), "_ctrl_sabotaj.html")

# 1. scot containerul .atom-quiz al unui atom care CHIAR are chestionar
src = io.open(A, encoding="utf-8", errors="replace").read()
assert 'atom-quiz' in src, "sabotajul presupune ca fisierul ARE containere .atom-quiz"
n_inainte = len(re.findall(r'atom-quiz', src))
stricat = re.sub(r'atom-quiz', 'atom-XXXXX', src, count=n_inainte)
assert 'atom-quiz' not in stricat, "sabotajul n-a prins - tiparul nu s-a inlocuit"
io.open(TMP, "w", encoding="utf-8").write(stricat)
t("NEGATIV: prinde atomul ramas fara container",
  any("atom-quiz" in x for x in prob(TMP)))

# 2. pun o legatura de navigare REALA (in afara oricarui <code>) catre un fisier inexistent
assert '</body>' in src, "sabotajul presupune un </body>"
stricat2 = src.replace('</body>', '<a href="lectie-care-nu-exista.html">inainte</a></body>', 1)
assert 'lectie-care-nu-exista.html' in stricat2, "sabotajul n-a prins"
io.open(TMP, "w", encoding="utf-8").write(stricat2)
t("NEGATIV: prinde legatura moarta adevarata (in afara <code>)",
  any("lectie-care-nu-exista.html" in x for x in prob(TMP)))

# 3. control al controlului: aceeasi legatura, dar INTR-UN <code>, trebuie IGNORATA
stricat3 = src.replace('</body>', '<code>&lt;a href="lectie-care-nu-exista.html"&gt;&lt;/a&gt;</code></body>', 1)
io.open(TMP, "w", encoding="utf-8").write(stricat3)
t("NEGATIV inversat: aceeasi legatura in <code> e ignorata",
  not any("lectie-care-nu-exista.html" in x for x in prob(TMP)))

os.remove(TMP)
for nume, val in T:
    print(("  PASS  " if val else "  FAIL  ") + nume)
bune = sum(v for _, v in T)
print("VERDICT: %s %d/%d" % ("PASS" if bune == len(T) else "FAIL", bune, len(T)))
sys.exit(0 if bune == len(T) else 1)
