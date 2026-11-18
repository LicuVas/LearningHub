# Runda `acoperire` pe Word după platoul B-word (rundele 1-3) — 18.11.2026

Agentul rundei `acoperire` (nu autorul bibliotecii; `aplicatii/`, lecțiile, jocurile, `jocuri/_motor/` neatinse; nimic comis).
Tot ce e referință nouă vine din Word-ul REAL de pe PC (ProPlus 2021, 16.0.20326.20318), instanță nouă `WINWORD /x` pe
desktopul ascuns (LHRefOffice pentru capturi, LHScenarii pentru scenarii), UI Automation + COM; niciun Save în
Documentele omului (Cancel / Esc; salvările scenariilor în `%TEMP%`, dosar unic, șters; intrările mele din lista Recent a
lui Word șterse prin COM). Word închis normal de fiecare dată (COM sau WM_CLOSE), fără oprire forțată.

## Numerele întâi (aceeași bibliotecă; înainte = `runde/3/masurare_2.json`, ultima măsurare completă; după = `runde/3/masurare.json`, 23:24)
| | înainte | după | de unde vine diferența |
|---|---:|---:|---|
| O1 | 61 | 61 | — |
| O2 | 13392 | 13392 | — (O2 citește doar file/panglică/Acces rapid/bara de stare/File nav/meniuri de clic dreapta) |
| O3 | 18546 | **20337** | **+1794** pe cele 16 suprafețe noi (niciuna desenată de paginile de azi: în etapa B lecțiile nu încarcă biblioteca, deci = unitățile lor „lipsă” × 7 + 1); **−3** `fara_referinta` (save_this_file, save_your_changes_to_this_file, open au acum referință) |
| O4 | 98 | **120** | **+22**: diferențe +8 (ctrl-o 1, ctrl-s-document-nou 2, ctrl-w-nesalvat 5), chei neexecutabile +13 (salvare-pdf 3, x-nesalvat-cancel 3, ctrl-w-nu-salva 3, font-size-lista 2, font-size-tastat 2), fără rezultat real +1 (font-size-tastat) |
| O5 | 154 | 154 | — (gesturile din `suprafete.json` neschimbate) |
| O6 | 0 | 0 | — |
| O7 | 355 | **353** | **−2** `dialog_inexistent` (10 → 8): două ferestre citate de lecții există acum în referință |
| O8 | 102 | 102 | — |
| O9 | 41 | 41 | — |
| porți | 41 | 41 | cum_fac 41; date_personale 0 |
| lacăt | ok | ok | `ingheata.py --acoperire` (326 fișiere) înainte de măsurare; `--verifica` = **0** după |

Pe suprafețele noi, O3 (puncte): FontSize 113, FileSaveAs_tip 120, FileSaveAs_pdf 379, open 309, TableInsert 330,
Borders 113, Numbering 78, Bullets 71, LineSpacing 64, save_your_changes 57, save_this_file 50, Margins 50, ChangeCase 36,
Orientation 15, Open_rand_recent 8, FileSaveAs_navigare 1 (elementele implicite au ieșit în afara ecranului la captură:
`vizibil:false`, deci O3 nu le numără ca unități; etichetele sunt în referință).

**Mutanți: înainte = după = bancul neschimbat (nerulat).** Niciun oracol n-a fost atins: O3 citește singur
`referinte/uia_*.json` (orice cheie nouă), O4 citește singur `scenarii/**` + `referinte/scenarii_real/`. Cerința „oracol
atins → bancul + 1 mutant nou” nu se declanșează. Un mutant nou pe o suprafață nouă nici n-ar putea crește O3 azi (nicio
pagină nu o desenează: toate unitățile sunt deja „lipsă”).

## Fișierele schimbate (toate în `repere.lock`, reînghețat)
- NOU `referinte/acoperire_word_r3.py` — generator-soră (`capturi`, `scrie`, `verifica` = 0, `scenarii`); refuză desktopul vizibil.
- `referinte/uia_word.json` — 16 chei noi + blocul `acoperire_r3` (cum, faptele, ce s-a scos ca personal); cheile vechi neatinse. `dump_uia_office.py verifica` = 0.
- `scenarii/word/` — 10 scenarii noi (`rulat_de`); `referinte/scenarii_real/` — 9 rezultate reale, toate cu `mod_probat: true` (al 10-lea, font-size-tastat, fără rezultat). `ruleaza_real.py verifica` = 0.
- `referinte/ruleaza_real.py` — 2 rânduri: `scenarii()` sare scenariile `rulat_de` alt generator (altfel o rulare `toate` le-ar suprascrie cu „gest necunoscut”).
- `suprafete.json` — sursa completată la word.dialog.save_this_file / save_your_changes_to_this_file / open / save_as + 13 intrări noi (`word.lista.*`, `word.dialog.FileSaveAs_pdf`, `word.backstage.Open_rand_recent`). Atenție: `inventar_build.py` nu le știe (o regenerare le pierde; nota `acoperire_r3` din fișier).
- `api_biblioteca.md` — §3: felul `bara_titlu` (`bara_titlu:Close`) și `camp:tip_fisier`; §4: gestul `tasta_acces` și câmpul `activat` (cu sursa Microsoft pentru Enter = butonul implicit); §5: cheile noi; §6.3: pas făcut și prin `activat`, `tasta_acces` de navigare nu e greșeală.
- `referinte/README_referinte.md`, `de_verificat.md` (AC-1…AC-3), `de_aprobat.md` (notă la A2-1: referința există).
- Ieșiri ale rundei: `runde/3/acoperire/` (capturi_word_brut.json, jurnalele scenariilor, masurare_acoperire.log, stare_autor.md).

