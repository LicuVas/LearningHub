# Evaluare: lectia4-functii (clasa a VIII-a) — pentru Vasile

**Pe scurt:** conținutul e bun și corect la fond (funcțiile, cheile, cele 3 rezolvări — toate recalculate), dar **două adrese de celulă sunt greșite chiar în pașii pe care elevul îi face în Excel**, iar lecția adună două ore din plan într-una.

**Când se ține:** NU acum. Ora 8 „Funcții” = **03.11.2026** la Izvoare și **06.11.2026** la Brauner; ora 9 „Funcția de decizie” = 10.11 / 13.11. Amândouă sunt în Modulul 2 al școlii, după vacanța de toamnă. Ai timp să o repari până atunci.

## Ce schimbă ora (în ordinea greutății)
1. **„Schimbă nota din B4 din 10 în 3”** — în B4 e 5; nota 10 e în B5. Și scenariul din atomul 8, „Schimbăm B7 din 4 în 10” — în B7 e 6; nota 4 e în B8. Am construit foaia exact cum cere lecția: dacă elevul schimbă B7, Excel îi dă minimul 4 și media 7,75, iar tabelul lecției spune 5 și 8. Elevul care a lucrat corect crede că a greșit. *Reparația:* B5 și B8 (și „aveam deja un 10 în B5”). Dovada: `u5_reproducere.txt`.
2. **Nu încape în 50 de minute** (calculul porții: 63 de minute la ritmurile provizorii). Lecția = ora 8 + ora 9 din plan, 9 atomi (specificația zice maximum 8), COUNT/COUNTA în plus față de programă. *Propunere:* ora 8 = Încearcă + atomii 1-4, 6-8 + Ex. 1 (SUM era deja în lecția 3, deci merge repede); ora 9 = IF (atomul 9) + COUNT/COUNTA (atomul 5) + Ex. 3 + Provocarea. Ex. 2 temă sau început de oră 9.
3. **IF e prima formulă cu mai multe argumente scrisă de elev, și e cu virgulă.** Pe un Windows setat pe română separatorul e „;”, iar formula cu virgulă nu e primită. Nu știu ce setare au PC-urile din sala 1 (TIC), deci nu pot spune că se strică — doar că lecția nu-l pregătește pe elev. *Propunere:* o casetă scurtă în atomul 9: „Dacă Excel nu primește formula, înlocuiește virgulele cu punct și virgulă: `=IF(B2>=5;"Promovat";"Corigent")`”.

## Mai mici, dar de reparat
- **Bonusul COUNT/COUNTA:** „șterge o notă și compară” — ambele scad la 7, elevul nu vede nicio diferență. Trebuie „înlocuiește o notă cu textul absent”.
- **„Function Wizard” / „Asistentul de funcții”** nu scrie nicăieri în Excel: caseta se cheamă „Inserare funcție” (Insert Function). La fel „Home -> Number” = „Pornire > Număr > Mărire zecimală” pe interfață în română.
- **Zecimale cu punct** (7.25, 20.71, 60.43): pe Windows în română elevul vede 7,25 și 20,71429. Se repetă din lecțiile 2 și 3.
- **Fără diacritice** (0 la 1000), deși specificația proiectului le cere.
- Atomul 3 întreabă de AVERAGE înainte să fie predat; atomul „butonul fx” nu are întrebare despre fx; la două întrebări răspunsul corect e cel mai lung.

## Ce e bine
Ex. 1 și Ex. 3 sunt curate (cifrele din lecție = cifrele din Excel). Blocul „Copiază” se lipește corect. Numele funcțiilor (SUM, AVERAGE, IF…) sunt exact cele din Excel în română — Microsoft nu le traduce. Afirmațiile despre goluri, text și zero (AVERAGE, COUNT, COUNTA) sunt corecte după documentația Microsoft.

## La Izvoare (fără laborator)
Merge pe hârtie: atomii 1-5, 8, 9 (tabelul IF), Ex. 1 calculat în caiet, Ex. 3 integral. Nu merge: butonul fx și „se actualizează automat”. Pregătește pe tablă tabelul notelor **cu adresele corecte** (B2…B9).

## Ce îți cer să notezi la oră
Unde s-au blocat (lista din `log.json` → anexa „blocaje_probabile_ipoteza”), ce separator primește Excel-ul din laborator și în ce limbă e interfața.
