# Paritate: File Explorer și Windows (vechi pe proba → biblioteca nouă)

Data: 21.11.2026. Detaliile, cu dovezile pe linii, sunt în `explorer-windows.json`.

## Pe scurt
- **95 funcții** pe care elevul le poate folosi în simulatoarele vechi: **34 DA**, **25 PARȚIAL**, **36 NU** în biblioteca nouă.
  - File Explorer: 61 (DA 24, PARȚIAL 20, NU 17).
  - Windows (desktop, Start, ferestre, browser, Securitate): 34 (DA 10, PARȚIAL 5, NU 19).
- **49 sunt cerute de exerciții** (verificate de un test din pagină): DA 20, PARȚIAL 13, NU 16.
- 20 grupuri de butoane doar afișate (dau doar un mesaj), trecute separat în JSON.
- Sursele vechi: explorer-citire, explorer-operatii, explorer-organizare, explorer-proba, desktop-windows, siguranta-pc (lectii/_sim/) și jocul jocuri/fisiere-v (simulator scris în pagină: tipurile `ecran` și `explorer`). Aceeași funcție găsită în mai multe simulatoare e trecută o singură dată, cu toate dovezile.

## Ce lipsește peste tot (nu e o singură funcție)
- **Starea pe care o verifică exercițiile e prea săracă.** Starea Explorer-ului din bibliotecă arată doar folderul de lucru (fără subfoldere, fără id, dată sau dimensiune pe fișier). Testele vechi pe căi adânci, „copiat” față de „mutat”, „același fișier” sau Coșul cu fișierele colegilor nu se pot scrie peste ea. Și unde funcția e DA, exercițiul vechi nu se poate muta pe bibliotecă fără o stare mai bogată.
- **Testele pe istoric** („ai maximizat”, „ai deschis Start”, „ai citit calea”, „ai căutat”, „ai scanat ÎNAINTE să deschizi”) nu au pereche în stare. Biblioteca trimite evenimente, dar tipul comun de exercițiu verifică doar starea.
- **Bifele pe loc** („Testele sarcinii · x din y trec”) și **„Arată-mi răspunsul”** din simulatoarele vechi lipsesc. Tipul comun de exercițiu are doar butonul Verifică.
- **Acest PC, unitățile și stickul (E:)** nu există: cine apasă pe ele primește „aici nu e simulată”. De aici vin mai multe PARȚIAL (panoul din stânga, Sus, bara de adresă) și NU (stickul, ștergerea definitivă de pe stick, scanarea stickului).
- **Browserul și Securitate Windows nu există** în bibliotecă: lecția VI · M2 · 11 (pagina falsă, scanarea) nu are pe ce rula.
- **Defect găsit la probă:** un folder decupat și lipit chiar în subfolderul lui dispare, fără niciun mesaj (`aplicatii/explorer.js:512-542`, `lipeste` nu verifică destinația). Vechiul spunea „Folderul destinație este un subfolder al folderului sursă.”

