# Rundă `acoperire` pe PowerPoint, după runda 11 (valul B-powerpoint) — scris de orchestrator, 20.11.2026

Ești agentul rundei `acoperire`. NU ești autorul bibliotecii. Nu atingi nimic sub `C:/00/Projects/LearningHub_fidel/aplicatii/`,
lecțiile, jocurile sau `jocuri/_motor/`. D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`.

## De ce există runda
Criticul rece al rundei 11 (`D/runde/11/critic.md`) a găsit 5 GRAV pe PowerPoint. Patru nu se pot repara fără referință, iar
contractul interzice suprafețe scrise din memorie:
- **P2 · Font Color ▾**: paleta nu e capturată (`README_referinte.md`, „listele derulante și galeriile deschise”). Lecțiile m1-l06:150,
  m2-l08:205, m2-l09:352 cer o culoare din paletă.
- **P3 · închiderea și fișierele**: fereastra „Save your changes” la Ctrl+W / File › Close / ✕ pe o prezentare modificată nu e
  capturată; nici ce rămâne după închidere, nici Ctrl+N. Lecțiile m1-l02:329, m1-l03:106, :211, :241, m2-l08:330.
- **P4 · obiectele de pe diapozitiv**: lista Insert › Pictures (This Device…), galeria Shapes și listele de aspecte (New Slide ▾,
  Layout ▾, cu Two Content) nu sunt capturate; copierea unei casete (Ctrl+C / Ctrl+V) n-are rezultat real. Lecțiile m1-l05:184,
  m2-l09:228, :233-235, m2-l10:150-151, :299.
- **P5 · detaliile efectelor**: Duration (Transitions), ordinea din Animation Pane cu Move Up / Move Down și Format Background ›
  Solid fill / Color ▾ / Apply to All au referință doar „de la dump” (gri, fără stare după gest). Lecțiile m1-l07:156-159, :194,
  :203, m1-l06:150.

Al cincilea, **P1 (KeyTips)**, are deja referință: fiecare comandă are `tasta_acces` în `uia_powerpoint.json`. Îl repară runda
următoare. Un scenariu real cu tastele de acces e doar un bonus (§2).

Tot criticul spune că 3 scenarii înghețate cer altceva decât referința (`critic.md`, „Verdictul pe cele 4 scenarii”):
- `powerpoint-diapozitiv-nou-buton` apasă centrul butonului New Slide, care cade pe partea cu săgeată;
- `powerpoint-imagine` cere `mso:PictureInsertFromFile`, care nu e pe ecran;
- `powerpoint-salvare-ca` cere `mso:FileSaveAs`, care nu e pe ecran.
Iar `powerpoint-tragere-forma` n-are rezultat real. `D/de_verificat.md` are R11-1 … R11-13 „de lămurit pe PowerPoint real”.

Contractul (`D/contract.md`): „Lărgirea acoperirii … doar într-o rundă marcată `acoperire`, care are voie să crească numerele, și
reînghețată după”. Tu lărgești acoperirea din PowerPoint-ul REAL, nu din bibliotecă și nu din memorie.

## Regula de aur
Tot ce scrii ca referință sau rezultat așteptat vine dintr-una din trei surse:
- PowerPoint-ul REAL de pe PC, prin UI Automation pe desktopul ascuns;
- modelul obiect COM al instanței TALE (legat din fereastra ei, ca în `referinte/dump_uia_office.py`);
- o pagină Microsoft cu URL citat (`referinte/surse_microsoft.md`).

Ce nu poți obține așa rămâne [NEVERIFICAT] și NU intră în oracol. Nu te uiți la ce face biblioteca ca să alegi ce scrii în
referință. Oracolele pe bibliotecă le rulezi doar DUPĂ ce referința e scrisă, ca să măsori.

## PowerPoint-ul utilizatorului (contractul I6) — cel mai important
PowerPoint are o SINGURĂ instanță pe mașină. Dacă utilizatorul își deschide o prezentare cât rulează instanța ta, ea intră în
procesul tău (pe desktopul ascuns, deci el n-o vede). Iar `Quit()` sau închiderea forțată i-ar închide prezentările.
- **Înainte de FIECARE pornire:** `tasklist /FI "IMAGENAME eq POWERPNT.EXE"`. Dacă rulează deja un POWERPNT, NU pornești și nu-l
  atingi. Aștepți (verifici din 10 în 10 minute, cel mult 1 oră), apoi te oprești cu `NU_SE_POATE` pe ce a rămas.
- Pornești doar `POWERPNT /B` pe desktopul ascuns `LHRefOffice`, ca `referinte/dump_uia_office.py`, prin
  `python C:/00/AI_0/tools/hidden_desktop.py run --desktop LHRefOffice --timeout 900 -- python …`. Legătura COM o iei din
  fereastra instanței tale (`AccessibleObjectFromWindow`), NICIODATĂ prin `Dispatch`, `GetObject`, `GetActiveObject` sau
  `DispatchEx("PowerPoint.Application")` (s-ar lega de orice instanță). Niciodată `taskkill /IM POWERPNT.EXE`.
- **Sesiuni scurte:** cel mult ~10 minute pe pornire. Închizi după fiecare lot și verifici că procesul a ieșit.
- **Înainte de fiecare închidere:** numeri prezentările din instanța ta (`Presentations`). Dacă e una pe care n-ai deschis-o tu
  (alt nume sau altă cale decât fișierele tale de probă), NU închizi nimic. Lași instanța cum e, scrii asta în `stare_autor.md`
  și raportezi imediat `NU_SE_POATE` cu motivul. Orchestratorul vorbește cu omul.
- Închiderea: ca în `dump_uia_office.py` (document marcat „salvat”, WM_CLOSE; pe acest PC `Quit` n-a ieșit în 60 s). Forțat doar
  după 90 s și doar PID-ul tău, și doar dacă instanța are numai prezentările tale.
- Fișierele de probă (prezentări, imaginea de inserat) stau în %TEMP%, cu nume unice. Le ștergi la final. După salvări, PowerPoint
  le pune în lista Recent a omului (`HKCU\Software\Microsoft\Office\16.0\PowerPoint\User MRU\…\File MRU`, plus „Place MRU”): ștergi
  DOAR intrările care arată spre fișierele tale de probă. După o oprire forțată ștergi doar intrările Resiliency / DocumentRecovery
  ale fișierelor tale.
- Numele de fișiere din Recent, numele de foldere personale și numele de cont NU intră în referință. Le înlocuiești cu „<fișier>”
  sau „<folder>”, ca `dump_uia_office.py` (`redactari`).
- Word și Excel nu-ți trebuie. Pe mașină rulează un WINWORD (pid 28392, -Embedding) care nu e al tău: nu-l atingi.

## Ce ai de acoperit
Lucrezi în ordinea de mai jos. Dacă timpul sau contextul nu ajung, te oprești la o graniță curată.

### 1. Capturi UIA noi din PowerPoint real
Scrii un generator-soră, `referinte/acoperire_powerpoint_r11.py`, după modelul lui `acoperire_excel_r7.py` (aceleași comenzi:
`capturi [--doar=…]`, `scrie`, `scrie_scenarii`, `scenarii [--id=…]`, `verifica`) și folosind ce face deja `dump_uia_office.py` pentru
PowerPoint (pornirea, cadrul 1366×768 la factor 1,0, clicurile la coordonate calculate cu `PointsToScreenPixels` și VERIFICATE
după conținut, ieșirea). Generatorul refuză desktopul vizibil. Cheile noi le pui în `referinte/uia_powerpoint.json`, la `lista.*` /
`dialog.*` / `panou.*` (aceeași formă de nod ca la Excel, cu `rect_css`, `tasta_acces`, `activ`), plus un bloc `acoperire_r11`
(fapte, NEVERIFICAT, rulări). Copia de dinainte o păstrezi în `runde/11/acoperire/` ca `.bak` (nu e livrabil).

a. **P2 · Font Color ▾** (Home › Font): paleta deschisă — grupurile (Automatic, Theme Colors, Standard Colors, Recent Colors dacă
   apare, More Colors…, Eyedropper…), numele fiecărei culori în ordine, cheile de acces; culoarea butonului la pornirea unei
   instanțe proaspete. Dacă se deschide la fel, și paleta din mini-bara de la clic dreapta pe text.
b. **P3 · închiderea:** pe o prezentare modificată, Ctrl+W, File › Close și ✕ din bara de titlu: fereastra („Save your changes…”)
   — titlu, text, butoane, ordine, butonul implicit, focusul; ce rămâne după Cancel / Esc; ce rămâne după Don't Save la Ctrl+W
   (fereastra PowerPoint fără prezentare: titlul, panglica activă sau gri, zona documentului). Ctrl+N: numele noii prezentări și
   ce fereastră devine activă. Ctrl+O: unde ajungi (Backstage › Open e deja capturat; confirmi doar drumul).
c. **P4 · obiectele:**
   - lista Insert › Pictures (rândurile, cu chei de acces);
   - galeria Insert › Shapes (titlurile grupurilor, numele formelor în ordine, cel puțin „Arrow: Right” și steaua cu 5 colțuri);
   - lista New Slide ▾ și lista Layout ▾ (numele tuturor aspectelor, în ordine, cu Two Content), cu R11-1.
d. **P5 · efectele:**
   - caseta Duration din Transitions: valoarea după ce scrii „0,5” + Enter (cum se afișează);
   - Animation Pane cu două animații: rândurile (numele lor), starea Move Up / Move Down cu primul și apoi cu al doilea rând ales;
   - Format Background cu Solid fill ales: controalele care apar (Color ▾, Transparency, Apply to All, Reset Background), paleta
     Color ▾ (dacă e alta decât cea de la a.), starea butoanelor.
e. Dacă mai încape: R11-11 / R11-12 (cursorul strâns într-un cuvânt + Bold: tot cuvântul sau nimic; ce arată caseta Font Size la
   mărimi amestecate; ce face fereastra Font la mărimea 0 sau 5000 și Insert Table la 0 sau 100 de coloane), R11-8 (Delete pe o
   casetă goală aleasă ca obiect), Esc din prezentare (pe ce diapozitiv rămâi), câte litere anulează un Ctrl+Z după tastare.

### 2. Scenarii reale în `referinte/scenarii_real/powerpoint-*.json` și `D/scenarii/powerpoint/`
Formatul e cel al scenariilor existente, cu `mod: gest_real|model_obiect`. Rezultatul îl iei rulând scenariul pe instanța TA
(`referinte/ruleaza_real.py`, cu aceleași reguli de pornire ca mai sus). Unde un gest nu se poate trimite fidel, scenariul rămâne cu
`mod_probat: false` sau [NEVERIFICAT]; nu ghicești.

În ordinea priorității:
- **rescrise pe drumul real:**
  - `powerpoint-diapozitiv-nou-buton`: ținta = partea de sus a butonului (sau butonul fără săgeată, după cum o poate exprima
    rulatorul O4);
  - `powerpoint-salvare-ca`: File → Save As → Browse → File name → Enter;
  - `powerpoint-imagine`: Insert → Pictures → This Device… → File name (imaginea ta de probă) → Insert;
- `powerpoint-tragere-forma`: rezultatul real, dacă se poate trimite tragerea fidel;
- **noi:**
  - Font Color pe un titlu ales (o culoare din paletă) → culoarea literelor;
  - aspectul Two Content (New Slide ▾ și Layout);
  - Ctrl+W pe o prezentare modificată → fereastra de la 1.b, cu Cancel;
  - Ctrl+N → numele noii prezentări;
  - o casetă aleasă ca obiect + Ctrl+C, apoi alt diapozitiv + Ctrl+V → forma lipită (număr, loc, text);
  - Shapes → Arrow: Right inserată;
  - Duration 0,5 + Apply To All → durata pe toate diapozitivele;
  - două animații + Move Up → ordinea;
  - Format Background › Solid fill › o culoare › Apply to All → fundalul tuturor diapozitivelor;
- **bonus:** `Alt, H, 1` pe un titlu ales → Bold (P1), dacă tastele se pot trimite fidel pe desktopul ascuns.

### 3. Contractul bibliotecii (`D/api_biblioteca.md`)
Îl completezi doar unde un scenariu nou are nevoie: cheile de stare §5 powerpoint pe care le citește scenariul (de exemplu culoarea
literelor, durata tranziției, fundalul). Adaugi în lista felurilor de ținte din §3 felul `margine_forma:D/S` (marginea unei casete,
prin care caseta se alege ca obiect). Criticul 11 l-a găsit canonic și necesar (`runde/11/critic.md`, secțiunea `margine_forma`).
Cheile folosite deja de bibliotecă le găsești în `aplicatii/powerpoint.js`, doar citire. `D/suprafete.json` primește suprafețele
noi de la punctul 1, dacă O3/O9 le citesc de acolo.

### 4. Oracolele
Le schimbi DOAR cât trebuie ca să citească referințele și scenariile noi. Dacă le citesc deja din dosar, nu le atingi. Fiecare oracol
atins trebuie să prindă în continuare bancul de mutanți (≥5, aceleași prinderi ca înainte, vezi `runde/1/acoperire/` și
`runde/3/acoperire_word.md`), plus cel puțin 1 mutant nou pe o suprafață nouă.

## Dovezi și reînghețare
- **Înainte:** `runde/11/masurare_final_r11.json` (pasul 7 al rundei 11: O1 61, O2 13392, O3 21586, O4 33, O5 82, O6 0, O7 343,
  O8 102, O9 27, porți 41 doar pe cum_fac).
- **După:** `python D/oracole/masoara.py --runda 11 --paralel 3 --compara D/runde/11/masurare_final_r11.json`, pornit după ultima ta
  scriere în `referinte/`, `scenarii/`, `oracole/`, `api_biblioteca.md` și `suprafete.json`. Cât rulează (~35-75 de minute) nu rulezi
  nimic altceva greu și niciun browser. Noul `runde/11/masurare.json` devine pornirea rundei 12.
  - **Dacă O6 iese NECONCLUDENT pe timp** (limita e 1800 s): copiezi `masurare.json` în `masurare_acoperire.json`; reiei imediat,
    singur: `--runda 11 --doar O6 --compara D/runde/11/masurare_final_r11.json`; copiezi rezultatul în `masurare_acoperire_o6.json`;
    pui înapoi `masurare_acoperire.json` ca `masurare.json`; scrii asta în raport.
- Oracolele rulate direct le pornești cu `LH_IESIRE` spre `D/runde/11/acoperire/`; nu scrii peste `D/oracole/*.json` urmărite în git.
- Raportezi numerele O1-O9 + porți, înainte → după, pe aceeași bibliotecă. Creșterea e permisă, de asta există runda. Explici fiecare
  unitate nouă: ce scenariu sau ce suprafață o produce.
- La final: `python D/ingheata.py --acoperire "B-powerpoint dupa runda 11: capturi UIA reale (Font Color, Save your changes, Pictures, Shapes, aspecte, Duration, Animation Pane, Format Background) + scenarii noi si rescrise"`,
  apoi `python D/ingheata.py --verifica` = 0.
- În `D/de_verificat.md` bifezi `[x]` rândurile R11-* lămurite, cu calea dovezii. Pe celelalte le lași.

## Reguli
- Nimic pe ecranul omului. PowerPoint doar pe desktopul ascuns, cu regulile de mai sus.
- Probele în browser: doar 127.0.0.1/localhost, headless, cu ruta care abandonează restul. Nimic spre servere vii.
- Fără căi cu numele utilizatorului Windows (`C:/Users/...`) în NICIUN fișier scris; poarta `date_personale` le numără. Scrii „%TEMP%”.
- Căi absolute, fără `cd`. Fără git commit/add/push; le face orchestratorul.
- Pune `timeout` la fiecare comandă lungă. Un critic s-a blocat azi-noapte 6 ore fără niciun semn.
- Ieșirile mari de Bash le pui în fișier și aduci în context doar coada. `uia_powerpoint.json` îl citești doar prin Python, pe chei.
- La ~200k de context te oprești la o graniță curată, scrii `runde/11/acoperire/stare_autor.md` și raportezi „PREDARE”. Ordinea de
  la punctul 1 e și ordinea importanței: a-d deblochează GRAV-uri, e doar le întărește. După fiecare lot terminat actualizezi
  `stare_autor.md`.

## Ieșirea
Scrii `D/runde/11/acoperire_powerpoint.md`, în ordinea asta:
1. numerele întâi: tabel înainte → după, mutanți înainte → după;
2. fișierele schimbate, fiecare înghețat;
3. ce s-a capturat, cu calea și cum s-a obținut;
4. rândurile din `de_verificat.md` închise;
5. ce a rămas [NEVERIFICAT];
6. ce vede acum oracolul din P1-P5;
7. confirmarea că instanțele PowerPoint ale tale au ieșit, că n-a intrat nicio prezentare străină și că intrările Recent ale
   fișierelor tale sunt șterse.

Ultima linie, exact una din: `ACOPERIRE_GATA`, `ACOPERIRE_PARTIALA`, `NU_SE_POATE` sau `PREDARE`.
