# Runda 12 · starea constructorului (predare) — actualizată după fiecare bucată

## Gata
- Pașii 2-4: cadru.md, tinta.md, contra.md. `date/powerpoint.json` regenerat (51 de suprafețe, `--verifica` = 0).
- **Bucata 1 — P1 KeyTips** (`powerpoint.js`, blocul „tastele de acces”, după `I.la.sterge`): Alt / literă / Esc ca în word.js;
  partea „More Options” a butoanelor împărțite câștigă litera (New Slide „Alt, H, I” deschide lista). Proba: 8/9 (Alt,H,I așteaptă
  lista din referință — bucata 4).
- **Bucata 2 — P3** (`powerpoint.js`: `CAMPURI_PREZ/PREZ`, `cerereInchidere`, `raspunsInchidere`, `inchidePrezentare`,
  `prezentareNoua`; Ctrl+W/N/O, ✕, File › Close; fără prezentare = comenzi gri; o prezentare nouă cu conținut = modificată).
  `aplicatii.css`: regula `.lh-ap-strat-backstage` mutată sub `.lh-ap-powerpoint` (MINOR) + `.lh-ap-p-fara`. Proba: 14/14.
- O4 doar PowerPoint (`runde/12/o4_ppt.py`): 19 → 14 (ctrl-n, ctrl-w-modificat trec).

- **Bucata 3 — P2 Font Color**: `listaRef` (listă din referință, poziționată după captură), paleta lista.FontColorPicker
  (+ mini-bara), culorile (`STANDARD`, `TEMA`, `culoareDin`, nuanțe lumMod/lumOff [presupus]), `culoare_text` în stare, `c` în
  formatul caracterelor (ecranul colorat, Ctrl+Z). Proba 5/5.
- **Bucata 4 — P4**: cele 9 aspecte (geometria celor noi [presupus] R12-4), listele Layout / New Slide / Pictures / Shapes /
  Table din referință (grila veche și „Insert Table...” scris de mână scoase), Insert Picture (Enter / Open = imagine),
  Shapes + clic = formă (`unealta`), Ctrl+C/X/V pe caseta-obiect → caseta_text în același loc, `forme_diapozitiv`,
  `pozitii_forme`, marginea pe toate casetele, ținta `diapozitiv` = colțul liber + fundalul (fără data-lh-id). Proba 7/7.
- O4 doar PowerPoint: 19 → 14 (după P3) → **5** (după P4): rămân animatii-move-up 2, durata 1, fundal 1 (P5), tragere-forma 1 (fără real).
- Proba totală: 0 picate (P1 9, P3 14, P2 5, P4 7).

- **Bucata 5 — P5**: Duration editabil (`durata` pe diapozitiv, 2 s implicit, Fade 0,7, Apply To All copiază, „0,5”+Enter),
  Animation Pane (rânduri alegibile cu numele din referință, Move Up/Down gri după rândul ales, `mutaAnimatie`, Fade = cod 10),
  Format Background (`variantaFundal` → `#Solid fill`, Color ▾ = `lista.FormatBackground_Color`, Apply to All, `fundal_diapozitive`);
  clicul în panoul lateral nu mai deselectează caseta (`I.la.jos`). Proba 4/4.
- O4 doar PowerPoint: **1** (doar `tragere-forma`, fără real). Proba totală: **39/39** (0 picate).
- `de_verificat.md`: R12-1 … R12-8 adăugate (blocul RUNDA12-POWERPOINT). `diferente.md` scris.

## Numerele la predare (20.11, 08:32-08:45; `regres_predare.sh`, rezumatul în `predare_rezumat.txt`)
- `masoara.py --runda 12 --doar O3,O4,O5,O8,O9 --compara masurare_pornire.json` (după ultima scriere sub aplicatii/):
  O3 25076 → 25076 · **O4 48 → 30** · O5 82 → 82 · O8 102 → 102 · O9 27 → 27 · lacăt ok · neconcludente 0 ·
  „regres față de masurare_pornire.json: niciunul”. (`runde/12/masurare.json` = măsurarea PARȚIALĂ; pasul 7 complet NU e rulat.)
- O3 nu se mișcă din biblioteca PowerPoint (cadru.md, presupunerea 1: O3 randează lecțiile, încă pe simulatoarele vechi).
- Proba mea: `proba_grav.py` pe HEAD (`--inainte`) = 18 picate → pe worktree = **0 picate din 39** (`proba_grav_inainte.json`,
  `proba_grav_dupa.json`).
- Regresul: runde/11/proba_powerpoint 0 · Word 5/4/4-telefon/3/2 = 0 · Excel 10/9/8/7-cont/6 = 0 · 7/proba_grav 2 (X6, acceptat) ·
  7/proba_grav_cont2 3 (X8, acceptat). Fișierele json scrise de probele vechi în runde/7-10 (neurmărite) mutate în
  %TEMP%/lh_r12_regres_iesiri/; nimic urmărit atins în runde/2-11, lectii/, jocuri/.
