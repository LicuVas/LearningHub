# Raportul constructorului, runda 20 (Word, valul B-word#2, unghiul stare_finala_erori)

Pașii 2-6 din `prompt.md` + probele țintite. Pașii 1, 7-10 sunt ai orchestratorului (pornirea: `masurare_pornire.json`).

## Numerele
- **Proba rundei** (`proba_grav.py`, 33 de verificări; înainte = `--word-inainte`, care servește `inainte/word.js` prin rută):
  - înainte: **20 picate** (`proba_grav_inainte.log` 18/31 + `proba_grav_inainte_M1.log` 2/2);
  - după: **3 picate** (`proba_grav_dupa.log`), toate în asistentul COMUN (`aplicatii.js:628`), niciuna în `word.js`:
    `MINOR_COMUN_asistent_refuz_F12`, `MINOR_COMUN_asistent_refuz_Control+s` (MINOR vechi din runda 5) și
    `COMUN_asistent_tab_peste_save` (nou vizibil, vezi „Găsit pe drum”).
- **K1** (`runde/16/critic.md:65-94`), toate trec după reparație:
  - `K1_pdf_cu_tab` (gestul criticului: F12, Ctrl+A, nume, Tab, Alt+↓, ↓×6, Enter, Enter): primul Tab → `D:ComboBox:Save as type:`,
    evenimentul `tasta_tab|mutare_focus|camp:nume_fisier`; după primul Enter fereastra e `dialog.FileSaveAs_pdf`; final:
    `Documente/Pop_Mihai_7A_orar.pdf` cu „Orarul meu / Marți: sport”, niciun .docx, documentul neschimbat pe ecran și în stare.
    Înainte: `Pop_Mihai_7A_orar.docx` + rândul gol `["Orarul meu","Marți: sport",""]`;
  - `K1_lectia_189_192_cu_tab` (m1-l03 `:189-192` cu tastele: Ctrl+S, apoi F12, Tab, Alt+↓, ↓×6, Enter, Enter): `.docx` și `.pdf`
    cu „Marți: sport”, documentul rămâne `Popescu_Ana_7A_orar.docx`;
  - `K1_ocol_*`, 5 ferestre (Save As, Save As PDF, Open, „Save this file”, „Save your changes…”): Tab ×15 + Shift+Tab ×8 rămân în
    fereastră (23/23 evenimente `mutare_focus`), iar Tab-ul continuat revine pe controlul de pornire fără să iasă din fereastră
    (`ocol_inchis: true`; ordinea, în `proba_grav_dupa.json › K1_ocol_* › ocol / inapoi / ocol_intreg`);
  - `K1_litere_dupa_tab`, `K1_enter_pe_cancel_save_as` (`tasta_enter|anulare|dialog_salvare:Cancel`, nimic scris),
    `K1_space_pe_cancel_open` (`tastare|anulare|fereastra:Cancel`), `K1_enter_pe_dont_save`
    (`tasta_enter|inchidere_fara_salvare|fereastra:Don't Save`, fișierul neatins), `K1_enter_pe_save`; etalonul `K1b_pdf_cu_alt_t` rămâne bun.
- **Unghiul stare_finala_erori** (drumurile din supliment), toate trec după reparație:
  - `E1` nume greșit („Pop:Mihai”) apoi corect, din F12 și din Ctrl+S: refuzul lasă fereastra deschisă, focusul în File name;
    corectarea scrie un singur fișier, `Pop_Mihai.docx`, titlul „Pop_Mihai  -  Word”, ecranul = starea;
  - `E2` Cancel în Save As (clic / Esc / Tab+Enter), apoi Ctrl+S: nimic scris, documentul rămâne nou, Ctrl+S deschide „Save this file”.
    Înainte, varianta Tab+Enter SALVA `Orarul meu.docx`;
  - `E3` Open pe fișierul greșit (tema din Desktop), o literă, Ctrl+W › Don't Save (Alt+N / Tab+Enter / clic): `tema.docx` neatins,
    rămâne activ `Popescu_Ana_7A_orar.docx`, întreg, pe ecran și în stare. Înainte, varianta Tab+Enter SALVA „TemaX” peste fișier;
  - `E4` Ctrl+Z după tastare și după aldin: ecranul = starea (text și aldin);
  - `E5` Esc în Save As, Save As după Tab, Open, „Save this file”, Font: se închide, nimic scris, litera următoare ajunge în document;
    Esc în „Save your changes…” = Cancel: documentul rămâne, `dialog.apasat` = „Cancel”, ca la clic (înainte: `null`).
- **MINOR din critic 16** (`M1_*`): Alt+↑ / F5 → `nesimulat` cu `activat` pe „Până la "Desktop"…” / „Reîmprospătare…”, ca clicul;
  Alt+← / Alt+→ → `fara_efect` (butoane `activ: False` în referință); Alt+L → `tasta_acces|nesimulat|fereastra:Tools`. Înainte: fără efect / fără eveniment.

## Ce am schimbat (doar `aplicatii/word.js`; copia: `inainte/word.js`)
- `word.js:1922-1933` — Tab / Shift+Tab cât e deschisă o fereastră: `I.tabFereastra(dialog.el, shift)`, cârligul comun din runda 14,
  chemat ca în `powerpoint.js:2072-2076`; lista deschisă (Save as type ▾) se închide fără să schimbe tipul; ținta = focusul din
  momentul tastei (`I.tintaTasta`). Word NU pune `I.la.fereastra()`: ar porni și Alt + litera comună (`aplicatii.js:526-550`), pe
  lângă Alt + litera proprie Word (`word.js:2118`), amândouă în captură pe rădăcină → două evenimente pe aceeași tastă.
