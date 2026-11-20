# Runda 11 (B-powerpoint) · criticul rece · unghiul STARE_FINALĂ_ERORI

## 1. Antet
- Cine: criticul rece al rundei 11 (al doilea; primul s-a blocat fără `critic.md`). N-am văzut conversația constructorilor.
- Ce am rulat până acum: O4 (`oracole/oracol_comportament.py`) pe o COPIE a celor 17 scenarii PowerPoint, cu ieșirea în %TEMP%
  (`LH_IESIRE`) — 13/17 la fel ca realul, aceleași 4 care pică (vezi A).
- Uneltele mele: `runde/11/critic_probe/v2/` (scripturi + ieșiri); hamul `critic_probe/h.py` (server 127.0.0.1 port liber,
  Chromium headless, rută care abandonează tot ce nu e 127.0.0.1/localhost) — citit și refolosit.
- Probele mele (toate headless, gesturi reale `page.mouse` / `page.keyboard` / `page.touchscreen` / CDP `Input.insertText`):
  `v2/a1_dia.py` (diapozitivele), `a2_text.py` (text, formatare, anulare, salvare, închidere), `a3_fer.py` (Font, Paragraph,
  Insert Table), `a4_efecte.py` (Design, Transitions, Animations, F5/Esc, KeyTips, liste, Font Color, Pictures, Shapes),
  `a5.py` (Font Color cu text ales, Animation Pane, Format Background, Ctrl+C/V, tragerea casetei), `a6_tel.py` + `a6b.py`
  (telefon 360/390, fereastra mică 1093×526 css = 1366×657 la 125%), `a7.py` (asistentul §6.3, Duration, Ctrl+C pe casetă,
  Delete pe casetă, Design). Ieșirile: `v2/a*_out.*`. PowerPoint real NU a fost pornit.
- Diff-ul rundei (`git diff 174fdb05 -- aplicatii`, comiși 1b68edcc + a6ba180a): nou `powerpoint.js` (1190 r.), `date/powerpoint.json`
  (generat), `_unelte/genereaza_powerpoint.py`, `profiluri/powerpoint365.json`; atinse `aplicatii.js` (SURSE_APP), `aplicatii.css`
  (secțiunea `.lh-ap-p-*` de la capăt), `poligon.html` (`P.powerpoint`).

## 2. A. Unghiul stare_finala_erori (PowerPoint): constatări

### GRAV P1 — Tastele de acces (KeyTips) lipsesc cu totul, iar literele lor intră ÎN TEXT: prezentarea se strică pe ascuns
- Gestul (a4 + a7): caseta de titlu aleasă ca obiect (clic + Esc), apoi `Alt`, `H`, `1` — șirul referinței pentru Bold.
  Rezultat: `Alt` nu emite niciun eveniment și nu arată nimic; `H` și `1` sunt tastare în casetă: titlul „B” devine **„Bh1”**
  (`a4_out.json › alt_h_1 = [["Bh1", false]]`), textul nu e aldin; la fel `Alt, H, F, S` scrie „hfs” (`alt_h_fs`), iar în
  a7 `Alt, H` transformă titlul „A” în **„Ah”** (`as_keytips`). Evenimentele: `gest:'tastare', actiune:'scriere'`, niciunul
  `tasta_acces`.
- Referința: fiecare comandă are șirul ei, ex. `panglica.TabHome › Bold … 'tasta_acces': 'Alt, H, 1'`, Font Size „Alt, H, F S”,
  New Slide „Alt, H, I”, Animation Pane „Alt, A, C” (uia_powerpoint.json, extras cu `v2/cauta.py`). Deci în PowerPoint real
  `Alt` arată literele, `H` deschide Home, `1` face Bold — documentul nu primește nicio literă.
- Contractul: api_biblioteca.md:158-164 — „`tasta_acces` = o tastă din șirul tastelor de acces ale panglicii … Câte UN eveniment
  pe tastă”; Word și Excel le au (`word.js:1982-2065`, `excel.js` `tastaFaraClic('arata_taste_acces')`), `powerpoint.js` nu are
  nimic (`I.la.tasta`, powerpoint.js:1072-1164: nicio ramură pentru Alt; la 1158-1161 orice literă = `scrie(k)` dacă e o casetă
  aleasă). Și asistentul §6.3 le numără greșeli (api:219-220 scutește doar `tasta_acces` de navigare, care aici nu există).
