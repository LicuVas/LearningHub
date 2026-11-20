# Runda 21 (B-excel#2, unghiul aspect) — cadrul, înainte de reparație

Pornirea: `masurare_pornire.json` (măsurarea comună de la finalul ciclului A). Pasul zero: `proba_grav.py` pe codul de azi → **13 picate** din 19 (`proba_grav_inainte.log`), adică ambele GRAV se reproduc exact cum le-a scris criticul 17:
- G17-1: după A7 + Ctrl+↓, `selectie` = A1048576, dar în zona grilei se văd **0 rânduri** și 0 celule (`G1.2`); tasta are ținta `celula:A7`; „5” + Enter → valoarea e în stare, nu pe ecran, focusul pe `BODY`, 78.000 de celule în DOM și 2001 antete de rând cu numărul tăiat; Ctrl+↑ nu mai emite nimic (`G1.7`, `ev: null`); celula B1048570 nu există în DOM (excepția din `G1.12`).
- G17-2: la 375×667, degetul pus pe C7 și tras derulează grila (scrollLeft 0 → 154), iar celula activă devine **C7 fără niciun eveniment** (`G2.2`); degetul pe B7 tras în sus: selecția devine B6:B7, tot fără eveniment (`G2.3`).

## Suprafața aleasă
Zona documentului din Excel (`uia_excel.json › zona_document`): grila (antetele de rând / coloană + celulele), celula activă, derularea grilei, cu mouse-ul, tastatura și degetul.

## Presupuneri (de verificat, nu de crezut)
1. **„Grila desenată întreagă” e singurul motiv pentru care celula activă dispare.** Dacă desenez doar o fereastră de rânduri în jurul celulei active, celula se vede, iar caseta de intrare (`intrare`) are unde sta → focusul nu mai cade pe `BODY` și Ctrl+↑ / Ctrl+Home / ↑ emit din nou. De verificat: `G1.3`-`G1.9` după reparație.
2. **Toate calculele de geometrie trec prin `xCol / yRand / colLa / randLa / PX / PY`** (excel.js:964-1004), deci o origine a ferestrei (R0, C0) pusă acolo ajunge peste tot (selecția, editarea, graficele, bara de derulare). Ce scapă: locurile care folosesc `NR - 1` / `NC - 1` ca „ultimul rând” (`dr`, îmbinările, `celulaLa`); le caut cu grep înainte de reparație.
3. **Degetul care derulează nu trebuie să schimbe nimic.** Pe ecranul tactil, Excel derulează grila cu degetul și alege celula la atingerea scurtă. Pentru simulator e destul ca alegerea celulei să se facă la ridicare (`I.la.clic`, care deja alege celula când `josFacut` e fals), nu la apăsare; atunci `pointercancel` nu mai are ce întoarce, iar `aplicatii.js` (comun) nu trebuie atins.
4. **Lecțiile clasei a VIII-a nu folosesc Ctrl+săgeți** (criticul 10, [FARA_REFERINTA] 4), deci fereastra nouă nu schimbă drumul vreunei lecții; riscul e regresul pe scenariile O4 și pe probele vechi, care cer celule în DOM pe grila normală (A1…Z40). Grila normală trebuie să rămână identică.
5. **Unghiul aspect:** numerele rândurilor de 4-7 cifre (1000…1048576) încap în antetul de 26 px? Proba spune nu: 2001 antete tăiate (`G1.5 › vazute.antete_taiate`).

## Citirile lui „fidel” pentru suprafața asta
- **(a) Aspect:** după Ctrl+↓ ecranul arată o foaie cu rânduri numerotate și celule, cu celula activă încadrată și numărul ei de rând citibil — ca orice foaie Excel (`uia_excel.json › zona_document`: mereu antetele de rând și celulele).
- **(b) Gest / evenimente:** fiecare tastă și fiecare atingere emite un eveniment cu ținta focusului (§4); derularea cu degetul nu e o alegere de celulă.
- **(c) Starea finală:** `selectie` = A1048576 / XFD7, ca scenariile reale `excel-ctrl-jos-ultimul-rand` și `excel-ctrl-dreapta-ultima-coloana` (asta trece deja).

**Aleasă: (a) + (b), cu (c) ca poartă care nu are voie să cadă.** De ce pierd celelalte singure: (c) trece deja pe codul de azi și totuși elevul vede o foaie albă și rămâne blocat — starea corectă cu ecranul gol e exact GRAV-ul; (b) fără (a) ar da evenimente corecte pe o grilă albă (elevul tot nu vede unde scrie). Unghiul rundei e aspectul, deci criteriul de „gata” e ce se VEDE: rândurile din jurul celulei active, celula activă în zona grilei, numărul rândului întreg.

## Ce NU știu din referință (deci nu inventez)
- Câte rânduri arată Excel deasupra lui A1048576 și cât de lat devine antetul rândurilor la 7 cifre: nu sunt capturate (criticul 17, predarea, punctul 3). Aleg: celula activă jos în fereastră (cum o aduce `vedeCelula`, ca la orice ↓) și antetul atât de lat cât să încapă numărul. Ambele intră în `de_verificat.md` ca R21-…
- Ce face Excel pe ecran tactil la tragerea degetului pe grilă: necapturat (criticul 17, G17-2: „constatarea stă pe contract, nu pe referință”). Contractul (§4/§5) cere doar: nicio schimbare de stare fără eveniment.
