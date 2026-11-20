# Supliment la promptul rundei 17 (valul B-excel REDESCHIS, `B-excel#2`) — scris de orchestrator, 20.11.2026

Se citește DUPĂ `runde/17/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli). Citește ÎNTÂI
`runde/_paralel/CICLU_PARALEL.md`: runda ta merge în paralel cu Explorer (r15) și Word (r16), iar regulile de acolo (fișiere
proprii/comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`) bat pașii 1 și 7 din prompt.

## Unde suntem
- **Valul Excel s-a oprit după runda 10** pe limita de 6 rânduri, cu 3 GRAV deschise (`runde/10/raport.md`, `runde/10/critic.md:34`, `:64`, `:129`). Deblocatorii, din `runde/10/raport.md:56-62`:
  - **X10** — o rundă `acoperire`: FĂCUTĂ azi, `runde/14/acoperire_excel.md` (ACOPERIRE_GATA). Referințele noi:
    - `referinte/uia_excel.json` › blocul `acoperire_r14` și listele `lista.ChartTypeLineInsertGallery`, `lista.AddChartElementMenu`, `lista.AddChartElementMenu#Data Labels` (Line și Clustered Column au liste diferite);
    - 11 scenarii noi în `scenarii/excel/` și `referinte/scenarii_real/` (tabelul din `acoperire_excel.md` §4).
  - **A1 și T1** — o rundă de reparații, fără nimic de la Vasile. Asta e runda ta.
- **De atunci s-au schimbat fișiere comune:** PowerPoint r11-r14 a atins `aplicatii.js`, `panglica.js`, `aplicatii.css` (Esc → `tasta_esc`, Alt + literă în ferestre, KeyTips).
  - **Pasul tău zero:** reproduci fiecare GRAV pe codul de azi.
- **Pornirea măsurată:** `runde/17/masurare_pornire.json`. Unghiul rundei: `stare_finala_erori`.

## Ținta rundei 17, în ordinea pagubei pentru elev
1. **X10** (`runde/10/critic.md:34`) — lecția `lectii/viii/m2-l11` se duce la capăt cu graficul Line și etichetele de date.
   - Insert › Insert Line or Area Chart ▾ deschide galeria din referință (grupurile, numele, tastele de acces). Line inserează graficul cu seriile și categoriile pe care le-a dat Excel real (scenariul `excel-grafic-line-galerie`).
   - Chart Design › Add Chart Element ▾ deschide lista din referință; Data Labels ▸ dă submeniul potrivit tipului de grafic (Line ≠ Clustered Column).
   - Alegerea pune etichetele în `stare()` (cheia o iei din api §5 dacă există; dacă nu există, propunerea merge în `de_aprobat.md` ca `A17-…` și folosești forma propusă).
   - Merge și cu mouse-ul, și cu tastele (Alt, J C, A, D, …), cu evenimentul §4 pe fiecare.
   - Scenariile `excel-grafic-line-data-labels-right` și `excel-grafic-coloane-data-labels-outside-end` trec.
2. **Vărsarea** — scenariile `excel-varsare-*` și `excel-ctrl-*` din aceeași acoperire, dacă nu trec azi: `#SPILL!`, Ctrl+săgeți peste celulele vărsate, Ctrl+↓ până la A1048576, Ctrl+→ până la XFD.
   - Faptele R10-3, R10-5, R10-6 din `de_verificat.md` sunt acum dovedite (`acoperire_excel.md` §5).
   - Nu-s GRAV la critic, dar sunt referințe noi pe care O4 le numără.
3. **A1** (`:64`) — pe telefon (375×667, atingeri), graficul nou nu mai acoperă tabelul elevului, iar m2-l11 se termină:
   - elevul îl poate muta cu degetul (tragerea de margine merge până la capăt, nu se oprește după ~15 px);
   - sau graficul se așază ca în Excel pe o zonă mică (regula `left` / `top` din critic se potrivește cu Excel real).
   - Alegi varianta pe care o susține referința și scrii de ce în `diferente.md`.
4. **T1** (`:129`) — pe telefon, literele tastate în titlul graficului (sau cu graficul ales) au ținta `grafic:1/titlu` / `grafic:1`, nu `celula:A1`.
   - Asistentul §6.3 nu mai dă indiciul cât elevul scrie corect.
   - Cauza e numită în critic: `aplicatii.js:399` și `:438` emit cu `I.zonaTinta` textul venit fără `keydown`.
   - `aplicatii.js` e COMUN: reparația e păzită (ținta o dă aplicația prin `I.tintaTasta`), iar regresul Word și PowerPoint pe tastarea de pe telefon e obligatoriu.

## Ce NU faci
- Nu atingi `word.js`, `powerpoint.js`, `explorer.js` sau datele lor, nici zona înghețată.
- Nu pornești Excel real: referințele sunt deja capturate. Excel-ul lui Vasile, dacă e deschis, nu se atinge.
- Fără commit, fără push, fără git care scrie.

## Gata înseamnă
- X10, A1, T1, fiecare ÎNCHIS cu dovada de azi (probă + rezultat înainte / după) sau NEÎNCHIS cu motivul verificat, în `raport_constructor.md`.
- Cele 11 scenarii ale acoperirii 14: câte trec la pornire și câte la final.
- `runde/17/proba_grav.py`: verificările picate la pornire și câte pică la final.
- Regresul Excel pe toate scenariile `excel-*`; regresul Word / PowerPoint dacă ai atins un fișier comun.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau `PREDARE` în `stare_autor.md`.
