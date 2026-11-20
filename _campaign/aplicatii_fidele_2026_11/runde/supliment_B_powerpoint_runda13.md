# Supliment la promptul rundei 13 (valul B-powerpoint, runda a 3-a) — scris de orchestrator, 20.11.2026

Se citește DUPĂ `runde/13/prompt.md` și are întâietate acolo unde îl completează. La reguli nu-l contrazice.

## Unde suntem
- **Runda 12** (`runde/12/raport_constructor.md`, criticul `runde/12/critic.md`, unghiul aspect) a închis P1 (KeyTips), P2 (Font Color) și P5 (Duration, Animation Pane, Format Background la 1366×768).
- **Au rămas deschise** P3 și P4 (reparate parțial) și **4 GRAV noi**:
  - A1: galeria Shapes;
  - A2: paletele de culori;
  - A3: Format Background tăiat pe fereastra mică;
  - A4: comenzile de pe drumul lecțiilor care dau doar mesajul „aici nu e simulată”.
- **A doua rundă `acoperire`** (`runde/12/acoperire_powerpoint.md`, commit 8ad9e9a9) a capturat din PowerPoint real exact ce lipsea:
  - **8 suprafețe noi** în `D/referinte/uia_powerpoint.json`:
    - `dialog.FileOpen`, `lista.Font`, `lista.AnimationStartDropdown`;
    - `lista.ShapeFillColorPicker`, `lista.OutlineColorPicker`, `lista.OutlineColorPicker#Weight`;
    - `lista.SlideBackgroundStylesGallery`, `bara_stare#Slide Sorter`.
  - **Faptele lor** sunt în cheia `acoperire_r12.fapte`. Le citești prin Python:
    - `a_forma_clic`, `b_blank_presentation`, `b_ctrl_o_browse`, `nav_dialog.FileOpen`;
    - `c_font`, `c_start`, `c_shape_fill_outline`, `c_background_styles`;
    - `c_note`, `c_vederi`, `d_durate`, `e_imagine_two_content`.
  - **14 scenarii noi**, din care 12 cu `mod_probat: true`. `stea-ctrl-c-v` și `note` sunt [NEVERIFICAT].
  - **`api_biblioteca.md`:**
    - §3: țintele `bara_stare:<nume>` și `zona_note`;
    - §5: cheile `font_text`, `pornire_animatii`, `umplere_forme`, `note_diapozitive`, `vedere`, plus `fel: imagine` la substituent;
    - §7.1: `start` cu `diapozitive[].forme`, `diapozitive[].fonturi` și `fisiere`.
- **Biblioteca e comisă local** pe `fidelitate-aplicatii` și nepublicată, deci `git restore` merge.
- **Word (8 GRAV) și Excel (3 GRAV) rămân deschise**, dar nu în runda asta. Codul comun îl atingi doar cât cere PowerPoint, iar Word și Excel nu au voie să se strice.
- **Unghiul rundei e `gest_tastatura`.** Criticul 13 va încerca fiecare reparație ȘI cu tastatura:
  - tastele de acces din `date/powerpoint.json › ta`;
  - săgețile, Enter și Esc în liste;
  - Tab, Enter și Esc în ferestre;
  - Ctrl+C / Ctrl+V / Delete pe obiecte;
  - F5 și Esc.
  Ce faci cu mouse-ul trebuie să meargă și din taste, acolo unde referința sau șirul `ta` îl dă.

## Ținta rundei 13, în ordinea pagubei pentru elev
Fiecare GRAV se închide doar cu ce spune referința: `uia_powerpoint.json` (pe chei, prin Python), `scenarii_real/powerpoint-*.json` și `surse_microsoft.md`. Ce lipsește din referință NU inventezi: scrii [presupus] în `de_verificat.md` (de la **R13-1**) sau dai mesajul central standard.

