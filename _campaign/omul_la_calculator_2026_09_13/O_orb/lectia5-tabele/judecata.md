# Judecată independentă — lecția 5 „Tabele în Word” (cls. a VII-a)

Verificare făcută pe HTML-ul lecției, pe planificările anului, pe specificația sitului și prin test real în Word 16.0 (build 20326, automatizare invizibilă) + pagina Microsoft de scurtături.

## Rezumat
| | adevărate | false | neverif. | blocant | important | minor | schimbă ora | unice adev. | unice imp./bloc. |
|---|---|---|---|---|---|---|---|---|---|
| X | 11 | 0 | 0 | 1 | 6 | 4 | 2 | 3 | 1 |
| Y | 23 | 0 | 0 | 1 | 7 | 15 | 1 | 15 | 2 |

## Toate problemele
| ID | Problema | Găsită de | Verdict | Gravitate | Schimbă ora | Dovedit X | Dovedit Y |
|---|---|---|---|---|---|---|---|
| P1 (X1+Y1) | Lecția e mult prea mare pentru o oră de 50 min (11 atomi, 3 exerciții lungi) | ambele | adevarat | blocant | da | dovedit | afirmat |
| P2 (X2+Y3) | Ctrl+A în tabel NU selectează celula apoi tabelul; în Word selectează tot documentul | ambele | adevarat | important | nu | afirmat | afirmat |
| P3 (X3+Y4) | Backspace pe rând/coloană/tabel selectat șterge STRUCTURA, nu doar conținutul (lecția spune invers) | ambele | adevarat | important | nu | afirmat | afirmat |
| P4 (X4) | Provocarea: îmbinarea primului rând după conversie amestecă un elev cu titlul | X | adevarat | minor | nu | dovedit | n/a |
| P5 (X5) | Lecția nu acoperă imaginile, deși cele 2 ore din plan (4 și 7) cer text/imagini/tabele și formatarea imaginii | X | adevarat | important | da | dovedit | n/a |
| P6 (X6+Y6a) | Interfața e numită aproape doar în engleză; Word în română are alte nume | ambele | adevarat | important | nu | dovedit | dovedit |
| P7 (X7+Y6b) | Nicio imagine și niciun tabel real într-o lecție despre tabele | ambele | adevarat | important | nu | dovedit | afirmat |
| P8 (X8+Y19) | Lecția e fără diacritice, inclusiv textele de tastat în formular | ambele | adevarat | important | nu | dovedit | dovedit |
| P9 (X9+Y10) | Ex.2 pas 7: 'rândul de sus al coloanei Observații' e o singură celulă; rezolvarea nu pomenește pasul | ambele | adevarat | minor | nu | dovedit | dovedit |
| P10 (X10+Y13a) | AutoFit Window NU egalizează coloanele (Ex.1 promite 'distribuite egal') | ambele | adevarat | minor | nu | afirmat | afirmat |
| P11 (X11) | Ctrl+Alt+V nu mai deschide Paste Special în Word actual (lipește formatarea); text simplu = Ctrl+Shift+V | X | adevarat | minor | nu | afirmat | n/a |
| P12 (Y13b) | Ex.1: pauza '10:50-11:10' contrazice orarul 50+10 min dat în același exercițiu | Y | adevarat | minor | nu | n/a | dovedit |
| P13 (Y2) | Formatarea paginii (antet, subsol, numerotare) e obiectiv declarat, dar nu e exersată; 1 singură întrebare | Y | adevarat | important | nu | n/a | dovedit |
| P14 (Y5) | Două tab-uri 'Layout' (pagină și tabel) numite identic, fără distincție | Y | adevarat | important | nu | n/a | afirmat |
| P15 (Y7) | Lipsește activitatea de pornire (try-section) / exemplul înaintea definiției | Y | adevarat | minor | nu | n/a | afirmat |
| P16 (Y8) | Obiectivele (6) nu acoperă îmbinarea, dimensionarea, stilurile, chenarele, conversia | Y | adevarat | minor | nu | n/a | dovedit |
| P17 (Y9) | Ex.2: 'fapte' nesusținute despre browsere și termenul Excel 'formatare condițională' | Y | adevarat | minor | nu | n/a | dovedit |
| P18 (Y11) | Exercițiile nu cer ștergere rând/coloană, Split Cells/Table, conversie, antet/subsol | Y | adevarat | minor | nu | n/a | dovedit |
| P19 (Y12) | Rezolvările sunt pași, fără rezultat de comparat | Y | adevarat | minor | nu | n/a | dovedit |
| P20 (Y14) | Chestionare: 1 întrebare, 3 variante, distractori ușor de eliminat | Y | adevarat | minor | nu | n/a | dovedit |
| P21 (Y15) | Chestionar HTML static divergent de data-quiz | Y | adevarat | minor | nu | n/a | dovedit |
| P22 (Y16) | Inexactități mărunte: clic triplu, margini Wide/Moderate, '2 cm' vs 2,54, colț proporțional, zecimale cu punct | Y | adevarat | minor | nu | n/a | afirmat |
| P23 (Y17) | Repetiții (Enter/Tab, Delete vs structură de 4-5 ori) | Y | adevarat | minor | nu | n/a | dovedit |
| P24 (Y18) | Lipsește Repeat Header Rows la tabele lungi | Y | adevarat | minor | nu | n/a | dovedit |
| P25 (Y20) | Lipsește stratul pentru profesor: timp, barem, legătura cu descriptorii | Y | adevarat | minor | nu | n/a | afirmat |
| P26 (Y21) | Rezumat = titluri de atomi; 'următoarea lecție' generică deși urmează evaluarea; notă de programă în atom | Y | adevarat | minor | nu | n/a | dovedit |

