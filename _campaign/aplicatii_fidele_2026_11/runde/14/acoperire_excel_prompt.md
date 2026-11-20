# Rundă `acoperire` pe Excel, redeschisă după valul B-powerpoint — scris de orchestrator, 20.11.2026

D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`. Worktree `C:/00/Projects/LearningHub_fidel`, ramura `fidelitate-aplicatii`, pornire = HEAD (a4554c9c sau mai nou).

## De ce există runda
- **Valul B-excel s-a oprit după runda 10** (`runde/10/raport.md`), cu 3 GRAV deschise. Cel care blochează o lecție e **X10**: m2-l11 nu se poate termina.
  - „Insert Line or Area Chart ▾” și „Add Chart Element › Data Labels” dau doar mesajul central.
  - Listele lor NU sunt în referință (`runde/10/critic.md:34`).
- **Valurile Explorer, Windows și Paint așteaptă** o sesiune cu omul la PC (`referinte/sesiune_windows_10min.md`). Folosim timpul pentru deblocatorul lui X10, scris în `runde/10/raport.md` › „Deblocatorii”.
- **Regula, modelul și formatul** sunt cele din runda `acoperire` Excel de după runda 7. Citește-o întâi, întreagă: `D/runde/7/acoperire_prompt.md`, plus raportul ei `D/runde/7/acoperire_excel.md`. Generatorul ei `D/referinte/acoperire_excel_r7.py` e modelul tău: faci un generator-soră `D/referinte/acoperire_excel_r14.py`, cu blocul `acoperire_r14` în `uia_excel.json`.
- **Ce se schimbă față de runda 7:** doar lista de mai jos și căile de ieșire.

## Ce ai de acoperit
1. **Capturi UIA noi din Excel real** (cu aceeași metodă ca în runda 7: Excel-ul tău pe desktopul ascuns `LHRefOffice`, `referinte/dump_uia_office.py`):
   - `lista.ChartTypeLineInsertGallery` (Insert › Insert Line or Area Chart ▾): rândurile, grupurile, numele, tastele de acces, dreptunghiurile;
   - fila contextuală Chart Design › **Add Chart Element ▾** și submeniul **Data Labels ▸**: rândurile și tastele;
   - starea reală după Line + Data Labels › Show (sau numele exact din referință), citită prin COM: tipul graficului și `HasDataLabels` pe serie.
   Drumul lecției: `C:/00/Projects/LearningHub_fidel/lectii/viii/m2-l11/index.html`. Grep după „Line”, „Data Labels”, „etichete”; dacă lecția e în alt folder, o găsești cu Grep în `lectii/`.
2. **Scenarii reale noi** în `referinte/scenarii_real/excel-*.json` + `scenarii/excel/`, cu același format ca în runda 7:
   - graficul Line din galerie;
   - Data Labels pe graficul din lecție;
   - faptele din `D/de_verificat.md` R10-3 (a, c), R10-5 și R10-6: vărsarea și `#SPILL!`, Ctrl+săgeți peste celulele vărsate, Ctrl+↓ până la rândul 1.048.576. Le iei doar dacă se pot juca pe Excel-ul tău invizibil cu gesturi reale sau prin COM, cum a făcut runda 7.
3. **`api_biblioteca.md`**, doar dacă scenariile cer chei noi de stare (de ex. tipul graficului, etichetele de date): §5 excel, ca în runda 7 §3.
4. **Oracolele** nu se ating, ca în runda 7 §4.

## Măsurarea, reînghețarea, ieșirea
- Pornirea e `D/runde/14/masurare.json`, pasul 7 al rundei 14, singur pe mașină.
- La final rulezi `python D/oracole/masoara.py --runda 14 --paralel 3 --compara D/runde/14/masurare.json --timeout O6=3600`, SINGUR, după ultima scriere în zona înghețată.
  - ATENȚIE: comanda scrie peste `runde/14/masurare.json`. Înainte de ea copiezi `runde/14/masurare.json` în `runde/14/masurare_pas7_r14.json` și dai `--compara` pe copie.
  - Rezultatul nou îl copiezi în `runde/14/acoperire_excel/masurare.json`, apoi pui înapoi copia ca `runde/14/masurare.json`. Pasul 7 al rundei 14 trebuie să rămână neschimbat.
- Reînghețarea: `python D/ingheata.py --acoperire "B-excel redeschis dupa runda 14: X10 (Line chart, Data Labels) + R10-3/5/6"`, apoi `--verifica` = 0.
- Dovezile brute, logurile și `stare_autor.md` le pui în `D/runde/14/acoperire_excel/`. Raportul îl scrii în `D/runde/14/acoperire_excel.md`, cu aceleași secțiuni ca `runde/7/acoperire_excel.md`.
  - Ultima linie a raportului: `ACOPERIRE_GATA`, `ACOPERIRE_PARTIALA`, `NU_SE_POATE` sau `PREDARE`.

## Reguli (pe lângă cele din `runde/7/acoperire_prompt.md`, care rămân toate în vigoare)
- **Excel-ul omului nu se atinge.**
  - Înainte de fiecare pornire: `tasklist /FI "IMAGENAME eq EXCEL.EXE"`.
  - Instanța ta e nouă: `DispatchEx` pe desktopul ascuns, `Visible` doar acolo, `DisplayAlerts=0`.
  - Închizi DOAR PID-ul tău. Niciodată `Dispatch` / `GetObject` / `GetActiveObject` / `taskkill /IM`.
  - WINWORD-ul deschis e al omului: nu-l atingi.
- **PowerPoint NU se pornește.** E un proces POWERPNT.EXE blocat la închidere de la o rundă trecută: nu-l atingi.
- **Sesiunile:** fiecare durează cel mult 10 minute. Niciun `timeout` pe wrapper mai mic decât sesiunea: a lăsat un PowerPoint blocat azi.
- **Fișierele:** fișierele de probă `lh_xl_r14_*` stau în %TEMP%. La final cureți Recent: ComDlg32 și Office, doar intrările cu marcajul tău.
- **Clipboard-ul:** îl salvezi și îl pui la loc. Dacă e ocupat, nu apeși Ctrl+C și scrii [NEVERIFICAT].
- **Nimic pe ecranul omului.** Probele în browser rulează headless, doar pe 127.0.0.1/localhost.
- **Fără commit, fără push.** Nu atingi `aplicatii/`, lecțiile, jocurile sau oracolele.
- **Căi absolute, fără `cd`.** Nicio cale cu numele utilizatorului Windows în fișierele scrise: scrii „%TEMP%”. Nicio dată personală.
- **Contextul:** `uia_excel.json` și `suprafete.json` le citești doar prin Python, pe chei. Ieșirile mari de Bash pe disc. La ~200k de context: `stare_autor.md` la zi și „PREDARE”.
