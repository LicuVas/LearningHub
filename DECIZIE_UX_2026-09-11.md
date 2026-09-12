# De ce nu-l folosesc elevii și ce schimbăm — brief de decizie

> **11 septembrie 2026.** Analiză cerută de Vasile după ce a constatat că elevii cărora le dă
> situl spre explorat arată prea puțin interes, iar drumul până la o lecție e lung.
> Metodă: măsurători pe disc + **doi atacatori independenți** care n-au scris candidații și
> aveau sarcina să-i omoare. Promptul: `C:\00\AI_0\data\promptforge\learninghub_ux_2026_09_11.md`.

---

## 1. Ce am întrebat

De ce un elev lăsat singur pe sit nu găsește ce să facă, nu simte că avansează și nu are
motiv să se întoarcă mâine — și care dintre soluțiile posibile rezistă la atac.

## 2. Ce am găsit (măsurat, nu presupus)

| Fapt | Cifra | Unde |
|:--|:--|:--|
| Nicio lecție de pe sit nu e scurtă | mediana **2978** de cuvinte; cea mai scurtă din 531 are **959**; **zero** sub 800 | măsurat pe toate `lectia*.html` |
| Structura de atomi e uniformă | **531 din 531** de lecții au atomi, toți cu `id` | `atomic-learning.js:90` |
| Afișarea pas-cu-pas **există deja** | `setupGating` blochează atomii următori; `unlockNextAtom` derulează la următorul | `atomic-learning.js:447-465, 487` |
| Atomi fără chestionar = trecuți automat cu 100 | **239 de atomi în 225 de lecții** | `atomic-learning.js:98-113` |
| 44% din textul unei lecții e în afara atomilor | mediană pe 539 de fișiere | intro, recapitulare, exerciții |
| Progresul se vede într-un singur loc | `displayPlayerStats`, doar în hub, doar cu profil făcut | `hub/index.html:832` |
| Nicio pagină de navigare nu arată progresul | **0 din 189** | căutare pe cele 3 chei |
| „Ce invatam acum" e scris de mână și expirat | „MODUL 5 · 15 Aprilie – 19 Iunie 2026", doar clasele 5-8 | `hub/index.html:496-499` |
| Date moarte din anul trecut, scrise de mână | **77** de potriviri în html+js | inclusiv `active-module.js:8` |
| Mecanismul anti-expirare a expirat el însuși | anul ars în cod: `var year = m >= 8 ? 2025 : 2026` | `active-module.js` |
| Elevul care își spune clasa nu ajunge în clasa lui | `cls9..cls12` → toate la selectorul de profil | `index.html:174-178` |
| Identitatea n-are profil | 11 opțiuni de clasă, niciuna cu artistic/mat-info/… | `user-system.js:51-62` |

**★ Defectul de laborator, cel mai grav lucru găsit.** `index.html:194-199`: dacă browserul are
deja un profil activ, situl **sare peste selector**. Al doilea elev care se așază la același
calculator primește „Bine ai venit, <elevul dinainte>", e dus în clasa aceluia și lucrează în
progresul aceluia. Cheile sunt per browser (`user-system.js:23-24, 243`). Într-un laborator cu
calculatoare împărțite, asta face ca orice „senzație de progres" să fie a altcuiva.

**Două lucruri pe care le credeam și NU sunt adevărate** (prinse de atacatori, verificate de mine):
- „1750 de cuvinte de programă înainte de orice lucru de făcut" pe pagina de artistic: **fals**.
  1239 din ele stau deja în 4 pliante închise. Vizibile fără clic: **511**.
- „39 de pagini au text de programă de curățat": **fals**. Secțiunea de programă (`id="programa-oficiala"`)
  e pe **7** pagini — cele 7 profiluri de liceu. Restul au mediana de 205 cuvinte; n-au ce plia.

## 3. Candidații puși pe masă

| | Ideea |
|:--|:--|
| C1 | „Ora de azi": o pagină per clasă, generată din orarul profesorului |
| C2 | Lecția feliată: un atom = un ecran, „pasul 3 din 7" |
| C3 | Script mecanic care pliază textul de programă de pe paginile de navigare |
| C4 | Identitate completă (clasă + profil) + „continuă de unde ai rămas" |
| C5 | „Provocarea săptămânii" pe fiecare clasă |

## 4. Ce a ucis atacul

**C1 — MORT în forma „azi".** Nu pentru că lipsesc datele (structura anului 2026-2027 e canonică
în `C:\ObsidianVaults\Scoala\An Scolar 2026-2027 — structura, judetul Neamt.md`, adresa ISJ
2543/19.03.2026), ci pentru că **ar minți**: orarul e provizoriu, clasele de la Brauner sunt
*deduse* dintr-un PDF fără nume de profesori, marți 14:00/15:00 sunt supliniri, nu orele lui,
vineri 8:00 e o oră cu două clase deodată, iar la Țibucani predă engleză — materie care nu e pe
acest sit. O pagină care spune încrezător „azi facem X" și greșește e mai rea decât una învechită.
În plus, harta clasă→modul (`content_map.json`) acoperă doar clasele 5-8 din 11, la nivel de modul.

