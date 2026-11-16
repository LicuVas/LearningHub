# Surse și decizii: VI/27 „Aplicația de animație grafică: interfață și instrumente de bază”

**Nu e publicată, nu e în depozit (fără commit).** Autor: valul F, 09.11.2026. Legea: `00_GHID_LECTII.md`.

## 1. Ce · De unde · Ce am luat
| Ce | De unde | Ce am luat |
|---|---|---|
| Titlul, calea, cheia | `lectii\plan.json`, `Calendar_ore_6A_6M.md` nr. 27 (09.04.2027); `Calendar_ore_VI.md` nr. 26 (30.03.2027) | întocmai; numerotarea urmează `plan.json` |
| Unitatea | `Proiectul_unitatii_VI-U4.md`, `Planificare_calendaristica_clasa_VI.md` | VI-U4, CS.1.2, CS.3.2, CS.3.3 |
| Conținuturile | `curriculum.json`, clasa a VI-a, „Animaţii grafice si modele 3D” | „Elemente de interfață ale unei aplicații de animație grafică”, „Instrumente de bază ale unei aplicații de animație grafică” |
| Activitatea profesorului | `activitati_lectii_V_VI.json` | citată: „Explorare după o listă de sarcini scurte; elevii recunosc ce e comun cu mediul folosit în clasa a V-a și ce e nou. Notarea pe captura de ecran a zonelor de lucru.” Resursa: „laborator, aplicația de animație, captură de ecran”. |

**Cum e pusă activitatea:** „lista de sarcini” = atelierul și laboratorul; „comun / nou” = P2 (albastru / portocaliu, „Încă un exercițiu” cu sortare); „notarea pe captură” = P2 „Încearcă” (obligatoriu) și Î2, pe capturi reale, cu numere, iar elevul alege numele din listă.

## 2. Decizia aplicației (contractul `m5_noapte_08_11`, decizia 4; Vasile n-a răspuns, deci implicitul)
Aplicația de animație = **Scratch 3 online, fără cont, `.sb3` pe calculator**, ca la VI/18-26. Pagina spune că există multe aplicații de animație și că aici folosim Scratch.

## 3. Pentru profesor
1. **Aplicația:** „aplicația de animație” din activitatea dumneavoastră e Scratch? Dacă în laborator aveți alta: se schimbă numele filelor și instrumentelor din pașii 3-6, capturile, simulatorul (`scratch-animatie.js`) și laboratorul; ideile (imagini care se schimbă, costum, decor, instrumente de desen) rămân. VI/28-32 stau pe aceeași alegere.
2. **„Mediul folosit în clasa a V-a”:** elevii de a VI-a din anul ăsta au avut Scratch la a V-a? N-am dovadă: paginile VI/18-26 îl predau de la zero, iar V/31-35 sunt lecțiile de anul acesta ale clasei a V-a. Pagina spune „lecțiile cu repetiție” și, prudent, „dacă ai avut Scratch și în clasa a V-a, o știi și de acolo”. Dacă au avut, propoziția e deja adevărată; nu e nimic de schimbat.
3. **Programa spune „animațiilor 3D”** la activitatea CS.1.2 („explorarea elementelor de interfață ale unei aplicații pentru copii dedicate animațiilor 3D”), iar conținuturile spun „animație grafică”. Scratch e 2D. Lecția urmează conținuturile; modelele 3D au lecția lor (VI/33), hotărâtă separat.
4. **Notarea pe captură:** o faceți pe hârtie, cu capturi tipărite? Atunci `img\zone-numere.webp` și `img\editor-numere.webp` (960 × 600, doar numere) se pot tipări.
5. **Fișierul:** rămâne în folderul elevului, ca la VI/18-26 (vezi §11). Dacă vreți calculatorul curat la sfârșitul orei, punctul 10 primește o propoziție în plus.

