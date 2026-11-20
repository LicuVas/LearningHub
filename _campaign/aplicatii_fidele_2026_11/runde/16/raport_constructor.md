# Runda 16 · Word (val B-word#2) · raportul constructorului — 20.11.2026

Unghiul: `gest_tastatura`. Ținta: cele 8 GRAV deschise din `runde/5/critic.md` (supliment `runde/supliment_B_word_runda16.md`).
Rundă în paralel (CICLU_PARALEL.md): fără git care scrie, fără `masoara.py` întreg (pasul 7 = orchestratorul), probe headless pe 127.0.0.1.

## Numerele întâi
- **`runde/16/proba_grav.py`** (20 de verificări pe cele 8 GRAV, gesturi reale, Chromium headless, port liber, ruta doar 127.0.0.1):
  **la pornire 18 pică** (`proba_grav_inainte.json` / `.log`) → **la final 0 pică** (`proba_grav_dupa.json` / `.log`).
  Cele 2 care treceau la pornire sunt regres-gărzi: drumul lecției „F12 › Documente” și Ctrl+N / Ctrl+O / Ctrl+F12 fără document.
- **Regresul Word** (`regres.sh` → `regres_rezumat.txt`): probele vechi ale lui Word (la runda 14, pe același `word.js` de dinainte, toate 0): `4/proba_grav.py` 0, `4/proba_telefon.py` 0, `3/proba_grav.py` 0, `2/proba_grav.py` 0, **`5/proba_grav.py` 1** = `t5_fara_document_nu_tace` (cerea ca Bold / F12 / Ctrl+B fără document să dea mesajul central — exact mesajul fals „funcționează” pe care criticul 5 l-a declarat GRAV T5; schimbarea e voită, nu regres). **O4 doar pe `word-*`** (`probe_iesiri/O4w/`): **13**, cu verdictele scenariu cu scenariu IDENTICE celor de la pornire (`runde/15/iesiri/O4/oracol_comportament.json`: 54 ok, 1 cu diferențe `word-clic-pune-cursorul`, 1 neexecutabil `word-imagine-inserare`, 8 fără real) — niciun scenariu schimbat. **O8** (toate aplicațiile, `probe_iesiri/O8/`): **102** = pornirea (102).
  Notă: în timpul probelor, alte benzi aveau deja pe disc schimbări în fișiere comune (`aplicatii.js` +3, `poligon.html` +3/−2, `setari.json` +1/−1 — nu ale mele); probele de după rulează pe arborele comun de azi.
- **Fișiere comune atinse: niciunul.** Doar `aplicatii/word.js` (+120 / −16, `git diff --numstat`; sha256 după `29e550e2…`).
  Regresul Excel / PowerPoint nu e cerut (CICLU_PARALEL.md: doar pentru un fișier comun schimbat).

