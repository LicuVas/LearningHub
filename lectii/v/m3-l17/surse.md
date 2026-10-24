# Lecția 17, clasa a V-a — surse, probe și ce n-am putut verifica (noaptea 23→24.10.2026, valul M3)

„Evaluare sumativă: Internet și documentare” (evaluare sumativă, vineri 22.01.2027 la 5AM/5M). Nu se predă nimic nou: pagina pregătește proba practică a unității și dă o probă de antrenament cu punctaj.

## Programa și planul
- `Info_Gimnaziu_2026\planificari\Calendar_ore_5AM_5M.md`, lecția 17, M3: „Evaluare sumativă: Internet și documentare”, „evaluare sumativă”.
- `Proiectul_unitatii_V-U3.md`: ora 17, „evaluare sumativă”, materiale „test_unitate, barem”; CS.1.3 „Utilizarea eficientă şi în siguranță a Internetului ca sursă de documentare”.
- Conținuturile declarate (din `curriculum.json`, aceleași ca la lecțiile 13-16): Servicii ale rețelei Internet · Serviciul World Wide Web: (navigarea, căutarea cu motoare de căutare, salvarea informațiilor) · Drepturi de autor · Siguranța pe Internet.
- **Descriptorii (citați din proiectul unității, folosiți pentru părțile probei):**
  - **De bază (C)** — „Elevul utilizează, cu sprijin, serviciul World Wide Web pentru a naviga și a salva informații de pe Internet, în pași ghidați, în contexte familiare” → C1-C3: pașii dați, ursul brun (lumea lecțiilor 14-15), navigare + salvare + serviciile.
  - **Consolidat (B)** — „Elevul utilizează, independent, serviciul World Wide Web pentru a naviga, a căuta și a salva informații de pe Internet, în contexte familiare” → B1-B2: fără pași, căutarea și păstrarea cu sursa, tot ursul brun.
  - **Avansat (A)** — „Elevul utilizează, independent, serviciul World Wide Web pentru a naviga, a căuta și a salva informații din surse multiple de pe Internet, în formatul cerut, respectând regulile privind siguranța online și drepturile de autor, în contexte noi” → A1-A2: tema nouă (vulpea), două surse comparate, capcana, autorul și data, explicația.

