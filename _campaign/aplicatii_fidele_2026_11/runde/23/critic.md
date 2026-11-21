# Runda 23 (B-explorer, a treia rundă; ciclul paralel C) · criticul rece · unghiul STARE_FINALA_ERORI (21.11.2026)

## 1. Antet
- **Ce am judecat:** `aplicatii/explorer.js` (diff-ul rundei = `23/diff_runda23.patch`, verificat cu `git diff` la 03:33: aceleași hunk-uri)
  + hunk-ul N2 din `aplicatii.js:415-426` + rândurile din `api_biblioteca.md` §1 (`:38-41`) și §4 (`:191-194`), așa cum sunt în worktree.
- **Cum am probat:**
  - server static pe `127.0.0.1`, port liber, peste `C:/00/Projects/LearningHub_fidel` (sau peste copii în %TEMP%), oprit la final;
  - Chromium headless; `ctx.route("**/*")` abandonează tot ce nu e 127.0.0.1/localhost; **0 cereri plecate, 0 erori de pagină în toate probele**;
  - gesturi reale: `page.mouse`, `page.keyboard`, `page.touchscreen`; scrisul prin CDP (`Input.insertText`, `Input.imeSetComposition`).
  - Clipboardul: Ctrl+C / Ctrl+V în câmpuri merg pe clipboardul intern al Chromium headless; am verificat că textul probei NU a ajuns în
    clipboardul Windows (răspuns doar da/nu, fără să citesc conținutul).
- **Scripturile** în `critic_probe/`, ieșirile în `critic_probe/iesiri/` (hamul `h.py`, copiat de la criticul 19):
  - A: `a_n2.py`, `a_n1.py`, `a_n1b.py`; regresul N2: `c_regres_n2.py`;
  - B: `b_sfe.py`; C: `c_mont.py`; D: `d_regres.py`.
- **Ce n-am atins:** Explorer, Windows, Word, Excel, PowerPoint reale; ecranul omului; nimic sub `aplicatii/`.
- **Ce n-am rulat:** `masoara.py`, `porti.py`, git care scrie.
- **În afara `critic_probe/`:** doar copii în %TEMP% (`r23_critic_regres`, `r23_critic_n1b`, …), șterse la finalul fiecărui script.
- **Banda Excel (r25)** lucra în paralel: `excel.js` era modificat în worktree la 03:33. Copiile mele din %TEMP% sunt luate dintr-o
  singură clipă, deci comparațiile „înainte / după” nu sunt atinse de schimbările ei.

## 2. A. GRAV-urile vechi

### N2 (critic 19, `:137`) — scurtăturile ajungeau la browser din câmpurile Explorer — **ÎNCHIS** (`a_n2.py` → `iesiri/a_n2.json`, `a_n2.log`)
**Gestul criticului 19**, în fiecare dintre cele patru câmpuri:
- caseta de nume deschisă cu F2 pe harta;
- caseta de nume deschisă cu Ctrl+Shift+N (Folder nou);
- adresa (F4);
- căutarea (Ctrl+E, apoi „ha”).

Câmpul se redeschide înaintea fiecărei taste, iar `defaultPrevented` se citește pe `window`, în faza de bubble (după ascultătorul bibliotecii).
- **Oprite (`defaultPrevented: true`) în toate patru câmpurile, 36 / 36:** F1, F3, F4, F5, F6, F7, F10, F11, F12, Shift+F10,
  Ctrl+R / P / S / L / E / F / D / H / J / O / U / G / K, Ctrl+Shift+Delete / B / I / C / N, Alt+← / → / ↑ / Home / Enter, Ctrl+Tab,
  Ctrl+PageDown, Ctrl+Enter.
- **Câmpul și starea rămân:** după fiecare tastă oprită, focusul e tot în câmp, valoarea e aceeași, iar `nume_fisiere`, `cale_curenta` și
  `selectie` nu se schimbă.
  - Excepție firească: Alt+Enter și Ctrl+Enter sunt Enter. În casetă confirmă numele, iar în adresă navighează.
- **Martorul regulii:** aceleași taste cu focusul în listă sunt oprite la fel.

**Gestul vecin: tastele de editare.** Aceeași secvență de 30 de taste reale am jucat-o pe un `<input>` martor, pus în pagină în afara
aplicației, și apoi în fiecare câmp:
- tastarea, Home / End, Ctrl+← / →, Ctrl+Shift+←, Shift+→ / Home / End;
- Ctrl+A / C / V / Z / Y / Shift+Z / X;
- Backspace, Delete, Ctrl+Delete, Ctrl+Backspace;
- `insertText` „ăîșțâ” și compunerea IME „ș”.