- De ce e cel mai puternic: e exact cazul „prezentarea stricată pe ascuns” — elevul care a învățat la Word „Alt, H, 1” are
  litere străine în titlu, fără niciun mesaj, iar pe PC-ul real același gest face Bold.

### GRAV P2 — Font Color: comandă de pe drumul a trei lecții, doar mesajul „aici nu e simulată”
- Gestul (a5): clic în titlu (cursorul în text) → Font Color e activ → clic pe corp: `actiune:'nesimulat'`, mesajul „În aplicația
  reală, „Font Color” funcționează; aici nu e simulată.”; săgeata ▾: „More Options … nu e simulată” (`a5_out › fc_edit_clic`,
  `fc_obiect_sageata`). Starea nu are nici măcar unde ține culoarea (`formatare_pe_caractere` = bold/italic/underline/mărime).
- Lecțiile: m1-l06/index.html:150 („Alege tu, din Font Color ▾, o culoare cu care tot textul casetei să se citească bine”),
  m2-l08/index.html:205 („Font Color ▾ → o culoare închisă, de exemplu negrul din Culori temă”), m2-l09/index.html:352.
- Referința spune că în PowerPoint real comanda lucrează cu text ales: `meniu_contextual.text › MiniBar › Font Color` (SplitButton,
  fără `activ:false`) cu butonul „Font Color Red”; culoarea implicită e starea sesiunii (README_referinte.md:123), paleta ▾ nu e
  capturată (README_referinte.md:147). Contractul: api_biblioteca.md:84-87 „Pe comenzile de pe drumul lecției mesajul nu e o
  ieșire: ele trebuie simulate”; R12 (contract.md:38). Verdict: cele trei lecții NU se pot duce la capăt; reparația cere întâi
  captura paletei (rundă `acoperire`), nu un mesaj.

### GRAV P3 — Închiderea și fișierele: ✕, File › Close, Ctrl+W, Ctrl+N, Ctrl+O dau toate doar mesajul central
- Gestul (a2): după Save As, `Ctrl+W` / `Ctrl+N` / `Ctrl+O` → `actiune:'nesimulat'` („„Ctrl+W” funcționează; aici nu e simulată”);
  File › Close → `nesimulat`, Backstage rămâne deschis; ✕ din bara de titlu (`bara_titlu:Close`) → `nesimulat`
  (`a2_out.json › Control+w, Control+n, Control+o, file_close, x_close`). În cod: powerpoint.js:1128 (orice alt Ctrl = nesimulat),
  1026 (pagina Backstage „Close” nu există → nesimulat), 1043 (`bara_titlu` = nesimulat).
- Lecțiile: m1-l02/index.html:329 și m2-l08/index.html:330 („Închide PowerPoint cu ✕ … La întrebarea Save your changes to this
  file? apasă Nu salvați”), m1-l03/index.html:106 (Ctrl+N), :211 (File › Close), :241 (Ctrl+O → Browse → Open).
- Referința are suprafețele: `bara_titlu › Close` (Button), `backstage.nav › Close` („Alt, F, C”), `backstage.Open`, `backstage.New`
  (capturate). Fereastra „Save your changes” nu e capturată. Contractul: api:84-87, R12. Verdict: m1-l03 nu se poate duce la capăt;
  m1-l02 și m2-l08 se opresc la ultimul pas.

### GRAV P4 — Obiectele de pe diapozitiv: Pictures, Shapes și aspectul Two Content lipsesc; Ctrl+C pe o casetă tace
- Gestul (a4, a7): Insert › Pictures → `nesimulat` („Pictures … nu e simulată”); Insert › Shapes → `nesimulat`; lista Layout (și
  New Slide ▾) are DOAR 3 rânduri: Title Slide, Title and Content, Title Only (`a4_out › layout_lista`; powerpoint.js:15-20). Caseta
  aleasă ca obiect + `Ctrl+C` → `fara_efect`, apoi `Ctrl+V` pe alt diapozitiv → `fara_efect`, fără niciun mesaj (`a7_out › c_obiect,
  v_obiect`; powerpoint.js:1113-1127 copiază doar text ales sau diapozitive).