1. **P4 rest — clicul pe formă, Ctrl+C / Ctrl+V și formele în `start`.** Deblochează m1-l05, m1-l06 și m2-l09.
   - **Clicul pe formă** (`acoperire_r12.fapte.a_forma_clic.clic_mijloc`, api §3, rândul ~132):
     - Clicul în MIJLOCUL stelei, săgeții, dreptunghiului sau al unei casete de text nealese alege forma ca OBIECT: `Selection.Type 2`, fără cursor în text.
     - Clicul pe chenarul dreptunghiului care încadrează steaua, în afara desenului, nu alege nimic. Pe un loc gol, la fel.
     - Azi clicul dă `cursor_text`, iar Ctrl+C tace. Asta trebuie să dispară.
     - **Substituenții** (titlu, subtitlu, conținut), unde lecțiile scriu cu tastatura, NU sunt în captură: comportamentul lor de azi rămâne. Scrii R13 dacă îți pare că se bate cu faptul de mai sus.
   - **Ctrl+C pe forma aleasă → miniatura 2 → Ctrl+V** pune „Star: 5 Points” pe diapozitivul 2, în același loc ([60, 180, 180, 170] pt). Scenariul `powerpoint-stea-ctrl-c-v` are drumul capturat. Rezultatul lui real e [NEVERIFICAT], deci O4 poate rămâne pe el: explici în `diferente.md`.
   - **Delete pe forma aleasă o șterge.** Asta cere m2-l09: „clic pe imaginea Pământului → Delete”. Dacă nu e în referință → [presupus] + R13.
   - **`start`** (api §7.1, rândurile ~284-290):
     - `diapozitive[i].forme` `[{fel, forma?, text?, pozitie, umplere?, fisier?}]`;
     - `diapozitive[i].fonturi`;
     - `fisiere` `[{nume, diapozitive}]`, folosit de P3 la Open.
     - Desenezi formele din `start` la fel ca formele puse din Shapes.
2. **A4 — listele de pe drumul lecțiilor** (m1-l06, m1-l07, m2-l08 și jocul `prezentari-vi`, cu 31 de apariții).
   - **Font ▾** (`lista.Font`, `fapte.c_font`):
     - Theme Fonts are „Calibri Light (Headings)” și „Calibri (Body)”, apoi All Fonts.
     - În suprafață sunt doar cele 17 nume vizibile. Restul îl iei din `fapte.c_font.all_fonts`, care sunt fonturile PC-ului capturat; păstrezi ordinea.
     - Calibri Light (Headings) dă `font_text` „Calibri Light”, iar caseta arată „Calibri Light (Headings)”. Scenariul: `powerpoint-font-titlu`.
   - **Animations › Start ▾** (`lista.AnimationStartDropdown`, `fapte.c_start`):
     - Rândurile sunt On Click / With Previous / After Previous și dau `pornire_animatii` `la_clic` / `cu_precedenta` / `dupa_precedenta`.
     - Caseta arată numele. Scenariul: `powerpoint-animatie-start`.
   - **Shape Fill ▾ și Shape Outline ▾** (`lista.ShapeFillColorPicker`, `lista.OutlineColorPicker`, `lista.OutlineColorPicker#Weight`, `fapte.c_shape_fill_outline`):
     - Rândurile: Theme Colors 60, Standard Colors 10, No Fill / No Outline și restul, în ordinea din referință.
     - Yellow dă `umplere_forme` solid #FFFF00 (`powerpoint-shape-fill`).
     - Weight ▸ 3 pt și Orange #FFC000 pe contur.
     - Același buton există în Home › Drawing (`randuri.lista.ShapeFillColorPicker#Home`).
     - Paleta o desenezi cu codul paletei Font Color, nu cu o copie a lui.
   - **Background Styles ▾** (`lista.SlideBackgroundStylesGallery`, `fapte.c_background_styles`):
     - Rândurile sunt Style 1 … Style 12, Format Background..., Reset Slide Background (gri).
     - Style 6 dă `fundal_diapozitive` solid #E9E7E7 pe TOATE diapozitivele (`powerpoint-background-styles`).
     - Culorile celorlalte stiluri, dacă nu sunt în fapte → [presupus].
3. **P3 rest — fișierele** (m1-l03).
   - **File › New › Blank Presentation** (`fapte.b_blank_presentation`): se deschide „Presentation2”, cu 2 prezentări deschise. Fereastra activă e Presentation2, Backstage se închide și rămâne un diapozitiv Title Slide (`powerpoint-blank-presentation`).
   - **Ctrl+O › Browse** deschide fereastra `dialog.FileOpen` (`fapte.b_ctrl_o_browse`, `nav_dialog.FileOpen`):
     - Are File name:, Files of type „All PowerPoint Presentations (…)”, Open ▾, Cancel și Tools ▾.
     - Restul ferestrei e în româna Windows, ca în captură. Lista din fereastră arată DOAR fișierele din `start.fisiere`.
     - Numele + Enter deschide fișierul: devine prezentarea activă, cu 2 deschise (`powerpoint-ctrl-o-browse`, „Plante_6A_Pop.pptx”).
     - Esc și Cancel închid fereastra fără nimic altceva.
     - Fereastra Open a lui Word (runda `acoperire` 18.11) îți poate da codul comun. NU-i schimbi aspectul pentru Word.
