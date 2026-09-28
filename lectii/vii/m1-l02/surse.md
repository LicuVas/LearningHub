# Lecția VII · M1 · 2 — Interfața aplicației de realizare a documentelor. Instrumente de bază

Cheia: `lectie_vii_m1_l02` · dosarul: `lectii/vii/m1-l02/` · scrisă pe 27-28.09.2026 după `05_STANDARD_LECTIE.md` și `07_BRIEF_AUTOR.md`; refăcută pe 28.09 după judecător (`_verificare/judecator.md`: 2 GRAV, 5 MAJOR, 10 MINOR) și după decizia dirijorului.

## Programa și planul
- `Info_Gimnaziu_2026/planificari/Calendar_ore_VII_A.md`: lecția 2, 15.09.2026, M1, predare.
- `data/unitati.json`: VII-U1 „Tehnoredactare: editorul de texte”, CS.1.1 și CS.3.1; `Proiectul_unitatii_VII-U1.md` (ora 2).
- `curriculum.json`, domeniul „Editor de texte”, copiate literal (cu ţ-urile cu sedilă din programă): „Interfaţa unei aplicaţii de realizare a documentelor” și „Instrumente de bază ale unei aplicații de realizare a documentelor”.

## Forma, după decizia dirijorului (28.09)
Pasul 0 + 5 pași: (1) fereastra, cu bara de stare; (2) panglica, cu bara Acces rapid într-o frază; (3) cursorul și indicatorul mouse-ului; (4) Enter și semnele ¶; (5) ștergerea (⌫, Delete) cu Ctrl+Z / Ctrl+Y. **Zoomul** a ieșit (îl predă lecția 3, „vizualizare”); butoanele − și + ale simulatorului spun „Zoomul îl înveți în lecția 3.”. **Selectarea** a ieșit (o predă lecția 5); pasul 5 o numește într-o frază, cu trimitere.

Cuvintele obligatorii (numărătorul judecătorului, `_verificare/j_numara.js`: intro, „cum”, textul pașilor, „Uite cum”, „Încearcă” și explicația, atelierul, laboratorul, întrebările): **2.361 înainte -> 1.354 după** (`_proba/numara_dupa.json`); „Încearcă”: 9 -> 5; „Încă un exercițiu”: 20 -> 12; laboratorul: 13 -> 9 sub-pași. Pe pași (`_proba/numara_cuvinte.py`): textul 72-91 de cuvinte, „Uite cum” sub 45.

## Granița cu lecția 3
Nu predau salvarea, deschiderea, închiderea, modurile de vizualizare și zoomul. Fila Fișier (File) doar se numește; butoanele Read Mode / Print Layout / Web Layout și − / + din simulator trimit la lecția 3. Fila Vizualizare (View) apare doar pentru bifa Riglă (Ruler). Laboratorul pornește Word și alege „Document necompletat (Blank document)” (un gest, cu captura), iar la final: „Nu salva și nu închide documentul: le înveți în lecția 3.”

## Ce presupun lecțiile 3-7 despre lecția 2 (și unde îl predau aici)
Căutat în `index.html` și `profil.json` (`_proba/cauta_prerechizite.py` -> `_proba/prerechizite_l04_l07.json`; lecția 3, scrisă în paralel, citită după publicare).
- [x] Word e un procesor de text; ce scrii e un document, păstrat ca fișier .docx (l04, l05) — pasul 0.
- [x] Panglica și filele Fișier (File), Pornire (Home), Inserare (Insert), Vizualizare (View) (l03-l07) — pasul 2.
- [x] Pe o filă, butoanele stau în grupuri (l05-l07) — pasul 2.
- [x] „Ține mouse-ul pe un buton ca să-i vezi numele” (l04, l07) — pasul 2.
- [x] Săgeata ▾ de lângă un buton deschide o listă (l06, l07) — pasul 2.
- [x] Săgeata mică ↘ din colțul grupului deschide fereastra grupului (l06) — pasul 2; OK / Cancel (Anulare) — „Uite cum”.
- [x] „Sub panglică”, „în dreapta filelor” (l05-l07) — pașii 1-2.
- [x] Bara de stare, jos: pagina și numărul de cuvinte (l03, l04) — pasul 1.
- [x] Cursorul = linia care clipește; ce tastezi apare acolo (l04-l06) — pasul 3.
- [x] „Scrii textul și apeși Enter” (l03); paragraful = textul până la Enter (l04, l06) — pasul 4.
- [x] Backspace (⌫) la stânga, Delete (Del) la dreapta (l04, l05) — pasul 5.
- [x] Ctrl+Z anulează ultima operație; „fiecare apăsare anulează o singură comandă” (l05-l07); tasta Ctrl ținută + o literă — pasul 5 (regula 13: literele tastate una după alta = o operație, fiecare Enter/⌫/Delete = una; probat).
- [x] „Deschide Word din meniul Start și alege documentul gol (Blank document)” (l06) — laboratorul, cu captura.
- [ ] Selectarea (tragere, dublu-clic cu spațiul de după, fundalul gri): o predă lecția 5 (pasul 1), iar lecțiile 6-7 o iau de acolo. Aici doar se numește.
- [ ] Zoomul (− și + din bara de stare): îl predă lecția 3.
- [ ] Ctrl+N / Ctrl+S / Salvare ca (lecția 3), Vizualizare protejată + Activare editare (lecția 5), meniul și Tab în tabel (lecția 4), filele contextuale (lecția 7): nu sunt ale lecției 2.

