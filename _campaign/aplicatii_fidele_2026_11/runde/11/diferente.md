# Runda 11 · pasul 5 · TABELUL DIFERENȚELOR (PowerPoint: biblioteca înainte = lipsă)

Simulatorul de dinainte de rundă: `aplicatii/aplicatii.js:77` (`SURSE_APP` fără powerpoint) → „„powerpoint” nu e încă în bibliotecă” la orice `deschide('powerpoint')`.

| # | suprafață | ce face aplicația reală (citat) | simulatorul (înainte → după) | gravitate | reparația |
|---|---|---|---|---|---|
| D1 | toată aplicația | `referinte/uia_powerpoint.json` › 41 de suprafețe (bara_titlu … panglica_context.Ctx_TableLayout) | lipsă → desenate din `date/powerpoint.json` (generat), `powerpoint.js` | GRAV | generator + modul |
| D2 | Home › New Slide / Ctrl+M | `scenarii_real/powerpoint-ctrl-m.json`: `[{Title Slide, [Vulcanii], 2}, {Title and Content, [], 2}]` | lipsă → `diapozitivNou()` după cel activ (Title Slide → Title and Content) | GRAV | `powerpoint.js` › diapozitivNou |
| D3 | Ctrl+Z după New Slide | `powerpoint-ctrl-z-diapozitiv-nou.json`: un diapozitiv | lipsă → `stare.istoric`, `anuleaza()` | GRAV | idem |
| D4 | Delete în miniaturi | `powerpoint-delete-diapozitiv.json`: rămâne doar Title Slide | lipsă → `sterge()` cu `panou: miniaturi` | GRAV | idem |
| D5 | clic dreapta pe miniatură › Duplicate Slide | `uia_powerpoint.json › meniu_contextual.miniatura` (Duplicate Slide); `powerpoint-dublare-diapozitiv.json`: 2 × Title Slide | lipsă → meniul din referință + `dubleaza()` | GRAV | idem |
| D6 | Home › Layout › Title Only | `powerpoint-aspect-title-only.json`: `{Title Only, [Ce sunt], forme 1}` | lipsă → lista ▾ (DOAR aspectele din scenarii, R11-1) + `schimbaAspect()` | GRAV | idem |
| D7 | Home › Bold / Increase Font Size | `powerpoint-bold-text.json` `{Vulcanii, bold true, 60}`; `powerpoint-mareste-font.json` `{…, 66}` | lipsă → `formatare()` pe caseta aleasă (toată caseta — limită: nu pe bucăți de text) | GRAV | idem |
| D8 | tastarea în titlu | `powerpoint-tastare-titlu.json`: `texte [Vulcanii]`, forme 2 | lipsă → `scrie()` + caret pe ecran | GRAV | idem |
| D9 | Design › temă | `powerpoint-tema-ion.json`: `tema Ion`; `uia_powerpoint.json › panglica.TabDesign › … › ListItem 'Ion' (vizibil:false)` | lipsă → galeria cu toate rândurile, derulabilă; clic = tema | GRAV | idem |
| D10 | Transitions › Fade, Apply To All | `powerpoint-tranzitie-fade.json` (3849, galerie Fade), `powerpoint-tranzitie-aplica-la-toate.json` (3 × 3849) | lipsă → `aplicaGalerie('tranzitie')`, `SlideTransitionApplyToAll` | GRAV | idem |
| D11 | Animations › Fly In | `powerpoint-animatie-fly-in.json`: `animatii_cod [2]`, galerie Fly In | lipsă → animația casetei alese (înlocuiește, R11-7) | GRAV | idem |
| D12 | Insert › Table 3×2 | `powerpoint-tabel.json`: forme 3 | lipsă → grila ▾ `meniu:3x2 Table` + tabel pe diapozitiv | GRAV | idem |
| D13 | Insert › Pictures › This Device | `powerpoint-imagine.json` (forme 3); pe panglică: `FlyoutAnchorInsertPictures` | lipsă → mesajul central (lista ▾ necapturată) | GRAV | NEFĂCUT — R11-1, R11-10 |
| D14 | File › Save As | `powerpoint-salvare-ca.json`: `Vulcanii.pptx`; `uia_powerpoint.json › dialog.FileSaveAs` | lipsă → Backstage › Save As › Browse / F12 → dialogul din referință, Enter = Save | GRAV | făcut; scenariul rămâne neexecutabil (R11-10) |
| D15 | New Slide (clic în centrul SplitButton-ului) | `uia_powerpoint.json › panglica.TabHome › Slides › SplitButton 'New Slide' [129,83,42,78]`, MenuItem ▾ [129,120,42,41] | deschide lista (partea ▾) | MĂRUNT pentru elev / diferență la O4 | păstrat fidel; R11-9 |
| D16 | diapozitivul, miniaturile, casetele | README_referinte.md: „PowerPoint nu-și expune diapozitivul și miniaturile în UIA” | desen simplu din scenarii (16:9, Office Theme) | MĂRUNT | R11-2 |
| D17 | comenzile gri din referință | `uia_powerpoint.json › TabHome › Font › Bold activ:false` | active cu o casetă aleasă | [presupus] | R11-6 |
