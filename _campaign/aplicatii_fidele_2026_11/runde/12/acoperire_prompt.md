# Rundă `acoperire` pe PowerPoint, după runda 12 (valul B-powerpoint) — scris de orchestrator, 20.11.2026

Ești agentul rundei `acoperire`. NU ești autorul bibliotecii. Nu atingi nimic sub `C:/00/Projects/LearningHub_fidel/aplicatii/`, lecțiile, jocurile sau `jocuri/_motor/`. D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`.

## De ce există runda
Criticul rece al rundei 12 (`D/runde/12/critic.md`) a lăsat P3 și P4 DESCHISE și a găsit 4 GRAV noi (A1-A4). Majoritatea golurilor n-au referință, iar contractul interzice suprafețe scrise din memorie:
- **P4 · steaua din m1-l05:188** („clic pe stea → Ctrl+C → miniatura „Planetele” → Ctrl+V”). Ce alege PowerPoint la un clic pe o formă (stea, săgeată) — forma ca obiect sau cursorul în textul ei — nu e capturat (critic 12, [FARA_REFERINTA] „Clicul pe o formă fără text”). În plus, formatul `start` (api §7.1: `diapozitive [{aspect, texte}]`) nu poate pune o formă sau o imagine pe diapozitiv, deci m1-l05, m1-l06 și m2-l09 nu-și pot încărca diapozitivele de pornire.
- **P3 · fișierele (m1-l03:105, :241)**: File › New › Blank Presentation n-are rezultat real. Ctrl+O › Browse deschide fereastra Open a PowerPoint, necapturată (Word o are din acoperirea din 18.11).
- **A4 · comenzi de pe drumul lecțiilor, fără referință**:
  - lista Font ▾ (m2-l08:161, :167: Calibri Light (Headings));
  - Animations › Start ▾ (m1-l07:217, :225: After Previous / With Previous);
  - Shape Fill ▾ și Shape Outline ▾ (m1-l06:172, :177, plus `jocuri/prezentari-vi`);
  - Background Styles ▾ (m1-l06:197, :207);
  - zona de note și View › Notes (m1-l02:179, :187, :216; m2-l09:324, :329);
  - Notes / Slide Sorter / Normal / Slide Show din bara de stare (m1-l02:222, :225).
- **Durata după Fade se contrazice în referință**:
  - `acoperire_r11.fapte › d_efecte › duration_dupa_fade = {valoare_uia:"02,00", com:2.0}`;
  - `scenarii_real/powerpoint-durata-aplica-la-toate.json` dă 0,7.
  Lipsește și durata implicită a altor tranziții.
- **A1 / A2 (numele la hover)**: „sfaturile pe hover” nu sunt capturate (README_referinte.md:148). Lecția m1-l06:143 le promite.

A3 (Format Background tăiat pe fereastra mică) are deja referință și îl repară runda 13.

Contractul (`D/contract.md`): „Lărgirea acoperirii … doar într-o rundă marcată `acoperire`, care are voie să crească numerele, și reînghețată după”. Tu lărgești acoperirea din PowerPoint-ul REAL, nu din bibliotecă și nu din memorie.

**Citește întâi `D/runde/11/acoperire/stare_autor.md` și `D/runde/11/acoperire_powerpoint.md`.** Acolo sunt lecțiile celor doi agenți dinainte:
- cum au pornit PowerPoint pe desktopul ascuns;
- ce gesturi n-au mers (focusul în caseta Duration, alegerea unui rând din Animation Pane) și cum le-au ocolit prin model_obiect;
- cum au curățat lista Recent.

Generatorul lor e `D/referinte/acoperire_powerpoint_r11.py`.

## Regula de aur
Tot ce scrii ca referință sau rezultat așteptat vine dintr-una din trei surse:
- PowerPoint-ul REAL de pe PC, prin UI Automation pe desktopul ascuns;
- modelul obiect COM al instanței TALE (legat din fereastra ei, ca în `referinte/dump_uia_office.py`);
- o pagină Microsoft cu URL citat (`referinte/surse_microsoft.md`).

Ce nu poți obține așa rămâne [NEVERIFICAT] și NU intră în oracol. Nu te uiți la ce face biblioteca ca să alegi ce scrii în referință. Oracolele pe bibliotecă le rulezi doar DUPĂ ce referința e scrisă, ca să măsori.

## PowerPoint-ul utilizatorului (contractul I6) — cel mai important
PowerPoint are o SINGURĂ instanță pe mașină. Dacă utilizatorul își deschide o prezentare cât rulează instanța ta, ea intră în procesul tău (pe desktopul ascuns, deci el n-o vede). Iar `Quit()` sau închiderea forțată i-ar închide prezentările.

**Pornirea:**
- **Înainte de FIECARE pornire:** `tasklist /FI "IMAGENAME eq POWERPNT.EXE"`. Dacă rulează deja un POWERPNT, NU pornești și nu-l atingi. Verifici din nou din 10 în 10 minute, cel mult o oră. Apoi te oprești cu `NU_SE_POATE` pe ce a rămas.
- Pornești doar `POWERPNT /B` pe desktopul ascuns (`LHRefOffice` pentru capturi, `LHScenarii` pentru `ruleaza_real.py`), ca `referinte/dump_uia_office.py`, prin `python C:/00/AI_0/tools/hidden_desktop.py run --desktop <nume> --timeout 900 -- python …`.
- Legătura COM o iei din fereastra instanței tale (`AccessibleObjectFromWindow`). NICIODATĂ prin `Dispatch`, `GetObject`, `GetActiveObject` sau `DispatchEx("PowerPoint.Application")`: s-ar lega de orice instanță.
- Niciodată `taskkill /IM POWERPNT.EXE`.

**Cât ține și cum închizi:**
- **Sesiuni scurte:** cel mult ~10 minute pe pornire. Închizi după fiecare lot și verifici că procesul a ieșit.
- **Înainte de fiecare închidere** numeri prezentările din instanța ta (`Presentations`). Dacă găsești una pe care n-ai deschis-o tu (alt nume sau altă cale decât fișierele tale de probă), NU închizi nimic:
  - lași instanța cum e;
  - scrii asta în `stare_autor.md`;
  - raportezi imediat `NU_SE_POATE`, cu motivul. Orchestratorul vorbește cu omul.
- **Închiderea** se face ca în `dump_uia_office.py`: documentul marcat „salvat”, apoi WM_CLOSE (pe acest PC `Quit` n-a ieșit în 60 s). Închiderea forțată vine abia după 90 s, numai pe PID-ul tău și numai dacă instanța are doar prezentările tale.

**Fișierele și lista Recent:**
- Fișierele de probă (prezentări, imagini, fișierul de deschis cu Ctrl+O) stau în %TEMP%, cu nume unice care încep cu `lh_ppt_r12_`. Le ștergi la final.
- După salvări și deschideri, PowerPoint și fereastra Windows Open le pun în lista Recent a omului (`HKCU\Software\Microsoft\Office\16.0\PowerPoint\User MRU\…\File MRU`, „Place MRU”, `ComDlg32\OpenSavePidlMRU`, `LastVisitedPidlMRU`). Ștergi DOAR intrările care arată spre fișierele tale de probă.
- După o oprire forțată ștergi doar intrările Resiliency / DocumentRecovery ale fișierelor tale.

**Ce nu intră în referință:**
- Numele de fișiere din Recent, numele de foldere personale și numele de cont. Le înlocuiești cu „<fișier>” sau „<folder>”, ca `dump_uia_office.py` (`redactari`).
- În fereastra Open, folderele și fișierele omului (Documente, Desktop, Recent): capturezi structura ferestrei (titlul, câmpurile, butoanele, tipul fișierului, panoul din stânga cu numele de sistem), dar NU listele cu fișierele lui.
- Lista Font conține fonturile instalate. Numele fonturilor nu sunt date personale, dar dacă vreun nume pare personal (un font făcut de om), îl redactezi.

**Restul:**
- Clipboard-ul omului îl salvezi înainte de orice Ctrl+C și îl pui la loc după.
- Word și Excel nu-ți trebuie. Pe mașină rulează un WINWORD (pid 28392) care nu e al tău: nu-l atingi.

## Ce ai de acoperit
Lucrezi în ordinea de mai jos. Dacă timpul sau contextul nu ajung, te oprești la o graniță curată.

### 1. Capturi UIA și fapte COM din PowerPoint real
Scrii generatorul-soră `referinte/acoperire_powerpoint_r12.py`, după modelul lui `acoperire_powerpoint_r11.py`, cu aceleași comenzi:
- `capturi [--doar=…]`, `scrie`, `scrie_scenarii`, `scenarii [--id=…]`, `verifica`;
- cheile noi merg în `referinte/uia_powerpoint.json`, la `lista.*` / `dialog.*` / `panou.*`, cu forma nodurilor de până acum;
- adaugi un bloc `acoperire_r12` (fapte, NEVERIFICAT, rulări);
- copia de dinainte o păstrezi în `runde/12/acoperire/` ca `.bak` (nu e livrabil).

a. **P4 · clicul pe o formă.** Pe un diapozitiv cu o stea (Star: 5 Points), o săgeată (Arrow: Right), un dreptunghi și o casetă de text, toate puse prin COM:
   - Un clic real în mijlocul fiecăreia. Notezi ce e ales: `ActiveWindow.Selection.Type`, adică forma ca obiect sau cursorul în text, și dacă se vede chenarul.
   - Apoi Ctrl+C, clic pe miniatura diapozitivului 2, Ctrl+V. Notezi ce s-a lipit (`fel`, `forma`, poziția).
   - Dacă clicul nu se poate trimite fidel pe desktopul ascuns, încerci și clicul pe chenar. Altfel rămâne [NEVERIFICAT], cu motivul.
b. **P3 · fișierele:**
   - File › New: lista cu „Blank Presentation” (rândurile, cu chei de acces, dacă `backstage.New` nu le are deja) și ce rămâne după clic: numele noii prezentări, câte sunt deschise, fereastra activă.
   - Ctrl+O › Browse: fereastra Open (`dialog.FileOpen` sau cum o numește dump-ul), cu titlul, caseta File name, tipul fișierului („All PowerPoint Presentations” sau ce scrie), butoanele Open ▾ / Cancel, focusul.
   - Deschiderea fișierului tău de probă cu nume + Enter: numele prezentării active, bara de titlu.
c. **A4 · listele și panourile de pe drumul lecțiilor:**
   - **Home › Font ▾:** grupurile (Theme Fonts cu „Calibri Light (Headings)” și „Calibri (Body)”, Recently Used Fonts, All Fonts), primele rânduri din fiecare și câte sunt în total. Din All Fonts păstrezi doar numele.
   - **Animations › Start ▾:** rândurile (On Click / With Previous / After Previous) și ce citește COM după fiecare (`Timing.TriggerType`).
   - **Shape Format › Shape Fill ▾ și Shape Outline ▾** (cu o formă aleasă), și varianta din Home › Drawing dacă e alta: grupurile, culorile, No Fill / No Outline, More Fill Colors…, Picture…, Gradient ▸, Texture ▸, Weight ▸, Dashes ▸, Arrows ▸.
   - **Design › Variants › More › Background Styles ▸:** stilurile, numele lor, Format Background…, Reset Slide Background. Ce dă COM după un stil (`Background.Fill`).
   - **Zona de note:** View › Notes și butonul Notes din bara de stare.
     - Ce apare în UIA (panoul, textul de îndemn dacă e expus).
     - Tastarea în note: COM `NotesPage.Shapes.Placeholders(2).TextFrame.TextRange.Text`.
     - Dacă tastarea reală nu ajunge în note, notezi asta.
   - **Bara de stare: Normal / Slide Sorter / Reading View / Slide Show.** Ce se schimbă (COM `ActiveWindow.ViewType`, UIA-ul ferestrei în Slide Sorter) și drumul înapoi.
d. **Durata tranzițiilor:**
   - Imediat după clic pe Fade, ce scrie caseta Duration: UIA `Value`, față de COM `SlideShowTransition.Duration`.
   - Același lucru după Push și după Wipe.
   - Lămurești contradicția „02,00” / 0,7, cu dovada.
e. **Dacă mai încape:**
   - sfaturile la hover (ToolTip în UIA) pe o culoare din Font Color ▾ și pe o formă din Shapes ▾, dacă mouse-ul se poate muta pe desktopul ascuns;
   - unde pune PowerPoint imaginea pe Two Content cu caseta din dreapta goală (m2-l09);
   - Enter în caseta File name din „Save your changes” (ce buton apasă).

### 2. Scenarii reale în `referinte/scenarii_real/powerpoint-*.json` și `D/scenarii/powerpoint/`
Formatul e cel al scenariilor existente, cu `mod: gest_real|model_obiect`. Rezultatul îl iei rulând scenariul pe instanța TA (`referinte/ruleaza_real.py`, cu aceleași reguli de pornire ca mai sus). Unde un gest nu se poate trimite fidel, scenariul rămâne cu `mod_probat: false` sau [NEVERIFICAT]; nu ghicești.

**Noi, în ordinea priorității:**
1. `powerpoint-stea-ctrl-c-v`: steaua pe diapozitivul 1 (din `start`, vezi §3), clic pe ea, Ctrl+C, miniatura 2, Ctrl+V → `forme_diapozitiv`;
2. `powerpoint-blank-presentation`: File › New › Blank Presentation → `prezentare_activa`, `prezentari_deschise`;
3. `powerpoint-ctrl-o-browse`: Ctrl+O › Browse › nume + Enter → `prezentare_activa`;
4. `powerpoint-font-titlu`: titlul ales, Font ▾ › Calibri Light (Headings) → fontul literelor;
5. `powerpoint-animatie-start`: o animație, Start ▾ › After Previous → pornirea animației;
6. `powerpoint-shape-fill`: o formă aleasă, Shape Fill ▾ › o culoare → umplerea formei;
7. `powerpoint-background-styles`: un stil din Background Styles → fundalul;
8. `powerpoint-note`: textul tastat în note → notele diapozitivului;
9. `powerpoint-slide-sorter`: Slide Sorter din bara de stare, apoi Normal → vederea;
10. `powerpoint-durata-fade`: Fade → durata.

**Bonus:** `powerpoint-tragere-forma` (rezultatul real, dacă tragerea se poate trimite fidel).

### 3. Contractul bibliotecii (`D/api_biblioteca.md`)
Îl completezi doar unde un scenariu nou are nevoie.
- **§5 powerpoint:** cheile de stare pe care le citesc scenariile noi, de exemplu:
  - fontul literelor (ca `culoare_text`, fără să intre în `formatare_text`);
  - pornirea animațiilor;
  - umplerea formelor (sau un câmp nou în `forme_diapozitiv`);
  - notele diapozitivelor;
  - vederea (`normala|sortare|citire|expunere`).
  Fiecare cu sensul exact, ca la cheile adăugate în acoperirea trecută.
- **§7.1 `start` powerpoint:** formele și imaginile de pe diapozitivele de pornire, în aceeași formă ca `forme_diapozitiv` / `pozitii_forme`, ca lecțiile m1-l05, m1-l06 și m2-l09 să-și poată încărca diapozitivele. Doar ce poți pune și citi pe PowerPoint real prin COM: fel, numele formei din galerie, text, poziție, eventual umplere.
- Cheile folosite deja de bibliotecă le găsești în `aplicatii/powerpoint.js`, doar citire.
- `D/suprafete.json` primește suprafețele noi de la §1, dacă O3/O9 le citesc de acolo.

### 4. Oracolele
Le schimbi DOAR cât trebuie ca să citească referințele și scenariile noi. Dacă le citesc deja din dosar, nu le atingi.

Fiecare oracol atins trebuie să prindă în continuare bancul de mutanți: cel puțin 5, cu aceleași prinderi ca înainte (vezi `runde/1/acoperire/` și `runde/3/acoperire_word.md`), plus cel puțin 1 mutant nou pe o suprafață nouă.

## Dovezi și reînghețare
**Măsurătoarea:**
- **Înainte:** `runde/12/masurare_final_r12.json`, adică pasul 7 al rundei 12, cu O6 din reluare: O1 61, O2 13392, O3 25076, O4 30, O5 82, O6 0, O7 341, O8 102, O9 27, porți 41, doar pe cum_fac.
- **După:** `python D/oracole/masoara.py --runda 12 --paralel 3 --compara D/runde/12/masurare_final_r12.json`.
  - O pornești după ultima ta scriere în `referinte/`, `scenarii/`, `oracole/`, `api_biblioteca.md` și `suprafete.json`.
  - Cât rulează (azi 45-75 de minute, mașina e lentă), nu rulezi nimic altceva greu și niciun browser.
  - Noul `runde/12/masurare.json` devine pornirea rundei 13.
- **Dacă O6 iese NECONCLUDENT pe timp:**
  1. copiezi `masurare.json` în `masurare_acoperire.json`;
  2. reiei imediat, singur: `--runda 12 --doar O6 --timeout O6=3600 --compara D/runde/12/masurare_final_r12.json`;
  3. copiezi rezultatul în `masurare_acoperire_o6.json`;
  4. pui înapoi `masurare_acoperire.json` ca `masurare.json`;
  5. scrii asta în raport.
- Oracolele rulate direct le pornești cu `LH_IESIRE` spre `D/runde/12/acoperire/`. Nu scrii peste `D/oracole/*.json` urmărite în git.

**Raportarea și reînghețarea:**
- Raportezi numerele O1-O9 + porți, înainte → după, pe aceeași bibliotecă. Creșterea e permisă, de asta există runda. Explici fiecare unitate nouă: ce scenariu sau ce suprafață o produce.
- La final rulezi `python D/ingheata.py --acoperire "B-powerpoint dupa runda 12: clicul pe forma + Ctrl+C/V, Blank Presentation, Open, lista Font, Start, Shape Fill/Outline, Background Styles, note, Slide Sorter, durata tranzitiilor + start cu forme"`, apoi `python D/ingheata.py --verifica` = 0.
- În `D/de_verificat.md` bifezi `[x]` rândurile R11-* / R12-* lămurite, cu calea dovezii. Pe celelalte le lași.

## Reguli
- Nimic pe ecranul omului. PowerPoint doar pe desktopul ascuns, cu regulile de mai sus.
- Probele în browser: doar 127.0.0.1/localhost, headless, cu ruta care abandonează restul. Nimic spre servere vii.
- Fără căi cu numele utilizatorului Windows (`C:/Users/...`) în NICIUN fișier scris; poarta `date_personale` le numără. Scrii „%TEMP%”.
- Căi absolute, fără `cd`. Fără git commit/add/push; le face orchestratorul.
- Pune `timeout` la fiecare comandă lungă.
- Ieșirile mari de Bash le pui în fișier și aduci în context doar coada. `uia_powerpoint.json` îl citești doar prin Python, pe chei.
- La ~200k de context te oprești la o graniță curată, scrii `runde/12/acoperire/stare_autor.md` și raportezi „PREDARE”.
  - Ordinea de la §1 și §2 e și ordinea importanței: a-c deblochează GRAV-uri, d lămurește o contradicție, e doar întărește.
  - După fiecare lot terminat actualizezi `stare_autor.md`.

## Ieșirea
Scrii `D/runde/12/acoperire_powerpoint.md`, în ordinea asta:
1. numerele întâi: tabel înainte → după, mutanți înainte → după;
2. fișierele schimbate, fiecare înghețat;
3. ce s-a capturat, cu calea și cum s-a obținut;
4. rândurile din `de_verificat.md` închise;
5. ce a rămas [NEVERIFICAT];
6. ce vede acum oracolul din P3, P4, A1, A2 și A4;
7. confirmarea:
   - instanțele PowerPoint ale tale au ieșit;
   - n-a intrat nicio prezentare străină;
   - intrările Recent ale fișierelor tale sunt șterse;
   - clipboard-ul e pus la loc.

Ultima linie, exact una din: `ACOPERIRE_GATA`, `ACOPERIRE_PARTIALA`, `NU_SE_POATE` sau `PREDARE`.
