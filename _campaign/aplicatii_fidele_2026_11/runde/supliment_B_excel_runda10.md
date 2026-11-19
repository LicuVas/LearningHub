# Supliment la promptul rundei 10 (valul B-excel, runda a 5-a de reparații, ULTIMA din val) — scris de orchestrator, 19.11.2026

## Unde suntem
- Criticul 9 (`runde/9/critic.md`, unghiul aspect) a închis K1, E1, E2, E3, E4.
- Au rămas deschise:
  - **X10**: graficele merg, dar „Insert Line or Area Chart ▾” și „Add Chart Element › Data Labels” dau doar mesajul central, iar atelierul lecției m2-l11 cere etichete de date;
  - **E5**: vărsarea formulei, neatinsă în runda 9.
- Criticul 9 a găsit două GRAV noi:
  - **A1**: locul graficului la inserare;
  - **A2**: bara de stare nu arată Average / Count / Sum.
- Total: 4 GRAV deschise.
- **Runda 10 e a șasea și ultima din valul B-excel** (`opreste.py`, LIMITA_VAL = 6). După ea, valul se oprește oricum. Ce nu închizi acum rămâne deschis până la următorul val Excel.
- Criticul rundei 10 are unghiul **gest_tastatura**:
  - va juca gesturile tale cu tastatura: Alt, N, C, ↓ și Enter; Shift+săgeți; tastarea formulei, Enter și Yes; Ctrl+Z, Esc, Delete;
  - va citi ținta și acțiunea fiecărui eveniment §4.
  - Deci fiecare reparație trebuie să meargă și numai din tastatură, cu evenimentele corecte.

## Ținta rundei 10, în ordinea asta
1. **A1 — locul graficului nou** (`runde/9/critic.md` › GRAV A1):
   - **Azi:** graficul apare lângă tabel, sărind o coloană, pe rândul 2 (`excel.js:2485`, `const x = xCol(q.c1 + 2) …, y = yRand(q.r0 + 1) …`).
   - **În Excel real** (`runde/9/critic_probe/com_r9.json › carti`, același build):
     - graficul stă în mijlocul ferestrei vizibile: `left_pt 378`, `top_pt 155,7`, `TopLeftCell $H$11`;
     - fereastra are `UsableWidth 1152`, `UsableHeight 565,8`, `VisibleRange $A$1:$X$37`;
     - locul e același pentru LUNI și pentru A1 singură, deci nu depinde de tabel.
   - **Mărimea** rămâne 480×288 px, cum e acum: e pe referință (`panglica_context.Ctx_Format › Shape Width/Height`).
   - **Formula locului:** o scoți din numerele COM, raportate la zona vizibilă a grilei, și o scrii în `diferente.md`. La 1366×768 graficul trebuie să cadă pe H11, cu cel mult o celulă abatere.
   - **Telefonul (375×667, atingeri) și fereastra mică (1093×526 = 1366×657 la 125%, contractul I1):**
     - graficul nou trebuie să se vadă imediat după inserare: colțul din stânga-sus și titlul pe ecran, iar în fereastra mică graficul întreg;
     - pe telefon graficul e mai lat decât ecranul. Regula aleasă (de exemplu: centrat în zona vizibilă, dar lipit de marginea stângă vizibilă când e mai lat decât ea, cu grila derulabilă până la el) o scrii în `diferente.md`;
     - ce face Excel real într-o fereastră mai îngustă decât graficul trece în `de_verificat.md` (rândul R10-1).
   - **Probă:** clic și atingere pe galerie, plus Alt, N, C, Enter. `getBoundingClientRect` al graficului față de fereastră, la 1366×768, la 375×667 și la 1093×526; `stare().grafice[0].pozitie` = ce se vede.
2. **A2 — rezumatul selecției în bara de stare** (`runde/9/critic.md` › GRAV A2):
   - **Referința** `bara_stare#selectie_numere`: B2:C4 aleasă, cu numerele 9, 7 / 8, 10 / 6, 5. Apar:
     - `Button "Average 7,5"` [859,2, 746,4, 74,4, 20,8];
     - `Button "Count 6"` [933,6, …];
     - `Button "Sum 45"` [988,8, …].
   - Butonul **Display Settings** nu apare când e o selecție (el e doar în `bara_stare`, fără selecție, la [925, 746]).
   - Virgula zecimală vine din setările românești.
   - **Ce faci:**
     - rezumatul apare pentru selecția cu numere, la locurile din referință, și se actualizează la fiecare schimbare de selecție sau de valoare;
     - cazurile pe care referința nu le dă (o singură celulă, doar text, text amestecat cu numere, celule goale în zonă) le tratezi cel mai prudent și le scrii în `diferente.md` + `de_verificat.md` (R10-2);
     - nu le inventezi din memorie ca „sigure”.
   - **„Ecranul = starea”:** dacă §5 are o cheie pentru bara de stare, o folosești. Dacă nu are, NU schimbi `api_biblioteca.md` (nu ai voie): notezi în `diferente.md`.