## Documentele profesorului (au prioritate)
- **Activitatea orei** (`Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`): „Probă practică: găsirea a trei informații despre o temă dată, salvarea lor cu sursă și justificarea alegerii surselor. Cerințe pe cele trei niveluri.” Resurse: „test practic de unitate, barem pe niveluri”. → Pagina, proba și laboratorul au exact forma asta (trei informații, sursa fiecăreia, explicația).
- **Testul și baremul V-U3 NU există**: `materiale\continut\teste_sumative.json` are doar V-U1; `materiale\print\` are doar `Test_V-U1` și `Test_BAREM_V-U1`; `materiale\pregatire\Pregatire_toate.html` are, la V-U3, fișe de pregătire pentru profesor („nu se dă elevilor”), nu un test. → Decizia 4 a dirijorului (noaptea 23→24.10): pagina descrie tipul sarcinilor și dă o **probă de antrenament** C 40 / B 30 / A 20 + 10 din oficiu, nota = punctaj : 10; punctele pe cerințe sunt ale paginii și o spune („nu intră în catalog”, „cerințele și punctele lor sunt ale paginii”).
- Notarea: `SISTEM_EVALUARE.md` §4.1-4.3, `_campaign\notare_punctaj_2026_09_29\REGULA_NOUA.md`; la clasa a V-a, cu vorbele lecției 1 (pașii 8 „Lucrarea: trei părți și nota ta”, 9 „Munca ta pe LearningHub intră în notă”, 10 „Din notă afli nivelul”). Oracolele: `verifica_regula.py` → 0, `oracol_nota_site.py` → 0 (`_proba\verifica_regula.txt`, `_proba\oracol_nota_site.txt`).
- Fișa de pregătire V-U3 („Evaluarea surselor”: „ordinea rezultatelor NU e ordinea adevărului”; „Drepturi de autor și creditarea informației”): aceleași idei în P5, A2, Î4, Î5.

### Pentru profesor (întrebări, nu le-am ghicit)
1. **Testul practic și baremul V-U3** nu există încă. Proba de antrenament din pagină are 7 cerințe (C1 serviciile 8 p, C2 navigarea cu pașii dați 16 p, C3 salvarea unei fotografii + autorul și licența 16 p, B1 căutarea 16 p, B2 o propoziție + sursa 14 p, A1 două surse + capcana + autorul și data 12 p, A2 explicația 8 p). Dacă testul dumneavoastră va avea altă formă (de exemplu, totul în caiet sau într-un document), pagina se poate potrivi după el.
2. **Unde păstrează elevul informațiile la lucrare**: în caiet, în Notepad sau într-un document? Pagina folosește Notepad la B2 (ca lecția 15) și caietul în laborator (ca lecția 16).
3. **Tema „dată”**: laboratorul folosește pinguinul imperial (Wikipedia RO are răspunsul în primul paragraf). Dacă la lucrare dați altă temă, laboratorul rămâne antrenament.
4. **B1 e acum pe ALEGERE (reparația 3, 24.10.2026).** Elevul caută singur și deschide o pagină bună, ca înainte (căutarea 5 p, pagina 5 p, verificate la fel). Apoi alege, sub browser, dintre 4 variante, ce spune pagina despre ursul brun iarna (6 p): una adevărată, cu cuvintele paginii, și trei false (anotimpul pe dos, „pleacă la cald, ca berzele” — ce scrie forumul —, „stă treaz și vânează”). Motivul fiecărei variante apare după prima verificare. **De ce:** trei judecăți la rând au găsit că lista de răspunsuri scrise primite la B1 ori dădea puncte pe răspunsuri opuse paginii („doarme toata vara”), ori tăia puncte la răspunsuri corecte scrise firesc („Iarna doarme, vara caută hrană.”). O notă, fie și de antrenament, nu poate depinde de o listă care nu se termină. La celelalte răspunsuri scrise (C2, A1, B2, C3) n-a mai scăpat nimic, deci rămân scrise. Dacă la lucrarea dumneavoastră B1 e cu răspuns scris în caiet, îl corectați dumneavoastră; pagina antrenează căutarea și cititul.

## Granița cu vecinii — `m3_noapte_23_10\granite\v_l17.md`
- Lecțiile 13-16 (publicate) citite întregi: pagina, `surse.md` (cu „Pentru lecția următoare”), `afirmatii.json`. Evaluarea nu le contrazice și folosește aceleași cuvinte și aceleași nume de butoane (tabelul de mai jos).
- V/16 („Lecția 17 poate presupune: capcana și regula în trei pași; datele personale; cine? când? de unde știe?; compari 2-3 surse; semnele paginii neserioase; drumul documentării”) — toate folosite; caseta de cookie-uri după arbitrajul din 19.10 (refuzi cu butonul scris; fără el, × pe filă).
- V/18 (Paint, publicată) și V/19 (Paint, în lucru): nicio suprapunere de materie sau de simulator.
- Modelele de evaluare citite: `lectii\v\m2-l12` (forma, tonul, panoul probei, „Verifică-te”), `vi\m3-l16` + `_sim\eval-internet-vi.js` (punctele în memorie, bifele ascunse; atenția GRAV de acolo: sfaturile se verifică prin ALEGERE, nu prin cuvinte libere — aici A2, P5, Î4, Î5 sunt alegere / clasare), `vii\m3-l17` (lipsa testului, „Pentru profesor”).

## „Caietul”: ce presupun lecțiile publicate și unde e folosit (bife)
Lista cu sursa fiecărui lucru: `profil.json`.
- [x] lecția 1 — părțile C/B/A, oficiul, nota, nivelul, munca pe LearningHub — P2 (legături directe `?vezi=p8`, `?vezi=p9`), panoul probei, Î1.
- [x] lecția 2 — calculatorul comun — laboratorul: file noi închise, folderul pus în Coș, Coșul negolit.
- [x] lecțiile 8-10 — Start, Explorer, folderul tău „Ex …”, Decupare/Lipire, Delete, Coșul — laborator 2 și 6.
- [x] lecția 12 — proba practică pe părți, „Verifică-te” — atelierul, laboratorul.
- [x] lecția 13 — serviciile și întrebările în ordine — P3, C1.
- [x] lecția 14 — +/×, bara de adrese, Enter, legătura, ←, motorul, cuvintele-cheie, Sponsorizat, rezultatul — P3, P4, C2, B1, Î2, laborator 3.
- [x] lecția 15 — Salvați imaginea ca, Salvare ca, Notepad, sursa, drepturile de autor, licențele, Commons — P3, P4, P5, C3, B2, Î5, laborator 4.
- [x] lecția 16 — capcanele, datele personale, cookie-urile, cine/când/de unde știe, 2-3 surse — P5, P6, A1, A2, Î3, Î4, laborator.
- Termeni noi: niciunul. T0 (oracolul începătorului) → 0 după ce „explicația” a rămas cuvânt obișnuit (nu marcat).

## Sarcina → lecția și pasul unde a fost predată
| Sarcina din lecția 17 | Unde a fost predată (lecția, pasul) |
|---|---|
| C1, P3 (Încă un exercițiu): ce serviciu folosește fiecare, cu întrebările în ordine | 13, P6 „Alegi serviciul potrivit” (și P3-P5 pentru fiecare serviciu) |
| C2, P3 (Încearcă): filă nouă cu +, fila lecției rămâne | 14, P3 „Filele: mai multe pagini în aceeași fereastră” |
| C2, P3: adresa în bara de adrese + Enter (pe telefon „Enter ↵”) | 14, P4 „Bara de adrese: scrii adresa, apeși Enter” |
| C2, P3: legătura, ← Înapoi | 14, P5 „Legătura și săgețile: Înapoi, Înainte, Reîmprospătare” |
| C2: citești pe pagină răspunsul și îl scrii în casetă | 14, P9 „Citești un rezultat și îl alegi” (Încă un exercițiu: răspunsul în casetă) |
| C3, P3 (ordinea): clic dreapta / ⋮ Meniul imaginii, Salvați imaginea ca | 15, P2 „Salvezi o imagine: clic dreapta, Salvați imaginea ca” |
| C3, P3: Documente, dublu-clic pe folderul tău, te uiți sus, Salvare | 15, P3 „Alegi tu folderul: Documente, apoi folderul tău” |
| C3, P4 (Încă un exercițiu): autorul și licența fotografiei | 15, P8 „Licențele libere: autorul îți dă voie dinainte” |
| B1, P4 (Încearcă), Î2: 2-4 cuvinte-cheie, fără politețuri | 14, P7 „Cuvintele-cheie: puține și importante” |
| B1: sari peste Sponsorizat și peste pagina fără autor | 14, P9; 16, P5-P6 |
| B2: propoziția copiată în Notepad (selectezi, Ctrl+C, Ctrl+V) | 15, P4 „Copiezi un text în Notepad” |
| B2: sursa = titlul, adresa, autorul, data | 15, P5 „Scrii sursa și salvezi fișierul text” |
| A1: două pagini de încredere comparate | 16, P6 „Compari 2-3 surse și recunoști pagina neserioasă” |
| A1: pagina-capcană închisă cu × de pe filă, fără să apeși în ea | 16, P3 „Ce faci: nu apeși, închizi fila, spui unui adult” |
| A1: autorul („Scris de …”) și data paginii alese | 16, P5 „Pot avea încredere? Cine a scris și când” |
| A2, P5 (Încearcă), Î4: explicația = semnele de încredere | 16, P5-P6 (cine? când? de unde știe? spun la fel?) |
| P5 (Încă un exercițiu), Î5: ce ai voie pe site-ul școlii | 15, P6-P8 (citatul scurt, opera întreagă, licența liberă, plagiatul) |
| P6, Î3: autoverificarea (căutarea, pagina, sursa, locul, siguranța) | 14 P7; 16 P5; 15 P5, P8; 15 P3; 16 P2-P4 |
| P2, Î1: nota din punctaj | 1, P8 „Lucrarea: trei părți și nota ta”; P10 „Din notă afli nivelul” |
| Laborator: cookie-urile; Wikipedia, data de jos; Commons cu numele științific; „… există deja” → Nu | 16 (laboratorul, caseta); 15 P5 + 16 P5; 15 P9 + laboratorul 15; 15 P2 |

## Proba de antrenament (atelierul) — extensia `lectii\_sim\eval-internet-v.js` (NOUĂ, proprietar: lecția aceasta)
- Numele verificat liber în `lectii\_sim\` înainte de scriere. NU modifică motorul, `browser-web.js`, `browser-salvare.js`, `browser-siguranta.js`, `bilete-servicii.js`, `rezultat-elev.js`, `prezenta.js` (doar le citește API-ul public: `BrowserSiguranta.creeaza`, `SimBrowserSalvare`, `body._sim.test/stare/run`, `api.checkButton`). Documentația completă e în capul fișierului.
- Tipuri: `browserEv` (browserul lecției 17, fără puncte), `probaweb` / `probasalv` (învelișul cu puncte peste browserul lecției 17 / browserul cu salvare al lecției 15), `probaalege` (alegere cu puncte pe prima variantă), `probaclasa` (clasare cu puncte pe rânduri, aceleași clase ca „classify” din motor).
- Reguli: punctele la PRIMA verificare, apoi neschimbate; „Verifică” pe cerința neatinsă și cu meniul / fereastra „Salvare ca” deschisă nu socotesc; bifele și indiciul ascunse până la prima verificare; `ceInainte` unde textul testului ar da răspunsul (A1: „pagina muzeului”); `paza` doar la „fila lecției e tot deschisă” (C2: e adevărat și fără nicio muncă); panoul „Sunt alt elev / Încep din nou”; rezumatul final cu părțile, oficiul, punctajul, nota, nivelul și „unde ai pierdut puncte” cu legătura directă la pasul de recitit. **Nimic nu se scrie în localStorage / pe server** (ca VI/16): la reîncărcare proba e goală și pagina o spune (semnul fără date `ev5_proba_golita` în sessionStorage); alt elev în caseta de jos → proba se golește (regula 23).
- Paginile noi (inventate, …-exemplu.ro): fila „Lecția 17”, ursul iarna (muzeu, parc, forum), vulpea (muzeu, enciclopedie, pagina-capcană „INCREDIBIL!!!”, reclama ascunsă „Aparate Foto”, forum, reclama „Vulpe de pluș”). Faptele lor: `afirmatii.json` A22-A23 (Wikipedia RO, citită azi).
- **Tabelul combinațiilor (fără dublă penalizare, monoton)** — `_proba\proba_eval.py` → `_proba\proba_eval.txt`, 0 abateri. Fiecare greșeală tipică pică EXACT testul ei; două greșeli pierd exact suma lor:

| Cerința | Drumul / greșeala | Pică | Puncte |
|---|---|---|---|
| C2 (16) | drumul bun · adresa greșită apoi corectată | — | 16 |
| | fără filă nouă / adresa lupului scrisă / fără ← / răspuns greșit | câte un test | 13 |
| | fără legătură + răspuns greșit | 2 teste | 10 |
| | doar fila nouă (nimic lucrat) | tot (paza) | 0 |
| C3 (16) | drumul bun · salvată direct din listă · „cc by sa” fără liniuță | — | 16 |
| | salvată în Descărcări | salvarea | 6 |
| | fără autor și licență / doar licența | nota din Notepad | 10 |
| | Descărcări + fără autor | 2 teste | 0 |
| B1 (16) | muzeul sau parcul + varianta adevărată | — | 16 |
| | propoziția întreagă / forumul / reclama | câte un test | 11 |
| | oricare din cele 3 variante false / nicio variantă (reparația 3) | răspunsul | 10 |
| | forumul + varianta lui | 2 teste | 5 |
| | propoziția + reclama + anotimpul pe dos | 3 teste | 0 |
| B2 (14) | drumul bun | — | 14 |
| | propoziția despre hrană / fără dată | câte un test | 11 |
| | propoziția cu vorbele lui / fără adresă | câte un test | 10 |
| | sursa „de pe Internet” | titlu+adresă, autor+dată | 7 |
| A1 (12) | muzeul sau enciclopedia | — | 12 |
| | o singură pagină de încredere | a doua pagină | 10 |
| | a apăsat REVENDICĂ / rămas pe forum / data greșită | câte un test | 8 |

  C1 (4 rânduri × 2 p) și A2 (prima variantă, 8 p) sunt monotone prin formă. **Atenție (deliberat):** la A1, cine nu deschide deloc pagina-capcană pierde cele 4 p ale testului ei (cerința îi spune s-o deschidă și să facă ce a învățat — ca atelierul lecției 16).
- `_proba\parcurge.py` (gesturi REALE: 390 px cu atingere pe Pixel 7, 1280 px cu mouse și taste; rețeaua externă blocată; doar `ctx.close()`): pașii (greșit, apoi corect), proba (scenariul 390: C1 6 + C2 4 + restul 0 → 20 din 100 → nota 2, „În dificultate”; scenariul 1280: totul bun → 100 → nota 10), gărzile (neatins, fereastra deschisă), bifele ascunse, `ceInainte`, punctele neschimbate după reparare, rezumatul = socoteala scriptului, golirea la alt elev și la „Sunt alt elev”, laboratorul, 5 întrebări → **0 probleme, 3 stele, 0 erori în consolă** la ambele lățimi (`_proba\parcurge_out.txt`, `parcurge_log.txt`). Capturile de telefon privite: `telefon_atelier_C2.png`, `telefon_atelier_C2_puncte.png`, `telefon_atelier_rezumat.png`, `telefon_real.png`.

## Pentru lecția următoare / pentru vecini
- `EvalInternetV` se poate refolosi pentru o altă probă a clasei a V-a pe browser: `configureaza({itemi})` + tipurile `probaweb` / `probasalv` / `probaalege` / `probaclasa`. NU schimba: regula „prima verificare”, paza, faptul că nimic nu se scrie în browser sau pe server, paginile de aici (lecția 17 se sprijină pe textele și datele lor). O extensie nouă stă în alt fișier.
- V/18-21 (Paint): nimic de presupus de aici.
- **API-ul s-a schimbat la reparația J1 (24.10.2026), `EvalInternetV.versiune = 2`** — doar adăugiri, nimic scos: (1) `checks[i].forme = {toate:[[re,…],…], fara:[re,…]}` la testele pe text scris (`raspuns`, `np`, iar la `fisa` doar `fara`), pe textul normalizat (litere mici, fără diacritice, semnele = spațiu); (2) `EvalInternetV.test(c)` = testul `c` pe exercițiul de pe ecran, cu `forme` (pentru probele care trimit copii JSON ale testelor; `body._sim.test(c)` le ignoră); (3) `EvalInternetV.forme(text, forme)`; (4) Enter în caseta de răspuns a unei cerințe cu puncte nu mai verifică; (5) blocul punctelor arată doar testele pierdute; panoul arată doar suma „până acum”; (6) `stilBS`: stilurile V/15 și V/16 stau amândouă în pagină (vezi „Pentru componenta comună”). NU schimba: (4) și (6) — fără ele, prima verificare se poate consuma din greșeală și fereastra „Salvare ca” rămâne fără stil.

- **Reparația 3 (24.10.2026): `EvalInternetV.versiune = 4`** — doar adăugiri, nimic scos: (9) `probaweb` cu `alege:{eticheta, o:[texte], ok, motive:[…], amesteca?}` și fără `raspuns`: variantele stau sub browser (`.ev5-alege .opt`, `aria-pressed`); varianta apăsată devine răspunsul browserului prin `body._sim.run([['raspuns', text]])`, deci testul de bază `{k:'raspuns', are:[varianta bună]}` o judecă, iar `sol` / `gresit` scriu `['raspuns', o[k]]`. Punctele la prima verificare, cu varianta aleasă atunci; motivul ei se vede DUPĂ prima verificare (nu înainte: ar fi un indiciu gratuit). „Ia-o de la capăt”, „Arată-mi răspunsul”, `rezolva` / `gresit` pun alegerea din starea browserului. NU schimba: motivul ascuns până la prima verificare.

- **Reparația 2 (24.10.2026): `EvalInternetV.versiune = 3`** — doar adăugiri, nimic scos: (7) la `fisa` cu `parte:'ambele'`, o dată cu luna prescurtată pe care testul V/16 n-o știe („nov”) e verificată de extensie (getter pe `parte` în copia testului); (8) panoul de dinaintea primei verificări spune doar „Fă toată cerința, apoi apasă Verifică.”; pagina parcului (`www.parc-exemplu.ro/ursul-iarna`) are o singură frază. `FORME` din pagină: vezi „Reparația 2”.

## Pentru componenta comună (nemodificată; doar observații)
- **`browser-salvare.js` (V/15) și `browser-siguranta.js` (V/16) își pun amândouă stilul în același `<style id="bs-css">`** și nu-l mai pun dacă id-ul există (`function css(){if(document.getElementById('bs-css'))return;…}`, rândul 133 în V/15, rândul 66 în V/16). Într-o pagină care le încarcă pe amândouă (prima: lecția 17), al doilea rămâne FĂRĂ stil: după browserul V/16 de la P3, fereastra „Salvare ca”, meniul imaginii și Notepad-ul V/15 de la C3/B2 erau fără stilul lor (fereastra „Salvare ca” cu `position: static`, în loc de `absolute`). De aici veneau țintele de 28-30 px (judecătorul 1: „Închidere” 28 px, „Documente” / „Ex Pop Ana” 30 px la 390; autorul: „⋮ Meniul imaginii” 28 px) — CSS-ul componentei cere 32 px, dar nu se aplica. Reparat DOAR în extensia mea (`eval-internet-v.js` v2, `stilBS`: mută stilul pus sub `bs-css-salvare` / `bs-css-siguranta`, apoi pune un `bs-css` gol); fișierele comune sunt neatinse. **De reparat în componente** (proprietarii V/15 și V/16): id-uri diferite, de ex. `bs-css-salvare` și `bs-sig-css`. Proba: `_proba\proba_reparatii.py`, [K] (+ mutantul: cu extensia veche, fereastra rămâne `static` și proba o prinde). Regula din pagină `#body .bs-mb{min-height:32px}` (pusă de autor pe simptom) a fost scoasă: nu mai e nevoie.
- `browser-web.js` (V/14): **Enter în caseta de răspuns (`.bw-rasp`) apasă „Verifică”** (`keydown` pe `.bw`, rândul 461). Într-o probă cu punctaj la prima verificare, Enter apăsat devreme consumă prima verificare (J1-3: C2 10 din 16, A1 6 din 12). În lecția 17 îl oprește extensia (ascultător în faza de captură pe corpul exercițiului, doar pe cerințele probei, cu mesajul „Enter nu verifică aici…”). Pentru orice altă probă cu punctaj pe `browser-web.js`: aceeași grijă.
- **`browser-siguranta.js` (V/16), `potrivesteData`: luna scrisă prescurtat se caută după primele 3 litere ale numelui ei** (`const lu=LUNI[l-1],pref=lu.slice(0,3);`, rândul 74), deci pentru noiembrie caută „noi…”: **„2 nov 2025”** (prescurtarea obișnuită) e respins la testul `fisa` (judecata 2, U; probat: `_verificare\j2_forme_out.txt` de dinainte, rândul „A1enc”). Celelalte luni trec („ian”, „feb”, „mar”, „sept”…). Propunere pentru proprietar: o listă de prefixe pe lună (noiembrie: „noi”, „nov”). Lecția 17 îl ocolește în extensia ei (`eval-internet-v.js` v3, `LUNI_PRESC` + `dataPrescurtata`: când data are o prescurtare pe care testul de bază n-o știe, data o verifică extensia, iar testul de bază doar autorul); componenta rămâne neatinsă. Proba: `_proba\proba_reparatii.py` [U] (8 forme bune, 10 greșite; „echipa Enciclopediei Exemplu, 2 nov 2025” tastat → A1 12 din 12).
- `lectii\v\m2-l12` (publicată): legăturile spre lecția 1 sunt `?vezi=p6` / `?vezi=p7`, dar de la 16.10 lecția 1 are pașii aceia la **P8 „Lucrarea: trei părți și nota ta”** și **P9 „Munca ta pe LearningHub intră în notă”** (`?vezi=pN` numără de la 1, `jocuri\_motor\motor.js`, `paramVezi`). Lecția 17 folosește p8/p9. De reparat la V/12 (nu e a mea).

