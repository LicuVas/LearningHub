# Raportul constructorului, runda 24 (Word, valul B-word#2, unghiul aspect; ciclul paralel C)

Numerele întâi. Toate sunt rulate de mine, în `runde/24/`. Pasul 7 complet (`masoara.py`) îl face orchestratorul.

| măsura | la pornire | la final | unde |
|---|---|---|---|
| `proba_grav.py` (19 verificări) | **13 picate** | **0** | `proba_grav_inainte.log` → `proba_grav.json` |
| O9 (asistarea, toate aplicațiile, `LH_IESIRE`) | 13 | **13** (aceleași 13 cazuri: `F_lectie_asculta` ×5, paint ×8) | `probe_iesiri/O9_inainte`, `O9_dupa`, `o9_rele_*.txt` (diff gol) |
| O4 doar pe `word-*` | 13 | **13** (aceleași 12 rânduri RĂU, diff gol) | `probe_iesiri/O4w_inainte/rele.txt`, `O4w_dupa/rele.txt` |
| O4, varianta scenariului imaginii (copie, nu cel înghețat) | — | **0** (1/1 la fel ca realul) | `probe_iesiri/O4_varianta_imagine/iesire.log` |
| aspect la 1366×768 față de `uia_word.json` (±2 px) | — | 0 diferențe vizibile: 5 ferestre (73/77/60/12/13 noduri) + 4 file (8/11/4/9 grupuri) | `probe/p24_aspect.py` → `probe_iesiri/aspect_dupa.json` |
| regresul | vezi mai jos | | `regres_rezumat.txt` |

## FĂCUT
1. **Asistentul comun** (ținta 1; `20/critic.md:99-107`):
   - `aplicatii.js` › `L.asistent`: un eveniment cu `actiune: 'mutare_focus'` (Tab / Shift+Tab într-o fereastră) nu mai face pasul, nici când pleacă de PE ținta pasului. Nici nu mai e greșeală.
   - Un pas cu `asteapta` primește evenimentul ca înainte (cazul A21-1 neatins). §6.3 din `api_biblioteca.md` e scris la fel.
   - Dovada, pasul zero apoi după (`proba_grav_inainte.log` → `proba_grav.json`):
     - AS1 (drumul `m1-l03:189-192` cu tastele): bula pe PDF după pași buni și Save bifat la Tab, apoi **fără bulă**; Save rămâne nebifat la Tab peste el (`pas` 1, 4 fișiere, fereastra deschisă) și se bifează doar la Enter pe Save, cu `.pdf` scris;
     - AS2 (Tab până la Cancel): `pas` 1 → 0;
     - AS3 (Tab ×12 + F5 ×2): bula vine după a doua greșeală adevărată, pe Save;
     - AS4 (PowerPoint: F12, Tab ×14 peste Save): `pas` 1 → 0, apoi clicul pe Save → 1;
     - AS5: Tab în DOCUMENT rămâne greșeală (neschimbat).
   - Proba veche `20/proba_grav.py`: 3 → 2. `COMUN_asistent_tab_peste_save` trece acum; cele 2 rămase sunt MINOR-ul vechi „Save bifat la refuz”, NEFĂCUT mai jos.
   - A24-1 în `de_aprobat.md`.
2. **MINOR-urile Word din critic 20** (`word.js`):
   - **Alt+F4 într-o fereastră** = drumul lui Esc (Cancel). Sursa: support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec, Windows 11: „Alt+F4 | Close the active window.”
     - MN1a: Save As se închide, nimic scris, `anulare`; Ctrl+S → „Save this file”.
     - MN1b: Open se închide.
     - MN1c: „Save your changes…” = Cancel, documentul rămâne, `apasat: "Cancel"` (ca Esc, [presupus] R20-3).
   - **Mesajul de eroare dispare la salvarea reușită.** Doar `nume_interzis` și „… already exists” (MN2a, MN2b); mesajul de la Tools rămâne (MN2c).
     - Funcție publică de ascundere nu există. Am folosit curățarea explicită pe care o respectă paza din `aplicatii.js` › `nesimulat` (comentariul de la `:222-224`: „Un m.remove() singur … e respectat”), deja folosită de `word.js` › `numeInterzis`.
     - Curățarea se face într-un pas separat (`setTimeout 0`), ca observatorul să nu pună mesajul înapoi. `aplicatii.js:235` neatins.
   - **Fereastra mică** (1093×526 css, factor 1,25):
     - Fereastra mai înaltă decât rădăcina se micșorează cât să încapă (`scale`, cel puțin 70%), doar când rădăcina e mai lată decât fereastra (deci nu pe telefon).
     - Tab aduce controlul în vedere derulând doar stratul ferestrei.
     - Lista unei casete din fereastră se deschide deasupra casetei când dedesubt nu încape.
     - Rezultat: Save [750,518] → în ecran (MN3a); Tab pe Save în ecran (MN3b); rândul PDF cu mouse-ul, fără derulare, apoi Save, scrie `.pdf` (MN3c).
     - La 1366×768 dreptunghiurile rămân ale referinței (MN4: fereastra [1,1,960,566], Save [750,518,88,26]).
     - A24-2 + R24-3.
   - **„already exists” cu întrebare:** nicio referință în `referinte/` → rămâne mesajul central; R24-4 (= captura R5-3).
