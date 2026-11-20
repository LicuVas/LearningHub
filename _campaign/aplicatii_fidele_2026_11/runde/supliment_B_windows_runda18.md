# Supliment la promptul rundei 18 (prima rundă a valului B-windows) — scris de orchestrator, 20.11.2026

Se citește DUPĂ `runde/18/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli). Citește ÎNTÂI
`runde/_paralel/CICLU_PARALEL.md`: runda ta merge în paralel cu Explorer (r15), Word (r16) și Excel (r17). Regulile de acolo
(fișiere proprii/comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`) bat pașii 1 și 7 din prompt.

## Unde suntem
- **Referințele reale** sunt în `referinte/uia_windows.json` (sesiunea din 20.11.2026, `referinte/sesiune_windows_10min.md` › „Rularea din 20.11.2026”), în format shell:
  - `bara_activitati` (cele 2 bare: cea principală + cea de pe al doilea ecran);
  - `start`, `start_toate` (Toate aplicațiile);
  - `meniu_desktop` (meniul nou de clic dreapta + submeniul Nou);
  - `meniu_desktop_clasic` (Shift + clic dreapta).
  - Datele personale sunt ascunse: rețeaua Wi-Fi e „[rețea ascunsă]”, iar dala telefonului e scoasă.
- **O3 le citește** din runda `acoperire` pe instrumente (`runde/15/acoperire_instrumente.md`, citește „Ce am schimbat și de ce”). Legăturile din `suprafete.json`:
  - `windows.bara_activitati` și `windows.zona_notificare` → `bara_activitati`;
  - `windows.meniu_start` → `start`;
  - `windows.meniu_clic_dreapta` → `meniu_desktop` + `meniu_desktop_clasic`.
  - Rămân „[NEVERIFICAT]”: `windows.alimentare` (doar butonul), `calendar`, `cautare` (doar butonul și caseta), `desktop` (pictogramele, fundalul), `fereastra` (fereastra generică), `securitate_windows`.
  - Pe acestea le faci SIMPLU, fără să pretinzi fidelitate, fiecare cu un rând `R18-…` în `de_verificat.md`.
- **Starea** e în api §5 windows: `ferestre` `[{aplicatie, titlu, stare: normal|max|min, activa, x, y, w, h}]` și `meniu_start_deschis`.
  - Nu există scenarii Windows (O4 nu are ce număra aici). Măsoară O3, plus drumurile lecțiilor.
- **Lecțiile** care au suprafețe `windows.*` (`suprafete.json › lista_pagini`):
  - clasa a V-a: `lectii/v/m2-l08` (simulatorul vechi `lectii/_sim/desktop-windows.js`), `v/m3-l18`…`m3-l21`, `v/m4-l22`, `m4-l23`, `v/m5-l36`;
  - clasa a VI-a: `vi/m1-l03`, `vi/m2-l11`, `vi/m3-l16`;
  - clasa a VII-a: `vii/m1-l03`.
  Le citești DOAR ca să vezi ce drumuri cer. Lecțiile nu se schimbă în etapa B.
- **Pornirea măsurată:** `runde/18/masurare_pornire.json`. Unghiul rundei: `aspect`. Valul are maximum 6 rânduri.

## Ținta rundei 18 = Windows 11 (desktopul cu bara de activități) în bibliotecă
1. **Interfața se GENEREAZĂ din date:** `aplicatii/_unelte/genereaza_windows.py` citește `uia_windows.json` (prin Python, pe chei) și scrie `aplicatii/date/windows.json`:
   - bara de activități cu butoanele ei;
   - zona de notificare și ceasul;
   - meniul Start (fixate, Recomandate, Toate aplicațiile, Alimentare, contul ca „[utilizator]”);
   - meniul de clic dreapta pe desktop, nou și clasic, cu submeniul Nou.
   Etichetele sunt în ROMÂNĂ, ca în referință. Nicio etichetă scrisă de mână: ce lipsește rămâne lipsă și se notează.
2. **Fișierele proprii:**
   - `aplicatii/windows.js`, `aplicatii/date/windows.json`, `aplicatii/_unelte/genereaza_windows.py`;
   - profilul `aplicatii/profiluri/windows11.json` (§2, un rând în `setari.json`, cu Edit);
   - iconițele doar din setul Fluent deja folosit, nicio captură Microsoft (I7).
3. **Comportamentul:**
   - Start se deschide și se închide (clic, tasta Windows simulată din poligon, Esc), iar `meniu_start_deschis` urmează;
   - clicul dreapta pe desktop deschide meniul, iar „Afișați mai multe opțiuni” / Shift deschide meniul clasic;
   - Nou › Folder pune un folder nou pe desktop, cu numele în editare;
   - ferestrele din `ferestre` apar în bara de activități; clicul pe butonul lor minimizează / restaurează / activează;
   - evenimentele §4 pe fiecare gest, asistentul §6;
   - restul dă mesajul central standard cu `data-lh-nesimulat` (R12).
4. **Legătura cu Explorer (banda r15) NU o faci în runda asta.**
   - Butonul File Explorer din bară și pictogramele de pe desktop emit evenimentul și deschid fereastra doar dacă `aplicatii/explorer.js` expune deja un mod de montare.
   - Altfel: mesajul central + rând `R18-…`. Integrarea vine după ce ambele benzi trec de critic.
5. **Poligonul:** `aplicatii/poligon.html?aplicatie=windows` (comun: o ramură nouă, cu Edit).
6. **I1:** la 360-390 px bara de activități și Start încap ca pe o tabletă (centrate, fără tăieri); zonele de atins ≥ 32 px.

## Ce citești întâi
- `D/contract.md`, `D/api_biblioteca.md` (§3, §4, §5 windows, §6, §8), `D/oracole/CONVENTIE_ARBORE.md`, `D/referinte/README_referinte.md`, `runde/15/acoperire_instrumente.md`.
- Codul din `aplicatii/`, cu Grep înainte de Read: `powerpoint.js` și `genereaza_powerpoint.py` doar ca model, pe bucăți.

## Probele, Office, ce NU faci
- **Proba ta:** `runde/18/proba_windows.py`: gesturi reale pe poligon, ieșirile în json.
  - O3 doar pe paginile tale: `LH_IESIRE=D/runde/18/probe_iesiri`, `LH_DOAR_PAGINI`.
- **Regresul Word / Excel / PowerPoint** (5-10 scenarii fiecare), doar dacă ai atins un fișier comun.
- **Nu pornești nicio aplicație reală și nu umbli pe ecranul lui Vasile.** Probele în browser rulează headless, doar pe 127.0.0.1/localhost.
- **Nu atingi** `word.js`, `excel.js`, `powerpoint.js`, `explorer.js` (banda r15), datele lor, zona înghețată, lecțiile, jocurile.
- Fără commit, fără push, fără git care scrie. Nicio cale cu numele utilizatorului, nicio dată personală.
- **Contextul:**
  - `stare_autor.md` la zi după fiecare bucată (generator, bară, Start, meniuri, ferestre, telefon, probe);
  - la ~200k de context: `PREDARE`;
  - ieșirile mari pe disc.

## Gata înseamnă
- **`raport_constructor.md`:**
  - FĂCUT / NEFĂCUT / NESIGUR;
  - lista exactă a fișierelor, cu „Fișiere comune atinse”;
  - ce suprafețe `windows.*` deschide plasa și ce dă O3 pe ele (din proba ta).
- **`gata_pentru_critic.md`:** cum se deschide poligonul. Ultima linie: `GATA_PENTRU_CRITIC`.