## Faptele și sursele lor (detaliile: `afirmatii.json`, 28 de afirmații după reparația J1)
- Edge, Bing, Windows, Commons: ce au probat lecțiile 13-16 (trimiterea la afirmația lor). Edge/Chrome reali NU s-au pornit.
- Citite azi, în Chromium headless, context temporar, fără cont, User-Agent neutru: Wikipedia RO „Pinguin imperial” (primul paragraf: „Trăiește pe banchizele imense plutitoare ale Antarctidei”; „Pinguinul imperial vânează pești și raci.”; ultima editare 14.04.2026), Bing „pinguin imperial hrana” (rezultate cu text; butoanele casetei „Acceptare” / „Respingeți”), Commons „Aptenodytes forsteri” (fotografii, dar și un ou, desene, un exemplar de muzeu), Wikipedia „Urs brun” (bârlog/hibernare, puii se nasc cât mama doarme), Wikipedia „Vulpe” (omnivor; „mănâncă cele mai mici mamifere: șoareci de câmp, … iepuri”), cemananca.ro (pinguinul imperial: pești, kril). Fișierele: `_proba\sonda_lab.json`, `sonda_fapte.json`, `surse_wiki2.json`, `surse_web.json` (+ capturile de lucru `sonda_lab_*.png`).

