# Plan reparatie — cls7 / lectia4-liste (13.09.2026)

Surse: `F_evaluari/cls7/lectia4-liste/05_evaluare.md`, `log.json` (10 semnalari), `04_mediu.md`, `surse/s03`, `s07`.
Q_verdict_blocante / P_hibrid / O_orb: nimic pentru lectia aceasta. M_rezultat: toate intrebarile au scor_propriu = scor_max (nicio intrebare decalata). K_rezultat: 3 exercitii, verdict „ok” (dar Ex.3 are contradictie reala, vezi l4-01).

| id | ce | decizie | motiv / cum |
|:--|:--|:--|:--|
| cls7-l4-01 | Ex.3: rezolvarea spune ca Tab face marcatori; lectia (atom 4, Ex.2) spune ca Tab face a, b, c | **aplic** (rezolvare) | Construit ambele variante in docx (`s_ex3_construieste.py`, randat cu H_randeaza): doar Tab = I./a.; Tab + click pe a. + Marcatori = I./•. Rezolvarea spune acum ambii pasi. Adaug in atomul 4 randul care preda schimbarea tipului pe un singur nivel (sursa: Microsoft en-us, `surse/s03`: „you select all of the list items that are at that particular level”). Aceeasi contradictie in „Vrei mai mult?” (nivel 3 cu marcatori) — aplic acolo aceeasi precizare. |
| cls7-l4-02 | Atom 9: „click pe marcator + Ctrl+A = toata lista”; „click pe marcator = un singur element” | **aplic** (fond) | `surse/s03`: clic pe marcator selecteaza toti marcatorii; Ctrl+A = tot documentul (ro-ro si en-us). |
| cls7-l4-05 | Butoanele doar in engleza | **aplic** (nume_comenzi) | Din GLOSAR_UI confirmat: Marcatori, Numerotare, fila Pornire, grupul Paragraf (fragmentul „în grupul Paragraf”), Definire marcator nou, Definire format nou de numerotare, Repornire de la 1, Setați valoarea de numerotare, Sortare, Vizualizare > riglă, Agățat, fila AutoFormatare la tastare, Liste automat cu marcatori/numerotate, Salvare ca, fila Fișier (randul Office din tabelul PowerPoint). Multilevel List, Increase/Decrease Indent, Recently Used Bullets, Symbol/Picture, Options/Proofing/AutoCorrect Options, Save: nu sunt in glosar -> engleza + nota. Continue Numbering: NECONFIRMAT -> engleza + nota. Chestionarele raman neatinse (vezi mai jos). |
| cls7-l4-08 | Nicio salvare a celor 3 documente | **aplic** (salvare) | Rand dupa lista de cerinte la fiecare exercitiu, forma din conventia 3 (nume + loc). Pus ca `<p>`, nu `<li>`, ca sa nu schimbe numarul de intrebari numarat de practice-simple.js. |
| cls7-l4-09 | Ex.2: intrebarea inverseaza ordinea (numerotata -> marcatori) | **aplic** partial (fond) | Intrebarea rescrisa in ordinea enuntului. Placeholderul „toate cele 4 intrebari” vine din `assets/js/practice-simple.js` (numara `li`) — motorul JS nu se atinge -> sar partea asta. |
| cls7-l4-03 | Lectia nu incape in 50 min | sar | decizie de structura (spargere/ora) — la profesor |
| cls7-l4-04 | Ora 7 din plan e alta tema | sar | decizie de plan (ora in calendar) — la profesor |
| cls7-l4-06 | 0 diacritice | sar | val separat de diacritice (conventia 5) |
| cls7-l4-07 | Exemplul pe niveluri fara retragere, 0 imagini | sar | imagini / refacere vizuala a exemplului = decizie de structura (conventia 5) |
| cls7-l4-10 | Titluri cu Bold manual in loc de stilul Titlu 1 | sar | schimbare de cerinta pedagogica intre lectii, nu greseala de fond; ramane la profesor |
| (nou) chestionare | Numele englezesti din `data-quiz` | sar | a schimba variantele ar lungi varianta corecta (R1.1); pasii de dinainte dau acum ambele nume, deci intrebarea se poate raspunde pe Word in romana |

## Runda 2 (dupa verificare.json, verdict „pica”)
- Scoase toate notele de pozitie nesursate (Save „jos in fereastra”, Definire marcator nou „in aceeasi ordine”, File > Options „aceleasi pozitii”, Recently Used „prima galerie”, Continue Numbering „langa Repornire de la 1”) -> nota standard fara pozitie sau nume RO citat din text brut.
- Nume RO noi din text brut: Simbol / Imagine (define_new_ro-ro.txt:114, :119), Fișier > Opțiuni > Verificare > Opțiuni AutoCorecție (define_new_ro-ro.txt:193-195), Mărire indent / Micșorare indent (add_bullets_ro-ro.txt:192), Lansator casetă de dialog (glosar).
- Aparitiile ulterioare Bullets/Numbering din aceiasi pasi -> Marcatori/Numerotare.
- NESIGUR (nu schimb textul): „clic pe a. + Marcatori schimba doar nivelul 2” e dovedit doar pe docx construit, nu in Word. **Intrebare pentru profesor, la ora:** dupa clic pe a. si Marcatori, sub-punctele raman retrase sub regulile I, II, III? Daca nu: sageata de langa Marcatori > alege marcatorul din biblioteca.