Nimic nu contrazice lecțiile 3-7 (aceleași formulări: cursorul „linia care clipește”, ⌫ „stânga” / Delete „dreapta”, Ctrl+Z „ultima operație”). Regula 15: textele de tastat în laborator nu au diacritice, apostrof sau AltGr; pe telefon Ctrl și săgețile sunt butoane și pagina o spune. Regula 19: tastele probate ca taste.

## Numele românești (RO (EN))
Din `calibrare/meniuri_ro_en.json` (CONFIRMAT): filă, grup, Pornire (Home), Inserare (Insert), Vizualizare (View), Font, Paragraf (Paragraph), Clipboard, Anulare (Undo), Refacere (Redo).
Din alte pagini Microsoft ro-ro (citatele în `calibrare/_cache/` și în primele rânduri ale probelor):
- Bara de titlu, Bara de instrumente Acces rapid, Fila Fișier, Panglică, Bara de defilare, Bara de stare — „Word pentru utilizatorii noi”.
- Repetare (Repeat); „Butonul Refacere apare doar după ce ați anulat o acțiune” — „Anularea, refacerea sau repetarea unei acțiuni”.
- Afișare/Ascundere ¶ — „Afișarea sau ascunderea marcajelor de tabulare în Word”, „Conversia unui text în tabel”.
- Riglă (Ruler), pe Vizualizare — „Afișarea riglei”, „Utilizarea riglei în Word”.
- Opțiuni afișare panglică (Ribbon Display Options), Afișare / Ascundere bară de instrumente Acces rapid, locul implicit „în bara de titlu” — „Mutarea…”, „Particularizarea barei de instrumente Acces rapid”.
- Document necompletat (Blank document) — „Crearea unui document în Word”; lansatorul casetei de dialog; Anulare (Cancel) — „Word pentru utilizatorii noi”.
NESIGUR: textele barei de stare în Word-ul românesc (lecția spune doar „scrie la fel, în română”); **grupul Afișare (Show)** de pe Vizualizare (J9: „Afișare” e numele din PowerPoint ro-ro, pentru Word n-am găsit pagina); meniurile Full-screen mode / Show tabs only / Always show Ribbon (doar în simulator, în engleză, „nu le folosim”).

## Probele în Word-ul real (regula 7; `_proba/`)
Word 16.0, build 20326 (Microsoft 365, pachetul englez), tastatura Română (Standard). Tastele: mesaje complete (Shift/Ctrl apăsate prin mesaje, ca o tastatură; clasa T3 din `proba_word_l02_real.py`) în instanțe noi, invizibile; fereastra și capturile: pe desktopul ascuns (`C:/00/AI_0/tools/hidden_desktop.py`, UI Automation, PrintWindow).
- `proba_word_j.py` -> `rezultate_word_j.json` (după judecător, J2): laboratorul nou, pas cu pas (12 words, „film”, 2 paragrafe / 2 rânduri, **Ctrl+Z scoate propoziția tastată, Ctrl+Y o aduce**, 25 words, ¶ oprit); „caiettul” ⌫/Delete, Ctrl+Z, Ctrl+Y; „ Vino la noi!” și „ Adu o minge.” tastate, Ctrl+Z, Ctrl+Y; atelierul (20 de cuvinte) și „Încă unul” (11). 0 infirmate.
- `proba_word_l02_real.py`, `proba_word_afirmatii*.py`, `proba_word_l02*.py`: unitățile de anulare, Repetarea, ¶, rândul gol, literele din exerciții, ¶ netipărit (PDF șters), riglele în cm, ↑ ↓.
- Dublu-clicul (J1, GRAV): proba mea (`proba_word_dublu_clic.py`) a selectat „luni ” cu `Selection.Expand`, NU cu un dublu-clic, și a dat „joila”; judecătorul a arătat cu dublu-clic real (`_verificare/j_word_dublu_clic2.json`) că Word păstrează spațiul. Regula falsă („tastează și spațiul”) a ieșit odată cu selectarea; simulatorul face acum ce face Word.
- `afirmatii.json`: 34 de afirmații (24 probate de mine, 3 de judecător, 1 în lecțiile 6-7, 2 din surse Microsoft, 1 parțial, 3 gesturi neprobabile aici).

