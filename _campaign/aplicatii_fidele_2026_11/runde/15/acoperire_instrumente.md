# Runda 15 · `acoperire` pe INSTRUMENTE — O3 citește referințele shell (Windows, File Explorer), înainte de valul B-explorer (20.11.2026)

Agentul rundei `acoperire` (nu constructorul; `aplicatii/`, lecțiile, jocurile, scenariile, `api_biblioteca.md` și capturile
din `referinte/` neatinse: capturile doar citite prin Python, pe chei). Fișiere schimbate în zona înghețată: **7**, toate
reînghețate: `oracole/structura_lib.py`, `oracole/oracol_ui.py` (O3), `oracole/CONVENTIE_ARBORE.md`, `suprafete.json`,
`mutanti/banca.json`, NOI `oracole/_jucarie_shell/genereaza_jucarie.py` și `oracole/_jucarie_shell/explorer-citire.js`
(generat). `arbore_randat.js`, `sim_runner.js`, celelalte oracole și `mutanti/mutanti.py` NU au fost atinse. Dovezile
brute: `runde/15/acoperire_instrumente/` (scripturile probelor în `probe/`).

## Numerele întâi

| | pornire (20:08-20:50, `masurare_inainte_instrumente.json`) | după (21:23-22:15, `masurare.json`) |
|---|---|---|
| **O3** | 27139 | **28919** (+1780 = +1797 pe 20 de suprafețe shell − 17 `fara_referinta` legate) |
| O3 · Word / Excel / PowerPoint | 9143 / 7604 / 10306 | **9143 / 7604 / 10306**: 189 de suprafețe, 0 cu vreun câmp diferit |
| O3 · `fara_referinta` | 79 (29 explorer/windows) | **62** (12 explorer/windows, fiecare cu motiv; celelalte 50 identice) |
| O1 / O2 / O4 / O5 / O6 / O7 / O8 / O9 | 61 / 13392 / 64 / 82 / 0 / 341 / 102 / 27 | **identice** |
| porți | 41 (`cum_fac` 41, restul 0) | **41**, identic pe fiecare poartă |
| suma măsurată | 41249 | 43029 (= +1780, doar O3); lacăt ok la început și la sfârșit, 0 neconcludente |
| bancul O3 (+O2), înainte / după | O3 10/11 (neprins O3-02) · O2 9/9 | **O3 14/15** (neprins tot O3-02; O3-12…15 noi, prinși) · O2 9/9 |
| bancul întreg (`mutanti/rezultat.json`) | 17.11: neprinși O3-02, O4-04 | **70/72**, neprinși aceiași O3-02, O4-04; `validare.json` 72/72 |
| jucăria Explorer fidelă (V/M2-L09) | — | **0 puncte** pe toate cele 16 suprafețe explorer.* |
| `ingheata.py --verifica` | 7 abateri (exact fișierele mele) | **0** (427 fișiere) |

`masoara.py` scrie „REGRES față de 15/masurare_inainte_instrumente.json: O3 27139 -> 28919” și iese cu codul 1. E creșterea
voită: O3 vede acum Explorer-ul și Windows-ul. Până construiește B-explorer, 19 dintre cele 20 de suprafețe shell nu sunt
desenate nicăieri: fiecare dă „suprafață lipsă” + 7 pe comandă.

## Verificarea diagnosticului (în cod, nu pe cuvânt)
- **O3 nu vedea referințele shell: confirmat.** `structura_lib.py › referinta_bruta()` (vechi r. 180-196) păstra fișierul
  doar dacă vreo suprafață avea cheile Office `tip` + `copii` la rădăcină; capturile shell au `ferestre: [{arbore, …}]`, deci
  ieșea `None`, `Referinta.canon` gol, iar `oracol_ui.py` (vechi r. 58) bucla oricum doar pe `L.OFFICE`. Măsurarea de pornire
  (`iesiri_inainte/O3/oracol_ui.json`): 27139, `fara_referinta` = 79, din care 29 `explorer.*` / `windows.*` (19 + 10).
- **`suprafete.json`**: toate cele 29 aveau `sursa` „[NEVERIFICAT]”, iar `surse_reale` „nicio referință reală pe disc încă”.
- **Mai grav decât scria promptul:** chiar cu referința citită, randarea nu deschide nimic la Explorer / Windows.
  `_randeaza_pagina` cheamă `_deschide_restul` (gesturi + plasa `deschideSuprafata`) doar dacă `referinte()[app].canon`
  nu e gol. Meniurile Explorer (Nou, Sortați, Vizualizați, clic dreapta) ar fi ieșit mereu „suprafață lipsă”, oricât de
  bine le-ar fi construit valul B-explorer.
- **Nu puteam pur și simplu să dau canon lui `referinte()`.** `referinte()` e folosit și de O2 (`oracol_identic.py:29`),
  O7 (`oracol_text_ui.py:55`), O8 (`oracol_comenzi_moarte.py:118`) și de randare (`_canon_inst`, `are_file`,
  `_deschide_restul`). Cu un canon Explorer acolo, O7 ar fi început să judece citatele Explorer, iar randarea ar fi mers
  pe alt drum. Atunci „restul oracolelor nu se mișcă” n-ar mai fi fost adevărat. De aceea referința shell e o cale separată,
  citită doar de O3.
- **Cache-ul randării** (`amprenta_site`, vechi r. 1326): cheia cuprindea modulul, extractorul și doar `uia_{word,excel,powerpoint}.json`.
  Am adăugat `uia_windows.json` și `uia_explorer.json`, pentru că randarea depinde acum de ele (plasa shell). Comparația O3
  nu e în cache: se refăcea oricum la fiecare rulare.

## Ce am schimbat și de ce

**A. Convertorul shell → nod canonic** (`structura_lib.py`, secțiunea „referințele shell”, `_shell_nod`, `_shell_ferestre`,
`canon_shell`). Formatul Office (`referinta_bruta`, `Referinta`, `canon`, `_turteste`, `_unit`) nu e schimbat. Reguli:
- `nume` → `eticheta`, `tip` → `tip`, `copii` → `copii`.
- `id` (AutomationId) → `id_mso`, doar la comenzile cu id unic în suprafață. `TextBox`, `UpButton`, `SystemTrayIcon` și
  `NotifyItemIcon` se repetă, așa că nu identifică nimic.
- `rect` → `rect_css` fără scalare: pixelii la 100% DPI sunt pixelii CSS ai cadrului 1366×768. Pozițiile se compară față
  de colțul suprafeței, cu `TOL_PX` = 8, ca la Office.
- O comandă fără dreptunghi sau marcată `in_afara_ecranului` nu se vede (ca `vizibil: false` la Office). Containerele se
  străbat mereu: meniul Explorer stă într-un „Pop-up” marcat în afara ecranului, cu comenzile pe ecran.
- `ToolTip` și ferestrele-zgomot se sar: `SysShadow`, `tooltips_class32` și `Shell_SecondaryTrayWnd` (bara monitorului al
  doilea al profesorului; elevul are un singur ecran).
- În meniurile clasice Win32 se taie scurtătura de după Tab („Anulare Copiere⇥Ctrl+Z”).
- Arborele panoului de navigare (TreeItem în TreeItem) se turtește în ordinea de pe ecran. Altfel, după regula „copiii
  unei comenzi nu se citesc”, ar fi rămas doar „Desktop”.
- **Mai multe ferestre** (meniul + submeniul, lista + rândul de pictograme): un `Pane` rădăcină cu ferestrele drept copii,
  sus-jos și stânga-dreapta, fiecare mutată cu colțul ei față de reuniune. Un Pop-up citit de două ori (o dată ca fereastră
  proprie, o dată în gazda altei ferestre, cu aceleași comenzi în același loc, ±2 px) se numără o dată. Fără regula asta,
  `meniu_fisier` și `meniu_desktop` aveau fiecare rând de două ori: 33 în loc de 19 și 20 în loc de 10.
- **Nodurile ascunse pentru date personale** („[element personal ascuns]”, „[… ascuns]”, „[id ascuns]”, „[rețea ascunsă]”,
  „[utilizator]”, „[cont]” …, plus contul sărit de dump) nu se compară ca etichetă. Intră ca unitate PREZENTĂ, fără text
  (`ascuns: true`, eticheta „[ascuns]”). În `aliniaza`, un al treilea pas (după id și etichetă) o potrivește cu o comandă
  desenată rămasă nepotrivită, de aceeași familie de tip, întâi între vecinii ei deja potriviți, ca ordinea să rămână.
  Nepotrivită = `lipsa`. Unitățile Office și cele randate nu au `ascuns`, deci pentru ele pasul nu face nimic (dovada 1).

**B. Tăieturile și legăturile** (`SHELL_SUPRAFETE`, `SHELL_LEGATURI`, `ReferintaShell`, ramura shell din
`referinta_suprafata`). Cheia de randare e cea pe care o pune constructorul în `data-lh-suprafata`.
- Fereastra Explorer e TĂIATĂ pe AutomationId în părțile din `suprafete.json`. Fiecare parte își are colțul ei, deci o
  fereastră desenată mai îngustă nu mută lista sau bara de stare față de colțul lor. UIA mai pune bara de stare înaintea
  panoului de navigare; într-o fereastră întreagă, ordinea asta ar fi dat diferențe „ordine” false.
- Tabelul complet (suprafață → cheie ← captură, regulă, comenzi comparate / ascunse) e mai jos.

