# Lecția 31, clasa a V-a — „Mediul grafic interactiv: interfață, blocuri, personaje, scenă” (predare) · surse și probe

Autor: V/31, tura de noapte 08→09.11.2026. Cheia `lectie_v_m5_l31`, unitatea V-U6, CS.3.2. Granița: `_campaign\revizuire_completa_2026_09\m5_noapte_08_11\granite\v_l31.md`. Nota de lucru: `_proba\stare_autor.md`.

## 1. Documentele profesorului (au prioritate)
- `Info_Gimnaziu_2026\planificari\Proiectul_unitatii_V-U6.md`: ora 31 = titlul exact, predare, „teorie, exercitii”; CS.3.2.
- **Activitatea** (`Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`, citată întocmai): „Explorare liberă ghidată de o listă de „găsește și încearcă": mută un personaj, schimbă fundalul, pornește programul. Elevii denumesc apoi zonele interfeței pe o captură de ecran.” Resursa: „laborator, mediul grafic interactiv, listă de explorare”.
  - lista = atelierul „Lista «găsește și încearcă»” și laboratorul; denumirea zonelor = „Încearcă” de la „Ce vezi în editor” (exercițiul `zone`, pe o captură fără nume).
- `lectii\plan.json`: 14.05.2027, M5, `lectii/v/m5-l31/`.
- `AI_0\data\informatica_gimnaziu\curriculum.json`: conținutul „Medii grafice interactive - elemente de interfață specifice mediului grafic interactiv”. **E lipit în fișier de conținutul de dinainte** („Structura alternativă (decizională)Medii grafice interactive - …”, fără spațiu). Poarta cere textul exact, deci `continuturi` are șirul lipit, ca la V/29; lecția acoperă DOAR a doua parte. De reparat în `curriculum.json` (nu e al meu).
- Manualele de a V-a (`manuale.py dosar`): cuvintele „bloc”, „personaj”, „scenă” sunt și cele ale editorului în română (probat viu); nu am citat din manuale.

## 2. De unde vin faptele despre Scratch
- **Editorul viu**, `scratch.mit.edu/projects/editor/`, Chromium din Playwright, headless, profil temporar, fără cont, rețeaua DOAR spre `*.scratch.mit.edu`, închidere cu `ctx.close()`; Chrome și Edge reali nu s-au pornit: `_proba\live_v31.py` → `_proba\live\rezultat.json`, `_proba\live_v31_b.py` → `_proba\live\rezultat_b.json` + capturile `_proba\live\*.png`.
- **VI/18-21** (publicate) și ghidul VIII.I: tragerea, Stop, clic pe stivă, numele din meniu, salvarea.
- **Ce a schimbat proba față de presupuneri:**
  - În Scratch în română fundalul se numește **Decor** („Decoruri”, „Alege un Decor”, lista „Alege un decor”); activitatea profesorului zice „fundalul”. Pagina le leagă într-o propoziție.
  - Alegerea decorului NU schimbă selecția și nici fila: `e_activ` = fila Cod, Sprite1 selectat. Am crezut că sare pe scenă: fals.
  - Apăsarea pe panoul **Scenă** e capcana reală: fila Costume devine Decoruri, la Mișcare scrie „Scena selectată: fără blocuri de mișcare”. Lecția o arată cu captura și are „Încă un exercițiu” + rândul din laborator.
  - `/projects/editor` nu are filmul-tutorial (a_tutorial_vizibil = 0), deci lecția nu cere X, spre deosebire de „Creează” (VI/18).
  - Pisica trasă peste zona de cod (în afara scenei) revine unde era (`c_xy_tras_in_zona_de_cod` = 90, 60). Lecția nu cere gestul; simulatorul face la fel, din R1 (§9, punctul E).

## 3. Ce presupun cunoscut (cu bife) și ce acopăr
| Presupun (din) | Acoperit aici |
|---|---|
| ✔ algoritm = pași, în ordine (V/24, V/28) | P1 |
| ✔ apeși, ții apăsat, tragi, lași (V/19, Forme în Paint) | P4, P5, spus din nou |
| ✔ filele, bara de adrese, Enter (V/14) | P2, laboratorul 1 |
| ✔ Descărcări (V/15) | P6, laboratorul 7, 9 |
| ✔ Explorer: F2, Delete, Coșul; „aici extensiile se văd” (V/10) | P6, laboratorul 7, 9 |
| ✔ fișierul de azi se șterge la sfârșitul orei; „Nu” + cifră (V/22-24) | P6, laboratorul 7, 9 |

