# Rundă `acoperire` pe INSTRUMENTE înainte de valul B-explorer — scris de orchestrator, 20.11.2026

D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`. Worktree `C:/00/Projects/LearningHub_fidel`, ramura `fidelitate-aplicatii`. Pornirea e commit-ul af02d1f5 sau unul mai nou.

## De ce există runda
- **Sesiunea cu omul a dat referințele de interfață.** Pe 20.11.2026 (19:48-20:07, `referinte/sesiune_windows_10min.md` › „Rularea din 20.11.2026”) s-au capturat:
  - **`referinte/uia_windows.json`** (NOU): `bara_activitati`, `start`, `start_toate`, `meniu_desktop`, `meniu_desktop_clasic`;
  - **`referinte/uia_explorer.json`**: `explorer_fereastra` (+ `observat_vizual`), `explorer_meniu_nou`, `explorer_meniu_sortare`, `explorer_meniu_vizualizare`, `explorer_meniu_fisier`, `explorer_meniu_fisier_clasic`, `explorer_meniu_fundal`, `explorer_proprietati`, plus `proprietati_fisier` de la Etapa 0.
  - Formatul lor e cel al `referinte/dump_shell_uia.py`:
    - fiecare suprafață are `ferestre: [{arbore, clasa, proces, rect_ecran_100, …}]`;
    - nodurile au `{nume, tip, tip_local, clasa, id, rect, copii, …}`.
- **Oracolele NU le văd.** `oracole/structura_lib.py › referinta_bruta()` (în jur de 180-197) primește doar formatul Office (`{tip, eticheta, id_mso, rect_css, copii}`) și respinge restul. Docstring-ul o spune chiar: „uia_explorer.json de azi … în alt format”.
  - Măsurarea de pornire `runde/15/masurare.json` (20:08-20:50, singură, lacăt ok) arată O3 = 27139, iar `iesiri/O3/oracol_ui.json › fara_referinta` are 29 de suprafețe `explorer.*` / `windows.*` (din 79).
  - În `suprafete.json › aplicatii.explorer / windows`, sursele sunt toate „[NEVERIFICAT]: nicio referință reală pe disc încă”.
- **Fără runda asta, valul B-explorer n-ar avea oracol de interfață.** Constructorul ar desena Explorer-ul, iar O3 n-ar număra nimic.
- **Modelul de rundă e `runde/1/acoperire_instrumente.md`** (18.11.2026), citit întreg:
  - aceeași regulă: diagnostic verificat în cod, schimbarea minimă, dovezile, bancul de mutanți, reînghețarea;
  - același format de raport.

## Ce ai de făcut
1. **O3 citește `uia_explorer.json` și `uia_windows.json`.**
   - În `structura_lib.py`, un convertor de format, doar pentru aceste două fișiere: nodul shell devine nod canonic.
     - `nume` → `eticheta`;
     - `tip` → `tip`;
     - `rect` → `rect_css`, normalizat la cadrul pe care îl folosesc deja comparațiile (`L.VIEWPORT`, `L.TOL_PX`);
     - `id` (AutomationId) → `id`;
     - `copii` → `copii`.
     O suprafață cu mai multe ferestre (meniul + submeniul, cele 2 bare de activități) devine un nod rădăcină cu ferestrele drept copii, sau o regulă documentată.
   - Formatul Office NU se schimbă: Word, Excel și PowerPoint trebuie să dea exact aceleași numere.
   - Nodurile ascunse pentru date personale („[element personal ascuns]”, „[… ascuns]”, „[id ascuns]”, „[rețea ascunsă]”, „[utilizator]”) NU se compară ca etichete. Le numeri ca prezente, fără text, și scrii regula.
2. **Legătura suprafețelor.** Pentru fiecare intrare `explorer.*` / `windows.*` din `suprafete.json` care are acum captură:
   - `referinta_suprafata()` o leagă de cheia din referință. De exemplu:
     - `explorer.fereastra` / `bara_adresa` / `bara_comenzi` / `panou_navigare` / `zona_continut` / `bara_stare` / `butoane_navigare` / `cautare` → `explorer_fereastra` (sau sub-noduri ale ei, dacă scrii o regulă de tăiere pe `clasa` / `id` / `tip`);
     - `explorer.meniu_nou` → `explorer_meniu_nou`;
     - `explorer.meniu_sortare_vizualizare` → `explorer_meniu_sortare` + `explorer_meniu_vizualizare`;
     - `explorer.meniu_clic_dreapta` → `explorer_meniu_fisier` (+ `_clasic`, `_fundal`);
     - `windows.*` → cheile din `uia_windows.json`.
     Lista exactă o stabilești TU din `suprafete.json` și din capturi. O legătură forțată e mai rea decât una lipsă.
   - În `suprafete.json` completezi `sursa` / `ce_contine` pe intrările legate, ca la `powerpoint.bara_stare#Slide Sorter`: „referinte/uia_explorer.json › <cheie> (UI Automation pe Windows-ul profesorului, sesiunea din 20.11.2026)”.
   - Suprafețele fără captură rămân `fara_referinta`, fiecare cu motivul. De exemplu, dialogurile `explorer.dialog.*` au doar titlul și butoanele în `scenarii_real/explorer_*.json`: spui dacă și cum le poate folosi O3, fără să le inventezi structura.
