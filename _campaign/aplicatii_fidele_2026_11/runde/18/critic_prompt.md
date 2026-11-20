# Criticul rece, runda 18 (prima rundă a valului B-windows), unghiul ASPECT — scris de orchestrator, 20.11.2026

N = 18. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/18/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` are de azi Windows 11:
  - fișierele: `windows.js`, `date/windows.json` (generat de `aplicatii/_unelte/genereaza_windows.py` din referință), profilul `profiluri/windows11.json`;
  - suprafețele: desktopul cu bara de activități, meniul Start (+ Toate aplicațiile) și meniul de clic dreapta pe desktop, nou și clasic;
  - poligonul: `aplicatii/poligon.html?aplicatie=windows`; parametrii sunt în `D/runde/18/gata_pentru_critic.md`.
- **Referința reală** e `referinte/uia_windows.json`, din UI Automation pe Windows-ul profesorului, sesiunea din 20.11.2026 (`referinte/sesiune_windows_10min.md`).
  - Cheile: `bara_activitati`, `start`, `start_toate`, `meniu_desktop`, `meniu_desktop_clasic`.
  - Format shell: `ferestre: [{arbore, rect_ecran_100, …}]`; nodurile au `{nume, tip, tip_local, clasa, id, rect, copii}`.
  - Ecranul referinței e 1536×864 (125%). Oracolul O3 o citește prin `oracole/structura_lib.py` (convertorul shell, `runde/15/acoperire_instrumente.md`).
- **Starea** e în api §5 windows (`D/api_biblioteca.md`): `ferestre [{aplicatie, titlu, stare, activa, x, y, w, h}]`, `meniu_start_deschis`.
- **Ce n-are referință** („[NEVERIFICAT]” în `suprafete.json`): alimentarea, calendarul, panoul de căutare, desktopul (pictogramele), fereastra generică, Securitate Windows. Acolo nu ceri fidelitate: ceri doar să nu mintă (R12) și să nu pretindă.
- **Lecțiile** care au suprafețe `windows.*`:
  - clasa a V-a: `lectii/v/m2-l08` (simulatorul vechi `lectii/_sim/desktop-windows.js`), `m3-l18`…`m3-l21`, `m4-l22`, `m4-l23`, `m5-l36`;
  - clasa a VI-a: `vi/m1-l03`, `m2-l11`, `m3-l16`;
  - clasa a VII-a: `vii/m1-l03`.
  Le citești ca să știi ce drumuri cer. Lecțiile NU încarcă încă biblioteca (asta vine în etapa C), deci drumurile le joci pe poligon.

## Ce spune constructorul (de judecat, nu de crezut)
- **Proba lui:** pe poligon trec 37 de verificări (Start, cele două meniuri de clic dreapta, Nou › Folder, ferestrele din bară, evenimentele, indiciul, telefonul). Pe Windows, O5 a scăzut de la 18 la 3 și O9 de la 8 la 1.
- **O3 „de diagnostic”** (rulat de el pe poligon), pe cele 4 suprafețe cu referință: 536 → 80 la 1366×768 și 51 la 1536×864 (bara 44, Start 7, meniurile 0).
  - Ce rămâne ar fi voit: cele 4 butoane de aplicații deschise de pe PC-ul profesorului nu sunt desenate (35 de puncte), iar ceasul arată ora curentă (8 puncte). Le-a trecut în `de_aprobat.md`, A18-1 și A18-2.
- **Plasa** deschide `start`, `meniu_desktop`, `meniu_desktop_clasic` și `meniu_desktop_nou` (fără referință); `bara_activitati` se vede de la pornire.
- **Fișiere comune atinse:** `aplicatii.js:79` (`SURSE_APP.windows`), `poligon.html:13-14, :18`.
- **Nefăcute:**
  - legătura cu Explorer (R18-7);
  - O5 `clic_fila` / `lansator_grup` (desktopul n-are file);
  - O5 `selectie` (tragerea mută pictograma);
  - textul dalelor și submeniul Nou al desktopului (R18-1, R18-2).
  - Restul e în `de_verificat.md`, R18-1…R18-9.

## Sarcina
1. **A. GRAV vechi:** niciunul (prima rundă a valului). Scrii „—”.
2. **B. Unghiul ASPECT.** Compari, la același cadru, poligonul cu referința, suprafață cu suprafață: bara de activități (+ zona de notificare), Start, Toate aplicațiile, meniul desktop nou + clasic. Verifici:
   - nodurile, numele (ÎN ROMÂNĂ, ca în referință), ordinea, tipurile;
   - pozițiile și mărimile (dreptunghiurile la 125% → css), centrarea barei, fontul, culorile, colțurile rotunjite;
   - ce e activ și ce e gri;
   - telefonul (360-390 px): bara și Start încap, nimic tăiat, zonele de atins ≥ 32 px.
   Judeci și cele două abateri „voite” (A18-1 butoanele aplicațiilor deschise, A18-2 ceasul): sunt corecte așa, sau ascund o diferență pe care elevul o vede?
   Verifici că nicio dată personală din referință nu ajunge pe ecran (contul = „[utilizator]”, rețeaua = „[rețea ascunsă]”).
3. **C. Regresul:** Word, Excel și PowerPoint pe poligon pornesc și se poartă ca înainte. `aplicatii.js` și `poligon.html` au fost atinse; atenție, alte benzi lucrează în paralel la Word, Excel și Explorer.
4. **D.** Ca în reguli. La „Predarea pentru runda următoare” spui ce referință ar trebui capturată pentru suprafețele „[NEVERIFICAT]” care contează pentru lecții.
