# Runda 13 · starea constructorului — actualizată după fiecare bucată

## Gata
- Pașii 2-4: `cadru.md`, `tinta.md`, `contra.md`. `date/powerpoint.json` regenerat: 59 de suprafețe (+8 din acoperire_r12) + cheia
  `fonturi_toate` (318 nume, din `acoperire_r12.fapte.c_font.all_fonts`; generatorul `_unelte/genereaza_powerpoint.py` +3 rânduri);
  `--verifica` = 0.
- **Bucata 1 — P4** (`powerpoint.js`): clicul în mijlocul unei forme din Shapes / al unei casete de text nealese = forma ca OBIECT
  (`I.la.jos`, `obiect`); forma (`.lh-ap-p-fig`) e lovită doar pe DESEN (SVG `pointer-events`), chenarul formei nealese nu prinde
  clicul (`aplicatii.css`, 4 reguli sub `.lh-ap-powerpoint`); al doilea clic fără tragere pe caseta/forma aleasă = cursor în text
  ([presupus] R13-1); Ctrl+C/X/V și Delete pe obiect existau (merg acum și după clicul în mijloc); `start`: `diaPornire()` =
  `forme` (forma / caseta_text / imagine, `pozitie`, `umplere`), `fonturi`, `note`; `start.fisiere` → `M.fisiere`.
  Desenul formei: `desenForma(nume)` (o singură funcție, SVG din nume — și pentru galeria Shapes, A1), umplerea / conturul din model.
- **Bucata 2 — A4 listele**: Font ▾ (`listaFont`: 17 rânduri din suprafață + restul din `fonturi_toate`, derulabilă; caseta Font
  editabilă: Alt,H,F,F → text ales, nume + Enter, Alt+↓ = lista); Start ▾ (`PORNIRI`, `pornire_animatii`); Shape Fill ▾ / Shape
  Outline ▾ / Weight ▸ (`aplicaUmplere`, `aplicaContur`, `ultima` = culoarea butonului); Background Styles ▾ (`stilFundal`, toate
  diapozitivele; Style 6 = #E9E7E7; 1-4 / restul [presupus] R13-5); listele în tastatură (`navigaLista`: săgeți / Enter / Esc,
  [presupus] R13-6); `listaRef` lipește lista sub butonul apăsat când nu e cel din captură (Shape Fill din Home).
  Stare nouă: `font_text`, `pornire_animatii`, `umplere_forme`, `note_diapozitive`, `vedere`.
- **Bucata 3 — P3**: File › New › Blank Presentation = `prezentareNoua()`; Open › Browse = `deschideOpen()` (dialog.FileOpen centrat,
  lista = `start.fisiere`, rândurile `lista:<nume>`), `deschideFisier()` (Enter / Open / dublu clic; Esc / Cancel închid).
- **MINOR (o parte)**: duratele Push / Wipe = 1 s (`DURATE_EFECT`); imaginea pe Two Content intră ÎN caseta goală (3 forme,
  [486, 163, 408, 304]).
- O4 doar PowerPoint (`runde/13/o4_ppt.py`): pornire 20 pe cele noi → **5** (rămân `slide-sorter` 1 + `note`, `stea-ctrl-c-v`,
  `tragere-forma` fără real).

- **Bucata 4 — A4 notele și vederile**: zona de note (`notaEl`, ținta `zona_note`, deschisă la pornire; clic + tastare / Backspace /
  Enter în `scrie` / `sterge`; Esc iese), `comutaNote` (View › Notes = `ShowNotes`, „Notes” din bara de stare), `seteazaVedere`
  (Slide Sorter / Normal / Reading View / Slide Show din bara de stare și din View), `baraStare()` (comută pe `bara_stare#Slide
  Sorter`; ținte `bara_stare:<nume>` prin `OPT.tinta`), `deseneazaSortare()` (grila); stare `vedere` = normala / sortare / citire /
  expunere. CSS: 12 reguli sub `.lh-ap-powerpoint` (note, sortare, citire, `.lh-ap-p-tasta`).
- O4 doar PowerPoint: **3** (doar `note`, `stea-ctrl-c-v`, `tragere-forma` — fără rezultat real); toate celelalte 38 trec.
- `runde/13/proba_grav.py` (+ `h.py` copiat din runde/12): **25/25** pe worktree (`proba_grav_dupa.json`); `--inainte` (HEAD prin
  git archive) se oprește la a 3-a verificare = 3 picate din 5 rulate (`proba_grav_inainte.json`).