Elevul n-a văzut Scratch: totul de la zero, cu pași mai mici decât VI/18. Pagina **nu e copia lui VI/18**: fără „mergi la x y”, fără rotire, fără 5 blocuri, fără „Load from your computer”, fără mutarea fișierului în alt folder.

## 4. Structura și de ce
- P1 la ce folosește → P2 deschizi + limba → P3 zonele (exercițiu pe captură fără nume) → P4 muți pisica + schimbi fundalul → P5 blocuri + steag (2 blocuri) → P6 salvezi, închizi, ștergi la sfârșit → atelierul („găsește și încearcă”) → laborator (9 puncte) → 5 întrebări.
- **Termeni pe pas (S32, peste 2 la P3):** P3 e pasul de vocabular cerut chiar de activitate; toate cele 5 nume stau pe același ecran și se exersează imediat. Le-aș fi putut împărți pe 2 pași, dar aș fi trecut de plafonul P0 + 5. Panoul Scenă a trecut la P4 (R1), unde se și folosește.
- **Tot S32, P5 are 3 termeni marcați (bloc, a lipi, steagul verde), plus Stop:** același motiv, plafonul P0 + 5; toți se exersează în „Încearcă”, iar Stop are test din R1. Măsurat de judecător: P3 60 de cuvinte, P4 73, P5 73 (înainte de R1).
- **P4 are două gesturi (personaj + fundal):** o singură idee, „ce e pe scenă”; separate ar fi trecut de plafon.
- **Numărul din bloc nu se schimbă azi:** e al lui V/32, iar la 390 px căsuța are 21,8 px.
- **Zonele de pe captură nu includ steagul și Stop:** la 390 captura are 279 px lățime (măsurat de judecător), deci ele au ~7 px și stau foarte aproape unul de altul; nu pot fi ținte de 32 px distincte. Se exersează pe simulator, în P5.
- **Fișierul rămâne în Descărcări, nu se mută:** se șterge oricum la sfârșitul orei (S82-S83: calculatorul comun rămâne cum a fost), iar V/32 pornește dintr-un proiect nou.
- Numele: `<clasa ta>-prenume` (decizia din prompt; liniuța nu cere Shift, S82).

## 5. Simulatorul
- `lectii\_sim\scratch.js` 1.4: **nemodificat** (doar încărcat).
- **NOU `lectii\_sim\scratch-interfata.js`** (`SimScratchInterfata` 1.2, proprietar V/31): tipurile `scena` (decoruri, dala Sprite1, panoul Scenă, capcana „Scena selectată”), `zone` și `scratch` (cel din `scratch.js` + paza), plus `monteaza(inst, …)` și `pazaPaleta(inst)`. Capul fișierului are API-ul, faptele și abaterile.
- `lectii\_sim\explorer-operatii.js` (V/10): doar folosit, cu `extensii:true`.
- **Abateri spuse:** în nota de sub paletă (doar blocurile de azi, 6 decoruri, desene mai simple, butonul „Alege un Decor” cu numele scris). Abateri nespuse pe ecran, mărunte: cu scena selectată, un mesaj acoperă paleta și zona de cod (mesajul se spune singur; în Scratch rămân blocurile scenei); fără filele Cod / Costume / Sunete.
- Testele judecă rezultatul (regula 29): poziția pisicii (trasă sau scrisă în x), decorul, programul rulat fără ecran din 0, 0; steagul apăsat.

