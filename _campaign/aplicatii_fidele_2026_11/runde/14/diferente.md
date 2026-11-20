# Runda 14 · tabelul diferențelor (pasul 5) + ce nu trece încă + schimbările de evenimente

Referințele înghețate citate: `referinte/uia_powerpoint.json` (citit doar prin Python, pe chei), `referinte/scenarii_real/powerpoint-*.json`,
`api_biblioteca.md`. Liniile simulatorului sunt cele de după reparație (worktree, 20.11.2026).

## A. Diferențele reparate

| # | suprafață | ce face aplicația reală (citat din referință) | ce făcea simulatorul → ce face acum (fișier:rând) | grav. | reparația |
|---|---|---|---|---|---|
| D1 | ferestrele PowerPoint: Alt + literă | `suprafete.dialog.FileOpen › ComboBox 'File name:' tasta_acces "Alt+n"`, `SplitButton 'Open' "Alt+o"`; `dialog.save_your_changes_to_this_file › Button 'Save' "ALT+S"`, `Button "Don't Save" "ALT+n"`; `dialog.FileSaveAs › Button 'Save' "Alt+s"`, `ComboBox 'File name:' "ALT+n"`; `dialog.PictureInsertFromFilePowerPoint › SplitButton 'Open' "Alt+o"`; `dialog.FontDialogPowerPoint › Edit 'Size' "ALT+S"`, `ComboBox 'Latin text font' "ALT+f"`; `dialog.PowerPointParagraphDialog › ComboBox 'Alignment' "ALT+g"` | înainte: `gestTasta` întorcea `null` pentru Alt + literă (aplicatii.js:240-251 la e3300ec9) → nicio stare, niciun eveniment. Acum: aplicatii.js:523-552 (cârligul opt-in `I.la.fereastra`, powerpoint.js:2245): litera din `__nod.ta`, butonul apăsat ca la clic / focus în câmp, un eveniment `tasta_acces` | GRAV (T1) | cod comun, opt-in; Word / Excel au codul lor (word.js:1957, excel.js:3246) și nu primesc cârligul |
| D2 | ferestrele PowerPoint: Tab / Shift+Tab | api_biblioteca.md:176-177 (dlgbox-programming-considerations, sursa citată de api §4); ordinea Tab NU e capturată | înainte: Tab scotea focusul pe `div.lh-ap-sus` (bara de titlu a aplicației), unde tastele mureau. Acum: powerpoint.js:2072-2077 → aplicatii.js:485-515 (`controaleFereastra` în ordinea nodurilor din referință, `I.tabFereastra` circular, din câmp sau din buton) | GRAV (T1) | [presupus] R14-1 pentru ordine |
| D3 | fereastra Font / Paragraph / Insert Table: focusul la deschidere | `acoperire_r12.fapte.b_ctrl_o_browse.la_deschidere.focus: []` (necitit); pentru Font nu e capturat | înainte: focusul pe rădăcina aplicației. Acum: powerpoint.js:985-990 → aplicatii.js:517-522 (primul câmp: Latin text font) | GRAV (T1) | [presupus] R14-1 |
| D4 | fereastră: Enter / Space pe butonul cu focus, Enter pe alt control | api §4 `activat` (ENTER = „IDOK or … default push button”) | înainte: Enter cu focusul în afara câmpului = `fara_efect` (afară de Font / Paragraph / Table). Acum: powerpoint.js:2135-2149 + `implicitDialog` powerpoint.js:994-1003 | GRAV (T1) | [presupus] R14-2 (ce buton e implicit în fiecare fereastră) |
| D5 | fontul temei pe ecran | `acoperire_r12.fapte.c_font.grupuri[0] = {grup:"Theme Fonts", primele:["Calibri Light (Headings)","Calibri (Body)"]}`; `dupa_calibri_light = {Font.Name:"Calibri Light", caseta:"Calibri Light (Headings)"}` | înainte: aplicatii.css:369/371 `'Aptos'` / `'Aptos Display'`, iar fontul ales `'Calibri Light','Segoe UI'` → titlul își schimba literele (208,7 → 190,7 px). Acum: aplicatii.css:369 `Calibri,Carlito,sans-serif`, :372 `'Calibri Light',Carlito,sans-serif`; powerpoint.js:435-439 `stivaFont` (aceeași stivă la Calibri / Calibri Light aleși) → 190,7 px înainte și după | GRAV (T3) | — |
| D6 | fila contextuală Shape Format din taste | `panglica_context.Ctx_ShapeFormat › Group 'Shape Format' tasta_acces "Alt, J D"`, `SplitButton 'Shape Fill' "Alt, J D, S F"`, `SplitButton 'Shape Outline' "Alt, J D, S O"`; `lista.OutlineColorPicker › MenuItem 'Weight' "Alt, J D, S O, W"` | înainte: fila făcută de mână fără `__nod` (fără insignă). Acum: powerpoint.js:686-689 (`__nod.ta` din grupul cu numele filei) → J D, S F / S O / S O, W | GRAV (T2) | — |
| D7 | o listă deschisă din taste, fără litere în referință („Alt, H, S O”) | literele listei există în referință doar pe drumul „Alt, J D, S O, …” | înainte: modul tastelor se stingea, „W” scria „w” în stea. Acum: powerpoint.js:2328 (modul rămâne, literele = `fara_efect`), :2131 (cu o listă deschisă, literele nu intră în diapozitiv) | GRAV (T2) | [presupus] R14-3 / R14-4 |
| D8 | Esc în modul tastelor de acces | api_biblioteca.md:172 „Esc în modul tastelor de acces: `tasta_esc`” | înainte: `tasta_acces / iesire_taste_acces` (aplicatii.js:458 la e3300ec9). Acum: aplicatii.js:238-240 + :467-468 → `tasta_esc / iesire_taste_acces` în PowerPoint, Word, Excel | GRAV (T4) | asistentul (aplicatii.js:628-630) nu-l numără greșeală — de_aprobat A14-3 |
| D9 | lista Font / culori / Shapes deschisă cu mouse-ul + litere | listele deschise nu sunt capturate (README_referinte.md:147-148) | înainte: „arial” intra în titlu cu lista deschisă. Acum: powerpoint.js:2131 + `la.text` / `la.sterge` → `fara_efect` | [FARA_REFERINTA] punctul 5 | [presupus] R14-4 |
| D10 | clicul în textul casetei Font | comentariul constructorilor (R13-4) | înainte: cursor la punctul clicului („CalibAriri Light (Headings)”). Acum: powerpoint.js:1640-1650 (alege tot, și după mouseup) → „Arial” + Enter = Arial | punctul 5 | — |
| D11 | tastarea într-o casetă (Font, File name) | api §4 „La tastare … `dupa` diferă de `inainte`” | înainte: `inainte` = `dupa`. Acum: powerpoint.js:247 + :393-397 `caseta_activa` | MINOR (punctul 5) | de_aprobat A14-2 (cheie în plus) |
| D12 | telefonul: tastarea în note | api §3 ținta `zona_note` | înainte: ținta `diapozitiv`. Acum: powerpoint.js:400-403 (getter `zonaTinta`) | MINOR (punctul 5) | — |
| D13 | asistentul pe „Alt, H, S, F” | api §4: tastele care doar arată literele = `prefix_tasta_acces`, nu greșeli | înainte: H (Home deja activă) = `fila` → 2 greșeli, indiciul la lista bună. Acum: powerpoint.js:2315-2322 → `prefix_tasta_acces`, 1 greșeală (ca la mouse) | MINOR (punctul 5) | — |
| D14 | „Click to add notes” | `acoperire_r12.NEVERIFICAT.zona_de_note_in_uia` (îndemnul nu se poate citi) | înainte: text scris din memorie (R4). Acum: powerpoint.js:546 zona goală rămâne goală | MINOR (punctul 5) | R14-5 (lecția m1-l02:184 citează textul) |
| D15 | adresa ferestrei Open | `acoperire_r12.fapte.b_ctrl_o_browse.la_deschidere.campuri[10] SplitButton 'Toate locațiile'`, `[11] SplitButton 'Documente'`; `butoane: 'Până la "Desktop" …'`, `'Reîmprospătare "Documente" (F5)'` | înainte: adresa goală (nodurile personale scoase din date), „Până la "Temp"”, „Reîmprospătare "<folder>"”. Acum: powerpoint.js:1176-1200 | MINOR (punctul 5) | [presupus] R14-6 (lățimi, „›”) |