| suprafața din `suprafete.json` | cheia de randare | captura (`referinte/…`) › regula | comenzi (ascunse) |
|---|---|---|---|
| `explorer.bara_adresa` | `bara_adresa` | `uia_explorer.json` › `explorer_fereastra` › tăiat pe AutomationId: PART_AutoSuggestBox, FirstCrumbStackPanel, PART_BreadcrumbBar | 11 (1) |
| `explorer.bara_comenzi` | `bara_comenzi` | `uia_explorer.json` › `explorer_fereastra` › tăiat pe AutomationId: FileExplorerCommandBar, FileExplorerSecondaryCommandBar | 11 |
| `explorer.bara_stare` | `bara_stare` | `uia_explorer.json` › `explorer_fereastra` › tăiat pe AutomationId: StatusBarModuleInner | 3 |
| `explorer.butoane_navigare` | `butoane_navigare` | `uia_explorer.json` › `explorer_fereastra` › tăiat pe AutomationId: NavigationCommands | 4 |
| `explorer.cautare` | `cautare` | `uia_explorer.json` › `explorer_fereastra` › tăiat pe AutomationId: FileExplorerSearchBox | 1 |
| `explorer.fereastra` | `fereastra` | `uia_explorer.json` › `explorer_fereastra` › restul ferestrei după tăieturi: cadrul cu bara de titlu | 4 |
| `explorer.meniu_clic_dreapta` | `meniu_fisier` | `uia_explorer.json` › `explorer_meniu_fisier` › toată captura | 19 |
| ″ | `meniu_fisier_clasic` | `uia_explorer.json` › `explorer_meniu_fisier_clasic` › toată captura | 33 |
| ″ | `meniu_fundal` | `uia_explorer.json` › `explorer_meniu_fundal` › toată captura | 9 |
| `explorer.meniu_nou` | `meniu_nou` | `uia_explorer.json` › `explorer_meniu_nou` › toată captura | 21 |
| `explorer.meniu_sortare_vizualizare` | `meniu_sortare` | `uia_explorer.json` › `explorer_meniu_sortare` › toată captura | 7 |
| ″ | `meniu_vizualizare` | `uia_explorer.json` › `explorer_meniu_vizualizare` › toată captura | 16 |
| `explorer.panou_navigare` | `panou_navigare` | `uia_explorer.json` › `explorer_fereastra` › tăiat pe AutomationId: ProperTreeHost | 24 (15) |
| `explorer.zona_continut` | `zona_continut` | `uia_explorer.json` › `explorer_fereastra` › tăiat pe AutomationId: listview | 12 |
| `explorer.file_fereastra` | `file_fereastra` | `uia_explorer.json` › `explorer_fereastra` › tăiat pe AutomationId: TabView | 2 |
| `explorer.panou_detalii` | `panou_detalii` | `uia_explorer.json` › `explorer_fereastra` › tăiat pe AutomationId: PreviewThumbnailInner, RPaneCoverSheet_NoSel | 1 |
| `windows.bara_activitati` | `bara_activitati` | `uia_windows.json` › `bara_activitati` › toată captura | 23 (2) |
| `windows.meniu_clic_dreapta` | `meniu_desktop` | `uia_windows.json` › `meniu_desktop` › toată captura | 10 |
| ″ | `meniu_desktop_clasic` | `uia_windows.json` › `meniu_desktop_clasic` › toată captura | 15 |
| `windows.meniu_start` | `start` | `uia_windows.json` › `start` › toată captura | 28 (2) |
| `windows.zona_notificare` | `bara_activitati` | `uia_windows.json` › `bara_activitati` › toată captura | 23 (2) |

- **Rămase fără referință (12), cu motivul** (scris și în `suprafete.json › sursa` și în `oracol_ui.json › fara_referinta_motiv`):

| suprafața | de ce rămâne fără referință |
|---|---|
| `explorer.dialog.dinamic` | dialogurile au doar titlul, întrebarea și butoanele, în referinte/scenarii_real/explorer_*.json (verdictul O4), fără arbore UI Automation (tipuri, poziții, celelalte controale); O3 le-ar putea compara doar ca listă de butoane în ordine, iar orice alt control desenat ar ieși „în plus” fals — nu le inventez structura |
| `explorer.dialog.element_negasit` | dialogurile au doar titlul, întrebarea și butoanele, în referinte/scenarii_real/explorer_*.json (verdictul O4), fără arbore UI Automation (tipuri, poziții, celelalte controale); O3 le-ar putea compara doar ca listă de butoane în ordine, iar orice alt control desenat ar ieși „în plus” fals — nu le inventez structura |
| `explorer.dialog.inlocuire_sau_omitere_fisiere` | dialogurile au doar titlul, întrebarea și butoanele, în referinte/scenarii_real/explorer_*.json (verdictul O4), fără arbore UI Automation (tipuri, poziții, celelalte controale); O3 le-ar putea compara doar ca listă de butoane în ordine, iar orice alt control desenat ar ieși „în plus” fals — nu le inventez structura |
| `explorer.dialog.redenumire` | dialogurile au doar titlul, întrebarea și butoanele, în referinte/scenarii_real/explorer_*.json (verdictul O4), fără arbore UI Automation (tipuri, poziții, celelalte controale); O3 le-ar putea compara doar ca listă de butoane în ordine, iar orice alt control desenat ar ieși „în plus” fals — nu le inventez structura |
| `explorer.dialog.stergere_multipla_de_elemente` | dialogurile au doar titlul, întrebarea și butoanele, în referinte/scenarii_real/explorer_*.json (verdictul O4), fără arbore UI Automation (tipuri, poziții, celelalte controale); O3 le-ar putea compara doar ca listă de butoane în ordine, iar orice alt control desenat ar ieși „în plus” fals — nu le inventez structura |
| `explorer.redenumire` | caseta de redenumire pe loc (F2) nu e în nicio captură UI Automation; observat_vizual spune doar ce se colorează (fără „.docx”) — e comportament (O4), nu structură |
| `windows.alimentare` | doar butonul „Alimentare” e capturat (în start, comparat acolo); meniul Oprire / Repornire nu |
| `windows.calendar` | calendarul de la ceas nu e capturat (doar butonul „Ceas” din bara_activitati) |
| `windows.cautare` | doar butonul „Căutare” (bara_activitati) și caseta din Start sunt capturate (comparate acolo); panoul de căutare cu rezultatele nu |
| `windows.desktop` | desktopul (pictogramele, fundalul) nu e capturat; doar meniul lui de clic dreapta |
| `windows.fereastra` | nicio fereastră generică nu e capturată; bara de titlu a Explorer-ului (explorer.fereastra) e a altei aplicații |
| `windows.securitate_windows` | aplicația Securitate Windows nu e capturată |

- **Capturi necomparate (3):** `explorer_proprietati` (Proprietăți nu e o suprafață din `suprafete.json`), `proprietati_fisier`
  (proba Etapei 0, alt format, același dialog) și `start_toate` (același Start, derulat în jos; O3 compară Start așa cum se
  deschide). Stau în `oracol_ui.json › referinte_shell › capturi_necomparate`.

**C. O3** (`oracol_ui.py`):
- bucla pe suprafețe merge acum pe `L.OFFICE + L.SHELL`; pentru Windows / Explorer, referința vine din `L.referinte_shell()`;
- ieșirea are în plus `fara_referinta_motiv` și `referinte_shell` (pe aplicație: captura, regula, comenzi, ascunse,
  tăieturi negăsite);
- punctajul e neschimbat.

**D. Randarea** (`structura_lib.py › _deschide_shell`, `amprenta_site`):
- La o instanță Windows / Explorer completă, încearcă plasa `LHAplicatii.deschideSuprafata(<cheie>)` (CONVENTIE §4.6)
  pentru fiecare cheie shell încă necitită.
- Fără plasă nu face nimic. Azi nicio lecție nu încarcă biblioteca, deci randarea sitului e aceeași.
- Fără asta, meniurile construite de B-explorer n-ar fi fost citite niciodată.
- Amprenta cache-ului cuprinde acum și cele două referințe shell.

**E. Convenția** (`CONVENTIE_ARBORE.md`):
- §2 dă cheile Windows / Explorer:
  - fereastra pe părți imbricate;
  - meniurile;
  - `TreeItem`-urile ca frați;
  - plasa pentru ce nu se vede la pornire.
- §5 dă regula id-ului unic și a nodurilor ascunse.
- Cine construiește Explorer-ul află de aici ce `data-lh-suprafata` să pună.

**F. Bancul de mutanți** (`mutanti/banca.json` v4, `oracole/_jucarie_shell/`):
- Pe situl de azi O3 nu are ce randare Explorer să compare: simulatoarele vechi dau doar `bara_stare`, fără nicio comandă.
- Am făcut o jucărie: `genereaza_jucarie.py` scrie `explorer-citire.js` din două bucăți:
  - simulatorul vechi al lecției V/M2-L09, copiat întocmai;
  - la coadă, un File Explorer desenat după convenție din referința shell. Are rădăcină înregistrată, cele 16 suprafețe și
    comenzile în locul lor. Comenzile ascunse primesc nume oarecare („Folderul meu N”), cum ar face un constructor.
- Pregătirea `jucarie_explorer` o pune peste simulator doar în copia din %TEMP%.
- Mutanții noi O3-12…O3-15 strică câte un rând (detaliile la dovada 3).
- Dacă se schimbă referința Explorer, convertorul sau simulatorul vechi, `genereaza_jucarie.py --verifica` spune
  „DE REGENERAT”.

**G. `suprafete.json`** (scris de `probe/actualizeaza_suprafete.py`, formatul păstrat octet cu octet):
- pe cele 17 legate:
  - `sursa`: fișierul, captura, regula de tăiere și cheia de randare, „(UI Automation pe Windows-ul profesorului,
    sesiunea din 20.11.2026)”;
  - `ce_contine`: comenzile comparate, cele ascunse și cele gri;
- pe cele 12 rămase: „[NEVERIFICAT]: <motiv>”;
- pe aplicații: `surse_reale`, apoi `nr_suprafete_neverificate` (19 → 6 la Explorer, 10 → 6 la Windows);
- nota `acoperire_r15`.

## Dovezile

**1. Măsurarea, singură, după ultima scriere** (`acoperire_instrumente/masurare.log`, `masurare_start.txt`)
- Comanda: `python D/oracole/masoara.py --runda 15 --paralel 3 --compara D/runde/15/masurare_inainte_instrumente.json
  --timeout O6=3600`.
