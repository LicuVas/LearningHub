# Raportul constructorului, runda 28 (Word, valul B-word#3, unghiul gest_tastatura; ciclul paralel D)

Numerele întâi. Toate sunt rulate de mine, în `runde/28/`, cu `LH_IESIRE` al meu. Pasul 7 complet (`masoara.py`) îl face orchestratorul.

| măsura | la pornire | la final | unde |
|---|---|---|---|
| `proba_grav.py` (36 verificări, gesturi reale) | **17 picate** | **0** | `proba_grav_inainte.log` (cod din `inainte/`, `LH_R28_INAINTE=1`) → `proba_grav_dupa.log`, `proba_grav.json` |
| O4 doar `word-*` (64 scenarii) | **10** | **8** (cad `word-copiere-lipire` și `word-imagine-inserare`; niciun rând nou; `word-decupare-lipire` tot 0) | `probe_iesiri/O4w_inainte/rele.txt` → `O4w_final/rele.txt` |
| O9 (asistarea, toate aplicațiile) | 13 | **13**, aceleași cazuri (F_lectie ×5, paint ×8) | `probe_iesiri/O9_inainte/rele.txt` → `O9_final/rele.txt` (diff gol pe nume) |
| regresul: probele 24 / 20 / 16 | 0 / 2 / 0 (r24) | vezi tabelul de jos | `regres_rezumat.txt` |

## FĂCUT
1. **Ținta 0, cele două rânduri `word-*` din O4** (`diferente.md` D1, D2):
   - **Pictures ▾** (`word.js:1729-1735`): rândurile „This Device...”, „Stock Images...”, „Online Pictures...” sub antetul „Insert Picture From”, cu tastele de acces Alt, N, P, D / S / O, toate din `runde/26/acoperire_office/capturi_word_brut.json` (A26O-3). „This Device...” deschide Insert Picture, cu mouse-ul (W0b) și cu Alt, N, P, D (W0c: insignele D, S, O apar, evenimentul `tasta_acces` are ținta `meniu:This Device...`). Pentru taste, `meniuLa` (`:1061`, `:1066`) dă rândurilor cu `ta` același `__nod` pe care îl citesc tastele de acces ale panglicii.
   - **Lipirea** (`word.js` › `spatiuInainte`, `lipeste`): spațiul dinaintea textului lipit, doar la capăt de cuvânt, după literă / cifră / punctuație, doar `word365`. „Ana are mere. mere” (W0d, și din Home › Paste, W0g); Ctrl+Z ia lipirea într-un singur pas (W0e); decuparea rămâne „Plecăm luni.Aduceți apă. ” (W0f).
   - O4 `word-*`: 10 → 8. Cele 8 rămase sunt „fără real probat” / neexecutabile pe care nu le poate juca nimeni invizibil (font-size-tastat ×2, tragere-selectie, word2007 ×4) — R26O-1, R26O-2, Word 2007 nu e pe PC.
2. **Ținta 1, asistentul comun** (`aplicatii.js` › `L.asistent`; `diferente.md` D3-D5):
   - (a) **refuzul nu face pasul**: `nesimulat`, `nume_interzis`, `eroare_sortare` nu bifează pasul nici pe ținta lui. AS_a: nume interzis + Enter / + clic pe Save, „already exists” + clic pe Save → `pas 0`, nimic scris; apoi numele bun + Enter → `pas 1`. Proba veche `20/proba_grav.py`: 2 → 0.
   - (b) **Alt+săgeată care nu schimbă starea** (deschide / închide lista unei casete) nu e greșeală. AS_b: Tab, Alt+↓, Esc, Alt+↓ pe drumul PDF → fără bulă; ↓ ×6 + Enter → pasul PDF. Control: Explorer Alt+↑ / Alt+← care mută folderul rămân greșeli (bula după 2).
   - (c) **tastele de editare într-un câmp de text al interfeței** nu sunt greșeli. AS_c: File name (Ctrl+A, 17 litere, Backspace) fără bulă, Enter salvează → `pas 1`; drumul K2 al Windows-ului („Windows, pai, Enter”): fără bulă după litere, `pas` 1 → 2. Control: tastarea în DOCUMENT rămâne greșeală la Word (bula pe Bold după „xy”) și la Excel (în celulă). Un pas cu `asteapta` hotărăște singur (AS_c_asteapta).
   - Regresul pe 5 aplicații (AS_e): două clicuri în gol (la Excel pe două celule) → bula după al doilea, la Word, Excel, PowerPoint, Explorer, Windows.
   - **Pe drum:** cu `indisponibil` între refuzuri, O9 creștea 13 → 15 (PowerPoint E / G: Bold-ul gri e pasul lor). L-am scos; A28-2.
   - Textul pentru §6.3: `runde/28/api_propunere.md` (rândul vechi, rândul nou, de ce).
