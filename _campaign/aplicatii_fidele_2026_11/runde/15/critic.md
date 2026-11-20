# Runda 15 (B-explorer, prima rundă de construcție) · criticul rece · unghiul ASPECT

## 1. Antet
- Cine: criticul rece al rundei 15. N-am văzut conversația constructorului; n-am deschis `diferente.md`, `de_verificat.md`,
  `de_aprobat.md`, `raport_constructor.md`, `cadru.md`, `tinta.md`, `contra.md`, `stare_autor.md`, `prompt.md`. Am citit
  `REGULI_CRITIC.md`, `critic_prompt.md`, `gata_pentru_critic.md`, `runde/14/critic.md` (modelul), `api_biblioteca.md` (§3, §5, §7,
  §8.4), `contract.md` (R12, I1) și codul `aplicatii/explorer.js`.
- Starea judecată: HEAD `1d4c5a3f`, `aplicatii/`, `lectii/`, `oracole/` fără modificări necomise (`critic_probe/git_inainte.txt`, cu
  sha1 pe `explorer.js`, `aplicatii.js`, `poligon.html`, `setari.json`, `windows.js`, `date/explorer.json`).
- Uneltele mele, toate în `runde/15/critic_probe/`: hamul `h.py` (copiat din `runde/14/critic_probe/`): server static pe
  127.0.0.1, port liber, Chromium headless, `ctx.route('**/*')` care abandonează tot ce nu e 127.0.0.1/localhost (`plecate = []` în
  toate rulările, `erori = []` în toate). Gesturi adevărate: `page.mouse`, `page.keyboard`, `page.touchscreen`, CDP
  `Input.insertText` / `Input.dispatchTouchEvent`. Probele:
  - `r0.py` → `r0_out.txt`: arborele `referinte/uia_explorer.json`, pe chei (nume, tip, rect, flaguri);
  - `a1.py`: fereastra la 1366×768 și la 1700×900 (cadrul cât referința), dreptunghiuri față de `.lh-ap-e-win`, fonturi, `img` /
    `background-image`, capturi `a1_1366.png` (decupate `a1_sus.png`, `a1_jos.png`), lista nodurilor `a1_noduri.txt`;
  - `a2.py`: cele 6 meniuri deschise cu clic / clic dreapta reale, rândurile față de cutia meniului, comparate cu referința;
    capturi `a2_*.png`;
  - `a3.py`: drumurile lecțiilor D1-D6 pe poligon, la fiecare pas `stare()` + ecranul (rânduri, caseta de redenumire, dialog,
    bara de stare, gri); capturi `a3_*.png`;
  - `a4.py`: R12 pe 9 comenzi nesimulate (DOM la +40 / +400 / +1500 ms + un `MutationObserver` pe inserare / scoatere);
  - `a5.py`, `a6.py`: telefonul 360×740 și 390×844 (atingere), focusul casetei de redenumire, Coșul; `a8.py`: 1366×657 la 125 %;
  - `a7.py`: lățimea textelor din referință față de Chromium la 12-15 px, tragerea cu mouse-ul, eticheta „Anulare …”;
  - `c1.py`: regresul Word / Excel / PowerPoint, ACUM față de `59af7e74` (exportat cu `git archive` în %TEMP%), și
    `?aplicatie=windows` / `?aplicatie=explorer`; `c_verifica.log`: `genereaza_explorer.py --verifica`.
  Ieșirile: `*_out.json`, `*.log`. Nicio aplicație reală pornită; nimic pe ecranul omului; `porti.py` / `masoara.py` nerulate.
- Diff-ul rundei (`git diff 59af7e74 1d4c5a3f -- aplicatii`): `explorer.js` +900 (nou), `date/explorer.json` +2683 (generat),
  `_unelte/genereaza_explorer.py` +334, `profiluri/explorer_windows11.json` +6, `aplicatii.js` +3 (`SURSE_APP.windows`,
  `SURSE_APP.explorer`, `PROFILURI.explorer` + profilul implicit), `setari.json` 1 rând (profilul explorer), `poligon.html`
  (`P.windows`, `P.explorer`). `word.js`, `excel.js`, `powerpoint.js`, `panglica.js`, `stare.js`, `aplicatii.css` neatinse.

## 2. A. GRAV-urile vechi
—  (prima rundă de construcție a valului B-explorer: nu există GRAV vechi pe Explorer.)

## 3. B. Unghiul ASPECT