Rezultatul:
- caseta de nume (F2 și Ctrl+Shift+N) și adresa: **0 diferențe** de valoare / selecție față de martor; nicio tastă oprită;
- căutarea: 2 diferențe, ambele la Ctrl+Z (vezi MINOR 2). Cauza e redesenarea căutării, care e dinainte de runda 23 (`explorer.js:828`). Nu e hunk-ul N2: tasta NU e oprită (`prev: [false]`).

**Ce nu trebuie să facă aplicația cu focusul în câmp** (`a_n2.json › efecte`). Pregătirea: notite e șters, iar tema copiată.
- **În caseta F2** am apăsat Ctrl+Z, Ctrl+A, Ctrl+V, Backspace, Ctrl+X, Ctrl+Y, Ctrl+D și Delete:
  - starea nu se schimbă: notite NU revine din Coș, nu se lipește nimic, nu se alege tot, nu se șterge nimic;
  - tastele lucrează doar în text.
- **În adresă și în căutare** am apăsat Backspace, Ctrl+Z, Ctrl+A, Ctrl+V, Alt+←, Alt+↑, F5 și Ctrl+D:
  - starea și calea nu se schimbă;
  - în căutare se schimbă doar `ordine_afisata`, după textul scris, cum e firesc.

**Rămâne neoprit, ca înainte, și în listă și în câmpuri:** Alt+D / Alt+F / Alt+E, Ctrl+1 și zoomul (Ctrl+− / = / 0).
- `gestTasta` le dă `null`, iar ascultătorul iese înainte de condiție (`aplicatii.js:398`).
- Nu pierd lucrul elevului: mută focusul în bara browserului, deschid meniul Chrome, schimbă fila sau zoomul.
- E `[FARA_REFERINTA]` 3 al criticului 19. Nu e N2.

**Regresul N2 pe celelalte aplicații** (`c_regres_n2.py` → `iesiri/c_regres_n2.log`). Metoda:
- două copii ale lui `aplicatii/`, luate în aceeași clipă din worktree: `dupa`, așa cum e, și `inainte`, cu hunk-ul N2 înlocuit prin rândul vechi `:407`;
- aceleași gesturi reale pe amândouă;
- la fiecare pas compar focusul, valoarea + selecția câmpului, evenimentele §4 și starea.