- Ordinea: reînghețat întâi (`ingheata_acoperire.log`), apoi măsurat. Cu lacătul rupt, `masoara.py` nu măsoară
  (pasul 1 din docstring-ul lui). Așa a făcut și runda 14 („lacăt ok la început și la sfârșit”).
- Randarea s-a refăcut de la zero: amprenta e nouă, 717 instanțe ca înainte.
- `probe/compara_o3.py` → `comparatie_o3.txt`:
  - pe Word, Excel și PowerPoint, toate cele 61 + 68 + 60 de suprafețe au aceleași puncte, diferențe, comenzi cu
    diferențe, randări, unități ale referinței și mostre;
  - cele 50 de `fara_referinta` din afara shell-ului sunt identice;
  - O1, O2, O4-O9 și cele 6 porți sunt identice.
- Înainte de măsurare, același O3 pe cache-ul vechi de randare (randarea de la 18:48, făcută cu codul vechi) dădea tot
  28919 (o rulare de probă, nepăstrată). Deci plasa nouă din randare nu schimbă nimic pe situl de azi.

**2. Jucăria: un Explorer FIDEL dă 0, unul stricat crește exact pe suprafața lui** (`probe/proba_jucarie.py` →
`proba_jucarie/proba_jucarie.log` + `proba_jucarie/<variantă>/oracol_ui.json`).
- Setup: O3 pe V/M2-L09, într-o copie a sitului din %TEMP%, cu `_jucarie_shell/explorer-citire.js` pus peste simulator.
- Jucăria curată: O3 = 30641; **16/16 suprafețe explorer.* desenate, 0 puncte pe toate**. Cu asta sunt dovedite:
  - convertorul, tăieturile, ferestrele compuse și deduplicarea;
  - turtirea arborelui;
  - id-urile unice;
  - pozițiile față de colțul părții;
  - regula nodurilor ascunse (15 foldere fixate „[element personal ascuns]” desenate ca „Folderul meu N” = prezente,
    fără diferență).
- Stricăciuni, fiecare pe suprafața ei și nicăieri altundeva:
  - „Folder” scos din meniul Nou: +7 (`meniu_nou||lipsa|folder`);
  - „Decupare” scris „Tăiere”: +8 (`lipsa|decupare` + `in_plus|tăiere`);
  - un folder fixat ASCUNS mai puțin: +15 (`lipsa|[ascuns]` + 8 × `pozitie`: celelalte foldere ascunse se mută cu un rând);
  - „Detalii” desenat ca Button: +1 (`bara_stare||tip|detalii`).

**3. Bancul de mutanți** (`mutanti_inainte/` și `mutanti_dupa/`: `rulare.log` + `rezultat.json`; `mutanti.py --oracol O3,O2
--paralel 2`, cu `LH_IESIRE` la ambele, deci `mutanti/rezultat.json` neatins de ele)
- Înainte, pe codul vechi: O3 10/11 (neprins O3-02, 29151 → 29151), O2 9/9. Linia de bază O3 pe m1-l03: 29151.
- După: O3 14/15, O2 9/9. Linia de bază pe m1-l03: 30932 (+1781). Pe pagina aceea nu e desenată nicio suprafață shell:
  +1797 − 17 legate, iar bara de stare Explorer are 22 în loc de 21, pentru că nu e nicio randare veche.
- **Prinderile Word sunt aceleași, cu aceleași creșteri:**
  - O3-01 +1, O3-03 +184, O3-04 +7, O3-05 +28, O3-06 +1;
  - O3-07 +6, O3-08 +38, O3-09 +6, O3-10 +35, O3-11 +129;
  - O2: creșterile identice, de la O2-01 la O2-09.
- Excel și PowerPoint nu au mutanți O3 în bancă: identitatea lor o dă dovada 1, suprafață cu suprafață.
- **Noi, pe pregătirea `jucarie_explorer`** (linia de bază 30641 / 30641, a doua fără cache):
  - O3-12 (Nou fără „Folder”): 30641 → 30648;
  - O3-13 („Decupare” → „Tăiere”): → 30649;
  - O3-14 (un folder fixat ascuns mai puțin): → 30656;
  - O3-15 („Detalii” ca Button): → 30642.
  Toți sunt PRINȘI.
- `python mutanti/mutanti.py --valideaza` pe toată banca (72 de mutanți): 72/72 valizi → `mutanti/validare.json`
  (`valideaza_tot.log`). O validare parțială pe 5 mutanți l-a suprascris înainte; cea completă e ultima.

**4. Ce citește O3 din capturi** (`oracol_ui.json › referinte_shell`)
- 20 de suprafețe de randare, 254 de comenzi comparate (178 Explorer + 76 Windows), din care 20 ascunse: 15 în
  `panou_navigare`, 2 în `bara_activitati` (OneDrive „[cont]”, rețeaua), 2 în `start` (dala ascunsă și contul sărit de
  dump, numărat prezent) și 1 în `bara_adresa` („[utilizator]”).
- 0 tăieturi negăsite.
- Unitățile verificate de mână pe arborele brut:
  - `meniu_fisier` = 14 rânduri + 5 pictograme (fără dublura „OverflowPopup”);
  - `meniu_vizualizare` = 11 + submeniul „Afișați” cu 5 (fără tooltip);
  - `panou_navigare` = 4 butoane de derulare + 15 ascunse + Acest PC + 4 unități (Desktop, Acasă, Galerie și Rețea sunt
    în afara ecranului).

**5. Reînghețarea**
- `ingheata.py --verifica` înainte: 7 abateri. SCHIMBAT: `banca.json`, `CONVENTIE_ARBORE.md`, `oracol_ui.py`,
  `structura_lib.py`, `suprafete.json`. NOU: cele 2 din `_jucarie_shell/`.
- Apoi `ingheata.py --acoperire "instrumente: O3 citeste uia_explorer/uia_windows (format shell) + legaturile
  explorer.*/windows.* din suprafete.json"`: `repere.lock` scris 20.11.2026 21:23:05, 427 de fișiere.
- `--verifica` imediat după = 0, iar după măsurare din nou **0 (INTACT)** (`ingheata_verifica_final.log`).
- `genereaza_jucarie.py --verifica` = „la zi”.

**6. Date personale:** nicio cale cu numele contului în fișierele scrise (grep pe `acoperire_instrumente/`, `masurare.json`,
`validare.json`: 0). Nodurile ascunse rămân ascunse: jucăria le dă nume inventate, iar O3 le scrie „[ascuns]”.

## Ce NU am putut dovedi / ce rămâne

- **Conținutul calculatorului profesorului se compară ca etichetă.** Am citit promptul strict: doar nodurile ASCUNSE sunt
  „prezente, fără text”. Restul referinței e Windows-ul real al profesorului, cu ce are instalat:
  - aplicațiile fixate / deschise pe bara de activități (Microsoft To Do, Notepad++, KeePassXC, AutoHotkey …) și
    pictogramele din zona de notificare (Dropbox, …);
  - dalele fixate din Start („Agent Ransack”, „Epson Scan 2”, folderele lui …) și categoriile din „Toate”;
  - rândurile puse de programele instalate în meniuri: „Nou” (Google Docs, Python File, AutoHotkey Script, OpenDocument …),
    clic dreapta (Dropbox, Editează cu Notepad++, 7-Zip, PDF24, Open Git Bash here …);
  - valorile momentului: ceasul „19:48”, vremea „13°C Mostly cloudy”;
  - numele folderului de sesiune („sesiune”, „lh_explorer_ref” în butoane și în calea din bara de adresă).

  Un Explorer / Windows „curat”, cu programele școlii, ia `lipsa` (7) pe fiecare rând de-al profesorului și `in_plus` (1)
  pe fiecare rând al lui. Ca să ajungă la 0, constructorul trebuie să copieze lista profesorului. Decizia e a
  orchestratorului:
  - (a) așa rămâne: referința = Windows-ul real al profesorului;
  - (b) o regulă „conținut al calculatorului”: aceleași comenzi prezente-fără-text ca nodurile ascunse, pe clase / id-uri
    numite (`Taskbar.TaskListButtonAutomationPeer`, `NotifyItemIcon`, `GridViewItem` din `PinnedList`, rândurile fără id
    din meniurile shell). Ar fi o schimbare de câteva rânduri în `_shell_nod`.

  Eu n-am ales (b): ar fi o extindere peste textul cererii.
- **Plasa shell din randare nu e încă exercitată.** Azi nicio lecție nu încarcă biblioteca, iar jucăria desenează toate
  suprafețele deodată, deci `_deschide_shell` n-a deschis niciun meniu. Va lucra abia când B-explorer pune
  `LHAplicatii.deschideSuprafata("meniu_nou" …)`. Gesturile shell (clic pe „Nou”, clic dreapta pe fișier) nu sunt în
  CONVENTIE §4 [NEVERIFICAT pe o bibliotecă reală].
- **Pozițiile pe părțile ancorate la dreapta.** Fereastra Explorer capturată are 1534×814, mai mare decât cadrul de 1366×768.
  Din cauza tăieturilor, lista, panoul și barele se măsoară față de colțul lor. Dar butoanele Minimizare / Maximizare /
  Închidere (în `fereastra`), „Previzualizare” (capătul din dreapta al `bara_comenzi`) și Detalii / Pictograme mari (în
  `bara_stare`) stau la dreapta părții lor. Într-o fereastră desenată mai îngustă, ele dau câte o diferență `pozitie`
  (1 punct fiecare). N-am inventat o regulă de ancorare (nu știu sigur cum se redimensionează fereastra reală).
  Office are aceeași limită pe bara de stare.