### B1. Fereastra, suprafață cu suprafață (`a1_out.json`, `a1_noduri.txt`, cheia `explorer_fereastra`)
Referința e la 96 dpi (`rect_ecran_100` cu `dpi: 96, scara: 1.0`): dreptunghiurile ei sunt deja în px css. La 1700×900 fereastra
simulată are 1618 px (referința 1534): ce e ancorat la stânga se compară direct, ce e ancorat la dreapta cu −84 px. Simulatorul
are o ramă de 1 px, deci +1 peste tot.

| suprafața | referința (x, y, l, î) | simulatorul (1700 / 1366) | verdict |
|---|---|---|---|
| bara de titlu: Sistem, fila (248×32), „Închideți fila”, „Adăugați o nouă filă” | [8,8,22,22], [12,8,248,32], [220,12,32,24], [263,13,32,24] | [9,9,22,22], [13,9,248,32], [221,13,32,24], [264,14,32,24] | = |
| Minimizare / Maximizare / Închidere | 1387 / 1434 / 1480, 47×30 | 1470 / 1516 / 1563 (−84 → 1386 / 1432 / 1479), 47×30 | = (±2) |
| butoanele de navigare | 19 / 67 / 115 / 163, y 48, 32×32; Înapoi, Înainte `dezactivat` | 20 / 68 / 116 / 164, y 49; Înapoi, Înainte gri | = |
| bara de adrese / primul segment „Acest PC” | [209,48,920,32] / [222,52,51,24] | [211,50,1000,30] (se lățește cu fereastra) / [224,53,51,24] | = |
| căutarea | [1137,48,378,32] | [1220,49,378,32] (−84 → 1136) | = |
| bara de comenzi: Nou 85, Decupare … Ștergere 40, Sortați 97, Vizualizați 116, Mai multe opțiuni 48; Previzualizare 122 | x 14, 110, 158, 206, 254, 302, 350, 401, 502, 625; 1394 | 15, 111, 159, 207, 255, 303, 351, 402, 503, 626; 1477 (−84 → 1393) | = |
| gri fără selecție | Decupare, Copiere, Lipire, Redenumire, Partajați, Ștergere `dezactivat=True` | aceleași 6 gri; cu un fișier ales rămâne gri doar Lipire (fără clipboard) | = |
| panoul de navigare | [10,136,389,646], rânduri de 32 | [11,137,389,…], rânduri de 32; Acasă, Galerie, —, Documente › folderele lecției, —, Acest PC › RamDisk (A:), Disc local (C:), Google Drive (G:), Volum nou (W:), Rețea | = (locurile personale ascunse → folderele lecției, cum spune `explorer.js:309`) |
| antetele coloanelor | Nume 340, Data modificării 180, Tip 150, Dimensiune 100, înălțime 25, x 403 | 340 / 180 / 150 / 100, 25, x 404 | = |
| rândurile | [417,167,752,24], pas 28 | [418,168,752,24], pas 28 | = |
| săgeata de sortare | `observat_vizual.sageata_sortare`: „pe coloana Nume, în sus” | săgeată sus, centrată deasupra „Nume” (`a1_sus.png`) | = |
| panoul de examinare | `Modul imagini mici` [1066,140,456,638]; „Selectați un fișier pentru examinare.” | [1157,141,456,460] (−84 → 1073); același text | = (poziție); fontul: §B3 |
| bara de stare | „6 elemente” [20,782,…]; Detalii (selectat) / Pictograme mari 24×24 la 1474 / 1498 | „5 elemente” la x 21; 1557 / 1581 (−84 → 1473 / 1497), Detalii apăsat | = |

- Numele sunt toate în română și vin din referință; nicio etichetă străină de ea pe ecran (afară de numele folderelor lecției).
- La 1366×768 (cadrul poligonului) fereastra are 1284×638 (fâșia de desktop ia 80 px): zona de conținut are 525 px, deci coloana
  „Tip” începe la marginea ei și nu se vede fără derulare laterală (`a1_sus.png`); vezi §D, [FARA_REFERINTA] 1.

