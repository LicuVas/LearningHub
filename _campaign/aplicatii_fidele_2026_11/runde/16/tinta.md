# Runda 16 · Word · ținta

**Ținta e dată de orchestrator** (`runde/supliment_B_word_runda16.md`): cele 8 GRAV deschise din `runde/5/critic.md`, în ordinea
pagubei pentru elev. GRAV-urile criticului au întâietate față de formula (O3+O4+O8) × lecții, așa că formula nu alege aici;
numerele ei la pornire (`masurare_pornire.json`, toate aplicațiile): O3 = 28919, O4 = 64, O8 = 102. Pe Word, O4 la pornire
(`runde/15/iesiri/O4/oracol_comportament.json`): 54 de scenarii ok, 1 cu diferențe (`word-clic-pune-cursorul`, nu e țintă),
1 neexecutabil (`word-imagine-inserare`), 8 fără rezultat real probat.

| # | GRAV | critic 5 | suprafața | lecția atinsă | proba la pornire |
|---|---|---|---|---|---|
| 1 | S1 + S2 | `:140`, `:159` | `dialog.FileSaveAs`, `dialog.open` (bara de adrese, folderul) | m1-l03:82, :267, :273 | 3/4 pică |
| 2 | S5 | `:207` | `dialog.FileSaveAs` › List „Vizualizare elemente” | m1-l03:171-172 | 2/2 pică |
| 3 | S4 | `:193` | deschiderea unui fișier deja deschis (Open, Recent) | m1-l03:270 (`docuri:0`) | 3/3 pică |
| 4 | S6 | `:224` | Ctrl+N / Blank document (titlul, numele propus) | m1-l03:116 | 2/2 pică |
| 5 | S3 | `:178` | salvarea cu `\ / : * ? " < > |` | m1-l03:156 | 2/2 pică |
| 6 | T6 | `:109` | Alt+↓ în casetele cu ▾ (Font Size, Save as type, Font) | vii/m2-l10:152 (scenariul word-font-size-lista) | 3/3 pică |
| 7 | T5 | `:84` | Word fără document: panglica, tastele | m1-l03:116 | 2/3 pică |

**Fișierele pe care le deține runda (doar acestea se modifică):**
- `aplicatii/word.js` (copia de dinainte: `runde/16/inainte/word.js`, sha256 `8ab18c45…`);
- dosarul `runde/16/`;
- blocurile mele `<!-- RUNDA16-WORD:START/END -->` din `de_verificat.md` / `de_aprobat.md` (doar adăugare).

**Fișiere comune:** niciunul, dacă se poate. Griul fără document se face în `word.js` (ca PowerPoint în `powerpoint.js:625-635`),
nu în `panglica.js`; mesajul pentru numele interzis folosește elementul mesajului central (ca Excel în `excel.js:1383-1390`),
nu un șablon nou în `setari.json`.