## 4. Ce presupun cunoscut, cu bife
| Presupun | De unde | Acoperit |
|---|---|---|
| ✔ Scratch online, fără cont: `scratch.mit.edu` › Creează, limba, X | VI/18 | P2, caseta; laboratorul 1 (reluat pe scurt) |
| ✔ paleta, categoriile, zona de cod, scena, steagul, Stop, Sprite1, x, y, Direcția | VI/18, pasul „Ce vezi” | P2, legenda (reluat), „Încearcă” |
| ✔ tragi, lipești, clic pe bloc | VI/18 | P4 |
| ✔ „repetă 10”, gura, brațul de jos | VI/20 | P4 |
| ✔ Salvarea: Fișier, folderul tău, Explorer: F2, Decupare, Lipire; „Nu (sau Anulare)” | VI/18; cuvintele copiate din VI/25, laboratorul 3-4 | laboratorul 8-9 |
| ✘ tragerea pisicii pe scenă: VI/18 n-o predă | | spusă pe loc, laboratorul 7 (apeși, ții apăsat, duci, lași), probată viu |

**Ce presupun lecțiile următoare despre mine:** VI/28 și VI/29 se scriu acum; le dau granița `m5_noapte_08_11\granite\vi_l27.md`.

## 5. Conținut → exerciții
| Conținut | Pas | „Încearcă” | Atelier / laborator | Întrebare |
|---|---|---|---|---|
| Elemente de interfață | P2, P3, P5 | notare P2; file P3; decor P5 | atelier 2; lab 2, 5 | Î1, Î2, Î3 |
| Instrumente de bază | P4 (bloc), P6 (Cerc, Umplere, Anulează) | P4, P6 | atelier 1, 3-4; lab 4, 6, 7 | Î2, Î4, Î5 |

**Sarcinile scurte, cu rezultat vizibil:** costumul se schimbă pe scenă · pisica merge · decorul apare · cercul se vede pe scenă.

## 6. Granița
**Predau:** interfața pentru animație, instrumente de bază. **NU predau și nu folosesc:** gestionarea ca temă, testarea, depanarea, ecranul complet (VI/28); scenariul, cuvântul pentru imaginile unei animații, compoziția (VI/29); dimensiunea, ordinea, arată / ascunde (VI/30); „așteaptă” între costume, sunetul ca efect, blocurile din Sunet (VI/31); tastele (VI/32). „Merge foarte repede… cum o încetinești afli la lecția 31” e singura trimitere înainte. **Alege un personaj:** doar numit (poza, legenda). `decorul următor`, `schimbă costumul la`: se văd în capturi, nu se predau.

## 7. Simulatorul
`lectii\_sim\scratch-animatie.js` 1.1 (NOU, proprietar VI/27; 1.1 la R1: Ctrl+Z / Ctrl+Shift+Z în fila Costume): bloc `costum_urmator`, tipurile `anim` și `notare`. API și abateri: capul fișierului și granița. Încarcă nemodificate `scratch.js`, `scratch-control.js`, `scratch-interfata.js`. **Fără bloc de costum în `scratch.js`, fără file:** de aceea extensie. Abateri spuse pe ecran: `NOTA` sub paletă. Abateri nespuse, mărunte: desenul pisicii diferă (în Scratch picioarele și brațele, aici doar picioarele); cercul e egal cu ce tragi, fără mânere; Selectează, Remodelează, Pensulă, Radieră, Text, Linie, Dreptunghi spun că nu merg aici.