### B2. Meniurile (`a2_out.json`, `a2_*.png`; rândurile față de gazda pop-up, ca în referință)
| meniul (cheia) | rânduri ref / sim | nume + ordine | dreptunghiuri | bifat |
|---|---|---|---|---|
| `explorer_meniu_nou` | 21 / 21 | = (inclusiv „Microsoft Access Database” de două ori) | ±0 | — |
| `explorer_meniu_sortare` | 7 / 7 | = | ±0 | Nume, Ascendent (= starea) |
| `explorer_meniu_vizualizare` (+ „Afișați”) | 16 / 16 | = | ±0; submeniul la (226, 329) = (2750−2524, 634−305) | Detalii, Panou de examinare; Panou de navigare (= starea) |
| `explorer_meniu_fisier` | 19 / 19 | = (lista + rândul de pictograme Decupare … Ștergere) | ±0; cutiile [0,0,354,493] + [0,473,354,80] | — |
| `explorer_meniu_fisier_clasic` | 33 / 33 | = | ±0 | — |
| `explorer_meniu_fundal` | 9 / 8 fără istoric; 9 după o operație | = („Anulare Mutare” / „Anulare Nou” apar după operație, `a7_out.json`) | ±0, dar cu gaură, vezi MINOR 2 | — |
Scurtăturile din referință stau în dreapta rândului (Enter, Ctrl+Shift+C, Alt+Enter). Deosebirile de desen (fără pictograme în
rânduri, „Afișați” fără săgeată, bifa care împinge textul, gaura din meniul de fundal) sunt la MINOR.

### B3. Fonturile și pictogramele
- Pictogramele: SVG în linie (Fluent din `date/explorer.json › icoane` + forme proprii `explorer.js:25-46`); niciun `<img>`, niciun
  `background-image` în rădăcină (`a1_out.json › m1366.svg_img = [], bg = []`) → I7 respectat.
- Fontul: tot Explorer-ul e la 12 px „Segoe UI Variable” (`a7_out.json › fonturi_sim`). Referința dă lățimile textelor; măsurate
  în Chromium (`a7_out.json › latimi`): fila „sesiune” 41 px = 12-13 px (corect); segmentele adresei „Disc local (C:)” 83,
  „Utilizatori” 60, „AppData” 55, „Local” 32, „Temp” 34, „lh_explorer_ref” 91, „sesiune” 46 = **14 px** exact (12 px ar da 70,
  51, 47, 27, 29, 77, 39); „Căutați în sesiune” 113 ≈ 14-15 px; „Grupare după” (meniul Sortați) 86 = 14 px; mesajul panoului de
  examinare 231 ≈ 15 px. Bara de adrese, căutarea, meniile și panoul de examinare sunt deci cu ~2 px mai mici decât în Windows
  (MINOR 1, cu dovadă).

### B4. Telefonul (I1) și laptopul la 125 %
- 360×740 și 390×844 (`a5_out.json`): pagina nu depășește lateral (`scrollWidth` = 360 / 390); bara de comenzi se derulează lateral
  (`overflow-x: auto`, 795 px în 298 / 328), deci nu se taie (api §8.4); Ștergere, atinsă după derulare, merge (`a6_out.json › cos`).
- Zone sub 32 px la 360 px (15): Închideți fila 32×24, Adăugați o nouă filă 32×24, Minimizare / Maximizare / Închidere 47×30,
  bara de adrese 58×30, segmentele adresei 24 înălțime, antetele coloanelor 25, Detalii / Pictograme mari 34×24 (MINOR 6).
- Zona de conținut are 174 px: se vede doar „Nume” (tăiat); restul coloanelor prin derulare (MINOR 6).
- **Numele unui folder nou / redenumirea nu se pot face cu atingeri: GRAV E2 (§B7).**
- 1366×657 la 125 % (1093×526 css, `a8_out.json`): bara de comenzi încape; fereastra are 638 px într-o pagină de 526, deci bara de
  stare e sub pliu (pagina se derulează); conținutul are 405 px: „Data modificării” tăiată, „Tip” ascunsă (MINOR 7).

