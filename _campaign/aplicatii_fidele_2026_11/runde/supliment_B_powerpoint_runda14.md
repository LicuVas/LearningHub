# Supliment la promptul rundei 14 (valul B-powerpoint, runda a 4-a și ULTIMA din val) — scris de orchestrator, 20.11.2026

Se citește DUPĂ `runde/14/prompt.md` și are întâietate acolo unde îl completează. La reguli nu-l contrazice.

## Unde suntem
- **Runda 13** (`runde/13/raport_constructor.md`, criticul `runde/13/critic.md`, unghiul gest_tastatura) a închis TOATE cele 6 GRAV vechi: P3, P4, A1, A2, A3, A4. Toate cele 9 drumuri ale lecțiilor PowerPoint se duc acum la capăt pe poligon.
- **Criticul 13 a găsit 4 GRAV noi, T1-T4**, toate pe tastatură și toate cu referință deja capturată. Nu e nevoie de o rundă `acoperire`.
- **E ultima rundă a valului** (6/6 în `opreste.py`). După criticul 14, valul se oprește oricum. Ce rămâne deschis trebuie lăsat scris clar, cu dovadă, pentru cine reia.
- **Biblioteca e comisă local** pe `fidelitate-aplicatii` și nepublicată, deci `git restore` merge. Pornirea rundei e commit-ul 27b45134.
- **Word (8 GRAV) și Excel (3 GRAV) rămân deschise**, dar nu în runda asta. T1 și T4 ating codul comun (`aplicatii.js`), deci Word și Excel trebuie să rămână la 0 picate în regres. Orice schimbare de eveniment în Word sau Excel o explici scenariu cu scenariu.

## Ținta rundei 14, în ordinea pagubei pentru elev
Fiecare GRAV se închide doar cu ce spune referința: `uia_powerpoint.json` (pe chei, prin Python, inclusiv `tasta_acces` de pe fiecare nod), `scenarii_real/powerpoint-*.json` și `surse_microsoft.md`. Ce lipsește din referință NU inventezi: scrii [presupus] în `de_verificat.md` (de la **R14-1**) sau dai mesajul central standard.

1. **T1 — tastatura în ferestre** (`runde/13/critic.md` §3, T1). Privește Open, Save your changes, Insert Picture, Save As, Font și Paragraph.
   - **Alt + litera subliniată** face ce face butonul sau câmpul cu acea literă în referință: `tasta_acces` de pe nod. Exemple:
     - `dialog.FileOpen`: File name „Alt+n”, Open „Alt+o”;
     - `dialog.save_your_changes_to_this_file`: Save „ALT+S”, Don't Save „ALT+n”;
     - `dialog.FileSaveAs`: Save „Alt+s”, File name „ALT+n”;
     - `dialog.PictureInsertFromFilePowerPoint`: Open „Alt+o”;
     - `dialog.FontDialogPowerPoint`: Size „ALT+S”, Latin text font „ALT+f”;
     - `dialog.PowerPointParagraphDialog`: Alignment „ALT+g”.
     Pe un câmp, litera mută focusul în el. Pe un buton, îl apasă.
   - **Fiecare Alt + literă emite un eveniment** (api §4, „un eveniment pe fiecare gest fizic”). Azi `gestTasta` din `aplicatii.js` (în jur de 240-251) întoarce `null` pentru Alt + literă, deci nu pleacă nimic.
     - Repari în codul comun, cu un fel de gest care nu schimbă nimic din ce emit azi Word și Excel pe gesturile lor existente.
     - Dacă api §4 nu are un nume de fel pentru Alt + literă în fereastră, NU atingi `api_biblioteca.md`. Folosești cel mai apropiat fel existent, îl scrii în `diferente.md` și pui rândul în `de_aprobat.md`.
   - **Tab / Shift+Tab rămân ÎN fereastra modală**, care e o capcană de focus, și trec prin câmpuri și butoane.
     - Ordinea nu e capturată: folosești ordinea nodurilor din referință și o notezi [presupus] + R14.
     - Focusul nu iese niciodată pe bara de titlu a aplicației.
     - Enter apasă butonul implicit, iar Esc închide fereastra.
   - **Fereastra Font** se deschide cu focusul într-un câmp (primul din ordinea de mai sus), nu pe rădăcina aplicației.
   - **Ferestrele lui Word și Excel** folosesc același cod: verifici că nu se strică și, dacă au primit pe drum Alt + literă, o scrii în raport.
