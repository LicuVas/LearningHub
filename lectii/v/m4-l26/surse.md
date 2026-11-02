# Lecția 26, clasa a V-a — surse, probe și ce n-am putut verifica (02.11.2026, tura de noapte M4, valul B)

> Nu e publicată, nu e în depozit (fără commit). Autor: agentul V/26 al turei 01→02.11. Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md`.

## Programa și planul
- **Titlul, locul, tipul:** `Info_Gimnaziu_2026\planificari\Calendar_ore_5AM_5M.md`, r. 34: „02.04.2027 | 26 | M4 | Datele: de intrare, de ieșire, de manevră. Constante și variabile | predare”. La fel în `data\unitati.json` (r. 298, unitatea V-U5 „Algoritmi. Gândesc pas cu pas”), `Planificare_calendaristica_clasa_V.md` r. 56 (CS.2.1, CS.2.2, CS.2.3), `lectii\plan.json` (nr. 26, 02.04.2027) și `Proiectul_unitatii_V-U5.md` (ora 26, „predare”, „teorie, exercitii”).
- **Programa** (`AI_0\data\informatica_gimnaziu\curriculum.json`): conținuturile „Clasificarea datelor cu care lucrează algoritmii în funcţie de rolul acestora (de intrare, de ieșire, de manevră)” și „Constante și variabile” — copiate ÎNTOCMAI în `continuturi` (cu „ţ” cu sedilă din programă: poarta `test_joc.py` cere textul exact; ghidul II.3 K6 e nehotărât; în `ancoraText`, care se vede, am scris „funcție” cu virgulă). Competența: **CS.2.2** „Identificarea datelor cu care lucrează algoritmii în scopul utilizării acestora în prelucrări”, cu descriptorii din `Proiectul_unitatii_V-U5.md` (De bază: „identifica și clasifica datele fundamentale (de intrare, de ieșire) … în pași ghidați”; Consolidat: „identifica și clasifica datele utilizate”; Avansat: „… justificând rolul acestora în prelucrare”). Activitățile de învățare ale CS.2.2 folosite: „analizarea unor situaţii cunoscute (viaţa în şcoală, mersul la cumpărături, conversii ale unor mărimi …) în scopul identificării datelor de intrare și a datelor de ieșire, cu diferenţierea variabilelor de constante” (problemele: serbarea, caietul, ora de sport, cumpărăturile, paginile unei file = conversie) și „determinarea datelor de ieșire, pe baza unui set dat de date de intrare” (elevul scrie valorile aflate). A treia activitate (propoziții cu operații logice) e a lecției 27.
- **Activitatea profesorului** (`Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`, r. 104), întocmai: „Pe trei probleme scurte, elevii completează un tabel cu ce se dă, ce se cere și ce se calculează pe parcurs. Analogia variabilei cu o cutie etichetată, cu obiecte care se schimbă.” Resursa: „fișă cu tabel de analiză, cutii etichetate pentru demonstrație”. Pe pagină:
  - **trei probleme scurte + tabelul** → atelierul (3 file: baloanele la serbare, paginile caietului, ora de sport), cu coloanele EXACT ale profesorului (Ce se dă / Ce se cere / Ce se calculează pe parcurs); tabelul e predat la P3 și exersat la P2-P3;
  - **cutia etichetată, cu obiecte care se schimbă** → P4 (cutiile din simulator, „Uite cum” cu urma pașilor; elevul e executantul și pune / schimbă valori); P5 (cutia cu lacăt = constanta); laboratorul (fișierul-„cutie” din Paint);
  - **fișa** și **cutiile pentru demonstrație** → la ora simultană nu există fișă pe hârtie și nici cutii reale: fișa e atelierul, cutiile sunt simulatorul (ghidul S12).

## Definițiile — de unde (manualele de clasa a V-a, manuale.edu.ro; textul brut în `lectii\v\m4-l25\_proba\manual\*.txt`, strâns de V/25)
Manualul ales de școală nu e pe disc (V/25: „La clasă: de completat”). Citate (rândurile din fișierele `.txt`):
| Manualul | Locul | Ce spune |
|---|---|---|
| Art Klett (Giurgiulescu), L4 „Datele cu care lucrează algoritmii. Constante și variabile” | `artklett.txt` r. 3516-3660 | „Numim date acele informații cu care lucrează un algoritm.” · „Date de intrare – datele pe care trebuie să le primească un algoritm din exterior pentru a putea fi parcurs.” · „Date de ieșire – sunt datele pe care le furnizează algoritmul în exterior după parcurgerea sa (rezultatele așteptate).” · „date de manevră, care sunt niște date temporare, necesare algoritmului pentru a se obține datele de ieșire pe baza datelor de intrare.” · exemplul C: „Suma prețurilor produselor se calculează pentru a ajuta la rezolvarea problemei (este dată de manevră).” · exemplul D: comisionul de 5 lei „constant”, sumele „variabile” — comisionul e trecut la „Date de intrare” |
| Intuitext (D. Popa) | `intuitext.txt` r. 3137-3148, 3213-3222 | „date de intrare (adică ceea ce primesc din exterior)”, „date de ieșire (adică acele date pe care suntem interesați să le obținem)”, „date intermediare numite date de manevră … date temporare” · „date variabile. Aceste date pot să își modifice valoarea pe parcursul execuției algoritmului.” · „date constante. Aceste date nu pot să își modifice valoarea…” · tabla de șah: pozițiile pieselor = variabile, dimensiunile tablei = constante |
| Corint (Niță ș.a.) | `b1166_CORINTLOGISTIC.txt` r. 2549-2550, 2607-2618 | „datele de intrare («ce se dă») și datele de ieșire («ce se cere»)” · „La fiecare executare a algoritmului, variabilele pot reține valori diferite.” · „Într-un algoritm, la un moment dat, variabila poate avea o singură valoare.” · constantele: „au aceeași valoare de fiecare dată când executăm algoritmul” · „Variabilele au întotdeauna un nume.” |
| CD Press | `cdpress.txt` r. 2852-2856, 2938-2999 | „Informațiile folosite într-un algoritm se numesc date.” · „date de intrare (datele din enunțul problemei), date de ieșire (rezultatul problemei) și date de manevră (folosite pe parcursul algoritmului, diferite de cele de intrare și ieșire)” · ceaiul: numărul de persoane = variabilă (4, 6, 20), „3 minute” = constantă |
| Sigma (Cosman ș.a.), L16 | `sigma.txt` r. 3400-3431 | „date de intrare, intermediare (de manevră) și de ieșire (finale)” · „Constantele sunt datele care nu se modifică pe parcursul întregului algoritm.” · „Variabilele sunt datele care își modifică valoarea pe parcursul execuției algoritmului.” · „conținutul (valoarea) ei poate să difere de la un moment la altul” |
| Litera | `litera.txt` r. 3104-3110, 3130-3131, 3200-3205 | intrare / manevră („date temporare”) / ieșire · „Variabilele sunt «cutii» … Fiecare «cutie» trebuie să fie etichetată … cu o denumire unică, care să sugereze conținutul său.” (aceeași analogie ca a profesorului) |
| EDP | `edp.txt` r. 2778-2803, 2839-2840 | „«cutii» separate, identificate prin câte un nume … se numesc variabile” · „variabila «găzduiește» o valoare la un moment dat” · noua valoare „în locul vechii valori” · constantele: „2 este 2 în orice împrejurare!” |

Pe pagină: „date” (Art Klett, CD Press), intrare / ieșire (Art Klett + Corint „ce se dă / ce se cere” + CD Press „din enunț”), manevră (Art Klett, Sigma, CD Press; „în unele manuale, date intermediare”), variabila (Intuitext + Corint + Litera/EDP pentru „cutie”), constanta (Intuitext + Corint / CD Press: cele DOUĂ feluri, spuse amândouă).

## Contradicții găsite (pentru profesor)
1. **Când e o dată „constantă”:** Intuitext și Sigma: nu se schimbă **în timpul execuției**; CD Press și Corint: are aceeași valoare **de fiecare dată când folosești algoritmul** (numărul de persoane e variabil pentru că altă dată faci ceai pentru 6). Lecția le spune pe amândouă (P5), iar exercițiile de clasificare spun explicit „merge pentru orice …” și „are mereu …”, ca să nu existe două răspunsuri bune.
2. **Rolul unei constante:** Art Klett trece comisionul constant la „Date de intrare”; CD Press numește „3 minute” „constantă a algoritmului”, fără rol. Lecția NU întreabă nicăieri rolul unei constante și spune: „«variabilă» și «constantă» nu sunt coloane noi în tabelul de analiză” (P5). În problemele tabelului, numerele fixe date în enunț („2 baloane de elev”, „2 pagini pe filă”) sunt la „Ce se dă” (scrise în enunț: CD Press, Art Klett).
3. **„Ce se calculează pe parcurs” depinde de algoritm:** la ora de sport, 50 − 10 − 12 are pe parcurs 40, iar 10 + 12, apoi 50 − 22, are pe parcurs 22. De aceea fiecare problemă cu trei coloane are algoritmul ei scris (activitatea profesorului spune doar „problema”).
4. Manualele numesc variabilele cu litere (a, b, x, si, e, c, R1…) și folosesc „citire / atribuire / afișare”, „←”: lecția nu le folosește (V/24-25 n-au nicio notație; litera în locul numărului și atribuirea sunt ale lecțiilor următoare) — numele cutiilor sunt cuvinte («mere», «preț»), ca la Litera („o denumire … care să sugereze conținutul”).

## Granița (`_campaign\…\m4_noapte_01_11\granite\v_l26.md`, scrisă 02:24, completată la final)
- **Predau:** datele; intrare / ieșire / manevră; tabelul de analiză; variabila (nume, valoare, o singură valoare odată, se schimbă doar când un pas pune ceva în ea); constanta; cele două întrebări diferite (rolul / dacă se schimbă).
- **NU predau:** expresiile, operatorii (27) — calculele sunt în cuvinte; structura secvențială ca denumire (28); decizia (29) — niciun algoritm cu „dacă”; Scratch (31). Proba mecanică: `_proba\vocabular.py` → **0** (pagina + simulatorul, fără comentarii: „expresi”, „operator”, „evalua”, „secvențial”, „structur”, „decizi”, „alternativ”, „atunci”, „citește”, „afișeaz”, „atribui”, „Scratch”, „repetă”, „condiți”, „←”; în cei 25 de algoritmi: fără „dacă”, fără litere în loc de numere, fără notație de calcul). Prima rulare a prins „atunci” (în sensul de timp) și „Sara citește” → schimbate.
- **Presupun de la V/24 și V/25 (publicate):** algoritm, pas, instrucțiune, executant; „caz”, generalitatea, „înmulțește cu 2 numărul găinilor numărate” (V/25 → „Un pod spre V/26”). Le folosesc fără să le redefinesc.

## Tabelul conținut → cerință / „Încearcă” / întrebare
| Conținutul | Predat în | Exersat | Verificat |
|---|---|---|---|
| Datele de intrare și de ieșire (ce se dă / ce se cere) | P2 (+ Uite cum: pâinile) | Încearcă P2 (clătitele, 2 coloane + valoarea), Încă P2 (sticlele), atelier | Î1 |
| Datele de manevră; tabelul de analiză | P3 (+ Uite cum: caietele Anei, cu algoritmul) | Încearcă P3 (plăcintele), Încă P3 (biletele de tren), **atelier (3 probleme)** | Î2 |
| Variabila: cutia cu etichetă, o singură valoare odată, se schimbă doar când un pas pune ceva în ea | P4 (+ Uite cum: urma cutiilor «mere», «pere») | Încearcă P4 (bomboane / copie), Încă P4 (bani / preț / rest), caseta P4 și laboratorul (Paint) | Î3, Î5 |
| Constanta; variabilă vs. constantă | P5 (+ Uite cum: găinile, cutia cu lacăt) | Încearcă P5 (orele de sport, clasificare), Încă P5 (biletele, cutia cu lacăt) | Î4 |

## Ce presupune lecția că știe elevul (cu bife; `profil.json`)
| Noțiunea | Unde e predată | Folosită aici |
|---|---|---|
| algoritm, pas, executant | ✔ lecția 24 (P2, P3) | P1, P4 („tu ești executantul”) |
| caz, generalitatea („orice curte”) | ✔ lecția 25, pasul 4 | P1, P5 („de la un caz la altul”) |
| dispozitiv de intrare | ✔ lecția 5 | P2, „Atenție la cuvânt” |
| Paint: Start + `pai`; Salvați ca › Imagine PNG; „există deja” → Nu; Ctrl+S după clic pe bara de titlu; Deschidere; Nou; X | ✔ lecția 18 (A10, A12, A17, A18, A21, A22, A29) | caseta P4, laborator 1, 3, 4, 6 |
| Selectare › Dreptunghi; Delete | ✔ lecția 19 (A10, A21) | laborator 2 |
| Text (A, clic, scrii, clic în afară); numele `Nume_Prenume_<clasa>_…` | ✔ lecțiile 22 (A01), 23 (A08) | caseta P4, laborator 1-2 |
| Explorer: Documente, Delete, nu golești Coșul | ✔ lecția 10; lecția 24 (ștergerea `…_robot`) | laborator 6 |
| înmulțire, adunare, scădere cu numere mici | ✔ clasele primare | toate problemele |
Trimiterile la lecțiile publicate (`?vezi=pN`): lecția 19 P4 „Selectezi o parte din desen” (titlul copiat din pagina ei).

## Decizii (luate fără profesor; motivul)
1. **Simulator nou** `lectii\_sim\cutii-variabile.js`: la ora simultană nu sunt nici fișa, nici cutiile reale. Tabelul de analiză: sub fiecare dată nepusă, un buton pe coloană (o atingere); o dată din tabel, atinsă, se întoarce sus. Cutiile: elevul e executantul (atinge cutia, scrie numărul, „Pune”).
2. **Fiecare problemă cu trei coloane are algoritmul scris** (Contradicții 3).
3. **Cartonașele datelor fără cifre** („câți elevi sunt în clasă”), ca forma să nu trădeze coloana (`proba_oracol.py` verifică: 0 cartonașe cu cifre); valorile se scriu doar la ce se cere și la ce se calculează pe parcurs — CS.2.2, „determinarea datelor de ieșire”.
4. **Răspunsurile scrise** (valorile) primite în toate formele corecte (regula 23, T3): cifre, cu unitate („50 de clătite”), în cuvinte („douăzeci și opt”), calculul („60 - 48 = 12”, „10+12”); `_proba\proba_numar.py`: 63 de forme bune primite, 43 greșite respinse, 0 nepotriviri. O cutie primește un singur număr („4 și 9” → „O cutie ține o singură valoare: scrie un singur număr.”).
5. **Ce NU spune analogia cutiei**, spus pe față (regula 16): o singură valoare odată; valoarea folosită rămâne în cutie; cutia se schimbă doar când un pas pune ceva în ea (capcana „rezultatul se schimbă singur” → Încă P4 și Î5).
6. **Constanta în simulator = cutie cu lacăt** (regula paginii, spusă în P5: „În pagină, cutia cu lacăt nu primește altă valoare.”).
7. **Laboratorul = un fișier-„cutie” în Paint:** numele fișierului = eticheta, desenul = valoarea; cifra 3 salvată, ștearsă, 7, Ctrl+S (scrie în același fișier), Nou + Deschidere → se vede 7; la sfârșit fișierul se șterge (ca la V/24; calculatorul comun rămâne cum era). **Motivul alegerii:** e gestul real care arată cel mai cinstit regula variabilei — eticheta (numele) rămâne, conținutul se înlocuiește, cel vechi nu se mai poate deschide. Respinse: redenumirea în Explorer (schimbă ETICHETA, adică exact opusul); un folder ca „cutie” (ține multe lucruri deodată); Nou + Salvați ca cu același nume (ar cere „Da” la „există deja”, iar regula 26 cere „Nu (sau Anulare)”). Pe telefon: cutia desenată în caiet, scrisă cu creionul, ștearsă cu guma.
8. **Imaginea P1** = tabela de scor de la lecția VIII/13 (cale relativă; licența, autorul și descrierea reverificate pe 02.11 → `_proba\commons_licenta.json`): etichete fixe + numere-plăcuțe = ideea variabilei, din lumea reală. Respinse: fotografiile cu cutii etichetate găsite pe Commons (fără context clar și fără etichete lizibile), tabela stadionului Regie (sigla clubului, fără etichete), tabela de fotbal american (etichete în engleză, nimic de schimbat la vedere).
9. **Numele:** inventate (Ana, Matei, Sara, Ionuț — doar prenume; `Pop_Ana_5A` ca la lecțiile 22-25); `_proba\nume_toate.py` → 0.
10. **Î2 = alegere** („care e o dată de manevră?”), nu clasificare cu 5 rânduri: durata (mai jos); clasificarea completă e deja în atelier.

## Faptele, pe scurt (detaliul în `afirmatii.json`, A01-A20)
20 de afirmații: 9 DOCUMENTATE (definițiile, din manuale; tabelul, din activitatea profesorului; constantele lumii), 8 CONFIRMATE din lecțiile publicate (5, 18, 19, 22, 23, 25: Paint, Explorer, recapitulările), 2 PROBATE în pagină (regulile cutiilor, socotelile), 1 DEDUSĂ (plăcuțele tabelei de scor). Scrise prudent: Ctrl+S „de obicei” fără fereastră; „te întreabă de salvare? Nu salvați” la Nou (L1). **Paint NU a fost pornit** (aplicație din Magazin).

## Simulatorul: extensia `lectii\_sim\cutii-variabile.js` (NOUĂ, proprietar: lecția aceasta; numele era liber la 02:22, în `lectii\_sim\` și în granițele V/23-25, VI/23-26)
- De sine stătător; nimic salvat, nimic trimis (la probă, la sfârșit în `localStorage` doar `lectie_v_m4_l26` al motorului și `lh_prezenta`).
- Capul fișierului: API, FIDELITATE (regulile paginii), ce nu se schimbă.
- După un „Verifică” greșit, orice schimbare șterge mesajul vechi și reface bifele (văzut în capturile r0: „Nu încă … «copie» e 4” stătea lângă ✓ noi); după „Corect”, simulatorul nu mai primește schimbări până la „Ia-o de la capăt” (motorul îl redeschide, `reiaDupaCapat`).
- Telefon: butoanele ≥ 40 px, căsuțele de număr cu font 16 px și `inputmode="numeric"`, coloanele tabelului una sub alta sub 640 px; Enter în căsuța de număr nu verifică (spune „Apasă Verifică când ești gata.”); Enter în căsuța cutiei = „Pune”; Escape închide caseta cutiei.

## Pentru lecția următoare (V/27 „Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”) și pentru oricine încarcă `cutii-variabile.js`
- **Ce rămâne la elev:** cuvintele date, date de intrare / de ieșire / de manevră, tabelul de analiză, variabilă (nume + valoare, cutia cu etichetă), constantă; în caiet (dacă a avut timp) eticheta și valoarea cutiei lui; pe calculatorul din laborator nimic (fișierul `…_cutie.png` șters, în Coș).
- **Un pod spre V/27:** calculele sunt spuse doar în cuvinte („Înmulțește «găini» cu «picioare de găină» și pune rezultatul în cutia «picioare».”, „Scade «preț» din «bani» și pune rezultatul în cutia «rest».”). V/27 poate scrie aceleași calcule ca expresii, cu numele cutiilor ca operanzi, și evalua pas cu pas, cu rezultatul pus într-o cutie.
- **API (v1.0):** `<script src="../../_sim/cutii-variabile.js">`; tipurile `tipuri:{'date-rol':CutiiVariabile.tipuri['date-rol'], cutii:CutiiVariabile.tipuri.cutii}`; problemele `P = {nume, enunt, pasi?, date:[{t, rol:'da'|'cere'|'parcurs', v?, val?, pas?}]}`; algoritmii cu cutii `C = {cutii:[{n, c?, v?}], pasi:[{t, pune:{nume: număr | (s)=>număr}}]}`; testele `coloane | valori` și `cutie`; `CutiiVariabile.tabel / urma / ruleaza / numar`. **Nu se schimbă:** numele tipurilor și ale testelor, forma lui P și C, ROLURI, regulile cutiilor, prefixul `cv-`, `#cv-css`. O lecție care vrea altceva (de exemplu o cutie cu expresia scrisă de elev) scrie `cutii-variabile-<ceva>.js` și se leagă doar de API.

