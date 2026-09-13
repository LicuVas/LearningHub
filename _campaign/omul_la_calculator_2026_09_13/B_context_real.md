# Modulul 1, TIC gimnaziu — contextul real (fapte + surse, fără presupuneri)

Generat: 2026-09-13. Unealtă folosită pentru inventarul mecanic: `B_inventar.py` (HTMLParser, fără librării externe) → `B_inventar.csv`, ambele în acest folder.

---

## 1. INVENTAR — cele 25 de lecții de Modul 1

Sursa exactă: `C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\B_inventar.csv` (generat de `B_inventar.py` din acest folder, rulat pe fișierele curente, fără `.bak_*`).

| Clasă | Fișier | Titlu | Cuvinte | Atomi | Itemi quiz | Exerciții | Are rezolvare |
|---|---|---|---|---|---|---|---|
| V | lectia1-calculator.html | Ce este un Calculator? | 2638 | 36 | 10 | 3 | da |
| V | lectia2-hardware.html | Componentele Hardware ale Calculatorului | 2997 | 30 | 7 | 3 | da |
| V | lectia3-software.html | Software - Programe si Aplicatii | 2515 | 30 | 8 | 3 | da |
| V | lectia4-ergonomie.html | Ergonomie si Sanatate la Calculator | 2764 | 30 | 6 | 3 | da |
| V | lectia5-reguli.html | Reguli in Laboratorul de Informatica | 3442 | 42 | 10 | 3 | da |
| V | lectia6-proiect.html | Proiect: Posterul Calculatorului Meu | 1933 | 24 | 6 | 3 | da |
| VI | lectia1-powerpoint-intro.html | Introducere in PowerPoint - Lectia 1 | 3110 | 30 | 10 | 4 | da |
| VI | lectia2-slide-uri.html | Lucrul cu Slide-uri - Lectia 2 | 3573 | 42 | 10 | 4 | da |
| VI | lectia3-text-imagini.html | Text si Imagini in Prezentari | 4655 | 60 | 12 | 3 | da |
| VI | lectia4-animatii.html | Animatii in Prezentari - Lectia 4 | 2993 | 30 | 10 | 3 | da |
| VI | lectia5-tranzitii.html | Tranzitii intre Slide-uri - Lectia 5 | 2627 | 30 | 10 | 3 | da |
| VI | lectia6-proiect.html | Proiect Final: Prezentare Completa | 2859 | 48 | 16 | 3 | da |
| VII | lectia1-interfata-word.html | Interfata Microsoft Word | 4341 | 143 | 11 | 3 | da |
| VII | lectia2-formatare-text.html | Formatarea Textului | 4232 | 130 | 10 | 3 | da |
| VII | lectia3-paragrafe.html | Paragrafe si Aliniere | 4699 | 130 | 10 | 3 | da |
| VII | lectia4-liste.html | Liste cu Marcatori si Numerotate | 4366 | 130 | 10 | 3 | da |
| VII | lectia5-tabele.html | Tabele in Word | 8055 | 143 | 11 | 3 | da |
| VII | lectia6-evaluare.html | Evaluare Word | 3738 | 143 | 11 | 3 | da |
| VIII | lectia1-interfata.html | Interfata Excel - Celule si Navigare | 2653 | 54 | 9 | 3 | da |
| VIII | lectia2-date.html | Introducerea si Formatarea Datelor | 3204 | 42 | 7 | 3 | da |
| VIII | lectia3-formule.html | Formule de Baza in Excel | 2456 | 42 | 7 | 3 | da |
| VIII | lectia4-functii.html | Functii Excel: SUM, MIN, MAX, AVERAGE, COUNT, IF | 3102 | 54 | 9 | 3 | da |
| VIII | lectia5-grafice.html | Grafice si Vizualizarea Datelor | 3086 | 54 | 9 | 3 | da |
| VIII | lectia6-proiect.html | Proiect: Catalog Scolar Complet | 2365 | 30 | 5 | 3 | da |
| VIII | lectia7-sortare.html | Sortare dupa Criterii in Excel | 2208 | 36 | 6 | 3 | da |

