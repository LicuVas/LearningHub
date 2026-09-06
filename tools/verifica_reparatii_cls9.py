# -*- coding: utf-8 -*-
"""Oracol independent pe cele 5 reparatii. La calcul refac eu socoteala."""
import io, os, re, sys, subprocess
R = r"C:\00\Projects\LearningHub"
D = os.path.join(R, "content", "liceu", "artistic", "cls9")
T = []
def t(n, v): T.append((n, bool(v)))
def txt(rel):
    s = io.open(os.path.join(D, rel.replace("/", os.sep)), encoding="utf-8", errors="replace").read()
    return s, re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s))

# --- 1. eroarea numerica de la procesor: refac socoteala AICI ---
pierdere = (3.8 - 2.9) / 3.8 * 100
castig = (8 - 4) / 4 * 100
print("socoteala mea: frecventa 3,8->2,9 GHz = -%.1f%% | nuclee 4->8 = +%.0f%% | raport %.1fx"
      % (pierdere, castig, castig / pierdere))
_, p2 = txt("m3-sisteme-de-calcul/lectia2-procesorul.html")
t("procesor: afirmatia gresita 'o data si jumatate' a disparut", "o data si jumatate" not in p2)
t("procesor: spune ca nucleele se DUBLEAZA", re.search(r"se dubleaz|dubleaza", p2, re.I))
t("procesor: da si cifrele ca elevul sa refaca socoteala", "100%" in p2 and re.search(r"2[34]%", p2))

# --- 2. scurtatura Windows+Pause ---
_, p1 = txt("m3-sisteme-de-calcul/lectia1-arhitectura.html")
t("arhitectura: scurtatura nesigura Windows+Pause a fost scoasa",
  not re.search(r"Windows\s*\+?\s*Pause", p1, re.I))
t("arhitectura: ruta sigura (Setari > Sistem > Despre) a ramas",
  re.search(r"Despre", p1) and re.search(r"Windows\s*\+\s*I|Setari", p1))
t("arhitectura: lectia arata acum de unde se citeste sistemul de operare",
  re.search(r"Specificatii Windows", p1) or re.search(r"OS Name", p1))

# --- 3. mouse Ubuntu ---
_, p6 = txt("m3-sisteme-de-calcul/lectia6-periferice-intrare.html")
t("periferice: nu mai trimite la accesibilitate pentru butonul principal",
  not re.search(r"accesibilitate[^.]{0,80}(buton|stangaci)|stangaci[^.]{0,60}accesibilitate", p6, re.I))
t("periferice: trimite la Mouse (unde chiar e setarea)", re.search(r"Mouse", p6))

# --- 4. LibreOffice Impress ---
_, p8 = txt("m2-continuturi-digitale/lectia8-prezentari-baze.html")
t("Impress: eticheta romaneasca inventata a disparut",
  "Schimba diapozitivul coordonator" not in p8)
t("Impress: foloseste eticheta reala din interfata", re.search(r"Diapozitive master|Master Slides|Change Slide Master", p8))
t("Impress: spune ca eticheta tradusa difera intre versiuni",
  re.search(r"difer[aă][^.]{0,60}versiun", p8, re.I))

# --- poarta pe cele 4 + vecinele lor ---
G = os.path.join(R, "tools", "verifica_lectie.py")
pica = []
for rel in ["m2-continuturi-digitale/lectia8-prezentari-baze.html",
            "m2-continuturi-digitale/lectia9-prezentari-interactive.html",
            "m3-sisteme-de-calcul/lectia1-arhitectura.html",
            "m3-sisteme-de-calcul/lectia2-procesorul.html",
            "m3-sisteme-de-calcul/lectia6-periferice-intrare.html",
            "m3-sisteme-de-calcul/lectia7-periferice-iesire.html"]:
    r = subprocess.run([sys.executable, G, os.path.join(D, rel.replace("/", os.sep))],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        pica.append((rel, [l.strip() for l in r.stdout.splitlines() if l.strip().startswith("-")][:2]))
t("poarta trece pe lectiile atinse SI pe vecinele lor", not pica)
if pica:
    for rel, m in pica: print("   PICA", rel, m)

for n, v in T: print(("  PASS  " if v else "  FAIL  ") + n)
b = sum(v for _, v in T)
print("VERDICT: %s %d/%d" % ("PASS" if b == len(T) else "FAIL", b, len(T)))