### B5. Drumurile lecțiilor, pe poligon (1366×768, mouse + tastatură; `a3.log`, `a3_out.json`)
| drumul (lecția) | se duce la capăt? | ecranul = starea | dialogul (titlu / întrebare / butoane) față de scenariul real |
|---|---|---|---|
| D1 Nou › Folder › „Ex Pop Ana” › Enter; F2 pe „notite” › „lista” › Enter; Ctrl+Z; clic dreapta pe fundal › Nou › Folder › Enter (v/m2-l10, m2-l11) | da | da: caseta „[Folder nou\|0-10]” (tot numele ales), apoi rândul „Ex Pop Ana”; „notite” → caseta „[notite\|0-6]” fără „.txt” (= `observat_vizual.f2_pe_tema_docx`), apoi „lista” / `lista.txt`; Ctrl+Z → `notite.txt`; „Folder nou” al doilea rămâne cu Enter; numărul din bara de stare urmează (6, 7 elemente) | — |
| D2 tema › Ctrl+C › clic „Teme” în panou › Ctrl+V; Ctrl+V din nou (conflict) › Enter › clic „Se omite acest fișier”; harta › Ctrl+X › sus › dublu clic Teme › Lipire (m2-l10, m2-l11, m2-l15) | da | da (în Teme: „compunere”, „tema”, apoi „harta”; în Clasa a V-a harta dispare) | „Înlocuire sau omitere fișiere” / „Destinația are deja un fișier cu numele „tema.docx”” / cele 4 butoane = `explorer_lipire_conflict_omitere`; Enter dă „Mai puține detalii” → nesimulat (vezi [FARA_REFERINTA] 2 și E1) |
| D3 notite › Delete › dublu clic Coș pe desktop › clic dreapta › Restaurare › Înapoi; tema › Shift+Delete › Da (m2-l10) | da | da (`in_cos ["notite.txt"]` ↔ rândul din Coș; după Restaurare `in_cos []`, Coșul gol, „notite” înapoi) | „Ștergere fișier” / „Sigur ștergeți definitiv acest fișier?” / Da, Nu = `explorer_stergere_definitiva_da` |
| D4 sortare: clic pe antetul „Nume” (descrescător), Sortați › Ascendent, › Tip, › Data modificării (m2-l11), pe cele 17 nume din `explorer_sortare_nume` | da | da; ordinea crescătoare = `explorer_sortare_nume.ordine_afisata` exact; săgeata trece pe coloana aleasă | — |
| D5 redenumire cu extensii vizibile: lista.txt → „mic” (ocupat) › Nu; harta.png → „harta mare” › Da (m2-l12) | da | da | „Redenumire fișier” / „Redenumiți "lista.txt" ca "mic (2).txt"?” / Da, Nu; „Redenumire” / „Dacă modificați extensia … Sigur modificați extensia?” / Da, Nu = scenariile reale |
| D6 folder cu un singur fișier | — | „1 elemente” ([FARA_REFERINTA] 4) | — |
- Tragerea „notite” pe folderul „Desene” (mouse): `tragere / mutare`, notite iese din listă și intră în Desene (`a7_out.json`).
- **„Proprietăți = nesimulat”**: nicio lecție dintre cele 8 nu cere fereastra Proprietăți (`r2_out.txt`: 0 apariții în
  v/m2-l09 … vi/m3-l18; simulatoarele vechi spun chiar „Proprietățile nu le folosim azi”, `lectii/_sim/explorer-operatii.js:587`).
  Deci nu e GRAV în sine; dar mesajul „aici nu e simulată” nu apare (E1).

### B6. Ce cer lecțiile și nu e pe ecran (pentru etapa C, nu GRAV acum)
- v/m2-l09 pornește din „Acest PC” › „STICK (E:)” › Scoala › TIC: biblioteca nu are unități sau „Acest PC” navigabil (clic pe
  „Acest PC” = nesimulat).
- v/m2-l10 citește în Coș coloana „Locație inițială”; Coșul simulat are coloanele folderului (Nume, Data modificării, Tip,
  Dimensiune) și butonul „Nou” activ ([FARA_REFERINTA] 3).

### B7. GRAV-urile noi

#### E1 — Comenzile nesimulate tac: mesajul „aici nu e simulată” e șters în aceeași milisecundă (R12)
- **Gestul** (`a4.py`, 1366×768, gesturi reale): clic pe „…” (Mai multe opțiuni); clic pe Minimizare; dublu clic pe „tema”;
  clic dreapta pe „tema” › Proprietăți; Nou › Microsoft Word Document; tema + Alt+Enter; clic pe „Acest PC” în panoul de
  navigare; tema › Partajați; în Coș, notite › Delete.