## Pentru componenta comună
Nu folosesc nicio componentă comună în afară de motor. Nimic de semnalat.

## Durata (`_proba\durata.py` → `durata_out.txt`)
Metoda judecătorilor V/19-V/25: citit 80 cuv./min (clasa a V-a), 9 s pe gest, 20 s pe verificare, tastat 40 de semne/min, **plus 15 s de socoteală pe fiecare număr aflat** (peste metoda V/25, ca să fie cinstit: 24 × 2, 60 − 48 la 11 ani). Caseta P4 (Paint) 2,5 min; laboratorul pe puncte (0,2 + 1,0 + 0,3 + 1,0 + 1,0 min; „Dacă mai ai timp” deoparte; pliabilul „Pe telefon” deoparte). **51,8 min la 80 cuv./min; 43,7 min la 110 cuv./min** (metoda din glosar, I.9, și regula 30). Fără cele 15 s de socoteală, ~49,6 min la 80. **La limită (regula 30, ritmul clasei a V-a): de cronometrat la clasă.** Prima versiune: 58,0 min; tăiat fără să scot vreun gest real: o singură atingere pentru o dată (în loc de două), Î2 alegere în loc de clasificare, „De ce”-uri și legende mai scurte, laboratorul și caseta P4 mai scurte, pliabilul „Pe telefon”. Dacă trebuie tăiat încă: „Încă un exercițiu” nu contează; caseta P4 (2,5 min + text) se poate face doar în laborator (punctul 1 are deja tot drumul).

