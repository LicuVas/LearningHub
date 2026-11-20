# Supliment la promptul rundei 15 (prima rundă de construcție a valului B-explorer) — scris de orchestrator, 20.11.2026

Se citește DUPĂ `runde/15/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli). Citește ÎNTÂI
`runde/_paralel/CICLU_PARALEL.md`: runda ta merge în paralel cu Word (r16), Excel (r17) și Windows (r18). Regulile de acolo bat
pașii 1 și 7 din prompt:
- fișiere proprii / comune;
- fără git care scrie;
- fără `masoara.py` întreg;
- `LH_IESIRE`.

## Unde suntem
- **Referințele reale există din seara asta.** Sesiunea de pe Windows-ul profesorului (`referinte/sesiune_windows_10min.md` › „Rularea din 20.11.2026”) a capturat:
  - în `referinte/uia_explorer.json`: `explorer_fereastra` (+ `observat_vizual`), `explorer_meniu_nou`, `explorer_meniu_sortare`, `explorer_meniu_vizualizare`, `explorer_meniu_fisier`, `explorer_meniu_fisier_clasic`, `explorer_meniu_fundal`, `explorer_proprietati`, `proprietati_fisier`;
  - formatul e cel shell al lui `referinte/dump_shell_uia.py`;
  - nodurile cu date personale sunt deja ascunse („[element personal ascuns]” …).
- **Oracolul O3 le citește** din runda `acoperire` pe instrumente (`runde/15/acoperire_instrumente.md`; citește întâi „Ce am schimbat și de ce”). Acolo afli:
  - ce suprafețe `explorer.*` din `suprafete.json` sunt legate de ce cheie și ce rămâne `fara_referinta`;
  - cum deschide randarea suprafețele Explorer (plasa `deschideSuprafata`, `_deschide_restul`). Ce nu deschizi prin plasă, O3 numără „suprafață lipsă”.
- **Comportamentul real** stă în 18 scenarii: `referinte/scenarii_real/explorer_*.json` + `scenarii/explorer/*.json`:
  - Folder nou;
  - copiere în același folder / copia copiei;
  - lipire cu conflict (Înlocuire / Omitere);
  - redenumire (nume existent, extensia păstrată sau scoasă);
  - ștergere în Coș sau definitivă (Da / Nu);
  - restaurare din Coș;
  - sortare după nume;
  - controlul de citire.
- **Starea** e în api §5 explorer: `nume_fisiere`, `ordine_afisata`, `in_cos`, `continut_fisiere`, `dialog` `{titlu, intrebare, butoane, apasat}`, `cale_curenta`, `selectie`.
- **Pornirea măsurată:** `runde/15/masurare_pornire.json` (= măsurarea de la finalul acoperirii pe instrumente). Unghiul rundei: `aspect`.
- **Valul are maximum 6 rânduri în jurnal.** Acoperirea pe instrumente e primul, deci runda ta e al doilea.

## Ținta rundei 15 = aplicația File Explorer în bibliotecă
1. **Interfața se GENEREAZĂ din date**, ca la Word / Excel / PowerPoint:
   - `aplicatii/_unelte/genereaza_explorer.py` citește `D/referinte/uia_explorer.json` (doar citire, prin Python, pe chei) și scrie `aplicatii/date/explorer.json`;
   - conține: bara de titlu cu filele, butoanele de navigare, bara de adrese, căutarea, bara de comenzi (Nou, Decupare / Copiere / Lipire / Redenumire / Partajare / Ștergere, Sortați, Vizualizați, …), panoul de navigare, zona de conținut cu antetele coloanelor, bara de stare, meniurile Nou / Sortați / Vizualizați / clic dreapta pe fișier și pe fundal (meniul nou + „Afișați mai multe opțiuni” → cel clasic), fereastra Proprietăți;
   - nicio etichetă scrisă de mână: ce lipsește din referință rămâne lipsă și se notează (`R15-…` în `de_verificat.md`);
   - etichetele sunt în ROMÂNĂ, ca pe Windows-ul profesorului (referința e în română).
2. **Fișierele proprii:**
   - `aplicatii/explorer.js` (comportamentul);
   - profilul `aplicatii/profiluri/explorer_windows11.json` (§2: `"explorer": "explorer_windows11"` în `setari.json`; `setari.json` e comun, deci un rând, cu Edit);
   - iconițele doar din setul Fluent deja folosit (`aplicatii/date/LICENSE-fluent-icons.txt`), nicio captură Microsoft (I7).
3. **Comportamentul:**
   - toate cheile din `stare_citita` ale celor 18 scenarii trec în simulator (O4);
   - „ecranul = starea” (§3);
   - evenimentele §4 pe fiecare gest (gesturile `explorer.*` din `suprafete.json`: dublu clic, F2, Delete, Shift+Delete, Ctrl+C / X / V / Z / Y / A, Ctrl+Shift+N, tragere, clic dreapta, săgeți, Enter, Backspace, Alt+săgeți, F4, Ctrl+L / E / F, …), asistentul §6, `tipMotor` §8.1;
   - dialogurile (`explorer.dialog.*`): titlul, întrebarea și butoanele exact din scenariile reale. Ce nu dau scenariile nu inventezi: rând `R15-…`.
   - comenzile de pe drumurile lecțiilor se simulează; restul dau mesajul central standard cu `data-lh-nesimulat` (R12).
4. **Poligonul:** `aplicatii/poligon.html?aplicatie=explorer` deschide Explorer pe un folder de lucru de probă: câteva foldere și fișiere ca în lecțiile de clasa a V-a, Coșul de reciclare.
   - `poligon.html` e comun: o ramură nouă, cu Edit.
5. **Lecțiile** care folosesc azi simulatoarele vechi `lectii/_sim/explorer-citire.js`, `explorer-operatii.js`, `explorer-organizare.js`, `explorer-proba.js`: `lectii/v/m2-l09`, `m2-l10`, `m2-l11`, `m2-l12`, `m2-l15`, `m5-l31`, `m5-l36`, `lectii/vi/m3-l18`.
   - Le citești DOAR ca să vezi ce drumuri cer: ce foldere, ce operații, ce verificări.
   - Simulatoarele vechi le citești ca listă de cerințe, nu ca model de aspect.
   - Lecțiile nu se schimbă în etapa B.
6. **I1:** la 360-390 px bara de comenzi se derulează lateral sau se strânge ca în Explorer real la fereastră îngustă (din referință: `observat_vizual`), nu se taie; zonele de atins ≥ 32 px.

## Ce citești întâi
- `D/contract.md`, `D/api_biblioteca.md` (§3, §4, §5 explorer, §6, §8), `D/oracole/CONVENTIE_ARBORE.md`, `D/referinte/README_referinte.md`, `runde/15/acoperire_instrumente.md`.
- Scenariile, cele 18.
- Codul din `aplicatii/`, cu Grep înainte de Read:
  - `powerpoint.js` (cea mai nouă aplicație, ~2400 de rânduri) doar ca model, pe bucăți;
  - `genereaza_powerpoint.py` e modelul generatorului.

## Probele, regresul, Office
- **Proba ta:** `runde/15/proba_explorer.py`: gesturi reale pe poligon, ieșirile în json. Scenariile Explorer prin `sim_runner.js` / `oracol_comportament.py`, cu `LH_IESIRE=D/runde/15/probe_iesiri`.
- **Regresul Word / Excel / PowerPoint** (5-10 scenarii fiecare), doar dacă ai atins `aplicatii.js` / `aplicatii.css` / `stare.js` / `poligon.html`.
- **Explorer real, Word, Excel, PowerPoint real NU le pornești.** Nu umbli pe ecranul lui Vasile. Probele în browser rulează headless, doar pe 127.0.0.1/localhost.
- În NICIUN fișier scris nu pui căi cu numele utilizatorului Windows: scrii „%TEMP%”. Nicio dată personală.

## Ce NU faci
- Nu atingi `word.js`, `excel.js`, `powerpoint.js`, viitorul `windows.js` (banda Windows, r18), datele lor, nici zona înghețată, lecțiile sau jocurile.
- Fără commit, fără push, fără git care scrie.

## Economia contextului (OBLIGATORIU)
- **Ce s-a întâmplat până acum:** toți constructorii au trecut de 290k (cel mai mare a ajuns la 455k).
- **Ce faci tu:** după FIECARE bucată terminată actualizezi `runde/15/stare_autor.md`. Bucățile sunt:
  1. generatorul;
  2. fereastra;
  3. meniurile;
  4. operațiile cu fișiere;
  5. dialogurile;
  6. telefonul;
  7. probele.
- **La ~200k de context:** ultima linie din `stare_autor.md` e `PREDARE` și te oprești.
- **Ieșirile mari** le pui pe disc; în context aduci doar coada.

## Gata înseamnă
- **`raport_constructor.md`:**
  - FĂCUT / NEFĂCUT / NESIGUR;
  - lista exactă a fișierelor create sau schimbate, cu secțiunea „Fișiere comune atinse”;
  - câte din cele 18 scenarii Explorer trec;
  - ce suprafețe `explorer.*` deschide plasa.
- **`gata_pentru_critic.md`:** unde e ce, cum se deschide poligonul cu Explorer și ce parametri de conținut primește. Ultima linie: `GATA_PENTRU_CRITIC`.