- **Simulatoarele vechi Explorer:** `bara_stare` lor (45 de randări) se compară acum cu bara de stare reală. Extractorul
  vechi nu citește nicio comandă în ea, așa că dă 21 de puncte (3 comenzi lipsă), nu 22 cu „suprafață lipsă”. Celelalte
  suprafețe shell nu au nicio randare: suprafață lipsă + 7 pe comandă, cât valul B-explorer nu le-a construit.
- **Dialogurile Explorer** rămân fără referință de structură. Le-ar putea folosi doar o comparație „doar butoanele, în
  ordine” din `scenarii_real/explorer_*.json`, cu titlul, întrebarea și butoanele. N-am scris-o: ar fi o comparație nouă,
  iar fără ea orice alt control desenat ar ieși „în plus” fals.
- **Potrivirea nodurilor ascunse e lacomă:** o comandă ascunsă „înghite” o comandă desenată rămasă de aceeași familie. Un
  rând în plus pe lângă un folder fixat ascuns poate trece neobservat. Rămâne `lipsa` dacă lipsește de tot și `pozitie`
  dacă e în alt loc; mutantul O3-14 arată ambele.
- **O3-02** (poziție greșită a lui Subscript în Word) rămâne neprins, ca la 17.11 și ca înainte de runda asta: nu e
  schimbarea mea. N-am căutat de ce.
- **`mutanti/rezultat.json`** e la zi. Bancul întreg (`mutanti.py --paralel 3`, 22:17-23:21, 3949 s, după măsurare și reînghețare, `acoperire_instrumente/banca_intreaga.log`) a dat **70/72**: O1 7/7, O2 9/9, O3 14/15, O4 7/8, O5 7/7, O6 6/6, O7 6/6, O8 8/8, O9 6/6. Neprinși sunt O3-02 și O4-04, aceiași ca la 17.11 (66/68 atunci). Niciun oracol nu e sub 5.
- O1, O7 și O8 folosesc și ele `structura_lib.py`. Nu se mișcă: măsurarea le dă aceleași numere, iar bancul întreg le
  prinde pe toate (7/7, 6/6, 8/8).
- Copia ieșirilor de pornire (`acoperire_instrumente/iesiri_inainte/`, ~2,7 MB, nu e în `.gitignore`) a rămas întreagă
  (O1-O9 + porți). Ștergerea părților care nu trebuie a fost refuzată de permisiuni. Pentru comparație contează doar `O3/`.
- Nimic comis, nimic împins.

## Diff-ul complet al oracolelor
`git -C C:/00/Projects/LearningHub_fidel diff -- _campaign/aplicatii_fidele_2026_11/oracole` + fișierul nou
`genereaza_jucarie.py` (același text în `acoperire_instrumente/diff_oracole.patch`). `_jucarie_shell/explorer-citire.js` nu e
pus aici: e generat (simulatorul vechi copiat + datele jucăriei), iar `genereaza_jucarie.py --verifica` = „la zi”.

```diff
diff --git a/_campaign/aplicatii_fidele_2026_11/oracole/CONVENTIE_ARBORE.md b/_campaign/aplicatii_fidele_2026_11/oracole/CONVENTIE_ARBORE.md
index 26a4ae2a..c7c3a72e 100644
--- a/_campaign/aplicatii_fidele_2026_11/oracole/CONVENTIE_ARBORE.md
+++ b/_campaign/aplicatii_fidele_2026_11/oracole/CONVENTIE_ARBORE.md
@@ -24,8 +24,22 @@ reale. O bibliotecă ce nu respectă convenția apare ca „suprafață lipsă
   doar fila activă trebuie să fie în DOM), `panglica_context.<Ctx_Id>` (ex. `panglica_context.Ctx_TableDesign`),
   `backstage.nav`, `backstage.<Pagina>` (ex. `backstage.Save As`), `meniu_contextual.<tinta>` (ex. `meniu_contextual.text`),
   `dialog.<idMso>` (ex. `dialog.FontDialog`; fila a doua a unui dialog: `dialog.FontDialog#Advanced`), `panou.<idMso>`.
-- Suprafețele aplicațiilor fără referință încă (Windows, Explorer, Paint): cheia = partea de după punct din `suprafete.json`
-  (ex. `meniu_start`, `panou_navigare`, `bara_instrumente`). Referința lor vine într-o rundă `acoperire`.
+- **Windows și File Explorer** (referința shell din 20.11.2026: `referinte/uia_windows.json`, `referinte/uia_explorer.json`,
+  citite de O3 prin `structura_lib.referinte_shell()`): cheia = cheia de randare din `structura_lib.SHELL_SUPRAFETE`.
+  - Explorer, fereastra pe PĂRȚI (suprafețe imbricate; o comandă aparține suprafeței celei mai apropiate): `fereastra`
+    (cadrul, cu bara de titlu: Sistem, Minimizare, Maximizare, Închidere) și în ea `file_fereastra`, `butoane_navigare`,
+    `bara_adresa`, `cautare`, `bara_comenzi`, `panou_navigare`, `zona_continut`, `panou_detalii`, `bara_stare`;
+    fiecare parte își măsoară pozițiile față de colțul ei.
+  - Explorer, meniurile: `meniu_nou`, `meniu_sortare`, `meniu_vizualizare` (cu submeniul „Afișați” deschis, ca în captură),
+    `meniu_fisier`, `meniu_fisier_clasic`, `meniu_fundal`. Windows: `bara_activitati`, `start`, `meniu_desktop`,
+    `meniu_desktop_clasic`. Un meniu din mai multe ferestre (lista + rândul de pictograme, meniul + submeniul) = O
+    suprafață, cu pozițiile față de colțul ei.
+  - Panoul de navigare: elementele arborelui (`TreeItem`) se marchează ca FRAȚI, în ordinea de pe ecran (copiii unei
+    comenzi nu se citesc, §3); nivelul se vede doar din poziție.
+  - Ce nu se vede la pornire (meniurile, Start) se citește prin plasa §4.6: gesturile shell nu sunt încă în §4.
+- Suprafețele fără referință încă (Paint; la Windows / Explorer cele fără captură: dialogurile Explorer, desktopul,
+  calendarul … — motivul fiecăreia în `oracol_ui.json › fara_referinta_motiv`): cheia = partea de după punct din
+  `suprafete.json` (ex. `bara_instrumente`). Referința lor vine într-o rundă `acoperire`.
 - Doar suprafețele VIZIBILE se citesc. Ce se deschide (Backstage, meniuri, dialoguri, file) se deschide prin GEST (§4).
 
 ## 3. Nodurile
@@ -89,6 +103,11 @@ Fiecare element de interfață din suprafață poartă:
   la final, fără sufixul de scurtătură `(Ctrl …)`, cratima neîntreruptibilă = `-`, spațiile strânse, fără `¶ ` în față.
   Potrivirea: întâi `id_mso` (când îl au ambele), apoi eticheta (textul vizibil întreg: un rând sau toate împreună);
   pe bara de stare se acceptă și numele fără valoare (`Page Number Page 1 of 1` ~ `Page 1 of 1`).
+- Referința shell (Windows / Explorer, 20.11.2026): AutomationId-ul e `id_mso` doar la comenzile cu id UNIC în suprafață;
+  un nod ascuns pentru date personale („[element personal ascuns]”, „[… ascuns]”, „[id ascuns]”, „[rețea ascunsă]”,
+  „[utilizator]”, „[cont]”) e o comandă PREZENTĂ, fără text: se potrivește cu orice comandă desenată rămasă nepotrivită,
+  de aceeași familie de tip (întâi între vecinii ei potriviți); nedesenată = `lipsa`. Restul regulilor convertorului
+  (ferestre, zgomot, tăieturi) stau în comentariul de la `structura_lib.referinte_shell`.
 - Diferențele: `lipsa` (în referință, nu în pagină), `in_plus` (în pagină, nu în referință), `ordine` (potrivite − cel mai
   lung subșir comun), `suprafata_lipsa` (= toate unitățile ei lipsă + 1), `eticheta` (același idMso, alt nume PE ECRAN —
   la O2 și la O3), `eticheta_declarata` (data-lh-eticheta ≠ textul de pe ecran — la O2 și la O3), `grup_fara_legenda`
diff --git a/_campaign/aplicatii_fidele_2026_11/oracole/oracol_ui.py b/_campaign/aplicatii_fidele_2026_11/oracole/oracol_ui.py
index a134ac93..07eef545 100644
--- a/_campaign/aplicatii_fidele_2026_11/oracole/oracol_ui.py
+++ b/_campaign/aplicatii_fidele_2026_11/oracole/oracol_ui.py
@@ -16,9 +16,15 @@ Numărul = PUNCTE, pe COMANDĂ (reparația f: o comandă deja greșită care dev
 a referinței are punctele = câte feluri de diferență are (`ordine`, `tip`, `eticheta`, `pozitie`, `eticheta_declarata`,
 cel mult 5), dar o comandă mutată în alt grup (`grupare`) are cel puțin 6, iar una LIPSĂ cel puțin 7 — deci
 „desenată greșit → în alt grup → lipsă” crește mereu. Restul (`in_plus`, felurile de grup și de suprafață) = 1 punct.
-În plus, din suprafete.json: fiecare suprafață FĂRĂ referință (Windows, File Explorer, Paint întregi; riglele, panourile
-etc. necapturate) = 1, și fiecare suprafață care NU există în aplicația reală (ex. tastele pentru telefon) = 1 (abatere
-de aprobat). Gata (R4a) = 0. Detalii: <iesiri>/oracol_ui.json."""
+Windows și File Explorer (runda `acoperire` pe instrumente, 20.11.2026): referinte/uia_windows.json și uia_explorer.json
+(formatul referinte/dump_shell_uia.py) se citesc prin structura_lib.referinte_shell(): fiecare captură legată de
+suprafete.json devine o suprafață de referință, cu cheia de randare din structura_lib.SHELL_SUPRAFETE (fereastra Explorer
+tăiată pe AutomationId în bara_comenzi, panou_navigare, zona_continut …), comparată la fel ca cele Office; nodurile ascunse
+pentru date personale sunt comenzi prezente, fără text.
+În plus, din suprafete.json: fiecare suprafață FĂRĂ referință (Paint întreg; riglele, panourile etc. necapturate;
+dialogurile Explorer, desktopul, calendarul … — motivul fiecăreia în fara_referinta_motiv) = 1, și fiecare suprafață care
+NU există în aplicația reală (ex. tastele pentru telefon) = 1 (abatere de aprobat). Gata (R4a) = 0.
+Detalii: <iesiri>/oracol_ui.json."""
 import sys
 from collections import Counter
 from pathlib import Path
@@ -51,12 +57,13 @@ def puncte(chei):
 
 def masoara():
     refs = L.referinte()
+    shell = L.referinte_shell()      # Windows / File Explorer: doar aici (O2, O7, O8 și randarea folosesc referinte())
     supr = L.suprafete()["aplicatii"]
     c = L.randare()
     toate = [i for r in c["pagini"].values() for i in r["instante"]]
     total, pe_fel, pe_suprafata, n_chei = 0, Counter(), {}, 0
-    for app in L.OFFICE:
-        ref = refs[app]
+    for app in L.OFFICE + list(L.SHELL):
+        ref = shell[app] if app in L.SHELL else refs[app]
         if not ref.canon:
             continue
         ii = [i for i in toate if i["aplicatie"] == app]
@@ -76,24 +83,34 @@ def masoara():
                                           "mostre": sorted(d)[:25]}
             total += pct
             n_chei += len(d)
