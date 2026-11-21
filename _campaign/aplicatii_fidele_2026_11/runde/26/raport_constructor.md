# Runda 26 · B-windows · unghiul stare_finala_erori — raportul constructorului (21.11.2026)

## Numerele întâi
- **Proba rundei** (`runde/26/proba_grav.py`, gesturi adevărate: tastatură, mouse, `touchscreen.tap` la 360 și 390 px, CDP
  `imeSetComposition` / `insertText`): **36 picate din 81 la pornire → 3 picate din 84 la final** (`probe_iesiri/proba_grav_pornire.json`,
  `probe_iesiri/proba_grav_final.json`). Cele 3 de la final: K3b ×2 (Paint fără tastare pe telefon, fără referință) și S3 maximizare (2 px,
  MĂRUNT). Cele 3 verificări S7 au fost adăugate după pornire; codul vechi le-ar pica (Delete mută pictograma în Coș sub Start,
  `inainte/windows.js:719-725`).
- **Pe GRAV, final**: K1 16/16, K2 6/6, K3 21/21, K3b 0/2, S1-S7 39/40.
- **Regresul**:
  - proba r22: 50/50 (`probe_iesiri/proba_grav_r26.json`); proba r18: 37/37 (`probe_iesiri/regres_r18/proba_windows.json`);
  - Ctrl + literă (și Meta + literă) pe Word, Excel, PowerPoint, Explorer, înainte / după schimbarea din `gestTasta`: **0 diferențe** la
    24 de evenimente pe aplicație și aceeași stare finală (`probe_iesiri/regres_ctrl_litera.json`; copii A / B din același instantaneu,
    B = A fără blocul rundei 26, verificat: `B_gestTasta_ca_inainte: true`). Pe Windows diferă exact cele 4 combinații Meta + literă (voit);
  - oracolele țintite, cu `LH_IESIRE=runde/26/probe_iesiri/…`: O5 = 35 (pornire 35, același set de gesturi picate); O9 = 13 (pornire 13,
    același set de cazuri). **O3 / O8 nemăsurate de mine**: rulate singure, ar fi re-randat toate paginile (cache-ul randării poartă
    amprenta sitului, schimbată de cele 4 benzi); O3 a depășit limita mea de 15 min, iar O8 l-am oprit eu (doar procesele mele).
    Argumentul pentru „neschimbate”: extractorul ia doar `[data-lh-tip]` din suprafețe (`oracole/arbore_randat.js:233`), iar câmpul nou
    n-are `data-lh-tip` și stă direct în rădăcină, în afara oricărei `[data-lh-suprafata]`; O8 numără doar Word / Excel / PowerPoint.
    Rămâne de văzut în măsurarea comună a orchestratorului.
- `masoara.py` întreg NU l-am rulat (îl rulează orchestratorul).

## K1-K3
- **K1 — ÎNCHIS** (cu abaterea A26-2). Windows + E: gestul `win_e` (nu mai e `ctrl_e`), Start închis la final, mesajul central
  „În aplicația reală, „Windows + E” funcționează; aici nu e simulată.”, ecranul = `stare()`; la fel cu o fereastră Explorer deschisă.
  Windows + D: `win_d`, Start închis, mesajul „Windows + D” (ce face real: R26-1; nu e în lecții). Tasta Windows singură deschide / închide
  Start; Ctrl + E pe Windows rămâne `ctrl_e`.
  - Rămâne: Start se deschide la APĂSAREA tastei Windows și se închide la E (o clipă), iar fluxul are `tasta_windows / deschide_start`
    înainte de `win_e`. Windows îl deschide la ridicare. Cauza: evenimentul de la `keyup` ar trece prin `I.emite`, care nu poartă `activat`
    (K2). Cerere: A26-2.
- **K2 — ÎNCHIS.** Asistentul `Start → Paint` jucat cu tastatura (Windows, „pai”, Enter) ajunge la `pas() = 2`, fără indiciu la final;
  `tasta_windows` are `activat: 'bara_activitati:Start'`; Enter are `activat: 'start:Paint'`, ținta = caseta, `actiune: pornire_aplicatie`.
  Drumul cu mouse-ul: tot `pas() = 2`. `L.asistent` neatins.
  - Pe drum, „p” și „a” sunt 2 greșeli (§6.3: tastarea e greșeală), deci indiciul „Alege Paint” apare pe rezultatul Paint înainte de Enter.
    Regula e a `L.asistent` (banda r24), notată la „Găsit pe drum”.