## Nesigur / de semnalat profesorului
1. Paint după Ctrl+S, Nou și Deschidere: se vede 7 și nu întreabă nimic la Nou (L1) — scris prudent.
2. Ce rămâne în locul cifrei după Selectare + Delete (L2) — nu contează pentru pași.
3. Cronometrarea la clasă (51,8 min la 80 cuv./min).
4. Pe un telefon fizic n-am probat (atingeri emulate în Chromium).
5. Plăcuțele tabelei de scor „se pot schimba”: DEDUS din fotografie (A09).

## Pentru profesor
1. **Manualul clasei:** definițiile sunt din Art Klett / Intuitext / Corint / CD Press. Dacă manualul de la clasă e altul și spune altfel despre constante (Contradicții 1-2), se schimbă ușor P5.
2. **Fișa cu tabel de analiză:** lecția are trei probleme ale paginii (atelierul), fiecare cu algoritmul scris. Dacă fișa dumneavoastră are alte probleme, se pun în locul lor (aceeași formă).
3. **Cutiile etichetate:** în pagină sunt desenate; la clasă puteți face și demonstrația cu cutii reale — pagina nu se bazează pe ea.
4. **Fișierul `…_cutie.png`** se șterge la sfârșitul orei (ca `…_robot` la lecția 24). Dacă vreți să-l vedeți, scoateți ultimul punct.
5. Variabilele au nume-cuvinte («mere», «preț»), fără litere și fără „citește / ←”: notația vine la lecțiile următoare, cum decideți.