## Dovezile judecătorului
- **P1 (X1+Y1)** — 11 atomi (spec: 4-8); fiecare atom are 320-587 cuvinte fără chestionar (spec max 300); 5.078 cuvinte doar în atomi + 1.829 în exerciții. La ~120 cuv/min un elev de 13 ani citește doar atomii în ~42 min, fără Word. Sub-afirmație Y falsă: 'nu mai există loc' pentru formatarea paginii — situl are m2-word-avansat/lectia4-header-footer.html, iar planul are ora 8 despre estetica paginii.
- **P2 (X2+Y3)** — Test Word 16.0 build 20326 prin COM (invizibil): FindKey(Ctrl+A).Command = EditSelectAll; pagina Microsoft 'Keyboard shortcuts in Word': 'Select all document content. Ctrl+A'. Lecția (scurtături) spune 'primul apas selecteaza textul din celula curenta; al doilea apas selecteaza tot tabelul', iar chestionarul atomului 4 spune chiar 'Ctrl+A pentru tot documentul'.
- **P3 (X3+Y4)** — Test Word COM, Selection.TypeBackspace: rând 2 selectat -> tabelul trece de la 5 la 4 rânduri; coloană selectată -> de la 3 la 2 coloane; tot tabelul selectat -> 0 tabele. Delete = EditClear (golește). Lecția (Greșeli frecvente 2 + tabelul de scurtături) spune 'Backspace ... sterge doar continutul'.
- **P4 (X4)** — Textul provocării: '5 randuri de text, fiecare cu 3 valori despre elevi' (fără rând de antet), apoi 'imbina (Merge Cells) primul rand ... si scrie acolo un titlu'. Merge păstrează conținutul (atomul 6 o spune), deci rândul 1 = elev + titlu, rămân 4 elevi. Secțiune opțională ('Vrei mai mult?').
- **P5 (X5)** — Calendar_ore_VII_A.md: 29.09.2026 ora 4 'Obiecte într-un document: text, imagini, tabele'; 20.10.2026 ora 7 'Formatarea imaginii, a tabelului și a paginii' (7_MA: 02.10 și 23.10). Lecția: 0 atomi despre imagini; lecțiile M1 1-5 nu predau inserarea imaginii (0 potriviri Pictures/inserare imagine), dar lectia6-evaluare.html are 20 de mențiuni. Nuanță: situl are m2-word-avansat/lectia5-imagini-obiecte.html.
- **P6 (X6+Y6a)** — Lecția: 'Table Design', 'Layout', 'AutoFit Window', 'Banded Rows', 'Borders and Shading'; traduceri doar sporadice ('Insert (Inserare)', 'Margins (Margini)'). Limba Word din laborator e necunoscută (Word-ul de pe acest PC e UI engleză, LangID 1033) — gravitatea depinde de laborator.
- **P7 (X7+Y6b)** — În HTML: <table = 0, <img = 0; exemplul de conversie e doar text; mânerul de mutare, săgeata neagră etc. sunt descrise în cuvinte. Sub-afirmația X 'la Izvoare, fără calculator' = neverificabilă aici.
- **P8 (X8+Y19)** — În tot textul vizibil: 1 singur caracter cu diacritic ('imporți'); 'FORMULAR DE INSCRIERE', 'Orar_Scolar'. Spec LESSON_SPECIFICATION.md r.401: 'Use proper ă, â, î, ș, ț in body text'.
- **P9 (X9+Y10)** — Pas 7: 'Imbina celulele din randul de sus al coloanei "Observatii" daca vrei...'; rezolvarea Ex.2 (Insert-Table 5x5, Shading, Table Style Options, Distribute Columns) nu conține îmbinare. Pasul e condițional ('daca vrei').
- **P10 (X10+Y13a)** — Test Word COM: coloane 50/100/150 pt -> după AutoFitBehavior(wdAutoFitWindow) 75,6/151,2/226,8 (proporțional, nu egal); tabel nou 6 coloane: 75,6 x6 înainte și după (nicio schimbare vizibilă). Atomul 7 al lecției spune corect 'proportional'.
- **P11 (X11)** — Word 16 build 20326: FindKey(Ctrl+Alt+V) = PasteFormat, FindKey(Ctrl+Shift+V) = PasteTextOnly; pagina Microsoft: 'Paste the selected text formatting. Ctrl+Alt+V'. În versiuni vechi (2010-2016) Ctrl+Alt+V era Paste Special — versiunea din laborator necunoscută. Ctrl+Alt+V apare și în lectia2 (5x) și lectia3 (1x), nu în lectia4 ('a treia la rând' e ușor inexact).
- **P12 (Y13b)** — Pas 3: '8:00-8:50, 9:00-9:50, 10:00-10:50 si asa mai departe'; indiciu: '"Pauza" la ora 10:50-11:10' — se suprapune cu ora care începe la 11:00.
- **P13 (Y2)** — Obiectiv: 'Sa aplici formatarea paginii: margini, orientare, dimensiune, antet, subsol si numerotarea paginilor'; în exerciții singura cerință de pagină e 'orientare Portrait' (Ex.3); chestionarul atomului 11 are o întrebare. Planul pune pagina la ora 7.
- **P14 (Y5)** — Lecția folosește 'Layout > Delete / Merge / Alignment' (tab contextual de tabel) și 'Layout > Margins / Orientation' (tab de pagină) fără a spune că sunt două; chestionarul atomului 11 are răspunsul 'Layout'. În Word 2013-365 tab-ul contextual al tabelului se afișează ca 'Layout' (Table Tools) lângă 'Layout' al documentului.
- **P15 (Y7)** — Lecția: 0 'try-section'; atomul 1 începe cu definiția. Sub-afirmație falsă: 'Celelalte lecții ale platformei au try-section' — în modulul M1 nicio lecție (0/6) nu o are, deși spec (r.256) o prevede.
- **P16 (Y8)** — Lista 'Dupa aceasta lectie vei putea': folosire, inserare, navigare, selecție, adăugare/ștergere, formatarea paginii — lipsesc atomii 6-10.
- **P17 (Y9)** — 'Firefox - "Foarte rapida"', 'Edge - "Mic"' (consum memorie) fără sursă; 'formatarea conditionala prin culori (semafor)' — colorarea din exercițiu e Shading manual.
- **P18 (Y11)** — Split Cells/Split Table apar doar în atomul 6; 'Delete Rows' doar în atom și sfaturi; conversia doar în 'Vrei mai mult?'.
- **P19 (Y12)** — 0 imagini; rezolvările reiau pașii ('Insert - Table, selecteaza grila la 6x8...').
- **P20 (Y14)** — Fiecare data-quiz are 1 întrebare cu 3 variante — conform spec (1-2 întrebări, 3-4 variante), deci nu e abatere; distractori slabi adevărat (ex. atom 4: varianta greșită conține chiar 'pentru tot documentul').
- **P21 (Y15)** — Static atom-1: 'Fac documentul mai lung'; data-quiz: 'Adauga culoare si aspect placut documentului'; atomic-learning.js r.196 face container.innerHTML (le înlocuiește). Sub-afirmație falsă: 'gol, ca în celelalte lecții' — toate lecțiile M1 au quiz static (10-11 blocuri).
- **P22 (Y16)** — Textul confirmă toate citatele; Wide = 5,08 cm st/dr și Moderate = 1,91 cm doar st/dr (valori standard Office, neverificate instrumental aici); clic triplu selectează paragraful (cunoscut); 'colțul păstrează proporțiile' neverificat.
- **P23 (Y17)** — Delete vs structură: atomul 5 (2x), Greșeli frecvente 2, scurtături Backspace + Delete.
- **P24 (Y18)** — 'Repeat' apare de 0 ori în lecție.
- **P25 (Y20)** — 0 'profesor', 0 'minute', 0 'barem'. Parțial: Ex.3 are 'Criterii:' (fără punctaj) — Y spune 'nicăieri ... barem pentru ex. 3'.
- **P26 (Y21)** — 'Continua cu lectia urmatoare pentru a aprofunda cunostintele.'; în modul urmează lectia6-evaluare.html; atomul 11: 'Conform programei scolare OMEN 3393/2017...'.