- **K3 — ÎNCHIS** pentru caseta și text; **NEÎNCHIS** partea „Paint fără tastare”.
  - Telefon 360 și 390: atingerea pe casetă pune focusul într-un `<input>` al bibliotecii (font 16 px, fără zoom); textul trimis ca de o
    tastatură de telefon („pa” compus, apoi „pai”) ajunge în casetă, cu `tastare / cautare` și ținta casetei; rezultatul Paint apare, iar
    atingerea lui pornește fereastra Paint și scoate focusul din casetă (tastatura se închide); pagina nu se lățește. Capturi:
    `probe_iesiri/k3_tel360_compune.png` (cuvântul în compunere se vede în casetă), `k3_tel360_pai.png`.
  - PC: textul fără keydown (`insertText`) după tasta Windows ajunge în căutare; clic pe casetă + tastare fizică = un eveniment pe literă,
    textul o singură dată.
  - Paint fără tastare: NU l-am inventat. Paint nu e în `uia_windows.json`, iar categoriile din „Toate” nu se deschid în referință → R26-3
    (captura) + A26-1 (aprobarea). Pe telefon drumul lecției „scrie pai” merge acum.
- **W4 — parțial**, cum era: montarea Explorer-ului e a benzii r23; legarea (inclusiv `activat` pe `win_e` spre Explorer) vine în ciclul următor.

## Unghiul stare_finala_erori (S1-S7)
- S1 Start + Esc / clic în afară: închis, `inchide_start`, ecranul = stare. ✔
- S2 „xqz” (mesajul căutării), Backspace × 3 până la gol: caseta goală, dalele înapoi, Start deschis; încă un Backspace: un eveniment, Start
  deschis; Esc: închis — și de la tastatură, și după clic pe casetă. ✔
- S3 Paint din căutare → Minimizare → butonul din bară → Maximizare → Închidere: fiecare stare = ecranul, butonul Paint pleacă din bară. ✔
  Excepție MĂRUNT: fereastra maximizată iese cu 1 px în dreapta și 2 px peste bară (geometria ia mărimea rădăcinii cu chenarul ei,
  `windows.js:245`); bara e desenată deasupra, deci nu se vede. Nereparat: ar muta tot desenul cu 2 px.
- S4 meniul desktopului › Nou, Esc, Esc: întâi submeniul, apoi meniul. ✔
- S5 Nou › Folder, apoi Esc / nume gol + Enter: folderul rămâne cu numele implicit, redenumirea se încheie. ✔ (La pornire pica din cauza
  probei: al doilea clic dreapta cădea pe folderul creat de primul; reparat în probă.)
- S6 două ferestre, închid fereastra din spate: rămâne cea din față, activă. ✔
- S7 (nou, reparat) Start deschis + pictogramă selectată dedesubt: Delete / F2 / Enter nu o mai șterg / redenumesc / deschid; ținta lor e
  caseta (S-MS „Search box, edit”, §4 „la taste: ținta focusului”). [DEDUS] → R26-2.

## Fișiere comune atinse
- **`aplicatii/aplicatii.js`** — doar zona `litera` / `gestTasta` (dată de orchestrator), 8 rânduri adăugate, nimic șters
  (`runde/26/diff_aplicatii_js.txt`, față de `runde/26/inainte/aplicatii.js`), azi la `:266-275`:
  ```js
    /* runda 26 (critic 22, K1): tasta Windows + literă = gestul ei (`win_e`, `win_shift_s`), nu Ctrl + literă, DOAR în aplicația
       care declară tasta cu sigla a ei (`I.tastaWindows`, azi Windows) și nu pe Mac (acolo Cmd ține locul lui Ctrl). În rest, la fel. */
    const MAC = /Mac|iPhone|iPad|iPod/.test(((W.navigator || {}).userAgentData || {}).platform || (W.navigator || {}).platform || '');
    function gestTasta(e) {
      const k = e.key, c = e.ctrlKey || (e.metaKey && k !== 'Meta');
      if (e.metaKey && !e.ctrlKey && !e.altKey && k !== 'Meta' && !MAC) {
        const rad = e.currentTarget, I = rad && rad.getAttribute ? INST[rad.getAttribute('data-lh-aplicatie')] : null;
        const l = I && I.root === rad && I.tastaWindows ? litera(e) : null;
        if (l) return (e.shiftKey ? 'win_shift_' : 'win_') + l;
      }
  ```
  Păzit pe aplicație: fără `I.tastaWindows` (Word, Excel, PowerPoint, Explorer, Paint) funcția întoarce exact ce întorcea. Apelantul
  (`const g = gestTasta(e)` din ascultătorul de `keydown`, zona r23) neatins.
