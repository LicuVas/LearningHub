# Glosar Office EN ↔ RO (Word, Excel, PowerPoint, Windows Explorer)

Pentru cei 25 de agenți care repară lecțiile M1: scrieți numele comenzilor ca **„Română (English)”** — de exemplu
„fila **Pornire (Home)**”. Calculatoarele din laboratoare au Office fie în engleză, fie în română, deci lecția trebuie
să meargă pe amândouă.

**Reguli de folosire (obligatorii):**
1. **Foloseşte NUMAI perechile din tabelul CONFIRMAT.** Fiecare rând a fost verificat mecanic: fragmentul din coloana
   „Fragment” chiar apare, literal, în fişierul din coloana „Sursă” (o pagină ro-ro de Microsoft Support, descărcată
   cu `curl`, text brut — niciodată WebFetch). Verificarea: `S_glosar_verifica.py` (rulează `exit 0`).
2. Un nume din tabelul **NECONFIRMAT / VARIANTE** nu se scrie ca fapt sigur — fie lipseşte traducerea RO din sursele
   descărcate, fie există **două traduceri diferite** pentru acelaşi buton (chiar Microsoft e inconsecvent între
   pagini/versiuni). Scrie ambele variante RO ("Inserați/Inserare (Insert)") sau lasă engleza cu nota din tabel.
   **Nu inventa traduceri.**
3. Nume care nu apar deloc în acest glosar → laşi engleza şi adaugi „(în Office în română, butonul cu aceeaşi
   pictogramă)”.
4. Tabelele **Scurtături confirmate** şi **Excel — fapte confirmate** sunt fapte de comportament (nu nume de
   interfaţă) verificate la fel, mecanic, din text brut.

---

## Tabelul CONFIRMAT (sortat pe aplicație, apoi alfabetic după numele englezesc)

