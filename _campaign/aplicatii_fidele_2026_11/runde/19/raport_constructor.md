# Runda 19 · B-explorer (a doua rundă de construcție, ciclul paralel B) · unghiul gest_tastatura · raportul constructorului (21.11.2026)

## Numerele întâi
| ce | la pornire | după | dovada |
|---|---|---|---|
| `proba_grav.py` · E1 (R12): comenzi nesimulate cu mesajul pe ecran la +40 / +400 / +1500 ms (10 gesturi) + supraviețuire la a doua redesenare + plecare la ~5 s | 10 picate din 11 | **0 din 13** | `probe_iesiri/pornire_toate.log` → `probe_iesiri/final.log` |
| `proba_grav.py` · E2 (I1): redenumirea pe telefon 360 / 390 px (insertText, tastatură fizică, Enter, atingere în afară, Redenumire din bară, F2, Esc, atingere în casetă) + drumurile cu mouse-ul la 1366 | 29 picate din 37 | **0 din 37** | idem |
| `proba_grav.py` · TAST (unghiul): săgeți, Home / End, Enter, Backspace, Alt+← / → / ↑, Alt+Enter, Ctrl+Shift+C, F2, Esc, Ctrl+C / X / V / Z / A, Delete, Shift+Delete, Ctrl+Shift+N, F4, Ctrl+L, Ctrl+E, Ctrl+F, F5 — evenimentul §4, starea, ecranul | 4 picate din 32 (3 cu proba finală pe copia de dinainte: Enter pe fișier fără mesaj, Alt+Enter intră în folder, Ctrl+Shift+C tace; al patrulea era o cascadă a probei) | **0 din 32** | idem + `probe_iesiri/final_inainte.log` |
| `proba_grav.py` · REGRES mesajul central: Word, Excel, PowerPoint, Windows, câte 2 gesturi nesimulate (pe ecran la +40 / +400 / +1500 / +4000 ms, `data-lh-nesimulat`, plecat la +5,7 s) | 0 picate din 12 (cu proba finală; la pornire 1 picat = selectorul probei pe desktopul Windows, reparat în probă) | **0 din 12** | idem |
| O4 pe 47 de scenarii: Explorer 18 + Word 8 + Excel 8 + PowerPoint 13, pe copia ÎNAINTE și pe copia DUPĂ (%TEMP%\r19\…, aceleași fișiere în afară de `aplicatii.js` + `explorer.js`) | 45/47 la fel ca realul, 0 diferențe, 0 ecran ≠ stare (2 = „fără rezultat real probat”, `excel-tragere-umplere-gest`, `powerpoint-stea-ctrl-c-v`) | **identic**: 45/47, 0 diferențe; Explorer **18/18**; ieșirile `_sim` (stare + evenimente) ale celor 47 de scenarii egale câmp cu câmp | `probe_iesiri/O4_inainte/`, `probe_iesiri/O4_dupa/` |
| O5 pe poligon (201 gesturi din `suprafete.json`, toate aplicațiile), ÎNAINTE vs DUPĂ | 35 din 201 fără eveniment valid (= O5 din `masurare_pornire.json`); `explorer.*` 32/32 bune | **identic, rând cu rând**: 35 din 201; `explorer.*` 32/32 | `probe_iesiri/O5_inainte/`, `probe_iesiri/O5_dupa/` |
| O9 pe poligon (48 de cazuri de asistare), ÎNAINTE vs DUPĂ | 13 din 48 picate (toate `F_lectie_asculta` — copia din %TEMP% n-are lecții — și Paint, care nu e în bibliotecă) | **identic, rând cu rând**: 13 din 48; Explorer A-E, G, H trec | `probe_iesiri/O9_inainte/`, `probe_iesiri/O9_dupa/` |

Aceeași probă finală, rulată și pe copia de DINAINTE (`--radacina %TEMP%\r19\inainte`, cu `inainte/aplicatii.js` +
`inainte/explorer.js`): `probe_iesiri/final_inainte.log` → E1 10 / 11, E2 29 / 37, TAST 3 / 32, REGRES 0 / 12 picate (42 în
total); pe worktree, după: `probe_iesiri/final.log` → **0 / 94**. REGRES 0 și înainte, și după: Word / Excel / PowerPoint / Windows
nu își rescriu rădăcina, deci la ele mesajul trăia deja 5 s și trăiește la fel.

