# Lecția 17, clasa a VII-a — „Evaluare sumativă: material audio-video”: surse, decizii, ce n-am putut verifica (19.10.2026)

Starea și deciziile autorului, cu variantele respinse: `_proba\stare_autor.md`. Numerotarea pașilor = bara motorului: P1 „La ce folosește”, P2 „Cum se notează filmul: grila de produs”, P3 „Scenariul și ordinea: criteriile 1 și 3”, P4 „Sunetul și montajul curat: criteriul 2”, P5 „Genericul cu surse: criteriul 5”, P6 „Explicația unei decizii de montaj: criteriul 4”. Atelierul = filmul de antrenament al lui Matei (+ „Încă un exercițiu”: filmul Sarei). Laboratorul = „Acum la calculatorul din laborator” (18 pași de la reparația J1: pasul 2 = filmul de echipă; grila de autoevaluare e ÎN pasul 14). Granița cu VII/16: `_campaign\revizuire_completa_2026_09\m3_19_10\granite\vii_l17.md` (și `vii_l16.md`): de acord.

## 1. Programa și planul
- **Titlul exact:** `Info_Gimnaziu_2026\planificari\Calendar_ore_7_MA.md`: „22.01.2027 | 17 | M3 | Evaluare sumativă: material audio-video | evaluare sumativă”. În `data\unitati.json`: VII-U2 = lecțiile 11-17, lecția 17 cu materialele „test_unitate, barem”.
- **Atenție, numerotare diferită:** în `Calendar_ore_VII_A.md` și `Calendar_ore_VII_B.md` aceeași oră e nr. **18** (26.01.2027), iar mini-proiectul e nr. 17 (19.01.2027): acolo lipsește ora nr. 12 (după 24.11 urmează direct 08.12 = nr. 13). Pagina folosește numerotarea din `unitati.json` / `Calendar_ore_7_MA.md`, ca toate lecțiile publicate ale clasei.
- **Conținuturile** (`continuturi`), copiate întocmai din lecțiile 13-15 (care le-au luat din `curriculum.json`, cu sedilele lor): „Selecţia unor secvențe audio, audio-video pentru ștergere, copiere şi mutare”, „Mixarea semnalului audio din mai multe surse”, „Efecte de tranziție între scene”, „Suprapunere coloană sonoră peste scene”, „Generice – suprapunerea textului peste scene”; `lectii:[13,14,15,16,17]`. NU am declarat conținuturile lecțiilor 11-12 (interfața, înregistrarea): pagina le folosește, dar nicio întrebare nu le verifică.
- **Competențele** CS.1.2 și CS.3.2, cu descriptorii De bază / Consolidat / Avansat: `planificari\Proiectul_unitatii_VII-U2.md`.