-    fara, nereale = [], []
+    fara, nereale, motiv = [], [], {}
     for app in L.APLICATII:
-        ref = refs[app]
+        ref = shell[app] if app in L.SHELL else refs[app]
         for s in supr.get(app, {}).get("suprafete", []):
             if s.get("in_aplicatia_reala") is False:
                 nereale.append(s["id"])
             elif not L.referinta_suprafata(app, s["id"], ref):
                 fara.append(s["id"])
+                if app in L.SHELL:
+                    motiv[s["id"]] = ref.motiv_fara(s["id"])
     total += len(fara) + len(nereale)
     pe_fel["fara_referinta"] += len(fara)
     pe_fel["nu_exista_in_aplicatia_reala"] += len(nereale)
-    harta = {s["id"]: L.referinta_suprafata(a, s["id"], refs[a]) for a in L.APLICATII for s in supr.get(a, {}).get("suprafete", [])}
+    harta = {s["id"]: L.referinta_suprafata(a, s["id"], shell[a] if a in L.SHELL else refs[a])
+             for a in L.APLICATII for s in supr.get(a, {}).get("suprafete", [])}
+    ref_shell = {a: {"fisier": "referinte/" + L.SHELL_FISIER[a],
+                     "suprafete": {k: {"captura": r.surse[k][0], "regula": r.surse[k][1], "unitati": L.nr_unitati(r.canon[k]),
+                                       "ascunse": sum(1 for g in r.canon[k]["grupuri"] for u in g["u"] if u.get("ascuns"))}
+                                   for k in r.canon},
+                     "taieturi_negasite": r.taieturi_negasite, "capturi_necomparate": r.necomparate}
+                 for a, r in shell.items()}
     det = {"definitie": __doc__.split("\n\n", 1)[1], "toleranta_px": L.TOL_PX, "fereastra": L.VIEWPORT,
            "puncte": {"lipsa": P_LIPSA, "grupare": P_GRUPARE, "comanda_desenata": "1 pe fel, cel mult "
                       f"{len(FELURI_COMANDA_DESENATA)}", "restul": 1},
            "chei_de_diferenta": n_chei + len(fara) + len(nereale),
            "pe_suprafata": pe_suprafata, "pe_fel": dict(pe_fel.most_common()), "fara_referinta": fara,
-           "nu_exista_in_aplicatia_reala": nereale, "harta_suprafete_referinta": harta,
+           "fara_referinta_motiv": motiv, "nu_exista_in_aplicatia_reala": nereale, "harta_suprafete_referinta": harta,
+           "referinte_shell": ref_shell,
            "randare": {"generat": c.get("generat"), "secunde": c.get("secunde"), "instante": len(toate)}}
     linii = [f"suprafețe de referință comparate: {len(pe_suprafata)} (desenate în cel puțin o pagină: "
              f"{sum(1 for v in pe_suprafata.values() if v['randari'])}); din suprafete.json fără referință: {len(fara)}, "
diff --git a/_campaign/aplicatii_fidele_2026_11/oracole/structura_lib.py b/_campaign/aplicatii_fidele_2026_11/oracole/structura_lib.py
index 7412f28f..f408c980 100644
--- a/_campaign/aplicatii_fidele_2026_11/oracole/structura_lib.py
+++ b/_campaign/aplicatii_fidele_2026_11/oracole/structura_lib.py
@@ -15,7 +15,8 @@ Ce face:
   întâmplare: aceeași măsurare de două ori = același număr);
 - extrage arborele randat cu oracole/arbore_randat.js și îl compară cu referința reală după oracole/CONVENTIE_ARBORE.md;
 - ține randarea într-un cache (randare_<amprentă>.json) cheiat pe sha256 al fișierelor sitului + al extractorului + al
-  acestui modul: O1/O2/O3/O7/O8 rulate unul după altul randează o singură dată. Unde stă cache-ul: LH_IESIRI dacă e
+  acestui modul + al referințelor uia_*.json (Office; din 20.11.2026 și Windows / Explorer, ale căror suprafețe randarea le
+  deschide prin plasă): O1/O2/O3/O7/O8 rulate unul după altul randează o singură dată. Unde stă cache-ul: LH_IESIRI dacă e
   dat; altfel oracole/_iesiri/ (scutit de repere.lock) DOAR pe worktree; pe orice altă rădăcină (copiile din %TEMP%)
   în %TEMP%/lh_structura_cache/ — niciodată în dosarul lucrării. În cache și în <oracol>.json se scriu doar căi
   RELATIVE la rădăcina sitului (rădăcina însăși = „.”). LH_FARA_CACHE=1 = randare de la zero: se acceptă doar o
@@ -518,6 +519,302 @@ def referinte():
     return _CACHE["refs"]
 
 