## 8. Pentru lecția următoare (VI/28, VI/29, …)
- **Ce rămâne la elev:** `Animatie_<clasa>_<numele>.sb3`, în folderul lui (programul cu „repetă” și „costumul următor”, un decor, un cerc pe costume1). VI/28 nu are nevoie de el. Pe telefon: nimic.
- **Ce pot folosi:** costumul, costume1, costume2, fila Costume, Sunete, Redare, „costumul următor”, decorul, panoul Scenă, editorul grafic, pânza, Cerc, Umplere, Anulează. Scrieți „presupun de la VI/27”.
- **Extensia:** încărcați `scratch-animatie.js` după `scratch.js`, `scratch-control.js`, `scratch-interfata.js`; `tipuri: {anim: SimScratchAnimatie.tipuri.anim}`. `SimScratchAnimatie.nrSchimbari(U)`, `.urma(P, {costum})`. Nu schimbați: id-ul `costum_urmator`, clasele `sa-*`, numele câmpurilor `S.fila`, `S.costum`, `S.cercuri`, `S.cap`, `S.ascultat`, `S.vazutScena`, `solutieAnim`.
- **De știut pentru VI/28:** `scratch-animatie.js` nu se încarcă pe aceeași pagină cu `scratch-gestiune.js`: amândouă definesc „costumul următor”; prima încărcată câștigă. Anulează poate fi stinsă după primul desen (Ctrl+Z merge și atunci); pe costum, un desen făcut greșit se scoate altfel (Selectează, apoi Șterge: nume văzut, gest neprobat de mine). Pe telefon, un program tras peste paletă se pierde (§9).
- **Numele fișierului:** eu folosesc forma VI/18-26. Promptul VI/28 cere `<clasa ta>-prenume-animatie`: nu se ciocnesc, dar elevul vede două forme.

## 9. Pentru componenta comună: nimic schimbat
- `scratch.js` 1.4: căsuța numerelor are la 390 px 21,8 px vizibili (V/32, §Pentru componenta comună). **Ocolit:** pe drumul lecției nu se schimbă niciun număr („repetă 10”, „mergi 10 pași”, cum vin din paletă).
- `scratch.js`: fără „Anulează” pe telefon, un program tras peste paletă se pierde. **Ocolit:** P4 începe cu programul dat și cere un singur bloc; la atelier, blocurile se iau din nou din paletă.
- Propunere pentru proprietar: `inst` să anunțe când rulează un bloc nou (`laEveniment` din `Motor` nu ajunge la instanță); extensia ține costumul într-un depozit al ei, ca `scratch-variabile.js`.

## 10. Durata
`_proba\durata.py` → `durata_out.txt`. Metoda judecătorilor (110 cuv./min, 9 s pe gest, 20 s pe verificare; fără „altfel” și „Încă un exercițiu”; laboratorul pe drumul obișnuit, punctele 1, 2, 7-10): **≈ 43 min**. Elev lent, socoteală mai aspră (90 cuv./min, 12 s pe gest): **≈ 55 min** dacă nu sare nimic. Ajunge la laborator pe la minutul 38,5; **„Când mai sunt 10 minute”** îl trimite la „Salvează” (~2,5 min), apoi întrebările (~9 min): **≈ 50 min**. De cronometrat la clasă.

## 11. Contradicții găsite
- **Prompturile VI/27-29 scriu „ștergerea de la sfârșit, ca la VI/18-26”.** Am căutat în paginile VI/18-26 (`Delete`, `ștergi`, `Coș`, „sfârșitul orei”): **niciuna nu cere ștergerea fișierului**; elevul își mută proiectul în folderul lui și îl lasă acolo (VI/18-26), iar V/31 șterge fișierul de azi. Am urmat VI/18-26: fișierul rămâne, numit exact, iar pagina spune ce nu se atinge. Scris în graniță, pentru dirijor.
- **Lecția VI/18 scrie `Settings › Language › Română`,** fără „derulezi” (V/31 a găsit lipsa). Eu pun forma V/31.
- **Creează are filmulețul, `/projects/editor` nu.** La a VI-a e predat „Creează” (VI/18-26): îl păstrez (T62).

## 12. Probe (porțile, ultimele, pe versiunea finală) — vezi `_proba\stare_autor.md`
- Faptele: `_proba\live_v27.py`, `live_v27b.py`, `live_v27c.py`, `live_lab.py` (laboratorul și casetele, literal): `live_lab.json`, 0 promisiuni care nu se țin. Headless, fără cont, rețeaua doar spre `*.scratch.mit.edu`, `ctx.close()`.
- Simulatorul: `_proba\proba_sim.py`, programe bune pe alt drum și programe stricate, cu așteptări din faptele vii; ultima linie 0.
- Gesturile: `_proba\parcurge.py`, 390 cu degetul (CDP) + 1280 cu mouse-ul, fiecare exercițiu întâi greșit; 3 stele; capturile de telefon privite.
- `test_joc.py`, `verifica_lectie.py --fara-t1`, `learninghub_date_personale.py`, `activitate.py lista` (5 → 5): rezultatele, în `stare_autor.md`.
- Reguli verificate pe lecție: 1, 3, 4, 5, 7, 9, 10, 20, 24, 25, 26, 27, 28, 29, 31, 32, 33, 38. Niciun fișier de descărcat (21 nu se aplică). Nicio aplicație Office, Chrome, Edge pornită.