Coloana „Sursă” e o cale relativă la rădăcina campaniei
(`C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\`).

### Word

| Engleză | Română | Sursă | Fragment RO (citat exact din sursă) |
|:--|:--|:--|:--|
| Add to Quick Access Toolbar | Adăugare la bara de instrumente Acces rapid | `F_evaluari/cls7/lectia1-interfata-word/surse/pas06.txt` | selectați Adăugare la bara de instrumente Acces rapid din meniul de comenzi rapide. |
| AutoFit Contents | Potrivire automată la conținut | `F_evaluari/cls7/lectia5-tabele/surse/s04_nume_ro_file_tabel.txt` | selectați Potrivire automată , apoi Potrivire automată la conținut. |
| AutoFit Window | Potrivire automată fereastră | `F_evaluari/cls7/lectia5-tabele/surse/s04_nume_ro_file_tabel.txt` | Pentru a ajusta automat lățimea tabelului, selectați Potrivire automată fereastră . |
| AutoFormat As You Type (tab) | fila AutoFormatare la tastare | `F_evaluari/cls7/lectia4-liste/surse/s06_autoformatare.txt` | Selectați fila AutoFormatare la tastare . |
| Automatic bulleted lists | Liste automat cu marcatori | `F_evaluari/cls7/lectia4-liste/surse/s06_autoformatare.txt` | Bifați sau debifați Liste automat cu marcatori sau Liste automat numerotate. |
| Automatic numbered lists | Liste automat numerotate | `F_evaluari/cls7/lectia4-liste/surse/s06_autoformatare.txt` | Bifați sau debifați Liste automat cu marcatori sau Liste automat numerotate. |
| Borders and Shading | Borduri și umbrire | `F_evaluari/cls7/lectia5-tabele/surse/s04_nume_ro_file_tabel.txt` | Faceți clic pe Borduri și umbrire pentru a modifica stilul bordurii |
| Bullets | Marcatori | `F_evaluari/cls7/lectia4-liste/surse/s01_marcatori_numerotare.txt` | Accesați Pornire > , marcatori sau Pornire >, Numerotare . |
| Clear All Formatting | Anulare formatare | `F_evaluari/cls7/lectia2-formatare-text/surse/s03_golire_formatare.txt` | Anulare formatare pe fila Pornire din panglică. |
| Clear All Formatting (variantă) | Anulare totală formatare | `F_evaluari/cls7/lectia2-formatare-text/surse/s07_efecte_text.txt` | Pe fila Pornire , în grupul Font , faceți clic pe Anulare totală formatare . |
| Convert Text to Table | Conversie text în tabel | `F_evaluari/cls7/lectia5-tabele/surse/s04_nume_ro_file_tabel.txt` | faceți clic pe Inserare > tabel > Conversie text în tabel . |
| Convert to Text | Conversie în text | `F_evaluari/cls7/lectia5-tabele/surse/s04_nume_ro_file_tabel.txt` | Pe fila Aspect , în secțiunea Date , faceți clic pe Conversie în text. |
| Define New Bullet | Definire marcator nou | `F_evaluari/cls7/lectia4-liste/surse/s02_definire_format.txt` | apoi selectați Definire marcator nou . |
| Define New Number Format | Definire format nou de numerotare | `F_evaluari/cls7/lectia4-liste/surse/s02_definire_format.txt` | apoi selectați Definire format nou de numerotare . |
| Dialog Box Launcher | Lansator casetă de dialog | `F_evaluari/cls7/lectia3-paragrafe/surse/s01_fereastra_paragraf.txt` | Pe fila Pornire , în grupul Paragraf , selectați Lansator casetă de dialog. |
| Font (group) | grupul Font | `F_evaluari/cls7/lectia2-formatare-text/surse/s01_pornire_font.txt` | Pe fila Pornire , în grupul Font , selectați Exponent sau Butonul Indice . |
| Font Color | Culoarea fontului | `F_evaluari/cls7/lectia2-formatare-text/surse/p_culoare_font.txt` | De exemplu, pe fila Pornire , grupul Font include opțiunea Culoarea fontului |
| Font Dialog Box Launcher | Lansatorul casetei de dialog Font | `F_evaluari/cls7/lectia2-formatare-text/surse/s01_pornire_font.txt` | selectați lansatorul casetei de dialog Font Lansatorul . |
| Format Painter | Descriptorul de formate | `F_evaluari/cls7/lectia2-formatare-text/surse/s02_descriptor_formate.txt` | Utilizați Descriptorul de formate pentru a aplica rapid aceeași formatare |
| Hanging (indent) | Agățat | `F_evaluari/cls7/lectia3-paragrafe/surse/s01_fereastra_paragraf.txt` | Sub Special , selectați Agățat . |
| Heading 1 | Titlu 1 | `F_evaluari/cls7/lectia3-paragrafe/surse/s04_scurtaturi_paragraf.txt` | Aplicați stilul Titlu 1 |
| Home (tab) | fila Pornire | `F_evaluari/cls7/lectia1-interfata-word/surse/pas16.txt` | Pe fila Pornire , mutați cursorul peste titluri diferite în galeria Stiluri |
| Indentation tab (Indents and Spacing) | fila Indentări și spațiere | `F_evaluari/cls7/lectia3-paragrafe/surse/s01_fereastra_paragraf.txt` | Alegeți fila Indentări și spațiere . |
| Insert (tab) > Picture > on this device | fila Inserare, Imagine > pe acest dispozitiv | `F_evaluari/cls7/lectia6-evaluare/surse/s01_inserare_imagine.txt` | În fila Inserare , selectați Imagine > pe acest dispozitiv . |
| Insert > Pictures > Online Pictures | Inserare > imagini > imagini online | `F_evaluari/cls7/lectia6-evaluare/surse/s01_inserare_imagine.txt` | Selectați Inserare > imagini > imagini online pentru o imagine de pe web. |
| Insert > Pictures > This Device | Inserați > imagini > în acest dispozitiv | `F_evaluari/cls7/lectia6-evaluare/surse/s01_inserare_imagine.txt` | Selectați Inserați > imagini > în acest dispozitiv pentru o imagine de pe PC. |
| Keep Source Formatting | Păstrare formatare sursă | `F_evaluari/cls7/lectia2-formatare-text/surse/s04_lipire_fara_formatare.txt` | Păstrare formatare sursă (K) Această opțiune păstrează formatarea aplicată la textul copiat. |
| Keep Text Only | Păstrare doar text | `F_evaluari/cls7/lectia2-formatare-text/surse/s04_lipire_fara_formatare.txt` | Păstrare formatare sursă \|\| Păstrare doar text |
| Merge Formatting | Îmbinare formatare | `F_evaluari/cls7/lectia2-formatare-text/surse/s04_lipire_fara_formatare.txt` | Pentru a efectua conversia marcatorilor în numere, alegeți Îmbinare formatare (M). |
| No Color | Fără culoare | `F_evaluari/cls7/lectia2-formatare-text/surse/s06_evidentiere.txt` | Selectați Fără culoare . |
| Numbering | Numerotare | `F_evaluari/cls7/lectia4-liste/surse/s01_marcatori_numerotare.txt` | Accesați Pornire > , marcatori sau Pornire >, Numerotare . |
| Outline (text effect) | Contur | `F_evaluari/cls7/lectia2-formatare-text/surse/s07_efecte_text.txt` | indicați spre Contur , Umbră , Reflexie sau Strălucire |
| Restart at 1 | Repornire de la 1 | `F_evaluari/cls7/lectia4-liste/surse/s04_numerotare_repornire.txt` | Faceți clic pe Repornire de la 1 . |
| Rows & Columns (group) | grupul Rânduri & Coloane | `F_evaluari/cls7/lectia5-tabele/surse/s04_nume_ro_file_tabel.txt` | Pe fila Aspect tabel , în grupul Rânduri & Coloane , alegeți una dintre următoarele: |
| Save a Copy | Salvați o copie | `F_evaluari/cls7/lectia1-interfata-word/surse/pas12.txt` | Alegeți Salvare ca sau Salvați o copie . |
| Save As | Salvare ca | `F_evaluari/cls7/lectia1-interfata-word/surse/pas12.txt` | În caseta de dialog Salvare ca , în câmpul Nume fișier , introduceți un nume pentru blocnotes. |
| Set Numbering Value | Setați valoarea de numerotare | `F_evaluari/cls7/lectia4-liste/surse/s04_numerotare_repornire.txt` | Selectați Setați valoarea de numerotare din meniu. |
| Shadow (text effect) | Umbră | `F_evaluari/cls7/lectia2-formatare-text/surse/s07_efecte_text.txt` | Pentru mai multe opțiuni, indicați spre Contur , Umbră , Reflexie sau Strălucire |
| Show Below the Ribbon | Afișare dedesubtul Panglicii | `F_evaluari/cls7/lectia1-interfata-word/surse/pas07.txt` | În listă, selectați Afișare dedesubtul Panglicii sau Afișare deasupra Panglicii . |
| Show Quick Access Toolbar | Afișare bară de instrumente Acces rapid | `F_evaluari/cls7/lectia1-interfata-word/surse/pas07.txt` | Dacă bara de instrumente Acces rapid este ascunsă, selectați Afișare bară de instrumente Acces rapid . |
| Show/Hide ¶ | Afișare/Ascundere | `F_evaluari/cls7/lectia3-paragrafe/surse/s03_afisare_ascundere.txt` | Butonul Afișare/ activează și dezactivează caracterele ascunse |
| Sort (list) | Sortare | `F_evaluari/cls7/lectia4-liste/surse/s05_sortare.txt` | Pe fila Pornire , faceți clic pe Sortare . |
| Subscript | Indice | `F_evaluari/cls7/lectia2-formatare-text/surse/p_indice_exponent.txt` | Pentru indice, apăsați Ctrl, Shift și semnul Minus (-) în același timp. |
| Superscript | Exponent | `F_evaluari/cls7/lectia2-formatare-text/surse/p_indice_exponent.txt` | Pentru exponent, apăsați Ctrl, Shift și semnul Plus (+) în același timp. |
| Table Design (tab) | filă Proiectare tabel | `F_evaluari/cls7/lectia5-tabele/surse/s04_nume_ro_file_tabel.txt` | Dacă aveți o filă Tabel pe panglică, nu o filă Proiectare tabel , înseamnă că utilizați panglica cu o singură linie. |
| Table Layout (tab) | fila Aspect tabel | `F_evaluari/cls7/lectia5-tabele/surse/s04_nume_ro_file_tabel.txt` | Pe fila Aspect tabel , în grupul Rânduri & Coloane |
| Table Properties | Proprietăți tabel | `F_evaluari/cls7/lectia5-tabele/surse/s04_nume_ro_file_tabel.txt` | faceți clic dreapta pe un tabel și alegeți Proprietăți tabel . |
| Text Effects | Efecte de text și tipografie | `F_evaluari/cls7/lectia2-formatare-text/surse/s07_efecte_text.txt` | Pe fila Pornire , în grupul Font , selectați Efecte de text și tipografie . |
| Text Highlight Color | Culoare evidențiere text | `F_evaluari/cls7/lectia2-formatare-text/surse/s06_evidentiere.txt` | Accesați pagina de pornire și selectați săgeata de lângă Culoare evidențiere text . |
| View > Ruler | Vizualizare > riglă | `F_evaluari/cls7/lectia3-paragrafe/surse/s02_rigla.txt` | accesați Vizualizare > riglă pentru a o afișa. |

### Excel

| Engleză | Română | Sursă | Fragment RO (citat exact din sursă) |
|:--|:--|:--|:--|
| Add Chart Element | Adăugare element de diagramă | `F_evaluari/cls8/lectia5-grafice/surse/create_ro.txt` | Selectați ChartDesign > Adăugare element de diagramă . |
| Add Level (Sort) | Adăugare nivel | `F_evaluari/cls8/lectia7-sortare/surse/sort_ro.txt` | selectați Adăugare nivel , apoi repetați pașii 3-5. |
| AutoFill Options | Umplere automată Opțiuni | `F_evaluari/cls8/lectia3-formule/surse/umplere_ro.txt` | Dacă este necesar, faceți clic pe Umplere automată Opțiuni alegeți opțiunea dorită. |
| AVERAGE (function) | AVERAGE (funcția AVERAGE — numele NU se traduce) | `F_evaluari/cls8/lectia4-functii/surse/average_ro.txt` | Funcția AVERAGE \| Microsoft Support |
| Chart Design (tab) | fila Proiectare diagramă | `F_evaluari/cls8/lectia5-grafice/surse/create_ro.txt` | Faceți clic pe fila Proiectare diagramă , apoi faceți clic pe Comutare rând/coloană . |
| Chart Title | Titlu diagramă | `F_evaluari/cls8/lectia5-grafice/surse/create_ro.txt` | Faceți clic pe Titlu diagramă pentru a alege opțiuni de formatare a titlului |
| Clustered Column (chart type) | Coloană grupată | `F_evaluari/cls8/lectia5-grafice/surse/tipuri_ro.txt` | Coloană grupată și coloană grupată 3D O diagramă coloană grupată afișează valori în coloane 2D. |
| Continue with the current selection | Continuați cu selecția curentă | `F_evaluari/cls8/lectia7-sortare/surse/sort_ro.txt` | Altfel, selectați Continuați cu selecția curentă . |
| COUNT (function) | COUNT (funcția COUNT — numele NU se traduce) | `F_evaluari/cls8/lectia4-functii/surse/count_ro.txt` | Celulele goale, valorile logice, text sau de eroare din matrice sau din referință nu se contorizează. |
| COUNTA (function) | COUNTA (funcția COUNTA — numele NU se traduce) | `F_evaluari/cls8/lectia4-functii/surse/counta_ro.txt` | Funcția COUNTA contorizează celule care conțin orice tip de informații, inclusiv valori de eroare |
| Currency (number format) | Monedă | `F_evaluari/cls8/lectia2-date/surse/formate_numar_ro.txt` | Monedă Se utilizează pentru valorile monetare generale și afișează simbolul monetar implicit |
| Data (tab) | fila Date | `F_evaluari/cls8/lectia1-interfata/surse/sortare_ro.txt` | Pe fila Date , în grupul Sortare și filtrare , efectuați una dintre următoarele acțiuni |
| Defined Names (group) | grupul Nume definite | `F_evaluari/cls8/lectia1-interfata/surse/nume_formule_ro.txt` | Pe fila Formule , în grupul Nume definite , selectați Definire nume . |
| Delete (sheet) | Ștergere | `F_evaluari/cls8/lectia1-interfata/surse/foi_ro.txt` | Sau, în meniul panglicii, selectați foaia, apoi selectați Pornire > Ștergere > Ștergere foaie . |
| Expand the selection (Sort) | Extindeți selecția | `F_evaluari/cls8/lectia7-sortare/surse/sort_ro.txt` | apăsați opțiunea Extindeți selecția . |
| F4 (toggle reference type) | F4 | `F_evaluari/cls8/lectia3-formule/surse/referinte_ro.txt` | Apăsați F4 pentru a comuta între tipurile de referință. |
| Fill Handle | instrumentul de umplere | `F_evaluari/cls8/lectia3-formule/surse/umplere_ro.txt` | Glisați instrumentul de umplere . |
| Format Cells | Formatare celule | `F_evaluari/cls8/lectia2-date/surse/formate_numar_ro.txt` | Faceți clic dreapta pe celulă sau pe zona de celule, selectați Formatare celule.. |
| Formula AutoComplete | Completare automată formulă | `F_evaluari/cls8/lectia4-functii/surse/autocomplete_ro.txt` | Utilizarea opțiunii Completare automată formulă |
| Formula Bar | bara de formule | `F_evaluari/cls8/lectia1-interfata/surse/nume_formule_ro.txt` | Faceți clic pe caseta Nume din capătul din stânga al barei de formule. |
| Formulas (tab) | fila Formule | `F_evaluari/cls8/lectia1-interfata/surse/nume_formule_ro.txt` | Pe fila Formule , în grupul Nume definite , selectați Definire nume . |
| Header & Footer (group) | grupul Antet & Subsol | `F_evaluari/cls8/lectia6-proiect/surse/antet_ro.txt` | Pe fila Proiectare , în grupul Antet & Subsol , selectați Antet sau Subsol |
| Home (tab) | Pornire | `F_evaluari/cls8/lectia1-interfata/surse/foi_ro.txt` | Sau selectați Pornire > Inserare > Foaie . |
| IF (function) | IF (Funcția IF — numele NU se traduce) | `F_evaluari/cls8/lectia4-functii/surse/if_ro.txt` | IF(test_logic, valoare_dacă_adevărat, [valoare_dacă_fals]) |
| Increase Decimal / Decrease Decimal | Mărire zecimală / Micșorare zecimală | `F_evaluari/cls8/lectia4-functii/surse/zecimale_ro.txt` | selectați Mărire zecimală sau Micșorare zecimală pentru a afișa mai multe sau mai puține cifre |
| Insert (tab) | Inserare | `F_evaluari/cls8/lectia1-interfata/surse/grafic_ro.txt` | Faceți clic pe fila Inserare , selectați tipul de diagramă |
| Insert > Header & Footer | Inserare > antet & subsol | `F_evaluari/cls8/lectia6-proiect/surse/antet_ro.txt` | Accesați Inserare > antet & subsol . |
| Insert Function | Inserare funcție | `F_evaluari/cls8/lectia4-functii/surse/fx_ro.txt` | Utilizați caseta de dialog Inserare funcție pentru a insera formula și argumentele corecte |
| Locale-dependent sort order | Ordinea de sortare variază în funcție de setarea regională | `F_evaluari/cls8/lectia7-sortare/surse/sort_ro.txt` | Ordinea de sortare variază în funcție de setarea regională. |
| Margins: Normal/Wide/Narrow | Margini: Normal / Lat / Îngust | `F_evaluari/cls8/lectia6-proiect/surse/margini_ro.txt` | Pentru a utiliza margini predefinite, faceți clic pe Normal , Lat sau Îngust . |
| MAX (function) | MAX (funcția MAX — numele NU se traduce) | `F_evaluari/cls8/lectia4-functii/surse/max_ro.txt` | Funcția MAX \| Microsoft Support |
| Merge & Center | Îmbinare & centru | `F_evaluari/cls8/lectia2-date/surse/imbinare_ro.txt` | Pe fila Pornire , selectați Îmbinare & centru , apoi Îmbinare celule . |
| MIN (function) | MIN (funcția MIN — numele NU se traduce) | `F_evaluari/cls8/lectia4-functii/surse/min_ro.txt` | Funcția MIN \| Microsoft Support |
| My data has headers | Datele mele au anteturi | `F_evaluari/cls8/lectia7-sortare/surse/sort_ro.txt` | Datele mele au anteturi |
| Name Box | Caseta Nume | `F_evaluari/cls8/lectia1-interfata/surse/nume_formule_ro.txt` | Caseta Nume definite pe bara de formule |
| New Sheet (+) | Foaie nouă | `F_evaluari/cls8/lectia1-interfata/surse/foi_ro.txt` | Selectați pictograma plus Foaie nouă în partea de jos a registrului de lucru. |
| Page Layout (tab) | fila Aspect pagină | `F_evaluari/cls8/lectia6-proiect/surse/margini_ro.txt` | În fila Aspect pagină , în grupul Inițializare pagină , faceți clic pe Margini . |
| Percentage (number format) | Procent | `F_evaluari/cls8/lectia2-date/surse/formate_numar_ro.txt` | Procent Înmulțește valoarea celulei cu 100 și afișează rezultatul cu simbolul de procent |
| Recommended Charts | diagrame recomandate | `F_evaluari/cls8/lectia5-grafice/surse/create_ro.txt` | Selectați Inserați > diagrame recomandate . |
| Rename (sheet) | Redenumire | `F_evaluari/cls8/lectia1-interfata/surse/foi_ro.txt` | selectați Redenumire , apoi tastați un nume nou. |
| Short Date (number format) | Dată scurtă | `F_evaluari/cls8/lectia2-date/surse/formate_numar_ro.txt` | Dată scurtă Afișează data în acest format: |
| Smallest to Largest / Largest to Smallest | De la cel mai mic la cel mai mare / De la cel mai mare la cel mai mic | `F_evaluari/cls8/lectia7-sortare/surse/sort_ro.txt` | Pentru valorile numerice, selectați De la cel mai mic la cel mai mare sau De la cel mai mare la cel mai mic . |
| Sort & Filter (group) | Sortare și filtrare | `F_evaluari/cls8/lectia1-interfata/surse/sortare_ro.txt` | Pe fila Date , în grupul Sortare și filtrare , efectuați una dintre următoarele acțiuni |
| Sort & Filter (group, variantă) | Sortare & filtrare | `F_evaluari/cls8/lectia7-sortare/surse/sort_ro.txt` | Pe fila Date , în grupul Sortare & filtrare , selectați Sortare . |
| Sort (button/dialog) | Sortare | `F_evaluari/cls8/lectia7-sortare/surse/sort_ro.txt` | Pe fila Date , în grupul Sortare & filtrare , selectați Sortare . |
| SUM (function) | SUM (funcția SUM — numele NU se traduce) | `F_evaluari/cls8/lectia4-functii/surse/sum_ro.txt` | Funcția SUM adună valori. |

### PowerPoint

| Engleză | Română | Sursă | Fragment RO (citat exact din sursă) |
|:--|:--|:--|:--|
| After Previous | După precedentul | `F_evaluari/cls6/lectia4-animatii/surse/s_start.txt` | După precedentul : Efectul de animație începe imediat după cel anterior. |
| Animation Pane | Panou animație | `F_evaluari/cls6/lectia4-animatii/surse/s_panou_animatii.txt` | selectați Panou animație de pe fila Animații . |
| Animations (tab) | fila Animații | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_file_panglica.txt` | Deschideți fila Animații și adăugați animații la diapozitive. |
| Apply To All (transitions) | Se aplică tuturor | `F_evaluari/cls6/lectia5-tranzitii/surse/s_se_aplica_tuturor.txt` | Selectați Se aplică tuturor pentru a adăuga tranziția la întreaga prezentare. |
| Apply To All (transitions, variantă) | Se aplică pentru toate | `F_evaluari/cls6/lectia5-tranzitii/surse/s_se_aplica_tuturor.txt` | faceți clic pe Se aplică pentru toate în panglică. |
| Close Master View | Închidere vizualizare coordonator | `F_evaluari/cls6/lectia2-slide-uri/surse/s_coordonator.txt` | pe fila Coordonator de diapozitive , selectați Închidere vizualizare coordonator . |
| Create PDF/XPS Document | Creare document PDF/XPS | `F_evaluari/cls6/lectia6-proiect/surse/s_pdf.txt` | Selectați Creare document PDF/XPS , apoi selectați Creare PDF/XPS . |
| Crop | Trunchiere | `F_evaluari/cls6/lectia3-text-imagini/surse/s_trunchiere_forma.txt` | veți vedea fila Format imagine în panglică. Pe fila Format imagine , selectați săgeata de lângă Trunchiere . |
| Crop to Shape | Trunchiere la formă | `F_evaluari/cls6/lectia3-text-imagini/surse/s_trunchiere_forma.txt` | Accesați Trunchiere la formă , apoi selectați forma din opțiunile disponibile. |
| Delay (box) | Întârziere | `F_evaluari/cls6/lectia4-animatii/surse/s_durata_intarziere.txt` | Selectați fila Animații și, în caseta Întârziere , introduceți numărul de secunde |
| Delete Slide | Ștergere diapozitiv | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_diapozitive.txt` | faceți clic dreapta pe selecție și alegeți Ștergere diapozitiv . |
| Design (tab) | fila Proiectare | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_file_panglica.txt` | Deschideți fila Proiectare și aplicați teme și particularizați diapozitivele. |
| Design > Themes | fila Proiectare (teme) | `F_evaluari/cls6/lectia6-proiect/surse/s_teme.txt` | puteți schimba tema sau varianta mai târziu, pe fila Proiectare . Pe fila Proiectare , alegeți o temă |
| Duplicate Slide | Dublare diapozitiv | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_diapozitive.txt` | faceți clic pe Dublare diapozitiv . Dublarea este inserată imediat după original. |
| Duration (transitions) | Durată | `F_evaluari/cls6/lectia5-tranzitii/surse/s_durata.txt` | Pe fila Tranziții , în grupul Durată , în caseta Durată , tastați numărul de secunde dorit. |
| Effect Options | Opțiuni efect | `F_evaluari/cls6/lectia4-animatii/surse/s_fila_animatii.txt` | Selectați Opțiuni efect , apoi alegeți un efect. |
| Export | Export | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_pdf.txt` | Selectați fila Fișier . Selectați Export . |
| F5 (Start Slide Show) | Pornirea expunerii de diapozitive (F5) | `F_evaluari/cls6/lectia4-animatii/surse/s_f5.txt` | Pornirea expunerii de diapozitive. F5 Încheierea expunerii de diapozitive. Esc |
| File (tab) | fila Fișier | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_tema_imagini.txt` | Pe fila Fișier din panglică, selectați Nou , apoi alegeți o temă. |
| Footer (checkbox) | Subsol | `F_evaluari/cls6/lectia2-slide-uri/surse/s_antet_subsol.txt` | Pe fila Diapozitiv , bifați caseta Subsol . |
| Format Background | Formatare fundal | `F_evaluari/cls6/lectia2-slide-uri/surse/s_fundal.txt` | În extremitatea dreaptă, selectați Formatare fundal . |
| From Right (transition option) | De la dreapta | `F_evaluari/cls6/lectia5-tranzitii/surse/s_de_la_dreapta.txt` | este selectată opțiunea De la dreapta . |
| Header & Footer | Antet și subsol | `F_evaluari/cls6/lectia2-slide-uri/surse/s_antet_subsol.txt` | Pe fila Inserare , selectați Antet și subsol . |
| Home (tab) | fila Pornire | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_file_panglica.txt` | Alt+H pentru a deschide fila Pornire și Alt+Q pentru a trece la câmpul Spune-mi |
| Insert (tab) | fila Inserare | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_tema_imagini.txt` | Pe fila Inserare , selectați Imagini , apoi efectuați una dintre următoarele acțiuni |
| Insert > Link (Table of Contents) | fila Inserare, Link, fila Plasare în acest document | `F_evaluari/cls6/lectia6-proiect/surse/s_cuprins_link.txt` | Pe fila Inserare , selectați Link . În caseta de dialog Inserare hyperlink , selectați fila Plasare în acest document . |
| Insert > Link > Place in This Document | Inserare > link > Inserare link > Plasare în acest document | `F_evaluari/cls6/lectia6-proiect/surse/s_plasare_document.txt` | Selectați Inserare > link > Inserare link și selectați o opțiune: Plasare în acest document |
| Insert > Pictures | Inserare > Imagini | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_tema_imagini.txt` | Pe fila Inserare , selectați Imagini , apoi efectuați una dintre următoarele acțiuni |
| Insert > Pictures > This Device | Inserare, grupul Imagini, Imagini, Acest dispozitiv | `F_evaluari/cls6/lectia3-text-imagini/surse/s_imagine_dispozitiv.txt` | Pe fila Inserare , în grupul Imagini , selectați Imagini , apoi selectați Acest dispozitiv . |
| Loop continuously until 'Esc' | Loop continuu până la 'Esc' | `F_evaluari/cls6/lectia5-tranzitii/surse/s_bucla.txt` | bifează automat caseta de selectare Loop continuu până la 'Esc' |
| Move Earlier / Move Later | Mutare mai devreme / Mutare mai târziu | `F_evaluari/cls6/lectia4-animatii/surse/s_panou_animatii.txt` | Mutare mai devreme : Faceți ca o animație să apară mai repede într-o secvență. |
| New Slide | Diapozitiv nou | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_diapozitive.txt` | Pe fila Pornire , selectați săgeata de lângă Diapozitiv nou . |
| Normal (view) | Normală | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_vizualizari.txt` | Accesați cele trei vizualizări principale (Normală, Sortare diapozitive sau Expunere diapozitive) |
| On Click | La clic | `F_evaluari/cls6/lectia4-animatii/surse/s_start.txt` | La clic : Efectul de animație începe atunci când faceți clic pe diapozitiv. |
| Pattern fill / Gradient fill / Solid fill | Umplere model / Umplere gradient / Umplere solidă | `F_evaluari/cls6/lectia2-slide-uri/surse/s_fundal.txt` | Sub Umplere , selectați Umplere solidă , Umplere gradient sau Umplere model . |
| Reading View | vizualizarea de citire | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_vizualizari.txt` | Vizualizarea citire Puteți accesa vizualizarea de citire din |
| Remove Background | Eliminare fundal | `F_evaluari/cls6/lectia3-text-imagini/surse/s_eliminare_fundal.txt` | Pe fila Formatare imagine din panglică, selectați Eliminare fundal . |
| Save as type: PDF | Salvare cu tipul: PDF (*.pdf) | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_pdf.txt` | În lista Salvare cu tipul , selectați PDF (*.pdf). |
| Set Up Slide Show | Configurare expunere diapozitive | `F_evaluari/cls6/lectia5-tranzitii/surse/s_bucla.txt` | Pe fila Expunere diapozitive , selectați Configurare expunere diapozitive . |
| Slide Master (view) | Coordonator de diapozitive | `F_evaluari/cls6/lectia2-slide-uri/surse/s_coordonator.txt` | pe fila Coordonator de diapozitive , selectați Închidere vizualizare coordonator . |
| Slide Show (tab) | fila Expunere diapozitive | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_file_panglica.txt` | Deschideți fila Expunere diapozitive , configurați și redați expunerea de diapozitive. |
| Slide Sorter (view) | Vizualizarea Sortare diapozitive | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_vizualizari.txt` | Vizualizarea Sortare diapozitive Puteți accesa vizualizarea Sortare diapozitive din bara de activități |
| Sound (transitions) | Sunet | `F_evaluari/cls6/lectia5-tranzitii/surse/s_sunet.txt` | în lista Sunet , selectați sunetul dorit. |
| Title and Content (layout) | Titlu și conținut | `F_evaluari/cls6/lectia2-slide-uri/surse/s_aspecte.txt` | diapozitivul Titlu și diapozitivul Titlu și conținut |
| Title Slide (layout) | Titlu | `F_evaluari/cls6/lectia2-slide-uri/surse/s_aspecte.txt` | diapozitivul Titlu și diapozitivul Titlu și conținut |
| Transitions (tab) | fila Tranziții | `F_evaluari/cls6/lectia1-powerpoint-intro/surse/s_file_panglica.txt` | Deschideți fila Tranziții și adăugați tranziții între diapozitive. |
| Transitions (tab, Alt+K) | fila Tranziții (Alt+K) | `F_evaluari/cls6/lectia5-tranzitii/surse/s_fila_tranzitii.txt` | Selectați fila Tranziții și alegeți o tranziție. |
| With Previous | Cu precedentul | `F_evaluari/cls6/lectia4-animatii/surse/s_start.txt` | Cu precedentul : Redați o animație simultan cu animația anterioară în secvența dvs. |

### Windows / File Explorer / Task Manager

| Engleză | Română | Sursă | Fragment RO (citat exact din sursă) |
|:--|:--|:--|:--|
| Copy (context menu) | Copiere | `F_evaluari/cls5/lectia3-software/surse/pas_meniu_contextual.txt` | Puteți găsi Decupare , Copiere , , Lipire, Lipire , Redenumire , , Partajare, și Ștergere |
| Cut (context menu) | Decupare | `F_evaluari/cls5/lectia3-software/surse/pas_meniu_contextual.txt` | Puteți găsi Decupare , Copiere , , Lipire, Lipire , Redenumire , , Partajare, și Ștergere |
| Delete (context menu) | Ștergere | `F_evaluari/cls5/lectia3-software/surse/pas_meniu_contextual.txt` | Puteți găsi Decupare , Copiere , , Lipire, Lipire , Redenumire , , Partajare, și Ștergere |
| File Explorer | Explorer | `F_evaluari/cls5/lectia3-software/surse/meniu_ro.txt` | Windows Explorer vă ajută să găsiți, să deschideți, să organizați și să gestionați fișierele și folderele |
| Paste (context menu) | Lipire | `F_evaluari/cls5/lectia3-software/surse/pas_meniu_contextual.txt` | Puteți găsi Decupare , Copiere , , Lipire, Lipire , Redenumire , , Partajare, și Ștergere |
| Performance (Task Manager tab/pane) | Performanță | `F_evaluari/cls5/lectia2-hardware/surse/pas_taskmanager.txt` | Alegeți Performanță din panoul din stânga al ferestrei Manager de activități |
| Rename (context menu) | Redenumire | `F_evaluari/cls5/lectia3-software/surse/pas_meniu_contextual.txt` | Puteți găsi Decupare , Copiere , , Lipire, Lipire , Redenumire , , Partajare, și Ștergere |
| Show more options (context menu) | Afișați mai multe opțiuni | `F_evaluari/cls5/lectia3-software/surse/pas_meniu_contextual.txt` | Selectați Afișați mai multe opțiuni . |
| Startup apps (tab) | Aplicații cu executare în execuție la pornire | `F_evaluari/cls5/lectia3-software/surse/pas_startup_apps.txt` | Selectați fila Aplicații cu executare în execuție la pornire . |
| Task Manager | Manager de activități | `F_evaluari/cls5/lectia2-hardware/surse/pas_taskmanager.txt` | Faceți clic dreapta pe Start și selectați Manager de activități |

> Notă: butonul de context Windows 11 afișează Cut/Copy/Paste/Rename/Share/Delete ca **pictograme** (numele apare doar
> la hover); comenzile vechi cu text sunt sub „Afișați mai multe opțiuni”.

### Office (comun — Word, Excel, PowerPoint)

| Engleză | Română | Sursă | Fragment RO (citat exact din sursă) |
|:--|:--|:--|:--|
| Crop a picture | Trunchierea unei imagini | `F_evaluari/cls7/lectia6-evaluare/surse/s03_trunchiere.txt` | Trunchierea unei imagini în Office |
| Hide Quick Access Toolbar | Ascundere bară de instrumente Acces rapid | `F_evaluari/cls7/lectia6-evaluare/surse/s04_bara_acces_rapid.txt` | selectați Ascundere bară de instrumente Acces rapid . |
| Quick Access Toolbar | bara de instrumente Acces rapid | `F_evaluari/cls7/lectia1-interfata-word/surse/pas06.txt` | Bara de instrumente Acces rapid particularizabilă conține un set de comenzi |
| Quick Access Toolbar — below the ribbon (default) | Sub panglică (locația implicită) | `F_evaluari/cls7/lectia6-evaluare/surse/s04_bara_acces_rapid.txt` | Sub panglică (locația implicită): |
| Undo (Quick Access Toolbar) | Anulare | `F_evaluari/cls7/lectia6-evaluare/surse/s04_bara_acces_rapid.txt` | Pentru a anula o acțiune, apăsați Ctrl+Z pe tastatură sau selectați Anulare pe Bara de instrumente Acces rapid. |

---

## Tabelul NECONFIRMAT / VARIANTE

Nu se folosesc ca fapt sigur. Fie lipsește traducerea RO pe paginile descărcate, fie există **traduceri diferite**
pentru același nume (chiar la Microsoft). Scrii ambele variante sau lași engleza cu nota respectivă.

| Aplicație | Nume EN | Ce se știe | Sursă / notă |
|:--|:--|:--|:--|
| PowerPoint | Home > Slide Layout | Traducere automată stricată pe pagina ro-ro: „Aspect de diapozitiv de pornire” (nu „Pornire > Aspect diapozitiv”). Folosește doar „fila Pornire (Home)” + „Aspect (Layout)” separat, nu fraza întreagă. | `F_evaluari/cls6/lectia2-slide-uri/surse/s_aspecte.txt` (`raw/layout_ro.txt`) |
| PowerPoint | Two Content / Comparison / Title Only / Picture with Caption (aspecte diapozitiv) | Numele englezești există (pagina en-us), dar traducerea RO NU apare pe pagina descărcată — NECONFIRMAT. | `F_evaluari/cls6/lectia2-slide-uri/surse/s_aspecte.txt`; `04_mediu.md` rândul „NECONFIRMAT” |
| PowerPoint | Apply to All Slides | 0 apariții pe pagina ro-ro descărcată pentru lecția 6 (există doar „Se aplică tuturor” / „Se aplică pentru toate”, două variante — vezi CONFIRMAT). | `F_evaluari/cls6/lectia6-proiect/04_mediu.md` |
| PowerPoint | Categoriile de tranziții „Exciting” etc. | „Exciting (Incitante)” e o traducere **inventată de lecție**, nu din documentația Microsoft descărcată. | `F_evaluari/cls6/lectia5-tranzitii/04_mediu.md` |
| PowerPoint | SmartArt (Process/Hierarchy), WordArt „Text Fill/Text Effects”, „Picture Styles”, „Corrections”, „Selection Pane”, „Bullets and Numbering” | NEVERIFICATE — nu s-au descărcat pagini pentru aceste nume. | `F_evaluari/cls6/lectia3-text-imagini/04_mediu.md` |
| Word | Line and Paragraph Spacing (buton) | Traducerea automată e stricată pe pagina ro-ro („Accesarea liniei de pornire și spațierii paragrafelor buton spațiere”). Doar submeniul e clar: „Opțiuni interlinie” / caseta „Interlinie”. | `F_evaluari/cls7/lectia3-paragrafe/surse/s05_interlinie_implicita.txt` |
| Word | Continue Numbering | Nu apare nici pe pagina en-us, nici pe cea ro-ro descărcată — NECONFIRMAT. | `F_evaluari/cls7/lectia4-liste/surse/s04_numerotare_repornire.txt` |
| Word | Emboss / Engrave (efecte font) | NEGĂSIT pe pagina de azi (en-us); efectele au fost scoase din Word pentru fișiere .docx din 2010 — greșit pentru orice Word recent. | `F_evaluari/cls7/lectia2-formatare-text/surse/s07_efecte_text.txt`, `s09_emboss_engrave.txt` |
| Excel | Borders (buton, tab Home) | NECONFIRMAT — pagina Microsoft citată a dat eroare la descărcare. | `F_evaluari/cls8/lectia2-date/04_mediu.md` |
| Excel | „Function Wizard” | Nume GREȘIT — 0 apariții în documentația Excel 2016-365 (en-us). Numele corect e caseta de dialog **Inserare funcție (Insert Function)** — vezi CONFIRMAT. | `F_evaluari/cls8/lectia4-functii/surse/fx_en.txt` |
| Excel | „Circular” (Pie), „Coloana” (Column), „Bara orizontala” (Bar) | Traduceri **improvizate de lecție**, nu ale Excel-ului în română. Numele reale: fila Insert/Inserați → Charts/Diagrame; tipul exact depinde de meniu. | `F_evaluari/cls8/lectia5-grafice/04_mediu.md` |
| Windows | New > Folder / New > Text Document (meniu contextual) | Traducerea RO probabilă „Nou > Folder / Document text” NU a fost verificată pe text brut (pagina descărcată nu acoperă acest submeniu). | `F_evaluari/cls5/lectia3-software/surse/pas_meniu_contextual.txt` |

---

## Scurtături confirmate (fapte de comportament, nu nume de interfață)

| Aplicație | Combinație | Faptă confirmată | Sursă | Fragment (citat exact) |
|:--|:--|:--|:--|:--|
| Word | Ctrl+A (în interiorul unui tabel) | Selectează TOT documentul, nu doar tabelul — chiar dacă cursorul e într-un tabel. (Tabelul singur se selectează cu Alt+5 pe tastatura numerică, cu Num Lock oprit.) | `F_evaluari/cls7/lectia5-tabele/surse/s02_ctrl_a.txt` | Selectați tot conținutul documentului. |
| Word | Alt+5 (tastatură numerică, Num Lock oprit) | Selectează tot tabelul (nu documentul). | `F_evaluari/cls7/lectia5-tabele/surse/s02_ctrl_a.txt` | Alt+5 pe tastatura numerică, cu Num Lock dezactivat |
| Word | Ctrl+Alt+V | În documentația de azi (Word 365/2024) lipește DOAR formatarea textului selectat, nu deschide Lipire specială; comportamentul vechi (Lipire specială) rămâne pentru Word 2021 și mai vechi. | `F_evaluari/cls7/lectia5-tabele/surse/s06_ctrl_alt_v.txt` | Lipiți formatarea textului selectat. |
| Word | Ctrl+Shift+V | Lipește doar textul, fără formatare (Word 365/2024). | `F_evaluari/cls7/lectia3-paragrafe/surse/s04_scurtaturi_paragraf.txt` | Lipiți doar textul. |
| Word | Ctrl+Shift+8 | Afișare/Ascundere marcaje de formatare (¶, spații, tabulatori) — nu se folosește tastatura numerică. | `F_evaluari/cls7/lectia3-paragrafe/surse/s03_afisare_ascundere.txt` | Ctrl+Shift+8 (nu utilizați tastatura numerică) |
| Word | Ctrl+1 / Ctrl+2 / Ctrl+5 | Spațiere paragraf: Ctrl+1 = un rând, Ctrl+2 = dublă, Ctrl+5 = un rând și jumătate. | `F_evaluari/cls7/lectia3-paragrafe/surse/s04_scurtaturi_paragraf.txt` | Aplicați paragrafului spațierea la un rând și jumătate. |
| Word | Ctrl+L / Ctrl+R (aliniere) | Ctrl+L aliniază paragraful la stânga, Ctrl+R la dreapta (Ctrl+E centrat, Ctrl+J justificat). | `F_evaluari/cls7/lectia3-paragrafe/surse/s04_scurtaturi_paragraf.txt` | Aliniați paragraful la stânga. |
| Word | Ctrl+Alt+1 | Aplică stilul Titlu 1. | `F_evaluari/cls7/lectia3-paragrafe/surse/s04_scurtaturi_paragraf.txt` | Aplicați stilul Titlu 1 |
| Excel | Ctrl+L sau Ctrl+T | Deschide caseta de dialog Creare tabel (Create Table). | `F_evaluari/cls8/lectia2-date/surse/shortcuts_ro.txt` | Afișați caseta de dialog Creare tabel . Ctrl+L sau Ctrl+T |
| Excel | Ctrl+E | Aplică Umplere instant (Flash Fill) — recunoaște automat modelul din coloanele adiacente. | `F_evaluari/cls8/lectia2-date/surse/shortcuts_ro.txt` | Aplicați Umplere instant . Ctrl+E |

---

## Excel — fapte confirmate (funcții, separator, zecimale)

| Aspect | Faptă confirmată | Sursă | Fragment (citat exact) |
|:--|:--|:--|:--|
| Nume de funcții | Excel în română NU traduce numele funcțiilor: rămân SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, IF (paginile ro-ro se numesc „Funcția SUM”, „Funcția MIN” etc., nu „Funcția SUMA”). | `F_evaluari/cls8/lectia4-functii/surse/sum_ro.txt` | Funcția SUM adună valori. |
| Separator de argumente (Microsoft ro-ro) | Chiar și documentația Microsoft ro-ro scrie formulele cu virgulă (exemplu: =IF(A2>B2,"Buget depășit","OK")) — documentația NU decide separatorul de pe un calculator anume. | `F_evaluari/cls8/lectia4-functii/surse/if_ro.txt` | =IF(A2>B2,"Buget depășit","OK") |
| Separator de argumente (calculatorul elevului) | Separatorul real de argumente (`,` sau `;`) depinde de setarea regională Windows a calculatorului, nu de limba Office-ului: pe acest PC ro-RO separatorul de listă este `;`. | `F_evaluari/cls8/lectia3-formule/u4_cultura.txt` | ro-RO: separator zecimal=[,] separator lista=[;] data scurta=[dd.MM.yyyy] |
| Separator zecimal | Pe Windows ro-RO zecimala e virgula (`,`) și `8.5` NU este recunoscut ca număr; pe Windows en-US zecimala e punctul (`.`) și `8,5` NU este recunoscut ca număr — depinde de setarea regională, nu de limba Excel-ului. | `F_evaluari/cls8/lectia2-date/u4_cultura.txt` | en-US: separator zecimal=[.] separator lista=[,] data scurta=[M/d/yyyy] |

**Consecință practică pentru lecții:** o casetă „Calculatorul tău poate fi setat diferit” înainte de prima formulă cu
mai multe argumente, cu ambele variante (`,` și `;`), plus ambele forme de zecimală (`7,5` / `7.5`) — vezi
`S_CONVENTII.md` §2 pentru textul exact agreat.

---

## Cum a fost verificat

Fiecare rând din tabelul CONFIRMAT (Word/Excel/PowerPoint/Windows/Office), din **Scurtături confirmate** și din
**Excel — fapte confirmate** e verificat mecanic de `S_glosar_verifica.py`: scriptul deschide fișierul din coloana
Sursă și verifică (grep/substring, nu regex fuzzy) că fragmentul citat apare **literal** în el. Rulare:

```
python S_reparatii/S_glosar_verifica.py
```

Exit 0 = toate rândurile confirmate chiar apar în sursele citate. Exit 1 = listează rândul/rândurile care nu se mai
potrivesc (fișier lipsă sau fragment schimbat) — nu se folosește glosarul până nu se repară acel rând.