- Lecțiile: m2-l09/index.html:228 și m2-l10/index.html:150 (Layout → Two Content), m2-l09:233-235 și m2-l10:299 (Insert → Pictures
  → This Device → fișier → Insert), m2-l10:151 (Shapes → Arrow: Right), m1-l05/index.html:184 („Clic pe stea → Ctrl+C; clic pe
  miniatura „Planetele” → Ctrl+V”).
- Referința: `panglica.TabInsert › Pictures` (`FlyoutAnchorInsertPictures`, „Alt, N, P”), `Shapes` (`ShapesInsertGallery`), iar
  fereastra `dialog.PictureInsertFromFilePowerPoint` e capturată — dar în simulator niciun drum n-o deschide (nicio apariție
  „PictureInsert” în powerpoint.js). Ctrl+C care tace încalcă R12 („nu tace”, contract.md:38). Verdict: m2-l09 și m2-l10 nu se pot
  duce la capăt; m1-l05 se blochează la stea (nu există forme libere și copierea unui obiect nu face nimic).

### GRAV P5 — Detaliile efectelor cerute de lecții: Duration, ordinea din Animation Pane, umplerea fundalului
- Gestul (a7): Transitions › Fade, apoi clic în Duration: caseta e `readOnly` („02,00”), clicul dă `nesimulat`, tastarea „0,5” +
  Enter nu schimbă nimic (`a7_out › durata, durata_scris`). (a5): Animation Pane arată „1 Fade 2 Wipe”, dar rândurile sunt
  `aria-hidden` (nu se pot alege) și Move Up / Move Down sunt GRI tot timpul (`pane_continut = ["fereastra:Play All:(gri)",
  "fereastra:Move Up:(gri)","fereastra:Move Down:(gri)"]`; powerpoint.js:615-625). Format Background se deschide, dar Solid fill
  și Apply to All dau `nesimulat` (`a5_out › fb_fereastra:Solid fill`, `fb_fereastra:Apply to All`).
- Lecțiile: m1-l07/index.html:156-159 (Duration 0,5, Enter, Apply To All), :194 și :203 („Deschide Animation Pane … și folosește
  butoanele ▲ ▼”), m1-l06/index.html:150 („În panou alegi Solid fill …, apoi culoarea de la Color ▾”), m2-l09 / m2-l10 (Duration).
- Referința: `panou.AnimationCustom` și `panou.LaunchFormatBackground` sunt capturate cu butoanele lor; starea gri e „starea DE LA
  DUMP” (README_referinte.md:124), nu o proprietate: cu două animații, Move Up/Down nu pot rămâne gri. Contractul: api:84-87, R12.
  Verdict: m1-l07 se blochează la ordinea animațiilor (și la durată); m1-l06 la umplerea fundalului. În plus, la Duration
  referința e explicită: `panglica.TabTransitions › Spinner 'Duration' (TransitionDuration, „Alt, K, E”, valoare „02,00”)`
  FĂRĂ `activ:false` — activ în aplicația reală, în simulator `readOnly` + mesaj.

### Verdictul pe cele 4 scenarii care nu trec (O4 rulat de mine: 13/17, aceleași 4)
- **`diapozitiv-nou-buton` — simulatorul are dreptate, scenariul se abate.** Referința: `SplitButton 'New Slide' (SlideNewGallery)
  [129, 83, 42, 78]` cu copilul `MenuItem 'More Options' (SlideNewGallery_Dropdown) [129, 120, 42, 41]`: centrul butonului (y = 122)
  cade în partea cu săgeată (120…161). Simulatorul: `[131, 85, 42, 78]` și `[131, 122, 42, 41]` (aceeași geometrie, decalată 2 px),
  centrul → `meniu_derulant`, `lista_aspecte`; clic în partea de sus (20 % din înălțime) → `diapozitiv_nou`, starea = cea reală
  (`a1_out › sus_dia = [Title Slide, Title and Content(texte [], forme 2)]`). Realul a fost rulat prin UIA Invoke, nu prin clic.
  Scenariul trebuie să apese partea de sus (sau rulatorul să țintească butonul fără săgeată).