**C3 — MORT ca „script mecanic".** Munca e în mare parte deja făcută (1239 din 1750 de cuvinte
sunt pliate), iar ce rămâne nu e mecanizabil: pe 28 din 35 de pagini textul e risipit fără un bloc
unic, o dată chiar într-un comentariu HTML (`content/tic/cls5/m5-proiect/index.html:486`). Iar
secțiunea de programă **conține deja `<details>`** (`artistic/index.html:306,326,346,376`) — un
script care înfășoară blocul produce pliante imbricate. Precedentul e în `JOURNAL.md:158`: un pas
de build care înlocuia orb `</body>` a spart paginile care conțineau exemple de HTML.

**C5 — MORT.** Îl actualizează un om, deci moare; dovada e chiar pe disc: „MODUL 5 · 15 Aprilie"
scrie și azi. Iar „dovada" cerută elevului ar însemna ~500 de capturi pe săptămână adunate manual.

**C4 — MORT în varianta „schimbăm id-urile de clasă"**, viu în varianta „profilul e un câmp nou".
Dacă `cls12` devine `cls12-artistic`, profilurile existente rămân cu `grade:'cls12'`, iar
`index.html:190` nu mai găsește ruta → elevul de a 12-a ajunge în hub-ul de gimnaziu. Ca **câmp
adăugat**, cheile de progres supraviețuiesc (sunt legate de nume, `user-system.js:196`).
Partea „continuă de unde ai rămas" e mai scumpă decât pare: totalul „din câte" e scris de mână în
pagină (`updateModuleProgress('cls5','m2-grafice-internet',7)`) și e apelat doar de **25 din 181**
de pagini; iar din cheia salvată nu se poate reconstrui adresa lecției (lipsește rădăcina).

**C2 — RĂNIT, singurul care rezistă.** Atacurile care au prins: 44% din text e în afara atomilor;
239 de atomi fără chestionar se trec singuri cu 100; `atomic-learning.js` e inclus în 542 din 841
de pagini. Atacul care **l-a întărit**: nu e motor nou, e CSS peste un mecanism care există deja.

## 5. Recomandarea

**Nu se face niciunul dintre cei 5 ca atare.** Ordinea reală, în ordinea în care contează:

**(a) Întâi identitatea în laborator** — altfel „senzația de progres" e a altcuiva.
Situl trebuie să întrebe „tu ești?" când se deschide pe un calculator împărțit, și să aibă un
buton vizibil de schimbare. O modificare mică în `index.html`, fără date noi, fără actualizare
săptămânală, nu strică nimic. **Fără asta, orice altceva de pe lista asta e decor.**

**(b) Apoi unitatea de lucru de 5 minute** — C2 reparat. E răspunsul direct la „elevii prezintă
prea puțin interes": azi nu există pe sit *nimic* care se poate termina repede. Mecanismul există;
de făcut: cele 239 de atomi fără întrebare, și regula pentru cele 44% din afara atomilor
(propunere: intro rămâne înainte, exercițiile după, se feliază doar șirul de atomi).

**(c) Apoi „Ce învățăm acum" — dar din structura anului, nu din orar.** Azi = **Modulul 1
(7 sept – 23 oct 2026)**. Asta e sigur și mecanic, spre deosebire de orar. Acoperă toate cele 11
categorii de elevi, nu 4. În aceeași trecere: cele 77 de date moarte și anul ars în `active-module.js`.

**(d) Apoi rutarea:** profilul ca **al doilea câmp** (nu id schimbat), ca elevul de a 9-a artistic
să ajungă direct la clasa lui.

**(e) La urmă**, cele 19 pagini din `artistic/cls12` care sunt lecții de 3000-4900 de cuvinte
deghizate în cuprins, fără atomi și fără motor de progres.

## 6. Ce se face în ordine

1. „Tu ești?" la intrare + buton de schimbare a elevului. *(mic, izolat)*
2. Cele 239 de atomi fără întrebare. *(mecanic, cu verificare adversarială — precedentul din
   `JOURNAL.md` spune că o rescriere în masă a introdus defecte în 43% din lecțiile atinse)*
3. Modul „pas cu pas" peste gating-ul existent, probat întâi pe o singură clasă reală.
4. `school_year_2026_2027.json` din fișa ISJ + reparat `active-module.js` + cele 77 de date moarte.
5. Profilul ca al doilea câmp + rutare directă.

## 7. Cum dovedim că a mers

- **(a)** Pe același browser, două profiluri diferite la rând: al doilea elev NU vede numele și
  progresul primului. Dovada: deschis în browser, nu citit în cod.
- **(b)** O lecție luată la întâmplare din cele 531 arată prima bucată sub 400 de cuvinte și
  „pasul 1 din N", cu N numărat din pagină. Și: din cele 239 de atomi fără întrebare, 0 rămân.
- **(c)** Schimbi data sistemului pe 15 noiembrie 2026 și pagina scrie „Modulul 2", fără să fie
  atins vreun fișier. Plus: căutarea celor 77 de tipare moarte întoarce 0.
- **(d)** Elev cu profil „clasa a 9-a + artistic" → ajunge la `content/liceu/artistic/cls9/`
  din **un** clic după ce-și spune cine e.

---

### Ce NU rezolvă nimic de mai sus
**„De ce s-ar întoarce mâine."** Toate cele cinci lucruri de mai sus fac situl utilizabil la oră,
în laborator, cu profesorul în sală. Niciunul nu e un motiv de întors acasă, seara. Dacă asta
e ținta, e o altă întrebare și cere altă analiză — nu o rezolvă un buton.