## B. Ce nu trece încă (și de ce)
- O4, PowerPoint: `note`, `stea-ctrl-c-v`, `tragere-forma` — aceleași 3 de la pornire (fără rezultat real probat; nu sunt ale rundei).
- Grosimea conturului nu e în `stare()` (R14-7): drumul „Alt, J D, S O, W, ↓…, Enter” emite `contur_forma` cu `activat: 'meniu:3 pt'`,
  dar `inainte` = `dupa` (api §5 n-are cheie).
- MINOR din critic 12 / 13 lăsate: listele la +3 px, „Pov” tăiat, x = −26 pe 360 px, zonele < 32 px, fila „Fill” ca text.
- [FARA_REFERINTA] din critic 13 §6 nereparate (rămân pentru o rundă `acoperire`, deja în de_verificat): tastarea peste o casetă aleasă
  ca obiect (R13-*), Ctrl+S pe o prezentare nesalvată, Delete pe caseta de aspect, Esc după un prefix KeyTips, Alt+F5, Enter / Home /
  End în Slide Sorter, notele fără cursor.

## C. Schimbările de evenimente (O5 și Word / Excel)
- **O5**: 82 → 82 (măsurarea parțială și pasul 7); mulțimea gesturilor picate (aplicație, fel) din `iesiri/O5/oracol_evenimente.json`
  e aceeași ca la pornire (`runde/13/iesiri/O5`): 0 noi, 0 reparate. O5 joacă Esc în zona de lucru, nu în modul tastelor de acces,
  deci T4 nu-l atinge.
