# Lecții care predau altceva decât promite cartonașul

**Găsit: 04.09.2026.** Zece cazuri în care elevul dă clic pe un subiect și ajunge la altul.
Nu sunt greșeli de tipar — sunt lecții întregi așezate în sloturi greșite, iar subiectul
promis nu se predă nicăieri în acel modul.

## Cum le-am găsit

Prima încercare a comparat cartonașul din index cu conținutul fișierului: **110 semnalări**,
majoritatea false (titlul cartonașului prinde uneori butonul „Începe →", iar pluralul
românesc — `sortari` vs `sortare` — strica orice potrivire pe cuvinte).

A doua încercare compară **numele fișierului** cu `<h1>` + titlurile atomilor din acel fișier,
cu tăiere la rădăcină (6 litere) și o listă de sinonime (`web`≡`pagini`≡`html`,
`calcul`≡`excel`≡`tabelar`, …): **21 de semnalări**. Din ele, 11 sunt titluri motivaționale
legitime („Vreau să iau decizii complexe în Excel!" pentru lecția de funcții logice) sau
sinonime reale (`birotică` = `suite office`). **Rămân 10 reale**, confirmate prin citire.

Unealta: `scratchpad/nume_vs_continut.py` → `nume_vs_continut.json`.
Clasificarea automată duplicat/gaură a fost **abandonată** — marca „gaură" și acolo unde
cartonașul e identic cu pagina. Tabelul de mai jos e făcut prin citire, nu prin scor.

## Cele 10, cu ce predau vecinii din modul

### 1. `liceu/mat-info/cls12/m3-web/lectia1-html-css-review.html` — cel mai grav
Cartonașul: **HTML/CSS Recapitulare**. Pagina: **Baze de date relaționale și SQL**.
Restul modulului: Design Responsive · Introducere în JavaScript · Proiect pagină web.
O lecție de la altă materie a căzut în modulul de web. Recapitularea HTML/CSS lipsește,
iar SQL apare fără să fie anunțat nicăieri.

### 2-3. `liceu/militar/cls11` — două module amestecate între ele
| fișier | ce promite | ce predă |
|:--|:--|:--|
| `m1-prezentari-multimedia/lectia1-prezentare-eficienta` | Prezentări electronice | Fluxuri de producție multimedia |
| `m1-prezentari-multimedia/lectia2-audio-video` | — | Conținut audio-video |
| `m2-imagini-web/lectia1-imagine-digitala` | — | Prelucrări audio și audio-video |
| `m2-imagini-web/lectia2-pagini-web` | Pagina web: structura HTML | Prelucrarea imaginilor digitale |

Toate patru sunt despre multimedia. **Prezentările nu se predau deloc. Web nu se predă deloc.**
Iar `m2/lectia1` (audio-video) e o a doua lecție de audio, care ar aparține lui m1.

### 4. `liceu/tehnologic/cls12/m1-competente-digitale` — 3 din 6 lecții pe alt subiect
| cartonaș (competența de bacalaureat) | ce predă pagina |
|:--|:--|
| sistemul de calcul și gestionarea fișierelor | Structura unui site web și HTML de bază |
| procesare de text | Procesare de text ✅ |
| **calcul tabelar** | Instrumente și structura unui site web |
| **prezentări electronice și internet** | Site web și Management de proiect |
| editare de imagini | Editare de imagini de bază ✅ |
| proiect integrator | Proiect integrator: site web ✅ |

Modulul se numește „competențe digitale" și pregătește proba practică de bacalaureat.
**Calculul tabelar — o competență de examen — nu se predă nicăieri.** În locul lui, modulul
predă de trei ori construirea unui site.

### 5. `liceu/pedagogic/cls11/m2-imagini-web/lectia1-imagine-digitala`
Promite imaginea digitală (raster vs vectorial, DPI, modele de culoare).
Predă **tehnici de documentare asistată** (stiluri Word, cuprins automat, note de subsol) —
conținut care aparține modulului de procesare de text. Imaginea digitală lipsește.
`lectia2` e corectă (pagina web).

### 6. `liceu/pedagogic/cls9/m2-societate-digitala/lectia2-drepturi-gdpr`
Promite drepturi de autor și licențe. Predă **internet și comunicare digitală** — subiect
care se suprapune cu `lectia3` (comunicare digitală și AI). Drepturile de autor lipsesc.

### 7. `liceu/stiinte/cls9/m1-sisteme-retele/lectia2-retele-internet`
Promite rețele de calculatoare. Predă **componenta software** (sisteme de operare și aplicații).
`lectia1` predă componentele hardware. Deci modulul e „hardware + software", corect ca pereche —
dar **rețelele, din chiar numele modulului, nu se predau**.

### 8. `liceu/mat-info/cls10/m3-retele-securitate/lectia1-retele-internet`
Promite „Cum funcționează internetul". Predă **securitate cibernetică**. Celelalte trei lecții:
HTTP/HTTPS, backup, securitate avansată. Tot modulul e securitate; **partea de rețele lipsește**.

### 9. `tic/cls5/extra-siguranta-backup/lectia4-prezentari-intro`
Promite „Prima mea prezentare". Predă **cyberbullying**. Aici conținutul e la locul potrivit
(modulul e despre siguranță online) — **doar eticheta e greșită**. Cel mai ieftin de reparat.
De notat: `lectia5` din același modul chiar predă design de prezentări, într-un modul de siguranță.

### 10. `liceu/mat-info/cls9/m3-tic-baze/lectia2-suite-office` — de verificat, probabil fals pozitiv
Cartonașul „Suite Office", pagina „Birotică: documente și prezentări profesionale". Același
lucru, alt cuvânt. **Nu necesită reparație.**

## Ce se poate repara mecanic și ce nu

**Mecanic, fără să inventez nimic (se poate face oricând):** eticheta cartonașului să spună ce
predă pagina. Rezolvă minciuna vizibilă — elevul nu mai dă clic pe „calcul tabelar" ca să
nimerească pe „site web". NU rezolvă golul de programă.

**Nu se poate repara mecanic:** subiectele promise care nu se predau nicăieri. Sunt **7 lecții
noi de scris**, iar trei dintre ele sunt competențe de examen:

| clasă / modul | ce lipsește | miza |
|:--|:--|:--|
| tehnologic XII, m1 | **calcul tabelar** | competență la proba practică de bacalaureat |
| militar XI, m1 | **prezentări electronice** | competență de programă |
| militar XI, m2 | **pagina web / HTML** | competență de programă |
| mat-info XII, m3 | recapitulare HTML/CSS | pregătire pentru proiectul final |
| pedagogic XI, m2 | imaginea digitală (raster/vectorial, DPI) | competență de programă |
| pedagogic IX, m2 | drepturi de autor și licențe | competență de programă |
| știinte IX / mat-info X | rețele de calculatoare | competență de programă |

## De ce s-a întâmplat

Modulele au fost generate pe loturi, iar numele fișierelor au fost fixate ÎNAINTE de scrierea
conținutului. Când un agent a primit „scrie lecția 2 din modulul m2-imagini-web" fără să
i se spună ce predă lecția 1, a scris ce i s-a părut că urmează firesc — și a ieșit a doua
lecție de audio-video. Nimeni nu a comparat la final numele cu conținutul.

**Regula care lipsea:** după orice generare pe loturi, rulează comparația nume ↔ conținut.
E ieftină (secunde pe tot situl) și prinde exact eșecul pe care recitirea nu-l vede, fiindcă
fiecare lecție, citită singură, e bună.
