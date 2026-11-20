# Runda 15 · B-explorer · raportul constructorului (20.11.2026)

## Numerele întâi (probele țintite; măsurarea completă o face orchestratorul)
| | pornire (`masurare_pornire.json`) | după (proba mea) | unde |
|---|---|---|---|
| O4 · scenariile Explorer | 14/18 (simulatorul vechi `lectii/v/m2-l10`, 4 diferențe de dialog) | **18/18** pe bibliotecă, 0 diferențe, 0 neexecutabile | `probe_iesiri/O4/iesire.log` |
| O5 · gesturile `explorer.*` fără eveniment | 32/32 | **0/32** | `probe_iesiri/O5/iesire.log` |
| O9 · cazurile Explorer picate | 8/8 | **1/8** (doar F: nicio lecție nu încarcă biblioteca — etapa C) | `probe_iesiri/O9/iesire.log` |
| O3 · `explorer.*` | 1261 (lecțiile vechi) | O3 nu se mișcă în etapa B (lecțiile nu încarcă biblioteca). **Diagnostic pe poligon: 254** (meniu_nou, meniu_sortare, meniu_vizualizare, meniu_fisier_clasic = 0) | `masoara_poligon_explorer.py` → `probe_iesiri/poligon_explorer.json` |
| regres Word / Excel / PowerPoint (5 scenarii fiecare, O4) | — | 13/15; cele 2 diferențe Excel (`excel-autocompletare-tab`, `excel-autofit-latime`) sunt IDENTICE în pornire | `probe_iesiri/regres/iesire.log` |
| proba de fum (1366 px și 375 px) | — | 0 picate: suprafețele ferestrei, fără derulare laterală a paginii, zonele de atins ≥ 32 px | `proba_explorer.py` → `probe_iesiri/proba_explorer.json`, capturile `poligon_lat.png`, `poligon_telefon.png` |
| `genereaza_explorer.py --verifica` | — | 0 | |

**Câte din cele 18 scenarii Explorer trec: 18/18.**

**Ce suprafețe `explorer.*` deschide plasa** (`I.deschideSuprafata`, `explorer.js:869`): `meniu_nou`, `meniu_sortare`,
`meniu_vizualizare` (cu submeniul „Afișați” deschis, ca în captură), `meniu_fisier`, `meniu_fisier_clasic`, `meniu_fundal`,
`panou_navigare` și `panou_detalii` (le arată); cele mereu la vedere (`fereastra`, `file_fereastra`, `butoane_navigare`,
`bara_adresa`, `cautare`, `bara_comenzi`, `zona_continut`, `bara_stare`) întorc `true`. Toate se deschid și prin gest
(clic pe Nou / Sortați / Vizualizați, clic dreapta pe fișier / fundal, „Afișați mai multe opțiuni”).
Dialogurile (`dialog.inlocuire_sau_omitere_fisiere`, `dialog.redenumire`, `dialog.dinamic`) apar doar din operații — ele sunt
`fara_referinta` în O3, deci plasa nu le deschide.

## FĂCUT (cu dovada)
- **Interfața generată din referință**: `aplicatii/_unelte/genereaza_explorer.py` citește `uia_explorer.json` pe chei și scrie
  `aplicatii/date/explorer.json` (fereastra pe părți, navigarea cu șabloanele `{folder}`/`{parinte}` deduse din firimituri,
  bara de comenzi, panoul de navigare cu nivelurile, coloanele și tipurile, bara de stare, cele 6 meniuri cu poziții și
  separatoare deduse din goluri, Proprietăți, pictogramele Fluent din setul proiectului, lista `lipsa`). Nicio etichetă de
  interfață scrisă de mână în `explorer.js`.
- **Comportamentul**: sistem de fișiere virtual (folder de lucru + folder sursă + `foldere_alaturate`), copiere „ - Copie
  (n)”, Folder nou „(n)”, lipire cu conflict (4 butoane reale), redenumire pe loc (F2, doar numele selectat, fără extensie —
  `observat_vizual.f2_pe_tema_docx`), dialogurile de nume existent și de extensie, Coșul (Delete / Ctrl+D) + Restaurare,
  Shift+Delete cu „Ștergere fișier”, sortare (meniu + antet, colatorul `ro` numeric = ordinea reală din `explorer_sortare_nume`),
  vederi, extensii / casete / panouri, navigare (dublu clic, panou, Înapoi / Înainte / Sus, Alt+săgeți, Backspace,
  firimituri, Ctrl+L / F4 + Enter), căutare (filtru), selecție (clic, Ctrl+clic, Shift+clic, Ctrl+A, săgeți, Home/End,
  litera, dreptunghi), tragere (mutare / Ctrl = copiere / pe Coș), Ctrl+Z / Ctrl+Y. Restul comenzilor afișate = mesajul
  central `data-lh-nesimulat` (R12).
