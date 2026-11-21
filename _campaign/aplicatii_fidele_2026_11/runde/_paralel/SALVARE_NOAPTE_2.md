# Ești sesiunea de SALVARE a turei de noapte 20→21.11.2026, partea a doua („Aplicațiile fidele”, LearningHub)

## Ce s-a întâmplat
- **Sesiunea-dirijor a murit după 05:30.** Agenții ei din fundal au murit odată cu ea.
- **Vasile doarme.** A spus: „noaptea asta e a ta”.
- **Ritualul de noapte** e în `C:/00/AI_0/.claude/skills/noapte-buna.md`: nu întrebi nimic, nu faci nimic ireversibil, nu trimiți nimic altcuiva.
- **Ciclurile paralele A, B și C sunt închise** (commit 27a0e685). Regula PLATOU a oprit toate cele 4 valuri.
- **În lucru era runda `acoperire` Office**, care deblochează platoul. Promptul ei e `D/runde/26/acoperire_office_prompt.md`. D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`.

## Citește întâi
1. `D/STARE_ORCHESTRATOR.md`, ultimele 4 intrări.
2. `D/runde/26/acoperire_office_prompt.md`.
3. `D/runde/26/acoperire_office.md` (raportul, dacă există) și `D/runde/26/acoperire_office/stare_autor.md`.

## Ce faci
1. **Starea rundei de acoperire:**
   - ultima linie a raportului e `ACOPERIRE_GATA`, `ACOPERIRE_PARTIALA` sau `NU_SE_POATE` = runda s-a terminat; treci la pasul 3;
   - `PREDARE` sau niciun raport = pornești un constructor nou, ÎN PRIM-PLAN (ești în `claude -p`, iar fundalul moare la finalul turei). Model opus, `general-purpose`, cu promptul: „citește `D/runde/26/acoperire_office_prompt.md` și `D/runde/26/acoperire_office/stare_autor.md`, apoi continuă de unde a rămas”.
2. **Înainte de el, procesele Office rămase:**
   - `tasklist /FI "IMAGENAME eq EXCEL.EXE"` și `… WINWORD.EXE`;
   - închizi DOAR PID-urile scrise ca ale rundei în `stare_autor.md`, cu `taskkill /PID <n>`;
   - orice alt PID e al omului: nu-l atingi. Niciodată `taskkill /IM`. POWERPOINT NU SE PORNEȘTE.
   - Dacă o măsurare (`masoara.py`) a rămas pornită fără stăpân, o lași să se termine; nu pornești alta peste ea.
3. **După rundă:**
   - `python D/ingheata.py --verifica` trebuie să dea 0;
   - un rând de jurnal în `D/jurnal.jsonl`, după modelul rândurilor existente, cu `etapa: "acoperire"`, `aplicatia: "office"`, `oracole_inainte` din `runde/26/masurare.json` și `oracole_dupa` din `runde/26/acoperire_office/masurare.json`;
   - o intrare în `D/STARE_ORCHESTRATOR.md`.
4. **Commit** (doar căile tale, niciodată `-A`):
   - `git -C C:/00/Projects/LearningHub_fidel add -- <căile>`, fără `iesiri/`, `inainte/`, `probe_iesiri/`, `__pycache__/`;
   - înainte: grep pe diff-ul pus în stage după numele contului Windows, numele de familie al omului și adresa lui de e-mail (le iei din `git config user.name` / `user.email` și din `%USERNAME%`) = 0 potriviri;
   - mesajul se termină cu `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`;
   - FĂRĂ push. Nimic pe master.
5. **Ciclul D NU îl pornești** (rămâne pentru dirijorul de mâine).
6. **Raportul de dimineață**, cu `python C:/00/AI_0/tools/fleet.py raport-noapte` (textul pe stdin). Are trei secțiuni, în română simplă:
   - **Ce am terminat:** ciclurile A, B, C; Word și Explorer fără GRAV; Excel cu unul (G25-1); Windows cu 3; runda de acoperire.
   - **Ce am hotărât singur:** nepublicarea pe proba; lacătul api rupt și reparat.
   - **Te așteaptă pe tine:** publicarea pe aplicație; captura Paint; repornirea (PowerPoint); regula „conținutul calculatorului”; punctele din `D/de_aprobat.md`.

## Reguli
- Nimic pe ecranul omului. Office numai invizibil, pe desktopul ascuns, prin DispatchEx.
- Probele cu browserul: headless, doar 127.0.0.1 / localhost.
- Fără căi cu numele utilizatorului Windows în fișierele scrise, fără date personale.
- Căi absolute, fără `cd`.