### Pentru lecția următoare (V/32) și pentru cine extinde
- **Ce rămâne la elev:** nimic pe calculator (fișierul de azi e șters). Știe: zonele, tragerea și lipirea, steagul, Stop, decorul, salvarea + redenumirea, „un bloc deoparte nu pornește la steag; apăsat chiar pe el, pisica îl face o dată”, un bloc în plus se trage pe un loc gol, „pisica nu se întoarce singură” (doar observat). **Nu știe:** să schimbe numărul din bloc, rotirea, „mergi la x y”.
- **Proiect de pornire pentru V/32:** unul NOU (`scratch.mit.edu/projects/editor`: pisica la 0, 0, Direcția 90, zero blocuri).
- **API:** `SimScratchInterfata.tipuri.scena`, `.zone`, `.scratch`, `.monteaza`, `.pazaPaleta` (capul fișierului). Nu schimbați numele decorurilor, clasele `ssi-*`, câmpurile `S.decor`, `S.nDecoruri`, `S.selectat`, `S.trasa`. Un bloc „schimbă decorul la” se scrie într-un fișier nou și cheamă `C.setDecor`.

## 6. Probe (porțile)
Rezultatele, după ultima schimbare a paginii și a extensiei (R1, 09.11.2026, ultima schimbare ~02:35; porțile până la 03:02):
- **T2, după judecata 2 (09.11.2026; ultima schimbare a paginii și a extensiei 05:43; porțile până la 06:37):** `_proba\proba_t2.py` (AA, AB, AC, AD, cu gesturi) → **0** (390 cu degetul: 83 OK; 1280 cu mouse-ul: 84 OK); pe copia dinainte (`_proba\inainte_t2\`, `--inainte`): **21** picate la fiecare lățime, 0 controale. `proba_r1.py` → **0** (104 OK; 99 OK). `parcurge.py` → **0**, 3 stele la 390 și 1280, 0 erori. `test_joc.py` → **TRECUT**, 19 întrebări. `verifica_lectie.py … --fara-t1` → **0**. `j2_a.py` (copie neschimbată în `_proba`) → **0**. Durata (`j2_durata.py`, la 80 de cuvinte/min): **38,8 → 38,8**; metoda nu numără mesajele de eroare: cele două mesaje noi au câte 3 cuvinte în plus, citite doar după o greșeală.
- `test_joc.py --dir lectii/v m5-l31` → **TRECUT**, 19 întrebări jucate (`_proba\test_joc_r1.txt`).
- `verifica_lectie.py … --fara-t1` → **0** (S0 TRECUT, S1 0 identice, S2 6/6 după mașină, T0 0; `_proba\verifica_r1.txt`). S2 numără tipul `zone` drept execuție; după mine, `zone` și ordinea de la P2 sunt recunoaștere: 4 din 6 aplicare/execuție.
- `_proba\proba_r1.py` → **0** (390 cu degetul: 100 OK; 1280 cu mouse-ul: 95 OK). Pe copia dinainte (`--inainte`): **60** de verificări picate la 390, **55** la 1280. Registrul: `_verificare\registru_j1.md`.
- `_proba\proba_reguli.py` → **0** (40 OK); `_proba\proba_arata.py` → **0** (11 OK, inclusiv ±8 px pe zone la 390); `_proba\proba_control.py` → **0** (15 OK, control negativ pe fiecare test).
- `_proba\parcurge.py` → **0** (`_proba\parcurge_r1.txt`): 3 stele la 390 și 1280, 0 erori în pagină și în consolă.
- `_proba\live_lab.py`: drumul LITERAL al laboratorului în editorul viu: x 120 → 130 → 140, Desert, `Proiect Scratch.sb3` (rulat înainte de R1; drumul nu s-a schimbat). `_proba\live_r1.py`, `live_r1_e.py`: faptele noi (§9).
- `learninghub_date_personale.py` (tot depozitul): **0** (judecata 2, 09.11.2026, 03:34, `_verificare\j2_date_personale.txt`). Se reia întreg la publicare. `activitate.py lista | grep -c "nu e în catalog"`: 0 la 01:42, 0 la 03:07, 0 la 06:37; n-a crescut.
- **Durata**, înainte → după R1, cu aceleași trei socoteli, la 80 de cuvinte/min: metoda judecătorului opus (`_verificare\j1_durata.py`) **38,4 → 38,4**; metoda judecătorului sonnet (copie: `_proba\r1_sonnet\`) **44,8 → 44,7**; metoda autorului (`_proba\durata.py`) **42,7 → 42,7**; la 110 cuvinte/min, autorul: 36,7 → 36,7 (`_proba\r1_durata_*.txt`). Gesturile: −1 (a șasea zonă), +1 (Stop) = 0, iar pe ele socotelile judecătorilor au rămas neschimbate. Nu e cronometrată cu elevi.
- `_proba\live_v31.py`, `live_v31_b.py`, `live_lab.py`: editorul viu. `proba_reguli.py`: fiecare regulă din pagină, cu gesturi, la 390 cu degetul și la 1280 cu mouse-ul. `parcurge.py`: toată lecția ca elevul, întâi greșit, apoi corect; ținte măsurate. `sha1` la final: `scratch.js` 9de9d2ba (neatins), `scratch-interfata.js` d005f0fc, `explorer-operatii.js` e989b16c.
- Fără fișiere Office, fără descărcări în pagină.

## 7. Pentru componenta comună
- **`scratch.js` la 390 px** (defecte știute, neatinse): zona de cod ~133 px, căsuța numerelor 21,8 px, etichetele categoriilor tăiate („Evenimente”), blocurile lungi tăiate în paletă (captura `_proba\telefon_P3E1.png`). Lecția nu cere schimbarea numărului, deci nu blochează elevul; V/32 o cere.
- **`scratch.js`, tăiat la 390:** „Evenimente” și blocurile lungi sunt tăiate (regula 31 cere „nimic tăiat”), dar nu e GRAV: judecătorul a făcut cu degetul toate exercițiile, până la 3 stele și diplomă; partea vizibilă a blocului ajunge pentru apucat și recunoscut. Nimic de făcut în lecție; rămâne la proprietar.
- **`scratch.js`, pisica trasă în afara scenei:** în editorul viu revine unde era; în `scratch.js` rămâne la marginea scenei (x 272, y -214), adică aproape nevăzută. Reparat doar pentru cine încarcă extensia (`scratch-interfata.js` 1.1); restul lecțiilor au încă abaterea.
- **`scratch.js`, tragerea din paletă cu degetul:** dacă pornește în sus sau în jos, derulează (`touch-action: pan-y`) și nu ia blocul, fără mesaj. La mine: propoziția „Pe telefon” + mesajul din extensie (`pazaPaleta`). Reparația adevărată e în componentă (F4: o tragere care nu depinde de direcție); după ea, propoziția și paza se scot.
- **Atingerea după tragere (fling, F4), măsurată de judecătorul opus (J1, doar emulat):** deget ridicat din mers + atingere: V/31 pe Alege un Decor 20/24, pe Stop 18/24; VI/18 PUBLICATĂ, fără extensie, pe Stop 18/24. Fără tragere 16/16. Cu degetul oprit 150 ms înainte de ridicare 16/16. Cu caseta prezenței scoasă 14/16. Atingerea ajunge (pointerdown, pointerup), doar clicul lipsește. Deci e din tragerea din `scratch.js`, nu din lecție, din extensie sau din `prezenta.js`. Elevul apasă din nou. Nereparat aici, pentru că ține de componentă; reparația e F4 (butoane care răspund la ridicarea degetului). Judecătorul sonnet nu l-a reprodus (48/48, cu atingeri după pauze), ceea ce nu-l infirmă: alt fel de ridicare.
- **Motorul, după „Arată-mi răspunsul”:** „Rulează testele” rămâne pe ecran, dar nu mai face nimic (`if(!R.done)fn()`), iar testele cu steagul rămân ✗ după ce copilul apasă steagul. Nu blochează: butoanele de mers mai departe merg. Măsurat de judecata 2 (`_verificare\j2_h.txt`). La proprietarul motorului.
- `curriculum.json`: conținutul lipit (§1).

### Contradicții găsite
- **VI/18 publicată și limba:** `lectii\vi\m3-l18\index.html` spune `Settings › Language › Română` (P1 și laboratorul), deși Română nu se vede în listă: în editorul viu e la y = 2293, într-o fereastră de 800 px (`_proba\live\rezultat_r1.json`, `B_inainte`; judecătorul: 7 mișcări de rotiță, eu 16 mișcări de câte 100 px). Captura ei arată lista deja derulată, fără s-o spună. VI/18 nu o ating; propoziția corectă e în P2 de aici. **V/32** are aceeași formă: notat în graniță.

## 8. Nesigur / pentru profesor
- **Pentru profesor:** în laboratoare se poate intra pe `scratch.mit.edu` (filtre, rețea)? Dacă nu, atelierul din pagină ține loc de laborator (scris în pagină).
- **Pentru profesor:** numele `<clasa ta>-prenume` îl puteți schimba; V/32 are `<clasa ta>-<prenume>-traseu.sb3`.
- **Pentru profesor:** ce rezoluție au ecranele din laboratoare? La o fereastră de 1024 px, bara lui Scratch arată doar desene, fără cuvinte (de la 1100 px în sus, cuvintele: `_proba\live\rezultat_r1.json`, `F_meniu_*`). Pagina spune ce faci atunci.
- **Scratch în Edge nu e probat** (Edge real nu se pornește): editorul s-a probat în Chromium. Fereastra „Părăsești?”, fereastra „Salvare ca” și locul descărcării: `capturi_lipsa.json`.
- Limba aleasă rămâne în browserul acela (cookie al sitului scratch.mit.edu): e o urmă pe calculatorul comun, ca la VI/18; nu schimbă nimic altceva.
- Echipa Scratch poate schimba oricând adresa, traducerile și lista de decoruri; numele din listă sunt în engleză azi.

## 9. Reparațiile după judecata 1 (09.11.2026)
Registrul, punct cu punct: `_verificare\registru_j1.md` (26 de puncte unite din 32: opus 1 GRAV / 6 MAJOR / 15 MINOR, sonnet 0 / 2 / 8). Copia dinainte: `_proba\inainte_r1\`. Proba: `_proba\proba_r1.py` (aceeași probă, cu `--inainte`, pe copia dinainte).
- **A (GRAV), blocul în plus:** testele judecă acum ce s-a cerut, nu „doar atât” (regula 29): „e lipit” = blocul e printre cele de sub blocul galben; „spune Salut!” = pisica îl spune, indiferent ce mai face. Rămâne un singur caz care pică: două „mergi” (pisica merge 20), iar mesajul spune ieșirea („Trage-l pe cel de jos pe un loc gol din zona de cod”). Pasul P5 spune cum scoți un bloc în plus. Am ales să nu cer „Niciun bloc nu mai stă deoparte”: un bloc rămas deoparte ar fi dat iar buclă cu ieșirea asta. J2: testul se uita doar la primul bloc galben; acum, la oricare, ca în viu (_verificare\live\j2_rezultat2.json).
- **E, I:** în extensie: pisica lăsată în afara scenei revine; trasă cu scena selectată se mută și redevine selectată; o atingere fără mutare nu schimbă selecția (ca în viu: `_verificare\j1_live.txt`, `b_dupa_clic_pisica_tabs`, `b_dupa_tragere_tabs`).
- **D:** zona cerută e găsită dacă e printre zonele de sub deget; mesajul numește zona în care a căzut atingerea.
- **J1-02:** propoziția „Pe telefon” e la P5 (exercițiu) și la atelier (enunț și indiciu); mesajul apare numai când degetul a pornit vertical de pe un bloc din paletă și nu s-a pus niciun bloc. Nu oprește nimic și nu fură atingerea.
- **J1-04:** panoul Scenă trece la P4; la P3 zona lui se poate atinge, dar nu se cere, iar mesajul spune că îl cunoști la pasul următor. Captura numită are acum 5 zone.
- **O:** exercițiul de la P3 are altă captură (`img\editor-alta-stare.webp`: bulina Aspect, pisica la x -110, y -70, Blue Sky), din editorul viu. `editor-gol.webp` a ieșit.
- **Durata:** cifrele în §6. Reparațiile au dus-o la 41,3 (metoda opus); s-a tăiat apoi numai din citit, nu din gesturi: repetiții din P1, P6 (fereastra „există deja” rămâne în laboratorul 7, unde se face gestul), legende, variantele prea lungi de la Î4, Î5, câte o frază din „altfel”. Î1: perechea „Categoriile” a făcut loc lui „Meniul Fișier” (categoriile se exersează la P3 și la fiecare tragere), ca să nu adaug gesturi.
- **Faptele noi, probate viu:** `_proba\live_r1.py` → `_proba\live\rezultat_r1.json`; `_proba\live_r1_e.py` → `rezultat_r1_e.json`.