- **`imagine` — scenariul cere o țintă care nu e pe ecran nici în real** (`mso:PictureInsertFromFile` stă în meniul Pictures,
  necapturat; pe panglică referința are doar `FlyoutAnchorInsertPictures`). DAR simulatorul se abate și el: Pictures dă `nesimulat`
  și fereastra capturată `dialog.PictureInsertFromFilePowerPoint` nu are drum (GRAV P4). Scenariul de reparat + captura meniului.
- **`salvare-ca` — scenariul se abate**: `mso:FileSaveAs` nu există pe ecran în real (`backstage.nav › 'Save As' mso=None`).
  Simulatorul duce drumul elevului la capăt: Ctrl+S (sau File › Save As) → Browse → File name → Enter: `nume_fisier =
  "Proiect.pptx"`, bara de titlu „Proiect  -  PowerPoint” (forma referinței „Presentation1  -  PowerPoint”), `modificat:false`
  (`a2_out › dupa_save`). Scenariul trebuie scris pe drumul `fila:File` → `backstage:Save As` → `backstage:Browse` → `camp:nume_fisier`.
- **`tragere-forma` — fără rezultat real: nu se poate judeca** ([FARA_REFERINTA]). Observ doar: tragerea din mijlocul unei casete
  nealese selectează text (nu mută caseta: `a5_out › trage_interior`), iar mutarea cere întâi alegerea casetei ca obiect.

### `margine_forma:D/S`
Forma e canonică (`data-lh-tinta="margine_forma"` + `data-lh-id="1/1"`, ca `forma`), patru benzi de 6 px pe marginile casetei
(`a5_out › margine_tinte`). Era nevoie de ea: în PowerPoint caseta se alege ca obiect prin clic pe margine (clicul înăuntru pune
cursorul în text), iar O5 are nevoie de o țintă pentru acest gest (`demonstratie.tragere.pregatire = ['forma:1/1',
'margine_forma:1/1']`). Abaterea: felul nu e în lista din api_biblioteca.md:122-134 → MINOR (lista de feluri trebuie completată
într-o rundă `acoperire`, altfel O3/O5 n-o cunosc). Pe telefon banda de 6 px e sub 32 px (vezi MINOR).

### Drumurile lecțiilor, pe poligon
| lecția | se duce la capăt? | unde se blochează |
|---|---|---|
| m1-l02 | aproape | New Slide, Layout, Table, Design, Transitions, F5 merg; ultimul pas „Închide PowerPoint cu ✕” → mesaj (P3) |
| m1-l03 | NU | Ctrl+N, File › Close, Ctrl+O → mesaj (P3); Save As / Ctrl+S merg |
| m1-l05 | NU | steaua (forme libere) nu există; Ctrl+C pe un obiect tace (P4); Ctrl+C/X/V pe text și pe miniaturi merg, Ctrl+Z la fel |
| m1-l06 | NU | Font Color (P2), Format Background › Solid fill / Apply to All (P5); temele Design merg pe toate diapozitivele |
| m1-l07 | NU | Duration (P5), ordinea din Animation Pane (P5); Fade, Apply To All, animația pe casetă, F5/Esc merg |
| m2-l08 | NU | Font Color (P2), ✕ + „Save your changes” (P3); Font Size merge |
| m2-l09 | NU | Two Content, Pictures › This Device (P4), Font Color (P2), Duration (P5) |
| m2-l10 | NU | Two Content, Pictures, Shapes › Arrow (P4), Duration (P5) |
| jocuri/prezentari-vi | NU | aceleași comenzi ca lecțiile: Font Color, Pictures, Shapes, File › Close (Shape Fill / Outline: netestate de mine) |