## NU: cerute de exerciții (16)
- `F002` (explorer) Pornește din „Acest PC”, vede unitățile (discul C:, stickul E:) cu spațiul liber și deschide o unitate. _[lectii/v/m2-l09, lectii/v/m2-l10, lectii/v/m2-l11, lectii/vi/m2-l11]_
- `F010` (explorer) Citește calea adevărată a unui folder cu nume afișat în română: „Documente” se vede așa, dar în cale e „Documents”; „Utilizatori” = „Users”… _[lectii/v/m2-l09]_
- `F020` (explorer) Scrie calea unui fișier / folder într-o casetă de răspuns și primește mesajul exact despre ce lipsește (extensia, Documents, litera unități… _[lectii/v/m2-l09]_
- `F021` (explorer) Lucrează în mai multe locuri deodată: Desktop, Documente, discul C: și stickul E: (copiază / mută între ele). _[jocuri/fisiere-v]_
- `F038` (windows) În Setări merge la Sistem › Despre și citește ediția Windows (Windows 11 Pro). _[jocuri/fisiere-v]_
- `F039` (windows) Scrie într-o casetă ce a găsit pe ecran (ediția Windows) și testul se bifează. _[jocuri/fisiere-v]_
- `F046` (explorer) Lucrează pe stick (E:): acolo Delete nu duce în Coș, ci întreabă „Sigur ștergeți definitiv acest fișier?”. _[lectii/v/m2-l10]_
- `F074` (windows) Pornește aplicația cu dublu-clic pe pictograma ei de pe desktop (Calculator, Paint, Coș de reciclare). _[lectii/v/m2-l08]_
- `F081` (windows) Mărește sau micșorează fereastra trăgând de o margine sau de un colț. _[lectii/v/m2-l08]_
- `F088` (windows) Închide fila cu pagina falsă cu ✕ de pe filă (ultima filă închisă închide și browserul). _[lectii/vi/m2-l11, lectii/vi/m3-l16]_
- `F089` (windows) Închide tot browserul, cu toate filele, cu ✕ din colțul ferestrei. _[lectii/vi/m2-l11, lectii/vi/m3-l16]_
- `F090` (windows) Apasă un buton din pagina falsă (OK, Curăță acum, DESCARCĂ GRATIS, ✕ desenat în pagină): simulatorul o ține minte ca greșeală și spune pe l… _[lectii/vi/m2-l11, lectii/vi/m3-l16]_
- `F091` (windows) Citește rezultatul scanării în fereastra Securitate Windows („Amenințări curente”, „0 amenințări găsite.”, „N fișiere scanate.”, ora ultime… _[lectii/vi/m2-l11]_
- `F093` (explorer) Scanează stickul sau un fișier: „Scanați cu Microsoft Defender...” pornește scanarea; simulatorul ține minte ce s-a scanat și când (înainte… _[lectii/vi/m2-l11]_
- `F094` (explorer) Deschide un fișier (temă, fișă): se spune în ce aplicație s-a deschis, iar simulatorul ține minte ce s-a deschis și dacă era verificat înai… _[lectii/vi/m2-l11]_
- `F095` (explorer) Pornește un program (Tip: Aplicație) de pe stick sau din Descărcări; simulatorul îl ține minte și spune pe loc că e o greșeală. _[lectii/vi/m2-l11]_

## PARȚIAL: cerute de exerciții (13)
- `F003` (explorer) Merge într-un loc cu un clic în panoul din stânga (arborele de foldere). — **lipsește:** Arborele bibliotecii are doar folderul-părinte și subfolderele lui directe; „Acest PC” și unitățile dau „aici nu e simulată” (explorer.js:788); lipsesc Desktop, celelalt… _[lectii/v/m2-l09, jocuri/fisiere-v, lectii/v/m2-l10, lectii/v/m2-l11, lectii/v/m2-l12, lectii/v/m2-l15, lectii/vi/m3-l18, lectii/vi/m2-l11]_
- `F009` (explorer) Vede calea locului în care e: bara de adresă se schimbă în caseta cu calea scrisă cu \, toată selectată; revine cu Esc. — **lipsește:** Alt+D nu deschide caseta (probă ex_alt_d_caseta=false: aplicatii.js › gestTasta nu întoarce gest pentru Alt+literă); calea e cea internă („Documente\Clasa a V-a”, probă)… _[lectii/v/m2-l09]_
- `F015` (explorer) Află ce fel de fișier e din coloana Tip („Fișier PNG”, „Fișier MP3”, „Microsoft Word Document”, „Folder de fișiere”), chiar dacă extensia e… — **lipsește:** La PNG biblioteca scrie „FastStone PNG File” (tipul de pe PC-ul de referință, probă stick_tic_randuri), nu „Fișier PNG” cum spune lecția; tipurile nu se pot da din conți… _[lectii/v/m2-l09, jocuri/fisiere-v, lectii/vi/m2-l11]_
- `F027` (explorer) Lipește aici ce a copiat / decupat (copie sau mutare). — **lipsește:** meniul locului gol n-are „Lipire” (date/explorer.json › meniuri.meniu_fundal: Vizualizare, Sortați după, Grupare după, Anulare, Nou, Proprietăți…; dinMeniu 687-691) _[jocuri/fisiere-v, lectii/v/m2-l10, lectii/v/m2-l11, lectii/v/m2-l12, lectii/v/m2-l15, lectii/vi/m3-l18]_
- `F030` (explorer) Șterge definitiv, fără Coș (Shift+Delete; tot ce ștergi de pe stick dispare definitiv). — **lipsește:** Un folder sau mai multe elemente dau „aici nu e simulată” (explorer.js:579); nu există stickul, deci nici regula „de pe stick se șterge definitiv”. | folder sau mai mult… _[jocuri/fisiere-v, lectii/v/m2-l10, lectii/v/m2-l11, lectii/v/m2-l12, lectii/v/m2-l15, lectii/vi/m3-l18]_
- `F031` (explorer) Deschide Coșul de reciclare și vede ce e în el, cu locul de unde a fost șters fiecare element. — **lipsește:** Coșul nu e în panoul de navigare; lista lui n-are coloana „Locație inițială”; montat în Windows (incadrat) Explorer-ul n-are desktop, iar dublu clic pe Coșul de pe deskt… _[jocuri/fisiere-v, lectii/v/m2-l10, lectii/v/m2-l12]_
- `F032` (explorer) Pune înapoi la locul lui un element din Coș. — **lipsește:** bara de comenzi din Coș e cea obișnuită (proba T6): lipsește „Restaurare elemente selectate”; folderele-părinte lipsă nu se refac (588 pune doar cheile elementului); lis… _[jocuri/fisiere-v, lectii/v/m2-l10, lectii/v/m2-l12]_
- `F033` (explorer) Caută un fișier după nume în folderul curent și în toate subfolderele lui, vede unde e fiecare rezultat și, cu un clic, ajunge la el. — **lipsește:** Nu caută în subfoldere (probă: „plan” → listă goală, deși Proiect/plan.txt există), nu arată folderul rezultatului și nu duce la el; starea nu are textul / rezultatele c… _[jocuri/fisiere-v, lectii/v/m2-l10, lectii/v/m2-l12]_
- `F034` (explorer) Deschide meniul de clic dreapta: pe un element (Deschide, Decupare, Copiere, Redenumire, Ștergere) sau pe loc gol (Nou › Folder, Lipire). — **lipsește:** Shift + F10 cu un element selectat nu deschide nimic (proba T2: 0 meniuri); ținutul apăsat pe telefon depinde de contextmenu-ul nativ al browserului (neprobat) | Meniul… _[jocuri/fisiere-v, lectii/v/m2-l10, lectii/v/m2-l11, lectii/v/m2-l12, lectii/v/m2-l15, lectii/vi/m3-l18, lectii/vi/m2-l11]_
- `F037` (windows) Pornește o aplicație din meniul Start (Paint, Notepad, Setări); dacă era minimizată, o readuce. — **lipsește:** Dalele fixate din Start (Setări, Notepad…) dau „aici nu e simulată” (probă win_setari_mesaj); doar Paint și Calculator pornesc, și doar prin căutare („pai” + Enter, prob… _[jocuri/fisiere-v, lectii/v/m2-l08]_
- `F042` (windows) Readuce o fereastră maximizată la mărimea ei de dinainte. — **lipsește:** Butonul nu devine „Restabilire jos” (nume, sfat, pictograma cu două pătrate); evenimentul are actiune 'maximizare' și la readucere (:904). _[jocuri/fisiere-v, lectii/v/m2-l08]_
- `F067` (explorer) Lucrează direct în rezultatele căutării: alege un fișier găsit într-un subfolder și îl decupează / copiază, apoi îl lipește altundeva. — **lipsește:** fișierele din subfoldere nu apar în rezultate, deci nu pot fi alese de acolo _[lectii/v/m2-l12]_
- `F080` (windows) Mută fereastra trăgând de bara ei de titlu. — **lipsește:** Mutarea de la tastatură (săgețile pe bara de titlu, în vechi; abatere declarată de vechi: în Windows se face cu Alt+Spațiu, Mutare). _[lectii/v/m2-l08]_

## NU: necerute de exerciții (20)
- `F004` (explorer) Extinde sau restrânge un folder în panoul din stânga, fără să intre în el.
- `F052` (explorer) Află că semnele \ / : * ? " < > | nu intră într-un nume: la tastare semnul nu apare și iese balonul „Numele unui fișier nu poate să conțină…
- `F060` (explorer) Încearcă să lipească un folder chiar în el sau într-un subfolder al lui și primește „Folderul destinație este un subfolder al folderului su…
- `F061` (explorer) Lipește după ce a redenumit / mutat / șters sursa copiată și primește „Element negăsit — Imposibil de găsit acest element”, cu Încercați di…
- `F062` (explorer) Restaurează un element când în locul lui există deja același nume și răspunde în „Înlocuire sau omitere fișiere” („Se mută un element la Re…
- `F063` (explorer) Restaurează tot Coșul („Restaurare totală elemente”, „Sigur restaurați toate elementele…?”).
- `F064` (explorer) Golește Coșul de reciclare („Golire Coș de reciclare”, „Sigur ștergeți definitiv aceste N elemente?”).
- `F065` (explorer) Șterge definitiv un element din Coș (Delete sau Ștergere din meniul lui) după „Sigur ștergeți definitiv acest fișier?”.
- `F068` (explorer) În folderele lui Windows (Media) doar citește și copiază: Decupare, Ștergere, Redenumire, Folder nou și Lipire acolo sunt refuzate, cu mesa…
- `F070` (windows) Oprește calculatorul: Start › Alimentare › Închidere (ecran negru), apoi îl pornește din nou.
- `F071` (windows) Pune calculatorul în repaus (Start › Alimentare › Repaus) și îl trezește.
- `F072` (windows) Repornește calculatorul (Start › Alimentare › Repornire): toate ferestrele se închid.
- `F076` (windows) Dublu-clic pe bara de titlu: maximizează fereastra; încă un dublu-clic o readuce la mărimea de dinainte.
- `F077` (windows) Trage o fereastră maximizată (sau lipită pe o jumătate) de bara de titlu: revine la mărimea de dinainte, sub deget.
- `F078` (windows) Trage fereastra până la marginea din stânga sau din dreapta: se lipește pe jumătate de ecran.
- `F079` (windows) Trage fereastra de bara de titlu până la marginea de sus: se maximizează.
- `F082` (windows) Când o aplicație are mai multe ferestre, clicul pe butonul ei din bară arată lista lor; alegi una.
- `F085` (windows) Clic pe ceas deschide calendarul lunii, cu ziua de azi marcată.
- `F086` (windows) Socotește în fereastra Calculator: cifre, + − × ÷, = și C, cu rezultatul pe ecran.
- `F087` (windows) Trece de la o filă a browserului la alta (se schimbă pagina și adresa).

## PARȚIAL: necerute de exerciții (12)
- `F007` (explorer) Urcă în folderul care îl conține pe cel curent. — **lipsește:** Din rădăcina unei unități vechiul urcă la „Acest PC” (explorer-citire.js:155 par → „PC”); în bibliotecă, din folderul-părinte, Sus dă „aici nu e simulată” (probă: „Până…
- `F008` (explorer) Sare la un folder de deasupra cu un clic pe numele lui din bara de adresă. — **lipsește:** Prima firimitură („Acest PC”) dă „aici nu e simulată” (explorer.js:799); numele din bară sunt numele interne („E:”, nu „Stick USB (E:)”; probă stick_firimituri), iar „Do…
- `F016` (explorer) Citește data modificării fiecărui fișier (coloana „Data modificării”). — **lipsește:** Conținutul nu poate da data pe fișier (explorer.js:184 pune doar `continut`): toate rândurile arată aceeași dată, „16.11.2026 21:54” (date/explorer.json:898; probă ex_co…
- `F017` (explorer) Citește dimensiunea fiecărui fișier în KB (coloana „Dimensiune”). — **lipsește:** Toate fișierele arată „1 KB” (date/explorer.json:899; probă ex_coloane); dimensiunea nu se poate da pe fișier.
- `F019` (explorer) Vede câte elemente sunt în folder în bara de jos. — **lipsește:** nu scrie „1 element selectat” / „N elemente selectate” (proba T7: cu 2 alese rămâne „3 elemente”); la 1 scrie „1 elemente”; nu spune ce e ținut minte pentru Lipire
- `F024` (explorer) Primește un mesaj când numele nou nu e bun: gol, cu semne interzise (\ / : * ? " < > |), deja folosit în folder, sau cu extensia schimbată… — **lipsește:** Semnele interzise dau doar „aici nu e simulată” (nu mesajul cu lista semnelor); un FOLDER cu nume existent dă „aici nu e simulată” (explorer.js:557); avertizarea de exte…
- `F050` (explorer) Pe telefon (ecran atins sau îngust) bifează căsuța din stânga rândului ca să adauge / scoată elementul din selecție (ca Ctrl + clic). — **lipsește:** clicul pe căsuță se poartă ca un clic simplu: alege doar acel rând (proba T4: selecția [b, c] a devenit [c]); căsuțele nu apar singure pe telefon; lipsește rândul de lăm…
- `F054` (explorer) Redenumește cu un nume care există deja și răspunde la „Această locație conține deja un fișier cu același nume. Redenumiți „a” ca „b (2)”?”. — **lipsește:** la FOLDER dă mesajul central (557); fereastra n-are rândul „Această locație conține deja un fișier cu același nume.”
- `F058` (explorer) Lipește mai multe fișiere dintre care unele se ciocnesc și răspunde într-o singură fereastră: „Destinația are N fișiere cu același nume” ›… — **lipsește:** nu există fereastra grupată („Se copiază N elemente…”, „Destinația are N fișiere cu același nume”, „Înlocuire fișiere de la destinație”, „Se omit aceste fișiere”): elevu…
- `F059` (explorer) Lipește un folder unde există deja unul cu același nume: conținutul intră în el, iar fișierele cu același nume rămân cele din destinație (c… — **lipsește:** fișierele cu același nume din folderul-destinație sunt SUPRASCRISE fără nicio întrebare și fără mesaj (vechiul le păstra și spunea ce a omis)
- `F075` (windows) Clic pe desktopul gol: pictograma aleasă se deselectează și nicio fereastră nu mai e „cea în care lucrezi”. — **lipsește:** Fereastra activă rămâne activă după clicul pe desktop (probat: probe_explorer-windows/C_proba_windows.json › clic_desktop_gol: paint activa=true); în vechi niciuna nu ma…
- `F083` (windows) Redeschide din bara de activități o fereastră închisă (în laborator: Browser, File Explorer). — **lipsește:** Browserul nu există în bibliotecă, deci nu se poate redeschide.

## Ce n-am apucat / ce e nesigur
- Tot codul vechi din listă a fost citit (nimic neacoperit). Ce codul nu lămurea s-a jucat headless în poligon (scripturile și rezultatele: `probe_explorer-windows/`).
- Neprobate: ținutul apăsat pe telefon (biblioteca se bizuie pe meniul nativ al browserului; pe iOS nu vine), ecranele sub 600 px.
- Hotărâri la limită: butonul de readucere a ferestrei e PARȚIAL doar pentru că păstrează numele „Maximizare” (devine DA dacă numele e socotit aspect). Coloana Tip e PARȚIAL pentru că arată „FastStone PNG File”, de pe PC-ul de referință, nu „Fișier PNG”, cum spune lecția.
- Casetele de răspuns scris (calea, ediția Windows) sunt trecute ca funcții NU, cu notă: țin de exercițiu, nu de aplicație. Casetele pentru oră și pentru numărul de amenințări nu sunt trecute ca funcții, fiindcă țin de lecție. La fel butoanele „Reîncep exercițiul” / „Ia-o de la capăt”, întrebarea cu variante (`probaalege`) și analiza organizării din lecția V · M2 · 11. Lista completă e în `nesigure`, în JSON.

GATA_PARITATE explorer-windows total=95 da=34 partial=25 nu=36
