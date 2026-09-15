# Raport: evaluare independentă „Misiunea Diapozitiv” (prezentari-vi, VI-U1)

15.09.2026. Am citit tot jocul: 7 pagini de citit, 36 de întrebări, 2 simulatoare și diploma. L-am comparat cu programa, cu proiectul unității și cu materialul clasei (`clasa_VI_M1.json`). Faptele despre interfață le-am verificat pe text brut Microsoft și Google, luat cu curl. Simulatorul l-am jucat în 25 de cazuri pe iPhone SE, cu 0 nepotriviri, iar capturile le-am făcut pe iPhone SE și Pixel 7, în tema luminoasă și în cea întunecată.

**Semnalări: 10 = 0 blocante · 3 importante · 7 minore. Reparate: 3 (S01, S02, S03). Poarta după reparații: [TRECUT], 68 de întrebări jucate.**

## Ce schimbă ora (de decis de profesor)

1. **S04: provocarea de pe diplomă presupune PowerPoint și calculator.** Provocarea cere „PowerPoint-ul adevărat” și un fișier `.pptx`. Aplicația din laborator nu e cunoscută, iar la Izvoare și Dumbrava Roșie probabil nu există laborator. Propunere: „PowerPoint sau Impress, .pptx sau .odp” și o variantă pe hârtie (schița diapozitivelor).

## Importante (reparate)

- **S01:** pagina N2 lega scurtăturile Ctrl+N/O/S de „orice aplicație”, deși N1 numește Google Slides. Pagina Google spune că în Slides „Fiecare modificare este salvată automat în Drive” și nu are Ctrl+N. Acum scurtăturile sunt legate de PowerPoint, iar Google Slides apare ca excepție.
- **S02:** vânătoarea din N7 anunța 4 greșeli, dar planul nu avea nici cuprins, nici concluzie, deși N3 le predă. Copilul care le marca era penalizat. Am adăugat „cuprinsul” și „concluzia” în plan, deci acum sunt exact 4 greșeli.

## Minore

- **Reparat, S03:** why-ul de la mânere generaliza „mijlocul laturii → lățimea”. Acum spune „latura din dreapta”.
- **Termeni nepredați în pagina nivelului:** S06 (în N1, clasificarea cere litere mari, imagini și fundal, predate abia în N5) și S07 (N4 întreabă de Ctrl+C și de „trimiți în spate”, care nu apar în pagină). Se deduc, dar nu sunt „despre textul citit”.
- **S05, nume de animații:** jocul spune „accentuare / traiectorie”. Pagina Microsoft ro spune „evidențiere” și „cale definită”, așa că pe ecran copilul poate vedea alte cuvinte. Jocul e totuși consecvent cu materialul clasei.
- **S08, mesajul simulatorului:** la „alb pe gri” (contrast 2,68) mesajul repetă regula generală și nu spune că griul e „la mijloc”.
- **S09, tema impusă:** textul spune „jocul tău preferat: șahul”, dar programa cere temă la alegere. E o chestiune de formulare.
- **S10, titlul:** afirmația „titlul e casetă de text” simplifică. În PowerPoint titlul e un substituent (python-pptx: `SlidePlaceholder` cu cadru de text). E acceptabil la clasa a VI-a.

## Ce a ieșit bine (verificat)

- **Scurtăturile și filele**, pe sursa Microsoft ro-ro: Ctrl+N, Ctrl+O, Ctrl+S, Ctrl+M, Ctrl+Z și F5 sunt corecte, la fel fila **Proiectare** (teme), **Tranziții** și **Animații**. Formularea „În PowerPoint…” e prudentă.
- **Simulatorul „diapozitiv”** acceptă toate combinațiile care respectă regulile paginii. La culori: negru/alb, galben/bleumarin, alb/bleumarin, gri deschis/bleumarin, negru/portocaliu, negru/gri, roșu/alb. La rânduri: 3 sau 4 rânduri scurte. Respinge ce le încalcă: contrast sub 4,5, titlu sub 32, text sub 24, text cel puțin cât titlul, rând de peste 6 cuvinte, sub 3 rânduri. Mesajul numește problema exactă. După 2 greșeli apare „Arată-mi răspunsul”. Nu au apărut erori JS.
- **Cheile:** fiecare întrebare are o singură variantă corectă, iar why-urile explică de ce. Faptele despre șah le-am recalculat: 64 de pătrate, 16 piese (1+1+2+2+2+8).
- **Capturile**, în ambele teme și pe ambele telefoane: nimic mai lat decât ecranul, contrast bun, rândurile păstrate și cele scoase se deosebesc clar.

## Ce n-am putut verifica și de ce

- Etichetele exacte din meniurile unui PowerPoint în română (grupurile de animații, „Dublare diapozitiv”, „Ascundere diapozitiv”, „Trimitere în spate”). N-am avut un PowerPoint ro instalat, iar paginile Microsoft descriu operațiile, nu etichetele din meniu.
- Aplicația și versiunea din laboratorul Brauner, adică dacă provocarea poate fi făcută în PowerPoint.
- Faptul că un PDF exportat din PowerPoint încorporează fonturile (why-ul de la N2 Î3). Știu că exportul le încorporează implicit, dar n-am verificat pe o sursă.
