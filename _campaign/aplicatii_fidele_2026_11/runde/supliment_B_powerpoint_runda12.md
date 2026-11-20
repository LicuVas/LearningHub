# Supliment la promptul rundei 12 (valul B-powerpoint, runda a 2-a) — scris de orchestrator, 20.11.2026

Se citește DUPĂ `runde/12/prompt.md` și are întâietate acolo unde îl completează. La reguli nu-l contrazice.

## Unde suntem
- **Runda 11 a pus PowerPoint în bibliotecă:** `aplicatii/powerpoint.js`, `date/powerpoint.json` generat de `aplicatii/_unelte/genereaza_powerpoint.py`, profilul `powerpoint365`. Criticul rece (`runde/11/critic.md`, unghiul stare_finala_erori) a găsit **5 GRAV (P1-P5)** și o listă de MINOR.
- **Runda `acoperire` de după ea** (`runde/11/acoperire_powerpoint.md`, commit 50ab8b24) a capturat din PowerPoint real ce lipsea pentru P2-P5:
  - 11 suprafețe noi în `D/referinte/uia_powerpoint.json`:
    - `lista.FontColorPicker`, `lista.FontColorPicker_minibara`;
    - `dialog.save_your_changes_to_this_file`;
    - `lista.FlyoutAnchorInsertPictures`, `lista.ShapesInsertGallery`, `lista.TableInsertGallery`, `lista.SlideNewGallery`, `lista.SlideLayoutGallery`;
    - `panou.AnimationCustom#doua_animatii`, `panou.LaunchFormatBackground#Solid fill`, `lista.FormatBackground_Color`.
  - Faptele lor sunt în cheia `acoperire_r11.fapte`.
  - Scenariile: 10 noi și 3 rescrise (`D/scenarii/powerpoint/` + `D/referinte/scenarii_real/`).
  - `api_biblioteca.md`: felul de țintă `margine_forma` (§3) și cheile noi PowerPoint din §5: `prezentare_activa`, `prezentari_deschise`, `dialog`, `culoare_text`, `durata_tranzitie`, `ordine_animatii`, `fundal_diapozitive`, `forme_diapozitiv`, `pozitii_forme`.
- **Biblioteca e comisă local** pe `fidelitate-aplicatii` și nepublicată, deci `git restore` merge.
- **Word (8 GRAV) și Excel (3 GRAV) rămân deschise**, dar nu în runda asta. Codul comun îl atingi doar cât cere PowerPoint, iar Word și Excel nu au voie să se strice.

## Ținta rundei 12 = cele 5 GRAV din `runde/11/critic.md`, în ordinea asta (paguba pentru elev întâi)
Fiecare GRAV se închide doar cu ce spune referința: `uia_powerpoint.json` (citit prin Python, pe chei), `scenarii_real/powerpoint-*.json` și `surse_microsoft.md`. Ce lipsește din referință NU inventezi: scrii [presupus] în `de_verificat.md` (de la **R12-1**) sau dai mesajul central standard.

1. **P1 — tastele de acces (KeyTips).** Azi literele lor intră ÎN TEXT („Alt, H, 1” face titlul „Bh1”).
   - `date/powerpoint.json` are deja șirul fiecărei comenzi în cheia `ta`, de 72 de ori „Alt, H…”.
   - Faci ca la Word și Excel. Modelul: `word.js` în jur de 1990-2070 (`ktArata`, `prefix_tasta_acces`, `arata_taste_acces`) și `excel.js` în jur de 3280-3380. În `aplicatii.js:503` `NAVIGARE_TA` scutește aceste acțiuni la asistent.
     - `Alt` arată literele filelor;
     - litera deschide fila și arată literele comenzilor;
     - literele următoare rulează comanda;
     - `Esc` urcă un nivel.
   - Cât literele sunt pe ecran, nicio tastă nu ajunge în casetă sau în diapozitiv.
   - Câte UN eveniment `tasta_acces` pe tastă (api §4, rândurile ~160-170), cu `actiune` `arata_taste_acces` / `prefix_tasta_acces` pe tastele care doar navighează. Asistentul (§6.3) nu le numără ca greșeli.
   - Gesturile de probat: `Alt, H, 1` = Bold, `Alt, H, F, S` = Font Size, `Alt, H, I` = New Slide, `Alt, A, C` = Animation Pane.
   - Pe PowerPoint real bonusul `Alt, H, 1` n-a fost rulat. Șirurile din dump sunt referința, deci rândul de verificare îl scrii doar ca [presupus] pentru ordinea de afișare a literelor.
