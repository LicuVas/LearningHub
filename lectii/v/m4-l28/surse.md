# Lecția 28, clasa a V-a — surse, probe și ce n-am putut verifica (02.11.2026, valul de seară M4, cu V/29 în paralel)

Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md`. Granița: `_campaign\…\m4_seara_02_11\granite\v_l28.md` (scrisă 20:00, API FINAL 20:55). Starea autorului: `_proba\stare_autor.md`.

## Programa și planul
- `lectii\plan.json` / `Calendar_ore`: lecția 28, „Structura secvențială (liniară). Descriere în limbaj natural”, predare, 16.04.2027; unitatea V-U5 „Algoritmi. Gândesc pas cu pas” (`Proiectul_unitatii_V-U5.md`, r. 45).
- CS.2.3 „Descrierea în limbaj natural a unor algoritmi cu ajutorul secvențelor de operații și a deciziilor…”; conținutul declarat: „Structura secvenţială (liniară)” (textul EXACT din `curriculum.json`, cu ţ cu sedilă, cum îl cere poarta `test_joc.py`; în pagină, peste tot, „secvențială” cu virgulă). Activitatea de învățare din programă: „urmărirea pas cu pas a algoritmilor descriși pentru diferite seturi de date de intrare… (secvențe de operații)” → P5 + testele „afisat” pe două seturi de date.
- Descriptorul „De bază” (CS.2.3): „descrie, cu sprijin, în limbaj natural, prelucrările realizate asupra datelor de algoritmi dați, urmărind pas cu pas secvențe de operații” → P4-P5.

## Activitatea profesorului (citată întocmai, `Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`)
„Elevii scriu algoritmul unei activități familiare (pregătirea ghiozdanului), îl dau unui coleg să îl execute exact și îl corectează după ce văd unde s-a blocat.” Resursa: „caiet, fișă de scriere a algoritmului”.
- Fără profesor și fără coleg, „colegul care execută exact” = robotul din pagină (`secventa-liniara.js`, ca robotul V/24: face exact ce scrie, se oprește la primul pas pe care nu-l poate face și spune UNDE și DE CE). Atelierul = activitatea întreagă (scrie din cartonașe, pornește robotul, repară); P2-P3 o pregătesc pe bucăți (ordinea; pasul neclar / lipsă).
- „Fișa de scriere” → laboratorul: algoritmul TĂU (după orarul tău adevărat), scris în Notepad, verificat „fii tu robotul”, salvat; pe telefon, în caiet.

## Notația — de unde și ce variante există (manualele de clasa a V-a, textul brut în `lectii\v\m4-l25\_proba\manual\*.txt`)
| Ce | Intuitext | Sigma | Corint | Art Klett | CD Press | Litera | Lecția |
|---|---|---|---|---|---|---|---|
| numele | „structură liniară” (r. 3729-3730) | „secvențială (liniară)” (r. 3779) | „Structura secvențială (liniară)” (r. 2998) | „algoritmul secvențial” (r. 3198) | „instrucțiuni secvențiale sau liniare” (r. 3097) | „structura secvențială, denumită și structură liniară” (r. 3126) | structura secvențială (liniară) |
| citirea | „Citește” (r. 3780-3781) | „Operația de citire” (r. 3808) | „citește x” (r. 3032) | „Introducem” (r. 3259) | — | — | „Citește «x».” |
| afișarea | „Scrie” (r. 3782) / „Afișezi aria” (r. 3763) | „Operația de scriere” (r. 3814) | „se va afișa” | „afișează” | — | — | „Afișează «x».” |
| atribuirea | „=” (r. 3782-3784) | „variabilă ← expresie” (r. 3825) | săgeata (pierdută la extragerea textului) | — | — | — | în cuvinte: „Calculează E și pune rezultatul în cutia «x».”; ← doar de recunoscut |
- **„Afișează”, nu „Scrie”:** testul inițial al profesorului (`teste_initiale.json`: „Citesc a și b. Dacă a > b atunci afișez a…”, „la final afișez S”), jocul `algoritmi-v` („Afișează P.”) și lecția publicată VI/17 (`urmarire-algoritm.js`: „Afișează s”) — elevul le întâlnește pe acestea. „Scrie” ar fi încurcat și cu „scrie în căsuță” din instrucțiunile paginii.
- **Fără „=” pentru atribuire** (Intuitext o propune): la V/27, „=” e operatorul relațional („sunt egale?”), iar în V/29 condițiile îl folosesc.
- **Atribuirea în cuvinte** continuă forma lecțiilor 26-27 („Scade «preț» din «bani» și pune rezultatul în cutia «rest».”; V/27: „expresia aici DOAR se evaluează; niciun rezultat nu e pus într-o cutie”). Numele „atribuire” e în Intuitext, Sigma, EDP, Litera, Corint; ← în Sigma, EDP, Corint, în testul profesorului („S ← 0”) și la VI/17 → arătat O DATĂ, de recunoscut (P4, notă + „Încă un exercițiu”), necerut în exercițiile obligatorii.
- **Tabelul de urmărire:** Corint (r. 3036-3045: „Urmărim cum se execută fiecare instrucțiune… folosind următorul tabel”, coloanele Instrucțiunea | Variabila x | Variabila y) și Sigma (r. 3830-3850, „nu are valoare încă”). Corint arată și varianta prescurtată (doar ce se schimbă); lecția folosește forma cu TOATE cutiile în fiecare rând (brieful: „elevul vede ce e în fiecare cutie după fiecare pas”), cutia goală = căsuță goală („–” în tabelele afișate).

## Contradicții găsite (pentru profesor)
- Manualele scriu atribuirea în trei feluri (cuvinte, „=”, „←”), iar Corint scrie „citește / afișează”, Intuitext „Citește / Scrie”. Lecția: cuvinte + „Citește” + „Afișează” (motivele mai sus). Dacă la clasă folosiți altă formă, lecția 29 trebuie aliniată (granița).

## Granița (`m4_seara_02_11\granite\v_l28.md`)
- **Predau:** structura secvențială (liniară) — numele, ce înseamnă (unul după altul, în ordinea scrisă, fiecare o dată, fără să sară, fără să se întoarcă), cum o recunoști; descrierea în limbaj natural (pași numerotați, o acțiune clară pe pas); citirea, atribuirea, afișarea; urmărirea pas cu pas în tabel.
- **NU predau:** decizia / condiția / „dacă … atunci … altfel” (V/29), repetiția, evaluarea sumativă (V/30), Scratch. Proba: `_proba\vocabular.py` → **0** (pagina + simulatorul, fără comentarii; caută și „altfel” ca cuvânt, „condiți”, „ramur”, „repet”, „cât timp”).
- Presupun de la V/29 (nepublicată): nimic. V/29 presupune de la mine forma pașilor și a tabelului (granița ei, 19:57: „o preiau întocmai când apare”).

## Tabelul conținut → cerință / „Încearcă” / întrebare
| Ce predă | Unde | Exersat (obligatoriu) | Întrebarea |
|---|---|---|---|
| structura secvențială, ordinea contează | P2 | Încearcă P2 (ordonezi 6 pași; secventa) + atelierul | Î1, Î2 |
| descrierea în limbaj natural, pasul neclar / lipsă | P3 | Încearcă P3 (repari: ✕, cartonașe, ↑ ↓) + atelierul | Î2 |
| citirea, atribuirea, afișarea | P4 | Încearcă P4 (ordonezi; testul pe 2 seturi de date) | Î3, Î4 |
| tabelul de urmărire | P5 | Încearcă P5 (tabelul cu 5 pași, două atribuiri în aceeași cutie) | Î4, Î5 |
| ← (doar de recunoscut) | P4, notă | „Încă un exercițiu” (opțional) | — (necerut) |

## Ce presupune lecția că știe elevul (`profil.json`) — cu bife
- [x] algoritm, pas, executant care face exact ce scrie — V/24 (publicată; robotul ei se oprește la un pas pe care nu-l poate face — același fel de robot)
- [x] pas clar, complet; claritate / finitudine / generalitate — V/24-25
- [x] date de intrare / ieșire, variabila = cutia cu etichetă, o valoare odată, cea nouă o înlocuiește pe cea veche; „Pune 5 în cutia «preț».” — V/26
- [x] expresia, + − * /, ordinea, parantezele, cutia citită cu valoarea de acum — V/27
- [x] Notepad: Start › note, scrierea, Ctrl+S › Salvare ca, „Nu (sau Anulare)”, Fișier › Închideți fila, + — V/15
- [x] Explorer: Documente, clic, Delete, fără golirea Coșului — V/9-11, V/24, V/26
- Ce presupune V/27 („Pentru V/28”: „pași de forma «Pune în cutia «rest» valoarea expresiei…»”): acoperit, cu forma „Calculează E și pune rezultatul în cutia «x».” (aceeași ordine a cuvintelor ca la V/26).

## Decizii (luate fără profesor; motivul)
1. **Robotul NOU (`secventa-liniara.js`), nu `executant.js` (V/24):** lumile V/24 (tabla, drumul, turnul) n-au ghiozdanul și nici cutii; două executante cu reguli diferite în aceeași pagină s-ar contrazice (regula 8). Aceeași față: cartonașe, ↑ ↓ ✕, „▶ Pornește robotul”, „Ia-o de la capăt”, testele bifate.
2. **Nu `urmarire-algoritm.js` (VI/17):** citește algoritmul scris cu litere și ←; la a V-a cutiile au nume-cuvinte «…» (V/26-27).
3. **Calculele cu `EvaluareExpresii.valoare` (V/27, nemodificat):** semnele înseamnă exact ce a predat V/27.
4. **Lumea ghiozdanului:** închis la început, cu cărțile de azi; orarul de mâine trebuie citit înainte de „…pentru orele de mâine”; „Scoate… toate cărțile și caietele” golește tot în afară de penar — așa ordinea are consecințe vizibile (pui, apoi scoți = rămâi fără ele). Penarul pornește de pe birou.
5. **Laboratorul în Notepad** (predat la V/15; ghidul S75: „Lecția fără aplicație își face laboratorul într-un editor simplu deja cunoscut (Notepad)”). Paint, Calculator, Notepad NU s-au pornit.
6. **Fișierul se șterge la sfârșitul orei** (ca V/24, V/26): `…_ghiozdan.txt`, numit exact; felicitarea, afișul, stelele (V/22, V/23, V/25) nu se ating. Algoritmul rămâne în caiet („Dacă mai ai timp”).
7. **Imaginea P1:** Commons „A school Bag.jpg” (CC BY-SA 4.0, Manhyia), decupată fără siglă. Respinse: fotografiile cu copii (chiar din spate) și cele cu mărci / personaje desenate (ghidul IV.1 §7) — `_proba\commons_list*.txt`, `commons_img\`.

## Faptele, pe scurt (`afirmatii.json`, A01-A19: 5 PROBAT, 11 DOCUMENTAT, 1 PRESUPUS, 1 DEDUS, 1 PROBAT/NESIGUR; după R1: A01-A21, +A20, A21 PROBAT în simulator)
- Definițiile: manualele (A01-A09). Robotul și calculele: probate în simulator (A03, A10). Notepad: din lecția publicată V/15 și probele VIII/14 (A11-A16); pornirea din Start PRESUPUSĂ (ca la V/15), Enter între rânduri DEDUS, Windows 10 NESIGUR.

## Simulatorul: extensia `lectii\_sim\secventa-liniara.js` (NOUĂ, proprietar: lecția aceasta, v1.0)
- API complet în capul fișierului și în graniță. 0 stocare, 0 cereri. Tipuri `secventa` (lumi `ghiozdan`, `cutii`) și `urmarire`; funcții `text`, `ruleaza`, `tabel`, `imagine`.
- Fidelitate: nu simulează o aplicație. Regulile robotului sunt cele spuse în pagină (P2-P4) și probate pe cazurile-limită în `_proba\sim_logica.js` → **0** (43 de verificări): pași inversați, orar citit după, pune-apoi-scoate, închis de un pas anterior, neclar, deschis de două ori (voie), ordinea orar/deschide liberă, penarul înainte de „Scoate” (rămâne), algoritm gol; cutie goală la calcul / la afișare, suprascrierea, paranteze, „numerele de mână” pe al doilea set de date, ordinea citirilor liberă; tabelul: liniuțe, cuvinte („trei”), „3 * 5 = 15”, fără copiere, valoarea veche, afișat prea devreme, 4,5 refuzat.
- „Rezultat, nu drum” (regula 29): testele judecă starea de la sfârșit (ghiozdanul, ce s-a afișat pe două seturi de date); ordinea contează doar prin rezultat (orarul poate fi citit înainte sau după deschidere; citirile în orice ordine).

## Pentru lecția următoare (V/29 „Structura alternativă (decizia)”) și pentru oricine încarcă `secventa-liniara.js`
- **Ce rămâne la elev:** structura secvențială (liniară); pașii numerotați „1.”, „2.”, … (în propoziții: „pasul 1”; deasupra tabelelor de urmărire de la P5, simulatorul scrie „Pasul 1.”, „Pasul 2.”), la imperativ; „Citește «x».”, „Calculează <expresie> și pune rezultatul în cutia «x».”, „Pune 5 în cutia «x».”, „Afișează «x».”; atribuirea (valoarea veche se pierde); tabelul de urmărire (Pasul | o coloană pe cutie | Se afișează; în fiecare rând, toate cutiile după pas; cutia goală = căsuță goală). Pe calculator nimic. V/29 scrie «Pasul 1.»; e aceeași numerotare.
- **API:** `SecventaLiniara.ruleaza('cutii', pasi, {intrari, cutii})` (un rând pe pas făcut), `SecventaLiniara.tabel(pasi, intrari, {cutii, titlu, legenda})`, `SecventaLiniara.text(p)`. Decizia NU e aici: într-un fișier nou (V/29 își face `urmarire-decizie.js`, granița ei).
- **Nu se schimbă:** numele pașilor (f), textele lor, testele (k), forma raportului, prefixul `sec-`.

## Pentru componenta comună
- Nu ating motorul, `prezenta.js`, `rezultat-elev.js`, `evaluare-expresii.js`, `cutii-variabile.js`, `executant.js`, `algoritm-defect.js` (ultimele două nici nu le încarc).

## Durata (`_proba\durata.py` → `durata_out.txt`)
**52,2 min la 80 cuv./min, metoda strictă a autorului** (2083 de cuvinte pe drumul obligatoriu; 9 s pe gest, 20 s pe verificare, 15 s de gândire pe fiecare pas al algoritmului de ordonat și pe fiecare calcul din tabel, 5 s pe căsuța lăsată goală, 40 de semne tastate/min, mesajul robotului citit la fiecare încercare); **≈ 45 min la 110 cuv./min** (regula 30, metoda judecătorului). Pornit de la 60,2 min: tăiat în 3 runde (Notepad mai puțin repetat — P2 doar pornirea, P3 primul pas, salvarea doar în laborator; tabelul P5 cu 5 pași; legende și enunțuri mai scurte), fără să scot practică. Cele mai lungi: laboratorul (~11 min, din care ~7 tastat și salvat), P3 (~9), P2 (~8). **La limită pentru elevul lent: de cronometrat la clasă** (ghidul S45). Ce se sare primul: „Încă un exercițiu” (opțional), copierea în caiet („Dacă mai ai timp”); la 10 minute de final, laboratorul sare la ștergere.

## Nesigur / de semnalat profesorului
- Notepad NU a fost pornit (aplicație din Magazin): faptele vin din V/15 și din probele VIII/14 (`capturi_lipsa.json` L1-L3). Pornirea din Start = PRESUPUSĂ (ca la V/15); Notepad pe Windows 10 (fără file) = NESIGUR; Enter după un clic la capătul rândului = DEDUS.
- Ce e în Documentele elevului de la lecțiile 22-25 vine din granițele lor; dacă un elev are altceva acolo, ștergerea tot e corectă: numește doar fișierul `…_ghiozdan`.

## Pentru profesor
1. **Forma de scriere** (cuvinte + „Citește” / „Afișează”; ← doar de recunoscut) — după manualul clasei, dacă vreți alta.
2. **„Colegul care execută exact”** e robotul din pagină. La o oră obișnuită (nu cea simultană), elevii își pot schimba și caietele între ei: unul citește algoritmul celuilalt și face exact ce scrie.

## Regula 25 (calculatorul profesorului) și regula 22
- Nimic pornit pe ecranul vizibil: Notepad, Paint, Calculator, Chrome / Edge reali — nepornite. Office nepornit. Probele de pagină: Chromium din Playwright, headless, situl servit local (`_proba\server_local.py`), tot ce nu e 127.0.0.1 blocat, închidere cu `ctx.close()`.
- Commons: API-ul public prin urllib, User-Agent `LearningHub-lectii/1.0 (educational site)`, fără cont și fără nicio dată a profesorului.

## Atenție pentru judecător
1. **Laboratorul pe Notepad, nepornit:** faptele preluate din V/15 (A17, A24, A27, A12, A55) și VIII/14 (probat acolo pe Notepad 11.2607); captura din P2 e copia identică a celei din VIII/14 (sha1 4b5d2f85…; arată un fișier HTML al unui elev de a VIII-a — legenda o spune).
2. **„Afișează” și ←** — decizia mea, cu sursele mai sus; ← apare doar ca notă + un exercițiu opțional.
3. **Tabelul cu toate cutiile pe fiecare rând** (nu doar ce se schimbă) — mai multe căsuțe pe telefon (P5: 15), dar elevul vede starea întreagă după fiecare pas, cum cere brieful.
4. **Durata la limită** la 80 cuv./min (52,2 strict / ≈ 45 la 110): de cronometrat la clasă.
5. **Ghiozdanul apare și la V/24 (un `order` cu 4 pași) și la V/25 (pași neclari, alt robot):** aici ordinea are consecințe în lumea simulată (închis, orar, pune-apoi-scoate); niciun exercițiu nu e copia lor.
6. **Penarul** e singurul lucru pe care „Scoate… toate cărțile și caietele” nu îl scoate (nu e carte): spus în texte prin „cărțile și caietele”; testat (G11).

## Porțile și probele (ieșirile în `_proba\`; rulate ULTIMELE, pe versiunea finală)
- `python jocuri/_motor/test_joc.py --dir lectii/v m4-l28` → **TRECUT** (21 de întrebări jucate, diacritice 77,2/1000; avertisment: „1 niveluri”, așteptat la o lecție) — `test_joc_final.txt`.
- `verifica_lectie.py … --fara-t1` → **0** (S0, S1, S2 5/5 aplicare, T0 trecute) — `verifica_final.txt`.
- Playwright cu gesturi reale, `_proba\parcurge.py final` → **0 probleme** la 390 px (Pixel 7, atingere) și 1280 px (mouse + tastatură): fiecare `secventa` întâi pe greșeala tipică (✕, cartonașe, ↑, robotul pornit și „⏭ Arată tot”, „Verifică” → respins cu mesajul pasului), apoi drumul bun → „Corect”, toate testele bifate; `urmarire` întâi fără valorile duse mai departe (respins), apoi corect; 3 stele, 0 erori de pagină, 0 mesaje de consolă, ținte ≥ 32 px, nimic mai lat decât ecranul; cereri oprite: 2, spre panou 0 — `parcurge_final.txt`, capturile `telefon_*.png` (privite: P2 greșit, P4 corect, P5 greșit cu căsuțele roșii, atelierul).
- Logica simulatorului fără browser: `node _proba\sim_logica.js` → **0** (43 de verificări, oracol de mână) — `sim_logica_out.txt`.
- Granița: `_proba\vocabular.py` → **0**.
- Regula 27: `learninghub_date_personale.py` → **0** (`date_personale.txt`, doar numărul).
- Regula 24: `activitate.py lista | grep -c "nu e în catalog"` → **2 înainte, 2 după** (`activitate_inainte.txt`, `activitate_dupa.txt`; cei 2 = elevi reali de azi, contractul: „la start, 19:46: 2”).
- Nicio descărcare în lecție → `curata_metadate.py` nu se aplică.

## Reparațiile după judecata 1 (02.11.2026)
Registrul: `_verificare\registru_j1.md` (reuniunea judecății opus — 0 / 4 MAJOR / 12 MINOR — cu judecata sonnet — 0 / 0 / 8 MINOR: 20 de rânduri, deciziile dirijorului). Autorul reparației (R1) e altul decât autorul lecției; copia dinainte: `_proba\inainte_r1\`. Proba fiecărui punct: `_proba\proba_reparatii.py` (litera între paranteze drepte, 390 px cu atingere + 1280 px cu mouse și taste, rețeaua blocată, `ctx.close()`) → `proba_reparatii_1.txt`.
- **Simulatorul `secventa-liniara.js` 1.0 → 1.1 (API-ul NESCHIMBAT: aceleași funcții, pași `f`, teste `k`, forma raportului; doar comportament):** animația robotului se oprește când exercițiul se schimbă (M1: fiecare pas al animației verifică întâi că exercițiul lui e încă pe ecran; motorul refolosește `#body`); tabelul primește cutia goală spusă în cuvinte și dă mesajul de cutie goală, nu „scrie numărul”, într-o căsuță care trebuie să rămână goală (m1); „20 − 6” (calculul fără rezultat) e respins cu „în cutie stă rezultatul, nu calculul: cât face 20 − 6?”, iar „20 − 6 = 14” și „14” rămân primite (m2). Mutantul (1.0 servit în locul lui 1.1) pică proba M1 la 390 și la 1280. Regula căsuței goale NU s-a schimbat (în exerciții căsuța rămâne goală; „–” în tabelele gata făcute). Trecut în graniță cu ora.
- **Pagina:** laboratorul — „clic în Notepad, apoi Ctrl+S” (M2); ultimul punct începe cu închiderea Notepad (Fișier › Închideți fila; „Nu salvați” / „Nu salva”; Windows 10: X), apoi ștergerea fișierului TĂU (începe cu numele tău, conține `_ghiozdan`, poate și o cifră), cu ce NU se atinge spus (M3, m4, S5) — fostul punct separat „Închide fila” a intrat aici, deci laboratorul are 6 puncte; „cât numele propus e colorat, scrie…” (m3); trimiterea „la pasul 3 din 5, «Descrierea în limbaj natural»” în loc de „(pașii 2-3)” și „Pasul 1 îl citești” în loc de „P1” (m5, S3); „scrii pasul; apoi schimbi numerele pașilor de sub el” (m6). P2 „Uite cum” = alt algoritm, „Penarul uitat” (Închide, Pune penarul, Deschide), cu legenda care numește AMBELE greșeli și ordinea bună întreagă, probată în simulator (A20); nu mai dă răspunsul exercițiului de sub el (M4). P4: atribuirea = pasul care pune în cutie un rezultat sau un număr scris în algoritm („Pune 5 în cutia «preț».”), citirea = primește din afară o dată de intrare, „nu «se uită»” (m8, S1, S2, S6); „pasul 3 e unul singur: calculează 20 − 6 și pune 14 în «rest»” în legenda exemplului (m7); proza P4: 96 → 87 de cuvinte (numărătorul judecătorului sonnet, `j_cuvinte.py`) — nu ~80: sub 87 s-ar pierde una din cele patru lămuriri cerute de registru (S8; nota ← rămâne la P4, decizia dirijorului). P1: „pui cărțile pentru mâine și penarul”; indiciul P3: „ce lucru, care nu e o carte, trebuie să ajungă în ghiozdan? Uită-te la testul 2.” (m9, S4). P2 caseta Acum: „Pe telefon: nimic de făcut aici.” (m10). P3 caseta Acum: „Nu-ți ies ș, î, â? Scrie fără ele.” (m11). Legenda capturii Notepad: „Textul din ea … nu contează: contează fila și meniul.” (S7).
- **Durata (m12), refăcută:** metoda judecătorului (`_proba\j1_durata.py`, copia lui neschimbată) **45,6 min la 110 cuv./min / 53,0 la 80** (înainte 45,7 / 53,1; 2156 de cuvinte, înainte 2165); metoda strictă a autorului (`_proba\durata.py`) 52,1 la 80 (înainte 52,2). Reparațiile n-au lungit lecția: proza tăiată unde se putea (P1, legendele P2-P3, enunțul atelierului, intro-ul P5, laboratorul), practica neatinsă (laboratorul cere tot „încă cel puțin 3 pași”). **Rămâne la limită pentru elevul lent: de cronometrat la clasă.**
- **Pentru lecția următoare:** nimic nou de preluat — API-ul e același; dacă un tabel de urmărire folosește `SecventaLiniara`, acum primește și „e goală” / „nimic încă” și respinge calculul fără rezultat. V/29 nu încarcă fișierul (granița ei).
- Porțile R1 (pe versiunea finală): `test_joc.py` TRECUT · `verifica_lectie.py --fara-t1` 0 · `proba_reparatii.py` 0 · `parcurge.py` 0 (`parcurge_final_r1c.txt`: 3 stele, 390 + 1280, consola goală; o rulare intermediară a dat 2-3 „#chk acoperit” la 1280 — un clic pe „Verifică” cât merge animația robotului; la fel și cu simulatorul 1.0, `parcurge_sim10.txt`: cursă de timp a probei sub încărcare, nu a lecției) · `sim_logica.js` 0 (93 de verificări, extins cu m1 / m2 / M4) · oracolul judecătorului `j1_logica.py` 0 nepotriviri (224.960 de ordini) · `j1_gesturi.py` 0 · `j1_animatie.py`: P3E2 pornește curat, 0 erori · sonnet `j_logica.py` 0 erori de pagină, `j_tabel.py` 0; `j_gesturi.py` 2 — aceleași 2 ca la judecătorul sonnet însuși (scriptul lui pune „Închide” înaintea lui „Pune penarul” la P3E1, iar robotul are dreptate să-l respingă; vezi `_verificare\ab_sonnet\gesturi_run.txt`) · vocabular 0 · date personale 0 · `activitate.py … | grep -c "nu e în catalog"` 2 înainte, 2 după.

## Trecerea după judecata 2 (02.11.2026, T2)
Judecata 2 (`_verificare\judecator2.md`): 0 GRAV / 0 MAJOR / 4 MINOR; registrul: `_verificare\registru_j1.md`, secțiunea „Trecerea după judecata 2”; copia dinainte: `_proba\inainte_t2\`.
- **N1:** „Pentru lecția următoare” spune forma de pe pagină (listele de pași „1.”; tabelele de urmărire de la P5 „Pasul 1.”) + „V/29 scrie «Pasul 1.»; e aceeași numerotare.” (la fel în graniță).
- **N2 — `secventa-liniara.js`, comportament (API neschimbat, `versiune` „1.1”):** „14 (20 − 6)” e primit ca 14 (înainte: „nu calculul”); „20 − 6” rămâne respins. Două linii: `eCalcul` (reparația judecătorului) + `citesteNr` dă lui `CutiiVariabile.numar` doar numărul din fața parantezei (altfel îl citea 1414).
- **N3:** laboratorul, ultimul punct: „Apoi, dacă l-ai salvat: Explorer, Documente…”; „(chiar dacă n-ai terminat)” scos (îl spun intro-ul și „Cum lucrezi”).
- **N4:** legenda P2: „(pasul 1 are ✓ pentru că robotul l-a făcut, dar ghiozdanul era deja închis)”; proveniența capturii Notepad scurtată la „Captură din Notepad-ul real.”.
- **Durata (metoda J2):** 2156 → 2153 de cuvinte; 45,6 → 45,6 min la 110 cuv./min, 53,0 → 52,9 la 80 (de cronometrat la clasă, ca înainte).
- Porțile: `proba_reparatii_t2.txt` 0 (114 DA: N1-N4 + toate punctele J1 + martorii: simulatorul 1.0 pică M1/m1/m2, simulatorul din `inainte_t2` pică N2) · `parcurge.py` 0 (`parcurge_final_t2.txt`: 390 cu atingere + 1280, 3 stele din 3, consola goală) · `j1_logica` 0 · `j1_animatie` 0 erori · `j2_ecalcul` (copia) 0 · `sim_logica` 0 (107) · `t2_n2_martor` 0 · `vocabular.py` 0 · `test_joc` TRECUT (21 de întrebări) · `verifica_lectie --fara-t1` 0 · date personale 0 · activitate 2 → 2 · terminațiile de rând neschimbate (index.html, surse.md, registrul: CRLF; simulatorul, granița: LF).