+# ====================================================================== referințele shell (Windows / File Explorer)
+# Runda `acoperire` pe instrumente, 20.11.2026. referinte/uia_windows.json și uia_explorer.json sunt în formatul lui
+# referinte/dump_shell_uia.py: suprafata -> {ferestre: [{arbore, clasa, rect_ecran_100, …}]}, nodul {nume, tip, clasa,
+# id (AutomationId), rect [x, y, l, h] față de colțul ferestrei la 100% DPI, copii, in_afara_ecranului, dezactivat, …}.
+# Le citește DOAR O3, prin referinte_shell(): referinte() de mai sus (O2, O7, O8 și randarea) rămâne cum era, deci
+# Word / Excel / PowerPoint și celelalte oracole nu se mișcă. Regulile convertorului:
+#  - nodul shell -> nodul canonic al referinței: nume -> eticheta, tip -> tip, id -> id_mso (doar la comenzile cu id
+#    UNIC în suprafață: TextBox, UpButton, SystemTrayIcon, NotifyItemIcon se repetă și nu identifică nimic), rect ->
+#    rect_css fără nicio scalare (pixelii la 100% DPI = pixelii CSS ai cadrului 1366×768 cu care lucrează comparația;
+#    pozițiile se compară oricum față de colțul suprafeței, cu toleranța TOL_PX), copii -> copii;
+#  - o comandă fără dreptunghi sau marcată in_afara_ecranului nu se vede (= vizibil False în formatul Office);
+#    containerele se străbat mereu (meniul Explorer stă într-un „Pop-up” marcat în afara ecranului, cu comenzile pe ecran);
+#  - în meniurile clasice Win32 textul de după Tab e scurtătura („Anulare Copiere<Tab>Ctrl+Z”), nu numele: se taie;
+#  - tooltip-urile și ferestrele-zgomot (SysShadow, a doua bară de activități Shell_SecondaryTrayWnd = monitorul al doilea
+#    al profesorului; elevul are un singur ecran) se sar;
+#  - arborele panoului de navigare (TreeItem în TreeItem) se turtește în ordinea de pe ecran: o comandă cu nume e o
+#    unitate și copiii ei nu se citesc (CONVENTIE_ARBORE.md §3), deci altfel ar rămâne doar „Desktop”;
+#  - ASCUNSE: un nod cu nume (sau id) ascuns pentru date personale („[element personal ascuns]”, „[… ascuns]”,
+#    „[id ascuns]”, „[rețea ascunsă]”, „[utilizator]”, „[cont]” …) sau sărit ca cont („ascuns”: „cont … sărit”) NU se
+#    compară ca etichetă: e o comandă PREZENTĂ, fără text — se potrivește cu orice comandă desenată rămasă nepotrivită,
+#    de aceeași familie de tip, de preferință între vecinii ei deja potriviți (aliniaza). Nepotrivită = lipsă, ca oricare;
+#  - o captură cu mai multe ferestre (meniul + submeniul, lista + rândul de pictograme) = un nod rădăcină „Pane” cu
+#    ferestrele drept copii, în ordinea de pe ecran (sus-jos, stânga-dreapta), fiecare mutată cu colțul ei față de colțul
+#    reuniunii; un „Pop-up” citit de două ori (o dată ca fereastră proprie, o dată în gazda altei ferestre: aceleași
+#    comenzi, în același loc pe ecran) se numără o singură dată, în prima fereastră;
+#  - fereastra Explorer se TAIE pe AutomationId în suprafețele din suprafete.json (SHELL_SUPRAFETE): fiecare parte își
+#    are colțul ei (o fereastră desenată mai îngustă nu mută lista sau bara de stare față de colțul lor).
+SHELL = ("windows", "explorer")
+SHELL_FISIER = {"windows": "uia_windows.json", "explorer": "uia_explorer.json"}
+SHELL_ASCUNS_RE = re.compile(r"\[(?:[^\[\]]*ascuns[ăa]?|utilizator|calculator|cont|nume|SID|email|telefon)\]", re.I)
+SHELL_ETICHETA_ASCUNSA = "[ascuns]"
+SHELL_ZGOMOT_CLASE = {"SysShadow", "tooltips_class32", "Shell_SecondaryTrayWnd"}
+SHELL_ZGOMOT_TIP = {"ToolTip"}
+SURSA_SHELL = "referinte/%s › %s (UI Automation pe Windows-ul profesorului, sesiunea din 20.11.2026)"
+# cheia de randare (data-lh-suprafata) -> (cheia capturii din referință, regula): None = toată captura; ("tăiat", id-uri)
+# = nodurile cu acele AutomationId, scoase din captură; "rest" = ce rămâne din captură după toate tăieturile ei
+SHELL_SUPRAFETE = {
+    "explorer": {
+        "fereastra": ("explorer_fereastra", "rest"),
+        "file_fereastra": ("explorer_fereastra", ("TabView",)),
+        "butoane_navigare": ("explorer_fereastra", ("NavigationCommands",)),
+        "bara_adresa": ("explorer_fereastra", ("PART_AutoSuggestBox", "FirstCrumbStackPanel", "PART_BreadcrumbBar")),
+        "cautare": ("explorer_fereastra", ("FileExplorerSearchBox",)),
+        "bara_comenzi": ("explorer_fereastra", ("FileExplorerCommandBar", "FileExplorerSecondaryCommandBar")),
+        "panou_navigare": ("explorer_fereastra", ("ProperTreeHost",)),
+        "zona_continut": ("explorer_fereastra", ("listview",)),
+        "panou_detalii": ("explorer_fereastra", ("PreviewThumbnailInner", "RPaneCoverSheet_NoSel")),
+        "bara_stare": ("explorer_fereastra", ("StatusBarModuleInner",)),
+        "meniu_nou": ("explorer_meniu_nou", None),
+        "meniu_sortare": ("explorer_meniu_sortare", None),
+        "meniu_vizualizare": ("explorer_meniu_vizualizare", None),
+        "meniu_fisier": ("explorer_meniu_fisier", None),
+        "meniu_fisier_clasic": ("explorer_meniu_fisier_clasic", None),
+        "meniu_fundal": ("explorer_meniu_fundal", None),
+    },
+    "windows": {
+        "bara_activitati": ("bara_activitati", None),
+        "start": ("start", None),
+        "meniu_desktop": ("meniu_desktop", None),
+        "meniu_desktop_clasic": ("meniu_desktop_clasic", None),
+    },
+}
+# suprafete.json -> cheile de randare care o acoperă (o legătură forțată e mai rea decât una lipsă: ce nu e aici rămâne
+# fara_referinta, cu motivul din SHELL_FARA_MOTIV)
+SHELL_LEGATURI = {
+    "explorer.fereastra": ["fereastra"], "explorer.file_fereastra": ["file_fereastra"],
+    "explorer.butoane_navigare": ["butoane_navigare"], "explorer.bara_adresa": ["bara_adresa"],
+    "explorer.cautare": ["cautare"], "explorer.bara_comenzi": ["bara_comenzi"],
+    "explorer.panou_navigare": ["panou_navigare"], "explorer.zona_continut": ["zona_continut"],
+    "explorer.panou_detalii": ["panou_detalii"], "explorer.bara_stare": ["bara_stare"],
+    "explorer.meniu_nou": ["meniu_nou"], "explorer.meniu_sortare_vizualizare": ["meniu_sortare", "meniu_vizualizare"],
+    "explorer.meniu_clic_dreapta": ["meniu_fisier", "meniu_fisier_clasic", "meniu_fundal"],
+    "windows.bara_activitati": ["bara_activitati"], "windows.zona_notificare": ["bara_activitati"],
+    "windows.meniu_start": ["start"], "windows.meniu_clic_dreapta": ["meniu_desktop", "meniu_desktop_clasic"],
+}
+# legătura cere ca suprafața de randare să conțină o comandă (ca „zoom” -> bara_stare la Office)
+SHELL_CONDITII = {"windows.zona_notificare": ("bara_activitati", r"^ceas\b")}
+SHELL_FARA_MOTIV = {
+    "explorer.redenumire": "caseta de redenumire pe loc (F2) nu e în nicio captură UI Automation; observat_vizual spune "
+                           "doar ce se colorează (fără „.docx”) — e comportament (O4), nu structură",
+    "explorer.dialog.*": "dialogurile au doar titlul, întrebarea și butoanele, în referinte/scenarii_real/explorer_*.json "
+                         "(verdictul O4), fără arbore UI Automation (tipuri, poziții, celelalte controale); O3 le-ar putea "
+                         "compara doar ca listă de butoane în ordine, iar orice alt control desenat ar ieși „în plus” fals "
+                         "— nu le inventez structura",
+    "windows.alimentare": "doar butonul „Alimentare” e capturat (în start, comparat acolo); meniul Oprire / Repornire nu",
+    "windows.cautare": "doar butonul „Căutare” (bara_activitati) și caseta din Start sunt capturate (comparate acolo); "
+                       "panoul de căutare cu rezultatele nu",
+    "windows.calendar": "calendarul de la ceas nu e capturat (doar butonul „Ceas” din bara_activitati)",
+    "windows.desktop": "desktopul (pictogramele, fundalul) nu e capturat; doar meniul lui de clic dreapta",
+    "windows.fereastra": "nicio fereastră generică nu e capturată; bara de titlu a Explorer-ului (explorer.fereastra) e a "
+                         "altei aplicații",
+    "windows.securitate_windows": "aplicația Securitate Windows nu e capturată",
+}
+SHELL_NECOMPARATE = {
+    "explorer": {"explorer_proprietati": "fereastra Proprietăți nu e o suprafață din suprafete.json (martor pentru "
+                                         "proprietati_fisier); comparată, ar adăuga un dialog pe care nicio lecție nu-l cere",
+                 "proprietati_fisier": "proba Etapei 0 (desktopul ascuns), alt format (file pe filele dialogului); "
+                                       "același dialog ca explorer_proprietati"},
+    "windows": {"start_toate": "aceeași suprafață ca start, derulată în jos (sesiune_windows_10min.md); O3 compară Start "
+                               "așa cum se deschide"},
+}
+
+
+def _shell_nod(n, dx, dy):
+    """nodul shell -> listă de noduri canonice ale referinței (formatul Office; TreeItem-urile copii urcă lângă părinte)."""
+    if not isinstance(n, dict) or n.get("taiat") or n.get("eroare") or n.get("tip") in SHELL_ZGOMOT_TIP:
+        return []
+    nume = str(n.get("nume") or "")
+    if "\t" in nume:                    # meniul clasic Win32: după Tab vine scurtătura („Anulare Copiere\tCtrl+Z”)
+        nume = nume.split("\t")[0].rstrip()
+    ascuns = bool(n.get("ascuns")) or bool(SHELL_ASCUNS_RE.search(nume))
+    r = n.get("rect")
+    rc = [r[0] + dx, r[1] + dy, r[2], r[3]] if isinstance(r, list) and len(r) == 4 else None
+    o = {"tip": n.get("tip"), "eticheta": SHELL_ETICHETA_ASCUNSA if ascuns else nume, "rect_css": rc, "copii": []}
+    if ascuns:
+        o["ascuns_shell"] = True
+    aid = n.get("id")
+    if aid and not SHELL_ASCUNS_RE.search(str(aid)):
+        o["id_mso"] = str(aid)
+    if n.get("clasa"):
+        o["clasa"] = n["clasa"]
+    if n.get("dezactivat"):
+        o["activ"] = False
+    if o["tip"] in TIPURI_UNITATE and (nume or ascuns) and not n.get("ascuns") \
+            and (rc is None or n.get("in_afara_ecranului")):
+        o["vizibil"] = False            # (un cont SĂRIT de dump n-are dreptunghi, dar era pe ecran: rămâne prezent)
+    sub = []
+    for c in n.get("copii") or []:
+        for k in _shell_nod(c, dx, dy):
+            (sub if o["tip"] == "TreeItem" and k.get("tip") == "TreeItem" else o["copii"]).append(k)
+    return [o] + sub
+
+
+def _shell_unitati(n):
+    us = []
+    _turteste(n, us)
+    return us
+
+
+def _shell_ferestre(sup):
+    """ferestrele unei capturi -> un singur nod canonic (o fereastră: rădăcina ei; mai multe: „Pane” cu ele drept copii)."""
+    fs = [f for f in sup.get("ferestre") or [] if f.get("arbore") and f.get("clasa") not in SHELL_ZGOMOT_CLASE]
+    if not fs:
+        return None
+    fs.sort(key=lambda f: ((f.get("rect_ecran_100") or [0, 0])[1], (f.get("rect_ecran_100") or [0, 0])[0]))
+    x0 = min((f.get("rect_ecran_100") or [0, 0])[0] for f in fs)
+    y0 = min((f.get("rect_ecran_100") or [0, 0])[1] for f in fs)
+    radacini, vazute = [], {}
+
+    def deja(u):
+        """aceeași comandă (tip, nume) în același loc pe ecran (±2 px: rotunjirea la scara 125%) într-o fereastră citită"""
+        r = u.get("rect_css")
+        for q in vazute.get((u.get("tip"), u.get("eticheta")), []):
+            if (r is None and q is None) or (r and q and all(abs(a - b) <= 2 for a, b in zip(r, q))):
+                return True
+        return False
+
+    def fara_dubluri(n):
+        pastrate = []
+        for c in n.get("copii") or []:
+            us = _shell_unitati(c) if c.get("tip") == "Window" else []
+            if us and all(deja(u) for u in us):
+                continue                    # același Pop-up, citit deja în altă fereastră
+            pastrate.append(fara_dubluri(c))
+        n["copii"] = pastrate
+        return n
+    for f in fs:
+        r = f.get("rect_ecran_100") or [0, 0, 0, 0]
+        k = _shell_nod(f["arbore"], r[0] - x0, r[1] - y0)
+        if not k:
+            continue
+        rad = fara_dubluri(k[0]) if radacini else k[0]
+        radacini.append(rad)
+        for u in _shell_unitati(rad):
+            vazute.setdefault((u.get("tip"), u.get("eticheta")), []).append(u.get("rect_css"))
+    if len(radacini) == 1:
+        return radacini[0]
+    w = max((f.get("rect_ecran_100") or [0, 0, 0, 0])[0] + (f.get("rect_ecran_100") or [0, 0, 0, 0])[2] for f in fs) - x0
+    h = max((f.get("rect_ecran_100") or [0, 0, 0, 0])[1] + (f.get("rect_ecran_100") or [0, 0, 0, 0])[3] for f in fs) - y0
+    return {"tip": "Pane", "eticheta": "", "rect_css": [0, 0, w, h], "copii": radacini}
+
+
+def _shell_taie(n, ids, gasite):
+    """scoate din arborele n nodurile cu AutomationId în ids (le pune în gasite, în ordinea arborelui)."""
+    pastrate = []
+    for c in n.get("copii") or []:
+        if c.get("id_mso") in ids and c.get("id_mso") not in gasite:
+            gasite[c["id_mso"]] = c
+        else:
+            pastrate.append(_shell_taie(c, ids, gasite))
+    n["copii"] = pastrate
+    return n
+
+
+def _shell_radacina(noduri):
+    if len(noduri) == 1:
+        return noduri[0]
+    rs = [x["rect_css"] for x in noduri if x.get("rect_css")]
+    rr = None
+    if rs:
+        x0, y0 = min(r[0] for r in rs), min(r[1] for r in rs)
+        rr = [x0, y0, max(r[0] + r[2] for r in rs) - x0, max(r[1] + r[3] for r in rs) - y0]
+    return {"tip": "Pane", "eticheta": "", "rect_css": rr, "copii": list(noduri)}
+
+
+def canon_shell(root):
+    """forma canonică a unei suprafețe shell (ca o suprafață Office fără grupuri: un grup implicit cu unitățile turtite);
+    id-ul rămâne doar la comenzile cu id unic în suprafață; o comandă ascunsă intră fără text (et „”, ascuns=True)."""
+    us = _shell_unitati(root)
+    nr = {}
+    for x in us:
+        if x.get("id_mso"):
+            nr[x["id_mso"]] = nr.get(x["id_mso"], 0) + 1
+    out = []
+    for x in us:
+        if x.get("id_mso") and nr[x["id_mso"]] > 1:
+            x = dict(x)
+            x.pop("id_mso")
+        u = _unit(x)
+        if x.get("ascuns_shell"):
+            u.update(et="", cand=[], id=None, ascuns=True)
+        out.append(u)
+    rr = root.get("rect_css")
+    return {"rect": rr, "grupuri": [{"g": "", "raw": "", "cand": [""], "rect": rr, "u": out}]}
+
+
+class ReferintaShell:
+    """Referința unei aplicații shell pentru O3: canon = {cheia de randare: forma canonică}; surse = {cheie: (captura,
+    regula)}; leaga(id din suprafete.json) -> cheile de randare."""
+
+    def __init__(self, app):
+        self.app = app
+        self.canon, self.surse, self.taieturi_negasite = {}, {}, {}
+        self.necomparate = dict(SHELL_NECOMPARATE.get(app, {}))
+        p = D / "referinte" / SHELL_FISIER.get(app, "")
+        self.bruta = citeste_json(p) if app in SHELL_FISIER and p.exists() else None
+        if not self.bruta:
+            return
+        S = self.bruta.get("suprafete") or {}
+        regulile = SHELL_SUPRAFETE.get(app, {})
+        for cap in dict.fromkeys(v[0] for v in regulile.values()):
+            if cap not in S:
+                continue
+            chei = {k: r for k, (c, r) in regulile.items() if c == cap}
+            ids = set().union(*[set(r) for r in chei.values() if isinstance(r, tuple)])
+            if not ids:
+                for k in chei:
+                    rad = _shell_ferestre(S[cap])
+                    if rad is not None:
+                        self.canon[k] = canon_shell(rad)
+                        self.surse[k] = (cap, "toată captura")
+                continue
+            rad = _shell_ferestre(S[cap])
+            if rad is None:
+                continue
+            gasite = {}
+            rad = _shell_taie(rad, ids, gasite)
+            for k, r in chei.items():
+                if r == "rest":
+                    self.canon[k] = canon_shell(rad)
+                    self.surse[k] = (cap, "restul ferestrei după tăieturi: cadrul cu bara de titlu")
+                elif isinstance(r, tuple):
+                    noduri = [gasite[i] for i in gasite if i in r]
+                    lipsa = [i for i in r if i not in gasite]
+                    if lipsa:
+                        self.taieturi_negasite[k] = lipsa
+                    if noduri:
+                        self.canon[k] = canon_shell(_shell_radacina(noduri))
+                        self.surse[k] = (cap, "tăiat pe AutomationId: " + ", ".join(r))
+
+    def leaga(self, sid):
+        chei = [k for k in SHELL_LEGATURI.get(sid, []) if k in self.canon]
+        cond = SHELL_CONDITII.get(sid)
+        if chei and cond:
+            c = self.canon.get(cond[0])
+            if not (c and any(re.search(cond[1], u["et"]) for g in c["grupuri"] for u in g["u"])):
+                return []
+        return chei
+
+    def motiv_fara(self, sid):
+        if sid in SHELL_FARA_MOTIV:
+            return SHELL_FARA_MOTIV[sid]
+        if sid.startswith(self.app + ".dialog."):
+            return SHELL_FARA_MOTIV.get(self.app + ".dialog.*", "")
+        if sid in SHELL_LEGATURI:
+            return "captura legată lipsește din referinte/" + SHELL_FISIER.get(self.app, "")
+        return "nicio captură UI Automation pentru ea în referinte/" + SHELL_FISIER.get(self.app, "")
+
+
+def referinte_shell():
+    """{app: ReferintaShell} pentru Windows și File Explorer — doar O3 (oracol_ui.py) le folosește."""
+    if "refs_shell" not in _CACHE:
+        _CACHE["refs_shell"] = {a: ReferintaShell(a) for a in SHELL}
+    return _CACHE["refs_shell"]
+
+
 # ====================================================================== comparația
 def _lis_indici(seq):
     """indicii (în seq) ai unui cel mai lung subșir strict crescător."""