Telefonul și fereastra mică (I1): panglica se derulează lateral (360 px: `scrollWidth 1830 > clientWidth 358`, `overflow` auto; fereastra
mică: 1366 > 1091), nicio grupă turtită; atingerea pe titlu + `Input.insertText` scrie în casetă, la punctul atins (`a6_out ›
dupa_tap_scris`); File se deschide la atingere. Fereastra mică: Font (bottom 525 ≤ 526) și Save As (768×480) încap. Pe telefon,
Font (505 px lățime) iese din ecranul de 360 px, OK/Cancel la x = 375…492, dar stratul ferestrei se derulează lateral — exact ca
Word (586 px, OK la x = 274…365, tot derulabil): nu e o regresie a rundei, vezi MINOR.

## 3. B. Fidelitatea generată din date
- `python aplicatii/_unelte/genereaza_powerpoint.py --verifica` → „chei diferite față de generarea de azi: 0”, ultima linie `0`.
- `v2/b_date.py` (Python pe chei): `date/powerpoint.json` are 40 de suprafețe din cele 41 ale referinței (lipsește doar
  `zona_document`, care în referință e cadrul gol de 12 noduri — diapozitivul se desenează din model, declarat); filele afișate,
  11, identice și în aceeași ordine cu `file_panglicii` din referință (Home, Insert, Draw, Design, Transitions, Animations, Slide
  Show, Record, Review, View, Help); grupurile din Home (8), Insert (10), Design (5), Transitions (5), Animations (6) identice și în
  aceeași ordine; Acces rapid = Save, Undo (SplitButton + Undo), Redo, From Beginning; bara de stare identică cu referința („View
  Indicator Slide 1 of 1”, „Language Romanian”, „Zoom 70 %” …); „Claude” apare de 0 ori; singura etichetă din date care nu e în
  referință e descrierea internă `chei.e` („eticheta (numele accesibil real)”), nu o etichetă de interfață.
- Abatere R4 (MINOR, declarată R11-1): rândul „Insert Table...” din lista Table ▾ e scris de mână (powerpoint.js:453-455);
  referința n-are „Insert Table...” (are doar titlul ferestrei „Insert Table”). Numele celor 3 aspecte vin din `scenarii_real`
  (dovedite), nu din UIA.

## 4. C. Regresul Word și Excel — nimic stricat în runda asta
- Codul comun atins e mic: `aplicatii.js` = doar `SURSE_APP += powerpoint`; `poligon.html` = conținutul `P.powerpoint` + comentariul;
  `aplicatii.css` = selectori `.lh-ap-powerpoint` / `.lh-ap-p-*`, plus o regulă pe o clasă COMUNĂ: `.lh-ap-strat-backstage{position:
  absolute;inset:0;z-index:30;background:#fff}` (aplicatii.css:399), care bate regula veche `z-index:25` (aplicatii.css:126) și pentru
  Word / Excel (ambele folosesc clasa). Am probat urmarea de mai jos: nu schimbă nimic vizibil azi (dialogul se adaugă după
  Backstage în DOM, deci rămâne deasupra), dar e o atingere a stilului comun — MINOR, de mutat sub `.lh-ap-powerpoint`.
- `v2/c_regres.py`: aceleași gesturi pe `aplicatii/` din 174fdb05 (`git archive` într-o copie din %TEMP%, ștearsă la final) și pe
  worktree-ul de acum, `poligon.html?aplicatie=word|excel`, la 1366×768: dreptunghiurile `[data-lh-tip]` identice (Word 136 / 179 /
  235, Excel 227 / 271 / 323 la pornire / File / F12), capturile identice la pixel (0 pixeli diferiți în toate 6), deasupra centrului
  după F12 = `dialog.FileSaveAs` în ambele. Gesturile, identice vechi/nou: Word — tastare, dublu clic pe cuvânt + `Alt, H, 1` (KeyTips:
  „proba” aldin), Ctrl+Z, F12 → „Tema” + Enter (`Tema.docx`, „Tema  -  Word”); Excel — F2 = 7, F3 = `=1+2` (3), Ctrl+Z, lista ▾ Σ.
