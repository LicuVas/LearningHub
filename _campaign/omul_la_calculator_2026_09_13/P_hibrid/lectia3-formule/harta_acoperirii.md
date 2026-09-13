# Harta acoperirii — lectia3-formule (TIC, clasa a VIII-a)

Sursa citită: `vede/innerText.txt` (843 de rânduri, citit integral în 4 felii) + capturile `ecran_prima_vedere.png`, `pas_06.png`, `pas_06_atom_intreg.png`, `pas_07_atom_intreg.png`, `proiector_25.png`.
Verificări executate: `test/build_xlsx.py` → `H_randeaza.py xlsx` → `test/read_xlsx.py` (valori recalculate de LibreOffice); `test/pw_check.py` (Playwright: răspuns greșit, butonul Copiază, salvarea); cheile quizurilor decodate din `data-quiz`; surse cu curl (Microsoft, ANAF); `CultureInfo ro-RO`.

| # | Element | Ce afirmă / cere pe scurt | Verificat cum | Problemă? |
|---|---|---|---|---|
| 1 | Antet, titlu, „Invatare Atomica” | titlul lecției, fără diacritice | citit + numărat diacriticele din tot textul (0 din 3.322 de cuvinte) | da → S14 |
| 2 | „Pasul 1 din 7”, progres 0% | 7 pași | citit; H_vede: 7 pași parcurși, 0 blocați | nu |
| 3 | Obiectivul lecției (30 de elevi, 20 min vs 5 secunde) | motivare | citit | da (minor) → S16 |
| 4 | Obiectivele 1–6 („Sa explici 1. ...”, „Sa aplici 5. atentie la ordinea operatiilor”) | 6 obiective | citit; comparat cu programa (curriculum.json: „Formule de calcul care utilizează operatori aritmetici (+, -,*, /)”) și cu planul (ora 7) | da → S16 (formulare), S6 (obiectivul 6 e în afara orei) |
| 5 | „Incearca singur!” – deschide Excel/Sheets | cere o foaie de calcul | citit; curl pe ambele linkuri → pagini de autentificare | da → S10 |
| 6 | Link Excel Online „gratuit cu cont Microsoft” | cont necesar | curl: redirect la login.microsoftonline.com | da → S10 |
| 7 | Link Google Sheets | „gratuit” | curl: redirect la accounts.google.com | da → S10 |
| 8 | Misiunea „(5 minute)” | 5 pași + bonus în 5 minute | citit; estimat | da → S7 |
| 9 | Pas 1 – tabel de copiat (Ana/Ion/Maria) | copiere în A1 | Playwright: clipboard = text separat prin TAB, rânduri CRLF → se lipește corect pe coloane | nu |
| 10 | Pas 2 – E2 `=B2+C2+D2` | rezultat 27 | recalculat (LibreOffice): 27 | nu |
| 11 | Pas 3 – drag handle E2→E4 | E3, E4 | recalculat: 21, 29 | nu |
| 12 | Pas 4 – F2 `=E2/3`, tras la F4 | medii | recalculat: 9; 7; 9,666… | nu |
| 13 | Pas 5 – E5 `=SUM(E2:E4)` | funcția SUM | recalculat: 77; comparat cu planul (SUM = ora 8) | da → S6 |
| 14 | Bonus – Ion 6→10 | recalcul automat | recalculat: E3=25, F3=8,33, E5=81 | nu |
| 15 | Indiciu pas 2 – „Ar trebui sa apara numarul 27” | 27 | recalculat: 27 | nu |
| 16 | Indiciu pas 2 – „Click dreapta → Format Cells → General” | meniu în engleză | citit; denumirea românească NEverificată pe text Microsoft | da (minor, neverificat) → S15 |
| 17 | Indiciu pas 3 – drag handle „patrat mic negru”, alternativa Ctrl+C/Ctrl+V | copiere | citit; alternativa Ctrl+C/Ctrl+V e corectă; culoarea mânerului NEverificată pe versiunea din laborator | da (minor, neverificat) → S20 |
| 18 | Indiciu pas 5 – „Rezultatul ar trebui sa fie 78 (27 + 21 + 29)” | 78 | recalculat: 27+21+29 = 77; lecția însăși scrie 77 la atomul 6 | da → S1 |
| 19 | Atom 1 – definiția formulei, `=10+5` → 15 | = la început | citit; recalcul mintal 15 | nu |
| 20 | Atom 1 – analogia rețetei | ingrediente = celule | citit | nu |
| 21 | Quiz atom 1 – caracterul de început | cheia „=” | cheie decodată din data-quiz: „=(egal)” | nu (cheia e bună) |
| 22 | Feedbackul la răspuns GREȘIT (toate quizurile) | ce vede copilul | Playwright: după „+” apare „Incorect...” urmat de „💡 Corect! Semnul = ...” | da → S3 |
| 23 | Mesajul „Raspunde corect la intrebarile anterioare pentru a continua” | blocaj la răspuns greșit | citit atomic-learning.js l.389–408: răspunsul greșit deblochează oricum | da (minor) → S17 |
| 24 | Atom 2 – tabelul celor 4 operatori (15, 5, 50, 2) | rezultate | recalculat mintal: 10+5=15, 10-5=5, 10*5=50, 10/5=2 | nu |
| 25 | Atom 2 – „* (Shift+8)”, „/ tasta de langa Shift drept” | taste | citit; corect pe tastatura US/RO standard (Shift+8 = *, / lângă Shift dreapta) | nu |
| 26 | Atom 2 – analogia scoreboard (Kill_Points…) | formulă-joc | citit | nu (ton ok pentru vârstă) |
| 27 | Quiz atom 2 – de ce `=A1+B1` în loc de `=10+5` | cheia: se actualizează | cheie decodată; comparat cu ordinea atomilor: explicația vine abia la atomul 3 | da → S11 |
| 28 | Quiz atom 2 – textul „scrii=A1+B1in loc de=10+5” | spații lipsă | citit în data-quiz (lipsesc literal) | da (minor) → S18 |
| 29 | Atom 3 – `=A1+B1`, A1 10→100 → 105 | recalcul | recalcul mintal: 100+5 = 105 | nu |
| 30 | Atom 3 – titlul fără număr (celelalte au „1.”, „2.”) | numerotare | citit | da (minor) → S18 |
| 31 | Quiz atom 3 – `=3.5*10`, prețul devine 4 lei | cheia: rămâne 35 | cheie decodată; 3,5×10 = 35; separator zecimal ro-RO = „,” (CultureInfo) | da → S13 |
| 32 | Atom 4 – referință relativă, `=A1+B1` → `=A2+B2` | copiere în jos | recalculat pe misiune (E2→E3 dă rezultatul lui Ion) | nu |
| 33 | Atom 4 – analogia dirigintelui | „rândul TĂU” | citit | nu |
| 34 | Quiz atom 4 – echivalentul lui `=B2+...+B6` | cheia `=SUM(B2:B6)` | cheie decodată; comparat cu conținutul atomului 4 (nu predă SUM, nici „:”) și cu planul | da → S11, S6 |
| 35 | Atom 5 – „Excel nu calculeaza de la stanga la dreapta” | regula | recalculat: `=10-3+2` = 9 (stânga→dreapta); `=10-(3+2)` = 5 | da → S4 |
| 36 | Atom 5 – tabelul priorităților (20, 14, 9) | exemple | recalculat: 20, 14, 9 | nu (cifrele ies) |
| 37 | Quiz atom 5 – E2 `=SUM(B2:D2)` copiat în E5 | cheia `=SUM(B5:D5)` | cheie decodată; logică verificată (3 rânduri în jos); comparat cu tema atomului (ordinea operațiilor) | da → S11 |
| 38 | Atom 6 – grila „Catalog de note cu formule” | tabel tip Excel | captura pas_06 / pas_06_atom_intreg: celulele apar una sub alta, grila nu se formează; CSS: `.excel-grid` stilizează doar `th/td`, HTML folosește `div.excel-row` | da → S2 |
| 39 | Atom 6 – valorile grilei (27, 21, 29; 9.00, 7, 9.67; 26, 24, 27, 77) | cifre | recalculat: 27/21/29; 9/7/9,67; 26/24/27/77 | da (minor, formatul „9.00” vs „7”) → S19 |
| 40 | Atom 6 – tabelul formulelor E2…E5 (8 rânduri) | formule | recalculat (aceleași formule în xlsx) | nu |
| 41 | Atom 6 – „Am scris doar 4 formule (E2, F2, B5, E5)” | numărătoare | citit; C5, D5 apar în grilă dar nu în tabelul formulelor; misiunea a folosit `=B2+C2+D2`, tabelul zice `=SUM(B2:D2)` | da (minor) → S19 |
| 42 | Atom 6 – nota despre AVERAGE „in lectia urmatoare” | trimitere | comparat cu planul: ora 8 = funcții | nu |
| 43 | Quiz atom 6 – C3 6→10 | cheia: recalcul automat | cheie decodată; recalculat bonus (E3 25, F3 8,33) | nu |
| 44 | Atom 7 – intro „procent de TVA fix” | exemplu din realitate | comparat cu Codul fiscal (ANAF) | da → S8 |
| 45 | Atom 7 – tabelul A1 / $A$1 | 2 tipuri | sursa Microsoft: există 4 tipuri ($A$1, A$1, $A1, A1) | da (minor, parte din S12) |
| 46 | Atom 7 – analogia „vecin” / „strada Primaverii nr. 5” | relativ/absolut | citit | nu |
| 47 | Atom 7 – grila TVA (19%, Caiet/Pix/Ruler) | exemplu | captură pas_07_atom_intreg: aceeași grilă stricată; „Ruler” în engleză; 19% | da → S2, S8, S18 |
| 48 | Atom 7 – formulele `=B2*$B$1`… | valori | recalculat: 0,95; 0,57; 1,52 | nu |
| 49 | Atom 7 – F4: „B1 → $B$1 → B1” | ciclul F4 | sursa Microsoft (curl): „Press F4 to switch between the reference types” + tabel cu 4 tipuri | da → S12, S21 |
| 50 | Quiz atom 7 – `=B2*B1` copiat | cheia: C3, C4 înmulțesc cu B2, B3 | cheie decodată; recalculat: C3 = 15, C4 = 24 (în loc de 0,57; 1,52) | nu |
| 51 | „Raspunde ca sa mergi mai departe” | poartă | Playwright/H_vede: pașii se deblochează | nu |
| 52 | Ex. 1 – tabel starter (5 elevi, 4 note) | copiere | citit; aceeași copiere cu TAB (verificat la pasul 9) | nu |
| 53 | Ex. 1 – F2 `=SUM(B2:E2)` | SUM | recalculat 30; comparat cu planul (SUM = ora 8) | da → S6 |
| 54 | Ex. 1 – trage F2→F6, G2 `=F2/4`, trage G2→G6 | medii | recalculat: 7,5 / 9,25 / 6,5 / 9,25 / 7 | nu |
| 55 | Ex. 1 – „Suma Anei 30, media 7.50” | verificare | recalculat: 30 și 7,5 (format General → „7,5”/„7.5”, nu „7.50”) | da (minor) → S19 |
| 56 | Ex. 1 – rezolvarea (toate cele 5 rânduri) | cifre | recalculat: toate corecte | nu |
| 57 | Ex. 2 – tabel starter (Nr elevi 28, 5 cheltuieli) | copiere | citit HTML: separat prin TAB | nu |
| 58 | Ex. 2 – C3 `=B3*$B$1`, trage la C7 | absolut | recalculat: 1260, 3360, 980, 420, 560 | nu |
| 59 | Ex. 2 – C8 `=SUM(C3:C7)` | total | recalculat 6580; SUM = ora 8 | da → S6 |
| 60 | Ex. 2 – B1 28→25 | recalcul | recalculat 5875 | nu |
| 61 | Ex. 2 – „235 lei/elev x 28 = 6580” | verificare | recalculat: 45+120+35+15+20 = 235; ×28 = 6580; ×25 = 5875 | nu |
| 62 | Ex. 2 – rezolvarea: „fara semnul $ ... B2, B3... adica celule goale” | varianta greșită | EXECUTAT varianta copilului: C4 = #VALUE! (B2 e textul „Pret/elev”), C5 = 1575, C6 = 1800, C7 = 700 (greșite, fără eroare), C8 = #VALUE! | da → S5 |
| 63 | Ex. 3.1 – `=A1+A2+A3/3`, pas cu pas | 18,67 vs 8 | recalculat: 18,666…; `=(A1+A2+A3)/3` = 8 | nu |
| 64 | Ex. 3.1 rezolvare – `=AVERAGE(A1:A3)` | funcție nepredată | comparat cu nota din atomul 6 („o vei invata in lectia urmatoare”) | da (minor) → S6 |
| 65 | Ex. 3.2 – `=B2+...+B10` vs `=SUM(B2:B10)`, 3 motive | argumentare | citit; rezolvarea dă exact 3 motive | nu (SUM → S6) |
| 66 | Ex. 3.3 – relativ/absolut cu analogii noi | explicație | citit; se poate face și pe hârtie | nu |
| 67 | Ex. 3 – cuvinte cheie (bara de formule, F4…) | vocabular | citit; toate apar în lecție | nu |
| 68 | Ex. 3 – barem („Se evalueaza...”) | criterii | citit; potrivit cu cerința | nu |
| 69 | Câmpurile „Raspunsul tau” + „Salveaza raspunsul” | salvare | Playwright: cheia `practice-cls8-...` fără profil de elev; la redeschidere textul altui elev e acolo; orice text = „correct:1, xp 15” | da → S9 |
| 70 | Nota automată (lesson-summary) | notare | Playwright: după 1 quiz greșit + un text oarecare → „grade 2, Foarte slab” | da (minor) → S17 |
| 71 | „Ce ai invatat astazi” 1–6 | recapitulare | comparat cu obiectivele: identice (+F4) | nu |
| 72 | Provocare – reducere 15% în E1, fără $ apoi cu $ | extindere | raționat: fără $, C3 = B3-B3*E2 (gol) → prețul neredus, fără eroare; cerința „observa ce se strica” se poate observa | nu |
| 73 | „De ce?” – de ce relativ implicit | reflecție | citit | nu |
| 74 | „Deschidere” – „TVA de la 19% la 21%” ca ipoteză | fapt real | sursa ANAF: cota standard este deja 21% | da → S8 |
| 75 | „Urmatoarea lectie” → lectia4-functii.html | navigare | citit HTML (href) | nu |
| 76 | Proiector (proiector_25.png) | lizibilitate | privit: text lizibil, contrast paragraf 6,62 (masuri.json) | nu |
| 77 | Ora din plan | 20.10.2026 (VIII Izvoare/Dumbrava Roșie), 23.10.2026 (8A/8M Brauner), ora 7 „Formule de calcul cu operatori aritmetici” | citit Calendar_ore_VIII.md, Calendar_ore_8A_8M.md, Proiectul_unitatii_VIII-U1.md | da → S6 |
| 78 | Timpul real | 3.242 de cuvinte + 5 pași misiune + 7 quizuri + 3 exerciții (11 subpuncte) | numărat (masuri.json) + estimat | da → S7 |
| 79 | Sala fără laborator (Izvoare) | varianta pe hârtie | citit lecția: nicio variantă pe hârtie | da → S10 |
