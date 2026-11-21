# Runda 24 (Word, B-word#2, unghiul aspect) — gata pentru criticul rece

- **Ce s-a schimbat** (diff-urile în dosar; `git diff` arată și munca celorlalte benzi):
  - `aplicatii/word.js` (`runde/24/diff_word.txt`, 6 hunk-uri);
  - `aplicatii/aplicatii.js`: doar `L.asistent`, rândurile cu `doarFocus` (`:662-671` azi);
  - `api_biblioteca.md`: doar §6.3 (fraza „Greșeală = …” + `mutare_focus`).
- **Ce trebuie judecat pe unghiul aspect:**
  - ferestrele Word la 1366×768 față de `referinte/uia_word.json` (Save As, Save As PDF, Open, „Save this file”, „Save your changes…”);
  - fereastra mică 1366×657 la 125% (1093×526 css): micșorarea ferestrei, lista Save as type întoarsă, Tab care aduce în vedere;
  - telefonul (390×844) și tabla (1920×1080);
  - panglica pe Home / Insert / Layout / View.
- **Asistentul** (comun): Tab / `mutare_focus` nu face pasul și nu e greșeală. Drumul `m1-l03:189-192` cu tastele; PowerPoint cu Tab în Save As.
- **MINOR-uri:** Alt+F4 în ferestre; mesajul de eroare la salvarea reușită.
- **Nereparate, cu motiv** (`raport_constructor.md` › NEFĂCUT): O4 `word-clic-pune-cursorul` și `word-imagine-inserare` (hamul / scenariul înghețat); asistentul care bifează Save la refuz.
- **Probele constructorului:** `runde/24/proba_grav.py` (0 picate din 19; la pornire 13), `probe/p24_aspect.py`, `probe/p24_masura.py`, `regres.sh`.

GATA_PENTRU_CRITIC
