# Ce e altfel în noaptea 01→02.11.2026 (M4, a V-a și a VI-a) — se citește DUPĂ `noapte_10_10\prompturi\_comun.md`, `luni_12_10\prompturi\_zi.md`, `m3_19_10\prompturi\_m3.md`, `m3_noapte_23_10\prompturi\_noapte.md` și `m4_26_10\prompturi\_m4.md`

Toate regulile de acolo rămân în vigoare. Mențiunile despre „luni”, „ziua”, „noaptea 23→24.10”, sesiunile vechi și limitele de atunci sunt vechi. **Legea e `00_GHID_LECTII.md` (25.10.2026)**: unde un prompt vechi și ghidul nu spun la fel, câștigă ghidul.

## Noaptea asta
- E noapte (duminică spre luni). Vasile doarme; calculatorul are ecranul VIZIBIL. **Nimic pe ecranul vizibil.** NU porni aplicații din Magazin / UWP (Paint, Notepad din Windows 11, Clipchamp, Fotografii, Calculator, Setări, Securitate Windows) și NU porni Chrome / Edge reali. Faptele lor = documentația oficială (adresa exactă în `surse.md`) + capturile existente pe sit (jocurile, lecțiile publicate) + probele deja făcute în lecțiile publicate (`_proba\*.json` ale lor); ce nu confirmi → `nesigur`, scris prudent, și în `capturi_lipsa.json`.
- Office (Word / Excel / PowerPoint) doar pe desktopul ascuns (`C:\00\AI_0\tools\hidden_desktop.py`), instanța ta, doar PID-ul tău, cu lacătul `verificare_lectii\lacat_office.py` (PowerPoint rulează o singură dată pe PC); `AddToMru=False`, `Saved=True` + `Close` înainte de `Quit`. Pe PC rulează un WINWORD.EXE care NU e al tău: nu-l atingi, nu te legi de el prin COM (`DispatchEx`, nu `Dispatch` / `GetActiveObject`).
- Paginile publice (scratch.mit.edu, ajutorul Microsoft, Commons) doar în Chromium-ul din Playwright, headless, profil TEMPORAR, fără cont. Probele lecției: pagina servită local, rețeaua blocată (tot ce nu e 127.0.0.1/localhost), închidere DOAR cu `ctx.close()` (regula 24). Înainte și după probe: `python C:/00/AI_0/tools/activitate.py lista | grep -c "nu e în catalog"` — la start (23:00) = 0; ieșirea cu nume NU se salvează.
- Probele lungi (Playwright) rulează pe rând în lecția ta; înainte de o probă grea, `python -c "print(1)"` sub 2 s (6 autori lucrează deodată pe același calculator).
- **Bugetul:** limita săptămânală e la ~58 % și se resetează pe la 11:00 (02.11). Lucrezi pe opus, temeinic, fără grabă. Economia contextului rămâne obligatorie: ieșirile lungi în `_proba\*.txt` (în context doar coada, apoi Grep), pagina scrisă pe secțiuni, `_proba\stare_autor.md` la zi după fiecare etapă (dacă te oprește limita sau un „stream watchdog”, un autor proaspăt continuă din ea). La reluare verifici întâi ce e pe disc.

## Starea (calculată 01.11, 22:56, `dirijor\stare.py`)
- M1, M2, M3 PUBLICATE la toate clasele (lecțiile 1-21). Din M4 sunt PUBLICATE: VI/22, VII/22, VII/23, VIII/22, VIII/23. **V/22** e gata (J5 publicabil) și se publică în noaptea asta, devreme — o citești ca pe una publicată, dar nu o atingi.
- Citește lecțiile publicate de care depinzi ÎNTREGI (pagina, `surse.md` cu „Pentru lecția următoare”, `afirmatii.json`) și nu le contrazici. În `surse.md` faci lista cu ce presupun ele cunoscut și ce acoperi, cu bife.

## Granițele cu vecinii din val (în valul ăsta sunt câte TREI lecții pe clasă)
- În primele ~20 de minute scrii `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\m4_noapte_01_11\granite\<clasa>_l<NN>.md` (5-10 rânduri: ce predai / ceri, ce presupui despre lecțiile publicate și despre vecinii din val, ce extensie faci și API-ul ei pe scurt). Citește fișierele vecinilor de clasă când apar (V: 23 / 24 / 25; VI: 23 / 24 / 25); dacă vă contraziceți, scrii în al tău ce ai schimbat, cu ora („SCHIMBAT 01:20”). Dirijorul arbitrează.
- Vecinul de DINAINTEA ta din val nu e publicat: nu presupui de la el decât ce scrie în granița lui; tot ce folosești de la el (un termen, un exemplu) scrii în granița ta ca „presupun de la <lecția>”, ca dirijorul să poată verifica după publicare.
- Nu folosiți același nume de extensie (verifici că numele e liber în `lectii\_sim\` ȘI în granițele vecinilor).
- **Lecția următoare din plan are nevoie de tine:** scrii în `surse.md` „Pentru lecția următoare” (ce rămâne la elev, fișierele lui, API-ul extensiei tale).

## Deciziile dirijorului (scrise în `m4_noapte_01_11\contract.md`; Vasile le vede dimineață)
1. **V/24-25 = limbaj natural**, fără aplicație de programare (Scratch vine la V/31). Laboratorul = gesturi reale în aplicații deja predate (Paint V/18-22, Explorer V/9-11, browserul V/14), fără profesor și fără cont.
2. **V/23 = probă de antrenament + grila de produs a profesorului** (`C:\00\Projects\Info_Gimnaziu_2026\instrumente\Grila_produs.md`, întocmai); testul unității V-U4 nu există → nimic inventat; întrebarea „Pentru profesor” în `surse.md`.
3. **VI/24 = schema logică** (simbolurile din documentele profesorului / programă — verifici ce scrie acolo; nu inventezi simboluri).
4. VI = Scratch 3 online fără cont; notația de pseudocod = cea a lecțiilor publicate VI/20-22 (verifici exact în paginile lor); Paint nu se pornește.

## Ce NU faci
- Nu atingi lecțiile publicate (nici V/22), motorul, `prezenta.js`, `rezultat-elev.js` sau simulatoarele altora: extensie NOUĂ cu nume nou. Ce ar trebui schimbat într-o componentă comună scrii în `surse.md` „Pentru componenta comună”.
- Nu publici și nu faci commit.

## Răspunsul final
JSON-ul din brief + `"simulatoare_noi":[căi]` + `"pentru_vecini":"…"` + `"nesigur":[…]` + `"atentie_judecator":[punctele riscante]` + `"context_final":"<cât context ai folosit, dacă știi>"`.
