# Surse — lecția VI · M1 · nr. 7: „Efecte de animație și de tranziție. Când ajută și când încurcă”

Autor: agentul-autor al lecției 7 (27.09.2026; reparată în aceeași seară după judecător: `_verificare/reparatii.md`). Se predă în săptămâna 19-23.10.2026 (Tupilați luni, a VI-a singură la ora simultană; Izvoare marți; Brauner vineri).

## Programa și planul
- `C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json`: VI-U1 „Prezentări digitale” (CS.1.1, CS.3.1), lecția 7 = „Efecte de animație și de tranziție. Când ajută și când încurcă” (predare). Lecția 8 = estetică, ergonomie, susținere.
- `C:\00\Projects\Info_Gimnaziu_2026\planificari\Calendar_ore_VI.md`: 20.10.2026, lecția 7, M1.
- Conținuturile declarate (`C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, textul exact): „Efecte de animație”, „Efecte de tranziție”. Activitatea din programă folosită la atelier: „realizarea unei prezentări noi, pe o temă atractivă, aplicând efecte de animație obiectelor și de tranziție diapozitivelor și expunerea prezentării”.
- Standardul: `_campaign\revizuire_completa_2026_09\05_STANDARD_LECTIE.md`; motorul: `jocuri\README.md` §4 (modul LECȚIE), §6, §6b, §7, §8, §9.

## Materialul refolosit
- `jocuri/prezentari-vi`, nivelul 6 „Animații și tranziții” (`lectii:[7]`): ideea „diapozitivul întreg sau un obiect?”, regulile „aceeași tranziție, efecte scurte, fără sunete, verifici cu F5”, capturile `fila-tranzitii.webp` și `animatii-familii.webp` (folosite direct, cu calea `../../../jocuri/prezentari-vi/img/…`, ca lecția 4).
- Nu am preluat din nivel: „Add Animation e gri fără obiect ales” ca fapt predat (neprobat, vezi NESIGUR), cele patru familii de animații ca pas separat (lecția folosește doar intrarea; evidențierea apare ca „decor” de scos).
- F5 / Esc / De la început sunt în nivelul 7 al jocului (lecția 8). Aici le predau în pasul 6 (cu captura `expunere-de-la-inceput.webp` și un exercițiu în expunere), pentru că fără expunere elevul nu poate privi efectele ca publicul (regula 1).
- Panglica reală: `jocuri/_motor/panglica-powerpoint.js` (dump UI Automation al PowerPoint-ului instalat). În grupurile Timing lipseau casetele (Sound, Duration, Start, Delay): simulatorul le adaugă la pozițiile lor din captura `avansare-automata.webp` și din ordinea filei.

## Imaginile (`img/`, proveniența în `img/SURSE.json`)
- `cortina-teatru.webp` — fotografie CC0 (tommybuddy/Pixabay, via Wikimedia Commons, `File:Curtain-939464.jpg`), pasul 0.
- `ghicitoare-inainte-dupa.webp` — desenat de PowerPoint (Slide.Export, `_proba/fa_pptx.py`), cu o ghicitoare diferită de cea din atelier (ca exemplul să nu rezolve atelierul), pasul 6.
- `expunere-de-la-inceput.webp` — decupaj din captura reală `jocuri/prezentari-vi/img/fila-expunere.webp` (fila Slide Show, From Beginning, From Current Slide), FĂRĂ partea de jos cu Use Presenter View (lecția 8), pasul 6 (`_proba/fa_imagini.py`).
- Din joc: `fila-tranzitii.webp` (pasul 1), `animatii-familii.webp` (pasul 3).
- Captura grupului Timing (`avansare-automata.webp`) NU e folosită: eticheta roșie „la clic”, despre lecția 8, acoperă săgețile casetei Duration, iar decuparea ar fi tăiat caseta (am renunțat, n-am vopsit peste captură). Pasul 2 e ilustrat de simulator; captura lipsă e C1 în `capturi_lipsa.json`.

## Prezentarea de lucru descărcabilă
`ciclul-apei-de-reparat.pptx` — făcută prin COM (PowerPoint fără fereastră, `_proba/fa_pptx.py`), apoi citită înapoi prin COM și din XML-ul fișierului (`_proba/fa_pptx.json`): 5 diapozitive; tranzițiile Shape (`<p:circle/>`, 2 s), Push (`<p:push dir="u"/>`, 1 s), Cover (3 s), Random Bars (2,5 s), niciuna; titlul cu Spin (`emph`, `afterEffect`); etapele în ordinea 3, 1, 2 (`clickEffect`, `withEffect`, `withEffect`); răspunsul „Norul!” fără animație. Obiectele au numele Etapa 1/2/3, Intrebarea, Raspunsul (fără diacritice, ca să apară la fel pe orice calculator). E aceeași prezentare ca atelierul (`l7_atelier` din `index.html`).

## Probele în PowerPoint-ul real (afirmatii.json: 35 de afirmații; 13 CONFIRMAT, 9 PARȚIAL, 4 NETESTABIL_COM, 8 DOCUMENTAT, 1 CAPTURĂ)
- `_proba/probe_com.py` → `probe_com.json` (fără fereastră): o prezentare nouă nu are tranziții (EntryEffect 0, la clic); tranziția e a unui singur diapozitiv; durata e în secunde; None o scoate; duratele implicite ale animațiilor (Appear fără durată, Fade/Fly In/Split/Wipe 0,5 s, Spin 2 s); ordinea = ordinea adăugării; MoveTo reordonează; TriggerType 1/2/3; ștergerea obiectului scoate efectul; dublarea diapozitivului păstrează tranziția și efectele; numele obiectelor (Title 1, TextBox 2…, Right Arrow 5).
- `_proba/probe_fereastra.py` → `probe_fereastra.json` (cu fereastră, pe DESKTOPUL ASCUNS, `tools/hidden_desktop.py`). **Atenție (judecătorul, MINOR 10):** la prima predare, fișierul NU mai conținea W2 și W4: o rulare ulterioară doar cu W3 îl suprascrisese, iar `_probe_fereastra_run.txt` arăta o rulare căzută. Acum scriptul ADAUGĂ la rezultatele vechi, iar W2 și W4 au fost re-rulate pe 27.09 seara; aceleași fapte le-a probat independent judecătorul (`_verificare/judecator_com.json`, P0-P2). W2 Se aplică pentru toate (ExecuteMso `SlideTransitionApplyToAll`) copiază efectul ȘI durata pe toate cele 4 diapozitive; W4 expunerea clic cu clic (SlideShowView: `GetClickCount`, `GetClickIndex`, `Next`): Cu/După precedentul nu cer clic, fiecare clic = grupul următor, apoi diapozitivul următor, apoi ecranul de final („No slide is currently in view”), apoi închiderea.
- W1 și W3 (galeriile apăsate prin UI Automation) NU au mers: PowerPoint cade („Object is not connected to server”) imediat după primul apel UIA pe desktopul ascuns — la fel ca la lecția 6. Diagnosticul (`diag_fereastra.py`, `diag_fereastra2.py`): COM singur merge; tot atunci am aflat că închiderea prezentării cu care pornește `/B` oprește PowerPoint.
- `_proba/probe_com2.py` → `probe_com2.json`: Fly In intră implicit de jos (Direction = Down; în XML presetSubtype = 4).
- `_proba/durate_din_pptx.py` → `durate_din_pptx.json`: duratele puse de galerie, citite din 384 de prezentări reale de pe disc (doar citire zip): Fade 0,70 s (72 de apariții), Push 1,00 s (20), Split 1,50 s (21). Prin COM, EntryEffect NU pune durata galeriei (rămâne 2,0).
- Proba judecătorului (`_verificare/judecator_com.json`, desktop ascuns): provocarea urmată literal pe o copie a prezentării de lucru (0, 3, 1, 0, 0 clicuri, ecranul de final, Esc), scenariile din exerciții și întrebări, și faptul nou: **un clic dat cât rulează o tranziție sau un efect doar îl termină** (P0: 10 clicuri în loc de 7 pe prezentarea nereparată). Lecția îl folosește acum în pasul 6 („încurcă”), iar simulatorul face la fel (A32).
- Nicio probă nu a atins ecranul profesorului și nu a folosit clipboardul. PowerPoint a fost pornit și închis de mine de fiecare dată (verificat cu `tasklist` înainte și după; o dată era deschis de altcineva și am așteptat).

## Numele românești (Office în română)
Din `_campaign\revizuire_completa_2026_09\calibrare\meniuri_ro_en.json` (CONFIRMAT): Tranziții (Transitions), Animații (Animations), Expunere diapozitive (Slide Show), De la început (From Beginning).
**NESIGURE** (din paginile Microsoft ro-ro din `calibrare\_cache`, netrecute prin calibrare; de confirmat pe un Office în română):
- **Se aplică pentru toate (Apply To All)** — aceeași pagină Microsoft scrie și „Se aplică tuturor” și „Se aplică pentru toate”; am ales-o pe a doua, cea din fraza „faceți clic pe Se aplică pentru toate din panglică”.
- **Durată (Duration)**, **Temporizare (Timing)**, **Previzualizare (Preview)**, **Fără (None)** — pagini Microsoft despre tranziții și animații.
- **La clic (On Click)**, **Cu precedentul (With Previous)**, **După precedentul (After Previous)** — două pagini Microsoft („Proiectarea în PowerPoint”, „Animarea textului sau obiectelor”).
- **Pornire (Start)** — Microsoft scrie „Pentru Start, selectați…” și „ajustați Pornirea, Durata și Întârzierea”: eticheta românească e probabil „Pornire”, ca fila Pornire (Home); lecția spune mereu „lista Pornire (Start), din grupul Temporizare (Timing)”, ca să nu se confunde.
- **Panou animație (Animation Pane)** — Microsoft: „selectați Panou animație de pe fila Animații” (altă pagină: „Panoul Animație”).
- **Adăugare animație (Add Animation)**, **Mutare mai devreme / Mutare mai târziu (Move Earlier / Move Later)**, **Opțiuni efect (Effect Options)**, **Întârziere (Delay)**, **Eliminare (Remove)** — pagini Microsoft; folosite doar în simulator.
- Meniul rândului din Panou animație (săgeata ▾): Microsoft ro-ro documentează doar „selectați săgeata în jos, apoi selectați Eliminare”. Celelalte rânduri ale meniului din simulator (Start On Click, Start With Previous, Start After Previous, Effect Options..., Timing..., Hide Advanced Timeline) sunt scrise din memoria interfeței: **NESIGURE**, de confirmat pe ecran (C4 din `capturi_lipsa.json`).
- Numele efectelor (Fade, Push, Appear, Fly In…) rămân în engleză, cu înțelesul în paranteză, cu literă mică („Fade (se estompează)”): Microsoft ro-ro numește tranziția Fade „Estompare”, dar numele românești ale celorlalte efecte nu le-am găsit în surse. Elevul le recunoaște după loc și desen.

## Ce n-am putut verifica (NESIGUR)
1. Previzualizarea automată la alegerea unui efect din galerie (A03) — simulatorul o face.
2. Galeria de animații gri fără obiect ales; efectul nou din galerie ÎNLOCUIEȘTE efectul vechi (A28, A29) — simulatorul face așa și o spune pe ecran; UIA a oprit PowerPoint.
3. Numerele: că se văd doar cât e deschisă fila Animații (A12) și numărul desenat lângă un efect Cu/După precedentul — al efectului de deasupra, 0 dacă e primul (A20). Clicurile (ce număr înseamnă) sunt probate.
4. Steluța din panoul cu miniaturi: forma exactă și dacă apare și pentru un diapozitiv doar cu animații (A04). Simulatorul o arată pentru oricare efect.
5. Duratele puse de galerie pentru Morph, Wipe, Reveal, Cut, Random Bars, Shape, Uncover, Cover (simulatorul: 2 / 1 / 1 / 0,1 / 1 / 1 / 1 / 1) și pentru efectele de animație neprobate (Float In 1; Shape, Wheel, Swivel, Bounce 2; restul 0,5). Lecția nu spune niciun număr din acestea; exercițiile cer durate scrise de elev.
6. Pasul cu care urcă săgețile casetei Duration (simulatorul: 0,25 s) și „Auto” în caseta Duration la Appear.
7. Forma rândului din Panou animație („Etapa 1: 1. Apa se evaporă” sau doar „Etapa 1”) — provocarea spune doar „alege «Etapa 1»”, adevărat în ambele cazuri (A26).
8. Textul ecranului de final „End of slide show, click to exit.” (A23; starea e probată).
9. Clic pe numărul efectului + Delete scoate doar efectul (A33): documentat de computerhope.com, neprobat în aplicație (clicurile prin mesaje nu ajung în diapozitiv). Simulatorul îl acceptă; lecția predă drumurile documentate de Microsoft: None (Fără) cu obiectul ales, sau în panou ▾ → Remove (Eliminare).
10. Durata scrisă și, fără Enter, clic direct pe Se aplică pentru toate (A35): simulatorul o primește (pe telefon nu există Enter); lecția predă Enter, drumul probat.

## Simulatorul `lectii/_sim/simppt-animatii.js` (proprietar: autorul acestei lecții)
Tip nou `ppta` (`tipuri:{ppta:SimPPTAnim}`), separat de `simppt.js` și `simppt-formatare.js`, pe care nu le-am modificat (folosesc doar `SimPPT._intern.LAY`, geometria machetelor). Clasele CSS au prefixul `sa-`, obiectul global e `SimPPTAnim`.
- Fidel: tranziția pe diapozitivul ales (și pe miniaturile alese cu Ctrl/Shift+clic), None, Duration (acceptă `0,5` și `0.5`, afișează `00,50`), Apply To All (efect + durată), Preview; animația pe obiectul ales, None, Add Animation (adaugă), galeria (înlocuiește), numerele după regula clicurilor, Animation Pane cu ▲ ▼ și Play All, Start, Duration, Delay, Move Earlier / Move Later, Delete (pe obiectul ales: șterge obiectul și efectul lui; pe NUMĂRUL efectului sau pe rândul din panou: doar efectul), meniul ▾ al rândului din panou (pornirea, Remove), Ctrl+Z / Ctrl+Y; durata scrisă fără Enter e primită și de butonul apăsat imediat după (panglica nu se mai redesenează între apăsare și ridicare); expunerea pe tot ecranul (F5, Shift+F5, From Beginning, From Current Slide), clic / → / Enter / Spațiu înainte (un clic dat cât rulează efectul doar îl termină, ca în PowerPoint), ← înapoi (starea de dinainte, fără efect, ca în PowerPoint), Esc, ecranul de final. Butonul F5 de sub fereastră apare doar din pasul 6 (unde se predă) și în atelier. Acolo, tasta F5 e prinsă oricând simulatorul e în pagină, oriunde ar fi fost ultimul clic, ca să nu reîncarce pagina (judecătorul, trecerea 2, N1; proba: `proba_gesturi.py` + controlul `control_f5.py`, pe `defaultPrevented`, fiindcă Chromium headless nu reîncarcă la un F5 sintetic). La pașii 1-5, F5 e prins doar după un clic în simulator. Numerele de lângă obiecte rămân desenate mic și pe telefon; doar zona de atins e mărită (33 px, nevăzută). Pe ecran tactil țintele au cel puțin 32 px (panglica mărită de 1,65 ori, ▲ ▼ și rândurile panoului 40 px, zona de atins a numerelor 33 px), iar săgețile casetei Duration lipsesc: acolo scrii durata. Un clic în diapozitiv în timpul previzualizării o oprește și lucrează pe obiectul de sub mouse.
- Abateri spuse pe ecran: efectele desenate aproximativ (în previzualizare și în expunere); Effect Options, Sound, avansarea (lecția 8), Trigger, Animation Painter, celelalte file și butoanele lor („nu e folosit în lecția asta”); nu se scrie pe diapozitiv; clic dreapta fără meniu; steluța redă efectul în diapozitivul mare, nu în miniatură; panglica mai lată decât coloana lecției se derulează în lateral (nota e afișată și pe calculator).
- Verificarea e pe STAREA prezentării (teste numite), nu pe drumul clicurilor. Condițiile: `tr, faraTr, trToate, trDur, trDurMax, an, faraAn, nrAn, ordine, clicuri, laClic, vizibil, nobj, nr, titlu, ev`.

## Probele lecției (toate în `_proba/`)
- Poarta: `test_joc.py --dir …/lectii/vi m1-l07` → TRECUT (25 de întrebări jucate; singurul avertisment: „1 niveluri”, așteptat).
- Linia: `verifica_lectie.py … --fara-t1` → 0 (S0 TRECUT, S1 0 identice, S2 7/7 execuție, T0 0).
- Gesturi reale: `proba_gesturi.py` (1280 px mouse + tastatură; 390 px atingere): fiecare pas și atelierul cap-coadă, cu „Verifică” apăsat de mână, plus probele reparațiilor (runda 1 și runda 2: cele 4 drumuri F5, numerele în fereastră și fără suprapuneri): clic pe număr + Delete (doar efectul), ▾ → Remove, durata fără Enter + Apply To All, mărimile țintelor pe telefon, butonul F5 doar de la pasul 6, clicul care doar termină efectul → 0 FAIL, 0 erori în consolă, nimic mai lat decât ecranul (`_proba_gesturi_rezultat.txt`).
- Numărul de cuvinte pe pas: `numara_cuvinte.py` (text 76-100, „Uite cum” 46-66).
- Pașii sunt 6 după „La ce folosește”, nu 3-5: judecătorul a cerut împărțirea fostului pas 4 (trei idei), iar regula 2 („un pas = o idee”) are întâietate.
- Capturi de control (nu intră în pagină): `capturi_ecran.py` → `_ecran_*.png`.

## Semnalări ale verificării arătate false
Niciuna (linia dă 0).
