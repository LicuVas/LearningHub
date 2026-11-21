# Ciclurile în paralel (de la runda 15) — scris de orchestrator, 20.11.2026

## De ce
- **Vasile a cerut accelerarea** pe 20.11.2026, la 21:48: „mai avem două zile jumate să consumăm creditul. Poți accelera cu mai mulți agenți?”
- **Până acum rundele mergeau una câte una.** Acum merg 2-4 benzi deodată, fiecare pe aplicația ei.
- **Regulile campaniei NU se schimbă:**
  - contractul;
  - lacătul (`repere.lock`);
  - criticul rece;
  - publicarea doar cu GRAV 0;
  - datele personale 0;
  - nimic pe ecranul omului.
  Se schimbă doar ordinea: cine măsoară și când.

## Benzile ciclului A (pornire după acoperirea pe instrumente din runda 15)
| bandă | runda | val (cheia `val` din jurnal) | unghi (N mod 3) | ținta |
|---|---|---|---|---|
| Explorer | 15 | `B-explorer` | aspect | construcția File Explorer (`runde/supliment_B_explorer_runda15.md`) |
| Word | 16 | `B-word#2` (val redeschis) | gest_tastatura | cele 8 GRAV din `runde/5/critic.md` (`runde/supliment_B_word_runda16.md`) |
| Excel | 17 | `B-excel#2` (val redeschis) | stare_finala_erori | X10, A1, T1 din `runde/10/critic.md` (`runde/supliment_B_excel_runda17.md`) |

- **Valul redeschis are cheia lui** în jurnal (`"val": "B-word#2"`), iar `opreste.py` îl numără separat, cu limita de 6 pe redeschidere.
- **Deblocatorii** au fost scriși chiar de rapoartele valurilor: `runde/5/raport.md:44` și `runde/10/raport.md:56-62`.

## Fișierele: cine scrie unde
- **Fișierele proprii ale benzii:**
  - Explorer: `aplicatii/explorer.js`, `aplicatii/date/explorer.json`, `aplicatii/_unelte/genereaza_explorer.py`, `aplicatii/profiluri/windows11*.json` (toate noi);
  - Word: `aplicatii/word.js`, `aplicatii/date/word.json`, `aplicatii/_unelte/genereaza_word.py`, `aplicatii/profiluri/word*.json`;
  - Excel: `aplicatii/excel.js`, `aplicatii/date/excel.json`, `aplicatii/_unelte/genereaza_excel.py`, `aplicatii/profiluri/excel365.json`;
  - dosarul rundei tale: `D/runde/<N>/`.
- **Fișierele COMUNE:** `aplicatii/aplicatii.js`, `panglica.js`, `stare.js`, `aplicatii.css`, `poligon.html`, `setari.json`, `versiune.json`.
- **`D/api_biblioteca.md` e în ZONA ÎNGHEȚATĂ** (repere.lock; adăugat 21.11.2026 04:10, după ce trei benzi ale ciclului C l-au editat și au rupt lacătul măsurării comune): banda NU îl editează. Textul propus (secțiunea + rândul exact) îl scrie în `D/runde/N/api_propunere.md`; îl aplică o rundă `acoperire`, care reîngheață (`ingheata.py --acoperire`).
  - Le atingi doar dacă reparația nu se poate face altfel.
  - Doar cu unealta Edit, pe bucăți mici, niciodată Write pe tot fișierul și niciodată sed. Edit refuză dacă fișierul s-a schimbat de la ultima citire: atunci îl citești din nou.
  - Orice schimbare e păzită pe aplicație, ca să nu schimbe nimic la celelalte aplicații.
  - Fiecare schimbare o treci în `raport_constructor.md` › „Fișiere comune atinse”, cu rândurile exacte.
- **`D/de_verificat.md` și `D/de_aprobat.md`:** doar adaugi, în blocul tău (`<!-- RUNDA<N>-<APLICATIE>:START/END -->`), cu id-uri `R<N>-…` / `A<N>-…`.
- **NU atingi:**
  - fișierele proprii ale altei benzi;
  - lecțiile și jocurile;
  - zona înghețată: `oracole/`, `referinte/`, `scenarii/`, `suprafete.json`, `mutanti/`, `repere.lock`.

## Git și măsurarea
- **Git:** NU rulezi nicio comandă git care scrie (`restore`, `checkout`, `stash`, `reset`, `add`, `commit`). Pe disc lucrează alte benzi, iar un `git restore` le-ar șterge munca.
  - Ca să poți da înapoi, păstrezi copii: `D/runde/<N>/inainte/<fișier>` înainte de prima ta scriere în el.
  - Commit-urile le face orchestratorul, pe căi explicite.
- **Măsurarea completă (pasul 7 din prompt)** o face orchestratorul, O SINGURĂ dată pe ciclu, după ce toate benzile au terminat.
  - Tu NU rulezi `masoara.py` întreg.
  - Probele tale sunt țintite: `proba_grav.py`-ul rundei tale, scenariile aplicației tale prin `sim_runner.js` / `oracol_comportament.py`.
  - Când rulezi un oracol direct, setezi `LH_IESIRE=D/runde/<N>/probe_iesiri`, ca să nu scrii peste ieșirile comune din `oracole/`.
- **Pornirea comună** e măsurarea de la finalul acoperirii pe instrumente, copiată în `runde/<N>/masurare_pornire.json`.
- **Regresul celorlalte aplicații:** înainte de „gata”, rulezi o probă scurtă (5-10 scenarii) pe fiecare aplicație Office pe care o atinge un fișier comun schimbat de tine.
- **Serverul static** din probe pornește pe port liber (`127.0.0.1`, port 0); nu folosești un port fix. Probele în browser rulează headless, doar pe 127.0.0.1/localhost.

## Ieșirea fiecărei benzi
- **Constructorul** scrie, ca până acum:
  - `runde/<N>/raport_constructor.md` + `gata_pentru_critic.md`;
  - la ~200k de context: `stare_autor.md` + ultima linie `PREDARE`.
- **Orchestratorul** face restul:
  - criticul rece (pornit imediat ce banda termină);
  - măsurarea comună, rândul din jurnal, `opreste.py` pe valul benzii, commit-ul.
