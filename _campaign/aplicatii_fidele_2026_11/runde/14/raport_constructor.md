# Runda 14 (B-powerpoint, ultima din val) · raportul constructorului — pașii 1-7

## Numerele: înainte → după
Pornirea = `runde/14/masurare_pornire.json` (pasul 7 al rundei 13). Pasul 7 al rundei 14 = `runde/14/masurare.json`, rulat
20.11.2026 17:23-17:56, singur pe mașină, `--paralel 3 --compara runde/14/masurare_pornire.json --timeout O6=3600`.

| | O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | porți |
|---|---|---|---|---|---|---|---|---|---|---|
| pornire | 61 | 13392 | 26855 | 32 | 82 | 0 | 341 | 102 | 27 | 41 (cum_fac 41) |
| după runda 14 | 61 | 13392 | 26855 | 32 | 82 | 0 | 341 | 102 | 27 | 41 (cum_fac 41) |

- Lacăt ok; neconcludente 0; O6 concludent (1028 s, 809 exerciții, 0 verdicte diferite); regres n cu n: niciunul.
- O2 / O3 au durat 0,8 / 1,0 s: randarea din cache-ul `structura_lib` (cheiat pe sha256 al fișierelor sitului), făcută de măsurarea
  parțială de dinainte (O3 239,5 s) pe EXACT aceleași fișiere — nimic sub `aplicatii/` nu s-a schimbat după ea.
- Măsurarea parțială (`masurare_partiala.json`, `--doar O3,O4,O5,O8,O9`): 26855 / 32 / 82 / 102 / 27, regres 0.
- `ingheata.py --verifica` = 0 (INTACT, 401 fișiere).
- De ce nu s-a mișcat niciun oracol: ținta rundei (tastatura în ferestre, Shape Format, Esc, fontul pe ecran) nu e măsurată de O1-O9
  (O5 joacă un gest pe fel, nu Alt + literă într-o fereastră; O3 / O2 compară arborele, nu fontul; O4 nu are scenariu pe taste în
  ferestre). Dovada reparațiilor e proba rundei, mai jos. Ținta numerică din supliment e respectată: O4 nu crește, O3 nici nu scade,
  nici nu crește, O5 neschimbat (aceeași mulțime de gesturi picate), restul nu cresc.

## Proba rundei (`runde/14/proba_grav.py`, gesturi adevărate, headless, doar 127.0.0.1)
73 de verificări. Înainte (e3300ec9, git archive în %TEMP%, șters): **55 picate** — T1 27, T2 9, T3 5, T4 3, punctul 5 11.
După (worktree): **0 picate**; erori în pagină 0; cereri plecate 0 (și pe telefon).

## FĂCUT / NEFĂCUT / NESIGUR

### FĂCUT
- **T1 — tastatura în ferestre** (27 → 0): în Open, Save your changes, Insert Picture, Save As, Font și Paragraph, Alt + litera din
  referință apasă butonul / pune focusul în câmp, cu un eveniment `tasta_acces` (Alt+N / Alt+O în Open → „Plante_6A_Pop.pptx”
  deschis; Alt+N / Alt+S în Save your changes → Don't Save / Save; Alt+O în Insert Picture → imaginea; Alt+N, nume, Alt+S în Save As →
  „Vulcanii.pptx”; Alt+S în Font → Size, „40” + Enter → 40; Alt+G în Paragraph → Alignment). Tab / Shift+Tab rămân în fereastră
  (40 de Tab-uri în Open, toate în fereastră, câte un eveniment); Tab până la Open / Don't Save + Enter le apasă; Font și Paragraph se
  deschid cu focusul într-un câmp. Cod: aplicatii.js:485-552, powerpoint.js:985-1003, :2072-2077, :2132-2149, :2245.
- **T3 — fontul temei** (5 → 0): titlurile fără font = 'Calibri Light', corpul = Calibri (rezervă Carlito, sans-serif), pe diapozitiv
  și în miniaturi; „Calibri Light (Headings)” ales pe un titlu deja în fontul temei: lățimea textului 190,7 px înainte și după (la
  pornire: 208,7 → 190,7); titlul Comic Sans reparat arată ca celelalte. Cod: aplicatii.css:369, :372; powerpoint.js:435-440.
- **T2 — Shape Format din taste** (9 → 0): insigna „JD” după Alt (cu steaua aleasă), J = prefix, D = fila; „Alt, J D, S F” → Shape
  Fill, „S O” → Shape Outline cu insignele W / M / … din referință, „W” → Weight ▸, ↓ … Enter → 3 pt (`contur_forma`, activat
  `meniu:3 pt`); „Alt, H, S, O, W, a” nu mai scrie nimic în stea. Cod: powerpoint.js:686-689, :2310-2330, :2131.
- **T4 — Esc = `tasta_esc`** (3 → 0): în PowerPoint, Word și Excel, Esc în modul tastelor de acces emite `tasta_esc /
  iesire_taste_acces`; Alt a doua oară rămâne `tasta_acces`; asistentul nu-l mai numără greșeală. O singură reparație, în codul comun
  (aplicatii.js:235-240, :463-468, :628-630); word.js / excel.js neatinse.
- **Punctul 5** (11 → 0): literele / Backspace / Delete cu o listă sau un meniu deschis = `fara_efect` (Font ▾ cu mouse-ul + „arial” nu
  mai intră în titlu; Shape Fill ▾ + „ab” nu intră în stea); clicul în textul casetei Font alege tot („Arial” + Enter → Arial); `tastare`
  în casete (Font, File name) are `dupa` ≠ `inainte` (`caseta_activa`); pe telefon tastarea în note are ținta `zona_note`; pe „Alt, H,
  S, F” cu pasul „meniu:Yellow” H = navigare, fără indiciu la lista bună; „Click to add notes” scos (zona goală rămâne goală); Open
  arată „Toate locațiile › Documente” și butoanele „Până la "Desktop"”, „Reîmprospătare "Documente" (F5)” din `b_ctrl_o_browse`.
