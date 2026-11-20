# Runda 17 (B-excel#2, unghiul stare_finala_erori), raportul constructorului — 20.11.2026

## Numerele (pornire → final)
| măsura | pornire | final | dovada |
|---|---:|---:|---|
| `proba_grav.py` (18 verificări: X10 ×11, A1 ×2, T1 ×5) | 16 picate | **0 picate** | `proba_grav_inainte.log` (codul de dinainte, din `inainte/`, servit dintr-o copie temporară) → `proba_grav_dupa.log` |
| O4 doar pe `scenarii/excel` (64) | 44 | **12** | `probe_iesiri/o4_excel_pornire.log` → `probe_iesiri/o4_excel_lucru1.log` |
| cele 11 scenarii ale acoperirii 14 | 0 trec (32 unități) | **11 trec** (0) | aceleași jurnale |
| celelalte 53 de scenarii Excel | 12 unități | 12 unități, aceleași rânduri | idem (autocompletare-tab, autofit, numere-afisare, separator-virgula, sortare-doua-niveluri, tragere ×2 — neatinse, existau la pasul 7 al rundei 14) |
| `genereaza_excel.py --verifica` | 2 | **0** | `date/excel.json` regenerat din referința înghețată |
| geometria celor 4 liste noi față de `uia_excel.json` | nedesenate | colțul la +3 / +4 px, toate rândurile sub 8 px | `proba/geom.json` |
| probele Excel vechi (regres) | criticul 10 (`runde/10/critic_probe/reg_sumar.txt`): 0 · 0 · 0 · 2 · 0 · 3 · 0 | **0 · 0 · 0 · 2 · 0 · 3 · 0** (r10, r9, r8, r7, r7_cont, r7_cont2, r6 = 20 cazuri), aceleași căderi X6 ×2 / X8 ×3, cerute de probe mai vechi decât referința | `regres/regres_rezumat.txt`, `regres/*.log` |

Pasul 7 complet (`masoara.py`) și O3 / O5 / O8 / O9 sunt ale orchestratorului.

## X10 — ÎNCHIS (de mine pe probă; închiderea GRAV-ului o dă criticul)
- Insert › Insert Line or Area Chart ▾ deschide lista din referință (4 grupuri, 13 rânduri + More Line Charts...); Line pe tabelul atelierului → `tip_grafic` Line, seriile miercuri, joi, vineri, categoriile 8A…8D (X10.1, X10.2; scenariul `excel-grafic-line-galerie` trece).
- Chart Design › Add Chart Element ▾ → cele 11 rânduri, Lines și Up/Down Bars gri (X10.3); Data Labels ▸ dă lista Line (None…Data Callout) la Line și lista coloanelor (…Inside End, Inside Base, Outside End…) la Clustered Column (X10.4, X10.7).
- Right → `etichete_date` Right pe toate seriile, cu cele 12 valori desenate lângă puncte; Outside End pe coloane → 6, 4, 9, 3, 7 deasupra (X10.5, X10.7; scenariile `…-line-data-labels-right` și `…-coloane-data-labels-outside-end` trec). Ctrl+Z le scoate (X10.6).
- Tastele: Alt, N, N, 1, ↓, Enter inserează Line; Alt, J, C, A, D, R pune Right; câte un eveniment pe fiecare tastă, ultimul cu ținta `meniu:Right` (X10.8, X10.9).
- Drumul laboratorului m2-l11 pe calculator (LUNI): Line → seriile 8A, 8B; etichete Right; graficul tras spre dreapta; C5 = 30 → eticheta arată 30 (X10.10).

## Vărsarea — făcută (scenariile O4)
`#SPILL!` în zona ocupată; `=B2:B6`, `=B2:B6&"x"`, `=B2:B6>8` se varsă; Ctrl+↓ / Ctrl+Shift+↓ / Ctrl+↑ se opresc la D6 / D2:D6; Ctrl+A pe D3 → D2:D6; Ctrl+↓ din A7 → A1048576; Ctrl+→ din C7 → XFD7. Toate 8 scenariile `excel-varsare-*` / `excel-ctrl-*` trec.

