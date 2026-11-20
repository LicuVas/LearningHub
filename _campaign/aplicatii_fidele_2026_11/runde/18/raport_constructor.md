# Runda 18 (B-windows, unghiul `aspect`) — raportul constructorului, 20.11.2026

Pașii 2-6 din prompt; pasul 1 = `masurare_pornire.json`; pașii 7-10 îi face orchestratorul. Nimic comis, nicio comandă git
care scrie. Probele: headless, doar 127.0.0.1, server pe port liber.

## Numerele întâi
| ce | înainte (pornire) | după (proba mea, țintită) | dovada |
|---|---|---|---|
| Windows în bibliotecă | `deschide('windows')` respinge („nu e încă în bibliotecă”) | se deschide pe poligon | `probe_iesiri/proba_windows.json` |
| proba comportamentului (Start, meniuri, Nou › Folder, ferestre, evenimente, asistare, telefon) | — | **37/37 verificări OK**, 0 erori JS | `probe_iesiri/proba_windows.log` |
| O3 de diagnostic pe poligon, cele 4 suprafețe cu referință, fereastra **1366×768** | 536 (162 + 197 + 71 + 106, toate „suprafață lipsă”) | **80** (bara 47, start 33, meniu_desktop 0, meniu_desktop_clasic 0) | idem › `o3.1366x768` |
| idem, fereastra **1536×864** (ecranul referinței) | 536 | **51** (bara 44, start 7, 0, 0) | idem › `o3.1536x864` |
| O5 pe Windows (`LH_PAGINI=lectii/v/m2-l08/index.html`) | 18 din 18 gesturi fără eveniment | **3 din 18** | `probe_iesiri/O5/oracol_evenimente.json` |
| O9 pe Windows (idem) | 8 din 8 cazuri picate | **1 din 8** (doar F: nicio lecție nu încarcă încă biblioteca — etapa C) | `probe_iesiri/O9/oracol_asistare.json` |
| regres O4, 19 scenarii Word / Excel / PowerPoint (7 + 7 + 5) | 2 probleme | **2 probleme, aceleași** (excel-sortare-doua-niveluri neexecutabil, powerpoint-tragere-forma fără real — identice în pornire) | `probe_iesiri/regres_O4/` |
| `genereaza_windows.py --verifica` | — | la zi (0) | |

**O3-ul oficial (orchestratorul) NU se mișcă pe `windows.*` în runda asta**: O3 randează lecțiile din inventar, iar nicio
lecție nu încarcă biblioteca Windows până la etapa C. Cifrele de mai sus sunt diagnostic, cu codul înghețat al oracolelor
(`arbore_randat.js`, `structura_lib.compara`, `oracol_ui.puncte`, plasa `_deschide_shell`). O5 și O9 se mișcă și în
măsurarea comună (lucrează pe poligon): Windows −15 la O5, −7 la O9.

## Ce rămâne în cele 51 de puncte la 1536×864 (fiecare cu motivul)
- 28 + 7: cele 4 butoane „deschise” din captură (Terminal, KeePassXC, Chrome, AutoHotkey) nu se desenează — erau STAREA
  PC-ului profesorului; grupul din mijloc se recentrează fără ele → 7 `pozitie` (Start, Căutare, Vizualizare activități,
  4 fixate). `de_aprobat.md` A18-2.
- 8: ceasul e viu („Ceas 22:52 …” față de „19:48”). A18-1.
- 1: Widgeturi — pe ecran „13°C / Mostly cloudy” (copiii Text din referință), numele UIA are în plus „Widgeturi”.
- 7: Start › „Casetă de căutare” (Edit al ferestrei de căutare; pe ecran ar acoperi rândul „Fixate”). R18-9.
- La 1366×768 se adaugă 29 de `pozitie`: tava (lipită la dreapta) și panoul Start (centrat, lipit de bară) stau cu 170 / 85 /
  60 px altfel față de colțul suprafeței decât pe ecranul de 1536 px al referinței. La 1536×864 aceleași reguli dau 0.

## Ce suprafețe `windows.*` deschide plasa (`LHAplicatii.deschideSuprafata`) și ce dă O3 pe ele (proba mea)
| cheia de randare | suprafața din suprafete.json | cum se deschide | 1366×768 | 1536×864 |
|---|---|---|---|---|
| `bara_activitati` | windows.bara_activitati, windows.zona_notificare | se vede la pornire (plasa întoarce true) | 47 | 44 |
| `start` | windows.meniu_start | plasa `start` (sau clic pe Start / tasta Windows) | 33 | 7 |
| `meniu_desktop` | windows.meniu_clic_dreapta | plasa (sau clic dreapta pe desktop) | 0 | 0 |
| `meniu_desktop_clasic` | windows.meniu_clic_dreapta | plasa (sau „Afișați mai multe opțiuni” / Shift + clic dreapta) | 0 | 0 |
| `meniu_desktop_nou`, `desktop`, `fereastra` | fără referință (R18-2, R18-5, R18-4) | plasa `meniu_desktop_nou`; desktopul și ferestrele se văd | — | — |

## FĂCUT (cu dovada observată)
- **Generatorul** `aplicatii/_unelte/genereaza_windows.py` → `aplicatii/date/windows.json` (49,6 KB): citește
  `uia_windows.json` pe chei; bara (Widgeturi; Start, Căutare, Vizualizare activități, 4 fixate; tava cu 11 butoane, ceasul),
  Start (37 de noduri: căutarea, Fixate, Recent, Toate, contul ca „[utilizator]”, Alimentare), meniul nou (10) și clasic
  (15), submeniul Nou (21, din `explorer_meniu_nou`), butoanele ferestrei (din `explorer_fereastra`), „Folder nou” (din
  `scenarii_real/explorer_folder_nou*.json`), 26 de pictograme Fluent (MIT). Fiecare valoare are `sursa`. `--verifica` = 0.