`masoara.py` întreg nu l-am rulat (îl rulează orchestratorul, o dată pe ciclu). Cereri plecate în afara 127.0.0.1: 0. Erori de pagină: 0.

## FĂCUT
- **E1 — mesajul central rămâne pe ecran, pentru TOATE aplicațiile** (reparația comună). Cauza reprodusă pe codul de azi: mesajul
  pus în rădăcină (`aplicatii.js:229` la pornire) era șters de `explorer.js:409` (`root.innerHTML = …`) în aceeași milisecundă.
  Acum `aplicatii.js:220-249`: mesajul rămâne SUB rădăcină (api §3, O1 / O8 îl caută acolo); cât trăiește, un `MutationObserver`
  pe rădăcină (doar `childList`) îl pune înapoi dacă lotul de mutații care l-a scos a adus și noduri noi (= o redesenare). Un
  `m.remove()` singur (expirarea la 5 s / 60 s în modul scenariu, mesajul propriu al Word / Excel, o probă care curăță) e
  respectat; dacă alt mesaj i-a luat locul, nu se dublează. Proba: cele 9 gesturi ale criticului (`critic_probe/a4.py`) + Enter
  pe „Mai puține detalii” în dialogul de conflict: 10 / 10 cu mesajul vizibil, sub rădăcină, `role=status`, deasupra a tot
  (`elementFromPoint` din centrul lui = mesajul) la +40 / +400 / +1500 ms; rămâne după o a doua redesenare; la ~5,7 s a plecat și
  o redesenare nu-l readuce.
- **E2 — redenumirea merge pe telefon** (`explorer.js:405, 420-431, 646-648, 675-676, 709-711`). Cauza reprodusă: la +30 ms după
  atingerea pe „Folder” caseta nu mai exista, focusul pe rădăcină. Acum pointerdown-urile se numără; un `blur` venit în ≤ 800 ms
  după ridicarea unei atingeri, fără `pointerdown` nou (= `mousedown`-ul de compatibilitate al aceleiași atingeri), întoarce
  focusul în casetă; o atingere / un clic în altă parte (vine cu `pointerdown`) încheie redenumirea ca înainte. Pe deasupra:
  clicul / atingerea ÎN casetă nu mai redesenează lista (o redesenare punea la loc numele vechi peste ce scrisese elevul — defect
  găsit pe drum, și cu mouse-ul: „Ex” › clic în casetă → „Folder nou”). Proba (360 și 390 px, `isMobile` + `page.touchscreen`):
  Nou › Folder › „Ex Pop Ana” (CDP `Input.insertText` și `keyboard.type`) › Enter sau atingere în afară → `Ex Pop Ana/` în folder
  și pe ecran, calea neschimbată; tema › Redenumire (bara) › „compunere” › Enter → `compunere.docx`; harta › F2 › „harta mare” →
  `harta mare.png`; Desene › Redenumire › „Desen” › atingere în casetă › „e noi” → `Desene noi/`; Esc → numele rămâne. La 1366 cu
  mouse-ul: D1 al criticului (Enter, clic pe fundal, F2 fără extensie, clic în panou) trece.
- **Unghiul gest_tastatura** (`explorer.js:853-857`): Alt+Enter = „Proprietăți” (referința: `uia_explorer.json ›
  explorer_meniu_fisier / explorer_meniu_fundal › „Proprietăți”`, scurtatura `Alt+Enter`) — înainte intra în folder; acum mesajul
  central „Proprietăți”, ca din meniu (critic 15 MINOR 10). Ctrl+Shift+C = „Copiere ca o cale” (`explorer_meniu_fisier`,
  `Ctrl+Shift+C`) — înainte tăcea; acum mesajul, ca din meniu. Restul tastelor din supliment verificate pe eveniment §4 + stare +
  ecran și găsite la fel ca referința (lista în `diferente.md` › „Verificat și la fel ca referința”).
- `cadru.md`, `tinta.md`, `contra.md`, `diferente.md` (D1-D7), `proba_grav.py`, `diff_runda19.patch`; `de_verificat.md` › blocul
  `RUNDA19-EXPLORER` (R19-1 … R19-7).

