# Runda 9 · B-excel · pentru critic: unde e ce

- Codul: `aplicatii/excel.js` și `aplicatii/aplicatii.css` (doar coada „graficele”, la capăt). Diff-ul întregii runde:
  `git -C C:/00/Projects/LearningHub_fidel diff 30dbbe30 -- aplicatii/`; doar constructorul 2: `git -C C:/00/Projects/LearningHub_fidel diff c0eaf3e1 -- aplicatii/`.
- Poligonul: un server static pe 127.0.0.1 (port liber) care servește worktree-ul, apoi `/aplicatii/poligon.html?aplicatie=excel`,
  sau `LH.aplicatii.deschide('excel', {loc: document.querySelector('[data-lh-aplicatie-loc]'), continut: {celule: {...}, selectie: 'A1'}, focus: true})`.
  Starea: `LH.aplicatii.stare('excel')` (nou: `grafice`, `grafic_activ`, `grafic_element_ales`); evenimentele: `window.__lhAplicatieEv`.
  Serverul + ruta (abandonează tot ce nu e 127.0.0.1) + clasa `S`: `runde/7/proba_grav.py`.
- GRAV atinse: constructorul 1 = E1, E2, K1, E4, E3; constructorul 2 = **X10** (graficele). NEatins: **E5** (vărsarea formulei).
- Unde e X10 în `excel.js`: secțiunea „graficele” (caută `/* ============================================================ graficele`);
  constantele lângă `let filaActiva`; filele contextuale în `deseneazaFile`; legăturile în `apasa` (`ChartTypeColumnInsertGallery`,
  `ChartChangeType`, `ChartSwitchRowColumn`), `I.la.jos` / `misca` / `sus` / `clic` / `tasta` / `text` / `sterge`,
  `implicitDialog`, `arataFilaDialog`, `actualizeazaBare`, `I.stare`, `OPT.la` (lista și Quick Styles), `I.deschideSuprafata`,
  ascultătorul KeyTips (săgețile / Enter cu o listă deschisă).
- Referințele graficelor: `referinte/uia_excel.json › suprafete.lista.ChartTypeColumnInsertGallery`,
  `suprafete.panglica_context.Ctx_ChartDesign` / `Ctx_Format`, `suprafete.dialog.ChartChangeType` (+ `#All Charts`),
  `suprafete.panglica.TabInsert` (Charts), `suprafete.file_panglicii`, `acoperire_r7.fapte.h_grafic`.
  Ce NU dau referințele (deci desenat simplu sau lăsat pe mesajul central): `runde/9/diferente.md` D9-D14, `de_verificat.md` R9-2…R9-6.
- Proba: `runde/9/proba_grav.py --doar X10` (26 de verificări, gesturi reale de mouse și tastatură, headless, doar 127.0.0.1).
- Lecția care folosește suprafața: `lectii/viii/m2-l11` (Grafice). Ea are propriul simulator (`lectii/_sim/excelx-grafic.js`) și
  NU încarcă `aplicatii/`; drumul ei e refăcut în poligon de proba X10 (Insert › coloane ▾ › Clustered Column, clic pe celulă /
  pe grafic, Change Chart Type › Pie / Line / Column, Switch Row/Column, titlul, legătura cu tabelul, mutare, mărire, Delete).
  Pașii 3 (Insert Line ▾) și 6 (Add Chart Element › Data Labels) din laboratorul ei rămân pe mesajul central: listele lor nu sunt în referință.