- `word.js:1934-1949` — Esc într-o fereastră = clicul pe Cancel-ul ei (`activat` = Cancel); fără Cancel, doar se închide.
- `word.js:1950-1966` — Alt+↑ / Alt+← / Alt+→ / F5: apasă butonul din fereastră care are tasta în eticheta din referință.
- `word.js:2001-2014` — Enter pe Button/SplitButton cu focusul îl apasă pe acela; Space pe Button/SplitButton/CheckBox/RadioButton.
- `word.js:2122-2124` — `MenuItem` intră în tipurile apăsate de Alt + litera Word (Alt+L = Tools).

## Fișiere comune atinse
- **Niciunul.** `aplicatii.js`, `panglica.js`, `stare.js`, `aplicatii.css`, `poligon.html`, `setari.json`, `versiune.json`,
  `api_biblioteca.md`: neatinse de banda Word. Cârligul `I.tabFereastra` se folosește, nu se schimbă. Deci regresul Excel /
  PowerPoint nu e cerut (`CICLU_PARALEL.md:51`).
- `de_verificat.md`: adăugat la coadă blocul `<!-- RUNDA20-WORD:START/END -->` (R20-1 … R20-4). `de_aprobat.md`: neatins.

## Regresul Word (`regres.sh` → `regres_rezumat.txt`; v1 = după K1, înainte de MINOR: `regres_rezumat_v1_fara_minor.txt`)
| proba | etalonul (finalul rundei 16) | v1 (după K1) | v2 (după K1 + MINOR, final) |
|---|---|---|---|
| `runde/16/proba_grav.py` | 0 | 0 | **0** |
| `runde/5/proba_grav.py` | 1 (`t5_fara_document_nu_tace`, verificare depășită de T5) | 1 (același) | **1** (același) |
| `runde/4/proba_grav.py` | 0 | 0 | **0** |
| `runde/4/proba_telefon.py` | 0 | 0 | **0** |
| `runde/3/proba_grav.py` | 0 | 0 | **0** |
| `runde/2/proba_grav.py` | 0 | 0 | **0** |
| O4 doar `scenarii/word` (64) | 13 (pornirea r20, `probe_iesiri/O4w_inainte`) | 13 | **13**, aceleași 12 rânduri RĂU (`o4w_rele_dupa.txt` = pornirea, `diff` gol) |
| O8 (toate aplicațiile, static) | 102 | 103 (+1 Paint, vezi mai jos) | **102**, nicio apăsare schimbată față de runda 16 |

## Găsit pe drum (pentru orchestrator; nu e al benzii Word)
1. **Asistentul comun trece pasul când Tab trece PESTE butonul cerut** (`aplicatii.js:628`: „bun” = `ev.tinta === p.tinta`). Evenimentul
   `tasta_tab` are, după §4, ținta = focusul din MOMENTUL tastei; cu focusul pe Save, Tab-ul care pleacă de pe Save poartă
   `tinta: dialog_salvare:Save`, iar pasul „Save” e bifat fără salvare (`proba_grav_dupa.log › COMUN_asistent_tab_peste_save`).
   La fel la PowerPoint (același cârlig, aceeași regulă). Verificarea lecțiilor e pe stare, deci rezultatul nu se schimbă; doar
   indiciul trece la pasul următor. Propunere (comun, nu am făcut-o): în `L.asistent`, `tasta_tab` cu `actiune: 'mutare_focus'`
   ca navigarea (nici pas făcut prin `tinta`, nici greșeală), iar pasul să fie făcut doar de `activat` sau de alt gest.
   Același loc are MINOR-ul vechi „pasul Save trecut la numele refuzat” (`runde/16/critic.md:194`).
2. **O8 a dat o dată 103** (v1): singura apăsare schimbată era în **Paint** (`lectii/v/m3-l20/index.html`, „Imagine”,
   `nu se poate apăsa`; în runda 16: cu efect), nu în Word (`probe_iesiri/O8_v1`). La v2 a revenit la 102, fără nicio diferență
   față de runda 16: apăsare instabilă sau o stare trecătoare a altei benzi. De urmărit la măsurarea comună.
3. **Ocolul Tab al ferestrelor Save As / Open are butoanele barelor de derulare și capetele de coloană ca opriri** și nu are lista,
   nici panoul din stânga: e ordinea cârligului comun (`aplicatii.js:483-503`, [presupus] R14-1), la fel la PowerPoint. Intră în R20-1.

## NEFĂCUT (cu deblocatorul)
- **Lista „Vizualizare elemente” ca oprire Tab** (predarea criticului 16, punctul 1.2): cere ca `controaleFereastra` din `aplicatii.js` să
  oprească și pe `List` / `Tree` — schimbarea cârligului comun, interzisă în runda asta (suplimentul). Deblocator: orchestratorul
  (cârligul comun, cu reprobarea PowerPoint) + R20-1 (ordinea reală). Partea „la clic, ↑/↓ mută alegerea” n-am făcut-o: ar schimba
  ce primește tastatura după clicul pe un rând (lecțiile tastează numele după clic) și n-are referință pentru focus după clic.
- **Fereastra mică** (Save / Cancel sub margine până derulezi; lista Save as type deschisă cu PDF sub ecran) — MINOR, nu regres; n-am atins.
- **R16-1 … R16-5**: n-am găsit referință nouă (`de_verificat.md › RUNDA16-WORD` rămâne deschis).

## NESIGUR
- R20-1 (ordinea Tab), R20-2 (Tab cu lista deschisă), R20-3 (Esc = Cancel în ferestrele Office „Save your changes…” / „Save this file”),
  R20-4 (Enter / Space pe butonul cu focusul, în ferestrele Office): fără captură din Word real; în `de_verificat.md › RUNDA20-WORD`.
- Probele mele confirmă ce am construit (aceeași mână): criticul rece e oracolul independent.