- **Ce face simulatorul**: toate 9 emit `actiune: 'nesimulat'`, dar pe ecran nu apare nimic: `[data-lh-nesimulat]` lipsește la
  +40, +400 și +1500 ms; `MutationObserver`-ul vede mesajul inserat și scos în aceeași milisecundă (ex.: „În aplicația reală,
  „Acest PC” funcționează; aici nu e simulată.” inserat la 12137 ms, scos la 12137 ms; la fel pentru celelalte 8,
  `a4_out.json`). Elevul apasă și nu se întâmplă nimic vizibil. La fel tace Enter în dialogul de conflict (D2.5:
  `tasta_enter / nesimulat`, `nesim: []`).
- **Ce face aplicația reală**: comenzile există și lucrează: `explorer_fereastra › Panou de navigare › „Acest PC” (TreeItem,
  extins=True)` (duce la Acest PC); `explorer_meniu_fisier › „Proprietăți” (scurtatura Alt+Enter)` deschide fereastra din
  `explorer_proprietati` („Proprietăți tema.docx”, fila General …); `explorer_fereastra › „Mai multe opțiuni” (MoreButton)`.
  Contractul R12 (`contract.md:38`): „o comandă afișată și nesimulată dă mesajul central standard („În aplicația reală, X …;
  aici nu e simulată”), nu tace”; api §3: `data-lh-nesimulat`, `role=status`.
- **De ce e GRAV**: încalcă R12 „nu tace” (pe lista GRAV din reguli), și pe un drum din lecție: v/m2-l09 „În stânga e panoul de
  navigare. Acolo sunt Acest PC, cu unitățile, și Documente. … un singur clic pe un nume te duce direct la el” — clicul pe „Acest
  PC” nu face nimic vizibil. Simulatorul vechi al lecțiilor arăta „Proprietăți Alt+Enter” în meniu și răspundea cu un mesaj
  (`lectii/_sim/explorer-operatii.js:511, :587`). Orice comandă afișată și nesimulată din Explorer (meniul Nou în afară de
  Folder, bara de titlu, „…”, Proprietăți, Ștergere în Coș, două butoane ale dialogului de conflict) e acum un buton mort.
- **Cauza în cod**: `aplicatii.js:221-229` pune mesajul ÎN rădăcina aplicației (`I.root.appendChild(m)`); explorer.js cheamă
  `I.nesimulat(...)` și imediat `deseneaza()`, care rescrie `root.innerHTML` (`explorer.js:409`): `I.la.clic` → `:736`,
  `I.la.dublu` → `:747`, `I.la.tasta` → `:862`, dialogul (Enter) → `:810`, clicul în dialog → `:699`. Mesajul trebuie pus
  după redesenare sau în afara zonei rescrise.

#### E2 — Pe telefon nu se poate da nume unui folder nou și nu se poate redenumi (I1)
- **Gestul** (`a6.py`, 360×740, `isMobile` + atingere): atingere pe „Nou”, atingere pe „Folder”, apoi scrisul cu tastatura
  telefonului (CDP `Input.insertText` „Ex Pop Ana”) sau cu una fizică (`keyboard.type`), apoi Enter. Separat: atingere pe „tema”,
  atingere pe „Redenumire” din bara de comenzi, scris „compunere”, Enter.
- **Ce face simulatorul**: „Folder nou/” apare, caseta de redenumire e creată și pierde focusul imediat (`window.__blur` o
  înregistrează; la +30 ms `caseta: null`, focusul în rădăcină). Numele scris nu ajunge nicăieri (insertText: nimic; tastele
  fizice: căutare rapidă, „P” alege Proiect, „n” alege notite), iar Enter **intră în folderul „Folder nou”** (`tasta_enter /
  navigare`, `cale_curenta: Documente/Clasa a V-a/Folder nou/`) sau dă „Deschideți” pe notite. Cu „Redenumire” din bară: caseta
  apare și se închide la fel (`activ: BODY`), iar „compunere” + Enter nu schimbă nimic (`nume_fisiere` neschimbat). F2 merge
  doar cu o tastatură fizică. Cu mouse-ul, la 1366×768, același drum merge (D1).
- **Ce face aplicația reală**: după „Nou › Folder” numele rămâne în caseta de editare până la Enter: scenariul real
  `explorer_folder_nou` (CLSID_NewMenu, „Folder” → `Folder nou/`), redenumirea `explorer_redenumire_pastreaza_extensia` („harta
  mare.png”) și `explorer_fereastra.observat_vizual.f2_pe_tema_docx`: „se colorează doar „tema”, fără „.docx” (caseta de
  redenumire)”. Contractul I1 (`contract.md:42`): „biblioteca merge la 360-390 px”.
