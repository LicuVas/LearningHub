# Plan reparatie — cls8 / lectia6-proiect

Surse: F_evaluari/cls8/lectia6-proiect (05_evaluare.md, log.json), Q_verdict_blocante.json (cls8-l6-01 -> important, confirmat), M_rezultat.csv (toate intrebarile „propriu” -> nimic de mutat), K_rezultat.csv (ok). P_hibrid / O_orb: nu exista pentru lectie.

| id | decizie | ce / motiv |
|:--|:--|:--|
| cls8-l6-01 | **aplic** | Rezolvarea Ex. 1: structura A=Nr., B=Nume, C:G = 5 materii, H = Media, I = Status; H4 `=AVERAGE(C4:G4)`, I4 `=IF(H4>=5;...)`, sumar C20:C22 pe C4:C18; indiciul IF trece pe H4. Verificat: s_construieste.py + H_randeaza.py xlsx + s_verifica.py (nou 0/15 medii gresite, vechi 13/15). |
| cls8-l6-02 | sar (partial aplic) | Barem / produs notat = decizie de structura (profesor). Aplic doar conventia 3: nume + loc la salvare (pas 1, Ex. 1) si „deschide fisierul tau” la Ex. 2. |
| cls8-l6-03 | **aplic (neutru)** | Fara afirmatii despre regulament (instructiunea profesorului): „decide daca elevul e promovat” -> „exersam functia IF pe medie”, in atomul 2 si la Ex. 1. Nu schimb formula in MIN. |
| cls8-l6-04 | **aplic** | Pasul 6 (printare), atomul 5, pasii 6-7 din Ex. 2 marcate „optional” printr-o fraza; BONUS COUNTIF marcat „optional” si scoasa promisiunea falsa „o vei invata complet in semestrul urmator”. Inlocuirea cu sortarea = structura, sar. |
| cls8-l6-05 | sar | Varianta pe caiet pentru Izvoare / mutarea orei = decizie de structura. |
| cls8-l6-06 | **aplic** | Blocul de lipit trece pe virgula zecimala (conventia 2) + „(sau 7.50, dupa calculator)” + caseta de separator; indiciul „Convert to Number” (nu repara un punct) inlocuit cu Ctrl+H virgula <-> punct. |
| cls8-l6-07 | **aplic** | Nume din glosar: Îmbinare & centru (Merge & Center), Pornire (Home), Aspect pagină (Page Layout), Margini: Îngust (Narrow), Inserare > antet & subsol (Insert > Header & Footer), Coloană grupată (Clustered Column); restul englezei cu nota „butonul cu aceeasi pictograma”. Fraza „In Excel Online marginile nu se pot seta” (sursa: surse/margini_ro.txt „Deși Excel pentru web nu acceptă setarea marginilor de pagină”). |
| cls8-l6-08 | **aplic** | Ex. 1: „clasa imaginara, nume si note inventate (nu ale colegilor reali)”; scos „sau reale, daca vrei” si „materiile si notele tale reale” din rezolvare. |
| cls8-l6-09 | **aplic** | Indiciu nou la Ex. 2: verifica axa verticala, Minimum = 0 (sursa: surse/axa_ro.txt „caseta Minim sau Maxim”). |
| cls8-l6-10 | sar | Diacriticele vin in valul separat (conventia 5). |
| cls8-l6-11 | aplic partial | Anul 2024-2025 -> 2026-2027 in titlul catalogului. Cardul „Buget Personal” e in index.html al modulului = alt fisier, interzis. |
| cls8-l6-12 | sar | Timpul orei / impartirea lectiei = decizie de structura. |
| nou-sep | **aplic** | Formule cu mai multe argumente (IF, COUNTIF) in ambele forme `;` / `,`; caseta o singura data inainte de prima formula cu mai multe argumente. |
| nou-ex3 | **aplic** | Ex. 3 „Notele ca numere (7.50)” -> „(7,50 sau 7.50, dupa calculator)”. |