| drum (pași / cu focusul în câmp) | diferențe în câmp, evenimente, stare | `defaultPrevented` schimbat |
|---|---|---|
| Word, Save As › File name (29 / 24): tastare, Ctrl+A/C/V/Z/X, Home, Shift+End, ăîșțâ, Ctrl+←, Ctrl+Backspace, Alt+↓, Tab, Esc, Enter | **0** | F12, Ctrl+S, Ctrl+P, Ctrl+R, F4 (false → true) |
| Word, Ctrl+S de două ori în File name, apoi Enter (9 / 6) | **0** | Ctrl+S ×2 |
| Word, F12 de două ori în File name, Esc, F12 (8 / 6) | **0** | F12 ×2 |
| Word, Open (Ctrl+F12) › File name (9 / 7) | **0** | Ctrl+O |
| Word, documentul: tastare, Ctrl+A/B/Z/C/V, F5, Ctrl+S (14 / 1) | **0** | — |
| Excel, Name Box (17 / 16) | **0** | F5, F4, Ctrl+S, Ctrl+R, Alt+↓ |
| Excel, editarea în celulă: F2, Ctrl+A/C/Z, ș, F4, Alt+Enter, „=SUM(” (19 / 0) | **0** | — |
| PowerPoint, textul din diapozitiv (12 / 0) și Font Size (11 / 10) | **0** | F5, Ctrl+S (Font Size) |
| Windows, Start + căutare (13 / 0) și redenumirea pictogramei (14 / 12) | **0** | F5, Ctrl+R, Alt+← (redenumire) |
| telefon 390×844: Word `insertText`, Explorer Nou › Folder + „Ex Pop” + Enter, Windows Start (9) | **0** | — |

- **F12 / Ctrl+S în File name (cererea orchestratorului):** fac exact ce făceau.
  - F12 = eveniment `tasta_f12 / tasta_f12`, fereastra rămâne, textul rămâne;
  - Ctrl+S = `ctrl_s / ctrl_s`, fereastra rămâne;
  - Enter salvează (`tasta_enter / salvare`), iar Esc + F12 redeschide Save As cu `Doc1.docx` ales.
  - Singura schimbare: browserul nu mai primește tasta, deci nu mai deschide DevTools sau „Salvează pagina”.
- **Câmpurile reale:** editarea în celulă Excel, textul din diapozitiv, căutarea din Start și telefonul trec prin intrarea documentului
  (`data-lh-intrare-document`, scutită de `eCamp`, `aplicatii.js:303`), deci hunk-ul nu le atinge. În tabel se vede „0 cu focusul în câmp”.
- **Concluzia:** N2 e închis. Hunk-ul nu schimbă nimic altceva în Word, Excel, PowerPoint, Windows sau pe telefon.

### N1 (critic 19, `:113`) — pe fereastra mică, mesajul central ieșea sub marginea ecranului — **ÎNCHIS** (`a_n1.py` → `iesiri/a_n1.log`; `a_n1b.py` → `iesiri/a_n1b.log`)
**Gestul criticului 19**, la 1093×526 css, factor 1,25:
- **Clic pe „Acest PC”** în panou: `clic / nesimulat`, iar mesajul e la `[361,456,370,35]`, `inPagina: true`, `deasupra: true`.
- **tema + Alt+Enter:** `tasta_enter / nesimulat`, mesajul la `[356,456,380,35]`, în pagină și deasupra.
- **Măsurătorile ferestrei:**
  - rădăcina are `[0,0,1093,526]`, iar `scrollHeight` 526 = `innerHeight`, deci nimic sub pliu;
  - bara de stare e la y 492-516, în pagină: MINOR 7 vechi din critic 15 e închis și el;
  - la 1366×768 rădăcina are tot 640 px, cu mesajul la y 570;
  - pe telefon (360×740, 390×844) mesajul e în pagină și deasupra.

**Gesturile vecine** pe fereastra mică:
- **Clic dreapta › Proprietăți:** mesajul e în pagină și deasupra.
- **Dialogul Shift+Delete** (2 butoane) și **dialogul de conflict** (tema lipită de două ori în Desene, 4 butoane): toate țintele sunt în pagină și deasupra.
- **Meniurile, comparate cu `explorer.js` de dinainte de rundă** (`23/inainte/explorer.js`, pe o copie). Pentru fiecare rând am verificat
  dacă se poate apăsa, prin `elementFromPoint` din centrul lui:

| meniul pe 1093×526 | înainte de r23 (rădăcina 640, pagina derulabilă) | acum (rădăcina 526) |
|---|---|---|
| clic dreapta pe tema (meniul Windows 11, 19 rânduri) | 6 rânduri sub pliu, doar cu derularea paginii („Afișați mai multe opțiuni” și rândul Decupare / Copiere / Redenumire / Partajați / Ștergere) | **19 / 19 apăsabile**, fără derulare (meniul urcă la y 2) |
| clic dreapta pe loc gol (drumul v/m2-l10, 8 rânduri) | „Afișați mai multe opțiuni” doar cu derulare | **8 / 8** |
| Nou (bara sau meniul de fundal, 21 de rânduri) | Folder … PowerPoint apăsabile; Publisher, Python, Document text, Excel doar cu derulare; ZIP deloc | Folder … PowerPoint apăsabile; **5 rânduri de jos deloc** (MINOR 1) |

- **Drumul lecțiilor e Nou › Folder.** E primul rând al meniului și e apăsabil, la fel ca Redenumire și Ștergere din meniul de clic dreapta.
  - Am căutat în cele 8 lecții și în `lectii/_sim/explorer-*.js`: niciuna nu folosește rândurile pierdute.

**Concluzia:** N1 e închis. Pe drumurile lecțiilor, fereastra mică se poartă acum mai bine decât înainte.

### G23-1 (găsit și reparat de constructor) — „a/b” la redenumire făcea fișierul să dispară — **ÎNCHIS** (`b_sfe.py › 2_interzis_*`)
- **Proba:** am scris pe rând în caseta F2 a lui harta cele 7 nume interzise „a/b”, „x:y”, „de ce?”, „a<b>”, „c\d”, „pipe|”, „ghil"”, iar pe Desene „Des/ene”.
- **Rezultatul, pe fiecare:**
  - numele rămâne (`harta.png`, `Desene/`), iar ecranul = starea;
  - evenimentul e `tasta_enter / nesimulat / lista:harta.png`;
  - apare mesajul central „avertizarea pentru semnele \ / : * ? " < > | din nume”.
- **Nimic nu dispare** din listă.
- Comportamentul real (balonul de lângă casetă) rămâne la `[FARA_REFERINTA]` (R23-2, A23-2).

## 3. B. Unghiul STARE_FINALA_ERORI pe Explorer (`b_sfe.py` → `iesiri/b_sfe.json`, `b_sfe.log`; `b_sfe2.py` → `iesiri/b_sfe2.json`)
Fiecare greșeală am jucat-o pe o pagină nouă (1366×768), cu gesturi reale. După fiecare am comparat:
- `stare()` cu ecranul: rândurile afișate = `ordine_afisata`, rândurile `data-lh-selectat` = `selectie`, dialogul de pe ecran = `stare.dialog`;
- evenimentele §4;
- asistentul §6.3.

**Ecranul = starea în toate cele 26 de cazuri (0 nepotriviri).**

| greșeala | starea finală / ecranul | evenimentul §4 | referința |
|---|---|---|---|
| redenumire cu nume existent: „notite - Copie” → „notite”, Nu / Da | dialogul „Redenumire fișier” · „Redenumiți "notite - Copie.txt" ca "notite (2).txt"?” · Da / Nu. **Nu**: numele rămân. **Da**: `notite (2).txt`, ales | `tasta_enter / redenumire`, apoi `clic / raspuns / fereastra:Nu` (`:Da`) | `explorer_redenumire_nume_existent_nu` / `_da`: același titlu, aceeași formă a întrebării, aceleași butoane |
| aceeași greșeală cu altă scriere („NOTITE”) | **`NOTITE.txt` lângă `notite.txt`**, fără dialog | `tasta_enter / redenumire` | nu e capturat → `[FARA_REFERINTA]` 1 |
| folderul Proiect → „Desene” (există) | numele rămâne; mesajul „Redenumire” | `tasta_enter / redenumire` | R15-9 (dialogul pentru folder nu e capturat), vechi |
| folderul Proiect → „desene” | **`Desene/` și `desene/` în același folder** | `tasta_enter / redenumire` | `[FARA_REFERINTA]` 1 |
| semnele interzise (8 nume) | numele rămâne; mesajul central | `tasta_enter / nesimulat` | R23-2 |
| Esc după ce a scris „compunere” | `tema.docx` neschimbat, ales | `tasta_esc / anulare_redenumire` | — |
| Esc în Folder nou, după „Ex” | `Folder nou/`, ales | `tasta_esc / anulare_redenumire` | `explorer_folder_nou` |
| Nou › Folder de 3 ori (al 2-lea cu caseta primului încă deschisă) | `Folder nou`, `Folder nou (2)`, `Folder nou (3)`; caseta pe ultimul | `clic / folder_nou / meniu:Folder` ×3 | `explorer_folder_nou_2` |
| Nou › Folder, Esc, Ctrl+Z | folderul nou dispare | `ctrl_z / anulare` | — |
| Delete, Ctrl+Z, Ctrl+Z, Ctrl+Y | harta în Coș → înapoi → `fara_efect` → din nou în Coș (`in_cos: [harta.png]`) | `stergere`, `anulare`, `fara_efect`, `refacere` | `explorer_stergere_cos` |
| Ctrl+X, Ctrl+V în același folder | fișierele neschimbate; tema e „tăiată” (estompată) după Ctrl+X și normală după Ctrl+V; selecția se golește | `decupare`, apoi `lipire` (schimbă doar selecția) | R23-3 |
| Delete pe notite, apoi Ctrl+X / Ctrl+V tema în același folder, apoi Ctrl+Z | **primul Ctrl+Z nu face nimic** (`anulare`, `dif: false`); abia al doilea aduce notite | `ctrl_z / anulare` ×2 | `[FARA_REFERINTA]` 2 |
| Ctrl+V fără nimic copiat; Ctrl+V după X+V | nimic | `ctrl_v / fara_efect` | — |
| Backspace fără istoric; Backspace după o navigare | `fara_efect`; înapoi o dată, apoi `fara_efect` | `tasta_backspace` | `explorer_fereastra › Înapoi (Alt+Stânga)` |
| căutarea „zzz”, apoi Esc | lista goală, **fără niciun text** (`golText: ""`), `ordine_afisata: []` = ecranul; adresa rămâne „Documente › Clasa a V-a”; Esc → toate cele 5, harta tot aleasă | `tastare / cautare / cautare`, `tasta_esc / fara_efect` | R23-4 → `[FARA_REFERINTA]` 3 |

**Asistentul §6.3** (`b_sfe2.json › asist_*`). Pasul e `bara_comenzi:Partajați`, care nu e o greșeală, cu `dupaGreseli: 2`, pornit chiar înaintea greșelii.
- În toate cele 6 cazuri, indiciul vine **la a doua greșeală**, nu mai devreme:
  - scrisul în casetă;
  - semnele interzise (`nesimulat`);
  - Ctrl+V gol (`fara_efect`);
  - Backspace fără istoric;
  - căutarea fără rezultat;
  - martorul O9 (clic într-un loc gol).
- E exact §6.3. Literele scrise în caseta de nume și în căutare se numără greșeli (vezi MINOR 3).

**Constatarea unghiului: niciun GRAV nou cu dovadă.**
- Cele 9 greșeli tipice se termină într-o stare coerentă, cu ecranul = starea și cu evenimentul potrivit.
- Unde există referință (nume existent, Folder nou ×2, Coșul, copia), se potrivesc cu ea; O4 dă 18/18 (C).
- Trei comportamente sunt bănuite greșite, dar referința nu le acoperă: `[FARA_REFERINTA]` 1-3.

## 4. C. Montarea (A22-1) și Explorer-ul deschis normal (`c_mont.py` + pagina mea `m.html` → `iesiri/c_mont.json`, `c_mont.log`; O4 → `iesiri/O4.log`)

### C1. Opțiunea din api §1, pe o gazdă proprie
Gazda e un `div` cu bară de titlu și corp, care numără evenimentele venite din Explorer la ea, la `document` și la `window`. Montarea:
`deschide('explorer', {loc: corp, incadrat: true})`.

**Ce face cum scrie în §1:**
- **Fără bara de titlu și fără desktop:** 0 ținte `bara_titlu`, 0 `.lh-ap-e-desk`. Rădăcina = corpul gazdei, `[41,63,980,568]`.
- **`stare().titlu`:** „Exercitii - Explorer” (fără `continut`, folderul implicit e „Exercitii”). După dublu clic pe Desene devine „Desene - Explorer”, cu calea `Documente/Exercitii/Desene/`.
- **Evenimentele oprite în rădăcină.** Am făcut 15 gesturi: clic, clic dreapta + Esc, rotița, dublu clic, Backspace, F2 + scris + Enter.
  - **0** ajung la gazdă, la `document` și la `window` (faza de bubble);
  - evenimentele `lh-aplicatie` vin toate, ca în poligon;
  - redenumirea dă `note.txt`.
- **Tastele în Explorer-ul montat:** F5, Ctrl+R, Alt+←, Ctrl+P sunt oprite (`defaultPrevented: true`).
- **Redesenarea gazdei cu focusul în listă** (`redeseneaza()` rescrie stratul și pune înapoi `instanta.radacina`, apoi cheamă `focus()`):
  - focusul se întoarce în Explorer;
  - ↓, Delete, Ctrl+Z și clicul pe „Acest PC” merg;
  - mesajul central e în pagină și deasupra;
  - gazda nouă primește 0 evenimente.
- **`inchide('explorer')`:** 0 rădăcini, 0 mesaje rămase.

**Ce NU face cum scrie** (MINOR 4 și 5; montarea nu e pe drumul niciunei lecții încă):
- **Redesenarea gazdei în mijlocul redenumirii.** Pașii: F2 pe tema, „comp”, apoi `redeseneaza()`.
  - Caseta dispare.
  - Numele se schimbă pe loc în `comp.docx`, cu textul neterminat, și **fără niciun eveniment §4**.
  - Focusul ajunge în listă, iar „X” + Enter de după dau `tastare / fara_efect` și „Deschideți” pe `comp.docx`.
  - §1 (`api_biblioteca.md:40`) promite: „mutarea păstrează starea”.
  - **Cauza:** `explorer.js:430-439`. La scoaterea din DOM, `blur`-ul casetei confirmă redenumirea. Doar redesenarea proprie e marcată (`redesenez`); mutarea făcută de gazdă nu e.
- **Clic în bara gazdei** (adică bara de titlu a ferestrei Explorer, la montare):
  - cu meniul Nou deschis: meniul rămâne deschis. La fel în poligon, cu un clic sub rădăcină (`d_regres.json › meniu_clic_afara_poligon`);
  - cu caseta deschisă: redenumirea se confirmă (`h2.png`), dar fără niciun eveniment Explorer.

### C2. Cele două probleme declarate (gazda Windows a constructorului, `probe/montare.html?gazda=windows`) — doar starea, nu le număr
- **Clic pe rândul harta:** vin două evenimente, `windows / clic / clic / lista:harta.png` și `explorer / clic / selectare / lista:harta.png`.
  Dublura e încă acolo, cum a declarat constructorul.
- **`LH.aplicatii.deschideSuprafata('meniu_nou')`:** o ia Windows (întoarce `false`), iar meniul Explorer-ului nu se deschide.
  - Încă „prima aplicație vie” (`aplicatii.js:187-188`).
- Amândouă așteaptă A23-1 (P1 + P2 din `propunere_comun_A22-1.md`), neaplicat.

### C3. Explorer-ul deschis normal
- **Pixelii și țintele la 1366×768:** aceeași pagină și aceleași gesturi, pe worktree și pe o copie cu `explorer.js` de dinainte de rundă (`23/inainte/`).
  Pe 6 cadre: pornirea, meniul Nou, meniul fișierului, meniul de fundal, caseta F2, dialogul Shift+Delete. Rezultatul:
  - **0 pixeli diferiți;**
  - **0 ținte mutate peste 2 px** (50-71 de ținte pe cadru);
  - 0 ținte care există doar într-una dintre variante.
- **O4** (`oracol_comportament.py --scenarii critic_probe/iesiri/scen_explorer`, `LH_IESIRE=critic_probe/iesiri/O4`): **18/18**, 0 diferențe, 0 ecran ≠ stare.

## 5. D. Regresul (`d_regres.py` → `iesiri/d_regres.json`, `d_regres.log`)
- **Tastele și clicurile criticului 19** (tabelul B1, 61 de pași), pe worktree și pe o copie fără schimbările rundei 23. Copia are
  `explorer.js` din `23/inainte` și hunk-ul N2 înlocuit cu rândul vechi. Pașii jucați:
  - săgeți, Shift+↓, Home, End, „d”, Esc;
  - dublu clic Desene, Backspace, Alt+→ / ← / ↑;
  - Alt+Enter, Ctrl+Shift+C;
  - F2 / Esc / F2 + „știri” + Enter, Ctrl+Z;
  - Delete / Ctrl+Z, Shift+Delete Esc / Enter;
  - Ctrl+C / V / Z, Ctrl+X → Desene → Ctrl+V, Ctrl+A, Ctrl+Shift+N + „Ex”;
  - F4, Ctrl+L, Ctrl+E, F5, Tab, Shift+F10, clic dreapta, meniul Nou.

  **0 diferențe** de evenimente, stare sau ecran.
- **E1 pe eșantion** (Minimizare, clic dreapta › Proprietăți, „Acest PC”):
  - un singur mesaj la +40 și la +1500 ms, în pagină și deasupra;
  - **0 cadre fără mesaj** de la prima apariție până la 4,8 s;
  - ultimul cadru e la 5,0-5,3 s, iar la 5,6 s mesajul nu mai e.
- **E2 și telefonul, 2 drumuri** (360×740 și 390×844, atingeri + `insertText`):
  - Nou › Folder › „Ex Pop Ana” › Enter → `Ex Pop Ana/`;
  - tema › Redenumire › „compunere” → `compunere.docx`;
  - harta › F2 › „harta mare” → `harta mare.png`;
  - Desene › Redenumire › „Altceva” › Esc → neschimbat. Identic pe ambele lățimi.
- **Fereastra mică, 2 drumuri:**
  - D1: rândul „Folder” e la y 9-37, iar caseta la y 199-219, cu focusul în ea. Rezultă `Ex Pop Ana/`;
  - D2: dialogul de conflict e în pagină (A, N1).
- **Mesajul central pe celelalte aplicații** (cod comun): Word Ctrl+H, Excel Ctrl+K, PowerPoint Ctrl+F, Windows clic dreapta pe bara de activități:
  câte un mesaj, în pagină și deasupra.
- **Concluzia:** banda 23 nu a stricat nimic în altă aplicație. Regresul N2 pe câmpurile lor e în A (0 diferențe).
- **Banda Excel (r25):** n-am văzut nimic stricat.
  - Fișierele din `aplicatii/` nu s-au schimbat cât am probat (03:33-03:58); ultima schimbare, `excel.js` la 03:07.
  - Drumurile Excel (Name Box, editarea în celulă, Ctrl+K) au mers.

## 6. D. [FARA_REFERINTA]
1. **Numele existent scris cu altă literă mare / mică** (`b_sfe.json › 1c`, `1e`):
   - fișierul „notite - Copie” → „NOTITE” dă `NOTITE.txt` lângă `notite.txt`, fără dialog;
   - folderul Proiect → „desene” dă `Desene/` și `desene/` în același folder.

   În Windows, numele nu țin cont de litera mare / mică, deci aplicația reală ar da dialogul „Redenumire fișier” (fișierul), respectiv
   întrebarea de combinare (folderul). Referința are doar numele identic (`explorer_redenumire_nume_existent_*`), așa că nu o pot dovedi.
   - Cauza: `explorer.js:518` și `liber` `:226` compară cu `M.F.has`, exact pe litere.
   - E pe greșeala tipică „nume existent”: elevul scrie des „teme” în loc de „Teme”.
   - **De capturat întâi:** lista.txt → „MIC” cu mic.txt în folder; Proiect → „desene” cu Desene în folder.
2. **Ctrl+X → Ctrl+V în același folder lasă un pas de anulare gol** (`b_sfe2.json › 6b`):
   - după o ștergere, primul Ctrl+Z nu face nimic, iar abia al doilea aduce fișierul;
   - lipirea mai emite `lipire` și golește selecția.
   - Cauza: `explorer.js:478`, unde `memoreaza` se cheamă înainte să se știe dacă se mută ceva (R23-3).
   - De capturat: Delete, Ctrl+X / Ctrl+V în același folder, Ctrl+Z.
3. **Căutarea fără rezultat** (R23-4):
   - lista rămâne goală, fără niciun text, iar adresa rămâne calea folderului;
   - Windows 11 scrie în listă un text de tipul „Niciun element nu corespunde căutării”, iar în adresă „Rezultatele căutării în …”.
   - Lecția v/m2-l10 chiar descrie a doua parte (figura `cautare-explorer.webp`: „bara de adresă arată Rezultatele căutării în Matei_Clasa5”), dar figura nu e referință înghețată.
   - De capturat: UIA pe căutare, cu și fără rezultat.
4. **Semnele interzise** (R23-2, A23-2 așteaptă aprobarea):
   - în realitate, semnul nu intră deloc în casetă, apare balonul, iar caseta rămâne deschisă;
   - aici caseta se închide la Enter și apare mesajul central.
5. **Rămân neoprite, ca înainte:** Alt+D / F / E, Ctrl+1…9, Ctrl+− / = / 0. Ascultătorul iese la `gestTasta` = `null` (`aplicatii.js:398`).
   E [FARA_REFERINTA] 3 al criticului 19; nu pierd lucrul.
6. **Tab în câmp** nu e oprit (R23-1): mută focusul în pagină.
7. **F12 / Ctrl+S în File name (Word)** dau doar evenimentul, ca înainte. Ce face Word-ul real acolo nu e capturat.

## 7. D. MINOR
1. **Meniurile mai înalte decât fereastra** (`a_n1b.log`). Meniul Nou are 698 px, iar fereastra 526 / 600 / 640, fără derulare în meniu:
   - **pe fereastra mică:** 5 rânduri de jos nu se pot apăsa (Publisher, Python, Document text, Excel, ZIP). Înainte de N1, 4 dintre ele
     se puteau atinge derulând pagina; reparația N1 (`explorer.js:49`) le-a scos de tot;
   - **pe telefonul 360:** 3 rânduri, iar la 1366: ZIP. Ambele erau și înainte;
   - **meniul clasic** („Afișați mai multe opțiuni”, 33 de rânduri, 851 px): la 1366 nu se pot apăsa 8 rânduri de jos (Decupare,
     Copiere, Ștergere, Redenumire, Proprietăți …), iar pe fereastra mică 12. E identic cu dinainte de rundă.
   - Nu sunt pe drumul lecțiilor. Lecțiile folosesc Nou › Folder și rândul Redenumire / Ștergere din meniul Windows 11, care se pot apăsa.
   - E totuși ecranul I1. **Reparația posibilă:** `max-height` + derulare în meniu.
2. **Ctrl+Z / Ctrl+Y nu merg în căutare.** Fiecare literă redesenează caseta (`explorer.js:828` → `deseneaza`), iar caseta nouă nu mai
   are istoricul de anulare. E dinainte de rundă; tasta nu e oprită.
3. **Literele scrise în caseta de nume și în căutare sunt greșeli §6.3.** Indiciul vine după 2 litere dacă pasul lecției n-are `asteapta`.
   - E după api, dar o lecție cu pasul „scrie numele” trebuie să-și scrie `asteapta` (la fel ca MINOR 3 al criticului 19 pentru F2).
4. **Montarea: redesenarea gazdei cu caseta de nume deschisă confirmă numele neterminat, fără eveniment** (C1; `explorer.js:430-439` contra §1 `:40`).
   - De reparat înainte ca banda Windows să lege montarea.
   - De exemplu: `blur`-ul să nu confirme cât rădăcina e scoasă din DOM, iar caseta să revină după mutare.
5. **Montarea: clicul în bara gazdei** nu închide meniul deschis. Cu caseta deschisă, confirmă numele fără eveniment Explorer (C1).
6. **Meniul de clic dreapta pe fereastra mică:** rândul de pictograme (Decupare … Ștergere) e la y 483-531, adică 5 px sub margine.
   Centrul lui se apasă.
7. **MINOR-urile vechi:** 1-6 din critic 19 și cele din critic 15 rămân, cum a declarat constructorul. MINOR 7 din critic 15 (bara de stare
   sub pliu pe fereastra mică) e închis de N1.

## 8. Ce a trecut
- **N2:**
  - 36 de scurtături oprite în fiecare dintre cele 4 câmpuri;
  - câmpul și starea neschimbate;
  - tastele de editare identice cu un `<input>` martor în caseta de nume și în adresă;
  - AltGr + ș ț ă î â scrie în casetă (`a_n2b.log`), la fel Ctrl+Insert / Shift+Insert / Shift+Delete;
  - în câmp, Ctrl+Z / A / V / D / Delete nu ating fișierele.
- **Regresul N2:** 0 diferențe pe 13 drumuri. Word Save As / Open, documentul, Excel Name Box / celula, PowerPoint text / Font Size, Windows Start / redenumire, telefonul. F12 / Ctrl+S în File name fac ce făceau.
- **N1:**
  - mesajul e în pagină și deasupra pe fereastra mică și pe telefon;
  - rădăcina are 526 pe fereastra mică și 640 la 1366;
  - bara de stare e în pagină;
  - meniul de clic dreapta și dialogurile se apasă întregi pe fereastra mică.
- **G23-1:** nicio greșeală de nume nu mai pierde fișiere.
- **Unghiul STARE_FINALA_ERORI:** 9 greșeli tipice (26 de cazuri), cu ecranul = starea peste tot, dialogul de nume existent ca în referință și asistentul cu indiciul la a doua greșeală.
- **Montarea:**
  - fără bară și Coș, umple gazda;
  - `titlu` corect și actualizat;
  - 0 evenimente scăpate la gazdă;
  - rezistă la redesenare cu focusul în listă;
  - `inchide` curat.
- **Explorer-ul normal:**
  - 0 pixeli diferiți;
  - O4 18/18;
  - drumurile criticului 19 identice;
  - E1 / E2 rămân închise.

## 9. Predarea pentru runda următoare
- **Nu e niciun GRAV deschis.** Ordinea propusă:
  1. **A23-1** (P1 + P2, cod comun) împreună cu **MINOR 4** (caseta de nume la redesenarea gazdei), înainte ca banda Windows să lege montarea în `windows.js`.
     - Proba: `c_mont.py › redesen_in_redenumire`. Cere caseta tot deschisă după `redeseneaza()`, cu „comp” în ea, și niciun nume schimbat până la Enter.
  2. **MINOR 1:** meniurile mai înalte decât fereastra (Nou, meniul clasic) să se poată derula sau să încapă. Proba: `a_n1b.py`, cu 0 rânduri neapăsabile.
  3. **MINOR 2:** Ctrl+Z în căutare (să nu se redeseneze caseta la fiecare literă).
- **De capturat** (desktopul ascuns, UIA), în ordinea folosului:
  - `[FARA_REFERINTA]` 1, numele existent cu altă literă (fișier și folder);
  - 3, căutarea fără rezultat (textul listei și adresa);
  - 2, Ctrl+X / Ctrl+V în același folder, apoi Ctrl+Z după o ștergere;
  - 4, balonul semnelor interzise.

GRAV_VECHI_DESCHISE: 0
GRAV: 0