## A1 — ÎNCHIS pe drumul m2-l11 (de mine pe probă)
- Varianta aleasă: **tragerea cu degetul**. Locul graficului nou e deja cel din Excel real (pe o zonă mai mică decât graficul, Excel îl pune la stânga / sus: `runde/10/probe/com_r10_c.json`, verificat de criticul 10 la `critic.md:65-75`), deci și în Excel graficul acoperă tabelul pe un ecran mic; lecția cere tragerea (m2-l11:64). Motivul în `diferente.md` rândul 12.
- Cauza găsită: pe lângă lipsa `touch-action`, `mutaGrafic` înlocuia elementul atins la fiecare pas, iar atingerea rămânea „capturată” pe elementul scos din pagină (de aici un singur `pointermove`).
- Proba la 375×667, cu atingeri CDP: tragerea de margine mută graficul 177 px de grilă (înainte 12), cu evenimentul `tragere / mutare_grafic` (A1.1); sub C5 e celula, iar atingere + „30” + Enter → C5 = 30 (A1.2).
- Ce nu e închis: ștergerea graficului pe telefon (Backspace / Cut) n-are referință → `de_verificat.md` R17-1.

## T1 — ÎNCHIS (de mine pe probă)
- `I.zonaTinta` e getter în `excel.js` (ca `powerpoint.js:400`): cu titlul ales literele de pe telefon au ținta `grafic:1/titlu` (T1.1), cu graficul ales „30” are `grafic:1` (T1.3). `aplicatii.js` NU s-a schimbat.
- Asistentul cu pasul pe ținta titlului: după cele 3 litere pasul e făcut, fără indiciu (T1.2; înainte: indiciul după a doua literă).
- Paritatea: asistentul criticului 10 (pasul 2 cu `asteapta: actiune === 'titlu_grafic'`) dă ACELAȘI rezultat pe telefon și pe calculator (T1.4). Atenție: în ambele apare indiciul după a doua literă, fiindcă §6.3 numără greșeală orice eveniment care nu satisface `asteapta` (`aplicatii.js:624-632`) — e regula contractului, nu ținta; pe calculator se întâmpla la fel și înainte de rundă (`proba_grav_inainte.json` › T1.4: `pc.indiciu` 1, ținte `grafic:1/titlu`; `tel` ținte `celula:A1`).

## Fișiere comune atinse
Niciunul. (`git diff --stat` mai arată `aplicatii.js` +1, `poligon.html`, `word.js`: munca altor benzi, nu a mea.) Deci regresul Word / PowerPoint nu e cerut.

## Fișierele rundei
- `aplicatii/excel.js` (copia: `inainte/excel.js`); `aplicatii/date/excel.json` (regenerat; copia: `inainte/excel.json`);
- `de_verificat.md` (blocul RUNDA17-EXCEL: R17-1…R17-3), `de_aprobat.md` (A17-1); copiile în `inainte/`;
- `runde/17/`: cadru, tinta, contra, diferente, `proba_grav.py` + `proba/` (h17.py, geom.py), `regres.sh`, jurnalele.

## NEFĂCUT / NESIGUR
- **R17-1, R17-2, R17-3** [NEVERIFICAT]: Backspace / Cut cu graficul ales, Data Labels la Bar / Pie, etichetele după Change Chart Type. Le lămurește o rundă `acoperire`.
- **A17-1** (de aprobat de Vasile): grila nu se lungește până la A1048576 / XFD; starea și Name Box au adresa reală.
- **Literele submeniului Data Labels** („R” = Right): citire a AccessKey-ului „ALT+R” din referință, nu un gest capturat în Excel (contra.md).
- Gestul de mouse real pe galeria Line, într-un Excel vizibil, n-a fost jucat nici la acoperire (acoperire_excel.md §7).
- O3 / O5 / O8 / O9 nu le-am rulat (pasul 7 al orchestratorului).