2. **T3 — fontul temei pe ecran** (m2-l08).
   - Referința spune că fontul temei e Calibri Light pentru titluri și Calibri pentru corp: `acoperire_r12.fapte.c_font.grupuri[0]` „Calibri Light (Headings)”, „Calibri (Body)”.
   - Azi ecranul desenează `Aptos Display` / `Aptos` (`aplicatii.css:369` și `:371`, din runda 11), în timp ce caseta Font și `stare()` spun Calibri Light / Calibri. Asta încalcă „ecranul = starea” (api §3).
   - Casetele fără font ales se desenează cu Calibri Light (titluri) și Calibri (corp), cu rezervă `Carlito` și apoi `sans-serif` acolo unde Calibri lipsește.
   - Alegerea „Calibri Light (Headings)” pe un titlu care era deja în fontul temei nu schimbă literele de pe ecran.
   - Verifici și miniaturile.
3. **T2 — fila Shape Format din taste** (m1-l06:177).
   - **Fila contextuală Shape Format** are tasta „J D” (`panglica_context.Ctx_ShapeFormat › Group 'Shape Format' tasta_acces "Alt, J D"`) și apare în insignele de după Alt când o formă e aleasă.
   - **Drumurile care trebuie să meargă:**
     - „Alt, J D, S F” deschide Shape Fill;
     - „Alt, J D, S O” deschide Shape Outline;
     - „Alt, J D, S O, W” deschide Weight ▸ (`lista.OutlineColorPicker#Weight › "Alt, J D, S O, W"`).
   - **În listele deschise din taste** apar literele din referință, dacă le are. Cât o listă e deschisă din taste, NICIO literă nu ajunge în formă sau în casetă (azi „Alt, H, S, O, W” scrie „w” în stea).
4. **T4 — Esc în modul tastelor de acces emite `tasta_esc`** (api_biblioteca.md:172).
   - Azi emite `tasta_acces` (`powerpoint.js` în jur de 2228, `I.tastaFaraClic('iesire_taste_acces')`; `aplicatii.js:458`).
   - Repari o singură dată, în codul comun, pentru PowerPoint, Word și Excel (word.js în jur de 2056, excel.js în jur de 3366).
   - Verifici că asistentul (§6.3) nu-l numără greșeală.
   - Dacă un scenariu Word sau Excel aștepta vechiul eveniment, NU atingi scenariul: scrii în `diferente.md`.
5. **Unghiul rundei e `stare_finala_erori`.** Criticul 14 va verifica dacă starea finală după fiecare drum de lecție și după fiecare greșeală tipică a elevului e cea din PowerPoint real. Ca pregătire, repari ce a lăsat criticul 13 în §6-§7 și se poate repara fără referință nouă:
   - **Lista deschisă cu ▾:** cât o listă a panglicii (Font, culori, Shapes…) e deschisă cu mouse-ul, literele tastate NU intră în diapozitiv. Ce fac literele în listă (salt la nume) e [presupus] + R14.
   - **Clicul în textul casetei Font** alege tot textul, cum scrie chiar comentariul de la `powerpoint.js` în jur de 1917-1922. Azi „Ari” dă „CalibAriri Light (Headings)”. Numele tastat + Enter aplică fontul.
   - **Tastarea într-o casetă a panglicii** (Font, File name): evenimentul `tastare` are `dupa` diferit de `inainte` (api §4).
   - **Pe telefon,** tastarea în note emite ținta `zona_note`, nu `diapozitiv`.
   - **Asistentul:** pe drumul `Alt, H, S, F`, „H” cu fila Home deja activă e navigare (`prefix_tasta_acces`), nu greșeală de `fila`.
   - **„Click to add notes”** e scris din memorie (R4). Îl scoți sau îl iei dintr-o referință. Dacă nu există referință, zona goală rămâne goală.
   - **Fereastra Open:** adresa arată „Documente”, ca `SplitButton 'Documente'` din `dialog.FileOpen`.