- **`_campaign/.../api_biblioteca.md`** — doar §4, un rând nou la `:170`, după lista felurilor de gest:
  „`win_<literă>` / `win_shift_<literă>` (runda 26) = tasta Windows + literă, fără Ctrl, doar în aplicația Windows (`I.tastaWindows`) și
  nu pe Mac; în rest tasta cu sigla + literă rămâne `ctrl_<literă>`.”
- `aplicatii.css`, `panglica.js`, `stare.js`, `poligon.html`, `setari.json`, `versiune.json`: neatinse. Clasa comună `lh-ap-intrare` e
  doar FOLOSITĂ de windows.js, nu schimbată.

## Fișierele proprii schimbate
- `aplicatii/windows.js` (copia de dinainte: `runde/26/inainte/windows.js`): câmpul casetei `:380-411`; CSS `:54`; Delete / F2 / Enter cu
  Start deschis `:556-558`, `:573`; `activat` la Enter `:569-570`; Shift+Tab înapoi în casetă `:576`; focus la clic pe casetă `:694`;
  Windows + literă `:741-750`; tasta Windows `:757-759`; `text` / `sterge` `:782-794`; pointerdown pe casetă `:798-800`.
- `date/windows.json`, `genereaza_windows.py`: neatinse.
- `D/de_verificat.md` (bloc `RUNDA26-WINDOWS`: R26-1, R26-2, R26-3) și `D/de_aprobat.md` (bloc `RUNDA26-WINDOWS`: A26-1, A26-2): doar adăugate.

## Cereri
- **A26-1** (Vasile): Paint găsit pe telefon fără tastare — acceptă „scrii pai” / dală fixată / așteptăm captura R26-3.
- **A26-2** (orchestrator, apoi Vasile): Start la apăsare, nu la ridicare. Deblocator: `I.emite` primește `extra` (un rând în `L.deschide`,
  `aplicatii.js` ~`:121`), apoi windows.js deschide Start la `keyup` cu `activat`.

## Găsit pe drum (pentru orchestrator)
- **`L.asistent` (banda r24)**: literele scrise în caseta Start sunt greșeli → pe drumul „Windows, pai, Enter” indiciul apare după a doua
  literă. Indiciul arată locul bun (rezultatul Paint), dar regula îl mustră pe elevul care face exact ce scrie lecția.
- **Pe PC-urile cu Windows ale elevilor** tasta Windows + E o prinde sistemul: pagina vede doar tasta Windows apăsată → Start-ul simulat se
  deschide sub Explorer-ul real (critic 22 §8 „De decis de orchestrator”). Neschimbat de runda asta; A26-2 (Start la ridicare) l-ar
  micșora doar dacă browserul primește `keyup` fără altă tastă [NEVERIFICAT].
- **Când Explorer-ul se montează în fereastra Windows** (ciclul următor): rădăcina Explorer-ului primește întâi `keydown`; Windows + E în
  Explorer ar ieși `ctrl_e` (căutarea Explorer-ului), apoi `win_e` la Windows. De hotărât atunci (cârligul `I.tastaWindows` e pe instanță).

## NEFĂCUT / NESIGUR
- MINOR-urile din `22/critic.md` §6 și `18/critic.md` §6: neatinse (Enter pe un rezultat nesimulat lasă Start deschis; rezultate
  personale ale PC-ului de referință; sufixele UIA în mesaj; opacitatea Start).
- Tastatura ecranului REALĂ nu se poate vedea headless: proba arată focusul într-un câmp editabil după o atingere adevărată și textul
  trimis prin CDP. Pe iOS, focusul dat din „click” (`windows.js:411`) e [presupus] suficient.
- Mac: `MAC` după `navigator.platform` / `userAgentData`; pe Mac nu s-a probat nimic (nu am Mac).