3. **Unghiul aspect pe Word** (ținta 4), față de `uia_word.json`, la 1366×768:
   - Save As, Save As (PDF), Open, „Save this file”, „Save your changes…”: toate nodurile potrivite la ±2 px față de colțul ferestrei.
   - Singura excepție e un TreeItem de 0×0 din afara ecranului.
   - Antetele Open „Data modificării” / „Tip” lipsesc pe ecran pentru că referința le are `vizibil: false`.
   - Panglica pe Home / Insert / Layout / View: toate grupurile la ±2 px.
   - Fereastra mică: vezi 2. Telefonul și tabla: dreptunghiurile ferestrei Save As la 390×844 și 1920×1080 sunt neschimbate (`probe_iesiri/masura_inainte.json` › M2, M2b; micșorarea nu se aplică acolo). Proba telefonului, în regres.
4. **Documentele rundei:** `cadru.md`, `tinta.md`, `contra.md`, `diferente.md` (D1-D9), blocurile `RUNDA24-WORD` din `de_aprobat.md` (A24-1, A24-2) și `de_verificat.md` (R24-1…R24-5).

## NEFĂCUT (cu deblocatorul)
- **O4 la Word nu scade (13 → 13).** Cele două rânduri din ținta 2 nu se pot repara cinstit în `word.js` (`diferente.md` D2, D3):
  - `word-clic-pune-cursorul` (9 vs 10) vine din ham:
    - realul dă clic la `x + l // 2` în pixeli întregi (`referinte/ruleaza_real.py:596-604`, l = 31 → 0,5 px la stânga mijlocului);
    - O4 dă clic la `x + w / 2` (`oracole/oracol_comportament.py:189`), adică 0,257 px la dreapta centrului lui „e”;
    - ambele aplicații pun cursorul la cea mai apropiată graniță.
    - **Deblocator:** o rundă `acoperire` care aliniază clicul hamului (sau R24-1 pe Word real).
  - `word-imagine-inserare`: pasul înghețat cere `PictureInsertFromFile` (rândul „This Device” din meniul Pictures) direct după fila Insert.
    - **Deblocator:** scenariul rescris într-o rundă `acoperire` cu `id_mso: FlyoutAnchorInsertPictures, element: "This Device"`. Varianta trece deja 1/1 pe copie. R24-2.
  - Dacă orchestratorul nu le deblochează, regula de platou poate opri valul pe aceste numere.
- **MINOR vechi, comun: pasul Save se bifează și la salvarea refuzată** (nume interzis; `20/proba_grav.py` › `MINOR_COMUN_asistent_refuz_*`, 2 picate).
  - Nu era în ținta mea: supliment, ținta 1 = doar `mutare_focus`.
  - Repararea cere o regulă nouă în `L.asistent` (o acțiune de refuz să nu facă pasul), apropiată de A21-1. **Pentru orchestrator.**
- **Litera în Save as type** (`fara_efect` în loc de `tastare`, critic 20 › predarea 3): nu e în lista MINOR-urilor din supliment. Neatins.
- **R16-1…R16-5, R20-1…R20-4:** toate cer capturi din Word real, care nu sunt pe disc. Neatinse (ținta 5: „doar unde găsești referință”).

## NESIGUR
- [presupus] micșorarea ferestrei pe ecranele mai mici decât ea și lista întoarsă în sus (A24-2, R24-3).
- [presupus] Alt+F4 în „Save your changes…” = Cancel, ca Esc (R20-3). Alt+F4 în Chrome pe Windows poate închide tot browserul înainte să ajungă la pagină (R24-5).
- A24-1 așteaptă confirmarea lui Vasile.