6. **MINOR rămase din critic 12 / 13**, doar după 1-5 și doar dacă e timp:
   - listele la +3 px;
   - „Pov” tăiat;
   - fereastra „Save your changes” la x = −26 pe 360 px;
   - zonele de atins < 32 px în grilele de 24 px;
   - fila „Fill” ca text.
   `[FARA_REFERINTA]` din critic 13 §6 NU se repară, afară de ce e la punctul 5. De exemplu, tastarea peste o casetă aleasă ca obiect și Ctrl+S pe o prezentare nesalvată rămân pentru o rundă `acoperire`. Le treci în `de_verificat.md` dacă nu sunt deja.

**Ținta numerică:**
- **O4 nu crește.** Din 32, la PowerPoint rămân doar `note`, `stea-ctrl-c-v` și `tragere-forma`, fără rezultat real. La Word și Excel, O4 nu crește din cauza lui T1 / T4.
- **O5 (evenimentele)** poate să se schimbe doar din cauza lui T1 / T4. Fiecare schimbare o explici în `diferente.md`.
- **O3 NU scade în etapa B** și nu are voie să crească. Celelalte oracole și porțile nu cresc.

## Ce citești întâi
- `D/contract.md`, apoi `D/api_biblioteca.md`: §3, §4 (rândurile ~150-180: `tasta_acces`, `tasta_esc`, un eveniment pe gest), §5 powerpoint, §6.3.
- `runde/13/critic.md`: §3 T1-T4, §6, §7.
- Codul, cu Grep înainte de Read:
  - `aplicatii/aplicatii.js` (`gestTasta`, `tastaFaraClic`, ferestrele comune);
  - `powerpoint.js` (2000+ rânduri, pe bucăți);
  - `aplicatii.css` (rândurile 365-375);
  - ca model, ferestrele din `word.js` și `excel.js`, doar unde T1 / T4 le ating.

## Măsurarea
- **Pasul 1 e deja făcut.** Pornirea ta e `runde/14/masurare_pornire.json`, adică pasul 7 al rundei 13, din 20.11 15:21-15:59, singur pe mașină:
  - O1 61, O2 13392, O3 26855, O4 32, O5 82, O6 0, O7 341, O8 102, O9 27;
  - porți 41, toate pe cum_fac; lacăt ok.
  NU rulezi o măsurare de pornire. Scrii sub `aplicatii/` de la început.
- **Între pași** rulezi parțial: `--doar O3,O4,O5,O8,O9`.
- **Pasul 7:** `python D/oracole/masoara.py --runda 14 --paralel 3 --compara D/runde/14/masurare_pornire.json --timeout O6=3600`.
  - Îl pornești DUPĂ ultima ta scriere sub `aplicatii/`, SINGUR pe mașină. Cât rulează, nicio probă și niciun browser în paralel.
  - **Dacă O6 iese NECONCLUDENT pe timp:**
    1. copiezi `masurare.json` în `masurare_pas7.json`;
    2. reiei singur `--runda 14 --doar O6 --timeout O6=3600 --compara D/runde/14/masurare_pornire.json`;
    3. copiezi rezultatul în `masurare_o6.json`;
    4. pui înapoi `masurare_pas7.json` ca `masurare.json`;
    5. scrii în raport.
  - Orice oracol sau poartă care crește din cauza ta → `git restore` pe fișierele tale.
- **Proba ta:** `runde/14/proba_grav.py`, cu gesturi reale pe poligon, mai ales tastatură. Acoperă T1-T4 și punctul 5, înainte și după, ieșirile în json.
  - Gesturile le poți lua din probele criticului 13 (`runde/13/critic_probe/`, de ex. `b2.py`, `b3.py`, `b5.py`, `a2.py`). NU le rulezi pe loc: copiezi ce-ți trebuie.
  - T1 îl probezi în fiecare din cele 6 ferestre PowerPoint și cel puțin într-o fereastră Word (Save As) și una Excel.