## 13. Nesigur
- Anulează stinsă după primul desen: în 3 rulări din 4 ale autorului, în 2 din 2 ale judecătorului opus și în 1 din 1 la R1, dar aprinsă în 2 din 2 ale judecătorului sonnet (headless); poate altfel pe un calculator obișnuit. Textul acoperă ambele.
- Sunetul nu s-a auzit (headless); butonul s-a schimbat.
- Gesturile cu degetul sunt emulate; simulatorul nu e probat pe un telefon real.
- Fereastra browserului la salvare: din lecțiile publicate.

## 14. Imagini
`img\SURSE.json`. Capturi reale, cu marcajele spuse sub imagine. `carte-animata.webp`: John Barnes Linnet, 1886, domeniu public, Wikimedia Commons; decupat titlul.

## 15. Reparațiile după judecata 1 (09.11.2026)
Registrul: `_verificare\registru_j1.md` (13 puncte: A-M, 13 reparate, 0 respinse). Probele: `_proba\r1_proba_reparatii.py` (o verificare pe literă; 390 cu degetul, 1280 cu mouse și taste; pe versiunea dinainte, `_proba\inainte_r1\`, pică fiecare literă), `_proba\r1_live.py` (Scratch-ul viu).
- **„Încearcă” de la „Costumul următor”** pornește cu „costumul următor” sub brațul de jos (greșeala pe care Scratch-ul viu o face des, A26); poza din „Uite cum” arată acum programul cu „costumul următor” primul (A12, probat viu de ambii judecători), deci nu e soluția exercițiului.
- **Mesajele testelor după cauză** (regula 28): testul nou „Programul începe cu blocul galben” (pași, „Încă un exercițiu”, atelier); la costum și la mers, mesajul spune câte schimbări / câți pași au ieșit și de ce (lipsește, e deasupra sau sub brațul de jos, două, „repetă” cu alt număr). Textul mesajului se scrie la fiecare rulare (obiect cu `toString`), pentru că `scratch-interfata.js` copiază testele.
- **Supapa de 10 minute:** salvarea întreagă stă în „Cum lucrezi” (meniul, numele, „Nu (sau Anulare)”, Descărcări), cu „uită-te la ceas”; cuprinsul se deschide din orice pas, cu butonul de sus.
- **Durata** (metoda judecătorului opus, `_verificare\j1_durata.py` rulat neschimbat, `_proba\r1_durata.py`): înainte 1868 cuvinte, 45,1 min elevul obișnuit, 60,7 min elevul lent fără supapă; după 1866 cuvinte, 45,1 și 60,7 (am tăiat din citit: dubluri din P1-P2, variantele Î4-Î5, „De ce” al atelierului). Elevul lent trece de 50 de minute fără supapă: **de cronometrat la clasă, cu un elev lent**; cu supapa, salvează la minutul 40 și face întrebările.
- **Ctrl+Z / Ctrl+Shift+Z** în fila Costume, ca în Scratch-ul viu (A28); cât e deschisă fila Costume, tastele nu mai ajung la zona de cod.
- **Capul extensiei:** nu se încarcă împreună cu `scratch-gestiune.js` (VI/28); cifrele „Anulează stinsă” aceleași în cap, A19 și §13.
- Pentru VI/28-29: niciun termen schimbat (costum, decor, „costumul următor”, „Stop”; „cadru” tot nefolosit). API-ul extensiei: același, plus tastele.