- **Regresul la 0 picate** (`regres_rezumat.txt`): PowerPoint 13 (copie) 48/48; 12 (copie) 1 = căderea deja explicată (telefon 360,
  „ce se vede e la fel ca la 552ac0c5”, runde/13/diferente.md „Pasul 0”); 11 = 0 (reluat pe loc: copia din %TEMP% își calcula rădăcina
  din locul ei și nu găsea aplicația — problemă a hamului, nu a codului); Word 5 / 4 / 4-telefon / 3 / 2 = 0; Excel 10 / 9 / 8 / 7-cont /
  6 = 0; Excel 7 = 2 și 7-cont2 = 3, ACELEAȘI nume ca în runda 13 (D14, D18). Json-urile noi din runde/7-10 mutate în %TEMP%; 0 fișiere
  urmărite schimbate în runde/2-13.
- Notele: `de_verificat.md` R14-1…R14-7; `de_aprobat.md` A14-1 (Alt + literă = `tasta_acces`), A14-2 (`caseta_activa`), A14-3
  (asistentul și Esc).

### NEFĂCUT
- **MINOR** (listele la +3 px, „Pov” tăiat, „Save your changes” la x = −26 pe 360 px, zonele < 32 px, fila „Fill” ca text): neatinse.
  Deblocator: o rundă viitoare pe valul PowerPoint (acesta e ultima rundă a valului; timpul a mers pe T1-T4, punctul 5, regres și pasul 7).
- **Grosimea conturului în `stare()`**: nu există cheie în api §5, deci „Weight › 3 pt” are `inainte` = `dupa`. Deblocator: rundă
  `acoperire` cu scenariul `powerpoint-shape-outline-weight` (R14-7) și cheia în api §5.
- [FARA_REFERINTA] din critic 13 §6 în afara punctului 5 (tastarea peste o casetă aleasă ca obiect, Ctrl+S pe prezentare nesalvată,
  Delete pe caseta de aspect, Esc după un prefix KeyTips, Alt+F5, Slide Sorter Enter / Home / End, notele fără cursor): nereparate,
  cum cere suplimentul. Deblocator: rundă `acoperire` (sunt în de_verificat).

### NESIGUR
- Ordinea Tab în ferestre și focusul la deschiderea Font / Paragraph = ordinea nodurilor din referință, nu capturată ([presupus] R14-1).
- Ce buton e implicit (Enter pe un control care nu e buton) — R14-2; literele într-o listă deschisă — R14-3 / R14-4; lățimile adresei
  „Documente” — R14-6.
- „Click to add notes”: scos pentru că nu e în referință, dar lecția m1-l02:184 spune „unde scrie „Click to add notes”” — acum
  ecranul nu-l arată; de lămurit cu o captură (R14-5).
- De aprobat de Vasile: A14-1, A14-2, A14-3.
- Criticul 14 (pasul 8) încă n-a confirmat nimic: T1-T4 rămân deschise până îl confirmă el, cu citat.

## Fișierele create sau schimbate (necomise)
- Schimbate: `aplicatii/aplicatii.js` (+94 / −2: `tastaAcum`, `tastaFaraClic`, cârligul ferestrelor, asistentul),
  `aplicatii/powerpoint.js` (+130 / −11), `aplicatii/aplicatii.css` (+3 / −2: 2 reguli de font), `_campaign/aplicatii_fidele_2026_11/de_verificat.md`,
  `_campaign/aplicatii_fidele_2026_11/de_aprobat.md`. `git diff --stat -- aplicatii`: 3 fișiere, +227 / −15.
- Create în `runde/14/`: `cadru.md`, `tinta.md`, `contra.md`, `diferente.md`, `stare_autor.md`, `gata_pentru_critic.md`, acest raport;
  `proba_grav.py` (+ `h.py`, `k.py` copiate), `proba_grav_inainte.json`, `proba_grav_dupa.json` (și ieșirile parțiale
  `proba_grav_*_t1_…`, `*_p5_*` de pe parcurs), `regres.sh`, `regres_rezumat.txt`, `regres_*.log`, `regres_status_*.txt`,
  `masurare.json`, `masurare_1.json` (scrisă de masoara.py), `masurare_partiala.json`, `masurare_*.log`, `pas7_pornit.txt`, `iesiri/`,
  `sonda.py`, `sonda2.py`, `sonda3.py` (sonde de lucru).
- NEATINSE: word.js, excel.js, lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, scenariile, `api_biblioteca.md`.

## Ce scenarii trec acum
- O4: aceleași ca la pornire (PowerPoint 38/41: rămân `note`, `stea-ctrl-c-v`, `tragere-forma` fără rezultat real).
- Proba rundei: toate cele 73 de verificări (6 ferestre PowerPoint + Word Save As + Excel Save As; fontul pe diapozitiv și în
  miniaturi; J D / S F / S O / W / 3 pt; Esc în cele 3 aplicații; punctul 5, inclusiv telefonul 360 × 740).

## Word / Excel
Singura schimbare de eveniment: Esc în modul tastelor de acces = `tasta_esc` (înainte `tasta_acces`), acțiunea aceeași; Alt + literă
și Tab în ferestrele lor: neschimbate (cârligul nou e doar al PowerPoint-ului; Save As Word / Excel: evenimente identice înainte /
după). Detaliile: `diferente.md` › C.
