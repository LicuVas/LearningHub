# Rundă `acoperire` pe Word, după platoul valului B-word (rundele 1-3) — scris de orchestrator, 18.11.2026

Ești agentul rundei `acoperire`. NU ești autorul bibliotecii. Nu atingi nimic sub `C:/00/Projects/LearningHub_fidel/aplicatii/`,
lecțiile, jocurile sau `jocuri/_motor/`. D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`.

## De ce există runda
`D/opreste.py` a oprit valul B-word pe PLATOU: O1-O9 au aceleași numere în rundele 1, 2, 3 (O4 98, O5 154, O9 41 …). Oracolele
nu mai văd nimic din ce se repară pe Word, pentru că gesturile și suprafețele reparate (salvare, Enter în File name, Font Size,
Ctrl+W/Ctrl+O, Save As, telefonul) NU sunt în scenariile și referințele înghețate. Criticul rece mai are 4 GRAV deschise
(`D/runde/3/critic.md`). Contractul (`D/contract.md`, „Lărgirea acoperirii … doar într-o rundă marcată `acoperire`, care are voie
să crească numerele, și reînghețată după”) e singura cale prin care oracolele pot vedea suprafețele astea. Tu le lărgești, din
aplicația REALĂ, nu din bibliotecă și nu din memorie.

## Regula de aur
Tot ce scrii ca referință sau rezultat așteptat vine din Word-ul REAL de pe PC (UI Automation pe desktopul ascuns, sau modelul
obiect COM invizibil) sau dintr-o pagină Microsoft cu URL citat (`referinte/surse_microsoft.md`). Ce nu poți obține așa rămâne
[NEVERIFICAT] și NU intră în oracol. Nu te uiți la ce face biblioteca ca să alegi ce scrii în referință (poți rula oracolele pe
bibliotecă doar DUPĂ ce referința e scrisă, ca să măsori).

## Ce ai de acoperit (în ordinea asta; te oprești la o graniță curată dacă timpul/contextul nu ajung)
1. **Capturi UIA noi din Word real** (extinzi `referinte/dump_uia_office.py` sau scrii un generator-soră în `referinte/`, rulat
   pe desktopul ascuns cu `python C:/00/AI_0/tools/hidden_desktop.py run --desktop LHRefOffice --timeout 900 -- python …`;
   generatorul refuză ecranul omului, ca cel existent):
   a. Ctrl+S pe un document NOU, nesalvat: ce apare în Word-ul de pe PC-ul ăsta (fereastra „Save this file”, Backstage › Save As
      sau Save As clasic) — arborele complet. (Rezolvă abaterea A2-1 din `D/de_aprobat.md` cu referința reală, oricare ar fi.)
   b. Ctrl+W și ✕ pe un document cu modificări nesalvate: fereastra „Save your changes…” / „Do you want to save…” (butoane, text,
      ordinea, butonul implicit).
   c. Lista derulantă a casetei Font Size din panglică (Home › Font), deschisă: rândurile ei, în ordine.
   d. File › Open: pagina Open (Recent, Browse …) — doar structura; numele de fișiere din Recent NU intră în referință (date
      personale), se înlocuiesc cu „<fișier>”.
   e. Fereastra Save As: panoul din stânga (etichetele), bara de adrese, antetele coloanelor (Name/Nume, Date modified …).
   f. Listele din `D/de_verificat.md` marcate „captură” (R1-2: Bullets/Numbering/Borders/Table/Margins; R1-4/R1-5; R2-7…R2-9
      tabel) — doar cât încape.
2. **Scenarii reale noi** în `referinte/scenarii_real/word-*.json` (același format ca cele existente), cu rezultatul luat
   rulând scenariul pe Word real (`referinte/ruleaza_real.py` sau modelul obiect COM: DispatchEx, Visible=False, DisplayAlerts=0,
   închizi DOAR PID-ul tău): titlul ferestrei după salvare cu nume nou; Enter în File name = salvare; Font Size tastat (20 +
   Enter) pe selecție; Ctrl+O; salvarea ca PDF (tipul ales); Ctrl+W pe document nesalvat. Plus, dacă se pot da rezultat real,
   cele 7 scenarii Word existente fără rezultat real (le găsești în `oracole/` — ieșirea O4 la `runde/3/masurare.json` /
   `iesiri`).
3. **Contractul bibliotecii** (`D/api_biblioteca.md`, înghețat): completezi §4 cu felul de gest `tasta_acces` (KeyTips — biblioteca
   îl emite deja, `aplicatii/aplicatii.js:406-409, 454, 489`) și câmpul de eveniment `activat` (ex. `'dialog_salvare:Save'`,
   folosit de asistentul §6.3), cu aceleași reguli de scriere ca restul §4; `D/suprafete.json` (înghețat) primește suprafețele
   noi de la punctul 1 (dacă oracolul O3/O9 le citește de acolo).
4. **Oracolele**: le schimbi DOAR cât trebuie ca să citească referințele/scenariile noi (dacă le citesc deja din dosar, nu le
   atingi). Fiecare oracol atins trebuie să prindă în continuare bancul de mutanți (≥5, aceleași prinderi ca înainte —
   `oracole/` + rezultatele rundei `acoperire` din `runde/1/acoperire/`), plus cel puțin 1 mutant nou pe o suprafață nouă.

## Dovezi și reînghețare
- Măsurarea după acoperire: `python D/oracole/masoara.py --runda 3 --paralel 3` (păstrează singur măsurarea precedentă ca
  `masurare_<k>.json`; noul `runde/3/masurare.json` = punctul de pornire al rundei 4). Oracolele rulate direct: cu variabila
  de mediu `LH_IESIRE` spre `D/runde/3/acoperire/` — nu scrii peste `D/oracole/*.json` urmărite în git.
- Raportezi numerele O1-O9 + porți: înainte de acoperire (= `runde/3/masurare.json`) → după acoperire, pe aceeași bibliotecă.
  Creșterea e permisă (de asta există runda); explică fiecare unitate nouă (ce scenariu / ce suprafață o produce).
- La final: `python D/ingheata.py --acoperire "B-word dupa platou r1-3: capturi UIA reale + scenarii noi + api §4"`, apoi
  `python D/ingheata.py --verifica` = 0.

## Reguli
- Nimic pe ecranul omului; Word doar pe desktopul ascuns sau invizibil prin COM; PowerPoint nu-l atingi. Închizi doar
  procesele tale; după orice oprire forțată a lui Word, ștergi doar intrările Resiliency/DocumentRecovery care arată spre
  fișierele TALE de probă (în `%TEMP%`, cu nume unice).
- Probele în browser: doar 127.0.0.1/localhost (ruta care abandonează restul). Nimic spre servere vii.
- Fără căi cu numele utilizatorului Windows (`C:/Users/...`) în NICIUN fișier scris (poarta `date_personale` le numără): „%TEMP%”.
- Căi absolute, fără `cd`. Fără git commit/add/push (le face orchestratorul).
- Ieșirile mari de Bash în fișier, în context doar coada. La ~200k de context: oprire la o graniță curată, `runde/3/acoperire/stare_autor.md`, raportezi „PREDARE”.

## Ieșirea
`D/runde/3/acoperire_word.md`: numerele întâi (tabel înainte → după, mutanți înainte → după), apoi fișierele schimbate (fiecare
înghețat), ce s-a capturat (cu calea și cum s-a obținut), ce a rămas [NEVERIFICAT], și ce vede acum oracolul din cele 4 GRAV ale
criticului 3. Ultima linie, exact: `ACOPERIRE_GATA` sau `ACOPERIRE_PARTIALA` sau `NU_SE_POATE`.