4. **A4 — notele și vederile** (m1-l02, m2-l09).
   - **View › Notes și „Notes” din bara de stare comută zona de note** (`fapte.c_note`). La pornire zona e deschisă.
   - **În zona de note se scrie cu tastatura** (`note_diapozitive`, ținta `zona_note`).
   - **Aspectul zonei NU e în UIA**, deci e [presupus] + R13. Locul ei îl iei din `fapte.c_note`, dacă îl are.
   - **Bara de stare** (`fapte.c_vederi`, `bara_stare#Slide Sorter`):
     - Slide Sorter → `vedere` „sortare”: bara de stare fără Notes / Comments, Slide Sorter apăsat, Zoom 100 %.
     - Normal → „normala”.
     - Reading View → expunere în fereastră; Esc → Normal.
     - Slide Show → ecran întreg; Esc → Normal.
     - Scenariile: `powerpoint-slide-sorter`, `powerpoint-slide-sorter-normal`, `powerpoint-note` (acesta e [NEVERIFICAT]: explici în `diferente.md` dacă rămâne).
5. **A3 — Format Background pe fereastra mică și pe telefon** (m1-l06, contractul I1, 1366×657 la 125%).
   - În referință (`panou.LaunchFormatBackground#Solid fill`), conținutul stă într-un `Pane` derulabil cu bara lui. „Apply to All” și „Reset Background” stau SUB el, în afara derulării, mereu la vedere.
   - Cauza de azi: `powerpoint.js:828`, unde `p.style.height = Math.min(s.r[3], ZR[3] - 4)` folosește zona din REFERINȚĂ, nu zona de pe ecran (`aplicatii.css:349`, `overflow:hidden`).
   - Panoul se potrivește zonei de pe ecran. Partea de sus se derulează cu rotița și cu degetul, iar butoanele rămân jos.
   - Proba e cu gest real: rotiță, glisare și clic în centrul butonului (`elementFromPoint`). NU cu `scrollIntoView`.
   - Același lucru îl verifici la Animation Pane.
6. **A1 — galeria Shapes ▾** (m2-l10:307, m1-l06).
   - **Titlurile celor 10 grupuri** („Recently Used Shapes”, „Lines”, … „Block Arrows”) apar pe banda de 28 px din referință. Azi textul lor e gol.
   - **Fiecare rând are desenul formei lui**, nu același pătrat (`powerpoint.js:262`, `aplicatii.css:398`):
     - Desenul nu e în UIA. Îl faci ca SVG mic, generat din numele formei (linie, dreptunghi, oval, stea, săgeată la dreapta…), dintr-o singură funcție.
     - Desenul e [presupus] + R13. Numele și ordinea rămân cele din referință.
   - **Numele la hover:** `title` = numele din referință. Sfatul real nu e capturat, deci aspectul lui e [presupus].
   - **Locul listei:** se deschide lipită sub buton (y ≈ 159 în referință), nu la y = 3. Pe un ecran de 768 se taie jos și se derulează.
   - **Cele 12 „Action Button: …”** nu rămân 0×0.
   - **Cu tastatura:** săgețile mută alegerea, Enter alege și Esc închide lista. Ce face Enter pe o formă (unde o pune) NU e capturat → [presupus] + R13. Nu inventa un comportament anume.
7. **A2 — paletele de culori** (Font Color în panglică și pe mini-bară, Format Background › Color, Shape Fill, Shape Outline).
   - **Textul „Theme Colors” și „Standard Colors”** apare pe banda de titlu din referință: 32 px, respectiv 35 px.
   - **Fiecare pătrat are `title`** = numele culorii din referință (`acoperire_r11.fapte › randuri.lista.FontColorPicker`, 70 de nume).
   - **Valorile #RRGGBB ale culorilor de temă** rămân cum sunt (`powerpoint.js:572-578`, [presupus]), afară de ce dă acum `c_shape_fill_outline`: Yellow, Orange.