- **Regresul, la 0 picate:**
  - **PowerPoint:** `runde/13/proba_grav.py` (48 de verificări), `runde/12/proba_grav.py`, `runde/11/proba_powerpoint.py`. Rulezi copii în %TEMP%: la `runde/12` e acceptată doar căderea deja explicată (zona de note deschisă la pornire, `runde/13/diferente.md` „Pasul 0”).
  - **Word:** `runde/5/proba_grav.py`, `runde/4/proba_grav.py`, `runde/4/proba_telefon.py`, `runde/3/proba_grav.py`, `runde/2/proba_grav.py`.
  - **Excel:** `runde/10/proba_grav.py`, `runde/9/proba_grav.py`, `runde/8/proba_grav.py`, `runde/7/proba_grav_cont.py`, `runde/6/proba_excel.py`.
    - La `runde/7/proba_grav.py` și `runde/7/proba_grav_cont2.py` sunt acceptate doar căderile deja explicate (`runde/8/diferente.md` D14, D18), comparate pe nume.
  - Json-urile noi scrise de probele vechi în `runde/2`-`runde/13` le muți în %TEMP%. Cele urmărite rescrise le pui înapoi cu `git restore`.
- **`oracole/porti.py` NU-l rulezi direct.** La final `python D/ingheata.py --verifica` = 0.
- **În niciun fișier pe care-l scrii nu pui căi cu numele utilizatorului Windows:** scrii „%TEMP%”.

## Office real
- **PowerPoint real NU-l pornești deloc.** Referințele sunt capturate, iar utilizatorul îl poate folosi oricând (contractul I6). Pe mașină a rămas un proces `POWERPNT.EXE` blocat la închidere, al unei runde trecute: NU-l atingi.
- Word și Excel real doar invizibil: `DispatchEx`, `Visible=False`, `DisplayAlerts=0`, fișiere unice în %TEMP%. Închizi DOAR PID-ul tău.
- Niciodată `Dispatch` / `GetObject` / `GetActiveObject` / `taskkill /IM`. WINWORD-ul deja deschis e al omului.
- Probele în browser rulează doar pe 127.0.0.1/localhost, headless.

## Ce NU faci (le face orchestratorul)
- **Pasul 8 (criticul) și pasul 9 (commit, merge, push).** Te oprești după pasul 7 și scrii:
  - `runde/14/raport_constructor.md`:
    - numerele înainte → după;
    - FĂCUT / NEFĂCUT / NESIGUR pe T1-T4, punctul 5 și MINOR;
    - lista exactă a fișierelor create sau schimbate;
    - ce scenarii trec acum;
    - orice schimbare în Word / Excel;
  - `runde/14/gata_pentru_critic.md`: unde e ce și ce gesturi s-au reparat;
  - `runde/14/diferente.md`: fiecare scenariu care încă nu trece și de ce, plus schimbările de evenimente.
- **Fără commit, fără push.**
- **Atingi doar:**
  - `aplicatii/`;
  - notele tale în `runde/14/`;
  - `de_verificat.md`, `de_aprobat.md`.
- **NU atingi:** lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, scenariile și `api_biblioteca.md`.

## Economia contextului (OBLIGATORIU)
- **După fiecare bucată terminată** actualizezi `runde/14/stare_autor.md`: ce e gata, ce urmează, ce fișiere, ce numere. Bucățile:
  1. T1 ferestrele (Alt + literă, Tab, focusul la deschidere);
  2. T3 fontul temei;
  3. T2 Shape Format din taste;
  4. T4 Esc = `tasta_esc`;
  5. punctul 5;
  6. MINOR.
- **La ~200k de context** te oprești la prima graniță curată, cu `stare_autor.md` la zi, și raportezi „PREDARE”.
  - La predare NU rulezi pasul 7: rulezi doar `--doar O3,O4,O5,O8,O9`, proba ta și regresul, și scrii numerele în `stare_autor.md`.
  - Pasul 7 complet îl rulează doar constructorul care termină runda.
- **Ieșirile mari de Bash** le scrii în fișier și aduci în context doar coada.
- **`uia_powerpoint.json`, `date/*.json` și `suprafete.json`** le citești doar prin Python, pe chei.
