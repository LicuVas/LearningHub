# Contract — tura de noapte M4, 01→02.11.2026 (lecțiile M4 de la a V-a și a VI-a)

**Cererea (verbatim, 01.11.2026, 22:55, prin `/bucla`):** „mai avem 43% pentru vreo 12 ore. continua pe learninghub cu lectii.”
(Citire: `consum.py` la 22:56 — 7 zile = 58 % (VERDE), resetare în 12h03 (~11:00, 02.11). Bugetul săptămânii care altfel se pierde la resetare se folosește (ghidul VI.4, excepția 19.10 / 23.10 / 26.10), pe opus, temeinic; peste 95 % niciun agent nou, peste 97 % nimic. `/bucla` = bucla profesorului: aici ea ESTE lanțul lecției — judecători independenți, cu context proaspăt, până la 0 GRAV / 0 MAJOR; oprirea o decide verdictul judecătorului, nu autorul. La final, T1 (repromptarea) peste raport.)

**Proba realității:** elevul de a V-a / a VI-a deschide în martie 2027 lecția de pe sit, o parcurge singur (la Tupilați a VI-a fără profesor, la Dumbrava pe telefon), exersează în pagină și face gesturile în aplicația reală din laborator; profesorul notează evaluările pe regula C/B/A, nota = punctaj : 10.

**Ce intră:**
- **V/22** „Inserarea și formatarea textului. Realizez o felicitare / un afiș” — din 26.10 la un pas: J5 = PUBLICABIL după trecerea de text AI (făcută de dirijor, 21:08); azi: probele finale rerulate (`proba_reparatii.py 9`, `parcurge.py r9`), apoi `publica_lectie.py v/m4-l22`.
- 6 lecții noi (fiecare se sprijină pe materie PUBLICATĂ; vecinii din același val se aliniază prin granițe):
  - **V/23** „Evaluare sumativă: editor grafic (produs digital)” (evaluare; Paint; grila de produs DIN `instrumente\Grila_produs.md`, activitatea profesorului citată; testul unității V-U4 NU există → probă de antrenament, ca la V/17)
  - **V/24** „Ce este un algoritm. Algoritmi din viața de zi cu zi” (predare; limbaj natural; începutul unității V-U5)
  - **V/25** „Proprietățile algoritmilor: claritate, finitudine, generalitate” (predare; limbaj natural)
  - **VI/23** „Comparăm cele trei structuri repetitive. Când o folosesc pe fiecare” (consolidare; Scratch + urmărirea)
  - **VI/24** „Reprezentarea algoritmilor prin blocuri grafice” (predare; schema logică)
  - **VI/25** „Rezolv probleme cu repetiție: sume, numărări, cifre” (consolidare; Scratch)

**Valul B (doar dacă bugetul și ora o permit, după ce J1 din valul A e gata):** V/26 („Datele: de intrare, de ieșire, de manevră. Constante și variabile”) și VI/26 („Evaluare sumativă: structuri repetitive”). Decizia se ia la ~03:00 după `consum.py`.

**Ce NU intră (motivul):** VII/24+ și VIII/24+ — activitățile profesorului cer un program scris și rulat („Primul program…”, „Primul program cu șir…”), iar limbajul (C++ / Python) e decizia lui Vasile (ghidul X.2 nr. 10; VIII/1 pomenește deja C++ la o întrebare). Întrebarea i se pune în raport; nu se blochează tura pe ea.

| R# | Cerința | Cine verifică | Ce număr înseamnă gata |
|---|---|---|---|
| R1 | Fiecare lecție trece prin judecător independent (J1 pereche opus + sonnet, apoi J2+ opus proaspăt) până la 0 GRAV / 0 MAJOR; verdictul final pe opus | judecătorul (`_verificare\judecatorN.md`) | 0 GRAV și 0 MAJOR la ultima judecată opus |
| R2 | Faptele despre aplicații probate sau scrise prudent (`nesigur`); Paint / aplicațiile din Magazin NU se pornesc | judecătorul | 0 afirmații neprobate scrise ca sigure |
| R3 | Regulile 22-27 (nimic spre exterior, `ctx.close()`, calculatorul neschimbat, „numele există deja”, date personale) | judecătorul + `learninghub_date_personale.py` + `activitate.py lista` | 0 / „nu e în catalog” = 0 (valoarea de start, 23:00) |
| R4 | Publicare doar prin `publica_lectie.py` (fișiere numite) | scriptul | ultima linie 0; conținut LIVE = fișierul comis; fum 390 + 1280 = 0 |
| R5 | V/23 (evaluare): grila de produs și activitatea DOAR din documentele profesorului; proba de antrenament pe regula de notare; nimic inventat | `verifica_regula.py`, `oracol_nota_site.py` + judecătorul | ultima linie 0 |
| R6 | Componentele comune neatinse (motor, `prezenta.js`, `rezultat-elev.js`, simulatoarele altora) — doar extensii cu nume nou | `git show --stat` pe fiecare commit | 0 fișiere străine |
| R7 | Nimic pe ecranul vizibil (e noapte, el doarme); Office doar pe desktopul ascuns, sub lacăt | judecătorul + dirijorul | 0 ferestre / 0 procese rămase; `curata_mru_office.py` → 0 |
| R8 | Bugetul: 7 zile sub 97 % până la resetare | dirijorul, `consum.py` la :13 / :43 | niciun agent nou peste 95 %; 0 opriri de limită |
| R9 | Jurnal + raport de dimineață + fișa de memorie + T1 peste raport | dirijorul | `04_ORCHESTRARE.md` la zi; `stare.py` arată lecțiile publicate sau, la fiecare lipsă, pasul următor scris |

**Deciziile dirijorului (le poate schimba Vasile):**
1. **6 lecții noi, toate la V și VI** — VII și VIII așteaptă limbajul de programare (mai sus). 6 autori deodată (nu 8): procesorul + lanțul de judecăți de după.
2. **V/24-25: limbaj natural, fără aplicație de programare** (unitatea V-U5 = „Algoritmi. Gândesc pas cu pas”; Scratch vine abia la V/31). Laboratorul = gesturi reale în aplicații deja predate (Paint V/18-22, Explorer V/9-11, browserul V/14), fără profesor.
3. **V/23: probă de antrenament + grila de produs a profesorului.** Activitatea lui: „Probă practică: realizarea unui produs grafic după specificații date (dimensiune, text, cel puțin două obiecte, salvare într-un format cerut). Notare după grila de produs.” Testul unității nu există → pagina dă specificațiile ca probă de antrenament, cu punctele pe regula de notare, iar întrebarea „Pentru profesor” stă în `surse.md`.
4. **VI/24: schema logică** (activitatea profesorului: „Transcrierea unui algoritm din limbaj natural în schemă logică și invers”); simbolurile din fișa profesorului / din programă, nu inventate; laboratorul = un gest real (alege autorul, cu motivul scris: desenul schemei cu forme într-o aplicație predată — PowerPoint VI/2-10 — sau implementarea în Scratch a schemei date).
5. Rămân deciziile vechi: VI = Scratch 3 online fără cont (`.sb3` pe calculator); notația de pseudocod = a lecțiilor publicate VI/20-22; Paint nu se pornește (fapte din V/18-22 + documentație).

**Ce NU intră:** jocurile, componentele comune (doar notate pentru poarta de lansare), panoul de activitate, lecțiile publicate (doar citite).