## Ce s-a capturat (Word real, desktop ascuns)
- **Ctrl+S pe document nou** → fereastra Office „**Save this file**” (NUIDialog): File name „Poezia mea”, casetă mică Save as type „Word Document (*.docx)”, „Choose a Location” ▾ (Documents / OneDrive - Personal), More options…, Save, Cancel. **More options… → pagina File › Save As** (nu fereastra Save As). Rezolvă A2-1 / R2-2 / R3-8 cu referința reală.
- **Ctrl+W și ✕ cu modificări** → aceeași fereastră „**Save your changes to this file?**”: File name, Save as type, Choose a Location; jos: More options…, Save, Don't Save, Cancel. Cancel → documentul rămâne; Don't Save → Word rămâne deschis, gol, titlul „Word”.
- **Font Size ▾**: 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72 (16 rânduri). Rândul „20” ales → mărimea 20.
- **Save as type ▾**: 17 rânduri (Word Document … OpenDocument Text); după „PDF (*.pdf)” caseta ARATĂ „PDF (*.pdf)”, bifa „Open file after publishing” = 0 pe acest PC; Save → `Orar.pdf`, documentul rămâne nesalvat.
- **Ctrl+O** → File › **Open**; **File pe document nou** → **Home** (R1-7); Ctrl+P → Print; **Ctrl+F12** → fereastra Windows „Open”; structura unui rând Recent (texte = „<fișier>”).
- Panoul din stânga Save As: implicitele Windows (Acasă, Galerie, Acest PC, Rețea); 19 elemente personale scoase.
- Listele R1-2: Bullets, Numbering, Borders (are „Borders and Shading...”), Change Case, Line and Paragraph Spacing, Insert › Table (grila 1x1 … + Insert Table…), Margins, Orientation.
- Scenarii cu rezultat real probat (canalele probate în aceeași rulare): word-ctrl-s-document-nou, word-salvare-ca-enter, word-salvare-ca-titlu, word-font-size-lista, word-ctrl-o, word-salvare-pdf, word-ctrl-w-nesalvat, word-x-nesalvat-cancel (✕ = clic de mouse postat), word-ctrl-w-nu-salva.

## Ce a rămas [NEVERIFICAT] (nu e în oracol ca „trecut”)
- **Clicul de mouse în caseta Font Size** (R3-5 / AC-1): clicul postat nu dă focusul casetei pe desktopul ascuns (2 încercări) → `word-font-size-tastat` e `trimis_la_profesor`, fără rezultat real (se numără la O4 ca „fără real”).
- **Titlul după salvare** (AC-2): pe acest PC „Tema mea.docx  -  Saved to this PC”; extensia vine probabil din setarea omului HideFileExt = 0 → NU e cheie de stare, doar `observat` în rezultat.
- **Butonul apăsat de Enter** în „Save this file” / „Save your changes…” și locul cursorului (AC-3); valoarea de sub „Documents” pe PC-ul din laborator.
- Ctrl+F / Ctrl+H (R1-5): nimic văzut, tasta poate să nu fi ajuns → marcate NEVERIFICAT în `acoperire_r3.fapte`.
- Cele 7 scenarii Word vechi fără rezultat real rămân așa: copiere-lipire / decupare-lipire (ar atinge clipboard-ul omului), tragere-selectie (butonul fizic al mouse-ului), cele 4 word2007 (Word 2007 nu e pe PC).
- O5 nu testează `tasta_acces` (nu e gest în `suprafete.json`; ar cere un rând nou în tabelul FELURI al lui O5 = oracol atins).

## Ce vede acum oracolul din cele 4 GRAV ale criticului 3
- **GRAV 3 (Font Size ▾):** O4 `word-font-size-lista` = neexecutabil („meniu:20 nu e pe ecran”, 2 puncte) până lista e simulată; O3 are `lista.FontSize` (16 rânduri, 113 puncte) — se vede pe bibliotecă abia când o lecție o încarcă (etapa C). Clicul + 20 + Enter („1120”): NEVERIFICAT (AC-1).
- **N4 (m1-l03):** O4 `word-ctrl-w-nesalvat` (5 diferențe: `dialog` lipsă), `word-x-nesalvat-cancel` și `word-ctrl-w-nu-salva` (neexecutabile: nu există `fereastra:Cancel` / `Don't Save`), `word-ctrl-o` (cheia `pagina_backstage` lipsă din stare). Referințe O3: `dialog.save_your_changes_to_this_file`, `dialog.open`, `backstage.Open_rand_recent`. NU acoperite de scenarii reale: documentul pornit deja salvat (nume + folder) și conținutul fișierului salvat.
- **A1 (Save as type arată .docx după PDF):** O4 `word-salvare-pdf` — real: `tip_salvare_afisat` = „PDF (*.pdf)”, `fisiere_salvate` = [„Orar.pdf”]; azi neexecutabil la pasul 2 (`camp:tip_fisier` nu e o țintă pe ecran). Limita: O4 compară starea raportată, nu textul casetei de pe ecran (regula „ecranul = starea” acoperă doar `text`/`celule`).
- **A2 (Save As cu „Documente” și antetele goale):** referința le are (`dialog.FileSaveAs`, `dialog.FileSaveAs_pdf`, `dialog.open`), dar O3 măsoară azi doar paginile lecțiilor, care nu încarcă biblioteca → invizibil oracolelor până în etapa C (sau până când O3 măsoară și poligonul).
- În plus, A2-1: `word-ctrl-s-document-nou` dă 2 diferențe (numele propus „Poezia mea.docx” în loc de „Poezia mea”; lipsește tipul „Word Document (*.docx)”).

ACOPERIRE_GATA
