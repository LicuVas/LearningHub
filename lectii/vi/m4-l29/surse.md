# VI/29 — „Scenariul unei animații: compoziție, cadre, obiecte animate” (predare)

**Nu e publicată, nu e în depozit (fără commit).** Autor, 09.11.2026. Legea: `00_GHID_LECTII.md`. Granița: `m5_noapte_08_11\granite\vi_l29.md`.

## 1. Documentele profesorului (au prioritate)
| Ce | De unde | Ce am luat |
|---|---|---|
| Titlul | `Info_Gimnaziu_2026\planificari\Calendar_ore_6A_6M.md`, `lectii\plan.json` (nr. 29, M4, 23.04.2027) | întocmai |
| Unitatea | `Proiectul_unitatii_VI-U4.md` („Animații grafice și modele 3D”), `Planificare_calendaristica_clasa_VI.md` (rândul 29: CS.1.2, CS.3.2, CS.3.3) | codul, competențele |
| Conținutul | `curriculum.json`: „Scenariul unei animații: compoziție, cadre, obiecte animate” | întocmai |
| Activitatea | `data\activitati_lectii_V_VI.json`: „Storyboard pe hârtie, în șase căsuțe, pentru o idee proprie; scenariul se dă unui coleg care spune ce nu înțelege. Abia apoi se trece la calculator.” Resursa: „fișă de storyboard, laborator” | scheletul: pașii „Storyboardul tău, în caiet” și „Citit de altcineva”, apoi calculatorul |
| Ce vine după | Activitățile VI/34 („storyboard, realizare, testare de către un coleg…”), VI/35 | caietul se păstrează |