3. **Ținta 2 (critic 24, MINOR 2):** lista Save as type primește aceeași micșorare `kMic` ca fereastra (`word.js:1174`, `:1398-1403`). La 1093×526: lista 754,5 px = caseta, în fereastră (M2a); rândul PDF cu mouse-ul + Save scrie `.pdf` (M2b). La 1366×768 `kMic` = 1, nimic schimbat.
4. **Ținta 3 (critic 24, MINOR 1):** copiii casetelor Font / Font Size (Edit + ▾) se așază față de colțul casetei, nu față de interiorul chenarului de 1 px (`word.js:23-37`, `STIL_WORD`, doar Word, doar panglica). M1: ±0 față de casetă, +2 față de fereastră (= abaterea casetei însăși), toleranța ±2 (era +3/+3).
5. **Ținta 4, unghiul gest_tastatura** (sursa: support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2, citită 21.11.2026; `diferente.md` D8-D12):
   - **Ctrl+Backspace / Ctrl+Delete** ștergeau o literă; acum un cuvânt (GT1, GT2; Ctrl+Z îl pune înapoi, GT1b). „Delete one word to the left / right.”
   - **Ctrl+↑ / Ctrl+↓** mutau un rând; acum un paragraf, și cu Shift (GT3, GT3b). „Move the cursor up / down by one paragraph.”
   - Ctrl+Home / End (GT4), Ctrl+N, Ctrl+Shift+← / →: la fel ca pagina.
   - Celelalte taste din supliment au scenariu `word-*` cu real și trec în O4 (58/64 la fel ca realul), plus probele 16 / 20 / 24 (Tab / Alt+literă / Alt+↓ / Enter / Esc în ferestre, tastele de acces).
6. **Documentele rundei:** `cadru.md`, `tinta.md`, `contra.md`, `diferente.md` (D1-D12), `api_propunere.md`, blocurile `RUNDA28-WORD` din `de_verificat.md` (R28-1…R28-4) și `de_aprobat.md` (A28-1, A28-2).

## NEFĂCUT (cu deblocatorul)
- **Page Up / Page Down** derulează, dar cursorul rămâne pe loc (pagina: „Move the cursor by scrolling the document view down by one screen”). Unde ajunge cursorul într-un document mai scurt decât ecranul n-are real → R28-4 (deblocator: un scenariu `gest_real` într-o rundă `acoperire`).
- **O4 `word-*` = 8**, toate scenarii pe care nu le poate juca nimeni invizibil (R26O-1, R26O-2, Word 2007) — puse la Vasile de runda `acoperire` r26.
- **MINOR-urile rămase din critic 24:** 3 (telefonul, zone sub 32 px: vechi, criticii 6/11/21 le-au lăsat MINOR), 6 (Alt+F4 pe document: în browser Alt+F4 îl prinde fereastra, R24-5), 7 („already exists” fără întrebare: fără referință, R24-4). Din critic 20: toate cer capturi Word reale care nu sunt pe disc (R20-1…R20-4).
- **O8** nu l-am măsurat în dosarul meu (r24: peste 10 min cu `LH_IESIRE` separat). Schimbările mele nu adaugă comenzi pe drumul lecțiilor; rândurile noi ale meniului Pictures au efect (dialogul) sau mesajul central (Stock / Online). Rămâne pentru măsurarea comună.