- **De ce e GRAV**: elevul pe telefon nu poate duce la capăt drumul din v/m2-l10 („Nou, apoi Folder; scrii numele, Enter”; „Scrie
  Ex, numele și prenumele tău … și apasă Enter”), m2-l11 („Fă folderele, cu nume bune”) și redenumirea din m2-l10 / m2-l12; în
  plus, Enter îl duce într-un folder gol, fără să știe de ce.
- **Cauza în cod**: comanda rulează pe `pointerup` (`aplicatii.js:349`, `laSus`), `deseneaza()` creează caseta și îi dă focusul
  (`explorer.js:414-416`); la atingere, browserul trimite DUPĂ `pointerup` evenimentele de compatibilitate (`mousedown` pe
  elementul de sub deget, care după redesenare nu mai e meniul / butonul), focusul pleacă din casetă, iar ascultătorul `blur`
  (`explorer.js:419`) închide redenumirea cu numele neschimbat. Cu mouse-ul `mousedown` vine înaintea lui `pointerup`, de aceea
  pe laptop merge.

## 4. C. Regresul (`c1.py`, `c1.log`, `c1_out.json`)
- **Word / Excel / PowerPoint pe poligon**, ACUM (worktree, `1d4c5a3f`) față de ÎNAINTE de banda explorer (`59af7e74`, exportat cu
  `git archive` în %TEMP%, șters la final), la 1366×768, aceleași gesturi (Word: „Ana are mere”, Ctrl+A, Ctrl+B; Excel: ↓, „9.5”,
  Enter, Ctrl+Z; PowerPoint: Ctrl+M, Ctrl+Z, Alt, H, Esc, Esc): 0 pixeli diferiți la pornire și după gesturi, `stare()` egală,
  evenimentele identice, 0 erori, 0 cereri plecate. Banda nu le-a atins.
- **`?aplicatie=windows` și `?aplicatie=explorer` nu se încurcă**: pagina windows încarcă doar `windows.js` + `date/windows.json` +
  `profiluri/windows11.json`, o singură rădăcină `lh-ap-windows`, `stare('explorer') = null`, fără stilul `lh-ap-explorer-css`;
  pagina explorer încarcă doar `explorer.js` + `date/explorer.json` + `profiluri/explorer_windows11.json`, `stare('windows') =
  null`. Pe aceeași pagină (windows, apoi `deschide('explorer', …)`): două rădăcini, stări independente (fereastra „Acest PC” a
  desktopului rămâne în `stare('windows')`, `stare('explorer').nume_fisiere = ['a.txt']`). `windows.js` nu folosește clase
  `lh-ap-e-*` (0 apariții), iar stilul explorer e prefixat `.lh-ap-explorer`.
- Drumurile închise anterior: nu există pe Explorer (prima rundă); drumurile D1-D6 de mai sus sunt eșantionul pentru runda
  următoare.
- `genereaza_explorer.py --verifica` → „date/explorer.json la zi”, ultima linie `0` (`c_verifica.log`). Date personale: 0 pe ecran;
  în `date/explorer.json` rămân doar numele folderelor de sesiune (`sesiune`, `lh_explorer_ref`), înlocuite pe ecran de șabloane
  („Până la "Documente"”, „Reîmprospătare "Clasa a V-a"”).
- La final `git status -- aplicatii lectii oracole` = gol, sha1 identice cu `git_inainte.txt` (`git_dupa.txt`).

## 5. D. [FARA_REFERINTA]
1. **Coloana „Tip” la 1366×768.** Profilul deschide panoul de examinare (setarea PC-ului profesorului, `observat_vizual.
   vizualizarea_omului`); la 1366 zona de conținut are 525 px și „Tip” nu se vede fără derulare (`a1_sus.png`), deși v/m2-l09 se
   sprijină pe ea („Coloana Tip te scapă de încurcătură”). Referința e la 1534 px (unde „Tip” se vede până la 1045). De capturat
   Explorer-ul maximizat la 1366×768 cu setările implicite ale laboratorului (sau de hotărât: panoul de examinare închis implicit).
