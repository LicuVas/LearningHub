# Jurnalul de dezvoltare — LearningHub

> **Cel mai nou sus.** O intrare per zi de lucru, nu per comitere.
> Jurnalul complet și exact e `git log` (237 de comiteri din 10.01.2026). Aici stă
> **de ce** s-a făcut ceva și **ce a rămas deschis** — lucruri pe care git nu le ține.
>
> Punctul de intrare pentru o sesiune nouă: `.init.md`.

---

## 2026-09-04 (seara) — oprit la cerere, se reia saptamana viitoare

**Punctul de reluare, cu comenzile exacte: `_campaign/proba_elevi_2026_09_03/RELUARE.md`.**

Ce s-a facut in ultima parte a zilei:
- **Rezolvari model: 963 din 1606 exercitii (60%).** Valul a fost oprit la mijloc; starea de pe
  disc e intreaga (3199 de chestionare se parseaza toate, zero goale, toate `<details>` inchise).
- **4 lectii carora le lipseau sectiuni intregi** sunt complete. Verificatorul a compilat codul
  C++ din rezolvari si a gasit valori gresite: `cout` afiseaza 6 cifre semnificative, deci
  103.148 nu 103.147, 79.699 nu 79.70, 2.10982 nu 2.11. Reparate dupa ce am rulat eu insumi codul.
- **Audit de continut, cea mai mare descoperire a campaniei.** Aceeasi lectie exista in 6 profiluri
  de liceu, deci celelalte cinci sunt un **oracol independent**. Rezultat: **16 sloturi predau alt
  subiect decat le cere programa** si **3 lectii sunt duplicate in acelasi profil** (la stiinte,
  lectia de a XI-a e 97,5% copie a celei de a X-a). `tehnologic/cls12` nu preda calcul tabelar
  nicaieri, desi e competenta la proba practica de bacalaureat.
- **Un al doilea defect, gasit de poarta noua:** 21 de chei de progres folosite de 105 lectii cu
  continut DIFERIT - cheia nu contine profilul.
- **Am scos clasa a IX-a din campanie.** Metoda votului intre profiluri da raspuns gresit acolo:
  din 2026-2027 a IX-a e pe programa noua, X-XII pe cea veche, deci majoritatea urma programa
  veche. Ar fi transformat singura lectie corecta in una gresita, in patru profiluri.

### Lectia metodei
Fiecare lectie, **citita singura, e buna**. De-aia nici cele patru treceri cu cititori-elevi, nici
recitirile n-au prins nimic: defectul nu e in lectie, e in **relatia** dintre lectii. Redundanta
sitului (acelasi slot in 6 profiluri) e cel mai ieftin oracol independent pe care-l avem - dar
tine doar cat timp fratii raspund la aceeasi intrebare.

---

## 2026-09-04 (după-amiaza) — chestionarele nu se mai ghicesc: de la 65,3% la 32,8%

**Măsurat pe toate cele 3307 întrebări, înainte și după.** Cea mai bună strategie de ghicit după lungime dădea **65,3%** (alegi mereu varianta cea mai lungă). Acum dă **32,8%** — adică nivelul hazardului pentru itemi cu 3-4 variante.

| Unde stă răspunsul corect | Înainte | Acum |
|:--|--:|--:|
| cea mai lungă variantă | 65,3% | **13,4%** |
| cea mai scurtă | — | 32,8% |
| la mijloc | — | 53,8% |

### Trei valuri, 1373 de agenți

1. **Reechilibrare** — 1941 de întrebări pe 389 de lecții. **A introdus 277 de defecte noi, în 166 de lecții (43%).** De-aia n-am publicat direct.
2. **Reparație** — 276 din 277, fiecare agent cu lista exactă a problemelor lui.
3. **Verificarea CHEILOR** — 186 de lecții (115 neverificate + 71 cu probleme rămase), 1226 de întrebări controlate una câte una. **Doar 2 chei greșite.** Asta e vestea bună: cheile erau, în mare, corecte.

### Două defecte găsite care scăpaseră de toate trecerile anterioare