## Fișiere comune atinse
- **`aplicatii/aplicatii.js`, doar `L.asistent`** (la 03:50 rândurile `:663-672`; numerele se mută, pentru că alte benzi scriu deasupra în timpul rundei; caută `doarFocus`):
  - `:663-666` comentariul + `const doarFocus = ev.actiune === 'mutare_focus';`
  - `:668` `else bun = !doarFocus && (ev.tinta === p.tinta || (!!canonPas(p) && ev.tinta === canonPas(p)) || (!!ev.activat && ev.activat === p.tinta));` (înainte: fără `!doarFocus && (…)`)
  - `:672` `if (doarFocus || NEGRESELI.has(ev.gest) || …` (înainte: fără `doarFocus ||`)
  - Copia de dinainte: `runde/24/inainte/aplicatii.js`. `runde/24/diff_aplicatii_tot.txt` conține și hunk-urile benzii r26 (`litera` / `MAC`), care nu sunt ale mele.
- **`_campaign/aplicatii_fidele_2026_11/api_biblioteca.md`, doar §6.3** (azi `:263-267`):
  - fraza „Greșeală = …” primește „și orice eveniment cu `actiune: 'mutare_focus'` …”, plus două rânduri despre faptul că `mutare_focus` nu face pasul și că `asteapta` hotărăște singur;
  - copia: `runde/24/inainte/api_biblioteca.md`. `diff_api_tot.txt` conține și schimbările altor benzi.
- **Efectul pe celelalte aplicații:** `mutare_focus` îl emit azi `aplicatii.js` › `I.tabFereastra` (Word, PowerPoint, Explorer) și `excel.js` › `tabDialog`. Acolo Tab-ul în ferestre nu mai bifează și nu mai e greșeală. O9 13 → 13 pe toate cele 6 aplicații; PowerPoint probat (AS4).
- Fișierul propriu: `aplicatii/word.js` (diff întreg: `runde/24/diff_word.txt`, 6 hunk-uri: `aduInVedere`, `kMic`, `curataEroarea`, lista întoarsă în `listaRef`, Tab + `aduInVedere`, Alt+F4).

## Regresul (`regres.sh` → `regres_rezumat.txt`, jurnalele în `probe_iesiri/regres_*.log`)
| proba | etalonul (r20) | acum |
|---|---|---|
| `20/proba_grav.py` | 3 | **2** (trece `COMUN_asistent_tab_peste_save`; rămân cele 2 `MINOR_COMUN_asistent_refuz_*`) |
| `16/proba_grav.py` | 0 | 0 |
| `5/proba_grav.py` | 1 | 1 (același `t5_fara_document_nu_tace`) |
| `4/proba_grav.py` / `4/proba_telefon.py` | 0 / 0 | 0 / 0 |
| `3/proba_grav.py` / `2/proba_grav.py` | 0 / 0 | 0 / 0 |
| O4 `word-*` | 13 | 13 (aceleași rânduri) |
| O4, eșantion PowerPoint (6 scenarii, copii în `probe/scen_regres/`) | ca în `runde/22/iesiri/O4` | la fel: 5/6, `powerpoint-note` „fără real probat”, și la pornire |
| O4, eșantion Excel (6 scenarii) | la pornire 2 diferențe (`excel-autocompletare-tab`, `excel-autofit-latime`) | 1 (`excel-autocompletare-tab`, aceeași; `autofit` s-a îndreptat din banda Excel) |
| O9, toate aplicațiile | 13 | 13 (aceleași cazuri; rulat și după ultima schimbare: `probe_iesiri/O9_final`) |

- **Poarta `oracol_controale_taiate.py`** (I1, ecranele mici; aici contează micșorarea ferestrei): terminată după raport (`probe_iesiri/controale_taiate.log`): 115 lecții, 1011 exerciții, ecranele laptop / zoom125 / telefon.
  - **defecte 0**;
  - 2 erori de măsurare: `Page.click` peste 8 s, pe `vi/m2-l14` [mesaj] și `vi/m3-l20` [scratch]. Nu sunt lecții Word, iar în același timp rulau și alte probe pe mașină. Ultima linie: 2.
  - Pornirea: 0. Poarta o reia măsurarea comună din pasul 7.
- **O8 n-am putut să-l măsor în dosarul meu.** Cu `LH_IESIRE` separat, nu folosește ieșirile comune și trece de 10 minute (oprit de `timeout` de două ori, jurnalul gol). Rămâne pentru măsurarea comună.
  - Schimbările mele nu ating comenzile de pe drumul lecțiilor: asistentul nu e o comandă; Alt+F4, mesajul și micșorarea țin doar de ferestre.

## Pentru orchestrator
- Asimetria clicului în ham (D2) și scenariul imaginii (D3): ambele cer o rundă `acoperire`. Altfel O4 la Word rămâne 13.
- Regula „acțiunea refuzată nu face pasul” în `L.asistent` (MINOR-ul vechi).
- O funcție publică `I.ascundeMesaj()` / `L.ascundeMesaj(nume)` ar înlocui curățarea explicită din `word.js` (și din `excel.js:1477`).