2. **Dialogul „Înlocuire sau omitere fișiere”.** Simulatorul pune butoanele în ordinea UIA, cu „Mai puține detalii” PRIMUL, cu
   focus și chenar (`a3_d2_dialog_crop.png`); Enter = „Mai puține detalii” = nesimulat (și tace, E1). Captura lecției
   (`lectii/v/m2-l10`, figura `inlocuire-sau-omitere.webp`, descrierea ei: „Se copiază 1 element de la Ana_Pop_5A la Exercitii; …
   trei variante, prima, Înlocuire fișier de la destinație, are chenar”) arată altfel: rândul „Se copiază …” (lipsă), trei
   variante, focusul pe „Înlocuire”, iar lecția avertizează „Se omite acest fișier, nu Enter”. De capturat dreptunghiurile și
   focusul dialogului (UIA, pe desktopul ascuns).
3. **Coșul de reciclare.** Coloanele simulate sunt cele ale folderului; v/m2-l10 citește „Locație inițială”. Bara de comenzi a
   Coșului: „Nou” activ, fără „Restaurați …” / „Golire Coș de reciclare”; meniul Coșului („Restaurare”) e scris de mână (R15).
   De capturat suprafața Coșului (vederea, bara, meniul de clic dreapta).
4. **„1 elemente”** în bara de stare la un singur element (R15-5, declarat): referința are doar pluralul („6 elemente”).
5. **Rândul de pictograme al meniului de fișier.** Descrierea capturii spune „cu pictogramele sus”, dar dreptunghiurile îl pun
   DEDESUBT (fereastra a doua la y 535 față de 62: meniul s-a deschis în sus); simulatorul îl pune mereu dedesubt. De capturat
   meniul deschis în jos.
6. **Submeniul „Afișați” se deschide doar la clic**, nu la trecerea mouse-ului (`a2_out.json › viz_hover_afisati = 1` cutie).
7. **Pozițiile meniurilor față de buton** (Nou acoperă bara de comenzi și la referință: gazda la y 87, butonul la 89): depind de
   ecranul capturii; nu le judec.
8. **Telefon, Coș › Restaurare**: singura cale e apăsarea lungă (`contextmenu`); `Input.dispatchTouchEvent` cu 1,2 s n-a produs
   `contextmenu` în Chromium headless (`a6_out.json`), deci n-am putut dovedi nici că merge, nici că nu.
9. **„Anulare Mutare” / „Anulare Nou”** în meniul de fundal (referința are doar „Anulare Copiere”).

## 6. D. MINOR
1. **Fontul de 12 px peste tot** (`explorer.js:50`): bara de adrese, căutarea, meniurile și panoul de examinare sunt la 14 px în
   referință (dovada în §B3: lățimile segmentelor = 14 px exact). Fila, lista, panoul de navigare și bara de stare: 12 px, corect.
2. **Gaură în meniul de fundal fără istoric**: rândul „Anulare …” lipsește, dar celelalte rămân la locul lor (≈ 41 px goi, fără
   separatorul de după „Grupare după”, `a2_fundal.png`): `explorer.js:383` sare rândul care poartă și `sep`.
3. **Rânduri de meniu fără pictograme** (Nou, Vizualizați, fișier, fundal): referința are `Image` la x 26 și textul la x 54 (Nou)
   / 82 (Vizualizați); simulatorul începe textul la x ≈ 26 (`a2_nou.png`, `a2_vizualizare.png`).
4. **„Afișați” fără săgeata de submeniu**: `genereaza_explorer.py:103` pune `sub` doar pentru `extins is False`, iar în captură
   „Afișați” e `extins=True` (era deschis).
5. **Bifa împinge textul** cu ~10 px („Detalii”, „Panou de examinare”, „Panou de navigare”, `a2_vizualizare.png`):
   `explorer.js:390` — învelișul bifei stă în fluxul flex (gap 10).
6. **Telefon**: 15 zone sub 32 px (§B4); zona de conținut 174 px, doar „Nume” (pe jumătate) vizibil.
7. **1366×657 la 125 %**: bara de stare sub pliu (fereastra 638 px în 526), „Tip” ascunsă (`a8_out.json`).
8. **Cutiile meniului de fișier** au mărimea gazdelor pop-up, cu marginile de umbră: 20 px mai late, rândul de pictograme 80 px
   în loc de ~60 (bandă goală sub pictograme, `a2_fisier.png`).
9. **Etichete de pe PC-ul profesorului** (declarat): „FastStone PNG File” la Tip, unitățile RamDisk (A:) / Google Drive (G:) /
   Volum nou (W:), meniul Nou cu AutoHotkey Script, Python File, Google Docs, Microsoft Access Database ×2, meniul clasic cu
   Bytello Share, ShareX, Encrypto, PDF-XChange, plus Dropbox / OneDrive.