8. **MINOR din `runde/12/critic.md` §7**, doar după 1-7:
   - **Duratele:** Push și Wipe pun 1 s, fără tranziție rămâne 2 s, iar Fade rămâne 0,7 (`fapte.d_durate`; `powerpoint-durata-push`, `-wipe`).
   - **Imaginea pe Two Content** intră în caseta goală din dreapta, ca substituent cu imagine (`fel: imagine`, [486, 163, 408, 304]; `powerpoint-imagine-two-content`). Rămân 3 forme.
   - **Listele:** cele +3 px față de referință.
   - **Butonul Font Color**, cu text ales, se cheamă „Font Color Red”.
   - **Fără prezentare,** bara de stare nu mai scrie „Slide 1 of 0”.
   - **Săgeata ▾** de la More Colors / Eyedropper dispare.
   - **„Save your changes”:** titlul gol în bara de titlu și fereastra în ecran la 360 px.
   - **Solid fill** bifat pe ecran când starea e `solid`.
   - **Zonele de atins sunt ≥ 32 px la 360 px:** paletele, grila Table, Shapes, Font Color ▾, butoanele ferestrelor. Zona se lărgește pe atingere, fără să schimbe ce se vede.
   - **`[FARA_REFERINTA]`** din critic §6 NU se repară, afară de ce a lămurit runda `acoperire`: duratele, clicul pe formă, imaginea pe Two Content.

**Ținta numerică:**
- **O4 trebuie să scadă.** Din 50 rămân cel mult:
  - `stea-ctrl-c-v` și `note` (fără rezultat real probat);
  - `tragere-forma`;
  - ce explici în `diferente.md`, scenariu cu scenariu.
- **O3 NU scade în etapa B.** Măsoară doar paginile lecțiilor, care folosesc încă simulatoarele vechi (vezi `runde/12/cadru.md`).
  - Desenezi totuși suprafețele noi din date: generatorul `aplicatii/_unelte/genereaza_powerpoint.py` le citește din `uia_powerpoint.json`, fără etichete scrise de mână.
  - O3 nu are voie să crească.
- **Celelalte oracole și porțile nu cresc.** Porțile: `controale_taiate` = 2 la pornire sunt depășiri de timp ale mașinii lente, nu defecte. Dacă rămân, explici cu logul.

## Ce citești întâi
- `D/contract.md`, apoi `D/api_biblioteca.md`: §3 (`bara_stare`, `zona_note`, `margine_forma`), §5 powerpoint (cheile noi), §6.3, §7.1.
- `runde/12/critic.md` (P3, P4, A1-A4, §6, §7) și `runde/12/acoperire_powerpoint.md`.
- `uia_powerpoint.json › acoperire_r12.fapte`, prin Python.
- Cele 14 scenarii noi și perechile lor reale.
- Codul, cu Grep înainte de Read:
  - `powerpoint.js` (1706 rânduri);
  - `genereaza_powerpoint.py`;
  - `aplicatii.css`, doar regulile `.lh-ap-powerpoint`.
- Ca model, pe bucăți:
  - fereastra Open din `word.js`;
  - paleta Font Color din `powerpoint.js` (rândurile 250-254, 572-578).

## Măsurarea
- **Pasul 1 e deja făcut.** Pornirea ta e `runde/13/masurare_pornire.json`, adică măsurarea rundei `acoperire`, din 20.11 12:49-14:02, singură pe mașină:
  - O1 61, O2 13392, O3 26855, O4 50, O5 82, O6 0, O7 341, O8 102, O9 27;
  - porți 43 (cum_fac 41, controale_taiate 2 pe timp); lacăt ok.
  NU rulezi o măsurare de pornire. Scrii sub `aplicatii/` de la început.
- **Între pași** rulezi parțial: `--doar O3,O4,O5,O8,O9`.
- **Pasul 7:** `python D/oracole/masoara.py --runda 13 --paralel 3 --compara D/runde/13/masurare_pornire.json --timeout O6=3600`.
  - Îl pornești DUPĂ ultima ta scriere sub `aplicatii/`, SINGUR pe mașină. Cât rulează, nicio probă și niciun browser în paralel.
  - Mașina e lentă azi: pasul 7 a durat 73 de minute la runda `acoperire`.
  - **Dacă O6 iese totuși NECONCLUDENT pe timp:**
    1. copiezi `masurare.json` în `masurare_pas7.json`;
    2. reiei singur `--runda 13 --doar O6 --timeout O6=3600 --compara D/runde/13/masurare_pornire.json`;
    3. copiezi rezultatul în `masurare_o6.json`;
    4. pui înapoi `masurare_pas7.json` ca `masurare.json`;
    5. scrii în raport.
  - Orice oracol sau poartă care crește din cauza ta → `git restore` pe fișierele tale.