**Note de metodă (ca să nu fie citite ca adevăr absolut):**
- „Rezolvare" = detectat fie prin clasă/id (`rezolvare`, `model-raspuns`, `solutie`), fie prin cuvinte-cheie în tot HTML-ul brut ("rezolvare", "model de răspuns", "răspuns corect", "soluție model"). Toate cele 25 au ieșit `True` — de verificat manual dacă e o soluție model REALĂ sau doar cuvântul apare într-un titlu/hint (nu am validat vizual conținutul).
- „Quiz" = numărul de obiecte `{"question": ...}` găsite în atributele `data-quiz` (JSON inline în HTML). Un atom poate avea 1 sau mai multe întrebări.
- „Exerciții" = elemente cu clasa exactă `practice-exercise` (containerul, nu titlul/header-ul lui — prima versiune a scriptului confunda cele trei și umfla numărul de 3x; corectat înainte de raportul final).
- cls7/lectia6-evaluare.html mai are o copie `.bak_atomid_20260904` — ignorată, cum s-a cerut.

---

## 2. CE PREDĂ EFECTIV ANUL ACESTA (planul 2026-2027)

Sursă: `C:\00\Projects\Info_Gimnaziu_2026\STARE.md`, `SISTEM_EVALUARE.md`, `planificari\Planificare_calendaristica_clasa_*.md`, `planificari\Proiectul_unitatii_*-U1.md` / `*-E0.md`, `planificari\Calendar_ore_*.md`.

**Programa:** OMEN nr. 3393/28.02.2017, anexa 2 (Informatică și TIC, V-VIII, neschimbată). Standardele de evaluare (Anexa 15): O.ME nr. 4.615/2026 — se aplică din 2026-2027. (Sursă: `SISTEM_EVALUARE.md` §1.)

### Unitatea de învățare care corespunde „Modulului 1" de pe site, pe clasă

| Clasă | Cod unitate + titlu | Nr. ore U1 | Competențe (OMEN 3393/2017) | Fereastra calendaristică M1 (calendar) |
|---|---|---|---|---|
| V | V-U1 „Sisteme de calcul. Lucrez corect și în siguranță" (+ V-E0 „Deschiderea anului") | 6 (+1 E0) | CS.1.1 — Utilizarea eficientă și în condiții de siguranță a dispozitivelor de calcul | 11.09–23.10.2026 (Brauner, 5AM/5M, vineri 9:00); 6A/6M, vineri 8:00 |
| VI | VI-U1 „Prezentări digitale" (+ VI-E0) | 9 (+1 E0) | CS.1.1 — utilizarea instrumentelor pentru prezentări · CS.3.1 — elaborarea de prezentări | 08.09–23.10.2026 (Izvoare, marți 9:00) / 11.09–23.10.2026 (Brauner 6A/6M, vineri 8:00) |
| VII | VII-U1 „Tehnoredactare: editorul de texte" (+ VII-E0) | 9 (+1 E0) | CS.1.1 — editarea/tehnoredactarea de documente · CS.3.1 — elaborarea de documente utile | 08.09–20.10.2026 (Izvoare VII A/VII B, marți 10:10/11:10) / 11.09–20.10.2026 (Brauner 7 MA, vineri 10:00, cu rezerva „liber o dată la 2 săptămâni" NECONFIRMATĂ) |
| VIII | VIII-U1 „Calcul tabelar" (+ VIII-E0) | 12 (+1 E0) | CS.1.1 — utilizarea foilor de calcul tabelar · CS.3.1 — elaborarea de produse informatice cu calcul tabelar | 08.09–23.10.2026 (Izvoare, marți 8:00) / 11.09–23.10.2026 (Brauner 8A/8M, vineri 11:00) — **dar VIII-U1 continuă și în calendarul M2** (vezi mai jos) |

### Mapare oră-cu-oră ↔ fișier de pe LearningHub