**Fișa de storyboard:** căutată în `materiale\`, `instrumente\` și în tot `Info_Gimnaziu_2026` (Grep „storyboard”, „scenariu”: doar planificări și activități; niciun fișier-fișă). Nu există, deci elevul desenează în caiet, fără criterii de notare inventate.

## 2. Conținutul → unde se face
| Parte | Pas | Exercițiu obligatoriu | Întrebare |
|---|---|---|---|
| Scenariul | Scenariul și storyboardul | ordinea căsuțelor (barca) | Î2 (floarea) |
| Compoziție | Cadrul și compoziția | așezarea în cadru | Î1 |
| Cadre | Cadrul și compoziția; hartă la pasul următor | atelierul (două momente) | Î4 |
| Obiecte animate | Obiectele animate și ce sunt ele în Scratch | rând cu rând | Î3 |
| Activitatea: desen, coleg | Storyboardul tău, în caiet; Citit de altcineva | caiet (nejudecat); căsuța neclară | Î5 |

## 3. Ce presupun cunoscut și ce acopăr
- ✔ VI/18: Scratch fără cont, paleta, scena, steagul, Stop, „mergi la x … y: …”, „spune … pentru 2 secunde”, `.sb3`. Reluate la atelier și în laborator cu aceleași nume.
- ✔ VI/25: formularea salvării în folderul tău, „Nu (sau Anulare)” + prenumele, Explorer (copiată; numele `Scenariu_<clasa>_<Numele>`, R1).
- **Presupun de la VI/27 (citit de judecători la 21:51; publicarea: VI/27 înaintea VI/29):** costumele (două desene), panoul Scenă, „Alege un Decor”. Dacă VI/27 se schimbă, pagina mea tot spune ce înseamnă costum și decor; atelierul și laboratorul spun unde e butonul.
- Nu presupun nimic de la VI/28.

## 4. Decizii și **Pentru profesor**
1. **Aplicația:** Scratch 3 online, fără cont, `.sb3` (contractul, decizia 4; n-ai răspuns, deci implicitul). **Întrebare:** ai altă aplicație de animație în laborator? Dacă da, se schimbă doar tabelul de la pasul 4, atelierul și laboratorul.
2. **Fișa de storyboard** nu e în documente. **Întrebare:** o ai? Pagina scrie „împarte o pagină în șase, cu mâna, fără riglă (sau ia fișa de storyboard, dacă ai primit)”.
3. **Cuvintele „compoziție” și „cadru”:** programa dă doar titlul. Am ales: cadru = o căsuță, ce se vede într-un moment; compoziție = ce pui într-un cadru și unde (ca jocul `animatii-3d-vi`, N3). **Întrebare:** la clasă le spui altfel? Se schimbă două propoziții.
4. **„În Scratch, cadrele sunt costumele” (jocul „Misiunea Cadru”, N3) nu s-a preluat:** un cadru din storyboard are și decor și loc, nu doar costum. Pagina spune: cadrul = un moment din rulare, și face puntea într-o propoziție: „În jocul «Misiunea Cadru», cadrele pisicii erau costumele ei; aici, cadrul are și decorul, și locul.” Jocul publicat nu s-a atins (îl scrie dirijorul, pentru proprietarul lui).
5. **Timpul pe căsuță:** un minut și jumătate; 11 minute cu ideea și cu chenarele trase cu mâna, fără riglă. E regula paginii, ca să rămână timp de calculator; se poate schimba ușor.
6. **Fără notă pe storyboard.** Criteriile ar fi inventate. La VI/34 vin ale tale.
7. **Coleg:** colegul nu e obligatoriu și nu e nevoie de profesor. Cele trei drumuri: cu voce mică, după cele trei întrebări; a doua zi; o singură întrebare pusă mai târziu.
8. **Nu se șterge nimic la sfârșitul orei** (hotărârea dirijorului: fișierul elevului nu se șterge). **Numele fișierului** (hotărârea dirijorului, R1): `Scenariu_<clasa>_<Numele>.sb3` (ex. `Scenariu_6A_Popescu`), forma VI/18-26; VI/27 = `Animatie_…`, VI/28 = `Depanare_…`; „există deja” → „Nu (sau Anulare)” + prenumele.

## 5. Faptele despre Scratch — probate în editorul viu (09.11.2026)
`_proba\live_vi29.py` → `live\rezultat.json`; `_proba\live_paleta.py` → `live\rezultat_paleta.json`. Toate cu fel și probă în `afirmatii.json` (24: 9 viu, 2 în pagină, 4 din lecțiile publicate, 4 din sursă numită, 2 nesigure, 3 deduse; A10 și A11, refăcute parțial azi). Cele care țin lecția:
- „cadr” nu apare pe ecran și nu e în traducerea oficială; filele sunt Cod / Costume / Sunete sau Cod / Decoruri / Sunete.
- „costumul următor” schimbă doar `currentCostume` al personajului, „decorul următor” doar al scenei, citit din `project.json` salvat. **Din R1 nu mai sunt pe pagină** (blocurile nu se predau în VI/27-29).
- **Capcană găsită:** pe fila Decoruri, lângă nume scrie tot „Costum”. Din R1, captura nu mai e pe pagină (lecția nu folosește fila Decoruri); proba rămâne în `_proba\live\b_fila_decoruri.png`, de folosit de VI/27 dacă vrea.
- Programul cu două „spune”: x −120 până la ~2,1 s, x 120 de la ~2,4 s.
- Pisica trasă la −110, −50: paleta și blocul tras au −110, −50. De aici vine gestul fără tastare.

## 6. Extensia NOUĂ (proprietar VI/29): `lectii\_sim\scenariu-casute.js` (`window.ScenariuCasute`, 1.1)
Căsuțele desenate cu cod (desene ale autorului, ghidul X.1 IV-2; nimic generat de AI) și patru tipuri de exercițiu. API-ul e în capul fișierului și în graniță. Nimic nu se salvează, nimic nu pleacă.

### Pentru lecția următoare (VI/30 și mai departe)
- **La elev:** storyboardul din caiet; `Scenariu_<clasa>_<Numele>.sb3` în folderul lui, cu primele căsuțe (cine a lucrat pe telefon n-are fișier).
- **Cuvinte predate:** scenariu, storyboard, cadru, compoziție, obiect animat, omuleți din bețe; harta hârtie → Scratch de la pasul 4.
- **VI/30** poate porni de la „compoziția”: aici doar se așază pe un cadru-exemplu, fără proprietăți. **VI/34** folosește storyboardul; aici nu e notat.
- **API:** `ScenariuCasute.banda`, `.desen`, tipurile `casute_*`, încărcate nemodificate.

## 7. Pentru componenta comună — NU am schimbat nimic
- `scratch.js`, căsuța numerelor la 390 px (cunoscut, ce se vede are 21,8 px): lecția ocolește, numerele nu se scriu pe telefon. `scratch-interfata.js` e încărcat nemodificat.
- `scratch.js` (R1, găsit la proba atelierului): „spune … pentru 0 secunde” lasă balonul pe scenă până la următorul „spune”; în Scratch balonul se șterge după 0 ms (scratch-vm, looks). Testele VI/29 judecă după Scratch (balonul de 0 secunde nu e un moment), iar mesajul spune „în Scratch”.
- Clasa de defect a judecătorului (M1, M2): testul `A.cuSteag(P).length > 0` primește pălăria singură și două stive cu pălărie. VI/19 are testul bun (`unScript`). De căutat în celelalte lecții VI/18-28 care îl folosesc (nu le-am atins).
- `scratch.js` 1.4 (judecata 2, `_verificare\j2_tragere.py`): cu zona de cod derulată în jos, tragerea unui bloc din stiva de jos scurtează zona chiar la începutul tragerii; zona sare în sus (scrollTop 60 → 0 la 1280, 60 → 16 la 390), primul program alunecă 44-60 px sub deget, iar blocurile ajung sub blocul galben sau la mijloc, nu la capătul țintit (bara gri arată locul nou). Cu zona nederulată, lipirea e corectă. Aceeași clasă cu „Duplică … sare 65 px” (ghidul, S8, C1:103); reparația propusă acolo (`min-height` pe `.ss-panza` cât ține o tragere) o acoperă. În VI/29 apare doar pe drumul D3 (două blocuri galbene), iar mesajele următoare duc tot la „Corect”.

## 8. Probe (ultimele, pe versiunea finală)
Vezi secțiunea „Porțile finale” de la sfârșit; ieșirile sunt în `_proba\`.
- `proba_reguli.py`: programele la atelier (rezultat, nu drum; pornire din alt loc), toate cele 1.008 așezări, față de reguli scrise separat în Python; mutanții prinși.
- R1: `proba_atelier.py`, `proba_gesturi.py`, `proba_laba.py`, `proba_mingea.py`, `j1_durata.py` (copia judecătorului) — vezi „Reparațiile după judecata 1”.
- `parcurge.py`: toată lecția, greșit apoi corect, la 390 cu atingere și la 1280 cu mouse.

## 9. Durata (metoda judecătorului: 110 cuvinte/min + timpii de lucru, rând cu rând)
**R1:** `_proba\j1_durata.py` (scriptul judecătorului 1, copiat neschimbat; timpii de lucru sunt ai lui, cu chenarele caietului socotite) → `_proba\j1_durata_out.txt`: **2.050 de cuvinte pe drumul obligatoriu, 31,0 min de lucru → 49,6 min la 110 cuv./min; 60,4 la 90 (elevul lent).** Înainte de R1: 2.058 de cuvinte, 49,7 / 60,5 (`_verificare\j1_durata_out.txt`). La limită: **de cronometrat la clasă.** Ce am adăugat (supapa cu drumul adevărat, ideile de pornire, puntea spre joc, testele) l-am plătit din citit: P0, pasul 4 („costumul / decorul următor” și captura Decoruri), laboratorul, numele testelor. Gesturile au rămas toate. Cifrele din pagină sunt aceleași cu socoteala: caietul 11 (1 idee + 1 chenarele, cu mâna + 6 × 1,5; judecătorul socotește 12, cu rigla), colegul 5, atelierul + Scratch ~10 (Scratch ~7, ca la judecător: 6,5). „Dacă mai ai timp (opțional): căsuța 2” e marcat `span.mai-ai-timp` și nu intră în socoteală. **Elevul lent** (60,4): „Când mai sunt 10 minute din oră” îl găsește de obicei la atelier; drumul spus în „Cum lucrezi” (butoanele de jos, până la „La verificare”) e cel adevărat (`proba_gesturi.py` D1), iar întrebările îi iau ~4,5 min. Căsuțele nedesenate le termină când poate; Scratch-ul adevărat îl pierde (atelierul ține loc de el).
(Socoteala veche a autorului, `durata.py`: 48,8 / 52,9; înlocuită de metoda judecătorului.)

## 10. Imagini (`img\SURSE.json`)
- `storyboard-creion.webp`: Wikimedia Commons, Iván López Fuente, CC BY-SA 4.0, licența citită prin API (`_proba\_img\commons_licente.json`); scrisul e în spaniolă, legenda o spune; fără fețe, fără date personale.
- Capturile din Scratch (4; fila Decoruri scoasă la R1): editorul viu; fără marcaje. Exercițiile folosesc desene ale autorului.

## 11. Laboratorul (regula 10, fără profesor, fără cont)
Pe pași nu e nicio casetă „Acum în Scratch”, abatere de la S80 cu motiv: activitatea profesorului spune „Abia apoi se trece la calculator”. Gesturile reale din pași sunt în caiet. Laboratorul: caietul lângă tastatură, Scratch, decorul, pisica trasă, trei blocuri, steagul; căsuța 2 e „Dacă mai ai timp (opțional)”, marcată `span.mai-ai-timp` (S42). Drumul de rezervă: atelierul + caietul.

## 12. Nesigur
- Ferestrele reale de salvare și „există deja” în Edge / Chrome; închiderea filei (A14, A15, `capturi_lipsa.json`).
- Telefon: atingeri emulate, nu pe telefon real. Scratch-ul adevărat pe telefon nu e cerut.
- Timpul de pe căsuță și durata totală: de cronometrat la clasă.
- Ce a predat VI/27 (se scrie în același timp).
- Licența pisicii din capturile Scratch: ca la lecțiile publicate (VI/18, V/31), capturi din editorul public.

## 13. Siguranța (regulile 21-27)
Fără fișiere de descărcat; fără nume de elevi („Ana” e un prenume din exemplu, ca în prompt); User-Agent-ul regulii 22 la Commons și Wikipedia; probele cu rețeaua blocată și `ctx.close()`; Scratch numai headless, profil temporar; Edge, Chrome, Office nepornite; numărul „nu e în catalog” e verificat înainte și după.

## 14. Atenție pentru judecător
- Pasul 4 (după R1): text + tabel + patru poze; ideile: obiectul animat, harta hârtie → Scratch (cu puntea spre joc), programul cu două momente. „costumul / decorul următor” și fila Decoruri au ieșit.
- „Ce rămâne la fel în toate căsuțele stă pe loc, în fundal”: în Scratch un obiect care stă poate fi și personaj; pagina nu spune contrariul.
- Testele din atelier (R1): structura ca la VI/19 (blocuri sub blocul galben; un singur bloc galben; nimic deoparte), apoi ce se VEDE: două „spune” de cel puțin 0,5 s, primul cu pisica la x < 0, al doilea la x > 0, pornind de la x 150. Exact 0 e respins, intenționat. Un program bun + un bloc rătăcit deoparte e respins (regula „un singur program”), deși în Scratch rezultatul e bun: alegere, nu greșeală.
- Nu judec caietul (regula 29); caseta din caiet nu are bife. E un punct de încercat ca elev: se vede clar ce ai de făcut?
- „Citit de altcineva” (R1): copacul e în toate căsuțele, pisica (întoarsă spre stânga) lovește mingea spre copac; numai 4 sare. Căsuța 6 spune chiar „coboară”.

## Reparațiile după judecata 1 (09.11.2026, R1, autor proaspăt)
Registrul: `_verificare\registru_j1.md` (19 constatări ale celor doi judecători, unite în 13 puncte, + hotărârea despre nume; toate reparate, 0 respinse). Copia dinainte: `_proba\inainte_r1\`. Pe scurt:
- **G1 (GRAV), laba:** `scenariu-casute.js` 1.1 desenează laba ridicată după cap și în afara lui (`proba_laba.py`: 0 → 934 de pixeli în zona labei; capturile la 390 și 1280 privite).
- **Atelierul (M1, M2, J1-m2, J1-m3):** structura ca la VI/19 (blocuri sub blocul galben; un singur bloc galben; nimic deoparte), momentele după ce SE VEDE (≥ 0,5 s), mesajele după cauza adevărată, „mergi la” nou chiar deasupra „spune”-ului. `proba_atelier.py` (99 de programe noi, oracol propriu): 0 verdicte greșite, 0 bucle (pe 1.0: 48 și 92); `proba_gesturi.py`: D1-D5 cu gesturi reale la 390 și 1280, mesajele urmate literal până la „Corect”.
- **Căsuța 3 a mingii (M3 = J1-M1):** desenul refăcut, numai căsuța 4 sare (`proba_mingea.py`).
- **Minore:** supapa cu drumul adevărat (butoanele de jos), „costumul / decorul următor” și captura Decoruri scoase, analogia costumului, primul bloc galben numit, „pisica stă la locul din căsuța 1”, idei de pornire, puntea spre „Misiunea Cadru”, întrebarea 3 fără dublură (S1: 0), chenarele cu mâna socotite, `mai-ai-timp`; numele `Scenariu_<clasa>_<Numele>.sb3`.
- **Durata:** metoda judecătorului, 49,7 / 60,5 → 49,6 / 60,4 (§9).

## Porțile finale
**R1, rulate 09.11.2026, 23:01-23:06, după ultima schimbare a paginii** (`_proba\porti_r1.sh` → `porti_r1_out.txt`, pe rând):
- `test_joc.py` → TRECUT (21 de întrebări jucate; rămâne doar avertismentul obișnuit „1 niveluri”).
- `verifica_lectie.py --fara-t1` → ultima linie 0 (S0, S1: 0 identice, 0 aproape identice; S2 6/6; T0).
- `proba_reguli.py` → 0 (tabelul extins cu M1, M2, J1-m2, J1-m3; mutanții prinși). `proba_atelier.py` → 0 (99 de programe). `proba_mingea.py` → 0. `proba_laba.py` → 0. `proba_gesturi.py` (D1-D5, 390 cu degetul și 1280 cu mouse-ul; ieșirea scrisă la 23:03) → 0.
- `parcurge.py` (toată lecția, greșit apoi corect, 390 cu atingere și 1280 cu mouse) → 0 probleme, 0 erori în pagină și în consolă, 3 stele la amândouă.
- `j1_durata.py` (al judecătorului) → 49,6 min / 60,4 (elevul lent); înainte 49,7 / 60,5.
- `learninghub_date_personale.py` → 0; numele contului în fișierele lecției și ale mele: 0 (Grep). Panoul, „nu e în catalog”: 5 înainte, 5 după.
- Componentele comune neschimbate (`git status` curat pe `scratch.js`, `scratch-interfata.js`, `scratch-evenimente.js`, `scratch-control.js`, `jocuri\`); sha1: `scratch.js` 9de9d2ba192a, `scratch-interfata.js` d005f0fc24e5, `scenariu-casute.js` c87b7a98a28c (1.1).
(Porțile autorului, 18:23, pe 1.0: `porti_finale.sh`, înlocuite de cele de mai sus.)