## Regula 25 (calculatorul profesorului) și regula 22
Lecția n-a pornit nicio aplicație și nicio fereastră pe ecran. Am citit fișiere și am rulat Chromium-ul din Playwright headless: probele pe situl servit local (`_proba\server_local.py`), rețeaua spre afară blocată, închidere DOAR cu `ctx.close()`. Cereri externe doar de citire, fără date ale profesorului, cu User-Agent „LearningHub-lectii/1.0 (educational site)”: API-ul Wikimedia Commons (`_proba\commons_cauta.py`, `licenta_p1.py`) și două miniaturi privite la alegerea pozei, ținute în scratchpad (nu în lecție). Nicio cheie de registru atinsă, niciun Office, nicio salvare în afara `_proba\`. Nu sunt fișiere de descărcat (regula 21 nu se aplică).

## Poarta și probele (ieșirile în `_proba\`; rulate ULTIMELE, pe versiunea finală)
- `test_joc.py --dir lectii/v m4-l26` → **TRECUT** (19 întrebări jucate, cu `rezolva` / `gresit` ale simulatorului; doar „1 niveluri”, obișnuit) — `test_joc_*.txt`.
- `verifica_lectie.py index.html --fara-t1` → ultima linie **0** (S0 TRECUT, S1 0 / 0, S2 5/5 aplicare/execuție, T0 0) — `verifica_*.txt`. Rularea 1 a prins „valoare” folosită înainte de P4 și o casetă de 168 de cuvinte → reparate.
- `_proba\parcurge.py` → **0** (`parcurge_r1.txt`, pe versiunea finală): situl servit local, rețeaua blocată, `ctx.close()`; la 390 px (Pixel 7, atingeri) și la 1280 px (mouse + taste), toată lecția până la diplomă. La fiecare tabel: întâi drumul GREȘIT tipic (o dată în coloana greșită: de manevră la „Ce se cere”, de intrare la „Ce se cere”) → respins, cu mesajul lui; data greșită atinsă în tabel → se întoarce sus; „Ia-o de la capăt”, fiecare dată pusă cu o atingere, numerele TASTATE → „Corect”; la 1280, Enter în căsuță → „Apasă Verifică când ești gata.”, fără verificare. La fiecare exercițiu cu cutii: atingerea constantei („e o constantă”), „4 si 9” tastat → refuzat („o singură valoare”), drumul greșit (copie 4 / rest 6 / total 20) → respins, apoi pașii executați pe rând → „Corect”. Clasificările și alegerile întâi greșit. Ținte sub 32 px: 0; nimic ieșit din ecran; 3 stele la 390 și la 1280; 0 erori de pagină / consolă; cereri oprite: 2 (fonturile Google), spre teste-vasile / lh-api: 0. Capturile de telefon privite: `telefon_pas1_e0_corect.png`, `telefon_pas2_e0_gresit.png`, `telefon_pas3_e0.png`, `telefon_atelier_corect.png`, `telefon_pas0.png`, `telefon_tabel_gol.png`, `telefon_cutie_caseta.png` (`captura_np.py`). Runda r0 (înainte de atingerea unică) → 0; capturile ei au dus la `fix_sim1.py` (mesajul vechi lângă bife noi).
- `_proba\proba_oracol.py` → **0** (69 de verificări: valorile din textul afișat cu rețete separate, interpretorul Python al pașilor cutiilor = `ruleaza()`, Î3 și Î5 rezolvate din text; 57 de mutanți și controale: valoare + 1, dată mutată de coloană, starea greșită a cutiilor, cutii goale → toate prinse; soluția trece).
- `_proba\proba_numar.py` → **0** (63 bune / 43 rele).
- `_proba\vocabular.py` → **0**; `_proba\nume_toate.py` → **0**; `learninghub_date_personale.py` → **0** (`date_personale_1.txt`); `activitate.py lista | grep -c "nu e în catalog"` → **0** înainte (02:43) și după probe (03:02). Ieșirea cu nume nesalvată.
- `motor.js` / `motor.css` neschimbate (sha1 `e748784c…` / `665e3696…`); `git status lectii/_sim/` arată de la mine doar `cutii-variabile.js` (celelalte fișiere noi sunt ale altor autori din val).

## Atenție pentru judecător
1. Durata la limită (51,8 min la 80 cuv./min cu socotelile; 43,7 la 110).
2. Regula „variabilă = se schimbă / constantă = nu” în cele două sensuri ale manualelor (Contradicții 1): verificați că niciun exercițiu nu are două răspunsuri bune.
3. Tabelul de analiză: o atingere pune data; atingerea în tabel o scoate — încercați drumurile greșite (dată pusă greșit, scoasă, pusă iar; „Ia-o de la capăt” pe altă filă).
4. Laboratorul: Paint nepornit; Nou + Deschidere după Ctrl+S (L1).

## Reparațiile după judecata 1 (02.11.2026)
> Autor PROASPĂT (promptul `m4_noapte_01_11\prompturi\r1_v26.md` + `luni_12_10\prompturi\_reparare_j1.md`). Registrul, cu fiecare punct al AMBELOR judecăți (opus 1 MAJOR + 10 MINOR, sonnet 9 MINOR → 20 de litere, A-T): `_verificare\registru_j1.md`. Copia dinainte: `_proba\inainte_r1\`. Secțiunile de mai sus rămân ISTORIC (numerele de atunci: laboratorul avea 6 puncte, acum are 8).

| Punct | Ce am schimbat | Unde | Cum am verificat |
|---|---|---|---|
| A (MAJOR, opus J1-A) | Clasificările variabilă / constantă nu se mai rezolvă după formă: niciun rând cu valoare în paranteză, 5 rânduri, ordinea / lungimea / cuvintele nu despart clasele; variabilele se schimbă cât lucrează algoritmul („câte ore de sport s-au strâns până acum”, „câte minute fac orele strânse”, „câte roți a numărat până acum”, „câte biciclete a văzut”…), constantele niciodată („câte ore de sport are clasa pe săptămână”, „câte minute ține o oră de sport”, „câte roți are o bicicletă”, „câte roți are fiecare tricicletă”) → un singur răspuns pe ambele definiții din manuale | P5 Încearcă, Î4 | probă pe pagină: `ghicitor_forma.py` → 0 (cu control pe copia veche, unde ghicitorul reușea) + `proba_reparatii` [A] |
| B (opus J1-B) | „Sub ea / Sub fiecare, atinge butonul coloanei ei.” | simulatorul 1.1 | probă pe pagină [B], urmat literal → Corect |
| C (opus J1-C) | „Te întreabă de salvare? Desenul are ceva nesalvat: Anulare, refă punctul 5, apoi iar Fișier › Nou.” · „Vezi 7? Valoarea nouă a luat locul lui 3… Vezi 3? Desenul cu 7 nu s-a salvat: refă punctele 4 și 5, apoi acest punct.” | laborator 6 | citire + [C]; faptul despre Paint DEDUS (L1) |
| D (opus J1-D) | „Cu Text, clic pe pânză, scrie 7” | laborator 4 | [D] |
| E (opus J1-E) | „Explorer, lecția 10 (Documente, Delete, Coșul)” | antet | [E] |
| F (opus J1-F) | „Un bilet costă mereu 5 lei: de aceea «preț bilet» e o cutie cu lacăt (constantă).” | P5 Încă | [F] |
| G (opus J1-G) | „Un exemplu dintr-un manual de clasa a V-a: …” | P5 altfel | [G] |
| H (opus J1-H) | „(decupată și micșorată, aceeași licență)” | P1 legenda | [H] + licența prin API |
| I (opus J1-I) | Caseta P4 scurtată (prima salvare pe scurt; rândul de la sfârșitul orei păstrat, scurt: fișierul se face la P4) | P4 | [I] + `j1_cuvinte` |
| J (opus J1-J) | „…mai puțin 40 de lei, adică 10 lei” | P3 Încă, De ce | [J] |
| K (opus J1-K) | „Ai făcut-o la pasul *Variabila: o cutie cu etichetă* (P4)? Treci la punctul 4.”; „de la pasul *La ce folosește* (P1)” | laborator 1, P4 | [K] |
| L (sonnet M1) | „5 bilete, de câte 8 lei, costă 40 de lei” | P3 Încă, De ce | [L] |
| M (sonnet M2) | Pașii pe numele datelor („Înmulțește numărul elevilor cu câte baloane primește un elev…”, plăcintele, caietul, Î2) | P3, atelier, Î2 | [M] + `proba_oracol` |
| N (sonnet M3) | „Una singură e o dată (nu e data din calendar).” | P1, P2 enunțul | [N] |
| O (sonnet M4) | După Corect: „Exercițiul e încheiat…”; reluarea: „O încercare nouă, doar ca să exersezi…”, fără ✗ până la noul Verifică | simulatorul 1.1 | [O]; „fără Verifică” nereprodus (motorul îl pune la loc) |
| P (sonnet M5) | `numar()`: `zecimal`, `minus`, „cinci zeci” → nu înțeleg | simulatorul 1.1 | [P] + `adv5` comparat cu 1.0 |
| Q (sonnet M6) | Laboratorul 1 → 1-3; „liniuța de jos (Shift și tasta cu minus, ca la lecția 22)” | laborator 1-3 | [Q] |
| R (sonnet M7) | „Se mai vede o bucată din 3? Trage alt dreptunghi peste ea și iar Delete.” | laborator 4 | [R]; L2 rămâne de fotografiat |
| S (sonnet M8) | banda trece pe două rânduri | CSS | [S] la 390 |
| T (sonnet M9) | `img\tabela-scor.webp` (copie identică) + `img\SURSE.json` | P1 | [T] + sha1 |

**Decizii noi (fără profesor) și de ce:**
1. **Clasificările (A):** am ales „aceeași formă pentru toate rândurile, fără valori” (ca la cartonașele tabelului), nu „valoarea și la variabile” (propunerea judecătorului: „(de exemplu, 4)” lângă „(2)” ar fi rămas un semn de formă). Am pus în clasificări doar date care au UN singur răspuns în ambele manuale: variabile care se schimbă cât lucrează algoritmul (deci și de la o folosire la alta) și constante care nu se schimbă niciodată. Datele care se schimbă doar „de la un caz la altul” (numărul de săptămâni dat la început) sunt variabile pe definiția paginii, dar constante pe definiția Intuitext/Sigma luată singură: rămân predate (P5 text, găinile, biletele), dar nu mai sunt cerute într-o clasificare (ghidul T28: itemul care poate contrazice o definiție se lasă deoparte). Proba: `ghicitor_forma.py` (simularea algoritmilor pe două cazuri).
2. **Laboratorul (C, Q, R):** 8 puncte în loc de 6 (1-3 = fostul 1). „Nu salvați” la Nou a ieșit: e adevărat doar dacă Ctrl+S a mers. Rândul de curățenie din caseta P4 a rămas (I), scurt.
3. **Simulatorul 1.1 (B, O, P):** doar adăugiri; API-ul (tipurile, testele, forma lui P și C, ROLURI, clasele `cv-`) neschimbat.

**Pentru componenta comună** (judecătorul opus, nu ale lecției): (1) `motor.js`, classify: după Corect focusul ajunge pe pagină / antet, nu pe „Încă un exercițiu” (regula 14), la toate lecțiile cu classify; (2) „Ia-o de la capăt” după Corect scoate „Încă un exercițiu” până la noul Corect (voit). Motorul nu l-am atins.

**Pentru lecția următoare (V/27) — ce s-a schimbat:** `cutii-variabile.js` **1.1** (SCHIMBAT în granița `m4_noapte_01_11\granite\v_l26.md`, cu ora): `numar()` are două motive NOI, `zecimal` și `minus` (o lecție care tratează motivele are nevoie de o ramură implicită); mesajele „Sub ea / Sub fiecare, atinge butonul coloanei ei.”; după Corect, notele „Exercițiul e încheiat…” / „O încercare nouă…”. Nimic din ce era „nu se schimbă” nu s-a schimbat. Pașii problemelor folosesc acum datele pe NUME (fără numere în pași), bun pentru expresiile de la V/27. Fotografia P1 stă în `img\` al lecției (nu mai depinde de VIII/13).

**Durata după reparații** (cu ACELAȘI numărător înainte și după): metoda judecătorului opus (`_proba\j1_durata.py`, copia neschimbată) **39,7 min la 110 cuv./min, 48,5 la 80** (la judecată 38,5 / 46,9: +137 de cuvinte, mai ales laboratorul 1-3 și ramurile „Vezi 3?” / „Te întreabă de salvare?”, și un rând în plus la clasificări); metoda autorului (`_proba\durata.py`, mai pesimistă: +15 s pe fiecare număr aflat) 44,9 la 110 / 53,4 la 80 (era 43,7 / 51,8). Regula 30 (110 cuv./min + gesturi) e respectată; la 80 cuv./min lecția e în banda 48-50 → **rămâne „de cronometrat la clasă”**. Laboratorul se citește mai puțin decât numără scripturile: cine a făcut caseta de la P4 sare peste punctele 2-3.

**Probele, pe versiunea finală** (rulate pe rând de `_proba\r1_final.sh`, 04:06-04:22; rezumatul în `_proba\r1f_rezumat.txt`; sha1 ale fișierelor lecției aceleași la începutul și la sfârșitul rulării):

| Proba | Rezultat | Ieșirea |
|---|---|---|
| `test_joc.py --dir lectii/v m4-l26` | TRECUT (19 întrebări jucate; doar „1 niveluri”, obișnuit) | `_proba\r1f_test_joc.txt` |
| `verifica_lectie.py index.html --fara-t1` | **0** (S0 TRECUT, S1 0 / 0, S2 5/5, T0 0) | `_proba\r1f_verifica.txt` |
| `learninghub_date_personale.py` | **0** | `_proba\r1f_date_personale.txt` (+ rularea de la final, după surse.md) |
| `_proba\ghicitor_forma.py` (NOU, punctul A) | **0** — controlul pe copia veche: ghicitorul reușea la 2 / 2 | `_proba\ghicitor_forma_out.txt` |
| `_proba\proba_reparatii.py 2` (NOU, o verificare pe literă, 390 atingeri + 1280 mouse/taste) | **0** pe versiunea reparată; pe copia veche 70 de verificări pică (fiecare literă pică cel puțin o dată; S doar la 390, unde era defectul) | `_proba\proba_reparatii_2.txt` |
| `_proba\parcurge.py r3` (390 cu atingere + 1280, până la diplomă) | **0**; 3 stele la 390 și la 1280; consola goală; 0 cereri spre panou | `_proba\parcurge_r3.txt` |
| `_proba\proba_oracol.py` (valorile + mutanții) | **0** (69 de verificări, 57 de mutanți / controale) | `_proba\r1f_oracol.txt` |
| `_proba\proba_numar.py` (formele scrise) | **0** (63 bune primite, 43 greșite respinse) | `_proba\r1f_numar.txt` |
| `_proba\vocabular.py` / `nume_toate.py` | **0** / **0** | `_proba\r1f_vocabular.txt`, `r1f_nume.txt` |
| copiile NESCHIMBATE ale probelor judecătorilor (`_proba\r1_judecatori.py`; sha1 copie = original, `r1_judecatori_sha1.txt`) | **0** probleme: `j1_drumuri` 2 = exact artefactul declarat de judecător (motorul, „Ia-o de la capăt” după Corect), 0 altele; `j1_citate` toate citatele reparate dispărute (J1-E și J1-I rămân: adăugare / doar locul); `j1_vocabular` 0 potriviri noi în text (11 noi în codul JS / contracția „n-ai”, alarme false ca cele 50 de la judecată); `j1_licenta` CC BY-SA 4.0, Acabashi, sha1 = copia din `img\`; `j1_durata` 48,5 ≤ 50; `j1_cuvinte` caseta P4 91 (era 112); sonnet `adv`/`adv2`/`adv3` 0 excepții, 0 erori, 54 de verdicte toate neschimbate; `adv4` 0 ținte sub 32 px; `adv5` doar cele 5 forme reparate diferă de 1.0 | `_proba\r1_judecatori_out.txt`; ieșirile copiilor: `_proba\j1_*_out.txt`, `_proba\r1_sonnet\` |
| `activitate.py lista \| grep -c "nu e în catalog"` | 0 înainte (03:40, 04:06) și 0 după (04:22 și la final) | (doar numărul) |
| Capturi de telefon privite | banda pe două rânduri, clasificarea P5, laboratorul (punctele 6-8) | `_proba\telefon_r1_*.png` |
