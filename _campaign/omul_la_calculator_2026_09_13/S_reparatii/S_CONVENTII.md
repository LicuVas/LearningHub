# Convențiile reparației M1 (13.09.2026) — la fel în toate cele 25 de lecții

**Deciziile profesorului (13.09.2026, 17:43):**
- Calculatoarele sunt multe, la multe școli: **Office poate fi în engleză SAU în română → lecția dă AMBELE variante.**
- La fel în Excel: **virgulă SAU punct și virgulă** între argumente (și zecimala punct/virgulă) → **ambele variante**.
- Calculatoarele **nu se resetează după fiecare oră** → ce salvează o clasă găsește clasa următoare.
- „Fă modificările pe site.”

## 1. Numele comenzilor: „Română (English)”
- Forma: **fila Pornire (Home)**, **grupul Font**, **Inserați (Insert) › Tabel (Table)**. Româna întâi, engleza în paranteză, la PRIMA apariție într-un pas; în același pas, după aceea, poți folosi doar forma românească urmată de engleza scurtă dacă e ambiguu.
- **Numai din `S_reparatii/GLOSAR_UI.md`, tabelul CONFIRMAT.** Nume din tabelul VARIANTE → scrii ambele variante românești: „Inserați/Inserare (Insert)”. Nume necuprins în glosar → lași engleza și adaugi „(în Office în română, butonul cu aceeași pictogramă)”; **nu inventezi traduceri**.
- Scurtăturile care diferă între versiuni se scriu cu versiunea: „Ctrl+Shift+V lipește doar textul (în Word 2024/Microsoft 365); în versiunile mai vechi folosește Lipire specială (Paste Special)”.

## 2. Excel: separator, zecimale, nume de funcții
- Numele funcțiilor rămân **SUM, AVERAGE, MIN, MAX, COUNT, IF** (Excel în română nu le traduce). Nicăieri SUMA/MEDIE/DACA.
- Formule cu un singur interval (`=SUM(B2:E2)`) — nu au separator, rămân așa.
- Formule cu mai multe argumente: se scriu **ambele forme**, prima dată în lecție cu caseta de mai jos, apoi `=IF(B2>=5; "Promovat"; "Corigent")` <small>(sau cu virgule: `=IF(B2>=5, "Promovat", "Corigent")`)</small>.
- Caseta (o singură dată pe lecție, înainte de prima formulă cu mai multe argumente), textul exact:
  > **Calculatorul tău poate fi setat diferit.** Pe unele calculatoare Excel desparte argumentele cu **punct și virgulă** (`;`), pe altele cu **virgulă** (`,`). Dacă formula ta dă eroare, încearcă celălalt semn. La fel la zecimale: pe unele scrii `7,5`, pe altele `7.5`.
- Datele de copiat/tabelele cu zecimale: se scrie `7,5` și se adaugă o singură dată „(sau 7.5, după calculator)”. Cifrele din rezolvări rămân aceleași numeric.

## 3. Salvarea (calculatorul comun)
- Fiecare sarcină care produce un fișier spune **nume + loc**: „Salvează ca **Clasa_Nume_<tema>.docx** (de exemplu `7A_Popescu_Tabele.docx`) în folderul clasei tale — întreabă profesorul unde este.” Aceeași formă la .pptx / .xlsx.
- Unde lecția cere redeschiderea unui fișier de la ora trecută: „deschide fișierul tău (cu numele tău)”.
- Pe pagină, butonul „Sunt alt elev — încep lecția de la zero” există deja (motorul, 13.09) — lecția nu trebuie să-l mai explice.

## 4. Date personale
- Nicio sarcină nu cere numele reale ale familiei, notele reale ale colegilor, poze cu alți copii. Înlocuiești cu **date inventate** („o familie imaginară”, „notele unei clase imaginare”) sau cu obiecte/locuri.

## 5. Ce NU faci în valul acesta
- **Nu adaugi diacritice** în text (vine un val separat, cu poartă proprie). Textul nou pe care îl scrii îl scrii **în stilul fișierului** (fără diacritice), ca valul următor să le pună uniform. Excepție: numele românești din glosar se scriu exact cum sunt în glosar (cu diacritice).
- Nu spargi lecția, nu muți lecții între ore, nu ștergi atomi, nu adaugi imagini, nu scrii bareme noi — acestea sunt decizii de structură rămase la profesor.
- Nu modifici `<title>`, numele fișierului, `id`-urile atomilor, scripturile, CSS-ul.

## 6. Chestionarele (reguli existente R1, `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md`)
- `data-quiz` = listă JSON `[{"question","options":[...],"correct":"b","hint"}]`; apostroful din conținut ca `&#39;`; cheia e o literă validă.
- Indiciul nu numește litera; varianta corectă nu e cu peste 20% mai lungă decât media celorlalte.
- O întrebare pusă la un pas trebuie să se poată răspunde **din textul acelui pas sau al celor dinainte**. Dacă întreabă ce se predă mai târziu: o muți la pasul care o predă (schimbând două `data-quiz` între ele) sau o rescrii pe conținutul pasului curent.