## Cele 8 GRAV (pasul zero = reprodus pe codul de azi; „ÎNCHIS” aici = închis la proba mea; îl confirmă doar criticul următor)
| GRAV | pornire (azi, înainte) | final | dovada |
|---|---|---|---|
| **S1** bara de adrese | PICĂ: Save As Descărcări › Desktop › Documente › Desktop → bara „Descărcări” la toți pașii; Open la fel | **ÎNCHIS** | `S1_saveas_bara_adrese`, `S1_open_bara_adrese`: bara = folderul ales la fiecare pas; Enter salvează în Desktop; `word.js:1512-1524` |
| **S2** F12 în folderul documentului | PICĂ: club-lectura din Descărcări → F12 → „Documente”, salvat în Documente | **ÎNCHIS** | `S2_f12_in_folderul_documentului` (bara + panoul „Descărcări”, salvat în Descărcări), `S2_f12_modificat_si_din_continut`; regres `S2_regres_lectia_documente_si_document_nou` (F12 › Documente = Documente; document nou = Documente); `word.js:1055-1059` |
| **S5** lista Save As | PICĂ: 8 rânduri goale, clicul nu face nimic | **ÎNCHIS** | `S5_saveas_lista_fisierele_folderului` (Popescu_Ana_7A_orar + Pop_Mihai_7A_compunere; clic → File name „Popescu_Ana_7A_orar”, fără mesaj; Descărcări → club-lectura), `S5_clic_pe_fisierul_colegei_nu_inlocuieste` (Save → „already exists”, fișierul colegei neatins); `word.js:1525-1531`, `:1809-1811`, `:1841-1845` |
| **S4** fișier deschis de două ori | PICĂ: `docs 2`, atelierul se termină cu `docs 1` | **ÎNCHIS** | `S4_deschis_de_doua_ori_atelier` (docs 1, apoi `docs 0` + „Word” după Ctrl+W, ca `m1-l03:270`), `S4_deschis_iar_modificat_munca_ramane` (Open și Recent: docs 1, „Marți: sport” rămâne), `S4_deschis_in_alta_fereastra_vine_in_fata`; `word.js:1463-1484` |
| **S6** Document2, Document3 | PICĂ: mereu „Document1”, F12 gol „Document1.docx” | **ÎNCHIS** | `S6_ctrl_n_numerotare` (Document1 → Document2 → Document3; F12 pe documentul gol „Doc2.docx”), `S6_dupa_inchiderea_tuturor_si_blank` (după închiderea tuturor: Document3, apoi Blank document: Document4); `word.js:628`, `:1551`, `:1067` |
| **S3** nume cu semne interzise | PICĂ: „Pop?Mihai.docx” etc. salvate, fără mesaj | **ÎNCHIS** (cu mesajul central, nu fereastra reală) | `S3_nume_interzise_f12` (9 nume: `: ? * " < > \| / \`), `S3_nume_interzise_alte_drumuri` (Save this file, PDF, butonul Save; apoi „Orar_7A” trece): nimic scris, fereastra rămâne, mesajul nu spune „funcționează”; `word.js:1186-1204`. Textul ferestrei reale → `de_verificat.md` R16-1 |
| **T6** Alt+↓ fără `activat` | PICĂ: pas 0 după Enter, bula pe ecran (și pe drumul Alt, H, F, S); Font: tasta nu făcea ce face clicul | **ÎNCHIS** | `T6_font_size_tastatura_scenariu` (pașii lui `word-font-size-lista`: Alt+↓ = `alt_sageti|lista_marimi|…|meniu_derulant:Home/Font/Font Size`, Enter → pas 2, fără bulă, „are@20”), `T6_font_size_keytips`, `T6_alte_liste_alt_jos` (Save as type: `activat` = ▾ „Deschidere”; Font: aceeași acțiune ca la clic pe ▾); `word.js:1929-1945` |
| **T5** Word fără document | PICĂ: panglica activă; Bold / Ctrl+B / F12 / Ctrl+S / Shift+F12 / Ctrl+W / Ctrl+Z / Ctrl+A / Ctrl+P = „… funcționează” | **ÎNCHIS** | `T5_fara_document_panglica_gri` (Bold, Italic, FontSize, Paste gri; 0 comenzi active pe Home și Insert; filele active; caseta Font Size dezactivată), `T5_fara_document_fara_mesaj_fals` (clic, 8 taste, KeyTips Alt, H, 1: fără mesaj, `indisponibil`), `T5_raman_active_si_revine_panglica` (Ctrl+O, Ctrl+F12, Ctrl+N merg; după Ctrl+N panglica revine, Bold merge); `word.js:949-976`, `:1833`, `:1966-1970` |

## Fișiere comune atinse
Niciunul. (`aplicatii.js`, `panglica.js`, `stare.js`, `aplicatii.css`, `poligon.html`, `setari.json`, `versiune.json`, `api_biblioteca.md` — neatinse.)
Griul fără document e făcut în `word.js` (ca PowerPoint în `powerpoint.js:625-635`), mesajul pentru numele interzis folosește
elementul mesajului central (ca Excel în `excel.js:1383-1390`).

## Fișierele rundei
- cod: `aplicatii/word.js` (copia de dinainte: `runde/16/inainte/word.js`, sha256 `8ab18c45…`);
- `runde/16/`: `cadru.md`, `tinta.md`, `contra.md`, `diferente.md`, `proba_grav.py` + `h16.py`, `proba_grav_{inainte,dupa}.{json,log}`,
  `sonda16.py`/`.json` (citiri înainte), `sonda16b.py`/`.json` (gesturi vecine, după), `regres.sh` + `regres_*.log/json` +
  `regres_rezumat.txt`, `probe_iesiri/` (O4 pe word-*, O8, cu `LH_IESIRE`);
- `de_verificat.md`: blocul `RUNDA16-WORD` (R16-1 … R16-5). `de_aprobat.md`: nimic (nu păstrez nicio diferență voit).

## NESIGUR (alegeri fără citat direct, toate cu rând în de_verificat)
- R16-1: fereastra reală de eroare la numele interzis (COM dă doar textul erorii) → mesajul central, cu textul lecției `m1-l03:156`.
- R16-2: lista Save As e filtrată pe tipul din „Save as type” (*.docx / *.pdf); referința are 8 rânduri redactate.
- R16-3: fișierul deschis ȘI modificat, redeschis: aduc documentul în față, fără întrebare (COM a probat doar cazul nemodificat).
- R16-4: fără document, TOATĂ panglica gri (COM a probat 8 comenzi; restul prin extindere, ca la PowerPoint).
- S2 și S6 se sprijină pe Word real prin COM (`runde/5/critic_probe/com_r5.json`), nu pe un scenariu din `referinte/scenarii_real`;
  o rundă `acoperire` le poate îngheța ca scenarii (`word-f12-folder-document`, `word-ctrl-n-numerotare`).

## NEFĂCUT / în afara țintei (văzute pe drum)
- View › Window › Switch Windows rămâne mesajul central (lista ferestrelor nu e în referință → R16-5); între documente se trece cu Ctrl+W.
- Asistentul trece pasul `dialog_salvare:Save` și când salvarea e refuzată (nume interzis, „already exists”) — e în `aplicatii.js`
  (comun), critic 5 MINOR; verificarea lecției rămâne pe stare.
- Deschiderea din fereastra Open nu pune fișierul în Recent (comportament vechi, AC-7; `sonda16b.json`).
- Pasul 7 (masoara.py întreg), criticul rece, publicarea, jurnalul: ale orchestratorului.