## 2. Ce a cerut profesorul pentru lecția 17 și ce am ales
- **Activitatea** (`data\activitati_lectii_VII_VIII.json`, cheia „Evaluare sumativă: material audio-video”): „Evaluarea produsului după grilă (respectarea scenariului, calitatea sunetului, montaj, generic cu surse) plus explicarea unei decizii de montaj.” Resurse: „produsele elevilor, grila de produs”.
- **Grila** = `instrumente\Grila_produs.md`, copiată întocmai în pagină (criteriile, capetele de coloană, descriptorii; aceleași cuvinte ca în lecția VII/9): 5 criterii × 0-18 p, repere 10 / 14 / 18, + 10 din oficiu, nota = punctaj : 10, rotunjită (la ,5 în favoarea elevului), nivelul din notă (`SISTEM_EVALUARE.md` §4.2-4.3, `REGULA_NOUA.md` §1-4). Exemplele din pagină: 84 → 8 (P2 „Uite cum”), 76 → 8 (P2 Încearcă), 75 → 8 la ,5 (P2 Încă), 68 → 7, Consolidat (P2 Încă, „nivelul nu vine dintr-un criteriu”), 77 → 8 (Î2). Oracolele: `verifica_regula.py` → 0, `oracol_nota_site.py` → 0.
- **Produsul evaluat** = filmul de la VII/16 („O zi de iarnă”, `Nume_Prenume_clasa_iarna.mp4`, proiectul din Clipchamp, scenariul și propozițiile din caiet), după granița cu autorul VII/16. Pagina 17 NU dă nota: pregătește elevul (ce se notează, cum arată bine fiecare criteriu, autoverificarea, explicația), iar în laborator elevul își verifică, își repară și își reexportă filmul, își scrie explicația și se autoevaluează pe grilă (rezultatul stă doar în memoria paginii; „Sunt alt elev: golește alegerile”, regula 23).
- **Citirea celor patru repere ale profesorului în criterii (INFERENȚA MEA, de confirmat):** respectarea scenariului → 1 · Respectarea cerinței; calitatea sunetului + montajul curat (goluri, muzica de la 0:00, volumul) → 2 · Corectitudinea tehnică; montajul ca ordine / treceri / titlu care se citește → 3 · Organizarea; explicarea unei decizii de montaj → 4 · Explicația; genericul cu surse → 5 · Munca proprie / sursele. Aceeași citire o folosește VII/16 (`vii_l16.md`). Ce se cere concret la fiecare criteriu (lista „La film:” din grilă) e luat DOAR din ce au predat lecțiile 13-16, nu e o cerință nouă. **De la reparația J1, pagina o spune ca citire a lecției, nu ca procedura profesorului:** „La film (citirea lecției)”, „Pașii următori le așază pe criterii, ca să te pregătești; dacă profesorul le împarte altfel, îți spune”; activitatea orei e citată ca atare (P2).
- **Nota lucrării de modul:** P2, „Uite cum”: „Nota filmului e punctaj : 10, ca mai sus. Dacă profesorul îți spune că filmul e și proiectul de modul, nota din catalog se socotește ca la lecția 1: (80% din punctajul filmului + punctele de pe LearningHub) : 10.” Documentele nu spun dacă filmul e „proiectul de modul” al M3 (§3, întrebarea 11).