- **Proba ta:** `runde/13/proba_grav.py`, cu gesturi reale pe poligon, ȘI cu mouse-ul ȘI cu tastatura. Acoperă:
  - P3 și P4 (rest);
  - A1-A4;
  - MINOR-urile reparate.
  Înainte și după, ieșirile în json.
  - Gesturile le poți lua din probele criticului 12 (`runde/12/critic_probe/`). NU le rulezi pe loc, fiindcă scriu peste ieșirile comise: copiezi ce-ți trebuie.
  - Fereastra mică (1366×657 la 125%) și telefonul (360×740) intră în probă la A3 și la zonele de atins.
- **Regresul, la 0 picate:**
  - **PowerPoint:** `runde/12/proba_grav.py` (49 de verificări) și `runde/11/proba_powerpoint.py`.
  - **Word:** `runde/5/proba_grav.py`, `runde/4/proba_grav.py`, `runde/4/proba_telefon.py`, `runde/3/proba_grav.py`, `runde/2/proba_grav.py`.
  - **Excel:** `runde/10/proba_grav.py`, `runde/9/proba_grav.py`, `runde/8/proba_grav.py`, `runde/7/proba_grav_cont.py`, `runde/6/proba_excel.py`.
    - La `runde/7/proba_grav.py` și `runde/7/proba_grav_cont2.py` sunt acceptate doar căderile deja explicate (`runde/8/diferente.md` D14, D18).
- **`oracole/porti.py` NU-l rulezi direct.** La final `python D/ingheata.py --verifica` = 0.
- **În niciun fișier pe care-l scrii nu pui căi cu numele utilizatorului Windows:** scrii „%TEMP%”.

## Office real
- **PowerPoint real NU-l pornești deloc.** Referințele sunt capturate. PowerPoint are o singură instanță, iar utilizatorul îl poate folosi oricând (contractul I6).
  - Pe mașină a rămas un proces `POWERPNT.EXE` blocat la închidere, al rundei `acoperire`. NU-l atingi: nu e al tău.
  - Ce nu e în referință trece în `de_verificat.md`.
- Word și Excel real doar invizibil: `DispatchEx`, `Visible=False`, `DisplayAlerts=0`, fișiere unice în %TEMP%. Închizi DOAR PID-ul tău.
- Niciodată `Dispatch` / `GetObject` / `GetActiveObject` / `taskkill /IM`. WINWORD-ul deja deschis e al omului.
- Probele în browser rulează doar pe 127.0.0.1/localhost, headless.

## Ce NU faci (le face orchestratorul)
- **Pasul 8 (criticul) și pasul 9 (commit, merge, push).** Te oprești după pasul 7 și scrii:
  - `runde/13/raport_constructor.md`:
    - numerele înainte → după;
    - FĂCUT / NEFĂCUT / NESIGUR pe P3, P4, A1-A4 și MINOR;
    - lista exactă a fișierelor create sau schimbate;
    - ce scenarii PowerPoint trec acum;
  - `runde/13/gata_pentru_critic.md`: unde e ce și ce gesturi (mouse și tastatură) s-au reparat;
  - `runde/13/diferente.md`: fiecare scenariu care încă nu trece și de ce.
- **Fără commit, fără push.**
- **Atingi doar:**
  - `aplicatii/`;
  - notele tale în `runde/13/`;
  - `de_verificat.md`, `de_aprobat.md`.
- **NU atingi:** lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, scenariile și `api_biblioteca.md`.

## Economia contextului (OBLIGATORIU)
- **După fiecare bucată terminată** actualizezi `runde/13/stare_autor.md`: ce e gata, ce urmează, ce fișiere, ce numere. Bucățile:
  1. P4: clicul pe formă, Ctrl+C/V și Delete pe obiect, `start` cu forme, fonturi și fișiere;
  2. A4 listele: Font, Start, Shape Fill/Outline (+ Weight), Background Styles;
  3. P3: Blank Presentation, fereastra Open, deschiderea din `start.fisiere`;
  4. A4 notele și vederile: zona de note, View › Notes, bara de stare;
  5. A3 Format Background (și Animation Pane) pe fereastra mică și pe telefon;
  6. A1 Shapes și A2 paletele;
  7. MINOR.
- **La ~200k de context** te oprești la prima graniță curată, cu `stare_autor.md` la zi, și raportezi „PREDARE”.
  - La predare NU rulezi pasul 7: rulezi doar `--doar O3,O4,O5,O8,O9`, proba ta și regresul, și scrii numerele în `stare_autor.md`.
  - Pasul 7 complet îl rulează doar constructorul care termină runda.
- **Ieșirile mari de Bash** le scrii în fișier și aduci în context doar coada.
- **`uia_powerpoint.json`, `date/*.json` și `suprafete.json`** le citești doar prin Python, pe chei.
