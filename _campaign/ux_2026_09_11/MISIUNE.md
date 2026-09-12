# MISIUNEA turei de noapte — LearningHub, reparația UX

> **Citește fișierul ăsta ÎNTÂI. Apoi `state.json`. Apoi rulează poarta.**
> Analiza din care vine: `C:\00\Projects\LearningHub\DECIZIE_UX_2026-09-11.md` (deschide-o —
> conține de ce au fost ucise 4 din 5 soluții; nu le reînvia).
> Proiectul: `C:\00\Projects\LearningHub`, publicat pe `learninghub-8z6.pages.dev`.

## Ce e de rezolvat, în cuvinte

Elevii cărora Vasile le dă situl arată prea puțin interes. Cauzele **măsurate** sunt două, și
niciuna nu e „arată urât":

1. **Situl nu știe cine stă la tastatură.** În laborator, calculatoarele se împart. Al doilea
   elev care se așază primește numele, clasa și progresul primului.
2. **Nu există pe sit nimic care se termină repede.** Mediana lecției: 2978 de cuvinte. Cea mai
   scurtă din 531 are 959. Zero sub 800.

## Poarta (adevărul, re-derivat de pe disc)

```
python C:/00/Projects/LearningHub/_campaign/ux_2026_09_11/status.py
```

Exit 0 = toți cei 5 pași trec. Exit 1 = mai e de lucru, și tipărește exact ce.
**Starea NU stă în `state.json` și nici în acest fișier — stă în poarta asta.** Dacă cineva
strică ceva, poarta o vede imediat. Măsurat la pornire (11.09.2026, 23:05): **gata 0 din 5**.

---

## ORDINEA. Nu o schimba — pasul 1 e condiția celorlalți.

### PAS 1 — „Tu ești?" la intrare *(mic, izolat, cel mai important)*
`index.html:194-199` sare peste selector dacă browserul are deja un profil activ.
De făcut: când există un profil activ, situl arată un ecran scurt — „Bine ai venit înapoi,
**<nume>**. Tu ești?" cu două butoane: **Da, continuă** și **Nu, sunt alt elev** (al doilea
duce la selectorul de profil). Marchează ecranul cu atributul `data-ux-identity-confirm`,
că după el se uită poarta.

**Dovada cerută:** deschis în browser real, nu citit în cod. Creezi profilul „TestA", închizi,
redeschizi cu „TestB" — al doilea NU vede numele și progresul primului. Fă o captură.

### PAS 2 — cei 239 de atomi care se trec singuri cu 100
`atomic-learning.js:98-113`: un atom fără `<div class="atom-quiz">` e marcat automat terminat,
scor 100, fără nicio eroare. Măsurat acum: **239 de atomi în 225 de lecții**.

Pentru fiecare: ori i se scrie o întrebare, ori se contopește cu atomul vecin. Alegerea e a ta,
per caz — un atom de 40 de cuvinte care doar face legătura se contopește; unul care predă ceva
primește întrebare.

**⚠ Capcana dovedită, citește-o înainte să începi:** o campanie anterioară a rescris 1941 de
variante de răspuns și **a introdus defecte noi în 43% din lecțiile atinse** (`JOURNAL.md`).
Deci: valuri mici, și **un al doilea agent care NU a scris întrebarea o verifică** — contra
regulilor din `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` (deschide-l: R1.1 varianta
corectă nu are voie să fie cea mai lungă, R1.2 distractorii sunt greșeli reale, R1.4-bis indiciul
NU numește litera, R1.6 cheia e o literă și valoarea o listă).

### PAS 3 — „un atom = un ecran"
Motorul **știe deja** să facă asta: `atomic-learning.js:447-465` (`setupGating`) blochează atomii
următori, `:487` (`unlockNextAtom`) derulează la următorul. Nu scrie motor nou — pune un mod de
afișare peste el: o bucată pe ecran, cu „pasul 3 din 7" (N numărat din pagină, că variază 1-14),
buton Următorul, și la final „ai terminat — 7 din 7".

Regula pentru cele **44% din text care stau în afara atomilor** (intro, recapitulare, exerciții):
intro rămâne înainte de primul pas, exercițiile după ultimul. Nu le arunca.

**Probează pe o clasă reală a lui**, nu pe una inventată: `content/liceu/artistic/cls9/`.
**Dovada:** în browser, prima bucată e sub 400 de cuvinte și scrie „pasul 1 din N".

