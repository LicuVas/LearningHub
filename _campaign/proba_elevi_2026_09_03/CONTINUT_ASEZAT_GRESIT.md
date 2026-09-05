# Lecții care predau altceva decât slotul lor

**04.09.2026.** Conținut întreg așezat în sloturi greșite. Subiectele promise nu se predau
nicăieri, iar unele lecții sunt scrise de două ori.

## Cum am ajuns la dovadă (trei încercări, doar a treia ține)

**1. Cartonaș din index vs. fișier — 110 semnalări, aproape toate false.** Titlul cartonașului
prinde uneori butonul („Începe →"), iar potrivirea pe cuvinte se rupe la primul plural
românesc (`sortari` vs `sortare`). Abandonat.

**2. Numele fișierului vs. `<h1>` + atomi — 21 de semnalări, 10 reale.** Mai bine, fiindcă
numele fișierului e fixat de om, nu de generator. Dar ratează cazurile unde un cuvânt generic
apare în ambele: `lectia1-documente-formatare.html` care predă *Foaia de calcul Excel:
structura și **formatare*** trece testul, deși e complet pe alt subiect.
Unealta rămâne utilă: `python tools/verifica_nume_continut.py` (semnalează, nu corectează —
11 din 21 erau titluri motivaționale legitime).

**3. Ce spun CELELALTE profiluri despre același slot — dovada.** Aceeași lecție există în 6
profiluri de liceu (artistic, militar, pedagogic, științe, tehnologic, umanist). Dacă patru
profiluri predau procesare de text la `m1-procesare-text/lectia1` și unul predă Excel, cel din
urmă e greșit — **iar dovada nu vine din euristica mea, ci din celelalte patru.** Un oracol
independent, nu încă o părere a mea. 21 de sloturi sunt comune la ≥3 profiluri.

## Ce arată tabelul (16 sloturi cu un profil în contratimp)

| slot | ce predau majoritatea | cine iese din rând |
|:--|:--|:--|
| cls9 m1/lectia1 (sisteme de calcul) | componentele sistemului | **pedagogic**: Windows și fișiere |
| cls9 m1/lectia2 (rețele) | rețele și Internet | **militar**: comunicare/colaborare · **științe**: componenta software |
| cls9 m2/lectia1 (identitate) | identitate digitală | **științe**: componenta software (a doua oară!) |
| cls9 m2/lectia2 (drepturi/GDPR) | drepturi de autor | **pedagogic**: internet și comunicare |
| cls10 m1/lectia1 (procesare text) | procesorul de text | **pedagogic**: Excel · **științe**: HTML |
| cls10 m1/lectia3 (corespondență) | îmbinare corespondență | **științe**: securitate · **tehnologic**: PowerPoint |
| cls11 m1/lectia1 (prezentări) | prezentări electronice | **militar**: fluxuri multimedia |
| cls11 m2/lectia1 (imagine) | imaginea digitală | **militar**: audio · **pedagogic**: documentare Word · **tehnologic**: date și informații |
| cls11 m2/lectia2 (pagina web) | HTML și CSS | **militar**: prelucrarea imaginilor |
| cls12 m1/lectia1 (sistem+fișiere) | sistem de calcul | **pedagogic**: documentare · **științe**: rețele · **tehnologic**: site web |
| cls12 m1/lectia2 (procesare text) | procesare text, probă D | **militar**: UI/UX · **umanist**: hipermedia |
| cls12 m1/lectia3 (**calcul tabelar**) | calcul tabelar, probă D | **pedagogic**: documentare · **tehnologic**: site web |
| cls12 m1/lectia4 (prezentări+internet) | prezentări și internet | **științe**: participare civică · **tehnologic**: site + management |
| cls12 m1/lectia5 (editare imagini) | editare de imagini | **umanist**: obiecte hipermedia |
| cls12 m1/lectia6 (proiect integrator) | proiect de competențe | **tehnologic**: proiect site web |

Datele brute: `sloturi_toate.py` (fără prag, fără scor — se citește direct).

## Cele două tipare din spate

**A. `tehnologic` clasa a XII-a a fost generat ca un curs de web.** Patru din șase lecții ale
modulului `m1-competente-digitale` predau construirea unui site: structura site-ului, instrumente
de site, site + management de proiect, proiect de site. Modulul pregătește **proba practică de
bacalaureat**. **Calculul tabelar — competență de examen — nu se predă nicăieri în el.**

**B. Aceeași lecție scrisă de două ori în același profil.** Test fără ambiguitate: dacă două
fișiere din același profil au același titlu și aceiași atomi, unul ocupă slotul altcuiva.

| profil | fișierele | cât de identice |
|:--|:--|:--|
| **științe** | `cls10/m3/lectia1-imagine-digitala` și `cls11/m2/lectia1-imagine-digitala` | **97,5% fișier la fișier** |
| **științe** | `cls10/m3/lectia2-editare-imagini` și `cls12/m1/lectia5-editare-imagini` | titlu 100%, atomi 100% |
| **pedagogic** | `cls11/m2/lectia1`, `cls12/m1/lectia1`, `cls12/m1/lectia3` | toate trei se cheamă „Tehnici de documentare asistată de calculator" |

Un elev de a XI-a de la științe primește **exact lecția de a X-a**. Un elev de a XII-a primește,
la competențe digitale, lecția de editare de imagini din clasa a X-a.

Fals pozitiv de reținut: `mat-info/cls11` DFS vs BFS — titluri 85% asemănătoare, atomi 13%.
Sunt două lecții diferite cu nume înrudite. Nu se atinge.

## Un al doilea defect, găsit de poarta nouă: cheile de progres se ciocnesc

`tools/verifica_lectie.py` verifică unicitatea cheii de progres. Rezultat pe tot situl:
**21 de chei folosite de 105 lecții**, iar în toate cele 21 de cazuri lecțiile au conținut
DIFERIT. Cheia arată așa: `cls10-m1-procesare-text-lectia1-documente-formatare` — **nu conține
profilul**. Deci cele șase versiuni de profil scriu în același loc din memoria browserului:
cine termină lecția la tehnologic o vede bifată și la umanist, deși e alt conținut.

Reparație: cheia trebuie să includă profilul (`tehnologic-cls10-m1-...`). Mecanică, dar atinge
105 fișiere — se face după ce se termină valurile care scriu acum în ele.

## De ce nu a prins nimeni asta până acum

Modulele au fost generate pe loturi, cu numele fișierelor fixate ÎNAINTE de conținut. Agentul
care a primit „scrie lecția 2 din `m2-imagini-web`", fără să știe ce predă lecția 1, a scris ce
părea firesc — și a ieșit a doua lecție de audio-video.

**Fiecare lecție, citită singură, e bună.** De-aia nici cele patru treceri cu cititori-elevi,
nici recitirile n-au prins-o. Defectul nu e în lecție, e în **relația** dintre lecții.

> **Regula:** după orice generare pe loturi, compară slotul cu ce predau frații lui din
> celelalte ramuri. Redundanța sitului e cel mai ieftin oracol independent pe care-l avem.

## Ce urmează

1. **După ce se termină valurile de rezolvări și aprofundare** (scriu acum în aceleași fișiere):
   rescrierea celor 16 sloturi, fiecare cu subiectul pe care i-l cere programa.
2. Cheile de progres să includă profilul — 105 fișiere, mecanic.
3. Golurile rămase de scris ca lecții noi, cu **calculul tabelar la tehnologic XII** primul:
   e competență de bacalaureat și acum lipsește cu totul.

---

## Adăugat 05.09.2026 — încă două lecții, găsite de corectorii valului t7b

Lista a crescut de la 22 la **24**. Ambele sunt în același slot: `cls9 / m1-sisteme-retele /
lectia2-retele-internet.html`, unde indexul modulului promite, la toate profilurile,
„Rețele de calculatoare și Internet — tipuri, componente, cum circulă datele".

| profil | ce predă de fapt lecția 2 | verdict |
|:--|:--|:--|
| tehnologic | Rețele de calculatoare și Internet | ✅ corect |
| umanist | Rețele de calculatoare și Internet | ✅ corect |
| pedagogic | Ce este o rețea, de la LAN la Internet | ✅ corect |
| **științe** | „Componenta software: sisteme de operare și aplicații" | ❌ **greșit** — și dublează lecția 1 a aceluiași modul |
| **militar** | „Comunicare și colaborare digitală" (e-mail, netichetă, rețele sociale) | ❌ **greșit**, dar cu alt subiect decât la științe |

**De ce contează:** la două profiluri de clasa a IX-a, competența *rețele și Internet*
(LAN/WAN, protocoale, adrese IP, siguranță online) **nu e predată nicăieri**. La științe,
elevul primește de două ori aceeași lecție despre software.

**Etaloanele pentru rescriere** sunt cele trei profiluri corecte, care au deja conținutul bun.

**Cum au ieșit la iveală:** un corector al valului t7b a semnalat cazul de la științe. Nu am
reparat doar acolo — am căutat aceeași lecție pe toate profilurile, și așa a apărut și cazul
militar, pe care nu-l semnalase nimeni. **Lecțiile de pe profiluri diferite sunt copii: un
defect găsit într-un profil trebuie căutat în toate.** Aceeași regulă a mărit reparațiile
casetelor de la 23 de semnalări la 38 de casete reale.

---

## Adăugat 05.09.2026, seara — lista crește de la 24 la 26, plus o decizie deschisă

**Cum au ieșit la iveală:** după rescrierea celor 24, corectorii au semnalat trei lecții în
care *cheia de progres* numea alt subiect decât fișierul. Prima reacție ar fi fost să rescriu
cheia. Am verificat întâi **ce predă lecția de fapt** — și la trei din șase cazuri găsite pe
tot situl, cheia spunea adevărul, iar **numele fișierului mințea**.

Renumirea oarbă a cheii ar fi ascuns două subiecte care nu se predau nicăieri.

| fișierul promite | lecția predă de fapt | verdict |
|:--|:--|:--|
| `mat-info/cls12/m2-algoritmi-eficienti/lectia1-matrice-avansate` | clasificare în Machine Learning (k-NN, arbore, sklearn) | ❌ **subiect de bacalaureat lipsă** — operațiile cu matrice nu se predau nicăieri |
| `mat-info/cls12/m3-web/lectia1-html-css-review` | baze de date relaționale și SQL | ❌ recapitularea HTML/CSS lipsește, deși lecțiile 2–4 se sprijină pe ea |
| `tic/cls5/extra-siguranta-backup/lectia4-prezentari-intro` | cyberbullying și comportament online | ⚠️ **decizie deschisă** (mai jos) |

Cele două de la mat-info au intrat pe listă. **Conținutul lor actual e bun în sine** (ML și
SQL nu se predau în altă parte) — de păstrat separat dacă vrei, nu de aruncat. Nu există
profil-frate cu lecția făcută corect: mat-info e unic, deci etaloanele dau doar forma și
adâncimea modulului, iar subiectul vine din cartonașul din `index.html`.

### Decizia deschisă — clasa a V-a, modulul „Siguranță digitală și multimedia"

| fișier | ce predă |
|:--|:--|
| `lectia3-date-personale` | datele mele personale |
| **`lectia4-prezentari-intro`** | **cyberbullying și comportament online** |
| `lectia5-prezentari-design` | design și animații (prezentări) |
| `lectia6-proiect` | proiect final: siguranță online |

Cyberbullying-ul se potrivește cu tema modulului și cu proiectul final. Dar **introducerea în
prezentări lipsește**, deși lecția 5 predă *design* de prezentări — deci elevul învață să
înfrumusețeze ceva ce n-a fost introdus.

Două ieșiri curate, la alegere: **(a)** redenumești fișierul în `lectia4-cyberbullying` și
muți introducerea în prezentări în altă parte a anului, sau **(b)** rescrii lecția 4 ca
introducere în prezentări și muți cyberbullying-ul lângă lecția 3 (datele personale).
Nu e o reparație mecanică — schimbă ordinea materiei.