3. **Bancul de mutanți** (`mutanti/mutanti.py`, `banca.json`):
   - rulezi bancul ÎNAINTE și DUPĂ: aceleași prinderi pe Word, Excel și PowerPoint;
   - adaugi cel puțin 2 mutanți noi care dovedesc că O3 vede acum Explorer-ul, de exemplu o referință cu un rând lipsă în meniul „Nou” sau cu o etichetă schimbată în fereastră. Mutanții se prind pe referință sau pe randare, cum lucrează bancul azi;
   - `validare.json` / `rezultat.json` la zi.
4. **Măsurarea:**
   - copiezi `runde/15/masurare.json` în `runde/15/masurare_inainte_instrumente.json`;
   - rulezi SINGUR, după ultima scriere: `python D/oracole/masoara.py --runda 15 --paralel 3 --compara D/runde/15/masurare_inainte_instrumente.json --timeout O6=3600`.
   - **Ce e voie:**
     - O3 poate crește sau scădea, cu explicația pe suprafață (`pe_suprafata`, `fara_referinta`);
     - Word, Excel și PowerPoint pe O3 trebuie să rămână identice, suprafață cu suprafață (le compari din `iesiri/O3/oracol_ui.json` înainte / după).
   - Restul oracolelor și porțile nu se mișcă.
   - Atenție: O2 / O3 folosesc un cache de randare cheiat pe sha256 (`structura_lib.py:17`). Verifici că cheia cuprinde și extractorul / referințele schimbate, ca rezultatul să nu vină dintr-un cache vechi.
5. **Reînghețarea:** `python D/ingheata.py --acoperire "instrumente: O3 citeste uia_explorer/uia_windows (format shell) + legaturile explorer.*/windows.* din suprafete.json"`, apoi `--verifica` = 0.

## Ce NU faci
- Nu atingi `aplicatii/`, lecțiile, jocurile, `jocuri/_motor/`, scenariile, `api_biblioteca.md`, nici capturile din `referinte/` (`uia_*.json`, `scenarii_real/`). Le citești doar prin Python, pe chei.
- Nu pornești Explorer, Word, Excel sau PowerPoint real. Nu umbli pe ecranul omului. Probele în browser rulează headless, doar pe 127.0.0.1/localhost.
- Fără commit, fără push.
- Căi absolute, fără `cd`. Nicio cale cu numele utilizatorului Windows în fișierele scrise (scrii „%TEMP%”). Nicio dată personală: capturile au deja nodurile ascunse.
- Ieșirile mari de Bash pe disc, în context doar coada. La ~200k de context: `runde/15/acoperire_instrumente/stare_autor.md` la zi și ultima linie „PREDARE”.

## Ieșirea
`D/runde/15/acoperire_instrumente.md`, cu aceleași secțiuni ca `runde/1/acoperire_instrumente.md`:
- numerele întâi;
- verificarea diagnosticului;
- ce ai schimbat și de ce;
- dovezile;
- ce NU ai putut dovedi;
- diff-ul complet al oracolelor.

Ultima linie: `INSTRUMENTE_REPARATE`, `NU_SE_POATE` sau `PREDARE`. Dovezile brute stau în `D/runde/15/acoperire_instrumente/`.
