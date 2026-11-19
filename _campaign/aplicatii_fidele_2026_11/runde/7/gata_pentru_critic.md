# Runda 7 · gata pentru critic — unde e ce și cum se deschide

- Worktree `C:/00/Projects/LearningHub_fidel`, ramura `fidelitate-aplicatii`; diff-ul rundei: `git -C C:/00/Projects/LearningHub_fidel diff -- aplicatii/`
  (necomis; fișierele: `aplicatii/excel.js`, `aplicatii/aplicatii.css`).
- Poligonul: servești worktree-ul pe 127.0.0.1 (port liber) și deschizi `/aplicatii/poligon.html?aplicatie=excel`
  (foaia de probă Elev / Nota 1 / Nota 2 / Media, D2 activă), sau `LH.aplicatii.deschide('excel', {loc, continut, focus:true})`
  cu `continut = {celule, selectie, format, foi, latimi}` (`latimi` e nou: `{C: 90}` = lățimea coloanei în px la 100 %).
- Telefon: același poligon la 360-390 px (`is_mobile`, atingere). Grila se desenează de 1,7 ori mai mare sub 481 px.
- Starea: `LH.aplicatii.stare('excel')` — câmp nou `latimi_coloane` (`{C: 104}`); `celule.X.text` = textul văzut în celulă.
- Proba constructorului: `runde/7/proba_grav.py` (gesturi reale; `LH_SERVIT=<dosar>` pentru altă rădăcină);
  ieșirile `proba_grav_inainte.json` (copia neatinsă) și `proba_grav_dupa.json` (worktree).
- Referințele folosite: `runde/6/critic_probe/com_r6.json`, `com_r6b.json`, `com_r6_pdf.png` (Excel real, COM),
  `referinte/scenarii_real/excel-zero-in-fata.json`, `excel-autosum-buton.json`, `referinte/uia_excel.json › dialog.ColumnWidth`,
  lecțiile `lectii/viii/m1-l06`, `m2-l08`, `m2-l09` (index.html).

## Continuarea (constructorul 2) — ce s-a adăugat
- Același diff, aceleași două fișiere (`aplicatii/excel.js`, `aplicatii/aplicatii.css`, bloc nou la capăt „runda 7, continuarea”).
- Pe poligon, fila Home: găleata **Fill Color** (butonul), **Borders** (butonul = Bottom Border) și săgeata ▾ de lângă el (lista
  Borders: `.lh-ap-x-meniu-borduri`), **Percent Style** (%), **Wrap Text** (grupul Alignment).
- Starea, câmpuri noi: `format_celule.X.umplere` (`"FFFF00"`), `format_celule.X.borduri` (`{sus, jos, stanga, dreapta}` =
  `subtire|groasa|dubla`, muchia comună apare la ambele celule, ca `Range.Borders`), `format_celule.X.incadrare` (`true`),
  `inaltimi_randuri` (`{"2": 95}` = px la 100 %, doar rândurile mai înalte de 19).
- Proba: `runde/7/proba_grav_cont.py` (X7r = X7 rest; X10s = sortarea pe niveluri, NEFĂCUTĂ încă — cazurile ei pică);
  ieșirile `proba_grav_cont_inainte.json` și `proba_grav_cont_dupa.json`.
- Referințe noi: `runde/7/com_r7c.json` (Excel real prin COM, `com_r7c.py`), lista Microsoft S11
  (`_cercetare/office_comenzi/M365_SAEC/excelcontrols.xlsx › BordersGallery`), `uia_excel.json › panglica.TabHome`
  (Fill Color RGB(255, 255, 0), Bottom Border, Percent Style, Wrap Text); lecția `lectii/viii/m1-l06` (:76, :77, :177, :199, :204, :255).

## Continuarea (constructorul 3) — ce s-a adăugat
- Același diff, aceleași două fișiere (`aplicatii/excel.js`, `aplicatii/aplicatii.css`, bloc nou la capăt „runda 7 · constructorul 3”).
- **Sort cu niveluri (X10)**: pe poligon, un tabel cu antet (ex. `continut.celule` din `proba_grav_cont.py › TABEL`), fila Data ›
  Sort: lista coloanei (`[data-lh-nivel="0"] [data-lh-camp="coloana"]`), Order, Add Level (rândul „Then by”), OK. Sort Warning: alegi
  doar C2:C7 și apeși Sort Largest to Smallest (sau Data › Sort). Starea: foaia ține ultima sortare (`f.sortare`), Ctrl+Z o întoarce.
- Proba: `runde/7/proba_grav_cont.py --doar X10s`; probele noi X8 / X3 / X4: `runde/7/proba_grav_cont2.py`
  (`proba_grav_cont2_inainte.json` = worktree înainte de prima scriere a constructorului 3).
- **Registrele (X8)**: Ctrl+N (sau File › New › Blank workbook) = Book2, Book3…; Ctrl+W (sau File › Close) închide registrul activ;
  pe ultimul, nemodificat, rămâne Excel gol (`stare().registru_activ = null`). Dublu clic pe o filă de foaie = caseta de redenumire.
  F12 = Save As, cu panoul din stânga (Acasă, Galerie, Documente, Acest PC, Rețea).
- **Acces rapid (X3)**: în bara de titlu, sus-stânga: discheta, ↶, ↷, ▾.
- **Banda de sub foaie (X4)**: filele, despărțitorul și bara de derulare orizontală pe același rând; bara verticală din dreapta,
  de la rândul literelor. Barele lui Chrome de pe grilă sunt ascunse (vezi cu un Chromium cu bare vizibile, nu doar headless).
