# Runda 27 (B-explorer#2, ciclul paralel D, unghiul aspect) · raportul constructorului · 21.11.2026

## Numerele
| proba (gesturi reale, headless, doar 127.0.0.1) | pornire (`inainte/explorer.js`) | final |
|---|---|---|
| `proba_grav.py` M4 — montarea, caseta de nume la redesenarea gazdei | 11 / 13 picate | 0 / 13 |
| `proba_grav.py` M1 — rândurile meniurilor înalte, cu rotița pe meniu (4 ecrane × 3 meniuri) | 0 / 20 | 0 / 20 |
| `proba_grav.py` M2 — Ctrl+Z / Ctrl+Y în căutare, filtrul = ecranul | 2 / 3 | 0 / 3 |
| `proba_grav.py` REG — redenumirea confirmată de clic / loc gol / căutare / clic în afară, Esc, căutarea, telefonul + G27-1 | 1 / 11 (G27-1: Delete după clicul care confirmă) | 0 / 11 |
| **total `proba_grav.py`** | **14 / 47** (`proba_grav_inainte_final.json`) | **0 / 47** (`proba_grav_final.json`) |
| `probe/aspect27.py` — 141 de dreptunghiuri față de referință (±2 px) + 5 ecrane | 3 | 1 (R27-1, neimplementat: fără referință) |
| O4 Explorer (18 scenarii, `LH_IESIRE=runde/27/probe_iesiri/O4`) | 18/18 | 18/18, 0 diferențe, 0 ecran ≠ stare |

Ieșirile: `probe_iesiri/proba_grav_{inainte,final}.json`, `aspect27{_inainte,}.json`, `O4_final.log`, `c_mont27_final.out`, `d_regres27_final.out`. 0 cereri plecate, 0 erori de pagină în toate.

## FĂCUT
1. **MINOR 4** (critic 23): blur-ul casetei de nume fără element-țintă se hotărăște după funcția gazdei (microtask + MutationObserver pe document). Dacă rădăcina a fost scoasă / pusă înapoi, caseta rămâne cu textul ei și nimic nu se redenumește până la Enter; `instanta.focus()` pune cursorul în casetă; dacă gazda n-a chemat `focus()`, primul clic în altă parte o confirmă. `explorer.js:430-460`, `:699-702`, `:947-948`. Dovada: M4 0/13; `c_mont27_final.out › redesenare in redenumire`: caseta=comp, focusul în casetă, X+Enter → `compX.docx` cu `tasta_enter / redenumire`. `MINOR4_GATA` scris în `stare_autor.md` (banda r30).
2. **G27-1** (găsit la proba MINOR 4, era și înainte): după clicul pe alt rând care confirmă redenumirea, focusul ajungea pe `<body>` (rândul apăsat era redesenat în pointerdown), iar Delete / F2 / Ctrl+C de după nu făceau nimic. Acum focusul rămâne în Explorer (`explorer.js:768-771`). Dovada: `REG › G27_1_delete_dupa_clic_confirmare` și `G27_1_ctrl_z_inapoi` (pornire: picate; final: trec).
3. **MINOR 2**: căutarea filtrează fără să rescrie caseta (`deseneazaLista()` + ascultătorul `input`, `explorer.js:471-489`). Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z lucrează în casetă; filtrul urmează și lipirea, Ctrl+Z și `insertText` (pe telefon, înainte, scrisul fără tastă nu filtra deloc). Pasul de anulare e literă cu literă (Chromium închide grupul de anulare la orice schimbare a paginii între litere — probat pe o pagină goală, cu un `textContent` schimbat: același efect) → R27-3.
4. **MINOR 1**: fără cod. Cu rotița pe meniu, toate rândurile meniului Nou (bară și fundal) și ale meniului clasic se apasă pe 1093×526 @1,25, 1366×768 și 1920×1080, iar pe telefon 360 rândurile Nou (cutia `.lh-ap-e-mw` avea deja `overflow:auto; max-height:100%`); proba criticului 23 (`a_n1b.py`) derula doar pagina. Cu bare de derulare clasice (Chrome headful) cutia se lățește cu bara (309 px), fără bară orizontală (`probe_iesiri/m1_scrollbar_mica.png`).
5. **Aspect**: 141 de dreptunghiuri (bara de titlu, navigarea, adresa, căutarea, bara de comenzi, antetul, rândurile listei, bara de stare, meniurile Nou / Sortați / Vizualizați / fișier / clasic / fundal) față de `date/explorer.json` (= referința: `genereaza_explorer.py --verifica` = 0). Reparate: textul „N elemente” din bara de stare (16 → 24 px, ca `StatusBar › Text [20,782,62,24]`, `explorer.js:119`) și caseta de căutare pe telefonul de 360 px, care ieșea 16 px din fereastră (`explorer.js:147`). Pe toate cele 5 ecrane: fără derulare orizontală a paginii, bara de titlu / bara de stare / Nou / primul rând / căutarea în pagină.

## NEFĂCUT
- **Lățimea panoului de navigare** (lista începe la 348, referința la 403): referința e la o fereastră de 1534 px, poligonul la 1284; ce face Explorer real la o fereastră mai îngustă nu e capturat → R27-1 (deblocator: un dump UIA pe 1284×640).
- **Pașii 7-9** (măsurarea completă, criticul rece, publicarea): ai orchestratorului.
- **MINOR-urile 3, 5, 6 din critic 23 și cele din critic 19**: n-am ajuns la ele (contextul). MINOR 5 (clicul pe bara gazdei confirmă numele) e acum R27-6: nu se știe ce face Explorer real.

## NESIGUR
- Derularea meniurilor cu degetul pe telefon: dedusă din CSS (`touch-action: auto`, niciun `preventDefault` pe touch / pointer, măsurat), neobservată → R27-2.
- `d_regres27` (secvența de 61 de pași a criticului 19/23, worktree vs `inainte`): evenimentele, starea, rândurile și focusul identice la fiecare pas; singura deosebire e câmpul `mes` (mesajul central „Copiere ca o cale” încă pe ecran sau tocmai stins, la ~5 s după Ctrl+Shift+C): prima rulare 3 pași cu mesajul doar în `dupa`, a doua 1 pas cu mesajul doar în `inainte` — ceasul mesajului, nu schimbarea. Restul probei (E1, telefonul, fereastra mică D1, mesajul pe Word / Excel / PowerPoint / Windows): la fel.
- Fonturile și pictogramele: UIA nu le dă (R27-4); vederea „Pictograme mari” n-are referință (R27-5).

## Fișiere comune atinse
Niciunul. (`aplicatii.js` apare schimbat în worktree de benzile r28 / r30, nu de r27.) `api_biblioteca.md` neatins: textul propus e în `api_propunere.md`.

## Fișierele rundei
- `aplicatii/explorer.js` (copia de dinainte: `runde/27/inainte/explorer.js`)
- `de_verificat.md`: blocul `RUNDA27-EXPLORER` (R27-1…R27-6), doar adăugat (copia: `inainte/de_verificat.md`)
- `runde/27/`: `proba_grav.py`, `probe/` (`h27.py`, `m.html`, `aspect27.py`, `c_mont27.py`, `d_regres27.py`), `probe_iesiri/`, `cadru.md`, `tinta.md`, `contra.md`, `diferente.md`, `api_propunere.md`, `stare_autor.md`
- `de_aprobat.md`: nimic (nicio diferență păstrată cu bună știință; cele fără referință sunt în `de_verificat.md`).