@@ -570,6 +867,19 @@ def aliniaza(R, X, lax=False):
                 used.add(xi)
                 pr[ri] = xi
                 break
+    # referințele shell (canon_shell): o comandă ASCUNSĂ pentru date personale e prezentă, fără text — ia o comandă
+    # desenată rămasă nepotrivită, de aceeași familie de tip, întâi dintre vecinii ei deja potriviți (ordinea rămâne).
+    # Unitățile Office și cele randate nu au „ascuns”: pentru ele bucla nu face nimic.
+    for ri, r in enumerate(R):
+        if ri in pr or not r.get("ascuns"):
+            continue
+        lo = max((xi for k, xi in pr.items() if k < ri), default=-1)
+        hi = min((xi for k, xi in pr.items() if k > ri), default=len(X))
+        libere = [xi for xi in range(len(X)) if xi not in used and tip_compatibil(r.get("tip"), X[xi].get("tip"))]
+        alese = [xi for xi in libere if lo < xi < hi] or libere
+        if alese:
+            used.add(alese[0])
+            pr[ri] = alese[0]
     pairs = sorted(pr.items())
     keep = _lis_indici([xi for _, xi in pairs])
     dez = [pairs[k] for k in range(len(pairs)) if k not in keep]
@@ -697,7 +1007,10 @@ CONTEXT_TAB = {"TabPictureToolsFormat": "Ctx_PictureFormat", "TabTableToolsDesig
 
 
 def referinta_suprafata(app, sid, ref):
-    """Suprafața din suprafete.json -> cheile de referință care o acoperă ([] = fără referință = 1 diferență la O3)."""
+    """Suprafața din suprafete.json -> cheile de referință care o acoperă ([] = fără referință = 1 diferență la O3).
+    Windows / File Explorer: ref = ReferintaShell (referinte_shell), legăturile din SHELL_LEGATURI."""
+    if isinstance(ref, ReferintaShell):
+        return ref.leaga(sid)
     if not ref or not ref.canon:
         return []
     rest = sid[len(app) + 1:]
@@ -1323,7 +1636,7 @@ def amprenta_site():
             pass
     for p in (JS_EXTRACTOR, Path(__file__), D / "inventar.json"):
         h.update(p.read_bytes())
-    for a in OFFICE:
+    for a in OFFICE + list(SHELL):      # shell (20.11.2026): randarea deschide și suprafețele lor (_deschide_shell)
         q = D / "referinte" / f"uia_{a}.json"
         if q.exists():
             h.update(hashlib.sha256(q.read_bytes()).digest())
@@ -1494,6 +1807,11 @@ def _randeaza_pagina(pg, base, task, js):
                 t1 = time.time()
                 _deschide_restul(pg, js, inst, o, ref, sup, rez, mergi, extrage)
                 ceas("dialoguri_backstage_meniuri", t1)
+            elif app not in dialog_facut and app in SHELL:
+                dialog_facut.add(app)
+                t1 = time.time()
+                if _deschide_shell(pg, js, inst, o, sup, rez, mergi, extrage):
+                    ceas("dialoguri_backstage_meniuri", t1)
         ir["suprafete"] = _canon_inst(app, sup)
         rez["instante"].append(ir)
         # O8: comenzile citate în pagină, apăsate pe rând, pe primul exercițiu complet al fiecărui simulator
@@ -1622,6 +1940,33 @@ def _deschide_restul(pg, js, inst, o, ref, sup, rez, mergi, extrage):
                 rez["erori"].append(f"{inst['id']} deschideSuprafata {k}: {str(e).splitlines()[0][:100]}")
 
 
+def _deschide_shell(pg, js, inst, o, sup, rez, mergi, extrage):
+    """Windows / File Explorer (runda `acoperire` pe instrumente, 20.11.2026): suprafețele referinței shell care nu se văd
+    la pornire (meniurile Nou / Sortați / Vizualizați, clic dreapta, Start) se deschid doar prin plasa
+    LHAplicatii.deschideSuprafata(<cheie>) (CONVENTIE_ARBORE.md §4.6): gesturile lor nu sunt încă în convenție. Fără
+    plasă (situl de azi: nicio lecție nu încarcă biblioteca) nu face nimic. → True dacă plasa există."""
+    try:
+        are = pg.evaluate("() => !!(window.LHAplicatii && typeof window.LHAplicatii.deschideSuprafata === 'function')")
+    except Exception:
+        are = False
+    if not are:
+        return False
+    for k in referinte_shell()[inst["aplicatie"]].canon:
+        if k in sup:
+            continue
+        try:
+            mergi(inst["nav"])
+            if pg.evaluate("k => __LHO.deschideSuprafata(k)", k):
+                pg.wait_for_timeout(150)
+                pg.evaluate(js)
+                v = extrage(o)["suprafete"].get(k)
+                if v:
+                    sup[k] = v
+        except Exception as e:
+            rez["erori"].append(f"{inst['id']} deschideSuprafata {k}: {str(e).splitlines()[0][:100]}")
+    return True
+
+
 # Reparația 7b (R12, prima frază): o comandă CITATĂ de lecție care, apăsată, dă DOAR mesajul „aici nu e simulată” e
 # MOARTĂ. Biblioteca marchează un asemenea mesaj cu atributul data-lh-nesimulat (api_biblioteca.md §3); simulatoarele
 # vechi îl scriu ca text — tiparele de mai jos sunt cele găsite în lectii/_sim/*.js și jocuri/_motor/*.js (16-17.11.2026),
diff --git a/_campaign/aplicatii_fidele_2026_11/oracole/_jucarie_shell/genereaza_jucarie.py b/_campaign/aplicatii_fidele_2026_11/oracole/_jucarie_shell/genereaza_jucarie.py
new file mode 100644
index 00000000..50ffbf09
--- /dev/null
+++ b/_campaign/aplicatii_fidele_2026_11/oracole/_jucarie_shell/genereaza_jucarie.py
@@ -0,0 +1,125 @@
+# -*- coding: utf-8 -*-
+"""Jucăria shell a bancului de mutanți pentru O3 (runda `acoperire` pe instrumente, 20.11.2026).
+
+    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/oracole/_jucarie_shell/genereaza_jucarie.py
+    python .../genereaza_jucarie.py --verifica     # doar spune dacă fișierul scris e la zi (cod 0 = da, 1 = nu)
+
+Ce scrie: oracole/_jucarie_shell/explorer-citire.js = simulatorul vechi lectii/_sim/explorer-citire.js al sitului (copiat
+întocmai, ca lecția V/M2-L09 să meargă) + la coadă un File Explorer desenat după CONVENTIE_ARBORE.md din referința
+shell (structura_lib.referinte_shell()["explorer"]): o rădăcină [data-lh-aplicatie="explorer"] ÎNREGISTRATĂ (LH.aplicatii
+.radacini(), plus un <script> nefolosit cu src „…/aplicatii/aplicatii.js”, cum cere arbore_randat.js), câte un
+[data-lh-suprafata] pe fiecare cheie de randare (fereastra, bara_comenzi, panou_navigare, meniu_nou …), iar în fiecare
+suprafață comenzile ei, cu data-lh-tip / data-lh-eticheta / data-lh-id-mso și textul pe ecran, în locul din referință
+(față de colțul suprafeței). Comenzile ascunse pentru date personale primesc un nume oarecare („Folderul meu N”), ca la
+un constructor care pune conținutul lui: O3 trebuie să le ia drept prezente.
+Folosire: banca.json › pregatiri › „jucarie_explorer” o copiază PESTE lectii/_sim/explorer-citire.js în copia din %TEMP%
+a sitului (niciodată în worktree); mutanții O3-12…O3-14 strică apoi câte un rând din datele jucăriei.
+Regenerare: după orice schimbare a referinței Explorer, a convertorului shell sau a simulatorului vechi (--verifica spune
+dacă e cazul). Fiecare comandă stă pe rândul ei, ca textul „din” al unui mutant să apară o singură dată."""
+import argparse
+import json
+import sys
+from pathlib import Path
+
+AICI = Path(__file__).resolve().parent
+sys.path.insert(0, str(AICI.parent))
+import structura_lib as L  # noqa: E402
+
+SIM = "lectii/_sim/explorer-citire.js"
+IESIRE = AICI / "explorer-citire.js"
+SEMN = "/* ===== JUCĂRIA SHELL a bancului de mutanți (O3) — oracole/_jucarie_shell/genereaza_jucarie.py ===== */"
+
+
+def date_jucarie():
+    ref = L.referinte_shell()["explorer"]
+    out = {}
+    nr_ascuns = 0
+    for k, c in ref.canon.items():
+        rr = c["rect"] or [0, 0, 400, 300]
+        rand = []
+        for g in c["grupuri"]:
+            for u in g["u"]:
+                r = u["rect"] or [rr[0], rr[1], 10, 10]
+                et = u["raw"]
+                if u.get("ascuns"):
+                    nr_ascuns += 1
+                    et = "Folderul meu %d" % nr_ascuns
+                rand.append([u["tip"], et, u["id"], r[0] - rr[0], r[1] - rr[1], r[2], r[3]])
+        out[k] = {"r": [rr[2], rr[3]], "u": rand}
+    return out
+
+
+def text_jucarie():
+    d = date_jucarie()
+    linii = [SEMN, "(function () {", "  var DATE = {"]
+    chei = list(d)
+    for i, k in enumerate(chei):
+        linii.append("    %s: {r: %s, u: [" % (json.dumps(k), json.dumps(d[k]["r"])))
+        for u in d[k]["u"]:
+            linii.append("      " + json.dumps(u, ensure_ascii=False) + ",")
+        linii.append("    ]}" + ("," if i < len(chei) - 1 else ""))
+    linii += [
+        "  };",
+        "  function pune() {",
+        "    if (document.getElementById('lh-jucarie-shell')) return;",
+        "    var R = document.createElement('div');",
+        "    R.id = 'lh-jucarie-shell';",
+        "    R.setAttribute('data-lh-aplicatie', 'explorer');",
+        "    R.style.cssText = 'position:absolute;left:0;top:0;width:1600px;z-index:99999;background:#fff;color:#000;"
+        "font:9px sans-serif;';",
+        "    var y = 0;",
+        "    Object.keys(DATE).forEach(function (k) {",
+        "      var s = DATE[k], S = document.createElement('div');",
+        "      S.setAttribute('data-lh-suprafata', k);",
+        "      S.setAttribute('data-lh-tip', 'Pane');",
+        "      S.style.cssText = 'position:absolute;left:0;top:' + y + 'px;width:' + s.r[0] + 'px;height:' + s.r[1] + 'px;';",
+        "      s.u.forEach(function (u) {",
+        "        var e = document.createElement('div');",
+        "        e.setAttribute('data-lh-tip', u[0]);",
+        "        e.setAttribute('data-lh-eticheta', u[1]);",
+        "        if (u[2]) e.setAttribute('data-lh-id-mso', u[2]);",
+        "        e.textContent = u[1];",
+        "        e.style.cssText = 'position:absolute;left:' + u[3] + 'px;top:' + u[4] + 'px;width:' + u[5] + 'px;height:' + "
+        "u[6] + 'px;white-space:nowrap;';",
+        "        S.appendChild(e);",
+        "      });",
+        "      R.appendChild(S);",
+        "      y += s.r[1] + 12;",
+        "    });",
+        "    R.style.height = y + 'px';",
+        "    document.body.appendChild(R);",
+        "    var sc = document.createElement('script');",
+        "    sc.type = 'text/x-lh-jucarie';",
+        "    sc.src = '/__lh_jucarie__/aplicatii/aplicatii.js';",
+        "    document.head.appendChild(sc);",
+        "    window.LH = window.LH || {};",
+        "    if (!window.LH.aplicatii) window.LH.aplicatii = {};",
+        "    window.LH.aplicatii.radacini = function () { return [R]; };",
+        "  }",
+        "  if (document.body) pune(); else document.addEventListener('DOMContentLoaded', pune);",
+        "})();",
+        ""]
+    return "\n".join(linii)
+
+
+def continut():
+    sim = (L.WT_IMPLICIT / SIM).read_text(encoding="utf-8")
+    return sim.rstrip("\n") + "\n\n" + text_jucarie()
+
+
+def main():
+    ap = argparse.ArgumentParser(description="Jucăria shell (File Explorer după referință) pentru bancul de mutanți O3.")
+    ap.add_argument("--verifica", action="store_true")
+    a = ap.parse_args()
+    nou = continut()
+    if a.verifica:
+        la_zi = IESIRE.exists() and IESIRE.read_text(encoding="utf-8") == nou
+        print("jucăria shell: " + ("la zi" if la_zi else "DE REGENERAT"))
+        sys.exit(0 if la_zi else 1)
+    IESIRE.write_text(nou, encoding="utf-8", newline="\n")
+    d = date_jucarie()
+    print("scris %s: %d suprafețe, %d comenzi" % (IESIRE.name, len(d), sum(len(v["u"]) for v in d.values())))
+
+
+if __name__ == "__main__":
+    main()
```

INSTRUMENTE_REPARATE
