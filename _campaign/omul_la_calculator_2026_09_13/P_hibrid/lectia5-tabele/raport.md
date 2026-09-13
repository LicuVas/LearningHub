# Raport — „Tabele în Word” (clasa a VII-a), protocolul hibrid v3

Cele 31 de semnalări: **1 blocantă, 12 importante, 18 minore**. 22 vin din trecerea a doua (lucrul la calculator), 9 din prima (citire). Cum sunt verificate: 8 executate, 8 pe sursă, 3 recalculate, 7 citite, 5 neverificate. Detaliile sunt în `semnalari.json`, iar fiecare element al lecției are rândul lui în `harta_acoperirii.md`.
Dovezile se află în `executie/` (scripturile și ieșirile lor), `randat_docx/` (exercițiile randate în PDF și PNG) și `surse/` (paginile Microsoft descărcate cu curl).

## Ce schimbă ora de mâine

1. **S02 (blocant) — lecția nu încape în oră.** Are 8.447 de cuvinte, adică 47-70 de minute doar de citit, și 11 pași, deși specificația cere 5-8. *Schimbare:* mâine citiți pașii 1-5 și faceți doar Ex1, fără partea lui de formatare. Restul trece la ora 7.
2. **S01 — lecția nu corespunde nicio oră din plan.** Planul pune tabelul ca obiect la ora 4 (29.09 la VII A, 02.10 la 7 MA), iar formatarea tabelului și a paginii la ora 7 (20.10 / 23.10). Lecția le face pe amândouă și cere în exerciții Bold, 12 pt și Font Color, care se predau abia la ora 6. Imaginile, cerute la ambele ore, lipsesc. *Schimbare:* ora 4 = pașii 1-5; ora 7 = pașii 6-11 plus Ex2 și Ex3.
3. **S05 — două file cu același nume.** Când cursorul e în tabel, apar două file „Layout”; în Word românesc, ambele se numesc „Aspect”. Microsoft (ro) le numește pe amândouă „fila Aspect”, una pentru margini, cealaltă pentru conversia tabelului. Întrebarea 11 are răspunsul „Layout”, iar elevul cu cursorul în tabel caută marginile în fila greșită. *Schimbare:* numiți-le „Aspect al paginii” și „Aspect al tabelului”, iar la pagină elevul iese întâi din tabel.
4. **S04 — meniurile sunt doar în engleză.** Insert apare de 45 de ori, Layout de 32, Home de 5; „Pornire” nu apare deloc. Word în română scrie Pornire / Inserare / Proiectare / Aspect (sursă: pagina Microsoft ro de scurtături). Limba din laborator e necunoscută. *Schimbare:* scrieți ambele denumiri la fiecare comandă.
5. **S10 — pe calculatorul comun, elevul vede munca altuia.** Testat cu Playwright: al doilea elev, în același browser, vede textul salvat de primul și găsește pașii deja rezolvați. Salvarea se face sub o cheie fără nume de elev, iar orice text de 10 caractere contează ca exercițiu „complet”. *Schimbare:* la începutul orei apăsați „Reia lecția”; exercițiul se predă ca fișier .docx.
6. **S11 — fișierele se suprascriu.** Numele sunt fixe (`Orar_Scolar.docx` etc.) și nu se spune unde se salvează, deci pe calculatorul folosit de două clase fișierul unui elev îl înlocuiește pe al celuilalt. *Schimbare:* dictați calea și numele, de exemplu `Documente\TIC_7A\Orar_NumePrenume.docx`.
7. **S03 — la Izvoare/Dumbrava Roșie (ipoteza: fără laborator) lecția nu merge.** Nu există nicio imagine cu Word, toate cele 3 exerciții se fac în Word și nu există variantă pe hârtie. *Schimbare:* orarul se desenează pe foaie ca grilă, cu marcarea celulelor de îmbinat și a stilului ales. E „important” și nu „blocant” pentru că sala e o ipoteză.