## Ce au ratat
- **Doar X a ratat:** P13 (Y2): Formatarea paginii (antet, subsol, numerotare) e obiectiv declarat, dar nu e exersată; 1 singură întrebare; P14 (Y5): Două tab-uri 'Layout' (pagină și tabel) numite identic, fără distincție; Probleme minore de structură/chestionare/exerciții semnalate doar de Y (P12, P15-P26)
- **Doar Y a ratat:** P4 (X4): Provocarea: îmbinarea primului rând după conversie amestecă un elev cu titlul; P5 (X5): Lecția nu acoperă imaginile, deși cele 2 ore din plan (4 și 7) cer text/imagini/tabele și formatarea imaginii; P11 (X11): Ctrl+Alt+V nu mai deschide Paste Special în Word actual (lipește formatarea); text simplu = Ctrl+Shift+V
- **Amândouă:** Ordinea lecțiilor din sit nu urmează planul anului: în plan ora 5 = editare (copiere/mutare/ștergere) și ora 6 = formatarea textului/paragrafului vin DUPĂ ora 4 (tabele), pe sit formatarea e în lecțiile 2-4, înainte de tabele. Lecția 6 (evaluarea modulului) are 20 de mențiuni despre imagini, deși lecțiile M1 1-5 nu predau inserarea imaginii — elevul e evaluat pe ce n-a învățat (X a atins doar lipsa imaginilor, nu evaluarea). Niciun raport n-a verificat comportamentele în Word (Ctrl+A, Backspace, AutoFit, Ctrl+Alt+V) — toate au rămas afirmate; judecătorul le-a confirmat pe Word 16.

## Concluzie (ca profesor, mâine)
1. Niciun raport nu conține afirmații false pe fond; ambele au prins cele 3 lucruri care contează cel mai mult în oră: lecția e prea lungă, Ctrl+A și Backspace sunt descrise greșit (confirmat în Word).
2. **X m-ar ajuta mai mult mâine**: e singurul care leagă lecția de planul real (ora 4 pe 29.09 și ora 7 pe 20.10) și spune ce să predau în fiecare oră, plus singurul care observă că imaginile din plan lipsesc — asta schimbă efectiv ora.
3. X are și cifre măsurate pentru lungime și o provocare care strică datele elevilor (P4) — lucruri pe care le folosesc direct la catedră.
4. Y e mai complet (15 probleme unice, dintre care 2 importante: pagina neexersată și cele două tab-uri „Layout”), dar grosul unicelor sunt finisaje pentru autorul sitului, nu pentru ora de mâine; câteva justificări secundare sunt greșite („celelalte lecții” au try-section / quiz gol).
5. Ideal: planul de oră din X + corecturile P13-P14 din Y; niciunul n-a testat în Word ce afirmă despre taste, deci ambele trebuiau verificate înainte de a fi crezute.
