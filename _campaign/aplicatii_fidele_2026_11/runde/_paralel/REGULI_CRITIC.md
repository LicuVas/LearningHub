# Regulile criticului rece în ciclurile paralele (de la runda 15) — scris de orchestrator, 20.11.2026

D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`. N = runda ta.

## Situația
- Ești criticul rece al UNEI benzi: o aplicație, o rundă. NU vezi conversația orchestratorului sau a constructorului.
- În același worktree lucrează în paralel alte benzi (alte aplicații), deci fișierele altor aplicații se pot schimba sub tine.
  - Judeci aplicația ta.
  - Dacă o schimbare din codul comun (`aplicatii.js`, `panglica.js`, `stare.js`, `aplicatii.css`, `poligon.html`) strică aplicația ta, e o constatare: o scrii, cu fișierul și rândul. Vinovatul îl găsește orchestratorul.
- Ce spune constructorul se judecă, nu se crede: îl verifici cu gesturile tale.

## Cum probezi (obligatoriu)
- **Server și browser:**
  - server static legat de `127.0.0.1`, pe port liber (0), care servește worktree-ul `C:/00/Projects/LearningHub_fidel`; îl oprești la final;
  - Playwright Chromium **headless**, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost;
  - gesturi reale: `page.keyboard`, `page.mouse`, `page.touchscreen`; tastatura care compune prin CDP (`Input.imeSetComposition` / `Input.insertText`);
  - măsurătorile: `getBoundingClientRect`, `getComputedStyle`, `document.activeElement`, capturi `page.screenshot` (headless), comparate cu referința la același cadru (1366×768 css, factor 1,0).
- **Aplicațiile reale:**
  - PowerPoint real NU-l pornești deloc. E un POWERPNT.EXE blocat pe mașină: nu-l atingi.
  - Explorer și Windows reale nu le atingi: nimic pe ecranul utilizatorului.
  - Word sau Excel real, doar ca indiciu și doar dacă nu se poate altfel:
    - instanță nouă, invizibilă, prin `win32com.client.DispatchEx`;
    - `Visible=False`, `DisplayAlerts=0`, fișiere cu nume unice în %TEMP%;
    - închizi DOAR PID-ul tău;
    - NICIODATĂ `Dispatch` / `GetObject` / `GetActiveObject` / `taskkill /IM`;
    - WINWORD-ul deschis pe mașină e al utilizatorului: nu-l atingi.
  - Ce nu poți dovedi din referințele capturate merge la [FARA_REFERINTA], nu la GRAV.
- **Ce nu ai voie:**
  - nimic pe ecranul utilizatorului; nimic spre servere vii;
  - nu modifici nimic sub `aplicatii/`, în lecții, jocuri, referințe, scenarii, oracole;
  - fără git care scrie (`add`, `commit`, `restore`, `checkout`, `stash`, `reset`);
  - nu rulezi `oracole/porti.py` și nici `oracole/masoara.py`. Dacă rulezi un oracol direct, setezi `LH_IESIRE=D/runde/N/critic_probe/iesiri`.
- **Fișierele tale:**
  - scriptele și ieșirile în `D/runde/N/critic_probe/`;
  - nicio cale cu numele utilizatorului Windows (scrii „%TEMP%”); căi absolute, fără `cd`; ieșirile mari pe disc, în context doar coada;
  - `referinte/uia_*.json`, `suprafete.json` și `aplicatii/date/*.json` le citești doar prin Python, pe chei; capturile de ecran doar decupate.
- **Mașina e încărcată** (3-4 benzi în paralel): timeout-uri generoase, fără probe lungi repetate fără motiv.
- **Contextul tău e limitat** (criticii trecuți au ajuns la 300-370k):
  - lucrezi țintit;
  - scrii `critic.md` pe secțiuni pe măsură ce avansezi (A, apoi B, C, D);
  - dacă treci de ~250k, închei secțiunea curentă, scrii ce n-ai apucat și închei fișierul.

## Ce e GRAV (aceeași scară ca în rundele 1-14)
- **GRAV** = elevul nu poate duce la capăt un drum din lecție, sau aplicația se poartă vizibil altfel decât cea reală pe un drum din lecție, cu dovadă din referința înghețată (`referinte/`, `scenarii/`, `surse_microsoft.md`), sau încalcă api-ul (§3 ecranul = starea, §4 evenimente, §5 starea, §6 asistentul) ori contractul (I1 telefon, I7, R12 „nu tace”).
- **[FARA_REFERINTA]** = bănuiești o diferență, dar referința nu o dovedește: o treci acolo, nu la GRAV.
- **MINOR** = diferență reală care nu blochează și nu induce în eroare.

## Formatul `D/runde/N/critic.md` (model: `D/runde/14/critic.md`)
1. **A. GRAV-urile vechi**, câte una: ÎNCHIS / DESCHIS, cu proba ta (fișierul din `critic_probe/` + ce ai văzut).
2. **B. Unghiul rundei**: constatările noi, fiecare GRAV cu:
   - gestul;
   - ce face simulatorul;
   - ce face aplicația reală (citat din referință, cu cheia);
   - de ce e GRAV;
   - cauza în cod (fișier:rând), dacă o găsești.
3. **C. Regresul**: ce era închis înainte rămâne închis (eșantion pe drumurile lecțiilor); celelalte aplicații Office pornesc și se poartă ca înainte, dacă banda ta a atins cod comun.
4. **D.** Secțiunile `[FARA_REFERINTA]`, `MINOR`, „Ce a trecut” și „Predarea pentru runda următoare” (ce ar trebui reparat întâi, ce referință ar trebui capturată).
5. **Ultimele două linii**, exact așa:
   ```
   GRAV_VECHI_DESCHISE: <n>
   GRAV: <n>
   ```
   GRAV = toate GRAV-urile deschise acum (vechi + noi).

Răspunsul final către orchestrator, în cel mult 8 rânduri, în română:
- cele două numere;
- GRAV-urile deschise, câte un rând fiecare;
- dacă banda ta a stricat ceva în altă aplicație.