10. **Alt+Enter = Enter** (`explorer.js:836`): pe un folder ales, Alt+Enter intră în el; referința: `explorer_meniu_fisier ›
    Proprietăți scurtatura Alt+Enter`. Nu e pe drumul lecțiilor.
11. **În Coș, Decupare / Copiere / Partajați / Ștergere apar active**; Decupare și Copiere nu fac nimic și nu spun nimic
    (`fara_efect`), celelalte = nesimulat.
12. **După tragere**, `stare().selectie = ['notite.txt']`, deși notite e în Desene și pe ecran nu e ales nimic.
13. **`ordine_afisata` în afara folderului de lucru** dă folderul de lucru, nu ce e pe ecran (aceeași convenție ca motorul vechi,
    `oracole/sim_runner.js:292`); de scris explicit în api §5.
14. Dialogul „Ștergere fișier” poartă suprafața `dialog.dinamic` (celelalte au chei proprii).

## 7. Ce a trecut
- Fereastra: toate suprafețele și nodurile la ±2 px de referință (bara de titlu, fila, navigarea, adresa, căutarea, cele 10 + 1
  comenzi, antetele 340 / 180 / 150 / 100, rândurile de 24 cu pasul 28, panoul de examinare, bara de stare cu Detalii /
  Pictograme mari); numele în română, ordinea și tipurile din referință; gri = referința și urmează selecția / clipboardul.
- Meniurile: Nou 21/21, Sortați 7/7, Vizualizați 16/16, fișier 19/19, clasic 33/33, fundal 9/9 (cu istoric) — nume, ordine,
  dreptunghiuri ±0, scurtături; bifele = starea. Pictograme doar SVG (I7).
- Drumurile D1-D6 cu mouse și tastatură: Folder nou cu nume, F2 fără extensie, Ctrl+Z, copiere / lipire / conflict / omitere,
  mutare, Coș / restaurare, Shift+Delete, sortarea = `explorer_sortare_nume`, redenumirea cu nume ocupat și cu extensie; titlurile,
  întrebările și butoanele dialogurilor = scenariile reale; ecranul = starea la fiecare pas; tragerea cu mouse-ul.
- Telefon: fără depășire laterală, bara de comenzi derulabilă, Ștergere și Coșul merg cu atingeri.
- Regresul Word / Excel / PowerPoint: identic la pixel; windows / explorer separate; `--verifica` = 0; nicio dată personală pe ecran.

## 8. Predarea pentru runda următoare
- **Întâi E1**: mesajul `nesimulat` să supraviețuiască redesenării (în `explorer.js`: păstrat / repus după `root.innerHTML`, sau
  pus în afara zonei rescrise); proba: `a4.py` — mesajul vizibil la +400 ms pe toate 9 gesturile.
- **Apoi E2**: caseta de redenumire să nu se închidă din `mousedown`-ul de compatibilitate de după atingere (ex.: ignorat
  `blur`-ul din primele ~400 ms după creare / după un `pointerup` de atingere, sau focusul dat după `click`); proba: `a6.py` —
  „Ex Pop Ana” prin `Input.insertText` + Enter → `Ex Pop Ana/`, iar „Redenumire” din bară → `compunere.docx`.
- Apoi MINOR 1 (14 px în adresă / căutare / meniuri / panoul de examinare), 2 (gaura din meniul de fundal), 3-5 (pictogramele,
  săgeata „Afișați”, bifa), 10 (Alt+Enter → Proprietăți = nesimulat cu mesaj).
- **De capturat** (desktopul ascuns, UIA + o captură decupată): dialogul de conflict (dreptunghiuri, focus, rândul „Se copiază …”,
  ce face Enter); Coșul (coloane, bara de comenzi, meniul de clic dreapta, ce face Ștergere acolo); Explorer maximizat la 1366×768
  cu setările implicite (panouri, lățimi, ce coloane se văd); meniul de fișier deschis în jos; bara de stare cu 1 element;
  submeniul la trecerea mouse-ului; eticheta „Anulare …” după Folder nou / mutare.
- Neverificat de mine: oracolele O3 / O4 / O5 / O9 și cifrele constructorului (254 de puncte O3, 18/18 scenarii); n-am rulat
  `masoara.py` / `porti.py`, după reguli.

GRAV_VECHI_DESCHISE: 0
GRAV: 2
