# Surse — VIII m1-l02 „Interfața aplicației de calcul tabelar. Structura unui registru”

Autorul lecției, 27-28.09.2026; reparată după judecător (`_verificare\judecator.md`) și după judecata 2 (`_verificare\judecator2.md`) pe 28.09. Numerotarea pașilor ca în
bara motorului: P1 = „La ce folosește”, P2-P6 = pașii 1-5 (P2 fereastra pe zone, cu filele foilor; P3 panglica; P4
coloane, rânduri și celule; P5 scrii și te miști; P6 caseta de nume și bara de formule).

## Programa și planul
- Conținuturile (textul exact din `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, OMEN 3393/2017): „Elemente de interfaţă ale unei aplicaţii de calcul tabelar” și „Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă)”. Competențele unității: CS.1.1, CS.3.1.
- `C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json`: VIII-U1 „Calcul tabelar”, lecția 2 (predare, teorie + exerciții). `planificari\Calendar_ore_VIII.md`: 15.09.2026, lecția 2, M1. `planificari\Proiectul_unitatii_VIII-U1.md`: ora 2.
- Granița cu lecția 3 (alt autor): NU predau registru nou/deschidere/salvare/închidere și nici operațiile cu foi (inserare, redenumire, ștergere, mutare, culoarea filei). Predau doar că un registru are mai multe foi, fiecare cu fila ei, și că un clic pe filă te duce pe foaia aceea. Butonul +, dublu-clicul și clic dreapta pe filă spun pe ecran, în simulator, „înveți în lecția 3”.
- Granița cu lecția 4 (publicată): adresa ca idee „litera coloanei, apoi numărul rândului” (C4) și celula activă (chenar verde); NU predau zona (A1:B3), selectarea prin tragere, antetele ca selecție, Delete sau Ctrl+Z. Nu repet exercițiile lecției 4 („Nota 2 a Danei” → C5, „Bogdan” → A3, „D12/12D/D-12/L4”): după judecător (m11), și pasul 3 din Excel-ul adevărat folosește acum celula Cristinei (A4), nu pe a lui Bogdan.

## Materialul profesorului (prioritate)
`C:\00\Projects\Info_Gimnaziu_2026\materiale\continut\clasa_VIII_M1.json`, lecția 2 („Aplicația de calcul tabelar: interfața și structura unui registru”). Am luat: registru → foaie → celulă (P1, P2, P4); coloanele cu litere (… Z, AA, AB), rândurile cu cifre; adresa „întâi coloana, apoi rândul”; caseta de nume „arată adresa celulei curente; scrii acolo o adresă și sari direct la ea” (P6); bara de formule „arată ce este scris de fapt în celulă” (P6); aplicațiile Excel, LibreOffice Calc, Google Sheets (P1); ideea „aplicația calculează” (P1).
NU am luat aici (le au lecțiile următoare, după granițele dirijorului): „Domeniul (zona) A1:C10” și „clic pe antete selectează toată coloana/rândul” (lecția 4), „filele foilor: adaugi, redenumești, colorezi, muți foi” (lecția 3), „bara de stare: suma și media celulelor selectate” (cere selectarea, lecția 4) și „bara de formule arată formula” (lecția 7; P6 spune doar de unde vine numele).

## Ce am refolosit și imaginile
- `jocuri\excel-pas-cu-pas-viii\index.html`, nivelul „Foaia, celula și adresa” (`lectii:[2]`): analogia cu caietul de matematică (registru = caiet, foi = pagini, celule = pătrățele), ideea „caseta de nume nu minte”. Nu am luat zona (lecția 4) și nici „Vapoare” (lecția 4 o folosește deja; aici e tabla de șah, cu aceeași ordine: litera = coloana, cifra = rândul).
- Simulatorul: foaia comună `lectii\_sim\excelx.js` (proprietar: autorul lecției VIII/5), neschimbată, + extensia NOUĂ `lectii\_sim\excelx-interfata.js` (proprietar: autorul acestei lecții), vezi mai jos.
- Capturile le-am făcut din Excel-ul real, 28.09, pe desktopul ascuns (10 capturi, toate sub 35 KB).
- **P1 („La ce folosește”), după judecător (m9):** fotografie din viața reală, de pe Wikimedia Commons: „File:Museu de la Mar - Port de Sóller 10.jpg” (registrul de cheltuieli al corabiei „Union”; Commons îl descrie ca din 1870, iar pe paginile din poză scrie 1866, deci legenda spune „anii 1860-1870”), autor Kritzolina, **CC BY-SA 4.0**. Licența am citit-o pe pagina fișierului („Creative Commons Attribution-Share Alike 4.0”), cu User-Agent `LearningHub-lectii/1.0 (educational site)` (`_proba\ia_commons.py`). Am micșorat-o la 800 px și am convertit-o în WebP (42 KB), fără alte schimbări. Sub imagine: autorul, legătura spre pagina Commons, legătura spre licență și „micșorată” (după judecata 2, n4); tot acolo, în `img\SURSE.json`. Captura din Excel care era înainte în P1 (`registrul-clasei.webp`) am scos-o.

## Extensia simulatorului: `lectii\_sim\excelx-interfata.js` (tipul `ExcelI`)
Ce adaugă foii „excelx”, fiecare lucru probat în Excel-ul real (fidelitate, regula 9):
1. **Filele foilor**, jos (`foi:[{nume, cells}]`): clic pe filă = treci pe foaie; fiecare foaie își ține conținutul, celula activă (probat: `proba_afirmatii2.json` F) și **zoom-ul** (probat: `proba_reparatii.json` M1). Cu mai multe foi, **anularea e pe tot registrul**: anularea unei scrieri de pe altă foaie te duce întâi pe foaia aceea (probat: `proba_afirmatii.json` D). **Clic pe fila altei foi în timp ce scrii**: se confirmă ce ai scris, fără mutare, și treci pe foaie (probat: `proba_reparatii.json` m1).
2. **Zoom-ul**, în dreapta barei de stare: + la următorul multiplu de 10, − la multiplul de 10 de dedesubt (probat: `proba_ascuns2.json`, 100→110→120→130→120→110→100→90), **al fiecărei foi**. Glisorul doar arată; clicul pe el și pe procent spune pe ecran că aici se folosesc − și + (abatere spusă elevului).
3. **Enter după Tab** (probat cu taste reale, `proba_ascuns.json`, `proba_reparatii.json` G1): A5 Elev ⇥ Nota ⇥ Clasa ↵ → A6; C10 a ⇥ b ↵ → C11; A13 ⇥ ⇥ ↵ (fără să scrii) → A14; A17 x ⇥ y → ↵ → C18 (săgeata rupe șirul); **clicul pe celula ACTIVĂ nu rupe șirul** (A12 x ⇥ clic B12 y ↵ → A13); clicul pe ALTĂ celulă îl rupe (A15 x ⇥ clic D15 y ↵ → D16); drumul de pe telefon (clic pe A8, clic în bară, Elev ⇥, clic pe B8, clic în bară, Nota ↵) → A9. **Foaia din motor (`_motor\tip-excel.js`) cobora simplu** (C5 ↵ → C6): e reparat în extensie. CERERE pentru `_motor`: aceeași regulă în `muta()`/`termina()`.
4. **„Unde e…”**: ultimul loc atins (caseta de nume, bara de formule, filă sau grup al panglicii, fila foii, bara de stare, zoom-ul, litera coloanei, numărul rândului, celula) + verificările `unde`, `foaie`, `fila`, `zoom`, `activa`, `pe`, `neatinsa`, `doarTaste` și testele numite ale atelierului pe ele. **Valorile le verifică extensia în toate exercițiile** (după judecător, M2), cu mesajul „În A2 trebuie scris „Ana”, iar acum e „9”.”, nu cu mesajul foii din motor (care vorbea de TEXT și zecimale, lecția 5).
5. **Telefonul**: Tab, Enter, săgețile și Esc ca butoane sub foaie (regula 15). Când caseta de nume are focusul, butoanele merg în ea (după judecător, G2: H15 + Enter ↵ → H15). Nota de telefon a foii comune (care vorbea de zone și de clic dreapta, lecția 4) e înlocuită cu una despre ce știe elevul acum, inclusiv că, scriind în bara de formule, bara de stare arată Editare (Edit) (m5). Pe telefon, scrisul trece prin bara de formule, unde săgețile mută cursorul (ca modul Editare din Excel), nu celula. Pe ecranele cu atingere, filele panglicii, ↶ ↷, celulele și antetele au cel puțin 32 px (m6; măsurat în `proba_gesturi.py`).
6. **Textul lung** e tăiat drept, ca în Excel, fără „…” (`text-overflow:clip`, doar în lecțiile care încarcă extensia). CERERE pentru `_motor`.
7. **Caseta de nume, fără zone** (după judecător, m10): mesajele foii comune vorbeau de „zonă ca B2:C4” (lecția 4). Extensia le rescrie: pentru o adresă greșită „scrie întâi litera coloanei, apoi numărul rândului, de exemplu B2”; pentru un cuvânt, ce face Excel (probat, `proba_reparatii.json` M3: „aici” → numele `=Excursie!$D$4`, D4 goală, fără niciun mesaj).
8. `start:'D4'` = celula activă de la început; după judecata 2 (G-n1), foaia primește atunci tastatura după desen, ca elevul să scrie direct, fără clic (și când deschide exercițiul cu butonul „Încă un exercițiu”).
9. **↶ apăsat cât scrii** (după judecata 2, n1): renunță la ce scrii, ca Esc, și nu atinge celula scrisă înainte. Probat în Excel (`proba_undo_scriere.json`): F5 „Elev” rămâne, textul din F6 dispare. Abatere mică, spusă aici: Excel rămâne în modul Enter cu celula goală, foaia de aici iese din scriere (ca după Esc).
10. **Compatibil cu motorul nou** (`tip-excel.js` are acum Enter după Tab): motorul rupe șirul la orice clic pe celulă, extensia nu îl rupe la clicul pe celula activă și mută celula o singură dată, doar dacă motorul a coborât simplu. Probat în `proba_gesturi.py` (G1, P5, atelier, Î5): fără mutare dublă.
Ce NU face (spus aici): Shift+Tab rupe șirul Tab–Enter (neprobat: Shift nu se poate trimite prin mesaje pe desktopul ascuns). Fereastra Zoom și glisorul nu sunt simulate.

## Cum am verificat faptele
Setările acestui PC: virgulă zecimală, `;` între argumente (citite din Excel). Office 16, interfața în engleză.
1. **COM, instanță nouă și invizibilă** (`DispatchEx`, `Visible=False`, fără salvare, `Quit()` doar pe ea): registrul nou are 1 foaie (Sheet1), foaia are 1.048.576 de rânduri și 16.384 de coloane (ultima XFD), Enter coboară (`MoveAfterReturnDirection = xlDown`) — `proba_ascuns2.py`; registrul de descărcat, A4 = „Cristina Munteanu”, B4 = 10 — `proba_cristina.py` (deschis cu `Workbooks.Open(..., AddToMru=False)`).
2. **Tastare adevărată pe un desktop ascuns** (`C:\00\AI_0\tools\hidden_desktop.py run`; scripturile se opresc dacă rulează pe desktopul „Default”): `EXCEL.EXE /x` (instanță nouă), obiectul COM luat din fereastra EI (verificat pe PID), literele și tastele ca `WM_CHAR`/`WM_KEYDOWN` spre fereastra foii; clicurile ca mesaje de mouse spre fereastra de sub punct (fără mouse-ul adevărat); zoom-ul prin UI Automation (Invoke, fără mouse; `click_input` interzis în `uia_l02.py`). La final registrul se închide fără salvare, Excel-ul nostru se oprește (și după PID-ul LUI; niciodată alte procese EXCEL). `proba_ascuns.py`, `proba_ascuns2.py`, `capturi3.py`, `proba_afirmatii.py`, `proba_afirmatii2.py`, `proba_caseta.py`, `proba_reparatii.py`, `proba_undo_scriere.py` (acesta după regula 25: Excel pornit FĂRĂ fișier, copia deschisă cu `AddToMru=False`).
3. **Capturi** (PrintWindow, pe desktopul ascuns, fără bara de titlu): `capturi3.py` și `proba_afirmatii.py` → `cap\*.png` → `fa_imagini.py` → `img\*.webp` + `img\SURSE.json` (după judecător, m7: `scriere-enter.webp` e declarată „două decupaje din aceeași captură, lipite”, iar `panglica-insert.webp` numește doar grupurile care se văd).
4. **Simulatorul față de Excel, cu gesturi reale**: `_proba/proba_gesturi.py` (Playwright, 1280 px mouse + tastatură și 390 px atingere, cu butoanele de sub foaie; **regula 24: toate cererile care nu merg spre serverul local sunt blocate**, 0 spre teste-vasile) → **148 de verificări, 0 picate, 0 erori în consolă**, inclusiv drumurile judecătorului (G1, G2, M1, M2, m1, m6, m10) și ale judecății 2 (G-n1 deschis cu butonul adevărat „Încă un exercițiu”, la 1280, 390 și 768 px; n1). Capturi de telefon privite: `_proba_telefon_p4.png`, `_proba_telefon_atelier.png`.
Rezultat: `afirmatii.json` = 29 de afirmații, 28 probate și potrivite, 1 neprobată (banda galbenă a Vizualizării protejate).
**Regula 25 (calculatorul profesorului rămâne cum era):** am oprit doar instanțele mele (după PID). Probele de dinainte de regulă au deschis fișierele din linia de comandă (`EXCEL.EXE /x <fișier>`), deci au lăsat în lista „Recent” a Excel-ului (`HKCU\Software\Microsoft\Office\16.0\Excel\User MRU\…\File MRU`) aceste 7 intrări, toate în `lectii\viii\m1-l02\_proba\`: `_gol_l02.xlsx`, `_gol_l02b.xlsx`, `_gol_l02c.xlsx`, `_copie_registru.xlsx`, `_copie_registru2.xlsx`, `_gol_caseta.xlsx`, `_copie_reparatii.xlsx`. Nu le-am șters din registru (le scoate dirijorul, cum a cerut). Probele de după regulă (`proba_cristina.py`, `proba_undo_scriere.py`, `AddToMru=False`) n-au lăsat nimic (verificat în registru). În `%APPDATA%\Microsoft\Excel\` nu e niciun fișier de recuperare de-al meu; cele de acolo sunt `_j2_copie…` (ale judecătorului) și două `Book1((Unsaved-…))` din 23 și 25.09. Excel-ul lor apare ca panou „Document Recovery” în orice instanță nouă (l-am văzut în captura probei `proba_undo_scriere`).

## Numele RO (EN)
- CONFIRMATE (`calibrare\meniuri_ro_en.json`): filă (tab), grup (group), Pornire (Home), Inserare (Insert), Aspect pagină (Page Layout), Formule (Formulas), Date (Data), Revizuire (Review), Vizualizare (View), grupurile Font, Număr (Number) și Clipboard.
- Din paginile Microsoft ro-ro: „Bara de formule”, „bara de stare”, „controalele Zoom”, „Panglică”, „Bara de instrumente Acces rapid”, „registru de lucru”, „foaie de lucru”, „selector de foaie”, **„caseta Nume”** („În caseta Nume, tastați un nume.”, găsit de judecător) și **„Activare editare”** („Pe Bara de mesaje, selectați Activare editare”, găsit de judecător; în pagină acum „Activare editare (Enable Editing)”, româna întâi).
- Păstrate în forma lecțiilor 3-4, cu engleza alături: „caseta de nume (Name Box)” (Microsoft: „caseta Nume”), „filele foilor (sheet tabs)” (Microsoft: „selector de foaie”), „registru de calcul (workbook)” (programa; Microsoft: „registru de lucru”).
- **NESIGURE**: numele foii într-un Excel în română (lecția spune doar „în Excel-ul în engleză ea se numește Sheet1”); „Gata” / „Introducere” în bara de stare (pe ecran, probat: „Ready” / „Enter”; foaia din motor le arată cu engleza alături); „Mărește / Micșorează” pentru butoanele zoom-ului (pe ecran: „Zoom In” / „Zoom Out”). Numele grupurilor Alignment și Styles nu mai apar în lecție (m4).

## Ce presupun lecțiile publicate 4-7 despre interfață (și unde le acoperă lecția)
| Presupus | Unde îl presupune | Acoperit în lecția 2 |
|---|---|---|
| coloanele au litere, rândurile au numere | L4 (P2 „Din lecția 2 știi”), L6 („Ai nevoie de”) | ✔ P4 |
| celula = căsuța de la întâlnirea coloanei cu rândul | L4, L5, L7 | ✔ P4 |
| celula și adresa ei (litera + numărul, C4) | L5, L6 („Ai nevoie de”); L4 o predă în detaliu | ✔ P4 (ideea), fără zone |
| caseta de nume, în stânga, arată adresa | L4 („Ai nevoie de”; P2) | ✔ P2, P6 |
| clic pe celulă și scrii | L4, L5, L7 | ✔ P5 |
| Enter confirmă și te duce în celula de dedesubt | L4, L5, L7 | ✔ P5 (probat) |
| Tab | L4 („Ai nevoie de”; provocarea: „Elev, Tab, Nota, Enter”, apoi A2:A5) | ✔ P5, cu Enter după Tab (probat: te întoarce în A; clicul pe celula activă nu rupe șirul) |
| bara de formule arată ce e scris de fapt în celulă | L5, L6, L7 | ✔ P2, P6 |
| celula activă (chenarul verde; în zonă rămâne albă) | L4 (P3), L6 | ✔ P4 (chenar verde); zona rămâne în L4, fără contradicție |
| foile de jos (filele) | L4 („Ai nevoie de”: „foile de jos”, din lecția 3) | ✔ P1 (registru, foi), P2 (filele foilor; clic = trece pe foaie) |
| panglica, fila Pornire (Home), grupurile (Clipboard, Editare, Font, Număr…) | L4 (P5), L5 (P5), L6 | ✔ P3 (file, grupuri, Font, Număr); numele grupurilor din L4-L6 nu le repet |
| „derulează panglica spre dreapta” | L5, foaia comună | ✔ P3 Încă un exercițiu 1 (indiciul) și nota foii |
| Esc | L4 („Esc oprește marginea punctată”) | ✔ P5 (Esc renunță la scriere) — sensuri compatibile: Esc anulează ce e în curs |
| butonul Verifică, butoanele de pe ecran la telefon | toate | ✔ P2 Încearcă, nota de telefon |
Reguli ale standardului verificate pe lecție: 11 (setări RO) — lecția nu scrie zecimale sau date, doar numere întregi și text; 13 (Ctrl+Z) — lecția nu predă și nu cere Ctrl+Z (singurul loc: mesajul atelierului, dacă elevul scrie pe foaia greșită, trimite la butonul ↶ „ca în Word”); 14 (focusul după Verifică) — după „Nu încă” foaia își ia înapoi focusul; 15 (tastatura RO, telefonul) — Tab, Enter, Esc și săgețile sunt la fel pe tastatura românească; pe telefon sunt butoane pe ecran, și în caseta de nume; 20 (32 px); 24 (rețeaua blocată în probe); 25 (doar instanța mea, lista „Recent”, mai sus).

## Reparațiile după judecător (28.09.2026) — unde e fiecare
- **G1** clicul pe celula activă nu rupe șirul Tab–Enter: `excelx-interfata.js`, `leaga()`, ascultătorul `pointerdown`. Probat în Excel (`proba_reparatii.json` G1) și în simulator (`proba_gesturi.py`: „G1 …”, 1280 și 390 px).
- **G2** butoanele de sub foaie merg în caseta de nume: `excelx-interfata.js`, `tasteEcran()`. Proba: „G2 … (butonul de sub foaie) -> H15”.
- **M1** zoom-ul pe foaie: `excelx-interfata.js` (`zoomPe`, `comuta()`, `probleme()`, `rezolva()`, `gresit()`); `index.html`: P2 „Uite cum” („Fiecare foaie își ține zoom-ul ei.”), atelierul (pasul 4 și testul „Foaia Excursie are zoom-ul 120 %”, Orar la fel), pasul 7 din Excel-ul adevărat (Note rămâne la 100 %).
- **M2** mesajul pentru valori: `excelx-interfata.js`, `bazaV()` + `probleme()` (valorile, mereu în extensie).
- **M3** P6, Încă un exercițiu 2: „Uită-te în caseta de nume: ea îți arată unde ești. Fără niciun clic, scrie cuvântul aici și apasă Enter: ajunge în celula activă.”
- **m1** clic pe filă în scriere: `excelx-interfata.js`, `comuta()` (Ctrl+Enter pe bara de formule = confirmă pe loc, apoi trece; scrierea intră în anulare pe foaia ei).
- **m2** „Activare editare (Enable Editing)”: pasul 1 din Excel-ul adevărat.
- **m3** „filele foilor (sheet tabs)”: P2, zona 5; Sheet1: P4 „Uite cum” („în Excel-ul în engleză ea se numește Sheet1”).
- **m4** P3, Încă un exercițiu 1: „spre mijlocul panglicii”, fără nume doar în engleză.
- **m5** legenda capturii din P5 + nota de telefon a simulatorului (Editare (Edit)).
- **m6** 32 px pe ecranele cu atingere: CSS-ul extensiei (`@media (pointer:coarse)`).
- **m7** `img\SURSE.json` (`fa_imagini.py`).
- **m8** P4 are acum doar coloane, rânduri, celule, adresa și celula activă; registrul și foile sunt definite în P1, filele foilor în P2.
- **m9** P1: fotografia de pe Wikimedia Commons (mai sus).
- **m10** mesajele casetei de nume: `excelx-interfata.js`, `casetaFaraZone()`.
- **m11** pasul 3 din Excel-ul adevărat: celula Cristinei (A4).

## Reparațiile după judecata 2 (28.09.2026) — unde e fiecare
- **G-n1** P6, Încă un exercițiu 2: `excelx-interfata.js`, `render()` (cu `start`, focusul pe foaie după desen, de trei ori, pentru că motorul mai mută focusul). Probat: deschis cu butonul „Încă un exercițiu”, focus pe foaie, „aici” + Enter fără clic → D4 (1280 și 768 px); indiciul are și ieșirea „Dacă tastele nu merg, fă un clic pe celula activă”. Celelalte „Încă un exercițiu” încep toate cu un clic spus în text (sau nu cer tastare); întrebarea 5 spune acum explicit „clic pe A4”.
- **n1** ↶ cât scrii: `excelx-interfata.js`, ascultătorul `click` (înaintea anulării pe tot registrul), la toate exercițiile.
- **n2** același exercițiu, pe telefon: „(Pe telefon: atingi bara de formule, scrii aici și atingi Enter ↵ de sub foaie.)” Probat la 390 px.
- **n3** P3 „Uite cum”: textul alternativ al imaginii Insert numește doar grupurile care se văd.
- **n4** P1: legenda fotografiei, cu legături și „micșorată”, anii 1860-1870.

## Contradicții găsite (pentru profesor și dirijor)
1. **Grupul Clipboard:** numele românesc e „Clipboard” (calibrare + Microsoft ro-ro); lecția 4 scria „Memorie temporară (Clipboard)”. O corectează dirijorul. Lecția 2 nu numește grupul.
2. **Enter după Tab:** foaia din motor (`tip-excel.js`) nu întorcea în coloana de pornire, deși provocarea lecției 4 se bazează pe asta. Reparat în extensia mea; cerere pentru `_motor`.
3. **Textul lung cu „…”** în foaia din motor; Excel îl taie drept. Reparat în extensie; cerere pentru `_motor`.
4. **Mesajul foii din motor pentru o valoare greșită** vorbește de TEXT și zecimale (lecția 5) chiar când elevul n-a scris nicio zecimală: ocolit în extensie (M2); cerere pentru `_motor`.
5. Materialul profesorului pune în lecția 2 zona A1:C10 și suma din bara de stare: le-am lăsat lecției 4 (granița dirijorului).

## Ce NU am putut verifica (nesigur)
- Banda galbenă „Activare editare (Enable Editing)” la registrul descărcat: pe desktopul ascuns, Excel răspunde „The file couldn't open in Protected View.” De văzut pe un calculator din laborator.
- Shift+Tab și Shift+Enter (nu apar în lecție).
- Numele românești marcate NESIGURE mai sus.

## Porțile
- `python jocuri/_motor/test_joc.py --dir lectii/viii m1-l02` → **TRECUT** (30 de întrebări jucate; singurul avertisment: „1 niveluri”, așteptat; poarta blochează singură rețeaua, regula 24).
- `verifica_lectie.py … --fara-t1` → S0 TRECUT · S1 0 identice · S2 6/6 aplicare/execuție · T0 TRECUT → **ultima linie 0**.
- `_proba/proba_gesturi.py` → 137 de verificări, 0 picate, **0 erori în consolă** (1280 px și 390 px cu atingere; rețeaua blocată).
- `curata_metadate.py` (fără `--curata`) → ultima linie 0; `registrul_clasei.xlsx` are doar titlul „Registrul clasei”.