### PAS 4 — anul școlar și cele 80 de date moarte
- Fă `curriculum/school_year_2026_2027.json` **din fișa canonică**:
  `C:\ObsidianVaults\Scoala\An Scolar 2026-2027 — structura, judetul Neamt.md`, secțiunea `^module`
  (adresa I.S.J. Neamț 2543/19.03.2026). Păstrează forma fișierului de anul trecut.
  **Capcană:** circulă o variantă GREȘITĂ a vacanței mobile — cea bună e **22-26 februarie 2027**,
  Modulul 3 se închide pe 19 februarie, Modulul 4 începe pe 1 martie. Fișa o explică.
- `assets/js/active-module.js` are anul ars în cod (`var year = m >= 8 ? 2025 : 2026`,
  `new Date(2026, 5, 20)`). Citește-l din fișierul de structură, nu din constante.
- **„Ce invatam acum"** din `hub/index.html:496-499` se generează din același fișier, pentru
  **toate cele 11 categorii de elevi**, nu doar clasele 5-8. Azi ar trebui să scrie **Modulul 1
  (7 sept – 23 oct 2026)**.
- Cele **80 de date moarte** rămase (poarta le listează).

**Dovada:** muți ceasul pe 15 noiembrie 2026 și pagina scrie singură „Modulul 2".

### PAS 5 — profilul ca AL DOILEA CÂMP + rutare directă
`user-system.js:51-62` are 11 clase, niciuna cu profilul (artistic / mat-info / …).
**NU schimba id-urile existente.** Dacă `cls12` devine `cls12-artistic`, profilurile deja salvate
rămân cu `grade:'cls12'`, `index.html:190` nu mai găsește ruta, și elevul de a 12-a ajunge în
hub-ul de gimnaziu. Adaugă profilul ca un câmp nou, opțional, iar ruta se compune din amândouă.

**Dovada:** un elev nou cu „clasa a 9-a + artistic" ajunge la `content/liceu/artistic/cls9/`
dintr-un singur clic după ce-și spune cine e. Un profil VECHI, fără profil setat, funcționează
exact ca înainte.

---

## INTERZIS
- **Nu rescrie lecțiile.** Conținutul nu e problema aici.
- **Nu reînvia soluțiile ucise** (sunt argumentate în `DECIZIE_UX_2026-09-11.md`): pagina
  „Ora de azi" generată din orarul lui *(ar minți — orarul e provizoriu)*; scriptul mecanic de
  pliat programa *(strică paginile, conțin deja `<details>`)*; „provocarea săptămânii"
  *(o actualizează un om, deci moare)*.
- **Nu atinge** `.backup-before-practica/` (261 de copii moarte care otrăvesc orice `grep -r`).
- **Nu face înlocuiri oarbe pe `</body>`, `</script>` sau `</details>`** — precedentul e în
  `JOURNAL.md:158`: un pas de build a spart paginile care *conțineau* exemple de HTML.
- **Nu porni nimic care cere ca un om să-l actualizeze săptămânal.** Moare, și avem dovada pe disc.

## LA FINAL — livrarea nu e gata fără publicare
1. `python _campaign/ux_2026_09_11/status.py` → trebuie exit 0, sau spui exact ce n-a trecut.
2. Comite și publică: `git add -A && git commit` + push. Publicarea e deja probată
   (`python C:/00/AI_0/tools/push_ready.py --repo C:/00/Projects/LearningHub` → exit 0).
3. **Verifică LIVE**, nu presupune: `curl` cu User-Agent de browser pe 3 pagini atinse.
   *(Fără User-Agent, Cloudflare întoarce 403 și crezi că e rupt situl.)*
4. Scrie `DIMINEATA.md` în folderul campaniei: **în cuvinte simple, pentru Vasile** — ce s-a
   schimbat în lumea lui, nu ce fișiere ai atins. Fără jargon, fără tur de onoare. Închei cu
   **FĂCUT / NEFĂCUT / NESIGUR**, fiecare cu dovada observată.
5. Adaugă o intrare în `JOURNAL.md` (cel mai nou sus) cu ce a rămas DESCHIS.

## AUTO-VINDECARE (obligatoriu)
Dacă NU termini în sesiunea asta (context plin, timp, blocaj), **înainte să te oprești**:
```
python C:/00/AI_0/tools/autonomy/overnight.py add "<textul itemului tău, identic>"
```
Altfel pasul rămâne „luat" și trezirea următoare sare peste el.
Scrie întotdeauna în `state.json` unde ai ajuns, chiar și parțial.

**Nu întreba cu ce începi.** Instrucțiune permanentă de la Vasile (04.09.2026): la turele de
noapte, rezolvi tot ce e de rezolvat până dimineața.