## 3. Pentru profesor (întrebări; pagina le scrie prudent sau deloc)
1. **La lecția 17 se notează produsul pe grilă (activitatea) sau se dă un test cu barem pe C / B / A (`Proiectul_unitatii_VII-U2.md`, ora 17: „test_unitate, barem”)?** Testul VII-U2 NU există (`materiale\continut\teste_sumative.json` are doar V-U1; `materiale\print\` doar Test_V-U1). Am urmat activitatea (mai precisă și aceeași cu VII/16). Dacă vine un test, pagina se schimbă: P2-P6 rămân valabile ca pregătire, atelierul și laboratorul nu.
2. **Citirea celor patru repere în criteriile grilei** (§2): e cea dorită?
3. **Cum predă elevul filmul** (fișierul rămâne în Descărcări pe calculatorul din laborator? stick? cont?). Pagina spune doar: „Fișierul .mp4 îl lași în Descărcări, cu numele tău. Cum îi dai filmul profesorului îți spune el. Dacă nu ți-a spus încă, scrie în caiet numele fișierului și locul tău în laborator.”
4. **Explicația** (criteriul 4): scrisă în caiet (cum a ales VII/16) sau spusă cu voce tare? Pagina: „O scrii în caiet, sub scenariu, în 3-4 propoziții.”
5. **Mini-proiectul în echipe** (activitatea VII/16: „Mini-proiect în echipe, cu roluri”) vs. filmul și explicația pe elev: cum se notează un film făcut în echipă? De la reparația J1, laboratorul are drumul echipei (pasul 2, cu cuvintele VII/16: „în contul cui lucrați”, „cum se cheamă fișierul”, „rolul fiecăruia”): lucrează împreună la calculatorul celui în contul căruia e filmul, doar el se conectează, fiecare își scrie explicația unei decizii la care a lucrat el și se notează pe rând pe grilă. Nota filmului de echipă (aceeași pentru toți? pe roluri?) rămâne la profesor.
6. **Contul de Clipchamp în laborator** (ca la VII/14-15): pagina repetă regula contului din VII/15.
7. **Elevul fără film** (absent la 16, n-a terminat; reparația 2: cine are filmul neterminat sau neexportat → laboratorul,
   pasul 7, întrebarea 12): pagina îl trimite pe drumul de rezervă (atelierul, explicația din amintire, profesorul). Nu spune nimic despre notă (nici „nota 1”).
8. **(J1, opus M2) Elevii își pot repara și reexporta filmul în ora 17, înainte de predare?** Activitatea spune doar „Evaluarea produsului după grilă”. Pagina o spune ca propunere a lecției („Ca să te pregătești, lecția îți propune: verifici …, repari, exporți din nou…”) și lasă hotărârea profesorului: „Dacă profesorul a spus că filmul nu se mai schimbă azi, doar îl verifici și notezi în caiet ce ai repara.”
9. **(J1, opus M1) Filmul de echipă în ora 17:** e bine ca echipa să lucreze la calculatorul celui în contul căruia e proiectul (fișierele proiectului sunt în Descărcări acolo)? Pagina: „Azi lucrați din nou împreună, la calculatorul celui în contul căruia e filmul: doar el pornește Clipchamp și se conectează…”.
10. **(J1, opus m7) Ce înseamnă Avansat la film la criteriile 1, 3 și 5** („depășește cerința cu elemente potrivite, alese motivat”, „organizare gândită pentru scopul și publicul produsului”, „explică de ce contează”)? Pagina nu inventează o rețetă: „La Avansat, grila cere ceva ales de tine, cu un motiv (citește descriptorul): la film, motivul îl poți spune în explicația din caiet (criteriul 4). Nu știi ce ar fi Avansat la filmul tău? Întreabă-l pe profesor.”
11. **Filmul e și „proiectul de modul” al M3** (nota din catalog = 80% din punctaj + punctele de pe LearningHub, ca la lecția 1)? Lecția 17 e singura evaluare sumativă din M3 (`Calendar_ore_7_MA.md`); pagina o spune condiționat (P2, „Uite cum”).
12. **(Reparația 2) Cât timp primește la ora 17 elevul al cărui film de la lecția 16 nu e gata sau nu e exportat?** Judecata 2
    a VII/16 a socotit că, la cei mai mulți, filmul nu e gata la sfârșitul orei 16. Laboratorul, pasul 7, îi propune („Dacă
    profesorul nu vă spune altfel …”) să-l termine întâi, cât mai simplu (doar ce n-a bifat în caiet), apoi să-l exporte la
    pasul 12. Pagina nu spune câte minute: dumneavoastră hotărâți (de exemplu, primele 15-20 de minute ale orei 17), iar
    pregătirea pe criterii (pașii 1-6, atelierul) se scurtează atunci. Același lucru: VII/16, „Pentru profesor” 8.

## 4. Ce presupun cunoscut (din lecțiile publicate) și ce acopăr
| Presupus cunoscut | De unde | Folosit aici |
|---|---|---|
| ✔ grila de produs, calculul notei din grilă | VII/9 (laboratorul), VII/1, VII/10 | P2, laboratorul (grila, pasul 15; 14 înainte de reparația 2), Î2 |
| ✔ capul de redare, \|◀ ▶, clic pe riglă | VII/11, VII/14 | P3, P6, lab 7 |
| ✔ vocea care se înțelege peste muzică (volumul muzicii coborât) | VII/13 („Mixezi: muzica pe a doua pistă”) | P4, P4 Încă, lab 8 |
| ✔ golul, coșul de gunoi, mutarea scenei la locul ei, tranziția (+, „Fără”), când are rost o tranziție, muzica de la 0:00, Audio › Volum | VII/14 | P3, P4, atelier, lab 7-9 |
| ✔ titlul care se citește (contrast, mărime, loc, de departe), genericul cu autorii / licența / locul, CC0 și CC BY, citit de două ori, exportul 1080 p, Descărcări, (1), deconectarea | VII/15 | P3, P5, atelier, Î1, Î5, lab 9-12, 16 |
| ✔ filmul „O zi de iarnă”, scenariul, propozițiile „Am ales … pentru că …” | VII/16 (granița) | P3-P6 „La calculator, acum”, laboratorul (pasul 2: echipa, „în contul cui lucrați”, „rolul fiecăruia”) |
- **Nimic nou de aplicație.** Singurii termeni noi: „decizie de montaj” și „alternativă” (P6, cu definiția lor), „criteriu” / „reper” (din VII/9, repetate în P2).

## 5. Atelierul (antrenament, fără puncte)
- Simulatorul: `video-clipchamp.js` (VII/14) + `video-clipchamp-text.js` (VII/15), **neatinse**, ca tip `videoclipchamptext` cu `export:true`. Nicio extensie nouă (n-a fost nevoie de puncte: grila se aplică pe filmul elevului, de profesor).
- Filmul lui Matei: scenele dimineața, lacul, pădurea, seara (lacul înaintea pădurii), un gol de 1 s înaintea serii, „Ardere” între dimineață și lac, muzica de la 0:03 la 180 %, titlul alb, sus, 24, genericul fără autorii muzicii, licență și loc, 4 s. Cele 12 teste poartă numărul criteriului (1, 2, 3, 5); criteriul 4 se exersează la P6 și în întrebări.
- **Comportamente ale simulatorului de știut (P = presupuse de VII/14, nu le afirmă pagina):** o scenă lăsată peste altă scenă se strecoară la tăietura cea mai apropiată de mijlocul ei (`insereazaVideo`); de aceea soluția atelierului lasă pădurea la 0:03 (cade la 0:04). O tranziție dispare singură când cele două scene nu mai sunt alăturate: după mutarea pădurii, „Ardere” dispare (P). De la reparația J1 (sonnet), indiciul testului „o singură tranziție” spune asta DOAR despre pagină: „Nu mai e niciuna (în pagină, o tranziție dispare când cele două scene ale ei nu mai stau lipite)? Pune una cu + între lacul și seara.” În Clipchamp real comportamentul rămâne nesigur (nepornit).
- Fotografiile, muzica, `unde.js` și `lum.js` sunt încărcate din `lectii\vii\m2-l15\` (CC0, autorii în `m2-l15\img\SURSE.json` și în genericul filmului de antrenament). Nu le-am copiat (muzica are 1 MB). **Dependență:** dacă VII/15 își mută fișierele, atelierul acesta se strică.

## 6. Imagini (toate refolosite de pe sit; niciuna nouă)
- P1: `lectii\vii\m2-l14\img\montaj-video.webp` (Shotcut, Pavouk, Wikimedia Commons, CC0; proveniența: `m2-l14\img\SURSE.json`).
- P3: `jocuri\audio-video-vii\img\clipchamp-zone.webp` (captură Clipchamp a jocului; `jocuri\audio-video-vii\img\SURSE.json`).
- P4: `lectii\vii\m2-l13\img\doua-piste.webp` (captură Audacity 4 din lecția 13; spusă ca atare: „De la lecția 13”).
- P6: `jocuri\audio-video-vii\img\clipchamp-cursor.webp` (capul de redare; captură Clipchamp a jocului, folosită și în VII/11).
- P5: `lectii\vii\m2-l15\img\generic-final.webp` (Zunter, Wikimedia Commons, domeniu public; `m2-l15\img\SURSE.json`).
- Simulatorul: `m2-l15\img\scena-1…4.webp` (CC0). Fără `img\` propriu, deci fără `img\SURSE.json` aici.

## 7. Afirmațiile (regula 7) — `afirmatii.json`: 24, toate PRELUATE din VII/13-15 (cu id-ul lor) sau din documentele profesorului (A21, grila)
- Clipchamp NU a fost pornit (aplicație din Magazin, cere cont: regulile zilei). Audacity NU a fost pornit (pagina nu cere nimic nou în el). Nicio aplicație Office. Nimic pe ecranul vizibil, fără microfon, fără cont.
- Nu există afirmație nouă despre aplicație: tot ce spune pagina despre Clipchamp a fost spus și judecat în VII/14-15 (cu aceleași cuvinte și aceleași note „la tine pot avea alt nume”).

## 8. Porțile autorului (19.10.2026)
- `test_joc.py --dir …\lectii\vii m3-l17` → **TRECUT** (26 de întrebări jucate, diacritice 64/1000; doar avertismentul așteptat „1 niveluri”). Ieșirea: `_proba\test_joc.txt`.
- `verifica_lectie.py … --fara-t1` → **0** (S0 TRECUT, S1 0 identice / 0 aproape identice, S2 aplicare/execuție 5/6, T0 0). Ieșirea: `_proba\verifica_lectie.txt`.
- `verifica_regula.py` → 0; `oracol_nota_site.py` → 0.
- Playwright cu gesturi reale (`_proba\proba_gesturi.py`, rețeaua blocată, `ctx.close()`): la 1280 px cu mouse-ul și la 390 px cu atingere (CDP), 0 erori JS, 0 depășiri de lățime; P2 (scris 8 + Verifică) acceptat; P3 pădurea trasă înaintea lacului → 2/2 teste; P4 coșul de gunoi, muzica trasă la 0:00, clic pe glisorul Volum → 3/3; P5 rândurile scrise în căsuța Text → 2/3 (al treilea cere mânerul, netras în probă); laboratorul: grila 5 criterii, alegerile 14-10-14-10-18 → „76 … nota 8 … Consolidat”, „Sunt alt elev” golește. Capturile: `_proba\tel390_P3.png`, `_proba\tel390_laborator.png` (privite). Prima rulare la 390 px s-a oprit o dată la P4 (golul nevăzut la timp: proba mergea mai departe înainte ca pagina să se fi așezat), următoarele două au trecut tot, la ambele lățimi: de urmărit la judecată.

## 9. Ce n-am putut verifica / de semnalat
- Tot ce ține de Clipchamp real (vezi §7): fapte preluate, nu reprobate.
- Ce arată lecția 16 pe disc (autorul lucrează în paralel): m-am sprijinit doar pe `vii_l16.md` (tema, numele fișierului, scenariul, propozițiile din caiet). Laboratorul pasul 11 (10 la reparația J1, 9 înainte) spune „Nu mai știi autorii? Deschide lecția 16: acolo ai descărcat fotografiile și muzica.” — l-am rugat pe autorul 16 să lase autorii lângă descărcări. **De verificat de dirijor** după ce apare VII/16.
- Mutarea unei scene prin tragere și locul unde se așază (A05): DEDUS în VII/14; lecția cere verificarea ordinii, nu promite locul.

## 10. Pentru lecția următoare / vecini
- Nicio componentă nouă. Grila de autoevaluare (codul din pagină, copiat din VII/9 și adaptat: rândul „La film:” pe criteriu, fără fișe) poate fi refolosită de orice evaluare pe produs.
- VII/18 (aplicația colaborativă) nu depinde de lecția asta.

## 11. Pentru componenta comună (proprietarul `video-clipchamp-text.js`, VII/15) — NEATINSĂ
- **Testele de text nu se reevaluează la tastare** (sonnet J1, MINOR): în căsuța Text, `camp.oninput` (rândul ~289) actualizează doar clipul și cheamă `v.avans(0)`; testele (`textContine` etc.) se bifează abia la `camp.onblur` → `scrie(...)`. Proba: `_proba\proba_reparatii.py`, litera [Q] — după tastarea rândurilor, testul „autorii muzicii” e ○; după un clic pe previzualizare, ✓ (la 1280 cu mouse și la 390 cu atingere). Ocolirea din pagina asta: „dă clic în altă parte” (formularea VII/15). O reparație în componentă (reevaluare la `input`) ar scoate nevoia frazei.

## 12. Reparațiile după judecata 1 (19.10.2026)
Registrul (19 puncte, A-S, toate REPARATE, niciunul respins): `_verificare\registru_j1.md`. Proba: `_proba\proba_reparatii.py` → `_proba\proba_reparatii_2.txt`, ultima linie **0** (1280 px mouse + taste, 390 px atingere, până la diplomă, 0 erori de consolă).
- **Laboratorul are 18 pași.** Pasul 2 e nou: filmul de echipă, cu cuvintele VII/16 („în contul cui lucrați”, „cum se cheamă fișierul”, „rolul fiecăruia”). Trimiterile din pași: 2, 7, 11, 12, 13, 14, 16 (verificate mecanic în probă, [A]).
- **Grila de autoevaluare stă ÎN pasul 14** (în lista pașilor), nu în introducerea laboratorului și nici separat pe diplomă: motorul copiază lista în fereastra mică și trimite clicurile de acolo pe butonul-pereche din pagină (`motor.js`, OGLINDA), deci grila e lângă Clipchamp. Probat în fereastra mică REALĂ (Chromium, 1280) și emulat la 390. Pe diplomă stă în „Pașii, încă o dată” (pliat). **Pentru altă lecție care refolosește grila (§10):** pune `<div data-grila-lab></div>` în textul pasului din listă care o cere, nu în `intro`.
- **Citirea reperelor pe criterii și repararea în ora 17** sunt spuse ca pregătire / propunere a lecției; întrebările 8-11 în §3.
- **P6/Î4:** granița De bază (doar ce e în film, „răspunde la «ce ai făcut?»”) / Consolidat (și pașii: ce ai apăsat și ce ai tras, pe rând) / Avansat (de ce + alternativă), cu descriptorii grilei neschimbați.
- **Telefonul:** fraza VII/15 („până la margine → Potrivește → trage din nou”) în „Cum lucrezi” și în testele 0:28 / 0:24 / Î3 (0:18).
- **API-ul simulatoarelor: neschimbat** (nicio extensie nouă; `video-clipchamp.js`, `video-clipchamp-text.js` neatinse).
- Porțile după reparații: `test_joc.py` TRECUT (doar „1 niveluri”; niciun pas peste 150 de cuvinte); `verifica_lectie.py --fara-t1` → 0 (S2 6/6, T0 0); `learninghub_date_personale.py` → 0; `verifica_regula.py` → 0; `oracol_nota_site.py` → 0. Ieșirile: `_proba\test_joc_r1.txt`, `verifica_lectie_r1.txt`, `date_personale_r1.txt`, `verifica_regula_r1.txt`, `oracol_nota_site_r1.txt`.
- `afirmatii.json`: 25 (A25 nou, preluat din VII/14 A06: numele proiectului; trimiterile la laborator renumerotate; A12 fără „pe pădure”).

## 13. Reparația 2 (19.10.2026)

Prompt: `_campaign/…/m3_19_10/prompturi/r2_vii16_17.md` (punctul **NEX**, din judecata 2 a VII/16, B). Înainte, aceeași zi: trecerea
de text T-X după judecata 2 a VII/17 (`m3_19_10/prompturi/t2_vii17.md`, `_proba/t2_*.txt`; pagina din 12:59). Registrul:
`_verificare/registru_j1.md`, secțiunea „Reparația 2 (19.10.2026)”. Copia paginii dinainte: `_proba/r2_inainte_index.html`.

- **Pasul nou 7 al laboratorului (NEX):** „Filmul e gata și exportat de la lecția 16? Mergi la pasul următor. Nu e gata (lipsește ceva
  din scenariu) sau nu l-ai exportat? Dacă profesorul nu vă spune altfel, lecția îți propune: întâi îl termini, cât mai simplu. Pui doar
  ce n-ai bifat în caiet …; ce e deja pus doar verifici (nu mai știi cum? lecția 16, laboratorul, pașii 7-13). Apoi mergi mai departe,
  iar la pasul 12 îl exporți, chiar dacă azi nu mai schimbi nimic. Nu știi dacă l-ai exportat la lecția 16? Exportă-l oricum, la pasul 12.”
  Pasul 6 nu mai presupune filmul gata („S-a deschis? Mergi la pasul următor.”); pasul 3 („Sari la pasul 7”) ajunge chiar la el;
  „Cum lucrezi” are un rând care trimite la el; intro-ul laboratorului îl numește.
- **Exportul (pasul 12):** „Ai schimbat ceva în film azi, sau nu l-ai exportat la lecția 16 (pasul 7)? Exportă-l …” și „N-ai schimbat
  nimic azi și filmul e exportat de la lecția 16? Nu mai exporta.” — un film neexportat niciodată nu mai rămâne neexportat.
- **Propozițiile de la 16** sunt acum opționale (VII/16, reparația 2): pașii 1 și 14 și „Ai nevoie de” spun „dacă le-ai scris”;
  explicația se scrie oricum la pasul 14 („sub scenariu (sau sub propozițiile de la lecția 16, dacă le-ai scris)”).
- **Renumerotarea:** laboratorul are **19 pași**; vechii 7-18 sunt 8-19. Trimiterile din pași: 2, 7, 12, 13, 14, 15, 17 + „ultimul pas”
  (verificate mecanic în `_proba/proba_reparatii.py`, [A] și [NEX]: fiecare „pasul N” există, iar 7 / 8 / 12 / 13 / 14 / 15 / 17 încep
  cu textul așteptat). Grila de autoevaluare e acum în **pasul 15**. `afirmatii.json`: câmpurile „loc” renumerotate (16 afirmații;
  `_proba/r2_renumeroteaza.py`), afirmația nouă **A26** (pasul 7, preluată din VII/16); `capturi_lipsa.json`: „unde” pus după conținut
  (golul și volumul = pasul 9, panoul textului = pasul 10; rămăseseră cu numerele de dinainte de J1). În §12, numerele 14 / 16 și
  „18 pași” sunt cele de la reparația J1 (istoric); §4 și §9 sunt aduse la numerele noi.
- **Întrebarea pentru profesor:** §3, întrebarea 12 (cât timp primește cine n-a terminat).
- **Porțile (reparația 2):** `proba_reparatii.py` → 0 (131 OK, [NEX] ×19; două rulări curate la rând) · `proba_gesturi.py` → 0 (ultima
  linie = numărul de probleme, adăugată acum) · `test_joc` → TRECUT (avertismentele de la t2) · `verifica_lectie --fara-t1` → 0 ·
  `verifica_regula` → 0 · `oracol_nota_site vii` → 0 · `learninghub_date_personale` → 0. Probele s-au schimbat doar ca să atingă
  sigur pe telefon (a doua atingere, scrisă în jurnal, când prima n-a schimbat pagina; butonul adus la mijloc când stătea sub
  insigna „Sunt elev — mă înscriu”) — **pentru componenta comună (`prezenta.js` / motorul):** pe telefon, insigna plutitoare din
  stânga-jos poate acoperi „Pasul următor →” când butonul ajunge la marginea de jos a ecranului (`_proba/tel390_exceptie.png`).