- Probele vechi rulate: `runde/5/proba_grav.py` (Word) → `picate: []`, `0`; `runde/10/proba_grav.py` (Excel) → `0`. Proba Excel a
  scris un fișier nou `runde/10/proba_grav.json`: mutat în %TEMP%; `git status` arată acum doar `runde/11/critic.md` și
  `runde/11/critic_probe/` (nimic în `runde/2` … `runde/10`, `aplicatii/`, `lectii/`, `jocuri/`).

## 5. [FARA_REFERINTA] (nu se numără GRAV; de dus la proba omului / în `de_verificat`)
- **Ctrl+Z pierde selecția**: după orice anulare `sel = null` (powerpoint.js:83 `puneInst`); elevul care apasă Ctrl+Z în mijlocul
  tastării și scrie mai departe nu mai scrie nicăieri (`fara_efect`), iar comenzile de text se fac gri (a3: după Ctrl+Z,
  lansatorul Paragraph → `indisponibil`, tastarea „Right” → 5 × `fara_efect`). Bănuiala mea: în PowerPoint real cursorul rămâne
  în casetă — nedovedit de referință.
- **Câte anulează un Ctrl+Z**: tot șirul tastat de la ultimul clic („Lava mare” dispare dintr-o dată; `a2_out › z_lava`), pentru
  că istoricul unește toate `tastare` consecutive (powerpoint.js:32) — inclusiv ștergerile cu Backspace.
- **Delete pe o casetă aleasă ca obiect** o scoate cu totul (forme 2 → 1, titlul dispare; `a7_out › del_caseta`), deși comentariul
  de la powerpoint.js:901 spune „o casetă de aspect goală rămâne — R11-8”: codul și comentariul se contrazic.
- **Tastarea cu o casetă aleasă ca obiect** adaugă la capătul textului (powerpoint.js:887); tastarea fără nimic ales nu face nimic,
  fără mesaj. Ce face realul: nedovedit.
- **Valorile greșite**: Font Size din Home cu 0 / 5000 / „abc” + Enter → nimic, caseta revine la „60”, fără mesaj (a2); Font › Size
  0 + OK → fereastra se închide, nimic; Insert Table cu 0 sau 100 de coloane → fereastra rămâne deschisă, fără mesaj (a3; limitele
  1…75 sunt [presupus], powerpoint.js:528). Realul (mesajul de eroare) nu e capturat.
- **Esc din expunere**: rămâi pe diapozitivul de pornire (F5 pe 2, → → până la 3, Esc → activ 2; `a4_out › f5_esc`); după ultimul
  diapozitiv ecranul e gol, fără text (powerpoint.js:769). Ce arată realul: necapturat.
- **Ultimul diapozitiv șters**: 0 diapozitive, apoi Ctrl+M dă „Title and Content”, F5 deschide o expunere goală (a1). Nedovedit.
- **Ctrl+S pe o prezentare nouă** → Backstage › Save As (a2). Nedovedit pe PowerPoint (fereastra „Save this file” sau Backstage?).
- **Efectul înlocuit** în galeria Animations trece la COADA ordinii (powerpoint.js:739: șterge și adaugă la sfârșit). Nedovedit.
- **Formatarea pe bucăți**: cursorul în cuvânt + Ctrl+B = tot cuvântul (a2: „Vulcanii” aldin, „ activi” nu), litera tastată la
  capătul cuvântului aldin ia formatul vecinei din stânga („VulcaniiY” aldin). Ecranul = starea (span-uri 700/400). Presupus ca în
  Word (scenariul Word e doar indiciu), nedovedit pe PowerPoint.

## 6. MINOR
- `modificat` rămâne `false` după Ctrl+Z (sau Ctrl+Y) făcut DUPĂ salvare, deși prezentarea nu mai e cea salvată (a2: Save As →
  `modificat:false` → Ctrl+Z anulează mărimea 40 → tot `false`; `anuleaza`/`reface` nu ating `M.salvat`, powerpoint.js:757-758).
  Contrazice definiția constructorilor (gata_pentru_critic.md:17: „true după o schimbare”). Nu e cheie §5, deci MINOR.
