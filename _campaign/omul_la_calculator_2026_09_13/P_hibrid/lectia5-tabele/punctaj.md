# Punctaj hibrid v3 — lectia5-tabele (cls. VII, M1 Word)

Adevăr: 29 probleme (26 confirmate de judecător + 3 ratate de ambele rapoarte); 9 importante/blocante; 2 care schimbă ora. Cheie: X = v2, Y = control.

## Recall

| Evaluare | Total | Importante+blocante | Schimbă ora |
|---|---|---|---|
| hibrid | 0.55 | 0.94 | 1.00 |
| v2 | 0.38 | 0.78 | 1.00 |
| control | 0.79 | 0.89 | 0.50 |

Semnalări hibrid în plus (care nu corespund adevărului): 14 → adevărate noi 9, false 2, neverificabile 3.

## Potriviri

| Adevăr | Gravitate | Schimbă ora | Hibrid | Semnalare | De ce |
|---|---|---|---|---|---|
| P1 (X1+Y1): Lecția e mult prea mare pentru o oră de 50 min (11 atomi, 3 exerciții  | blocant | da | da | S02 | Numără cuvintele (8.447) și cei 11 pași față de specificație; blocant, schimbă ora. |
| P2 (X2+Y3): Ctrl+A în tabel NU selectează celula apoi tabelul; în Word selectează  | important | nu | da | S06 | Aceeași afirmație greșită despre Ctrl+A, cu sursa Microsoft și contradicția cu întrebarea de la pasul 4. |
| P3 (X3+Y4): Backspace pe rând/coloană/tabel selectat șterge STRUCTURA, nu doar con | important | nu | da | S07 | Semnalează că Backspace nu golește doar conținutul; dovedit doar pentru tabelul întreg, rândul/coloana rămân neverificate, dar greșeala din lecție e aceeași. |
| P4 (X4): Provocarea: îmbinarea primului rând după conversie amestecă un elev cu | minor | nu | da | S16 | Aceeași problemă, executată cu python-docx (rămân 4 elevi din 5). |
| P5 (X5): Lecția nu acoperă imaginile, deși cele 2 ore din plan (4 și 7) cer tex | important | da | da | S01 | Spune explicit că imaginile cerute de orele 4 și 7 din plan lipsesc. |
| P6 (X6+Y6a): Interfața e numită aproape doar în engleză; Word în română are alte nu | important | nu | da | S04 | Numele din interfață doar în engleză față de Word în română (Pornire/Inserare/Aspect), cu sursă ro-ro. |
| P7 (X7+Y6b): Nicio imagine și niciun tabel real într-o lecție despre tabele | important | nu | da | S03 | 0 <img>, cursoarele descrise doar în cuvinte; nu pomenește explicit lipsa unui <table> real, dar miezul e același. |
| P8 (X8+Y19): Lecția e fără diacritice, inclusiv textele de tastat în formular | important | nu | da | S08 | Aceeași numărare: un singur diacritic, plus specificația r.401. |
| P9 (X9+Y10): Ex.2 pas 7: 'rândul de sus al coloanei Observații' e o singură celulă; | minor | nu | da | S12 | Pasul 7 din Ex2 e o singură celulă, iar rezolvarea nu pomenește pasul. |
| P10 (X10+Y13a): AutoFit Window NU egalizează coloanele (Ex.1 promite 'distribuite egal | minor | nu | da | S14 | Contradicția proporțional/egal și trimiterea la Distribute Columns. |
| P11 (X11): Ctrl+Alt+V nu mai deschide Paste Special în Word actual (lipește forma | minor | nu | nu |  | Ctrl+Alt+V (linia 1613 din lecție) nu apare în nicio semnalare. |
| P12 (Y13b): Ex.1: pauza '10:50-11:10' contrazice orarul 50+10 min dat în același e | minor | nu | da | S18 | Aceeași suprapunere a pauzei 10:50-11:10 cu ora 11:00. |
| P13 (Y2): Formatarea paginii (antet, subsol, numerotare) e obiectiv declarat, da | important | nu | partial | S01 | S01 spune că pagina ține de ora 7 și trebuie mutată, dar nu spune că obiectivul despre pagină nu e exersat (o singură întrebare, doar Portrait în Ex3). |
| P14 (Y5): Două tab-uri 'Layout' (pagină și tabel) numite identic, fără distincți | important | nu | da | S05 | Cele două file Layout/Aspect cu același nume, nedistinse în lecție. |
| P15 (Y7): Lipsește activitatea de pornire (try-section) / exemplul înaintea defi | minor | nu | nu |  | Nicio semnalare despre activitatea de pornire sau exemplul înaintea definiției. |
| P16 (Y8): Obiectivele (6) nu acoperă îmbinarea, dimensionarea, stilurile, chenar | minor | nu | da | S15 | Obiectivele (6) nu acoperă îmbinarea, dimensionarea, stilurile, chenarele și conversia. |
| P17 (Y9): Ex.2: 'fapte' nesusținute despre browsere și termenul Excel 'formatare | minor | nu | da | S13+S30 | Faptele fără sursă despre browsere (S13) și termenul Excel „formatare condiționată” (S30). |
| P18 (Y11): Exercițiile nu cer ștergere rând/coloană, Split Cells/Table, conversie | minor | nu | nu |  | Nu spune că exercițiile nu cer ștergere, Split sau conversie; S01 vorbește despre altceva (formatare de text nepredată). |
| P19 (Y12): Rezolvările sunt pași, fără rezultat de comparat | minor | nu | nu |  | Nu spune că rezolvările sunt doar pași, fără rezultat de comparat. |
| P20 (Y14): Chestionare: 1 întrebare, 3 variante, distractori ușor de eliminat | minor | nu | nu |  | Nu spune nimic despre distractorii slabi; S29 e altă problemă (clicul lipsă din răspunsul corect). |
| P21 (Y15): Chestionar HTML static divergent de data-quiz | minor | nu | nu |  | Nu observă chestionarul HTML static diferit de data-quiz. |
| P22 (Y16): Inexactități mărunte: clic triplu, margini Wide/Moderate, '2 cm' vs 2, | minor | nu | partial | S20+S24 | Prinde marginile Wide/Moderate, „2 cm” și clicul triplu; lipsesc colțul proporțional și zecimalele cu punct. |
| P23 (Y17): Repetiții (Enter/Tab, Delete vs structură de 4-5 ori) | minor | nu | nu |  | Nicio semnalare despre repetiții. |
| P24 (Y18): Lipsește Repeat Header Rows la tabele lungi | minor | nu | nu |  | Nu pomenește Repeat Header Rows. |
| P25 (Y20): Lipsește stratul pentru profesor: timp, barem, legătura cu descriptori | minor | nu | nu |  | Nu semnalează lipsa informațiilor pentru profesor (timp, barem, descriptori). |
| P26 (Y21): Rezumat = titluri de atomi; 'următoarea lecție' generică deși urmează  | minor | nu | nu |  | Nu atinge rezumatul sau „lecția următoare” generică; S21 critică CONȚINUTUL notei de programă, nu faptul că nota stă în pas. |
| R1 (ratat de amândouă): Ordinea lecțiilor din sit nu urmează planul anului: în plan ora 5 = ed | minor | nespecificat | partial | S01 | S01 arată că lecția nu urmează orele din plan (4-7 amestecate), dar nu spune că pe sit formatarea (lecțiile 2-4) vine ÎNAINTEA tabelelor, invers față de plan. |
| R2 (ratat de amândouă): Lecția 6 (evaluarea modulului) are 20 de mențiuni despre imagini, deși | minor | nespecificat | nu |  | Nu pomenește lectia6-evaluare și nici faptul că imaginile sunt evaluate fără să fi fost predate. |
| R3 (ratat de amândouă): Niciun raport n-a verificat comportamentele în Word (Ctrl+A, Backspace | minor | nespecificat | partial | S06+S07+S14 | Ctrl+A, Backspace și AutoFit sunt sprijinite pe surse Microsoft, nu testate în Word (rândul/coloana la Backspace, neverificate); Ctrl+Alt+V ratat. |

## Semnalări în plus

| Id | Verdict | Gravitate | Dovadă |
|---|---|---|---|
| S09 | adevarat_nou | minor | atomic-learning.js r.405 „Still allow progression but with penalty recorded”; r.640 mesajul „Raspunde corect la intrebarile anterioare pentru a continua”: textul promite o blocare pe care codul nu o face. |
| S10 | adevarat_nou | important | practice-simple.js r.211/225: cheia localStorage = `practice-${lessonId}`, fără elev; r.106 „minim 10 caractere pentru a fi considerat complet”; r.218 „Each completed exercise counts as correct”. Pe un calculator folosit de mai mulți elevi, progresul se amestecă. |
| S11 | adevarat_nou | minor | Lecția, r.2038-2042/2191/2350: nume fixe „Orar_Scolar.docx”, „Comparatie_Browsere.docx”, „Formular_Inscriere.docx”; doar la Ex1 apare „intr-un folder dedicat”, fără cale și fără numele elevului. Suprascrierea depinde de cum e organizat laboratorul, de aceea minor. |
| S17 | fals | n/a | r.2423: „daca un rand ar contine, din greseala, doua virgule in loc de una”. Citirea firească e o virgulă dublată din greșeală într-un loc („9,, 2”), nu numărul total de virgule din rând. Întrebarea nu e greșită. |
| S19 | adevarat_nou | minor | r.1603: textul „Popescu Ion, 8, 9, 7[Enter]Ionescu Ana, 10, 9, 10” nu are rând de antet, dar lecția promite coloanele „(Nume, Nota1, Nota2, Nota3)”. Partea cu spațiul de la începutul celulelor nu am verificat-o în Word. |
| S21 | adevarat_nou | minor | C:\00\AI_0\data\informatica_gimnaziu\curriculum.json r.684: „Operaţii de formatare a unui document: text, imagine, tabel, pagină” e un singur punct; lecția r.1688 spune „continut obligatoriu distinct”. Exagerarea e mică. |
| S22 | neverificabil | minor | Lecția r.1400-1410 pomenește Eraser lângă Border Painter (Table Design). Nu am găsit o pagină Microsoft în text brut despre locul lui Eraser, iar Word nu are voie să fie pornit. |
| S23 | neverificabil | minor | r.1254: „selectand primul stil din galerie: Clear (sau Plain Table)”. Pagina Microsoft despre stilurile de tabel n-a putut fi luată (URL ghicit = pagină goală), iar Word nu are voie să fie pornit. Din cunoștințe, afirmația pare adevărată (primul e Table Grid, Clear e jos), dar nu e dovedită. |
| S25 | adevarat_nou | minor | MS en-us „Import or export text (.txt or .csv) files” (curl, text brut): „Change the default list separator for saving files as text (.csv) in Excel … use a semi-colon as the default list separator”, prin Setările regionale din Windows. Deci separatorul CSV depinde de setarea regională. |
| S26 | adevarat_nou | minor | Grep în lecție: „evidientiate” r.1996, „bifeza” r.2334, „patratulul” r.1874 (plus „primul apas”). |
| S27 | adevarat_nou | minor | MS en-us „Keyboard shortcuts in Word” (curl, text brut): „Print the document. Ctrl+P · Switch to print preview. Ctrl+Alt+I”. Lecția r.1442/1913/2305/2347: „Print Preview (Ctrl+P)”. Efectul practic e mic, pentru că ecranul Print arată și previzualizarea. |
| S28 | fals | n/a | r.2290-2292: la rândul 8, „Data:” și „Semnatura:” stau în celule îmbinate, cu instrucțiunea „Lasa suficient spatiu dupa fiecare eticheta pentru completare manuala”, deci locul de completare e prevăzut în aceeași celulă. Pasul 10 e vag, dar pasul 11 îl lămurește (linii sub câmpuri). Nu e un defect. |
| S29 | adevarat_nou | minor | r.523: răspunsul corect (b) spune „Pozitionezi cursorul deasupra coloanei pana apare sageata neagra”, fără clic; r.562/608 spun „click deasupra coloanei”. |
| S31 | neverificabil | minor | r.923: „textul va fi plasat in prima sub-celula rezultata”. Comportamentul la mai multe paragrafe cere test în Word (interzis) sau o sursă Microsoft pe care n-am găsit-o. |

## Concluzie

1. Pe problemele care contează, hibridul e cel mai bun: importante+blocante 0.94 (control 0.89, v2 0.78), iar pe cele care schimbă ora 1.00, la egalitate cu v2 (controlul are 0.50).
2. Pe total, controlul rămâne în față (0.79 față de 0.55), pentru că prinde multe probleme minore de pedagogie și formă (try-section, repetiții, chestionare, stratul pentru profesor, Repeat Header Rows); hibridul ratează și Ctrl+Alt+V.
3. Hibridul aduce 9 probleme adevărate noi, printre care una importantă: progresul salvat în localStorage fără numele elevului, pe calculatoare folosite de mai mulți. Are 2 semnalări false, ambele minore, și 3 neverificabile fără Word.