- **Word și Excel — singura schimbare de eveniment: T4.** `Alt, H, Esc` (Esc în modul tastelor de acces) emitea
  `{gest:'tasta_acces', actiune:'iesire_taste_acces'}`, acum `{gest:'tasta_esc', actiune:'iesire_taste_acces'}` (proba `t4_word`,
  `t4_excel`: înainte picat, după trecut). Alt apăsat a doua oară rămâne `tasta_acces / iesire_taste_acces`. Niciun scenariu Word /
  Excel nu ascultă evenimentul (grep `scenarii/`: „Escape” doar în `excel-backspace-esc`, `excel-esc-renunta`, la editarea celulei);
  probele vechi Word 2-5 și Excel 6-10 trec ca înainte (7 = 2 și 7-cont2 = 3, aceleași nume ca în runda 13). Asistentul nu mai
  numără acest Esc greșeală, în toate trei aplicațiile (de_aprobat A14-3).
- **Word și Excel — Alt + literă și Tab în ferestre: NESCHIMBATE.** Cârligul nou e opt-in (`I.la.fereastra`, pus doar de PowerPoint);
  Save As din Word (F12, Tab, Alt+N, „Tema”, Alt+S) și din Excel (F12, Alt+N, „Tema”, Alt+S) dau aceleași evenimente înainte și după
  (proba `t1_word_saveas`, `t1_excel_saveas`, comparate element cu element).
- **PowerPoint — evenimente noi / schimbate** (toate pe gesturi care înainte nu emiteau nimic sau emiteau altceva): Alt + literă în
  fereastră = `tasta_acces` (A14-1); Tab în fereastră = `tasta_tab / mutare_focus`; litera filei deja active = `tasta_acces /
  prefix_tasta_acces` (înainte `fila`); literele cu o listă deschisă = `tastare / fara_efect` (înainte `scriere`); tastarea în note pe
  telefon: ținta `zona_note` (înainte `diapozitiv`); `tastare` în casete: `dupa` ≠ `inainte` (cheia `caseta_activa`, A14-2).