3. **E5 — vărsarea** (`runde/8/critic.md` › E5, `runde/9/critic.md` › E5):
   - **Yes** (sau Enter) în „We found a typo…” pune `=SUM(B2:B7)*B2:B6` în D2.
   - **În Excel real:** D2:D6 = 432, 336, 384, 480, 288, `HasSpill: true` (`runde/8/critic_probe/com_r8.json`; citește ce chei are).
   - **Azi:** D2 = `#VALUE!`.
   - **Ce trebuie:**
     - un rezultat-zonă în motorul de calcul, pentru un număr înmulțit cu o zonă (și operațiile aritmetice simple, la fel);
     - celulele vărsate D3:D6 în `stare().celule` și pe ecran;
     - recalcul când se schimbă B2:B7;
     - Ctrl+Z care scoate toată vărsarea;
     - formula doar în D2 (ce raportează Excel real pentru D3: citește în `com_r8.json`; dacă nu e acolo → R10-3).
   - **NU construiești** funcțiile de zonă (FILTER, SORT, UNIQUE…). Nici `#SPILL!`, chenarul vărsării sau scrierea peste o celulă vărsată, dacă referința nu le dă: acestea merg în `de_verificat.md` (R10-3).
   - Starea și ecranul trebuie să spună același lucru.
4. **Dacă rămâne loc, în ordinea asta** (MINOR-urile criticului 9, doar cele dovedite cu referință, COM sau §4):
   - **Ținta tastelor cu graficul ales:** Delete pe grafic dă `tinta: celula:B5`, iar Enter pe titlu dă `tinta: celula:A1`. §4 cere „la taste: ținta focusului”, deci ținta canonică a graficului sau a titlului. E pe unghiul criticului 10.
   - **Esc în Sort cu focusul pe Then by** (nivelul 2) dă `tinta: camp:Sort by` (`runde/9/critic.md` › MINOR).
   - **Axa valorilor** (`scaraGrafic`, `excel.js:2363`): Excel lasă loc deasupra maximului (`com_r9.json`: CARTI 0–10 din 1 în 1; după B4 = 20, 0–25; LUNI 0–30).
   - **Quick Styles:** pătratul gol dintre Style 4 și Style 5; Style 1 neales.
   - **„More Column Charts...”** are un ▾ după text. Referința: un `MenuItem` simplu.

**X10 NU e în runda asta.** Listele care lipsesc (`lista.ChartTypeLineInsertGallery`, Add Chart Element › Data Labels) nu sunt în referință. Contractul (Etapa 0) spune că lărgirea acoperirii se face doar într-o rundă `acoperire` separată, iar valul nu mai are loc de ea. NU le desenezi din memorie. X10 rămâne deschis, cu deblocatorul numit (`de_verificat.md` R9-6), pentru următorul val Excel.

**Ce NU inventezi** (rămân în `de_verificat.md`): R9-1…R9-10, R8-1…R8-19, R7-*, R6-3. Constatările [FARA_REFERINTA] ale criticului 9 sunt deja trecute acolo ca R9-1…R9-10. Rândurile tale noi încep de la **R10-1**.

## Ce citești întâi
1. `D/contract.md` · `D/api_biblioteca.md` (§3, §4 cu `activat` și `tasta_acces`, §5 excel, §6.3).
2. `runde/9/critic.md` (tot) · `runde/9/stare_autor.md` (notele despre E5 și despre grafice) · `runde/9/raport_constructor.md`.
3. Apoi codul din `aplicatii/`, cu Grep înainte de Read:
   - `excel.js` are ~3260 de rânduri, multe foarte lungi: îl citești pe bucăți;
   - `uia_excel.json` și `date/excel.json` NU se citesc întregi, ci prin Python, pe chei. Cheile de sub `suprafete` sunt șiruri plate cu punct, de exemplu `j["suprafete"]["bara_stare#selectie_numere"]`.

## Măsurarea
- **Pasul 1 e deja făcut:** pornirea ta e `runde/10/masurare_pornire.json`.
  - E copia lui `runde/9/masurare.json` (pasul 7 al rundei 9, pornit la 17:11:46, singur, după ultima scriere).
  - În pasul 7, O6 a depășit 1800 s și a ieșit NECONCLUDENT. De aceea O6 e luat din `runde/9/masurare_o6_c2.json` (reluat singur = 0); vezi cheia `nota_orchestrator`.
  - Numerele: O1 61, O2 13392, O3 21586, O4 50, O5 113, O6 0, O7 343, O8 102, O9 34, porți 41, toate pe cum_fac; lacăt ok.
  - NU rulezi o măsurare de pornire. Poți scrie sub `aplicatii/` de la început.