- **`aplicatii/windows.js`** (603 rânduri): desenează totul din date; comportamentul din supliment §3 — Start (clic, tasta
  Windows, Esc; `meniu_start_deschis` urmează), clic dreapta pe desktop → meniul nou, „Afișați mai multe opțiuni” /
  Shift → clasic, Nou › Folder → „Folder nou” cu numele în editare (Enter / Esc / „Folder nou (2)”), F2, Delete (doar pe
  folderele elevului), ferestrele din `ferestre` în bară (minimizare / restaurare / activare), Minimizare / Maximizare /
  Închidere, tragerea pictogramelor și a ferestrelor, dreptunghiul de selecție; restul = mesajul central `data-lh-nesimulat`
  (R12). Evenimentele §4 vin prin `aplicatii.js` pe fiecare gest; asistentul §6 merge (O9: 7/8). Proba: 37/37.
- **I1**: la 375×740 pagina nu se lățește, butoanele barei ≥ 32 px (în afară de „Afișați desktopul”, 12 px și în
  referință), panoul Start încape, dalele ≥ 32 px (proba, partea 3).
- Pașii 2-5: `cadru.md` (citirea B), `tinta.md`, `contra.md`, `diferente.md` (19 rânduri); `de_verificat.md` R18-1…R18-9;
  `de_aprobat.md` A18-1, A18-2.

## Fișierele
- Noi, ale benzii: `aplicatii/windows.js`, `aplicatii/date/windows.json`, `aplicatii/_unelte/genereaza_windows.py`,
  `aplicatii/profiluri/windows11.json` (creat cu deschidere exclusivă, nu exista; banda Explorer și-a făcut
  `explorer_windows11.json` și a mutat `setari.json › profil.explorer` pe el, deci `windows11.json` e acum doar al lui Windows).
- Dosarul rundei: `runde/18/{cadru,tinta,contra,diferente,raport_constructor,gata_pentru_critic,stare_autor}.md`,
  `runde/18/proba_windows.py`, `runde/18/probe_iesiri/` (proba, O5, O9, regres_O4), `runde/18/inainte/` (copiile).
- Adăugat la coadă: `de_verificat.md` și `de_aprobat.md`, blocurile `<!-- RUNDA18-WINDOWS:START/END -->`.

### Fișiere comune atinse (Edit, bucăți mici; copiile de dinainte în `runde/18/inainte/`)
- `aplicatii/aplicatii.js:79` — un rând nou, separat de obiectul literal (ca să nu se calce cu banda Explorer, care și-a pus
  `SURSE_APP.explorer` pe rândul 80): `SURSE_APP.windows = ['windows.js', 'date/windows.json'];`. Păzit pe aplicație:
  e citit doar de `incarcaApp('windows')`. `setari.json` NU l-am atins.
- `aplicatii/poligon.html:13-14` — comentariul pentru om (`?aplicatie=windows`); `poligon.html:18` — în scriptul de pe un rând,
  înainte de `if(a)…`: `P.windows={ferestre:[{aplicatie:'explorer',titlu:'Acest PC',…}]};` — folosit doar la
  `?aplicatie=windows`. Oracolele (O4/O5/O9) nu-l citesc: ele cheamă singure `deschide`.
- Regresul cerut de `CICLU_PARALEL.md:51`: 19 scenarii O4 pe Word / Excel / PowerPoint — aceleași verdicte ca în pornire.

## NEFĂCUT (cu deblocatorul)
- **Legătura cu Explorer** (butonul Explorer, dublu clic pe „Acest PC”): voit, supliment §4 → după ce ambele benzi trec de
  critic (R18-7). Azi: eveniment + mesajul central.
- **O5 `clic_fila`, `lansator_grup`**: desktopul Windows n-are file sau lansatoare de grup; o țintă `fila:` / `lansator:` ar fi
  inventată. **O5 `selectie`**: O5 trage peste prima pictogramă, iar în Windows tragerea unei pictograme o MUTĂ (`tragere`);
  selecția e dreptunghiul tras din locul gol. Deblocator: decizia orchestratorului (scoate gesturile din `suprafete.json ›
  windows.gesturi` într-o rundă `acoperire`, sau o țintă de zonă goală în FELURI).
- **O9 F**: nicio lecție nu încarcă biblioteca Windows — etapa C.

## NESIGUR
- Textul de pe ecran al dalelor-folder și al categoriilor (R18-1), submeniul Nou al desktopului (R18-2), caseta de căutare
  din Start (R18-9), pictogramele desktopului (R18-5), numele Word / PowerPoint / Paint pe bară (R18-6) — [NEVERIFICAT].
- Configurația desenată e a PC-ului profesorului (To Do, Notepad++, Chrome fixate; dalele lui; Dropbox / PDF24 / „Open Git
  Bash here” în meniuri) — decizia (a) din runda 15; elevul nu le va găsi în laborator. De hotărât de orchestrator / Vasile.
- Simbolul Start e un pătrat cu 4 ferestre desenat în CSS (sigla Windows nu e în setul Fluent; I7); pictogramele folderelor
  și ale lui „Acest PC” / „Coș de reciclare” sunt forme CSS simple.
- `windows.alimentare`, `calendar`, `cautare`, `desktop`, `fereastra`, `securitate_windows` rămân fără referință (O3 +1
  fiecare, neschimbat); le-am făcut simple, fără pretenție de fidelitate.
