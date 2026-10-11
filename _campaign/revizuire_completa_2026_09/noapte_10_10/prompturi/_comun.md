# Partea comună a prompturilor de autor — tura 10→11.10.2026 (M2 la V, VI, VII)

Citește întâi și urmează întocmai `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\07_BRIEF_AUTOR.md` (cu tot ce trimite el să citești: `05_STANDARD_LECTIE.md` ÎNTREG, `jocuri\README.md` §-urile numite). Unde brieful scrie `m1-lNN`, la tine e `m2-lNN`.

## Ce e nou față de lecțiile vechi (citește în standard)
- **Regula 10 (08.10.2026, profesorul): gesturi REALE, mici și dese, în aplicația adevărată.** Nu ajunge un singur pas „Acum în aplicația adevărată” la final: orice gest predat în pagină se face și în aplicația reală cât e proaspăt (deschizi, salvezi, închizi, selectezi…), întâi gesturi de o secundă, apoi combinații; reiei gesturile lecțiilor dinainte. Toate pe calculatorul COMUN din laborator, fără profesor, lăsându-l cum era (regulile 23, 25, 26).
- **Bara pașilor de jos** e acum per elev (motorul, „BARA PE ELEV”): nu scrii nimic despre ea în lecție.
- Notarea (orice lecție care vorbește de note): `C:\00\Projects\LearningHub\_campaign\notare_punctaj_2026_09_29\REGULA_NOUA.md` + `C:\00\Projects\Info_Gimnaziu_2026\SISTEM_EVALUARE.md`. Literele oficiale: C = De bază 40, B = Consolidat 30, A = Avansat 20, +10 din oficiu; nota = punctaj : 10. Oracolele `python C:/00/Projects/LearningHub/_campaign/notare_punctaj_2026_09_29/verifica_regula.py` și `python C:/00/Projects/LearningHub/_campaign/nota_site_2026_10_07/oracol_nota_site.py` → ultima linie 0.

## Calculatorul profesorului — interdicții de noaptea asta (pe lângă regulile 22-27)
- Profesorul doarme; calculatorul lui are ecranul vizibil. **NU porni aplicații din Magazin / UWP** (Clipchamp, Securitate Windows, Fotografii, Calculator, Setări): se deschid pe ecranul VIZIBIL, nu pe desktopul ascuns. Faptele despre ele le iei din capturile existente pe sit (jocurile LearningHub) și din documentația oficială Microsoft (adresa exactă în `surse.md`), iar ce nu poți confirma trece în `nesigur` și se scrie prudent.
- **NU înregistra niciodată de la microfonul real** și nu porni camera.
- **NU schimba nicio setare de securitate** (Microsoft Defender, firewall, conturi, parole) — doar citești (PowerShell `Get-MpComputerStatus` etc.).
- Browser: probele lecției în Chromium headless cu rețeaua blocată (regula 24) și `ctx.close()`. Dacă trebuie să vezi un site public (motor de căutare, Wikimedia), doar Chromium headless cu profil TEMPORAR, fără cont, fără nicio dată a profesorului în căutări; NICIODATĂ profilul browserului profesorului.
- Explorer: nimic pe ecranul vizibil. Operațiile cu fișiere le probezi prin cod (Python / `Shell.Application`) pe un dosar al tău din `_proba\`; numele RO din `calibrare\meniuri_ro_en.json` și din capturile existente. Nu lăsa urme în registrul Explorer (`BagMRU`/`Bags`, `ComDlg32`) — vezi `08_RELUARE.md` §9; dacă o probă le atinge, notezi exact ce și le pui la loc doar pe ale tale.
- Office: doar PID-ul tău, `DispatchEx` invizibil, `Saved=True` + `Close` înainte de `Quit`, `AddToMru=False`; PowerPoint cu lacătul `verificare_lectii\lacat_office.py`. Alți autori lucrează în paralel în Word/PowerPoint/Excel: nu închide nimic ce nu e al tău.
- Nicio oprire de procese după NUME. Doar PID-urile tale.

## Depozitul (alte sesiuni lucrează în paralel în LearningHub)
- Atingi DOAR dosarul lecției tale și extensii NOI în `lectii\_sim\` (nume nou, proprietar = lecția ta). NU atingi `jocuri\_motor\`, `assets\js\prezenta.js`, `lectii\_sim\rezultat-elev.js`, simulatoarele altora, `jurnal\`, `cum-fac\`, `hub\`, `lectii\plan.json`, alte lecții.
- Sesiunea `ai-0-b7` poate schimba `jocuri\_motor\motor.js` în noaptea asta (doar parametrul `?vezi=pN`; fără el lecția se încarcă la fel). Dacă `test_joc.py` pică dintr-o cauză din motor, nu din lecția ta: aștepți 5 minute, rulezi din nou și scrii în `surse.md` ce ai văzut.
- NU faci commit, NU publici.
- Dacă lecția ta e prima dintr-un lanț (o lecție următoare îți va extinde simulatorul): fă simulatorul cu un API public curat (o funcție de creare cu opțiuni, evenimente/verificări documentate în capul fișierului) și scrie în `surse.md` secțiunea „Pentru lecția următoare”: ce funcții poate folosi, ce nu are voie să schimbe.

## Economia contextului
Ieșirile lungi în `_proba\*.txt` și citești coada; pagina pe secțiuni; `_proba\stare_autor.md` la zi (decizii, variante respinse, ce urmează). Dacă dirijorul îți cere predarea, o completezi și te oprești.

## Răspunsul final
JSON-ul din brief, plus `"simulatoare_noi":[căi]` și `"pentru_vecini":"…"` (ce trebuie să știe autorul lecției următoare).