- `stiinte/cls9/lectia1-identitate-siguranta`: „care e un exemplu de **sistem de operare**" avea bifat **Microsoft Word** în loc de Windows 11 — deși propriul indiciu spunea că Word e aplicație.
- **Indicii care numesc LITERA răspunsului** („deci răspunsul corect este b") pe un motor care **amestecă variantele la fiecare afișare**. Litera de pe ecran e alta, deci indiciul trimitea greșit *și* dezvăluia răspunsul înainte ca elevul să aleagă. 3 cazuri reale; celelalte 5 potriviri erau conținut legitim (litera D dintr-un cifru Cezar, litera A ca simbol al instrumentului Text din Paint).

### ⛔ Oprit deliberat aici
Rămân documentate, nereparate: **67 de itemi în care o variantă greșită își anunță singură greșeala** (se rezolvă prin eliminare) și **32 de indicii care nu discriminează** între variante. Slăbesc itemul, dar nu învață pe nimeni ceva fals. Fiecare rescriere în masă costă defecte noi — măsurat: 43% la prima rundă. Nu merită încă o tură pentru asta.

### Unelte rămase
`tools/quiz_io.py` — citește și scrie chestionarele în siguranță. Poate schimba variante, indiciu, enunț și **cheia** (aceasta doar cu motiv scris de minimum 25 de caractere, care se loghează). Refuză: alt număr de variante, variante duplicate sau goale, varianta corectă cu alt sens (sub 50% cuvinte păstrate), literă inexistentă.
`tools/verifica_cifre.py` — cifrele afișate pe paginile de clasă vs. ce e pe disc; exit 1 la nepotrivire, `--repara` le scrie corect.
`tools/practice_io.py` + stilul — gata pentru valul de rezolvări model.

---

## 2026-09-04 (dimineața) — chestionarele merg pe TOT situl + cunoștințele salvate

### Chestionarele tăcute: 504 din 504 pagini

Erau **trei** feluri ale aceluiași eșec, găsite unul după altul **doar pentru că am reverificat în browser după fiecare reparație**:

| Ce lipsea | Ce făcea motorul | Cât |
|:--|:--|--:|
| containerul `<div class="atom-quiz">` | marca atomul „content-only", **auto-completat cu 100**, ignora datele | **2400 de atomi, 417 pagini** |
| identificatorul (`data-atom="1"` în loc de `id`/`data-atom-id`) | `console.WARN` + `return` | 23 de atomi, 13 pagini |
| clasa (`atom-card` în loc de `atom`) | selectorul nu-i prindea | 3 pagini |

**Verificat înainte de a porni poarta:** în `checkAtomCompletion` (linia 408) atomul se completează când toate întrebările au primit **un** răspuns, corect sau nu — elevul care greșește nu rămâne blocat. Altfel n-aș fi pornit-o pe tot situl.

**Măsurat live la final:** 504/504 pagini afișează chestionarele, **3304 întrebări randate** din 3127 de blocuri de date.

### Restul reparat în aceeași dimineață
- **Cifrele care mințeau:** pagina de liceu anunța „380+ lecții" — sunt **273**. Pagina clasei a X-a științe rămăsese la „7 lecții" după ce adăugasem eu a opta. → **`tools/verifica_cifre.py`** (nou) compară cifrele afișate cu ce e pe disc, pe fiecare pagină de clasă; exit 1 la nepotrivire, `--repara` le scrie corect. **Probat cu control negativ:** am stricat intenționat două cifre, le-a prins pe amândouă, iar fișierul a revenit identic.
- **17 greșeli de tastare** + **13 litere chirilice** strecurate în cuvinte românești („culeги ciuperci", „predата") + **4 întrebări cu cuvinte lipite** într-un singur fișier.

### Ce am verificat că NU e o problemă (ca să nu se re-investigheze)
- Cele 455 de „cuvinte lipite" găsite prima dată erau **termeni tehnici legitimi** (LibreOffice, JavaScript, MergeSort, ValueError). Semnătura reală — un cuvânt românesc cu MAJUSCULE lipit — apare în exact un fișier.
- La `content/profesional`, cifrele sunt per rând și se adună corect (16+17+13=46). Detectorul meu naiv le raporta ca greșite.
- Maparea chirilică: **„и" se transliterează „i", nu „u"** — verificat pe context înainte de a scrie („culegi", nu „culegu").

### Unde stau cunoștințele acum
| Ce | Unde |
|:--|:--|
| **Regulile de scris conținut nou** (R1 chestionar · R2 exercițiu · R3 structură · R4 programă · R5 ce e bun), fiecare cu cifra din care vine | `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` — `truth.py where "cum scriu un chestionar bun"` |
| **Capcanele tehnice**, trans-proiect (7 secțiuni: motor care sare tăcut · date în atribute · build care inserează orb · tag scris ca text · CSS global · măsurare pe mobil · reparații în masă) | `knowledge\webdev_lessons\95_continut_generat_esec_tacut.md`, legat din indexul de simptome |
| Versiunea citibilă, pentru Vasile | Obsidian `Scoala_2022\LearningHub - Proba de calitate 04.09.2026.md` |
| Rapoartele brute | `_campaign\proba_elevi_2026_09_03\` |

### ⛔ RĂMÂNE — campanii de conținut, nu reparații
1. **~19 lecții unde titlul promite un subiect și fișierul livrează altul.**
2. **T1: răspunsul corect e cel mai lung în 79,3% din întrebări** — rescriere de ~2600 de itemi.
3. **T6: zero rezolvări model** — modificare de șablon + generare.
4. **T7: zero aprofundare** pentru elevul bun — casetă de șablon + generare.
5. Artistic IX/XI, din lipsurile de acoperire.
   *(Engleza VI-VIII iese din lista: decis 04.09 — materialele de engleză merg pe situl separat **EnglishHub** `C:/00/Projects/EnglishHub`, nu aici. LearningHub rămâne informatică/T.I.C.)*

---

## 2026-09-04 (noaptea) — proba din perspectiva elevilor: 464 de agenți

**Ce a fost:** tot situl trecut prin patru cititori — elev slab, mediu, bun, și un inspector care caută nod în papură. 121 de loturi de lecții (toate cele 500) + 52 de pagini de navigare. Fiecare semnalare gravă a trecut printr-un **al doilea agent, cu sarcina s-o respingă**; în raport au rămas doar cele care au supraviețuit.

**Cifre:** 464 de agenți, 0 erori, 103 minute, 36,5 milioane de jetoane.
**Note medii:** elev slab 6,3 · elev mediu 6,7 · elev bun 6,5 · **inspector 5,0**.
**739 de semnalări confirmate**, din care 54 blocante și 123 majore. Cele mai dese: chestionar 159, pedagogic 138, structură 131, **greșeală factuală 94**.

**Rapoartele:** `_campaign/proba_elevi_2026_09_03/RAPORT_FINAL.md` (verdict + ce se repară azi + 16 tipare de reparat la sursă) · `SINTEZE_SECTIUNI.md` (13 secțiuni) · `confirmate.json`.

### Reparat în aceeași noapte (fiecare verificat pe sursă, apoi live)
- **O pagină întreagă era invizibilă**: `tic/cls7/extra-web/lectia5-css-intro.html` avea `<style>` scris ca TEXT într-o lecție *despre CSS*; browserul îl lua drept tag real și înghițea restul — 462 de caractere din 5589, cei 13 atomi lipseau. Căutat același tipar pe tot situl (comparând cât text vede browserul cu cât există în fișier): **nu mai există altă pagină trunchiată**.
- **6 răspunsuri greșite predate ca fiind corecte** — militar cls12 (3), pedagogic cls10 (3), plus stiinte cls12 unde cheia era `"bc"` iar motorul citește o singură literă.
- **Două greșeli de fond**: K4 dat ca având circuit eulerian („toate grade = 3 — par"; 3 e impar) și 10^12 operații la 10^9/sec calculate ca „11 zile" în loc de ~17 minute.
- **485 de întrebări** (58 de fișiere, mai ales clasele V-VI) aveau litera de poziție lipită de text („AUn tip de animatie"), peste eticheta pusă de motor.
- **`.info-box { display: flex }` era global**, dar doar 70 din 551 de casete au structura pe care o presupune — celelalte **481 (în 145 de fișiere)** își așezau paragrafele pe orizontală, în coloane.
- 7 note interne scăpate în textul elevului (`_curriculum_data.json`, „oracolul de referință", numere de linie).

### ⛔ RĂMÂNE — deciziile de conținut, nu le poate lua un agent
Din cele 54 de blocante, **restul sunt conținut care nu se potrivește cu titlul**: ~19 lecții unde indexul promite un subiect și fișierul livrează altul (militar 5, pedagogic 4, științe 4, tehnologic 2, cls8 2, umanist 1, mat-info 1), plus module așezate pe altă clasă decât le dă programa. Fiecare cere ori scris conținutul promis, ori corectat titlul — și în al doilea caz rămâne gaura de programă.

### Tiparele care se repară o dată, la sursă (din raport)
T1 răspunsul corect e cel mai lung (toate cele 13 secțiuni) · T3 indexul promite altceva decât livrează fișierul · T4 cifrele din paginile de navigare sunt scrise de mână și false (`liceu/index.html` zice „380+ lecții", sunt 272) · T6 zero rezolvări model pe tot situl · T7 zero aprofundare pentru elevul bun.

### Unelte rămase
`tools/lesson_digest.py` — scoate substanța unei lecții (640 KB de HTML → 84 KB). Reluarea probei: `_campaign/proba_elevi_2026_09_03/RESUME.md`.

---

## 2026-09-03 — audit exigent: tot situl deschis în browser

**De ce:** după campania de noapte, întrebarea era „ce e greșit pe sit, cu ochi de om exigent".

**Metoda care a contat:** nu citirea fișierelor, ci **rularea în browser a codului propriu al motorului**. Un fișier corect pe disc + un motor care nu-l citește = zero pentru elev. Toate cele **852 de pagini** deschise cu Playwright (6 fire, ~12 minute) + clicuri reale pe eșantion.

**Reparat (comis și verificat live):**
- `5b3b93b` 4 linkuri de navigare moarte + bannerul de pe pagina de liceu care spunea că doar clasa a IX-a mat-info are lecții complete (măsurat: 255 complete, 0 schelet).
- `c3cf2f5` **poarta de intrare**: selectorul de clasă oferea doar clasele 5-8, deși situl avea deja liceu și postliceal publicate. Acum 11 opțiuni grupate + rutare directă în secțiunea potrivită.
- `0d8505d` **13 chestionare moarte** (JSON stricat în `data-quiz`). Acum 0 din 3121 pică parsarea.
- `20fb336` 2 fundături: butonul „Continuă" trimitea în index deși mai era o lecție.
- `10affad` **2 pagini chiar rupte** — vezi mai jos.

**Cele două pagini rupte, ambele cu cauză de sistem:**
1. `content/liceu/tehnologic/cls11/index.html` era **complet goală** (body vid, HTTP 200, titlu corect). Toate cele 3 taguri de închidere erau scrise `<\/script>`, cu bara escapată — primul `<script>` din `<head>` înghițea tot documentul. E pagina de intrare a claselor **XI C și XI D**.
2. `content/tic/cls8/m4-html-css/quizuri/quiz5-responsive.html`: pasul de build care adaugă scriptul de credit „înainte de `</body>`" a nimerit un `</body>` **dinăuntrul unui exemplu de cod HTML**, într-un șir JavaScript. → **Regulă: pe un sit care predă HTML, inserția pe `</body>` trebuie să țintească ultima apariție din document și să verifice că nu e într-un `<script>`/`<pre>`/atribut.**

### ⛔ DESCHIS — cel mai important lucru de pe sit

**Chestionarele nu se afișează la 416 pagini / 2394 de atomi (77%).**
`assets/js/atomic-learning.js`, `initAtom`: dacă atomul n-are `<div class="atom-quiz">` **înăuntru**, e marcat „content-only", **auto-completat cu scor 100**, iar `data-quiz` e ignorat — fără nicio eroare în consolă. Elevul citește lecția, ia punctajul întreg, nu e întrebat nimic.

- Reparația e mecanică (inserează containerul la finalul lui `.atom-content`).
- **Probată pe o lecție** (`artistic/cls10/m1/lectia1`) și verificată live: 7 întrebări + 28 de variante apar.
- **Nerulată pe restul de 417 pagini**, fiindcă `requireCorrectToProgress: true` — pornirea ei face lecțiile *cu poartă* pe tot situl. Decizie de luat cu Vasile, nu de aplicat noaptea.

### Alte lucruri deschise, măsurate
- ~~231 de pagini se mișcă lateral pe telefon~~ — **RETRAS în aceeași zi, ora 22: era artefactul meu de măsurare.** Playwright măsura într-o fereastră îngustă de 390px **fără emulare de telefon**, deci `<meta name=viewport>` nu se aplica și pagina se așeza ca pe desktop. Re-măsurat în Chrome-ul real cu `Emulation.setDeviceMetricsOverride({mobile:true})`: **toate cele 8 pagini „cele mai rele" au depășire 0**, iar captura arată o pagină perfect încadrată. **Regulă: pentru orice verdict despre mobil, folosește emulare de dispozitiv, nu doar o fereastră mică — și confirmă cu o captură.**
- **Varianta corectă e cea mai lungă în 79,3% din întrebări** (așteptat ~25%). Supraviețuiește amestecării, deci se poate ghici alegând răspunsul cel mai lung.
- 844 din 852 de pagini fără `meta description`; 10 grupuri de titluri duplicate; `data-correct` vizibil în DOM.

### Ce am verificat că NU e defect (ca să nu se re-investigheze)
- Distribuția „b = 53%" din fișiere **nu ajunge la elev**: motorul amestecă variantele cu Fisher-Yates la fiecare afișare.
- Indiciile care încep cu „Corect!" se arată **doar după un răspuns greșit** (`maxHints: 1`) — formulare proastă, nu trădare de răspuns.
- Paginile `quizuri/*` par goale (~200 caractere) fiindcă au ecran de intrare gamificat. Funcționează.
- Cele 121 de pagini „fără h1" sunt aproape toate quizuri, cu alt antet.

**Unelte de audit** (reluabile, în scratchpad-ul sesiunii — de mutat în `tools/` dacă se repetă): crawler Playwright reluabil peste tot situl, scan fidel al chestionarelor cu `HTMLParser(convert_charrefs=True)` (echivalent cu `element.dataset`; **regexul nu e** — trunchiază), teste de interacțiune cu clicuri.

---

## 2026-09-02 → 03 — campania de noapte: liceu, maiștri, postliceal

`3d4deae` `a3f84af` `47464f4` `b421b71` `a415549` `73c8f07`

**99 de lecții noi** pentru clasele reale 2026-2027 de la Colegiul Transporturi + Forestier: liceu X/XI/XII, școala de maiștri an I, postliceal sanitar an I și II, plus cele 9 pagini de la artistic XII care scriau „În pregătire". 124 din 124 de fișiere trec poarta mecanică. 332 de agenți.

**Punctul de intrare pentru reluare:** `_campaign/night_2026_09_02/RESUME.md`
**Starea se re-derivă de pe disc, nu din jurnal:** `python _campaign/night_2026_09_02/status.py --md` (exit 0 = totul construit).

**Lecția care a costat o noapte:** publicarea era blocată (token GitHub expirat + manager de credențiale care cerea autentificare interactivă). O tură nesupravegheată care se termină cu o publicare trebuie să verifice publicarea **la început**: `python C:\00\AI_0\tools\push_ready.py --repo <folder>`. Rezolvat între timp prin SSH (`db6627f7`).

---

## 2026-06 — campania de conformitate cu programa (gimnaziu)

61 de comiteri. Tot gimnaziul adus la conform OMEN 3393/2017, conținut progresiv, analogii sigure.
**Metodologia completă, reutilizabilă:** `REVAMP_PLAYBOOK.md` — motorul în 5 faze, rutarea Sonnet+Opus, valuri per modul, categoriile de audit, grounding ladder, capcanele.
Raport: `_campaign/MORNING_REPORT.md`.

---

## 2026-01 → 2026-03 — construcția inițială

162 de comiteri. De la zero la platforma de gimnaziu: formatul „Guided Atomic" (Format C), sistemul de profile pentru laboratorul școlii, motorul de atomi, notarea 1+6+3=10, exportul JSON semnat pentru profesor.

Documentele din acea perioadă stau în rădăcină și **descriu situl de atunci, nu pe cel de azi** (vorbesc despre „346 de pagini, clasele 5-8"). Sunt istorie utilă pentru *de ce* s-a ales o soluție, nu sursă pentru *ce este acum*. Vezi tabelul din `.init.md`.

---

## Cum reiau lucrul (rețeta scurtă)

```bash
# 1. Ce este situl ACUM (numere, nu memorie)
python "C:\00\AI_0\tools\push_ready.py" --repo "C:\00\Projects\LearningHub"   # pot publica singur?
git -C "C:\00\Projects\LearningHub" log --oneline -15                          # ce s-a intamplat ultima data

# 2. Daca reiau campania de noapte
python "C:\00\Projects\LearningHub\_campaign\night_2026_09_02\status.py" --md

# 3. Audit inainte de a declara ceva reparat
python "C:\00\Projects\LearningHub\tools\site_audit.py"
```

**Regula de aur a acestui proiect:** verifică în browser, nu pe disc. Fișierul poate fi corect și elevul să nu vadă nimic — s-a întâmplat de două ori (chestionarele fără container, pagina cu `<\/script>`).
