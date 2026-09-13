# Plan reparatie — cls7 / lectia5-tabele

Surse citite: S_CONVENTII.md, GLOSAR_UI.md (Word + Office + scurtaturi), F_evaluari/cls7/lectia5-tabele/05_evaluare.md, log.json (11 findings), surse/s01, s02, s04, s06, s07; Q_verdict_blocante.json (cls7-l5-01 confirmat blocant); P_hibrid/lectia5-tabele/semnalari.json (S01-S31) + surse/kbd_ro-ro.html, kbd_en-us.html; O_orb/lectia5-tabele/judecata.json (P1-P26, toate „adevarat”; P2/P3/P10/P11 testate prin COM in Word 16); M_rezultat.csv (11 intrebari, toate „propriu” — nimic de mutat); K_rezultat.csv (3 randuri „ok” — nimic).

| id | semnalare | decizie | cum |
|:--|:--|:--|:--|
| cls7-l5-02 / S06 / P2 | Ctrl+A in tabel „intai celula, apoi tabelul” | **aplic** (fond) | Ctrl+A = tot documentul; tot tabelul = patratelul de mutare sau Alt+5 (glosar, scurtaturi confirmate; kbd_ro-ro „Selectați tot conținutul documentului. Ctrl+A”). |
| cls7-l5-03 / S07 / P3 | Backspace pe selectie „sterge doar continutul” | **aplic** (fond) | Rezumatul de scurtaturi + Greseli frecvente 2: Delete goleste celulele; Backspace pe rand/coloana/tabel selectat sterge chiar structura, Ctrl+Z o aduce inapoi (s01 MS ro/en; test COM O_orb P3: rand 5->4, coloana 3->2, tabel -> 0). |
| cls7-l5-04 / S16 / P4 | Provocarea pune titlul peste primul elev | **aplic** (fond) | Pas nou „insereaza un rand deasupra” (Aspect tabel (Layout) › Insert Above / clic dreapta › Insert › Insert Rows Above), apoi imbini randul NOU. Verificare: simulare python-docx (5 randuri -> rand nou -> merge -> 5 elevi raman). |
| cls7-l5-10 / S14 / P10 | AutoFit Window „distribuie coloanele egal” | **aplic** (fond) | Ex.1 indiciu + Rezultat asteptat + sfatul din atomul 7: AutoFit Window = latimea paginii, proportional; coloane egale = Distribute Columns (s07; test COM O_orb P10). |
| cls7-l5-11 / P11 | Ctrl+Alt+V = Paste Special | **aplic** (sfat_depasit) | Ctrl+Shift+V lipeste doar textul (Word 2024/365); in versiunile mai vechi Lipire speciala (Paste Special) > Unformatted Text; Ctrl+Alt+V in Word de azi lipeste formatarea (glosar scurtaturi; kbd_ro-ro). |
| S05 / P14 | doua file „Layout” (pagina / tabel), ambele „Aspect” in romana | **aplic** (nume_comenzi) | Atomul 2 si recapitularea: „Aspect tabel (Table Layout / Layout) — apare doar cand esti in tabel” vs „fila Aspect / Aspect pagină (Layout) a paginii”. Atomul 11: se spune explicit care fila si ca iesi intai din tabel. Glosar: Table Layout = fila Aspect tabel (CONFIRMAT); pagina: kbd_ro-ro are ambele variante „fila Aspect” si „fila Aspect pagină” -> scriu ambele. |
| S05 / P14 (intrebarea 11) | raspunsul „Layout” e ambiguu | **aplic** (fond) | Rescriu data-quiz + chestionarul static al atomului 11: optiunile numesc fila paginii vs fila tabelului; verific R1 (lungime corecta <= 1,2 x media, indiciul fara litera). |
| cls7-l5-06 / S04 / P6 | nume doar in engleza | **aplic** (nume_comenzi) | Doar glosar CONFIRMAT, la prima aparitie in pas: Inserați/Inserare (Insert) (VARIANTE), Proiectare tabel (Table Design), Aspect tabel (Layout), Potrivire automată la conținut / fereastră (AutoFit Contents / Window), Borduri și umbrire (Borders and Shading, nu „Chenare”), Conversie text în tabel (Convert Text to Table), Conversie în text (Convert to Text), grupul Rânduri & Coloane. Titlul h3 al atomului 9 nu il ating (atom). |
| S11 / conventia 3 | fisiere cu nume fix, „folder dedicat” | **aplic** (salvare) | Ex.1, Ex.2, Ex.3: Clasa_Nume_<tema>.docx in folderul clasei — intreaba profesorul unde este. |
| conventia 4 | provocarea: note/absente „despre elevi” | **aplic** (date_personale) | „elevi imaginari (nume inventate)”. |
| cls7-l5-09 / S12 / P9 | Ex.2 pas 7 „randul de sus al coloanei Observatii” (o celula) | **aplic** (fond) | „imbina celulele coloanei Observatii de pe randurile 2-5”. |
| S17 | „doua virgule in loc de una” | **aplic** (fond) | Rand cu 3 valori are deja 2 virgule -> „o virgula in plus (3 in loc de 2)”. |
| S18 / P12 | pauza 10:50-11:10 peste ora 11:00 | **aplic** (fond) | „Pauza 10:50-11:00”. |
| S19 | exemplul din email fara rand de antet | **aplic** (fond) | se spune ca antetul Nume/Nota1/Nota2/Nota3 se insereaza deasupra. |
| S21 | „formatarea paginii ... continut obligatoriu distinct” | **aplic** (fond) | „programa cere formatarea documentului: text, imagine, tabel si pagina”. |
| S25 | CSV „comma” mereu | **aplic** (fond) | pe setari romanesti CSV-ul poate avea „;” -> Other si scrii ; (fapt Excel confirmat in glosar: separatorul de lista ro-RO = ;). |
| S27 | „Print Preview (Ctrl+P)” | **aplic** (fond) | Ctrl+P deschide ecranul Print (File > Print), cu previzualizarea in dreapta. Nume RO neconfirmat in glosar -> engleza + nota pictograma. |
| S30 / P17 | „formatare conditionala” in Word | **aplic** (fond) | „colorare manuala dupa o regula (semafor)”. |
| S13 / P17 | „fapte” despre browsere fara sursa | **aplic** (fond) | se spune ca valorile sunt exemple de pareri, nu masuratori. |
| S26 | „evidientiate” | **aplic** (fond) | „evidentiate” (fara diacritice, stilul fisierului). |
| S29 | raspunsul corect de la intrebarea 4 omite clicul | **aplic** (fond) | „... pana apare sageata neagra, apoi dai click”; verific R1. |
| P26 | „Continua cu lectia urmatoare” generic | **aplic** (fond) | numeste lectia 6 (evaluarea modulului), care exista in modul. |
| cls7-l5-01 / S02 / P1 | timpul (blocant confirmat Q) | **sar** | Impartirea in doua ore / scurtarea atomilor = decizie de structura (profesor). |
| cls7-l5-05 / S01 / P5 | lectia inghite orele 4 si 7, lipsesc imaginile | **sar** | Structura + continut nou (atomi despre imagine) — profesor. |
| cls7-l5-07 / S03 / P7 | niciun tabel/imagine, fara varianta pe hartie | **sar** | Imagini / varianta pe hartie = structura (conventia 5). |
| cls7-l5-08 / S08 / P8 | fara diacritice | **sar** | Val separat, cu poarta proprie. |
| S09, S10 | raspuns gresit deblocheaza; progresul ramane pe calculator | **sar** | Motorul JS (interzis); butonul „Sunt alt elev” exista deja (13.09). |
| S15 / P16 | obiectivele nu acopera atomii 6-10 | **sar** | Depinde de impartirea lectiei (structura). |
| P13 / P18 | pagina/split/conversie neexersate in exercitii | **sar** | Exercitii noi = structura. |
| P19 / P25 | rezolvari fara rezultat de comparat; lipsa barem/strat profesor | **sar** | Imagini / bareme noi = structura. |
| P15 / P23 / P24 | try-section, repetitii, Repeat Header Rows | **sar** | Continut/structura noua. |
| P20 / P21 | distractori slabi; chestionar static diferit de data-quiz | **sar** | Conform spec (1 intrebare, 3 variante); motorul inlocuieste chestionarul static — nu e greseala vazuta de elev. |
| S20 / P22 | valorile marginilor Wide/Moderate, clic triplu, coltul proportional | **sar** | Nu am sursa descarcata si nu pornesc Word — neverificabil aici. |
| S22 / S23 / S24 / S31 | Eraser in ce fila, „Clear” primul stil, Split Cells cu text | **sar** | Neverificate pe sursa (P le marcheaza „de verificat in laborator”); fara Word nu confirm. |
