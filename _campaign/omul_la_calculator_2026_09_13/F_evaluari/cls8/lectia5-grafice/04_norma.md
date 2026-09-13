# 04 — Norma din afara lecției (U16, programa, spec)

## Programa (OMEN 3393/2017, `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`)
Conținuturi, domeniul „Calcul tabelar”, clasa a VIII-a: **„Grafice: tipuri de grafice”**, **„Serii de date”**. Activitate de învățare: „rezolvarea unor probleme la diferite discipline prin utilizarea formulelor, funcţiilor, diagramelor și seriilor specifice calculului tabelar”.
Lecția acoperă ambele conținuturi (atomii 2-3 tipuri, atomul 4 serii). Programa folosește chiar cuvântul **„diagramelor”** — același termen ca Excel-ul în română; lecția nu-l folosește deloc (Grep „diagram” în innerText.txt: 0).
Planul anului: ora 11 „Grafice: tipuri de grafice și serii de date” — o singură oră (spre deosebire de lecțiile 3-4, aici „o lecție = o oră” se respectă ca temă; timpul nu — vezi poarta).

## LESSON_SPECIFICATION.md
- `:401` „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; bifa `:751` „Romanian text with proper diacritics (ă, â, î, ș, ț)”.
- `:400` „ASCII-safe titles: No diacritics … in `<title>` tags or filenames” — titlul fără diacritice e corect.
- `:752` „4-8 atoms present” — lecția are **9** atomi (`masuri.json`).

## U16 — diacritice
Măsurat pe `innerText.txt` (fără marcajele [ASCUNS]): **0,0 diacritice la 1000 de litere** (0 din 19.745 de litere). Text românesc normal ≈ 40-60. Nici ș/ț cu virgulă, nici ş/ţ cu sedilă — lipsesc complet. Exemple: „Grafice si Vizualizarea Datelor”, „Ce ai invatat astazi”, „Directorul cere un raport cu notele clasei”.
Consecință directă pentru Excel: titlul pe care elevul îl tastează în grafic („Notele clasei a VIII-a”) nu are diacritice de corectat, dar nici „Română”, „Matematică” din tabelul copiat nu le au — graficul proiectat la ședința cu părinții (scenariul din atomul 9) ar avea „Romana”, „Intretinere”.
