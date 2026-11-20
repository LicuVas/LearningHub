# Runda 14 (B-powerpoint, ultima din val) · criticul rece · unghiul STARE_FINALA_ERORI

## 1. Antet
- Cine: criticul rece al rundei 14. N-am văzut conversația constructorului; n-am deschis `diferente.md`, `de_verificat.md`,
  `de_aprobat.md`, `raport_constructor.md`, `cadru.md`, `tinta.md`, `contra.md`, `stare_autor.md`, `prompt.md`, `STARE_ORCHESTRATOR.md`,
  `jurnal.jsonl` și nici rapoartele altor runde (afară de `runde/13/critic.md`).
- Uneltele mele: `runde/14/critic_probe/`. Hamul `h.py` + `k.py` (copiate din `runde/13/critic_probe/`): server static pe 127.0.0.1, port
  liber, Chromium headless, `ctx.route('**/*')` care abandonează tot ce nu e 127.0.0.1/localhost (`plecate = []` în toate rulările).
  Gesturi adevărate: `page.keyboard`, `page.mouse`, `page.touchscreen`, CDP `Input.insertText`. Probele:
  - `a1.py` (T1 în cele 6 ferestre, T2 „Alt, J D, …”, T4 în PowerPoint / Word / Excel, asistentul pe Esc);
  - `b1.py` (14 greșeli tipice + Ctrl+Z / Ctrl+Y, starea și ecranul înainte / după), `b2.py` (T3 pe ecran; ✕ / Ctrl+W / File › Close cu
    Cancel / Esc / Don't Save; două și trei prezentări; Save As cu nume existent / gol / Esc; Open cu nume inexistent; forma desenată),
    `b3.py` (Alt singur în ferestre, asistentul pe Tab / Alt+literă, caseta Font, lista Font din ▾, telefon, fereastra mică),
    `b4.py` (telefon 360×740 cu derularea la țintă), `b5.py` + `b6.py` („ecranul = starea”: culoare, fundal pe pixeli, poziții, durată,
    Animation Pane), `l_drumuri.py` (proba de drumuri a criticului 13, `a1.py`, rulată pe worktree-ul de acum);
  - `c1.py` (referința pe chei), `d1.py` (Word / Excel: e3300ec9 față de acum).
  Ieșirile: `critic_probe/*_out.json`, `*_rez.txt`, `*.log`. PowerPoint real NU a fost pornit; nici Word / Excel real.
- Diff-ul rundei (`git diff e3300ec9 -- aplicatii`, comis 667eb704): `aplicatii.js` +96 (tasta în curs pentru Esc, `tastaFaraClic` →
  `tasta_esc`, cârligul opt-in `I.la.fereastra` cu Alt + literă / Tab / focusul inițial în ferestre, asistentul nu numără Esc-ul din
  KeyTips), `powerpoint.js` +141/−15 (insigna „JD”, listele din taste, H pe Home activă = navigare, Enter / Space / Tab în ferestre,
  butonul implicit, `caseta_activa`, ținta `zona_note`, clicul în caseta Font alege tot, zona de note goală fără text, adresa
  „Documente” în Open, literele nu mai intră în diapozitiv cât e o listă deschisă), `aplicatii.css` +5/−2 (Calibri / 'Calibri Light',
  rezerva Carlito). word.js și excel.js neatinse.

## 2. A. Cele 4 GRAV din runda 13

### T1 — Tastatura în ferestre: **ÎNCHIS**
- **Open** (Ctrl+O › Browse, `a1_out › t1_open`): la deschidere focusul în File name (`camp:nume_fisier`); Tab ×3 / Shift+Tab ×3 →
  File name → Files of type → Tools → Open și înapoi, toate cu `supr: dialog.FileOpen`, câte un `tasta_tab / mutare_focus`; `Alt+n` →
  `{g:'tasta_acces', a:'focus_camp', t:'camp:nume_fisier'}`; „Plante_6A_Pop.pptx” tastat în casetă; `Alt+o` → `{tasta_acces,
  deschidere_fisier, fereastra:Open}`, `prezentare_activa "Plante_6A_Pop.pptx"`, `prezentari_deschise 2`.
- **Save your changes** (Ctrl+W după „X” în titlu): `Alt+n` → `{tasta_acces, inchidere_prezentare, fereastra:Don't Save}`, 0 prezentări,
  `dialog.apasat "Don't Save"`; `Alt+s` → `salvare_si_inchidere`, `apasat "Save"`; Tab ×7 trece prin File name, Save as type, Choose a
  Location, More options…, Save, Don't Save, Cancel și se întoarce în File name (nu iese din fereastră); Enter pe Cancel →
  `{tasta_enter, anulare, fereastra:Cancel}`, prezentarea rămâne cu „VulcXanii”; Esc → `anulare` (= `acoperire_r11.fapte.b_ctrl_w.dupa_esc`:
  `fereastra_inchisa: true, prezentari: 1`).
- **Insert Picture** (`Alt, N, P, D`): focus în File name; Tab rămâne în fereastră; `Alt+n`, „pamant.png”, `Alt+o` → `inserare_imagine`,
  imaginea pe diapozitivul 1. **Save As** (F12): Tab ×2 rămâne; `Alt+n`, „Vulcanii”, `Alt+s` → `{tasta_acces, salvare, dialog_salvare:Save}`,
  `nume_fisier "Vulcanii.pptx"`, bara de titlu „Vulcanii - PowerPoint”.
- **Font** (lansatorul Home › Font): se deschide cu focusul în `camp:Latin text font` (valoarea „+Heading” = referința `dialog.FontDialog
  PowerPoint › Latin text font valoare "+Heading"`); `Alt+s` → `camp:Size` („60”); „40” + Enter → `{tasta_enter, marime_font, camp:Size,
  activat:'fereastra:OK'}`, `marime 40`; Ctrl+Z → 60. Tab ×14: toate în fereastră. **Paragraph**: focus în `camp:Alignment`; `Alt+g` →
  `focus_camp camp:Alignment`; `Alt+q` → `tasta_acces / fara_efect`, fereastra rămâne; Esc o închide.
- Literele sunt cele din referință, pe noduri (`c1_out.txt`): File name „Alt+n”, Open „Alt+o”, Save „Alt+s” / „ALT+S”, Don't Save „ALT+n”,
  Size „ALT+S”, Alignment „ALT+g”. După fiecare închidere (Alt + literă, Enter, Esc), focusul e în rădăcina aplicației
  (`TEXTAREA.lh-ap-intrare`), iar Ctrl+Z ajunge la aplicație (`ctrl_z / anulare` sau `fara_efect` când nu e nimic de anulat).
- Word și Excel nu primesc cârligul: evenimentele lor în F12 / Ctrl+D / Ctrl+1 sunt identice cu e3300ec9 (D).
- Rămâne (nu ține T1 deschis): Alt apăsat singur într-o fereastră nu emite niciun eveniment (MINOR, §7); ordinea Tab și butonul implicit
  sunt [presupus] (§6).

### T2 — Fila Shape Format din taste: **ÎNCHIS**
- Steaua aleasă (`a1_out › t2_jd`): `Alt` → insignele filelor; `J` → `["JI","JD"]` (`prefix_tasta_acces`); `D` → `{tasta_acces, fila,
  fila:Shape Format}`, insignele `ZH, SH, E, X, M, ZY…`; `S` → `SH, SS, SF, SO, SE, SZ`; `F` → `lista.ShapeFillColorPicker` deschisă, cu
  insignele `H, M, E, P, G, T`; Esc → înapoi la literele Shape Format; `S, O` → lista Shape Outline (`H, M, E, W, K, S`); `W` →
  `lista.OutlineColorPicker#Weight` (insigna `L`); `x` → `tasta_acces / fara_efect`, insignele rămân; ↓ ×6 + Enter →
  `{tasta_enter, contur_forma, activat:'meniu:2¼ pt'}`; textul stelei rămâne `""` (nicio literă intrată în formă).
- „Alt, J D, S F” + clic pe Yellow → `umplere_forme[1][1] = {solid, #FFFF00}`; Ctrl+Z → `#4472C4` (`t2_sf_yellow`).
- Referința (`c1_out.txt`): `Ctx_ShapeFormat › Group 'Shape Format' "Alt, J D"`; `lista.ShapeFillColorPicker`: High-contrast only „Alt, J D,
  S F, H”, More Fill Colors... „M”, Eyedropper „E”, Picture... „P”, Gradient „G”, Texture „T”; `lista.OutlineColorPicker`: „H, M, E, W, K, S”;
  `#Weight › More Lines... "Alt, J D, S O, W, L"`. Toate insignele de pe ecran sunt în referință.

### T3 — Fontul temei pe ecran: **ÎNCHIS**
- `b2_out › t3` (start ca m2-l08: titlul 1 în Comic Sans MS, restul fără font): `document.fonts.check` → Calibri Light, Calibri, Carlito
  instalate. Titlul fără font: `"Calibri Light", Carlito, sans-serif`, lățimea textului 239,5 px; subtitlul fără font: `Calibri, Carlito,
  sans-serif`. Caseta Font = „Calibri Light (Headings)”. Font ▾ › Calibri Light (Headings) → aceeași stivă, aceeași lățime 239,5 px
  (literele NU se schimbă), `font_text "Calibri Light"` (= `acoperire_r12.fapte.c_font.dupa_calibri_light`).
- Arial (greșit) → 266,3 px; Ctrl+Z → 239,5 px, iar caseta, după ce aleg din nou chenarul, arată „Calibri Light (Headings)”.
  Calibri Light din All Fonts → aceleași litere, caseta „Calibri Light” fără „(Headings)” (ce cere m2-l08:161).
- Miniatura și expunerea (Shift+F5) desenează titlul cu aceeași stivă `"Calibri Light", Carlito, sans-serif`. Niciun „Aptos” rămas
  (grep în `powerpoint.js` și `aplicatii.css`: 0).

### T4 — Esc în modul tastelor de acces: **ÎNCHIS**
- `a1_out › t4_ppt / t4_word / t4_excel`: `Alt, H, Esc, Esc` → ambele Esc `{g:'tasta_esc', a:'iesire_taste_acces'}` în PowerPoint, Word și
  Excel (= api_biblioteca.md:172); Alt apăsat a doua oară rămâne `tasta_acces / iesire_taste_acces`. Cod: aplicatii.js:467.
- Asistentul (aplicatii.js:630): Esc-ul din KeyTips nu e numărat. E o abatere de la litera §6.3 (lista excepțiilor nu are `tasta_esc`),
  declarată de constructor ca propunere către Vasile; o trec la MINOR (§7), nu la GRAV: elevul nu învață nimic greșit din ea.

### Drumurile lecțiilor, pe poligon (1366×768), după rundă
| lecția | se duce la capăt? | unde se blochează elevul |
|---|---|---|
| m1-l02 | da, dar finalul e greșit | notele, View › Notes, bara de stare, F5 merg (`l_drumuri › A4_drum`). Ultimul pas (:329) „Închide PowerPoint cu ✕ … Don't Save” lasă PowerPoint deschis, gol, iar al doilea ✕ dă „aici nu e simulată” → **GRAV S1** |
| m1-l03 | da | Blank Presentation, Ctrl+O › Browse › fișier › Open (clic, Alt+O), F12 + nume + Enter / Alt+S, ✕ → Save / Don't Save / Cancel merg. Save As cu numele unui fișier existent salvează peste el fără nicio întrebare (:125 cere „already exists … Cancel”) → [FARA_REFERINTA] |
| m1-l05 | da | steaua: clic, Ctrl+C / Ctrl+X / Ctrl+V în același loc (`[60,180,180,170]`); săgeata → Delete; miniatura → Delete → Ctrl+Z (diapozitivul revine pe locul lui, `b1 › sterge_diapozitiv_2`) |
| m1-l06 | da | Font Color › Dark Blue (`#002060`, pe ecran `rgb(0, 32, 96)`), Shape Fill › Yellow, Shape Outline › Orange, Weight › 3 pt, Background Styles; Ctrl+Z la fiecare readuce starea și ecranul |
| m1-l07 | da | Fade (`00,70`), Apply To All (0,7 ×3), Ctrl+Z (doar Apply To All se anulează, apoi Fade), Start ▾ › With Previous / After Previous, Animation Pane |
| m2-l08 | da | Font ▾ › Calibri Light (Headings) nu mai schimbă literele (T3 închis); finalul (:330) are aceeași problemă ca m1-l02 → **GRAV S1** |
| m2-l09 | da | notele, imaginea → Delete, Pictures › This Device. Ctrl+Z în note șterge o singură literă pe apăsare ([FARA_REFERINTA]); Save As cu nume existent (:481) ca la m1-l03 |
| m2-l10 | da | Shapes › Arrow: Right + clic → forma; Ctrl+Z o scoate; miniatura goală → Delete (:213-217) |
| jocuri/prezentari-vi | da | Shape Fill / Shape Outline / Background Styles › Format Background (`l_drumuri › A2_palete`, `A4_drum`) |

`nesimulat` = 0 pe toate drumurile de mai sus, până la pasul ✕ de pe o fereastră goală (S1).

### MINOR-urile din critic 13 §7
- Asistentul: „H” cu Home activă = navigare: **făcut** (`Alt, h` → `prefix_tasta_acces`, `t4_asistent`).
- Telefon: tastarea în note cu ținta `zona_note`: **făcut** (`b3 › telefon_360`: `{tastare, scriere_note, zona_note}`).
- Fereastra Open scrie „Documente”: **făcut** (`b3 › mica`: „Documente” vizibil, 83 px; în referință `b_ctrl_o_browse.la_deschidere.
  campuri[11] = SplitButton 'Documente'`).
- „Click to add notes” scris din memorie: **făcut** (zona goală fără text, `b1 › e0.nota ""`).
- Tastarea într-o casetă a panglicii schimbă `dupa`: **făcut**, prin cheia nouă `caseta_activa` (`b3 › caseta_font`:
  `{tinta:'panglica:Home/Font/Font', text:'Arail'}`).
- View › Notes Page → `nesimulat`: **nefăcut** (constructorul nu-l pomenește; pe niciun drum de lecție).
- Rămase din critic 12, lăsate: listele la +3 px, Layout fără miniaturi, „Pov” tăiat și x = −26 la 360 px (`b4_out › viz.rect [-26, 228,
  460, 321]`), zonele < 32 px, fila „Fill” ca text: **nefăcute**.

## 3. B. Unghiul stare_finala_erori (PowerPoint): constatări noi

### GRAV S1 — „Închide PowerPoint cu ✕ … Don't Save” lasă PowerPoint deschis, iar al doilea ✕ dă „aici nu e simulată”
- Gestul (`b2_out › x_dont_save`, 1366×768; la fel pe telefon, `b4_out › tel_inchidere`): „Z” tastat în titlu, clic pe `bara_titlu:Close`
  → `intrebare_salvare`, fereastra „Save your changes to this file?”; clic pe Don't Save → `inchidere_prezentare`, `prezentari_deschise 0`,
  bara de titlu „PowerPoint”, fereastra aplicației rămâne pe ecran, cu Bold / New Slide / Paste / Font Color gri. Elevul, care avea de
  „închis PowerPoint”, vede PowerPoint tot deschis și apasă din nou ✕ → `{g:'clic', a:'nesimulat', t:'bara_titlu:Close'}` și mesajul
  „În aplicația reală, „Close” funcționează; aici nu e simulată.” (`x2`, `x3_ev`).
- Lecțiile: m1-l02:329 și m2-l08:330 se termină cu „Închide PowerPoint cu ✕ din colțul din dreapta sus. … apasă Nu salvați (Don't Save)”;
  m1-l03:215 „Fereastra se închide și, fiind singura, se închide tot PowerPoint.”; m1-l03:270 „✕ pe ultima fereastră închide PowerPoint”.
- Contractul: api_biblioteca.md:84-86 „Pe comenzile de pe drumul lecției mesajul nu e o ieșire: ele trebuie simulate.”; R12 (contract.md:38)
  „Orice comandă folosită de o lecție sau citată în ea funcționează”. ✕ e citat de trei lecții, iar starea în care dă mesajul e chiar
  cea la care duce drumul lecției.
- Codul: powerpoint.js:1120 `if (faraPrez()) return cum === 'x' ? I.nesimulat('Close') : 'fara_efect';` și comentariul powerpoint.js:1100-1101:
  „… ✕ pe ultima prezentare (care în aplicația reală închide de tot PowerPoint-ul) sunt [presupus] — R12-2”: constructorii știu că în
  aplicația reală PowerPoint se închide, dar poligonul îl lasă deschis.
- Ce e dovedit și ce nu: mesajul „aici nu e simulată” pe ✕ e o încălcare a §3, fără nevoie de referință. Starea reală după „✕ → Don't
  Save” pe ultima prezentare NU e capturată: `acoperire_r11.fapte.b_dont_save` (`prezentari 0`, titlul „PowerPoint”, `comenzi_activ`) nu spune
  gestul care a închis, iar `b_x` se oprește la Cancel → de capturat în runda `acoperire` (§9). Până atunci, cel mai mic pas cinstit:
  ✕ pe fereastra fără prezentare închide fereastra aplicației (sau măcar nu dă mesajul).

### Restul unghiului (fără GRAV), cu dovezile
- **Greșeala + Ctrl+Z / Ctrl+Y** (`b1_out`, starea întreagă comparată înainte / după, fără cheile de alegere): Font Color › Red, Font ›
  Arial, Calibri Light din All Fonts, tranziția Push, animația Fly In, aspectul Two Content, Background Styles › Style 6, Shape Fill › Red,
  steaua ștearsă, diapozitivul 2 șters, Ctrl+D pe miniatură, New Slide, Increase Font Size, „abc” tastat în titlu: după UN Ctrl+Z starea =
  starea dinainte (0 chei diferite), miniaturile și textele de pe ecran la fel; Ctrl+Y refă exact greșeala. Forma Oval desenată (`b2 › oval`):
  Ctrl+Z o scoate; Esc în modul de desen → `anulare`, clicul următor nu mai pune formă. Excepție: notele (§6).
- **Închiderea și fișierele** (`b2_out`): Ctrl+W / File › Close / ✕ pe prezentarea modificată deschid aceeași fereastră, butoanele
  `["More options…","Save","Don't Save","Cancel"]` (= `scenarii_real/powerpoint-ctrl-w-modificat.json`); Cancel și Esc o lasă deschisă, cu
  textul (= `b_ctrl_w.dupa_cancel` / `dupa_esc`), iar tastarea continuă la cursor („VulcZQanii”); Don't Save pe ultima → 0 prezentări, titlul
  „PowerPoint”, Bold / New Slide / Paste / Font Color gri (= `b_dont_save.comenzi_activ`: `Paste false, SlideNewGallery false, Bold false,
  FontColorPicker false, FileTabButton true, TabHome true`), clic pe Bold / New Slide → `indisponibil`, fără mesaj; Ctrl+M / Ctrl+Z → `fara_efect`.
  Două / trei prezentări: Ctrl+N → „Presentation2” activă, titlul „Presentation2 - PowerPoint”, 2 deschise (= `powerpoint-ctrl-n`);
  închisă cea activă → rămâne cea de dinainte, cu bara de titlu ei; un fișier deschis și nemodificat se închide cu ✕ fără întrebare.
- **Ferestrele, după greșeli în tastatură** (`a1`, `b3`): literă greșită cu KeyTips → `fara_efect`, insignele rămân; Esc urcă un nivel, apoi
  iese; Tab prin fereastră apoi Esc → fereastra închisă, focusul în rădăcină, Ctrl+Z merge; Alt + literă fără pereche → `fara_efect`,
  fereastra și focusul rămân. Alt singur într-o fereastră NU aprinde literele panglicii peste fereastra modală (`b3 › alt_singur_*`).
- **Caseta Font** (`b3 › caseta_font`): clicul în text alege tot (`selectionStart 0, selectionEnd 24`), lista se deschide; „Arail” + Enter →
  `fara_efect`, caseta revine la „Calibri Light (Headings)”; „Com” + Esc → `anulare`, caseta revine, focusul în rădăcină. Lista Font din ▾:
  literele nu mai intră în titlu (`fara_efect`), iar după Esc „q” intră la cursor.
- **Ecranul = starea** (`b5`, `b6`): Dark Blue → `#002060` și pe ecran `rgb(0, 32, 96)`, Ctrl+Z → `rgb(0, 0, 0)`; Style 6 → pixelul unui
  punct gol al diapozitivului `(233, 231, 231)` = `#E9E7E7`, miniaturile la fel, Ctrl+Z → `(255, 255, 255)`; pozițiile de pe ecran (în
  puncte) = `pozitii_forme` (`[66,29,828,104]`, `[60,180,180,170]`); Duration „00,70” după Fade (= `acoperire_r11.fapte.d_durate.
  Fade_pe_diapozitiv_fara_tranzitie.valoare_uia "00,70"`); Animation Pane „1 Fade : Title 1: Soarele”, „2 Fly In : Star: 5 Points 2” =
  `ordine_animatii [1, 2]`; Ctrl+Z pe With Previous readuce `la_clic`.
- **Telefonul și fereastra mică**: pe 1093×526 css (125 %), „Save your changes”, Open și Font încap, butoanele lor sunt lovite de
  `elementFromPoint`; Alt+N închide fără salvare. Pe 360×740 (atingere, după derularea la țintă): ✕, Cancel, Don't Save, lansatorul Font,
  Cancel din Font, Save din Save As se ating și lucrează; Undo din bara de acces rapid anulează nota și ștergerea diapozitivului. Fereastra
  „Save your changes” începe la x = −26 (MINOR vechi).
- **Asistentul (§6.3)** pe greșeli: Esc din KeyTips și H pe Home activă nu sunt numărate; pe drumul „Alt, J D, S F” spre Yellow, `D`
  (fila Shape Format) și `F` (lista) sunt numărate și indiciul vine când elevul tocmai a deschis lista bună; Tab-urile spre Cancel în
  „Save your changes” sunt numărate (indiciul la al doilea Tab), la fel `Alt+n` (`focus_camp`) — după litera §6.3, corect; vezi §7.

## 4. C. Fidelitatea generată din date
- `python aplicatii/_unelte/genereaza_powerpoint.py --verifica` → „chei diferite față de generarea de azi: 0”, ultima linie `0`
  (`critic_probe/c_verifica.log`); `git status -- aplicatii` curat după rulare.
- Etichetele și literele puse în rundă, față de referință (`c1.py`, `c1_out.txt`):
  - fereastra Open: „Documente” și „Toate locațiile” = `acoperire_r12.fapte.b_ctrl_o_browse.la_deschidere.campuri[11]` / `[10]`
    (SplitButton); „Până la "Desktop" (Alt + săgeată în sus)” și „Reîmprospătare "Documente" (F5)” = `la_deschidere.butoane`;
  - „J D” = `panglica_context.Ctx_ShapeFormat › Group 'Shape Format' "Alt, J D"`; literele din listele Shape Fill / Shape Outline / Weight
    (H M E P G T; H M E W K S; L) = `tasta_acces` din `lista.ShapeFillColorPicker`, `lista.OutlineColorPicker`, `#Weight`;
  - literele ferestrelor (File name „Alt+n”, Open „Alt+o”, Save „Alt+s”, Don't Save „ALT+n”, Size „ALT+S”, Alignment „ALT+g”, Latin text font
    „ALT+f”) = `tasta_acces` din `dialog.FileOpen`, `dialog.save_your_changes_to_this_file`, `dialog.PictureInsertFromFilePowerPoint`,
    `dialog.FileSaveAs`, `dialog.FontDialogPowerPoint`, `dialog.PowerPointParagraphDialog`.
  Nicio etichetă sau literă nouă în afara referinței: 0 abateri R4.

## 5. D. Regresul Word și Excel — nimic stricat
- `d1.py`: `aplicatii/` din e3300ec9 prin `git archive` într-un dosar din %TEMP% (șters la final, `tmp_sters: true`) față de worktree:
  dreptunghiurile `[data-lh-tip]` identice și capturile identice la pixel (0 pixeli diferiți) pentru Word 136 / 197 / 235 și Excel 227 /
  289 / 323 (pornire / File / F12) și pe telefon 360 (136 / 227).
- Gesturile vechi / nou: Word (tastarea „ proba”, `Alt, H, 1`, Ctrl+Z, F12 → „Tema” + Enter) și Excel (F2 = 7, F3 = `=1+2`, Ctrl+Z, ▾ de
  la Σ) identice. Tastele în ferestre (Word: F12 + Tab / Shift+Tab / `Alt+n` / „Zz” / `Alt+t` / Esc, Ctrl+D + Tab / `Alt+s` / Esc; Excel:
  F12 la fel, Ctrl+1 + Tab / Esc): identice. Singura schimbare: Esc din KeyTips `tasta_acces` → `tasta_esc` (cerută de api §4), acțiunea
  și ținta neschimbate.
- Probele vechi: `runde/5/proba_grav.py` → 0, `runde/4/proba_telefon.py` → 0, `runde/10/proba_grav.py` → 0 (a scris
  `runde/10/proba_grav.json`, mutat în %TEMP%). `git status --short` după: nimic schimbat în `runde/2` … `runde/14` față de dinainte,
  afară de `runde/14/critic_probe/` și `runde/14/critic.md` ale mele.

## 6. [FARA_REFERINTA] (nu se numără GRAV; de dus la proba omului / în runda `acoperire`)
- **Save As cu numele unui fișier existent** salvează peste el fără nicio întrebare (`b2 › saveas_existent`: „Plante_6A_Pop” + Enter →
  `salvare`, `nume_fisier "Plante_6A_Pop.pptx"`), deși m1-l03:125, m2-l09:481 și m2-l10:385 învață „… already exists. Do you want to replace
  the existing file? → Cancel”. Fereastra de confirmare nu e în referință (0 potriviri „already exists / replace” în `uia_powerpoint.json`).
  În fereastra Save As nu e niciun rând `lista:` (fișierele dosarului nu se văd), deci elevul nici nu vede că numele e luat. Cel mai
  important de capturat.
- **Ctrl+Z în note** șterge o singură literă pe apăsare („Gresit aici” → „Gresit aic”; powerpoint.js:1805 `schimba('note', …)` pe fiecare
  tastă), pe când în titlu „abc” se anulează dintr-o dată. Granularitatea reală nu e capturată.
- **✕ → Don't Save pe ultima prezentare**: aplicația reală se închide de tot (m1-l03:215, comentariul powerpoint.js:1100-1101), poligonul
  lasă fereastra goală — partea nedovedită din S1.
- **Open cu un nume care nu există** („Nimic.pptx” + Enter / Open): nimic, fereastra rămâne, fără mesaj (`[presupus] R13-7`,
  powerpoint.js:1170). Fereastra de eroare Windows nu e capturată.
- **Caseta Font cu un nume inexistent** („Arail” + Enter) → revine la fontul vechi; ce face PowerPoint real nu e capturat.
- **După Ctrl+Z** forma / caseta nu mai e aleasă (`selectie_forma null`), deci caseta Font se golește până la un clic nou.
- **Save As din Backstage › Browse, apoi Esc** → înapoi în Backstage › Save As; Save As cu numele gol + Enter / Alt+S → `fara_efect`.
- **Alt singur într-o fereastră**, apoi o literă: litera intră în câmpul cu focus („h” în File name).
- Ordinea Tab și butonul implicit al ferestrelor, literele în listele deschise, felul `tasta_acces` pentru Alt + literă în fereastră
  (presupuse de constructor, de aprobat de Vasile).
- Animation Pane: un efect pus pe With Previous își păstrează numărul „2” în panou; panoul real pentru With Previous nu e capturat.
- Rămân din critic 13 §6: Delete pe o casetă de aspect aleasă, tastarea cu caseta aleasă ca obiect (adaugă la capăt), Tab între obiecte,
  Ctrl+A pe diapozitiv, Alt+F5, Ctrl+S pe prezentarea nesalvată, Enter în File name din „Save your changes”.

## 7. MINOR
- Asistentul (§6.3): Tab în ferestre (`tasta_tab / mutare_focus`) și `Alt+n` (`tasta_acces / focus_camp`) sunt numărate greșeli, deși doar
  mută focusul; Esc din KeyTips nu e numărat, deși lista excepțiilor din §6.3 (api_biblioteca.md:250-251) nu-l are. De pus în §6.3 o
  singură regulă pentru navigare (Esc din KeyTips, Tab, `focus_camp`) și aprobată.
- Pe drumul „Alt, J D, S F” spre o culoare, `D` (fila) și `F` (lista) fac 2 greșeli, iar indiciul vine la lista bună (la fel cu mouse-ul).
- Alt apăsat singur într-o fereastră nu emite niciun eveniment (api §4 „un eveniment pe fiecare gest fizic”, api_biblioteca.md:151).
- Esc în fereastra Open, cu focusul în File name, are ținta `fereastra_app:powerpoint`, nu `camp:nume_fisier` (api §4: „la taste: ținta
  focusului”); în „Save your changes” ținta e corectă.
- Tastarea cu tastatura fizică în note are ținta `fereastra_app:powerpoint`, pe telefon `zona_note`: același gest, ținte diferite.
- `caseta_activa` pune în fiecare eveniment `inainte` / `dupa` textul tastat literă cu literă în File name (lecțiile cer nume de forma
  „Excursia_6A_Pop”); api §8.5 „Nicio dată despre elevi în stare sau în evenimente”. `nume_fisier` avea deja numele după salvare; de ținut
  minte când lecțiile cer numele elevului.
- View › Notes Page → `nesimulat`; rămase din critic 12: listele la +3 px, Layout fără miniaturi, „Pov” tăiat și x = −26 la 360 px, zonele
  < 32 px, fila „Fill” ca text; grosimea conturului (Weight) nu e în `stare()`.

## 8. Ce a trecut
- T1, T2, T3, T4 închise, cu gesturi adevărate: Alt + litera din referință, Tab ținut în fereastră, focusul inițial în câmp în cele 6
  ferestre; „Alt, J D, S F / S O / S O, W”; fontul temei Calibri Light / Calibri pe diapozitiv, miniatură și expunere, aceleași litere după
  „(Headings)”; Esc din KeyTips = `tasta_esc` în toate trei aplicațiile.
- Curățenia din critic 13: literele nu mai intră în diapozitiv cu o listă deschisă; clicul în caseta Font alege tot; `caseta_activa`;
  `zona_note` pe telefon; H pe Home activă; zona de note goală fără text; „Documente” în Open.
- 14 greșeli tipice + Ctrl+Z / Ctrl+Y: starea și ecranul revin exact (afară de note). Închiderea cu Cancel / Esc / Don't Save / Save,
  două și trei prezentări, comenzile gri fără mesaj = referința.
- Ecranul = starea: culoare, font, fundal (pe pixeli), poziții, durată, Animation Pane, notele.
- Toate cele 9 drumuri se duc la capăt; fereastra mică și telefonul păstrează ferestrele atinse după greșeli.
- C: `--verifica` = 0; nicio etichetă sau literă din afara referinței. D: Word și Excel neatinse (dreptunghiuri, pixeli, gesturi,
  ferestre), singura schimbare cerută: `tasta_esc`; probele 5 / 4 / 10 = 0; curățenia făcută.

## 9. Starea de predare a PowerPoint-ului (valul se oprește aici)
- Merge: panglica și filele contextuale cu tastele de acces din referință, inclusiv Shape Format („J D”); cele 6 ferestre din taste și
  din mouse; fontul temei; clipboardul pe obiecte și miniaturi; Ctrl+Z / Ctrl+Y exact pe 14 greșeli tipice; notele, vederile, expunerea;
  Open / Save As / Blank Presentation / două prezentări; telefonul și fereastra mică. Toate cele 9 drumuri de lecție se duc la capăt.
- Rămâne deschis: GRAV S1 (✕ pe PowerPoint fără prezentare dă „aici nu e simulată”, iar „✕ → Don't Save” pe ultima prezentare nu închide
  aplicația, cum spun lecțiile m1-l02, m2-l08, m1-l03).
- De capturat într-o rundă `acoperire` (din PowerPoint real, pe desktopul ascuns): (1) ✕ → Don't Save pe singura prezentare: se închide
  PowerPoint? (2) Save As cu numele unui fișier existent: fereastra „already exists” (titlu, text, butoane, ce face Cancel / Yes);
  (3) Ctrl+Z după un rând tastat în note și în titlu: câți pași; (4) Open cu un nume inexistent: mesajul; (5) Enter în File name din
  „Save your changes” și ordinea Tab în ferestre; (6) dacă forma rămâne aleasă după Ctrl+Z.
- Oracolele (după constructor): O4 mai are la PowerPoint `note`, `stea-ctrl-c-v`, `tragere-forma` fără rezultat real; neverificat de mine.

GRAV_VECHI_DESCHISE: 0
GRAV: 1