**Clasa V** (V-E0 ora1 + V-U1 orele 2-7 = exact ora-cu-oră cu folderul `m1-sisteme`):
| Ora plan | Tema din planificare | Fișier LearningHub |
|---|---|---|
| 1 (E0) | Criteriile de evaluare + evaluare inițială | — (fișă tipărită, `Saptamana1_clasa_V.pdf`; nu are corespondent HTML) |
| 2 | Norme de securitate în laborator. Poziția corectă | lectia4-ergonomie.html (tematic; nu e ora 2 exactă, dar e singura despre ergonomie/reguli) |
| 3 | Sisteme de calcul din viața cotidiană | lectia1-calculator.html |
| 4 | Structura generală, rolul componentelor hardware | lectia2-hardware.html |
| 5 | Dispozitive de intrare/ieșire/intrare-ieșire | — nu corespunde (nicio lecție dedicată strict acestui subiect; parțial acoperit în lectia2-hardware.html) |
| 6 | Dispozitive de stocare, unități de măsură | — nu corespunde direct (subiect neacoperit distinct în cele 6 fișiere) |
| 7 | Evaluare sumativă: sisteme de calcul | — nu corespunde (nu există fișier „evaluare" la clasa V; testul e `Test_V-U1.pdf`, în afara site-ului) |
| — | (fără corespondent în plan) | lectia3-software.html — subiectul „software" NU apare explicit ca oră separată în V-U1 (planul vorbește doar de hardware); ar aparține de fapt unității V-U2 „Sistemul de operare", nescrisă încă |
| — | (fără corespondent în plan) | lectia5-reguli.html — se suprapune parțial cu ora 2 (norme de siguranță) |
| — | (fără corespondent în plan) | lectia6-proiect.html — mini-proiect; planul V-U1 NU are oră de mini-proiect (spre deosebire de VI/VII/VIII-U1) |

**Constatare cheie clasa V:** planul calendaristic (36 de ore/an, V-U1 = 6 ore stricte: securitate, evoluție istorică, structură/hardware, I/O, stocare, evaluare) și cele 6 fișiere de pe site (calculator, hardware, software, ergonomie, reguli, proiect) **nu se suprapun 1:1** — site-ul are „software" (care în plan e la altă unitate) și „proiect" (care în plan V-U1 nu există ca oră), dar îi lipsesc dedicat „dispozitive de intrare/ieșire" și „dispozitive de stocare" ca lecții separate.

**Clasa VI** (VI-U1 „Prezentări digitale", orele 2-9 predare + 9 mini-proiect + 10 evaluare):
| Ora plan | Tema | Fișier |
|---|---|---|
| 2 | Interfața aplicației de prezentări | lectia1-powerpoint-intro.html |
| 3 | Creare, deschidere, salvare, închidere | — parțial în lectia1 (nu are fișier dedicat) |
| 4 | Structura: diapozitive și obiecte | lectia2-slide-uri.html |
| 5 | Editare: inserare, copiere, mutare, ștergere | — parțial în lectia2 |
| 6 | Formatarea textului, obiectelor, diapozitivelor | lectia3-text-imagini.html (parțial) |
| 7 | Efecte de animație și tranziție | lectia4-animatii.html + lectia5-tranzitii.html (site-ul a împărțit în 2 lecții ce planul are într-o singură oră) |
| 8 | Reguli de estetică și ergonomie | — nu corespunde (nicio lecție dedicată) |
| 9 | Mini-proiect | lectia6-proiect.html |
| 10 | Evaluare sumativă | — nu corespunde (nu există fișier de evaluare la clasa VI) |

**Clasa VII** (VII-U1 „Tehnoredactare", orele 2-9 predare + 9 mini-proiect + 10 evaluare):
| Ora plan | Tema | Fișier |
|---|---|---|
| 2 | Interfața aplicației, instrumente de bază | lectia1-interfata-word.html |
| 3 | Gestionare document | — parțial în lectia1 |
| 4 | Obiecte: text, imagini, tabele | lectia5-tabele.html (parțial — tabelele) |
| 5 | Editare: copiere, mutare, ștergere | — nu corespunde direct |
| 6 | Formatarea textului și paragrafului | lectia2-formatare-text.html + lectia3-paragrafe.html |
| 7 | Formatarea imaginii, tabelului, paginii | lectia4-liste.html (parțial — listele nu apar explicit ca oră în plan!) |
| 8 | Reguli de tehnoredactare și estetică | — nu corespunde |
| 9 | Document după specificații (mini-proiect) | — nu corespunde (site-ul NU are lecție de mini-proiect la clasa VII, spre deosebire de V/VI/VIII) |
| 10 | Evaluare sumativă | lectia6-evaluare.html — **singura clasă unde site-ul chiar are o lecție de evaluare** |

**Constatare:** clasa VII e singura cu potrivire bună pe evaluare, dar îi lipsește lecția de mini-proiect (ora 9), iar „Liste cu marcatori" de pe site nu apare deloc ca oră explicită în planul VII-U1 (acolo listele s-ar încadra tot la „formatarea textului").

**Clasa VIII** (VIII-U1 „Calcul tabelar", 12 ore — depășește fereastra calendar-M1):
| Ora plan | Modul calendar | Tema | Fișier |
|---|---|---|---|
| 2 | M1 | Interfața, structura registrului | lectia1-interfata.html |
| 3 | M1 | Operații cu registrul și foile | — nu corespunde direct |
| 4 | M1 | Adresa de celulă | — nu corespunde direct |
| 5 | M1 | Tipuri de date | lectia2-date.html |
| 6 | M1 | Formatarea rândurilor/coloanelor/celulelor | — nu corespunde direct |
| 7 | M1 | Formule cu operatori aritmetici | lectia3-formule.html |
| 8 | **M2** | Funcții: sumă, maxim, minim, medie | lectia4-functii.html |
| 9 | **M2** | Funcția de decizie | — nu corespunde (IF apare doar ca titlu în lectia4-functii, nu ca oră separată) |
| 10 | **M2** | Sortarea datelor | lectia7-sortare.html |
| 11 | **M2** | Grafice | lectia5-grafice.html |
| 12 | **M2** | Mini-proiect | lectia6-proiect.html |
| 13 | **M2** | Evaluare sumativă | — nu corespunde |

**Constatare cheie clasa VIII (cea mai importantă mismatch găsită):** folderul `content\tic\cls8\m1-excel-fundamente` de pe site NU corespunde ferestrei calendaristice „Modulul 1" a școlii (08.09–23.10.2026, orele 2-7). El acoperă de fapt **întreaga unitate VIII-U1** (12 ore de predare, orele 2-13), care în calendarul real al școlii se întinde pe **Modulul 1 ȘI Modulul 2** (03.11-08.12.2026). Trei din cele șapte fișiere ale site-ului (`lectia4-functii`, `lectia5-grafice`, `lectia6-proiect`, `lectia7-sortare`) predau conținut care, în calendarul 2026-2027, se ține abia în noiembrie-decembrie — nu în fereastra de audit „Modul 1" (sept-oct). „M1" de pe site = numerotarea proprie a materialului (prima unitate scrisă), nu modulul calendaristic M1 al școlii.

---

## 3. REALITATEA DIN LABORATOR

Surse: `C:\ObsidianVaults\Scoala\DumbravaRosie\Incadrare 2026-2027 — Dumbrava Rosie.md`, `C:\ObsidianVaults\Scoala\LiceulArteBrauner\Incadrare 2026-2027 — Liceul de Arte Victor Brauner.md`, `C:\ObsidianVaults\Scoala\Informatica_Gimnaziu_2026-2027\00_START — Informatica si TIC, gimnaziu 2026-2027.md`, `C:\ObsidianVaults\Scoala\Informatica_Gimnaziu_2026-2027\Povesti si alte strategii de predare — informatica gimnaziu.md`, memoria `project_orar_2026_2027.md`.

**Două locații, două situații complet diferite:**

1. **Izvoare (Dumbrava Roșie)** — clasele VI, VII A, VII B, VIII, marți 8:00-12:00 (4 ore la rând).
   - **RISC MAJOR, marcat explicit în vault: probabil NU există laborator/calculatoare pentru gimnaziu.** Clădirea „Școala Gimnazială Nr. 1 Dumbrava Roșie" a fost demolată; clasele s-au mutat la Școala Primară Nr. 2 Izvoare, o școală primară mică. (`Incadrare... Dumbrava Rosie.md`, secțiunea `^fara-calculatoare`, ultima actualizare 06.09.2026.)
   - Strat mai recent (fișierul de strategii de predare, nedatat exact, dar ulterior): „la Izvoare, unde nu am laborator" — scris deja ca **premisă de lucru**, nu doar ca risc. (`Povesti si alte strategii de predare...md`, linia 128.)
   - Ca urmare, planul de conținut include explicit varianta **pe hârtie** („caietele" — plan A, nu plan B) pentru aceste clase; materialele sunt gândite să funcționeze "și fără laborator" (`00_START...md`, linia 100-101).
   - **NECONFIRMAT la data acestui audit (13.09.2026):** dacă există totuși un calculator sau un videoproiector la Izvoare — întrebarea era încă deschisă în vault la 06-09.09.2026 (de pus doamnei Archip/Chifu). NU am găsit în vault sau în memorie o confirmare ulterioară că s-a lămurit.
   - Nr. clase/elevi: structura e cunoscută (VI, VII A, VII B, VIII, câte o clasă/nivel, total 4 clase la Izvoare), dar **numărul de elevi per clasă NU e în sistem** — `project_baza_elevi.md` spune explicit „lipsesc NUMELE" și bazele sunt goale (0 elevi introduși la 03.09.2026); nu am căutat mai departe date personale despre minori, conform interdicției din task.

2. **Liceul de Arte „Victor Brauner"** — clasele 5AM/5M, 6A/6M, 7 MA, 8A/8M, vineri.
   - **Există un laborator dedicat**, sala „1 (TIC)". Confirmat din orarul claselor-pereche: 6A, 5AM, 7MA sunt programate în sala „1 (TIC)"; clasele-pereche (6M, 5M) sunt în alte săli (4, 5). (`Incadrare... Victor Brauner.md`, liniile 303-315.)
   - **Ambiguitate nerezolvată:** la fiecare pereche ambele clase au „TIC TEHN" scris la aceeași oră, dar o singură clasă e fizic în laborator. Ipoteze nerezolvate: fie clasele-pereche alternează laboratorul de la o săptămână la alta, fie sălile 4/5/8 sunt ale altui profesor de informatică (Lazăr Dorina, menționată ca „profesoară de T.I.C." la Dumbrava Roșie într-un tabel de personal — de întrebat despre laborator, conform vaultului). NU am găsit o rezolvare ulterioară.
   - **De confirmat, nerezolvat la 13.09.2026:** dacă sala e "laborator sau clasă obișnuită, în fiecare din cele două zile" (item deschis explicit în vault).

**Ce NU se știe (necunoscute reale, nu presupuneri):**
- Sistemul de operare instalat pe stațiile din laboratoare — NU AM GĂSIT nicio mențiune (nici pe Windows, nici altceva) în vault/memorie pentru laboratoarele școlii.
- Versiunea de Office/LibreOffice instalată pe calculatoarele elevilor — NU AM GĂSIT.
- Limba interfeței (RO/EN) pe calculatoarele școlii — NU AM GĂSIT.
- Acces la internet, conturi de elevi, proiector — NU AM GĂSIT date explicite (doar întrebarea „există măcar un videoproiector" rămasă deschisă pentru Izvoare).
- Numărul exact de calculatoare funcționale, dacă există — NU AM GĂSIT (nici măcar pentru Brauner, unde se știe doar că EXISTĂ o sală numită „1 (TIC)").

**Concluzie pentru lecții:** cele două școli sunt în situații opuse — Brauner are probabil laborator (cu ambiguitate de programare), Izvoare probabil NU are, și acolo lecțiile digitale (PowerPoint/Word/Excel „la calculator") riscă să nu poată fi rulate practic în cele 4 ore de marți; sistemul intern deja tratează asta ca risc real, nu ipotetic.

---

## 4. SOFTWARE-UL PE CARE ÎL PRESUPUN LECȚIILE

### 4a. Limba interfeței folosite în text (Engleză vs Română), pe fișier

Contorizare mecanică (grep, cuvinte întregi) a numelor de tab-uri/ribbon în engleză (File, Home, Insert, Design, Transitions, Animations, Slide Show, Review, View, Format, Data, Formulas, Ribbon) vs echivalentele românești (Fișier, Pornire, Inserare, Proiectare, Tranziții, Animații, Vizualizare, Revizuire, Format(are), Date, Formule):

| Fișier | Termeni EN | Termeni RO |
|---|---:|---:|
| cls5/lectia1-calculator | 13 | 19 |
| cls5/lectia2-hardware | 12 | 13 |
| cls5/lectia3-software | 15 | 24 |
| cls5/lectia4-ergonomie | 12 | 1 |
| cls5/lectia5-reguli | 29 | 9 |
| cls5/lectia6-proiect | 14 | 6 |
| cls6/lectia1-powerpoint-intro | 131 | 17 |
| cls6/lectia2-slide-uri | 69 | 13 |
| cls6/lectia3-text-imagini | 80 | 38 |
| cls6/lectia4-animatii | 39 | 49 |
| cls6/lectia5-tranzitii | 37 | 41 |
| cls6/lectia6-proiect | 69 | 28 |
| cls7/lectia1-interfata-word | 171 | 25 |
| cls7/lectia2-formatare-text | 97 | 65 |
| cls7/lectia3-paragrafe | 97 | 27 |
| cls7/lectia4-liste | 84 | 14 |
| cls7/lectia5-tabele | 158 | 40 |
| cls7/lectia6-evaluare | 143 | 48 |
| cls8/lectia1-interfata | 44 | 34 |
| cls8/lectia2-date | 91 | 62 |
| cls8/lectia3-formule | 43 | 18 |
| cls8/lectia4-functii | 18 | 13 |
| cls8/lectia5-grafice | 71 | 39 |
| cls8/lectia6-proiect | 20 | 37 |
| cls8/lectia7-sortare | 47 | 6 |

**Citire calitativă (verificat manual pe cls6/lectia1 și cls7/lectia1, textul lecțiilor efectiv):** cele DOI fișiere verificate manual predau explicit denumirile ENGLEZE ale tab-urilor din Ribbon — „Home, Insert, Design, Transitions, Animations, Slide Show, Review, View" (PowerPoint, cls6) și „File, Home, Insert" (Word, cls7) — inclusiv exercițiul „găsește tab-urile din Ribbon: Home, Insert, Design...". Numărul mare de termeni „RO" din tabel vine mai ales din cuvinte generice românești (ex. „format", „date" ca substantiv comun, nu ca tab) prinse de regex, nu din meniuri traduse — deci contorul „RO" din tabel **supraestimează** termenii românești reali de interfață; citirea calitativă (nu contorul brut) e concluzia de reținut: **lecțiile predau interfața Office în ENGLEZĂ.**

### 4b. Versiune Office / separator formule / SUM vs SUMA

- Nicio mențiune explicită de "Office 2016/2019/365" sau "LibreOffice" ca text intenționat (cele câteva potriviri de mai sus la cls6/lectia5-tranzitii și cls7/lectia1 sunt incidentale — nu am confirmat manual context; posibil fals-pozitiv din combinații de cuvinte comune).
- **Funcții:** clasa VIII folosește exclusiv `SUM`, `MIN`, `MAX`, `AVERAGE`, `COUNT`, `IF` — denumirile englezești (titlul lectia4-functii.html: "Functii Excel: SUM, MIN, MAX, AVERAGE, COUNT, IF"). Nu am găsit nicio apariție a formei românești `SUMA` în cele 7 fișiere cls8.
- **Separator de argumente în formule:** găsit INCONSECVENT în corpus —
  - lectia1-interfata.html: 1 formulă cu virgulă, 0 cu punct-virgulă
  - lectia3-formule.html: 1 cu virgulă, 0 cu punct-virgulă (plus 24 potriviri simple de `SUM(`)
  - lectia4-functii.html: **3 cu punct-virgulă ȘI 4 cu virgulă** — amestecate în același fișier
  - lectia6-proiect.html: **5 cu punct-virgulă ȘI 6 cu virgulă** — amestecate în același fișier
  - **Constatare:** lecțiile de clasa VIII amestecă separatorul englezesc (virgulă, ex. `=SUM(A1,B1)`) cu cel din Excel-ul localizat românește (punct-virgulă, ex. `=SUM(A1;B1)`) — o inconsecvență reală care poate deruta un elev care lucrează pe Excel în română (unde virgula NU funcționează ca separator de argumente). Nu am verificat vizual fiecare formulă individual (efort mecanic, nu manual) — recomand verificare țintită înainte de predare.

### 4c. Office instalat PE ACEST CALCULATOR (nu pe cele de la școală)

Interogare registry, doar-citire (`HKLM\SOFTWARE\Microsoft\Office\ClickToRun\Configuration`, `HKCU\...\LanguageResources`):

| Cheie | Valoare |
|---|---|
| ProductReleaseIds | `ProPlus2021Retail` (Office 2021 Professional Plus) |
| VersionToReport | `16.0.20326.20144` |
| Platform | `x64` |
| ClientCulture | `en-us` |
| UILanguageTag (HKCU LanguageResources) | `en-us` |
| PreferredEditingLanguage | `ro-RO` |

**Interpretare:** pe calculatorul acesta (al lui Vasile, NU al școlii), Office e instalat cu interfața (meniuri/ribbon) în **ENGLEZĂ** (`en-us`), deși limba de editare/corectare preferată e română. Asta se potrivește cu ce predau lecțiile (interfață engleză) — DAR nu spune nimic despre ce au calculatoarele din laboratoarele școlii (secțiunea 3 — necunoscut).

---

## 5. CUM SE RANDEAZĂ LECȚIILE

Sursă: `C:\00\Projects\LearningHub\content\tic\cls5\m1-sisteme\lectia1-calculator.html` (tag-uri `<script>`), `C:\00\Projects\LearningHub\tools\site_audit.py`.

**Scripturi JS încărcate de o lecție tipică** (calea relativă la `assets/js/`):
```
atomic-learning.js   practice-simple.js   lesson-summary.js
breadcrumb.js        progress.js          user-system.js
site-credit.js (defer)
```
plus un bloc `<script>` inline propriu fiecărei lecții (conținutul lecției / configurare).

**Gating exerciții/soluții:** NU există gating real la nivel de HTML servit — am căutat `locked|gated|paywall|premium|display:none|hidden` în lecțiile cu formule (cls8/lectia3-formule.html) și singurul rezultat e `#lesson-summary` (`display:none`, dezvăluit probabil de `lesson-summary.js` la final de lecție — nu e un mecanism de protecție a răspunsurilor). Răspunsurile de quiz sunt scrise direct în atributul `data-quiz` (JSON, ex. `{"correct": "b", ...}`) — **vizibile oricui deschide "View Source"**, deci nu sunt protejate contra copiatului, doar ascunse vizual de JS până la interacțiune.

**Unealta de audit existentă** — `C:\00\Projects\LearningHub\tools\site_audit.py` (primele 10 linii, docstring): verifică pe TOATE lecțiile HTML: (1) erori de sintaxă JS (ghilimele neescapate în template literals), (2) includeri de script lipsă/greșite, (3) inițializare breadcrumb lipsă, (4) conținut schelet (prea subțire ca să fie o lecție reală), (5) probleme de inițializare a sistemului de quiz, (6) linkuri interne rupte.

---

## Fișiere produse de acest audit
- `C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\B_inventar.py` — scriptul mecanic (HTMLParser)
- `C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\B_inventar.csv` — tabelul brut, 25 rânduri
- `C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\B_context_real.md` — acest document
