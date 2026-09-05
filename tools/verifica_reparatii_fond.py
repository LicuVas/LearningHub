# -*- coding: utf-8 -*-
"""Oracol independent pe reparatiile de fond. La cele de calcul REFAC eu socoteala."""
import io, os, re, sys
R = r"C:\00\Projects\LearningHub"
T = []
def t(n, v): T.append((n, bool(v)))
def txt(rel):
    s = io.open(os.path.join(R, rel.replace("/", os.sep)), encoding="utf-8", errors="replace").read()
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s))
def raw(rel):
    return io.open(os.path.join(R, rel.replace("/", os.sep)), encoding="utf-8", errors="replace").read()

# --- 1. A4 la 300 DPI: cifrele corecte, calculate AICI ---
px = 2480 * 3508
oct_ = px // 8
print("socoteala mea: 2480 x 3508 = %d ; /8 = %d octeti ; %.4f MiB" % (px, oct_, oct_ / 1048576))
f = "content/liceu/stiinte/cls11/m2-imagini-web/lectia1-imagine-digitala.html"
s = txt(f)
t("stiinte cls11: apare produsul CORECT 8.699.840", "8.699.840" in s)
t("stiinte cls11: cifra gresita 8.700.640 a disparut", "8.700.640" not in s)
t("stiinte cls11: apare 1.087.480 octeti (corect)", "1.087.480" in s)
t("stiinte cls11: 1.087.580 (gresit) a disparut", "1.087.580" not in s)

# --- 2. DPI: 3000 px pe 29,7 cm = ? ---
dpi = 3000 / (29.7 / 2.54)
print("socoteala mea: 3000 px pe 29,7 cm = %.1f DPI (sub 300)" % dpi)
f2 = "content/liceu/tehnologic/cls11/m2-imagini-web/lectia1-imagine-digitala.html"
s2 = txt(f2)
t("tehnologic cls11: concluzia nu mai zice ca ajunge",
  not re.search(r"(Da,\s*ajunge|ramane peste 300 DPI)", s2, re.I))
t("tehnologic cls11: numeste latura care limiteaza (3000 vs 3508)",
  "3508" in s2 and "3000" in s2)
t("tehnologic cls11: apare valoarea reala ~257 DPI", re.search(r"25[67]\s*DPI|~?\s*257", s2))

# --- 3. notatia chimica ---
f3 = "content/liceu/stiinte/cls10/m1-procesare-text/lectia1-documente-formatare.html"
r3 = raw(f3)
t("chimie: exemplul gresit Ca&#8322;&#8314; (indice+exponent) a disparut", "Ca&#8322;&#8314;" not in r3)
t("chimie: la INDICE apare un exemplu valid de indice", "Ca(OH)&#8322;" in r3 or "H&#8322;O" in r3)
t("chimie: la EXPONENT apare Ca cu 2 exponent", "Ca&#178;&#8314;" in r3)

# --- 4. exercitiile care cereau nepredat isi spun asta ---
for f4, cheie in [("content/liceu/stiinte/cls10/m1-procesare-text/lectia3-corespondenta-aplicatie.html", "NU e explicata in lectie"),
                  ("content/liceu/stiinte/cls11/m2-imagini-web/lectia1-imagine-digitala.html", "nu este predata in aceasta lectie")]:
    s4 = txt(f4)
    t("%s: rezolvarea recunoaste deschis ce nu s-a predat" % f4.split("/")[-1][:28],
      re.search(re.escape(cheie), s4, re.I))

# --- 5. poarta trece pe toate cele 9 ---
import subprocess, json
lucru = json.load(io.open(os.path.join(R, "_campaign", "proba_elevi_2026_09_03",
                                       "probleme_rescriere.json"), encoding="utf-8"))
G = os.path.join(R, "tools", "verifica_lectie.py")
pica = []
for x in lucru:
    rel = x["fisier"].replace("\\", "/")
    r = subprocess.run([sys.executable, G, os.path.join(R, rel.replace("/", os.sep))],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        pica.append(rel)
t("poarta trece pe toate cele %d lectii atinse" % len(lucru), not pica)
if pica:
    print("   pica:", pica)

for n, v in T:
    print(("  PASS  " if v else "  FAIL  ") + n)
b = sum(v for _, v in T)
print("VERDICT: %s %d/%d" % ("PASS" if b == len(T) else "FAIL", b, len(T)))