- **Evenimentele §4** pe fiecare gest (O5 0/32), **asistarea §6** (O9 A-E, G, H trec), **ecranul = starea** (O4: 0).
- **Telefonul (I1)**: la 375 px fereastra încape, bara de comenzi se derulează lateral, panoul de examinare se ascunde,
  rândurile 34 px, nicio țintă sub 32 px.
- **Poligonul**: `aplicatii/poligon.html?aplicatie=explorer` (folderul „Clasa a V-a” cu Desene/, Proiect/plan.txt, harta.png,
  notite.txt, tema.docx; folderul alăturat „Teme”; Coșul pe fâșia de desktop).
- `cadru.md`, `tinta.md`, `contra.md`, `diferente.md`; `de_verificat.md` R15-1…R15-16; `de_aprobat.md` A15-1.

## Fișierele create sau schimbate
Noi (proprii): `aplicatii/explorer.js` (900 r.), `aplicatii/date/explorer.json` (generat), `aplicatii/_unelte/genereaza_explorer.py`,
`aplicatii/profiluri/explorer_windows11.json`; în `runde/15/`: `cadru.md`, `tinta.md`, `contra.md`, `diferente.md`,
`stare_autor.md`, `proba_explorer.py`, `masoara_poligon_explorer.py`, `raport_constructor.md`, `gata_pentru_critic.md`,
`inainte/` (copiile comune), `lucru/` (scripturile de citire a referinței + copiile scenariilor pentru probe), `probe_iesiri/`.
Adăugate la coadă: `de_verificat.md`, `de_aprobat.md` (blocul `RUNDA15-EXPLORER`).

### Fișiere comune atinse (cu Edit, bucăți mici, păzite pe `explorer`)
- `aplicatii/aplicatii.js` — 2 rânduri NOI după `SURSE_APP.windows = …` (rândul benzii Windows, neatins):
  `SURSE_APP.explorer = ['explorer.js', 'date/explorer.json'];` și
  `PROFILURI.explorer = ['explorer_windows11', 'windows11']; SETARI_IMPLICITE.profil.explorer = 'explorer_windows11';`
- `aplicatii/setari.json` — rândul 3: `"explorer": "windows11"` → `"explorer": "explorer_windows11"`.
- `aplicatii/poligon.html` — rândul 18: inserat fragmentul `/* Explorer (runda 15…) */P.explorer={…};` înaintea lui
  `if(a)LH.aplicatii.deschide(…)` (după `P.windows=…` al benzii Windows, neatins).
Nu am atins `aplicatii.css`, `stare.js`, `panglica.js` (stilul Explorer e injectat din `explorer.js`, clase `lh-ap-e-*`).

## NEFĂCUT (cu deblocatorul)
- Fereastra Proprietăți (captura `explorer_proprietati` e generată în `date/explorer.json › proprietati`, dar comanda dă
  mesajul central) — deblocator: o rundă următoare pe Explorer (nicio lecție nu e încă mutată; O3 n-o compară).
- O9 cazul F și O1/O2/O3/O6/O7/O8 pe Explorer — deblocator: etapa C (mutarea lecțiilor v/m2-l09…, cu `oracol_sarcini`).
- Diferențele de conținut din diagnostic (foldere personale ascunse, calea sesiunii profesorului, fișierele altfel numite)
  nu se pot închide fără a copia conținutul sesiunii — nu sunt de interfață.

## NESIGUR
- [NEVERIFICAT] R15-2 (tragerea), R15-7 (Ctrl+Z), R15-13 (Enter/Esc în dialog), R15-5 (singularul din bara de stare) — după
  comportamentul obișnuit Windows, fără referință; nu le număr fidele.
- R15-1: referința e a PC-ului profesorului; elevul din laborator poate vedea alte unități și alte rânduri în meniuri.
- A15-1 (fâșia de desktop) așteaptă aprobarea lui Vasile.
- Conținutul implicit (când pagina nu dă `arbore`) e un folder de clasa a V-a, ca să aibă O5/O9 pe ce lucra; `arbore: []` = gol.
