# U4 — Siguranța datelor, publicarea, componentele comune

Fișa unificată a categoriilor SIGURANTA_DATE, PUBLICARE și COMPONENTE, din cele 11 extrageri din `ghid_consolidat_25_10\extrase\` (25.10.2026). Reperul oficial e `05_STANDARD_LECTIE.md`. Regulile 20-27 se citează după număr („regula N”).

**Trimiterile `[surse: …]`** arată fișierul de extragere și linia lui. Fiecare linie din extragere are sursa originală și data. Prescurtări: B = `B_jurnal.md`, C1 = `C1_rapoarte.md`, C2 = `C2_planuri.md`, C3 = `C3_cercetare_memorie.md`, D1 = `D1_prompturi.md`, D2 = `D2_prompturi_m3.md`, E5 = `E_v.md`, E6 = `E_vi.md`, E7 = `E_vii.md`, E7a = `E_vii_l01_03.md`, E8 = `E_viii.md`. „Std r.N” = regula N din `05_STANDARD_LECTIE.md`. Liniile E7:17-25, E7:47 și E7:48 repetă notele lecției VI/1 (E6), iar E7:67 e identică cu E6:66 și E8:81; toate sunt citate o singură dată.

**Căi scurte:** `VL\` = `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\`; `DP` = `python C:/00/AI_0/tools/learninghub_date_personale.py`; `ACT` = `python C:/00/AI_0/tools/activitate.py lista`.

## SIGURANTA_DATE

### Regulile 21-27 pe scurt
- Așa le repetă prompturile și rapoartele: 21 = fișierele de descărcat nu au nume în metadate; 22 = nimic nu pleacă spre servicii externe; 23 = calculatorul din laborator e comun; 24 = probele rulează cu rețeaua blocată și se închid doar cu `ctx.close()`; 25 = calculatorul profesorului rămâne cum era (doar PID-ul propriu, fără urme în „Recent”, fără fișiere de recuperare, nimic instalat, setările puse la loc); 26 = „numele există deja” arată altfel la prima salvare și la Salvare ca; 27 = nicio dată personală în ce se publică. Numerotarea e cea din standard (prompturile M3 o au altfel; vezi Contradicții). [surse: C1:134, C3:163, C3:166, D1:15]

### Nimic nu pleacă spre servicii externe (regula 22)
- Nicio dată a profesorului (nume, e-mail, nume de utilizator) nu pleacă spre servicii externe: nici în User-Agent, nici în antete, nici în parametri. Singurul User-Agent folosit e `LearningHub-lectii/1.0 (educational site)`. Pe 27.09, câteva scripturi au trimis partea locală a e-mailului profesorului spre Wikimedia Commons; au fost oprite și curățate. [surse: Std r.22, E5:43, E6:20, C3:164]
- Înainte de rulările care ies pe web, cauți numele contului în scripturile tale (grep). Scripturile din `_proba\` nu trimit nimic spre servicii externe, iar căile din ele sunt relative la `__file__`. [surse: C3:164, E5:43, E8:282]
- Singurele cereri externe permise la pregătirea unei lecții sunt citirile fără nicio dată a profesorului: API-ul Wikimedia Commons și fișierul fotografiei (cu User-Agent-ul de mai sus; la eroarea 429 reiei după o pauză), documentația (Microsoft ro-ro, MDN, ajutorul Google prin adresa `?q=`) și siteuri publice fără date. [surse: E8:282, E8:307, E7:126, E7:369]
- Miniaturile Commons privite la alegerea unei fotografii (fără atribuire) și pictogramele ajutorului Google se șterg după alegere (`_proba\curata_proba.py`). [surse: E5:405, E7:369]
- Un site aflat în spatele unei verificări Cloudflare (dnsc.ro: 403, „Doar un moment…”) nu se ocolește. [surse: E8:324]

### Probele cu browser și panoul profesorului (regula 24)
- Orice probă cu browser care încarcă o pagină a sitului blochează TOATE cererile care nu merg spre serverul local: `ctx.route("**/*", …)` lasă să treacă doar `127.0.0.1`, `localhost`, `file:` și `data:`, iar restul primește `abort()` sau un răspuns fals. Fiecare probă tipărește câte cereri a oprit și câte au mers spre `teste-vasile` (trebuie 0). Cererile oprite de tine nu sunt erori ale paginii (de exemplu `net::ERR_FAILED` la fonturile Google). Cererile locale eșuate sunt erori. [surse: Std r.24, E5:68, E8:32, E7a:32]
- Contextul se închide DOAR cu `ctx.close()`, niciodată cu `page.close()`. La `page.close()`, `prezenta.js` trimite cu `navigator.sendBeacon`, iar cererea scapă de `ctx.route`: așa au ajuns de două ori elevi de probă în panou. Pui și o gardă în pagină. [surse: B:43, E6:18, C2:53, E5:41]
- Probele servesc situl local (`_proba\server_local.py`, de exemplu `lectii\viii\m1-l01\_proba\server_local.py`) și nu deschid pagina ca fișier. Probele cu elevi înscriși folosesc nume INVENTATE, un server de progres FALS local (`pin_deconectare\probe\server`) și rețeaua oprită de la început. [surse: E5:41, E5:148, E8:32]
- Sunt interzise în probe: `jocuri\_motor\proba_prezenta.py` (trimite la serverul VIU) și orice cerere spre `teste-vasile.netlify.app`, spre Worker-ul `lh-api` (Cloudflare; bugetul zilnic D1 a fost depășit pe 15.10) sau spre `learninghub-8z6.pages.dev` cu `prezenta.js` activ. [surse: D1:124, D1:143, C3:168]
- `prezenta.js` trimite date doar pentru un elev ÎNSCRIS și activ (`eElev() && stare()==='activ'`: id-ul și numele criptat). Motorul trimite diploma doar la butonul de trimitere. Contorul de vizitatori trimite un id aleator, fără nume. O probă cu browser curat care apasă „Mai târziu” nu trimite niciun nume. [surse: E8:33, E5:88, E7a:119]
- Pe 28.09, doi elevi inventați au ajuns în panoul real (la 8 A), din probe fără rețea blocată. Ștergerea țintită nu există: `activitate.py` are doar `sterge --toate`, care ar șterge și elevii reali. Decizia îi aparține lui Vasile, pentru că cere o schimbare pe server. [surse: B:42, Std r.24]
- După o probă rulată fără blocare: faci inventarul (ce rulări au putut trimite spre serverul de activitate, cu ce elevi falși, câte), verifici panoul și ștergi scripturile de depanare care au încărcat elevi fără blocare. [surse: E7a:33, E7a:32, E8:32]
- La poarta componentelor mici (24.10), 137 din 151 de scripturi ale autorilor VIII aveau `abort`; unul (retezat.ro) mergea pe un sit public fără date. Probele cu browser rulează în Chromium headless. [surse: C1:135]
- Verificarea panoului după probe: ieșirea `ACT` conține nume reale de elevi, deci NU se salvează în niciun fișier, nici în dosare ignorate de git. Doar numeri: `ACT | grep -c "nu e în catalog"`, CU „î”. Unealta scrie „(nu e în catalog)” (verificat în `C:\00\AI_0\tools\activitate.py`, rândul 332); fără „î”, grep-ul dă mereu 0. La 24.10 erau 2 rânduri moștenite (elevi reali); la final trebuie să fie tot atâtea, cu 0 elevi de probă. (Înlocuiește: „o singură rulare, căutare după numele de probă, ieșirea ștearsă”, 28.09, și grep-ul fără „î” din prompturile din 10-16.10.) [surse: D2:210, D1:148, B:241, C1:138]
- Incidente închise: ieșirea `ACT`, cu nume de elevi, a stat o clipă în `_verificare\` (19.10) și în dosarul unei lecții (24.10), apoi a fost ștearsă; la M3 s-au găsit și șters 11 fișiere cu liste. Dirijorul verifică apoi că niciun fișier nu mai conține lista (în note rămâne doar numărul). [surse: B:164, B:232, C1:138]
- Probele cu browser fără profil adaugă vizitatori la contorul hub-ului; după probe rulezi `admin vizitatori-sterge`. Feedback-ul și contorul stau pe `teste-vasile.netlify.app` (`/api/feedback`, `/api/vizitatori`, id `lh_viz`). [surse: C3:175]
- Dacă elevi falși au ajuns totuși în panou, curățenia se face pe id: `activitate-sterge` + `activitate-brut-sterge`, apoi cheile `progres/<h>` din D1. [surse: C3:168]
- Probele din `teste-elevi` (`proba_panou_clasa.py`, `proba_calculator_comun.py`) lovesc situl VIU: nu le rulezi în paralel cu alte lucrări. [surse: C2:266]
- Probele de server rulează izolat: depozit în memorie și `@netlify/blobs` înlocuit (`izolare.mjs`: `pachet_real_incarcat: 0, apeluri_fetch: 0`), iar browserul folosește `ctx.route` și `--host-resolver-rules`. [surse: C2:266]
- Un alias de deploy Netlify (`--alias`) scrie în ACELAȘI depozit de date ca situl live. Pe alias rulezi DOAR probe fără scrieri (`proba_alias.py`: 19 verificări, „scrieri trimise: 0”; `pin_lansare.py --citeste`), nu matricea și nici atacurile. Dai mereu `--site <id>`. [surse: C2:267, C2:180]

### Calculatorul comun din laborator (regula 23)
- Tot ce păstrează pagina în browser e al elevului care stă ACUM pe scaun. Fie îl legi de identitatea din „Spune cine ești” prin componenta comună `rezultat-elev.js`, fie îl ții DOAR în memoria paginii, cu butonul vizibil „Sunt alt elev / Încep din nou”. Se probează cu doi-trei elevi pe același calculator (`doi_elevi.py`; `proba_r23.py`: 25/25, 0 cereri scăpate). [surse: Std r.23, E5:42, E6:176, E7:189, C3:166]
- Dacă lecția nu păstrează nicio verificare, nu folosești `rezultat-elev.js`. Bifele de autoverificare stau doar în memoria paginii și se golesc la „Sunt alt elev” și la schimbarea elevului din caseta `prezenta.js` (evenimentul `prezenta`). Proba compară cheile `localStorage` înainte și după. Ce trebuie păstrat (de exemplu „De unde pleci?”) se scrie în caiet. [surse: E6:166, E6:176, E5:42, E7:300]
- Identitatea se verifică O DATĂ, la început și la vedere, înaintea butonului mare „Lecția 1” („Pe etichetă e numele celui care lucrează. Alt nume? … Nu ești tu? Schimbă elevul”), apoi scurt înainte de laborator. Judecătorul a găsit un GRAV: o colegă rămăsese conectată, iar pașii se scriau pe numele ei. „Cine dă evaluarea?” stă la începutul atelierului. [surse: E6:16, E7a:36]
- Codul de intrare are 4 cifre. Din 30.09, `prezenta.js` îl cere la fiecare intrare pe numele unui elev. Elevul îl scrie în caiet și nu-l spune nimănui. În „Cine ești?” și în „Păstrează progresul online” cifrele SE VĂD la tastare; sunt ascunse doar în „Salut, …!”. De aceea lecția spune „cifrele se văd, așa că te uiți să nu stea nimeni lângă tine”, nu „e ascuns” (corectat de dirijor la 16.10, în `fapte.json`, `cod_ascuns`). [surse: E7a:48, E8:41]
- Codul nu pleacă nicăieri și nu stă în clar: se compară amprenta SHA-256 (școală + clasă + nume + cod). După deconectare, intrarea din listă cere codul; 5 coduri greșite la rând dau o pauză de 30 s. „Ieși (deconectare)” se vede din eticheta de jos. [surse: C2:178]
- Progresul online stă DOAR sub amprentă, fără nume și fără id. De la PIN, fiecare salvare poartă și id-ul elevului, pentru panou. [surse: C2:180]
- Limitele amprentei se spun cinstit: oricine se poate înscrie pe un aparat nou cu orice nume. Cine scrie direct în `localStorage` poate face orice, deci nu e o barieră de securitate; protecția e pe drumurile din pagină. O impersonare pregătită înainte de lansarea PIN nu se poate opri retroactiv. [surse: C2:421]
- Selectorul de profil nu sare peste alegere dacă browserul are deja un profil activ. Înainte, al doilea elev moștenea numele și progresul primului; reparat la 12.09 („Bine ai venit înapoi, <nume>. Tu ești?”). [surse: C3:237]
- Semnalele reale ale elevilor (minori): până la avizul /legal se strâng doar numere adunate pe pas (câte indicii, câte „Arată-mi răspunsul”), fără amprenta dispozitivului și fără nume (S18). Întrebările elevilor din „Cum fac…?” nu se păstrează. [surse: C2:127, C3:175]

### Calculatorul profesorului: reguli generale (regula 25)
- Calculatorul profesorului rămâne cum era. În timpul probelor (noaptea, cu ecranul vizibil) nu apare nimic pe ecran. Nu pornești aplicații din Magazin/UWP (Paint nou, Notepad din Windows 11, Clipchamp, Fotografii, Calculator, Setări, Securitate Windows), pentru că se deschid pe ecranul VIZIBIL. Faptele despre ele vin din capturile existente pe sit și din documentația oficială Microsoft (adresa intră în `surse.md`); ce nu se confirmă trece la „nesigur”. (Înlocuiește: Std r.25 din 28.09, care permitea Paint/Notepad cu o copie a `Helium\User.dat`; vezi Contradicții.) [surse: D1:11, D2:199, Std r.25]
- Nu folosești microfonul real (redarea se face doar cu fișiere de liniște, de exemplu `liniste-20s.wav`) și nici camera. Nu intri în niciun cont (Google, Microsoft, Scratch) și nu tastezi nimic în formularele de conectare ale serviciilor reale. Nu schimbi nicio setare de securitate (Defender, firewall, conturi, parole); doar citești, de exemplu cu `Get-MpComputerStatus`. [surse: D1:12, D2:199, E7:204]
- Procesele: „Nicio oprire de procese după NUME. Doar PID-urile tale.” Notezi PID-ul la pornire și închizi doar instanța ta (`taskkill /PID <al tău>`). Un proces oprit forțat se recunoaște după linia de comandă și ora pornirii. Urmărești și procesele-copil ale lansatorului (la Notepad, copilul are ca părinte PID-ul tău — rețeta Notepad e depășită, vezi X.1 V-2). La final nu rămâne niciun proces pornit de agenți. [surse: D1:17, Std r.25, E7a:88, E8:254]
- Pui la loc numai ce a schimbat proba ta, adică doar valorile care poartă marcajul probei. Autorul VIII/14 a „pus la loc” 22 de valori comune (UserAssist, FeatureUsage, poziția unei ferestre Explorer) pe care le schimbase altcineva în acele 2 minute. [surse: E8:254, B:111, C1:141]
- Fișierele de probă nu ajung în afara dosarului tău. După o Anulare, fereastra „Salvare ca” poate porni în dosarul de lucru al procesului (`C:\00\AI_0`): acolo au ajuns 4 fișiere de probă (găsite cu es.exe), iar un judecător a lăsat alte 6. [surse: E8:254, B:111]
- Clipboardul real nu se atinge: operațiile cu fișiere se fac prin IFileOperation, nu cu Ctrl+C/V. La final verifici Coșul (0 elemente ale tale). [surse: E5:212, Std r.17]
- Pui la loc imprimanta implicită, profilurile de browser și orice setare de aplicație schimbată temporar (Excel: `IgnoreRemoteRequests` refăcut și notat). [surse: C3:165, E8:209]
- Copiile temporare făcute de porți (de exemplu 129 MB în `poarta\inainte\`) se șterg după reverificare. [surse: C1:145]
- O lecție pregătită fără ecran scrie în `surse.md` ce n-a pornit: nicio aplicație și nicio fereastră, doar fișiere citite și Chromium headless cu rețeaua blocată; nicio cheie de registru atinsă; cereri spre Commons doar cu User-Agent-ul regulii 22; `DP` → 0; `ACT | grep -c "nu e în catalog"` dă același număr înainte și după probe. [surse: E5:369, E5:425, E5:405, E8:282]
- Pachetul de limbă română pentru Office: RISC, neexecutat, cere acordul profesorului. Dacă Office e pe „Match Microsoft Windows”, după instalare programele pornesc în română și pentru el. Înainte de instalare: File → Options → Language → English (United States) → „Set as Preferred”. Pentru citirea panglicii RO se comută `UILanguageTag` ~10 s și se pune imediat la loc pe `en-us`, noaptea sau cu Office oprit; scriptul verifică revenirea la final. [surse: C2:147]
- Incidente închise (lecție de proces): Audacity pornit o dată pe ecranul vizibil cu `--version`; 130 de subchei ComDlg32 ale altor probe șterse de un judecător; Word lăsat în Aspect web la 105 %; `PreferenceMACs` din Chrome/Edge rescrise; MRU Explorer reordonat; `gen_py` PowerPoint stricat, mutat deoparte. [surse: C1:141, B:125]

### Office în probe (regula 25)
- Folosești o instanță proprie și invizibilă (`DispatchEx`) și îi notezi PID-ul. Pornești Excel FĂRĂ fișier și deschizi cu `Workbooks.Open(..., AddToMru=False)`: deschiderea din linia de comandă (`EXCEL.EXE /x <fișier>`) lasă urme în `HKCU\Software\Microsoft\Office\16.0\Excel\User MRU\…\File MRU` și în Place MRU. În Word salvezi cu `SaveAs2(AddToRecentFiles=False)`; PowerPoint nu are opțiunea asta. [surse: Std r.25, E8:81, D1:15]
- Închiderea: `Saved=True` și `Close(SaveChanges=False)` pe fiecare fișier, apoi `Quit`, apoi `taskkill /PID` doar pe procesul tău. Un `taskkill` pe o instanță cu fișiere deschise lasă fișiere de recuperare în `%APPDATA%\Microsoft\Excel\` (sau Word/PowerPoint), iar profesorul vede apoi „Document Recovery” la fiecare Excel nou (28.09: `_j2_copie`; 17 fișiere Word `*((Unsaved-*)).asd`). Fișierele lăsate de probe se MUTĂ (nu se șterg) în `VL\_carantina_recuperare_{excel,word}\`. Cele de dinaintea campaniei sunt ale lui și nu se ating. [surse: Std r.25, B:49, E7a:88]
- La final verifici că `%APPDATA%\Microsoft\Excel\` și `…\PowerPoint\` nu au fișiere de recuperare ale tale, nici `UnsavedFiles`, nici cheia Resiliency. Din `Resiliency\DisabledItems` ștergi doar valoarea ta. [surse: E8:81, E6:95, E7a:119]
- PowerPoint și Audacity se folosesc doar cu lacătul `VL\lacat_office.py` (`ia` / `reinnoieste` / `elibereaza`). Lacătul expiră după 60 de minute fără reînnoire, așa că îl reînnoiești la fiecare rundă. PowerPoint rulează o singură dată pe PC: nu chemi `Quit()` pe o instanță pe care n-ai pornit-o tu. [surse: Std r.25, Std r.19, C2:54, D2:199]
- Lista „Recent” o curăță dirijorul la final, cu toate aplicațiile Office închise (alți autori lucrează în paralel): `VL\curata_mru_office.py --sterge` scoate DOAR intrările de sub `lectii\…\_proba`, `_verificare`, `_campaign` și `Temp\claude` și trebuie să lase 0. Autorul scoate cel mult intrările probelor lui (File MRU, Place MRU, scurtăturile din `%APPDATA%\Microsoft\Office\Recent`), nu și pe ale judecătorului sau ale altor lecții. [surse: B:47, C2:169, E8:99, E8:176]
- Word ține minte vederea și zoomul ultimei ferestre și le dă documentelor noi. Orice probă citește la început `ActiveWindow.View.Type` și `View.Zoom.Percentage` și le pune la loc PRIN WORD (COM) înainte de `Quit`. NU scrii înapoi în registru valorile citite din `Word\Data`/`Word\Options`: așa a apărut probabil Web Layout la 200 % (VII/9). Starea profesorului e Print Layout (3) la 100 %. La fel pui la loc semnele ¶, riglele și bara Acces rapid și le verifici într-o instanță nouă (`verifica_setari.py`). Un Word pornit de profesor nu se atinge. [surse: Std r.25, B:73, B:57, E7a:88]
- Fila File și lista Recent arată numele contului Office, e-mailul OneDrive și fișiere reale, așa că le ascunzi în orice captură. [surse: E6:95]
- Registrele de descărcat se fac fără Excel (openpyxl, date inventate). Pașii de laborator se probează pe o COPIE nesalvată, deschisă cu `AddToMru=False` și ștearsă apoi. Lacătele `~$` rămase în `_proba\fisiere\` se șterg. [surse: E8:176, E8:193, E7:166]

### Registrul, Explorer și ferestrele Deschidere/Salvare ca (regula 25)
- Explorer-ul real și ferestrele Open/Save din Office și Edge scriu în registru la fiecare folder vizitat: în `HKCU\Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\BagMRU` și `…\Bags`, în `ComDlg32` (inclusiv `CIDSizeMRU` și `OpenSavePidlMRU`), în `RecentDocs` și în `TypedPaths`. Înainte de orice probă care deschide foldere faci în memorie un instantaneu ÎNTREG al acestor chei (valorile, nu amprente) și al folderului Recent. După probă pui totul la loc EXACT (`registry_egal_cu_inainte: true`). [surse: Std r.25, E5:314, E5:185, D1:71]
- Pui la loc DOAR ce s-a schimbat între „înainte” și „imediat după”, și doar dacă valoarea e încă cea lăsată de probă. Subcheile șterse de shell se refac din copie (`urme_refa_chei.py`). Listele de salt noi din Recent se șterg, iar cele schimbate se refac din octeții de dinainte. Dacă altă sesiune scrie în registru în același timp, compari cu instantaneele tale și nu recreezi nimic ce n-a existat înaintea probelor tale. [surse: E5:314, D1:16]
- Copia pe disc a cheilor conține numele folderelor profesorului: stă doar în `%TEMP%` sau în scratchpad, niciodată în lecție, și se șterge după punerea la loc. În JSON-urile lecției, contul devine `<utilizator>`. [surse: Std r.25, E5:314, E5:185]
- Explorer nu apare pe ecranul vizibil și nu se pornește nici pe desktopul ascuns (un al doilea `explorer.exe` ar porni ca shell). Operațiile cu fișiere se probează prin cod (Python, `Shell.Application`, IFileOperation), pe un dosar propriu din `_proba\` (autorul) sau `_verificare\` (judecătorul). Numele românești vin din `calibrare\meniuri_ro_en.json` și din capturile existente. [surse: D1:16, E5:185, E5:212]
- `ExplorerBrowser` găzduit în probe scrie în `BagMRU`, `Bags` și `MRUListEx` chiar cu `EBO_NOPERSISTVIEWSTATE` (0x80): de fiecare dată lasă 9 urme. Dacă îl folosești, salvezi întâi valorile și le pui la loc (de exemplu cu `registru_v11.py --repara`, sau cu `reg_shell_copie.py`, care copiază tot `Shell`: 7.356 de chei). [surse: D1:68, E5:223, E5:248]
- Sondele de căutare pot porni un `explorer.exe` separat (`/factory,… -Embedding`) care ține ferestre pe desktopul ascuns. Le închizi cu WM_CLOSE (`curata_ferestre_ascunse.py`), cu o copie a registrului făcută înainte (închiderea a scris 12 urme). [surse: E5:248]
- Fereastra de import din Audacity creează ~99 de chei goale `OpenSavePidlMRU\<ext>`; le ștergi doar pe ale tale (`registru_explorer.py`). [surse: D1:89]
- Ordinea din `MRUListEx`, odată stricată, nu se mai poate reconstitui (V/9: ordinea din Documents pierdută; la V/12, 3 noduri BagMRU, fără efect vizibil). De aceea instantaneul se face ÎNAINTE. La rulările întrerupte verifici ora la care s-au scris cheile, pentru că nodurile noi pot fi ale altor procese sau sesiuni. [surse: Std r.25, E5:185, E5:248, E5:212]
- Urmele Explorer rămase (BagMRU/Bags, `ComDlg32\CIDSizeMRU` pentru python.exe) le curăță dirijorul la final, când nu mai rulează niciun agent. [surse: B:73]

### Salvările de probă și fișierele profesorului (regulile 25-26)
- Salvezi DOAR într-un dosar al tău de sub `_proba\` (`_proba\_salvari\`, `_proba\salvari\`) sau `_verificare\`. Înainte de Save verifici locul ales; dacă nu e al tău, anulezi. Scriptul are o gardă: apasă Save numai dacă locul e `_salvari`, altfel dă Cancel și se oprește. Pe 28.09, o probă a salvat un registru gol în `OneDrive\Documents` al profesorului (Ctrl+S propunea Documents); a fost șters, dar poate fi încă în coșul online. Salvările probei se șterg la final. [surse: C2:55, E8:98, B:58, E6:95]
- Descărcările profesorului nu se ating și nu se fotografiază. „Salvare ca” din Edge a propus un fișier de acolo („… există deja. Îl înlocuiți?”). Remediul: scriptul tastează calea în câmp și apasă Enter acolo, iar la „există deja” apasă mereu Nu. Capturile brute cu folderele lui se șterg; în lecție intră doar fâșii (titlul + bara de adresă, „Nume fișier”, butoanele). Fișierul `.tmp` lăsat de Edge se șterge. [surse: D1:71, E5:313]
- La „numele există deja” (regula 26), lecția și probele apasă Nu/Anulare și adaugă prenumele sau o cifră; nu înlocuiesc niciodată fișierul altcuiva. [surse: Std r.26, D2:198, E6:166]

### Browsere reale, Audacity, Notepad
- Pentru probele de pagină nu pornești Chrome sau Edge REALI. Pe 12.10, un profil temporar numit tot „Default” a rescris în registrul profesorului `HKCU\Software\Google\Chrome\PreferenceMACs\Default` (22 de valori schimbate, 77 șterse) și `…\Microsoft\Edge\PreferenceMACs\Default` (13 schimbate), iar Edge-ul temporar s-a conectat singur la contul Windows. Folosești Chromium-ul din Playwright, headless. Dacă un fapt cere neapărat Edge real: întâi `reg export` pe `…\Edge\PreferenceMACs` și `…\Edge\PrefsEnclave`, pornești cu `--profile-directory=ProbaLH` și `--no-first-run`, fără conectare, apoi pui la loc doar ce ai schimbat. [surse: D1:18]
- Siteurile publice (motor de căutare, Wikimedia, ajutorul Google/Microsoft, pagina de conectare) le deschizi doar în Chromium headless, cu profil TEMPORAR, fără cont și fără nicio dată a profesorului în căutări. Nu folosești niciodată profilul de browser al profesorului. Profilul temporar (de exemplu `_proba\_profil_tmp`) se șterge la final. Chromium-ul întreg lasă în registru cel mult `HKCU\Software\Chromium\BLBeacon`. [surse: D1:13, E5:353, E8:307]
- Fișierele `Login Data` și `Web Data` ale profilului de probă le citești după `ctx.close()`, cu o așteptare de până la 8 s (fișierul e încă blocat). [surse: E6:230]
- Audacity: faci O DATĂ, înainte de prima probă, o copie a setărilor din `%APPDATA%\audacity` și `%LOCALAPPDATA%\audacity` (în scratchpad, pentru că are căi cu numele contului) și o restaurezi după FIECARE probă, cu amprente sha256 (`restaurat_identic: True`, 21 de fișiere). Audacity se pornește SUSPENDAT, pe un desktop ascuns; tastele și clicurile merg ca mesaje, pozele se fac cu PrintWindow și oprești doar PID-ul tău. Nu-l pornești dacă rulează alt Audacity. Fișierele atinse la rulare (`Audacity4.ini [ActiveProjects]`, `session.json`, `SessionData\*.aup4unsaved*` etc.) se pun la loc sau se scot, iar `HKCU\Software\*Audacity*` se compară. [surse: E7:203]
- Notepad: tastele merg ca mesaje în coada ferestrei, iar fișierele de sesiune create (`LocalState\TabState`, `WindowState`) se șterg. [surse: E8:254] **Depășit (25.10):** din 10-23.10 Notepad-ul nou (aplicație din Magazin) nu se mai pornește în probe (regula 25, Partea I.4).

### Metadatele fișierelor de descărcat (regula 21)
- Word, PowerPoint și Excel scriu la salvare contul Office în câmpurile autor și ultima modificare (un astfel de fișier era deja publicat; `fa_pptx.py` salvează cu numele contului). După orice salvare sau regenerare rulezi `python …\VL\curata_metadate.py --curata`, apoi aceeași comandă fără `--curata` (ultima linie trebuie să fie 0), apoi redeschizi fișierul în aplicație. Dacă lecția nu are fișiere de descărcat, nu e nimic de curățat. [surse: Std r.21, C2:49, E6:134, C3:170, B:25]
- NU folosești `Document.RemovePersonalInformation=True`, pentru că lasă bara galbenă „PERSONAL INFORMATION REMOVAL ENABLED”. Un fișier care o are se repară cu `VL\scoate_bara_docx.py <fișier.docx>`. [surse: Std r.21]
- `curata_metadate.py` se aplică și pe imagini; o imagine refăcută cu PIL nu are EXIF. [surse: D2:211, E8:282]

### Date personale în ce se publică (regula 27)
- Situl și depozitul GitHub sunt PUBLICE, iar `_campaign/` răspunde cu 200. Acolo ajung `surse.md`, `afirmatii.json`, rapoartele din `_campaign\` și scripturile. Nu scrii căi cu numele contului Windows (scrii `C:\Users\<utilizator>\…` sau `%USERPROFILE%`) și nu scrii e-mailul sau telefonul profesorului. [surse: Std r.27, B:21, C3:163]
- Înainte de ORICE publicare rulezi poarta `DP`; ultima linie trebuie să fie 0 (`--curata` face înlocuirile). Poarta stă în AI_0, nu pe sit, pentru că are tiparele în ea. Ea scanează și dosarele de lucru neurmărite de git, așa că după o tură cu agenți cureți calea contului din ieșirile probelor (`componente_*`, `*_noapte_*`). Curățarea se face LA FINAL, când nicio probă nu mai scrie. Agenții scriu căi relative. Pe 25.10, la 00:05, poarta a oprit corect o publicare. [surse: Std r.27, C3:167, B:293, C2:284]
- O excepție strictă din poartă acoperă subdomeniul Worker-ului, care conține numele de Gmail; trebuie spusă lui Vasile. [surse: C1:136]
- Ieșirile probelor se curăță de numele contului (`curata_nume_cont.py`, `curata_iesiri.py`, `curata_date_personale.py --curata`), care devine `<utilizator>` sau `%USERPROFILE%`: `_proba`, `_verificare`, JSON-urile de fapte, chiar și `ui_ascuns.json` din panglică (elementul MeControl). Apoi verifici tot dosarul (0). `_verificare\` și `_proba\` sunt în `.gitignore` (rândul 39), dar se curăță oricum. [surse: C1:137, C1:143, E7:166, E5:173]
- În simulatoare, folderul contului apare ca `C:/Users/Elev/…`, niciodată cu numele real al contului. [surse: E8:255]
- Capturile nu arată contul: inițialele din bara de titlu, câmpul „Autori” din Save As, panoul din stânga și lista de fișiere din Explorer se acoperă cu negru (`curata_personale.py`) sau rămân doar fâșii. Capturile brute de fereastră întreagă se șterg. [surse: E7:224, E8:100]
- Istoria GitHub (8 commituri din 13-28.09) conține numele contului Windows. DECIZIE (06.10): NU se rescrie, pentru că pe un depozit public, cu mai multe sesiuni și cu Cloudflare legat de commituri, câștigul e mic și riscul mare. Fișierele de acum sunt curate, iar poarta oprește aparițiile noi. [surse: C1:140, B:66, B:117]
- Rămân de curățat (deschise): 4 profiluri temporare de browser cu numele contului în căi (`lectii\vii\m3-l19|l20\_verificare\ab_sonnet\_prof_*`, lăsate de judecătorii sonnet VII/19-20) și dosarul `judecata_caseta\mutanti_copii\` (12 apariții, toate în copii ale lui `prezenta.js`, 0 în lecții). Ștergerea a fost refuzată de permisiuni, deci le șterge Vasile; nu se publică (`_verificare\` e în `.gitignore`). Pe 16.10 a rămas nefăcut și `curata_mru_office.py --sterge`, pentru că rula un EXCEL.EXE străin. [surse: B:240, C3:174, B:145, C1:137]
- O lecție despre date personale nu lasă date personale ale elevului în fișierele pe care le face (numele complet în `src`/`href`). Fișierul de laborator cu numele elevului se verifică drept material de siguranță, iar pagina de la laborator nu se publică. [surse: B:211, E8:321]

### Nume de persoane în lecții, simulatoare și probe
- Numele din pagină, poze, exemple și probe sunt INVENTATE și se verifică în baza profesorului cu oracolul de nume (`lectii\vi\m2-l13\_proba\nume_toate.py --candidat "Prenume Nume"` → 0 potriviri; fiecare lecție își adaptează copia în `_proba`). Judecătorul a găsit un nume „inventat” care era al unui elev real. Numele elevilor de probă rămași în panou nu se refolosesc. În rapoarte nu apare niciun nume real; numele de probă se scriu `<nume de probă>`. [surse: D1:120, C1:139, E6:17, E6:216]
- Domeniile sunt rezervate sau fictive: `@scoala-exemplu.test`, `profesor.tic@scoala-exemplu.test`, `.example`, `*-exemplu.ro`. Colegii simulați și genericul-model folosesc nume inventate. [surse: C2:358, E6:189, C2:336, D2:204]
- În sistem, numele elevilor e numele OFICIAL din catalogul electronic (baza ELEVI). Cine nu mai e în catalog devine TRANSFERAT (o stare, nu o ștergere), iar un nume dubios rămâne marcat „NUME DE CONFIRMAT”. Regula pentru nume fără diacritice e una singură: `tools/litere.py` (`fara_diacritice`, oracolul `litere_proba.py`; NFD nu desface ı ł ø ß). Înainte să schimbi o regulă care face CHEI (amprente, sertare), verifici pe date pe cine atinge. [surse: C3:171, C3:172]
- Elevii mici se înscriu la „Alta școală” când nu își recunosc școala. Regula R12 nu leagă niciodată înscrierile „alta”, așa că un elev care pare că „nu lucrează” se caută întâi printre `scoala=alta`. Rămân deschise: formularul să recunoască școala scrisă de mână, iar panoul să permită „Este de fapt”. [surse: C3:173]

### Simulatoarele cu parole, conturi și poștă
- Simulatoarele nu primesc NICIODATĂ parole reale. Câmpurile sunt `<input type="text">` sau `<textarea>` (adresa nu e nici ea `type="email"`), fără `<form>`, fără `name`, cu `autocomplete/autocorrect/autocapitalize="off"` și `spellcheck="false"`. Nu se folosește `type="password"` (browserul calculatorului comun ar întreba „Salvezi parola?”) și nici `type="file"`: atașarea e o alegere dintr-o listă de fișiere inventate, iar „Salvezi parola?” e un desen. [surse: E6:201, D1:81, D2:202, E6:246]
- Parola inventată SE VEDE în câmp, iar simulatorul spune de ce („Pe pagina adevărată, în loc de litere apar puncte”). Parolele inventate au cel puțin 15 caractere. Pagina spune „nu scrie aici parola ta adevărată”. [surse: E6:216, E7:327, D1:76]
- Nimic din ce tastează elevul nu se salvează și nu pleacă: 0 scrieri în localStorage/sessionStorage/cookie și 0 cereri. Evaluatorul de tărie a parolei rulează doar în pagină, fără servicii de tipul „a fost parola ta furată?”. O parolă de exercițiu nu ajunge în sertarul elevului, în `localStorage` sau spre `teste-vasile`. Motorul ține pe nivel doar numere, iar `prezenta.js` ascultă gesturile doar ca să știe CĂ lucrezi. [surse: D1:76, E6:201, E6:216]
- Proba: un elev INVENTAT se înscrie prin caseta reală, merge pe drumurile greșite ale unui copil și tastează marcaje unice (în parolă, document, comentariu), la 390 px cu atingere și la 1280 px. Rezultatul cerut: marcajele apar de 0 ori în stocare și în cererile oprite, 0 cereri spre afară, niciun `type=password` sau `<form>`, 0 erori JS, iar după închidere 0 urme pe discul profilului (`Login Data.logins = 0`, `Web Data.autofill = 0`). Dovada intră în `surse.md`. [surse: E7:327, E7:346, E6:230, D1:76]
- Izolarea casetei de exersare a codului se PROBEAZĂ, cu 14-16 ferestre de gesturi, unele cu un elev adevărat conectat. Rezultatul cerut: 0 accese la localStorage/sessionStorage/cookie/rețea/`window.Prezenta`, 0 chei `lh_*` schimbate, elevul adevărat rămâne conectat. Proba probei: un mutant care citește `lh_elevi_pc` și trimite cereri trebuie PRINS (24 de accese, 12 cereri). [surse: E7a:55]
- În simulatorul de conectare, butonul de partajare e OPRIT până când lecția dă o funcție `partajare`. Pagina de conectare falsă din exercițiul de phishing are în bară o adresă pe care elevul o citește. [surse: C2:358]

### Reguli de siguranță care trec prin toate lecțiile
- Regula contului: te conectezi doar cu contul TĂU. Elevul se uită al cui e contul (pictograma din dreapta sus). Dacă e al altcuiva sau nu știe, nu deschide nimic în el, iese din cont sau închide aplicația, lucrează în pagină și spune profesorului. Se deconectează la plecare și la pauză, chiar dacă n-a terminat („Sună de pauză? Întâi Profil → Deconectează-te.”). Cine nu are cont sau parolă NU își face cont nou; resetarea o face administratorul contului școlii. Laboratorul nu se încheie fără deconectare (GRAV la VII/14 și VII/15). [surse: D2:201, E7:253, C1:144]
- Poșta pe calculatorul comun (lipsa e GRAV): contul copilului nu rămâne deschis, iar parola nu rămâne salvată în browser (la „Salvezi parola?” refuză; Edge folosește alte cuvinte decât Chrome). Contul altcuiva găsit deschis nu se citește. Lecția închide fila Gmail, nu browserul, ca să nu se închidă și lecția. [surse: D1:80]
- Clipchamp din Windows 11 cere un cont Microsoft personal (la 13-14 ani cu acordul părintelui; limita e 16 ani) sau un cont de școală cu licență. Dacă Windows propune „să țină minte contul pentru toate aplicațiile”, elevul NU acceptă (alege „doar aplicația asta” sau nu se conectează). Că acel cont ar putea rămâne în Windows și l-ar putea conecta pe următorul elev e NESIGUR. Rămâne deschisă întrebarea „ce cont folosesc elevii în laborator?”. [surse: E7:253]
- Regula parolei e una singură, în toate lecțiile: „o știi doar tu și părinții tăi” și „spui imediat profesorului sau părinților dacă ai dat-o”. La clasa a V-a nu se predau parolele („despre ea înveți în clasa a VI-a”). DNSC spune „nimănui”, dar Vasile a decis să rămână formularea lecției. [surse: D2:209, C1:142, C2:336]
- Trimiterea reală: niciun e-mail adevărat spre adrese inventate sau străine. Adresa e doar cea „scrisă de profesor pe tablă” și se verifică înainte de „Trimite”: o literă greșită duce mesajul cu fișier la un străin (GRAV la VI/14). „Ridici mâna până vine profesorul” nu merge la ora simultană, deci lecția are un drum fără profesor. [surse: D2:200, C1:144]
- La ferestrele care apar singure (reclame, „Ai câștigat!”) nu apeși nimic, nici măcar ✕-ul desenat: închizi FILA și spui unui adult. Excepția SPUSĂ e caseta de cookie-uri, care aparține site-ului: apeși butonul scris care refuză (pe Bing, „Respingeți”), nu „Acceptă”. Dacă nu are buton de refuz, închizi fila și alegi alt rezultat. Unde se poate, alegi un site fără casetă (de exemplu ro.wikipedia.org). [surse: B:156, C2:336]
- Nu se publică nicio pagină care imită un avertisment de virus, pentru că filtrele browserelor pot marca tot situl ca înșelător; fereastra falsă rămâne în simulator. Fișierul de test antivirus EICAR e interzis: fereastra cu amenințări se descrie doar în cuvinte („Nu deschizi nimic și chemi un adult.”). Ctrl+W se exersează pe o filă NOUĂ (Ctrl+T, apoi Ctrl+W). [surse: E6:189]
- În lecțiile despre parole, gesturile reale nu schimbă parole, conturi sau setări și nu blochează calculatorul comun (Windows + L îl poate lăsa blocat cu o parolă pe care elevul n-o știe). [surse: D1:77]
- Un fișier descărcat se păstrează doar în funcție de sursă: dacă vine de pe pagina lecției și l-ai cerut tu. Un fișier care vine singur sau de pe un site necunoscut nu se păstrează, iar elevul spune profesorului. [surse: D2:206]
- Documentul echipei e accesibil doar colegilor din echipă și profesorului, niciodată „Oricine are linkul”: rămâne „Restricționat”. Profesorul primește rolul Comentator (VII/19); la VII/20 nu i se schimbă rolul dacă are deja acces, iar Cititor primește doar dacă n-avea deloc acces. (Înlocuiește: „profesorul = Cititor”.) [surse: D2:203]
- Interviul și filmul: cu acordul colegului, fără nume de familie în film, fără fețe când nu e nevoie, fără nicio publicare. Numele proiectului (`Nume_Prenume_clasa_…`) stă în fișier, nu în browser. [surse: D2:204, E7:300]
- La fiecare laborator, judecătorul întreabă ce rămâne pe calculator pentru colegul de după (fișierul din Descărcări, ultimul folder din „Salvare ca”, sesiunea Notepad, fișierul exportat) și dacă laboratorul iese urmat literal. [surse: D1:117, D2:198]
- Faptele juridice se citesc din textul oficial (legislatie.just.ro, EUR-Lex), cu sursa exactă, iar afirmația nu poate fi mai tare decât sursa. GDPR art. 8 fixează 16 ani (statele pot coborî până la 13); Legea 190/2018 nu coboară vârsta. „Fotografia colegului nu o publici fără acordul lui și al părinților” e o regulă de prudență a lecției, sprijinită pe Legea 272/2004 art. 27, nu un citat de lege. Fiecare faptă vine cu legea ei (Codul penal art. 360 vs Legea 8/1996 art. 199 alin. 1). Proiectul „Legea majoratului online” (PL-x 356/2025) se reverifică înainte de 09.02.2027. [surse: D2:207, E8:324]
- Hacker, hacker etic, cracker: definiții simple și oneste (DEX dă doar sensul ilegal, RFC 1392 sensul de pasionat), fără detalii de atac. Hackerul etic lucrează cu permisiunea proprietarului. [surse: D2:208]
- Lista de verificare „ce nu publici” (VIII/20) are 6 întrebări. A șasea: „numele fișierelor din cod, la `src` și `href`, spun cine sunt?” (înlocuiește lista de 5). Un orar real e „programul meu”, deci exemplul devine „Orarul unei clase inventate”. Numele complet din `src`/`href`, cerut de lecțiile 16 și 18, se tratează onest: laboratorul doar îl recunoaște și îl notează în caiet, nu cere redenumirea. Mini-proiectul VIII/21 verifică automat cu `EditorWebVerificare.curat(src, {…, fisiere:false})`, ca numele de fișier cerute de școală (`Nume_Prenume_…`) să nu respingă pagina. [surse: D2:205, D2:206, E8:321]

### Lucrul agenților cu fișierele
- Dosarul trimis unui agent nu scurge răspunsul (L36): listă albă de câmpuri, nicio bucată de 12 caractere din câmpurile ascunse, variante amestecate cu o sămânță secretă, poziția răspunsului corect uniformă pe lot. [surse: C2:121]
- Scripturile care scriu fișiere de livrare stau în dosarul lucrării (`_campaign/<lucrare>/_unelte/`), cu nume specific, nu în scratchpad-ul comun. Un agent a rulat `build.py`-ul altuia și a suprascris glosarul „Cum fac”: 185 de termeni reparați s-au pierdut fără niciun semn. [surse: C3:176]
- Înainte să refaci un fișier din git, îl compari cu ce e ACUM pe disc (`git diff <rev> -- <fișier>`). Refacerea din commitul părinte șterge fără niciun semn munca necomisă a altui agent. [surse: C3:177]

## PUBLICARE

### Cine publică și când
- Publică DOAR dirijorul. Autorii, judecătorii și reparatorii (inclusiv cei care repară componente) nu fac commit și nu publică. [surse: D2:253, C2:51, D1:136]
- O lecție devine publicabilă când judecata finală dă „PUBLICABIL: 0 GRAV / 0 MAJOR”. MINOR-urile rămase se repară în „trecerea scurtă” sau „trecerea de text”, mai ales la evaluările care dau note reale. Un MAJOR ținut deschis (de exemplu la durată) se repară înainte de publicare. [surse: D2:254]
- Se face o singură publicare odată: a doua `publica_lectie.py` nu pornește cât timp prima încă verifică live. Publicările se numerotează la rând (`publica_N.txt`). (Regula dirijorului, 24.10, 05:19.) [surse: B:234]
- Lucrările se fac pe rând. Verificările și commitul NU stau în aceeași comandă înlănțuită: un commit a plecat deși `test_joc` scrisese `[PICAT] … întrebări jucate: None`. Nu legi publicarea de o poartă înainte să-i citești verdictul. [surse: C1:186, B:68]
- Nu se publică după 06:00, pentru că elevii intră pe sit de la ~07:45 (vezi Contradicții pentru 24.10). [surse: C1:189] **Hotărârea consolidării (Partea X.1, V-5):** în zilele de școală nu se publică între 06:00 și 15:00; în weekend și în vacanță, oricând.
- Dacă o lucrare neasistată se termină cu o publicare, verifici publicarea ÎNAINTE să începi: `python C:\00\AI_0\tools\push_ready.py --repo C:\00\Projects\LearningHub` (exit 0 = pot publica singur). `git ls-remote` NU e o probă pe un depozit public, pentru că răspunde și anonim. În noaptea de 2/3.09, un `git push` blocat de o fereastră de autentificare a lăsat 99 de lecții doar pe disc; problema s-a rezolvat la 03.09, prin SSH. [surse: C3:232, C1:191]
- Push-ul se dă fără ferestre: `GIT_TERMINAL_PROMPT=0 GCM_INTERACTIVE=never timeout 90 git push`. [surse: C1:186]
- **[Depășit pentru /lectii/ — din planul de pornire; de la 28.09 lecțiile se publică imediat ce trec judecătorii, cum a cerut Vasile pe 27.09 („Tot ce terminăm trebuie pus pe siteul live”); vezi Partea X.1]** Prima publicare a unei unități (gimnaziu) sau a unei grupe (liceu) cere OK-ul lui Vasile pe Telegram, cu memento la T-5 zile. Fără OK la T-3, lecția rămâne pe nivelul de joc, cu bandă (planul U15). Lecția din 27.09 a ajuns pe producție doar după OK, iar paginile vechi de gimnaziu au primit benzi „în lucru” / „nu o folosi”. [surse: C2:124, B:12]
- Înainte să te sprijini pe o altă lecție, verifici dacă e deja publicată (`stare.py`; la 24.10: M1-M3 complete la toate clasele). [surse: D2:255, B:281]

### `publica_lectie.py`
- Publici doar cu `dirijor\publica_lectie.py <clasa/lecție> …` (poți da mai multe lecții deodată), pornit în fundal cu `timeout 5400`, cu jurnalul în `dirijor\publica_N.txt`. Scriptul face commit și push DOAR dacă trec toate porțile. [surse: C1:188, B:149, B:68]
- Porțile scriptului: planul; build-ul (`lectii\_build\build_lectii.py`, care rulează `test_joc` pe FIECARE lecție publicată); linkurile (`verifica_linkuri.py`); metadatele; datele personale (regula 27); `test_joc`; `verifica_lectie`; „componenta comună e neschimbată față de HEAD”; „conținutul LIVE = fișierul comis”; marcajele; proba de fum la 390 și 1280 px. Ultima linie 0 înseamnă publicat. [surse: B:149, B:71, C3:234, B:141]
- Un timeout într-o poartă e o poartă PICATĂ, nu o cădere fără verdict. Build-ul are 3600 s, iar așteptarea conținutului LIVE e de cel mult 10 minute. Dacă `test_joc` raportează „întrebări jucate: None”, se reia o dată. [surse: B:71, C3:235, B:68]
- Când poarta refuză, nimic nu se comite și nu se împinge. Marcajele puse local de rulare (`plan.json`, indexurile, hub-ul) se întorc cu `git checkout` dacă nu republici. Un refuz venit din încărcarea calculatorului (build → 1, apoi rulat separat → 0) se rezolvă republicând cu TOATE porțile: poarta nu se ocolește. [surse: B:181, B:274, C1:188]
- Scriptul comite și blocul LECTII din hub, așa că pagina principală se actualizează singură (până pe 06.10 arăta „1 lecție gata”, rămas din 27.09). [surse: B:117, C1:194]
- Scriptul publică prin `git push` doar ce a comis. Un fișier modificat doar în dosarul de lucru (de exemplu `scratch.js` 1.3) NU pleacă odată cu o lecție, iar pe sit rămâne versiunea veche (citită LIVE: 1.1). [surse: B:273]
- O alarmă „falsă cunoscută” poate ascunde una adevărată: poarta a refuzat corect VIII/11 (T0 = 1, dintr-o frază nouă care folosea „legendă” nedefinit), deși judecata 3 o crezuse alarma cunoscută. De aceea compari fiecare caz. Alarma reală a extractorului s-a închis cu eticheta neutră „Sub imagine:”, comparată pe toate cele 42 de lecții. [surse: B:108]

### Porțile lecției (înainte de predare și la fiecare schimbare)
- Setul standard, toate cu 0 / TRECUT: `test_joc.py --dir lectii\<clasa> <lecție>` (avertismentul „1 niveluri” e normal; unitățile `-E0` declară `continuturi:[]`); `verifica_lectie.py <index.html> --fara-t1` cu ultima linie 0 (S0, S1, S2, T0); `verifica_regula.py` și oracolele lecției (`oracol_*.py`, plus `oracol_nota_site.py` dacă lecția vorbește de note); `DP` → 0; parcurgerea cu gesturi reale, la 390 px cu atingere și la 1280 px cu mouse, întâi pe drumul greșit și apoi pe cel bun, până la diplomă, cu 0 erori de consolă și 0 pagini mai late decât ecranul; `ACT`, fără elevi noi. [surse: E5:45, E6:47, D1:36, E7a:71]
- După nevoie: `cuvinte.py` (63-110 cuvinte pe pas), `tinte_tastatura.py`, `licente.py`, `imagini.py`, `proba_afirmatii.py`, `proba_intunecat.py`, `node --check` pe scriptul inline, validarea JSON pentru `afirmatii.json` și `profil.json`, `intrare_cod_texte.py --lectie <lecție>` și `curata_metadate.py` dacă lecția are fișiere de descărcat. Numărul de întrebări jucate de `test_joc` crește odată cu exercițiile. Parcurgerea rulează prin HTTP local, cu rețeaua blocată (0 cereri spre `teste-vasile`). O întrebare cu același enunț ca un exercițiu e prinsă de S2 și se schimbă (V/13: Î2 = P4). [surse: E5:70, E5:278, E7a:92, E7a:71]
- La orice schimbare de regulă rulezi toate oracolele campaniei (`verifica_regula.py`, `oracol_m1l01.py`, `oracol_isj.py`, `oracol_nota_site.py`), care trebuie să arate 0. Un oracol care „pornise de la 8” dovedește că numără probleme reale. [surse: E8:38]
- Te uiți efectiv la capturile de telefon făcute de probe (`_proba\tel_*.png`). [surse: E7a:118]
- La fiecare reparație, `surse.md` primește o secțiune nouă, cu dată (de exemplu „Reparațiile după judecata 1 (12.10.2026)”), cu trimitere la registru și cu ce s-a schimbat pentru lecția următoare, inclusiv în API-ul simulatorului. [surse: D1:36]
- Contractul lucrării (de exemplu `v1_cu_cod_2026_10_16\contract.md`) e legea ei. Judecătorii răspund pe fiecare R cu „DA|NU — dovada”: R6 = oracolele de notare au rămas neschimbate, R9 = niciun elev nou de probă în `ACT` și date personale 0. [surse: D1:132, B:140]
- Insigna e plafonată la „verificat parțial” cât timp mașina n-a trecut bancul, aplicația n-are arbitru sau numele RO sunt NESIGURE. Insigna se generează din `stare_lectii.json` (L33). [surse: C2:119]

### Commitul
- `git add` primește DOAR fișierele numite, niciodată `-A`: dosarele lecțiilor, simulatoarele lor noi, `lectii\plan.json`, `lectii\index.html`, `lectii\<clasa>\index.html` și `hub\index.html`. Verifici cu `git show --stat`: simulatoarele altora și componentele comune nu apar în diff și nu e niciun fișier străin (de la alte sesiuni sau console, de exemplu `curriculum\school_year_2026_2027.json`). [surse: C1:186, C1:190, B:149, C2:168]
- Nu se comit `_verificare\`, `_proba\`, lecțiile nefinalizate și nici dosarele temporare `inainte\`. [surse: C3:234, E6:110, C1:191]
- Fișierele existente se modifică pe text sau pe bytes, păstrând CRLF; nu se rescriu prin serializare. Un `json.dump` a reformatat tot `surse.md` publicat și a trebuit întors cu `git checkout`. [surse: B:278]
- Dintr-o ramură de lucru se publică fișier cu fișier, cu `git checkout <ramura> -- <fișier>`, nu prin merge de ramură; sha1-urile trebuie să fie cele din lista porții. [surse: B:102, C1:208]
- După publicarea unei lecții, verifici că pagina ei rămâne neschimbată (`git diff` gol pe dosarul ei și pe simulatoarele ei) cât timp vecinii lucrează peste ea. [surse: D2:256]
- Branch-ul `proba` (situl de probă) s-a publicat în producție doar la cererea lui Vasile (26.09, 14:10 și 27.09, ~10:30), cu `git merge --ff-only proba` + push pe master. Dacă se publică și folderul `sync/` rămâne decizia lui (deschisă). [surse: C3:240]

### Verificarea LIVE
- „Publicat” înseamnă că situl servește conținut IDENTIC, octet cu octet, cu fișierul comis; codul 200 nu ajunge. Cloudflare mai servește câteva minute versiunea veche, așa că aștepți cel mult 10 minute. Un marcaj care există și în versiunea veche nu e dovadă, iar nici un 200 pe `/index.html`. [surse: B:77, C1:187, C2:119, C3:233]
- Compari cu blobul comis (`git show HEAD:<cale>`), nu cu fișierul de pe disc, pentru că git poate schimba CRLF în LF la commit (`scratch.js`: LIVE a6929d05 = blobul, copia locală cu CRLF are 99285488; la fel `paint.js`). [surse: B:274, B:296, C1:193]
- Pagina LIVE o citești cu `curl` sau cu User-Agent de browser. Un script Python cu User-Agent-ul implicit primește 403 de la Cloudflare și pare că tot situl e căzut. Nu trage concluzia „nepublicat” dintr-o singură probă cu User-Agent de Python. [surse: B:19, C3:233]
- După publicare: fraza nouă sau marcajul se văd LIVE pe fiecare pagină schimbată; proba de fum (`fum_live.py`, 390/1280 px) dă 0 erori și 0 cereri spre serverele de teste; `curl` arată că paginile încarcă componenta nouă. [surse: B:38, B:141, B:229]
- Dacă verificarea LIVE pică, dai imediat `git revert` și push. [surse: C1:187]
- Un sit se verifică și cu un browser REAL, pe un eșantion de pagini. 851 din 852 de pagini răspundeau 200 fără erori JS, dar una era complet goală: un `<\/script>` escapat lăsase un `<script>` din antet să înghită tot documentul. [surse: C3:242]
- Producția trebuie să fie identică cu proba aprobată (sume de control, `curl` și OK-ul lui) (S16). [surse: C2:129]

### Ce pleacă împreună
- Lecțiile care se sprijină una pe alta se publică ÎMPREUNĂ (VII/17 cu VII/16; V/16 și VIII/17 în același lot). O lecție care încarcă simulatorul altei lecții încă nepublicate îl publică în versiunea finală (VIII/20 a plecat cu `editorweb-continut.js` al VIII/16). [surse: B:175, B:255]
- O lecție care depinde de o componentă nouă pleacă ODATĂ cu ea: V/1 cu noul `prezenta.js`; `scratch.js` 1.4 împreună cu `lectii\vi\m3-l19\index.html`, altfel gestul vechi nu mai face nimic. [surse: B:52, C1:196]
- O componentă comună modificată NU pleacă împreună cu o lecție: poarta „componentă comună neschimbată” oprește publicarea. Componenta se publică SEPARAT, după poarta de lansare, într-un commit separat (cu calea numită). Apoi se republică lecțiile care o folosesc (VIII/11 și VIII/15 după reparații; VI/18 cu `scratch.js` 1.3). [surse: B:274, C1:192, C2:172, C3:249]
- Lansarea comună a componentelor (25.10): commiturile separate ale componentelor (`bd7c35f8` pentru cele mici, `809d01e1` pentru motor, `a6593cd0` pentru scratch 1.4) au rămas fără push până la lansare. Le-a împins `publica_lectie.py vi/m3-l19 v/m2-l12 vii/m3-l18` (`61e7272c`, ora 01:51). Dirijorul a verificat separat că toate cele 7 fișiere comune LIVE sunt identice cu blobul comis și că marcajele lecțiilor atinse apar LIVE. [surse: B:300, B:296, C1:204]

### Serverul (Netlify), PIN-ul și datele elevilor
- Un deploy de server ia TOT folderul `site\`, inclusiv schimbările necomise ale altor sesiuni (`banci/*`, `test.mjs`, `trimite.mjs`, `prof.html`, `.netlify/functions/*.zip`). Hotărăști explicit cu Vasile dacă pleacă și ele. Un fișier nou ignorat de git (`lib/unire.mjs`) cere `git add -f`, altfel depozitul rămâne fără el. Fiecare fișier se urmărește cu sha1 înainte și după. [surse: C2:269, B:89]
- Când se schimbă și serverul, și clientul, ordinea e: (1) serverul pe aliasul de probă `probapin`, doar citiri (`proba_alias.py` 19/19, 0 scrieri), apoi serverul LIVE (`--prod`), tot doar citiri; (2) commitul în AI_0 al fișierelor de server; (3) PRAGUL lansării (`pin-lansare`), într-o singură comandă; (4) situl (`git push` doar cu `assets/js/prezenta.js`), numai DUPĂ prag; (5) verificări live fără scrieri (`curl … | findstr pin-2026-09-30`, `fum_live.py` → 0, `ACT` fără elevi noi). Pentru întoarcere: `git revert` și push la sit, redeploy din HEAD la server. Combinațiile sit nou + server vechi și invers au comportamente scrise dinainte. [surse: C2:268, B:104, C1:197]
- Dai mereu `--site <id>` (capcana `state.json` din README). Situl de lecții e separat (`--site d7186852-…`). Pentru un site privat fără sitemap folosești `GATE_BYPASS`. [surse: C2:267, B:89]
- R9: înaintea publicării faci o singură citire a panoului (5 % din bugetul D1): `ACT` → 0 „nu e în catalog” noi, 0 nume inventate. Ieșirea nu se păstrează. [surse: B:140]

### Drumul de intrare și paginile comune
- Conținutul publicat la care nu duce niciun drum e tot nelivrat. Când adaugi conținut pentru un public NOU, repari și poarta de intrare: selectorul de profil din `assets/js/user-system.js` (lista `GRADES`). Schimbarea id-urilor din `GRADES` rupe `index.html:190`. [surse: C3:236, C3:241]
- „Ce învățăm acum” se GENEREAZĂ din structura anului (`curriculum/school_year_2026_2027.json`, cu sursa canonică în vault), nu din orar și nu se scrie de mână. [surse: C3:238]
- Panoul clasei ia linkul lecției din `Calendar_ore`, nu din liste scrise de mână. La 27.09, linkurile lecției nr. 4 au fost mutate spre /lectii/ (`AI_0\data\panou\lectii.json`, cu copia `.inainte_lectii_noi`). Banca testelor și jocurile de antrenament/recapitulare se regenerează după fiecare publicare, cu nume stabile și cu tabel de trecere pentru `elevi.db` (S19). [surse: C2:85, B:20, C2:129]
- Pagina clasei (`lectii\<clasa>\index.html`) o actualizează dirijorul la publicare (din „în pregătire” în publicat). [surse: E5:89]
- Orice pagină de sine stătătoare (fără `motor.js` sau `site-credit.js`) primește de mână `<script src="../assets/js/prezenta.js" id="lh-prezenta" defer></script>`, altfel elevii lucrează fără să apară în panou. Proba: `curl` pe pagina vie `| grep lh-prezenta`. [surse: C3:169]
- Un build care înlocuiește orbește `</body>` strică paginile care CONȚIN exemple de HTML. [surse: C3:241]
- Diploma și jurnalul deosebesc lecția de joc. Cheia unei lecții începe cu `lectie_`, iar diploma spune „pentru că a terminat lecția <nr>, „<titlu>”.”; jurnalul scrie „lecție terminată” / „lecție începută”. Jocurile rămân neschimbate. [surse: C2:237]
- Contorul și formularul de feedback ale hub-ului merg pe backendul testelor. Serviciile vechi pierdeau mesajele: Apps Script dădea 403 cu `no-cors`, deci copilul vedea „Mulțumim!”, dar mesajul nu ajungea nicăieri. Sarcina `Secretary_Feedback_Verifica` (14:00 și 20:00) anunță pe Telegram doar ce e NOU. Prima rulare programată n-a fost încă verificată. [surse: C3:239]
- Contractul selfcheck `cum-fac-lectii-acoperite` se face ROȘU la publicarea lecțiilor noi, intenționat: e semnul că trebuie scrise fișe noi „Cum fac”. Orice val de fișe noi se măsoară, înainte de publicare, și pe întrebări „din afara materiei”. [surse: C1:195, C3:252]

### Jurnalul publicărilor (commituri, ca reper)
- 30.09: Excel `d4cdce12`, galeria `f57069fc`; PIN: `prezenta.js` cu marcajul `pin-2026-09-30`. 19.10: V/16 + VIII/17 `8b317fa3`, VI/17 `f0b982d9`, V/18 `abae4f7c` (M2 complet la toate clasele). [surse: B:102, B:104, B:191, B:149]
- 24.10: VII/15-17 `b2c85c54`, VIII/19 `5c023ede`, VI/16 `4199e1ae`, V/19 `f00d7deb`, VII/18 `f97bf36e`, VIII/16 `fb75e3a1`, VIII/20 `9121dfd4`, VII/21 `982f3c6a`, VI/18 `929ce4fd`, V/17 `b41ebffb`, VIII/18 `5b0aaec3`, VII/20 `587ac13c`, VII/19 `655dac6b`, VIII/21 `467ff040`, V/21 `ec0d7603`, V/20 `e172ab20`, `scratch.js` 1.3 `b52018e3`, VI/18-21 `95449728`. Cu ele, M3 e complet (`stare.py`: 24 publicate, 0 în lucru). [surse: B:198, B:229, B:254, B:281]
- 25.10: componentele (`bd7c35f8`, `809d01e1`, `a6593cd0`) și textele VI/19, V/12, VII/18 în `61e7272c`. Lucrarea s-a încheiat cu `componente_24_10\RAPORT.md` pentru Vasile. [surse: B:300]

## COMPONENTE

### Cine are voie să atingă o componentă comună
- Componentele comune sunt motorul (`jocuri\_motor\motor.js`, `motor.css`), `assets\js\prezenta.js`, `lectii\_sim\rezultat-elev.js`, `lectii\_sim\intrare-cod.js` și simulatoarele altor lecții. Cine scrie, judecă sau repară lecții NU le atinge (R5/R6 în fiecare contract, verificat cu `git show --stat`). Ele se repară separat, printr-o lucrare dedicată, și trec prin poarta de lansare. [surse: C1:201, C2:168, E6:24, C2:51]
- Ce îi lipsește unei lecții de la o componentă se trece în `surse.md`, la secțiunea „Pentru componenta comună” (sau la `"cereri_api"`), iar dirijorul duce cererea la proprietar. Defectele găsite se notează pentru proprietar; lecția vecină nu le repară. [surse: E6:24, D1:128, D2:261]
- Un simulator publicat nu se repară din lecția următoare, ci printr-un agent DEDICAT, cu regresie pe toate lecțiile care îl folosesc. „Componenta o repară agentul ei; lecția nu schimbă propoziția de telefon până nu decide dirijorul.” [surse: B:245, E6:304]
- Cine repară o componentă nu modifică paginile lecțiilor. În răspuns scrie „cale + citat + textul nou”, iar dirijorul aplică. După reparație, tot dirijorul scoate din lecții propozițiile puse ca ocolire a defectului. [surse: D1:150, C2:255]
- Lecția nu ține o logică proprie, paralelă, de identitate. Codul propriu pentru fișă sau identitate se scoate și se înlocuiește cu `rezultat-elev.js`. [surse: E7a:37, E8:24, E6:23]

### Proprietari, extensii și API
- Fiecare simulator are UN proprietar: lecția care l-a scris. În capul fișierului stă lista FIDELITATE (ce e probat / documentat / presupus). Excepții: cele 4 simulatoare scrise în lecțiile nr. 4 (`excelx` la VIII, `SimPPT` la VI, `wordobj` la VII, `fotografie` la V) îl au ca proprietar pe autorul lecției nr. 5 a clasei. Ele au fost copiate în `lectii\_sim\<tip>.js` numai după ce în `_verificare\` a apărut `reparatii.md`, iar lecția nr. 4 și-a păstrat copia. `rezultat-elev.js` aparține lecțiilor nr. 1 (în comun); `intrare-cod.js` aparține autorului V/1 (lucrarea V1). [surse: Std „Simulatoarele din lecțiile nr. 4”, C2:350, C2:246, D1:128]
- Lecțiile următoare extind simulatorul într-un fișier NOU, cu un nume verificat înainte că e liber (`paint-*.js`, `*-inregistrare.js`, `*-editare.js`, `colab-google-*.js`, `editorweb-*.js`, `scratch-control.js`…). Nu modifică fișierul predecesorului și nici lista lui FIDELITATE, numele verificărilor sau forma lui `Q`. Evaluările refolosesc simulatoarele publicate fără să le schimbe; pentru punctaj scriu o extensie (`eval-internet-v.js`, `eval-internet-vi.js`, `simppt-proba.js`, `explorer-proba.js`, `excelx-test.js`). [surse: C2:350, D1:24, C2:51, E5:349]
- Prima lecție dintr-un lanț lasă un API public curat: o funcție de creare cu opțiuni, plus evenimentele și verificările documentate în capul fișierului. În `surse.md` scrie secțiunea „Pentru lecția următoare”: ce poate folosi autorul următor și ce NU are voie să schimbe. Granița cu lecțiile vecine stă în `granite\<clasa>_l<N>.md`. [surse: D1:24, C2:339, B:207]
- API-ul se schimbă doar ADĂUGÂND (o versiune nouă; nu se scoate și nu se redenumește nimic). Versiunea, data și motivul stau în capul fișierului, iar schimbarea se datează și în graniță (de exemplu `PaintCulori.versiune:2`, `scratch-control.js` 1.0 → 1.1). Când lecțiile următoare construiesc peste un simulator, API-ul lui e ÎNGHEȚAT (`colab-google.js` a rămas identic octet cu octet după reparare). Textele care se schimbă merg în graniță, cu marcaj („SCHIMBAT 24.10, 02:00”), iar lecțiile vecine se aliniază. [surse: C2:350, D2:264, B:221]
- Fiecare simulator are un prefix CSS propriu (`cg-*`, `ps-`, `.pi-`, `.ss-`, `xpb-`). Clasele `.foaie`, `.doc` și `.lbl` din `motor.css` se aplică oricărui element care le poartă (pe telefon ieșeau pictograme uriașe). Clasele marcajului de teste refolosite de extensii (`.cg-teste .lbl/.nr/.s/.m`) nu se redenumesc. [surse: D2:262, E7:331, C2:339]
- Fișierele cu terminații CRLF rămân CRLF. [surse: D2:262, B:278]
- La simulatoarele de cont, extensiile păstrează neschimbate: regula „nimic nu se salvează, nimic nu pleacă” (fără `type="password"`, `<form>`, `type="file"`), textele paginii de conectare, pașii de conectare și deconectare și numele testelor. [surse: C2:339, E6:218, E6:228, E7:330]

### Repararea unei componente comune
- O componentă comună stricată strică deodată toate lecțiile care o încarcă ȘI sertarele elevilor (progresul salvat). Motorul are cea mai mare rază („fii neîncrezător”): formatul sertarelor, descris în capul lui `motor.js`, nu se schimbă. [surse: C2:172, D1:144]
- Schimbarea e minimă și doar adaugă: API-ul, formatul sertarelor, textele și desenul la 1280 rămân la fel. Păstrezi copia dinainte (`inainte\`) și sha1 pentru fiecare fișier, cu sha1 înainte/după în raport. Versiunea, data și motivul se scriu în capul fișierului. [surse: D1:136, E8:205, D1:161]
- Repari pe o COPIE DE LUCRU (de exemplu `_proba/excelx-grafic_lucru.js`, `m3_noapte_23_10/scratch_12/scratch.js`), pe care probele o primesc prin `ctx.route` în locul celei reale. Un simulator comun nu se schimbă sub agenții care îl probează: copia ia locul fișierului comun la semnalul dirijorului, când nu mai probează nimeni. [surse: B:263, E8:205, C2:255]
- Agenții lucrează pe fișiere DISJUNCTE (A: motorul; B: `scratch.js`; C: `browser-*`, `editorweb-schelet`, `paint*`). Se lansează întâi componentele mici și Scratch, iar motorul ultimul. Cine modifică `motor.js` verifică la început și înainte de predare că fișierul de pe disc e tot HEAD-ul de la care a pornit (o dată, altă sesiune îl schimbase). [surse: C2:173, D1:146]
- Probele componentei rulează pe COPII ale scripturilor autorilor, ca să nu le rescrie ieșirile, și măsoară înainte/după: `proba_telefon.py`, `tinte.py` (toate țintele ≥ 32 px), mouse la 1280 față de copia anterioară (0 pași diferiți). Raportul (`raport.md`) stă în dosarul componentei. [surse: D2:265]
- Regresia: toate paginile care încarcă componenta, la 390 px (atingere) și 1280 px (mouse), cu `test_joc` TRECUT pe fiecare și parcurgeri până la 3 stele. La motor: `test_joc.py` pe TOATE lecțiile publicate (`lectii\plan.json`) și pe toate jocurile dă același rezultat ca pe HEAD. 8 jocuri de antrenament/recapitulare pică și pe HEAD; verifici că pică LA FEL. `jocuri\_motor\proba_*.py` trebuie să dea aceeași ultimă linie, plus `proba_corectura_mutanti.py`. Sertarele vechi se încarcă identic (`dirijor\poarta_lansare\proba_sertar_vechi.py`); greșelile care există și pe HEAD se numesc, dar nu se numără ca regresii. [surse: C2:172, D1:143, D2:264]
- Reparatorul răspunde cu un JSON (sha1 înainte/după, schimbări, defecte, probe, `regresii: 0`, `nesigur`, `pentru_lectii`) și cu `raport.md`, unde scrie liniile schimbate și cum le-a probat. [surse: D1:161]
- `surse.md` al fiecărei lecții atinse primește un strat datat („Reparat în componentă la 24.10.2026: …”). Când textul unei lecții se schimbă odată cu componenta (VI/19 și `afirmatii.json` A24, la `scratch.js` 1.4), poarta urmează LITERAL propozițiile noi și caută și alte propoziții devenite false; dacă duc elevul pe drum greșit, sunt MAJOR. [surse: C2:317, D1:155]
- O ocolire compatibilă pusă într-o lecție (de exemplu `stilBS` din `eval-internet-v.js`) poate rămâne sau poate fi scoasă la o republicare. [surse: C2:317]

### Poarta de lansare
- Verificatorul e INDEPENDENT: un agent opus care n-a scris nimic din ce verifică și nu repară nimic; face doar probe și scrie raportul în `poarta\`. Verdictul e `LANSEAZA` (0 GRAV, 0 MAJOR; poate fi dat pe fiecare fișier) sau `NU_LANSA`. MINOR-urile și ce e NESIGUR se trec în scris. [surse: D1:145, C2:172, C1:201]
- Condiții: sha1 pe disc e exact cel cerut (altfel NU_LANSA pentru fișierul acela); ce e LIVE e HEAD (`git show HEAD:<cale>`, `git diff -- <cale>`). Raportul autorului îl citești doar ca să știi ce susține; probele lui nu sunt dovadă („scrii ale tale”). La motor, orice schimbare din `motor.js`/`motor.css` nepomenită în raport e MAJOR până se explică (citești tot diff-ul). Motorul se probează pe arborele de pe disc și, pe cel puțin 10 lecții, cu `_sim`-urile servite din HEAD. [surse: D1:145, D1:146]
- Reperele porții: `05_STANDARD_LECTIE.md` (regula 9 fidelitatea, regula 10 gesturi reale mici și dese, punctul 14 focusul după „Verifică”, regula 20 ținte ≥ 32 px, regulile 22-27 siguranța) și uneltele `test_joc.py` (din `jocuri\_motor\`), `verifica_lectie.py`, `verifica_regula.py`, `oracol_nota_site.py`, `curata_metadate.py`, `DP`. [surse: D2:263]
- Probele porții: HEAD și discul servite pe rând prin `ctx.route`; comparație pixel cu pixel la 1280 (de exemplu 164/164; 84/84 de lecții identice); ținte ≥ 32×32 px măsurate cu o sondă pe grilă (`elementFromPoint`, nu doar `getBoundingClientRect`); toate paginile care încarcă fișierul; sertarele vechi fără diferențe de progres; 0 `localStorage` la elevi; regula 27. Răspunsul: JSON `{verdict, sha1_verificat, grav, major, minor, probe, nesigur, pentru_lectii}` și `poarta1.md`, cu dovada fiecărui punct (script + ieșire + citat). [surse: C1:202, C2:172, D1:145, B:274]
- După LANSEAZA: componenta se comite separat, iar lecțiile afectate se republică prin `publica_lectie.py` (sha1-ul blobului = cel de pe sit). Rapoartele de poartă stau în `componente_24_10\{motor,scratch,mici}\poarta\poarta1.md`. [surse: C2:172, C1:207]
- O probă nouă se verifică reintroducând defectul (proba de control). Defectul din `load()`-ul motorului, unde un `//` înghițise `const b=`, l-au găsit 3 autori, nu poarta: `proba_profil_motor.py` a dat 18/18 și a prins defectul reintrodus. Fiecare regulă nouă a unei componente primește un caz în probă și un mutant pe care proba trebuie să-l prindă. [surse: B:39, Std „rezultat-elev”, E7a:55]

### Legături ascunse (de știut înainte să schimbi ceva)
- Două simulatoare încărcate pe aceeași pagină nu au voie să folosească același id de stil sau aceiași selectori. `browser-salvare.js` și `browser-siguranta.js` foloseau amândouă `<style id="bs-css">`, așa că pe V/17 al doilea rămânea fără stil; reparat la 24.10, cu `bs-css-siguranta`. [surse: D1:156, C2:287, E5:347]
- `editorweb-continut.js` și `editorweb-legaturi.js` nu se încarcă împreună, pentru că amândouă rescriu `srcdoc`. Nici două extensii care desenează în `doc-pagina` din `colab-google.js` nu se încarcă împreună. [surse: E8:336, E7:351]
- `posta-gmail-scrie.js` și `posta-gmail-dosare.js` depind și de clase din desenul predecesorului (`.pg`, `.pg-msg`, `.pg-rand[data-m]`, `[data-act]`…). Dacă proprietarul le schimbă, se reface `proba_lectie.py`. [surse: E6:228, E6:245]
- `explorer-organizare.js` e o copie extinsă a lui `explorer-operatii.js`. Ori de câte ori se schimbă sursa, se regenerează cu `_proba\refork_sim.py` (înlocuiri exacte; scriptul se oprește dacă una nu se mai potrivește), apoi rulezi `node _proba\proba_logica.js` și `python _proba\parcurge.py`. [surse: E5:224]
- VIII/4 are o copie proprie a casetei de nume (`lectii\viii\m1-l04\index.html`, ~r. 257). Orice schimbare din `excelx.js` se duce de mână și acolo. [surse: B:93]
- `excelx-test.js` și `simppt-proba.js` se întorc la primul exercițiu prin `JocMotor.test.exercitiu(0)`, cârligul motorului pentru poartă; nu există altă cale publică. Dacă exercițiul nu ajunge pe ecran, panoul spune „Pagina nu te-a putut duce singură la C1…” și nu socotește puncte. [surse: E8:232, E6:177]
- Motorul copiază lista pașilor în fereastra mică și trimite clicurile de acolo pe butonul-pereche din pagină (OGLINDA). De aceea grila de autoevaluare din listă merge și lângă Clipchamp. Altă lecție o refolosește cu `<div data-grila-lab></div>` în textul pasului, nu în `intro`. [surse: E7:310]
- `scratch-control.js` face înfășurarea blocurilor prin API-ul public (`on('schimbat')` → `seteaza`) și nu mai face nimic dacă nucleul a făcut-o deja (verifică dacă gura blocului e goală). `urmarire-algoritm-cattimp.js` prinde `■` în `dupaBloc` fără să i-l ia lui „pentru” (probat în ambele ordini de încărcare). [surse: E6:313, E6:315, E6:334]
- `paint.js`: `aplica()` înghite `['ctrl', <altă literă>]` fără să cheme extensiile, de aceea operațiile extensiilor au nume proprii; `cloneD` păstrează doar `u` și `p`. După `deseneaza` al unei extensii, `paint.js` pune singur `S.modificat=true` și `S.refa=[]` și emite `'desen'`. Pe pânză nu pui ascultători `click`/`mouse*`, pentru că pe telefon nu sosesc; desenul vine din `pointer*`. [surse: E5:386, E5:366]
- Foaia din motor (`tip-excel.js`) înlocuiește `.gw` și panglica la FIECARE desen și măsoară pagina în timpul desenului, așa că derularea laterală se pierde după orice apăsare. Remediul stă în extensie: `#xwrap` cu `min-height`, `scrollLeft` ținut minte și pus la loc. Zona selectată se citește din antetele aprinse (`th.on`). [surse: E8:145]
- Probele comune pentru PIN: `pin_deconectare\probe\matrice_prezenta.py` (`amprenta()`) nu scoate diacriticele, așa că deblocarea dă 404 la nume cu ă/ș/ț; în plus, leagă implicit `clasa=CL` („8 A”) la încărcarea modulului. În `server_local.mjs` e schimbat doar `server`, nu și `api` (Worker-ul `lh-api`, din 11.10), deci probele trebuie să mute explicit `api`. [surse: E5:39, E7a:62]
- Panoul `#lhp` din `prezenta.js` stă fix în colțul stânga-jos și poate acoperi „Verifică” sau simulatorul; padding-ul jos ajută doar la capătul paginii. Caseta se ascunde când ar acoperi un buton (`fereste()`) și reapare la capătul paginii. [surse: C2:231, E7a:36]
- Cât lucrează elevul, `prezenta.js` scrie `lh_prezenta_coada` și `lh_prezenta_jurnal` și trimite `/api/activitate`, ca la orice exercițiu. Înscrierea prin caseta reală REPORNEȘTE pagina fără să trimită evenimentul `prezenta`, așa că extensiile verifică elevul și la „Verifică”. [surse: E6:22, E6:259, E6:257]
- Pragul de lansare de pe server stă într-o înregistrare din depozit (`config/pin-lansare`), nu într-o variabilă de mediu (aceasta e „coaptă în fiecare deploy”). Se setează o singură dată, doar spre mai devreme, cu ora serverului. Dacă pasul se uită, rămâne varianta sigură, implicită: toți trec prin „Mi-am uitat codul” → Deblochează. Un punct de acces vechi răspunde EXACT ca înainte când funcția nouă nu se aplică (`{"ok":true,"cerere":null,"mutat":false}`). Clientul acceptă doar un răspuns cu tipul corect, iar un portal Wi-Fi înseamnă „fără internet”. La reconectare contează doar progresul online de DINAINTE de lansare (după ceasul serverului); ceilalți trec prin profesor („Mi-am uitat codul” → „Deblochează” în panou). GRAV-1 (intrare pe un nume cu orice cod) și GRAV-2 (dovada fabricată de pe telefon) au fost reparate; doi „începători” au găsit singuri butonul roșu „Ieși”. [surse: C2:418, C2:419, C1:210]

### Motorul — faptele pe care se sprijină lecțiile
- Modul lecție e `mod:'lectie'`. Parametri: `?pas=`; `?continua=1`; `?vezi=pN` (pasul doar de citit, deschis din „Cum fac”); `?f=<cheie>` (fișa peste Excel); `?recitire=N` pe jocuri. La recitire apare banda „Recitire — nu se notează și nu deschide nivelul” și nu se scrie nimic; pagina arată „Nivelul N din …”, deci lecția dă și numărul, și titlul nivelului. Încă nu există `?vezi=real`. [surse: C3:251, E8:29, B:35, B:22]
- Ordinea din bara de pași e fixă în `motor.js` (`pasiNivel`: P1…Pn → Atelier → Aplicația → Î1…Îk; `realPage`: „La verificare →”). Întrebările nu pot sta înaintea laboratorului fără o schimbare în motor. [surse: E8:297]
- Motorul din 24.10 (`809d01e1`, LIVE din 25.10): bifele `.bifa-real` stau într-o etichetă `bifa-zona` de 34×34 px la atingere (erau 20×20). „Ia-o de la capăt” al simulatorului nu mai lasă „Corect!” pe ecran (ascultător în faza de captură + MutationObserver). Punctele și stelele nu se mai câștigă a doua oară. Legăturile din antet au crescut de la 23 la 34 px (0 ținte sub 32 pe 112 pagini). Abatere acceptată: bara de sus are +8 px pe telefon. Fixtura `_fixtura-excel` pică la `test_joc`. [surse: B:297, C1:203, C1:205]
- Motorul din 28.09 (publicat cu lecțiile nr. 1): Enter după Tab merge ca în Excel; butoanele au ≥ 32 px; „Ești tot X?” (diploma fără nume, „Trimite” oprit); rețeaua e blocată și în `test_joc.py`. Din 27.09: `varianta()` dă 60/60 de variante rezolvabile, iar lansatoarele panglicii 32/32. [surse: B:53, B:22]
- Scorul unui joc ajunge la profesor prin diplomă (cod QR spre telefon sau „Trimite-o profesorului”, criptat, spre Drive), pentru că PC-urile din laborator sunt comune. [surse: C3:254]
- Doctrina canonică e `jocuri\README.md` (document viu, cu straturi datate la §9): motor comun și `test_joc.py` obligatoriu. După ORICE schimbare de conținut, harta prerechizitelor se reface cu `python _tests\prereq_jocuri.py --scrie`. [surse: C3:255]

### Identitatea elevului: `rezultat-elev.js`, `intrare-cod.js`, `prezenta.js`
- `rezultat-elev.js` v3 (sha1 `eb8fdae3…`). API: `salveaza(cheie, rezultat)` (prima încercare rămâne diagnosticul, restul se ține ca `reincercare`), `citeste(cheie[, {asteptare:true}])`, `asteaptaConfirmare(cheie)`, `golesteAlElevuluiDeAcum(cheie)`, `cine()`, plus evenimentul `rezultat-elev`. Cheia are forma `<clasa>-<modul>-<lectie>-<ce>` (de exemplu `vii-m1-l01-initiala`). Numele se pune doar după ce „Ești X?” a fost confirmat în încărcarea curentă a paginii; confirmarea expiră după 8 minute fără atingeri (pauza are 10). Fără nume, rezultatul stă în filă 50 de minute. Componenta nu șterge nimic: „Sunt X, dar n-am dat-o eu” (două apăsări) doar mută verificarea deoparte. [surse: Std „rezultat-elev”, B:51, E8:25]
- Când `citeste` întoarce `null`, lecția întreabă întâi `asteaptaConfirmare` și scrie „Pe calculator e fișa lui {elev}, de la ora {ora}… apasă sus «Da» ca s-o vezi”, nu „fișa e goală” (care l-ar trimite pe elev să refacă evaluarea). Diploma nu desenează fișa. Probe: `lectii\_sim\_teste\rezultat_elev_proba.py` și `…_mutanti.py` → 0 (matricea 21/21, mutanții 18/18). [surse: E7a:38, Std „rezultat-elev”, B:51]
- O evaluare în desfășurare (de exemplu `explorer-proba.js`) se salvează după fiecare exercițiu notat, sub o a doua cheie, `<cheie>-curs`. „Verifică” nu socotește puncte cât timp pe ecran e o întrebare a componentei (`#lh-rez-q`) sau `cine().stare === 'intreaba'`. O probă de antrenament nu folosește `RezultatElev` (vezi Contradicții, despre V/12). [surse: E5:250, E6:257]
- `intrare-cod.js` e caseta de exersare a intrării (tipul `intrare-cod`), cu API-ul în `lectii\_sim\intrare-cod.GATA.md`, unde stă și sha1-ul. Configurația e `COD_EX`: `start` (lista|nou|eticheta|acasa|uitat|fara-cod), `scris`, `pe`, `tinta`, `deblocat`, `colegi`, `elev.faraCod`; `rezolva()` și `gresit()` le dă componenta. Caseta e izolată: nu cheamă `window.Prezenta`, nu atinge `lh_elevi_pc`, `lh_coduri` sau sertarele `e_…` și nu trimite cereri (R4). Exersează cu nume INVENTATE, aceleași ca în poze. Textele spun „chenarul de exersare”, nu „caseta de jos”. [surse: D1:128, E8:43, E5:40, B:134]
- Proba textelor: `lectii\_sim\_teste\intrare_cod_texte.py` verifică că fiecare text dintre „…” al lecției există în caseta reală (`--mutant` prinde 7/7). Excepțiile (de exemplu titlurile din caiet) au motivul scris în `_proba\intrare_cod_exceptii.json`. Cerințele numesc școala fără ghilimele. [surse: E6:21, E8:43]
- `prezenta.js` (identitate și activitate) se încarcă singur doar prin `motor.js` și `site-credit.js`, iar textele lui se verifică tot cu `intrare_cod_texte.py` (→ 0). Defectul LIVE din 28.09 (rescria la 5 s identitatea peste o înscriere făcută în altă filă) e reparat. [surse: C3:246, B:51]

### API-urile simulatoarelor (rezumat; lista completă e la sursă)
- `explorer-operatii.js` (`SimExplorerOperatii`, tipul `explorerop`): configurația are `fs`, `unitati`, `doc`, `afisat`, `blocat`, `doarCitire`, `cos`, `start`, `extensii`, `checks`, `solutie`, `gresit`; există `window.ExplorerOperatii` și evenimentul `explorer-operatii`. Din 11.10, Copierea ține minte CALEA (după o redenumire, Lipirea dă „Element negăsit”). Comportamentul probat nu se schimbă. [surse: E5:208, E5:209]
- `explorer-organizare.js` (`explororg`; API-ul s-a schimbat la 12.10: `analiza` întoarce `criterii`, `amestec`…) și `explorer-proba.js` (`ExplorerProba.configureaza({cheie, oficiu, parti, itemi})`; nu se schimbă clasele `.exp-*`, cheile `v-m2-l12-proba`/`-curs` și regulile 1-5 din capul fișierului). Caseta de redenumire nu pierde numele la un gest în afara ei: ascultătorii din faza de captură încheie întâi numele, apoi retrimit gestul (Enter „ca la un clic în altă parte” e NEPROBAT în Explorer-ul real). [surse: E5:224, E5:249, E5:251]
- `browser-web.js` (`BrowserWeb.creeaza({site, extensii})`; `BrowserWeb.SITE` e înghețat; evenimentul `browser-web`). Nu se schimbă numele butoanelor și sfaturile (probate în Edge), regula ghilimelelor și bara de adrese (`TLD`; un cuvânt cu punct fără terminație cunoscută e o căutare). `browser-salvare.js` (`SimBrowserSalvare`, versiunea 2): „Salvare ca”, Descărcări, un Notepad mic; numele din meniuri și ferestre nu se schimbă. Salvarea în Edge-ul real n-a fost probată. [surse: E5:293, E5:294, E5:315]
- `eval-internet-v.js` (`EvalInternetV`, versiunea 4) și `eval-internet-vi.js` (`EvalInternet.configureaza`): punctele se dau la PRIMA „Verifică”; nimic în localStorage/sessionStorage/server; proba se golește la „Sunt alt elev” și la schimbarea elevului. [surse: E5:349, E6:257]
- `paint.js` (`PaintSim.creeaza`, tipul `paintw`; extensiile într-un fișier nou `paint-<ceva>.js`, cu cârligele `unelte, verifica, op, actiune, panou`) și `paint-selectie.js` (`PaintSelectie.creeaza`, `S.ps.sel.r`, `PaintSelectie.BLOCURI`, `DESENE_NOI`, cu coordonatele schimbate la 24.10). Nu se schimbă numele din meniuri și ferestre, „Salvare ca” și „Salvați lucrul?”. Pe telefon, Pensule, Forme și Culori se văd după o derulare orizontală. [surse: E5:366, E5:385]
- `posta-gmail.js` (`SimPostaGmail.creeaza`, `CONTURI`, `TESTE`), `posta-gmail-scrie.js` (tipul `mesaj`; `altTip` dă mesajul pentru drumul greșit; Escape închide întâi orice `role="dialog"`) și `posta-gmail-dosare.js` (tipul `dosare`, etichete, agendă). Toate sunt compatibile înapoi. Nu se schimbă numele românești din interfață, „nimic nu se salvează”, pașii de conectare/ieșire și numele testelor. [surse: E6:218, E6:228, E6:245]
- `simppt-proba.js` (`SimPPTProba.configureaza`, `proba(tip)` învelește orice tip PowerPoint). Nu scrie în localStorage, nu schimbă simulatoarele pe care le învelește și nu dă puncte. Mutanți: 6/6. [surse: E6:177]
- `scratch.js` (`SimScratch`; formatul de programe SimScratch 1.1 e descris în `granite\vi_l19.md`), `scratch-control.js` (`SimScratchControl` 1.1: `repeta`, `la_infinit`, `tipuri.scratch`, evenimentul `trecere`) și `scratch-conditie.js` (`SimScratchConditie` 1.0: `repeta_pana`, `atinge`, comparațiile; se încarcă după `scratch-control.js`). Execuția e ca în scratch-vm (`Math.round`, testul ÎNAINTE de fiecare trecere). Id-urile, textele și evenimentele nu se schimbă. [surse: E6:304, E6:313, E6:333]
- `scratch.js` 1.4 a rezolvat cele trei comportamente cerute: „Duplică” cu degetul (copia apare lângă program și se trage), eroarea din consolă la 1280 (0 `pageerror` pe orice ordine de gesturi) și câmpul direcției ca în Scratch-ul real (un clic deschide cercul cu săgeata, dublul clic selectează numărul; probat VIU la VI/21). Versiunile: 1.0 → 1.1 (pregătită pentru 19-21; 30 de afirmații probate în editorul viu, headless) → 1.1.1 → 1.2 → 1.3 (ținte ≥ 32 px) → 1.4. [surse: D1:151, B:291, B:223, D2:264]
- `urmarire-algoritm.js` (VI/17) → `urmarire-algoritm-repetitie.js` (`UrmarireRepetitie` 1.0, „pentru”) → `urmarire-algoritm-cattimp.js` (`UrmarireCatTimp` 1.1, „cât timp”). „Repetă … până când” se va adăuga într-un fișier NOU, cu `UrmarireAlgoritm.instructiune`. Notația acceptată: `Citește`, `←`, `Dacă … atunci`, `Afișează`, `pentru i ← a, b execută … sfârșit pentru`, `cât timp … execută … sfârșit cât timp`, plus `■` ca închidere. Notațiile de la VI/20-21 sunt propuneri care așteaptă decizia profesorului. [surse: E6:314, E6:334, D2:266]
- `audio-linie.js` v1.1 (`AudioLinie.creeaza(el, opt)`, modurile 'audio'/'video', `.simuleaza([...])` pe un ceas virtual, evenimentul `audiolinie`). Extensiile merg în fișiere noi (`audio-linie-inregistrare.js`, `audio-linie-editare.js`). Lista FIDELITATE și numele verificărilor nu se schimbă. [surse: E7:210]
- `colab-google.js` (`SimColabGoogle.creeaza(el, opt)`, cârligele `partajare`, `butoaneDoc`, `inst.slot(…)`, `SimColabGoogle.extensie(nume, fn)`, `TESTE`, tipul `colab`, domeniul `scoala-exemplu.test`); `colab-google-echipa.js` (tipul `echipa`); `colab-google-istoric.js`; `etica-colab.js` (de sine stătător; la 24.10, `Q.variante:[{text, ok, dece}]` a devenit OBLIGATORIU la `docEchipa`; regula adresei: exact `accounts.google.com` până la primul `/`). Textele paginii de conectare, pașii, numele testelor și forma lui `Q` nu se schimbă. [surse: E7:330, E7:351, E7:386]
- `editorweb-verificare.js` (`locuri`, `gaseste`, `are`, `curat`, `contine`; `opt.fisiere:false` ignoră `src`/`href`; tiparele `adresa`/`parola`/`scoala` sunt stricte, fără alarme false de tipul „Calea Lactee”) și `editorweb-proiect.js` (`CERINTE`, `listaSauTabel`, `legaturi`, `tinta`, `sursa`; doar CITEȘTE celelalte extensii). Mesajele spun doar ce e sigur adevărat. [surse: C2:346, E8:336]
- `excelx-test.js` (`ExcelTest.punctat(tip)`, prefixul `xpb-`): salvează o singură dată, când toți cei 6 itemi au puncte (`RezultatElev.salveaza('viii-m2-l13-proba', …)`), și o ia de la capăt la „Sunt alt elev” și la schimbarea elevului. `desktop-windows.js` bifează testele după COMPORTAMENT (jurnalul gesturilor + starea finală) și spune abaterile pe ecran. [surse: E8:231, E5:162]

### Alte piese comune
- „Cum fac…?”: pagina `cum-fac/`, cu `cautare.js` și `date.js` construit din `_sursa\` (`fise_*.json`, glosarul `termeni.json` cu 185 de termeni, `sensuri.json`, 7.125 de formulări de copil). Are 333 de fișe de gest scoase din lecțiile publicate. Căutarea merge după înțeles, fără model AI și fără rețea. O întrebare REALĂ a profesorului devine un rând de regresie (`set_feedback_profesor.json`). Pe setul ascuns: locul 1 la 85,8 %, primele 3 la 94,3 %. [surse: C3:252, C3:253]
- Mașina de verificare: `VL\verifica_lectie.py` are straturile S0 (`test_joc`), S1 (identice), S2 (practică ≥ 50 %), T0 (oracol), T1 (plimbare), iar arbitrul e aplicația reală (`arbitru_office.py`). Poarta de contaminare a bancului dă 1 cu o bucată secretă plantată și 0 în stare curată (prag: 40 de caractere copiate; bancul sigilat la `907bb1d`). Mașina 1 (`dosar_dumb`, `valideaza_pas`, canar) a trecut 57/57 de teste și 9/9 mutanți. [surse: B:13, B:17, B:27]
- Unelte de lucru: `lesson_digest.py` (rezumatul lecției pentru judecător), `verifica_nume_continut.py`, `depth_io.py`, `repara_chei_progres.py`, `gen_school_year_js.py`, `gen_now_data.py`, `sync_module_dates.py`. [surse: C3:256]
- Galeria (`assets/js/galerie.js`, 30.09): imaginile se deschid pe aceeași pagină, iar un clic alături închide previzualizarea. Se încarcă din `motor.js`, din `site-credit.js` (~890 de pagini vechi) și direct în ghidul Clipperz. S-a lucrat într-un git worktree separat (`C:\00\Projects\LearningHub_galerie`), ca să nu se amestece cu alte lucrări pe fișierele comune. [surse: C2:183, C1:209]

### Lista componentelor comune (stare la 25.10.2026)
De unde vin datele: proprietarul și defectele sunt din extrageri; un proprietar marcat * e dedus (lecția care a introdus fișierul și îl încarcă prima). „Încarcă” și „Ultimul commit” sunt citite pe disc la 25.10 (`grep _sim/<fișier>` în `lectii\*\*\index.html`; `git log -1`), iar în copia de lucru nu e nicio schimbare necomisă la componente. Pe disc sunt 76 de fișiere `.js` în `lectii\_sim\` și toate apar în extrageri. Codurile din coloana „Defecte” trimit la lista de după tabele. Listele de proprietari din extrageri: [surse: B:109, B:123, B:207, D2:260]. `editorweb-legaturi.js` arată pagina într-un iframe sandbox, fără scripturi [surse: B:223].

**Motor și site**

| Fișier | Proprietar | Încarcă | Versiune / ultimul commit | Defecte |
|---|---|---|---|---|
| `jocuri\_motor\motor.js`, `motor.css` | fără lecție: agent dedicat + poarta de lansare | toate lecțiile publicate, jocurile, 4 pagini (84 + 28 + 4 la 24.10) | `809d01e1` (24.10, LIVE din 25.10) | M1-M10 |
| `jocuri\_motor\tip-excel.js` | motorul | foaia din motor, folosită de `excelx*` (neverificat pe disc) | — | X4 |
| `assets\js\prezenta.js` | fără lecție (server + PIN) | prin `motor.js` și `site-credit.js`; de mână în paginile de sine stătătoare | `f0963601` (23.10, altă lucrare decât campania) | P1-P7 |
| `assets\js\galerie.js` | lucrarea „galerie” (30.09) | `motor.js`, `site-credit.js`, ghidul Clipperz | `f57069fc` (30.09) | — |
| `lectii\_sim\rezultat-elev.js` | lecțiile nr. 1 (comun) | V/12, VI/1, VII/1, VII/10, VIII/1, VIII/13 | v3, `690d26ed` (28.09) | — |
| `lectii\_sim\intrare-cod.js` | autorul V/1 (lucrarea V1) | V/1, VI/1, VII/1, VIII/1 | `f0963601` (23.10); extragerile pomenesc `c8c6b4ae`, `dda2f252` | P6, U1, U2 |

**Clasa a V-a**

| Fișier | Proprietar | Încarcă | Versiune / ultimul commit | Defecte |
|---|---|---|---|---|
| `fotografie.js` | autorul V/5 (original în V/4) | V/2, 3, 5, 6, 7 | `8e2f975a` (27.09) | V1 |
| `fotografie-tastatura.js` / `fotografie-obiecte.js` | V/2* / V/3* | V/2 / V/3 | 28.09 | — |
| `desktop-windows.js` | V/8 | V/8 | 28.09 | — |
| `explorer-citire.js` | V/9 | V/9 | 28.09 | V2 |
| `explorer-operatii.js` | V/10 | V/10, 12, 15, VI/18 | `da379ee3` (11.10) | V3 |
| `explorer-organizare.js` | V/11 (copie extinsă a `explorer-operatii`) | V/11 | 12.10 | după orice reparație V3: `refork_sim.py` |
| `explorer-proba.js` | V/12 | V/12 | 12.10 | — |
| `bilete-servicii.js` | V/13 | V/13 | 11.10 | — |
| `browser-web.js` | V/14 | V/14-17 | 11.10 | V4 |
| `browser-salvare.js` | V/15 | V/15, V/17 | versiunea 2, 12.10 | V5 |
| `browser-siguranta.js` | V/16 (extensie peste `browser-web`) | V/16, V/17 | versiunea 2, `bd7c35f8` (25.10) | V6 |
| `eval-internet-v.js` | V/17 | V/17 | versiunea 4, 24.10 | — |
| `paint.js` | V/18 | V/18-21 | versiunea 1, `bd7c35f8` (25.10) | V7 |
| `paint-selectie.js` | V/19 | V/19-21 | versiunea 1, `bd7c35f8` (25.10) | V8 |
| `paint-imagine.js` / `paint-culori.js` | V/20 / V/21 | V/20 / V/21 | 24.10 / versiunea 2, 24.10 | — |

**Clasa a VI-a**

| Fișier | Proprietar | Încarcă | Versiune / ultimul commit | Defecte |
|---|---|---|---|---|
| `simppt.js` | autorul VI/5 (original în VI/4) | VI/5-10 | 27.09 | W4 |
| `simppt-interfata.js` | VI/2* | VI/2, 8, 9 | 28.09 (F5 reparat) | — |
| `simppt-fisier.js` / `-formatare` / `-animatii` / `-estetica` / `-proiect` | VI/3* / 6* / 7* / 8* / 9* | VI/3 / 6, 8-10 / 7, 10 / 8 / 9, 10 | 27-28.09 | — |
| `simppt-proba.js` | VI/10 | VI/10 | 11.10 | — |
| `siguranta-pc.js` | VI/11 | VI/11, VI/16 | 11.10 | — |
| `cont-sigur.js` | VI/12 | VI/12, VI/16 | 11.10 | — |
| `posta-gmail.js` → `-scrie` → `-dosare` | VI/13 → VI/14 → VI/15 | VI/13-16 / 14-16 / 15-16 | 12.10 | S3 (`-dosare`) |
| `eval-internet-vi.js` | VI/16 | VI/16 | 24.10 | — |
| `urmarire-algoritm.js` | VI/17 | VI/17, 20, 21 | 19.10 | — |
| `scratch.js` | VI/18 | VI/18-21 | 1.4, `a6593cd0` (24.10, LIVE din 25.10) | S1, S2 |
| `scratch-control.js` / `scratch-conditie.js` | VI/20 / VI/21 | VI/20-21 / VI/21 | 1.1 / 1.0, `95449728` (24.10) | — |
| `urmarire-algoritm-repetitie.js` / `-cattimp.js` | VI/20 / VI/21 | VI/20-21 / VI/21 | 1.0 / 1.1, `95449728` (24.10) | — |

**Clasa a VII-a**

| Fișier | Proprietar | Încarcă | Versiune / ultimul commit | Defecte |
|---|---|---|---|---|
| `wordobj.js` | autorul VII/5 (original în VII/4) | VII/2, 5-10 | 27.09 | W1 |
| `wordobj-interfata.js` / `wordfisier.js` | VII/2 / VII/3* | VII/2 / VII/3 | 28.09 | — |
| `wordobj-formatare.js` | VII/6 | VII/6-10 | 28.09 | W2 |
| `wordobj-pagina.js` / `-tehnoredactare` / `-hartie` | VII/7* / 8* / 9* | VII/7, 9, 10 / 8, 10 / 9, 10 | 28-29.09 | W4 („wordpag”) |
| `wordteh-stiluri.js` | VII/8 | VII/8 | 12.10 | — |
| `wordobj-proba.js` | VII/10 | VII/10 | 11.10 | W3 |
| `audio-linie.js` → `-inregistrare` → `-editare` | VII/11 → 12 → 13* | VII/11-13 / 12-13 / 13 | v1.1, 11-12.10 | — |
| `video-clipchamp.js` / `-text` | VII/14 / VII/15 | VII/14-17 / 15-17 | 19.10 | C2 / C3 |
| `colab-google.js` | VII/18 (API înghețat) | VII/18-20 | `f97bf36e` (24.10) | C1 |
| `colab-google-echipa.js` / `-istoric` | VII/19 / VII/20 | VII/19 / VII/20 | 24.10 | — |
| `etica-colab.js` | VII/21 (de sine stătător) | VII/21 | 24.10 | — |

**Clasa a VIII-a**

| Fișier | Proprietar | Încarcă | Versiune / ultimul commit | Defecte |
|---|---|---|---|---|
| `excelx.js` | autorul VIII/5 (original în VIII/4; VIII/4 își păstrează copia casetei de nume) | VIII/2, 4-13 | `d4cdce12` (30.09) | X1-X3 |
| `excelx-interfata.js` / `registru-foi.js` | VIII/2* / VIII/3* | VIII/2 / VIII/3 | 28.09 / 01.10 | — |
| `excelx-formatare` / `-formule` / `-functii` / `-decizie` | VIII/6* / 7* / 8* / 9* | VIII/6 / 7-9, 12-13 / 8, 12-13 / 9, 12-13 | 28.09-14.10 | — |
| `excelx-sortare` / `-grafic` / `-proiect` / `-test` | VIII/10 / 11 / 12 / 13 | VIII/10, 12-13 / 11-13 / 12 / 13 | 06.10 | X5 (`-grafic`) |
| `editorweb.js` | VIII/14 | VIII/14-21 | `53f6c206` (06.10) | E1 |
| `editorweb-schelet.js` | VIII/15 | VIII/15-21 | `bd7c35f8` (25.10) | E2 |
| `editorweb-continut` / `-tabele` / `-legaturi` / `-stil` / `-verificare` / `-proiect` | VIII/16 / 17 / 18 / 19 / 20 / 21 | VIII/16, 20, 21 / 17 / 18 / 19, 21 / 20, 21 / 21 | 19-24.10 | E3; `-continut` și `-legaturi` nu se încarcă împreună |

### Defecte deschise la componente (pentru proprietari)
**Motor (`motor.js` / `motor.css`)**
- M1. Eticheta „Pașii amestecați · apasă-i în ordine” apare deasupra ORICĂRUI exercițiu `order` și nu se poate configura (propunere: `Q.eticheta`). Fraza de la sortare vorbește despre „un elev”. [surse: E8:190, B:110, C3:247]
- M2. Numele scris pentru diplomă rămâne în browser pentru elevul următor când nu e ales un profil (cheia `lectie_viii_m2_l14`, `{nume, lv}`; probat cu doi elevi). [surse: E8:261, B:110]
- M3. La vânătoare (`hunt`, `.tk`, `huntCod`), cuvintele și jetoanele scurte au 9-27 px, sub pragul de 32 din regula 20. Propunere: `@media (pointer:coarse){.hunt .tk{min-width:32px;min-height:32px}}`. [surse: E8:328, E6:259, E6:275]
- M4. Pasul 0 apare ca „Pasul 1 din 6” (propunere: câmpul `zero:true`). [surse: E6:111]
- M5. `feedback()` nu aduce `#fb` în ecran după „Verifică”: la 390 px, „Nu încă” rămâne sub marginea ecranului. [surse: E5:38]
- M6. Plecarea și schimbarea elevului:
  - lipsește un rând vizibil pe diplomă și pe „LECȚIA 1 · TERMINATĂ” („La plecare: eticheta, apoi „Ieși (deconectare)””); azi ieșirea e doar în „Pașii, încă o dată”, strâns;
  - după „Schimbă elevul” ar trebui păstrat pasul curent (și un semn în panou);
  - „Nu ești tu? Alege-te din listă” ar trebui să stea înaintea „Continuă de unde ai rămas”;
  - nivelul ar trebui terminat pe elev înainte de ieșire;
  - lipsește o notă „apasă Verifică”;
  - eticheta „Încearcă tu · fără puncte, doar exersezi” e inexactă, pentru că „Arată-mi răspunsul” se numără.

  [surse: E5:38, E7a:63, E8:59, E6:24]
- M7. Butoanele motorului după o tragere rapidă (n2, la V/8). [surse: E5:165]
- M8. `test_joc --toate`: 8 jocuri de antrenament/recapitulare pică („Page.click: Timeout”). Cauza e în `assets/`, probabil `prezenta.js` peste joc; nu se știe dacă îi afectează pe elevi. [surse: C3:250, D1:143]
- M9. Lipsește `?vezi=real`. [surse: C3:251]
- M10. Poarta motorului din 24.10 a lăsat 6 MINOR; extragerile o descriu doar pe cea cu +8 px pe telefon. [surse: B:297, C1:203]

**`prezenta.js`**
- P1. Pe telefon, insigna „Sunt elev — mă înscriu” poate acoperi „Pasul următor →” și „Corect!”. [surse: E7:311, E8:274, B:182]
- P2. La 390 px, `#lhp-cine` stă sub `#go` (`elementFromPoint` întoarce `#go`). [surse: E6:259]
- P3. Înscrierea prin caseta reală repornește pagina fără să trimită evenimentul `prezenta`. [surse: E6:259]
- P4. `sincron()` ar trebui să emită `prezenta` și când se schimbă doar „intreaba”. Caseta „Spune cine ești” acoperă nivelurile din cuprins până la primul gest. `proba_tinut.py` e depășită. [surse: B:56]
- P5. Rânduri cerute: „Nu ți-a venit munca de la școală? Poate ai scris alt cod sau altă clasă.”; acasă, un cod greșit intră fără niciun semn („N-am găsit nimic pe codul ăsta. Ai scris codul din caiet?”); o propoziție după „Intră” că pagina se reîncarcă; „Mi-am uitat codul” lipsește din meniul etichetei; un semn pentru eticheta ascunsă. [surse: E8:59, E7a:63, E6:24, C3:248]
- P6. Codul se vede la „Cine ești?” și „Păstrează” (`#lhp-k` nu are `class="cod"`). Trebuie hotărât dacă se ascunde (vezi Contradicții). [surse: C3:248, E5:38, E6:24]
- P7. „Ieși” are 21 px (lista din 11.10). [surse: C1:206]

**Unelte și probe comune**
- U1. Unealta de capturi n-are încă opțiunile `--cod`, `--montaj-fisier <nume>`, `--coleg2` (cu stări „fără cod”) și `--texte`. [surse: E6:24, E7a:62]
- U2. `matrice_prezenta.py` nu scoate diacriticele în `amprenta()` și pune implicit `clasa=CL`; `server_local.mjs` nu mută `api`. [surse: E5:39, E7a:62]
- U3. `panglica_build.py`: butonul New Slide (h=148) iese mai înalt decât grupul Slides (120). [surse: E6:111]

**Excel**
- X1. `excelx.js`: prima atingere pe o filă sau pe un buton al panglicii, imediat după o tragere cu degetul pe foaie, nu dă click (se vede și în VIII/6, publicată). Reparație propusă: la `pointerup` în afara grilei, starea „deget” se închide. Pe telefoane reale n-a fost probat. [surse: E8:189, B:110, C3:247]
- X2. `excelx.js`: meniul de clic dreapta (`itemiCelula`) n-are submeniul Sort al Excel-ului. [surse: E8:190]
- X3. `excelx.js`, MINOR-uri amânate la 30.09: tragerea spre marginea casetei nu derulează singură; tasta răspunde lent pe 26×100; la 1280 px, un clic cu mișcare de 8 px pe fundal nu mai închide. [surse: B:93, B:102]
- X4. `tip-excel.js` (cererile de la VIII/4):
  - tot ce face `excelx` să treacă în motor;
  - `varianta()` nu schimbă `verifica.valori`;
  - lipirea repetată se face în mai multe bucăți (Ctrl+Z o desface bucată cu bucată; în Excel e o singură anulare);
  - lipsește Ctrl+clic;
  - etichetele din dump-ul panglicii diferă de ecran („Delete Cells…” față de „Delete”).

  O parte poate fi deja rezolvată (vezi Contradicții). [surse: E8:113]
- X5. `excelx-grafic.js`: panglica scade cu 66 px la deselectarea graficului (J2-02 la VIII/12). [surse: B:110, C3:247]

**Word și PowerPoint**
- W1. `wordobj.js`: `anuleaza()` pe o tastare neîncheiată; tastarea peste o selecție făcută cu dublu-clic; Ctrl+Y fără anulare. [surse: E7a:90]
- W2. `wordobj-formatare.js`: cursorul după clic (`posAt()` citește desenul vechi; propunere: `commit(); drawDoc();` înainte). Cu ¶ pornit, spațiul tocmai tastat apare fără punct ·. Poate fi deja reparat (vezi Contradicții). [surse: E7:139]
- W3. `wordobj-proba.js` n-are galeria de stiluri. Lipsesc fișa „Cum fac” „Cum pun stilul Titlu 1 (Heading 1)?” (`lectii/vii/m2-l08/?vezi=p5`) și capturile C4 (galeria Styles, RO și EN). [surse: E7:148]
- W4. Din lista de la 11.10: panglica PowerPoint (25 px), wordpag. [surse: C1:206]

**Clasa a V-a**
- V1. `fotografie.js` (și motorul): „Mărește fotografia” are 28 px, „Am nevoie de un indiciu” 31 px, iar fotografia nu se poate folosi de la tastatură. Idee: `_motor\tip-fotografie.js`. [surse: E5:89, E5:101]
- V2. `explorer-citire.js`: clasa `d` e folosită și pentru coloana „Data modificării”, și pentru pictograma de folder, așa că sub 560 px dispar pictogramele folderelor (`.exc-rand .d{display:none}`). Autorul V/10 a găsit defectul în propriul simulator (`exo-ic d`); în `explorer-citire.js` a rămas neatins. [surse: E5:210, C1:206]
- V3. `explorer-operatii.js` (de reparat la sursă):
  - un clic sau o atingere pierde numele sau lasă selecția greșită (J3-1/J4-1);
  - un clic dreapta sau ținut pe alt rând pierde textul (J4-3);
  - un clic ținut peste 120 ms se pierde (J4-4);
  - `re()` mută focusul de pe căutare (J4-5);
  - „Nu” la „Sigur modificați extensia?”;
  - panoul din stânga se desface singur;
  - coloana Tip apare în rezultatele căutării.

  Fără aceste reparații, pagina V/10 publicată pierde numele la un clic cu caseta deschisă. După reparare se reiau `proba_gesturi.py`, `proba_reparatii*.py`, `proba_logica.py` și `test_joc.py`. [surse: E5:252]
- V4. `browser-web.js`: Enter în `.bw-rasp` apasă „Verifică” și consumă prima verificare într-o probă cu punctaj; testul `vizitat` caută doar în istoricul filelor; `lectie`/`LECTIE` sunt legate de fila V/14. [surse: E5:348, E5:333, D2:261]
- V5. `browser-salvare.js`: „Închidere” are 28 px, butoanele de folder 30 px (`.bs-mb`: 28 px). [surse: D2:261, B:182]
- V6. `browser-siguranta.js`, `potrivesteData`: luna e căutată după primele 3 litere, așa că „2 nov 2025” e respins. Propunere: o listă de prefixe pentru fiecare lună. [surse: E5:348, D2:261]
- V7. `paint.js`:
  - Ctrl+Z imediat după Deschidere scoate trasee (de reparat în `anuleaza()`);
  - un clic în afara Paint-ului nu închide meniul;
  - `dlgSalvare` pornește în `S.ultimFolder || 'Imagini'`, nu în folderul fișierului deschis.

  [surse: E5:403, E5:422]
- V8. `paint-selectie.js`: `randeaza` desenează un punct pentru un traseu necunoscut; cât tragi, previzualizarea e mereu neagră; traseele acoperite de un bloc se redesenează (devine lent după multe transformări). [surse: E5:422, E5:403]

**Clasa a VI-a**
- S1. `scratch.js` 1.4 are 4 MINOR:
  - m1: saltul de 65 px când apuci copia cu zona derulată la capăt;
  - m2: a doua atingere pe direcție, 30 px;
  - m3: cercul acoperă câmpul de dedesubt;
  - m4: moștenit din 1.3.

  [surse: B:291]
- S2. `scratch.js`: înfășurarea lipsește în nucleu (`lasa()`, ramura `t.tip === 'dupa'`; propunere de reparație în 2 rânduri), deocamdată o face `scratch-control.js`. Săgeata ↻ de pe brațul lui „repetă” nu e desenată. [surse: E6:315]
- S3. `posta-gmail-dosare.js`: `evalueaza` nu folosește `SimPostaGmailScrie.altTip` la `continut`/`trimis` (propunere: `m = altTip(x,t.pe,inst.mesaje(),toatePe) || t.T.m(c,t.v,Q)`). Dacă Gmail-ul real arată 🏷 Etichete în Spam după bifă e NESIGUR. [surse: E6:258, D2:261]

**Clasa a VII-a**
- C1. `colab-google.js`:
  - notele „…afli în lecția 19” (fișierele primite, ecranul Prezentări, „Distribuite cu mine”) trebuie schimbate acum, după publicare;
  - sloturile `doc-pagina` se re-atașează la fiecare redesenare și elevul pierde focusul;
  - `.cg-unelte` și `.cg-drpt` nu se rup pe rânduri pe ecran îngust (`flex-wrap` sub 560 px).

  [surse: E7:352, D2:261]
- C2. `video-clipchamp.js`: `numeEste` acceptă diacritice (propunere: `faraDiacritice:true`); pe telefon, la prima treaptă de mărire, mânerul unui titlu de 5 s nu se lasă tras. [surse: E7:295]
- C3. `video-clipchamp-text.js`: testele de text se bifează abia la `onblur` (propunere: reevaluare la `input`). [surse: E7:311]
- C4. Jocul `jocuri/audio-video-vii`, nivelul 4, spune „Șterge: bucata dispare”, dar în Audacity 4, cu „Lasă spațiu”, rămâne un gol. [surse: E7:248]

**Clasa a VIII-a**
- E1. `editorweb.js`:
  - `previewDoc` pune `body{background:#fff}` și mereu `<!doctype html>` (fără DOCTYPE, browserul real ia `font-size: 20` ca 20px);
  - `STIUTE` nu cuprinde `<font>`/`<center>`;
  - `tipExplorer` scrie fix „Microsoft Edge HTML Document”, iar pe calculatorul de lucru apare „Chrome HTML Document”;
  - Deschidere pornește pe „Documente text (*.txt)”;
  - Notepad-ul simulat arată ~5 rânduri pe telefon;
  - caseta „Încadrare linie” are 13×13.

  [surse: E8:315, E8:285, E8:328, E8:274]
- E2. `editorweb-schelet.js`: `mesajText` (pentru `=ü` spune „…apoi utf-8”) trebuie generalizat pentru alte atribute. NESIGUR: 4 ateliere VIII n-au test de schelet. [surse: E8:285, B:294]
- E3. `EditorWebUtil.ACT` are 2 acțiuni în plus; de verificat dacă e fișier comun. [surse: B:222]

## Contradicții
1. **Numerotarea regulilor 22-23.** Prompturile judecătorilor din M3 (`_judecata2.md`) spun „22 = reguli din `_comun.md`; 23 = dosarul elevului, nu Desktopul comun”. Standardul are 22 = nimic spre servicii externe și 23 = calculatorul comun. Și `07_BRIEF_AUTOR.md` pune probele cu browser sub „reg. 24-26”. Standardul e cel oficial; prompturile trebuie aliniate. [surse: D2:198, C2:53, Std r.22-23]
2. **Aplicațiile din Magazin.** Std r.25 (28.09) le permite (Paint, Notepad) cu o copie a `Helium\User.dat`; doar Calculatorul e interzis. Prompturile din 10.10-23.10 interzic orice aplicație UWP, pentru că se deschide pe ecranul vizibil. Fișa urmează varianta nouă, mai strictă, dar standardul are încă textul vechi. [surse: Std r.25, D1:11, D2:199]
3. **Rețeaua în probe.** Std r.24 și V1 (16.10) lasă să treacă doar 127.0.0.1 și interzic `learninghub-8z6.pages.dev` cu `prezenta.js` activ. O notă din KB (fără dată) descrie altă rețetă: `route` cu răspuns fals pentru tot ce nu e `learninghub-8z6.pages.dev` sau local, adică pagini încărcate de pe situl viu. Fișa urmează regula 24. [surse: D1:124, Std r.24, C3:168]
4. **Codul de intrare se vede.** La 16.10, dirijorul a stabilit că cifrele SE VĂD în „Cine ești?” / „Păstrează” și că lecțiile spun asta cinstit. Memoria (C3) trece faptul ca defect al `intrare-cod.js`, iar notele V/1 și VI/1 cer „hotărât la poarta de lansare dacă se ascunde” (clasa `cod` pe `#lhp-k`). Faptul de azi e că se văd; decizia „ascundem sau nu” e deschisă. [surse: E7a:48, C3:248, E5:38, E6:24]
5. **Publicarea după 06:00.** Regula din 30.09 („nicio publicare după 06:00; elevii intră de la ~07:45”) nu se potrivește cu publicările de sâmbătă, 24.10, între 06:21 și 16:15. Sursele nu spun dacă regula ține și în zilele fără școală. [surse: C1:189, B:254, B:281]
6. **`wordobj-formatare.js`, cursorul.** Notele VII/8 (28.09) spun „nereparat în fișierul proprietarului”, iar jurnalul din aceeași zi raportează „cursorul după tastare; 8 → 0 abateri” ca reparat. Nu se știe dacă e același defect; trebuie verificat în cod. [surse: E7:139, B:67]
7. **`tip-excel.js` / `excelx`.** Cererile VIII/4 (`varianta()`, promisiunea clipboard-ului în consolă, `focus` fără `preventScroll`, saltul de ~18 px) apar ca deschise. Jurnalul raportează `varianta()` 60/60 și `.catch` pe clipboard (27.09), apoi `focus({preventScroll:true})` și salt 0 px (30.09). Probabil sunt rezolvate; de verificat în cod. [surse: E8:113, B:22, B:92]
8. **V/12 și `RezultatElev`.** VI/16 numește „eroarea lui V/12” promisiunea că punctele „rămân” și nu folosește `RezultatElev` la o probă de antrenament. Notele V/12 descriu proba V/12 salvată prin `RezultatElev`, cu cheia `-curs`. Nu reiese dacă V/12 a fost corectată sau dacă proba V/12 e una notată, unde păstrarea e corectă. [surse: E6:257, E5:249, E5:250]

## Depășite

- Std r.25 (28.09): aplicațiile din Magazin (Paint, Notepad nou) se puteau porni cu o copie a `Helium\User.dat` (doar Calculatorul era interzis) → înlocuit 10-23.10: nu se pornesc deloc în probe; la fel rețetele de probă cu Notepad din V.1 și VII.1 (marcate „Depășit”). [surse: Std r.25, D1:11, D2:199]
- Ieșirea `ACT` „o singură rulare, căutare după numele de probă, ieșirea ștearsă după căutare” (28.09-01.10) → din 24.10 ieșirea nu se salvează deloc; se numără doar cu `grep -c` (E6:19, E7a:34 → D2:210).
- `grep 'nu e in catalog'` fără „î” (D1:14, C2:266, C3:164, E7:327, E7:369; la fel și directiva KB#m853 din `C:\00\AI_0\CLAUDE.md`) → dă mereu 0; unealta scrie „(nu e în catalog)” (verificat în `activitate.py:332`). Rezultatele „0 înainte și după” obținute așa nu dovedesc nimic (B:241, D2:210).
- Lista de verificare VIII/20 cu 5 întrebări → 6 întrebări (D2:205).
- „Profesorul = Cititor” la documentul echipei → Comentator; rolul nu se schimbă dacă are deja acces (D2:203).
- `scratch.js` 1.2 (B:275) și 1.3 (B:276, ținte ≥ 32 px) → 1.4, LIVE din 25.10 (B:291, B:300).
- `excelx.js`: saltul paginii la tragere (`ajusteaza()`, nota `.pg-ingust`; B:70, E8:172) → reparat la 30.09, salt de 0 px peste tot (B:92).
- `bs-css` comun pentru `browser-salvare.js` și `browser-siguranta.js` (E5:347, D1:156) → reparat la 24.10 (`bs-css-siguranta`), LIVE din 25.10. Regula `#body .bs-mb{min-height:32px}`, pusă pe simptom, a fost scoasă.
- `editorweb-schelet.js` primea conținut după `</body>`/`</html>` (D1:157, D2:261, E8:285) → reparat la 24.10, cu mesaj nou (B:294).
- Meniul Forme din Paint ieșea la 390 px, iar Fișier/Editare la 360 px (E5:422, punctul 4) → reparat la 24.10 (B:294).
- Motorul: bifele de 20×20, „Corect!” rămas după „Ia-o de la capăt”, antetul / firul de navigare de 23 px (B:110, C3:247, E8:173, E8:261, E8:274, E8:297, E8:315, C1:206) → reparate în `809d01e1`, LIVE din 25.10 (B:297).
- Motorul: comentariul `//` din `load()` care dădea pagină albă (E6:46, B:39) → reparat la 28.09.
- `prezenta.js` rescria la 5 s identitatea din altă filă (B:51) → reparat la 28.09.
- V/12: legăturile `?vezi=p6/p7` spre lecția 1 (B:182, D2:261) → `vezi=p8` LIVE la 25.10 (B:300).
- Cererea (3) a VIII/1 către `intrare-cod.js` → făcută (`dda2f252`, E8:59); starea `elev.faraCod` cerută de V/1 (E5:38, punctul 6) apare acum în `intrare-cod.GATA.md` (E8:43).
- Foaia Excel mare: „+ coloană” la 390 px fără drum înapoi (C1:208) → reparat și republicat (30.09-01.10).
- Galeria: F1-F3 (C1:209) → reparate, LIVE din 30.09.
- `simppt-interfata.js` (F5 reîncărca pagina) → reparat la 28.09 (B:67).
- PIN „cum era” (intrare din listă fără cod; C2:177) → istoric; PIN-ul e LIVE din 30.09 (C2:178).
- Contractul I3 („codul ascuns peste tot”) → corectat de dirijor la 16.10 (E7a:48).
- „Nu există simulator pentru browser/e-mail, scriere de fișiere, audio-video” (C2:246, 10.10) → depășit: azi există `browser-*`, `posta-gmail*`, `explorer-operatii`, `audio-linie*`, `video-clipchamp*`.

## Numărătoare
| Categorie | Puncte citite | din care dubluri E7 = E6 | Reguli unificate scrise |
|---|---|---|---|
| SIGURANTA_DATE | 167 | 6 (E7:17-21, E7:67) | 106 |
| PUBLICARE | 81 | 1 (E7:48) | 56 |
| COMPONENTE | 173 | 5 (E7:22-25, E7:47) | 71 de reguli + 47 de defecte deschise (M1-E3) + 51 de rânduri de inventar (toate cele 76 de fișiere din `lectii\_sim\` + motorul, `tip-excel.js`, `prezenta.js`, `galerie.js`) |
| **Total** | **421** | **12** | **233 de reguli + 47 de defecte** |

Pe lângă ele: 8 contradicții și 20 de rânduri „Depășite”. Etichete greșite pentru aceste trei categorii: niciuna (grep pe toate cele 11 fișiere). Verificare mecanică la final: toate cele 409 puncte care nu sunt dubluri sunt citate cel puțin o dată, iar fiecare trimitere `[surse: X:n]` duce la un punct real din aceste trei categorii.