## Imagini
- Nicio imagine nouă (dosarul `img\` nu există). Refolosite, cu legenda și autorul lor: `../m2-l14/img/fisier-biblioteca.webp` (Michael Holley, domeniu public, Commons), `../m2-l15/img/edge-salvare-ca.webp` (Edge real), `../m2-l14/img/bing-rezultat.webp` (Bing), `../m3-l16/img/data-si-sursa.webp` (Wikipedia, Chrome). Toate se încarcă (parcurgerea verifică imaginile pe fiecare pas).
- Ce lipsește: `capturi_lipsa.json`.

## Durata (refăcută la reparația J1, 24.10.2026: pe TOT ce citește elevul — `_proba\durata.py` → `_proba\durata.txt`)
Socoteala veche (`numara_cuvinte.py`, „cam 46 de minute” cu tot cu laboratorul) număra la atelier doar intro-ul și cerințele (456 de cuvinte); judecătorul a găsit ≈ 1.780 și un total real de 55-65 de minute (J1-5). Noua socoteală ia configurația proaspăt din pagină și citește din pagina DESENATĂ panoul probei, paginile din browserele simulate, blocul punctelor și mesajele; 100 de cuvinte pe minut, ca judecătorul; gesturile, cu estimările autorului și ale judecătorului. Reguli de citit: fiecare pagină simulată diferită se citește o dată în toată proba (o listă de rezultate deja citită se recunoaște); adresele (`https://… › …`), literele-sigle și bara de filtre a motorului nu se citesc; rama panoului (aceeași la fiecare cerință) se citește o dată; blocul punctelor și mesajele „Nu încă” = media dintre drumul bun și cel greșit (copilul obișnuit).
- Antet (intro, „Cum lucrezi”, obiectiv): 166 de cuvinte ≈ **1,7 min**.
- Pașii: 787 de cuvinte (text + „Uite cum”, cu casetele „Acum”) + 322 (cele 6 „Încearcă”, cu „Corect!”) ≈ 11,1 min + 6 exerciții × 0,4 + 2 casete „Acum” × 1 → **≈ 15,5 min**.
- Proba (atelierul): ≈ 2.060 de cuvinte (intro + cerințe 460 · „Ce se verifică” 154 · rânduri/variante 129 · „Corect!” 118 · panoul 160 · paginile simulate 718 · blocul punctelor ≈ 270 · mesajele ≈ 100) ≈ 20,6 min + gesturi 10 → **≈ 30,6 min** (cu blocul și mesajele drumului greșit peste tot: ≈ 33 min).
- **ÎN ORĂ, obligatoriu (antet + pași + proba): ≈ 47,7 minute** (≤ 50).
- Laboratorul: 465 de cuvinte (fără casetele la cerere) ≈ 4,7 min + gesturi și scris în caiet 9,5 → **≈ 14 min**: dacă mai ai timp; altfel ora viitoare („Continuă de unde ai rămas”, apoi „Acum la calculatorul din laborator”; probat, [E]). Dacă sună în timpul laboratorului: ultimul punct (curățenia).
- 5 întrebări ≈ **5 min**, după laborator. Toată lecția ≈ 67 de minute: de aceea se spune cinstit, în „Cum lucrezi”, ce intră în oră și ce nu.
- Pagina spune: „În oră: … (cam 15 minute), apoi … proba de antrenament (cam 30 de minute)”; laboratorul „cam 14 minute”; întrebările „cam 5 minute” — aceleași cifre ca socoteala (verificat în `proba_reparatii.py`, [E], acum citite direct din `durata.txt`, la o jumătate de minut).
- **Strat 24.10.2026 (reparația 2, judecata 2 S):** socoteala refăcută după scurtări (intro-ul atelierului, panoul de dinaintea primei verificări, a doua frază a paginii parcului): atelierul ≈ **30,3 min** (2.032 de cuvinte + gesturi 10; drumul greșit peste tot ≈ 32,9), **obligatoriul ≈ 47,5 min** (înainte 47,7; „cam 31” → „cam 30”). Socoteala judecătorului 2, cu metoda lui (30 de caractere pe minut la tastat): ≈ 49 min, ≈ 52 cu greșelile obișnuite — la limită, deci intro-ul atelierului spune acum ce se întâmplă dacă sună clopoțelul în mijlocul probei (o iei data viitoare de la C1; probat: după reîncărcare și „Continuă de unde ai rămas”, panoul arată „cerința 1 din 7: C1” și proba goală).
- **Strat 24.10.2026 (reparația 3, B1 pe alegere):** `durata.py` numără acum și cele 4 variante ale lui B1 și motivul arătat după prima verificare; plus propoziția nouă din intro-ul atelierului („La B1 cauți singur, apoi alegi dintre patru variante ce spune pagina.”). Atelierul ≈ **31,0 min** (2.098 de cuvinte + gesturi 10; drumul greșit peste tot ≈ 33,6), **obligatoriul ≈ 48,1 min** (≤ 50); „Cum lucrezi”: „cam 30” → **„cam 31 de minute”** la probă. Gesturile au rămas socotite tot 10 minute, deși o apăsare pe o variantă e mai scurtă decât un răspuns tastat (`_proba\r3_durata.txt`).

## Porțile (24.10.2026, la prima scriere; cele de după reparația J1 sunt în secțiunea de la sfârșit)
- `test_joc.py --dir lectii/v m3-l17` → **TRECUT** (28 de întrebări jucate; doar „1 niveluri”), `_proba\test_joc_out.txt`.
- `verifica_lectie.py … --fara-t1` → ultima linie **0** (S0 TRECUT, S1 0/0, S2 5/6, T0 0), `_proba\verifica_out.txt`.
- `verifica_regula.py` → 0; `oracol_nota_site.py` → 0; `learninghub_date_personale.py` → 0 (`_proba\date_personale.txt`).
- `_proba\parcurge.py` → 0 probleme (390 + 1280); `_proba\proba_eval.py` → 0 abateri.
- Fișiere de descărcat: niciunul (nu e nevoie de `curata_metadate.py`). Nicio aplicație Office pornită.

## Nesigur / de semnalat profesorului
- **Caseta de cookie-uri a lui Bing** în laborator: dacă acordul e deja dat pe calculator, nu mai apare (ca la lecția 16). Butonul „Respingeți” e văzut doar headless (din nou pe 24.10, `_proba\sonda_r1.json`), nu în Edge real.
- **Rezultatele Bing** pentru „pinguin imperial” / „pinguin imperial hrana” se schimbă; laboratorul cere „ce spune pagina ta”, iar „Verifică-te” spune „de obicei”. „pinguin imperial” probat pe 24.10 (headless): Wikipedia RO pe locul 1; dacă lipsește, laboratorul are plasa (ro.wikipedia.org, caseta „Căutare în Wikipedia”).
- **Hrana vulpii** din paginile inventate (păsări, insecte, fructe): Wikipedia „Vulpe” citită azi spune „omnivor” și numește mamiferele mici; păsările, insectele și fructele sunt hrana obișnuită a unui omnivor, dar nu le-am citit azi într-o sursă (`afirmatii.json` A23).
- **Laboratorul în alt browser** (Chrome): + / ×, bara, ← sunt la fel (lecția 14); meniul imaginii în Chrome: „Salvează imaginea ca…” (lecția 15).

## Reparațiile după judecata 1 (24.10.2026)
Registrul, cu fiecare punct al AMBELOR judecăți (opus J1-1…10, sonnet M-1…8), reparația, locul și proba: **`_verificare\registru_j1.md`** — 15 puncte (7 MAJOR, 8 MINOR), toate reparate; respinsă doar mutarea ordinii propusă la M-7 (autorul și licența sunt în panoul Commons ÎNAINTE de „More Details”: sonda de azi + lecția 15). Copia dinainte: `_proba\inainte_r1\`. Proba pe litere: `_proba\proba_reparatii.py` → 0.
Ce s-a schimbat, pe scurt:
- **C1 și P3**: întrebările lecției 13, cu cuvintele și ordinea ei; cheia = regula aplicată literal (verificată mecanic). La P3, „o poveste” → „muzică”, bunicul „trimite” scrisoarea.
- **Răspunsurile scrise** (C2, B1, B2 autor + dată, C3 autor + licență, A1): `forme` în `eval-internet-v.js` v2 (`FORME` în pagină), probate pe 20+ forme bune și 20+ greșite la fiecare. B2 primea înainte ORICE dată în cifre; acum doar data paginii. A1 („fisa” V/16) primea „Ion Stan” drept „dr. Ioana Stan”; acum nu.
- **Enter în caseta de răspuns** nu mai face prima verificare (mesaj „apasă butonul Verifică”); intro-ul o spune.
- **Înscrierea**: „Întâi spune cine ești…” e primul paragraf al atelierului, înainte de C1.
- **Durata**: socoteala nouă (secțiunea „Durata”); texte scurtate; blocul punctelor doar cu ✗, panoul doar cu suma; laboratorul „dacă mai ai timp; altfel ora viitoare”, cu drumul de întoarcere probat; întrebările după laborator.
- **Laboratorul**: plasa pentru Wikipedia (ro.wikipedia.org, „Căutare în Wikipedia”), unde sunt autorul și licența pe Commons și unde e „More Details”, „Dacă Windows întreabă…”.
- **Țintele de 28-30 px** din fereastra „Salvare ca”: cauza era stilul V/15 care nu se punea după browserul V/16 (același `id="bs-css"`); extensia pune acum ambele stiluri („Pentru componenta comună”).
- Mărunte: P6 „Uite cum” 67 de cuvinte; P4 „2-4 cuvinte”; legenda P3 (Descărcări → tu alegi Documente); B2 pe telefon (degetul apăsat, Copiere, Lipire).
- `afirmatii.json`: A07, A09, A15, A17, A18, A22, A25 la zi; noi A26 (formele), A27 (înscrierea), A28 („Continuă de unde ai rămas” → laborator). `capturi_lipsa.json`: L5, L6.
- Tabelul combinațiilor (`_proba\proba_eval.py`, 0 abateri) are rânduri noi: C3 licența lungă (16) / CC BY fără SA (10); B1 „hibernează”, „stă ascuns într-o peșteră” (16) / „nu doarme” (10); B2 „4 februarie 2026” (14) / „14.02.2026” (11).
- **API-ul extensiei**: `versiune 2`, doar adăugiri (secțiunea „Pentru lecția următoare”).

### Porțile după reparații (24.10.2026)
- `_proba\proba_reparatii.py` → **0** (`proba_reparatii_1.txt`) · `_proba\parcurge.py` → **0** (390 + 1280, 3 stele, 0 erori în consolă) · `_proba\proba_eval.py` → **0** · `_proba\durata.py` → **0**.
- `test_joc.py --dir lectii/v m3-l17` → **TRECUT** (doar „1 niveluri”) · `verifica_lectie.py … --fara-t1` → **0** (S0 · S1 0/0 · S2 5/6 · T0 0) · `verifica_regula.py` → 0 · `oracol_nota_site.py` → 0 · `learninghub_date_personale.py` → 0.
- Sondele de pe Internet: Chromium headless, profil temporar, fără cont, nimic tastat în formulare de conectare (la Wikimedia, User-Agentul `LearningHub-lectii/1.0 (educational site)`). Nicio aplicație Office, niciun Edge / Chrome real pornit.

## Reparația 2 (24.10.2026) — după judecata 2
Registrul: **`_verificare\registru_j1.md`, secțiunea „Reparația 2”** — 6 puncte (2 MAJOR: Q, R; 4 MINOR: S, T, U, V), toate reparate, niciunul respins. Copia dinainte: `_proba\inainte_r2\`. Proba: `_proba\proba_reparatii.py 2` (literele [Q]…[V], 390 cu atingeri + 1280 cu mouse și taste, rețeaua blocată, `ctx.close()`) → 0; scripturile judecătorului `_verificare\j2_forme.py` → 0 și `j2_propuse.py` → 0 nepotriviri (ieșirile mele: `_proba\r2_j2_*.txt`; ale lui, puse la loc neschimbate).
Ce s-a schimbat:
- **B1 (Q, regresie):** „iese / pleacă” e greșit doar când textul NU vorbește de primăvară („doarme în bârlog și iese primăvara” = corect: pagina muzeului spune „Se trezește primăvara”); „ziua”, „toamna” doar după „doar / numai” (pagina parcului: „De la sfârșitul toamnei până primăvara… dorm”). Respinse acum și: „doarme până vara”, „pe gheață”, „în copac”, „o oră”, „doar primăvara”, „doarme primăvara și iese iarna”. Primit „bîrlog” (scrierea veche, „birlog” fără semne).
- **A1 (R, regresie):** se interzic doar PRENUMELE greșite lângă „Stan” („Ion Stan” e fotograful de la C3), nu orice cuvânt: „Ioana Stan în / la / cu data 8 martie 2026”, „dr. I. Stan”, „doamna doctor Stan”, „cercetătoare” sunt primite.
- **Regula dirijorului, ambele:** listele judecătorului + ale autorului + răspunsuri NOI ca un copil de 11 ani (fără diacritice, „dorme”, „hibernaza”, „intro groapa”, „scriso”, „marite”, ordinea schimbată, propoziție întreagă): B1 30 bune primite / 26 greșite respinse, A1 32 / 24 — 0 corecte respinse, 0 greșite primite, deci nimic trecut pe ALEGERE; punctele neschimbate. Tabelul pe fiecare item cu text: finalul lui `_proba\proba_reparatii_2.txt`.
- **S (durata):** intro-ul atelierului spune: „Dacă sună clopoțelul în mijlocul probei: proba se reia data viitoare de la început (C1); punctele se dau la prima verificare a fiecărei cerințe.” Pusă în intro-ul ATELIERULUI (nu în „Cum lucrezi”, cum propunea judecătorul): acolo sunt regulile probei și acolo e elevul când începe. Scurtate: intro-ul atelierului (fără repetiții), panoul de dinaintea primei verificări, a doua frază a paginii parcului → obligatoriul ≈ 47,5 min (secțiunea „Durata”, stratul nou), „cam 30 de minute” la probă.
- **C2 (T):** „în zona montană”, „în Carpați” primite; pădurea amazoniană / a Australiei, munții de gheață respinse.
- **A1, pagina enciclopediei (U):** „2 nov 2025” primit, ocolit în extensie (v3); componenta V/16 neatinsă („Pentru componenta comună”).
- **Banda (V):** „1 · informația · 2 · fotografia · 3 · informația”, ca rândurile din caietul laboratorului. (La 390, banda se taie la dreapta, ca înainte: `overflow:hidden`, fără derulare orizontală.)
- Și formele „discutabile” ale judecătorului la B2 („4.II.2026”, „4 februarie anul 2026”) și C3 („Ion Stan CCBYSA” primit; alt prenume, NC respinse).
- `afirmatii.json`: A26 și A27 la zi. API-ul extensiei: `versiune 3`, doar adăugiri („Pentru lecția următoare”).

### Porțile după reparația 2 (24.10.2026) — ieșirile în `_proba\r2_*.txt`
- `proba_reparatii.py 2` → **0** · `j2_forme.py` → **0** · `j2_propuse.py` → 0 nepotriviri · `proba_eval.py` → **0** · `parcurge.py` → **0** (390 + 1280, 3 stele, 0 erori în consolă) · `durata.py` → **0** (≈ 47,5 min) · `capturi_r2.py` → 0 (capturile de telefon `r2_telefon_banda.png`, `r2_telefon_atelier_intro.png`, privite).
- `test_joc.py --dir lectii/v m3-l17` → **TRECUT** (doar „1 niveluri”) · `verifica_lectie.py … --fara-t1` → **0** · `verifica_regula.py` → 0 · `oracol_nota_site.py` → 0 · `learninghub_date_personale.py` → 0.
- Nicio aplicație Office, niciun Edge / Chrome real, nicio pagină de pe Internet: totul pe pagina din disc, cu rețeaua blocată.

## Reparația 3 (24.10.2026) — după judecata 3
Registrul: **`_verificare\registru_j1.md`, secțiunea „Reparația 3”** — 2 puncte (W, X, ambele MAJOR, ambele la B1), reparate amândouă prin **decizia dirijorului: B1 trece pe ALEGERE** (regula campaniei de la VI/16). Copia dinainte: `_proba\inainte_r3\` (pagina, extensia, fișierele lecției și cele 4 scripturi de probă).
Ce s-a schimbat:
- **B1, forma nouă.** Căutarea și deschiderea paginii rămân întocmai și se punctează ca înainte (cuvintele-cheie 5 p, pagina muzeului sau a parcului 5 p). Caseta de text a dispărut; sub browser, elevul alege dintre 4 variante ce spune pagina despre ursul brun iarna (6 p, la prima verificare, ca restul probei; până atunci poate schimba alegerea, ca pe foaie). Fără nicio verificare pe cuvinte libere la B1: lista `FORME.b1` a fost scoasă din pagină.
- **Cele 4 variante** (amestecate la fiecare deschidere), cu motivul arătat după prima verificare:
  - ✓ „Iarna doarme în bârlog și se trezește primăvara.” — cuvintele paginii muzeului („Iarna, ursul brun doarme în bârlog … Se trezește primăvara.”); adevărată și pentru pagina parcului („De la sfârșitul toamnei până primăvara, urșii bruni din parc dorm în bârloguri.”).
  - ✗ „Vara doarme în bârlog și se trezește iarna.” — anotimpul pe dos.
  - ✗ „Pleacă iarna în țările calde, ca berzele.” — migrarea, spusă simplu; e chiar ce scrie forumul fără autor („cred ca ursii pleaca iarna la cald, ca berzele”).
  - ✗ „Stă treaz toată iarna și vânează prin pădure.” — vânatul toată iarna.
- **De ce motivul abia după prima verificare:** arătat la apăsare, i-ar spune elevului dacă varianta e bună, iar elevul ar schimba-o înainte să se socotească punctele. După prima verificare, schimbarea e exercițiu și motivul apare pe loc.
- **Gestul nepunctat („scrie-l și în caiet”) nu l-am adăugat:** B1 nu avea Notepad sau caiet, doar caseta, care era chiar răspunsul. Scrisul rămâne la B2 și C3 (Notepad) și în laborator (caiet). Un rând în plus ar fi lungit și ora (≈ 48,1 din 50).
- **C2, A1, B2, C3 rămân cu răspuns scris** (J3: C2 20/20 corecte primite și 17/17 greșite respinse; A1 20/20 și 18/18; 0 scăpări), neatinse.
- Textul cerinței B1 („Citește pagina, apoi alege sub browser ce spune ea.”), intro-ul atelierului („La B1 cauți singur, apoi alegi dintre patru variante ce spune pagina.”), indiciul și „Corect!” spun noua formă. „Cum lucrezi”: „cam 31 de minute” la probă (secțiunea „Durata”, stratul reparației 3).
- **Extensia:** `eval-internet-v.js` **v4**, doar adăugiri (`alege`, secțiunea „Pentru lecția următoare”, punctul 9). `browser-web.js`, `browser-salvare.js`, `browser-siguranta.js` și motorul sunt neatinse.
- `afirmatii.json`: A22 și A26 la zi (B1 = alegere). Tabelul combinațiilor de mai sus: rândurile B1 refăcute.
- **Pentru judecata 4:** scripturile judecătorilor care tastează la B1 în `.bw-rasp` (`_verificare\j2_forme.py`, `j3_proba.py`, `j3_propuse.py`) nu mai au casetă la B1: B1 se probează acum prin variante (`#body .ev5-alege .opt[data-k]`, `data-k` = indicele din `B1_O`; ordinea pe ecran e amestecată).

### Porțile după reparația 3 (24.10.2026) — ieșirile în `_proba\r3_*.txt`
- `proba_reparatii.py 3` → **0** (`r3_proba_reparatii.txt`, `proba_reparatii_3.txt`): literele vechi fără regresii + [W] [X] prin gesturi (390 cu atingeri, 1280 cu mouse): fiecare variantă falsă → B1 10 din 16 (căutarea și pagina, răspunsul 0) cu motivul ei; cea adevărată → 16 (pe pagina muzeului și a parcului); căutarea-propoziție + forumul + varianta adevărată → 6; forumul + varianta lui → 5; nicio variantă → 10; schimbarea înainte de verificare contează, cea de după nu; motivul ascuns înainte de prima verificare; „Ia-o de la capăt” golește alegerea; „Arată-mi răspunsul” o pune pe cea adevărată; ținte ≥ 32 px; mutantul r3 (pagina de dinainte) prins pe W și pe X.
- `proba_eval.py` → **0 abateri** · `parcurge.py` → **0** (390 + 1280, până la final, 3 stele, 0 erori în consolă) · `durata.py` → **0** (≈ 48,1 min) · `r3_capturi.py` → 0 (capturile de telefon `r3_telefon_B1_alegere.png`, `r3_telefon_B1_motiv.png`, privite: variantele întregi, motivul cu ✗ roșu după verificare, fără derulare orizontală).
- `test_joc.py --dir lectii/v m3-l17` → **TRECUT** (doar „1 niveluri”) · `verifica_lectie.py … --fara-t1` → **0** (S0 · S1 · S2 · T0 TRECUT) · `verifica_regula.py` → 0 · `oracol_nota_site.py` → 0 · `learninghub_date_personale.py` → 0 · `activitate.py lista`: aceleași 2 rânduri „nu e în catalog” ca la judecata 3, niciun elev de probă.
- Nicio aplicație Office, niciun Edge / Chrome real, nicio pagină de pe Internet.