2. **P3 — închiderea și fișierele** (m1-l02, m1-l03, m2-l08).
   - **„Save your changes to this file?”** (`dialog.save_your_changes_to_this_file`, scenariul `powerpoint-ctrl-w-modificat`):
     - Pe o prezentare modificată, `Ctrl+W`, File › Close și ✕ din bara de titlu deschid fereastra.
     - Fereastra are titlul gol, caseta File name cu focusul și butoanele **More options…, Save, Don't Save, Cancel**, în ordinea asta.
     - Cancel și Esc lasă prezentarea cum era. Don't Save închide prezentarea: fereastra „PowerPoint”, fără prezentare, cu comenzile gri, adică `prezentare_activa: null` și `prezentari_deschise: 0`. Save salvează.
     - Pe o prezentare NEmodificată, și ce se întâmplă cu ✕ după Don't Save când e singura prezentare (aplicația se închide de tot), urmezi referința dacă o are. Altfel [presupus] + R12.
   - **`Ctrl+N`** → „Presentation2”, două prezentări deschise (scenariul `powerpoint-ctrl-n`).
   - **`Ctrl+O`** → File › Open (`backstage.Open`).
3. **P2 — Font Color** (m1-l06, m2-l08, m2-l09 și jocul `prezentari-vi`).
   - Butonul are culoarea sesiunii, „Font Color Red”.
   - ▾ deschide paleta din `lista.FontColorPicker`: Theme Colors 10×6, Standard Colors 10, More Colors…, Eyedropper, fără „Automatic”. Pe mini-bară se deschide `lista.FontColorPicker_minibara`.
   - Culoarea se aplică textului ales (scenariul `powerpoint-font-color-titlu`: Red → `culoare_text` „#FF0000”).
   - Ecranul arată culoarea, iar `Ctrl+Z` o anulează.
   - `culoare` NU intră în `formatare_text` (api §5).
   - Valorile #RRGGBB ale culorilor de temă le iei doar din referință sau din surse. Ce nu e acolo se notează [presupus].
4. **P4 — obiectele de pe diapozitiv** (m1-l05, m2-l09, m2-l10).
   - **Layout și New Slide ▾** din `lista.SlideLayoutGallery` / `lista.SlideNewGallery`. Lista include **Two Content**, cu 3 forme (scenariile `two-content-new-slide` și `two-content-layout`). Azi lista are 3 rânduri scrise în cod.
   - **Insert › Pictures ▾** (`lista.FlyoutAnchorInsertPictures`: This Device…, Stock Images…, Online Pictures…).
     - **This Device…** deschide fereastra deja capturată `dialog.PictureInsertFromFilePowerPoint`.
     - Numele + Enter (= Insert) pune imaginea pe diapozitiv. Scenariul `powerpoint-imagine`, azi neexecutabil, trebuie să treacă.
   - **Insert › Shapes ▾** (`lista.ShapesInsertGallery`, 195 de rânduri, cu „Arrow: Right” și „Star: 5 Points”).
     - Forma aleasă se pune cu un clic pe diapozitiv, la mărimea implicită (`powerpoint-sageata-dreapta`, ținta `diapozitiv`). `forme_diapozitiv` o arată cu `forma: "Arrow: Right"`.
   - **Insert › Table ▾** din `lista.TableInsertGallery`. Asta închide și MINOR-ul „Insert Table...” scris de mână.
   - **Ctrl+C / Ctrl+V pe o casetă aleasă ca obiect** (`powerpoint-ctrl-c-v-caseta`): pe celălalt diapozitiv apare o **casetă de text** (`fel: caseta_text`, nu substituent), în același loc (`pozitii_forme`, [120, 284, 720, 130] pt). Azi Ctrl+C tace, ceea ce încalcă R12.
5. **P5 — detaliile efectelor** (m1-l06, m1-l07, m2-l09, m2-l10).
   - **Duration** (`TransitionDuration`) e activ:
     - Fade din galerie pune 0,7 s, iar Apply To All copiază durata pe toate diapozitivele (`powerpoint-durata-aplica-la-toate`, `durata_tranzitie`).
     - Tastarea „0,5” + Enter o accepți (spinnerul e activ în referință), dar efectul ei rămâne [presupus], R11-14.
   - **Animation Pane** (`panou.AnimationCustom#doua_animatii`, scenariul `powerpoint-animatii-move-up`):
     - Rândurile se pot alege, deci scoți `aria-hidden` și le faci ținte.
     - Cu primul rând ales, Move Up e gri și Move Down e activ.
     - Cu al doilea rând ales, Move Up schimbă ordinea în [2, 1] (`ordine_animatii`).
   - **Format Background** (`panou.LaunchFormatBackground#Solid fill`, `lista.FormatBackground_Color`, care ARE „Automatic”):
     - Solid fill → Color ▾ → Light Blue → Apply to All dă `fundal_diapozitive` solid #00B0F0 pe toate diapozitivele (`powerpoint-fundal-aplica-la-toate`).
     - Reset Background e gri.
6. **MINOR din critic.md §6**, doar după P1-P5:
   - Pune `.lh-ap-strat-backstage` (z-index) sub `.lh-ap-powerpoint`, ca Word și Excel să rămână cum erau.
   - `modificat` devine `true` după un Ctrl+Z sau Ctrl+Y făcut după salvare.
   - Cu 0 diapozitive, `diapozitiv_activ` e `null`, nu 1.
   - Fereastra Font aplică Font style și Underline style, iar Paragraph aplică Alignment, dacă referința are câmpurile. Altfel le lași cum sunt și le notezi.
   - Zonele de atins sunt ≥ 32 px la 360 px. Asta privește lansatorul Font de 21×21 și benzile `margine_forma` de 6 px: pe atingere, zona se lărgește fără să schimbe ce se vede.
   - `[FARA_REFERINTA]` din critic §5 NU se repară: n-au referință.

**Ținta numerică:**
- **O3 trebuie să scadă** cu cât din cele +3490 de unități ale suprafețelor noi desenezi din date (generatorul le citește din `uia_powerpoint.json`, fără etichete scrise de mână).
- **O4 trebuie să scadă.** Din 48 rămâne cel mult `tragere-forma` (fără rezultat real) și ce explici în `diferente.md`, scenariu cu scenariu.

## Ce citești întâi
- `D/contract.md`, apoi `D/api_biblioteca.md`: §3 (cu `margine_forma`), §4 (`tasta_acces`), §5 powerpoint (cheile noi), §6.3, §7.1.
- `runde/11/critic.md` (P1-P5, MINOR) și `runde/11/acoperire_powerpoint.md`.
- `uia_powerpoint.json › acoperire_r11.fapte`, prin Python.
- Cele 13 scenarii noi și rescrise, plus perechile lor reale.
- Codul, cu Grep înainte de Read:
  - `powerpoint.js` (1190 de rânduri);
  - `genereaza_powerpoint.py`;
  - ca model, pe bucăți: `word.js` (tastele de acces) și `excel.js` (tastele de acces; `CellFillColorPicker` în jur de 2446, pentru felul în care o paletă din date aplică o culoare).

## Măsurarea
- **Pasul 1 e deja făcut.** Pornirea ta e `runde/12/masurare_pornire.json`, adică măsurarea rundei `acoperire`, din 20.11 07:03-07:41, singură pe mașină:
  - O1 61, O2 13392, O3 25076, O4 48, O5 82, O6 0, O7 341, O8 102, O9 27;
  - porți 41, toate pe cum_fac; lacăt ok.
  NU rulezi o măsurare de pornire. Scrii sub `aplicatii/` de la început.
- **Între pași** rulezi parțial: `--doar O3,O4,O5,O8,O9`.
- **Pasul 7:** `python D/oracole/masoara.py --runda 12 --paralel 3 --compara D/runde/12/masurare_pornire.json`.
  - Îl pornești DUPĂ ultima ta scriere sub `aplicatii/`, SINGUR pe mașină. Cât rulează, nicio probă și niciun browser în paralel.
  - **Dacă O6 iese NECONCLUDENT pe timp:**
    1. copiezi `masurare.json` în `masurare_pas7.json`;
    2. reiei imediat, singur, `--runda 12 --doar O6 --compara D/runde/12/masurare_pornire.json`;
    3. copiezi rezultatul în `masurare_o6.json`;
    4. pui înapoi `masurare_pas7.json` ca `masurare.json`;
    5. scrii în raport.
  - Orice oracol sau poartă care crește → `git restore` pe fișierele tale.
- **Proba ta:** `runde/12/proba_grav.py`, cu gesturi reale pe poligon pentru P1-P5 și MINOR-urile reparate, înainte și după, ieșirile în json.
  - Probele criticului din `runde/11/critic_probe/v2/` îți pot da gesturile. NU le rulezi pe loc, fiindcă scriu peste ieșirile comise: copiezi ce-ți trebuie.
- **Regresul, la 0 picate:**
  - **PowerPoint:** `runde/11/proba_powerpoint.py`.
  - **Word:** `runde/5/proba_grav.py`, `runde/4/proba_grav.py`, `runde/4/proba_telefon.py`, `runde/3/proba_grav.py`, `runde/2/proba_grav.py`.
  - **Excel:** `runde/10/proba_grav.py`, `runde/9/proba_grav.py`, `runde/8/proba_grav.py`, `runde/7/proba_grav_cont.py`, `runde/6/proba_excel.py`.
    - La `runde/7/proba_grav.py` (2 rânduri, X6) și `runde/7/proba_grav_cont2.py` (3 rânduri, X8) sunt acceptate doar căderile deja explicate (`runde/8/diferente.md` D14, D18).
- **`oracole/porti.py` NU-l rulezi direct.** La final `python D/ingheata.py --verifica` = 0.
- **În niciun fișier pe care-l scrii nu pui căi cu numele utilizatorului Windows:** scrii „%TEMP%”.

## Office real
- **PowerPoint real NU-l pornești deloc.** Referințele sunt capturate. PowerPoint are o singură instanță, iar utilizatorul îl poate folosi oricând (contractul I6).
  - Ce nu e în referință trece în `de_verificat.md`.
  - Pentru o captură nouă se face o rundă `acoperire`, nu o faci tu.
- Word și Excel real doar invizibil: `DispatchEx`, `Visible=False`, `DisplayAlerts=0`, fișiere unice în %TEMP%. Închizi DOAR PID-ul tău.
- Niciodată `Dispatch` / `GetObject` / `GetActiveObject` / `taskkill /IM`.
- Probele în browser rulează doar pe 127.0.0.1/localhost, headless.

## Ce NU faci (le face orchestratorul)
- **Pasul 8 (criticul) și pasul 9 (commit, merge, push).** Te oprești după pasul 7 și scrii:
  - `runde/12/raport_constructor.md`:
    - numerele înainte → după;
    - FĂCUT / NEFĂCUT / NESIGUR pe P1-P5 și MINOR;
    - lista exactă a fișierelor create sau schimbate;
    - ce scenarii PowerPoint trec acum;
  - `runde/12/gata_pentru_critic.md`: unde e ce și ce gesturi s-au reparat.
  - `runde/12/diferente.md`: fiecare scenariu care încă nu trece și de ce.
- **Fără commit, fără push.**
- **Atingi doar:**
  - `aplicatii/`;
  - notele tale în `runde/12/`;
  - `de_verificat.md`, `de_aprobat.md`.
- **NU atingi:** lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, scenariile și `api_biblioteca.md`.

## Economia contextului (OBLIGATORIU)
- **După fiecare bucată terminată** actualizezi `runde/12/stare_autor.md`: ce e gata, ce urmează, ce fișiere, ce numere. Bucățile:
  1. P1 tastele de acces;
  2. P3 închiderea, Ctrl+N, Ctrl+O;
  3. P2 Font Color;
  4. P4 galeriile Layout / New Slide / Pictures / Shapes / Table, fereastra Insert Picture, Ctrl+C/V pe obiect;
  5. P5 Duration, Animation Pane, Format Background;
  6. MINOR.
- **La ~200k de context** te oprești la prima graniță curată, cu `stare_autor.md` la zi, și raportezi „PREDARE”.
  - La predare NU rulezi pasul 7: rulezi doar `--doar O3,O4,O5,O8,O9`, proba ta și regresul, și scrii numerele în `stare_autor.md`.
  - Pasul 7 complet îl rulează doar constructorul care termină runda.
- **Ieșirile mari de Bash** le scrii în fișier și aduci în context doar coada.
- **`uia_powerpoint.json`, `date/*.json` și `suprafete.json`** le citești doar prin Python, pe chei.