## Setările Word ale profesorului (regula 25)
Semnele ¶, zoomul documentelor noi și bara Acces rapid au fost schimbate de probe și puse înapoi; verificat de fiecare dată într-o instanță nouă (`verifica_setari.py` -> zoom 100, ShowAll oprit, riglele pornite; bara Acces rapid ascunsă: `rezultate_uia_qat.json`). Instanțele se închid cu `Close(0)` + `Quit(0)` (`wordcom.py`, `fa_capturi.py`), iar cele oprite forțat (PID 29684, 29792, pe 27.09) erau ale mele (linia de comandă și ora pornirii). Niciun document salvat sau deschis de pe disc, deci nimic în „Recent”.

## Imaginile (`img/SURSE.json`)
- `masina-de-scris.webp` — Wikimedia Commons, PantheraLeo1359531, CC BY-SA 4.0 (licența din pagina fișierului, prin API, User-Agent-ul impus).
- Capturi din Word-ul real, de pe desktopul ascuns, refăcute pe 28.09 (`fa_capturi.py`, apoi `fa_imagini.py`; fără contul din bara de titlu și fără documentele recente): `fereastra-word.webp`, `panglica-grupuri.webp`, `bara-stare.webp` (doar pagina și cuvintele), `text-doua-randuri.webp` și `text-cu-semne.webp` (decupate mai jos: al doilea rând și ¶ se văd întregi, J10). `bara-acces-rapid.webp` și `document-gol.webp` sunt cele din 27.09.
- Scoasă: `selectie-cuvinte.webp` (J6: nu arăta nicio selecție; selectarea a ieșit din lecție). Refolosit: `jocuri/word-vii/img/buton-pilcrow.webp`.
- Capturile întregi din `_proba/randari/` le șterg după decupare (au inițialele contului).

## Simulatorul
`lectii/_sim/wordobj.js` (proprietar: lecția 5) e neschimbat. Extensia mea, `lectii/_sim/wordobj-interfata.js` (tipul `wordui`), încărcată doar de lecția 2. Reparațiile după judecător: J3 (lista testelor era într-un comentariu), J2 (Ctrl+Z încheie întâi tastarea în curs), J8 (Repetarea tastării ca tastare; mutarea cursorului nu mai uită ultima operație), J1 (dublu-clic + tastare păstrează spațiul, ca în Word), J7 (¶, bifa Ruler, filele, ▲ ▼: minimum 32 px pe telefon), J12 (legenda panglicii), J15 (documentul gol primește cursorul de la început, pe calculator), J17 (clicul pe „Page 1 of 1” deschide panoul Navigare). Semnalat proprietarului lui `wordobj.js`: `anuleaza()` pe o tastare neîncheiată, tastarea peste o selecție de dublu-clic, Ctrl+Y fără anulare.

## Porțile
- `test_joc.py --dir lectii/vii m1-l02`: TRECUT (29 de întrebări jucate; „1 niveluri” e avertismentul așteptat).
- `verifica_lectie.py index.html --fara-t1`: ultima linie 0 (S0, S1, S2, T0 trecute).
- `_proba/proba_ui_l02.py` (Playwright, pagina prin HTTP, gesturi reale, 390 px cu atingere și 1280 px cu mouse și tastatura): toți pașii, „încă”, atelierul și „Încă unul”, laboratorul, 5 întrebări, diploma, plus J1, J2, J3, J7, J8, J15, J17 -> 0 probleme, 0 erori JS, 0 erori în consolă. Regula 24: toate cererile în afara serverului local au fost oprite (doar fonts.googleapis.com); nicio cerere spre teste-vasile, niciun nume.

## Ce n-am putut verifica
- Forma indicatorului mouse-ului și derularea cu rotița (pe desktopul ascuns nu există mouse); pornirea Word din meniul Start.
- Textele barei de stare și numele grupului Show în Word-ul românesc; bara Acces rapid în Word 2016-2021.
- Unitatea riglei depinde de setările Windows (aici centimetri).