- Între pași rulezi parțial: `--doar O4,O5,O9`.
- **Pasul 7:** `python D/oracole/masoara.py --runda 10 --paralel 3 --compara D/runde/10/masurare_pornire.json`.
  - Îl pornești DUPĂ ultima ta scriere sub `aplicatii/`, SINGUR pe mașină. Cât rulează (~75 de minute), NU rulezi nicio probă și niciun browser în paralel.
  - **Dacă O6 iese iar NECONCLUDENT pe timp** (durează ~1770-1800 s, iar limita e 1800 s):
    - copiezi `masurare.json` în `masurare_pas7.json`;
    - reiei imediat, tot singur și fără nicio scriere între ele: `--runda 10 --doar O6 --compara D/runde/10/masurare_pornire.json`;
    - copiezi rezultatul în `masurare_o6.json`;
    - pui înapoi `masurare_pas7.json` ca `masurare.json`, pentru că `--doar` rotește fișierul;
    - scrii asta în `raport_constructor.md`.
  - Orice oracol sau poartă crește → `git restore` pe fișierele tale.
- `oracole/porti.py` NU-l rulezi direct: rescrie `oracole/porti.json`, care e reper înghețat. La final `python D/ingheata.py --verifica` = 0.
- **Proba ta:** `runde/10/proba_grav.py`:
  - gesturi reale pe A1, A2 și E5 (plus cele din punctul 4 pe care le faci), înainte și după, ieșirile în json;
  - fiecare GRAV cu cel puțin un drum numai din tastatură.
  - O scrii ÎNAINTE de cod, ca s-o vezi picând.
- **Regresul, la 0 picate:**
  - Excel: `runde/9/proba_grav.py` (după E5 trebuie să treacă tot), `runde/8/proba_grav.py`, `runde/7/proba_grav_cont.py`, `runde/6/proba_excel.py`. La `runde/7/proba_grav.py` (X6, 2 rânduri) și `runde/7/proba_grav_cont2.py` (X8, 3 rânduri) sunt acceptate doar căderile deja explicate de referința nouă (`runde/8/diferente.md` D14, D18; confirmate de criticul 9);
  - Word: `runde/5/proba_grav.py`, `runde/4/proba_grav.py`, `runde/4/proba_telefon.py`, `runde/3/proba_grav.py`, `runde/2/proba_grav.py`.

  Dacă o probă veche verifica un comportament pe care referința îl contrazice, nu „repari” proba ca să treacă. Scrii cazul în `runde/10/diferente.md`, cu citatul din referință.
- În NICIUN fișier pe care-l scrii nu pui căi cu numele utilizatorului Windows (`C:/Users/...`): scrii „%TEMP%”.

## Excel real
Probabil nu-ți trebuie: numerele sunt deja în `com_r8.json` și `com_r9.json`. Dacă totuși îți trebuie:
- doar `win32com.client.DispatchEx("Excel.Application")`, invizibil, cu `DisplayAlerts=False`, fișiere unice în %TEMP%;
- închizi doar PID-ul tău;
- niciodată `Dispatch` / `GetObject` / `GetActiveObject` / `taskkill /IM EXCEL.EXE`.

Pe mașină poate rula un Excel ascuns al altei console: nu e al tău, nu-l atingi. PowerPoint nu-l atingi.

## Ce NU faci (le face orchestratorul)
- Nu faci pasul 8 (criticul) și nici pasul 9 (commit, merge, push, nonce). Te oprești după pasul 7 și scrii:
  - `runde/10/raport_constructor.md`: numerele înainte → după, FĂCUT / NEFĂCUT / NESIGUR, fișierele schimbate, și pentru fiecare GRAV: cum l-ai reparat, proba, rezultatul;
  - `runde/10/gata_pentru_critic.md`: doar unde e ce și cum se deschide poligonul.
- Fără commit, fără push.
- Atingi doar `aplicatii/`, plus notele tale în `runde/10/`, `de_verificat.md`, `de_aprobat.md`. Lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, scenariile și `api_biblioteca.md` NU.

## Economia contextului (OBLIGATORIU)
Toți constructorii au trecut de 290k. Runda 9 a avut nevoie de 2 constructori.
- După FIECARE GRAV terminat și probat, actualizezi `runde/10/stare_autor.md`: ce e gata, ce urmează, ce fișiere, ce numere. Oricând te oprești, un constructor proaspăt continuă de acolo.
- La ~200k de context te oprești la prima graniță curată de după și raportezi „PREDARE”.
  - La predare NU rulezi pasul 7 (peste o oră de mașină): rulezi doar `--doar O4,O5,O9` + proba ta + regresul și scrii numerele în `stare_autor.md`.
  - Pasul 7 complet îl rulează doar constructorul care termină runda.
  - E normal ca primul constructor să facă A1 și A2 și să predea, iar E5 să-l facă unul proaspăt.
- Ieșirile mari de Bash le scrii în fișier și aduci în context doar coada.
