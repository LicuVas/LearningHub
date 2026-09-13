# 04 — Norma din afara documentului (U16)

## Diacritice
- Măsurat (formula porții, pe `innerText.txt`): **0,0 diacritice la 1000 de litere**. Text românesc normal ≈ 40-60 (pilot: 52,3).
- Nicio literă ș/ț/ă/â/î în tot textul lecției; nici ş/ţ cu sedilă (0 în HTML, grep).
- Norma proiectului, `LESSON_SPECIFICATION.md:401`: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; checklist `:751` „Romanian text with proper diacritics (ă, â, î, ș, ț)”. Titlul fără diacritice e cerut (`:400`) — deci doar `<title>`/numele fișierului sunt în regulă.
- Exemple care schimbă sensul sau se citesc greu pentru un copil: „Sa identifici”, „Imagineaza-ti”, „amintieste-ti” (greșit și cu diacritice: „amintește-ți”), „hartienu apar liniiintre” (cuvinte lipite din HTML).
- Lecție de Excel pentru clasa a VIII-a care îi cere elevului să scrie „CATALOG NOTE - CLASA a VIII-a” și „Data tezei” — elevul copiază modelul fără diacritice.

## Programa (OMEN 3393/2017, din `curriculum.json`)
- CS.1.1 „Utilizarea foilor de calcul tabelar în vederea rezolvării unor situații problemă simple”.
- Conținuturi: „Tipuri de date: numeric, text, dată calendaristică” (ora 5) și „Operații de formatare a celulelor (aliniere conținut, borduri, culori de umplere, stiluri predefinite)”, „Operații de formatare a rândurilor/coloanelor” (ora 6).
- Lecția acoperă tipurile de date și formatarea celulelor, dar **nu** „stiluri predefinite” (Cell Styles) și **nu** formatarea rândurilor/coloanelor (lățime, înălțime) — iar ultima produce vizibil `###` la data din Ex. 1 (`randat_xlsx/ex1_catalog.pdf`).
- Descriptorul „De bază” din standard (O. 4.615/2026): „date de tipuri implicite … formatări de bază, în pași ghidați” — Ex. 1 corespunde.

## Ca specialist (contabilul care trăiește în Excel, 2026)
- „Merge & Center” predat ca unealtă de titlu: practica curentă recomandă „Center Across Selection” pentru titluri, tocmai pentru că Merge strică sortarea/selecția — lecția o spune la Ex. 3, dar Încearcă-ul pune elevul să îmbine peste antet. (Practică de meserie; nu am descărcat sursă pentru „Center Across Selection” — NEVERIFICAT pe text brut.)
- Sumele de bani scrise cu unitatea în celulă („3.50 lei”) sunt exact greșeala „număr ca text” pe care lecția o predă în atomul 1 — modelul din Ex. 2 o arată ca formă corectă.
