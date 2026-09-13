# Pilot: ce vede „omul” în primele 10 minute (orchestrator, 13.09.2026)

Făcut ÎNAINTE de protocol, ca să știu ce caut. Lecția: `cls7/m1-word-fundamente/lectia2-formatare-text.html`,
deschisă randat (Chromium fără ecran, 1366×768 = monitor tipic de laborator), nu citită ca fișier.

## Ce am văzut pe primul ecran
1. **Nimic de FĂCUT.** Primul ecran = meniu, insignă „Invatare Atomica”, titlu, subtitlu, DOUĂ bare de progres
   („Progres lectie 0%” și „Pasul 1 din 10 · 0 din 10”), un pliant cu obiective, începutul unui paragraf de definiție.
   Într-o oră de Word, elevul de a VII-a vrea să deschidă Word. Lecția îl pune să citească.
2. **Fără diacritice**: „Invata sa stilizezi textul”, „Formatarea Textului”. Lecție care învață tehnoredactare.
3. **Meniuri în engleză**: „tab-ul Home, grupul Font”. Dacă Office-ul din laborator e în română, butonul se cheamă „Pornire”.
4. Temă întunecată. Proiectată pe un videoproiector de școală, textul gri pe negru se spală (verificare de designer de prezentări — NEVERIFICAT pe proiector real).
5. ~~O resursă lipsă (`net::ERR_FILE_NOT_FOUND`) în consolă.~~ **RETRAS (13.09, prins de verificatorul independent):**
   era artefactul meu — lecția cere `/assets/js/site-credit.js` de la rădăcina sitului, iar pe `file://` rădăcina e `C:\`.
   Fișierul există. Servit prin http, consola e curată. Exact tiparul pe care îl studiem: am „observat” ceva real în mediul GREȘIT.
6. Primul chestionar: distractorul B („Nu exista nicio diferenta reala...”) se elimină prin reflex.

## Măsurat pe toate cele 25 de lecții M1 (script, nu impresie)
- Diacritice la 1000 de litere: **0,0–1,6** în toate 25. Control: un text românesc scris normal de pe disc
  (`Proiectul_unitatii_VII-U1.md`) are **52,3**.
- Denumiri de meniu în engleză: până la **104** într-o lecție (cls7 lectia5-tabele); în română: 0–8.
- Excel: formule `=SUM(` de 14 ori în lectia3-formule; `SUMA(` de 0 ori în lecțiile M1.
  **Corectat 13.09:** am tratat inițial `SUMA` ca forma „românească” fără sursă. Verificat pe Microsoft Support:
  pagina ro-ro = „Funcția AVERAGE”, `AVERAGE(număr1, …)`; contra-proba fr-fr = „MOYENNE(nombre1; …)”.
  Deci **Excel-ul în română NU traduce numele funcțiilor** — `SUM` e corect. În schimb site-ul se contrazice:
  `cls8/m1-excel-fundamente/quizuri/quiz4-functii.html:295` spune „Numele functiei este SUM, nu SUMA”, iar
  `cls8/m5-proiecte-final/lectia4-evaluare-nationala.html:86-89` și `quizuri/quiz3-bd.html` predau `=SUMA`, `=MEDIE`, `DACA` ca forme corecte
  (în afara M1; de reparat separat; pentru LibreOffice în română numele funcțiilor sunt NEVERIFICATE).

## ★ Cazul care explică tot proiectul
- `LESSON_SPECIFICATION.md:401` — regula proiectului: **„Diacritics IN content: Use proper ă, â, î, ș, ț in body text”** (și bifa din checklist, :751).
- Auditul celor 464 de agenți (03-04.09.2026, `proba_elevi_2026_09_03/confirmate.json`) a atins subiectul de **12 ori** —
  și a tratat lipsa diacriticelor ca **stil de consecvență internă**. O semnalare recomandă textual:
  *„Corecteaza in 'uneste' fara diacritice, pentru consecventa cu restul textului”*.
- Adică AI-ul a verificat **că textul seamănă cu el însuși**, nu **că respectă norma pe care o poartă în cap orice profesor român**
  (și pe care o scrisese chiar proiectul). Omul verifică față de o normă din AFARA documentului; AI-ul, lăsat liber,
  își ia norma din document.

## Sursă oficială pentru numele filelor în română (13.09.2026)
Microsoft Support ro-ro, <https://support.microsoft.com/ro-ro/word/format-text-as-superscript-or-subscript-in-word>:
fila **„Pornire”** (= Home), fila **„Inserați”** (= Insert, NU „Inserare” — varianta mai veche), grupul **„Font”**, grupul „Efecte”.
Consecință: o lecție care vrea să fie corectă pe ambele limbi de interfață scrie *„fila Pornire (Home)”*. Denumirile diferă și între versiuni —
exact lucrul pe care profesorul îl verifică deschizând programul DIN LABORATOR, nu din memorie.

**Ipoteza de testat:** AI-ul sare verificările care cer o referință din afara textului aflat în față
(norma limbii, ecranul real din laborator, programul real, ora de 50 de minute, copilul de 11 ani).
