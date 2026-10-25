# Reparațiile după verificarea independentă a ghidului (verificare\raport.md, 25.10.2026), pe fișele unificate.
# Fiecare înlocuire trebuie să se aplice exact o dată; ultima linie = numărul de înlocuiri care n-au prins.
from pathlib import Path

U = Path(__file__).resolve().parent.parent / "unificat"
f = {k: next(U.glob(k + "_*.md")) for k in ("U4", "U6", "U7")}
R = [
    ("U6", "- O lecție care se folosește pe telefoane nu se publică fără componenta reparată pentru telefon:",
     "- **Regula dirijorului (24.10), din cererea lui Vasile din 20.10 („și la Dumbrava lucrăm tot pe telefoanele elevilor”) — nu sunt cuvintele lui:** o lecție care se folosește pe telefoane nu se publică fără componenta reparată pentru telefon:"),
    ("U6", "nimic scris în `HKCU\\Software\\Classes`. [surse: Eviii:253; Eviii:272]",
     "nimic scris în `HKCU\\Software\\Classes`. [surse: Eviii:253; Eviii:272] **Depășit pentru probele de acum (25.10):** din 10-23.10 aplicațiile din Magazin, inclusiv Notepad-ul nou, nu se mai pornesc deloc în probe (regula 25, Partea I.4); rețeta rămâne doar ca istoric (VIII/19-20)."),
    ("U6", "### Formulări comune, ținute la fel în toate lecțiile\n",
     "### Formulări comune, ținute la fel în toate lecțiile\n_(Ale autorilor sau ale dirijorului, ținute la fel peste tot; a lui Vasile e doar parola, „parola o știi doar tu și părinții tăi”, confirmată pe 11.10.)_\n"),
    ("U6", "### Lecții publicate de reparat\n",
     "### Lecții publicate de reparat\n- VI/14: „doamna dirigintă” → „doamnă dirigintă”, forma predată la VI/15 (găsit la unificare, 25.10). [surse: Evi:242]\n"),
    ("U6", "(`REGULA_NOUA.md` §1, A40/B30/C20)",
     "(`REGULA_NOUA.md` §1, A40/B30/C20 — **lămurit 25.10: §1 are deja C 40 / B 30 / A 20; §2 aliniat de dirijor la „plan individualizat de învățare”**)"),
    ("U4", "fișierele de sesiune create (`LocalState\\TabState`, `WindowState`) se șterg. [surse: E8:254]",
     "fișierele de sesiune create (`LocalState\\TabState`, `WindowState`) se șterg. [surse: E8:254] **Depășit (25.10):** din 10-23.10 Notepad-ul nou (aplicație din Magazin) nu se mai pornește în probe (regula 25, Partea I.4)."),
    ("U4", "- Nu se publică după 06:00, pentru că elevii intră pe sit de la ~07:45 (vezi Contradicții pentru 24.10). [surse: C1:189]",
     "- Nu se publică după 06:00, pentru că elevii intră pe sit de la ~07:45 (vezi Contradicții pentru 24.10). [surse: C1:189] **Hotărârea consolidării (Partea X.1, V-5):** în zilele de școală nu se publică între 07:30 și 15:00; în weekend și în vacanță, oricând."),
    ("U4", "- Prima publicare a unei unități (gimnaziu) sau a unei grupe (liceu) cere OK-ul lui Vasile pe Telegram",
     "- **[Depășit pentru /lectii/ — din planul de pornire; de la 28.09 lecțiile se publică imediat ce trec judecătorii, cum a cerut Vasile pe 27.09 („Tot ce terminăm trebuie pus pe siteul live”); vezi Partea X.1]** Prima publicare a unei unități (gimnaziu) sau a unei grupe (liceu) cere OK-ul lui Vasile pe Telegram"),
    ("U7", "„Se apropie sfârșitul orei? Sari la ultimul punct”;",
     "„Se apropie sfârșitul orei? Sari la ultimul punct” (formula de azi: „Când mai sunt 10 minute din oră…”, regula S46 din II.1 D);"),
]
nu = 0
texte = {k: p.read_text(encoding="utf-8") for k, p in f.items()}
for k, vechi, nou in R:
    n = texte[k].count(vechi)
    if n != 1:
        print(f"NU A PRINS ({n}×) în {k}: {vechi[:70]}")
        nu += 1
        continue
    texte[k] = texte[k].replace(vechi, nou)
for k, p in f.items():
    p.write_text(texte[k], encoding="utf-8")
print(nu)
