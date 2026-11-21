# Runda 28 (Word, B-word#3, unghiul gest_tastatura, ciclul paralel D) — gata pentru criticul rece

- **Ce s-a schimbat** (diff-urile în dosar; `git diff` arată și munca celorlalte benzi):
  - `aplicatii/word.js` (`runde/28/diff_word.txt`, 10 hunk-uri);
  - `aplicatii/aplicatii.js`: doar `L.asistent` și constantele de lângă el (`REFUZ`, `EDITARE_CAMP`, `aceeasiStare`, `inCamp`; azi `:657-726`). În `runde/28/diff_aplicatii_tot.txt` primele 4 hunk-uri sunt ale benzii r30;
  - `api_biblioteca.md`: NEATINS (înghețat); propunerea pentru §6.3 în `runde/28/api_propunere.md`.
- **Ce trebuie judecat pe unghiul gest_tastatura** (Word, drumurile `vii/m1-l03`, `vii/m1-l04`, `jocuri/word-obiecte-vii`):
  - Insert › Pictures ▾ › „This Device...”: cu mouse-ul și cu Alt, N, P, D (referința: `runde/26/acoperire_office/capturi_word_brut.json`); scenariul `scenarii/word/word-imagine-inserare.json`;
  - Ctrl+C / Ctrl+X / Ctrl+V și Home › Paste (spațiul pus de Word: `referinte/scenarii_real/word-copiere-lipire.json`, `word-decupare-lipire.json`), Ctrl+Z după lipire;
  - Ctrl+Backspace, Ctrl+Delete, Ctrl+↑ / ↓ (și cu Shift), Ctrl+Home / End, Page Up / Down (sursa: support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2);
  - restul tastelor din supliment: săgeți, Shift / Ctrl+săgeți, Enter, Tab, Backspace, Delete, Ctrl+Z/Y/C/X/V/A/B/I/U/S, F12, Ctrl+O, Ctrl+N, tastele de acces și Esc în ele, Tab / Alt+literă / Alt+↓ / Enter / Esc în ferestre.
- **Asistentul** (comun, pe 5 aplicații): refuzul nu face pasul (nume interzis, „already exists”); Alt+săgeată fără schimbare de stare nu e greșeală; tastele de editare într-un câmp de text al interfeței nu sunt greșeli (File name, caseta din Start: drumul K2 „Windows, pai, Enter”); tastarea în document, clicul în gol și Alt+↑/← din Explorer rămân greșeli.
- **MINOR-uri:** lista Save as type micșorată pe laptopul la 125 % (1093×526); casetele Font / Font Size față de `referinte/uia_word.json`.
- **Nereparate, cu motiv** (`raport_constructor.md` › NEFĂCUT): Page Up / Down (R28-4, fără real); cele 8 rânduri O4 „fără real”; MINOR-urile 3, 6, 7 din critic 24.
- **Probele constructorului:** `runde/28/proba_grav.py` (0 picate din 36; la pornire 17 cu `LH_R28_INAINTE=1`), `regres.sh` (28 / 24 / 20 / 16 = 0 / 0 / 0 / 0), O4 `word-*` 10 → 8, O9 13 → 13 (aceleași cazuri), sondele `probe/p28_*.py`.

GATA_PENTRU_CRITIC