## Fișiere comune atinse
- **`aplicatii/aplicatii.js`** — DOAR funcția `nesimulat` (cu Edit, două bucăți):
  - rândurile **220-224**: comentariul (era un singur rând, 220);
  - rândul **227**: `if (I._moMesaj) { I._moMesaj.disconnect(); I._moMesaj = null; }` (nou);
  - rândurile **235-246**: `durata` / `pana` + observatorul (`MutationObserver` pe `I.root`, `{ childList: true }`), nou;
  - rândul **248**: temporizatorul oprește și observatorul (era `setTimeout(() => m.remove(), I.opt.scenariu ? 60000 : 5000)`).
  - Păzit pe aplicație: observatorul există doar cât e un mesaj pe ecran și nu face nimic dacă rădăcina nu e rescrisă; Word / Excel /
    PowerPoint nu își rescriu rădăcina după pornire → comportament neschimbat (REGRES 0 din 12; O4 `_sim` identic pe 47 de
    scenarii). Câmpuri noi pe instanță: `I._moMesaj`. Copia de dinainte: `runde/19/inainte/aplicatii.js` (= HEAD c29b583a).
  - `aplicatii.js:229` vechi (unde banda Windows r22 știe să nu umble) e acum în corpul aceleiași funcții, rândul 233.
- Niciun alt fișier comun (`panglica.js`, `stare.js`, `aplicatii.css`, `poligon.html`, `setari.json`, `versiune.json`,
  `api_biblioteca.md`) atins.

## Fișierele proprii atinse
- `aplicatii/explorer.js` (+23 / −2 rânduri; `aplicatii.js` +19 / −2; copia: `runde/19/inainte/explorer.js`). `date/explorer.json`, generatorul, profilul:
  neatinse.

## NEFĂCUT
- **MINOR-urile din `runde/15/critic.md`** (14 px la adresă / căutare / meniuri, gaura din meniul de fundal, pictogramele din
  meniuri, săgeata „Afișați”, bifa, Coșul cu Decupare / Copiere active, selecția după tragere): nefăcute — sunt pe unghiul
  aspect, cer re-măsurarea O3 pe poligon, iar runda a ales să-și închidă probele pe unghiul ei. Deblocator: runda următoare
  Explorer (unghiul stare_finala_erori) sau o rundă de aspect.
- **Proprietăți simulat**: nefăcut (opțional în supliment, nicio lecție nu-l cere); rămâne mesajul central, acum vizibil.
- **Tastele fără referință** (Tab între zone, ← / → în Detalii, Backspace, Ctrl+Shift+N, F4 / Ctrl+L, Ctrl+E / F, tastatura în
  meniuri, Shift+F10): neschimbate, intră în `de_verificat.md` R19-1 … R19-7. Deblocator: capturile / scenariile `gest_real`
  scrise acolo (desktopul ascuns, UIA).

## NESIGUR
- **E2 pe un telefon adevărat**: proba e Chromium headless (`page.touchscreen`, CDP `Input.insertText`). Ordinea „mousedown de
  compatibilitate după pointerup” e cea din Pointer Events / Chromium; pe Safari iOS momentul poate diferi (dacă focusul pleacă
  după > 800 ms, caseta se închide ca înainte), iar apariția tastaturii virtuale la `focus()`-ul dat înapoi nu se poate dovedi
  headless (R19-6).
- **Mesajul acum supraviețuiește redesenărilor în Explorer 5 s** (60 s în modul scenariu), deci rămâne pe ecran și dacă elevul face
  altceva între timp — la fel ca în Word / Excel / PowerPoint azi; e convenția bibliotecii (R12), nu e în aplicația reală. Mesajul
  acoperă bara de jos a ferestrei (`aplicatii.css:157`, `bottom:34px`) cât stă pe ecran, ca la celelalte aplicații.
- **Alt+Enter** dă mesajul și când nimic nu e ales / în Coș (realul: Proprietăți ale folderului / elementului; neverificat, R19-3).
- Lecțiile nu încarcă încă biblioteca pentru Explorer (etapa B): O3 / O7 / O8 ale lecțiilor nu se mișcă din runda asta; nu le-am
  rulat (măsurarea comună e a orchestratorului).
