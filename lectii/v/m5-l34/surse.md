# Lecția 34, clasa a V-a — surse, probe și ce n-am putut verifica (09.11.2026, valul C M5, cu VII/25 și VIII/25 în paralel)

**Nu e publicată, nu e în depozit (fără commit).** Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md`. Granița: `_campaign\revizuire_completa_2026_09\m5_noapte_08_11\granite\v_l34.md`.

## Programa și planul
- **Titlul, locul, tipul:** `lectii\plan.json` (nr. 34, M5, „consolidare (mini-proiect)”, 04.06.2027, `lectii/v/m5-l34/`, `lectie_v_m5_l34`); `Info_Gimnaziu_2026\data\unitati.json` (V-U6, `materiale: ["fisa_proiect", "grila_proiect"]`, `comprimabil: true`); `Proiectul_unitatii_V-U6.md`, ora 34; `Planificare_calendaristica_clasa_V.md` r. 64 (CS.3.2, CS.3.3).
- **`continuturi`:** „Modalități de reprezentare a structurilor secvențiale și alternative prin blocuri grafice” (`curriculum.json`, clasa a V-a, domeniul Algoritmi; copiat întocmai, același ca la V/32 și V/33). „Medii grafice interactive…” stă la V/31.
- **CS.3.3, descriptorii** (`Proiectul_unitatii_V-U6.md`): De bază: „creează, cu sprijin, jocuri digitale simple, utilizând operații succesive […]”; Consolidat: „independent […] decizii cu condiții de bază”; Avansat: „[…] organizând jocul în funcție de cerința dată, în contexte noi”. Lecția duce la Consolidat prin casete; partea A rămâne „Dacă mai ai timp” + grila.

## Activitatea profesorului (citată întocmai, `Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`)
„Mini-proiect pe etape anunțate: ideea și regula jocului pe hârtie, personajele și scena, mișcarea, condiția de câștig, testarea de către un coleg. Fiecare echipă își prezintă jocul.” Resursa: „laborator, fișa de proiect, grila de produs”.

Pe pagină: ideea și regula = P1 (etapa 1), caiet · personajele și scena = P2 · mișcarea = P3 · condiția de câștig = P4 · testarea de către un coleg = P5, cu fișa de 3 întrebări și cu lista pentru cine n-are coleg · prezentarea = laborator, punctul „Pregătește prezentarea” (2 rânduri în caiet; „O spui când îți cere profesorul”, ca la V/22).

Activitatea V/35: „Prezentarea jocului realizat, cu explicarea unei secvențe de cod la alegerea profesorului. Notare după grila de produs, cu punct separat pentru explicație.” De aici: **fișierul de azi NU se șterge**, iar fișa din caiet are programele în cuvinte.

- **`fisa_proiect`: NU există.** Căutat în `Info_Gimnaziu_2026` (`grep -rl "fisa_proiect\|Fișa de proiect\|fișa proiectului"`): doar mențiunile din planificări și din `unitati.json`; în `instrumente\` nu e nicio fișă de proiect. Cerințele paginii = activitatea de mai sus; n-am inventat nici punctaje, nici praguri. Vezi „Pentru profesor”.
- **`grila_proiect` = `instrumente\Grila_produs.md`**, copiată întocmai în laborator (în intro, pliată, ca la V/22; `_proba\proba_grila.py` → 0). Lăsate deoparte, ca la V/22: antetul fișei, rândul de completat, nota de subsol. P1 numește cele 5 criterii (grila se dă odată cu tema). Pagina spune de două ori că nu dă notă.

## Tabelul conținut → cerință / „Încearcă” / întrebare
| Conținut | Unde se cere | Încearcă | Întrebare |
|---|---|---|---|
| secvența în blocuri („mergi”, ordinea) | P3 + casetă | P3, atelier | Î1, Î2 |
| alternativa în blocuri („dacă … atunci”, „atinge … ?”) | P4 + casetă, laborator | P4, P5, atelier | Î2, Î5 |
| (activitatea) ideea, regula | P1 + caiet | P1 | Î3 |
| (activitatea) testarea, reparația | P5 + casetă | P5 | Î2 (reparație) |
| (activitatea) produsul rămâne | laborator | — | Î4 |

## Ce presupune lecția că știe elevul (`profil.json`) — cu bife
Mini-proiectul nu predă nimic nou (S71). Fiecare gest trimite la lecția lui:
- ✔ paleta, zona de cod, scena, steagul, Sprite1, Decor / „Alege un Decor”, muți personajul trăgându-l, „spune Salut! pentru 2 secunde” (P5, obligatoriu), salvarea, F2, ștergerea fișierului: V/31 (publicată; `granite\v_l31.md`, recitită 09:20).
- ✔ mergi, schimbi numărul, rotește-te ↻ ↺, „mergi la x 0 y: 0” (paleta arată locul de acum), „orientează-te în direcția”, x, y, Direcția, „peste marginea de jos”: V/32 (în judecată; `granite\v_l32.md`, cu SCHIMBAT 04:09; **de verificat de dirijor după publicare**).
- ✔ „când se dă click pe acest personaj”, „dacă atunci” (locașul, gura), „atinge … ?”, ▾, al doilea personaj, Sprite1 readuce programele, „Load from your computer”, „Replace contents”: V/33 (în judecată; `granite\v_l33.md`, cu SCHIMBAT 04:20 și 08:44; **de verificat de dirijor după publicare**).
- ✔ Explorer: Descărcări, Documente, F2, Decupare, Lipire, Copiere, „Înlocuire sau omitere fișiere”, „Se omite acest fișier”, stickul: V/9, V/10, V/11.
- ✔ „dacă … atunci”, condiția: V/29. Ctrl+Z nu e cerut.
- **Ce e „nou” și de ce e voie (S68):** scrii alt text în „spune” (același gest ca la număr, V/32: apeși pe câmp, scrii, Enter); două blocuri în aceeași gură („peste marginea de jos”, V/32); al treilea personaj în lista ▾ („fiindcă există, lista o are”, V/33). Niciun bloc nou. „Alege un Personaj” NU se folosește (nepredat): personajele vin din fișierul de pornire.

## Decizii (luate fără profesor; motivul)
1. **Jocul merge pe apăsări: pe pisică = un pas; steagul = o întoarcere.** Probat că e un joc cinstit: are scop, are alegere (drumul), se poate câștiga, se poate pierde, fără repetiție. Trei jocuri complete, jucate în editorul viu: `_proba\live_jocuri.py` → `live_jocuri.json`, ultima linie 0: J1 „Spre minge” (marginea = de la capăt), J2 ocolești bolovanul (13 apăsări și steaguri), J3 mingea-ușă, cu program propriu, mutată apăsând pe ea. `_proba\live_lab34.py` → `live_lab34.json`: J2 construit cu blocuri trase, ca elevul, jucat, salvat, reîncărcat, 0 eșecuri; în fișierul salvat: 0 blocuri de repetiție, variabile sau taste. **Steagul „își schimbă rolul” față de V/33 (acolo: startul); nu contrazice nimic: V/33, Î1, „Steagul pornește doar ce stă sub el”, iar P3 o spune pe față.** Alternativă respinsă: steag = start, fără alegere (pisica merge drept: nu e joc); o buclă gata făcută în fișier (cuvânt nepredat, propoziție cu excepții); tasta (nu există pe telefon, nepredată).
2. **Fișierul de pornire `pornire-34.sb3`:** Sprite1 + Minge + Bolovan (desen al autorului), fără programe. Generat de `_proba\fa_pornire.py` (ultima linie 0; meta.agent gol, 0 date personale). Elevul construiește tot: asta e proiectul.
3. **Exemplul diferă de proiect.** În pagină: jocul „Spre minge” (mingea + marginea), cu programe surori în poze (40, ↺, „Ups!”). La calculator: mingea + bolovanul, locul lor, decorul, numărul de pași, mesajul = ale elevului. Testele nu cer un text anume și primesc mingea oriunde.
4. **Telefonul:** Scratch-ul real nu e probat pe telefon pentru toate gesturile (ghidul, VIII.I), deci jocul se termină în simulator (atelierul). Pagina îi spune ce rămâne: fișa din caiet, care descrie jocul LUI (mingea și marginea, fără bolovan). Testarea de către un coleg se face în atelier, cu jocul deschis. Nimic nu se salvează (S6). La V/35: îl reface după fișă, în pagină (cuvintele V/35; „Pentru profesor”).
5. **Unde stă jocul: Documente, `<clasa ta>-prenume-joc`** (`5A-Ana-joc`; în echipă, `5A-Ana-Ion-joc`), mutat din Descărcări cu Decupare + Lipire (V/10). De ce nu Descărcări: la V/31-33 elevii șterg de acolo. V/22 a lăsat tot în Documente, cu „calculatorul” notat în caiet: același model, ca V/35 să-l poată trimite la același loc. **E-mail către sine: NU** (la a V-a nu s-a predat poșta; Gmail e la VI/13-15). Cont Scratch: NU. Stick: doar „Ai un stick?”, opțional. **Riscul e scris pe pagină** („poate dispărea”), iar drumul de rezervă e fișa din caiet. Nu știm dacă laboratoarele readuc singure calculatorul la o stare fixă: „Pentru profesor”.
6. **Durata (schimbată la R1):** etapele au minute scrise, în „Cum lucrezi” și la fiecare pas (5, 6, 6, 8, 5). La calculator, exercițiul din pagină de la Etapele 3 și 4 și atelierul sunt „doar dacă mai ai timp”: același gest apărea de trei ori. Casetele, gesturile reale, rămân. Oprirea: „Când mai sunt 10 minute din oră”, formula unică (S46), cu drumul pe butoanele reale, până la punctul **Salvează**.
7. **Fără coleg:** fișa cu 3 întrebări + lista proprie, în P5 și în laborator. Echipa: „cum spune profesorul; dacă nu spune nimic, singur”. Prezentarea: 2 rânduri în caiet, „O spui când îți cere profesorul” (nu cere profesorul).
8. **Programul de la apăsare stă sus în zona de cod, cel de la steag dedesubt (y 420):** pe telefon, ridicarea unui bloc dintr-un program lung strângea zona derulată și mutarea cădea în alt loc (proba `parcurge` 390, prima rulare). Sus, nu se derulează.
9. **`tipLoc`, un tip local al paginii:** `eveniment` nemodificat + rezolvarea automată care trage mingea (evenimente de indicator). Nu e extensie: stă în pagină.

## Probe (rezultate)
Toate în `_proba\`, cu rețeaua blocată, `ctx.close()`, ieșirile lungi în `*_out.txt`:
- `live_jocuri.py` → **0**; `live_lab34.py` → **0**; `live_capturi34.py` → **0** (editorul public, headless, fără cont, rețeaua doar spre `*.scratch.mit.edu`).
- `proba_r1.py nou` → **0**; `live_r1.py` → **0**; `durata_r1.py nou` → **0**; reparațiile: `_verificare\registru_j1.md`.
- `proba_teste.py` → **0 (45 cazuri bune)** (programe bune pe alte drumuri primite; stricate respinse; starea de pornire nu trece; soluțiile trec; harta câștigului: mingea pe 25 de locuri).
- `proba_grila.py` → **0**. `vocabular.py` → **0**. `proba_descarca.py` → **0**.
- `parcurge.py` 390 cu atingere → **0**; 1280 cu mouse → **0**; 3 stele.
- `test_joc.py` → **[TRECUT] m5-l34 · întrebări jucate: 20 · diacritice/1000: 75.0**; `verifica_lectie.py --fara-t1` → **0**.
- `learninghub_date_personale.py` → **0**. Panoul („nu e în catalog”): **0 (la start, 08.11, 23:27: 3; nu crește)**.

## Ce am descoperit la probă (intră în text)
- Clicul pe un bloc din stivă rulează TOATĂ stiva (`live_lab34.json`, `clic_pe_bloc…`), deci nu e un drum de start: după încercări pisica ajunge la start lovind bolovanul sau câștigând. P3 o spune („la etapa 4 sare singură la start”).
- La „spune … pentru 2 secunde”, o apăsare cât vorbește îl ia de la capăt; la sfârșit tot la start ajunge (`j1_grabit`). Steagul cât vorbește oprește mesajul, iar pisica rămâne acolo (`j1_steag_cat_vorbeste`). De aceea caseta spune „Cât vorbește, nu apăsa”; nu e o greșeală gravă.
- Bolovanul la x 80: la primul pas (x 50) îl atinge și sare la start (`j2_drept_in_bolovan`). Măsurat la R1 (`live_r1.json`): pe același rând, la 40, 50, 60 de pași nu se atinge de la x 140; la x 170 între ei încape o pisică (gol 97, pisica 94; la x 150, gol 77). De aici P2: „între ei să încapă încă o pisică”.
- „dacă” gol, lăsat chiar sub pălărie, înghite „mergi”, iar pisica nu pleacă; „mergi” tras afară, deasupra lui „dacă”, repară (`live_r1.json`, G_*). De aici „Nu iese?” și caseta Etapei 4.
- Fișierul salvat ține pisica unde a rămas (J1, la reîncărcare: x 50, y −50, Direcția 180).
- Balonul stă, în Scratch, deasupra mingii (`live\r1_h_balon.png`); în pagină, mingea îl poate acoperi: nota simulatorului o spune.
- La încărcare, Sprite1 selectat, zona de cod goală, fără întrebare (`dupa_load`). Decorul nu schimbă selecția (`dupa_decor`). Mingea trasă o selectează pe ea (`dupa_tras_minge`), Sprite1 revine (`dupa_dala`).
- Salvarea propune `pornire-34.sb3`, deci în Descărcări va fi „pornire-34 (1)”, ca la V/33: „cu ora de acum”. Reîncărcat: tot jocul e acolo (`reincarcat`).

## Socoteala duratei (`_proba\vocabular.py`, 110 cuv./min, gesturi cu elevul lent, valorile judecătorului V/33)
**Socoteala autorului, pe drumul de calculator de după R1 (`vocabular.py`): 43,9 min (înainte: 47,7).** Socotelile judecătorilor (`durata_r1.py`): opus 49,5 → **45,1**; opus, cu scrisul la 15 cuv./min și decorul în 60 s, 52,0 → **47,6**; sonnet, cu gesturile lui, 57,2-67,2 → **49,2-59,2**. Regula de câștig e pusă la minutul 24,5-31, deci înainte de semnalul de la 40. După semnal: 10,6 min, fără prezentare. Capătul de sus al socotelii sonnet rămâne peste 50: drumul de 10 minute și lecția 35 îl acoperă. Fără exercițiile de la Etapele 3 și 4 și fără atelier, la calculator elevul exersează în Scratch-ul adevărat; rezultatul lui nu e verificat de teste decât la „Nu iese?” și la testarea de către un coleg. **De cronometrat la clasă:** tot drumul, mai ales caietul și testarea cu un coleg.

## Pentru lecția următoare (V/35 „Evaluare sumativă: joc digital (produs + explicație)”)
- **Ce rămâne la elev:** în `Documente`, fișierul `<clasa ta>-prenume-joc.sb3` (poate neterminat; pisica stă unde a rămas la salvare, nu neapărat la start). În caiet: fișa jocului (cele 4 rânduri, numele fișierului, calculatorul, programele în cuvinte), de obicei 2 rânduri de prezentare (lipsesc la cine a plecat de la semnalul de 10 minute), răspunsurile la testare. N-a deschis Scratch: doar fișa. Pe telefon: fișa, cu mingea și marginea, fără bolovan; îl reface în pagină.
- **Cum îl deschide:** `Fișier › Load from your computer`, `Documente`, numele lui (V/33). Probat: reîncărcat din fișierul salvat, jocul e întreg.
- **Dacă fișierul a dispărut:** îl reface după fișă, din `lectii/v/m5-l34/pornire-34.sb3`; nu se știe cât durează la clasă.
- **Ce va explica elevul:** „o secvență de cod la alegerea profesorului”; candidatele firești sunt regula de câștig (dacă, locașul, gura, mesajul, startul) și perechea de programe (apăsare / steag).
- **Grila:** aceleași cuvinte. Îl lași să-l termine „cât mai simplu” la început (IV.2 §8): pagina V/34 o promite prudent, „dacă profesorul nu vă spune altfel”.
- **Extensii:** nu am scris niciuna. `scratch-evenimente.js` 1.0, neschimbat.

## Pentru componenta comună (`lectii\_sim\scratch-evenimente.js`; nu l-am atins)
- Mingea (`z-index:1`) acoperă balonul pisicii când pisica vorbește chiar sub minge (se vede în atelier, captura de telefon): în Scratch, balonul e deasupra (`_proba\live\r1_h_balon.png`). Mărunt: nu dă un verdict fals; nota din pagină o spune. Reparația, la proprietar: balonul deasupra mingii.
- „dacă” lăsat chiar sub pălărie: în Scratch înghite ce e sub el (`if[movesteps]`, pisica nu mai merge); în simulator rămâne deasupra lui „mergi”. Lecția o spune la casetă și la „Nu iese?”. La proprietar: abaterea, în capul fișierului, și, de dorit, același comportament.
- Mingea are 31 px la 390 (12,5% din scenă): pagina pune `min-width:32px`. La proprietar: un minim comun.
- Nu există un `seteazaMinge`: rezolvarea automată a lui P2 trage mingea cu evenimente de indicator (`tipLoc`, în pagină).

## Contradicții găsite
- `Proiectul_unitatii_V-U6.md` are descriptorul Avansat al CS.3.3 lipit de alt text („jocuri digitale Medii grafice interactive - elemente…”, greșeală de tipar în sursă). Nu l-am citat pe pagină.
- `curriculum.json` lipește „Structura alternativă (decizională)Medii grafice interactive”: nu e al meu (V/31 l-a declarat așa).

## Pentru profesor
1. **Fișa de proiect (`fisa_proiect`) lipsește.** Pagina folosește doar activitatea și grila. Aveți alte cerințe (câte personaje, ce fel de joc)? Se adaugă în P1 și în laborator.
2. **Jocul e pe apăsări, cu steagul pentru întoarcere** (decizia 1), ca să nu intre repetiția (nepredată). Dacă vreți pisica mergând singură, e nevoie de o lecție în plus sau de o buclă gata făcută în fișier, spusă cinstit.
3. **Personajele vin din fișier** (pisică, minge, bolovan). „Alege un Personaj” nu s-a predat la V/31-33. Vreți să-l lăsați liber? E o propoziție în P2 și o probă.
4. **Unde stă jocul până la lecția 35:** `Documente`, cu numele elevului. Calculatoarele din laborator se curăță singure (program care le readuce la o stare fixă)? Dacă da, jocul se pierde: atunci stick sau refacere după fișă (cam cât? nemăsurat).
5. **Telefon (Dumbrava):** jocul se face în pagină și nu se păstrează. La lecția 35: îl refac după fișă, în pagină, dacă nu spuneți altfel (așa scrie V/35).
6. **Echipa:** pagina spune „cum spune profesorul; dacă nu spune nimic, singur”, ca să nu pierdem elevul singur. Notarea pe elev, la echipă, e la lecția 35.
7. **Prezentarea („Fiecare echipă își prezintă jocul”):** pagina lasă 2 rânduri în caiet și „O spui când îți cere profesorul”. Dacă vreți prezentarea azi, nu mai încape (lecția e plină).
8. **Terminarea la lecția 35:** pagina scrie „îl termini cât mai simplu la începutul lecției 35, dacă profesorul nu vă spune altfel”.
9. **Fișierul de pornire** conține pisica, sunetele și decorul din editorul Scratch (ca orice proiect salvat), plus două desene ale autorului. Permisiunea de a da fișierul de pe sit nu e citită (aceeași întrebare ca la V/33).

## Atenție pentru judecător
Vezi răspunsul final, `atentie_judecator`. Pe scurt: steagul ca întoarcere; P1 are o alegere (recunoaștere) și e singurul „Încearcă” fără simulator; `tipLoc`; testele cu căutarea drumului (`cauta`); „poate dispărea”.

## Reguli verificate pe lecție
1, 2 (plafoane: `vocabular.py`), 3, 4, 5 (aplicare: `verifica_lectie` S2), 7 (`afirmatii.json`), 9 (toate programele vs Scratch viu), 10 (casete P2-P5 + laborator), 15, 20, 23 (nimic salvat de pagină; ce rămâne e al elevului, cu numele lui), 24, 26, 27, 28-33, 35, 37, 38.