- Fișierele schimbate: `aplicatii/powerpoint.js`, `aplicatii/date/powerpoint.json` (regenerat, `--verifica` 0), `aplicatii/aplicatii.css`
  (doar `.lh-ap-p-*` + regula backstage mutată sub `.lh-ap-powerpoint`), `de_verificat.md` (R12-1…R12-8); notele din `runde/12/`.

## Urmează (constructorul următor)
6. MINOR din critic 11 §6 rămase: `modificat` după Ctrl+Z/Ctrl+Y post-salvare; `diapozitiv_activ` null cu 0 diapozitive; Font
   (Font style, Underline style) și Paragraph (Alignment) la OK; zonele de atins ≥ 32 px la 360 px (lansatorul Font 21×21, benzile
   `margine_forma` 6 px). FĂCUTE deja: `.lh-ap-strat-backstage` sub `.lh-ap-powerpoint`; „Insert Table...” scris de mână scos
   (lista Table din referință).
7. Pasul 7 complet (singur pe mașină, după ultima scriere sub aplicatii/), apoi raport_constructor.md + gata_pentru_critic.md.

## Unelte
- `runde/12/proba_grav.py` (`--inainte` = pe HEAD prin git archive în %TEMP%); `runde/12/o4_ppt.py [--doar subșir]`; `runde/12/h.py` (copia hamului criticului 11).
- [presupus] de scris în de_verificat.md: R12-1 ordinea insignelor KeyTips; R12-2 închiderea fără întrebare pe prezentarea nemodificată,
  ✕ pe ultima prezentare (aplicația reală se închide de tot; simulatorul rămâne în fereastra goală), Enter în File name = Save.

## Constructorul 2 (cel care termină) — 20.11
- **Bucata 6 — MINOR (critic 11 §6)**, gata:
  - `powerpoint.js` `anuleaza`/`reface`: `M.salvat = false` (ca Word `pune`) → `modificat` true după Ctrl+Z/Ctrl+Y post-salvare;
  - `I.stare` › `diapozitiv_activ`: `null` cu 0 diapozitive;
  - telefon (≤ 480 px): `zoneAtingere()` (lansatoarele, zona lărgită spre locul liber din grup) + `aplicatii.css` (benzile chenarului
    casetei ALESE 32 px = 24 în afară + 8 înăuntru, benzile casetelor nealese neatingibile, colțul `diapozitiv` ≥ 32×32); insigna KeyTips
    a lansatorului lărgit stă sub pictogramă;
  - Font style / Underline style / Alignment: LĂSATE — referința are ComboBox-urile doar cu valoarea curentă (fără Edit, lista ▾ necapturată) → R12-9.
- Proba: `proba_grav.py` + secțiunea `p6` (9 verificări); `--ref 552ac0c5 --doar p6` = 5 picate → worktree = **0 picate din 49**
  (`proba_grav_552ac0c5_p6.json`, `proba_grav_dupa.json`). `--inainte` = acum 32fe7fb1 fix (pornirea rundei), nu HEAD.
- `de_verificat.md`: R12-9 (Font style / Underline / Alignment), R12-10 (zonele de atins pe telefon). `diferente.md`: rândurile M1-M4.
  `gata_pentru_critic.md` scris (fără numerele pasului 7).
- Regresul (`regres_c2.sh` → `c2_regres_rezumat.txt`): 11/proba_powerpoint 0 · Word 5/4/4-telefon/3/2 = 0 · Excel 10/9/8/7-cont/6 = 0 ·
  7/proba_grav 2 (X6, aceleași rânduri ca la predare) · 7/proba_grav_cont2 3 (X8, aceleași). Json-urile neurmărite din runde/7-10 mutate
  în %TEMP%/lh_r12_c2_regres_iesiri/; nimic urmărit atins în runde/2-11.
- Pasul 7 complet (09:08-10:19, singur, după ultima scriere sub aplicatii/ la 08:58:47, aplicatii.css): O1 61 · O2 13392 · O3 25076 · **O4 48 → 30** ·
  O5 82 · O6 NECONCLUDENT (1801 s, timpul) · O7 341 · O8 102 · O9 27 · porți 41 (cum_fac 41, restul 0) · lacăt ok
  (`masurare_pas7.json`, `pas7_masoara_complet.log`). Toate oracolele ~1,3-2× mai lente decât la pornire (porți 1799 → 3479 s).
- Regula O6: `--doar O6` singur (10:20-10:50) → tot NECONCLUDENT la 1800 s (`masurare_o6.json`, `pas7_o6_1.log`); `masurare.json` =
  `masurare_pas7.json` pus înapoi. A doua reluare singură cu `--timeout O6=3600` pornită la 10:5x (`pas7_o6_2.log`).
- O4: 26/27 scenarii PowerPoint „ok”, `powerpoint-tragere-forma` = `fara_real`.
- A doua reluare O6 singură, `--timeout O6=3600` (10:51-11:11): **0** în 1237 s → `masurare_o6.json`; prima reluare = `masurare_o6_1.json`;
  `masurare.json` = `masurare_pas7.json` pus înapoi. `ingheata.py --verifica` = 0. Nicio creștere → nimic dat înapoi.
- Scrise: raport_constructor.md, gata_pentru_critic.md, diferente.md (M1-M4 + confirmarea O4). GATA_PENTRU_CRITIC.
