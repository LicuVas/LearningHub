# Lecția 35, clasa a V-a — surse, probe și ce n-am putut verifica (09.11.2026, valul D M5)

**Nu e publicată, nu e în depozit (fără commit).** Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md`. Granița: `_campaign\revizuire_completa_2026_09\m5_noapte_08_11\granite\v_l35.md`.

## Programa și planul
- **Titlul, locul, tipul:** `lectii\plan.json` (nr. 35, M5, „evaluare sumativă”, 11.06.2027, `lectii/v/m5-l35/`, `lectie_v_m5_l35`); `Proiectul_unitatii_V-U6.md`, ora 35 (materiale: `test_unitate, barem`).
- **`continuturi`:** „Modalități de reprezentare a structurilor secvențiale și alternative prin blocuri grafice” (`curriculum.json`, copiat întocmai, ca la V/32-34).
- **CS.3.2, CS.3.3:** descriptorii din `Proiectul_unitatii_V-U6.md`; nu-i copiez pe pagină: pagina folosește cuvintele grilei.

## Activitatea profesorului (citată întocmai, `Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`)
„Prezentarea jocului realizat, cu explicarea unei secvențe de cod la alegerea profesorului. Notare după grila de produs, cu punct separat pentru explicație.” Resursa: „produsele elevilor, grila de produs”.

Pe pagină: **prezentarea** = laborator, punctele „Spune explicația” și „Prezentarea” (o cere profesorul, nu elevul). **Explicarea unei secvențe** = P5 + P6, exersate pe alt joc, + atelierul; fișa „Ce spun la prezentare” (P6). **„la alegerea profesorului”:** laboratorul („Ți-a spus profesorul care? Aceea. N-a ales sau e la altă clasă? Regula ta de câștig”), iar P5 cere să citească o dată și perechea apăsare / steag. **Grila de produs** = P4 + laborator, întocmai (`_proba\proba_grila.py` → 0). **Punct separat** = criteriul 4 notat separat: „Așa citim noi”, marcat pe pagină (vezi „Pentru profesor” 1).

- **`test_unitate`, `barem`:** nu există pentru V-U6 (`teste_sumative.json` are doar V-U1). Activitatea cere însă notarea pe grilă, deci **n-am făcut probă de antrenament C/B/A**: decizia 1.
- **`SISTEM_EVALUARE.md`:** trimite la `instrumente/Grila_produs.md` pentru produse (r. 253). Nu spune nimic despre „punct separat”.

## Tabelul conținut → cerință / „Încearcă” / întrebare
| Conținut / activitate | Unde se cere | Încearcă | Întrebare |
|---|---|---|---|
| secvența în blocuri (ordinea) | P5, P6, laborator | P5, atelier (2) | Î3 |
| alternativa în blocuri („dacă”, „atinge … ?”, gura) | P3, P5, P6 | P3, P6, atelier (1, 3) | Î3, Î5 |
| (activitatea) produsul | P2, P3, laborator | P2, P3 | Î2 |
| (activitatea) explicarea unei secvențe | P5, P6, fișa, laborator | P5, P6, atelier | Î3, Î5 |
| (activitatea) grila, explicația separat | P4, laborator | P4 | Î1, Î4 |

## Sarcina → lecția și pasul unde a fost predată (S70)
| Sarcina | Predat la |
|---|---|
| Fișier › Load from your computer, Deschidere, Replace contents | V/33 (P „Load”, laborator); V/34, Etapa 2 |
| Documente, F2, Decupare, Lipire, „Înlocuire sau omitere fișiere” | V/9, V/10, V/11; V/34, laborator |
| Fișier › Salvează pe calculatorul tău, Descărcări | V/31 |
| cele două programe (apăsare, steag) | V/33; V/34, Etapa 3 |
| „dacă”, locaș, gură, „atinge Minge?”, „spune”, „mergi la” în gură | V/33; V/34, Etapa 4 |
| tragi în paletă un bloc (îl scoți) | V/31, V/32, V/33 |
| fișa jocului | V/34, Etapa 1 + laborator |
| grila, „Nota = punctaj : 10”, rotunjirea | V/1 (P8, P10), V/22, V/23; V/34 (criteriile) |

## Ce presupune lecția că știe elevul (`profil.json`), cu bife
- ✔ V/31 și V/32, publicate (`granite\v_l31.md`, `v_l32.md`). ✔ V/33 și V/34: **în judecată la scriere**: am lucrat după granițele lor (`v_l33.md` cu SCHIMBAT 04:20, 08:44; `v_l34.md` cu SCHIMBAT 10:43, citite 11:58) și după paginile de pe disc; **de verificat de dirijor după publicarea lor** (numele „5A-Ana-joc”, „Documente”, „etapele 3 și 4”, „Apare Înlocuire sau omitere”).
- Ce e „nou” și de ce e voie: citești un program cu voce tare; scoți un bloc ca să vezi (gestul de tragere în paletă e știut); numele cu `-final` (același F2); „secvență”, spus pe loc în P5.

## Decizii (luate fără profesor; motivul)
1. **Fără probă de antrenament cu puncte.** La V/17, V/23, VI/26 lipsea testul, iar activitatea cerea o probă. Aici activitatea spune limpede cum se notează: grila de produs, pe jocul lui. O probă C/B/A ar fi pus lângă grilă o a doua notă, inventată. Testele din pagină sunt fără puncte. Elevul se autoevaluează în caiet, fără punctaj și fără notă: alege doar De bază / Consolidat / Avansat (`Grila_produs.md`, întocmai; prompt: „să se autoevalueze fără notă”). **Am respins:** calculatorul de notă din VII/17: ar arăta o notă pentru jocul lui, iar prompt-ul spune că pagina nu dă nota jocului.
2. **„Punct separat” = criteriul 4 notat separat de joc,** fără punctaj inventat; pe pagină „Așa citim noi”; „Dacă profesorul spune altfel, ține-te de ce spune el”.
3. **Explicația se exersează pe alt joc.** Poza din P5: jocul Anei (mergi 60, Gol!). Exercițiile: jocul lui Ion (mergi 50, Bravo!). Atelierul: alt program (marginea întâi, Ups!, Am ajuns!, mingea sus). Niciunul nu e jocul V/34 cu Bolovan. Răspunsurile vin din editorul viu (`live_v35.json`).
4. **Atelierul = tip local `explica` (în pagină, nu extensie):** tipul `eveniment` + 4 alegeri, cu teste numite. Simulatorul rămâne viu sub ele: elevul poate scoate un bloc ca să vadă. Testul „Jocul e întreg” îl pune să-l aducă la loc. Scrisul liber nu se notează și nu există în pagină: caietul (pagina o spune, în P6 și la laborator).
5. **Pe P3 (Îl termini), Încearcă = jocul de la zero,** ca telefonul să aibă unde să-l refacă. Cine are jocul întreg apasă „Pasul următor” (merge fără rezolvat, `proba_gesturi.json`), iar textul o spune. **Jocul din pagină NU rămâne când pleci de pe pas** (`p2_program_dupa_intoarcere`: 0; `proba_r1.py`, D4). **R1:** elevul o află înainte (P2 și P3, nu în laborator); pe telefon îl face o dată, rămâne pe pas până îl vede profesorul, iar dacă profesorul nu poate veni îi arată fișa din caiet când e chemat: nu-l reface a doua oară. La calculator, exercițiul e doar dacă mai are timp (o singură instrucțiune: jocul se face în Scratch).
6. **Salvarea finală: alt nume, `<clasa ta>-prenume-joc-final`, în Documente; jocul vechi rămâne.** După încărcare, Scratch propune numele vechi (probat); în Descărcări nu e conflict, în Documente ar fi. Un nume nou evită „Înlocuire” peste fișierul de la lecția 34 (S85, regula 26). **R1:** numele final se scrie ÎNTREG, pe orice ramură (și pornit din `pornire-34`: Scratch ar propune `pornire-34`), ca exemplu complet (`5A-Ana-joc-final`; în echipă `5A-Ana-Ion-joc-final`), cu `-final` înaintea lui `.sb3`; „există deja” → Nu (sau Anulare) și o cifră după `final` (`5A-Ana-joc-final2`). În caiet: numele final și calculatorul.
7. **Fișierele nu se șterg la sfârșit:** V/36 cere „o dovadă din portofoliu”. Se șterge doar `pornire-34`, dacă a fost descărcat azi. Pagina nu numește portofoliul (e al lecției 36): „sunt dovada muncii tale”.
8. **`pornire-34.sb3`, copie identică a celui de la V/34** (același SHA-1), ca lecția să nu depindă de ordinea publicării (ghid, IV.3 nr. 4). `fisier-load.webp`: copie din V/33, la fel.
9. **Fotografia din P1:** panou de concurs școlar, Commons, CC BY-SA 3.0, decupată ca să iasă persoanele, mărcile și fișa cu nume din colț.
10. **Prezentarea nu intră în cele 50 de minute ale elevului:** o conduce profesorul; elevul e chemat și revine („apoi reiei de unde ai rămas”). Vezi „Pentru profesor” 3.

## Probe (rezultate)
Toate în `_proba\`, cu rețeaua blocată, `ctx.close()`, ieșirile lungi în `*_out.txt`:
- `live_v35.py` → **0** (editorul public, headless, fără cont): încărcare, numele propus, „Replace contents” (OK / Anulare), selecția după încărcare, 23 de programe jucate cu clicuri reale. `viu_variante.json` = rândurile.
- `live_final.py` → **0:** jocul neterminat, încărcat, terminat cu blocuri trase, jucat, salvat, redenumit `-final`, reîncărcat, câștigat. 0 blocuri de repetiție, variabile, taste.
- `proba_sim_viu.py` → **0** (57 de rânduri, 23 de programe: simulatorul = editorul viu). Oracol independent de pagină: rândurile vin din editor.
- `proba_teste.py` → **0** (programe bune pe alte drumuri primite; stricate respinse; alegeri greșite respinse; socotelile de notă).
- `proba_gesturi.py` → **0**. `proba_grila.py` → **0**. `proba_descarca.py` → **0**. `vocabular.py` → **0**.
- `parcurge.py` 390 cu atingere → **0** (3 stele); 1280 cu mouse → **0** (3 stele).
- `test_joc.py` → **[TRECUT] m5-l35 · întrebări jucate: 20 · diacritice/1000: 76.0**; `verifica_lectie.py --fara-t1` → **0** (S1 0 identice; S2 aplicare/execuție 5 din 6; T0 0).
- `oracol_nota_site.py` → **0**. `verifica_regula.py` → **0 pe lecția asta** (ultima linie a scriptului = 3: toate trei în `lectii\v\m5-l36\index.html`, lecția altui autor, cuvântul „portofoliu” din activitatea profesorului; nu sunt ale mele și nu le-am atins).
- `learninghub_date_personale.py` → **0**. Panoul („nu e în catalog”): **2 la 12:47 (0 la 11:55, când am pornit)**; toate probele mele au rețeaua blocată; e oră de școală, deci pot fi elevi reali; pragul contractului (3) nu e depășit (la start, 08.11, 23:27: 3; nu crește).

## Ce am descoperit la probă (intră în text)
- La mingea peste pisică, apăsarea nimerește mingea, iar programul pisicii nu pornește (`b_at_daca_deasupra`, a 3-a apăsare; și în pagină e la fel). Nu l-am pus în exerciții: nu e ceva de explicat azi. Exercițiile se opresc înainte.
- „dacă” deasupra lui „mergi”: la apăsarea cu mesajul pisica ajunge la start, apoi „mergi” o duce înapoi (x 60), deci nici la start nu rămâne (`b_daca_deasupra`). Atelierul întreabă doar de ce stă „mergi” deasupra.
- „mergi la” deasupra lui „spune”: sare, apoi vorbește la start (`b_ordine_gura`, `b_i3_ordine_margine`). Î3.
- Fără pălărie, apăsarea pe pisică nu pornește nimic (`b_fara_palarie`). Nefolosit în exerciții: scoaterea pălăriei ia toată stiva.
- Salvat cu Minge selectată, jocul se reîncarcă tot cu Sprite1 (`a4`).

## Socoteala duratei (`_proba\vocabular.py`, 110 cuv./min, gesturi cu elevul lent, valorile judecătorului V/33)
**R1 (09.11, după judecata 1), cu socoteala judecătorului opus rulată neschimbată (`_proba\durata_r1.py`, copia lui `_verificare\j1_a_durata.py`; ieșirile `durata_r1_inainte_out.txt`, `durata_r1_nou_out.txt`):** cuvinte pe drumul obligatoriu 2817 → **2813**; ramurile, elev lent, 110 cuv./min: jocul gata 45,3 → **45,2** · neterminat, regula în Scratch 47,0 → **46,9** · fișier pierdut, refăcut în Scratch 48,6 → **48,6** (înainte, textul îl trimitea să-l facă și în pagină: 51,2; acum exercițiul din pagină e „doar dacă mai ai timp”: 51,1 numai pentru cine alege să-l facă) · telefon: **41,9**. „Cum lucrezi” spune minutele pe etape (5 · cel mult 10 · 4 · 4 + 3 · 5 · 13 · 5). După „Când mai sunt 10 minute”: 9,8 min de gesturi și întrebări (fără cititul punctelor; cu el, ~12): ordinea punctelor salvează întâi fișierul și face curățenia înainte de întrebări. La 80 cuv./min (S39): 54,4-57,8. **De cronometrat la clasă.**

Socoteala autorului (dinainte de R1): **2683 de cuvinte pe drumul obligatoriu (24,4 min de citit) + 20,9 min de gesturi = 45,3 min** (rândurile, în `vocabular.py`). Elevul lent de pe ramura „îl termin întâi”: regula de câștig în Scratch (P3), plus jocul de la zero în pagină. Pliabilele „Pe telefon” și „Dacă mai ai timp” nu sunt numărate; grila (pliată, dar de citit o dată) e numărată. Cine a pierdut fișierul reface și programele în Scratch: cam 2 minute în plus, după aceleași valori (descărcare, încărcare, 2 programe × 1,3), deci tot sub 50; iar „Când mai sunt 10 minute din oră” îl duce la Salvarea finală. **De cronometrat la clasă:** caietul (fișa, 2,5 min în socoteală), rostirea explicației (1 min).

## Reparațiile după judecata 1 (09.11.2026, R1)
Registrul: `_verificare\registru_j1.md` (31 de puncte: 28 opus + 3 doar sonnet; 31 reparate, 0 respinse). Copia dinainte: `_proba\inainte_r1\`. Reparațiile: `_proba\fa_r1.py`, `fa_r1b.py`, `fa_r1c.py` (pe bytes, CRLF). Proba pe punct: `_proba\proba_r1.py nou|inainte` (56 de verificări; pe versiunea dinainte pică 46, acum 0). Durata: `_proba\durata_r1.py`. Plafonul căutării: `_proba\plafon_r1.py`.
- **Căutarea „Se poate câștiga”** (opus S, sonnet 9): plafonul V/34 (6000) nu ajungea pentru programe corecte cu pas mic sau rotire mică (măsurat: cu 6000, `5/90` respins pe 11 din 26 de locuri ale mingii, `1/90` pe 24, `10/15` pe 19; cu 20000, tot respinse). Când căutarea ajunge la plafon fără să fi încercat tot, pagina pune pisica la un pas de minge și apasă o dată; dacă nu vorbește, încearcă și cu mingea mutată spre mijloc cu 25 și cu 45 de puncte (lângă margine, o regulă de margine pusă deasupra ar sări întâi; J2, AF); respinge doar ce nu vorbește nici așa. Ce chiar nu se poate (rotire 180, mingea în afara dreptei) termină căutarea și rămâne respins. Mesajul: cuvintele V/34 („Pagina n-a găsit…”) + „și 90 la „rotește-te””. Timpul, la procesor ×4: până la ~1,1 s pe programe corecte cu pas și rotire mici și ~2,2 s pe cele greșite, cu „spune” în afara gurii (J2, `_verificare\j2_a.json`, mașina încărcată); pagina nu se blochează.
- **Testele noi de la V/34** (opus F, L, R): mesajul START cu „dacă deasupra lui mergi”; `MESAJ` (balon gol), `ORDINE` (întâi vorbește, apoi sare), `DEPARTE` (mingea nu e lipită de pisică), cu aceleași cuvinte ca V/34; `ORDINE` și la Î5.
- **Ce n-am putut proba:** ferestrele Windows și ale browserului la salvare (dacă `.sb3` rămâne la coadă când numele se scrie întreg): pagina spune doar „`.sb3`, dacă se vede, rămâne la coadă”; afirmația A33, `nesigur`.

## Pentru lecția următoare (V/36 „Recapitulare finală. Unde am ajuns pe cele trei niveluri și ce urmează”)
- **Ce rămâne la elev, în `Documente`:** `<clasa ta>-prenume-joc` (V/34) și `<clasa ta>-prenume-joc-final` (azi; poate cu o cifră după `final`, dacă numele era luat). **În caiet:** fișa jocului (V/34), numele fișierului final și calculatorul (R1: calculatorul poate fi altul decât la V/34), fișa „Ce spun la prezentare” (R1: are și rândul „De unde sunt personajele și decorul”), autoevaluarea pe cele 5 criterii, fiecare cu un motiv. Pe telefon: doar caietul.
- **Ce poate fi „dovadă din portofoliu”:** fișierul final, fișa, autoevaluarea. V/35 nu folosește cuvintele „portofoliu” și „fișa de niveluri”: sunt ale tale.
- **Calculatorul comun:** fișierele pot dispărea între ore, ca la V/34. Fișa din caiet e dovada care rămâne sigur.
- **Extensii:** niciuna. `tipExplica` stă în pagină.

## Pentru componenta comună (nu am atins nimic)
- `scratch.js`, la 390: defectul cunoscut (căsuța de 21,8 px, „Anulează”) rămâne: lecția nu cere „Anulează” pe telefon, iar la P3 elevul scrie 3 numere + mesajul ca la V/34, pe același drum.
- **R1 (sonnet 3, măsurat de judecător, `_verificare\ab_sonnet\s_tinte390.py`):** la 390 px, căsuțele de număr și locașurile `.ss-pill` / `.ss-golb` au 27,2 × 21,8 px, meniul ▾ 21,8 px înălțime, mingea (`scratch-evenimente.js`) 31 × 31 px: sub 32 px (regula 20). Nu blochează (atingerile reale trec, cu abatere de ±12 px). **Propunere pentru proprietar:** la `(pointer:coarse)`, `min-height: 32px` pe `.ss-pill` / `.ss-golb` / ▾ și mingea de 36 px. **Ocolul lecției (nu am atins componenta):** la P3, singurul exercițiu de la zero pe telefon, testul „Se poate câștiga” primește acum și numerele din paletă (mergi 10, rotește-te 15; `proba_r1.py`, AD2, S1), iar enunțul spune „Pe telefon, la „mergi” și „rotește-te” poți lăsa numerele din paletă”; mingea poate rămâne pe loc („o lași sau o tragi”); pliabilele paginii au 44 px (CSS-ul paginii, `details.verif>summary`).
- `scratch-evenimente.js`: `alegere` e una singură pe exercițiu; atelierul avea nevoie de 4, de aceea `tipExplica` stă în pagină.

## Contradicții găsite
- `Proiectul_unitatii_V-U6.md`: materialele orei 35 sunt „test_unitate, barem”, iar activitatea: „Notare după grila de produs”. Am urmat activitatea (scheletul lecției). „Pentru profesor” 2.
- `Proiectul_unitatii_V-U6.md`: descriptorul Avansat al CS.3.3 are text lipit din greșeală (semnalat și la V/34). Nu-l citez.

## Pentru profesor
1. **„Cu punct separat pentru explicație”: cum notați?** În documente, explicația e criteriul 4 din grilă. Pagina scrie: „Așa citim noi: criteriul 4 se notează separat de joc, după ce te ascultă; un joc bun nu-ți dă singur punctele de la explicație.” Dacă e un punct în plus, alt punctaj sau altceva: e o singură propoziție de schimbat. Nu am inventat niciun punctaj.
2. **`test_unitate` și `barem` (V-U6) nu există.** Rămâne notarea pe grilă, cum spune activitatea? Dacă aveți un test scris, pagina se poate potrivi.
3. **Prezentarea: câți elevi pe oră?** Pagina presupune că îi chemați pe rând, cât ceilalți lucrează. Cu 20 de elevi × 2 minute, ora se umple. Nu ți se cere azi: „explicația rămâne în caiet”. Prezentarea continuă la ora 36?
4. **Jocul refăcut (fișier dispărut, telefon):** îl notați la fel? Pagina scrie doar: „Cum socotește un joc refăcut îți spune profesorul”. **Terminarea** „cât mai simplu”: pagina dă cel mult 10 minute; vreți altceva? (promis de V/34: „dacă profesorul nu vă spune altfel”).
5. **Telefon (Dumbrava):** jocul refăcut în pagină nu rămâne când elevul pleacă de pe pas. **R1:** pagina îi spune să-l facă o dată, la pasul 3, să ridice mâna și să rămână pe pas până îl vedeți; dacă nu puteți veni atunci, vă arată fișa din caiet când îl chemați (nu-l reface a doua oară). Ajunge fișa din caiet + jocul văzut la pas? Cât așteaptă elevul pe pas, cu 20 de elevi?
6. **E lucrarea de modul pentru M5?** Atunci, nota din catalog = 80 % lucrarea + punctele de pe LearningHub (`SISTEM_EVALUARE.md` §4.5). Pagina nu pomenește regula. Tot aici: nota de modul vine de la V/30 sau de la V/35?
7. **Echipa:** V/34 lasă „în echipă, ambele prenume”. Grila e pe elev: la V/35, fiecare își scrie fișa și își spune explicația; pagina nu separă notarea (o face dumneavoastră). Vreți o propoziție anume?
8. **Calculatoarele din laborator se curăță singure?** Întrebarea de la V/34 rămâne: dacă da, jocul se pierde, iar ramura „A dispărut” devine drumul obișnuit.
9. **(R1) „Așa citim noi grila, la jocul tău”:** sub grilă, pagina arată cum arată bine fiecare criteriu pe jocul lui: 1. cele două programe și regula de câștig; 2. merg, puse de el; 3. programe ordonate, fișierul cu numele cerut; 4. explică o secvență; 5. spune de unde sunt personajele (proiectul de pornire) și decorul (Scratch); „Dacă profesorul spune altfel, ține-te de ce spune el”. E citirea noastră, nu a dumneavoastră: o schimbați?

## Atenție pentru judecător
Vezi răspunsul final, `atentie_judecator`. Pe scurt: fără probă C/B/A; „punct separat”; tipul local `explica`; P3 cu jocul de la zero; autoevaluarea fără puncte; numele `-final`.

## Reguli verificate pe lecție
1, 2 (plafoane: `vocabular.py`), 3, 4, 5 (`verifica_lectie` S2), 7 (`afirmatii.json`), 9 (`proba_sim_viu.py`), 10 (casete P2, P3, P5 + laborator), 15, 20, 23 (nimic salvat de pagină), 24, 26, 27, 28-33, 35, 37, 38.