- După ștergerea ultimului diapozitiv `stare().diapozitiv_activ = 1` cu `diapozitive = []` (a1) — starea spune un diapozitiv care
  nu există.
- Fereastra Font: Font style și Underline style sunt `readOnly`, iar OK aplică DOAR Size (powerpoint.js:525-537); fereastra
  Paragraph: OK nu aplică Alignment (538-549). Constructorii scriu „Font (Size, Font style, Underline style) … OK / Enter aplică”
  (gata_pentru_critic.md:22-23) — doar Size se aplică. Nu e pe drumul lecțiilor (ele folosesc panglica).
- Telefon (I1, api:286 „zonele de atins ≥ 32 px”): 9 zone sub 32 px la 360 px, între ele lansatorul Font 21×21 și benzile
  `margine_forma` de 6 px — iar m2-l08/index.html:205 cere tocmai „clic pe chenar”. Fereastra Font de 505 px pe 360 px se
  folosește doar prin derulare laterală (ca Word).
- `margine_forma` nu e în lista felurilor de ținte din api:122-134 (vezi A).
- „Insert Table...” scris de mână (vezi B).
- `aplicatii.css:399` redefinește clasa COMUNĂ `.lh-ap-strat-backstage` (z-index 25 → 30 și pentru Word / Excel); fără efect vizibil
  azi (C), dar trebuie mutată sub `.lh-ap-powerpoint`.
- Rândurile din Animation Pane sunt `aria-hidden`: nu sunt ținte (nici pentru elev, nici pentru asistent).
- Asistentul §6.3 numără ca greșeli și pașii pregătitori obligatorii (clic în casetă + Esc ca s-o alegi ca obiect → 2 greșeli →
  indiciul pe Bold apare înainte ca elevul să fi greșit ceva; `a7_out › as_dupa_alegere`). E regula din api:219-220, aceeași la
  toate aplicațiile — de semnalat, nu de reparat aici.

## 7. Ce a trecut
- O4 pe copia scenariilor: 13/17 la fel ca realul; 0 diferențe ecran ≠ stare.
- New Slide (partea de sus), Ctrl+M (în miniaturi, în text, pe prezentare goală), Ctrl+Z / Ctrl+Y pe diapozitive, Duplicate și
  Delete Slide din clic dreapta, Delete în miniaturi, tragerea miniaturii (+ Ctrl+Z), meniul de clic dreapta pe miniatură din date.
- Bold / Italic / Underline (Ctrl+B/I/U și butoanele), Font Size din Home cu 40, Increase Font Size; ecranul arată ce spune starea.
- Teme: aplicate pe TOATE diapozitivele (ecranul și starea), Ctrl+Z întoarce tema; Fade pe diapozitivul activ, Apply To All pe toate
  (scenariile); galeria Animations gri fără casetă aleasă (ca la dump).
- Insert Table: grila ▾ și fereastra „Insert Table” (5 × 2 implicit, More/Less, Esc, Enter = OK), tabelul inserat se anulează.
- Save As: Ctrl+S → Backstage Save As → Browse → File name + Enter: `nume_fisier` „Proiect.pptx”, bara de titlu „Proiect  -  PowerPoint”,
  `modificat` false; Esc în Backstage = înapoi; F5 / Shift+F5 / săgeți / Esc în expunere; Esc închide lista Layout.
- Ctrl+C/X/V pe text și pe diapozitive (miniaturi), cu Ctrl+Z.
- Fereastra mică 1366×657 la 125%: panglica derulabilă, Font și Save As încap; telefonul: panglica derulabilă, tastarea cu degetul.
- B: date generate fără etichete scrise de mână (în afară de „Insert Table...”), `--verifica` = 0, fără „Claude”.
- C: Word și Excel neatinse (dreptunghiuri, pixeli, gesturi, probele vechi 5 și 10 = 0).

GRAV_VECHI_DESCHISE: 0
GRAV: 5