## Celelalte importante

- **S06 — Ctrl+A e descris greșit.** Lecția spune că prima apăsare selectează celula și a doua tabelul. Microsoft: „Select all document content. Ctrl+A”; pentru tot tabelul scurtătura e Alt+5 (tastatura numerică). Chiar varianta de la întrebarea 4 spune „Ctrl+A pentru tot documentul”.
- **S07 — Backspace e trecut ca „șterge doar conținutul”.** Microsoft („Delete a table”): cu pătrățelul tabelului selectat, Backspace șterge tabelul; Delete golește doar celulele.
- **S08 — lipsesc diacriticele.** O singură literă cu diacritic în 8.488 de cuvinte; specificația sitului le cere în conținut.
- **S12 — Ex2, pasul 7 nu se poate face.** „Rândul de sus al coloanei Observații” e o singură celulă (verificat cu python-docx), iar rezolvarea sare peste pas.
- **S14 — AutoFit Window e descris în două feluri.** Pasul 7 spune „proporțional”, Ex1 spune „coloane distribuite egal”. Coloanele egale le face Distribute Columns; Microsoft descrie AutoFit Window doar ca potrivire la spațiul disponibil.
- **S16 — Provocarea pierde date.** Îmbinarea primului rând după conversie înghite datele primului elev (executat: celula ajunge cu „Ana / 9 / 2”). Asta contrazice metoda din pasul 6: inserezi un rând deasupra, apoi îmbini.

## Minorele, pe grupe

- **Cifre și logică:** pauza 10:50-11:10 se suprapune peste ora 11:00 (S18); întrebarea „două virgule în loc de una” numără greșit, fiecare rând are deja două (S17); exemplul cu notele din email nu are antet, iar celulele încep cu spațiu (S19); marginile Wide/Moderate sunt aproximate (S20, neverificat).
- **Exerciții:** Ex2 dă fapte despre browsere fără sursă, iar regula semaforului nu acoperă 4 din 8 valori (S13); „formatare condiționată” e termen de Excel (S30); Ex3 are pasul 10 vag și nicio celulă goală pe rândul Dată/Semnătură (S28).
- **Afirmații de verificat în Word-ul din laborator:** triplu-clic (S24), „Clear” ca prim stil (S23), locul Eraser (S22), textul după Split Cells (S31).
- **Formulări:** Ctrl+P deschide ecranul Imprimare, nu „Print Preview” (S27); CSV-ul din Excel pe setări românești folosește „;” (S25); programa nu face din pagină un conținut „distinct” (S21); obiectivele nu corespund celor 11 teme (S15); răspunsul de la întrebarea 4 omite clicul (S29); mesajul „Răspunde corect… pentru a continua” nu e adevărat, trecerea merge și cu răspuns greșit (S09, executat); greșeli de scriere: evidientiate, bifeza, patratulul (S26).

## Ce n-am putut verifica și de ce

- **Comportamentul real din Word** (triplu-clic, Clear, Eraser, Split Cells, Backspace pe un rând întreg, AutoFit Window pe coloane inegale, valorile marginilor): pe mașina de test nu există Word, iar LibreOffice nu reproduce aceste comenzi. De aceea sunt marcate `neverificat` sau sprijinite doar pe sursa Microsoft.
- **Faptele despre browsere** (memorie, viteză): nu am căutat o sursă datată; nu schimbă ora.
- **Dotarea din laborator** (versiunea Office, limba, setarea regională) și existența laboratorului la Izvoare sunt necunoscute. Semnalările care depind de ele (S03, S04, S05, S25) propun variante care merg în ambele situații.
- **Exercițiile au fost executate în python-docx și randate cu LibreOffice.** Ex1 și Ex3 ies corect și încap pe o pagină. Asta arată că pașii au sens, nu că un elev îi poate urma în Word românesc în timpul orei.
