# Jurnalul de dezvoltare — LearningHub

> **Cel mai nou sus.** O intrare per zi de lucru, nu per comitere.
> Jurnalul complet și exact e `git log` (237 de comiteri din 10.01.2026). Aici stă
> **de ce** s-a făcut ceva și **ce a rămas deschis** — lucruri pe care git nu le ține.
>
> Punctul de intrare pentru o sesiune nouă: `.init.md`.

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
