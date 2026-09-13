# Raport — „Formule de Baza in Excel” (TIC, clasa a VIII-a)

**Ora din plan:** ora 7, „Formule de calcul cu operatori aritmetici” — marți 20.10.2026 (VIII, Izvoare/Dumbrava Roșie) și vineri 23.10.2026 (8A/8M, Brauner). Ora următoare (8) e „Funcții: sumă, maxim, minim, medie aritmetică”.
**Pe scurt:** cheile celor 7 întrebări și toate cifrele din exerciții ies corect (recalculate). Problemele sunt altele: o grilă care nu se afișează, un total greșit în indiciu, o regulă formulată invers, prea mult conținut pentru ora 7 și un mod de salvare care nu merge pe calculatoare folosite de mai multe clase.
Fișiere: `semnalari.json` (21 de semnalări), `harta_acoperirii.md` (79 de elemente), `test/` (foile Excel de test, scripturile, capturile).

## Ce schimbă ora de mâine (7)

1. **S2 · blocant — cele două „foi Excel” desenate nu se văd ca tabel.** Captura la 1366x768 arată catalogul și exemplul cu TVA cu celulele una sub alta. Cauza: HTML-ul folosește `div`-uri, dar stilul e scris doar pentru tabele. Până se repară, arăți catalogul direct în Excel sau pe tablă.
2. **S1 · indiciul de la pasul 5 spune 78, corect e 77.** Foaia recalculată dă `=SUM(E2:E4)` = 77, iar lecția scrie și ea 77 la pasul 6. Elevul care a lucrat bine crede că a greșit.
3. **S4 · regula ordinii operațiilor e formulată greșit** („Excel nu calculează de la stânga la dreapta”). Chiar exemplul lecției, `=10-3+2`, dă 9 pentru că se calculează de la stânga la dreapta (recalculat). De spus la clasă: întâi parantezele, apoi * și /, apoi + și -; când operațiile au aceeași prioritate, se face de la stânga la dreapta.
4. **S6 + S7 · prea mult pentru ora 7, și o parte ține de ora 8.** Lecția folosește SUM în 5 locuri (SUM e tema orei 8, conform celor două calendare), predă referințe absolute ($, F4), care nu apar în programa clasei a VIII-a, și are 3.242 de cuvinte, 7 întrebări și 3 exerciții. Estimarea e de ~55–60 de minute, față de ~45 utile. Nucleul orei: pașii 1–3 și 5, misiunea fără pasul 5, ex. 1 cu `=B2+C2+D2+E2`, ex. 3.1. Pasul 7, ex. 2 și provocarea rămân extindere sau temă.
5. **S3 · la răspuns greșit apare „Corect!”.** Testul cu Playwright (browser automat) a ales „+” la prima întrebare. Pe ecran a apărut „❌ Incorect…” și imediat sub el „💡 Corect! Semnul = …”. Același lucru se întâmplă la toate cele 7 întrebări. Avertizează elevii sau explică tu la tablă.
6. **S9 + S10 · unde lucrează și unde salvează elevul.** Răspunsul scris în pagină se salvează pe calculator, nu pe elev. În test, la redeschiderea paginii, textul „elevului din 8A” era tot acolo, pentru următorul elev. Ambele linkuri (Excel Online, Google Sheets) duc la ecranul de autentificare (verificat cu curl), iar lecția nu are variantă pe hârtie pentru Izvoare. Mâine: ex. 3 pe caiet, foaia Excel salvată cu nume și clasă, iar la Izvoare o fișă cu grila catalogului, completată de mână.
7. **S5 + S8 · două afirmații greșite din exemplele cu $ și TVA.** (a) Fără $, ex. 2 nu dă „celule goale”. Foaia executată dă #VALUE! în C4, apoi numere greșite fără nicio eroare (1575, 1800, 700). Asta e capcana de arătat elevilor. (b) Cota de TVA folosită e 19%, dar în Codul fiscal (ANAF, art. 291) cota standard este 21%.

## Importante (nu schimbă ora, dar trebuie reparate)

- **S11 — întrebările nu verifică pasul la care apar.** La pasul 2 se întreabă ce se explică abia la pasul 3. La pasul 4 se întreabă despre SUM, care nu a fost predat. La pasul 5 (ordinea operațiilor) se întreabă despre copierea formulelor. Ordinea operațiilor nu e verificată de nicio întrebare.
- **S12 — F4 nu comută doar între B1 și $B$1.** Microsoft spune că F4 trece prin toate tipurile de referință, iar tabelul lor are 4 tipuri ($A$1, A$1, $A1, A1). Apăsat de două ori, F4 nu te întoarce la B1.
- **S13 — zecimalele sunt scrise cu punct** (=3.5*10, 7.50). Pe setarea regională românească separatorul zecimal e virgula (verificat în Windows cu `CultureInfo ro-RO`), iar Excel folosește separatorul din setările sistemului (Microsoft). Setarea din laborator nu e cunoscută, deci lecția trebuie să arate ambele forme.
- **S14 — lecția nu are nicio diacritică** (0 caractere cu diacritice în 3.322 de cuvinte).

## Minore (grupate)

- **Text:** obiective care nu sunt fraze („Sa aplici 5. atentie la…”) (S16); spații lipsă în întrebări („scrii=A1+B1in loc de=10+5”), numerotare 1–6 pe 7 pași, cuvântul „Ruler” (S18).
- **Cifre afișate:** „9.00”/„7.50” față de ce arată Excel (9 și 7,5), iar la Ion scrie „7”; C5 și D5 lipsesc din tabelul formulelor; E2 apare cu SUM, deși misiunea a folosit adunarea (S19).
- **Pagina:** mesajul „Răspunde corect… pentru a continua” e fals (merge și cu răspuns greșit), iar nota automată „2 – Foarte slab” apare după o singură greșeală (S17).
- **Depinde de echipament:** meniul „Format Cells” e dat doar în engleză (S15); mânerul de completare e descris ca „pătrat negru” (S20); F4 pe laptop poate cere Fn (S21).

## Ce n-am putut verifica și de ce

- **Comportamentul exact al lui `=3.5*10` și numele meniurilor în Excel în română (S13, S15).** Nu am un Excel cu interfață și setare regională românească. Recalcularea s-a făcut în LibreOffice, pe formulele în forma englezească din fișier.
- **Culoarea mânerului de completare și F4 pe laptop sau în Excel Online (S20, S21).** Versiunea Office, tastaturile și conturile din laborator nu sunt cunoscute.
- **Dacă elevii au conturi Microsoft sau Google.** Am verificat doar că linkurile cer autentificare.
- **Timpul real.** Estimarea (~130 de cuvinte/minut, pașii cronometrați în minte) nu vine dintr-o oră ținută efectiv.
