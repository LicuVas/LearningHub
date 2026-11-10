# VI/30 — surse, decizii, probe

Autor: opus, 09.11.2026, 22:23 → (ora din ceas la sfârșit, în `_proba\stare_autor.md`). Lecția nu e publicată. Legea: `00_GHID_LECTII.md`.
**Repararea după judecata 1 (R1, autor proaspăt, 10.11.2026, de la 00:36 din ceas):** registrul `_verificare\registru_j1.md` (A-T: 1 GRAV, 3 MAJOR, 14 MINOR + 2 hotărâri ale dirijorului, toate reparate), probele `_proba\r1_probe.py` (pe `_proba\inainte_r1\` și pe lecția de acum), `_proba\r1_live*.py` (editorul viu), `_proba\r1_durata.py`. Extensia `scratch-compozitie.js` e acum 1.1 (schimbările în capul fișierului și în granița `vi_l30.md`). Secțiunea „11. Reparațiile după judecata 1”, mai jos.

## 1. Ancora
- **Planul:** `lectii\plan.json`: VI, M5, nr. 30, „Editarea compoziției și a proprietăților obiectelor”, predare, 07.05.2027, `lectii/vi/m5-l30/`, cheia `lectie_vi_m5_l30`.
- **Unitatea:** `Info_Gimnaziu_2026\planificari\Proiectul_unitatii_VI-U4.md`, ora 30, „Editarea compoziției și a proprietăților obiectelor”, predare, materiale „teorie, exercitii”. Competențele unității: CS.1.2, CS.3.2, CS.3.3; lecția declară CS.1.2 și CS.3.2 (CS.3.3 = algoritmi cu repetiție, nu se lucrează azi).
- **Conținutul (programa, `curriculum.json`, întocmai):** „Operații de editare a unei compoziții: inserare, copiere, mutare, ștergere a obiectelor/cadrelor”. Acoperit: inserare = Alege un personaj (P6), copiere = duplică (P6), mutare = tragerea și x, y (P3), ștergere = șterge / coșul (P6). „Cadrele” nu: VI/29 le-a predat pe hârtie, iar în Scratch un cadru e un moment din rulare (granița VI/29).
- **Conținutul legat, NEDECLARAT:** oracolul `verifica_lectie.py` leagă de lecție și „Operații de editare a proprietăților unui obiect: dimensionare, rotire, transparență, poziționare”. Lecția predă dimensionarea, poziționarea și, **din R1 (10.11, hotărârea dirijorului), transparența** (efectul „fantomă”, la P5 „Arată sau ascunde”); rotirea apare doar ca nume în panou (Direcția, de la VI/18). De aceea tot nu declar al doilea conținut (rotirea nu se predă). Întrebarea pentru dirijor: îl declarăm totuși?
- **Activitatea profesorului (citată întocmai, `Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`):** „Elevii modifică poziția, dimensiunea și ordinea obiectelor unei compoziții date, până obțin un rezultat cerut; se discută ce proprietate a produs fiecare schimbare.” Resursa: „laborator, compoziție-suport”.
  - „compoziție dată” → `compozitie-de-aranjat.sb3`, descărcată din lecție (făcută cu `_proba\fa_model.py`, verificată în editorul viu);
  - „până obțin un rezultat cerut” → „Pisica se ascunde după copac”: Dimensiune 100, x −50, y −10, în spatele copacului, mingea se vede (atelier + laborator, cu poza rezultatului);
  - „se discută ce proprietate a produs fiecare schimbare” → fără profesor (Tupilați): în atelier, sub scenă, câte o listă la fiecare schimbare, cu test pe răspuns (Poziția / Dimensiunea / Ordinea / Arată / Direcția).

## 2. Decizii
1. **Aplicația:** Scratch 3 online, fără cont, `.sb3` pe calculator (contractul `m5_noapte_08_11`, decizia 4; implicitul, Vasile n-a răspuns). Ca la VI/18-29.
2. **Numele din editorul real, nu din memorie:** panoul scrie **Dimensiune** (nu „Mărime”), blocurile scriu **mărimea** („modifică mărimea cu 10”, „setează mărimea la 100 %”). Pagina spune „Dimensiune” pentru panou și citează blocurile cum sunt.
3. **Fișierul de azi:** `Compozitie_<clasa>_<Numele>.sb3` (forma VI/18-28, temă nouă: fără „există deja” peste fișierele lui). Nu se șterge. La sfârșit se șterge din Descărcări doar modelul de azi, `compozitie-de-aranjat`.
4. **Simulatorul:** extensie nouă, `lectii\_sim\scratch-compozitie.js` (proprietar VI/30), care NU încarcă `scratch.js`: `scratch.js` are un singur personaj, fără mărime, straturi, Arată și dale. Blocurile din paletă le desenez cu CSS (doar cele 6 de azi).
5. **Rezultatul cerut cere un gest pe straturi oricum ai lucra:** pisica pornește ÎN FAȚA copacului; scrisă în panou rămâne în față, trasă pe scenă vine tot în față → elevul trebuie să folosească „mergi la stratul înapoi” (sau, pe copac, „în față”).
6. **„Ce proprietate a produs schimbarea”:** listă pe rând, cu test; variantele includ și „Direcția”, ca să nu fie eliminare.
7. **Unde se scrie (R1, A):** în căsuța panoului clicul pune doar cursorul, unde ai apăsat (în mijlocul numărului), iar ⌫ șterge doar la stânga: „ștergi numărul vechi” urmat literal lăsa cifre („100” → „0” → „500”). Pagina spune acum: **„apeși chiar după ultima cifră, apoi ⌫ până se golește; scrii numărul nou, Enter”** (probat literal, viu: `r1_live.json` A, cu mouse și cu atingere; în simulator la 1280 și 390: `r1_probe.json` A). NU dublu clic: pe „-110” selectează doar „110” (j1_live L3). Mesajele testelor încep partea despre căsuță cu „Șterge tot ce scrie în căsuța …” și spun și cum.
8. **Respins:** ordinea dalelor (tragerea dalelor în listă nu schimbă straturile; nepredat, ca să nu încurce). ~~Transparența~~: din R1 e predată (hotărârea dirijorului).

## 3. Ce presupun și ce acopăr
| Presupun | De unde | Folosit în |
|---|---|---|
| ✔ Scratch fără cont, limba, X la filmuleț, Load from your computer, Salvează pe calculatorul tău, F2, Decupare, Lipire, „Nu (sau Anulare)” | VI/18 (publicată), laboratoarele VI/20-26 | P2 casetă, laborator |
| ✔ x și y = locul, 0, 0 la mijloc | VI/18 | P2, P3 |
| ✔ clic pe un bloc din paletă îl rulează | VI/18 | P4, P5 |
| ✔ categoriile (bulinele), Aspect | VI/18 (spune / gândește sunt la Aspect) | P4 |
| ~ costum, decor, dala personajului | VI/27 (nepublicată; granița `vi_l27.md`) | P1 nu le cere; pagina nu se bazează pe ele |
| ~ compoziția = ce pui într-un cadru și unde | VI/29 (nepublicată; granița `vi_l29.md`) | P1 o spune din nou |

Acopăr (nou): proprietate, panoul (Personaj, x, y, Arată, Dimensiune, Direcția), dalele, dimensiunea în %, straturile și blocurile lor, ascuns / Arată, blocurile arată / ascunde, Alege un personaj, duplică, șterge, yes / no, Anulează ștergere personaj.

## 4. Pentru lecția următoare (VI/31 și mai departe)
- La elev rămâne `Compozitie_<clasa>_<Numele>.sb3` în folderul lui (pisica după copac, mingea vizibilă). VI/31 îl poate redeschide pentru temporizare / efecte, dacă vrea.
- Cuvinte predate, de citat: proprietate, panoul de sub scenă, dală, Dimensiune (panou) / mărimea (blocuri), strat, „mergi la stratul în față / înapoi”, „mergi înainte 1 straturi”, ascuns, Arată (ochiul deschis / tăiat), „arată”, „ascunde”, Alege un personaj, duplică, șterge.
- **Din R1 (10.11) se predă aici transparența:** blocul „setează efectul [culoare ▾] la 0”, cu „fantomă” ales din listă: 0 / 50 / 100; la 100 nu se vede, dar nu e ascuns. Fapte probate pentru voi (`afirmatii.json` A35-A40): lista efectelor (culoare, ochi de pește, vârtej, pixelare, mozaic, strălucire, fantomă), limitele 0-100, **Stop anulează efectul**, **efectul NU se salvează în .sb3**.
- **Nepredat aici (și nici la VI/31, după granița ei):** celelalte efecte grafice („modifică efectul culoare cu 25”, culoare, strălucire…, „anulează efectele grafice”), „glisează”, „așteaptă”, sunetele. Cuvântul „efect” apare aici doar în numele blocului și în „efectul fantomă”.
- **Extensia `scratch-compozitie.js` 1.1 (10.11; 1.0 din 09.11), API:** ca la 1.0, plus blocul `efect` în `paleta` și câmpul `fantoma` (0-100) la personaje și în `S.p`. Schimbările 1.1: inputmode="text", touchend oprit pe scenă (F4), căsuța goală = 0 la x / y / Direcția, numărul blocului selectat la clic, mesajul de test care aruncă eroare. API 1.0: `creeaza(el, {personaje, ordine, sel, paleta, meniu, biblioteca, nota})`, `inst.stare()` / `aplica(st)` / `reset()` / `on(fn)`, `tipuri.compozitie` (teste pe S, `intrebari`, „Ia-o de la capăt”), `DESENE`, `BIBLIOTECA`. Detalii în capul fișierului. O lecție nouă poate adăuga blocuri doar cu fișier nou (aici `BLOCURI` e privat).

## 5. Pentru profesor
- **Aplicația:** am lucrat cu Scratch 3 online, fără cont. **Dacă în laborator aveți altă aplicație de animație** (Scratch instalat, altă aplicație): pașii din pagină rămân aceiași pentru Scratch instalat (aceeași compoziție, se deschide din meniul Fișier; numele exacte din Scratch instalat nu le-am putut proba); pentru altă aplicație se schimbă tot pasul din laborator și numele din pagină.
- **Rotirea și transparența** sunt în programă lângă acest conținut („Operații de editare a proprietăților unui obiect: dimensionare, rotire, transparență, poziționare”). Acest al doilea conținut **nu e declarat** în antetul lecției, pentru că rotirea nu se predă aici: Direcția apare doar ca nume în panou (Direcția și „rotește-te” sunt de la lecția 18), iar lecția 31 nu o predă nici ea. **Transparența e predată aici din 10.11** (hotărârea dirijorului, după judecata 1): la „Arată sau ascunde”, efectul „fantomă” (se vede pe jumătate). Celelalte efecte grafice (culoare, vârtej …) nu le predă nicio lecție; lecția 31 predă efectele de mișcare („glisează”), temporizarea și sunetul.
- **Ora plină:** obligatoriul ține ~40 de minute (metoda judecătorului, 110 cuv./min; ~45 pentru elevul lent); „Încă un exercițiu” și „Dacă mai ai timp” (doi copaci departe, la calculator) o duc la ~49 de minute pentru elevul obișnuit.
- „Discuția” din activitate (ce proprietate a produs fiecare schimbare) e în pagină o listă cu test; la clasă o puteți face cu voce.

## 6. Pentru componenta comună (`lectii\_sim\scratch.js`, neatinsă)
- Lecția NU încarcă `scratch.js`, deci defectul cunoscut la 390 px (căsuța de 21,8 px, „Anulează”) nu e pe drumul ei. Nu am găsit alt defect: nu am folosit componenta.
- Pentru proprietar, dacă extinde vreodată `scratch.js` cu mai multe personaje: faptele vii de mai sus (A1-A31) și formula mărimii (min 5 px, max 1,5 × scena) sunt în capul `scratch-compozitie.js`.
- **Defect comun găsit la R1 (10.11, judecata 1, C; neatins, doar raportat):** `scratch.js` are `inputmode="decimal"` pe căsuțele panoului x, y, Direcția (rândul 595) și pe câmpurile numerice ale blocurilor (rândul 835). Pe iPhone, tastatura numerică n-are minus (ghidul III.3 F3), deci „-50” nu se poate scrie. Reparația: `inputmode="text"` (cum am făcut în extensia mea, 1.1).
- **Clasă de defect, nu doar aici (judecata 1, A):** în panoul de sub scena Scratch-ului real, clicul în căsuță pune cursorul în mijlocul numărului (nu-l selectează; în blocuri, clicul îl selectează). Orice lecție care cere „șterge numărul și scrie altul” în căsuțele panoului (VI/31 și mai departe) trebuie să spună cum: „chiar după ultima cifră, apoi ⌫ până se golește” (probat viu, `r1_live.json` A).

## 7. Probele
- **Editorul viu** (Chromium headless, profil temporar, fără cont, rețeaua doar spre *.scratch.mit.edu, `ctx.close()`): `_proba\live_vi30.py`, `live_vi30b.py`, `live_vi30c.py`, `live_vi30d.py`, `live_vi30e.py` → `live_vi30*.json`; capturi în `_proba\live\`. Ultimele linii: 3 (a), 2 (b), 1 (c), 0 (d), 0 (e) — eșecurile din a-c sunt ale scriptului (selectoare greșite: meniul dalei, fereastra de ștergere, Editează), reluate și probate în d și e.
- **Modelul:** `_proba\fa_model.py` → `compozitie-de-aranjat.sb3` (ultima linie 0: fișierul bine format, fără nume de cont, fără căi, `meta.agent` gol). Încărcat în editorul viu: dalele, locurile, mărimile și stratul de la început sunt cele din fișier (live_vi30.json B_stare).
- **Pagina, cu gesturi reale:** `_proba\parcurge.py` (390 px cu degetul: atingeri, trageri, deget ținut pe dală; 1280 px cu mouse-ul și tastatura) → `parcurge_log.txt`, ultima linie 0; 3 stele la ambele; 0 erori în consolă; capturi `_proba\telefon_*.png`.
- **Depanare (tragerea cu degetul):** `_proba\dbg_tragere.py`. După o tragere RAPIDĂ cu degetul, chiar și pe un loc gol al scenei (fără cod de-al meu), prima atingere de după nu dă „click” (comportamentul Chromium după o „aruncare” — fling); cu degetul oprit o clipă înainte de ridicare, merge. Am făcut scena să-și păstreze nodurile (nu le mai înlocuiește), ca `touchend` să ajungă. În `parcurge.py` degetul stă o clipă pe loc înainte să se ridice.
- **Panoul profesorului:** `activitate.py lista | grep -c "nu e în catalog"` = 5 la start (22:23) și 5 după toate probele.
- **Porțile:** `test_joc.py` TRECUT; `verifica_lectie.py --fara-t1` → 0. (Porțile R1, după ultima schimbare: `_proba\stare_autor.md`, secțiunea „R1”.)

## 8. Durata (metoda judecătorului: 110 cuvinte/min + gesturile, elev lent)
~~`_proba\durata.py` → 31,6 min~~ (metoda autorului, înainte de judecată). **Din R1 (10.11), metoda judecătorului opus** (`_verificare\j1_durata.py`, copiată în `_proba\r1_durata.py`, rulată pe copia dinainte și pe lecția de acum; la „acum” se adaugă gesturile transparenței la P5, iar „Dacă mai ai timp” se socotește deoparte, S42) → `_proba\r1_durata_out.txt`:
- **înainte: 34,8 min (110 cuv./min) · 39,0 min (90 cuv./min)** — exact cifrele judecătorului;
- **acum, obligatoriul: 39,7 · 44,5 min** (+ transparența la P5 ≈ 3,2 min: 103 cuvinte + gesturile în simulator și în Scratch; + ~1,7 min din reparațiile de text: căsuța scrisă literal, punțile de termeni, numele butoanelor, curățenia sigură);
- opționalul: „Încă un exercițiu” ~4 min + „Dacă mai ai timp” (doi copaci departe, la calculator) ~5 min → **elevul obișnuit: ~49 de minute** (hotărârea dirijorului: 45-50);
- **supapa** („Când mai sunt 10 minute din oră”): salvarea prin Explorer + curățenia + fila + cele 5 întrebări = **7,4 min** pentru elevul lent: încape în 10.

## 9. Contradicții găsite
- Ghidul și prompturile vechi spun „mărime”; editorul de azi scrie **Dimensiune** în panou și **mărimea** în blocuri. Pagina le dă pe amândouă, fiecare unde apare.
- Granița VI/28 punea „rotire, transparență” la VI/30; brieful meu le lăsa pe dinafară (transparența = efect). **R1 (10.11): transparența intră aici** (hotărârea dirijorului); rotirea rămâne doar ca nume (Direcția).

## 10. De știut judecătorului
- Fereastra de ștergere are butoanele în ENGLEZĂ (yes / no), cu textul în română: probat de două ori (live_vi30d.json).
- „Alege un personaj”: în Scratch e butonul rotund cu pisică (numele la trecerea mouse-ului); în simulator are numele scris (spus în nota de sub simulator).
- Unde se suprapun două personaje, tragerea în Scratch poate apuca personajul din SPATE (judecătorul, j1_live L5: în 2 din 3 puncte pe copacul din față s-a mutat pisica; autorul, live_vi30b K); de ce, nu se știe (`afirmatii.json` A42). Simulatorul apucă mereu ce se vede (abatere, în capul extensiei). Pagina nu cere tragerea pe un loc comun, iar „Verifică-te” din laborator spune: „Pisica stă în fața copacului (de exemplu, după o tragere pe scenă)? Punctul 4 din nou.”
- Copia de la „duplică” apare la întâmplare: testul cere doar ca un copac să ajungă la 150, -40 (scris în panou).
- În simulator, numerele din paletă se pot schimba (ca în Scratch), dar textul lecției folosește panoul pentru numere.

## 11. Reparațiile după judecata 1 (R1, 10.11.2026)
Registrul întreg, cu citatele, reparația, locul și proba fiecărui punct: `_verificare\registru_j1.md` (20 de puncte: A-T; 0 respinse). Pe scurt:
- **A (GRAV, ambii judecători):** căsuța panoului se scrie „chiar după ultima cifră, apoi ⌫ până se golește; numărul; Enter” (pagina, casetele, laboratorul); mesajele: „Șterge tot ce scrie în căsuța …”. Probat viu și în simulator (1280 mouse, 390 deget); copia dinainte: același mesaj de 3 ori.
- **B:** mesajele cu blocurile de straturi cer lista („alege din listă „în față”, apoi apasă pe cuvintele blocului”), nu cuvinte care pot lipsi de pe bloc.
- **C, D (telefon):** extensia 1.1: `inputmode="text"`; touchstart + touchend opriți pe scenă (atingerea după o tragere rapidă: 24 din 24 pierdute → 0).
- **Transparența (T, hotărârea dirijorului):** P5 „Arată sau ascunde”, efectul fantomă (0 / 50 / 100), probat viu (`afirmatii.json` A35-A40).
- **Ora plină (P):** „Dacă mai ai timp: copaci departe” la calculator + transparența → elevul obișnuit ~49 de minute; obligatoriul 39,7 / 44,5 min; supapa 7,4 min (§8).
- MINOR-urile E-S: fidelitatea căsuței goale, suprapunerea (faptul + „Verifică-te”), fereastra de ștergere (întrebare RO, butoane EN), puntea „mărimea” = Dimensiune, „Cum lucrezi” cu numele reale ale butoanelor, pisica ștearsă fără eroare JS, pisica mai ușor de apucat cu degetul, „Anulează ștergere” = în față, sufixul (1) / (2) după oră, punțile de termeni spre VI/18 / VI/27, întrebările 3 și 5, testul „pisica se vede”, cratima în loc de minusul tipografic, textul „Se omite acest fișier” (VI/18).
- **Probele:** `_proba\r1_probe.py` (ultima linie 0 = pe „acum” toate punctele DA, pe copia dinainte toate NU), `_proba\r1_live.py` / `r1_live2.py` / `r1_live3.py` (editorul viu), `_proba\r1_durata.py`, `_proba\parcurge.py` (actualizat: scrisul în căsuță ca în textul nou; fantoma la P5).
- **Neprobat:** telefon real; deschiderea listei ▾ în editorul viu după încărcarea proiectului (în headless lista a fost aleasă prin API, apăsarea pe cuvintele blocului a fost reală); Descărcări / Explorer reale.
