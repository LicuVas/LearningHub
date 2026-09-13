# 04 — Norma din afara documentului (U16)

## Diacritice
- Măsurat de mine pe `innerText.txt` cu funcția porții: **0,0 la 1000 de litere** — niciun ă, â, î, ș, ț în toată lecția (nici măcar excepțiile de la lecția 1). Text românesc normal ≈ 40-60 (control în `D_pilot`: 52,3).
- ş/ţ cu sedilă: 0 (nu există diacritice deloc).
- **Spec-ul proiectului cere altceva** — `C:\00\Projects\LearningHub\LESSON_SPECIFICATION.md:401`: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”, iar checklistul (:751) „Romanian text with proper diacritics (ă, â, î, ș, ț)”. Titlul fără diacritice e permis (:400, „ASCII-safe titles”), textul nu.
- Consecință la această lecție: copilul învață să scrie nume de dosare și fișiere; lecția îi dă exemple ca „Romana”, „Scoala” — pentru nume de fișier asta e chiar un obicei bun (fără diacritice în nume), dar lecția **nu spune** că o face intenționat, iar corpul textului nu are diacritice nici acolo unde nu e nume de fișier („Operatii cu Fisiere si Directoare”).

## Programa (OMEN 3393/2017, `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`)
- Competența lecției: **CS.1.2 „Utilizarea eficientă a unor componente software”**, cu activitățile „descrierea modului de organizare a informațiilor pe suport extern și exersarea modalităților de lucru cu fișiere și directoare” și „realizarea [...] a principalelor operații cu fișiere și directoare (creare, ștergere, redenumire, copiere, mutare, căutare) în vederea organizării resurselor digitale personale” (extras în `surse/calendar_5AM_5M_extras.txt`).
- Lecția acoperă toate cele șase operații (inclusiv căutarea, doar ca rând în tabel, fără exercițiu). Standardul „De bază” cere operații „în pași ghidați” — provocarea de la început e ghidată, bine.
- Programa **nu** cere clasificarea în software de sistem / aplicații / utilitare; nu e greșit s-o predai, dar lecția trebuie să aleagă o singură clasificare.
- Planul anului pune CS.1.2 în **M2** (orele 8-11, noiembrie). Lecția stă în M1 (CS.1.1).

## Norma profesiei (tehnician de service, 2026)
- „Calculatorul lent = de obicei hardware”: contrazis de Microsoft Support (`surse/fapte_2026.txt` pct. 3).
- Exemple de sisteme de operare: Monterey/Ventura, iOS 16 — depășite (Apple: macOS Tahoe 26, iOS 26); Windows 10 fără suport din 14.10.2025.
- Calea `C:\Documente\...` — nu există pe un Windows real; `C:\Users\<cont>\Documents` (Microsoft Learn).
- „Ctrl+Z anuleaza orice greseala!” — aceeași lecție predă Shift+Delete „fara recuperare”; un tehnician n-ar spune niciodată unui copil că orice se poate anula.
- Bun: lecția învață Coșul de reciclare și avertizează la Shift+Delete.