## NESIGUR
- [presupus] R28-1: spațiul la lipire în celelalte poziții (mijlocul cuvântului, după „(”, după spațiu) și Word 2007.
- [presupus] R28-2: aspectul antetului „Insert Picture From”.
- [presupus] R28-3: granițele lui Ctrl+Backspace / Ctrl+Delete la punctuație și spații; Ctrl+↑ „paragraful curent, apoi cel dinainte”.
- A28-1 (tastarea în câmp nu e greșeală) și A28-2 (butonul gri bifează pasul) așteaptă decizia lui Vasile.
- Proba „la pornire” a lui `proba_grav.py` servește `word.js` și `aplicatii.js` din `inainte/`, dar restul fișierelor sunt cele de azi (benzile paralele). La Windows asta amestecă `aplicatii.js` vechi cu `windows.js` al benzii r30: `AS_c_windows_enter` pică acolo din amestec. Pe codul neamestecat (prima rulare a probei, înainte de orice scriere a mea; jurnalul ei a fost suprascris de rularea cu `inainte/`) K2 pica la litere: bula „start:Paint” după a doua literă — exact constatarea criticului 26.

## Fișiere comune atinse
- **`aplicatii/aplicatii.js`, doar `L.asistent` și constantele de lângă el** (azi `:657-726`; numerele se mută, pentru că banda r30 scrie deasupra; caută `REFUZ`):
  - `:657-666` comentariul + `const REFUZ = new Set(['nesimulat', 'nume_interzis', 'eroare_sortare']);`, `const EDITARE_CAMP = new Set([...9 gesturi])`, `const aceeasiStare = ev => …` (nou);
  - `:693-707` `const inCamp = ev => {…}` în `L.asistent` (nou; folosește `eCamp` existent);
  - `:715` `const refuz = REFUZ.has(ev.actiune);` și `:717` `else bun = !doarFocus && !refuz && (…)` (înainte: fără `!refuz &&`);
  - `:723-726` `if (ev.gest === 'alt_sageti' && aceeasiStare(ev)) return;` și `if (EDITARE_CAMP.has(ev.gest) && inCamp(ev)) return;` (noi).
  - Copia de dinainte: `runde/28/inainte/aplicatii.js`. `runde/28/diff_aplicatii_tot.txt` are 7 hunk-uri: primele 4 (`:118`, `:184`, `:266`, `:326` în copia veche) sunt ale benzii r30, ultimele 3 (`:629`, `:655`, `:664`) ale mele.
- **Efectul pe celelalte aplicații** (regula e comună, cerută așa de supliment): O9 13 → 13 pe 6 aplicații; AS_e pe 5 aplicații; Excel tastarea în celulă și Explorer Alt+↑/← rămân greșeli. Nicio eroare de pagină (ZZ).
- Fișierul propriu: `aplicatii/word.js` (`runde/28/diff_word.txt`, 10 hunk-uri: `STIL_WORD` + `stilWord`, `stergeCuvant`, `mutaParagraf`, `spatiuInainte` + `lipeste`, `meniuLa` (antet, `ta`), `dialog.kMic`, `listaRef` (`kL`), Pictures, Ctrl+Backspace / Delete, Ctrl+↑/↓).
- `api_biblioteca.md`: NEATINS (înghețat) → `runde/28/api_propunere.md`.

## Regresul (`regres.sh` → `regres_rezumat.txt`, jurnalele în `probe_iesiri/regres_*.log`)
| proba | etalonul (r24) | acum |
|---|---|---|
| `28/proba_grav.py` | 17 la pornire | **0** |
| `24/proba_grav.py` | 0 | **0** |
| `20/proba_grav.py` | 2 (`MINOR_COMUN_asistent_refuz_*`) | **0** (le închide regula (a)) |
| `16/proba_grav.py` | 0 | **0** |
| O4 `word-*` | 10 | 8 (doar cele două rânduri țintă au căzut) |
| O9, toate aplicațiile | 13 | 13 (aceleași cazuri; rulat după ultima schimbare: `probe_iesiri/O9_final`) |
| asistentul pe 5 aplicații (AS_e + AS_c + AS_b) | — | 19/19 |

## Pentru orchestrator
- `api_propunere.md` → o rundă `acoperire` aplică §6.3.
- A28-2: dacă Vasile vrea ca butonul gri să nu bifeze pasul, cazurile E / G ale lui O9 trebuie mutate pe un buton activ (rundă `acoperire`), apoi `indisponibil` intră în `REFUZ`.
- R28-1, R28-3, R28-4: scenarii `gest_real` noi (lipirea în 5 poziții, Ctrl+Backspace / Delete / ↑, Page Down) la următoarea acoperire Office.
