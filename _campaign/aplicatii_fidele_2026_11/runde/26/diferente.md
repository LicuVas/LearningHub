# Runda 26 — tabelul diferențelor (Windows, unghiul stare_finala_erori)

## Sursele citate
- **U** = `referinte/uia_windows.json` (înghețat).
- **C** = `contract.md`: R6 („Fiecare gest al elevului … emite un eveniment standard”), R12 („o comandă afișată și nesimulată dă mesajul
  central standard …, nu tace”), I1 („biblioteca merge la 360-390 px”).
- **A4** = `api_biblioteca.md` §4: „`activat` … = ținta canonică (§3) a butonului pe care TASTA l-a apăsat fără ca butonul să fie ținta
  focusului: Enter într-o fereastră apasă butonul ei implicit”; „la taste: ținta focusului”. **A63** = §6.3: pasul e făcut „din `tinta` SAU
  din `activat`”.
- **S-MS** = pagina Microsoft „Use a screen reader to explore and navigate the Start menu in Windows” (citată și în `22/diferente.md`; nu e
  în `surse_microsoft.md`, care e înghețat): „Press the Windows key to open the Start menu. You hear: "Search box, edit."”; „The list of
  search results is updated as you type”; „press Enter to select it and to perform the action”.
- **L** = textul lecțiilor, citat în `22/critic.md` (K1-K3).

| # | suprafața | ce face aplicația reală / ce cere contractul (citat) | ce făcea simulatorul (fișier:rând, la pornire) | grav. | reparația (rândurile de azi) |
|---|---|---|---|---|---|
| D1 | K1 Windows + E | Comportamentul real NU e în referințele înghețate (critic 22, K1). C › R12: comanda citată de lecție („tasta Windows + E”, 11 lecții, L) nu tace | `inainte/aplicatii.js:267` face din Meta + E gestul `ctrl_e`; `inainte/windows.js:708` deschide Start; fără mesaj; Start rămâne deschis | GRAV | `aplicatii.js:266-275` (comun): `win_<literă>` doar cu `I.tastaWindows`, nu pe Mac; `windows.js:741-750`: Start închis, mesajul central „Windows + E”; `windows.js:393` declară `I.tastaWindows` |
| D2 | K1 Windows + D | Nu e în referințe și nu e în lecții (critic 22 §5) → nu inventez „arată desktopul”; C › R12: nu tace | ca la D1: `ctrl_d`, Start deschis, tăcere | GRAV (R12) | același drum: `win_d`, Start închis, mesajul „Windows + D”. Ce face real: R26-1 |
| D3 | K2 tasta Windows = butonul Start | S-MS: tasta Windows deschide Start; L (vi/m2-l11): „Apasă Start (tasta cu sigla Windows)”; A4 `activat`; A63 | `inainte/windows.js:708`: `seteazaStart` fără `I.activat` → asistentul rămâne la pasul 0 și arată „Deschide Start” peste Start deschis | GRAV | `windows.js:759`: `I.activat = 'bara_activitati:Start'` (și la închidere: tot butonul Start îl închide la clic) |
| D4 | K2 Enter din căutare | S-MS: „press Enter to select it and to perform the action”; A4: Enter apasă butonul implicit → `activat` | `inainte/windows.js:532`: `pornire(…)` fără `I.activat` | GRAV | `windows.js:570`: `I.activat = 'start:' + <rezultatul ales>`; ținta rămâne caseta (focusul) |
| D5 | K3 caseta pe telefon | C › I1, R6, R12; S-MS: caseta e „Search box, edit” (un câmp editabil); L (v/m2-l08): „Scrie „pai” și dă clic pe Paint” | `inainte/windows.js:655`: clicul pune `M.caut = ''`, niciun câmp editabil → tastatura ecranului nu apare; textul ei: 0 evenimente | GRAV | `windows.js:380-411`: `<input>` adevărat (`I.intrare`, `lh-ap-intrare`, `data-lh-intrare-document`) peste casetă, în afara lui startEl; `:694` focus la clic; `:798-800` pointerdown anulat pe casetă (altfel „mousedown”-ul de compatibilitate mută focusul); `:783-794` `I.la.text` / `I.la.sterge` |
| D6 | K3 text fără keydown pe PC (IME, dictare) | S-MS: la deschiderea cu tasta Windows focusul e în „Search box, edit” | focusul rămânea pe rădăcină → `insertText` = 0 evenimente | GRAV | `windows.js:759`: la deschiderea cu tasta Windows focusul intră în câmp (`focusCaut`) |
| D7 | K3b Paint fără tastare pe telefon | Paint NU e în U (`date/windows.json:368`: „Paint nu apare în referința Windows”); categoriile din „Toate” nu se deschid în referință (critic 22 §5) | Paint nu e nicăieri în Start fără tastare | GRAV (pe supliment) | **nereparat** (ar fi o invenție): R26-3 (captura) + A26-1 (aprobarea unei dale / categorii deschise). Cu D5 reparat, drumul lecției (scrii „pai” pe telefon) merge |
| D8 | stare: Delete / F2 / Enter cu Start deschis | S-MS: cu Start deschis focusul e în „Search box, edit”; A4: „la taste: ținta focusului” → tastele sunt ale casetei | `inainte/windows.js:715-727`: Delete muta în Coș pictograma selectată SUB Start, F2 o redenumea, Enter dădea mesajul pictogramei | GRAV (altă stare în laborator) | `windows.js:558`: Delete / F2 → `fara_efect`, ținta caseta; `:573`: Enter pe caseta goală → `fara_efect`. [DEDUS] din S-MS + A4; ce face Windows exact: R26-2 |
| D9 | stare: fereastra maximizată | Fereastra nu are referință (R18-4) | `windows.js:245`: geometria `max` = lățimea / înălțimea rădăcinii cu tot cu chenarul ei de 1 px → fereastra trece cu 1 px în dreapta și 2 px peste bară (bara e desenată deasupra, nu se vede) | MĂRUNT | nereparat (ar muta tot desenul cu 2 px: risc pe O3 fără câștig vizibil); notat |
| D10 | Asistentul pe drumul „Windows, pai, Enter” | A63: „Greșeală = orice alt eveniment al aplicației, în afară de rotita, sageti …” | după D3, „p” și „a” sunt 2 greșeli → indiciul „Alege Paint” apare pe rezultatul Paint înainte de Enter; la Enter dispare | MĂRUNT pentru Windows (indiciul arată locul bun) | NU e zona mea (`L.asistent` = banda r24); notat pentru orchestrator: tastarea în caseta pasului următor ar putea să nu fie greșeală |

## Ce am verificat că NU s-a schimbat
- Ctrl + literă (și Meta + literă) pe Word, Excel, PowerPoint, Explorer: aceleași 24 de evenimente și aceeași stare finală înainte / după
  (`probe_iesiri/regres_ctrl_litera.json`, copii A / B ale aceluiași instantaneu).
- Proba r22 (50/50) și proba r18 (37/37) trec pe codul de azi (`probe_iesiri/proba_grav_r26.json`, `probe_iesiri/regres_r18/`).
