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