- `de_verificat.md`: blocul RUNDA13-POWERPOINT (R13-1 … R13-10). `diferente.md` scris (D1-D12 + scenariile rămase).
- Regresul + măsurarea parțială: `runde/13/regres_predare.sh` → `regres_rezumat.txt` (vezi „Numerele la predare”).

## Numerele la predare (20.11, `regres_predare.sh` → `regres_rezumat.txt`, după ultima scriere sub aplicatii/)
- `masoara.py --runda 13 --doar O3,O4,O5,O8,O9 --compara runde/13/masurare_pornire.json`: O3 26855 → 26855 · **O4 50 → 32** ·
  O5 82 → 82 · O8 102 → 102 · O9 27 → 27 · lacăt ok · neconcludente 0 · „regres față de masurare_pornire.json: niciunul”
  (`runde/13/masurare.json` = măsurarea PARȚIALĂ; pasul 7 complet NU e rulat; log `masurare_partiala.log`).
- O3 nu se mișcă (presupunerea 1 din cadru.md: O3 randează lecțiile, încă pe simulatoarele vechi); O4 restul de 32 = Word / Excel +
  cele 3 PowerPoint fără real.
- Proba mea: 25/25 (worktree); pe HEAD se oprește la a 3-a verificare.
- Regresul: 11/proba_powerpoint 0 · Word 5 / 4 / 4-telefon / 3 / 2 = 0 · Excel 10 / 9 / 8 / 7-cont / 6 = 0 · 7/proba_grav 2 (X6) și
  7/proba_grav_cont2 3 (X8) = aceleași rânduri ca la runda 12 (acceptate, runde/8/diferente.md D14, D18).
- **runde/12/proba_grav.py (rulată dintr-o copie în %TEMP%): 1 picată din 49** — „MINOR telefon 360: ce se vede e la fel ca la
  552ac0c5” (`identice: [false ×4]`, comparație la pixel a ecranului de pornire cu commit-ul dinaintea zonelor de atins). [NESIGUR]
  Cauza probabilă = schimbări VOITE ale rundei: zona de note e acum deschisă la pornire (fapte.c_note › ShowNotes_la_pornire true →
  diapozitivul mai mic) și caseta Font arată numele fontului (c_font › caseta). De verificat de constructorul următor: aceeași
  comparație cu zona de note ascunsă (clic pe `bara_stare:Notes`) — trebuie să rămână doar caseta Font diferită; altfel e regres.
- Json-urile neurmărite scrise de probele vechi în runde/7-10 mutate în %TEMP%/lh_r13_regres_iesiri/; nimic urmărit atins în runde/2-12.
- Fișierele schimbate: `aplicatii/powerpoint.js` (+505/-30), `aplicatii/aplicatii.css` (+19, doar `.lh-ap-powerpoint …` și
  `.lh-ap-p-…`), `aplicatii/date/powerpoint.json` (regenerat), `aplicatii/_unelte/genereaza_powerpoint.py` (+3), `de_verificat.md`
  (R13-1 … R13-10); notele din `runde/13/` (cadru, tinta, contra, diferente, stare_autor, o4_ppt.py, h.py, proba_grav.py,
  proba_grav_*.json, regres_*).

## Urmează (constructorul 2)
0. Lămurește căderea din runde/12/proba_grav.py (mai sus).
5. A3 (Format Background + Animation Pane pe fereastra mică / telefon: `panouLateral` folosește `ZR[3]` = zona din referință).
6. A1 (Shapes: titlurile grupurilor, desenul din `desenForma`, `title`, locul listei, Action Buttons 0×0) și A2 (paletele: titlurile
   „Theme Colors” / „Standard Colors”, `title` = numele culorii).
7. MINOR rest (critic 12 §7).
Apoi: `runde/13/proba_grav.py` (mouse + tastatură), regresul, pasul 7.

## Fișierele atinse până acum
`aplicatii/powerpoint.js`, `aplicatii/aplicatii.css` (doar `.lh-ap-powerpoint …`), `aplicatii/date/powerpoint.json` (regenerat),
`aplicatii/_unelte/genereaza_powerpoint.py`.
