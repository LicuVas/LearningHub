# Supliment la promptul rundei 11 (prima rundă a valului B-powerpoint) — scris de orchestrator, 19.11.2026

Se citește DUPĂ `runde/11/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli).

## Unde suntem
- **Valul B-excel s-a oprit** pe LIMITA_VAL după runda 10 (`runde/10/raport.md`). Excel are încă 3 GRAV deschise (`runde/10/critic.md`).
- **Valul B-word s-a oprit** pe LIMITA_VAL după runda 5, cu 8 GRAV deschise (`runde/5/critic.md`).
- Nu le repari în runda asta: **ținta e PowerPoint.**
- Biblioteca `C:/00/Projects/LearningHub_fidel/aplicatii/` (schelet comun + Word + Excel) e COMISĂ local pe `fidelitate-aplicatii` (ultimul commit: commitul care conține acest supliment (`git -C C:/00/Projects/LearningHub_fidel log -1`); nepublicată), deci `git restore` pe fișierele tale funcționează la pasul 7.
- Codul comun (`aplicatii.js`, `panglica.js`, `stare.js`, `aplicatii.css`) îl atingi doar cât cere PowerPoint. Atunci Word și Excel nu au voie să se strice.
- Runda 11 e prima a valului PowerPoint (numerotarea rundelor e globală). Valul are maximum 6 rânduri în `jurnal.jsonl`.

## Ținta rundei 11 = aplicația PowerPoint în bibliotecă
1. **Interfața se GENEREAZĂ din date**, ca la Word și Excel:
   - `aplicatii/_unelte/genereaza_powerpoint.py` (după modelul `genereaza_excel.py`, fără să schimbe ce scriu generatoarele Word și Excel) citește referința înghețată `D/referinte/uia_powerpoint.json` (doar citire, prin Python, pe chei; 41 de suprafețe, ~900 KB, NU întreagă cu Read) și scrie `aplicatii/date/powerpoint.json`;
   - conține: filele, grupurile, comenzile, idMso, tipul de control, ordinea, bara de titlu, Acces rapid (Save, Undo, Redo, From Beginning), bara de stare, File/Backstage, meniurile de clic dreapta și ferestrele din drumurile lecțiilor;
   - nicio etichetă scrisă de mână: ce lipsește din referință rămâne lipsă și se notează.
2. **Grupul „Claude” din Home** vine dintr-un add-in instalat de om (`README_referinte.md`, „Excel și PowerPoint — grupul Claude”). Îl tratezi exact ca la Excel: nu intră în bibliotecă.
3. **Același motor de panglică** (`aplicatii/panglica.js`). PowerPoint aduce doar datele și comportamentul lui (`aplicatii/powerpoint.js`), plus profilul `aplicatii/profiluri/powerpoint365.json` (§2: `"powerpoint": "powerpoint365"`).
4. **Comportamentul:**
   - starea din §5 (`diapozitive`, `formatare_text`, `tema`, `tranzitie_galerie`, `animatie_galerie`, `nume_fisier`, plus `diapozitiv_activ`, `panou`, `selectie_text` din §7.1) și TOATE cheile din `stare_citita` ale scenariilor `D/scenarii/powerpoint/*.json` (17);
   - „ecranul = starea” (§3);
   - evenimentele §4 pe fiecare gest, asistentul §6, `tipMotor` §8.1;
   - comenzile de pe drumurile scenariilor și lecțiilor se simulează; restul dau mesajul central standard cu `data-lh-nesimulat` (§3, R12).
5. **Ce face PowerPoint real decide referința:** `D/referinte/scenarii_real/powerpoint-*.json` (16), `uia_powerpoint.json`, `surse_microsoft.md`.
   - PowerPoint nu-și expune diapozitivul și miniaturile în UI Automation (zona documentului are 12 noduri, `README_referinte.md`). Desenul diapozitivului (aspectul titlului și al conținutului, miniaturile) îl faci simplu, din scenarii și din surse, fără să pretinzi fidelitate de pixel unde referința n-o dă;
   - ce nu poți dovedi trece în `de_verificat.md`, de la **R11-1**.
6. **Poligonul:** `aplicatii/poligon.html?aplicatie=powerpoint` deschide PowerPoint cu un conținut de probă: o prezentare mică dintr-o lecție de clasa a VI-a.
7. **Lecțiile** care folosesc azi simulatorul vechi `lectii/_sim/simppt*.js`: `lectii/vi/m1-l02`, `m1-l03`, `m1-l05`, `m1-l06`, `m1-l07`, `m2-l08`, `m2-l09`, `m2-l10`, plus jocul `jocuri/prezentari-vi`. Le citești doar ca să vezi ce drumuri cer (Design › teme, Transitions, Animations și Animation Pane, Insert › Picture / Table, Format Background, Save As, prezentarea de la început). NU sunt model de fidelitate și NU le atingi: mutarea lor e etapa C.
8. **I1:** la 360-390 px panglica se derulează lateral, nu se taie; zonele de atins ≥ 32 px. **I7:** nicio captură Microsoft.

## Ce citești întâi
- `D/contract.md` · `D/api_biblioteca.md` (§3, §4, §5 powerpoint, §6, §7.1, §8) · `D/oracole/CONVENTIE_ARBORE.md` · `D/referinte/README_referinte.md`;
- `D/scenarii/powerpoint/*.json` (17) + `D/referinte/scenarii_real/powerpoint-*.json` (16);
- apoi codul din `aplicatii/`, cu Grep înainte de Read:
  - `excel.js` (~3400 de rânduri) și `word.js` le citești doar ca model, pe bucăți;
  - `genereaza_excel.py` e modelul generatorului.

## Măsurarea
- **Pasul 1 e deja făcut:** pornirea ta e `runde/11/masurare_pornire.json` (= `runde/10/masurare.json`, pasul 7 al rundei 10, pornit la 19:59:21, singur, după ultima scriere sub `aplicatii/`; O6 luat din reluarea `runde/10/masurare_o6.json`, vezi cheia `nota_orchestrator`): O1 61, O2 13392, O3 21586, O4 50, O5 113, O6 0, O7 343, O8 102, O9 34, porți 41, toate pe cum_fac; lacăt ok. NU rulezi o măsurare de pornire și poți scrie sub `aplicatii/` de la început.
- Între pași rulezi parțial: `--doar O3,O4,O5,O8,O9`.
- **Pasul 7:** `python D/oracole/masoara.py --runda 11 --paralel 3 --compara D/runde/11/masurare_pornire.json`.
  - Îl pornești DUPĂ ultima ta scriere sub `aplicatii/`, SINGUR pe mașină. Cât rulează (~75 de minute), NU rulezi nicio probă și niciun browser în paralel: în runda 8, o măsurare cu probe în paralel a dat porți false.
  - **Dacă O6 iese NECONCLUDENT pe timp** (durează ~1770-1800 s, iar limita e 1800 s):
    - copiezi `masurare.json` în `masurare_pas7.json`;
    - reiei imediat, singur, fără nicio scriere între ele: `--runda 11 --doar O6 --compara D/runde/11/masurare_pornire.json`;
    - copiezi rezultatul în `masurare_o6.json`;
    - pui înapoi `masurare_pas7.json` ca `masurare.json`;
    - scrii asta în raport.
  - Orice oracol sau poartă crește → `git restore` pe fișierele tale.
  - În raport: numerele întregi înainte → după, plus partea PowerPoint din detaliile O3/O4/O5/O9 (`runde/11/iesiri/<O#>/`).
- `oracole/porti.py` NU-l rulezi direct: rescrie `oracole/porti.json`, care e reper înghețat. La final `python D/ingheata.py --verifica` = 0.
- **Proba ta:** `runde/11/proba_powerpoint.py`: gesturi reale pe poligon, înainte și după, ieșirile în json.
- **Regresul, la 0 picate:**
  - Word: `runde/5/proba_grav.py`, `runde/4/proba_grav.py`, `runde/4/proba_telefon.py`, `runde/3/proba_grav.py`, `runde/2/proba_grav.py`;
  - Excel: `runde/10/proba_grav.py`, `runde/9/proba_grav.py`, `runde/8/proba_grav.py`, `runde/7/proba_grav_cont.py`, `runde/6/proba_excel.py`. La `runde/7/proba_grav.py` (2 rânduri, X6) și `runde/7/proba_grav_cont2.py` (3 rânduri, X8) sunt acceptate doar căderile deja explicate (`runde/8/diferente.md` D14, D18).
- În NICIUN fișier pe care-l scrii nu pui căi cu numele utilizatorului Windows (`C:/Users/...`): scrii „%TEMP%”.

## Office real
- **PowerPoint real NU-l pornești deloc.** Referințele sunt deja capturate. PowerPoint are o singură instanță, iar `Quit()` ar închide prezentările utilizatorului (contractul I6).
- Dacă îți trebuie Word sau Excel real pentru o comparație: doar invizibil, prin `DispatchEx`, cu `Visible=False`, `DisplayAlerts=0` și fișiere cu nume unice în %TEMP%. Închizi DOAR PID-ul tău.
- Niciodată `Dispatch` / `GetObject` / `GetActiveObject` / `taskkill /IM`.
- Pe mașină poate rula un Excel ascuns al altei console: nu e al tău, nu-l atingi.
- Probele în browser rulează doar pe 127.0.0.1/localhost, headless.

## Ce NU faci (le face orchestratorul)
- Pasul 8 (criticul) și pasul 9 (commit, merge, push, nonce). Te oprești după pasul 7 și scrii:
  - `runde/11/raport_constructor.md`: numerele înainte → după, FĂCUT / NEFĂCUT / NESIGUR, lista exactă a fișierelor create sau schimbate, ce scenarii PowerPoint trec acum;
  - `runde/11/gata_pentru_critic.md`: doar unde e ce, cum se deschide poligonul cu PowerPoint și ce parametri de conținut primește.
- Fără commit, fără push.
- Atingi doar `aplicatii/`, plus notele tale în `runde/11/`, `de_verificat.md`, `de_aprobat.md`. Lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, scenariile și `api_biblioteca.md` NU.

## Economia contextului (OBLIGATORIU)
Toți constructorii de până acum au trecut de 290k. Prima rundă Excel a ajuns la 455k.
- După FIECARE bucată terminată, actualizezi `runde/11/stare_autor.md`: ce e gata, ce urmează, ce fișiere, ce numere, ce măsurătoare rulează. Bucățile:
  1. generatorul + `date/powerpoint.json`;
  2. fereastra: panglica, bara de stare, panoul cu miniaturi, diapozitivul cu casetele de text și tastarea în ele;
  3. diapozitivele: New Slide, Layout, ștergere, mutare, Ctrl+Z;
  4. Design (teme), Transitions, Animations, Animation Pane;
  5. File/Backstage, Save As, „Save your changes”, scenariile.
- La ~200k de context te oprești la prima graniță curată de după, cu `stare_autor.md` la zi, și raportezi „PREDARE”.
  - La predare NU rulezi pasul 7: rulezi doar `--doar O3,O4,O5,O8,O9` + proba ta + regresul și scrii numerele în `stare_autor.md`.
  - Pasul 7 complet îl rulează doar constructorul care termină runda.
  - O bucată terminată și probată valorează mai mult decât trei începute.
- Ieșirile mari de Bash le scrii în fișier și aduci în context doar coada. `uia_powerpoint.json`, `date/*.json` și `suprafete.json` le citești doar prin Python, pe chei.
