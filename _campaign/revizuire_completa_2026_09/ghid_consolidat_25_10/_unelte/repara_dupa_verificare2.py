# Reparațiile după a doua verificare (verificare\t2\raport2.md, 25.10.2026), pe fișele unificate.
# Fiecare înlocuire trebuie să se aplice exact o dată; ultima linie = numărul de înlocuiri care n-au prins.
from pathlib import Path

U = Path(__file__).resolve().parent.parent / "unificat"
f = {k: next(U.glob(k + "_*.md")) for k in ("U4", "U6", "U7")}
R = [
    # M1: VII/10 hotărât pe 11.10
    ("U6", "- **Evaluarea VI/10 (și VII/10):**",
     "- **Evaluarea VI/10 (VII/10 hotărâtă de Vasile pe 11.10: C/B/A; rămâne doar VI/10 — Partea X.2, punctul 7):**"),
    # M2 / N4: REGULA_NOUA §1 e deja corectă
    ("U6", "Data lămurește care e valabilă (decizia din 01.10), dar fișierul citit de agenți e încă vechi — de actualizat de dirijor.",
     "Data lămurește care e valabilă (decizia din 01.10). (Fraza „fișierul citit de agenți e încă vechi” din extragere nu mai e adevărată: §1 e corect; §2 aliniat pe 25.10.)"),
    ("U6", "`REGULA_NOUA.md` §1 are încă schema veche A40/B30/C20. Le schimbă dirijorul, nu autorul lecției.",
     "`REGULA_NOUA.md` §1 are C 40 / B 30 / A 20 (verificat 25.10; extragerea spunea „schema veche”, fals). Le schimbă dirijorul, nu autorul lecției."),
    # M5: citatul exact
    ("U6", "„ca dintr-o privire să știe unde a rămas data trecută”",
     "„Astfel la o privire în meniul de jos elevul să știe clar unde a rămas data trecută”"),
    # M6: regula briefului, nu vorbele lui
    ("U6", "- Documentele profesorului din `Info_Gimnaziu_2026` (",
     "- (Regula briefului autorului, de la 27.09 — nu sunt cuvintele lui.) Documentele profesorului din `Info_Gimnaziu_2026` ("),
    # M7: unde stau răspunsurile
    ("U6", "Răspunsurile lui stau în `08_RELUARE.md` / `ZIUA_12_10.md`, necitite în această fișă (nesigur).",
     "Răspunsurile lui stau în `_istoric\\08_RELUARE_pana_la_25_10.md` și `ZIUA_12_10.md` (nerecitite la consolidare)."),
    # N9: trimiteri spre fișierele care acum sunt doar trimiteri
    ("U6", "de pus în `05_STANDARD_LECTIE.md` lângă",
     "de pus în standard (azi: Partea I a acestui ghid, regula 29) lângă"),
    # M4 + N1: formulele vechi din IV.2 §11 și trimiterea corectă (S46 e în II.1 E)
    ("U7", "(formula de azi: „Când mai sunt 10 minute din oră…”, regula S46 din II.1 D);",
     "(înlocuită);"),
    ("U7", "„Mai sunt mai puțin de 20 de minute? Fă întâi întrebările”; întrebările se pot face acasă.",
     "„Mai sunt mai puțin de 20 de minute? Fă întâi întrebările” (înlocuită); întrebările se pot face acasă. **De azi:** cele două formule marcate „înlocuită” au lăsat locul formulei unice „Când mai sunt 10 minute din oră” (regula S46, II.1 E; Partea X.1 II-K3)."),
    # N7: restul rețetei Notepad
    ("U4", "(la Notepad, copilul are ca părinte PID-ul tău)",
     "(la Notepad, copilul are ca părinte PID-ul tău — rețeta Notepad e depășită, vezi X.1 V-2)"),
    # N6: rândul din Anexa C pentru vechea regulă 25
    ("U4", "## Depășite\n",
     "## Depășite\n\n- Std r.25 (28.09): aplicațiile din Magazin (Paint, Notepad nou) se puteau porni cu o copie a `Helium\\User.dat` (doar Calculatorul era interzis) → înlocuit 10-23.10: nu se pornesc deloc în probe; la fel rețetele de probă cu Notepad din V.1 și VII.1 (marcate „Depășit”). [surse: Std r.25, D1:11, D2:199]\n"),
]
nu = 0
texte = {k: p.read_text(encoding="utf-8") for k, p in f.items()}
for k, vechi, nou in R:
    n = texte[k].count(vechi)
    if n != 1:
        print(f"NU A PRINS ({n}×) în {k}: {vechi[:80]}")
        nu += 1
        continue
    texte[k] = texte[k].replace(vechi, nou)
for k, p in f.items():
    p.write_text(texte[k], encoding="utf-8")
print(nu)
